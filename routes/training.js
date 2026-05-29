// routes/training.js — OSP training progress API (OSP-RW.2)
//
// Endpoints:
//   GET  /api/training/progress                  — current user's full progress map
//   POST /api/training/progress                  — record lesson progress + quiz score
//   POST /api/training/cert-attempt              — record cert mock exam attempt
//   GET  /api/training/cert-attempts             — current user's cert attempt history
//   POST /api/training/capstone-attempt          — record per-topic capstone attempt
//   GET  /api/training/admin/progress-overview   — manager/admin view of all users
//
// Security: every route behind requireAuth(). Admin endpoint further gated
// to admin / design_manager / permitting_manager roles.
//
// DB error messages are NOT forwarded to clients (Wave 1.6 lesson).
// All queries use parameterized placeholders — no string concat.

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
      res.status(isInsert ? 201 : 200).json({ progress });
    } catch (err) {
      console.error('[training] POST /progress error:', err.message);
      res.status(500).json({ error: 'Failed to save training progress' });
    }
  });

  // ─── POST /api/training/cert-attempt ────────────────────────────────────────
  // Records a completed cert mock exam attempt.
  // Body: { cert_track, score, passed, time_taken_seconds?, domain_scores?, total_items, correct_items }
  app.post('/api/training/cert-attempt', requireAuth(), async (req, res) => {
    const { cert_track, score, passed, time_taken_seconds, domain_scores,
            total_items, correct_items } = req.body || {};

    const validTracks = ['osp-general', 'OSP-Designer', 'RCDD', 'CFOT', 'CFOS-O'];
    if (!cert_track || !validTracks.includes(cert_track)) {
      return res.status(400).json({ error: `cert_track must be one of: ${validTracks.join(', ')}` });
    }
    const scoreN = Number(score);
    if (!Number.isFinite(scoreN) || scoreN < 0 || scoreN > 100) {
      return res.status(400).json({ error: 'score must be 0–100' });
    }
    if (typeof passed !== 'boolean') {
      return res.status(400).json({ error: 'passed must be a boolean' });
    }
    const totalN = Number(total_items);
    const correctN = Number(correct_items);
    if (!Number.isInteger(totalN) || totalN < 1) {
      return res.status(400).json({ error: 'total_items must be a positive integer' });
    }
    if (!Number.isInteger(correctN) || correctN < 0 || correctN > totalN) {
      return res.status(400).json({ error: 'correct_items must be 0–total_items' });
    }

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
        [req.user.id, cert_track, Math.round(scoreN), passed,
          timeTaken !== null ? Math.round(timeTaken) : null,
          domain_scores ? JSON.stringify(domain_scores) : null,
          totalN, correctN]
      );
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
  app.post('/api/training/capstone-attempt', requireAuth(), async (req, res) => {
    const { course_id, score, passed, total_items, correct_items } = req.body || {};

    if (!course_id || typeof course_id !== 'string' || course_id.length > 50) {
      return res.status(400).json({ error: 'course_id is required (string, max 50 chars)' });
    }
    const scoreN = Number(score);
    if (!Number.isFinite(scoreN) || scoreN < 0 || scoreN > 100) {
      return res.status(400).json({ error: 'score must be 0–100' });
    }
    if (typeof passed !== 'boolean') {
      return res.status(400).json({ error: 'passed must be a boolean' });
    }
    const totalN = Number(total_items);
    const correctN = Number(correct_items);
    if (!Number.isInteger(totalN) || totalN < 1) {
      return res.status(400).json({ error: 'total_items must be a positive integer' });
    }
    if (!Number.isInteger(correctN) || correctN < 0 || correctN > totalN) {
      return res.status(400).json({ error: 'correct_items must be 0–total_items' });
    }

    try {
      const { rows } = await pool.query(
        `INSERT INTO training_topic_capstone_attempts
           (user_id, course_id, score, passed, total_items, correct_items)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [req.user.id, course_id, Math.round(scoreN), passed, totalN, correctN]
      );
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
};
