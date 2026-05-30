// routes/file_activity.js — File-activity audit view (Wave 122)
// Exposes a filtered, paginated read-only slice of audit_log scoped to
// all file-related actions across workspaces, project photos, client portal
// document uploads/downloads, DWG workflow, and project documents.
//
// Factory pattern: install(app, pool, mw) so server.js can mount after auth.
//
// Endpoints:
//   GET /api/admin/file-activity        — paginated event list + stats
//   GET /api/admin/file-activity/:id    — single event detail

'use strict';

const { redactPII } = require('./_audit');

// Actions treated as "file activity" — kept in one place so the SQL
// and the route agree on scope.
const FILE_ACTIONS = [
  'workspace.upload',
  'workspace.download',
  'workspace.version_download',
  'workspace.zip_download',
  'workspace.trash',
  'workspace.restore',
  'workspace.purge',
  'project_photo.upload',
  'project_photo.download',
  'project_photo.delete',
  'client_portal.document_upload',
  'client_portal.document_download',
  'dwg.push',
  'dwg.promote',
  'dwg.reject',
  'project_document.upload',
  'project_document.delete',
];

// Sub-set used for "today" counter — upload/download focus only.
const TODAY_ACTIONS = [
  'workspace.upload',
  'workspace.download',
  'project_photo.upload',
  'project_photo.download',
  'client_portal.document_upload',
  'project_document.upload',
];

// Build a Postgres $N-style placeholder list, e.g. "$1,$2,$3"
function placeholders(arr, startAt = 1) {
  return arr.map((_, i) => `$${startAt + i}`).join(',');
}

module.exports = function installFileActivityRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/admin/file-activity
  // Query params (all optional):
  //   limit        integer  1-500, default 100
  //   offset       integer  default 0
  //   action       string   exact match against audit_log.action
  //   entity_type  string   exact match
  //   actor        string   ILIKE search on actor_username
  //   from         ISO date >= filter on at column
  //   to           ISO date <= filter on at column
  //   q            string   ILIKE search across action, entity_type, entity_id
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/admin/file-activity', requireAdmin, async (req, res) => {
    try {
      const limit  = Math.min(Math.max(parseInt(req.query.limit  || '100', 10), 1), 500);
      const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

      const actionFilter = req.query.action       || null;
      const entityFilter = req.query.entity_type  || null;
      const actorFilter  = req.query.actor        || null;
      const fromDate     = req.query.from         || null;
      const toDate       = req.query.to           || null;
      const search       = req.query.q            || null;

      const params = [...FILE_ACTIONS]; // $1..$N = the action whitelist
      const actionWhitelistClause = `action IN (${placeholders(FILE_ACTIONS)})`;
      const where = [actionWhitelistClause];

      // Additional filter clauses — each appends to params and refers to $N
      if (actionFilter) {
        params.push(actionFilter);
        where.push(`action = $${params.length}`);
      }
      if (entityFilter) {
        params.push(entityFilter);
        where.push(`entity_type = $${params.length}`);
      }
      if (actorFilter) {
        params.push('%' + actorFilter + '%');
        where.push(`actor_username ILIKE $${params.length}`);
      }
      if (fromDate) {
        params.push(fromDate);
        where.push(`at >= $${params.length}`);
      }
      if (toDate) {
        params.push(toDate);
        where.push(`at <= $${params.length}`);
      }
      if (search) {
        params.push('%' + search + '%');
        const n = params.length;
        where.push(`(action ILIKE $${n} OR entity_type ILIKE $${n} OR entity_id ILIKE $${n})`);
      }

      // Append limit/offset last
      params.push(limit);
      params.push(offset);
      const limitPlaceholder  = `$${params.length - 1}`;
      const offsetPlaceholder = `$${params.length}`;

      const whereClause = where.join(' AND ');

      const [listResult, todayResult] = await Promise.all([
        pool.query(`
          SELECT
            id, at, action, actor_username, entity_type, entity_id,
            source, meta, ip,
            COUNT(*) OVER() AS total_count
          FROM audit_log
          WHERE ${whereClause}
          ORDER BY at DESC
          LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
        `, params),

        pool.query(`
          SELECT COUNT(*) AS c
          FROM audit_log
          WHERE action IN (${placeholders(TODAY_ACTIONS)})
            AND at >= now() - interval '24 hours'
        `, TODAY_ACTIONS),
      ]);

      const total = parseInt(listResult.rows[0]?.total_count || '0', 10);

      const events = listResult.rows.map(r => {
        const { total_count, ...rest } = r;
        return {
          ...rest,
          meta: rest.meta ? redactPII(rest.meta) : null,
        };
      });

      res.setHeader('X-Audit-Redacted', 'true');
      res.json({
        events,
        total,
        total_today: parseInt(todayResult.rows[0].c, 10),
        limit,
        offset,
        file_actions: FILE_ACTIONS, // expose enum for filter dropdowns
      });
    } catch (e) {
      console.error('[file_activity:list]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/admin/file-activity/:id
  // Returns the full audit_log row including before_data and after_data jsonb.
  // All three jsonb columns are PII-redacted before transmission.
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/admin/file-activity/:id', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM audit_log WHERE id = $1',
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Event not found.' });

      const row = rows[0];
      row.before_data = row.before_data ? redactPII(row.before_data) : null;
      row.after_data  = row.after_data  ? redactPII(row.after_data)  : null;
      row.meta        = row.meta        ? redactPII(row.meta)        : null;

      res.setHeader('X-Audit-Redacted', 'true');
      res.json(row);
    } catch (e) {
      console.error('[file_activity:detail]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });
};
