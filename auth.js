// auth.js — Authentication & authorization for Launch Fiber Services
//
// Provides:
//   - bootstrap of users table + initial admin account
//   - POST /api/auth/login    — issues JWT, sets cookie
//   - POST /api/auth/logout   — clears cookie
//   - GET  /api/auth/me       — returns current user (or 401)
//   - POST /api/auth/change-password — user updates own password
//   - admin user management at /api/users (CRUD)
//   - middleware authMiddleware() — attaches req.user from token
//   - middleware requireAuth(roles?) — enforces login + optional role check
//
// Roles:
//   - admin                — sees everything, manages users, jobs, clients, etc.
//   - design_manager       — sees Design portal team data including hours+revenue
//   - permitting_manager   — same for Permitting team
//   - design_engineer      — Design portal, sees own time entries only, no revenue
//   - permitting_engineer  — same for Permitting

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET env var is required in production.');
    console.error('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
    console.error('Then set it in Railway → Variables → JWT_SECRET on EVERY service (admin + portals).');
    process.exit(1);
  }
  JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn('⚠ JWT_SECRET unset — using ephemeral random secret for this dev process. Sessions will not survive restart.');
}
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'lfs_session';
const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LEN = 10;

// Item 18 fix: JWT audience for cross-service token isolation.
// Sign and verify tokens with an audience claim so a token minted on
// one service cannot be reused on another (they share JWT_SECRET but
// differ in audience). Configurable via JWT_AUDIENCE env var.
// Cross-deployment isolation: env var so staging + prod each pin their own
// audience namespace even when JWT_SECRET happens to be shared (rotation
// window, copied-config accident, etc.). 'lfs' is the default so dev still
// works without the env var; production deploys MUST override.
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'lfs';
// Wave 1.5 M-5 — issuer claim. Defense-in-depth alongside audience. Tokens
// minted on a different service that happens to share JWT_SECRET would still
// fail the iss check on this service. Env-driven, default 'lfs-auth'.
const JWT_ISSUER = process.env.JWT_ISSUER || 'lfs-auth';

// Tiny in-memory sliding-window rate limiter. Single-process only.
const _rlBuckets = new Map();
function rateLimitOk(key, limit, windowMs) {
  // Item 13 fix: NODE_ENV=test bypass now requires BOTH the test flag AND
  // an explicit opt-in env var (LFS_DISABLE_RATELIMIT_FOR_TESTS=1).
  // A misconfigured Railway deploy with NODE_ENV=test in production would
  // otherwise disable login rate limiting entirely.
  if (process.env.NODE_ENV === 'test' && process.env.LFS_DISABLE_RATELIMIT_FOR_TESTS === '1') return true;
  const now = Date.now();
  const arr = (_rlBuckets.get(key) || []).filter(t => now - t < windowMs);
  if (arr.length >= limit) {
    _rlBuckets.set(key, arr);
    return false;
  }
  arr.push(now);
  _rlBuckets.set(key, arr);
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _rlBuckets) {
    const fresh = v.filter(t => now - t < 60 * 60 * 1000);
    if (fresh.length === 0) _rlBuckets.delete(k);
    else _rlBuckets.set(k, fresh);
  }
}, 5 * 60 * 1000).unref();

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-' + crypto.randomBytes(8).toString('hex'), BCRYPT_ROUNDS);

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

function serverError(res, e, where) {
  console.error(`[auth:${where}]`, e && e.stack ? e.stack : e);
  return res.status(500).json({ error: 'Internal server error' });
}

const VALID_ROLES = [
  'admin',
  'design_manager',
  'permitting_manager',
  'design_engineer',
  'permitting_engineer',
  'customer',
];

function teamForRole(role) {
  if (!role) return null;
  if (role.startsWith('design_')) return 'design';
  if (role.startsWith('permitting_')) return 'permitting';
  if (role.startsWith('construction_')) return 'construction';
  if (role.startsWith('inspection_')) return 'construction';
  return null;
}

function teamsForUser(user) {
  if (!user) return [];
  if (user.role === 'admin') return ['design','permitting','construction'];
  const primary = teamForRole(user.role);
  const extras = Array.isArray(user.extra_teams) ? user.extra_teams : [];
  const set = new Set();
  if (primary) set.add(primary);
  for (const t of extras) {
    if (t === 'design' || t === 'permitting' || t === 'construction') set.add(t);
    else if (t === 'inspection') set.add('construction');
  }
  return [...set];
}

function canAccessPortal(user, portalMode) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return teamsForUser(user).includes(portalMode);
}

function isManagerOrAdmin(role) {
  return role === 'admin' || role === 'design_manager' || role === 'permitting_manager';
}

// ─── SCHEMA BOOTSTRAP ────────────────────────────────────────────────────────
async function bootstrapAuthSchema(pool) {
  console.log('───── auth schema bootstrap ─────');

  const ddl = [
    `CREATE TABLE IF NOT EXISTS users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       username VARCHAR(60) UNIQUE NOT NULL,
       password_hash TEXT NOT NULL,
       role VARCHAR(40) NOT NULL,
       team VARCHAR(20),
       full_name VARCHAR(120),
       email VARCHAR(160),
       active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       last_login TIMESTAMPTZ,
       updated_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE INDEX IF NOT EXISTS idx_users_username ON users (LOWER(username))`,
    `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE time_entries    ADD COLUMN IF NOT EXISTS user_id            UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE permit_documents ADD COLUMN IF NOT EXISTS uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(10)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS extra_teams TEXT[] DEFAULT '{}'`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_invalid_after TIMESTAMPTZ`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_layout JSONB DEFAULT '{}'::jsonb`,
  ];
  for (const sql of ddl) {
    try {
      await pool.query(sql);
      console.log('  ✓', sql.replace(/\s+/g, ' ').substring(0, 90));
    } catch (e) {
      console.error('  ✗', sql.substring(0, 80), '→', e.message);
    }
  }

  try {
    const envPw = process.env.ADMIN_PASSWORD;
    const { rows: existing } = await pool.query(
      `SELECT id, active FROM users WHERE LOWER(username) = 'admin' LIMIT 1`
    );

    if (existing.length === 0) {
      if (!envPw) {
        console.error('  ✗ No admin user exists and ADMIN_PASSWORD env var is not set.');
        console.error('    Set ADMIN_PASSWORD in Railway → Variables (10+ chars), then redeploy.');
        console.error('    The app will continue to boot but no one can log in until you do.');
      } else if (envPw.length < MIN_PASSWORD_LEN) {
        console.error(`  ✗ ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LEN} characters. Refusing to seed admin.`);
      } else {
        const hash = await bcrypt.hash(envPw, BCRYPT_ROUNDS);
        await pool.query(
          `INSERT INTO users (username, password_hash, role, team, full_name, email, active)
           VALUES ('admin', $1, 'admin', NULL, 'Default Admin', NULL, TRUE)`,
          [hash]
        );
        console.log(`  ✓ Default admin CREATED — username='admin' (password from ADMIN_PASSWORD env)`);
      }
    } else if (envPw) {
      const hash = await bcrypt.hash(envPw, BCRYPT_ROUNDS);
      await pool.query(
        `UPDATE users SET password_hash = $1, role = 'admin', active = TRUE, updated_at = NOW()
         WHERE LOWER(username) = 'admin'`,
        [hash]
      );
      // Item 26 fix: audit log for admin password refresh
      console.warn(`[SECURITY AUDIT] Admin password REFRESHED from ADMIN_PASSWORD env var at ${new Date().toISOString()} — username='admin'`);
      try {
        const fs = require('fs');
        const logPath = process.env.ADMIN_BOOTSTRAP_LOG || '/var/log/lfs/admin_password_bootstrap.log';
        const logDir = require('path').dirname(logPath);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        fs.appendFileSync(logPath,
          JSON.stringify({ ts: new Date().toISOString(), event: 'admin_password_refreshed', username: 'admin' }) + '\n'
        );
      } catch (logErr) {
        console.warn('[auth:bootstrap] Could not write to audit log:', logErr.message);
      }
      console.log(`  ✓ Admin password REFRESHED from ADMIN_PASSWORD env var (username='admin')`);
    } else {
      if (!existing[0].active) {
        await pool.query(
          `UPDATE users SET active = TRUE, updated_at = NOW() WHERE id = $1`,
          [existing[0].id]
        );
        console.log(`  ✓ Admin account REACTIVATED (username='admin')`);
      } else {
        console.log(`  · Admin account exists, ADMIN_PASSWORD env var not set — leaving password unchanged`);
      }
    }
  } catch (e) {
    console.error('  ✗ Admin seed/refresh failed:', e.message);
  }

  console.log('───── auth bootstrap complete ─────');
}

// ─── TOKEN HELPERS ───────────────────────────────────────────────────────────
// Item 18 fix: JWT audience pinning added to sign and verify.
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, team: user.team },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY, audience: JWT_AUDIENCE, issuer: JWT_ISSUER }
  );
}

// Wave 13C: short-lived impersonation token. Uses the same JWT_SECRET and
// audience/issuer but carries impersonator_id so downstream code can
// distinguish impersonated requests. 1-hour TTL — admin's own lfs_session
// stays untouched.
const IMPERSONATION_COOKIE = 'lfs_impersonation';
const IMPERSONATION_TTL    = '1h';

function signImpersonationToken(payload) {
  return jwt.sign(
    {
      id:               payload.id,
      username:         payload.username,
      role:             payload.role,
      team:             payload.team,
      full_name:        payload.full_name,
      impersonator_id:  payload.impersonator_id,
      impersonator_name: payload.impersonator_name,
    },
    JWT_SECRET,
    { expiresIn: IMPERSONATION_TTL, audience: JWT_AUDIENCE, issuer: JWT_ISSUER }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER,
    });
  }
  catch (e) { return null; }
}

function extractToken(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.substring(7);
  return null;
}

function authMiddleware(pool) {
  return async (req, res, next) => {
    // Wave 13C: check impersonation cookie FIRST. When an admin has started a
    // "view as" session, their lfs_impersonation cookie carries the target
    // user's identity. The admin's own lfs_session is untouched — closing the
    // impersonation tab or calling end-impersonation removes this cookie.
    //
    // The impersonation token must NOT be usable to start a new impersonation
    // (no chaining). That guard lives in the /api/admin/impersonate endpoint.
    if (req.cookies && req.cookies[IMPERSONATION_COOKIE]) {
      const impPayload = verifyToken(req.cookies[IMPERSONATION_COOKIE]);
      if (impPayload && impPayload.impersonator_id) {
        try {
          // Verify the target user still exists and is active.
          const { rows } = await pool.query(
            `SELECT id, username, role, team, extra_teams, full_name, email, active, staff_id FROM users WHERE id = $1 LIMIT 1`,
            [impPayload.id]
          );
          const target = rows[0];
          if (target && target.active) {
            req.user = {
              ...target,
              impersonator_id:   impPayload.impersonator_id,
              impersonator_name: impPayload.impersonator_name,
              iat: impPayload.iat,
            };
            console.warn(
              `[impersonation:request] admin=${impPayload.impersonator_id} acting as user=${target.id} (${target.username}) — ${req.method} ${req.path}`
            );
            return next();
          }
        } catch (e) {
          console.error('[auth:impersonation] DB error reading impersonated user', e && e.message);
        }
        // Invalid or expired impersonation — fall through to normal auth below.
      }
    }

    const token = extractToken(req);
    if (!token) return next();
    const payload = verifyToken(token);
    if (!payload) return next();
    try {
      const { rows } = await pool.query(
        `SELECT id, username, role, team, extra_teams, full_name, email, active,
                staff_id, tokens_invalid_after
         FROM users WHERE id = $1 LIMIT 1`,
        [payload.id]
      );
      const u = rows[0];
      if (!u || !u.active) return next();
      if (u.tokens_invalid_after && payload.iat) {
        const tokenIssuedMs = payload.iat * 1000;
        if (new Date(u.tokens_invalid_after).getTime() > tokenIssuedMs) {
          return next();
        }
      }
      req.user = u;
      // Wave 1.1 fix: merge JWT iat into req.user so downstream consumers
      // (notably the SSE heartbeat in routes/_sse.js) can re-validate
      // tokens_invalid_after against the token's issued-at timestamp.
      // Without this, req.user.iat was always undefined, so the heartbeat
      // computed tokenIssuedAt=0 and killed every SSE connection for any
      // user with tokens_invalid_after set (i.e. anyone who'd ever
      // changed their password).
      req.user.iat = payload.iat;
    } catch (e) {
      console.error('[auth:authMiddleware] DB error reading user', e && e.message);
    }
    next();
  };
}

// Item 20 fix: requireAuth([]) empty-array trap.
// An empty allowed array means "any authenticated role" — treat it as
// if no roles were specified. The old code used `!allowed.includes(role)`,
// which would always be true for an empty array, blocking every role.
function requireAuth(roles) {
  const allowed = roles ? (Array.isArray(roles) ? roles : [roles]) : null;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    // Item 20 fix: empty array means any role is acceptable
    if (allowed && allowed.length > 0 && !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    next();
  };
}

const requireAdmin = requireAuth('admin');

const requireManagerOrAdmin = requireAuth(['admin', 'design_manager', 'permitting_manager']);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
function installAuthRoutes(app, pool) {
  app.use(cookieParser());
  app.use(authMiddleware(pool));

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    if (!rateLimitOk('login:ip:' + ip, 10, 15 * 60 * 1000) ||
        !rateLimitOk('login:user:' + String(username).toLowerCase(), 5, 15 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
    }
    try {
      const { rows } = await pool.query(
        `SELECT id, username, password_hash, role, team, extra_teams, full_name, email, active, theme
         FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
        [username]
      );
      const user = rows[0];
      const hashToCompare = user ? user.password_hash : DUMMY_HASH;
      const passwordOk = await bcrypt.compare(password, hashToCompare);
      const accountOk = !!(user && user.active);
      if (!user || !passwordOk || !accountOk) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = signToken(user);
      res.cookie(COOKIE_NAME, token, {
        ...cookieOpts(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]).catch(()=>{});
      // Token is returned in BOTH cookie + body. The cookie is the canonical
      // session carrier (httpOnly, sameSite=lax, secure in production). The
      // body token is the sessionStorage fallback used by api.js when the
      // cookie isn't available (cross-subdomain portals, third-party-cookie
      // blockers, etc.). Wave 1.5 tried to drop the body token and broke
      // smoke tests + every client that relies on the Bearer-header fallback;
      // restoring it. Proper hardening (rotate-on-use + same-site=strict +
      // first-party domain consolidation) is deferred to a future wave.
      res.json({
        token,
        user: {
          id: user.id, username: user.username, role: user.role, team: user.team,
          full_name: user.full_name, email: user.email, theme: user.theme,
          extra_teams: user.extra_teams || []
        }
      });
    } catch (e) {
      return serverError(res, e, 'login');
    }
  });

  // Wave 1.5 [LOGOUT-INVALIDATE]: Bump tokens_invalid_after on logout so any
  // JWT in flight (sessionStorage copy, another tab, stolen cookie) is
  // rejected on next request. Cookie is cleared too; both paths are needed
  // because the Bearer-header path in api.js doesn't rely on the cookie.
  app.post('/api/auth/logout', async (req, res) => {
    res.clearCookie(COOKIE_NAME, cookieOpts());
    if (req.user && req.user.id) {
      try {
        await pool.query(
          `UPDATE users SET tokens_invalid_after = NOW() WHERE id = $1`,
          [req.user.id]
        );
      } catch (e) {
        // Non-fatal — cookie is already cleared. Log and continue.
        console.error('[auth:logout] Failed to bump tokens_invalid_after:', e && e.message);
      }
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    try {
      const { rows } = await pool.query(
        `SELECT id, username, role, team, extra_teams, full_name, email, theme, staff_id FROM users WHERE id = $1`,
        [req.user.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      const result = rows[0];
      // Wave 13C: if this request came through an impersonation cookie, include
      // the impersonator context so the frontend can show the warning banner.
      if (req.user.impersonator_id) {
        result.impersonator_id   = req.user.impersonator_id;
        result.impersonator_name = req.user.impersonator_name;
      }
      res.json(result);
    } catch (e) {
      return serverError(res, e, 'me');
    }
  });

  app.get('/api/auth/portal-urls', requireAuth(), (req, res) => {
    let urls = {};
    try {
      const raw = process.env.PORTAL_URLS;
      if (raw) urls = JSON.parse(raw);
    } catch (e) { /* malformed JSON — return empty */ }
    res.json(urls);
  });

  app.put('/api/auth/me/theme', requireAuth(), async (req, res) => {
    const { theme } = req.body || {};
    if (theme !== null && theme !== 'light' && theme !== 'dark') {
      return res.status(400).json({ error: 'theme must be "light", "dark", or null' });
    }
    try {
      await pool.query(`UPDATE users SET theme = $1, updated_at = NOW() WHERE id = $2`,
        [theme, req.user.id]);
      res.json({ ok: true, theme });
    } catch (e) {
      return serverError(res, e, 'theme');
    }
  });

  app.get('/api/auth/me/dashboard-layout', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT dashboard_layout FROM users WHERE id = $1`, [req.user.id]
      );
      res.json(rows[0]?.dashboard_layout || {});
    } catch (e) { return serverError(res, e, 'get-dashboard-layout'); }
  });

  app.put('/api/auth/me/dashboard-layout', requireAuth(), async (req, res) => {
    const layout = req.body;
    if (layout == null || typeof layout !== 'object' || Array.isArray(layout)) {
      return res.status(400).json({ error: 'layout must be a JSON object' });
    }
    try {
      await pool.query(
        `UPDATE users SET dashboard_layout = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify(layout), req.user.id]
      );
      res.json({ ok: true, layout });
    } catch (e) { return serverError(res, e, 'put-dashboard-layout'); }
  });

  app.post('/api/auth/change-password', requireAuth(), async (req, res) => {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (new_password.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD_LEN} characters` });
    }
    if (!rateLimitOk('changepw:' + req.user.id, 5, 5 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many attempts. Please wait 5 minutes.' });
    }
    try {
      const { rows } = await pool.query(
        `SELECT password_hash FROM users WHERE id = $1`,
        [req.user.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      const match = await bcrypt.compare(current_password, rows[0].password_hash);
      if (!match) return res.status(401).json({ error: 'Current password incorrect' });
      const hash = await bcrypt.hash(new_password, BCRYPT_ROUNDS);
      await pool.query(
        `UPDATE users SET password_hash = $1, tokens_invalid_after = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [hash, req.user.id]
      );
      const newToken = signToken({ ...req.user, password_hash: hash });
      res.cookie(COOKIE_NAME, newToken, {
        ...cookieOpts(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // Token returned in both cookie + body (sessionStorage fallback). See
      // POST /api/auth/login above for the full rationale.
      res.json({ ok: true, token: newToken });
    } catch (e) {
      return serverError(res, e, 'change-password');
    }
  });

  // ─── ADMIN USER MANAGEMENT ─────────────────────────────────────────────────
  app.get('/api/users', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT u.id, u.username, u.role, u.team, u.extra_teams, u.staff_id,
               u.full_name, u.email, u.active, u.created_at, u.last_login,
               s.name as staff_name
        FROM users u
        LEFT JOIN staff s ON s.id = u.staff_id
        ORDER BY u.active DESC, u.username ASC
      `);
      res.json(rows);
    } catch (e) { return serverError(res, e, 'list-users'); }
  });

  app.post('/api/users', requireAdmin, async (req, res) => {
    const { username, password, role, full_name, email, extra_teams } = req.body || {};
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password, and role required' });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (password.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LEN} characters` });
    }
    const cleanExtras = Array.isArray(extra_teams)
      ? extra_teams.filter(t => ['design','permitting','construction','inspection'].includes(t)).map(t => t === 'inspection' ? 'construction' : t)
      : [];
    try {
      const team = teamForRole(role);
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const cleanUsername = String(username).trim();
      const { rows } = await pool.query(
        `INSERT INTO users (username, password_hash, role, team, full_name, email, extra_teams)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, role, team, extra_teams, full_name, email, active, created_at`,
        [cleanUsername, hash, role, team, full_name || null, email || null, cleanExtras]
      );
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' });
      return serverError(res, e, 'create-user');
    }
  });

  app.put('/api/users/:id', requireAdmin, async (req, res) => {
    const { username, role, full_name, email, active, password, extra_teams, staff_id } = req.body || {};
    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (password && password.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LEN} characters` });
    }
    if (active === false && req.user.id === req.params.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }
    try {
      const sets = [];
      const vals = [req.params.id];
      let i = 2;
      if (username !== undefined)  { sets.push(`username = $${i++}`); vals.push(username); }
      if (role !== undefined)      {
        sets.push(`role = $${i++}`); vals.push(role);
        sets.push(`team = $${i++}`); vals.push(teamForRole(role));
      }
      if (full_name !== undefined) { sets.push(`full_name = $${i++}`); vals.push(full_name); }
      if (email !== undefined)     { sets.push(`email = $${i++}`); vals.push(email); }
      if (active !== undefined)    { sets.push(`active = $${i++}`); vals.push(!!active); }
      if (extra_teams !== undefined) {
        const cleanExtras = Array.isArray(extra_teams)
          ? extra_teams.filter(t => ['design','permitting','construction','inspection'].includes(t)).map(t => t === 'inspection' ? 'construction' : t)
          : [];
        sets.push(`extra_teams = $${i++}`); vals.push(cleanExtras);
      }
      if (staff_id !== undefined) {
        sets.push(`staff_id = $${i++}`); vals.push(staff_id || null);
      }
      if (password) {
        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        sets.push(`password_hash = $${i++}`); vals.push(hash);
        sets.push(`tokens_invalid_after = NOW()`);
      }
      if (active === false) {
        sets.push(`tokens_invalid_after = NOW()`);
      }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      sets.push(`updated_at = NOW()`);
      const { rows } = await pool.query(
        `UPDATE users SET ${sets.join(', ')} WHERE id = $1
         RETURNING id, username, role, team, extra_teams, staff_id, full_name, email, active, last_login`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' });
      return serverError(res, e, 'update-user');
    }
  });

  app.delete('/api/users/:id', requireAdmin, async (req, res) => {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    const hard = req.query.hard === '1' || req.query.hard === 'true';
    try {
      if (hard) {
        const cur = await pool.query(
          'SELECT id, username, active FROM users WHERE id = $1',
          [req.params.id]
        );
        if (!cur.rows[0]) return res.status(404).json({ error: 'User not found' });
        if (cur.rows[0].active) {
          return res.status(409).json({
            error: 'Refuse to hard-delete an active user. Soft-delete (deactivate) first, then call DELETE ?hard=1 to permanently remove.',
          });
        }
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        return res.json({ ok: true, mode: 'hard', deleted_username: cur.rows[0].username });
      }

      const { rows } = await pool.query(
        `UPDATE users SET active = FALSE, tokens_invalid_after = NOW(), updated_at = NOW()
         WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json({ ok: true, mode: 'soft', deactivated: true });
    } catch (e) { return serverError(res, e, 'delete-user'); }
  });
}

module.exports = {
  bootstrapAuthSchema,
  installAuthRoutes,
  authMiddleware,
  requireAuth,
  requireAdmin,
  requireManagerOrAdmin,
  signToken,
  signImpersonationToken,
  verifyToken,
  rateLimitOk,
  teamForRole,
  teamsForUser,
  canAccessPortal,
  isManagerOrAdmin,
  MIN_PASSWORD_LEN,
  VALID_ROLES,
  IMPERSONATION_COOKIE,
  cookieOpts,
};
