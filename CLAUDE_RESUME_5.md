# Claude Resume 5 — 2026-05-12 (post-midnight Tuesday)

> Fifth handoff. Read prior handoffs in order — `CLAUDE_RESUME.md` → `CLAUDE_RESUME_2.md` → `CLAUDE_RESUME_3.md` → `CLAUDE_RESUME_4.md` → this one. The wave train is essentially complete. Remaining queue is polish + post-demo features.

## TL;DR — system state at end of session

The Launch Database admin/portals/Splice/Training app on Railway is in a substantially better state than 24 hours ago:

- **All demo-critical bugs fixed.** Login works, delete works, project create works, tree behavior fixed, BAU/non-RUS programs no longer ask for Construction Contract, new ECs live-refresh into project modals, perf indexes deployed.
- **OSP Training tile lit up.** Real React app committed at `1a170de`; serves from `/training/` behind `requireAuth()`.
- **Wave 1.5 / 1.6 / 2 / 3 BE-Perf / 3 FE-A11y all shipped** (some items deferred per scope, all named items addressed).
- **One new feature shipped**: EC WO# + Service Areas (commit `7f3b6cb`).
- **Two new features queued** (post-demo): manual job-assignment (override semantics), EC WO/SA mirroring to portal HTMLs (in-flight at time of writing).
- **Two agents currently in flight**: `EC-WOSA-Mirror` (portal HTMLs) and `BulkAtom-Fix` (routes/ai.js bulk_create transaction).

## Hard operating rules — DO NOT VIOLATE

These were enforced explicitly by the user today.

1. **Manager never writes code.** Per `memory/feedback_manager_never_codes.md`. Even one-line fixes go through a Sonnet sub-agent. Manager only does: read diffs, dispatch agents, verify diffs, commit, push, merge, open PRs, update docs/memory. Settings.json edits are explicitly allowed for manager when fixing a permission-loop blocker.
2. **Sub-agent pattern: edit-and-report.** Agents EDIT files, smoke-check, run `git status` / `git diff --stat`, and **report back without committing**. Manager commits + pushes after reading the diff. This sidesteps the `git commit` permission wall.
3. **Single-line commit messages with multiple `-m` flags.** No heredocs (they trigger permission prompts). No `--no-verify`, `--no-gpg-sign`, `--amend`, `--force`. Use `git -c commit.gpgsign=false commit -m "title" -m "para 1" -m "para 2"`.
4. **Direct-to-main pushes** per PROJECT_NORTH_STAR §2. Railway auto-deploys. CI gates each push.
5. **No placeholder commit messages.** No "x", no "c". Every commit needs a real description. (Two such commits today cost real debugging time.)
6. **Smoke-check every agent's diff before committing.** Agents have hallucinated work and crashed Railway in a boot loop (the jobs.js `requireAuth` destructure miss). Read the diff yourself.
7. **`.claude/settings.local.json` allowlist** has been expanded with broad wildcards (`Bash(*)`, `Bash(git *)`, `Bash(gh *)`, `Bash(npm *)`, `Bash(npx *)`, `PowerShell(*)`, `Glob(*)`, etc). If sub-agents get stuck on permission prompts despite this, troubleshoot the allowlist — don't bypass the rule by inline-editing.

## All commits shipped this session (chronological, newest first)

| SHA | Description |
|---|---|
| `25e087e` | **Wave 1.6**: error-message sanitization in `routes/splice.js` (98 leaks) + `routes/admin.js` (22 leaks). Pattern: `console.error('[tag]', e.message); res.status(500).json({ error: 'Failed to action.' })`. Splice SSE per-event session re-validation was already in commit `1332a9a` — no further work needed. |
| `c0e4c65` | **Wave 3 FE-A11y round 2**: focus trap + return in `public/js/overlay_modal.js`; global `*:focus-visible` ring + `.sr-only` + `.skip-nav` in `app-shell.css`; skip-nav links + `<main id="main-content">` landmarks on admin.html + launcher.html; form labels on design/permitting/timeclock modals (~30 pairs); undo bar `role=status aria-live=polite`. |
| `1a170de` | **OSP-Merge Option 3**: pre-built Vite dist committed to `public/training/` (assets/index-*.js + .css + index.html). Removed `[phases.build]` from `nixpacks.toml` — Railway just serves static files. Built locally with portable Node v20.18.0 (downloaded, used, deleted). |
| `9ae778f` | OSP build hotfix: `npm ci` → `npm install` (lockfile not in repo). Was the first Railway build failure. |
| `7ca2e3c` | **OSP-Merge Path 2**: brought OSP Vite source in-repo at `osp-training/` (62 files, 15.5k lines) + added nixpacks `[phases.build]` to build OSP on Railway deploy. Later reverted in `1a170de` (Path 3 won). |
| `ead0d98` | **OSP-Merge wiring**: Express `app.use('/training', requireAuth(), express.static(...))` + SPA fallback route + PORTAL_DEFS URL `/training.html` → `/training/`. Stub index.html until build artifacts dropped in. |
| `b3ce795` | Doc: CLAUDE_RESUME_4 — feature plans for manual job-assignment + EC WO/SA mirroring. |
| `edde65a` | **Wave 3 FE-A11y round 1**: `role="dialog"` + `aria-modal` on modals across 5 portal HTMLs; close-button `aria-label`; overlay helper polish. |
| `1ea79db` | **Wave 2 BE-AI v3** (5 items): `bulk_delete_projects` BEGIN/COMMIT/ROLLBACK transaction; injection markers around user-supplied conversation content; `uploadStore` owner_id binding; `MAX_ITERATIONS` user-visible warning; `log_time_entries` 100-entry cap. 3 items confirmed already done in repo (the orchestrator's actor-binding item appears to have been a hallucination). 1 item DEFERRED: `bulk_create_projects` partial-failure atomicity (in flight now as BulkAtom-Fix). |
| `20560fe` | **Wave 3 BE-Perf**: migration 0030 with 9 indexes (time_entries × 2, projects × 3, contracts.ec, invoice_items × 2, permit_stages partial); dashboard `ytd_revenue` cached in module-level Map with 1hr TTL; N+1 fixes in `billing.js` (batches/:id/confirm batched project fetch + close-out; bill-multiple multi-row INSERT); `collectProjectTree` BFS → single recursive CTE; LIMIT 1000 default + max 5000 on /api/time-entries + /api/projects (with `?limit=all` opt-out); admin.js sync `fs` → `fs.promises.*`. Puppeteer browser pool + `updateProjectHours` batch deferred with reasons. |
| `7f3b6cb` | **EC WO# + Service Areas feature**: migration 0031 with 2 new tables (`ec_service_areas`, `ec_work_orders`) cascading on EC delete; 8 admin-gated endpoints in `routes/engineering_contracts.js`; EC management modal in `public/js/engineering_contracts.js` (+235 lines); project modal in `public/admin.html` scopes WO/SA dropdowns by selected EC, falling back to legacy free-text/concentrators when EC has no lists. Open questions for user: seed `ec_service_areas` from existing concentrators? Mirror to design/permitting portals? (Latter is in-flight.) |
| `951d245` | Doc: CLAUDE_RESUME_3. |
| `bde0e28` | **Project-Modal-Fix**: BAU/Other no longer shows Construction Contract (`clients.show_contract` bleed-through fixed with `!effective` guard); newly-created ECs live-refresh into the project modal's EC dropdown via SSE `engineering_contract_added` event handler. |
| `8402283` | **Wave 2 FE-Crit** (13 items): stale `launchfiber-splicematrix.xyz` → `/splice.html` in admin + design; billing-history tree gets its own `makeTreeState('billing-history')`; SSE hooks on permits + design + potential-permits tabs; double-submit guards on Save Project + Advance Permit + Advance Design + Submit Potential Permit; actor pre-fill on potential-permits; `persistFilter` change-dispatch on restore; `confirmDeleteProject` does dry-run → preview → confirm flow; `overlay_modal` escape-key + MutationObserver cleanup; try/catch around loadPermits + loadDesign. |
| `e7c0d1e` | **CI-Fix**: removed `if: cache-hit != 'true'` gate from Playwright install step in `.github/workflows/test.yml`. Stale cache returned a mismatched Chromium build number on every push; browser smoke step kept failing. |
| `ab4136c` | **Delete-fix**: removed `confirm:true`-required gate from single-row `DELETE /api/projects/:id` + `/with-hours`. `/with-tree` keeps its gate (whole-subtree cascade). `?dry_run=1` still works as an opt-in. Wave 1.5's commit `286561d` had over-corrected here. |
| `6b87ff5` | Test fix: `project_tree_delete.test.js` sends `body: {confirm: true}` after the cascade-preview gate change. |
| `4c751c5` | **Hotfix bundle**: migration 0023 `RAISE NOTICE %%` → `%` (4 placeholders); restored body `token` on login + change-password responses (Wave 1.5 had removed it, breaking sessionStorage Bearer fallback). |
| `487b2b5` | Doc: CLAUDE_RESUME_2 — Wave 1.5 fallout + W2-BE dispatch failures + bug triage. |
| `5e22c27` | "Update ai.js" — mystery commit by KodaiCards (user or another agent) that fixed `bulk_create_projects` rollup billing inheritance. Counted as Wave 2 BE-AI item #2. |
| `166b6ec` | **UI-A**: new logo file (user-supplied no-BG PNG copied over `launch-fiber-logo-transparent.png`); login logo 60px → 96px; launcher topbar 68px → 84px; topbar logo 44px → 60px with brightness/invert filter for the blue bar; OSP Training tile added to `PORTAL_DEFS` in `server.js`; `public/training.html` placeholder created. |
| `8e5bcca` | PR #41 merge (auto-numbered, prior orchestrator work). |
| `c323f54` | "c" — mystery commit. |
| `5e227be` | PR #40 merge — included Wave 1.5 (e493200, security hardening) + jobs.js requireAuth boot-loop hotfix (cafa438). |
| `cafa438` | Hotfix: `routes/jobs.js` missing `const { requireAuth } = mw` destructure that crashed Railway in a boot loop. |
| `286561d` | Cat-8+9 projects: error sweep + cascade preview for deletes. The cascade preview gate caused user-reported "can't delete anything" — partially reverted in `ab4136c`. |
| `1332a9a` | Cat-6 splice SSE: per-heartbeat session re-validation. (Wave 1.6 confirmed this is sufficient.) |
| `64086d7` | Cat-8 error sweep: scrubbed `e.message` from `budgets/jobs/permits/pricing/staff/time_entries/projects` route catch blocks. Wave 1.6 finished the remaining `splice.js` + `admin.js` instances. |

(Plus PR #38 hotfix for migration 0023 `MIN(uuid)` earlier in the day.)

## Currently in flight

| Agent | Scope | Files |
|---|---|---|
| **EC-WOSA-Mirror** | Mirror the EC-scoped WO#/Service-Area pickers from `public/admin.html` into `public/design.html` and `public/permitting.html` so engineers in those portals get the same picker behavior. | design.html, permitting.html |
| **BulkAtom-Fix** | Wrap `bulk_create_projects` in `routes/ai.js` in a BEGIN/COMMIT/ROLLBACK transaction so a mid-batch failure rolls back rather than leaving partial rows. Decision point for the agent: strict all-or-nothing vs SAVEPOINT-per-row. | routes/ai.js |

Both report-only; manager commits each separately. No file overlap.

## What's left in the queue

| Item | Why it matters | Effort |
|---|---|---|
| **Manual job-assignment feature** (memory: `feature_manual_job_assignment.md`) | User explicitly asked. **Override semantics**: explicit `job_assignments` table wins over `program_scope` heuristic when present; fallback to heuristic when no assignment exists. Post-demo per user's pacing. | Medium agent + migration + UI |
| **Cleanup** | Apply `CLEANUP_CANDIDATES.md` deletions — repo hygiene. | Small agent |
| **Customer portal modal focus trap** | Customer.html uses `style.display='none'/'flex'` instead of `openOverlayModal()`. A11y round 2 deferred — customer portal is "Under Construction" per owner. Wait until it goes live. | Small |
| **Color contrast formal audit** | Token system passes AA by inspection. axe-core or Lighthouse the right tool for exhaustive check. Not blocking. | Small |
| **Admin.html form-label sweep** | ~50 more `for=/id=` pairs on lower-traffic modals. Mechanical but volume-heavy. | Small-medium |
| **Concentrators → ec_service_areas data migration** | Open question from EC-WOSA agent: should existing concentrators auto-seed the new tables for ECs that already have them? Default = no migration (keep heuristic fallback). | Small |
| **projects.ec_work_order_id FK** | EC-WOSA today mirrors WO picker value back to free-text `work_order_number`. Long-term: add FK column for cleaner referential integrity. | Small-medium |

## Open user-flagged items

1. **County Permitting job appearing for BAU**: data-level, not code. User changes `program_scope` from `rus` to `shared` in Settings → Jobs.
2. **New EC under PSC 217 not showing in Projects tab**: expected behavior — Projects tab shows `projects` rows; an EC with no leaf projects has no rows. Not a bug.
3. **Future OSP changes**: dispatch a portable-Node-build agent again, commits new dist, ships. No Railway dependency. Or install Node locally for faster iteration.

## Operating-mode discoveries

Things learned the hard way today, captured here so the next Claude doesn't relearn:

1. **`git commit` permission wall**: blocks sub-agents by default. The expanded allowlist now covers `Bash(git *)` etc., but if it gets reverted, dispatches fail silently mid-work. Check `.claude/settings.local.json` if agents are stalling.
2. **Branch drift**: working tree silently flipped from `main` to `claude/debug-previous-issues-MoN9D` multiple times during this session. Symptoms: `git log -5` shows commits that aren't on main; commits land on the wrong branch. Fix: `git checkout main && git cherry-pick <sha>`. Watch for this when committing — `git branch --show-current` should always say `main`.
3. **Node not installed**: this Windows machine has no Node.js on PATH or in standard install dirs. Portable Node v20.18.0 from nodejs.org downloads + extracts to a short path (long Desktop paths break Windows zip extraction silently). Used + deleted for OSP build; future builds need same workaround unless user installs Node permanently.
4. **OSP repo on GitHub is empty**: `KodaiCards/OSP-Design-Training` has only `.gitattributes`. The real source is at `C:\Users\Carter Trantham\Desktop\OSP Design Training\` (local-only). Don't clone — use the local copy.
5. **Sub-agent dispatch failures**: Wave 2 BE-AI v1 and v2 both got stuck asking permission to modify `.claude/settings.json`. The v3 brief explicitly said "DO NOT modify settings.json" and worked. If a brief gets stuck in a permission loop, the brief needs to be more explicit.

## Documentation index

- `CLAUDE.md` — orchestrator's consolidated context (57KB, dense; per-wave canonical lists NOT in it).
- `CLAUDE_RESUME.md` — orchestrator's original pause-state.
- `CLAUDE_RESUME_2.md` — afternoon Wave 1.5 fallout + W2-BE dispatch failure triage.
- `CLAUDE_RESUME_3.md` — afternoon handoff w/ operating rules.
- `CLAUDE_RESUME_4.md` — evening handoff w/ feature plans.
- `CLAUDE_RESUME_5.md` — THIS FILE — late-night summary post-Wave-1.6.
- `PROJECT_NORTH_STAR.md` — domain primer (authoritative for conventions).
- `CLEANUP_CANDIDATES.md` — deletion list for the Cleanup task.
- `memory/MEMORY.md` — point-in-time observations index. Read the linked files for full context on each entry.
  - `feedback_manager_never_codes.md` — absolute rule, no exceptions
  - `feedback_no_worktrees.md` — don't use git worktrees
  - `feature_manual_job_assignment.md` — override semantics, post-demo
  - `feature_ec_wo_service_areas.md` — shipped; mirroring in-flight
  - Plus 4 earlier reference memories

## Final notes to the next Claude

You're picking up a mostly-finished session. The two in-flight agents (EC-WOSA-Mirror + BulkAtom-Fix) will report back shortly. When they do:

1. `git pull --ff-only` and `git status`.
2. Read each agent's diff against `git diff --stat`. Don't trust the summary alone.
3. `git add <their files>` + `git -c commit.gpgsign=false commit -m "..." -m "..."` + `git push origin main`.
4. Update this doc (or write CLAUDE_RESUME_6) with new SHAs.

The user is in demo mode today (2026-05-12 Monday continues into Tuesday demo). Most demo-critical work is shipped. Remaining queue is polish + post-demo features. If user says "stop and demo prep" — stop. If user says "continue" — pick from the queue.

**Don't inline-edit code, no matter how small.** The user enforced this rule explicitly on 2026-05-11. See `memory/feedback_manager_never_codes.md`. Settings.json edits ARE allowed if fixing a permission-loop block, but everything else goes through a Sonnet sub-agent. Even one-line fixes.

When you fix something or ship a feature, commit messages need real descriptions. Two "x"/"c" commits today cost debugging time and the user noticed. Be specific about WHY, not just WHAT.
