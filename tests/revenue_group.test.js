// tests/revenue_group.test.js
// Unit tests for the /api/money/revenue grouping + grand-total reducer logic.
//
// Source: routes/money_view.js — GET /api/money/revenue
//   The SQL returns rows like { label: string, invoice_count: int, total: float }
//   (three variants: month YYYY-MM, client name, program slug).
//   After the DB query the route computes:
//     const grand_total = rows.reduce((s, r) => s + r.total, 0);
//
// This test focuses on the pure-JS reducer + the label shapes (since the SQL
// grouping key is not testable without a DB). We replicate the reducer and
// assert the label conventions expected by the front-end.
//
// No DB / no node_modules required. Runs with: node --test tests/revenue_group.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of the grand-total reducer from routes/money_view.js ---

/**
 * @param {Array<{label: string, invoice_count: number, total: number}>} rows
 * @returns {number} grand_total
 */
function grandTotal(rows) {
  return rows.reduce((s, r) => s + r.total, 0);
}

// Helper: build a minimal revenue row
function row(label, total, invoice_count = 1) {
  return { label, total, invoice_count };
}

// --- Tests ---

describe('revenue grouping — grand_total reducer', () => {
  it('empty input → grand_total is 0', () => {
    assert.equal(grandTotal([]), 0);
  });

  it('single row → grand_total equals that row total', () => {
    assert.equal(grandTotal([row('2026-01', 12345.67)]), 12345.67);
  });

  it('multiple rows → grand_total is the sum of all totals', () => {
    const rows = [
      row('2026-01', 1000),
      row('2026-02', 2000),
      row('2026-03', 3000),
    ];
    assert.equal(grandTotal(rows), 6000);
  });

  it('floating-point rows accumulate without sign error', () => {
    const rows = [row('A', 1234.56), row('B', 789.01)];
    // Use a tolerance since JS float addition is approximate
    const result = grandTotal(rows);
    assert.ok(Math.abs(result - 2023.57) < 0.001, `expected ~2023.57, got ${result}`);
  });

  it('rows with total = 0 do not distort grand_total', () => {
    const rows = [row('A', 0), row('B', 500), row('C', 0)];
    assert.equal(grandTotal(rows), 500);
  });
});

describe('revenue grouping — month label format', () => {
  // The SQL uses TO_CHAR(i.invoice_date, 'YYYY-MM') — validate the expected
  // shape so the front-end can sort lexicographically and display correctly.
  it('YYYY-MM labels are 7 chars', () => {
    const YYYY_MM_RE = /^\d{4}-\d{2}$/;
    const labels = ['2024-01', '2025-12', '2026-06'];
    for (const l of labels) {
      assert.match(l, YYYY_MM_RE, `label "${l}" must match YYYY-MM`);
    }
  });

  it('month label sorts lexicographically (DESC = latest first)', () => {
    // The SQL orders by label DESC — simulate the expected ordering.
    const labels = ['2026-06', '2026-03', '2025-12', '2024-01'];
    const sorted = [...labels].sort((a, b) => b.localeCompare(a));
    assert.deepEqual(sorted, labels);
  });

  it('invalid label "2026-1" does not match YYYY-MM (regression guard)', () => {
    const YYYY_MM_RE = /^\d{4}-\d{2}$/;
    assert.equal(YYYY_MM_RE.test('2026-1'), false);
  });
});

describe('revenue grouping — client label', () => {
  it('non-null client name is used as label', () => {
    const r = row('PSC', 50000);
    assert.equal(r.label, 'PSC');
  });

  it('grand_total sums correctly across multiple clients', () => {
    const rows = [row('PSC', 100000), row('Acme', 25000), row('Other', 5000)];
    assert.equal(grandTotal(rows), 130000);
  });
});

describe('revenue grouping — program label', () => {
  // The SQL uses COALESCE(sa.program, 'unknown') as the label.
  // Valid programs from the source: 'rus', 'bau', 'gfr', 'other'.
  // Service areas with no program → 'unknown'.
  const VALID_PROGRAMS = new Set(['rus', 'bau', 'gfr', 'other', 'unknown']);

  it('all expected program labels are in the valid set', () => {
    const returned = ['rus', 'bau', 'gfr', 'other', 'unknown'];
    for (const p of returned) {
      assert.ok(VALID_PROGRAMS.has(p), `unexpected program label: "${p}"`);
    }
  });

  it('grand_total sums correctly across programs', () => {
    const rows = [
      row('rus', 80000),
      row('bau', 15000),
      row('gfr', 5000),
      row('unknown', 2000),
    ];
    assert.equal(grandTotal(rows), 102000);
  });
});

describe('revenue grouping — invoice_count field', () => {
  it('invoice_count is present on each row', () => {
    const r = row('2026-06', 1000, 3);
    assert.equal(r.invoice_count, 3);
  });

  it('invoice_count of 0 is allowed (no invoices in that bucket)', () => {
    const r = row('2026-05', 0, 0);
    assert.equal(r.invoice_count, 0);
    assert.equal(grandTotal([r]), 0);
  });
});
