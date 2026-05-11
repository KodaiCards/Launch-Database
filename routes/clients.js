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

const { broadcast } = require('./_sse');

module.exports = function installClientsRoutes(app, pool, mw) {
  const { requireAdmin } = mw;
  // Wave 1.5 [UNGATED]: GET /api/clients was missing auth. All roles need
  // client list access (portal create forms), so requireAuth() (any role).
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  app.get('/api/clients', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM clients ORDER BY name');
      res.json(rows);
    } catch (e) {
      console.error('[clients:GET /api/clients]', e && e.message);
      res.status(500).json({ error: 'Failed to load clients.' });
    }
  });

  // Path B (2026-05-04): the is_rus field is no longer accepted by these
  // endpoints. Program classification lives on engineering_contracts.program.
  // The clients.is_rus column itself was retired in migration 0003;
  // any incoming `is_rus` in the request body is silently ignored
  // (req.body destructure simply doesn't read it).
  // Item 2 fix: requireAdmin added — creating clients is an admin-only operation
  app.post('/api/clients', requireAdmin, async (req, res) => {
    const { name, notes } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO clients (name, notes) VALUES ($1,$2) RETURNING *',
        [name, notes]
      );
      broadcast('admin', 'client_added', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      console.error('[clients:POST]', e && e.message);
      res.status(500).json({ error: 'Failed to create client.' });
    }
  });

  // Item 2 fix: requireAdmin added — updating clients is an admin-only operation
  app.put('/api/clients/:id', requireAdmin, async (req, res) => {
    const { name, notes, show_contract, show_work_order } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE clients SET
           name             = COALESCE($2, name),
           notes            = $3,
           show_contract    = COALESCE($4, show_contract),
           show_work_order  = COALESCE($5, show_work_order)
         WHERE id = $1 RETURNING *`,
        [req.params.id, name, notes ?? null,
         show_contract === undefined ? null : show_contract,
         show_work_order === undefined ? null : show_work_order]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
      broadcast('admin', 'client_updated', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      console.error('[clients:PUT]', e && e.message);
      res.status(500).json({ error: 'Failed to update client.' });
    }
  });

  // Delete a client. Cascades to contracts, projects, time entries, invoices.
  // Returns counts of what would be deleted as a confirmation aid (preview=true).
  app.delete('/api/clients/:id', requireAdmin, async (req, res) => {
    try {
      if (req.query.preview === 'true') {
        // Project count excludes is_rollup folders — they're organizational
        // containers, not real projects. Showing rollups in the cascade
        // preview overstates "this will delete N projects" and confuses
        // the typed-name-to-confirm step.
        const counts = await pool.query(`
          SELECT
            (SELECT COUNT(*) FROM contracts WHERE client_id=$1)::int AS contracts,
            (SELECT COUNT(*) FROM projects
              WHERE client_id=$1
                AND COALESCE(is_rollup, FALSE) = FALSE)::int AS projects,
            (SELECT COUNT(*) FROM invoices WHERE client_id=$1)::int AS invoices
        `, [req.params.id]);
        return res.json(counts.rows[0]);
      }
      const r = await pool.query('DELETE FROM clients WHERE id=$1 RETURNING name', [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: 'Client not found' });
      broadcast('admin', 'client_deleted', { id: req.params.id, name: r.rows[0].name });
      res.json({ ok: true, deleted_name: r.rows[0].name });
    } catch (e) {
      console.error('[clients:DELETE]', e && e.message);
      res.status(500).json({ error: 'Failed to delete client.' });
    }
  });
};
