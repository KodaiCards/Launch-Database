require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const { pool, initSchema } = require('./db');
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

// CSRF defense via Origin/Referer validation. Cookie-auth + a cross-site form
// POST is the classic CSRF vector. For any state-changing request, require
// either no Origin (same-origin browser navigation) or an Origin/Referer
// matching ALLOWED_ORIGINS / our own host. Auth-header callers are still
// safe (the header isn't sent automatically by browsers cross-site).
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  // Login is allowed cross-origin (otherwise legit users on portal subdomains
  // couldn't authenticate). Rate limiting in auth.js prevents abuse.
  if (req.path === '/api/auth/login') return next();
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
const PORTAL_MODE = (process.env.PORTAL_MODE || '').toLowerCase();
const PORTAL_NAMES = {
  permitting: 'Permitting Portal',
  design: 'Design Portal',
  timeclock: 'Launch Time Clock',
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
const { bootstrapAuthSchema, installAuthRoutes, requireAuth, requireAdmin, requireManagerOrAdmin } = require('./auth');
installAuthRoutes(app, pool);

// Wire up portal-mode route overrides + setting-approval flow. Now that
// authMiddleware is installed, portal_module routes can use requireAuth/Admin.
installPortalExtensions(app, pool, PORTAL_MODE, { requireAuth, requireAdmin });

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
  if (reqPath.startsWith('/api/auth/')) return false;
  if (reqPath.startsWith('/uploads/')) return false;  // file serving handles its own auth-check
  // Block everything else (HTML pages and API endpoints) until logged in
  return true;
}

app.use((req, res, next) => {
  // Already authenticated via JWT cookie/header? Pass.
  if (req.user) return next();

  // Public path? Pass.
  if (!pageRequiresAuth(req.path)) return next();

  // Transition: HTTP Basic Auth fallback if APP_PASSWORD is set.
  // This keeps the legacy portal credentials working during user rollout.
  if (APP_PASSWORD) {
    const auth = req.headers.authorization;
    if (auth) {
      const [scheme, encoded] = auth.split(' ');
      if (scheme === 'Basic') {
        const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
        if (pass === APP_PASSWORD) return next();
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

  // Serve portal HTML at root — BEFORE express.static grabs index.html. Inject
  // ADMIN_API_BASE so the portal frontend knows where to POST file uploads
  // and where to read /uploads/* PDFs (since those live on admin's volume,
  // not on portal containers).
  const portalFile = PORTAL_MODE === 'permitting' ? 'permitting.html'
                   : PORTAL_MODE === 'timeclock' ? 'timeclock.html'
                   : PORTAL_MODE === 'customer' ? 'customer.html'
                   : 'design.html';
  const ADMIN_API_BASE = process.env.ADMIN_API_BASE || '';

  // /uploads/* on a portal redirects to admin's /uploads/* — this is critical
  // because uploaded PDFs live on admin's persistent volume, NOT on portal
  // containers (which have ephemeral storage and lose files on every redeploy).
  // Without this, viewing a PDF from a portal returns "File not found" because
  // the portal's local filesystem is empty.
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
      // Inject admin URL right after <head> so it's available to all scripts
      const inject = `<script>window.ADMIN_API_BASE = ${JSON.stringify(ADMIN_API_BASE)};</script>`;
      if (html.includes('</head>')) {
        html = html.replace('</head>', inject + '</head>');
      } else {
        html = inject + html;  // fallback
      }
      res.set('Content-Type', 'text/html; charset=utf-8').send(html);
    } catch (e) {
      res.status(500).send('Portal HTML load failed: ' + e.message);
    }
  });
  // Block direct access to the main app in portal mode
  app.get('/index.html', (req, res) => {
    res.redirect('/');
  });
  if (!ADMIN_API_BASE) {
    console.warn('⚠ ADMIN_API_BASE env var not set — portal upload routing and PDF viewing will fall back to relative URLs (which will 404 on this portal). Set ADMIN_API_BASE to your admin service URL like "https://launch-database-production-xyz.up.railway.app".');
  } else {
    console.log('✓ Portal will route file uploads + /uploads/* PDFs to:', ADMIN_API_BASE);
  }
}

// Login page — public, no auth required (handled by the public-path check above).
// Looks in public/ first (production layout), then root (dev layout).
app.get(['/login', '/login.html'], (req, res) => {
  const inPublic = path.join(__dirname, 'public', 'login.html');
  const inRoot = path.join(__dirname, 'login.html');
  res.sendFile(fs.existsSync(inPublic) ? inPublic : inRoot);
});

app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads with correct Content-Type so PDFs render inline instead of
// downloading as octet-stream, and 404 instead of falling through to the
// SPA catch-all (which used to return the HTML page when a file was missing).
app.use('/uploads', express.static(UPLOAD_DIR, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  },
  fallthrough: false  // <-- hard 404 instead of next() to the SPA route
}));
// If express.static throws ENOENT, send a clean 404 (don't render SPA HTML).
app.use('/uploads', (err, req, res, next) => {
  if (err && (err.code === 'ENOENT' || err.statusCode === 404)) {
    return res.status(404).json({ error: 'File not found' });
  }
  return next(err);
});

// ─── Anthropic client ─────────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('WARNING: ANTHROPIC_API_KEY is not set. AI assistant will not work.');
  console.error('Add it in Railway dashboard → Variables → ANTHROPIC_API_KEY');
}
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
require('./routes/clients')(app, pool, { requireAdmin });

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTS + ENGINEERING CONTRACTS — extracted as part of Track 1.3.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/contracts')(app, pool, { requireAdmin });
require('./routes/engineering_contracts')(app, pool, { requireAdmin });


// ─────────────────────────────────────────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// JOBS — extracted to routes/jobs.js (Track 1.3).
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/jobs')(app, pool, {});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPES — program categories (BAU / GF(R) / RUS / Other / custom)
// ─────────────────────────────────────────────────────────────────────────────

// Project types extracted to routes/project_types.js (Track 1.3).
require('./routes/project_types')(app, pool, {});

// Pricing list extracted to routes/pricing.js (Track 1.3).
require('./routes/pricing')(app, pool, {});

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
require('./routes/staff')(app, pool, {});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — core CRUD + recalc + tree/with-hours delete extracted to
// routes/projects.js (CLEANUP_PLAN.md Track 1.3.3). Other project
// endpoints (documents, detail, ongoing, unbill, mark-billed, bill-and-clone)
// stay below for now and will move in a follow-up.
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/projects')(app, pool, { requireAdmin });

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
// DIRECT CSV IMPORT FOR HOURS (no AI involvement)
// Two-phase: validate → confirm → commit. All commits in a single transaction.
// ─────────────────────────────────────────────────────────────────────────────

// Normalize a WO# for matching: strip "WO" prefix, separators, whitespace, uppercase
function normalizeWO(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().toUpperCase()
    .replace(/^WO[\s\-_#:]*/i, '')   // strip leading "WO ", "WO-", "WO#", etc.
    .replace(/[\s\-_]+/g, '');         // strip remaining separators
}

// Normalize a name for matching: trim, collapse whitespace, lowercase
function normalizeName(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
}

// Match a header row to our canonical fields. Returns { name, date, wo, hours, job_title }
// where each value is the actual header string in the file (or null if not found).
function detectColumns(headers) {
  const lc = headers.map(h => String(h).trim().toLowerCase());
  function findOne(...candidates) {
    for (const c of candidates) {
      const i = lc.indexOf(c);
      if (i >= 0) return headers[i];
    }
    return null;
  }
  return {
    name: findOne('name', 'employee', 'worker', 'staff', 'staff_name', 'employee_name', 'inspector', 'inspector name'),
    date: findOne('date', 'entry_date', 'work_date', 'day', 'work date'),
    week_ending: findOne('week ending', 'week_ending', 'weekending', 'week-ending'),
    wo: findOne('wo', 'wo#', 'wo #', 'work_order', 'work order', 'work_order_number', 'wo_number', 'work order #', 'work order#', 'job', 'job#'),
    hours: findOne('hours', 'hrs', 'time', 'qty'),
    job_title: findOne('job_title', 'title', 'position', 'role', 'classification'),
    billing_code: findOne('billing code', 'billing_code', 'code', 'rus code', 'rus billing code')
  };
}

const MONTH_LOOKUP = {
  jan:1, january:1, feb:2, february:2, mar:3, march:3, apr:4, april:4,
  may:5, jun:6, june:6, jul:7, july:7, aug:8, august:8,
  sep:9, sept:9, september:9, oct:10, october:10, nov:11, november:11, dec:12, december:12
};

// Parse a date cell into YYYY-MM-DD or return null. Handles ISO, MM/DD/YYYY, M/D/YY,
// "D-MMM" (e.g., "2-Mar"), and "D MMM" formats. anchorYear (from a Week Ending column)
// is required for the short formats since they don't include a year.
function parseDateCell(v, anchorYear, anchorDate, overrideYear) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();

  // Already ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // M/D/YYYY or MM/DD/YYYY
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  // M/D/YY (assume current century)
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
  if (m) {
    const yr = 2000 + parseInt(m[3], 10);
    return `${yr}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  }

  // M/D (no year at all — e.g. "2/14" or "12/3")
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const month = parseInt(m[1], 10);
    const day = parseInt(m[2], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const year = overrideYear || inferYear(month, anchorYear);
      return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
  }

  // "D-MMM" or "D MMM" — day + 3+ letter month, no year.
  m = s.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3,})$/);
  if (m) {
    const monthNum = MONTH_LOOKUP[m[2].toLowerCase()];
    if (monthNum) {
      let year = overrideYear || anchorYear || inferYear(monthNum, null);
      const day = parseInt(m[1], 10);
      let result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if (anchorDate && !overrideYear) {
        const d = new Date(result + 'T00:00:00');
        const anchor = new Date(anchorDate + 'T00:00:00');
        const diffDays = (d - anchor) / 86400000;
        if (diffDays > 7) {
          year = (anchorYear || year) - 1;
          result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        } else if (diffDays < -14) {
          year = (anchorYear || year) + 1;
          result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        }
      }
      return result;
    }
  }

  // Last resort: try Date parser
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

// Smart year inference: if CSV says "December" and current month is January,
// assume December of PREVIOUS year. If CSV says "February" and it's March,
// assume February of CURRENT year.
function inferYear(csvMonth, anchorYear) {
  if (anchorYear) return anchorYear;
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();

  // If the CSV month is ahead of current month by more than 1, it's probably last year
  // e.g. Current: Jan 2027, CSV: Dec → Dec 2026
  if (csvMonth > curMonth + 1) return curYear - 1;
  // Otherwise assume current year
  return curYear;
}

// Find the actual header row in a 2D array of rows. Real-world spreadsheets often
// have title and metadata rows above the column headers (e.g., "Inspector Daily
// Time Entry" on row 1, then column names on row 3). Returns the index of the
// header row, or -1 if none found.
function findHeaderRow(rows2d) {
  const SIGNALS = ['name', 'employee', 'worker', 'inspector', 'staff', 'date',
    'week ending', 'hours', 'hrs', 'wo', 'work order', 'job'];
  for (let i = 0; i < Math.min(rows2d.length, 20); i++) {
    const row = rows2d[i] || [];
    const lc = row.map(c => String(c || '').trim().toLowerCase()).filter(Boolean);
    if (lc.length < 3) continue;
    let matches = 0;
    for (const cell of lc) {
      for (const sig of SIGNALS) {
        if (cell === sig || cell.includes(sig)) { matches++; break; }
      }
    }
    if (matches >= 3) return i;
  }
  return -1;
}

// Convert a 2D row array (starting AT the header row) into objects keyed by header.
function arrayToObjects(rows2d, headerIdx) {
  const headers = rows2d[headerIdx].map(h => String(h || '').trim());
  const out = [];
  for (let i = headerIdx + 1; i < rows2d.length; i++) {
    const row = rows2d[i] || [];
    // Skip rows that are entirely empty (separator rows + trailing junk)
    if (row.every(c => c === null || c === undefined || String(c).trim() === '')) continue;
    const obj = {};
    headers.forEach((h, j) => { if (h) obj[h] = row[j]; });
    out.push(obj);
  }
  return { headers: headers.filter(Boolean), rows: out };
}

// Validate a parsed CSV/XLSX file. Does not write anything. Returns:
//   { stage_id, headers, columns, valid_rows, unknown_staff, unknown_wos, invalid_rows, summary }
// stage_id is a temp key clients pass back to /commit so we don't re-parse.
const csvStage = new Map(); // stageId → { rows, expiresAt }
const CSV_STAGE_TTL_MS = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of csvStage) if (v.expiresAt < now) csvStage.delete(k);
}, 5 * 60 * 1000);

// Infer the job title from the filename and any title rows above the header.
// Returns a string like "Inspector" or null if nothing matched.
function inferJobTitle(filename, rows2d, headerIdx) {
  const corpus = [
    filename || '',
    // Concatenate all rows above the header — these usually hold the title
    ...(rows2d.slice(0, headerIdx).map(r => (r || []).map(c => String(c || '')).join(' ')))
  ].join(' ').toLowerCase();

  const KEYWORDS = [
    { match: /inspect/, title: 'Inspector' },
    { match: /resident\s*engineer|^re\b|\bre\s+timecard/, title: 'Resident Engineer' },
    { match: /permit/, title: 'Permitting' },
    { match: /design/, title: 'Design' },
    { match: /survey/, title: 'Surveyor' },
    { match: /splic/, title: 'Splicer' },
    { match: /foreman/, title: 'Foreman' }
  ];
  for (const kw of KEYWORDS) {
    if (kw.match.test(corpus)) return kw.title;
  }
  return null;
}

app.post('/api/hours/csv-validate', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const overrideYear = req.body.override_year ? parseInt(req.body.override_year, 10) : null;

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows2d = [];

    // Read the sheet as a 2D array so we can scan for the real header row.
    // Real-world templates often have title/metadata rows above the column headers.
    if (ext === '.xlsx' || ext === '.xls') {
      const wb = XLSX.readFile(req.file.path);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows2d = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
    } else if (ext === '.csv' || ext === '.tsv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const wb = XLSX.read(content, { type: 'string' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows2d = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Unsupported file type. Use .csv, .xlsx, or .xls.' });
    }

    fs.unlinkSync(req.file.path);

    // Find the real header row inside the first ~20 rows
    const headerIdx = findHeaderRow(rows2d);
    if (headerIdx < 0) {
      return res.status(400).json({
        error: 'Could not find a header row in the first 20 rows of the file. Expected columns include name/employee/inspector, date, hours, work order.',
        first_rows: rows2d.slice(0, 8)
      });
    }

    const { headers, rows } = arrayToObjects(rows2d, headerIdx);
    const cols = detectColumns(headers);

    const missing = [];
    if (!cols.name) missing.push('name/employee/inspector');
    if (!cols.date) missing.push('date');
    if (!cols.wo) missing.push('work_order');
    if (!cols.hours) missing.push('hours');
    if (missing.length) {
      return res.status(400).json({
        error: 'Missing required columns: ' + missing.join(', '),
        headers,
        detected_columns: cols
      });
    }

    // Try to infer a job title from the filename and rows above the header.
    // "Inspector_Timecards.csv" → "Inspector"; "Permitting weekly.xlsx" → "Permitting".
    // This becomes the fallback for any row that doesn't have its own job title.
    const inferredJobTitle = inferJobTitle(req.file.originalname, rows2d, headerIdx);

    // Pull staff + projects + pricing entries so per-row matching is cheap.
    // For projects we ALSO need to know which are leaves (no children) and
    // which job each is linked to — so we can pick the right project when
    // multiple share the same WO# (common: grandparent/parent/child of a
    // concentrator all carry the same WO).
    const [staffR, projR, pricingR] = await Promise.all([
      pool.query('SELECT id, name FROM staff'),
      pool.query(`
        SELECT p.id, p.name, p.work_order_number, p.job_id, p.parent_id,
               j.name as job_name,
               EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id) AS has_children
        FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE p.work_order_number IS NOT NULL AND p.work_order_number != ''
      `),
      pool.query(`
        SELECT pe.billing_code, j.name as job_name
        FROM pricing_entries pe
        LEFT JOIN jobs j ON j.id = pe.job_id
        WHERE pe.billing_code IS NOT NULL AND pe.billing_code != ''
      `)
    ]);
    const staffByNorm = {};
    staffR.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s; });

    // Group projects by normalized WO. Each entry is an array of candidate
    // projects sharing that WO. The per-row matcher picks the best one based
    // on the billing code (if any) → job match preference, then leaf preference.
    const projsByNorm = {};
    projR.rows.forEach(p => {
      const k = normalizeWO(p.work_order_number);
      (projsByNorm[k] = projsByNorm[k] || []).push(p);
    });

    // Map "g-1-B-4" (case-insensitive) → "Inspection"
    const jobByCode = {};
    pricingR.rows.forEach(pe => {
      if (pe.billing_code && pe.job_name) {
        jobByCode[String(pe.billing_code).trim().toLowerCase()] = pe.job_name;
      }
    });

    // Pick the best candidate project for a given WO + billing code.
    // Preference order:
    //   1. Leaf project whose job matches the billing code's job  (best match)
    //   2. Any leaf project (avoid landing entries on containers)
    //   3. Any project with that WO  (last resort — at least the WO matches)
    function pickProject(woNorm, billingCodeJobName) {
      const candidates = projsByNorm[woNorm];
      if (!candidates || !candidates.length) return null;
      const leaves = candidates.filter(c => !c.has_children);
      const pool = leaves.length ? leaves : candidates;
      if (billingCodeJobName) {
        const wantLc = billingCodeJobName.toLowerCase();
        const jobMatch = pool.find(c => c.job_name && c.job_name.toLowerCase() === wantLc);
        if (jobMatch) return jobMatch;
      }
      return pool[0];
    }

    const today = new Date(); today.setHours(0,0,0,0);
    const past18 = new Date(today); past18.setMonth(past18.getMonth() - 18);

    const validRows = [];
    const unknownStaff = new Map();
    const unknownWOs = new Map();
    const invalidRows = [];

    rows.forEach((r, i) => {
      const rowNum = headerIdx + 2 + i; // 1-indexed display number for the user
      const rawName = r[cols.name];
      const rawDate = r[cols.date];
      const rawWO = r[cols.wo];
      const rawHrs = r[cols.hours];
      const rawTitle = cols.job_title ? r[cols.job_title] : null;
      const rawWeekEnding = cols.week_ending ? r[cols.week_ending] : null;

      // Silently drop rows that are *effectively* empty (no name, no WO, no hours).
      // This handles the separator rows between inspectors and trailing junk.
      const allBlank = !String(rawName ?? '').trim()
        && !String(rawWO ?? '').trim()
        && !String(rawHrs ?? '').trim();
      if (allBlank) return;

      // Anchor year for short-month dates: use Week Ending if available
      let anchorYear = null, anchorDate = null;
      if (rawWeekEnding) {
        const we = parseDateCell(rawWeekEnding);
        if (we) { anchorYear = parseInt(we.split('-')[0], 10); anchorDate = we; }
      }

      const issues = [];
      const name = (rawName || '').toString().trim();
      const date = parseDateCell(rawDate, anchorYear, anchorDate, overrideYear);
      const woNorm = normalizeWO(rawWO);
      const hrs = parseFloat(rawHrs);

      if (!name) issues.push('missing name');
      if (!date) issues.push('invalid or missing date');
      else {
        const d = new Date(date + 'T00:00:00');
        if (d > today) issues.push('date is in the future');
        else if (d < past18) issues.push('date is more than 18 months ago');
      }
      if (!woNorm) issues.push('missing work order');
      if (isNaN(hrs) || hrs <= 0) issues.push('invalid hours');
      if (hrs > 24) issues.push('hours > 24 in a single entry');

      if (issues.length) {
        invalidRows.push({ row_num: rowNum, raw: { name: rawName, date: rawDate, wo: rawWO, hours: rawHrs }, issues });
        return;
      }

      const staff = staffByNorm[normalizeName(name)];
      const staffKnown = !!staff;

      // Resolve job title from row's billing code → row's column → filename inference.
      // Compute this FIRST so we can use the implied job to disambiguate when
      // multiple projects share a WO# (e.g. a parent container + its leaves).
      const rawCode = cols.billing_code ? String(r[cols.billing_code] ?? '').trim() : null;
      const codeLookup = rawCode ? jobByCode[rawCode.toLowerCase()] : null;
      const rowTitle = rawTitle ? String(rawTitle).trim() : null;
      const finalTitle = codeLookup || rowTitle || inferredJobTitle || null;
      const jobSource = codeLookup ? 'billing_code' : (rowTitle ? 'column' : (inferredJobTitle ? 'filename' : null));
      const jobMissing = !finalTitle;

      // Now pick the best project for this WO + billing-code-derived job.
      // Prefers leaves over containers; prefers job-matching leaves when the
      // billing code disambiguates.
      const proj = pickProject(woNorm, codeLookup);
      const woKnown = !!proj;

      if (!staffKnown) unknownStaff.set(normalizeName(name), name);
      if (!woKnown) unknownWOs.set(woNorm, String(rawWO).trim());

      validRows.push({
        row_num: rowNum,
        name, name_norm: normalizeName(name),
        wo: String(rawWO).trim(), wo_norm: woNorm,
        date, hours: hrs,
        job_title: finalTitle,
        job_source: jobSource,
        billing_code: rawCode || null,
        job_missing: jobMissing,
        staff_id: staff?.id || null,
        project_id: proj?.id || null,
        project_name: proj?.name || null,
        project_job_name: proj?.job_name || null,
        staff_known: staffKnown,
        wo_known: woKnown
      });
    });

    // Stage data so /commit doesn't need to re-parse the file
    const stage_id = uuidv4();
    // ── Already-billed-month conflict detection ──
    // For each unique (project_id, year, month) in the staged data, check
    // whether an invoice line item already exists with a matching date.
    // If so, importing more hours into that month risks under/over-billing.
    // We tag the offending rows so the UI can surface a clear warning, but
    // we let the user proceed if they're knowingly correcting something.
    const periodKeys = new Set();
    for (const r of validRows) {
      if (r.project_id && r.date) {
        const [y, mo] = r.date.split('-');
        periodKeys.add(`${r.project_id}|${parseInt(y)}|${parseInt(mo)}`);
      }
    }
    const billedPeriods = new Set();
    if (periodKeys.size > 0) {
      // One-shot lookup: pull all (project_id, year, month) combos with invoices
      const projectIdsInRows = [...new Set(validRows.filter(r => r.project_id).map(r => r.project_id))];
      if (projectIdsInRows.length > 0) {
        const billedR = await pool.query(`
          SELECT DISTINCT ii.project_id,
                 EXTRACT(YEAR FROM inv.invoice_date)::int AS y,
                 EXTRACT(MONTH FROM inv.invoice_date)::int AS mo
          FROM invoice_items ii
          JOIN invoices inv ON inv.id = ii.invoice_id
          WHERE ii.project_id = ANY($1::uuid[])
        `, [projectIdsInRows]);
        billedR.rows.forEach(b => {
          billedPeriods.add(`${b.project_id}|${b.y}|${b.mo}`);
        });
      }
    }
    // Tag rows that hit a billed period
    let billedConflictCount = 0;
    for (const r of validRows) {
      r.already_billed_period = false;
      if (r.project_id && r.date) {
        const [y, mo] = r.date.split('-').map(Number);
        if (billedPeriods.has(`${r.project_id}|${y}|${mo}`)) {
          r.already_billed_period = true;
          billedConflictCount++;
        }
      }
    }

    // ── Would-modify preview ─────────────────────────────────────────────
    // Match each staged row against existing time_entries on the
    // (staff_id, project_id, entry_date) tuple. Classification:
    //   'new'       — no existing row
    //   'duplicate' — exact match on hours + job_title (commit skips)
    //   'modify'    — same key but hours / job_title differ (commit
    //                 still inserts, creating an additional row; the
    //                 operator should review)
    //   'conflict'  — multiple existing rows on the same key (rare;
    //                 surfaces a manual-review case)
    // Only computed for rows with staff_id + project_id + date set;
    // others stay 'new' (the WO/staff resolver will catch them).
    const matchKeys = [];
    for (const r of validRows) {
      if (r.staff_id && r.project_id && r.date) {
        matchKeys.push({ staff_id: r.staff_id, project_id: r.project_id, entry_date: r.date });
        r.match_key = `${r.staff_id}|${r.project_id}|${r.date}`;
      } else {
        r.csv_classification = 'new';
      }
    }
    if (matchKeys.length) {
      // One ANY-style query per CSV — cheaper than N round-trips. We pull
      // every existing row whose (staff_id, project_id, entry_date) tuple
      // appears in the staged set, then bucket in JS.
      const staffArr = matchKeys.map(k => k.staff_id);
      const projArr = matchKeys.map(k => k.project_id);
      const dateArr = matchKeys.map(k => k.entry_date);
      const { rows: existing } = await pool.query(`
        SELECT id, staff_id, project_id, entry_date::text AS entry_date,
               hours::float AS hours, job_title
          FROM time_entries
         WHERE staff_id = ANY($1::uuid[])
           AND project_id = ANY($2::uuid[])
           AND entry_date = ANY($3::date[])
      `, [staffArr, projArr, dateArr]);
      const byKey = new Map();
      for (const e of existing) {
        const k = `${e.staff_id}|${e.project_id}|${e.entry_date}`;
        if (!byKey.has(k)) byKey.set(k, []);
        byKey.get(k).push(e);
      }
      for (const r of validRows) {
        if (r.csv_classification === 'new') continue;
        const matches = byKey.get(r.match_key) || [];
        if (matches.length === 0) {
          r.csv_classification = 'new';
        } else if (matches.length > 1) {
          r.csv_classification = 'conflict';
          r.csv_existing_count = matches.length;
        } else {
          const m = matches[0];
          const sameHours = Math.abs((parseFloat(r.hours) || 0) - (parseFloat(m.hours) || 0)) < 1e-6;
          const sameJob = String(r.job_title || '').trim() === String(m.job_title || '').trim();
          if (sameHours && sameJob) {
            r.csv_classification = 'duplicate';
            r.csv_existing_id = m.id;
          } else {
            r.csv_classification = 'modify';
            r.csv_existing_id = m.id;
            r.csv_existing_hours = m.hours;
            r.csv_existing_job_title = m.job_title || '';
          }
        }
      }
    }
    // Tally for the summary banner.
    const csvClassTally = { new: 0, duplicate: 0, modify: 0, conflict: 0 };
    for (const r of validRows) {
      const c = r.csv_classification || 'new';
      csvClassTally[c] = (csvClassTally[c] || 0) + 1;
    }

    csvStage.set(stage_id, {
      validRows,
      expiresAt: Date.now() + CSV_STAGE_TTL_MS
    });

    res.json({
      stage_id,
      headers,
      detected_columns: cols,
      // Title inference details so the UI can show what was detected and ask
      // for confirmation when nothing was found
      inferred_job_title: inferredJobTitle,
      job_title_source: cols.job_title ? 'column' : (inferredJobTitle ? 'filename' : 'none'),
      rows_missing_job_title: validRows.filter(r => r.job_missing).length,
      summary: {
        total_rows: validRows.length + invalidRows.length,
        ready_to_import: validRows.filter(r => r.staff_known && r.wo_known).length,
        rows_with_unknown_staff: validRows.filter(r => !r.staff_known).length,
        rows_with_unknown_wo: validRows.filter(r => !r.wo_known).length,
        rows_in_billed_periods: billedConflictCount,
        invalid: invalidRows.length,
        // Would-modify preview: how many of the staged rows match an
        // existing time_entry on (staff_id, project_id, entry_date).
        would_add: csvClassTally.new || 0,
        would_skip_duplicate: csvClassTally.duplicate || 0,
        would_modify: csvClassTally.modify || 0,
        would_conflict: csvClassTally.conflict || 0,
      },
      unknown_staff: [...unknownStaff.values()].map(name => ({
        name,
        // similar existing names (helps operator catch typos)
        similar: staffR.rows
          .filter(s => {
            const a = normalizeName(s.name), b = normalizeName(name);
            return a !== b && (a.includes(b.split(' ')[0]) || b.includes(a.split(' ')[0]));
          })
          .map(s => ({ id: s.id, name: s.name }))
          .slice(0, 3)
      })),
      unknown_wos: [...unknownWOs.values()],
      invalid_rows: invalidRows.slice(0, 50), // cap for display
      // Full ledger of every valid row + the importer's predetermined matches.
      // The frontend renders this as an editable table so the user can override
      // anything before the commit. Capped at 500 — typical CSVs are well under this.
      valid_rows: validRows.slice(0, 500),
      valid_rows_total: validRows.length
    });
  } catch (e) {
    console.error('CSV validate error:', e);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ error: e.message });
  }
});

// Commit a previously-validated import. Body shape:
//   {
//     stage_id: string,
//     create_staff: ["Mike Johnson", ...],     // names from unknown_staff to create
//     map_staff: { "mike johnson": "<staff_uuid>", ... }, // OR map them to existing staff
//     skip_unknown_wos: true                   // if false → reject; we always require true here
//   }
// Edit a single staged row before commit. Body: { stage_id, row_num, patch }
// Patch keys: project_id, staff_id, job_title, hours.
// We validate IDs exist; the row's "known" flags get re-evaluated so the
// summary stays consistent.
app.post('/api/hours/csv-edit-row', requireAdmin, async (req, res) => {
  const { stage_id, row_num, patch } = req.body;
  if (!stage_id || !row_num || !patch) return res.status(400).json({ error: 'stage_id, row_num, patch required' });
  const staged = csvStage.get(stage_id);
  if (!staged) return res.status(400).json({ error: 'Staged data expired. Re-validate the file.' });

  const row = staged.validRows.find(r => r.row_num === row_num);
  if (!row) return res.status(404).json({ error: 'Row not found in staged data' });

  try {
    if ('project_id' in patch) {
      if (patch.project_id) {
        const r = await pool.query('SELECT id, name FROM projects WHERE id=$1', [patch.project_id]);
        if (!r.rows[0]) return res.status(400).json({ error: 'Project not found' });
        row.project_id = r.rows[0].id;
        row.project_name = r.rows[0].name;
        row.wo_known = true;
      } else {
        row.project_id = null;
        row.wo_known = false;
      }
    }
    if ('staff_id' in patch) {
      if (patch.staff_id) {
        const r = await pool.query('SELECT id, name FROM staff WHERE id=$1', [patch.staff_id]);
        if (!r.rows[0]) return res.status(400).json({ error: 'Staff not found' });
        row.staff_id = r.rows[0].id;
        row.staff_known = true;
      } else {
        row.staff_id = null;
        row.staff_known = false;
      }
    }
    if ('job_title' in patch) {
      row.job_title = patch.job_title ? String(patch.job_title).trim() : null;
      row.job_source = 'manual';
      row.job_missing = !row.job_title;
    }
    if ('hours' in patch) {
      const h = parseFloat(patch.hours);
      if (isNaN(h) || h <= 0) return res.status(400).json({ error: 'Hours must be a positive number' });
      row.hours = h;
    }

    res.json({ ok: true, row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/hours/csv-commit', requireAdmin, async (req, res) => {
  const {
    stage_id,
    create_staff = [],
    map_staff = {},
    skip_unknown_wos = true,
    apply_job_title = null,
    skip_billed_period_rows = false,
    // NEW (smart importer):
    //   create_projects — array of {wo, name, client_id, job_id, area_label?}
    //     Creates a real project row for each unknown WO, then routes any
    //     row sharing that WO into the new project.
    //   create_jobs — array of {name, billing_type, rate, team}
    //     Creates a job record for each unknown job title. Useful when the
    //     CSV references a job that hasn't been set up in admin yet.
    //   default_client_id — fallback client when create_projects entries
    //     don't supply one (e.g. quick bulk-attach to one client).
    create_projects = [],
    create_jobs = [],
    default_client_id = null,
  } = req.body;
  if (!stage_id) return res.status(400).json({ error: 'Missing stage_id' });
  const staged = csvStage.get(stage_id);
  if (!staged) return res.status(400).json({ error: 'Staged data expired or not found. Re-validate the file.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create requested new staff members (case-insensitive de-dup against existing)
    const existingStaff = await client.query('SELECT id, name FROM staff');
    const staffByNorm = {};
    existingStaff.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s.id; });

    const createdStaff = [];
    for (const rawName of create_staff) {
      const name = String(rawName).trim();
      const norm = normalizeName(name);
      if (!name || staffByNorm[norm]) continue;
      const { rows } = await client.query(
        'INSERT INTO staff (name, active) VALUES ($1, true) ON CONFLICT (name) DO UPDATE SET active=true RETURNING id, name',
        [name]
      );
      staffByNorm[norm] = rows[0].id;
      createdStaff.push(rows[0]);
    }
    // Apply explicit mappings (operator chose "this name = that existing staff record")
    for (const [norm, staffId] of Object.entries(map_staff)) {
      staffByNorm[norm] = staffId;
    }

    // 1b. Create requested new jobs (case-insensitive de-dup against existing).
    // The smart importer surfaces unknown job titles in the review UI; if admin
    // approves "create as new job", that job lands here in create_jobs[].
    const createdJobs = [];
    const newJobsByName = {};
    for (const jdef of create_jobs) {
      const jname = String(jdef.name || '').trim();
      if (!jname) continue;
      const exists = await client.query('SELECT id FROM jobs WHERE LOWER(name) = LOWER($1) LIMIT 1', [jname]);
      if (exists.rows.length) {
        newJobsByName[jname.toLowerCase()] = exists.rows[0].id;
        continue;
      }
      const r = await client.query(
        `INSERT INTO jobs (name, default_billing_type, default_rate, team, active)
         VALUES ($1, $2, $3, $4, TRUE) RETURNING id, name`,
        [jname, jdef.billing_type || 'hourly', jdef.rate || null, jdef.team || null]
      );
      newJobsByName[jname.toLowerCase()] = r.rows[0].id;
      createdJobs.push(r.rows[0]);
    }

    // 1c. Create requested new projects for unknown WOs. Each projDef:
    //     { wo, name, client_id?, job_id?, area_label?, contract_id? }
    // The wo (normalized) becomes the lookup key — any row in the staged
    // data with this WO gets routed into the new project below.
    const createdProjects = [];
    const newProjectsByWO = {};
    for (const pdef of create_projects) {
      const woRaw = String(pdef.wo || '').trim();
      const woNorm = normalizeWO(woRaw);
      if (!woNorm) continue;
      const projName = String(pdef.name || `Project ${woRaw}`).trim();
      const clientId = pdef.client_id || default_client_id;
      if (!clientId) {
        // No client → can't create a project. Skip and report.
        continue;
      }
      // Resolve the job — accept either an existing job_id or a new one we
      // just created above.
      let jobId = pdef.job_id || null;
      if (!jobId && pdef.job_name) {
        jobId = newJobsByName[pdef.job_name.toLowerCase()] || null;
      }
      // Try ensureRollupChain so the new project lands in the right rollup
      // folder. Falls back to no parent_id if it can't.
      let parentId = null;
      try {
        if (typeof app.locals.ensureRollupChain === 'function') {
          parentId = await app.locals.ensureRollupChain({
            client_id: clientId,
            concentrator_id: null,
            service_area_label: pdef.area_label || null,
            job_id: jobId
          });
        }
      } catch(e) { /* ignore — project still creates without rollup */ }

      const r = await client.query(
        `INSERT INTO projects (
           name, client_id, work_order_number, job_id, contract_id,
           parent_id, status, project_type, billing_type, billing_rate
         ) VALUES ($1,$2,$3,$4,$5,$6,'active',$7,$8,$9)
         RETURNING id, name, work_order_number`,
        [projName, clientId, woRaw, jobId, pdef.contract_id || null, parentId,
         pdef.project_type || 'other',
         pdef.billing_type || 'hourly',
         pdef.billing_rate || null]
      );
      newProjectsByWO[woNorm] = r.rows[0].id;
      createdProjects.push(r.rows[0]);
    }

    // Patch staged rows that had unknown WOs but now have a freshly-created
    // project. They become billable for the import below.
    for (const r of staged.validRows) {
      if (!r.wo_known && newProjectsByWO[r.wo_norm]) {
        r.project_id = newProjectsByWO[r.wo_norm];
        r.wo_known = true;
      }
      // Also patch job_title against newly-created jobs if the row referenced one
      if (r.job_title && newJobsByName[r.job_title.toLowerCase()]) {
        // Just confirms the job now exists; job_title text remains as-is on the entry
      }
    }

    // 2. Walk staged rows. Insert ones that have a project_id AND a resolvable staff_id.
    //    Skip rows where WO is unknown (front-end already required acknowledgment).
    //    If skip_billed_period_rows is set, also skip rows that hit an already-billed
    //    month (the user opted to NOT import these to avoid double-billing).
    const importBatch = `csv_import_${Date.now()}`;
    let inserted = 0;
    let skipped_unknown_wo = 0;
    let skipped_unresolved_staff = 0;
    let skipped_billed_period = 0;
    let skipped_duplicate = 0;
    const projectIds = new Set();
    const insertedRows = [];   // collected for post-commit audit logging
    const skipDuplicates = req.body?.skip_duplicates !== false;  // default ON

    for (const r of staged.validRows) {
      if (!r.wo_known) { skipped_unknown_wo++; continue; }
      const staffId = r.staff_id || staffByNorm[r.name_norm] || null;
      if (!staffId) { skipped_unresolved_staff++; continue; }
      if (skip_billed_period_rows && r.already_billed_period) { skipped_billed_period++; continue; }
      // Skip true duplicates (same staff_id+project_id+entry_date AND
      // same hours+job_title). Defaults ON because the alternative is
      // double-counting hours on every re-import. The operator can
      // override by passing skip_duplicates=false in the commit body.
      if (skipDuplicates && r.csv_classification === 'duplicate') {
        skipped_duplicate++;
        continue;
      }

      // Final job title: row's existing value (which may already be inferred
      // from the filename) → operator-supplied apply_job_title → null
      const finalJobTitle = r.job_title || apply_job_title || null;

      const { rows: insRows } = await client.query(
        `INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [r.project_id, staffId, r.date, r.hours, finalJobTitle, importBatch]
      );
      if (insRows[0]) insertedRows.push(insRows[0]);
      inserted++;
      projectIds.add(r.project_id);
    }

    // 3. Roll up actual_hours for affected projects (after commit)
    await client.query('COMMIT');
    csvStage.delete(stage_id);
    for (const pid of projectIds) {
      await updateProjectHours(pid);
    }

    // 4. Audit each insert AFTER the commit so a logging hiccup never
    //    rolls back valid time entries. Source = 'csv' so the audit log
    //    can distinguish CSV imports from manual / portal entries.
    for (const row of insertedRows) {
      try {
        await auditTimeEntry({
          req, timeEntryId: row.id, action: 'created',
          before: null, after: row,
          source: 'csv',
        });
      } catch (auditErr) {
        console.error('[csv-commit:audit]', auditErr && auditErr.message);
      }
    }

    res.json({
      ok: true,
      batch: importBatch,
      inserted,
      skipped_unknown_wo,
      skipped_unresolved_staff,
      skipped_billed_period,
      skipped_duplicate,
      created_staff: createdStaff,
      created_jobs: createdJobs,
      created_projects: createdProjects,
      affected_projects: projectIds.size
    });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('CSV commit error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Project detail drill-down extracted to routes/project_detail.js (Track 1.3).
require('./routes/project_detail')(app, pool, {});


// Permits pipeline + per-project documents + /api/_debug/uploads diagnostic
// extracted to dedicated route modules (Track 1.3).
require('./routes/permits')(app, pool, { upload });
require('./routes/project_documents')(app, pool, { upload, uploadDir: UPLOAD_DIR });


// Admin migration / cleanup endpoints (migrate-nesting, orphan-files,
// adopt-orphan, adopt-orphans-bulk, hours-backfill-preview, hours-backfill)
// extracted to routes/admin.js (Track 1.3).
require('./routes/admin')(app, pool, { requireAdmin, uploadDir: UPLOAD_DIR });


// Budgets + budget_codes + by-area summary extracted to routes/budgets.js (Track 1.3).
require('./routes/budgets')(app, pool, {});

// Potential permits (design-submitted candidates) extracted to
// routes/potential_permits.js (Track 1.3).
require('./routes/potential_permits')(app, pool, {});

// Concentrators / service areas extracted to routes/concentrators.js (Track 1.3).
require('./routes/concentrators')(app, pool, {});

// Dashboard, design pipeline, and inspection (PSC RUS) views extracted to
// dedicated route modules (Track 1.3).
require('./routes/dashboard')(app, pool, { requireAuth });
require('./routes/design_pipeline')(app, pool, {});
require('./routes/inspection')(app, pool, {});


// Revenue endpoints extracted to routes/revenue.js (Track 1.3).
require('./routes/revenue')(app, pool, { requireManagerOrAdmin });


// ─────────────────────────────────────────────────────────────────────────────
// INVOICE MANAGEMENT — extracted to routes/invoices.js (Track 1.3.5).
// ─────────────────────────────────────────────────────────────────────────────
require('./routes/invoices')(app, pool, { requireManagerOrAdmin });

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
require('./routes/reports')(app, pool, {});

// Billing endpoints (bill-multiple, batches, report) extracted to
// routes/billing.js (Track 1.3).
require('./routes/billing')(app, pool, { requireManagerOrAdmin, invoiceGenerator });


// ─────────────────────────────────────────────────────────────────────────────
// AI CHAT — FULL TOOL SUITE
// ─────────────────────────────────────────────────────────────────────────────

async function getDBContext() {
  const [clients, projects, staff, contracts, budgets, concentrators] = await Promise.all([
    pool.query('SELECT id, name, is_rus FROM clients ORDER BY name'),
    pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.miles,
             p.expected_hours, p.expected_revenue, p.actual_hours,
             cl.name as client_name, co.contract_number,
             p.start_date, p.completed_date, p.billed_date, p.notes,
             p.parent_id, pp.name as parent_name,
             p.budget_code_id, bc.code as budget_code_name,
             p.concentrator_id, con.area_name as concentrator_area, con.contract_label as concentrator_contract
      FROM projects p
      LEFT JOIN clients cl ON cl.id=p.client_id
      LEFT JOIN contracts co ON co.id=p.contract_id
      LEFT JOIN projects pp ON pp.id=p.parent_id
      LEFT JOIN budget_codes bc ON bc.id=p.budget_code_id
      LEFT JOIN concentrators con ON con.id=p.concentrator_id
      ORDER BY p.created_at DESC LIMIT 50
    `),
    pool.query('SELECT id, name FROM staff WHERE active=true ORDER BY name'),
    pool.query('SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number'),
    pool.query(`
      SELECT b.id, b.name, b.project_id, b.total_amount, p.name as project_name,
             json_agg(json_build_object(
               'id', bc.id, 'code', bc.code, 'allocated_amount', bc.allocated_amount, 'description', bc.description
             )) FILTER (WHERE bc.id IS NOT NULL) as codes
      FROM budgets b
      LEFT JOIN projects p ON p.id = b.project_id
      LEFT JOIN budget_codes bc ON bc.budget_id = b.id
      GROUP BY b.id, b.name, b.project_id, b.total_amount, p.name
      ORDER BY b.created_at DESC
    `),
    pool.query('SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active=true ORDER BY contract_label, area_name')
  ]);
  return { clients: clients.rows, projects: projects.rows, staff: staff.rows, contracts: contracts.rows, budgets: budgets.rows, concentrators: concentrators.rows };
}

const SYSTEM_PROMPT = `You are the AI project manager for Launch Fiber Services, a fiber optic infrastructure company in Macon, Georgia. You have FULL access to the database through tools. You are smart, proactive, and thorough.

RATE STRUCTURE:
- Inspection: $90/hr (RUS work only, PSC client)
- Resident Engineer (RE): $100/hr (RUS/PSC only)
- Permitting: $90/hr at random 25-30 hrs/mile (0.25 increments), with a 25-hour minimum when the project is under one mile. The hours-per-mile factor is randomized per-project at create time and stored. The "Permitting" job is the standard DOT/County variant ($90/hr). The "Permitting (RR)" job is the railroad variant — uses the same hours calc but with a custom rate the user sets in Settings → Pricing (rate may be NULL until set, in which case expected_revenue is also NULL).
- Design: VARIABLE - always ask for billing rate
- Other: VARIABLE - always ask for billing rate

CLIENTS: PSC, COX, IFT, TRI-CO
The PSC client is the RUS-eligible one (clients.is_rus=TRUE). When a user
says "PSC", "PSC RUS", or "RUS", they mean the PSC client. Always use the
PSC client_id from the database context — never ask to create a "PSC RUS"
client (it would be a duplicate).
RUS work is PSC only. Contracts and work orders are managed manually or through the AI.

BILLING CADENCE: Each project is either "one_time" (default — single invoice when complete; permitting, fixed-fee design jobs) or "monthly" (bills hours every month, project stays active across cycles; typical Inspection contracts). When a one-time project is billed, status becomes 'billed' and it closes. When a monthly project is billed, it stays active and reappears in next month's queue. Inspection-job projects default to monthly. Use set_billing_cadence to flip a project between modes.

PROJECTED REVENUE: Each project may have a projected_revenue (contract value / projected total earnings). For footage projects this is auto-derived from miles × rate. For hourly projects the user enters it manually — it's optional. Containers (parents/grandparents) don't carry their own projected_revenue; their displayed total is summed from descendant LEAVES only (no double counting).

YOUR CAPABILITIES — you can do ALL of the following:
1. CREATE, UPDATE, and DELETE projects (including nested sub-projects)
2. CREATE clients, staff members, and contracts
3. LOG time entries (single or bulk from CSV)
4. MARK projects as billed or change their status
5. ADVANCE permit stages
6. QUERY the database for any information — projects, hours, revenue, etc.
7. Answer questions about project data, billing, revenue, hours

NESTED PROJECTS:
- Projects support UNLIMITED nesting depth. Typical structure: Contract → Area/WO → Job type (inspection, permitting, etc.)
- Example: "RUS 217" → "Contract 4" → "Butler" → "Butler SR74 Permitting"
- Set parent_id to nest under another project at any depth.
- The user does NOT need to specify every level. Be smart:
  - "Add inspection in Butler" → Find Butler in the tree, create a child project under it, auto-set concentrator and WO#.
  - If an intermediate parent doesn't exist yet, offer to create it.
- Hours roll up through the entire chain — a child's hours add to its parent, grandparent, and all the way up.
- In the DATABASE CONTEXT, projects with a parent_name are nested.

BUDGETS:
- Parent projects can have a BUDGET — an external funding source with a name like "RUS 217 Reconnect 3".
- Each budget has BUDGET CODES (job codes) with allocated dollar amounts, e.g. "Inspection: $50,000", "RE: $75,000", "Permitting: $30,000".
- Projects link to a budget_code_id so their billable work draws from that code's allocation.
- When asked to set up a budget, first create the budget (create_budget), then add each code (create_budget_code), then link projects to the appropriate codes (update_project with budget_code_id).
- To see budget utilization, use query_database to join budgets, budget_codes, and projects.
- The "spent" amount for a code = sum of billable work from all projects linked to that code (hourly: actual_hours × billing_rate, footage: expected_revenue).
- If the user uploads a contract document, extract the budget codes and amounts and offer to set them up.
- The DATABASE CONTEXT includes budgets with their codes — use the budget code IDs when linking projects.
- When referencing budgets, always inform the user of per-area spending and remaining budget.

CONCENTRATORS / SERVICE AREAS:
- The DATABASE CONTEXT includes a concentrators list — these are service areas with their WO numbers, grouped by contract.
- Each concentrator has: id, contract_label (e.g. "Contract 3"), area_name (e.g. "Mt. Paran"), work_order_number (e.g. "16316").
- When creating a project, if the user mentions an AREA NAME (like "Mt. Paran", "Butler", "Talbotton", etc.), AUTOMATICALLY look up the matching concentrator and set both:
  1. concentrator_id = the concentrator's UUID
  2. work_order_number = the concentrator's WO number
- Do NOT ask for the WO# if you can match it from the concentrator data. Only ask if you can't find a match.
- Be fuzzy with area matching: "Paran" should match "Mt. Paran", "Crossroads" should match "Crossroad School", "hwy240" should match "HWY 240".
- All concentrator areas draw from the same budget (RUS 217). When discussing budget status, break down spending by area.
- The concentrator list in DATABASE CONTEXT has the exact UUIDs — use those when setting concentrator_id.

HOW TO WORK:
- When the user asks to create/update/delete something, first summarize what you'll do, then ask for confirmation.
- When the user confirms (says yes, ok, correct, go ahead, etc.), IMMEDIATELY call the appropriate tool. Do not say "I'll create it now" — just call the tool.
- Use the DATABASE CONTEXT below to find correct UUIDs for client_id, contract_id, staff_id, and project_id. Match by name when the user refers to things by name.
- If a user mentions a client that doesn't exist, offer to create it.
- If a user mentions a staff member that doesn't exist, offer to create them.
- For permitting projects, always set billing_type to 'footage' and billing_rate to 90. The footage field drives the financial calculation.
- For inspection, set billing_rate to 90 and billing_type to 'hourly'.
- For RE, set billing_rate to 100 and billing_type to 'hourly'.
- For design/other, ASK for the billing rate before creating.

QUERYING DATA:
- You have a query_database tool that can run SELECT queries. Use it to answer questions about projects, hours, revenue, etc.
- NEVER run INSERT, UPDATE, DELETE, DROP, ALTER, or any modifying SQL through query_database. Only SELECT.
- Use the specific action tools (create_project, update_project, etc.) for modifications.
- CRITICAL — ALWAYS USE SQL FOR ARITHMETIC. If the user asks for any sum, count, average, or total ("how many hours did X work", "what's the total revenue this month", "how much has been logged for project Y"), write a SQL query — do NOT add numbers up in your response text. LLMs make arithmetic errors silently; the database does not. Example: NEVER write "5 + 3 + 2 = 11 hours" yourself; instead run 'SELECT SUM(hours) FROM time_entries WHERE ...' and report the result.

HONESTY — NEVER FAKE SUCCESS:
- NEVER claim an action succeeded unless the corresponding tool was actually called AND returned success:true. No exceptions. If you say "I've logged the entries" or "I've created the project," it must be because a tool result confirmed it.
- After any modifying tool call (log_time_entries, create_project, update_project, etc.), look at the tool result. If success:false or there's an error field, report the error to the user honestly — do not paper over it.
- After log_time_entries returns success, IMMEDIATELY run a verification query like:
    SELECT COUNT(*) as cnt, SUM(hours) as total_hours FROM time_entries WHERE import_batch = 'ai_import_<batch_id>'
  and report the verified count and total to the user. This proves the data actually landed and catches any silent failures.

PROJECT LIFECYCLE — completed means READY TO BILL:
- Statuses progress: active → completed → billed. The system treats 'completed' as "work done, awaiting invoice."
- When you mark a project completed (via update_project_status), ALWAYS remind the user it now needs billing and surface the billable amount: hours × rate for hourly, expected_revenue for footage.
- Do NOT skip from active straight to billed. If the user wants to mark something billed, confirm the work is finished first; if it isn't yet completed, walk them through completed → billed.
- When asked "what needs to be billed" or similar, query for projects where status='completed' AND billed_date IS NULL.

WORKFORCE FILE IMPORTS:
When a user uploads an Excel or CSV file with workforce/timesheet data, you must be intelligent about processing it:

1. THE FILE DATA IS STORED SERVER-SIDE. You receive only the upload_id, headers, row count, and 5 sample rows.
   Use the get_upload_data tool to fetch the actual data in batches of 50 rows.
   Start with offset=0, then increment by 50 until has_more is false.

2. ANALYZE THE SAMPLE FIRST: Look at the 5 sample rows to understand the structure before fetching everything.
   Common columns include: employee/name/worker, date, work_order/WO/project, hours, job_title/position/role.

2. MATCH TO EXISTING DATA:
   - Match work order numbers (WO-001, etc.) to existing projects in the DATABASE CONTEXT
   - Match employee names to existing staff members
   - Match client names to existing clients
   - Be fuzzy — "J. Smith" might be "John Smith", "WO 001" might be "WO-001"

3. HANDLE MISSING DATA:
   - If a work order doesn't match any project, tell the user and offer to CREATE the project. Ask what type/rate it should be.
   - If an employee isn't in the system, offer to CREATE them as staff.
   - DATES — the file parser already normalizes date-formatted cells to YYYY-MM-DD. If you still see ambiguous formats (e.g. "3/15/26" as text), normalize them to YYYY-MM-DD using these rules:
     • TODAY'S DATE is provided in the DATABASE CONTEXT block as "_today" — always cross-reference against it.
     • If the year is missing, default to the year of TODAY.
     • If the year is 2-digit, expand using the current century (so "26" → "2026", not "1926").
     • SANITY CHECK every date you produce: if any entry_date is more than 18 months before TODAY or any time in the future, STOP and ask the user to confirm before logging. Don't silently log entries from the wrong year — this has happened before and corrupts monthly revenue.

4. SUMMARIZE BEFORE ACTING: Show the user a clear breakdown:
   - How many entries will be logged
   - Which projects they map to
   - Which employees are involved
   - Any entries that couldn't be matched (and what to do about them)
   - Total hours per project and per employee

5. MAKE INTELLIGENT ASSUMPTIONS:
   - If a column is labeled "Regular Hours" and "OT Hours", combine them or note the overtime
   - If there are multiple date columns, use the most specific one (entry_date over pay_period)
   - If work orders have prefixes like "PSC-" or "RUS-", use that to identify the client
   - If a sheet has subtotals or summary rows, skip them
   - If hours are blank or zero for a row, skip that row
   - Look for patterns: if all work orders start with the same prefix, they likely belong to the same client/contract

6. WAIT FOR CONFIRMATION before calling log_time_entries. Show exactly what will be saved.

7. SMART IMPORT SHORTCUT: For routine timecard imports where the file looks well-formed and you don't need row-by-row reasoning, use the csv_smart_import tool. It runs the same matching the human-facing modal does (fuzzy staff names, WO# resolution, billing-code disambiguation), returns a summary of what was found, and stages the rows for commit. Show the summary to the user and let them confirm in the Hours tab's Import modal — that screen has the per-row review UI so the human stays in control of the final write. Use the manual approach (get_upload_data + analysis + log_time_entries) when the file is unusual, has anomalies you want to call out, or the user has asked for line-by-line oversight.

DATABASE CONTEXT (current data):
{CONTEXT}`;

// ─── TOOL DEFINITIONS ────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    name: 'create_project',
    description: 'Create a new project in the database. Can be a top-level project or a sub-project nested under a parent. Call this ONLY after the user has confirmed the details.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        client_id: { type: 'string', description: 'Client UUID from database context' },
        contract_id: { type: 'string', description: 'Contract UUID (optional, for PSC/RUS)' },
        work_order_number: { type: 'string', description: 'Work order number' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number', description: 'Hourly rate in dollars' },
        footage: { type: 'number', description: 'Linear footage (permitting projects only)' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold'], default: 'active' },
        start_date: { type: 'string', description: 'YYYY-MM-DD format (optional)' },
        notes: { type: 'string' },
        parent_id: { type: 'string', description: 'UUID of parent project to nest this under (optional). Use this to create sub-projects.' },
        budget_code_id: { type: 'string', description: 'UUID of budget code this project bills against (optional). Get from database context budgets.' },
        concentrator_id: { type: 'string', description: 'UUID of the concentrator/service area this project belongs to. Look up from concentrators in database context by area name.' }
      },
      required: ['name', 'client_id', 'project_type', 'billing_type', 'billing_rate']
    }
  },
  {
    name: 'update_project',
    description: 'Update an existing project. Only include the fields that are changing. Can move a project under a parent or make it top-level. Call ONLY after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to update' },
        name: { type: 'string' },
        client_id: { type: 'string' },
        contract_id: { type: 'string' },
        work_order_number: { type: 'string' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number' },
        footage: { type: 'number' },
        start_date: { type: 'string' },
        completed_date: { type: 'string' },
        notes: { type: 'string' },
        parent_id: { type: ['string', 'null'], description: 'UUID of parent project, or null to make it top-level' },
        budget_code_id: { type: ['string', 'null'], description: 'UUID of budget code this project bills against, or null to unlink' },
        concentrator_id: { type: ['string', 'null'], description: 'UUID of concentrator/service area, or null to unlink' },
        billing_cadence: { type: 'string', enum: ['one_time', 'monthly'], description: 'one_time = single invoice when complete (permitting, fixed-fee). monthly = bills hours each month, project stays active across cycles (typical Inspection contracts).' },
        projected_revenue: { type: ['number', 'null'], description: 'Total projected revenue / contract value. Optional. For footage projects this is auto-derived; for hourly projects user enters manually.' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'set_billing_cadence',
    description: 'Quick way to flip a project between one-time and monthly billing. Use when the user says things like "make X a monthly project" or "this should bill each month".',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project' },
        cadence: { type: 'string', enum: ['one_time', 'monthly'] }
      },
      required: ['project_id', 'cadence']
    }
  },
  {
    name: 'delete_project',
    description: 'Delete a single project and all its associated data. Call ONLY after user explicitly confirms deletion.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to delete' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'bulk_delete_projects',
    description: 'Delete MULTIPLE projects in a single approval round. Use when the user asks to mass-delete projects matching a filter or list. Each project is deleted in the same path as delete_project (cleans up time entries, invoice items, billing batch items, permits). Returns a per-id status report. Call ONLY after the user has explicitly confirmed the delete list.',
    input_schema: {
      type: 'object',
      properties: {
        project_ids: { type: 'array', items: { type: 'string' }, description: 'UUIDs of projects to delete' },
        reason: { type: 'string', description: 'Short reason / justification (shown on the approval card)' }
      },
      required: ['project_ids']
    }
  },
  {
    name: 'create_client',
    description: 'Create a new client in the database.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
        is_rus: { type: 'boolean', description: 'Whether this is a RUS client (default false)' },
        notes: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_client',
    description: 'Update an existing client. Only provided fields are changed.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID to update' },
        name: { type: 'string', description: 'New name (optional)' },
        is_rus: { type: 'boolean', description: 'RUS flag (optional)' },
        notes: { type: 'string', description: 'New notes (optional, pass empty string to clear)' }
      },
      required: ['client_id']
    }
  },
  {
    name: 'delete_client',
    description: 'Delete a client. WARNING: this cascade-deletes all the client\'s contracts and projects, which in turn deletes their time entries, invoices, and budgets. Use with care. ALWAYS confirm with the user before calling this.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID to delete' }
      },
      required: ['client_id']
    }
  },
  {
    name: 'create_staff',
    description: 'Create a new staff member.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Staff member full name' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_contract',
    description: 'Create a new contract for a client.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        contract_number: { type: 'string', description: 'Contract number/identifier' },
        name: { type: 'string', description: 'Contract name/description' }
      },
      required: ['client_id', 'contract_number']
    }
  },
  {
    name: 'log_time_entries',
    description: 'Log one or more time entries for projects. Call after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              project_id: { type: 'string' },
              staff_id: { type: 'string' },
              entry_date: { type: 'string', description: 'YYYY-MM-DD format' },
              hours: { type: 'number' },
              job_title: { type: 'string' }
            },
            required: ['project_id', 'entry_date', 'hours']
          }
        }
      },
      required: ['entries']
    }
  },
  {
    name: 'update_project_status',
    description: 'Quick status change for a project: active, completed, on_hold, or billed. For marking billed, also sets billed_date.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] }
      },
      required: ['project_id', 'status']
    }
  },
  {
    name: 'advance_permit_stage',
    description: 'Advance a permitting project to the next stage in the pipeline.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        updated_by: { type: 'string', description: 'Name of person advancing the stage' },
        notes: { type: 'string' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'query_database',
    description: 'Run a read-only SELECT query against the database to look up information. Use this to answer questions about projects, hours, revenue, budgets, staff, etc. ONLY SELECT queries allowed — never INSERT/UPDATE/DELETE/DROP/ALTER.',
    input_schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'A SELECT query to run. Available tables: clients, contracts, staff, projects, time_entries, permit_stages, permit_documents, invoices, invoice_items, budgets, budget_codes, concentrators. Key columns — projects: id, name, client_id, contract_id, work_order_number, project_type, status, billing_type, billing_rate, footage, miles, expected_hours, expected_revenue, actual_hours, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id. budgets: id, project_id, name, total_amount. budget_codes: id, budget_id, code, description, allocated_amount. concentrators: id, contract_label, area_name, work_order_number.' },
        description: { type: 'string', description: 'What you are looking up and why' }
      },
      required: ['sql', 'description']
    }
  },
  {
    name: 'create_budget',
    description: 'Create a budget for a parent project. A budget represents an external funding source (e.g. "RUS 217 Reconnect 3") with allocated amounts per job code.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the parent project this budget is for' },
        name: { type: 'string', description: 'Budget name, e.g. "RUS 217 Reconnect 3"' },
        notes: { type: 'string' }
      },
      required: ['project_id', 'name']
    }
  },
  {
    name: 'create_budget_code',
    description: 'Add a job/contract code to a budget with its allocated dollar amount. Each code represents a category of work that draws from the budget.',
    input_schema: {
      type: 'object',
      properties: {
        budget_id: { type: 'string', description: 'UUID of the budget' },
        code: { type: 'string', description: 'Code name, e.g. "Inspection", "Resident Engineer", "Permitting", "Design"' },
        description: { type: 'string', description: 'Optional description of this code' },
        allocated_amount: { type: 'number', description: 'Dollar amount allocated to this code' }
      },
      required: ['budget_id', 'code', 'allocated_amount']
    }
  },
  {
    name: 'update_budget_code',
    description: 'Update an existing budget code (change allocation amount, name, etc).',
    input_schema: {
      type: 'object',
      properties: {
        budget_code_id: { type: 'string', description: 'UUID of the budget code to update' },
        code: { type: 'string' },
        description: { type: 'string' },
        allocated_amount: { type: 'number' }
      },
      required: ['budget_code_id']
    }
  },
  {
    name: 'get_upload_data',
    description: 'Fetch rows from an uploaded Excel/CSV file. The file is stored server-side by upload_id. Fetch in batches of up to 50 rows at a time. Start with offset 0 and increase by the batch size to page through. Use this to read the actual data after the user uploads a file.',
    input_schema: {
      type: 'object',
      properties: {
        upload_id: { type: 'string', description: 'The upload_id from the uploaded file context' },
        offset: { type: 'number', description: 'Row offset to start from (default 0)', default: 0 },
        limit: { type: 'number', description: 'Number of rows to fetch (default 50, max 100)', default: 50 }
      },
      required: ['upload_id']
    }
  },
  {
    name: 'csv_smart_import',
    description: 'Validate and commit a timecard CSV/Excel file in one go. Auto-creates missing staff, jobs, and projects when sensible defaults can be derived. Use this when the user has uploaded a timesheet and wants the entries posted to time_entries. Returns the same summary the manual review modal shows: what got imported, what was skipped, and what was newly created. If you cannot pick a sensible client_id for unknown WOs, set default_client_id to null and the importer will skip those rows so a human can resolve them later.',
    input_schema: {
      type: 'object',
      properties: {
        upload_id: { type: 'string', description: 'The upload_id of the previously uploaded CSV/XLSX file' },
        default_client_id: { type: 'string', description: 'Fallback client UUID to attach any auto-created projects to. Pass null to skip unknown WOs.' },
        auto_create_unknown_staff: { type: 'boolean', description: 'If true (default), missing staff names are added as new staff records. If false, rows with unknown names are skipped.', default: true },
        auto_create_unknown_wos: { type: 'boolean', description: 'If true, unknown WOs are turned into new projects (requires default_client_id). If false (default), they are skipped.', default: false },
        apply_job_title: { type: 'string', description: 'Optional job title to apply to rows that have no job_title column (e.g. "Inspector").' }
      },
      required: ['upload_id']
    }
  },

  // ─── EXPANDED CAPABILITIES (admin-confirmed) ──────────────────────────────
  // The tools below either operate at higher leverage (bulk) or touch
  // sensitive surface area (users, raw SQL, invoices). Each is gated by the
  // approval mechanism — Claude proposes the action, the admin reviews
  // exactly what will run, and clicks Apply before any DB write happens.
  // See DESTRUCTIVE_TOOLS in the chat handler for which tools require approval.

  {
    name: 'create_engineering_contract',
    description: 'Create an engineering-contract umbrella above one or more billing contracts. Use when the user has a master agreement (e.g. "RUS 217 Engineering Contract GA 1706 -A72") that contains multiple billing contracts (515-3, 515-4, 515-5). The umbrella is where shared budgets attach. After creation, you can attach existing contracts via update_contract_umbrella.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        name: { type: 'string', description: 'Display name (e.g. "RUS 217 Engineering Contract GA 1706 -A72")' },
        contract_number: { type: 'string', description: 'Optional short identifier (e.g. "RUS 217")' },
        notes: { type: 'string', description: 'Optional free-form notes' }
      },
      required: ['client_id', 'name']
    }
  },

  {
    name: 'update_contract_umbrella',
    description: 'Move a billing contract under (or out of) an engineering-contract umbrella. Pass engineering_contract_id=null to detach. Use after create_engineering_contract to wire existing contracts up.',
    input_schema: {
      type: 'object',
      properties: {
        contract_id: { type: 'string', description: 'Billing contract UUID' },
        engineering_contract_id: { type: ['string', 'null'], description: 'Engineering contract UUID, or null to detach' }
      },
      required: ['contract_id']
    }
  },

  {
    name: 'bulk_update_projects',
    description: 'Update one field on many projects matching a filter. High-leverage operation — always preview the affected count first by running query_database before calling this. Filter and patch are both required. Returns rowCount of affected projects.',
    input_schema: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
          description: 'Match conditions. Supported keys: client_id, contract_id, engineering_contract_id, status, project_type. Any combination AND-ed together.',
          properties: {
            client_id: { type: 'string' },
            contract_id: { type: 'string' },
            engineering_contract_id: { type: 'string' },
            status: { type: 'string' },
            project_type: { type: 'string' }
          }
        },
        patch: {
          type: 'object',
          description: 'Fields to set. Supported: status, billing_cadence, notes, billing_rate, contract_id, parent_id.',
          properties: {
            status: { type: 'string', enum: ['active', 'completed', 'billed', 'on_hold'] },
            billing_cadence: { type: 'string', enum: ['one_time', 'monthly'] },
            notes: { type: 'string' },
            billing_rate: { type: ['number', 'null'] },
            contract_id: { type: ['string', 'null'] }
          }
        }
      },
      required: ['filter', 'patch']
    }
  },

  {
    name: 'write_sql',
    description: 'Execute arbitrary SQL (INSERT/UPDATE/DELETE/DDL). Use ONLY when no specific tool exists for the operation — e.g. one-off data migrations, complex multi-table updates. Always preview the impact first via query_database. Single statement only (no semicolons inside the body).',
    input_schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL to execute (single statement, no trailing semicolon)' },
        params: { type: 'array', items: {}, description: 'Parameterized values for $1, $2, ... — strongly preferred over inline values to avoid injection.' }
      },
      required: ['sql']
    }
  },

  {
    name: 'create_user',
    description: 'Create a new user account. Used to onboard new employees so they can log in. Roles: admin, design_manager, permitting_manager, design_engineer, permitting_engineer.',
    input_schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Login name (case-insensitive unique)' },
        password: { type: 'string', description: 'Initial password — minimum 10 characters. Tell the user the value so they can pass it on.' },
        role: { type: 'string', enum: ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'] },
        full_name: { type: 'string', description: 'Display name' },
        email: { type: 'string', description: 'Email (optional)' },
        staff_id: { type: 'string', description: 'Optional staff record UUID to link this user to (required for time clock access)' },
        extra_teams: { type: 'array', items: { type: 'string' }, description: 'Additional teams beyond their primary role: design, permitting, inspection. Empty by default.' }
      },
      required: ['username', 'password', 'role']
    }
  },

  {
    name: 'deactivate_user',
    description: 'Deactivate a user account. Their existing JWTs are immediately invalidated. Reversible by setting active=true via update later.',
    input_schema: {
      type: 'object',
      properties: { user_id: { type: 'string' } },
      required: ['user_id']
    }
  }
];

// ─── TOOL EXECUTION ──────────────────────────────────────────────────────────
async function executeTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'create_project': {
        // Resilient client resolution: if the AI passes a name like "PSC RUS"
        // (a colloquial alias) or "PSC" instead of a UUID, look up the row.
        // The system prompt already disambiguates, but the database context
        // can drift and the failure mode (FK violation → 500 → opaque error
        // bubbled to chat) is bad UX. Aliases match the names users actually
        // say in the wild; case-insensitive comparison.
        let resolvedClientId = toolInput.client_id;
        const _looksLikeUuid = (s) => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
        if (resolvedClientId && !_looksLikeUuid(resolvedClientId)) {
          const _aliasMap = { 'psc rus': 'PSC', 'rus': 'PSC' };
          const _key = String(resolvedClientId).trim().toLowerCase();
          const _canonical = _aliasMap[_key] || resolvedClientId;
          const r0 = await pool.query(
            'SELECT id FROM clients WHERE LOWER(name) = LOWER($1) LIMIT 1', [_canonical]
          );
          if (!r0.rows[0]) {
            return { success: false, error: `Client "${toolInput.client_id}" not found. Use the UUID from database context, not a name.` };
          }
          resolvedClientId = r0.rows[0].id;
        }
        const fin = calcProjectFinancials(toolInput.project_type, toolInput.billing_rate, toolInput.footage);
        const { rows } = await pool.query(`
          INSERT INTO projects (
            name, client_id, contract_id, work_order_number,
            project_type, status, billing_type, billing_rate,
            footage, miles, expected_hours, expected_revenue,
            start_date, notes, parent_id, budget_code_id, concentrator_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          RETURNING *
        `, [
          toolInput.name,
          resolvedClientId,
          toolInput.contract_id || null,
          toolInput.work_order_number || null,
          toolInput.project_type,
          toolInput.status || 'active',
          toolInput.billing_type,
          toolInput.billing_rate,
          toolInput.footage || null,
          fin.miles,
          fin.expectedHours,
          fin.expectedRevenue,
          toolInput.start_date || null,
          toolInput.notes || null,
          toolInput.parent_id || null,
          toolInput.budget_code_id || null,
          toolInput.concentrator_id || null
        ]);
        if (toolInput.project_type === 'permitting') {
          await pool.query(
            'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT (project_id, stage) DO NOTHING',
            [rows[0].id, 'potential']
          );
        }
        return { success: true, project: rows[0] };
      }

      case 'update_project': {
        // First fetch the existing project
        const { rows: existing } = await pool.query('SELECT * FROM projects WHERE id=$1', [toolInput.project_id]);
        if (!existing.length) return { success: false, error: 'Project not found' };
        const p = existing[0];

        // Merge updates with existing values
        const name = toolInput.name ?? p.name;
        const client_id = toolInput.client_id ?? p.client_id;
        const contract_id = toolInput.contract_id ?? p.contract_id;
        const work_order_number = toolInput.work_order_number ?? p.work_order_number;
        const project_type = toolInput.project_type ?? p.project_type;
        const status = toolInput.status ?? p.status;
        const billing_type = toolInput.billing_type ?? p.billing_type;
        const billing_rate = toolInput.billing_rate ?? p.billing_rate;
        const footage = toolInput.footage ?? p.footage;
        const start_date = toolInput.start_date ?? p.start_date;
        const completed_date = toolInput.completed_date ?? p.completed_date;
        const notes = toolInput.notes !== undefined ? toolInput.notes : p.notes;
        const parent_id = toolInput.parent_id !== undefined ? toolInput.parent_id : p.parent_id;
        const budget_code_id = toolInput.budget_code_id !== undefined ? toolInput.budget_code_id : p.budget_code_id;
        const concentrator_id = toolInput.concentrator_id !== undefined ? toolInput.concentrator_id : p.concentrator_id;
        const billing_cadence = toolInput.billing_cadence ?? p.billing_cadence;
        const projected_revenue = toolInput.projected_revenue !== undefined ? toolInput.projected_revenue : p.projected_revenue;

        const fin = calcProjectFinancials(project_type, billing_rate, footage, p.permitting_hours_per_mile);
        const { rows } = await pool.query(`
          UPDATE projects SET
            name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
            project_type=$5, status=$6, billing_type=$7, billing_rate=$8,
            footage=$9, miles=$10, expected_hours=$11, expected_revenue=$12,
            start_date=$13, completed_date=$14, notes=$15, parent_id=$16, budget_code_id=$17, concentrator_id=$18,
            billing_cadence=$19, projected_revenue=$20
          WHERE id=$21 RETURNING *
        `, [
          name, client_id, contract_id, work_order_number,
          project_type, status, billing_type, billing_rate,
          footage, fin.miles, fin.expectedHours, fin.expectedRevenue,
          start_date, completed_date, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
          billing_cadence, projected_revenue,
          toolInput.project_id
        ]);
        return { success: true, project: rows[0] };
      }

      case 'set_billing_cadence': {
        if (!['one_time', 'monthly'].includes(toolInput.cadence)) {
          return { success: false, error: 'cadence must be one_time or monthly' };
        }
        const { rows } = await pool.query(
          `UPDATE projects SET billing_cadence=$1 WHERE id=$2 RETURNING id, name, billing_cadence`,
          [toolInput.cadence, toolInput.project_id]
        );
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, project: rows[0] };
      }

      case 'delete_project': {
        // Match the route-level DELETE /api/projects/:id behavior: pull from
        // pending billing batches first so the FK RESTRICT doesn't block.
        await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [toolInput.project_id]);
        const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [toolInput.project_id]);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, deleted: rows[0].name };
      }

      case 'bulk_delete_projects': {
        const ids = Array.isArray(toolInput.project_ids) ? toolInput.project_ids : [];
        if (!ids.length) return { success: false, error: 'No project_ids provided' };
        const results = [];
        const deleted = [];
        const failed = [];
        // Best-effort per-id deletion — keep going on individual failures so the
        // user gets a complete status report. Each success removes batch items
        // first (RESTRICT FK) before the project row itself. We don't wrap the
        // whole thing in a transaction: AI mass-deletes are typically across
        // unrelated projects, and failing all because one had children would
        // be more frustrating than skipping the bad one.
        for (const id of ids) {
          try {
            await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [id]);
            const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [id]);
            if (rows.length) {
              deleted.push({ id, name: rows[0].name });
              results.push({ id, status: 'deleted', name: rows[0].name });
            } else {
              failed.push({ id, error: 'not found' });
              results.push({ id, status: 'not_found' });
            }
          } catch (e) {
            // Common cases: child projects (RESTRICT on parent_id), time
            // entries (RESTRICT on project_id), or a confirmed billing batch
            // we couldn't clear.
            failed.push({ id, error: e.message });
            results.push({ id, status: 'failed', error: e.message });
          }
        }
        return {
          success: failed.length === 0,
          deleted_count: deleted.length,
          failed_count: failed.length,
          results,
          reason: toolInput.reason || null,
        };
      }

      case 'create_client': {
        const { rows } = await pool.query(
          'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.name, toolInput.is_rus || false, toolInput.notes || null]
        );
        return { success: true, client: rows[0] };
      }

      case 'update_client': {
        // COALESCE pattern so undefined fields don't overwrite existing values
        const { rows } = await pool.query(
          `UPDATE clients SET
            name = COALESCE($2, name),
            is_rus = COALESCE($3, is_rus),
            notes = CASE WHEN $4::text IS NULL THEN notes ELSE $4 END
          WHERE id = $1 RETURNING *`,
          [
            toolInput.client_id,
            toolInput.name === undefined ? null : toolInput.name,
            toolInput.is_rus === undefined ? null : toolInput.is_rus,
            toolInput.notes === undefined ? null : toolInput.notes
          ]
        );
        if (!rows[0]) return { success: false, error: 'Client not found' };
        return { success: true, client: rows[0] };
      }

      case 'delete_client': {
        // Confirm we found it first so the AI can give a meaningful response
        const r0 = await pool.query('SELECT name FROM clients WHERE id = $1', [toolInput.client_id]);
        if (!r0.rows[0]) return { success: false, error: 'Client not found' };
        await pool.query('DELETE FROM clients WHERE id = $1', [toolInput.client_id]);
        return { success: true, deleted_name: r0.rows[0].name };
      }

      case 'create_staff': {
        const { rows } = await pool.query(
          'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *',
          [toolInput.name]
        );
        return { success: true, staff: rows[0] };
      }

      case 'create_contract': {
        const { rows } = await pool.query(
          'INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.client_id, toolInput.contract_number, toolInput.name || null]
        );
        return { success: true, contract: rows[0] };
      }

      case 'log_time_entries': {
        const importBatch = `ai_import_${Date.now()}`;
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          let count = 0;
          for (const e of toolInput.entries) {
            await client.query(
              'INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch) VALUES ($1,$2,$3,$4,$5,$6)',
              [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title || null, importBatch]
            );
            count++;
          }
          // Update actual_hours with hierarchy rollup
          const projectIds = [...new Set(toolInput.entries.map(e => e.project_id))];
          await client.query('COMMIT');
          for (const pid of projectIds) {
            await updateProjectHours(pid);
          }
          return { success: true, inserted: count, batch: importBatch };
        } catch (err) {
          await client.query('ROLLBACK');
          return { success: false, error: 'Bulk insert failed and was rolled back: ' + err.message };
        } finally {
          client.release();
        }
      }

      case 'update_project_status': {
        let query, params;
        if (toolInput.status === 'billed') {
          query = `UPDATE projects SET status='billed', billed_date=NOW() WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else if (toolInput.status === 'completed') {
          query = `UPDATE projects SET status='completed', completed_date=COALESCE(completed_date, NOW()) WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else {
          query = `UPDATE projects SET status=$1 WHERE id=$2 RETURNING name, status`;
          params = [toolInput.status, toolInput.project_id];
        }
        const { rows } = await pool.query(query, params);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, project: rows[0] };
      }

      case 'advance_permit_stage': {
        const STAGES = ['potential','started','submitted','approved','checklist','billed'];
        const { rows: current } = await pool.query(
          'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
          [toolInput.project_id]
        );
        const currentStage = current[0]?.stage || 'potential';
        const nextIdx = STAGES.indexOf(currentStage) + 1;
        if (nextIdx >= STAGES.length) return { success: false, message: 'Already at final stage' };
        const nextStage = STAGES[nextIdx];
        await pool.query(
          'UPDATE permit_stages SET completed_at=NOW(), updated_by=$1, notes=$2 WHERE project_id=$3 AND stage=$4',
          [toolInput.updated_by || 'AI', toolInput.notes || null, toolInput.project_id, currentStage]
        );
        await pool.query(
          'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
          [toolInput.project_id, nextStage, toolInput.updated_by || 'AI']
        );
        return { success: true, previous: currentStage, current: nextStage };
      }

      case 'query_database': {
        // Safety in depth:
        //   1. Disallow multi-statement strings (semicolons inside the body) —
        //      these can sneak DML past keyword regex via `SELECT 1; DELETE …`.
        //   2. Require the first keyword to be SELECT or WITH.
        //   3. Run inside a READ ONLY transaction so even writable CTEs
        //      (`WITH x AS (DELETE … RETURNING *) SELECT …`) get rejected by
        //      Postgres itself, not just by our regex.
        //   4. Cap result set to 100 rows.
        const sqlClean = toolInput.sql.trim().replace(/;+\s*$/, '');
        if (sqlClean.includes(';')) {
          return { success: false, error: 'Multiple statements are not allowed. Submit one SELECT at a time.' };
        }
        const firstWord = sqlClean.split(/\s+/)[0].toUpperCase();
        if (firstWord !== 'SELECT' && firstWord !== 'WITH') {
          return { success: false, error: 'Only SELECT/WITH queries are allowed. Use the specific action tools for modifications.' };
        }
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query('SET TRANSACTION READ ONLY');
          const { rows } = await client.query(sqlClean);
          await client.query('COMMIT');
          return { success: true, row_count: rows.length, rows: rows.slice(0, 100) };
        } catch (e) {
          try { await client.query('ROLLBACK'); } catch {}
          // Postgres returns a clear error if the read-only transaction caught
          // a write attempt; surface it to the AI for self-correction.
          return { success: false, error: 'Query failed: ' + e.message };
        } finally {
          client.release();
        }
      }

      case 'create_budget': {
        const { rows } = await pool.query(
          `INSERT INTO budgets (project_id, name, notes) VALUES ($1,$2,$3) RETURNING *`,
          [toolInput.project_id, toolInput.name, toolInput.notes || null]
        );
        return { success: true, budget: rows[0] };
      }

      case 'create_budget_code': {
        const { rows } = await pool.query(
          `INSERT INTO budget_codes (budget_id, code, description, allocated_amount) VALUES ($1,$2,$3,$4) RETURNING *`,
          [toolInput.budget_id, toolInput.code, toolInput.description || null, toolInput.allocated_amount || 0]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [toolInput.budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'update_budget_code': {
        const { rows: existing } = await pool.query('SELECT * FROM budget_codes WHERE id=$1', [toolInput.budget_code_id]);
        if (!existing.length) return { success: false, error: 'Budget code not found' };
        const bc = existing[0];
        const code = toolInput.code ?? bc.code;
        const description = toolInput.description !== undefined ? toolInput.description : bc.description;
        const allocated_amount = toolInput.allocated_amount ?? bc.allocated_amount;
        const { rows } = await pool.query(
          `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3 WHERE id=$4 RETURNING *`,
          [code, description, allocated_amount, toolInput.budget_code_id]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [rows[0].budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'get_upload_data': {
        const data = uploadStore.get(toolInput.upload_id);
        if (!data) return { success: false, error: 'Upload expired or not found. Ask the user to re-upload.' };
        if (data.raw_text) return { success: true, raw_text: data.raw_text, row_count: 0 };

        const offset = toolInput.offset || 0;
        const limit = Math.min(toolInput.limit || 50, 100);
        const slice = data.rows.slice(offset, offset + limit);

        return {
          success: true,
          filename: data.filename,
          headers: data.headers,
          total_rows: data.rows.length,
          offset,
          returned: slice.length,
          has_more: offset + limit < data.rows.length,
          rows: slice
        };
      }

      case 'csv_smart_import': {
        // Wraps the existing csv-validate + csv-commit flow into a single call
        // for the AI. We rebuild the staged data from the upload store, run
        // the same matching logic the manual UI uses, then commit.
        const upload = uploadStore.get(toolInput.upload_id);
        if (!upload) return { success: false, error: 'Upload expired or not found. Ask the user to re-upload.' };
        if (!upload.rows || !upload.rows.length) {
          return { success: false, error: 'No rows in the upload. The file may be empty or unreadable.' };
        }

        try {
          // Re-detect columns from the headers using the same logic csv-validate uses.
          // We construct a minimal 2D array (header row + data rows) so detectColumns
          // and the matching code can operate on the same shape.
          const cols = detectColumns(upload.headers || []);
          const missing = [];
          if (!cols.name) missing.push('name/employee/inspector');
          if (!cols.date) missing.push('date');
          if (!cols.wo) missing.push('work_order');
          if (!cols.hours) missing.push('hours');
          if (missing.length) {
            return {
              success: false,
              error: 'Missing required columns: ' + missing.join(', '),
              detected_columns: cols,
              headers: upload.headers
            };
          }

          // Look up reference data
          const [staffR, projR, pricingR] = await Promise.all([
            pool.query('SELECT id, name FROM staff'),
            pool.query(`
              SELECT p.id, p.name, p.work_order_number, p.job_id, p.parent_id,
                     j.name as job_name,
                     EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id) AS has_children
              FROM projects p
              LEFT JOIN jobs j ON j.id = p.job_id
              WHERE p.work_order_number IS NOT NULL AND p.work_order_number != ''
            `),
            pool.query(`SELECT pe.billing_code, j.name as job_name
                        FROM pricing_entries pe LEFT JOIN jobs j ON j.id = pe.job_id
                        WHERE pe.billing_code IS NOT NULL`)
          ]);
          const staffByNorm = {};
          staffR.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s; });
          const projsByNorm = {};
          projR.rows.forEach(p => {
            const k = normalizeWO(p.work_order_number);
            (projsByNorm[k] = projsByNorm[k] || []).push(p);
          });
          const jobByCode = {};
          pricingR.rows.forEach(pe => {
            if (pe.billing_code && pe.job_name) jobByCode[String(pe.billing_code).trim().toLowerCase()] = pe.job_name;
          });

          function pickProject(woNorm, billingCodeJobName) {
            const candidates = projsByNorm[woNorm];
            if (!candidates || !candidates.length) return null;
            const leaves = candidates.filter(c => !c.has_children);
            const pickFrom = leaves.length ? leaves : candidates;
            if (billingCodeJobName) {
              const wantLc = billingCodeJobName.toLowerCase();
              const jobMatch = pickFrom.find(c => c.job_name && c.job_name.toLowerCase() === wantLc);
              if (jobMatch) return jobMatch;
            }
            return pickFrom[0];
          }

          // Walk the upload rows
          const today = new Date(); today.setHours(0,0,0,0);
          const past18 = new Date(today); past18.setMonth(past18.getMonth() - 18);
          const validRows = [];
          const unknownStaff = new Map();
          const unknownWOs = new Map();
          const invalidRows = [];

          upload.rows.forEach((r, i) => {
            const rowNum = i + 2;
            const rawName = r[cols.name];
            const rawDate = r[cols.date];
            const rawWO   = r[cols.wo];
            const rawHrs  = r[cols.hours];
            const rawTitle = cols.job_title ? r[cols.job_title] : null;

            const allBlank = !String(rawName ?? '').trim() && !String(rawWO ?? '').trim() && !String(rawHrs ?? '').trim();
            if (allBlank) return;

            const issues = [];
            const name = (rawName || '').toString().trim();
            const date = parseDateCell(rawDate);
            const woNorm = normalizeWO(rawWO);
            const hrs = parseFloat(rawHrs);

            if (!name) issues.push('missing name');
            if (!date) issues.push('invalid date');
            else {
              const d = new Date(date + 'T00:00:00');
              if (d > today) issues.push('date in future');
              else if (d < past18) issues.push('date > 18 months ago');
            }
            if (!woNorm) issues.push('missing work order');
            if (isNaN(hrs) || hrs <= 0) issues.push('invalid hours');
            if (hrs > 24) issues.push('hours > 24');

            if (issues.length) {
              invalidRows.push({ row_num: rowNum, raw: { name: rawName, date: rawDate, wo: rawWO, hours: rawHrs }, issues });
              return;
            }

            const staff = staffByNorm[normalizeName(name)];
            const rawCode = cols.billing_code ? String(r[cols.billing_code] ?? '').trim() : null;
            const codeLookup = rawCode ? jobByCode[rawCode.toLowerCase()] : null;
            const proj = pickProject(woNorm, codeLookup);

            if (!staff) unknownStaff.set(normalizeName(name), name);
            if (!proj)  unknownWOs.set(woNorm, String(rawWO).trim());

            validRows.push({
              row_num: rowNum,
              name, name_norm: normalizeName(name),
              wo: String(rawWO).trim(), wo_norm: woNorm,
              date, hours: hrs,
              job_title: rawTitle ? String(rawTitle).trim() : (toolInput.apply_job_title || null),
              billing_code: rawCode || null,
              staff_id: staff?.id || null,
              project_id: proj?.id || null,
              staff_known: !!staff,
              wo_known: !!proj,
              already_billed_period: false
            });
          });

          // Build the commit payload based on the AI's choices
          const create_staff = toolInput.auto_create_unknown_staff !== false
            ? [...unknownStaff.values()]
            : [];
          const create_projects = (toolInput.auto_create_unknown_wos === true && toolInput.default_client_id)
            ? [...unknownWOs.entries()].map(([norm, wo]) => ({
                wo, name: `WO ${wo}`, client_id: toolInput.default_client_id
              }))
            : [];

          // Stage and commit by inlining the same logic as the manual modal:
          const stage_id = `ai_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          csvStage.set(stage_id, { validRows, expiresAt: Date.now() + CSV_STAGE_TTL_MS });

          // Now invoke the same commit handler programmatically. We can't call
          // it directly (it's an HTTP handler), so we mimic its body in-line.
          // Simpler: just return a summary + the stage_id and let the AI tell
          // the user to confirm in the UI. This avoids duplicating commit
          // logic and keeps human-in-the-loop for the actual write.
          return {
            success: true,
            stage_id,
            summary: {
              total_valid: validRows.length,
              ready_to_import: validRows.filter(r => r.staff_known && r.wo_known).length,
              unknown_staff: [...unknownStaff.values()],
              unknown_wos: [...unknownWOs.values()],
              invalid_count: invalidRows.length,
              invalid_examples: invalidRows.slice(0, 5)
            },
            recommended_actions: {
              auto_create_staff: create_staff,
              auto_create_projects: create_projects
            },
            note: 'A human should review this in the Hours → Import modal before final commit. The stage_id is valid for 30 minutes.'
          };
        } catch (e) {
          return { success: false, error: 'CSV processing failed: ' + e.message };
        }
      }

      // ─── EXPANDED TOOLS ─────────────────────────────────────────────
      case 'create_engineering_contract': {
        const { client_id, name, contract_number, notes } = toolInput;
        if (!client_id || !name) return { success: false, error: 'client_id and name required' };
        try {
          const { rows } = await pool.query(
            `INSERT INTO engineering_contracts (client_id, name, contract_number, notes)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [client_id, String(name).trim(), contract_number || null, notes || null]
          );
          return { success: true, engineering_contract: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'Engineering contract with this name already exists for this client' };
          return { success: false, error: e.message };
        }
      }

      case 'update_contract_umbrella': {
        const { contract_id, engineering_contract_id } = toolInput;
        if (!contract_id) return { success: false, error: 'contract_id required' };
        const { rows } = await pool.query(
          `UPDATE contracts SET engineering_contract_id = $1 WHERE id = $2 RETURNING *`,
          [engineering_contract_id || null, contract_id]
        );
        if (!rows[0]) return { success: false, error: 'Contract not found' };
        return { success: true, contract: rows[0] };
      }

      case 'bulk_update_projects': {
        const { filter, patch } = toolInput;
        if (!filter || !patch) return { success: false, error: 'filter and patch both required' };

        // Build WHERE — only allow known filter keys, parameterize values
        const ALLOWED_FILTER = new Set(['client_id', 'contract_id', 'engineering_contract_id', 'status', 'project_type']);
        const where = [];
        const params = [];
        let i = 1;
        for (const [k, v] of Object.entries(filter)) {
          if (!ALLOWED_FILTER.has(k)) continue;
          if (k === 'engineering_contract_id') {
            // No direct column on projects; resolve via contracts
            where.push(`contract_id IN (SELECT id FROM contracts WHERE engineering_contract_id = $${i++})`);
            params.push(v);
          } else {
            where.push(`${k} = $${i++}`); params.push(v);
          }
        }
        if (!where.length) return { success: false, error: 'At least one filter key required' };

        // Build SET — only allow known patch keys
        const ALLOWED_PATCH = new Set(['status', 'billing_cadence', 'notes', 'billing_rate', 'contract_id', 'parent_id']);
        const sets = [];
        for (const [k, v] of Object.entries(patch)) {
          if (!ALLOWED_PATCH.has(k)) continue;
          sets.push(`${k} = $${i++}`); params.push(v);
        }
        if (!sets.length) return { success: false, error: 'At least one patch field required' };
        sets.push(`updated_at = NOW()`);

        const sql = `UPDATE projects SET ${sets.join(', ')} WHERE ${where.join(' AND ')} RETURNING id`;
        const { rows } = await pool.query(sql, params);
        return { success: true, updated_count: rows.length, ids: rows.map(r => r.id) };
      }

      case 'write_sql': {
        // Arbitrary write SQL — gated by approval (the chat handler stages
        // this tool before executing). We still enforce single-statement
        // here as a defense-in-depth measure: even with admin approval, a
        // multi-statement string that includes a stray DROP slipped past
        // the human reviewer's eye should fail closed.
        const sql = String(toolInput.sql || '').trim().replace(/;+\s*$/, '');
        const params = Array.isArray(toolInput.params) ? toolInput.params : [];
        if (!sql) return { success: false, error: 'sql required' };
        if (sql.includes(';')) return { success: false, error: 'Multiple statements not allowed in a single write_sql call.' };
        try {
          const result = await pool.query(sql, params);
          return {
            success: true,
            command: result.command,
            row_count: result.rowCount,
            // Return up to 100 rows for the AI to confirm what changed
            rows: (result.rows || []).slice(0, 100),
          };
        } catch (e) { return { success: false, error: e.message }; }
      }

      case 'create_user': {
        const bcrypt = require('bcryptjs');
        const { username, password, role, full_name, email, staff_id, extra_teams } = toolInput;
        if (!username || !password || !role) return { success: false, error: 'username, password, role required' };
        if (password.length < 10) return { success: false, error: 'Password must be at least 10 characters' };
        const VALID_ROLES = ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'];
        if (!VALID_ROLES.includes(role)) return { success: false, error: 'Invalid role' };
        const team = role.startsWith('design_') ? 'design'
                   : role.startsWith('permitting_') ? 'permitting'
                   : role.startsWith('inspection_') ? 'inspection'
                   : null;
        const cleanExtras = Array.isArray(extra_teams)
          ? extra_teams.filter(t => ['design', 'permitting', 'inspection'].includes(t))
          : [];
        try {
          const hash = await bcrypt.hash(password, 12);
          const { rows } = await pool.query(
            `INSERT INTO users (username, password_hash, role, team, full_name, email, extra_teams, staff_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING id, username, role, team, full_name, email, staff_id, extra_teams, active, created_at`,
            [String(username).trim(), hash, role, team, full_name || null, email || null, cleanExtras, staff_id || null]
          );
          return { success: true, user: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'Username already taken' };
          return { success: false, error: e.message };
        }
      }

      case 'deactivate_user': {
        const { user_id } = toolInput;
        if (!user_id) return { success: false, error: 'user_id required' };
        const { rows } = await pool.query(
          `UPDATE users SET active = FALSE, tokens_invalid_after = NOW(), updated_at = NOW()
           WHERE id = $1 RETURNING id, username, active`,
          [user_id]
        );
        if (!rows[0]) return { success: false, error: 'User not found' };
        return { success: true, user: rows[0] };
      }

      default:
        return { success: false, error: 'Unknown tool: ' + toolName };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── AI APPROVAL GATE ─────────────────────────────────────────────────────
// The set of tool names that REQUIRE explicit admin approval before they
// run. Read-only tools (query_database, get_upload_data) execute
// immediately; everything that mutates state pauses the chat loop, returns
// a "preview" payload to the frontend, and waits for the admin to click
// Apply on each proposed action.
const DESTRUCTIVE_AI_TOOLS = new Set([
  'create_project', 'update_project', 'delete_project', 'bulk_delete_projects', 'update_project_status',
  'log_time_entries',
  'create_client', 'update_client', 'delete_client',
  'create_staff', 'create_contract', 'update_contract_umbrella',
  'create_budget', 'create_budget_code', 'update_budget_code',
  'set_billing_cadence',
  'advance_permit_stage',
  'csv_smart_import',
  'create_engineering_contract',
  'bulk_update_projects',
  'write_sql',
  'create_user', 'deactivate_user',
]);

// In-process pending-approval store. Each entry holds the conversation
// state needed to resume the chat after the user approves/rejects the
// staged actions. Single-instance only — for multi-instance deploys this
// would need to move to Postgres.
const _pendingApprovals = new Map();
const APPROVAL_TTL_MS = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _pendingApprovals) {
    if (v.expires_at < now) _pendingApprovals.delete(k);
  }
}, 5 * 60 * 1000).unref();

// Build a one-line human summary of a tool call so the approval UI doesn't
// have to render raw JSON. The chat frontend can still show the full input
// on demand.
function summarizeToolCall(toolName, toolInput) {
  const i = toolInput || {};
  switch (toolName) {
    case 'create_project':            return `Create project "${i.name}"`;
    case 'update_project':            return `Update project ${i.project_id}`;
    case 'delete_project':            return `Delete project ${i.project_id}`;
    case 'bulk_delete_projects':      return `BULK DELETE ${(i.project_ids || []).length} project${(i.project_ids || []).length === 1 ? '' : 's'}${i.reason ? ` — ${i.reason}` : ''}`;
    case 'update_project_status':     return `Set project ${i.project_id} status → "${i.status}"`;
    case 'log_time_entries':          return `Log ${(i.entries || []).length} time entries`;
    case 'create_client':             return `Create client "${i.name}"`;
    case 'update_client':             return `Update client ${i.client_id}`;
    case 'delete_client':             return `Delete client ${i.client_id}`;
    case 'create_staff':              return `Create staff "${i.name}"`;
    case 'create_contract':           return `Create contract "${i.contract_number}" for client ${i.client_id}`;
    case 'update_contract_umbrella':  return `Move contract ${i.contract_id} → engineering_contract ${i.engineering_contract_id || '(detach)'}`;
    case 'create_budget':             return `Create budget "${i.name}" on project ${i.project_id}`;
    case 'create_budget_code':        return `Add code "${i.code}" ($${i.allocated_amount || 0}) to budget ${i.budget_id}`;
    case 'update_budget_code':        return `Update budget code ${i.budget_code_id}`;
    case 'set_billing_cadence':       return `Set billing cadence on project ${i.project_id} → "${i.cadence}"`;
    case 'advance_permit_stage':      return `Advance permit stage on project ${i.project_id}`;
    case 'csv_smart_import':          return `Smart-import CSV upload ${i.upload_id}`;
    case 'create_engineering_contract': return `Create engineering contract "${i.name}"`;
    case 'bulk_update_projects':      return `BULK update projects matching ${JSON.stringify(i.filter)} → ${JSON.stringify(i.patch)}`;
    case 'write_sql':                 return `EXECUTE SQL: ${String(i.sql || '').slice(0, 200)}${(i.sql || '').length > 200 ? '…' : ''}`;
    case 'create_user':               return `Create user "${i.username}" with role ${i.role}`;
    case 'deactivate_user':           return `Deactivate user ${i.user_id}`;
    default:                          return toolName;
  }
}

// ─── FILE UPLOAD FOR AI ──────────────────────────────────────────────────────
// ─── IN-MEMORY UPLOAD STORE ──────────────────────────────────────────────────
const uploadStore = new Map(); // uploadId → { rows, headers, filename, timestamp }
// Clean up old uploads every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, data] of uploadStore) {
    if (data.timestamp < cutoff) uploadStore.delete(id);
  }
}, 5 * 60 * 1000);

app.post('/api/ai/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];
    let headers = [];

    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        // raw:false + dateNF forces date-formatted cells into a YYYY-MM-DD string
        // so the AI sees unambiguous dates instead of Excel serial numbers
        // or short-year strings like "3/15/26".
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        if (jsonData.length > 0 && rows.length === 0) {
          rows = jsonData;
          headers = Object.keys(jsonData[0] || {});
        }
      }

    } else if (ext === '.csv' || ext === '.tsv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const workbook = XLSX.read(content, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
      headers = Object.keys(rows[0] || {});

    } else {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const uploadId = uuidv4();
      uploadStore.set(uploadId, { raw_text: content.substring(0, 50000), filename: req.file.originalname, timestamp: Date.now() });
      fs.unlink(req.file.path, () => {});
      return res.json({ success: true, upload_id: uploadId, filename: req.file.originalname, raw_text: content.substring(0, 2000) });
    }

    // Store full data server-side, send only summary to client
    const uploadId = uuidv4();
    uploadStore.set(uploadId, { rows, headers, filename: req.file.originalname, timestamp: Date.now() });

    fs.unlink(req.file.path, () => {});

    res.json({
      success: true,
      upload_id: uploadId,
      filename: req.file.originalname,
      headers,
      row_count: rows.length,
      preview: rows.slice(0, 5) // Only 5 sample rows sent to client
    });

  } catch (e) {
    console.error('File parse error:', e.message);
    res.status(500).json({ error: 'Failed to parse file: ' + e.message });
  }
});

// AI fetches rows in batches from stored upload
app.get('/api/ai/upload/:id', requireAdmin, async (req, res) => {
  const data = uploadStore.get(req.params.id);
  if (!data) return res.status(404).json({ error: 'Upload expired or not found' });
  if (data.raw_text) return res.json({ rows: [], raw_text: data.raw_text, row_count: 0 });

  const offset = parseInt(req.query.offset) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 rows per batch
  const slice = data.rows.slice(offset, offset + limit);

  res.json({
    filename: data.filename,
    headers: data.headers,
    total_rows: data.rows.length,
    offset,
    limit,
    returned: slice.length,
    has_more: offset + limit < data.rows.length,
    rows: slice
  });
});

// ─── AI CHAT ENDPOINT ────────────────────────────────────────────────────────
//
// Two entry shapes:
//   1. Initial chat: body = { messages, session_id }
//   2. Resume from approval: body = { approval_id, decisions: { tool_use_id: bool } }
//
// Both end up running the same loop. When Claude proposes any DESTRUCTIVE
// tool, the loop pauses, stages the proposed actions in _pendingApprovals,
// and returns a "pending_approval" response. The frontend renders the
// proposed actions, the admin approves/rejects each one, and posts the
// decisions back via the same endpoint with approval_id. Approved actions
// run, rejected ones come back as "user declined" tool_results, and the
// loop continues (which may produce more text, more tool calls, or another
// approval round).
app.post('/api/ai/chat', requireAdmin, async (req, res) => {
  const { messages, session_id, approval_id, decisions } = req.body || {};

  let conversationMessages;
  let systemBlocks;
  let cachedTools;
  let toolResults = [];
  let finalText = '';

  try {
    if (approval_id) {
      // ── Resume path ─────────────────────────────────────────────────
      const pending = _pendingApprovals.get(approval_id);
      if (!pending) return res.status(404).json({ error: 'Approval expired or not found. Resend your message.' });
      _pendingApprovals.delete(approval_id);

      systemBlocks = pending.systemBlocks;
      cachedTools = pending.cachedTools;
      conversationMessages = pending.conversationMessages;  // up to and including the assistant tool_use turn
      toolResults = pending.toolResults || [];
      finalText = pending.finalText || '';

      // Build tool_results for the staged tool_use blocks based on user
      // decisions. Approved → execute; rejected → synthesize "declined".
      const stagedToolUses = pending.stagedToolUses;
      const decisionsMap = decisions || {};
      const toolResultContents = [];
      for (const tu of stagedToolUses) {
        const approved = !!decisionsMap[tu.id];
        let result;
        if (approved) {
          console.log(`AI APPROVED tool: ${tu.name}`, JSON.stringify(tu.input).substring(0, 200));
          result = await executeTool(tu.name, tu.input);
        } else {
          result = { success: false, error: 'User declined this action.', user_declined: true };
        }
        toolResults.push({ tool: tu.name, input: tu.input, result, was_approved: approved });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });
      }
      conversationMessages.push({ role: 'user', content: toolResultContents });
    } else {
      // ── Initial path ────────────────────────────────────────────────
      if (!messages || !messages.length) return res.status(400).json({ error: 'No messages' });

      const ctx = await getDBContext();
      ctx._today = new Date().toISOString().split('T')[0];
      const [staticPromptPart] = SYSTEM_PROMPT.split('{CONTEXT}');
      systemBlocks = [
        { type: 'text', text: staticPromptPart, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: JSON.stringify(ctx, null, 2), cache_control: { type: 'ephemeral' } },
      ];
      cachedTools = AI_TOOLS.map((t, i) =>
        i === AI_TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t
      );
      conversationMessages = messages.map(m => ({ role: m.role, content: m.content }));
    }

    // ── Main loop ─────────────────────────────────────────────────────
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemBlocks,
      tools: cachedTools,
      tool_choice: { type: 'auto' },
      messages: conversationMessages,
    });

    let iterations = 0;
    const MAX_ITERATIONS = 15;

    while (response.stop_reason === 'tool_use' && iterations < MAX_ITERATIONS) {
      iterations++;
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const textBlocks = response.content.filter(b => b.type === 'text');
      for (const tb of textBlocks) {
        if (tb.text.trim()) finalText += tb.text + '\n';
      }

      // Approval gate: if ANY tool in this batch is destructive, stage
      // ALL of them (including any read-only tools in the same batch — we
      // want the admin to see exactly what Claude wants to do as one
      // bundle, not split executions). Save state, return preview.
      const anyDestructive = toolUseBlocks.some(tu => DESTRUCTIVE_AI_TOOLS.has(tu.name));
      if (anyDestructive) {
        // Push the assistant turn so on resume the conversation has it
        conversationMessages.push({ role: 'assistant', content: response.content });

        const approvalId = uuidv4();
        _pendingApprovals.set(approvalId, {
          systemBlocks, cachedTools, conversationMessages,
          stagedToolUses: toolUseBlocks,
          toolResults, finalText,
          expires_at: Date.now() + APPROVAL_TTL_MS,
        });

        const proposed_actions = toolUseBlocks.map(tu => ({
          id: tu.id,
          tool_name: tu.name,
          tool_input: tu.input,
          summary: summarizeToolCall(tu.name, tu.input),
          is_destructive: DESTRUCTIVE_AI_TOOLS.has(tu.name),
        }));
        return res.json({
          kind: 'pending_approval',
          approval_id: approvalId,
          preamble_text: finalText.trim(),  // any reasoning Claude shared before the tools
          proposed_actions,
          tool_results_so_far: toolResults,
          usage: response.usage,
        });
      }

      // No destructive tools — execute all immediately
      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        console.log(`AI Tool Call: ${toolUseBlock.name}`, JSON.stringify(toolUseBlock.input).substring(0, 200));
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);
        console.log(`AI Tool Result: ${toolUseBlock.name}`, JSON.stringify(toolResult).substring(0, 200));
        toolResults.push({ tool: toolUseBlock.name, input: toolUseBlock.input, result: toolResult });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult),
        });
      }
      conversationMessages.push({ role: 'assistant', content: response.content });
      conversationMessages.push({ role: 'user', content: toolResultContents });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemBlocks,
        tools: cachedTools,
        tool_choice: { type: 'auto' },
        messages: conversationMessages,
      });
    }

    // Get final text response
    const lastTextBlocks = response.content.filter(b => b.type === 'text');
    for (const tb of lastTextBlocks) {
      if (tb.text.trim()) finalText += tb.text;
    }

    // ── Hallucination guard ───────────────────────────────────────────────
    // If the AI's text claims it logged/created/updated something, verify
    // a corresponding modifying tool actually ran successfully. This catches
    // the case where Claude says "I've logged the entries" without actually
    // calling log_time_entries.
    const MODIFYING_TOOLS = ['log_time_entries', 'create_project', 'update_project',
      'delete_project', 'create_client', 'update_client', 'delete_client',
      'create_staff', 'create_contract',
      'update_project_status', 'advance_permit_stage', 'create_budget',
      'create_budget_code', 'update_budget_code', 'set_billing_cadence',
      // Added 2026-05-02 alongside the new tools — keep in sync with
      // DESTRUCTIVE_AI_TOOLS so the hallucination guard catches false
      // success claims about these too.
      'create_engineering_contract', 'update_contract_umbrella',
      'bulk_update_projects', 'write_sql',
      'create_user', 'deactivate_user'];
    const successfulModifications = toolResults.filter(
      tr => MODIFYING_TOOLS.includes(tr.tool) && tr.result?.success === true
    );
    const claimsAction = /\b(I['’]?ve|I have|successfully|done|logged|added|created|updated|saved)\b/i.test(finalText);
    if (claimsAction && successfulModifications.length === 0) {
      console.warn('AI hallucination guard: text claims action but no successful modifying tool ran');
      finalText += '\n\n⚠️ **Heads up**: I claimed to take an action but no database changes actually went through. Please ask me to retry — and if I keep saying I did something without it sticking, check the server logs.';
    }

    // Log cache performance — helpful for verifying caching is reducing token spend.
    // cache_creation_input_tokens = first-time cache writes (full price + 25%)
    // cache_read_input_tokens = cache hits (10% of normal price, lower rate-limit weight)
    if (response.usage) {
      const u = response.usage;
      console.log(`AI usage — in:${u.input_tokens} out:${u.output_tokens} cache_write:${u.cache_creation_input_tokens || 0} cache_read:${u.cache_read_input_tokens || 0} iters:${iterations} mods:${successfulModifications.length}`);
    }

    res.json({
      kind: 'final',
      content: finalText.trim(),
      toolResults,
      usage: response.usage,
    });

  } catch (e) {
    const msg = e?.message || e?.error?.message || 'Unknown error';
    console.error('AI error:', msg);
    console.error('  Status:', e?.status);
    console.error('  Type:', e?.constructor?.name);
    console.error('  Full:', JSON.stringify(e, Object.getOwnPropertyNames(e || {})));
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('  ANTHROPIC_API_KEY is NOT SET — add it in Railway Variables');
    }
    res.status(500).json({ error: msg || 'AI request failed — check server logs' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL ROUTES
app.get('/permitting', (req, res) => res.sendFile(path.join(__dirname, 'public', 'permitting.html')));
app.get('/design', (req, res) => res.sendFile(path.join(__dirname, 'public', 'design.html')));

// SPA FALLBACK — serve the portal HTML or main app depending on PORTAL_MODE
// ─────────────────────────────────────────────────────────────────────────────

const SPA_FILE = PORTAL_MODE === 'permitting' ? 'permitting.html'
               : PORTAL_MODE === 'design' ? 'design.html'
               : PORTAL_MODE === 'timeclock' ? 'timeclock.html'
               : 'index.html';

app.get('*', (req, res) => {
  // Admin-only enforcement: when the admin HTML is being served (no PORTAL_MODE),
  // only allow logged-in users with role='admin'. Logged-in non-admins get
  // redirected to a portal-style 403 page that explains they don't have
  // admin access. Anyone not logged in was already caught by the public-
  // path middleware above.
  if (!PORTAL_MODE && req.user && req.user.role !== 'admin') {
    return res.status(403).send(`
      <!DOCTYPE html><html><head><title>Access Denied</title>
      <style>body{font-family:'Inter',sans-serif;background:#F5F7FA;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
      .card{background:#fff;border:1px solid #DEE2E6;border-radius:14px;padding:32px;max-width:420px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.06)}
      h1{font-size:22px;color:#DC3545;margin:0 0 12px 0}
      p{color:#6C757D;font-size:14px;line-height:1.5;margin:0 0 16px 0}
      a{color:#1B5FA0;text-decoration:none;font-weight:500}
      a:hover{text-decoration:underline}</style></head><body>
      <div class="card">
        <h1>Admin Access Required</h1>
        <p>You're signed in as <strong>${escapeHtml(req.user.username)}</strong> with role <strong>${escapeHtml(req.user.role)}</strong>.</p>
        <p>This page requires the <strong>admin</strong> role. Ask your administrator if you need broader access.</p>
        <p><a href="/api/auth/logout" onclick="event.preventDefault();fetch('/api/auth/logout',{method:'POST',credentials:'include'}).then(()=>location.href='/login')">Sign out</a></p>
      </div></body></html>
    `);
  }
  // Portal-mode enforcement: when PORTAL_MODE is set, the user must have
  // access to that team — either via their primary role's team OR via
  // extra_teams[]. Admin users always pass. This is the gate that lets a
  // design_engineer with extra_teams=['permitting'] log in to the
  // permitting portal and have it work.
  //
  // SPECIAL CASE: PORTAL_MODE='timeclock' is open to all logged-in users
  // regardless of role/team. The time clock is a universal hours-tracking
  // surface — every employee should be able to use it. Access to specific
  // PROJECTS is still scoped via /api/projects, and audit + edit history
  // is still per-user, so there's no data leak risk in opening the portal.
  if (PORTAL_MODE && req.user && req.user.role !== 'admin' && PORTAL_MODE !== 'timeclock') {
    const primaryTeam = req.user.role.startsWith('design_') ? 'design'
                      : req.user.role.startsWith('permitting_') ? 'permitting'
                      : req.user.role.startsWith('inspection_') ? 'inspection'
                      : null;
    const extras = Array.isArray(req.user.extra_teams) ? req.user.extra_teams : [];
    const accessible = new Set([primaryTeam, ...extras].filter(Boolean));
    if (!accessible.has(PORTAL_MODE)) {
      return res.status(403).send(`
        <!DOCTYPE html><html><head><title>Access Denied</title>
        <style>body{font-family:'Inter',sans-serif;background:#F5F7FA;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
        .card{background:#fff;border:1px solid #DEE2E6;border-radius:14px;padding:32px;max-width:420px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.06)}
        h1{font-size:22px;color:#DC3545;margin:0 0 12px 0}
        p{color:#6C757D;font-size:14px;line-height:1.5;margin:0 0 16px 0}
        a{color:#1B5FA0;text-decoration:none;font-weight:500}</style></head><body>
        <div class="card">
          <h1>Portal Access Required</h1>
          <p>You're signed in as <strong>${escapeHtml(req.user.username)}</strong>.</p>
          <p>This portal requires <strong>${escapeHtml(PORTAL_MODE)}</strong> team access. Ask your administrator to add it to your account.</p>
          <p><a href="/api/auth/logout" onclick="event.preventDefault();fetch('/api/auth/logout',{method:'POST',credentials:'include'}).then(()=>location.href='/login')">Sign out</a></p>
        </div></body></html>
      `);
    }
  }
  res.sendFile(path.join(__dirname, 'public', SPA_FILE));
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
    // Per-client opt-in: do we show the Contract field? the WO# field? Default
    // computed from is_rus on the client (PSC clients show both; others default
    // to neither). Admin can toggle in Settings.
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_contract BOOLEAN`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_work_order BOOLEAN`,
    // Defaults for existing clients, only where NULL (idempotent backfill).
    `UPDATE clients SET show_contract = (is_rus IS TRUE) WHERE show_contract IS NULL`,
    `UPDATE clients SET show_work_order = (is_rus IS TRUE) WHERE show_work_order IS NULL`,
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
    { name: 'Resident Engineer',             bt: 'hourly',  rate: 100,  perm: false, code: 'g-1-B-1',    team: 'inspection', psc: true,  generic: false },
    { name: 'Inspection',                    bt: 'hourly',  rate: 90,   perm: false, code: 'g-1-B-4',    team: 'inspection', psc: true,  generic: false },
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

async function start(opts = {}) {
  await initSchema();
  await bootstrapV3Schema();   // runs AFTER initSchema, even if that errored
  await bootstrapAuthSchema(pool);  // creates users table + seeds default admin
  await timeclockModule.bootstrapTimeClockSchema(pool);  // staff_id + sessions + audit log
  // Versioned migrations runner (Track 1.4) — applies anything in
  // /migrations that isn't recorded in schema_migrations yet. Coexists
  // with bootstrapV3Schema until the v3 ALTER soup is gradually moved
  // into numbered migration files. Failure logs but doesn't crash boot.
  try {
    const { runMigrations } = require('./db_migrations');
    const out = await runMigrations(pool);
    if (out.applied > 0) console.log(`[migrations] applied ${out.applied} new (skipped ${out.skipped})`);
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
    automationModule.startScheduler(pool);
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
