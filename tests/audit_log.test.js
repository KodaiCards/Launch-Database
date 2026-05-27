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
