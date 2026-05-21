// routes/client_portal.js — client-facing project status view (beta).
//
// Wave 13: replaces client-portal-placeholder.html with a real three-column
// Design / Permitting / Construction view. Auth is requireAuth() so any
// logged-in user can reach it; tile-level access control in PORTAL_DEFS
// handles who sees the tile.
//
// Wave 13B: per-client scoping.
//   - customer role: scoped to their customer_clients rows only.
//   - admin/staff:   ?client_id= scopes to one client; omit for all clients.
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

  // ─── Helper: resolve client IDs for the requesting user ──────────────────
  // Returns null  for admin/staff (no restriction).
  // Returns []    for a customer with no linked clients.
  // Returns [ids] for a customer with linked clients.
  async function resolveClientIds(user) {
    if (user.role !== 'customer') return null;
    const { rows } = await pool.query(
      `SELECT client_id FROM customer_clients WHERE user_id = $1`, [user.id]
    );
    return rows.map(r => r.client_id);
  }

  // ─── GET /api/client-portal/projects ────────────────────────────────────
  app.get('/api/client-portal/projects', requireAuth(), async (req, res) => {
    try {
      const customerIds = await resolveClientIds(req.user);

      const params = [];
      let i = 1;
      let clientFilter = '';

      if (customerIds !== null) {
        // customer role — scope to their linked clients
        if (customerIds.length === 0) return res.json([]);
        clientFilter = `AND p.client_id = ANY($${i++}::uuid[])`;
        params.push(customerIds);
      } else if (req.query.client_id) {
        // admin/staff with explicit ?client_id= filter
        clientFilter = `AND p.client_id = $${i++}`;
        params.push(req.query.client_id);
      }
      // else admin/staff with no filter — return all clients

      const { rows } = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.project_type,
          p.status,
          CASE
            WHEN p.status = 'billed'                                     THEN 'billed'
            WHEN p.status = 'completed'                                  THEN 'completed'
            WHEN p.status = 'active' AND COALESCE(p.actual_hours, 0) > 0 THEN 'in_progress'
            ELSE                                                              'not_started'
          END AS derived_status,
          p.expected_revenue,
          p.actual_hours,
          p.expected_hours,
          p.footage,
          p.miles,
          p.client_id,
          cl.name AS client_name
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE
          COALESCE(p.is_rollup, false) = false
          AND LOWER(p.project_type) != 'potential'
          AND p.status NOT IN ('archived')
          ${clientFilter}
        ORDER BY cl.name, p.project_type, p.name
      `, params);

      res.json(rows);
    } catch (e) {
      console.error('[client_portal:projects]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects.' });
    }
  });

  // ─── GET /api/client-portal/clients-with-active-projects ─────────────────
  // Returns [{ id, name }] of clients that have at least one portal-visible
  // project (design or permitting type, non-archived).
  // customer role: filtered to their own linked clients.
  // admin/staff:   all clients with matching projects.
  app.get('/api/client-portal/clients-with-active-projects', requireAuth(), async (req, res) => {
    try {
      const customerIds = await resolveClientIds(req.user);

      const params = [];
      let i = 1;
      let customerFilter = '';

      if (customerIds !== null) {
        if (customerIds.length === 0) return res.json([]);
        customerFilter = `AND cl.id = ANY($${i++}::uuid[])`;
        params.push(customerIds);
      }

      const { rows } = await pool.query(`
        SELECT DISTINCT cl.id, cl.name
        FROM clients cl
        JOIN projects p ON p.client_id = cl.id
        WHERE
          COALESCE(p.is_rollup, false) = false
          AND LOWER(p.project_type) != 'potential'
          AND p.status NOT IN ('archived')
          ${customerFilter}
        ORDER BY cl.name
      `, params);

      res.json(rows);
    } catch (e) {
      console.error('[client_portal:clients-with-active-projects]', e && e.message);
      res.status(500).json({ error: 'Failed to load clients.' });
    }
  });
};
