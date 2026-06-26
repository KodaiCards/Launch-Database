// routes/project_documents.js — generic per-project document storage.
//
// Wave 178 security fixes:
//   H-1: Per-route multer with extension allowlist + magic-byte verification
//   H-2: e.message leaks replaced with static error strings + console.error
//   H-3: IDOR on DELETE + GET fixed with project team JOIN + role scope check
//
// Earlier fixes (kept):
//   - requireAuth role gate added to POST/GET/DELETE on documents
//   - requireAdmin added to /api/_debug/uploads
//   - uploaded_by sourced from req.user.id not body
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { logAudit } = require('./_audit');

// H-1: Extension allowlist — only these document extensions permitted.
const ALLOWED_EXTS = new Set([
  '.pdf', '.dwg', '.dxf', '.docx', '.xlsx',
  '.jpg', '.jpeg', '.png', '.zip', '.kml', '.kmz',
]);

// H-1: MIME type allowlist aligned to extension allowlist.
const ALLOWED_MIMES = new Set([
  'application/pdf',
  'application/vnd.dwg', 'image/vnd.dwg',
  'application/vnd.dxf', 'image/vnd.dxf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg', 'image/png',
  'application/zip',
  'application/vnd.google-earth.kml+xml', 'application/vnd.google-earth.kmz',
]);

// H-1: Magic-byte signatures keyed by MIME type.
// Each entry is an array of [byteOffset, hexPrefix] pairs — ANY matching pair passes.
const MIME_MAGIC = {
  'application/pdf': [[0, '255044462d']],   // %PDF-
  'application/zip': [[0, '504b']],          // PK
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0, '504b']], // DOCX = ZIP
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0, '504b']],       // XLSX = ZIP
  'application/vnd.google-earth.kmz': [[0, '504b']],                                        // KMZ = ZIP
  'image/jpeg': [[0, 'ffd8ff']],
  'image/png':  [[0, '89504e47']],
  // DWG: AC1x header (versions AC10 through AC27+)
  'application/vnd.dwg': [[0, '414331']],   // 'AC1'
  'image/vnd.dwg':       [[0, '414331']],
  // DXF: starts with '0\nSECTION' or similar — accept leading '0' and newline
  'application/vnd.dxf': [[0, '300a']],     // '0\n'
  'image/vnd.dxf':       [[0, '300a']],
  // KML: XML text starting with '<?xml' or '<kml'
  'application/vnd.google-earth.kml+xml': [[0, '3c3f786d6c'], [0, '3c6b6d6c']],
};

// H-1: Returns true if buffer content matches any magic-byte signature for mimeType.
function hasValidMagicBytes(buffer, mimeType) {
  const sigs = MIME_MAGIC[mimeType];
  if (!sigs) return false;
  for (const [offset, hexStr] of sigs) {
    const needed = offset + hexStr.length / 2;
    if (buffer.length < needed) continue;
    const actual = buffer.slice(offset, offset + hexStr.length / 2).toString('hex');
    if (actual.startsWith(hexStr.toLowerCase())) return true;
  }
  return false;
}

function sanitizeFilename(name) {
  return name
    .replace(/[#?]/g, '_')
    .replace(/[\\/]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = function installProjectDocumentsRoutes(app, pool, mw) {
  const { uploadDir } = mw;
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  // H-1: Per-route multer instance with extension + MIME allowlist.
  // Uses diskStorage matching the global upload pattern but with hardened
  // fileFilter and a 50 MB cap appropriate for documents.
  const docStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${uuidv4()}_${sanitizeFilename(file.originalname)}`),
  });
  const docUpload = multer({
    storage: docStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap for documents
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) {
        return cb(new Error(`File extension ${ext || '(none)'} not permitted`));
      }
      if (!ALLOWED_MIMES.has(file.mimetype)) {
        return cb(new Error(`Content-Type ${file.mimetype} not permitted`));
      }
      cb(null, true);
    },
  });

  // H-2: Shared error helper — never leaks e.message to client.
  function serverError(res, e, where) {
    console.error(`[project_documents:${where}]`, e && e.message);
    if (e && e.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 50 MB.' });
    }
    // Multer fileFilter errors surface our own controlled messages (extension/MIME rejections).
    if (e && e.message && (e.message.includes('not permitted') || e.message.includes('content does not match'))) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Internal error.' });
  }

  // POST /api/projects/:projectId/documents — upload a document for a project.
  // H-1: Uses docUpload (validated) instead of global upload.
  // H-2: e.message no longer leaked.
  // H-3: IDOR check — verifies document's project is accessible to caller.
  app.post(
    '/api/projects/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    docUpload.single('file'),
    async (req, res) => {
      const { doc_type, notes } = req.body;
      if (!req.file) return res.status(400).json({ error: 'No file uploaded — check file size (50 MB max)' });

      const projectId = req.params.projectId;

      // H-3: Verify the project's team matches the caller's role scope.
      try {
        const { rows: projRows } = await pool.query(
          `SELECT j.team FROM projects p LEFT JOIN jobs j ON j.id = p.job_id WHERE p.id = $1`,
          [projectId]
        );
        if (!projRows.length) {
          try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
          return res.status(404).json({ error: 'Project not found' });
        }
        const team = projRows[0].team;
        if (req.user.role === 'design_manager' && team !== 'design') {
          try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
          return res.status(404).json({ error: 'Project not found' });
        }
        if (req.user.role === 'permitting_manager' && team !== 'permitting') {
          try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
          return res.status(404).json({ error: 'Project not found' });
        }
      } catch (e) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
        return serverError(res, e, 'POST/project-check');
      }

      // H-1: Magic-byte verification — read first 12 bytes from disk.
      try {
        const fd = await fsp.open(path.join(uploadDir, req.file.filename), 'r');
        const buf = Buffer.alloc(12);
        await fd.read(buf, 0, 12, 0);
        await fd.close();
        if (!hasValidMagicBytes(buf, req.file.mimetype)) {
          try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
          return res.status(400).json({ error: 'File content does not match declared type' });
        }
      } catch (e) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
        return serverError(res, e, 'POST/magic-check');
      }

      // uploaded_by sourced from authenticated user, never from body.
      const uploadedBy = req.user.id;
      try {
        const { rows } = await pool.query(`
          INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
          VALUES ($1,$2,$3,$4,$5,1,$6,$7) RETURNING *
        `, [projectId, doc_type || 'document', req.file.originalname, req.file.filename, req.file.size, uploadedBy, notes]);

        logAudit(pool, {
          req,
          action: 'project_document.upload',
          entity_type: 'project_document',
          entity_id: rows[0].id,
          after: rows[0],
          source: 'admin',
        }).catch(() => {});

        res.json(rows[0]);
      } catch (e) {
        try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {}
        return serverError(res, e, 'POST/insert');
      }
    }
  );

  // GET /api/projects/:projectId/documents — list documents for a project.
  // H-3: IDOR check — verify project's team matches caller's role scope.
  app.get(
    '/api/projects/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    async (req, res) => {
      try {
        const projectId = req.params.projectId;

        // H-3: scope check
        const { rows: projRows } = await pool.query(
          `SELECT j.team FROM projects p LEFT JOIN jobs j ON j.id = p.job_id WHERE p.id = $1`,
          [projectId]
        );
        if (!projRows.length) return res.status(404).json({ error: 'Project not found' });
        const team = projRows[0].team;
        if (req.user.role === 'design_manager' && team !== 'design') {
          return res.status(404).json({ error: 'Project not found' });
        }
        if (req.user.role === 'permitting_manager' && team !== 'permitting') {
          return res.status(404).json({ error: 'Project not found' });
        }

        const { rows } = await pool.query(
          `SELECT * FROM permit_documents WHERE project_id = $1 ORDER BY created_at DESC`,
          [projectId]
        );
        res.json(rows);
      } catch (e) { serverError(res, e, 'GET'); }
    }
  );

  // DELETE /api/projects/documents/:docId — delete a document.
  // H-3: IDOR check — verify document belongs to a project the caller can access.
  app.delete(
    '/api/projects/documents/:docId',
    requireAuth(['admin', 'design_manager', 'permitting_manager']),
    async (req, res) => {
      try {
        const docId = req.params.docId;

        // H-3: Look up document + project team before deleting.
        const { rows: docRows } = await pool.query(
          `SELECT pd.id, pd.project_id, pd.file_path, j.team
           FROM permit_documents pd
           LEFT JOIN projects p ON p.id = pd.project_id
           LEFT JOIN jobs j ON j.id = p.job_id
           WHERE pd.id = $1`,
          [docId]
        );
        if (!docRows.length) return res.status(404).json({ error: 'Document not found' });

        const doc = docRows[0];
        // Role-scoped IDOR guard — managers may only delete docs in their team's projects.
        if (req.user.role === 'design_manager' && doc.team !== 'design') {
          return res.status(404).json({ error: 'Document not found' });
        }
        if (req.user.role === 'permitting_manager' && doc.team !== 'permitting') {
          return res.status(404).json({ error: 'Document not found' });
        }

        // Perform the DELETE (doc existence + scope already verified above).
        const { rows } = await pool.query(
          `DELETE FROM permit_documents WHERE id = $1 RETURNING file_path, id`,
          [docId]
        );
        if (!rows[0]) return res.status(404).json({ error: 'Document not found' });

        // Remove file from disk — non-fatal if already gone.
        try { fs.unlinkSync(path.join(uploadDir, rows[0].file_path)); }
        catch (_) { /* file may already be missing — non-fatal */ }

        logAudit(pool, {
          req,
          action: 'project_document.delete',
          entity_type: 'project_document',
          entity_id: rows[0].id,
          before: { file_path: rows[0].file_path },
          source: 'admin',
        }).catch(() => {});

        res.json({ ok: true });
      } catch (e) { serverError(res, e, 'DELETE'); }
    }
  );

  // ── Keystone project documents (a "project" = a service_area_job) ──────────
  // Same hardened pipeline as the legacy routes above, but: (a) scoped to
  // service_area_jobs, not the legacy projects table; (b) 2 GB cap (DWG
  // deliverables are large); (c) carries a status tag + doc_type (Final DWG /
  // Final PDF / Permit Application / …). Downloads reuse the path-guarded
  // /uploads/<file_path> static route. Documents attach to ENGINEERING projects
  // only (design / permitting / inspection).
  const STAFF_DOC_ROLES = ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'];
  const MGR_DOC_ROLES = ['admin', 'design_manager', 'permitting_manager'];

  // 2 GB upload instance — reuses the validated disk storage + fileFilter.
  const bigDocUpload = multer({
    storage: docStorage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB — DWG deliverables
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) return cb(new Error(`File extension ${ext || '(none)'} not permitted`));
      if (!ALLOWED_MIMES.has(file.mimetype)) return cb(new Error(`Content-Type ${file.mimetype} not permitted`));
      cb(null, true);
    },
  });

  function bigServerError(res, e, where) {
    console.error(`[project_documents:${where}]`, e && e.message);
    if (e && e.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large. Maximum size is 2 GB.' });
    if (e && e.message && (e.message.includes('not permitted') || e.message.includes('content does not match'))) {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: 'Internal error.' });
  }

  async function loadJob(jobId) {
    const { rows } = await pool.query(
      `SELECT id, team, cost_category FROM service_area_jobs WHERE id = $1`, [jobId]);
    return rows[0] || null;
  }
  const isEngineering = (job) => !!job && (job.cost_category === 'engineering' || ['permitting', 'design', 'inspection'].includes(job.team));
  // Discipline scope parity with the legacy routes: discipline-roled users only
  // see their own team's projects; admin sees all.
  function jobScopeOk(user, team) {
    if (user.role === 'admin') return true;
    if (user.role.startsWith('design_')) return team === 'design';
    if (user.role.startsWith('permitting_')) return team === 'permitting';
    return false;
  }

  // POST /api/service-area-jobs/:jobId/documents — upload a document for a project.
  app.post('/api/service-area-jobs/:jobId/documents',
    requireAuth(STAFF_DOC_ROLES),
    bigDocUpload.single('file'),
    async (req, res) => {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded — check file size (2 GB max)' });
      const cleanup = () => { try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch (_) {} };
      try {
        const job = await loadJob(req.params.jobId);
        if (!job || !jobScopeOk(req.user, job.team)) { cleanup(); return res.status(404).json({ error: 'Project not found' }); }
        if (!isEngineering(job)) { cleanup(); return res.status(400).json({ error: 'Documents attach to engineering projects only' }); }

        // Magic-byte verification — read first 12 bytes from disk.
        const fd = await fsp.open(path.join(uploadDir, req.file.filename), 'r');
        const buf = Buffer.alloc(12);
        await fd.read(buf, 0, 12, 0); await fd.close();
        if (!hasValidMagicBytes(buf, req.file.mimetype)) { cleanup(); return res.status(400).json({ error: 'File content does not match declared type' }); }

        const { rows } = await pool.query(`
          INSERT INTO permit_documents
            (service_area_job_id, doc_type, status, file_name, file_path, file_size,
             revision_number, uploaded_by, uploaded_by_user_id, notes, content_type)
          VALUES ($1,$2,$3,$4,$5,$6,1,$7,$8,$9,$10) RETURNING *
        `, [req.params.jobId, req.body.doc_type || 'document', req.body.status || null,
          req.file.originalname, req.file.filename, req.file.size,
          req.user.id, req.user.id, req.body.notes || null, req.file.mimetype]);

        logAudit(pool, { req, action: 'project_document.upload', entity_type: 'service_area_job_document',
          entity_id: rows[0].id, after: rows[0], source: 'admin' }).catch(() => {});
        res.json(rows[0]);
      } catch (e) { cleanup(); return bigServerError(res, e, 'saj-POST'); }
    }
  );

  // GET /api/service-area-jobs/:jobId/documents — list a project's documents.
  app.get('/api/service-area-jobs/:jobId/documents',
    requireAuth(STAFF_DOC_ROLES),
    async (req, res) => {
      try {
        const job = await loadJob(req.params.jobId);
        if (!job || !jobScopeOk(req.user, job.team)) return res.status(404).json({ error: 'Project not found' });
        const { rows } = await pool.query(
          `SELECT pd.*, COALESCE(u.full_name, u.username) AS uploaded_by_name
             FROM permit_documents pd
             LEFT JOIN users u ON u.id = pd.uploaded_by_user_id
            WHERE pd.service_area_job_id = $1 ORDER BY pd.created_at DESC`, [req.params.jobId]);
        res.json(rows);
      } catch (e) { return bigServerError(res, e, 'saj-GET'); }
    }
  );

  // PATCH /api/service-area-job-documents/:docId — retag status / doc_type / notes.
  app.patch('/api/service-area-job-documents/:docId',
    requireAuth(STAFF_DOC_ROLES),
    async (req, res) => {
      const sets = [], vals = [req.params.docId]; let i = 2;
      for (const f of ['status', 'doc_type', 'notes']) {
        if (Object.prototype.hasOwnProperty.call(req.body, f)) {
          sets.push(`${f} = $${i}`); vals.push(req.body[f] === '' ? null : req.body[f]); i++;
        }
      }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
      try {
        // Scope: join to the job's team so discipline-roled users can't retag others'.
        const chk = await pool.query(
          `SELECT saj.team FROM permit_documents pd
             JOIN service_area_jobs saj ON saj.id = pd.service_area_job_id
            WHERE pd.id = $1`, [req.params.docId]);
        if (!chk.rows.length || !jobScopeOk(req.user, chk.rows[0].team)) return res.status(404).json({ error: 'Document not found' });
        const { rows } = await pool.query(
          `UPDATE permit_documents SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, vals);
        res.json(rows[0]);
      } catch (e) { return bigServerError(res, e, 'saj-PATCH'); }
    }
  );

  // DELETE /api/service-area-job-documents/:docId — delete a project document.
  app.delete('/api/service-area-job-documents/:docId',
    requireAuth(MGR_DOC_ROLES),
    async (req, res) => {
      try {
        const chk = await pool.query(
          `SELECT pd.id, pd.file_path, saj.team FROM permit_documents pd
             JOIN service_area_jobs saj ON saj.id = pd.service_area_job_id
            WHERE pd.id = $1`, [req.params.docId]);
        if (!chk.rows.length || !jobScopeOk(req.user, chk.rows[0].team)) return res.status(404).json({ error: 'Document not found' });
        await pool.query(`DELETE FROM permit_documents WHERE id = $1`, [req.params.docId]);
        try { fs.unlinkSync(path.join(uploadDir, chk.rows[0].file_path)); } catch (_) {}
        logAudit(pool, { req, action: 'project_document.delete', entity_type: 'service_area_job_document',
          entity_id: req.params.docId, before: { file_path: chk.rows[0].file_path }, source: 'admin' }).catch(() => {});
        res.json({ ok: true });
      } catch (e) { return bigServerError(res, e, 'saj-DELETE'); }
    }
  );

  // GET /api/_debug/uploads — diagnostic endpoint for upload volume health check.
  // requireAdmin gate prevents UPLOAD_DIR path exposure to non-admins.
  app.get('/api/_debug/uploads', requireAdmin, async (req, res) => {
    try {
      const onDisk = await fsp.readdir(uploadDir);
      const dbDocs = await pool.query(
        `SELECT id, file_name, file_path, file_size, doc_type, created_at
         FROM permit_documents ORDER BY created_at DESC LIMIT 25`
      );
      const dbPaths = new Set(dbDocs.rows.map(d => d.file_path));
      const matched = onDisk.filter(f => dbPaths.has(f));
      const orphanFiles = onDisk.filter(f => !dbPaths.has(f));
      const missingFiles = dbDocs.rows.filter(d => !onDisk.includes(d.file_path));

      const sizeBytes = await onDisk.reduce(async (accP, f) => {
        const acc = await accP;
        try { return acc + (await fsp.stat(path.join(uploadDir, f))).size; } catch { return acc; }
      }, Promise.resolve(0));

      res.json({
        total_files_on_disk: onDisk.length,
        total_size_mb: (sizeBytes / (1024 * 1024)).toFixed(2),
        db_doc_count_recent: dbDocs.rows.length,
        matched_count: matched.length,
        orphan_file_count: orphanFiles.length,
        missing_file_count: missingFiles.length,
        first_5_files_on_disk: onDisk.slice(0, 5),
        missing_files_sample: missingFiles.slice(0, 5).map(d => ({
          file_name: d.file_name, file_path: d.file_path, doc_type: d.doc_type
        })),
        hint: missingFiles.length > 0
          ? 'Files in DB but not on disk → Railway volume is NOT mounted at UPLOAD_DIR. Set the UPLOAD_DIR env var to your volume mount path (e.g. /data/uploads) and redeploy.'
          : (onDisk.length === 0 ? 'No files on disk yet — upload a test file via the UI then refresh this endpoint.' : 'Looks healthy.'),
      });
    } catch (e) {
      console.error('[project_documents:debug]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });
};
