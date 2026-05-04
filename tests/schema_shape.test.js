// Schema shape smoke test — asserts that initSchema() + the v3 / auth /
// timeclock bootstraps in server.js produced a database that matches the
// expectations the rest of the app holds.
//
// Why this exists: in 2026-05-04 a forward-reference in schema.sql aborted
// init silently. EVERY subsequent test failed with cascading "relation X
// does not exist" errors that didn't point at the root cause. This test
// runs FIRST (filename starts with `_` so it sorts before feature tests
// after _sanity), and its assertions are framed as "X must exist after
// boot" — so a future schema regression yields a clear, single failure
// instead of a noisy cascade.
//
// Maintenance: only check tables/columns that are CRITICAL for boot.
// Don't add every column added to every table — that becomes a brittle
// schema dump. Stick to the ones that broke last time, plus the
// base-table presence check.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { bootTestServer, close, pool } = require('./_helpers');

before(async () => { await bootTestServer(); });
after(async () => { await close(); });

// Helper — assert a table exists.
async function assertTable(name) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1`,
    [name]
  );
  assert.equal(rows.length, 1, `table "${name}" should exist after schema init`);
}

// Helper — assert a column exists on a table.
async function assertColumn(table, column) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name=$1 AND column_name=$2`,
    [table, column]
  );
  assert.equal(rows.length, 1, `column "${table}.${column}" should exist after schema init`);
}

test('base tables exist', async () => {
  // The original schema.sql tables. If schema init aborts midway,
  // some of these will be missing — exactly what we're guarding against.
  for (const t of [
    'clients', 'jobs', 'projects', 'staff', 'contracts', 'time_entries',
    'permit_stages', 'permit_documents', 'budgets', 'budget_codes',
    'invoices', 'invoice_items',
  ]) await assertTable(t);
});

test('v2 / v3 / portal tables exist', async () => {
  // These come from the SCHEMA v2/v3 bootstrap blocks AND the inline
  // additions in server.js. Same failure mode if init fails partway:
  // the later tables don't exist.
  for (const t of [
    'setting_change_requests', 'engineering_contracts', 'invoice_templates',
    'customer_clients', 'billing_batches', 'billing_batch_items',
    'undo_buckets',
  ]) await assertTable(t);
});

test('auth + timeclock tables exist', async () => {
  for (const t of ['users', 'time_clock_sessions']) await assertTable(t);
});

test('the columns added by the v3 ALTER block exist', async () => {
  // These are the ones that get ADDed via ALTER TABLE ADD COLUMN
  // IF NOT EXISTS in server.js bootstrapV3Schema. If schema.sql's CREATE
  // TABLEs fail partway, these ALTERs silently no-op (relation doesn't
  // exist) and the columns are missing — which is exactly what caused
  // /api/auth/me to 401 in the May 4 incident.
  await assertColumn('jobs', 'billing_code');
  await assertColumn('jobs', 'team');
  await assertColumn('projects', 'is_rollup');
  await assertColumn('projects', 'is_ongoing');
  await assertColumn('clients', 'show_contract');
  await assertColumn('clients', 'show_work_order');
  await assertColumn('time_entries', 'pending_project_request_id');
  await assertColumn('contracts', 'engineering_contract_id');
  await assertColumn('contracts', 'friendly_label');
  await assertColumn('budgets', 'engineering_contract_id');
});

test('the columns added by the auth bootstrap exist', async () => {
  // These get added by bootstrapAuthSchema in auth.js. Same failure
  // mode: if base tables don't exist, the ALTERs no-op and downstream
  // auth queries (especially the staff_id lookup) fail with
  // "column staff_id does not exist".
  await assertColumn('users', 'staff_id');
  await assertColumn('users', 'theme');
  await assertColumn('users', 'extra_teams');
  await assertColumn('projects', 'created_by_user_id');
  await assertColumn('projects', 'updated_by_user_id');
  await assertColumn('time_entries', 'user_id');
  await assertColumn('permit_documents', 'uploaded_by_user_id');
});

test('admin user was seeded', async () => {
  // bootstrapAuthSchema creates a default admin from ADMIN_PASSWORD if
  // none exists. The smoke tests log in as this user; if seeding failed,
  // every auth-required test fails with 401.
  const { rows } = await pool.query(`SELECT id, role FROM users WHERE username='admin' LIMIT 1`);
  assert.equal(rows.length, 1, 'default admin user should be seeded');
  assert.equal(rows[0].role, 'admin');
});
