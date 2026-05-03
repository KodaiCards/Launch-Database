// routes/project_types.js — program categories CRUD (BAU / GF(R) / RUS /
// Other / custom). Soft-delete via active=false to preserve historical
// references on existing projects.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installProjectTypesRoutes(app, pool, mw) {
  app.get('/api/project-types', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM project_types WHERE active = true ORDER BY name');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/project-types', async (req, res) => {
    const { name } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
    try {
      const { rows } = await pool.query(
        `INSERT INTO project_types (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET active = true RETURNING *`,
        [String(name).trim()]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/project-types/:id', async (req, res) => {
    try {
      await pool.query('UPDATE project_types SET active = false WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
