// routes/customer_portal.js — customer-role read-only API + admin link mgmt.
//
// The customer portal is the external-facing piece of the system. A
// customer-role user is linked to one or more clients via the
// customer_clients junction table; every endpoint in this module scopes
// data to that user's allowed client set, so a customer can never read
// another client's projects, hours, or invoices.
//
// Customer endpoints (require role='customer'):
//   GET /api/customer/me              client list + minimal user profile
//   GET /api/customer/projects        leaf projects with progress data
//   GET /api/customer/projects/:id    single project detail (drill-down)
//   GET /api/customer/invoices        invoice history (if they have any)
//   GET /api/customer/invoices/:id    one invoice with line items
//
// Admin endpoints (require role='admin'):
//   GET    /api/customer-clients/:user_id        list links for one user
//   POST   /api/customer-clients                  body { user_id, client_id }
//   DELETE /api/customer-clients/:user_id/:cid    remove one link
//
// Customers see PROGRESS-shaped data, not internal billing math:
// completion %, hours used vs expected, last activity, pipeline stage.
// Money values (rates, expected revenue, billing amounts) are surfaced
// only on invoices that are EXPLICITLY billed to them.

const { logAudit } = require('./_audit');
const path = require('path');
const fs = require('fs');

// F8: UUID guard — prevents Postgres 22P02 "invalid input syntax for type uuid"
// 500s when a non-UUID path param is passed.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(v) { return UUID_RE.test(v); }

module.exports = function installCustomerPortalRoutes(app, pool, mw) {
  const { requireAuth, requireAdmin } = mw;

  // --- Helper: load the client_id list for the current user ---
  // Returns []  when the user has no customer_clients rows.
  async function clientIdsForUser(userId) {
    if (!userId) return [];
    const { rows } = await pool.query(
      `SELECT client_id FROM customer_clients WHERE user_id = $1`, [userId]
    );
    return rows.map(r => r.client_id);
  }

  // --- Customer me ---
  app.get('/api/customer/me', requireAuth(['customer']), async (req, res) => {
    try {
      const ids = await clientIdsForUser(req.user.id);
      let clients = [];
      if (ids.length) {
        const { rows } = await pool.query(
          `SELECT id, name FROM clients WHERE id = ANY($1::uuid[]) ORDER BY name`,
          [ids]
        );
        clients = rows;
      }
      res.json({
        user: {
          id: req.user.id,
          username: req.user.username,
          full_name: req.user.full_name,
          email: req.user.email,
          role: req.user.role,
        },
        clients,
      });
    } catch (e) {
      console.error('[customer:me]', e && e.message);
      res.status(500).json({ error: 'Failed to load profile.' });
    }
  });

  // --- Customer project list with progress ---
  // Returns leaf projects only.
  // F4: expected_revenue removed — internal billing estimate, not customer-facing.
  app.get('/api/customer/projects', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.json([]);
      const { rows } = await pool.query(`
        SELECT
          p.id, p.name, p.work_order_number, p.status, p.project_type,
          p.start_date, p.completed_date, p.billed_date,
          p.actual_hours,
          p.expected_hours,
          p.footage,
          p.client_id,
          cl.name AS client_name,
          j.name AS job_name,
          (SELECT MAX(entry_date)
             FROM time_entries WHERE project_id = p.id) AS last_activity_date,
          ds.stage AS design_stage,
          ps.stage AS permit_stage
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN jobs j ON j.id = p.job_id
        LEFT JOIN LATERAL (
          SELECT stage FROM design_stages WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
        ) ds ON TRUE
        LEFT JOIN LATERAL (
          SELECT stage FROM permit_stages WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
        ) ps ON TRUE
        WHERE p.client_id = ANY($1::uuid[])
          AND COALESCE(p.is_rollup, FALSE) = FALSE
        ORDER BY
          CASE p.status
            WHEN 'active' THEN 1
            WHEN 'completed' THEN 2
            WHEN 'billed' THEN 3
            WHEN 'on_hold' THEN 4
            ELSE 5 END,
          p.name
      `, [clientIds]);

      const today = new Date();
      const enriched = rows.map(p => {
        const expected = parseFloat(p.expected_hours || 0);
        const actual = parseFloat(p.actual_hours || 0);
        const completionPct = expected > 0 ? Math.min(100, Math.round((actual / expected) * 100)) : null;
        let daysSince = null;
        if (p.last_activity_date) {
          const last = new Date(p.last_activity_date);
          daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        }
        const pipelineStage = p.permit_stage || p.design_stage || null;
        return {
          ...p,
          completion_pct: completionPct,
          days_since_activity: daysSince,
          pipeline_stage: pipelineStage,
        };
      });
      res.json(enriched);
    } catch (e) {
      console.error('[customer:projects]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects.' });
    }
  });

  // --- Single project detail ---
  // F4: expected_revenue removed. F6: notes removed (internal staff field).
  // F8: UUID guard on :id.
  app.get('/api/customer/projects/:id', requireAuth(['customer']), async (req, res) => {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({ error: 'Invalid project id.' });
    }
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.status(404).json({ error: 'Not found' });
      const { rows: projRows } = await pool.query(`
        SELECT p.id, p.name, p.work_order_number, p.status, p.project_type,
               p.start_date, p.completed_date, p.billed_date,
               p.actual_hours, p.expected_hours,
               p.footage,
               p.client_id, cl.name AS client_name, j.name AS job_name
          FROM projects p
          LEFT JOIN clients cl ON cl.id = p.client_id
          LEFT JOIN jobs j ON j.id = p.job_id
         WHERE p.id = $1 AND p.client_id = ANY($2::uuid[])
      `, [req.params.id, clientIds]);
      if (!projRows[0]) return res.status(404).json({ error: 'Not found' });
      const p = projRows[0];

      const { rows: weekly } = await pool.query(`
        SELECT
          to_char(date_trunc('week', entry_date), 'IYYY-IW') AS week,
          MIN(entry_date) AS week_start,
          SUM(hours)::float AS hours
        FROM time_entries
        WHERE project_id = $1
          AND entry_date >= CURRENT_DATE - INTERVAL '84 days'
        GROUP BY 1
        ORDER BY 1 DESC
        LIMIT 12
      `, [p.id]);

      const expected = parseFloat(p.expected_hours || 0);
      const actual = parseFloat(p.actual_hours || 0);
      const completionPct = expected > 0 ? Math.min(100, Math.round((actual / expected) * 100)) : null;
      res.json({
        ...p,
        completion_pct: completionPct,
        weekly_hours: weekly.reverse(),
      });
    } catch (e) {
      console.error('[customer:project-detail]', e && e.message);
      res.status(500).json({ error: 'Failed to load project.' });
    }
  });

  // --- Customer service-area status view (Phase 6 keystone) ---
  // Read-only, client-scoped status/progress for the keystone model
  // (service_areas + service_area_jobs). Two gates, both required:
  //   1. sa.client_id ∈ the caller's customer_clients set (cross-client isolation)
  //   2. sa.client_visible = TRUE  — the Phase-6 portal hook (default false);
  //      flipping that flag is an admin/CEO action, not customer-facing.
  // NO MONEY: the SELECT deliberately omits every $ column on the model —
  // service_area_jobs.rate / estimated_amount / actual_amount / billing_type —
  // and never touches invoices. service_areas.notes (internal staff field) and
  // staff assignment are excluded too. Clients see *status*, not money. If you
  // extend the job object below, do NOT add a money or internal column.
  const SA_DONE_STATUSES = new Set(['complete', 'billed']);
  app.get('/api/customer/service-areas', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.json([]);
      const { rows } = await pool.query(`
        SELECT
          sa.id, sa.name, sa.work_order_number, sa.program, sa.status,
          sa.start_date, sa.completed_date, sa.billed_date,
          sa.client_id, cl.name AS client_name,
          sa.map_filename, (sa.map_file_path IS NOT NULL) AS has_map,
          COALESCE(
            json_agg(
              json_build_object(
                'id', saj.id,
                'job_name', j.name,
                'team', saj.team,
                'status', saj.status,
                'start_date', saj.start_date,
                'completed_date', saj.completed_date
              ) ORDER BY saj.team NULLS LAST, saj.created_at
            ) FILTER (WHERE saj.id IS NOT NULL),
            '[]'::json
          ) AS jobs
        FROM service_areas sa
        LEFT JOIN clients cl            ON cl.id = sa.client_id
        LEFT JOIN service_area_jobs saj ON saj.service_area_id = sa.id
        LEFT JOIN jobs j                ON j.id = saj.job_id
        WHERE sa.client_id = ANY($1::uuid[])
          AND sa.client_visible = TRUE
        GROUP BY sa.id, cl.name
        ORDER BY
          CASE sa.status
            WHEN 'active' THEN 1
            WHEN 'completed' THEN 2
            WHEN 'billed' THEN 3
            WHEN 'on_hold' THEN 4
            ELSE 5 END,
          sa.name
      `, [clientIds]);

      // Progress is count-based (jobs done / total), cancelled jobs excluded
      // from the denominator — no hours or $ needed to express it.
      const enriched = rows.map(sa => {
        const jobs = Array.isArray(sa.jobs) ? sa.jobs : [];
        const counted = jobs.filter(j => j.status !== 'cancelled');
        const jobsTotal = counted.length;
        const jobsDone = counted.filter(j => SA_DONE_STATUSES.has(j.status)).length;
        const completionPct = jobsTotal > 0 ? Math.round((jobsDone / jobsTotal) * 100) : null;
        return { ...sa, jobs_total: jobsTotal, jobs_done: jobsDone, completion_pct: completionPct };
      });
      res.json(enriched);
    } catch (e) {
      console.error('[customer:service-areas]', e && e.message);
      res.status(500).json({ error: 'Failed to load service areas.' });
    }
  });

  // --- Customer service-area map (read-only, scoped) ---
  // Serves the area's map file ONLY when it belongs to one of the caller's
  // linked clients AND is client_visible AND has a map on file. The path is
  // resolved from the DB (never client input) and contained within UPLOAD_DIR
  // (same guard as routes/dwg_sync.js). Default is attachment + nosniff;
  // ?inline=1 serves inline ONLY for an allowlist of raster image types and
  // PDF (see below). Read-only — no mutation, no $.
  app.get('/api/customer/service-areas/:id/map', requireAuth(['customer']), async (req, res) => {
    if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'Invalid service area id.' });
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.status(404).json({ error: 'Not found' });
      const { rows } = await pool.query(
        `SELECT map_file_path, map_filename
           FROM service_areas
          WHERE id = $1 AND client_id = ANY($2::uuid[])
            AND client_visible = TRUE AND map_file_path IS NOT NULL`,
        [req.params.id, clientIds]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });

      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const resolved = path.resolve(uploadDir, rows[0].map_file_path);
      const uploadRoot = path.resolve(uploadDir) + path.sep;
      if (!resolved.startsWith(uploadRoot) && resolved !== path.resolve(uploadDir)) {
        return res.status(400).json({ error: 'Invalid file path' });
      }
      if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
        return res.status(404).json({ error: 'Map file not found on disk' });
      }
      const downloadName = String(rows[0].map_filename || 'service-area-map').replace(/[^\w.\-]+/g, '_');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // Inline preview (?inline=1) is allowed ONLY for raster images + PDF,
      // with an explicit Content-Type. SVG is intentionally excluded — it is
      // image/* but can carry <script>, so serving it inline same-origin would
      // be stored XSS. Anything off this allowlist (SVG, KMZ, …) falls back to
      // attachment. nosniff stays set either way, so the browser won't sniff a
      // declared image/pdf into something executable.
      const INLINE_TYPES = {
        '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
        '.gif': 'image/gif', '.webp': 'image/webp', '.pdf': 'application/pdf',
      };
      const ext = path.extname(rows[0].map_filename || rows[0].map_file_path || '').toLowerCase();
      const inlineType = INLINE_TYPES[ext];
      if (req.query.inline === '1' && inlineType) {
        res.setHeader('Content-Type', inlineType);
        res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      }
      res.sendFile(resolved);
    } catch (e) {
      console.error('[customer:service-area-map]', e && e.message);
      res.status(500).json({ error: 'Failed to load map.' });
    }
  });

  // --- Customer invoice list ---
  // F5: AND i.status NOT IN ('draft') — customers must not see draft invoices.
  app.get('/api/customer/invoices', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.json([]);
      // status: drives the sent/paid pill (drafts already excluded below).
      // notes: fallback label for service-area-billed invoices, which set
      // notes ("Service area: <name>") rather than invoice_name. Already
      // surfaced by the detail endpoint, so no new exposure.
      const { rows } = await pool.query(`
        SELECT i.id, i.invoice_number, i.invoice_date, i.invoice_name, i.notes,
               i.total_amount, i.status, i.client_id, cl.name AS client_name,
               i.created_at
          FROM invoices i
          LEFT JOIN clients cl ON cl.id = i.client_id
         WHERE i.client_id = ANY($1::uuid[])
           AND i.status NOT IN ('draft')
         ORDER BY i.invoice_date DESC NULLS LAST, i.created_at DESC
      `, [clientIds]);
      res.json(rows);
    } catch (e) {
      console.error('[customer:invoices]', e && e.message);
      res.status(500).json({ error: 'Failed to load invoices.' });
    }
  });

  // --- Customer invoice detail ---
  // F5: AND i.status NOT IN ('draft').
  // F7: replaced SELECT i.* with explicit column list.
  // F8: UUID guard on :id.
  // F11 (INTENTIONAL): rate retained in line items — customers on sent invoices
  //     are entitled to see unit rates per the billing contract (header lines 21-24).
  app.get('/api/customer/invoices/:id', requireAuth(['customer']), async (req, res) => {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({ error: 'Invalid invoice id.' });
    }
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.status(404).json({ error: 'Not found' });
      const { rows } = await pool.query(`
        SELECT i.id, i.invoice_number, i.invoice_date,
               i.billing_period_start, i.billing_period_end,
               i.total_amount, i.status, i.notes, i.client_id, i.created_at,
               cl.name AS client_name,
               json_agg(json_build_object(
                 'id', ii.id,
                 'project_id', ii.project_id,
                 'description', ii.description,
                 'quantity', ii.quantity,
                 'unit', ii.unit,
                 'rate', ii.rate,
                 'amount', ii.amount,
                 'project_name', p.name,
                 'work_order_number', p.work_order_number
               )) FILTER (WHERE ii.id IS NOT NULL) AS items
          FROM invoices i
          LEFT JOIN clients cl ON cl.id = i.client_id
          LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
          LEFT JOIN projects p ON p.id = ii.project_id
         WHERE i.id = $1
           AND i.client_id = ANY($2::uuid[])
           AND i.status NOT IN ('draft')
         GROUP BY i.id, i.invoice_number, i.invoice_date,
                  i.billing_period_start, i.billing_period_end,
                  i.total_amount, i.status, i.notes, i.client_id, i.created_at,
                  cl.name
      `, [req.params.id, clientIds]);
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (e) {
      console.error('[customer:invoice-detail]', e && e.message);
      res.status(500).json({ error: 'Failed to load invoice.' });
    }
  });

  // --- Admin: Client Progress view ---
  // NOTE: expected_revenue intentionally retained — admin-only endpoint.
  app.get('/api/admin/client-progress', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          p.id, p.name, p.work_order_number, p.status, p.project_type,
          p.start_date, p.completed_date, p.billed_date,
          p.actual_hours,
          p.expected_hours,
          p.expected_revenue,
          p.footage,
          p.client_id,
          cl.name AS client_name,
          j.name AS job_name,
          (SELECT MAX(entry_date)
             FROM time_entries WHERE project_id = p.id) AS last_activity_date,
          ds.stage AS design_stage,
          ps.stage AS permit_stage
        FROM projects p
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN jobs j ON j.id = p.job_id
        LEFT JOIN LATERAL (
          SELECT stage FROM design_stages WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
        ) ds ON TRUE
        LEFT JOIN LATERAL (
          SELECT stage FROM permit_stages WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
        ) ps ON TRUE
        WHERE COALESCE(p.is_rollup, FALSE) = FALSE
          AND p.client_id IS NOT NULL
        ORDER BY cl.name, p.name
      `);

      const today = new Date();
      const byClient = new Map();
      for (const p of rows) {
        const expected = parseFloat(p.expected_hours || 0);
        const actual = parseFloat(p.actual_hours || 0);
        const completionPct = expected > 0 ? Math.min(100, Math.round((actual / expected) * 100)) : null;
        let daysSince = null;
        if (p.last_activity_date) {
          const last = new Date(p.last_activity_date);
          daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        }
        const enriched = {
          ...p,
          completion_pct: completionPct,
          days_since_activity: daysSince,
          pipeline_stage: p.permit_stage || p.design_stage || null,
        };
        if (!byClient.has(p.client_id)) {
          byClient.set(p.client_id, {
            client_id: p.client_id,
            client_name: p.client_name,
            project_count: 0,
            active_count: 0,
            total_hours: 0,
            total_expected_hours: 0,
            total_expected_revenue: 0,
            stale_count: 0,
            projects: [],
          });
        }
        const grp = byClient.get(p.client_id);
        grp.projects.push(enriched);
        grp.project_count += 1;
        if (p.status === 'active') grp.active_count += 1;
        grp.total_hours += actual;
        grp.total_expected_hours += expected;
        grp.total_expected_revenue += parseFloat(p.expected_revenue || 0);
        if (p.status === 'active' && daysSince != null && daysSince > 30) grp.stale_count += 1;
      }
      const groups = [...byClient.values()].sort((a, b) =>
        (a.client_name || '').localeCompare(b.client_name || ''));
      res.json({ clients: groups });
    } catch (e) {
      console.error('[admin:client-progress]', e && e.message);
      res.status(500).json({ error: 'Failed to load client progress.' });
    }
  });

  // --- Admin: manage customer <-> client links ---
  // F8: UUID guard on user_id.
  app.get('/api/customer-clients/:user_id', requireAdmin, async (req, res) => {
    if (!isValidUUID(req.params.user_id)) {
      return res.status(400).json({ error: 'Invalid user_id.' });
    }
    try {
      const { rows } = await pool.query(`
        SELECT cc.user_id, cc.client_id, cc.created_at, cl.name AS client_name
          FROM customer_clients cc
          JOIN clients cl ON cl.id = cc.client_id
         WHERE cc.user_id = $1
         ORDER BY cl.name
      `, [req.params.user_id]);
      res.json(rows);
    } catch (e) {
      console.error('[customer-clients:list]', e && e.message);
      res.status(500).json({ error: 'Failed to list links.' });
    }
  });

  // F9: audit-log authorization-control grant.
  app.post('/api/customer-clients', requireAdmin, async (req, res) => {
    const { user_id, client_id } = req.body || {};
    if (!user_id || !client_id) return res.status(400).json({ error: 'user_id and client_id required' });
    try {
      const { rows: u } = await pool.query(`SELECT role FROM users WHERE id = $1`, [user_id]);
      if (!u[0]) return res.status(404).json({ error: 'User not found' });
      if (u[0].role !== 'customer') {
        return res.status(400).json({ error: 'customer_clients only applies to role=customer users.' });
      }
      await pool.query(
        `INSERT INTO customer_clients (user_id, client_id)
           VALUES ($1, $2)
         ON CONFLICT (user_id, client_id) DO NOTHING`,
        [user_id, client_id]
      );
      // F9: audit-log grant so authorization-control changes are traceable.
      await logAudit(pool, {
        req,
        action: 'customer_access.grant',
        entity_type: 'customer_client',
        entity_id: user_id,
        source: 'customer_portal',
        details: { user_id, client_id },
      });
      res.json({ ok: true });
    } catch (e) {
      console.error('[customer-clients:create]', e && e.message);
      res.status(500).json({ error: 'Failed to link.' });
    }
  });

  // F8: UUID guards on both params.
  // F9: audit-log authorization-control revoke.
  // F10: 404 when link does not exist (rowCount === 0).
  app.delete('/api/customer-clients/:user_id/:client_id', requireAdmin, async (req, res) => {
    if (!isValidUUID(req.params.user_id)) {
      return res.status(400).json({ error: 'Invalid user_id.' });
    }
    if (!isValidUUID(req.params.client_id)) {
      return res.status(400).json({ error: 'Invalid client_id.' });
    }
    try {
      const result = await pool.query(
        `DELETE FROM customer_clients WHERE user_id = $1 AND client_id = $2`,
        [req.params.user_id, req.params.client_id]
      );
      // F10: distinguish "deleted" from "never existed".
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Link not found.' });
      }
      // F9: audit-log the revoke so authorization-control changes are traceable.
      await logAudit(pool, {
        req,
        action: 'customer_access.revoke',
        entity_type: 'customer_client',
        entity_id: req.params.user_id,
        source: 'customer_portal',
        details: { user_id: req.params.user_id, client_id: req.params.client_id },
      });
      res.json({ ok: true });
    } catch (e) {
      console.error('[customer-clients:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to unlink.' });
    }
  });
};
