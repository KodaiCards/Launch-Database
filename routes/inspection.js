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
// Display rules (owner-flagged 2026-05-06):
//   - Name format: "[Area] (WO#) - [Job]" (e.g. "Crossroad School (18999) - Inspection").
//     Falls back to just the project name when concentrator + WO# can't be
//     resolved on the leaf or its parent rollup chain.
//   - Each row carries `contract_label` so the frontend can group rows
//     under a contract section header.
//
// Hours attribution (owner-flagged 2026-05-06):
//   - Sum time_entries directly on the leaf, PLUS time_entries on any
//     ancestor rollup where the entry's job_title matches the leaf's
//     job_name (case-insensitive). This handles the common case where a
//     CSV import attached hours to a WO rollup (because the leaf had no
//     WO# of its own) — those hours are now correctly attributed back
//     to the matching leaf.
//
// Query params:
//   period: 'ytd' (default) or 'month'
//   month:  YYYY-MM string when period=month (e.g. '2026-04')
//   status: optional filter — 'all' (default = active+billed), 'active',
//           'billed', 'completed', 'on_hold'.
//
// Permitting (footage) projects keep $0 in revenue because they bill by
// mile, not hourly; the tab is hours-driven.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

// H-7: Use business-timezone date helper so entries logged 6-11 PM Chicago
// don't fall outside the YTD window due to UTC boundary mismatch.
const { dateInBusinessTz } = require('../automation');

module.exports = function installInspectionRoutes(app, pool, mw) {
  // Wave 1.5 [UNGATED]: GET /api/inspection was missing requireAuth.
  // Gated to admin + managers (who use the Inspection tab).
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  app.get('/api/inspection', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const period = (req.query.period || 'ytd').toLowerCase();
    let monthYear = req.query.month;  // 'YYYY-MM'
    let startDate, endDate;
    const now = new Date();
    // H-7: use Chicago-tz date for all "today" references so entries
    // logged 6-11 PM Chicago don't fall outside the intended window.
    const todayChicago = dateInBusinessTz(now);
    if (period === 'month') {
      if (!monthYear || !/^\d{4}-\d{2}$/.test(monthYear)) {
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        monthYear = `${yyyy}-${mm}`;
      }
      const [y, m] = monthYear.split('-').map(Number);
      startDate = `${y}-${String(m).padStart(2,'0')}-01`;
      const last = new Date(y, m, 0).getDate();
      endDate = `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
    } else {
      startDate = `${todayChicago.slice(0, 4)}-01-01`;
      endDate = todayChicago;  // H-7: was now.toISOString().slice(0,10) (UTC)
    }

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
      // RUS-program scope. Returns every leaf project (is_rollup=FALSE)
      // whose engineering contract has program='rus'. Joins:
      //   con      — concentrator on the leaf (preferred area / WO# source)
      //   con2     — concentrator on the parent rollup (fallback)
      //   con3     — concentrator on the grandparent rollup (deeper fallback)
      //   c        — contract on the leaf, for the contract_label group key
      //   pp / ppp — parent / grandparent rollups for area-name fallback
      const { rows: projects } = await pool.query(`
        SELECT p.id, p.name, p.work_order_number, p.status, p.is_ongoing, p.client_id,
               p.concentrator_id, p.contract_id, p.parent_id,
               cl.name AS client_name,
               j.name AS job_name, j.default_rate AS job_rate, j.default_billing_type AS job_billing_type,
               j.team AS job_team, j.is_permitting,
               p.billing_rate, p.billing_type,
               pp.name AS parent_name, pp.rollup_level AS parent_level,
               pp.work_order_number AS parent_wo_number,
               pp.concentrator_id AS parent_concentrator_id,
               ppp.name AS grandparent_name,
               ppp.work_order_number AS grandparent_wo_number,
               ppp.concentrator_id AS grandparent_concentrator_id,
               c.friendly_label AS contract_label,
               c.contract_number AS contract_number,
               -- area + WO# resolution: prefer leaf's concentrator, then parent, then grandparent
               COALESCE(con.area_name, con2.area_name, con3.area_name) AS resolved_area,
               COALESCE(con.work_order_number, con2.work_order_number, con3.work_order_number,
                        p.work_order_number, pp.work_order_number, ppp.work_order_number) AS resolved_wo
        FROM projects p
        LEFT JOIN clients cl  ON cl.id = p.client_id
        LEFT JOIN jobs j      ON j.id  = p.job_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN projects ppp ON ppp.id = pp.parent_id
        LEFT JOIN contracts c ON c.id = p.contract_id
        LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
        LEFT JOIN concentrators con  ON con.id  = p.concentrator_id
        LEFT JOIN concentrators con2 ON con2.id = pp.concentrator_id
        LEFT JOIN concentrators con3 ON con3.id = ppp.concentrator_id
        WHERE COALESCE(p.is_rollup, FALSE) = FALSE
          AND (p.program = 'rus' OR ec.program = 'rus')
          AND ${statusClause}
        ORDER BY c.contract_number NULLS LAST,
                 COALESCE(con.area_name, con2.area_name, con3.area_name, pp.name, p.name),
                 j.name NULLS LAST,
                 p.name
      `, queryParams);

      if (!projects.length) {
        return res.json({
          period: { start: startDate, end: endDate, mode: period, label: monthYear || null },
          totals: { hours: 0, revenue: 0, active_projects: 0, inspector_count: 0 },
          projects: [],
        });
      }

      // Hours attribution. For each leaf, sum time_entries on the leaf
      // itself, PLUS time_entries on any ancestor rollup that can be
      // attributed to this leaf. Attribution rules (in priority order):
      //
      //   1. Direct hit — entry's project_id === leaf_id. Every entry
      //      counts regardless of job_title.
      //   2. Exact job match — ancestor entry whose job_title matches the
      //      leaf's job_name (case-insensitive). Original behaviour.
      //   3. Sole-leaf fallback — the ancestor rollup has EXACTLY ONE
      //      leaf descendant with a non-null job_id. Attribute ALL of
      //      that rollup's entries to that leaf regardless of job_title.
      //      Handles the common case: one Inspection leaf under a WO
      //      rollup; all the work is about that leaf even if job_title
      //      says 'Other'.
      //   4. Substring match — entry's job_title contains the leaf's
      //      job_name as a substring (or vice-versa). Lower priority
      //      than exact; only fires when no exact match claimed the entry.
      //
      // Anti-double-count: each entry is attributed to AT MOST ONE leaf.
      // When multiple leaves could claim an ancestor entry we pick the
      // best (exact > sole-leaf > substring). The CTE uses DISTINCT ON
      // (te.id) ordered by priority so each entry_id appears once.
      const leafIds = projects.map(p => p.id);
      const { rows: hoursRows } = await pool.query(`
        WITH RECURSIVE
        leaf_ctx AS (
          -- Each leaf's id, parent_id, and the job name to match against.
          SELECT p.id AS leaf_id, p.id AS cursor_id, p.parent_id,
                 LOWER(j.name) AS job_name_lc, p.job_id IS NOT NULL AS has_job,
                 0 AS depth
          FROM projects p
          LEFT JOIN jobs j ON j.id = p.job_id
          WHERE p.id = ANY($1::uuid[])
          UNION ALL
          -- Walk up the parent chain. cursor_id moves to the parent.
          -- depth caps at 10 to stop runaway recursion.
          SELECT lc.leaf_id, p.id, p.parent_id, lc.job_name_lc, lc.has_job,
                 lc.depth + 1
          FROM leaf_ctx lc
          JOIN projects p ON p.id = lc.parent_id
          WHERE lc.depth < 10
        ),
        -- For each (leaf, ancestor) pair, count how many OTHER leaves in
        -- $1 also descend from that ancestor AND have a non-null job_id.
        -- When the count is 1 and has_job is true for this leaf, this
        -- leaf is the sole candidate → sole-leaf fallback applies.
        ancestor_leaf_counts AS (
          SELECT cursor_id AS ancestor_id,
                 COUNT(DISTINCT CASE WHEN has_job THEN leaf_id END)::int AS leaves_with_job
          FROM leaf_ctx
          WHERE cursor_id <> leaf_id  -- only rollup nodes
          GROUP BY cursor_id
        ),
        -- Candidate attribution rows: one row per (time_entry, leaf) pair.
        -- priority: 1=direct, 2=exact, 3=sole-leaf, 4=substring.
        -- We pick the lowest priority number per entry_id.
        raw_attr AS (
          SELECT te.id AS entry_id, lc.leaf_id,
                 te.hours, te.staff_id,
                 CASE
                   WHEN lc.cursor_id = lc.leaf_id
                     THEN 1   -- direct on leaf
                   WHEN lc.job_name_lc IS NOT NULL
                        AND LOWER(COALESCE(te.job_title, '')) = lc.job_name_lc
                     THEN 2   -- exact job_title match
                   WHEN lc.has_job
                        AND lc.cursor_id <> lc.leaf_id
                        AND alc.leaves_with_job = 1
                     THEN 3   -- sole-leaf fallback
                   WHEN lc.job_name_lc IS NOT NULL
                        AND (LOWER(COALESCE(te.job_title, '')) LIKE ('%' || lc.job_name_lc || '%')
                             OR lc.job_name_lc LIKE ('%' || LOWER(COALESCE(te.job_title, '')) || '%'))
                        AND COALESCE(te.job_title, '') <> ''
                     THEN 4   -- substring near-miss
                   ELSE NULL
                 END AS priority
          FROM leaf_ctx lc
          JOIN time_entries te ON te.project_id = lc.cursor_id
          LEFT JOIN ancestor_leaf_counts alc ON alc.ancestor_id = lc.cursor_id
          WHERE te.entry_date BETWEEN $2 AND $3
        ),
        -- Keep exactly one attribution per entry_id (lowest priority wins;
        -- ties broken by leaf_id for determinism).
        best_attr AS (
          SELECT DISTINCT ON (entry_id)
                 entry_id, leaf_id, hours, staff_id
          FROM raw_attr
          WHERE priority IS NOT NULL
          ORDER BY entry_id, priority ASC, leaf_id ASC
        ),
        leaf_hours AS (
          SELECT leaf_id,
                 SUM(hours)::float AS hours,
                 COUNT(DISTINCT staff_id)::int AS inspector_count
          FROM best_attr
          GROUP BY leaf_id
        )
        SELECT * FROM leaf_hours
      `, [leafIds, startDate, endDate]);
      const hoursById = new Map(hoursRows.map(r => [r.leaf_id, r]));

      // Compose display data + revenue per project.
      const result = [];
      for (const p of projects) {
        const lh = hoursById.get(p.id) || { hours: 0, inspector_count: 0 };
        const hours = parseFloat(lh.hours) || 0;
        const inspectorCount = lh.inspector_count || 0;

        // Same hide-empty rule as before, but now driven by the
        // ancestor-aware hours number so a leaf whose only entries
        // sit on a parent rollup still surfaces.
        if (hours === 0 && !p.is_ongoing && !p.is_permitting && p.status !== 'active' && !statusFilter) continue;

        const rate = parseFloat(p.billing_rate) || parseFloat(p.job_rate) || 90;
        const revenue = (p.billing_type === 'footage' || p.job_billing_type === 'footage')
          ? 0
          : hours * rate;

        // Display name: "Area (WO#) - Job". Falls back gracefully when
        // any of the three pieces is missing.
        const area = p.resolved_area || (p.parent_level === 'service_area' ? p.parent_name : null);
        const wo   = p.resolved_wo || null;
        const job  = p.job_name || null;
        let display_name;
        if (area && job) {
          display_name = wo ? `${area} (${wo}) - ${job}` : `${area} - ${job}`;
        } else if (area) {
          display_name = wo ? `${area} (${wo})` : area;
        } else if (job) {
          display_name = wo ? `${p.name} (${wo}) - ${job}` : `${p.name} - ${job}`;
        } else {
          display_name = p.name;
        }

        result.push({
          ...p,
          period: { start: startDate, end: endDate, mode: period, label: monthYear || null },
          hours_in_period: hours,
          revenue_in_period: revenue,
          inspectors_in_period: inspectorCount,
          service_area: area,
          display_name,
          contract_label: p.contract_label || p.contract_number || null,
        });
      }

      const totals = result.reduce((acc, p) => {
        acc.hours += p.hours_in_period;
        acc.revenue += p.revenue_in_period;
        if (p.status === 'active' || p.is_ongoing) acc.active_projects++;
        return acc;
      }, { hours: 0, revenue: 0, active_projects: 0 });

      // Inspector count = distinct staff_ids with any time in the period
      // across these leaves' attributed hours. Reuses the same ancestor-
      // walking idea, just at the aggregate level.
      const projectIds = result.map(r => r.id);
      let inspectorCount = 0;
      if (projectIds.length) {
        const { rows: ic } = await pool.query(`
          WITH RECURSIVE
          leaf_ctx AS (
            SELECT p.id AS leaf_id, p.id AS cursor_id, p.parent_id,
                   LOWER(j.name) AS job_name_lc, p.job_id IS NOT NULL AS has_job,
                   0 AS depth
            FROM projects p
            LEFT JOIN jobs j ON j.id = p.job_id
            WHERE p.id = ANY($1::uuid[])
            UNION ALL
            SELECT lc.leaf_id, p.id, p.parent_id, lc.job_name_lc, lc.has_job,
                   lc.depth + 1
            FROM leaf_ctx lc
            JOIN projects p ON p.id = lc.parent_id
            WHERE lc.depth < 10
          ),
          ancestor_leaf_counts AS (
            SELECT cursor_id AS ancestor_id,
                   COUNT(DISTINCT CASE WHEN has_job THEN leaf_id END)::int AS leaves_with_job
            FROM leaf_ctx
            WHERE cursor_id <> leaf_id
            GROUP BY cursor_id
          ),
          raw_attr AS (
            SELECT te.id AS entry_id, te.staff_id,
                   CASE
                     WHEN lc.cursor_id = lc.leaf_id THEN 1
                     WHEN lc.job_name_lc IS NOT NULL
                          AND LOWER(COALESCE(te.job_title, '')) = lc.job_name_lc THEN 2
                     WHEN lc.has_job AND lc.cursor_id <> lc.leaf_id
                          AND alc.leaves_with_job = 1 THEN 3
                     WHEN lc.job_name_lc IS NOT NULL
                          AND (LOWER(COALESCE(te.job_title, '')) LIKE ('%' || lc.job_name_lc || '%')
                               OR lc.job_name_lc LIKE ('%' || LOWER(COALESCE(te.job_title, '')) || '%'))
                          AND COALESCE(te.job_title, '') <> '' THEN 4
                     ELSE NULL
                   END AS priority
            FROM leaf_ctx lc
            JOIN time_entries te ON te.project_id = lc.cursor_id
            LEFT JOIN ancestor_leaf_counts alc ON alc.ancestor_id = lc.cursor_id
            WHERE te.entry_date BETWEEN $2 AND $3
              AND te.staff_id IS NOT NULL
          ),
          best_attr AS (
            SELECT DISTINCT ON (entry_id) entry_id, staff_id
            FROM raw_attr
            WHERE priority IS NOT NULL
            ORDER BY entry_id, priority ASC
          )
          SELECT COUNT(DISTINCT staff_id)::int AS n FROM best_attr
        `, [projectIds, startDate, endDate]);
        inspectorCount = ic[0].n || 0;
      }

      res.json({
        period: { start: startDate, end: endDate, mode: period, label: monthYear || null },
        totals: { ...totals, inspector_count: inspectorCount },
        projects: result,
      });
    } catch (e) {
      console.error('[inspection:GET /api/inspection]', e && e.message);
      res.status(500).json({ error: 'Failed to load inspection data.' });
    }
  });
};
