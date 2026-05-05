// routes/inspection.js — RUS-program scope view (formerly the Inspection tab).
//
// Returns every active project whose engineering contract has program='rus'
// with hours and revenue rolled up for the requested time period. The tab
// covers the whole engineering-contract umbrella now — Inspection, RE,
// Permitting, and any other jobs RUS work runs through. Non-RUS engineering
// contracts (BAU/GFR/Other) are excluded entirely (they have their own
// format / surfacing). PSC clients commonly have BOTH RUS and non-RUS work,
// so scoping by client.is_rus would mistakenly include their BAU projects;
// we scope by engineering_contracts.program to keep this surgical.
//
// Query params:
//   period: 'ytd' (default) or 'month'
//   month:  YYYY-MM string when period=month (e.g. '2026-04')
//   status: optional filter — 'all' (default = active+billed), 'active',
//           'billed', 'completed', 'on_hold'. The default mirrors the
//           original endpoint behaviour so existing callers don't change.
//
// Permitting (footage) projects keep $0 in revenue because they bill by
// mile, not hourly; the tab is hours-driven.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installInspectionRoutes(app, pool, mw) {
  app.get('/api/inspection', async (req, res) => {
    const period = (req.query.period || 'ytd').toLowerCase();
    let monthYear = req.query.month;  // 'YYYY-MM'
    let startDate, endDate;
    const now = new Date();
    if (period === 'month') {
      if (!monthYear || !/^\d{4}-\d{2}$/.test(monthYear)) {
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        monthYear = `${yyyy}-${mm}`;
      }
      const [y, m] = monthYear.split('-').map(Number);
      startDate = `${y}-${String(m).padStart(2,'0')}-01`;
      // Last day of month: day 0 of next month
      const last = new Date(y, m, 0).getDate();
      endDate = `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
    } else {
      // YTD: Jan 1 of current year through today
      const yyyy = now.getFullYear();
      startDate = `${yyyy}-01-01`;
      endDate = now.toISOString().slice(0,10);
    }
    // Status filter — default keeps the historic 'active' + 'billed' scope so
    // existing callers don't break. 'all' lifts the gate entirely.
    const statusFilter = String(req.query.status || '').toLowerCase();
    const VALID_STATUSES = ['active', 'billed', 'completed', 'on_hold'];
    let statusClause = `p.status IN ('active', 'billed')`;
    const queryParams = [];
    if (statusFilter === 'all') {
      statusClause = `TRUE`;
    } else if (VALID_STATUSES.includes(statusFilter)) {
      statusClause = `p.status = $1`;
      queryParams.push(statusFilter);
    }

    try {
      // RUS-program scope. Returns every project whose engineering contract
      // has program='rus' and matches the status filter. The tab covers
      // the whole engineering-contract umbrella now — Inspection, RE,
      // Permitting, and any other jobs RUS work runs through. Non-RUS
      // engineering contracts are excluded entirely (BAU/GFR/Other have
      // their own format / surfacing). Joining through contracts→
      // engineering_contracts is required because program lives on the
      // umbrella, not the project or the client.
      const { rows: projects } = await pool.query(`
        SELECT p.id, p.name, p.work_order_number, p.status, p.is_ongoing, p.client_id,
               cl.name as client_name,
               j.name as job_name, j.default_rate as job_rate, j.default_billing_type as job_billing_type, j.team as job_team, j.is_permitting,
               p.billing_rate, p.billing_type,
               pp.name as parent_name, pp.rollup_level as parent_level,
               (SELECT name FROM projects pa WHERE pa.id = pp.parent_id) as grandparent_name
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN jobs j     ON j.id  = p.job_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN engineering_contracts ec ON ec.id = co.engineering_contract_id
        WHERE COALESCE(p.is_rollup, FALSE) = FALSE
          AND ec.program = 'rus'
          AND ${statusClause}
        ORDER BY p.is_ongoing DESC, j.name NULLS LAST, p.name
      `, queryParams);

      // Sum every hour on each project for the period — no job_title heuristic
      // since the program='rus' filter already scopes us correctly. Permitting
      // (footage) projects keep $0 in revenue because they bill by mile,
      // not hourly; the tab is hours-driven.
      const result = [];
      for (const p of projects) {
        const { rows: tr } = await pool.query(
          `SELECT COALESCE(SUM(hours), 0)::float as hours,
                  COUNT(DISTINCT staff_id)::int as inspector_count
             FROM time_entries
            WHERE project_id = $1 AND entry_date BETWEEN $2 AND $3`,
          [p.id, startDate, endDate]
        );
        const hours = tr[0].hours || 0;
        // Hide rows with zero hours UNLESS they're flagged ongoing, are
        // active permitting projects, or the user explicitly filtered to a
        // status — in which case they want every project in that bucket.
        if (hours === 0 && !p.is_ongoing && !p.is_permitting && p.status !== 'active' && !statusFilter) continue;
        const rate = parseFloat(p.billing_rate) || parseFloat(p.job_rate) || 90;
        const revenue = (p.billing_type === 'footage' || p.job_billing_type === 'footage')
          ? 0  // footage projects don't bill by hours
          : hours * rate;
        // service area = parent rollup name when parent is a service_area folder
        let service_area = null;
        if (p.parent_level === 'service_area') service_area = p.parent_name;
        result.push({
          ...p,
          period: { start: startDate, end: endDate, mode: period, label: monthYear || null },
          hours_in_period: hours,
          revenue_in_period: revenue,
          inspectors_in_period: tr[0].inspector_count || 0,
          service_area,
        });
      }

      // Aggregate totals for tiles
      const totals = result.reduce((acc, p) => {
        acc.hours += p.hours_in_period;
        acc.revenue += p.revenue_in_period;
        if (p.status === 'active' || p.is_ongoing) acc.active_projects++;
        return acc;
      }, { hours: 0, revenue: 0, active_projects: 0 });

      // Inspector count = distinct staff_ids with any time in the period across these projects
      const projectIds = result.map(r => r.id);
      let inspectorCount = 0;
      if (projectIds.length) {
        const { rows: ic } = await pool.query(
          `SELECT COUNT(DISTINCT staff_id)::int as n
           FROM time_entries
           WHERE project_id = ANY($1::uuid[]) AND entry_date BETWEEN $2 AND $3 AND staff_id IS NOT NULL`,
          [projectIds, startDate, endDate]
        );
        inspectorCount = ic[0].n || 0;
      }

      res.json({
        period: { start: startDate, end: endDate, mode: period, label: monthYear || null },
        totals: { ...totals, inspector_count: inspectorCount },
        projects: result,
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
