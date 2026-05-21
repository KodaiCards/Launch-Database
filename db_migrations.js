// db_migrations.js — versioned migrations runner.
//
// Idempotent migrations live in /migrations/NNNN_label.sql. On boot
// runMigrations() reads that directory, sorts by filename, and runs
// every file whose name isn't already in the schema_migrations table.
// Each migration runs in its own transaction so a partial failure
// doesn't corrupt the migration log.
//
// Coexists with the legacy bootstrapV3Schema() in server.js. New schema
// changes go here; the v3 bootstrap stays for backward compat with
// existing deploys until it's gradually empty enough to remove.
//
// Filename convention:
//   0001_initial_baseline.sql
//   0002_add_widget_table.sql
//   0003_drop_legacy_column.sql
//
// File contents: any number of SQL statements separated by semicolons.
// Idempotent constructs (CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT
// EXISTS) are preferred so re-running a half-applied migration is safe.

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function _ensureLogTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      checksum VARCHAR(64)
    )
  `);
}

function _listMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && !f.startsWith('.'))
    .sort();
}

async function _appliedSet(pool) {
  const { rows } = await pool.query(`SELECT filename FROM schema_migrations`);
  return new Set(rows.map(r => r.filename));
}

function _checksum(s) {
  // Tiny hash so tampering with an applied migration is detectable.
  // Not cryptographic; fnv1a-ish is fine for "did the file change".
  let h = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < s.length; i++) {
    h ^= BigInt(s.charCodeAt(i));
    h = (h * prime) & 0xffffffffffffffffn;
  }
  return h.toString(16).padStart(16, '0');
}

async function runMigrations(pool, opts = {}) {
  const verbose = opts.verbose !== false;
  await _ensureLogTable(pool);
  const files = _listMigrations();
  if (!files.length) {
    if (verbose) console.log('[migrations] no files in /migrations — nothing to apply');
    return { applied: 0, skipped: 0, files: [] };
  }
  const applied = await _appliedSet(pool);
  let appliedCount = 0;
  let skippedCount = 0;
  const log = [];
  for (const filename of files) {
    if (applied.has(filename)) {
      skippedCount++;
      log.push({ filename, status: 'skipped' });
      continue;
    }
    const full = path.join(MIGRATIONS_DIR, filename);
    let sql;
    try { sql = fs.readFileSync(full, 'utf8'); }
    catch (e) {
      log.push({ filename, status: 'read-error', error: e.message });
      throw e;
    }
    const checksum = _checksum(sql);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Statement-by-statement is risky for files with PL/pgSQL functions
      // because $$ delimiters get split on raw semicolons. Instead, run
      // the whole file as one query — pg's parser handles dollar-quoted
      // bodies correctly. The trade-off: a syntax error in one
      // statement aborts the entire file (which is what we want anyway
      // since BEGIN / COMMIT is the unit of atomicity).
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`,
        [filename, checksum]
      );
      await client.query('COMMIT');
      appliedCount++;
      log.push({ filename, status: 'applied', checksum });
      if (verbose) console.log(`[migrations] applied ${filename}`);
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      log.push({ filename, status: 'failed', error: e.message });
      console.error(`[migrations] FAILED ${filename}:`, e.message);
      // DO NOT throw — continue to next migration so a single broken file
      // doesn't block all subsequent ones. The failed migration is NOT
      // recorded in schema_migrations, so it will retry on next boot.
    } finally {
      client.release();
    }
  }
  return { applied: appliedCount, skipped: skippedCount, files: log };
}

module.exports = { runMigrations, _internal: { _checksum, _listMigrations, _ensureLogTable } };
