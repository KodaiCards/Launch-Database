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
  // Items 2 + 16: role gates added to mutation endpoints and _debug endpoint.
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || requireAdmin;

  // Wave 1.5 [UNGATED]: GET /api/jobs and GET /api/jobs/:id were missing auth.
  app.get('/api/jobs', requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']), async (req, res) => {
    try {
      // Filter precedence (most specific first):
      //   1. program (rus|bau|gfr|other) provided directly → filter
      //      program_scope IN (rus|non_rus, 'shared') as appropriate.
      //      Used by the project modal when the user picks Program
      //      explicitly.
      //   2. engineering_contract_id provided → load that contract's
      //      program and filter:
      //        program='rus'         → program_scope IN ('rus', 'shared')
      //        program in (bau,gfr,other) → program_scope IN ('non_rus', 'shared')
      //        program IS NULL       → no program filter (admin must classify)
      //   3. client_id provided (no EC yet) → look at the client's mix of
      //      EC programs:
      //        any RUS EC AND any non-RUS EC → all program_scope values
      //          (including 'shared') so the picker doesn't hide work
      //          they might choose. PSC's mixed case if it ever arises.
      //        only RUS ECs   → program_scope IN ('rus', 'shared')
      //        only other ECs → program_scope IN ('non_rus', 'shared')
      //        no ECs         → all (treat fresh client as generic-friendly)
      //   4. No client → return every active job.
      const clientId = req.query.client_id || null;
      const ecId = req.query.engineering_contract_id || null;
      const explicitProgram = req.query.program ? String(req.query.program).trim().toLowerCase() : null;

      const conds = [`active = true`];

      if (explicitProgram) {
        if (explicitProgram === 'rus') {
          conds.push(`program_scope IN ('rus','shared')`);
        } else if (['bau','gfr','other'].includes(explicitProgram)) {
          conds.push(`program_scope IN ('non_rus','shared')`);
        }
        // Unknown program string: ignore (don't gate). Frontend should
        // only ever pass a valid enum value.
      } else if (ecId) {
        const ec = await pool.query(
          'SELECT program FROM engineering_contracts WHERE id = $1',
          [ecId]
        );
        if (ec.rows.length) {
          const program = ec.rows[0].program;
          if (program === 'rus') {
            conds.push(`program_scope IN ('rus','shared')`);
          } else if (program) {
            conds.push(`program_scope IN ('non_rus','shared')`);
          }
          // program=NULL: don't gate — admin hasn't classified it yet.
        }
      } else if (clientId) {
        const mix = await pool.query(
          `SELECT
             SUM(CASE WHEN program = 'rus' THEN 1 ELSE 0 END)::int AS rus_count,
             SUM(CASE WHEN program IS NOT NULL AND program <> 'rus' THEN 1 ELSE 0 END)::int AS other_count,
             COUNT(*)::int AS total_ec_count
           FROM engineering_contracts
           WHERE client_id = $1`,
          [clientId]
        );
        const { rus_count, other_count, total_ec_count } = mix.rows[0];
        const hasRus   = rus_count > 0;
        const hasOther = other_count > 0 || total_ec_count === 0;

        if (hasRus && hasOther) {
          // Mixed: don't gate — show every active job (RUS, non-RUS, shared).
        } else if (hasRus) {
          conds.push(`program_scope IN ('rus','shared')`);
        } else {
          conds.push(`program_scope IN ('non_rus','shared')`);
        }
      }
      const { rows } = await pool.query(
        `SELECT * FROM jobs WHERE ${conds.join(' AND ')} ORDER BY name`
      );
      res.json(rows);
    } catch (e) {
      console.error('[jobs:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load jobs.' });
    }
  });

  // Fetch a single job by id regardless of active state. The list endpoint
  // excludes inactive jobs, but the project-edit modal still needs to be
  // able to surface a now-deactivated job that's referenced by an existing
  // project so the user can save without being forced to re-pick the job.
  app.get('/api/jobs/:id', requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']), async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Job not found' });
      res.json(rows[0]);
    } catch (e) {
      console.error('[jobs:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load job.' });
    }
  });

  // DIAGNOSTIC — dumps raw job rows including inactive, with full column list.
  // Item 16 fix: requireAdmin gate added (was unprotected, leaked information_schema).
  app.get('/api/_debug/jobs', requireAdmin, async (req, res) => {
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
    } catch (e) {
      console.error('[jobs:debug]', e && e.message, e && e.stack);
      res.status(500).json({ error: 'Failed to load debug jobs.' });
    }
  });

  // Allowed program_scope values match the CHECK constraint in
  // migrations/0006_jobs_program_scope.sql.
  const ALLOWED_PROGRAM_SCOPES = ['rus', 'non_rus', 'shared'];

  // Item 2 fix: requireAdmin added (mutation endpoint missing role gate)
  app.post('/api/jobs', requireAdmin, async (req, res) => {
    const {
      name, default_billing_type = 'hourly', default_rate = null,
      is_permitting = false, notes = null, team = null,
      billing_code = null,
      for_psc_client, for_generic_client,        // legacy bools (still accepted)
      program_scope                               // new enum (preferred)
    } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });

    // Resolve program_scope: prefer the explicit enum, fall back to inferring
    // from the legacy booleans for clients that haven't been updated yet.
    let resolvedScope = null;
    if (program_scope !== undefined && program_scope !== null && program_scope !== '') {
      const v = String(program_scope).trim().toLowerCase();
      if (!ALLOWED_PROGRAM_SCOPES.includes(v)) {
        return res.status(400).json({ error: `Invalid program_scope "${program_scope}" — allowed: ${ALLOWED_PROGRAM_SCOPES.join(', ')}.` });
      }
      resolvedScope = v;
    } else {
      const psc = for_psc_client !== undefined ? !!for_psc_client : true;
      const gen = for_generic_client !== undefined ? !!for_generic_client : true;
      resolvedScope = (psc && gen) ? 'shared' : (psc ? 'rus' : (gen ? 'non_rus' : 'shared'));
    }

    // Owner rule: RUS jobs require a billing code (RUS reporting needs the
    // code on every line). Non-RUS / Shared don't.
    if (resolvedScope === 'rus' && (!billing_code || !String(billing_code).trim())) {
      return res.status(400).json({ error: 'RUS jobs require a billing code. Either set a billing code or change program_scope to non_rus / shared.' });
    }

    // Mirror the new scope into the legacy bools so old code paths see
    // consistent values until those columns are dropped.
    const mirrorPsc = resolvedScope === 'rus' || resolvedScope === 'shared';
    const mirrorGen = resolvedScope === 'non_rus' || resolvedScope === 'shared';

    try {
      const teamVal = team === '' ? null : team;
      const { rows } = await pool.query(
        `INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting,
                           notes, team, billing_code,
                           for_psc_client, for_generic_client, program_scope)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (name) DO UPDATE SET
           active = true,
           team = COALESCE(EXCLUDED.team, jobs.team)
         RETURNING *`,
        [String(name).trim(), default_billing_type, default_rate, is_permitting,
         notes, teamVal, billing_code,
         mirrorPsc, mirrorGen, resolvedScope]
      );
      res.json(rows[0]);
    } catch (e) {
      console.error('[jobs:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create job.' });
    }
  });

  // Item 2 fix: requireAdmin added
  app.put('/api/jobs/:id', requireAdmin, async (req, res) => {
    // Only update fields explicitly present in the request body. This makes
    // partial updates safe — e.g. PUT {name:"X"} only changes name, leaves
    // default_rate and notes alone. The previous version always wrote $4/$6
    // unconditionally, which meant any partial update wiped rate and notes
    // back to NULL.
    const allowed = ['name', 'default_billing_type', 'default_rate', 'is_permitting',
                     'notes', 'active', 'team', 'billing_code', 'for_psc_client',
                     'for_generic_client', 'program_scope'];
    // These fields, when changed, mark the job as manually-overridden so the
    // bootstrap reseed won't revert them on next deploy. Excludes 'notes' and
    // 'active' (those are bookkeeping, don't represent a config decision worth
    // pinning) and 'name' (renames are name-changes, not config overrides).
    const overrideTriggers = ['default_billing_type', 'default_rate', 'team',
                               'billing_code', 'for_psc_client', 'for_generic_client',
                               'is_permitting', 'program_scope'];

    // Validate program_scope and (when scope changes) keep the legacy bools
    // in sync so old query paths see consistent values. Also enforce the
    // RUS-needs-billing-code rule on PUT.
    if (Object.prototype.hasOwnProperty.call(req.body, 'program_scope')) {
      const scope = String(req.body.program_scope || '').trim().toLowerCase();
      if (!['rus','non_rus','shared'].includes(scope)) {
        return res.status(400).json({ error: `Invalid program_scope "${req.body.program_scope}" — allowed: rus, non_rus, shared.` });
      }
      // Pull current billing_code if PUT didn't supply one — needed for the
      // RUS-requires-code check below.
      if (scope === 'rus') {
        const supplied = Object.prototype.hasOwnProperty.call(req.body, 'billing_code')
          ? req.body.billing_code
          : null;
        if (supplied === null || supplied === undefined || String(supplied).trim() === '') {
          const cur = await pool.query('SELECT billing_code FROM jobs WHERE id = $1', [req.params.id]);
          const existing = cur.rows[0]?.billing_code;
          if (!existing || !String(existing).trim()) {
            return res.status(400).json({ error: 'RUS jobs require a billing code. Set a billing code in this same PUT, or change program_scope to non_rus / shared.' });
          }
        } else if (!String(supplied).trim()) {
          return res.status(400).json({ error: 'RUS jobs require a billing code. Cleared billing_code is not allowed when program_scope=rus.' });
        }
      }
      req.body.program_scope = scope;
      // Mirror into legacy bools when the caller didn't explicitly set them.
      if (!Object.prototype.hasOwnProperty.call(req.body, 'for_psc_client')) {
        req.body.for_psc_client = scope === 'rus' || scope === 'shared';
      }
      if (!Object.prototype.hasOwnProperty.call(req.body, 'for_generic_client')) {
        req.body.for_generic_client = scope === 'non_rus' || scope === 'shared';
      }
    }

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
    } catch (e) {
      console.error('[jobs:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update job.' });
    }
  });

  // Reset a job's manual-override flag. After this, the next bootstrap reseed
  // will overwrite the job's canonical fields back to the hardcoded defaults.
  // This is the escape hatch when admin overrode something by mistake or wants
  // to opt back in to system-managed defaults.
  // Item 2 fix: requireAdmin added
  app.post('/api/jobs/:id/reset-override', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE jobs SET manually_overridden_at = NULL WHERE id = $1 RETURNING id, name`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
      res.json({ ok: true, name: rows[0].name });
    } catch (e) {
      console.error('[jobs:reset-override]', e && e.message);
      res.status(500).json({ error: 'Failed to reset job override.' });
    }
  });

  // Universal rate propagation: apply this job's current default_rate to ALL
  // existing real (non-rollup) projects that use this job. Useful when the
  // admin updates a job's rate and wants the change to flow through to
  // historical projects rather than only affecting new ones.
  // Item 2 fix: requireAdmin added (this rewrites billing_rate across all projects)
  app.put('/api/jobs/:id/propagate-rate', requireAdmin, async (req, res) => {
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
    } catch (e) {
      console.error('[jobs:propagate-rate]', e && e.message);
      res.status(500).json({ error: 'Failed to propagate job rate.' });
    }
  });

  app.delete('/api/jobs/:id', requireAdmin, async (req, res) => {
    try {
      // Soft-delete via active=false to preserve historical references in projects
      await pool.query('UPDATE jobs SET active = false WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      console.error('[jobs:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete job.' });
    }
  });
};
