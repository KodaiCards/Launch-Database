// routes/engineering_contracts.js — umbrella above one or more billing
// contracts. Used when a single agreement (e.g. "RUS 217 Engineering
// Contract GA 1706 -A72") spans multiple billing contracts (e.g. 515-3,
// 515-4, 515-5) and you want the BUDGET to live at the umbrella level
// rather than per-project. All endpoints admin-only.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

// Accepted values for engineering_contracts.program. Must match the CHECK
// constraint in migrations/0002_engineering_contract_program.sql.
//   rus   — USDA Rural Utilities Service work (PSC RUS umbrella + similar).
//           Triggers the PSC RUS PDF template, dedicated projection &
//           inspection-tab scoping, RUS-specific job/billing-code defaults.
//   bau   — Business-as-usual private fiber. Generic billing.
//   gfr   — GF(R) program.
//   other — Anything else; generic treatment.
const ALLOWED_PROGRAMS = ['rus', 'bau', 'gfr', 'other'];
const { broadcast } = require('./_sse');

function normalizeProgram(input) {
  if (input === null || input === undefined || input === '') return null;
  const v = String(input).trim().toLowerCase();
  if (!ALLOWED_PROGRAMS.includes(v)) {
    const err = new Error(`Invalid program "${input}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.`);
    err.statusCode = 400;
    throw err;
  }
  return v;
}

module.exports = function installEngineeringContractsRoutes(app, pool, mw) {
  const { requireAdmin } = mw;
  // Wave 1.5 [UNGATED]: GET /api/engineering-contracts was missing auth.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  app.get('/api/engineering-contracts', requireAuth(), async (req, res) => {
    const { client_id } = req.query;
    try {
      // For each engineering contract, also surface a count of child contracts
      // and child projects so the admin list view shows scope at a glance.
      const where = client_id ? 'WHERE ec.client_id = $1' : '';
      const { rows } = await pool.query(
        `SELECT ec.*,
                cl.name AS client_name,
                (SELECT COUNT(*) FROM contracts c WHERE c.engineering_contract_id = ec.id)::int AS contract_count,
                (SELECT COUNT(*) FROM projects p
                   JOIN contracts c ON c.id = p.contract_id
                   WHERE c.engineering_contract_id = ec.id
                     AND COALESCE(p.is_rollup, FALSE) = FALSE)::int AS project_count
           FROM engineering_contracts ec
           JOIN clients cl ON cl.id = ec.client_id
           ${where}
           ORDER BY cl.name, ec.name`,
        client_id ? [client_id] : []
      );
      res.json(rows);
    } catch (e) {
      console.error('[engineering-contracts:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load engineering contracts.' });
    }
  });

  app.get('/api/engineering-contracts/:id', requireAuth(), async (req, res) => {
    try {
      const { rows: ec } = await pool.query(
        `SELECT ec.*, cl.name AS client_name
           FROM engineering_contracts ec
           JOIN clients cl ON cl.id = ec.client_id
           WHERE ec.id = $1`, [req.params.id]
      );
      if (!ec[0]) return res.status(404).json({ error: 'Engineering contract not found' });
      // Include child contracts so the detail view can show the structure
      const { rows: contracts } = await pool.query(
        `SELECT c.*,
                (SELECT COUNT(*)::int FROM projects p
                   WHERE p.contract_id = c.id
                     AND COALESCE(p.is_rollup, FALSE) = FALSE) AS project_count
           FROM contracts c WHERE c.engineering_contract_id = $1
           ORDER BY c.contract_number`, [req.params.id]
      );
      // Include the umbrella's budget if it has one
      const { rows: budgets } = await pool.query(
        `SELECT b.*, COALESCE((SELECT SUM(allocated_amount) FROM budget_codes bc WHERE bc.budget_id = b.id), 0)::float AS allocated_total
           FROM budgets b WHERE b.engineering_contract_id = $1`, [req.params.id]
      );
      res.json({ ...ec[0], contracts, budgets });
    } catch (e) {
      console.error('[engineering-contracts:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load engineering contract.' });
    }
  });

  app.post('/api/engineering-contracts', requireAdmin, async (req, res) => {
    const { client_id, name, contract_number, loan_name, notes, program } = req.body || {};
    if (!client_id) return res.status(400).json({ error: 'client_id required' });
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    let normalizedProgram;
    try {
      normalizedProgram = normalizeProgram(program);
    } catch (e) {
      return res.status(e.statusCode || 400).json({ error: e.message });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO engineering_contracts (client_id, name, contract_number, loan_name, notes, program)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [client_id, String(name).trim(), contract_number || null, loan_name || null, notes || null, normalizedProgram]
      );
      broadcast('admin', 'engineering_contract_added', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'An engineering contract with this name already exists for this client' });
      console.error('[engineering-contracts:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create engineering contract.' });
    }
  });

  app.put('/api/engineering-contracts/:id', requireAdmin, async (req, res) => {
    const { name, contract_number, loan_name, notes, active, program } = req.body || {};
    try {
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (name !== undefined) { sets.push(`name = $${i++}`); params.push(String(name).trim()); }
      if (contract_number !== undefined) { sets.push(`contract_number = $${i++}`); params.push(contract_number || null); }
      if (loan_name !== undefined) { sets.push(`loan_name = $${i++}`); params.push(loan_name || null); }
      if (notes !== undefined) { sets.push(`notes = $${i++}`); params.push(notes || null); }
      if (active !== undefined) { sets.push(`active = $${i++}`); params.push(!!active); }
      if (program !== undefined) {
        let normalizedProgram;
        try {
          normalizedProgram = normalizeProgram(program);
        } catch (err) {
          return res.status(err.statusCode || 400).json({ error: err.message });
        }
        sets.push(`program = $${i++}`); params.push(normalizedProgram);
      }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      const { rows } = await pool.query(
        `UPDATE engineering_contracts SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Engineering contract not found' });
      broadcast('admin', 'engineering_contract_updated', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'An engineering contract with this name already exists for this client' });
      console.error('[engineering-contracts:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update engineering contract.' });
    }
  });

  app.delete('/api/engineering-contracts/:id', requireAdmin, async (req, res) => {
    try {
      // Pre-check: refuse to delete if contracts, budgets, or billing batches
      // still reference this EC. Explicit counts give the admin a friendlier
      // message than a constraint violation.
      //
      //   contracts        — FK ON DELETE SET NULL: would silently orphan them.
      //   budgets          — FK ON DELETE CASCADE: would silently wipe budgets.
      //   billing_batches  — FK ON DELETE SET NULL: would silently lose batch ref.
      const [contractsRes, budgetsRes, batchesRes] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int AS n FROM contracts WHERE engineering_contract_id = $1`, [req.params.id]),
        pool.query(`SELECT COUNT(*)::int AS n FROM budgets WHERE engineering_contract_id = $1`, [req.params.id]),
        pool.query(`SELECT COUNT(*)::int AS n FROM billing_batches WHERE engineering_contract_id = $1`, [req.params.id]),
      ]);
      const contractCount = contractsRes.rows[0].n;
      const budgetCount   = budgetsRes.rows[0].n;
      const batchCount    = batchesRes.rows[0].n;

      if (contractCount > 0 || budgetCount > 0 || batchCount > 0) {
        const parts = [];
        if (contractCount > 0) parts.push(`${contractCount} billing contract(s)`);
        if (budgetCount   > 0) parts.push(`${budgetCount} budget(s) (would be cascade-deleted)`);
        if (batchCount    > 0) parts.push(`${batchCount} billing batch(es) (would lose EC reference)`);
        return res.status(409).json({
          error: `Cannot delete — this engineering contract is still referenced by: ${parts.join(', ')}. Move or delete them first.`,
          contracts: contractCount,
          budgets: budgetCount,
          billing_batches: batchCount,
        });
      }

      const { rows } = await pool.query(
        `DELETE FROM engineering_contracts WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Engineering contract not found' });
      broadcast('admin', 'engineering_contract_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) {
      console.error('[engineering-contracts:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete engineering contract.' });
    }
  });

  // ─── EC-SCOPED SERVICE AREAS ────────────────────────────────────────────────

  app.get('/api/engineering-contracts/:id/service-areas', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, name, notes, work_order_number, created_at FROM ec_service_areas
          WHERE engineering_contract_id = $1
          ORDER BY name`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e) {
      console.error('[ec-wosa:sa-list]', e && e.message);
      res.status(500).json({ error: 'Failed to load service areas.' });
    }
  });

  app.post('/api/engineering-contracts/:id/service-areas', requireAdmin, async (req, res) => {
    const { name, notes, work_order_number } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name required' });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO ec_service_areas (engineering_contract_id, name, notes, work_order_number)
           VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, String(name).trim(), notes || null, work_order_number || null]
      );
      res.status(201).json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'A service area with this name already exists on this engineering contract.' });
      console.error('[ec-wosa:sa-create]', e && e.message);
      res.status(500).json({ error: 'Failed to create service area.' });
    }
  });

  app.put('/api/ec-service-areas/:id', requireAdmin, async (req, res) => {
    const { name, notes, work_order_number } = req.body || {};
    try {
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (name !== undefined) { sets.push(`name = $${i++}`); params.push(String(name).trim()); }
      if (notes !== undefined) { sets.push(`notes = $${i++}`); params.push(notes || null); }
      if (work_order_number !== undefined) { sets.push(`work_order_number = $${i++}`); params.push(work_order_number || null); }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      const { rows } = await pool.query(
        `UPDATE ec_service_areas SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Service area not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'A service area with this name already exists on this engineering contract.' });
      console.error('[ec-wosa:sa-update]', e && e.message);
      res.status(500).json({ error: 'Failed to update service area.' });
    }
  });

  app.delete('/api/ec-service-areas/:id', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `DELETE FROM ec_service_areas WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Service area not found' });
      res.status(204).end();
    } catch (e) {
      console.error('[ec-wosa:sa-delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete service area.' });
    }
  });

  // ─── EC-SCOPED WORK ORDERS ───────────────────────────────────────────────────

  app.get('/api/engineering-contracts/:id/work-orders', requireAdmin, async (req, res) => {
    const { service_area_id } = req.query;
    try {
      const where = service_area_id
        ? 'WHERE wo.engineering_contract_id = $1 AND wo.service_area_id = $2'
        : 'WHERE wo.engineering_contract_id = $1';
      const params = service_area_id ? [req.params.id, service_area_id] : [req.params.id];
      const { rows } = await pool.query(
        `SELECT wo.*, sa.name AS service_area_name
           FROM ec_work_orders wo
           LEFT JOIN ec_service_areas sa ON sa.id = wo.service_area_id
           ${where}
           ORDER BY wo.number`,
        params
      );
      res.json(rows);
    } catch (e) {
      console.error('[ec-wosa:wo-list]', e && e.message);
      res.status(500).json({ error: 'Failed to load work orders.' });
    }
  });

  app.post('/api/engineering-contracts/:id/work-orders', requireAdmin, async (req, res) => {
    const { number, description, service_area_id } = req.body || {};
    if (!number || !String(number).trim()) {
      return res.status(400).json({ error: 'number required' });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO ec_work_orders (engineering_contract_id, number, description, service_area_id)
           VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, String(number).trim(), description || null, service_area_id || null]
      );
      res.status(201).json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'A work order with this number already exists on this engineering contract.' });
      console.error('[ec-wosa:wo-create]', e && e.message);
      res.status(500).json({ error: 'Failed to create work order.' });
    }
  });

  app.put('/api/ec-work-orders/:id', requireAdmin, async (req, res) => {
    const { number, description, service_area_id } = req.body || {};
    try {
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (number !== undefined) { sets.push(`number = $${i++}`); params.push(String(number).trim()); }
      if (description !== undefined) { sets.push(`description = $${i++}`); params.push(description || null); }
      if (service_area_id !== undefined) { sets.push(`service_area_id = $${i++}`); params.push(service_area_id || null); }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      const { rows } = await pool.query(
        `UPDATE ec_work_orders SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Work order not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'A work order with this number already exists on this engineering contract.' });
      console.error('[ec-wosa:wo-update]', e && e.message);
      res.status(500).json({ error: 'Failed to update work order.' });
    }
  });

  app.delete('/api/ec-work-orders/:id', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `DELETE FROM ec_work_orders WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Work order not found' });
      res.status(204).end();
    } catch (e) {
      console.error('[ec-wosa:wo-delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete work order.' });
    }
  });
};
