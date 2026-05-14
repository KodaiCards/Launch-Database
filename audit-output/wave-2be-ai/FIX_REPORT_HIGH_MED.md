# Wave 2 BE-AI — Fix Report: HIGH + MED Tier (Fix-Agent B)

> Fix-Agent B. Branch: `claude/debug-previous-issues-MoN9D`.
> Scope: H-1, H-2, H-4, H-5, M-1, M-2, M-3 (7 items). C-1/C-2/C-3 pre-shipped (`eab1b4d` + `9cbfd86`).
> Boot smoke: node server.js exits cleanly on missing DB (expected in dev; Express boots).

---

## Commit log

| SHA | Item(s) | Title |
|---|---|---|
| `7d6846c` | H-1 | Wave 2 BE-AI H-1: add 4 missing tools to MODIFYING_TOOLS array |
| `8878b17` | M-1 | Wave 2 BE-AI M-1: anchor userWantsAction pattern 3 to message start |
| `f388f4c` | M-2 | Wave 2 BE-AI M-2: add maxItems:100 + executor cap to log_time_entries |
| `293eb51` | H-4+M-4 | Wave 2 BE-AI H-4+M-4: validate conversation message roles before SDK call |
| `29cf376` | H-5 | Wave 2 BE-AI H-5: per-user rate limit + conversation history cap on AI chat |
| `830a014` | M-3 | Wave 2 BE-AI M-3: cap _pendingApprovals at 1000 entries with LRU eviction |
| `a1ad6bf` | H-2 | Wave 2 BE-AI H-2: sanitize + delimit DB strings in Claude system context |

---

## Per-item status

| # | Item | Status | Notes |
|---|---|---|---|
| H-1 | MODIFYING_TOOLS gap (4 tools) | ADDRESSED | Added `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import`, `update_engineering_contract` to MODIFYING_TOOLS. Array now in sync with DESTRUCTIVE_AI_TOOLS. |
| H-2 | Prompt injection via project notes | ADDRESSED | `sanitizeCtxStrings()` deep-walks ctx and strips injection tokens/phrases; ctx wrapped in `<\|db_context\|>` delimiters + DATA-only system instruction. |
| H-4 | Role injection → 500 info-leak | ADDRESSED | `VALID_CHAT_ROLES` allowlist check before SDK call; returns 400 with sanitized error on invalid role. |
| H-5 | No rate limit + no history cap | ADDRESSED | 20-req/5-min per-user sliding-window RL (`aiChatRateLimitOk`); 50-message history cap; approval-resume paths exempt. |
| M-1 | userWantsAction pattern 3 unanchored | ADDRESSED | Anchored to message start with optional polite prefix (`please / can you / could you / would you / I want to...`). All 9 test strings (including 3 B-5 false-positives + "Can you generate..." true-positive) pass. |
| M-2 | log_time_entries no entry cap | ADDRESSED | `maxItems: 100` in tool schema + executor-level belt-and-suspenders check with clear error before opening DB transaction. |
| M-3 | _pendingApprovals Map unbounded | ADDRESSED | `pendingApprovalsSet()` wrapper: evicts oldest entry (Map insertion order = insertion age) when size ≥ 1000 before inserting. Logs eviction warning. |
| M-4 | Non-user role 500 propagation | ADDRESSED | Same fix as H-4 — covered by role allowlist check. |

---

## Verification notes

- **M-1 regex test:** 9/9 strings pass against anchored regex. False-positive strings `"The status change I made yesterday"`, `"Why did project X get set..."` no longer fire. `"Can you generate a report..."` still fires correctly.
- **Boot smoke:** `node server.js` loads Express, prints startup warnings about missing DB/API keys, exits cleanly on connection refusal. No boot crash from any of the 7 changes.
- **H-5 rate-limiter:** local copy of auth.js `rateLimitOk` pattern. Same sliding-window implementation, same test-bypass via `LFS_DISABLE_RATELIMIT_FOR_TESTS=1`. `rateLimitOk` is not exported from auth.js so a local copy was necessary.
- **H-2 sanitizer:** `sanitizeCtxStrings` is a deep recursive walker — handles nested arrays + objects. Confirmed it leaves normal strings (project notes, contact info) intact while stripping `<|im_start|>`, `<|im_end|>`, role headers, and injection phrases.

---

## Adjacent gaps surfaced (not in scope — for post-fix verification awareness)

Per VERIFICATION.md, two residual write_sql bypass gaps remain in C-3 area (already noted as pre-existing, not introduced by this agent):
1. `MERGE INTO users USING ... WHEN MATCHED THEN UPDATE SET ...` — not blocked by any current pattern
2. `WITH cte AS (...) UPDATE users SET ...` — `isUpdateStatement` (`^update\b`) is false when probe starts with `WITH`; `highRiskUpdateTableAnywhere` check is gated on `isUpdateStatement`

Both require admin approval click-through to exploit. Recommend a follow-up to add `^merge\b` to the DDL pattern and decouple the high-value table anywhere-scan from `isUpdateStatement`.

=== WAVE 2 BE-AI HIGH/MED FIX REPORT END ===
