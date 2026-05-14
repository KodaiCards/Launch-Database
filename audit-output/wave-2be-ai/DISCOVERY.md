# Phase 5 — Wave 2 BE-AI Remainder: Discovery

**Branch:** `claude/debug-previous-issues-MoN9D`
**File audited:** `routes/ai.js` (2508 lines)
**Date:** 2026-05-13

---

## Stack snapshot

`routes/ai.js` is a 2508-line Express handler encapsulating the Anthropic tool-use loop,
a two-set approval gate (`DESTRUCTIVE_AI_TOOLS` / `MODIFYING_TOOLS`), the `query_database`
read-only executor, conversation history mapping, and `userWantsAction` intent detection.
Prior Wave 2 BE-AI v3 shipped injection markers, upload owner binding, MAX_ITERATIONS warning,
and bulk-delete atomicity. Several items from the original canonical list remain open or partially open.

---

## Per-item status

### 1. `update_engineering_contract` → MODIFYING_TOOLS

**Status: PARTIALLY-SHIPPED — still has a gap**

`update_engineering_contract` was added to `DESTRUCTIVE_AI_TOOLS` (the approval gate) at line 2017:
```
// routes/ai.js:2014-2017
// update_engineering_contract was missing — the AI could mutate EC fields
// (name, program, active) without triggering an approval card. Gated now
// alongside create_engineering_contract per PROJECT_NORTH_STAR §7.
'create_engineering_contract', 'update_engineering_contract',
```

However, `MODIFYING_TOOLS` (the hallucination guard, lines 2439-2449) does NOT include
`update_engineering_contract`. The hallucination guard will silently miss a false success
claim from Claude ("I've updated the EC") if the tool didn't actually execute.

Additionally, 4 other tools are in `DESTRUCTIVE_AI_TOOLS` but absent from `MODIFYING_TOOLS`:
- `bulk_create_projects` (line 2006)
- `bulk_delete_projects` (line 2006)
- `csv_smart_import` (line 2012)
- `update_engineering_contract` (line 2017)

**Verified by reading:** `routes/ai.js:2005-2021` (DESTRUCTIVE_AI_TOOLS) and `routes/ai.js:2439-2449` (MODIFYING_TOOLS)

**Fix shape:** Add the 4 missing names to the MODIFYING_TOOLS array with a comment referencing the sync rule.

---

### 2. `userWantsAction` third regex anchor

**Status: STILL-OPEN**

The three regex patterns in `userWantsAction` (lines 69-79):
- Pattern 1 (line 69): `^(yes|yeah|...|keep going)\b` — anchored to start ✓
- Pattern 2 (line 74): `^(did you|have you|...)` — anchored to start ✓
- Pattern 3 (line 77): `\b(create|add|insert|log|update|...|generate)\b` — **NOT anchored**

Pattern 3 fires on any message containing these verbs anywhere in the string. Example:
"I saved that CSV last week, can you show me the budget?" → `\bsaved\b` fires → `tool_choice='any'`
forces an unnecessary tool call even though the user is asking a read question.

Wave 2 BE-AI v3 (`1ea79db`) did NOT change this pattern — it only added the NOTE comment
explaining that `userWantsAction` uses original (pre-injection-wrapped) messages.

**Verified by reading:** `routes/ai.js:55-81`

**Fix shape:** Add a start anchor to pattern 3, or restructure to require the verb to appear
at the start of an imperative phrase (e.g. `^(please\s+)?(create|add|...)`). Pattern should
not fire on past-tense or embedded verbs in descriptive sentences.

---

### 3. `query_database` users table blocklist

**Status: STILL-OPEN**

The `query_database` executor (lines 1553-1585) enforces:
- No multi-statement (semicolons blocked)
- First keyword must be SELECT or WITH
- READ ONLY transaction (writable CTEs blocked at Postgres level)
- 100-row result cap

There is NO blocklist for the `users` table. The tool description (line 608-616) lists
"clients, contracts, staff, projects, time_entries, ..." but does NOT list `users` — however,
this is merely a soft hint to Claude, not a code-level enforcement.

A query like `SELECT username, password_hash, email FROM users` would succeed and return
full credential rows to the AI response. The `write_sql` path blocks DELETE on `users`
(line 1932) but `query_database` has no parallel protection.

**Verified by reading:** `routes/ai.js:1553-1585` (executor), `routes/ai.js:607-617` (tool schema)

**Fix shape:** Add a denylist check before execution: if the cleaned SQL references
`users`, `pg_`, `information_schema`, or other sensitive system/auth tables, return
`{ success: false, error: 'Querying auth tables is not permitted.' }`. Alternatively, use
a Postgres role with SELECT revoked on `users`.

---

### 4. Approval double-null fail-closed

**Status: ALREADY-SHIPPED (fail-closed as implemented)**

The approval resume path (lines 2240-2264) uses:
```js
const decisionsMap = decisions || {};
const approved = !!decisionsMap[tu.id];
```

If `decisions` is missing/null → `decisionsMap = {}` → `decisionsMap[tu.id] = undefined`
→ `!!undefined = false` → tool rejected. This IS fail-closed.

If a tool ID is not in the decisions map (e.g., frontend bug omits it), it defaults to
rejected. The canonical item appears to have been addressed by the current implementation,
or was already fail-closed before the wave.

**Caveat:** There is no explicit type/shape check on `decisions` — a malformed payload
where `decisions` is a non-object truthy value (e.g. a string `"true"`) would yield
`decisionsMap = "true"` and `"true"[tu.id] = undefined` → still false (still fail-closed).
No real exploitable gap found, but a shape guard would add defense-in-depth.

**Verified by reading:** `routes/ai.js:2240-2264`

---

### 5. Conversation history validation

**Status: STILL-OPEN**

The initial path at line 2284 maps `messages` from `req.body`:
```js
conversationMessages = messages.map(m => {
  if (m.role !== 'user') return { role: m.role, content: m.content };
  // ... wrap user content in injection markers
});
```

Gaps:
1. **Role injection:** `m.role` is passed through without validation. A client sending
   `m.role = 'system'` produces a `{ role: 'system', content: ... }` block in
   `conversationMessages`, which the Anthropic SDK would forward verbatim, allowing
   client-side system prompt injection. Valid roles should be restricted to `['user', 'assistant']`.

2. **No message count cap:** No `MAX_HISTORY` limit. A client could send thousands of
   historical messages, inflating token cost and potentially hitting API limits with
   no server-side protection.

3. **No content length check per message:** Individual message content strings have no
   max length enforced. A single extremely large message could cause oversized payloads.

4. **No `log_time_entries` entry count cap:** The `log_time_entries` executor (lines 1468-1494)
   iterates `toolInput.entries` with no cap — the tool schema has no `maxItems` constraint.
   Despite "log_time_entries cap" appearing in the v3 commit message (`1ea79db`), no cap
   was found in the executor code. This may be the item that was intended but not landed.

**Verified by reading:** `routes/ai.js:2284-2301` (message mapping), `routes/ai.js:1468-1494` (log_time_entries)

---

## Coverage gaps

- Did not audit the frontend AI chat JS (`public/js/ai-chat.js` or equivalent) — approval decision submission and message serialization could have client-side gaps.
- Did not audit `routes/_helpers.js` or `routes/_csv_stage.js` for side-effects called by AI tools.
- `csv_smart_import` executor was not read end-to-end — only confirmed its absence from MODIFYING_TOOLS.
- SSE / streaming path not in scope (non-streaming confirmed by code at line 2319-2328).

---

## Recommended audit framings for next pipeline

Wave class: **High-stakes** (AI tool surface, PII exposure, approval gate). Use 3 auditors:

1. **Broad fresh-eyes** — full `routes/ai.js` scan, all 5 items, no priming.
2. **Adversarial** — focus on: (a) query_database SQL injection bypasses, (b) role injection via conversation history, (c) any path where `tool_choice='any'` + loose userWantsAction fires an unintended destructive tool. Hunt for multi-step gaps.
3. **High-precision conservative** — confirm/reject each finding with "pre-submit reject check." Focus on the approval flow (items 4 + 5) and the MODIFYING_TOOLS sync gap (item 1).

Verification red-team: mandatory. Tier by overlap count; items 3 and 5 are the highest-risk open items.

=== PHASE 5 BE-AI DISCOVERY END ===
