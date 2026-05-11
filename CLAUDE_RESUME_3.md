# Claude Resume 3 — 2026-05-11 (afternoon, Monday demo day)

> **Read this top-to-bottom before doing anything.** Third handoff in one day. The orchestrator paused at the Wave-1.5 dispatch point (CLAUDE_RESUME.md), the next Claude shipped Wave 1.5 + UI-A but broke production (CLAUDE_RESUME_2.md), and this one ships a flurry of bug fixes + Wave 2 FE-Crit + a new feature spec. Read CLAUDE_RESUME_2.md first for the "what broke and why" context, then this for "what shipped after."

## Hard operating rules — READ FIRST

These were violated repeatedly today. Don't repeat.

1. **MANAGER NEVER WRITES CODE.** The user explicitly enforced this. The Opus manager only: reads diffs, dispatches Sonnet sub-agents, verifies their diffs, commits + pushes (these are non-code manager ops). Even one-line hotfixes go through an agent. The "trivial inline fix" carve-out in PROJECT_NORTH_STAR.md is **overridden** by this rule. See `memory/feedback_manager_never_codes.md` for the rule verbatim.
2. **Sub-agent commit pattern:** agents EDIT files, smoke-check, run `git status` / `git diff --stat`, and **report back**. They do NOT commit or push. The manager commits + pushes after reading the diff. This sidesteps the `git commit` permission wall that has blocked three agent dispatches today.
3. **Single-line commit messages** with multiple `-m` flags. No heredocs. No `--no-verify`, no `--force`, no `--amend`. Unsigned via `git -c commit.gpgsign=false commit -m "..."`.
4. **Direct-to-main** per PROJECT_NORTH_STAR §2. Railway auto-deploys. CI gates each push.
5. **NO commit messages of "x" / "c" / placeholder strings.** Two such commits today (e493200, c323f54) cost real debugging time.
6. **Smoke-check every agent's diff** before committing — they have hallucinated work and crashed Railway in a boot loop (jobs.js missing the `requireAuth` destructure was the case study).
7. **DO NOT touch `.claude/settings.json` or `.claude/settings.local.json`** unless explicitly fixing the permission wall — and even then, prefer the manager-commits-for-agents pattern. Sub-agents that propose settings edits should be redirected to just-do-the-code.

## What shipped today (since CLAUDE_RESUME_2.md)

| SHA | Description |
|---|---|
| `4c751c5` | Hotfix: migration 0023 RAISE format (`%%` → `%`); restore body token on login + change-password (Wave 1.5 over-corrected and broke the sessionStorage fallback) |
| `6b87ff5` | Test fix: `project_tree_delete.test.js` sends `{confirm:true}` after Wave 1.5 cascade-preview gate |
| `ab4136c` | Delete-fix: removed dry-run-by-default gate from `DELETE /api/projects/:id` and `/with-hours` (single-row deletes — undo-bucket is the safety net). `/with-tree` still requires `{confirm:true}` (whole-subtree cascade) |
| `e7c0d1e` | CI-Fix: removed the `if: cache-hit != true` gate on Playwright install step — stale cache was returning a mismatched Chromium build number, browser smoke tests had been failing on every push |
| `8402283` | Wave 2 FE-Crit (13 items): stale `launchfiber-splicematrix.xyz` → `/splice.html` in admin + design portals; billing-history tree gets its own `makeTreeState`; SSE hooks on permits + design + potential-permits tabs; double-submit guards on Save Project / Advance Permit / Advance Design / Submit Potential Permit; actor pre-fill on potential-permits modal; `persistFilter` dispatches change event after restore (fixes hrs-period → month-picker visibility); `confirmDeleteProject` does dry-run preview → confirm dialog → confirmed delete; `overlay_modal` escape-key + MutationObserver cleanup; try/catch around `loadPermits` + `loadDesign` so fetch errors show an error row instead of blanking the tab |
| `bde0e28` | Project-Modal-Fix: BAU/Other no longer shows Construction Contract field (clients.show_contract bleed-through); newly-created ECs live-refresh into the project-modal dropdown via SSE so the user doesn't have to reopen the modal |

CI is green again on backend smoke tests as of `6b87ff5`. The Playwright browser tests should pass on the next push after `e7c0d1e` once a fresh runner picks up the workflow.

## What's broken right now (USER-REPORTED, still open)

None as of last check-in. The "half the program doesn't work" complaint resolved after `4c751c5` (restored body token = sessionStorage Bearer fallback works = api.js authenticated). The delete-everything complaint resolved after `ab4136c`. The BAU contract field issue resolved after `bde0e28`.

The remaining two user-flagged items from the demo-day testing have been classified as **data-level, not code**:

1. **"County Permitting" job doesn't show up under BAU program.** This is because migration 0006 classified it as `program_scope = 'rus'` (backfill condition was `for_psc_client = TRUE`). User needs to go to Settings → Jobs → Edit "County Permitting" → change `program_scope` from `rus` to `shared`. Code path is correct.
2. **"New EC under PSC 217 rollup doesn't appear in Projects tab."** Not a bug — Projects tab shows `projects` rows; an EC with no leaf projects has no rows to show. The new EC appears correctly in Settings → Engineering Contracts. If the user expects an automatic rollup container to be created when an EC is added, that's a feature, not a bug.

## What's in flight / queued

| Item | Status | Notes |
|---|---|---|
| **EC WO# + Service Areas feature** | ⏳ dispatched | User asked 2026-05-11 PM. New schema work — see `memory/feature_ec_wo_service_areas.md`. Adds WO#/Service Area as EC-scoped lists. Open questions in the memory file. |
| **Wave 3 BE-Perf** | ⏳ dispatched | 22 items: 9 indexes, dashboard `ytd_revenue` materialization, N+1 fixes in billing.js + invoice_generator.js, `updateProjectHours` batch, `collectProjectTree` CTE, LIMITs, Puppeteer browser pool, async `fs` in admin endpoints |
| Wave 3 FE-A11y | 📋 queued | 25 items: 47+ modals need `role="dialog"` + `aria-modal` + focus trap + focus return; 29 close-button `aria-label`; form labels; nav-tab ARIA; live regions for undo bar + login error; focus rings; skip-nav; `<main>` landmark; calendar keyboard; color contrast bumps |
| Wave 2 BE-AI | 📋 queued (17 items remaining) | 1 item shipped serendipitously via the "Update ai.js" commit (5e22c27 — `bulk_create_projects` rollup billing). Sub-agent dispatches have failed twice (both got stuck asking permission to modify `.claude/settings.json`). Future dispatch must use the **manager-commits-for-agents** pattern (instructions in the brief). Items: `update_engineering_contract` approval gate, transactions on bulk delete, actor binding to `req.user.staff_id`, injection markers around user-supplied content, `uploadStore` user binding, `advance_permit_stage` project-type check, MAX_ITERATIONS warning, `log_time_entries` cap, plus ~9 unnamed items the orchestrator's verification flagged. |
| OSP-Merge | 📋 queued | Strategy A from CLAUDE_RESUME.md: apply 12 OSP red-team FIXes in `kodaicards/osp-design-training` first; Vite build; copy `dist/` into `public/training/`; add Express static-serve route behind `requireAuth()`; inject `window.__USER__` shim. Cross-repo work — needs a different sub-agent path. |
| Wave 1.6 follow-ups | 📋 queued | Splice SSE per-event session re-validation; `routes/splice.js` (~98 instances) + `routes/admin.js` still leak `e.message` in catch blocks |
| Manual job-assignment feature | 📋 queued (post-demo) | User asked 2026-05-11. **Override semantics confirmed**. See `memory/feature_manual_job_assignment.md` for the schema sketch. |
| Cleanup | 📋 queued (last) | Apply `CLEANUP_CANDIDATES.md` deletions |

## Sub-agent dispatch patterns (cheat sheet)

These worked today. Copy these to spec new agents.

### Pattern A — Edit-and-Report (use this by default)

```
You are X-Fix. Implementer agent. Repo `C:\Users\Carter Trantham\Desktop\Launch Database`, branch `main`.

## Symptom / scope
<concrete bullet list of what to fix, with file paths and line numbers when known>

## Rules
1. DO NOT touch `.claude/settings.json` or `.claude/settings.local.json`.
2. DO NOT commit or push. Edit files only. Manager handles git ops.
3. SMOKE-CHECK every file by re-reading after edit. Verify identifiers in scope. (jobs.js missing-destructure crashed prod earlier today.)
4. Stay strict in scope. No refactors.
5. Pull first: `git pull --ff-only`.

## Reporting
- Files touched + lines changed
- Smoke-check result per file
- `git status` + `git diff --stat` verbatim at end
```

### Pattern B — Read-only Recon

```
You are X-Recon. Read-only. <objective>. <steps>. Report in under N words. Do NOT modify any files.
```

Both have worked today. Pattern A's "don't commit" instruction is what unblocks the permission wall.

## Memory rules current as of this handoff

- `feedback_manager_never_codes.md` — absolute rule, manager never edits
- `feedback_no_worktrees.md` — don't use git worktrees
- `feature_manual_job_assignment.md` — override semantics, post-demo
- `feature_ec_wo_service_areas.md` — new feature dispatched today
- Plus 4 earlier feature/reference memories from prior sessions

Read `memory/MEMORY.md` for the full index.

## Other docs

- `CLAUDE_RESUME.md` — orchestrator's original pause-state (Wave-1.5 dispatch point)
- `CLAUDE_RESUME_2.md` — first afternoon handoff, captures the Wave-1.5 fallout + bug triage
- `CLAUDE_RESUME_3.md` — this file
- `PROJECT_NORTH_STAR.md` — domain primer + conventions (authoritative)
- `CLAUDE.md` — orchestrator's consolidated context (57KB, dense; per-wave canonical lists NOT in it — they were in `/home/user/manager-notes.md` which is gone)
- `CLEANUP_CANDIDATES.md` — deletion list for the final Cleanup task
- `HANDOFF_NEXT_PM.md` — earlier PM rules; manager-pattern verbatim still applies

## Intentions for the next Claude

1. **Watch the in-flight agents.** EC WO#/SA feature + Wave 3 BE-Perf are running in background. Both told to edit-and-report. When they return, verify diff, commit, push.
2. **Then dispatch Wave 3 FE-A11y.** Same pattern. 25 items, mostly mechanical ARIA additions.
3. **Then either OSP-Merge OR Wave 2 BE-AI** — pick based on what the user prioritizes for demo. OSP-Merge unlocks the Training tile (visible). Wave 2 BE-AI is safety hardening on the AI assistant (less demo-visible). User said "continue as you see fit" — default to OSP-Merge for visible demo win.
4. **Wave 1.6 + Cleanup** are end-of-list polish. Skip if time is tight.
5. **The two features (manual job-assignment + EC WO#/SA fields)** — the user explicitly asked for both today. EC WO#/SA is in-flight; manual job-assignment is post-demo per user pacing.
6. **DO NOT INLINE-EDIT CODE.** Even if it's faster. Even if "this is just a one-liner." The user enforced this rule explicitly. If you find yourself reaching for Edit/Write on a non-doc file, STOP and dispatch.

Trust the agent dispatches. Verify their diffs (manager work). Commit + push (manager work). Update this doc when work lands.
