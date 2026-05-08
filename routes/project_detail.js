// routes/project_detail.js — single big drill-down endpoint for the
// "click a project row" popup.
//
// GET /api/projects/:id/detail returns everything the popup needs in one
// round trip: the project itself + recursive subtree data (every
// descendant's time entries / invoices / docs), monthly hours/earned/
// billed breakdown, projected revenue rollup, lifetime totals, active
// billable count for the "across N projects" label, plus permit stages
// and direct child rows with computed subtree_revenue.
//
// All NULL billing_rates are coalesced to a hardcoded type-based default
// (Inspection $90 / RE $100 / Permitting $90) so containers and partial-
// rate projects compute consistently. Footage projects are billed off
// expected_revenue when status='completed' or 'billed'; otherwise hourly
// math runs.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installProjectDetailRoutes(app, pool, mw) {
  app.get('/api/projects/:id/detail', async (req, res) => {
    try {
      const projR = await pool.query(`
        SELECT p.*, cl.name as client_name, co.contract_number, co.name as contract_name,
               pp.name as parent_name,
               gp.name as grandparent_name,
               bc.code as budget_code, b.name as budget_name,
               EXISTS (SELECT 1 FROM budgets WHERE project_id = p.id) as has_budget
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN projects gp ON gp.id = pp.parent_id
        LEFT JOIN budget_codes bc ON bc.id = p.budget_code_id
        LEFT JOIN budgets b ON b.id = bc.budget_id
        WHERE p.id = $1
      `, [req.params.id]);
      if (!projR.rows[0]) return res.status(404).json({ error: 'Not found' });

      // Collect this project + ALL descendants (recursive). For container projects
      // (grandparents/parents) this lets us roll hours up from their leaves so the
      // popup is meaningful even when no time is logged directly to the container.
      const subtreeR = await pool.query(`
        WITH RECURSIVE subtree AS (
          SELECT id, 0 AS depth FROM projects WHERE id = $1
          UNION ALL
          SELECT p.id, s.depth + 1 FROM projects p
          JOIN subtree s ON p.parent_id = s.id WHERE s.depth < 10
        )
        SELECT id FROM subtree
      `, [req.params.id]);
      const subtreeIds = subtreeR.rows.map(r => r.id);

      // Active billable count: leaves only, status='active', with a non-Other job.
      // Mirrors the dashboard's active count rule. Used for the "across N projects"
      // label so containers/Other/non-active don't inflate the number.
      const activeCountR = await pool.query(`
        SELECT COUNT(*)::int AS n FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE p.id = ANY($1::uuid[])
          AND p.status = 'active'
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.job_id IS NOT NULL
          AND LOWER(COALESCE(j.name, '')) <> 'other'
      `, [subtreeIds]);
      const activeBillableCount = parseInt(activeCountR.rows[0].n) || 0;

      const month = req.query.month;
      const year = req.query.year;
      let dateFilter = '', params = [subtreeIds];
      if (month && year) {
        dateFilter = ' AND EXTRACT(MONTH FROM te.entry_date)=$2 AND EXTRACT(YEAR FROM te.entry_date)=$3';
        params.push(month, year);
      } else if (year) {
        dateFilter = ' AND EXTRACT(YEAR FROM te.entry_date)=$2';
        params.push(year);
      }

      // Time entries: pulled from the whole subtree, joined to project info so
      // the UI can show which leaf each entry came from.
      const entriesR = await pool.query(`
        SELECT te.*, s.name as staff_name,
               pr.name as project_name, pr.id as project_id, pr.work_order_number, pr.project_type,
               COALESCE(pr.billing_rate,
                 CASE LOWER(pr.project_type)
                   WHEN 'inspection' THEN 90
                   WHEN 're' THEN 100
                   WHEN 'resident engineer' THEN 100
                   WHEN 'permitting' THEN 90
                   ELSE 0
                 END
               ) as billing_rate
        FROM time_entries te
        LEFT JOIN staff s ON s.id = te.staff_id
        LEFT JOIN projects pr ON pr.id = te.project_id
        WHERE te.project_id = ANY($1::uuid[]) ${dateFilter}
        ORDER BY te.entry_date DESC, s.name
      `, params);

      const stagesR = await pool.query(
        `SELECT * FROM permit_stages WHERE project_id = $1 ORDER BY created_at`,
        [req.params.id]
      );

      // Direct children with computed revenue (handles NULL billing_rate via type inference)
      const childrenR = await pool.query(`
        WITH RECURSIVE child_tree AS (
          SELECT id, parent_id, 0 AS depth FROM projects WHERE parent_id = $1
          UNION ALL
          SELECT p.id, p.parent_id, ct.depth + 1 FROM projects p JOIN child_tree ct ON p.parent_id = ct.id WHERE ct.depth < 10
        )
        SELECT c.id, c.name, c.project_type, c.status, c.billing_rate, c.billing_type,
               c.expected_revenue, c.actual_hours,
               COALESCE(c.billing_rate,
                 CASE LOWER(c.project_type)
                   WHEN 'inspection' THEN 90
                   WHEN 're' THEN 100
                   WHEN 'resident engineer' THEN 100
                   WHEN 'permitting' THEN 90
                   ELSE 0
                 END
               ) as effective_rate,
               -- Compute subtree revenue for this child
               COALESCE((
                 WITH RECURSIVE descendants AS (
                   SELECT c.id AS did, 0 AS depth
                   UNION ALL
                   SELECT p.id, d.depth + 1 FROM projects p JOIN descendants d ON p.parent_id = d.did WHERE d.depth < 10
                 )
                 SELECT SUM(
                   CASE
                     WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                       THEN COALESCE(leaf.expected_revenue, 0)
                     ELSE COALESCE((SELECT SUM(te.hours) FROM time_entries te WHERE te.project_id = leaf.id), 0)
                       * COALESCE(leaf.billing_rate,
                         CASE LOWER(leaf.project_type)
                           WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                         END)
                   END
                 ) FROM projects leaf
                 WHERE leaf.id IN (SELECT did FROM descendants)
                   AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
               ), 0) as subtree_revenue
         FROM projects c WHERE c.parent_id = $1 ORDER BY c.name`,
        [req.params.id]
      );

      // Invoices linked to ANY project in the subtree (so a parent shows
      // its leaves' invoices too)
      const invoicesR = await pool.query(`
        SELECT ii.id, ii.description, ii.quantity, ii.unit, ii.rate, ii.amount,
               inv.invoice_number, inv.invoice_date, inv.status, inv.notes,
               pr.name as project_name
        FROM invoice_items ii
        JOIN invoices inv ON inv.id = ii.invoice_id
        LEFT JOIN projects pr ON pr.id = ii.project_id
        WHERE ii.project_id = ANY($1::uuid[])
        ORDER BY inv.invoice_date DESC, ii.created_at DESC
      `, [subtreeIds]);

      // Distinct (year, month) periods that have activity ANYWHERE in the subtree.
      // Powers the month-tab switcher in the popup — for ongoing work the user
      // can pick any month with data and see just that month's breakdown.
      const periodsR = await pool.query(`
        SELECT EXTRACT(YEAR FROM entry_date)::int AS year,
               EXTRACT(MONTH FROM entry_date)::int AS month,
               SUM(hours)::float AS hours
        FROM time_entries
        WHERE project_id = ANY($1::uuid[])
        GROUP BY year, month
        ORDER BY year DESC, month DESC
      `, [subtreeIds]);

      // Per-month breakdown for the popup table: hours, earned, and whether the
      // month has been invoiced. Earned uses each entry's leaf billing_rate so
      // mixed-job containers compute correctly. The billed flag fires when ANY
      // project in this subtree has an invoice_items row dated within that month.
      const monthlyBreakdownR = await pool.query(`
        WITH agg AS (
          SELECT EXTRACT(YEAR FROM te.entry_date)::int AS y,
                 EXTRACT(MONTH FROM te.entry_date)::int AS mo,
                 SUM(te.hours)::float AS hours,
                 SUM(te.hours * COALESCE(pr.billing_rate, 0))::float AS earned
          FROM time_entries te
          JOIN projects pr ON pr.id = te.project_id
          WHERE te.project_id = ANY($1::uuid[])
            AND COALESCE(pr.billing_type, 'hourly') = 'hourly'
          GROUP BY y, mo
        ),
        billed AS (
          SELECT EXTRACT(YEAR FROM inv.invoice_date)::int AS y,
                 EXTRACT(MONTH FROM inv.invoice_date)::int AS mo,
                 SUM(ii.amount)::float AS billed_amount,
                 COUNT(DISTINCT inv.id)::int AS invoice_count
          FROM invoice_items ii
          JOIN invoices inv ON inv.id = ii.invoice_id
          WHERE ii.project_id = ANY($1::uuid[])
          GROUP BY y, mo
        )
        SELECT a.y AS year, a.mo AS month, a.hours, a.earned,
               COALESCE(b.billed_amount, 0) AS billed_amount,
               COALESCE(b.invoice_count, 0) AS invoice_count,
               (b.invoice_count IS NOT NULL AND b.invoice_count > 0) AS is_billed
        FROM agg a
        LEFT JOIN billed b ON a.y = b.y AND a.mo = b.mo
        ORDER BY a.y DESC, a.mo DESC
      `, [subtreeIds]);

      // Projected revenue rollup: sum projected_revenue from LEAVES only in the
      // subtree (containers ignored to prevent double-count). Plus subtract billed
      // and earned so we can show "remaining" / "left to earn".
      const projectedR = await pool.query(`
        WITH leaves AS (
          SELECT p.id, p.projected_revenue
          FROM projects p
          WHERE p.id = ANY($1::uuid[])
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        )
        SELECT COALESCE(SUM(projected_revenue), 0)::float AS projected_total,
               COUNT(*) FILTER (WHERE projected_revenue IS NOT NULL)::int AS projected_count
        FROM leaves
      `, [subtreeIds]);

      // Lifetime totals — total hours and earned regardless of period filter.
      const lifetimeR = await pool.query(`
        SELECT COALESCE(SUM(te.hours), 0)::float AS total_hours,
               COALESCE(SUM(te.hours * COALESCE(pr.billing_rate,
                 CASE LOWER(pr.project_type)
                   WHEN 'inspection' THEN 90
                   WHEN 're' THEN 100
                   WHEN 'resident engineer' THEN 100
                   WHEN 'permitting' THEN 90
                   ELSE 0
                 END
               )), 0)::float AS earned_hourly
        FROM time_entries te
        JOIN projects pr ON pr.id = te.project_id
        WHERE te.project_id = ANY($1::uuid[])
      `, [subtreeIds]);

      const docsR = await pool.query(
        `SELECT * FROM permit_documents WHERE project_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
        [subtreeIds]
      );

      res.json({
        project: projR.rows[0],
        time_entries: entriesR.rows,
        permit_stages: stagesR.rows,
        permit_documents: docsR.rows,
        children: childrenR.rows,
        invoices: invoicesR.rows,
        months_with_activity: periodsR.rows,
        monthly_breakdown: monthlyBreakdownR.rows,
        projected: projectedR.rows[0],
        lifetime: lifetimeR.rows[0],
        subtree_size: subtreeIds.length,
        active_billable_count: activeBillableCount
      });
    } catch (e) {
      console.error('project detail error:', e);
      res.status(500).json({ error: e.message });
    }
  });
};
