// tests/wave6_ongoing_projects.test.js
//
// Tests for Wave 6: Ongoing Projects backend additions
//  1. POST /api/projects accepts + stores is_ongoing
//  2. PUT /api/projects/:id updates is_ongoing
//  3. GET /api/projects/:id/monthly-hours-breakdown returns correct data
//  4. POST /api/projects/:id/generate-monthly-invoice creates invoice + item
//  5. POST /api/projects/:id/generate-monthly-invoice is idempotent (returns existing)
//
// NOTE: DATABASE_URL must be set. Tests skip gracefully via _helpers.js error if it isn't.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [],
  projects: [],
  staff: [],
};

const extraCleanup = {
  invoices: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  if (extraCleanup.invoices.length) {
    try {
      await pool.query(
        `DELETE FROM invoice_items WHERE invoice_id = ANY($1::uuid[])`,
        [extraCleanup.invoices]
      );
      await pool.query(
        `DELETE FROM invoices WHERE id = ANY($1::uuid[])`,
        [extraCleanup.invoices]
      );
    } catch (e) {
      console.warn('[cleanup] invoices DELETE failed:', e.message);
    }
  }
  await cleanupAll(cleanup);
  await close();
});

// ─── Fixtures ──────────────────────────────────────────────────────────────

let sharedClient;
let sharedStaff;

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('wave6-client') });
  cleanup.clients.push(sharedClient.id);

  sharedStaff = await fixtures.staff({ name: uniqueTag('wave6-staff') });
  cleanup.staff.push(sharedStaff.id);
});

// ─── Test 1: POST /api/projects stores is_ongoing ───────────────────────────

test('POST /api/projects stores is_ongoing=true', async () => {
  const projName = uniqueTag('ongoing-proj-create');

  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      is_ongoing: true,
      billing_cadence: 'monthly',
      status: 'active',
    }
  );
  assert.ok(projRes.id, 'project creation must return id');
  assert.equal(projRes.is_ongoing, true, 'POST response must include is_ongoing=true');
  cleanup.projects.push(projRes.id);

  const { rows } = await pool.query(
    'SELECT is_ongoing FROM projects WHERE id = $1',
    [projRes.id]
  );
  assert.ok(rows.length, 'project must exist in DB');
  assert.equal(rows[0].is_ongoing, true, 'DB row must have is_ongoing=true');
});

test('POST /api/projects defaults is_ongoing to false when not provided', async () => {
  const projName = uniqueTag('non-ongoing-proj');

  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      status: 'active',
    }
  );
  assert.ok(projRes.id, 'project creation must return id');
  assert.ok(
    projRes.is_ongoing === false || projRes.is_ongoing === null || projRes.is_ongoing === undefined,
    'POST response must have falsy is_ongoing when not provided'
  );
  cleanup.projects.push(projRes.id);
});

// ─── Test 2: PUT /api/projects/:id updates is_ongoing ───────────────────────

test('PUT /api/projects/:id updates is_ongoing from false to true', async () => {
  const projName = uniqueTag('toggle-ongoing-proj');

  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      is_ongoing: false,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);
  assert.ok(!projRes.is_ongoing, 'initial is_ongoing must be falsy');

  const updRes = await requestJson(
    'PUT',
    `/api/projects/${projRes.id}`,
    { token },
    { is_ongoing: true, billing_cadence: 'monthly' }
  );
  assert.equal(updRes.is_ongoing, true, 'PUT response must reflect is_ongoing=true');

  const { rows } = await pool.query(
    'SELECT is_ongoing FROM projects WHERE id = $1',
    [projRes.id]
  );
  assert.equal(rows[0].is_ongoing, true, 'DB must have updated is_ongoing=true');
});

test('PUT /api/projects/:id can set is_ongoing back to false', async () => {
  const projName = uniqueTag('toggle-off-proj');

  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      is_ongoing: true,
      billing_cadence: 'monthly',
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  const updRes = await requestJson(
    'PUT',
    `/api/projects/${projRes.id}`,
    { token },
    { is_ongoing: false }
  );
  assert.ok(!updRes.is_ongoing, 'PUT response must reflect is_ongoing=false');
});

// ─── Test 3: GET /api/projects/:id/monthly-hours-breakdown ──────────────────

test('GET /api/projects/:id/monthly-hours-breakdown returns correct monthly data', async () => {
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: uniqueTag('breakdown-proj'),
      client_id: sharedClient.id,
      is_ongoing: true,
      billing_cadence: 'monthly',
      billing_rate: 100,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  // Seed two time entries in different months via direct DB insert
  await fixtures.timeEntry({
    project_id: projRes.id,
    staff_id: sharedStaff.id,
    entry_date: '2025-01-15',
    hours: 8,
  });
  await fixtures.timeEntry({
    project_id: projRes.id,
    staff_id: sharedStaff.id,
    entry_date: '2025-01-20',
    hours: 4,
  });
  await fixtures.timeEntry({
    project_id: projRes.id,
    staff_id: sharedStaff.id,
    entry_date: '2025-02-10',
    hours: 6,
  });

  const breakdown = await requestJson(
    'GET',
    `/api/projects/${projRes.id}/monthly-hours-breakdown`,
    { token }
  );

  assert.ok(Array.isArray(breakdown), 'response must be an array');
  assert.ok(breakdown.length >= 2, 'must have at least 2 month rows');

  const jan = breakdown.find(r => r.year === 2025 && r.month === 1);
  assert.ok(jan, 'January 2025 row must be present');
  assert.equal(parseFloat(jan.hours), 12, 'January hours must sum to 12');

  const feb = breakdown.find(r => r.year === 2025 && r.month === 2);
  assert.ok(feb, 'February 2025 row must be present');
  assert.equal(parseFloat(feb.hours), 6, 'February hours must be 6');
});

test('GET /api/projects/:id/monthly-hours-breakdown returns empty array for project with no hours', async () => {
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: uniqueTag('no-hours-proj'),
      client_id: sharedClient.id,
      is_ongoing: true,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  const breakdown = await requestJson(
    'GET',
    `/api/projects/${projRes.id}/monthly-hours-breakdown`,
    { token }
  );

  assert.ok(Array.isArray(breakdown), 'response must be an array');
  assert.equal(breakdown.length, 0, 'no hours means empty array');
});

// ─── Test 4: POST /api/projects/:id/generate-monthly-invoice ────────────────

test('POST /api/projects/:id/generate-monthly-invoice creates invoice and item', async () => {
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: uniqueTag('invoice-gen-proj'),
      client_id: sharedClient.id,
      is_ongoing: true,
      billing_cadence: 'monthly',
      billing_rate: 100,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  // Seed some hours for January 2025
  await fixtures.timeEntry({
    project_id: projRes.id,
    staff_id: sharedStaff.id,
    entry_date: '2025-03-10',
    hours: 10,
  });

  const result = await requestJson(
    'POST',
    `/api/projects/${projRes.id}/generate-monthly-invoice`,
    { token },
    { month: 3, year: 2025 }
  );

  assert.ok(result.invoice, 'result must contain invoice');
  assert.equal(result.existing, false, 'first call must not return existing=true');
  assert.ok(result.invoice.id, 'invoice must have id');
  assert.equal(result.invoice.status, 'draft', 'invoice must be in draft status');
  extraCleanup.invoices.push(result.invoice.id);

  // Verify invoice_item was created
  const { rows: items } = await pool.query(
    'SELECT * FROM invoice_items WHERE invoice_id = $1 AND project_id = $2',
    [result.invoice.id, projRes.id]
  );
  assert.ok(items.length, 'invoice_items row must exist');
  assert.equal(parseFloat(items[0].quantity), 10, 'quantity must match hours (10)');
  assert.equal(parseFloat(items[0].rate), 100, 'rate must match billing_rate (100)');
  assert.equal(parseFloat(items[0].amount), 1000, 'amount must be hours × rate = 1000');
});

// ─── Test 5: Idempotency — second call returns existing invoice ─────────────

test('POST /api/projects/:id/generate-monthly-invoice is idempotent', async () => {
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: uniqueTag('idempotent-invoice-proj'),
      client_id: sharedClient.id,
      is_ongoing: true,
      billing_cadence: 'monthly',
      billing_rate: 75,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  await fixtures.timeEntry({
    project_id: projRes.id,
    staff_id: sharedStaff.id,
    entry_date: '2025-04-15',
    hours: 5,
  });

  // First call — should create
  const first = await requestJson(
    'POST',
    `/api/projects/${projRes.id}/generate-monthly-invoice`,
    { token },
    { month: 4, year: 2025 }
  );
  assert.equal(first.existing, false, 'first call must create a new invoice');
  assert.ok(first.invoice.id, 'first call must return invoice id');
  extraCleanup.invoices.push(first.invoice.id);

  // Second call — should return existing
  const second = await requestJson(
    'POST',
    `/api/projects/${projRes.id}/generate-monthly-invoice`,
    { token },
    { month: 4, year: 2025 }
  );
  assert.equal(second.existing, true, 'second call must return existing=true');
  assert.ok(second.invoice, 'second call must return the invoice object');
  assert.equal(second.invoice.id, first.invoice.id, 'second call must return the same invoice id');

  // Verify only one invoice was created for this project + period
  const { rows: invRows } = await pool.query(`
    SELECT i.id FROM invoices i
    JOIN invoice_items ii ON ii.invoice_id = i.id
    WHERE ii.project_id = $1
      AND i.billing_period_start = '2025-04-01'
      AND i.billing_period_end   = '2025-04-30'
  `, [projRes.id]);
  assert.equal(invRows.length, 1, 'exactly one invoice must exist for this project + period');
});
