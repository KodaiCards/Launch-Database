// tests/undo.test.js — Wave 167 security regression tests for /api/undo/:token
//
// Covers:
//   HIGH-2: cross-user undo replay is blocked (user_id ownership enforced)
//   HIGH-2 negative: owner can replay their own bucket (control)
//   MED-3:  successful undo replay creates an audit_log row with action='undo.replay'
//   MED-4:  error response does not leak DB details (e.message sanitized)

'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, pool, uniqueTag,
} = require('./_helpers');
const { signToken } = require(path.join(__dirname, '..', 'auth'));

let adminToken;
// Second user (non-admin) — represents the attacker trying cross-actor replay
let userBToken;
let userBId;

const cleanup = {
  clients: [], jobs: [], projects: [], staff: [],
  time_entries: [], undo_buckets: [], users: [],
};

before(async () => {
  await bootTestServer();
  adminToken = await adminLogin();

  // Create a second user (not the same as admin) for cross-actor test
  const tag = uniqueTag('undo-test-user');
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
       VALUES ($1, 'placeholder', 'design_engineer', $2, TRUE)
       RETURNING id, username, role, full_name`,
    [tag, `Undo Test User ${tag}`]
  );
  userBId = rows[0].id;
  userBToken = signToken(rows[0]);
  cleanup.users.push(userBId);
});

after(async () => {
  if (cleanup.users.length) {
    await pool.query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [cleanup.users]).catch(() => {});
  }
  await cleanupAll(cleanup);
  await close();
});

// ─── HIGH-2 positive: owner can pop their own bucket ─────────────────────────

test('HIGH-2 control: undo owner can replay their own bucket', async () => {
  // Seed fixtures
  const client = await fixtures.client();     cleanup.clients.push(client.id);
  const job    = await fixtures.job();        cleanup.jobs.push(job.id);
  const proj   = await fixtures.project({ client_id: client.id, job_id: job.id });
  cleanup.projects.push(proj.id);
  const staff  = await fixtures.staff();      cleanup.staff.push(staff.id);
  const entry  = await fixtures.timeEntry({
    project_id: proj.id, staff_id: staff.id, entry_date: '2026-05-01', hours: 4,
  });
  cleanup.time_entries.push(entry.id);

  // Admin deletes the entry, gets an undo token
  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=5&year=2026`,
    { token: adminToken }
  );
  assert.ok(delJson.undo_token, 'should return an undo_token after deletion');
  cleanup.undo_buckets.push(delJson.undo_token);

  // Same admin user replays — must succeed (owner)
  const undoJson = await requestJson('POST', `/api/undo/${delJson.undo_token}`, {
    token: adminToken,
  });
  assert.equal(undoJson.ok, true, 'owner should be able to replay their own bucket');
  assert.ok(undoJson.restored >= 1, `restored count should be >= 1, got ${undoJson.restored}`);
});

// ─── HIGH-2 security: cross-user replay blocked ───────────────────────────────

test('HIGH-2 security: cross-user undo replay returns 404 (bucket not found for attacker)', async () => {
  // Seed fresh fixtures
  const client = await fixtures.client();     cleanup.clients.push(client.id);
  const job    = await fixtures.job();        cleanup.jobs.push(job.id);
  const proj   = await fixtures.project({ client_id: client.id, job_id: job.id });
  cleanup.projects.push(proj.id);
  const staff  = await fixtures.staff();      cleanup.staff.push(staff.id);
  const entry  = await fixtures.timeEntry({
    project_id: proj.id, staff_id: staff.id, entry_date: '2026-06-01', hours: 3,
  });
  cleanup.time_entries.push(entry.id);

  // Admin (userA) deletes, gets an undo token
  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=6&year=2026`,
    { token: adminToken }
  );
  assert.ok(delJson.undo_token, 'should return an undo_token');
  cleanup.undo_buckets.push(delJson.undo_token);

  // userB (different user_id) tries to replay the same token — must fail
  const r = await requestJson('POST', `/api/undo/${delJson.undo_token}`, {
    token: userBToken,
    expectStatus: 404,
  });
  assert.ok(r.error, 'cross-actor replay should return an error message');

  // Verify the entry is still gone (undo was NOT applied)
  const { rows } = await pool.query(
    'SELECT id FROM time_entries WHERE id = $1',
    [entry.id]
  );
  assert.equal(rows.length, 0, 'cross-actor replay must not restore the entry');
});

// ─── MED-3: successful undo replay creates an audit_log row ──────────────────

test('MED-3: successful undo replay writes an audit_log row with action=undo.replay', async () => {
  // Seed fixtures
  const client = await fixtures.client();     cleanup.clients.push(client.id);
  const job    = await fixtures.job();        cleanup.jobs.push(job.id);
  const proj   = await fixtures.project({ client_id: client.id, job_id: job.id });
  cleanup.projects.push(proj.id);
  const staff  = await fixtures.staff();      cleanup.staff.push(staff.id);
  const entry  = await fixtures.timeEntry({
    project_id: proj.id, staff_id: staff.id, entry_date: '2026-07-01', hours: 6,
  });
  cleanup.time_entries.push(entry.id);

  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=7&year=2026`,
    { token: adminToken }
  );
  assert.ok(delJson.undo_token, 'should return an undo_token');
  const undoToken = delJson.undo_token;
  cleanup.undo_buckets.push(undoToken);

  // Record timestamp before replay so we can scope the audit query
  const beforeReplay = new Date();

  // Replay — owner
  const undoJson = await requestJson('POST', `/api/undo/${undoToken}`, { token: adminToken });
  assert.equal(undoJson.ok, true);

  // logAudit is fire-and-forget (.catch(() => {})), give it a brief moment
  await new Promise(r => setTimeout(r, 100));

  // Check audit_log for the undo.replay row
  const { rows: auditRows } = await pool.query(
    `SELECT action, entity_type, entity_id
       FROM audit_log
      WHERE action = 'undo.replay'
        AND entity_id = $1
        AND at >= $2
      LIMIT 5`,
    [undoToken, beforeReplay]
  );
  assert.ok(auditRows.length >= 1, 'audit_log must contain an undo.replay row for this token');
  assert.equal(auditRows[0].action, 'undo.replay');
  assert.equal(auditRows[0].entity_type, 'undo_bucket');
  assert.equal(auditRows[0].entity_id, undoToken);
});

// ─── MED-4: error response must not leak e.message ────────────────────────────

test('MED-4: using an already-consumed undo token returns 404 with no DB details', async () => {
  // Seed and delete to get a token, then consume it once
  const client = await fixtures.client();     cleanup.clients.push(client.id);
  const job    = await fixtures.job();        cleanup.jobs.push(job.id);
  const proj   = await fixtures.project({ client_id: client.id, job_id: job.id });
  cleanup.projects.push(proj.id);
  const staff  = await fixtures.staff();      cleanup.staff.push(staff.id);
  const entry  = await fixtures.timeEntry({
    project_id: proj.id, staff_id: staff.id, entry_date: '2026-08-01', hours: 2,
  });
  cleanup.time_entries.push(entry.id);

  const delJson = await requestJson(
    'DELETE',
    `/api/time-entries/by-staff/${staff.id}?month=8&year=2026`,
    { token: adminToken }
  );
  assert.ok(delJson.undo_token, 'should return an undo_token');
  const undoToken = delJson.undo_token;
  cleanup.undo_buckets.push(undoToken);

  // First replay — consumes the token
  const first = await requestJson('POST', `/api/undo/${undoToken}`, { token: adminToken });
  assert.equal(first.ok, true);

  // Second replay — token already consumed, should 404
  const second = await requestJson('POST', `/api/undo/${undoToken}`, {
    token: adminToken,
    expectStatus: 404,
  });
  // Error field must be present but must NOT contain raw DB exception text
  assert.ok(second.error, 'should return an error message');
  assert.ok(
    !second.error.includes('violates') && !second.error.includes('constraint') &&
    !second.error.includes('column') && !second.error.includes('table '),
    `error must not leak DB details, got: ${second.error}`
  );
});
