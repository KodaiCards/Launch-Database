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
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = function installProjectPhotoRoutes(app, pool, mw) {
  // MED-5 fix: hard fail on missing middleware instead of silently open-gating
  if (!mw || !mw.requireAuth) {
    throw new Error('[project-photos] requireAuth middleware required');
  }
  const requireAuth = mw.requireAuth;
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  // ── MED-1: Project ownership check ────────────────────────────────────────
  // Returns true if userId may read/write photos on projectId.
  // Admin and manager roles bypass; customer role is always denied.
  // Other authenticated users are checked via the project's client/EC linkage
  // through job_assignments and ec_job_visibility.
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

    // For other employee roles: check project linkage through assignments
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
          OR
          -- Linked via job_assignments (client or EC scoped assignment)
          EXISTS (
            SELECT 1 FROM job_assignments ja
            WHERE (ja.client_id = p.client_id
                   OR ja.engineering_contract_id = p.engineering_contract_id)
              AND ja.engineering_contract_id IS NOT DISTINCT FROM p.engineering_contract_id
            LIMIT 1
          )
          OR
          -- Linked via EC job visibility
          EXISTS (
            SELECT 1 FROM ec_job_visibility ejv
            WHERE ejv.engineering_contract_id = p.engineering_contract_id
              AND p.engineering_contract_id IS NOT NULL
            LIMIT 1
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
      const allowedMimes = [
        'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`MIME type ${file.mimetype} not allowed`));
      }
    }
  });

  function serverError(res, e, where) {
    console.error(`[project-photos:${where}]`, e && e.message);
    const msg = e && e.message && e.message.includes('MIME')
      ? e.message
      : 'Internal server error';
    res.status(500).json({ error: msg });
  }

  // POST /api/project-photos — multipart upload
  // Form fields: project_id (uuid), caption (text), taken_at (ISO timestamp),
  //              gps_lat (float), gps_lon (float), gps_accuracy_m (float)
  // File field: photo
  app.post('/api/project-photos', requireAuth, upload.single('photo'), async (req, res) => {
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
  app.get('/api/project-photos', requireAuth, async (req, res) => {
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
  app.get('/api/project-photos/:id/download', requireAuth, async (req, res) => {
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
  app.delete('/api/project-photos/:id', requireAuth, async (req, res) => {
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
