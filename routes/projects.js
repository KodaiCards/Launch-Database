// routes/projects.js — projects CRUD + recalc + tree/with-hours delete.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3. Scoped
// to the test-covered routes (the smoke test for project tree delete +
// undo lives in tests/project_tree_delete.test.js). Other project routes
// (documents, detail, ongoing, unbill, mark-billed, bill-and-clone) stay
// in server.js for now — they have heavier deps (multer, deeper joins)
// and aren't smoke-tested yet.
//
// app.locals.{ensureRollupChain, isDuplicateProject} are set by
// portal_module.js at boot; we read them off the live app object so this
// module doesn't need to know about that wiring.

const {
  updateProjectHours,
  saveUndoBucket,
  collectProjectTree,
  calcProjectFinancials,
} = require('./_helpers');
const { broadcast } = require('./_sse');

module.exports = function installProjectsRoutes(app, pool, mw) {
  // Item 2 + 22 fix: requireAuth added alongside requireAdmin.
  // POST and PUT were entirely unguarded — any unauthenticated request
  // could create or mutate projects. requireAuth() gates both handlers.
  const { requireAdmin, requireAuth } = mw;

  app.get('/api/projects', async (req, res) => {
    const { status, client_id, type } = req.query;
    let where = [];
    let params = [];
    let i = 1;
    if (status) { where.push(`p.status=$${i++}`); params.push(status); }
    if (client_id) { where.push(`p.client_id=$${i++}`); params.push(client_id); }
    if (type) { where.push(`p.project_type=$${i++}`); params.push(type); }

    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    try {
      const { rows } = await pool.query(`
        SELECT p.*,
          cl.name as client_name,
          co.contract_number,
          co.name as contract_name,
          pp.name as parent_name,
          COALESCE(SUM(te.hours),0) as logged_hours,
          (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) as child_count,
          -- Server-computed YTD revenue for this project + all descendants
          COALESCE((
            WITH RECURSIVE tree AS (
              SELECT p.id AS tid, 0 AS depth
              UNION ALL
              SELECT c.id, t.depth + 1 FROM projects c JOIN tree t ON c.parent_id = t.tid WHERE t.depth < 10
            )
            SELECT SUM(
              CASE
                WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                  THEN COALESCE(leaf.expected_revenue, 0)
                ELSE COALESCE((
                  SELECT SUM(te2.hours) FROM time_entries te2
                  WHERE te2.project_id = leaf.id
                    AND EXTRACT(YEAR FROM te2.entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                ), 0) * COALESCE(leaf.billing_rate,
                  CASE LOWER(leaf.project_type)
                    WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                  END)
              END
            )
            FROM projects leaf
            WHERE leaf.id IN (SELECT tid FROM tree)
              AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
          ), 0) as ytd_revenue
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN time_entries te ON te.project_id = p.id
        ${whereStr}
        GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name
        ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
      `, params);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT p.*,
          cl.name as client_name,
          co.contract_number,
          co.name as contract_name,
          pp.name as parent_name
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        WHERE p.id = $1
      `, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Item 2 fix: requireAuth() added — POST was completely unguarded.
  // Item 22 fix: parent_id validation — verify the target parent exists
  // before accepting an explicit parent_id. Without this, a caller can
  // nest a project under an arbitrary UUID (including a project from
  // another client's tree), breaking the tree integrity invariant.
  app.post('/api/projects', requireAuth(), async (req, res) => {
    let {
      name, client_id, contract_id, work_order_number,
      project_type, program, job_id,
      status = 'active', billing_type, billing_rate,
      footage, start_date, notes, parent_id, budget_code_id, concentrator_id,
      service_area_label,    // free-text service area for non-PSC clients
      permit_manager,
      billing_cadence, projected_revenue,
      manual_invoice_amount,
      is_rollup,             // owner-flagged 2026-05-06: manual rollup flag.
                             // TRUE = container/folder, no traits, no hours.
      engineering_contract_id,  // direct EC FK — stored on the new project row
    } = req.body;
    // Coerce to boolean. JSON might arrive as 'true'/'false' strings from
    // form submissions; treat anything truthy as TRUE, everything else
    // (including undefined) as FALSE so the DB column never goes NULL.
    const isRollupFlag = (is_rollup === true || is_rollup === 'true' || is_rollup === 1 || is_rollup === '1');
    // Phase 3b (2026-05-04): project_types was dropped. Pricing now keys on
    // a program enum (rus|bau|gfr|other). Each project carries its own
    // program — auto-derived from the engineering contract when one is
    // attached, otherwise mirrored from the (legacy) free-text project_type
    // when that string matches a program label, otherwise NULL.
    if (program !== undefined && program !== null && program !== '') {
      const v = String(program).trim().toLowerCase();
      if (!['rus','bau','gfr','other'].includes(v)) {
        return res.status(400).json({ error: `Invalid program "${program}" — allowed: rus, bau, gfr, other.` });
      }
      program = v;
    } else {
      program = null;
    }

    try {
      // Item 22 fix: if the caller explicitly passes a parent_id (rather than
      // letting ensureRollupChain derive one), verify the target parent
      // actually exists. This prevents re-parenting a project under a
      // non-existent or attacker-controlled UUID.
      if (parent_id) {
        const parentCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [parent_id]);
        if (!parentCheck.rows.length) {
          return res.status(400).json({ error: 'parent_id does not reference an existing project' });
        }
      }

      // Derive engineering_contract_id from contract_id when not explicitly
      // supplied. This ensures every project that has a billing contract also
      // carries the direct EC FK — enabling rollup-scope billing queries and
      // RUS inspection tab scoping that depend on this column.
      if (!engineering_contract_id && contract_id) {
        const ecRow = await pool.query(
          `SELECT engineering_contract_id FROM contracts WHERE id = $1`,
          [contract_id]
        );
        engineering_contract_id = ecRow.rows[0]?.engineering_contract_id || null;
      }

      // Auto-nesting: when admin doesn't explicitly pick a parent, derive it
      // from the rollup chain Client → Team → Service Area → Project.
      // If admin DID pick a parent, respect that choice (legacy/manual nesting).
      if (!parent_id && client_id && app.locals.ensureRollupChain) {
        // Auto-detect concentrator from work order if admin didn't pick one.
        // Only fires if there IS a work_order_number — non-PSC clients won't
        // have one, so this falls through and service_area_label is used instead.
        if (!concentrator_id && work_order_number) {
          const con = await pool.query(
            `SELECT id FROM concentrators WHERE work_order_number = $1 LIMIT 1`,
            [String(work_order_number).trim()]
          );
          if (con.rows.length) concentrator_id = con.rows[0].id;
        }
        parent_id = await app.locals.ensureRollupChain({
          client_id, concentrator_id, service_area_label, job_id,
          engineering_contract_id: engineering_contract_id || null
        });
      }

      // Duplicate-project guard (same name under same parent rejected)
      if (await app.locals.isDuplicateProject(name, parent_id)) {
        return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
      }

      // If a job is selected with is_permitting=true, treat this as a permitting
      // project regardless of legacy project_type. This is how permitting
      // becomes universal across program types (BAU/GF(R)/RUS/Other).
      let isPermitting = project_type === 'permitting';
      let effectiveBillingType = billing_type;
      let effectiveRate = billing_rate;
      let jobName = null;
      if (job_id) {
        const jr = await pool.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
        const j = jr.rows[0];
        if (j) {
          jobName = j.name;
          if (j.is_permitting) {
            isPermitting = true;
            effectiveBillingType = 'footage';
          }
          if (effectiveRate === undefined || effectiveRate === null || effectiveRate === '') {
            effectiveRate = j.default_rate;
          }
          if (!effectiveBillingType) {
            effectiveBillingType = j.default_billing_type || 'hourly';
          }
        }
      }

      // Cadence: caller can set explicitly, otherwise default to 'monthly' for
      // Inspection jobs (matches the schema backfill rule), 'one_time' otherwise.
      const effectiveCadence = billing_cadence
        || (jobName === 'Inspection' ? 'monthly' : 'one_time');

      // For the financials calc, treat is_permitting as the trigger
      const finType = isPermitting ? 'permitting' : (project_type || 'other');
      const fin = calcProjectFinancials(finType, effectiveRate, footage);

      // Manual invoice amount: a flat dollar override. When set, the bill flow
      // uses this number instead of (hours × rate) or (footage × rate).
      const effectiveManual = manual_invoice_amount !== undefined && manual_invoice_amount !== null && manual_invoice_amount !== ''
        ? parseFloat(manual_invoice_amount)
        : null;

      // Projected revenue: caller's value if provided, else manual_invoice_amount
      // (since that's the real contract value when set), else fall back to the
      // calculated expected_revenue (the auto-derived value for footage projects).
      const effectiveProjected = projected_revenue !== undefined && projected_revenue !== null && projected_revenue !== ''
        ? parseFloat(projected_revenue)
        : (effectiveManual != null ? effectiveManual
           : (fin.expectedRevenue != null ? fin.expectedRevenue : null));

      // Auto-derive program from the engineering contract if one is
      // attached and no explicit program was passed. PSC has both RUS and
      // BAU work, so admin/AI-set program wins; otherwise we trust the EC.
      if (!program && contract_id) {
        const ecLookup = await pool.query(
          `SELECT ec.program
             FROM contracts c
             JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
            WHERE c.id = $1`, [contract_id]
        );
        if (ecLookup.rows.length && ecLookup.rows[0].program) {
          program = ecLookup.rows[0].program;
        }
      }

      // When is_rollup=true, blank out the trait fields (job, rate,
      // footage, projections). A rollup is purely organizational — it
      // carries no billing semantics, no time entries, no calculated
      // hours. The Path B post-Path-B note in PROJECT_NORTH_STAR §6.B
      // already filters is_rollup=TRUE rows out of count queries, so
      // wiping the traits here keeps the row consistent with the rest
      // of the system.
      const insertJobId       = isRollupFlag ? null : (job_id || null);
      // billing_type is NOT NULL DEFAULT 'hourly' in schema. Rollups don't
      // bill, so the value is never read — stamp the schema default.
      const insertBillingType = isRollupFlag ? 'hourly' : effectiveBillingType;
      const insertBillingRate = isRollupFlag ? null : (effectiveRate || null);
      const insertFootage     = isRollupFlag ? null : (footage || null);
      const insertMiles       = isRollupFlag ? null : fin.miles;
      const insertExpHours    = isRollupFlag ? null : fin.expectedHours;
      const insertExpRev      = isRollupFlag ? null : fin.expectedRevenue;
      const insertProjected   = isRollupFlag ? null : effectiveProjected;
      const insertManual      = isRollupFlag ? null : effectiveManual;
      const insertHrPerMi     = isRollupFlag ? null : (fin.permittingHoursPerMile || null);

      const { rows } = await pool.query(`
        INSERT INTO projects (
          name, client_id, contract_id, work_order_number,
          project_type, program, job_id,
          status, billing_type, billing_rate,
          footage, miles, expected_hours, expected_revenue,
          start_date, notes, parent_id, budget_code_id, concentrator_id,
          permitting_hours_per_mile, billing_cadence, projected_revenue,
          manual_invoice_amount, is_rollup, engineering_contract_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
        RETURNING *
      `, [
        name, client_id, contract_id || null, work_order_number,
        project_type, program, insertJobId,
        status, insertBillingType, insertBillingRate,
        insertFootage, insertMiles, insertExpHours, insertExpRev,
        start_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
        insertHrPerMi, effectiveCadence, insertProjected,
        insertManual, isRollupFlag, engineering_contract_id || null,
      ]);

      // Auto-create permit / design stages — but ONLY for real projects.
      // Rollup containers don't go through any pipeline; they're folders.
      if (!isRollupFlag) {
        if (isPermitting) {
          await pool.query(
            'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
            [rows[0].id, 'potential', permit_manager || null]
          );
        }
        if (project_type === 'design') {
          await pool.query(
            'INSERT INTO design_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT (project_id, stage) DO NOTHING',
            [rows[0].id, 'potential']
          );
        }
      }

      broadcast('admin', 'project_added', { id: rows[0].id, name: rows[0].name, client_id: rows[0].client_id });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Item 2 fix: requireAuth() added — PUT was completely unguarded.
  // Item 22 fix: parent_id validation — verify the target parent exists
  // before accepting a re-parent operation.
  app.put('/api/projects/:id', requireAuth(), async (req, res) => {
    let {
      name, client_id, contract_id, work_order_number,
      project_type, program, job_id,
      status, billing_type, billing_rate,
      footage, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id,
      billing_cadence, projected_revenue, manual_invoice_amount,
      is_rollup,             // owner-flagged 2026-05-06: manual rollup flag.
                             // Use COALESCE in the SET so omitting the field
                             // preserves the existing value.
      engineering_contract_id,  // direct EC FK — re-derived if contract_id changes
    } = req.body;
    // Coerce is_rollup to a boolean (or undefined when omitted, so the
    // SQL leaves the existing value alone).
    let isRollupFlag;
    if (is_rollup === undefined) {
      isRollupFlag = undefined;
    } else {
      isRollupFlag = (is_rollup === true || is_rollup === 'true' || is_rollup === 1 || is_rollup === '1');
    }
    // Phase 3b: program enum replaces project_type_id. Same validation as POST.
    if (program !== undefined) {
      if (program === null || program === '') {
        program = null;
      } else {
        const v = String(program).trim().toLowerCase();
        if (!['rus','bau','gfr','other'].includes(v)) {
          return res.status(400).json({ error: `Invalid program "${program}" — allowed: rus, bau, gfr, other.` });
        }
        program = v;
      }
    }

    try {
      // Item 22 fix: verify the target parent exists when caller specifies
      // an explicit parent_id (re-parent operation). This prevents tree
      // corruption from attacker-controlled parent UUIDs.
      if (parent_id !== undefined && parent_id !== null) {
        const parentCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [parent_id]);
        if (!parentCheck.rows.length) {
          return res.status(400).json({ error: 'parent_id does not reference an existing project' });
        }
      }

      // Duplicate-project guard — only check if name OR parent is being changed
      if (name !== undefined || parent_id !== undefined) {
        const cur = await pool.query('SELECT name, parent_id FROM projects WHERE id = $1', [req.params.id]);
        if (cur.rows.length) {
          const checkName   = (name !== undefined ? name : cur.rows[0].name);
          const checkParent = (parent_id !== undefined ? parent_id : cur.rows[0].parent_id);
          if (await app.locals.isDuplicateProject(checkName, checkParent, req.params.id)) {
            return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
          }
        }
      }

      // Re-derive permitting status from job (if job specified) or legacy project_type
      let isPermitting = project_type === 'permitting';
      let effectiveBillingType = billing_type;
      let effectiveRate = billing_rate;
      if (job_id) {
        const jr = await pool.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
        const j = jr.rows[0];
        if (j) {
          if (j.is_permitting) { isPermitting = true; effectiveBillingType = 'footage'; }
          if (effectiveRate === undefined || effectiveRate === null || effectiveRate === '') {
            effectiveRate = j.default_rate;
          }
          if (!effectiveBillingType) effectiveBillingType = j.default_billing_type || 'hourly';
        }
      }

      // For permitting, reuse the random hours-per-mile factor stored at create-time
      // so editing footage doesn't generate a new random rate every save.
      const existing = await pool.query('SELECT permitting_hours_per_mile, billing_cadence, projected_revenue, manual_invoice_amount FROM projects WHERE id=$1', [req.params.id]);
      const existingHpm = existing.rows[0]?.permitting_hours_per_mile;
      const finType = isPermitting ? 'permitting' : (project_type || 'other');
      const fin = calcProjectFinancials(finType, effectiveRate, footage, existingHpm);

      // Preserve existing values when payload doesn't include the field
      const newCadence = billing_cadence !== undefined ? billing_cadence : existing.rows[0]?.billing_cadence;
      const newProjected = projected_revenue !== undefined
        ? (projected_revenue === null || projected_revenue === '' ? null : parseFloat(projected_revenue))
        : existing.rows[0]?.projected_revenue;
      const newManual = manual_invoice_amount !== undefined
        ? (manual_invoice_amount === null || manual_invoice_amount === '' ? null : parseFloat(manual_invoice_amount))
        : existing.rows[0]?.manual_invoice_amount;

      // Auto-derive program from the EC if not supplied and contract changed.
      // COALESCE pattern: only update program if explicitly provided OR
      // derivable from a freshly-attached EC.
      let effectiveProgram = program;
      if (effectiveProgram === undefined && contract_id !== undefined) {
        if (contract_id) {
          const ecLookup = await pool.query(
            `SELECT ec.program
               FROM contracts c
               JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
              WHERE c.id = $1`, [contract_id]
          );
          if (ecLookup.rows.length && ecLookup.rows[0].program) {
            effectiveProgram = ecLookup.rows[0].program;
          }
        }
      }

      // Re-derive engineering_contract_id if contract_id is being changed and
      // engineering_contract_id wasn't explicitly supplied in the payload.
      // When engineering_contract_id is explicitly supplied, trust the caller.
      // When contract_id is cleared (null), also clear engineering_contract_id.
      let updEngContractId = engineering_contract_id;
      if (updEngContractId === undefined && contract_id !== undefined) {
        if (contract_id) {
          const ecIdRow = await pool.query(
            `SELECT engineering_contract_id FROM contracts WHERE id = $1`,
            [contract_id]
          );
          updEngContractId = ecIdRow.rows[0]?.engineering_contract_id || null;
        } else {
          updEngContractId = null;
        }
      }
      // If neither engineering_contract_id nor contract_id was touched, leave it alone.
      const ecIdForUpdate = updEngContractId !== undefined ? updEngContractId : null;
      const ecIdSetClause = updEngContractId !== undefined
        ? ', engineering_contract_id=$28'
        : '';

      // Resolve the effective is_rollup for THIS save:
      //   - explicit param wins
      //   - otherwise read the current row's flag and use it for the
      //     trait-blanking guard below
      const existingRollup = !!existing.rows[0]?.is_rollup;
      const willBeRollup = (isRollupFlag === undefined) ? existingRollup : isRollupFlag;

      // Same trait-blanking rule as POST: when the project is (or
      // becomes) a rollup, every trait field is forced to NULL. This
      // is intentional even when caller passed values — owner rule:
      // rollups have NO traits.
      const updJobId        = willBeRollup ? null : (job_id || null);
      // billing_type is NOT NULL in schema; stamp the default for rollups.
      const updBillingType  = willBeRollup ? 'hourly' : effectiveBillingType;
      const updBillingRate  = willBeRollup ? null : (effectiveRate || null);
      const updFootage      = willBeRollup ? null : (footage || null);
      const updMiles        = willBeRollup ? null : fin.miles;
      const updExpHours     = willBeRollup ? null : fin.expectedHours;
      const updExpRev       = willBeRollup ? null : fin.expectedRevenue;
      const updHrPerMi      = willBeRollup ? null : (fin.permittingHoursPerMile || existingHpm || null);
      const updProjected    = willBeRollup ? null : newProjected;
      const updManual       = willBeRollup ? null : newManual;

      const updateParams = [
        name, client_id, contract_id || null, work_order_number,
        project_type, effectiveProgram === undefined ? null : effectiveProgram, updJobId,
        status, updBillingType, updBillingRate,
        updFootage, updMiles, updExpHours, updExpRev,
        start_date || null, completed_date || null, billed_date || null,
        notes, parent_id || null, budget_code_id || null, concentrator_id || null,
        updHrPerMi,
        newCadence, updProjected, updManual,
        req.params.id,
        isRollupFlag === undefined ? null : isRollupFlag,
      ];
      if (updEngContractId !== undefined) updateParams.push(ecIdForUpdate);

      const { rows } = await pool.query(`
        UPDATE projects SET
          name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
          project_type=$5, program=COALESCE($6, program), job_id=$7,
          status=$8, billing_type=$9, billing_rate=$10,
          footage=$11, miles=$12, expected_hours=$13, expected_revenue=$14,
          start_date=$15, completed_date=$16, billed_date=$17,
          notes=$18, parent_id=$19, budget_code_id=$20, concentrator_id=$21,
          permitting_hours_per_mile=$22,
          billing_cadence=$23, projected_revenue=$24,
          manual_invoice_amount=$25,
          is_rollup=COALESCE($27, is_rollup)${ecIdSetClause}
        WHERE id=$26 RETURNING *
      `, updateParams);
      broadcast('admin', 'project_updated', { id: rows[0].id, name: rows[0].name, client_id: rows[0].client_id });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
    try {
      // Remove from any pending billing batches first — billing_batch_items
      // has ON DELETE RESTRICT on project_id, so leaving stale rows here would
      // make the project undeletable AND keep it visible in the batch UI.
      await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
      await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
      broadcast('admin', 'project_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Recalculate actual_hours for a single project from its time_entries
  app.post('/api/projects/:id/recalc-hours', async (req, res) => {
    try {
      await updateProjectHours(req.params.id);
      const { rows } = await pool.query('SELECT actual_hours FROM projects WHERE id=$1', [req.params.id]);
      res.json({ ok: true, actual_hours: rows[0]?.actual_hours });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Recalculate ALL projects' actual_hours from time_entries (bottom-up).
  // Filters is_billable=TRUE so unbilled overhead entries don't inflate
  // billing-driving actual_hours. Matches the updateProjectHours() helper.
  app.post('/api/projects/recalc-all', requireAdmin, async (req, res) => {
    try {
      // First, set all to their own direct billable hours
      await pool.query(`
        UPDATE projects SET actual_hours = COALESCE((
          SELECT SUM(hours) FROM time_entries
           WHERE project_id = projects.id AND COALESCE(is_billable, TRUE) = TRUE
        ), 0)
      `);
      // Then propagate up: repeat until no changes (handles unlimited depth)
      let changed = 1;
      let iterations = 0;
      while (changed > 0 && iterations < 20) {
        const result = await pool.query(`
          UPDATE projects p SET actual_hours = (
            SELECT COALESCE(SUM(hours),0) FROM time_entries
             WHERE project_id = p.id AND COALESCE(is_billable, TRUE) = TRUE
          ) + (
            SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id = p.id
          )
          WHERE EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          RETURNING id
        `);
        changed = result.rowCount;
        iterations++;
      }
      res.json({ ok: true, iterations });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Delete a billed project entirely (removes from revenue, hours, everything)
  app.delete('/api/projects/:id/with-hours', requireAdmin, async (req, res) => {
    try {
      // Delete time entries first
      await pool.query('DELETE FROM time_entries WHERE project_id=$1', [req.params.id]);
      // Delete invoice items
      await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [req.params.id]);
      // Pull from any pending billing batches (RESTRICT FK)
      await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
      // Get parent before deleting
      const { rows: proj } = await pool.query('SELECT parent_id FROM projects WHERE id=$1', [req.params.id]);
      // Delete the project
      await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
      // Recalculate parent hours
      if (proj[0] && proj[0].parent_id) {
        await updateProjectHours(proj[0].parent_id);
      }
      broadcast('admin', 'project_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // DELETE /api/projects/:id/with-tree — delete a project AND every descendant
  // (sub-projects, sub-sub-projects, etc.) PLUS all their time entries,
  // invoice items, permit stages, and permit documents. Captures the entire
  // tree in an undo bucket first so the caller gets a token they can replay
  // within ~60s. Use this for rollup deletion — the regular DELETE refuses
  // when there are children (ON DELETE RESTRICT) and even /with-hours only
  // handles a single leaf.
  app.delete('/api/projects/:id/with-tree', requireAdmin, async (req, res) => {
    let projects;
    try {
      projects = await collectProjectTree(req.params.id);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to walk project tree: ' + e.message });
    }
    if (!projects.length) return res.status(404).json({ error: 'Project not found.' });
    const projectIds = projects.map(p => p.id);
    const rootParentId = projects[0].parent_id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Snapshot everything we're about to delete
      const teRes = await client.query('SELECT * FROM time_entries WHERE project_id = ANY($1::uuid[])', [projectIds]);
      let iiRes = { rows: [] };
      try { iiRes = await client.query('SELECT * FROM invoice_items WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      let psRes = { rows: [] };
      try { psRes = await client.query('SELECT * FROM permit_stages WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      let pdRes = { rows: [] };
      try { pdRes = await client.query('SELECT * FROM permit_documents WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}

      // Snapshot pending billing batch memberships so undo can restore them.
      let bbiRes = { rows: [] };
      try { bbiRes = await client.query('SELECT * FROM billing_batch_items WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}

      // Delete in dependency order: leaf rows first, then projects from
      // deepest to shallowest (so parent_id references stay valid).
      await client.query('DELETE FROM time_entries WHERE project_id = ANY($1::uuid[])', [projectIds]);
      try { await client.query('DELETE FROM invoice_items WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      try { await client.query('DELETE FROM permit_documents WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      try { await client.query('DELETE FROM permit_stages WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      // Pull from any pending billing batches so RESTRICT FK doesn't block.
      try { await client.query('DELETE FROM billing_batch_items WHERE project_id = ANY($1::uuid[])', [projectIds]); } catch {}
      const byDepth = [...projects].sort((a, b) => (b.__depth || 0) - (a.__depth || 0));
      for (const p of byDepth) {
        await client.query('DELETE FROM projects WHERE id = $1', [p.id]);
      }
      await client.query('COMMIT');

      // Save undo + bump parent hours OUTSIDE the transaction (best-effort)
      if (rootParentId) {
        try { await updateProjectHours(rootParentId); } catch {}
      }
      const undo = await saveUndoBucket(req.user && req.user.id, 'project_tree', {
        projects,
        time_entries: teRes.rows,
        invoice_items: iiRes.rows,
        permit_stages: psRes.rows,
        permit_documents: pdRes.rows,
        billing_batch_items: bbiRes.rows,
      });
      // Notify listeners for every deleted project (tree may be large;
      // broadcast the root id only to avoid a fire-hose of payloads).
      broadcast('admin', 'project_deleted', { id: req.params.id, tree: true, deleted_count: projects.length });
      res.json({
        ok: true,
        deleted_projects: projects.length,
        deleted_time_entries: teRes.rows.length,
        undo_token: undo.token,
        undo_expires_at: undo.expires_at,
      });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[projects:with-tree:delete]', e && e.message);
      res.status(500).json({ error: 'Tree delete failed: ' + e.message });
    } finally {
      client.release();
    }
  });
};
