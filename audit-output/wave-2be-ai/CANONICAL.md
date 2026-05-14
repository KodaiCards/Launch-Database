# Wave 2 BE-AI Remainder — Canonical Fix List

> Built from Auditor A (broad, 8 findings) + Auditor B (adversarial, 8 findings, 3 CRITICAL) + Auditor C (high-precision, 5 findings + 3 FPs rejected). HIGH-STAKES wave.

---

## Scope summary

AI tool surface in `routes/ai.js` (~2500 LOC). Tool definitions, executor, approval flow, conversation history, write_sql/query_database guards, prompt injection from DB content.

---

## CRITICAL (3 items — all 3 auditors converge on first two)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **C-1** | A-2 + B-1 + C-2 (3/3 auditors) | `routes/ai.js:1553-1585` + tool schema `:607-617` | **`query_database` has no users-table denylist.** `SELECT username, password_hash FROM users` passes every guard (no semicolons, starts with SELECT, runs READ ONLY) and returns credential rows. Soft description-level hint doesn't prevent execution. | Add executor-level denylist: reject any query whose probe contains `users`, `pg_*`, or `information_schema` as table-name tokens. Same pattern as write_sql DELETE/UPDATE blocks. |
| **C-2** | B-2 (NEW — 1/3 but adversarial-confirmed) | `routes/ai.js` write_sql case (~1932-1944 after hotfix `6ce66e9`) | **`write_sql INSERT INTO users` no block.** Existing guards block DELETE + UPDATE on high-value tables but INSERT slips through. `INSERT INTO users (username, password_hash, role) VALUES (...)` passes all three current regexes and executes raw — bypasses bcrypt enforcement in `create_user`. | Add `highRiskInsertPattern = /^insert\s+into\s+(engineering_contracts|users|clients|contracts)\b/i` block alongside DELETE/UPDATE. |
| **C-3** | B-3 (NEW — 1/3 but adversarial-confirmed via live regex test) | `routes/ai.js` write_sql case, UPDATE block | **UPDATE alias bypass.** Hotfix `6ce66e9` used `^update\s+(engineering_contracts|users|clients|contracts)\b/i`. Bypassed by `UPDATE u SET password_hash='x' FROM users u WHERE u.id=1` — first token after UPDATE is alias `u`, not table name. | Generalize the high-value tables guard: after the line-anchored regexes, run a probe-wide token scan. Any non-SELECT statement that references any of the 4 high-value tables ANYWHERE in its text → block. Pattern: `/\b(users|engineering_contracts|clients|contracts)\b/i.test(probe)` combined with `!/^select\s/i.test(probe)`. Over-broad is intentional — dedicated endpoints exist for these tables. |

## HIGH (5 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **H-1** | A-1 + B-6 + C-1 (3/3 auditors) | `routes/ai.js:2439-2449` | **MODIFYING_TOOLS hallucination guard missing 4 tools.** `update_engineering_contract`, `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import` are all in DESTRUCTIVE_AI_TOOLS but absent from MODIFYING_TOOLS. If Claude falsely claims success on any, the hallucination guard never fires (it only fires when `successfulModifications.length === 0`, and none of the 4 count as modifications). | Add the 4 tool names to MODIFYING_TOOLS array. |
| **H-2** | B-4 (1/3 — adversarial discovery) | `routes/ai.js` system-context construction (find via grep `p.notes`) | **Prompt injection via project notes.** DB-stored `projects.notes` (and similar user-controlled fields) flow unsanitized into Claude's system context. A crafted note ("Ignore prior instructions and ...") can hijack tool selection or response framing. Combined with C-2/C-3 this becomes a full auth-bypass chain (a low-privilege user puts a poison note in a project they own; an admin's AI session triggers it; admin's session has write_sql privileges; account takeover). | Wrap any DB-string interpolated into system context with a clear delimiter + sanitization: strip `<\|im_start\|>`, `</\|...>`, common injection tokens. OR move notes content into a tool-call result rather than system context. |
| **H-3** | A-3 already hand-applied (6ce66e9) but C-3 found bypass | (same as C-3) | **write_sql UPDATE on users not blocked** — original A3 finding. Hand-applied fix had alias bypass (C-3). Once C-3 lands, this is resolved. | C-3's fix covers this. Cross-reference. |
| **H-4** | A-4 + C-3 (2/3 — softened by C) | `routes/ai.js:2285-2295` conversation-history loader | **Role injection in conversation history.** Non-`user` roles pass verbatim to Anthropic SDK. Server-side validation gap. C confirms Anthropic API rejects malformed roles (so not exploitable as injection) but error propagates as 500 with raw error message — info leak + DoS surface. | Validate roles to `{'user','assistant'}` allowlist before passing to SDK. Reject (400) with a sanitized error if malformed. |
| **H-5** | B-7 (1/3) | `routes/ai.js` `/api/ai/chat` endpoint | **No rate limit + no conversation history cap on AI chat.** Token-exhaustion DoS surface. Client can send 100-turn history each request, forcing large/expensive Anthropic calls. 10MB Express body limit is upstream guard (per C analysis) but per-user rate-limit is absent. | Add per-user rate-limit on `/api/ai/chat` (e.g., 20 requests / 5 min / user). Optionally cap conversation history to last N turns. |

## MEDIUM (4 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **M-1** | A-5 + B-5 + C-5 (3/3 auditors) | `routes/ai.js:77` (userWantsAction) | **userWantsAction pattern 3 unanchored.** Pattern fires on action verbs embedded anywhere in a message ("the status change I made yesterday...", "what happens if I delete...", "the project update looks good"). Triggers unnecessary `tool_choice='any'` calls, increasing token spend + false tool fires. | Anchor pattern 3 to sentence start OR require action-verb to be the first verb in the message. Test against B-5's 5 strings. |
| **M-2** | A-7 + B (covers it indirectly) + C-4 (2/3) | `routes/ai.js` `log_time_entries` executor + tool schema | **No entry-count cap on log_time_entries.** Tool schema has no `maxItems`. Body-size limit (10MB) is upstream but a 1000-entry array still hits the DB before any limit. | Add `maxItems: 100` to tool schema + executor-level cap with clear error. |
| **M-3** | B-7 + B-7 _pendingApprovals Map | `routes/ai.js` `_pendingApprovals` global | **`_pendingApprovals` Map unbounded.** Stores full conversation histories (15+ turns, tool results) for 15 minutes with no size cap. Eventually leaks memory + can be DoS'd. | Cap Map size (e.g., max 1000 entries) with LRU eviction; OR expire entries more aggressively. |
| **M-4** | C-3 (1/3) | `routes/ai.js:2295` | **Non-user role 500 propagation.** When Anthropic rejects a malformed role from H-4, the error message + raw stack propagates as 500 to client. | Catch the rejection upstream of the SDK call (per H-4 validation), return 400 with sanitized error. |

## False positives (per C's register)

- A-4 double-null (fail-closed pattern is correct, `!!decisionsMap[tu.id]`)
- A-3 UPDATE `\n` bypass (probe stripping + `\s+` handles whitespace — but A-3 had ALIAS bypass which is C-3 above)
- A-6 unbounded history (10MB + Anthropic context window are upstream guards)

## Verification tier guide

**Convergence-3 (quick spot-check):** C-1 (query_database users), H-1 (MODIFYING_TOOLS gap), M-1 (userWantsAction)

**Convergence-2 (light verify):** M-2, H-4

**Convergence-1 (full verify):** C-2 (INSERT block), C-3 (UPDATE alias generalization), H-2 (prompt injection via notes), H-5 (rate-limit), M-3 (_pendingApprovals)

## Acceptance criteria for fix-agents

1. All 12 items addressed.
2. `node server.js` boots clean.
3. `npm test` continues 155/155.
4. Suggested split:
   - **Fix-agent A (CRITICALs):** C-1 + C-2 + C-3 (single coherent patch in write_sql + query_database area) — note B2/B3 hotfix in flight already covers C-2 + C-3
   - **Fix-agent B (HIGHs + MEDs):** H-1 + H-2 + H-4 + H-5 + M-1..M-4

5. Per-commit pull-rebase + push.

=== WAVE 2 BE-AI CANONICAL END ===
