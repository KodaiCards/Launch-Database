#!/usr/bin/env node
// scripts/sync_schema.js — Schema auto-sync tool
//
// Regenerates schema.sql by booting a throwaway Postgres database, running
// every bootstrap step + migration exactly as server.js does on startup,
// then dumping the resulting schema with pg_dump.  schema.sql is the
// OUTPUT of this script, never the input.
//
// Bootstrap order (mirrors server.js start()):
//   1. pgcrypto extension
//   2. bootstrapV3Schema DDL (inlined from server.js)
//   3. bootstrapAuthSchema DDL (inlined from auth.js)
//   4. applyDeferredSchemaStatements (re-apply user-FK stmts)
//   5. bootstrapTimeClockSchema DDL (inlined from timeclock_module.js)
//   6. runMigrations() — all /migrations/*.sql in numeric order
//
// REQUIRED ENV:
//   DATABASE_URL  or  TEST_DATABASE_URL
//     — Connection string for the PARENT database (used to CREATE / DROP the
//       temp DB).  The role must have CREATEDB privilege.
//       Example: postgres://myuser:mypass@localhost:5432/mydb
//
// USAGE:
//   npm run schema:sync
//   DATABASE_URL=postgres://... node scripts/sync_schema.js
//
// The temp DB is always dropped at the end, even on error.
// Running twice in a row produces identical output (deterministic).

'use strict';

const { execFileSync } = require('child_process');
const crypto           = require('crypto');
const fs               = require('fs');
const path             = require('path');
const { Pool }         = require('pg');

// ─── Locate project root (one level up from scripts/) ─────────────────────
const ROOT = path.resolve(__dirname, '..');

// ─── Resolve parent connection string ─────────────────────────────────────
const PARENT_URL = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
if (!PARENT_URL) {
  console.error('[sync_schema] ERROR: DATABASE_URL or TEST_DATABASE_URL must be set.');
  console.error('  This is used to CREATE / DROP the temporary database.');
  console.error('  The role must have CREATEDB privilege.');
  process.exit(1);
}

// ─── Derive a unique temp DB name ─────────────────────────────────────────
const rand    = crypto.randomBytes(4).toString('hex');
const tmpName = `schema_sync_${Date.now()}_${rand}`;

// ─── Build the temp DB connection string ──────────────────────────────────
function replacePgDb(url, newDb) {
  try {
    const u = new URL(url);
    u.pathname = '/' + newDb;
    return u.toString();
  } catch {
    return url.replace(/\bdbname=\S+/, '') + ` dbname=${newDb}`;
  }
}

const TEMP_URL = replacePgDb(PARENT_URL, tmpName);

// ─── Schema.sql output path ───────────────────────────────────────────────
const SCHEMA_OUT = path.join(ROOT, 'schema.sql');

// ─── Helpers ──────────────────────────────────────────────────────────────

function log(msg)  { console.log(`[sync_schema] ${msg}`); }
function warn(msg) { console.warn(`[sync_schema] WARN: ${msg}`); }

function makePool(connString) {
  return new Pool({ connectionString: connString, ssl: false, max: 3 });
}

// Apply DDL statements one-by-one, best-effort. Returns failure count.
async function applyDDL(pool, stmts, label) {
  let failed = 0;
  for (const sql of stmts) {
    const preview = sql.replace(/\s+/g, ' ').slice(0, 80);
    try {
      await pool.query(sql);
    } catch (e) {
      warn(`${label}: stmt failed (${e.message.split('\n')[0]}): ${preview}`);
      failed++;
    }
  }
  return failed;
}

// Post-process the raw pg_dump output for determinism:
//   1. Strip pg_dump header block (SET statements + boilerplate comments)
//   2. Strip trailing whitespace per line
//   3. Collapse 3+ consecutive blank lines → 2
//   4. Sort CREATE [UNIQUE] INDEX lines alphabetically within each paragraph
function postProcess(raw) {
  const lines = raw.split('\n');

  // 1. Strip ALL non-deterministic / boilerplate header lines globally:
  //    - pg_dump \restrict / \unrestrict security markers (contain random hash)
  //    - SET statements
  //    - SELECT pg_catalog.set_config lines
  //    - pg_dump header comment lines (PostgreSQL database dump / Dumped from/by)
  const body = lines.filter(l => {
    const t = l.trim();
    if (/^\\restrict\b/.test(t))    return false;
    if (/^\\unrestrict\b/.test(t))  return false;
    if (/^SET\b/.test(t))           return false;
    if (/^SELECT\s+pg_catalog\.set_config\b/.test(t)) return false;
    if (/^--\s*(PostgreSQL database dump|Dumped (from|by))/.test(t)) return false;
    return true;
  });

  // 2. Strip trailing whitespace
  const trimmed = body.map(l => l.trimEnd());

  // 3. Collapse 3+ blank lines → 2
  const collapsed = [];
  let blankRun = 0;
  for (const l of trimmed) {
    if (l === '') {
      blankRun++;
      if (blankRun <= 2) collapsed.push(l);
    } else {
      blankRun = 0;
      collapsed.push(l);
    }
  }

  // 4. Split into paragraphs; sort index lines within each paragraph
  const paragraphs = [];
  let para = [];
  for (const l of collapsed) {
    if (l === '') {
      if (para.length) paragraphs.push(para);
      para = [];
    } else {
      para.push(l);
    }
  }
  if (para.length) paragraphs.push(para);

  const sorted = paragraphs.map(p => {
    const isIdx    = l => /^CREATE\s+(UNIQUE\s+)?INDEX\b/i.test(l);
    const idxLines = p.filter(isIdx).sort();
    const rest     = p.filter(l => !isIdx(l));
    return [...rest, ...idxLines];
  });

  return sorted.map(p => p.join('\n')).join('\n\n') + '\n';
}

// ─── Bootstrap DDL arrays (mirrored from server.js / auth.js / timeclock_module.js)
// These are kept in sync with the source files — if you add a column to the
// bootstrap DDL in one of those files, add it here too. The authoritative
// source of truth for NEW schema changes is /migrations/*.sql; these arrays
// cover the legacy bootstrap that predates the migration runner.

const V3_DDL = [
  `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS billing_code VARCHAR(40)`,
  `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_psc_client BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_generic_client BOOLEAN DEFAULT TRUE`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_rollup BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_level VARCHAR(20)`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_key TEXT`,
  `CREATE INDEX IF NOT EXISTS idx_projects_rollup ON projects (rollup_level, parent_id, rollup_key) WHERE is_rollup = TRUE`,
  `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS manually_overridden_at TIMESTAMPTZ`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_ongoing BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_contract BOOLEAN`,
  `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_work_order BOOLEAN`,
  `DROP INDEX IF EXISTS uniq_project_name_per_parent`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uniq_project_name_per_parent
     ON projects (COALESCE(parent_id::text, 'ROOT'), LOWER(name))
     WHERE COALESCE(is_rollup, FALSE) = FALSE`,
  `ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_parent_id_fkey`,
  `ALTER TABLE projects ADD CONSTRAINT projects_parent_id_fkey
     FOREIGN KEY (parent_id) REFERENCES projects(id) ON DELETE RESTRICT`,
  `ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_project_id_fkey`,
  `ALTER TABLE time_entries ADD CONSTRAINT time_entries_project_id_fkey
     FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries (project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_staff_id ON time_entries (staff_id)`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_entry_date ON time_entries (entry_date)`,
  `ALTER TABLE time_entries ADD COLUMN IF NOT EXISTS pending_project_request_id UUID REFERENCES setting_change_requests(id) ON DELETE SET NULL`,
  `ALTER TABLE time_entries ALTER COLUMN project_id DROP NOT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_time_entries_pending_request ON time_entries (pending_project_request_id) WHERE pending_project_request_id IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_projects_parent_id ON projects (parent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects (client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_contract_id ON projects (contract_id)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_billed_date ON projects (billed_date)`,
  `CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items (invoice_id)`,
  `CREATE INDEX IF NOT EXISTS idx_invoice_items_project_id ON invoice_items (project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_permit_stages_project_id ON permit_stages (project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_permit_documents_project_id ON permit_documents (project_id)`,
  `CREATE TABLE IF NOT EXISTS engineering_contracts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
     name VARCHAR(255) NOT NULL,
     contract_number VARCHAR(80),
     notes TEXT,
     active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE (client_id, name)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_engineering_contracts_client_id ON engineering_contracts (client_id)`,
  `DROP TRIGGER IF EXISTS engineering_contracts_updated_at ON engineering_contracts`,
  `CREATE TRIGGER engineering_contracts_updated_at
     BEFORE UPDATE ON engineering_contracts
     FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,
  `CREATE TABLE IF NOT EXISTS invoice_templates (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
     client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
     name VARCHAR(160),
     reference_pdf_path TEXT,
     reference_pdf_filename VARCHAR(260),
     generated_html TEXT,
     notes TEXT,
     analysis_status VARCHAR(20) DEFAULT 'pending',
     analysis_error TEXT,
     analyzed_at TIMESTAMPTZ,
     created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE (job_id, client_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_invoice_templates_job_client ON invoice_templates (job_id, client_id)`,
  `DROP TRIGGER IF EXISTS invoice_templates_updated_at ON invoice_templates`,
  `CREATE TRIGGER invoice_templates_updated_at
     BEFORE UPDATE ON invoice_templates
     FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,
  `CREATE TABLE IF NOT EXISTS customer_clients (
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     PRIMARY KEY (user_id, client_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_customer_clients_client ON customer_clients (client_id)`,
  `ALTER TABLE contracts ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL`,
  `CREATE INDEX IF NOT EXISTS idx_contracts_engineering_contract_id ON contracts (engineering_contract_id)`,
  `ALTER TABLE budgets ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE CASCADE`,
  `ALTER TABLE budgets ALTER COLUMN project_id DROP NOT NULL`,
  `DO $$ BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'budget_scope_exactly_one'
     ) THEN
       ALTER TABLE budgets ADD CONSTRAINT budget_scope_exactly_one CHECK (
         (project_id IS NOT NULL)::int + (engineering_contract_id IS NOT NULL)::int = 1
       ) NOT VALID;
     END IF;
   END $$`,
  `CREATE INDEX IF NOT EXISTS idx_budgets_engineering_contract_id ON budgets (engineering_contract_id)`,
  `ALTER TABLE engineering_contracts ADD COLUMN IF NOT EXISTS loan_name VARCHAR(80)`,
  `ALTER TABLE contracts ADD COLUMN IF NOT EXISTS friendly_label VARCHAR(40)`,
  `CREATE TABLE IF NOT EXISTS billing_batches (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(160) NOT NULL,
     client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
     engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL,
     job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
     period_start DATE,
     period_end DATE,
     total_amount DECIMAL(14,2) DEFAULT 0,
     notes TEXT,
     created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS billing_batch_items (
     batch_id UUID REFERENCES billing_batches(id) ON DELETE CASCADE,
     project_id UUID REFERENCES projects(id) ON DELETE RESTRICT,
     snapshot_amount DECIMAL(14,2),
     snapshot_period_year INT,
     snapshot_period_month INT,
     PRIMARY KEY (batch_id, project_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_billing_batches_client_id ON billing_batches (client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_billing_batch_items_project_id ON billing_batch_items (project_id)`,
  `CREATE TABLE IF NOT EXISTS undo_buckets (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID,
     kind VARCHAR(50) NOT NULL,
     payload JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     expires_at TIMESTAMPTZ NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_undo_buckets_expires_at ON undo_buckets (expires_at)`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL`,
];

const AUTH_DDL = [
  `CREATE TABLE IF NOT EXISTS users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     username VARCHAR(60) UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     role VARCHAR(40) NOT NULL,
     team VARCHAR(20),
     full_name VARCHAR(120),
     email VARCHAR(160),
     active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     last_login TIMESTAMPTZ,
     updated_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_users_username ON users (LOWER(username))`,
  `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE time_entries    ADD COLUMN IF NOT EXISTS user_id            UUID REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE permit_documents ADD COLUMN IF NOT EXISTS uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(10)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS extra_teams TEXT[] DEFAULT '{}'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_invalid_after TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_layout JSONB DEFAULT '{}'::jsonb`,
];

const TIMECLOCK_DDL = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES staff(id) ON DELETE SET NULL`,
  `CREATE TABLE IF NOT EXISTS time_clock_sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
     project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
     job_title TEXT,
     started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     ended_at TIMESTAMPTZ,
     notes TEXT,
     created_time_entry_id UUID REFERENCES time_entries(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_session_per_user
     ON time_clock_sessions (user_id) WHERE ended_at IS NULL`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_started
     ON time_clock_sessions (user_id, started_at DESC)`,
  `CREATE TABLE IF NOT EXISTS time_entry_audit (
     id BIGSERIAL PRIMARY KEY,
     time_entry_id UUID,
     actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
     actor_username TEXT,
     action VARCHAR(20) NOT NULL,
     change_summary TEXT,
     before_data JSONB,
     after_data JSONB,
     meaningful BOOLEAN DEFAULT FALSE,
     source VARCHAR(20),
     at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     user_agent TEXT,
     ip TEXT
   )`,
  `CREATE INDEX IF NOT EXISTS idx_audit_entry ON time_entry_audit (time_entry_id, at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_actor ON time_entry_audit (actor_user_id, at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_at ON time_entry_audit (at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_meaningful ON time_entry_audit (meaningful, at DESC) WHERE meaningful = TRUE`,
];

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const startMs  = Date.now();
  const oldLines = fs.existsSync(SCHEMA_OUT)
    ? fs.readFileSync(SCHEMA_OUT, 'utf8').split('\n').length
    : 0;

  // ── 1. Create temp DB ──────────────────────────────────────────────────
  log(`Creating temp database: ${tmpName}`);
  const parentPool = makePool(PARENT_URL);
  try {
    const client = await parentPool.connect();
    try {
      await client.query(`CREATE DATABASE "${tmpName}"`);
    } finally {
      client.release();
    }
  } catch (e) {
    console.error('[sync_schema] FATAL: Could not create temp database:', e.message);
    await parentPool.end();
    process.exit(1);
  }
  log('Temp database created.');

  const tempPool = makePool(TEMP_URL);

  try {
    // ── 2. pgcrypto ────────────────────────────────────────────────────
    log('Installing pgcrypto...');
    await tempPool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // ── 3. bootstrapV3Schema DDL (schema.sql core tables) ─────────────
    // schema.sql's core CREATE TABLE statements are what bootstrapV3Schema
    // expects to exist before altering them.  We need a minimal core first.
    // Read the original schema.sql up to the point before migrations added
    // content; but since schema.sql IS our output file we can't trust it.
    // Instead we apply the full V3_DDL which is safe via IF NOT EXISTS /
    // ALTER IF NOT EXISTS — any ordering failures (forward FKs) are normal.
    //
    // The original schema.sql contains the core CREATE TABLE statements.
    // We need to apply those before running V3 ALTERs.
    // The trick: load the canonical schema.sql from git (HEAD on the branch)
    // to get the original core tables, not the generated version.
    log('Applying core schema tables from git HEAD schema.sql...');
    let coreSchemaSql;
    try {
      coreSchemaSql = execFileSync('git', ['-C', ROOT, 'show', 'HEAD:schema.sql'], {
        maxBuffer: 16 * 1024 * 1024,
      }).toString('utf8');
    } catch {
      // If git show fails (e.g. first commit), fall back to the file on disk
      // — this is safe on first run since migrations haven't run yet.
      warn('git show HEAD:schema.sql failed; using schema.sql from disk (first-run fallback)');
      coreSchemaSql = fs.existsSync(SCHEMA_OUT) ? fs.readFileSync(SCHEMA_OUT, 'utf8') : '';
    }

    if (coreSchemaSql) {
      // Apply the core schema two-pass (same as db.js initSchema)
      const coreStmts = splitStatements(coreSchemaSql);
      const corePass1 = [];
      for (const s of coreStmts) {
        try { await tempPool.query(s); }
        catch { corePass1.push(s); }
      }
      if (corePass1.length) {
        for (const s of corePass1) {
          try { await tempPool.query(s); } catch { /* forward-FK, expected */ }
        }
      }
      log(`Core schema applied (${coreStmts.length} stmts)`);
    }

    // ── 4. bootstrapAuthSchema DDL (users table) ───────────────────────
    log('Applying auth DDL (users table)...');
    await applyDDL(tempPool, AUTH_DDL, 'auth');

    // ── 5. bootstrapV3Schema ALTERs (v3 columns, indexes, new tables) ──
    log('Applying v3 bootstrap DDL...');
    // invoice_templates and customer_clients reference users — apply after auth
    await applyDDL(tempPool, V3_DDL, 'v3');

    // ── 6. bootstrapTimeClockSchema ────────────────────────────────────
    log('Applying timeclock DDL...');
    await applyDDL(tempPool, TIMECLOCK_DDL, 'timeclock');

    // ── 7. Versioned migrations ────────────────────────────────────────
    log('Running versioned migrations...');
    const { runMigrations } = require(path.join(ROOT, 'db_migrations.js'));
    const migOut = await runMigrations(tempPool, { verbose: false });
    log(`Migrations: ${migOut.applied} applied, ${migOut.skipped} skipped`);

    // ── 8. pg_dump ─────────────────────────────────────────────────────
    log('Running pg_dump...');
    const connUrl = new URL(TEMP_URL);
    const pgEnv   = Object.assign({}, process.env, {
      PGHOST:     connUrl.hostname || 'localhost',
      PGPORT:     connUrl.port     || '5432',
      PGDATABASE: connUrl.pathname.replace(/^\//, ''),
      PGUSER:     connUrl.username || 'postgres',
      PGPASSWORD: decodeURIComponent(connUrl.password || ''),
    });

    const rawDump = execFileSync('pg_dump', [
      '--schema-only',
      '--no-owner',
      '--no-privileges',
      '--no-tablespaces',
      '--no-comments',
      '--no-publications',
      '--no-subscriptions',
    ], { env: pgEnv, maxBuffer: 64 * 1024 * 1024 }).toString('utf8');

    // ── 9. Post-process + write ────────────────────────────────────────
    log('Post-processing dump...');
    const processed = postProcess(rawDump);
    fs.writeFileSync(SCHEMA_OUT, processed, 'utf8');

    const newLines  = processed.split('\n').length;
    const delta     = newLines - oldLines;
    const deltaSign = delta >= 0 ? '+' : '';
    log(`schema.sql was ${oldLines} lines, now ${newLines} lines (Δ ${deltaSign}${delta})`);
    log(`Wrote ${SCHEMA_OUT}`);

  } finally {
    // ── 10. Teardown ───────────────────────────────────────────────────
    try { await tempPool.end(); } catch {}
    log(`Dropping temp database: ${tmpName}`);
    try {
      const client = await parentPool.connect();
      try {
        await client.query(`
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity
          WHERE datname = $1 AND pid <> pg_backend_pid()
        `, [tmpName]);
        await client.query(`DROP DATABASE IF EXISTS "${tmpName}"`);
      } finally {
        client.release();
      }
      log('Temp database dropped.');
    } catch (e) {
      warn(`Could not drop temp database ${tmpName}: ${e.message}`);
      warn(`  Run manually: DROP DATABASE "${tmpName}";`);
    }
    try { await parentPool.end(); } catch {}
    log(`Done in ${((Date.now() - startMs) / 1000).toFixed(1)}s`);
  }
}

// ─── Minimal SQL statement splitter (mirrors db.js splitStatements) ────────
// Handles line comments, block comments, single-quoted strings, double-quoted
// identifiers, and dollar-quoted blocks ($tag$...$tag$).
function splitStatements(sql) {
  const out = [];
  let buf = '';
  let i = 0;
  const len = sql.length;
  while (i < len) {
    const c    = sql[i];
    const next = sql[i + 1];
    if (c === '-' && next === '-') {
      const nl = sql.indexOf('\n', i);
      if (nl === -1) { buf += sql.slice(i); break; }
      buf += sql.slice(i, nl + 1); i = nl + 1; continue;
    }
    if (c === '/' && next === '*') {
      const end = sql.indexOf('*/', i + 2);
      if (end === -1) { buf += sql.slice(i); break; }
      buf += sql.slice(i, end + 2); i = end + 2; continue;
    }
    if (c === "'") {
      buf += c; i++;
      while (i < len) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") { buf += "''"; i += 2; continue; }
          buf += "'"; i++; break;
        }
        buf += sql[i]; i++;
      }
      continue;
    }
    if (c === '"') {
      buf += c; i++;
      while (i < len) {
        if (sql[i] === '"') {
          if (sql[i + 1] === '"') { buf += '""'; i += 2; continue; }
          buf += '"'; i++; break;
        }
        buf += sql[i]; i++;
      }
      continue;
    }
    if (c === '$') {
      const tagMatch = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i));
      if (tagMatch) {
        const tag    = tagMatch[0];
        const endIdx = sql.indexOf(tag, i + tag.length);
        if (endIdx === -1) { buf += sql.slice(i); break; }
        buf += sql.slice(i, endIdx + tag.length);
        i = endIdx + tag.length;
        continue;
      }
    }
    if (c === ';') {
      const trimmed = buf.trim();
      if (trimmed) out.push(trimmed);
      buf = ''; i++; continue;
    }
    buf += c; i++;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

main().catch(e => {
  console.error('[sync_schema] FATAL:', e.message || e);
  process.exit(1);
});
