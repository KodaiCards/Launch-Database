#!/usr/bin/env node

/**
 * CLI wrapper for idempotent database migrations.
 *
 * Usage:
 *   node scripts/run_migrations.js              # Apply all pending migrations
 *   node scripts/run_migrations.js --list       # Show applied vs pending
 *   node scripts/run_migrations.js --dry-run    # Show what would apply
 *   node scripts/run_migrations.js --up 3       # Apply next 3 pending migrations
 *   node scripts/run_migrations.js --target 0050_foo.sql  # Apply through specific migration
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const { runMigrations, _internal } = require('../db_migrations');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Parse command-line arguments
const args = process.argv.slice(2);
const cmd = args[0] || 'apply';
const arg1 = args[1];

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

async function listMigrations(pool) {
  console.log('\n=== Database Migrations Status ===\n');

  const all = _listMigrations();
  const applied = await _appliedSet(pool);

  console.log(`Total: ${all.length} migrations\n`);

  console.log('APPLIED:');
  const appliedList = all.filter(f => applied.has(f));
  if (appliedList.length === 0) {
    console.log('  (none)');
  } else {
    appliedList.forEach(f => console.log(`  ✓ ${f}`));
  }

  console.log('\nPENDING:');
  const pendingList = all.filter(f => !applied.has(f));
  if (pendingList.length === 0) {
    console.log('  (all applied)');
  } else {
    pendingList.forEach(f => console.log(`  ○ ${f}`));
  }

  console.log(`\nStatus: ${appliedList.length} applied, ${pendingList.length} pending\n`);
}

async function dryRun(pool) {
  console.log('\n=== Dry Run (no changes) ===\n');

  const all = _listMigrations();
  const applied = await _appliedSet(pool);
  const pending = all.filter(f => !applied.has(f));

  if (pending.length === 0) {
    console.log('No pending migrations.\n');
    return;
  }

  console.log(`Would apply ${pending.length} migration(s):\n`);
  pending.forEach(f => console.log(`  → ${f}`));
  console.log();
}

async function applyUp(pool, count) {
  const all = _listMigrations();
  const applied = await _appliedSet(pool);
  const pending = all.filter(f => !applied.has(f));
  const target = Math.min(count, pending.length);

  if (target === 0) {
    console.log('\nNo pending migrations to apply.\n');
    return { applied: 0, skipped: 0, files: [] };
  }

  console.log(`\nApplying next ${target} of ${pending.length} pending migration(s)...\n`);

  // We'll apply migrations one by one and stop after 'target'
  let appliedCount = 0;
  const logEntries = [];

  for (const filename of all) {
    if (applied.has(filename)) continue;
    if (appliedCount >= target) break;

    const full = path.join(MIGRATIONS_DIR, filename);
    let sql;
    try {
      sql = fs.readFileSync(full, 'utf8');
    } catch (e) {
      console.error(`[migrations] read-error ${filename}:`, e.message);
      logEntries.push({ filename, status: 'read-error', error: e.message });
      throw e;
    }

    const checksum = _internal._checksum(sql);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`,
        [filename, checksum]
      );
      await client.query('COMMIT');
      appliedCount++;
      logEntries.push({ filename, status: 'applied', checksum });
      console.log(`✓ ${filename}`);
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error(`✗ ${filename}: ${e.message}`);
      logEntries.push({ filename, status: 'failed', error: e.message });
      throw e;
    } finally {
      client.release();
    }
  }

  console.log(`\nApplied ${appliedCount} migration(s).\n`);
  return { applied: appliedCount, skipped: 0, files: logEntries };
}

async function applyThrough(pool, targetFilename) {
  const all = _listMigrations();
  const applied = await _appliedSet(pool);

  // Verify target exists
  if (!all.includes(targetFilename)) {
    console.error(`\nError: migration '${targetFilename}' not found.\n`);
    process.exit(1);
  }

  // Find index of target
  const targetIdx = all.indexOf(targetFilename);
  const toApply = all.slice(0, targetIdx + 1).filter(f => !applied.has(f));

  if (toApply.length === 0) {
    console.log(`\nTarget migration '${targetFilename}' and all predecessors already applied.\n`);
    return { applied: 0, skipped: 0, files: [] };
  }

  console.log(`\nApplying migrations through '${targetFilename}' (${toApply.length} pending)...\n`);

  let appliedCount = 0;
  const logEntries = [];

  for (const filename of all.slice(0, targetIdx + 1)) {
    if (applied.has(filename)) {
      logEntries.push({ filename, status: 'skipped' });
      continue;
    }

    const full = path.join(MIGRATIONS_DIR, filename);
    let sql;
    try {
      sql = fs.readFileSync(full, 'utf8');
    } catch (e) {
      console.error(`[migrations] read-error ${filename}:`, e.message);
      logEntries.push({ filename, status: 'read-error', error: e.message });
      throw e;
    }

    const checksum = _internal._checksum(sql);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`,
        [filename, checksum]
      );
      await client.query('COMMIT');
      appliedCount++;
      logEntries.push({ filename, status: 'applied', checksum });
      console.log(`✓ ${filename}`);
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error(`✗ ${filename}: ${e.message}`);
      logEntries.push({ filename, status: 'failed', error: e.message });
      throw e;
    } finally {
      client.release();
    }
  }

  console.log(`\nApplied ${appliedCount} migration(s) through '${targetFilename}'.\n`);
  return { applied: appliedCount, skipped: 0, files: logEntries };
}

async function main() {
  // Create pool from DATABASE_URL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Ensure migrations table exists first
    await _internal._ensureLogTable(pool);

    switch (cmd) {
      case '--list':
        await listMigrations(pool);
        break;
      case '--dry-run':
        await dryRun(pool);
        break;
      case '--up':
        const count = parseInt(arg1, 10);
        if (isNaN(count) || count < 1) {
          console.error('Error: --up requires a positive integer argument');
          process.exit(1);
        }
        await applyUp(pool, count);
        break;
      case '--target':
        if (!arg1) {
          console.error('Error: --target requires a filename argument');
          process.exit(1);
        }
        await applyThrough(pool, arg1);
        break;
      case 'apply':
      default:
        // Default: apply all pending migrations
        const result = await runMigrations(pool, { verbose: true });
        if (result.applied === 0 && result.skipped === 0) {
          console.log('\n(no migrations found)\n');
        }
        break;
    }
  } catch (err) {
    if (process.env.DEBUG) {
      console.error(err);
    } else {
      console.error(`\nError: ${err.message}\n`);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
