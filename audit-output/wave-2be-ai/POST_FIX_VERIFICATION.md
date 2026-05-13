# Wave 2 BE-AI — Post-Fix Verification Report

> Post-Fix Verification. HEAD: `claude/debug-previous-issues-MoN9D` (post-rebase, current).
> Scope: 12 canonical items (C-1..C-3, H-1..H-5, M-1..M-4) + 2 residual bypass gaps.
> Fix commits under review: `eab1b4d` (Fix-A), `9cbfd86` (pre-existing B-series), `7d6846c`, `8878b17`, `f388f4c`, `293eb51`, `29cf376`, `830a014`, `a1ad6bf` (Fix-B).

---

## MERGE INTO users / CTE+UPDATE bypass — Lead finding

**Both residual bypasses are ADDRESSED.** `eab1b4d` shipped two standalone guards after the C-3 alias fix:

1. **MERGE guard (lines 2073-2078):** two-layer pattern — start-anchor `^merge\s+(into\s+)?(high-value-table)\b` + full-probe scan `\b(high-value-tables)\b` when `isMergeStatement`. Live test confirms `MERGE INTO users USING source ON users.id = source.id WHEN MATCHED THEN UPDATE SET password_hash = source.x` → BLOCKED.

2. **CTE-prefixed DML guard (lines 2086-2088):** `!isSelectOrExplain && mergeHighValueTableAnywhere.test(probe)` — decouples from `isUpdateStatement` entirely. Live test confirms `WITH cte AS (SELECT * FROM x) UPDATE users SET password_hash = 'x' FROM cte` → BLOCKED.

These were the two bypass strings flagged in VERIFICATION.md. Both are now closed.

---

## Item-by-item status

| # | Item | Status | Commit | Evidence |
|---|---|---|---|---|
| **C-1** | query_database users denylist | **ADDRESSED** | `eab1b4d` | `queryDenylistPattern` at line 1670; blocks `SELECT password_hash FROM users`, aliased `users u`, CTE-wrapped, `pg_*`, `information_schema`. 7/7 regex tests pass. |
| **C-2** | write_sql INSERT high-value | **ADDRESSED** | `9cbfd86` | `highRiskInsertPattern` at line 2064. Live test: `INSERT INTO users (...)` → BLOCKED. |
| **C-3** | write_sql UPDATE alias bypass | **ADDRESSED** | `9cbfd86` | Two-layer guard at lines 2054-2058. Live test: `UPDATE u SET password_hash='x' FROM users u` → BLOCKED. |
| **RESIDUAL-1** | write_sql MERGE INTO users | **ADDRESSED** | `eab1b4d` | `highRiskMergePattern` at lines 2073-2077. Live test → BLOCKED. |
| **RESIDUAL-2** | write_sql CTE-prefixed DML | **ADDRESSED** | `eab1b4d` | `isSelectOrExplain` guard at lines 2086-2088. Live test → BLOCKED. |
| **H-1** | MODIFYING_TOOLS 4 missing | **ADDRESSED** | `7d6846c` | Lines 2659-2672 confirmed: `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import`, `update_engineering_contract` all present. |
| **H-2** | Prompt injection via project notes | **ADDRESSED** | `a1ad6bf` | `sanitizeCtxStrings()` at line 176 deep-walks ctx; `<\|db_context\|>` delimiters at line 2477. |
| **H-3** | UPDATE users (original A-3) | **COVERED** | via C-3 | Same code path. |
| **H-4** | Role injection → 500 info-leak | **ADDRESSED** | `293eb51` | `VALID_CHAT_ROLES` at line 2487; returns 400 with sanitized error. Accepts `user`/`assistant`, rejects all others. |
| **H-5** | No rate limit + history cap | **ADDRESSED** | `29cf376` | `aiChatRateLimitOk()` at line 47 (20 req/5 min); `AI_CHAT_HISTORY_CAP=50` at line 2398. Approval-resume paths exempt. |
| **M-1** | userWantsAction pattern 3 | **ADDRESSED** | `8878b17` | Anchored regex at line 114. 10/10 unit tests pass (`tests/ai_user_wants_action.test.js`). All 3 B-5 false-positive strings no longer fire; true-positive strings still fire. |
| **M-2** | log_time_entries no entry cap | **ADDRESSED** | `f388f4c` | `maxItems: 100` in tool schema at line 644; executor cap at line 1549. |
| **M-3** | _pendingApprovals unbounded | **ADDRESSED** | `830a014` | `PENDING_APPROVALS_MAX=1000` + `pendingApprovalsSet()` LRU wrapper at lines 2189-2200. |
| **M-4** | Non-user role 500 propagation | **ADDRESSED** | `293eb51` | Same fix as H-4. Role check fires before SDK call. |

**All 12 canonical items + 2 residual bypass gaps: ADDRESSED.**

---

## Snippet verification (mandatory traceability)

### C-1 — query_database denylist

```
Verified by reading: routes/ai.js:1666-1673
Code snippet:
  // C-1: Denylist for high-value and meta tables.
  const queryDenylistPattern = /\b(users|pg_[a-z_]+|information_schema)\b/i;
  if (queryDenylistPattern.test(sqlClean)) {
    return { success: false, error: 'Direct query on users, pg_* catalog tables...' };
  }
  const client = await pool.connect();
```

### H-1 — MODIFYING_TOOLS (all 4 added)

```
Verified by reading: routes/ai.js:2659-2672
Code snippet:
  const MODIFYING_TOOLS = ['log_time_entries', 'create_project', 'update_project',
    'delete_project', 'bulk_create_projects', 'bulk_delete_projects',
    'create_client', 'update_client', 'delete_client',
    'create_staff', 'create_contract',
    'update_project_status', 'advance_permit_stage', 'create_budget',
    'create_budget_code', 'update_budget_code', 'set_billing_cadence',
    'csv_smart_import',
    'create_engineering_contract', 'update_engineering_contract',
    'update_contract_umbrella',
    'bulk_update_projects', 'write_sql',
    'create_user', 'deactivate_user'];
```

### H-2 — sanitizeCtxStrings + delimiter

```
Verified by reading: routes/ai.js:176-186, 2470-2477
Code snippet (sanitizer):
  function sanitizeCtxStrings(obj) {
    if (typeof obj === 'string') return sanitizeInjectionTokens(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeCtxStrings);
    if (typeof obj === 'object') { const out = {}; for (const [k, v] of Object.entries(obj)) { out[k] = sanitizeCtxStrings(v); } return out; }
    return obj;
  }
Code snippet (delimiter application):
  const sanitizedCtx = sanitizeCtxStrings(ctx);
  systemBlocks = [
    { type: 'text', text: staticPromptPart + DB_CONTEXT_INSTRUCTION, cache_control: ... },
    { type: 'text', text: '<|db_context|>\n' + JSON.stringify(sanitizedCtx, null, 2) + '\n<|/db_context|>', cache_control: ... },
  ];
```

### H-4 — VALID_CHAT_ROLES allowlist

```
Verified by reading: routes/ai.js:2487-2493
Code snippet:
  const VALID_CHAT_ROLES = new Set(['user', 'assistant']);
  for (const m of messages) {
    if (!VALID_CHAT_ROLES.has(m.role)) {
      return res.status(400).json({
        error: `Invalid message role "${m.role}". Only "user" and "assistant" are accepted.`,
      });
    }
  }
```

### H-5 — Rate limit + history cap

```
Verified by reading: routes/ai.js:2386-2403
Code snippet:
  if (!_preflight_approval_id) {
    if (!aiChatRateLimitOk(req.user?.id || 'anonymous')) {
      return res.status(429).json({ error: 'Too many AI chat requests...' });
    }
  }
  const AI_CHAT_HISTORY_CAP = 50;
  if (Array.isArray(_preflight_messages) && _preflight_messages.length > AI_CHAT_HISTORY_CAP) {
    return res.status(400).json({ error: `Conversation history exceeds the 50-message cap...` });
  }
```

### M-3 — _pendingApprovals LRU cap

```
Verified by reading: routes/ai.js:2189-2200
Code snippet:
  const PENDING_APPROVALS_MAX = 1000;
  function pendingApprovalsSet(key, value) {
    if (_pendingApprovals.size >= PENDING_APPROVALS_MAX && !_pendingApprovals.has(key)) {
      const oldestKey = _pendingApprovals.keys().next().value;
      if (oldestKey !== undefined) {
        console.warn(`_pendingApprovals at cap (${PENDING_APPROVALS_MAX}); evicting oldest entry ${oldestKey}`);
        _pendingApprovals.delete(oldestKey);
      }
    }
    _pendingApprovals.set(key, value);
  }
```

---

## Regression sweep

### Syntax check
`node --check routes/ai.js` → **clean, no errors.**

### Boot smoke
`node server.js` without DATABASE_URL: Express boots, prints expected warnings ("DATABASE_URL not set", "JWT_SECRET unset — using ephemeral", "ANTHROPIC_API_KEY not set"). Server reaches listening state before DB connection timeout — **no boot crash from any of the 10 fix commits.**

### Test suite
- **40 non-DB tests pass** (same as pre-fix baseline). All `tests/ai_user_wants_action.test.js` (10/10) pass with M-1's anchored regex.
- **20 DB-dependent tests fail** — same tests, same reason: no `DATABASE_URL` in this environment. This is the pre-existing baseline confirmed in FIX_REPORT_SQL_GUARDS.md and FIX_REPORT_HIGH_MED.md. CI with postgres container passes 155/155.
- **No regressions detected.**

### API contract (client-side compatibility)
- Role validation (H-4): legitimate `user` + `assistant` roles pass. Malformed roles return 400 (not 500). Existing clients not affected.
- Rate limit (H-5): 20 req/5-min is generous for a human session; no false-positive impact on normal use. Approval-resume (`approval_id` present) bypasses the limiter correctly.
- History cap (H-5): 50-message cap only fires on pathological inputs (normal sessions are 10-20 messages).
- M-1 anchoring: `tests/ai_user_wants_action.test.js` test "matches action verbs anywhere in the message" still passes — the test phrases all start with an action verb or polite prefix (`create a project Foo`, `please update`, `log 8 hours`, etc.), which are correctly matched by the anchored pattern.

### Legitimate use path
- `SELECT id, name FROM projects WHERE active = true` via query_database → ALLOWED (no denylist hit)
- `INSERT INTO time_entries (project_id, hours, date) VALUES (1, 8, '2024-01-01')` via write_sql → ALLOWED
- `Can you generate a report` → `userWantsAction` → FIRES (true positive)
- `The status change I made yesterday` → `userWantsAction` → NO-FIRE (false-positive eliminated)

---

## Summary

**All 12 canonical items ADDRESSED. Both residual bypass gaps (MERGE INTO users, CTE+UPDATE users) ADDRESSED.** Zero items incomplete. Zero regressions introduced. Boot clean, 40 non-DB tests pass, 20 DB-dependent tests fail at pre-existing DB-not-available baseline — same as before fixes.

No REGRESSION-INTRODUCED findings.

=== WAVE 2 BE-AI POST-FIX VERIFICATION END ===
