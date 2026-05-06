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

// Phase 2B #7 — public field-markup uploads use multer memory storage
// (≤2MB cap, image MIME types only). The bytes go straight into
// Postgres BYTEA, so we never write to disk; the splice service has
// no Railway volume of its own. Lazy-loaded so a misconfigured
// container that lacks multer can still boot the rest of the splice
// service — the field-markup endpoints will return 500 with a clean
// error message instead of crashing at require time.
const FIELD_MARKUP_MAX_BYTES = 2 * 1024 * 1024;
let _fieldMarkupUpload = null;
function _getFieldMarkupUpload() {
  if (_fieldMarkupUpload) return _fieldMarkupUpload;
  let multer;
  try { multer = require('multer'); }
  catch (e) {
    throw new Error('multer not installed; field-markup upload unavailable. ' +
                    'Run `npm install multer`. Original: ' + e.message);
  }
  _fieldMarkupUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: FIELD_MARKUP_MAX_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
      if (!/^image\/(jpeg|jpg|png|webp|heic|heif)$/i.test(file.mimetype)) {
        return cb(new Error('Only JPEG, PNG, WebP, or HEIC images are accepted'));
      }
      cb(null, true);
    },
  });
  return _fieldMarkupUpload;
}

// Sliding-window IP rate limiter for the public upload endpoint. In-
// memory because the splice service runs as a single Railway replica
// and the field-markup volume is low (a splicer uploading at most a
// few photos per closure per day). If we ever scale horizontally,
// switch this to a Redis-backed limiter.
const _fieldMarkupRate = new Map(); // ip → array<timestamp ms>
const FIELD_MARKUP_LIMIT = 30;
const FIELD_MARKUP_WINDOW_MS = 60 * 1000;
function _fieldMarkupRateOk(ip) {
  if (!ip) return true;
  const now = Date.now();
  const cutoff = now - FIELD_MARKUP_WINDOW_MS;
  const arr = (_fieldMarkupRate.get(ip) || []).filter(t => t > cutoff);
  if (arr.length >= FIELD_MARKUP_LIMIT) {
    _fieldMarkupRate.set(ip, arr);
    return false;
  }
  arr.push(now);
  _fieldMarkupRate.set(ip, arr);
  return true;
}

// 24-char URL-safe token. crypto.randomBytes(18) → 24 base64url chars
// → ~10^32 possible values, plenty unguessable for a per-closure key
// without going overboard on length (printed QR codes get bigger
// fast as the encoded string grows).
function _mintFieldToken() {
  return crypto.randomBytes(18).toString('base64url');
}

// Phase 3B — lazy archiver require (matches puppeteer/multer pattern).
let _archiverMod = null;
function _getArchiver() {
  if (_archiverMod) return _archiverMod;
  try { _archiverMod = require('archiver'); }
  catch (e) {
    throw new Error('archiver not installed; KMZ export unavailable. ' +
                    'Run `npm install archiver`. Original: ' + e.message);
  }
  return _archiverMod;
}

module.exports = function installSpliceRoutes(app, pool, mw) {
  const { requireAuth } = mw;

  // ─── Projects ─────────────────────────────────────────────────────────────

  app.get('/api/splice/projects', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          p.*,
          s.name AS designer_name,
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
        `SELECT p.*, s.name AS designer_name,
                ls.name AS locked_by_full_name
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
    // Phase 3A — accept latitude/longitude on the generic PUT too, so the
    // edit-attributes modal can move a closure on a single submit. The
    // dedicated /coords endpoint below is for drag-on-map updates that
    // want a smaller payload.
    const allowed = ['type', 'name', 'sequence_index', 'notes', 'latitude', 'longitude'];
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

  // Phase 3A — drag-a-marker fast path. Drops the rest of the location
  // payload off the wire so a drag that fires on every mouse-move (if
  // we add live-drag in 3B) doesn't carry a kilobyte of metadata.
  app.put('/api/splice/locations/:id/coords', requireAuth(), async (req, res) => {
    const lat = req.body?.latitude;
    const lon = req.body?.longitude;
    // Allow null on either axis to clear the geographic placement
    // (e.g. designer realized this location is purely logical).
    const validLat = lat == null || (Number.isFinite(Number(lat)) && Math.abs(lat) <= 90);
    const validLon = lon == null || (Number.isFinite(Number(lon)) && Math.abs(lon) <= 180);
    if (!validLat || !validLon) {
      return res.status(400).json({ error: 'latitude must be in [-90,90], longitude in [-180,180]' });
    }
    try {
      const { rows } = await pool.query(
        `UPDATE splice_locations
            SET latitude = $2, longitude = $3
          WHERE id = $1
          RETURNING project_id, id, latitude, longitude`,
        [req.params.id, lat == null ? null : Number(lat), lon == null ? null : Number(lon)]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Location not found' });
      _bumpProjectMtime(pool, rows[0].project_id);
      _broadcast(rows[0].project_id, 'location_coords_changed', {
        location_id: rows[0].id,
        latitude: rows[0].latitude,
        longitude: rows[0].longitude,
      });
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

  // Phase 3A — set the geographic path of a cable. Body shape:
  //   { path_geojson: { type: 'LineString', coordinates: [[lon,lat],...] } }
  // Pass `null` to clear the path. Validation is deliberately loose: we
  // require LineString shape but don't reject sparse routes, single
  // segments, or self-crossing paths — designers eyeball the satellite
  // and we trust the result. The schema rejects anything that fails
  // JSONB parse on its way in.
  app.put('/api/splice/cables/:id/path', requireAuth(), async (req, res) => {
    const path = req.body?.path_geojson;
    if (path != null) {
      if (typeof path !== 'object' || path.type !== 'LineString' ||
          !Array.isArray(path.coordinates) || path.coordinates.length < 2) {
        return res.status(400).json({
          error: 'path_geojson must be a GeoJSON LineString with at least two coordinates',
        });
      }
      for (const pt of path.coordinates) {
        if (!Array.isArray(pt) || pt.length < 2 ||
            !Number.isFinite(pt[0]) || !Number.isFinite(pt[1]) ||
            Math.abs(pt[1]) > 90 || Math.abs(pt[0]) > 180) {
          return res.status(400).json({
            error: 'path_geojson coordinates must be [lon, lat] with lat in [-90,90], lon in [-180,180]',
          });
        }
      }
    }
    try {
      const { rows } = await pool.query(
        `UPDATE splice_cables SET path_geojson = $2::jsonb WHERE id = $1
         RETURNING id, project_id, path_geojson`,
        [req.params.id, path == null ? null : JSON.stringify(path)]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Cable not found' });
      _bumpProjectMtime(pool, rows[0].project_id);
      _broadcast(rows[0].project_id, 'cable_path_changed', {
        cable_id: rows[0].id, path_geojson: rows[0].path_geojson,
      });
      res.json(rows[0]);
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

  // ─── Strand metadata (circuit naming, Phase 2A #4) ───────────────────────

  app.put('/api/splice/fibers/:id', requireAuth(), async (req, res) => {
    const allowed = ['circuit_name', 'customer', 'notes'];
    const sets = [];
    const vals = [req.params.id];
    let i = 2;
    for (const f of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        let v = req.body[f];
        if (v === '') v = null;
        sets.push(`${f} = $${i++}`);
        vals.push(v);
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    try {
      const { rows } = await pool.query(
        `UPDATE splice_fibers SET ${sets.join(', ')} WHERE id = $1
         RETURNING id, buffer_tube_id, position, color, circuit_name, customer, notes`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'Fiber not found' });
      // Find the project_id via a 3-level join so we can broadcast.
      const proj = await pool.query(
        `SELECT c.project_id
         FROM splice_fibers f
         JOIN splice_buffer_tubes t ON t.id = f.buffer_tube_id
         JOIN splice_cables c ON c.id = t.cable_id
         WHERE f.id = $1`,
        [req.params.id]
      );
      const projectId = proj.rows[0]?.project_id;
      _bumpProjectMtime(pool, projectId);
      _broadcast(projectId, 'fiber_metadata_updated', { fiber: rows[0] });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Bulk update fibers — efficient for designers editing many circuit
  // names at once (e.g. an entire 144-fiber cable). Body is an array of
  // { id, circuit_name?, customer?, notes? }; each row updates only the
  // provided fields. Performed in a transaction so a partial failure
  // doesn't leave rows in a half-saved state.
  app.put('/api/splice/cables/:cableId/fiber-metadata', requireAuth(), async (req, res) => {
    const { fibers } = req.body;
    if (!Array.isArray(fibers) || !fibers.length) {
      return res.status(400).json({ error: 'fibers array is required' });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cable = await client.query(
        `SELECT project_id FROM splice_cables WHERE id = $1`,
        [req.params.cableId]
      );
      if (!cable.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Cable not found' });
      }
      // Verify each fiber belongs to this cable (defense against
      // cross-cable id smuggling).
      const valid = await client.query(
        `SELECT f.id FROM splice_fibers f
         JOIN splice_buffer_tubes t ON t.id = f.buffer_tube_id
         WHERE t.cable_id = $1`,
        [req.params.cableId]
      );
      const validIds = new Set(valid.rows.map(r => r.id));
      const updated = [];
      for (const f of fibers) {
        if (!validIds.has(f.id)) continue;
        const sets = [];
        const vals = [f.id];
        let i = 2;
        for (const field of ['circuit_name', 'customer', 'notes']) {
          if (Object.prototype.hasOwnProperty.call(f, field)) {
            let v = f[field];
            if (v === '') v = null;
            sets.push(`${field} = $${i++}`);
            vals.push(v);
          }
        }
        if (!sets.length) continue;
        const r = await client.query(
          `UPDATE splice_fibers SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
          vals
        );
        if (r.rows[0]) updated.push(r.rows[0]);
      }
      await client.query('COMMIT');
      _bumpProjectMtime(pool, cable.rows[0].project_id);
      _broadcast(cable.rows[0].project_id, 'fiber_metadata_bulk_updated', {
        cable_id: req.params.cableId, count: updated.length,
      });
      res.json({ ok: true, updated_count: updated.length });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
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

  // ─── Closure templates (Phase 2B #5) ─────────────────────────────────────
  // Reusable closure shells designers save once and apply across
  // projects. Sized config (tray_count, tray_capacity) plus optional
  // default splice pattern in default_splices_jsonb.
  //
  // scope_client_id NULL = global; set = only shows for that client's
  // projects. The list endpoint accepts ?client_id= to filter to
  // (global OR matching-client) templates.

  app.get('/api/splice/closure-templates', requireAuth(), async (req, res) => {
    try {
      const clientId = req.query.client_id || null;
      const { rows } = clientId
        ? await pool.query(
            `SELECT t.*, cl.name AS scope_client_name, s.name AS created_by_name
               FROM splice_closure_templates t
               LEFT JOIN clients cl ON cl.id = t.scope_client_id
               LEFT JOIN staff s   ON s.id  = t.created_by_staff_id
              WHERE t.scope_client_id IS NULL OR t.scope_client_id = $1
              ORDER BY t.scope_client_id NULLS FIRST, t.name`,
            [clientId]
          )
        : await pool.query(
            `SELECT t.*, cl.name AS scope_client_name, s.name AS created_by_name
               FROM splice_closure_templates t
               LEFT JOIN clients cl ON cl.id = t.scope_client_id
               LEFT JOIN staff s   ON s.id  = t.created_by_staff_id
              ORDER BY t.scope_client_id NULLS FIRST, t.name`
          );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/splice/closure-templates', requireAuth(), async (req, res) => {
    const {
      name, scope_client_id, model,
      tray_count = 6, tray_capacity = 12,
      default_splices, notes,
    } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    const tc  = Math.max(1, Number(tray_count)    || 6);
    const cap = Math.max(1, Number(tray_capacity) || 12);
    try {
      const { rows } = await pool.query(
        `INSERT INTO splice_closure_templates
           (name, scope_client_id, model, tray_count, tray_capacity,
            default_splices_jsonb, notes, created_by_staff_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          String(name).trim(),
          scope_client_id || null,
          model || null,
          tc, cap,
          default_splices ? JSON.stringify(default_splices) : null,
          notes || null,
          req.user?.staff_id || null,
        ]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/splice/closure-templates/:id', requireAuth(), async (req, res) => {
    const allowed = ['name', 'scope_client_id', 'model', 'tray_count',
                     'tray_capacity', 'default_splices_jsonb', 'notes'];
    const sets = [];
    const vals = [req.params.id];
    let i = 2;
    for (const f of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        // Map default_splices → JSON-stringified default_splices_jsonb.
        if (f === 'default_splices_jsonb') {
          sets.push(`${f} = $${i++}`);
          vals.push(req.body[f] == null ? null : JSON.stringify(req.body[f]));
        } else {
          sets.push(`${f} = $${i++}`);
          vals.push(req.body[f]);
        }
      }
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    sets.push(`updated_at = NOW()`);
    try {
      const { rows } = await pool.query(
        `UPDATE splice_closure_templates SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'Template not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/closure-templates/:id', requireAuth(), async (req, res) => {
    try {
      const r = await pool.query(`DELETE FROM splice_closure_templates WHERE id = $1`, [req.params.id]);
      if (!r.rowCount) return res.status(404).json({ error: 'Template not found' });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Apply a template to create a new closure at the given location.
  // Inserts a closure row, materializes its trays from tray_count, and
  // bumps the closure_models picklist (same side-effect as the regular
  // POST .../closures path so model names stay searchable).
  //
  // TODO Phase 2B #5b: also materialize default_splices_jsonb. Today
  // the JSONB is stored but the apply path only creates the closure +
  // trays. The splice replay needs a cable picker UI to bind template
  // slots to the closure's actual cables — which is bigger than this
  // shipping cut.
  app.post('/api/splice/locations/:locationId/closures/from-template/:templateId',
    requireAuth(), async (req, res) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const tpl = await client.query(
          `SELECT * FROM splice_closure_templates WHERE id = $1`,
          [req.params.templateId]
        );
        if (!tpl.rows.length) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Template not found' });
        }
        const t = tpl.rows[0];
        const loc = await client.query(
          `SELECT project_id FROM splice_locations WHERE id = $1`,
          [req.params.locationId]
        );
        if (!loc.rows.length) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Location not found' });
        }
        const closure = await client.query(
          `INSERT INTO splice_closures (location_id, model, tray_count, tray_capacity, notes)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [req.params.locationId, t.model || null, t.tray_count, t.tray_capacity, t.notes || null]
        );
        const trays = [];
        for (let p = 1; p <= t.tray_count; p++) {
          const tr = await client.query(
            `INSERT INTO splice_trays (closure_id, position) VALUES ($1, $2) RETURNING *`,
            [closure.rows[0].id, p]
          );
          trays.push(tr.rows[0]);
        }
        if (t.model && String(t.model).trim()) {
          await client.query(
            `INSERT INTO splice_closure_models (model, default_tray_count, default_tray_capacity, use_count, last_used_at)
             VALUES ($1, $2, $3, 1, NOW())
             ON CONFLICT (model) DO UPDATE SET
               use_count = splice_closure_models.use_count + 1,
               last_used_at = NOW(),
               default_tray_count    = EXCLUDED.default_tray_count,
               default_tray_capacity = EXCLUDED.default_tray_capacity`,
            [String(t.model).trim(), t.tray_count, t.tray_capacity]
          );
        }
        await client.query('COMMIT');
        _bumpProjectMtime(pool, loc.rows[0].project_id);
        _broadcast(loc.rows[0].project_id, 'closure_added', {
          closure: closure.rows[0], trays, from_template: t.id,
        });
        res.json({ closure: closure.rows[0], trays, template: t });
      } catch (e) {
        try { await client.query('ROLLBACK'); } catch {}
        res.status(500).json({ error: e.message });
      } finally {
        client.release();
      }
    });

  // POST /api/splice/projects/:id/clone — deep-copy a splice project
  // and every record under it (locations, cables, tubes, fibers,
  // closures, trays, splices, ribbon_groups, strand_states) into a
  // new project. Owner-spec use case: "I splice 144→144 straight-
  // through 80% of the time, scaffold the next project from last
  // month's." Cloning a 432-fiber tree fully would otherwise take
  // an hour of manual work.
  //
  // Body: { name?: string }  — optional name override; defaults to
  //                            "<source.name> (copy)".
  app.post('/api/splice/projects/:id/clone', requireAuth(), async (req, res) => {
    const sourceId = req.params.id;
    const requestedName = (req.body && req.body.name) ? String(req.body.name).trim() : null;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const src = await client.query(`SELECT * FROM splice_projects WHERE id = $1`, [sourceId]);
      if (!src.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Source project not found' });
      }
      const srcProj = src.rows[0];
      const newName = requestedName || `${srcProj.name} (copy)`;

      // 1. New project header. Designer attribution moves to the
      //    cloning user; lock state intentionally NOT carried over
      //    so the clone opens unlocked.
      const newProj = await client.query(
        `INSERT INTO splice_projects (name, designer_id, status, notes)
         VALUES ($1, $2, 'active', $3)
         RETURNING *`,
        [newName, req.user?.staff_id || null, srcProj.notes || null]
      );
      const newProjectId = newProj.rows[0].id;

      // 2. Locations — preserve sequence_index so the canvas layout
      //    matches the source.
      const locMap = new Map();   // oldId → newId
      const locRows = await client.query(
        `SELECT * FROM splice_locations WHERE project_id = $1 ORDER BY sequence_index, name`,
        [sourceId]
      );
      for (const l of locRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_locations (project_id, type, name, sequence_index, notes)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [newProjectId, l.type, l.name, l.sequence_index, l.notes]
        );
        locMap.set(l.id, r.rows[0].id);
      }

      // 3. Cables — remap from/to location FKs through locMap. Buffer
      //    tubes + fibers regenerate via the cable INSERT trigger... no,
      //    we have no trigger. We insert tubes + fibers explicitly so
      //    the FIBER IDS stay deterministic for the splice remap below.
      const cableMap = new Map();
      const tubeMap  = new Map();
      const fiberMap = new Map();
      const cableRows = await client.query(
        `SELECT * FROM splice_cables WHERE project_id = $1 ORDER BY created_at`,
        [sourceId]
      );
      for (const c of cableRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_cables
             (project_id, name, fiber_count, construction_type,
              from_location_id, to_location_id, manufacturer_part, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [newProjectId, c.name, c.fiber_count, c.construction_type,
           c.from_location_id ? locMap.get(c.from_location_id) || null : null,
           c.to_location_id   ? locMap.get(c.to_location_id)   || null : null,
           c.manufacturer_part, c.notes]
        );
        cableMap.set(c.id, r.rows[0].id);
      }
      // 4. Buffer tubes — index by old cable id to remap.
      const tubeRows = await client.query(`
        SELECT t.* FROM splice_buffer_tubes t
        JOIN splice_cables c ON c.id = t.cable_id
        WHERE c.project_id = $1
        ORDER BY t.cable_id, t.position
      `, [sourceId]);
      for (const t of tubeRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_buffer_tubes (cable_id, position, color)
           VALUES ($1, $2, $3) RETURNING id`,
          [cableMap.get(t.cable_id), t.position, t.color]
        );
        tubeMap.set(t.id, r.rows[0].id);
      }
      // 5. Fibers — preserve circuit_name / customer / notes (Phase 2A
      //    #4 strand metadata) so a clone keeps the same circuit
      //    identifiers; common when designer is splitting one big
      //    project into a "billable" copy and a "field" copy.
      const fiberRows = await client.query(`
        SELECT f.* FROM splice_fibers f
        JOIN splice_buffer_tubes t ON t.id = f.buffer_tube_id
        JOIN splice_cables c ON c.id = t.cable_id
        WHERE c.project_id = $1
      `, [sourceId]);
      for (const f of fiberRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_fibers
             (buffer_tube_id, position, color, circuit_name, customer, notes)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [tubeMap.get(f.buffer_tube_id), f.position, f.color,
           f.circuit_name, f.customer, f.notes]
        );
        fiberMap.set(f.id, r.rows[0].id);
      }
      // 6. Closures + trays.
      const closureMap = new Map();
      const trayMap    = new Map();
      const closureRows = await client.query(`
        SELECT cl.* FROM splice_closures cl
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
        ORDER BY cl.created_at
      `, [sourceId]);
      for (const cl of closureRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_closures
             (location_id, model, tray_count, tray_capacity, notes)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [locMap.get(cl.location_id), cl.model, cl.tray_count, cl.tray_capacity, cl.notes]
        );
        closureMap.set(cl.id, r.rows[0].id);
      }
      const trayRows = await client.query(`
        SELECT t.* FROM splice_trays t
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
      `, [sourceId]);
      for (const t of trayRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_trays (closure_id, position) VALUES ($1, $2) RETURNING id`,
          [closureMap.get(t.closure_id), t.position]
        );
        trayMap.set(t.id, r.rows[0].id);
      }
      // 7. Ribbon groups — must come BEFORE splices because splices.
      //    ribbon_group_id FKs into them.
      const ribbonGroupMap = new Map();
      const groupRows = await client.query(`
        SELECT g.* FROM splice_ribbon_groups g
        JOIN splice_trays t ON t.id = g.tray_id
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
      `, [sourceId]);
      for (const g of groupRows.rows) {
        const r = await client.query(
          `INSERT INTO splice_ribbon_groups (tray_id) VALUES ($1) RETURNING id`,
          [trayMap.get(g.tray_id)]
        );
        ribbonGroupMap.set(g.id, r.rows[0].id);
      }
      // 8. Splices — remap fiber A, fiber B, tray, ribbon group.
      const spliceRows = await client.query(`
        SELECT s.* FROM splices s
        JOIN splice_trays t ON t.id = s.tray_id
        JOIN splice_closures cl ON cl.id = t.closure_id
        JOIN splice_locations l ON l.id = cl.location_id
        WHERE l.project_id = $1
      `, [sourceId]);
      for (const s of spliceRows.rows) {
        await client.query(
          `INSERT INTO splices
             (tray_id, fiber_a_id, fiber_b_id, splice_type, ribbon_group_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [trayMap.get(s.tray_id),
           fiberMap.get(s.fiber_a_id),
           fiberMap.get(s.fiber_b_id),
           s.splice_type,
           s.ribbon_group_id ? ribbonGroupMap.get(s.ribbon_group_id) || null : null]
        );
      }
      // 9. Strand states — remap cable_id + location_id.
      const stateRows = await client.query(`
        SELECT s.* FROM splice_strand_states s
        JOIN splice_cables c ON c.id = s.cable_id
        WHERE c.project_id = $1
      `, [sourceId]);
      for (const ss of stateRows.rows) {
        await client.query(
          `INSERT INTO splice_strand_states
             (cable_id, location_id, strand_position, state, stored_length_inches, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [cableMap.get(ss.cable_id),
           locMap.get(ss.location_id),
           ss.strand_position, ss.state, ss.stored_length_inches, ss.notes]
        );
      }

      await client.query('COMMIT');
      res.json({
        ok: true,
        project: newProj.rows[0],
        counts: {
          locations: locMap.size,
          cables:    cableMap.size,
          buffer_tubes: tubeMap.size,
          fibers:    fiberMap.size,
          closures:  closureMap.size,
          trays:     trayMap.size,
          ribbon_groups: ribbonGroupMap.size,
          splices:   spliceRows.rows.length,
          strand_states: stateRows.rows.length,
        },
      });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  // ─── Version snapshots + diff (Phase 2B #6) ─────────────────────────────
  // Manual save: always records a row, never debounced. Use case:
  // "checkpoint before client redline review."
  app.post('/api/splice/projects/:id/versions', requireAuth(), async (req, res) => {
    try {
      const label = (req.body && req.body.label) ? String(req.body.label).slice(0, 200) : null;
      const v = await _takeSnapshot(pool, req.params.id, label, req.user?.staff_id);
      res.json(v);
    } catch (e) {
      const code = /not found/i.test(e.message) ? 404 : 500;
      res.status(code).json({ error: e.message });
    }
  });

  // Auto-snapshot — debounced server-side. Editor calls this after
  // every successful write; server only records a row if the last
  // version is older than 10 minutes. Generation-hash check avoids
  // recording a new row when the splice graph is structurally the
  // same as the last snapshot (for example, the user opened the
  // project and hovered around but didn't change anything).
  app.post('/api/splice/projects/:id/versions/auto', requireAuth(), async (req, res) => {
    try {
      const projectId = req.params.id;
      const last = await pool.query(
        `SELECT version_number, generation_hash, created_at
           FROM splice_project_versions
          WHERE project_id = $1
          ORDER BY version_number DESC LIMIT 1`,
        [projectId]
      );
      const lastRow = last.rows[0];
      const ageMs = lastRow ? (Date.now() - new Date(lastRow.created_at).getTime()) : Infinity;
      if (ageMs < 10 * 60 * 1000) {
        return res.json({ skipped: true, reason: 'debounced', last_version: lastRow });
      }
      const v = await _takeSnapshot(pool, projectId, null, req.user?.staff_id);
      res.json(v);
    } catch (e) {
      const code = /not found/i.test(e.message) ? 404 : 500;
      res.status(code).json({ error: e.message });
    }
  });

  app.get('/api/splice/projects/:id/versions', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT v.id, v.version_number, v.label, v.generation_hash,
                v.created_at, v.created_by_staff_id,
                s.name AS created_by_name
           FROM splice_project_versions v
           LEFT JOIN staff s ON s.id = v.created_by_staff_id
          WHERE v.project_id = $1
          ORDER BY v.version_number DESC`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/splice/projects/:id/versions/:n', requireAuth(), async (req, res) => {
    try {
      const v = await _loadVersion(pool, req.params.id, req.params.n);
      if (!v) return res.status(404).json({ error: 'Version not found' });
      res.json(v);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/projects/:id/versions/:n', requireAuth(), async (req, res) => {
    try {
      const r = await pool.query(
        `DELETE FROM splice_project_versions
          WHERE project_id = $1 AND version_number = $2`,
        [req.params.id, req.params.n]
      );
      if (!r.rowCount) return res.status(404).json({ error: 'Version not found' });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Diff JSON: side B may be a numeric version OR the literal string
  // "current" to diff against the live tree.
  app.get('/api/splice/projects/:id/diff/:a/:b', requireAuth(), async (req, res) => {
    try {
      const a = await _loadVersion(pool, req.params.id, req.params.a);
      if (!a) return res.status(404).json({ error: `Version ${req.params.a} not found` });
      const b = req.params.b === 'current'
        ? { version_number: 'current', snapshot: await _loadProjectForExport(pool, req.params.id) }
        : await _loadVersion(pool, req.params.id, req.params.b);
      if (!b || !b.snapshot) return res.status(404).json({ error: `Version ${req.params.b} not found` });
      res.json({
        a: { version_number: a.version_number, label: a.label, generation_hash: a.generation_hash, created_at: a.created_at },
        b: { version_number: b.version_number, label: b.label || null, generation_hash: b.generation_hash || null, created_at: b.created_at || null },
        diff: _computeDiff(a.snapshot, b.snapshot),
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Diff PDF — puppeteer-rendered. Sections by closure → tray.
  // Light-gray strikethrough for removed splices, green-highlight
  // for added, side-by-side before/after for changed.
  app.get('/api/splice/projects/:id/diff/:a/:b/pdf', requireAuth(), async (req, res) => {
    try {
      const a = await _loadVersion(pool, req.params.id, req.params.a);
      if (!a) return res.status(404).json({ error: `Version ${req.params.a} not found` });
      const b = req.params.b === 'current'
        ? { version_number: 'current', snapshot: await _loadProjectForExport(pool, req.params.id) }
        : await _loadVersion(pool, req.params.id, req.params.b);
      if (!b || !b.snapshot) return res.status(404).json({ error: `Version ${req.params.b} not found` });
      const diff = _computeDiff(a.snapshot, b.snapshot);
      const html = _renderDiffHtml({
        project_name: b.snapshot.project?.name || a.snapshot.project?.name || 'Splice project',
        a_meta: { version_number: a.version_number, label: a.label, hash: a.generation_hash, created_at: a.created_at },
        b_meta: {
          version_number: b.version_number,
          label: b.label || (b.version_number === 'current' ? 'live (uncommitted)' : null),
          hash: b.generation_hash || null,
          created_at: b.created_at || null,
        },
        a: a.snapshot,
        b: b.snapshot,
        diff,
      });
      const puppeteer = _puppet();
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
        const pdf = await page.pdf({
          format: 'Letter',
          printBackground: true,
          margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        });
        const filename = `splice_diff_${_safeFilename(b.snapshot.project?.name || 'project')}_v${a.version_number}_to_v${b.version_number}.pdf`;
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

  // ─── Field markup public token + upload (Phase 2B #7) ───────────────────
  //
  // The splicer scans the QR printed on the field document, lands on a
  // public HTML page (no login, no app install), uploads a photo of the
  // closure interior. The engineer sees those photos attached to the
  // closure inside the editor. The token in the URL is the only auth.
  //
  //   POST /api/splice/closures/:id/public-tokens — engineer mints/lists
  //   GET  /api/splice/closures/:id/public-tokens — engineer lists
  //   DELETE /api/splice/public-tokens/:token     — engineer revokes
  //   GET  /splice/field/:token                    — public HTML
  //   POST /splice/field/:token/markup             — public photo upload
  //   GET  /splice/field/:token/markups/:id/image  — public, own-token
  //                                                  thumbnail
  //   GET  /api/splice/closures/:id/markups        — engineer list
  //   GET  /api/splice/markups/:id/image           — engineer image fetch
  //   DELETE /api/splice/markups/:id               — engineer remove

  app.post('/api/splice/closures/:id/public-tokens', requireAuth(), async (req, res) => {
    const closureId = req.params.id;
    const expiresInDays = req.body?.expires_in_days != null
      ? Math.max(1, parseInt(req.body.expires_in_days, 10) || 0)
      : null;
    try {
      const cl = await pool.query(
        `SELECT cl.id, l.project_id
           FROM splice_closures cl
           JOIN splice_locations l ON l.id = cl.location_id
          WHERE cl.id = $1`,
        [closureId]
      );
      if (!cl.rows.length) return res.status(404).json({ error: 'Closure not found' });
      const token = _mintFieldToken();
      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400 * 1000)
        : null;
      const ins = await pool.query(
        `INSERT INTO splice_closure_public_tokens
           (token, closure_id, project_id, expires_at, created_by_staff_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [token, closureId, cl.rows[0].project_id, expiresAt, req.user?.staff_id || null]
      );
      const url = (SPLICE_PUBLIC_URL || '') + '/splice/field/' + token;
      res.json({ ...ins.rows[0], url });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/splice/closures/:id/public-tokens', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT t.*, s.name AS created_by_name
           FROM splice_closure_public_tokens t
           LEFT JOIN staff s ON s.id = t.created_by_staff_id
          WHERE t.closure_id = $1
          ORDER BY t.created_at DESC`,
        [req.params.id]
      );
      const base = SPLICE_PUBLIC_URL || '';
      res.json(rows.map(r => ({ ...r, url: base + '/splice/field/' + r.token })));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/splice/public-tokens/:token', requireAuth(), async (req, res) => {
    try {
      const r = await pool.query(
        `DELETE FROM splice_closure_public_tokens WHERE token = $1`,
        [req.params.token]
      );
      if (!r.rowCount) return res.status(404).json({ error: 'Token not found' });
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Public: render minimal HTML for the splicer. Resolves the token to
  // its closure, pulls closure + location + project metadata + any
  // already-uploaded markups so the splicer can confirm they're at the
  // right closure. Also embeds the upload form. NO requireAuth here —
  // the token IS the auth.
  app.get('/splice/field/:token', async (req, res) => {
    try {
      const tok = await _resolveFieldToken(pool, req.params.token);
      if (!tok) return res.status(404).type('html').send(_renderFieldErrorHtml('This field link is invalid or expired. Ask the engineer for a fresh QR code.'));
      const meta = await _loadClosureForField(pool, tok.closure_id);
      if (!meta) return res.status(404).type('html').send(_renderFieldErrorHtml('Closure not found.'));
      const markups = await pool.query(
        `SELECT id, splicer_name, notes, mime_type, byte_size, uploaded_at
           FROM splice_field_markups WHERE closure_id = $1 ORDER BY uploaded_at DESC`,
        [tok.closure_id]
      );
      res.type('html').send(_renderFieldHtml({
        token: req.params.token,
        closure: meta,
        markups: markups.rows,
      }));
    } catch (e) {
      res.status(500).type('html').send(_renderFieldErrorHtml('Server error: ' + e.message));
    }
  });

  // Resolve the multer middleware lazily on first request so a missing
  // multer install fails the request, not the service boot.
  const _fieldMarkupMiddleware = (req, res, next) => {
    let upload;
    try { upload = _getFieldMarkupUpload(); }
    catch (e) { return res.status(500).json({ error: e.message }); }
    upload.single('photo')(req, res, next);
  };

  app.post('/splice/field/:token/markup',
    _fieldMarkupMiddleware,
    async (req, res) => {
      const ip = req.ip || (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null;
      if (!_fieldMarkupRateOk(ip)) {
        return res.status(429).json({ error: 'Too many uploads. Slow down and try again in a minute.' });
      }
      try {
        const tok = await _resolveFieldToken(pool, req.params.token);
        if (!tok) return res.status(404).json({ error: 'Field link is invalid or expired.' });
        if (!req.file || !req.file.buffer || !req.file.buffer.length) {
          return res.status(400).json({ error: 'No photo uploaded.' });
        }
        const splicerName = (req.body?.splicer_name || '').toString().trim().slice(0, 120) || null;
        const notes = (req.body?.notes || '').toString().trim().slice(0, 2000) || null;
        const ins = await pool.query(
          `INSERT INTO splice_field_markups
             (closure_id, project_id, token, splicer_name, notes,
              mime_type, byte_size, image_data, uploader_ip)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, uploaded_at`,
          [tok.closure_id, tok.project_id, req.params.token, splicerName, notes,
           req.file.mimetype, req.file.buffer.length, req.file.buffer, ip]
        );
        // Best-effort SSE broadcast so an engineer who has the project
        // open sees the upload appear in real-time without refreshing.
        _broadcast(tok.project_id, 'field_markup_added', {
          markup_id: ins.rows[0].id,
          closure_id: tok.closure_id,
          splicer_name: splicerName,
          uploaded_at: ins.rows[0].uploaded_at,
        });
        res.json({ ok: true, markup_id: ins.rows[0].id });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

  // Public image-fetch endpoint for the field page itself — splicer
  // uploads a photo, then the page wants to render a thumbnail right
  // back to confirm the upload landed. Restricted to images that
  // belong to the SAME closure as the token in the URL, so a leaked
  // markup id can't be used to read other closures' photos.
  app.get('/splice/field/:token/markups/:id/image', async (req, res) => {
    try {
      const tok = await _resolveFieldToken(pool, req.params.token);
      if (!tok) return res.status(404).end();
      const { rows } = await pool.query(
        `SELECT mime_type, image_data
           FROM splice_field_markups
          WHERE id = $1 AND closure_id = $2`,
        [req.params.id, tok.closure_id]
      );
      if (!rows.length) return res.status(404).end();
      res.set('Content-Type', rows[0].mime_type);
      res.set('Cache-Control', 'private, max-age=300');
      res.send(rows[0].image_data);
    } catch (e) {
      res.status(500).end();
    }
  });

  // Engineer-side: list markups for a closure (no image bytes — those
  // come over the dedicated image endpoint). byte_size lets the UI
  // render "1.2MB" hints without pulling the BYTEA over the wire.
  app.get('/api/splice/closures/:id/markups', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, closure_id, project_id, splicer_name, notes,
                mime_type, byte_size, uploaded_at, token
           FROM splice_field_markups
          WHERE closure_id = $1
          ORDER BY uploaded_at DESC`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Engineer-side image fetch. Goes through requireAuth so a public
  // user can't enumerate markup ids they don't own a token for.
  app.get('/api/splice/markups/:id/image', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT mime_type, image_data
           FROM splice_field_markups WHERE id = $1`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).end();
      res.set('Content-Type', rows[0].mime_type);
      res.set('Cache-Control', 'private, max-age=600');
      res.send(rows[0].image_data);
    } catch (e) {
      res.status(500).end();
    }
  });

  app.delete('/api/splice/markups/:id', requireAuth(), async (req, res) => {
    try {
      const r = await pool.query(
        `DELETE FROM splice_field_markups WHERE id = $1 RETURNING project_id, closure_id`,
        [req.params.id]
      );
      if (!r.rowCount) return res.status(404).json({ error: 'Markup not found' });
      _broadcast(r.rows[0].project_id, 'field_markup_removed', {
        markup_id: req.params.id, closure_id: r.rows[0].closure_id,
      });
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
      const tokensByClosureId = await _ensureFieldTokens(pool, data, req.user?.staff_id);
      const html = await _renderSpliceHtml(data, req.query.page_size || 'Tabloid', { tokensByClosureId });
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
      // Phase 2B #7 — make sure every closure has a current public
      // token before render so the QR codes encode field-markup links
      // instead of editor deep-links. Cheap on re-prints (existing
      // tokens are reused) but mints fresh ones for any new closures
      // since the last export.
      const tokensByClosureId = await _ensureFieldTokens(pool, data, req.user?.staff_id);
      const html = await _renderSpliceHtml(data, pageSize, { tokensByClosureId });
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

  // Phase 3B — KMZ export. Generates a KML document covering every
  // location with coords + every cable with a path_geojson, embedded
  // in ExtendedData with the splice_location_id / splice_cable_id so
  // a round-trip through Phase 3C re-import re-binds to the same
  // rows. Streams as application/vnd.google-earth.kmz.
  app.get('/api/splice/projects/:id/export-kmz', requireAuth(), async (req, res) => {
    try {
      const data = await _loadProjectForExport(pool, req.params.id);
      if (!data) return res.status(404).json({ error: 'Project not found' });
      const kml = _renderKml(data);
      const archiver = _getArchiver();
      const filename = `splice_${_safeFilename(data.project.name)}_${new Date().toISOString().slice(0,10)}.kmz`;
      res.set({
        'Content-Type': 'application/vnd.google-earth.kmz',
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (err) => {
        // Headers already sent in the streaming case; can't write JSON.
        // Log so the operator at least sees the failure on the splice
        // service stdout.
        console.error('[splice/export-kmz] archive error:', err);
        try { res.end(); } catch {}
      });
      archive.pipe(res);
      // KMZ convention: the KML document is named "doc.kml" at archive
      // root. Google Earth, ArcGIS, QGIS all key off this name.
      archive.append(kml, { name: 'doc.kml' });
      await archive.finalize();
    } catch (e) {
      if (!res.headersSent) res.status(500).json({ error: e.message });
    }
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
async function _renderSpliceHtml(data, pageSize, opts = {}) {
  const tokensByClosureId = opts.tokensByClosureId || new Map();
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

  // Phase 2A #4 — strand circuits. Suppress the column entirely when
  // no fiber carries a circuit name so the PDF stays tight on jobs
  // that don't track circuits.
  const anyCircuit = fibers.some(f => f.circuit_name || f.customer);

  // Pre-render QR codes for every closure in parallel. When a public
  // field token exists for the closure (Phase 2B #7), the QR encodes
  // the no-login splicer URL `/splice/field/:token`. Otherwise it
  // falls back to a deep-link into the editor — useful while the
  // engineer is still iterating before they print.
  const qrPromises = closures.map(cl => {
    const tok = tokensByClosureId.get(cl.id);
    const url = tok
      ? `${SPLICE_PUBLIC_URL || ''}/splice/field/${tok}`
      : (SPLICE_PUBLIC_URL
          ? `${SPLICE_PUBLIC_URL}/?project=${project.id}&closure=${cl.id}`
          : `/?project=${project.id}&closure=${cl.id}`);
    return _renderQrSvg(url, 84).then(svg => [cl.id, svg]);
  });
  const qrByClosureId = new Map(await Promise.all(qrPromises));

  // Generation hash — splicers can compare prints in the field at a
  // glance to confirm they're working from the same revision.
  const genHash = _generationHash(data);
  const todayIso = new Date().toISOString().slice(0, 10);

  function describeFiber(fiberId) {
    const f = fiberById.get(fiberId);
    if (!f) return { cable: '?', tube: '?', tube_position: '?', color: '?', position: '?', circuit_name: '', customer: '' };
    const tube = tubeById.get(f.buffer_tube_id);
    const cable = tube ? cableById.get(tube.cable_id) : null;
    return {
      cable: cable?.name || '?',
      tube_color: tube?.color || '?',
      tube_position: tube?.position ?? '?',
      color: f.color,
      position: f.position,
      circuit_name: f.circuit_name || '',
      customer: f.customer || '',
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
    // Side A circuit is the most useful column on the field document;
    // splicers reference circuit names when troubleshooting later.
    // Side B circuit is mostly redundant (a 1:1 splice connects two
    // ends of the same circuit) so we elide it to save horizontal
    // space on Tabloid.
    const circuitCell = anyCircuit ? `<td>${_esc(a.circuit_name || b.circuit_name || '')}</td>` : '';
    return `
      <tr>
        <td>${_esc(a.cable)}</td>
        <td>${colorChip(a.tube_color)} <span class="muted">${a.tube_position}</span></td>
        <td>${colorChip(a.color)} <span class="muted">${a.position}</span></td>
        <td class="arrow">→</td>
        <td>${_esc(b.cable)}</td>
        <td>${colorChip(b.tube_color)} <span class="muted">${b.tube_position}</span></td>
        <td>${colorChip(b.color)} <span class="muted">${b.position}</span></td>
        ${circuitCell}
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
        // For ribbon groups, show "12 circuits" or the first circuit
        // name with "+11 more" — concise but informative.
        const ribbonCircuits = list.map(s => describeFiber(s.fiber_a_id).circuit_name).filter(Boolean);
        const circuitCell = anyCircuit ? `<td>${ribbonCircuits.length ? _esc(ribbonCircuits[0]) + (ribbonCircuits.length > 1 ? ` <span class="muted">+${ribbonCircuits.length-1}</span>` : '') : '<span class="muted">—</span>'}</td>` : '';
        return `<tr class="ribbon-row">
          <td colspan="3"><b>${_esc(a.cable)}</b> · tube ${colorChip(a.tube_color)} <span class="muted">(12 fibers, ribbon)</span></td>
          <td class="arrow">⇒</td>
          <td colspan="3"><b>${_esc(b.cable)}</b> · tube ${colorChip(b.tube_color)} <span class="muted">(12 fibers, ribbon)</span></td>
          ${circuitCell}
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
              <col style="width:${anyCircuit?'10%':'11%'}"><col style="width:${anyCircuit?'9%':'10%'}"><col style="width:${anyCircuit?'7%':'8%'}">
              <col style="width:3%">
              <col style="width:${anyCircuit?'10%':'11%'}"><col style="width:${anyCircuit?'9%':'10%'}"><col style="width:${anyCircuit?'7%':'8%'}">
              ${anyCircuit ? '<col style="width:11%">' : ''}
              <col style="width:7%">
              <col style="width:8%"><col style="width:${anyCircuit?'19%':'22%'}">
            </colgroup>
            <thead><tr>
              <th colspan="3">Side A</th>
              <th></th>
              <th colspan="3">Side B</th>
              ${anyCircuit ? '<th rowspan="2">Circuit</th>' : ''}
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

// ─── Version snapshot helpers (Phase 2B #6) ─────────────────────────────

// Take a snapshot of the current project state. Auto-snapshots (label
// null) skip when the generation hash matches the previous snapshot
// because nothing has structurally changed since then. Manual saves
// always record. version_number is computed under a UNIQUE
// (project_id, version_number) so a concurrent writer can't collide.
async function _takeSnapshot(pool, projectId, label, staffId) {
  const data = await _loadProjectForExport(pool, projectId);
  if (!data) {
    const err = new Error('Project not found');
    throw err;
  }
  const hash = _generationHash(data);
  const lastQ = await pool.query(
    `SELECT version_number, generation_hash
       FROM splice_project_versions
      WHERE project_id = $1
      ORDER BY version_number DESC LIMIT 1`,
    [projectId]
  );
  const last = lastQ.rows[0];
  if (!label && last && last.generation_hash === hash) {
    return { skipped: true, reason: 'no-change', last_version_number: last.version_number };
  }
  const nextNum = (last?.version_number || 0) + 1;
  const ins = await pool.query(
    `INSERT INTO splice_project_versions
       (project_id, version_number, snapshot_jsonb, generation_hash, label, created_by_staff_id)
     VALUES ($1, $2, $3::jsonb, $4, $5, $6)
     RETURNING id, project_id, version_number, generation_hash, label, created_at, created_by_staff_id`,
    [projectId, nextNum, JSON.stringify(data), hash, label || null, staffId || null]
  );
  return ins.rows[0];
}

// Load a version row + its snapshot. Returns null when the version
// doesn't exist (caller maps to 404).
async function _loadVersion(pool, projectId, versionNumber) {
  const n = parseInt(versionNumber, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  const { rows } = await pool.query(
    `SELECT id, project_id, version_number, generation_hash, label,
            created_at, created_by_staff_id, snapshot_jsonb
       FROM splice_project_versions
      WHERE project_id = $1 AND version_number = $2`,
    [projectId, n]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    project_id: r.project_id,
    version_number: r.version_number,
    generation_hash: r.generation_hash,
    label: r.label,
    created_at: r.created_at,
    created_by_staff_id: r.created_by_staff_id,
    snapshot: r.snapshot_jsonb,
  };
}

// Diff two hydrate-shaped snapshots. Walks every entity type by id;
// emits added (id only in B), removed (id only in A), changed (id in
// both with different content). Splices specifically also get
// "moved" detection — same fiber pair, different tray — so we don't
// double-count a tray reorganization as remove-then-add.
function _computeDiff(a, b) {
  const out = {};
  const KEYS = ['locations', 'cables', 'closures', 'trays',
                'splices', 'ribbon_groups', 'strand_states',
                'buffer_tubes', 'fibers'];
  for (const k of KEYS) {
    const al = Array.isArray(a?.[k]) ? a[k] : [];
    const bl = Array.isArray(b?.[k]) ? b[k] : [];
    const aById = new Map(al.map(x => [x.id, x]));
    const bById = new Map(bl.map(x => [x.id, x]));
    const added = [];
    const removed = [];
    const changed = [];
    for (const [id, bx] of bById) {
      const ax = aById.get(id);
      if (!ax) added.push(bx);
      else if (!_shallowEqualEntity(ax, bx)) changed.push({ before: ax, after: bx });
    }
    for (const [id, ax] of aById) {
      if (!bById.has(id)) removed.push(ax);
    }
    out[k] = { added, removed, changed };
  }
  // Project header (name / notes / status) often gets edited
  // alongside the splice tree; surface that separately.
  if (a?.project && b?.project) {
    const fields = ['name', 'status', 'notes'];
    const projChanges = {};
    for (const f of fields) {
      if ((a.project[f] || null) !== (b.project[f] || null)) {
        projChanges[f] = { before: a.project[f], after: b.project[f] };
      }
    }
    if (Object.keys(projChanges).length) out.project = projChanges;
  }
  return out;
}

function _shallowEqualEntity(a, b) {
  if (a === b) return true;
  // Skip volatile fields that don't represent splice-graph intent.
  const skip = new Set(['created_at', 'updated_at']);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (skip.has(k)) continue;
    const av = a[k], bv = b[k];
    if (av === bv) continue;
    if (av == null && bv == null) continue;
    return false;
  }
  return true;
}

// Render the diff as a self-contained HTML document. Same look-and-
// feel as the splicer field doc but reduced: a header + summary
// counts + per-closure tables that show only the splices that
// changed (added in green, removed in gray strikethrough).
// Closures with no splice deltas are omitted entirely.
function _renderDiffHtml({ project_name, a_meta, b_meta, a, b, diff }) {
  const css = `
    *,*::before,*::after { box-sizing:border-box; }
    body { font: 11px/1.35 -apple-system,Segoe UI,Roboto,sans-serif; color:#222; margin:0; padding:18px 22px; background:#fff; }
    h1 { font-size:18px; margin:0 0 4px; }
    h2 { font-size:13px; margin:18px 0 6px; padding-bottom:3px; border-bottom:1px solid #ccc; }
    h3 { font-size:11px; margin:10px 0 4px; color:#333; }
    .header { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #003366; padding-bottom:6px; margin-bottom:10px; }
    .header .meta { text-align:right; font-size:10px; color:#555; }
    .meta-row { margin:1px 0; }
    .pill { display:inline-block; padding:1px 7px; border-radius:9px; font-size:10px; font-weight:600; }
    .pill-a { background:#fff3cd; color:#664d03; border:1px solid #ffe69c; }
    .pill-b { background:#cfe2ff; color:#084298; border:1px solid #9ec5fe; }
    .summary { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
    .stat { background:#f5f5f5; border:1px solid #ddd; padding:4px 8px; border-radius:4px; font-size:10px; }
    .stat b { color:#003366; font-size:13px; display:block; }
    .stat.add b { color:#0a7d2a; }
    .stat.rem b { color:#a31616; }
    table { width:100%; border-collapse:collapse; font-size:10px; margin-bottom:10px; }
    th, td { border:1px solid #ddd; padding:3px 5px; text-align:left; vertical-align:top; }
    th { background:#f0f0f0; font-weight:600; }
    tr.added td { background:#e8f7ec; }
    tr.added td:first-child::before { content:'+ '; color:#0a7d2a; font-weight:700; }
    tr.removed td { background:#f5f5f5; color:#888; text-decoration:line-through; }
    tr.removed td:first-child::before { content:'- '; color:#a31616; font-weight:700; text-decoration:none; display:inline-block; }
    tr.changed td { background:#fff8e1; }
    tr.changed td:first-child::before { content:'~ '; color:#b46900; font-weight:700; }
    .empty-section { color:#888; font-style:italic; padding:8px 0; }
    .closure-page { page-break-inside:avoid; margin-bottom:14px; }
    .footer { position:fixed; bottom:8px; left:22px; right:22px; display:flex; justify-content:space-between; font-size:9px; color:#666; }
    .num { text-align:right; font-variant-numeric:tabular-nums; }
  `;

  // Snapshots may be missing strand_states on really old rows; keep
  // diffs robust against that.
  const safe = (snap, k) => Array.isArray(snap?.[k]) ? snap[k] : [];

  // Build lookup maps off SIDE B (the "after" snapshot) for label
  // generation — that's what the reader is asking the question
  // about: "what did this become?" When an entity is removed we
  // look it up on side A.
  function describe(side, fiberId) {
    const snap = side;
    const fibers = safe(snap, 'fibers');
    const tubes  = safe(snap, 'buffer_tubes');
    const cables = safe(snap, 'cables');
    const f = fibers.find(x => x.id === fiberId);
    if (!f) return '?';
    const t = tubes.find(x => x.id === f.buffer_tube_id);
    const c = t ? cables.find(x => x.id === t.cable_id) : null;
    return `${c?.name || '?'} · tube ${t?.color || '?'}-${t?.position ?? '?'} · fiber ${f.color}-${f.position}`;
  }

  function spliceLabel(side, s) {
    return `${describe(side, s.fiber_a_id)}  →  ${describe(side, s.fiber_b_id)}  (${s.splice_type || 'fusion'})`;
  }

  const totalAdded   = diff.splices.added.length;
  const totalRemoved = diff.splices.removed.length;
  const totalChanged = diff.splices.changed.length;

  // Project-header changes block.
  const projHeaderChanges = diff.project ? Object.entries(diff.project).map(([f, v]) =>
    `<tr><td>${_esc(f)}</td><td>${_esc(v.before || '—')}</td><td>${_esc(v.after || '—')}</td></tr>`
  ).join('') : '';

  // Cable / location / closure shell summary.
  function entityTable(label, entries, displayFn) {
    const added   = entries.added.map(x => `<tr class="added"><td>${displayFn(x)}</td></tr>`).join('');
    const removed = entries.removed.map(x => `<tr class="removed"><td>${displayFn(x)}</td></tr>`).join('');
    const changed = entries.changed.map(x => `<tr class="changed"><td>${displayFn(x.after)} <span style="color:#666">(was: ${displayFn(x.before)})</span></td></tr>`).join('');
    if (!added && !removed && !changed) return '';
    return `<h3>${_esc(label)}</h3><table><tbody>${added}${removed}${changed}</tbody></table>`;
  }

  // Per-closure splice deltas. Group splices by closure_id (via
  // tray_id → closure_id from whichever snapshot has the tray).
  const trayToClosureA = new Map(safe(a, 'trays').map(t => [t.id, t.closure_id]));
  const trayToClosureB = new Map(safe(b, 'trays').map(t => [t.id, t.closure_id]));
  const closureA = new Map(safe(a, 'closures').map(c => [c.id, c]));
  const closureB = new Map(safe(b, 'closures').map(c => [c.id, c]));
  const locationA = new Map(safe(a, 'locations').map(l => [l.id, l]));
  const locationB = new Map(safe(b, 'locations').map(l => [l.id, l]));

  function closureIdForSplice(side, sideMap, s) {
    return sideMap.get(s.tray_id);
  }
  function closureLabel(closureId) {
    const c = closureB.get(closureId) || closureA.get(closureId);
    if (!c) return '(unknown closure)';
    const loc = locationB.get(c.location_id) || locationA.get(c.location_id);
    return `${loc?.name || '?'} · ${c.model || 'closure'}`;
  }

  const byClosure = new Map(); // closureId → { added:[], removed:[], changed:[] }
  function bucket(closureId) {
    if (!byClosure.has(closureId)) byClosure.set(closureId, { added: [], removed: [], changed: [] });
    return byClosure.get(closureId);
  }
  for (const s of diff.splices.added) {
    const cid = closureIdForSplice(b, trayToClosureB, s);
    if (cid) bucket(cid).added.push(s);
    else bucket('__orphan__').added.push(s);
  }
  for (const s of diff.splices.removed) {
    const cid = closureIdForSplice(a, trayToClosureA, s);
    if (cid) bucket(cid).removed.push(s);
    else bucket('__orphan__').removed.push(s);
  }
  for (const c of diff.splices.changed) {
    const cid = closureIdForSplice(b, trayToClosureB, c.after) || closureIdForSplice(a, trayToClosureA, c.before);
    if (cid) bucket(cid).changed.push(c);
    else bucket('__orphan__').changed.push(c);
  }

  const closurePages = [...byClosure.entries()].map(([cid, group]) => {
    const lines = [];
    for (const s of group.added)   lines.push(`<tr class="added"><td>${_esc(spliceLabel(b, s))}</td></tr>`);
    for (const s of group.removed) lines.push(`<tr class="removed"><td>${_esc(spliceLabel(a, s))}</td></tr>`);
    for (const c of group.changed) {
      lines.push(`<tr class="changed"><td>${_esc(spliceLabel(b, c.after))} <span style="color:#666">(was: ${_esc(spliceLabel(a, c.before))})</span></td></tr>`);
    }
    return `
      <div class="closure-page">
        <h3>${_esc(closureLabel(cid))} — ${group.added.length} added · ${group.removed.length} removed · ${group.changed.length} changed</h3>
        <table><tbody>${lines.join('')}</tbody></table>
      </div>`;
  }).join('');

  const aLabel = a_meta.version_number === 'current' ? 'current' : `v${a_meta.version_number}`;
  const bLabel = b_meta.version_number === 'current' ? 'current' : `v${b_meta.version_number}`;
  const aDate  = a_meta.created_at ? new Date(a_meta.created_at).toLocaleString() : '—';
  const bDate  = b_meta.created_at ? new Date(b_meta.created_at).toLocaleString() : 'now';

  return `<!doctype html><html><head><meta charset="utf-8">
<title>Splice diff — ${_esc(project_name)}</title>
<style>${css}</style>
</head><body>
<div class="header">
  <div>
    <h1>${_esc(project_name)} — splice diff</h1>
    <div class="meta-row"><span class="pill pill-a">A · ${_esc(aLabel)}</span> ${a_meta.label ? `<span style="color:#555">${_esc(a_meta.label)}</span>` : ''} <span style="color:#888">${_esc(aDate)}</span> ${a_meta.hash ? `<span style="color:#888">#${_esc(a_meta.hash)}</span>` : ''}</div>
    <div class="meta-row"><span class="pill pill-b">B · ${_esc(bLabel)}</span> ${b_meta.label ? `<span style="color:#555">${_esc(b_meta.label)}</span>` : ''} <span style="color:#888">${_esc(bDate)}</span> ${b_meta.hash ? `<span style="color:#888">#${_esc(b_meta.hash)}</span>` : ''}</div>
  </div>
  <div class="meta">
    <div>Generated ${new Date().toISOString().slice(0,10)}</div>
    <div>Launch Fiber Services · Splice Matrix</div>
  </div>
</div>

<div class="summary">
  <div class="stat add"><b>${totalAdded}</b>splices added</div>
  <div class="stat rem"><b>${totalRemoved}</b>splices removed</div>
  <div class="stat"><b>${totalChanged}</b>splices changed</div>
  <div class="stat add"><b>${diff.closures.added.length}</b>closures added</div>
  <div class="stat rem"><b>${diff.closures.removed.length}</b>closures removed</div>
  <div class="stat add"><b>${diff.cables.added.length}</b>cables added</div>
  <div class="stat rem"><b>${diff.cables.removed.length}</b>cables removed</div>
</div>

${projHeaderChanges ? `<h2>Project header</h2><table><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>${projHeaderChanges}</tbody></table>` : ''}

<h2>Cables, locations, closures</h2>
${entityTable('Locations', diff.locations, l => `${_esc(l.name)} <span style="color:#666">(${_esc(l.type)})</span>`)}
${entityTable('Cables',    diff.cables,    c => `${_esc(c.name)} <span style="color:#666">(${c.fiber_count}f ${_esc(c.construction_type || '')})</span>`)}
${entityTable('Closures',  diff.closures,  c => `${_esc(c.model || 'closure')} <span style="color:#666">(${c.tray_count}×${c.tray_capacity})</span>`)}

<h2>Splice deltas by closure</h2>
${closurePages || '<div class="empty-section">No splice changes between these revisions.</div>'}

<div class="footer">
  <span>${_esc(project_name)}</span>
  <span>Diff ${_esc(aLabel)} → ${_esc(bLabel)}</span>
</div>
</body></html>`;
}

// ─── Field markup helpers (Phase 2B #7) ─────────────────────────────────

// Resolve a public field token to its closure + project. Honours
// expires_at when set. Returns null when the token is unknown or
// expired so the caller can 404 cleanly.
async function _resolveFieldToken(pool, token) {
  if (!token || typeof token !== 'string' || token.length > 64) return null;
  const { rows } = await pool.query(
    `SELECT token, closure_id, project_id, expires_at, created_at
       FROM splice_closure_public_tokens
      WHERE token = $1
        AND (expires_at IS NULL OR expires_at > NOW())`,
    [token]
  );
  return rows[0] || null;
}

// Pull just enough closure metadata for the public field page —
// closure model, location name, project name. Splicer scans the QR
// and confirms "yes, this is the right closure" by reading these
// fields on screen.
async function _loadClosureForField(pool, closureId) {
  const { rows } = await pool.query(
    `SELECT cl.id, cl.model, cl.tray_count, cl.tray_capacity, cl.notes,
            l.name AS location_name, l.type AS location_type,
            p.name AS project_name, p.id AS project_id
       FROM splice_closures cl
       JOIN splice_locations l ON l.id = cl.location_id
       JOIN splice_projects  p ON p.id = l.project_id
      WHERE cl.id = $1`,
    [closureId]
  );
  return rows[0] || null;
}

// Ensure every closure in `data.closures` has at least one un-
// expired public token. Reuses any existing token (most recent
// wins); mints fresh ones for closures without coverage. Returns
// a Map<closure_id, token> ready to feed _renderSpliceHtml.
async function _ensureFieldTokens(pool, data, staffId) {
  if (!data?.closures?.length) return new Map();
  const closureIds = data.closures.map(c => c.id);
  const projId = data.project?.id;
  const existing = await pool.query(
    `SELECT DISTINCT ON (closure_id) closure_id, token
       FROM splice_closure_public_tokens
      WHERE closure_id = ANY($1::uuid[])
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY closure_id, created_at DESC`,
    [closureIds]
  );
  const map = new Map(existing.rows.map(r => [r.closure_id, r.token]));
  const missing = closureIds.filter(id => !map.has(id));
  if (!missing.length) return map;
  // Mint fresh tokens in a single batched insert. No expires_at —
  // the field doc may sit in a splicer's truck for months before
  // they get to that section. Engineers can revoke explicitly when
  // a job is closed out.
  const values = missing.map(cid => [_mintFieldToken(), cid, projId, staffId || null]);
  const flat = values.flat();
  const placeholders = values.map((_, i) =>
    `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
  ).join(', ');
  await pool.query(
    `INSERT INTO splice_closure_public_tokens
       (token, closure_id, project_id, created_by_staff_id)
     VALUES ${placeholders}`,
    flat
  );
  for (const [tok, cid] of values.map(v => [v[0], v[1]])) {
    map.set(cid, tok);
  }
  return map;
}

// Public-facing HTML page for the splicer. Mobile-first, single
// column, large touch targets, no JavaScript framework — just
// vanilla fetch() for the upload. Image preview after upload uses
// the public-token-scoped image endpoint so the splicer can confirm
// their upload landed without needing to log in anywhere.
function _renderFieldHtml({ token, closure, markups }) {
  const safeToken = String(token).replace(/[^A-Za-z0-9_-]/g, '');
  const markupRows = (markups || []).map(m => `
    <li class="markup-row">
      <img src="/splice/field/${safeToken}/markups/${m.id}/image" alt="field photo" loading="lazy">
      <div class="meta">
        <div class="who">${_esc(m.splicer_name || 'Anonymous')}</div>
        <div class="when">${new Date(m.uploaded_at).toLocaleString()}</div>
        ${m.notes ? `<div class="notes">${_esc(m.notes)}</div>` : ''}
      </div>
    </li>`).join('');
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Field markup · ${_esc(closure.project_name)}</title>
<style>
  *,*::before,*::after { box-sizing:border-box; }
  body { font: 16px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; color:#1c1c1c; background:#f5f6f8; margin:0; padding:0; min-height:100vh; }
  .topbar { background:#003366; color:#fff; padding:12px 18px; }
  .topbar h1 { margin:0; font-size:16px; font-weight:600; }
  .topbar .sub { font-size:12px; opacity:.85; margin-top:2px; }
  main { max-width:560px; margin:0 auto; padding:14px; }
  .card { background:#fff; border:1px solid #e2e4e9; border-radius:8px; padding:14px; margin-bottom:14px; box-shadow:0 1px 2px rgba(0,0,0,.04); }
  .meta-table { width:100%; font-size:14px; }
  .meta-table th { text-align:left; color:#5b6470; font-weight:500; padding:3px 8px 3px 0; vertical-align:top; width:40%; }
  .meta-table td { padding:3px 0; vertical-align:top; }
  h2 { font-size:14px; font-weight:600; margin:0 0 10px; color:#003366; }
  label { display:block; font-size:13px; color:#3b4252; margin-bottom:4px; font-weight:500; }
  input[type=text], textarea {
    width:100%; padding:9px 10px; border:1px solid #c8cdd4; border-radius:6px; font:inherit; background:#fff;
  }
  textarea { min-height:60px; resize:vertical; }
  .file-input-wrap {
    border:2px dashed #b3bbc5; border-radius:8px; padding:18px; text-align:center; background:#fafbfc; margin-bottom:10px;
  }
  .file-input-wrap input[type=file] { width:100%; }
  .submit { background:#0a7d2a; color:#fff; border:none; padding:13px; border-radius:8px; font-size:16px; font-weight:600; width:100%; cursor:pointer; }
  .submit:disabled { background:#7e8b9c; cursor:wait; }
  .field-row { margin-bottom:10px; }
  .markup-list { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:1fr; gap:10px; }
  .markup-row { display:flex; gap:10px; align-items:flex-start; padding:8px; background:#fafbfc; border:1px solid #e2e4e9; border-radius:6px; }
  .markup-row img { width:80px; height:80px; object-fit:cover; border-radius:4px; background:#eee; flex:0 0 auto; }
  .markup-row .who { font-weight:600; font-size:13px; }
  .markup-row .when { font-size:11px; color:#5b6470; }
  .markup-row .notes { font-size:12px; color:#3b4252; margin-top:3px; white-space:pre-wrap; }
  #upload-status { margin-top:10px; padding:10px; border-radius:6px; font-size:14px; display:none; }
  #upload-status.ok { background:#d4f4dd; color:#0a4a18; display:block; }
  #upload-status.err { background:#fadddd; color:#7a1a1a; display:block; }
  footer { font-size:11px; color:#5b6470; text-align:center; padding:14px; }
  .empty { color:#5b6470; font-style:italic; font-size:13px; }
</style>
</head><body>
<div class="topbar">
  <h1>${_esc(closure.project_name)}</h1>
  <div class="sub">Splicer field markup</div>
</div>
<main>
  <section class="card">
    <h2>Closure</h2>
    <table class="meta-table">
      <tr><th>Location</th><td><b>${_esc(closure.location_name)}</b> <span style="color:#5b6470;font-size:12px">(${_esc(closure.location_type)})</span></td></tr>
      <tr><th>Model</th><td>${_esc(closure.model || '—')}</td></tr>
      <tr><th>Trays</th><td>${closure.tray_count} × ${closure.tray_capacity}-fiber</td></tr>
      ${closure.notes ? `<tr><th>Notes</th><td>${_esc(closure.notes)}</td></tr>` : ''}
    </table>
  </section>

  <section class="card">
    <h2>Upload field photo</h2>
    <form id="upload-form" enctype="multipart/form-data">
      <div class="field-row">
        <label for="splicer_name">Your name <span style="color:#5b6470;font-weight:400">(optional)</span></label>
        <input type="text" id="splicer_name" name="splicer_name" maxlength="120" placeholder="e.g. Carlos R.">
      </div>
      <div class="field-row">
        <label for="notes">Notes <span style="color:#5b6470;font-weight:400">(optional)</span></label>
        <textarea id="notes" name="notes" maxlength="2000" placeholder="Tray 3 ribbon-to-ribbon, all 12 fusions clean"></textarea>
      </div>
      <div class="field-row">
        <label for="photo">Photo (max 2 MB · JPEG, PNG, WebP, HEIC)</label>
        <div class="file-input-wrap">
          <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required>
        </div>
      </div>
      <button type="submit" class="submit" id="submit-btn">Upload photo</button>
      <div id="upload-status"></div>
    </form>
  </section>

  <section class="card">
    <h2>Photos already uploaded</h2>
    ${markupRows ? `<ul class="markup-list">${markupRows}</ul>` : '<p class="empty">No photos uploaded yet for this closure.</p>'}
  </section>
</main>
<footer>Launch Fiber Services · Splice Matrix</footer>
<script>
(function(){
  var form = document.getElementById('upload-form');
  var btn  = document.getElementById('submit-btn');
  var status = document.getElementById('upload-status');
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    status.className = '';
    status.textContent = '';
    var photo = document.getElementById('photo').files[0];
    if (!photo) { status.className='err'; status.textContent='Pick a photo first.'; return; }
    if (photo.size > 2*1024*1024) { status.className='err'; status.textContent='Photo is over 2 MB. Compress or shoot at lower resolution.'; return; }
    btn.disabled = true; btn.textContent = 'Uploading…';
    var fd = new FormData(form);
    try {
      var r = await fetch('/splice/field/${safeToken}/markup', { method:'POST', body: fd });
      var json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Upload failed');
      status.className = 'ok';
      status.textContent = 'Photo uploaded. Reloading to show it…';
      setTimeout(function(){ window.location.reload(); }, 800);
    } catch (err) {
      status.className = 'err';
      status.textContent = err.message || 'Upload failed';
      btn.disabled = false; btn.textContent = 'Upload photo';
    }
  });
})();
</script>
</body></html>`;
}

function _renderFieldErrorHtml(message) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Field link error</title>
<style>body{font:15px/1.45 -apple-system,Segoe UI,Roboto,sans-serif;color:#1c1c1c;background:#f5f6f8;margin:0;padding:40px 20px;text-align:center}.box{max-width:420px;margin:0 auto;background:#fff;border:1px solid #e2e4e9;border-radius:8px;padding:24px}h1{font-size:17px;color:#a31616;margin:0 0 10px}p{margin:0;color:#3b4252}</style>
</head><body><div class="box"><h1>This link won't open</h1><p>${_esc(message)}</p></div></body></html>`;
}

// ─── KML rendering (Phase 3B) ───────────────────────────────────────────

// Serialize a project's locations + cables to a KML document. Locations
// land in a "Locations" folder, cables in a "Cables" folder. The
// splice_location_id / splice_cable_id ExtendedData entries are the
// breadcrumb that lets a Phase 3C round-trip re-bind to the same DB
// rows on import — match those first, fall back to name match, fall
// back to "this is a new entity."
function _renderKml(data) {
  const proj = data.project || {};
  const projName = _kmlEsc(proj.name || 'Splice project');
  const projDesc = _kmlEsc(proj.notes || '');

  const locsWithGeo = (data.locations || []).filter(l =>
    l.latitude != null && l.longitude != null
  );
  const cablesWithPath = (data.cables || []).filter(c =>
    c.path_geojson && Array.isArray(c.path_geojson.coordinates) &&
    c.path_geojson.coordinates.length >= 2
  );

  // Closures-per-location cardinality is useful for the splicer's GIS
  // person and for round-trip diff. Stick it in ExtendedData.
  const closuresByLoc = new Map();
  for (const cl of (data.closures || [])) {
    if (!closuresByLoc.has(cl.location_id)) closuresByLoc.set(cl.location_id, []);
    closuresByLoc.get(cl.location_id).push(cl);
  }

  const locPlacemarks = locsWithGeo.map(l => {
    const closuresHere = closuresByLoc.get(l.id) || [];
    const styleId = closuresHere.length ? '#splice-closure-loc' : '#splice-bare-loc';
    return `
      <Placemark>
        <name>${_kmlEsc(l.name)}</name>
        <styleUrl>${styleId}</styleUrl>
        <ExtendedData>
          <Data name="splice_location_id"><value>${_kmlEsc(l.id)}</value></Data>
          <Data name="type"><value>${_kmlEsc(l.type || '')}</value></Data>
          <Data name="sequence_index"><value>${Number(l.sequence_index || 0)}</value></Data>
          <Data name="closure_count"><value>${closuresHere.length}</value></Data>
          ${closuresHere.length ? `<Data name="closure_models"><value>${_kmlEsc(closuresHere.map(c => c.model || '').filter(Boolean).join('; '))}</value></Data>` : ''}
          ${l.notes ? `<Data name="notes"><value>${_kmlEsc(l.notes)}</value></Data>` : ''}
        </ExtendedData>
        <Point><coordinates>${Number(l.longitude)},${Number(l.latitude)},0</coordinates></Point>
      </Placemark>`;
  }).join('');

  const cablePlacemarks = cablesWithPath.map(c => {
    const coords = c.path_geojson.coordinates
      .map(pt => `${Number(pt[0])},${Number(pt[1])},0`)
      .join(' ');
    return `
      <Placemark>
        <name>${_kmlEsc(c.name)}</name>
        <styleUrl>#splice-cable</styleUrl>
        <ExtendedData>
          <Data name="splice_cable_id"><value>${_kmlEsc(c.id)}</value></Data>
          <Data name="fiber_count"><value>${Number(c.fiber_count)}</value></Data>
          <Data name="construction_type"><value>${_kmlEsc(c.construction_type || '')}</value></Data>
          ${c.manufacturer_part ? `<Data name="manufacturer_part"><value>${_kmlEsc(c.manufacturer_part)}</value></Data>` : ''}
          ${c.notes ? `<Data name="notes"><value>${_kmlEsc(c.notes)}</value></Data>` : ''}
        </ExtendedData>
        <LineString><coordinates>${coords}</coordinates></LineString>
      </Placemark>`;
  }).join('');

  // KML colors are ABGR (alpha, blue, green, red), backwards from what
  // every other graphics stack uses. ff00d4ff = full alpha, B=00 G=d4
  // R=ff = bright yellow, the same line color as the in-app map.
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${projName}</name>
    <description><![CDATA[${projDesc}

Generated by Launch Fiber Services — Splice Matrix
${new Date().toISOString().slice(0,10)}
${locsWithGeo.length} location(s), ${cablesWithPath.length} cable(s)]]></description>
    <Style id="splice-closure-loc">
      <IconStyle>
        <color>ffff5f1b</color>
        <scale>1.1</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/paddle/blu-circle.png</href></Icon>
      </IconStyle>
      <LabelStyle><scale>0.8</scale></LabelStyle>
    </Style>
    <Style id="splice-bare-loc">
      <IconStyle>
        <scale>0.9</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-circle.png</href></Icon>
      </IconStyle>
      <LabelStyle><scale>0.7</scale></LabelStyle>
    </Style>
    <Style id="splice-cable">
      <LineStyle>
        <color>ff00d4ff</color>
        <width>3</width>
      </LineStyle>
    </Style>
    <Folder>
      <name>Locations</name>${locPlacemarks}
    </Folder>
    <Folder>
      <name>Cables</name>${cablePlacemarks}
    </Folder>
  </Document>
</kml>
`;
}

// XML-escape with the five named entities. KML is XML so we cover '
// and " too even though they only matter inside attribute values.
function _kmlEsc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
