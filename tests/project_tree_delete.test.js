// Smoke test #2 — project tree delete + undo (Track 0 step 3).
//
// Exercises:
//   - DELETE /api/projects/:id/with-tree on a parent that has one child +
//     one time entry on that child. Asserts both projects and the time
//     entry are gone and that an undo_token is returned.
//   - POST /api/undo/:token rebuilds the whole tree by re-inserting the
//     parent FIRST (the restorer sorts by __depth ascending in
//     server.js:1506) so the child's parent_id reference resolves.
//   - Verifies collectProjectTree() walks the descendant tree correctly:
//     a 2-level chain (parent → child) means deleted_projects === 2.
//
// Regression: this whole feature landed in commit 35d22e6 along with the
// undo bar. If a future refactor breaks the depth-ordered restore, the
// child INSERT will fail with an FK violation and this test will catch it.

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

test('with-tree DELETE removes parent + child + time entry; undo restores all three', async () => {
  // Seed: client + job + parent project + child project + time entry on child.
  const client = await fixtures.client();           cleanup.clients.push(client.id);
  const job = await fixtures.job();                 cleanup.jobs.push(job.id);
  const parent = await fixtures.project({
    client_id: client.id, job_id: job.id,
    name: 'parent-rollup',
  });
  cleanup.projects.push(parent.id);
  const child = await fixtures.project({
    client_id: client.id, job_id: job.id,
    parent_id: parent.id,
    name: 'child-leaf',
  });
  cleanup.projects.push(child.id);
  const staff = await fixtures.staff();             cleanup.staff.push(staff.id);
  const entry = await fixtures.timeEntry({
    project_id: child.id, staff_id: staff.id,
    entry_date: '2026-04-15', hours: 5,
  });
  cleanup.time_entries.push(entry.id);

  // DELETE the tree at the parent
  const delJson = await requestJson(
    'DELETE',
    `/api/projects/${parent.id}/with-tree`,
    { token }
  );
  assert.equal(delJson.ok, true);
  assert.equal(delJson.deleted_projects, 2,
    'expected parent + 1 child = 2 deleted projects');
  assert.equal(delJson.deleted_time_entries, 1,
    'expected 1 deleted time entry');
  assert.ok(delJson.undo_token, 'response should include undo_token');
  cleanup.undo_buckets.push(delJson.undo_token);

  // Confirm both projects + the time entry are gone
  const { rows: gone } = await pool.query(
    'SELECT id FROM projects WHERE id = ANY($1::uuid[])',
    [[parent.id, child.id]]
  );
  assert.equal(gone.length, 0, 'both projects should be deleted');
  const { rows: te } = await pool.query(
    'SELECT id FROM time_entries WHERE id = $1', [entry.id]
  );
  assert.equal(te.length, 0, 'time entry on child should be deleted');

  // UNDO — must restore parent BEFORE child (depth-ordered)
  const undoJson = await requestJson('POST', `/api/undo/${delJson.undo_token}`, { token });
  assert.equal(undoJson.ok, true);
  assert.equal(undoJson.restored_projects, 2);
  assert.equal(undoJson.restored_time_entries, 1);

  // Confirm both projects came back with original UUIDs + the parent_id
  // link is intact
  const { rows: parentBack } = await pool.query(
    'SELECT id, parent_id FROM projects WHERE id = $1', [parent.id]
  );
  assert.equal(parentBack.length, 1, 'parent should be restored');
  assert.equal(parentBack[0].parent_id, null, 'parent should have no parent_id');

  const { rows: childBack } = await pool.query(
    'SELECT id, parent_id FROM projects WHERE id = $1', [child.id]
  );
  assert.equal(childBack.length, 1, 'child should be restored');
  assert.equal(childBack[0].parent_id, parent.id,
    'child.parent_id should still reference the restored parent');

  const { rows: teBack } = await pool.query(
    'SELECT id, project_id, hours FROM time_entries WHERE id = $1', [entry.id]
  );
  assert.equal(teBack.length, 1, 'time entry should be restored');
  assert.equal(teBack[0].project_id, child.id);
  assert.equal(Number(teBack[0].hours), 5);
});

test('with-tree DELETE on a non-existent project returns 404', async () => {
  // Use a random UUID that doesn't exist. The endpoint short-circuits when
  // collectProjectTree returns an empty list (server.js:4745).
  const fakeId = '00000000-0000-4000-8000-000000000000';
  const res = await requestJson(
    'DELETE',
    `/api/projects/${fakeId}/with-tree`,
    { token, expectStatus: 404 }
  );
  assert.match(res.error || '', /not found/i);
});
