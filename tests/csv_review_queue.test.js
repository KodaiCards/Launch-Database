// tests/csv_review_queue.test.js
//
// Tests for the CSV importer tiered matching + review queue (Wave 7).
//
// Tier 1: WO# match via recursive CTE (inherited from parent rollup)
// Tier 2: client + job name case-insensitive match (no WO on the row)
// Tier 3: unmatched rows → csv_review_queue (no silent skip, no auto-create)
//
// Also covers:
//   POST /api/hours/csv-queue-unmatched   — persist unmatched rows
//   GET  /api/csv-review-queue            — list pending rows
//   POST /api/csv-review-queue/:id/match  — assign project, insert time_entry
//   POST /api/csv-review-queue/:id/discard — mark discarded

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, uniqueTag, cleanupAll, baseUrl, pool,
} = require('./_helpers');

const trash = { clients: [], jobs: [], projects: [], staff: [], csv_review_queue: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  if (trash.csv_review_queue.length) {
    try {
      await pool.query(`DELETE FROM csv_review_queue WHERE id = ANY($1::uuid[])`, [trash.csv_review_queue]);
    } catch {}
  }
  await cleanupAll(trash);
  await close();
});

// Build a CSV with WO# column
function buildCsv(rows) {
  const header = 'name,date,wo,hours,job_title';
  const body = rows.map(r =>
    `${r.name},${r.date},${r.wo || ''},${r.hours},${r.job_title || 'Inspector'}`
  ).join('\n');
  return header + '\n' + body + '\n';
}

// Build a CSV that includes a customer column (timeclock export format)
// but no WO#. Used to exercise Tier 2 and Tier 3 paths.
function buildCsvNoWo(rows) {
  const header = 'name,date,customer,wo,hours,job_title';
  const esc = v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const body = rows.map(r =>
    [esc(r.name), r.date, esc(r.customer || ''), '', r.hours, esc(r.job_title || 'Inspector')].join(',')
  ).join('\n');
  return header + '\n' + body + '\n';
}

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

// ─── Tier 1: WO# match ────────────────────────────────────────────────────

test('Tier 1: row with matching WO# is imported directly (no queue)', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('t1-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Inspector'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const wo = 'T1WO' + Date.now();
  const p = await fixtures.project({
    name: uniqueTag('t1-proj'), client_id: c.id, job_id: j.id,
    work_order_number: wo,
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('T1 Smith') });
  trash.staff.push(s.id);

  const v = await uploadCsv(token, 't1.csv', buildCsv([
    { name: s.name, date: '2026-03-01', wo, hours: 8 },
  ]));

  assert.ok(v.stage_id, 'stage_id present');
  assert.equal(v.summary.rows_matched_tier1, 1);
  assert.equal(v.summary.rows_unmatched, 0);

  const c1 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });
  assert.equal(c1.ok, true);
  assert.equal(c1.inserted, 1);

  const { rows } = await pool.query(
    'SELECT hours::float AS h FROM time_entries WHERE project_id = $1',
    [p.id]
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].h, 8);
});

// ─── Tier 2: name match ───────────────────────────────────────────────────

test('Tier 2: row with no WO# but matching job name is imported directly', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('t2-client') });
  trash.clients.push(c.id);
  const jobName = uniqueTag('UniqueJobT2');
  const j = await fixtures.job({ name: jobName, default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  // Project has no WO# — only matchable by name
  const p = await fixtures.project({
    name: uniqueTag('t2-proj'), client_id: c.id, job_id: j.id,
  });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('T2 Jones') });
  trash.staff.push(s.id);

  const csv = buildCsvNoWo([
    { name: s.name, date: '2026-03-02', customer: 'SomeCustomer', hours: 6, job_title: jobName },
  ]);
  const v = await uploadCsv(token, 't2.csv', csv);

  assert.equal(v.summary.rows_matched_tier2, 1, 'should match via Tier 2 (name)');
  assert.equal(v.summary.rows_unmatched, 0);

  const c1 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });
  assert.equal(c1.ok, true);
  assert.equal(c1.inserted, 1);

  const { rows } = await pool.query(
    'SELECT hours::float AS h FROM time_entries WHERE project_id = $1',
    [p.id]
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].h, 6);
});

test('Tier 2: case-insensitive job name match', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('t2ci-client') });
  trash.clients.push(c.id);
  const jobNameLower = uniqueTag('casetest').toLowerCase();
  const j = await fixtures.job({ name: jobNameLower, default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({ name: uniqueTag('t2ci-proj'), client_id: c.id, job_id: j.id });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('T2CI Staff') });
  trash.staff.push(s.id);

  // CSV uses UPPER-CASED job title — should still match
  const csv = buildCsvNoWo([
    { name: s.name, date: '2026-03-03', customer: 'Doesn\'t matter', hours: 4, job_title: jobNameLower.toUpperCase() },
  ]);
  const v = await uploadCsv(token, 't2ci.csv', csv);

  assert.equal(v.summary.rows_matched_tier2, 1, 'case-insensitive name match');
  assert.equal(v.summary.rows_unmatched, 0);
});

// ─── Tier 3: unmatched → review queue ─────────────────────────────────────

test('Tier 3: unmatched row appears in summary and can be queued', async () => {
  const token = await adminLogin();
  const s = await fixtures.staff({ name: uniqueTag('T3 Nobody') });
  trash.staff.push(s.id);

  // No project exists for this WO — should be unmatched
  const csv = buildCsv([
    { name: s.name, date: '2026-03-04', wo: 'NOMATCHWHATSOEVER_' + Date.now(), hours: 5 },
  ]);
  const v = await uploadCsv(token, 't3.csv', csv);

  assert.equal(v.summary.rows_unmatched, 1, 'should report 1 unmatched row');
  assert.ok(Array.isArray(v.unmatched_rows), 'unmatched_rows preview array present');
  assert.equal(v.unmatched_rows.length, 1);

  // Queue the unmatched rows
  const q = await requestJson('POST', '/api/hours/csv-queue-unmatched', {
    token,
    body: { stage_id: v.stage_id, csv_filename: 't3.csv' },
  });
  assert.ok(q.queued >= 1, `expected at least 1 queued, got ${q.queued}`);

  // They should now appear in the review queue
  const list = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  assert.ok(list.total >= 1, 'review queue has pending rows');
  const found = list.rows.find(r => r.raw_row && r.raw_row.name === s.name);
  assert.ok(found, 'unmatched row appears in queue');
  trash.csv_review_queue.push(found.id);
});

test('Unmatched row: discard removes it from pending queue', async () => {
  const token = await adminLogin();
  const s = await fixtures.staff({ name: uniqueTag('T3 Discard') });
  trash.staff.push(s.id);

  const csv = buildCsv([
    { name: s.name, date: '2026-03-05', wo: 'DISCARD_' + Date.now(), hours: 3 },
  ]);
  const v = await uploadCsv(token, 't3d.csv', csv);
  await requestJson('POST', '/api/hours/csv-queue-unmatched', {
    token, body: { stage_id: v.stage_id, csv_filename: 't3d.csv' },
  });

  const list = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  const found = list.rows.find(r => r.raw_row && r.raw_row.name === s.name);
  assert.ok(found, 'row present in queue before discard');

  const d = await requestJson('POST', `/api/csv-review-queue/${found.id}/discard`, {
    token, body: { notes: 'test discard' },
  });
  assert.equal(d.ok, true);

  // Should no longer appear in pending list
  const list2 = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  const stillPending = list2.rows.find(r => r.id === found.id);
  assert.equal(stillPending, undefined, 'discarded row not in pending list');
});

test('Unmatched row: match assigns project and inserts time_entry', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('t3m-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Matcher'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const p = await fixtures.project({ name: uniqueTag('t3m-proj'), client_id: c.id, job_id: j.id });
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('T3 Matcher') });
  trash.staff.push(s.id);

  const csv = buildCsv([
    { name: s.name, date: '2026-03-06', wo: 'MATCHME_' + Date.now(), hours: 7 },
  ]);
  const v = await uploadCsv(token, 't3m.csv', csv);
  await requestJson('POST', '/api/hours/csv-queue-unmatched', {
    token, body: { stage_id: v.stage_id, csv_filename: 't3m.csv' },
  });

  const list = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  const found = list.rows.find(r => r.raw_row && r.raw_row.name === s.name);
  assert.ok(found, 'row present in queue');

  // Assign it to the project
  const m = await requestJson('POST', `/api/csv-review-queue/${found.id}/match`, {
    token, body: { project_id: p.id },
  });
  assert.equal(m.ok, true);

  // time_entry should be inserted
  const { rows } = await pool.query(
    'SELECT hours::float AS h, entry_date::text AS d FROM time_entries WHERE project_id = $1',
    [p.id]
  );
  assert.equal(rows.length, 1, 'time_entry inserted after match');
  assert.equal(rows[0].h, 7);
  assert.equal(rows[0].d, '2026-03-06');

  // Row should no longer be pending
  const list2 = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  const stillPending = list2.rows.find(r => r.id === found.id);
  assert.equal(stillPending, undefined, 'matched row not in pending list');
});

// ─── Ongoing project month attribution ────────────────────────────────────

test('Ongoing project: CSV rows attributed to entry_date month (no distortion)', async () => {
  const token = await adminLogin();
  const c = await fixtures.client({ name: uniqueTag('ongoing-client') });
  trash.clients.push(c.id);
  const j = await fixtures.job({ name: uniqueTag('Ongoing Job'), default_billing_type: 'hourly', team: 'construction' });
  trash.jobs.push(j.id);
  const wo = 'ONG' + Date.now();
  const p = await fixtures.project({
    name: uniqueTag('ongoing-proj'), client_id: c.id, job_id: j.id,
    work_order_number: wo, status: 'active',
  });
  // Mark is_ongoing via direct DB update (the toggle endpoint can also be used)
  await pool.query('UPDATE projects SET is_ongoing = TRUE WHERE id = $1', [p.id]);
  trash.projects.push(p.id);
  const s = await fixtures.staff({ name: uniqueTag('Ongoing Staff') });
  trash.staff.push(s.id);

  const csv = buildCsv([
    { name: s.name, date: '2026-01-15', wo, hours: 8 },
    { name: s.name, date: '2026-02-20', wo, hours: 6 },
    { name: s.name, date: '2026-03-10', wo, hours: 4 },
  ]);
  const v = await uploadCsv(token, 'ongoing.csv', csv);
  assert.equal(v.summary.rows_matched_tier1, 3);

  const c1 = await requestJson('POST', '/api/hours/csv-commit', {
    token, body: { stage_id: v.stage_id },
  });
  assert.equal(c1.inserted, 3);

  // Each entry should preserve its original date (month attribution is by entry_date)
  const { rows } = await pool.query(
    `SELECT entry_date::text AS d, hours::float AS h
       FROM time_entries WHERE project_id = $1 ORDER BY entry_date`,
    [p.id]
  );
  assert.equal(rows.length, 3);
  assert.equal(rows[0].d, '2026-01-15');
  assert.equal(rows[1].d, '2026-02-20');
  assert.equal(rows[2].d, '2026-03-10');
  assert.equal(rows[0].h, 8);
  assert.equal(rows[1].h, 6);
  assert.equal(rows[2].h, 4);
});

// ─── Review queue list endpoint ───────────────────────────────────────────

test('GET /api/csv-review-queue returns total count and rows', async () => {
  const token = await adminLogin();
  const list = await requestJson('GET', '/api/csv-review-queue?status=pending&limit=10', { token });
  assert.ok(typeof list.total === 'number', 'total is a number');
  assert.ok(Array.isArray(list.rows), 'rows is an array');
  assert.ok(list.rows.length <= 10, 'limit respected');
});

test('GET /api/csv-review-queue rejects non-admin', async () => {
  // No token at all — should 401
  const r = await fetch(`${baseUrl()}/api/csv-review-queue?status=pending`);
  assert.equal(r.status, 401, 'unauthenticated request rejected');
});

// ─── normalizeWO leading-zeros edge case ──────────────────────────────────

test('normalizeWO: zero-padded and bare WO# normalize to same value', () => {
  const { normalizeWO } = require('../routes/hours_csv')._helpers;
  assert.equal(normalizeWO('00016299'), normalizeWO('16299'), 'leading zeros stripped');
  assert.equal(normalizeWO('00016299'), '16299');
  assert.equal(normalizeWO('0'), '0', 'lone zero preserved');
  assert.equal(normalizeWO('WO-00016299'), '16299', 'WO prefix + leading zeros stripped');
});

// ─── /match backend leaf-only validation ──────────────────────────────────

test('/match rejects assignment to a rollup folder', async () => {
  const token = await adminLogin();
  const s = await fixtures.staff({ name: uniqueTag('T3 RollupGuard') });
  trash.staff.push(s.id);

  // Create an unmatched queue row
  const csv = buildCsv([
    { name: s.name, date: '2026-03-07', wo: 'ROLLUPGUARD_' + Date.now(), hours: 4 },
  ]);
  const v = await uploadCsv(token, 't3rg.csv', csv);
  const q = await requestJson('POST', '/api/hours/csv-queue-unmatched', {
    token, body: { stage_id: v.stage_id, csv_filename: 't3rg.csv' },
  });
  assert.ok(q.queued >= 1);

  const list = await requestJson('GET', '/api/csv-review-queue?status=pending', { token });
  const found = list.rows.find(r => r.raw_row && r.raw_row.name === s.name);
  assert.ok(found, 'row in queue');
  trash.csv_review_queue.push(found.id);

  // Create a rollup project (client-level folder)
  const c = await fixtures.client({ name: uniqueTag('rg-client') });
  trash.clients.push(c.id);
  // Insert rollup directly — fixtures.project doesn't expose is_rollup
  const { rows: rp } = await pool.query(
    `INSERT INTO projects (name, client_id, is_rollup, rollup_level, status)
       VALUES ($1, $2, true, 'client', 'active') RETURNING id`,
    [uniqueTag('rg-rollup'), c.id]
  );
  const rollupId = rp[0].id;
  trash.projects.push(rollupId);

  const m = await requestJson('POST', `/api/csv-review-queue/${found.id}/match`, {
    token, body: { project_id: rollupId }, expectStatus: 400,
  });
  // Should be rejected because rollupId.is_rollup = true
  assert.ok(m.error, 'error returned for rollup assignment');
  assert.ok(/rollup/i.test(m.error), 'error message mentions rollup');
});
