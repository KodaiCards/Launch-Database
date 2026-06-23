// routes/money_view.js — Phase 4 money view (manager/admin, read-only).
// Mount: require('./routes/money_view')(app, pool, { requireManagerOrAdmin })
//
//   GET /api/money/margin       → per-service-area estimate vs billed + variance
//   GET /api/money/aging        → AR aging buckets over non-draft invoices
//   GET /api/money/invoices.csv → accounting export of invoices
//
// Additive + read-only. Does NOT touch billing.js / invoices.js core or the
// keystone. No mutations.
//
// NOTE (billed attribution): the `invoices` table links to a CLIENT, not to a
// service area (invoice_items reference legacy `projects`), so there is no
// direct invoice→service_area join. The per-area "billed" figure here is
// therefore derived from the keystone itself — Σ service_area_jobs.actual_amount
// for jobs that have been billed (status='billed' or a billed_date set). This is
// the only per-area billing signal in the new model. Flagged for CEO review.

// Escape one CSV field (RFC 4180) + neutralize spreadsheet formula injection.
// Mirrors routes/hours_summary.js csvCell — kept local so the modules stay
// independent (CEO can extract a shared helper later if desired).
function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

module.exports = function installMoneyViewRoutes(app, pool, mw) {
  const requireManagerOrAdmin =
    (mw && mw.requireManagerOrAdmin) || ((_req, _res, next) => next());

  // ── Estimate-vs-actual margin, per service area ───────────────────────────
  app.get('/api/money/margin', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT
           sa.id                          AS service_area_id,
           sa.name                        AS service_area_name,
           c.name                         AS client_name,
           COALESCE(SUM(saj.estimated_amount), 0)::float AS estimated_total,
           COALESCE(SUM(saj.actual_amount), 0)::float    AS actual_total,
           COALESCE(SUM(CASE
             WHEN saj.status = 'billed' OR saj.billed_date IS NOT NULL
             THEN saj.actual_amount ELSE 0 END), 0)::float AS billed_total,
           COUNT(saj.id)::int             AS job_count
         FROM service_areas sa
         LEFT JOIN clients c            ON c.id = sa.client_id
         LEFT JOIN service_area_jobs saj ON saj.service_area_id = sa.id
         GROUP BY sa.id, sa.name, c.name
         ORDER BY c.name, sa.name`
      );
      // variance = billed − estimated (positive = billed over estimate).
      for (const r of rows) r.variance = +(r.billed_total - r.estimated_total).toFixed(2);
      const totals = rows.reduce((t, r) => ({
        estimated_total: t.estimated_total + r.estimated_total,
        actual_total: t.actual_total + r.actual_total,
        billed_total: t.billed_total + r.billed_total,
      }), { estimated_total: 0, actual_total: 0, billed_total: 0 });
      totals.variance = +(totals.billed_total - totals.estimated_total).toFixed(2);
      res.json({ rows, totals });
    } catch (e) {
      console.error('[money:margin]', e && e.message);
      res.status(500).json({ error: 'Failed to load margin view.' });
    }
  });

  // ── AR aging — non-draft, non-void invoices bucketed by invoice_date age ───
  // Void invoices are excluded: they are not receivable. Days = today − invoice_date.
  app.get('/api/money/aging', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT
           i.id, i.invoice_number, i.invoice_date::text AS invoice_date,
           i.status, COALESCE(i.total_amount, 0)::float AS total_amount,
           c.name AS client_name,
           GREATEST((CURRENT_DATE - i.invoice_date), 0) AS age_days
         FROM invoices i
         LEFT JOIN clients c ON c.id = i.client_id
         WHERE i.status NOT IN ('draft', 'void')
         ORDER BY i.invoice_date ASC NULLS LAST`
      );

      const buckets = {
        '0-30':  { label: '0–30 days',  count: 0, total: 0, invoices: [] },
        '31-60': { label: '31–60 days', count: 0, total: 0, invoices: [] },
        '61-90': { label: '61–90 days', count: 0, total: 0, invoices: [] },
        '90+':   { label: '90+ days',   count: 0, total: 0, invoices: [] },
      };
      for (const r of rows) {
        const d = r.age_days == null ? 0 : Number(r.age_days);
        const key = d <= 30 ? '0-30' : d <= 60 ? '31-60' : d <= 90 ? '61-90' : '90+';
        const b = buckets[key];
        b.count++; b.total += r.total_amount;
        b.invoices.push(r);
      }
      const grandTotal = rows.reduce((s, r) => s + r.total_amount, 0);
      res.json({ buckets, grand_total: grandTotal, invoice_count: rows.length });
    } catch (e) {
      console.error('[money:aging]', e && e.message);
      res.status(500).json({ error: 'Failed to load AR aging.' });
    }
  });

  // ── Accounting export — all invoices as CSV ───────────────────────────────
  app.get('/api/money/invoices.csv', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT i.invoice_number, i.invoice_date::text AS invoice_date,
                c.name AS client_name, i.status,
                COALESCE(i.total_amount, 0)::float AS total_amount
         FROM invoices i
         LEFT JOIN clients c ON c.id = i.client_id
         ORDER BY i.invoice_date DESC NULLS LAST, i.invoice_number`
      );
      const header = ['Invoice #', 'Date', 'Client', 'Status', 'Total'];
      const lines = [header.map(csvCell).join(',')];
      for (const r of rows) {
        lines.push([
          r.invoice_number || '', r.invoice_date || '',
          r.client_name || '', r.status || '',
          (r.total_amount || 0).toFixed(2),
        ].map(csvCell).join(','));
      }
      const stamp = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="invoices-${stamp}.csv"`);
      res.send(lines.join('\r\n') + '\r\n');
    } catch (e) {
      console.error('[money:invoices-csv]', e && e.message);
      res.status(500).json({ error: 'Failed to export invoices CSV.' });
    }
  });
};

module.exports._helpers = { csvCell };
