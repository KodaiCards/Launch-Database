// Token-based auth for client portal v1.
// Tokens are random 32-byte strings shown ONCE to admin at creation.
// Server stores SHA-256 hash. Validation: hash(input) === stored_hash + status checks.

const crypto = require('crypto');

const CLIENT_SESSION_COOKIE = 'lfs_client_session';
const CLIENT_TOKEN_BYTES = 32;

function generateRawToken() {
  return crypto.randomBytes(CLIENT_TOKEN_BYTES).toString('base64url');
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// Middleware: reads lfs_client_session cookie, validates against client_tokens,
// populates req.client_user + req.client_org. Returns 401 on any failure.
function requireClientAuth(pool) {
  return async (req, res, next) => {
    try {
      const raw = req.cookies && req.cookies[CLIENT_SESSION_COOKIE];
      if (!raw) return res.status(401).json({ error: 'client_session required' });
      const tokenHash = hashToken(raw);
      const { rows } = await pool.query(`
        SELECT
          ct.id              AS token_id,
          ct.expires_at,
          ct.revoked_at,
          cu.id              AS client_user_id,
          cu.org_id,
          cu.email,
          cu.name            AS user_name,
          cu.is_primary,
          cu.status          AS user_status,
          co.id              AS org_id_check,
          co.name            AS org_name,
          co.short_name,
          co.logo_url,
          co.theme_color,
          co.status          AS org_status
        FROM client_tokens ct
        JOIN client_users cu ON cu.id = ct.client_user_id
        JOIN client_organizations co ON co.id = cu.org_id
        WHERE ct.token_hash = $1
      `, [tokenHash]);

      if (!rows.length) return res.status(401).json({ error: 'invalid token' });
      const r = rows[0];
      if (r.revoked_at) return res.status(401).json({ error: 'token revoked' });
      if (r.expires_at && new Date(r.expires_at) < new Date()) return res.status(401).json({ error: 'token expired' });
      if (r.user_status !== 'active') return res.status(401).json({ error: 'user inactive' });
      if (r.org_status !== 'active') return res.status(401).json({ error: 'organization inactive' });

      req.client_user = {
        id:         r.client_user_id,
        org_id:     r.org_id,
        email:      r.email,
        name:       r.user_name,
        is_primary: r.is_primary,
      };
      req.client_org = {
        id:          r.org_id,
        name:        r.org_name,
        short_name:  r.short_name,
        logo_url:    r.logo_url,
        theme_color: r.theme_color,
      };

      // Update last_used_at lazily — fire-and-forget to avoid slowing requests.
      pool.query('UPDATE client_tokens SET last_used_at = NOW() WHERE id = $1', [r.token_id]).catch(() => {});

      next();
    } catch (e) {
      console.error('[client_auth]', e && e.message);
      return res.status(500).json({ error: 'auth check failed' });
    }
  };
}

module.exports = { generateRawToken, hashToken, requireClientAuth, CLIENT_SESSION_COOKIE };
