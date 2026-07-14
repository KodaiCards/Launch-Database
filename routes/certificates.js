// routes/certificates.js — OSP completion certificates (specs/certificates.md).
// Public verify + admin issue/list/revoke. Registrar wires the mount in server.js.

// System F (#75): issue/list/revoke gate on the `certificates.issue` permission
// key (was requireAdmin). Non-regressive — admin holds every key, so admins still
// pass; this just lets `certificates.issue` be delegated to a non-admin (e.g. a
// training lead) via the Settings page without handing them full admin.
const { requirePermission } = require('./_permissions');

// Fixed-window limiter for the PUBLIC verify endpoint: 30 lookups/min/IP.
// #68 finding 2: use req.ip (Express derives it via `trust proxy`, set in
// server.js) — NOT a raw x-forwarded-for split, which is client-spoofable and
// would defeat the "no enumeration farming" invariant. Matches auth.js's limiters.
const hits = new Map();
function verifyLimiter(req, res, next) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const b = hits.get(ip);
  if (!b || now - b.start > 60000) { hits.set(ip, { start: now, n: 1 }); return next(); }
  if (++b.n > 30) {
    res.set('Retry-After', '60'); // #68 minor: tell honest clients when to retry
    return res.status(429).json({ error: 'Too many lookups — try again in a minute.' });
  }
  next();
}
setInterval(() => {
  const cutoff = Date.now() - 120000;
  for (const [ip, b] of hits) if (b.start < cutoff) hits.delete(ip);
}, 60000).unref();

module.exports = function (app, pool, { requireAdmin }) {
  // The write/list surfaces gate on certificates.issue (admin passes via admin=all).
  const canIssueCerts = requirePermission(pool, 'certificates.issue');

  // PUBLIC — answers exactly what the printed certificate shows, nothing else.
  app.get('/api/certificates/verify/:certNo', verifyLimiter, async (req, res) => {
    try {
      const certNo = String(req.params.certNo || '').trim().toUpperCase();
      if (!/^LFS-[A-Z]+-\d{4}-\d{4}$/.test(certNo)) return res.json({ valid: false });
      const { rows } = await pool.query(
        `SELECT cert_no, recipient_name, course_title, completed_on, revoked
           FROM training_certificates WHERE cert_no = $1`, [certNo]);
      if (!rows.length || rows[0].revoked) return res.json({ valid: false });
      const c = rows[0];
      res.json({ valid: true, cert_no: c.cert_no, recipient_name: c.recipient_name,
                 course_title: c.course_title, completed_on: c.completed_on });
    } catch (e) {
      console.error('[certificates] verify failed:', e.message);
      res.status(500).json({ error: 'Lookup failed — try again.' });
    }
  });

  // ADMIN — issue for a trainee. Idempotent: an active cert for the same
  // user+course is returned as-is, never duplicated.
  app.post('/api/certificates/issue', canIssueCerts, async (req, res) => {
    // #68/Registrar merge-fix: user ids are UUIDs — do NOT parseInt (that mangled
    // the id and broke issuance against the real schema). Validate the UUID shape.
    const userId = String(req.body.user_id || '').trim();
    if (!userId) return res.status(400).json({ error: 'user_id required' });
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return res.status(400).json({ error: 'user_id must be a valid UUID' });
    }
    const completedOn = req.body.completed_on || new Date().toISOString().slice(0, 10);
    // #68 minor: shape AND calendar validity (2026-13-40 passes the regex but is not a real date).
    if (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn)) return res.status(400).json({ error: 'completed_on must be YYYY-MM-DD' });
    const parsed = new Date(completedOn + 'T00:00:00Z');
    if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== completedOn) {
      return res.status(400).json({ error: 'completed_on must be a valid calendar date (YYYY-MM-DD)' });
    }

    // #68 finding 1: serialize cert-no allocation in a transaction under a
    // per-year advisory lock, so concurrent issues (double-click / batch) can
    // never compute the same candidate and exhaust the retry loop into a 500.
    // The lock ALSO closes the latent same-user double-issue race (the old
    // idempotency check ran outside any lock). Gap-safe MAX+1 numbering.
    const client = await pool.connect();
    try {
      const { rows: urows } = await client.query(
        `SELECT id, COALESCE(NULLIF(TRIM(full_name), ''), username) AS recipient FROM users WHERE id = $1`, [userId]);
      if (!urows.length) { client.release(); return res.status(404).json({ error: 'user not found' }); }

      const year = new Date().getFullYear();
      await client.query('BEGIN');
      await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [`cert:OSP:${year}`]);

      const { rows: existing } = await client.query(
        `SELECT * FROM training_certificates
          WHERE user_id = $1 AND course_code = 'OSP_DESIGN' AND NOT revoked`, [userId]);
      if (existing.length) {
        await client.query('COMMIT');
        return res.json({ certificate: existing[0], existing: true });
      }

      const { rows: [{ maxseq }] } = await client.query(
        `SELECT COALESCE(MAX(CAST(SPLIT_PART(cert_no, '-', 4) AS INT)), 0) AS maxseq
           FROM training_certificates WHERE cert_no LIKE $1`, [`LFS-OSP-${year}-%`]);
      const certNo = `LFS-OSP-${year}-${String(maxseq + 1).padStart(4, '0')}`;
      const { rows: [row] } = await client.query(
        `INSERT INTO training_certificates
           (cert_no, user_id, recipient_name, completed_on, issued_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [certNo, userId, urows[0].recipient, completedOn, req.user.username]);
      await client.query('COMMIT');
      res.json({ certificate: row });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[certificates] issue failed:', e.message);
      res.status(500).json({ error: 'issue failed' });
    } finally {
      client.release();
    }
  });

  // ADMIN — list + revoke.
  app.get('/api/certificates', canIssueCerts, async (_req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM training_certificates ORDER BY issued_at DESC`);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: 'list failed' }); }
  });

  app.post('/api/certificates/:id/revoke', canIssueCerts, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE training_certificates
            SET revoked = true, revoked_reason = $2
          WHERE id = $1 RETURNING *`,
        [parseInt(req.params.id, 10), String(req.body.reason || '').slice(0, 300)]);
      if (!rows.length) return res.status(404).json({ error: 'not found' });
      res.json({ certificate: rows[0] });
    } catch (e) { res.status(500).json({ error: 'revoke failed' }); }
  });
};
