// routes/impersonation.js — Admin "View as Staff" impersonation (Wave 13C)
//
// POST /api/admin/impersonate/:userId
//   Admin-only. Issues a short-lived (1h) impersonation JWT as a separate
//   cookie (lfs_impersonation). The admin's own lfs_session is untouched.
//
// POST /api/admin/end-impersonation
//   Requires authentication. Clears the cookie and writes an audit-log row.
//
// Wave 166 fixes:
//   HIGH-1 — revocation bypass closed (auth.js impersonation path).
//   MED-1  — rate-limit: 20 starts per admin per hour.
//   MED-2  — end-impersonation requires auth + writes audit_log.
//   LOW-1  — customer-role accounts blocked (403) with documented rationale.

const { logAudit } = require('./_audit');

const IMPERSONATION_COOKIE = 'lfs_impersonation';
const IMPERSONATION_TTL_MS = 60 * 60 * 1000; // 1 hour

module.exports = function installImpersonationRoutes(app, pool, {
  requireAdmin,
  requireAuth,
  signImpersonationToken,
  cookieOpts,
  rateLimitOk,
}) {
  function serverError(res, e, where) {
    console.error(`[impersonation:${where}]`, e && e.message);
    res.status(500).json({ error: 'Internal server error' });
  }

  // POST /api/admin/impersonate/:userId
  app.post('/api/admin/impersonate/:userId', requireAdmin, async (req, res) => {
    // MED-1: 20 impersonation-start attempts per admin per hour.
    if (!rateLimitOk('impersonate:admin:' + req.user.id, 20, 60 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many impersonation attempts. Try again later.' });
    }

    // Block impersonation-of-impersonation chains.
    if (req.user && req.user.impersonator_id) {
      return res.status(403).json({ error: 'Cannot impersonate while already impersonating.' });
    }

    const { userId } = req.params;

    // Prevent self-impersonation.
    if (String(userId) === String(req.user.id)) {
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

      // LOW-1: customer accounts are org-scoped; impersonating them from a
      // staff context exposes client-confidential portal data. Explicit 403.
      if (target.role === 'customer') {
        return res.status(403).json({ error: 'Cannot impersonate customer accounts.' });
      }

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

      // Audit log — start
      console.warn(
        `[AUDIT][impersonation:start] admin=${req.user.id} (${req.user.username}) ` +
        `is now impersonating user=${target.id} (${target.username}) at ${new Date().toISOString()}`
      );
      logAudit(pool, {
        req,
        action:      'impersonation.start',
        entity_type: 'user',
        entity_id:   String(target.id),
        after: {
          impersonator_id:   req.user.id,
          impersonator_name: req.user.full_name || req.user.username,
          target_id:         target.id,
          target_username:   target.username,
          target_role:       target.role,
        },
        source: 'admin',
      }).catch(() => {});

      res.json({
        ok: true,
        target: { id: target.id, full_name: target.full_name, role: target.role },
      });
    } catch (e) {
      serverError(res, e, 'start');
    }
  });

  // POST /api/admin/end-impersonation
  // MED-2: requireAuth() + write audit_log. Previously unauthenticated and unlogged.
  app.post('/api/admin/end-impersonation', requireAuth(), async (req, res) => {
    const targetUserId   = req.user.impersonator_id ? req.user.id               : null;
    const impersonatorId = req.user.impersonator_id ? req.user.impersonator_id  : req.user.id;

    res.clearCookie(IMPERSONATION_COOKIE, cookieOpts());

    console.warn(
      `[AUDIT][impersonation:end] admin=${impersonatorId} ended impersonation` +
      (targetUserId ? ` of user=${targetUserId}` : '') +
      ` at ${new Date().toISOString()}`
    );
    logAudit(pool, {
      req,
      action:      'impersonation.stop',
      entity_type: 'user',
      entity_id:   targetUserId ? String(targetUserId) : String(impersonatorId),
      after: {
        impersonator_id: impersonatorId,
        target_id:       targetUserId,
      },
      source: 'admin',
    }).catch(() => {});

    res.json({ ok: true });
  });
};

module.exports.IMPERSONATION_COOKIE = IMPERSONATION_COOKIE;
module.exports.IMPERSONATION_TTL_MS = IMPERSONATION_TTL_MS;
