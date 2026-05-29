// tests/project_billing.test.js
//
// Wave 171 regression tests for routes/project_billing.js.
// Covers:
//   PB-1: 500 errors must not expose raw Postgres error text
//   PB-2: successful unbill creates an audit_log row (action='project_billing.unbill')
//   PB-3: design_manager cannot act on a permitting-team project (404)
//   PB-4: bill-and-clone rejects non-numeric billed_amount (400);
//         fractional amounts are stored rounded to 2 dp
//
// Requires: DATABASE_URL (or TEST_DATABASE_URL) pointing at a test Postgres.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const {
  bootTestServer, close, adminLogin, requestJson, request,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

// ---- Shared state ----------------------------------------------------------
let adminToken;
let designManagerToken;

const trash = {
  clients: [],
  projects: [],
  jobs: [],
  users: [],
  invoices: [],
};

// ---- Login helper ----------------------------------------------------------

async function loginAs(role) {
  const tag = uniqueTag(role);
  const hash = await bcrypt.hash('TestPass123!', 10);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
    [tag, hash, role, `Test ${role}`]
  );
  trash.users.push(rows[0].id);

  const loginRes = await request('POST', '/api/auth/login', {
    body: { username: tag, password: 'TestPass123!' },
  });
  if (!loginRes.ok) {
    const txt = await loginRes.text();
    throw new Error(`Login failed for ${tag} (${loginRes.status}): ${txt}`);
  }
  const json = await loginRes.json();
  return { id: rows[0].id, token: json.token };
}

// ---- Lifecycle -------------------------------------------------------------

before(async () => {
  await bootTestServer();
  adminToken = await adminLogin();
  const dm = await loginAs('design_manager');
  designManagerToken = dm.token;
});

after(async () => {
  if (trash.invoices.length) {
    await pool.query(
      `DELETE FROM invoice_items WHERE invoice_id = ANY($1::uuid[])`,
      [trash.invoices]
    ).catch(() => {});
    await pool.query(
      `DELETE FROM invoices WHERE id = ANY($1::uuid[])`,
      [trash.invoices]
    ).catch(() => {});
  }
  if (trash.projects.length) {
    await pool.query(
      `UPDATE projects SET parent_id = NULL WHERE id = ANY($1::uuid[])`,
      [trash.projects]
    ).catch(() => {});
  }
  await cleanupAll(trash);
  if (trash.users.length) {
    await pool.query(
      `DELETE FROM users WHERE id = ANY($1::int[])`,
      [trash.users]
    ).catch(() => {});
  }
  await close();
});

// ---- Fixture helper --------------------------------------------------------

async function seedProject({ team = 'design' } = {}) {
  const client = await fixtures.client();
  trash.clients.push(client.id);

  const job = await fixtures.job({ name: uniqueTag('job'), team });
  trash.jobs.push(job.id);

  const project = await fixtures.project({
    name: uniqueTag('proj'),
    client_id: client.id,
    job_id: job.id,
    status: 'active',
    billing_rate: 90,
  });
  trash.projects.push(project.id);
  return { client, job, project };
}

// ============================================================================
// PB-1: error sanitization — 500 must not expose Postgres error text
// ============================================================================

test('PB-1: unbill 500 response body is sanitized (no PG error text)', async () => {
  // Non-UUID triggers a Postgres cast error whose message would include
  // "invalid input syntax for type uuid" if not sanitized.
  const raw = await request('POST', '/api/projects/not-a-valid-uuid/unbill', {
    token: adminToken,
  });
  assert.equal(raw.status, 500);
  const body = await raw.json();
  assert.equal(body.error, 'Internal error.',
    `Expected sanitized error, got: ${body.error}`);
  assert.ok(
    !body.error.includes('invalid input') && !body.error.includes('uuid'),
    `Must not leak PG text: ${body.error}`
  );
});

test('PB-1: mark-billed 500 response body is sanitized', async () => {
  const raw = await request('PUT', '/api/projects/not-a-valid-uuid/mark-billed', {
    token: adminToken,
  });
  assert.equal(raw.status, 500);
  const body = await raw.json();
  assert.equal(body.error, 'Internal error.');
  assert.ok(!body.error.includes('invalid input'));
});

test('PB-1: bill-and-clone 500 response body is sanitized', async () => {
  const raw = await request('POST', '/api/projects/not-a-valid-uuid/bill-and-clone', {
    token: adminToken,
    body: { billed_amount: '100.00' },
  });
  assert.equal(raw.status, 500);
  const body = await raw.json();
  assert.equal(body.error, 'Internal error.');
  assert.ok(!body.error.includes('invalid input'));
});

// ============================================================================
// PB-2: audit log on successful unbill
// ============================================================================

test('PB-2: successful unbill creates audit_log row with action=project_billing.unbill', async () => {
  const { project } = await seedProject({ team: 'design' });

  // Set project to billed state so unbill is meaningful
  await pool.query(
    `UPDATE projects SET status='billed', billed_date=NOW() WHERE id=$1`,
    [project.id]
  );

  const res = await requestJson('POST', `/api/projects/${project.id}/unbill`, {
    token: adminToken,
  });
  assert.ok(res.id || res.name, 'unbill must return updated project row');

  const { rows } = await pool.query(
    `SELECT action, entity_type, entity_id, source
     FROM audit_log
     WHERE entity_type = 'project' AND entity_id = $1
       AND action = 'project_billing.unbill'
     ORDER BY at DESC LIMIT 1`,
    [project.id]
  );
  assert.equal(rows.length, 1, 'audit_log must have a project_billing.unbill row');
  assert.equal(rows[0].action, 'project_billing.unbill');
  assert.equal(rows[0].entity_type, 'project');
  assert.equal(rows[0].source, 'admin');
});

// ============================================================================
// PB-3: manager team-scope — design_manager cannot act on permitting projects
// ============================================================================

test('PB-3: design_manager gets 404 on unbill of permitting-team project', async () => {
  const { project } = await seedProject({ team: 'permitting' });
  await pool.query(
    `UPDATE projects SET status='billed', billed_date=NOW() WHERE id=$1`,
    [project.id]
  );
  const raw = await request('POST', `/api/projects/${project.id}/unbill`, {
    token: designManagerToken,
  });
  assert.equal(raw.status, 404);
});

test('PB-3: design_manager gets 404 on mark-billed of permitting-team project', async () => {
  const { project } = await seedProject({ team: 'permitting' });
  const raw = await request('PUT', `/api/projects/${project.id}/mark-billed`, {
    token: designManagerToken,
  });
  assert.equal(raw.status, 404);
});

test('PB-3: design_manager gets 404 on bill-and-clone of permitting-team project', async () => {
  const { project } = await seedProject({ team: 'permitting' });
  const raw = await request('POST', `/api/projects/${project.id}/bill-and-clone`, {
    token: designManagerToken,
    body: { billed_amount: '500.00' },
  });
  assert.equal(raw.status, 404);
});

// ============================================================================
// PB-4: billed_amount coercion
// ============================================================================

test('PB-4: bill-and-clone rejects non-numeric billed_amount with 400', async () => {
  const { project } = await seedProject({ team: 'design' });
  const raw = await request('POST', `/api/projects/${project.id}/bill-and-clone`, {
    token: adminToken,
    body: { billed_amount: 'abc' },
  });
  assert.equal(raw.status, 400, 'non-numeric billed_amount must return 400');
  const body = await raw.json();
  assert.ok(body.error, 'must return an error message');
});

test('PB-4: bill-and-clone stores billed_amount rounded to 2 decimal places', async () => {
  const { project } = await seedProject({ team: 'design' });

  const res = await requestJson('POST', `/api/projects/${project.id}/bill-and-clone`, {
    token: adminToken,
    body: {
      billed_amount: '12.345',
      invoice_number: uniqueTag('INV'),
      create_follow_on: false,
    },
  });
  assert.ok(res.invoice_id, 'must return invoice_id');
  trash.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT total_amount FROM invoices WHERE id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows.length, 1, 'invoice row must exist');
  const stored = parseFloat(rows[0].total_amount);
  assert.equal(stored, 12.35, `Expected 12.35 (2dp rounded), got ${stored}`);
});
