// routes/staff.js — staff (employees) list + create.
//
// The staff table is intentionally lean: id, name, active, created_at.
// Hourly rate lives on the project/job, not the staff member, since one
// employee can bill out at different rates depending on the work category.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installStaffRoutes(app, pool, mw) {
  app.get('/api/staff', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM staff WHERE active=true ORDER BY name');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/staff', async (req, res) => {
    const { name } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *', [name]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
