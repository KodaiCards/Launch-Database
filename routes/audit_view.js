// routes/audit_view.js — read-only audit log viewer (manager/admin only).
// CEO mount: require('./routes/audit_view')(app, pool, { requireManagerOrAdmin })
//
//   GET /api/audit/log?limit=&offset=&action=&entity_type=&actor=
//   Returns recent audit_log rows newest-first, paginated.

module.exports = function installAuditViewRoutes(app, pool, mw) {
  const requireManagerOrAdmin =
    (mw && mw.requireManagerOrAdmin) || ((_req, _res, next) => next());

  app.get('/api/audit/log', requireManagerOrAdmin, async (req, res) => {
    const limit  = Math.min(Math.max(parseInt(req.query.limit  || '100', 10), 1), 500);
    const offset = Math.max(parseInt(req.query.offset || '0',   10), 0);
    const conditions = [];
    const params = [];

    if (req.query.action) {
      params.push(req.query.action);
      conditions.push(`action = $${params.length}`);
    }
    if (req.query.entity_type) {
      params.push(req.query.entity_type);
      conditions.push(`entity_type = $${params.length}`);
    }
    if (req.query.actor) {
      params.push('%' + req.query.actor.replace(/%/g, '\\%').replace(/_/g, '\\_') + '%');
      conditions.push(`actor_username ILIKE $${params.length} ESCAPE '\\'`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(limit, offset);

    try {
      const { rows } = await pool.query(
        `SELECT id, created_at, actor_username, actor_type, action,
                entity_type, entity_id, source, ip
         FROM audit_log
         ${where}
         ORDER BY created_at DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      );
      const countRes = await pool.query(
        `SELECT COUNT(*)::int AS total FROM audit_log ${where}`,
        params.slice(0, params.length - 2)
      );
      res.json({ rows, total: countRes.rows[0].total, limit, offset });
    } catch (e) {
      console.error('[audit-view]', e && e.message);
      res.status(500).json({ error: 'Failed to load audit log.' });
    }
  });
};
