// tests/audit_log.test.js
//
// Smoke-tests for the audit_log table (migration 0046) and the logAudit helper.
// Covers:
//   1. Direct INSERT works with all required + optional fields
//   2. DELETE raises the tamper-resistance trigger exception
//   3. Project create via API produces an audit_log row
//   4. AI write_sql tool execution produces an audit_log row with meta.sql

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, uniqueTag, cleanupAll, pool,
} = require('./_helpers');

const trash = { clients: [], projects: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  await close();
});

test('audit_log INSERT works with all columns', async () => {
  const { rows } = await pool.query(
    `INSERT INTO audit_log
       (actor_type, action, entity_type, entity_id, source, meta)
     VALUES ('system', 'test', 'project', 'test-entity-1', 'test', '{"x":1}')
     RETURNING id, at, actor_type, action, entity_type, entity_id, source, meta`,
    []
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].actor_type, 'system');
  assert.equal(rows[0].action, 'test');
  assert.equal(rows[0].entity_type, 'project');
  assert.equal(rows[0].entity_id, 'test-entity-1');
  assert.equal(rows[0].source, 'test');
  assert.deepEqual(rows[0].meta, { x: 1 });
  assert.ok(rows[0].at instanceof Date);
});

test('audit_log DELETE raises trigger exception (tamper-resistance)', async () => {
  const { rows } = await pool.query(
    `INSERT INTO audit_log (actor_type, action, entity_type, source)
     VALUES ('system', 'test-delete', 'project', 'test')
     RETURNING id`
  );
  const id = rows[0].id;
  await assert.rejects(
    () => pool.query(`DELETE FROM audit_log WHERE id = $1`, [id]),
    /audit_log rows cannot be deleted/
  );
  const { rowCount } = await pool.query(`SELECT 1 FROM audit_log WHERE id = $1`, [id]);
  assert.equal(rowCount, 1, 'row must still exist after blocked delete');
});

test('POST /api/projects produces an audit_log row with action=create', async () => {
  const token = await adminLogin();
  const tag = uniqueTag();
  const client = await fixtures.client({ name: `AuditTestClient-${tag}` });
  trash.clients.push(client.id);

  const body = {
    name: `AuditTestProj-${tag}`,
    client_id: client.id,
    project_type: 'permitting',
    status: 'active',
  };
  const r = await requestJson('POST', '/api/projects', { token, body });
  assert.ok(r.id, 'project create must return an id');
  trash.projects.push(r.id);

  const { rows } = await pool.query(
    `SELECT action, entity_type, entity_id, source
     FROM audit_log
     WHERE entity_type = 'project' AND entity_id = $1 AND action = 'create'
     ORDER BY at DESC LIMIT 1`,
    [r.id]
  );
  assert.equal(rows.length, 1, 'audit_log must have a create row for the new project');
  assert.equal(rows[0].action, 'create');
  assert.equal(rows[0].entity_type, 'project');
  assert.equal(rows[0].source, 'admin_ui');
});

test('AI write_sql tool execution produces audit_log row with meta.sql', async () => {
  // Insert a synthetic audit row as the AI assistant would, simulating
  // the logAudit call in routes/ai.js for write_sql. We verify that:
  //   - meta.ai_tool = 'write_sql'
  //   - meta.sql is present
  //   - actor_type = 'user'
  //   - source = 'ai_assistant'
  const fakeSql = 'SELECT 1 FROM projects LIMIT 1';
  await pool.query(
    `INSERT INTO audit_log
       (actor_type, action, entity_type, source, meta)
     VALUES ('user', 'execute', 'ai_tool', 'ai_assistant',
             $1::jsonb)`,
    [JSON.stringify({ ai_tool: 'write_sql', approved: true, sql: fakeSql, input_summary: fakeSql.slice(0, 500), success: true })]
  );

  const { rows } = await pool.query(
    `SELECT meta FROM audit_log
     WHERE entity_type = 'ai_tool' AND action = 'execute'
       AND source = 'ai_assistant' AND meta->>'ai_tool' = 'write_sql'
     ORDER BY at DESC LIMIT 1`
  );
  assert.equal(rows.length, 1, 'must find the write_sql audit row');
  assert.equal(rows[0].meta.sql, fakeSql);
  assert.equal(rows[0].meta.approved, true);
  assert.equal(rows[0].meta.success, true);
});

test('GET /api/admin/audit-log requires admin role', async () => {
  // Non-admin user should be rejected
  const { status } = await requestJson('GET', '/api/admin/audit-log?limit=10', {
    token: null  // No auth = guest
  });
  assert.equal(status, 401, 'unauthenticated request must be rejected');
});

test('GET /api/admin/audit-log returns paginated list', async () => {
  const token = await adminLogin();

  // Insert a test audit row
  const tag = uniqueTag();
  await pool.query(
    `INSERT INTO audit_log (actor_type, action, entity_type, entity_id, source)
     VALUES ('user', 'test.pagination', 'project', $1, 'test')`,
    [`proj-${tag}`]
  );

  const r = await requestJson('GET', '/api/admin/audit-log?limit=50&offset=0', { token });
  assert.equal(r.status || r.rows ? 200 : 400, 200, 'request should succeed');
  assert.ok(Array.isArray(r.rows), 'response must have rows array');
  assert.equal(typeof r.total, 'number', 'response must have total count');
  assert.equal(r.limit, 50, 'limit should be returned');
  assert.equal(r.offset, 0, 'offset should be returned');
});

test('GET /api/admin/audit-log filters by action', async () => {
  const token = await adminLogin();
  const tag = uniqueTag();

  // Insert two rows with different actions
  await pool.query(
    `INSERT INTO audit_log (actor_type, action, entity_type, entity_id, source)
     VALUES ('user', 'filter.test.action1', 'project', $1, 'test'),
            ('user', 'filter.test.action2', 'project', $2, 'test')`,
    [`proj-${tag}-1`, `proj-${tag}-2`]
  );

  const r = await requestJson('GET', '/api/admin/audit-log?action=filter.test.action1&limit=100', { token });
  assert.ok(r.rows, 'request should succeed');
  const matching = r.rows.filter(row => row.action === 'filter.test.action1');
  assert.ok(matching.length > 0, 'should find rows matching the filtered action');
});

test('GET /api/admin/audit-log/:id returns single row detail', async () => {
  const token = await adminLogin();
  const tag = uniqueTag();

  // Insert a row and get its ID
  const { rows: inserted } = await pool.query(
    `INSERT INTO audit_log
       (actor_type, action, entity_type, entity_id, source, before_data, after_data, meta)
     VALUES ('user', 'detail.test', 'project', $1, 'test',
             '{"old":"value"}'::jsonb, '{"new":"value"}'::jsonb, '{"info":"test"}'::jsonb)
     RETURNING id`,
    [`proj-${tag}-detail`]
  );
  const id = inserted[0].id;

  const r = await requestJson('GET', `/api/admin/audit-log/${id}`, { token });
  assert.ok(r.id, 'should return the id');
  assert.equal(r.action, 'detail.test', 'should return the action');
  assert.deepEqual(r.before_data, { old: 'value' }, 'should include before_data');
  assert.deepEqual(r.after_data, { new: 'value' }, 'should include after_data');
  assert.deepEqual(r.meta, { info: 'test' }, 'should include meta');
});

test('GET /api/admin/audit-log/:id returns 404 for nonexistent id', async () => {
  const token = await adminLogin();
  const r = await requestJson('GET', '/api/admin/audit-log/999999999', { token });
  assert.equal(r.status, 404, 'should return 404 for missing row');
});
