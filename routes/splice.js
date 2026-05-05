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

const crypto = require('crypto');

// Public-facing base URL for QR codes. Set SPLICE_PUBLIC_URL on the
// splice Railway service ("https://launchfiber-splicematrix.xyz"). If
// unset, QR codes fall back to a deep link without a domain — the QR
// still scans, but to a relative URL that only works on the splice
// portal itself.
const SPLICE_PUBLIC_URL = (process.env.SPLICE_PUBLIC_URL || '').replace(/\/+$/, '');

// Lazy QR-code require — falls back to omitting QR codes if the
// package wasn't installed (e.g. on a misconfigured Railway build).
// Marker value `false` distinguishes "tried and failed" from "not yet
// attempted."
let _qrcode = null;
function _qr() {
  if (_qrcode === false) return null;
  if (_qrcode) return _qrcode;
  try { _qrcode = require('qrcode'); }
  catch (e) {
    console.warn('[splice] qrcode package missing; PDF will skip QR codes:', e.message);
    _qrcode = false;
    return null;
  }
  return _qrcode;
}

async function _renderQrSvg(text, size = 96) {
  const qr = _qr();
  if (!qr) return '';
  try {
    return await qr.toString(text, { type: 'svg', margin: 0, width: size });
  } catch (e) {
    return '';
  }
}

// Stable 7-char hash of the splice graph used as a "generation hash" in
// the PDF footer. Anyone in the field comparing two prints can spot at
// a glance whether they're working from the same revision.
function _generationHash(data) {
  const stable = JSON.stringify({
    cables: data.cables.map(c => ({ id: c.id, name: c.name, fc: c.fiber_count, ct: c.construction_type })),
    locations: data.locations.map(l => ({ id: l.id, name: l.name, t: l.type })),
    closures: data.closures.map(c => ({ id: c.id, m: c.model, tc: c.tray_count, cap: c.tray_capacity })),
    splices: data.splices.map(s => ({ a: s.fiber_a_id, b: s.fiber_b_id, t: s.tray_id, rg: s.ribbon_group_id })),
  });
  return crypto.createHash('sha1').update(stable).digest('hex').slice(0, 7);
}

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

      const [locations, cables, tubes, fibers, closures, trays, splices, ribbonGroups, strandStates] =
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
          pool.query(`
            SELECT s.* FROM splice_strand_states s
            JOIN splice_cables c ON c.id = s.cable_id
            WHERE c.project_id = $1
            ORDER BY c.name, s.location_id, s.strand_position
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
        strand_states: strandStates.rows,
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

  // ─── Strand states (ring-cut three-lane model) ───────────────────────────
  // Each strand at a location is express / spliced / stored. Splice rows
  // are the source of truth for 'spliced'; this table holds explicit
  // overrides for 'express' and 'stored' decisions. See migration
  // 0007_splice_strand_state.sql for the rationale.

  app.get('/api/splice/projects/:id/strand-states', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT s.*
         FROM splice_strand_states s
         JOIN splice_cables c ON c.id = s.cable_id
         WHERE c.project_id = $1
         ORDER BY c.name, s.location_id, s.strand_position`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Bulk upsert: pass an array of { strand_position, state, stored_length_inches?, notes? }
  // for a given cable + location. Idempotent — repeated calls overwrite
  // prior decisions for the same (cable, location, strand_position).
  app.post('/api/splice/cables/:cableId/locations/:locationId/strand-states', requireAuth(), async (req, res) => {
    const { strands } = req.body;
    if (!Array.isArray(strands) || !strands.length) {
      return res.status(400).json({ error: 'strands array is required' });
    }
    for (const s of strands) {
      if (!s || typeof s.strand_position !== 'number') {
        return res.status(400).json({ error: 'Each strand must have a numeric strand_position' });
      }
      if (!['express', 'spliced', 'stored'].includes(s.state)) {
        return res.status(400).json({ error: `Invalid state "${s.state}" — must be express, spliced, or stored` });
      }
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Verify cable + location are in the same project (don't let a
      // request silently scope-cross).
      const { rows: cable } = await client.query(
        `SELECT project_id FROM splice_cables WHERE id = $1`,
        [req.params.cableId]
      );
      const { rows: loc } = await client.query(
        `SELECT project_id FROM splice_locations WHERE id = $1`,
        [req.params.locationId]
      );
      if (!cable.length || !loc.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Cable or location not found' });
      }
      if (cable[0].project_id !== loc[0].project_id) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Cable and location belong to different projects' });
      }
      const inserted = [];
      for (const s of strands) {
        const { rows } = await client.query(
          `INSERT INTO splice_strand_states
             (cable_id, location_id, strand_position, state, stored_length_inches, notes)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (cable_id, location_id, strand_position) DO UPDATE SET
             state = EXCLUDED.state,
             stored_length_inches = EXCLUDED.stored_length_inches,
             notes = EXCLUDED.notes,
             updated_at = NOW()
           RETURNING *`,
          [req.params.cableId, req.params.locationId, s.strand_position, s.state,
           s.stored_length_inches ?? null, s.notes ?? null]
        );
        inserted.push(rows[0]);
      }
      await client.query('COMMIT');
      _bumpProjectMtime(pool, cable[0].project_id);
      _broadcast(cable[0].project_id, 'strand_states_updated', {
        cable_id: req.params.cableId, location_id: req.params.locationId,
        count: inserted.length,
      });
      res.json({ ok: true, strand_states: inserted });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  app.delete('/api/splice/strand-states/:id', requireAuth(), async (req, res) => {
    try {
      const cur = await pool.query(
        `SELECT s.id, c.project_id
         FROM splice_strand_states s
         JOIN splice_cables c ON c.id = s.cable_id
         WHERE s.id = $1`,
        [req.params.id]
      );
      if (!cur.rows.length) return res.status(404).json({ error: 'Strand state not found' });
      await pool.query(`DELETE FROM splice_strand_states WHERE id = $1`, [req.params.id]);
      _bumpProjectMtime(pool, cur.rows[0].project_id);
      _broadcast(cur.rows[0].project_id, 'strand_state_deleted', { id: req.params.id });
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
      const html = await _renderSpliceHtml(data, req.query.page_size || 'Tabloid');
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
      const html = await _renderSpliceHtml(data, pageSize);
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
  const [locations, cables, tubes, fibers, closures, trays, splices, ribbonGroups, strandStates] =
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
      pool.query(`
        SELECT s.* FROM splice_strand_states s
        JOIN splice_cables c ON c.id = s.cable_id
        WHERE c.project_id = $1
        ORDER BY c.name, s.location_id, s.strand_position
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
    strand_states: strandStates.rows,
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

// Renders the splicer field document. Async because per-closure QR codes
// are awaited before composition. Cover page carries project metadata +
// revision block; per-closure pages render tray-by-tray tables with
// fiber color swatches + as-built markup columns + signature line; QR
// code per closure links to the public deep link (splicer scans to
// upload field markup; full public-token flow lands in Phase 2B #7).
async function _renderSpliceHtml(data, pageSize) {
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

  // Pre-render QR codes for every closure in parallel. Each QR points
  // at a deep link to the splice editor (project + closure params).
  // When Phase 2B #7 lands, swap the URL pattern for /field/:token.
  const qrPromises = closures.map(cl => {
    const url = SPLICE_PUBLIC_URL
      ? `${SPLICE_PUBLIC_URL}/?project=${project.id}&closure=${cl.id}`
      : `/?project=${project.id}&closure=${cl.id}`;
    return _renderQrSvg(url, 84).then(svg => [cl.id, svg]);
  });
  const qrByClosureId = new Map(await Promise.all(qrPromises));

  // Generation hash — splicers can compare prints in the field at a
  // glance to confirm they're working from the same revision.
  const genHash = _generationHash(data);
  const todayIso = new Date().toISOString().slice(0, 10);

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

  // Color swatch + name. Black-and-white printers, colorblind splicers,
  // and dim flashlights all benefit from BOTH being on the page.
  function colorChip(name) {
    return `<span class="chip chip-${_esc(name)}"></span>${_esc(name)}`;
  }

  function rowForSplice(s) {
    const a = describeFiber(s.fiber_a_id);
    const b = describeFiber(s.fiber_b_id);
    return `
      <tr>
        <td>${_esc(a.cable)}</td>
        <td>${colorChip(a.tube_color)} <span class="muted">${a.tube_position}</span></td>
        <td>${colorChip(a.color)} <span class="muted">${a.position}</span></td>
        <td class="arrow">→</td>
        <td>${_esc(b.cable)}</td>
        <td>${colorChip(b.tube_color)} <span class="muted">${b.tube_position}</span></td>
        <td>${colorChip(b.color)} <span class="muted">${b.position}</span></td>
        <td>${_esc(s.splice_type)}</td>
        <td class="markup-loss">&nbsp;</td>
        <td class="markup-notes">&nbsp;</td>
      </tr>`;
  }

  // Cover page summary metrics.
  const totalCables   = cables.length;
  const totalFibers   = fibers.length;
  const totalSplices  = splices.length;
  const totalRibbons  = ribbon_groups.length;
  const totalClosures = closures.length;
  const designerName = project.designer_name || '—';

  const coverCableRows = cables.map(c => {
    const fromName = c.from_location_id ? (locationById.get(c.from_location_id)?.name || '?') : '—';
    const toName   = c.to_location_id   ? (locationById.get(c.to_location_id)?.name   || '?') : '—';
    return `<tr>
      <td>${_esc(c.name)}</td>
      <td class="num">${_esc(c.fiber_count)}</td>
      <td>${_esc(c.construction_type)}</td>
      <td>${_esc(fromName)} → ${_esc(toName)}</td>
      <td>${_esc(c.manufacturer_part || '')}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="5" class="empty">No cables</td></tr>`;

  const coverLocationRows = locations
    .slice()
    .sort((a, b) => (a.sequence_index || 0) - (b.sequence_index || 0) || a.name.localeCompare(b.name))
    .map(l => {
      const closureCount = closures.filter(c => c.location_id === l.id).length;
      const cableCount = cables.filter(c =>
        c.from_location_id === l.id || c.to_location_id === l.id
      ).length;
      return `<tr>
        <td class="num">${_esc(l.sequence_index ?? 0)}</td>
        <td>${_esc(l.name)}</td>
        <td>${_esc(l.type)}</td>
        <td class="num">${closureCount}</td>
        <td class="num">${cableCount}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="empty">No locations</td></tr>`;

  // Index strand states by closure (via location_id) so each per-closure
  // page can render its own stored / express counts.
  const strandStatesByLocation = new Map();
  for (const ss of (data.strand_states || [])) {
    if (!strandStatesByLocation.has(ss.location_id)) strandStatesByLocation.set(ss.location_id, []);
    strandStatesByLocation.get(ss.location_id).push(ss);
  }

  // Per-closure pages.
  const closurePages = closures.map(cl => {
    const loc = locationById.get(cl.location_id);
    const trayList = (traysByClosure.get(cl.id) || []).sort((a, b) => a.position - b.position);
    const qr = qrByClosureId.get(cl.id) || '';

    // Stored strands at this location, grouped by cable. The PDF needs
    // these prominently — splicers cut + coil these strands without
    // splicing. Phase 2A #3 ring-cut model.
    const ssAtLoc = (strandStatesByLocation.get(cl.location_id) || [])
      .filter(s => s.state === 'stored');
    const storedByCableId = new Map();
    for (const s of ssAtLoc) {
      if (!storedByCableId.has(s.cable_id)) storedByCableId.set(s.cable_id, []);
      storedByCableId.get(s.cable_id).push(s);
    }
    const storedSection = storedByCableId.size ? `
      <div class="stored-section">
        <div class="section-title">Stored strands at this closure
          <span class="muted">— cut and coiled, do NOT splice</span>
        </div>
        ${[...storedByCableId.entries()].map(([cableId, list]) => {
          const cable = cableById.get(cableId);
          const sorted = list.sort((a, b) => a.strand_position - b.strand_position);
          return `
            <table class="stored-table">
              <thead><tr>
                <th>Cable</th>
                <th class="num">Strand</th>
                <th>Tube color</th>
                <th>Fiber color</th>
                <th class="num">Slack (in)</th>
                <th>Notes</th>
                <th class="markup-loss">Confirmed</th>
              </tr></thead>
              <tbody>
                ${sorted.map(s => {
                  const tubePos = Math.floor((s.strand_position - 1) / 12) + 1;
                  const fiberPos = ((s.strand_position - 1) % 12) + 1;
                  const tubeColor = TIA_598_COLORS[(tubePos - 1) % 12];
                  const fiberColor = TIA_598_COLORS[fiberPos - 1];
                  return `<tr>
                    <td><b>${_esc(cable?.name || '?')}</b></td>
                    <td class="num">${s.strand_position}</td>
                    <td>${colorChip(tubeColor)} <span class="muted">${tubePos}</span></td>
                    <td>${colorChip(fiberColor)} <span class="muted">${fiberPos}</span></td>
                    <td class="num">${s.stored_length_inches ?? '—'}</td>
                    <td>${_esc(s.notes || '')}</td>
                    <td class="markup-loss">&nbsp;</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          `;
        }).join('')}
      </div>
    ` : '';

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
          <td colspan="3"><b>${_esc(a.cable)}</b> · tube ${colorChip(a.tube_color)} <span class="muted">(12 fibers, ribbon)</span></td>
          <td class="arrow">⇒</td>
          <td colspan="3"><b>${_esc(b.cable)}</b> · tube ${colorChip(b.tube_color)} <span class="muted">(12 fibers, ribbon)</span></td>
          <td>${_esc(first.splice_type)} <span class="ribbon-tag">×12</span></td>
          <td class="markup-loss">&nbsp;</td>
          <td class="markup-notes">&nbsp;</td>
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
            <span class="tray-meta">${totalUsed} / ${cap} splices ${overCap ? '<span class="warn">— OVER CAPACITY</span>' : ''}</span>
          </div>
          ${(ribbonRows || looseRows) ? `
          <table class="splice-table">
            <colgroup>
              <col style="width:11%"><col style="width:10%"><col style="width:8%">
              <col style="width:3%">
              <col style="width:11%"><col style="width:10%"><col style="width:8%">
              <col style="width:8%">
              <col style="width:9%"><col style="width:22%">
            </colgroup>
            <thead><tr>
              <th colspan="3">Side A</th>
              <th></th>
              <th colspan="3">Side B</th>
              <th rowspan="2">Type</th>
              <th rowspan="2">Loss<br>(dB)</th>
              <th rowspan="2">As-built notes</th>
            </tr><tr class="sub">
              <th>Cable</th><th>Tube</th><th>Fiber</th>
              <th></th>
              <th>Cable</th><th>Tube</th><th>Fiber</th>
            </tr></thead>
            <tbody>${ribbonRows}${looseRows}</tbody>
          </table>` : `<div class="empty">No splices in this tray</div>`}
        </div>`;
    }).join('');

    return `
      <section class="page closure-page">
        <header class="page-header">
          <div class="page-header-text">
            <div class="title">${_esc(cl.location_name || loc?.name || 'Location')}
              <span class="subtitle">${cl.model ? '· ' + _esc(cl.model) : ''}</span>
            </div>
            <div class="meta">
              ${_esc(cl.tray_count)} trays × ${_esc(cl.tray_capacity)} capacity
              · Closure ID <span class="mono">${_esc(cl.id.slice(0, 8))}</span>
              ${cl.notes ? '· ' + _esc(cl.notes) : ''}
            </div>
          </div>
          ${qr ? `<div class="qr">${qr}<div class="qr-cap">scan to upload<br>field markup</div></div>` : ''}
        </header>
        ${storedSection}
        ${trayBlocks || '<div class="empty">No trays</div>'}
        <div class="signoff">
          <div class="signoff-row">
            <div class="signoff-cell"><div class="signoff-line">&nbsp;</div><div class="signoff-label">Splicer name (print)</div></div>
            <div class="signoff-cell"><div class="signoff-line">&nbsp;</div><div class="signoff-label">Signature</div></div>
            <div class="signoff-cell narrow"><div class="signoff-line">&nbsp;</div><div class="signoff-label">Date</div></div>
            <div class="signoff-cell narrow"><div class="signoff-line">&nbsp;</div><div class="signoff-label">Closure photo? (Y / N)</div></div>
          </div>
        </div>
      </section>`;
  }).join('') || `<section class="page"><div class="empty">No closures placed yet</div></section>`;

  // Color hex map for the swatches. Same TIA-598 palette used in the
  // canvas; embedded inline so the PDF renders correctly without an
  // external stylesheet.
  const colorCss = `
    .chip-blue   {background:#1660C9}
    .chip-orange {background:#E67E22}
    .chip-green  {background:#27AE60}
    .chip-brown  {background:#8B5A2B}
    .chip-slate  {background:#7F8C8D}
    .chip-white  {background:#F5F5F5;border:1px solid #999}
    .chip-red    {background:#C0392B}
    .chip-black  {background:#000}
    .chip-yellow {background:#F1C40F}
    .chip-violet {background:#8E44AD}
    .chip-rose   {background:#E91E63}
    .chip-aqua   {background:#1ABC9C}
  `;

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>Splice Plan — ${_esc(project.name)}</title>
<style>
  @page { size: ${_esc(pageSize)}; margin: 0; }
  @page :first { margin: 0; }
  *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
  body{color:#222;font-size:10.5px;line-height:1.4;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{padding:0.4in 0.4in 0.7in;page-break-after:always;min-height:99%;position:relative}
  .page:last-child{page-break-after:auto}
  .cover{padding:0.7in 0.7in}
  h1{font-size:26px;margin-bottom:4px;color:#0F3D66;letter-spacing:-0.3px}
  h2{font-size:14px;margin:18px 0 6px;border-bottom:2px solid #1B5FA0;padding-bottom:4px;color:#1B5FA0;text-transform:uppercase;letter-spacing:0.5px}
  .cover-meta{color:#555;font-size:11px;margin-bottom:14px}

  /* Revision block — engineering-firm style: rev / project / designer / date / hash */
  .rev-block{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;margin-bottom:14px;border:1px solid #1B5FA0;border-radius:4px;overflow:hidden}
  .rev-block .cell{padding:6px 10px;border-right:1px solid #DEE2E6;border-bottom:1px solid #DEE2E6}
  .rev-block .cell:nth-child(4n){border-right:none}
  .rev-block .cell:nth-last-child(-n+4){border-bottom:none}
  .rev-block .lbl{font-size:8.5px;text-transform:uppercase;letter-spacing:0.6px;color:#6C757D;margin-bottom:2px;font-weight:600}
  .rev-block .val{font-size:12.5px;font-weight:600;color:#0F3D66}
  .rev-block .val.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}

  .summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:18px 0}
  .stat{background:#F5F7FA;border:1px solid #DEE2E6;border-radius:6px;padding:10px;text-align:center}
  .stat .num{font-size:22px;font-weight:700;color:#1B5FA0;font-variant-numeric:tabular-nums}
  .stat .lbl{font-size:9.5px;text-transform:uppercase;letter-spacing:0.5px;color:#6C757D;margin-top:4px}

  table{border-collapse:collapse;width:100%;font-size:10px}
  th,td{border:1px solid #DEE2E6;padding:5px 6px;text-align:left;vertical-align:middle}
  th{background:#F5F7FA;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;font-size:9px}
  th.sub, tr.sub th{font-size:9px;font-weight:600;background:#FAFBFD}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  .splice-table{table-layout:fixed}
  .splice-table .arrow,.cover-table .arrow{text-align:center;color:#1B5FA0;font-weight:700;font-size:13px}
  .splice-table td{font-size:10px;padding:5px 5px}
  .markup-loss,.markup-notes{background:repeating-linear-gradient(135deg,#fff,#fff 4px,#FAFBFD 4px,#FAFBFD 8px);min-height:20px}

  .muted{color:#6C757D;font-size:9.5px;font-variant-numeric:tabular-nums}
  .empty{color:#6C757D;font-style:italic;padding:8px;text-align:center}
  .warn{color:#DC3545;font-weight:700;text-transform:uppercase;font-size:9px}
  .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px}

  /* Color swatches — printed alongside color names. */
  .chip{display:inline-block;width:9px;height:9px;border-radius:50%;border:0.5px solid #999;margin-right:4px;vertical-align:-1px}
  ${colorCss}

  .ribbon-tag{display:inline-block;padding:1px 5px;background:#E8F0FB;color:#1B5FA0;border-radius:3px;font-size:9px;font-weight:700;margin-left:4px;letter-spacing:0.4px}
  .ribbon-row td{background:#FAFBFD}

  /* Per-closure page header: title block on the left, QR on the right. */
  .page-header{margin-bottom:10px;border-bottom:2px solid #1B5FA0;padding-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:14px}
  .page-header-text{flex:1;min-width:0}
  .page-header .title{font-size:19px;font-weight:700;color:#0F3D66;letter-spacing:-0.2px}
  .page-header .subtitle{font-weight:400;color:#555;font-size:14px;font-style:italic}
  .page-header .meta{font-size:10px;color:#6C757D;margin-top:3px;line-height:1.4}
  .qr{text-align:center;flex-shrink:0}
  .qr svg{display:block;width:84px;height:84px}
  .qr-cap{font-size:8px;color:#6C757D;margin-top:2px;text-transform:uppercase;letter-spacing:0.4px;line-height:1.2}

  /* Stored-strands section above the tray blocks. */
  .stored-section{margin-bottom:14px;page-break-inside:avoid;border:1px solid #FFC107;border-radius:4px;padding:8px;background:#FFFAEC}
  .stored-section .section-title{font-size:13px;font-weight:700;color:#856404;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.4px}
  .stored-section .section-title .muted{font-weight:500;text-transform:none;letter-spacing:0;color:#6C757D}
  .stored-table{margin-bottom:6px}
  .stored-table th{background:#FFF3CD}

  .tray-block{margin-bottom:14px;page-break-inside:avoid}
  .tray-header{font-size:13px;font-weight:700;margin-bottom:0;padding:5px 10px;background:#1B5FA0;color:#fff;border-radius:3px 3px 0 0;display:flex;justify-content:space-between;align-items:center}
  .tray-header .tray-meta{font-size:10px;font-weight:500;opacity:0.85;text-transform:uppercase;letter-spacing:0.4px}
  .tray-block .splice-table{border-radius:0 0 3px 3px}

  /* Sign-off block at the bottom of every closure page. */
  .signoff{margin-top:14px;page-break-inside:avoid;border-top:1px solid #CED4DA;padding-top:10px}
  .signoff-row{display:grid;grid-template-columns:2fr 2fr 1fr 1fr;gap:14px}
  .signoff-cell .signoff-line{border-bottom:1px solid #222;height:18px;margin-bottom:2px}
  .signoff-cell .signoff-label{font-size:8.5px;text-transform:uppercase;letter-spacing:0.4px;color:#6C757D}

  /* Page footer fixed to every page bottom — project, hash, page numbers. */
  .footer{position:fixed;bottom:0.18in;left:0.4in;right:0.4in;font-size:8.5px;color:#6C757D;border-top:1px solid #DEE2E6;padding-top:4px;display:flex;justify-content:space-between;align-items:center}
  .footer .center{text-align:center}
  .footer .gen-hash{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
</style></head><body>

<section class="page cover">
  <h1>Splice Plan</h1>
  <div class="cover-meta">${_esc(project.name)}</div>

  <div class="rev-block">
    <div class="cell"><div class="lbl">Project</div><div class="val">${_esc(project.name)}</div></div>
    <div class="cell"><div class="lbl">Designer</div><div class="val">${_esc(designerName)}</div></div>
    <div class="cell"><div class="lbl">Generated</div><div class="val">${todayIso}</div></div>
    <div class="cell"><div class="lbl">Revision hash</div><div class="val mono">${genHash}</div></div>
    <div class="cell"><div class="lbl">Status</div><div class="val">${_esc(project.status || 'active')}</div></div>
    <div class="cell"><div class="lbl">Closures</div><div class="val">${totalClosures}</div></div>
    <div class="cell"><div class="lbl">Cables</div><div class="val">${totalCables}</div></div>
    <div class="cell"><div class="lbl">Total splices</div><div class="val">${totalSplices}</div></div>
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
    <thead><tr><th>Name</th><th class="num">Fibers</th><th>Construction</th><th>Route</th><th>Mfr Part</th></tr></thead>
    <tbody>${coverCableRows}</tbody>
  </table>

  <h2>Locations</h2>
  <table class="cover-table">
    <thead><tr><th class="num">Seq</th><th>Name</th><th>Type</th><th class="num">Closures</th><th class="num">Cables</th></tr></thead>
    <tbody>${coverLocationRows}</tbody>
  </table>

  ${project.notes ? `<h2>Project notes</h2><div style="white-space:pre-wrap;font-size:11px;color:#444">${_esc(project.notes)}</div>` : ''}
</section>

${closurePages}

<div class="footer">
  <span>${_esc(project.name)}</span>
  <span class="center">Launch Fiber Services · Splice Matrix</span>
  <span>Rev <span class="gen-hash">${genHash}</span> · ${todayIso}</span>
</div>
</body></html>`;
}
