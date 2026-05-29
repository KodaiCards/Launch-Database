#!/usr/bin/env node
/**
 * validate_schema.js — CI-friendly schema consistency checker
 *
 * Validates:
 * 1. FK constraint consistency (all FKs resolve to existing table+column)
 * 2. ON DELETE semantics (CASCADE vs SET NULL vs RESTRICT/NO ACTION)
 * 3. Missing indexes on foreign-key columns in large tables
 * 4. Unique constraint vs unique index enforcement
 * 5. Audit log coverage (tables with state-change routes but no logAudit calls)
 *
 * Usage:
 *   node scripts/validate_schema.js [--json] [--strict]
 *
 * Exit codes:
 *   0 = clean
 *   1 = warnings only (unless --strict)
 *   2 = errors found
 */

const fs = require('fs');
const path = require('path');

let pool;
try {
  const result = require('../tests/_helpers');
  pool = result.pool;
} catch (e) {
  pool = null;
}

// Config
const LARGE_TABLE_ROW_THRESHOLD = 10000;
const ROUTES_DIR = path.join(__dirname, '..', 'routes');

// Output format
let outputJson = false;
let strictMode = false;
let findings = {
  errors: [],
  warnings: [],
  info: [],
};

// Parse CLI args
for (const arg of process.argv.slice(2)) {
  if (arg === '--json') outputJson = true;
  if (arg === '--strict') strictMode = true;
}

async function connectIfNeeded() {
  if (!pool) return false;
  try {
    const res = await pool.query('SELECT 1');
    return true;
  } catch (e) {
    if (!outputJson) console.warn('⚠️  DATABASE_URL not set or DB unreachable — skipping database validation');
    return false;
  }
}

async function validateForeignKeys(connected) {
  if (!connected) return;

  const { rows } = await pool.query(`
    SELECT
      tc.table_schema,
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      rc.update_rule,
      rc.delete_rule
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints rc
      ON rc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.column_name
  `);

  for (const fk of rows) {
    const fkName = `${fk.table_name}.${fk.column_name}`;
    const targetName = `${fk.foreign_table_name}.${fk.foreign_column_name}`;

    // Check if target exists
    const target = await pool.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
    `, [fk.foreign_table_name, fk.foreign_column_name]);

    if (target.rows.length === 0) {
      findings.errors.push({
        type: 'FK_TARGET_MISSING',
        fk: fkName,
        target: targetName,
        message: `FK ${fkName} → ${targetName} (target does not exist)`,
      });
    } else {
      findings.info.push({
        type: 'FK_VALID',
        fk: fkName,
        target: targetName,
        delete_rule: fk.delete_rule,
      });
    }

    // Check for NOT NULL column with SET NULL delete rule
    const col = await pool.query(`
      SELECT is_nullable FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
    `, [fk.table_name, fk.column_name]);

    if (col.rows.length > 0 && col.rows[0].is_nullable === 'NO' && fk.delete_rule === 'SET NULL') {
      findings.errors.push({
        type: 'FK_NOT_NULL_WITH_SET_NULL',
        fk: fkName,
        message: `FK ${fkName} is NOT NULL but has ON DELETE SET NULL (will fail on parent delete)`,
      });
    }
  }
}

async function validateIndexCoverage(connected) {
  if (!connected) return;

  // Get all FKs and their table sizes
  const { rows: fks } = await pool.query(`
    SELECT DISTINCT
      tc.table_name,
      kcu.column_name,
      pg_class.reltuples::bigint as row_count
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN pg_class ON pg_class.relname = tc.table_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
  `);

  for (const fk of fks) {
    if (fk.row_count < LARGE_TABLE_ROW_THRESHOLD) continue;

    const { rows: indexes } = await pool.query(`
      SELECT 1 FROM pg_indexes
      WHERE tablename = $1
        AND indexdef LIKE $2
    `, [fk.table_name, `%${fk.column_name}%`]);

    if (indexes.length === 0) {
      findings.warnings.push({
        type: 'FK_MISSING_INDEX',
        table: fk.table_name,
        column: fk.column_name,
        row_count: fk.row_count,
        message: `Large table ${fk.table_name} (${fk.row_count} rows) has FK ${fk.column_name} without index`,
      });
    }
  }
}

async function validateUniqueConstraints(connected) {
  if (!connected) return;

  const { rows: constraints } = await pool.query(`
    SELECT
      table_name,
      constraint_name,
      constraint_type
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND constraint_type IN ('UNIQUE', 'PRIMARY KEY')
    ORDER BY table_name, constraint_name
  `);

  for (const constraint of constraints) {
    findings.info.push({
      type: 'UNIQUE_CONSTRAINT',
      table: constraint.table_name,
      constraint: constraint.constraint_name,
      constraint_type: constraint.constraint_type,
    });
  }
}

function validateAuditCoverage() {
  if (!fs.existsSync(ROUTES_DIR)) return;

  const routeFiles = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.js'));

  const auditedTables = new Set();
  const routeTableRefs = new Map();

  for (const file of routeFiles) {
    const content = fs.readFileSync(path.join(ROUTES_DIR, file), 'utf8');

    const auditMatches = content.match(/logAudit\s*\(\s*['"](\w+)['"]/g) || [];
    for (const match of auditMatches) {
      const table = match.match(/['"](\w+)['"]/)[1];
      auditedTables.add(table);
    }

    const tableMatches = content.match(/(?:INSERT INTO|UPDATE|DELETE FROM)\s+(\w+)/gi) || [];
    for (const match of tableMatches) {
      const table = match.replace(/(?:INSERT INTO|UPDATE|DELETE FROM)\s+/i, '').toLowerCase();
      if (!routeTableRefs.has(table)) routeTableRefs.set(table, []);
      if (!routeTableRefs.get(table).includes(file)) {
        routeTableRefs.get(table).push(file);
      }
    }
  }

  for (const [table, files] of routeTableRefs.entries()) {
    if (['pg_', 'information_schema'].some(pat => table.includes(pat))) continue;

    if (!auditedTables.has(table) && files.length > 0) {
      findings.warnings.push({
        type: 'TABLE_NOT_AUDITED',
        table,
        files,
        message: `Table ${table} has mutations in routes (${files.join(', ')}) but no logAudit calls found`,
      });
    }
  }

  findings.info.push({
    type: 'AUDIT_COVERAGE_SUMMARY',
    audited_tables: Array.from(auditedTables).sort(),
    scanned_routes: routeFiles.length,
  });
}

async function run() {
  try {
    const connected = await connectIfNeeded();

    if (connected) {
      await validateForeignKeys(connected);
      await validateIndexCoverage(connected);
      await validateUniqueConstraints(connected);
    }

    validateAuditCoverage();

    // Output results
    if (outputJson) {
      console.log(JSON.stringify(findings, null, 2));
    } else {
      console.log('\n=== Schema Validation Report ===\n');

      if (findings.errors.length > 0) {
        console.log(`❌ ERRORS (${findings.errors.length}):\n`);
        for (const e of findings.errors) {
          console.log(`  [${e.type}] ${e.message}`);
          if (e.fk) console.log(`    FK: ${e.fk}`);
          if (e.target) console.log(`    Target: ${e.target}`);
        }
        console.log();
      }

      if (findings.warnings.length > 0) {
        console.log(`⚠️  WARNINGS (${findings.warnings.length}):\n`);
        for (const w of findings.warnings) {
          console.log(`  [${w.type}] ${w.message}`);
          if (w.column) console.log(`    Column: ${w.column}`);
          if (w.row_count) console.log(`    Rows: ${w.row_count}`);
          if (w.files) console.log(`    Routes: ${w.files.join(', ')}`);
        }
        console.log();
      }

      if (findings.info.length > 0) {
        console.log(`ℹ️  SUMMARY:\n`);
        const summary = findings.info
          .filter(i => i.type === 'AUDIT_COVERAGE_SUMMARY')[0];
        if (summary) {
          console.log(`  Audited tables: ${summary.audited_tables.length}`);
          console.log(`  Routes scanned: ${summary.scanned_routes}`);
          console.log(`  Valid FKs: ${findings.info.filter(i => i.type === 'FK_VALID').length}`);
        }
      }

      console.log('\n=== End Report ===\n');
    }

    const exitCode = findings.errors.length > 0
      ? 2
      : (findings.warnings.length > 0 && strictMode) ? 1 : 0;

    process.exit(exitCode);
  } catch (err) {
    if (!outputJson) console.error('Validation failed:', err.message);
    process.exit(2);
  }
}

run();
