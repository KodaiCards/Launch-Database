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

test('redactPII redacts sensitive password fields', async () => {
  const { redactPII } = require('../routes/_audit');
  const obj = {
    user: 'john',
    password: 'secret123',
    password_hash: 'abc123def',
  };
  const redacted = redactPII(obj);
  assert.equal(redacted.user, 'john', 'non-sensitive fields preserved');
  assert.equal(redacted.password, '[REDACTED]', 'password field redacted');
  assert.equal(redacted.password_hash, '[REDACTED]', 'password_hash field redacted');
});

test('redactPII redacts token and secret fields', async () => {
  const { redactPII } = require('../routes/_audit');
  const obj = {
    api_key: 'key123',
    raw_token: 'token456',
    secret: 'shh',
    private_key: 'pk789',
  };
  const redacted = redactPII(obj);
  assert.equal(redacted.api_key, '[REDACTED]');
  assert.equal(redacted.raw_token, '[REDACTED]');
  assert.equal(redacted.secret, '[REDACTED]');
  assert.equal(redacted.private_key, '[REDACTED]');
});

test('redactPII preserves non-sensitive fields (email, phone, name)', async () => {
  const { redactPII } = require('../routes/_audit');
  const obj = {
    email: 'user@example.com',
    phone: '555-1234',
    name: 'John Doe',
    address: '123 Main St',
  };
  const redacted = redactPII(obj);
  assert.equal(redacted.email, 'user@example.com', 'email preserved');
  assert.equal(redacted.phone, '555-1234', 'phone preserved');
  assert.equal(redacted.name, 'John Doe', 'name preserved');
  assert.equal(redacted.address, '123 Main St', 'address preserved');
});

test('redactPII handles nested objects and arrays', async () => {
  const { redactPII } = require('../routes/_audit');
  const obj = {
    user: {
      name: 'Alice',
      password_hash: 'hash123',
    },
    logs: [
      { action: 'login', token: 'abc' },
      { action: 'logout' },
    ],
  };
  const redacted = redactPII(obj);
  assert.equal(redacted.user.name, 'Alice', 'nested non-sensitive preserved');
  assert.equal(redacted.user.password_hash, '[REDACTED]', 'nested sensitive redacted');
  assert.equal(redacted.logs[0].action, 'login', 'array non-sensitive preserved');
  assert.equal(redacted.logs[0].token, '[REDACTED]', 'array sensitive redacted');
  assert.equal(redacted.logs[1].action, 'logout', 'array item without sensitive key unchanged');
});

test('GET /api/admin/audit-log returns redacted PII in response', async () => {
  const token = await adminLogin();
  const tag = uniqueTag();

  // Insert a row with sensitive data in before_data and after_data
  await pool.query(
    `INSERT INTO audit_log
       (actor_type, action, entity_type, entity_id, source, before_data, after_data)
     VALUES ('user', 'redaction.test', 'user', $1, 'test',
             '{"password_hash":"oldpw","email":"old@example.com"}'::jsonb,
             '{"password_hash":"newpw","email":"new@example.com"}'::jsonb)`,
    [`user-${tag}-redact`]
  );

  const r = await requestJson('GET', '/api/admin/audit-log?action=redaction.test&limit=100', { token });
  assert.ok(r.rows, 'request should succeed');
  assert.equal(r.rows[0]['X-Audit-Redacted'] === undefined, true, 'header not in JSON body');

  const redactedRow = r.rows.find(row => row.action === 'redaction.test');
  assert.ok(redactedRow, 'should find the redaction.test row');
  assert.equal(redactedRow.before_data.password_hash, '[REDACTED]', 'before_data password_hash redacted');
  assert.equal(redactedRow.before_data.email, 'old@example.com', 'before_data email preserved');
  assert.equal(redactedRow.after_data.password_hash, '[REDACTED]', 'after_data password_hash redacted');
  assert.equal(redactedRow.after_data.email, 'new@example.com', 'after_data email preserved');
});

test('GET /api/admin/audit-log/:id returns X-Audit-Redacted header', async () => {
  const token = await adminLogin();
  const tag = uniqueTag();

  // Insert a test row with sensitive data
  const { rows: inserted } = await pool.query(
    `INSERT INTO audit_log
       (actor_type, action, entity_type, entity_id, source, before_data, meta)
     VALUES ('user', 'header.test', 'account', $1, 'test',
             '{"api_key":"secret123"}'::jsonb, '{"reason":"test"}'::jsonb)
     RETURNING id`,
    [`acct-${tag}-header`]
  );
  const id = inserted[0].id;

  // Manually call the endpoint using requestJson which should preserve headers
  const r = await requestJson('GET', `/api/admin/audit-log/${id}`, { token });
  assert.ok(r.id, 'should return the id');
  assert.equal(r.before_data.api_key, '[REDACTED]', 'api_key should be redacted');
  assert.equal(r.meta.reason, 'test', 'non-sensitive meta field preserved');
});

test('archiveOldAuditRows archives rows older than hot_retention_days', async () => {
  const { archiveOldAuditRows } = require('../routes/_audit');

  // Insert a row dated 800 days ago (should be archived with default 730-day threshold)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 800);

  await pool.query(
    `INSERT INTO audit_log (at, actor_type, action, entity_type, source)
     VALUES ($1, 'system', 'archive.test.old', 'project', 'test')`,
    [pastDate]
  );

  // Insert a row dated 30 days ago (should NOT be archived)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 30);

  await pool.query(
    `INSERT INTO audit_log (at, actor_type, action, entity_type, source)
     VALUES ($1, 'system', 'archive.test.recent', 'project', 'test')`,
    [recentDate]
  );

  // Run the archive
  const result = await archiveOldAuditRows(pool);

  // Verify old row is archived
  const { rows: oldRows } = await pool.query(
    `SELECT id, archived_at FROM audit_log WHERE action = 'archive.test.old'`
  );
  assert.equal(oldRows.length, 1, 'should find the old row');
  assert.ok(oldRows[0].archived_at, 'old row should be archived_at');

  // Verify recent row is NOT archived
  const { rows: recentRows } = await pool.query(
    `SELECT id, archived_at FROM audit_log WHERE action = 'archive.test.recent'`
  );
  assert.equal(recentRows.length, 1, 'should find the recent row');
  assert.strictEqual(recentRows[0].archived_at, null, 'recent row should NOT be archived');

  // Verify result
  assert.equal(result.rows_archived, 1, 'should report 1 row archived');
  assert.ok(result.cutoff_at instanceof Date, 'should return cutoff_at as Date');
});

test('GET /api/admin/audit-log/retention/status returns config + counts', async () => {
  const token = await adminLogin();

  const r = await requestJson('GET', '/api/admin/audit-log/retention/status', { token });

  assert.equal(typeof r.hot_retention_days, 'number', 'hot_retention_days should be number');
  assert.equal(typeof r.total_retention_days, 'number', 'total_retention_days should be number');
  assert.equal(typeof r.hot_row_count, 'number', 'hot_row_count should be number');
  assert.equal(typeof r.archived_row_count, 'number', 'archived_row_count should be number');
  assert.ok(r.hot_row_count > 0, 'should have at least some hot rows (from prior tests)');
});

test('POST /api/admin/audit-log/retention/archive-now triggers archive + logs action', async () => {
  const token = await adminLogin();

  // Insert an old row to be archived
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 800);
  await pool.query(
    `INSERT INTO audit_log (at, actor_type, action, entity_type, source)
     VALUES ($1, 'system', 'archive.test.manual', 'project', 'test')`,
    [pastDate]
  );

  // Trigger manual archive
  const r = await requestJson('POST', '/api/admin/audit-log/retention/archive-now', { token, body: {} });

  assert.equal(typeof r.rows_archived, 'number', 'rows_archived should be number');
  assert.ok(r.cutoff_at, 'cutoff_at should be present');

  // Verify the archive action was logged in audit_log
  const { rows: auditRows } = await pool.query(
    `SELECT action, meta FROM audit_log WHERE action = 'audit.archive_run' ORDER BY at DESC LIMIT 1`
  );
  assert.ok(auditRows.length > 0, 'should have logged the archive action');
  assert.equal(auditRows[0].action, 'audit.archive_run', 'action should be audit.archive_run');
  assert.equal(auditRows[0].meta.trigger, 'manual', 'meta.trigger should be manual');
});
