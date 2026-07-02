#!/usr/bin/env node
/**
 * Training assessment INTEGRITY LINT (D034) — cheap, repeatable, no agent.
 *
 * Catches the classes of defect that shipped past author→red-team→Auditor→render-test
 * because nobody USED the product:
 *   1. Internal/process notes leaking into trainee-visible text (citation/explanation/
 *      fieldNote) — "see T##.md research log", "UNVERIFIED-EXACT", "WebSearch-verified",
 *      "NOTE: this corrects…", capstone process-notes.
 *   2. Gameable drag-match — options presented positionally aligned with their targets.
 *      Asserts the SERVER draw (_presentItems) never returns a fully-aligned option order.
 *   3. Pool draw not random per-attempt.
 *
 * Exit 0 = clean; exit 1 = findings (printed). Run before AUDIT-READY / merge:
 *   node scripts/training_integrity_lint.js
 *
 * Only lints PUBLISHED pools (skips `_`-prefixed mechanism/fixture files, which are
 * never shown to trainees).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const pools = require('../routes/_assessment_pools.js');

const POOL_DIR = path.join(__dirname, '..', 'content', 'training', 'assessment-pools');

// Internal-note patterns that must never appear in trainee-visible fields. "UNVERIFIED"
// is matched only as the process TAG (uppercase, hyphenated) to avoid flagging the
// ordinary English word "unverified".
const INTERNAL_NOTE = [
  /research log/i,
  /UNVERIFIED-EXACT/,
  /\bWebSearch\b/i,
  /\bWebFetch\b/i,
  /red[-\s]?team/i,
  /see T\d\d[-.]/i,
  /\bD0\d\d\b/,
  /corrects a citation error/i,
  /major finding/i,
  /per the CEO/i,
  /not a graded quiz/i,
  /pass the lesson quiz to earn credit/i,
];
const TRAINEE_FIELDS = ['citation', 'explanation', 'fieldNote', 'prompt'];

function loadPublishedPools() {
  return fs.readdirSync(POOL_DIR)
    .filter(f => /\.json$/.test(f) && !f.startsWith('_'))
    .map(f => {
      try { return { file: f, raw: JSON.parse(fs.readFileSync(path.join(POOL_DIR, f), 'utf8')) }; }
      catch (e) { return { file: f, parseError: e.message }; }
    });
}

const findings = [];

function checkInternalNotes(file, pool) {
  for (const q of pool.pool || []) {
    for (const field of TRAINEE_FIELDS) {
      const v = q[field];
      if (typeof v !== 'string') continue;
      for (const pat of INTERNAL_NOTE) {
        if (pat.test(v)) {
          findings.push(`[internal-note] ${file} ${q.id}.${field} matches ${pat} :: "${v.slice(0, 90).replace(/\s+/g, ' ')}…"`);
          break;
        }
      }
    }
  }
}

function checkDragMatchNotAligned(file, pool) {
  for (const q of pool.pool || []) {
    if (q.type !== 'drag-match') continue;
    const targets = q.targets || [];
    if (targets.length < 2) continue;
    const cm = q.correctMap || {};
    // Run the real server presenter many times; it must NEVER return a fully-aligned order.
    for (let i = 0; i < 50; i++) {
      const shown = pools._presentItems(q);
      const aligned = targets.every((t, idx) => shown[idx] && shown[idx].id === cm[t.id]);
      if (aligned) {
        findings.push(`[gameable-drag-match] ${file} ${q.id}: _presentItems returned options positionally aligned with targets`);
        break;
      }
    }
  }
}

function checkDrawRandom(file, validated) {
  if (validated.pool.length <= validated.drawCount) return; // can't vary if pool == drawCount
  const seen = new Set();
  for (let i = 0; i < 8; i++) seen.add(pools.drawQuestionIds(validated).join(','));
  if (seen.size === 1) findings.push(`[draw-not-random] ${file}: 8 attempts drew the identical subset/order`);
}

const all = loadPublishedPools();
let linted = 0;
for (const { file, raw, parseError } of all) {
  if (parseError) { findings.push(`[parse-error] ${file}: ${parseError}`); continue; }
  let validated;
  try { validated = pools.validatePool(raw, file); }
  catch (e) { findings.push(`[invalid-pool] ${file}: ${e.message}`); continue; }
  checkInternalNotes(file, raw);
  checkDragMatchNotAligned(file, raw);
  checkDrawRandom(file, validated);
  linted++;
}

if (findings.length) {
  console.error(`\n✗ training integrity lint: ${findings.length} finding(s) across ${linted} pool file(s):\n`);
  for (const f of findings) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
console.log(`✓ training integrity lint: ${linted} pool files clean (no internal notes, drag-match non-aligned, draws random).`);
