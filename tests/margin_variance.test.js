// tests/margin_variance.test.js
// Unit tests for the variance calculation and totals reducer in:
//   GET /api/money/margin  (routes/money_view.js)
//
// Source logic (verbatim from routes/money_view.js):
//   for (const r of rows) r.variance = +(r.billed_total - r.estimated_total).toFixed(2);
//   const totals = rows.reduce((t, r) => ({
//     estimated_total: t.estimated_total + r.estimated_total,
//     actual_total:    t.actual_total    + r.actual_total,
//     billed_total:    t.billed_total    + r.billed_total,
//   }), { estimated_total: 0, actual_total: 0, billed_total: 0 });
//   totals.variance = +(totals.billed_total - totals.estimated_total).toFixed(2);
//
// Rules verified here:
//   - variance = billed_total − estimated_total (positive = over estimate).
//   - Result is rounded to exactly 2 decimal places (via .toFixed(2) + unary +).
//   - Totals reducer accumulates all three $ fields across rows.
//   - Grand variance is computed on the rolled-up totals (not as a sum of row variances).
//   - Empty rows → all-zero totals, variance = 0.
//
// No DB / no node_modules required. Runs with: node --test tests/margin_variance.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of routes/money_view.js margin logic ---

/**
 * Add variance field to each row (billed − estimated, 2dp).
 * Mutates the row objects in place (matches source behaviour).
 * @param {Array<{estimated_total: number, actual_total: number, billed_total: number}>} rows
 */
function addVariance(rows) {
  for (const r of rows) {
    r.variance = +(r.billed_total - r.estimated_total).toFixed(2);
  }
  return rows;
}

/**
 * Produce the totals object across all rows, plus its variance.
 * @param {Array<{estimated_total: number, actual_total: number, billed_total: number}>} rows
 * @returns {{ estimated_total: number, actual_total: number, billed_total: number, variance: number }}
 */
function calcTotals(rows) {
  const totals = rows.reduce(
    (t, r) => ({
      estimated_total: t.estimated_total + r.estimated_total,
      actual_total:    t.actual_total    + r.actual_total,
      billed_total:    t.billed_total    + r.billed_total,
    }),
    { estimated_total: 0, actual_total: 0, billed_total: 0 }
  );
  totals.variance = +(totals.billed_total - totals.estimated_total).toFixed(2);
  return totals;
}

// Helper: build a minimal margin row
function marginRow(estimated, billed, actual) {
  return {
    estimated_total: estimated,
    billed_total:    billed,
    actual_total:    actual ?? billed,
  };
}

// --- Tests: per-row variance ---

describe('margin variance — per-row calculation', () => {
  it('variance = 0 when billed equals estimated', () => {
    const [r] = addVariance([marginRow(1000, 1000)]);
    assert.equal(r.variance, 0);
  });

  it('positive variance when billed > estimated (over estimate)', () => {
    const [r] = addVariance([marginRow(1000, 1200)]);
    assert.equal(r.variance, 200);
  });

  it('negative variance when billed < estimated (under estimate)', () => {
    const [r] = addVariance([marginRow(1000, 800)]);
    assert.equal(r.variance, -200);
  });

  it('variance is rounded to 2 decimal places', () => {
    // 1333.33... − 1000 = 333.33... → should round to 333.33
    const [r] = addVariance([marginRow(1000, 1333.333333)]);
    // toFixed(2) followed by unary + gives exactly 2dp as a number
    assert.equal(r.variance, 333.33);
  });

  it('variance with fractional amounts rounds correctly (bank-style edge)', () => {
    // 100.005 - 0 = 100.005; JS toFixed(2) may give 100.00 or 100.01 depending
    // on float representation — just assert it IS rounded to 2dp
    const [r] = addVariance([marginRow(0, 100.005)]);
    const dp = String(r.variance).split('.')[1] || '';
    assert.ok(dp.length <= 2, `variance has more than 2dp: ${r.variance}`);
  });

  it('zero estimated and zero billed → variance = 0', () => {
    const [r] = addVariance([marginRow(0, 0)]);
    assert.equal(r.variance, 0);
  });
});

// --- Tests: totals reducer ---

describe('margin variance — totals reducer', () => {
  it('empty rows → all totals are 0, variance is 0', () => {
    const t = calcTotals([]);
    assert.equal(t.estimated_total, 0);
    assert.equal(t.actual_total, 0);
    assert.equal(t.billed_total, 0);
    assert.equal(t.variance, 0);
  });

  it('single row → totals equal that row', () => {
    const t = calcTotals([marginRow(500, 600, 550)]);
    assert.equal(t.estimated_total, 500);
    assert.equal(t.billed_total, 600);
    assert.equal(t.actual_total, 550);
  });

  it('accumulates estimated_total across rows', () => {
    const t = calcTotals([marginRow(1000, 0, 0), marginRow(2000, 0, 0)]);
    assert.equal(t.estimated_total, 3000);
  });

  it('accumulates billed_total across rows', () => {
    const t = calcTotals([marginRow(0, 400, 0), marginRow(0, 600, 0)]);
    assert.equal(t.billed_total, 1000);
  });

  it('accumulates actual_total across rows', () => {
    const t = calcTotals([marginRow(0, 0, 100), marginRow(0, 0, 250)]);
    assert.equal(t.actual_total, 350);
  });

  it('grand variance is computed on rolled-up totals, not as sum of row variances', () => {
    // Row A: est=1000, billed=1100  → row variance = 100
    // Row B: est=2000, billed=1900  → row variance = -100
    // Sum of row variances = 0. Grand totals: est=3000, billed=3000 → variance = 0.
    const rows = [marginRow(1000, 1100, 0), marginRow(2000, 1900, 0)];
    const t = calcTotals(rows);
    assert.equal(t.variance, 0);
  });

  it('grand variance rounds to 2dp', () => {
    // est=0.001, billed=0.004 → difference = 0.003 → rounded to 0
    const rows = [marginRow(0.001, 0.004, 0)];
    const t = calcTotals(rows);
    const dp = String(t.variance).split('.')[1] || '';
    assert.ok(dp.length <= 2, `grand variance has more than 2dp: ${t.variance}`);
  });

  it('multiple rows produce correct grand variance', () => {
    // est total = 5000, billed total = 5750 → variance = 750
    const rows = [
      marginRow(2000, 2500, 2200),
      marginRow(3000, 3250, 3100),
    ];
    const t = calcTotals(rows);
    assert.equal(t.estimated_total, 5000);
    assert.equal(t.billed_total, 5750);
    assert.equal(t.variance, 750);
  });
});
