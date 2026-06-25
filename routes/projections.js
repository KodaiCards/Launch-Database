// routes/projections.js — revenue projections on the keystone model.
//
// Design: docs/projections_design.md. Projection base = each job's EXPECTED
// amount (estimated_amount, or footage × rate), set at creation — same for RUS
// and non-RUS. projected_remaining = expected − billed (billed = Σ the job's
// non-void invoice_items). The RUS engineering budget is an overlay (burn rate +
// projected completion). Strictly modular: rolls up only by the chosen key
// (client / EC / program); never merges co-located work across them.
//
// Lives behind the Money tab (UI). Endpoints:
//   GET /api/projections/service-area/:id
//   GET /api/projections/ec/:id            (budget burn)
//   GET /api/projections?group=client|ec|program
//   GET /api/map/service-areas             (data for the Service Areas → Map tab)
//
// Mount (CEO, server.js):
//   require('./routes/projections')(app, pool, { requireManagerOrAdmin });

const CENT = (n) => Math.round(Number(n || 0) * 100) / 100;
const { computeEstimate } = require('./_map_estimate');

// Per-job expected + billed, for SAs matching an optional WHERE. expected =
// estimated_amount if set, else footage×rate.
const JOB_SQL = (where) => `
  SELECT sa.id AS sa_id, sa.name AS sa_name, sa.client_id, sa.engineering_contract_id,
         sa.program, sa.status, sa.build_finalized_at, sa.closed_at,
         c.name AS client_name, ec.name AS ec_name,
         saj.id AS job_id, j.name AS job_name, saj.team, saj.billing_type, saj.bill_trigger,
         COALESCE(NULLIF(saj.estimated_amount,0), COALESCE(saj.footage,0)*COALESCE(saj.rate,0), 0) AS expected,
         COALESCE(b.billed,0) AS billed
    FROM service_areas sa
    JOIN service_area_jobs saj ON saj.service_area_id = sa.id
    LEFT JOIN clients c ON c.id = sa.client_id
    LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
    LEFT JOIN jobs j ON j.id = saj.job_id
    LEFT JOIN (SELECT ii.service_area_job_id, SUM(ii.amount) billed
                 FROM invoice_items ii JOIN invoices i ON i.id = ii.invoice_id
                WHERE COALESCE(i.status,'') <> 'void'
                GROUP BY ii.service_area_job_id) b ON b.service_area_job_id = saj.id
   ${where}`;

module.exports = function installProjectionsRoutes(app, pool, mw) {
  const gate = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());

  // ── Per service area ───────────────────────────────────────────────────────
  app.get('/api/projections/service-area/:id', gate, async (req, res) => {
    try {
      const { rows } = await pool.query(JOB_SQL('WHERE sa.id = $1 ORDER BY j.name NULLS LAST, saj.created_at'), [req.params.id]);
      if (!rows.length) {
        const sa = await pool.query('SELECT id, name FROM service_areas WHERE id = $1', [req.params.id]);
        if (!sa.rows.length) return res.status(404).json({ error: 'Service area not found' });
        return res.json({ area: sa.rows[0], jobs: [], totals: { projected_total: 0, billed: 0, remaining: 0, completion_pct: 0 } });
      }
      const a = rows[0];
      let exp = 0, bil = 0;
      const jobs = rows.map((r) => {
        const expected = CENT(r.expected), billed = CENT(r.billed), remaining = CENT(Math.max(0, expected - billed));
        exp += expected; bil += billed;
        return { job_id: r.job_id, job_name: r.job_name, team: r.team, billing_type: r.billing_type,
          bill_trigger: r.bill_trigger, expected, billed, remaining };
      });
      // Map-derived construction (the loop): when the SA is linked to a map plan,
      // construction expected comes from the map's units × the CC catalog — not the
      // construction-discipline jobs. Additive blocks; jobs/totals unchanged.
      let construction = { linked: false };
      let combined = null;
      const meta = await pool.query(
        `SELECT sa.map_plan_id, sa.construction_contract_id, cc.total_budget AS cc_budget
           FROM service_areas sa LEFT JOIN construction_contracts cc ON cc.id = sa.construction_contract_id
          WHERE sa.id = $1`, [req.params.id]);
      const m = meta.rows[0] || {};
      if (m.map_plan_id) {
        const est = await computeEstimate(pool, m.map_plan_id, m.construction_contract_id);
        const budget = m.cc_budget != null ? CENT(m.cc_budget) : null;
        construction = {
          linked: true, construction_contract_id: m.construction_contract_id || null, budget,
          expected: est.construction_expected, completed: est.construction_completed, remaining: est.construction_remaining,
          over_budget: budget != null ? CENT(Math.max(0, est.construction_expected - budget)) : null,
          footage_by_designation: est.footage_by_designation, structures: est.structures, unpriced: est.unpriced,
        };
        // engineering = non-construction-team jobs; construction = map. No double-count.
        const engExpected = CENT(jobs.filter((j) => j.team !== 'construction').reduce((s, j) => s + j.expected, 0));
        combined = { engineering_expected: engExpected, construction_expected: est.construction_expected,
          projected_total: CENT(engExpected + est.construction_expected) };
      }
      res.json({
        area: { id: a.sa_id, name: a.sa_name, client_id: a.client_id, client_name: a.client_name,
          engineering_contract_id: a.engineering_contract_id, ec_name: a.ec_name, program: a.program,
          status: a.status, build_finalized_at: a.build_finalized_at, closed_at: a.closed_at },
        jobs,
        totals: { projected_total: CENT(exp), billed: CENT(bil), remaining: CENT(Math.max(0, exp - bil)),
          completion_pct: exp ? Math.round(bil / exp * 100) : 0 },
        construction, combined,
      });
    } catch (e) {
      console.error('[projections:sa]', e && e.message);
      res.status(500).json({ error: 'Failed to load projection.' });
    }
  });

  // ── Mileage allocation (loop 4/4) ──────────────────────────────────────────
  // Hourly jobs draw from the contract by mileage, per discipline:
  //   per_mile = remaining_$ ÷ remaining_miles ; sa_expected = SA.miles × per_mile
  // remaining_$ = discipline budget − billed(discipline) across the contract's SAs;
  // remaining_miles = contract total_miles − miles of its finalized SAs.
  async function mileageBlock(col, contractId, totalMiles, saMiles) {
    const [allocR, billedR, doneR] = await Promise.all([
      pool.query(`SELECT discipline, budget_amount FROM contract_allocations WHERE ${col} = $1`, [contractId]),
      pool.query(
        `SELECT saj.team AS discipline, COALESCE(SUM(ii.amount),0) billed
           FROM service_areas sa
           JOIN service_area_jobs saj ON saj.service_area_id = sa.id
           JOIN invoice_items ii ON ii.service_area_job_id = saj.id
           JOIN invoices i ON i.id = ii.invoice_id AND COALESCE(i.status,'') <> 'void'
          WHERE sa.${col} = $1 GROUP BY saj.team`, [contractId]),
      pool.query(`SELECT COALESCE(SUM(miles),0) done FROM service_areas WHERE ${col} = $1 AND build_finalized_at IS NOT NULL`, [contractId]),
    ]);
    const billed = {}; for (const r of billedR.rows) billed[r.discipline] = Number(r.billed);
    const total = Number(totalMiles || 0);
    const remainingMiles = CENT(Math.max(0, total - Number(doneR.rows[0].done || 0)));
    const disciplines = allocR.rows.map((a) => {
      const remaining$ = CENT(Math.max(0, Number(a.budget_amount) - (billed[a.discipline] || 0)));
      const perMile = remainingMiles > 0 ? CENT(remaining$ / remainingMiles) : 0;
      return { discipline: a.discipline, budget: CENT(a.budget_amount), billed: CENT(billed[a.discipline] || 0),
        remaining: remaining$, per_mile_rate: perMile, sa_expected: CENT(Number(saMiles || 0) * perMile) };
    });
    return { total_miles: CENT(total), remaining_miles: remainingMiles, sa_miles: CENT(saMiles || 0),
      disciplines, sa_hourly_expected: CENT(disciplines.reduce((s, d) => s + d.sa_expected, 0)) };
  }

  app.get('/api/projections/service-area/:id/mileage', gate, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT sa.id, sa.name, sa.miles, sa.engineering_contract_id, sa.construction_contract_id,
                ec.total_miles AS ec_miles, cc.total_miles AS cc_miles
           FROM service_areas sa
           LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
           LEFT JOIN construction_contracts cc ON cc.id = sa.construction_contract_id
          WHERE sa.id = $1`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Service area not found' });
      const sa = rows[0];
      const out = { service_area_id: sa.id, name: sa.name, sa_miles: CENT(sa.miles || 0), engineering: null, construction: null };
      if (sa.engineering_contract_id) out.engineering = await mileageBlock('engineering_contract_id', sa.engineering_contract_id, sa.ec_miles, sa.miles);
      if (sa.construction_contract_id) out.construction = await mileageBlock('construction_contract_id', sa.construction_contract_id, sa.cc_miles, sa.miles);
      res.json(out);
    } catch (e) { console.error('[projections:mileage]', e && e.message); res.status(500).json({ error: 'Failed to compute mileage allocation.' }); }
  });

  // ── EC engineering-budget burn ─────────────────────────────────────────────
  app.get('/api/projections/ec/:id', gate, async (req, res) => {
    try {
      const ec = await pool.query('SELECT id, name FROM engineering_contracts WHERE id = $1', [req.params.id]);
      if (!ec.rows.length) return res.status(404).json({ error: 'Engineering contract not found' });
      const [budgetR, rowsR, firstR] = await Promise.all([
        pool.query('SELECT COALESCE(SUM(total_amount),0) budget FROM budgets WHERE engineering_contract_id = $1', [req.params.id]),
        pool.query(JOB_SQL('WHERE sa.engineering_contract_id = $1'), [req.params.id]),
        pool.query(`SELECT MIN(COALESCE(billing_period_start, invoice_date)) first_date
                      FROM invoices WHERE engineering_contract_id = $1 AND COALESCE(status,'') <> 'void'`, [req.params.id]),
      ]);
      const budget = CENT(budgetR.rows[0].budget);
      let projected = 0, billed = 0;
      for (const r of rowsR.rows) { projected += CENT(r.expected); billed += CENT(r.billed); }
      projected = CENT(projected); billed = CENT(billed);
      const first = firstR.rows[0].first_date;
      const months = first ? Math.max(1, Math.round((Date.now() - new Date(first).getTime()) / (30.44 * 864e5))) : 1;
      const burn = CENT(billed / months);
      const remainingToBudget = CENT(Math.max(0, Math.min(projected, budget || projected) - billed));
      res.json({
        ec: ec.rows[0], budget, projected, billed,
        projected_remaining: CENT(Math.max(0, projected - billed)),
        months_elapsed: months, burn_rate_monthly: burn,
        projected_months_to_budget: burn ? Math.round(remainingToBudget / burn) : null,
        over_budget: budget > 0 ? CENT(Math.max(0, projected - budget)) : 0,
      });
    } catch (e) {
      console.error('[projections:ec]', e && e.message);
      res.status(500).json({ error: 'Failed to load EC projection.' });
    }
  });

  // ── Rollup (modular: only by the chosen key) ───────────────────────────────
  app.get('/api/projections', gate, async (req, res) => {
    const group = ['client', 'ec', 'program'].includes(req.query.group) ? req.query.group : 'client';
    const keyExpr = { client: 'a.client_id', ec: 'a.engineering_contract_id', program: 'a.program' }[group];
    const lblExpr = { client: 'a.client_name', ec: 'a.ec_name', program: 'a.program' }[group];
    try {
      const { rows } = await pool.query(
        `SELECT ${keyExpr} AS key, ${lblExpr} AS label,
                COUNT(DISTINCT a.sa_id)::int AS service_areas,
                COALESCE(SUM(a.expected),0) AS projected_total,
                COALESCE(SUM(a.billed),0) AS billed
           FROM (${JOB_SQL('')}) a
          GROUP BY key, label ORDER BY projected_total DESC`
      );
      res.json({
        group,
        rows: rows.map((r) => ({
          key: r.key, label: r.label || '(none)', service_areas: r.service_areas,
          projected_total: CENT(r.projected_total), billed: CENT(r.billed),
          projected_remaining: CENT(Math.max(0, r.projected_total - r.billed)),
        })),
      });
    } catch (e) {
      console.error('[projections:rollup]', e && e.message);
      res.status(500).json({ error: 'Failed to load projections rollup.' });
    }
  });

  // ── Map data (Service Areas → Map tab; rendering deferred until KMZ sync) ────
  app.get('/api/map/service-areas', gate, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT sa.id, sa.name, sa.program, sa.status, sa.build_finalized_at, sa.closed_at,
                sa.map_geometry, sa.boundary, sa.center_lat, sa.center_lng,
                c.name AS client_name, ec.name AS ec_name
           FROM service_areas sa
           LEFT JOIN clients c ON c.id = sa.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
          ORDER BY c.name, sa.name`
      );
      res.json(rows);
    } catch (e) {
      console.error('[projections:map]', e && e.message);
      res.status(500).json({ error: 'Failed to load map data.' });
    }
  });
};
