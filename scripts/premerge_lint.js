#!/usr/bin/env node
/**
 * premerge_lint.js — the static half of `npm run premerge` (GATES §premerge, WO-3).
 *
 * Four checks, in the order GATES lists them:
 *   1. internal-note / pipeline-vocabulary leakage in trainee-visible strings
 *   2. positional-answer gameability
 *   3. pool draw-count sanity
 *   4. user-visible internal IDs (T0x / L0x)
 *
 * Exit code: 0 = clean, 1 = any violation (so the premerge orchestrator can
 * fail-fast). Pure Node, no deps, no DB — safe to run anywhere.
 *
 * SCOPE (`SCOPED_TOPICS`): the leak + user-visible-ID checks run only against
 * topics that have been through the WO-1/WO-2 readability gate, so the floor
 * catches *regressions in cleared topics* without blocking merges on topics
 * that haven't been authored to the new bar yet (rolling release). Add a topic
 * ID here the moment its readability pass merges. Draw-count + gameability are
 * assessment-integrity checks and run against ALL pools.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POOL_DIR = path.join(ROOT, 'content', 'training', 'assessment-pools');
const ENGINE_FILE = path.join(ROOT, 'routes', '_assessment_pools.js');
const LESSON_DIR = path.join(ROOT, 'osp-training', 'src', 'lessons');
const UI_DIRS = [
  path.join(ROOT, 'osp-training', 'src', 'components'),
  path.join(ROOT, 'osp-training', 'src', 'pages'),
];

// Topics whose trainee-visible strings have cleared the readability gate.
// Grow this as WO-2 topic passes land. (Live-5 = the training-fix scope.)
const SCOPED_TOPICS = ['T01', 'T18', 'T02', 'T03', 'T04'];

const violations = [];
function fail(check, file, detail) {
  violations.push({ check, file: path.relative(ROOT, file), detail });
}

// ── helpers ────────────────────────────────────────────────────────────────
function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
}
// Topic id lives in the DIRECTORY for lesson files (osp-training/.../T04/L02.*.jsx)
// and in the BASENAME for pool files (assessment-pools/T04-L02.json) — check both.
const topicOf = (p) => {
  const rel = path.relative(ROOT, p);
  const m = rel.match(/(?:^|[/\\])T(\d{2})[/\\]/) || path.basename(p).match(/T(\d{2})/);
  return m ? 'T' + m[1] : null;
};
const inScope = (p) => SCOPED_TOPICS.includes(topicOf(p));

// Body of a lesson file = everything after `export default function` (what renders).
// The `meta` object above it (key_terms/learning_objectives) is not rendered.
function lessonBody(src) {
  const idx = src.indexOf('export default function');
  return idx === -1 ? src : src.slice(idx);
}
// Strip // line and /* */ block comments — code comments legitimately contain
// words like "this session" / "verify" and must not be scanned as trainee copy.
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// ── CHECK 1: internal-note / pipeline-vocabulary leakage ─────────────────────
// Curated so ordinary "verify/verified" field advice does NOT trip it. The
// all-caps VERIFIED/UNVERIFIED tokens are authoring QA stamps; lowercase prose
// "verified" is legitimate and intentionally excluded.
const LEAK_PATTERNS = [
  [/research (?:log|brief)/i, 'research-log/brief reference'],
  [/\bUNVERIFIED\b/, 'UNVERIFIED audit tag'],
  [/\bVERIFIED[- ](?:primary|free|public|via|EXACT)/i, 'VERIFIED QA stamp'],
  [/\bVERIFIED\b(?!\s*[a-z])/, 'all-caps VERIFIED stamp'],
  [/\bthis session\b/i, '"this session" audit hedge'],
  [/\b[tT]\d\d\.md\b/, 'internal .md file reference'],
  [/research-logs?\//i, 'research-log path'],
  [/citation[- ]gate|the gate exists/i, 'citation-gate process note'],
  [/this course'?s (?:own )?source material|the source lesson material/i, 'source-material process note'],
  [/corrects? a citation error/i, 'citation-error process note'],
  [/\[[^\]]*(?:confirm (?:edition|current|against)|verify \d|UNVERIFIED|research (?:log|brief)|not (?:a single )?pinned|pinned down)[^\]]*\]/i, 'bracketed audit hedge'],
];
// Trainee-visible pool fields (all render — see Quiz/PooledAssessment primitives).
const VISIBLE_POOL_KEYS = new Set(['prompt', 'explanation', 'citation', 'fieldNote', 'label']);
function poolStrings(node, out) {
  if (Array.isArray(node)) { for (const v of node) poolStrings(v, out); return; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'string') { if (VISIBLE_POOL_KEYS.has(k)) out.push(v); }
      else poolStrings(v, out);
    }
    // bare choice strings live in arrays handled above; also catch choices[]
  }
}
function scanLeaks() {
  // pools in scope
  for (const f of walk(POOL_DIR, (p) => p.endsWith('.json'))) {
    if (!inScope(f)) continue;
    let json; try { json = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
    const strings = [];
    for (const q of json.pool || []) {
      poolStrings(q, strings);
      if (Array.isArray(q.choices)) for (const c of q.choices) if (typeof c === 'string') strings.push(c);
    }
    for (const s of strings) for (const [re, label] of LEAK_PATTERNS)
      if (re.test(s)) fail('internal-note', f, `${label}: "${s.slice(0, 90)}"`);
  }
  // lesson bodies in scope
  for (const f of walk(LESSON_DIR, (p) => p.endsWith('.jsx'))) {
    if (!inScope(f)) continue;
    const body = stripComments(lessonBody(fs.readFileSync(f, 'utf8')));
    for (const [re, label] of LEAK_PATTERNS) {
      const m = body.match(re);
      if (m) fail('internal-note', f, `${label}: "${m[0].slice(0, 80)}"`);
    }
  }
  // shared training UI components (apply to all topics — shared surface)
  for (const dir of UI_DIRS)
    for (const f of walk(dir, (p) => p.endsWith('.jsx'))) {
      const body = stripComments(lessonBody(fs.readFileSync(f, 'utf8')));
      for (const [re, label] of LEAK_PATTERNS) {
        const m = body.match(re);
        if (m) fail('internal-note', f, `${label}: "${m[0].slice(0, 80)}"`);
      }
    }
}

// ── CHECK 2: positional-answer gameability ───────────────────────────────────
// (a) RUNTIME-SHUFFLE INVARIANT. Since #57 the engine shuffles each MC question's
//     choices per attempt at draw time (`choiceOrder` → `drawnQuestionsForClient`) and
//     inverts the map at grade time, so a learner never sees a fixed position for the
//     correct answer — the authored index distribution is irrelevant. That replaces the
//     old "all MC answers sit at one authored index" heuristic, which is now a permanent
//     false positive. We guard the *defense that made it moot*: fail loudly if the choice
//     shuffle (or its grade-time inversion) is ever removed from the engine, which would
//     silently re-open §1.7 positional gameability.
// (b) a choice that telegraphs itself as correct/incorrect in its own text — still a real
//     authoring tell regardless of shuffle.
const TELEGRAPH = /\b(the correct (?:answer|mapping|choice)|correct answer|this is correct|\(correct\)|subtly incorrect|the wrong (?:answer|choice))\b/i;
function scanGameability() {
  // (a) engine invariant — the shuffle is the real §1.7 defense; assert it is present.
  const engineSrc = fs.existsSync(ENGINE_FILE) ? fs.readFileSync(ENGINE_FILE, 'utf8') : '';
  const src = stripComments(engineSrc);
  if (!engineSrc) {
    fail('gameability', ENGINE_FILE, 'assessment engine not found — cannot verify the per-attempt MC choice shuffle (§1.7)');
  } else {
    const definesOrder  = /function\s+choiceOrder\b/.test(src);
    const shufflesDraw  = /\.choices\s*=\s*choiceOrder\(/.test(src);
    const invertsAtGrade = /choiceOrder\([^)]*\)\[\s*Number\(given\)\s*\]/.test(src);
    if (!definesOrder || !shufflesDraw)
      fail('gameability', ENGINE_FILE, 'per-attempt MC choice shuffle missing from the draw path (§1.7 positional defense removed)');
    if (!invertsAtGrade)
      fail('gameability', ENGINE_FILE, 'grade path no longer inverts the choice shuffle — displayed-index answers would mis-grade (§1.7)');
  }
  // (b) self-telegraphing choice text.
  for (const f of walk(POOL_DIR, (p) => p.endsWith('.json'))) {
    let json; try { json = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
    const mc = (json.pool || []).filter((q) => q.type === 'mc' && Array.isArray(q.choices));
    for (const q of mc)
      for (const c of q.choices)
        if (typeof c === 'string' && TELEGRAPH.test(c))
          fail('gameability', f, `choice telegraphs correctness: "${c.slice(0, 80)}"`);
  }
}

// ── CHECK 3: pool draw-count sanity ──────────────────────────────────────────
function scanDrawCounts() {
  for (const f of walk(POOL_DIR, (p) => p.endsWith('.json'))) {
    let json; try { json = JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { fail('draw-count', f, `invalid JSON: ${e.message}`); continue; }
    const n = Array.isArray(json.pool) ? json.pool.length : 0;
    const draw = json.drawCount;
    if (!Number.isInteger(draw) || draw < 1) fail('draw-count', f, `drawCount must be a positive integer (got ${draw})`);
    else if (n < draw) fail('draw-count', f, `pool has ${n} questions but drawCount is ${draw} (pool < draw)`);
    if (json.passThreshold != null && (json.passThreshold < 0 || json.passThreshold > 100))
      fail('draw-count', f, `passThreshold out of range: ${json.passThreshold}`);
  }
}

// ── CHECK 4: user-visible internal IDs (T0x / L0x) ───────────────────────────
const ID_RE = /\bT\d\d(?:\.L\d\d|-L\d\d|\.md)?\b|\bL\d\d\b/;
function scanVisibleIds() {
  // pools in scope — visible fields only
  for (const f of walk(POOL_DIR, (p) => p.endsWith('.json'))) {
    if (!inScope(f)) continue;
    let json; try { json = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
    const strings = [];
    for (const q of json.pool || []) {
      poolStrings(q, strings);
      if (Array.isArray(q.choices)) for (const c of q.choices) if (typeof c === 'string') strings.push(c);
    }
    for (const s of strings) { const m = s.match(ID_RE); if (m) fail('visible-id', f, `raw internal ID "${m[0]}" in: "${s.slice(0, 80)}"`); }
  }
  // catalog titles (server-parsed + rendered)
  const cat = path.join(ROOT, 'osp-training', 'src', 'data', 'course-catalog.js');
  if (fs.existsSync(cat)) {
    const src = fs.readFileSync(cat, 'utf8');
    for (const m of src.matchAll(/title:\s*['"]([^'"]*)['"]/g))
      if (/\bT\d\d\b|\bL\d\d\b/.test(m[1])) fail('visible-id', cat, `catalog title contains raw ID: "${m[1]}"`);
  }
  // lesson assessment titles + headers in body (in scope) — the `title="…"` prop
  for (const f of walk(LESSON_DIR, (p) => p.endsWith('.jsx'))) {
    if (!inScope(f)) continue;
    const body = lessonBody(fs.readFileSync(f, 'utf8'));
    for (const m of body.matchAll(/title=["']([^"']*)["']/g))
      if (/\bT\d\d\.L\d\d\b|\bL\d\d\b/.test(m[1])) fail('visible-id', f, `rendered title prop has raw ID: "${m[1]}"`);
  }
  // lesson body RENDERED content (in scope) — both prose cross-references
  // ("T03.L01 taught you…", "<li>T04.L02 …", "covered in T05") AND inline-quiz
  // visible fields (prompt/explanation/citation/choices render to the trainee).
  // Isolate rendered text by stripping comments, JSX attribute VALUES, and object
  // id-property values — all the HYPHEN-form code IDs (assessmentId="T03-L11",
  // deckId="…", question `id:'T03-L01-Q1'`). Inline-quiz objects are object literals
  // (`prompt:`/`explanation:`), left intact, so their IDs are caught — a blanket
  // brace-strip would erase them. Then apply the same ID_RE the pool scan uses, so
  // lesson bodies are held to the identical visible-ID standard (dotted, hyphen, and
  // bare T0x/L0x). Verified: 0 code-context false positives across the live-5.
  const bodyIdRe = new RegExp(ID_RE.source, 'g');
  for (const f of walk(LESSON_DIR, (p) => p.endsWith('.jsx'))) {
    if (!inScope(f)) continue;
    const rendered = stripComments(lessonBody(fs.readFileSync(f, 'utf8')))
      .replace(/\w[\w-]*=(["']).*?\1/gs, ' ')      // strip JSX attribute values (title="…", assessmentId="T03-L11")
      .replace(/\b\w*[iI]d:\s*([`"']).*?\1/g, ' '); // strip object id-property values incl. template literals (id: `T04-L07-fc-${…}`)
    const seen = new Set();
    for (const m of rendered.matchAll(bodyIdRe)) {
      if (seen.has(m[0])) continue;
      seen.add(m[0]);
      fail('visible-id', f, `raw internal ID "${m[0]}" in rendered lesson body`);
    }
  }
}

// ── run ──────────────────────────────────────────────────────────────────────
scanLeaks();
scanGameability();
scanDrawCounts();
scanVisibleIds();

if (violations.length === 0) {
  console.log('premerge-lint: PASS — 0 violations (scope: ' + SCOPED_TOPICS.join(', ') + ' + all pools for draw-count/gameability + shared UI)');
  process.exit(0);
}
const byCheck = {};
for (const v of violations) (byCheck[v.check] ||= []).push(v);
console.error(`premerge-lint: FAIL — ${violations.length} violation(s)\n`);
for (const [check, list] of Object.entries(byCheck)) {
  console.error(`  [${check}] ${list.length}`);
  for (const v of list) console.error(`    ${v.file} — ${v.detail}`);
}
process.exit(1);
