// routes/jobs.js — work-category CRUD + override-reset + rate-propagate.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3. Jobs
// (Inspector / Resident Engineer / Permitting / etc.) are the work-category
// entity that replaces the legacy project_type enum for billing logic.
// Each job carries:
//   - default_billing_type ('hourly' | 'footage')
//   - default_rate ($/hr or NULL when rate is decided per-project)
//   - is_permitting (triggers the special miles → hours calc)
//   - team (which portal manager class can see entries on it)
//   - billing_code (PSC RUS code)
//   - for_psc_client / for_generic_client (which client class the job
//     applies to; controls visibility in the project-create dropdown)
//
// The bootstrap reseed in server.js writes canonical jobs at boot; the
// manually_overridden_at column lets admin overrides survive that. PUT
// stamps manually_overridden_at when a config field changes, and
// /reset-override clears it so the next reseed reverts to canonical.

module.exports = function installJobsRoutes(app, pool, mw) {
  // No middleware bag is consumed — these endpoints have no role gate
  // beyond the global authMiddleware that runs upstream of every route.

  app.get('/api/jobs', async (req, res) => {
    try {
      // Optional client_id filter — when set, only return jobs whose
      // for_psc_client / for_generic_client flag matches the client's class.
      // This makes the admin and portal job dropdowns behave consistently.
      const clientId = req.query.client_id || null;
      let isPsc = null;
      if (clientId) {
        const c = await pool.query('SELECT is_rus FROM clients WHERE id = $1', [clientId]);
        if (c.rows.length) isPsc = c.rows[0].is_rus === true;
      }
      const conds = [`active = true`];
      if (isPsc === true) conds.push(`for_psc_client = true`);
      else if (isPsc === false) conds.push(`for_generic_client = true`);
      const { rows } = await pool.query(
        `SELECT * FROM jobs WHERE ${conds.join(' AND ')} ORDER BY name`
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Fetch a single job by id regardless of active state. The list endpoint
  // excludes inactive jobs, but the project-edit modal still needs to be
  // able to surface a now-deactivated job that's referenced by an existing
  // project so the user can save without being forced to re-pick the job.
  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Job not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // DIAGNOSTIC — dumps raw job rows including inactive, with full column list.
  // Use this to verify schema migration actually applied. Returns JSON like:
  //   { count: 12, columns: [...], rows: [...] }
  // Hit it via: https://your-admin-url/api/_debug/jobs
  app.get('/api/_debug/jobs', async (req, res) => {
    try {
      const cols = await pool.query(
        `SELECT column_name, data_type FROM information_schema.columns
         WHERE table_name = 'jobs' ORDER BY ordinal_position`
      );
      const rows = await pool.query('SELECT * FROM jobs ORDER BY active DESC, name');
      res.json({
        count: rows.rows.length,
        active_count: rows.rows.filter(r => r.active).length,
        columns: cols.rows,
        rows: rows.rows
      });
    } catch (e) { res.status(500).json({ error: e.message, stack: e.stack }); }
  });

  app.post('/api/jobs', async (req, res) => {
    const {
      name, default_billing_type = 'hourly', default_rate = null,
      is_permitting = false, notes = null, team = null,
      billing_code = null, for_psc_client = true, for_generic_client = true
    } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
    try {
      const teamVal = team === '' ? null : team;
      const { rows } = await pool.query(
        `INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting,
                           notes, team, billing_code, for_psc_client, for_generic_client)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (name) DO UPDATE SET
           active = true,
           team = COALESCE(EXCLUDED.team, jobs.team)
         RETURNING *`,
        [String(name).trim(), default_billing_type, default_rate, is_permitting,
         notes, teamVal, billing_code, for_psc_client, for_generic_client]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/jobs/:id', async (req, res) => {
    // Only update fields explicitly present in the request body. This makes
    // partial updates safe — e.g. PUT {name:"X"} only changes name, leaves
    // default_rate and notes alone. The previous version always wrote $4/$6
    // unconditionally, which meant any partial update wiped rate and notes
    // back to NULL.
    const allowed = ['name', 'default_billing_type', 'default_rate', 'is_permitting',
                     'notes', 'active', 'team', 'billing_code', 'for_psc_client',
                     'for_generic_client'];
    // These fields, when changed, mark the job as manually-overridden so the
    // bootstrap reseed won't revert them on next deploy. Excludes 'notes' and
    // 'active' (those are bookkeeping, don't represent a config decision worth
    // pinning) and 'name' (renames are name-changes, not config overrides).
    const overrideTriggers = ['default_billing_type', 'default_rate', 'team',
                               'billing_code', 'for_psc_client', 'for_generic_client',
                               'is_permitting'];
    const setClauses = [];
    const values = [req.params.id];
    let i = 2;
    let stampOverride = false;
    for (const field of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        let v = req.body[field];
        // team: empty string maps to NULL ("Both / Unassigned")
        if (field === 'team' && v === '') v = null;
        setClauses.push(`${field} = $${i}`);
        values.push(v);
        i++;
        if (overrideTriggers.includes(field)) stampOverride = true;
      }
    }
    if (!setClauses.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    // Stamp manually_overridden_at when the admin changes a canonical config
    // field. After this, the next bootstrap reseed will preserve admin's
    // choices instead of reverting to the hardcoded canonical values.
    if (stampOverride) setClauses.push(`manually_overridden_at = NOW()`);
    try {
      const sql = `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`;
      const { rows } = await pool.query(sql, values);
      if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Reset a job's manual-override flag. After this, the next bootstrap reseed
  // will overwrite the job's canonical fields back to the hardcoded defaults.
  // This is the escape hatch when admin overrode something by mistake or wants
  // to opt back in to system-managed defaults.
  app.post('/api/jobs/:id/reset-override', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE jobs SET manually_overridden_at = NULL WHERE id = $1 RETURNING id, name`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
      res.json({ ok: true, name: rows[0].name });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Universal rate propagation: apply this job's current default_rate to ALL
  // existing real (non-rollup) projects that use this job. Useful when the
  // admin updates a job's rate and wants the change to flow through to
  // historical projects rather than only affecting new ones.
  app.put('/api/jobs/:id/propagate-rate', async (req, res) => {
    try {
      const j = await pool.query('SELECT default_rate FROM jobs WHERE id = $1', [req.params.id]);
      if (!j.rows.length) return res.status(404).json({ error: 'Job not found' });
      const rate = j.rows[0].default_rate;
      const r = await pool.query(
        `UPDATE projects
           SET billing_rate = $2
         WHERE job_id = $1 AND COALESCE(is_rollup, false) = false`,
        [req.params.id, rate]
      );
      res.json({ ok: true, updated: r.rowCount, applied_rate: rate });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    try {
      // Soft-delete via active=false to preserve historical references in projects
      await pool.query('UPDATE jobs SET active = false WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
