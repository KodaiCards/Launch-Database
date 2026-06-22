// Helper for inserting event_log rows. Telemetry-only; NOT compliance.
//
// Usage:
//   const { logEvent, logEventsBatch, pruneOldEvents } = require('./_event_log');
//
//   // Single fire-and-forget insert (server-side events):
//   logEvent(pool, {
//     program: 'admin',
//     event_type: 'api_call',
//     source: 'server',
//     req,                    // optional Express request — stamped server-side
//     request_id: '...',
//     target: 'GET /api/projects',
//     http_status: 200,
//     duration_ms: 42,
//   });
//
//   // Batch insert (client-log ingest endpoint):
//   await logEventsBatch(pool, events);
//
// LOGGING MUST FAIL OPEN: every exported function wraps its entire body in
// try/catch and NEVER throws. A DB outage or any error here must not break
// the calling request or any portal.

const { redactPII } = require('./_audit');

// Maximum message length stored (characters)
const MAX_MESSAGE_LEN = 2000;
// Maximum meta payload (bytes, JSON-serialised)
const MAX_META_BYTES = 16 * 1024; // 16 KB
// Maximum events per batch insert
const MAX_BATCH_SIZE = 50;

/**
 * Redact and size-clamp a single event's meta + message fields.
 * Returns a new plain object with safe values; never throws.
 */
function _prepareEvent(ev) {
  if (!ev || typeof ev !== 'object') return {};
  const out = Object.assign({}, ev);

  // Clamp message
  if (typeof out.message === 'string' && out.message.length > MAX_MESSAGE_LEN) {
    out.message = out.message.slice(0, MAX_MESSAGE_LEN);
  }

  // Redact + clamp meta
  if (out.meta !== null && out.meta !== undefined) {
    try {
      const redacted = redactPII(out.meta);
      const serialized = JSON.stringify(redacted);
      if (serialized.length > MAX_META_BYTES) {
        out.meta = { _truncated: true, _original_size: serialized.length };
      } else {
        out.meta = redacted;
      }
    } catch (_) {
      out.meta = { _truncated: true, _redact_error: true };
    }
  }

  return out;
}

/**
 * Extract the 18 INSERT parameter values from a prepared event row.
 * source defaults to 'server' for single inserts, 'client' for batch.
 */
function _rowParams(safe, defaultSource) {
  return [
    safe.occurred_at || null,                                    // 1  occurred_at  (COALESCE→now())
    safe.program,                                                // 2  program
    safe.event_type,                                             // 3  event_type
    safe.source || defaultSource,                                // 4  source
    safe.actor_user_id || null,                                  // 5  actor_user_id
    safe.actor_username || null,                                 // 6  actor_username
    safe.actor_type || 'anonymous',                              // 7  actor_type
    safe.session_id || null,                                     // 8  session_id
    safe.request_id || null,                                     // 9  request_id
    safe.target || null,                                         // 10 target
    safe.url || null,                                            // 11 url
    safe.http_method || null,                                    // 12 http_method
    safe.http_status != null ? safe.http_status : null,          // 13 http_status
    safe.duration_ms != null ? safe.duration_ms : null,          // 14 duration_ms
    safe.message || null,                                        // 15 message
    safe.ip || null,                                             // 16 ip
    safe.user_agent || null,                                     // 17 user_agent
    safe.meta != null ? JSON.stringify(safe.meta) : null,        // 18 meta
  ];
}

const INSERT_COLS =
  '(occurred_at, program, event_type, source, ' +
  'actor_user_id, actor_username, actor_type, ' +
  'session_id, request_id, target, url, ' +
  'http_method, http_status, duration_ms, ' +
  'message, ip, user_agent, meta)';

// 18 columns; first is COALESCE'd with now()
const PER_ROW = 18;

function _singleRowClause(baseIdx) {
  // baseIdx = 1-based index of this row's first parameter
  const ph = [];
  for (let i = 0; i < PER_ROW; i++) {
    const p = '$' + (baseIdx + i);
    ph.push(i === 0 ? ('COALESCE(' + p + ', now())') : p);
  }
  return '(' + ph.join(', ') + ')';
}

/**
 * Fire-and-forget single-row insert into event_log.
 *
 * Pool and required fields (program, event_type) are validated; bad inputs
 * are logged to stderr and dropped silently. When req is supplied, actor
 * identity and ip/user_agent are stamped from it — caller-supplied actor
 * fields are IGNORED (server-side trust boundary).
 *
 * @param {Pool}   pool - pg Pool
 * @param {Object} ev   - event fields (see migration 0063 for column list)
 * @param {Object} [ev.req] - Express request; when present, actor/ip/ua
 *                           are stamped from it (caller-supplied ignored).
 */
async function logEvent(pool, ev) {
  try {
    if (!pool || typeof pool.query !== 'function') {
      console.error('[event_log:insert] pool is missing or not a pg pool');
      return;
    }
    if (!ev || typeof ev !== 'object') {
      console.error('[event_log:insert] ev is missing or not an object');
      return;
    }
    if (!ev.program || !ev.event_type) {
      console.error('[event_log:insert] missing required fields: program and event_type are required');
      return;
    }

    const safe = _prepareEvent(ev);

    // Stamp actor from req when present (server-side trust boundary)
    const req = safe.req || null;
    const user = req && req.user ? req.user : null;
    if (user) {
      safe.actor_user_id = user.id || null;
      safe.actor_username = user.username || user.email || null;
      safe.actor_type = safe.actor_type || 'user';
    }
    if (req) {
      safe.ip = req.ip || (req.headers && req.headers['x-forwarded-for']) || null;
      safe.user_agent = (req.headers && req.headers['user-agent']) || null;
    }
    if (!safe.actor_type) {
      safe.actor_type = user ? 'user' : 'anonymous';
    }
    safe.source = safe.source || 'server';

    const params = _rowParams(safe, 'server');
    await pool.query(
      'INSERT INTO event_log ' + INSERT_COLS + ' VALUES ' + _singleRowClause(1),
      params
    );
  } catch (e) {
    console.error('[event_log:insert]', e && e.message);
  }
}

/**
 * Batch insert up to MAX_BATCH_SIZE events into event_log in one query.
 * Rows missing program or event_type are skipped silently.
 * Actor identity MUST already be stamped by the caller (ingest endpoint);
 * this function does NOT accept req objects — use logEvent for that.
 *
 * @param {Pool}    pool   - pg Pool
 * @param {Array}   events - array of pre-stamped event objects
 */
async function logEventsBatch(pool, events) {
  try {
    if (!pool || typeof pool.query !== 'function') {
      console.error('[event_log:batch] pool is missing or not a pg pool');
      return;
    }
    if (!Array.isArray(events) || events.length === 0) {
      return;
    }

    // Cap at MAX_BATCH_SIZE
    const capped = events.slice(0, MAX_BATCH_SIZE);

    // Filter + prepare rows; skip any missing required fields
    const rows = [];
    for (const ev of capped) {
      if (!ev || typeof ev !== 'object') continue;
      if (!ev.program || !ev.event_type) continue;
      rows.push(_prepareEvent(ev));
    }

    if (rows.length === 0) {
      return;
    }

    // Build ONE parameterized multi-row INSERT
    const valueClauses = [];
    const params = [];
    let baseIdx = 1;

    for (const row of rows) {
      valueClauses.push(_singleRowClause(baseIdx));
      params.push(..._rowParams(row, 'client'));
      baseIdx += PER_ROW;
    }

    const sql =
      'INSERT INTO event_log ' + INSERT_COLS + ' VALUES ' +
      valueClauses.join(', ');

    await pool.query(sql, params);
  } catch (e) {
    console.error('[event_log:batch]', e && e.message);
  }
}

/**
 * Hard-delete event_log rows older than retention_days (default: 30).
 * Reads policy from event_retention_config (id=1). Updates last_prune_run_at
 * and last_prune_row_count after deletion. Returns deleted row count.
 * Never throws — caller (scheduled prune) gets 0 on any error.
 *
 * @param {Pool} pool - pg Pool
 * @returns {Promise<number>} rows deleted
 */
async function pruneOldEvents(pool) {
  try {
    if (!pool || typeof pool.query !== 'function') {
      console.error('[event_log:prune] pool is missing or not a pg pool');
      return 0;
    }

    // Read retention policy; fall back to 30 days if config missing
    let retentionDays = 30;
    try {
      const cfg = await pool.query(
        'SELECT retention_days FROM event_retention_config WHERE id = 1'
      );
      if (cfg.rows.length > 0 && cfg.rows[0].retention_days != null) {
        retentionDays = cfg.rows[0].retention_days;
      }
    } catch (_) {
      // Config table may not exist yet on first run; use default
    }

    const deleteResult = await pool.query(
      `DELETE FROM event_log
       WHERE occurred_at < now() - ($1::text || ' days')::interval`,
      [String(retentionDays)]
    );

    const deleted = deleteResult.rowCount || 0;

    // Update prune run state — non-critical; ignore error
    try {
      await pool.query(
        `UPDATE event_retention_config
         SET last_prune_run_at    = now(),
             last_prune_row_count = $1,
             updated_at           = now()
         WHERE id = 1`,
        [deleted]
      );
    } catch (_) {
      // Non-critical; prune still succeeded
    }

    console.log('[event_log:prune] deleted ' + deleted + ' rows older than ' + retentionDays + ' days');
    return deleted;
  } catch (e) {
    console.error('[event_log:prune]', e && e.message);
    return 0;
  }
}

module.exports = { logEvent, logEventsBatch, pruneOldEvents };
