// routes/system_info.js — read-only system/build info endpoint (manager/admin).
// CEO mount: require('./routes/system_info')(app, pool, { requireManagerOrAdmin })
//
//   GET /api/system/info → version, node, uptime, db connectivity. NO secrets.

const pkg = require('../package.json');

module.exports = function installSystemInfoRoutes(app, pool, mw) {
  const requireManagerOrAdmin =
    (mw && mw.requireManagerOrAdmin) || ((_req, _res, next) => next());

  app.get('/api/system/info', requireManagerOrAdmin, async (req, res) => {
    let dbOk = false;
    let dbVersion = null;
    try {
      const { rows } = await pool.query('SELECT version() AS v, now() AS ts');
      dbOk = true;
      // Extract just the Postgres version number, e.g. "PostgreSQL 15.3"
      const m = (rows[0].v || '').match(/PostgreSQL\s+[\d.]+/i);
      dbVersion = m ? m[0] : rows[0].v.split(' ').slice(0, 2).join(' ');
    } catch (_) { /* db unreachable — leave false */ }

    res.json({
      app: pkg.name || 'launch-fiber-services',
      version: pkg.version || '—',
      node: process.version,
      env: process.env.NODE_ENV || 'development',
      uptime_seconds: Math.floor(process.uptime()),
      db_ok: dbOk,
      db_version: dbVersion,
      portal_mode: (process.env.PORTAL_MODE || '').toLowerCase() || 'admin',
    });
  });
};
