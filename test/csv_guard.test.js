// test/csv_guard.test.js
// Unit tests for the csvCell formula-injection / RFC-4180 guard.
//
// Both routes/hours_summary.js and routes/money_view.js export an identical
// copy of csvCell under module.exports._helpers.csvCell. Because their
// top-level require() calls pull in pg, archiver, and other deps that are not
// installed in this environment, we cannot import the route modules directly.
// Instead, the pure function is reproduced here verbatim so the tests run with
// `node --test` and no DB / node_modules needed.
//
// NOTE for CEO: if a future refactor extracts csvCell to a shared
// helpers module (e.g. lib/csv.js) with no side-effect requires at the top,
// the test can simply do:
//   const { csvCell } = require('../lib/csv');
// and delete the inline copy below. See docs/test_plan.md.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Inline copy — must stay byte-for-byte identical to the production function
// in routes/hours_summary.js and routes/money_view.js.
function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

describe('csvCell — null / undefined / empty', () => {
  it('returns empty string for null', () => {
    assert.equal(csvCell(null), '');
  });

  it('returns empty string for undefined', () => {
    assert.equal(csvCell(undefined), '');
  });

  it('returns empty string for empty string', () => {
    assert.equal(csvCell(''), '');
  });
});

describe('csvCell — formula-injection prefix guard', () => {
  it("prefixes = with '", () => {
    assert.equal(csvCell('=SUM(A1)'), "'=SUM(A1)");
  });

  it("prefixes + with '", () => {
    assert.equal(csvCell('+1'), "'+1");
  });

  it("prefixes - with '", () => {
    assert.equal(csvCell('-DROP TABLE'), "'-DROP TABLE");
  });

  it("prefixes @ with '", () => {
    assert.equal(csvCell('@username'), "'@username");
  });

  it('does not prefix a value that starts with a safe character', () => {
    assert.equal(csvCell('hello'), 'hello');
  });

  it('does not prefix a mid-string = sign', () => {
    assert.equal(csvCell('x=y'), 'x=y');
  });
});

describe('csvCell — RFC-4180 quoting', () => {
  it('wraps a value containing a comma in double-quotes', () => {
    assert.equal(csvCell('foo,bar'), '"foo,bar"');
  });

  it('wraps a value containing a double-quote and doubles the inner quote', () => {
    assert.equal(csvCell('say "hello"'), '"say ""hello"""');
  });

  it('wraps a value containing a newline (\\n)', () => {
    assert.equal(csvCell('line1\nline2'), '"line1\nline2"');
  });

  it('wraps a value containing a carriage-return (\\r)', () => {
    assert.equal(csvCell('line1\rline2'), '"line1\rline2"');
  });
});

describe('csvCell — combined: formula prefix + quoting', () => {
  // A value that starts with = AND contains a comma must get BOTH guards.
  // The formula prefix fires first (prepends '), then the comma triggers quoting.
  it("prefixes = then quotes when value also contains a comma", () => {
    const result = csvCell('=A1,B1');
    // After prefix: "'=A1,B1" — then comma triggers wrapping.
    assert.equal(result, '"\'=A1,B1"');
  });

  it('handles a numeric zero cleanly', () => {
    assert.equal(csvCell(0), '0');
  });

  it('handles a numeric positive number without modification', () => {
    assert.equal(csvCell(42), '42');
  });

  it('converts numbers that start with - to string and prefixes them', () => {
    // -5 starts with '-', so should be prefixed.
    assert.equal(csvCell(-5), "'-5");
  });
});
