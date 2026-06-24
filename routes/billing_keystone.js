// routes/billing_keystone.js — service-area billing on the progressive ledger.
//
// Design: docs/billing_keystone_design.md. One rule for every pattern:
//   billable_now = earned_to_date − already_billed_to_date   (per job)
// • earned: hourly = Σ hours(≤ period end) × rate; footage = completed footage ×
//   rate (manual now, map-fed later); fixed = estimated_amount once its route (or
//   the area, when route-less) is finalized, else 0.
// • already-billed = Σ the job's non-void invoice_items.amount (derived — no
//   per-entry flag, so corrections fall out as negative reconciliation lines).
// This gives monthly hours, progressive footage (Jun/Jul/Aug), milestone fixed,
// catch-up, and reconciliation credits from the same code.
//
// Mount (CEO, server.js):
//   require('./routes/billing_keystone')(app, pool, { requireManagerOrAdmin });

const { logAudit } = require('./_audit');

const CENT = (n) => Math.round(Number(n || 0) * 100) / 100;

// 'YYYY-MM' → { start:'YYYY-MM-01', end:'YYYY-MM-<last>', year, month } or null.
function parsePeriod(p) {
  if (!/^\d{4}-\d{2}$/.test(String(p || ''))) return null;
  const [y, m] = p.split('-').map(Number);
  if (m < 1 || m > 12) return null;
  const end = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); // day 0 of next month
  return { start: `${p}-01`, end, year: y, month: m };
}

module.exports = function installBillingKeystoneRoutes(app, pool, mw) {
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());
  const uid = (req) => (req && req.user && req.user.id) || null;

  // Earned/billed/billable per job for the period, optionally scoped to SAs.
  // Returns rows grouped by service area.
  async function computeWorklist(period, saIds) {
    const { rows } = await pool.query(
      `SELECT sa.id AS sa_id, sa.name AS sa_name, sa.client_id, sa.engineering_contract_id,
              sa.program, sa.build_finalized_at AS sa_finalized,
              saj.id AS job_id, saj.team, saj.route_id, saj.billing_type, saj.bill_trigger,
              COALESCE(saj.rate,0) AS rate, COALESCE(saj.footage,0) AS footage,
              COALESCE(saj.estimated_amount,0) AS estimated_amount,
              j.name AS job_name, r.build_finalized_at AS route_finalized,
              COALESCE(h.hours,0) AS earned_hours,
              COALESCE(b.billed,0) AS billed_to_date
         FROM service_areas sa
         JOIN service_area_jobs saj ON saj.service_area_id = sa.id
         LEFT JOIN jobs j ON j.id = saj.job_id
         LEFT JOIN service_area_routes r ON r.id = saj.route_id
         LEFT JOIN (SELECT service_area_job_id, SUM(hours) hours FROM time_entries
                     WHERE entry_date <= $1 GROUP BY service_area_job_id) h
                ON h.service_area_job_id = saj.id
         LEFT JOIN (SELECT ii.service_area_job_id, SUM(ii.amount) billed
                      FROM invoice_items ii JOIN invoices i ON i.id = ii.invoice_id
                     WHERE COALESCE(i.status,'') <> 'void'
                     GROUP BY ii.service_area_job_id) b
                ON b.service_area_job_id = saj.id
        WHERE ($2::uuid[] IS NULL OR sa.id = ANY($2::uuid[]))
        ORDER BY sa.name, j.name NULLS LAST, saj.created_at`,
      [period.end, saIds && saIds.length ? saIds : null]
    );

    const areas = new Map();
    for (const r of rows) {
      // Expected value of the job at full delivery.
      const expectedAmt = r.billing_type === 'hourly' ? CENT(Number(r.earned_hours) * Number(r.rate))
        : r.billing_type === 'footage' ? CENT(Number(r.footage) * Number(r.rate))
        : CENT(r.estimated_amount);
      // bill_trigger='completed' (build-complete + close-out) earns only once the
      // route (or area, when route-less) is finalized; 'progressive' accrues.
      const milestone = r.route_id ? r.route_finalized : r.sa_finalized;
      const earned = r.bill_trigger === 'completed' ? (milestone ? expectedAmt : 0) : expectedAmt;
      const billable = CENT(earned - Number(r.billed_to_date));
      if (Math.abs(billable) < 0.005) continue; // nothing to bill / already settled

      const rate = Number(r.rate);
      const unit = r.billing_type === 'hourly' ? 'hr' : r.billing_type === 'footage' ? 'ft' : 'fixed';
      const qty = (r.billing_type !== 'fixed' && rate) ? CENT(billable / rate) : 1;
      const roleLabel = r.job_name || r.team || r.billing_type;
      const line = {
        job_id: r.job_id, team: r.team, job_name: r.job_name, billing_type: r.billing_type,
        earned, billed_to_date: CENT(r.billed_to_date), billable,
        line_kind: billable >= 0 ? 'charge' : 'reconciliation',
        description: `${r.sa_name} · ${roleLabel}${r.billing_type === 'hourly' ? ` · ${period.year}-${String(period.month).padStart(2, '0')}` : ''}`,
        quantity: qty, unit, rate: r.billing_type === 'fixed' ? null : rate, amount: billable,
      };
      if (!areas.has(r.sa_id)) {
        areas.set(r.sa_id, {
          service_area_id: r.sa_id, name: r.sa_name, client_id: r.client_id,
          engineering_contract_id: r.engineering_contract_id, program: r.program, lines: [],
        });
      }
      areas.get(r.sa_id).lines.push(line);
    }
    return [...areas.values()].map((a) => ({ ...a, total: CENT(a.lines.reduce((s, l) => s + l.amount, 0)) }));
  }

  // GET /api/billing/worklist?period=YYYY-MM[&service_area_ids=a,b]
  app.get('/api/billing/worklist', requireManagerOrAdmin, async (req, res) => {
    const period = parsePeriod(req.query.period);
    if (!period) return res.status(400).json({ error: 'period=YYYY-MM required' });
    const saIds = req.query.service_area_ids ? String(req.query.service_area_ids).split(',').filter(Boolean) : null;
    try {
      res.json({ period: req.query.period, areas: await computeWorklist(period, saIds) });
    } catch (e) {
      console.error('[billing:worklist]', e && e.message);
      res.status(500).json({ error: 'Failed to build billing worklist.' });
    }
  });

  // POST /api/billing/run { period, service_area_ids?[], exclude_job_ids?[] }
  // Creates one DRAFT invoice per concentrator from its billable lines.
  app.post('/api/billing/run', requireManagerOrAdmin, async (req, res) => {
    const period = parsePeriod((req.body || {}).period);
    if (!period) return res.status(400).json({ error: 'period=YYYY-MM required' });
    const saIds = Array.isArray(req.body.service_area_ids) && req.body.service_area_ids.length ? req.body.service_area_ids : null;
    const exclude = new Set((req.body.exclude_job_ids || []).map(String));

    const client = await pool.connect();
    try {
      const areas = await computeWorklist(period, saIds);
      await client.query('BEGIN');
      const created = [];
      let idx = 0;
      for (const a of areas) {
        const lines = a.lines.filter((l) => !exclude.has(String(l.job_id)));
        if (!lines.length) continue;
        const total = CENT(lines.reduce((s, l) => s + l.amount, 0));
        const inv = await client.query(
          `INSERT INTO invoices
             (client_id, service_area_id, engineering_contract_id, invoice_number, invoice_date,
              billing_period_start, billing_period_end, total_amount, status, notes)
           VALUES ($1,$2,$3,$4,now()::date,$5,$6,$7,'draft',$8) RETURNING *`,
          [a.client_id, a.service_area_id, a.engineering_contract_id,
           'INV-' + Date.now() + '-' + (idx++), period.start, period.end, total,
           `${a.name} · ${req.body.period}`]
        );
        for (const l of lines) {
          await client.query(
            `INSERT INTO invoice_items
               (invoice_id, service_area_job_id, line_kind, description, quantity, unit, rate, amount,
                period_year, period_month)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [inv.rows[0].id, l.job_id, l.line_kind, l.description, l.quantity, l.unit, l.rate, l.amount,
             period.year, period.month]
          );
        }
        created.push({ invoice: inv.rows[0], item_count: lines.length });
      }
      await client.query('COMMIT');
      logAudit(pool, { req, action: 'billing.run', entity_type: 'invoice', entity_id: null,
        after: { period: req.body.period, invoices: created.length }, source: 'admin' }).catch(() => {});
      res.status(201).json({ period: req.body.period, invoices_created: created.length, invoices: created });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[billing:run]', e && e.message);
      res.status(500).json({ error: 'Failed to run billing.' });
    } finally {
      client.release();
    }
  });

  // GET /api/billing/report?group=client|ec|program|month
  app.get('/api/billing/report', requireManagerOrAdmin, async (req, res) => {
    const group = ['client', 'ec', 'program', 'month'].includes(req.query.group) ? req.query.group : 'client';
    const sel = {
      client:  `c.name AS label, i.client_id AS key`,
      ec:      `ec.name AS label, i.engineering_contract_id AS key`,
      program: `COALESCE(sa.program,'(none)') AS label, COALESCE(sa.program,'(none)') AS key`,
      month:   `to_char(COALESCE(i.billing_period_start, i.invoice_date),'YYYY-MM') AS label,
                to_char(COALESCE(i.billing_period_start, i.invoice_date),'YYYY-MM') AS key`,
    }[group];
    try {
      const { rows } = await pool.query(
        `SELECT ${sel}, COUNT(*)::int AS invoice_count, COALESCE(SUM(i.total_amount),0) AS total
           FROM invoices i
           LEFT JOIN clients c ON c.id = i.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = i.engineering_contract_id
           LEFT JOIN service_areas sa ON sa.id = i.service_area_id
          WHERE COALESCE(i.status,'') <> 'void' AND i.service_area_id IS NOT NULL
          GROUP BY label, key ORDER BY total DESC`
      );
      res.json({ group, rows });
    } catch (e) {
      console.error('[billing:report]', e && e.message);
      res.status(500).json({ error: 'Failed to build billing report.' });
    }
  });

  // ─── Informational "month closed" tag (never locks editing) ────────────────
  app.get('/api/billing/periods', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`SELECT period_month, closed_at FROM billing_period_close ORDER BY period_month DESC`);
      res.json(rows);
    } catch (e) {
      console.error('[billing:periods]', e && e.message);
      res.status(500).json({ error: 'Failed to load billing periods.' });
    }
  });

  // POST /api/billing/periods/:month/close  (month = YYYY-MM); body {open:true} reopens.
  app.post('/api/billing/periods/:month/close', requireManagerOrAdmin, async (req, res) => {
    const period = parsePeriod(req.params.month);
    if (!period) return res.status(400).json({ error: 'month=YYYY-MM required' });
    try {
      if (req.body && req.body.open) {
        await pool.query(`DELETE FROM billing_period_close WHERE period_month = $1`, [period.start]);
        return res.json({ period_month: period.start, closed: false });
      }
      const { rows } = await pool.query(
        `INSERT INTO billing_period_close (period_month, closed_by_user_id) VALUES ($1,$2)
         ON CONFLICT (period_month) DO UPDATE SET closed_at = now(), closed_by_user_id = EXCLUDED.closed_by_user_id
         RETURNING *`,
        [period.start, uid(req)]
      );
      res.json({ ...rows[0], closed: true });
    } catch (e) {
      console.error('[billing:period-close]', e && e.message);
      res.status(500).json({ error: 'Failed to update billing period.' });
    }
  });
};
