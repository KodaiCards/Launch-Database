// tests/csv_import.test.js
//
// Smoke test for the Hours CSV import flow (validate → commit).
// Exercises the full /api/hours/csv-validate + /api/hours/csv-commit
// path including the would-modify classification (new / duplicate /
// modify) added in commit 016f662.
//
// Why this exists: the CSV import block was extracted from server.js
// into routes/hours_csv.js. Without a smoke test, that extraction could
// silently break the admin's most-used import surface. This file is the
// safety net.

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

// Variant with a customer column — emulates the timeclock-app export
// format. Used by the billed-vs-unbilled tests below.
function buildCsvWithCustomer(rows) {
  const header = 'name,date,customer,wo,hours,job_title';
  // CSV-escape the customer value: it can contain commas (e.g.
  // "Butler Inspecting WO #16295" doesn't, but a real customer might).
  const esc = v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const body = rows.map(r =>
    `${esc(r.name)},${r.date},${esc(r.customer || '')},${r.wo || ''},${r.hours},${r.job_title || 'Inspector'}`
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
  const c = await fixtures.client({ name: uniqueTag('csv-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
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
  const c = await fixtures.client({ name: uniqueTag('csv-dup-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
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
  const c = await fixtures.client({ name: uniqueTag('csv-mod-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
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
  const c = await fixtures.client({ name: uniqueTag('csv-job-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
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

// ─── Billed vs Unbilled hours (migration 0029) ─────────────────────────
//
// Timeclock app exports a `customer` column. When the tech picked
// "Miscellaneous", "Permitting", or a bare "WO #N" with no customer
// prefix, the row is overhead — not pinned to a real project. The
// importer must persist it with project_id=NULL, is_billable=FALSE, and
// the right unbilled_category, while billed rows on the same CSV
// continue to land on their matching project.

const { classifyUnbilled } = require('../routes/hours_csv')._helpers;

test('classifyUnbilled returns the right bucket for each customer label', () => {
  // Real customer prefix + WO → billed.
  assert.deepEqual(classifyUnbilled('Butler Inspecting WO #16295'),
    { unbilled: false, category: null });
  // Pure placeholder customers → unbilled.
  assert.deepEqual(classifyUnbilled('Miscellaneous'),
    { unbilled: true, category: 'misc' });
  assert.deepEqual(classifyUnbilled('miscellaneous'),
    { unbilled: true, category: 'misc' });
  assert.deepEqual(classifyUnbilled('MISC'),
    { unbilled: true, category: 'misc' });
  assert.deepEqual(classifyUnbilled('Permitting'),
    { unbilled: true, category: 'permitting' });
  // Bare WO label, no customer prefix → unbilled.
  assert.deepEqual(classifyUnbilled('WO #16295'),
    { unbilled: true, category: 'wo_only' });
  assert.deepEqual(classifyUnbilled('WO 16295'),
    { unbilled: true, category: 'wo_only' });
  assert.deepEqual(classifyUnbilled('WO16295'),
    { unbilled: true, category: 'wo_only' });
  // Empty / missing → billed (legacy CSVs without a customer column
  // shouldn't accidentally tag everything unbilled).
  assert.deepEqual(classifyUnbilled(''),
    { unbilled: false, category: null });
  assert.deepEqual(classifyUnbilled(null),
    { unbilled: false, category: null });
});

test('CSV with customer column: unbilled rows persist with project_id=NULL and is_billable=FALSE', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-unb-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  // Production WOs are pure-numeric (the timeclock's "WO #16295" pattern).
  // Use a numeric test WO so the bare-WO classifier (`^WO\s*[#-]?\s*\d+$`)
  // matches as it would in real data.
  const wo = String(900000000 + (Date.now() % 99999999));
  const p = await fixtures.project({
    name: uniqueTag('csv-unb-proj'), client_id: c.id, job_id: j.id,
    work_order_number: wo,
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Tech Splice') });
  trash.staff.push(s.id);

  // 4 rows: 1 billed (real customer prefix) + 3 unbilled (one per
  // unbilled bucket). Importer should commit all 4.
  const csv = buildCsvWithCustomer([
    { name: s.name, date: '2026-04-01', customer: `Butler Inspecting WO #${wo}`, wo, hours: 8 },
    { name: s.name, date: '2026-04-02', customer: 'Miscellaneous', wo: '',  hours: 2 },
    { name: s.name, date: '2026-04-03', customer: 'Permitting',    wo: '',  hours: 3 },
    { name: s.name, date: '2026-04-04', customer: `WO #${wo}`,      wo,     hours: 1 },
  ]);
  const v = await uploadCsv(token, 'unbilled.csv', csv);

  assert.equal(v.summary.total_rows, 4, 'all 4 rows are valid');
  assert.equal(v.summary.invalid, 0, 'no rows fail validation');
  assert.equal(v.summary.unbilled_rows, 3, '3 rows tagged unbilled');
  assert.equal(v.detected_columns.customer, 'customer', 'customer column detected');

  const c1 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });
  assert.equal(c1.ok, true);
  assert.equal(c1.inserted, 4, 'all 4 rows committed (3 unbilled + 1 billed)');

  // The billed row landed on the project.
  const { rows: billedRows } = await pool.query(
    `SELECT entry_date::text AS d, hours::float AS h, is_billable, unbilled_category
       FROM time_entries WHERE project_id = $1 ORDER BY entry_date`, [p.id]);
  assert.equal(billedRows.length, 1);
  assert.equal(billedRows[0].is_billable, true);
  assert.equal(billedRows[0].unbilled_category, null);
  assert.equal(billedRows[0].h, 8);

  // The 3 unbilled rows landed with project_id=NULL.
  const { rows: unbilledRows } = await pool.query(
    `SELECT entry_date::text AS d, hours::float AS h, is_billable, unbilled_category
       FROM time_entries
       WHERE staff_id = $1 AND project_id IS NULL AND is_billable = FALSE
       ORDER BY entry_date`, [s.id]);
  assert.equal(unbilledRows.length, 3);
  assert.equal(unbilledRows[0].unbilled_category, 'misc');
  assert.equal(unbilledRows[0].h, 2);
  assert.equal(unbilledRows[1].unbilled_category, 'permitting');
  assert.equal(unbilledRows[1].h, 3);
  assert.equal(unbilledRows[2].unbilled_category, 'wo_only');
  assert.equal(unbilledRows[2].h, 1);

  // Cleanup the unbilled rows directly — fixtures.cleanupAll only tracks
  // project-attached entries via the project trash.
  await pool.query(`DELETE FROM time_entries WHERE staff_id = $1 AND project_id IS NULL`, [s.id]);
});

test('Re-importing the same CSV with unbilled rows skips them as duplicates (no dups)', async () => {
  // Regression: unbilled rows have project_id=NULL, so the legacy
  // dedup path (which keys on project_id) classified them as 'new'
  // forever — re-importing piled duplicates. The fix adds an unbilled-
  // aware match key (staff|UNB:<category>|date|job) and a separate
  // lookup for project_id IS NULL, so a second pass classifies them as
  // duplicates and the commit step skips them.
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-unb-dup-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const wo = String(910000000 + (Date.now() % 99999999));
  const p = await fixtures.project({
    name: uniqueTag('csv-unb-dup-proj'), client_id: c.id, job_id: j.id,
    work_order_number: wo,
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Dup Tech') });
  trash.staff.push(s.id);

  const csv = buildCsvWithCustomer([
    { name: s.name, date: '2026-02-01', customer: `Real Customer WO #${wo}`, wo, hours: 8 },
    { name: s.name, date: '2026-02-02', customer: 'Miscellaneous', wo: '', hours: 2 },
    { name: s.name, date: '2026-02-03', customer: 'Permitting',    wo: '', hours: 3 },
  ]);

  // First pass — all 3 rows commit.
  const v1 = await uploadCsv(token, 'unb-dup-1.csv', csv);
  assert.equal(v1.summary.would_add, 3);
  assert.equal(v1.summary.would_skip_duplicate, 0);
  await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v1.stage_id },
  });

  // Second pass — same CSV. All 3 should classify as duplicate.
  const v2 = await uploadCsv(token, 'unb-dup-2.csv', csv);
  assert.equal(v2.summary.would_add, 0, 'no rows should be net-new on re-import');
  assert.equal(v2.summary.would_skip_duplicate, 3, 'all 3 (1 billed + 2 unbilled) should dedup');

  const c2 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v2.stage_id },
  });
  assert.equal(c2.inserted, 0);
  assert.equal(c2.skipped_duplicate, 3);

  // Sanity check — count by category, no duplication on disk.
  const { rows: counts } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE is_billable = TRUE)::int  AS billed,
       COUNT(*) FILTER (WHERE is_billable = FALSE AND unbilled_category = 'misc')::int AS misc,
       COUNT(*) FILTER (WHERE is_billable = FALSE AND unbilled_category = 'permitting')::int AS perm
     FROM time_entries WHERE staff_id = $1`, [s.id]);
  assert.equal(counts[0].billed, 1);
  assert.equal(counts[0].misc, 1);
  assert.equal(counts[0].perm, 1);

  await pool.query(`DELETE FROM time_entries WHERE staff_id = $1 AND project_id IS NULL`, [s.id]);
});

test('Re-importing unbilled row with different hours classifies as modify', async () => {
  // Sister case to the dedup test: same staff+date+category but the
  // hours changed. Should classify as 'modify', not 'new' or 'duplicate'.
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-unb-mod-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const s = await fixtures.staff({ name: uniqueTag('Mod Tech') });
  trash.staff.push(s.id);

  // Seed an existing unbilled row directly.
  await pool.query(
    `INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, is_billable, unbilled_category)
     VALUES (NULL, $1, '2026-02-15', 2, 'Inspector', FALSE, 'misc')`, [s.id]);

  const csv = buildCsvWithCustomer([
    { name: s.name, date: '2026-02-15', customer: 'Miscellaneous', wo: '', hours: 4 },
  ]);
  const v = await uploadCsv(token, 'unb-modify.csv', csv);
  assert.equal(v.summary.would_add, 0);
  assert.equal(v.summary.would_skip_duplicate, 0);
  assert.equal(v.summary.would_modify, 1, 'unbilled row with new hours should classify as modify');

  await pool.query(`DELETE FROM time_entries WHERE staff_id = $1`, [s.id]);
});

test('Hours utilization endpoint segments billed vs unbilled correctly', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('csv-util-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const wo = 'CSVUTIL' + Date.now();
  const p = await fixtures.project({
    name: uniqueTag('csv-util-proj'), client_id: c.id, job_id: j.id,
    work_order_number: wo,
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Util Tech') });
  trash.staff.push(s.id);

  // 10 billed hours + 4 unbilled hours, all in 2026-03 for this staff.
  const csv = buildCsvWithCustomer([
    { name: s.name, date: '2026-03-10', customer: `RealCo WO #${wo}`, wo, hours: 10 },
    { name: s.name, date: '2026-03-11', customer: 'Miscellaneous', wo: '', hours: 4 },
  ]);
  const v = await uploadCsv(token, 'util.csv', csv);
  await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });

  const util = await requestJson('GET',
    `/api/revenue/hours-utilization?year=2026&month=3&staff_id=${s.id}`, { token });
  assert.equal(util.total_hours, 14);
  assert.equal(util.billed_hours, 10);
  assert.equal(util.unbilled_hours, 4);
  assert.ok(Math.abs(util.billed_pct - 71.4) < 0.2, `expected ~71.4%, got ${util.billed_pct}`);
  assert.equal(util.unbilled_breakdown.misc, 4);

  await pool.query(`DELETE FROM time_entries WHERE staff_id = $1 AND project_id IS NULL`, [s.id]);
});
