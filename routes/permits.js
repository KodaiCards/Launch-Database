// routes/permits.js — permitting pipeline list + stage advance/regress + document upload.
//
// Items 2, 5, 8 fix:
//   - requireAuth(['admin','permitting_manager','permitting_engineer']) added to advance/regress
//   - Body actor fallback dropped — force req.user.username
//   - uploaded_by sourced from req.user.id not body (item 5)
//   - requireAuth role gate added to document upload (item 5)
//
// Pipeline stages: potential → started → submitted → approved → checklist.
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const PERMIT_STAGES = ['potential','started','submitted','approved','checklist'];
const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

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
  app.put('/api/permits/:projectId/advance',
    requireAuth(['admin', 'permitting_manager', 'permitting_engineer']),
    async (req, res) => {
    const { notes } = req.body;
    const { projectId } = req.params;
    // Force actor from authenticated user — never trust body.updated_by
    const actor = req.user.full_name || req.user.username;
    try {
      // Get current stage
      const { rows: current } = await pool.query(
        'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
        [projectId]
      );
      const currentStage = current[0]?.stage || 'potential';
      const nextIdx = PERMIT_STAGES.indexOf(currentStage) + 1;
      if (nextIdx >= PERMIT_STAGES.length) return res.json({ message: 'Already at final stage' });
      const nextStage = PERMIT_STAGES[nextIdx];

      // Complete current stage
      await pool.query(
        'UPDATE permit_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
        [notes, actor, projectId, currentStage]
      );
      // Create next stage
      await pool.query(
        'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
        [projectId, nextStage, actor]
      );
      broadcast('admin', 'permit_updated', { project_id: projectId, stage: nextStage });
      broadcast('team:permitting', 'permit_updated', { project_id: projectId, stage: nextStage });
      await logAudit(pool, {
        req,
        action: 'permit.stage_advance',
        entity_type: 'project',
        entity_id: projectId,
        before: { stage: currentStage },
        after: { stage: nextStage, notes },
        source: 'admin_ui',
        meta: { previous_stage: currentStage, next_stage: nextStage },
      });
      res.json({ previous: currentStage, current: nextStage });
    } catch (e) {
      console.error('[permits:advance]', e && e.message);
      res.status(500).json({ error: 'Failed to advance permit stage.' });
    }
  });

  // Items 2 + 8 fix: requireAuth added; body actor fallback removed.
  app.put('/api/permits/:projectId/regress',
    requireAuth(['admin', 'permitting_manager', 'permitting_engineer']),
    async (req, res) => {
    const { projectId } = req.params;
    // Force actor from authenticated user
    const actor = req.user.full_name || req.user.username;
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
  app.post('/api/permits/:projectId/documents',
    requireAuth(['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer']),
    upload.single('file'),
    async (req, res) => {
    const { doc_type, notes, revision_number } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file' });
    // uploaded_by sourced from authenticated user, never from body
    const uploadedBy = req.user.id;
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
