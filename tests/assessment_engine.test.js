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

// ── §1.7 per-attempt MC choice shuffle (#57) ─────────────────────────────────
// A pool whose authored answers ALL sit at index 0 — the exact positional-gameability
// shape (§1.7). Choices are labelled so we can track where each authored option lands.
const RAW4 = {
  assessmentId: 'unit-shuffle', kind: 'lesson', courseId: 'UNIT', lessonId: 'unit-shuffle',
  drawCount: 3, passThreshold: 70,
  pool: [
    { id: 'q1', type: 'mc', prompt: 'Q1', choices: ['c0', 'c1', 'c2', 'c3'], answerIndex: 0 },
    { id: 'q2', type: 'mc', prompt: 'Q2', choices: ['d0', 'd1', 'd2', 'd3'], answerIndex: 0 },
    { id: 'q3', type: 'mc', prompt: 'Q3', choices: ['e0', 'e1', 'e2', 'e3'], answerIndex: 0 },
    { id: 'm',  type: 'drag-match', prompt: 'M', items: [{ id: 'i1', label: 'A' }], targets: [{ id: 't1', label: 'B' }], correctMap: { t1: 'i1' } },
  ],
};

// The displayed position where an authored choice index landed, for a given attempt.
function displayedPosOfAuthored(q, attemptId, authoredIndex) {
  return pools.choiceOrder(q, attemptId).indexOf(authoredIndex);
}

test('choiceOrder is a permutation of the authored indices (no lost/duplicated choices)', () => {
  const q = RAW4.pool[0];
  const perm = pools.choiceOrder(q, 12345);
  assert.deepEqual([...perm].sort((a, b) => a - b), [0, 1, 2, 3]);
});

test('choiceOrder is deterministic per (attemptId, questionId) — replays at grade time', () => {
  const q = RAW4.pool[0];
  assert.deepEqual(pools.choiceOrder(q, 777), pools.choiceOrder(q, 777));
  // different attempt id ⇒ (very likely) different order; different question id ⇒ independent
  const sameQ = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(a => pools.choiceOrder(q, a).join(',')));
  assert.ok(sameQ.size > 1, 'orders vary across attempts');
});

test('drawnQuestionsForClient shuffles MC choices per attempt but keeps the same set + strips keys', () => {
  const p = pools.validatePool(RAW4);
  const client = pools.drawnQuestionsForClient(p, ['q1'], 42);
  const q = client[0];
  assert.equal('answerIndex' in q, false, 'answer key still stripped');
  assert.deepEqual([...q.choices].sort(), ['c0', 'c1', 'c2', 'c3'], 'same choices, order may differ');
  // the displayed order matches choiceOrder applied to the authored choices
  const perm = pools.choiceOrder(RAW4.pool[0], 42);
  assert.deepEqual(q.choices, perm.map(a => RAW4.pool[0].choices[a]));
});

test('grade maps the displayed pick back through the shuffle — correct answer grades correct', () => {
  const p = pools.validatePool(RAW4);
  const attemptId = 98765;
  const drawn = ['q1', 'q2', 'q3'];
  // Learner picks, for each question, the DISPLAYED position holding the authored answer (index 0).
  const answers = {};
  for (const id of drawn) {
    const q = RAW4.pool.find(x => x.id === id);
    answers[id] = displayedPosOfAuthored(q, attemptId, q.answerIndex);
  }
  const r = pools.grade(p, drawn, answers, attemptId);
  assert.equal(r.correct, 3);
  assert.equal(r.score, 100);
  assert.equal(r.passed, true);
});

test('grade with the WRONG displayed pick is wrong under the shuffle', () => {
  const p = pools.validatePool(RAW4);
  const attemptId = 55;
  const q = RAW4.pool[0];
  const correctPos = displayedPosOfAuthored(q, attemptId, q.answerIndex);
  const wrongPos = (correctPos + 1) % 4;
  const r = pools.grade(p, ['q1'], { q1: wrongPos }, attemptId);
  assert.equal(r.correct, 0);
});

test('positional gameability is closed: "always pick display index 1" does NOT track the key', () => {
  const q = RAW4.pool[0]; // authored answer at index 0
  let correctWhenPicking1 = 0;
  const N = 200;
  for (let attemptId = 1; attemptId <= N; attemptId++) {
    // authored index shown at display position 1 for this attempt:
    if (pools.choiceOrder(q, attemptId)[1] === q.answerIndex) correctWhenPicking1++;
  }
  // With a real shuffle, a fixed-position strategy scores ~1/4, never ~100% (the pre-fix bug).
  assert.ok(correctWhenPicking1 < N * 0.5, `fixed-position strategy should not track the key (got ${correctWhenPicking1}/${N})`);
});

test('grade without attemptId is unchanged (identity order) — back-compat for legacy callers', () => {
  const p = pools.validatePool(RAW4);
  // No attemptId ⇒ choices in authored order ⇒ authored index 0 grades correct at display 0.
  const r = pools.grade(p, ['q1', 'q2', 'q3'], { q1: 0, q2: 0, q3: 0 });
  assert.equal(r.correct, 3);
  assert.equal(r.score, 100);
});

test('drag-match grading is unaffected by the MC choice shuffle', () => {
  const p = pools.validatePool(RAW4);
  const r = pools.grade(p, ['q1', 'm'], { q1: displayedPosOfAuthored(RAW4.pool[0], 9, 0), m: { t1: 'i1' } }, 9);
  assert.equal(r.correct, 2);
});
