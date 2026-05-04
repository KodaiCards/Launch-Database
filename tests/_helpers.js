// ═══════════════════════════════════════════════════════════════════════════
// tests/_helpers.js
//
// Shared test scaffolding. Booted once per test file so tests stay fast.
//
// Boots server.js on an ephemeral port against the DATABASE_URL the runner
// gives it (CI provides a service-container Postgres; locally, set
// TEST_DATABASE_URL in your shell or a .env.test file). Provides:
//
//   bootTestServer()  → { baseUrl, server, close, pool }
//   adminLogin()      → JWT token (creates the default admin via the
//                       ADMIN_PASSWORD env var if not already seeded)
//   request()         → thin fetch wrapper that injects the bearer token
//                       and JSON content-type
//   fixtures.*        → direct-DB seeders for client/contract/job/project/
//                       staff/time-entry, returning the inserted rows
//   uniqueTag()       → time + random suffix so parallel runs don't collide
//
// Tests should call bootTestServer() in a `before()`, close() in `after()`,
// and seed/clean up their own fixtures by id. Direct DB seeders are used
// instead of the API for fixtures because (a) they're faster and (b) we
// want the SUT (system under test) to be the API call we're asserting,
// not the seeding path.
// ═══════════════════════════════════════════════════════════════════════════

// Default test env vars. We set these BEFORE requiring server.js so dotenv +
// auth.js + db.js read the right values. Tests that need different values
// can set them in the shell/CI before running this file.
//
// We intentionally do NOT default DATABASE_URL — it MUST be set explicitly
// so a developer running tests doesn't accidentally point at production.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-' + Math.random().toString(36).slice(2);
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';
// Prefer TEST_DATABASE_URL if the operator set it, so a dev .env pointing at
// a real DB doesn't get clobbered by tests.
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL (or TEST_DATABASE_URL) must be set before running tests. ' +
    'In CI the postgres service container injects this; locally, set it in your shell or .env.test.'
  );
}

const path = require('path');
const crypto = require('crypto');

// Require AFTER env vars are set. server.js / db.js / auth.js read process.env
// at module-load time.
const { start } = require(path.join(__dirname, '..', 'server.js'));
const { pool } = require(path.join(__dirname, '..', 'db.js'));

let _server = null;
let _baseUrl = null;

async function bootTestServer() {
  if (_server) return { baseUrl: _baseUrl, server: _server, pool, close };
  _server = await start({ port: 0, skipScheduler: true });
  const { port } = _server.address();
  _baseUrl = `http://127.0.0.1:${port}`;
  return { baseUrl: _baseUrl, server: _server, pool, close };
}

async function close() {
  if (_server) {
    await new Promise((resolve) => _server.close(resolve));
    _server = null;
    _baseUrl = null;
  }
  // Drain the pool so the test process exits cleanly. pool.end() is idempotent
  // but throws if already ended; swallow.
  try { await pool.end(); } catch {}
}

// ─── Auth ─────────────────────────────────────────────────────────────────
let _adminToken = null;
async function adminLogin() {
  if (_adminToken) return _adminToken;
  if (!_baseUrl) throw new Error('bootTestServer() must be called before adminLogin()');
  const res = await fetch(`${_baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: process.env.ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin login failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  _adminToken = json.token;
  if (!_adminToken) throw new Error('Login response missing token');
  return _adminToken;
}

// ─── Request wrapper ──────────────────────────────────────────────────────
// Bearer-token auth bypasses the CSRF Origin check (see server.js CSRF
// middleware). Body is auto-stringified for objects; pass a Buffer/stream
// for binary uploads.
async function request(method, urlPath, opts = {}) {
  if (!_baseUrl) throw new Error('bootTestServer() must be called before request()');
  const headers = { ...(opts.headers || {}) };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  let body = opts.body;
  if (body !== undefined && typeof body === 'object' && !(body instanceof Buffer)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(`${_baseUrl}${urlPath}`, { method, headers, body });
  return res;
}

// Convenience: parse JSON and assert status. Throws with the response body
// for diagnosis if status doesn't match expected.
async function requestJson(method, urlPath, opts = {}) {
  const res = await request(method, urlPath, opts);
  const expected = opts.expectStatus || 200;
  const text = await res.text();
  if (res.status !== expected) {
    throw new Error(`${method} ${urlPath} expected ${expected}, got ${res.status}: ${text}`);
  }
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

// ─── Unique tagging ───────────────────────────────────────────────────────
// Test runs share a DB; collisions on UNIQUE columns (clients.name,
// contracts(client_id, contract_number)) would kill repeated runs. Tag every
// fixture name with a per-run prefix so each run is isolated.
const RUN_TAG = `t${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
let _seq = 0;
function uniqueTag(label = 'fx') {
  _seq++;
  return `${label}-${RUN_TAG}-${_seq}`;
}

// ─── Direct-DB fixture seeders ────────────────────────────────────────────
// We INSERT directly with the pool to keep tests fast and make the API call
// being tested the only API surface exercised. Each helper returns the full
// inserted row so the test can grab the generated UUID.
const fixtures = {
  async client({ name, is_rus = true } = {}) {
    const n = name || uniqueTag('client');
    const { rows } = await pool.query(
      `INSERT INTO clients (name, is_rus) VALUES ($1, $2) RETURNING *`,
      [n, is_rus]
    );
    return rows[0];
  },

  async engineeringContract({ client_id, name, contract_number, loan_name } = {}) {
    if (!client_id) throw new Error('engineeringContract requires client_id');
    const n = name || uniqueTag('eng-contract');
    const num = contract_number || uniqueTag('EC');
    const { rows } = await pool.query(
      `INSERT INTO engineering_contracts (client_id, name, contract_number, loan_name)
         VALUES ($1, $2, $3, $4) RETURNING *`,
      [client_id, n, num, loan_name || null]
    );
    return rows[0];
  },

  async contract({ client_id, contract_number, name, engineering_contract_id, friendly_label } = {}) {
    if (!client_id) throw new Error('contract requires client_id');
    const num = contract_number || uniqueTag('CN');
    const { rows } = await pool.query(
      `INSERT INTO contracts (client_id, contract_number, name, engineering_contract_id, friendly_label)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, num, name || null, engineering_contract_id || null, friendly_label || null]
    );
    return rows[0];
  },

  async job({ name, default_billing_type = 'hourly', team = 'inspection', default_rate = 90, is_permitting = false, billing_code = null } = {}) {
    const n = name || uniqueTag('job');
    // Columns added by bootstrapV3Schema (team, billing_code, for_psc_client,
    // for_generic_client) all default to sensible values. We only set the
    // ones tests explicitly care about.
    const { rows } = await pool.query(
      `INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting, team, billing_code, active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *`,
      [n, default_billing_type, default_rate, is_permitting, team, billing_code]
    );
    return rows[0];
  },

  async project({
    name, client_id, contract_id, job_id, parent_id = null,
    project_type = 'inspection', billing_type = 'hourly', billing_rate = 90,
    status = 'active', footage = null, expected_revenue = null,
    work_order_number = null,
  } = {}) {
    if (!client_id) throw new Error('project requires client_id');
    const n = name || uniqueTag('proj');
    const { rows } = await pool.query(
      `INSERT INTO projects
         (name, client_id, contract_id, job_id, parent_id, project_type, billing_type, billing_rate, status, footage, expected_revenue, work_order_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [n, client_id, contract_id || null, job_id || null, parent_id, project_type, billing_type, billing_rate, status, footage, expected_revenue, work_order_number]
    );
    return rows[0];
  },

  async staff({ name } = {}) {
    const n = name || uniqueTag('staff');
    // staff schema is intentionally lean: id, name, active, created_at.
    // Hourly rate lives on the project/job, not the staff member.
    const { rows } = await pool.query(
      `INSERT INTO staff (name, active) VALUES ($1, TRUE) RETURNING *`,
      [n]
    );
    return rows[0];
  },

  async timeEntry({ project_id, staff_id, entry_date, hours = 8, job_title = 'Inspector' } = {}) {
    if (!project_id) throw new Error('timeEntry requires project_id');
    if (!staff_id) throw new Error('timeEntry requires staff_id');
    if (!entry_date) throw new Error('timeEntry requires entry_date (YYYY-MM-DD)');
    const { rows } = await pool.query(
      `INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, staff_id, entry_date, hours, job_title]
    );
    return rows[0];
  },
};

// ─── Cleanup ──────────────────────────────────────────────────────────────
// Tests can pass an array of {table, id} pairs (or call individual deletes).
// This is best-effort: if a row was already cascade-deleted by a parent, the
// DELETE is a no-op. We DELETE in a permissive order so the common shapes
// (time_entries → projects → contracts → engineering_contracts → clients,
// plus jobs and staff) work regardless of insert order.
const CLEANUP_ORDER = [
  'time_entries', 'invoice_items', 'permit_documents', 'permit_stages',
  'invoices', 'projects', 'contracts', 'engineering_contracts',
  'clients', 'jobs', 'staff', 'undo_buckets',
];

async function deleteByIds(table, ids) {
  if (!ids || !ids.length) return;
  try {
    // projects has ON DELETE RESTRICT on parent_id, so a flat DELETE fails
    // when a tree is in the cleanup set. NULL out the back-reference first
    // so deletion order across the array doesn't matter.
    if (table === 'projects') {
      await pool.query(`UPDATE projects SET parent_id = NULL WHERE id = ANY($1::uuid[])`, [ids]);
    }
    await pool.query(`DELETE FROM ${table} WHERE id = ANY($1::uuid[])`, [ids]);
  } catch (e) {
    // Some tables (e.g. undo_buckets) may have rows with id types that don't
    // match — surface but don't fail the test cleanup.
    console.warn(`[cleanup] DELETE FROM ${table} failed:`, e.message);
  }
}

// Cleanup pass for an entire test file: pass an object keyed by table.
//
// Best-effort: if a test failed mid-way and left orphan time_entries /
// invoice_items / permit rows on a tracked project, FK RESTRICT would
// otherwise block the projects DELETE. We sweep those leaf tables first
// using the project_id list before falling back to id-based deletes.
async function cleanupAll(buckets = {}) {
  if (buckets.projects && buckets.projects.length) {
    const ids = buckets.projects;
    try {
      await pool.query(`DELETE FROM time_entries WHERE project_id = ANY($1::uuid[])`, [ids]);
      await pool.query(`DELETE FROM invoice_items WHERE project_id = ANY($1::uuid[])`, [ids]);
      await pool.query(`DELETE FROM permit_documents WHERE project_id = ANY($1::uuid[])`, [ids]);
      await pool.query(`DELETE FROM permit_stages WHERE project_id = ANY($1::uuid[])`, [ids]);
    } catch (e) {
      console.warn('[cleanup] project-leaf sweep failed:', e.message);
    }
  }
  for (const table of CLEANUP_ORDER) {
    if (buckets[table]) await deleteByIds(table, buckets[table]);
  }
}

// Exposes the currently-listening base URL for tests that need to fetch
// directly (e.g. multipart uploads where the request() helper's
// JSON-stringify branch would corrupt the body). bootTestServer must
// have been awaited before this returns a non-null value.
function baseUrl() { return _baseUrl; }

module.exports = {
  bootTestServer,
  close,
  adminLogin,
  request,
  requestJson,
  uniqueTag,
  fixtures,
  deleteByIds,
  cleanupAll,
  baseUrl,
  pool,
};
