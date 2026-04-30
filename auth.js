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

// JWT secret — env var preferred, fallback to a derived constant so the
// system still works without explicit configuration. WARNING: the derived
// fallback means tokens issued by one Railway service may not validate on
// another. For production multi-service setups, set JWT_SECRET env var to
// the SAME value on admin + both portal services.
const JWT_SECRET = process.env.JWT_SECRET ||
  crypto.createHash('sha256').update('launch-fiber-services-default-secret-please-set-env').digest('hex');
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'lfs_session';
const BCRYPT_ROUNDS = 10;

// Valid roles (used for validation when admin creates/edits a user)
const VALID_ROLES = [
  'admin',
  'design_manager',
  'permitting_manager',
  'design_engineer',
  'permitting_engineer'
];

// Helper: which team does a role belong to? Used for filtering data per user.
function teamForRole(role) {
  if (!role) return null;
  if (role.startsWith('design_')) return 'design';
  if (role.startsWith('permitting_')) return 'permitting';
  return null;  // admin sees all
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
      // No admin row at all — create from env (or fallback to 'admin')
      const initialPw = envPw || 'admin';
      const hash = await bcrypt.hash(initialPw, BCRYPT_ROUNDS);
      await pool.query(
        `INSERT INTO users (username, password_hash, role, team, full_name, email, active)
         VALUES ('admin', $1, 'admin', NULL, 'Default Admin', NULL, TRUE)`,
        [hash]
      );
      console.log(`  ✓ Default admin CREATED — username='admin', password='${initialPw}' (CHANGE IT)`);
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
    // Verify user is still active in DB (don't trust an old token if account was deactivated)
    try {
      const { rows } = await pool.query(
        `SELECT id, username, role, team, full_name, email, active
         FROM users WHERE id = $1 LIMIT 1`,
        [payload.id]
      );
      if (rows[0] && rows[0].active) {
        req.user = rows[0];
      }
    } catch (e) { /* swallow — req.user stays unset */ }
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

// ─── ROUTES ──────────────────────────────────────────────────────────────────
function installAuthRoutes(app, pool) {
  app.use(cookieParser());
  app.use(authMiddleware(pool));

  // POST /api/auth/login — exchange username + password for a JWT.
  // Returns 401 on bad credentials, 403 on inactive account.
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    try {
      const { rows } = await pool.query(
        `SELECT id, username, password_hash, role, team, full_name, email, active, theme
         FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
        [username]
      );
      const user = rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid username or password' });
      if (!user.active) return res.status(403).json({ error: 'Account is deactivated' });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid username or password' });

      const token = signToken(user);
      // Set httpOnly cookie. SameSite=Lax allows the cookie on same-site nav
      // (good UX — clicking links works) without leaking to cross-site requests.
      // Secure flag is added in production so the cookie only travels over HTTPS.
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      // Update last_login timestamp (best-effort, not critical)
      pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]).catch(()=>{});
      // Return the user object (no password_hash) AND the token so frontend
      // can also use Authorization header if desired.
      res.json({
        token,
        user: {
          id: user.id, username: user.username, role: user.role, team: user.team,
          full_name: user.full_name, email: user.email, theme: user.theme
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/auth/logout — clears the cookie. Frontend should also clear
  // any cached state and redirect to /login.
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
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
        `SELECT id, username, role, team, full_name, email, theme FROM users WHERE id = $1`,
        [req.user.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
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
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/auth/change-password — current user updates their own password.
  // Requires current password to confirm identity (defense against open-tab
  // hijacking and against helper popping a session and changing the password).
  app.post('/api/auth/change-password', requireAuth(), async (req, res) => {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
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
      await pool.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
        [hash, req.user.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── ADMIN USER MANAGEMENT ─────────────────────────────────────────────────
  // GET /api/users — list (admin only)
  app.get('/api/users', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT id, username, role, team, full_name, email, active, created_at, last_login
        FROM users ORDER BY active DESC, username ASC
      `);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // POST /api/users — create user (admin only)
  app.post('/api/users', requireAdmin, async (req, res) => {
    const { username, password, role, full_name, email } = req.body || {};
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password, and role required' });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    try {
      const team = teamForRole(role);
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const { rows } = await pool.query(
        `INSERT INTO users (username, password_hash, role, team, full_name, email)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, username, role, team, full_name, email, active, created_at`,
        [username, hash, role, team, full_name || null, email || null]
      );
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' });
      res.status(500).json({ error: e.message });
    }
  });

  // PUT /api/users/:id — update user (admin only). Optional password reset via 'password' field.
  app.put('/api/users/:id', requireAdmin, async (req, res) => {
    const { username, role, full_name, email, active, password } = req.body || {};
    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (password && password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
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
      if (password) {
        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        sets.push(`password_hash = $${i++}`); vals.push(hash);
      }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      sets.push(`updated_at = NOW()`);
      const { rows } = await pool.query(
        `UPDATE users SET ${sets.join(', ')} WHERE id = $1
         RETURNING id, username, role, team, full_name, email, active, last_login`,
        vals
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' });
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE /api/users/:id — soft delete (sets active=false). Hard delete only
  // available via direct SQL because deleting a user may orphan time_entries.
  app.delete('/api/users/:id', requireAdmin, async (req, res) => {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    try {
      const { rows } = await pool.query(
        `UPDATE users SET active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'User not found' });
      res.json({ ok: true, deactivated: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

module.exports = {
  bootstrapAuthSchema,
  installAuthRoutes,
  authMiddleware,
  requireAuth,
  requireAdmin,
  signToken,
  verifyToken,
  teamForRole,
  isManagerOrAdmin,
  VALID_ROLES,
};
