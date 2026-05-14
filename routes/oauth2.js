// routes/oauth2.js — OAuth2 Authorization Code flow (SSO bridge for Moodle)
//
// Implements three endpoints needed by Moodle's auth_oauth2 plugin:
//   GET  /oauth2/authorize  — Authorization Code entry point
//   POST /oauth2/token      — Code → access token exchange (server-to-server)
//   GET  /oauth2/userinfo   — User profile (Bearer access token)
//
// All secrets come from env vars — see .env.example for the full list.
// Rate limiting and audit logging reuse existing helpers from auth.js.
//
// Wiring (in server.js):
//   require('./routes/oauth2')(app, pool, { requireAuth, signToken, verifyToken, rateLimitOk })

const crypto = require('crypto');
const jwt    = require('jsonwebtoken');

// ─── Constants ───────────────────────────────────────────────────────────────

const CODE_TTL_MS      = 5 * 60 * 1000;   // 5 minutes — authorization codes
const ACCESS_TTL_S     = 900;              // 15 minutes — access tokens (seconds)
const CODE_MAX_ENTRIES = 1000;             // LRU cap
const RL_AUTHORIZE     = { limit: 10, windowMs: 5 * 60 * 1000 };  // 10 req/5min/IP
const RL_TOKEN         = { limit: 20, windowMs: 5 * 60 * 1000 };  // 20 req/5min/IP

const MOODLE_AUDIENCE  = 'moodle-sso';
const MOODLE_ISSUER    = process.env.JWT_ISSUER || 'lfs-auth';

// ─── In-memory authorization code store ──────────────────────────────────────
// Map<code_hex, { user_id, redirect_uri, expires_at: Date }>
// A simple Map with a sweep interval. Single-process — fine for Railway
// single-dyno deployment. If multi-instance is ever needed, replace this
// with a Redis TTL key.

const _codes = new Map();

// Sweep expired entries every 60 seconds. .unref() so the timer doesn't
// hold the process open during tests.
setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of _codes) {
    if (entry.expires_at <= now) _codes.delete(code);
  }
}, 60_000).unref();

function _issueCode(user_id, redirect_uri) {
  // Enforce LRU cap: evict the oldest entry if we're at the limit.
  if (_codes.size >= CODE_MAX_ENTRIES) {
    const oldest = _codes.keys().next().value;
    _codes.delete(oldest);
  }
  const code = crypto.randomBytes(32).toString('hex');
  _codes.set(code, {
    user_id,
    redirect_uri,
    expires_at: Date.now() + CODE_TTL_MS,
  });
  return code;
}

function _consumeCode(code) {
  const entry = _codes.get(code);
  if (!entry) return null;
  _codes.delete(code);   // single-use
  if (entry.expires_at <= Date.now()) return null;  // expired
  return entry;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _envOrNull(name) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

function _allowedRedirectUris() {
  const raw = _envOrNull('OAUTH2_ALLOWED_REDIRECT_URIS');
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function _signMoodleToken(user_id) {
  const secret = _envOrNull('OAUTH2_JWT_SECRET') || process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(
    { sub: user_id },
    secret,
    {
      expiresIn: ACCESS_TTL_S,
      audience:  MOODLE_AUDIENCE,
      issuer:    MOODLE_ISSUER,
      algorithm: 'HS256',
    }
  );
}

function _verifyMoodleToken(token) {
  const secret = _envOrNull('OAUTH2_JWT_SECRET') || process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
      audience:   MOODLE_AUDIENCE,
      issuer:     MOODLE_ISSUER,
    });
  } catch {
    return null;
  }
}

// Structured audit log. No audit_logs table exists in this codebase yet —
// log to stdout with a parseable prefix so Railway log drain captures it.
function _auditLog(action, details) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), action, ...details }));
}

// ─── Route installer ──────────────────────────────────────────────────────────

module.exports = function installOAuth2Routes(app, pool, mw) {
  const { rateLimitOk } = mw;

  // ─── GET /oauth2/authorize ────────────────────────────────────────────────
  //
  // Entry point — Moodle redirects the user here to begin the SSO flow.
  // Query params: client_id, redirect_uri, response_type=code, state
  //
  // Happy path: authenticated user → issue code → 302 to redirect_uri?code=&state=
  // Not authed: 302 to /login?next=<encoded URL so they return here after login>
  app.get('/oauth2/authorize', (req, res) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    if (!rateLimitOk('oauth2_authorize:' + ip, RL_AUTHORIZE.limit, RL_AUTHORIZE.windowMs)) {
      return res.status(429).json({ error: 'Too many requests. Please wait 5 minutes.' });
    }

    const { client_id, redirect_uri, response_type, state } = req.query;

    // Validate client_id.
    const expectedClientId = _envOrNull('OAUTH2_CLIENT_ID');
    if (!expectedClientId) {
      console.error('[oauth2:authorize] OAUTH2_CLIENT_ID env var is not configured');
      return res.status(500).json({ error: 'SSO bridge is not configured on this server' });
    }
    if (!client_id || client_id !== expectedClientId) {
      _auditLog('oauth2_authorize_rejected', { reason: 'invalid_client_id', ip, client_id });
      return res.status(400).json({ error: 'Invalid client_id' });
    }

    // Validate response_type.
    if (response_type !== 'code') {
      return res.status(400).json({ error: 'Only response_type=code is supported' });
    }

    // Validate redirect_uri against allowlist.
    if (!redirect_uri) {
      return res.status(400).json({ error: 'redirect_uri is required' });
    }
    const allowedUris = _allowedRedirectUris();
    if (allowedUris.length === 0) {
      console.error('[oauth2:authorize] OAUTH2_ALLOWED_REDIRECT_URIS env var is not configured');
      return res.status(500).json({ error: 'SSO bridge redirect URIs are not configured' });
    }
    if (!allowedUris.includes(redirect_uri)) {
      _auditLog('oauth2_authorize_rejected', { reason: 'redirect_uri_not_allowed', ip, redirect_uri });
      return res.status(400).json({ error: 'redirect_uri not in allowlist' });
    }

    // If user is not authenticated, redirect to login with a `next` param
    // so they land back here after successful login.
    if (!req.user) {
      const selfUrl = req.originalUrl;  // preserves full query string
      const loginUrl = '/login?next=' + encodeURIComponent(selfUrl);
      return res.redirect(302, loginUrl);
    }

    // User is authenticated — issue authorization code.
    const code = _issueCode(req.user.id, redirect_uri);
    _auditLog('oauth2_authorize', {
      user_id:      req.user.id,
      username:     req.user.username,
      redirect_uri,
      ip,
    });

    // Build the callback URL.
    const callbackUrl = new URL(redirect_uri);
    callbackUrl.searchParams.set('code', code);
    if (state != null) callbackUrl.searchParams.set('state', state);

    return res.redirect(302, callbackUrl.toString());
  });

  // ─── POST /oauth2/token ───────────────────────────────────────────────────
  //
  // Server-to-server: Moodle exchanges the authorization code for an access
  // token. Body (application/x-www-form-urlencoded or JSON):
  //   grant_type=authorization_code, code, client_id, client_secret, redirect_uri
  app.post('/oauth2/token', (req, res) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    if (!rateLimitOk('oauth2_token:' + ip, RL_TOKEN.limit, RL_TOKEN.windowMs)) {
      return res.status(429).json({ error: 'Too many requests. Please wait 5 minutes.' });
    }

    const { grant_type, code, client_id, client_secret, redirect_uri } = req.body || {};

    // grant_type check first — fastest rejection.
    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ error: 'Unsupported grant_type; expected authorization_code' });
    }

    // Validate client credentials.
    const expectedClientId     = _envOrNull('OAUTH2_CLIENT_ID');
    const expectedClientSecret = _envOrNull('OAUTH2_CLIENT_SECRET');
    if (!expectedClientId || !expectedClientSecret) {
      console.error('[oauth2:token] OAUTH2_CLIENT_ID or OAUTH2_CLIENT_SECRET env vars are not configured');
      return res.status(500).json({ error: 'SSO bridge is not configured on this server' });
    }

    // Constant-time comparison to avoid timing side-channels.
    const clientIdOk     = client_id     && timingSafeEqual(client_id,     expectedClientId);
    const clientSecretOk = client_secret && timingSafeEqual(client_secret, expectedClientSecret);

    if (!clientIdOk || !clientSecretOk) {
      _auditLog('oauth2_token_rejected', { reason: 'invalid_client_credentials', ip });
      return res.status(400).json({ error: 'Invalid client credentials' });
    }

    // Look up and consume the authorization code (single-use).
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }
    const entry = _consumeCode(code);
    if (!entry) {
      _auditLog('oauth2_token_rejected', { reason: 'invalid_or_expired_code', ip });
      return res.status(400).json({ error: 'Authorization code is invalid or has expired' });
    }

    // Validate redirect_uri matches what was originally issued for this code.
    if (!redirect_uri || entry.redirect_uri !== redirect_uri) {
      _auditLog('oauth2_token_rejected', { reason: 'redirect_uri_mismatch', ip });
      return res.status(400).json({ error: 'redirect_uri does not match the one used in /authorize' });
    }

    // Mint the Moodle-audience access token.
    let access_token;
    try {
      access_token = _signMoodleToken(entry.user_id);
    } catch (e) {
      console.error('[oauth2:token] Failed to sign access token:', e && e.message);
      return res.status(500).json({ error: 'Failed to issue access token' });
    }

    _auditLog('oauth2_token_exchange', { user_id: entry.user_id, ip });

    return res.json({
      access_token,
      token_type: 'Bearer',
      expires_in: ACCESS_TTL_S,
    });
  });

  // ─── GET /oauth2/userinfo ─────────────────────────────────────────────────
  //
  // Moodle calls this to resolve the access token → user profile.
  // Authorization: Bearer <access_token>
  // Returns an OpenID Connect-compatible profile object.
  app.get('/oauth2/userinfo', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Bearer token required' });
    }
    const token = authHeader.slice(7);

    const payload = _verifyMoodleToken(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    // Cross-check tokens_invalid_after (same as authMiddleware) — if the
    // user changed their password or was deactivated after the token was
    // issued, reject the token.
    try {
      const { rows } = await pool.query(
        `SELECT id, username, full_name, email, role, active, tokens_invalid_after
         FROM users WHERE id = $1 LIMIT 1`,
        [payload.sub]
      );
      const user = rows[0];
      if (!user || !user.active) {
        return res.status(401).json({ error: 'User account not found or is inactive' });
      }
      if (user.tokens_invalid_after && payload.iat) {
        const issuedMs = payload.iat * 1000;
        if (new Date(user.tokens_invalid_after).getTime() > issuedMs) {
          return res.status(401).json({ error: 'Token has been invalidated' });
        }
      }

      // Return OpenID Connect userinfo. Moodle maps:
      //   sub  → external user id (must be stable across logins)
      //   email → account lookup / creation
      //   name → display name
      //   preferred_username → Moodle username suggestion
      return res.json({
        sub:                String(user.id),
        email:              user.email || null,
        name:               user.full_name || user.username,
        preferred_username: user.username,
        lfs_role:           user.role,
      });
    } catch (e) {
      console.error('[oauth2:userinfo] DB error:', e && e.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

// ─── Utilities ────────────────────────────────────────────────────────────────

// Constant-time string comparison. Converts both to UTF-8 Buffers and uses
// crypto.timingSafeEqual so secret comparison doesn't leak timing info.
// Pads to equal length before comparing to avoid short-circuit exits.
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  if (bufA.length !== bufB.length) {
    // Still call timingSafeEqual to avoid short-circuiting on length alone —
    // compare against a dummy buffer of b's length so work is consistent.
    const dummy = Buffer.alloc(bufB.length);
    crypto.timingSafeEqual(dummy, bufB);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
