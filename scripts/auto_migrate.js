#!/usr/bin/env node
//
// auto_migrate.js — Railway `prestart` hook.
//
// Runs idempotent database migrations before `node server.js` boots. Wired
// into package.json as `"prestart": "node scripts/auto_migrate.js"` so
// Railway's `npm start` triggers it automatically on every deploy.
//
// Behavior:
//   - If DATABASE_URL is missing, skip (so local boot smoke without a DB
//     still works for syntax-only verification).
//   - If SKIP_AUTO_MIGRATE=1 in the environment, skip (escape hatch — set
//     it on Railway temporarily if a migration ever breaks the auto-run).
//   - Otherwise, run scripts/run_migrations.js as a child process. If it
//     exits non-zero, this wrapper exits non-zero too — Railway will mark
//     the deploy failed and NOT switch traffic to the new container. The
//     previous deploy keeps serving.
//
// Migrations are designed idempotent (CREATE TABLE IF NOT EXISTS, ALTER
// TABLE IF NOT EXISTS, UPDATE WHERE column = old_value) so re-running on
// every deploy is safe.

const { spawnSync } = require('child_process');
const path = require('path');

if (process.env.SKIP_AUTO_MIGRATE === '1') {
  console.log('[auto_migrate] SKIP_AUTO_MIGRATE=1 — skipping migration step');
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.log('[auto_migrate] DATABASE_URL not set — skipping (local/sandbox boot)');
  process.exit(0);
}

console.log('[auto_migrate] running pending migrations...');

const runnerPath = path.join(__dirname, 'run_migrations.js');
const result = spawnSync(process.execPath, [runnerPath], {
  stdio: 'inherit',
  env: process.env,
});

if (result.status !== 0) {
  console.error(`[auto_migrate] migration runner exited with code ${result.status}`);
  console.error('[auto_migrate] aborting boot — Railway will keep previous deploy serving');
  process.exit(result.status || 1);
}

console.log('[auto_migrate] migrations complete — proceeding to start server');
process.exit(0);
