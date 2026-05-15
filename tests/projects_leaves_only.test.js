// tests/projects_leaves_only.test.js
//
// Unit smoke-tests for the Phase 1 timeclock-picker-wave changes to
// GET /api/projects:
//   • ?leaves_only=true (and uppercase/alternate forms) filters out
//     is_rollup=TRUE rows via IS NOT TRUE, leaving only leaf projects.
//   • ?leaves_only=yes (not in the allow-list) does NOT activate the filter.
//   • ?include_completed=true&status=active ORs in status='completed' rows.
//   • is_rollup=NULL rows (nullable column, schema_core.sql:825) are treated
//     as leaves by IS NOT TRUE and are NOT filtered out by ?leaves_only=true.
//
// NOTE on is_rollup=NULL: the projects fixture doesn't set is_rollup, so
// newly seeded rows land with is_rollup=DEFAULT FALSE (not NULL). A NULL row
// can only arise via a direct INSERT without specifying is_rollup. We test
// that path with a raw pool.query so the NULL-is_rollup case is covered.
// This validates the IS NOT TRUE form (not = FALSE), as required by CANONICAL.md §6.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [], jobs: [], projects: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});
after(async () => {
  await cleanupAll(cleanup);
  await close();
});

// ─── Shared fixtures ────────────────────────────────────────────────────────

let sharedClient;
let rollupProject;      // is_rollup=TRUE
let leafProject;        // is_rollup=FALSE (default), status=active
let completedProject;   // is_rollup=FALSE,           status=completed
let nullRollupProject;  // is_rollup=NULL (raw insert), status=active

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('lonly-client') });
  cleanup.clients.push(sharedClient.id);

  // Rollup row — is_rollup explicitly TRUE (mirrors ensureRollupChain output).
  const { rows: [rp] } = await pool.query(
    `INSERT INTO projects
       (name, client_id, project_type, billing_type, status, is_rollup)
     VALUES ($1, $2, 'other', 'hourly', 'active', TRUE) RETURNING *`,
    [uniqueTag('lonly-rollup'), sharedClient.id]
  );
  rollupProject = rp;
  cleanup.projects.push(rp.id);

  // Leaf row — active (default is_rollup=FALSE).
  const lp = await fixtures.project({
    name: uniqueTag('lonly-leaf-active'),
    client_id: sharedClient.id,
    status: 'active',
  });
  leafProject = lp;
  cleanup.projects.push(lp.id);

  // Leaf row — completed (for include_completed test).
  const cp = await fixtures.project({
    name: uniqueTag('lonly-leaf-completed'),
    client_id: sharedClient.id,
    status: 'completed',
  });
  completedProject = cp;
  cleanup.projects.push(cp.id);

  // NULL is_rollup row — explicitly insert NULL to override the DEFAULT false.
  // This validates the IS NOT TRUE form (not = FALSE) — IS NOT TRUE passes
  // NULLs through; = FALSE would exclude them.
  const { rows: [np] } = await pool.query(
    `INSERT INTO projects
       (name, client_id, project_type, billing_type, status, is_rollup)
     VALUES ($1, $2, 'other', 'hourly', 'active', NULL) RETURNING *`,
    [uniqueTag('lonly-null-rollup'), sharedClient.id]
  );
  nullRollupProject = np;
  cleanup.projects.push(np.id);
  // Verify the inserted row really has is_rollup=NULL.
  assert.equal(np.is_rollup, null, 'seeded row must have is_rollup=NULL for this test to be meaningful');
});

// ─── Test 1: no flag → rollups AND leaves returned ─────────────────────────

test('GET /api/projects (no flag) returns rollup rows and leaf rows', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}`, { token });
  assert.ok(Array.isArray(list), 'response should be an array');

  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(rollupProject.id),
    `rollup project (id=${rollupProject.id}) must appear when ?leaves_only is absent`);
  assert.ok(ids.has(leafProject.id),
    `leaf project (id=${leafProject.id}) must appear when ?leaves_only is absent`);
});

// ─── Test 2: ?leaves_only=true → rollup filtered, leaves retained ──────────

test('GET /api/projects?leaves_only=true excludes is_rollup=TRUE rows, retains leaves', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=true`, { token });
  assert.ok(Array.isArray(list), 'response should be an array');

  const ids = new Set(list.map(p => p.id));
  assert.ok(!ids.has(rollupProject.id),
    `rollup project (id=${rollupProject.id}) must NOT appear when ?leaves_only=true`);
  assert.ok(ids.has(leafProject.id),
    `leaf project (id=${leafProject.id}) must appear when ?leaves_only=true`);
});

// ─── Test 3: ?leaves_only=TRUE (uppercase) → same as 'true' ───────────────

test('GET /api/projects?leaves_only=TRUE (uppercase) activates the filter', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=TRUE`, { token });
  const ids = new Set(list.map(p => p.id));
  assert.ok(!ids.has(rollupProject.id),
    `rollup project must NOT appear when ?leaves_only=TRUE (uppercase)`);
  assert.ok(ids.has(leafProject.id),
    `leaf project must appear when ?leaves_only=TRUE (uppercase)`);
});

// ─── Test 4: ?leaves_only=1 → activates the filter ────────────────────────

test('GET /api/projects?leaves_only=1 activates the filter', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=1`, { token });
  const ids = new Set(list.map(p => p.id));
  assert.ok(!ids.has(rollupProject.id),
    `rollup project must NOT appear when ?leaves_only=1`);
  assert.ok(ids.has(leafProject.id),
    `leaf project must appear when ?leaves_only=1`);
});

// ─── Test 5: ?leaves_only=on → activates the filter ───────────────────────

test('GET /api/projects?leaves_only=on activates the filter', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=on`, { token });
  const ids = new Set(list.map(p => p.id));
  assert.ok(!ids.has(rollupProject.id),
    `rollup project must NOT appear when ?leaves_only=on`);
  assert.ok(ids.has(leafProject.id),
    `leaf project must appear when ?leaves_only=on`);
});

// ─── Test 6: ?leaves_only=yes → NOT in allow-list → filter NOT activated ───

test('GET /api/projects?leaves_only=yes does NOT activate the filter (parse-hardening)', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=yes`, { token });
  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(rollupProject.id),
    `rollup project MUST still appear when ?leaves_only=yes (not in allow-list; filter must remain off)`);
  assert.ok(ids.has(leafProject.id),
    `leaf project must appear when ?leaves_only=yes`);
});

// ─── Test 7: ?leaves_only=true&include_completed=true&status=active ────────
//     Returns active AND completed leaves; excludes rollups.

test('GET /api/projects?leaves_only=true&include_completed=true&status=active returns active+completed leaves', async () => {
  const list = await requestJson(
    'GET',
    `/api/projects?client_id=${sharedClient.id}&leaves_only=true&status=active&include_completed=true`,
    { token }
  );
  assert.ok(Array.isArray(list), 'response should be an array');
  const ids = new Set(list.map(p => p.id));

  assert.ok(!ids.has(rollupProject.id),
    `rollup project must NOT appear (leaves_only=true in effect)`);
  assert.ok(ids.has(leafProject.id),
    `active leaf project must appear`);
  assert.ok(ids.has(completedProject.id),
    `completed leaf project must appear when include_completed=true`);
});

// ─── Test 8: is_rollup=NULL row survives ?leaves_only=true ─────────────────
//     IS NOT TRUE passes NULL rows through; = FALSE would exclude them.
//     This is the regression net for the SQL form (CANONICAL.md §6 + §8 R1).

test('GET /api/projects?leaves_only=true does NOT filter out is_rollup=NULL rows (IS NOT TRUE form)', async () => {
  const list = await requestJson('GET', `/api/projects?client_id=${sharedClient.id}&leaves_only=true`, { token });
  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(nullRollupProject.id),
    `is_rollup=NULL row (id=${nullRollupProject.id}) must NOT be filtered by ?leaves_only=true ` +
    `— IS NOT TRUE passes NULLs through; = FALSE would incorrectly exclude them`);
});
