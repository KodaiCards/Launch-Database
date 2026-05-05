// routes/reports.js — hours + billing queue reports.
//
// /api/reports/hours    — month/year filtered staff×project×date breakdown
// /api/reports/billing  — billing queue (one-time + monthly cadence union)
//
// Both are read-only and unauthenticated beyond the global authMiddleware.
// /api/reports/billing has a similar shape to /api/revenue/unbilled but
// with different filtering — kept as separate endpoints because the UI
// flows are distinct (Reports tab vs Revenue tab).
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installReportsRoutes(app, pool, mw) {
  app.get('/api/reports/hours', async (req, res) => {
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();
    try {
      const { rows } = await pool.query(`
        SELECT
          s.name as staff_name,
          p.name as project_name,
          p.work_order_number,
          p.project_type,
          cl.name as client_name,
          te.entry_date,
          te.hours,
          te.job_title
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        LEFT JOIN staff s ON s.id = te.staff_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE EXTRACT(MONTH FROM te.entry_date)=$1
          AND EXTRACT(YEAR FROM te.entry_date)=$2
        ORDER BY s.name, te.entry_date
      `, [m, y]);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/reports/billing', async (req, res) => {
    const { month, year } = req.query;
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();
    try {
      // ── PART 1: One-time projects ──
      // Same shape as before — one row per project. Excludes containers.
      // Includes monthly_year, monthly_month columns set to NULL so the union works.
      const oneTimeR = await pool.query(`
        SELECT p.id, p.id as queue_key, p.name, p.project_type, p.billing_type, p.billing_rate,
               p.footage, p.miles, p.expected_revenue, p.expected_hours, p.actual_hours,
               p.status, p.work_order_number, p.bill_hold_until, p.billing_cadence,
               cl.name as client_name, co.contract_number,
               NULL::int as period_year, NULL::int as period_month,
               COALESCE(SUM(te.hours),0) as logged_hours,
               CASE
                 WHEN p.billing_type='footage' THEN p.expected_revenue
                 WHEN p.billing_type='hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
               END as billable_amount
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN time_entries te ON te.project_id = p.id
          AND EXTRACT(MONTH FROM te.entry_date)=$1
          AND EXTRACT(YEAR FROM te.entry_date)=$2
        WHERE p.billed_date IS NULL
          AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND (p.status = 'completed'
            OR EXISTS(SELECT 1 FROM time_entries te2 WHERE te2.project_id=p.id
              AND EXTRACT(MONTH FROM te2.entry_date)=$1
              AND EXTRACT(YEAR FROM te2.entry_date)=$2))
        GROUP BY p.id, cl.name, co.contract_number
      `, [m, y]);

      // ── PART 2: Monthly projects — one row per UNBILLED month ──
      // For each monthly project, find every (year, month) that has time entries
      // but NO matching invoice_items row (where the invoice_date falls in that
      // same month). Each such (project, month) becomes a queue row.
      const monthlyR = await pool.query(`
        WITH project_months AS (
          SELECT
            p.id as project_id,
            EXTRACT(YEAR FROM te.entry_date)::int AS y,
            EXTRACT(MONTH FROM te.entry_date)::int AS mo,
            SUM(te.hours) AS hrs
          FROM projects p
          JOIN time_entries te ON te.project_id = p.id
          WHERE p.billing_cadence = 'monthly'
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          GROUP BY p.id, y, mo
        )
        SELECT p.id, (p.id::text || '-' || pm.y::text || '-' || pm.mo::text) as queue_key,
               p.name, p.project_type, p.billing_type, p.billing_rate,
               p.footage, p.miles, p.expected_revenue, p.expected_hours, p.actual_hours,
               p.status, p.work_order_number, p.bill_hold_until, p.billing_cadence,
               cl.name as client_name, co.contract_number,
               pm.y as period_year, pm.mo as period_month,
               pm.hrs as logged_hours,
               pm.hrs * p.billing_rate as billable_amount
        FROM project_months pm
        JOIN projects p ON p.id = pm.project_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        WHERE NOT EXISTS (
          -- "Already invoiced for this month" check: any invoice line item where
          -- the invoice's date falls in the same (y, mo) as the entries.
          SELECT 1 FROM invoice_items ii
          JOIN invoices inv ON inv.id = ii.invoice_id
          WHERE ii.project_id = pm.project_id
            AND EXTRACT(YEAR FROM inv.invoice_date)::int = pm.y
            AND EXTRACT(MONTH FROM inv.invoice_date)::int = pm.mo
        )
        ORDER BY p.client_id, p.name, pm.y, pm.mo
      `);

      // Union and sort. One-time rows first (they're status='completed' and
      // typically more urgent), then monthly rows by client/project/period.
      const all = [...oneTimeR.rows, ...monthlyR.rows];
      all.sort((a, b) => {
        const ca = a.client_name || '', cb = b.client_name || '';
        if (ca !== cb) return ca.localeCompare(cb);
        const na = a.name || '', nb = b.name || '';
        if (na !== nb) return na.localeCompare(nb);
        // monthly rows by year/month
        const ya = a.period_year || 0, yb = b.period_year || 0;
        if (ya !== yb) return ya - yb;
        return (a.period_month || 0) - (b.period_month || 0);
      });
      res.json(all);
    } catch (e) {
      console.error('billing queue error:', e);
      res.status(500).json({ error: e.message });
    }
  });
};
