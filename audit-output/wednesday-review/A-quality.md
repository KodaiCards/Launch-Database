# Wednesday Review — Auditor A (Quality)

Audit date: 2026-05-13. Branch: `claude/debug-previous-issues-MoN9D`. Checkpoint: `317e3c5`. HEAD: `dbba70e`.

---

## Per-commit verdict

| SHA | Date | Classification | Summary | Files | Concerns |
|-----|------|----------------|---------|-------|----------|
| `ffc3847` | 2026-05-11 | REGRESSION-PATCH | Fixes migration 0023 `MIN(uuid)` not supported by PostgreSQL | `migrations/0023_ec_rollup_linkage.sql` | Fix is correct; caused by RUS-Fix `87cff55` |
| `e493200` | 2026-05-11 | SOLID (mislabeled "x") | Wave 1.5 bulk fix: 8+ ungated endpoints, token-from-body removal, logout `tokens_invalid_after` bump | `auth.js`, `public/login.html`, 10 route files | Introduced regression in `jobs.js` (no `requireAuth` destructure); fixed next commit |
| `cafa438` | 2026-05-11 | REGRESSION-PATCH | Hotfix `routes/jobs.js`: missing `requireAuth` destructure caused Railway boot crash (ReferenceError) | `routes/jobs.js` | Caused by `e493200`. Fix is correct and minimal |
| `c323f54` | 2026-05-11 | SOLID (mislabeled "c") | Wave 2 BE-AI: actor binding to `executeTool`, `update_engineering_contract` → DESTRUCTIVE set, `advance_permit_stage` project-type guard | `routes/ai.js` | `update_engineering_contract` already confirmed in DESTRUCTIVE set; actor fallback `toolInput.updated_by \|\| 'AI'` is safe last-resort only |
| `2c3e0e9` | 2026-05-11 | SOLID (mislabeled "c") | Wave 2 BE-AI: `log_time_entries` 100-entry cap with array guard | `routes/ai.js` | Correct. Cap check fires before any DB work |
| `05fe2ba` | 2026-05-11 | TEMP-PATCH (partial) | Wave 3 FE-A11y partial: undo bar `role=status`, skip-nav link, `<main>` landmark, nav-tab ARIA roles + `aria-controls` | `public/admin.html` | Skip-nav rendered without CSS; `aria-controls` targets exist and match. `aria-selected` is hardcoded to `false` for all non-Dashboard tabs and won't update dynamically — requires JS fix. `<main>` tag change breaks no existing JS selectors. |
| `dbba70e` | 2026-05-11 | SOLID (mislabeled) | Wave 2 BE-AI v3: `bulk_delete_projects` transaction wrap, injection markers, `uploadStore` owner binding, MAX_ITERATIONS warning, `log_time_entries` cap (already in `2c3e0e9` — see below) | `routes/ai.js` | MAX_ITERATIONS warning appended to `finalText` BEFORE the model's last text blocks are appended, so warning ends up mid-response. Minor ordering defect. Injection markers logic bypasses `userWantsAction` correctly. `2c3e0e9` and `dbba70e` both add `log_time_entries` cap — the `dbba70e` version supersedes with a stronger check. |

---

## Regressions caused by prior work

### 1. `cafa438` ← regression from `e493200`

**Original commit:** `e493200` (Wave 1.5 ungated-endpoint sweep)
**Bug:** Added `requireAuth(...)` calls to `routes/jobs.js:410` and `routes/jobs.js:419` without adding `const requireAuth = (mw && mw.requireAuth) || ...` destructure. The destructure pattern is used by every other route that was fixed in the same commit (budgets, clients, concentrators, contracts, etc.) — it was simply missed for jobs. Railway crashed at boot with `ReferenceError: requireAuth is not defined`.
**Fix in `cafa438`:** Added the missing destructure line. Fix is correct, minimal, no side effects.
**Status:** Fully resolved. No further action needed.

### 2. `ffc3847` ← regression from `87cff55`

**Original commit:** `87cff55` (RUS-Fix CRITICAL: EC-Linkage, migration 0023)
**Bug:** Pass-3 backfill in `migration 0023` used `MIN(engineering_contract_id)` to deduplicate rollups by EC. PostgreSQL does not support `MIN`/`MAX` aggregates on `uuid` type. Migration failed at startup, blocking the EC-linkage backfill.
**Fix in `ffc3847`:** Changed to `(array_agg(engineering_contract_id))[1]`. The `HAVING COUNT(DISTINCT ...) = 1` guard guarantees the group contains exactly one distinct value, so `array_agg(...)[1]` returns the correct UUID.
**Status:** Fix is correct. The `HAVING` guard prevents any ambiguity. No further action needed.

---

## Hacks / temp patches that need proper redo

1. **`aria-selected` hardcoded false on non-active tabs** — `public/admin.html:651-660` (commit `05fe2ba`)
   - Current: All `<a role="tab">` elements other than Dashboard have `aria-selected="false"` as a static attribute.
   - Should be: `showView()` JS function must toggle `aria-selected` on the active tab to `"true"` and all others to `"false"` dynamically, matching the `.active` CSS class logic.
   - Suggested wave: Wave 3 FE-A11y (this is an a11y item, should be in the existing canonical list).

2. **`05fe2ba` skip-nav has no CSS in the commit** — Fixed by `8933a99` on main, but `8933a99` is not present on `claude/debug-previous-issues-MoN9D`. The current branch HEAD has a `.skip-nav` link in the DOM but no CSS definition for that class, making it a permanently visible unstyled link at the top of every admin page.
   - File/line: `public/admin.html:587` (the link) — missing `.skip-nav { position: absolute; ... }` CSS
   - Should be: CSS for skip-nav focus state must land on this branch before the page is used.
   - Suggested wave: Wave 3 FE-A11y fix (critical — currently breaking the visual layout for all admin users).

3. **`2c3e0e9` log_time_entries cap duplicated by `dbba70e`** — `routes/ai.js` around lines 1381-1393 (from `2c3e0e9`) and the same code re-applied in `dbba70e`. They are functionally identical. The second application supersedes and the earlier version is a dead code path if `dbba70e` is applied after.
   - Status: No functional harm — the final state has the cap. But it means `2c3e0e9` was committed prematurely before the larger Wave 2 block.
   - Risk: low. The code is correct in the final state.

4. **MAX_ITERATIONS warning ordering defect** — `routes/ai.js:2387-2396` (dbba70e)
   - Current: `finalText += '\n\n⚠️ **Reached iteration limit.**...'` is appended at line 2390, then `lastTextBlocks` from `response.content` are appended at lines 2395-2397. Result: warning appears in the middle of the response, before the model's final summary text.
   - Should be: warning should be appended AFTER the final text blocks loop (after line 2397).
   - Suggested wave: Wave 2 BE-AI remainder (low effort, one-line move).

---

## Wave 2 BE-AI status (dbba70e)

The canonical Wave 2 BE-AI list has 18 items. Commit message claims 5 items addressed in this commit, and acknowledges 3 more as "already done":

**Addressed in this commit batch (c323f54 + 2c3e0e9 + dbba70e):**
1. `update_engineering_contract` → DESTRUCTIVE_AI_TOOLS (c323f54 — confirmed in code at line 1984)
2. `advance_permit_stage` project-type guard (c323f54 — confirmed at lines 1426-1442)
3. Actor binding propagated to `executeTool` (c323f54 — confirmed, both approval and immediate paths)
4. `log_time_entries` 100-entry cap with error guidance (2c3e0e9 + superseded by dbba70e)
5. `uploadStore` owner_id binding on upload + all three access paths (dbba70e — confirmed)
6. Injection markers wrapping user messages (dbba70e — confirmed; `userWantsAction` uses pre-marker messages correctly)
7. `bulk_delete_projects` transaction atomicity — BEGIN/COMMIT/ROLLBACK (dbba70e — confirmed)
8. MAX_ITERATIONS warning to user (dbba70e — confirmed, minor ordering defect noted above)

**Acknowledged already done (per commit message):**
- `bulk_create_projects` rollup billing null coercion — confirmed in `5e22c27` (on a parallel path, merged into main but NOT present in `claude/debug-previous-issues-MoN9D`). **This item is NOT on the current branch.** It is on main only.

**Still open from Wave 2 BE-AI canonical list (confirmed NOT in any commit on this branch):**
- `bulk_create_projects` partial-failure atomicity — explicitly deferred in commit message ("non-trivial restructure")
- Any remaining actor-binding items not covered by the above (e.g., `auditTimeEntry` call actor — commit message says this may have been a hallucination, and `grep` confirms no `auditTimeEntry` calls exist in `ai.js`)

**Net count:** 8 of the Wave 2 BE-AI items appear to be addressed in this branch's commits. The canonical total was 18; session-1 notes say several were pre-done before the wave ran (update_ec approval gate was already in DESTRUCTIVE set before c323f54, per earlier session work). The exact mapping to all 18 canonical items would require the original canonical list, which was never pushed to this branch's `audit-output/` directory.

---

## Net-new bugs introduced

### CRITICAL: skip-nav CSS missing on this branch

Commit `05fe2ba` adds `<a href="#main-content" class="skip-nav">` to `admin.html` body but there is no `.skip-nav` CSS class defined in admin.html's `<style>` block. The class is defined on `main` branch in commit `8933a99` but that commit was never cherry-picked or merged into `claude/debug-previous-issues-MoN9D`. Every admin user currently sees an unstyled plaintext link "Skip to main content" rendered at the top of the page DOM, above the undo bar — it is visible in the normal layout.

This is a visual regression affecting all admin users.

**Fix required before demo:** Apply the `.skip-nav` CSS (and `.sr-only` utility) from `8933a99:public/admin.html` to this branch.

### MINOR: `aria-selected` not dynamically managed

Static `aria-selected="false"` attributes on non-active nav tabs (added in `05fe2ba`) are never updated by the `showView()` JS function. Screen readers will announce "Dashboard tab, selected" correctly on initial load, but clicking another tab will not update `aria-selected="true"` on the new active tab or `"false"` on the previous one. This leaves ARIA state out of sync with visual state after any tab switch.

Not a regression for sighted users. Regression for AT users relative to the pre-`05fe2ba` state (where there were no ARIA role/state claims at all — wrong but not contradictory).

### LOW: `bulk_create_projects` rollup billing fix absent from this branch

Commit `5e22c27` (which fixes rollup billing coercion in `bulk_create_projects`) is on main but not on `claude/debug-previous-issues-MoN9D`. If the AI uses `bulk_create_projects` with `is_rollup: true`, rollup containers will incorrectly receive billing fields (`billing_type='hourly'`, `billing_rate=0`) instead of `NULL`.

---

*Word count: ~1430*

=== REVIEW-A END ===
