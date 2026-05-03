// routes/budgets.js — budgets + budget_codes + by-area summary.
//
// A budget scopes to EXACTLY one of project_id OR engineering_contract_id
// (CHECK constraint enforces it; the POST handler also validates up front
// for a friendlier error). budget_codes are line items inside a budget;
// their `allocated_amount` rolls up into `budgets.total_amount` after any
// CRUD via the recompute query that runs at the end of each handler.
//
// /api/budgets/:id/summary returns the budget plus a `codes` array where
// each code has its own `spent` and child projects.
// /api/budgets/:id/by-area is the same shape but grouped by concentrator
// instead of by code — used by the budget detail modal's "By area" tab.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installBudgetsRoutes(app, pool, mw) {
  app.get('/api/budgets', async (req, res) => {
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
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/budgets/:id/summary', async (req, res) => {
    try {
      // Get the budget
      const { rows: budgetRows } = await pool.query(
        `SELECT b.*, p.name as project_name FROM budgets b
         LEFT JOIN projects p ON p.id = b.project_id WHERE b.id = $1`, [req.params.id]
      );
      if (!budgetRows.length) return res.status(404).json({ error: 'Budget not found' });
      const budget = budgetRows[0];

      // Get all codes with spent amounts. Spent = sum of earned revenue from
      // every project linked to this budget_code, optionally filtered by job:
      // if budget_codes.job_id is set, ONLY projects with the matching job count
      // toward the code's "spent" total. NULL job_id = applies to any job.
      const { rows: codes } = await pool.query(`
        SELECT bc.*,
          j.name as job_name,
          COALESCE(SUM(
            CASE
              WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
              WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
              ELSE 0
            END
          ), 0) as spent,
          COUNT(proj.id) as project_count,
          json_agg(json_build_object(
            'id', proj.id, 'name', proj.name, 'status', proj.status,
            'project_type', proj.project_type,
            'job_id', proj.job_id,
            'billable', CASE
              WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
              WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
              ELSE 0
            END
          )) FILTER (WHERE proj.id IS NOT NULL) as projects
        FROM budget_codes bc
        LEFT JOIN jobs j ON j.id = bc.job_id
        LEFT JOIN projects proj ON proj.budget_code_id = bc.id
          AND (bc.job_id IS NULL OR proj.job_id = bc.job_id)
        WHERE bc.budget_id = $1
        GROUP BY bc.id, j.name
        ORDER BY bc.code
      `, [req.params.id]);

      const totalAllocated = codes.reduce((s, c) => s + parseFloat(c.allocated_amount || 0), 0);
      const totalSpent = codes.reduce((s, c) => s + parseFloat(c.spent || 0), 0);

      res.json({
        ...budget,
        codes,
        total_allocated: totalAllocated,
        total_spent: totalSpent,
        total_remaining: totalAllocated - totalSpent
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/budgets', async (req, res) => {
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
    try {
      const { rows } = await pool.query(
        `INSERT INTO budgets (project_id, engineering_contract_id, name, total_amount, notes)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [project_id || null, engineering_contract_id || null, name, total_amount || 0, notes || null]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/budgets/:id', async (req, res) => {
    const { name, total_amount, notes } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE budgets SET name=$1, total_amount=$2, notes=$3 WHERE id=$4 RETURNING *`,
        [name, total_amount, notes || null, req.params.id]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/budgets/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM budgets WHERE id=$1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Budget summary broken down by area/concentrator. Used by the budget
  // detail modal's "By area" tab to show per-concentrator spend.
  app.get('/api/budgets/:id/by-area', async (req, res) => {
    try {
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
        LEFT JOIN projects p ON p.concentrator_id = c.id
        WHERE c.active = true
        GROUP BY c.id, c.area_name, c.work_order_number, c.contract_label
        ORDER BY c.contract_label, c.area_name
      `);

      // Get budget total
      const { rows: budgetRows } = await pool.query('SELECT total_amount FROM budgets WHERE id=$1', [req.params.id]);
      const budgetTotal = budgetRows[0] ? parseFloat(budgetRows[0].total_amount) : 0;
      const totalSpent = rows.reduce((s, r) => s + parseFloat(r.spent || 0), 0);

      res.json({
        budget_total: budgetTotal,
        total_spent: totalSpent,
        total_remaining: budgetTotal - totalSpent,
        areas: rows
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── BUDGET CODES ─────────────────────────────────────────────────────────

  app.get('/api/budget-codes', async (req, res) => {
    const { budget_id } = req.query;
    try {
      const q = budget_id
        ? 'SELECT * FROM budget_codes WHERE budget_id=$1 ORDER BY code'
        : 'SELECT bc.*, b.name as budget_name FROM budget_codes bc JOIN budgets b ON b.id=bc.budget_id ORDER BY b.name, bc.code';
      const { rows } = await pool.query(q, budget_id ? [budget_id] : []);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/budget-codes', async (req, res) => {
    const { budget_id, code, description, allocated_amount, job_id } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO budget_codes (budget_id, code, description, allocated_amount, job_id)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [budget_id, code, description || null, allocated_amount || 0, job_id || null]
      );
      // Recalculate budget total from sum of codes
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [budget_id]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/budget-codes/:id', async (req, res) => {
    const { code, description, allocated_amount, job_id } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3, job_id=$4
         WHERE id=$5 RETURNING *`,
        [code, description || null, allocated_amount || 0, job_id || null, req.params.id]
      );
      // Recalculate budget total
      if (rows[0]) {
        await pool.query(
          `UPDATE budgets SET total_amount = (
            SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
          ) WHERE id=$1`, [rows[0].budget_id]
        );
      }
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/budget-codes/:id', async (req, res) => {
    try {
      const { rows } = await pool.query('DELETE FROM budget_codes WHERE id=$1 RETURNING budget_id', [req.params.id]);
      // Recalculate budget total
      if (rows[0]) {
        await pool.query(
          `UPDATE budgets SET total_amount = (
            SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
          ) WHERE id=$1`, [rows[0].budget_id]
        );
      }
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
