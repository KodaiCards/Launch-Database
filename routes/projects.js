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
  const { requireAdmin, requireAuth, requireManagerOrAdmin } = mw;

  // Wave 1.5 [UNGATED]: GET /api/projects and GET /api/projects/:id were missing auth.
  app.get('/api/projects', requireAuth(), async (req, res) => {
    const { status, client_id, project_type } = req.query;
    let where = [];
    let params = [];
    let i = 1;
    // Track which param slot `status` occupies so include_completed can
    // widen the clause later without rebuilding the whole where array.
    let statusParamSlot = null;
    if (status) { statusParamSlot = i; where.push(`p.status=$${i++}`); params.push(status); }
    if (client_id) { where.push(`p.client_id=$${i++}`); params.push(client_id); }
    if (project_type) { where.push(`p.project_type=$${i++}`); params.push(project_type); }

    // Phase 1 (timeclock-picker wave): opt-in leaf-only filter.
    // Accepted values: 'true', '1', 'on' (case-insensitive). Anything else
    // (e.g. 'yes', 'false', absent) leaves the default "return everything"
    // behaviour intact so existing callers (admin tree, design picker, etc.)
    // are completely unaffected.
    // SQL form: IS NOT TRUE (not = FALSE) — handles nullable is_rollup rows.
    const leavesOnly = ['true','1','on'].includes(String(req.query.leaves_only ?? '').toLowerCase());
    if (leavesOnly) { where.push(`p.is_rollup IS NOT TRUE`); }

    // Phase A (cascade-backend wave): opt-in parent_id filter.
    // When present, restricts results to direct children of that folder.
    // Works alongside leaves_only, status, client_id, etc. — all filters
    // are AND-composed. No validation: an unknown UUID simply returns an
    // empty array, which is the correct observable behaviour.
    if (req.query.parent_id) { where.push(`p.parent_id=$${i++}`); params.push(req.query.parent_id); }

    // Wave 4 (FIX-M1): opt-in rollup_key filter. Used by the design portal to
    // find the SA folder project (is_rollup=true) whose rollup_key is the
    // ec_service_areas.id UUID, so dpSaChanged can resolve parent_id correctly.
    if (req.query.rollup_key) { where.push(`p.rollup_key=$${i++}`); params.push(req.query.rollup_key); }

    // Phase 1 (timeclock-picker wave): opt-in include-completed flag for the
    // edit-entry / back-fill context. When present AND a status=active filter
    // was also specified, OR in completed rows so back-fill against a completed
    // project is possible. When present with no status filter, no extra clause
    // is needed (all statuses already returned). When absent, behaviour is
    // identical to before this change.
    const includeCompleted = ['true','1','on'].includes(String(req.query.include_completed ?? '').toLowerCase());
    if (includeCompleted && statusParamSlot !== null) {
      // Widen the status equality to also include 'completed'.
      const clauseIdx = where.findIndex(c => c === `p.status=$${statusParamSlot}`);
      if (clauseIdx !== -1) {
        where[clauseIdx] = `(p.status=$${statusParamSlot} OR p.status='completed')`;
      }
    }

    // Perf (Wave 3): default LIMIT 1000 to prevent full-table serialisation
    // on large deployments. Use ?limit=N (max 5000) and ?offset=N for
    // pagination. Pass ?limit=all to skip the cap (tree-view loads that need
    // the full list can opt out; scoped queries with status/client_id
    // filters should be small enough to not need it).
    const rawLimit  = req.query.limit;
    const rawOffset = parseInt(req.query.offset, 10);
    const skipLimit = rawLimit === 'all';
    const limitVal  = !skipLimit
      ? (Number.isFinite(parseInt(rawLimit, 10)) && parseInt(rawLimit, 10) > 0
          ? Math.min(parseInt(rawLimit, 10), 5000)
          : 1000)
      : null;
    const offsetVal = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
    const limitClause = skipLimit
      ? `OFFSET $${i++}`
      : `LIMIT $${i++} OFFSET $${i++}`;
    if (!skipLimit) {
      params.push(limitVal, offsetVal);
    } else {
      params.push(offsetVal);
    }

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
        ${limitClause}
      `, params);
      res.json(rows);
    } catch (e) {
      console.error('[projects:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects.' });
    }
  });

  app.get('/api/projects/:id', requireAuth(), async (req, res) => {
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
    } catch (e) {
      console.error('[projects:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load project.' });
    }
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
      is_ongoing,            // Wave 6: monthly recurring projects
      engineering_contract_id,  // direct EC FK — stored on the new project row
    } = req.body;
    // Coerce to boolean. JSON might arrive as 'true'/'false' strings from
    // form submissions; treat anything truthy as TRUE, everything else
    // (including undefined) as FALSE so the DB column never goes NULL.
    const isRollupFlag = (is_rollup === true || is_rollup === 'true' || is_rollup === 1 || is_rollup === '1');
    const isOngoingFlag = (is_ongoing === true || is_ongoing === 'true' || is_ongoing === 1 || is_ongoing === '1');
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

    // Validate service_area_label length. The rollup_key built from this is
    // stored as TEXT and the rollup name is VARCHAR(200) — cap at 200 to
    // prevent truncation silently creating duplicate rollup_key collisions.
    if (service_area_label && String(service_area_label).trim().length > 200) {
      return res.status(400).json({ error: 'service_area_label must be 200 characters or fewer.' });
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

      // Auto-derive work_order_number from concentrator_id (SA) lookup if present
      if (!work_order_number && concentrator_id) {
        const sa = await pool.query(
          `SELECT work_order_number FROM ec_service_areas WHERE id = $1`,
          [concentrator_id]
        );
        if (sa.rows[0]?.work_order_number) {
          work_order_number = sa.rows[0].work_order_number;
        }
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
      // When is_ongoing=true, enforce cadence='monthly' server-side (invariant).
      let effectiveCadence = billing_cadence
        || (jobName === 'Inspection' ? 'monthly' : 'one_time');
      if (isOngoingFlag === true && effectiveCadence !== 'monthly') {
        effectiveCadence = 'monthly'; // Server-side coercion for ongoing projects
      }

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
          manual_invoice_amount, is_rollup, engineering_contract_id, service_area_name,
          is_ongoing
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
        RETURNING *
      `, [
        name, client_id, contract_id || null, work_order_number,
        project_type, program, insertJobId,
        status, insertBillingType, insertBillingRate,
        insertFootage, insertMiles, insertExpHours, insertExpRev,
        start_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
        insertHrPerMi, effectiveCadence, insertProjected,
        insertManual, isRollupFlag, engineering_contract_id || null, service_area_label || null,
        isOngoingFlag,
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
    } catch (e) {
      console.error('[projects:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create project.' });
    }
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
      service_area_name,
      billing_cadence, projected_revenue, manual_invoice_amount,
      is_rollup,             // owner-flagged 2026-05-06: manual rollup flag.
                             // Use COALESCE in the SET so omitting the field
                             // preserves the existing value.
      is_ongoing,            // Wave 6: monthly recurring flag
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
    // Coerce is_ongoing similarly — undefined = leave as-is, value = set.
    let isOngoingFlag;
    if (is_ongoing !== undefined) {
      isOngoingFlag = (is_ongoing === true || is_ongoing === 'true' || is_ongoing === 1 || is_ongoing === '1');
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
      let newCadence = billing_cadence !== undefined ? billing_cadence : existing.rows[0]?.billing_cadence;
      // When is_ongoing=true, enforce cadence='monthly' server-side (invariant).
      if (isOngoingFlag === true && newCadence !== 'monthly') {
        newCadence = 'monthly'; // Server-side coercion for ongoing projects
      }
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

      // Build conditional SET clauses for fields that support explicit clearing.
      // Semantic: omitted (undefined) = preserve existing; explicit value including
      // null = write that value (allows clearing the field).
      // $N slots are assigned dynamically starting after the 25 fixed params.
      const conditionalParams = [];
      let nextSlot = 26;

      const ecIdSetClause = updEngContractId !== undefined
        ? (() => { conditionalParams.push(ecIdForUpdate); return `, engineering_contract_id=$${nextSlot++}`; })()
        : '';
      const wonSetClause = work_order_number !== undefined
        ? (() => { conditionalParams.push(work_order_number); return `, work_order_number=$${nextSlot++}`; })()
        : '';
      const concSetClause = concentrator_id !== undefined
        ? (() => { conditionalParams.push(concentrator_id); return `, concentrator_id=$${nextSlot++}`; })()
        : '';
      const sanSetClause = service_area_name !== undefined
        ? (() => { conditionalParams.push(service_area_name); return `, service_area_name=$${nextSlot++}`; })()
        : '';
      const ongoingSetClause = isOngoingFlag !== undefined
        ? (() => { conditionalParams.push(isOngoingFlag); return `, is_ongoing=$${nextSlot++}`; })()
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

      // Fixed params: $1-$25. Conditional params appended after ($26+).
      const updateParams = [
        name, client_id, contract_id || null,
        project_type, effectiveProgram === undefined ? null : effectiveProgram, updJobId,
        status, updBillingType, updBillingRate,
        updFootage, updMiles, updExpHours, updExpRev,
        start_date || null, completed_date || null, billed_date || null,
        notes, parent_id || null, budget_code_id || null,
        updHrPerMi,
        newCadence, updProjected, updManual,
        req.params.id,
        isRollupFlag === undefined ? null : isRollupFlag,
        ...conditionalParams,
      ];

      const { rows } = await pool.query(`
        UPDATE projects SET
          name=$1, client_id=$2, contract_id=$3,
          project_type=COALESCE($4, project_type), program=COALESCE($5, program), job_id=$6,
          status=$7, billing_type=$8, billing_rate=$9,
          footage=$10, miles=$11, expected_hours=$12, expected_revenue=$13,
          start_date=$14, completed_date=$15, billed_date=$16,
          notes=$17, parent_id=$18, budget_code_id=$19,
          permitting_hours_per_mile=$20,
          billing_cadence=$21, projected_revenue=$22,
          manual_invoice_amount=$23,
          is_rollup=COALESCE($25, is_rollup)${ecIdSetClause}${wonSetClause}${concSetClause}${sanSetClause}${ongoingSetClause}
        WHERE id=$24 RETURNING *
      `, updateParams);
      broadcast('admin', 'project_updated', { id: rows[0].id, name: rows[0].name, client_id: rows[0].client_id });
      res.json(rows[0]);
    } catch (e) {
      console.error('[projects:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update project.' });
    }
  });

  // ?dry_run=1 returns an impact preview without deleting (opt-in).
  // No confirm flag required — single-row delete; undo-bucket is safety net.
  app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
    const dryRun = req.query.dry_run === '1' || req.query.dry_run === 'true';
    try {
      const proj = await pool.query(
        'SELECT id, name, parent_id FROM projects WHERE id=$1', [req.params.id]
      );
      if (!proj.rows.length) return res.status(404).json({ error: 'Project not found.' });
      if (dryRun) {
        const children = await pool.query(
          'SELECT COUNT(*)::int AS cnt FROM projects WHERE parent_id=$1', [req.params.id]
        );
        return res.json({
          dry_run: true,
          preview: {
            id: req.params.id,
            name: proj.rows[0].name,
            child_projects: children.rows[0].cnt,
          },
        });
      }
      // Remove from any pending billing batches first — billing_batch_items
      // has ON DELETE RESTRICT on project_id, so leaving stale rows here would
      // make the project undeletable AND keep it visible in the batch UI.
      await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
      await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
      broadcast('admin', 'project_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) {
      console.error('[projects:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete project.' });
    }
  });

  // Recalculate actual_hours for a single project from its time_entries.
  // requireAuth() added — endpoint was unguarded (any network request could
  // trigger a full upward propagation walk without being authenticated).
  app.post('/api/projects/:id/recalc-hours', requireAuth(), async (req, res) => {
    try {
      await updateProjectHours(req.params.id);
      const { rows } = await pool.query('SELECT actual_hours FROM projects WHERE id=$1', [req.params.id]);
      res.json({ ok: true, actual_hours: rows[0]?.actual_hours });
    } catch (e) {
      console.error('[projects:recalc-hours]', e && e.message);
      res.status(500).json({ error: 'Failed to recalculate project hours.' });
    }
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
    } catch (e) {
      console.error('[projects:recalc-all]', e && e.message);
      res.status(500).json({ error: 'Failed to recalculate all project hours.' });
    }
  });

  // Delete a billed project entirely (removes from revenue, hours, everything).
  // ?dry_run=1 returns impact counts without deleting (opt-in).
  // No confirm flag required — undo-bucket is the safety net.
  app.delete('/api/projects/:id/with-hours', requireAdmin, async (req, res) => {
    const dryRun = req.query.dry_run === '1' || req.query.dry_run === 'true';
    if (dryRun) {
      try {
        const teCount = await pool.query(
          'SELECT COUNT(*)::int AS cnt FROM time_entries WHERE project_id=$1', [req.params.id]
        );
        const iiCount = await pool.query(
          'SELECT COUNT(*)::int AS cnt FROM invoice_items WHERE project_id=$1', [req.params.id]
        ).catch(() => ({ rows: [{ cnt: 0 }] }));
        const proj = await pool.query('SELECT name FROM projects WHERE id=$1', [req.params.id]);
        if (!proj.rows.length) return res.status(404).json({ error: 'Project not found.' });
        return res.json({
          dry_run: true,
          preview: {
            id: req.params.id,
            name: proj.rows[0].name,
            time_entries: teCount.rows[0].cnt,
            invoice_items: iiCount.rows[0].cnt,
          },
        });
      } catch (e) {
        console.error('[projects:with-hours:preview]', e && e.message);
        return res.status(500).json({ error: 'Failed to preview deletion.' });
      }
    }
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
    } catch (e) {
      console.error('[projects:with-hours:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete project with hours.' });
    }
  });

  // POST /api/projects/resolve-or-create
  //
  // Cascade-picker backend supporting TWO modes:
  //
  // MODE 1 (EC-scoped, existing):
  //   Body: { client_id, program, service_area_id, job_name }
  //   Finds or creates a leaf under the EC's service-area rollup folder.
  //
  // MODE 2 (no-EC, new):
  //   Body: { client_id, service_area_label, job_name }
  //   Finds or creates a leaf under a free-text service-area rollup folder
  //   (via ensureRollupChain). No EC required. No program parameter.
  //
  // Branch selection: if service_area_id is present → MODE 1 (EC).
  // If service_area_label is present → MODE 2 (no-EC).
  // If neither: 400 error.
  //
  // Race condition on leaf creation: UNIQUE constraint on non-rollup leaves
  // prevents duplicate names under the same parent. On 23505 we re-SELECT
  // the winner and return created:false so the UI gets the existing project_id.
  app.post('/api/projects/resolve-or-create', requireAuth(), async (req, res) => {
    const { client_id, program, service_area_id, service_area_label, job_name } = req.body;

    // Input validation (common to both modes)
    if (!job_name || !String(job_name).trim()) {
      return res.status(400).json({ error: 'job_name is required and must be non-empty.' });
    }
    if (!client_id || typeof client_id !== 'string' || !client_id.match(/^[0-9a-f-]{36}$/i)) {
      return res.status(400).json({ error: 'client_id must be a valid UUID.' });
    }
    const normalizedJobName = String(job_name).trim();

    // Block customer role — customers cannot create or resolve projects
    if (req.user && req.user.role === 'customer') {
      return res.status(403).json({ error: 'Customers cannot access this endpoint.' });
    }

    // Branch selection: EC-scoped vs no-EC.
    // MODE 1 (EC): service_area_id present → EC-scoped path.
    // MODE 2 (no-EC): no service_area_id → free-text SA path; service_area_label
    //   is optional — blank/missing means no SA grouping, project lands directly
    //   under the team folder for this client.
    const isEcMode = !!service_area_id;

    try {
      if (isEcMode) {
        // ═══ MODE 1: EC-SCOPED (existing behavior) ═══
        const programAllowed = ['rus', 'bau', 'gfr', 'other'];
        if (!program || !programAllowed.includes(String(program).trim().toLowerCase())) {
          return res.status(400).json({ error: `program must be one of: ${programAllowed.join(', ')}.` });
        }
        if (typeof service_area_id !== 'string' || !service_area_id.match(/^[0-9a-f-]{36}$/i)) {
          return res.status(400).json({ error: 'service_area_id must be a valid UUID.' });
        }
        const normalizedProgram = String(program).trim().toLowerCase();

        // Find the engineering contract for (client_id + program)
        const ecRow = await pool.query(
          `SELECT id FROM engineering_contracts WHERE client_id = $1 AND program = $2 AND active = TRUE LIMIT 1`,
          [client_id, normalizedProgram]
        );
        if (!ecRow.rows.length) {
          return res.status(404).json({
            error: `No active engineering contract found for client + program "${normalizedProgram}". Admin must create the engineering contract first.`,
          });
        }
        const ecId = ecRow.rows[0].id;

        // Verify the service-area row belongs to this EC
        const saRow = await pool.query(
          `SELECT id, name FROM ec_service_areas WHERE id = $1 AND engineering_contract_id = $2`,
          [service_area_id, ecId]
        );
        if (!saRow.rows.length) {
          return res.status(404).json({
            error: 'No project rollup found for client + program + service area — admin must initialize service area first.',
          });
        }

        // Find the service-area rollup folder project row.
        // rollup_key for ec_service_areas-based folders is the ec_service_areas.id UUID
        const folderRow = await pool.query(
          `SELECT id, engineering_contract_id FROM projects
            WHERE is_rollup = TRUE
              AND rollup_level = 'service_area'
              AND rollup_key = $1
            LIMIT 1`,
          [service_area_id]
        );
        if (!folderRow.rows.length) {
          return res.status(404).json({
            error: 'No project rollup found for client + program + service area — admin must initialize service area first.',
          });
        }
        const folderId = folderRow.rows[0].id;
        const folderEcId = folderRow.rows[0].engineering_contract_id;

        // Try to find an existing leaf under the service-area folder with a
        // case-insensitive name match.
        const existing = await pool.query(
          `SELECT id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name
             FROM projects
            WHERE parent_id = $1
              AND LOWER(name) = LOWER($2)
              AND COALESCE(is_rollup, FALSE) = FALSE
            LIMIT 1`,
          [folderId, normalizedJobName]
        );
        if (existing.rows.length) {
          return res.status(200).json({ ...existing.rows[0], created: false });
        }

        // Create the leaf project under the service-area folder.
        let newRow;
        try {
          const insert = await pool.query(
            `INSERT INTO projects
               (name, client_id, parent_id, engineering_contract_id, program,
                status, is_rollup, billing_type, project_type, service_area_name)
             VALUES ($1, $2, $3, $4, $5, 'active', FALSE, 'hourly', 'other', $6)
             RETURNING id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name`,
            [normalizedJobName, client_id, folderId, folderEcId || ecId, normalizedProgram, saRow.rows[0].name]
          );
          newRow = insert.rows[0];
        } catch (err) {
          if (err.code !== '23505') throw err;
          // Race condition: another caller created the same leaf simultaneously.
          // Re-SELECT the winner.
          const refound = await pool.query(
            `SELECT id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name
               FROM projects
              WHERE parent_id = $1
                AND LOWER(name) = LOWER($2)
                AND COALESCE(is_rollup, FALSE) = FALSE
              LIMIT 1`,
            [folderId, normalizedJobName]
          );
          if (!refound.rows.length) throw err;
          return res.status(200).json({ ...refound.rows[0], created: false });
        }

        broadcast('admin', 'project_added', { id: newRow.id, name: newRow.name, client_id });
        return res.status(201).json({ ...newRow, created: true });

      } else {
        // ═══ MODE 2: NO-EC (free-text service area, optional) ═══
        // service_area_label is optional: blank/missing → project nests directly
        // under the client's team folder with no SA grouping.
        const normalizedLabel = service_area_label ? String(service_area_label).trim() : '';
        if (normalizedLabel.length > 200) {
          return res.status(400).json({
            error: 'service_area_label must be 200 characters or fewer.',
          });
        }

        // Verify client exists
        const clientRow = await pool.query(
          `SELECT id FROM clients WHERE id = $1`,
          [client_id]
        );
        if (!clientRow.rows.length) {
          return res.status(404).json({ error: 'Client not found.' });
        }

        // Use ensureRollupChain to get/create the rollup chain.
        // When normalizedLabel is empty, ensureRollupChain skips the SA level and
        // returns the team folder — project nests directly under Client → Team.
        const ensureRollupChain = app.locals.ensureRollupChain;
        const folderId = await ensureRollupChain(pool, {
          client_id,
          service_area_label: normalizedLabel || null,
          job_id: null,
        });
        if (!folderId) {
          return res.status(500).json({
            error: 'Failed to initialize rollup chain.',
          });
        }

        // Try to find an existing leaf under the folder with a case-insensitive name match.
        const existing = await pool.query(
          `SELECT id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name
             FROM projects
            WHERE parent_id = $1
              AND LOWER(name) = LOWER($2)
              AND COALESCE(is_rollup, FALSE) = FALSE
            LIMIT 1`,
          [folderId, normalizedJobName]
        );
        if (existing.rows.length) {
          return res.status(200).json({ ...existing.rows[0], created: false });
        }

        // Create the leaf project under the folder.
        let newRow;
        try {
          const insert = await pool.query(
            `INSERT INTO projects
               (name, client_id, parent_id, billing_type, project_type, status,
                is_rollup, service_area_name)
             VALUES ($1, $2, $3, 'hourly', 'other', 'active', FALSE, $4)
             RETURNING id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name`,
            [normalizedJobName, client_id, folderId, normalizedLabel || null]
          );
          newRow = insert.rows[0];
        } catch (err) {
          if (err.code !== '23505') throw err;
          // Race condition: another caller created the same leaf simultaneously.
          // Re-SELECT the winner.
          const refound = await pool.query(
            `SELECT id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name
               FROM projects
              WHERE parent_id = $1
                AND LOWER(name) = LOWER($2)
                AND COALESCE(is_rollup, FALSE) = FALSE
              LIMIT 1`,
            [folderId, normalizedJobName]
          );
          if (!refound.rows.length) throw err;
          return res.status(200).json({ ...refound.rows[0], created: false });
        }

        broadcast('admin', 'project_added', { id: newRow.id, name: newRow.name, client_id });
        return res.status(201).json({ ...newRow, created: true });
      }
    } catch (e) {
      console.error('[projects:resolve-or-create]', e && e.message);
      res.status(500).json({ error: 'Failed to resolve or create project.' });
    }
  });

  // DELETE /api/projects/:id/with-tree — delete a project AND every descendant
  // (sub-projects, sub-sub-projects, etc.) PLUS all their time entries,
  // invoice items, permit stages, and permit documents. Captures the entire
  // tree in an undo bucket first so the caller gets a token they can replay
  // within ~60s. Use this for rollup deletion — the regular DELETE refuses
  // when there are children (ON DELETE RESTRICT) and even /with-hours only
  // handles a single leaf.
  //
  // Wave 1.5 [CASCADE-PREVIEW]: ?dry_run=1 returns a full impact summary
  // (projects, time entries) WITHOUT deleting anything. Pass confirm:true in
  // the request body to execute. This prevents accidental mass-deletion of
  // large project trees triggered by a single mistimed click.
  app.delete('/api/projects/:id/with-tree', requireAdmin, async (req, res) => {
    const dryRun  = req.query.dry_run === '1' || req.query.dry_run === 'true';
    const confirm = req.body && (req.body.confirm === true || req.body.confirm === 'true');
    let projects;
    try {
      projects = await collectProjectTree(req.params.id);
    } catch (e) {
      console.error('[projects:with-tree:walk]', e && e.message);
      return res.status(500).json({ error: 'Failed to walk project tree.' });
    }
    if (!projects.length) return res.status(404).json({ error: 'Project not found.' });

    // Dry-run mode OR no explicit confirm: return the impact preview only.
    if (dryRun || !confirm) {
      const projectIds = projects.map(p => p.id);
      const teCount = await pool.query(
        'SELECT COUNT(*)::int AS cnt FROM time_entries WHERE project_id = ANY($1::uuid[])',
        [projectIds]
      ).catch(() => ({ rows: [{ cnt: 0 }] }));
      return res.json({
        dry_run: true,
        preview: {
          root_id: req.params.id,
          root_name: projects[0].name,
          total_projects: projects.length,
          time_entries: teCount.rows[0].cnt,
        },
        message: 'Pass confirm:true in the request body to execute this deletion. This action CANNOT be undone beyond the undo-bucket TTL (~60s).',
      });
    }
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
      // Batch delete all projects in one statement. Postgres evaluates the
      // self-referencing parent_id RESTRICT FK at end-of-statement, so
      // deleting all tree nodes together is safe — no remaining row will
      // reference a deleted parent after the statement completes. The
      // prior per-node depth-first loop was only needed for individual
      // sequential DELETEs. (Phase 6 BE-Perf L-4)
      await client.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [projectIds]);
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
      res.status(500).json({ error: 'Tree delete failed. Check server logs.' });
    } finally {
      client.release();
    }
  });

  // GET /api/projects/:id/monthly-hours-breakdown
  // Returns per-month hours + revenue for a project. Used by the admin detail
  // view for ongoing (monthly-recurring) projects. Works for any project with
  // time entries, not just is_ongoing=true — the UI gates visibility, but the
  // endpoint is unrestricted so the same data feeds the monthly breakdown table.
  app.get('/api/projects/:id/monthly-hours-breakdown', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          EXTRACT(YEAR  FROM te.entry_date)::int AS year,
          EXTRACT(MONTH FROM te.entry_date)::int AS month,
          SUM(te.hours)::numeric(10,2)            AS hours,
          (SUM(te.hours) * COALESCE(p.billing_rate, 0))::numeric(12,2) AS revenue
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        WHERE te.project_id = $1
          AND COALESCE(te.is_billable, TRUE) = TRUE
        GROUP BY year, month
        ORDER BY year, month
      `, [req.params.id]);
      res.json(rows);
    } catch (e) {
      console.error('[projects:monthly-hours-breakdown]', e && e.message);
      res.status(500).json({ error: 'Failed to load monthly breakdown.' });
    }
  });

  // POST /api/projects/:id/generate-monthly-invoice
  // Admin-triggered invoice for an ongoing project's current (or specified) month.
  // Body: { month?: 1-12, year?: YYYY } — defaults to current month/year.
  // Idempotent: returns existing invoice row when one already covers this period.
  app.post('/api/projects/:id/generate-monthly-invoice', requireManagerOrAdmin, async (req, res) => {
    const projectId = req.params.id;
    const now = new Date();
    const month = parseInt(req.body.month, 10) || (now.getMonth() + 1);
    const year  = parseInt(req.body.year,  10) || now.getFullYear();

    if (month < 1 || month > 12) return res.status(400).json({ error: 'month must be 1-12' });

    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
    // Last day of month via day-0 trick
    const periodEnd = new Date(year, month, 0).toISOString().slice(0, 10);

    try {
      const proj = await pool.query(
        `SELECT id, name, client_id, billing_rate, is_ongoing FROM projects WHERE id = $1`,
        [projectId]
      );
      if (!proj.rows.length) return res.status(404).json({ error: 'Project not found.' });
      const p = proj.rows[0];

      // Idempotency: check for an existing invoice whose period overlaps this month
      // keyed by project via invoice_items join.
      const existing = await pool.query(`
        SELECT i.id, i.invoice_number, i.total_amount, i.status
        FROM invoices i
        JOIN invoice_items ii ON ii.invoice_id = i.id
        WHERE ii.project_id = $1
          AND i.billing_period_start = $2
          AND i.billing_period_end   = $3
        LIMIT 1
      `, [projectId, periodStart, periodEnd]);

      if (existing.rows.length) {
        return res.json({ existing: true, invoice: existing.rows[0] });
      }

      // Sum billable hours for the month
      const hoursRes = await pool.query(`
        SELECT COALESCE(SUM(hours), 0)::numeric(10,2) AS hours
        FROM time_entries
        WHERE project_id = $1
          AND EXTRACT(YEAR  FROM entry_date)::int = $2
          AND EXTRACT(MONTH FROM entry_date)::int = $3
          AND COALESCE(is_billable, TRUE) = TRUE
      `, [projectId, year, month]);

      const hours  = parseFloat(hoursRes.rows[0].hours) || 0;
      const rate   = parseFloat(p.billing_rate) || 0;
      const amount = parseFloat((hours * rate).toFixed(2));

      const invoiceNumber = `INV-${year}${String(month).padStart(2, '0')}-${projectId.slice(0, 8).toUpperCase()}`;
      const description   = `${p.name} — ${new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const invRes = await client.query(`
          INSERT INTO invoices (client_id, invoice_number, invoice_date,
            billing_period_start, billing_period_end, total_amount, status, notes)
          VALUES ($1, $2, $3, $4, $5, $6, 'draft', $7)
          ON CONFLICT (invoice_number) DO NOTHING
          RETURNING *
        `, [
          p.client_id,
          invoiceNumber,
          periodEnd,
          periodStart,
          periodEnd,
          amount,
          `Auto-generated for ${p.name}`,
        ]);

        // If INSERT was suppressed by ON CONFLICT, re-SELECT the existing invoice
        let invoice = invRes.rows[0];
        if (!invoice) {
          const existRes = await client.query(
            `SELECT * FROM invoices WHERE invoice_number = $1`,
            [invoiceNumber]
          );
          invoice = existRes.rows[0];
          if (invoice) {
            // Invoice exists but no invoice_items yet for this project — this can happen if
            // the prior attempt succeeded at invoice creation but failed before item insertion.
            // Return it as-is; caller should re-check via the idempotency pattern.
            await client.query('COMMIT');
            return res.json({ existing: true, invoice });
          }
        }

        await client.query(`
          INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
          VALUES ($1, $2, $3, $4, 'hrs', $5, $6)
        `, [invoice.id, projectId, description, hours, rate, amount]);

        await client.query('COMMIT');

        broadcast('admin', 'invoice_generated', { invoice_id: invoice.id, project_id: projectId });
        res.status(201).json({ existing: false, invoice });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (e) {
      console.error('[projects:generate-monthly-invoice]', e && e.message);
      res.status(500).json({ error: 'Failed to generate invoice.' });
    }
  });
};
