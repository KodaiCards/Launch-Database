const { logAudit } = require('./_audit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports = function installDwgSyncRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || ((req, res, next) => next());
  const requireManagerOrAdmin = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());

// Helpers
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function sanitizeFilename(filename) {
  // Reject path traversal attempts
  if (filename.includes('..') || filename.startsWith('/')) {
    throw new Error('Invalid filename: path traversal detected');
  }
  // Allow alphanumeric, spaces, dots, dashes, underscores
  return filename.replace(/[^a-zA-Z0-9._\- ]/g, '_');
}

const ALLOWED_MIMES = ['application/vnd.dwg', 'application/vnd.dxf', 'application/vnd.google-earth.kml+xml', 'application/pdf', 'image/png', 'image/jpeg'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// HIGH-3 fix: extension allowlist — checked in fileFilter before disk write.
// sanitizeFilename() only restricts chars, not extensions; this adds extension gating.
const ALLOWED_EXTS = new Set(['.dwg', '.dxf', '.kml', '.kmz', '.pdf', '.png', '.jpg', '.jpeg']);

// HIGH-3 fix: magic-byte signatures keyed by extension.
// DWG: AutoCAD drawing starts with "AC10" or "AC12" ASCII (versions AC1009..AC1032).
// DXF: text-based, starts with "0\n" or "0\r\n" followed by "SECTION".
// KML/KMZ: XML/ZIP — KML starts with "<?xml" or "<kml"; KMZ starts with PK ZIP magic.
// PDF: starts with "%PDF-".
// PNG: starts with \x89PNG.
// JPEG: starts with \xff\xd8\xff.
// Each entry is [ [byteOffset, hexPattern], ... ] — ALL must match.
// null-pattern entries match any byte at that offset (wildcard).
const MIME_MAGIC = {
  '.dwg':  [[0, '4143']],                       // "AC" — covers AC10xx..AC1032
  '.dxf':  [[0, '30']],                         // "0" text start
  '.kml':  [[0, '3c']],                         // "<" (XML/KML tag open)
  '.kmz':  [[0, '504b0304']],                   // PK ZIP header
  '.pdf':  [[0, '255044462d']],                 // "%PDF-"
  '.png':  [[0, '89504e47']],                   // \x89PNG
  '.jpg':  [[0, 'ffd8ff']],                     // JPEG SOI + APP marker
  '.jpeg': [[0, 'ffd8ff']],
};

// HIGH-3 fix: read first bytes of a disk-based file, test against magic-byte signatures.
// Used AFTER multer writes to disk (unlike project_photos.js which uses memoryStorage).
function hasValidMagicBytes(filePath, ext) {
  const signatures = MIME_MAGIC[ext.toLowerCase()];
  if (!signatures) return false; // unknown extension — reject
  try {
    // Read first 12 bytes — enough for any of the above signatures.
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(12);
    const bytesRead = fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);
    const available = buf.slice(0, bytesRead);
    for (const [offset, hexStr] of signatures) {
      const needed = offset + Math.ceil(hexStr.length / 2);
      if (available.length < needed) return false;
      const actual = available.slice(offset, offset + Math.ceil(hexStr.length / 2)).toString('hex');
      if (!actual.startsWith(hexStr.toLowerCase())) return false;
    }
    return true;
  } catch (_) {
    return false; // Cannot read file — fail safe
  }
}

// GET /api/dwg-sync/v2/manifest?project_id=X
app.get('/api/dwg-sync/v2/manifest', requireAuth(), async (req, res) => {
  try {
    const { project_id } = req.query;
    if (!project_id || !isValidUUID(project_id)) {
      return res.status(400).json({ error: 'Invalid project_id' });
    }

    const result = await pool.query(
      `SELECT id, filename, size_bytes, sha256, last_modified_at,
              (SELECT name FROM users WHERE id = last_modified_by) as last_modified_by_name
       FROM dwg_canonical_files
       WHERE project_id = $1
       ORDER BY filename`,
      [project_id]
    );

    res.json({
      project_id,
      files: result.rows.map(row => ({
        id: row.id,
        filename: row.filename,
        size_bytes: row.size_bytes,
        sha256: row.sha256,
        last_modified_at: row.last_modified_at,
        last_modified_by_name: row.last_modified_by_name
      })),
      server_time: new Date().toISOString()
    });
  } catch (err) {
    console.error('GET /manifest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dwg-sync/v2/push (multipart)
// Note: multer configured in server.js as 'upload' middleware; passed via mw.upload if available
const upload = (mw && mw.upload) || ((req, res, next) => next());
app.post('/api/dwg-sync/v2/push', requireAuth(), upload.single('file'), async (req, res) => {
  // Hoist outside try so catch can reference for MED-3 orphan cleanup.
  let fileRenamed = false;
  let fullPath = null;
  try {
    // Expect: project_id, filename, sha256 (fields); file (file)
    const { project_id, filename, sha256 } = req.body;
    
    if (!project_id || !isValidUUID(project_id)) {
      return res.status(400).json({ error: 'Invalid project_id' });
    }
    if (!filename || filename.trim().length === 0) {
      return res.status(400).json({ error: 'Filename required' });
    }
    if (!sha256 || !/^[a-f0-9]{64}$/.test(sha256)) {
      return res.status(400).json({ error: 'Invalid SHA256 hash' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file size
    if (req.file.size > MAX_FILE_SIZE) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ error: `File too large: max ${MAX_FILE_SIZE / 1024 / 1024}MB` });
    }

    // Check MIME type (client-declared — secondary gate only)
    if (!ALLOWED_MIMES.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: `File type not allowed: ${req.file.mimetype}` });
    }

    // Sanitize filename
    const safeName = sanitizeFilename(filename);

    // HIGH-3 fix: extension allowlist check — before any disk operations.
    // sanitizeFilename() only restricts chars; this gates on extension.
    const uploadedExt = path.extname(safeName).toLowerCase();
    if (!ALLOWED_EXTS.has(uploadedExt)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: `File extension '${uploadedExt || '(none)'}' not permitted` });
    }

    // Verify project exists
    const projectCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [project_id]);
    if (projectCheck.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate storage key: dwg-staging/<user_id>/<project_id>/<uuid>.<ext>
    const ext = path.extname(safeName) || '.dwg';
    const uuid = require('crypto').randomUUID();
    const storageKey = path.join('dwg-staging', req.user.id, project_id, uuid + ext);
    fullPath = path.join(process.env.UPLOAD_DIR || './uploads', storageKey);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.renameSync(req.file.path, fullPath);
    fileRenamed = true; // Track so catch block can clean up orphaned file (MED-3).

    // HIGH-3 fix: magic-byte verification — read actual file bytes after disk write.
    // Catches attacks like "file.dwg extension + PHP body" that pass extension check.
    if (!hasValidMagicBytes(fullPath, uploadedExt)) {
      fs.unlinkSync(fullPath);
      fileRenamed = false;
      return res.status(400).json({ error: 'File content does not match its extension' });
    }

    // HIGH-4 fix: server-side sha256 verification.
    // Client supplies sha256; we compute from disk and compare. Store ONLY server-computed value.
    // Prevents integrity poisoning: file A uploaded with sha256 of file B.
    const serverSha256 = await new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(fullPath);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
    if (serverSha256 !== sha256) {
      fs.unlinkSync(fullPath);
      fileRenamed = false;
      return res.status(400).json({ error: 'sha256 hash does not match file content' });
    }
    // Use server-computed sha256 for storage — never trust client value.
    const verifiedSha256 = serverSha256;

    // Mark any existing pending staging row for this (user, project, filename) as superseded
    await pool.query(
      `UPDATE dwg_staging
       SET status = 'superseded'
       WHERE user_id = $1 AND project_id = $2 AND filename = $3 AND status = 'pending'`,
      [req.user.id, project_id, safeName]
    );

    // Insert new staging row — store server-computed sha256, not client's value.
    const insertResult = await pool.query(
      `INSERT INTO dwg_staging (user_id, project_id, filename, size_bytes, sha256, storage_key, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, status`,
      [req.user.id, project_id, safeName, req.file.size, verifiedSha256, storageKey]
    );

    const staging_id = insertResult.rows[0].id;
    await logAudit(pool, {
      req,
      action: 'dwg.push',
      entity_type: 'dwg_staging',
      entity_id: staging_id,
      source: 'dwg_sync'
    }).catch(() => {});

    res.json({ staging_id, status: 'pending' });
  } catch (err) {
    // MED-3 fix: unlink orphaned file on disk if DB operations failed after renameSync.
    if (fileRenamed && fullPath) {
      try { fs.unlinkSync(fullPath); } catch (_) {}
    }
    console.error('POST /push error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dwg-sync/v2/staging?status=pending&project_id=X
// HIGH-2 fix: replaced req.user.roles (undefined) with req.user.role string check.
// auth.js sets req.user.role as singular string ('admin', 'design_manager', etc.).
app.get('/api/dwg-sync/v2/staging', requireAuth(), async (req, res) => {
  try {
    const { status = 'pending', project_id, user_id } = req.query;

    // Authorization: regular users see own staging; admin/manager see all.
    // Use req.user.role (singular string) — auth.js does not set req.user.roles.
    const role = req.user.role || '';
    const isManager = role === 'admin' ||
      role === 'design_manager' ||
      role === 'permitting_manager';
    let filterUserID = req.user.id;
    if (isManager && user_id && isValidUUID(user_id)) {
      filterUserID = user_id;
    } else if (!isManager && user_id && user_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot view other users\' staging' });
    }

    let query = `
      SELECT ds.id, ds.filename, p.name as project_name, ds.project_id, 
             u.name as user_name, ds.user_id, ds.size_bytes, ds.sha256, 
             ds.pushed_at, ds.status
      FROM dwg_staging ds
      JOIN projects p ON ds.project_id = p.id
      JOIN users u ON ds.user_id = u.id
      WHERE ds.status = $1 AND ds.user_id = $2
    `;
    const params = [status, filterUserID];

    if (project_id && isValidUUID(project_id)) {
      query += ` AND ds.project_id = $3`;
      params.push(project_id);
    }

    query += ` ORDER BY ds.pushed_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /staging error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dwg-sync/v2/promote/:staging_id
// HIGH-2 fix: removed inner isManager check — req.user.roles is undefined (auth.js sets
// req.user.role as a string, not roles array). requireManagerOrAdmin middleware already
// correctly gates this route; the inner check was redundant and always-403.
app.post('/api/dwg-sync/v2/promote/:staging_id', requireManagerOrAdmin, async (req, res) => {
  try {
    const { staging_id } = req.params;

    if (!isValidUUID(staging_id)) {
      return res.status(400).json({ error: 'Invalid staging_id' });
    }

    // Fetch staging row
    const stagingResult = await pool.query(
      'SELECT id, user_id, project_id, filename, size_bytes, sha256, storage_key FROM dwg_staging WHERE id = $1',
      [staging_id]
    );
    if (stagingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Staging record not found' });
    }

    const staging = stagingResult.rows[0];
    const { project_id, filename, size_bytes, sha256, storage_key } = staging;

    // Begin transaction
    await pool.query('BEGIN');

    try {
      // Check if canonical exists for (project, filename)
      const canonicalResult = await pool.query(
        'SELECT id FROM dwg_canonical_files WHERE project_id = $1 AND filename = $2 FOR UPDATE',
        [project_id, filename]
      );

      let canonical_id;
      if (canonicalResult.rows.length > 0) {
        canonical_id = canonicalResult.rows[0].id;
        // Snapshot the current canonical to dwg_versions
        const currentCanonical = await pool.query(
          'SELECT size_bytes, sha256, storage_key, last_modified_by FROM dwg_canonical_files WHERE id = $1',
          [canonical_id]
        );
        const cur = currentCanonical.rows[0];
        await pool.query(
          `INSERT INTO dwg_versions (canonical_file_id, size_bytes, sha256, storage_key, uploaded_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [canonical_id, cur.size_bytes, cur.sha256, cur.storage_key, cur.last_modified_by]
        );

        // Update canonical
        await pool.query(
          `UPDATE dwg_canonical_files
           SET size_bytes = $1, sha256 = $2, storage_key = $3, last_modified_by = $4, last_modified_at = now()
           WHERE id = $5`,
          [size_bytes, sha256, storage_key, req.user.id, canonical_id]
        );
      } else {
        // Create new canonical
        const newCanonicalResult = await pool.query(
          `INSERT INTO dwg_canonical_files (project_id, filename, size_bytes, sha256, storage_key, last_modified_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [project_id, filename, size_bytes, sha256, storage_key, req.user.id]
        );
        canonical_id = newCanonicalResult.rows[0].id;
      }

      // Purge old versions (keep only last 10)
      await pool.query(
        `DELETE FROM dwg_versions
         WHERE canonical_file_id = $1
         AND id NOT IN (
           SELECT id FROM dwg_versions
           WHERE canonical_file_id = $1
           ORDER BY uploaded_at DESC
           LIMIT 10
         )`,
        [canonical_id]
      );

      // Mark staging as promoted
      await pool.query(
        `UPDATE dwg_staging SET status = 'promoted', reviewed_by = $1, reviewed_at = now() WHERE id = $2`,
        [req.user.id, staging_id]
      );

      await pool.query('COMMIT');

      // Count versions
      const versionCount = await pool.query(
        'SELECT COUNT(*) as cnt FROM dwg_versions WHERE canonical_file_id = $1',
        [canonical_id]
      );

      await logAudit(pool, {
        req,
        action: 'dwg.promote',
        entity_type: 'dwg_canonical_files',
        entity_id: canonical_id,
        source: 'dwg_sync'
      }).catch(() => {});

      res.json({
        canonical_file_id: canonical_id,
        version_count: versionCount.rows[0].cnt
      });
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('POST /promote error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dwg-sync/v2/reject/:staging_id
app.post('/api/dwg-sync/v2/reject/:staging_id', requireManagerOrAdmin, async (req, res) => {
  try {
    const { staging_id } = req.params;
    const { notes } = req.body || {};

    if (!isValidUUID(staging_id)) {
      return res.status(400).json({ error: 'Invalid staging_id' });
    }

    // Verify staging exists
    const stagingResult = await pool.query(
      'SELECT id FROM dwg_staging WHERE id = $1',
      [staging_id]
    );
    if (stagingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Staging record not found' });
    }

    // Update status to rejected
    const updateResult = await pool.query(
      `UPDATE dwg_staging
       SET status = 'rejected', reviewed_by = $1, reviewed_at = now(), review_notes = $2
       WHERE id = $3
       RETURNING *`,
      [req.user.id, notes || null, staging_id]
    );

    await logAudit(pool, {
      req,
      action: 'dwg.reject',
      entity_type: 'dwg_staging',
      entity_id: staging_id,
      source: 'dwg_sync'
    }).catch(() => {});

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('POST /reject error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dwg-sync/v2/download/:canonical_file_id
app.get('/api/dwg-sync/v2/download/:canonical_file_id', requireAuth(), async (req, res) => {
  try {
    const { canonical_file_id } = req.params;

    if (!isValidUUID(canonical_file_id)) {
      return res.status(400).json({ error: 'Invalid canonical_file_id' });
    }

    // Fetch canonical file
    const fileResult = await pool.query(
      'SELECT id, filename, storage_key FROM dwg_canonical_files WHERE id = $1',
      [canonical_file_id]
    );
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileResult.rows[0];
    const fullPath = path.join(process.env.UPLOAD_DIR || './uploads', file.storage_key);

    // Verify file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.download(fullPath);
  } catch (err) {
    console.error('GET /download error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

};
