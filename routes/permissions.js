// routes/permissions.js — System F grant/revoke API + catalog (specs/roles-capabilities.md, #73).
// Registrar wires the mount: require('./routes/permissions')(app, pool, { requireAuth });
//
// Gating: all catalog/grant/revoke surfaces require `people.manage` (server-side —
// the API is the gate). `/me` is any authenticated user (their own effective keys,
// for UI convenience only). NOBODY grants themselves (spec §VO lenses).
//
// The change-log for grants is the permission_grants table itself: a grant INSERTs
// a row (granted_by, granted_at); a revoke SETs revoked_at (kept as history). The
// row IS the audit trail — no separate log table needed.

const {
  CATALOG,
  CATALOG_KEYS,
  getEffective,
  requirePermission,
} = require('./_permissions');

// Roles a grant may target. Mirrors auth.js VALID_ROLES; kept local to avoid a
// hard import cycle. If a role is added there, add it here (or the grant is rejected).
const GRANTABLE_ROLES = new Set([
  'admin', 'design_manager', 'permitting_manager',
  'design_engineer', 'permitting_engineer', 'contractor', 'customer', 'trainee',
]);

module.exports = function (app, pool) {
  const peopleManage = requirePermission(pool, 'people.manage');

  // The caller's own effective permission keys (any authenticated user).
  app.get('/api/permissions/me', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    try {
      const eff = await getEffective(pool, req.user);
      res.json({ permissions: [...eff] });
    } catch (e) {
      console.error('[permissions:/me]', e && e.message);
      res.status(500).json({ error: 'Could not resolve permissions.' });
    }
  });

  // Full catalog, grouped by area — drives the Settings page (#74). Gated.
  app.get('/api/permissions/catalog', peopleManage, (req, res) => {
    res.json({ catalog: CATALOG });
  });

  // All active grants (role + user), for the Settings page to render current state.
  app.get('/api/permissions/grants', peopleManage, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT g.permission_key, g.subject_type, g.subject_id, g.granted_by, g.granted_at,
                CASE WHEN g.subject_type = 'user' THEN u.full_name END AS subject_name
           FROM permission_grants g
           LEFT JOIN users u ON g.subject_type = 'user' AND u.id::text = g.subject_id
          WHERE g.revoked_at IS NULL
          ORDER BY g.permission_key, g.subject_type, g.subject_id`
      );
      res.json({ grants: rows });
    } catch (e) {
      console.error('[permissions:grants]', e && e.message);
      res.status(500).json({ error: 'Could not load grants.' });
    }
  });

  // Grant a key to a role or a person. people.manage only; nobody self-grants.
  app.post('/api/permissions/grant', peopleManage, async (req, res) => {
    const { permission_key, subject_type, subject_id } = req.body || {};
    const err = validateTarget(permission_key, subject_type, subject_id);
    if (err) return res.status(400).json({ error: err });

    // No self-granting: a people.manage holder cannot grant to their OWN account.
    if (subject_type === 'user' && String(subject_id) === String(req.user.id)) {
      return res.status(403).json({ error: 'You cannot grant a permission to yourself.' });
    }

    try {
      if (subject_type === 'user') {
        const { rowCount } = await pool.query('SELECT 1 FROM users WHERE id::text = $1', [String(subject_id)]);
        if (!rowCount) return res.status(400).json({ error: 'No such user.' });
      }
      // Idempotent: the partial unique index makes a re-grant of an active pair a no-op.
      await pool.query(
        `INSERT INTO permission_grants (permission_key, subject_type, subject_id, granted_by)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [permission_key, subject_type, String(subject_id), String(req.user.id)]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error('[permissions:grant]', e && e.message);
      res.status(500).json({ error: 'Could not grant.' });
    }
  });

  // Revoke an active grant (sets revoked_at; the row stays as history).
  app.post('/api/permissions/revoke', peopleManage, async (req, res) => {
    const { permission_key, subject_type, subject_id } = req.body || {};
    const err = validateTarget(permission_key, subject_type, subject_id);
    if (err) return res.status(400).json({ error: err });
    try {
      const { rowCount } = await pool.query(
        `UPDATE permission_grants SET revoked_at = NOW()
          WHERE permission_key = $1 AND subject_type = $2 AND subject_id = $3
            AND revoked_at IS NULL`,
        [permission_key, subject_type, String(subject_id)]
      );
      res.json({ ok: true, revoked: rowCount });
    } catch (e) {
      console.error('[permissions:revoke]', e && e.message);
      res.status(500).json({ error: 'Could not revoke.' });
    }
  });

  function validateTarget(key, type, id) {
    if (!CATALOG_KEYS.has(key)) return 'Unknown permission key.';
    if (type !== 'role' && type !== 'user') return 'subject_type must be "role" or "user".';
    if (id === undefined || id === null || String(id).trim() === '') return 'subject_id required.';
    if (type === 'role' && !GRANTABLE_ROLES.has(String(id))) return 'Unknown role.';
    return null;
  }
};
