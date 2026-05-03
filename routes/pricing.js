// routes/pricing.js — pricing entries (Job × Project Type × Billing Code → rate).
//
// Project creation pulls defaults from this list via /lookup; the
// settings panel manages CRUD; /gaps drives the red dot on the settings
// button (a combination is "missing" if there's an active job + active
// project_type pair with no pricing_entries row at all — billing-code
// breakdowns are optional).
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installPricingRoutes(app, pool, mw) {
  app.get('/api/pricing', async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT pe.*,
               j.name as job_name, j.is_permitting,
               pt.name as project_type_name
        FROM pricing_entries pe
        LEFT JOIN jobs j ON j.id = pe.job_id
        LEFT JOIN project_types pt ON pt.id = pe.project_type_id
        ORDER BY pt.name, j.name, pe.billing_code NULLS LAST
      `);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Look up the default rate/billing for a job+type (and optionally a billing code).
  // Used by the project create form to auto-fill the rate.
  app.get('/api/pricing/lookup', async (req, res) => {
    const { job_id, project_type_id, billing_code } = req.query;
    if (!job_id || !project_type_id) return res.status(400).json({ error: 'job_id and project_type_id required' });
    try {
      // Most specific (with code) first, then fall back to the no-code entry
      const { rows } = await pool.query(`
        SELECT * FROM pricing_entries
        WHERE job_id = $1 AND project_type_id = $2
          AND ($3::text IS NULL OR billing_code = $3 OR billing_code IS NULL)
        ORDER BY (billing_code = $3) DESC NULLS LAST
        LIMIT 1
      `, [job_id, project_type_id, billing_code || null]);
      res.json(rows[0] || null);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/pricing', async (req, res) => {
    const { job_id, project_type_id, billing_code, billing_type, rate, notes } = req.body;
    try {
      const { rows } = await pool.query(`
        INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate, notes)
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (job_id, project_type_id, billing_code)
        DO UPDATE SET billing_type = $4, rate = $5, notes = $6, updated_at = NOW()
        RETURNING *
      `, [job_id, project_type_id, billing_code || null, billing_type || 'hourly', rate, notes || null]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/pricing/:id', async (req, res) => {
    const { billing_type, rate, notes, billing_code } = req.body;
    try {
      const { rows } = await pool.query(`
        UPDATE pricing_entries SET
          billing_type = COALESCE($2, billing_type),
          rate = COALESCE($3, rate),
          notes = $4,
          billing_code = COALESCE($5, billing_code),
          updated_at = NOW()
        WHERE id = $1 RETURNING *
      `, [req.params.id, billing_type, rate, notes, billing_code]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/pricing/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM pricing_entries WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Returns the count of "missing pricing" combinations — the red dot in the
  // settings button is shown when this is > 0. A combination is "missing" if
  // there's an active job+project_type pair with no pricing_entries row.
  // (We don't enumerate every billing code — only require one default per job/type.)
  app.get('/api/pricing/gaps', async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT j.id as job_id, j.name as job_name,
               pt.id as project_type_id, pt.name as project_type_name
        FROM jobs j
        CROSS JOIN project_types pt
        WHERE j.active = true AND pt.active = true
          AND NOT EXISTS (
            SELECT 1 FROM pricing_entries pe
            WHERE pe.job_id = j.id AND pe.project_type_id = pt.id
          )
        ORDER BY pt.name, j.name
      `);
      res.json({ count: rows.length, gaps: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
