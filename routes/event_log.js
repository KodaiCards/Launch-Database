// routes/event_log.js — Observability event log: ingest + admin read API
//
// Factory pattern: install(app, pool, mw) — matches routes/file_activity.js style.
//
// Endpoints:
//   POST /api/events/client-log          — client-side event ingest (fire-and-forget, always 204)
//   GET  /api/admin/logs                 — paginated list with optional filters (admin only)
//   GET  /api/admin/logs/meta            — distinct programs, event_types, 24h error count (admin only)
//   GET  /api/admin/logs/:id             — single row detail (admin only)
//   POST /api/admin/logs/prune           — hard-delete rows older than retention_days (admin only)
//
// LOGGING MUST FAIL OPEN: every handler wraps its entire body in try/catch
// and the ingest endpoint ALWAYS returns 2xx regardless of DB errors.

'use strict';

const { logEventsBatch, pruneOldEvents } = require('./_event_log');
const { redactPII } = require('./_audit');

// Per-IP ingest rate limit: 300 events/min using a local sliding-window map.
// Used when mw.rateLimitOk is not passed.
const _ingestBuckets = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _ingestBuckets) {
    const fresh = v.filter(t => now - t < 60 * 1000);
    if (fresh.length === 0) _ingestBuckets.delete(k);
    else _ingestBuckets.set(k, fresh);
  }
}, 5 * 60 * 1000).unref();

function localRateLimitOk(ip) {
  const now = Date.now();
  const arr = (_ingestBuckets.get(ip) || []).filter(t => now - t < 60 * 1000);
  if (arr.length >= 300) {
    _ingestBuckets.set(ip, arr);
    return false;
  }
  arr.push(now);
  _ingestBuckets.set(ip, arr);
  return true;
}

module.exports = function installEventLogRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
  // System F (#77): the diagnostics-log admin reads/prune are delegable via the
  // catalog key — admin still passes (requirePermission admits admin by role).
  const { requirePermission } = require('./_permissions');
  const canToggleLogger = requirePermission(pool, 'system.logger_toggle');
  // rateLimitOk from auth.js: rateLimitOk(key, limit, windowMs) → boolean
  const externalRateLimitOk = (mw && typeof mw.rateLimitOk === 'function') ? mw.rateLimitOk : null;

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/events/client-log
  // Accepts batches of client-side events. Always responds 204 (fail-open).
  // - No hard auth gate: accepts authenticated users, anonymous pre-login,
  //   and external client-portal users (req.user may or may not be set).
  // - Per-IP rate limit (300/min); when over limit still returns 204.
  // - Stamps ip, user_agent, actor identity server-side.
  // - IGNORES any client-supplied actor identity fields.
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/events/client-log', async (req, res) => {
    // Always respond 204 — fire-and-forget from the client's perspective.
    // All real work is wrapped in try/catch so a throw can never propagate.
    res.status(204).end();

    try {
      const ip = req.ip || '';

      // Per-IP rate limit — when over limit, drop silently (204 already sent).
      const allowed = externalRateLimitOk
        ? externalRateLimitOk('events:ingest:' + ip, 300, 60 * 1000)
        : localRateLimitOk(ip);
      if (!allowed) return;

      const body = req.body || {};
      const rawEvents = Array.isArray(body.events) ? body.events : [];
      if (rawEvents.length === 0) return;

      // Cap at 50 events per request (enforced again inside logEventsBatch,
      // but guard here so we don't iterate over a huge array unnecessarily).
      const capped = rawEvents.slice(0, 50);

      // Resolve actor identity from req.user (server-side trust boundary).
      // NEVER use client-supplied actor fields.
      const user = req.user || null;
      const actorUserId   = user ? (user.id   || null) : null;
      const actorUsername = user ? (user.username || user.email || null) : null;
      const actorType     = user
        ? (user.role === 'customer' ? 'client' : 'user')
        : 'anonymous';

      const ua = req.headers['user-agent'] || null;

      // Stamp server-controlled fields onto every event; strip any
      // client-supplied actor identity fields.
      const stamped = capped.map(ev => {
        if (!ev || typeof ev !== 'object') return null;
        const out = Object.assign({}, ev);

        // Strip client-supplied actor identity — server stamps these.
        delete out.actor_user_id;
        delete out.actor_username;
        delete out.actor_type;

        // Stamp server-controlled fields.
        out.source         = 'client';
        out.actor_user_id  = actorUserId;
        out.actor_username = actorUsername;
        out.actor_type     = actorType;
        out.ip             = ip || null;
        out.user_agent     = ua;

        return out;
      }).filter(Boolean);

      if (stamped.length === 0) return;

      // Fire-and-forget: do not await (response already sent).
      logEventsBatch(pool, stamped).catch(e => {
        console.error('[event_log:ingest]', e && e.message);
      });
    } catch (e) {
      console.error('[event_log:ingest]', e && e.message);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/admin/logs
  // Paginated list of event_log rows with optional filters.
  // Query params (all optional):
  //   program          text   exact match
  //   event_type       text   exact match
  //   source           text   exact match ('client' | 'server')
  //   actor_user_id    uuid   exact match
  //   request_id       text   exact match
  //   from             ISO    occurred_at >= $
  //   to               ISO    occurred_at <= $
  //   q                text   ILIKE across target, url, message, actor_username
  //   limit            int    default 100, cap 500
  //   offset           int    default 0
  // Returns: { rows, total, limit, offset }
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/admin/logs', canToggleLogger, async (req, res) => {
    try {
      const limit  = Math.min(Math.max(parseInt(req.query.limit  || '100', 10), 1), 500);
      const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

      const filters = [];
      const params  = [];
      let   p       = 0; // parameter counter

      if (req.query.program) {
        params.push(req.query.program);
        filters.push(`program = $${++p}`);
      }
      if (req.query.event_type) {
        params.push(req.query.event_type);
        filters.push(`event_type = $${++p}`);
      }
      if (req.query.source) {
        params.push(req.query.source);
        filters.push(`source = $${++p}`);
      }
      if (req.query.actor_user_id) {
        params.push(req.query.actor_user_id);
        filters.push(`actor_user_id = $${++p}`);
      }
      if (req.query.request_id) {
        params.push(req.query.request_id);
        filters.push(`request_id = $${++p}`);
      }
      if (req.query.from) {
        params.push(req.query.from);
        filters.push(`occurred_at >= $${++p}`);
      }
      if (req.query.to) {
        params.push(req.query.to);
        filters.push(`occurred_at <= $${++p}`);
      }
      if (req.query.q) {
        // Escape ILIKE metacharacters so user input is treated as literals.
        const escaped = req.query.q.replace(/[%_\\]/g, '\\$&');
        const term = '%' + escaped + '%';
        // Four separate parameter slots — one per ILIKE column.
        params.push(term); const p1 = ++p;
        params.push(term); const p2 = ++p;
        params.push(term); const p3 = ++p;
        params.push(term); const p4 = ++p;
        filters.push(
          `(target ILIKE $${p1} OR url ILIKE $${p2} OR message ILIKE $${p3} OR actor_username ILIKE $${p4})`
        );
      }

      const whereClause = filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : '';

      params.push(limit);  const limitPlaceholder  = `$${++p}`;
      params.push(offset); const offsetPlaceholder = `$${++p}`;

      const { rows } = await pool.query(`
        SELECT
          id, occurred_at, program, event_type, source,
          actor_user_id, actor_username, actor_type,
          session_id, request_id, target, url,
          http_method, http_status, duration_ms,
          message, ip, user_agent, meta,
          COUNT(*) OVER() AS total_count
        FROM event_log
        ${whereClause}
        ORDER BY occurred_at DESC, id DESC
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
      `, params);

      const total = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;

      const cleanRows = rows.map(row => {
        const { total_count, ...rest } = row;
        return {
          ...rest,
          meta: rest.meta ? redactPII(rest.meta) : null,
        };
      });

      res.set('X-Audit-Redacted', 'true');
      res.json({ rows: cleanRows, total, limit, offset });
    } catch (e) {
      console.error('[event_log:list]', e && e.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/admin/logs/meta
  // Returns distinct programs, distinct event_types, and 24h error count.
  // Must be registered BEFORE /api/admin/logs/:id so Express does not
  // interpret 'meta' as an :id param.
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/admin/logs/meta', canToggleLogger, async (req, res) => {
    try {
      const ERROR_TYPES = ['js_error', 'api_error', 'promise_rejection', 'login_failed'];

      const [programsResult, eventTypesResult, errorCountResult] = await Promise.all([
        pool.query(`SELECT DISTINCT program FROM event_log ORDER BY program`),
        pool.query(`SELECT DISTINCT event_type FROM event_log ORDER BY event_type`),
        pool.query(
          `SELECT COUNT(*) AS c FROM event_log
           WHERE event_type = ANY($1::text[])
             AND occurred_at >= now() - interval '24 hours'`,
          [ERROR_TYPES]
        ),
      ]);

      res.json({
        programs:     programsResult.rows.map(r => r.program),
        eventTypes:   eventTypesResult.rows.map(r => r.event_type),
        errorCount24h: parseInt(errorCountResult.rows[0].c, 10),
      });
    } catch (e) {
      console.error('[event_log:meta]', e && e.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/admin/logs/prune
  // Manually trigger a hard-delete of rows older than retention_days.
  // Must be registered BEFORE /api/admin/logs/:id.
  // Returns: { deleted }
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/admin/logs/prune', canToggleLogger, async (req, res) => {
    try {
      const deleted = await pruneOldEvents(pool);
      res.json({ deleted });
    } catch (e) {
      console.error('[event_log:prune-api]', e && e.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/admin/logs/:id
  // Single row detail with redacted meta. 404 if not found.
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/admin/logs/:id', canToggleLogger, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      const { rows } = await pool.query(
        `SELECT
           id, occurred_at, program, event_type, source,
           actor_user_id, actor_username, actor_type,
           session_id, request_id, target, url,
           http_method, http_status, duration_ms,
           message, ip, user_agent, meta
         FROM event_log WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found.' });
      }

      const row = rows[0];
      res.set('X-Audit-Redacted', 'true');
      res.json({
        ...row,
        meta: row.meta ? redactPII(row.meta) : null,
      });
    } catch (e) {
      console.error('[event_log:detail]', e && e.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};
