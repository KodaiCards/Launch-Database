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
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Portal Mode ─────────────────────────────────────────────────────────────
// When PORTAL_MODE is set ('permitting' or 'design'), this instance serves
// only that portal's HTML and blocks access to revenue/billing/AI endpoints.
// Deploy 3 services from the same repo with different PORTAL_MODE values.
const PORTAL_MODE = (process.env.PORTAL_MODE || '').toLowerCase(); // '' | 'permitting' | 'design'
const PORTAL_NAMES = { permitting: 'Permitting Portal', design: 'Design Portal' };
if (PORTAL_MODE) {
  console.log(`✓ Running in PORTAL MODE: ${PORTAL_NAMES[PORTAL_MODE] || PORTAL_MODE}`);
}

// Wire up portal-mode route overrides + setting-approval flow.
// MUST run before the existing route definitions below — Express picks
// routes first-match, so portal_module's overrides win in portal mode.
installPortalExtensions(app, pool, PORTAL_MODE);

// ─── Password Protection ─────────────────────────────────────────────────────
if (process.env.APP_PASSWORD) {
  const realm = PORTAL_MODE ? `Launch Fiber - ${PORTAL_NAMES[PORTAL_MODE] || PORTAL_MODE}` : 'Launch Fiber Services';
  app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
      const [scheme, encoded] = auth.split(' ');
      if (scheme === 'Basic') {
        const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
        if (pass === process.env.APP_PASSWORD) return next();
      }
    }
    res.set('WWW-Authenticate', `Basic realm="${realm}"`);
    res.status(401).send('Authentication required');
  });
  console.log('✓ Password protection enabled');
}

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
  const portalFile = PORTAL_MODE === 'permitting' ? 'permitting.html' : 'design.html';
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

function calcProjectFinancials(type, billingRate, footage, hoursPerMileOverride) {
  // "Permitting" is now triggered by either the legacy project_type='permitting'
  // OR an explicit hoursPerMileOverride (set when a Job with is_permitting=true
  // is selected). Rate defaults to $90/hr for DOT permits but for RR permits
  // (where the rate is intentionally NULL until the user sets it in Settings →
  // Pricing) we leave revenue as NULL — only hours calc.
  const ratePresent = billingRate !== null && billingRate !== undefined && billingRate !== '' && !isNaN(parseFloat(billingRate));
  const PERMITTING_RATE = ratePresent ? parseFloat(billingRate) : null;

  if (type === 'permitting' && footage) {
    const miles = footage / 5280;
    let hoursPerMile, totalHours;
    if (hoursPerMileOverride && hoursPerMileOverride > 0) {
      // Caller supplied a previously-saved random factor — re-use it
      hoursPerMile = +parseFloat(hoursPerMileOverride);
      totalHours = miles * hoursPerMile;
    } else {
      // Random between 25.00 and 30.00 in 0.25 increments → 21 possible values
      const steps = Math.floor(Math.random() * 21);
      hoursPerMile = 25 + steps * 0.25;
      totalHours = miles * hoursPerMile;
    }
    // Minimum 25 hours if project is under a mile
    if (miles < 1) totalHours = Math.max(25, totalHours);
    // Snap to 0.25 increments
    totalHours = Math.round(totalHours * 4) / 4;
    return {
      expectedHours: totalHours,
      expectedRevenue: PERMITTING_RATE != null ? +(totalHours * PERMITTING_RATE).toFixed(2) : null,
      miles: +miles.toFixed(4),
      permittingHoursPerMile: hoursPerMile
    };
  }
  return { expectedHours: null, expectedRevenue: null, miles: null, permittingHoursPerMile: null };
}

// Recalculate actual_hours for a project (own entries + children's hours)
// then propagate up through parent chain
async function updateProjectHours(projectId) {
  // Update this project: own time entries + sum of children's actual_hours
  await pool.query(`
    UPDATE projects SET actual_hours = (
      SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1
    ) + (
      SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id=$1
    ) WHERE id=$1
  `, [projectId]);

  // Propagate up to parent
  const { rows } = await pool.query('SELECT parent_id FROM projects WHERE id=$1', [projectId]);
  if (rows[0] && rows[0].parent_id) {
    await updateProjectHours(rows[0].parent_id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/clients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', async (req, res) => {
  const { name, is_rus, notes } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
      [name, is_rus || false, notes]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/clients/:id', async (req, res) => {
  const { name, is_rus, notes, show_contract, show_work_order } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE clients SET
         name             = COALESCE($2, name),
         is_rus           = COALESCE($3, is_rus),
         notes            = $4,
         show_contract    = COALESCE($5, show_contract),
         show_work_order  = COALESCE($6, show_work_order)
       WHERE id = $1 RETURNING *`,
      [req.params.id, name, is_rus, notes ?? null,
       show_contract === undefined ? null : show_contract,
       show_work_order === undefined ? null : show_work_order]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete a client. Cascades to contracts, projects, time entries, invoices.
// Returns counts of what would be deleted as a confirmation aid (preview=true).
app.delete('/api/clients/:id', async (req, res) => {
  try {
    if (req.query.preview === 'true') {
      const counts = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM contracts WHERE client_id=$1)::int AS contracts,
          (SELECT COUNT(*) FROM projects WHERE client_id=$1)::int AS projects,
          (SELECT COUNT(*) FROM invoices WHERE client_id=$1)::int AS invoices
      `, [req.params.id]);
      return res.json(counts.rows[0]);
    }
    const r = await pool.query('DELETE FROM clients WHERE id=$1 RETURNING name', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Client not found' });
    res.json({ ok: true, deleted_name: r.rows[0].name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/contracts', async (req, res) => {
  const { client_id } = req.query;
  try {
    const q = client_id
      ? 'SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id WHERE c.client_id=$1 ORDER BY c.contract_number'
      : 'SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number';
    const { rows } = await pool.query(q, client_id ? [client_id] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/contracts', async (req, res) => {
  const { client_id, contract_number, name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3) RETURNING *',
      [client_id, contract_number, name]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// JOBS — work categories (Inspector, RE, Permitting, Design, Other, ...)
// Replace the role of the old project_type enum for billing logic.
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/jobs', async (req, res) => {
  try {
    // Optional client_id filter — when set, only return jobs whose
    // for_psc_client / for_generic_client flag matches the client's class.
    // This makes the admin and portal job dropdowns behave consistently.
    const clientId = req.query.client_id || null;
    let isPsc = null;
    if (clientId) {
      const c = await pool.query('SELECT is_rus FROM clients WHERE id = $1', [clientId]);
      if (c.rows.length) isPsc = c.rows[0].is_rus === true;
    }
    const conds = [`active = true`];
    if (isPsc === true) conds.push(`for_psc_client = true`);
    else if (isPsc === false) conds.push(`for_generic_client = true`);
    const { rows } = await pool.query(
      `SELECT * FROM jobs WHERE ${conds.join(' AND ')} ORDER BY name`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Fetch a single job by id regardless of active state. The list endpoint
// excludes inactive jobs, but the project-edit modal still needs to be
// able to surface a now-deactivated job that's referenced by an existing
// project so the user can save without being forced to re-pick the job.
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DIAGNOSTIC — dumps raw job rows including inactive, with full column list.
// Use this to verify schema migration actually applied. Returns JSON like:
//   { count: 12, columns: [...], rows: [...] }
// Hit it via: https://your-admin-url/api/_debug/jobs
app.get('/api/_debug/jobs', async (req, res) => {
  try {
    const cols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_name = 'jobs' ORDER BY ordinal_position`
    );
    const rows = await pool.query('SELECT * FROM jobs ORDER BY active DESC, name');
    res.json({
      count: rows.rows.length,
      active_count: rows.rows.filter(r => r.active).length,
      columns: cols.rows,
      rows: rows.rows
    });
  } catch (e) { res.status(500).json({ error: e.message, stack: e.stack }); }
});

app.post('/api/jobs', async (req, res) => {
  const {
    name, default_billing_type = 'hourly', default_rate = null,
    is_permitting = false, notes = null, team = null,
    billing_code = null, for_psc_client = true, for_generic_client = true
  } = req.body;
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
  try {
    const teamVal = team === '' ? null : team;
    const { rows } = await pool.query(
      `INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting,
                         notes, team, billing_code, for_psc_client, for_generic_client)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (name) DO UPDATE SET
         active = true,
         team = COALESCE(EXCLUDED.team, jobs.team)
       RETURNING *`,
      [String(name).trim(), default_billing_type, default_rate, is_permitting,
       notes, teamVal, billing_code, for_psc_client, for_generic_client]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/jobs/:id', async (req, res) => {
  // Only update fields explicitly present in the request body. This makes
  // partial updates safe — e.g. PUT {name:"X"} only changes name, leaves
  // default_rate and notes alone. The previous version always wrote $4/$6
  // unconditionally, which meant any partial update wiped rate and notes
  // back to NULL.
  const allowed = ['name', 'default_billing_type', 'default_rate', 'is_permitting',
                   'notes', 'active', 'team', 'billing_code', 'for_psc_client',
                   'for_generic_client'];
  const setClauses = [];
  const values = [req.params.id];
  let i = 2;
  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      let v = req.body[field];
      // team: empty string maps to NULL ("Both / Unassigned")
      if (field === 'team' && v === '') v = null;
      setClauses.push(`${field} = $${i}`);
      values.push(v);
      i++;
    }
  }
  if (!setClauses.length) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  try {
    const sql = `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(sql, values);
    if (!rows[0]) return res.status(404).json({ error: 'Job not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Universal rate propagation: apply this job's current default_rate to ALL
// existing real (non-rollup) projects that use this job. Useful when the
// admin updates a job's rate and wants the change to flow through to
// historical projects rather than only affecting new ones.
app.put('/api/jobs/:id/propagate-rate', async (req, res) => {
  try {
    const j = await pool.query('SELECT default_rate FROM jobs WHERE id = $1', [req.params.id]);
    if (!j.rows.length) return res.status(404).json({ error: 'Job not found' });
    const rate = j.rows[0].default_rate;
    const r = await pool.query(
      `UPDATE projects
         SET billing_rate = $2
       WHERE job_id = $1 AND COALESCE(is_rollup, false) = false`,
      [req.params.id, rate]
    );
    res.json({ ok: true, updated: r.rowCount, applied_rate: rate });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    // Soft-delete via active=false to preserve historical references in projects
    await pool.query('UPDATE jobs SET active = false WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPES — program categories (BAU / GF(R) / RUS / Other / custom)
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/project-types', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM project_types WHERE active = true ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/project-types', async (req, res) => {
  const { name } = req.body;
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'name is required' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO project_types (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET active = true RETURNING *`,
      [String(name).trim()]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/project-types/:id', async (req, res) => {
  try {
    await pool.query('UPDATE project_types SET active = false WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PRICING LIST — Job × Project Type × Billing Code → rate
// Project creation pulls defaults from here. Settings panel manages it.
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/pricing', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT pe.*,
             j.name as job_name, j.is_permitting,
             pt.name as project_type_name
      FROM pricing_entries pe
      LEFT JOIN jobs j ON j.id = pe.job_id
      LEFT JOIN project_types pt ON pt.id = pe.project_type_id
      ORDER BY pt.name, j.name, pe.billing_code NULLS LAST
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Look up the default rate/billing for a job+type (and optionally a billing code).
// Used by the project create form to auto-fill the rate.
app.get('/api/pricing/lookup', async (req, res) => {
  const { job_id, project_type_id, billing_code } = req.query;
  if (!job_id || !project_type_id) return res.status(400).json({ error: 'job_id and project_type_id required' });
  try {
    // Most specific (with code) first, then fall back to the no-code entry
    const { rows } = await pool.query(`
      SELECT * FROM pricing_entries
      WHERE job_id = $1 AND project_type_id = $2
        AND ($3::text IS NULL OR billing_code = $3 OR billing_code IS NULL)
      ORDER BY (billing_code = $3) DESC NULLS LAST
      LIMIT 1
    `, [job_id, project_type_id, billing_code || null]);
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pricing', async (req, res) => {
  const { job_id, project_type_id, billing_code, billing_type, rate, notes } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate, notes)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (job_id, project_type_id, billing_code)
      DO UPDATE SET billing_type = $4, rate = $5, notes = $6, updated_at = NOW()
      RETURNING *
    `, [job_id, project_type_id, billing_code || null, billing_type || 'hourly', rate, notes || null]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/pricing/:id', async (req, res) => {
  const { billing_type, rate, notes, billing_code } = req.body;
  try {
    const { rows } = await pool.query(`
      UPDATE pricing_entries SET
        billing_type = COALESCE($2, billing_type),
        rate = COALESCE($3, rate),
        notes = $4,
        billing_code = COALESCE($5, billing_code),
        updated_at = NOW()
      WHERE id = $1 RETURNING *
    `, [req.params.id, billing_type, rate, notes, billing_code]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/pricing/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM pricing_entries WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Returns the count of "missing pricing" combinations — the red dot in the
// settings button is shown when this is > 0. A combination is "missing" if
// there's an active job+project_type pair with no pricing_entries row.
// (We don't enumerate every billing code — only require one default per job/type.)
app.get('/api/pricing/gaps', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT j.id as job_id, j.name as job_name,
             pt.id as project_type_id, pt.name as project_type_name
      FROM jobs j
      CROSS JOIN project_types pt
      WHERE j.active = true AND pt.active = true
        AND NOT EXISTS (
          SELECT 1 FROM pricing_entries pe
          WHERE pe.job_id = j.id AND pe.project_type_id = pt.id
        )
      ORDER BY pt.name, j.name
    `);
    res.json({ count: rows.length, gaps: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

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

app.get('/api/staff', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM staff WHERE active=true ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/staff', async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *', [name]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/projects', async (req, res) => {
  const { status, client_id, type } = req.query;
  let where = [];
  let params = [];
  let i = 1;
  if (status) { where.push(`p.status=$${i++}`); params.push(status); }
  if (client_id) { where.push(`p.client_id=$${i++}`); params.push(client_id); }
  if (type) { where.push(`p.project_type=$${i++}`); params.push(type); }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        co.name as contract_name,
        pp.name as parent_name,
        COALESCE(SUM(te.hours),0) as logged_hours,
        (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) as child_count,
        -- Server-computed YTD revenue for this project + all descendants
        COALESCE((
          WITH RECURSIVE tree AS (
            SELECT p.id AS tid
            UNION ALL
            SELECT c.id FROM projects c JOIN tree t ON c.parent_id = t.tid
          )
          SELECT SUM(
            CASE
              WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                THEN COALESCE(leaf.expected_revenue, 0)
              ELSE COALESCE((
                SELECT SUM(te2.hours) FROM time_entries te2
                WHERE te2.project_id = leaf.id
                  AND EXTRACT(YEAR FROM te2.entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)
              ), 0) * COALESCE(leaf.billing_rate,
                CASE LOWER(leaf.project_type)
                  WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                END)
            END
          )
          FROM projects leaf
          WHERE leaf.id IN (SELECT tid FROM tree)
            AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
        ), 0) as ytd_revenue
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      ${whereStr}
      GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name
      ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        co.name as contract_name,
        pp.name as parent_name
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      WHERE p.id = $1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', async (req, res) => {
  let {
    name, client_id, contract_id, work_order_number,
    project_type, project_type_id, job_id,
    status = 'active', billing_type, billing_rate,
    footage, start_date, notes, parent_id, budget_code_id, concentrator_id,
    permit_manager,
    billing_cadence, projected_revenue,
    manual_invoice_amount
  } = req.body;

  try {
    // Auto-nesting: when admin doesn't explicitly pick a parent, derive it
    // from the rollup chain Client → Service Area → Project Type → Team.
    // If admin DID pick a parent, respect that choice (legacy/manual nesting).
    if (!parent_id && client_id && app.locals.ensureRollupChain) {
      // Auto-detect concentrator from work order if admin didn't pick one
      if (!concentrator_id && work_order_number) {
        const con = await pool.query(
          `SELECT id FROM concentrators WHERE work_order_number = $1 LIMIT 1`,
          [String(work_order_number).trim()]
        );
        if (con.rows.length) concentrator_id = con.rows[0].id;
      }
      parent_id = await app.locals.ensureRollupChain({
        client_id, concentrator_id, project_type_id, job_id
      });
    }

    // Duplicate-project guard (same name under same parent rejected)
    if (await app.locals.isDuplicateProject(name, parent_id)) {
      return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
    }

    // If a job is selected with is_permitting=true, treat this as a permitting
    // project regardless of legacy project_type. This is how permitting
    // becomes universal across program types (BAU/GF(R)/RUS/Other).
    let isPermitting = project_type === 'permitting';
    let effectiveBillingType = billing_type;
    let effectiveRate = billing_rate;
    let jobName = null;
    if (job_id) {
      const jr = await pool.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
      const j = jr.rows[0];
      if (j) {
        jobName = j.name;
        if (j.is_permitting) {
          isPermitting = true;
          effectiveBillingType = 'footage';
        }
        if (effectiveRate === undefined || effectiveRate === null || effectiveRate === '') {
          effectiveRate = j.default_rate;
        }
        if (!effectiveBillingType) {
          effectiveBillingType = j.default_billing_type || 'hourly';
        }
      }
    }

    // Cadence: caller can set explicitly, otherwise default to 'monthly' for
    // Inspection jobs (matches the schema backfill rule), 'one_time' otherwise.
    const effectiveCadence = billing_cadence
      || (jobName === 'Inspection' ? 'monthly' : 'one_time');

    // For the financials calc, treat is_permitting as the trigger
    const finType = isPermitting ? 'permitting' : (project_type || 'other');
    const fin = calcProjectFinancials(finType, effectiveRate, footage);

    // Manual invoice amount: a flat dollar override. When set, the bill flow
    // uses this number instead of (hours × rate) or (footage × rate).
    const effectiveManual = manual_invoice_amount !== undefined && manual_invoice_amount !== null && manual_invoice_amount !== ''
      ? parseFloat(manual_invoice_amount)
      : null;

    // Projected revenue: caller's value if provided, else manual_invoice_amount
    // (since that's the real contract value when set), else fall back to the
    // calculated expected_revenue (the auto-derived value for footage projects).
    const effectiveProjected = projected_revenue !== undefined && projected_revenue !== null && projected_revenue !== ''
      ? parseFloat(projected_revenue)
      : (effectiveManual != null ? effectiveManual
         : (fin.expectedRevenue != null ? fin.expectedRevenue : null));

    const { rows } = await pool.query(`
      INSERT INTO projects (
        name, client_id, contract_id, work_order_number,
        project_type, project_type_id, job_id,
        status, billing_type, billing_rate,
        footage, miles, expected_hours, expected_revenue,
        start_date, notes, parent_id, budget_code_id, concentrator_id,
        permitting_hours_per_mile, billing_cadence, projected_revenue,
        manual_invoice_amount
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, project_type_id || null, job_id || null,
      status, effectiveBillingType, effectiveRate || null,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
      fin.permittingHoursPerMile || null, effectiveCadence, effectiveProjected,
      effectiveManual
    ]);

    // Auto-create permit stage for permitting projects
    if (isPermitting) {
      await pool.query(
        'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
        [rows[0].id, 'potential', permit_manager || null]
      );
    }

    // Auto-create design stage for design projects
    if (project_type === 'design') {
      await pool.query(
        'INSERT INTO design_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [rows[0].id, 'potential']
      );
    }

    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', async (req, res) => {
  const {
    name, client_id, contract_id, work_order_number,
    project_type, project_type_id, job_id,
    status, billing_type, billing_rate,
    footage, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id,
    billing_cadence, projected_revenue, manual_invoice_amount
  } = req.body;

  try {
    // Duplicate-project guard — only check if name OR parent is being changed
    if (name !== undefined || parent_id !== undefined) {
      const cur = await pool.query('SELECT name, parent_id FROM projects WHERE id = $1', [req.params.id]);
      if (cur.rows.length) {
        const checkName   = (name !== undefined ? name : cur.rows[0].name);
        const checkParent = (parent_id !== undefined ? parent_id : cur.rows[0].parent_id);
        if (await app.locals.isDuplicateProject(checkName, checkParent, req.params.id)) {
          return res.status(409).json({ error: 'A project with this name already exists under the same parent' });
        }
      }
    }

    // Re-derive permitting status from job (if job specified) or legacy project_type
    let isPermitting = project_type === 'permitting';
    let effectiveBillingType = billing_type;
    let effectiveRate = billing_rate;
    if (job_id) {
      const jr = await pool.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
      const j = jr.rows[0];
      if (j) {
        if (j.is_permitting) { isPermitting = true; effectiveBillingType = 'footage'; }
        if (effectiveRate === undefined || effectiveRate === null || effectiveRate === '') {
          effectiveRate = j.default_rate;
        }
        if (!effectiveBillingType) effectiveBillingType = j.default_billing_type || 'hourly';
      }
    }

    // For permitting, reuse the random hours-per-mile factor stored at create-time
    // so editing footage doesn't generate a new random rate every save.
    const existing = await pool.query('SELECT permitting_hours_per_mile, billing_cadence, projected_revenue, manual_invoice_amount FROM projects WHERE id=$1', [req.params.id]);
    const existingHpm = existing.rows[0]?.permitting_hours_per_mile;
    const finType = isPermitting ? 'permitting' : (project_type || 'other');
    const fin = calcProjectFinancials(finType, effectiveRate, footage, existingHpm);

    // Preserve existing values when payload doesn't include the field
    const newCadence = billing_cadence !== undefined ? billing_cadence : existing.rows[0]?.billing_cadence;
    const newProjected = projected_revenue !== undefined
      ? (projected_revenue === null || projected_revenue === '' ? null : parseFloat(projected_revenue))
      : existing.rows[0]?.projected_revenue;
    const newManual = manual_invoice_amount !== undefined
      ? (manual_invoice_amount === null || manual_invoice_amount === '' ? null : parseFloat(manual_invoice_amount))
      : existing.rows[0]?.manual_invoice_amount;

    const { rows } = await pool.query(`
      UPDATE projects SET
        name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
        project_type=$5, project_type_id=$6, job_id=$7,
        status=$8, billing_type=$9, billing_rate=$10,
        footage=$11, miles=$12, expected_hours=$13, expected_revenue=$14,
        start_date=$15, completed_date=$16, billed_date=$17,
        notes=$18, parent_id=$19, budget_code_id=$20, concentrator_id=$21,
        permitting_hours_per_mile=$22,
        billing_cadence=$23, projected_revenue=$24,
        manual_invoice_amount=$25
      WHERE id=$26 RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, project_type_id || null, job_id || null,
      status, effectiveBillingType, effectiveRate || null,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, completed_date || null, billed_date || null,
      notes, parent_id || null, budget_code_id || null, concentrator_id || null,
      fin.permittingHoursPerMile || existingHpm || null,
      newCadence, newProjected, newManual,
      req.params.id
    ]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Recalculate actual_hours for a single project from its time_entries
app.post('/api/projects/:id/recalc-hours', async (req, res) => {
  try {
    await updateProjectHours(req.params.id);
    const { rows } = await pool.query('SELECT actual_hours FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true, actual_hours: rows[0]?.actual_hours });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Recalculate ALL projects' actual_hours from time_entries (bottom-up)
app.post('/api/projects/recalc-all', async (req, res) => {
  try {
    // First, set all to their own direct hours
    await pool.query(`
      UPDATE projects SET actual_hours = COALESCE((
        SELECT SUM(hours) FROM time_entries WHERE project_id = projects.id
      ), 0)
    `);
    // Then propagate up: repeat until no changes (handles unlimited depth)
    let changed = 1;
    let iterations = 0;
    while (changed > 0 && iterations < 20) {
      const result = await pool.query(`
        UPDATE projects p SET actual_hours = (
          SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id = p.id
        ) + (
          SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id = p.id
        )
        WHERE EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        RETURNING id
      `);
      changed = result.rowCount;
      iterations++;
    }
    res.json({ ok: true, iterations });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// TIME ENTRIES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/time-entries', async (req, res) => {
  const { project_id, staff_id, month, year } = req.query;
  let where = [];
  let params = [];
  let i = 1;
  if (project_id) { where.push(`te.project_id=$${i++}`); params.push(project_id); }
  if (staff_id) { where.push(`te.staff_id=$${i++}`); params.push(staff_id); }
  if (month && year) {
    where.push(`EXTRACT(MONTH FROM te.entry_date)=$${i++} AND EXTRACT(YEAR FROM te.entry_date)=$${i++}`);
    params.push(month, year);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const { rows } = await pool.query(`
      SELECT te.*, p.name as project_name, p.work_order_number, p.project_type,
             s.name as staff_name, cl.name as client_name
      FROM time_entries te
      LEFT JOIN projects p ON p.id = te.project_id
      LEFT JOIN staff s ON s.id = te.staff_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      ${whereStr}
      ORDER BY te.entry_date DESC, te.created_at DESC
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/time-entries', async (req, res) => {
  const { project_id, staff_id, entry_date, hours, job_title, notes } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, notes)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [project_id, staff_id || null, entry_date, hours, job_title, notes]);

    // Update project actual_hours and propagate up hierarchy
    await updateProjectHours(project_id);

    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/time-entries/bulk', async (req, res) => {
  const { entries } = req.body; // [{project_id, staff_id, entry_date, hours, job_title}]
  if (!entries || !entries.length) return res.status(400).json({ error: 'No entries' });

  const importBatch = `import_${Date.now()}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const e of entries) {
      const { rows } = await client.query(`
        INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
      `, [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title, importBatch]);
      inserted.push(rows[0]);
    }
    // Update actual_hours with hierarchy rollup
    const projectIds = [...new Set(entries.map(e => e.project_id))];
    await client.query('COMMIT');
    // Rollup after commit so pool queries work
    for (const pid of projectIds) {
      await updateProjectHours(pid);
    }
    res.json({ inserted: inserted.length, batch: importBatch });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

app.delete('/api/time-entries/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM time_entries WHERE id=$1 RETURNING project_id', [req.params.id]);
    if (rows[0]) {
      await updateProjectHours(rows[0].project_id);
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Bulk delete: all time entries for a given staff member, optionally filtered
// by month/year. Used by the "Delete all hours for [employee]" action in the Hours tab.
app.delete('/api/time-entries/by-staff/:staffId', async (req, res) => {
  const { month, year } = req.query;
  const params = [req.params.staffId];
  let where = 'staff_id = $1';
  if (month && year) {
    where += ' AND EXTRACT(MONTH FROM entry_date)=$2 AND EXTRACT(YEAR FROM entry_date)=$3';
    params.push(month, year);
  } else if (year) {
    where += ' AND EXTRACT(YEAR FROM entry_date)=$2';
    params.push(year);
  }
  try {
    // Capture affected projects first so we can roll up afterwards
    const affected = await pool.query(`SELECT DISTINCT project_id FROM time_entries WHERE ${where}`, params);
    const result = await pool.query(`DELETE FROM time_entries WHERE ${where}`, params);
    for (const r of affected.rows) {
      if (r.project_id) await updateProjectHours(r.project_id);
    }
    res.json({ ok: true, deleted: result.rowCount });
  } catch (e) {
    console.error('bulk delete by staff error:', e);
    res.status(500).json({ error: e.message });
  }
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

app.post('/api/hours/csv-validate', upload.single('file'), async (req, res) => {
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
        invalid: invalidRows.length
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
app.post('/api/hours/csv-edit-row', async (req, res) => {
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

app.post('/api/hours/csv-commit', async (req, res) => {
  const { stage_id, create_staff = [], map_staff = {}, skip_unknown_wos = true, apply_job_title = null, skip_billed_period_rows = false } = req.body;
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

    // 2. Walk staged rows. Insert ones that have a project_id AND a resolvable staff_id.
    //    Skip rows where WO is unknown (front-end already required acknowledgment).
    //    If skip_billed_period_rows is set, also skip rows that hit an already-billed
    //    month (the user opted to NOT import these to avoid double-billing).
    const importBatch = `csv_import_${Date.now()}`;
    let inserted = 0;
    let skipped_unknown_wo = 0;
    let skipped_unresolved_staff = 0;
    let skipped_billed_period = 0;
    const projectIds = new Set();

    for (const r of staged.validRows) {
      if (!r.wo_known) { skipped_unknown_wo++; continue; }
      const staffId = r.staff_id || staffByNorm[r.name_norm] || null;
      if (!staffId) { skipped_unresolved_staff++; continue; }
      if (skip_billed_period_rows && r.already_billed_period) { skipped_billed_period++; continue; }

      // Final job title: row's existing value (which may already be inferred
      // from the filename) → operator-supplied apply_job_title → null
      const finalJobTitle = r.job_title || apply_job_title || null;

      await client.query(
        `INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [r.project_id, staffId, r.date, r.hours, finalJobTitle, importBatch]
      );
      inserted++;
      projectIds.add(r.project_id);
    }

    // 3. Roll up actual_hours for affected projects (after commit)
    await client.query('COMMIT');
    csvStage.delete(stage_id);
    for (const pid of projectIds) {
      await updateProjectHours(pid);
    }

    res.json({
      ok: true,
      batch: importBatch,
      inserted,
      skipped_unknown_wo,
      skipped_unresolved_staff,
      skipped_billed_period,
      created_staff: createdStaff,
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
// REVENUE — PROJECT DETAIL DRILL-DOWN (for the new clickable row popup)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/projects/:id/detail', async (req, res) => {
  try {
    const projR = await pool.query(`
      SELECT p.*, cl.name as client_name, co.contract_number, co.name as contract_name,
             pp.name as parent_name,
             gp.name as grandparent_name,
             bc.code as budget_code, b.name as budget_name,
             EXISTS (SELECT 1 FROM budgets WHERE project_id = p.id) as has_budget
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN projects gp ON gp.id = pp.parent_id
      LEFT JOIN budget_codes bc ON bc.id = p.budget_code_id
      LEFT JOIN budgets b ON b.id = bc.budget_id
      WHERE p.id = $1
    `, [req.params.id]);
    if (!projR.rows[0]) return res.status(404).json({ error: 'Not found' });

    // Collect this project + ALL descendants (recursive). For container projects
    // (grandparents/parents) this lets us roll hours up from their leaves so the
    // popup is meaningful even when no time is logged directly to the container.
    const subtreeR = await pool.query(`
      WITH RECURSIVE subtree AS (
        SELECT id FROM projects WHERE id = $1
        UNION ALL
        SELECT p.id FROM projects p
        JOIN subtree s ON p.parent_id = s.id
      )
      SELECT id FROM subtree
    `, [req.params.id]);
    const subtreeIds = subtreeR.rows.map(r => r.id);

    // Active billable count: leaves only, status='active', with a non-Other job.
    // Mirrors the dashboard's active count rule. Used for the "across N projects"
    // label so containers/Other/non-active don't inflate the number.
    const activeCountR = await pool.query(`
      SELECT COUNT(*)::int AS n FROM projects p
      LEFT JOIN jobs j ON j.id = p.job_id
      WHERE p.id = ANY($1::uuid[])
        AND p.status = 'active'
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND p.job_id IS NOT NULL
        AND LOWER(COALESCE(j.name, '')) <> 'other'
    `, [subtreeIds]);
    const activeBillableCount = parseInt(activeCountR.rows[0].n) || 0;

    const month = req.query.month;
    const year = req.query.year;
    let dateFilter = '', params = [subtreeIds];
    if (month && year) {
      dateFilter = ' AND EXTRACT(MONTH FROM te.entry_date)=$2 AND EXTRACT(YEAR FROM te.entry_date)=$3';
      params.push(month, year);
    } else if (year) {
      dateFilter = ' AND EXTRACT(YEAR FROM te.entry_date)=$2';
      params.push(year);
    }

    // Time entries: pulled from the whole subtree, joined to project info so
    // the UI can show which leaf each entry came from.
    const entriesR = await pool.query(`
      SELECT te.*, s.name as staff_name,
             pr.name as project_name, pr.id as project_id, pr.work_order_number, pr.project_type,
             COALESCE(pr.billing_rate,
               CASE LOWER(pr.project_type)
                 WHEN 'inspection' THEN 90
                 WHEN 're' THEN 100
                 WHEN 'resident engineer' THEN 100
                 WHEN 'permitting' THEN 90
                 ELSE 0
               END
             ) as billing_rate
      FROM time_entries te
      LEFT JOIN staff s ON s.id = te.staff_id
      LEFT JOIN projects pr ON pr.id = te.project_id
      WHERE te.project_id = ANY($1::uuid[]) ${dateFilter}
      ORDER BY te.entry_date DESC, s.name
    `, params);

    const stagesR = await pool.query(
      `SELECT * FROM permit_stages WHERE project_id = $1 ORDER BY created_at`,
      [req.params.id]
    );

    // Direct children with computed revenue (handles NULL billing_rate via type inference)
    const childrenR = await pool.query(`
      WITH RECURSIVE child_tree AS (
        SELECT id, parent_id FROM projects WHERE parent_id = $1
        UNION ALL
        SELECT p.id, p.parent_id FROM projects p JOIN child_tree ct ON p.parent_id = ct.id
      )
      SELECT c.id, c.name, c.project_type, c.status, c.billing_rate, c.billing_type,
             c.expected_revenue, c.actual_hours,
             COALESCE(c.billing_rate,
               CASE LOWER(c.project_type)
                 WHEN 'inspection' THEN 90
                 WHEN 're' THEN 100
                 WHEN 'resident engineer' THEN 100
                 WHEN 'permitting' THEN 90
                 ELSE 0
               END
             ) as effective_rate,
             -- Compute subtree revenue for this child
             COALESCE((
               WITH RECURSIVE descendants AS (
                 SELECT c.id AS did
                 UNION ALL
                 SELECT p.id FROM projects p JOIN descendants d ON p.parent_id = d.did
               )
               SELECT SUM(
                 CASE
                   WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                     THEN COALESCE(leaf.expected_revenue, 0)
                   ELSE COALESCE((SELECT SUM(te.hours) FROM time_entries te WHERE te.project_id = leaf.id), 0)
                     * COALESCE(leaf.billing_rate,
                       CASE LOWER(leaf.project_type)
                         WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                       END)
                 END
               ) FROM projects leaf
               WHERE leaf.id IN (SELECT did FROM descendants)
                 AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
             ), 0) as subtree_revenue
       FROM projects c WHERE c.parent_id = $1 ORDER BY c.name`,
      [req.params.id]
    );

    // Invoices linked to ANY project in the subtree (so a parent shows
    // its leaves' invoices too)
    const invoicesR = await pool.query(`
      SELECT ii.id, ii.description, ii.quantity, ii.unit, ii.rate, ii.amount,
             inv.invoice_number, inv.invoice_date, inv.status, inv.notes,
             pr.name as project_name
      FROM invoice_items ii
      JOIN invoices inv ON inv.id = ii.invoice_id
      LEFT JOIN projects pr ON pr.id = ii.project_id
      WHERE ii.project_id = ANY($1::uuid[])
      ORDER BY inv.invoice_date DESC, ii.created_at DESC
    `, [subtreeIds]);

    // Distinct (year, month) periods that have activity ANYWHERE in the subtree.
    // Powers the month-tab switcher in the popup — for ongoing work the user
    // can pick any month with data and see just that month's breakdown.
    const periodsR = await pool.query(`
      SELECT EXTRACT(YEAR FROM entry_date)::int AS year,
             EXTRACT(MONTH FROM entry_date)::int AS month,
             SUM(hours)::float AS hours
      FROM time_entries
      WHERE project_id = ANY($1::uuid[])
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `, [subtreeIds]);

    // Per-month breakdown for the popup table: hours, earned, and whether the
    // month has been invoiced. Earned uses each entry's leaf billing_rate so
    // mixed-job containers compute correctly. The billed flag fires when ANY
    // project in this subtree has an invoice_items row dated within that month.
    const monthlyBreakdownR = await pool.query(`
      WITH agg AS (
        SELECT EXTRACT(YEAR FROM te.entry_date)::int AS y,
               EXTRACT(MONTH FROM te.entry_date)::int AS mo,
               SUM(te.hours)::float AS hours,
               SUM(te.hours * COALESCE(pr.billing_rate, 0))::float AS earned
        FROM time_entries te
        JOIN projects pr ON pr.id = te.project_id
        WHERE te.project_id = ANY($1::uuid[])
          AND COALESCE(pr.billing_type, 'hourly') = 'hourly'
        GROUP BY y, mo
      ),
      billed AS (
        SELECT EXTRACT(YEAR FROM inv.invoice_date)::int AS y,
               EXTRACT(MONTH FROM inv.invoice_date)::int AS mo,
               SUM(ii.amount)::float AS billed_amount,
               COUNT(DISTINCT inv.id)::int AS invoice_count
        FROM invoice_items ii
        JOIN invoices inv ON inv.id = ii.invoice_id
        WHERE ii.project_id = ANY($1::uuid[])
        GROUP BY y, mo
      )
      SELECT a.y AS year, a.mo AS month, a.hours, a.earned,
             COALESCE(b.billed_amount, 0) AS billed_amount,
             COALESCE(b.invoice_count, 0) AS invoice_count,
             (b.invoice_count IS NOT NULL AND b.invoice_count > 0) AS is_billed
      FROM agg a
      LEFT JOIN billed b ON a.y = b.y AND a.mo = b.mo
      ORDER BY a.y DESC, a.mo DESC
    `, [subtreeIds]);

    // Projected revenue rollup: sum projected_revenue from LEAVES only in the
    // subtree (containers ignored to prevent double-count). Plus subtract billed
    // and earned so we can show "remaining" / "left to earn".
    const projectedR = await pool.query(`
      WITH leaves AS (
        SELECT p.id, p.projected_revenue
        FROM projects p
        WHERE p.id = ANY($1::uuid[])
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
      )
      SELECT COALESCE(SUM(projected_revenue), 0)::float AS projected_total,
             COUNT(*) FILTER (WHERE projected_revenue IS NOT NULL)::int AS projected_count
      FROM leaves
    `, [subtreeIds]);

    // Lifetime totals — total hours and earned regardless of period filter.
    const lifetimeR = await pool.query(`
      SELECT COALESCE(SUM(te.hours), 0)::float AS total_hours,
             COALESCE(SUM(te.hours * COALESCE(pr.billing_rate,
               CASE LOWER(pr.project_type)
                 WHEN 'inspection' THEN 90
                 WHEN 're' THEN 100
                 WHEN 'resident engineer' THEN 100
                 WHEN 'permitting' THEN 90
                 ELSE 0
               END
             )), 0)::float AS earned_hourly
      FROM time_entries te
      JOIN projects pr ON pr.id = te.project_id
      WHERE te.project_id = ANY($1::uuid[])
    `, [subtreeIds]);

    const docsR = await pool.query(
      `SELECT * FROM permit_documents WHERE project_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
      [subtreeIds]
    );

    res.json({
      project: projR.rows[0],
      time_entries: entriesR.rows,
      permit_stages: stagesR.rows,
      permit_documents: docsR.rows,
      children: childrenR.rows,
      invoices: invoicesR.rows,
      months_with_activity: periodsR.rows,
      monthly_breakdown: monthlyBreakdownR.rows,
      projected: projectedR.rows[0],
      lifetime: lifetimeR.rows[0],
      subtree_size: subtreeIds.length,
      active_billable_count: activeBillableCount
    });
  } catch (e) {
    console.error('project detail error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PERMIT PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
// The permit pipeline ends at 'checklist'. "Billed" is no longer a permit stage —
// billing status is read from projects.billed_date (set by the Billing tab when
// the project is invoiced). Permit stage rows with stage='billed' from older
// data are still present in the table but ignored by the pipeline UI.
const PERMIT_STAGES = ['potential','started','submitted','approved','checklist'];

app.get('/api/permits', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        ps_cur.stage as current_stage,
        (SELECT json_agg(ps2 ORDER BY ps2.created_at) FROM permit_stages ps2 WHERE ps2.project_id=p.id) as stages,
        (SELECT json_agg(pd ORDER BY pd.created_at DESC) FROM permit_documents pd WHERE pd.project_id=p.id) as documents
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN LATERAL (
        SELECT stage FROM permit_stages WHERE project_id=p.id AND completed_at IS NULL
        ORDER BY created_at LIMIT 1
      ) ps_cur ON true
      WHERE p.project_type = 'permitting'
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/permits/:projectId/advance', async (req, res) => {
  const { updated_by, notes } = req.body;
  const { projectId } = req.params;
  try {
    // Fall back to whoever last touched the project's earliest stage if no name supplied
    let actor = updated_by;
    if (!actor) {
      const { rows: prior } = await pool.query(
        `SELECT updated_by FROM permit_stages
         WHERE project_id=$1 AND updated_by IS NOT NULL AND updated_by != ''
         ORDER BY created_at ASC LIMIT 1`, [projectId]
      );
      actor = prior[0]?.updated_by || 'unknown';
    }

    // Get current stage
    const { rows: current } = await pool.query(
      'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
      [projectId]
    );
    const currentStage = current[0]?.stage || 'potential';
    const nextIdx = PERMIT_STAGES.indexOf(currentStage) + 1;
    if (nextIdx >= PERMIT_STAGES.length) return res.json({ message: 'Already at final stage' });
    const nextStage = PERMIT_STAGES[nextIdx];

    // Complete current stage
    await pool.query(
      'UPDATE permit_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
      [notes, actor, projectId, currentStage]
    );
    // Create next stage
    await pool.query(
      'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [projectId, nextStage, actor]
    );
    res.json({ previous: currentStage, current: nextStage });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/permits/:projectId/documents', upload.single('file'), async (req, res) => {
  const { doc_type, uploaded_by, notes, revision_number } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [req.params.projectId, doc_type, req.file.originalname, req.file.filename, req.file.size, revision_number || 1, uploaded_by, notes]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Generic project documents endpoint — works for ANY project (design or permit).
// Reuses permit_documents table since the schema is identical for our needs.
// Used by the admin Design pipeline's "Final Map" upload UI, which doesn't
// care about revision tracking or doc_type categorization (just a single
// drop slot for the final drawing/PDF/DWG).
app.post('/api/projects/:projectId/documents', upload.single('file'), async (req, res) => {
  const { doc_type, uploaded_by, notes } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded — check file size (500MB max)' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
      VALUES ($1,$2,$3,$4,$5,1,$6,$7) RETURNING *
    `, [req.params.projectId, doc_type || 'document', req.file.originalname, req.file.filename, req.file.size, uploaded_by, notes]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/projects/:projectId/documents', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM permit_documents WHERE project_id = $1 ORDER BY created_at DESC`,
      [req.params.projectId]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/documents/:docId', async (req, res) => {
  try {
    // Look up file_path so we can also remove the file from disk.
    const { rows } = await pool.query(
      `DELETE FROM permit_documents WHERE id = $1 RETURNING file_path`,
      [req.params.docId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Document not found' });
    try { fs.unlinkSync(path.join(UPLOAD_DIR, rows[0].file_path)); }
    catch (e) { /* file may already be missing — non-fatal */ }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Diagnostic — useful when "PDF won't open" issues happen. Hit this in the
// browser to verify (a) where the server thinks UPLOAD_DIR is, (b) whether
// the directory actually has files, and (c) whether file_path values in the DB
// match what's on disk. Most "file not found" issues are caused by the Railway
// volume not being mounted at UPLOAD_DIR (so files write to ephemeral storage
// and disappear on redeploy).
app.get('/api/_debug/uploads', async (req, res) => {
  try {
    const onDisk = fs.readdirSync(UPLOAD_DIR);
    const dbDocs = await pool.query(
      `SELECT id, file_name, file_path, file_size, doc_type, created_at
       FROM permit_documents ORDER BY created_at DESC LIMIT 25`
    );
    const dbPaths = new Set(dbDocs.rows.map(d => d.file_path));
    const matched = onDisk.filter(f => dbPaths.has(f));
    const orphanFiles = onDisk.filter(f => !dbPaths.has(f));
    const missingFiles = dbDocs.rows.filter(d => !onDisk.includes(d.file_path));

    res.json({
      UPLOAD_DIR_resolved: UPLOAD_DIR,
      env_UPLOAD_DIR: process.env.UPLOAD_DIR || '(not set — using default)',
      __dirname,
      total_files_on_disk: onDisk.length,
      total_size_mb: (onDisk.reduce((s, f) => {
        try { return s + fs.statSync(path.join(UPLOAD_DIR, f)).size; } catch { return s; }
      }, 0) / (1024 * 1024)).toFixed(2),
      db_doc_count_recent: dbDocs.rows.length,
      matched_count: matched.length,
      orphan_file_count: orphanFiles.length,
      missing_file_count: missingFiles.length,
      first_5_files_on_disk: onDisk.slice(0, 5),
      missing_files_sample: missingFiles.slice(0, 5).map(d => ({
        file_name: d.file_name, file_path: d.file_path, doc_type: d.doc_type
      })),
      hint: missingFiles.length > 0
        ? '⚠ Files in DB but not on disk → Railway volume is NOT mounted at UPLOAD_DIR. Set the UPLOAD_DIR env var to your volume mount path (e.g. /data/uploads) and redeploy.'
        : (onDisk.length === 0 ? 'No files on disk yet — upload a test file via the UI then refresh this endpoint.' : 'Looks healthy.')
    });
  } catch (e) {
    res.status(500).json({ error: e.message, UPLOAD_DIR, __dirname });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MIGRATION ENDPOINTS — admin tools to fix legacy data
// ─────────────────────────────────────────────────────────────────────────────
const { ensureRollupChain } = require('./portal_module');

// Re-nest existing real (non-rollup) projects under their proper rollup
// hierarchy. Use this once after the v3 schema arrives — projects created
// before auto-nesting was wired up are still flat at root with no parent_id.
// This walks every real project, calls ensureRollupChain to find/create
// the correct Client → Service Area → Project Type → Team folder chain,
// and updates parent_id to point at the team-level rollup.
//
// IDEMPOTENT: running it twice is safe — projects already nested under the
// correct team folder are skipped (we check if the current parent is the
// team rollup we'd assign).
//
// Returns a JSON summary with counts so you can see what moved.
app.post('/api/_admin/migrate-nesting', async (req, res) => {
  let processed = 0, moved = 0, skipped = 0, failed = 0;
  const errors = [];
  try {
    // Get every real project (no rollups, since rollups ARE the nesting structure)
    const { rows: projects } = await pool.query(
      `SELECT id, name, client_id, concentrator_id, project_type_id, job_id, parent_id
       FROM projects
       WHERE COALESCE(is_rollup, false) = false
       ORDER BY created_at ASC`
    );
    for (const p of projects) {
      processed++;
      try {
        // Skip projects without a client — they can't be nested.
        if (!p.client_id) { skipped++; continue; }

        const correctParent = await ensureRollupChain(pool, {
          client_id:       p.client_id,
          concentrator_id: p.concentrator_id,
          project_type_id: p.project_type_id,
          job_id:          p.job_id
        });

        if (!correctParent) { skipped++; continue; }

        if (p.parent_id === correctParent) {
          // Already in the right place — no-op.
          skipped++;
        } else {
          await pool.query('UPDATE projects SET parent_id = $1 WHERE id = $2',
            [correctParent, p.id]);
          moved++;
        }
      } catch (e) {
        failed++;
        errors.push({ project_id: p.id, name: p.name, error: e.message });
      }
    }
    res.json({
      processed, moved, skipped, failed,
      errors: errors.slice(0, 20),  // cap so response stays small
      hint: moved === 0 && processed > 0
        ? 'No projects needed re-nesting — they were already in their correct rollup folders.'
        : `Re-nested ${moved} of ${processed} projects.`
    });
  } catch (e) {
    res.status(500).json({ error: e.message, processed, moved, failed });
  }
});

// Adopt orphan files — files that exist on disk in UPLOAD_DIR but have no
// matching row in permit_documents. Common causes:
//   - Files uploaded under an older system that didn't write to permit_documents
//   - Files that survived a DB wipe/restore but the DB lost its records
//
// This endpoint scans UPLOAD_DIR, compares to permit_documents.file_path, and
// surfaces the orphans. POSTing with { project_id, file_path } adopts a single
// orphan file by inserting a permit_documents row for it. Use the GET first
// to see what's available, then POST one per file you want to attach.
app.get('/api/_admin/orphan-files', async (req, res) => {
  try {
    const onDisk = fs.readdirSync(UPLOAD_DIR);
    const { rows: dbDocs } = await pool.query(
      `SELECT file_path FROM permit_documents`
    );
    const dbPaths = new Set(dbDocs.map(d => d.file_path));
    const orphans = onDisk
      .filter(f => !dbPaths.has(f))
      .map(f => {
        const stat = fs.statSync(path.join(UPLOAD_DIR, f));
        // Recover the original filename — our naming convention is
        // ${uuid}_${originalname}, so split on the first underscore after
        // the uuid (uuids are 36 chars).
        const original = f.length > 37 && f[36] === '_' ? f.substring(37) : f;
        return {
          file_path: f,
          file_name: original,
          file_size: stat.size,
          modified: stat.mtime.toISOString()
        };
      })
      .sort((a, b) => b.modified.localeCompare(a.modified));
    res.json({
      orphan_count: orphans.length,
      orphans,
      hint: orphans.length === 0
        ? 'No orphan files — every file on disk is accounted for in the database.'
        : `${orphans.length} files on disk have no matching permit_documents row. POST {project_id, file_path} to /api/_admin/adopt-orphan to attach one.`
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/_admin/adopt-orphan', async (req, res) => {
  const { project_id, file_path, doc_type, uploaded_by } = req.body;
  if (!project_id || !file_path) {
    return res.status(400).json({ error: 'project_id and file_path required' });
  }
  try {
    // Verify the file actually exists on disk
    const fullPath = path.join(UPLOAD_DIR, file_path);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found on disk: ' + file_path });
    }
    const stat = fs.statSync(fullPath);
    // Verify project exists
    const proj = await pool.query('SELECT name FROM projects WHERE id = $1', [project_id]);
    if (!proj.rows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Recover original filename from our uuid-prefixed naming convention
    const original = file_path.length > 37 && file_path[36] === '_'
      ? file_path.substring(37)
      : file_path;
    const { rows } = await pool.query(`
      INSERT INTO permit_documents
        (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
      VALUES ($1, $2, $3, $4, $5, 1, $6, $7)
      RETURNING *`,
      [project_id, doc_type || 'document', original, file_path, stat.size,
       uploaded_by || 'migrated', 'Adopted from disk via migration tool']
    );
    res.json({ adopted: rows[0], project_name: proj.rows[0].name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Bulk adopt — assigns ALL orphan files to a single project at once. Useful
// when files were uploaded for a specific project but the DB rows got lost.
// More commonly, use /api/_admin/orphan-files + targeted POSTs to /adopt-orphan
// for each file individually.
app.post('/api/_admin/adopt-orphans-bulk', async (req, res) => {
  const { project_id, doc_type, uploaded_by } = req.body;
  if (!project_id) return res.status(400).json({ error: 'project_id required' });
  try {
    const proj = await pool.query('SELECT name FROM projects WHERE id = $1', [project_id]);
    if (!proj.rows.length) return res.status(404).json({ error: 'Project not found' });

    const onDisk = fs.readdirSync(UPLOAD_DIR);
    const { rows: dbDocs } = await pool.query(`SELECT file_path FROM permit_documents`);
    const dbPaths = new Set(dbDocs.map(d => d.file_path));
    const orphans = onDisk.filter(f => !dbPaths.has(f));

    let adopted = 0;
    for (const f of orphans) {
      const stat = fs.statSync(path.join(UPLOAD_DIR, f));
      const original = f.length > 37 && f[36] === '_' ? f.substring(37) : f;
      await pool.query(`
        INSERT INTO permit_documents
          (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1, $2, $3, $4, $5, 1, $6, $7)`,
        [project_id, doc_type || 'document', original, f, stat.size,
         uploaded_by || 'migrated', 'Bulk-adopted from disk via migration tool']
      );
      adopted++;
    }
    res.json({ adopted, project_name: proj.rows[0].name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BUDGETS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/budgets', async (req, res) => {
  const { project_id } = req.query;
  try {
    let q, params;
    if (project_id) {
      q = `SELECT b.*, p.name as project_name FROM budgets b
           LEFT JOIN projects p ON p.id = b.project_id
           WHERE b.project_id = $1 ORDER BY b.created_at DESC`;
      params = [project_id];
    } else {
      q = `SELECT b.*, p.name as project_name FROM budgets b
           LEFT JOIN projects p ON p.id = b.project_id
           ORDER BY b.created_at DESC`;
      params = [];
    }
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/budgets/:id/summary', async (req, res) => {
  try {
    // Get the budget
    const { rows: budgetRows } = await pool.query(
      `SELECT b.*, p.name as project_name FROM budgets b
       LEFT JOIN projects p ON p.id = b.project_id WHERE b.id = $1`, [req.params.id]
    );
    if (!budgetRows.length) return res.status(404).json({ error: 'Budget not found' });
    const budget = budgetRows[0];

    // Get all codes with spent amounts. Spent = sum of earned revenue from
    // every project linked to this budget_code, optionally filtered by job:
    // if budget_codes.job_id is set, ONLY projects with the matching job count
    // toward the code's "spent" total. NULL job_id = applies to any job.
    const { rows: codes } = await pool.query(`
      SELECT bc.*,
        j.name as job_name,
        COALESCE(SUM(
          CASE
            WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
            WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
            ELSE 0
          END
        ), 0) as spent,
        COUNT(proj.id) as project_count,
        json_agg(json_build_object(
          'id', proj.id, 'name', proj.name, 'status', proj.status,
          'project_type', proj.project_type,
          'job_id', proj.job_id,
          'billable', CASE
            WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
            WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
            ELSE 0
          END
        )) FILTER (WHERE proj.id IS NOT NULL) as projects
      FROM budget_codes bc
      LEFT JOIN jobs j ON j.id = bc.job_id
      LEFT JOIN projects proj ON proj.budget_code_id = bc.id
        AND (bc.job_id IS NULL OR proj.job_id = bc.job_id)
      WHERE bc.budget_id = $1
      GROUP BY bc.id, j.name
      ORDER BY bc.code
    `, [req.params.id]);

    const totalAllocated = codes.reduce((s, c) => s + parseFloat(c.allocated_amount || 0), 0);
    const totalSpent = codes.reduce((s, c) => s + parseFloat(c.spent || 0), 0);

    res.json({
      ...budget,
      codes,
      total_allocated: totalAllocated,
      total_spent: totalSpent,
      total_remaining: totalAllocated - totalSpent
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/budgets', async (req, res) => {
  const { project_id, name, total_amount, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO budgets (project_id, name, total_amount, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [project_id, name, total_amount || 0, notes || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/budgets/:id', async (req, res) => {
  const { name, total_amount, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE budgets SET name=$1, total_amount=$2, notes=$3 WHERE id=$4 RETURNING *`,
      [name, total_amount, notes || null, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/budgets/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM budgets WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET CODES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/budget-codes', async (req, res) => {
  const { budget_id } = req.query;
  try {
    const q = budget_id
      ? 'SELECT * FROM budget_codes WHERE budget_id=$1 ORDER BY code'
      : 'SELECT bc.*, b.name as budget_name FROM budget_codes bc JOIN budgets b ON b.id=bc.budget_id ORDER BY b.name, bc.code';
    const { rows } = await pool.query(q, budget_id ? [budget_id] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/budget-codes', async (req, res) => {
  const { budget_id, code, description, allocated_amount, job_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO budget_codes (budget_id, code, description, allocated_amount, job_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [budget_id, code, description || null, allocated_amount || 0, job_id || null]
    );
    // Recalculate budget total from sum of codes
    await pool.query(
      `UPDATE budgets SET total_amount = (
        SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
      ) WHERE id=$1`, [budget_id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/budget-codes/:id', async (req, res) => {
  const { code, description, allocated_amount, job_id } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3, job_id=$4
       WHERE id=$5 RETURNING *`,
      [code, description || null, allocated_amount || 0, job_id || null, req.params.id]
    );
    // Recalculate budget total
    if (rows[0]) {
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [rows[0].budget_id]
      );
    }
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/budget-codes/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM budget_codes WHERE id=$1 RETURNING budget_id', [req.params.id]);
    // Recalculate budget total
    if (rows[0]) {
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [rows[0].budget_id]
      );
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONCENTRATORS / SERVICE AREAS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/concentrators', async (req, res) => {
  const { contract_label } = req.query;
  try {
    const q = contract_label
      ? 'SELECT * FROM concentrators WHERE contract_label=$1 AND active=true ORDER BY area_name'
      : 'SELECT * FROM concentrators WHERE active=true ORDER BY contract_label, area_name';
    const { rows } = await pool.query(q, contract_label ? [contract_label] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/concentrators', async (req, res) => {
  const { contract_label, area_name, work_order_number, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO concentrators (contract_label, area_name, work_order_number, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [contract_label, area_name, work_order_number || null, notes || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Debug: returns the exact list of projects counted as "active" by the
// dashboard tile. Visible from the dashboard for troubleshooting.
app.get('/api/dashboard/active-list', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.name, p.status, p.work_order_number,
             cl.name AS client_name,
             j.name AS job_name,
             pp.name AS parent_name
      FROM projects p
      LEFT JOIN jobs j ON j.id = p.job_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      WHERE p.status='active'
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND p.job_id IS NOT NULL
        AND LOWER(COALESCE(j.name, '')) <> 'other'
      ORDER BY cl.name, pp.name, p.name
    `);
    res.json({ count: rows.length, projects: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Budget summary broken down by area/concentrator
app.get('/api/budgets/:id/by-area', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id as concentrator_id,
        c.area_name,
        c.work_order_number,
        c.contract_label,
        COUNT(DISTINCT p.id) as project_count,
        COALESCE(SUM(
          CASE
            WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
            WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
            ELSE 0
          END
        ), 0) as spent,
        json_agg(json_build_object(
          'id', p.id, 'name', p.name, 'project_type', p.project_type,
          'status', p.status,
          'earned', CASE
            WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
            WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
            ELSE 0
          END
        )) FILTER (WHERE p.id IS NOT NULL) as projects
      FROM concentrators c
      LEFT JOIN projects p ON p.concentrator_id = c.id
      WHERE c.active = true
      GROUP BY c.id, c.area_name, c.work_order_number, c.contract_label
      ORDER BY c.contract_label, c.area_name
    `);

    // Get budget total
    const { rows: budgetRows } = await pool.query('SELECT total_amount FROM budgets WHERE id=$1', [req.params.id]);
    const budgetTotal = budgetRows[0] ? parseFloat(budgetRows[0].total_amount) : 0;
    const totalSpent = rows.reduce((s, r) => s + parseFloat(r.spent || 0), 0);

    res.json({
      budget_total: budgetTotal,
      total_spent: totalSpent,
      total_remaining: budgetTotal - totalSpent,
      areas: rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// POTENTIAL PERMITS (submitted by Design, reviewed by Permitting)
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/potential-permits', async (req, res) => {
  const { status } = req.query;
  try {
    const q = status
      ? 'SELECT * FROM potential_permits WHERE status=$1 ORDER BY created_at DESC'
      : 'SELECT * FROM potential_permits ORDER BY created_at DESC';
    const { rows } = await pool.query(q, status ? [status] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/potential-permits', async (req, res) => {
  const { sr_hwy, county, route, notes, submitted_by } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO potential_permits (sr_hwy, county, route, notes, submitted_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [sr_hwy || null, county || null, route || null, notes || null, submitted_by || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/potential-permits/:id', async (req, res) => {
  const { status, reviewed_by, project_id, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE potential_permits SET status=$1, reviewed_by=$2, project_id=$3, notes=COALESCE($4,notes), updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [status || 'pending', reviewed_by || null, project_id || null, notes, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/potential-permits/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM potential_permits WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PIPELINE — stages: potential → started → review_process → completed
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/design', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, cl.name as client_name, co.contract_number,
        (SELECT stage FROM design_stages WHERE project_id=p.id AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1) as current_stage
      FROM projects p
      LEFT JOIN clients cl ON cl.id=p.client_id
      LEFT JOIN contracts co ON co.id=p.contract_id
      WHERE p.project_type='design'
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/design/:projectId/advance', async (req, res) => {
  const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
  const { updated_by, notes } = req.body;
  const { projectId } = req.params;
  try {
    const { rows: cur } = await pool.query(
      'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at DESC LIMIT 1',
      [projectId]
    );
    const currentStage = cur[0]?.stage || 'potential';
    const nextIdx = DESIGN_STAGES.indexOf(currentStage) + 1;
    if (nextIdx >= DESIGN_STAGES.length) return res.json({ message: 'Already at final stage' });
    const nextStage = DESIGN_STAGES[nextIdx];

    // Complete current stage
    await pool.query(
      'UPDATE design_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
      [notes, updated_by, projectId, currentStage]
    );
    // Create next stage
    await pool.query(
      'INSERT INTO design_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [projectId, nextStage, updated_by]
    );
    // If completed, mark project
    if (nextStage === 'completed') {
      await pool.query(
        `UPDATE projects SET status='completed', completed_date=CURRENT_DATE WHERE id=$1`,
        [projectId]
      );
    }
    res.json({ previous: currentStage, current: nextStage });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    const [activeR, unbilledR, monthRevR, ytdRevR, recentR, alertR] = await Promise.all([
      // Active = leaf projects (anything without children). Counts all active work.
      pool.query(`
        SELECT COUNT(*) FROM projects p
        WHERE p.status='active'
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
      `),
      pool.query(`
        SELECT COUNT(*), COALESCE(SUM(expected_revenue),0) as total
        FROM projects p
        WHERE p.status='completed' AND p.billed_date IS NULL
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
      `),
      // Monthly revenue: hours logged this month × rate (infer rate from project_type if billing_rate is NULL)
      pool.query(`
        SELECT COALESCE(SUM(te.hours * COALESCE(p.billing_rate,
          CASE LOWER(p.project_type)
            WHEN 'inspection' THEN 90
            WHEN 're' THEN 100
            WHEN 'resident engineer' THEN 100
            WHEN 'permitting' THEN 90
            ELSE 0
          END
        )), 0) AS rev
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        WHERE te.entry_date >= $1
      `, [monthStart]),
      // YTD revenue: ALL earned revenue this year (not just billed).
      // Leaf projects only (no children) to avoid double-counting rolled-up hours.
      pool.query(`
        SELECT COALESCE(SUM(
          CASE
            WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN COALESCE(p.expected_revenue, 0)
            ELSE COALESCE(
              (SELECT SUM(te.hours) FROM time_entries te
               WHERE te.project_id = p.id
                 AND EXTRACT(YEAR FROM te.entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)),
              0
            ) * COALESCE(p.billing_rate,
              CASE LOWER(p.project_type)
                WHEN 'inspection' THEN 90
                WHEN 're' THEN 100
                WHEN 'resident engineer' THEN 100
                WHEN 'permitting' THEN 90
                ELSE 0
              END
            )
          END
        ), 0) AS rev
        FROM projects p
        WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
          AND p.status IN ('active','completed','billed')
      `),
      pool.query(`
        SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
               cl.name as client_name, p.expected_hours, p.actual_hours,
               p.expected_revenue, p.created_at, p.parent_id,
               p.billing_rate, p.billing_type,
               pp.name as parent_name, pp.parent_id as grandparent_id,
               con.area_name as concentrator_area,
               COALESCE((SELECT SUM(te.hours) FROM time_entries te WHERE te.project_id = p.id), 0) as own_hours,
               COALESCE((
                 WITH RECURSIVE tree AS (
                   SELECT p.id AS tid
                   UNION ALL
                   SELECT c.id FROM projects c JOIN tree t ON c.parent_id = t.tid
                 )
                 SELECT SUM(
                   CASE
                     WHEN leaf.billing_type = 'footage' AND leaf.status IN ('completed','billed')
                       THEN COALESCE(leaf.expected_revenue, 0)
                     ELSE COALESCE((
                       SELECT SUM(te2.hours) FROM time_entries te2
                       WHERE te2.project_id = leaf.id
                         AND EXTRACT(YEAR FROM te2.entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                     ), 0) * COALESCE(leaf.billing_rate,
                       CASE LOWER(leaf.project_type)
                         WHEN 'inspection' THEN 90 WHEN 're' THEN 100 WHEN 'resident engineer' THEN 100 WHEN 'permitting' THEN 90 ELSE 0
                       END)
                   END
                 )
                 FROM projects leaf
                 WHERE leaf.id IN (SELECT tid FROM tree)
                   AND NOT EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = leaf.id)
               ), 0) as ytd_revenue
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        LEFT JOIN projects pp ON pp.id=p.parent_id
        LEFT JOIN concentrators con ON con.id=p.concentrator_id
        WHERE p.status='active'
        ORDER BY p.created_at DESC
      `),
      pool.query(`
        SELECT p.id, p.name, p.project_type, p.work_order_number, p.expected_revenue,
               cl.name as client_name, p.completed_date
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        WHERE p.status='completed' AND p.billed_date IS NULL
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        ORDER BY p.completed_date ASC
      `)
    ]);

    res.json({
      active_projects: parseInt(activeR.rows[0].count),
      unbilled_count: parseInt(unbilledR.rows[0].count),
      unbilled_total: parseFloat(unbilledR.rows[0].total),
      month_revenue: parseFloat(monthRevR.rows[0].rev),
      ytd_revenue: parseFloat(ytdRevR.rows[0].rev),
      recent_projects: recentR.rows,
      unbilled_projects: alertR.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE
// ─────────────────────────────────────────────────────────────────────────────

// Monthly summary — all months for a given year
app.get('/api/revenue/monthly-summary', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      WITH hourly_monthly AS (
        SELECT
          EXTRACT(MONTH FROM te.entry_date)::int as month,
          COALESCE(SUM(te.hours), 0) as hours,
          COALESCE(SUM(te.hours * p.billing_rate), 0) as earned
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        WHERE EXTRACT(YEAR FROM te.entry_date) = $1
        GROUP BY month
      ),
      footage_monthly AS (
        SELECT
          COALESCE(EXTRACT(MONTH FROM p.completed_date), EXTRACT(MONTH FROM p.billed_date), EXTRACT(MONTH FROM p.start_date))::int as month,
          COALESCE(SUM(p.expected_revenue), 0) as earned
        FROM projects p
        WHERE p.billing_type = 'footage'
          AND p.status IN ('completed', 'billed')
          AND EXTRACT(YEAR FROM COALESCE(p.completed_date, p.billed_date, p.start_date)) = $1
        GROUP BY month
      ),
      billed_monthly AS (
        SELECT
          EXTRACT(MONTH FROM p.billed_date)::int as month,
          COALESCE(SUM(
            CASE
              WHEN p.billing_type = 'footage' THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          ), 0) as billed
        FROM projects p
        WHERE p.billed_date IS NOT NULL
          AND EXTRACT(YEAR FROM p.billed_date) = $1
        GROUP BY month
      )
      SELECT
        s.month,
        COALESCE(h.hours, 0) as hours,
        COALESCE(h.earned, 0) + COALESCE(f.earned, 0) as earned,
        COALESCE(b.billed, 0) as billed
      FROM generate_series(1, 12) AS s(month)
      LEFT JOIN hourly_monthly h ON h.month = s.month
      LEFT JOIN footage_monthly f ON f.month = s.month
      LEFT JOIN billed_monthly b ON b.month = s.month
      ORDER BY s.month
    `, [year]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Revenue by client — filterable by month/year
app.get('/api/revenue/by-client', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month; // optional
  try {
    let dateFilter, params;
    if (month) {
      dateFilter = `AND EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
        AND EXTRACT(MONTH FROM te2.entry_date) = $2
        AND EXTRACT(YEAR FROM te2.entry_date) = $1
      )`;
      params = [year, month];
    } else {
      dateFilter = `AND (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL)`;
      params = [year];
    }

    // Parameterized lateral filter — never interpolate user input into SQL strings
    const lateralFilter = month
      ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
      : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

    const { rows } = await pool.query(`
      SELECT
        cl.id as client_id,
        cl.name as client_name,
        COUNT(DISTINCT p.id) as project_count,
        COALESCE(SUM(p.expected_revenue), 0) as expected_total,
        COALESCE(SUM(COALESCE(te_hrs.hrs, 0) * p.billing_rate), 0) as earned_hourly,
        COALESCE(SUM(
          CASE WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed')
          THEN p.expected_revenue ELSE 0 END
        ), 0) as earned_footage,
        COALESCE(SUM(
          CASE WHEN p.billed_date IS NOT NULL THEN
            CASE
              WHEN p.billing_type = 'footage' THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          ELSE 0 END
        ), 0) as billed_total,
        COALESCE(SUM(COALESCE(te_hrs.hrs, 0)), 0) as total_hours
      FROM clients cl
      LEFT JOIN projects p ON p.client_id = cl.id ${dateFilter}
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(te.hours), 0) as hrs
        FROM time_entries te
        WHERE te.project_id = p.id
        ${lateralFilter}
      ) te_hrs ON true
      GROUP BY cl.id, cl.name
      ORDER BY client_name
    `, params);

    // Calculate totals
    rows.forEach(r => {
      r.earned_total = parseFloat(r.earned_hourly) + parseFloat(r.earned_footage);
    });

    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Detailed project breakdown for a specific month
app.get('/api/revenue/details', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month;
  try {
    let whereClause, params;
    if (month) {
      whereClause = `WHERE EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
        AND EXTRACT(MONTH FROM te2.entry_date) = $2
        AND EXTRACT(YEAR FROM te2.entry_date) = $1
      ) OR (p.billing_type = 'footage' AND EXTRACT(MONTH FROM p.start_date) = $2 AND EXTRACT(YEAR FROM p.start_date) = $1)`;
      params = [year, month];
    } else {
      whereClause = `WHERE (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL OR EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id AND EXTRACT(YEAR FROM te2.entry_date) = $1
      ))`;
      params = [year];
    }

    const hoursFilter = month
      ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
      : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

    const { rows } = await pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
             p.billed_date, p.parent_id,
             cl.name as client_name,
             co.contract_number,
             COALESCE(te_sum.hrs, 0) as period_hours,
             CASE
               WHEN p.billing_type = 'hourly' THEN COALESCE(te_sum.hrs, 0) * COALESCE(p.billing_rate,
                 CASE LOWER(p.project_type)
                   WHEN 'inspection' THEN 90
                   WHEN 're' THEN 100
                   WHEN 'resident engineer' THEN 100
                   WHEN 'permitting' THEN 90
                   ELSE 0
                 END)
               WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
               ELSE 0
             END as earned
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(te.hours), 0) as hrs
        FROM time_entries te WHERE te.project_id = p.id ${hoursFilter}
      ) te_sum ON true
      ${whereClause}
      ORDER BY cl.name, p.project_type, p.name
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/revenue/projected-total', async (req, res) => {
  try {
    // Total = sum of projected_revenue from LEAVES only (no double-counting).
    // Also returns count of leaves with a projected value vs. without, so the
    // UI can show "X of Y projects" coverage if needed.
    const totalR = await pool.query(`
      SELECT
        COALESCE(SUM(projected_revenue), 0)::float AS total,
        COUNT(*) FILTER (WHERE projected_revenue IS NOT NULL)::int AS with_projected,
        COUNT(*) FILTER (WHERE projected_revenue IS NULL)::int AS without_projected
      FROM projects p
      WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND p.status IN ('active', 'completed')
    `);
    // Per-client breakdown
    const byClientR = await pool.query(`
      SELECT cl.name AS client_name,
             COALESCE(SUM(p.projected_revenue), 0)::float AS projected
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND p.status IN ('active', 'completed')
        AND p.projected_revenue IS NOT NULL
      GROUP BY cl.name
      ORDER BY projected DESC
    `);
    // Per-project list: every leaf that has a projected_revenue, with parent
    // ancestry so the user can see which contracts are contributing.
    const projectsR = await pool.query(`
      SELECT p.id, p.name, p.projected_revenue, p.status, p.work_order_number,
             cl.name AS client_name,
             pp.name AS parent_name,
             gp.name AS grandparent_name,
             j.name AS job_name
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN projects gp ON gp.id = pp.parent_id
      LEFT JOIN jobs j ON j.id = p.job_id
      WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND p.status IN ('active', 'completed')
        AND p.projected_revenue IS NOT NULL
      ORDER BY cl.name, gp.name NULLS LAST, pp.name NULLS LAST, p.name
    `);
    res.json({
      total: parseFloat(totalR.rows[0].total) || 0,
      with_projected: totalR.rows[0].with_projected,
      without_projected: totalR.rows[0].without_projected,
      by_client: byClientR.rows,
      projects: projectsR.rows
    });
  } catch (e) {
    console.error('projected-total error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/revenue/unbilled', async (req, res) => {
  try {
    // ── ONE-TIME projects: one row per project (existing logic) ──
    // Filter out monthly-cadence projects since they're handled below.
    const oneTimeR = await pool.query(`
      SELECT p.id, p.id::text as queue_key, p.name, p.project_type, p.status,
        p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
        p.actual_hours, p.work_order_number, p.parent_id, p.billing_cadence,
        p.bill_hold_until,
        cl.name as client_name,
        co.contract_number,
        con.area_name as concentrator_area,
        pp.name as parent_name,
        gp.name as grandparent_name,
        NULL::int as period_year, NULL::int as period_month,
        COALESCE(SUM(te.hours),0) as logged_hours,
        CASE
          WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount
          WHEN p.billing_type = 'hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
          WHEN p.billing_type = 'footage' THEN p.expected_revenue
          ELSE 0
        END as earned_amount,
        CASE
          WHEN p.status = 'completed' THEN 'completed'
          WHEN p.billing_type = 'hourly' AND p.status = 'active' THEN 'in_progress'
          ELSE 'other'
        END as bill_kind
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      LEFT JOIN concentrators con ON con.id = p.concentrator_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN projects gp ON gp.id = pp.parent_id
      WHERE p.billed_date IS NULL
        AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND (
          p.status = 'completed'
          OR (p.status = 'active' AND p.billing_type = 'hourly' AND EXISTS (
            SELECT 1 FROM time_entries WHERE project_id = p.id
          ))
        )
      GROUP BY p.id, cl.name, co.contract_number, con.area_name, pp.name, gp.name
      HAVING (
        p.billing_type = 'footage'
        OR COALESCE(SUM(te.hours),0) > 0
      )
    `);

    // ── MONTHLY projects: one row per (project, year, month) that has hours
    // but no matching invoice line item dated in that period.
    const monthlyR = await pool.query(`
      WITH project_months AS (
        SELECT
          p.id as project_id,
          EXTRACT(YEAR FROM te.entry_date)::int AS y,
          EXTRACT(MONTH FROM te.entry_date)::int AS mo,
          SUM(te.hours)::float AS hrs
        FROM projects p
        JOIN time_entries te ON te.project_id = p.id
        WHERE p.billing_cadence = 'monthly'
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        GROUP BY p.id, y, mo
      )
      SELECT p.id, (p.id::text || '-' || pm.y::text || '-' || pm.mo::text) as queue_key,
        p.name, p.project_type, p.status,
        p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
        p.actual_hours, p.work_order_number, p.parent_id, p.billing_cadence,
        p.bill_hold_until,
        cl.name as client_name, co.contract_number,
        con.area_name as concentrator_area,
        pp.name as parent_name, gp.name as grandparent_name,
        pm.y as period_year, pm.mo as period_month,
        pm.hrs as logged_hours,
        pm.hrs * p.billing_rate as earned_amount,
        'monthly' as bill_kind
      FROM project_months pm
      JOIN projects p ON p.id = pm.project_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN concentrators con ON con.id = p.concentrator_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN projects gp ON gp.id = pp.parent_id
      WHERE NOT EXISTS (
        SELECT 1 FROM invoice_items ii
        JOIN invoices inv ON inv.id = ii.invoice_id
        WHERE ii.project_id = pm.project_id
          AND EXTRACT(YEAR FROM inv.invoice_date)::int = pm.y
          AND EXTRACT(MONTH FROM inv.invoice_date)::int = pm.mo
      )
    `);

    // Union and sort: client → parent → name → period
    const all = [...oneTimeR.rows, ...monthlyR.rows];
    all.sort((a, b) => {
      const ca = a.client_name || '', cb = b.client_name || '';
      if (ca !== cb) return ca.localeCompare(cb);
      const pa = a.parent_name || '', pb = b.parent_name || '';
      if (pa !== pb) return pa.localeCompare(pb);
      const na = a.name || '', nb = b.name || '';
      if (na !== nb) return na.localeCompare(nb);
      const ya = a.period_year || 0, yb = b.period_year || 0;
      if (ya !== yb) return ya - yb;
      return (a.period_month || 0) - (b.period_month || 0);
    });
    res.json(all);
  } catch (e) {
    console.error('unbilled queue error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

// List invoices with items, grouped by month
app.get('/api/invoices', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT i.*,
        cl.name as client_name,
        EXTRACT(MONTH FROM i.invoice_date)::int as month,
        json_agg(json_build_object(
          'id', ii.id, 'project_id', ii.project_id,
          'description', ii.description, 'quantity', ii.quantity,
          'unit', ii.unit, 'rate', ii.rate, 'amount', ii.amount,
          'project_name', p.name, 'project_type', p.project_type,
          'work_order_number', p.work_order_number
        )) FILTER (WHERE ii.id IS NOT NULL) as items
      FROM invoices i
      LEFT JOIN clients cl ON cl.id = i.client_id
      LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
      LEFT JOIN projects p ON p.id = ii.project_id
      WHERE EXTRACT(YEAR FROM i.invoice_date) = $1
      GROUP BY i.id, cl.name
      ORDER BY i.invoice_date DESC
    `, [year]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete an invoice and optionally wipe associated hours + unbill projects
app.delete('/api/invoices/:id', async (req, res) => {
  const { wipe_hours } = req.query; // ?wipe_hours=true
  try {
    // Get invoice items to find linked projects
    const { rows: items } = await pool.query(
      'SELECT project_id FROM invoice_items WHERE invoice_id=$1', [req.params.id]
    );
    const projectIds = items.map(i => i.project_id).filter(Boolean);

    // Unbill linked projects (set status back to completed, clear billed_date)
    for (const pid of projectIds) {
      await pool.query(
        `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 AND status='billed'`,
        [pid]
      );
    }

    // Optionally wipe hours for those projects
    if (wipe_hours === 'true') {
      for (const pid of projectIds) {
        await pool.query('DELETE FROM time_entries WHERE project_id=$1', [pid]);
        await updateProjectHours(pid);
      }
    }

    // Delete the invoice (cascade deletes invoice_items)
    await pool.query('DELETE FROM invoices WHERE id=$1', [req.params.id]);

    res.json({ ok: true, unbilled_projects: projectIds.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Unbill a single project (reverse billing, keep hours)
app.post('/api/projects/:id/unbill', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    // Remove invoice items referencing this project
    await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete a billed project entirely (removes from revenue, hours, everything)
app.delete('/api/projects/:id/with-hours', async (req, res) => {
  try {
    // Delete time entries first
    await pool.query('DELETE FROM time_entries WHERE project_id=$1', [req.params.id]);
    // Delete invoice items
    await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [req.params.id]);
    // Get parent before deleting
    const { rows: proj } = await pool.query('SELECT parent_id FROM projects WHERE id=$1', [req.params.id]);
    // Delete the project
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    // Recalculate parent hours
    if (proj[0] && proj[0].parent_id) {
      await updateProjectHours(proj[0].parent_id);
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/reports/hours', async (req, res) => {
  const { month, year } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT
        s.name as staff_name,
        p.name as project_name,
        p.work_order_number,
        p.project_type,
        cl.name as client_name,
        te.entry_date,
        te.hours,
        te.job_title
      FROM time_entries te
      JOIN projects p ON p.id = te.project_id
      LEFT JOIN staff s ON s.id = te.staff_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      WHERE EXTRACT(MONTH FROM te.entry_date)=$1
        AND EXTRACT(YEAR FROM te.entry_date)=$2
      ORDER BY s.name, te.entry_date
    `, [m, y]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/reports/billing', async (req, res) => {
  const { month, year } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();
  try {
    // ── PART 1: One-time projects ──
    // Same shape as before — one row per project. Excludes containers.
    // Includes monthly_year, monthly_month columns set to NULL so the union works.
    const oneTimeR = await pool.query(`
      SELECT p.id, p.id as queue_key, p.name, p.project_type, p.billing_type, p.billing_rate,
             p.footage, p.miles, p.expected_revenue, p.expected_hours, p.actual_hours,
             p.status, p.work_order_number, p.bill_hold_until, p.billing_cadence,
             cl.name as client_name, cl.is_rus, co.contract_number,
             NULL::int as period_year, NULL::int as period_month,
             COALESCE(SUM(te.hours),0) as logged_hours,
             CASE
               WHEN p.billing_type='footage' THEN p.expected_revenue
               WHEN p.billing_type='hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
             END as billable_amount
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
        AND EXTRACT(MONTH FROM te.entry_date)=$1
        AND EXTRACT(YEAR FROM te.entry_date)=$2
      WHERE p.billed_date IS NULL
        AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')
        AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        AND (p.status = 'completed'
          OR EXISTS(SELECT 1 FROM time_entries te2 WHERE te2.project_id=p.id
            AND EXTRACT(MONTH FROM te2.entry_date)=$1
            AND EXTRACT(YEAR FROM te2.entry_date)=$2))
      GROUP BY p.id, cl.name, cl.is_rus, co.contract_number
    `, [m, y]);

    // ── PART 2: Monthly projects — one row per UNBILLED month ──
    // For each monthly project, find every (year, month) that has time entries
    // but NO matching invoice_items row (where the invoice_date falls in that
    // same month). Each such (project, month) becomes a queue row.
    const monthlyR = await pool.query(`
      WITH project_months AS (
        SELECT
          p.id as project_id,
          EXTRACT(YEAR FROM te.entry_date)::int AS y,
          EXTRACT(MONTH FROM te.entry_date)::int AS mo,
          SUM(te.hours) AS hrs
        FROM projects p
        JOIN time_entries te ON te.project_id = p.id
        WHERE p.billing_cadence = 'monthly'
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
        GROUP BY p.id, y, mo
      )
      SELECT p.id, (p.id::text || '-' || pm.y::text || '-' || pm.mo::text) as queue_key,
             p.name, p.project_type, p.billing_type, p.billing_rate,
             p.footage, p.miles, p.expected_revenue, p.expected_hours, p.actual_hours,
             p.status, p.work_order_number, p.bill_hold_until, p.billing_cadence,
             cl.name as client_name, cl.is_rus, co.contract_number,
             pm.y as period_year, pm.mo as period_month,
             pm.hrs as logged_hours,
             pm.hrs * p.billing_rate as billable_amount
      FROM project_months pm
      JOIN projects p ON p.id = pm.project_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      WHERE NOT EXISTS (
        -- "Already invoiced for this month" check: any invoice line item where
        -- the invoice's date falls in the same (y, mo) as the entries.
        SELECT 1 FROM invoice_items ii
        JOIN invoices inv ON inv.id = ii.invoice_id
        WHERE ii.project_id = pm.project_id
          AND EXTRACT(YEAR FROM inv.invoice_date)::int = pm.y
          AND EXTRACT(MONTH FROM inv.invoice_date)::int = pm.mo
      )
      ORDER BY p.client_id, p.name, pm.y, pm.mo
    `);

    // Union and sort. One-time rows first (they're status='completed' and
    // typically more urgent), then monthly rows by client/project/period.
    const all = [...oneTimeR.rows, ...monthlyR.rows];
    all.sort((a, b) => {
      const ca = a.client_name || '', cb = b.client_name || '';
      if (ca !== cb) return ca.localeCompare(cb);
      const na = a.name || '', nb = b.name || '';
      if (na !== nb) return na.localeCompare(nb);
      // monthly rows by year/month
      const ya = a.period_year || 0, yb = b.period_year || 0;
      if (ya !== yb) return ya - yb;
      return (a.period_month || 0) - (b.period_month || 0);
    });
    res.json(all);
  } catch (e) {
    console.error('billing queue error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:id/mark-billed', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET billed_date=NOW(), status='billed' WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    // Permit pipeline ends at 'checklist' — billing status is reflected by
    // projects.billed_date, not by writing a 'billed' permit_stages row.
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// "Bill and clone": marks the current project billed, snapshots an invoice line,
// and creates a follow-on project for the next billing period so ongoing hourly
// work (inspection, RE) can keep accumulating without re-entering all the metadata.
// Body: { invoice_number?, invoice_date?, billed_amount, create_follow_on?, follow_on_name? }
app.post('/api/projects/:id/bill-and-clone', async (req, res) => {
  const { invoice_number, invoice_date, billed_amount, create_follow_on, follow_on_name } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Load original project so we can clone its setup
    const origR = await client.query('SELECT * FROM projects WHERE id=$1', [req.params.id]);
    const orig = origR.rows[0];
    if (!orig) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Project not found' });
    }

    // 1. Mark current project as billed — but ONLY for one-time projects.
    // For monthly projects we keep status='active' and don't stamp billed_date;
    // the invoice line item itself is the record that this month was billed.
    const billDate = invoice_date || new Date().toISOString().split('T')[0];
    if ((orig.billing_cadence || 'one_time') !== 'monthly') {
      await client.query(
        `UPDATE projects SET billed_date=$1, status='billed' WHERE id=$2`,
        [billDate, req.params.id]
      );
    }

    // 2. Snapshot an invoice (using the existing invoices + invoice_items tables)
    let invoiceId = null;
    if (billed_amount && parseFloat(billed_amount) > 0) {
      const invR = await client.query(
        `INSERT INTO invoices (client_id, invoice_number, invoice_date, total_amount, status, notes)
         VALUES ($1, $2, $3, $4, 'sent', $5) RETURNING id`,
        [orig.client_id, invoice_number || null, billDate, billed_amount,
         `Auto-snapshot from project ${orig.name}`]
      );
      invoiceId = invR.rows[0].id;

      const qty = orig.billing_type === 'footage' ? orig.footage : orig.actual_hours;
      const unit = orig.billing_type === 'footage' ? 'lf' : 'hours';
      await client.query(
        `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [invoiceId, orig.id, orig.name, qty, unit, orig.billing_rate, billed_amount]
      );
    }

    // 3. Permit pipeline no longer has a "billed" stage — billing status
    // is read from projects.billed_date directly. Nothing to do here.

    // 4. Optionally create a follow-on project (for ongoing hourly work)
    let followOn = null;
    if (create_follow_on) {
      const newName = follow_on_name || `${orig.name} (continued)`;
      const followR = await client.query(
        `INSERT INTO projects (
           parent_id, name, client_id, contract_id, work_order_number,
           project_type, status, billing_type, billing_rate, footage,
           expected_hours, expected_revenue, start_date, notes,
           budget_code_id, concentrator_id
         ) VALUES (
           $1, $2, $3, $4, $5, $6, 'active', $7, $8, $9, $10, $11, $12, $13, $14, $15
         ) RETURNING *`,
        [
          orig.parent_id, newName, orig.client_id, orig.contract_id, orig.work_order_number,
          orig.project_type, orig.billing_type, orig.billing_rate, orig.footage,
          orig.expected_hours, orig.expected_revenue, billDate, orig.notes,
          orig.budget_code_id, orig.concentrator_id
        ]
      );
      followOn = followR.rows[0];
    }

    await client.query('COMMIT');
    res.json({ ok: true, invoice_id: invoiceId, follow_on: followOn });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('bill-and-clone error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BULK INVOICE — bill multiple projects as a single invoice
// Body: { project_ids: [...], invoice_number, invoice_date, invoice_name, items: [{project_id, description, amount}] }
// Each project gets a line item; the invoice gets one invoice_number.
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/billing/bill-multiple', async (req, res) => {
  const { project_ids, invoice_number, invoice_date, invoice_name, items } = req.body;
  if (!Array.isArray(project_ids) || project_ids.length === 0) {
    return res.status(400).json({ error: 'project_ids must be a non-empty array' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Pull all projects so we know rates, footage, hours, client_id
    const projR = await client.query(
      `SELECT * FROM projects WHERE id = ANY($1::uuid[])`, [project_ids]
    );
    if (projR.rows.length !== project_ids.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'One or more projects not found' });
    }

    // All projects in a single invoice should share the same client.
    // (We could allow mixed-client billing but it's probably user error.)
    const clientIds = [...new Set(projR.rows.map(p => p.client_id))];
    if (clientIds.length > 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'All selected projects must belong to the same client' });
    }
    const billClientId = clientIds[0] || null;

    // Build line items. If the caller supplied per-project line item overrides
    // (rate / amount / description), use them; otherwise derive from the project.
    // For monthly cadence projects, the override should also include
    // period_year / period_month — we sum hours just from that month.
    const itemMap = new Map((items || []).map(it => [it.project_id, it]));
    let total = 0;
    const lineItems = [];
    for (const p of projR.rows) {
      const override = itemMap.get(p.id) || {};
      const isFootage = p.billing_type === 'footage';
      const isMonthly = p.billing_cadence === 'monthly';
      const inferredRate = parseFloat(p.billing_rate) || ({'inspection':90,'re':100,'resident engineer':100,'permitting':90}[(p.project_type||'').toLowerCase()] || 0);
      const rate = inferredRate;
      const expected = parseFloat(p.expected_revenue) || 0;

      // Hours: for monthly with a specified period, sum only that period's
      // entries. Otherwise use lifetime actual_hours (one_time semantics).
      let hours = parseFloat(p.actual_hours) || 0;
      let periodLabel = null;
      if (isMonthly && override.period_year && override.period_month) {
        const sumR = await client.query(`
          SELECT COALESCE(SUM(hours), 0)::float AS h
          FROM time_entries
          WHERE project_id = $1
            AND EXTRACT(YEAR FROM entry_date)::int = $2
            AND EXTRACT(MONTH FROM entry_date)::int = $3
        `, [p.id, override.period_year, override.period_month]);
        hours = parseFloat(sumR.rows[0].h) || 0;
        const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][override.period_month - 1];
        periodLabel = `${monthName} ${override.period_year}`;
      }

      // Amount priority:
      //   1. caller's per-line override.amount (UI / bulk-bill flow)
      //   2. project's manual_invoice_amount (flat fee override stored on project)
      //   3. calculated: footage → expected_revenue, hourly → hours × rate
      const projManual = parseFloat(p.manual_invoice_amount);
      const hasManual = !isNaN(projManual) && projManual >= 0;
      const amount = override.amount != null ? parseFloat(override.amount)
        : hasManual ? projManual
        : isFootage ? expected
        : hours * rate;
      const qty = override.quantity != null ? parseFloat(override.quantity)
        : hasManual ? 1
        : isFootage ? p.footage
        : hours;
      const unit = override.unit || (hasManual ? 'flat' : (isFootage ? 'lf' : 'hours'));
      const description = override.description || (periodLabel ? `${p.name} — ${periodLabel}` : p.name);
      lineItems.push({
        project_id: p.id, description, quantity: qty, unit, rate, amount,
        // pass through to the bill-out loop so it knows which (year, month)
        // this line item represents (drives the invoice_date stamping)
        period_year: override.period_year || null,
        period_month: override.period_month || null
      });
      total += amount;
    }

    // Determine invoice_date. If all monthly line items share a single (year,
    // month), the invoice_date goes in that month so the "already billed" check
    // on the queue endpoint matches correctly. Mixed periods aren't supported
    // — the user should bill them as separate invoices.
    const monthlyPeriods = lineItems
      .filter(li => li.period_year && li.period_month)
      .map(li => `${li.period_year}-${li.period_month}`);
    const uniquePeriods = [...new Set(monthlyPeriods)];
    if (uniquePeriods.length > 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Selected items span multiple months — bill each month as a separate invoice.'
      });
    }
    let billDate = invoice_date || new Date().toISOString().split('T')[0];
    if (!invoice_date && uniquePeriods.length === 1) {
      // Stamp the invoice on the 1st of the period so the
      // "already-billed-for-this-month" detection on the queue is accurate.
      const [py, pm] = uniquePeriods[0].split('-').map(Number);
      billDate = `${py}-${String(pm).padStart(2, '0')}-01`;
    }
    const invR = await client.query(
      `INSERT INTO invoices (client_id, invoice_number, invoice_date, total_amount, status, notes)
       VALUES ($1, $2, $3, $4, 'sent', $5) RETURNING id`,
      [billClientId, invoice_number || null, billDate, total, invoice_name || null]
    );
    const invoiceId = invR.rows[0].id;

    for (const li of lineItems) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [invoiceId, li.project_id, li.description, li.quantity, li.unit, li.rate, li.amount]
      );
      // Cadence-aware close-out:
      //   • one_time projects close fully — billed_date set, status='billed'
      //   • monthly projects stay active so they reappear in next month's queue.
      //     The invoice line item itself records what was billed for which period.
      const proj = projR.rows.find(p => p.id === li.project_id);
      const cadence = proj?.billing_cadence || 'one_time';
      if (cadence === 'monthly') {
        // Don't change status. Don't set billed_date. The invoice line item
        // (with its date) is the source of truth for "this month was billed".
      } else {
        await client.query(
          `UPDATE projects SET billed_date=$1, status='billed' WHERE id=$2`,
          [billDate, li.project_id]
        );
      }
      // Permit pipeline ends at 'checklist'. Billing status is reflected by
      // projects.billed_date — no need to write a 'billed' permit_stages row.
    }

    await client.query('COMMIT');
    res.json({ ok: true, invoice_id: invoiceId, total, line_count: lineItems.length });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('bill-multiple error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BILLING REPORT — clean ledger of invoices for a period
// Returns: { period, monthly_revenue, ytd_revenue, invoices: [...] }
// One row per invoice (not per project), sorted by date.
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/billing/report', async (req, res) => {
  const month = req.query.month ? parseInt(req.query.month, 10) : null;
  const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
  try {
    let where, params;
    if (month) {
      where = `WHERE EXTRACT(MONTH FROM invoice_date) = $1 AND EXTRACT(YEAR FROM invoice_date) = $2`;
      params = [month, year];
    } else {
      where = `WHERE EXTRACT(YEAR FROM invoice_date) = $1`;
      params = [year];
    }
    const invR = await pool.query(`
      SELECT inv.id, inv.invoice_number, inv.invoice_date, inv.total_amount, inv.status, inv.notes,
             cl.name as client_name
      FROM invoices inv
      LEFT JOIN clients cl ON cl.id = inv.client_id
      ${where}
      ORDER BY inv.invoice_date ASC, inv.created_at ASC
    `, params);

    const monthlyRev = month
      ? invR.rows.reduce((s, r) => s + parseFloat(r.total_amount || 0), 0)
      : null;

    const ytdR = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0)::float AS ytd
      FROM invoices
      WHERE EXTRACT(YEAR FROM invoice_date) = $1
    `, [year]);

    res.json({
      year,
      month,
      monthly_revenue: monthlyRev,
      ytd_revenue: parseFloat(ytdR.rows[0].ytd) || 0,
      invoices: invR.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

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

CLIENTS: PSC (RUS), COX, IFT, TRI-CO
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
    description: 'Delete a project and all its associated data. Call ONLY after user explicitly confirms deletion.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to delete' }
      },
      required: ['project_id']
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
  }
];

// ─── TOOL EXECUTION ──────────────────────────────────────────────────────────
async function executeTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'create_project': {
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
          toolInput.client_id,
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
            'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING',
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
        const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [toolInput.project_id]);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, deleted: rows[0].name };
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
          'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
          [toolInput.project_id, nextStage, toolInput.updated_by || 'AI']
        );
        return { success: true, previous: currentStage, current: nextStage };
      }

      case 'query_database': {
        // Safety: only allow SELECT queries
        const sqlClean = toolInput.sql.trim().replace(/;+$/, '');
        const firstWord = sqlClean.split(/\s+/)[0].toUpperCase();
        if (firstWord !== 'SELECT' && firstWord !== 'WITH') {
          return { success: false, error: 'Only SELECT queries are allowed. Use the specific action tools for modifications.' };
        }
        // Extra safety: reject dangerous keywords
        const upper = sqlClean.toUpperCase();
        if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE)\b/.test(upper)) {
          return { success: false, error: 'Modifying queries are not allowed through query_database. Use the specific tools instead.' };
        }
        const { rows } = await pool.query(sqlClean);
        return { success: true, row_count: rows.length, rows: rows.slice(0, 100) };
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

      default:
        return { success: false, error: 'Unknown tool: ' + toolName };
    }
  } catch (err) {
    return { success: false, error: err.message };
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

app.post('/api/ai/upload', upload.single('file'), async (req, res) => {
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
app.get('/api/ai/upload/:id', async (req, res) => {
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
app.post('/api/ai/chat', async (req, res) => {
  const { messages, session_id } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: 'No messages' });

  try {
    const ctx = await getDBContext();
    // Anchor the AI to today's date so it never guesses the year wrong on imports.
    ctx._today = new Date().toISOString().split('T')[0];

    // Split system prompt into static rules + dynamic DB context, cache both.
    // Static block changes only when SYSTEM_PROMPT does. DB context block is identical
    // across all iterations within a single chat request, so it caches perfectly.
    const [staticPromptPart] = SYSTEM_PROMPT.split('{CONTEXT}');
    const systemBlocks = [
      {
        type: 'text',
        text: staticPromptPart,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: JSON.stringify(ctx, null, 2),
        cache_control: { type: 'ephemeral' }
      }
    ];

    // Cache all 14 tool definitions in one breakpoint by marking the last one.
    const cachedTools = AI_TOOLS.map((t, i) =>
      i === AI_TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t
    );

    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemBlocks,
      tools: cachedTools,
      tool_choice: { type: 'auto' },
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });

    let finalText = '';
    let toolResults = [];
    let conversationMessages = [...messages.map(m => ({ role: m.role, content: m.content }))];

    // Handle tool use in a loop (Claude may chain multiple tools).
    // 15 leaves headroom for: paged Excel reads (4-6) + log + verification query + summary.
    let iterations = 0;
    const MAX_ITERATIONS = 15;

    while (response.stop_reason === 'tool_use' && iterations < MAX_ITERATIONS) {
      iterations++;
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const textBlocks = response.content.filter(b => b.type === 'text');
      for (const tb of textBlocks) {
        if (tb.text.trim()) finalText += tb.text + '\n';
      }

      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        console.log(`AI Tool Call: ${toolUseBlock.name}`, JSON.stringify(toolUseBlock.input).substring(0, 200));
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);
        console.log(`AI Tool Result: ${toolUseBlock.name}`, JSON.stringify(toolResult).substring(0, 200));
        toolResults.push({ tool: toolUseBlock.name, input: toolUseBlock.input, result: toolResult });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult)
        });
      }

      // Continue conversation with tool results
      conversationMessages.push({ role: 'assistant', content: response.content });
      conversationMessages.push({ role: 'user', content: toolResultContents });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemBlocks,
        tools: cachedTools,
        tool_choice: { type: 'auto' },
        messages: conversationMessages
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
      'create_budget_code', 'update_budget_code', 'set_billing_cadence'];
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
      content: finalText.trim(),
      toolResults,
      usage: response.usage
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
               : 'index.html';

app.get('*', (req, res) => {
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
    { name: 'Resident Engineer',             bt: 'hourly',  rate: 100,  perm: false, code: 'g-1-B-1',    team: 'both',       psc: true,  generic: false },
    { name: 'Inspection',                    bt: 'hourly',  rate: 90,   perm: false, code: 'g-1-B-4',    team: 'both',       psc: true,  generic: false },
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
      await pool.query(
        `INSERT INTO jobs (
           name, default_billing_type, default_rate, is_permitting,
           billing_code, team, for_psc_client, for_generic_client, active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
         ON CONFLICT (name) DO UPDATE SET
           default_billing_type = EXCLUDED.default_billing_type,
           is_permitting        = EXCLUDED.is_permitting,
           billing_code         = COALESCE(EXCLUDED.billing_code, jobs.billing_code),
           team                 = EXCLUDED.team,
           for_psc_client       = EXCLUDED.for_psc_client,
           for_generic_client   = EXCLUDED.for_generic_client,
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

async function start() {
  await initSchema();
  await bootstrapV3Schema();   // runs AFTER initSchema, even if that errored
  // Extend timeouts to 30 minutes — needed for multi-GB uploads. The
  // platform's load balancer (Railway) may still cap at 5 minutes, but
  // setting these here at least removes Node as the bottleneck.
  const server = app.listen(PORT, () => console.log(`✓ Launch Fiber Services running on port ${PORT}`));
  server.timeout = 30 * 60 * 1000;            // overall socket timeout
  server.keepAliveTimeout = 30 * 60 * 1000;   // keep-alive
  server.headersTimeout = 30 * 60 * 1000 + 1000; // must be > keepAliveTimeout
}

start().catch(console.error);
