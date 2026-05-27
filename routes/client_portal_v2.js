// routes/client_portal_v2.js — token-based client portal v1 foundation (E2).
//
// This is the NEW client portal, built alongside the Wave 13 portal which
// stays operational at /client-portal until explicitly retired in E6.
//
// URL surface:
//   GET  /client/login/:rawToken                      — consume token, set cookie, 302 /client/
//   POST /client/logout                               — revoke token + clear cookie
//   GET  /api/client/me                               — current client_user + org
//
//   GET  /api/admin/client-orgs                       — list all orgs (admin only)
//   POST /api/admin/client-orgs                       — create org
//   GET  /api/admin/client-orgs/:id                   — get org + users + token counts
//   PUT  /api/admin/client-orgs/:id                   — update org metadata
//   POST /api/admin/client-orgs/:id/users             — create client_user in org
//   POST /api/admin/client-orgs/:id/users/:uid/tokens — generate token (raw shown once)
//   POST /api/admin/client-tokens/:tid/revoke         — revoke a token

module.exports = function installClientPortalV2(app, pool, { requireAuth }) {
  const {
    generateRawToken,
    hashToken,
    requireClientAuth,
    CLIENT_SESSION_COOKIE,
  } = require('./_client_auth');

  const requireClientAuthMW = requireClientAuth(pool);

  function clientCookieOpts() {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
  }

  // ── Token consume ──────────────────────────────────────────────────────
  // Client clicks their login link. We hash the raw token, validate, set
  // cookie, then 302 to /client/ so the raw token disappears from the URL bar.
  app.get('/client/login/:rawToken', async (req, res) => {
    try {
      const raw = req.params.rawToken;
      if (!raw) return res.status(400).send('Missing token');
      const tokenHash = hashToken(raw);

      const { rows } = await pool.query(`
        SELECT ct.id, ct.expires_at, ct.revoked_at,
               cu.status AS user_status,
               co.status AS org_status
        FROM client_tokens ct
        JOIN client_users cu ON cu.id = ct.client_user_id
        JOIN client_organizations co ON co.id = cu.org_id
        WHERE ct.token_hash = $1
      `, [tokenHash]);

      if (!rows.length) return res.status(401).send('Invalid or expired login link.');
      const r = rows[0];
      if (r.revoked_at) return res.status(401).send('This login link has been revoked.');
      if (r.expires_at && new Date(r.expires_at) < new Date()) return res.status(401).send('This login link has expired.');
      if (r.user_status !== 'active') return res.status(401).send('Your account is not active.');
      if (r.org_status !== 'active') return res.status(401).send('Your organization account is not active.');

      res.cookie(CLIENT_SESSION_COOKIE, raw, clientCookieOpts());
      return res.redirect('/client/');
    } catch (e) {
      console.error('[client_portal_v2] token consume error:', e && e.message);
      return res.status(500).send('Login failed. Please try your link again.');
    }
  });

  // ── Logout ─────────────────────────────────────────────────────────────
  // Revokes the token row (so the cookie can't be replayed after clear)
  // and clears the cookie.
  app.post('/client/logout', requireClientAuthMW, async (req, res) => {
    try {
      const raw = req.cookies && req.cookies[CLIENT_SESSION_COOKIE];
      if (raw) {
        const tokenHash = hashToken(raw);
        await pool.query(
          'UPDATE client_tokens SET revoked_at = NOW() WHERE token_hash = $1',
          [tokenHash]
        );
      }
      res.clearCookie(CLIENT_SESSION_COOKIE, clientCookieOpts());
      return res.json({ ok: true });
    } catch (e) {
      console.error('[client_portal_v2] logout error:', e && e.message);
      return res.status(500).json({ error: 'logout failed' });
    }
  });

  // ── Client identity ────────────────────────────────────────────────────
  app.get('/api/client/me', requireClientAuthMW, (req, res) => {
    res.json({ client_user: req.client_user, client_org: req.client_org });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Admin endpoints — all gated with requireAuth(['admin'])
  // ══════════════════════════════════════════════════════════════════════

  // ── List orgs ──────────────────────────────────────────────────────────
  app.get('/api/admin/client-orgs', requireAuth(['admin']), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          co.*,
          COUNT(DISTINCT cu.id)::int          AS user_count,
          COUNT(DISTINCT ct.id) FILTER (
            WHERE ct.revoked_at IS NULL
            AND (ct.expires_at IS NULL OR ct.expires_at > NOW())
          )::int                              AS active_token_count,
          (
            SELECT cu2.name
            FROM client_users cu2
            WHERE cu2.org_id = co.id AND cu2.is_primary = true
            LIMIT 1
          )                                   AS primary_user_name,
          (
            SELECT cu2.email
            FROM client_users cu2
            WHERE cu2.org_id = co.id AND cu2.is_primary = true
            LIMIT 1
          )                                   AS primary_user_email
        FROM client_organizations co
        LEFT JOIN client_users cu ON cu.org_id = co.id
        LEFT JOIN client_tokens ct ON ct.client_user_id = cu.id
        GROUP BY co.id
        ORDER BY co.name
      `);
      res.json(rows);
    } catch (e) {
      console.error('[client_portal_v2] list orgs:', e && e.message);
      res.status(500).json({ error: 'failed to list organizations' });
    }
  });

  // ── Create org ─────────────────────────────────────────────────────────
  app.post('/api/admin/client-orgs', requireAuth(['admin']), async (req, res) => {
    const { name, short_name, logo_url, theme_color } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
    try {
      const { rows } = await pool.query(`
        INSERT INTO client_organizations (name, short_name, logo_url, theme_color, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [name.trim(), short_name || null, logo_url || null, theme_color || null, req.user.id]);
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] create org:', e && e.message);
      res.status(500).json({ error: 'failed to create organization' });
    }
  });

  // ── Get org detail (with users + token info) ──────────────────────────
  app.get('/api/admin/client-orgs/:id', requireAuth(['admin']), async (req, res) => {
    try {
      const { rows: orgRows } = await pool.query(
        'SELECT * FROM client_organizations WHERE id = $1',
        [req.params.id]
      );
      if (!orgRows.length) return res.status(404).json({ error: 'org not found' });

      const { rows: userRows } = await pool.query(`
        SELECT
          cu.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id',           ct.id,
                'created_at',   ct.created_at,
                'last_used_at', ct.last_used_at,
                'expires_at',   ct.expires_at,
                'revoked_at',   ct.revoked_at
              ) ORDER BY ct.created_at DESC
            ) FILTER (WHERE ct.id IS NOT NULL),
            '[]'::json
          ) AS tokens
        FROM client_users cu
        LEFT JOIN client_tokens ct ON ct.client_user_id = cu.id
        WHERE cu.org_id = $1
        GROUP BY cu.id
        ORDER BY cu.is_primary DESC, cu.created_at
      `, [req.params.id]);

      res.json({ org: orgRows[0], users: userRows });
    } catch (e) {
      console.error('[client_portal_v2] get org:', e && e.message);
      res.status(500).json({ error: 'failed to get organization' });
    }
  });

  // ── Update org ─────────────────────────────────────────────────────────
  app.put('/api/admin/client-orgs/:id', requireAuth(['admin']), async (req, res) => {
    const { name, short_name, logo_url, theme_color, status } = req.body || {};
    const validStatuses = ['active', 'suspended', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'invalid status' });
    }
    try {
      const { rows } = await pool.query(`
        UPDATE client_organizations
        SET name        = COALESCE($1, name),
            short_name  = COALESCE($2, short_name),
            logo_url    = COALESCE($3, logo_url),
            theme_color = COALESCE($4, theme_color),
            status      = COALESCE($5, status)
        WHERE id = $6
        RETURNING *
      `, [
        name ? name.trim() : null,
        short_name !== undefined ? short_name : null,
        logo_url !== undefined ? logo_url : null,
        theme_color !== undefined ? theme_color : null,
        status || null,
        req.params.id,
      ]);
      if (!rows.length) return res.status(404).json({ error: 'org not found' });
      res.json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] update org:', e && e.message);
      res.status(500).json({ error: 'failed to update organization' });
    }
  });

  // ── Create client user ─────────────────────────────────────────────────
  app.post('/api/admin/client-orgs/:id/users', requireAuth(['admin']), async (req, res) => {
    const { email, name, is_primary } = req.body || {};
    try {
      const { rows: orgCheck } = await pool.query(
        'SELECT id FROM client_organizations WHERE id = $1',
        [req.params.id]
      );
      if (!orgCheck.length) return res.status(404).json({ error: 'org not found' });

      const { rows } = await pool.query(`
        INSERT INTO client_users (org_id, email, name, is_primary, invited_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        req.params.id,
        email || null,
        name || null,
        is_primary === true,
        req.user.id,
      ]);
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] create user:', e && e.message);
      res.status(500).json({ error: 'failed to create user' });
    }
  });

  // ── Generate token for a user ──────────────────────────────────────────
  // Returns raw token ONCE. Admin copies + sends to client.
  // After this response the raw value is never seen again (only hash stored).
  app.post('/api/admin/client-orgs/:id/users/:uid/tokens', requireAuth(['admin']), async (req, res) => {
    const { expires_days } = req.body || {};
    try {
      // Verify user belongs to the specified org.
      const { rows: userCheck } = await pool.query(
        'SELECT id FROM client_users WHERE id = $1 AND org_id = $2',
        [req.params.uid, req.params.id]
      );
      if (!userCheck.length) return res.status(404).json({ error: 'user not found in org' });

      const raw = generateRawToken();
      const tokenHash = hashToken(raw);
      let expiresAt = null;
      if (expires_days && Number.isFinite(+expires_days) && +expires_days > 0) {
        expiresAt = new Date(Date.now() + +expires_days * 86400 * 1000);
      }

      const { rows } = await pool.query(`
        INSERT INTO client_tokens (client_user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, created_at, expires_at
      `, [req.params.uid, tokenHash, expiresAt]);

      const loginUrl = `${req.protocol}://${req.get('host')}/client/login/${raw}`;

      res.status(201).json({
        raw_token:  raw,
        login_url:  loginUrl,
        token_id:   rows[0].id,
        created_at: rows[0].created_at,
        expires_at: rows[0].expires_at,
        warning:    'Store this token securely — it will not be shown again.',
      });
    } catch (e) {
      console.error('[client_portal_v2] generate token:', e && e.message);
      res.status(500).json({ error: 'failed to generate token' });
    }
  });

  // ── Revoke token ───────────────────────────────────────────────────────
  app.post('/api/admin/client-tokens/:tid/revoke', requireAuth(['admin']), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        UPDATE client_tokens SET revoked_at = NOW()
        WHERE id = $1 AND revoked_at IS NULL
        RETURNING id, revoked_at
      `, [req.params.tid]);
      if (!rows.length) return res.status(404).json({ error: 'token not found or already revoked' });
      res.json({ ok: true, revoked_at: rows[0].revoked_at });
    } catch (e) {
      console.error('[client_portal_v2] revoke token:', e && e.message);
      res.status(500).json({ error: 'failed to revoke token' });
    }
  });
};
