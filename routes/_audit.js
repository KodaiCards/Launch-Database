// Helper for inserting audit_log rows. Imported wherever state changes.
//
// Usage:
//   const { logAudit } = require('./_audit');
//   await logAudit(pool, {
//     req,
//     action: 'create',
//     entity_type: 'project',
//     entity_id: project.id,
//     before: null,
//     after: project,
//     source: 'admin_ui',
//     meta: { reason: '...' }, // optional
//   });
//
// Errors are caught + console.error'd (never break the actual operation).

async function logAudit(pool, opts) {
  try {
    // HIGH-1: guard opts missing or wrong-signature caller (pool bundled inside opts)
    if (!opts || typeof opts !== 'object') {
      console.error('[logAudit] opts is missing or not an object — likely wrong-signature caller');
      return;
    }
    if (!pool || typeof pool.query !== 'function') {
      console.error('[logAudit] pool is missing or not a pg pool — wrong-signature caller (likely passing pool inside opts)');
      return;
    }

    const {
      req, action, entity_type, entity_id,
      before = null, after = null,
      source = 'api', meta = null,
      actor_type = 'user',
    } = opts;

    // HIGH-3: validate required fields BEFORE insert
    if (!action || !entity_type) {
      console.error('[logAudit] missing required field: action and entity_type are required (got action=' + action + ', entity_type=' + entity_type + ')');
      return;
    }

    const user = req && req.user ? req.user : null;
    const actor_user_id = user ? user.id : null;
    const actor_username = user ? (user.username || user.email || null) : null;
    const ip = req ? (req.ip || req.headers['x-forwarded-for'] || null) : null;
    const ua = req ? (req.headers['user-agent'] || null) : null;

    await pool.query(
      `INSERT INTO audit_log
        (actor_user_id, actor_username, actor_type, action, entity_type, entity_id,
         before_data, after_data, source, ip, user_agent, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [actor_user_id, actor_username, actor_type, action, entity_type,
       entity_id != null ? String(entity_id) : null,
       before, after, source, ip, ua, meta]
    );
  } catch (e) {
    console.error('[audit_log:insert]', e && e.message);
  }
}

/**
 * Sensitive key patterns — use precise regex to avoid false positives on
 * operational fields like commit_hash, content_hash, token_count, hashtag.
 *
 * MED-1: replaced bare-substring 'hash'/'token' with targeted patterns.
 * MED-2: added jwt, session_id, lfs_session, cookie, authorization, pin, mfa_code, otp.
 */
const SENSITIVE_KEY_PATTERNS = [
  // password variants
  /^password/i, /password$/i, /password_/i,
  // token: only credential tokens, not token_count / tokenize / token_type
  /^token$/i, /_token$/i, /^raw_token/i, /^access_token/i, /^refresh_token/i,
  // secret, api_key, private_key
  /^secret/i, /_secret$/i, /_secret_/i,
  /^api[_-]?key/i, /_api[_-]?key/i,
  /^private[_-]?key/i, /privatekey/i,
  // hash: only credential-hash fields, not commit_hash / content_hash / hashtag
  /password_hash/i, /token_hash/i, /pin_hash/i, /otp_hash/i, /session_hash/i,
  // jwt
  /^jwt/i, /_jwt$/i,
  // session identifiers
  /^session_id$/i, /_session_id$/i, /^lfs_session/i,
  // HTTP credential headers
  /^cookie$/i, /^authorization$/i,
  // PINs and one-time codes
  /^pin$/i, /^mfa_code/i, /^otp$/i, /^mfa$/i,
  // PII / financial
  /ssn/i, /social_security/i, /tax_id/i, /ein/i,
  /credit_card/i, /card_number/i, /cvv/i,
  /bank_account/i, /routing_number/i,
  /^dob$/i, /date_of_birth/i,
];

function isSensitiveKey(key) {
  return SENSITIVE_KEY_PATTERNS.some(p => p.test(key));
}

/**
 * Deep clone an object and redact sensitive keys.
 *
 * HIGH-2: cycle detection via WeakSet prevents RangeError on circular refs.
 * MED-1+MED-2: regex-based key matching replaces substring match.
 *
 * Recursively walks nested objects and arrays.
 * Does NOT redact emails, phone numbers, names, addresses (operational fields).
 */
function redactPII(obj, _seen) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  // HIGH-2: cycle detection
  _seen = _seen || new WeakSet();
  if (_seen.has(obj)) return '[Circular]';
  _seen.add(obj);

  if (Array.isArray(obj)) return obj.map(v => redactPII(v, _seen));

  const out = {};
  for (const key of Object.keys(obj)) {
    if (isSensitiveKey(key)) {
      out[key] = '[REDACTED]';
    } else {
      out[key] = redactPII(obj[key], _seen);
    }
  }
  return out;
}

/**
 * Archive old audit_log rows by setting archived_at timestamp.
 * Respects the hot_retention_days threshold from audit_retention_config.
 * Rows are NOT deleted (DELETE trigger prevents removal); only marked archived.
 *
 * @param {Pool} pool - Postgres connection pool
 * @param {Object} options - optional overrides
 * @param {number} options.hot_retention_days - override config default
 * @returns {Promise<{rows_archived: number, cutoff_at: Date}>}
 */
async function archiveOldAuditRows(pool, options = {}) {
  try {
    // Read current retention config
    const configResult = await pool.query(
      `SELECT hot_retention_days FROM audit_retention_config WHERE id = 1`
    );

    // MED-4: use ?? instead of || so hot_retention_days=0 doesn't fall through
    // MED-5: Math.max(7, ...) enforces minimum 7-day floor to prevent archiving everything
    const retentionDays = Math.max(7, options.hot_retention_days ?? (configResult.rows[0]?.hot_retention_days ?? 730));

    // Calculate cutoff: rows older than retentionDays get archived
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Update rows to set archived_at
    const updateResult = await pool.query(
      `UPDATE audit_log
       SET archived_at = now()
       WHERE archived_at IS NULL AND at < $1
       RETURNING id`,
      [cutoffDate]
    );

    const rowsArchived = updateResult.rowCount || 0;

    // Update the config table with run state
    await pool.query(
      `UPDATE audit_retention_config
       SET last_archive_run_at = now(),
           last_archive_row_count = $1,
           updated_at = now()
       WHERE id = 1`,
      [rowsArchived]
    );

    console.log(`[audit-retention] archived ${rowsArchived} rows older than ${retentionDays} days (cutoff: ${cutoffDate.toISOString()})`);

    return {
      rows_archived: rowsArchived,
      cutoff_at: cutoffDate,
    };
  } catch (e) {
    console.error('[audit_log:archive]', e && e.message);
    throw e; // Re-throw so caller can decide whether to fail gracefully
  }
}

module.exports = { logAudit, redactPII, archiveOldAuditRows };
