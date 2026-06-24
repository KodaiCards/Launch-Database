// Integration test for the keystone billing ledger (routes/billing_keystone.js).
// Seeds two concentrators (one hourly, one footage) against the dev DB and proves
// the core ledger behaviors: monthly-hours isolation, progressive footage over
// three months, reconciliation credit when hours are removed, and no double-bill.
// Skips with no DATABASE_URL (CI). Requires migration 0066.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('billing ledger: monthly hours, progressive footage, reconciliation, no double-bill', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/billing_keystone')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body) => {
    const res = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, body: body !== undefined ? JSON.stringify(body) : undefined });
    let json = null; try { json = await res.json(); } catch {}
    return { status: res.status, json };
  };
  // Sum of a service area's non-void invoice totals.
  const billed = async (saId) => Number((await pool.query(
    `SELECT COALESCE(SUM(total_amount),0) t FROM invoices WHERE service_area_id=$1 AND COALESCE(status,'')<>'void'`, [saId])).rows[0].t);

  let clientId, saH, saF, jobH, jobF;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_TEST_BILLING'])).rows[0].id;
    saH = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Hourly Area','bau','active') RETURNING id`, [clientId])).rows[0].id;
    saF = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Footage Area','bau','active') RETURNING id`, [clientId])).rows[0].id;
    jobH = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,status) VALUES ($1,'design','hourly',100,'started') RETURNING id`, [saH])).rows[0].id;
    jobF = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,rate,footage,status) VALUES ($1,'construction','footage',10,0,'started') RETURNING id`, [saF])).rows[0].id;
    const addHours = (jobId, date, hours) => pool.query(`INSERT INTO time_entries (service_area_job_id,entry_date,hours) VALUES ($1,$2,$3)`, [jobId, date, hours]);
    const setFootage = (jobId, ft) => pool.query(`UPDATE service_area_jobs SET footage=$2 WHERE id=$1`, [jobId, ft]);

    // ── A. Monthly hours isolation ──
    await addHours(jobH, '2026-06-15', 8);
    let r = await call('POST', '/api/billing/run', { period: '2026-06', service_area_ids: [saH] });
    assert.equal(r.status, 201);
    assert.equal(r.json.invoices_created, 1, 'June: one invoice');
    assert.equal(Number(r.json.invoices[0].invoice.total_amount), 800, 'June = 8h*100 = 800');

    await addHours(jobH, '2026-07-10', 5);
    r = await call('POST', '/api/billing/run', { period: '2026-07', service_area_ids: [saH] });
    assert.equal(Number(r.json.invoices[0].invoice.total_amount), 500, 'July = 5h*100 = 500, NOT last month');
    assert.equal(await billed(saH), 1300, 'cumulative billed = 1300');

    // ── B. Progressive footage (Jun/Jul/Aug) ──
    await setFootage(jobF, 1000);
    r = await call('POST', '/api/billing/run', { period: '2026-06', service_area_ids: [saF] });
    assert.equal(Number(r.json.invoices[0].invoice.total_amount), 10000, 'June footage 1000*10');
    await setFootage(jobF, 1800);
    r = await call('POST', '/api/billing/run', { period: '2026-07', service_area_ids: [saF] });
    assert.equal(Number(r.json.invoices[0].invoice.total_amount), 8000, 'July delta 800*10');
    await setFootage(jobF, 2400);
    r = await call('POST', '/api/billing/run', { period: '2026-08', service_area_ids: [saF] });
    assert.equal(Number(r.json.invoices[0].invoice.total_amount), 6000, 'Aug final delta 600*10');
    assert.equal(await billed(saF), 24000, 'footage fully billed 2400*10');

    // ── C. Reconciliation credit when hours are removed ──
    await pool.query(`DELETE FROM time_entries WHERE service_area_job_id=$1 AND entry_date='2026-07-10'`, [jobH]); // remove July 5h
    r = await call('POST', '/api/billing/run', { period: '2026-08', service_area_ids: [saH] });
    assert.equal(r.json.invoices_created, 1, 'reconciliation invoice created');
    const recLine = r.json.invoices[0].invoice;
    assert.equal(Number(recLine.total_amount), -500, 'credit of -500 (removed 5h)');
    const items = await pool.query(`SELECT line_kind, amount FROM invoice_items WHERE invoice_id=$1`, [recLine.id]);
    assert.equal(items.rows[0].line_kind, 'reconciliation', 'tagged reconciliation');
    assert.equal(await billed(saH), 800, 'net billed back to 800 (only June 8h stands)');

    // ── D. No double-bill ──
    r = await call('POST', '/api/billing/run', { period: '2026-09', service_area_ids: [saH] });
    assert.equal(r.json.invoices_created, 0, 'nothing left to bill → no invoice');

    // ── E. Worklist + report sanity ──
    await addHours(jobH, '2026-09-05', 3);
    let w = await call('GET', '/api/billing/worklist?period=2026-09&service_area_ids=' + saH);
    assert.equal(w.status, 200);
    assert.equal(w.json.areas[0].lines[0].amount, 300, 'worklist shows Sept 3h*100 billable');
    const rep = await call('GET', '/api/billing/report?group=program');
    assert.equal(rep.status, 200);
    assert.ok(Array.isArray(rep.json.rows), 'report returns rows');

    // ── F. Closed-period tag is informational (does not block billing) ──
    let cl = await call('POST', '/api/billing/periods/2026-09/close', {});
    assert.equal(cl.json.closed, true, 'period closes');
    r = await call('POST', '/api/billing/run', { period: '2026-09', service_area_ids: [saH] });
    assert.equal(r.json.invoices_created, 1, 'closed month still bills (tag is informational)');
  } finally {
    const sas = [saH, saF].filter(Boolean);
    if (sas.length) {
      await pool.query(`DELETE FROM invoice_items WHERE invoice_id IN (SELECT id FROM invoices WHERE service_area_id = ANY($1::uuid[]))`, [sas]).catch(() => {});
      await pool.query(`DELETE FROM invoices WHERE service_area_id = ANY($1::uuid[])`, [sas]).catch(() => {});
      await pool.query(`DELETE FROM time_entries WHERE service_area_job_id IN (SELECT id FROM service_area_jobs WHERE service_area_id = ANY($1::uuid[]))`, [sas]).catch(() => {});
      await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id = ANY($1::uuid[])`, [sas]).catch(() => {});
      await pool.query(`DELETE FROM service_areas WHERE id = ANY($1::uuid[])`, [sas]).catch(() => {});
    }
    await pool.query(`DELETE FROM billing_period_close WHERE period_month='2026-09-01'`).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
