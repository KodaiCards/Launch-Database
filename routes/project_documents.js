// routes/project_documents.js — generic per-project document storage.
//
// Items 5 + 16 fix:
//   - requireAuth role gate added to POST/GET/DELETE on documents
//   - requireAdmin added to /api/_debug/uploads
//   - uploaded_by sourced from req.user.id not body
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const fs = require('fs');
const path = require('path');

module.exports = function installProjectDocumentsRoutes(app, pool, mw) {
  const { upload, uploadDir } = mw;
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  // Generic project documents endpoint — works for ANY project (design or permit).
  // Item 5 fix: requireAuth role gate added; uploaded_by sourced from req.user.id
  app.post('/api/projects/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    upload.single('file'),
    async (req, res) => {
    const { doc_type, notes } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded — check file size (2 GB max)' });
    // uploaded_by sourced from authenticated user, never from body
    const uploadedBy = req.user.id;
    try {
      const { rows } = await pool.query(`
        INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1,$2,$3,$4,$5,1,$6,$7) RETURNING *
      `, [req.params.projectId, doc_type || 'document', req.file.originalname, req.file.filename, req.file.size, uploadedBy, notes]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Item 5 fix: requireAuth gate added to document listing
  app.get('/api/projects/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM permit_documents WHERE project_id = $1 ORDER BY created_at DESC`,
        [req.params.projectId]
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Item 5 fix: requireAuth gate added to document delete
  app.delete('/api/projects/documents/:docId',
    requireAuth(['admin', 'design_manager', 'permitting_manager']),
    async (req, res) => {
    try {
      // Look up file_path so we can also remove the file from disk.
      const { rows } = await pool.query(
        `DELETE FROM permit_documents WHERE id = $1 RETURNING file_path`,
        [req.params.docId]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Document not found' });
      try { fs.unlinkSync(path.join(uploadDir, rows[0].file_path)); }
      catch (e) { /* file may already be missing — non-fatal */ }
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Diagnostic — useful when "PDF won't open" issues happen.
  // Item 5/16 fix: requireAdmin gate added (was completely unprotected,
  // leaked UPLOAD_DIR path and file listings)
  app.get('/api/_debug/uploads', requireAdmin, async (req, res) => {
    try {
      const onDisk = fs.readdirSync(uploadDir);
      const dbDocs = await pool.query(
        `SELECT id, file_name, file_path, file_size, doc_type, created_at
         FROM permit_documents ORDER BY created_at DESC LIMIT 25`
      );
      const dbPaths = new Set(dbDocs.rows.map(d => d.file_path));
      const matched = onDisk.filter(f => dbPaths.has(f));
      const orphanFiles = onDisk.filter(f => !dbPaths.has(f));
      const missingFiles = dbDocs.rows.filter(d => !onDisk.includes(d.file_path));

      res.json({
        UPLOAD_DIR_resolved: uploadDir,
        env_UPLOAD_DIR: process.env.UPLOAD_DIR || '(not set — using default)',
        total_files_on_disk: onDisk.length,
        total_size_mb: (onDisk.reduce((s, f) => {
          try { return s + fs.statSync(path.join(uploadDir, f)).size; } catch { return s; }
        }, 0) / (1024 * 1024)).toFixed(2),
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
          : (onDisk.length === 0 ? 'No files on disk yet — upload a test file via the UI then refresh this endpoint.' : 'Looks healthy.')
      });
    } catch (e) {
      res.status(500).json({ error: e.message, UPLOAD_DIR: uploadDir });
    }
  });
};
