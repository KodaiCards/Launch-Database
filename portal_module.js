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
async function ensureRollupChain(pool, { client_id, concentrator_id, project_type_id, job_id }) {
  if (!client_id) return null;

  // 1) Client folder
  const cli = await pool.query('SELECT name, is_rus FROM clients WHERE id = $1', [client_id]);
  if (!cli.rows.length) return null;
  const clientName = cli.rows[0].name;
  const clientIsRus = cli.rows[0].is_rus === true;

  let folder = await findOrCreateRollup(pool, {
    parent_id: null,
    rollup_level: 'client',
    rollup_key: client_id,
    name: clientName,
    extras: { client_id }
  });

  // 2) Service Area folder (only if concentrator is set)
  if (concentrator_id) {
    const con = await pool.query('SELECT area_name FROM concentrators WHERE id = $1', [concentrator_id]);
    const areaName = con.rows[0]?.area_name || 'Service Area';
    folder = await findOrCreateRollup(pool, {
      parent_id: folder,
      rollup_level: 'service_area',
      rollup_key: concentrator_id,
      name: areaName,
      extras: { client_id, concentrator_id }
    });
  }

  // 3) Project Type folder (only when client is PSC-class AND project_type_id present)
  if (clientIsRus && project_type_id) {
    const pt = await pool.query('SELECT name FROM project_types WHERE id = $1', [project_type_id]);
    const ptName = pt.rows[0]?.name || 'Project Type';
    folder = await findOrCreateRollup(pool, {
      parent_id: folder,
      rollup_level: 'project_type',
      rollup_key: project_type_id,
      name: ptName,
      extras: { client_id, concentrator_id, project_type_id }
    });
  }

  // 4) Team folder (always — derived from job's team field)
  let teamName = 'shared';
  if (job_id) {
    const jr = await pool.query('SELECT team FROM jobs WHERE id = $1', [job_id]);
    teamName = jr.rows[0]?.team || 'shared';
  }
  const teamLabel = ({
    design:     'Design Team',
    permitting: 'Permitting Team',
    both:       'Shared (Design + Permitting)',
    shared:     'Shared / Unassigned'
  })[teamName] || 'Shared / Unassigned';

  folder = await findOrCreateRollup(pool, {
    parent_id: folder,
    rollup_level: 'team',
    rollup_key: teamName,
    name: teamLabel,
    extras: { client_id, concentrator_id, project_type_id }
  });

  return folder;
}

async function findOrCreateRollup(pool, { parent_id, rollup_level, rollup_key, name, extras }) {
  // Try find first
  const found = await pool.query(
    `SELECT id FROM projects
       WHERE is_rollup = TRUE AND rollup_level = $1 AND rollup_key = $2
         AND COALESCE(parent_id::text, 'ROOT') = COALESCE($3::text, 'ROOT')
       LIMIT 1`,
    [rollup_level, String(rollup_key), parent_id]
  );
  if (found.rows.length) return found.rows[0].id;

  // Create
  const e = extras || {};
  const r = await pool.query(`
    INSERT INTO projects (name, client_id, parent_id, concentrator_id, project_type_id,
                          status, is_rollup, rollup_level, rollup_key, project_type)
    VALUES ($1, $2, $3, $4, $5, 'active', TRUE, $6, $7, 'rollup')
    RETURNING id
  `, [name, e.client_id || null, parent_id || null, e.concentrator_id || null,
      e.project_type_id || null, rollup_level, String(rollup_key)]);
  return r.rows[0].id;
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
    if (action === 'create') {
      await pool.query(
        `INSERT INTO project_types (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET active = true`,
        [p.name]
      );
    } else if (action === 'delete') {
      await pool.query('UPDATE project_types SET active = false WHERE id = $1', [entity_id]);
    }
  }

  else if (entity_type === 'client') {
    if (action === 'create') {
      await pool.query(
        `INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3)`,
        [p.name, !!p.is_rus, p.notes ?? null]
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
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN INSTALLER
// ═══════════════════════════════════════════════════════════════════════════
function installPortalExtensions(app, pool, PORTAL_MODE) {
  const isPortal = !!PORTAL_MODE;
  const portal   = PORTAL_MODE; // 'design' or 'permitting'

  // Make helpers accessible to server.js's admin POST/PUT.
  app.locals.isDuplicateProject = (name, parentId, excludeId) =>
    isDuplicateProject(pool, name, parentId, excludeId);
  app.locals.ensureRollupChain = (params) => ensureRollupChain(pool, params);

  // ─── Setting-request endpoints (work in BOTH portal and admin mode) ─────

  // List requests. Admin sees all (filterable by status). Portal sees only
  // requests submitted from THIS portal (so users can track their own).
  app.get('/api/setting-requests', async (req, res) => {
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
  app.get('/api/setting-requests/count', async (req, res) => {
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

  // Approve — applies the change, marks approved. Admin only.
  app.put('/api/setting-requests/:id/approve', async (req, res) => {
    if (isPortal) return res.status(403).json({ error: 'Admin only' });
    const { reviewed_by, payload_overrides } = req.body || {};
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

  app.put('/api/setting-requests/:id/reject', async (req, res) => {
    if (isPortal) return res.status(403).json({ error: 'Admin only' });
    const { reviewed_by, review_notes } = req.body || {};
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
  if (!isPortal) return;

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
  //   1) team match (this portal can use this job's team), AND
  //   2) applicability — for the optional client_id query param, we look up
  //      the client's is_rus flag and filter by for_psc_client / for_generic_client.
  // Money fields stripped.
  app.get('/api/jobs', async (req, res) => {
    try {
      const clientId = req.query.client_id || null;
      let isPsc = null;
      if (clientId) {
        const c = await pool.query('SELECT is_rus FROM clients WHERE id = $1', [clientId]);
        if (c.rows.length) isPsc = c.rows[0].is_rus === true;
      }

      // Build query
      const conds = [`active = true`, `(team = $1 OR team = 'both' OR team IS NULL)`];
      const params = [portal];
      if (isPsc === true) {
        conds.push(`for_psc_client = true`);
      } else if (isPsc === false) {
        conds.push(`for_generic_client = true`);
      }
      // If no client given, return everything visible to this team (don't over-filter).

      const { rows } = await pool.query(
        `SELECT * FROM jobs WHERE ${conds.join(' AND ')} ORDER BY name`,
        params
      );
      res.json(rows.map(stripMoneyFromJob));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/jobs', async (req, res) => {
    const { name, default_billing_type, is_permitting, notes, proposed_by } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name required' });
    try {
      const sr = await proposeChange('job', 'create', null, {
        name: String(name).trim(),
        default_billing_type: default_billing_type || 'hourly',
        is_permitting: !!is_permitting,
        notes: notes || null,
        team: portal // hint — admin can change at approval time
      }, proposed_by);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/jobs/:id', async (req, res) => {
    const { name, default_billing_type, is_permitting, notes, active, proposed_by } = req.body;
    try {
      const cur = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const sr = await proposeChange('job', 'update', req.params.id,
        { name, default_billing_type, is_permitting, notes, active }, proposed_by, cur.rows[0]);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    try {
      const cur = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const sr = await proposeChange('job', 'delete', req.params.id, {}, req.body?.proposed_by, cur.rows[0]);
      res.json(proposalResponse(sr, 'Deletion submitted'));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── PROJECT TYPES ──────────────────────────────────────────────────────
  // GET stays via the existing route (no team filter needed — types apply
  // across both teams). Only writes are intercepted.
  app.post('/api/project-types', async (req, res) => {
    const { name, proposed_by } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name required' });
    try {
      const sr = await proposeChange('project_type', 'create', null,
        { name: String(name).trim() }, proposed_by);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/project-types/:id', async (req, res) => {
    try {
      const cur = await pool.query('SELECT * FROM project_types WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Not found' });
      const sr = await proposeChange('project_type', 'delete', req.params.id,
        {}, req.body?.proposed_by, cur.rows[0]);
      res.json(proposalResponse(sr, 'Deletion submitted'));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── CLIENTS ────────────────────────────────────────────────────────────
  // GET stays via existing route.
  app.post('/api/clients', async (req, res) => {
    const { name, notes, proposed_by } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name required' });
    try {
      const sr = await proposeChange('client', 'create', null,
        { name: String(name).trim(), is_rus: false, notes: notes || null }, proposed_by);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/clients/:id', async (req, res) => {
    const { name, notes, proposed_by } = req.body;
    try {
      const cur = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Client not found' });
      const sr = await proposeChange('client', 'update', req.params.id,
        { name, notes }, proposed_by, cur.rows[0]);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/clients/:id', async (req, res) => {
    try {
      const cur = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Client not found' });
      const sr = await proposeChange('client', 'delete', req.params.id,
        {}, req.body?.proposed_by, cur.rows[0]);
      res.json(proposalResponse(sr, 'Deletion submitted'));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── CONTRACTS ──────────────────────────────────────────────────────────
  // GET stays via existing route.
  app.post('/api/contracts', async (req, res) => {
    const { client_id, contract_number, name, proposed_by } = req.body;
    if (!client_id || !contract_number) {
      return res.status(400).json({ error: 'client_id and contract_number required' });
    }
    try {
      const sr = await proposeChange('contract', 'create', null,
        { client_id, contract_number, name: name || null }, proposed_by);
      res.json(proposalResponse(sr));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── PROJECTS ───────────────────────────────────────────────────────────
  // Filtered list: projects whose job is this portal's team (or 'both' or
  // unassigned), PLUS all of their ancestors for nest context. Money stripped.
  app.get('/api/projects', async (req, res) => {
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
      const { rows } = await pool.query(`
        WITH RECURSIVE
        team_match AS (
          -- Projects whose job belongs to this portal's team (or 'both' / unassigned)
          SELECT p.id
          FROM projects p
          LEFT JOIN jobs j ON j.id = p.job_id
          WHERE (j.team = ${portalParam} OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
            ${userFilter}
        ),
        ancestors AS (
          -- Walk up the parent chain so the user sees the full nest context
          SELECT id, parent_id FROM projects WHERE id IN (SELECT id FROM team_match)
          UNION
          SELECT p.id, p.parent_id
          FROM projects p
          JOIN ancestors a ON a.parent_id = p.id
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
        WHERE p.id IN (SELECT id FROM ancestors)
        GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name
        ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
      `, params);
      res.json(rows.map(stripMoneyFromProject));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      // Visibility: must be in team_match OR be an ancestor of one.
      const vis = await pool.query(`
        WITH RECURSIVE descendants AS (
          SELECT id, job_id FROM projects WHERE id = $1
          UNION ALL
          SELECT p.id, p.job_id FROM projects p JOIN descendants d ON p.parent_id = d.id
        )
        SELECT 1 FROM descendants d
        LEFT JOIN jobs j ON j.id = d.job_id
        WHERE (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR d.job_id IS NULL)
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
  app.post('/api/projects', async (req, res) => {
    const {
      name, client_id, contract_id, work_order_number,
      project_type, project_type_id, job_id,
      status = 'active',
      footage,        // for footage-billed jobs
      hours_estimate, // optional informational hours estimate (hourly jobs)
      start_date, notes, permit_manager
      // NOTE: parent_id and concentrator_id are deliberately NOT destructured —
      // portal users don't pick the nest. We auto-derive concentrator from the
      // work order (if there's a match), and auto-nest under the rollup chain.
    } = req.body;

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

      // 2. Auto-detect service area (concentrator) from work order # if matchable
      let concentrator_id = null;
      if (work_order_number) {
        const con = await pool.query(
          `SELECT id FROM concentrators WHERE work_order_number = $1 LIMIT 1`,
          [String(work_order_number).trim()]
        );
        if (con.rows.length) concentrator_id = con.rows[0].id;
      }

      // 3. Build the rollup chain and use its leaf as parent_id
      const parent_id = await ensureRollupChain(pool, {
        client_id, concentrator_id, project_type_id, job_id
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
      const effectiveType      = isPermitting ? 'permitting'
                                : (project_type || (job.team === 'design' ? 'design' : 'other'));
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

      const { rows } = await pool.query(`
        INSERT INTO projects (
          name, client_id, contract_id, work_order_number,
          project_type, project_type_id, job_id,
          status, billing_type, billing_rate,
          footage, miles, expected_hours, expected_revenue,
          start_date, notes, parent_id, concentrator_id,
          permitting_hours_per_mile, billing_cadence
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        RETURNING *
      `, [
        String(name).trim(), client_id, contract_id || null, work_order_number || null,
        effectiveType, project_type_id || null, job_id,
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
           ON CONFLICT DO NOTHING`,
          [rows[0].id, 'potential', permit_manager || null]
        );
      }
      if (job.team === 'design') {
        await pool.query(
          `INSERT INTO design_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
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
  app.put('/api/projects/:id', async (req, res) => {
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

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      const vis = await pool.query(`
        SELECT p.id FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE p.id = $1
          AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)
      `, [req.params.id, portal]);
      if (!vis.rows.length) return res.status(404).json({ error: 'Not found' });
      await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

module.exports = installPortalExtensions;
module.exports.isDuplicateProject = isDuplicateProject;
module.exports.stripMoneyFromProject = stripMoneyFromProject;
