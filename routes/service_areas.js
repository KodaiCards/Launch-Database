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

// Cost bucket by DISCIPLINE: the construction team is construction cost (labor);
// everything else (permitting/design/inspection) is engineering cost — what LFS
// bills. Materials are construction cost too, but stay a separate line item.
function costCategoryFor(team) {
  return team === 'construction' ? 'construction' : 'engineering';
}

module.exports = function installServiceAreaRoutes(app, pool, mw) {
  const { logAudit } = require('./_audit');
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || requireAdmin;
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  const uid = (req) => (req && req.user && req.user.id) || null;

  // Recompute a job's actual_hours (sum of its time entries) + actual_amount by
  // billing type: hourly = hours*rate; footage = footage*rate (hours tracked but
  // NOT billed); fixed = estimated_amount. Hours are tracked on every job.
  async function recomputeJob(jobId) {
    const { rows } = await pool.query(
      `UPDATE service_area_jobs saj SET
         actual_hours = COALESCE((SELECT SUM(hours) FROM time_entries WHERE service_area_job_id = saj.id), 0),
         actual_amount = CASE saj.billing_type
           WHEN 'hourly'  THEN COALESCE((SELECT SUM(hours) FROM time_entries WHERE service_area_job_id = saj.id), 0) * COALESCE(saj.rate, 0)
           WHEN 'footage' THEN COALESCE(saj.footage, 0) * COALESCE(saj.rate, 0)
           ELSE COALESCE(saj.estimated_amount, 0)
         END,
         updated_at = now()
       WHERE saj.id = $1 RETURNING *`,
      [jobId]
    );
    return rows[0];
  }

  // Recompute a material's completed_quantity from its units when it HAS units
  // (discrete items like closures track completion per-unit — this is what the
  // map sync drives). Footage/bulk materials with no units keep their set value.
  async function recomputeMaterial(materialId) {
    const { rows } = await pool.query(
      `UPDATE service_area_materials m SET
         completed_quantity = CASE
           WHEN EXISTS (SELECT 1 FROM service_area_material_units WHERE material_id = m.id)
             THEN (SELECT COUNT(*) FROM service_area_material_units WHERE material_id = m.id AND status = 'installed')
           ELSE m.completed_quantity
         END
       WHERE m.id = $1 RETURNING *`,
      [materialId]
    );
    return rows[0];
  }

  // Roll a route-level finalize up to the area: the area is finalized iff it has
  // routes and EVERY route is finalized; otherwise the area flag is cleared.
  async function syncAreaFinalize(areaId) {
    if (!areaId) return;
    await pool.query(
      `UPDATE service_areas sa SET
         build_finalized_at = CASE
           WHEN (SELECT COUNT(*) FROM service_area_routes WHERE service_area_id = sa.id) > 0
            AND (SELECT COUNT(*) FROM service_area_routes WHERE service_area_id = sa.id AND build_finalized_at IS NULL) = 0
           THEN COALESCE(sa.build_finalized_at, now())
           ELSE NULL END,
         updated_at = now()
       WHERE sa.id = $1`,
      [areaId]
    );
  }

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
    // Client-portal tile visibility (jsonb) — which summary tiles the client sees.
    if (Object.prototype.hasOwnProperty.call(req.body, 'client_visible_metrics') && req.body.client_visible_metrics != null) {
      sets.push(`client_visible_metrics = $${i}::jsonb`); vals.push(JSON.stringify(req.body.client_visible_metrics)); i++;
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

  // ─── Service-Area Routes (OPTIONAL subdivision: own map · status · finalize) ─
  // A service area may have routes (physical fiber paths). Jobs + materials carry
  // a nullable route_id; with no routes they attach to the area directly.

  app.get('/api/service-areas/:id/routes', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM service_area_routes WHERE service_area_id = $1 ORDER BY sort_order, created_at`,
        [req.params.id]);
      res.json(rows);
    } catch (e) { console.error('[sa-routes:list]', e && e.message); res.status(500).json({ error: 'Failed to list routes.' }); }
  });

  app.post('/api/service-areas/:id/routes', requireManagerOrAdmin, async (req, res) => {
    const b = req.body || {};
    if (!b.name || !String(b.name).trim()) return res.status(400).json({ error: 'name is required' });
    try {
      const sa = await pool.query('SELECT id FROM service_areas WHERE id = $1', [req.params.id]);
      if (!sa.rows.length) return res.status(404).json({ error: 'Service area not found' });
      const { rows } = await pool.query(
        `INSERT INTO service_area_routes
           (service_area_id, name, status, sort_order, notes, client_visible, created_by_user_id, updated_by_user_id)
         VALUES ($1,$2,COALESCE($3,'active'),COALESCE($4,0),$5,COALESCE($6,false),$7,$7)
         RETURNING *`,
        [req.params.id, String(b.name).trim(), b.status || null, b.sort_order ?? null, b.notes || null, b.client_visible, uid(req)]);
      logAudit(pool, { req, action: 'service_area_route.create', entity_type: 'service_area_route',
        entity_id: rows[0].id, after: { service_area_id: req.params.id, name: rows[0].name }, source: 'admin' }).catch(() => {});
      res.status(201).json(rows[0]);
    } catch (e) { console.error('[sa-routes:create]', e && e.message); res.status(500).json({ error: 'Failed to create route.' }); }
  });

  const SAROUTE_FIELDS = ['name', 'status', 'sort_order', 'map_file_path', 'map_filename', 'notes', 'client_visible'];
  app.put('/api/service-area-routes/:id', requireManagerOrAdmin, async (req, res) => {
    const sets = [], vals = [req.params.id]; let i = 2;
    for (const f of SAROUTE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f]; if (v === '') v = null;
        sets.push(`${f} = $${i}`); vals.push(v); i++;
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = now()`); vals.push(uid(req)); sets.push(`updated_by_user_id = $${i}`);
    try {
      const { rows } = await pool.query(`UPDATE service_area_routes SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Route not found' });
      logAudit(pool, { req, action: 'service_area_route.update', entity_type: 'service_area_route', entity_id: rows[0].id, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) { console.error('[sa-routes:update]', e && e.message); res.status(500).json({ error: 'Failed to update route.' }); }
  });

  // Delete a route — its jobs/materials fall back to area-level (route_id → NULL via FK).
  app.delete('/api/service-area-routes/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query('DELETE FROM service_area_routes WHERE id = $1 RETURNING service_area_id', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Route not found' });
      await syncAreaFinalize(rows[0].service_area_id);
      logAudit(pool, { req, action: 'service_area_route.delete', entity_type: 'service_area_route', entity_id: req.params.id, source: 'admin' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) { console.error('[sa-routes:delete]', e && e.message); res.status(500).json({ error: 'Failed to delete route.' }); }
  });

  // ─── Finalize build ─────────────────────────────────────────────────────────
  // Per route: set build_finalized_at + status 'complete' (reopen clears it, back
  // to 'active'). Area-level finalize cascades to every route. No confirm prompt.

  app.post('/api/service-area-routes/:id/finalize', requireManagerOrAdmin, async (req, res) => {
    const finalize = !(req.body && req.body.finalized === false);
    try {
      const { rows } = await pool.query(
        `UPDATE service_area_routes
           SET build_finalized_at = ${finalize ? 'now()' : 'NULL'}, status = $2,
               updated_at = now(), updated_by_user_id = $3
         WHERE id = $1 RETURNING *`,
        [req.params.id, finalize ? 'complete' : 'active', uid(req)]);
      if (!rows[0]) return res.status(404).json({ error: 'Route not found' });
      await syncAreaFinalize(rows[0].service_area_id);
      logAudit(pool, { req, action: 'service_area_route.finalize', entity_type: 'service_area_route',
        entity_id: rows[0].id, after: { finalized: finalize }, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) { console.error('[sa-routes:finalize]', e && e.message); res.status(500).json({ error: 'Failed to finalize route.' }); }
  });

  app.post('/api/service-areas/:id/finalize', requireManagerOrAdmin, async (req, res) => {
    const finalize = !(req.body && req.body.finalized === false);
    try {
      await pool.query(
        `UPDATE service_area_routes SET build_finalized_at = ${finalize ? 'now()' : 'NULL'},
           status = $2, updated_at = now() WHERE service_area_id = $1`,
        [req.params.id, finalize ? 'complete' : 'active']);
      const { rows } = await pool.query(
        `UPDATE service_areas SET build_finalized_at = ${finalize ? 'now()' : 'NULL'},
           status = $2, updated_at = now(), updated_by_user_id = $3 WHERE id = $1 RETURNING *`,
        [req.params.id, finalize ? 'complete' : 'active', uid(req)]);
      if (!rows[0]) return res.status(404).json({ error: 'Service area not found' });
      logAudit(pool, { req, action: 'service_area.finalize', entity_type: 'service_area',
        entity_id: rows[0].id, after: { finalized: finalize }, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) { console.error('[service-areas:finalize]', e && e.message); res.status(500).json({ error: 'Failed to finalize service area.' }); }
  });

  // ─── Materials (expected vs completed; map-sourced or manual) ───────────────
  // quantity = EXPECTED; completed_quantity = installed (auto-rolled from units
  // when a material has units). Remaining is computed client-side (exp − done).

  app.get('/api/service-areas/:id/materials', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const conds = ['m.service_area_id = $1']; const vals = [req.params.id];
      if (req.query.route_id) { vals.push(req.query.route_id); conds.push(`m.route_id = $${vals.length}`); }
      const { rows } = await pool.query(
        `SELECT m.*, (SELECT COUNT(*) FROM service_area_material_units u WHERE u.material_id = m.id) AS unit_count
           FROM service_area_materials m WHERE ${conds.join(' AND ')} ORDER BY m.created_at`, vals);
      res.json(rows);
    } catch (e) { console.error('[sa-materials:list]', e && e.message); res.status(500).json({ error: 'Failed to list materials.' }); }
  });

  app.post('/api/service-areas/:id/materials', requireManagerOrAdmin, async (req, res) => {
    const b = req.body || {};
    if (!b.item || !String(b.item).trim()) return res.status(400).json({ error: 'item is required' });
    const source = ['manual', 'bom_csv', 'map'].includes(b.source) ? b.source : 'manual';
    try {
      const sa = await pool.query('SELECT id FROM service_areas WHERE id = $1', [req.params.id]);
      if (!sa.rows.length) return res.status(404).json({ error: 'Service area not found' });
      const { rows } = await pool.query(
        `INSERT INTO service_area_materials
           (service_area_id, route_id, item, quantity, completed_quantity, unit, unit_cost, source, map_feature_ref, notes)
         VALUES ($1,$2,$3,$4,COALESCE($5,0),$6,$7,$8,$9,$10) RETURNING *`,
        [req.params.id, b.route_id || null, String(b.item).trim(), b.quantity ?? null, b.completed_quantity ?? null,
         b.unit || null, b.unit_cost ?? null, source, b.map_feature_ref || null, b.notes || null]);
      logAudit(pool, { req, action: 'service_area_material.create', entity_type: 'service_area_material',
        entity_id: rows[0].id, after: { service_area_id: req.params.id, item: rows[0].item }, source: 'admin' }).catch(() => {});
      res.status(201).json(rows[0]);
    } catch (e) { console.error('[sa-materials:create]', e && e.message); res.status(500).json({ error: 'Failed to add material.' }); }
  });

  const SAMAT_FIELDS = ['route_id', 'item', 'quantity', 'completed_quantity', 'unit', 'unit_cost', 'source', 'map_feature_ref', 'notes'];
  app.put('/api/service-area-materials/:id', requireManagerOrAdmin, async (req, res) => {
    const sets = [], vals = [req.params.id]; let i = 2;
    for (const f of SAMAT_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f]; if (v === '') v = null;
        sets.push(`${f} = $${i}`); vals.push(v); i++;
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    try {
      const { rows } = await pool.query(`UPDATE service_area_materials SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Material not found' });
      logAudit(pool, { req, action: 'service_area_material.update', entity_type: 'service_area_material', entity_id: rows[0].id, source: 'admin' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) { console.error('[sa-materials:update]', e && e.message); res.status(500).json({ error: 'Failed to update material.' }); }
  });

  app.delete('/api/service-area-materials/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rowCount } = await pool.query('DELETE FROM service_area_materials WHERE id = $1', [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Material not found' });
      logAudit(pool, { req, action: 'service_area_material.delete', entity_type: 'service_area_material', entity_id: req.params.id, source: 'admin' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) { console.error('[sa-materials:delete]', e && e.message); res.status(500).json({ error: 'Failed to delete material.' }); }
  });

  // ─── Material units (per-unit status + installed_date; the map sync target) ─
  // Discrete items get one row per physical unit. Mutating a unit re-rolls the
  // parent material's completed_quantity (count of installed units).

  app.get('/api/service-area-materials/:id/units', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM service_area_material_units WHERE material_id = $1 ORDER BY sequence NULLS LAST, created_at`, [req.params.id]);
      res.json(rows);
    } catch (e) { console.error('[sa-units:list]', e && e.message); res.status(500).json({ error: 'Failed to list units.' }); }
  });

  app.post('/api/service-area-materials/:id/units', requireManagerOrAdmin, async (req, res) => {
    const b = req.body || {};
    const status = ['pending', 'installed', 'removed'].includes(b.status) ? b.status : 'pending';
    // Installing with no explicit date stamps today (the map sync passes the real one).
    const installedDate = b.installed_date || (status === 'installed' ? new Date().toISOString().slice(0, 10) : null);
    try {
      const m = await pool.query('SELECT id FROM service_area_materials WHERE id = $1', [req.params.id]);
      if (!m.rows.length) return res.status(404).json({ error: 'Material not found' });
      const { rows } = await pool.query(
        `INSERT INTO service_area_material_units (material_id, label, sequence, status, installed_date, map_feature_ref)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [req.params.id, b.label || null, b.sequence ?? null, status, installedDate, b.map_feature_ref || null]);
      const material = await recomputeMaterial(req.params.id);
      res.status(201).json({ unit: rows[0], material });
    } catch (e) { console.error('[sa-units:create]', e && e.message); res.status(500).json({ error: 'Failed to add unit.' }); }
  });

  const SAUNIT_FIELDS = ['label', 'sequence', 'status', 'installed_date', 'map_feature_ref'];
  app.put('/api/service-area-material-units/:id', requireManagerOrAdmin, async (req, res) => {
    const sets = [], vals = [req.params.id]; let i = 2;
    for (const f of SAUNIT_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f]; if (v === '') v = null;
        sets.push(`${f} = $${i}`); vals.push(v); i++;
      }
    }
    // Installing a unit with no explicit date stamps today (map sync passes the real one).
    if (req.body && req.body.status === 'installed' && !req.body.installed_date) {
      sets.push(`installed_date = COALESCE(installed_date, CURRENT_DATE)`);
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = now()`);
    try {
      const { rows } = await pool.query(`UPDATE service_area_material_units SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Unit not found' });
      const material = await recomputeMaterial(rows[0].material_id);
      res.json({ unit: rows[0], material });
    } catch (e) { console.error('[sa-units:update]', e && e.message); res.status(500).json({ error: 'Failed to update unit.' }); }
  });

  app.delete('/api/service-area-material-units/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query('DELETE FROM service_area_material_units WHERE id = $1 RETURNING material_id', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Unit not found' });
      const material = await recomputeMaterial(rows[0].material_id);
      res.json({ ok: true, material });
    } catch (e) { console.error('[sa-units:delete]', e && e.message); res.status(500).json({ error: 'Failed to delete unit.' }); }
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
      const costCat = b.cost_category || costCategoryFor(team);

      const { rows } = await pool.query(
        `INSERT INTO service_area_jobs
           (service_area_id, job_id, team, assigned_staff_id, assigned_user_id,
            billing_type, rate, status, estimated_amount, footage, miles, notes,
            created_by_user_id, updated_by_user_id, route_id, cost_category)
         VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'potential'),$9,$10,$11,$12,$13,$13,$14,$15)
         RETURNING *`,
        [req.params.id, b.job_id || null, team, b.assigned_staff_id || null, b.assigned_user_id || null,
         billingType, rate, b.status || null, b.estimated_amount ?? null,
         b.footage ?? null, b.miles ?? null, b.notes || null, uid(req), b.route_id || null, costCat]
      );
      logAudit(pool, { req, action: 'service_area_job.create', entity_type: 'service_area_job',
        entity_id: rows[0].id, after: { service_area_id: req.params.id, team, job_id: b.job_id }, source: 'admin' }).catch(() => {});
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[sa-jobs:create]', e && e.message);
      res.status(500).json({ error: 'Failed to add job.' });
    }
  });

  const SAJOB_FIELDS = ['job_id', 'team', 'route_id', 'cost_category', 'assigned_staff_id', 'assigned_user_id',
    'billing_type', 'rate', 'status', 'estimated_amount', 'actual_hours', 'actual_amount', 'footage', 'miles',
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
    // Re-tag the cost bucket if the discipline changed and the caller didn't set it explicitly.
    if (Object.prototype.hasOwnProperty.call(req.body, 'team') && !Object.prototype.hasOwnProperty.call(req.body, 'cost_category')) {
      sets.push(`cost_category = $${i}`); vals.push(costCategoryFor(req.body.team)); i++;
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = now()`);
    vals.push(uid(req)); sets.push(`updated_by_user_id = $${i}`);
    try {
      const { rows } = await pool.query(
        `UPDATE service_area_jobs SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
      if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
      const job = await recomputeJob(req.params.id);  // keep actual_hours/$ consistent with rate/footage/type
      logAudit(pool, { req, action: 'service_area_job.update', entity_type: 'service_area_job',
        entity_id: job.id, source: 'admin' }).catch(() => {});
      res.json(job);
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

  // ── Hours (time entries against a job) ─────────────────────────────────────
  // staff_id defaults to the account's linked staff (auto self-attribution);
  // pass an explicit staff_id to log a collaborator's hours. Hours are tracked
  // on every job regardless of billing type.
  app.post('/api/service-area-jobs/:id/time-entries', requireAuth([...STAFF_ROLES, 'contractor']), async (req, res) => {
    const b = req.body || {};
    const hrs = Number(b.hours);
    if (!hrs || hrs <= 0) return res.status(400).json({ error: 'hours (> 0) required' });
    const isContractor = req.user && req.user.role === 'contractor';
    try {
      // Resolve the caller's own staff_id once.
      let myStaffId = req.user?.staff_id || null;
      if (!myStaffId && req.user) {
        myStaffId = (await pool.query('SELECT staff_id FROM users WHERE id = $1', [req.user.id])).rows[0]?.staff_id || null;
      }
      // Contractors may ONLY log against jobs assigned to them (IDOR guard);
      // staff can log against any job (incl. a collaborator's hours).
      if (isContractor) {
        const owned = await pool.query(
          `SELECT id FROM service_area_jobs
            WHERE id = $1 AND (assigned_user_id = $2 OR ($3::uuid IS NOT NULL AND assigned_staff_id = $3))`,
          [req.params.id, req.user.id, myStaffId]
        );
        if (!owned.rows.length) return res.status(403).json({ error: 'That job is not assigned to you.' });
      } else {
        const job = await pool.query('SELECT id FROM service_area_jobs WHERE id = $1', [req.params.id]);
        if (!job.rows.length) return res.status(404).json({ error: 'Job not found' });
      }
      // Attribution: a contractor is always themselves (no collaborator entries);
      // staff may pass an explicit staff_id, else default to their own.
      const staffId = isContractor ? myStaffId : (b.staff_id || myStaffId);
      const ins = await pool.query(
        `INSERT INTO time_entries (service_area_job_id, staff_id, user_id, entry_date, hours, notes, is_billable)
         VALUES ($1,$2,$3,COALESCE($4, now()::date),$5,$6,COALESCE($7,true)) RETURNING *`,
        [req.params.id, staffId, uid(req), b.entry_date || null, hrs, b.notes || null, b.is_billable]
      );
      const updated = await recomputeJob(req.params.id);
      logAudit(pool, { req, action: 'time_entry.create', entity_type: 'time_entry', entity_id: ins.rows[0].id,
        after: { job: req.params.id, staff_id: staffId, hours: hrs }, source: 'admin' }).catch(() => {});
      // Contractors get a money-free job summary (hours/status only) — the
      // recompute result carries actual_amount, which they must not see.
      const job = updated && isContractor
        ? { id: updated.id, status: updated.status, actual_hours: updated.actual_hours }
        : updated;
      res.status(201).json({ entry: ins.rows[0], job });
    } catch (e) {
      console.error('[sa-jobs:time-entry]', e && e.message);
      res.status(500).json({ error: 'Failed to log hours.' });
    }
  });

  app.get('/api/service-area-jobs/:id/time-entries', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT te.*, s.name AS staff_name
         FROM time_entries te LEFT JOIN staff s ON s.id = te.staff_id
         WHERE te.service_area_job_id = $1 ORDER BY te.entry_date DESC, te.created_at DESC`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e) {
      console.error('[sa-jobs:time-list]', e && e.message);
      res.status(500).json({ error: 'Failed to load hours.' });
    }
  });

  // Flat list of a team's job line items (across all service areas) with
  // service-area + client context. Powers the per-team pipeline kanban.
  app.get('/api/service-area-jobs', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const conds = [], params = [];
      if (req.query.team) { params.push(req.query.team); conds.push(`saj.team = $${params.length}`); }
      if (req.query.status) { params.push(req.query.status); conds.push(`saj.status = $${params.length}`); }
      const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
      const { rows } = await pool.query(
        `SELECT saj.*, j.name AS job_name, s.name AS assigned_staff_name,
                sa.name AS service_area_name, sa.program AS program,
                sa.engineering_contract_id, c.id AS client_id, c.name AS client_name
         FROM service_area_jobs saj
         JOIN service_areas sa ON sa.id = saj.service_area_id
         LEFT JOIN clients c ON c.id = sa.client_id
         LEFT JOIN jobs   j ON j.id = saj.job_id
         LEFT JOIN staff  s ON s.id = saj.assigned_staff_id
         ${where}
         ORDER BY sa.name, saj.created_at`,
        params
      );
      res.json(rows);
    } catch (e) {
      console.error('[sa-jobs:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load jobs.' });
    }
  });

  // Bill a service area: turn its ready-to-bill jobs (done stage, not yet
  // billed) into one invoice, then mark those jobs billed. Amount per item is
  // the job's actual_amount (already type-aware: hourly/footage/fixed).
  app.post('/api/service-areas/:id/bill', requireManagerOrAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const sa = await client.query('SELECT id, client_id, name FROM service_areas WHERE id = $1', [req.params.id]);
      if (!sa.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Service area not found' }); }
      const jobs = await client.query(
        `SELECT saj.id, saj.actual_amount, saj.actual_hours, saj.footage, saj.rate, saj.billing_type, j.name AS job_name
         FROM service_area_jobs saj LEFT JOIN jobs j ON j.id = saj.job_id
         WHERE saj.service_area_id = $1 AND saj.billed_date IS NULL
           AND saj.status IN ('issued','client_approved','complete')
           AND COALESCE(saj.actual_amount, 0) > 0`,
        [req.params.id]
      );
      if (!jobs.rows.length) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'No billable jobs — done jobs must have a value (log hours or set footage first).' }); }
      const total = jobs.rows.reduce((s, j) => s + Number(j.actual_amount || 0), 0);
      const inv = await client.query(
        `INSERT INTO invoices (client_id, invoice_number, invoice_date, total_amount, status, notes)
         VALUES ($1,$2,now()::date,$3,'draft',$4) RETURNING *`,
        [sa.rows[0].client_id, 'INV-' + Date.now(), total, 'Service area: ' + sa.rows[0].name]
      );
      for (const j of jobs.rows) {
        const qty = j.billing_type === 'footage' ? j.footage : (j.billing_type === 'hourly' ? j.actual_hours : 1);
        const unit = j.billing_type === 'footage' ? 'ft' : (j.billing_type === 'hourly' ? 'hr' : 'fixed');
        await client.query(
          `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
           VALUES ($1, NULL, $2, $3, $4, $5, $6)`,
          [inv.rows[0].id, sa.rows[0].name + ' · ' + (j.job_name || j.billing_type), qty, unit, j.rate, j.actual_amount]
        );
        await client.query(`UPDATE service_area_jobs SET billed_date = now()::date, status = 'billed', updated_at = now() WHERE id = $1`, [j.id]);
      }
      await client.query('COMMIT');
      logAudit(pool, { req, action: 'service_area.bill', entity_type: 'invoice', entity_id: inv.rows[0].id,
        after: { service_area: req.params.id, items: jobs.rows.length, total }, source: 'admin' }).catch(() => {});
      res.status(201).json({ invoice: inv.rows[0], item_count: jobs.rows.length });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[sa:bill]', e && e.message);
      res.status(500).json({ error: 'Failed to bill service area.' });
    } finally {
      client.release();
    }
  });

  // Invoices list (new model) with line items embedded, for the Billing view.
  app.get('/api/billing/invoices', requireManagerOrAdmin, async (req, res) => {
    try {
      const inv = await pool.query(
        `SELECT i.*, c.name AS client_name
         FROM invoices i LEFT JOIN clients c ON c.id = i.client_id
         ORDER BY i.created_at DESC LIMIT 200`
      );
      const ids = inv.rows.map(r => r.id);
      let items = [];
      if (ids.length) items = (await pool.query('SELECT * FROM invoice_items WHERE invoice_id = ANY($1) ORDER BY created_at', [ids])).rows;
      const byInv = {};
      items.forEach(it => (byInv[it.invoice_id] = byInv[it.invoice_id] || []).push(it));
      res.json(inv.rows.map(r => ({ ...r, items: byInv[r.id] || [] })));
    } catch (e) {
      console.error('[billing:invoices]', e && e.message);
      res.status(500).json({ error: 'Failed to load invoices.' });
    }
  });

  // Dashboard overview (new model): headline totals, pipeline tallies per
  // team/stage, recent service areas, and per-client rollups. Feeds dashboard.html.
  app.get('/api/dashboard/overview', requireAuth(STAFF_ROLES), async (req, res) => {
    try {
      const totals = await pool.query(
        `SELECT
           (SELECT count(*)::int FROM service_areas) AS service_areas,
           (SELECT count(*)::int FROM service_areas WHERE engineering_contract_id IS NOT NULL) AS sa_rus,
           (SELECT count(*)::int FROM service_area_jobs) AS jobs,
           (SELECT COALESCE(SUM(estimated_amount),0) FROM service_area_jobs) AS estimated_total,
           (SELECT COALESCE(SUM(actual_amount),0)    FROM service_area_jobs) AS actual_total,
           (SELECT COALESCE(SUM(actual_hours),0)     FROM service_area_jobs) AS hours_total`
      );
      const byTeamStage = await pool.query(
        `SELECT COALESCE(team,'(none)') AS team, status, count(*)::int AS count
         FROM service_area_jobs GROUP BY team, status`
      );
      const recent = await pool.query(
        `SELECT sa.id, sa.name, sa.program, sa.engineering_contract_id, sa.status, sa.created_at,
                c.name AS client_name,
                COALESCE(j.cnt,0)::int AS job_count, COALESCE(j.est,0) AS estimated_total
         FROM service_areas sa
         LEFT JOIN clients c ON c.id = sa.client_id
         LEFT JOIN (SELECT service_area_id, count(*) cnt, SUM(estimated_amount) est
                    FROM service_area_jobs GROUP BY service_area_id) j ON j.service_area_id = sa.id
         ORDER BY sa.created_at DESC LIMIT 8`
      );
      const byClient = await pool.query(
        `SELECT c.id AS client_id, c.name AS client_name,
                count(sa.id)::int AS sa_count, COALESCE(SUM(jj.est),0) AS estimated_total
         FROM clients c
         JOIN service_areas sa ON sa.client_id = c.id
         LEFT JOIN (SELECT service_area_id, SUM(estimated_amount) est
                    FROM service_area_jobs GROUP BY service_area_id) jj ON jj.service_area_id = sa.id
         GROUP BY c.id, c.name ORDER BY estimated_total DESC`
      );
      // Ready-to-bill: done stages with no billed_date, plus aging.
      const ready = await pool.query(
        `SELECT count(*)::int AS count, COALESCE(SUM(actual_amount),0) AS total,
                COALESCE(MAX((now()::date - completed_date)),0)::int AS oldest_days
         FROM service_area_jobs
         WHERE billed_date IS NULL AND status IN ('issued','client_approved','complete')`
      );
      // Estimated revenue split (RUS vs non-RUS) + actual (filled in by billing).
      const rev = await pool.query(
        `SELECT
           COALESCE(SUM(CASE WHEN sa.engineering_contract_id IS NOT NULL THEN saj.estimated_amount END),0) AS est_rus,
           COALESCE(SUM(CASE WHEN sa.engineering_contract_id IS NULL     THEN saj.estimated_amount END),0) AS est_non_rus,
           (SELECT COALESCE(SUM(total_amount),0) FROM invoices) AS actual_total
         FROM service_area_jobs saj JOIN service_areas sa ON sa.id = saj.service_area_id`
      );
      const alerts = await pool.query(
        `SELECT
           (SELECT count(*)::int FROM service_area_jobs WHERE status='revision') AS in_revision,
           (SELECT count(*)::int FROM service_area_jobs
              WHERE updated_at < now() - interval '14 days'
                AND status NOT IN ('issued','client_approved','complete','billed','cancelled')) AS stale`
      );
      const hours = await pool.query(
        `SELECT COALESCE(SUM(hours),0) AS total,
                COALESCE(SUM(hours) FILTER (WHERE is_billable AND service_area_job_id IS NOT NULL),0) AS billable,
                COALESCE(SUM(hours) FILTER (WHERE NOT is_billable OR service_area_job_id IS NULL),0) AS overhead
         FROM time_entries`
      );
      const t = totals.rows[0];
      res.json({
        totals: { ...t, sa_non_rus: t.service_areas - t.sa_rus },
        ready_to_bill: ready.rows[0],
        revenue: rev.rows[0],
        alerts: { ...alerts.rows[0], permits_due: 0 },
        hours: hours.rows[0],
        by_team_stage: byTeamStage.rows,
        recent: recent.rows,
        by_client: byClient.rows,
      });
    } catch (e) {
      console.error('[dashboard:overview]', e && e.message);
      res.status(500).json({ error: 'Failed to load dashboard.' });
    }
  });

  // Expose the pipeline map so the frontend can render stage chips consistently.
  app.get('/api/service-area-pipelines', requireAuth(STAFF_ROLES), (req, res) => {
    res.json({ pipelines: PIPELINES, approval_stage: APPROVAL_STAGE });
  });
};

module.exports._internal = { nextStatus, prevStatus, PIPELINES };
