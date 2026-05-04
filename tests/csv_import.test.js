// tests/csv_import.test.js
//
// Smoke test for the Hours CSV import flow (validate → commit).
// Exercises the full /api/hours/csv-validate + /api/hours/csv-commit
// path including the would-modify classification (new / duplicate /
// modify) added in commit 016f662.
//
// Why this exists: the CSV import + AI tools blocks are still inline
// in server.js (~750 + ~1200 lines). Track 1.3 plans to extract them
// into routes/hours_csv.js + routes/ai.js. Without a smoke test, a
// blind extraction could silently break the admin's most-used import
// surface. This file is the safety net.

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, uniqueTag, cleanupAll, baseUrl, pool,
} = require('./_helpers');

const trash = { clients: [], jobs: [], projects: [], staff: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  await close();
});

// Build a tiny CSV in-memory.
function buildCsv(rows) {
  const header = 'name,date,wo,hours,job_title';
  const body = rows.map(r =>
    `${r.name},${r.date},${r.wo},${r.hours},${r.job_title || 'Inspector'}`
  ).join('\n');
  return header + '\n' + body + '\n';
}

// Multipart upload helper. Goes around the request() helper so the
// FormData body isn't JSON.stringify-ed.
async function uploadCsv(token, filename, csvText) {
  const fd = new FormData();
  fd.set('file', new Blob([csvText], { type: 'text/csv' }), filename);
  const r = await fetch(`${baseUrl()}/api/hours/csv-validate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  const text = await r.text();
  if (r.status !== 200) throw new Error(`csv-validate ${r.status}: ${text}`);
  return JSON.parse(text);
}

test('CSV validate + commit happy path inserts time_entries', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-client'), is_rus: true });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'inspection' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({
    name: uniqueTag('csv-proj'), client_id: c.id, job_id: j.id,
    work_order_number: 'CSVWO' + Date.now(),
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Inspector Smith') });
  trash.staff.push(s.id);

  const csv = buildCsv([
    { name: s.name, date: '2026-04-01', wo: p.work_order_number, hours: 8 },
    { name: s.name, date: '2026-04-02', wo: p.work_order_number, hours: 7.5 },
  ]);
  const v = await uploadCsv(token, 'happy.csv', csv);

  assert.ok(v.stage_id, 'stage_id required for commit');
  assert.equal(v.summary.total_rows, 2);
  assert.equal(v.summary.ready_to_import, 2);
  assert.equal(v.summary.invalid, 0);
  // Both rows are net-new (no existing time_entries on this project).
  assert.equal(v.summary.would_add, 2);
  assert.equal(v.summary.would_skip_duplicate, 0);
  assert.equal(v.summary.would_modify, 0);

  const c1 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });
  assert.equal(c1.ok, true);
  assert.equal(c1.inserted, 2);
  assert.equal(c1.skipped_duplicate, 0);

  const { rows: dbRows } = await pool.query(
    `SELECT entry_date::text AS d, hours::float AS h FROM time_entries
       WHERE project_id = $1 ORDER BY entry_date`,
    [p.id]
  );
  assert.equal(dbRows.length, 2);
  assert.equal(dbRows[0].d, '2026-04-01');
  assert.equal(dbRows[0].h, 8);
  assert.equal(dbRows[1].d, '2026-04-02');
  assert.equal(dbRows[1].h, 7.5);
});

test('CSV re-validate flags duplicates; commit skips them', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-dup-client'), is_rus: true });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'inspection' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({
    name: uniqueTag('csv-dup-proj'), client_id: c.id, job_id: j.id,
    work_order_number: 'CSVDUP' + Date.now(),
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Inspector Doe') });
  trash.staff.push(s.id);

  const csv = buildCsv([
    { name: s.name, date: '2026-05-01', wo: p.work_order_number, hours: 8 },
    { name: s.name, date: '2026-05-02', wo: p.work_order_number, hours: 6 },
  ]);
  // First pass: new rows, both insert.
  const v1 = await uploadCsv(token, 'first.csv', csv);
  await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v1.stage_id },
  });

  // Second pass: same CSV — both classify as duplicate.
  const v2 = await uploadCsv(token, 'second.csv', csv);
  assert.equal(v2.summary.would_add, 0);
  assert.equal(v2.summary.would_skip_duplicate, 2);
  assert.equal(v2.summary.would_modify, 0);

  const c2 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v2.stage_id },
  });
  assert.equal(c2.ok, true);
  assert.equal(c2.inserted, 0);
  assert.equal(c2.skipped_duplicate, 2);

  const { rows: dbRows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM time_entries WHERE project_id = $1`, [p.id]
  );
  assert.equal(dbRows[0].n, 2, 'no double-inserts on re-commit');
});

test('CSV row with different hours classifies as modify', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-mod-client'), is_rus: true });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'inspection' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({
    name: uniqueTag('csv-mod-proj'), client_id: c.id, job_id: j.id,
    work_order_number: 'CSVMOD' + Date.now(),
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Inspector Roe') });
  trash.staff.push(s.id);

  // Seed an existing entry at 8h, then upload the same key with 9h.
  // Date must be in the past — csv-validate rejects future dates and the
  // row would never reach the modify classifier.
  await fixtures.timeEntry({
    project_id: p.id, staff_id: s.id, entry_date: '2026-04-15', hours: 8,
    job_title: 'Inspector',
  });

  const csv = buildCsv([
    { name: s.name, date: '2026-04-15', wo: p.work_order_number, hours: 9 },
  ]);
  const v = await uploadCsv(token, 'modify.csv', csv);
  assert.equal(v.summary.would_add, 0);
  assert.equal(v.summary.would_skip_duplicate, 0);
  assert.equal(v.summary.would_modify, 1, 'row should classify as modify (hours differ)');
});

test('CSV row with same staff/project/date but different job is "new"', async () => {
  // Match key now includes job_title — two entries with different jobs
  // on the same day for the same person/project are distinct, not a
  // duplicate or modify. Owner-confirmed policy 2026-05-04.
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-job-client'), is_rus: true });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'inspection' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({
    name: uniqueTag('csv-job-proj'), client_id: c.id, job_id: j.id,
    work_order_number: 'CSVJOB' + Date.now(),
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Inspector Poe') });
  trash.staff.push(s.id);

  // Seed an existing entry under one job title. Date must be in the past
  // for csv-validate to accept the row.
  await fixtures.timeEntry({
    project_id: p.id, staff_id: s.id, entry_date: '2026-04-20', hours: 4,
    job_title: 'Inspector',
  });

  // CSV row on the SAME day under a DIFFERENT job title — separate entry.
  const csv = buildCsv([
    { name: s.name, date: '2026-04-20', wo: p.work_order_number, hours: 4, job_title: 'Resident Engineer' },
  ]);
  const v = await uploadCsv(token, 'job-distinct.csv', csv);
  assert.equal(v.summary.would_add, 1, 'different job on same day = new entry');
  assert.equal(v.summary.would_skip_duplicate, 0);
  assert.equal(v.summary.would_modify, 0);
});
