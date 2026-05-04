const { Pool, types } = require('pg');
const fs = require('fs');
const path = require('path');

// Make the postgres DATE type come back as 'YYYY-MM-DD' strings.
// pg's default behavior is to coerce DATE to a JS Date object, which
// breaks any frontend code that does `entry_date + 'T00:00:00'` →
// the result is "Mon Jan 02 2026 ...T00:00:00" which the Date constructor
// cannot parse, and toLocaleDateString() shows "Invalid Date".
// 1082 is the oid for the DATE type. (TIMESTAMPTZ stays a Date object.)
types.setTypeParser(1082, (val) => val);

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set.');
  console.error('In Railway: make sure your PostgreSQL service is linked to this service.');
  console.error('Check Variables tab — DATABASE_URL should be auto-injected.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Split a multi-statement SQL string into individual statements so each
// can be run separately. PostgreSQL processes a single pool.query(text)
// in one implicit transaction — when ANY statement throws, the rest are
// abandoned. With forward references in schema.sql (e.g. billing_batches
// references jobs(id) declared later in the file, or users(id) which is
// only created later by bootstrapAuthSchema in auth.js), the whole file
// would abort on the first such error and leave the DB half-initialized.
//
// Splitting + per-statement try/catch gives us a best-effort apply: each
// CREATE TABLE / INSERT / ALTER runs independently, errors get logged,
// and bootstrapV3Schema in server.js fills the gaps. Idempotent —
// re-running is safe because every statement uses IF NOT EXISTS / ON
// CONFLICT DO NOTHING.
//
// Handles:
//   - Line comments        --
//   - Block comments       /* ... */
//   - Single-quoted        '...'   with PG-standard '' escape
//   - Double-quoted ident  "..."   with "" escape
//   - Dollar-quoted blocks $$..$$ and $tag$..$tag$ (used for plpgsql DO/FUNCTION)
//
// Anything else is treated as code; statements end at ';' outside any
// quoted region.
function splitStatements(sql) {
  const out = [];
  let buf = '';
  let i = 0;
  const len = sql.length;
  while (i < len) {
    const c = sql[i];
    const next = sql[i + 1];
    // Line comment
    if (c === '-' && next === '-') {
      const nl = sql.indexOf('\n', i);
      if (nl === -1) { buf += sql.slice(i); break; }
      buf += sql.slice(i, nl + 1);
      i = nl + 1;
      continue;
    }
    // Block comment
    if (c === '/' && next === '*') {
      const end = sql.indexOf('*/', i + 2);
      if (end === -1) { buf += sql.slice(i); break; }
      buf += sql.slice(i, end + 2);
      i = end + 2;
      continue;
    }
    // Single-quoted string
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
    // Double-quoted identifier
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
    // Dollar-quoted string  $tag$ ... $tag$
    if (c === '$') {
      const tagMatch = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i));
      if (tagMatch) {
        const tag = tagMatch[0];
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
      buf = '';
      i++;
      continue;
    }
    buf += c;
    i++;
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

async function initSchema() {
  // First test the connection
  try {
    const testResult = await pool.query('SELECT NOW()');
    console.log('✓ Database connected at', testResult.rows[0].now);
  } catch (err) {
    console.error('DATABASE CONNECTION FAILED:');
    console.error('  Error:', err.message || JSON.stringify(err));
    console.error('  Code:', err.code);
    console.error('  DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.error('  DATABASE_URL starts with:', (process.env.DATABASE_URL || '').substring(0, 30) + '...');
    return;
  }

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = splitStatements(schema);
  // Two-pass apply. Pass 1 runs the file in order — most CREATE TABLEs
  // succeed, and forward-FK failures (billing_batches → jobs declared
  // later, invoice_templates / customer_clients → users created by
  // bootstrapAuthSchema) get queued for retry. Pass 2 re-runs the
  // failures: by then `jobs` is created, so the only ones left failing
  // are the user-FK ones, which bootstrapAuthSchema picks up. Each
  // statement is idempotent (IF NOT EXISTS / ON CONFLICT) so a retry
  // that succeeds on pass 1 and runs again on pass 2 is harmless.
  async function applyOnce(stmts) {
    const failures = [];
    for (const stmt of stmts) {
      try {
        await pool.query(stmt);
      } catch (err) {
        failures.push({ stmt, err });
      }
    }
    return failures;
  }
  const firstPass = await applyOnce(statements);
  const retry = firstPass.length ? await applyOnce(firstPass.map(f => f.stmt)) : [];
  // Anything still failing after pass 2 is held for a third pass that
  // server.js runs AFTER bootstrapAuthSchema — by then the users table
  // exists and any user-FK CREATE TABLEs (billing_batches,
  // invoice_templates, customer_clients) can finally apply. We stash
  // them on pool.locals so server.js can pick them up without a return-
  // value dance through bootstrapV3Schema.
  pool._deferredStatements = retry.map(f => f.stmt);
  for (const { stmt, err } of retry) {
    const summary = stmt.replace(/\s+/g, ' ').slice(0, 100);
    const userFkRef = /\busers\s*\(\s*id\s*\)/i.test(stmt);
    const expected = (err.code === '42P01' || err.code === '42703') && userFkRef;
    if (expected) {
      console.warn(`  ⚠ deferred to post-auth: ${summary}${stmt.length > 100 ? '…' : ''}`);
    } else {
      console.error(`  ✗ ${summary}${stmt.length > 100 ? '…' : ''}`);
      console.error(`    ${err.code || ''} ${err.message}`);
    }
  }
  const ok = statements.length - retry.length;
  console.log(`✓ Database schema applied (${ok}/${statements.length} statements ok; ${retry.length} deferred to post-auth bootstrap)`);
}

// Run the statements that initSchema couldn't apply because they
// reference the `users` table. Called from server.js after
// bootstrapAuthSchema. Idempotent: every statement in schema.sql uses
// IF NOT EXISTS so a no-op retry is fine.
async function applyDeferredSchemaStatements() {
  const stmts = pool._deferredStatements || [];
  if (!stmts.length) return;
  console.log(`───── deferred schema apply (${stmts.length} statements) ─────`);
  let ok = 0;
  for (const stmt of stmts) {
    try { await pool.query(stmt); ok++; }
    catch (err) {
      const summary = stmt.replace(/\s+/g, ' ').slice(0, 100);
      console.error(`  ✗ ${summary}${stmt.length > 100 ? '…' : ''}`);
      console.error(`    ${err.code || ''} ${err.message}`);
    }
  }
  pool._deferredStatements = [];
  console.log(`✓ ${ok}/${stmts.length} deferred statements applied`);
}

module.exports = { pool, initSchema, splitStatements, applyDeferredSchemaStatements };
