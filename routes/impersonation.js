// routes/impersonation.js — Admin "View as Staff" impersonation (Wave 13C)
//
// POST /api/admin/impersonate/:userId
//   Admin-only. Issues a short-lived (1h) impersonation JWT as a separate
//   cookie (lfs_impersonation). The admin's own lfs_session is untouched.
//   Audit-logged: every grant records admin_id + target_id + timestamp.
//
// POST /api/admin/end-impersonation
//   Clears the lfs_impersonation cookie and returns { ok: true }.

const IMPERSONATION_COOKIE = 'lfs_impersonation';
const IMPERSONATION_TTL_MS = 60 * 60 * 1000; // 1 hour

module.exports = function installImpersonationRoutes(app, pool, { requireAdmin, signImpersonationToken, cookieOpts }) {
  function serverError(res, e, where) {
    console.error(`[impersonation:${where}]`, e && e.message);
    res.status(500).json({ error: 'Internal server error' });
  }

  // POST /api/admin/impersonate/:userId
  app.post('/api/admin/impersonate/:userId', requireAdmin, async (req, res) => {
    // Block impersonation-of-impersonation chains: if the request itself
    // arrived via an impersonation cookie, refuse.
    if (req.user && req.user.impersonator_id) {
      return res.status(403).json({ error: 'Cannot impersonate while already impersonating.' });
    }

    const { userId } = req.params;

    // Prevent self-impersonation (no-op and confusing).
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot impersonate yourself.' });
    }

    try {
      const { rows } = await pool.query(
        `SELECT id, username, full_name, role, team, extra_teams, active FROM users WHERE id = $1 LIMIT 1`,
        [userId]
      );
      const target = rows[0];
      if (!target) return res.status(404).json({ error: 'User not found.' });
      if (!target.active) return res.status(400).json({ error: 'Cannot impersonate inactive user.' });

      const token = signImpersonationToken({
        id: target.id,
        username: target.username,
        role: target.role,
        team: target.team,
        full_name: target.full_name,
        impersonator_id: req.user.id,
        impersonator_name: req.user.full_name || req.user.username,
      });

      res.cookie(IMPERSONATION_COOKIE, token, {
        ...cookieOpts(),
        maxAge: IMPERSONATION_TTL_MS,
      });

      // Audit log
      console.warn(
        `[AUDIT][impersonation:start] admin=${req.user.id} (${req.user.username}) ` +
        `is now impersonating user=${target.id} (${target.username}) at ${new Date().toISOString()}`
      );

      res.json({
        ok: true,
        target: { id: target.id, full_name: target.full_name, role: target.role },
      });
    } catch (e) {
      serverError(res, e, 'start');
    }
  });

  // POST /api/admin/end-impersonation
  app.post('/api/admin/end-impersonation', async (req, res) => {
    const opts = cookieOpts();
    res.clearCookie(IMPERSONATION_COOKIE, opts);
    res.json({ ok: true });
  });
};

module.exports.IMPERSONATION_COOKIE = IMPERSONATION_COOKIE;
module.exports.IMPERSONATION_TTL_MS = IMPERSONATION_TTL_MS;
