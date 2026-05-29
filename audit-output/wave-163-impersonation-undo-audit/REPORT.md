# Wave 163 — Security Audit: routes/impersonation.js + routes/undo.js
**Framing:** adversarial — session hijack, privilege escalation, cross-actor abuse, replay, data exposure
**Write-path acknowledged:** only `audit-output/wave-163-impersonation-undo-audit/REPORT.md`
**Files audited:** `routes/impersonation.js`, `routes/undo.js`, supporting: `auth.js`, `routes/_helpers.js`, `schema.sql`

---

## Aggregate counts

| File | HIGH | MED | LOW |
|---|---|---|---|
| impersonation.js | 1 | 2 | 1 |
| undo.js | 1 | 2 | 2 |
| **Total** | **2** | **4** | **3** |

---

## routes/impersonation.js — VERIFIED CLEAN items

1. **Impersonation-chain prevention.** requireAdmin + line-24 impersonator_id check blocks chains correctly for both admin-target and non-admin-target cases.
   Verified: `auth.js:315-351`, `routes/impersonation.js:21-31`

2. **Session isolation.** Separate cookie name `lfs_impersonation`. Admin's `lfs_session` untouched.
   Verified: `routes/impersonation.js:54-57`, `auth.js:278-295`

3. **SQL injection via userId.** Parameterized $1 query. Safe.
   Verified: `routes/impersonation.js:36-39`

4. **Self-impersonation blocked.** `userId === req.user.id` returns 400.
   Verified: `routes/impersonation.js:31-33`

5. **CSRF protection.** Global Origin/Referer check at `server.js:104-145`. Cross-origin POST blocked.

6. **Audit log for impersonation start.** `console.warn('[AUDIT][impersonation:start]...')` at lines 60-63.
   Verified: `routes/impersonation.js:59-63`

---

## routes/impersonation.js — Findings

### HIGH-1 — Admin session revocation does NOT terminate impersonation session

**File:** `auth.js:324-350` (impersonation path), compared to `auth.js:358-384` (normal path)

```js
// NORMAL PATH — tokens_invalid_after checked (auth.js:360-369):
const { rows } = await pool.query(
  `SELECT id, ..., tokens_invalid_after FROM users WHERE id = $1 LIMIT 1`,
  [payload.id]
);
if (u.tokens_invalid_after && payload.iat) {
  if (new Date(u.tokens_invalid_after).getTime() > tokenIssuedMs) {
    return next();  // revoked
  }
}

// IMPERSONATION PATH — tokens_invalid_after NOT checked (auth.js:329-334):
const { rows } = await pool.query(
  `SELECT id, username, role, team, extra_teams, full_name, email, active, staff_id
   FROM users WHERE id = $1 LIMIT 1`,  // NO tokens_invalid_after column
  [impPayload.id]
);
if (target && target.active) {
  req.user = { ...target, impersonator_id: impPayload.impersonator_id, ... };
  return next();  // no iat check vs impersonator's tokens_invalid_after
}
```

**Attack path:**
1. Admin A starts impersonating User B; `lfs_impersonation` JWT minted with 1h TTL.
2. Incident response revokes admin A via `UPDATE users SET tokens_invalid_after = NOW()`.
3. Admin A's `lfs_session` is dead. The `lfs_impersonation` cookie continues to authenticate for up to 1 hour.
4. No server-side list of active impersonation sessions exists — no way to force-expire it early.

**Fix shape:** In the impersonation middleware branch (`auth.js:326-350`), fetch `tokens_invalid_after` for the impersonator (via a second query or by embedding it in the JWT at mint time) and reject if `impPayload.iat * 1000 < impersonator.tokens_invalid_after`.

---

### MED-1 — No rate limit on impersonation start endpoint

**File:** `routes/impersonation.js:21`

```js
app.post('/api/admin/impersonate/:userId', requireAdmin, async (req, res) => {
  // No rateLimitOk() call — contrast with login endpoint at auth.js:419-420
```

Login is rate-limited (10/IP, 5/username per 15 min). Impersonation has no comparable limit. A compromised admin account could iterate user IDs generating DB queries and audit noise without throttle.

**Fix shape:** `if (!rateLimitOk('impersonate:admin:' + req.user.id, 20, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many impersonation attempts.' });`

---

### MED-2 — `end-impersonation` has no `requireAuth` and no audit log

**File:** `routes/impersonation.js:74-79`

```js
app.post('/api/admin/end-impersonation', async (req, res) => {
  // No requireAuth() — unauth callers accepted
  // No audit log — impersonation end is not recorded
  const opts = cookieOpts();
  res.clearCookie(IMPERSONATION_COOKIE, opts);
  res.json({ ok: true });
});
```

Two issues:
a. No auth gate. Any unauthenticated caller can POST this endpoint. Practical impact is low (Set-Cookie only affects the caller's own browser), but the endpoint under `/api/admin/` should be auth-gated for consistency and monitoring.
b. Impersonation start is logged; end is not. For government contract tracking, incomplete audit trails are a compliance risk.

**Fix shape:** Add `requireAuth('admin')` middleware. Add `console.warn('[AUDIT][impersonation:end] admin=... ended impersonation of user=... at ...')`.

---

### LOW-1 — No guard against impersonating customer-role accounts

**File:** `routes/impersonation.js:36-42`

```js
const target = rows[0];
if (!target) return res.status(404).json({ error: 'User not found.' });
if (!target.active) return res.status(400).json({ error: 'Cannot impersonate inactive user.' });
// No check: target.role === 'customer'
```

Customers are valid users in the system (role enum includes 'customer', `auth.js:105`). An admin accidentally impersonating a client's customer account would see customer-portal data in a staff context. Policy is undecided in code.

**Fix shape:** Explicit policy decision: either add `if (target.role === 'customer') return res.status(400).json({ error: 'Impersonation of customer accounts is not permitted.' });` or add a comment documenting that customer impersonation is intentionally allowed.

---

## routes/undo.js — VERIFIED CLEAN items

1. **Idempotency.** `popUndoBucket` uses `DELETE ... RETURNING` — token consumed atomically on first use. Second call returns 404.
   Verified: `routes/_helpers.js:66-72`, `routes/undo.js:26-31`

2. **Time-bound expiry at DB level.** `expires_at >= NOW()` in DELETE predicate. Expired tokens fail regardless of UUID validity.
   Verified: `routes/_helpers.js:48,66-72`

3. **DB-backed storage.** `undo_buckets` Postgres table, not in-memory. Survives server restarts.
   Verified: `schema.sql:1110-1117`

4. **UUID v4 token.** `id uuid DEFAULT gen_random_uuid()`. 122-bit entropy. Not brute-forceable in 60s window.
   Verified: `schema.sql:1111`

5. **Transaction integrity.** `BEGIN/COMMIT/ROLLBACK` wraps all inserts. Partial restores impossible.
   Verified: `routes/undo.js:33,52,111,179,186`

6. **Cascade depth ordering.** `project_tree` kind sorts by `__depth ASC` before insert — parents before children.
   Verified: `routes/undo.js:60-68`

---

## routes/undo.js — Findings

### HIGH-2 — Cross-actor undo: `popUndoBucket` does NOT enforce user_id ownership

**File:** `routes/undo.js:24`, `routes/_helpers.js:66-72`

```js
// undo.js:24 — any authenticated user accepted:
app.post('/api/undo/:token', requireAuth(), async (req, res) => {

// _helpers.js:66-72 — user_id is saved but NEVER checked on pop:
async function popUndoBucket(token) {
  const { rows } = await pool.query(
    `DELETE FROM undo_buckets WHERE id = $1 AND expires_at >= NOW() RETURNING kind, payload`,
    // ← NO user_id = $2 constraint
    [token]
  );
  return rows[0] || null;
}
```

**The comment at undo.js:23 is factually wrong:**
```js
// and the per-user attribution in saveUndoBucket.
```
`saveUndoBucket` stores `user_id` in the DB row (verified: `_helpers.js:59-61`). `popUndoBucket` never reads it back. The claimed safety mechanism does not exist.

**Attack path:**
1. Manager A deletes a project tree; `undo_token=<uuid>` returned in API response.
2. Any other authenticated user who learns the token (XSS, log access, API response interception) POSTs `/api/undo/<uuid>`.
3. Server replays the undo as if the caller had authority — no user_id check, no audit log (MED-3).

**Fix shape:**
```js
// _helpers.js:
async function popUndoBucket(token, userId) {
  const { rows } = await pool.query(
    `DELETE FROM undo_buckets
     WHERE id = $1
       AND expires_at >= NOW()
       AND (user_id IS NULL OR user_id = $2)
     RETURNING kind, payload`,
    [token, userId]
  );
  return rows[0] || null;
}

// undo.js:
bucket = await popUndoBucket(req.params.token, req.user.id);
```

---

### MED-3 — No audit log for undo replay operations

**File:** `routes/undo.js:1-193`

Delete operations that CREATE undo buckets are audit-logged (`projects.js:1275`, `contracts.js:204`). The undo replay that REVERSES those deletes has no `logAudit()` call, no `require('./_audit')`, no `console.warn('[AUDIT]')`. For a government contract tracking system, the audit trail must include restores, not only deletes.

**Fix shape:** Add `const { logAudit } = require('./_audit');`. After each successful COMMIT, call:
```js
logAudit(pool, { req, action: 'undo_restore', entity_type: bucket.kind,
  meta: { kind: bucket.kind, token: req.params.token } });
```

---

### MED-4 — `e.message` leaked to client in 500 response

**File:** `routes/undo.js:188`

```js
return res.status(500).json({ error: 'Undo failed: ' + (e.message || 'unknown error') });
```

PostgreSQL driver errors expose schema details: column names, constraint names, FK names, table names, value-length details. Example: `"insert or update on table \"projects\" violates foreign key constraint \"projects_parent_id_fkey\""`.

**Fix shape:** `return res.status(500).json({ error: 'Undo failed. Please refresh and try again.' });` — detailed message already in `console.error` on the line above.

---

### LOW-2 — Unquoted dynamic column identifiers from jsonb payload in SQL

**Severity:** LOW (theoretical — payload is server-generated)
**File:** `routes/undo.js:62-66` and 11 other identical patterns throughout the file

```js
const cols = Object.keys(p).filter(k => !k.startsWith('__'));
await client.query(
  `INSERT INTO projects (${cols.join(', ')}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
  vals
);
```

Column names from jsonb payload injected into SQL string without quoting. Values are parameterized (safe). Column identifiers are not. If `undo_buckets.payload` were tampered with (requires prior SQLi or direct DB access), an attacker could inject via column names. Currently impossible through normal API paths.

**Fix shape:** Wrap each column name: `` const safeCols = cols.map(c => `"${c.replace(/"/g, '')}"`); ``

---

### LOW-3 — Incorrect security rationale in comment creates false confidence

**File:** `routes/undo.js:23`

```js
// and the per-user attribution in saveUndoBucket.
```

This claim is false (disproved by HIGH-2). Misleads future reviewers into believing user_id is enforced. Once HIGH-2 is fixed, update comment to accurately reflect the actual safety mechanisms.

---

## Coverage gaps

- `routes/_audit.js` — `logAudit` implementation, PII redaction, tamper-resistance not audited (out of scope).
- Cross-portal cookie scoping — `lfs_impersonation` cookie path/domain behavior across multi-subdomain Railway deployments not verified.
- `extra_teams` in impersonation token — `signImpersonationToken` omits `extra_teams`; middleware reads it from DB on each request (correct), but downstream consumers that cache `req.user` were not exhaustively audited.

---

## Verdicts

**impersonation.js:** YELLOW — 1 HIGH (admin revocation bypass), 2 MED, 1 LOW. Architecture is sound; bugs are surgical.

**undo.js:** YELLOW — 1 HIGH (cross-actor undo with false safety comment), 2 MED, 2 LOW. Both HIGHs are 2-line fixes.

=== WAVE 163 SECURITY AUDIT REPORT END ===
