// tests/audit_cleanup.test.js
//
// Smoke test for the audit-table retention job. The time_entry_audit
// table grows linearly with edits + CSV-imported rows; without a
// retention pass it eats Postgres disk in months. The scheduler in
// automation.js runs runAuditCleanup() daily, and admin can trigger
// it via POST /api/_admin/audit-cleanup. This test exercises the
// pure function so a regression that breaks the DELETE windows or
// VACUUM call surfaces immediately.

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, uniqueTag, cleanupAll, pool,
} = require('./_helpers');
const { runAuditCleanup } = require('../automation');

const trash = { staff: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  await close();
});

// Insert a synthetic audit row directly. Bypasses the timeclock_module
// audit logger so we can stamp `at` to whatever past date we want.
async function seedAudit({ at, meaningful, summary }) {
  const { rows } = await pool.query(
    `INSERT INTO time_entry_audit
       (time_entry_id, action, change_summary, meaningful, source, at)
     VALUES (gen_random_uuid(), 'created', $1, $2, 'test', $3)
     RETURNING id`,
    [summary, meaningful, at]
  );
  return rows[0].id;
}

test('runAuditCleanup drops trivial rows >90d and any rows >18mo, leaves recent rows alone', async () => {
  // Seed 4 rows with carefully-chosen `at` timestamps:
  //   - "fresh trivial": today, meaningful=FALSE   → keep
  //   - "fresh meaningful": today, meaningful=TRUE → keep
  //   - "stale trivial": 100d ago, meaningful=FALSE → delete (>90d trivial)
  //   - "ancient meaningful": 19mo ago, meaningful=TRUE → delete (>18mo hard)
  const freshTrivial    = await seedAudit({ at: new Date(),                                      meaningful: false, summary: 'fresh trivial'    });
  const freshMeaningful = await seedAudit({ at: new Date(),                                      meaningful: true,  summary: 'fresh meaningful' });
  const staleTrivial    = await seedAudit({ at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), meaningful: false, summary: 'stale trivial'    });
  const ancientMeaning  = await seedAudit({ at: new Date(Date.now() - 19  * 30 * 24 * 60 * 60 * 1000), meaningful: true,  summary: 'ancient'        });

  // Skip VACUUM in the test — postgres test harness runs many tests
  // back-to-back, and VACUUM occasionally races with other suite
  // statements depending on timing. The retention DELETEs are the
  // important assertion; VACUUM is a known-good Postgres builtin.
  const result = await runAuditCleanup(pool, { skipVacuum: true });

  assert.ok(result.trivial_deleted >= 1, 'should drop the 100d-old trivial row');
  assert.ok(result.hard_deleted    >= 1, 'should drop the 19mo-old meaningful row');

  const { rows: still } = await pool.query(
    `SELECT id FROM time_entry_audit WHERE id = ANY($1::bigint[])`,
    [[freshTrivial, freshMeaningful, staleTrivial, ancientMeaning]]
  );
  const alive = new Set(still.map(r => r.id));
  assert.ok(alive.has(freshTrivial),    'fresh trivial row must survive');
  assert.ok(alive.has(freshMeaningful), 'fresh meaningful row must survive');
  assert.ok(!alive.has(staleTrivial),   '100d-old trivial row must be gone');
  assert.ok(!alive.has(ancientMeaning), '19mo-old meaningful row must be gone');
});

test('Custom retention windows are respected', async () => {
  // Seed a 5-day-old trivial row, then run cleanup with retention=3 days.
  // The row should be pruned even though the default would keep it.
  const youngTrivial = await seedAudit({
    at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    meaningful: false, summary: 'young trivial',
  });
  const result = await runAuditCleanup(pool, { retainTrivialDays: 3, skipVacuum: true });
  assert.ok(result.trivial_deleted >= 1);

  const { rowCount } = await pool.query(
    `SELECT 1 FROM time_entry_audit WHERE id = $1`, [youngTrivial]);
  assert.equal(rowCount, 0, 'row newer than default but older than custom window must be gone');
});

test('Admin endpoint POST /api/_admin/audit-cleanup runs the cleanup', async () => {
  const token = await adminLogin();
  const stale = await seedAudit({
    at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    meaningful: false, summary: 'endpoint test',
  });
  // VACUUM cannot run inside a transaction; the admin endpoint executes
  // it as a top-level statement against the pool, which is what we want.
  const r = await requestJson('POST', '/api/_admin/audit-cleanup', {
    token, body: {},
  });
  assert.equal(typeof r.trivial_deleted, 'number');
  assert.ok(r.trivial_deleted >= 1, 'endpoint should report the deleted count');
  assert.ok(typeof r.hint === 'string' && r.hint.length > 0);
  const { rowCount } = await pool.query(
    `SELECT 1 FROM time_entry_audit WHERE id = $1`, [stale]);
  assert.equal(rowCount, 0);
});
