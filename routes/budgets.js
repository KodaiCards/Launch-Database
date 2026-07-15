// routes/budgets.js — budgets + budget_codes + by-area summary.
//
// Wave 176 fixes:
//   F1: logAudit fire-and-forget on all money mutations.
//   F2: IDOR ownership check on all :id routes.
//   F3: GET /by-area — elevate to requireManagerOrAdmin + scope concentrators
//       to budget's engineering_contract_id; cross-client leak closed.
//   F4: GET /api/budgets — elevate to requireManagerOrAdmin.
//   F5: GET /api/budget-codes — elevate to requireManagerOrAdmin.
//   F6: PUT :id silent 200 → 404 when row not found (budgets + budget_codes).
//   F7: Non-negative validation on total_amount / allocated_amount.
//
// Item 2 fix (prior wave): requireManagerOrAdmin on all mutation endpoints.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const { logAudit } = require('./_audit');

module.exports = function installBudgetsRoutes(app, pool, mw) {
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());
  // Wave 1.5 [UNGATED]: GET budget/budget-code endpoints lacked auth.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const { requirePermission } = require('./_permissions');
  const moneyView = requirePermission(pool, 'money.view');
  const manageBilling = requirePermission(pool, 'money.manage_billing');

  // ── Shared helper: ownership check ──────────────────────────────────────
  // Returns the budget row if the caller has access, else sends 404.
  // Ownership rules:
  //   admin          → always OK
  //   design_manager → budget's project must belong to team='design'
  //   permitting_manager → budget's project must belong to team='permitting'
  //   budget scoped to an EC (no project) → manager roles must have EC access —
  //     for EC-scoped budgets we allow any manager (EC does not carry a team).
  async function checkBudgetOwnership(req, res, budgetId) {
    const { rows } = await pool.query(
      `SELECT b.id, b.project_id, b.engineering_contract_id,
              j.team AS project_team
         FROM budgets b
         LEFT JOIN projects p  ON p.id  = b.project_id
         LEFT JOIN jobs     j  ON j.id  = p.job_id
        WHERE b.id = $1`,
      [budgetId]
    );
    if (!rows.length) {
      res.status(404).json({ error: 'Budget not found' });
      return null;
    }
    const budget = rows[0];
    const role = req.user && req.user.role;
    if (role === 'admin') return budget;
    // EC-scoped budgets: any manager role may access (EC has no team).
    if (!budget.project_id) return budget;
    // Project-scoped budgets: managers may only access their team's projects.
    if (role === 'design_manager'     && budget.project_team !== 'design')     { res.status(404).json({ error: 'Budget not found' }); return null; }
    if (role === 'permitting_manager' && budget.project_team !== 'permitting') { res.status(404).json({ error: 'Budget not found' }); return null; }
    return budget;
  }

  // ── F4: elevated from requireAuth to requireManagerOrAdmin ───────────────
  app.get('/api/budgets', moneyView, async (req, res) => {
    const { project_id, engineering_contract_id } = req.query;
    try {
      const where = [];
      const params = [];
      let i = 1;
      if (project_id) { where.push(`b.project_id = $${i++}`); params.push(project_id); }
      if (engineering_contract_id) {
        where.push(`b.engineering_contract_id = $${i++}`);
        params.push(engineering_contract_id);
      }
      const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const { rows } = await pool.query(
        `SELECT b.*,
                p.name AS project_name,
                ec.name AS engineering_contract_name
           FROM budgets b
           LEFT JOIN projects p ON p.id = b.project_id
           LEFT JOIN engineering_contracts ec ON ec.id = b.engineering_contract_id
           ${whereStr}
           ORDER BY b.created_at DESC`,
        params
      );
      res.json(rows);
    } catch (e) {
      console.error('[budgets:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load budgets.' });
    }
  });

  // F2: ownership check guards all :id routes.
  app.get('/api/budgets/:id/summary', moneyView, async (req, res) => {
    try {
      // F2: ownership check
      const budget = await checkBudgetOwnership(req, res, req.params.id);
      if (!budget) return;

      // Utilization rebuilt on the KEYSTONE (docs/budgets_design.md): per code,
      // projected = Σ expected of the code's service_area_jobs (estimated_amount,
      // else footage×rate); billed = Σ that job's non-void invoice_items. Replaces
      // the legacy projects.budget_code_id join (the projects tree is retiring).
      // budget_codes.job_id still narrows a code to one discipline when set.
      const { rows: codes } = await pool.query(`
        SELECT bc.*,
          j.name as job_name,
          COALESCE(SUM(COALESCE(NULLIF(saj.estimated_amount,0), COALESCE(saj.footage,0)*COALESCE(saj.rate,0), 0)), 0) AS projected,
          COALESCE(SUM(COALESCE(b.billed,0)), 0) AS billed,
          COUNT(saj.id) AS job_count,
          json_agg(json_build_object(
            'id', saj.id, 'team', saj.team, 'billing_type', saj.billing_type,
            'expected', COALESCE(NULLIF(saj.estimated_amount,0), COALESCE(saj.footage,0)*COALESCE(saj.rate,0), 0),
            'billed', COALESCE(b.billed,0)
          )) FILTER (WHERE saj.id IS NOT NULL) AS jobs
        FROM budget_codes bc
        LEFT JOIN jobs j ON j.id = bc.job_id
        LEFT JOIN service_area_jobs saj
          ON saj.budget_code_id = bc.id
         AND (bc.job_id IS NULL OR saj.job_id = bc.job_id)
        LEFT JOIN (SELECT ii.service_area_job_id, SUM(ii.amount) billed
                     FROM invoice_items ii JOIN invoices i ON i.id = ii.invoice_id
                    WHERE COALESCE(i.status,'') <> 'void'
                    GROUP BY ii.service_area_job_id) b ON b.service_area_job_id = saj.id
        WHERE bc.budget_id = $1
        GROUP BY bc.id, j.name
        ORDER BY bc.code
      `, [req.params.id]);

      const r2 = (n) => Math.round(parseFloat(n || 0) * 100) / 100;
      for (const c of codes) {
        c.allocated = r2(c.allocated_amount);
        c.billed = r2(c.billed);
        c.projected = r2(c.projected);
        c.remaining = r2(c.allocated - c.billed);
        c.projected_remaining = r2(c.allocated - c.projected);
        c.over_budget = c.projected > c.allocated ? r2(c.projected - c.allocated) : 0;
        c.spent = c.billed; // back-compat alias for the legacy field name
      }
      const sumK = (k) => r2(codes.reduce((s, c) => s + parseFloat(c[k] || 0), 0));
      const total_allocated = sumK('allocated'), total_billed = sumK('billed'), total_projected = sumK('projected');

      res.json({
        ...budget,
        codes,
        total_allocated,
        total_billed,
        total_projected,
        total_remaining: r2(total_allocated - total_billed),
        total_projected_remaining: r2(total_allocated - total_projected),
        total_spent: total_billed, // back-compat alias
      });
    } catch (e) {
      console.error('[budgets:summary]', e && e.message);
      res.status(500).json({ error: 'Failed to load budget summary.' });
    }
  });

  app.post('/api/budgets', manageBilling, async (req, res) => {
    const { project_id, engineering_contract_id, name, total_amount, notes } = req.body;
    // Exactly one of project_id / engineering_contract_id must be set — the
    // CHECK constraint enforces this at the DB level, but rejecting up front
    // with a clear error message is friendlier than a 500.
    const hasProj = !!project_id;
    const hasEng = !!engineering_contract_id;
    if (hasProj === hasEng) {
      return res.status(400).json({
        error: 'A budget must scope to EXACTLY one of: project_id, engineering_contract_id',
      });
    }
    // F7: non-negative validation on total_amount
    const amount = Number(total_amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'total_amount must be non-negative' });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO budgets (project_id, engineering_contract_id, name, total_amount, notes)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [project_id || null, engineering_contract_id || null, name, amount, notes || null]
      );
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget.create',
        entity_type: 'budget',
        entity_id: rows[0].id,
        before: null,
        after: rows[0],
        source: 'admin',
      }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[budgets:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create budget.' });
    }
  });

  app.put('/api/budgets/:id', manageBilling, async (req, res) => {
    const { name, total_amount, notes } = req.body;
    // F2: ownership check
    const budget = await checkBudgetOwnership(req, res, req.params.id);
    if (!budget) return;
    // F7: non-negative validation on total_amount
    const amount = Number(total_amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'total_amount must be non-negative' });
    }
    try {
      // F1: capture before state for audit
      const { rows: beforeRows } = await pool.query('SELECT * FROM budgets WHERE id=$1', [req.params.id]);
      const before = beforeRows[0] || null;

      const { rows } = await pool.query(
        `UPDATE budgets SET name=$1, total_amount=$2, notes=$3 WHERE id=$4 RETURNING *`,
        [name, amount, notes || null, req.params.id]
      );
      // F6: 404 when row not found (row should always be found after ownership check, but defend anyway)
      if (!rows.length) return res.status(404).json({ error: 'Budget not found' });
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget.update',
        entity_type: 'budget',
        entity_id: rows[0].id,
        before,
        after: rows[0],
        source: 'admin',
      }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[budgets:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update budget.' });
    }
  });

  app.delete('/api/budgets/:id', manageBilling, async (req, res) => {
    // F2: ownership check
    const budget = await checkBudgetOwnership(req, res, req.params.id);
    if (!budget) return;
    try {
      // F1: capture before state for audit
      const { rows: beforeRows } = await pool.query('SELECT * FROM budgets WHERE id=$1', [req.params.id]);
      const before = beforeRows[0] || null;

      await pool.query('DELETE FROM budgets WHERE id=$1', [req.params.id]);
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget.delete',
        entity_type: 'budget',
        entity_id: req.params.id,
        before,
        after: null,
        source: 'admin',
      }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[budgets:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete budget.' });
    }
  });

  // Budget summary broken down by area/concentrator. Used by the budget
  // detail modal's "By area" tab to show per-concentrator spend.
  // F3: elevated to requireManagerOrAdmin + scoped to budget's EC.
  app.get('/api/budgets/:id/by-area', moneyView, async (req, res) => {
    try {
      // F2: ownership check
      const budget = await checkBudgetOwnership(req, res, req.params.id);
      if (!budget) return;

      // F3: scope concentrators to this budget's engineering_contract_id.
      // If the budget is project-scoped (no EC), fall back to that project's EC.
      let ecId = budget.engineering_contract_id;
      if (!ecId && budget.project_id) {
        const { rows: projRows } = await pool.query(
          'SELECT engineering_contract_id FROM projects WHERE id=$1',
          [budget.project_id]
        );
        ecId = projRows[0] && projRows[0].engineering_contract_id;
      }

      // Build the concentrators filter. If no EC is resolvable (pure-project
      // budget with no EC link), return empty areas rather than leaking all.
      let concentratorsClause;
      let concentratorsParams;
      if (ecId) {
        concentratorsClause = `WHERE c.active = true
          AND c.id IN (
            SELECT DISTINCT p2.concentrator_id
              FROM projects p2
             WHERE p2.engineering_contract_id = $1
               AND p2.concentrator_id IS NOT NULL
          )`;
        concentratorsParams = [ecId];
      } else {
        // No EC resolvable — scope to concentrators linked to this specific project
        concentratorsClause = `WHERE c.active = true
          AND c.id IN (
            SELECT DISTINCT p2.concentrator_id
              FROM projects p2
             WHERE p2.id = $1
               AND p2.concentrator_id IS NOT NULL
          )`;
        concentratorsParams = [budget.project_id];
      }

      const { rows } = await pool.query(`
        SELECT
          c.id as concentrator_id,
          c.area_name,
          c.work_order_number,
          c.contract_label,
          COUNT(DISTINCT p.id) as project_count,
          COALESCE(SUM(
            CASE
              WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          ), 0) as spent,
          json_agg(json_build_object(
            'id', p.id, 'name', p.name, 'project_type', p.project_type,
            'status', p.status,
            'earned', CASE
              WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          )) FILTER (WHERE p.id IS NOT NULL) as projects
        FROM concentrators c
        LEFT JOIN projects p
          ON p.concentrator_id = c.id
         AND COALESCE(p.is_rollup, FALSE) = FALSE
        ${concentratorsClause}
        GROUP BY c.id, c.area_name, c.work_order_number, c.contract_label
        ORDER BY c.contract_label, c.area_name
      `, concentratorsParams);

      const budgetTotal = parseFloat(budget.total_amount || 0);
      const totalSpent = rows.reduce((s, r) => s + parseFloat(r.spent || 0), 0);

      res.json({
        budget_total: budgetTotal,
        total_spent: totalSpent,
        total_remaining: budgetTotal - totalSpent,
        areas: rows
      });
    } catch (e) {
      console.error('[budgets:by-area]', e && e.message);
      res.status(500).json({ error: 'Failed to load budget by-area summary.' });
    }
  });

  // ─── BUDGET CODES ─────────────────────────────────────────────────────────

  // F5: elevated from requireAuth to requireManagerOrAdmin
  app.get('/api/budget-codes', moneyView, async (req, res) => {
    const { budget_id } = req.query;
    // F5: when budget_id is supplied, apply ownership check
    if (budget_id) {
      const budget = await checkBudgetOwnership(req, res, budget_id);
      if (!budget) return;
    }
    try {
      const q = budget_id
        ? 'SELECT * FROM budget_codes WHERE budget_id=$1 ORDER BY code'
        : 'SELECT bc.*, b.name as budget_name FROM budget_codes bc JOIN budgets b ON b.id=bc.budget_id ORDER BY b.name, bc.code';
      const { rows } = await pool.query(q, budget_id ? [budget_id] : []);
      res.json(rows);
    } catch (e) {
      console.error('[budget-codes:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load budget codes.' });
    }
  });

  app.post('/api/budget-codes', manageBilling, async (req, res) => {
    const { budget_id, code, description, allocated_amount, job_id } = req.body;
    // F7: non-negative validation on allocated_amount
    const amount = Number(allocated_amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'allocated_amount must be non-negative' });
    }
    try {
      // F2: verify caller has access to the parent budget
      const budget = await checkBudgetOwnership(req, res, budget_id);
      if (!budget) return;

      const { rows } = await pool.query(
        `INSERT INTO budget_codes (budget_id, code, description, allocated_amount, job_id)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [budget_id, code, description || null, amount, job_id || null]
      );
      // Recalculate budget total from sum of codes
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [budget_id]
      );
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget_code.create',
        entity_type: 'budget_code',
        entity_id: rows[0].id,
        before: null,
        after: rows[0],
        source: 'admin',
      }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[budget-codes:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create budget code.' });
    }
  });

  app.put('/api/budget-codes/:id', manageBilling, async (req, res) => {
    const { code, description, allocated_amount, job_id } = req.body;
    // F7: non-negative validation on allocated_amount
    const amount = Number(allocated_amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'allocated_amount must be non-negative' });
    }
    try {
      // F1: capture before state for audit; also gives us budget_id for F2 check
      const { rows: beforeRows } = await pool.query(
        'SELECT * FROM budget_codes WHERE id=$1',
        [req.params.id]
      );
      // F6: 404 when row not found
      if (!beforeRows.length) return res.status(404).json({ error: 'Budget code not found' });
      const before = beforeRows[0];

      // F2: verify caller has access to the parent budget
      const budget = await checkBudgetOwnership(req, res, before.budget_id);
      if (!budget) return;

      const { rows } = await pool.query(
        `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3, job_id=$4
         WHERE id=$5 RETURNING *`,
        [code, description || null, amount, job_id || null, req.params.id]
      );
      // F6: should always have a row here, but be defensive
      if (!rows.length) return res.status(404).json({ error: 'Budget code not found' });
      // Recalculate budget total
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [rows[0].budget_id]
      );
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget_code.update',
        entity_type: 'budget_code',
        entity_id: rows[0].id,
        before,
        after: rows[0],
        source: 'admin',
      }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[budget-codes:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update budget code.' });
    }
  });

  app.delete('/api/budget-codes/:id', manageBilling, async (req, res) => {
    try {
      // F1: capture before state for audit; also gives us budget_id for F2 check
      const { rows: beforeRows } = await pool.query(
        'SELECT * FROM budget_codes WHERE id=$1',
        [req.params.id]
      );
      if (!beforeRows.length) return res.status(404).json({ error: 'Budget code not found' });
      const before = beforeRows[0];

      // F2: verify caller has access to the parent budget
      const budget = await checkBudgetOwnership(req, res, before.budget_id);
      if (!budget) return;

      const { rows } = await pool.query('DELETE FROM budget_codes WHERE id=$1 RETURNING budget_id', [req.params.id]);
      // Recalculate budget total
      if (rows[0]) {
        await pool.query(
          `UPDATE budgets SET total_amount = (
            SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
          ) WHERE id=$1`, [rows[0].budget_id]
        );
      }
      // F1: audit log — fire-and-forget
      logAudit(pool, {
        req,
        action: 'budget_code.delete',
        entity_type: 'budget_code',
        entity_id: req.params.id,
        before,
        after: null,
        source: 'admin',
      }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[budget-codes:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete budget code.' });
    }
  });
};
