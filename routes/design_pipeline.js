// routes/design_pipeline.js — design-team pipeline endpoints.
//
// /api/design                              — list of design projects with
//                                            current pipeline stage
// /api/design/:projectId/advance           — move to next stage
// /api/design/:projectId/regress           — move back one stage
// /api/projects/:id/ongoing                — toggle is_ongoing flag (used by
//                                            the Inspection view's checkbox
//                                            but lives on the project, not
//                                            the design pipeline; grouped
//                                            here because it's small and
//                                            project-status-adjacent)
//
// Design pipeline stages: potential → started → review_process → completed.
// Reaching 'completed' marks the project status='completed' + sets
// completed_date; regressing from 'completed' un-marks both.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installDesignPipelineRoutes(app, pool, mw) {
  app.get('/api/design', async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT p.*, cl.name as client_name, co.contract_number,
          (SELECT stage FROM design_stages WHERE project_id=p.id AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1) as current_stage
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        LEFT JOIN contracts co ON co.id=p.contract_id
        WHERE p.project_type='design'
        ORDER BY p.created_at DESC
      `);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // PUT /api/projects/:id/ongoing — toggle the is_ongoing flag.
  // Used by the Inspection view's checkbox column.
  app.put('/api/projects/:id/ongoing', async (req, res) => {
    const { is_ongoing } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE projects SET is_ongoing = $1 WHERE id = $2 RETURNING id, is_ongoing`,
        [!!is_ongoing, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/design/:projectId/advance', async (req, res) => {
    const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
    const { updated_by, notes } = req.body;
    const { projectId } = req.params;
    const actor = (req.user?.full_name || req.user?.username) || updated_by || 'system';
    try {
      const { rows: cur } = await pool.query(
        'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1',
        [projectId]
      );
      const currentStage = cur[0]?.stage || 'potential';
      const nextIdx = DESIGN_STAGES.indexOf(currentStage) + 1;
      if (nextIdx >= DESIGN_STAGES.length) return res.json({ message: 'Already at final stage' });
      const nextStage = DESIGN_STAGES[nextIdx];

      // Complete current stage
      await pool.query(
        'UPDATE design_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
        [notes, actor, projectId, currentStage]
      );
      // Create next stage
      await pool.query(
        'INSERT INTO design_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
        [projectId, nextStage, actor]
      );
      // If completed, mark project
      if (nextStage === 'completed') {
        await pool.query(
          `UPDATE projects SET status='completed', completed_date=CURRENT_DATE WHERE id=$1`,
          [projectId]
        );
      }
      res.json({ previous: currentStage, current: nextStage });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Design pipeline regress — back up one stage. Mirrors permits regress.
  app.put('/api/design/:projectId/regress', async (req, res) => {
    const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
    const { projectId } = req.params;
    const actor = (req.user?.full_name || req.user?.username) || req.body?.updated_by || 'system';
    try {
      const { rows: cur } = await pool.query(
        'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1',
        [projectId]
      );
      let currentStage = cur[0]?.stage;
      // If no incomplete stage, project might be at 'completed' (which closes the row).
      // In that case treat 'completed' as current.
      if (!currentStage) {
        const { rows: lastDone } = await pool.query(
          'SELECT stage FROM design_stages WHERE project_id=$1 ORDER BY created_at DESC LIMIT 1',
          [projectId]
        );
        currentStage = lastDone[0]?.stage || DESIGN_STAGES[DESIGN_STAGES.length - 1];
      }
      const currentIdx = DESIGN_STAGES.indexOf(currentStage);
      if (currentIdx <= 0) return res.status(400).json({ error: 'Already at the first stage' });
      const prevStage = DESIGN_STAGES[currentIdx - 1];
      // Delete current stage row (whether complete or not)
      await pool.query('DELETE FROM design_stages WHERE project_id=$1 AND stage=$2', [projectId, currentStage]);
      // Re-open previous stage
      await pool.query(
        'UPDATE design_stages SET completed_at = NULL, updated_by = $1 WHERE project_id=$2 AND stage=$3',
        [actor, projectId, prevStage]
      );
      // If the project was marked completed by an earlier advance, un-complete it.
      if (currentStage === 'completed') {
        await pool.query(
          `UPDATE projects SET status='active', completed_date=NULL WHERE id=$1`,
          [projectId]
        );
      }
      res.json({ previous: currentStage, current: prevStage });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
