// routes/project_documents.js — generic per-project document storage.
//
// Reuses the permit_documents table (the schema is identical for our
// needs), so admin Design pipeline can drop a "Final Map" PDF/DWG on any
// project even if the project isn't a permit. Permit-specific upload
// (which carries doc_type, revision_number, etc.) lives in routes/permits.js.
//
//   POST   /api/projects/:projectId/documents  — upload a file (multer)
//   GET    /api/projects/:projectId/documents  — list project's documents
//   DELETE /api/projects/documents/:docId      — remove DB row + disk file
//   GET    /api/_debug/uploads                 — diagnostic: mismatch
//                                                between disk and DB. Use
//                                                this when "PDF won't open"
//                                                issues happen — usually
//                                                Railway volume not mounted.
//
// Uses the multer `upload` instance + UPLOAD_DIR (passed via mw).
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const fs = require('fs');
const path = require('path');

module.exports = function installProjectDocumentsRoutes(app, pool, mw) {
  const { upload, uploadDir } = mw;

  // Generic project documents endpoint — works for ANY project (design or permit).
  // Reuses permit_documents table since the schema is identical for our needs.
  // Used by the admin Design pipeline's "Final Map" upload UI, which doesn't
  // care about revision tracking or doc_type categorization (just a single
  // drop slot for the final drawing/PDF/DWG).
  app.post('/api/projects/:projectId/documents', upload.single('file'), async (req, res) => {
    const { doc_type, uploaded_by, notes } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded — check file size (500MB max)' });
    try {
      const { rows } = await pool.query(`
        INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1,$2,$3,$4,$5,1,$6,$7) RETURNING *
      `, [req.params.projectId, doc_type || 'document', req.file.originalname, req.file.filename, req.file.size, uploaded_by, notes]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/projects/:projectId/documents', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM permit_documents WHERE project_id = $1 ORDER BY created_at DESC`,
        [req.params.projectId]
      );
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/projects/documents/:docId', async (req, res) => {
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

  // Diagnostic — useful when "PDF won't open" issues happen. Hit this in the
  // browser to verify (a) where the server thinks UPLOAD_DIR is, (b) whether
  // the directory actually has files, and (c) whether file_path values in the DB
  // match what's on disk. Most "file not found" issues are caused by the Railway
  // volume not being mounted at UPLOAD_DIR (so files write to ephemeral storage
  // and disappear on redeploy).
  app.get('/api/_debug/uploads', async (req, res) => {
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
          ? '⚠ Files in DB but not on disk → Railway volume is NOT mounted at UPLOAD_DIR. Set the UPLOAD_DIR env var to your volume mount path (e.g. /data/uploads) and redeploy.'
          : (onDisk.length === 0 ? 'No files on disk yet — upload a test file via the UI then refresh this endpoint.' : 'Looks healthy.')
      });
    } catch (e) {
      res.status(500).json({ error: e.message, UPLOAD_DIR: uploadDir });
    }
  });
};
