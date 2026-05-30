# Wave 191 — Security + Correctness Audit: `routes/_audit.js`

**Write-path constraints acknowledged: only `audit-output/wave-191-audit-helper-self-audit/REPORT.md` written.**

**Auditor:** adversarial / correctness framing  
**File:** `routes/_audit.js` (155 lines) — exports `logAudit`, `redactPII`, `archiveOldAuditRows`  
**Call-site scope:** 155 logAudit call sites across 30+ route files  
**Date:** 2026-05-30

---

## FINDINGS

---

### HIGH-1 — `logAudit`: Destructure of `opts` is OUTSIDE the try-catch — `opts=undefined` creates an unhandled rejection that `.catch(()=>{})` silences completely

**Severity:** HIGH  
**Verified by reading:** `routes/_audit.js:18-44`

```js
async function logAudit(pool, opts) {
  const {                          // line 19 — OUTSIDE try
    req, action, entity_type, entity_id,
    before = null, after = null,
    source = 'api', meta = null,
    actor_type = 'user',
  } = opts;                        // throws here if opts is undefined
  try {                            // try starts AFTER destructure
    ...
    await pool.query(...);
  } catch (e) {
    console.error('[audit_log:insert]', e && e.message); // only catches DB errors
  }
}
```

**Wave 86 silent-no-op bug — exact failure mode documented:**

If a caller uses `logAudit({pool, action:'...', entity_type:'x', entity_id:'1'})` (pool bundled inside opts, second arg omitted):
- `pool` param = the opts-shaped object
- `opts` param = `undefined`
- `const { req, ... } = undefined` → throws `TypeError: Cannot destructure property 'req' of 'opts' as it is undefined`
- Throw escapes the try-catch entirely (destructure is on line 19, try starts on line 25)
- Returned promise rejects
- Call sites with `.catch(()=>{})` swallow it with **zero console output, zero row written, zero indication of failure**
- Call sites with no `.catch()` and no `await` (approximately 50 sites) generate `UnhandledPromiseRejection`

**~50 fire-and-forget call sites lacking `.catch()` (partial list):**  
`splice.js:335`, `splice.js:838`, `splice.js:2829`, `splice.js:4076`, `splice.js:4361`, `projects.js:455`, `projects.js:689`, `projects.js:739`, `projects.js:1082`, `projects.js:1188`, `invoices.js:80`, `invoices.js:148`, `invoices.js:242`, `portal_access.js:113`, `portal_access.js:145`, `engineering_contracts.js:111/150/198`, `admin.js:368/404/505`, `budgets.js:171/209/390/441/481`

**Fix shape:** Move destructure inside the try block with a guard:
```js
async function logAudit(pool, opts) {
  try {
    if (!opts || typeof opts !== 'object') {
      console.error('[audit_log:insert] called with invalid opts:', opts);
      return;
    }
    const { req, action, entity_type, entity_id, ... } = opts;
    ...
  } catch (e) {
    console.error('[audit_log:insert]', e && e.message);
  }
}
```

---

### HIGH-2 — `redactPII`: No cycle detection — circular references throw `RangeError: Maximum call stack size exceeded`, crashing the calling route handler

**Severity:** HIGH  
**Verified by reading:** `routes/_audit.js:59-96`

```js
function redactPII(obj) {
  ...
  if (typeof obj === 'object') {
    const redacted = {};
    for (const key in obj) {
      ...
      redacted[key] = redactPII(obj[key]);  // infinite recursion on circular ref
    }
    return redacted;
  }
}
```

**Confirmed by live test:** `const a = {name:'test'}; a.self = a; redactPII(a);` → `RangeError: Maximum call stack size exceeded`

`logAudit` does NOT call `redactPII` internally — callers do. `audit_log.js:116-118` calls `redactPII(row.before_data)` directly. If that row contains a circular structure (unlikely with normal PG rows, possible with Express-decorated request body or ORM result with back-references), the route handler crashes with a stack overflow rather than a graceful 500.

**Fix shape:** Pass a `WeakSet` to track visited objects:
```js
function redactPII(obj, _seen = new WeakSet()) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => redactPII(item, _seen));
  if (typeof obj === 'object') {
    if (_seen.has(obj)) return '[Circular]';
    _seen.add(obj);
    const redacted = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const keyLower = key.toLowerCase();
        const isSensitive = sensitivePatternsLower.some(p => keyLower.includes(p));
        redacted[key] = isSensitive ? '[REDACTED]' : redactPII(obj[key], _seen);
      }
    }
    return redacted;
  }
  return obj;
}
```

---

### HIGH-3 — `logAudit`: `action` and `entity_type` are `NOT NULL` in schema but never validated — missing fields silently drop the entire audit row with only a `console.error`

**Severity:** HIGH  
**Verified by reading:** `routes/_audit.js:20-21`, `migrations/0046_audit_log.sql:9-10`

Schema: `action text NOT NULL`, `entity_type text NOT NULL`. If a caller omits either, PostgreSQL throws `null value in column "action" violates not-null constraint`. That error is caught by the try-catch and only `console.error`'d. The audit row is silently dropped.

For a RUS compliance system where `action` and `entity_type` are the primary axes for government audit queries, a silent row-drop with no observable caller-side signal is a compliance risk.

**No guard exists in the current implementation** — confirmed by reading lines 18-44.

**Fix shape:**
```js
if (!action || !entity_type) {
  console.error('[audit_log:insert] missing required fields:', { action, entity_type, entity_id });
  return;
}
```

---

### MED-1 — `redactPII`: `'hash'` and `'token'` substring patterns cause false positives — non-sensitive operational fields redacted

**Severity:** MED  
**Verified by reading:** `routes/_audit.js:70-82`

```js
const sensitivePatternsLower = [
  ...
  'hash',     // matches hashtag, commit_hash, content_hash, hashbrowns
  'token',    // matches token_count, tokenize, token_type
  ...
];
const isSensitive = sensitivePatternsLower.some(pattern => keyLower.includes(pattern));
```

**Confirmed by live test:**
- `hashtag` → `[REDACTED]`
- `commit_hash` → `[REDACTED]` (git hash, structural identifier)
- `content_hash` → `[REDACTED]` (storage dedup key)
- `token_count` → `[REDACTED]` (integer count field)
- `tokenize` → `[REDACTED]` (boolean algorithm flag)

Redacting non-sensitive operational fields degrades audit log diagnostic value without improving security. A compliance reviewer seeing `{"token_count": "[REDACTED]"}` in `before_data` gets no useful information.

**Fix shape:** Replace bare `'hash'` with suffix-anchored check (`endsWith('_hash')` or `=== 'hash'`), and tighten `token` to not match partial-word non-credential fields.

---

### MED-2 — `redactPII`: Missing patterns for `jwt`, `session_id`, `lfs_session`, `cookie`, `authorization`, `pin`, `mfa_code`, `otp`

**Severity:** MED  
**Verified by reading:** `routes/_audit.js:70-77`

**Confirmed by test — these keys are NOT redacted:**

| Key | Risk if logged |
|---|---|
| `jwt` | JWT string is a credential |
| `session_id` | Session identifier |
| `lfs_session` | This app's session cookie name |
| `cookie` | Raw cookie header — contains `lfs_session` value |
| `authorization` | Bearer token header |
| `pin` | Numeric PIN |
| `mfa_code` | TOTP/HOTP code |
| `otp` | One-time password |

If a caller logs `req.headers` as `meta` (possible in AI assistant audit paths — `ai.js:2524`), `authorization` and `cookie` values leak into the audit log unredacted.

**Fix shape:** Add to `sensitivePatternsLower`: `'jwt'`, `'session'`, `'cookie'`, `'authorization'`, `'bearer'`, `'pin'`, `'mfa'`, `'otp'`.

---

### MED-3 — `archiveOldAuditRows`: Three queries are NOT wrapped in a transaction despite the comment claiming "transactional" — concurrent invocations corrupt `last_archive_row_count`

**Severity:** MED  
**Verified by reading:** `routes/_audit.js:110-148`

Comment at line 121: `// Update rows to set archived_at (transactional)` — but no `BEGIN`/`COMMIT` exists anywhere in the function.

**Concurrent invocation scenario** (real: server.js fires both startup `setTimeout(30s)` and an admin `/archive-now` endpoint):
1. Both instances SELECT config → same `hot_retention_days`
2. Both compute same `cutoffDate`
3. Instance A: UPDATE audit_log WHERE archived_at IS NULL → matches 5,000 rows
4. Instance B: UPDATE audit_log WHERE archived_at IS NULL → matches 0 rows (A already set them)
5. A: UPDATE config `last_archive_row_count=5000` ✓
6. B: UPDATE config `last_archive_row_count=0` ✗ — clobbers A's count

The archive itself is idempotent. The row count in `audit_retention_config` is unreliable under concurrent invocation.

**Fix shape:** Use `pool.connect()` + explicit `BEGIN`/`COMMIT` to wrap all three queries.

---

### MED-4 — `archiveOldAuditRows`: `||` operator on `options.hot_retention_days` means value `0` silently falls through to config default

**Severity:** MED  
**Verified by reading:** `routes/_audit.js:114-115`

```js
const hotRetentionDays = options.hot_retention_days ||
  (configResult.rows[0]?.hot_retention_days ?? 730);
```

`options.hot_retention_days = 0` is falsy — falls through to config. The override API documented in JSDoc is non-functional for zero and any other falsy numeric value. Cannot programmatically force "archive all rows" via the options parameter.

**Fix shape:** `const hotRetentionDays = options.hot_retention_days ?? (configResult.rows[0]?.hot_retention_days ?? 730);`

---

### MED-5 — `archiveOldAuditRows`: `hot_retention_days = 0` from config archives the ENTIRE audit_log in one run — no minimum bound enforced

**Severity:** MED  
**Verified by reading:** `routes/_audit.js:118-128`

```js
cutoffDate.setDate(cutoffDate.getDate() - hotRetentionDays); // 0 → cutoff = now → archives everything
```

`audit_retention_config.hot_retention_days` has no CHECK constraint in the schema. A misconfigured `UPDATE audit_retention_config SET hot_retention_days = 0` followed by the daily scheduler fires would archive the entire compliance audit trail. RUS 7-year retention requirement prohibits this.

**Fix shape:** `const safeDays = Math.max(hotRetentionDays, 30);` (or 365 minimum given 7-year requirement).

---

### LOW-1 — `logAudit` catch block: error message provides no context — impossible to correlate console output to specific route/action

**Severity:** LOW  
**Verified by reading:** `routes/_audit.js:41-43`

```js
} catch (e) {
  console.error('[audit_log:insert]', e && e.message);
}
```

When an insert fails (e.g., NOT NULL violation, pool error), the log output is `[audit_log:insert] null value in column "action"`. No `action`, `entity_type`, `entity_id` context is included. In a system processing thousands of audit events, correlating a failure to its trigger requires tracing through application logs — difficult in Railway's log view.

**Fix shape:** `console.error('[audit_log:insert]', action, entity_type, entity_id, e && e.message);`

---

### LOW-2 — `logAudit`: Does not call `redactPII` on `before`/`after`/`meta` internally — callers must remember, and many don't

**Severity:** LOW  
**Verified by reading:** `routes/_audit.js:36-39`; grep of 155 call sites

`logAudit` passes `before`, `after`, and `meta` directly to the INSERT without sanitization. `redactPII` is a separate export. Confirmed callers that pass raw DB row objects without redacting: `billing.js:226-238` (invoice rows), `project_photos.js:230-235` (photo metadata), `contracts.js:67-78` (contract rows).

While current `before`/`after` payloads don't contain credentials, the pattern is a maintenance hazard — future callers adding user-related objects may not redact them.

**Fix shape:** Optionally call `redactPII` inside `logAudit`:
```js
before: before != null ? redactPII(before) : null,
after: after != null ? redactPII(after) : null,
meta: meta != null ? redactPII(meta) : null,
```
(Depends on fixing HIGH-2/MED-1 first to avoid false positives and stack overflows.)

---

### LOW-3 — `archiveOldAuditRows`: Misleading "transactional" comment at line 121 — no BEGIN/COMMIT

**Severity:** LOW  
**Verified by reading:** `routes/_audit.js:121`

Comment says `// Update rows to set archived_at (transactional)` but no transaction exists. Misleads future maintainers about isolation guarantees. (Correctness impact captured in MED-3; this is comment accuracy.)

---

## VERIFIED CLEAN

1. **SQL injection in `logAudit`:** all 12 parameters are positional (`$1..$12`), no string interpolation. ✓
2. **SQL injection in `archiveOldAuditRows`:** `$1` used for cutoffDate, no user input reaches the SQL directly. ✓
3. **Timestamp trust:** `at` has `DEFAULT now()` in schema — server-generated, not from `req`. ✓
4. **Concurrent INSERT safety:** two concurrent `logAudit` calls write independent rows; no unique constraint to conflict on. ✓
5. **`entity_id` coercion:** `entity_id != null ? String(entity_id) : null` handles numeric IDs and UUIDs. ✓
6. **`req=undefined` safety:** all req field reads guarded: `req && req.user`, `req ? req.ip : null`, `req ? req.headers['user-agent'] : null`. ✓
7. **Module require()-time safety:** no synchronous code that could fail at require(). Top-level is function declarations only. ✓
8. **Module exports:** `module.exports = { logAudit, redactPII, archiveOldAuditRows }` — all three exported. ✓
9. **Env var reads at require-time:** none. Hot-reload safe. ✓
10. **`redactPII` immutability:** builds new `redacted = {}` — does not mutate input. ✓
11. **`redactPII` null/undefined passthrough:** `if (obj === null || obj === undefined) return obj` guard present. ✓
12. **`redactPII` case-insensitivity:** `key.toLowerCase()` before pattern match. ✓
13. **`redactPII` recursion into arrays:** `obj.map(item => redactPII(item))` — array items redacted correctly. ✓
14. **`archiveOldAuditRows` empty config row:** `configResult.rows[0]?.hot_retention_days ?? 730` safely defaults. ✓
15. **`archiveOldAuditRows` re-throws:** `throw e` after logging — callers can observe failure. ✓

---

## COVERAGE GAPS

1. **No live PG test** — JSONB serialization of `undefined` values (pg uses JSON.stringify which strips them) not live-verified. Risk is low given pg's maturity.
2. **Call-site audit was pattern-based (~50-site scan)** — not exhaustive for all 155 call sites. Spot-checked 20 highest-risk surfaces.
3. **No test coverage for `archiveOldAuditRows`** — no test file found for `routes/_audit.js`. Archive function has zero automated test coverage.
4. **Did not audit `audit_log.js` caller patterns exhaustively** — that file does call `redactPII` correctly on read paths; write paths were spot-checked.

---

## VERDICT: RED

Three HIGH findings block clean status:

- **HIGH-1** (`opts` destructure outside try): Silent no-op under Wave 86 pattern + ~50 fire-and-forget call sites without `.catch()` produce `UnhandledPromiseRejection`
- **HIGH-2** (`redactPII` circular refs): Stack overflow crashes route handler
- **HIGH-3** (no `action`/`entity_type` validation): Silent RUS compliance row drops

Fix sequence: HIGH-1 first (unblocks HIGH-3 since both are in `logAudit`), then HIGH-2 (independent `redactPII` fix), then MED-1 and MED-2 (sensitive pattern tuning), then MED-3 through MED-5 (`archiveOldAuditRows` hardening).

=== WAVE-191 AUDIT REPORT END ===
