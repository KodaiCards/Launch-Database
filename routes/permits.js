// routes/permits.js — permitting pipeline list + stage advance/regress + document upload.
//
// Items 2, 5, 8 fix:
//   - requireAuth(['admin','permitting_manager','permitting_engineer']) added to advance/regress
//   - Body actor fallback dropped — force req.user.username
//   - uploaded_by sourced from req.user.id not body (item 5)
//   - requireAuth role gate added to document upload (item 5)
//
// Wave 154 fix (P-1 HIGH, P-2 HIGH, P-3 MED):
//   - P-1: advance + regress validate project exists AND project_type = 'permitting' before touching stages
//   - P-2: document upload validates project exists + correct type; deletes orphan multer file on 404
//   - P-3: advance wrapped in serializing transaction (BEGIN/FOR UPDATE/COMMIT) to prevent
//          concurrent duplicate-stage inserts
//
// Pipeline stages: potential → started → submitted → approved → checklist.
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const fs = require('fs');
const path = require('path');
const PERMIT_STAGES = ['potential','started','submitted','approved','checklist'];
const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

// Resolve the upload directory the same way server.js does so orphan-file
// deletion after a 404 hits the right path.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

module.exports = function installPermitsRoutes(app, pool, mw) {
  const { upload } = mw;
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  // Wave 1.5 [UNGATED]: GET /api/permits was missing auth.
  app.get('/api/permits', requireAuth(['admin', 'permitting_manager', 'permitting_engineer']), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT p.*,
          cl.name as client_name,
          co.contract_number,
          ps_cur.stage as current_stage,
          (SELECT json_agg(ps2 ORDER BY ps2.created_at) FROM permit_stages ps2 WHERE ps2.project_id=p.id) as stages,
          (SELECT json_agg(pd ORDER BY pd.created_at DESC) FROM permit_documents pd WHERE pd.project_id=p.id) as documents
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN contracts co ON co.id = p.contract_id
        LEFT JOIN LATERAL (
          SELECT stage FROM permit_stages WHERE project_id=p.id AND completed_at IS NULL
          ORDER BY created_at LIMIT 1
        ) ps_cur ON true
        WHERE p.project_type = 'permitting'
        ORDER BY p.created_at DESC
      `);
      res.json(rows);
    } catch (e) {
      console.error('[permits:GET /api/permits]', e && e.message);
      res.status(500).json({ error: 'Failed to load permits.' });
    }
  });

  // Items 2 + 8 fix: requireAuth added; body actor fallback removed.
  // Wave 154 P-1 + P-3: project type gate + serializing transaction.
  app.put('/api/permits/:projectId/advance',
    requireAuth(['admin', 'permitting_manager', 'permitting_engineer']),
    async (req, res) => {
    const { notes } = req.body;
    const { projectId } = req.params;
    // Force actor from authenticated user — never trust body.updated_by
    const actor = req.user.full_name || req.user.username;

    // P-1: validate project exists and is a permit project before touching stages.
    // Return 404 either way to avoid leaking existence of non-permit projects.
    const { rows: projRows } = await pool.query(
      'SELECT id, project_type FROM projects WHERE id = $1',
      [projectId]
    ).catch(() => ({ rows: [] }));
    if (!projRows.length || projRows[0].project_type !== 'permitting') {
      return res.status(404).json({ error: 'Project not found' });
    }

    // P-3: acquire a connection + begin transaction so concurrent advance
    // requests serialize on the FOR UPDATE row lock rather than racing.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Lock the current-stage row for update so a second concurrent request
      // waits here instead of reading the same stage and duplicating work.
      const { rows: current } = await client.query(
        'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1 FOR UPDATE',
        [projectId]
      );
      const currentStage = current[0]?.stage || 'potential';
      const nextIdx = PERMIT_STAGES.indexOf(currentStage) + 1;
      if (nextIdx >= PERMIT_STAGES.length) {
        await client.query('ROLLBACK');
        client.release();
        return res.json({ message: 'Already at final stage' });
      }
      const nextStage = PERMIT_STAGES[nextIdx];

      // Complete current stage
      await client.query(
        'UPDATE permit_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
        [notes, actor, projectId, currentStage]
      );
      // Create next stage
      await client.query(
        'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
        [projectId, nextStage, actor]
      );
      await client.query('COMMIT');
      client.release();

      broadcast('admin', 'permit_updated', { project_id: projectId, stage: nextStage });
      broadcast('team:permitting', 'permit_updated', { project_id: projectId, stage: nextStage });
      logAudit(pool, {
        req,
        action: 'permit.stage_advance',
        entity_type: 'project',
        entity_id: projectId,
        before: { stage: currentStage },
        after: { stage: nextStage, notes },
        source: 'admin_ui',
        meta: { previous_stage: currentStage, next_stage: nextStage },
      }).catch(() => {});
      res.json({ previous: currentStage, current: nextStage });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      client.release();
      console.error('[permits:advance]', e && e.message);
      res.status(500).json({ error: 'Failed to advance permit stage.' });
    }
  });

  // Items 2 + 8 fix: requireAuth added; body actor fallback removed.
  // Wave 154 P-1: project type gate added.
  app.put('/api/permits/:projectId/regress',
    requireAuth(['admin', 'permitting_manager', 'permitting_engineer']),
    async (req, res) => {
    const { projectId } = req.params;
    // Force actor from authenticated user
    const actor = req.user.full_name || req.user.username;

    // P-1: validate project exists and is a permit project.
    // Return 404 either way to avoid leaking existence of non-permit projects.
    const { rows: projRows } = await pool.query(
      'SELECT id, project_type FROM projects WHERE id = $1',
      [projectId]
    ).catch(() => ({ rows: [] }));
    if (!projRows.length || projRows[0].project_type !== 'permitting') {
      return res.status(404).json({ error: 'Project not found' });
    }

    try {
      const { rows: current } = await pool.query(
        'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
        [projectId]
      );
      const currentStage = current[0]?.stage || PERMIT_STAGES[PERMIT_STAGES.length - 1];
      const currentIdx = PERMIT_STAGES.indexOf(currentStage);
      if (currentIdx <= 0) return res.status(400).json({ error: 'Already at the first stage' });
      const prevStage = PERMIT_STAGES[currentIdx - 1];
      // Delete current incomplete stage row
      await pool.query(
        'DELETE FROM permit_stages WHERE project_id=$1 AND stage=$2',
        [projectId, currentStage]
      );
      // Re-open previous stage by clearing its completed_at
      await pool.query(
        'UPDATE permit_stages SET completed_at = NULL, updated_by = $1 WHERE project_id=$2 AND stage=$3',
        [actor, projectId, prevStage]
      );
      broadcast('admin', 'permit_updated', { project_id: projectId, stage: prevStage });
      broadcast('team:permitting', 'permit_updated', { project_id: projectId, stage: prevStage });
      await logAudit(pool, {
        req,
        action: 'permit.stage_regress',
        entity_type: 'project',
        entity_id: projectId,
        before: { stage: currentStage },
        after: { stage: prevStage },
        source: 'admin_ui',
        meta: { regressed_from: currentStage, regressed_to: prevStage },
      });
      res.json({ previous: currentStage, current: prevStage });
    } catch (e) {
      console.error('[permits:regress]', e && e.message);
      res.status(500).json({ error: 'Failed to regress permit stage.' });
    }
  });

  // Item 5 fix: requireAuth role gate added; uploaded_by sourced from req.user.id not body
  // Wave 154 P-2: project type gate added; orphan multer file deleted on 404.
  app.post('/api/permits/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    upload.single('file'),
    async (req, res) => {
    const { doc_type, notes, revision_number } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file' });
    // uploaded_by sourced from authenticated user, never from body
    const uploadedBy = req.user.id;

    // P-2: validate project exists and is a permit project before storing the
    // uploaded file in the DB. If not, delete the multer-staged file to avoid
    // orphans on disk, then return an opaque 404.
    const { rows: projRows } = await pool.query(
      'SELECT id, project_type FROM projects WHERE id = $1',
      [req.params.projectId]
    ).catch(() => ({ rows: [] }));
    if (!projRows.length || projRows[0].project_type !== 'permitting') {
      // Clean up the file multer already wrote to disk
      try {
        fs.unlinkSync(path.join(UPLOAD_DIR, req.file.filename));
      } catch (unlinkErr) {
        console.error('[permits:upload-document] orphan-file cleanup failed', unlinkErr && unlinkErr.message);
      }
      return res.status(404).json({ error: 'Project not found' });
    }

    try {
      const { rows } = await pool.query(`
        INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
      `, [req.params.projectId, doc_type, req.file.originalname, req.file.filename, req.file.size, revision_number || 1, uploadedBy, notes]);
      broadcast('admin', 'permit_updated', { project_id: req.params.projectId, doc_added: true });
      broadcast('team:permitting', 'permit_updated', { project_id: req.params.projectId, doc_added: true });
      await logAudit(pool, {
        req,
        action: 'permit.document_upload',
        entity_type: 'permit_document',
        entity_id: rows[0].id,
        before: null,
        after: { doc_type, file_name: req.file.originalname, file_size: req.file.size, notes },
        source: 'admin_ui',
        meta: { project_id: req.params.projectId, revision: revision_number || 1 },
      });
      res.json(rows[0]);
    } catch (e) {
      console.error('[permits:upload-document]', e && e.message);
      res.status(500).json({ error: 'Failed to save permit document.' });
    }
  });
};
