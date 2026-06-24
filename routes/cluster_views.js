/* routes/cluster_views.js — read-only cluster endpoints for the keystone UI */
/* CEO mount: require('./routes/cluster_views')(app, pool, { requireManagerOrAdmin }) */

module.exports = function installClusterViews(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // ── Invoice list ─────────────────────────────────────────────────────────────
  // GET /api/cluster/invoices?status=&client_id=&year=
  // Lightweight list — no items aggregation (use /api/money/invoice/:id for drill-in).
  app.get('/api/cluster/invoices', requireManagerOrAdmin, async (req, res) => {
    const { status, client_id, year } = req.query;
    const conditions = [];
    const params = [];
    if (status)    { params.push(status);    conditions.push(`i.status = $${params.length}`); }
    if (client_id) { params.push(client_id); conditions.push(`i.client_id = $${params.length}`); }
    if (year)      { params.push(year);      conditions.push(`EXTRACT(YEAR FROM i.invoice_date) = $${params.length}`); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    try {
      const { rows } = await pool.query(
        `SELECT i.id, i.invoice_number, i.invoice_date::text AS invoice_date,
                i.status, COALESCE(i.total_amount, 0)::float AS total_amount,
                c.name AS client_name,
                GREATEST((CURRENT_DATE - i.invoice_date), 0) AS age_days
         FROM invoices i
         LEFT JOIN clients c ON c.id = i.client_id
         ${where}
         ORDER BY i.invoice_date DESC NULLS LAST, i.invoice_number`,
        params
      );
      res.json({ invoices: rows });
    } catch (e) {
      console.error('GET /api/cluster/invoices', e);
      res.status(500).json({ error: 'Failed to load invoices.' });
    }
  });

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
