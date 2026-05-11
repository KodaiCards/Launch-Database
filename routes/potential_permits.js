// routes/potential_permits.js — design-team-submitted permit candidates
// pending Permitting review. Each row is "we found a place that probably
// needs a permit; Permitting team should look at it." When approved, it
// becomes a real permitting project (project_id is set on the row).
//
// Wave 1.5 fixes:
//   [UNGATED]     — All four endpoints were missing requireAuth.
//   [BODY-ACTOR]  — submitted_by / reviewed_by were taken from the request
//                   body and stored verbatim, allowing anyone to spoof
//                   attribution. Now sourced from req.user (full_name or
//                   username) so attribution is tied to the authenticated session.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installPotentialPermitsRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  app.get('/api/potential-permits', requireAuth(), async (req, res) => {
    const { status } = req.query;
    try {
      const q = status
        ? 'SELECT * FROM potential_permits WHERE status=$1 ORDER BY created_at DESC'
        : 'SELECT * FROM potential_permits ORDER BY created_at DESC';
      const { rows } = await pool.query(q, status ? [status] : []);
      res.json(rows);
    } catch (e) {
      console.error('[potential_permits:GET]', e && e.message);
      res.status(500).json({ error: 'Failed to load potential permits.' });
    }
  });

  // Wave 1.5 [BODY-ACTOR]: submitted_by now derived from req.user, never from body.
  app.post('/api/potential-permits', requireAuth(['admin', 'design_manager', 'design_engineer', 'permitting_manager', 'permitting_engineer']), async (req, res) => {
    const { sr_hwy, county, route, notes } = req.body;
    // submitted_by is always the authenticated user, not body-supplied.
    const submittedBy = req.user.full_name || req.user.username;
    try {
      const { rows } = await pool.query(
        `INSERT INTO potential_permits (sr_hwy, county, route, notes, submitted_by)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [sr_hwy || null, county || null, route || null, notes || null, submittedBy]
      );
      res.json(rows[0]);
    } catch (e) {
      console.error('[potential_permits:POST]', e && e.message);
      res.status(500).json({ error: 'Failed to create potential permit.' });
    }
  });

  // Wave 1.5 [BODY-ACTOR]: reviewed_by now derived from req.user, never from body.
  app.put('/api/potential-permits/:id', requireAuth(['admin', 'permitting_manager']), async (req, res) => {
    const { status, project_id, notes } = req.body;
    // reviewed_by is always the authenticated user, not body-supplied.
    const reviewedBy = req.user.full_name || req.user.username;
    try {
      const { rows } = await pool.query(
        `UPDATE potential_permits SET status=$1, reviewed_by=$2, project_id=$3, notes=COALESCE($4,notes), updated_at=NOW()
         WHERE id=$5 RETURNING *`,
        [status || 'pending', reviewedBy, project_id || null, notes, req.params.id]
      );
      res.json(rows[0]);
    } catch (e) {
      console.error('[potential_permits:PUT]', e && e.message);
      res.status(500).json({ error: 'Failed to update potential permit.' });
    }
  });

  app.delete('/api/potential-permits/:id', requireAuth(['admin', 'permitting_manager']), async (req, res) => {
    try {
      await pool.query('DELETE FROM potential_permits WHERE id=$1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      console.error('[potential_permits:DELETE]', e && e.message);
      res.status(500).json({ error: 'Failed to delete potential permit.' });
    }
  });
};
