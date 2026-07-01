// tests/assessment_engine.test.js
//
// Unit tests for the assessment-engine CORE (routes/_assessment_pools.js):
// per-attempt random draw, answer-key stripping, and server-side grading.
// Pure-Node, no DB / no node_modules. Runs with: node --test tests/
//
// These prove the anti-cheat + reproducibility guarantees Planning approved
// (Q1/Q2, 2026-07-01): the client never receives answer keys, the draw varies
// per attempt, and score is derived server-side (client answers can't fake a pass).

const { test } = require('node:test');
const assert = require('node:assert/strict');
const pools = require('../routes/_assessment_pools.js');

// A small in-memory pool (bypasses the fs loader — validatePool is the same path).
const RAW = {
  assessmentId: 'unit-demo',
  kind: 'lesson',
  courseId: 'UNIT',
  lessonId: 'unit-demo',
  drawCount: 3,
  passThreshold: 70,
  pool: [
    { id: 'a', type: 'mc', prompt: 'Q', choices: ['x', 'y'], answerIndex: 1 },
    { id: 'b', type: 'mc', prompt: 'Q', choices: ['x', 'y', 'z'], answerIndex: 0 },
    { id: 'c', type: 'mc', prompt: 'Q', choices: ['x', 'y'], answerIndex: 0 },
    { id: 'd', type: 'drag-match', prompt: 'Q', items: [{ id: 'i1', label: 'A' }], targets: [{ id: 't1', label: 'B' }], correctMap: { t1: 'i1' } },
    { id: 'e', type: 'mc', prompt: 'Q', choices: ['x', 'y'], answerIndex: 1 },
  ],
};

test('validatePool normalizes types and accepts a valid pool', () => {
  const p = pools.validatePool(RAW);
  assert.equal(p.drawCount, 3);
  assert.equal(p.passThreshold, 70);
  assert.equal(p.pool.length, 5);
});

test('validatePool rejects typed/free-text answers (Carter ban)', () => {
  assert.throws(() => pools.validatePool({
    ...RAW,
    pool: [{ id: 'x', type: 'fill-in-blank', prompt: 'name the ____', answer: 'thing' }, ...RAW.pool],
    drawCount: 1,
  }), /type 'fill-in-blank' not allowed/);
});

test('validatePool rejects a pool smaller than drawCount', () => {
  assert.throws(() => pools.validatePool({ ...RAW, drawCount: 99 }), /pool must have >= drawCount/);
});

test('drawQuestionIds draws exactly drawCount ids from the pool', () => {
  const p = pools.validatePool(RAW);
  const drawn = pools.drawQuestionIds(p);
  assert.equal(drawn.length, 3);
  const ids = new Set(p.pool.map(q => q.id));
  assert.ok(drawn.every(id => ids.has(id)));
  assert.equal(new Set(drawn).size, 3, 'no duplicate draws');
});

test('draw varies across attempts (anti-cheat) — different subsets/orders appear', () => {
  const p = pools.validatePool(RAW);
  const seen = new Set();
  for (let i = 0; i < 40; i++) seen.add(pools.drawQuestionIds(p).join(','));
  assert.ok(seen.size > 1, 'many attempts should not all yield the identical draw');
});

test('drawnQuestionsForClient strips every answer key', () => {
  const p = pools.validatePool(RAW);
  const client = pools.drawnQuestionsForClient(p, ['a', 'd']);
  for (const q of client) {
    assert.equal('answerIndex' in q, false, 'mc answerIndex must be stripped');
    assert.equal('correctMap' in q, false, 'drag-match correctMap must be stripped');
    assert.ok(q.prompt !== undefined, 'prompt is preserved');
  }
});

test('grade derives score server-side from correct answers', () => {
  const p = pools.validatePool(RAW);
  const drawn = ['a', 'b', 'c'];
  // a correct (1), b correct (0), c wrong (gave 1, answer 0)
  const r = pools.grade(p, drawn, { a: 1, b: 0, c: 1 });
  assert.equal(r.correct, 2);
  assert.equal(r.total, 3);
  assert.equal(r.score, 67);
  assert.equal(r.passed, false, '67 < 70 threshold');
});

test('grade passes at/above threshold and grades drag-match', () => {
  const p = pools.validatePool(RAW);
  const r = pools.grade(p, ['a', 'e', 'd'], { a: 1, e: 1, d: { t1: 'i1' } });
  assert.equal(r.correct, 3);
  assert.equal(r.score, 100);
  assert.equal(r.passed, true);
});

test('grade ignores answers to non-drawn questions and unanswered = wrong', () => {
  const p = pools.validatePool(RAW);
  const r = pools.grade(p, ['a', 'b'], { a: 1, c: 0 /* not drawn */ });
  assert.equal(r.correct, 1, 'only a is drawn+correct; b unanswered = wrong');
  assert.equal(r.total, 2);
});

test('a client-supplied score cannot fake a pass (grade only reads answers)', () => {
  const p = pools.validatePool(RAW);
  // Even if a client posted score:100, grade recomputes from the actual answers.
  const r = pools.grade(p, ['a', 'b', 'c'], {});
  assert.equal(r.score, 0);
  assert.equal(r.passed, false);
});
