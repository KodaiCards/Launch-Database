/* routes/cluster_views.js — read-only cluster endpoints for the keystone UI */
/* CEO mount: require('./routes/cluster_views')(app, pool, { requireManagerOrAdmin }) */

module.exports = function installClusterViews(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // ── Client list ──────────────────────────────────────────────────────────────
  // GET /api/cluster/clients
  // Returns all clients with aggregated counts + financials.
  app.get('/api/cluster/clients', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          c.id,
          c.name,
          c.notes,
          COUNT(DISTINCT sa.id)                                       AS active_area_count,
          COALESCE(SUM(
            CASE WHEN i.status NOT IN ('draft','void') THEN COALESCE(i.total_amount,0) END
          ), 0)::float                                                AS total_billed,
          COALESCE(SUM(
            CASE WHEN i.status NOT IN ('draft','void','paid')
                 THEN COALESCE(i.total_amount,0) END
          ), 0)::float                                                AS outstanding
        FROM clients c
        LEFT JOIN service_areas sa ON sa.client_id = c.id
        LEFT JOIN invoices      i  ON i.client_id  = c.id
        GROUP BY c.id, c.name, c.notes
        ORDER BY c.name
      `);
      res.json({ clients: rows });
    } catch (e) {
      console.error('GET /api/cluster/clients', e);
      res.status(500).json({ error: 'Failed to load clients.' });
    }
  });
};
