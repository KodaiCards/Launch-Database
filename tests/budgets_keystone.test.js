// Integration test for the reworked budget utilization (routes/budgets.js summary):
// per RUS code, projected = Σ expected of the code's keystone service_area_jobs,
// billed = Σ those jobs' non-void invoice_items. Skips with no DATABASE_URL.
// Requires migration 0073 (service_area_jobs.budget_code_id).

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('budgets: per-code utilization from keystone jobs (billed + projected)', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/budgets')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async (p) => { const r = await fetch(base + p); return { status: r.status, json: await r.json() }; };

  let clientId, ecId, budgetId, codeId, saId, jobA, jobB, invId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_BUDGET'])).rows[0].id;
    ecId = (await pool.query(`INSERT INTO engineering_contracts (client_id,name,program) VALUES ($1,'ZZ Budget EC','rus') RETURNING id`, [clientId])).rows[0].id;
    budgetId = (await pool.query(`INSERT INTO budgets (engineering_contract_id,name,total_amount) VALUES ($1,'Eng budget',15000) RETURNING id`, [ecId])).rows[0].id;
    codeId = (await pool.query(`INSERT INTO budget_codes (budget_id,code,description,allocated_amount) VALUES ($1,'A40-3','Inspection',15000) RETURNING id`, [budgetId])).rows[0].id;
    saId = (await pool.query(`INSERT INTO service_areas (client_id,engineering_contract_id,name,program,status) VALUES ($1,$2,'Budget Area','rus','active') RETURNING id`, [clientId, ecId])).rows[0].id;
    // hourly job: expected from estimated_amount (10000); footage job: footage×rate (200×10 = 2000). Both on the code.
    jobA = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,estimated_amount,budget_code_id,status) VALUES ($1,'inspection','hourly',100,10000,$2,'started') RETURNING id`, [saId, codeId])).rows[0].id;
    jobB = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,footage,budget_code_id,status) VALUES ($1,'design','footage',10,200,$2,'started') RETURNING id`, [saId, codeId])).rows[0].id;
    invId = (await pool.query(`INSERT INTO invoices (client_id,service_area_id,engineering_contract_id,invoice_number,invoice_date,total_amount,status) VALUES ($1,$2,$3,'INV-BUD-T',now()::date,6000,'draft') RETURNING id`, [clientId, saId, ecId])).rows[0].id;
    await pool.query(`INSERT INTO invoice_items (invoice_id,service_area_job_id,description,amount,line_kind) VALUES ($1,$2,'RE hours',6000,'charge')`, [invId, jobA]);

    const r = await get('/api/budgets/' + budgetId + '/summary');
    assert.equal(r.status, 200);
    const code = r.json.codes.find((c) => c.id === codeId);
    assert.equal(code.allocated, 15000);
    assert.equal(code.projected, 12000, '10000 (RE est) + 2000 (footage 200×10)');
    assert.equal(code.billed, 6000, 'one invoice item against jobA');
    assert.equal(code.remaining, 9000, 'allocated − billed');
    assert.equal(code.projected_remaining, 3000, 'allocated − projected');
    assert.equal(code.job_count, 2, 'two keystone jobs on the code');
    assert.equal(r.json.total_billed, 6000);
    assert.equal(r.json.total_projected, 12000);
    assert.equal(r.json.total_projected_remaining, 3000);
  } finally {
    if (invId) await pool.query(`DELETE FROM invoice_items WHERE invoice_id=$1`, [invId]).catch(() => {});
    if (invId) await pool.query(`DELETE FROM invoices WHERE id=$1`, [invId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id=$1`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (codeId) await pool.query(`DELETE FROM budget_codes WHERE id=$1`, [codeId]).catch(() => {});
    if (budgetId) await pool.query(`DELETE FROM budgets WHERE id=$1`, [budgetId]).catch(() => {});
    if (ecId) await pool.query(`DELETE FROM engineering_contracts WHERE id=$1`, [ecId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
