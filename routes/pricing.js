// routes/pricing.js — pricing entries (Job × Program × Billing Code → rate).
//
// Phase 3b (2026-05-04): keyed on `program` directly. The old
// `project_type_id → project_types` FK chain was dropped; pricing now
// lines up 1:1 with engineering_contracts.program. Allowed program
// values: 'rus' | 'bau' | 'gfr' | 'other'.
//
// Project creation pulls defaults from this list via /lookup; the
// settings panel manages CRUD; /gaps drives the red dot on the settings
// button (a combination is "missing" if there's an active job + a
// program with no pricing_entries row at all — billing-code breakdowns
// are optional).

const { logAudit } = require('./_audit');

const ALLOWED_PROGRAMS = ['rus', 'bau', 'gfr', 'other'];

function normalizeProgram(input, opts) {
  if (input === null || input === undefined || input === '') {
    if (opts && opts.required) {
      const err = new Error('program required');
      err.statusCode = 400;
      throw err;
    }
    return null;
  }
  const v = String(input).trim().toLowerCase();
  if (!ALLOWED_PROGRAMS.includes(v)) {
    const err = new Error(`Invalid program "${input}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.`);
    err.statusCode = 400;
    throw err;
  }
  return v;
}

module.exports = function installPricingRoutes(app, pool, mw) {
  // Item 2 fix: requireManagerOrAdmin gate on mutation endpoints
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());
  // Wave 1.5 [UNGATED]: all three GET pricing endpoints were missing auth.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireStaff = (mw && mw.requireStaff) || requireAuth(); // O34: rates are staff-only (excludes trainee/customer)
  const { requirePermission } = require('./_permissions');
  const manageBilling = requirePermission(pool, 'money.manage_billing');
  const moneyView = requirePermission(pool, 'money.view');

  app.get('/api/pricing', requireStaff, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT pe.*,
               j.name as job_name, j.is_permitting
        FROM pricing_entries pe
        LEFT JOIN jobs j ON j.id = pe.job_id
        ORDER BY pe.program, j.name, pe.billing_code NULLS LAST
      `);
      res.json(rows);
    } catch (e) {
      console.error('[pricing:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load pricing entries.' });
    }
  });

  // Look up the default rate/billing for a job+program (and optionally a
  // billing code). Used by the project create form to auto-fill the rate.
  app.get('/api/pricing/lookup', requireStaff, async (req, res) => {
    const { job_id, program, billing_code } = req.query;
    if (!job_id) return res.status(400).json({ error: 'job_id required' });
    let normalizedProgram;
    try { normalizedProgram = normalizeProgram(program, { required: true }); }
    catch (e) { return res.status(e.statusCode || 400).json({ error: e.message }); }
    try {
      // Most specific (with code) first, then fall back to the no-code entry
      const { rows } = await pool.query(`
        SELECT * FROM pricing_entries
        WHERE job_id = $1 AND program = $2
          AND ($3::text IS NULL OR billing_code = $3 OR billing_code IS NULL)
        ORDER BY (billing_code = $3) DESC NULLS LAST
        LIMIT 1
      `, [job_id, normalizedProgram, billing_code || null]);
      res.json(rows[0] || null);
    } catch (e) {
      console.error('[pricing:lookup]', e && e.message);
      res.status(500).json({ error: 'Failed to look up pricing.' });
    }
  });

  // Item 2 fix: requireManagerOrAdmin added
  app.post('/api/pricing', manageBilling, async (req, res) => {
    const { job_id, program, billing_code, billing_type, rate, notes } = req.body;
    let normalizedProgram;
    try { normalizedProgram = normalizeProgram(program, { required: true }); }
    catch (e) { return res.status(e.statusCode || 400).json({ error: e.message }); }
    try {
      const { rows } = await pool.query(`
        INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate, notes)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__'))
        DO UPDATE SET billing_type = $4, rate = $5, notes = $6, updated_at = NOW()
        RETURNING *
      `, [job_id, normalizedProgram, billing_code || null, billing_type || 'hourly', rate, notes || null]);
      logAudit(pool, { req, action: 'pricing.create', entity_type: 'pricing_entry', entity_id: rows[0].id, after: rows[0], source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[pricing:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create pricing entry.' });
    }
  });

  // Item 2 fix: requireManagerOrAdmin added
  app.put('/api/pricing/:id', manageBilling, async (req, res) => {
    const { billing_type, rate, notes, billing_code, program } = req.body;
    let normalizedProgram = undefined;
    if (program !== undefined) {
      try { normalizedProgram = normalizeProgram(program); }
      catch (e) { return res.status(e.statusCode || 400).json({ error: e.message }); }
    }
    try {
      const { rows } = await pool.query(`
        UPDATE pricing_entries SET
          billing_type = COALESCE($2, billing_type),
          rate = COALESCE($3, rate),
          notes = COALESCE($4, notes),
          billing_code = COALESCE($5, billing_code),
          program = COALESCE($6, program),
          updated_at = NOW()
        WHERE id = $1 RETURNING *
      `, [req.params.id, billing_type, rate, notes, billing_code, normalizedProgram === undefined ? null : normalizedProgram]);
      if (!rows[0]) return res.status(404).json({ error: 'Pricing entry not found' });
      logAudit(pool, { req, action: 'pricing.update', entity_type: 'pricing_entry', entity_id: rows[0].id, after: rows[0], source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[pricing:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update pricing entry.' });
    }
  });

  // Item 2 fix: requireManagerOrAdmin added
  app.delete('/api/pricing/:id', manageBilling, async (req, res) => {
    try {
      const { rows } = await pool.query('DELETE FROM pricing_entries WHERE id = $1 RETURNING id', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Pricing entry not found' });
      logAudit(pool, { req, action: 'pricing.delete', entity_type: 'pricing_entry', entity_id: req.params.id, source: 'admin' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[pricing:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete pricing entry.' });
    }
  });

  // Returns the count of "missing pricing" combinations — the red dot in the
  // settings button is shown when this is > 0. A combination is "missing"
  // if there's an active job and a program with no pricing_entries row.
  // Programs are enumerated from the canonical list (since project_types
  // was dropped in Phase 3b); only programs that admin actually uses will
  // realistically gap, but listing the full enum keeps the UX consistent.
  app.get('/api/pricing/gaps', moneyView, async (req, res) => {
    try {
      // CROSS JOIN against the literal program list. unnest produces a
      // virtual table so the query stays a single round-trip.
      const { rows } = await pool.query(`
        SELECT j.id as job_id, j.name as job_name,
               p.program as program
        FROM jobs j
        CROSS JOIN unnest(ARRAY['rus','bau','gfr','other']::text[]) AS p(program)
        WHERE j.active = true
          AND NOT EXISTS (
            SELECT 1 FROM pricing_entries pe
            WHERE pe.job_id = j.id AND pe.program = p.program
          )
        ORDER BY p.program, j.name
      `);
      res.json({ count: rows.length, gaps: rows });
    } catch (e) {
      console.error('[pricing:gaps]', e && e.message);
      res.status(500).json({ error: 'Failed to load pricing gaps.' });
    }
  });
};
