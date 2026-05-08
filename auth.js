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
//
// Authentication mechanism:
//   - Login produces a JWT signed with JWT_SECRET (env var, fallback to a derived value)
//   - Token stored in httpOnly cookie 'lfs_session' AND returnable in response body
//   - Frontend sends either via cookie (default) or Authorization: Bearer header
//   - Default expiry: 7 days

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// JWT secret — REQUIRED in production. In development we generate a random
// per-process value if missing (so localhost dev works without setup), but
// production deploys must set JWT_SECRET — refusing to boot otherwise.
// In multi-service setups set the SAME JWT_SECRET on every service.
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

// Tiny in-memory sliding-window rate limiter. Single-process only — fine for
// Railway's default 1-instance deploy. If we ever scale horizontally this
// needs to move to Postgres or a shared cache. Key is usually IP:username for
// login attempts.
const _rlBuckets = new Map();
function rateLimitOk(key, limit, windowMs) {
  // Test runs hammer adminLogin() and would otherwise trip the 5-per-15min
  // username limit on the shared `admin` user; skip in tests so the suite
  // doesn't go red on rate limits unrelated to the SUT.
  if (process.env.NODE_ENV === 'test') return true;
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
// Periodically drop empty buckets so the Map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _rlBuckets) {
    const fresh = v.filter(t => now - t < 60 * 60 * 1000);
    if (fresh.length === 0) _rlBuckets.delete(k);
    else _rlBuckets.set(k, fresh);
  }
}, 5 * 60 * 1000).unref();

// Pre-computed bcrypt hash of a never-valid password. Used to keep login
// timing constant when the username doesn't exist (defends against username
// enumeration via response timing).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-' + crypto.randomBytes(8).toString('hex'), BCRYPT_ROUNDS);

// Cookie options shared by set + clear so clearCookie actually clears the
// cookie (browsers require options to match).
function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

// Generic safe error response — logs full error server-side, returns a
// stable string to the client so we don't leak SQL errors / stack info.
function serverError(res, e, where) {
  console.error(`[auth:${where}]`, e && e.stack ? e.stack : e);
  return res.status(500).json({ error: 'Internal server error' });
}

// Valid roles (used for validation when admin creates/edits a user)
const VALID_ROLES = [
  'admin',
  'design_manager',
  'permitting_manager',
  'design_engineer',
  'permitting_engineer',
  // Customers are external — they see ONLY data for the clients linked
  // to their user via the customer_clients table. Read-only across the
  // whole API surface; the customer portal exposes a curated subset of
  // endpoints under /api/customer/*.
  'customer',
];

// Helper: which team does a role belong to? Used for filtering data per user.
function teamForRole(role) {
  if (!role) return null;
  if (role.startsWith('design_')) return 'design';
  if (role.startsWith('permitting_')) return 'permitting';
  // 'construction_*' is the canonical prefix going forward (formerly
  // 'inspection_'). Owner renamed the team 2026-05-06; the migration
  // 0009_rename_inspection_team_to_construction.sql swept the data.
  // We accept the old prefix too so any stale JWTs minted before the
  // rename still resolve to the same team.
  if (role.startsWith('construction_')) return 'construction';
  if (role.startsWith('inspection_')) return 'construction';
  return null;  // admin / customer sees no team scope (they're filtered differently)
}

// Helper: ALL teams a user can access. Combines their primary role's team
// with any extra_teams they've been granted. Returns array of team strings:
// 'design' | 'permitting' | 'construction'. Empty array means no team-scoped
// access (admin sees everything regardless, so this only matters for
// non-admin users in portal contexts).
//
// Example: a design_engineer with extra_teams=['permitting'] returns
// ['design','permitting'] — they can use either portal and see both teams'
// data inside whichever one they're viewing.
//
// Backward compat: extra_teams may still contain the legacy 'inspection'
// string on rows that pre-date migration 0009. Treat it as 'construction'.
function teamsForUser(user) {
  if (!user) return [];
  if (user.role === 'admin') return ['design','permitting','construction'];
  const primary = teamForRole(user.role);
  const extras = Array.isArray(user.extra_teams) ? user.extra_teams : [];
  const set = new Set();
  if (primary) set.add(primary);
  for (const t of extras) {
    if (t === 'design' || t === 'permitting' || t === 'construction') set.add(t);
    else if (t === 'inspection') set.add('construction');  // legacy alias
  }
  return [...set];
}

// Helper: can the given user access the given portal mode? Wraps teamsForUser
// with PORTAL_MODE convention. Returns true for admin always.
function canAccessPortal(user, portalMode) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return teamsForUser(user).includes(portalMode);
}

// Helper: is this user a manager-or-higher? Used for revenue/billing access.
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
    // Audit trail columns on key tables (Phase 3) — track who created and who
    // last modified key records. Idempotent — IF NOT EXISTS skips if already added.
    `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE projects        ADD COLUMN IF NOT EXISTS updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE time_entries    ADD COLUMN IF NOT EXISTS user_id            UUID REFERENCES users(id) ON DELETE SET NULL`,
    `ALTER TABLE permit_documents ADD COLUMN IF NOT EXISTS uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL`,
    // User-level UI preferences. theme: 'light' | 'dark' | NULL (NULL = follow
    // system preference). Persisted server-side so it follows the user across
    // browsers and devices instead of being trapped in one localStorage.
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(10)`,
    // Multi-team access. extra_teams is a TEXT[] of additional teams the user
    // can access beyond their primary role's team. E.g. a design_engineer with
    // extra_teams = '{permitting}' can use the permitting portal and see
    // permitting data alongside their design work. Empty array = single-team
    // access (the default). Admins always see everything regardless.
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS extra_teams TEXT[] DEFAULT '{}'`,
    // tokens_invalid_after — bumped on password change / forced logout.
    // authMiddleware rejects any JWT whose iat is older than this timestamp,
    // so changing your password (or an admin resetting it) invalidates every
    // active session for that user immediately.
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_invalid_after TIMESTAMPTZ`,
    // Per-user dashboard layout / widget visibility. JSONB blob — keys are
    // widget IDs, values are { hidden?: bool, order?: int }. Frontend
    // owns the schema; backend just stores/returns. Lets a manager hide
    // widgets that don't apply to their team without affecting anyone else.
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

  // Seed/refresh the default admin account.
  //
  // Behavior:
  //   - If no admin user exists at all → create one with the env password
  //   - If admin user exists but ADMIN_PASSWORD env var is set → REFRESH the
  //     password from env. This makes the env var always authoritative for
  //     the default 'admin' username, so if you forget the password, you can
  //     just set ADMIN_PASSWORD on Railway, redeploy, and sign back in.
  //   - If admin user exists and ADMIN_PASSWORD is unset → leave it alone
  //     (the user has presumably set their own password via the UI)
  //
  // We always log what happened so deploy logs are diagnostic. The previous
  // version silently no-op'd if any admin existed, which made it impossible
  // to recover from a partial-run state where the row existed but no one
  // knew the password.
  try {
    const envPw = process.env.ADMIN_PASSWORD;
    const { rows: existing } = await pool.query(
      `SELECT id, active FROM users WHERE LOWER(username) = 'admin' LIMIT 1`
    );

    if (existing.length === 0) {
      // No admin row at all — REQUIRE ADMIN_PASSWORD env var. We refuse to
      // seed a known/default password because it would mean a fresh deploy
      // ships with admin/admin until someone notices.
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
      // Admin exists and env wants to override the password. Always refresh.
      const hash = await bcrypt.hash(envPw, BCRYPT_ROUNDS);
      await pool.query(
        `UPDATE users SET password_hash = $1, role = 'admin', active = TRUE, updated_at = NOW()
         WHERE LOWER(username) = 'admin'`,
        [hash]
      );
      console.log(`  ✓ Admin password REFRESHED from ADMIN_PASSWORD env var (username='admin')`);
    } else {
      // Admin exists, no env override. Leave password alone but ensure account active.
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
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, team: user.team },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch (e) { return null; }
}

// Extract token from either cookie or Authorization: Bearer header
function extractToken(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.substring(7);
  return null;
}

// Middleware that decodes the token (if present) and attaches req.user.
// Does NOT enforce auth — endpoints that require it should also use requireAuth.
// This separation lets pages like /login skip the auth check entirely.
function authMiddleware(pool) {
  return async (req, res, next) => {
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
      // Honor forced session invalidation: if the user's
      // tokens_invalid_after is newer than this token's iat, treat as
      // logged-out (e.g. after password change or admin reset).
      if (u.tokens_invalid_after && payload.iat) {
        const tokenIssuedMs = payload.iat * 1000;
        if (new Date(u.tokens_invalid_after).getTime() > tokenIssuedMs) {
          return next();
        }
      }
      req.user = u;
    } catch (e) {
      console.error('[auth:authMiddleware] DB error reading user', e && e.message);
    }
    next();
  };
}

// requireAuth(roles) — returns middleware that 401s if no user OR 403s if role mismatch.
// roles can be a string ('admin') or array (['admin','design_manager']) or omitted (any logged-in user).
function requireAuth(roles) {
  const allowed = roles ? (Array.isArray(roles) ? roles : [roles]) : null;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    if (allowed && !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
    next();
  };
}

// requireAdmin shortcut
const requireAdmin = requireAuth('admin');

// requireManagerOrAdmin — for billing/revenue/financial endpoints that
// managers should see for their own team but engineers should not.
const requireManagerOrAdmin = requireAuth(['admin', 'design_manager', 'permitting_manager']);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
function installAuthRoutes(app, pool) {
  app.use(cookieParser());
  app.use(authMiddleware(pool));

  // POST /api/auth/login — exchange username + password for a JWT.
  // Single uniform 401 error message + always run bcrypt to prevent
  // username enumeration via response or timing differences. Rate limited
  // per-IP and per-username to slow down credential stuffing.
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    // 10 attempts / 15 min per IP, 5 attempts / 15 min per username.
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
      // Always run bcrypt against SOMETHING so timing is constant whether
      // the user exists or not. We also collapse "wrong password",
      // "user not found", and "account deactivated" into one generic 401
      // so an attacker can't enumerate usernames.
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

  // POST /api/auth/logout — clears the cookie. Frontend should also clear
  // any cached state and redirect to /login.
  app.post('/api/auth/logout', (req, res) => {
    // clearCookie attrs MUST match the set attrs or the browser won't clear it
    res.clearCookie(COOKIE_NAME, cookieOpts());
    res.json({ ok: true });
  });

  // GET /api/auth/me — returns the current user. Frontend calls this on page
  // load to decide which UI to render. 401 if not logged in. We do a fresh DB
  // read so theme + any other persisted preferences are current (the JWT only
  // has id/username/role baked in for performance — preferences live in the
  // users table and are read on demand).
  app.get('/api/auth/me', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    try {
      const { rows } = await pool.query(
        `SELECT id, username, role, team, extra_teams, full_name, email, theme FROM users WHERE id = $1`,
        [req.user.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(rows[0]);
    } catch (e) {
      return serverError(res, e, 'me');
    }
  });

  // GET /api/auth/portal-urls — returns the cross-portal URL map so clients with
  // extra_teams can navigate between portals. Reads the PORTAL_URLS env var
  // (JSON object: {"design":"https://...", "permitting":"https://...", ...}).
  // Returns an empty object if not configured — the frontend hides the tab.
  app.get('/api/auth/portal-urls', requireAuth(), (req, res) => {
    let urls = {};
    try {
      const raw = process.env.PORTAL_URLS;
      if (raw) urls = JSON.parse(raw);
    } catch (e) { /* malformed JSON — return empty */ }
    res.json(urls);
  });

  // PUT /api/auth/me/theme — persist current user's theme preference.
  // Body: { theme: 'light' | 'dark' | null }. NULL clears the preference and
  // the frontend falls back to system/OS preference. Persisted server-side so
  // the choice follows the user across browsers and devices.
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

  // GET /api/auth/me/dashboard-layout — return this user's saved layout.
  // Empty object means "use defaults"; the frontend doesn't need to special
  // case anything.
  app.get('/api/auth/me/dashboard-layout', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT dashboard_layout FROM users WHERE id = $1`, [req.user.id]
      );
      res.json(rows[0]?.dashboard_layout || {});
    } catch (e) { return serverError(res, e, 'get-dashboard-layout'); }
  });

  // PUT /api/auth/me/dashboard-layout — replace the saved layout. Body is
  // the full layout object; partial-merge isn't supported (frontend already
  // computes the full state before sending). Validated to be an object so
  // a malformed POST can't poison the column.
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

  // POST /api/auth/change-password — current user updates their own password.
  // Requires current password to confirm identity (defense against open-tab
  // hijacking and against helper popping a session and changing the password).
  // Bumps tokens_invalid_after to log out every other active session.
  app.post('/api/auth/change-password', requireAuth(), async (req, res) => {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (new_password.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD_LEN} characters` });
    }
    // Rate limit per user to slow current-password guessing
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
      // tokens_invalid_after bump invalidates every JWT issued before NOW(),
      // including the one in the user's other open tabs/devices.
      await pool.query(
        `UPDATE users SET password_hash = $1, tokens_invalid_after = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [hash, req.user.id]
      );
      // Re-issue a fresh token for the current session so this caller stays logged in.
      const newToken = signToken({ ...req.user, password_hash: hash });
      res.cookie(COOKIE_NAME, newToken, {
        ...cookieOpts(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ ok: true, token: newToken });
    } catch (e) {
      return serverError(res, e, 'change-password');
    }
  });

  // ─── ADMIN USER MANAGEMENT ─────────────────────────────────────────────────
  // GET /api/users — list (admin only)
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

  // POST /api/users — create user (admin only)
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
    // Validate extra_teams if provided
    const cleanExtras = Array.isArray(extra_teams)
      ? extra_teams.filter(t => ['design','permitting','construction','inspection'].includes(t)).map(t => t === 'inspection' ? 'construction' : t)
      : [];
    try {
      const team = teamForRole(role);
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      // Store username trimmed; uniqueness enforced via the LOWER() index.
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

  // PUT /api/users/:id — update user (admin only). Optional password reset via 'password' field.
  app.put('/api/users/:id', requireAdmin, async (req, res) => {
    const { username, role, full_name, email, active, password, extra_teams, staff_id } = req.body || {};
    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (password && password.length < MIN_PASSWORD_LEN) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LEN} characters` });
    }
    // Prevent admin from deactivating themselves (lockout protection)
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
      // staff_id — links the user to a specific staff record. Required for
      // Time Clock portal access. NULL clears the link. Validation could
      // verify the staff record exists, but a bad UUID just produces a NULL
      // FK on update which is harmless.
      if (staff_id !== undefined) {
        sets.push(`staff_id = $${i++}`); vals.push(staff_id || null);
      }
      if (password) {
        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        sets.push(`password_hash = $${i++}`); vals.push(hash);
        // Admin-reset of password also kills all that user's existing sessions
        sets.push(`tokens_invalid_after = NOW()`);
      }
      if (active === false) {
        // Deactivating a user immediately invalidates their existing tokens
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

  // DELETE /api/users/:id
  //   default: soft-delete. Sets active=FALSE + invalidates tokens. Existing
  //            FK references (customer_clients, billing_batches.created_by,
  //            invoice_templates.created_by, ai_messages, etc.) stay intact.
  //   ?hard=1: hard-delete the row. Refused if the user is still active OR
  //            the user is the caller's own account. Requires the row to
  //            be soft-deleted first as a safety gate (forces a two-step
  //            "deactivate first, then permanently remove" flow). Cleans up
  //            customer_clients links automatically (ON DELETE CASCADE).
  //            Other FK columns are ON DELETE SET NULL so historical rows
  //            survive but lose the audit pointer.
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
  verifyToken,
  teamForRole,
  teamsForUser,
  canAccessPortal,
  isManagerOrAdmin,
  VALID_ROLES,
};
