// routes/clients.js — CRUD for clients.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3. Behavior
// unchanged: same routes, same body shapes, same status codes. The
// installer takes the express app, the pg pool, and a middleware bag
// (requireAdmin etc.) so server.js becomes a wiring file rather than the
// implementation.
//
// Wiring (in server.js):
//   require('./routes/clients')(app, pool, { requireAdmin });

module.exports = function installClientsRoutes(app, pool, mw) {
  const { requireAdmin } = mw;

  app.get('/api/clients', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM clients ORDER BY name');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/clients', async (req, res) => {
    const { name, is_rus, notes } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
        [name, is_rus || false, notes]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/clients/:id', async (req, res) => {
    const { name, is_rus, notes, show_contract, show_work_order } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE clients SET
           name             = COALESCE($2, name),
           is_rus           = COALESCE($3, is_rus),
           notes            = $4,
           show_contract    = COALESCE($5, show_contract),
           show_work_order  = COALESCE($6, show_work_order)
         WHERE id = $1 RETURNING *`,
        [req.params.id, name, is_rus, notes ?? null,
         show_contract === undefined ? null : show_contract,
         show_work_order === undefined ? null : show_work_order]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Delete a client. Cascades to contracts, projects, time entries, invoices.
  // Returns counts of what would be deleted as a confirmation aid (preview=true).
  app.delete('/api/clients/:id', requireAdmin, async (req, res) => {
    try {
      if (req.query.preview === 'true') {
        const counts = await pool.query(`
          SELECT
            (SELECT COUNT(*) FROM contracts WHERE client_id=$1)::int AS contracts,
            (SELECT COUNT(*) FROM projects WHERE client_id=$1)::int AS projects,
            (SELECT COUNT(*) FROM invoices WHERE client_id=$1)::int AS invoices
        `, [req.params.id]);
        return res.json(counts.rows[0]);
      }
      const r = await pool.query('DELETE FROM clients WHERE id=$1 RETURNING name', [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: 'Client not found' });
      res.json({ ok: true, deleted_name: r.rows[0].name });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
