// routes/audit_log.js — Audit log viewer for admin-only access
//
// Schema: migration 0046_audit_log.sql
//   audit_log(id, at, actor_user_id, actor_username, actor_type, action, entity_type, entity_id,
//             before_data, after_data, source, ip, user_agent, meta)
//
// Provides read-only access to the tamper-resistant audit trail.
// PII is redacted at read time before rows leave the API.
// Two endpoints (both admin-only):
//   GET  /api/admin/audit-log              — paginated list with optional filters
//   GET  /api/admin/audit-log/:id         — single row detail

const { redactPII } = require('./_audit');

module.exports = function installAuditLogRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  function serverError(res, e, where) {
    console.error(`[audit-log:${where}]`, e && e.message);
    res.status(500).json({ error: 'Internal server error' });
  }

  // GET /api/admin/audit-log — paginated list with optional filters
  // Query params:
  //   limit (default 50, max 200)
  //   offset (default 0)
  //   actor_user_id (uuid, optional filter)
  //   action (text, optional filter — e.g., "user.create", "project.delete")
  //   entity_type (text, optional filter — e.g., "project", "invoice")
  //   entity_id (text, optional filter)
  //   from (ISO date, optional — at >= $)
  //   to (ISO date, optional — at <= $)
  //   search (text, optional — case-insensitive ILIKE across action/entity_type/actor_username)
  // Returns: {rows: [...], total: int, limit, offset}
  app.get('/api/admin/audit-log', requireAdmin, async (req, res) => {
    try {
      let limit = Math.min(parseInt(req.query.limit) || 50, 200);
      let offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const filters = [];
      const params = [];
      let paramCount = 0;

      // Build WHERE clause with parameterized queries
      if (req.query.actor_user_id) {
        filters.push(`actor_user_id = $${++paramCount}`);
        params.push(req.query.actor_user_id);
      }

      if (req.query.action) {
        filters.push(`action = $${++paramCount}`);
        params.push(req.query.action);
      }

      if (req.query.entity_type) {
        filters.push(`entity_type = $${++paramCount}`);
        params.push(req.query.entity_type);
      }

      if (req.query.entity_id) {
        filters.push(`entity_id = $${++paramCount}`);
        params.push(req.query.entity_id);
      }

      if (req.query.from) {
        filters.push(`at >= $${++paramCount}`);
        params.push(req.query.from);
      }

      if (req.query.to) {
        filters.push(`at <= $${++paramCount}`);
        params.push(req.query.to);
      }

      if (req.query.search) {
        const searchTerm = `%${req.query.search}%`;
        filters.push(`(action ILIKE $${++paramCount} OR entity_type ILIKE $${paramCount} OR actor_username ILIKE $${paramCount})`);
        params.push(searchTerm);
        params.push(searchTerm);
        params.push(searchTerm);
        paramCount += 2;
      }

      const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

      // Fetch rows + total count in a single query using COUNT(*) OVER()
      const query = `
        SELECT
          id, at, actor_user_id, actor_username, actor_type, action, entity_type, entity_id,
          before_data, after_data, source, ip, user_agent, meta,
          COUNT(*) OVER() AS total_count
        FROM audit_log
        ${whereClause}
        ORDER BY at DESC, id DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
      `;
      params.push(limit);
      params.push(offset);

      const { rows } = await pool.query(query, params);
      const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

      // Remove total_count from response rows and redact PII
      const cleanRows = rows.map(row => {
        const { total_count, ...rest } = row;
        // Redact PII from before_data, after_data, and meta
        return {
          ...rest,
          before_data: redactPII(rest.before_data),
          after_data: redactPII(rest.after_data),
          meta: redactPII(rest.meta),
        };
      });

      res.set('X-Audit-Redacted', 'true');
      res.json({
        rows: cleanRows,
        total,
        limit,
        offset,
      });
    } catch (e) {
      serverError(res, e, 'GET /api/admin/audit-log');
    }
  });

  // GET /api/admin/audit-log/:id — single row detail with full jsonb
  app.get('/api/admin/audit-log/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      const { rows } = await pool.query(
        `SELECT id, at, actor_user_id, actor_username, actor_type, action, entity_type, entity_id,
                before_data, after_data, source, ip, user_agent, meta
         FROM audit_log WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Audit log entry not found' });
      }

      const row = rows[0];
      // Redact PII from before_data, after_data, and meta
      const redactedRow = {
        ...row,
        before_data: redactPII(row.before_data),
        after_data: redactPII(row.after_data),
        meta: redactPII(row.meta),
      };

      res.set('X-Audit-Redacted', 'true');
      res.json(redactedRow);
    } catch (e) {
      serverError(res, e, 'GET /api/admin/audit-log/:id');
    }
  });
};
