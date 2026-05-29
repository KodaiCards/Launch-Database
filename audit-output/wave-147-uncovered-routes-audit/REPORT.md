# Wave 147 — Security Audit: Uncovered Route Files
**Scope:** `routes/notifications.js` (absent), `routes/dashboard.js`, `routes/training.js`, `routes/portal_access.js`, `routes/recent_activity.js`
**Date:** 2026-05-29
**Framing:** IDOR · Authorization · SQL injection · Cross-tenant leakage · Audit logging · Information disclosure · Race conditions

---

## notifications.js — NOT PRESENT — SKIPPED

`ls routes/` confirms no `notifications.js` file exists. Skipped.

---

## routes/dashboard.js

### FINDINGS

#### FINDING D-1 — MED — Information Disclosure via Raw DB Error Message
- **Severity:** MED
- **File:line:** `routes/dashboard.js:91` and `routes/dashboard.js:230`
- **Snippet (line 91):**
  ```js
  } catch (e) { res.status(500).json({ error: e.message }); }
  ```
  **Snippet (line 230):**
  ```js
  } catch (e) { res.status(500).json({ error: e.message }); }
  ```
- **Attack path:** When the PostgreSQL query throws (schema mismatch, DB connectivity failure, unexpected null), the raw `e.message` from pg driver is forwarded to the authenticated client. This can expose table names, column names, SQL clause fragments, or host information. Same pattern remediated in `routes/invoice_templates.js` during Wave 1.5 GAP-1 fix `cea5c12`.
- **Fix shape:** Replace both `res.status(500).json({ error: e.message })` with `res.status(500).json({ error: 'Dashboard data unavailable' })` and move `e.message` to `console.error('[dashboard]', e.message)`.

### VERIFIED CLEAN

- **IDOR:** No per-user scoping needed — endpoint aggregates across all projects with no `:id` path param. Access gated to admin/design_manager/permitting_manager at both routes (lines 72 and 94).
- **Authorization:** `GET /api/dashboard/active-list` (line 72) and `GET /api/dashboard` (line 94) both use `requireAuth(['admin', 'design_manager', 'permitting_manager'])`. Comment at lines 68–71 documents the Item 17 fix (active-list was previously unauthenticated). Lower-privilege authenticated users receive 403.
- **SQL injection:** All SQL uses parameterized queries. `yyyy` derived via `parseInt(req.query.year)` — produces integer only. `periodStart`/`periodEnd` are strings built from `parseInt`-derived integers and passed as `$1`/`$2` parameters (line 164). Zero string interpolation of user input into SQL.
- **Cross-tenant leakage:** Both endpoints return company-wide aggregate data intentionally. Role gating to manager/admin is appropriate for company-wide reporting.
- **Race conditions:** `getYtdRevenue` cache is a read-only in-memory TTL structure. Concurrent cache misses may double-compute but this is performance, not security.
- **Audit logging:** Read-only aggregate surface; no state changes; audit logging not applicable.

**VERDICT: YELLOW** — 0 HIGH, 1 MED.

---

## routes/training.js

### FINDINGS

#### FINDING T-1 — MED — Admin Endpoint Uses Weaker In-Handler Role Check Instead of requireAuth Middleware Gate
- **Severity:** MED
- **File:line:** `routes/training.js:265-268`
- **Snippet:**
  ```js
  app.get('/api/training/admin/progress-overview', requireAuth(), async (req, res) => {
    if (!ADMIN_ROLES.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
  ```
- **Attack path:** `requireAuth()` (any authenticated user passes) + manual in-handler check is functionally equivalent to `requireAuth(['admin','design_manager','permitting_manager'])` today, but creates maintenance risk: if the in-handler check is removed in a future refactor, any authenticated employee reads all users' training progress (usernames, course completion, last_seen_at). Same anti-pattern as the pre-fix Item 17 active-list vulnerability in dashboard.js.
- **Fix shape:** Replace `requireAuth()` with `requireAuth(['admin', 'design_manager', 'permitting_manager'])` on the route registration at line 265, then delete the manual `if (!ADMIN_ROLES.includes(...))` block and the `ADMIN_ROLES` const.

#### FINDING T-2 — LOW — `domain_scores` Object Has No Size/Depth Limit
- **Severity:** LOW
- **File:line:** `routes/training.js:173-177`
- **Snippet:**
  ```js
  if (domain_scores !== undefined && domain_scores !== null) {
    if (typeof domain_scores !== 'object' || Array.isArray(domain_scores)) {
      return res.status(400).json({ error: 'domain_scores must be a plain object when provided' });
    }
  }
  ```
- **Attack path:** `domain_scores` validated only as a non-array plain object — no limit on key count, key length, value size, or nesting depth. An authenticated user could submit an arbitrarily large payload that gets `JSON.stringify`'d into `training_cert_attempts.domain_scores` jsonb. DoS vector against DB storage and memory for any authenticated user.
- **Fix shape:** Add `const dsStr = JSON.stringify(domain_scores); if (dsStr.length > 4096) return res.status(400).json({ error: 'domain_scores exceeds 4KB limit' });` before the insert.

### VERIFIED CLEAN

- **IDOR:** Every write endpoint scopes `user_id` to `req.user.id` from the authenticated session (lines 124, 186, 249). Every read endpoint scopes to `req.user.id` (lines 39, 209). No path param accepts a foreign user ID.
- **Authorization:** All 5 user-facing endpoints require `requireAuth()`. Admin endpoint is functionally gated (T-1 above).
- **SQL injection:** All queries use `$N` parameterized placeholders. `course_id` and `lesson_id` validated as strings with length caps (50/100 chars). `status` validated against explicit allowlist. Numerics coerced via `Number()` and range-checked before use.
- **Cross-tenant leakage:** Training data is per-user only; no project or client data surfaces. Admin overview is role-gated.
- **Race conditions:** `POST /progress` uses `ON CONFLICT (user_id, lesson_id) DO UPDATE` upsert (lines 87-123) — PostgreSQL serializes row-level conflicts atomically. `GREATEST()` logic for `completion_pct` and `best_score` is safe under concurrent writes.
- **Audit logging:** Training progress writes are personal learning data (not financial, not access control). No audit log requirement flagged for these. `training_cert_attempts` table is itself the durable record for exam attempts.

**VERDICT: YELLOW** — 0 HIGH, 1 MED, 1 LOW.

---

## routes/portal_access.js

### FINDINGS

#### FINDING P-1 — MED — DELETE Endpoint Lacks `active = true AND role <> 'customer'` Filter on User Lookup
- **Severity:** MED
- **File:line:** `routes/portal_access.js:127-130`
- **Snippet:**
  ```js
  const { rows: userRows } = await pool.query(
    `SELECT id, role FROM users WHERE id = $1`,
    [userId]
  );
  ```
- **Comparison:** POST endpoint at line 101-104 uses `SELECT id, role FROM users WHERE id = $1 AND active = true AND role <> 'customer'`.
- **Attack path:** The DELETE endpoint can operate on deactivated users and customer-role users. This creates a logic inconsistency: (1) if a user is deactivated and later re-activated, their portal access may have been stripped during downtime without audit context; (2) a customer-role user who somehow has a portal access row (theoretically impossible via POST, but could exist via direct DB manipulation) can have it deleted/confirmed via this path. Exploitable only by admin but creates logic gap.
- **Fix shape:** Change the DELETE user query to: `SELECT id, role FROM users WHERE id = $1 AND active = true AND role <> 'customer'` matching the POST filter. Return 404 for deactivated or customer users.

### VERIFIED CLEAN

- **IDOR:** All write endpoints are gated to `requireAdmin`. Admin is a super-role; IDOR scoping to self is not applicable.
- **Authorization:** `requireAdmin` applied to all 4 endpoints (lines 29, 46, 94, 124). `mw.requireAdmin` is `requireAuth('admin')` per server.js line 814. The `|| ((req, res, next) => next())` fallback on line 18 is dead code in production (server.js always passes valid `mw`).
- **SQL injection:** All queries parameterized. `portalKey` validated against `knownKeys` (from `portalDefs`) + `CAPABILITY_KEYS` allowlist before any use (lines 96-99). Invalid keys rejected with 400. `userId` passed as `$1` — PostgreSQL validates UUID format on its own.
- **Cross-tenant leakage:** `GET /api/portal-access` filters `role <> 'customer'` (line 51). Customer data not exposed.
- **Audit logging:** Both state-change endpoints call `logAudit(...)` (lines 113-114 and 145-146). Grant/revoke of portal access logged with `entity_type: 'portal_access'`, `entity_id: userId`, and `meta: { portal_key }`.
- **Race conditions:** `INSERT ... ON CONFLICT DO NOTHING` on POST path is safe under concurrent grants. DELETE is a simple point delete — no race.
- **Information disclosure:** `serverError()` at lines 20-23 returns hardcoded `'Internal server error'` string; `e.message` goes to server log only.

**VERDICT: YELLOW** — 0 HIGH, 1 MED.

---

## routes/recent_activity.js

### FINDINGS

No HIGH or MED findings.

#### FINDING R-1 — LOW — `console.error` Logs Full Error Object Including Stack Trace
- **Severity:** LOW (server-side only, no client-side exposure)
- **File:line:** `routes/recent_activity.js:92`
- **Snippet:**
  ```js
  } catch (err) {
    console.error('recent-activity error:', err);
    res.status(500).json({ error: 'Failed to load recent activities' });
  }
  ```
- **Attack path:** Full `err` object (stack trace, DB internals) emitted to server logs. Not a client exposure — client receives safe generic message. But full stack traces in logs can expose internal structure if logs are compromised or accessible to broader team. Minor compliance concern.
- **Fix shape:** Change to `console.error('[recent-activity] error:', err.message)` to match pattern used in other routes (`[training]`, `[portal-access]`).

### VERIFIED CLEAN

- **IDOR:** Read-only aggregate endpoint. No path params, no user-scoped data. Intentionally company-wide admin view.
- **Authorization:** `requireAdmin` applied at line 12. Server.js line 748 passes `requireAdmin = requireAuth('admin')`. Only admin reaches this endpoint.
- **SQL injection:** Single `$1` parameter (for `limit`). `limit` sanitized via `Math.min(parseInt(..., 10), 100)` — parsed to integer then capped at 100. No user-supplied string interpolation in CTE structure.
- **Cross-tenant leakage:** Returns company-wide activity intentionally (admin surface). `audit_log` entries include entity UUIDs and types — appropriate admin-level transparency. No customer credentials or sensitive field values.
- **Race conditions:** Read-only endpoint. No writes, no races.
- **Audit logging:** Read-only endpoint; not applicable.
- **Information disclosure:** Client receives `{ error: 'Failed to load recent activities' }` — no raw error message forwarded.

**VERDICT: GREEN** — 0 HIGH, 0 MED, 1 LOW.

---

## COVERAGE GAPS

1. **No security-focused tests** for dashboard, portal_access, or recent_activity route files. Auth bypass and IDOR tests not confirmed present.
2. **Body-parser size limit** for the `domain_scores` concern (T-2) depends on whether a global `express.json({ limit: '...' })` is set in server.js — not verified in this audit scope.
3. **Training write rate limiting:** `POST /api/training/progress` can be called in a tight loop by any authenticated user to inflate `attempts` counts arbitrarily. Not access-control exploitable but could pollute analytics.

---

## CUMULATIVE SUMMARY

| File | HIGH | MED | LOW | Verdict |
|---|---|---|---|---|
| notifications.js | — | — | — | N/A (absent) |
| dashboard.js | 0 | 1 | 0 | YELLOW |
| training.js | 0 | 1 | 1 | YELLOW |
| portal_access.js | 0 | 1 | 0 | YELLOW |
| recent_activity.js | 0 | 0 | 1 | GREEN |
| **TOTAL** | **0** | **3** | **2** | |

**Finding index:**
- **D-1 MED** `dashboard.js:91,230` — raw `e.message` forwarded to client in both error catch blocks
- **T-1 MED** `training.js:265` — admin progress-overview uses weak in-handler role check vs structural requireAuth gate
- **T-2 LOW** `training.js:173` — `domain_scores` has no size/depth limit (DoS via large payload)
- **P-1 MED** `portal_access.js:127-130` — DELETE user lookup missing `active=true AND role<>'customer'` filter present in POST
- **R-1 LOW** `recent_activity.js:92` — full error object (stack trace) logged server-side (no client exposure)

=== WAVE-147 UNCOVERED ROUTES SECURITY AUDIT REPORT END ===
