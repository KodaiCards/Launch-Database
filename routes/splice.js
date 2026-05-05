// routes/splice.js — Splice Matrix tool, Phase 1.
//
// OSP fiber splice planning. Designers create a project, place cables and
// closures, drag fibers (or whole 12-fiber ribbons) to define splices, and
// export a printable PDF for splicers in the field. Splicers consume the
// PDF; they do not interact with the tool.
//
// Standalone: no FK to projects/contracts/billing. Only soft-link to
// staff(id) for designer attribution and lock ownership.
//
// Schema lives in migrations/0001_splice_schema.sql (already applied in
// production per PROJECT_NORTH_STAR §6.B).
//
// Endpoint groups
//   Projects        : list, create, hydrate, update, delete
//   Locking         : lock, heartbeat, unlock, take-over
//   Locations       : add / remove (Phase 1 uses 'splice_point' only)
//   Cables          : add (auto-generates buffer tubes + fibers in TIA-598
//                     order), update, delete
//   Closures        : add (auto-generates trays), update, delete
//   Splices         : single-fiber and ribbon (12 fibers as one mass-fusion
//                     unit), delete (single + whole ribbon group)
//   Closure models  : picklist that grows organically as designers type
//                     model names
//   SSE             : per-project event stream so a second viewer sees
//                     committed actions in real time (mid-drag is NOT
//                     broadcast — only successful writes)
//   PDF / HTML      : puppeteer-rendered splicer field document, plus a
//                     debug HTML endpoint for layout iteration

const TIA_598_COLORS = [
  'blue', 'orange', 'green', 'brown', 'slate', 'white',
  'red', 'black', 'yellow', 'violet', 'rose', 'aqua'
];

const FIBER_COUNTS = [12, 24, 48, 96, 144, 288, 432, 864];

// Stale-lock timeout: 10 minutes since last heartbeat. Past that, any
// other designer can take over with the take-over endpoint.
const STALE_LOCK_MS = 10 * 60 * 1000;

// SSE registry keyed by splice_project_id. Each entry is a Set of
// Express response objects with a .write() method. We push events into
// every response in the set when an action commits.
const sseClients = new Map();

function _broadcast(projectId, event, data) {
  const set = sseClients.get(projectId);
  if (!set || !set.size) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch { /* dead connection — purged on close */ }
  }
}

function _addSseClient(projectId, res) {
  if (!sseClients.has(projectId)) sseClients.set(projectId, new Set());
  sseClients.get(projectId).add(res);
}

function _removeSseClient(projectId, res) {
  const set = sseClients.get(projectId);
  if (!set) return;
  set.delete(res);
  if (!set.size) sseClients.delete(projectId);
}

// Phase 2A #2 — validation rule engine. Pure functions over the hydrate;
// no DB access, cheap to call on every save.
const { validateProject } = require('./_splice_validation');

// Lazy puppeteer require so the dep load doesn't block boot when the
// container is missing the binary (matches invoice_template_engine.js).
let _puppeteer = null;
function _puppet() {
  if (_puppeteer) return _puppeteer;
  try { _puppeteer = require('puppeteer'); }
  catch (e) {
    throw new Error('puppeteer not installed; PDF render unavailable. ' +
                    'Run `npm install puppeteer`. Original: ' + e.message);
  }
  return _puppeteer;
}

module.exports = function installSpliceRoutes(app, pool, mw) {
  const { requireAuth } = mw;

  // ─── Projects ─────────────────────────────────────────────────────────────

  app.get('/api/splice/projects', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          p.*,
          s.full_name AS designer_name,
          (SELECT COUNT(*) FROM splice_cables   c WHERE c.project_id = p.id)::int AS cable_count,
          (SELECT COUNT(*) FROM splice_locations l WHERE l.project_id = p.id)::int AS location_count,
          (SELECT COUNT(*) FROM splices sp
             JOIN splice_trays t  ON t.id = sp.tray_id
             JOIN splice_closures cl ON cl.id = t.closure_id
             JOIN splice_locations l ON l.id = cl.location_id
            WHERE l.project_id = p.id)::int AS splice_count
        FROM splice_projects p
        LEFT JOIN staff s ON s.id = p.designer_id
        ORDER BY p.updated_at DESC, p.created_at DESC
      `);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/splice/projects', requireAuth(), async (req, res) => {
    const { name, notes } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    try {
      const designerId = req.user?.staff_id || null;
      const { rows } = await pool.query(
        `INSERT INTO splice_projects (name, designer_id, notes)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [String(name).trim(), designerId, notes || null]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Full hydrate: returns project + all locations, cables (with tubes and
  // fibers), closures (with trays and splices), and ribbon groups in one
  // payload so the editor can render the whole world from a single call.
  app.get('/api/splice/projects/:id', requireAuth(), async (req, res) => {
    const projectId = req.params.id;
    try {
      const proj = await pool.query(
        `SELECT p.*, s.full_name AS designer_name,
                ls.full_name AS locked_by_full_name
         FROM splice_projects p
         LEFT JOIN staff s  ON s.id = p.designer_id
         LEFT JOIN staff ls ON ls.id = p.locked_by_staff_id
         WHERE p.id = $1`,
        [projectId]
      );
      if (!proj.rows.length) return res.status(404).json({ error: 'Splice project not found' });

      const [locations, cables, tubes, fibers, closures, trays, splices, ribbonGroups] =
        await Promise.all([
          pool.query(`SELECT * FROM splice_locations  WHERE project_id = $1 ORDER BY sequence_index, name`, [projectId]),
          pool.query(`SELECT * FROM splice_cables     WHERE project_id = $1 ORDER BY created_at`, [projectId]),
          pool.query(`
            SELECT t.* FROM splice_buffer_tubes t
            JOIN splice_cables c ON c.id = t.cable_id
            WHERE c.project_id = $1
            ORDER BY t.cable_id, t.position
          `, [projectId]),
          pool.query(`
            SELECT f.* FROM splice_fibers f
            JOIN splice_buffer_tubes t ON t.id = f.buffer_tube_id
            JOIN splice_cables c ON c.id = t.cable_id
            WHERE c.project_id = $1
            ORDER BY f.buffer_tube_id, f.position
          `, [projectId]),
          pool.query(`
            SELECT cl.* FROM splice_closures cl
            JOIN splice_locations l ON l.id = cl.location_id
            WHERE l.project_id = $1
            ORDER BY cl.created_at
          `, [projectId]),
          pool.query(`
            SELECT t.* FROM splice_trays t
            JOIN splice_closures cl ON cl.id = t.closure_id
            JOIN splice_locations l ON l.id = cl.location_id
            WHERE l.project_id = $1
            ORDER BY t.closure_id, t.position
          `, [projectId]),
          pool.query(`
            SELECT s.* FROM splices s
            JOIN splice_trays t ON t.id = s.tray_id
            JOIN splice_closures cl ON cl.id = t.closure_id
            JOIN splice_locations l ON l.id = cl.location_id
            WHERE l.project_id = $1
            ORDER BY s.created_at
          `, [projectId]),
          pool.query(`
            SELECT g.* FROM splice_ribbon_groups g
            JOIN splice_trays t ON t.id = g.tray_id
            JOIN splice_closures cl ON cl.id = t.closure_id
            JOIN splice_locations l ON l.id = cl.location_id
            WHERE l.project_id = $1
            ORDER BY g.created_at
          `, [projectId]),
        ]);

      const hydrate = {
        project: proj.rows[0],
        locations:    locations.rows,
        cables:       cables.rows,
        buffer_tubes: tubes.rows,
        fibers:       fibers.rows,
        closures:     closures.rows,
        trays:        trays.rows,
        splices:      splices.rows,
        ribbon_groups: ribbonGroups.rows,
      };
      // Phase 1 lightweight metrics — kept for backwards-compat with the
      // existing UI pane that reads `warnings.unspliced_fiber_count` etc.
      // The richer rule-based output lives in `validation`.
      hydrate.warnings = _computeWarnings({
        fibers: fibers.rows,
        splices: splices.rows,
        trays: trays.rows,
        closures: closures.rows,
      });
      // Phase 2A #2 — full validation pass. Errors block PDF export;
      // warnings surface in the UI but don't block.
      hydrate.validation = validateProject(hydrate);
      res.json(hydrate);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Dedicated validation endpoint. Same rules as the hydrate's `validation`
  // payload, but loads only what the rules need so a quick "is this project
  // shippable?" check is cheap. Useful for a debounced "save → revalidate"
  // loop on the frontend without re-rendering the whole canvas.
  app.get('/api/splice/projects/:id/validation', requireAuth(), async (req, res) => {
    try {
      const data = await _loadProjectForExport(pool, req.params.id);
      if (!data) return res.status(404).json({ error: 'Project not found' });
      res.json(validateProject(data));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/splice/projects/:id', requireAuth(), async (req, res) => {
    const allowed = ['name', 'status', 'notes'];
    const sets = [];
    const vals = [req.params.id];
    let i = 2;
    for (const f of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        sets.push(`${f} = $${i++}`);
        vals.push(req.body[f]);
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = NOW()`);
    try {
      const { rows } = await pool.query(
        `UPDATE splice_projects SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
      _broadcast(req.params.id, 'project_updated', { project: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/projects/:id', requireAuth(), async (req, res) => {
    try {
      const r = await pool.query('DELETE FROM splice_projects WHERE id = $1', [req.params.id]);
      if (!r.rowCount) return res.status(404).json({ error: 'Project not found' });
      _broadcast(req.params.id, 'project_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Locking ─────────────────────────────────────────────────────────────

  app.post('/api/splice/projects/:id/lock', requireAuth(), async (req, res) => {
    const projectId = req.params.id;
    const staffId = req.user?.staff_id || null;
    const name = req.user?.full_name || req.user?.username || 'unknown';
    try {
      const cur = await pool.query(
        `SELECT locked_by_staff_id, locked_by_name, locked_at
         FROM splice_projects WHERE id = $1`,
        [projectId]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Project not found' });
      const row = cur.rows[0];
      const lockedAt = row.locked_at ? new Date(row.locked_at).getTime() : 0;
      const isStale = !row.locked_by_staff_id || (Date.now() - lockedAt > STALE_LOCK_MS);
      const isMine = row.locked_by_staff_id && row.locked_by_staff_id === staffId;

      if (!isMine && !isStale) {
        return res.status(409).json({
          error: 'Project is locked by another designer',
          locked_by_name: row.locked_by_name,
          locked_at: row.locked_at,
          can_take_over: false,
        });
      }

      const { rows } = await pool.query(
        `UPDATE splice_projects
         SET locked_by_staff_id = $2, locked_by_name = $3, locked_at = NOW()
         WHERE id = $1
         RETURNING locked_by_staff_id, locked_by_name, locked_at`,
        [projectId, staffId, name]
      );
      _broadcast(projectId, 'lock_acquired', rows[0]);
      res.json({ ok: true, ...rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 60-second heartbeat — extends my lock. Returns 409 if the lock has
  // moved to someone else (because I went stale and they took over).
  app.post('/api/splice/projects/:id/heartbeat', requireAuth(), async (req, res) => {
    const staffId = req.user?.staff_id || null;
    try {
      const cur = await pool.query(
        `SELECT locked_by_staff_id FROM splice_projects WHERE id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Project not found' });
      if (cur.rows[0].locked_by_staff_id !== staffId) {
        return res.status(409).json({ error: 'Lock no longer held by you' });
      }
      await pool.query(
        `UPDATE splice_projects SET locked_at = NOW() WHERE id = $1`,
        [req.params.id]
      );
      res.json({ ok: true, locked_at: new Date().toISOString() });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/splice/projects/:id/unlock', requireAuth(), async (req, res) => {
    const staffId = req.user?.staff_id || null;
    try {
      // Allow self-release; admins can release anyone's lock.
      const isAdmin = req.user?.role === 'admin';
      const sql = isAdmin
        ? `UPDATE splice_projects SET locked_by_staff_id = NULL, locked_by_name = NULL, locked_at = NULL WHERE id = $1`
        : `UPDATE splice_projects SET locked_by_staff_id = NULL, locked_by_name = NULL, locked_at = NULL WHERE id = $1 AND locked_by_staff_id = $2`;
      const params = isAdmin ? [req.params.id] : [req.params.id, staffId];
      const r = await pool.query(sql, params);
      if (!r.rowCount) return res.status(409).json({ error: 'Lock not held by you' });
      _broadcast(req.params.id, 'lock_released', { by: staffId });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Force-take a stale lock. Refuses if the current lock is fresh (within
  // STALE_LOCK_MS) — non-admins can't yank a live lock from someone else.
  app.post('/api/splice/projects/:id/take-over', requireAuth(), async (req, res) => {
    const staffId = req.user?.staff_id || null;
    const name = req.user?.full_name || req.user?.username || 'unknown';
    try {
      const cur = await pool.query(
        `SELECT locked_by_staff_id, locked_at FROM splice_projects WHERE id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Project not found' });
      const row = cur.rows[0];
      const lockedAt = row.locked_at ? new Date(row.locked_at).getTime() : 0;
      const isStale = !row.locked_by_staff_id || (Date.now() - lockedAt > STALE_LOCK_MS);
      if (!isStale && req.user?.role !== 'admin') {
        return res.status(409).json({ error: 'Lock is fresh; ask the current holder to release it' });
      }
      const { rows } = await pool.query(
        `UPDATE splice_projects
         SET locked_by_staff_id = $2, locked_by_name = $3, locked_at = NOW()
         WHERE id = $1
         RETURNING locked_by_staff_id, locked_by_name, locked_at`,
        [req.params.id, staffId, name]
      );
      _broadcast(req.params.id, 'lock_taken_over', rows[0]);
      res.json({ ok: true, ...rows[0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Locations ───────────────────────────────────────────────────────────

  app.post('/api/splice/projects/:id/locations', requireAuth(), async (req, res) => {
    const { type = 'splice_point', name, sequence_index = 0, notes } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
    try {
      const { rows } = await pool.query(
        `INSERT INTO splice_locations (project_id, type, name, sequence_index, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.params.id, type, String(name).trim(), Number(sequence_index) || 0, notes || null]
      );
      _bumpProjectMtime(pool, req.params.id);
      _broadcast(req.params.id, 'location_added', { location: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/splice/locations/:id', requireAuth(), async (req, res) => {
    const allowed = ['type', 'name', 'sequence_index', 'notes'];
    const sets = [];
    const vals = [req.params.id];
    let i = 2;
    for (const f of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        sets.push(`${f} = $${i++}`);
        vals.push(req.body[f]);
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    try {
      const { rows } = await pool.query(
        `UPDATE splice_locations SET ${sets.join(', ')} WHERE id = $1 RETURNING project_id, *`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'Location not found' });
      _bumpProjectMtime(pool, rows[0].project_id);
      _broadcast(rows[0].project_id, 'location_updated', { location: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/locations/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(
        `SELECT project_id FROM splice_locations WHERE id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Location not found' });
      await pool.query(`DELETE FROM splice_locations WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'location_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Cables ──────────────────────────────────────────────────────────────
  // POST creates the cable row AND auto-generates fiber_count/12 buffer
  // tubes plus fiber_count individual fibers in TIA-598 color order. This
  // is the bulk of the schema work; the editor just drops a cable on the
  // canvas and the backend hydrates the whole tree.

  app.post('/api/splice/projects/:id/cables', requireAuth(), async (req, res) => {
    const {
      name, fiber_count, construction_type = 'ribbon',
      from_location_id, to_location_id, manufacturer_part, notes,
    } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
    if (!FIBER_COUNTS.includes(Number(fiber_count))) {
      return res.status(400).json({ error: `fiber_count must be one of ${FIBER_COUNTS.join(', ')}` });
    }
    if (!['ribbon', 'loose_tube'].includes(construction_type)) {
      return res.status(400).json({ error: `construction_type must be 'ribbon' or 'loose_tube'` });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cable = await client.query(
        `INSERT INTO splice_cables
           (project_id, name, fiber_count, construction_type,
            from_location_id, to_location_id, manufacturer_part, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [req.params.id, String(name).trim(), Number(fiber_count), construction_type,
         from_location_id || null, to_location_id || null, manufacturer_part || null, notes || null]
      );
      const cableId = cable.rows[0].id;

      // Generate N/12 buffer tubes (or ribbons), each with 12 fibers in
      // TIA-598 order. Tube color cycles through TIA-598 too.
      const tubeCount = Number(fiber_count) / 12;
      const tubes = [];
      for (let t = 1; t <= tubeCount; t++) {
        const tubeColor = TIA_598_COLORS[(t - 1) % 12];
        const tubeRow = await client.query(
          `INSERT INTO splice_buffer_tubes (cable_id, position, color)
           VALUES ($1, $2, $3) RETURNING *`,
          [cableId, t, tubeColor]
        );
        tubes.push(tubeRow.rows[0]);
        for (let f = 1; f <= 12; f++) {
          await client.query(
            `INSERT INTO splice_fibers (buffer_tube_id, position, color)
             VALUES ($1, $2, $3)`,
            [tubeRow.rows[0].id, f, TIA_598_COLORS[f - 1]]
          );
        }
      }
      await client.query('COMMIT');
      _bumpProjectMtime(pool, req.params.id);
      _broadcast(req.params.id, 'cable_added', {
        cable: cable.rows[0], tube_count: tubes.length, fiber_count: Number(fiber_count),
      });
      res.json({ cable: cable.rows[0], tubes });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  app.put('/api/splice/cables/:id', requireAuth(), async (req, res) => {
    // Only metadata fields are mutable post-create. Changing fiber_count
    // would invalidate every fiber and splice underneath; if the designer
    // needs a different size, they delete and re-add.
    const allowed = ['name', 'from_location_id', 'to_location_id', 'manufacturer_part', 'notes'];
    const sets = [];
    const vals = [req.params.id];
    let i = 2;
    for (const f of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        sets.push(`${f} = $${i++}`);
        vals.push(req.body[f]);
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    try {
      const { rows } = await pool.query(
        `UPDATE splice_cables SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'Cable not found' });
      _bumpProjectMtime(pool, rows[0].project_id);
      _broadcast(rows[0].project_id, 'cable_updated', { cable: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/cables/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(`SELECT project_id FROM splice_cables WHERE id = $1`, [req.params.id]);
      if (!cur.rows.length) return res.status(404).json({ error: 'Cable not found' });
      await pool.query(`DELETE FROM splice_cables WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'cable_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Closures ────────────────────────────────────────────────────────────

  app.post('/api/splice/locations/:id/closures', requireAuth(), async (req, res) => {
    const {
      model, tray_count = 6, tray_capacity = 12, notes,
    } = req.body;
    const tc = Math.max(1, Number(tray_count) || 6);
    const cap = Math.max(1, Number(tray_capacity) || 12);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const loc = await client.query(
        `SELECT project_id FROM splice_locations WHERE id = $1`,
        [req.params.id]
      );
      if (!loc.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Location not found' });
      }
      const closure = await client.query(
        `INSERT INTO splice_closures (location_id, model, tray_count, tray_capacity, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [req.params.id, model || null, tc, cap, notes || null]
      );
      const trays = [];
      for (let i = 1; i <= tc; i++) {
        const t = await client.query(
          `INSERT INTO splice_trays (closure_id, position) VALUES ($1, $2) RETURNING *`,
          [closure.rows[0].id, i]
        );
        trays.push(t.rows[0]);
      }
      // Closure-models picklist grows organically. Bump or insert.
      if (model && String(model).trim()) {
        await client.query(
          `INSERT INTO splice_closure_models (model, default_tray_count, default_tray_capacity, use_count, last_used_at)
           VALUES ($1, $2, $3, 1, NOW())
           ON CONFLICT (model) DO UPDATE SET
             use_count = splice_closure_models.use_count + 1,
             last_used_at = NOW(),
             default_tray_count    = EXCLUDED.default_tray_count,
             default_tray_capacity = EXCLUDED.default_tray_capacity`,
          [String(model).trim(), tc, cap]
        );
      }
      await client.query('COMMIT');
      _bumpProjectMtime(pool, loc.rows[0].project_id);
      _broadcast(loc.rows[0].project_id, 'closure_added', {
        closure: closure.rows[0], trays,
      });
      res.json({ closure: closure.rows[0], trays });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  app.put('/api/splice/closures/:id', requireAuth(), async (req, res) => {
    const allowed = ['model', 'tray_count', 'tray_capacity', 'notes'];
    // tray_count change: if increasing, append new trays; if decreasing,
    // refuse if any of the trays-to-drop already hold splices (avoids
    // silent data loss).
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cur = await client.query(`SELECT * FROM splice_closures WHERE id = $1`, [req.params.id]);
      if (!cur.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Closure not found' });
      }
      const closure = cur.rows[0];

      const sets = [];
      const vals = [req.params.id];
      let i = 2;
      for (const f of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, f)) {
          sets.push(`${f} = $${i++}`);
          vals.push(req.body[f]);
        }
      }
      if (!sets.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'No fields to update' });
      }

      // Reconcile tray rows when tray_count changes.
      const newCount = Object.prototype.hasOwnProperty.call(req.body, 'tray_count')
        ? Math.max(1, Number(req.body.tray_count) || closure.tray_count)
        : closure.tray_count;
      if (newCount !== closure.tray_count) {
        if (newCount > closure.tray_count) {
          for (let p = closure.tray_count + 1; p <= newCount; p++) {
            await client.query(
              `INSERT INTO splice_trays (closure_id, position) VALUES ($1, $2)`,
              [closure.id, p]
            );
          }
        } else {
          // Shrinking — refuse if any of the to-drop trays hold splices.
          const drop = await client.query(
            `SELECT t.id, t.position,
                    (SELECT COUNT(*) FROM splices s WHERE s.tray_id = t.id)::int AS used
             FROM splice_trays t
             WHERE t.closure_id = $1 AND t.position > $2
             ORDER BY t.position`,
            [closure.id, newCount]
          );
          const blocking = drop.rows.filter(r => r.used > 0);
          if (blocking.length) {
            await client.query('ROLLBACK');
            return res.status(409).json({
              error: 'Cannot shrink closure — these trays still hold splices',
              blocking_positions: blocking.map(r => r.position),
            });
          }
          await client.query(
            `DELETE FROM splice_trays WHERE closure_id = $1 AND position > $2`,
            [closure.id, newCount]
          );
        }
      }

      const upd = await client.query(
        `UPDATE splice_closures SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        vals
      );
      const loc = await client.query(`SELECT project_id FROM splice_locations WHERE id = $1`, [closure.location_id]);
      await client.query('COMMIT');
      const projectId = loc.rows[0]?.project_id;
      _bumpProjectMtime(pool, projectId);
      _broadcast(projectId, 'closure_updated', { closure: upd.rows[0] });
      res.json(upd.rows[0]);
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  app.delete('/api/splice/closures/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(
        `SELECT cl.id, l.project_id
         FROM splice_closures cl
         JOIN splice_locations l ON l.id = cl.location_id
         WHERE cl.id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Closure not found' });
      await pool.query(`DELETE FROM splice_closures WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'closure_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Splices ─────────────────────────────────────────────────────────────

  app.post('/api/splice/trays/:id/splices', requireAuth(), async (req, res) => {
    const { fiber_a_id, fiber_b_id, splice_type = 'fusion' } = req.body;
    if (!fiber_a_id || !fiber_b_id) {
      return res.status(400).json({ error: 'fiber_a_id and fiber_b_id are required' });
    }
    if (fiber_a_id === fiber_b_id) {
      return res.status(400).json({ error: 'A fiber cannot be spliced to itself' });
    }
    if (!['fusion', 'mechanical'].includes(splice_type)) {
      return res.status(400).json({ error: `splice_type must be 'fusion' or 'mechanical'` });
    }
    try {
      const tray = await pool.query(
        `SELECT t.id, t.closure_id, cl.tray_capacity, l.project_id
         FROM splice_trays t
         JOIN splice_closures cl ON cl.id = t.closure_id
         JOIN splice_locations l ON l.id = cl.location_id
         WHERE t.id = $1`,
        [req.params.id]
      );
      if (!tray.rows.length) return res.status(404).json({ error: 'Tray not found' });

      const used = await pool.query(`SELECT COUNT(*)::int AS n FROM splices WHERE tray_id = $1`, [req.params.id]);
      if (used.rows[0].n >= tray.rows[0].tray_capacity) {
        return res.status(409).json({
          error: `Tray is at capacity (${tray.rows[0].tray_capacity}); pick another tray or raise capacity`,
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO splices (tray_id, fiber_a_id, fiber_b_id, splice_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.params.id, fiber_a_id, fiber_b_id, splice_type]
      );
      _bumpProjectMtime(pool, tray.rows[0].project_id);
      _broadcast(tray.rows[0].project_id, 'splice_added', { splice: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Ribbon splice: 12 fibers fused as one mass-fusion unit. Caller passes
  // pairs of fiber IDs (one from each side, 12 pairs) — we create 12 splice
  // rows AND a ribbon group row that ties them together so the editor and
  // the PDF render them as a single ribbon-to-ribbon line.
  app.post('/api/splice/trays/:id/ribbon-splice', requireAuth(), async (req, res) => {
    const { pairs, splice_type = 'fusion' } = req.body;
    if (!Array.isArray(pairs) || pairs.length !== 12) {
      return res.status(400).json({ error: 'pairs must be an array of exactly 12 fiber pairs' });
    }
    for (const p of pairs) {
      if (!p || !p.fiber_a_id || !p.fiber_b_id) {
        return res.status(400).json({ error: 'Each pair needs fiber_a_id and fiber_b_id' });
      }
      if (p.fiber_a_id === p.fiber_b_id) {
        return res.status(400).json({ error: 'A fiber cannot be spliced to itself' });
      }
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const tray = await client.query(
        `SELECT t.id, t.closure_id, cl.tray_capacity, l.project_id
         FROM splice_trays t
         JOIN splice_closures cl ON cl.id = t.closure_id
         JOIN splice_locations l ON l.id = cl.location_id
         WHERE t.id = $1`,
        [req.params.id]
      );
      if (!tray.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Tray not found' });
      }
      const used = await client.query(`SELECT COUNT(*)::int AS n FROM splices WHERE tray_id = $1`, [req.params.id]);
      if (used.rows[0].n + 12 > tray.rows[0].tray_capacity) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: `Tray would exceed capacity (${tray.rows[0].tray_capacity}); ribbon needs 12 splice slots`,
        });
      }
      const group = await client.query(
        `INSERT INTO splice_ribbon_groups (tray_id) VALUES ($1) RETURNING *`,
        [req.params.id]
      );
      const splices = [];
      for (const p of pairs) {
        const r = await client.query(
          `INSERT INTO splices (tray_id, fiber_a_id, fiber_b_id, splice_type, ribbon_group_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [req.params.id, p.fiber_a_id, p.fiber_b_id, splice_type, group.rows[0].id]
        );
        splices.push(r.rows[0]);
      }
      await client.query('COMMIT');
      _bumpProjectMtime(pool, tray.rows[0].project_id);
      _broadcast(tray.rows[0].project_id, 'ribbon_splice_added', {
        ribbon_group: group.rows[0], splices,
      });
      res.json({ ribbon_group: group.rows[0], splices });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  app.delete('/api/splice/splices/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(
        `SELECT s.id, l.project_id
         FROM splices s
         JOIN splice_trays t ON t.id = s.tray_id
         JOIN splice_closures cl ON cl.id = t.closure_id
         JOIN splice_locations l ON l.id = cl.location_id
         WHERE s.id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Splice not found' });
      await pool.query(`DELETE FROM splices WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'splice_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/ribbon-groups/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(
        `SELECT g.id, l.project_id
         FROM splice_ribbon_groups g
         JOIN splice_trays t ON t.id = g.tray_id
         JOIN splice_closures cl ON cl.id = t.closure_id
         JOIN splice_locations l ON l.id = cl.location_id
         WHERE g.id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Ribbon group not found' });
      // The 12 splices cascade out via the FK ribbon_group_id ON DELETE
      // SET NULL — but we want them GONE, not orphaned. Delete splices
      // first, then the group.
      await pool.query(`DELETE FROM splices WHERE ribbon_group_id = $1`, [req.params.id]);
      await pool.query(`DELETE FROM splice_ribbon_groups WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'ribbon_group_deleted', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Closure models picklist ─────────────────────────────────────────────
  // Empty by design — fills as designers type model names. No seed.

  app.get('/api/splice/closure-models', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM splice_closure_models ORDER BY use_count DESC, last_used_at DESC, model`
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── Server-Sent Events ──────────────────────────────────────────────────

  app.get('/api/splice/projects/:id/events', requireAuth(), (req, res) => {
    const projectId = req.params.id;
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',  // disable nginx-style buffering on proxies
    });
    res.flushHeaders?.();
    res.write(`event: hello\ndata: ${JSON.stringify({ project_id: projectId })}\n\n`);
    _addSseClient(projectId, res);
    // Keep-alive ping every 25s so proxies don't kill the idle connection.
    const pingTimer = setInterval(() => {
      try { res.write(`: ping ${Date.now()}\n\n`); } catch {}
    }, 25000);
    req.on('close', () => {
      clearInterval(pingTimer);
      _removeSseClient(projectId, res);
    });
  });

  // ─── PDF / HTML export ───────────────────────────────────────────────────

  app.get('/api/splice/projects/:id/export-html', requireAuth(), async (req, res) => {
    try {
      const data = await _loadProjectForExport(pool, req.params.id);
      if (!data) return res.status(404).json({ error: 'Project not found' });
      const html = _renderSpliceHtml(data, req.query.page_size);
      res.set('Content-Type', 'text/html; charset=utf-8').send(html);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/splice/projects/:id/export-pdf', requireAuth(), async (req, res) => {
    try {
      const data = await _loadProjectForExport(pool, req.params.id);
      if (!data) return res.status(404).json({ error: 'Project not found' });
      // Phase 2A #2 — validation gate. Fatal errors (tray overrun, double
      // splice, ribbon-group split across trays, etc.) block PDF export
      // unless ?force=1 is set. Designers can still bail past the gate
      // when they know what they're doing, but the default is "the
      // splicer never sees a knowingly broken plan."
      const validation = validateProject(data);
      const force = req.query.force === '1';
      if (validation.summary.blocked && !force) {
        return res.status(422).json({
          error: 'Splice plan has fatal errors — fix or pass ?force=1 to override.',
          validation,
        });
      }
      const pageSize = req.query.page_size || data.project.page_size || 'Tabloid';
      const html = _renderSpliceHtml(data, pageSize);
      const puppeteer = _puppet();
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
        const pdf = await page.pdf({
          format: pageSize,
          printBackground: true,
          margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        });
        const filename = `splice_${_safeFilename(data.project.name)}_${new Date().toISOString().slice(0,10)}.pdf`;
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
        });
        res.send(pdf);
      } finally {
        try { await browser.close(); } catch {}
      }
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};

// ─── Helpers ──────────────────────────────────────────────────────────────

// Bump the project's updated_at so the project list re-sorts and SSE
// clients can re-fetch on a single hint. Best-effort; failure here is
// not user-visible.
function _bumpProjectMtime(pool, projectId) {
  if (!projectId) return;
  pool.query(`UPDATE splice_projects SET updated_at = NOW() WHERE id = $1`, [projectId])
    .catch(() => {});
}

// Compute splice-uniqueness violations + tray-capacity overruns + a
// summary count of fibers that participate in zero splices ("unspliced").
// Returned as part of the hydrate payload so the editor can highlight
// problems without a second round-trip.
function _computeWarnings({ fibers, splices, trays, closures }) {
  const fiberUseCount = new Map();
  for (const s of splices) {
    fiberUseCount.set(s.fiber_a_id, (fiberUseCount.get(s.fiber_a_id) || 0) + 1);
    fiberUseCount.set(s.fiber_b_id, (fiberUseCount.get(s.fiber_b_id) || 0) + 1);
  }
  const overSpliced = [];
  for (const [fid, n] of fiberUseCount) {
    if (n > 2) overSpliced.push({ fiber_id: fid, splice_count: n });
  }
  const trayUse = new Map();
  for (const s of splices) {
    trayUse.set(s.tray_id, (trayUse.get(s.tray_id) || 0) + 1);
  }
  const overCapacity = [];
  for (const t of trays) {
    const cl = closures.find(c => c.id === t.closure_id);
    const cap = cl?.tray_capacity ?? 12;
    const used = trayUse.get(t.id) || 0;
    if (used > cap) overCapacity.push({ tray_id: t.id, used, capacity: cap });
  }
  const unspliced = fibers.filter(f => !fiberUseCount.has(f.id)).length;
  return {
    over_spliced_fibers: overSpliced,
    over_capacity_trays: overCapacity,
    unspliced_fiber_count: unspliced,
    total_fibers: fibers.length,
    total_splices: splices.length,
  };
}

async function _loadProjectForExport(pool, projectId) {
  const proj = await pool.query(`SELECT * FROM splice_projects WHERE id = $1`, [projectId]);
  if (!proj.rows.length) return null;
  const [locations, cables, tubes, fibers, closures, trays, splices, ribbonGroups] =
    await Promise.all([
      pool.query(`SELECT * FROM splice_locations  WHERE project_id = $1 ORDER BY sequence_index, name`, [projectId]),
      pool.query(`SELECT * FROM splice_cables     WHERE project_id = $1 ORDER BY name`, [projectId]),
      pool.query(`
        SELECT t.* FROM splice_buffer_tubes t
        JOIN splice_cables c ON c.id = t.cable_id
        WHERE c.project_id = $1
        ORDER BY t.cable_id, t.position
      `, [projectId]),
      pool.query(`
        SELECT f.* FROM splice_fibers f
        JOIN splice_buffer_tubes t ON t.id = f.buffer_tube_id
        JOIN splice_cables c ON c.id = t.cable_id
        WHERE c.project_id = $1
        ORDER BY f.buffer_tube_id, f.position
      `, [projectId]),
      pool.query(`
        SELECT cl.*, l.name AS location_name
        FROM splice_closures cl
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
        ORDER BY l.sequence_index, l.name, cl.created_at
      `, [projectId]),
      pool.query(`
        SELECT t.* FROM splice_trays t
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
        ORDER BY t.closure_id, t.position
      `, [projectId]),
      pool.query(`
        SELECT s.* FROM splices s
        JOIN splice_trays t ON t.id = s.tray_id
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
        ORDER BY s.created_at
      `, [projectId]),
      pool.query(`
        SELECT g.* FROM splice_ribbon_groups g
        JOIN splice_trays t ON t.id = g.tray_id
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
        ORDER BY g.created_at
      `, [projectId]),
    ]);
  return {
    project: proj.rows[0],
    locations:    locations.rows,
    cables:       cables.rows,
    buffer_tubes: tubes.rows,
    fibers:       fibers.rows,
    closures:     closures.rows,
    trays:        trays.rows,
    splices:      splices.rows,
    ribbon_groups: ribbonGroups.rows,
  };
}

function _esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _safeFilename(s) {
  return String(s || 'splice')
    .replace(/[^a-zA-Z0-9_\- ]+/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'splice';
}

// Renders the splicer field document. Cover page with project metadata +
// per-closure pages with a tray-by-tray table of splices showing both
// fibers' cable name + tube color + fiber color + position.
function _renderSpliceHtml(data, pageSize) {
  const { project, locations, cables, buffer_tubes, fibers, closures, trays, splices, ribbon_groups } = data;

  const fiberById = new Map(fibers.map(f => [f.id, f]));
  const tubeById  = new Map(buffer_tubes.map(t => [t.id, t]));
  const cableById = new Map(cables.map(c => [c.id, c]));
  const closureById = new Map(closures.map(c => [c.id, c]));
  const locationById = new Map(locations.map(l => [l.id, l]));
  const ribbonGroupById = new Map(ribbon_groups.map(g => [g.id, g]));
  const traysByClosure = new Map();
  for (const t of trays) {
    if (!traysByClosure.has(t.closure_id)) traysByClosure.set(t.closure_id, []);
    traysByClosure.get(t.closure_id).push(t);
  }
  const splicesByTray = new Map();
  for (const s of splices) {
    if (!splicesByTray.has(s.tray_id)) splicesByTray.set(s.tray_id, []);
    splicesByTray.get(s.tray_id).push(s);
  }

  function describeFiber(fiberId) {
    const f = fiberById.get(fiberId);
    if (!f) return { cable: '?', tube: '?', tube_position: '?', color: '?', position: '?' };
    const tube = tubeById.get(f.buffer_tube_id);
    const cable = tube ? cableById.get(tube.cable_id) : null;
    return {
      cable: cable?.name || '?',
      tube_color: tube?.color || '?',
      tube_position: tube?.position ?? '?',
      color: f.color,
      position: f.position,
    };
  }

  function rowForSplice(s) {
    const a = describeFiber(s.fiber_a_id);
    const b = describeFiber(s.fiber_b_id);
    return `
      <tr>
        <td>${_esc(a.cable)}</td>
        <td>${_esc(a.tube_color)} <span class="muted">(${a.tube_position})</span></td>
        <td>${_esc(a.color)} <span class="muted">(${a.position})</span></td>
        <td class="arrow">→</td>
        <td>${_esc(b.cable)}</td>
        <td>${_esc(b.tube_color)} <span class="muted">(${b.tube_position})</span></td>
        <td>${_esc(b.color)} <span class="muted">(${b.position})</span></td>
        <td>${_esc(s.splice_type)}${s.ribbon_group_id ? ' <span class="ribbon-tag">ribbon</span>' : ''}</td>
      </tr>`;
  }

  // Cover page summary metrics.
  const totalCables   = cables.length;
  const totalFibers   = fibers.length;
  const totalSplices  = splices.length;
  const totalRibbons  = ribbon_groups.length;
  const totalClosures = closures.length;

  const coverCableRows = cables.map(c => {
    const fromName = c.from_location_id ? (locationById.get(c.from_location_id)?.name || '?') : '—';
    const toName   = c.to_location_id   ? (locationById.get(c.to_location_id)?.name   || '?') : '—';
    return `<tr>
      <td>${_esc(c.name)}</td>
      <td>${_esc(c.fiber_count)}</td>
      <td>${_esc(c.construction_type)}</td>
      <td>${_esc(fromName)} → ${_esc(toName)}</td>
      <td>${_esc(c.manufacturer_part || '')}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="5" class="empty">No cables</td></tr>`;

  // Per-closure pages.
  const closurePages = closures.map(cl => {
    const loc = locationById.get(cl.location_id);
    const trayList = (traysByClosure.get(cl.id) || []).sort((a, b) => a.position - b.position);
    const trayBlocks = trayList.map(t => {
      const inTray = (splicesByTray.get(t.id) || []);
      // Render ribbon-grouped splices first (compact ribbon line),
      // then individual splices.
      const grouped = new Map();
      const loose = [];
      for (const s of inTray) {
        if (s.ribbon_group_id) {
          if (!grouped.has(s.ribbon_group_id)) grouped.set(s.ribbon_group_id, []);
          grouped.get(s.ribbon_group_id).push(s);
        } else loose.push(s);
      }
      const ribbonRows = [...grouped.entries()].map(([gid, list]) => {
        const first = list[0];
        const a = describeFiber(first.fiber_a_id);
        const b = describeFiber(first.fiber_b_id);
        return `<tr class="ribbon-row">
          <td colspan="3"><b>${_esc(a.cable)}</b> tube <b>${_esc(a.tube_color)}</b> (12 fibers, ribbon)</td>
          <td class="arrow">⇒</td>
          <td colspan="3"><b>${_esc(b.cable)}</b> tube <b>${_esc(b.tube_color)}</b> (12 fibers, ribbon)</td>
          <td>${_esc(first.splice_type)} <span class="ribbon-tag">ribbon ×12</span></td>
        </tr>`;
      }).join('');
      const looseRows = loose.map(rowForSplice).join('');
      const totalUsed = inTray.length;
      const cap = cl.tray_capacity;
      const overCap = totalUsed > cap;
      return `
        <div class="tray-block">
          <div class="tray-header">
            Tray ${t.position}
            <span class="muted">— ${totalUsed}/${cap} splices ${overCap ? '<span class="warn">(OVER CAPACITY)</span>' : ''}</span>
          </div>
          ${(ribbonRows || looseRows) ? `
          <table class="splice-table">
            <thead><tr>
              <th colspan="3">Side A</th>
              <th></th>
              <th colspan="3">Side B</th>
              <th>Type</th>
            </tr><tr class="sub">
              <th>Cable</th><th>Tube</th><th>Fiber</th>
              <th></th>
              <th>Cable</th><th>Tube</th><th>Fiber</th>
              <th></th>
            </tr></thead>
            <tbody>${ribbonRows}${looseRows}</tbody>
          </table>` : `<div class="empty">No splices in this tray</div>`}
        </div>`;
    }).join('');
    return `
      <section class="page closure-page">
        <header class="page-header">
          <div class="title">${_esc(cl.location_name || loc?.name || 'Location')}
            <span class="subtitle">— Closure ${cl.model ? '· ' + _esc(cl.model) : ''}</span>
          </div>
          <div class="meta">${_esc(cl.tray_count)} trays × ${_esc(cl.tray_capacity)} cap</div>
        </header>
        ${trayBlocks || '<div class="empty">No trays</div>'}
      </section>`;
  }).join('') || `<section class="page"><div class="empty">No closures placed yet</div></section>`;

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>Splice Plan — ${_esc(project.name)}</title>
<style>
  @page { size: ${_esc(pageSize)}; margin: 0; }
  *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
  body{color:#222;font-size:11px;line-height:1.4}
  .page{padding:0.4in 0.4in 0.6in;page-break-after:always;min-height:99%}
  .page:last-child{page-break-after:auto}
  .cover{padding:0.6in 0.6in}
  h1{font-size:24px;margin-bottom:6px}
  h2{font-size:15px;margin:14px 0 6px;border-bottom:2px solid #1B5FA0;padding-bottom:4px;color:#1B5FA0}
  .cover-meta{color:#555;font-size:12px;margin-bottom:8px}
  .summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:18px 0}
  .stat{background:#F5F7FA;border:1px solid #DEE2E6;border-radius:6px;padding:10px;text-align:center}
  .stat .num{font-size:22px;font-weight:700;color:#1B5FA0}
  .stat .lbl{font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#6C757D;margin-top:4px}
  table{border-collapse:collapse;width:100%;font-size:10.5px}
  th,td{border:1px solid #DEE2E6;padding:5px 6px;text-align:left;vertical-align:top}
  th{background:#F5F7FA;font-weight:600}
  th.sub, tr.sub th{font-size:9.5px;font-weight:600;background:#FAFBFD}
  .splice-table .arrow,.cover-table .arrow{text-align:center;color:#1B5FA0;font-weight:700}
  .muted{color:#6C757D;font-size:9.5px}
  .empty{color:#6C757D;font-style:italic;padding:8px}
  .warn{color:#DC3545;font-weight:600;text-transform:uppercase;font-size:9.5px}
  .ribbon-tag{display:inline-block;padding:1px 5px;background:#E8F0FB;color:#1B5FA0;border-radius:3px;font-size:9px;font-weight:600;margin-left:4px}
  .ribbon-row td{background:#FAFBFD}
  .page-header{margin-bottom:10px;border-bottom:2px solid #1B5FA0;padding-bottom:6px}
  .page-header .title{font-size:18px;font-weight:700;color:#1B5FA0}
  .page-header .subtitle{font-weight:400;color:#555;font-size:13px}
  .page-header .meta{font-size:10px;color:#6C757D;margin-top:2px}
  .tray-block{margin-bottom:14px}
  .tray-header{font-size:13px;font-weight:600;margin-bottom:4px;padding:4px 8px;background:#1B5FA0;color:#fff;border-radius:3px}
  .footer{position:fixed;bottom:0.2in;left:0.4in;right:0.4in;font-size:9px;color:#6C757D;border-top:1px solid #DEE2E6;padding-top:4px;display:flex;justify-content:space-between}
</style></head><body>

<section class="page cover">
  <h1>Splice Plan: ${_esc(project.name)}</h1>
  <div class="cover-meta">
    Generated ${new Date().toISOString().slice(0,10)}${project.notes ? ' · ' + _esc(project.notes) : ''}
  </div>
  <div class="summary">
    <div class="stat"><div class="num">${totalCables}</div><div class="lbl">Cables</div></div>
    <div class="stat"><div class="num">${totalFibers}</div><div class="lbl">Fibers</div></div>
    <div class="stat"><div class="num">${totalClosures}</div><div class="lbl">Closures</div></div>
    <div class="stat"><div class="num">${totalSplices}</div><div class="lbl">Splices</div></div>
    <div class="stat"><div class="num">${totalRibbons}</div><div class="lbl">Ribbon groups</div></div>
  </div>
  <h2>Cables</h2>
  <table class="cover-table">
    <thead><tr><th>Name</th><th>Fibers</th><th>Construction</th><th>Route</th><th>Mfr Part</th></tr></thead>
    <tbody>${coverCableRows}</tbody>
  </table>
</section>

${closurePages}

<div class="footer">
  <span>Splice Plan: ${_esc(project.name)}</span>
  <span>Launch Fiber Services</span>
</div>
</body></html>`;
}
