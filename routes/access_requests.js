// routes/access_requests.js — "Request additional permissions" inbox.
//
// Training-launch pivot: locked-down users (trainees / non-admin employees) ask
// the admin for more access from their launcher. Requests are created here and
// reviewed in the admin Settings modal. Approve/dismiss only resolves the
// request — actually granting access stays manual (Portal Access / role change).
//
// Routes:
//   POST   /api/access-requests              (any authed user) submit a request
//   GET    /api/admin/access-requests        (admin) list requests
//   GET    /api/admin/access-requests/count  (admin) pending count for the badge
//   PATCH  /api/admin/access-requests/:id    (admin) resolve (approved|dismissed|pending)

module.exports = function installAccessRequestRoutes(app, pool, mw) {
  // requireAuth is a FACTORY (requireAuth() → middleware; requireAuth(['admin'])
  // → role-gated). requireAdmin is already middleware. See routes/training.js.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireAdmin = (mw && mw.requireAdmin) || requireAuth();
  // #77: access-request administration → people.manage (admin still passes).
  const canManagePeople = require('./_permissions').requirePermission(pool, 'people.manage');
  const rateLimitOk = mw && mw.rateLimitOk;

  const UUID_RE = /^[0-9a-fA-F-]{36}$/;

  // ── Submit a request ──────────────────────────────────────────────────────
  app.post('/api/access-requests', requireAuth(), async (req, res) => {
    try {
      const u = req.user || {};
      const ip = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
      if (rateLimitOk && !rateLimitOk('accessreq:' + (u.id || ip), 6, 60 * 60 * 1000)) {
        return res.status(429).json({ error: 'Too many requests — please wait a bit before sending another.' });
      }
      const details = String((req.body && req.body.details) || '').trim();
      if (details.length < 5) {
        return res.status(400).json({ error: 'Please describe what access you need (a few words at least).' });
      }
      if (details.length > 2000) {
        return res.status(400).json({ error: 'Request is too long (2000 characters max).' });
      }
      const { rows } = await pool.query(
        `INSERT INTO access_requests (user_id, username, full_name, details)
         VALUES ($1, $2, $3, $4)
         RETURNING id, status, created_at`,
        [u.id || null, u.username || null, u.full_name || null, details]
      );
      res.status(201).json({ ok: true, request: rows[0] });
    } catch (e) {
      console.error('[access-requests:create]', e && e.message);
      res.status(500).json({ error: 'Could not submit your request. Please try again.' });
    }
  });

  // ── Admin: list ───────────────────────────────────────────────────────────
  app.get('/api/admin/access-requests', canManagePeople, async (req, res) => {
    try {
      const status = String(req.query.status || 'pending');
      const params = [];
      let where = '';
      if (status !== 'all') { params.push(status); where = 'WHERE ar.status = $1'; }
      const { rows } = await pool.query(
        `SELECT ar.id, ar.user_id, ar.username, ar.full_name, ar.details, ar.status,
                ar.created_at, ar.resolved_at, ar.resolved_by,
                u.role AS user_role, u.active AS user_active
           FROM access_requests ar
           LEFT JOIN users u ON u.id = ar.user_id
           ${where}
          ORDER BY ar.created_at DESC
          LIMIT 200`,
        params
      );
      const pending = await pool.query(
        `SELECT COUNT(*)::int AS c FROM access_requests WHERE status = 'pending'`
      );
      res.json({ requests: rows, pending_count: pending.rows[0].c });
    } catch (e) {
      console.error('[access-requests:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load access requests' });
    }
  });

  // ── Admin: pending count (badge) ──────────────────────────────────────────
  app.get('/api/admin/access-requests/count', canManagePeople, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS c FROM access_requests WHERE status = 'pending'`
      );
      res.json({ pending: rows[0].c });
    } catch (e) {
      res.json({ pending: 0 });
    }
  });

  // ── Admin: resolve ────────────────────────────────────────────────────────
  app.patch('/api/admin/access-requests/:id', canManagePeople, async (req, res) => {
    try {
      const id = String(req.params.id || '');
      if (!UUID_RE.test(id)) return res.status(400).json({ error: 'Bad id' });
      const status = String((req.body && req.body.status) || '');
      if (!['approved', 'dismissed', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Bad status' });
      }
      const actor = (req.user && (req.user.full_name || req.user.username)) || 'admin';
      const { rows } = await pool.query(
        `UPDATE access_requests
            SET status = $1,
                resolved_at = ${status === 'pending' ? 'NULL' : 'now()'},
                resolved_by = $2
          WHERE id = $3
          RETURNING id, status, resolved_at, resolved_by`,
        [status, status === 'pending' ? null : actor, id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true, request: rows[0] });
    } catch (e) {
      console.error('[access-requests:resolve]', e && e.message);
      res.status(500).json({ error: 'Failed to update request' });
    }
  });
};
