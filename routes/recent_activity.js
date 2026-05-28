module.exports = function installRecentActivityRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || ((req, res, next) => next());
  const requireAdmin = (mw && mw.requireAdmin) || requireAuth;

  // GET /api/admin/recent-activity?limit=20
  // Returns last N activities across:
  // - project_photos (action='project_photo.upload')
  // - workspace_files (action='workspace.upload')
  // - audit_log (significant actions: project.*, invoice.*, engineering_contract.*, user.*)
  //
  // Response: { activities: [{type, at, actor_name, target_name, project_id, project_name, action, item_id}], total_today }
  app.get('/api/admin/recent-activity', requireAdmin, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);

      const { rows } = await pool.query(`
        WITH photo_activities AS (
          SELECT 'photo' AS type, pp.uploaded_at AS at,
                 u.username AS actor_name, pp.filename AS target_name,
                 pp.project_id, p.name AS project_name,
                 NULL::text AS action,
                 pp.id::text AS item_id
          FROM project_photos pp
          LEFT JOIN users u ON u.id = pp.uploaded_by
          LEFT JOIN projects p ON p.id = pp.project_id
          WHERE pp.status = 'active'
          ORDER BY pp.uploaded_at DESC
          LIMIT $1
        ),
        file_activities AS (
          SELECT 'file' AS type, wf.uploaded_at AS at,
                 u.username AS actor_name, wf.filename AS target_name,
                 f.project_id, p.name AS project_name,
                 NULL::text AS action,
                 wf.id::text AS item_id
          FROM workspace_files wf
          LEFT JOIN users u ON u.id = wf.uploaded_by
          LEFT JOIN workspace_folders f ON f.id = wf.folder_id
          LEFT JOIN projects p ON p.id = f.project_id
          ORDER BY wf.uploaded_at DESC
          LIMIT $1
        ),
        audit_activities AS (
          SELECT 'audit' AS type, al.at,
                 al.actor_username AS actor_name,
                 (al.entity_type || ' "' || COALESCE(al.entity_id, '') || '"') AS target_name,
                 NULL::uuid AS project_id, NULL::text AS project_name,
                 al.action,
                 al.id::text AS item_id
          FROM audit_log al
          WHERE al.action IN (
            'project.create', 'project.update', 'project.delete',
            'invoice.generate', 'invoice.void',
            'engineering_contract.create', 'engineering_contract.update', 'engineering_contract.delete',
            'user.create', 'user.role_change',
            'permit.create', 'permit.update', 'permit.delete',
            'splice_project.create', 'splice_project.update'
          )
            AND al.at >= now() - interval '7 days'
          ORDER BY al.at DESC
          LIMIT $1
        )
        SELECT * FROM photo_activities
        UNION ALL
        SELECT * FROM file_activities
        UNION ALL
        SELECT * FROM audit_activities
        ORDER BY at DESC
        LIMIT $1
      `, [limit]);

      // Count of activities in last 24h for the badge
      const todayCount = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM project_photos WHERE uploaded_at >= now() - interval '24 hours' AND status='active') +
          (SELECT COUNT(*) FROM workspace_files WHERE uploaded_at >= now() - interval '24 hours') +
          (SELECT COUNT(*) FROM audit_log WHERE at >= now() - interval '24 hours' AND action IN (
            'project.create', 'project.update', 'project.delete',
            'invoice.generate', 'invoice.void',
            'engineering_contract.create', 'engineering_contract.update', 'engineering_contract.delete',
            'user.create', 'user.role_change',
            'permit.create', 'permit.update', 'permit.delete',
            'splice_project.create', 'splice_project.update'
          )) AS c
      `);

      res.json({
        activities: rows,
        total_today: parseInt(todayCount.rows[0].c || 0, 10)
      });
    } catch (err) {
      console.error('recent-activity error:', err);
      res.status(500).json({ error: 'Failed to load recent activities' });
    }
  });
};
