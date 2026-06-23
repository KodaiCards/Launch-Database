// routes/my_work.js — Contractor-facing "my jobs" endpoint.
// Mount point: registerMyWork(app, pool, mw)
// CEO wires this into server.js at merge.

module.exports = function registerMyWork(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || (() => (_req, _res, next) => next());

  // Returns the service-area jobs assigned to the current user.
  // Matches on assigned_user_id (direct user link) OR assigned_staff_id
  // (linked through the user's staff record).
  app.get('/api/my/jobs', requireAuth(), async (req, res) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });

      // Resolve the caller's staff_id (may be null for non-staff accounts)
      const staffRow = await pool.query(
        'SELECT staff_id FROM users WHERE id = $1',
        [userId]
      );
      const staffId = staffRow.rows[0]?.staff_id || null;

      const { rows } = await pool.query(
        `SELECT
           saj.id,
           saj.team,
           saj.status,
           saj.billing_type,
           saj.actual_hours,
           saj.notes,
           j.name   AS job_name,
           sa.name  AS service_area_name,
           c.name   AS client_name
         FROM service_area_jobs saj
         JOIN service_areas sa ON sa.id = saj.service_area_id
         LEFT JOIN clients   c  ON c.id  = sa.client_id
         LEFT JOIN jobs      j  ON j.id  = saj.job_id
         WHERE saj.assigned_user_id = $1
            OR ($2::uuid IS NOT NULL AND saj.assigned_staff_id = $2)
         ORDER BY c.name, sa.name, saj.team, j.name`,
        [userId, staffId]
      );

      res.json(rows);
    } catch (e) {
      console.error('[my-work:jobs]', e && e.message);
      res.status(500).json({ error: 'Failed to load your jobs.' });
    }
  });

  // Caller-scoped weekly hours recap. Defaults to the current week
  // (Mon–Sun). Returns the caller's total hours + a per-job breakdown so the
  // field timeclock can show a "this week" strip. Hours-only, no dollars.
  app.get('/api/my/hours', requireAuth(), async (req, res) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });

      const staffRow = await pool.query('SELECT staff_id FROM users WHERE id = $1', [userId]);
      const staffId = staffRow.rows[0]?.staff_id || null;

      // Week window: Monday 00:00 → next Monday (exclusive). 'current' is the
      // only supported value today; anything else also resolves to current.
      const now = new Date();
      const dow = (now.getDay() + 6) % 7; // 0 = Monday
      const monday = new Date(now); monday.setDate(now.getDate() - dow); monday.setHours(0, 0, 0, 0);
      const nextMonday = new Date(monday); nextMonday.setDate(monday.getDate() + 7);
      const iso = d => d.toISOString().slice(0, 10);

      // Match the caller's own entries either by their account (user_id) or
      // their linked staff record (covers entries created via auto-attribution).
      const { rows } = await pool.query(
        `SELECT
           saj.id            AS job_id,
           j.name            AS job_name,
           saj.team          AS team,
           sa.name           AS service_area_name,
           c.name            AS client_name,
           SUM(te.hours)::float AS hours
         FROM time_entries te
         JOIN service_area_jobs saj ON saj.id = te.service_area_job_id
         JOIN service_areas     sa  ON sa.id  = saj.service_area_id
         LEFT JOIN clients      c   ON c.id   = sa.client_id
         LEFT JOIN jobs         j   ON j.id   = saj.job_id
         WHERE te.entry_date >= $1 AND te.entry_date < $2
           AND (te.user_id = $3 OR ($4::uuid IS NOT NULL AND te.staff_id = $4))
         GROUP BY saj.id, j.name, saj.team, sa.name, c.name
         ORDER BY hours DESC, j.name`,
        [iso(monday), iso(nextMonday), userId, staffId]
      );

      const total = rows.reduce((s, r) => s + (r.hours || 0), 0);
      res.json({ week_start: iso(monday), week_end: iso(nextMonday), total_hours: total, jobs: rows });
    } catch (e) {
      console.error('[my-work:hours]', e && e.message);
      res.status(500).json({ error: 'Failed to load your hours.' });
    }
  });
};
