// routes/service_areas.js — Phase 2 keystone API.
//
// Service Area / Concentrator = the unit of work; service-area "jobs" are the
// line items inside it (team · job-type · employee · rate · status · $).
// Backed by migration 0064. Replaces the rollup-of-rollups projects tree.
//
// Auto-population ("if X then Y", override-able):
//   - Create SA with an engineering_contract_id → program forced to 'rus'
//     (EC presence ⟺ RUS, enforced by the DB check too).
//   - Add a job from the jobs catalog → team / billing_type / rate auto-filled
//     from the job (and pricing_entries for the SA's program); any can be
//     overridden in the request body.
//
// Per-team status pipelines (see ROADMAP "Disciplines, jobs & statuses"):
//   permitting: potential → started → submitted → approved → issued
//   design:     potential → started → submitted → client_approved
//   (both have an optional "revision" branch off 'submitted'; resolving a
//    revision advances to approved / client_approved)
//   construction: no pipeline yet.

const STAFF_ROLES = ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'];

const PIPELINES = {
  permitting: ['potential', 'started', 'submitted', 'approved', 'issued'],
  design:     ['potential', 'started', 'submitted', 'client_approved'],
  construction: [],
};
const APPROVAL_STAGE = { permitting: 'approved', design: 'client_approved' };

// Compute the next status for a pipeline move.
//   choice 'next' (default): step forward one stage.
//   choice 'revision': branch to 'revision' (only valid from 'submitted').
// Resolving a 'revision' (choice 'next') advances to the approval stage.
// Returns null when the move isn't allowed.
function nextStatus(team, current, choice) {
  if (choice === 'revision') {
    return current === 'submitted' ? 'revision' : null;
  }
  if (current === 'revision') {
    return APPROVAL_STAGE[team] || null;
  }
  const seq = PIPELINES[team] || [];
  const i = seq.indexOf(current);
  if (i === -1 || i >= seq.length - 1) return null;
  return seq[i + 1];
}
function prevStatus(team, current) {
  if (current === 'revision') return 'submitted';
  const seq = PIPELINES[team] || [];
  const i = seq.indexOf(current);
  if (i <= 0) return null;
  return seq[i - 1];
}

const PROGRAMS = ['rus', 'bau', 'gfr', 'other'];

module.exports = function installServiceAreaRoutes(app, pool, mw) {
  const { logAudit } = require('./_audit');
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || requireAdmin;
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  const uid = (req) => (req && req.user && req.user.id) || null;

  // ─── Service Areas ───────────────────────────────────────────────────────

  // List service areas with rolled-up job totals. Filters: client_id,
  // engineering_contract_id, status, program.
  app.get('/api/service-areas', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const conds = [];
      const params = [];
      for (const [col, val] of [
        ['client_id', req.query.client_id],
        ['engineering_contract_id', req.query.engineering_contract_id],
        ['status', req.query.status],
        ['program', req.query.program],
      ]) {
        if (val) { params.push(val); conds.push(`sa.${col} = $${params.length}`); }
      }
      const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
      const { rows } = await pool.query(
        `SELECT sa.*,
                c.name  AS client_name,
                ec.name AS ec_name,
                COALESCE(j.job_count, 0)        AS job_count,
                COALESCE(j.est_total, 0)        AS estimated_total,
                COALESCE(j.actual_total, 0)     AS actual_total,
                COALESCE(j.hours_total, 0)      AS hours_total
         FROM service_areas sa
         LEFT JOIN clients c               ON c.id  = sa.client_id
         LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
         LEFT JOIN (
           SELECT service_area_id,
                  COUNT(*)               AS job_count,
                  SUM(estimated_amount)  AS est_total,
                  SUM(actual_amount)     AS actual_total,
                  SUM(actual_hours)      AS hours_total
           FROM service_area_jobs GROUP BY service_area_id
         ) j ON j.service_area_id = sa.id
         ${where}
         ORDER BY sa.created_at DESC`,
        params
      );
      res.json(rows);
    } catch (e) {
      console.error('[service-areas:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load service areas.' });
    }
  });

  // Detail — the service area plus its job line items (with catalog + staff names).
  app.get('/api/service-areas/:id', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const sa = await pool.query(
        `SELECT sa.*, c.name AS client_name, ec.name AS ec_name
         FROM service_areas sa
         LEFT JOIN clients c                ON c.id  = sa.client_id
         LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
         WHERE sa.id = $1`,
        [req.params.id]
      );
      if (!sa.rows.length) return res.status(404).json({ error: 'Service area not found' });
      const jobs = await pool.query(
        `SELECT saj.*, j.name AS job_name, s.name AS assigned_staff_name
         FROM service_area_jobs saj
         LEFT JOIN jobs  j ON j.id = saj.job_id
         LEFT JOIN staff s ON s.id = saj.assigned_staff_id
         WHERE saj.service_area_id = $1
         ORDER BY saj.created_at`,
        [req.params.id]
      );
      res.json({ ...sa.rows[0], jobs: jobs.rows });
    } catch (e) {
      console.error('[service-areas:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load service area.' });
    }
  });

  // Create. Required: client_id, name. If engineering_contract_id is supplied,
  // program is forced to 'rus' (EC ⟺ RUS). Otherwise program comes from the
  // body (bau/gfr/other) or stays null.
  app.post('/api/service-areas', requireManagerOrAdmin, async (req, res) => {
    const b = req.body || {};
    if (!b.client_id) return res.status(400).json({ error: 'client_id is required' });
    if (!b.name || !String(b.name).trim()) return res.status(400).json({ error: 'name is required' });

    const ecId = b.engineering_contract_id || null;
    let program = ecId ? 'rus' : (b.program ? String(b.program).trim().toLowerCase() : null);
    if (program && !PROGRAMS.includes(program)) {
      return res.status(400).json({ error: `Invalid program — allowed: ${PROGRAMS.join(', ')}.` });
    }
    const cadence = b.billing_cadence === 'monthly' ? 'monthly' : 'one_time';
    const isOngoing = !!b.is_ongoing;
    if (isOngoing && cadence !== 'monthly') {
      return res.status(400).json({ error: 'Ongoing service areas must use monthly billing cadence.' });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO service_areas
           (client_id, engineering_contract_id, name, work_order_number, program,
            status, notes, is_ongoing, billing_cadence, client_visible,
            created_by_user_id, updated_by_user_id)
         VALUES ($1,$2,$3,$4,$5,COALESCE($6,'active'),$7,$8,$9,COALESCE($10,false),$11,$11)
         RETURNING *`,
        [b.client_id, ecId, String(b.name).trim(), b.work_order_number || null, program,
         b.status || null, b.notes || null, isOngoing, cadence, b.client_visible, uid(req)]
      );
      logAudit(pool, { req, action: 'service_area.create', entity_type: 'service_area',
        entity_id: rows[0].id, after: { name: rows[0].name, program }, source: 'admin' }).catch(() => {});
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[service-areas:create]', e && e.message);
      res.status(500).json({ error: 'Failed to create service area.' });
    }
  });

  const SA_FIELDS = ['name', 'work_order_number', 'program', 'status', 'notes', 'start_date',
    'completed_date', 'billed_date', 'is_ongoing', 'billing_cadence', 'map_file_path',
    'map_filename', 'client_visible', 'engineering_contract_id'];

  app.put('/api/service-areas/:id', requireManagerOrAdmin, async (req, res) => {
    const sets = [], vals = [req.params.id];
    let i = 2;
    for (const f of SA_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f];
        if (v === '') v = null;
        sets.push(`${f} = $${i}`); vals.push(v); i++;
      }
    }
    // If an EC is being attached, keep the EC⟺RUS rule satisfied.
    if (Object.prototype.hasOwnProperty.call(req.body, 'engineering_contract_id') && req.body.engineering_contract_id) {
      sets.push(`program = 'rus'`);
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = now()`);
    vals.push(uid(req)); sets.push(`updated_by_user_id = $${i}`);
    try {
      const { rows } = await pool.query(
        `UPDATE service_areas SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Service area not found' });
      logAudit(pool, { req, action: 'service_area.update', entity_type: 'service_area',
        entity_id: rows[0].id, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[service-areas:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update service area.' });
    }
  });

  app.delete('/api/service-areas/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rowCount } = await pool.query('DELETE FROM service_areas WHERE id = $1', [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Service area not found' });
      logAudit(pool, { req, action: 'service_area.delete', entity_type: 'service_area',
        entity_id: req.params.id, source: 'admin' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[service-areas:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete service area.' });
    }
  });

  // ─── Service-Area Jobs (line items) ────────────────────────────────────────

  // Add a job to a service area. Pass job_id to auto-fill team/billing_type/rate
  // from the jobs catalog + pricing_entries (each override-able via the body).
  app.post('/api/service-areas/:id/jobs', requireManagerOrAdmin, async (req, res) => {
    const b = req.body || {};
    try {
      const sa = await pool.query('SELECT id, program FROM service_areas WHERE id = $1', [req.params.id]);
      if (!sa.rows.length) return res.status(404).json({ error: 'Service area not found' });
      const program = sa.rows[0].program;

      let team = b.team || null;
      let billingType = b.billing_type || null;
      let rate = (b.rate !== undefined && b.rate !== '') ? b.rate : null;

      if (b.job_id) {
        const jr = await pool.query(
          'SELECT team, default_billing_type, default_rate FROM jobs WHERE id = $1', [b.job_id]);
        if (jr.rows.length) {
          const job = jr.rows[0];
          if (team === null) team = job.team || null;
          if (billingType === null) billingType = job.default_billing_type || null;
          // pricing_entries: prefer an exact program match, else a program-agnostic row.
          const pr = await pool.query(
            `SELECT rate, billing_type FROM pricing_entries
             WHERE job_id = $1 AND (program = $2 OR program IS NULL)
             ORDER BY (program = $2) DESC NULLS LAST LIMIT 1`,
            [b.job_id, program]
          );
          if (rate === null) rate = pr.rows[0]?.rate ?? job.default_rate ?? null;
          if (billingType === null) billingType = pr.rows[0]?.billing_type || null;
        }
      }
      if (!billingType) billingType = 'hourly';

      const { rows } = await pool.query(
        `INSERT INTO service_area_jobs
           (service_area_id, job_id, team, assigned_staff_id, assigned_user_id,
            billing_type, rate, status, estimated_amount, footage, miles, notes,
            created_by_user_id, updated_by_user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'potential'),$9,$10,$11,$12,$13,$13)
         RETURNING *`,
        [req.params.id, b.job_id || null, team, b.assigned_staff_id || null, b.assigned_user_id || null,
         billingType, rate, b.status || null, b.estimated_amount ?? null,
         b.footage ?? null, b.miles ?? null, b.notes || null, uid(req)]
      );
      logAudit(pool, { req, action: 'service_area_job.create', entity_type: 'service_area_job',
        entity_id: rows[0].id, after: { service_area_id: req.params.id, team, job_id: b.job_id }, source: 'admin' }).catch(() => {});
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[sa-jobs:create]', e && e.message);
      res.status(500).json({ error: 'Failed to add job.' });
    }
  });

  const SAJOB_FIELDS = ['job_id', 'team', 'assigned_staff_id', 'assigned_user_id', 'billing_type',
    'rate', 'status', 'estimated_amount', 'actual_hours', 'actual_amount', 'footage', 'miles',
    'start_date', 'completed_date', 'billed_date', 'notes'];

  app.put('/api/service-area-jobs/:id', requireManagerOrAdmin, async (req, res) => {
    const sets = [], vals = [req.params.id];
    let i = 2;
    for (const f of SAJOB_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f];
        if (v === '') v = null;
        sets.push(`${f} = $${i}`); vals.push(v); i++;
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = now()`);
    vals.push(uid(req)); sets.push(`updated_by_user_id = $${i}`);
    try {
      const { rows } = await pool.query(
        `UPDATE service_area_jobs SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
      logAudit(pool, { req, action: 'service_area_job.update', entity_type: 'service_area_job',
        entity_id: rows[0].id, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[sa-jobs:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update job.' });
    }
  });

  app.delete('/api/service-area-jobs/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rowCount } = await pool.query('DELETE FROM service_area_jobs WHERE id = $1', [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Job not found' });
      logAudit(pool, { req, action: 'service_area_job.delete', entity_type: 'service_area_job',
        entity_id: req.params.id, source: 'admin' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[sa-jobs:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete job.' });
    }
  });

  // Advance a job through its team's pipeline. Body { to: 'revision' } branches
  // to revision (only from 'submitted'); otherwise it steps forward. No
  // confirmation prompt — the frontend pairs this with an undo bar.
  app.post('/api/service-area-jobs/:id/advance', requireManagerOrAdmin, async (req, res) => {
    try {
      const cur = await pool.query('SELECT team, status FROM service_area_jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const { team, status } = cur.rows[0];
      const choice = (req.body && req.body.to === 'revision') ? 'revision' : 'next';
      const next = nextStatus(team, status, choice);
      if (!next) {
        return res.status(400).json({ error: `Cannot ${choice === 'revision' ? 'send to revision' : 'advance'} from status '${status}' for team '${team || 'none'}'.` });
      }
      const { rows } = await pool.query(
        `UPDATE service_area_jobs SET status = $2, updated_at = now(), updated_by_user_id = $3 WHERE id = $1 RETURNING *`,
        [req.params.id, next, uid(req)]
      );
      logAudit(pool, { req, action: 'service_area_job.advance', entity_type: 'service_area_job',
        entity_id: req.params.id, before: { status }, after: { status: next }, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[sa-jobs:advance]', e && e.message);
      res.status(500).json({ error: 'Failed to advance job.' });
    }
  });

  // Step a job back one stage (undo-style).
  app.post('/api/service-area-jobs/:id/regress', requireManagerOrAdmin, async (req, res) => {
    try {
      const cur = await pool.query('SELECT team, status FROM service_area_jobs WHERE id = $1', [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Job not found' });
      const { team, status } = cur.rows[0];
      const prev = prevStatus(team, status);
      if (!prev) return res.status(400).json({ error: `Cannot regress from status '${status}'.` });
      const { rows } = await pool.query(
        `UPDATE service_area_jobs SET status = $2, updated_at = now(), updated_by_user_id = $3 WHERE id = $1 RETURNING *`,
        [req.params.id, prev, uid(req)]
      );
      logAudit(pool, { req, action: 'service_area_job.regress', entity_type: 'service_area_job',
        entity_id: req.params.id, before: { status }, after: { status: prev }, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[sa-jobs:regress]', e && e.message);
      res.status(500).json({ error: 'Failed to regress job.' });
    }
  });

  // Expose the pipeline map so the frontend can render stage chips consistently.
  app.get('/api/service-area-pipelines', requireAuth(STAFF_ROLES), (req, res) => {
    res.json({ pipelines: PIPELINES, approval_stage: APPROVAL_STAGE });
  });
};

module.exports._internal = { nextStatus, prevStatus, PIPELINES };
