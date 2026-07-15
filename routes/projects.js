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
const { logAudit } = require('./_audit');

module.exports = function installProjectsRoutes(app, pool, mw) {
  // Item 2 + 22 fix: requireAuth added alongside requireAdmin.
  // POST and PUT were entirely unguarded — any unauthenticated request
  // could create or mutate projects. requireAuth() gates both handlers.
  const { requireAdmin, requireAuth, requireManagerOrAdmin } = mw;
  const { canCreateProjects, requireStaff } = require('../auth'); // O34: requireStaff = staff-only (excludes trainee/customer)
  const { getEffective, omitUnless, requirePermission } = require('./_permissions');
  // #75 regressive gate (enumerated for VO): invoice generation is a billing
  // mutation → money.manage_billing (admin passes via admin=all; managers need
  // the grant). Closes the #73-core red-team's total_amount leak.
  const canManageBilling = requirePermission(pool, 'money.manage_billing');
  const viewProjects = requirePermission(pool, 'projects.view_all');

  // System F (#73): money.view field-strip (hard rule 8). The SAME project API
  // returns these $ columns to money.view holders and OMITS them entirely from
  // the JSON for everyone else — stripping is server-side, never CSS-hidden.
  // (These are the numeric $ / rate columns on projects + the computed
  // ytd_revenue; billing_type / billing_cadence are categories, not $.)
  const PROJECT_MONEY_FIELDS = [
    'billing_rate', 'expected_revenue', 'actual_revenue',
    'projected_revenue', 'manual_invoice_amount', 'ytd_revenue',
  ];
  // Resolve once per request. FAILS CLOSED: on any error we hide money rather
  // than risk leaking $ (hard rule 8). admin/holders → true via getEffective.
  async function canViewMoney(req) {
    try { return (await getEffective(pool, req.user)).has('money.view'); }
    catch (e) { console.error('[projects:money.view resolve]', e && e.message); return false; }
  }

  // Wave 15: async middleware — 401 if not logged in, 403 if not permitted.
  // On DB error falls back to role-only check so transient failures don't
  // lock out admins/managers.
  async function requireProjectCreate(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    try {
      const ok = await canCreateProjects(req.user, pool);
      if (!ok) return res.status(403).json({ error: 'You do not have permission to create or edit projects.' });
      next();
    } catch (e) {
      console.error('[requireProjectCreate] unexpected error', e && e.message);
      // DB error: fall back to role-based check so admins/managers still pass
      const { isManagerOrAdmin } = require('../auth');
      if (isManagerOrAdmin(req.user.role)) return next();
      return res.status(403).json({ error: 'You do not have permission to create or edit projects.' });
    }
  }

  // Wave 1.5 [UNGATED]: GET /api/projects and GET /api/projects/:id were missing auth.
  app.get('/api/projects', viewProjects, async (req, res) => {
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
          -- SA name for legacy flat projects: concentrator path (PSC)
          con.area_name AS concentrator_area_name,
          -- SA name for legacy flat projects: EC work-order path
          esa_via_wo.name AS ec_service_area_name,
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
        LEFT JOIN concentrators con ON con.id = p.concentrator_id
        LEFT JOIN ec_work_orders wo_link
          ON wo_link.engineering_contract_id = p.engineering_contract_id
         AND wo_link.number = p.work_order_number
        LEFT JOIN ec_service_areas esa_via_wo ON esa_via_wo.id = wo_link.service_area_id
        ${whereStr}
        GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name,
                 con.area_name, esa_via_wo.name
        ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
        ${limitClause}
      `, params);
      const canMoney = await canViewMoney(req);
      res.json(rows.map((r) => omitUnless(r, PROJECT_MONEY_FIELDS, canMoney)));
    } catch (e) {
      console.error('[projects:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects.' });
    }
  });

  // W127-F8: UUID format validation helper — reused by GET, DELETE, and invoice routes.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  function validateUUID(id, res) {
    if (!UUID_RE.test(id)) {
      res.status(400).json({ error: 'Invalid project id format.' });
      return false;
    }
    return true;
  }

  app.get('/api/projects/:id', viewProjects, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      // Same money.view field-strip as the list — a no-money.view user must not
      // read $ via the detail route either (hard rule 8).
      const canMoney = await canViewMoney(req);
      res.json(omitUnless(rows[0], PROJECT_MONEY_FIELDS, canMoney));
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
  // Wave 15: requireProjectCreate gates create to admin/manager + grant holders.
  app.post('/api/projects', requireAuth(), requireProjectCreate, async (req, res) => {
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

    // W246: rollup folders MUST be created through the cascade picker
    // (resolve-or-create → ensureRollupChain) which derives rollup_level +
    // rollup_key from the picker's selected node. Direct POSTs with
    // is_rollup=true and no level/key produce orphan rollups that subsequent
    // cascade calls can't dedupe against. Reject those — the admin UI should
    // never hit this path post-W246.
    if (isRollupFlag) {
      const { rollup_level, rollup_key } = req.body;
      if (!rollup_level || !rollup_key) {
        return res.status(400).json({
          error: 'Rollup folders must be created through the cascade picker (resolve-or-create) which assigns rollup_level + rollup_key. Direct rollup POSTs without those fields are no longer accepted.'
        });
      }
    }

    try {
      // Item 22 fix: if the caller explicitly passes a parent_id (rather than
      // letting ensureRollupChain derive one), verify the target parent
      // actually exists. This prevents re-parenting a project under a
      // non-existent or attacker-controlled UUID.
      // M-4 fix: also verify parent's client_id matches the project's client_id.
      if (parent_id) {
        const parentCheck = await pool.query('SELECT id, client_id FROM projects WHERE id = $1', [parent_id]);
        if (!parentCheck.rows.length) {
          return res.status(400).json({ error: 'parent_id does not reference an existing project' });
        }
        if (parentCheck.rows[0].client_id !== client_id) {
          return res.status(400).json({ error: 'Cannot re-parent under a foreign client\'s tree' });
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
      // hours. The Path B post-Path-B note in docs/archive/2026-05-09/PROJECT_NORTH_STAR.md §6.B
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

      // W246: propagate rollup_level/rollup_key from request body when
      // is_rollup=true (validated above). For non-rollups, both are NULL.
      const insertRollupLevel = isRollupFlag ? (req.body.rollup_level || null) : null;
      const insertRollupKey   = isRollupFlag ? (req.body.rollup_key   || null) : null;

      const { rows } = await pool.query(`
        INSERT INTO projects (
          name, client_id, contract_id, work_order_number,
          project_type, program, job_id,
          status, billing_type, billing_rate,
          footage, miles, expected_hours, expected_revenue,
          start_date, notes, parent_id, budget_code_id, concentrator_id,
          permitting_hours_per_mile, billing_cadence, projected_revenue,
          manual_invoice_amount, is_rollup, engineering_contract_id, service_area_name,
          is_ongoing, rollup_level, rollup_key
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)
        RETURNING *
      `, [
        name, client_id, contract_id || null, work_order_number,
        project_type, program, insertJobId,
        status, insertBillingType, insertBillingRate,
        insertFootage, insertMiles, insertExpHours, insertExpRev,
        start_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
        insertHrPerMi, effectiveCadence, insertProjected,
        insertManual, isRollupFlag, engineering_contract_id || null, service_area_label || null,
        isOngoingFlag, insertRollupLevel, insertRollupKey,
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
      logAudit(pool, { req, action: 'create', entity_type: 'project', entity_id: rows[0].id,
        after: { id: rows[0].id, name: rows[0].name, client_id: rows[0].client_id, program: rows[0].program },
        source: 'admin_ui' });
      // The RETURNING * echo carries $ — strip it for non-money.view editors too
      // (project-create capability is independent of money.view; hard rule 8).
      res.json(omitUnless(rows[0], PROJECT_MONEY_FIELDS, await canViewMoney(req)));
    } catch (e) {
      console.error('[projects:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create project.' });
    }
  });

  // Item 2 fix: requireAuth() added — PUT was completely unguarded.
  // Item 22 fix: parent_id validation — verify the target parent exists
  // before accepting a re-parent operation.
  // Wave 15: requireProjectCreate gates edits to admin/manager + grant holders.
  // M-3 fix: validateUUID on id parameter.
  app.put('/api/projects/:id', requireAuth(), requireProjectCreate, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      // M-4 fix: also verify parent's client_id matches the project's client_id.
      if (parent_id !== undefined && parent_id !== null) {
        const parentCheck = await pool.query('SELECT id, client_id FROM projects WHERE id = $1', [parent_id]);
        if (!parentCheck.rows.length) {
          return res.status(400).json({ error: 'parent_id does not reference an existing project' });
        }
        // Get project's client_id (either from body or existing row)
        const projectClientId = client_id !== undefined ? client_id : (await pool.query('SELECT client_id FROM projects WHERE id=$1', [req.params.id])).rows[0]?.client_id;
        if (parentCheck.rows[0].client_id !== projectClientId) {
          return res.status(400).json({ error: 'Cannot re-parent under a foreign client\'s tree' });
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

      // Conditional clauses for fields that support explicit clearing
      // (ec id, WO#, concentrator, service_area_name, is_ongoing) are now
      // handled in the unified dynamic SET-clause builder below (condDefs).

      // Resolve the effective is_rollup for THIS save:
      //   - explicit param wins
      //   - otherwise read the current row's flag and use it for the
      //     trait-blanking guard below
      const existingRollup = !!existing.rows[0]?.is_rollup;
      const willBeRollup = (isRollupFlag === undefined) ? existingRollup : isRollupFlag;

      // RT-B H-1 fix (Wave 243-coalesce): partial PUT payloads (e.g. W243
      // rename-only `{name}`) MUST preserve fields the caller didn't send
      // — NOT NULL them via undefined→null coercion.
      //
      // Semantic: "key present in req.body" = caller is asserting a value
      // (including explicit null = clear). "key absent" = preserve existing.
      //
      // We build the SET clause dynamically, emitting only columns the
      // caller actually sent. The willBeRollup trait-blanking exception
      // forces NULL on trait columns regardless of presence (rollup
      // invariant: rollups have NO traits).
      const TRAIT_COLS = new Set([
        'job_id', 'billing_type', 'billing_rate',
        'footage', 'miles', 'expected_hours', 'expected_revenue',
        'permitting_hours_per_mile', 'projected_revenue', 'manual_invoice_amount',
      ]);

      // present = was this column "asserted" by the caller?
      // Derived columns (miles/expected_hours/etc.) follow their source
      // body field's presence.
      const hasFootage      = 'footage' in req.body;
      const hasBillingRate  = 'billing_rate' in req.body;
      const hasJobId        = 'job_id' in req.body;
      const hasOngoing      = isOngoingFlag !== undefined;

      const colSources = [
        { col: 'name',                       present: 'name' in req.body,             value: name },
        { col: 'client_id',                  present: 'client_id' in req.body,        value: client_id },
        { col: 'contract_id',                present: 'contract_id' in req.body,      value: contract_id || null },
        { col: 'project_type',               present: 'project_type' in req.body,     value: project_type },
        { col: 'program',                    present: effectiveProgram !== undefined, value: effectiveProgram },
        { col: 'job_id',                     present: hasJobId,                       value: job_id || null },
        { col: 'status',                     present: 'status' in req.body,           value: status },
        // billing_type/billing_rate are also re-derived when job_id is sent
        // (jobs may flip billing_type to 'footage' and supply default_rate).
        { col: 'billing_type',               present: ('billing_type' in req.body) || hasJobId, value: effectiveBillingType },
        { col: 'billing_rate',               present: hasBillingRate || hasJobId,     value: effectiveRate || null },
        { col: 'footage',                    present: hasFootage,                     value: footage || null },
        // Derived from footage:
        { col: 'miles',                      present: hasFootage,                     value: fin.miles },
        { col: 'expected_hours',             present: hasFootage || hasBillingRate,   value: fin.expectedHours },
        { col: 'expected_revenue',           present: hasFootage || hasBillingRate,   value: fin.expectedRevenue },
        { col: 'start_date',                 present: 'start_date' in req.body,       value: start_date || null },
        { col: 'completed_date',             present: 'completed_date' in req.body,   value: completed_date || null },
        { col: 'billed_date',                present: 'billed_date' in req.body,      value: billed_date || null },
        { col: 'notes',                      present: 'notes' in req.body,            value: notes },
        { col: 'parent_id',                  present: 'parent_id' in req.body,        value: parent_id || null },
        { col: 'budget_code_id',             present: 'budget_code_id' in req.body,   value: budget_code_id || null },
        { col: 'permitting_hours_per_mile',  present: hasFootage,                     value: fin.permittingHoursPerMile || existingHpm || null },
        // is_ongoing=true forces cadence='monthly' server-side, so include
        // cadence in SET whenever ongoing flips on, even if caller didn't
        // pass billing_cadence.
        { col: 'billing_cadence',            present: ('billing_cadence' in req.body) || hasOngoing, value: newCadence },
        { col: 'projected_revenue',          present: 'projected_revenue' in req.body, value: newProjected },
        { col: 'manual_invoice_amount',      present: 'manual_invoice_amount' in req.body, value: newManual },
      ];

      const setClauses = [];
      const params = [];
      let slot = 1;

      for (const s of colSources) {
        if (willBeRollup && TRAIT_COLS.has(s.col)) {
          // Rollup trait-blanking invariant: traits MUST be NULL on a
          // rollup, even when caller passed a value. billing_type is
          // NOT NULL so stamp default.
          if (s.col === 'billing_type') {
            setClauses.push(`billing_type = 'hourly'`);
          } else {
            setClauses.push(`${s.col} = NULL`);
          }
          continue;
        }
        if (!s.present) continue; // Preserve existing — omit from SET.
        setClauses.push(`${s.col} = $${slot}`);
        params.push(s.value);
        slot++;
      }

      // is_rollup: COALESCE preserves on undefined.
      const isRollupSlot = slot++;
      params.push(isRollupFlag === undefined ? null : isRollupFlag);
      setClauses.push(`is_rollup = COALESCE($${isRollupSlot}, is_rollup)`);

      // The 5 pre-existing conditional clauses (ec id, WO#, concentrator,
      // service_area_name, is_ongoing) use the same "only emit if caller
      // supplied" pattern. Re-slot them to align with the new layout.
      const condDefs = [
        { used: updEngContractId !== undefined, col: 'engineering_contract_id', value: ecIdForUpdate },
        { used: work_order_number !== undefined, col: 'work_order_number',      value: work_order_number },
        { used: concentrator_id !== undefined,   col: 'concentrator_id',        value: concentrator_id },
        { used: service_area_name !== undefined, col: 'service_area_name',      value: service_area_name },
        { used: hasOngoing,                      col: 'is_ongoing',             value: isOngoingFlag },
      ];
      for (const c of condDefs) {
        if (!c.used) continue;
        setClauses.push(`${c.col} = $${slot++}`);
        params.push(c.value);
      }

      // WHERE id slot last.
      const idSlot = slot;
      params.push(req.params.id);

      const sql = `UPDATE projects SET ${setClauses.join(', ')} WHERE id=$${idSlot} RETURNING *`;
      const { rows } = await pool.query(sql, params);
      if (!rows.length) {
        return res.status(404).json({ error: 'Project not found.' });
      }
      broadcast('admin', 'project_updated', { id: rows[0].id, name: rows[0].name, client_id: rows[0].client_id });
      logAudit(pool, { req, action: 'update', entity_type: 'project', entity_id: rows[0].id,
        after: { id: rows[0].id, name: rows[0].name, status: rows[0].status, program: rows[0].program },
        source: 'admin_ui' });
      // The RETURNING * echo carries $ — strip it for non-money.view editors (hard rule 8).
      res.json(omitUnless(rows[0], PROJECT_MONEY_FIELDS, await canViewMoney(req)));
    } catch (e) {
      console.error('[projects:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update project.' });
    }
  });

  // ?dry_run=1 returns an impact preview without deleting (opt-in).
  // No confirm flag required — single-row delete; undo-bucket is safety net.
  app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      // W127-F7: wrap both DELETEs in a transaction so they're atomic.
      const delClient = await pool.connect();
      try {
        await delClient.query('BEGIN');
        await delClient.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
        await delClient.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
        await delClient.query('COMMIT');
      } catch (txErr) {
        await delClient.query('ROLLBACK');
        throw txErr;
      } finally {
        delClient.release();
      }
      broadcast('admin', 'project_deleted', { id: req.params.id });
      logAudit(pool, { req, action: 'delete', entity_type: 'project', entity_id: req.params.id,
        before: { id: proj.rows[0].id, name: proj.rows[0].name }, source: 'admin_ui' });
      res.json({ ok: true });
    } catch (e) {
      console.error('[projects:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete project.' });
    }
  });

  // Recalculate actual_hours for a single project from its time_entries.
  // requireAuth() added — endpoint was unguarded (any network request could
  // trigger a full upward propagation walk without being authenticated).
  // M-3 fix: validateUUID on id parameter.
  app.post('/api/projects/:id/recalc-hours', requireAuth(), async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      logAudit(pool, { req, action: 'recalc', entity_type: 'project', meta: { scope: 'all_projects', iterations },
        source: 'admin_ui' });
      res.json({ ok: true, iterations });
    } catch (e) {
      console.error('[projects:recalc-all]', e && e.message);
      res.status(500).json({ error: 'Failed to recalculate all project hours.' });
    }
  });

  // Delete a billed project entirely (removes from revenue, hours, everything).
  // ?dry_run=1 returns impact counts without deleting (opt-in).
  // No confirm flag required — undo-bucket is the safety net.
  // M-3 fix: validateUUID on id parameter.
  app.delete('/api/projects/:id/with-hours', requireAdmin, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      logAudit(pool, { req, action: 'delete', entity_type: 'project', entity_id: req.params.id,
        before: { id: proj[0].id, name: proj[0].name }, meta: { with_hours: true }, source: 'admin_ui' });
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
  app.post('/api/projects/resolve-or-create', requireAuth(), requireProjectCreate, async (req, res) => {
    const {
      client_id, program, service_area_id, service_area_label,
      job_name, contract_id, project_type: explicitProjectType,
      footage: rawFootage, expected_hours: rawExpectedHours,
    } = req.body;

    // Validate optional numeric amounts — ignore when absent or non-numeric.
    const submittedFootage       = (rawFootage !== undefined && rawFootage !== null && rawFootage !== '' && !isNaN(parseFloat(rawFootage)) && parseFloat(rawFootage) >= 0) ? parseFloat(rawFootage) : null;
    const submittedExpectedHours = (rawExpectedHours !== undefined && rawExpectedHours !== null && rawExpectedHours !== '' && !isNaN(parseFloat(rawExpectedHours)) && parseFloat(rawExpectedHours) >= 0) ? parseFloat(rawExpectedHours) : null;

    // Input validation (common to both modes)
    if (!job_name || !String(job_name).trim()) {
      return res.status(400).json({ error: 'job_name is required and must be non-empty.' });
    }
    if (!client_id || typeof client_id !== 'string' || !client_id.match(/^[0-9a-f-]{36}$/i)) {
      return res.status(400).json({ error: 'client_id must be a valid UUID.' });
    }
    const normalizedJobName = String(job_name).trim();

    // Validate contract_id when provided — must be a UUID string.
    const normalizedContractId = (contract_id && typeof contract_id === 'string' && contract_id.match(/^[0-9a-f-]{36}$/i))
      ? contract_id
      : null;

    // Resolve job metadata (team, billing type, rate, permitting flag) from the jobs table by name.
    // Used to set project_type, billing_type, billing_rate, and create the Category rollup folder.
    // Falls back to defaults when the job name doesn't match any jobs row (e.g. free-text entry).
    let resolvedJobTeam = null;
    let resolvedJobIsPermitting = false;
    let resolvedJobDefaultBillingType = null;
    let resolvedJobDefaultRate = null;
    try {
      const jobRow = await pool.query(
        `SELECT team, is_permitting, default_billing_type, default_rate FROM jobs WHERE LOWER(name) = LOWER($1) AND active = TRUE LIMIT 1`,
        [normalizedJobName]
      );
      if (jobRow.rows.length) {
        const j = jobRow.rows[0];
        resolvedJobTeam = j.team || null;
        resolvedJobIsPermitting = !!j.is_permitting;
        resolvedJobDefaultBillingType = j.default_billing_type || null;
        resolvedJobDefaultRate = j.default_rate || null;
      }
    } catch (jobErr) {
      // Non-fatal: job lookup is advisory; proceed with defaults if it fails.
      console.error('[projects:resolve-or-create] job lookup error:', jobErr && jobErr.message);
    }

    // Determine project_type. When the caller supplies an explicit value (e.g. the design
    // portal always sends project_type:'design'), use it directly so the project appears in
    // the correct pipeline even when the free-text job name doesn't match any jobs row.
    // Fall back to derivation from jobs.team when no explicit value is provided.
    const allowedExplicit = ['design', 'permitting', 'construction', 'other'];
    const teamToProjectType = { design: 'design', permitting: 'permitting' };
    const derivedProjectType = (explicitProjectType && allowedExplicit.includes(String(explicitProjectType)))
      ? String(explicitProjectType)
      : (resolvedJobTeam && teamToProjectType[resolvedJobTeam]) || 'other';

    // Derive billing type and rate from the matched job row.
    // is_permitting ⇒ billing_type='footage'; else use job's default_billing_type || 'hourly'.
    const effectiveBillingType = resolvedJobIsPermitting
      ? 'footage'
      : (resolvedJobDefaultBillingType || 'hourly');
    const effectiveRate = resolvedJobDefaultRate;

    // Compute financials using the same helper as the main POST/PUT.
    // For permitting jobs, calcProjectFinancials derives expected_hours + expected_revenue from footage.
    // For hourly jobs it returns all nulls (expected_hours stored directly from submittedExpectedHours).
    const isPermittingLeaf = resolvedJobIsPermitting || derivedProjectType === 'permitting';
    const finType = isPermittingLeaf ? 'permitting' : 'other';
    const fin = calcProjectFinancials(finType, effectiveRate, submittedFootage);
    const insertFootage      = isPermittingLeaf ? (submittedFootage || null) : null;
    const insertExpHours     = isPermittingLeaf ? fin.expectedHours : (submittedExpectedHours || null);
    const insertExpRev       = fin.expectedRevenue;
    const insertMiles        = fin.miles;
    const insertHrPerMi      = fin.permittingHoursPerMile || null;

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

        // Auto-create the full rollup chain:
        //   Client → EC → [Construction Contract] → SA → [Category] → leaf
        // ensureRollupChain accepts:
        //   concentrator_id = service_area_id → resolves SA name from ec_service_areas.
        //   engineering_contract_id → creates EC folder above SA.
        //   contract_id (new) → creates Construction Contract folder between EC and SA.
        //   job_team (new) → creates Category folder below SA.
        const ensureRollupChain = app.locals.ensureRollupChain;
        const folderId = await ensureRollupChain({
          client_id,
          engineering_contract_id: ecId,
          concentrator_id: service_area_id,
          contract_id: normalizedContractId,
          job_id: null,
          job_team: resolvedJobTeam,
        });
        if (!folderId) {
          return res.status(500).json({ error: 'Failed to initialize rollup chain.' });
        }

        // Try to find an existing leaf under the deepest folder with a
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

        // Create the leaf project under the deepest folder.
        let newRow;
        try {
          const insert = await pool.query(
            `INSERT INTO projects
               (name, client_id, parent_id, engineering_contract_id, program,
                status, is_rollup, billing_type, billing_rate, project_type, service_area_name,
                footage, miles, expected_hours, expected_revenue, permitting_hours_per_mile)
             VALUES ($1, $2, $3, $4, $5, 'active', FALSE, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name`,
            [
              normalizedJobName, client_id, folderId, ecId, normalizedProgram,
              effectiveBillingType, effectiveRate || null, derivedProjectType, saRow.rows[0].name,
              insertFootage, insertMiles, insertExpHours, insertExpRev, insertHrPerMi,
            ]
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

        // Auto-create pipeline stage entries for design and permitting projects.
        if (derivedProjectType === 'design' && newRow && newRow.id) {
          await pool.query(
            `INSERT INTO design_stages (project_id, stage) VALUES ($1, 'potential') ON CONFLICT (project_id, stage) DO NOTHING`,
            [newRow.id]
          );
        }
        if (isPermittingLeaf && newRow && newRow.id) {
          await pool.query(
            `INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1, 'potential', $2) ON CONFLICT (project_id, stage) DO NOTHING`,
            [newRow.id, req.user && req.user.id || null]
          );
        }

        broadcast('admin', 'project_added', { id: newRow.id, name: newRow.name, client_id });
        logAudit(pool, { req, action: 'create', entity_type: 'project', entity_id: newRow.id,
          after: { id: newRow.id, name: newRow.name, client_id, mode: 'ec' }, source: 'api' });
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
        // app.locals.ensureRollupChain is a wrapper (params) => fn(pool, params),
        // so it takes ONE argument (the params object) — NOT (pool, params).
        const ensureRollupChain = app.locals.ensureRollupChain;
        const folderId = await ensureRollupChain({
          client_id,
          service_area_label: normalizedLabel || null,
          contract_id: normalizedContractId,
          job_id: null,
          job_team: resolvedJobTeam,
        });
        if (!folderId) {
          return res.status(500).json({
            error: 'Failed to initialize rollup chain.',
          });
        }

        // Try to find an existing leaf under the deepest folder with a case-insensitive name match.
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

        // Create the leaf project under the deepest folder.
        let newRow;
        try {
          const insert = await pool.query(
            `INSERT INTO projects
               (name, client_id, parent_id, billing_type, billing_rate, project_type, status,
                is_rollup, service_area_name,
                footage, miles, expected_hours, expected_revenue, permitting_hours_per_mile)
             VALUES ($1, $2, $3, $4, $5, $6, 'active', FALSE, $7, $8, $9, $10, $11, $12)
             RETURNING id, name, is_rollup, parent_id, status, engineering_contract_id, service_area_name`,
            [
              normalizedJobName, client_id, folderId,
              effectiveBillingType, effectiveRate || null, derivedProjectType, normalizedLabel || null,
              insertFootage, insertMiles, insertExpHours, insertExpRev, insertHrPerMi,
            ]
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

        // Auto-create pipeline stage entries for design and permitting projects.
        if (derivedProjectType === 'design' && newRow && newRow.id) {
          await pool.query(
            `INSERT INTO design_stages (project_id, stage) VALUES ($1, 'potential') ON CONFLICT (project_id, stage) DO NOTHING`,
            [newRow.id]
          );
        }
        if (isPermittingLeaf && newRow && newRow.id) {
          await pool.query(
            `INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1, 'potential', $2) ON CONFLICT (project_id, stage) DO NOTHING`,
            [newRow.id, req.user && req.user.id || null]
          );
        }

        broadcast('admin', 'project_added', { id: newRow.id, name: newRow.name, client_id });
        logAudit(pool, { req, action: 'create', entity_type: 'project', entity_id: newRow.id,
          after: { id: newRow.id, name: newRow.name, client_id, mode: 'no_ec' }, source: 'api' });
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
  // M-3 fix: validateUUID on id parameter.
  app.delete('/api/projects/:id/with-tree', requireAdmin, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      logAudit(pool, { req, action: 'delete', entity_type: 'project', entity_id: req.params.id,
        meta: { tree: true, deleted_projects: projects.length, deleted_time_entries: teRes.rows.length,
                undo_token: undo.token },
        source: 'admin_ui' });
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
  // M-3 fix: validateUUID on id parameter.
  app.get('/api/projects/:id/monthly-hours-breakdown', viewProjects, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      // `revenue` is a computed $ (hours × billing_rate) — omit it for non-money.view
      // staff; hours/year/month stay (hard rule 8). Gating the whole endpoint by a
      // key is #75's cross-route scope; the $ field-strip is #73-core's.
      const canMoney = await canViewMoney(req);
      res.json(rows.map((r) => omitUnless(r, ['revenue'], canMoney)));
    } catch (e) {
      console.error('[projects:monthly-hours-breakdown]', e && e.message);
      res.status(500).json({ error: 'Failed to load monthly breakdown.' });
    }
  });

  // POST /api/projects/:id/generate-monthly-invoice
  // Admin-triggered invoice for an ongoing project's current (or specified) month.
  // Body: { month?: 1-12, year?: YYYY } — defaults to current month/year.
  // Idempotent: returns existing invoice row when one already covers this period.
  app.post('/api/projects/:id/generate-monthly-invoice', canManageBilling, async (req, res) => {
    if (!validateUUID(req.params.id, res)) return;
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
      // W127-F10: guard — only ongoing projects should generate monthly invoices.
      if (!p.is_ongoing) return res.status(400).json({ error: 'Project is not flagged as ongoing. Enable the ongoing flag before generating monthly invoices.' });

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

        // W205: pass period_year/period_month so the unique partial index
        // (idx_invoice_items_project_period, migration 0043/0058) catches a
        // race-condition duplicate that slipped past the existing SELECT
        // probe at the top of this handler. A 23505 here means another
        // request beat us to it — return 409 with the existing invoice.
        try {
          await client.query(`
            INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount, period_year, period_month)
            VALUES ($1, $2, $3, $4, 'hrs', $5, $6, $7, $8)
          `, [invoice.id, projectId, description, hours, rate, amount, year, month]);
        } catch (itemErr) {
          if (itemErr.code === '23505' && itemErr.constraint === 'idx_invoice_items_project_period') {
            await client.query('ROLLBACK');
            return res.status(409).json({
              error: 'Already invoiced for this period',
              period_year: year,
              period_month: month,
            });
          }
          throw itemErr;
        }

        await client.query('COMMIT');

        broadcast('admin', 'invoice_generated', { invoice_id: invoice.id, project_id: projectId });
        logAudit(pool, { req, action: 'create', entity_type: 'invoice', entity_id: invoice.id,
          after: { id: invoice.id, invoice_number: invoice.invoice_number, project_id: projectId, amount: invoice.total_amount },
          meta: { monthly_generation: true, month, year }, source: 'admin_ui' });
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
