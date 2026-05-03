// routes/engineering_contracts.js — umbrella above one or more billing
// contracts. Used when a single agreement (e.g. "RUS 217 Engineering
// Contract GA 1706 -A72") spans multiple billing contracts (e.g. 515-3,
// 515-4, 515-5) and you want the BUDGET to live at the umbrella level
// rather than per-project. All endpoints admin-only.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installEngineeringContractsRoutes(app, pool, mw) {
  const { requireAdmin } = mw;

  app.get('/api/engineering-contracts', async (req, res) => {
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
                   WHERE c.engineering_contract_id = ec.id)::int AS project_count
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

  app.get('/api/engineering-contracts/:id', async (req, res) => {
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
        `SELECT c.*, (SELECT COUNT(*)::int FROM projects p WHERE p.contract_id = c.id) AS project_count
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
    const { client_id, name, contract_number, loan_name, notes } = req.body || {};
    if (!client_id) return res.status(400).json({ error: 'client_id required' });
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    try {
      const { rows } = await pool.query(
        `INSERT INTO engineering_contracts (client_id, name, contract_number, loan_name, notes)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [client_id, String(name).trim(), contract_number || null, loan_name || null, notes || null]
      );
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'An engineering contract with this name already exists for this client' });
      console.error('[engineering-contracts:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create engineering contract.' });
    }
  });

  app.put('/api/engineering-contracts/:id', requireAdmin, async (req, res) => {
    const { name, contract_number, loan_name, notes, active } = req.body || {};
    try {
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (name !== undefined) { sets.push(`name = $${i++}`); params.push(String(name).trim()); }
      if (contract_number !== undefined) { sets.push(`contract_number = $${i++}`); params.push(contract_number || null); }
      if (loan_name !== undefined) { sets.push(`loan_name = $${i++}`); params.push(loan_name || null); }
      if (notes !== undefined) { sets.push(`notes = $${i++}`); params.push(notes || null); }
      if (active !== undefined) { sets.push(`active = $${i++}`); params.push(!!active); }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      const { rows } = await pool.query(
        `UPDATE engineering_contracts SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Engineering contract not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'An engineering contract with this name already exists for this client' });
      console.error('[engineering-contracts:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update engineering contract.' });
    }
  });

  app.delete('/api/engineering-contracts/:id', requireAdmin, async (req, res) => {
    try {
      // Pre-check: refuse to delete if contracts still point here. RESTRICT
      // would also catch this but the explicit message is friendlier.
      const { rows: kids } = await pool.query(
        `SELECT COUNT(*)::int AS n FROM contracts WHERE engineering_contract_id = $1`,
        [req.params.id]
      );
      if (kids[0].n > 0) {
        return res.status(409).json({
          error: `Cannot delete — ${kids[0].n} contract(s) still belong to this engineering contract. Move or delete them first.`,
        });
      }
      const { rows } = await pool.query(
        `DELETE FROM engineering_contracts WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Engineering contract not found' });
      res.json({ ok: true });
    } catch (e) {
      console.error('[engineering-contracts:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete engineering contract.' });
    }
  });
};
