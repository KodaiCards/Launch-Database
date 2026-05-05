// routes/revenue.js — manager+admin revenue queries.
//
// Five endpoints with overlapping shape (year/month filters, per-client
// breakdowns, hourly+footage union math). The SQL queries here drive the
// Revenue tab; same data is also referenced by the Dashboard.
//
//   /api/revenue/monthly-summary  — 12-row series for a year
//   /api/revenue/by-client        — per-client roll-up, optional month
//   /api/revenue/details          — per-project detail rows for a period
//   /api/revenue/projected-total  — sum of projected_revenue from leaves
//   /api/revenue/unbilled         — queue of bills the admin should send
//                                   (one-time + monthly cadence union)
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installRevenueRoutes(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // Monthly summary — all months for a given year
  app.get('/api/revenue/monthly-summary', requireManagerOrAdmin, async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    try {
      const { rows } = await pool.query(`
        WITH hourly_monthly AS (
          -- Sum time-entry hours × billing_rate for hourly-billed projects
          -- ONLY. Footage projects' billing_rate is per-mile (or per the
          -- project finance helper's interpretation); multiplying it by
          -- te.hours produces nonsense dollars. Pre-fix this CTE included
          -- every project regardless of billing_type, inflating "earned"
          -- by hours × rate of every footage project that had any hours
          -- logged against it.
          SELECT
            EXTRACT(MONTH FROM te.entry_date)::int as month,
            COALESCE(SUM(te.hours), 0) as hours,
            COALESCE(SUM(te.hours * p.billing_rate), 0) as earned
          FROM time_entries te
          JOIN projects p ON p.id = te.project_id
          WHERE EXTRACT(YEAR FROM te.entry_date) = $1
            AND p.billing_type = 'hourly'
          GROUP BY month
        ),
        footage_monthly AS (
          SELECT
            COALESCE(EXTRACT(MONTH FROM p.completed_date), EXTRACT(MONTH FROM p.billed_date), EXTRACT(MONTH FROM p.start_date))::int as month,
            COALESCE(SUM(p.expected_revenue), 0) as earned
          FROM projects p
          WHERE p.billing_type = 'footage'
            AND p.status IN ('completed', 'billed')
            AND EXTRACT(YEAR FROM COALESCE(p.completed_date, p.billed_date, p.start_date)) = $1
          GROUP BY month
        ),
        billed_monthly AS (
          -- Read from invoices.total_amount, not projects.billed_date.
          -- Monthly cadence projects (Inspection, Resident Engineer) keep
          -- status='active' across bill-and-clone and billed_date is
          -- never stamped on them — the invoice IS the record. The
          -- previous projects.billed_date filter therefore showed $0
          -- "YTD BILLED" while the Billing tab (reading invoices)
          -- correctly showed the same period as paid. Pull from invoices
          -- so the two tabs stay consistent.
          SELECT
            EXTRACT(MONTH FROM i.invoice_date)::int as month,
            COALESCE(SUM(i.total_amount), 0) as billed
          FROM invoices i
          WHERE EXTRACT(YEAR FROM i.invoice_date) = $1
          GROUP BY month
        )
        SELECT
          s.month,
          COALESCE(h.hours, 0) as hours,
          COALESCE(h.earned, 0) + COALESCE(f.earned, 0) as earned,
          COALESCE(b.billed, 0) as billed
        FROM generate_series(1, 12) AS s(month)
        LEFT JOIN hourly_monthly h ON h.month = s.month
        LEFT JOIN footage_monthly f ON f.month = s.month
        LEFT JOIN billed_monthly b ON b.month = s.month
        ORDER BY s.month
      `, [year]);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Revenue by client — filterable by month/year
  app.get('/api/revenue/by-client', requireManagerOrAdmin, async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const month = req.query.month; // optional
    try {
      let dateFilter, params;
      if (month) {
        dateFilter = `AND EXISTS (
          SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
          AND EXTRACT(MONTH FROM te2.entry_date) = $2
          AND EXTRACT(YEAR FROM te2.entry_date) = $1
        )`;
        params = [year, month];
      } else {
        dateFilter = `AND (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL)`;
        params = [year];
      }

      // Parameterized lateral filter — never interpolate user input into SQL strings
      const lateralFilter = month
        ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
        : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

      // Filter the invoice tally by the SAME month/year used elsewhere on
      // this query so that "billed" lines up with the period the user
      // selected. monthFilterInvoiced is parameterized; never string-
      // interpolate user input here.
      const invoiceMonthFilter = month ? `AND EXTRACT(MONTH FROM i.invoice_date) = $2` : '';

      const { rows } = await pool.query(`
        SELECT
          cl.id as client_id,
          cl.name as client_name,
          COUNT(DISTINCT p.id) as project_count,
          COALESCE(SUM(p.expected_revenue), 0) as expected_total,
          -- earned_hourly: gate on billing_type='hourly'. The previous version
          -- multiplied billing_rate by hours for every project regardless of
          -- type, which inflated the number for footage projects whose
          -- "rate" isn't $/hr. (Same fix applied in monthly-summary above.)
          COALESCE(SUM(
            CASE WHEN p.billing_type = 'hourly'
            THEN COALESCE(te_hrs.hrs, 0) * p.billing_rate
            ELSE 0 END
          ), 0) as earned_hourly,
          COALESCE(SUM(
            CASE WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed')
            THEN p.expected_revenue ELSE 0 END
          ), 0) as earned_footage,
          -- billed_total: read from invoices, not projects.billed_date.
          -- Monthly cadence projects keep status='active' across
          -- bill-and-clone, so the billed_date filter missed every
          -- monthly-billed dollar. Pulling from invoices keeps Revenue
          -- by-client consistent with the Billing tab and with the
          -- monthly-summary CTE above.
          COALESCE((
            SELECT SUM(i.total_amount)
            FROM invoices i
            WHERE i.client_id = cl.id
              AND EXTRACT(YEAR FROM i.invoice_date) = $1
              ${invoiceMonthFilter}
          ), 0) as billed_total,
          COALESCE(SUM(COALESCE(te_hrs.hrs, 0)), 0) as total_hours
        FROM clients cl
        LEFT JOIN projects p ON p.client_id = cl.id ${dateFilter}
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(te.hours), 0) as hrs
          FROM time_entries te
          WHERE te.project_id = p.id
          ${lateralFilter}
        ) te_hrs ON true
        GROUP BY cl.id, cl.name
        ORDER BY client_name
      `, params);

      // Calculate totals
      rows.forEach(r => {
        r.earned_total = parseFloat(r.earned_hourly) + parseFloat(r.earned_footage);
      });

      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Detailed project breakdown for a specific month
  app.get('/api/revenue/details', requireManagerOrAdmin, async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const month = req.query.month;
    try {
      let whereClause, params;
      if (month) {
        whereClause = `WHERE EXISTS (
          SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
          AND EXTRACT(MONTH FROM te2.entry_date) = $2
          AND EXTRACT(YEAR FROM te2.entry_date) = $1
        ) OR (p.billing_type = 'footage' AND EXTRACT(MONTH FROM p.start_date) = $2 AND EXTRACT(YEAR FROM p.start_date) = $1)`;
        params = [year, month];
      } else {
        whereClause = `WHERE (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL OR EXISTS (
          SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id AND EXTRACT(YEAR FROM te2.entry_date) = $1
        ))`;
        params = [year];
      }

      const hoursFilter = month
        ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
        : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

      const { rows } = await pool.query(`
        SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
               p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
               p.billed_date, p.parent_id,
               cl.name as client_name,
               co.contract_number,
               COALESCE(te_sum.hrs, 0) as period_hours,
               CASE
                 WHEN p.billing_type = 'hourly' THEN COALESCE(te_sum.hrs, 0) * COALESCE(p.billing_rate,
                   CASE LOWER(p.project_type)
                     WHEN 'inspection' THEN 90
                     WHEN 're' THEN 100
                     WHEN 'resident engineer' THEN 100
                     WHEN 'permitting' THEN 90
                     ELSE 0
                   END)
                 WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
                 ELSE 0
               END as earned
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(te.hours), 0) as hrs
          FROM time_entries te WHERE te.project_id = p.id ${hoursFilter}
        ) te_sum ON true
        ${whereClause}
        ORDER BY cl.name, p.project_type, p.name
      `, params);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/revenue/projected-total', requireManagerOrAdmin, async (req, res) => {
    try {
      // Total = sum of projected_revenue from LEAVES only (no double-counting).
      // Also returns count of leaves with a projected value vs. without, so the
      // UI can show "X of Y projects" coverage if needed.
      const totalR = await pool.query(`
        SELECT
          COALESCE(SUM(projected_revenue), 0)::float AS total,
          COUNT(*) FILTER (WHERE projected_revenue IS NOT NULL)::int AS with_projected,
          COUNT(*) FILTER (WHERE projected_revenue IS NULL)::int AS without_projected
        FROM projects p
        WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.status IN ('active', 'completed')
      `);
      // Per-client breakdown
      const byClientR = await pool.query(`
        SELECT cl.name AS client_name,
               COALESCE(SUM(p.projected_revenue), 0)::float AS projected
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.status IN ('active', 'completed')
          AND p.projected_revenue IS NOT NULL
        GROUP BY cl.name
        ORDER BY projected DESC
      `);
      // Per-project list: every leaf that has a projected_revenue, with parent
      // ancestry so the user can see which contracts are contributing.
      const projectsR = await pool.query(`
        SELECT p.id, p.name, p.projected_revenue, p.status, p.work_order_number,
               cl.name AS client_name,
               pp.name AS parent_name,
               gp.name AS grandparent_name,
               j.name AS job_name
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN projects gp ON gp.id = pp.parent_id
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.status IN ('active', 'completed')
          AND p.projected_revenue IS NOT NULL
        ORDER BY cl.name, gp.name NULLS LAST, pp.name NULLS LAST, p.name
      `);
      res.json({
        total: parseFloat(totalR.rows[0].total) || 0,
        with_projected: totalR.rows[0].with_projected,
        without_projected: totalR.rows[0].without_projected,
        by_client: byClientR.rows,
        projects: projectsR.rows
      });
    } catch (e) {
      console.error('projected-total error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/revenue/unbilled', requireManagerOrAdmin, async (req, res) => {
    try {
      // ── ONE-TIME projects: one row per project (existing logic) ──
      // Filter out monthly-cadence projects since they're handled below.
      const oneTimeR = await pool.query(`
        SELECT p.id, p.id::text as queue_key, p.name, p.project_type, p.status,
          p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
          p.actual_hours, p.work_order_number, p.parent_id, p.billing_cadence,
          p.bill_hold_until,
          cl.name as client_name,
          co.contract_number,
          con.area_name as concentrator_area,
          pp.name as parent_name,
          gp.name as grandparent_name,
          NULL::int as period_year, NULL::int as period_month,
          COALESCE(SUM(te.hours),0) as logged_hours,
          CASE
            WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount
            WHEN p.billing_type = 'hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
            WHEN p.billing_type = 'footage' THEN p.expected_revenue
            ELSE 0
          END as earned_amount,
          CASE
            WHEN p.status = 'completed' THEN 'completed'
            WHEN p.billing_type = 'hourly' AND p.status = 'active' THEN 'in_progress'
            ELSE 'other'
          END as bill_kind
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN time_entries te ON te.project_id = p.id
        LEFT JOIN concentrators con ON con.id = p.concentrator_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN projects gp ON gp.id = pp.parent_id
        WHERE p.billed_date IS NULL
          AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND (
            p.status = 'completed'
            OR (p.status = 'active' AND p.billing_type = 'hourly' AND EXISTS (
              SELECT 1 FROM time_entries WHERE project_id = p.id
            ))
            -- Permits become billable when their pipeline stage hits 'approved'
            -- (or beyond — 'checklist'). They don't need status='completed' for
            -- billing because the work-product is the approval, not arbitrary
            -- closure. We check existence of an 'approved' or 'checklist' stage
            -- row regardless of completed_at — once approved, billable forever
            -- until billed_date is set.
            OR (p.project_type = 'permitting' AND EXISTS (
              SELECT 1 FROM permit_stages ps
              WHERE ps.project_id = p.id AND ps.stage IN ('approved','checklist')
            ))
          )
        GROUP BY p.id, cl.name, co.contract_number, con.area_name, pp.name, gp.name
        HAVING (
          p.billing_type = 'footage'
          OR COALESCE(SUM(te.hours),0) > 0
        )
      `);

      // ── MONTHLY projects: one row per (project, year, month) that has hours
      // but no matching invoice line item dated in that period.
      const monthlyR = await pool.query(`
        WITH project_months AS (
          SELECT
            p.id as project_id,
            EXTRACT(YEAR FROM te.entry_date)::int AS y,
            EXTRACT(MONTH FROM te.entry_date)::int AS mo,
            SUM(te.hours)::float AS hrs
          FROM projects p
          JOIN time_entries te ON te.project_id = p.id
          WHERE p.billing_cadence = 'monthly'
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          GROUP BY p.id, y, mo
        )
        SELECT p.id, (p.id::text || '-' || pm.y::text || '-' || pm.mo::text) as queue_key,
          p.name, p.project_type, p.status,
          p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
          p.actual_hours, p.work_order_number, p.parent_id, p.billing_cadence,
          p.bill_hold_until,
          cl.name as client_name, co.contract_number,
          con.area_name as concentrator_area,
          pp.name as parent_name, gp.name as grandparent_name,
          pm.y as period_year, pm.mo as period_month,
          pm.hrs as logged_hours,
          pm.hrs * p.billing_rate as earned_amount,
          'monthly' as bill_kind
        FROM project_months pm
        JOIN projects p ON p.id = pm.project_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN concentrators con ON con.id = p.concentrator_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN projects gp ON gp.id = pp.parent_id
        WHERE NOT EXISTS (
          SELECT 1 FROM invoice_items ii
          JOIN invoices inv ON inv.id = ii.invoice_id
          WHERE ii.project_id = pm.project_id
            AND EXTRACT(YEAR FROM inv.invoice_date)::int = pm.y
            AND EXTRACT(MONTH FROM inv.invoice_date)::int = pm.mo
        )
      `);

      // Union and sort: client → parent → name → period
      const all = [...oneTimeR.rows, ...monthlyR.rows];
      all.sort((a, b) => {
        const ca = a.client_name || '', cb = b.client_name || '';
        if (ca !== cb) return ca.localeCompare(cb);
        const pa = a.parent_name || '', pb = b.parent_name || '';
        if (pa !== pb) return pa.localeCompare(pb);
        const na = a.name || '', nb = b.name || '';
        if (na !== nb) return na.localeCompare(nb);
        const ya = a.period_year || 0, yb = b.period_year || 0;
        if (ya !== yb) return ya - yb;
        return (a.period_month || 0) - (b.period_month || 0);
      });
      res.json(all);
    } catch (e) {
      console.error('unbilled queue error:', e);
      res.status(500).json({ error: e.message });
    }
  });
};
