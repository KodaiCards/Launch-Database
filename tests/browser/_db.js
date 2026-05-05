// Tiny direct-DB helper for Playwright tests. Reuses the same pg pool
// pattern as the node:test smoke tests; we don't share tests/_helpers.js
// because Playwright doesn't use the node:test runner and that file boots
// the server in-process (Playwright boots it as a subprocess via the
// webServer config).
//
// Tests should call seedClient/seedProject etc. in a beforeAll(), and
// cleanup() in an afterAll() so the per-run rows don't leak across runs.

const { Pool } = require('pg');

const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for Playwright tests');
}

const pool = new Pool({ connectionString });

const RUN_TAG = `pw${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
let _seq = 0;
function uniqueTag(label = 'fx') {
  _seq++;
  return `${label}-${RUN_TAG}-${_seq}`;
}

const tracked = {
  clients: [], jobs: [], projects: [], staff: [],
  contracts: [], engineering_contracts: [],
};

async function seedClient({ name } = {}) {
  // Path B (2026-05-04): is_rus dropped from clients. Program lives on
  // engineering contracts. This helper takes only `name` now; callers can
  // safely keep passing is_rus — it's silently ignored.
  const n = name || uniqueTag('client');
  const { rows } = await pool.query(
    `INSERT INTO clients (name) VALUES ($1) RETURNING *`,
    [n]
  );
  tracked.clients.push(rows[0].id);
  return rows[0];
}

async function seedProject({
  name, client_id, parent_id = null,
  project_type = 'inspection', billing_type = 'hourly', billing_rate = 90,
  status = 'active',
} = {}) {
  if (!client_id) throw new Error('seedProject requires client_id');
  const n = name || uniqueTag('proj');
  const { rows } = await pool.query(
    `INSERT INTO projects
       (name, client_id, parent_id, project_type, billing_type, billing_rate, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [n, client_id, parent_id, project_type, billing_type, billing_rate, status]
  );
  tracked.projects.push(rows[0].id);
  return rows[0];
}

async function cleanup() {
  // Order matters: detach project parent_ids first (RESTRICT FK), then
  // delete leaf rows, then projects, then clients.
  if (tracked.projects.length) {
    try {
      await pool.query(`UPDATE projects SET parent_id = NULL WHERE id = ANY($1::uuid[])`, [tracked.projects]);
      await pool.query(`DELETE FROM time_entries WHERE project_id = ANY($1::uuid[])`, [tracked.projects]);
      await pool.query(`DELETE FROM projects WHERE id = ANY($1::uuid[])`, [tracked.projects]);
    } catch (e) { console.warn('[browser-db cleanup projects]', e.message); }
  }
  for (const table of ['clients', 'jobs', 'staff', 'contracts', 'engineering_contracts']) {
    if (!tracked[table].length) continue;
    try {
      await pool.query(`DELETE FROM ${table} WHERE id = ANY($1::uuid[])`, [tracked[table]]);
    } catch (e) { console.warn(`[browser-db cleanup ${table}]`, e.message); }
  }
}

async function close() {
  try { await pool.end(); } catch {}
}

module.exports = { pool, seedClient, seedProject, cleanup, close, uniqueTag };
