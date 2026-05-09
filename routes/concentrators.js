// routes/concentrators.js — service-area / concentrator list + create.
//
// A concentrator is a small geographic area (a few work orders) under a
// PSC RUS contract. Used by the rollup chain so admin can see budget
// burn per-area without having to manually nest projects.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installConcentratorsRoutes(app, pool, mw) {
  // Item 2 fix: requireAdmin added to POST (creating service areas is admin-only)
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  app.get('/api/concentrators', async (req, res) => {
    const { contract_label } = req.query;
    try {
      const q = contract_label
        ? 'SELECT * FROM concentrators WHERE contract_label=$1 AND active=true ORDER BY area_name'
        : 'SELECT * FROM concentrators WHERE active=true ORDER BY contract_label, area_name';
      const { rows } = await pool.query(q, contract_label ? [contract_label] : []);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Item 2 fix: requireAdmin added
  app.post('/api/concentrators', requireAdmin, async (req, res) => {
    const { contract_label, area_name, work_order_number, notes } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO concentrators (contract_label, area_name, work_order_number, notes)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [contract_label, area_name, work_order_number || null, notes || null]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
