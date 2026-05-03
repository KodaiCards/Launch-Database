// Smoke test #1 — bulk hours delete + undo (Track 0 step 2).
//
// Regression target: commit 35d22e6 fixed the YTD-mode bulk delete that was
// returning deleted=0 even when entries existed. We test both the
// month+year branch and the year-only (YTD) branch, plus the undo path
// that re-inserts every entry with its ORIGINAL UUID so foreign-key refs
// from anywhere else still resolve.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [], jobs: [], projects: [], staff: [],
  time_entries: [], undo_buckets: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});
after(async () => {
  await cleanupAll(cleanup);
  await close();
});

test('month+year DELETE then undo restores entry with original UUID + hours', async () => {
  const client = await fixtures.client();           cleanup.clients.push(client.id);
  const job = await fixtures.job();                 cleanup.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  cleanup.projects.push(project.id);
  const staff = await fixtures.staff();             cleanup.staff.push(staff.id);
  const entry = await fixtures.timeEntry({
    project_id: project.id, staff_id: staff.id,
    entry_date: '2026-05-01', hours: 7.5,
  });
  cleanup.time_entries.push(entry.id);

  // DELETE — month+year branch (the most common UI path)
  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=5&year=2026`,
    { token }
  );
  assert.equal(delJson.ok, true);
  assert.ok(delJson.deleted >= 1, `expected deleted>=1, got ${delJson.deleted}`);
  assert.ok(delJson.undo_token, 'response should include undo_token');
  cleanup.undo_buckets.push(delJson.undo_token);

  // Confirm the row is actually gone from the DB
  const { rows: gone } = await pool.query(
    'SELECT id FROM time_entries WHERE id = $1', [entry.id]
  );
  assert.equal(gone.length, 0, 'time entry should be deleted');

  // UNDO — should re-insert with the same UUID + hours
  const undoJson = await requestJson('POST', `/api/undo/${delJson.undo_token}`, { token });
  assert.equal(undoJson.ok, true);
  assert.ok(undoJson.restored >= 1, `expected restored>=1, got ${undoJson.restored}`);

  const { rows: back } = await pool.query(
    'SELECT id, hours, project_id, staff_id, entry_date FROM time_entries WHERE id = $1',
    [entry.id]
  );
  assert.equal(back.length, 1, 'undo should restore entry by original UUID');
  assert.equal(Number(back[0].hours), 7.5);
  assert.equal(back[0].project_id, project.id);
  assert.equal(back[0].staff_id, staff.id);
  assert.equal(back[0].entry_date, '2026-05-01');
});

test('YTD-mode DELETE (year only) reports deleted > 0 — regression for 35d22e6', async () => {
  // Two entries in different months under the same staff. YTD mode (no
  // month query param) should match both. The bug fixed in 35d22e6 made
  // this branch return deleted=0 silently.
  const client = await fixtures.client();           cleanup.clients.push(client.id);
  const project = await fixtures.project({ client_id: client.id });
  cleanup.projects.push(project.id);
  const staff = await fixtures.staff();             cleanup.staff.push(staff.id);
  const e1 = await fixtures.timeEntry({
    project_id: project.id, staff_id: staff.id,
    entry_date: '2026-02-15', hours: 4,
  });
  const e2 = await fixtures.timeEntry({
    project_id: project.id, staff_id: staff.id,
    entry_date: '2026-08-22', hours: 6,
  });
  cleanup.time_entries.push(e1.id, e2.id);

  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?year=2026`,
    { token }
  );
  assert.equal(delJson.ok, true);
  assert.ok(delJson.deleted >= 2, `YTD mode should match both entries — got ${delJson.deleted}`);
  if (delJson.undo_token) cleanup.undo_buckets.push(delJson.undo_token);

  // Both rows should be gone
  const { rows } = await pool.query(
    'SELECT id FROM time_entries WHERE id = ANY($1::uuid[])',
    [[e1.id, e2.id]]
  );
  assert.equal(rows.length, 0, 'both YTD entries should be deleted');
});

test('DELETE with no matching entries returns deleted=0 and no undo_token', async () => {
  const staff = await fixtures.staff();             cleanup.staff.push(staff.id);
  // No entries seeded for this staff member.
  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=5&year=2026`,
    { token }
  );
  assert.equal(delJson.ok, true);
  assert.equal(delJson.deleted, 0);
  // server.js short-circuits before saveUndoBucket when nothing was deleted
  assert.equal(delJson.undo_token, undefined);
});
