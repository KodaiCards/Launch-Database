const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// @anthropic-ai/sdk now required only inside routes/ai.js — keep this
// require off the boot path so a missing dep / API key only impacts
// the AI surface, not the rest of the app.
const XLSX = require('xlsx');
const { pool, initSchema, applyDeferredSchemaStatements } = require('./db');
const installPortalExtensions = require('./portal_module');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Uploads directory ───────────────────────────────────────────────────────
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Sanitize filename for URL-safe storage. The biggest culprit is '#' — it's
// valid on disk but in URLs it's the fragment separator, so the browser
// silently strips everything after it before sending the request. A file
// stored as 'abc_Permit_#U-207.pdf' becomes inaccessible because the browser
// requests '/uploads/abc_Permit_' and the rest is treated as a fragment.
// '?' has the same problem (query string separator). We replace these and
// also collapse whitespace runs to single underscores so URLs stay clean.
function sanitizeFilename(name) {
  return name
    .replace(/[#?]/g, '_')          // URL fragment / query separators
    .replace(/[\\/]/g, '_')         // path separators
    .replace(/\s+/g, ' ')           // collapse repeated whitespace
    .trim();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${sanitizeFilename(file.originalname)}`)
});
// 3GB cap. Multer streams multipart uploads to disk so RAM stays low even
// for huge files. The practical ceiling on a single HTTP POST upload is
// usually set by the cloud platform's request timeout (Railway: 5 minutes
// by default), not by Node. A 3GB file at 100Mbps upload takes ~4 minutes,
// at 50Mbps takes ~8 minutes — so very large files may need to be uploaded
// over a fast connection or split into a ZIP per drawing pack.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024 * 1024;  // 3 GB
const upload = multer({ storage, limits: { fileSize: MAX_UPLOAD_BYTES } });

// ─── Middleware ───────────────────────────────────────────────────────────────
// Trust the first proxy hop (Railway's load balancer) so req.ip and
// req.protocol see the real client, not the proxy. This must be set BEFORE
// any middleware that reads req.ip / req.protocol — otherwise rate limiting
// buckets every caller into one IP and the same-origin CSRF check breaks.
app.set('trust proxy', 1);

// Security response headers — defence-in-depth for all routes.
// X-Content-Type-Options: stops browsers sniffing response MIME types.
// X-Frame-Options: prevents clickjacking via <iframe> embedding.
// Strict-Transport-Security: instructs browsers to use HTTPS for 1 year
//   after first secure visit (Railway terminates TLS upstream).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  }
  next();
});

// CORS — locked down to the origins listed in ALLOWED_ORIGINS (comma-separated).
// In dev, falls back to allowing localhost. Anything else is rejected.
// Multi-service setups (admin + portals on different domains): list every
// origin that needs to talk to this service.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const isProd = process.env.NODE_ENV === 'production';
if (isProd && ALLOWED_ORIGINS.length === 0) {
  console.warn('⚠ ALLOWED_ORIGINS env var is empty in production — cross-origin requests will be rejected. Set it to a comma-separated list of your portal/admin URLs if you need cross-origin.');
}
app.use(cors({
  origin: (origin, cb) => {
    // No Origin header (server-to-server, curl, same-origin GET): allow.
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    // Allow localhost in dev so the dev workflow keeps working without env var.
    if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
// Form-encoded body parsing — activates only for matching Content-Type headers,
// safe to leave globally enabled. (Previously documented as supporting the
// removed Moodle OAuth2 token endpoint; that bridge was torn out in OSP-RW.6.)
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// CSRF defense via Origin/Referer validation. Cookie-auth + a cross-site form
// POST is the classic CSRF vector. For any state-changing request, require
// either no Origin (same-origin browser navigation) or an Origin/Referer
// matching ALLOWED_ORIGINS / our own host. Auth-header callers are still
// safe (the header isn't sent automatically by browsers cross-site).
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  // Item 19 fix: Login CSRF — still allow login from known origins (portal subdomains)
  // but reject cross-origin login from unknown/arbitrary origins.
  if (req.path === '/api/auth/login') {
    let loginOrigin = req.headers.origin;
    if (!loginOrigin && req.headers.referer) {
      try { loginOrigin = new URL(req.headers.referer).origin; } catch {}
    }
    // No origin = same-origin or server-to-server: allow
    if (!loginOrigin) return next();
    // Known allowed origin: allow
    if (ALLOWED_ORIGINS.includes(loginOrigin)) return next();
    // Localhost in dev: allow
    if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(loginOrigin)) return next();
    // Same-origin: allow
    const reqHost = req.headers.host;
    const reqProto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    if (reqHost && loginOrigin === `${reqProto}://${reqHost}`) return next();
    // Unknown cross-origin login attempt: reject
    console.warn(`[csrf:login] rejected cross-origin login from origin=${loginOrigin}`);
    return res.status(403).json({ error: 'Cross-site login not permitted from this origin' });
  }
  // If the caller authenticated via Authorization header, no CSRF risk.
  const hasBearer = (req.headers.authorization || '').startsWith('Bearer ');
  if (hasBearer) return next();
  let origin = req.headers.origin;
  if (!origin && req.headers.referer) {
    try { origin = new URL(req.headers.referer).origin; } catch {}
  }
  if (!origin) return next();  // some legitimate clients omit Origin entirely
  if (ALLOWED_ORIGINS.includes(origin)) return next();
  if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return next();
  // Same-origin: Origin matches the request's own host. Behind Railway/most
  // proxies the request hits us on https://<host>; trust the X-Forwarded-Proto
  // header (we set trust proxy below) so this comparison is accurate.
  const reqHost = req.headers.host;
  const reqProto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  if (reqHost && origin === `${reqProto}://${reqHost}`) return next();
  console.warn(`[csrf] rejected ${req.method} ${req.path} from origin=${origin} (host=${reqHost})`);
  return res.status(403).json({ error: 'Cross-site request blocked' });
});


// ─── Portal Mode ─────────────────────────────────────────────────────────────
// When PORTAL_MODE is set, this instance serves only that portal's HTML and
// blocks access to revenue/billing/AI endpoints. Deploy multiple services from
// the same repo with different PORTAL_MODE values.
//   ''           — admin portal (full UI)
//   'design'     — design team portal
//   'permitting' — permitting team portal
//   'timeclock'  — Launch Time Clock (clock-in/out for hourly tracking)
//   'splice'     — Splice Matrix (OSP fiber splice planning + PDF export)
const PORTAL_MODE = (process.env.PORTAL_MODE || '').toLowerCase();
const PORTAL_NAMES = {
  permitting: 'Permitting Portal',
  design: 'Design Portal',
  timeclock: 'Launch Time Clock',
  splice: 'Splice Matrix',
  // Customer portal: external users (clients) see ONLY their own
  // projects, progress, and invoices. Backed by customer_clients
  // table + the 'customer' role.
  customer: 'Client Portal',
};
if (PORTAL_MODE) {
  console.log(`✓ Running in PORTAL MODE: ${PORTAL_NAMES[PORTAL_MODE] || PORTAL_MODE}`);
}

// ─── Authentication (JWT-based) ──────────────────────────────────────────────
// auth.js bootstraps users table, exposes /api/auth/* routes, and provides
// an authMiddleware that decodes the JWT cookie or Authorization header into
// req.user. Login page lives at /login (or /login.html).
//
// IMPORTANT: installAuthRoutes registers cookieParser + authMiddleware as
// global middleware. It MUST run BEFORE installPortalExtensions so that
// portal routes can read req.user / req.cookies. Express middleware runs in
// registration order, so a route registered before authMiddleware never
// sees req.user.
const { bootstrapAuthSchema, installAuthRoutes, requireAuth, requireAdmin, requireManagerOrAdmin, requireStaff, canAccessPortal, canCreateProjects, signToken, signImpersonationToken, verifyToken, rateLimitOk, cookieOpts } = require('./auth');
installAuthRoutes(app, pool);

// Customer scope guard. Per auth.js's role doc: "Customers are external —
// they see ONLY data for the clients linked to their user via the
// customer_clients table. Read-only across the whole API surface; the
// customer portal exposes a curated subset of endpoints under
// /api/customer/*." That intent wasn't enforced — a customer JWT could
// hit /api/projects, /api/time-entries, /api/clients, /api/staff, etc.
// directly and see every row in the DB. Block any /api/* path other than
// the explicit auth + customer-portal surfaces for customer-role users.
app.use((req, res, next) => {
  if (!req.user || req.user.role !== 'customer') return next();
  const p = req.path || req.url || '';
  if (!p.startsWith('/api/')) return next();
  if (p.startsWith('/api/auth/')) return next();
  if (p.startsWith('/api/customer/')) return next();
  // Portal launcher — customers need this to build their tile list.
  if (p === '/api/me/portals') return next();
  return res.status(403).json({ error: 'Customer accounts can only access the customer portal API.' });
});

// ─── PORTAL_DEFS — role-to-portal mapping ────────────────────────────────────
// Each entry: { id, audience, url, name, icon, description, canAccess(user) }
// audience: 'employee' | 'client'
// canAccess: receives the user object from req.user and returns true/false.
// canAccessPortal(user, portalMode) from auth.js is the source of truth for
// splice/design/permitting access (it uses teamsForUser internally).

// Training tile URL: served as a bundled Vite SPA at /training/ behind requireAuth().
const TRAINING_URL = '/training/';

const PORTAL_DEFS = [
  {
    id: 'admin',
    audience: 'employee',
    url: '/admin.html',
    name: 'Admin Portal',
    icon: 'gauge',
    description: 'Full administration: projects, clients, billing, staff, and system settings.',
    canAccess: u => u.role === 'admin',
  },
  // Keystone operations UI (service areas → jobs → hours → billing). Deployed
  // since the rebuild but previously only reachable by typing the URL — this
  // tile surfaces it in the launcher. Lands on service-areas.html (carries the
  // app_nav rail → Dashboard / Pipelines / Billing).
  {
    id: 'operations',
    audience: 'employee',
    url: '/service-areas.html',
    name: 'Operations',
    icon: 'diagram-project',
    description: 'Service areas, jobs, pipelines, hours, and billing — the new operations model.',
    canAccess: u => u.role === 'admin' || canAccessPortal(u, 'design') || canAccessPortal(u, 'permitting'),
  },
  {
    id: 'splice',
    audience: 'employee',
    url: '/splice.html',
    name: 'Splice Matrix',
    icon: 'plug',
    description: 'OSP fiber splice planning, closure management, and PDF field-document export.',
    canAccess: u => canAccessPortal(u, 'splice') || u.role === 'admin',
  },
  {
    id: 'design',
    audience: 'employee',
    url: '/design.html',
    name: 'Design Portal',
    icon: 'compass-drafting',
    description: 'Design pipeline: projects, hours tracking, permit submittals, and revenue.',
    canAccess: u => canAccessPortal(u, 'design'),
  },
  {
    id: 'permitting',
    audience: 'employee',
    url: '/permitting.html',
    name: 'Permitting Portal',
    icon: 'file-signature',
    description: 'Permit staging, document management, and permitting financials.',
    canAccess: u => canAccessPortal(u, 'permitting'),
  },
  {
    id: 'timeclock',
    audience: 'employee',
    url: '/timeclock.html',
    name: 'Time Clock',
    icon: 'clock',
    description: 'Clock in/out, view your hours, and manage time entries.',
    canAccess: u => u.role !== 'customer',
  },
  {
    id: 'training',
    audience: 'employee',
    url: TRAINING_URL,
    name: 'Launch Training',
    icon: 'graduation-cap',
    description: 'OSP design training modules, references, and practice exercises.',
    canAccess: u => u.role !== 'customer',
  },
  {
    id: 'customer',
    audience: 'client',
    url: '/customer.html',
    name: 'Customer Portal',
    icon: 'user',
    description: 'View your projects, progress updates, and invoices.',
    canAccess: u => u.role === 'customer',
  },
  // Wave 12: client portal tile — admin-only by default; per-user overrides
  // grant access to specific staff via user_portal_access table.
  {
    id: 'client_portal',
    audience: 'employee',
    url: '/client-portal',
    name: 'Client Portal',
    icon: 'handshake',
    description: 'Client-facing portal preview.',
    canAccess: u => u.role === 'admin',
  },
  // Wave 37: offline DWG sync — pull project DWG files to a local folder
  // for offline AutoCAD use. Admin + design/permitting staff only.
  {
    id: 'offline_sync',
    audience: 'employee',
    url: '/offline-sync',
    name: 'Offline DWG Sync',
    icon: 'cloud-arrow-down',
    description: 'Sync DWG files to your laptop for offline AutoCAD use.',
    canAccess: u => ['admin', 'design_manager', 'design_engineer', 'permitting_manager', 'permitting_engineer'].includes(u.role),
  },
  // Wave 59: workspace manager
  {
    id: 'workspace',
    audience: 'employee',
    url: '/workspace/',
    name: 'Workspace',
    icon: 'folder-tree',
    description: 'Browse all employee workspaces, manage files and folders, and share documents.',
    canAccess: u => ['admin', 'design_manager', 'permitting_manager'].includes(u.role),
  },
  // Wave 120: desktop installer downloads.
  {
    id: 'downloads',
    audience: 'employee',
    url: '/downloads/',
    name: 'Downloads',
    icon: 'download',
    description: 'Download desktop installers for Windows, macOS, and Linux.',
    canAccess: u => u.role !== 'customer',
  },
  // Wave 122: file-activity admin view.
  {
    id: 'file_activity',
    audience: 'employee',
    url: '/admin/file-activity.html',
    name: 'File Activity',
    icon: 'list-check',
    description: 'Audit trail of all file uploads, downloads, trashes, and purges.',
    canAccess: u => u.role === 'admin',
  },
];

// GET /api/me/portals — returns the list of portals the current user can access.
// Optional query param: ?audience=employee|client
//   default: customer role → 'client'; everything else → 'employee'
// Returns: { portals: [{id, name, icon, url, description}], user: {role, name} }
// Wave 12: also checks user_portal_access table for per-user override grants.
app.get('/api/me/portals', requireAuth(), async (req, res) => {
  const u = req.user;
  const defaultAudience = u.role === 'customer' ? 'client' : 'employee';
  const audience = (req.query.audience === 'client' || req.query.audience === 'employee')
    ? req.query.audience
    : defaultAudience;

  let overrideKeys = new Set();
  if (u.role !== 'customer') {
    try {
      const { rows } = await pool.query(
        `SELECT portal_key FROM user_portal_access WHERE user_id = $1`,
        [u.id]
      );
      overrideKeys = new Set(rows.map(r => r.portal_key));
    } catch (e) {
      console.error('[portals] Failed to load portal overrides:', e && e.message);
    }
  }

  // Training-launch pivot: lock non-admin employees to the Training tile only.
  // Admins keep every tile they can access; the client (customer) audience is
  // untouched. Flip TRAINING_ONLY_LOCKDOWN to false to restore the full launcher.
  const TRAINING_ONLY_LOCKDOWN = true;
  const portals = PORTAL_DEFS
    .filter(p => p.audience === audience && (p.canAccess(u) || overrideKeys.has(p.id)))
    .filter(p => !TRAINING_ONLY_LOCKDOWN || u.role === 'admin' || audience !== 'employee' || p.id === 'training')
    .map(p => ({ id: p.id, name: p.name, icon: p.icon, url: p.url, description: p.description }));

  // Locked-down (non-admin employee) users can ask the admin for more access.
  // The launcher uses this to keep them on the launcher (no single-tile
  // auto-redirect) and to show the "Request additional permissions" button.
  const canRequestAccess = TRAINING_ONLY_LOCKDOWN && u.role !== 'admin' && audience === 'employee';

  res.json({
    portals,
    user: { role: u.role, name: u.full_name || u.username },
    can_request_access: canRequestAccess,
  });
});

// Wire up portal-mode route overrides + setting-approval flow. Now that
// authMiddleware is installed, portal_module routes can use requireAuth/Admin.
installPortalExtensions(app, pool, PORTAL_MODE, { requireAuth, requireAdmin, canCreateProjects });

// Time Clock module — exposes /api/timeclock/* routes for the Launch Time
// Clock portal AND wires audit logging for time_entries mutations across
// the whole app (admin, portals, CSV imports). Audit logger is built once
// here and reused by the time_entries POST/PUT/DELETE handlers below.
const timeclockModule = require('./timeclock_module');
timeclockModule.installTimeClockRoutes(app, pool, requireAuth);
const auditTimeEntry = timeclockModule.makeAuditLogger(pool);

// Automation hub — surfaces "needs attention" data (stale permits, budget
// burn, monthly billing drafts, daily digest) plus a console-logging
// scheduler. Endpoints are admin/manager-gated; nothing auto-commits
// invoices. Scheduler is started after schema bootstrap (see start()).
const automationModule = require('./automation');
automationModule.installAutomationRoutes(app, pool, { requireAdmin, requireManagerOrAdmin });

// ─── SSE live-update endpoint ──────────────────────────────────────────────
// Persistent GET /api/events/stream for admin + team portals.
// Must be registered AFTER auth middleware (req.user must be set) and
// BEFORE express.static (so the path isn't swallowed as a missing file).
// routes/splice.js has its own project-scoped SSE — these are separate.
const _sse = require('./routes/_sse');
// Item 15 fix: pass pool so SSE heartbeat can re-validate sessions against live DB.
_sse.attach(app, { requireAuth, pool });

// Public routes (no login needed): /login page itself, /api/auth/login,
// any /api/auth/me check, and static assets needed by the login page.
// Everything else requires a logged-in user.
//
// Transition support: if APP_PASSWORD env var is set, accept HTTP Basic Auth
// as a fallback. This keeps existing portals working during rollout — once
// every user has a real account, unset APP_PASSWORD to enforce JWT-only.
const APP_PASSWORD = process.env.APP_PASSWORD;
function pageRequiresAuth(reqPath) {
  // Allow login page, auth API, and a few static asset paths
  if (reqPath === '/login' || reqPath === '/login.html') return false;
  // Training-launch pivot: public self-signup page (the register API is already
  // exempt via the /api/auth/ prefix below).
  if (reqPath === '/signup' || reqPath === '/signup.html') return false;
  if (reqPath.startsWith('/api/auth/')) return false;
  // Item 6 fix: /uploads/ auth is now enforced by the authenticated static route below.
  // Do NOT add '/uploads/' back to this exemption list.
  // The login page itself loads /toast.js, /keyboard.js, /app-shell.css.
  // Without these in the allowlist the auth middleware 302s the asset
  // request to /login, the browser fetches HTML for a script tag, and
  // the JS parser throws SyntaxError: Unexpected token '<'. That bubbles
  // up as a `pageerror` event in browser smoke tests.
  // /favicon.ico is similarly noisy — let it through too.
  if (reqPath === '/toast.js' || reqPath === '/keyboard.js') return false;
  if (reqPath === '/app-shell.css') return false;
  // Login page also pulls /css/app-shell.css + /js/app-shell.js + the logo.
  // Without these in the allowlist the auth middleware 302s the asset to
  // /login, the browser parses HTML as CSS/JS, and the page renders unstyled.
  if (reqPath === '/css/app-shell.css') return false;
  if (reqPath === '/js/app-shell.js') return false;
  if (reqPath.startsWith('/img/')) return false;
  if (reqPath === '/favicon.ico') return false;
  // Splice Matrix Phase 2B #7 — no-login splicer field markup. The
  // splicer scans a QR code from a printed field document and lands
  // here without an account. The token in the path is the auth.
  if (reqPath.startsWith('/splice/field/')) return false;
  // Splice Matrix Phase 4.1 — no-login read-only project viewer.
  // Stakeholders click a share link; the token in the path is the auth.
  if (reqPath.startsWith('/splice/view/')) return false;
  if (reqPath.startsWith('/api/splice/view/')) return false;
  // Public certificate verification (specs/certificates.md): the printed cert's
  // /verify link, the branded lookup page, and the public verify API must reach
  // an anonymous browser. Admin issue/list/revoke stay gated (requireAdmin in-route);
  // only the /verify/ subpath of the API is exempt, never /api/certificates itself.
  if (reqPath === '/verify' || reqPath === '/verify.html') return false;
  if (reqPath.startsWith('/api/certificates/verify/')) return false;
  // Block everything else (HTML pages and API endpoints) until logged in
  return true;
}

app.use((req, res, next) => {
  // Already authenticated via JWT cookie/header? Pass.
  if (req.user) return next();

  // Public path? Pass.
  if (!pageRequiresAuth(req.path)) return next();

  // Transition: HTTP Basic Auth fallback if APP_PASSWORD is set.
  // Item 3 fix: timing-safe compare + synthetic req.user so downstream
  // role/ownership checks don't silently no-op.
  if (APP_PASSWORD) {
    const auth = req.headers.authorization;
    if (auth) {
      const [scheme, encoded] = auth.split(' ');
      if (scheme === 'Basic') {
        const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
        // Timing-safe comparison — prevents timing-oracle attacks on APP_PASSWORD
        const passOk = pass && APP_PASSWORD &&
          pass.length === APP_PASSWORD.length &&
          require('crypto').timingSafeEqual(Buffer.from(pass), Buffer.from(APP_PASSWORD));
        if (passOk) {
          // Populate synthetic req.user so downstream role checks don't silently no-op
          req.user = req.user || { role: 'admin', username: 'app-password', id: 'app-password' };
          return next();
        }
      }
    }
    // No basic auth header. For HTML pages, redirect to /login;
    // for API endpoints, return 401 challenge so the browser prompts.
    if (req.path.startsWith('/api/')) {
      const realm = PORTAL_MODE ? `Launch Fiber - ${PORTAL_NAMES[PORTAL_MODE] || PORTAL_MODE}` : 'Launch Fiber Services';
      res.set('WWW-Authenticate', `Basic realm="${realm}"`);
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  }

  // No basic-auth fallback. JWT-only mode.
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Login required' });
  }
  return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
});

// ─── Portal endpoint restrictions ────────────────────────────────────────────
// Must be BEFORE express.static so blocked endpoints return 403 before static files
if (PORTAL_MODE) {
  // Generic API blocks (entire endpoint families admin-only).
  const blocked = ['/api/revenue', '/api/invoices', '/api/billing', '/api/ai', '/api/hours', '/api/dashboard'];
  // Specific upload endpoints — Option B: all file uploads route through the
  // admin service, never hit portal containers (which have ephemeral storage).
  // The portal frontend POSTs cross-origin to ADMIN_API_BASE for these.
  const blockedExact = [
    /^\/api\/permits\/[^\/]+\/documents$/i,   // PUT/POST permit doc uploads
    /^\/api\/hours\/csv-validate$/i,          // CSV bulk-import (already covered by /api/hours block, kept explicit)
  ];
  app.use((req, res, next) => {
    if (blocked.some(b => req.path.startsWith(b))) {
      return res.status(403).json({ error: 'Not available in this portal' });
    }
    if (req.method === 'POST' && blockedExact.some(rx => rx.test(req.path))) {
      return res.status(403).json({ error: 'File uploads route through admin service. Set ADMIN_API_BASE in portal config.' });
    }
    next();
  });

}

// Login page — public, no auth required (handled by the public-path check above).
// Looks in public/ first (production layout), then root (dev layout).
app.get(['/login', '/login.html'], (req, res) => {
  const inPublic = path.join(__dirname, 'public', 'login.html');
  const inRoot = path.join(__dirname, 'login.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : inRoot);
});

// Public certificate verification page (specs/certificates.md). The number
// printed on the certificate resolves to /verify (?cert=… auto-looks-up);
// serve the branded lookup page there. Public per pageRequiresAuth above.
app.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

// Auth-gated static serve for the OSP Design Training SPA.
// Must be registered BEFORE the public/ static fallback so that /training/*
// requests are intercepted and require a valid session. The built Vite app
// lives in public/training/ (base: '/training/' in vite.config.js ensures
// all asset paths are prefixed correctly).
app.use('/training', requireAuth(), express.static(path.join(__dirname, 'public', 'training')));
// SPA client-side routing fallback: any unmatched /training/* path serves index.html
app.get('/training/*', requireAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'training', 'index.html'));
});

// Wave 37: service worker for offline DWG sync.
// Serve sw-dwg-sync.js with Service-Worker-Allowed so the worker, even though
// it lives at /sw-dwg-sync.js, can scope its control to /offline-sync/.
// Must be BEFORE express.static so we get to set the header.
app.get('/sw-dwg-sync.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/offline-sync/');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'public', 'sw-dwg-sync.js'));
});

// Wave 40: client portal v1 — read-only project status
// Not gated with requireAuth() here; authentication is at the API layer
// via the lfs_client_session cookie validated by requireClientAuth middleware.
app.use('/client', express.static(path.join(__dirname, 'public', 'client')));

// Wave 55: photos PWA — mobile-first photo upload with offline queue
app.use('/photos', requireAuth(), express.static(path.join(__dirname, 'public', 'photos')));
// SPA client-side routing fallback for PWA
app.get('/photos/*', requireAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'photos', 'index.html'));
});

// Wave 59: workspace manager — manager-facing file explorer
app.use('/workspace', requireAuth(), express.static(path.join(__dirname, 'public', 'workspace')));
// SPA client-side routing fallback
app.get('/workspace/*', requireAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'workspace', 'index.html'));
});

// Wave 238: persistent installer storage. Resolve INSTALLERS_DIR (env or
// in-tree fallback), ensure it exists, and serve it as an auth-gated static
// mount at /downloads/installers. This sits BEFORE express.static(public) so
// that requests for /downloads/installers/* never fall through to the
// (possibly empty) in-tree directory when INSTALLERS_DIR points at a
// Railway volume mount.
const _downloadsModule = require('./routes/downloads');
const INSTALLERS_DIR = _downloadsModule.resolveInstallersDir();
_downloadsModule.ensureInstallersDir(INSTALLERS_DIR);
app.use('/downloads/installers', requireAuth(), express.static(INSTALLERS_DIR));

app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads with auth enforcement (item 6 fix).
// /uploads/* is no longer served via express.static — instead we use an
// auth-gated route that verifies login, enforces path traversal guard,
// and forces Content-Disposition: attachment for non-image/non-PDF content.
// The splicer field-photo flow uses its own token-gated endpoints and
// does NOT go through this route.
app.use('/uploads', requireAuth(), (req, res) => {
  // Traversal guard: resolve the requested path within UPLOAD_DIR and
  // verify it still starts with UPLOAD_DIR + separator.
  const requestedFile = decodeURIComponent(req.path.replace(/^\//, ''));
  const resolved = path.resolve(UPLOAD_DIR, requestedFile);
  const uploadRoot = path.resolve(UPLOAD_DIR) + path.sep;
  if (!resolved.startsWith(uploadRoot) && resolved !== path.resolve(UPLOAD_DIR)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    return res.status(404).json({ error: 'File not found' });
  }
  const ext = path.extname(resolved).toLowerCase();
  // Inline display only for PDFs and images; force download for everything else
  // to prevent stored-XSS via uploaded HTML/SVG/JS files.
  // SVG excluded from inline set: SVG served inline executes embedded <script>
  // tags, making it a stored-XSS vector. Force attachment disposition instead.
  const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
  if (ext === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  } else if (imageExts.has(ext)) {
    // sendFile sets Content-Type from extension; just don't force attachment
  } else {
    res.setHeader('Content-Disposition', 'attachment');
  }
  res.sendFile(resolved);
});

// ─── Anthropic client ─────────────────────────────────────────────────────────
// The actual `anthropic` instance lives inside routes/ai.js (Track 1.3
// extraction). We keep the boot-time API-key check here so missing env
// surfaces immediately at startup rather than on the first /api/ai/chat
// request — much easier to diagnose in Railway logs.
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('WARNING: ANTHROPIC_API_KEY is not set. AI assistant will not work.');
  console.error('Add it in Railway dashboard → Variables → ANTHROPIC_API_KEY');
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// HTML-escape any value before interpolating into a server-rendered HTML
// string. Used by 403/error pages so a username like
// `<script>...</script>` can't be reflected back to the browser.
function escapeHtml(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Shared backend helpers (updateProjectHours, saveUndoBucket, popUndoBucket,
// collectProjectTree, calcProjectFinancials) live in routes/_helpers.js as
// part of CLEANUP_PLAN.md Track 1.3. Destructured so existing call sites
// in server.js + extracted route modules can use the bare names.
const {
  updateProjectHours,
  saveUndoBucket,
  popUndoBucket,
  collectProjectTree,
  calcProjectFinancials,
} = require('./routes/_helpers');

// invoice_generator pulls double duty — direct route handler in
// routes/invoices.js plus a few callers still in server.js (billing/batches
// uses inferInvoiceMakeup). Hoisting the require here so all consumers
// share one module instance.
const invoiceGenerator = require('./invoice_generator');

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

// Clients CRUD lives in routes/clients.js (extracted as part of
// CLEANUP_PLAN.md Track 1.3).
require('./routes/clients')(app, pool, { requireAdmin, requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/clients was unauthenticated; O34: GETs gated to requireStaff (no trainee/customer leak)

// OSP completion certificates (specs/certificates.md). Public verify + admin
// issue/list/revoke. The public /verify page + /api/certificates/verify/* are
// auth-exempted in pageRequiresAuth; issue/list/revoke enforce requireAdmin in-route.
require('./routes/certificates')(app, pool, { requireAdmin });

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTS + ENGINEERING CONTRACTS — extracted as part of Track 1.3.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/contracts')(app, pool, { requireAdmin, requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/contracts was unauthenticated; O34: GET gated to requireStaff
require('./routes/engineering_contracts')(app, pool, { requireAdmin, requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/engineering-contracts was unauthenticated; O34: GETs gated to requireStaff


// ─────────────────────────────────────────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// JOBS — extracted to routes/jobs.js (Track 1.3).
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/jobs')(app, pool, { requireAdmin, requireManagerOrAdmin, requireAuth });

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPES — program categories (BAU / GF(R) / RUS / Other / custom)
// ─────────────────────────────────────────────────────────────────────────────

// Project types extracted to routes/project_types.js (Track 1.3).
require('./routes/project_types')(app, pool, { requireStaff }); // O34: was {} (no-op stub = unauthenticated) — gate the project-types GET to staff

// Pricing list extracted to routes/pricing.js (Track 1.3).
require('./routes/pricing')(app, pool, { requireManagerOrAdmin, requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/pricing* was unauthenticated (competitive-intel leak); O34: gated to requireStaff (rates must not reach trainee/customer)

// ─────────────────────────────────────────────────────────────────────────────
// PERMITTING CALCULATION (universal, not just RUS)
// Hours = miles × random(25..30 in 0.25 increments). If miles < 1, force 25 hr min.
// Stored on the project at creation so re-displays are stable.
// ─────────────────────────────────────────────────────────────────────────────

function calcPermittingHours(miles) {
  const m = parseFloat(miles) || 0;
  // Random between 25 and 30 inclusive, snapped to 0.25 increments.
  // 25.00, 25.25, 25.50, ..., 30.00 → 21 possible values.
  const steps = Math.floor(Math.random() * 21);
  const hoursPerMile = 25 + steps * 0.25;
  let totalHours = m * hoursPerMile;
  // Minimum 25 hours when project is under one mile.
  if (m < 1) totalHours = Math.max(25, totalHours);
  // Snap final total to 0.25 increments
  totalHours = Math.round(totalHours * 4) / 4;
  return { hours_per_mile: hoursPerMile, total_hours: totalHours };
}

// Staff extracted to routes/staff.js (Track 1.3).
// Pass requireAdmin so the new DELETE/PUT/all endpoints (added 2026-05-05)
// are admin-only. GET + POST stay open to any authed user as before.
require('./routes/staff')(app, pool, { requireAdmin, requireAuth }); // H-1: requireAuth added — GET /api/staff was unauthenticated

// People — unified roster (merged users + staff) for the operations cluster, so
// self-signups are never invisible. Read-only; mutations reuse /api/users + /api/staff.
require('./routes/people')(app, pool, { requireAdmin, requireAuth });

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — core CRUD + recalc + tree/with-hours delete extracted to
// routes/projects.js (CLEANUP_PLAN.md Track 1.3.3). Other project
// endpoints (documents, detail, ongoing, unbill, mark-billed, bill-and-clone)
// stay below for now and will move in a follow-up.
// ─────────────────────────────────────────────────────────────────────────────
// Item 2 + 22 fix: requireAuth added so projects.js can gate POST/PUT.
require('./routes/projects')(app, pool, { requireAdmin, requireAuth, requireManagerOrAdmin, requireStaff }); // O34: read GETs gated to requireStaff

// Phase 2 keystone: Service-Area-with-jobs model (migration 0064). Coexists with
// the legacy projects tree above during the rebuild.
require('./routes/service_areas')(app, pool, { requireAdmin, requireAuth, requireManagerOrAdmin });

// Phase 5: contractor/field timeclock — GET /api/my/jobs (caller's own assigned
// jobs only). Hour-logging reuses POST /api/service-area-jobs/:id/time-entries.
require('./routes/my_work')(app, pool, { requireAuth });

// Phase 5 follow-up: per-person Hours view + CSV export (manager/admin, no $).
require('./routes/hours_summary')(app, pool, { requireManagerOrAdmin });

// Phase 4 money view: estimate-vs-actual margin, AR aging, accounting CSV (manager/admin).
require('./routes/money_view')(app, pool, { requireManagerOrAdmin });

// Keystone billing (progressive ledger): per-concentrator worklist/run/report +
// closed-period tag. Bills earned−already-billed per job (hours/footage/fixed).
// Migration 0066. Coexists with legacy routes/billing.js during cutover.
require('./routes/billing_keystone')(app, pool, { requireManagerOrAdmin });

// Projections (Money tab): expected−billed per job + RUS engineering-budget burn,
// plus the Service Areas → Map data endpoint. Migration 0067/0068.
require('./routes/projections')(app, pool, { requireManagerOrAdmin });

// Map integration POC (migration 0069): DB-backed map storage (window.storage),
// construction contracts + uploaded cost catalog, and the estimate that prices
// map units (13 handholes → catalog → $). See docs/map_requirements.md.
require('./routes/map_integration')(app, pool, { requireManagerOrAdmin, upload });

// Projects tab: nested Client→EC→CC→SA→Route→project
// rollup for the renamed map-first Projects tab. Migration 0074.
require('./routes/projects_tree')(app, pool, { requireManagerOrAdmin });

// Admin data-export bundle: GET /api/export/all.zip (service areas, jobs, invoices CSVs).
require('./routes/export_bundle')(app, pool, { requireAdmin });

// Keystone cluster reads: GET /api/cluster/clients (client list + financials), GET /api/search (cross-entity).
require('./routes/cluster_views')(app, pool, { requireManagerOrAdmin });
require('./routes/search')(app, pool, { requireManagerOrAdmin });

// Admin observability: GET /api/audit/log (activity viewer) + GET /api/system/info (build/db info, no secrets).
require('./routes/audit_view')(app, pool, { requireManagerOrAdmin });
require('./routes/system_info')(app, pool, { requireManagerOrAdmin });

// ─────────────────────────────────────────────────────────────────────────────
// UNDO REPLAY — extracted to routes/undo.js (Track 1.3.6).
// saveUndoBucket / popUndoBucket helpers live in routes/_helpers.js.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/undo')(app, pool, { requireAuth });

// ─────────────────────────────────────────────────────────────────────────────
// TIME ENTRIES — extracted to routes/time_entries.js (Track 1.3.4).
// auditTimeEntry + PORTAL_MODE are passed through so the route module
// can write the audit log without reaching into server.js's globals.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/time_entries')(app, pool, {
  requireAuth,
  auditTimeEntry,
  portalMode: PORTAL_MODE,
});

// ─────────────────────────────────────────────────────────────────────────────
// DIRECT CSV IMPORT FOR HOURS — extracted to routes/hours_csv.js (Track 1.3).
// Pure parsing helpers (normalizeWO, parseDateCell, etc.) are exported via
// hours_csv._helpers so the AI tools' csv_smart_import path can reuse them.
// Smoke tests in tests/csv_import.test.js cover the validate + commit paths.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/hours_csv')(app, pool, {
  requireAdmin, upload, auditTimeEntry,
});
// Pin the parsing helpers on app.locals so future route modules that
// need them can grab them without a hard require on hours_csv.
app.locals.csvHelpers = require('./routes/hours_csv')._helpers;

// Keystone hours importer (admin→cluster port): same parse pipeline, but matches
// each row to a service_area_job so hours land in time_entries.service_area_job_id
// (not the retiring projects tree). Coexists with hours_csv during cutover.
require('./routes/hours_import')(app, pool, { requireAdmin, upload });

// ─────────────────────────────────────────────────────────────────────────────
// AI CHAT — extracted to routes/ai.js (Track 1.3 final). Tool-using
// Claude assistant + multipart file upload + per-tool approval gate.
// Smoke tests in tests/ai_upload.test.js cover the upload + uploadStore
// surface; the chat tool loop needs an Anthropic client mock and is
// queued for a follow-up.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/ai')(app, pool, { requireAdmin, upload });


// ─────────────────────────────────────────────────────────────────────────────
// Project detail drill-down extracted to routes/project_detail.js (Track 1.3).
require('./routes/project_detail')(app, pool, { requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/projects/:id/detail was unauthenticated; O34: gated to requireStaff


// Permits pipeline + per-project documents + /api/_debug/uploads diagnostic
// extracted to dedicated route modules (Track 1.3).
require('./routes/permits')(app, pool, { upload, requireAuth });
require('./routes/project_documents')(app, pool, { upload, uploadDir: UPLOAD_DIR, requireAuth, requireAdmin });

// DWG two-way sync (Wave 52) — per-user staging, manual promotion to canonical
require('./routes/dwg_two_way_sync')(app, pool, { requireAuth, requireAdmin, requireManagerOrAdmin, upload });

// Admin migration / cleanup endpoints (migrate-nesting, orphan-files,
// adopt-orphan, adopt-orphans-bulk, hours-backfill-preview, hours-backfill)
// extracted to routes/admin.js (Track 1.3).
require('./routes/admin')(app, pool, { requireAdmin, uploadDir: UPLOAD_DIR });


// Budgets + budget_codes + by-area summary extracted to routes/budgets.js (Track 1.3).
require('./routes/budgets')(app, pool, { requireManagerOrAdmin, requireAuth }); // H-1: requireAuth added — GET /api/budgets* was unauthenticated

// Potential permits (design-submitted candidates) extracted to
// routes/potential_permits.js (Track 1.3).
require('./routes/potential_permits')(app, pool, { requireAuth, requireStaff }); // C-2: was {} — no-op stub fired instead of real requireAuth; O34: gated to requireStaff

// Concentrators / service areas extracted to routes/concentrators.js (Track 1.3).
require('./routes/concentrators')(app, pool, { requireAdmin, requireAuth, requireStaff }); // H-1: requireAuth added — GET /api/concentrators was unauthenticated; O34: gated to requireStaff

// Dashboard, design pipeline, and inspection (PSC RUS) views extracted to
// dedicated route modules (Track 1.3).
require('./routes/dashboard')(app, pool, { requireAuth });
require('./routes/design_pipeline')(app, pool, { requireAuth });
require('./routes/inspection')(app, pool, { requireAuth }); // C-3: was {} — no-op stub fired instead of real requireAuth

// Recent activity widget — surfaces photos + workspace file uploads on admin dashboard
require('./routes/recent_activity')(app, pool, { requireAuth, requireAdmin });

// Revenue endpoints extracted to routes/revenue.js (Track 1.3).
require('./routes/revenue')(app, pool, { requireManagerOrAdmin });

// Audit log viewer (read-only admin UI for compliance trail — Wave 41).
require('./routes/audit_log')(app, pool, { requireAdmin });

// Project photos — mobile PWA uploads (Wave 55).
require('./routes/project_photos')(app, pool, { requireAuth, requireAdmin });

// Desktop installer downloads page (Wave 120) + admin upload/delete (Wave 238).
require('./routes/downloads')(app, pool, { requireAuth, requireAdmin });

// File-activity admin view — read-only slice of audit_log (Wave 122).
require('./routes/file_activity')(app, pool, { requireAdmin });


// ─────────────────────────────────────────────────────────────────────────────
// INVOICE MANAGEMENT — extracted to routes/invoices.js (Track 1.3.5).
// ─────────────────────────────────────────────────────────────────────────────
// Item 10 fix: requireAdmin added so invoices.js can gate the wipe_hours path.
require('./routes/invoices')(app, pool, { requireManagerOrAdmin, requireAdmin });

// Reference-PDF-driven invoice templates: owner uploads a sample PDF for
// each (job, client) pair, Claude vision analyses it once, and the system
// renders future invoices to PDF via puppeteer using the resulting HTML
// template. Coexists with the hardcoded PSC RUS pdfkit path above; the
// template wins when one's available, the legacy path is the fallback.
require('./routes/invoice_templates')(app, pool, {
  requireManagerOrAdmin,
  uploadDir: UPLOAD_DIR,
});

// Customer portal — read-only API for external (customer-role) users.
// Each user is linked to one or more clients via customer_clients;
// every endpoint in this module scopes through that link table so a
// customer can only see their own data. Admin endpoints to manage the
// links live in the same module.
require('./routes/customer_portal')(app, pool, { requireAuth, requireAdmin });

// Project lifecycle billing endpoints (unbill, mark-billed, bill-and-clone)
// extracted to routes/project_billing.js (Track 1.3).
require('./routes/project_billing')(app, pool, { requireManagerOrAdmin });

// /api/projects/:id/with-hours and /api/projects/:id/with-tree moved to
// routes/projects.js (CLEANUP_PLAN.md Track 1.3.3).

// Reports endpoints extracted to routes/reports.js (Track 1.3).
require('./routes/reports')(app, pool, { requireAuth }); // H-1: requireAuth added — GET /api/reports/* was unauthenticated (manager-role reports leaked)

// Billing endpoints (bill-multiple, batches, report) extracted to
// routes/billing.js (Track 1.3).
require('./routes/billing')(app, pool, { requireManagerOrAdmin, invoiceGenerator });


// Splice Matrix tool (OSP fiber splice planning + PDF export).
// Standalone: no FK to projects/contracts/billing. Schema in
// migrations/0001_splice_schema.sql. Endpoints under /api/splice/*.
// PORTAL_MODE='splice' serves public/splice.html as its SPA.
require('./routes/splice')(app, pool, { requireAuth });

// ─────────────────────────────────────────────────────────────────────────────
// OSP TRAINING PROGRESS API — OSP-RW.2
// Endpoints under /api/training/*. Schema: migration 0035_training_tables.sql.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/training')(app, pool, { requireAuth });

// Access requests — locked-down users ask the admin for more portals from their
// launcher; admin reviews in the Settings modal. (Training-launch pivot.)
require('./routes/access_requests')(app, pool, { requireAuth, requireAdmin, rateLimitOk });

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL ACCESS — Wave 12
// Per-user portal access overrides. Schema: migration 0042_user_portal_access.sql.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/portal_access')(app, pool, { requireAdmin }, PORTAL_DEFS);

// Wave 228 (2026-05-30): restored Wave 13 client portal API for admin-impersonation flow.
// Frontend at public/js/client_portal.js still calls /api/client-portal/projects +
// /api/client-portal/clients-with-active-projects (was deleted in Wave 169 — those calls
// went to 404, breaking the /client-portal admin-view-as flow for Monday demo).
// The newer token-based /client/ portal is separate (routes/client_portal_v2.js below).
require('./routes/client_portal')(app, pool, { requireAuth });

// Wave E2 (2026-05-27): client portal v1 — token-based auth + admin org/user/token management.
// New portal at /client/login/:token and /api/admin/client-orgs/*.
// W107-HIGH-1: Wire installClientDocumentUpload so POST /api/client/documents
// reaches the multer-backed handler (not the dead next() placeholder).
const _cpv2 = require('./routes/client_portal_v2');
_cpv2(app, pool, { requireAuth });
if (_cpv2.installClientDocumentUpload) {
  _cpv2.installClientDocumentUpload(upload);
}

// ─────────────────────────────────────────────────────────────────────────────
// FOLDER WORKSPACE — Wave 57
// Hierarchical folder tree with file versioning, ACL-based sharing
// Schema: migration 0053_folder_workspace.sql
// ─────────────────────────────────────────────────────────────────────────────
const createFolderWorkspaceRoutes = require('./routes/folder_workspace');
app.use('/api/workspace', createFolderWorkspaceRoutes(pool));

// ─────────────────────────────────────────────────────────────────────────────
// DWG OFFLINE-SYNC — Wave 35 / C1
// Backend endpoints for field-tech laptop sync of raw DWG/DXF files.
// Schema: migration 0044_dwg_offline_sync.sql
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/dwg_sync')(app, pool, { requireAuth, uploadDir: UPLOAD_DIR });

// Wave 14 diagnostic — inspect rollup tree state when Railway logs are
// rate-limit dropping the [WAVE 14 DIAG] output.
// Wave 14 — manual cleanup trigger. Returns step-by-step rowCounts so we
// can see exactly what fired (no rate-limit issues like the boot log).
app.post('/api/admin/diag/wave14-cleanup', requireAdmin, async (req, res) => {
  const log = [];
  try {
    // Step A: merge children from legacy EC folders into their new W14-3
    // counterparts (name match: new_name = legacy_name + " (PROGRAM)")
    const a = await pool.query(`
      UPDATE projects child
      SET parent_id = ec_new.id
      FROM projects ec_legacy, projects ec_new
      WHERE child.parent_id = ec_legacy.id
        AND ec_legacy.is_rollup = TRUE
        AND ec_legacy.rollup_level IS NULL
        AND ec_new.client_id = ec_legacy.client_id
        AND ec_new.is_rollup = TRUE
        AND ec_new.rollup_level = 'engineering_contract'
        AND ec_new.id <> ec_legacy.id
        AND ec_new.name LIKE ec_legacy.name || ' (%)'
    `);
    log.push({ step: 'A: merge children → new EC folders', rowCount: a.rowCount });

    // Step B: delete now-empty legacy EC folders
    const b = await pool.query(`
      DELETE FROM projects ec_legacy
      WHERE ec_legacy.is_rollup = TRUE
        AND ec_legacy.rollup_level IS NULL
        AND EXISTS (
          SELECT 1 FROM projects ec_new
          WHERE ec_new.client_id = ec_legacy.client_id
            AND ec_new.is_rollup = TRUE
            AND ec_new.rollup_level = 'engineering_contract'
            AND ec_new.id <> ec_legacy.id
            AND ec_new.name LIKE ec_legacy.name || ' (%)'
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = ec_legacy.id)
    `);
    log.push({ step: 'B: delete empty legacy EC folders', rowCount: b.rowCount });

    // Step C: promote children of legacy intermediates (parent=Client folder,
    // rollup_level=NULL, no non-rollup children) up to the Client folder
    const c = await pool.query(`
      UPDATE projects child
      SET parent_id = legacy.parent_id
      FROM projects legacy
      WHERE child.parent_id = legacy.id
        AND legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (
          SELECT 1 FROM projects leaf
          WHERE leaf.parent_id = legacy.id
            AND leaf.is_rollup IS NOT TRUE
        )
    `);
    log.push({ step: 'C: promote children up from intermediate rollups', rowCount: c.rowCount });

    // Step D: delete now-empty intermediates (PSC RUS 217 type)
    const d = await pool.query(`
      DELETE FROM projects legacy
      WHERE legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND legacy.parent_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = legacy.id)
    `);
    log.push({ step: 'D: delete empty intermediates', rowCount: d.rowCount });

    res.json({ ok: true, steps: log });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message, steps: log });
  }
});

app.get('/api/admin/diag/rollup-state', requireAdmin, async (req, res) => {
  try {
    const [clients, ecFolders, legacyRollups, orphans] = await Promise.all([
      pool.query(`SELECT id, name FROM projects WHERE is_rollup=TRUE AND rollup_level='client' ORDER BY name`),
      pool.query(`SELECT p.id, p.name, p.parent_id, p.engineering_contract_id, ec.name AS ec_name, (SELECT COUNT(*) FROM projects c WHERE c.parent_id = p.id)::int AS child_count FROM projects p LEFT JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id WHERE p.is_rollup=TRUE AND p.rollup_level='engineering_contract' ORDER BY p.name`),
      pool.query(`SELECT p.id, p.name, p.client_id, cl.name AS client_name, p.parent_id, pp.name AS parent_name, (SELECT COUNT(*) FROM projects c WHERE c.parent_id = p.id)::int AS child_count FROM projects p LEFT JOIN clients cl ON cl.id = p.client_id LEFT JOIN projects pp ON pp.id = p.parent_id WHERE p.is_rollup=TRUE AND p.rollup_level IS NULL ORDER BY p.name`),
      pool.query(`SELECT id, name FROM projects WHERE parent_id IS NULL AND is_rollup IS NOT TRUE ORDER BY name LIMIT 20`),
    ]);
    res.json({
      client_folders: clients.rows,
      ec_folders: ecFolders.rows,
      legacy_rollups_null_level: legacyRollups.rows,
      flat_leaves_sample: orphans.rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Wave 13C: admin impersonation ("View as Staff / Customer").
// Registered AFTER auth middleware so req.user is always populated before the
// requireAdmin guard fires.
require('./routes/impersonation')(app, pool, { requireAdmin, requireAuth, signImpersonationToken, cookieOpts, rateLimitOk });

// ─── Mapbox token endpoint (Splice 5.D.1) ────────────────────────────────────
// Returns the MAPBOX_TOKEN env var to authenticated clients so it can be used
// in the browser-side MapLibre transformRequest without hardcoding in HTML.
// The token is visible in the client network tab anyway; protection comes from
// setting allowed-URLs in the Mapbox dashboard (restrict to your deployment domain).
app.get('/api/config/mapbox', requireAuth(), (req, res) => {
  const token = process.env.MAPBOX_TOKEN || null;
  res.json({ token, available: !!token });
});



// ─────────────────────────────────────────────────────────────────────────────
// API ERROR HANDLER — catches anything thrown out of an /api/* route AND
// out of multer's pre-handler middleware (file-too-large, file-rejected),
// and converts it to a clean JSON response. Without this, multer / Express
// default rendering returns an HTML "<!DOCTYPE..." stack-trace page, and
// every frontend `await r.json()` then errors with `Unexpected token '<'`.
// Mounted AFTER all /api routes, BEFORE the SPA catch-all.
app.use('/api', (err, req, res, next) => {
  if (res.headersSent) return next(err);
  // Multer file-size errors carry a standardized code; surface a
  // user-readable message that names the actual cap so the operator
  // knows what to do.
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    // Multer's MulterError carries `code` and `field` but the size limit
    // isn't always on the error object — its absence used to fall through
    // to the literal word "limited", producing the nonsensical
    // "Maximum size for this upload is pdf limited." Look up the cap by
    // route field instead so the message names a real number.
    const sizeMb = err.limit
      ? Math.round(err.limit / 1024 / 1024) + ' MB'
      : err.field === 'pdf' ? '50 MB'   // invoice_templates.js cap
      : err.field === 'file' ? '3 GB'    // server.js global multer cap
      : null;
    return res.status(413).json({
      error: sizeMb
        ? `File too large. Maximum size for this upload is ${sizeMb}.`
        : 'File too large. Try a smaller file.',
    });
  }
  if (err && err.code && String(err.code).startsWith('LIMIT_')) {
    return res.status(400).json({ error: err.message || `Upload rejected (${err.code})` });
  }
  // Filter rejections (e.g. "Only .pdf uploads accepted") — multer wraps
  // them as plain Errors. Treat any thrown error here as 400 unless it
  // self-reports a status.
  const status = (err && (err.status || err.statusCode)) || 500;
  console.error('[api-error]', req.method, req.originalUrl, err && (err.stack || err.message || err));
  res.status(status).json({ error: (err && err.message) ? err.message : 'Internal server error' });
});

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL ROUTES — named path aliases for the portal HTMLs
// These remain available as direct deep-links even without PORTAL_MODE.
app.get('/permitting', (req, res) => res.sendFile(path.join(__dirname, 'public', 'permitting.html')));
app.get('/design', (req, res) => res.sendFile(path.join(__dirname, 'public', 'design.html')));
// Wave 13: client portal — real three-column project status view.
app.get('/client-portal', requireAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-portal.html'));
});
// Wave 37: offline DWG sync front-end. SPA shell registers /sw-dwg-sync.js.
app.get('/offline-sync', requireAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'offline-sync.html'));
});

// Old bookmark /index.html → redirect to /admin.html
app.get('/index.html', (req, res) => res.redirect('/admin.html'));

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL_MODE BACKWARD-COMPAT — if PORTAL_MODE is set, honor the old single-
// portal-service behavior (serve that portal's HTML at '/'). This is the
// rollback path: if the launcher rollout has a critical bug, re-set
// PORTAL_MODE on Railway and each service immediately resumes as before.
// When PORTAL_MODE is NOT set, all portals are reachable via their paths and
// the launcher serves as the unified entry point.
if (PORTAL_MODE) {
  const portalFile = PORTAL_MODE === 'permitting' ? 'permitting.html'
                   : PORTAL_MODE === 'timeclock' ? 'timeclock.html'
                   : PORTAL_MODE === 'customer' ? 'customer.html'
                   : PORTAL_MODE === 'splice' ? 'splice.html'
                   : 'design.html';
  const ADMIN_API_BASE = process.env.ADMIN_API_BASE || '';

  app.get('/uploads/*', (req, res) => {
    if (!ADMIN_API_BASE) {
      return res.status(503).json({
        error: 'ADMIN_API_BASE env var not set on this portal — cannot resolve /uploads. Set it to your admin service URL.'
      });
    }
    return res.redirect(302, ADMIN_API_BASE.replace(/\/+$/, '') + req.originalUrl);
  });

  app.get('/', (req, res) => {
    try {
      const filePath = path.join(__dirname, 'public', portalFile);
      let html = fs.readFileSync(filePath, 'utf8');
      const inject = `<script>window.ADMIN_API_BASE = ${JSON.stringify(ADMIN_API_BASE)};</script>`;
      if (html.includes('</head>')) {
        html = html.replace('</head>', inject + '</head>');
      } else {
        html = inject + html;
      }
      res.set('Content-Type', 'text/html; charset=utf-8').send(html);
    } catch (e) {
      res.status(500).send('Portal HTML load failed: ' + e.message);
    }
  });

  if (!ADMIN_API_BASE) {
    console.warn('⚠ ADMIN_API_BASE env var not set — portal upload routing and PDF viewing will fall back to relative URLs (which will 404 on this portal). Set ADMIN_API_BASE to your admin service URL.');
  } else {
    console.log('✓ Portal will route file uploads + /uploads/* PDFs to:', ADMIN_API_BASE);
  }
}

// Hard 404 (JSON) for any /api/* path that didn't match a real route. Without
// this guard, the SPA catch-all below returns the HTML body for unknown API
// paths — and any frontend doing `r.json()` on the response throws
// "Unexpected token '<'", which surfaces as a pageerror in browser tests.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT + SPA FALLBACK
// When PORTAL_MODE is not set: / serves the launcher; /admin.html serves the
// admin SPA; all other portal HTMLs are served directly by express.static
// (they're in public/ so they're already reachable at their filename paths).
// ─────────────────────────────────────────────────────────────────────────────

// / → launcher (unless PORTAL_MODE already handled it above)
// Customer-role users landing at / are redirected to /client/ (the client
// launcher). This handles the post-login redirect for customer users whose
// login.html sends them to / by default.
if (!PORTAL_MODE) {
  app.get('/', (req, res) => {
    if (req.user && req.user.role === 'customer') {
      return res.redirect('/client/');
    }
    res.sendFile(path.join(__dirname, 'public', 'launcher.html'));
  });
}

// /client/ and /client/index.html → client launcher
app.get(['/client/', '/client/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client', 'index.html'));
});

app.get('*', (req, res) => {
  // PORTAL_MODE fallback: SPA for everything not already served.
  if (PORTAL_MODE) {
    const portalFile = PORTAL_MODE === 'permitting' ? 'permitting.html'
                     : PORTAL_MODE === 'timeclock' ? 'timeclock.html'
                     : PORTAL_MODE === 'customer' ? 'customer.html'
                     : PORTAL_MODE === 'splice' ? 'splice.html'
                     : 'design.html';
    return res.sendFile(path.join(__dirname, 'public', portalFile));
  }
  // Unified mode: every portal HTML is a static file served by express.static
  // at its own path. Unknown paths get a 404 (don't fall back to launcher for
  // unknown URLs — that would mask real 404s as successful loads).
  res.status(404).send('Not found');
});

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// V3 SCHEMA BOOTSTRAP — runs every startup, idempotent
//
// schema.sql is supposed to apply these via initSchema(), but in practice
// pool.query() runs the entire file as a single multi-statement batch and any
// earlier failure aborts the rest. This bootstrap re-applies the v3 additions
// statement-by-statement so a failure on one doesn't cascade. Every
// statement gets its own try/catch and a console log line.
// ─────────────────────────────────────────────────────────────────────────────
async function bootstrapV3Schema() {
  console.log('───── v3 schema bootstrap ─────');

  const ddl = [
    `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS billing_code VARCHAR(40)`,
    `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_psc_client BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_generic_client BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_rollup BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_level VARCHAR(20)`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_key TEXT`,
    `CREATE INDEX IF NOT EXISTS idx_projects_rollup ON projects (rollup_level, parent_id, rollup_key) WHERE is_rollup = TRUE`,
    // Track admin's manual edits to canonical jobs. When this column is set,
    // the bootstrap respects the admin's choices (team, billing type, rate,
    // applicability flags) and ONLY upserts identifying metadata that's safe
    // to refresh (the name itself for legacy job_id refs, billing_code if
    // null). Without this column, every redeploy reverted manual settings
    // changes back to the hardcoded canonical values.
    `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS manually_overridden_at TIMESTAMPTZ`,
    // Inspector projects roll over month-to-month and don't auto-close. The
    // is_ongoing flag tells reports to keep including them after they'd
    // normally be considered done. Manual close still possible via the
    // existing status='completed' workflow.
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_ongoing BOOLEAN DEFAULT FALSE`,
    // Per-client opt-in: do we show the Contract field? the WO# field?
    // Originally these defaulted from clients.is_rus (PSC → on, others → off).
    // The original is_rus-based UPDATE backfill ran on every existing
    // environment when these columns were first added; subsequent boots
    // were no-ops. After Path B (migration 0003 drops clients.is_rus), the
    // backfill is removed entirely. Brand-new clients now default both to
    // FALSE (NULL → false in the UI); admin toggles them in Settings as
    // needed. The columns themselves remain so admin's existing toggles
    // are preserved.
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_contract BOOLEAN`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_work_order BOOLEAN`,
    // Rebuild the duplicate-project unique index to EXCLUDE rollups. The old
    // index treated rollups and real projects identically, which caused
    // false-positive 23505 errors when a rollup auto-creation hit a real
    // project's name (e.g. a client named "COX" colliding with a Client rollup
    // also named "COX"). With this filter, rollups are free to share names
    // with real projects without triggering the constraint.
    `DROP INDEX IF EXISTS uniq_project_name_per_parent`,
    `CREATE UNIQUE INDEX IF NOT EXISTS uniq_project_name_per_parent
       ON projects (COALESCE(parent_id::text, 'ROOT'), LOWER(name))
       WHERE COALESCE(is_rollup, FALSE) = FALSE`,
    // Switch destructive cascades to RESTRICT so a mis-clicked delete on a
    // rollup doesn't silently nuke every child project + their billing
    // history. Deletes that intend to take hours go through the explicit
    // /api/projects/:id/with-hours endpoint. Postgres has no
    // ALTER FK ... ON DELETE in one shot — drop and re-add.
    `ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_parent_id_fkey`,
    `ALTER TABLE projects ADD CONSTRAINT projects_parent_id_fkey
       FOREIGN KEY (parent_id) REFERENCES projects(id) ON DELETE RESTRICT`,
    `ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_project_id_fkey`,
    `ALTER TABLE time_entries ADD CONSTRAINT time_entries_project_id_fkey
       FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT`,
    // Foreign-key indexes — without these, the FK lookups during
    // delete/update do full table scans and the dashboard slows badly as
    // time_entries grows. Idempotent.
    `CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries (project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_time_entries_staff_id ON time_entries (staff_id)`,
    `CREATE INDEX IF NOT EXISTS idx_time_entries_entry_date ON time_entries (entry_date)`,
    // Held timecards: time_entries.pending_project_request_id points at a
    // setting_change_request entity_type='project' action='create' so that
    // when admin approves the request, all held entries can be retro-
    // attached to the new project's id in one query. The FK lets that
    // server.js endpoint resolve the request without a join.
    // ON DELETE SET NULL: if the request is purged for any reason, the
    // timecard survives as orphaned data needing manual project assignment.
    // project_id has to drop the NOT NULL implicit on the FK definition;
    // schema.sql already allows nulls but pre-existing v3 deploys may have
    // tightened it via a NOT NULL added downstream — relax here just in case.
    `ALTER TABLE time_entries ADD COLUMN IF NOT EXISTS pending_project_request_id UUID REFERENCES setting_change_requests(id) ON DELETE SET NULL`,
    `ALTER TABLE time_entries ALTER COLUMN project_id DROP NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_time_entries_pending_request ON time_entries (pending_project_request_id) WHERE pending_project_request_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_projects_parent_id ON projects (parent_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects (client_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_contract_id ON projects (contract_id)`,
    `CREATE INDEX IF NOT EXISTS idx_projects_billed_date ON projects (billed_date)`,
    `CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items (invoice_id)`,
    `CREATE INDEX IF NOT EXISTS idx_invoice_items_project_id ON invoice_items (project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_permit_stages_project_id ON permit_stages (project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_permit_documents_project_id ON permit_documents (project_id)`,

    // engineering_contracts — umbrella above multiple billing contracts.
    // Used when one agreement (e.g. RUS 217) spans contracts 515-3, 515-4,
    // 515-5. Budgets can attach here to cover all child projects in
    // aggregate. See schema.sql for the full comment.
    `CREATE TABLE IF NOT EXISTS engineering_contracts (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
       name VARCHAR(255) NOT NULL,
       contract_number VARCHAR(80),
       notes TEXT,
       active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       UNIQUE (client_id, name)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_engineering_contracts_client_id ON engineering_contracts (client_id)`,
    // Auto-update updated_at on engineering_contracts. The set_updated_at()
    // function is created earlier in schema.sql; we DROP+CREATE so the
    // trigger always points at the current function.
    `DROP TRIGGER IF EXISTS engineering_contracts_updated_at ON engineering_contracts`,
    `CREATE TRIGGER engineering_contracts_updated_at
       BEFORE UPDATE ON engineering_contracts
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,

    // ─── invoice_templates: reference-PDF-driven invoice generator ───────
    // One template per (job, client). The reference PDF is uploaded once;
    // Claude vision analyses it to produce an HTML template with
    // {{placeholders}}; the system fills + renders to PDF on demand.
    `CREATE TABLE IF NOT EXISTS invoice_templates (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
       client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
       name VARCHAR(160),
       reference_pdf_path TEXT,
       reference_pdf_filename VARCHAR(260),
       generated_html TEXT,
       notes TEXT,
       analysis_status VARCHAR(20) DEFAULT 'pending',
       analysis_error TEXT,
       analyzed_at TIMESTAMPTZ,
       created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW(),
       UNIQUE (job_id, client_id)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_invoice_templates_job_client ON invoice_templates (job_id, client_id)`,
    `DROP TRIGGER IF EXISTS invoice_templates_updated_at ON invoice_templates`,
    `CREATE TRIGGER invoice_templates_updated_at
       BEFORE UPDATE ON invoice_templates
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,

    // ─── customer_clients: per-client login link table ───────────────────
    // Maps customer-role users to the clients they can see. The customer
    // portal scopes every endpoint through this junction so a customer
    // can never read another client's data.
    `CREATE TABLE IF NOT EXISTS customer_clients (
       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       PRIMARY KEY (user_id, client_id)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_customer_clients_client ON customer_clients (client_id)`,

    // Add engineering_contract_id to contracts (umbrella reference)
    `ALTER TABLE contracts ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL`,
    `CREATE INDEX IF NOT EXISTS idx_contracts_engineering_contract_id ON contracts (engineering_contract_id)`,

    // Add engineering_contract_id to budgets so a budget can scope to an
    // umbrella instead of (or in addition to) a single project. CHECK
    // constraint enforces exactly-one-of so budget math stays unambiguous.
    `ALTER TABLE budgets ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE CASCADE`,
    `ALTER TABLE budgets ALTER COLUMN project_id DROP NOT NULL`,
    // The CHECK constraint can fail if existing rows somehow violate it —
    // guard with NOT VALID then VALIDATE so the deploy doesn't abort on
    // legacy data, then VALIDATE separately so future inserts are checked.
    `DO $$ BEGIN
       IF NOT EXISTS (
         SELECT 1 FROM pg_constraint WHERE conname = 'budget_scope_exactly_one'
       ) THEN
         ALTER TABLE budgets ADD CONSTRAINT budget_scope_exactly_one CHECK (
           (project_id IS NOT NULL)::int + (engineering_contract_id IS NOT NULL)::int = 1
         ) NOT VALID;
       END IF;
     END $$`,
    `CREATE INDEX IF NOT EXISTS idx_budgets_engineering_contract_id ON budgets (engineering_contract_id)`,

    // Loan name on engineering_contracts — appears on PSC RUS invoices as
    // a top-level grouping label (e.g. "Reconnect 3"). Owner doesn't want
    // it labeled as "Loan: ..." in the PDF, just present on its own row.
    `ALTER TABLE engineering_contracts ADD COLUMN IF NOT EXISTS loan_name VARCHAR(80)`,
    // Friendly label on contracts — used on PSC RUS invoices when an
    // invoice spans multiple billing contracts (e.g. "Contract 3" for 515-3).
    `ALTER TABLE contracts ADD COLUMN IF NOT EXISTS friendly_label VARCHAR(40)`,

    // billing_batches — frozen group of selected projects the user can
    // come back to and either confirm-bill or break apart. Used by the
    // "Save batch & bill later" path off the Print PDF modal.
    `CREATE TABLE IF NOT EXISTS billing_batches (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name VARCHAR(160) NOT NULL,
       client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
       engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL,
       job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
       period_start DATE,
       period_end DATE,
       total_amount DECIMAL(14,2) DEFAULT 0,
       notes TEXT,
       created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE TABLE IF NOT EXISTS billing_batch_items (
       batch_id UUID REFERENCES billing_batches(id) ON DELETE CASCADE,
       project_id UUID REFERENCES projects(id) ON DELETE RESTRICT,
       snapshot_amount DECIMAL(14,2),
       snapshot_period_year INT,
       snapshot_period_month INT,
       PRIMARY KEY (batch_id, project_id)
     )`,
    `CREATE INDEX IF NOT EXISTS idx_billing_batches_client_id ON billing_batches (client_id)`,
    `CREATE INDEX IF NOT EXISTS idx_billing_batch_items_project_id ON billing_batch_items (project_id)`,
    // Undo buckets — short-lived snapshots saved by destructive endpoints
    // (bulk hours delete, project tree delete, contract cascade) so the
    // operator can restore within a UI-controlled window. Payload is the
    // exact rows that were removed, in insertion order. Expired rows are
    // pruned lazily on each new save (cheap; runs once per destructive op).
    `CREATE TABLE IF NOT EXISTS undo_buckets (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID,
       kind VARCHAR(50) NOT NULL,
       payload JSONB NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       expires_at TIMESTAMPTZ NOT NULL
     )`,
    `CREATE INDEX IF NOT EXISTS idx_undo_buckets_expires_at ON undo_buckets (expires_at)`,

    // Add engineering_contract_id to projects — direct FK so rollup
    // folders and leaf projects with contract_id=NULL are still linked
    // to their umbrella EC. Belt-and-suspenders alongside migration 0023.
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS engineering_contract_id UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL`,
  ];
  for (const sql of ddl) {
    try {
      await pool.query(sql);
      console.log('  ✓', sql.replace(/\s+/g, ' ').substring(0, 90));
    } catch (e) {
      console.error('  ✗', sql.substring(0, 80), '→', e.message);
    }
  }

  // Per-job upsert. Each in its own query so a single failure doesn't cascade.
  // Default rate is intentionally NOT updated on conflict so admin's manual
  // tweaks survive re-runs. Other identifying columns (billing_code, team,
  // applicability flags) DO get updated to match the canonical spec.
  const jobsToSeed = [
    // 9 PSC jobs (3 of which also surface for non-PSC)
    { name: 'County Permitting',             bt: 'footage', rate: null, perm: true,  code: 'a-2-D',      team: 'permitting', psc: true,  generic: true  },
    { name: 'DOT Permitting',                bt: 'footage', rate: null, perm: true,  code: 'a-2-D',      team: 'permitting', psc: true,  generic: true  },
    { name: 'RR Permitting',                 bt: 'footage', rate: null, perm: true,  code: 'a-2-D',      team: 'permitting', psc: true,  generic: true  },
    // Owner-flagged 2026-05-06: team renamed from 'inspection' to
    // 'construction'. Migration 0009 backfilled existing rows; the
    // seed below uses the canonical value going forward.
    { name: 'Resident Engineer',             bt: 'hourly',  rate: 100,  perm: false, code: 'g-1-B-1',    team: 'construction', psc: true,  generic: false },
    { name: 'Inspection',                    bt: 'hourly',  rate: 90,   perm: false, code: 'g-1-B-4',    team: 'construction', psc: true,  generic: false },
    { name: 'Update Plant Records',          bt: 'footage', rate: 850,  perm: false, code: 'a-4',        team: 'design',     psc: true,  generic: false },
    { name: 'OSP Staking Aerial',            bt: 'footage', rate: 850,  perm: false, code: 'e-2-A-1(N)', team: 'design',     psc: true,  generic: false },
    { name: 'OSP Staking Underground',       bt: 'footage', rate: 850,  perm: false, code: 'e-2-A-2(N)', team: 'design',     psc: true,  generic: false },
    { name: 'Construction Progress Reports', bt: 'footage', rate: 850,  perm: false, code: 'g-1-I-3',    team: 'both',       psc: true,  generic: false },
    // 3 non-PSC-only jobs (admin sets rate manually)
    { name: 'OSP Design & Fiber Assignments',bt: 'hourly',  rate: null, perm: false, code: null,         team: 'design',     psc: false, generic: true  },
    { name: 'Staking Fiber Assignments',     bt: 'hourly',  rate: null, perm: false, code: null,         team: 'design',     psc: false, generic: true  },
    { name: 'Records Management',            bt: 'hourly',  rate: null, perm: false, code: null,         team: 'both',       psc: false, generic: true  },
  ];

  let okCount = 0, failCount = 0;
  for (const j of jobsToSeed) {
    try {
      // Upsert that respects admin's manual edits.
      //
      // When INSERT (new job): all canonical values land as expected.
      // When CONFLICT (job exists):
      //   - If jobs.manually_overridden_at IS NULL → admin hasn't touched this
      //     job through the Settings UI, so keep refreshing the canonical
      //     values. This ensures my hardcoded job spec stays authoritative
      //     for never-edited jobs across deploys.
      //   - If jobs.manually_overridden_at IS NOT NULL → admin has edited
      //     this job. Preserve their choices for team, billing_type, rate,
      //     billing_code, applicability flags. Only refresh `active=TRUE`
      //     to make sure deactivated-then-restored jobs come back online.
      //
      // The COALESCE(jobs.manually_overridden_at, ...) trick: if the column
      // is NULL, EXCLUDED wins; if it's NOT NULL, the existing value wins.
      await pool.query(
        `INSERT INTO jobs (
           name, default_billing_type, default_rate, is_permitting,
           billing_code, team, for_psc_client, for_generic_client, active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
         ON CONFLICT (name) DO UPDATE SET
           default_billing_type = CASE WHEN jobs.manually_overridden_at IS NULL THEN EXCLUDED.default_billing_type ELSE jobs.default_billing_type END,
           is_permitting        = CASE WHEN jobs.manually_overridden_at IS NULL THEN EXCLUDED.is_permitting ELSE jobs.is_permitting END,
           billing_code         = COALESCE(jobs.billing_code, EXCLUDED.billing_code),
           team                 = CASE WHEN jobs.manually_overridden_at IS NULL THEN EXCLUDED.team ELSE jobs.team END,
           for_psc_client       = CASE WHEN jobs.manually_overridden_at IS NULL THEN EXCLUDED.for_psc_client ELSE jobs.for_psc_client END,
           for_generic_client   = CASE WHEN jobs.manually_overridden_at IS NULL THEN EXCLUDED.for_generic_client ELSE jobs.for_generic_client END,
           active               = TRUE`,
        [j.name, j.bt, j.rate, j.perm, j.code, j.team, j.psc, j.generic]
      );
      okCount++;
      console.log('  ✓ Job:', j.name);
    } catch (e) {
      failCount++;
      console.error('  ✗ Job FAILED:', j.name, '→', e.message);
    }
  }

  // Deactivate legacy seeded jobs that aren't in the new spec.
  try {
    const r = await pool.query(
      `UPDATE jobs SET active = FALSE
       WHERE name IN ('Permitting', 'Permitting (RR)', 'Design', 'Other')
         AND name NOT IN ('County Permitting','DOT Permitting','RR Permitting',
                          'Resident Engineer','Inspection','Update Plant Records',
                          'OSP Staking Aerial','OSP Staking Underground','Construction Progress Reports',
                          'OSP Design & Fiber Assignments','Staking Fiber Assignments','Records Management')`
    );
    console.log(`  ✓ Legacy jobs deactivated: ${r.rowCount}`);
  } catch (e) {
    console.error('  ✗ Legacy deactivation failed:', e.message);
  }

  console.log(`───── v3 bootstrap complete: ${okCount} OK, ${failCount} failed ─────`);
}

// Defensive idempotent re-run of recent migrations (Wave 11 + 12) — runs
// via its OWN safeBootstrap step so it executes even if bootstrapV3Schema
// throws halfway through. Railway's log rate-limit drops the [migrations]
// runner output; this gives us guaranteed table/folder creation regardless.
async function bootstrapDefensiveRecentMigrations() {
  console.error('═════ [DEFENSIVE BOOT] start ═════');
  // Wave 12 / migration 0042 — user_portal_access table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_portal_access (
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        portal_key varchar(50) NOT NULL,
        granted_at timestamptz DEFAULT now(),
        granted_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        PRIMARY KEY (user_id, portal_key)
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_portal_access_user ON user_portal_access(user_id)`);
    const t = await pool.query(`SELECT to_regclass('user_portal_access') AS exists`);
    console.error(`[DEFENSIVE BOOT] user_portal_access table exists=${t.rows[0].exists !== null}`);
  } catch (e) {
    console.error('[DEFENSIVE BOOT] user_portal_access FAILED:', e.message);
  }

  // Wave 11 / migration 0041 — legacy rollup folders + reparenting
  try {
    // CLEANUP: remove duplicate Client folders previously created by this
    // defensive boot when the client already had a legacy top-level rollup
    // (which doesn't carry rollup_level='client' marker). Children
    // reparented in step 4 get their parent_id reset to NULL so the next
    // iteration doesn't re-attach them.
    const cleanupUpdate = await pool.query(`
      UPDATE projects child
      SET parent_id = NULL
      FROM projects dup
      WHERE child.parent_id = dup.id
        AND dup.is_rollup = TRUE
        AND dup.rollup_level = 'client'
        AND EXISTS (
          SELECT 1 FROM projects legacy
          WHERE legacy.client_id = dup.client_id
            AND legacy.is_rollup = TRUE
            AND legacy.parent_id IS NULL
            AND legacy.id <> dup.id
        )
    `);
    if (cleanupUpdate.rowCount > 0) {
      console.error(`[DEFENSIVE BOOT] cleanup detached ${cleanupUpdate.rowCount} leaf(s) from duplicate Client folder(s)`);
    }
    const cleanupDelete = await pool.query(`
      DELETE FROM projects dup
      WHERE dup.is_rollup = TRUE
        AND dup.rollup_level = 'client'
        AND EXISTS (
          SELECT 1 FROM projects legacy
          WHERE legacy.client_id = dup.client_id
            AND legacy.is_rollup = TRUE
            AND legacy.parent_id IS NULL
            AND legacy.id <> dup.id
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = dup.id)
    `);
    if (cleanupDelete.rowCount > 0) {
      console.error(`[DEFENSIVE BOOT] cleanup deleted ${cleanupDelete.rowCount} duplicate Client folder(s)`);
    }

    const r1 = await pool.query(`
      INSERT INTO projects (name, client_id, status, is_rollup, rollup_level, rollup_key, project_type)
      SELECT cl.name, cl.id, 'active', TRUE, 'client', cl.id::text, 'rollup'
      FROM clients cl
      WHERE EXISTS (SELECT 1 FROM projects p WHERE p.client_id = cl.id AND p.parent_id IS NULL AND p.is_rollup IS NOT TRUE AND p.concentrator_id IS NULL)
        AND NOT EXISTS (SELECT 1 FROM projects cf WHERE cf.is_rollup = TRUE AND cf.rollup_level = 'client' AND cf.rollup_key = cl.id::text)
        AND NOT EXISTS (SELECT 1 FROM projects legacy WHERE legacy.client_id = cl.id AND legacy.is_rollup = TRUE AND legacy.parent_id IS NULL)
    `);
    console.error(`[DEFENSIVE BOOT] step1 created ${r1.rowCount} Client folder(s)`);

    const r2 = await pool.query(`
      INSERT INTO projects (name, client_id, parent_id, concentrator_id, status, is_rollup, rollup_level, rollup_key, project_type)
      SELECT DISTINCT ON (p.concentrator_id)
        COALESCE(con.area_name, 'Service Area'), p.client_id, cf.id, p.concentrator_id,
        'active', TRUE, 'service_area', p.concentrator_id::text, 'rollup'
      FROM projects p
      JOIN concentrators con ON con.id = p.concentrator_id
      JOIN projects cf ON cf.is_rollup = TRUE AND cf.rollup_level = 'client' AND cf.rollup_key = p.client_id::text
      WHERE p.parent_id IS NULL AND p.is_rollup IS NOT TRUE AND p.concentrator_id IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM projects sa WHERE sa.is_rollup = TRUE AND sa.rollup_level = 'service_area' AND sa.rollup_key = p.concentrator_id::text)
    `);
    console.error(`[DEFENSIVE BOOT] step2 created ${r2.rowCount} SA folder(s)`);

    const r3 = await pool.query(`
      UPDATE projects p SET parent_id = sa.id FROM projects sa
      WHERE p.parent_id IS NULL AND p.is_rollup IS NOT TRUE AND p.concentrator_id IS NOT NULL
        AND sa.is_rollup = TRUE AND sa.rollup_level = 'service_area' AND sa.rollup_key = p.concentrator_id::text
    `);
    console.error(`[DEFENSIVE BOOT] step3 reparented ${r3.rowCount} concentrator leaf(s)`);

    const r4 = await pool.query(`
      UPDATE projects p SET parent_id = cf.id FROM projects cf
      WHERE p.parent_id IS NULL AND p.is_rollup IS NOT TRUE AND p.concentrator_id IS NULL AND p.client_id IS NOT NULL
        AND cf.is_rollup = TRUE AND cf.rollup_level = 'client' AND cf.rollup_key = p.client_id::text
    `);
    console.error(`[DEFENSIVE BOOT] step4 reparented ${r4.rowCount} no-concentrator leaf(s)`);

    // Verify final DB state
    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'client') AS client_folders,
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'service_area') AS sa_folders,
        (SELECT COUNT(*) FROM projects WHERE parent_id IS NULL AND is_rollup IS NOT TRUE) AS flat_leaves
    `);
    const c = counts.rows[0];
    console.error(`[DEFENSIVE BOOT] DB STATE: ${c.client_folders} client folders, ${c.sa_folders} SA folders, ${c.flat_leaves} flat leaves`);
  } catch (e) {
    console.error('[DEFENSIVE BOOT] legacy rollup FAILED:', e.message);
  }

  // Wave 14 — Client → EC → SA hierarchy restructure
  // Goal: pull legacy top-level rollup folders (e.g. "PSC RUS 217") under the
  // client folder, create EC-level rollup folders for each engineering_contract,
  // and reparent SA folders under EC folders when the connection is traceable.
  // All operations are idempotent: ON CONFLICT DO NOTHING / WHERE NOT EXISTS guards.
  try {
    // Step W14-1: Ensure every client has a Client folder (idempotent — step1
    // above already does this for clients with flat leaves; extend to ALL clients).
    const w14_1 = await pool.query(`
      INSERT INTO projects (name, client_id, status, is_rollup, rollup_level, rollup_key, project_type)
      SELECT cl.name, cl.id, 'active', TRUE, 'client', cl.id::text, 'rollup'
      FROM clients cl
      WHERE NOT EXISTS (
        SELECT 1 FROM projects cf
        WHERE cf.is_rollup = TRUE
          AND cf.rollup_level = 'client'
          AND cf.rollup_key = cl.id::text
      )
      ON CONFLICT DO NOTHING
    `);
    console.error(`[WAVE 14] step W14-1: created ${w14_1.rowCount} missing Client folder(s)`);

    // Step W14-2: Pull existing top-level rollup folders (parent_id IS NULL,
    // not already a client-level folder) under their client's Client folder.
    // This handles legacy EC-named folders like "PSC RUS 217" that were created
    // before Wave 14 and currently sit at tree root.
    // SAFETY: skip Team-level folders (rollup_level='team') — they may have
    // children and will be left in place as legacy artifacts.
    const w14_2 = await pool.query(`
      UPDATE projects p
      SET parent_id = cf.id
      FROM projects cf
      WHERE p.is_rollup = TRUE
        AND p.parent_id IS NULL
        AND COALESCE(p.rollup_level, '') <> 'client'
        AND p.client_id IS NOT NULL
        AND cf.is_rollup = TRUE
        AND cf.rollup_level = 'client'
        AND cf.rollup_key = p.client_id::text
    `);
    console.error(`[WAVE 14] step W14-2: reparented ${w14_2.rowCount} top-level rollup(s) under Client folder(s)`);

    // Step W14-3: Create EC-level rollup folders for each engineering_contract
    // that doesn't already have one. Name = ec.name (+ program label).
    // Parent = Client folder for that EC's client.
    const w14_3 = await pool.query(`
      INSERT INTO projects
        (name, client_id, parent_id, engineering_contract_id, program,
         status, is_rollup, rollup_level, rollup_key, project_type)
      SELECT
        ec.name || CASE WHEN ec.program IS NOT NULL THEN ' (' || UPPER(ec.program) || ')' ELSE '' END,
        ec.client_id,
        cf.id,
        ec.id,
        ec.program,
        'active', TRUE, 'engineering_contract', ec.id::text, 'rollup'
      FROM engineering_contracts ec
      JOIN projects cf
        ON cf.is_rollup = TRUE
       AND cf.rollup_level = 'client'
       AND cf.rollup_key = ec.client_id::text
      WHERE ec.active = TRUE
        AND NOT EXISTS (
          SELECT 1 FROM projects ep
          WHERE ep.is_rollup = TRUE
            AND ep.rollup_level = 'engineering_contract'
            AND ep.rollup_key = ec.id::text
        )
      ON CONFLICT DO NOTHING
    `);
    console.error(`[WAVE 14] step W14-3: created ${w14_3.rowCount} EC folder(s)`);

    // Step W14-4: Reparent SA-level rollup folders that belong to an EC
    // (identified via engineering_contract_id on the SA folder) under the
    // matching EC folder. Only moves folders that are currently parented
    // directly under a Client folder or Team folder (i.e. not already under EC).
    const w14_4 = await pool.query(`
      UPDATE projects sa
      SET parent_id = ec_folder.id
      FROM projects ec_folder
      WHERE sa.is_rollup = TRUE
        AND sa.rollup_level = 'service_area'
        AND sa.engineering_contract_id IS NOT NULL
        AND ec_folder.is_rollup = TRUE
        AND ec_folder.rollup_level = 'engineering_contract'
        AND ec_folder.rollup_key = sa.engineering_contract_id::text
        AND sa.parent_id <> ec_folder.id
    `);
    console.error(`[WAVE 14] step W14-4: reparented ${w14_4.rowCount} SA folder(s) under EC folder(s)`);

    // Step W14-5: Reparent SA-level rollup folders that can be linked to an EC
    // via their child leaf projects (leaf has engineering_contract_id). Only
    // fires for SA folders not yet moved in W14-4.
    const w14_5 = await pool.query(`
      UPDATE projects sa
      SET
        parent_id = ec_folder.id,
        engineering_contract_id = COALESCE(sa.engineering_contract_id, ec_folder.rollup_key::uuid)
      FROM (
        SELECT DISTINCT ON (p.parent_id)
          p.parent_id AS sa_id,
          ef.id AS ec_folder_id
        FROM projects p
        JOIN projects ef
          ON ef.is_rollup = TRUE
         AND ef.rollup_level = 'engineering_contract'
         AND ef.rollup_key = p.engineering_contract_id::text
        WHERE p.engineering_contract_id IS NOT NULL
          AND p.is_rollup IS NOT TRUE
          AND p.parent_id IS NOT NULL
        ORDER BY p.parent_id, ef.id
      ) link
      JOIN projects sa ON sa.id = link.sa_id
      JOIN projects ec_folder ON ec_folder.id = link.ec_folder_id
      WHERE sa.is_rollup = TRUE
        AND sa.rollup_level = 'service_area'
        AND sa.parent_id <> ec_folder.id
    `);
    console.error(`[WAVE 14] step W14-5: reparented ${w14_5.rowCount} additional SA folder(s) via leaf EC linkage`);

    // W14-6: collapse legacy intermediate rollups between Client and EC. Any
    // rollup_level IS NULL folder sitting under a Client folder whose children
    // are all proper rollups (EC level or below) is a transitional artifact
    // from before Wave 14. "PSC RUS 217" is the canonical example. Promote its
    // children up to the Client folder and delete the empty intermediate.
    const w14_6a = await pool.query(`
      UPDATE projects child
      SET parent_id = legacy.parent_id
      FROM projects legacy
      WHERE child.parent_id = legacy.id
        AND legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (
          SELECT 1 FROM projects leaf
          WHERE leaf.parent_id = legacy.id
            AND leaf.is_rollup IS NOT TRUE
        )
    `);
    console.error(`[WAVE 14] step W14-6a: promoted ${w14_6a.rowCount} child rollup(s) up from legacy intermediate(s)`);

    const w14_6b = await pool.query(`
      DELETE FROM projects legacy
      WHERE legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND legacy.parent_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = legacy.id)
    `);
    console.error(`[WAVE 14] step W14-6b: deleted ${w14_6b.rowCount} now-empty legacy intermediate(s)`);

    // W14-7 DIAG: list candidate legacy duplicates so we can see what
    // the matcher will/won't catch. Logged before the UPDATE runs.
    const w14_diag = await pool.query(`
      SELECT
        legacy.id AS legacy_id,
        legacy.name AS legacy_name,
        legacy.parent_id AS legacy_parent,
        (SELECT COUNT(*) FROM projects c WHERE c.parent_id = legacy.id) AS legacy_children,
        ec_new.id AS new_id,
        ec_new.name AS new_name,
        regexp_replace(ec_new.name, ' \\([A-Za-z]+\\)$', '') AS new_name_stripped
      FROM projects legacy
      LEFT JOIN projects ec_new
        ON ec_new.client_id = legacy.client_id
       AND ec_new.is_rollup = TRUE
       AND ec_new.rollup_level = 'engineering_contract'
       AND ec_new.id <> legacy.id
      WHERE legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
      ORDER BY legacy.name
    `);
    for (const row of w14_diag.rows) {
      console.error(`[WAVE 14 DIAG] legacy="${row.legacy_name}" (${row.legacy_children} children) <=> new="${row.new_name}" → stripped="${row.new_name_stripped}" MATCH=${row.new_name_stripped === row.legacy_name}`);
    }

    // W14-7: merge duplicate EC folders. W14-3 created NEW EC folders named
    // "<ec.name> (<PROGRAM>)" with engineering_contract_id set. Legacy
    // rollups have just the bare EC name with rollup_level=NULL. Match by
    // looking up the EC's true name from engineering_contracts via the new
    // folder's engineering_contract_id, then comparing to ec_legacy.name.
    // No regex — direct FK-based match.
    const w14_7a = await pool.query(`
      UPDATE projects child
      SET parent_id = ec_new.id
      FROM projects ec_legacy, projects ec_new
      WHERE child.parent_id = ec_legacy.id
        AND ec_legacy.is_rollup = TRUE
        AND ec_legacy.rollup_level IS NULL
        AND ec_new.client_id = ec_legacy.client_id
        AND ec_new.is_rollup = TRUE
        AND ec_new.rollup_level = 'engineering_contract'
        AND ec_new.id <> ec_legacy.id
        AND ec_new.name LIKE ec_legacy.name || ' (%)'
    `);
    console.error(`[WAVE 14] step W14-7a: merged ${w14_7a.rowCount} child(ren) from duplicate-name legacy EC(s) into new EC folder(s)`);

    const w14_7b = await pool.query(`
      DELETE FROM projects ec_legacy
      WHERE ec_legacy.is_rollup = TRUE
        AND ec_legacy.rollup_level IS NULL
        AND EXISTS (
          SELECT 1 FROM projects ec_new
          WHERE ec_new.client_id = ec_legacy.client_id
            AND ec_new.is_rollup = TRUE
            AND ec_new.rollup_level = 'engineering_contract'
            AND ec_new.id <> ec_legacy.id
            AND ec_new.name LIKE ec_legacy.name || ' (%)'
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = ec_legacy.id)
    `);
    console.error(`[WAVE 14] step W14-7b: deleted ${w14_7b.rowCount} now-empty duplicate legacy EC folder(s)`);

    // W14-7c: re-run the W14-6 collapse to catch any newly-childless
    // legacy intermediates (e.g., PSC RUS 217 whose sole child was the
    // legacy EC folder we just merged + deleted).
    const w14_7c_promote = await pool.query(`
      UPDATE projects child
      SET parent_id = legacy.parent_id
      FROM projects legacy
      WHERE child.parent_id = legacy.id
        AND legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (
          SELECT 1 FROM projects leaf
          WHERE leaf.parent_id = legacy.id
            AND leaf.is_rollup IS NOT TRUE
        )
    `);
    const w14_7c_delete = await pool.query(`
      DELETE FROM projects legacy
      WHERE legacy.is_rollup = TRUE
        AND legacy.rollup_level IS NULL
        AND legacy.parent_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.id = legacy.parent_id
            AND p.is_rollup = TRUE
            AND p.rollup_level = 'client'
        )
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = legacy.id)
    `);
    console.error(`[WAVE 14] step W14-7c: post-merge collapse promoted ${w14_7c_promote.rowCount}, deleted ${w14_7c_delete.rowCount}`);

    // Verify extended DB state
    const counts14 = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'client') AS client_folders,
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'engineering_contract') AS ec_folders,
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'service_area') AS sa_folders,
        (SELECT COUNT(*) FROM projects WHERE is_rollup = TRUE AND rollup_level = 'team') AS team_folders,
        (SELECT COUNT(*) FROM projects WHERE parent_id IS NULL AND is_rollup IS NOT TRUE) AS flat_leaves
    `);
    const c14 = counts14.rows[0];
    console.error(`[WAVE 14] DB STATE: ${c14.client_folders} client, ${c14.ec_folders} EC, ${c14.sa_folders} SA, ${c14.team_folders} team (legacy), ${c14.flat_leaves} flat leaves`);
  } catch (e) {
    console.error('[WAVE 14] EC hierarchy restructure FAILED:', e.message);
  }

  // Populate ec_service_areas for "RUS 217 Engineering Contract GA 1706 - A72"
  // from existing concentrators + project work_order_number data. Idempotent —
  // ON CONFLICT (engineering_contract_id, name) DO NOTHING skips already-present rows.
  try {
    const ecRow = await pool.query(
      `SELECT id FROM engineering_contracts WHERE name = $1 LIMIT 1`,
      ['RUS 217 Engineering Contract GA 1706 - A72']
    );
    if (ecRow.rows[0]) {
      const ecId = ecRow.rows[0].id;
      // Derive one row per distinct concentrator linked to any project under
      // this EC. Work-order number comes from the concentrator row itself
      // (concentrators.work_order_number) when present; otherwise falls back
      // to the first project-level work_order_number that shares the same
      // concentrator. This covers the known data layout where Construction
      // rollup projects carry the WO# and leaf projects do not.
      const saInsert = await pool.query(`
        INSERT INTO ec_service_areas (engineering_contract_id, name, work_order_number)
        SELECT
          $1,
          c.area_name,
          COALESCE(
            NULLIF(c.work_order_number, ''),
            (
              SELECT NULLIF(p2.work_order_number, '')
              FROM projects p2
              WHERE p2.concentrator_id = c.id
                AND p2.engineering_contract_id = $1
                AND p2.work_order_number IS NOT NULL
              ORDER BY p2.work_order_number
              LIMIT 1
            )
          )
        FROM concentrators c
        WHERE c.id IN (
          SELECT DISTINCT p.concentrator_id
          FROM projects p
          WHERE p.engineering_contract_id = $1
            AND p.concentrator_id IS NOT NULL
        )
        ON CONFLICT (engineering_contract_id, name) DO NOTHING
      `, [ecId]);
      console.error(`[EC-SA SEED] inserted ${saInsert.rowCount} ec_service_area row(s) for RUS 217 EC`);
    } else {
      console.error('[EC-SA SEED] EC "RUS 217 Engineering Contract GA 1706 - A72" not found — skipping seed');
    }
  } catch (e) {
    console.error('[EC-SA SEED] FAILED:', e.message);
  }

  // Wave 19 — SA→Contract link
  // Add contract_id to ec_service_areas, then populate it by matching each SA
  // row's name to the legacy SA rollup folder and walking up to its parent
  // Construction Contract folder.
  try {
    await pool.query(`ALTER TABLE ec_service_areas ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL`);
    const populated = await pool.query(`
      UPDATE ec_service_areas esa
      SET contract_id = sa_folder.contract_id
      FROM projects sa_folder
      WHERE esa.contract_id IS NULL
        AND sa_folder.is_rollup = TRUE
        AND sa_folder.rollup_level = 'service_area'
        AND sa_folder.contract_id IS NOT NULL
        AND lower(sa_folder.name) = lower(esa.name)
    `);
    console.error(`[WAVE 19] ec_service_areas.contract_id populated for ${populated.rowCount} row(s)`);
  } catch (e) {
    console.error('[WAVE 19] SA contract_id bootstrap FAILED:', e.message);
  }

  // Wave 20 Fix 1 — Normalize legacy "Contract N" service_area folders to contract level.
  // These folders were created by Wave 9/10/11 boot from concentrators with rollup_level='service_area'
  // and rollup_key=concentrator_id. Wave 17 created parallel rollup_level='contract' folders keyed
  // on contract_id — causing duplicates. Match by name against contracts.friendly_label / contract_number
  // / name for the same EC, then re-tag the folder as contract-level. The folder's id does not change,
  // so all child parent_id FKs remain valid. Idempotent: contract_id IS NULL + rollup_key NOT IN
  // (contracts.id::text) guards prevent re-touching already-normalized rows.
  try {
    const fix1 = await pool.query(`
      UPDATE projects sa
      SET rollup_level = 'contract',
          rollup_key   = c.id::text,
          contract_id  = c.id
      FROM projects ec_folder
      JOIN contracts c
        ON c.engineering_contract_id = ec_folder.engineering_contract_id
       AND ( lower(c.friendly_label) = lower(sa.name)
          OR lower(c.contract_number) = lower(sa.name)
          OR lower(c.name)            = lower(sa.name) )
      WHERE sa.is_rollup = TRUE
        AND sa.rollup_level = 'service_area'
        AND ec_folder.id = sa.parent_id
        AND ec_folder.is_rollup = TRUE
        AND ec_folder.rollup_level = 'engineering_contract'
        AND sa.contract_id IS NULL
        AND sa.rollup_key NOT IN (SELECT id::text FROM contracts)
    `);
    console.error(`[WAVE 20] fix1 normalized ${fix1.rowCount} service_area folder(s) → contract level`);
  } catch (e) {
    console.error('[WAVE 20] fix1 normalize FAILED:', e.message);
  }

  // Wave 20 Fix 2 — Dedup contract-level folders sharing same (parent_id, rollup_key).
  // After Fix 1, a Wave-17-created contract folder may coexist with the just-normalized original.
  // Strategy: within each duplicate group pick the CANONICAL keeper = most children, tiebreak oldest.
  // Reparent children of non-keepers to keeper, then DELETE non-keepers if they have zero children.
  // Pure SQL via CTE — idempotent (no-op when no duplicate groups exist).
  try {
    const fix2_reparent = await pool.query(`
      WITH groups AS (
        SELECT
          parent_id,
          rollup_key,
          id,
          ROW_NUMBER() OVER (
            PARTITION BY parent_id, rollup_key
            ORDER BY (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) DESC,
                     COALESCE(created_at, now()) ASC,
                     id ASC
          ) AS rn
        FROM projects p
        WHERE is_rollup = TRUE
          AND rollup_level = 'contract'
      ),
      keepers AS (SELECT parent_id, rollup_key, id AS keeper_id FROM groups WHERE rn = 1),
      dupes   AS (SELECT g.parent_id, g.rollup_key, g.id AS dupe_id, k.keeper_id
                    FROM groups g JOIN keepers k USING (parent_id, rollup_key)
                   WHERE g.rn > 1)
      UPDATE projects child
      SET parent_id = d.keeper_id
      FROM dupes d
      WHERE child.parent_id = d.dupe_id
    `);
    console.error(`[WAVE 20] fix2 reparented ${fix2_reparent.rowCount} child(ren) from duplicate contract folders`);

    const fix2_delete = await pool.query(`
      WITH groups AS (
        SELECT
          parent_id,
          rollup_key,
          id,
          ROW_NUMBER() OVER (
            PARTITION BY parent_id, rollup_key
            ORDER BY (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) DESC,
                     COALESCE(created_at, now()) ASC,
                     id ASC
          ) AS rn
        FROM projects p
        WHERE is_rollup = TRUE
          AND rollup_level = 'contract'
      )
      DELETE FROM projects
      WHERE id IN (
        SELECT id FROM groups WHERE rn > 1
      )
        AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = projects.id)
    `);
    console.error(`[WAVE 20] fix2 deleted ${fix2_delete.rowCount} empty duplicate contract folder(s)`);
  } catch (e) {
    console.error('[WAVE 20] fix2 dedup FAILED:', e.message);
  }

  // Wave 20 Fix 3 — Rename contract-level folders to "friendly_label / contract_number".
  // IS DISTINCT FROM guard makes this idempotent — only touches rows whose name differs from the target.
  try {
    const fix3 = await pool.query(`
      UPDATE projects p
      SET name = c.friendly_label || ' / ' || c.contract_number
      FROM contracts c
      WHERE p.is_rollup = TRUE
        AND p.rollup_level = 'contract'
        AND p.contract_id = c.id
        AND c.friendly_label IS NOT NULL
        AND c.contract_number IS NOT NULL
        AND p.name IS DISTINCT FROM (c.friendly_label || ' / ' || c.contract_number)
    `);
    console.error(`[WAVE 20] fix3 renamed ${fix3.rowCount} contract folder(s) to "label / number" format`);
  } catch (e) {
    console.error('[WAVE 20] fix3 rename FAILED:', e.message);
  }

  console.error('═════ [DEFENSIVE BOOT] end ═════');
}

async function start(opts = {}) {
  // Each bootstrap step is wrapped so any single DB-related failure
  // (degraded Postgres, missing table, full disk on the DB volume) does
  // NOT prevent the server from binding a port. Without this guard, an
  // unawaitable rejection here makes Railway's proxy return 502 because
  // app.listen() below never runs — exactly the failure mode the disk-
  // recovery endpoints are designed to debug, so they must remain
  // reachable even when the rest of the app can't talk to the DB.
  async function safeBootstrap(label, fn) {
    try { await fn(); }
    catch (e) {
      console.error(`[boot] ${label} failed (continuing without it):`, e && (e.message || e));
    }
  }
  await safeBootstrap('initSchema',                    () => initSchema());
  await safeBootstrap('bootstrapV3Schema',             () => bootstrapV3Schema());   // runs AFTER initSchema, even if that errored
  await safeBootstrap('bootstrapAuthSchema',           () => bootstrapAuthSchema(pool));  // creates users table + seeds default admin
  // Defensive re-run of Wave 11 + 12 work — its OWN safeBootstrap so it runs
  // even if bootstrapV3Schema threw partway. user_portal_access depends on
  // users table existing, so this runs AFTER bootstrapAuthSchema.
  await safeBootstrap('bootstrapDefensiveRecentMigrations', () => bootstrapDefensiveRecentMigrations());
  // Re-run any schema.sql statements that initSchema deferred because
  // they reference the users table (billing_batches / invoice_templates
  // / customer_clients have FKs to users(id)). Now that users exists
  // they apply cleanly.
  await safeBootstrap('applyDeferredSchemaStatements', () => applyDeferredSchemaStatements());
  await safeBootstrap('bootstrapTimeClockSchema',      () => timeclockModule.bootstrapTimeClockSchema(pool));  // staff_id + sessions + audit log
  // Versioned migrations runner (Track 1.4) — applies anything in
  // /migrations that isn't recorded in schema_migrations yet. Coexists
  // with bootstrapV3Schema until the v3 ALTER soup is gradually moved
  // into numbered migration files. Failure logs but doesn't crash boot.
  try {
    const { runMigrations } = require('./db_migrations');
    console.log('[migrations] starting runner...');
    const out = await runMigrations(pool);
    console.log(`[migrations] done — applied ${out.applied} new, skipped ${out.skipped}`);
    if (out.files && out.files.length) {
      for (const f of out.files) {
        console.log(`[migrations]   ${f.status === 'applied' ? '✓' : '·'} ${f.filename} (${f.status})`);
      }
    }
  } catch (mErr) {
    console.error('[migrations] failed:', mErr && mErr.message);
  }
  // Automation scheduler — surfaces stale permits + budget burn + daily
  // digest to console; the same data is exposed via /api/automation/* for
  // the UI. Started AFTER all schemas are bootstrapped so the queries
  // don't race against missing tables. Skipped when called from tests so
  // the bootstrap log isn't polluted with digest output and scheduler
  // ticks don't race the test cleanup. The handle is unref'd anyway, but
  // skipping it keeps test startup quiet.
  if (!opts.skipScheduler) {
    // Pass uploadDir so the scheduler can run the daily orphan-file prune.
    // Without it, the prune step is skipped (still safe — manual endpoint
    // /api/_admin/prune-orphan-files works either way).
    try {
      automationModule.startScheduler(pool, { uploadDir: UPLOAD_DIR });
    } catch (e) {
      console.error('[boot] startScheduler failed (continuing without it):', e && (e.message || e));
    }

    // Audit log auto-archive scheduler (RUS retention policy)
    // Wave 47: soft-archive (set archived_at) for rows older than hot_retention_days.
    // Respects AUDIT_AUTO_ARCHIVE_ENABLED env var (default: false).
    if (process.env.AUDIT_AUTO_ARCHIVE_ENABLED === 'true') {
      const { archiveOldAuditRows } = require('./routes/_audit');
      // Run once on startup after a short delay (let pool settle)
      setTimeout(() => {
        archiveOldAuditRows(pool).catch(e => {
          console.error('[audit-retention] startup archive failed:', e && (e.message || e));
        });
      }, 30000);
      // Then run daily (24 hours)
      setInterval(() => {
        archiveOldAuditRows(pool).catch(e => {
          console.error('[audit-retention] daily archive failed:', e && (e.message || e));
        });
      }, 24 * 60 * 60 * 1000);
    } else {
      console.log('[audit-retention] auto-archive disabled (set AUDIT_AUTO_ARCHIVE_ENABLED=true to enable)');
    }

    // Wave 70: workspace trash auto-purge daily scheduler
    // Respects WORKSPACE_AUTO_PURGE_ENABLED env var (default: false).
    if (process.env.WORKSPACE_AUTO_PURGE_ENABLED === 'true') {
      const { purgeOldWorkspaceTrash } = require('./routes/folder_workspace');
      if (typeof purgeOldWorkspaceTrash === 'function') {
        // Run once on startup after a short delay (let pool settle)
        setTimeout(() => {
          purgeOldWorkspaceTrash(pool).catch(e => {
            console.error('[workspace-purge] startup run failed:', e && (e.message || e));
          });
        }, 60000);
        // Then run daily (24 hours)
        setInterval(() => {
          purgeOldWorkspaceTrash(pool).catch(e => {
            console.error('[workspace-purge] daily run failed:', e && (e.message || e));
          });
        }, 24 * 60 * 60 * 1000);
        console.log('[workspace-purge] auto-purge enabled (30-day retention, daily run)');
      } else {
        console.error('[workspace-purge] helper not found; check folder_workspace.js export');
      }
    } else {
      console.log('[workspace-purge] auto-purge disabled (set WORKSPACE_AUTO_PURGE_ENABLED=true to enable)');
    }
  }
  // listenPort: pass 0 from tests to bind to an ephemeral port; pass the
  // configured PORT in production. We log the resolved port (server.address())
  // rather than the input so 0 → actual port is visible.
  const listenPort = opts.port !== undefined ? opts.port : PORT;
  const server = await new Promise((resolve, reject) => {
    const s = app.listen(listenPort, (err) => {
      if (err) return reject(err);
      console.log(`✓ Launch Fiber Services running on port ${s.address().port}`);
      resolve(s);
    });
    s.on('error', reject);
  });
  // Extend timeouts to 30 minutes — needed for multi-GB uploads. The
  // platform's load balancer (Railway) may still cap at 5 minutes, but
  // setting these here at least removes Node as the bottleneck.
  server.timeout = 30 * 60 * 1000;            // overall socket timeout
  server.keepAliveTimeout = 30 * 60 * 1000;   // keep-alive
  server.headersTimeout = 30 * 60 * 1000 + 1000; // must be > keepAliveTimeout
  return server;
}

// Only auto-start when invoked directly (`node server.js`). Tests
// `require('./server')` and call `start({ port: 0 })` to bind an ephemeral
// port without auto-starting on import.
if (require.main === module) {
  start().catch(console.error);
}

module.exports = { app, start };
