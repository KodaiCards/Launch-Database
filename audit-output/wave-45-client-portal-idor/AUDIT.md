# Wave 45 — Client Portal v1 IDOR Audit
**Auditor:** Wave 45 Sonnet  
**Date:** 2026-05-27  
**Files audited:** `routes/client_portal_v2.js`, `routes/_client_auth.js`  
**Verdict:** YELLOW — 0 HIGH, 3 MED, 4 LOW

---

## Stack snapshot

Client portal v1 (Wave E2) uses a 32-byte random token model: admin generates a token, stores only its SHA-256 hash, emails the raw token link to the client. Token is consumed at `GET /client/login/:rawToken` to set an httpOnly cookie, which gates all subsequent client endpoints via `requireClientAuth`. The surface is small and well-structured. No HIGH IDOR findings — the critical cross-tenant scoping is done correctly in both list and detail project endpoints. Three MED findings require fixes before this surface is production-trusted.

---

## FINDINGS

### FINDING-MED-1 — Information disclosure: differential login error messages allow token-state enumeration

**Severity:** MED  
**Endpoint:** `GET /client/login/:rawToken`  
**Framing:** Information disclosure  
**File:** `routes/client_portal_v2.js:57-62`

```javascript
if (!rows.length) return res.status(401).send('Invalid or expired login link.');
const r = rows[0];
if (r.revoked_at) return res.status(401).send('This login link has been revoked.');
if (r.expires_at && new Date(r.expires_at) < new Date()) return res.status(401).send('This login link has expired.');
if (r.user_status !== 'active') return res.status(401).send('Your account is not active.');
if (r.org_status !== 'active') return res.status(401).send('Your organization account is not active.');
```

**Attack path:** An attacker who knows or guesses a token (or who has obtained a token link but suspects it was revoked or expired) can distinguish between:
- Token hash not in DB at all → "Invalid or expired login link."
- Token hash in DB but `revoked_at IS NOT NULL` → "This login link has been revoked."
- Token in DB but expired → "This login link has expired."
- Token valid but user inactive → "Your account is not active."
- Token valid but org suspended → "Your organization account is not active."

This confirms token existence and the specific lifecycle state. For a government-contract portal where tokens are emailed, an attacker who intercepts an email can infer whether the admin has since revoked it.

**Suggested fix shape:** Collapse all 401 paths to a single opaque message: `'This login link is invalid or no longer active.'` The only distinction that helps a legitimate user is "expired" vs "revoked" — and even that can be communicated out-of-band (admin tells the client to request a new link). The individual string differences add no legitimate UX value.

---

### FINDING-MED-2 — UUID path params not validated before SQL — 500 on malformed input leaks stack hint

**Severity:** MED  
**Endpoints:** `GET /api/admin/client-orgs/:id`, `PUT /api/admin/client-orgs/:id`, `POST /api/admin/client-orgs/:id/users`, `POST /api/admin/client-orgs/:id/users/:uid/tokens`, `POST /api/admin/client-tokens/:tid/revoke`  
**Framing:** Input validation / information disclosure  
**File:** `routes/client_portal_v2.js:219-225, 257-264, 290-296, 320-330, 360-367`

```javascript
// Example: GET /api/admin/client-orgs/:id (line 219-225)
app.get('/api/admin/client-orgs/:id', requireAuth(['admin']), async (req, res) => {
  try {
    const { rows: orgRows } = await pool.query(
      'SELECT * FROM client_organizations WHERE id = $1',
      [req.params.id]
    );
```

All five endpoints pass `:id`, `:uid`, and `:tid` directly to `pg` as a UUID parameter with no format validation. PostgreSQL will throw `invalid input syntax for type uuid` when the value is not a valid UUID (e.g., `"../../../etc/passwd"`, `"' OR 1=1 --"`, `"not-a-uuid"`). The `catch (e)` handler logs `e.message` to the server console and returns:

```javascript
res.status(500).json({ error: 'failed to get organization' });
```

The 500 response is not an IDOR concern (attacker doesn't get the UUID error in the response body — `e.message` goes to `console.error`, not the response). However, returning 500 vs 404 on a path-param that isn't even a UUID is technically an information disclosure: it reveals "this server uses PostgreSQL UUIDs" when the error reaches Railway logs. More practically, it causes a spurious 500 in CI if tests pass a non-UUID string.

**Severity rationale:** MED not LOW because (a) it affects five separate endpoints, (b) a 400 with "invalid id format" is the correct contract (callers should not send non-UUIDs), and (c) it's trivially fixable with a single helper.

**Suggested fix shape:** Add a UUID format guard helper and apply it at the top of each handler:

```javascript
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(v) { return UUID_RE.test(v); }

// In each handler, before the pool.query:
if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid id' });
```

Client-facing `GET /api/client/projects/:id` has the same issue (passes `:id` to SQL without UUID validation). Include that endpoint in the fix.

---

### FINDING-MED-3 — `GET /api/admin/client-orgs/:id/users` uses `SELECT cu.*` — exposes invited_by UUID to admin

**Severity:** MED (borderline LOW)  
**Endpoint:** `GET /api/admin/client-orgs/:id`  
**Framing:** Information disclosure  
**File:** `routes/client_portal_v2.js:227-248`

```javascript
const { rows: userRows } = await pool.query(`
  SELECT
    cu.*,
    COALESCE(
      json_agg(
        json_build_object(
          'id',           ct.id,
          'created_at',   ct.created_at,
          'last_used_at', ct.last_used_at,
          'expires_at',   ct.expires_at,
          'revoked_at',   ct.revoked_at
        ) ORDER BY ct.created_at DESC
      ) FILTER (WHERE ct.id IS NOT NULL),
      '[]'::json
    ) AS tokens
  FROM client_users cu
  LEFT JOIN client_tokens ct ON ct.client_user_id = cu.id
  WHERE cu.org_id = $1
  GROUP BY cu.id
  ORDER BY cu.is_primary DESC, cu.created_at
`, [req.params.id]);
```

`SELECT cu.*` returns all columns including `invited_by` (a UUID FK to the `users` table — an internal staff user ID). This leaks an internal user reference to the admin UI. While this is an admin-only endpoint (requireAuth(['admin'])) and the admin would already know staff identities, using `SELECT *` is a hygiene issue — any future `ALTER TABLE client_users ADD COLUMN sensitive_field` would automatically appear in this response.

**Suggested fix shape:** Replace `cu.*` with an explicit column list omitting `invited_by` (or include it intentionally if admin UI needs it, but flag it as deliberate).

Similarly, `GET /api/admin/client-orgs` uses `co.*` (line 169) which returns `created_by`. Same pattern — acceptable at admin level but fragile.

---

## LOW FINDINGS

### FINDING-LOW-1 — Token comparison is hash equality, not timing-safe — acceptable for 32-byte token

**Severity:** LOW (informational)  
**File:** `routes/_client_auth.js:26-47`

```javascript
const tokenHash = hashToken(raw);
const { rows } = await pool.query(`
  ...
  WHERE ct.token_hash = $1
`, [tokenHash]);
```

Token validation uses a SQL `WHERE token_hash = $1` equality. This is NOT a timing-safe comparison in the JavaScript layer — the comparison happens in the PostgreSQL engine. For a 32-byte (256-bit) random token, timing attacks on the hash comparison are computationally infeasible (would require 2^128 guesses to get a useful oracle signal). This is acceptable practice. Flagging as LOW informational only.

---

### FINDING-LOW-2 — `cookie.secure` is false in non-production environments — acceptable but noted

**Severity:** LOW (informational)  
**File:** `routes/client_portal_v2.js:29-36`

```javascript
function clientCookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}
```

In non-production (`NODE_ENV !== 'production'`), `secure` is false. This is standard practice for local dev (HTTPS not available). Production sets it correctly. No `maxAge`/`expires` is set — the cookie is session-scoped (cleared when browser closes), which is conservative and appropriate. `sameSite: 'lax'` provides CSRF protection for cross-site navigation.

---

### FINDING-LOW-3 — `POST /client/logout` performs a second hash lookup that could be skipped

**Severity:** LOW (efficiency + minor redundancy)  
**File:** `routes/client_portal_v2.js:75-90`

```javascript
app.post('/client/logout', requireClientAuthMW, async (req, res) => {
  try {
    const raw = req.cookies && req.cookies[CLIENT_SESSION_COOKIE];
    if (raw) {
      const tokenHash = hashToken(raw);
      await pool.query(
        'UPDATE client_tokens SET revoked_at = NOW() WHERE token_hash = $1',
        [tokenHash]
      );
    }
```

`requireClientAuthMW` already validated the token and populated `req.client_user.id` (which contains the token_id via `r.token_id` in the middleware). The logout handler then re-hashes the raw cookie and does a second DB lookup by hash instead of using `req.client_user`'s already-looked-up token_id. 

The issue: `req.client_user` does not carry `token_id` — the middleware sets `id: r.client_user_id` (the user ID, not the token ID). The raw cookie re-hash approach is functionally correct. This is a minor design gap — the middleware could expose `token_id` in `req.client_user` to avoid the second hash, but is not a security issue.

---

### FINDING-LOW-4 — `POST /admin/client-tokens/:tid/revoke` has no ownership check — any admin can revoke any token

**Severity:** LOW (by design, but worth noting)  
**File:** `routes/client_portal_v2.js:360-368`

```javascript
app.post('/api/admin/client-tokens/:tid/revoke', requireAuth(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(`
      UPDATE client_tokens SET revoked_at = NOW()
      WHERE id = $1 AND revoked_at IS NULL
      RETURNING id, revoked_at
    `, [req.params.tid]);
```

Any admin can revoke any token by guessing/enumerating its UUID. This is likely intended (admins have global authority), but there is no org-scoping check. A compromised admin account could revoke tokens for all client orgs silently. Since the app currently has a single admin role (no per-org admin), this is LOW.

---

## VERIFIED CLEAN

### Framing 1 — IDOR: cross-tenant project access

**VERIFIED CLEAN.** `GET /api/client/projects` scopes via `WHERE ec.client_org_id = $1` where `$1 = req.client_org.id` (set by `requireClientAuth` middleware from the validated token's `cu.org_id`). An attacker cannot supply a different `client_org_id` — it comes from the server-side token validation, not from query params or request body.

`GET /api/client/projects/:id` uses `WHERE p.id = $1 AND ec.client_org_id = $2` with `$2 = req.client_org.id`. A client from org A sending `projectId` belonging to org B will receive a 404 (no rows returned) — correctly denies access without revealing the resource exists. The existing test `GET /api/client/projects/:id returns 404 for other org's project (IDOR)` covers this case.

### Framing 1 — IDOR: admin nested object ownership

**VERIFIED CLEAN.** `POST /api/admin/client-orgs/:id/users/:uid/tokens` (lines 320-328) explicitly checks:

```javascript
const { rows: userCheck } = await pool.query(
  'SELECT id FROM client_users WHERE id = $1 AND org_id = $2',
  [req.params.uid, req.params.id]
);
if (!userCheck.length) return res.status(404).json({ error: 'user not found in org' });
```

An admin cannot generate a token for a `uid` from a different org by putting it under a different `:id` path — the `AND org_id = $2` guard prevents cross-org token generation.

`POST /api/admin/client-orgs/:id/users` (lines 290-310) similarly checks org existence before inserting: `SELECT id FROM client_organizations WHERE id = $1`.

### Framing 2 — Token security

**VERIFIED CLEAN (with LOW-1 caveat noted above):**
- Token is 32-byte `crypto.randomBytes` → base64url. 256-bit entropy. Brute force infeasible.
- Server stores SHA-256(raw) only. Raw is never persisted. Matches cryptographic best practice for high-entropy tokens (no salt needed for 256-bit random).
- `revoked_at` is set (not deleted) on logout/revoke. This is correct: allows admin to audit token state. The existence of `revoked_at` field is not leaked to clients (cookie validation returns 401 with an opaque message when token is found but revoked). MED-1 notes the specific error message exposes the state.
- `expires_at` is checked in both login and middleware. Checked independently. No bypass path identified.
- Inactive user check: `user_status !== 'active'` checked in both login and middleware.
- Inactive org check: `org_status !== 'active'` checked in both login and middleware.
- `last_used_at` is updated fire-and-forget (no await). This is acceptable — a tracking update failure should not block the request.

### Framing 3 — Cross-tenant data leakage in project response

**VERIFIED CLEAN.** Project responses use explicit column selection (`p.id, p.name, p.service_area_name, p.program, p.status, p.created_at, p.engineering_contract_id, ec.id AS contract_id`) — no JSONB audit fields, no `billing_rate`, no `notes` field exposure. The JOIN to `engineering_contracts` is used solely for `client_org_id` scoping. No `SELECT *` on the `projects` or `engineering_contracts` tables in client-facing endpoints.

`NULL client_org_id` rows: the query `WHERE ec.client_org_id = $1` where `$1` is always a non-null UUID (from the validated session) will never match rows where `client_org_id IS NULL` — PostgreSQL NULL comparison semantics ensure this correctly. No NULL-leakage possible.

### Framing 4 — Privilege escalation (client → admin / admin → client)

**VERIFIED CLEAN.** The two auth middleware layers are fully independent:
- `requireAuth` reads `lfs_session` cookie → validates JWT → sets `req.user`
- `requireClientAuth` reads `lfs_client_session` cookie → validates token hash → sets `req.client_user`/`req.client_org`

`extractToken` in `auth.js:308-312` reads only `lfs_session` cookie (not `lfs_client_session`). A client holding only an `lfs_client_session` cookie cannot populate `req.user` — `authMiddleware` will not see the cookie and `req.user` will remain `undefined`. `requireAuth` checks `!req.user` and returns 401.

Conversely, an admin JWT token cannot be used to hit `GET /api/client/projects` — `requireClientAuth` looks for `lfs_client_session` only. If present but invalid → 401.

No cross-leakage path exists.

### Framing 5 — Input validation on body fields

**VERIFIED CLEAN (partial).** Create org body: `name`, `short_name`, `logo_url`, `theme_color` stored via parameterized query — no SQL injection. Status validated against allowlist `['active', 'suspended', 'archived']` on PUT. `expires_days` validated as `Number.isFinite` and positive.

Note: `theme_color` and `logo_url` are stored as-is (no format validation — `theme_color` could be any string, not enforced as `#RRGGBB`). `logo_url` not validated as a URL. These are admin-only inputs (trusted role) so injection risk is lower, but if the admin UI renders `theme_color` unescaped in CSS inline styles, a value like `red; background-image: url(x)` could break styling. Flag as OUT OF SCOPE (frontend audit) per dispatch instructions.

### Framing 6 — 404 vs 403 resource existence leak

**VERIFIED CLEAN.** Client-facing `GET /api/client/projects/:id` returns 404 in all denied cases (cross-org project, nonexistent ID) — same response regardless of whether the resource exists. No 403/200 differential that would confirm existence.

Admin endpoints use 404 for "not found" and 400 for validation failures. These are gated by `requireAuth(['admin'])` — admin already knows the data model, so existence disclosure is not a material concern.

### Framing 7 — Rate limiting on login endpoint

**VERIFIED CLEAN (informational).** No rate limiting on `/client/login/:rawToken`. For a 32-byte (256-bit) random token, this is cryptographically acceptable — there is no practical brute-force at any request rate. If tokens were shortened in future (e.g., 6-digit codes), this would need rate limiting. Flag as LOW informational only (already captured in context — omitted from LOW list since it's future-concern not current bug).

---

## Coverage gaps

- **Frontend rendering of `theme_color`/`logo_url`:** Out of scope per dispatch instructions. If admin.html renders these in a CSS `<style>` block without escaping, stored XSS via admin account is possible. Recommend separate frontend audit.
- **`/client/` SPA routes:** Not yet implemented (portal is v1 foundation only). No audit surface for the client-facing SPA.
- **Audit log coverage:** The portal endpoints do not write to the `audit_log` table. Admin operations (org create, user create, token generate, revoke) are not audited in `audit_log`. This is an observation, not a security finding in the current scope, but relevant for government-contract compliance.
- **`POST /client/logout` with no cookie:** If `lfs_client_session` cookie is not present, `requireClientAuthMW` returns 401 before the handler runs — correct. But handler also has a `if (raw)` guard that means if cookie somehow present but empty string, revoke is skipped. Not a security issue (empty string would fail hash lookup anyway).

---

## Summary table

| ID | Severity | Endpoint | Framing | File:Lines |
|---|---|---|---|---|
| MED-1 | MED | `GET /client/login/:rawToken` | Info disclosure / token enumeration | `client_portal_v2.js:57-62` |
| MED-2 | MED | All `:id/:uid/:tid` admin + client endpoints | Input validation / 500 on bad UUID | `client_portal_v2.js:219,257,290,320,360,131` |
| MED-3 | MED | `GET /api/admin/client-orgs/:id` | Info disclosure / `SELECT *` user | `client_portal_v2.js:228` |
| LOW-1 | LOW | `requireClientAuth` | Token comparison timing | `_client_auth.js:26-47` |
| LOW-2 | LOW | `clientCookieOpts` | Cookie flags in non-prod | `client_portal_v2.js:29-36` |
| LOW-3 | LOW | `POST /client/logout` | Redundant hash lookup | `client_portal_v2.js:77-83` |
| LOW-4 | LOW | `POST /admin/client-tokens/:tid/revoke` | No org-scope on revoke | `client_portal_v2.js:360-368` |

=== WAVE-45-IDOR-AUDIT REPORT END ===
