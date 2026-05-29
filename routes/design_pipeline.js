// routes/design_pipeline.js — design-team pipeline endpoints.
//
// Items 2 + 9 fix: requireAuth(['admin','design_manager','design_engineer'])
// added to advance/regress; body actor fallback dropped (force req.user).
//
// Design pipeline stages: potential → started → review_process → completed.
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.
//
// Wave 159:
//   DP-H1 HIGH:  advance + regress validate project_type='design' (opaque 404)
//   DP-M1 MED:   advance wrapped in BEGIN/COMMIT/FOR UPDATE transaction
//   DP-L1 LOW:   logAudit called on advance, regress, and is_ongoing toggle
//   DP-L2 LOW:   is_ongoing toggle restricts to design + permitting project types

const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

module.exports = function installDesignPipelineRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());

  // Wave 1.5 [UNGATED]: GET /api/design was missing requireAuth.
  // Bonus item from audit: gated to design team + admin.
  app.get('/api/design', requireAuth(['admin', 'design_manager', 'design_engineer']), async (req, res) => {
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
    } catch (e) {
      console.error('[design_pipeline:GET /api/design]', e && e.message);
      res.status(500).json({ error: 'Failed to load design pipeline.' });
    }
  });

  // PUT /api/projects/:id/ongoing — toggle the is_ongoing flag.
  // Wave 1.5 [UNGATED]: was missing requireAuth; gated to admin/managers.
  // Wave 159 DP-L2: restrict to project types that legitimately carry the
  //   is_ongoing flag (design + permitting). Other project types have no
  //   monthly-invoice workflow; toggling them would trigger erroneous billing.
  // Wave 159 DP-L1: audit trail for toggle.
  app.put('/api/projects/:id/ongoing', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const { is_ongoing } = req.body;
    try {
      // DP-L2: validate project exists and is design or permitting.
      // Return opaque 404 to avoid leaking existence of other project types.
      const { rows: projRows } = await pool.query(
        'SELECT id, project_type FROM projects WHERE id = $1',
        [req.params.id]
      );
      if (!projRows.length || !['design', 'permitting'].includes(projRows[0].project_type)) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const { rows } = await pool.query(
        `UPDATE projects SET is_ongoing = $1 WHERE id = $2 RETURNING id, is_ongoing`,
        [!!is_ongoing, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
      // DP-L1: audit trail
      logAudit(pool, {
        req,
        action: 'design.is_ongoing_change',
        entity_type: 'project',
        entity_id: req.params.id,
        after: { is_ongoing: !!is_ongoing },
        source: 'admin',
      }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[design_pipeline:PUT /api/projects/:id/ongoing]', e && e.message);
      res.status(500).json({ error: 'Failed to update project.' });
    }
  });

  // Items 2 + 9 fix: requireAuth(['admin','design_manager','design_engineer']) added.
  // Actor is forced from req.user — body fallback for unauthorized callers removed.
  // Wave 159 DP-H1: validate project_type='design' before touching stages.
  // Wave 159 DP-M1: wrap the 3-step advance in BEGIN/COMMIT with FOR UPDATE.
  // Wave 159 DP-L1: call logAudit on successful transition.
  app.put('/api/design/:projectId/advance',
    requireAuth(['admin', 'design_manager', 'design_engineer']),
    async (req, res) => {
    const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
    const { notes } = req.body;
    const { projectId } = req.params;
    // Force actor from authenticated user — never trust body.updated_by
    const actor = req.user.full_name || req.user.username;

    // DP-H1: validate project exists and is a design project.
    // Return opaque 404 — avoids leaking existence of non-design projects.
    const { rows: projRows } = await pool.query(
      'SELECT id, project_type FROM projects WHERE id = $1',
      [projectId]
    );
    if (!projRows.length || projRows[0].project_type !== 'design') {
      return res.status(404).json({ error: 'Project not found' });
    }

    // DP-M1: acquire a connection + begin transaction so concurrent advance
    // requests serialize on the FOR UPDATE row lock rather than racing.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Lock the current-stage row so a second concurrent request waits here
      // instead of reading the same stage and duplicating work.
      const { rows: cur } = await client.query(
        'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1 FOR UPDATE',
        [projectId]
      );
      const currentStage = cur[0]?.stage || 'potential';
      const nextIdx = DESIGN_STAGES.indexOf(currentStage) + 1;
      if (nextIdx >= DESIGN_STAGES.length) {
        await client.query('ROLLBACK');
        client.release();
        return res.json({ message: 'Already at final stage' });
      }
      const nextStage = DESIGN_STAGES[nextIdx];

      // Complete current stage
      await client.query(
        'UPDATE design_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
        [notes, actor, projectId, currentStage]
      );
      // Create next stage
      await client.query(
        'INSERT INTO design_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
        [projectId, nextStage, actor]
      );
      // If completed, mark project
      if (nextStage === 'completed') {
        await client.query(
          `UPDATE projects SET status='completed', completed_date=CURRENT_DATE WHERE id=$1`,
          [projectId]
        );
      }
      await client.query('COMMIT');
      client.release();

      broadcast('admin', 'project_updated', { id: projectId });
      broadcast('team:design', 'project_updated', { id: projectId });
      // DP-L1: audit trail for pipeline stage advance
      logAudit(pool, {
        req,
        action: 'design.advance',
        entity_type: 'project',
        entity_id: projectId,
        before: { stage: currentStage },
        after: { stage: nextStage, notes },
        source: 'admin',
      }).catch(() => {});
      res.json({ previous: currentStage, current: nextStage });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      client.release();
      console.error('[design_pipeline:advance]', e && e.message);
      res.status(500).json({ error: 'Failed to advance design stage.' });
    }
  });

  // Items 2 + 9 fix: requireAuth added; body actor fallback removed.
  // Wave 159 DP-H1: validate project_type='design' before touching stages.
  // Wave 159 DP-L1: call logAudit on successful regress.
  app.put('/api/design/:projectId/regress',
    requireAuth(['admin', 'design_manager', 'design_engineer']),
    async (req, res) => {
    const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
    const { projectId } = req.params;
    // Force actor from authenticated user
    const actor = req.user.full_name || req.user.username;

    // DP-H1: validate project exists and is a design project.
    // Return opaque 404 — avoids leaking existence of non-design projects.
    const { rows: projRows } = await pool.query(
      'SELECT id, project_type FROM projects WHERE id = $1',
      [projectId]
    );
    if (!projRows.length || projRows[0].project_type !== 'design') {
      return res.status(404).json({ error: 'Project not found' });
    }

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
      broadcast('admin', 'project_updated', { id: projectId });
      broadcast('team:design', 'project_updated', { id: projectId });
      // DP-L1: audit trail for pipeline stage regress
      logAudit(pool, {
        req,
        action: 'design.regress',
        entity_type: 'project',
        entity_id: projectId,
        before: { stage: currentStage },
        after: { stage: prevStage },
        source: 'admin',
      }).catch(() => {});
      res.json({ previous: currentStage, current: prevStage });
    } catch (e) {
      console.error('[design_pipeline:regress]', e && e.message);
      res.status(500).json({ error: 'Failed to regress design stage.' });
    }
  });
};
