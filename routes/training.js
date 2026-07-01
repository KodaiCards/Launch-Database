// routes/training.js — OSP training progress API (OSP-RW.2)
//
// Endpoints:
//   GET  /api/training/progress                  — current user's full progress map
//   POST /api/training/progress                  — record lesson progress + quiz score
//   POST /api/training/cert-attempt              — record cert mock exam attempt
//   GET  /api/training/cert-attempts             — current user's cert attempt history
//   POST /api/training/capstone-attempt          — record per-topic capstone attempt
//   GET  /api/training/admin/progress-overview   — manager/admin view of all users
//   GET  /api/training/admin/user/:userId/detail — per-user breakdown (admin)
//   GET  /api/training/admin/cert-attempts       — cert attempt history (admin, optional ?user_id=)
//
// Security: every route behind requireAuth(). Admin endpoints further gated
// to admin / design_manager / permitting_manager roles.
//
// DB error messages are NOT forwarded to clients (Wave 1.6 lesson).
// All queries use parameterized placeholders — no string concat.

const { logAudit } = require('./_audit');
const { broadcast } = require('./_sse');
const pools = require('./_assessment_pools');
const fs = require('fs');
const path = require('path');

// The course catalog (osp-training/src/data/course-catalog.js) is the declared
// source of truth for course titles + lesson counts. We parse it once to drive
// admin progress denominators (per-subject + overall). Memoized; falls back to
// [] if it can't be parsed (the UI then shows raw completed counts).
const CATALOG_PATH = path.join(__dirname, '..', 'osp-training', 'src', 'data', 'course-catalog.js');

let _curriculumCourses;
function curriculumCourses() {
  if (_curriculumCourses !== undefined) return _curriculumCourses;
  try {
    const txt = fs.readFileSync(CATALOG_PATH, 'utf8');
    const courses = [];
    let cur = null;
    for (const line of txt.split('\n')) {
      const idm = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
      if (idm) { cur = { id: idm[1], title: null, section: null, available: false, lesson_count: 0 }; courses.push(cur); continue; }
      if (!cur) continue;
      const tm = line.match(/title:\s*['"]([^'"]*)['"]/); if (tm && cur.title === null) cur.title = tm[1];
      const sm = line.match(/section:\s*['"]([^'"]+)['"]/); if (sm && cur.section === null) cur.section = sm[1];
      const am = line.match(/available:\s*(true|false)/); if (am) cur.available = (am[1] === 'true');
      const lm = line.match(/lesson_count:\s*(\d+)/); if (lm) cur.lesson_count = parseInt(lm[1], 10);
    }
    _curriculumCourses = courses;
  } catch (e) {
    console.error('[training] curriculum catalog parse failed:', e && e.message);
    _curriculumCourses = [];
  }
  return _curriculumCourses;
}
// Available, authored courses (the ones that count toward progress).
function curriculumSubjects() {
  return curriculumCourses().filter(c => c.available && c.lesson_count > 0);
}
function curriculumTotalLessons() {
  const t = curriculumSubjects().reduce((a, c) => a + c.lesson_count, 0);
  return t > 0 ? t : null;
}

// ── Content-visibility model (per-staff training access) ─────────────────────
// Tracks: section 'general' → 'osp', 'isp' → 'isp', 'cert' → 'cert'.
// Subject = course id (T01…). Lesson = `${courseId}.L0N`.
const SECTION_TRACK = { general: 'osp', isp: 'isp', cert: 'cert' };
const TRACK_TITLE = { osp: 'OSP', isp: 'ISP', cert: 'Certification' };

let _lessonTitles;
function lessonTitles() {
  if (_lessonTitles !== undefined) return _lessonTitles;
  const out = {};
  try {
    const txt = fs.readFileSync(CATALOG_PATH, 'utf8');
    // Matches both lessonFileIndex (path values) and lessonTitleIndex (title values);
    // keep only the title entries (values that aren't a '../…' import path).
    const re = /'([A-Z]\d{2}\.L\d{2}[a-z]?)'\s*:\s*'((?:\\.|[^'])*)'/g;
    let m;
    while ((m = re.exec(txt))) {
      if (m[2].startsWith('../')) continue;
      out[m[1]] = m[2].replace(/\\'/g, "'");
    }
  } catch (e) { /* fallback: generic lesson titles */ }
  _lessonTitles = out;
  return _lessonTitles;
}

let _curriculumTree;
function curriculumTree() {
  if (_curriculumTree !== undefined) return _curriculumTree;
  const titles = lessonTitles();
  const trackMap = new Map();
  const lessonToSubject = new Map();
  const subjectToTrack = new Map();
  const allLessons = new Set();
  for (const c of curriculumCourses()) {
    const track = SECTION_TRACK[c.section] || 'osp';
    if (!trackMap.has(track)) trackMap.set(track, { id: track, title: TRACK_TITLE[track] || track, subjects: [] });
    const lessons = [];
    for (let i = 1; i <= (c.lesson_count || 0); i++) {
      const lid = `${c.id}.L${String(i).padStart(2, '0')}`;
      lessons.push({ id: lid, title: titles[lid] || `Lesson ${i}` });
      lessonToSubject.set(lid, c.id);
      allLessons.add(lid);
    }
    subjectToTrack.set(c.id, track);
    trackMap.get(track).subjects.push({
      id: c.id, title: c.title || c.id, available: c.available,
      lesson_count: c.lesson_count, lessons,
    });
  }
  _curriculumTree = { tracks: Array.from(trackMap.values()), lessonToSubject, subjectToTrack, allLessons };
  return _curriculumTree;
}

// Expand a scope (track|subject|lesson) to the set of lesson ids it covers.
function expandScopeToLessons(scopeType, scopeId, tree) {
  const out = [];
  if (scopeType === 'lesson') {
    if (tree.allLessons.has(scopeId)) out.push(scopeId);
  } else if (scopeType === 'subject') {
    for (const [lid, sid] of tree.lessonToSubject) if (sid === scopeId) out.push(lid);
  } else if (scopeType === 'track') {
    for (const [lid, sid] of tree.lessonToSubject) if (tree.subjectToTrack.get(sid) === scopeId) out.push(lid);
  }
  return out;
}

// Expand a list of preset scopes (track|subject|lesson rows) → a Set of lesson ids.
function scopesToLessonSet(scopes, tree) {
  const set = new Set();
  for (const s of (scopes || [])) for (const l of expandScopeToLessons(s.scope_type, s.scope_id, tree)) set.add(l);
  return set;
}

// ── THE ONE RESOLVER (WP-A, server-authoritative) ───────────────────────────
// visible(non-admin) = ( default ∪ per-user SHOW − per-user HIDE ) ∩ published
// Hide ALWAYS wins (computed every call → revoking content the learner already
// opened truly hides it; progress rows are irrelevant to visibility). Everything
// is intersected with `published` so nothing un-published can ever leak. Admin is
// resolved separately (sees all) and never reaches this function.
//
//   defaultLessons  : Set — the new-user-default lesson set (intent ∩ published happens here)
//   publishedLessons: Set — the published lesson set (the hard ceiling)
//   overrides       : [{scope_type, scope_id, mode:'show'|'hide'}] — per-user grant/revoke
function resolveVisibleLessons(defaultLessons, publishedLessons, overrides, tree) {
  // Start from the new-user default, then apply per-user SHOW (grant), then HIDE (revoke).
  const set = new Set(defaultLessons);
  for (const o of (overrides || [])) if (o.mode === 'show') for (const l of expandScopeToLessons(o.scope_type, o.scope_id, tree)) set.add(l);
  for (const o of (overrides || [])) if (o.mode === 'hide') for (const l of expandScopeToLessons(o.scope_type, o.scope_id, tree)) set.delete(l);
  // Intersect with published — the ceiling. Un-published lessons are never visible
  // to a non-admin, regardless of default/grant. (A per-user SHOW of an unpublished
  // lesson is intentionally inert until it's published.)
  for (const l of [...set]) if (!publishedLessons.has(l)) set.delete(l);
  return set;
}

// Derive visible subject + track id sets from a visible-lessons set.
function deriveVisible(lessonSet, tree) {
  const subjects = new Set(), tracks = new Set();
  for (const lid of lessonSet) {
    const sid = tree.lessonToSubject.get(lid);
    if (sid) { subjects.add(sid); tracks.add(tree.subjectToTrack.get(sid)); }
  }
  return { subjects, tracks };
}

// Completion gating (Carter 2026-06-26): a lesson is only credited as completed
// when competency is proven — a passing quiz score or an explicit interactive
// competency flag. Authored lessons must carry an assessment/interactive check.
const PASS_THRESHOLD = 70;

module.exports = function installTrainingRoutes(app, pool, { requireAuth }) {

  // ─── GET /api/training/progress ─────────────────────────────────────────────
  // Returns the current user's full progress map: an array of training_progress
  // rows. The SPA indexes these by lesson_id to render per-lesson status on the
  // splash tile and course view.
  app.get('/api/training/progress', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT course_id,
                lesson_id,
                status,
                completion_pct,
                best_score,
                attempts,
                started_at,
                completed_at,
                last_seen_at
           FROM training_progress
          WHERE user_id = $1
          ORDER BY course_id, lesson_id
          LIMIT 1000`,
        [req.user.id]
      );
      res.json({ progress: rows });
    } catch (err) {
      console.error('[training] GET /progress error:', err.message);
      res.status(500).json({ error: 'Failed to load training progress' });
    }
  });

  // ─── POST /api/training/progress ────────────────────────────────────────────
  // Upserts a training_progress row for the current user + lesson.
  // Body: { course_id, lesson_id, status, completion_pct, score? }
  //
  // Rules:
  //   - status can only advance (not_started → in_progress → completed).
  //     A completed lesson is never regressed by a subsequent in_progress write.
  //   - best_score is only updated when the new score exceeds the stored one.
  //   - attempts is incremented on every POST with status=completed or
  //     when a score is included (quiz attempt semantics).
  app.post('/api/training/progress', requireAuth(), async (req, res) => {
    const { course_id, lesson_id, status, completion_pct, score } = req.body || {};

    // ── Validate required fields ──────────────────────────────────────────────
    if (!course_id || typeof course_id !== 'string' || course_id.length > 50) {
      return res.status(400).json({ error: 'course_id is required (string, max 50 chars)' });
    }
    if (!lesson_id || typeof lesson_id !== 'string' || lesson_id.length > 100) {
      return res.status(400).json({ error: 'lesson_id is required (string, max 100 chars)' });
    }
    const validStatuses = ['not_started', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }
    const pct = Number(completion_pct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return res.status(400).json({ error: 'completion_pct must be an integer 0–100' });
    }
    if (score !== undefined && score !== null) {
      const s = Number(score);
      if (!Number.isFinite(s) || s < 0 || s > 100) {
        return res.status(400).json({ error: 'score must be an integer 0–100 when provided' });
      }
    }

    // Completion gating: only credit 'completed' when competency is proven — a
    // passing quiz score (≥ PASS_THRESHOLD) or an explicit interactive competency
    // flag. A 'completed' without proof is recorded as in_progress so the
    // learner's place is kept but the lesson isn't credited.
    const numScore = (score !== undefined && score !== null) ? Number(score) : null;
    const competency = req.body && req.body.competency === true;
    let effectiveStatus = status;
    let creditBlocked = false;
    if (status === 'completed' && !((numScore !== null && numScore >= PASS_THRESHOLD) || competency)) {
      effectiveStatus = 'in_progress';
      creditBlocked = true;
    }

    // Visibility gate (WP-A, Carter scope-change): a non-admin may not record
    // progress against a REAL lesson that is hidden/revoked for them — it's treated
    // as if it doesn't exist (server-enforced; complements the SPA hide). We only
    // gate lessons that EXIST in the catalog; unknown/synthetic ids fall through to
    // normal handling (they reference no real content). Admins bypass entirely.
    try {
      if (req.user.role !== 'admin') {
        const tree = curriculumTree();
        if (tree.allLessons.has(lesson_id)) {
          const v = await loadUserVisibility(req.user.id, req.user.role);
          if (!v.all && !v.lessons.has(lesson_id)) {
            return res.status(404).json({ error: 'Lesson not found' });
          }
        }
      }
    } catch (_) { /* visibility check failed — fall through to normal handling */ }

    try {
      // Upsert with status-advancement and best-score guard:
      //   ON CONFLICT updates only if incoming status ranks higher or
      //   completion_pct increases, and never replaces a completed_at timestamp.
      const { rows } = await pool.query(
        `INSERT INTO training_progress
           (user_id, course_id, lesson_id, status, completion_pct,
            best_score, attempts, started_at, completed_at, last_seen_at)
         VALUES
           ($1, $2, $3, $4, $5,
            $6, 1,
            CASE WHEN $4 IN ('in_progress','completed') THEN NOW() END,
            CASE WHEN $4 = 'completed' THEN NOW() END,
            NOW())
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET
           status         = CASE
                              WHEN training_progress.status = 'completed' THEN 'completed'
                              WHEN EXCLUDED.status = 'completed'          THEN 'completed'
                              WHEN EXCLUDED.status = 'in_progress'        THEN 'in_progress'
                              ELSE training_progress.status
                            END,
           completion_pct = GREATEST(training_progress.completion_pct, EXCLUDED.completion_pct),
           best_score     = CASE
                              WHEN EXCLUDED.best_score IS NULL THEN training_progress.best_score
                              WHEN training_progress.best_score IS NULL THEN EXCLUDED.best_score
                              ELSE GREATEST(training_progress.best_score, EXCLUDED.best_score)
                            END,
           attempts       = CASE
                              WHEN EXCLUDED.best_score IS NOT NULL OR EXCLUDED.status = 'completed'
                              THEN training_progress.attempts + 1
                              ELSE training_progress.attempts
                            END,
           started_at     = COALESCE(training_progress.started_at, EXCLUDED.started_at),
           completed_at   = CASE
                              WHEN training_progress.completed_at IS NOT NULL THEN training_progress.completed_at
                              WHEN EXCLUDED.status = 'completed' THEN NOW()
                              ELSE NULL
                            END,
           last_seen_at   = NOW(),
           course_id      = EXCLUDED.course_id
         RETURNING *, (xmax = 0) AS is_insert`,
        [req.user.id, course_id, lesson_id, effectiveStatus, Math.round(pct),
          score !== undefined && score !== null ? Math.round(Number(score)) : null]
      );
      // xmax = 0 means the row was freshly inserted; xmax != 0 means it was
      // updated in the ON CONFLICT path. Using xmax is reliable whereas
      // checking attempts === 1 breaks for upserts that don't increment attempts
      // (e.g. in_progress update with no score).
      const isInsert = rows[0].is_insert;
      const { is_insert: _drop, ...progress } = rows[0];
      logAudit(pool, {
        req,
        action: isInsert ? 'training.progress_create' : 'training.progress_update',
        entity_type: 'training_progress',
        entity_id: progress.id,
        after: progress,
        source: 'user',
        meta: { course_id, lesson_id, status, completion_pct: Math.round(pct) },
      }).catch(() => {});
      // Tell the SPA whether completion was credited so it can prompt the learner
      // to reach the passing score / finish the interactive check.
      res.status(isInsert ? 201 : 200).json({
        progress,
        pass_threshold: PASS_THRESHOLD,
        completion_credited: progress.status === 'completed',
        credit_blocked: creditBlocked,
      });
    } catch (err) {
      console.error('[training] POST /progress error:', err.message);
      res.status(500).json({ error: 'Failed to save training progress' });
    }
  });

  // ─── POST /api/training/cert-attempt ────────────────────────────────────────
  // Records a completed cert mock exam attempt.
  // Body: { cert_track, time_taken_seconds?, domain_scores?, total_items, correct_items }
  //
  // SECURITY: client-supplied `score` and `passed` are intentionally ignored.
  // Both are derived server-side from total_items / correct_items so a client
  // cannot fabricate a passing attempt with a score of 0.
  //   score  = Math.round(correct_items / total_items * 100)
  //   passed = score >= 80  (80% pass threshold)
  app.post('/api/training/cert-attempt', requireAuth(), async (req, res) => {
    const { cert_track, time_taken_seconds, domain_scores,
            total_items, correct_items } = req.body || {};

    const validTracks = ['osp-general', 'OSP-Designer', 'RCDD', 'CFOT', 'CFOS-O'];
    if (!cert_track || !validTracks.includes(cert_track)) {
      return res.status(400).json({ error: `cert_track must be one of: ${validTracks.join(', ')}` });
    }
    const totalN = Number(total_items);
    const correctN = Number(correct_items);
    if (!Number.isInteger(totalN) || totalN < 1) {
      return res.status(400).json({ error: 'total_items must be a positive integer' });
    }
    if (!Number.isInteger(correctN) || correctN < 0 || correctN > totalN) {
      return res.status(400).json({ error: 'correct_items must be 0–total_items' });
    }

    // Derive score and passed server-side — client values are ignored.
    const score = Math.round(correctN / totalN * 100);
    const passed = score >= 80;

    const timeTaken = time_taken_seconds !== undefined && time_taken_seconds !== null
      ? Number(time_taken_seconds) : null;
    if (timeTaken !== null && (!Number.isFinite(timeTaken) || timeTaken < 0)) {
      return res.status(400).json({ error: 'time_taken_seconds must be a non-negative number' });
    }

    if (domain_scores !== undefined && domain_scores !== null) {
      if (typeof domain_scores !== 'object' || Array.isArray(domain_scores)) {
        return res.status(400).json({ error: 'domain_scores must be a plain object when provided' });
      }
      const dsStr = JSON.stringify(domain_scores);
      if (dsStr.length > 8192) {
        return res.status(400).json({ error: 'domain_scores exceeds 8KB limit' });
      }
    }

    try {
      const { rows } = await pool.query(
        `INSERT INTO training_cert_attempts
           (user_id, cert_track, score, passed, time_taken_seconds,
            domain_scores, total_items, correct_items)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [req.user.id, cert_track, score, passed,
          timeTaken !== null ? Math.round(timeTaken) : null,
          domain_scores ? JSON.stringify(domain_scores) : null,
          totalN, correctN]
      );
      logAudit(pool, {
        req,
        action: 'training.cert_attempt',
        entity_type: 'training_cert_attempt',
        entity_id: rows[0].id,
        after: rows[0],
        source: 'user',
        meta: { cert_track, score, passed, total_items: totalN, correct_items: correctN },
      }).catch(() => {});
      res.status(201).json({ attempt: rows[0] });
    } catch (err) {
      console.error('[training] POST /cert-attempt error:', err.message);
      res.status(500).json({ error: 'Failed to save cert attempt' });
    }
  });

  // ─── GET /api/training/cert-attempts ────────────────────────────────────────
  // Returns the current user's cert attempt history, newest first.
  app.get('/api/training/cert-attempts', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, cert_track, attempt_date, score, passed,
                time_taken_seconds, domain_scores, total_items, correct_items
           FROM training_cert_attempts
          WHERE user_id = $1
          ORDER BY attempt_date DESC
          LIMIT 1000`,
        [req.user.id]
      );
      res.json({ attempts: rows });
    } catch (err) {
      console.error('[training] GET /cert-attempts error:', err.message);
      res.status(500).json({ error: 'Failed to load cert attempts' });
    }
  });

  // ─── POST /api/training/capstone-attempt ────────────────────────────────────
  // Records a per-topic capstone quiz attempt.
  // Body: { course_id, score, passed, total_items, correct_items }
  // SECURITY: client-supplied `score` and `passed` are intentionally ignored.
  // Both are derived server-side from total_items / correct_items so a client
  // cannot fabricate a passing attempt with score=0 and passed=true.
  //   score  = Math.round(correct_items / total_items * 100)
  //   passed = score >= 80  (80% pass threshold)
  app.post('/api/training/capstone-attempt', requireAuth(), async (req, res) => {
    const { course_id, total_items, correct_items } = req.body || {};

    if (!course_id || typeof course_id !== 'string' || course_id.length > 50) {
      return res.status(400).json({ error: 'course_id is required (string, max 50 chars)' });
    }
    const totalN = Number(total_items);
    const correctN = Number(correct_items);
    if (!Number.isInteger(totalN) || totalN < 1) {
      return res.status(400).json({ error: 'total_items must be a positive integer' });
    }
    if (!Number.isInteger(correctN) || correctN < 0 || correctN > totalN) {
      return res.status(400).json({ error: 'correct_items must be 0–total_items' });
    }

    // Derive score and passed server-side — client-supplied values are ignored.
    const score = Math.round(correctN / totalN * 100);
    const passed = score >= 80;

    try {
      const { rows } = await pool.query(
        `INSERT INTO training_topic_capstone_attempts
           (user_id, course_id, score, passed, total_items, correct_items)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [req.user.id, course_id, score, passed, totalN, correctN]
      );
      logAudit(pool, {
        req,
        action: 'training.capstone_attempt',
        entity_type: 'training_capstone_attempt',
        entity_id: rows[0].id,
        after: rows[0],
        source: 'user',
        meta: { course_id, score, passed, total_items: totalN, correct_items: correctN },
      }).catch(() => {});
      res.status(201).json({ attempt: rows[0] });
    } catch (err) {
      console.error('[training] POST /capstone-attempt error:', err.message);
      res.status(500).json({ error: 'Failed to save capstone attempt' });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSESSMENT ENGINE (server-authoritative pools — Planning approval 2026-07-01)
  //
  // Flow: START draws a random subset from the repo pool (answer keys stripped)
  // and opens an attempt row → learner answers → SUBMIT grades server-side against
  // the pool, stores answers + derived score on the attempt, and (for a lesson)
  // drives the competency gate. Client-supplied scores are never trusted.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── GET /api/training/assessment/available ──────────────────────────────────
  // Which assessments exist (lesson tests + topic finals) — metadata only, NO
  // questions/keys. Lets the SPA gate UI (e.g. only show a Topic Final button when
  // a final pool is actually authored). Optional ?course_id= filter. For a
  // non-admin, lesson assessments whose lesson is hidden are omitted (WP-A).
  app.get('/api/training/assessment/available', requireAuth(), async (req, res) => {
    try {
      let list = pools.listPools();
      if (req.query.course_id) list = list.filter(p => p.courseId === String(req.query.course_id));
      if (req.user.role !== 'admin') {
        const tree = curriculumTree();
        const v = await loadUserVisibility(req.user.id, req.user.role);
        list = list.filter(p => {
          if (!p.lessonId) return true;                       // topic finals: course-level
          if (!tree.allLessons.has(p.lessonId)) return true;  // not a real catalog lesson
          return v.all || v.lessons.has(p.lessonId);          // hidden lesson → omit
        });
      }
      res.json({ assessments: list });
    } catch (err) {
      console.error('[training] GET /assessment/available error:', err.message);
      res.status(500).json({ error: 'Failed to list assessments' });
    }
  });

  // ─── POST /api/training/assessment/:assessmentId/start ───────────────────────
  // Draws a per-attempt question set, opens an attempt row, returns the drawn
  // questions WITHOUT answer keys + the attempt id. Non-admins may only start an
  // assessment whose lesson is visible to them (WP-A visibility gate); admins bypass.
  app.post('/api/training/assessment/:assessmentId/start', requireAuth(), async (req, res) => {
    const pool = pools.getPool(req.params.assessmentId);
    if (!pool) return res.status(404).json({ error: 'Assessment not found' });

    // Visibility gate: a lesson assessment tracks its lesson's visibility. If the
    // lesson exists in the catalog and is hidden for this non-admin, it's 404 (as
    // if it doesn't exist), matching the WP-A hide-completely model.
    try {
      if (req.user.role !== 'admin' && pool.lessonId) {
        const tree = curriculumTree();
        if (tree.allLessons.has(pool.lessonId)) {
          const v = await loadUserVisibility(req.user.id, req.user.role);
          if (!v.all && !v.lessons.has(pool.lessonId)) {
            return res.status(404).json({ error: 'Assessment not found' });
          }
        }
      }
    } catch (_) { /* visibility check failed — fall through (fail toward normal handling) */ }

    const drawnIds = pools.drawQuestionIds(pool);
    try {
      const { rows } = await pool_insert_attempt(pool, req.user.id, drawnIds);
      res.status(201).json({
        attempt_id: rows[0].id,
        assessment_id: pool.assessmentId,
        kind: pool.kind,
        course_id: pool.courseId,
        lesson_id: pool.lessonId,
        pass_threshold: pool.passThreshold,
        questions: pools.drawnQuestionsForClient(pool, drawnIds), // answer keys stripped
      });
    } catch (err) {
      console.error('[training] POST /assessment/start error:', err.message);
      res.status(500).json({ error: 'Failed to start assessment' });
    }
  });

  function pool_insert_attempt(poolDef, userId, drawnIds) {
    return pool.query(
      `INSERT INTO training_assessment_attempts
         (user_id, assessment_id, kind, course_id, lesson_id, drawn_question_ids, status)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, 'open')
       RETURNING id`,
      [userId, poolDef.assessmentId, poolDef.kind, poolDef.courseId, poolDef.lessonId,
       JSON.stringify(drawnIds)]
    );
  }

  // ─── POST /api/training/assessment/:assessmentId/submit ──────────────────────
  // Body: { attempt_id, answers:{questionId:value}, duration_seconds? }
  // Grades server-side against the drawn ids stored on the attempt (reproducible),
  // records answers + derived score/passed, and — for a lesson — feeds the
  // competency gate (>= passThreshold credits completion). Idempotent-ish: a
  // second submit on an already-submitted attempt is rejected.
  app.post('/api/training/assessment/:assessmentId/submit', requireAuth(), async (req, res) => {
    const { attempt_id, answers, duration_seconds } = req.body || {};
    const poolDef = pools.getPool(req.params.assessmentId);
    if (!poolDef) return res.status(404).json({ error: 'Assessment not found' });
    if (!Number.isInteger(Number(attempt_id))) return res.status(400).json({ error: 'attempt_id required' });
    const ans = (answers && typeof answers === 'object') ? answers : {};
    const dur = (duration_seconds != null && Number.isFinite(Number(duration_seconds)) && Number(duration_seconds) >= 0)
      ? Math.round(Number(duration_seconds)) : null;

    try {
      // Load the OPEN attempt, owned by this user, for this assessment.
      const { rows: aRows } = await pool.query(
        `SELECT * FROM training_assessment_attempts
          WHERE id = $1 AND user_id = $2 AND assessment_id = $3`,
        [Number(attempt_id), req.user.id, poolDef.assessmentId]
      );
      if (aRows.length === 0) return res.status(404).json({ error: 'Attempt not found' });
      const attempt = aRows[0];
      if (attempt.status === 'submitted') return res.status(409).json({ error: 'Attempt already submitted' });

      const drawnIds = Array.isArray(attempt.drawn_question_ids)
        ? attempt.drawn_question_ids
        : JSON.parse(attempt.drawn_question_ids);
      const result = pools.grade(poolDef, drawnIds, ans);

      const { rows: uRows } = await pool.query(
        `UPDATE training_assessment_attempts
            SET answers = $2::jsonb, score = $3, total_items = $4, correct_items = $5,
                passed = $6, status = 'submitted', duration_seconds = $7, submitted_at = NOW()
          WHERE id = $1
        RETURNING *`,
        [attempt.id, JSON.stringify(ans), result.score, result.total, result.correct,
         result.passed, dur]
      );

      // For a lesson assessment, feed the existing competency gate: a passing score
      // credits completion (reusing the monotonic upsert semantics of /progress).
      let progress = null;
      if (poolDef.kind === 'lesson' && poolDef.lessonId) {
        const { rows: pRows } = await pool.query(
          `INSERT INTO training_progress
             (user_id, course_id, lesson_id, status, completion_pct,
              best_score, attempts, started_at, completed_at, last_seen_at)
           VALUES ($1, $2, $3, $4, 100, $5, 1,
             NOW(), CASE WHEN $4 = 'completed' THEN NOW() END, NOW())
           ON CONFLICT (user_id, lesson_id) DO UPDATE SET
             status = CASE
                        WHEN training_progress.status = 'completed' THEN 'completed'
                        WHEN EXCLUDED.status = 'completed' THEN 'completed'
                        WHEN EXCLUDED.status = 'in_progress' THEN 'in_progress'
                        ELSE training_progress.status END,
             completion_pct = GREATEST(training_progress.completion_pct, EXCLUDED.completion_pct),
             best_score = CASE
                        WHEN EXCLUDED.best_score IS NULL THEN training_progress.best_score
                        WHEN training_progress.best_score IS NULL THEN EXCLUDED.best_score
                        ELSE GREATEST(training_progress.best_score, EXCLUDED.best_score) END,
             attempts = training_progress.attempts + 1,
             started_at = COALESCE(training_progress.started_at, EXCLUDED.started_at),
             completed_at = CASE
                        WHEN training_progress.completed_at IS NOT NULL THEN training_progress.completed_at
                        WHEN EXCLUDED.status = 'completed' THEN NOW() ELSE NULL END,
             last_seen_at = NOW(), course_id = EXCLUDED.course_id
           RETURNING *`,
          [req.user.id, poolDef.courseId, poolDef.lessonId,
           result.passed ? 'completed' : 'in_progress', result.score]
        );
        progress = pRows[0];
      }

      logAudit(pool, {
        req,
        action: 'training.assessment_submit',
        entity_type: 'training_assessment_attempt',
        entity_id: attempt.id,
        after: uRows[0],
        source: 'user',
        meta: { assessment_id: poolDef.assessmentId, kind: poolDef.kind, score: result.score, passed: result.passed },
      }).catch(() => {});

      res.status(200).json({
        score: result.score,
        correct: result.correct,
        total: result.total,
        passed: result.passed,
        pass_threshold: poolDef.passThreshold,
        per_question: result.perQuestion,
        completion_credited: progress ? progress.status === 'completed' : null,
      });
    } catch (err) {
      console.error('[training] POST /assessment/submit error:', err.message);
      res.status(500).json({ error: 'Failed to submit assessment' });
    }
  });

  // ─── GET /api/training/assessment/attempts ───────────────────────────────────
  // The learner's own submitted attempts (for the I11 dashboard). Optional
  // ?assessment_id= / ?course_id= filters. Answer keys never appear here.
  app.get('/api/training/assessment/attempts', requireAuth(), async (req, res) => {
    const clauses = ['user_id = $1', "status = 'submitted'"];
    const params = [req.user.id];
    if (req.query.assessment_id) { params.push(String(req.query.assessment_id)); clauses.push(`assessment_id = $${params.length}`); }
    if (req.query.course_id)     { params.push(String(req.query.course_id));     clauses.push(`course_id = $${params.length}`); }
    try {
      const { rows } = await pool.query(
        `SELECT id, assessment_id, kind, course_id, lesson_id, score, total_items,
                correct_items, passed, duration_seconds, started_at, submitted_at
           FROM training_assessment_attempts
          WHERE ${clauses.join(' AND ')}
          ORDER BY submitted_at DESC
          LIMIT 200`,
        params
      );
      res.json({ attempts: rows });
    } catch (err) {
      console.error('[training] GET /assessment/attempts error:', err.message);
      res.status(500).json({ error: 'Failed to load attempts' });
    }
  });

  // ─── GET /api/training/admin/progress-overview ───────────────────────────────
  // Manager/admin view of all users' training progress.
  // Gated to: admin, design_manager, permitting_manager.
  // Returns per-user aggregated progress: lessons_completed, last_seen_at,
  // and a per-course breakdown.

  app.get('/api/training/admin/progress-overview', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {

    try {
      // Per-user, per-course rollup: lessons_completed, last_seen_at
      const { rows } = await pool.query(
        `SELECT
           u.id            AS user_id,
           u.full_name     AS name,
           u.username,
           tp.course_id,
           COUNT(*)                                           AS lessons_total,
           COUNT(*) FILTER (WHERE tp.status = 'completed')   AS lessons_completed,
           MAX(tp.last_seen_at)                               AS last_seen_at
         FROM training_progress tp
         JOIN users u ON u.id = tp.user_id
         WHERE u.active = TRUE
         GROUP BY u.id, u.full_name, u.username, tp.course_id
         ORDER BY u.full_name, tp.course_id
         LIMIT 1000`,
        []
      );

      // Reshape into { users: [{ user_id, name, username, courses: [...] }] }
      const userMap = new Map();
      for (const row of rows) {
        if (!userMap.has(row.user_id)) {
          userMap.set(row.user_id, {
            user_id: row.user_id,
            name: row.name,
            username: row.username,
            courses: [],
          });
        }
        userMap.get(row.user_id).courses.push({
          course_id:          row.course_id,
          lessons_total:      Number(row.lessons_total),
          lessons_completed:  Number(row.lessons_completed),
          last_seen_at:       row.last_seen_at,
        });
      }

      res.json({ users: Array.from(userMap.values()) });
    } catch (err) {
      console.error('[training] GET /admin/progress-overview error:', err.message);
      res.status(500).json({ error: 'Failed to load progress overview' });
    }
  });

  // ─── GET /api/training/admin/overview ────────────────────────────────────────
  // Training-launch pivot: one row per person (every active non-customer user,
  // including those who haven't started → 0%) with completed/in-progress lesson
  // counts + last activity. Drives the per-person progress bars in the admin
  // Training view. Denominator = curriculum total (available lessons).
  app.get('/api/training/admin/overview', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT u.id AS user_id, u.username, u.full_name, u.role, u.created_at,
                COUNT(tp.*) FILTER (WHERE tp.status = 'completed')   AS completed,
                COUNT(tp.*) FILTER (WHERE tp.status = 'in_progress') AS in_progress,
                MAX(tp.last_seen_at)                                 AS last_seen_at
           FROM users u
           LEFT JOIN training_progress tp ON tp.user_id = u.id
          WHERE u.active = TRUE AND u.role <> 'customer'
          GROUP BY u.id, u.username, u.full_name, u.role, u.created_at
          ORDER BY u.full_name NULLS LAST, u.username
          LIMIT 2000`
      );

      // Per-user visible denominator — uses the SAME resolver as the learner view
      // (loadUserVisibility) so the admin % always matches what the learner sees.
      // Batch-load the two reserved global sets + every user's overrides once.
      const tree = curriculumTree();
      const fullTotal = curriculumTotalLessons();
      const published = await publishedLessonSet();   // Set
      const def = await defaultLessonSet();            // Set (intent ∩ published already applied)
      const ovRows = (await pool.query('SELECT user_id, scope_type, scope_id, mode FROM user_training_overrides')).rows;
      const ovById = new Map();
      for (const o of ovRows) { if (!ovById.has(o.user_id)) ovById.set(o.user_id, []); ovById.get(o.user_id).push(o); }
      const visibleTotalFor = (userId, role) => {
        if (role === 'admin') return fullTotal;
        return resolveVisibleLessons(def, published, ovById.get(userId) || [], tree).size;
      };

      res.json({
        total_lessons: fullTotal,
        users: rows.map(r => ({
          user_id: r.user_id,
          name: r.full_name || r.username,
          username: r.username,
          role: r.role,
          completed: Number(r.completed),
          in_progress: Number(r.in_progress),
          total: visibleTotalFor(r.user_id, r.role),
          last_seen_at: r.last_seen_at,
          created_at: r.created_at,
        })),
      });
    } catch (err) {
      console.error('[training] GET /admin/overview error:', err.message);
      res.status(500).json({ error: 'Failed to load training overview' });
    }
  });

  // ─── GET /api/training/admin/user/:userId/detail ─────────────────────────────
  // Per-user training breakdown. Returns the user identity plus all their
  // lesson progress (grouped by course), cert attempts, and capstone attempts.
  // Gated to: admin, design_manager, permitting_manager.
  app.get('/api/training/admin/user/:userId/detail', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const userId = String(req.params.userId || '');
    if (!/^[0-9a-fA-F-]{36}$/.test(userId)) {
      return res.status(400).json({ error: 'userId must be a valid id' });
    }
    try {
      // ── User identity ────────────────────────────────────────────────────────
      const userRes = await pool.query(
        `SELECT id, full_name AS name, username, role
           FROM users
          WHERE id = $1 AND active = TRUE`,
        [userId]
      );
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = userRes.rows[0];

      // ── Lesson progress (grouped by course) ──────────────────────────────────
      const progRes = await pool.query(
        `SELECT course_id, lesson_id, status, completion_pct,
                best_score, attempts, started_at, completed_at, last_seen_at
           FROM training_progress
          WHERE user_id = $1
          ORDER BY course_id, lesson_id
          LIMIT 2000`,
        [userId]
      );
      const courseMap = new Map();
      for (const row of progRes.rows) {
        if (!courseMap.has(row.course_id)) {
          courseMap.set(row.course_id, { course_id: row.course_id, lessons: [] });
        }
        courseMap.get(row.course_id).lessons.push({
          lesson_id:      row.lesson_id,
          status:         row.status,
          completion_pct: row.completion_pct,
          best_score:     row.best_score,
          attempts:       row.attempts,
          started_at:     row.started_at,
          completed_at:   row.completed_at,
          last_seen_at:   row.last_seen_at,
        });
      }
      const courses = Array.from(courseMap.values());

      // ── Cert attempts (newest first) ─────────────────────────────────────────
      const certRes = await pool.query(
        `SELECT id, cert_track, attempt_date, score, passed,
                time_taken_seconds, domain_scores, total_items, correct_items
           FROM training_cert_attempts
          WHERE user_id = $1
          ORDER BY attempt_date DESC
          LIMIT 200`,
        [userId]
      );

      // ── Capstone attempts (newest first) ─────────────────────────────────────
      const capRes = await pool.query(
        `SELECT id, course_id, attempt_date, score, passed,
                total_items, correct_items
           FROM training_topic_capstone_attempts
          WHERE user_id = $1
          ORDER BY attempt_date DESC
          LIMIT 200`,
        [userId]
      );

      // ── Per-subject progress + "where they left off" ─────────────────────────
      const titleById = {};
      for (const c of curriculumCourses()) titleById[c.id] = c.title;

      // Content visibility for this user — filter subjects + scope the denominator
      // to what they're allowed to see (so % is of their assigned content).
      const vis = await loadUserVisibility(userId, user.role);
      const visAll = vis.all;
      const visibleBySubject = new Map();
      if (!visAll) for (const lid of vis.lessons) {
        const sid = vis.tree.lessonToSubject.get(lid);
        if (sid) visibleBySubject.set(sid, (visibleBySubject.get(sid) || 0) + 1);
      }

      const subjects = curriculumSubjects()
        .filter(c => visAll || visibleBySubject.has(c.id))
        .map(c => {
          const visCount = visAll ? c.lesson_count : (visibleBySubject.get(c.id) || 0);
          const lessons = (courseMap.get(c.id) || { lessons: [] }).lessons;
          const completed = lessons.filter(l => l.status === 'completed').length;
          const inProgress = lessons.filter(l => l.status === 'in_progress').length;
          let lastSeen = null;
          for (const l of lessons) if (l.last_seen_at && (!lastSeen || l.last_seen_at > lastSeen)) lastSeen = l.last_seen_at;
          return {
            course_id: c.id, title: c.title || c.id, total: visCount,
            completed: Math.min(completed, visCount), in_progress: inProgress, last_seen_at: lastSeen,
          };
        });
      // All touched lessons, newest activity first.
      const allLessons = progRes.rows
        .map(r => ({
          course_id: r.course_id, course_title: titleById[r.course_id] || r.course_id,
          lesson_id: r.lesson_id, status: r.status, completion_pct: r.completion_pct,
          best_score: r.best_score, last_seen_at: r.last_seen_at, completed_at: r.completed_at,
        }))
        .sort((a, b) => (b.last_seen_at ? new Date(b.last_seen_at).getTime() : 0) - (a.last_seen_at ? new Date(a.last_seen_at).getTime() : 0));
      // Where they left off: most recent in-progress lesson, else most recent activity.
      const lastPosition = allLessons.find(l => l.status === 'in_progress') || allLessons[0] || null;

      res.json({
        user,
        total_lessons: visAll ? curriculumTotalLessons() : vis.lessons.size,
        completed_total: progRes.rows.filter(r => r.status === 'completed').length,
        in_progress_total: progRes.rows.filter(r => r.status === 'in_progress').length,
        subjects,
        last_position: lastPosition,
        recent_lessons: allLessons.slice(0, 10),
        courses,
        cert_attempts:     certRes.rows,
        capstone_attempts: capRes.rows,
      });
    } catch (err) {
      console.error('[training] GET /admin/user/:userId/detail error:', err.message);
      res.status(500).json({ error: 'Failed to load user training detail' });
    }
  });

  // ─── GET /api/training/admin/cert-attempts ───────────────────────────────────
  // Cert attempt history across all users (admin). Optional ?user_id= filter.
  // Gated to: admin, design_manager, permitting_manager.
  app.get('/api/training/admin/cert-attempts', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const userIdRaw = req.query.user_id;
    let userId = null;
    if (userIdRaw !== undefined && userIdRaw !== '') {
      if (!/^[0-9a-fA-F-]{36}$/.test(String(userIdRaw))) {
        return res.status(400).json({ error: 'user_id must be a valid id when provided' });
      }
      userId = String(userIdRaw);
    }
    try {
      const params = [];
      let whereClause = '';
      if (userId !== null) {
        params.push(userId);
        whereClause = 'WHERE tca.user_id = $1';
      }
      const { rows } = await pool.query(
        `SELECT tca.id, tca.user_id, u.full_name AS user_name, u.username,
                tca.cert_track, tca.attempt_date, tca.score, tca.passed,
                tca.time_taken_seconds, tca.domain_scores,
                tca.total_items, tca.correct_items
           FROM training_cert_attempts tca
           JOIN users u ON u.id = tca.user_id
           ${whereClause}
          ORDER BY tca.attempt_date DESC
          LIMIT 1000`,
        params
      );
      res.json({ attempts: rows });
    } catch (err) {
      console.error('[training] GET /admin/cert-attempts error:', err.message);
      res.status(500).json({ error: 'Failed to load cert attempts' });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT VISIBILITY — ONE server-authoritative model (WP-A rebuild).
  //
  //   visible(non-admin) = ( default ∪ per-user SHOW − per-user HIDE ) ∩ published
  //   visible(admin)     = everything
  //
  // Two RESERVED presets carry the global sets (pinned by id in training_visibility):
  //   __published__ — what is live at all (admin "Publish": lessons AND tracks/subjects)
  //   __default__   — what a fresh signup sees (admin "New-user default"); INTENT is
  //                   stored as scopes and intersected with published at resolve time,
  //                   so newly-published content flows into the default automatically.
  // Per-user grant/revoke = user_training_overrides (mode 'show'|'hide'); HIDE wins.
  //
  // Real-time: any change broadcasts a content-free 'training_visibility_changed' ping
  // (per-user change → user:<id>; publish/default change → the global 'training'
  // channel). Clients refetch /my-content; the set is always resolved server-side.
  // ═══════════════════════════════════════════════════════════════════════════
  const VALID_SCOPE = ['track', 'subject', 'lesson'];
  const UUID_RE = /^[0-9a-fA-F-]{36}$/;
  const RESERVED_PRESET_NAMES = new Set(['__published__', '__default__']);

  // The singleton settings row pins both reserved presets by id (migration 0080
  // seeds it). Cached after first read; the cache only holds ids, never scopes,
  // so the hot read path never re-reads settings after warmup.
  let _visIds = null; // { published_preset_id, default_preset_id }
  async function visibilityIds() {
    if (_visIds) return _visIds;
    const r = (await pool.query(
      'SELECT published_preset_id, default_preset_id FROM training_visibility WHERE id = true'
    )).rows[0];
    _visIds = r || { published_preset_id: null, default_preset_id: null };
    return _visIds;
  }
  async function presetScopeRows(presetId) {
    if (!presetId) return [];
    return (await pool.query(
      'SELECT scope_type, scope_id FROM training_preset_scopes WHERE preset_id = $1', [presetId]
    )).rows;
  }
  // The published lesson Set (the ceiling). Empty until an admin publishes — there is
  // NO auto-seed (the old all-OSP seed was the "new signup sees everything" bug).
  async function publishedLessonSet() {
    const { published_preset_id } = await visibilityIds();
    return scopesToLessonSet(await presetScopeRows(published_preset_id), curriculumTree());
  }
  // The new-user-default lesson Set, already intersected with published (intent ∩ published).
  async function defaultLessonSet() {
    const { default_preset_id } = await visibilityIds();
    const intent = scopesToLessonSet(await presetScopeRows(default_preset_id), curriculumTree());
    const published = await publishedLessonSet();
    const out = new Set();
    for (const l of intent) if (published.has(l)) out.add(l);
    return out;
  }
  // Raw default INTENT scopes (NOT intersected) — for the admin editor so it can show
  // each selected scope with a published / not-yet-published indicator.
  async function defaultIntentScopes() {
    const { default_preset_id } = await visibilityIds();
    return presetScopeRows(default_preset_id);
  }

  // THE resolver. Admin → all. Everyone else → resolveVisibleLessons(default, published,
  // overrides). No 'base', no hard-coded track, no fail-open. A user with no access row
  // resolves exactly the same as the default path (steer #2). Returns {all, lessons, tree}.
  async function loadUserVisibility(userId, role) {
    const tree = curriculumTree();
    if (role === 'admin') return { all: true, lessons: tree.allLessons, tree };
    const published = await publishedLessonSet();
    const def = await defaultLessonSet();
    const overrides = (await pool.query(
      'SELECT scope_type, scope_id, mode FROM user_training_overrides WHERE user_id = $1', [userId]
    )).rows;
    const lessons = resolveVisibleLessons(def, published, overrides, tree);
    return { all: false, lessons, overrides, tree };
  }

  // What the signed-in user may see (the SPA renders strictly this set).
  app.get('/api/training/my-content', requireAuth(), async (req, res) => {
    try {
      const v = await loadUserVisibility(req.user.id, req.user.role);
      if (v.all) return res.json({ all: true });
      const { subjects, tracks } = deriveVisible(v.lessons, v.tree);
      res.json({
        all: false,
        tracks: Array.from(tracks), subjects: Array.from(subjects), lessons: Array.from(v.lessons),
      });
    } catch (err) {
      console.error('[training] GET /my-content error:', err.message);
      // De-fail-open (WP-A): visibility is server-authoritative. On error we return
      // 503 and the SPA keeps its last-good set (or a skeleton) — we NEVER fall back
      // to "show everything", which was the leak/flash. (O26: curation, not security.)
      res.status(503).json({ error: true });
    }
  });

  // Full content tree (tracks → subjects → lessons) for the admin toggles.
  app.get('/api/training/catalog-tree', requireAuth(['admin']), (req, res) => {
    res.json({ tracks: curriculumTree().tracks });
  });

  // ── Shared writer: REPLACE a reserved preset's scope rows.
  //   • published → lesson-scoped (Publish marks individual lessons/topics live; bulk
  //     track/subject toggles are expanded to lessons client-side → exact + granular).
  //   • default   → SUBJECT/track-scoped (Carter's model: pick which SUBJECTS a new
  //     signup gets, e.g. the OSP track — stored as a track scope so newly-published
  //     OSP topics flow in automatically; per-lesson allowed as a finer override).
  // `scopes` = [{scope_type, scope_id}] validated against the tree.
  async function replaceReservedPresetScopes(which, scopes, req) {
    const tree = curriculumTree();
    const clean = [];
    const seen = new Set();
    for (const s of (Array.isArray(scopes) ? scopes : [])) {
      if (!s || !VALID_SCOPE.includes(s.scope_type) || typeof s.scope_id !== 'string') continue;
      // Validate the scope id resolves to ≥1 real lesson (drops typos / dead ids).
      if (expandScopeToLessons(s.scope_type, s.scope_id, tree).length === 0) continue;
      const k = s.scope_type + ':' + s.scope_id;
      if (seen.has(k)) continue; seen.add(k);
      clean.push({ scope_type: s.scope_type, scope_id: s.scope_id });
    }
    const { published_preset_id, default_preset_id } = await visibilityIds();
    const presetId = which === 'published' ? published_preset_id : default_preset_id;
    if (!presetId) throw new Error('reserved preset not initialized (migration 0080)');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM training_preset_scopes WHERE preset_id = $1', [presetId]);
      for (const s of clean) await client.query(
        'INSERT INTO training_preset_scopes (preset_id, scope_type, scope_id) VALUES ($1,$2,$3)',
        [presetId, s.scope_type, s.scope_id]
      );
      await client.query('UPDATE training_visibility SET updated_at = now(), updated_by = $1 WHERE id = true', [req.user.id]);
      await client.query('COMMIT');
    } catch (e) { await client.query('ROLLBACK').catch(() => {}); throw e; }
    finally { client.release(); }
    logAudit(pool, { req, action: 'training.' + which + '.set', entity_type: 'training_preset', entity_id: presetId,
      after: { scopes: clean.length }, source: 'admin' }).catch(() => {});
    return clean;
  }

  // ── Publish — the lessons that are live to trainees at all (per-lesson + bulk track/subject).
  app.get('/api/training/published', requireAuth(['admin']), async (req, res) => {
    try {
      res.json({ tracks: curriculumTree().tracks, published_lessons: Array.from(await publishedLessonSet()) });
    } catch (err) {
      console.error('[training] GET /published error:', err && err.message);
      res.status(500).json({ error: 'Failed to load published set' });
    }
  });
  // PUT { lesson_ids:[...] } → REPLACE the published set (lesson-granular). Track/subject
  // bulk toggles are expanded to lesson ids client-side, so Publish stays exact + global.
  app.put('/api/training/published', requireAuth(['admin']), async (req, res) => {
    if (!Array.isArray(req.body && req.body.lesson_ids)) return res.status(400).json({ error: 'lesson_ids must be an array' });
    try {
      const tree = curriculumTree();
      const scopes = [...new Set(req.body.lesson_ids.filter(id => typeof id === 'string' && tree.allLessons.has(id)))]
        .map(id => ({ scope_type: 'lesson', scope_id: id }));
      await replaceReservedPresetScopes('published', scopes, req);
      // Global change → ping every authed trainee + the admin overview.
      broadcast('training', 'training_visibility_changed', {});
      broadcast('admin', 'training_visibility_changed', {});
      res.json({ ok: true, published_lessons: scopes.map(s => s.scope_id) });
    } catch (err) {
      console.error('[training] PUT /published error:', err && err.message);
      res.status(500).json({ error: 'Failed to save published set' });
    }
  });

  // ── New-user default — which SUBJECTS a fresh signup can access (Carter's model:
  // default = the OSP subject, stored as a track/subject scope; NOT a hard-coded lesson
  // list). GET returns the saved scopes + the resolved lessons + published set so the
  // editor can show per-subject selection and flag "defaulted but not yet published".
  app.get('/api/training/default', requireAuth(['admin']), async (req, res) => {
    try {
      const scopes = await defaultIntentScopes();
      const intent = scopesToLessonSet(scopes, curriculumTree());
      const published = await publishedLessonSet();
      res.json({
        tracks: curriculumTree().tracks,
        default_scopes: scopes,                               // e.g. [{scope_type:'track', scope_id:'osp'}]
        default_lessons: Array.from(intent),                 // expanded intent (may include unpublished)
        published_lessons: Array.from(published),            // so the UI can mark not-yet-published
      });
    } catch (err) {
      console.error('[training] GET /default error:', err && err.message);
      res.status(500).json({ error: 'Failed to load new-user default' });
    }
  });
  // PUT { scopes:[{scope_type,scope_id}] } → REPLACE the new-user-default subjects (stored
  // as-is; the resolver intersects with published). NOT clamped to published (Q1). Accepts
  // lesson scopes too (finer control), but the primary UX is subject/track selection.
  app.put('/api/training/default', requireAuth(['admin']), async (req, res) => {
    const scopes = (req.body && req.body.scopes);
    if (!Array.isArray(scopes)) return res.status(400).json({ error: 'scopes must be an array' });
    try {
      const saved = await replaceReservedPresetScopes('default', scopes, req);
      // Affects every NOT-yet-customized trainee (no overrides) → global ping + admin.
      broadcast('training', 'training_visibility_changed', {});
      broadcast('admin', 'training_visibility_changed', {});
      res.json({ ok: true, default_scopes: saved });
    } catch (err) {
      console.error('[training] PUT /default error:', err && err.message);
      res.status(500).json({ error: 'Failed to save new-user default' });
    }
  });

  // ── Presets (named reusable bundles) — kept for convenience; the resolver no longer
  // depends on them. The two reserved presets are hidden + non-editable here.
  app.get('/api/training/presets', requireAuth(['admin']), async (req, res) => {
    try {
      const presets = (await pool.query(
        "SELECT id, name, description, created_at FROM training_presets WHERE name <> ALL($1) ORDER BY name",
        [Array.from(RESERVED_PRESET_NAMES)]
      )).rows;
      const scopes = (await pool.query('SELECT preset_id, scope_type, scope_id FROM training_preset_scopes')).rows;
      const byId = new Map(presets.map(p => [p.id, { ...p, scopes: [] }]));
      for (const s of scopes) if (byId.has(s.preset_id)) byId.get(s.preset_id).scopes.push({ scope_type: s.scope_type, scope_id: s.scope_id });
      res.json({ presets: Array.from(byId.values()) });
    } catch (err) {
      console.error('[training] GET /presets error:', err.message);
      res.status(500).json({ error: 'Failed to load presets' });
    }
  });

  function validScopes(scopes) {
    if (!Array.isArray(scopes)) return null;
    const out = [];
    for (const s of scopes) {
      if (!s || !VALID_SCOPE.includes(s.scope_type) || typeof s.scope_id !== 'string' || !s.scope_id || s.scope_id.length > 100) return null;
      out.push({ scope_type: s.scope_type, scope_id: s.scope_id });
    }
    return out;
  }
  function reservedName(name) { return RESERVED_PRESET_NAMES.has(String(name || '').trim()); }

  app.post('/api/training/presets', requireAuth(['admin']), async (req, res) => {
    const name = String((req.body && req.body.name) || '').trim();
    if (!name || name.length > 120) return res.status(400).json({ error: 'name required (≤120 chars)' });
    if (reservedName(name)) return res.status(400).json({ error: 'that name is reserved' });
    const scopes = validScopes((req.body && req.body.scopes) || []);
    if (scopes === null) return res.status(400).json({ error: 'invalid scopes' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const p = (await client.query(
        'INSERT INTO training_presets (name, description, created_by) VALUES ($1,$2,$3) RETURNING id',
        [name, (req.body.description || null), req.user.id]
      )).rows[0];
      for (const s of scopes) await client.query(
        'INSERT INTO training_preset_scopes (preset_id, scope_type, scope_id) VALUES ($1,$2,$3)',
        [p.id, s.scope_type, s.scope_id]
      );
      await client.query('COMMIT');
      res.status(201).json({ id: p.id });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[training] POST /presets error:', err.message);
      res.status(500).json({ error: 'Failed to create preset' });
    } finally { client.release(); }
  });

  app.put('/api/training/presets/:id', requireAuth(['admin']), async (req, res) => {
    const id = String(req.params.id || '');
    if (!UUID_RE.test(id)) return res.status(400).json({ error: 'bad id' });
    const name = String((req.body && req.body.name) || '').trim();
    if (!name || name.length > 120) return res.status(400).json({ error: 'name required (≤120 chars)' });
    if (reservedName(name)) return res.status(400).json({ error: 'that name is reserved' });
    const scopes = validScopes((req.body && req.body.scopes) || []);
    if (scopes === null) return res.status(400).json({ error: 'invalid scopes' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Guard: never let a reserved preset be edited through this generic path.
      const cur = (await client.query('SELECT name FROM training_presets WHERE id=$1', [id])).rows[0];
      if (cur && reservedName(cur.name)) { await client.query('ROLLBACK'); return res.status(403).json({ error: 'reserved preset' }); }
      const upd = await client.query(
        'UPDATE training_presets SET name=$1, description=$2 WHERE id=$3 RETURNING id',
        [name, (req.body.description || null), id]
      );
      if (!upd.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'not found' }); }
      await client.query('DELETE FROM training_preset_scopes WHERE preset_id=$1', [id]);
      for (const s of scopes) await client.query(
        'INSERT INTO training_preset_scopes (preset_id, scope_type, scope_id) VALUES ($1,$2,$3)',
        [id, s.scope_type, s.scope_id]
      );
      await client.query('COMMIT');
      res.json({ ok: true });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[training] PUT /presets error:', err.message);
      res.status(500).json({ error: 'Failed to update preset' });
    } finally { client.release(); }
  });

  app.delete('/api/training/presets/:id', requireAuth(['admin']), async (req, res) => {
    const id = String(req.params.id || '');
    if (!UUID_RE.test(id)) return res.status(400).json({ error: 'bad id' });
    try {
      const cur = (await pool.query('SELECT name FROM training_presets WHERE id=$1', [id])).rows[0];
      if (cur && reservedName(cur.name)) return res.status(403).json({ error: 'reserved preset' });
      await pool.query('DELETE FROM training_presets WHERE id=$1', [id]);
      res.json({ ok: true });
    } catch (err) {
      console.error('[training] DELETE /presets error:', err.message);
      res.status(500).json({ error: 'Failed to delete preset' });
    }
  });

  // ── Per-user grant/revoke — add/remove tracks & lessons for ONE person.
  // overrides: [{scope_type:'track'|'subject'|'lesson', scope_id, mode:'show'|'hide'}].
  // SHOW grants on top of the default; HIDE revokes and ALWAYS wins (even if already seen).
  app.get('/api/training/access/:userId', requireAuth(['admin']), async (req, res) => {
    const userId = String(req.params.userId || '');
    if (!UUID_RE.test(userId)) return res.status(400).json({ error: 'bad userId' });
    try {
      const overrides = (await pool.query(
        'SELECT scope_type, scope_id, mode FROM user_training_overrides WHERE user_id=$1', [userId]
      )).rows;
      const v = await loadUserVisibility(userId, 'trainee'); // preview as a non-admin
      res.json({
        overrides,
        visible_lesson_count: v.all ? curriculumTotalLessons() : v.lessons.size,
        total_lesson_count: curriculumTotalLessons(),
      });
    } catch (err) {
      console.error('[training] GET /access error:', err.message);
      res.status(500).json({ error: 'Failed to load access' });
    }
  });

  app.put('/api/training/access/:userId', requireAuth(['admin']), async (req, res) => {
    const userId = String(req.params.userId || '');
    if (!UUID_RE.test(userId)) return res.status(400).json({ error: 'bad userId' });
    const overrides = (req.body && req.body.overrides) || [];
    if (!Array.isArray(overrides)) return res.status(400).json({ error: 'overrides must be an array' });
    for (const o of overrides) {
      if (!o || !VALID_SCOPE.includes(o.scope_type) || !['show', 'hide'].includes(o.mode) || typeof o.scope_id !== 'string' || !o.scope_id) {
        return res.status(400).json({ error: 'invalid override' });
      }
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM user_training_overrides WHERE user_id=$1', [userId]);
      for (const o of overrides) await client.query(
        'INSERT INTO user_training_overrides (user_id, scope_type, scope_id, mode) VALUES ($1,$2,$3,$4)',
        [userId, o.scope_type, o.scope_id, o.mode]
      );
      await client.query('COMMIT');
      logAudit(pool, { req, action: 'training.access.set', entity_type: 'user_training_overrides', entity_id: userId,
        after: { overrides: overrides.length }, source: 'admin' }).catch(() => {});
      // Live update for THAT user's open SPA (no refresh) + the admin overview.
      broadcast('user:' + userId, 'training_visibility_changed', {});
      broadcast('admin', 'training_visibility_changed', {});
      res.json({ ok: true });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[training] PUT /access error:', err.message);
      res.status(500).json({ error: 'Failed to save access' });
    } finally { client.release(); }
  });
};
