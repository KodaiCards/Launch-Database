# Wave 183 — Security Audit: Remaining Route Files
**Files audited:** `routes/_csv_stage.js`, `routes/_splice_validation.js`, `routes/_sse.js`, `routes/audit_log.js`, `routes/training.js`
**Date:** 2026-05-30
**Framing:** Adversarial security (IDOR, score tampering, impersonation, channel leakage, resource exhaustion)

---

## Wave 86 wrong-signature scan

grep for `logAudit({pool` across all five files: **zero matches**.

All `logAudit` calls in `audit_log.js` (lines 210, 285, 334) use the correct `logAudit(pool, { req, ... })` signature. `training.js`, `_sse.js`, `_splice_validation.js`, and `_csv_stage.js` do not call `logAudit` at all.

**Result: CLEAN — no wrong-signature bugs.**

---

## FILE 1 — routes/_csv_stage.js

### VERIFIED CLEAN

- **Storage location:** in-memory `Map` only (`const csvStage = new Map()`), lines 16–18. No filesystem or DB persistence.
- **TTL:** 30 minutes (`CSV_STAGE_TTL_MS = 30 * 60 * 1000`, line 17). Sweep interval every 5 minutes (lines 22–26). `.unref()` prevents test-process hang (line 26).
- **Cross-user staging access:** stage IDs are UUID v4 (122-bit entropy). Not guessable. No `user_id` stored with the staged entry; however all three consumer endpoints (`csv-validate`, `csv-edit-row`, `csv-commit`) are behind `requireAdmin`, limiting the attack surface to admin-role users only.
- **File upload validation:** extension check only (`originalname.ext` at `hours_csv.js:255`). No MIME or magic-byte check. `XLSX.readFile()` will reject non-XLSX content with a parse error. Risk is parse-error DoS, not data leakage — mitigated by 3GB multer cap and `try/catch` in caller.

### Findings

None.

**VERDICT: GREEN**

---

## FILE 2 — routes/_splice_validation.js

### VERIFIED CLEAN

- **No regex:** Zero `RegExp`/`.match()`/`.test()` calls. No ReDoS attack surface.
- **No DB access:** pure computation over in-memory hydrate object. No SQL injection surface.
- **Constants (`TIA_598_ORDER`):** static color-order map, lines 37–40. Not attacker-controllable.
- **Rule runner error handling:** `try/catch` per rule (lines 557–563). A panicking rule produces a warning, not a 500 or data leak.

### Findings

None.

**VERDICT: GREEN**

---

## FILE 3 — routes/_sse.js

### VERIFIED CLEAN

- **Channel pinning (Wave 1.1 Item 15):** correctly implemented. Managers receive only their team channel, not `admin` (lines 129–139).
- **Resource cleanup on disconnect:** `req.on('close', _cleanupConn)` at line 237. `_purge()` removes from all channel Sets. `clearInterval(heartbeat)` stops timer. `_closed` flag prevents double-cleanup.
- **Heartbeat timer leaks:** `_cleanupConn()` wraps `clearInterval(heartbeat)` in try/catch (lines 175–181). Dead connections also purged in `broadcast()` on write-failure (line 86).
- **Cross-user event leakage:** broadcast delivers to a channel Set; membership is determined at connect time by role. No individual user data in payloads (row-level notifications, clients re-fetch).

### Finding — SSE-1

| # | SSE-1 |
|---|---|
| **Severity** | LOW |
| **File:Line** | `routes/_sse.js:124–142` |
| **Issue** | `construction_manager` and `construction_engineer` are documented in the header comment (lines 12–13) as receiving `team:construction`, but neither role appears in the `if/else if` chain. These users get no channel subscription — real-time events are silently dropped. |
| **Attack path** | Not data-leakage exploitable. Functional gap only: construction staff never receive push events. |
| **Fix shape** | Add after line 139: `else if (role === 'construction_manager') { myChannels.push('team:construction'); } else if (role === 'construction_engineer') { myChannels.push('team:construction'); }` |

Verified by reading: `routes/_sse.js:124–142`
```javascript
} else if (role === 'permitting_engineer') {
  myChannels.push('team:permitting');
}
// construction_manager / construction_engineer: MISSING — fall through with empty myChannels
```

### Finding — SSE-2

| # | SSE-2 |
|---|---|
| **Severity** | LOW |
| **File:Line** | `routes/_sse.js:182–232` |
| **Issue** | Heartbeat re-validates `active`, `tokens_invalid_after`, and existence, but does **not** re-check `role`. If an admin is demoted between connect and the next heartbeat tick, they continue to receive `admin` channel events for up to 25 s. |
| **Attack path** | Requires concurrent demotion. Max 25 s window. Not persistent escalation. |
| **Fix shape** | Fetch `role` in the heartbeat DB query; if it differs from the role stored at connect time, `_cleanupConn()` + `res.end()`. |

**VERDICT: YELLOW** (2 LOW)

---

## FILE 4 — routes/audit_log.js

### VERIFIED CLEAN

- **Auth gate:** `requireAdmin` on all six endpoints (line 16). `mw.requireAdmin` always provided from `server.js:754`. Fallback no-op is unreachable in production.
- **Parameterized queries:** all DB calls use `$N` placeholders.
- **IDOR on GET :id:** `id = parseInt(req.params.id)`, integer validated at line 131. No per-user scoping needed — all admins may read all audit rows by design.
- **PII redaction:** `redactPII()` applied to `before_data`, `after_data`, `meta` on GET and PUT responses.
- **Bulk delete:** no bulk-delete endpoint exists. Single-row DELETE only (line 331).
- **logAudit call signatures:** all three calls (lines 210, 285, 334) correct `logAudit(pool, {req,...})` pattern.

### Finding — ALOG-1

| # | ALOG-1 |
|---|---|
| **Severity** | MED |
| **File:Line** | `routes/audit_log.js:247–249` |
| **Issue** | `PUT /api/admin/audit-log/:id` `allowedFields` includes `actor_username`. An admin can rewrite which human name appears as the actor of any historical audit event. `actor_user_id` (UUID FK) is correctly excluded, but the display name is malleable. This breaks forensic non-repudiation: during an incident review, investigators see the tampered `actor_username` and cannot detect it was changed unless they cross-reference by `actor_user_id`. The `audit.edit` meta-log (line 285) records `fields_updated` but does not log the old/new actor_username values. |
| **Attack path** | Admin: `PUT /api/admin/audit-log/42 { "actor_username": "other_employee" }`. The targeted user now appears as the actor for that event. Admin can then alter `meta` to remove evidence. |
| **Fix shape** | Remove `'actor_username'` from `allowedFields`. If username-change correction is needed, derive it from `actor_user_id` FK server-side, not via free-text PUT. |

Verified by reading: `routes/audit_log.js:247–259`
```javascript
const allowedFields = [
  'before_data', 'after_data', 'meta', 'action', 'entity_type',
  'entity_id', 'actor_username', 'source', 'ip', 'user_agent'
  // actor_user_id correctly NOT here — but actor_username IS here
];
```

### Finding — ALOG-2

| # | ALOG-2 |
|---|---|
| **Severity** | LOW |
| **File:Line** | `routes/audit_log.js:75–81` |
| **Issue** | The search ILIKE filter uses `$N` three times (same slot) in the SQL string but pushes three copies of `searchTerm` into params. Two pushed values are never referenced — pg silently ignores them. `paramCount += 2` compensates to keep LIMIT/OFFSET at correct indices. The query executes correctly but is fragile: adding a fourth ILIKE condition would require adjusting both push count and the `+= 2` offset. ILIKE metacharacters (`%`, `_`) in `req.query.search` are not escaped, enabling full-table scans on large audit logs. |
| **Attack path** | Performance: `search=_` matches every row, forcing full-table ILIKE scan. Not a data-leakage or injection risk (parameterized). |
| **Fix shape** | Use distinct `$N`, `$N+1`, `$N+2` placeholders with one `params.push` each. Remove `paramCount += 2`. Optionally escape ILIKE metacharacters: `searchTerm.replace(/[%_\\]/g, '\\$&')`. |

Verified by reading: `routes/audit_log.js:75–82`
```javascript
filters.push(`(action ILIKE $${++paramCount} OR entity_type ILIKE $${paramCount} OR actor_username ILIKE $${paramCount})`);
params.push(searchTerm); // $N
params.push(searchTerm); // never referenced in SQL
params.push(searchTerm); // never referenced in SQL
paramCount += 2;         // compensates so LIMIT/OFFSET land at correct slots
```

### Finding — ALOG-3

| # | ALOG-3 |
|---|---|
| **Severity** | LOW |
| **File:Line** | `routes/audit_log.js:309–351` |
| **Issue** | `DELETE /api/admin/audit-log/:id` hard-deletes rows with no rate limiting, no soft-delete path, and no confirmation requirement. A malicious admin can script a loop deleting all audit entries in seconds. The `audit.delete` meta-log (line 334) records each deletion, but the attacker can delete those meta-log entries too. Cover-tracks scenario: admin deletes evidence of a prior action, then deletes the deletion records. |
| **Attack path** | Scripted loop: `DELETE /api/admin/audit-log/1` … `/99999`. Entire audit trail wiped. Meta-log deletions swept the same way. |
| **Fix shape** | (a) Soft-delete: add `deleted_at` column, filter in GET, only hard-delete via scheduled archival job. (b) Rate-limit: 10 DELETEs/min per admin. (c) Require a two-step confirmation token for DELETE. Any one of these significantly raises the bar. |

**VERDICT: YELLOW** (1 MED, 2 LOW)

---

## FILE 5 — routes/training.js

### VERIFIED CLEAN

- **No IDOR on user_id:** all routes use `req.user.id` from JWT. No `user_id` path params. Student A cannot write to Student B's rows.
- **Score range validation:** `score` clamped to 0–100 (lines 76–80, 151–153, 231–233).
- **Status advancement guard:** ON CONFLICT SQL ensures `completed` never regresses (lines 98–103). `best_score` only advances via `GREATEST()`.
- **domain_scores sanitization:** type-checked as plain object, size-capped at 8KB (lines 173–180), stored via `JSON.stringify`. No prototype pollution risk.
- **Admin progress-overview role gate:** `requireAuth(['admin', 'design_manager', 'permitting_manager'])` at line 268. Correctly enforced by `auth.js:414`.
- **Parameterized queries:** all DB calls use `$N` placeholders.

### Finding — TRAIN-1

| # | TRAIN-1 |
|---|---|
| **Severity** | MED |
| **File:Line** | `routes/training.js:155–165` (cert-attempt), `routes/training.js:235–244` (capstone-attempt) |
| **Issue** | Server accepts `passed=true` with any score, including 0. No server-side cross-validation between `passed`, `score`, and `correct_items/total_items`. Student can POST `{ cert_track: "OSP-Designer", score: 0, passed: true, total_items: 60, correct_items: 0 }` and the DB records a successful cert pass. Both `cert-attempt` and `capstone-attempt` have this gap. `score` and `correct_items/total_items` are also not cross-validated against each other. |
| **Attack path** | Any authenticated user fabricates a cert attempt. `training_cert_attempts` records false pass for that user. Admin progress-overview does not currently surface cert attempts, limiting visibility — but the record exists in DB. |
| **Fix shape** | Derive `passed` server-side: `const serverPassed = Math.round(correctN / totalN * 100) >= 80;` Reject if client-supplied `passed !== serverPassed`. Derive `score` server-side as `Math.round(correctN / totalN * 100)` and ignore client-supplied score. |

Verified by reading: `routes/training.js:151–165`
```javascript
const scoreN = Number(score);
if (!Number.isFinite(scoreN) || scoreN < 0 || scoreN > 100) { ... }
if (typeof passed !== 'boolean') { ... }
// correctN / totalN vs scoreN: NO cross-check
// scoreN >= 80 vs passed: NO cross-check
// passed=true accepted regardless of score
```

**VERDICT: YELLOW** (1 MED)

---

## Aggregate Counts

| Severity | Count | IDs |
|---|---|---|
| HIGH | 0 | — |
| MED | 2 | ALOG-1, TRAIN-1 |
| LOW | 4 | SSE-1, SSE-2, ALOG-2, ALOG-3 |
| **Total** | **6** | — |

### Summary by file

| File | Verdict | Findings |
|---|---|---|
| `_csv_stage.js` | GREEN | 0 |
| `_splice_validation.js` | GREEN | 0 |
| `_sse.js` | YELLOW | SSE-1 (LOW), SSE-2 (LOW) |
| `audit_log.js` | YELLOW | ALOG-1 (MED), ALOG-2 (LOW), ALOG-3 (LOW) |
| `training.js` | YELLOW | TRAIN-1 (MED) |

### Priority fix order

1. **ALOG-1** (MED) — `actor_username` editable via PUT breaks audit non-repudiation. Remove from `allowedFields`.
2. **TRAIN-1** (MED) — `passed=true` accepted regardless of score. Derive `passed` server-side from `correct_items/total_items`.
3. **SSE-1** (LOW) — `construction_manager`/`construction_engineer` missing from SSE channel map. Add two `else if` branches.
4. **ALOG-3** (LOW) — Hard-delete of audit rows without rate limit or soft-delete. Add rate-limiter or soft-delete path.
5. **ALOG-2** (LOW) — ILIKE search paramCount hack. Refactor to distinct `$N` per column; escape `%_\` metacharacters.
6. **SSE-2** (LOW) — Role not re-validated on heartbeat. Accept 25 s window or add role re-check on each tick.

=== WAVE-183-REMAINING-ROUTES-AUDIT REPORT END ===
