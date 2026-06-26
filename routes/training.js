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
const fs = require('fs');
const path = require('path');

// Total completable lessons across all *available* courses. The course catalog
// (osp-training/src/data/course-catalog.js) is the declared source of truth for
// lesson counts, so we derive the denominator for admin progress bars from it
// (sum of lesson_count where available:true). Memoized; falls back to null if
// the file can't be parsed (the UI then shows raw completed counts).
let _curriculumTotal;
function curriculumTotalLessons() {
  if (_curriculumTotal !== undefined) return _curriculumTotal;
  try {
    const txt = fs.readFileSync(
      path.join(__dirname, '..', 'osp-training', 'src', 'data', 'course-catalog.js'), 'utf8');
    let total = 0, available = null;
    for (const line of txt.split('\n')) {
      if (/^\s*id:\s*['"]/.test(line)) available = null;        // new course object
      const a = line.match(/available:\s*(true|false)/);
      if (a) available = (a[1] === 'true');
      const lc = line.match(/lesson_count:\s*(\d+)/);
      if (lc && available) total += parseInt(lc[1], 10);
    }
    _curriculumTotal = total > 0 ? total : null;
  } catch (e) {
    console.error('[training] curriculum total parse failed:', e && e.message);
    _curriculumTotal = null;
  }
  return _curriculumTotal;
}

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
        [req.user.id, course_id, lesson_id, status, Math.round(pct),
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
      res.status(isInsert ? 201 : 200).json({ progress });
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
      res.json({
        total_lessons: curriculumTotalLessons(),
        users: rows.map(r => ({
          user_id: r.user_id,
          name: r.full_name || r.username,
          username: r.username,
          role: r.role,
          completed: Number(r.completed),
          in_progress: Number(r.in_progress),
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
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: 'userId must be a positive integer' });
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

      res.json({
        user,
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
      const n = Number(userIdRaw);
      if (!Number.isInteger(n) || n < 1) {
        return res.status(400).json({ error: 'user_id must be a positive integer when provided' });
      }
      userId = n;
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
};
