// routes/permits.js — permitting pipeline list + stage advance/regress + document upload.
//
// Pipeline stages: potential → started → submitted → approved → checklist.
// "billed" was removed in a prior cleanup (older permit_stages rows with
// stage='billed' may still exist; the pipeline UI ignores them and reads
// billing status from projects.billed_date instead).
//
//   GET  /api/permits                          — projects with project_type='permitting'
//                                                plus current stage + history + docs
//   PUT  /api/permits/:projectId/advance       — move to next stage
//   PUT  /api/permits/:projectId/regress       — back up one stage
//   POST /api/permits/:projectId/documents     — upload a permit document (multer)
//
// Uses the multer `upload` instance from server.js, passed via mw.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const PERMIT_STAGES = ['potential','started','submitted','approved','checklist'];
const { broadcast } = require('./_sse');

module.exports = function installPermitsRoutes(app, pool, mw) {
  const { upload } = mw;

  app.get('/api/permits', async (req, res) => {
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
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/permits/:projectId/advance', async (req, res) => {
    const { updated_by, notes } = req.body;
    const { projectId } = req.params;
    try {
      // Actor is the logged-in user's full name or username; falls back to
      // request body for legacy/non-authed callers, then to "system" so we
      // always have something to write.
      const actor = (req.user?.full_name || req.user?.username) || updated_by || 'system';

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
      res.json({ previous: currentStage, current: nextStage });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Regress (back up) the permit pipeline by one stage. Re-opens the previous
  // stage row (clears its completed_at) and deletes the current stage's row
  // entirely so it'll get re-created on the next advance with a fresh timestamp.
  // Requires the project to NOT be at 'potential' (the very first stage).
  app.put('/api/permits/:projectId/regress', async (req, res) => {
    const { projectId } = req.params;
    const actor = (req.user?.full_name || req.user?.username) || req.body?.updated_by || 'system';
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
      res.json({ previous: currentStage, current: prevStage });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/permits/:projectId/documents', upload.single('file'), async (req, res) => {
    const { doc_type, uploaded_by, notes, revision_number } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file' });
    try {
      const { rows } = await pool.query(`
        INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
      `, [req.params.projectId, doc_type, req.file.originalname, req.file.filename, req.file.size, revision_number || 1, uploaded_by, notes]);
      broadcast('admin', 'permit_updated', { project_id: req.params.projectId, doc_added: true });
      broadcast('team:permitting', 'permit_updated', { project_id: req.params.projectId, doc_added: true });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
