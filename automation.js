// ═══════════════════════════════════════════════════════════════════════════
// automation.js
//
// Server-side automation hub. Two pieces:
//
//   1. installAutomationRoutes(app, pool, { requireAdmin, requireManagerOrAdmin })
//      Registers /api/automation/* JSON endpoints that surface "things that
//      need attention" so the frontend (or a future cron / email job) can
//      show them to the right person.
//
//   2. startScheduler(pool)
//      A simple in-process scheduler (setInterval — no Redis, no queue).
//      Runs the same checks the endpoints expose, logs surprises to the
//      Railway log. Single-instance friendly. If we ever scale horizontally,
//      this needs a "leader election" guard so the jobs only run on one
//      pod, but at one instance the worst case is duplicate logs.
//
// IMPORTANT — design constraint from CLAUDE.md:
//   "Billing correctness > billing features."
//   "Don't ship a half-working invoicing flow."
// So nothing here AUTO-COMMITS invoices, AUTO-SENDS email, or AUTO-MARKS
// permits as billed. Every action surfaces a draft / candidate list that
// admin reviews and then triggers the existing manual flow. The automation
// catches the things the admin would otherwise have to remember.
// ═══════════════════════════════════════════════════════════════════════════

// Stale-permit threshold (days) — a permit sitting in 'submitted' longer
// than this is flagged for follow-up. PSC permits typically come back in
// 14–30 days; 30 days is a reasonable "should I be poking the agency" line.
const DEFAULT_STALE_DAYS = 30;
// Budget-burn threshold — alert when a budget code passes this fraction of
// allocated. 0.8 = 80%.
const DEFAULT_BURN_THRESHOLD = 0.8;
// How often the in-process scheduler ticks. Each task decides for itself
// whether enough time has elapsed since its last run to actually do work.
const SCHEDULER_TICK_MS = 60 * 60 * 1000;  // 1 hour
const DAILY_MS = 24 * 60 * 60 * 1000;

// Format a JS Date as the business-local YYYY-MM-DD. Mirrors timeclock_module
// — kept private here so this file stays standalone.
const BUSINESS_TZ = process.env.BUSINESS_TZ || 'America/Chicago';
function dateInBusinessTz(d) {
  const date = d instanceof Date ? d : new Date(d);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

// ─── DATA QUERIES ──────────────────────────────────────────────────────────
// All return plain objects/arrays — used by both the HTTP routes and the
// scheduler. Pure data, no side effects.

// Yesterday-or-given-day digest: hours logged, projects touched, $ billed,
// permit advances. The point is one paragraph an owner can read in 10s.
async function buildDigest(pool, dateStr) {
  const day = dateStr || dateInBusinessTz(new Date(Date.now() - DAILY_MS));

  const [hoursR, projectsR, billedR, permitsR, openSessionsR] = await Promise.all([
    pool.query(
      `SELECT COALESCE(SUM(hours), 0)::float AS total_hours,
              COUNT(*)::int AS entry_count
       FROM time_entries WHERE entry_date = $1`,
      [day]
    ),
    pool.query(
      `SELECT COUNT(DISTINCT project_id)::int AS projects_touched
       FROM time_entries WHERE entry_date = $1`,
      [day]
    ),
    pool.query(
      `SELECT COALESCE(SUM(total_amount), 0)::float AS billed,
              COUNT(*)::int AS invoice_count
       FROM invoices WHERE invoice_date = $1`,
      [day]
    ),
    pool.query(
      `SELECT stage, COUNT(*)::int AS n
       FROM permit_stages
       WHERE completed_at::date = $1
       GROUP BY stage`,
      [day]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS n
       FROM time_clock_sessions WHERE forgot_clock_out = TRUE AND ended_at::date = $1`,
      [day]
    ),
  ]);

  return {
    date: day,
    business_tz: BUSINESS_TZ,
    hours: hoursR.rows[0],
    projects_touched: projectsR.rows[0].projects_touched,
    billed: billedR.rows[0],
    permits_advanced: permitsR.rows.reduce((acc, r) => { acc[r.stage] = r.n; return acc; }, {}),
    timeclock_flags: { needs_review: openSessionsR.rows[0].n },
  };
}

// Permits that have been sitting in `submitted` (or any caller-specified
// stage) longer than `days`. Joined with project + client so the UI / log
// has enough to act on without follow-up queries.
async function findStalePermits(pool, days = DEFAULT_STALE_DAYS, stage = 'submitted') {
  const { rows } = await pool.query(
    `SELECT
       p.id AS project_id,
       p.name AS project_name,
       p.work_order_number,
       cl.name AS client_name,
       ps.stage,
       ps.created_at AS stage_started,
       EXTRACT(EPOCH FROM (NOW() - ps.created_at))::int / 86400 AS days_in_stage,
       ps.updated_by
     FROM permit_stages ps
     JOIN projects p ON p.id = ps.project_id
     LEFT JOIN clients cl ON cl.id = p.client_id
     WHERE ps.stage = $1
       AND ps.completed_at IS NULL
       AND ps.created_at < NOW() - ($2 || ' days')::interval
     ORDER BY ps.created_at ASC`,
    [stage, String(days)]
  );
  return rows;
}

// Budget codes that have crossed the burn threshold (e.g. 80% of allocated
// has been billed). Helps catch projects about to overrun before they do.
async function findBudgetBurn(pool, threshold = DEFAULT_BURN_THRESHOLD) {
  const { rows } = await pool.query(
    `SELECT
       bc.id AS budget_code_id,
       bc.code,
       bc.description,
       bc.allocated_amount::float AS allocated,
       COALESCE(SUM(ii.amount), 0)::float AS billed,
       CASE WHEN bc.allocated_amount > 0
            THEN COALESCE(SUM(ii.amount), 0) / bc.allocated_amount
            ELSE NULL END AS burn_ratio,
       b.id AS budget_id,
       b.name AS budget_name,
       p.id AS project_id,
       p.name AS project_name
     FROM budget_codes bc
     LEFT JOIN budgets b ON b.id = bc.budget_id
     LEFT JOIN projects p ON p.id = b.project_id
     LEFT JOIN invoice_items ii ON ii.project_id = p.id
     WHERE bc.allocated_amount > 0
     GROUP BY bc.id, bc.code, bc.description, bc.allocated_amount,
              b.id, b.name, p.id, p.name
     HAVING COALESCE(SUM(ii.amount), 0) / bc.allocated_amount >= $1
     ORDER BY burn_ratio DESC`,
    [threshold]
  );
  return rows;
}

// Permits that hit the final 'billed' stage but were never actually
// invoiced — i.e. project_type='permitting' projects with no invoice_item
// referencing them. Catches the "permit got marked billed in the pipeline
// but no one created the invoice" hand-off gap.
async function findPermitsAwaitingInvoice(pool) {
  const { rows } = await pool.query(
    `SELECT
       p.id AS project_id,
       p.name AS project_name,
       p.client_id,
       cl.name AS client_name,
       p.expected_revenue::float AS expected_revenue,
       ps.created_at AS marked_billed_at
     FROM projects p
     JOIN permit_stages ps ON ps.project_id = p.id AND ps.stage = 'billed' AND ps.completed_at IS NULL
     LEFT JOIN clients cl ON cl.id = p.client_id
     LEFT JOIN invoice_items ii ON ii.project_id = p.id
     WHERE ii.id IS NULL
     ORDER BY ps.created_at ASC`
  );
  return rows;
}

// PSC RUS revenue projection — UMBRELLA-FIRST, all PSC RUS jobs.
//
// Returns one row per engineering_contract umbrella under any PSC RUS
// client (cl.is_rus = TRUE). Each row carries:
//   - top-level totals (umbrella name, projected_remaining_revenue, MTD
//     hours, billed_to_date, budget if any)
//   - a per-job breakdown (Inspection / RE / Permitting / Other) with
//     each job's own MTD hours and projected remainder
//
// Projection methodology by job type:
//   - Inspection + Resident Engineer (hourly):
//       avg_weekly_hours = hours_in_lookback / lookback_weeks
//       pace_revenue = avg_weekly_hours * horizon_weeks * weighted_rate
//       cap by remaining umbrella budget if one is set
//   - Permitting (footage / mileage):
//       projection = sum(expected_revenue) - sum(billed_to_date)
//       (no pace — permitting revenue is fixed-scope by footage)
//   - Other PSC RUS jobs (Design, etc.): listed in the breakdown so the
//     admin sees them, but projected_remaining_revenue = 0 (cannot be
//     reliably forecast from existing data).
//
// `month_to_date_hours` is hours logged THIS calendar month, used for
// the displayed hours breakdown — the lookback window (separate concept)
// drives the pace math.
async function buildPscRusProjection(pool, opts) {
  const lookbackWeeks = (opts && opts.lookbackWeeks) || 8;
  const horizonWeeks  = (opts && opts.horizonWeeks)  || 13;   // ~90 days

  // ── 1. Pull every active project under a PSC RUS client ─────────────
  // Includes all jobs (Inspection, RE, Permitting, Design, Other) —
  // we'll bucket by job team in JS for the breakdown.
  const { rows: projects } = await pool.query(
    `SELECT p.id, p.name, p.client_id, p.contract_id,
            p.billing_rate::float AS billing_rate,
            p.billing_type,
            p.actual_hours::float AS actual_hours,
            p.footage::float AS footage,
            p.expected_revenue::float AS expected_revenue,
            p.status,
            cl.name AS client_name,
            j.name AS job_name,
            j.team AS job_team,
            j.is_permitting,
            j.default_billing_type AS job_billing_type,
            c.engineering_contract_id,
            ec.name AS engineering_contract_name,
            ec.contract_number AS engineering_contract_number,
            ec.loan_name AS loan_name
       FROM projects p
       LEFT JOIN clients cl ON cl.id = p.client_id
       LEFT JOIN jobs j ON j.id = p.job_id
       LEFT JOIN contracts c ON c.id = p.contract_id
       LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
      WHERE cl.is_rus = TRUE
        AND p.status IN ('active', 'billed')
        AND COALESCE(p.is_rollup, FALSE) = FALSE
        AND c.engineering_contract_id IS NOT NULL`
  );

  if (!projects.length) {
    return {
      lookback_weeks: lookbackWeeks,
      horizon_weeks: horizonWeeks,
      total_projected_revenue: 0,
      umbrella_count: 0,
      rows: [],
    };
  }

  const projectIds = projects.map(p => p.id);

  // ── 2. Lookback hours (drives pace) ─────────────────────────────────
  const { rows: lookbackRows } = await pool.query(
    `SELECT project_id, COALESCE(SUM(hours), 0)::float AS hours
       FROM time_entries
      WHERE entry_date >= (CURRENT_DATE - ($1 || ' weeks')::interval)
        AND project_id = ANY($2::uuid[])
      GROUP BY project_id`,
    [String(lookbackWeeks), projectIds]
  );
  const lookbackByProject = Object.fromEntries(lookbackRows.map(r => [r.project_id, r.hours]));

  // ── 3. Month-to-date hours (displayed) ──────────────────────────────
  const { rows: mtdRows } = await pool.query(
    `SELECT project_id, COALESCE(SUM(hours), 0)::float AS hours
       FROM time_entries
      WHERE entry_date >= date_trunc('month', CURRENT_DATE)
        AND project_id = ANY($1::uuid[])
      GROUP BY project_id`,
    [projectIds]
  );
  const mtdByProject = Object.fromEntries(mtdRows.map(r => [r.project_id, r.hours]));

  // ── 4. Billed-to-date per project ───────────────────────────────────
  const { rows: billedRows } = await pool.query(
    `SELECT project_id, COALESCE(SUM(amount), 0)::float AS billed
       FROM invoice_items
      WHERE project_id = ANY($1::uuid[])
      GROUP BY project_id`,
    [projectIds]
  );
  const billedByProject = Object.fromEntries(billedRows.map(r => [r.project_id, r.billed]));

  // ── 5. Engineering-contract-level budgets ──────────────────────────
  const { rows: ecBudgetRows } = await pool.query(
    `SELECT b.engineering_contract_id,
            COALESCE(SUM(bc.allocated_amount), 0)::float AS budget_allocated
       FROM budgets b
       LEFT JOIN budget_codes bc ON bc.budget_id = b.id
      WHERE b.engineering_contract_id IS NOT NULL
      GROUP BY b.engineering_contract_id`
  );
  const ecBudget = Object.fromEntries(
    ecBudgetRows.map(r => [r.engineering_contract_id, r.budget_allocated])
  );

  // ── 6. Bucket projects into umbrellas → job teams ──────────────────
  function jobBucket(p) {
    if (p.is_permitting) return 'permitting';
    if (p.job_team === 'inspection') return 'inspection';
    const n = (p.job_name || '').toLowerCase();
    if (n.includes('resident eng') || n === 're') return 're';
    if (n.includes('inspect')) return 'inspection';
    if (n.includes('permit')) return 'permitting';
    return 'other';
  }
  const BUCKET_LABELS = {
    inspection: 'Inspection',
    re: 'Resident Engineer',
    permitting: 'Permitting',
    other: 'Other',
  };
  // Buckets that get a real projection number. Everything else lists in
  // the breakdown but contributes 0 to the projection total.
  const PROJECTABLE = new Set(['inspection', 're', 'permitting']);

  const umbrellas = new Map();   // ec_id → { meta, projects[] }
  for (const p of projects) {
    const ecId = p.engineering_contract_id;
    if (!umbrellas.has(ecId)) {
      umbrellas.set(ecId, {
        engineering_contract_id: ecId,
        engineering_contract_name: p.engineering_contract_name,
        engineering_contract_number: p.engineering_contract_number,
        loan_name: p.loan_name,
        client_id: p.client_id,
        client_name: p.client_name,
        budget_allocated: ecBudget[ecId] || 0,
        projects: [],
      });
    }
    umbrellas.get(ecId).projects.push(p);
  }

  // ── 7. Per-umbrella projection ──────────────────────────────────────
  const out = [];
  let grandTotalProjected = 0;

  for (const u of umbrellas.values()) {
    const buckets = { inspection: [], re: [], permitting: [], other: [] };
    for (const p of u.projects) buckets[jobBucket(p)].push(p);

    let umbrellaProjected = 0;
    let umbrellaBilled = 0;
    let umbrellaMtdHours = 0;
    const breakdown = [];

    for (const bucketKey of ['inspection', 're', 'permitting', 'other']) {
      const bucketProjects = buckets[bucketKey];
      if (!bucketProjects.length) continue;

      const bucketBilled = bucketProjects.reduce(
        (s, p) => s + (billedByProject[p.id] || 0), 0);
      const bucketMtd = bucketProjects.reduce(
        (s, p) => s + (mtdByProject[p.id] || 0), 0);
      umbrellaBilled += bucketBilled;
      umbrellaMtdHours += bucketMtd;

      let bucketProjection = 0;

      if (bucketKey === 'permitting') {
        // Footage projection = expected_revenue - billed_to_date,
        // summed across permitting projects in this umbrella.
        const expected = bucketProjects.reduce(
          (s, p) => s + (p.expected_revenue || 0), 0);
        bucketProjection = Math.max(0, expected - bucketBilled);
      } else if (bucketKey === 'inspection' || bucketKey === 're') {
        // Pace × horizon × weighted rate, weighted by lookback hours.
        let totalLookbackHrs = 0;
        let weightedRateNumerator = 0;
        for (const p of bucketProjects) {
          const h = lookbackByProject[p.id] || 0;
          totalLookbackHrs += h;
          weightedRateNumerator += (p.billing_rate || 0) * h;
        }
        let rate = 0;
        if (totalLookbackHrs > 0) {
          rate = weightedRateNumerator / totalLookbackHrs;
        } else {
          // Fall back to simple average rate so we still project rate
          // correctly even if no hours were logged in the lookback.
          const rates = bucketProjects.map(p => p.billing_rate || 0).filter(r => r > 0);
          if (rates.length) rate = rates.reduce((s, r) => s + r, 0) / rates.length;
        }
        const avgWeekly = lookbackWeeks > 0 ? totalLookbackHrs / lookbackWeeks : 0;
        bucketProjection = avgWeekly * horizonWeeks * rate;
      }
      // 'other' bucket contributes 0 — we don't pretend to forecast it.

      breakdown.push({
        job_bucket: bucketKey,
        job_label: BUCKET_LABELS[bucketKey],
        project_count: bucketProjects.length,
        project_names: bucketProjects.map(p => p.name),
        mtd_hours: +bucketMtd.toFixed(2),
        billed_to_date: +bucketBilled.toFixed(2),
        projected_remaining_revenue: +bucketProjection.toFixed(2),
        projectable: PROJECTABLE.has(bucketKey),
      });
      umbrellaProjected += bucketProjection;
    }

    // Cap umbrella total by remaining umbrella budget when one is set.
    const budgetRemaining = u.budget_allocated > 0
      ? Math.max(0, u.budget_allocated - umbrellaBilled) : null;
    const willExhaust = budgetRemaining != null && umbrellaProjected >= budgetRemaining;
    if (budgetRemaining != null && umbrellaProjected > budgetRemaining) {
      umbrellaProjected = budgetRemaining;
    }

    grandTotalProjected += umbrellaProjected;
    out.push({
      level: 'umbrella',
      engineering_contract_id: u.engineering_contract_id,
      engineering_contract_name: u.engineering_contract_name,
      engineering_contract_number: u.engineering_contract_number,
      loan_name: u.loan_name,
      client_id: u.client_id,
      client_name: u.client_name,
      project_count: u.projects.length,
      child_project_names: u.projects.map(p => p.name),
      budget_allocated: +u.budget_allocated.toFixed(2),
      billed_to_date: +umbrellaBilled.toFixed(2),
      budget_remaining: budgetRemaining != null ? +budgetRemaining.toFixed(2) : null,
      mtd_hours: +umbrellaMtdHours.toFixed(2),
      projected_remaining_revenue: +umbrellaProjected.toFixed(2),
      will_exhaust_budget: willExhaust,
      breakdown,
    });
  }

  // Sort by projection size descending (biggest opportunity at top).
  out.sort((a, b) => b.projected_remaining_revenue - a.projected_remaining_revenue);

  return {
    lookback_weeks: lookbackWeeks,
    horizon_weeks: horizonWeeks,
    horizon_days: horizonWeeks * 7,
    umbrella_count: umbrellas.size,
    total_projected_revenue: +grandTotalProjected.toFixed(2),
    rows: out,
  };
}

// Inspection revenue projection — UMBRELLA-FIRST.
//
// The data model now allows a budget to attach at the engineering_contract
// level (e.g. "RUS 217 Engineering Contract" covering contracts 515-3,
// 515-4, 515-5). When that's the case, the inspection budget covers ALL
// projects under ALL child contracts in aggregate — it's not split
// per-project. The projection MUST respect that:
//
//   - For each engineering_contract umbrella that has a budget AND has at
//     least one inspection project underneath: roll up across the whole
//     umbrella. ONE row in the output. Pace = sum(recent hours) / lookback,
//     billed_to_date = sum across all child projects, budget = the
//     umbrella's budget. Projection capped by remaining umbrella budget.
//
//   - Projects whose contract has NO engineering_contract OR whose
//     engineering_contract has no budget: fall back to per-project mode
//     (the original behavior). Each gets its own row keyed by project_id.
//
// Output rows have a `level` field = 'umbrella' | 'project' so the UI can
// render them differently. Admin-only data — never exposed below admin.
//
// Math (same per row regardless of level):
//   avg_weekly_hours = hours_last_n_weeks / lookback
//   pace_hours = avg_weekly_hours × horizon_weeks
//   budget_remaining = max(0, budget_allocated - billed_to_date)
//   budget_hours = budget_remaining / weighted_rate
//   projected_remaining_hours = min(pace_hours, budget_hours) — or pace
//                               alone when there's no budget cap
//   projected_remaining_revenue = projected_remaining_hours × weighted_rate
//
// weighted_rate handles the umbrella case where projects under it might
// have different billing_rates (Resident Engineer at $100, Inspection at
// $90). We weight by recent hours so the rate reflects what's actually
// being billed.
async function buildInspectionRevenueProjection(pool, opts) {
  const lookbackWeeks = (opts && opts.lookbackWeeks) || 8;
  const horizonWeeks  = (opts && opts.horizonWeeks)  || 26;

  // One row per inspection project, with its umbrella info attached.
  // We then group by umbrella in JS — cleaner than nested CTEs and easier
  // to reason about.
  const { rows: projectRows } = await pool.query(
    `WITH inspection_projects AS (
       SELECT p.id, p.name, p.client_id, p.contract_id,
              p.billing_rate::float AS billing_rate,
              p.billing_type,
              p.actual_hours::float AS actual_hours,
              cl.name AS client_name,
              j.name AS job_name,
              c.engineering_contract_id,
              ec.name AS engineering_contract_name
         FROM projects p
         LEFT JOIN clients cl ON cl.id = p.client_id
         LEFT JOIN jobs j ON j.id = p.job_id
         LEFT JOIN contracts c ON c.id = p.contract_id
         LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
         WHERE (j.team = 'inspection' OR p.project_type = 'inspection')
           AND p.status IN ('active', 'billed')
           AND COALESCE(p.is_rollup, FALSE) = FALSE
     ),
     recent_hours AS (
       -- Weighted-recency variant: weight = MAX(1 - age_in_weeks /
       -- lookback, 0.2). Recent weeks count fully (1.0); the oldest
       -- week in the window contributes ~20% and entries before the
       -- window contribute 0. Plain SUM stays available as
       -- hours_recent_unweighted for backward-compat checks.
       SELECT te.project_id,
              COALESCE(SUM(te.hours), 0)::float AS hours_recent_unweighted,
              COALESCE(SUM(
                te.hours *
                GREATEST(
                  0.2,
                  1.0 - (
                    EXTRACT(EPOCH FROM (CURRENT_DATE - te.entry_date)) / 86400.0 / 7.0
                  ) / NULLIF($1::float, 0)
                )
              ), 0)::float AS hours_recent
         FROM time_entries te
         WHERE te.entry_date >= (CURRENT_DATE - ($1 || ' weeks')::interval)
         GROUP BY te.project_id
     ),
     billed_to_date AS (
       SELECT ii.project_id, COALESCE(SUM(ii.amount), 0)::float AS billed
         FROM invoice_items ii GROUP BY ii.project_id
     ),
     project_budget AS (
       SELECT b.project_id, COALESCE(SUM(bc.allocated_amount), 0)::float AS budget_allocated
         FROM budgets b
         LEFT JOIN budget_codes bc ON bc.budget_id = b.id
         WHERE b.project_id IS NOT NULL
         GROUP BY b.project_id
     )
     SELECT ip.*,
            COALESCE(rh.hours_recent, 0) AS hours_recent,
            COALESCE(btd.billed, 0) AS billed_to_date,
            COALESCE(pb.budget_allocated, 0) AS project_budget_allocated
       FROM inspection_projects ip
       LEFT JOIN recent_hours rh ON rh.project_id = ip.id
       LEFT JOIN billed_to_date btd ON btd.project_id = ip.id
       LEFT JOIN project_budget pb ON pb.project_id = ip.id`,
    [String(lookbackWeeks)]
  );

  // Engineering-contract-level budgets (aggregated across budget_codes).
  // Returned as a map keyed by engineering_contract_id for fast lookup
  // when grouping projects below.
  const { rows: ecBudgetRows } = await pool.query(
    `SELECT b.engineering_contract_id,
            COALESCE(SUM(bc.allocated_amount), 0)::float AS budget_allocated
       FROM budgets b
       LEFT JOIN budget_codes bc ON bc.budget_id = b.id
       WHERE b.engineering_contract_id IS NOT NULL
       GROUP BY b.engineering_contract_id`
  );
  const ecBudget = Object.fromEntries(
    ecBudgetRows.map(r => [r.engineering_contract_id, r.budget_allocated])
  );

  // Group: projects whose engineering_contract has a budget go into umbrella
  // buckets. Everything else stays per-project.
  const umbrellas = new Map();           // ec_id → { meta, projects[] }
  const standaloneProjects = [];          // projects with no umbrella budget
  for (const p of projectRows) {
    const ecId = p.engineering_contract_id;
    if (ecId && ecBudget[ecId] != null) {
      if (!umbrellas.has(ecId)) {
        umbrellas.set(ecId, {
          engineering_contract_id: ecId,
          engineering_contract_name: p.engineering_contract_name,
          client_id: p.client_id,
          client_name: p.client_name,
          budget_allocated: ecBudget[ecId],
          projects: [],
        });
      }
      umbrellas.get(ecId).projects.push(p);
    } else {
      standaloneProjects.push(p);
    }
  }

  // ─── Per-row projection math ─────────────────────────────────────────
  function computeRow(input) {
    // Inputs:
    //   weighted_rate  — $/hr to apply (avg if multiple projects)
    //   hours_recent   — sum of hours in lookback window
    //   billed_to_date — $ billed against this scope so far
    //   budget_allocated — $ budget cap for this scope (0 = none)
    const { weighted_rate, hours_recent, billed_to_date, budget_allocated } = input;
    const avgWeekly = lookbackWeeks > 0 ? hours_recent / lookbackWeeks : 0;
    const paceHours = avgWeekly * horizonWeeks;
    const budgetRemaining = Math.max(0, budget_allocated - billed_to_date);
    const budgetHours = weighted_rate > 0 ? budgetRemaining / weighted_rate : Infinity;
    const projHours = budget_allocated > 0
      ? Math.min(paceHours, budgetHours)
      : paceHours;
    const projRevenue = projHours * weighted_rate;
    return {
      avg_weekly_hours: +avgWeekly.toFixed(2),
      budget_remaining: +budgetRemaining.toFixed(2),
      projected_remaining_hours: +projHours.toFixed(1),
      projected_remaining_revenue: +projRevenue.toFixed(2),
      will_exhaust_budget: budget_allocated > 0 && paceHours >= budgetHours,
    };
  }

  function weightedRate(projects) {
    // Weight billing_rate by recent hours; fall back to simple average,
    // then to first project's rate. Prevents a project that hasn't logged
    // hours from skewing the umbrella rate.
    let totalHrs = 0, weighted = 0;
    for (const p of projects) {
      totalHrs += p.hours_recent;
      weighted += (p.billing_rate || 0) * p.hours_recent;
    }
    if (totalHrs > 0) return weighted / totalHrs;
    const rates = projects.map(p => p.billing_rate || 0).filter(r => r > 0);
    if (!rates.length) return 0;
    return rates.reduce((s, r) => s + r, 0) / rates.length;
  }

  let totalProjected = 0;
  const out = [];

  // Umbrella rows (one per engineering_contract with a budget)
  for (const u of umbrellas.values()) {
    const hoursRecent = u.projects.reduce((s, p) => s + p.hours_recent, 0);
    const billedToDate = u.projects.reduce((s, p) => s + p.billed_to_date, 0);
    const actualHours = u.projects.reduce((s, p) => s + p.actual_hours, 0);
    const rate = weightedRate(u.projects);
    const computed = computeRow({
      weighted_rate: rate,
      hours_recent: hoursRecent,
      billed_to_date: billedToDate,
      budget_allocated: u.budget_allocated,
    });
    totalProjected += computed.projected_remaining_revenue;
    out.push({
      level: 'umbrella',
      engineering_contract_id: u.engineering_contract_id,
      engineering_contract_name: u.engineering_contract_name,
      client_id: u.client_id,
      client_name: u.client_name,
      project_count: u.projects.length,
      // Names of constituent projects so the UI can preview without expand
      child_project_names: u.projects.map(p => p.name),
      // Aggregates
      weighted_billing_rate: +rate.toFixed(2),
      actual_hours: +actualHours.toFixed(2),
      hours_last_n_weeks: +hoursRecent.toFixed(2),
      budget_allocated: +u.budget_allocated.toFixed(2),
      billed_to_date: +billedToDate.toFixed(2),
      ...computed,
    });
  }

  // Standalone project rows (no umbrella with a budget)
  for (const p of standaloneProjects) {
    const computed = computeRow({
      weighted_rate: p.billing_rate || 0,
      hours_recent: p.hours_recent,
      billed_to_date: p.billed_to_date,
      budget_allocated: p.project_budget_allocated,
    });
    totalProjected += computed.projected_remaining_revenue;
    out.push({
      level: 'project',
      project_id: p.id,
      project_name: p.name,
      client_id: p.client_id,
      client_name: p.client_name,
      job_name: p.job_name,
      // Surface the umbrella name even when the budget isn't there yet,
      // so admin can see "this is part of RUS 217 but RUS 217 has no budget yet"
      engineering_contract_id: p.engineering_contract_id || null,
      engineering_contract_name: p.engineering_contract_name || null,
      billing_rate: p.billing_rate || 0,
      actual_hours: p.actual_hours,
      hours_last_n_weeks: p.hours_recent,
      budget_allocated: p.project_budget_allocated,
      billed_to_date: p.billed_to_date,
      ...computed,
    });
  }

  // Sort: umbrellas first (highest projected first), then standalone projects.
  out.sort((a, b) => {
    if (a.level !== b.level) return a.level === 'umbrella' ? -1 : 1;
    return b.projected_remaining_revenue - a.projected_remaining_revenue;
  });

  return {
    lookback_weeks: lookbackWeeks,
    horizon_weeks: horizonWeeks,
    umbrella_count: umbrellas.size,
    standalone_project_count: standaloneProjects.length,
    total_projected_revenue: +totalProjected.toFixed(2),
    rows: out,
    // Backwards-compat: the previous shape had `projects` and `project_count`.
    // Frontend that hasn't been updated yet still works (just won't see
    // umbrella aggregation).
    project_count: standaloneProjects.length + umbrellas.size,
    projects: out,
  };
}

// "What if I billed today?" — preview of revenue if every unbilled hour
// were invoiced right now at current rates. Sums:
//   - Hourly projects: unbilled_hours × billing_rate
//   - Footage projects: expected_revenue for any project not yet billed
// Grouped by client so admin can see "if I closed the books today, here's
// what each client would owe." Unlike the monthly draft, this ignores
// billing_cadence — every dollar of work-done-but-not-billed counts.
async function buildBillNowPreview(pool) {
  const { rows } = await pool.query(
    `WITH unbilled_hourly AS (
       SELECT
         p.id AS project_id,
         p.name AS project_name,
         p.client_id,
         cl.name AS client_name,
         p.billing_rate::float AS rate,
         COALESCE(p.actual_hours, 0)::float AS hours_done,
         COALESCE((
           SELECT SUM(ii.amount)
           FROM invoice_items ii
           WHERE ii.project_id = p.id
         ), 0)::float AS already_billed,
         COALESCE(p.actual_hours, 0)::float * COALESCE(p.billing_rate, 0)::float AS earned,
         (COALESCE(p.actual_hours, 0)::float * COALESCE(p.billing_rate, 0)::float)
           - COALESCE((
               SELECT SUM(ii.amount) FROM invoice_items ii WHERE ii.project_id = p.id
             ), 0)::float AS unbilled_amount
       FROM projects p
       LEFT JOIN clients cl ON cl.id = p.client_id
       WHERE p.billing_type = 'hourly'
         AND p.status IN ('active', 'completed')
         AND COALESCE(p.is_rollup, FALSE) = FALSE
         AND COALESCE(p.actual_hours, 0) > 0
         AND COALESCE(p.billing_rate, 0) > 0
     ),
     unbilled_footage AS (
       SELECT
         p.id AS project_id,
         p.name AS project_name,
         p.client_id,
         cl.name AS client_name,
         p.billing_rate::float AS rate,
         0::float AS hours_done,
         0::float AS already_billed,
         COALESCE(p.expected_revenue, 0)::float AS earned,
         COALESCE(p.expected_revenue, 0)::float AS unbilled_amount
       FROM projects p
       LEFT JOIN clients cl ON cl.id = p.client_id
       WHERE p.billing_type = 'footage'
         AND p.status = 'completed'
         AND p.billed_date IS NULL
         AND COALESCE(p.is_rollup, FALSE) = FALSE
     )
     SELECT * FROM unbilled_hourly WHERE unbilled_amount > 0.01
     UNION ALL
     SELECT * FROM unbilled_footage WHERE unbilled_amount > 0.01
     ORDER BY client_name, project_name`
  );

  const byClient = {};
  let total = 0;
  for (const r of rows) {
    const k = r.client_id || 'no-client';
    if (!byClient[k]) byClient[k] = {
      client_id: r.client_id, client_name: r.client_name,
      projects: [], subtotal: 0,
    };
    byClient[k].projects.push(r);
    byClient[k].subtotal += r.unbilled_amount;
    total += r.unbilled_amount;
  }
  return {
    as_of: new Date().toISOString(),
    project_count: rows.length,
    total_unbilled: +total.toFixed(2),
    by_client: Object.values(byClient).sort((a, b) => b.subtotal - a.subtotal),
  };
}

// Build a draft of monthly invoices: every project with billing_cadence='monthly'
// that has hours in the given period and has NOT already been invoiced for
// that period. Returns a "ready to bill" list grouped by client. Admin
// reviews this then calls the existing /api/billing/bill-multiple to commit.
async function buildMonthlyBillingDraft(pool, year, month) {
  // Period bounds in business-tz dates. month is 1-12.
  const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
  // First day of next month, then -1 day computed by Postgres.
  const { rows: pe } = await pool.query(
    `SELECT (DATE $1 + INTERVAL '1 month' - INTERVAL '1 day')::date AS period_end`,
    [periodStart]
  );
  const periodEnd = pe[0].period_end;

  const { rows } = await pool.query(
    `WITH period_hours AS (
       SELECT te.project_id, SUM(te.hours)::float AS hours
       FROM time_entries te
       WHERE te.entry_date BETWEEN $1 AND $2
       GROUP BY te.project_id
     ),
     already_billed AS (
       SELECT DISTINCT ii.project_id
       FROM invoice_items ii
       JOIN invoices i ON i.id = ii.invoice_id
       WHERE i.billing_period_start = $1 AND i.billing_period_end = $2
     )
     SELECT
       p.id AS project_id,
       p.name AS project_name,
       p.work_order_number,
       p.client_id,
       cl.name AS client_name,
       p.billing_rate::float AS billing_rate,
       p.billing_type,
       ph.hours,
       (ph.hours * COALESCE(p.billing_rate, 0))::float AS estimated_revenue
     FROM projects p
     JOIN period_hours ph ON ph.project_id = p.id
     LEFT JOIN clients cl ON cl.id = p.client_id
     WHERE p.billing_cadence = 'monthly'
       AND p.status IN ('active', 'billed')
       AND p.id NOT IN (SELECT project_id FROM already_billed)
     ORDER BY cl.name, p.name`,
    [periodStart, periodEnd]
  );

  // Group by client for the UI to render as one card per invoice.
  const byClient = {};
  let totalEstimated = 0;
  for (const r of rows) {
    const k = r.client_id || 'no-client';
    if (!byClient[k]) byClient[k] = { client_id: r.client_id, client_name: r.client_name, projects: [], subtotal: 0 };
    byClient[k].projects.push(r);
    byClient[k].subtotal += r.estimated_revenue || 0;
    totalEstimated += r.estimated_revenue || 0;
  }

  return {
    period: { year, month, start: periodStart, end: periodEnd },
    project_count: rows.length,
    total_estimated_revenue: totalEstimated,
    by_client: Object.values(byClient),
  };
}

// ─── ROUTES ────────────────────────────────────────────────────────────────
function installAutomationRoutes(app, pool, { requireAdmin, requireManagerOrAdmin }) {
  // Daily digest — admin/manager. ?date=YYYY-MM-DD optional, defaults to
  // yesterday in business tz.
  app.get('/api/automation/digest', requireManagerOrAdmin, async (req, res) => {
    try {
      const date = req.query.date || null;
      res.json(await buildDigest(pool, date));
    } catch (e) {
      console.error('[automation:digest]', e && e.message);
      res.status(500).json({ error: 'Failed to build digest.' });
    }
  });

  // POST /api/automation/digest/send — assemble + email the digest. Recipients
  // come from DIGEST_TO env (comma-separated). Transport is SendGrid v3
  // when SENDGRID_API_KEY is set; otherwise the body is logged to stderr
  // and returned in the response so the operator still has visibility.
  // Adding a real SMTP transport (nodemailer + SMTP_*) is straightforward
  // — the sendDigestEmail helper picks the first configured backend.
  app.post('/api/automation/digest/send', requireAdmin, async (req, res) => {
    try {
      const date = req.body?.date || null;
      const recipients = (req.body?.to || process.env.DIGEST_TO || '')
        .split(',').map(s => s.trim()).filter(Boolean);
      if (!recipients.length) {
        return res.status(400).json({ error: 'No recipients. Pass {to:"a@x,b@y"} or set DIGEST_TO env.' });
      }
      const digest = await buildDigest(pool, date);
      const result = await sendDigestEmail(digest, recipients);
      res.json({ ok: true, ...result, digest });
    } catch (e) {
      console.error('[automation:digest:send]', e && e.message);
      res.status(500).json({ error: 'Failed to send digest: ' + e.message });
    }
  });

  // Stale permits — manager+admin (a permit lead should see their team's lag).
  app.get('/api/automation/stale-permits', requireManagerOrAdmin, async (req, res) => {
    try {
      const days = Math.max(1, Math.min(365, parseInt(req.query.days || DEFAULT_STALE_DAYS, 10) || DEFAULT_STALE_DAYS));
      const stage = String(req.query.stage || 'submitted').toLowerCase();
      const VALID = new Set(['potential', 'started', 'submitted', 'approved', 'checklist', 'billed']);
      if (!VALID.has(stage)) return res.status(400).json({ error: 'Invalid stage' });
      res.json({ days, stage, permits: await findStalePermits(pool, days, stage) });
    } catch (e) {
      console.error('[automation:stale-permits]', e && e.message);
      res.status(500).json({ error: 'Failed to load stale permits.' });
    }
  });

  // Budget-burn — admin only (financial). Threshold 0.0–1.0.
  app.get('/api/automation/budget-burn', requireAdmin, async (req, res) => {
    try {
      const t = parseFloat(req.query.threshold);
      const threshold = Number.isFinite(t) && t >= 0 && t <= 1 ? t : DEFAULT_BURN_THRESHOLD;
      res.json({ threshold, alerts: await findBudgetBurn(pool, threshold) });
    } catch (e) {
      console.error('[automation:budget-burn]', e && e.message);
      res.status(500).json({ error: 'Failed to load budget burn.' });
    }
  });

  // Permits at the 'billed' stage but with no invoice yet. Admin only.
  app.get('/api/automation/permits-awaiting-invoice', requireAdmin, async (req, res) => {
    try {
      res.json({ permits: await findPermitsAwaitingInvoice(pool) });
    } catch (e) {
      console.error('[automation:permits-awaiting-invoice]', e && e.message);
      res.status(500).json({ error: 'Failed to load permits awaiting invoice.' });
    }
  });

  // "What if I billed today?" — admin/manager. Manager-or-admin so a
  // permitting manager can see their pending pipeline.
  app.get('/api/automation/bill-now-preview', requireManagerOrAdmin, async (req, res) => {
    try {
      res.json(await buildBillNowPreview(pool));
    } catch (e) {
      console.error('[automation:bill-now-preview]', e && e.message);
      res.status(500).json({ error: 'Failed to build bill-now preview.' });
    }
  });

  // PSC RUS revenue projection — ADMIN ONLY. Returns the umbrella-grouped
  // 90-day projection across all jobs (Inspection + RE + Permitting +
  // Other) for every PSC RUS engineering contract. Replaces the older
  // inspection-only endpoint; the dashboard card has been switched to
  // call this one, but we keep the legacy path live as a thin alias so
  // any external caller doesn't 404 mid-deploy.
  app.get('/api/automation/psc-rus-projection', requireAdmin, async (req, res) => {
    try {
      const lookbackWeeks = Math.max(1, Math.min(52, parseInt(req.query.lookback_weeks || '8', 10) || 8));
      const horizonWeeks  = Math.max(1, Math.min(104, parseInt(req.query.horizon_weeks || '13', 10) || 13));
      res.json(await buildPscRusProjection(pool, { lookbackWeeks, horizonWeeks }));
    } catch (e) {
      console.error('[automation:psc-rus-projection]', e && e.message);
      res.status(500).json({ error: 'Failed to build PSC RUS projection.' });
    }
  });

  // Legacy alias — kept so any cached frontend or curl script doesn't
  // suddenly 404. Routes to the new PSC RUS projection.
  app.get('/api/automation/inspection-projection', requireAdmin, async (req, res) => {
    try {
      const lookbackWeeks = Math.max(1, Math.min(52, parseInt(req.query.lookback_weeks || '8', 10) || 8));
      const horizonWeeks  = Math.max(1, Math.min(104, parseInt(req.query.horizon_weeks || '13', 10) || 13));
      res.json(await buildPscRusProjection(pool, { lookbackWeeks, horizonWeeks }));
    } catch (e) {
      console.error('[automation:inspection-projection:legacy]', e && e.message);
      res.status(500).json({ error: 'Failed to build PSC RUS projection.' });
    }
  });

  // Monthly billing draft — admin only. Returns the candidate list grouped
  // by client. NOTHING IS COMMITTED — admin reviews, edits if needed, then
  // POSTs to the existing /api/billing/bill-multiple to create real invoices.
  app.get('/api/automation/billing-draft/monthly', requireAdmin, async (req, res) => {
    try {
      const year = parseInt(req.query.year, 10);
      const month = parseInt(req.query.month, 10);
      if (!Number.isFinite(year) || year < 2020 || year > 2100) {
        return res.status(400).json({ error: 'year must be a valid 4-digit year' });
      }
      if (!Number.isFinite(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'month must be 1-12' });
      }
      res.json(await buildMonthlyBillingDraft(pool, year, month));
    } catch (e) {
      console.error('[automation:billing-draft-monthly]', e && e.message);
      res.status(500).json({ error: 'Failed to build billing draft.' });
    }
  });
}

// ─── SCHEDULER ─────────────────────────────────────────────────────────────
// Single setInterval that ticks hourly. Each task tracks its own last-run
// timestamp so we don't have to align the scheduler with arbitrary clock
// times. On boot, every task fires once so deploy logs immediately show
// the current state — useful when triaging why no email/digest arrived.
// ─── Digest email transport ───────────────────────────────────────────────
//
// Sends the digest via the first configured backend in this priority
// order:
//   1. SendGrid v3 REST API (SENDGRID_API_KEY env)
//   2. Mailgun v3 REST API (MAILGUN_API_KEY + MAILGUN_DOMAIN)
//   3. Console log (fallback, no email sent — useful in dev)
// No npm dependency added — all transports go through fetch(). Adding
// nodemailer + SMTP transport later is a single new branch in
// _sendViaSmtp() if the owner wants raw SMTP.

function _renderDigestHtml(d) {
  const fmt = n => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const money = n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#212529;max-width:680px;margin:0 auto;padding:20px">
    <h1 style="color:#1B5FA0;font-size:22px;margin:0 0 4px 0">Launch Fiber — Daily Digest</h1>
    <div style="color:#6C757D;font-size:13px;margin-bottom:18px">${d.date}</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
      <tr><td style="padding:8px 12px;border:1px solid #DEE2E6;background:#F5F7FA;font-size:11px;color:#6C757D;text-transform:uppercase">Hours</td>
          <td style="padding:8px 12px;border:1px solid #DEE2E6"><strong>${fmt(d.hours.total_hours)}</strong> across ${d.hours.entry_count} entries (${d.projects_touched} projects)</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #DEE2E6;background:#F5F7FA;font-size:11px;color:#6C757D;text-transform:uppercase">Billed</td>
          <td style="padding:8px 12px;border:1px solid #DEE2E6"><strong>${money(d.billed.billed)}</strong> across ${d.billed.invoice_count} invoice${d.billed.invoice_count === 1 ? '' : 's'}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #DEE2E6;background:#F5F7FA;font-size:11px;color:#6C757D;text-transform:uppercase">Permits advanced</td>
          <td style="padding:8px 12px;border:1px solid #DEE2E6">${(d.permits_advanced && JSON.stringify(d.permits_advanced)) || '—'}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #DEE2E6;background:#F5F7FA;font-size:11px;color:#6C757D;text-transform:uppercase">Flagged sessions</td>
          <td style="padding:8px 12px;border:1px solid #DEE2E6">${(d.timeclock_flags && d.timeclock_flags.needs_review) || 0} need review</td></tr>
    </table>
    <div style="font-size:11px;color:#6C757D">Auto-generated. View live data in the admin dashboard.</div>
  </body></html>`;
}

async function _sendViaSendGrid(html, subject, recipients, from) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return null;
  const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: recipients.map(email => ({ email })) }],
      from: { email: from },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`SendGrid error ${r.status}: ${txt.slice(0, 200)}`);
  }
  return { backend: 'sendgrid', recipients };
}

async function _sendViaMailgun(html, subject, recipients, from) {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!key || !domain) return null;
  const fd = new URLSearchParams();
  fd.set('from', from);
  for (const r of recipients) fd.append('to', r);
  fd.set('subject', subject);
  fd.set('html', html);
  const auth = Buffer.from(`api:${key}`).toString('base64');
  const r = await fetch(`https://api.mailgun.net/v3/${encodeURIComponent(domain)}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: fd.toString(),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`Mailgun error ${r.status}: ${txt.slice(0, 200)}`);
  }
  return { backend: 'mailgun', recipients };
}

async function sendDigestEmail(digest, recipients) {
  const subject = `Launch Fiber Digest — ${digest.date}`;
  const html = _renderDigestHtml(digest);
  const from = process.env.DIGEST_FROM || 'no-reply@launchfiberservices.com';
  // Try transports in order; first one that's configured wins.
  let result = await _sendViaSendGrid(html, subject, recipients, from);
  if (!result) result = await _sendViaMailgun(html, subject, recipients, from);
  if (!result) {
    // No backend configured — graceful no-op. Log so the operator can
    // wire SENDGRID_API_KEY (or MAILGUN_*) when they're ready.
    console.log('[automation:digest:send] no email backend configured — would have sent to:', recipients);
    return { backend: 'none', recipients, note: 'No email backend configured. Set SENDGRID_API_KEY or MAILGUN_API_KEY+MAILGUN_DOMAIN env vars to deliver.' };
  }
  return result;
}

function startScheduler(pool) {
  const state = { lastDigest: 0, lastStale: 0, lastBurn: 0, lastDigestEmail: 0 };

  async function tick(reason) {
    const now = Date.now();
    // Daily — log a digest of yesterday's activity.
    if (reason === 'boot' || now - state.lastDigest >= DAILY_MS) {
      try {
        const d = await buildDigest(pool);
        console.log(`[automation:digest:${d.date}]`,
          `${d.hours.total_hours}h / ${d.hours.entry_count} entries / ${d.projects_touched} projects /`,
          `$${d.billed.billed.toFixed(2)} billed (${d.billed.invoice_count} invoices) /`,
          `permits:`, d.permits_advanced,
          `/ flagged sessions: ${d.timeclock_flags.needs_review}`);
        state.lastDigest = now;
        // Auto-send the digest if recipients are configured AND a
        // delivery backend is wired up (SENDGRID_API_KEY or MAILGUN_*).
        // Silently skips when DIGEST_TO is empty so dev environments
        // don't accidentally email anyone.
        const to = (process.env.DIGEST_TO || '').split(',').map(s => s.trim()).filter(Boolean);
        if (to.length && (process.env.SENDGRID_API_KEY || process.env.MAILGUN_API_KEY)) {
          try {
            const out = await sendDigestEmail(d, to);
            console.log(`[automation:digest:emailed:${out.backend}] →`, to.join(', '));
          } catch (mailErr) {
            console.error('[automation:digest:email-fail]', mailErr && mailErr.message);
          }
        }
      } catch (e) { console.error('[automation:scheduler:digest]', e && e.message); }
    }
    // Hourly — stale permits + budget burn.
    if (reason === 'boot' || now - state.lastStale >= 4 * 60 * 60 * 1000) {
      try {
        const stale = await findStalePermits(pool);
        if (stale.length) {
          console.log(`[automation:stale-permits] ${stale.length} permit(s) submitted >${DEFAULT_STALE_DAYS}d:`,
            stale.slice(0, 5).map(p => `${p.client_name || '?'} / ${p.project_name} (${p.days_in_stage}d)`).join(' | '));
        }
        state.lastStale = now;
      } catch (e) { console.error('[automation:scheduler:stale]', e && e.message); }
    }
    if (reason === 'boot' || now - state.lastBurn >= 4 * 60 * 60 * 1000) {
      try {
        const burns = await findBudgetBurn(pool);
        if (burns.length) {
          console.log(`[automation:budget-burn] ${burns.length} budget code(s) over ${(DEFAULT_BURN_THRESHOLD * 100).toFixed(0)}%:`,
            burns.slice(0, 5).map(b => `${b.code} (${(b.burn_ratio * 100).toFixed(0)}%)`).join(' | '));
        }
        state.lastBurn = now;
      } catch (e) { console.error('[automation:scheduler:burn]', e && e.message); }
    }
  }

  // Fire once at boot so the deploy log immediately reflects current state.
  // Wrapped in setImmediate so DB pool is fully ready.
  setImmediate(() => tick('boot'));
  // Then tick every hour. .unref() so this never holds the process open
  // during graceful shutdown.
  const handle = setInterval(() => tick('tick').catch(() => {}), SCHEDULER_TICK_MS);
  if (handle.unref) handle.unref();
  console.log(`✓ Automation scheduler started (tick every ${SCHEDULER_TICK_MS / 60000} min, business_tz=${BUSINESS_TZ})`);
}

module.exports = {
  installAutomationRoutes,
  startScheduler,
  // Exported for tests + reuse (e.g. an admin "run digest now" button).
  buildDigest,
  findStalePermits,
  findBudgetBurn,
  findPermitsAwaitingInvoice,
  buildInspectionRevenueProjection,
  buildPscRusProjection,
  buildBillNowPreview,
  buildMonthlyBillingDraft,
};
