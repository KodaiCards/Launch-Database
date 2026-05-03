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
function startScheduler(pool) {
  const state = { lastDigest: 0, lastStale: 0, lastBurn: 0 };

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
  buildMonthlyBillingDraft,
};
