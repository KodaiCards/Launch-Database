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
  const {
    req, action, entity_type, entity_id,
    before = null, after = null,
    source = 'api', meta = null,
    actor_type = 'user',
  } = opts;
  try {
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
 * Deep clone an object and redact sensitive keys.
 * Sensitive key patterns (case-insensitive substring match):
 *   - password, password_hash, passwordHash, hash
 *   - token, raw_token, rawToken, api_key, apiKey, secret, private_key, privateKey
 *   - ssn, social_security, socialSecurity, tax_id, taxId, ein
 *   - credit_card, creditCard, card_number, cardNumber, cvv
 *   - bank_account, bankAccount, routing_number, routingNumber
 *   - dob, date_of_birth, dateOfBirth
 *
 * Recursively walks nested objects and arrays.
 * Does NOT redact emails, phone numbers, names, addresses (operational fields).
 */
function redactPII(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactPII(item));
  }

  if (typeof obj === 'object') {
    const redacted = {};
    const sensitivePatternsLower = [
      'password', 'password_hash', 'passwordhash', 'hash',
      'token', 'raw_token', 'rawtoken', 'api_key', 'apikey', 'secret', 'private_key', 'privatekey',
      'ssn', 'social_security', 'socialsecurity', 'tax_id', 'taxid', 'ein',
      'credit_card', 'creditcard', 'card_number', 'cardnumber', 'cvv',
      'bank_account', 'bankaccount', 'routing_number', 'routingnumber',
      'dob', 'date_of_birth', 'dateofbirth',
    ];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const keyLower = key.toLowerCase();
        const isSensitive = sensitivePatternsLower.some(pattern => keyLower.includes(pattern));

        if (isSensitive) {
          redacted[key] = '[REDACTED]';
        } else {
          redacted[key] = redactPII(obj[key]);
        }
      }
    }
    return redacted;
  }

  // Primitives (string, number, boolean) returned as-is
  return obj;
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
    const hotRetentionDays = options.hot_retention_days ||
      (configResult.rows[0]?.hot_retention_days ?? 730);

    // Calculate cutoff: rows older than hot_retention_days get archived
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - hotRetentionDays);

    // Update rows to set archived_at (transactional)
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

    console.log(`[audit-retention] archived ${rowsArchived} rows older than ${hotRetentionDays} days (cutoff: ${cutoffDate.toISOString()})`);

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
