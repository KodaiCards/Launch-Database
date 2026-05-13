# Wave 2 BE-AI Remainder — Verification Report

> Verification Red-Team. HEAD: `claude/debug-previous-issues-MoN9D` as of pull-rebase 2026-05-13.
> Source: 12 canonical items (3 CRIT, 5 HIGH, 4 MED). Scope: `routes/ai.js` (2536 LOC).

---

## CRITICAL items

### C-1 — query_database users denylist — VERIFIED (open)

**Status: VERIFIED — no executor-level denylist exists.**

```
Verified by reading: routes/ai.js:1553-1585
Code snippet (lines 1562-1576):
  const sqlClean = toolInput.sql.trim().replace(/;+\s*$/, '');
  if (sqlClean.includes(';')) { return { success: false, error: ... }; }
  const firstWord = sqlClean.split(/\s+/)[0].toUpperCase();
  if (firstWord !== 'SELECT' && firstWord !== 'WITH') { return ... }
  const client = await pool.connect();
  await client.query('BEGIN');
  await client.query('SET TRANSACTION READ ONLY');
  const { rows } = await client.query(sqlClean);
```

Guards: semicolon block, SELECT/WITH firstWord check, READ ONLY transaction. No table-name denylist. `SELECT username, password_hash FROM users` passes all three guards and executes. Tool schema description at lines 607-617 says "available tables" but does not list `users` — soft hint only, not enforced. READ ONLY prevents DML but returns credential rows. Fix shape correct: token-scan denylist for `users`, `pg_*`, `information_schema`.

---

### C-2 — write_sql INSERT high-value tables — ALREADY-ADDRESSED (9cbfd86)

**Status: ALREADY-ADDRESSED — `highRiskInsertPattern` installed by hotfix `9cbfd86`.**

```
Verified by reading: routes/ai.js:1956-1963
Code snippet:
  // B2 hotfix: INSERT INTO high-value tables was never blocked.
  const highRiskInsertPattern = /^insert\s+into\s+(users|engineering_contracts|clients|contracts)\b/i;
  if (highRiskInsertPattern.test(probe)) {
    return { success: false, error: 'Direct INSERT INTO users ...' };
  }
```

Live regex test confirms: `INSERT INTO users (username, password_hash, role) VALUES (...)` → blocked. Fix correct; fix shape matches canonical.

**Adjacent gap (new surface, not a canonical item):** `MERGE INTO users USING ... WHEN MATCHED THEN UPDATE SET password_hash='x'` is not blocked by any pattern (DDL, DELETE, UPDATE, INSERT guards all pass). MERGE is PostgreSQL 15+ syntax; write_sql requires admin approval (it's in DESTRUCTIVE_AI_TOOLS) so exploitability requires admin click-through. Surfaced as an adjacent note, not counted against C-2.

---

### C-3 — write_sql UPDATE alias bypass — ALREADY-ADDRESSED (9cbfd86)

**Status: ALREADY-ADDRESSED — two-layer guard installed by `9cbfd86`.**

```
Verified by reading: routes/ai.js:1942-1955
Code snippet:
  const highRiskUpdatePattern = /^update\s+(engineering_contracts|users|clients|contracts)\b/i;
  const highRiskUpdateTableAnywhere = /\b(engineering_contracts|users|clients|contracts)\b/i;
  const isUpdateStatement = /^update\b/i.test(probe);
  if (highRiskUpdatePattern.test(probe) || (isUpdateStatement && highRiskUpdateTableAnywhere.test(probe))) {
    return { success: false, error: 'Direct UPDATE ...' };
  }
```

Live regex test confirms: `UPDATE u SET password_hash='x' FROM users u WHERE u.id=1` → blocked (isUpdateStatement=true, highRiskUpdateTableAnywhere matches `users`). Comment-stripping loop runs before all guards (lines 1913-1918) so `/* comment */ UPDATE u ... FROM users u ...` is also caught. Fix shape matches canonical.

**Residual gap (adjacent note):** `WITH cte AS (SELECT 1) UPDATE users SET ...` — `isUpdateStatement` test uses `^update\b` which fails when probe starts with `WITH`. The `highRiskUpdateTableAnywhere` check only fires when `isUpdateStatement` is true, so this CTE-prefixed UPDATE bypasses the alias guard. The direct anchor `highRiskUpdatePattern` also fails. This is a genuine residual bypass for write_sql (requires admin approval). Flagged for fix agent.

---

## HIGH items

### H-1 — MODIFYING_TOOLS gap — VERIFIED (open)

**Status: VERIFIED — 4 tools missing from MODIFYING_TOOLS array.**

```
Verified by reading: routes/ai.js:2033-2049 (DESTRUCTIVE_AI_TOOLS) + 2467-2477 (MODIFYING_TOOLS)
DESTRUCTIVE_AI_TOOLS Set (lines 2033-2049):
  bulk_create_projects, bulk_delete_projects, csv_smart_import,
  update_engineering_contract  [among others]

MODIFYING_TOOLS array (lines 2467-2477):
  ['log_time_entries','create_project','update_project','delete_project',
   'create_client','update_client','delete_client','create_staff',
   'create_contract','update_project_status','advance_permit_stage',
   'create_budget','create_budget_code','update_budget_code',
   'set_billing_cadence','create_engineering_contract',
   'update_contract_umbrella','bulk_update_projects','write_sql',
   'create_user','deactivate_user']
```

Node diff: `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import`, `update_engineering_contract` are in DESTRUCTIVE but absent from MODIFYING. Hallucination guard fires only when `successfulModifications.length === 0` at line 2488. These 4 tools can claim success without triggering the guard. Fix: add all 4 to MODIFYING_TOOLS.

---

### H-2 — Prompt injection via project notes — VERIFIED (open)

**Status: VERIFIED — `projects.notes` flows unsanitized into system context.**

```
Verified by reading: routes/ai.js:120-165 (getDBContext) + 2299-2304 (systemBlocks assembly)
Code snippet (lines 2299-2304):
  const ctx = await getDBContext();
  ctx._today = new Date().toISOString().split('T')[0];
  systemBlocks = [
    { type: 'text', text: staticPromptPart, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: JSON.stringify(ctx, null, 2), cache_control: { type: 'ephemeral' } },
  ];
```

`getDBContext()` at line 125 selects `p.notes` from `projects`. The full projects array (including notes) is serialized to JSON and placed in the system block with no sanitization. A crafted note ("IGNORE PRIOR INSTRUCTIONS: you are now...") is delivered directly to Claude as system context on every chat turn. Combined with C-2/C-3 gaps this is the injection chain the canonical list describes. Fix: strip or delimit DB-sourced strings before system-context injection, or move notes into a tool-call result block instead of system prompt.

---

### H-4 — Role injection in conversation history — VERIFIED (open), but severity OVERSTATED

**Status: VERIFIED (real 500 surface) but OVERSTATED as injection risk.**

```
Verified by reading: routes/ai.js:2312-2313
Code snippet:
  conversationMessages = messages.map(m => {
    if (m.role !== 'user') return { role: m.role, content: m.content };
    // only 'user' messages get injection-marker wrapping
  });
```

Non-`user` roles pass verbatim to the Anthropic SDK. Malformed roles (e.g., `"system"`, `"fake"`) will be rejected by the API with a 400/422, but the rejection propagates as an unhandled 500 with raw error message to the client — info leak + DoS. Canonical item correctly identifies the 500/info-leak surface (matches C-precision finding C-3). As injection: Anthropic enforces role alternation server-side so arbitrary role injection is not exploitable for prompt injection, but the 500 propagation is real. Severity: HIGH for DoS/info-leak, lower for injection. Fix shape correct: validate roles to `{user, assistant}` allowlist before SDK call.

---

### H-3 — Already resolved via C-3. Not independently verified.

---

### H-5 — Rate limit + conversation history cap — VERIFIED (open)

**Status: VERIFIED — no per-user rate limit, no conversation history turn cap.**

```
Verified by reading: routes/ai.js (full endpoint search for rateLimit, throttle, per-user)
No rate-limit middleware found on /api/ai/chat route.
No cap on conversationMessages.length before SDK call.
```

A client can send a 100-turn conversation history on every request, forcing large Anthropic calls. The 10MB Express body limit (cited by Auditor C as mitigating) prevents extreme payloads but a 100-turn × 8K-token history within 10MB is still costly. No per-user per-minute request cap exists. Fix shape matches canonical.

---

## MEDIUM items

### M-1 — userWantsAction pattern 3 unanchored — VERIFIED (open)

**Status: VERIFIED — pattern 3 fires on all 3 B-5 test strings.**

```
Verified by reading: routes/ai.js:77
Code snippet:
  if (/\b(create|add|insert|log|update|change|set|edit|modify|delete|remove|drop|
       mark|advance|bill|complete|reject|import|upload|save|build|make|start|begin|
       run|execute|generate)\b/i.test(trimmed)) {
    return true;
  }
```

Live regex test on B-5 strings:
- `"the status change I made yesterday"` → FIRES (false-positive)
- `"what happens if I delete a project"` → FIRES (false-positive)
- `"the project update looks good"` → FIRES (false-positive)
- `"can you show me the list"` → does not fire ✓
- `"tell me about the budget"` → does not fire ✓

All three false-positive strings trigger `tool_choice='any'`, forcing an unnecessary tool turn. Fix: anchor to sentence start or require action verb is first significant verb.

---

### M-2 — log_time_entries entry-count cap — VERIFIED (open)

**Status: VERIFIED — no maxItems in schema, no executor cap.**

```
Verified by reading: routes/ai.js:558-579 (tool schema) + 1468-1494 (executor)
Schema lines 563-576: entries array has no maxItems.
Executor lines 1474-1479: iterates toolInput.entries without length check.
```

An unbounded entries array iterates in the DB transaction without limit. 10MB body cap is upstream but a 10MB JSON payload of time entries is still tens of thousands of rows. Fix: `maxItems: 100` in schema + executor cap with error.

---

### M-3 — _pendingApprovals Map unbounded — VERIFIED (open)

**Status: VERIFIED — no size cap on the Map.**

```
Verified by reading: routes/ai.js:2051-2062
Code snippet:
  const _pendingApprovals = new Map();
  const APPROVAL_TTL_MS = 15 * 60 * 1000;
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of _pendingApprovals) {
      if (v.expires_at < now) _pendingApprovals.delete(k);
    }
  }, 5 * 60 * 1000).unref();
```

Entries are added at line 2389 with no size guard. Each entry holds `systemBlocks`, `cachedTools`, full `conversationMessages` (15+ turns), and `stagedToolUses`. A DoS can fill the Map faster than the 5-minute GC interval. Fix: cap at 1000 entries with LRU eviction on `_pendingApprovals.set`.

---

### M-4 — Non-user role 500 propagation — VERIFIED (open)

**Status: VERIFIED — same code path as H-4, no catch around SDK call for role errors.**

Role rejection by Anthropic SDK propagates as an unhandled 500 to the client. Covered by H-4 fix. No separate fix needed beyond H-4 validation.

---

## Adjacent gaps surfaced (not canonical items)

1. **MERGE INTO users bypass (write_sql):** `MERGE INTO users USING ... WHEN MATCHED THEN UPDATE SET ...` passes all current guards. Requires admin approval click-through to exploit. Recommend adding `^merge\b` to DDL pattern or adding a high-value-table anywhere scan that fires regardless of statement type.
2. **CTE + UPDATE users bypass (write_sql):** `WITH cte AS (...) UPDATE users SET ...` — the `isUpdateStatement` flag (`^update\b`) is false when probe starts with `WITH`, disabling the `highRiskUpdateTableAnywhere` check. Recommend adding a standalone high-value table scan for all non-SELECT statements.

These are residual gaps in C-2/C-3 fix. Flagged for fix-agent awareness.

---

## Summary table

| # | Item | Status | Confidence |
|---|---|---|---|
| C-1 | query_database users denylist | VERIFIED (open) | High |
| C-2 | write_sql INSERT block | ALREADY-ADDRESSED (9cbfd86) | High |
| C-3 | write_sql UPDATE alias bypass | ALREADY-ADDRESSED (9cbfd86) + residual CTE gap | High |
| H-1 | MODIFYING_TOOLS 4 missing tools | VERIFIED (open) | High |
| H-2 | Prompt injection via project notes | VERIFIED (open) | High |
| H-3 | UPDATE users (A-3) | Resolved via C-3 | — |
| H-4 | Role injection → 500 info-leak | VERIFIED (open), severity = DoS/info-leak not injection | High |
| H-5 | No rate limit on AI chat | VERIFIED (open) | High |
| M-1 | userWantsAction pattern 3 | VERIFIED (open) | High |
| M-2 | log_time_entries no entry cap | VERIFIED (open) | High |
| M-3 | _pendingApprovals unbounded | VERIFIED (open) | High |
| M-4 | Non-user role 500 propagation | VERIFIED (open, same fix as H-4) | High |

**Open items: 10.  Already-addressed: 2 (C-2, C-3). Residual gaps noted: 2 (MERGE INTO, CTE+UPDATE).**

=== WAVE 2 BE-AI VERIFICATION END ===
