// Pure-function tests for snapHoursToQuarter.
//
// Owner rule: hours always live on the 0.25 grid. The snap is the
// invariant-keeper at the route-handler level for time-entries POST,
// PUT, bulk, and the CSV commit path. This file exercises the helper
// in isolation — no DB, no network — so we know the snap is correct
// before trusting it on every write.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { snapHoursToQuarter } = require('../routes/_helpers');
const { sessionEntryHours } = require('../timeclock_module');

test('null / undefined / empty string return null', () => {
  assert.equal(snapHoursToQuarter(null), null);
  assert.equal(snapHoursToQuarter(undefined), null);
  assert.equal(snapHoursToQuarter(''), null);
});

test('non-numeric / NaN return null', () => {
  assert.equal(snapHoursToQuarter('abc'), null);
  assert.equal(snapHoursToQuarter(NaN), null);
  assert.equal(snapHoursToQuarter(Infinity), null);
  assert.equal(snapHoursToQuarter(-Infinity), null);
});

test('zero and negative inputs clamp to 0', () => {
  assert.equal(snapHoursToQuarter(0), 0);
  assert.equal(snapHoursToQuarter(-1), 0);
  assert.equal(snapHoursToQuarter(-0.5), 0);
});

test('values already on the grid pass through unchanged', () => {
  for (const v of [0.25, 0.5, 0.75, 1, 1.25, 8, 8.5, 8.75, 12.25, 40]) {
    assert.equal(snapHoursToQuarter(v), v, `${v} should snap to itself`);
  }
});

test('off-grid values snap to nearest 0.25 (half-up on positive)', () => {
  // 8.3 is closer to 8.25 than 8.5
  assert.equal(snapHoursToQuarter(8.3), 8.25);
  // 8.4 — equidistant tie; Math.round-on-positive picks 8.5
  assert.equal(snapHoursToQuarter(8.4), 8.5);
  // 8.1 → 8.0
  assert.equal(snapHoursToQuarter(8.1), 8);
  // 8.6 → 8.5 (closer than 8.75)
  assert.equal(snapHoursToQuarter(8.6), 8.5);
  // 8.9 → 9.0 (closer than 8.75)
  assert.equal(snapHoursToQuarter(8.9), 9);
});

test('string numerics are accepted (CSV / form input)', () => {
  assert.equal(snapHoursToQuarter('8.25'), 8.25);
  assert.equal(snapHoursToQuarter('8.3'), 8.25);
  assert.equal(snapHoursToQuarter('  8.5  '), 8.5);  // Number() trims
});

test('float drift is cleaned up (8.999...8 lands on 9)', () => {
  // The kind of value that JS arithmetic leaves around — comes from
  // miles × hr/mile multiplication or repeated additions.
  assert.equal(snapHoursToQuarter(8.999999998), 9);
  assert.equal(snapHoursToQuarter(8.000000002), 8);
});

// ── Timeclock source (L-014) ────────────────────────────────────────────────
// The clock-out and switch write paths convert an elapsed session duration in
// ms to the hours value stored on the time_entries row via sessionEntryHours.
// L-014 requires that stored value to land on the 0.25 grid, same as manual +
// CSV. These lock the timeclock source so it can't regress to raw 2-decimal.
const HR_MS = 3600000;

test('timeclock: elapsed ms is stored snapped to the 0.25 grid', () => {
  // 8h07m30s (8.125h, exact tie → half-up) → 8.25; 8h06m (8.1h) → 8.0;
  // 7h38m (~7.633h, nearer 7:45 than 7:30) → 7.75
  assert.equal(sessionEntryHours(8.125 * HR_MS), 8.25);
  assert.equal(sessionEntryHours(8.1 * HR_MS), 8);
  assert.equal(sessionEntryHours((7 + 38 / 60) * HR_MS), 7.75);
});

test('timeclock: a clean 8-hour shift stores exactly 8', () => {
  assert.equal(sessionEntryHours(8 * HR_MS), 8);
  assert.equal(sessionEntryHours(0.25 * HR_MS), 0.25);
});

test('timeclock: any elapsed duration lands on the quarter grid', () => {
  for (const mins of [1, 7, 8, 14, 23, 37, 52, 61, 128, 479, 480, 500]) {
    const h = sessionEntryHours(mins * 60000);
    assert.equal(h * 4, Math.round(h * 4), `${mins}m → ${h} must be a 0.25 multiple`);
  }
});

test('timeclock: sub-7.5-minute and zero/negative durations clamp to 0', () => {
  assert.equal(sessionEntryHours(6 * 60000), 0);   // 6 min → 0.1h → 0
  assert.equal(sessionEntryHours(0), 0);
  assert.equal(sessionEntryHours(-5 * HR_MS), 0);  // clock-skew guard
});
