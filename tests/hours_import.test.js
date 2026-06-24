// Integration test for the keystone hours importer (routes/hours_import.js).
// Mounts the routes against the real dev DB, seeds a service area + WO# + job +
// staff, then drives validate → commit and asserts hours land in time_entries
// (service_area_job_id) and roll into the job's actuals. Skips with no
// DATABASE_URL (CI) so it never blocks the suite. The pure matching logic has
// its own DB-free suite in tests/hours_import_match.test.js.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DB = process.env.DATABASE_URL;

test('hours importer: validate + commit → time_entries + recompute', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const USER = { id: null, role: 'admin' };
  const setUser = (req, _res, next) => { req.user = USER; next(); };
  // Fake multer: pull the temp file path from headers so the test avoids real
  // multipart while exercising the handler's real parse/match/commit path.
  const upload = { single: () => (req, _res, next) => {
    req.file = { path: req.headers['x-test-file'], originalname: req.headers['x-test-filename'] || 'Design Timecard.csv' };
    next();
  } };
  require('../routes/hours_import')(app, pool, { requireAdmin: setUser, upload });

  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  const writeCSV = () => {
    const p = path.join(os.tmpdir(), `hours_import_test_${Date.now()}_${Math.random().toString(36).slice(2)}.csv`);
    fs.writeFileSync(p,
      'Name,Date,WO#,Hours,Job Title,Customer\n' +
      'Alice Smith,06/01/2026,WO #16299,8,Design,PSC\n' +
      'Ghost Worker,06/01/2026,16299,4,Design,PSC\n'); // unknown employee → review
    return p;
  };
  const validate = async () => {
    const file = writeCSV();
    const res = await fetch(base + '/api/hours/import/validate', {
      method: 'POST', headers: { 'x-test-file': file, 'x-test-filename': 'Design Timecard.csv' },
    });
    return { status: res.status, json: await res.json() };
  };
  const commit = async (body) => {
    const res = await fetch(base + '/api/hours/import/commit', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: res.status, json: await res.json() };
  };

  let clientId, staffId, saId, jobId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_TEST_HOURS_IMPORT'])).rows[0].id;
    staffId = (await pool.query(`INSERT INTO staff (name) VALUES ($1) RETURNING id`, ['Alice Smith'])).rows[0].id;
    saId = (await pool.query(
      `INSERT INTO service_areas (client_id, name, work_order_number, program, status)
       VALUES ($1,$2,$3,'bau','active') RETURNING id`, [clientId, 'Import Test Area', '16299'])).rows[0].id;
    jobId = (await pool.query(
      `INSERT INTO service_area_jobs (service_area_id, team, billing_type, rate, assigned_staff_id, status)
       VALUES ($1,'design','hourly',100,$2,'started') RETURNING id`, [saId, staffId])).rows[0].id;

    // ── validate ──
    let r = await validate();
    assert.equal(r.status, 200, 'validate ok');
    assert.equal(r.json.summary.total, 2, '2 rows parsed');
    assert.equal(r.json.summary.matched, 1, '1 matched (Alice)');
    assert.equal(r.json.summary.review, 1, '1 review (unknown employee)');
    const aliceRow = r.json.rows.find((x) => x.employee === 'Alice Smith');
    assert.equal(aliceRow.status, 'matched', 'Alice matched');
    assert.equal(aliceRow.service_area_job_id, jobId, 'matched to the design job');
    assert.equal(aliceRow.date, '2026-06-01', 'date parsed');
    assert.equal(aliceRow.hours, 8, 'hours parsed');
    const ghost = r.json.rows.find((x) => x.employee === 'Ghost Worker');
    assert.equal(ghost.status, 'review', 'ghost is review');
    assert.match(ghost.reason, /Unknown employee/, 'ghost reason');

    // ── commit ──
    const c = await commit({ stageId: r.json.stageId });
    assert.equal(c.status, 200, 'commit ok');
    assert.equal(c.json.committed, 1, '1 committed');
    assert.equal(c.json.review_remaining, 1, 'ghost left for review');
    assert.equal(c.json.jobs_recomputed, 1, '1 job recomputed');

    // ── verify DB ──
    const te = await pool.query(`SELECT * FROM time_entries WHERE service_area_job_id = $1`, [jobId]);
    assert.equal(te.rows.length, 1, 'one time entry created');
    assert.equal(Number(te.rows[0].hours), 8, 'entry hours = 8');
    assert.equal(te.rows[0].staff_id, staffId, 'attributed to Alice');
    assert.equal(te.rows[0].project_id, null, 'NOT attributed to a legacy project');

    const job = await pool.query(`SELECT actual_hours, actual_amount FROM service_area_jobs WHERE id = $1`, [jobId]);
    assert.equal(Number(job.rows[0].actual_hours), 8, 'job actual_hours rolled up');
    assert.equal(Number(job.rows[0].actual_amount), 800, 'hourly: 8h * $100 = $800');

    // ── expired/unknown stage → 410 ──
    const expired = await commit({ stageId: '00000000-0000-0000-0000-000000000000' });
    assert.equal(expired.status, 410, 'unknown stage → 410');
  } finally {
    if (jobId) await pool.query(`DELETE FROM time_entries WHERE service_area_job_id = $1`, [jobId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id = $1`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id = $1`, [saId]).catch(() => {});
    if (staffId) await pool.query(`DELETE FROM staff WHERE id = $1`, [staffId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id = $1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
