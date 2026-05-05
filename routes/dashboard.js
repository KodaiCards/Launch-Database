// routes/dashboard.js — admin dashboard tiles + active-list debug endpoint.
//
// /api/dashboard         — period-aware tiles: active project count,
//                          unbilled total, period (or YTD) revenue, plus
//                          arrays of recent active projects and unbilled
//                          alerts. Manager+admin gate via requireAuth.
// /api/dashboard/active-list — debug helper that returns exactly which
//                          projects the "active" tile is counting. Open
//                          from the tile when the number looks wrong.
//
// requireAuth (the factory) is passed in via mw because the dashboard
// route is gated on a specific role list, not the simple admin/manager
// shortcut.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installDashboardRoutes(app, pool, mw) {
  const { requireAuth } = mw;

  // Debug: returns the exact list of projects counted as "active" by the
  // dashboard tile. Visible from the dashboard for troubleshooting.
  app.get('/api/dashboard/active-list', async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT p.id, p.name, p.status, p.work_order_number,
               cl.name AS client_name,
               j.name AS job_name,
               pp.name AS parent_name
        FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        WHERE p.status='active'
          AND COALESCE(p.is_rollup, FALSE) = FALSE
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.job_id IS NOT NULL
          AND LOWER(COALESCE(j.name, '')) <> 'other'
        ORDER BY cl.name, pp.name, p.name
      `);
      res.json({ count: rows.length, projects: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/dashboard', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    try {
      // Period selection — defaults to current month/YTD if not specified.
      // period: 'ytd' (year-to-date) or 'month' (specific month)
      // year:   YYYY
      // month:  1-12 (only used if period=month)
      const now = new Date();
      const period = (req.query.period || 'ytd').toLowerCase();
      const yyyy = parseInt(req.query.year) || now.getFullYear();
      const mm = parseInt(req.query.month);

      // Compute period boundaries. ytd → Jan 1 of year through end-of-year;
      // month → first/last day of that month. Monthly tile is always "current
      // month within the period" — when period=ytd it's the actual current
      // month; when period=month it's the picked month.
      const yearStart = `${yyyy}-01-01`;
      const yearEnd   = `${yyyy}-12-31`;
      let periodStart, periodEnd, periodLabel;
      if (period === 'month' && mm >= 1 && mm <= 12) {
        const lastDay = new Date(yyyy, mm, 0).getDate();
        periodStart = `${yyyy}-${String(mm).padStart(2,'0')}-01`;
        periodEnd   = `${yyyy}-${String(mm).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
        periodLabel = `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mm-1]} ${yyyy}`;
      } else {
        periodStart = yearStart;
        periodEnd   = yearEnd;
        periodLabel = `YTD ${yyyy}`;
      }

      const [activeR, unbilledR, monthRevR, ytdRevR, recentR, alertR] = await Promise.all([
        // Active = leaf projects (anything without children) AND not a rollup
        // folder. Rollups have is_rollup=TRUE and are organizational containers
        // (Client / Service Area / Team folders); they don't represent
        // billable work and should never appear in business counts. Bug
        // caught 2026-05-05: a rollup whose only child was deleted becomes
        // a "childless leaf" by the NOT EXISTS check alone, inflating the
        // count by every now-empty rollup folder.
        pool.query(`
          SELECT COUNT(*) FROM projects p
          WHERE p.status='active'
            AND COALESCE(p.is_rollup, FALSE) = FALSE
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        `),
        pool.query(`
          SELECT COUNT(*), COALESCE(SUM(expected_revenue),0) as total
          FROM projects p
          WHERE p.status='completed' AND p.billed_date IS NULL
            AND COALESCE(p.is_rollup, FALSE) = FALSE
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        `),
        // Period revenue: hours logged in the chosen period × rate
        pool.query(`
          SELECT COALESCE(SUM(te.hours * COALESCE(p.billing_rate,
            CASE LOWER(p.project_type)
              WHEN 'inspection' THEN 90
              WHEN 're' THEN 100
              WHEN 'resident engineer' THEN 100
              WHEN 'permitting' THEN 90
              ELSE 0
            END
          )), 0) AS rev
          FROM time_entries te
          JOIN projects p ON p.id = te.project_id
          WHERE te.entry_date BETWEEN $1 AND $2
            AND COALESCE(p.is_rollup, FALSE) = FALSE
        `, [periodStart, periodEnd]),
        // YTD revenue: ALL earned revenue in the SELECTED YEAR (not period).
        // Provides a year-context number alongside the period number above so
        // admin can compare "this month" vs "year-to-date" at a glance.
        pool.query(`
          SELECT COALESCE(SUM(
            CASE
              WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN COALESCE(p.expected_revenue, 0)
              ELSE COALESCE(
                (SELECT SUM(te.hours) FROM time_entries te
                 WHERE te.project_id = p.id
                   AND EXTRACT(YEAR FROM te.entry_date) = $1),
                0
              ) * COALESCE(p.billing_rate,
                CASE LOWER(p.project_type)
                  WHEN 'inspection' THEN 90
                  WHEN 're' THEN 100
                  WHEN 'resident engineer' THEN 100
                  WHEN 'permitting' THEN 90
                  ELSE 0
                END
              )
            END
          ), 0) AS rev
          FROM projects p
          WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
            AND COALESCE(p.is_rollup, FALSE) = FALSE
            AND p.status IN ('active','completed','billed')
        `, [yyyy]),
        pool.query(`
          SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
                 cl.name as client_name, p.expected_hours, p.actual_hours,
                 p.expected_revenue, p.created_at, p.parent_id,
                 p.billing_rate, p.billing_type,
                 pp.name as parent_name, pp.parent_id as grandparent_id,
                 con.area_name as concentrator_area,
                 COALESCE((SELECT SUM(te.hours) FROM time_entries te WHERE te.project_id = p.id), 0) as own_hours,
                 COALESCE((
                   WITH RECURSIVE tree AS (
                     SELECT p.id AS tid
                     UNION ALL
                     SELECT c.id FROM projects c JOIN tree t ON c.parent_id = t.tid
                   )
                   SELECT SUM(
                     CASE
                       WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                         THEN COALESCE(leaf.expected_revenue, 0)
                       ELSE COALESCE((
                         SELECT SUM(te2.hours) FROM time_entries te2
                         WHERE te2.project_id = leaf.id
                           AND EXTRACT(YEAR FROM te2.entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                       ), 0) * COALESCE(leaf.billing_rate,
                         CASE LOWER(leaf.project_type)
                           WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                         END)
                     END
                   )
                   FROM projects leaf
                   WHERE leaf.id IN (SELECT tid FROM tree)
                     AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
                 ), 0) as ytd_revenue
          FROM projects p
          LEFT JOIN clients cl ON cl.id=p.client_id
          LEFT JOIN projects pp ON pp.id=p.parent_id
          LEFT JOIN concentrators con ON con.id=p.concentrator_id
          WHERE p.status='active'
            AND COALESCE(p.is_rollup, FALSE) = FALSE
          ORDER BY p.created_at DESC
        `),
        pool.query(`
          SELECT p.id, p.name, p.project_type, p.work_order_number, p.expected_revenue,
                 cl.name as client_name, p.completed_date
          FROM projects p
          LEFT JOIN clients cl ON cl.id=p.client_id
          WHERE p.status='completed' AND p.billed_date IS NULL
            AND COALESCE(p.is_rollup, FALSE) = FALSE
            AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          ORDER BY p.completed_date ASC
        `)
      ]);

      res.json({
        period: { mode: period, year: yyyy, month: mm || null, label: periodLabel, start: periodStart, end: periodEnd },
        active_projects: parseInt(activeR.rows[0].count),
        unbilled_count: parseInt(unbilledR.rows[0].count),
        unbilled_total: parseFloat(unbilledR.rows[0].total),
        month_revenue: parseFloat(monthRevR.rows[0].rev),  // now period_revenue (kept name for back-compat)
        ytd_revenue: parseFloat(ytdRevR.rows[0].rev),
        recent_projects: recentR.rows,
        unbilled_projects: alertR.rows
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
