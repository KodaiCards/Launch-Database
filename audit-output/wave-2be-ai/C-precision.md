# Wave 2 BE-AI Auditor C — High-Precision Conservative
**Framing:** High-precision conservative. Only confirmed-exploitable bugs flagged.  
**Scope:** `routes/ai.js` (~2508 LOC). Items A1–A7 per DISCOVERY.md.  
**Date:** 2026-05-13  

---

## Stack snapshot (≤80 words)

`routes/ai.js` hosts the Anthropic tool loop, two approval sets (`DESTRUCTIVE_AI_TOOLS` / `MODIFYING_TOOLS`), `query_database` executor, `write_sql` executor, conversation history mapping, and `userWantsAction` intent detection. Wave 2 BE-AI v3 landed bulk-delete atomicity, injection markers, upload owner binding, MAX_ITERATIONS warning ordering fix, and a symmetric UPDATE block on `write_sql`. Several items remain open. Confirmed by node simulation + line reads below.

---

## Findings

| # | Sev | Category | File | Lines | Snippet | Issue | Fix shape | Confidence | Pre-submit reject check |
|---|-----|----------|------|-------|---------|-------|-----------|------------|------------------------|
| C1 | HIGH | Logic / Hallucination guard | routes/ai.js | 2449–2459 | `const MODIFYING_TOOLS = ['log_time_entries', ... 'deactivate_user'];` | 4 tools in `DESTRUCTIVE_AI_TOOLS` are absent from `MODIFYING_TOOLS`: `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import`, `update_engineering_contract`. If Claude claims "I've bulk-created 50 projects" without calling the tool, the hallucination guard fires only when `successfulModifications.length === 0` AND at least one claim-verb appears — but none of the 4 absent tool names count as successful modifications. Guard silently passes false claims for these 4 tools. | Add all 4 to `MODIFYING_TOOLS`. Comment "keep in sync with DESTRUCTIVE_AI_TOOLS." | HIGH | Could reject if: the hallucination guard protects against false *text* claims and these tools are destructive enough that the approval gate already prevents silent execution. Rejected: the guard targets the case where Claude SAYS it ran the tool but did NOT — approval gate doesn't help there. Confirmed exploitable. |
| C2 | HIGH | PII / Auth data exposure | routes/ai.js | 1553–1585 | `const { rows } = await client.query(sqlClean);` | `query_database` executor runs any `SELECT` with no table denylist. `SELECT username, password_hash, email FROM users` succeeds and returns credential rows. Tool schema hint (line 612) lists safe tables only as soft guidance — code-level enforcement absent. `write_sql` blocks DELETE and UPDATE on `users` (lines 1932, 1942) but `query_database` has no parallel block. | Add pre-execution check: if `sqlClean` references `users`, `pg_catalog`, or `information_schema`, return `{ success: false, error: 'Querying auth tables is not permitted.' }`. | HIGH | Could reject if: the AI would never SELECT from `users` because the system prompt doesn't mention it. Rejected: prompt injection or a curious admin can override system prompt guidance. The `write_sql` path already treats `users` as special — asymmetry is the bug. |
| C3 | MEDIUM | Unvalidated input / Role injection | routes/ai.js | 2294–2295 | `if (m.role !== 'user') return { role: m.role, content: m.content };` | Non-user roles (e.g. `role: 'system'`) from `req.body.messages` are passed verbatim to Anthropic SDK. The Anthropic API rejects unknown roles in the `messages` array with a 400, so actual system-prompt injection via this path is prevented at the API level. However: (a) The API error propagates through the catch at line 2504 as a 500 with the raw Anthropic error message included in the response body — minor info leak; (b) A client can craft a DoS by sending malformed roles to force repeated API error responses; (c) The correct fix (allowlist `['user','assistant']`) is 2 lines and eliminates the surface entirely. | Validate `m.role` against `['user', 'assistant']` before mapping. Drop or reject messages with invalid roles. | MEDIUM | Could reject if: Anthropic's API already rejects bad roles server-side, so no injection succeeds. Partially accepted: the injection itself fails but the error path leaks API error details and is DoS-able. Downgraded from HIGH — no successful injection — but still exploitable for info-leak and DoS. |
| C4 | MEDIUM | Unbounded resource / Cost amplification | routes/ai.js | 1468–1494, 558–579 | `for (const e of toolInput.entries) { ... }` / schema: no `maxItems` | `log_time_entries` iterates `toolInput.entries` with no cap. Schema has no `maxItems`. An admin (or prompt injection that clears an approval) could submit 10,000 entries — all run inside a single transaction, each doing an INSERT + `updateProjectHours` per unique project_id (line 1484). DoS / DB saturation risk, not a data integrity issue. Express body limit is 10MB (server.js:79) which limits raw payload but still allows thousands of entries. | Add `maxItems: 500` to tool schema entries array. Add server-side guard: `if (!Array.isArray(entries) || entries.length > 500) return { error: 'Too many entries...' }`. | MEDIUM | Could reject if: this requires admin access and admin is trusted. Partially accepted: prompt injection via a crafted project name/note could trigger unexpected tool calls. Tool schema cap is hygiene regardless. |
| C5 | LOW | Logic / Forced tool call false-positives | routes/ai.js | 77 | `` /\b(create|add|insert|log|update|...|generate)\b/i `` | Pattern 3 of `userWantsAction` fires on any message containing these verbs — no start-of-sentence anchor, no imperative context check. Confirmed false positives: "the project **update** looks good to me", "I just want to **start** by saying thank you", "I like this **build**", "the **run** went well" — all trigger `tool_choice='any'`, forcing the model to emit a tool call even for read-intent messages. Net effect: unnecessary tool calls, confusing UX, potential for accidental destructive tool proposals if the model picks a DESTRUCTIVE tool to satisfy `tool_choice='any'`. | Add start anchor or imperative-context requirement: `/(^|[.!?]\s+|\bplease\s+)(create|add|...)\b/i`. Alternatively restructure as verb-at-start: `^(please\s+)?(create|add|...)`. | LOW | Could reject if: all DESTRUCTIVE tools still gate through the approval card, so even a falsely-forced tool call can't execute silently. Accepted with low severity: the UX noise + "model proposes destructive tool the user didn't want, user has to reject" is a real friction cost. |

---

## Verified clean (negative findings)

- **A3 write_sql UPDATE fix (6ce66e9):** `highRiskUpdatePattern` runs on `probe` (whitespace-stripped). Tested `UPDATE\nusers`, `UPDATE\tusers`, `UPDATE  users`, `/* comment */ UPDATE users`, `-- comment\nUPDATE users` — all blocked. Fix is correct. (Verified: lines 1912–1944 + node simulation)
- **A4 approval double-null fail-closed:** `const approved = !!decisionsMap[tu.id]` — `undefined`, `null`, `false`, and missing key all resolve to `false`. Non-object `decisions` edge case also resolves false. Fail-closed. (Verified: lines 2250–2261)
- **A6 history cap — upstream limits:** Express body limit is 10MB (server.js:79). Anthropic API enforces context-window limits server-side (200K token max for claude-sonnet-4-6). Both act as upstream guards, though neither is a purpose-built message-count cap. Downgraded from HIGH — practical exploitation requires >10MB JSON, not realistic per-session. No server-side message-count cap exists but exploitation risk is low given admin-only access + body limit.
- **MAX_ITERATIONS ordering:** warning appended after `lastTextBlocks` loop at line 2439. Correct per DISCOVERY.md. (Verified: lines 2431–2442)
- **tool_choice='any' semantics:** Per Anthropic SDK documentation and code behavior at lines 2324–2328 and 2341–2348, `tool_choice='any'` forces the model to emit at least one tool_use block (it cannot return text-only). This is the intended "force a tool call" behavior. The concern (A5) is about which tool it picks when forced — not about whether a tool fires.

---

## False-positive register

| Item | Claim | Verdict | Reason |
|------|-------|---------|--------|
| A4 double-null | approval fail-open when decisions=null | FALSE POSITIVE | `decisions || {}` → empty object → all keys undefined → all `!!undefined = false` → all rejected. Fail-closed confirmed. |
| A3 UPDATE bypass via `UPDATE\nusers` | regex misses newline-separated UPDATE | FALSE POSITIVE | Pattern uses `\s+` which matches `\n`, `\t`, spaces. Probe-stripping runs before pattern test. All variants blocked. |
| A6 history cap severity HIGH | unbounded history is a critical DoS | OVERSTATED | 10MB body limit + Anthropic context window cap = two upstream guards. No server-side message-count, but HIGH severity overstated for admin-only endpoint. |

---

## Coverage gaps (≤120 words)

- Did not read `public/js/ai-chat.js` — frontend serialization of `messages` and `decisions` not audited. The role-injection path (C3) originates in the frontend; a client-side role allowlist would be defense-in-depth but wasn't in scope.
- `csv_smart_import` executor not read end-to-end — confirmed absence from `MODIFYING_TOOLS` (C1) but did not audit for internal vulnerabilities.
- `routes/_helpers.js` `updateProjectHours` and `collectProjectTree` called from tool executors — not audited for N+1 or transaction safety.
- Conversation history validation: only validated role-pass-through and absence of message-count cap. Did not audit content-length per message or binary content blocks.

=== WAVE 2 BE-AI AUDITOR C REPORT END ===
