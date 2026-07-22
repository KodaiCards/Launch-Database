// routes/project_photos.js — Project photo management
//
// Schema: migration 0052_project_photos.sql
//   project_photos(id, project_id, uploaded_by, filename, mime_type, size_bytes,
//                  storage_key, caption, taken_at, uploaded_at, gps_lat, gps_lon,
//                  gps_accuracy_m, status, created_at)
//
// Endpoints:
//   POST   /api/project-photos                    — upload multipart photo
//   GET    /api/project-photos?project_id=X       — list photos for a project
//   GET    /api/project-photos/:id/download       — stream photo content
//   DELETE /api/project-photos/:id                — soft-archive (status='archived')

const { logAudit } = require('./_audit');
const { getEffective } = require('./_permissions');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// W94-HIGH-1: Extension allowlist — only these extensions are permitted regardless
// of what Content-Type the client claims.
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp']);

// W94-HIGH-1: Magic-byte signatures keyed by MIME type.
// Each entry is an array of [byteOffset, hexPattern] pairs that must ALL match.
// null bytes in the pattern are wildcard positions (e.g. RIFF chunk size in WebP).
// We use a hex-string approach identical to routes/client_portal_v2.js for consistency,
// but adapted for in-memory buffers (memoryStorage) rather than disk files.
const MIME_MAGIC = {
  'image/jpeg': [[0, 'ffd8ff']],
  'image/png':  [[0, '89504e47']],
  'image/webp': [[0, '52494646'], [8, '57454250']], // RIFF....WEBP (two separate checks)
  'image/heic': [[4, '667479706865696300']], // ....ftypheic (ftyp box at offset 4)
  'image/heif': [[4, '66747970']],           // ....ftyp (general ftyp box)
};

// Returns true if the buffer's bytes match the magic-byte signatures for mimeType.
// Uses buffer slicing — no disk I/O needed since multer uses memoryStorage here.
function hasValidMagicBytes(buffer, mimeType) {
  const signatures = MIME_MAGIC[mimeType];
  if (!signatures) return false;
  for (const [offset, hexStr] of signatures) {
    const needed = offset + hexStr.length / 2;
    if (buffer.length < needed) return false;
    const actual = buffer.slice(offset, offset + hexStr.length / 2).toString('hex');
    if (!actual.startsWith(hexStr.toLowerCase())) return false;
  }
  return true;
}

module.exports = function installProjectPhotoRoutes(app, pool, mw) {
  // MED-5 fix: hard fail on missing middleware instead of silently open-gating
  if (!mw || !mw.requireAuth) {
    throw new Error('[project-photos] requireAuth middleware required');
  }
  const requireAuth = mw.requireAuth;
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  // ── #84: Project photo read/write access ─────────────────────────────────
  // Returns true if userId may read/write photos on projectId.
  //   • admin / manager roles bypass; customer is always denied.
  //   • Holders of the System F `projects.view_all` grant see project photos on
  //     the same basis they see the rest of the project (Partner ruling on #84,
  //     Carter-locked 2026-07-20: photos follow projects.view_all — no separate
  //     key). Resolved live through the #73 permission resolver (getEffective).
  //   • Everyone else is SCOPED: an internal (client-less) project, or a project
  //     this user has personally uploaded a photo to.
  //
  // ⚠ #84 fix note (deviation from the issue's first fix-direction — see the
  // issue thread): the former `job_assignments` / `ec_job_visibility` EXISTS
  // branches were REMOVED, not "scoped to the caller." Those tables carry NO
  // per-user column — job_assignments (migration 0032) is
  // job_id/client_id/engineering_contract_id/team; ec_job_visibility (0037) is
  // engineering_contract_id/job_id/created_by_user_id — so there is literally no
  // caller predicate to add (the `service_areas.js:833`
  // assigned_user_id/assigned_staff_id template lives on `service_area_jobs`, a
  // different table). Left unscoped, those two branches granted EVERY
  // non-manager employee photo access to ANY project under ANY active EC/client
  // — exactly the leak. Broad cross-project photo visibility now flows solely
  // through the projects.view_all grant above (the Carter-locked model).
  async function userHasProjectAccess(userId, userRole, projectId) {
    if (!userId || !projectId) return false;

    // Admin / managers always allowed
    if (userRole === 'admin' ||
        userRole === 'design_manager' ||
        userRole === 'permitting_manager') {
      return true;
    }

    // Customers never allowed to access project photos
    if (userRole === 'customer') return false;

    // System F: a projects.view_all holder sees all project photos. FAIL CLOSED
    // on a grant-resolution error — never widen access on a DB fault; fall
    // through to the scoped checks below (themselves least-privilege).
    try {
      const eff = await getEffective(pool, { role: userRole, id: userId });
      if (eff.has('projects.view_all')) return true;
    } catch (e) {
      console.error('[project-photos:access] grant resolution failed', e && e.message);
    }

    // Scoped access: an internal (client-less) project, or a project this user
    // has personally uploaded a photo to.
    const { rows } = await pool.query(`
      SELECT 1
      FROM projects p
      WHERE p.id = $1
        AND p.is_rollup IS NOT TRUE
        AND (
          -- No client scoping — open to all employees (e.g. internal projects)
          p.client_id IS NULL
          OR
          -- User previously uploaded to this project (owns photos)
          EXISTS (
            SELECT 1 FROM project_photos pp2
            WHERE pp2.project_id = p.id AND pp2.uploaded_by = $2
          )
        )
      LIMIT 1
    `, [projectId, userId]);
    return rows.length > 0;
  }

  // Multer config for in-memory buffering (will write to disk in handler)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      // W94-HIGH-1 (extension check): reject disallowed extensions before buffering.
      // This catches attackers who send image/jpeg Content-Type but name the file shell.php.
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) {
        return cb(new Error(`File extension '${ext || '(none)'}' not permitted`));
      }

      // MIME type check (secondary — extension check is the primary gate)
      const allowedMimes = Object.keys(MIME_MAGIC);
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error(`MIME type ${file.mimetype} not allowed`));
      }

      cb(null, true);
    }
  });

  function serverError(res, e, where) {
    console.error(`[project-photos:${where}]`, e && e.message);
    // W94-L4: multer file-size errors return 413, not 500.
    if (e && e.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 20 MB.' });
    }
    const msg = e && e.message && e.message.includes('MIME')
      ? e.message
      : 'Internal server error';
    res.status(500).json({ error: msg });
  }

  // POST /api/project-photos — multipart upload
  // Form fields: project_id (uuid), caption (text), taken_at (ISO timestamp),
  //              gps_lat (float), gps_lon (float), gps_accuracy_m (float)
  // File field: photo
  app.post('/api/project-photos', requireAuth(), upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No photo file provided' });
      }

      const { project_id, caption, taken_at, gps_lat, gps_lon, gps_accuracy_m } = req.body;

      if (!project_id) {
        return res.status(400).json({ error: 'project_id required' });
      }

      const uploadedBy = req.user && req.user.id;
      if (!uploadedBy) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // MED-1: verify user has access to this project before allowing upload
      const userRole = req.user && req.user.role;
      const canAccess = await userHasProjectAccess(uploadedBy, userRole, project_id);
      if (!canAccess) {
        return res.status(403).json({ error: 'Not authorized to upload photos to this project' });
      }

      // Validate project exists
      const projRes = await pool.query('SELECT id FROM projects WHERE id=$1', [project_id]);
      if (projRes.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // W94-HIGH-1 (magic-byte check): verify actual file content matches the declared
      // MIME type. The extension check in fileFilter handles wrong-extension attacks;
      // this handles wrong-content attacks (.jpg extension + PHP body).
      // multer.memoryStorage() provides req.file.buffer — no disk read needed.
      if (!hasValidMagicBytes(req.file.buffer, req.file.mimetype)) {
        return res.status(400).json({ error: 'File content does not match declared type' });
      }

      // Sanitize filename, generate storage key
      const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
      const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const photoId = crypto.randomUUID();
      const storageKey = `project-photos/${project_id}/${photoId}${ext}`;
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const storagePath = path.join(uploadDir, storageKey);

      // Ensure directory exists
      const storageDir = path.dirname(storagePath);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }

      // Write file to disk
      fs.writeFileSync(storagePath, req.file.buffer);

      // Parse taken_at or use now
      const takenAt = taken_at ? new Date(taken_at).toISOString() : null;

      // Parse GPS coordinates
      const lat = gps_lat ? parseFloat(gps_lat) : null;
      const lon = gps_lon ? parseFloat(gps_lon) : null;
      const accuracy = gps_accuracy_m ? parseFloat(gps_accuracy_m) : null;

      // INSERT
      const { rows } = await pool.query(`
        INSERT INTO project_photos
          (id, project_id, uploaded_by, filename, mime_type, size_bytes,
           storage_key, caption, taken_at, gps_lat, gps_lon, gps_accuracy_m)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, project_id, uploaded_by, filename, mime_type, size_bytes,
                  caption, taken_at, uploaded_at, gps_lat, gps_lon, gps_accuracy_m, status
      `, [
        photoId, project_id, uploadedBy, sanitizedName, req.file.mimetype,
        req.file.size, storageKey, caption || null, takenAt, lat, lon, accuracy
      ]);

      // Audit
      await logAudit(pool, {
        action: 'project_photo.upload',
        actor_user_id: uploadedBy,
        entity_type: 'project_photo',
        entity_id: rows[0].id,
        after_data: rows[0]
      });

      res.status(201).json(rows[0]);
    } catch (e) {
      serverError(res, e, 'POST upload');
    }
  });

  // GET /api/project-photos?project_id=X&limit=N&offset=N — list photos for project
  app.get('/api/project-photos', requireAuth(), async (req, res) => {
    try {
      const { project_id } = req.query;
      if (!project_id) {
        return res.status(400).json({ error: 'project_id query param required' });
      }

      // MED-1: verify user has access to this project
      const userId = req.user && req.user.id;
      const userRole = req.user && req.user.role;
      const canAccess = await userHasProjectAccess(userId, userRole, project_id);
      if (!canAccess) {
        return res.status(403).json({ error: 'Not authorized to view photos for this project' });
      }

      let limit = Math.min(parseInt(req.query.limit) || 50, 200);
      let offset = Math.max(parseInt(req.query.offset) || 0, 0);

      // Get total count
      const countRes = await pool.query(
        'SELECT COUNT(*) as cnt FROM project_photos WHERE project_id=$1 AND status=$2',
        [project_id, 'active']
      );
      const total = parseInt(countRes.rows[0].cnt);

      // Get paginated rows with uploader name
      const { rows } = await pool.query(`
        SELECT pp.id, pp.project_id, pp.uploaded_by, pp.filename, pp.mime_type,
               pp.size_bytes, pp.caption, pp.taken_at, pp.uploaded_at,
               pp.gps_lat, pp.gps_lon, pp.gps_accuracy_m, pp.status,
               u.name as uploader_name
        FROM project_photos pp
        LEFT JOIN users u ON u.id = pp.uploaded_by
        WHERE pp.project_id=$1 AND pp.status=$2
        ORDER BY pp.uploaded_at DESC
        LIMIT $3 OFFSET $4
      `, [project_id, 'active', limit, offset]);

      res.json({ rows, total, limit, offset });
    } catch (e) {
      serverError(res, e, 'GET list');
    }
  });

  // GET /api/project-photos/:id/download — stream photo
  app.get('/api/project-photos/:id/download', requireAuth(), async (req, res) => {
    try {
      const photoId = req.params.id;

      // Validate UUID format
      if (!photoId.match(/^[0-9a-f-]{36}$/i)) {
        return res.status(400).json({ error: 'Invalid photo ID format' });
      }

      // Fetch photo metadata including project_id for access check
      // Also enforce status='active' so archived photos are not downloadable (LOW-1 fix)
      const { rows } = await pool.query(
        "SELECT id, project_id, mime_type, storage_key FROM project_photos WHERE id=$1 AND status='active'",
        [photoId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      const photo = rows[0];

      // MED-1: verify user has access to the project this photo belongs to
      const userId = req.user && req.user.id;
      const userRole = req.user && req.user.role;
      const canAccess = await userHasProjectAccess(userId, userRole, photo.project_id);
      if (!canAccess) {
        return res.status(403).json({ error: 'Not authorized to download this photo' });
      }

      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const filePath = path.join(uploadDir, photo.storage_key);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Photo file not found on disk' });
      }

      res.setHeader('Content-Type', photo.mime_type);
      res.setHeader('Content-Disposition', 'inline; filename="photo"');
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      serverError(res, e, 'GET download');
    }
  });

  // DELETE /api/project-photos/:id — soft-archive
  app.delete('/api/project-photos/:id', requireAuth(), async (req, res) => {
    try {
      const photoId = req.params.id;
      const userId = req.user && req.user.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Validate UUID format
      if (!photoId.match(/^[0-9a-f-]{36}$/i)) {
        return res.status(400).json({ error: 'Invalid photo ID format' });
      }

      // Fetch photo
      const { rows: photoRows } = await pool.query(
        'SELECT id, uploaded_by FROM project_photos WHERE id=$1',
        [photoId]
      );

      if (photoRows.length === 0) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      const photo = photoRows[0];

      // Check permission: original uploader or admin
      const isAdmin = req.user && req.user.role === 'admin';
      if (photo.uploaded_by !== userId && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized to delete this photo' });
      }

      // Soft-archive
      const { rows: updated } = await pool.query(
        'UPDATE project_photos SET status=$1 WHERE id=$2 RETURNING *',
        ['archived', photoId]
      );

      // Audit
      await logAudit(pool, {
        action: 'project_photo.delete',
        actor_user_id: userId,
        entity_type: 'project_photo',
        entity_id: photoId,
        before_data: photo,
        after_data: updated[0]
      });

      res.json({ success: true, status: 'archived' });
    } catch (e) {
      serverError(res, e, 'DELETE archive');
    }
  });
};
