require('dotenv').config();
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
    return res.status(413).json({
      error: `File too large. Maximum size for this upload is ${err.field ? err.field + ' ' : ''}${err.limit ? Math.round(err.limit / 1024 / 1024) + ' MB' : 'limited'}.`,
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
  // Re-run any schema.sql statements that initSchema deferred because
  // they reference the users table (billing_batches / invoice_templates
  // / customer_clients have FKs to users(id)). Now that users exists
  // they apply cleanly.
  await applyDeferredSchemaStatements();
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
