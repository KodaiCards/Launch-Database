// routes/_assessment_pools.js
//
// Assessment-engine core (server-authoritative). Loads per-assessment QUESTION
// POOLS from version-controlled repo files, draws a random subset PER ATTEMPT,
// strips answer keys before anything ships to the client, and grades submitted
// answers server-side against the pool.
//
// WHY server-side (Planning Q1/Q2, 2026-07-01):
//   • Anti-cheat: the answer keys never leave the server; two accounts (and even
//     the same learner's retries) draw different question sets, so answer-sharing
//     breaks. Client-supplied scores are ignored — score is derived here.
//   • Reproducible: the drawn question ids + the learner's answers are stored on
//     the attempt row, so grading + the I11 dashboard replay exactly.
//   • Gate-aligned: pools live in the repo (content/training/assessment-pools/),
//     so each pool's research-log + independent red-team travel with it in git.
//
// Pool file format (one JSON per assessment, D013 — counts are DATA, not code):
//   {
//     "assessmentId": "T01-L01",        // unique id; matches the lesson/topic id
//     "kind":         "lesson",          // 'lesson' | 'topic_final'
//     "courseId":     "T01",
//     "lessonId":     "T01-L01",          // null/omitted for topic_final
//     "drawCount":    4,                  // questions shown per attempt (launch dial)
//     "passThreshold":70,                 // % to pass (lesson=70, topic_final=80)
//     "pool": [ <question>, ... ]         // the bank to draw from (>= drawCount)
//   }
//
// Question shapes (NO typed/free-text answers — Carter's ban; only these types):
//   multiple-choice: { id, type:'mc', prompt, choices:[...], answerIndex, explanation?, citation?, fieldNote? }
//   drag-match:      { id, type:'drag-match', prompt, items:[{id,label}], targets:[{id,label}], correctMap:{targetId:itemId}, explanation?, citation?, fieldNote? }

const fs = require('fs');
const path = require('path');

const POOL_DIR = path.join(__dirname, '..', 'content', 'training', 'assessment-pools');

// Answer-key fields stripped before a drawn question is sent to the client.
const ANSWER_KEY_FIELDS = ['answerIndex', 'correctMap', 'answer', 'answerDisplay'];

// Only these question types are allowed — enforces the typed-answer ban at load.
const ALLOWED_TYPES = new Set(['mc', 'multiple-choice', 'drag-match', 'dragdrop']);

let _cache = null; // assessmentId -> normalized pool

function _normalizeType(t) {
  if (t === 'mc' || t === 'multiple-choice') return 'mc';
  if (t === 'drag-match' || t === 'dragdrop') return 'drag-match';
  return t;
}

// Load + validate every pool file once, cache by assessmentId. Throwing here is
// intentional — a malformed or banned-type pool must fail loudly at boot/first
// use, never silently ship a broken assessment.
function _loadAll() {
  const map = new Map();
  let files = [];
  try {
    files = fs.readdirSync(POOL_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_readme'));
  } catch (_) {
    return map; // dir absent yet — no pools authored; engine returns 404s
  }
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(POOL_DIR, file), 'utf8'));
    const p = validatePool(raw, file);
    map.set(p.assessmentId, p);
  }
  return map;
}

function validatePool(raw, file = '(inline)') {
  if (!raw || typeof raw !== 'object') throw new Error(`[assessment-pools] ${file}: not an object`);
  const { assessmentId, kind, courseId } = raw;
  if (!assessmentId || typeof assessmentId !== 'string') throw new Error(`[assessment-pools] ${file}: missing assessmentId`);
  if (kind !== 'lesson' && kind !== 'topic_final') throw new Error(`[assessment-pools] ${assessmentId}: kind must be 'lesson' | 'topic_final'`);
  if (!courseId || typeof courseId !== 'string') throw new Error(`[assessment-pools] ${assessmentId}: missing courseId`);
  const drawCount = Number(raw.drawCount);
  if (!Number.isInteger(drawCount) || drawCount < 1) throw new Error(`[assessment-pools] ${assessmentId}: drawCount must be a positive integer`);
  const passThreshold = raw.passThreshold == null ? (kind === 'topic_final' ? 80 : 70) : Number(raw.passThreshold);
  if (!Number.isFinite(passThreshold) || passThreshold < 0 || passThreshold > 100) throw new Error(`[assessment-pools] ${assessmentId}: passThreshold must be 0–100`);
  if (!Array.isArray(raw.pool) || raw.pool.length < drawCount) {
    throw new Error(`[assessment-pools] ${assessmentId}: pool must have >= drawCount (${drawCount}) questions, got ${Array.isArray(raw.pool) ? raw.pool.length : 'none'}`);
  }
  const seen = new Set();
  const pool = raw.pool.map((q, i) => {
    if (!q || !q.id) throw new Error(`[assessment-pools] ${assessmentId}: question ${i} missing id`);
    if (seen.has(q.id)) throw new Error(`[assessment-pools] ${assessmentId}: duplicate question id '${q.id}'`);
    seen.add(q.id);
    const type = _normalizeType(q.type);
    if (!ALLOWED_TYPES.has(q.type)) throw new Error(`[assessment-pools] ${assessmentId} q '${q.id}': type '${q.type}' not allowed (typed-answer ban — use mc or drag-match)`);
    if (type === 'mc') {
      if (!Array.isArray(q.choices) || q.choices.length < 2) throw new Error(`[assessment-pools] ${assessmentId} q '${q.id}': mc needs >= 2 choices`);
      if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.choices.length) throw new Error(`[assessment-pools] ${assessmentId} q '${q.id}': answerIndex out of range`);
    } else if (type === 'drag-match') {
      if (!q.correctMap || typeof q.correctMap !== 'object') throw new Error(`[assessment-pools] ${assessmentId} q '${q.id}': drag-match needs correctMap`);
    }
    return { ...q, type };
  });
  return { assessmentId, kind, courseId, lessonId: raw.lessonId ?? null, drawCount, passThreshold, pool };
}

function _pools() {
  if (!_cache) _cache = _loadAll();
  return _cache;
}

function getPool(assessmentId) {
  return _pools().get(assessmentId) || null;
}

// Metadata for every loaded pool — NO questions/keys. Lets the SPA discover which
// lesson tests + topic finals exist (to gate UI) without shipping any answer data.
function listPools() {
  return [..._pools().values()].map(p => ({
    assessmentId: p.assessmentId,
    kind:         p.kind,
    courseId:     p.courseId,
    lessonId:     p.lessonId,
    drawCount:    p.drawCount,
    passThreshold: p.passThreshold,
    poolSize:     p.pool.length,
  }));
}

function reload() { _cache = null; return _pools(); }

// Fisher–Yates on a copy; optional injectable rng for deterministic tests.
function _shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draw `drawCount` question ids at random from the pool (per-attempt). Returns
// the ORDER to present in, too — questions are shuffled, so the sequence differs
// across attempts on top of the subset differing.
function drawQuestionIds(pool, rng = Math.random) {
  return _shuffle(pool.pool.map(q => q.id), rng).slice(0, pool.drawCount);
}

// Build the client payload for a set of drawn ids: full question minus answer keys.
// Missing ids are skipped (defensive — a pool edit shouldn't 500 an open attempt).
function drawnQuestionsForClient(pool, drawnIds) {
  const byId = new Map(pool.pool.map(q => [q.id, q]));
  return drawnIds
    .map(id => byId.get(id))
    .filter(Boolean)
    .map(stripAnswerKey);
}

function stripAnswerKey(q) {
  const out = {};
  for (const k of Object.keys(q)) if (!ANSWER_KEY_FIELDS.includes(k)) out[k] = q[k];
  return out;
}

// Grade one question against the learner's answer. Returns true/false.
function _isCorrect(q, given) {
  if (given == null) return false;
  if (q.type === 'mc') {
    return Number(given) === q.answerIndex;
  }
  if (q.type === 'drag-match') {
    if (typeof given !== 'object') return false;
    const keys = Object.keys(q.correctMap);
    if (Object.keys(given).length !== keys.length) return false;
    return keys.every(t => given[t] === q.correctMap[t]);
  }
  return false;
}

// Grade a submitted attempt server-side. `answers` = { questionId: value }.
// Only the drawn ids count (an answer to a non-drawn id is ignored). Returns
// { correct, total, score, passed, perQuestion } — score/passed derived here,
// never trusted from the client.
function grade(pool, drawnIds, answers = {}) {
  const byId = new Map(pool.pool.map(q => [q.id, q]));
  const perQuestion = {};
  let correct = 0;
  for (const id of drawnIds) {
    const q = byId.get(id);
    const ok = q ? _isCorrect(q, answers[id]) : false;
    perQuestion[id] = ok;
    if (ok) correct++;
  }
  const total = drawnIds.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, score, passed: score >= pool.passThreshold, perQuestion };
}

module.exports = {
  POOL_DIR,
  getPool,
  listPools,
  reload,
  validatePool,
  drawQuestionIds,
  drawnQuestionsForClient,
  stripAnswerKey,
  grade,
  _shuffle,
};
