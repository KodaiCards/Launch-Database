// routes/client_portal.js — client-facing project status view (beta).
//
// Wave 13: replaces client-portal-placeholder.html with a real three-column
// Design / Permitting / Construction view. Auth is requireAuth() so any
// logged-in user can reach it; tile-level access control in PORTAL_DEFS
// handles who sees the tile.
//
// Exclusions:
//   - is_rollup rows (folder/organizer nodes only)
//   - project_type = 'potential' (pre-pipeline candidates)
//   - status = 'archived' (soft-deleted / inactive)
//
// derived_status is server-computed from existing columns so no migration
// is needed:
//   not_started  → active + zero actual_hours
//   in_progress  → active + some actual_hours
//   completed    → status='completed'
//   billed       → status='billed'

module.exports = function installClientPortalRoutes(app, pool, { requireAuth }) {
  app.get('/api/client-portal/projects', requireAuth(), async (req, res) => {
    const params = [];
    let i = 1;

    // Optional admin preview: ?client_id= scopes to a single client.
    const clientFilter = req.query.client_id
      ? `AND p.client_id = $${i++}`
      : '';
    if (req.query.client_id) params.push(req.query.client_id);

    try {
      const { rows } = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.project_type,
          p.status,
          CASE
            WHEN p.status = 'billed'                                THEN 'billed'
            WHEN p.status = 'completed'                             THEN 'completed'
            WHEN p.status = 'active' AND COALESCE(p.actual_hours, 0) > 0 THEN 'in_progress'
            ELSE                                                         'not_started'
          END AS derived_status,
          p.expected_revenue,
          p.actual_hours,
          p.expected_hours,
          p.footage,
          p.miles,
          cl.name AS client_name
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE
          COALESCE(p.is_rollup, false) = false
          AND LOWER(p.project_type) != 'potential'
          AND p.status NOT IN ('archived')
          ${clientFilter}
        ORDER BY p.client_id, p.project_type, p.name
      `, params);

      res.json(rows);
    } catch (e) {
      console.error('[client_portal:projects]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects.' });
    }
  });
};
