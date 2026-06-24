// test/aging_buckets.test.js
// Unit tests for the AR aging bucket logic used in:
//   GET /api/money/aging   (routes/money_view.js)
//   GET /api/money/statement  (routes/money_view.js — per-client view)
//
// Both handlers share the same inline bucketing expression:
//   d <= 30  → '0-30'
//   d <= 60  → '31-60'
//   d <= 90  → '61-90'
//   else     → '90+'
//
// The logic is NOT exported as a standalone function from money_view.js, so
// we replicate it here. See docs/test_plan.md — exporting it would allow
// binding the test directly to production code.
//
// No DB / no node_modules required. Runs with: node --test test/

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of the bucketing logic from routes/money_view.js ---

/**
 * @typedef {{ label: string, count: number, total: number, invoices: Array }} Bucket
 */
function makeBuckets() {
  return {
    '0-30':  { label: '0–30 days',  count: 0, total: 0, invoices: [] },
    '31-60': { label: '31–60 days', count: 0, total: 0, invoices: [] },
    '61-90': { label: '61–90 days', count: 0, total: 0, invoices: [] },
    '90+':   { label: '90+ days',   count: 0, total: 0, invoices: [] },
  };
}

function assignBuckets(invoiceRows) {
  const buckets = makeBuckets();
  for (const r of invoiceRows) {
    const d = r.age_days == null ? 0 : Number(r.age_days);
    const key = d <= 30 ? '0-30' : d <= 60 ? '31-60' : d <= 90 ? '61-90' : '90+';
    const b = buckets[key];
    b.count++;
    b.total += r.total_amount;
    b.invoices.push(r);
  }
  return buckets;
}

// Helper: build a minimal invoice row
function inv(age_days, total_amount) {
  return { id: Math.random(), age_days, total_amount };
}

// --- Tests ---

describe('aging bucket — boundary values', () => {
  it('age_days = 0 lands in 0-30', () => {
    const b = assignBuckets([inv(0, 100)]);
    assert.equal(b['0-30'].count, 1);
    assert.equal(b['31-60'].count, 0);
  });

  it('age_days = 30 (upper boundary) lands in 0-30', () => {
    const b = assignBuckets([inv(30, 100)]);
    assert.equal(b['0-30'].count, 1);
    assert.equal(b['31-60'].count, 0);
  });

  it('age_days = 31 (first day in second bucket) lands in 31-60', () => {
    const b = assignBuckets([inv(31, 100)]);
    assert.equal(b['0-30'].count, 0);
    assert.equal(b['31-60'].count, 1);
  });

  it('age_days = 60 (upper boundary of second bucket) lands in 31-60', () => {
    const b = assignBuckets([inv(60, 100)]);
    assert.equal(b['31-60'].count, 1);
    assert.equal(b['61-90'].count, 0);
  });

  it('age_days = 61 lands in 61-90', () => {
    const b = assignBuckets([inv(61, 100)]);
    assert.equal(b['31-60'].count, 0);
    assert.equal(b['61-90'].count, 1);
  });

  it('age_days = 90 (upper boundary of third bucket) lands in 61-90', () => {
    const b = assignBuckets([inv(90, 100)]);
    assert.equal(b['61-90'].count, 1);
    assert.equal(b['90+'].count, 0);
  });

  it('age_days = 91 lands in 90+', () => {
    const b = assignBuckets([inv(91, 100)]);
    assert.equal(b['61-90'].count, 0);
    assert.equal(b['90+'].count, 1);
  });

  it('age_days = null is treated as 0 and lands in 0-30', () => {
    const b = assignBuckets([inv(null, 50)]);
    assert.equal(b['0-30'].count, 1);
  });
});

describe('aging bucket — totals', () => {
  it('sums total_amount correctly within a bucket', () => {
    const b = assignBuckets([inv(5, 100), inv(20, 250)]);
    assert.equal(b['0-30'].total, 350);
    assert.equal(b['0-30'].count, 2);
  });

  it('distributes invoices across all four buckets', () => {
    const rows = [inv(10, 100), inv(45, 200), inv(75, 300), inv(120, 400)];
    const b = assignBuckets(rows);
    assert.equal(b['0-30'].count, 1);
    assert.equal(b['31-60'].count, 1);
    assert.equal(b['61-90'].count, 1);
    assert.equal(b['90+'].count, 1);
    assert.equal(b['0-30'].total, 100);
    assert.equal(b['31-60'].total, 200);
    assert.equal(b['61-90'].total, 300);
    assert.equal(b['90+'].total, 400);
  });

  it('grand total equals sum of all bucket totals', () => {
    const rows = [inv(5, 100), inv(35, 200), inv(65, 300), inv(100, 400)];
    const b = assignBuckets(rows);
    const grandTotal = rows.reduce((s, r) => s + r.total_amount, 0);
    const bucketSum = Object.values(b).reduce((s, bkt) => s + bkt.total, 0);
    assert.equal(bucketSum, grandTotal);
  });

  it('empty input produces all-zero buckets', () => {
    const b = assignBuckets([]);
    for (const bkt of Object.values(b)) {
      assert.equal(bkt.count, 0);
      assert.equal(bkt.total, 0);
      assert.deepEqual(bkt.invoices, []);
    }
  });
});

describe('aging bucket — invoice references', () => {
  it('stores the invoice row in the correct bucket invoices array', () => {
    const row = inv(45, 999);
    const b = assignBuckets([row]);
    assert.equal(b['31-60'].invoices.length, 1);
    assert.equal(b['31-60'].invoices[0], row);
  });
});
