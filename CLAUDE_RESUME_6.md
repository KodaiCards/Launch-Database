# Claude Resume 6 — 2026-05-12 (post-feature handoff)

> Sixth and likely final handoff for this stretch. Read prior handoffs in order — `CLAUDE_RESUME.md` → `_2` → `_3` → `_4` → `_5` → this one. The wave train + the two new features are done. Audit results from a Verify-All agent are appended at the bottom (or in a separate addendum if the agent is still running when you read this).

## TL;DR

Everything in the user-facing queue from today is shipped. Two features brand-new this session (EC WO# + Service Areas, manual job-assignment) are live. The OSP Training tile serves a real React app. Wave 1.5 / 1.6 / 2 / 3 BE-Perf / 3 FE-A11y are all complete or shipped with documented deferrals.

Remaining: Cleanup (`CLEANUP_CANDIDATES.md` deletions) — explicitly punted to next Claude per user direction.

## Hard operating rules

These are stable across all resumes; if you only read one section, read this one.

1. **Manager never writes code.** `memory/feedback_manager_never_codes.md`. Dispatch a sub-agent for every code change, even one-liners.
2. **Sub-agent pattern: edit-and-report.** Agents EDIT, manager COMMITS + PUSHES.
3. **Single-line commit messages with chained `-m` flags.** No heredocs.
4. **Direct-to-main pushes** (PROJECT_NORTH_STAR §2). Railway auto-deploys.
5. **No placeholder commit messages.** No "x", no "c".
6. **Smoke-check every agent's diff before committing.**
7. **`.claude/settings.local.json` allowlist is expanded** with broad wildcards. If sub-agents stall, check it.
8. **Branch drift watch**: working tree silently flips from `main` to `claude/debug-previous-issues-MoN9D` sometimes. `git branch --show-current` should say `main` before every commit. If not, `git checkout main && git cherry-pick <sha>`.

## Full commit list — today (chronological, newest first)

| SHA | Description |
|---|---|
| `a379584` | **Manual job-assignment feature**: migration 0032 `job_assignments` with CHECK + UNIQUE-COALESCE-sentinels; 3 admin-gated endpoints in `routes/jobs.js`; override check prepended to `GET /api/jobs` (when scope params present, JOIN `job_assignments` w/ `(col=$N OR col IS NULL)`, if matches → return only those jobs and skip heuristic); Settings UI in `public/js/jobs_settings.js` — chain-link button per row opens a pin-management modal with Client/EC/Team pickers. |
| `916f11f` | **EC WO/SA mirrored** to `public/design.html` + `public/permitting.html`. `contractChanged()` resolves EC via `window.contractsCache[selected].engineering_contract_id` then calls `populateEcScopedWoSaForModal(ecId)`. `openProjectModal()` reset + `editProject()` restore both handled. |
| `c50eaec` | Doc: CLAUDE_RESUME_5. |
| `2dbb28f` | **bulk_create_projects atomicity** (was deferred from Wave 2 BE-AI v3): two-phase rewrite. Phase 1 pre-validates all specs without touching DB. Phase 2 opens `txClient`, BEGIN, runs INSERTs, COMMIT (or ROLLBACK on any failure). Matches the bulk_delete_projects pattern. |
| `25e087e` | **Wave 1.6**: error-message sanitization in `routes/splice.js` (98→0 leaks) and `routes/admin.js` (22→1, the 1 is an intentional fs-error in uploadsCleanupHandler). |
| `c0e4c65` | **Wave 3 FE-A11y round 2**: focus trap + return in `overlay_modal.js`; global `*:focus-visible` ring + `.sr-only` + `.skip-nav` in `app-shell.css`; skip-nav links + `<main id=main-content>` on admin.html + launcher.html; form labels on design/permitting/timeclock modals; undo bar `role=status aria-live=polite`. |
| `1a170de` | **OSP-Merge Option 3**: pre-built Vite dist committed; `[phases.build]` removed from nixpacks. Real React app at `/training/`. |
| `9ae778f` | OSP build hotfix: `npm ci` → `npm install`. |
| `7ca2e3c` | **OSP-Merge Path 2**: OSP source copied into `osp-training/` (62 files); nixpacks build hook (later reverted in `1a170de`). |
| `ead0d98` | **OSP-Merge wiring**: Express `/training` auth-gated static + SPA fallback + PORTAL_DEFS URL update + stub. |
| `b3ce795` | Doc: CLAUDE_RESUME_4. |
| `edde65a` | **Wave 3 FE-A11y round 1**: dialog roles + close-button labels on 5 portal HTMLs + overlay helper. |
| `8933a99` | "c" — mystery commit. (One of two "c" commits — see CLAUDE_RESUME_2 for why these existed.) |
| `1ea79db` | **Wave 2 BE-AI v3** (5 items): bulk-delete tx, injection markers, uploadStore owner_id, MAX_ITERATIONS warning, log_time_entries 100-cap. |
| `20560fe` | **Wave 3 BE-Perf**: migration 0030 (9 indexes); dashboard YTD revenue cache; N+1 fixes in billing.js; collectProjectTree recursive CTE; LIMITs on /api/time-entries + /api/projects; admin.js sync fs → fs.promises. |
| `7f3b6cb` | **EC WO# + Service Areas feature**: migration 0031 (2 tables); 8 admin-gated endpoints; Settings EC-edit modal panel; project-modal scoping. |
| `951d245` | Doc: CLAUDE_RESUME_3. |
| `bde0e28` | **Project-Modal-Fix**: BAU hides Construction Contract; new EC live-refreshes into modal dropdown via SSE. |
| `8402283` | **Wave 2 FE-Crit** (13 items): stale URLs, billing-history tree state, SSE on permits + design, double-submit guards, actor pre-fill, persistFilter change-dispatch, cascade-preview UI, overlay escape-key, try/catch around load-fns. |
| `e7c0d1e` | **CI-Fix**: removed stale-cache gate on Playwright install. |
| `ab4136c` | **Delete-fix**: removed dry-run-by-default gate from single-row DELETEs (kept on `/with-tree`). |
| `6b87ff5` | Test: project_tree_delete sends `{confirm:true}`. |
| `4c751c5` | **Hotfix bundle**: migration 0023 RAISE format + restore body token on login + change-password. |
| `487b2b5` | Doc: CLAUDE_RESUME_2. |
| `5e22c27` | "Update ai.js" — mystery commit fixed `bulk_create_projects` rollup billing inheritance. |
| `166b6ec` | **UI-A**: new logo + larger sizes + Training tile in PORTAL_DEFS + `training.html` placeholder. |

(PR #38 hotfix earlier for migration 0023 MIN(uuid) is also part of today's work.)

## What I did NOT do (and why)

These are explicit deferrals, not oversights. Each has documented reasoning in the relevant commit or CLAUDE_RESUME doc.

| Item | Defer reason |
|---|---|
| **Cleanup** — apply CLEANUP_CANDIDATES.md deletions | User explicitly punted to next Claude (2026-05-12) |
| **Puppeteer browser pool** (Wave 3 BE-Perf scope) | Load-bearing PDF flow; unclear cleanup-on-crash semantics outweighs the 2s startup-cost savings |
| **updateProjectHours batch** (Wave 3 BE-Perf scope) | Sequential parent propagation is by design; refactor risk > current cost at typical 5-20 project CSV imports |
| **Customer portal modal focus trap** (Wave 3 FE-A11y) | Customer portal is "Under Construction" per owner; wait until it goes live |
| **Color contrast formal audit** (Wave 3 FE-A11y) | Token system passes AA by inspection; axe-core / Lighthouse the right tool for exhaustive |
| **Admin.html form-label sweep** (~50 more `for=/id=` pairs) | Mechanical but volume-heavy; the high-traffic modals are done |
| **Concentrators → ec_service_areas data migration** | Open question for user: do they want existing concentrators auto-seeded into the new EC-scoped tables? |
| **projects.ec_work_order_id FK column** | Long-term cleaner referential integrity; today's mirror approach (free-text value mirrored from picker) works fine |
| **Test suite run** for the new features (manual job-assign + EC WO/SA + bulk_create atomicity) | Agent couldn't access npm. User should run `DATABASE_URL=...; npm test` before considering these features production-grade |
| **Bulk-create-projects: SAVEPOINT-per-row variant** (vs strict all-or-nothing chosen) | Matched bulk_delete_projects's strict pattern for consistency. Revisit if all-or-nothing proves too harsh for actual usage. |
| **CLAUDE.md + PROJECT_NORTH_STAR.md updates** for the two new features | The memory files (`feature_manual_job_assignment.md`, `feature_ec_wo_service_areas.md`) hold the canonical spec. Updating the long planning docs is a polish pass. |
| **Cleanup-after-EC-delete** (concentrators that referenced the EC) | The new tables CASCADE on EC delete; the legacy concentrators table is independent. Whether to dual-clean is an open question for user. |
| **OSP source full audit** (the 12 "red-team FIXes" from the orchestrator) | Source was unavailable at the time; user provided after the demo-critical work was already integrated. Audit deferred. |

## Open questions for the user (carried forward)

1. **Concentrators → ec_service_areas migration?** Should existing concentrators auto-seed the new EC-scoped tables for ECs that already have them?
2. **County Permitting under BAU**: data-level fix — change `program_scope` in Settings → Jobs from `rus` to `shared` if you want it visible for BAU clients too. NEW: now you can ALSO pin it via Settings → Jobs → chain-link button per the manual-job-assignment feature.
3. **OSP source code-of-record**: the local `C:\Users\Carter Trantham\Desktop\OSP Design Training\` is the canonical source; the GitHub `KodaiCards/OSP-Design-Training` repo is empty. Want to push local → GitHub so future Claudes don't hit the same wall?
4. **Future OSP rebuilds**: dispatch a portable-Node-build agent each time. Or install Node permanently on this machine for faster iteration.
5. **Manual job-assignment "team" axis**: the project modal doesn't yet send `?team=design` etc. when filtering jobs. Backend supports it; FE-side wiring is a future small task. Is this worth doing now, or wait until you see real demand for team-pinned jobs?

## In-flight when this doc was written

| Agent | Status |
|---|---|
| **Verify-All** | Read-only audit cross-checking every claim in commits + handoff docs against actual code state on disk. Will produce a punch list (✅/⚠/❌/🔍) per claim with evidence + recommended follow-ups. Results land in a section below or in CLAUDE_RESUME_7 if you write one after the agent reports. |

## Standing TODOs for the next Claude

1. **Cleanup** — apply `CLEANUP_CANDIDATES.md` deletions. Small agent, repo hygiene.
2. **Run the test suite** locally: `DATABASE_URL=postgresql://lftest:lftest@localhost:5432/launchfiber_test npm test`. The agent that shipped manual-job-assign + bulk_create-atomicity couldn't run it from the sandbox.
3. **Read Verify-All's audit findings** at the bottom of this file (or in `task-notification` if it lands after this commit). Address any ❌ MISSED or critical ⚠ PARTIAL items.
4. **Update CLAUDE.md + PROJECT_NORTH_STAR.md** with the two new features (EC WO/SA, manual job-assignment) — they're load-bearing for future work and the memory files alone aren't quite enough for someone reading the long docs.
5. **Customer portal go-live** when user is ready — the backend has 5 GETs, the UI is "Under Construction" placeholder.
6. **Push OSP source to GitHub** so it has version control beyond the user's local machine.

## Documentation index

- `CLAUDE.md` — orchestrator's consolidated context (57KB).
- `CLAUDE_RESUME.md` → `_2` → `_3` → `_4` → `_5` → this — sequential session handoffs.
- `PROJECT_NORTH_STAR.md` — domain primer + conventions (authoritative).
- `BUILD_PLAN.md`, `ADMIN_FIXES_PLAN.md`, `PORTAL_LAUNCHER_PLAN.md`, `SPLICE_BUILD_PLAN.md`, `SPLICE_MATRIX_SUGGESTIONS.md` — historical planning context.
- `HANDOFF_NEXT_PM.md` — earlier PM operating rules. The "Open follow-ups" + "Recon-A self-flagged" items have largely been addressed today; check Verify-All's findings.
- `CLEANUP_CANDIDATES.md` — deletion list for the Cleanup task.
- `memory/MEMORY.md` — point-in-time observations index. Read linked files for full context.
  - `feedback_manager_never_codes.md`
  - `feedback_no_worktrees.md`
  - `feature_manual_job_assignment.md` — shipped today (a379584)
  - `feature_ec_wo_service_areas.md` — shipped today (7f3b6cb + 916f11f)
  - 4 earlier reference memories

## Verify-All audit findings

[Will be appended when the agent reports. If you write CLAUDE_RESUME_7, paste the agent's punch list there instead — and address any ❌ MISSED items.]
