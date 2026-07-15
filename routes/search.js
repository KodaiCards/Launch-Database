/* routes/search.js — cross-entity search for the keystone cluster */
/* CEO mount: require('./routes/search')(app, pool, { requireManagerOrAdmin }) */

module.exports = function installSearch(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');

  // GET /api/search?q=<term>
  // Returns up to 10 matches per entity: service areas, clients, invoices.
  app.get('/api/search', viewProjects, async (req, res) => {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.json({ results: [] });

    const term = `%${q}%`;
    try {
      const [areas, clients, invoices] = await Promise.all([
        pool.query(
          `SELECT 'area' AS type, sa.id::text, sa.name AS label,
                  c.name AS sub, sa.work_order_number AS meta
           FROM service_areas sa
           LEFT JOIN clients c ON c.id = sa.client_id
           WHERE sa.name ILIKE $1 OR sa.work_order_number ILIKE $1
           ORDER BY sa.name LIMIT 10`,
          [term]
        ),
        pool.query(
          `SELECT 'client' AS type, id::text, name AS label, NULL AS sub, NULL AS meta
           FROM clients WHERE name ILIKE $1 ORDER BY name LIMIT 10`,
          [term]
        ),
        pool.query(
          `SELECT 'invoice' AS type, i.id::text, i.invoice_number AS label,
                  c.name AS sub, i.status AS meta
           FROM invoices i
           LEFT JOIN clients c ON c.id = i.client_id
           WHERE i.invoice_number ILIKE $1
           ORDER BY i.invoice_date DESC LIMIT 10`,
          [term]
        ),
      ]);

      const results = [
        ...areas.rows,
        ...clients.rows,
        ...invoices.rows,
      ];
      res.json({ results });
    } catch (e) {
      console.error('GET /api/search', e);
      res.status(500).json({ error: 'Search failed.' });
    }
  });
};
