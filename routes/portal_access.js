// routes/portal_access.js — per-user portal access overrides (Wave 12)
//
// Schema: migrations/0042_user_portal_access.sql
//   user_portal_access(user_id, portal_key, granted_at, granted_by_user_id)
//
// Three endpoints (all admin-only):
//   GET  /api/portal-access              — full matrix: users x portals
//   POST /api/users/:userId/portal-access/:portalKey   — grant override
//   DELETE /api/users/:userId/portal-access/:portalKey — revoke override

// Wave 15: capability sentinels stored in user_portal_access alongside portal keys.
// These are not portal keys (they have no portalDef entry) but use the same table.
const { CAP_CREATE_PROJECTS } = require('../auth');
const CAPABILITY_KEYS = new Set([CAP_CREATE_PROJECTS]);
const { logAudit } = require('./_audit');

module.exports = function installPortalAccessRoutes(app, pool, mw, portalDefs) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  function serverError(res, e, where) {
    console.error(`[portal-access:${where}]`, e && e.message);
    res.status(500).json({ error: 'Internal server error' });
  }

  // GET /api/portal-access/capabilities
  // Wave 15: returns [{user_id}] rows for the __cap_create_projects__ sentinel.
  // Admin-only. Used by the Settings → Portal Access matrix to render the
  // capability column without requiring a new table or migration.
  app.get('/api/portal-access/capabilities', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT user_id FROM user_portal_access WHERE portal_key = $1`,
        [CAP_CREATE_PROJECTS]
      );
      res.json(rows);
    } catch (e) {
      // Defensive: if the table doesn't exist yet, return empty array.
      console.warn('[portal-access:capabilities] query failed:', e && e.message);
      res.json([]);
    }
  });

  // GET /api/portal-access
  // Returns the full matrix of non-customer users x portals.
  // Each row has { user_id, username, full_name, role, portals: [{key, label, hasRoleDefault, hasOverride}] }
  app.get('/api/portal-access', requireAdmin, async (req, res) => {
    try {
      const { rows: users } = await pool.query(`
        SELECT id, username, full_name, role
        FROM users
        WHERE active = true AND role <> 'customer'
        ORDER BY username ASC
      `);

      // Defensive: if migration 0042 hasn't run yet (user_portal_access table
      // missing), fall back to empty override set. UI still works — just shows
      // no per-user grants until the table exists.
      let overrideSet = new Set();
      try {
        const { rows: overrides } = await pool.query(`
          SELECT user_id, portal_key FROM user_portal_access
        `);
        overrideSet = new Set(overrides.map(r => `${r.user_id}:${r.portal_key}`));
      } catch (e) {
        console.warn('[portal-access:list] user_portal_access query failed (migration 0042 may not have run yet):', e && e.message);
      }

      const employeePortals = portalDefs
        .filter(p => p.audience === 'employee')
        .map(p => ({ key: p.id, label: p.name }));

      const matrix = users.map(u => ({
        user_id: u.id,
        username: u.username,
        full_name: u.full_name || u.username,
        role: u.role,
        portals: employeePortals.map(p => ({
          key: p.key,
          label: p.label,
          hasRoleDefault: isRoleDefault(u, p.key, portalDefs),
          hasOverride: overrideSet.has(`${u.id}:${p.key}`),
        })),
      }));

      res.json(matrix);
    } catch (e) {
      serverError(res, e, 'list');
    }
  });

  // POST /api/users/:userId/portal-access/:portalKey
  // Idempotent — ON CONFLICT DO NOTHING.
  // Also accepts capability sentinel keys (e.g. __cap_create_projects__).
  app.post('/api/users/:userId/portal-access/:portalKey', requireAdmin, async (req, res) => {
    const { userId, portalKey } = req.params;
    const knownKeys = portalDefs.filter(p => p.audience === 'employee').map(p => p.id);
    if (!knownKeys.includes(portalKey) && !CAPABILITY_KEYS.has(portalKey)) {
      return res.status(400).json({ error: `Unknown portal key: ${portalKey}` });
    }
    try {
      const { rows: userRows } = await pool.query(
        `SELECT id, role FROM users WHERE id = $1 AND active = true AND role <> 'customer'`,
        [userId]
      );
      if (!userRows[0]) return res.status(404).json({ error: 'User not found' });

      await pool.query(
        `INSERT INTO user_portal_access (user_id, portal_key, granted_by_user_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, portal_key) DO NOTHING`,
        [userId, portalKey, req.user.id]
      );
      logAudit(pool, { req, action: 'grant', entity_type: 'portal_access', entity_id: userId,
        meta: { portal_key: portalKey }, source: 'admin_ui' });
      res.json({ ok: true });
    } catch (e) {
      serverError(res, e, 'grant');
    }
  });

  // DELETE /api/users/:userId/portal-access/:portalKey
  // Refuses to remove a role-default access (would have no effect but clarifies intent).
  // Capability sentinel keys are never role-defaults so they skip the check.
  app.delete('/api/users/:userId/portal-access/:portalKey', requireAdmin, async (req, res) => {
    const { userId, portalKey } = req.params;
    try {
      const { rows: userRows } = await pool.query(
        `SELECT id, role FROM users WHERE id = $1 AND active = true AND role <> 'customer'`,
        [userId]
      );
      if (!userRows[0]) return res.status(404).json({ error: 'User not found' });

      const u = userRows[0];
      // Capability sentinels are never role-defaults — skip the check for them.
      if (!CAPABILITY_KEYS.has(portalKey) && isRoleDefault(u, portalKey, portalDefs)) {
        return res.status(400).json({
          error: `Cannot revoke role-default access. User has ${portalKey} access via their role (${u.role}).`,
        });
      }

      await pool.query(
        `DELETE FROM user_portal_access WHERE user_id = $1 AND portal_key = $2`,
        [userId, portalKey]
      );
      logAudit(pool, { req, action: 'revoke', entity_type: 'portal_access', entity_id: userId,
        meta: { portal_key: portalKey }, source: 'admin_ui' });
      res.json({ ok: true });
    } catch (e) {
      serverError(res, e, 'revoke');
    }
  });
};

// Returns true if the user's role alone grants access to this portal (no override needed).
// Mirrors the canAccess logic in PORTAL_DEFS without requiring the full sync fn.
function isRoleDefault(user, portalKey, portalDefs) {
  if (user.role === 'admin') return true;
  const def = portalDefs.find(p => p.id === portalKey);
  if (!def) return false;
  try {
    return def.canAccess(user);
  } catch {
    return false;
  }
}
