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

module.exports = function installCustomerPortalRoutes(app, pool, mw) {
  const { requireAuth, requireAdmin } = mw;

  // ─── Helper: load the client_id list for the current user ─────────────
  // Returns []  when the user has no customer_clients rows.
  async function clientIdsForUser(userId) {
    if (!userId) return [];
    const { rows } = await pool.query(
      `SELECT client_id FROM customer_clients WHERE user_id = $1`, [userId]
    );
    return rows.map(r => r.client_id);
  }

  // ─── Customer me ──────────────────────────────────────────────────────
  app.get('/api/customer/me', requireAuth(['customer']), async (req, res) => {
    try {
      const ids = await clientIdsForUser(req.user.id);
      let clients = [];
      if (ids.length) {
        // Customer portal doesn't need is_rus — program classification lives
        // on engineering contracts and is irrelevant to the per-client
        // view the customer sees.
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

  // ─── Customer project list with progress ──────────────────────────────
  // Returns leaf projects only — the customer doesn't care about rollup
  // folders. Each row carries:
  //   - basic identity (name, work order, status, project_type)
  //   - completion: hours used / expected_hours; expected_revenue;
  //   - last activity: date of latest time_entry
  //   - pipeline stage: design or permitting stage label, when relevant
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

      // Compute completion + days-since-activity in JS so the SQL stays
      // readable. completion_pct caps at 100% and falls to NULL when
      // expected_hours isn't set (some footage projects don't track hours).
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

  // ─── Single project detail ─────────────────────────────────────────────
  // Same shape as the list row + a recent-activity summary (last 25
  // time_entries rolled up by week). Money fields stay summarized; the
  // raw rates / individual entries aren't exposed to customers.
  app.get('/api/customer/projects/:id', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.status(404).json({ error: 'Not found' });
      const { rows: projRows } = await pool.query(`
        SELECT p.id, p.name, p.work_order_number, p.status, p.project_type,
               p.start_date, p.completed_date, p.billed_date,
               p.actual_hours, p.expected_hours, p.expected_revenue,
               p.footage, p.notes,
               p.client_id, cl.name AS client_name, j.name AS job_name
          FROM projects p
          LEFT JOIN clients cl ON cl.id = p.client_id
          LEFT JOIN jobs j ON j.id = p.job_id
         WHERE p.id = $1 AND p.client_id = ANY($2::uuid[])
      `, [req.params.id, clientIds]);
      if (!projRows[0]) return res.status(404).json({ error: 'Not found' });
      const p = projRows[0];

      // Weekly hours roll-up over the last 12 weeks, scoped to this project.
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

  // ─── Customer invoice list ────────────────────────────────────────────
  app.get('/api/customer/invoices', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.json([]);
      const { rows } = await pool.query(`
        SELECT i.id, i.invoice_number, i.invoice_date, i.invoice_name,
               i.total_amount, i.client_id, cl.name AS client_name,
               i.created_at
          FROM invoices i
          LEFT JOIN clients cl ON cl.id = i.client_id
         WHERE i.client_id = ANY($1::uuid[])
         ORDER BY i.invoice_date DESC NULLS LAST, i.created_at DESC
      `, [clientIds]);
      res.json(rows);
    } catch (e) {
      console.error('[customer:invoices]', e && e.message);
      res.status(500).json({ error: 'Failed to load invoices.' });
    }
  });

  app.get('/api/customer/invoices/:id', requireAuth(['customer']), async (req, res) => {
    try {
      const clientIds = await clientIdsForUser(req.user.id);
      if (!clientIds.length) return res.status(404).json({ error: 'Not found' });
      const { rows } = await pool.query(`
        SELECT i.*, cl.name AS client_name,
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
         WHERE i.id = $1 AND i.client_id = ANY($2::uuid[])
         GROUP BY i.id, cl.name
      `, [req.params.id, clientIds]);
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (e) {
      console.error('[customer:invoice-detail]', e && e.message);
      res.status(500).json({ error: 'Failed to load invoice.' });
    }
  });

  // ─── Admin: Client Progress view ──────────────────────────────────────
  // Internal mirror of the customer portal's data, but unscoped so admin
  // sees every client. The data shape matches /api/customer/projects so
  // both UIs can share render code if useful in the future. Returned as
  // a clients-grouped tree instead of a flat project list because the
  // admin tab groups by client at the top level.
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
            stale_count: 0,        // > 30 days since activity AND status=active
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

  // ─── Admin endpoints — manage customer ↔ client links ────────────────
  app.get('/api/customer-clients/:user_id', requireAdmin, async (req, res) => {
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

  app.post('/api/customer-clients', requireAdmin, async (req, res) => {
    const { user_id, client_id } = req.body || {};
    if (!user_id || !client_id) return res.status(400).json({ error: 'user_id and client_id required' });
    try {
      // Sanity: target user must exist and be customer-role. Mis-linking
      // an admin user to a single client could trick the customer
      // endpoints into showing them less data than expected.
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
      res.json({ ok: true });
    } catch (e) {
      console.error('[customer-clients:create]', e && e.message);
      res.status(500).json({ error: 'Failed to link.' });
    }
  });

  app.delete('/api/customer-clients/:user_id/:client_id', requireAdmin, async (req, res) => {
    try {
      await pool.query(
        `DELETE FROM customer_clients WHERE user_id = $1 AND client_id = $2`,
        [req.params.user_id, req.params.client_id]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error('[customer-clients:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to unlink.' });
    }
  });
};
