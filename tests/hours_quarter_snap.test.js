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
