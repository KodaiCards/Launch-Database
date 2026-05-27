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

module.exports = { logAudit };
