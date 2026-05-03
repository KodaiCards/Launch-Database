// routes/potential_permits.js — design-team-submitted permit candidates
// pending Permitting review. Each row is "we found a place that probably
// needs a permit; Permitting team should look at it." When approved, it
// becomes a real permitting project (project_id is set on the row).
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installPotentialPermitsRoutes(app, pool, mw) {
  app.get('/api/potential-permits', async (req, res) => {
    const { status } = req.query;
    try {
      const q = status
        ? 'SELECT * FROM potential_permits WHERE status=$1 ORDER BY created_at DESC'
        : 'SELECT * FROM potential_permits ORDER BY created_at DESC';
      const { rows } = await pool.query(q, status ? [status] : []);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/potential-permits', async (req, res) => {
    const { sr_hwy, county, route, notes, submitted_by } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO potential_permits (sr_hwy, county, route, notes, submitted_by)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [sr_hwy || null, county || null, route || null, notes || null, submitted_by || null]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/potential-permits/:id', async (req, res) => {
    const { status, reviewed_by, project_id, notes } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE potential_permits SET status=$1, reviewed_by=$2, project_id=$3, notes=COALESCE($4,notes), updated_at=NOW()
         WHERE id=$5 RETURNING *`,
        [status || 'pending', reviewed_by || null, project_id || null, notes, req.params.id]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/potential-permits/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM potential_permits WHERE id=$1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
