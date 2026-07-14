# SPEC — OSP completion certificate + public verification

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner session; verbatim ask: "Make sure you include the code for that actual verification system and have it done right so it says the name of the person and everything when they enter the cert number in.")
> Visual draft approved same session (artifact `dfc3bb9b`): navy/logo-blue, Rudy Douglas · Director signature, no seal. Seed history: `specs/ideas/completion-certificate.md`.

## ⚠ URGENCY — Carter 2026-07-13 12:42: "This needs to be fully operational ASAP… I need to take the course and have the cert today or tomorrow. This is critical." Decompose as ONE issue, label `urgent` (queue-jump lane). Cert no. **LFS-OSP-2026-0001 is reserved for Carter** — when the system lands, issue his certificate FIRST so the number on his already-printed paper resolves correctly.

## What ships (v1 — one foreman package)
1. `training_certificates` table (migration 0083 — renumber if taken at claim time).
2. `routes/certificates.js` — PUBLIC verify endpoint + admin issue/list/revoke.
3. `public/verify.html` — branded lookup page: enter cert number → recipient name, course, completion date.
4. Registrar wires the mount in `server.js` at merge (foremen never touch server.js). **⚠ PUBLIC-ACCESS REQUIREMENT (verified 2026-07-13: prod redirects even static assets to /login):** `/verify.html` and `GET /api/certificates/verify/*` MUST be exempt from every auth wall / login redirect / PORTAL_MODE lockdown — an anonymous browser must reach both. Done-when includes an UNAUTHENTICATED curl of each returning 200.

**v2 (separate, later):** auto-issue when the final gated assessment of the last published OSP topic passes (definition must track rolling topic flips) + PDF render of the approved draft through the existing Puppeteer pipeline. NOT in this package.

## Security invariants (VO lenses)
- Public endpoint returns ONLY what the paper certificate already shows: cert_no, recipient_name, course_title, completed_on. **Never** user_id, username, email, scores.
- Input regex-validated; revoked certs answer `valid:false` (indistinguishable from nonexistent).
- Rate-limited (in-module, 30/min/IP) — no enumeration farming.
- issue/list/revoke are `requireAdmin`. Cert numbers unique, race-safe (23505 retry loop).
- One active cert per user per course — re-issue returns the existing cert (idempotent), never a duplicate number.
- **HARDENED per #68 (Partner rulings 2026-07-13/14, all three findings):** limiter uses `req.ip` (trust-proxy, spoof-resistant) + `Retry-After`; allocation serialized by a **per-year advisory lock** (lockstep-safe AND double-click double-issue-safe — mechanism adopted from the authoritative merged code `05ecb4f8`); `completed_on` calendar-validated; **F3: `user_id` is UUID** (users.id was never INTEGER — a rebuild from the pre-fix spec would abort the deploy). Where this spec's snippets and merged main ever diverge, **main is authoritative**; the spec follows. **Accepted risk, on the record:** sequential cert numbers are enumerable over hours even rate-limited — tolerated BY DESIGN because the public endpoint only returns what the printed paper already shows; if opacity is ever wanted, v2 switches to random-suffix numbers.

## Reference implementation (foreman applies verbatim, then red-teams + playthrough as usual)

### migrations/0083_training_certificates.sql
```sql
-- 0083: training completion certificates (specs/certificates.md)
CREATE TABLE IF NOT EXISTS training_certificates (
  id SERIAL PRIMARY KEY,
  cert_no TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- #68 F3: users.id is UUID, never INTEGER
  recipient_name TEXT NOT NULL,
  course_code TEXT NOT NULL DEFAULT 'OSP_DESIGN',
  course_title TEXT NOT NULL DEFAULT 'Outside Plant (OSP) Fiber Design Course',
  completed_on DATE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  issued_by TEXT,
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_training_certificates_user ON training_certificates(user_id);
```

### routes/certificates.js
```js
// routes/certificates.js — OSP completion certificates (specs/certificates.md).
// Public verify + admin issue/list/revoke. Registrar wires the mount in server.js.

// Fixed-window limiter for the PUBLIC verify endpoint: 30 lookups/min/IP.
// HARDENED per #68 finding 2: req.ip (trust proxy is already on, server.js:54;
// matches auth.js's login limiters) — never client-settable X-Forwarded-For.
const hits = new Map();
function verifyLimiter(req, res, next) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const b = hits.get(ip);
  if (!b || now - b.start > 60000) { hits.set(ip, { start: now, n: 1 }); return next(); }
  if (++b.n > 30) return res.set('Retry-After', '60').status(429).json({ error: 'Too many lookups — try again in a minute.' });
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
    // #68 F3: users.id is UUID — validate shape, never parseInt.
    const userId = String(req.body.user_id || '').trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId))
      return res.status(400).json({ error: 'user_id must be a UUID' });
    const completedOn = req.body.completed_on || new Date().toISOString().slice(0, 10);
    // HARDENED per #68 minor: calendar-valid, not just digit-shaped (2026-13-40 → 400, not a 500 at INSERT).
    const dchk = new Date(completedOn + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn) || isNaN(dchk) || dchk.toISOString().slice(0, 10) !== completedOn)
      return res.status(400).json({ error: 'completed_on must be a valid YYYY-MM-DD date' });
    try {
      const { rows: urows } = await pool.query(
        `SELECT id, COALESCE(NULLIF(TRIM(full_name), ''), username) AS recipient FROM users WHERE id = $1`, [userId]);
      if (!urows.length) return res.status(404).json({ error: 'user not found' });

      const { rows: existing } = await pool.query(
        `SELECT * FROM training_certificates
          WHERE user_id = $1 AND course_code = 'OSP_DESIGN' AND NOT revoked`, [userId]);
      if (existing.length) return res.json({ certificate: existing[0], existing: true });

      const year = new Date().getFullYear();
      // HARDENED per #68 F1 (mechanism upgraded at merge, spec now matches the
      // AUTHORITATIVE merged code 05ecb4f8): a per-year advisory lock serializes
      // allocation — lockstep concurrency AND same-user double-click double-issue
      // are both impossible. MAX+1 inside the lock (COUNT undercounts once numbers gap).
      const client = await pool.connect();
      let cert;
      try {
        await client.query('BEGIN');
        await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, ['cert_no_' + year]);
        const { rows: dup } = await client.query(
          `SELECT * FROM training_certificates
            WHERE user_id = $1 AND course_code = 'OSP_DESIGN' AND NOT revoked`, [userId]);
        if (dup.length) { await client.query('COMMIT'); return res.json({ certificate: dup[0], existing: true }); }
        const { rows: [{ maxn }] } = await client.query(
          `SELECT COALESCE(MAX((SUBSTRING(cert_no FROM '[0-9]{4}$'))::int), 0) AS maxn
             FROM training_certificates WHERE cert_no LIKE $1`, [`LFS-OSP-${year}-%`]);
        const certNo = `LFS-OSP-${year}-${String(maxn + 1).padStart(4, '0')}`;
        const { rows: [row] } = await client.query(
          `INSERT INTO training_certificates
             (cert_no, user_id, recipient_name, completed_on, issued_by)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [certNo, userId, urows[0].recipient, completedOn, req.user.username]);
        await client.query('COMMIT');
        cert = row;
      } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} throw e; }
      finally { client.release(); }
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
```

### server.js (REGISTRAR wires at merge, near the other route mounts)
```js
require('./routes/certificates')(app, pool, { requireAdmin });
```

### public/verify.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate Verification — Launch Fiber Services</title>
<style>
  :root{--navy:#0b1d3a;--steel:#1f3a5f;--blue:#4e8ec6;--paper:#fdfcf8;--ink:#16233a;--bad:#b3454a;--good:#2e7d4f}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;background:var(--navy);font-family:Georgia,'Times New Roman',serif;
       display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:var(--paper);border-radius:6px;max-width:560px;width:100%;padding:40px 44px 36px;
        box-shadow:0 10px 50px rgba(0,0,0,.5);text-align:center;border-top:5px solid var(--blue)}
  .logo{width:220px;max-width:70%;margin:0 auto 10px;display:block}
  h1{font-size:19px;letter-spacing:.24em;text-indent:.24em;color:var(--navy);font-weight:400;margin:14px 0 4px}
  p.sub{font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5a6675;margin:0 0 24px}
  form{display:flex;gap:10px}
  input{flex:1;font:16px Consolas,monospace;letter-spacing:.06em;padding:11px 13px;border:1.5px solid #c8cdd5;
        border-radius:4px;background:#fff;color:var(--ink);text-transform:uppercase}
  input:focus{outline:2px solid var(--blue);outline-offset:1px;border-color:var(--blue)}
  button{font:600 14px 'Segoe UI',system-ui,sans-serif;color:#fff;background:var(--steel);border:none;
         border-radius:4px;padding:0 22px;cursor:pointer}
  button:hover{background:var(--navy)}
  button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
  #result{margin-top:26px;min-height:20px;font-family:'Segoe UI',system-ui,sans-serif}
  .valid .mark{color:var(--good);font-size:34px;line-height:1}
  .valid h2{font:italic 26px Georgia,serif;color:var(--ink);margin:10px 0 2px}
  .valid .course{font-size:14px;color:var(--steel);margin:2px 0}
  .valid .date{font-size:13px;color:#5a6675}
  .valid .no{font:11px Consolas,monospace;color:#8b94a0;letter-spacing:.1em;margin-top:10px}
  .invalid{color:var(--bad);font-size:14px}
  .err{color:var(--bad);font-size:13px}
</style>
</head>
<body>
<main class="card">
  <img class="logo" src="/img/launch-fiber-logo-transparent.png" alt="Launch Fiber Services">
  <h1>CERTIFICATE VERIFICATION</h1>
  <p class="sub">Enter the certificate number printed on the document (e.g. LFS-OSP-2026-0001).</p>
  <form id="f">
    <label for="cert" style="position:absolute;left:-9999px">Certificate number</label>
    <input id="cert" name="cert" placeholder="LFS-OSP-2026-0001" autocomplete="off" required>
    <button type="submit">Verify</button>
  </form>
  <div id="result" aria-live="polite"></div>
</main>
<script>
  const f = document.getElementById('f'), input = document.getElementById('cert'), out = document.getElementById('result');
  async function lookup(no) {
    out.innerHTML = '<span class="sub">Checking…</span>';
    try {
      const r = await fetch('/api/certificates/verify/' + encodeURIComponent(no.trim().toUpperCase()));
      if (r.status === 429) { out.innerHTML = '<div class="err">Too many lookups — wait a minute and try again.</div>'; return; }
      const d = await r.json();
      if (d.valid) {
        const dt = new Date(d.completed_on + 'T00:00:00')
          .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        out.innerHTML = '<div class="valid"><div class="mark">✓</div><h2></h2>' +
          '<div class="course">successfully completed the <b></b></div>' +
          '<div class="date">on ' + dt + '</div><div class="no"></div></div>';
        out.querySelector('h2').textContent = d.recipient_name;
        out.querySelector('.course b').textContent = d.course_title;
        out.querySelector('.no').textContent = d.cert_no;
      } else {
        out.innerHTML = '<div class="invalid">No valid certificate was found for that number. Check the number and try again.</div>';
      }
    } catch { out.innerHTML = '<div class="err">Lookup failed — check your connection and try again.</div>'; }
  }
  f.addEventListener('submit', e => { e.preventDefault(); if (input.value.trim()) lookup(input.value); });
  const q = new URLSearchParams(location.search).get('cert');
  if (q) { input.value = q; lookup(q); }
</script>
</body>
</html>
```

## Done-when
- Migration applies clean (fresh + existing DB, idempotent).
- `/verify.html?cert=<issued number>` shows recipient name + course + long-form date; unknown/revoked/garbage input → the not-found message; 31st lookup in a minute → 429 message.
- Admin issue → unique number `LFS-OSP-<year>-<seq>`; second issue for the same user returns the SAME cert (`existing:true`); revoke → verify says not found.
- No PII beyond name/course/date on the public wire (VO checks the raw response).
- `npm run premerge` green; live smoke: real lookup on launchfiber.app after deploy, **from a logged-out session**.

## Decomposition note (Registrar)
One foreman package (files above + Tier-1) → VO (security invariants above are the lens list) → Registrar mounts in server.js at merge. The `/verify` path on the printed certificate resolves to `/verify.html` — either name the file to match or add the redirect at mount time (Registrar's call, note it in the merge row).
