// Integration test for revenue projections (routes/projections.js). Seeds a RUS
// EC with a budget, a service area with an hourly + a close-out footage job, and
// a partial invoice, then checks per-SA projection, EC budget burn, the rollup,
// and the map data endpoint. Skips with no DATABASE_URL. Requires migration 0067.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('projections: mileage allocation for hourly (Carter worked example)', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/projections')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async (p) => { const r = await fetch(base + p); return { status: r.status, json: await r.json() }; };

  let clientId, ecId, saId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_MILEAGE'])).rows[0].id;
    // 10 contract miles, $100k for inspecting.
    ecId = (await pool.query(`INSERT INTO engineering_contracts (client_id,name,program,total_miles) VALUES ($1,'ZZ Mileage EC','rus',10) RETURNING id`, [clientId])).rows[0].id;
    await pool.query(`INSERT INTO contract_allocations (engineering_contract_id,discipline,budget_amount) VALUES ($1,'inspection',100000)`, [ecId]);
    // a 2.5-mile service area on that EC.
    saId = (await pool.query(`INSERT INTO service_areas (client_id,engineering_contract_id,name,program,status,miles) VALUES ($1,$2,'2.5mi Area','rus','active',2.5) RETURNING id`, [clientId, ecId])).rows[0].id;

    const r = await get(`/api/projections/service-area/${saId}/mileage`);
    assert.equal(r.status, 200);
    const eng = r.json.engineering;
    assert.equal(eng.remaining_miles, 10, 'no finalized SAs → all 10 miles remain');
    const insp = eng.disciplines.find((d) => d.discipline === 'inspection');
    assert.equal(insp.per_mile_rate, 10000, '$100k ÷ 10 mi = $10k/mile');
    assert.equal(insp.sa_expected, 25000, '2.5 mi × $10k = $25k');
    assert.equal(eng.sa_hourly_expected, 25000);
  } finally {
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (ecId) await pool.query(`DELETE FROM engineering_contracts WHERE id=$1`, [ecId]).catch(() => {}); // cascades allocations
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});

test('projections: per-SA, EC budget burn, rollup, map data', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/projections')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async (p) => { const r = await fetch(base + p); return { status: r.status, json: await r.json() }; };

  let clientId, ecId, budgetId, saId, jobRE, jobPR, invId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_TEST_PROJ'])).rows[0].id;
    ecId = (await pool.query(`INSERT INTO engineering_contracts (client_id,name,program) VALUES ($1,'ZZ Proj EC','rus') RETURNING id`, [clientId])).rows[0].id;
    budgetId = (await pool.query(`INSERT INTO budgets (engineering_contract_id,name,total_amount) VALUES ($1,'Eng budget',100000) RETURNING id`, [ecId])).rows[0].id;
    saId = (await pool.query(`INSERT INTO service_areas (client_id,engineering_contract_id,name,program,status) VALUES ($1,$2,'Proj Area','rus','active') RETURNING id`, [clientId, ecId])).rows[0].id;
    jobRE = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,estimated_amount,bill_trigger,status) VALUES ($1,'inspection','hourly',100,48000,'progressive','started') RETURNING id`, [saId])).rows[0].id;
    jobPR = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,footage,bill_trigger,status) VALUES ($1,'construction','footage',85,10,'completed','potential') RETURNING id`, [saId])).rows[0].id;

    const periodStart = (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10); })();
    invId = (await pool.query(
      `INSERT INTO invoices (client_id,service_area_id,engineering_contract_id,invoice_number,invoice_date,billing_period_start,total_amount,status)
       VALUES ($1,$2,$3,'INV-PROJ-T',now()::date,$4,22000,'draft') RETURNING id`, [clientId, saId, ecId, periodStart])).rows[0].id;
    await pool.query(`INSERT INTO invoice_items (invoice_id,service_area_job_id,description,amount,line_kind) VALUES ($1,$2,'RE hours',22000,'charge')`, [invId, jobRE]);

    // ── per-SA projection ──
    let r = await get('/api/projections/service-area/' + saId);
    assert.equal(r.status, 200);
    assert.equal(r.json.totals.projected_total, 48850, 'expected = 48000 (RE est) + 850 (plant records 10*85)');
    assert.equal(r.json.totals.billed, 22000, 'billed from invoice item');
    assert.equal(r.json.totals.remaining, 26850, 'remaining = projected - billed');
    const pr = r.json.jobs.find((j) => j.job_id === jobPR);
    assert.equal(pr.expected, 850, 'footage job expected = footage*rate');
    assert.equal(pr.bill_trigger, 'completed', 'plant records is a completed-trigger job');

    // link both jobs to a RUS budget code so the EC overlay breaks down per code (#2)
    const codeId = (await pool.query(`INSERT INTO budget_codes (budget_id,code,allocated_amount) VALUES ($1,'A40-3',60000) RETURNING id`, [budgetId])).rows[0].id;
    await pool.query(`UPDATE service_area_jobs SET budget_code_id=$1 WHERE service_area_id=$2`, [codeId, saId]);

    // ── EC budget burn ──
    r = await get('/api/projections/ec/' + ecId);
    assert.equal(r.json.budget, 100000, 'EC engineering budget');
    assert.equal(r.json.projected, 48850, 'EC projected = Σ expected');
    assert.equal(r.json.billed, 22000);
    assert.equal(r.json.projected_remaining, 26850);
    assert.ok(r.json.burn_rate_monthly > 0, 'burn rate computed from elapsed months');
    assert.ok(r.json.months_elapsed >= 3, 'about 3 months elapsed since first invoice');
    const bcode = (r.json.budget_codes || []).find((c) => c.code === 'A40-3');
    assert.ok(bcode, 'EC overlay includes the budget code (#2 budgets→projections)');
    assert.equal(bcode.allocated, 60000);
    assert.equal(bcode.billed, 22000, 'code billed from its linked jobs');
    assert.equal(bcode.projected, 48850, 'code projected from its linked jobs');

    // ── rollup by program ──
    r = await get('/api/projections?group=program');
    const rus = r.json.rows.find((x) => x.key === 'rus');
    assert.ok(rus && rus.projected_total >= 48850, 'rus rollup includes this SA');

    // ── map data ──
    r = await get('/api/map/service-areas');
    assert.ok(r.json.find((x) => x.id === saId), 'map data includes the service area');
    // ── map-fed construction block + combined (the loop into projections) ──
    {
      const PLAN = 'projmap_' + Date.now();
      const cc2 = (await pool.query(`INSERT INTO construction_contracts (client_id,name,total_budget) VALUES ($1,'ZZ Proj CC',1500) RETURNING id`, [clientId])).rows[0].id;
      await pool.query(`INSERT INTO cost_catalog (construction_contract_id,item_key,label,unit_price) VALUES ($1,'handhole','Handhole',200)`, [cc2]);
      const pts = {}; for (let i = 0; i < 10; i++) pts['h' + i] = { ptype: 'handhole', status: i < 3 ? 'asBuilt' : 'proposed' };
      await pool.query(`INSERT INTO map_store (store_key,value) VALUES ($1,$2)`, ['frm_pts_' + PLAN, JSON.stringify(pts)]);
      await pool.query(`UPDATE service_areas SET map_plan_id=$1, construction_contract_id=$2 WHERE id=$3`, [PLAN, cc2, saId]);
      try {
        const r = await get('/api/projections/service-area/' + saId);
        assert.equal(r.json.construction.linked, true, 'SA construction is map-linked');
        assert.equal(r.json.construction.expected, 2000, '10 handholes × 200');
        assert.equal(r.json.construction.completed, 600, '3 built × 200');
        assert.equal(r.json.construction.budget, 1500);
        assert.equal(r.json.construction.over_budget, 500, 'expected 2000 over the 1500 CC budget');
        // engineering = non-construction-team jobs only (RE est 48000); plant-records (construction team) excluded.
        assert.equal(r.json.combined.engineering_expected, 48000, 'construction-team job not counted as engineering');
        assert.equal(r.json.combined.construction_expected, 2000);
        assert.equal(r.json.combined.projected_total, 50000, 'engineering + map construction');
      } finally {
        await pool.query(`UPDATE service_areas SET map_plan_id=NULL, construction_contract_id=NULL WHERE id=$1`, [saId]).catch(() => {});
        await pool.query(`DELETE FROM map_store WHERE store_key=$1`, ['frm_pts_' + PLAN]).catch(() => {});
        await pool.query(`DELETE FROM construction_contracts WHERE id=$1`, [cc2]).catch(() => {});
      }
    }
  } finally {
    if (invId) await pool.query(`DELETE FROM invoice_items WHERE invoice_id=$1`, [invId]).catch(() => {});
    if (invId) await pool.query(`DELETE FROM invoices WHERE id=$1`, [invId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id=$1`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (budgetId) await pool.query(`DELETE FROM budget_codes WHERE budget_id=$1`, [budgetId]).catch(() => {});
    if (budgetId) await pool.query(`DELETE FROM budgets WHERE id=$1`, [budgetId]).catch(() => {});
    if (ecId) await pool.query(`DELETE FROM engineering_contracts WHERE id=$1`, [ecId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
