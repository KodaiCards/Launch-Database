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
            OR ($2::int IS NOT NULL AND saj.assigned_staff_id = $2)
         ORDER BY c.name, sa.name, saj.team, j.name`,
        [userId, staffId]
      );

      res.json(rows);
    } catch (e) {
      console.error('[my-work:jobs]', e && e.message);
      res.status(500).json({ error: 'Failed to load your jobs.' });
    }
  });
};
