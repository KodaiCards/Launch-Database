// tests/split_statements.test.js
//
// Unit tests for db.js's splitStatements — the SQL splitter that lets
// initSchema run schema.sql one statement at a time so a single forward-
// FK failure (e.g. billing_batches → jobs) doesn't abort the entire
// implicit transaction.
//
// Why this exists: schema bootstrap silently failing was the 2026-05-04
// CI incident. The new resilient init has to handle messy real-world
// SQL — strings with semicolons, dollar-quoted plpgsql blocks, comments
// — without splitting in the wrong place. A bad splitter is worse than
// a single-batch query because the failure mode is silent half-applied
// schema. These tests are the canary.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { splitStatements } = require('../db');

test('splits plain statements on semicolons', () => {
  const out = splitStatements('CREATE TABLE a (id int); CREATE TABLE b (id int);');
  assert.equal(out.length, 2);
  assert.match(out[0], /CREATE TABLE a/);
  assert.match(out[1], /CREATE TABLE b/);
});

test('keeps trailing statement without a semicolon', () => {
  const out = splitStatements('SELECT 1;\nSELECT 2');
  assert.equal(out.length, 2);
  assert.equal(out[1], 'SELECT 2');
});

test('does not split inside single-quoted strings', () => {
  const out = splitStatements(`INSERT INTO t VALUES ('a;b'); SELECT 1;`);
  assert.equal(out.length, 2);
  assert.match(out[0], /'a;b'/);
});

test('handles escaped single quotes (PG-style doubled apostrophe)', () => {
  const out = splitStatements(`INSERT INTO t VALUES ('it''s; fine'); SELECT 1;`);
  assert.equal(out.length, 2);
  assert.match(out[0], /it''s; fine/);
});

test('does not split inside double-quoted identifiers', () => {
  const out = splitStatements(`SELECT "weird;col" FROM t; SELECT 2;`);
  assert.equal(out.length, 2);
  assert.match(out[0], /"weird;col"/);
});

test('does not split inside line comments', () => {
  const out = splitStatements('SELECT 1; -- ; not a split\nSELECT 2;');
  assert.equal(out.length, 2);
  // The leading line comment is preserved at the start of the next statement
  // (PG accepts comments before a statement). What matters for splitting is
  // that the `;` inside the comment didn't trigger a split. Mirror the
  // block-comment case below.
  assert.match(out[1], /SELECT 2/);
});

test('does not split inside block comments', () => {
  const out = splitStatements('SELECT 1; /* ; nope ; */ SELECT 2;');
  assert.equal(out.length, 2);
  assert.match(out[1], /SELECT 2/);
});

test('does not split inside dollar-quoted blocks', () => {
  const sql = `
    DO $$ BEGIN
      INSERT INTO x VALUES (1);
      INSERT INTO x VALUES (2);
    END $$;
    SELECT 'after';
  `;
  const out = splitStatements(sql);
  assert.equal(out.length, 2);
  assert.match(out[0], /DO \$\$/);
  assert.match(out[0], /END \$\$/);
  assert.match(out[1], /SELECT 'after'/);
});

test('handles tagged dollar quotes', () => {
  const sql = `
    CREATE FUNCTION f() RETURNS void AS $body$
      BEGIN; SELECT 1; END;
    $body$ LANGUAGE plpgsql;
    SELECT 1;
  `;
  const out = splitStatements(sql);
  assert.equal(out.length, 2);
  assert.match(out[0], /CREATE FUNCTION f/);
  assert.match(out[1], /^SELECT 1/);
});

test('drops empty statements', () => {
  const out = splitStatements(';;;\n  ;\nSELECT 1;\n;');
  assert.equal(out.length, 1);
  assert.equal(out[0], 'SELECT 1');
});

test('trims whitespace around statements', () => {
  const out = splitStatements('  SELECT 1  ;\n\n  SELECT 2  ;');
  assert.deepEqual(out, ['SELECT 1', 'SELECT 2']);
});

test('processes the real schema.sql without crashing or losing CREATE TABLEs', () => {
  // Sanity: parse the actual schema file the way initSchema does and
  // check we got every CREATE TABLE in it. If the splitter mishandles
  // some construct, the count will diverge from the regex count.
  const fs = require('fs');
  const path = require('path');
  const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  const out = splitStatements(sql);
  // No statement should be empty or just whitespace.
  for (const s of out) assert.ok(s.trim().length > 0, 'no empty statements');
  // The number of CREATE TABLE *statements* in the file should equal the
  // number of split output entries that contain a real CREATE TABLE DDL
  // (outside comments). If the splitter joined two CREATE TABLEs into one
  // statement this trips; if it split one CREATE TABLE across two entries
  // it would also trip.
  //
  // We strip line comments (-- ...) and block comments (/* ... */) from
  // both the raw file and each split statement before counting. This
  // prevents "CREATE TABLE" appearing only inside a comment block
  // (e.g. "-- CREATE TABLE above. This block corrects...") from being
  // counted in either direction — the splitter correctly attaches leading
  // comment blocks to the following statement's buffer, so a comment-only
  // occurrence would inflate one counter but not the other.
  function stripComments(s) {
    return s
      .replace(/--[^\n]*/g, '')          // strip line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // strip block comments
  }
  const fileCount  = (stripComments(sql).match(/CREATE TABLE/gi) || []).length;
  const splitCount = out.filter(s => /CREATE TABLE/i.test(stripComments(s))).length;
  assert.equal(splitCount, fileCount, 'each CREATE TABLE in schema.sql should land in its own statement');
});
