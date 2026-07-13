// routes/certificates.js — OSP completion certificates (specs/certificates.md).
// Public verify + admin issue/list/revoke. Registrar wires the mount in server.js.

// Fixed-window limiter for the PUBLIC verify endpoint: 30 lookups/min/IP.
const hits = new Map();
function verifyLimiter(req, res, next) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const b = hits.get(ip);
  if (!b || now - b.start > 60000) { hits.set(ip, { start: now, n: 1 }); return next(); }
  if (++b.n > 30) return res.status(429).json({ error: 'Too many lookups — try again in a minute.' });
  next();
}
setInterval(() => {
  const cutoff = Date.now() - 120000;
  for (const [ip, b] of hits) if (b.start < cutoff) hits.delete(ip);
}, 60000).unref();

module.exports = function (app, pool, { requireAdmin }) {

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
  app.post('/api/certificates/issue', requireAdmin, async (req, res) => {
    const userId = parseInt(req.body.user_id, 10);
    if (!userId) return res.status(400).json({ error: 'user_id required' });
    const completedOn = req.body.completed_on || new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn)) return res.status(400).json({ error: 'completed_on must be YYYY-MM-DD' });
    try {
      const { rows: urows } = await pool.query(
        `SELECT id, COALESCE(NULLIF(TRIM(full_name), ''), username) AS recipient FROM users WHERE id = $1`, [userId]);
      if (!urows.length) return res.status(404).json({ error: 'user not found' });

      const { rows: existing } = await pool.query(
        `SELECT * FROM training_certificates
          WHERE user_id = $1 AND course_code = 'OSP_DESIGN' AND NOT revoked`, [userId]);
      if (existing.length) return res.json({ certificate: existing[0], existing: true });

      const year = new Date().getFullYear();
      let cert = null;
      for (let attempt = 0; attempt < 5 && !cert; attempt++) {
        const { rows: [{ n }] } = await pool.query(
          `SELECT COUNT(*)::int AS n FROM training_certificates WHERE cert_no LIKE $1`,
          [`LFS-OSP-${year}-%`]);
        const certNo = `LFS-OSP-${year}-${String(n + 1 + attempt).padStart(4, '0')}`;
        try {
          const { rows: [row] } = await pool.query(
            `INSERT INTO training_certificates
               (cert_no, user_id, recipient_name, completed_on, issued_by)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [certNo, userId, urows[0].recipient, completedOn, req.user.username]);
          cert = row;
        } catch (e) { if (e.code !== '23505') throw e; /* number raced — retry */ }
      }
      if (!cert) return res.status(500).json({ error: 'could not allocate certificate number' });
      res.json({ certificate: cert });
    } catch (e) {
      console.error('[certificates] issue failed:', e.message);
      res.status(500).json({ error: 'issue failed' });
    }
  });

  // ADMIN — list + revoke.
  app.get('/api/certificates', requireAdmin, async (_req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM training_certificates ORDER BY issued_at DESC`);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: 'list failed' }); }
  });

  app.post('/api/certificates/:id/revoke', requireAdmin, async (req, res) => {
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
