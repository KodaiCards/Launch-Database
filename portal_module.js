// ═══════════════════════════════════════════════════════════════════════════
// portal_module.js
//
// Self-contained extension that powers Design and Permitting portals plus the
// admin's settings-approval flow. Drop this file next to server.js and wire
// it up at the top of server.js with:
//
//   const installPortalExtensions = require('./portal_module');
//   ...
//   installPortalExtensions(app, pool, PORTAL_MODE);
//
// This must be called BEFORE the existing route definitions in server.js,
// because in portal mode it registers overriding routes that win first-match
// in Express's routing table.
//
// In ADMIN mode (no PORTAL_MODE env var):
//   - Only the /api/setting-requests/* endpoints are registered.
//   - All existing admin routes work unchanged.
//   - server.js still needs to call isDuplicateProject() before INSERT/UPDATE
//     on projects (see the small server.js patches in the README).
//
// In PORTAL mode ('design' or 'permitting'):
//   - /api/jobs       → filtered to this portal's team; writes become proposals.
//   - /api/project-types, /api/clients, /api/contracts → writes become proposals.
//   - /api/projects   → filtered (only projects whose job is this team or
//                       'both' or unassigned, plus all of their ancestors for
//                       context); money fields stripped from every response.
//   - Project create/update validates the chosen job belongs to this portal.
//   - Duplicate-project rule is enforced (same name + same parent rejected).
// ═══════════════════════════════════════════════════════════════════════════

// ─── Money fields we strip from project responses sent to portals ───────────
const PROJECT_MONEY_FIELDS = [
  'billing_rate', 'expected_revenue', 'projected_revenue',
  'manual_invoice_amount', 'actual_revenue', 'ytd_revenue',
  'permitting_hours_per_mile' // not money strictly, but reveals revenue calc
];
function stripMoneyFromProject(p) {
  if (!p) return p;
  const out = { ...p };
  for (const f of PROJECT_MONEY_FIELDS) delete out[f];
  return out;
}
function stripMoneyFromJob(j) {
  if (!j) return j;
  const out = { ...j };
  delete out.default_rate;
  return out;
}

// ─── Duplicate-project check (exported for use in admin endpoints too) ──────
async function isDuplicateProject(pool, name, parentId, excludeId = null) {
  if (!name) return false;
  const params = [String(name).trim().toLowerCase(), parentId || null];
  let q = `
    SELECT id FROM projects
    WHERE LOWER(name) = $1
      AND COALESCE(parent_id::text, 'ROOT') = COALESCE($2::text, 'ROOT')
  `;
  if (excludeId) {
    q += ' AND id <> $3';
    params.push(excludeId);
  }
  const r = await pool.query(q + ' LIMIT 1', params);
  return r.rows.length > 0;
}

// ─── Auto-nesting: ensure rollup chain exists, return team-folder id ────────
// Builds (or finds) the Client → Service Area → Project Type → Team rollup
// chain and returns the deepest existing rollup id, suitable for use as the
// new project's parent_id.
async function ensureRollupChain(pool, { client_id, concentrator_id, service_area_label, job_id, engineering_contract_id }, pgClient) {
  if (!client_id) return null;

  // Three-level rollup hierarchy: Client → Team → Service Area → (project).
  //
  // Team resolution rules — there are exactly THREE possible team folders
  // under any client, never more:
  //   - 'design'     → "Design Team" folder
  //   - 'permitting' → "Permitting Team" folder
  //   - 'both' or NULL or anything else → "Shared / Other" folder
  // Importantly, 'both' collapses to 'shared'. The reason: the user wants
  // ONE Shared folder per client that holds ONLY projects whose jobs are
  // explicitly cross-team or unassigned. Without this collapse, a project
  // with team='both' would create a separate "Shared (Design + Permitting)"
  // folder distinct from a project with team=NULL — visible to the user as
  // duplicate-looking team folders. By normalizing to 'shared', the rollup_key
  // is always one of three values, so findOrCreateRollup returns the same
  // folder for every project that should share it.
  //
  // Service Area resolution:
  //   - PSC clients: concentrator_id (looked up from WO# match) → folder named
  //     after the concentrator's area_name. rollup_key = concentrator UUID.
  //   - Non-PSC clients: service_area_label (free text) → folder named that
  //     label. rollup_key = client_id|lowercased_label so case-insensitive
  //     dedup happens but cross-client collisions are avoided.
  //   - Neither provided → Service Area level skipped; project lands directly
  //     under the Team folder.

  // 1) Client folder
  const cli = await pool.query('SELECT name FROM clients WHERE id = $1', [client_id]);
  if (!cli.rows.length) return null;
  const clientName = cli.rows[0].name;

  let folder = await findOrCreateRollup(pool, {
    parent_id: null,
    rollup_level: 'client',
    rollup_key: client_id,
    name: clientName,
    extras: { client_id, engineering_contract_id: engineering_contract_id || null }
  }, pgClient);

  // 2) Team folder — normalize anything that isn't 'design' or 'permitting'
  // into 'shared'. This guarantees only three possible team folders per client.
  let rawTeam = null;
  if (job_id) {
    const jr = await pool.query('SELECT team FROM jobs WHERE id = $1', [job_id]);
    rawTeam = jr.rows[0]?.team || null;
  }
  let teamKey, teamLabel;
  if (rawTeam === 'design') {
    teamKey = 'design';
    teamLabel = 'Design Team';
  } else if (rawTeam === 'permitting') {
    teamKey = 'permitting';
    teamLabel = 'Permitting Team';
  } else if (rawTeam === 'construction' || rawTeam === 'inspection') {
    // 'inspection' is the legacy team value; the 0009 migration
    // renamed it to 'construction' but we still accept both so any
    // unmigrated row in flight (e.g. a job inserted between code
    // deploy and migration apply) keeps working.
    teamKey = 'construction';
    teamLabel = 'Construction Team';
  } else {
    // 'both', NULL, 'shared', or any unrecognized value all collapse here.
    teamKey = 'shared';
    teamLabel = 'Shared / Other';
  }

  folder = await findOrCreateRollup(pool, {
    parent_id: folder,
    rollup_level: 'team',
    rollup_key: teamKey,
    name: teamLabel,
    extras: { client_id, engineering_contract_id: engineering_contract_id || null }
  }, pgClient);

  // 3) Service Area folder — optional. Either concentrator-based (PSC) or
  // free-text label (non-PSC). If neither, skip this level.
  let areaKey = null, areaLabel = null;
  if (concentrator_id) {
    const con = await pool.query('SELECT area_name FROM concentrators WHERE id = $1', [concentrator_id]);
    areaKey = concentrator_id;
    areaLabel = con.rows[0]?.area_name || 'Service Area';
  } else if (service_area_label && service_area_label.trim()) {
    const trimmed = service_area_label.trim();
    areaKey = client_id + '|' + trimmed.toLowerCase();  // scoped to client to avoid cross-client collisions
    areaLabel = trimmed;
  }
  if (areaKey) {
    folder = await findOrCreateRollup(pool, {
      parent_id: folder,
      rollup_level: 'service_area',
      rollup_key: areaKey,
      name: areaLabel,
      extras: { client_id, concentrator_id: concentrator_id || null, engineering_contract_id: engineering_contract_id || null }
    }, pgClient);
  }

  return folder;
}

async function findOrCreateRollup(pool, { parent_id, rollup_level, rollup_key, name, extras }, pgClient) {
  // Use pgClient (transaction client) when provided, otherwise pool
  const db = pgClient || pool;
  // Try find first
  const found = await db.query(
    `SELECT id FROM projects
       WHERE is_rollup = TRUE AND rollup_level = $1 AND rollup_key = $2
         AND COALESCE(parent_id::text, 'ROOT') = COALESCE($3::text, 'ROOT')
       LIMIT 1`,
    [rollup_level, String(rollup_key), parent_id]
  );
  if (found.rows.length) return found.rows[0].id;

  // Create. The new partial unique index excludes rollups so this should be
  // safe, but be defensive against pre-existing databases where the old
  // unconditional index might still exist (bootstrap rebuilds it, but in case
  // of timing we retry with a suffixed name).
  const e = extras || {};
  try {
    const r = await db.query(`
      INSERT INTO projects (name, client_id, parent_id, concentrator_id, program,
                            status, is_rollup, rollup_level, rollup_key, project_type,
                            engineering_contract_id)
      VALUES ($1, $2, $3, $4, $5, 'active', TRUE, $6, $7, 'rollup', $8)
      RETURNING id
    `, [name, e.client_id || null, parent_id || null, e.concentrator_id || null,
        e.program || null, rollup_level, String(rollup_key),
        e.engineering_contract_id || null]);
    return r.rows[0].id;
  } catch (err) {
    if (err.code !== '23505') throw err;
    // 23505 = unique_violation. Two scenarios:
    //   (1) Concurrent insert of same rollup — re-find and return that id.
    //   (2) Old index still includes rollups, and a real project at this
    //       parent shares the rollup's name. In that case retry with a
    //       prefixed name that's unlikely to collide.
    const refound = await db.query(
      `SELECT id FROM projects
         WHERE is_rollup = TRUE AND rollup_level = $1 AND rollup_key = $2
           AND COALESCE(parent_id::text, 'ROOT') = COALESCE($3::text, 'ROOT')
         LIMIT 1`,
      [rollup_level, String(rollup_key), parent_id]
    );
    if (refound.rows.length) return refound.rows[0].id;
    // Fallback: prefixed name to dodge collision with a real project
    const prefixed = `[${rollup_level.replace('_', ' ')}] ${name}`;
    const r2 = await db.query(`
      INSERT INTO projects (name, client_id, parent_id, concentrator_id, program,
                            status, is_rollup, rollup_level, rollup_key, project_type,
                            engineering_contract_id)
      VALUES ($1, $2, $3, $4, $5, 'active', TRUE, $6, $7, 'rollup', $8)
      RETURNING id
    `, [prefixed, e.client_id || null, parent_id || null, e.concentrator_id || null,
        e.program || null, rollup_level, String(rollup_key),
        e.engineering_contract_id || null]);
    return r2.rows[0].id;
  }
}

// ─── Apply an approved setting change request to the real tables ────────────
// Called by the admin approve endpoint. Translates JSON payload → SQL.
async function applySettingChange(pool, sr) {
  const { entity_type, action, entity_id, payload } = sr;
  const p = typeof payload === 'string' ? JSON.parse(payload) : (payload || {});

  if (entity_type === 'job') {
    if (action === 'create') {
      await pool.query(
        `INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting, notes, team)
           VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (name) DO UPDATE SET active = true`,
        [p.name, p.default_billing_type || 'hourly', p.default_rate ?? null,
         !!p.is_permitting, p.notes ?? null, p.team ?? null]
      );
    } else if (action === 'update') {
      await pool.query(
        `UPDATE jobs SET
           name                 = COALESCE($2, name),
           default_billing_type = COALESCE($3, default_billing_type),
           is_permitting        = COALESCE($4, is_permitting),
           notes                = COALESCE($5, notes),
           active               = COALESCE($6, active),
           team                 = COALESCE($7, team)
         WHERE id = $1`,
        [entity_id, p.name, p.default_billing_type, p.is_permitting,
         p.notes, p.active, p.team]
      );
    } else if (action === 'delete') {
      await pool.query('UPDATE jobs SET active = false WHERE id = $1', [entity_id]);
    }
  }

  else if (entity_type === 'project_type') {
    // Phase 3b (2026-05-04): the project_types table was dropped. Old
    // pending change requests of this type are silently no-ops on apply
    // (programs are now a fixed enum, not a CRUD entity). The endpoints
    // below were also removed, so no new requests of this type can be
    // created — this branch only runs for pre-existing pending rows.
    return;
  }

  else if (entity_type === 'client') {
    if (action === 'create') {
      // Path B: no is_rus on creation. Program lives on engineering contracts.
      await pool.query(
        `INSERT INTO clients (name, notes) VALUES ($1,$2)`,
        [p.name, p.notes ?? null]
      );
    } else if (action === 'update') {
      await pool.query(
        `UPDATE clients SET name = COALESCE($2,name), notes = $3 WHERE id = $1`,
        [entity_id, p.name, p.notes ?? null]
      );
    } else if (action === 'delete') {
      await pool.query('DELETE FROM clients WHERE id = $1', [entity_id]);
    }
  }

  else if (entity_type === 'contract') {
    if (action === 'create') {
      await pool.query(
        `INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3)`,
        [p.client_id, p.contract_number, p.name ?? null]
      );
    }
  }

  else if (entity_type === 'project') {
    // Engineers requesting a new project from the timeclock portal go
    // through here. Time entries logged against the request stay HELD
    // (project_id=NULL, pending_project_request_id=sr.id) until this
    // approval lands; when it does, every held timecard retro-attaches
    // to the new project's id.
    //
    // Delete (action='delete') is the design/permitting "delete with
    // notification" flow: portal user proposes a delete; admin approves
    // here, falling back to /api/projects/:id/with-tree's behaviour
    // (cascade clean of children + time entries + invoice items + permit
    // stages + billing batch items, all RESTRICT-safe).
    if (action === 'create') {
      // Project create + retro-attach must be atomic. If we INSERT the
      // project but then fail to UPDATE held time_entries, the operator
      // ends up with the project visible but the held hours stuck in
      // limbo (still pointing at the request, never resurfaced). Wrap
      // both in a transaction so partial-success can't happen.
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Derive engineering_contract_id from contract_id when available.
        let engineeringContractId = p.engineering_contract_id || null;
        if (!engineeringContractId && p.contract_id) {
          const ecRow = await client.query(
            `SELECT engineering_contract_id FROM contracts WHERE id = $1`,
            [p.contract_id]
          );
          engineeringContractId = ecRow.rows[0]?.engineering_contract_id || null;
        }

        // Ensure the rollup chain exists so this project lands in the
        // tree rather than as an orphan. Returns the deepest rollup
        // folder id to use as parent_id.
        let parentId = p.parent_id || null;
        if (!parentId && p.client_id) {
          parentId = await ensureRollupChain(pool, {
            client_id: p.client_id,
            concentrator_id: p.concentrator_id || null,
            service_area_label: p.service_area_label || null,
            job_id: p.job_id || null,
            engineering_contract_id: engineeringContractId,
          }, client);
        }

        const ins = await client.query(
          `INSERT INTO projects (name, client_id, contract_id, work_order_number, project_type,
                                 billing_type, status, notes, parent_id, engineering_contract_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [
            p.name,
            p.client_id || null,
            p.contract_id || null,
            p.work_order_number || null,
            p.project_type || 'other',
            p.billing_type || 'hourly',
            'active',
            p.notes || null,
            parentId,
            engineeringContractId,
          ]
        );
        const newProjectId = ins.rows[0]?.id;
        if (newProjectId && sr.id) {
          await client.query(
            `UPDATE time_entries
                SET project_id = $1,
                    pending_project_request_id = NULL
              WHERE pending_project_request_id = $2`,
            [newProjectId, sr.id]
          );
        }
        await client.query('COMMIT');
      } catch (e) {
        try { await client.query('ROLLBACK'); } catch {}
        throw e;
      } finally {
        client.release();
      }
    } else if (action === 'delete') {
      // Mirror the route-level project DELETE: pull from any pending
      // billing batches first, then drop the project. RESTRICT FKs
      // (children, time_entries) will surface as a constraint error if
      // the project isn't a clean leaf — the admin reviewer should
      // reject the request and tell the portal user to clear those
      // first.
      await pool.query('DELETE FROM billing_batch_items WHERE project_id = $1', [entity_id]);
      await pool.query('DELETE FROM projects WHERE id = $1', [entity_id]);
    }
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN INSTALLER
// ═══════════════════════════════════════════════════════════════════════════
//
// authHelpers: { requireAuth, requireAdmin } from auth.js. REQUIRED — every
// route registered here is wrapped in requireAuth, and admin-only flows
// (approve/reject) use requireAdmin. The previous version had no auth at
// all, which let any caller approve their own setting requests.
function installPortalExtensions(app, pool, PORTAL_MODE, authHelpers) {
  const isPortal = !!PORTAL_MODE;
  const portal   = PORTAL_MODE; // 'design' or 'permitting'

  // Defensive: legacy callers omitted authHelpers and got silent no-auth
  // routes. Reject that loudly instead.
  if (!authHelpers || !authHelpers.requireAuth || !authHelpers.requireAdmin) {
    throw new Error('installPortalExtensions: authHelpers { requireAuth, requireAdmin } is required');
  }
  const requireAuth  = authHelpers.requireAuth;
  const requireAdmin = authHelpers.requireAdmin;
  // Convenience: the actor for proposed_by / updated_by columns. Falls back
  // to req.body.proposed_by for callers that haven't been migrated yet.
  const actorOf = (req) => (req.user && (req.user.username || req.user.id)) || req.body?.proposed_by || null;

  // Make helpers accessible to server.js's admin POST/PUT.
  app.locals.isDuplicateProject = (name, parentId, excludeId) =>
    isDuplicateProject(pool, name, parentId, excludeId);
  app.locals.ensureRollupChain = (params) => ensureRollupChain(pool, params);

  // ─── Setting-request endpoints (work in BOTH portal and admin mode) ─────

  // List requests. Admin sees all (filterable by status). Portal sees only
  // requests submitted from THIS portal (so users can track their own).
  app.get('/api/setting-requests', requireAuth(), async (req, res) => {
    try {
      const { status } = req.query;
      const where = [];
      const params = [];
      let i = 1;
      if (status)   { where.push(`status        = $${i++}`); params.push(status); }
      if (isPortal) { where.push(`source_portal = $${i++}`); params.push(portal); }
      const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const { rows } = await pool.query(
        `SELECT * FROM setting_change_requests ${whereStr} ORDER BY created_at DESC LIMIT 200`,
        params
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Pending count — used for the red badge on the Settings button.
  app.get('/api/setting-requests/count', requireAuth(), async (req, res) => {
    try {
      const params = [];
      let where = `status = 'pending'`;
      if (isPortal) { where += ` AND source_portal = $1`; params.push(portal); }
      const r = await pool.query(
        `SELECT COUNT(*)::int AS pending FROM setting_change_requests WHERE ${where}`,
        params
      );
      res.json({ pending: r.rows[0].pending });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Approve — applies the change, marks approved. Admin only — enforced
  // BOTH by requireAdmin (rejects portal users + non-admins) and by the
  // isPortal short-circuit (portal services run with limited permissions
  // anyway and shouldn't even register this surface).
  app.put('/api/setting-requests/:id/approve', requireAdmin, async (req, res) => {
    if (isPortal) return res.status(403).json({ error: 'Admin only' });
    const { payload_overrides } = req.body || {};
    const reviewed_by = (req.user && req.user.username) || req.body?.reviewed_by || null;
    try {
      const r = await pool.query(
        `SELECT * FROM setting_change_requests WHERE id = $1 AND status = 'pending'`,
        [req.params.id]
      );
      if (!r.rows.length) {
        return res.status(404).json({ error: 'Request not found or no longer pending' });
      }
      const sr = r.rows[0];
      // Admin can edit the payload at approval time (e.g. set team/rate on a
      // proposed new Job before it hits the jobs table).
      if (payload_overrides && typeof payload_overrides === 'object') {
        const merged = { ...(typeof sr.payload === 'string' ? JSON.parse(sr.payload) : sr.payload),
                         ...payload_overrides };
        sr.payload = merged;
      }
      await applySettingChange(pool, sr);
      await pool.query(
        `UPDATE setting_change_requests
           SET status = 'approved', reviewed_by = $2, reviewed_at = NOW(),
               payload = $3
         WHERE id = $1`,
        [req.params.id, reviewed_by || null,
         JSON.stringify(typeof sr.payload === 'string' ? JSON.parse(sr.payload) : sr.payload)]
      );
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/setting-requests/:id/reject', requireAdmin, async (req, res) => {
    if (isPortal) return res.status(403).json({ error: 'Admin only' });
    const { review_notes } = req.body || {};
    const reviewed_by = (req.user && req.user.username) || req.body?.reviewed_by || null;
    try {
      await pool.query(
        `UPDATE setting_change_requests
           SET status = 'rejected', reviewed_by = $2, reviewed_at = NOW(), review_notes = $3
         WHERE id = $1 AND status = 'pending'`,
        [req.params.id, reviewed_by || null, review_notes || null]
      );
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Below this line: portal-mode-only routes ─────────────────────────────
  // Customer portal has its own dedicated route module
  // (routes/customer_portal.js) and shouldn't inherit the design /
  // permitting team-scoped jobs/projects/clients routes — those would
  // pollute the customer's API surface with team-shaped filters that
  // don't apply to external clients.
  //
  // Timeclock skips them too. The timeclock is open to all logged-in users
  // (server.js SPA fallback comment "SPECIAL CASE: PORTAL_MODE='timeclock'
  // is open to all logged-in users"), so its project / job dropdowns must
  // surface every leaf project regardless of team. The team-scoped
  // /api/projects below would have filtered everything out (no jobs have
  // team = 'timeclock'), leaving the dropdown empty and clock-in unusable.
  if (!isPortal || PORTAL_MODE === 'customer' || PORTAL_MODE === 'timeclock') return;

  // Helper: stage a change as a pending proposal.
  async function proposeChange(entityType, action, entityId, payload, proposedBy, currentSnapshot = null) {
    const r = await pool.query(
      `INSERT INTO setting_change_requests
         (entity_type, action, entity_id, payload, current_snapshot, source_portal, proposed_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [entityType, action, entityId || null,
       JSON.stringify(payload || {}),
       currentSnapshot ? JSON.stringify(currentSnapshot) : null,
       portal, proposedBy || null]
    );
    return r.rows[0];
  }
  const proposalResponse = (sr, verb = 'Submitted') => ({
    pending: true,
    request_id: sr.id,
    message: `${verb} for admin approval`
  });

  // ── JOBS ────────────────────────────────────────────────────────────────
  // GET filters by:
  //   1) team match — only EXPLICIT team match or 'both'. Jobs with NULL
  //      team (admin-only / unassigned) are excluded from portals to prevent
  //      legacy/leftover jobs from leaking into the portal dropdowns.
  //   2) program_scope — when engineering_contract_id is given, scope by
  //      the EC's program. Fall back to client's EC mix when only client_id
  //      is supplied. Mirrors the admin-side logic in routes/jobs.js. Path
  //      B Phase 4 (2026-05-05) replaced the legacy for_psc_client /
  //      for_generic_client boolean pair with a single program_scope enum
  //      (rus | non_rus | shared) for cleaner segregation in dropdowns.
  // Money fields stripped.
  app.get('/api/jobs', requireAuth(), async (req, res) => {
    try {
      const clientId = req.query.client_id || null;
      const ecId = req.query.engineering_contract_id || null;

      // Defensive: only include the program-scope filter if the column
      // exists (in case migration 0006 hasn't run on this service yet).
      const { rows: cols } = await pool.query(
        `SELECT column_name FROM information_schema.columns
         WHERE table_name = 'jobs' AND column_name = 'program_scope'`
      );
      const hasScope = cols.length === 1;

      const conds = [`active = true`, `(team = $1 OR team = 'both')`];
      const params = [portal];

      if (hasScope) {
        if (ecId) {
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
            // program=NULL: don't gate — admin hasn't classified yet.
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
            // Mixed: no scope filter — show every active job for this team.
          } else if (hasRus) {
            conds.push(`program_scope IN ('rus','shared')`);
          } else {
            conds.push(`program_scope IN ('non_rus','shared')`);
          }
        }
      }

      const { rows } = await pool.query(
        `SELECT * FROM jobs WHERE ${conds.join(' AND ')} ORDER BY name`,
        params
      );
      res.json(rows.map(stripMoneyFromJob));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/jobs', requireAuth(), async (req, res) => {
    const { name, default_billing_type, is_permitting, notes } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name required' });
    try {
      const sr = await proposeChange('job', 'create', null, {
        name: String(name).trim(),
        default_billing_type: default_billing_type || 'hourly',
        is_permitting: !!is_permitting,
        notes: notes || null,
        team: portal // hint — admin can change at approval time
      }, actorOf(req));
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/jobs/:id', requireAuth(), async (req, res) => {
    const { name, default_billing_type, is_permitting, notes, active } = req.body;
    try {
      const cur = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const sr = await proposeChange('job', 'update', req.params.id,
        { name, default_billing_type, is_permitting, notes, active }, actorOf(req), cur.rows[0]);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/jobs/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const sr = await proposeChange('job', 'delete', req.params.id, {}, actorOf(req), cur.rows[0]);
      res.json(proposalResponse(sr, 'Deletion submitted'));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── PROJECT TYPES ──────────────────────────────────────────────────────
  // Phase 3b (2026-05-04): /api/project-types went away when the table
  // was dropped. Programs are now a fixed enum (rus|bau|gfr|other) on
  // engineering_contracts and projects — no portal CRUD surface needed.
  // The previous propose-change wrappers for this entity have been
  // removed; portal calls to /api/project-types now hit the static GET
  // shim defined elsewhere (returns the program enum) and reject writes
  // with 410 Gone via the catch-all route handler in routes/project_types.js.

  // ── CLIENTS ────────────────────────────────────────────────────────────
  // GET stays via existing route.
  app.post('/api/clients', requireAuth(), async (req, res) => {
    const { name, notes } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name required' });
    try {
      const sr = await proposeChange('client', 'create', null,
        { name: String(name).trim(), notes: notes || null }, actorOf(req));
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/clients/:id', requireAuth(), async (req, res) => {
    const { name, notes } = req.body;
    try {
      const cur = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Client not found' });
      const sr = await proposeChange('client', 'update', req.params.id,
        { name, notes }, actorOf(req), cur.rows[0]);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/clients/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Client not found' });
      const sr = await proposeChange('client', 'delete', req.params.id,
        {}, actorOf(req), cur.rows[0]);
      res.json(proposalResponse(sr, 'Deletion submitted'));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── CONTRACTS ──────────────────────────────────────────────────────────
  // GET stays via existing route.
  app.post('/api/contracts', requireAuth(), async (req, res) => {
    const { client_id, contract_number, name } = req.body;
    if (!client_id || !contract_number) {
      return res.status(400).json({ error: 'client_id and contract_number required' });
    }
    try {
      const sr = await proposeChange('contract', 'create', null,
        { client_id, contract_number, name: name || null }, actorOf(req));
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── PROJECT REQUESTS (timeclock add-new flow) ──────────────────────────
  // Engineer fills out a name + WO# + client on the timeclock portal; we
  // stage it as a setting_change_request entity_type='project' action='create'.
  // Time entries logged against the request stay HELD (project_id=NULL,
  // pending_project_request_id=request_id) until admin approves the
  // request, at which point applySettingChange retro-attaches them to the
  // newly-created project's id. On rejection, held entries surface in
  // admin's Hours tab as orphan rows needing manual project assignment.
  app.post('/api/portal/projects/request-create', requireAuth(), async (req, res) => {
    const { name, work_order_number, client_id, notes, project_type, billing_type } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    if (!client_id) {
      return res.status(400).json({ error: 'Client is required' });
    }
    try {
      const sr = await proposeChange('project', 'create', null, {
        name: String(name).trim(),
        work_order_number: work_order_number || null,
        client_id,
        notes: notes || null,
        // Defaults — admin can adjust on approval (the apply flow honours
        // payload_overrides from the approve endpoint).
        project_type: project_type || 'other',
        billing_type: billing_type || 'hourly',
      }, actorOf(req));
      // Return the request id so the timeclock UI can stamp it onto held
      // time_entries via POST /api/time-entries.
      res.json({ ...proposalResponse(sr, 'Requested'), request_id: sr.id });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── PROJECTS ───────────────────────────────────────────────────────────
  // Filtered list: projects whose job is this portal's team (or 'both' or
  // unassigned), PLUS all of their ancestors for nest context. Money stripped.
  app.get('/api/projects', requireAuth(), async (req, res) => {
    const { status, client_id, type } = req.query;
    const filters = [];
    const params  = [];
    let i = 1;
    if (status)    { filters.push(`p.status = $${i++}`); params.push(status); }
    if (client_id) { filters.push(`p.client_id = $${i++}`); params.push(client_id); }
    if (type)      { filters.push(`p.project_type = $${i++}`); params.push(type); }
    params.push(portal);
    const portalParam = `$${i}`;
    const userFilter = filters.length ? ' AND ' + filters.join(' AND ') : '';

    try {
      // We only filter rollups out if the column exists. The COALESCE guard
      // means a missing column would error the whole query, so we check
      // first via information_schema. This makes the portal resilient if the
      // v3 bootstrap hasn't run yet.
      const { rows: rollupCol } = await pool.query(
        `SELECT 1 FROM information_schema.columns
         WHERE table_name = 'projects' AND column_name = 'is_rollup'`
      );
      const rollupGuard = rollupCol.length ? `AND COALESCE(p.is_rollup, false) = false` : ``;

      const { rows } = await pool.query(`
        WITH team_match AS (
          -- Real (non-rollup) projects whose job belongs to this portal's team.
          SELECT p.id
          FROM projects p
          LEFT JOIN jobs j ON j.id = p.job_id
          WHERE 1=1
            ${rollupGuard}
            AND (j.team = ${portalParam} OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
            ${userFilter}
        )
        SELECT p.*,
          cl.name AS client_name,
          co.contract_number,
          co.name AS contract_name,
          pp.name AS parent_name,
          COALESCE(SUM(te.hours), 0) AS logged_hours,
          (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) AS child_count
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        LEFT JOIN time_entries te ON te.project_id = p.id
        WHERE p.id IN (SELECT id FROM team_match)
        GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name
        ORDER BY p.created_at DESC
      `, params);
      res.json(rows.map(stripMoneyFromProject));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/projects/:id', requireAuth(), async (req, res) => {
    try {
      // Visibility check: must be a real project on this portal's team.
      // Rollups are admin-only and aren't returned to portals.
      const vis = await pool.query(`
        SELECT 1 FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE p.id = $1
          AND COALESCE(p.is_rollup, false) = false
          AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
        LIMIT 1
      `, [req.params.id, portal]);
      if (!vis.rows.length) return res.status(404).json({ error: 'Not found' });

      const { rows } = await pool.query(`
        SELECT p.*, cl.name AS client_name,
               co.contract_number, co.name AS contract_name,
               pp.name AS parent_name
        FROM projects p
        LEFT JOIN clients cl  ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN projects pp ON pp.id = p.parent_id
        WHERE p.id = $1
      `, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(stripMoneyFromProject(rows[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Create project from portal — validates team, blocks duplicates, strips money.
  app.post('/api/projects', requireAuth(), async (req, res) => {
    let {
      name, client_id, contract_id, work_order_number,
      project_type, program, job_id,
      service_area_label,  // free-text service area for non-PSC clients
      status = 'active',
      footage,        // for footage-billed jobs
      hours_estimate, // optional informational hours estimate (hourly jobs)
      start_date, notes, permit_manager
      // NOTE: parent_id and concentrator_id are deliberately NOT destructured —
      // portal users don't pick the nest. We auto-derive concentrator from the
      // work order (if there's a match), and auto-nest under the rollup chain.
    } = req.body;
    // Phase 3b: program enum replaces project_type_id. Validate then keep going.
    if (program !== undefined && program !== null && program !== '') {
      const v = String(program).trim().toLowerCase();
      if (!['rus','bau','gfr','other'].includes(v)) {
        return res.status(400).json({ error: `Invalid program "${program}" — allowed: rus, bau, gfr, other.` });
      }
      program = v;
    } else {
      program = null;
    }

    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Project name required' });
    if (!client_id) return res.status(400).json({ error: 'Client required' });
    if (!job_id)    return res.status(400).json({ error: 'Job required' });

    try {
      // 1. Validate the chosen job belongs to this portal's team
      const jr = await pool.query('SELECT * FROM jobs WHERE id = $1 AND active = true', [job_id]);
      if (!jr.rows.length) return res.status(400).json({ error: 'Job not found or inactive' });
      const job = jr.rows[0];
      const allowed = job.team === portal || job.team === 'both' || job.team == null;
      if (!allowed) {
        return res.status(403).json({ error: `This job is assigned to a different team` });
      }

      // 2. Auto-detect service area (concentrator) from work order # if matchable.
      // Only PSC clients have concentrators wired up via WO#; non-PSC clients
      // don't have WO# at all, so this just falls through with concentrator_id=null
      // and the chain falls back to the service_area_label free-text instead.
      let concentrator_id = null;
      if (work_order_number) {
        const con = await pool.query(
          `SELECT id FROM concentrators WHERE work_order_number = $1 LIMIT 1`,
          [String(work_order_number).trim()]
        );
        if (con.rows.length) concentrator_id = con.rows[0].id;
      }

      // 3. Build the rollup chain. Either concentrator_id (PSC) or
      // service_area_label (non-PSC) gets you a Service Area folder.
      const parent_id = await ensureRollupChain(pool, {
        client_id, concentrator_id, service_area_label, job_id
      });

      // 4. Duplicate check (against siblings under the team rollup)
      if (await isDuplicateProject(pool, name, parent_id)) {
        return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
      }

      // 5. Derive billing fields server-side from the job's defaults.
      //    Portal NEVER sees these values, but they have to populate the
      //    columns so admin reports work correctly.
      const isPermitting       = !!job.is_permitting;
      const effectiveBillType  = isPermitting ? 'footage' : (job.default_billing_type || 'hourly');
      const effectiveRate      = job.default_rate;
      // project_type drives downstream filtering (e.g. /api/design returns
      // project_type='design' rows). Map from the job's team so portal
      // projects land in the right pipeline category. Inspection-team jobs
      // map to project_type='inspection' for use by the Inspection view.
      const effectiveType      = isPermitting ? 'permitting'
                                : (project_type
                                    || (job.team === 'design' ? 'design'
                                      : job.team === 'inspection' ? 'inspection'
                                      : 'other'));
      const projFootage        = effectiveBillType === 'footage' ? (parseFloat(footage) || null) : null;
      const projHoursEstimate  = effectiveBillType === 'hourly'  ? (parseFloat(hours_estimate) || null) : null;

      let miles = null, expectedHours = projHoursEstimate, expectedRevenue = null;
      if (isPermitting && projFootage) {
        miles         = projFootage / 5280;
        expectedHours = Math.max(25, miles * 27.5);
        if (effectiveRate) expectedRevenue = expectedHours * effectiveRate;
      } else if (effectiveBillType === 'hourly' && projHoursEstimate && effectiveRate) {
        expectedRevenue = projHoursEstimate * effectiveRate;
      } else if (effectiveBillType === 'footage' && projFootage && effectiveRate) {
        // Non-permit footage (e.g. OSP Staking — $850/mile)
        miles           = projFootage / 5280;
        expectedRevenue = miles * effectiveRate;
      }

      // Auto-derive program from the engineering contract on the chosen
      // contract, if no explicit program came in. Same rule as routes/projects.js.
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

      const { rows } = await pool.query(`
        INSERT INTO projects (
          name, client_id, contract_id, work_order_number,
          project_type, program, job_id,
          status, billing_type, billing_rate,
          footage, miles, expected_hours, expected_revenue,
          start_date, notes, parent_id, concentrator_id,
          permitting_hours_per_mile, billing_cadence
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        RETURNING *
      `, [
        String(name).trim(), client_id, contract_id || null, work_order_number || null,
        effectiveType, program, job_id,
        status, effectiveBillType, effectiveRate,
        projFootage, miles, expectedHours, expectedRevenue,
        start_date || null, notes || null, parent_id, concentrator_id,
        isPermitting ? 27.5 : null,
        job.name === 'Inspection' ? 'monthly' : 'one_time'
      ]);

      // Auto-create permit/design stage (matches admin endpoint behavior)
      if (isPermitting) {
        await pool.query(
          `INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3)
           ON CONFLICT (project_id, stage) DO NOTHING`,
          [rows[0].id, 'potential', permit_manager || null]
        );
      }
      if (job.team === 'design') {
        await pool.query(
          `INSERT INTO design_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT (project_id, stage) DO NOTHING`,
          [rows[0].id, 'potential']
        );
      }

      res.json(stripMoneyFromProject(rows[0]));
    } catch (e) {
      // Catch the unique-index race
      if (e.code === '23505') {
        return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
      }
      res.status(500).json({ error: e.message });
    }
  });

  // Limited PUT — portal can only edit non-financial fields, can't change job/team.
  app.put('/api/projects/:id', requireAuth(), async (req, res) => {
    const ALLOWED = ['name', 'work_order_number', 'status', 'footage', 'hours_estimate',
                     'start_date', 'notes', 'concentrator_id', 'contract_id', 'parent_id'];
    const filtered = {};
    for (const k of ALLOWED) if (req.body[k] !== undefined) filtered[k] = req.body[k];

    try {
      // Visibility check
      const vis = await pool.query(`
        SELECT p.id, p.parent_id FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE p.id = $1
          AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
      `, [req.params.id, portal]);
      if (!vis.rows.length) return res.status(404).json({ error: 'Not found' });

      // Duplicate check if name OR parent is changing
      if (filtered.name || filtered.parent_id !== undefined) {
        const newName   = filtered.name ?? null;
        const newParent = filtered.parent_id !== undefined ? filtered.parent_id : vis.rows[0].parent_id;
        const checkName = newName || (await pool.query('SELECT name FROM projects WHERE id=$1', [req.params.id])).rows[0].name;
        if (await isDuplicateProject(pool, checkName, newParent, req.params.id)) {
          return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
        }
      }

      const sets   = [];
      const params = [req.params.id];
      let i = 2;
      for (const [k, v] of Object.entries(filtered)) {
        const col = k === 'hours_estimate' ? 'expected_hours' : k;
        sets.push(`${col} = $${i++}`);
        params.push(v);
      }
      if (!sets.length) return res.json({ ok: true });
      sets.push('updated_at = NOW()');

      const { rows } = await pool.query(
        `UPDATE projects SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      res.json(stripMoneyFromProject(rows[0]));
    } catch (e) {
      if (e.code === '23505') {
        return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
      }
      res.status(500).json({ error: e.message });
    }
  });

  // Portal DELETE — design/permitting routes through the propose-and-
  // approve flow now. Owner asked for a notification + admin sign-off
  // path instead of direct destructive deletes from the portals (the old
  // version dropped the project the moment the portal user clicked it,
  // with no audit trail and no admin oversight). The timeclock portal
  // doesn't expose a project-delete UI, so this branch only fires for
  // design + permitting.
  app.delete('/api/projects/:id', requireAuth(), async (req, res) => {
    try {
      // Visibility check — the portal user must be allowed to see the
      // project before they can request its deletion.
      const vis = await pool.query(`
        SELECT p.id, p.name, p.client_id, p.work_order_number, p.project_type
          FROM projects p
          LEFT JOIN jobs j ON j.id = p.job_id
         WHERE p.id = $1
           AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
      `, [req.params.id, portal]);
      if (!vis.rows.length) return res.status(404).json({ error: 'Not found' });
      const snapshot = vis.rows[0];

      // Stage as a setting_change_request and surface in admin's review
      // queue. Apply happens in applySettingChange's project/delete branch.
      const sr = await proposeChange(
        'project', 'delete', req.params.id,
        { name: snapshot.name, requested_by_portal: portal },
        actorOf(req),
        snapshot
      );
      // Return 202 (Accepted) so the portal UI can distinguish "deletion
      // queued" from "deletion happened" — useful for the toast text.
      res.status(202).json({
        ...proposalResponse(sr, 'Delete request sent'),
        request_id: sr.id,
        pending: true,
      });
    } catch (e) {
      console.error('[portal:projects:delete]', e && e.message);
      res.status(500).json({ error: e.message });
    }
  });
}

module.exports = installPortalExtensions;
module.exports.isDuplicateProject = isDuplicateProject;
module.exports.stripMoneyFromProject = stripMoneyFromProject;
module.exports.ensureRollupChain = ensureRollupChain;
module.exports.findOrCreateRollup = findOrCreateRollup;
