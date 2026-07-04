#!/usr/bin/env node
/**
 * premerge.js — `npm run premerge`, the merge floor (GATES §premerge, WO-3).
 *
 * Runs the four gate stages IN ORDER, fail-fast (stops at the first red):
 *   1. build   — build the training SPA               (`npm run build:osp`)
 *   2. lint    — static checks                         (`node scripts/premerge_lint.js`)
 *   3. walk    — Playwright: every published lesson renders, 0 console
 *                errors, assessment loads              (`playwright test …training_lesson_walk`)
 *   4. test    — backend unit suite                    (`npm test`)
 *
 * Any nonzero stage → premerge exits nonzero → no merge. (CLAUDE.md: CI is
 * dead; this local run is the safety net.)
 *
 * Stages 3–4 boot `node server.js` / hit Postgres, so a full run needs
 * DATABASE_URL (the Registrar's environment). Stages 1–2 are DB-free.
 * `--lint-only` runs just build+lint (what a foreman can run without a DB).
 */

const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const lintOnly = process.argv.includes('--lint-only');

const stages = [
  { name: 'build', cmd: 'npm', args: ['run', 'build:osp'] },
  { name: 'lint',  cmd: 'node', args: ['scripts/premerge_lint.js'] },
  { name: 'walk',  cmd: 'npx', args: ['playwright', 'test', 'tests/browser/training_lesson_walk.spec.js'], db: true },
  { name: 'test',  cmd: 'npm', args: ['test'], db: true },
];

function run(stage) {
  const bar = '─'.repeat(60);
  console.log(`\n${bar}\n▶ premerge [${stage.name}] — ${stage.cmd} ${stage.args.join(' ')}\n${bar}`);
  const r = spawnSync(stage.cmd, stage.args, { cwd: ROOT, stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`\n✗ premerge FAILED at stage [${stage.name}] (exit ${r.status ?? 'signal ' + r.signal}). No merge.`);
    process.exit(r.status || 1);
  }
}

for (const stage of stages) {
  if (lintOnly && stage.db) { console.log(`\n· premerge [${stage.name}] skipped (--lint-only)`); continue; }
  run(stage);
}
console.log(lintOnly ? '\n✓ premerge lint-only stages passed (build + lint).' : '\n✓ premerge GREEN — build · lint · lesson-walk · tests all passed.');
