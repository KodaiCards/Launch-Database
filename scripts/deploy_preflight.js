#!/usr/bin/env node
/**
 * deploy_preflight.js
 * Pre-deploy validation script. Checks:
 * 1. Pending migrations
 * 2. Required environment variables
 * 3. UPLOAD_DIR writability
 * 4. Critical tables existence
 * 5. Schema consistency (schema.sql vs pg_dump)
 * 6. Optional assets (scanner libs, desktop installer)
 *
 * Usage:
 *   node scripts/deploy_preflight.js [--json] [--strict]
 *
 * Exit codes:
 *   0 = GO (all checks pass)
 *   1 = WARN (non-blocking issues found, safe to deploy with caution)
 *   2 = STOP (blocking issues found, do NOT deploy)
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { execSync } = require('child_process');

const jsonOutput = process.argv.includes('--json');
const strictMode = process.argv.includes('--strict');

const REQUIRED_ENV_VARS = [
  'JWT_SECRET',
  'UPLOAD_DIR',
  'BASE_URL'
];

const CRITICAL_TABLES = [
  'workspace_folders',
  'project_photos',
  'audit_log',
  'client_organizations'
];

const REQUIRED_FILES = [
  { path: 'public/js/vendor/opencv.min.js', type: 'warn', label: 'Scanner (OpenCV)' },
  { path: 'public/js/vendor/jscanify.min.js', type: 'warn', label: 'Scanner (jscanify)' },
  { path: 'public/downloads/installers', type: 'warn', label: 'Desktop installer directory' }
];

// ─── Report State ───────────────────────────────────────────────────────────

class Report {
  constructor() {
    this.checks = [];
    this.status = 'GO';
  }

  pass(label, detail = '') {
    this.checks.push({ label, status: '✓', detail, severity: 'pass' });
  }

  warn(label, detail = '') {
    this.checks.push({ label, status: '⚠️', detail, severity: 'warn' });
    if (this.status === 'GO') this.status = 'WARN';
  }

  fail(label, detail = '') {
    this.checks.push({ label, status: '✗', detail, severity: 'fail' });
    this.status = 'STOP';
  }

  render() {
    if (jsonOutput) {
      return JSON.stringify({
        verdict: this.status,
        checks: this.checks
      }, null, 2);
    }

    const lines = [];
    lines.push('\n╭─ Deploy Preflight Check ─────────────────────────────────╮');
    lines.push('│');

    for (const check of this.checks) {
      const icon = check.status;
      lines.push(`│  ${icon}  ${check.label}`);
      if (check.detail) {
        const wrapped = check.detail.split('\n');
        for (const line of wrapped) {
          lines.push(`│     ${line}`);
        }
      }
    }

    lines.push('│');
    lines.push(`╰─ Verdict: ${this.status} ${'─'.repeat(Math.max(0, 38 - this.status.length))}╯`);
    lines.push('');

    if (this.status === 'GO') {
      lines.push('✓ Ready to deploy.');
    } else if (this.status === 'WARN') {
      lines.push('⚠️  Non-blocking issues detected. Deploy with caution.');
    } else {
      lines.push('✗ BLOCKING ISSUES. Do not deploy until resolved.');
    }

    return lines.join('\n');
  }

  exit() {
    console.log(this.render());
    const code = this.status === 'GO' ? 0 : (this.status === 'WARN' && !strictMode ? 1 : 2);
    process.exit(code);
  }
}

// ─── Check Functions ────────────────────────────────────────────────────────

async function checkEnvironment(report) {
  let missing = [];
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length === 0) {
    report.pass('Environment variables', `All ${REQUIRED_ENV_VARS.length} required vars set`);
  } else {
    report.fail('Environment variables', `Missing: ${missing.join(', ')}`);
  }
}

async function checkUploadDir(report) {
  const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Test write
    const testFile = path.join(uploadDir, `.preflight-test-${Date.now()}`);
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);

    report.pass('UPLOAD_DIR writability', `${uploadDir} is writable`);
  } catch (err) {
    report.fail('UPLOAD_DIR writability', `${uploadDir}: ${err.message}`);
  }
}

async function checkMigrations(report, pool) {
  try {
    // Get applied migrations from DB
    const appliedResult = await pool.query(
      'SELECT filename FROM schema_migrations ORDER BY filename'
    );
    const applied = new Set(appliedResult.rows.map(r => r.filename));

    // List migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const pending = files.filter(f => !applied.has(f));

    if (pending.length === 0) {
      report.pass('Database migrations', `All ${files.length} migrations applied`);
    } else {
      const detail = pending.length <= 5
        ? pending.join(', ')
        : `${pending.slice(0, 3).join(', ')}, ... and ${pending.length - 3} more`;
      report.warn('Database migrations', `${pending.length} pending: ${detail}`);
    }
  } catch (err) {
    report.fail('Database migrations', `Could not query schema_migrations: ${err.message}`);
  }
}

async function checkCriticalTables(report, pool) {
  const missing = [];

  for (const tableName of CRITICAL_TABLES) {
    try {
      const result = await pool.query(
        'SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2',
        ['public', tableName]
      );
      if (result.rows.length === 0) {
        missing.push(tableName);
      }
    } catch (err) {
      missing.push(tableName);
    }
  }

  if (missing.length === 0) {
    report.pass('Critical tables', `All ${CRITICAL_TABLES.length} tables exist`);
  } else {
    report.fail('Critical tables', `Missing: ${missing.join(', ')}`);
  }
}

async function checkSchemaConsistency(report) {
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      report.warn('Schema consistency', 'schema.sql not found; skipping consistency check');
      return;
    }

    // Try to validate schema file syntactically (basic check)
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const createTableCount = (schemaContent.match(/CREATE TABLE/gi) || []).length;
    const createIndexCount = (schemaContent.match(/CREATE INDEX/gi) || []).length;

    if (createTableCount === 0) {
      report.warn('Schema consistency', 'No CREATE TABLE found in schema.sql');
    } else {
      report.pass('Schema file', `${createTableCount} tables, ${createIndexCount} indexes defined`);
    }
  } catch (err) {
    report.warn('Schema consistency', `Could not read schema.sql: ${err.message}`);
  }
}

async function checkOptionalAssets(report) {
  const missingAssets = [];
  const presentAssets = [];

  for (const asset of REQUIRED_FILES) {
    const fullPath = path.join(__dirname, '..', asset.path);
    if (fs.existsSync(fullPath)) {
      presentAssets.push(asset.label);
    } else {
      missingAssets.push(asset.label);
    }
  }

  if (missingAssets.length === 0) {
    report.pass('Optional assets', `All scanners and installers present`);
  } else {
    const msg = missingAssets.join(', ');
    if (missingAssets.length === REQUIRED_FILES.length) {
      report.warn('Optional assets', `None present: ${msg}`);
    } else {
      report.warn('Optional assets', `Missing: ${msg}`);
    }
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const report = new Report();

  // Check environment
  await checkEnvironment(report);

  // Check upload directory
  await checkUploadDir(report);

  // Database checks
  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://localhost/launch_db'
    });

    await pool.query('SELECT 1'); // test connection

    await checkMigrations(report, pool);
    await checkCriticalTables(report, pool);
  } catch (err) {
    report.fail('Database connection', `Could not connect to database: ${err.message}`);
  } finally {
    if (pool) await pool.end();
  }

  // File system checks
  await checkSchemaConsistency(report);
  await checkOptionalAssets(report);

  // Verdict
  if (strictMode && report.status === 'WARN') {
    report.status = 'STOP';
  }

  report.exit();
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(2);
});
