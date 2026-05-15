// tests/training.test.js — OSP-RW.2 training API smoke tests
//
// Covers: GET + POST /api/training/progress, POST /api/training/cert-attempt,
// GET /api/training/cert-attempts, POST /api/training/capstone-attempt,
// GET /api/training/admin/progress-overview.
//
// Auth: admin token from adminLogin() for admin-role tests.
// Non-admin user: inserted directly via pool + signToken() for role-gate tests.
//
// Cleanup: training_* rows are cascade-deleted when the test user row is
// deleted. Users are cleaned up in after() via direct pool.query().

'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, pool, uniqueTag,
} = require('./_helpers');
const { signToken } = require('../auth');

let adminToken;
let nonAdminUserId;
let nonAdminToken;

before(async () => {
  await bootTestServer();
  adminToken = await adminLogin();

  // Create a non-admin test user directly in the DB.
  // bcrypt hash not needed for token-based auth — signToken() creates a JWT
  // the server's authMiddleware will accept without touching the DB hash.
  const tag = uniqueTag('traintest');
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1, 'placeholder', 'design_engineer', $2, TRUE)
     RETURNING id, username, role, full_name`,
    [tag, `Train Test ${tag}`]
  );
  const nonAdminUser = rows[0];
  nonAdminUserId = nonAdminUser.id;
  nonAdminToken = signToken(nonAdminUser);
});

after(async () => {
  // Cascade-delete cleans training_progress / cert_attempts / capstone_attempts
  // that reference this user_id.
  if (nonAdminUserId) {
    await pool.query(`DELETE FROM users WHERE id = $1`, [nonAdminUserId]).catch(() => {});
  }
  await close();
});

// ─── GET /api/training/progress ─────────────────────────────────────────────

test('GET /api/training/progress returns 401 without auth', async () => {
  const r = await requestJson('GET', '/api/training/progress', { expectStatus: 401 });
  assert.ok(r.error, 'should return an error message');
});

test('GET /api/training/progress returns 200 with empty array for new user', async () => {
  const data = await requestJson('GET', '/api/training/progress', { token: nonAdminToken });
  assert.ok(Array.isArray(data.progress), 'progress should be an array');
  assert.equal(data.progress.length, 0);
});

test('GET /api/training/progress returns 200 for admin', async () => {
  const data = await requestJson('GET', '/api/training/progress', { token: adminToken });
  assert.ok(Array.isArray(data.progress));
});

// ─── POST /api/training/progress ────────────────────────────────────────────

test('POST /api/training/progress returns 401 without auth', async () => {
  await requestJson('POST', '/api/training/progress', {
    expectStatus: 401,
    body: { course_id: 'T01', lesson_id: 'T01.L01', status: 'in_progress', completion_pct: 10 },
  });
});

test('POST /api/training/progress returns 400 on missing course_id', async () => {
  const r = await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    expectStatus: 400,
    body: { lesson_id: 'T01.L01', status: 'in_progress', completion_pct: 10 },
  });
  assert.ok(r.error.includes('course_id'));
});

test('POST /api/training/progress returns 400 on invalid status', async () => {
  const r = await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    expectStatus: 400,
    body: { course_id: 'T01', lesson_id: 'T01.L01', status: 'bogus', completion_pct: 10 },
  });
  assert.ok(r.error.includes('status'));
});

test('POST /api/training/progress creates a row in training_progress', async () => {
  const r = await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    body: { course_id: 'T99', lesson_id: 'T99.L01', status: 'in_progress', completion_pct: 25 },
  });
  assert.ok(r.progress, 'response should include progress row');
  assert.equal(r.progress.lesson_id, 'T99.L01');
  assert.equal(r.progress.status, 'in_progress');
  assert.equal(r.progress.completion_pct, 25);

  // Verify the row exists in the DB
  const { rows } = await pool.query(
    `SELECT * FROM training_progress WHERE user_id = $1 AND lesson_id = $2`,
    [nonAdminUserId, 'T99.L01']
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, 'in_progress');
});

test('POST /api/training/progress upsert advances status to completed', async () => {
  // First mark in_progress
  await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    body: { course_id: 'T99', lesson_id: 'T99.L02', status: 'in_progress', completion_pct: 50 },
  });
  // Now mark completed with score
  const r = await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    body: { course_id: 'T99', lesson_id: 'T99.L02', status: 'completed', completion_pct: 100, score: 88 },
  });
  assert.equal(r.progress.status, 'completed');
  assert.equal(r.progress.best_score, 88);
});

test('POST /api/training/progress does not regress completed status', async () => {
  // Pre-seed a completed row
  await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    body: { course_id: 'T99', lesson_id: 'T99.L03', status: 'completed', completion_pct: 100 },
  });
  // Try to regress to in_progress
  const r = await requestJson('POST', '/api/training/progress', {
    token: nonAdminToken,
    body: { course_id: 'T99', lesson_id: 'T99.L03', status: 'in_progress', completion_pct: 30 },
  });
  assert.equal(r.progress.status, 'completed', 'status should not regress from completed');
});

// After writing progress, GET should return it
test('GET /api/training/progress returns seeded rows', async () => {
  const data = await requestJson('GET', '/api/training/progress', { token: nonAdminToken });
  const found = data.progress.some(p => p.lesson_id === 'T99.L01');
  assert.ok(found, 'should include T99.L01 that was written earlier');
});

// ─── POST /api/training/cert-attempt ────────────────────────────────────────

test('POST /api/training/cert-attempt returns 401 without auth', async () => {
  await requestJson('POST', '/api/training/cert-attempt', {
    expectStatus: 401,
    body: { cert_track: 'RCDD', score: 72, passed: true, total_items: 50, correct_items: 36 },
  });
});

test('POST /api/training/cert-attempt returns 400 on invalid cert_track', async () => {
  const r = await requestJson('POST', '/api/training/cert-attempt', {
    token: nonAdminToken,
    expectStatus: 400,
    body: { cert_track: 'BOGUS', score: 70, passed: false, total_items: 50, correct_items: 35 },
  });
  assert.ok(r.error.includes('cert_track'));
});

test('POST /api/training/cert-attempt records attempt and returns 201', async () => {
  const r = await requestJson('POST', '/api/training/cert-attempt', {
    token: nonAdminToken,
    expectStatus: 201,
    body: {
      cert_track: 'OSP-Designer',
      score: 80,
      passed: true,
      total_items: 50,
      correct_items: 40,
      time_taken_seconds: 2700,
      domain_scores: { design: 85, safety: 75 },
    },
  });
  assert.ok(r.attempt.id, 'should return id');
  assert.equal(r.attempt.cert_track, 'OSP-Designer');
  assert.equal(r.attempt.score, 80);
  assert.equal(r.attempt.passed, true);
});

// ─── GET /api/training/cert-attempts ────────────────────────────────────────

test('GET /api/training/cert-attempts returns attempt history for user', async () => {
  const data = await requestJson('GET', '/api/training/cert-attempts', { token: nonAdminToken });
  assert.ok(Array.isArray(data.attempts));
  // The attempt we posted above should be present
  const found = data.attempts.some(a => a.cert_track === 'OSP-Designer' && a.score === 80);
  assert.ok(found, 'should include the OSP-Designer attempt we posted');
});

// ─── POST /api/training/capstone-attempt ────────────────────────────────────

test('POST /api/training/capstone-attempt returns 201', async () => {
  const r = await requestJson('POST', '/api/training/capstone-attempt', {
    token: nonAdminToken,
    expectStatus: 201,
    body: { course_id: 'T99', score: 90, passed: true, total_items: 20, correct_items: 18 },
  });
  assert.ok(r.attempt.id);
  assert.equal(r.attempt.course_id, 'T99');
  assert.equal(r.attempt.passed, true);
});

// ─── GET /api/training/admin/progress-overview ──────────────────────────────

test('GET /api/training/admin/progress-overview returns 403 for non-admin', async () => {
  await requestJson('GET', '/api/training/admin/progress-overview', {
    token: nonAdminToken,
    expectStatus: 403,
  });
});

test('GET /api/training/admin/progress-overview returns 200 for admin', async () => {
  const data = await requestJson('GET', '/api/training/admin/progress-overview', {
    token: adminToken,
  });
  assert.ok(Array.isArray(data.users), 'should return users array');
  // Each entry should have the expected shape
  for (const u of data.users) {
    assert.ok(u.user_id, 'user_id present');
    assert.ok(Array.isArray(u.courses), 'courses array present');
  }
});
