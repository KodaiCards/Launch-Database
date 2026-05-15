# OSP-RW Discovery — Agent B — Repo→Doc Hunting

## Stack snapshot (≤80 words)

Scanned launch-database (local + MCP) for state CLAUDE.md §4 doesn't reflect. Could NOT scan osp-design-training as a separate repo — local proxy returns 502 and there's no network egress. **Critical finding:** osp-design-training source IS mirrored INSIDE launch-database at `osp-training/` (12 modules, all components, vite config, docs). The doc treats it as a separate repo; in reality its source-of-truth lives here. Active dev work happened on `claude/debug-previous-issues-MoN9D` then merged to `main` via PR #43 (`95b6bf6`).

## launch-database — surface scan

- **HEAD on main:** `95b6bf6` "Merge pull request #43 from KodaiCards/claude/debug-previous-issues-MoN9D" — confirms the dev branch was merged into main (doc still describes the dev branch as "active", §4 / branch state)
- **Recent commits on main (last 30):** dominated by T1/T2/T3 pitch-revision content commits + T6 brief work (~mid-May). NO commits referencing OSP-RW.0/1/2/3/4/5/6/7 phases. NO commits creating `src/lessons/` or interactive primitives (`AnnotatedDiagram`, `WorkedExample`, `BranchingScenario`).
- **Branches (via MCP, 5 total):** `main`, `claude/debug-previous-issues-MoN9D` (HEAD `ac7ac5e`, MERGED into main, doc treats as active), `claude/add-audit-log-hours-x0XCd` (HEAD `e0c7650`, **10 unique commits ahead of main not in doc**), `claude/scale-pass-sse-cte` (HEAD `48d67e7`, **3 unique commits ahead of main not in doc**: SSE memory leak fix, recursive-CTE depth guard, poll heartbeat tune), `claude/splice-matrix-railway-setup-IIG3Q` (HEAD `1a29a97`, status not deeply checked).
- **`audit-output/` contents:** 27+ wave dirs. NO `osp-rewrite-discovery/` (this report creates it). NO `osp-rewrite/` arch-design dir. NO `wave-osp-rw-*` dirs. The doc's "Phase OSP-RW" plan exists ONLY as text in CLAUDE.md — no audit-output scaffolding has been created yet.
- **Open PRs:** ZERO open. Confirmed via MCP `list_pull_requests state=open`.
- **Top-level `.md` docs not enumerated in CLAUDE.md §2:** `HANDOFF.md`, `PORTAL_LAUNCHER_PLAN.md`, `PROJECT_NORTH_STAR.md`, `CLEANUP_CANDIDATES.md`, `SPLICE_BUILD_PLAN.md`, `SPLICE_MATRIX_SUGGESTIONS.md`. HANDOFF.md is recent (commit `8f53544`) and explicitly intended for the next Claude.

## osp-design-training — surface scan

**Could NOT clone the standalone repo** (local proxy 502: `repository not authorized`, no network). HOWEVER source IS in-tree at `/home/user/Launch-Database/osp-training/`:

- `src/` structure: `App.jsx`, `main.jsx`, `index.css`, `modules/`, `components/`, `data/` (NO `lessons/`, NO `courses/`, NO `routes/`, NO React Router setup visible)
- `src/modules/` files (13 total): Module01-12 + `ToolsPage.jsx`. Sizes 349-808 lines, **7144 total LOC** (doc claims "7,427 lines total" — close but slightly off)
- `src/lessons/` exists? **NO.** The OSP-RW.2 scaffold per-lesson rewrite has NOT begun.
- Interactive primitive components present? **InteractiveQuiz.jsx — YES** (existing). **AnnotatedDiagram — NO. WorkedExample — NO. BranchingScenario — NO.** OSP-RW.3 has NOT begun. Components present: `CertificationSim.jsx`, `Flashcard.jsx`, `InteractiveQuiz.jsx`, `LinkBudgetCalculator.jsx`, `ModuleLayout.jsx`, `OTDRTraceViewer.jsx`, `TopologyCanvas.jsx`.
- Vite config base path: `'/training/'` (matches doc).
- `docs/red-team-reports/` contains `modules-01-04-redteam.md`, `modules-05-08-redteam.md`, `modules-09-12-redteam.md` — pre-existing red-team work not referenced in CLAUDE.md.
- `data/` has flashcards 03-12 + `cert-sim-bank.js` + `flashcards.js` (likely M01/M02). 68-Q cert bank likely lives in `cert-sim-bank.js`.

## Findings the doc doesn't reflect (max 10)

| # | Severity | What | Evidence |
|---|---|---|---|
| 1 | **HIGH** | Active dev branch was MERGED into main via PR #43 (`95b6bf6`). Doc §4 still describes `claude/debug-previous-issues-MoN9D` as the active dev branch and main as separate. Source-of-truth has shifted. | `git log -1 main` + `mcp__github__list_branches` |
| 2 | **HIGH** | `osp-design-training` repo source is mirrored in-tree at `osp-training/`. Doc §2 treats the two repos as separate; OSP-Merge wave actually brought source in-repo (commit `7ca2e3c`). Future OSP-RW work should be done in-tree, not in the standalone repo. | `ls /home/user/Launch-Database/osp-training/src/` |
| 3 | **HIGH** | Branch `claude/add-audit-log-hours-x0XCd` has 10 unique commits ahead of main NOT mentioned in §4 (incl. shared `openOverlayModal` helper, tree-toggle factory, AI 503 handling, `userWantsAction` unit tests, `SESSION_HANDOFF.md`, schema-shape smoke test). Real un-merged work. | `git log origin/main..origin/claude/add-audit-log-hours-x0XCd` |
| 4 | **MEDIUM** | Branch `claude/scale-pass-sse-cte` has 3 unique commits ahead of main NOT mentioned: SSE memory-leak fix, recursive-CTE depth<10 guard on unbounded queries, poll 8s→60s heartbeat tune. Performance/stability fixes still un-merged. | `git log origin/main..origin/claude/scale-pass-sse-cte` |
| 5 | **MEDIUM** | OSP-RW phases 0-7 are PURELY ASPIRATIONAL — zero scaffolding exists. No `audit-output/osp-rewrite/`, no `audit-output/osp-rewrite-discovery/`, no `src/lessons/`, no Postgres `training_progress`/`training_cert_attempts` migrations (next migration would be 0035; latest is 0034), no `routes/training*.js`, no `/api/training/*` endpoints in server.js. | `ls migrations/`, `grep training_progress`, `ls routes/` |
| 6 | **MEDIUM** | Moodle teardown (OSP-RW.6) NOT started. `routes/oauth2.js` still exists, `moodle/` dir still exists with `Dockerfile`/`README.md`/`railway.json`/`scripts/`, `server.js:197-201` still has `TRAINING_URL` Moodle comment. | `ls routes/oauth2.js moodle/`, `grep TRAINING_URL server.js` |
| 7 | **MEDIUM** | Doc claims OSP modules are "7,427 lines total"; actual `wc -l` says **7,144**. Off by 283 lines. Either doc is stale OR a content compaction happened post-pitch-revision. | `wc -l osp-training/src/modules/*.jsx` |
| 8 | **LOW** | `osp-training/src/modules/ToolsPage.jsx` exists (44 lines) — a 13th file beyond the 12 modules. Not referenced in §2's module table or curriculum split. | `ls osp-training/src/modules/` |
| 9 | **LOW** | `public/training/` SPA bundle is `index-C1d2X0zu.js` + `index-CxqtYakO.css` (the dist that's currently served behind requireAuth). No way from filename alone to know if pitch-revision content has been built into the dist. Production cut might be lagging the source. | `ls public/training/assets/` |
| 10 | **LOW** | HANDOFF.md (commit `8f53544`) and SESSION_HANDOFF.md (on `add-audit-log-hours` branch) are explicit Claude-to-Claude continuity docs not enumerated in CLAUDE.md §2's "places worth knowing about" list. | `ls /home/user/Launch-Database/*.md` |

## In-flight / half-finished work (max 10)

1. **`claude/add-audit-log-hours-x0XCd` branch** — 10 commits of real fix-work (overlay helper dedup, tree-toggle, N+1, AI 503 handling, schema smoke test). Not yet merged to main. Author appears to have intended this to land — wrote `SESSION_HANDOFF.md` as a handoff.
2. **`claude/scale-pass-sse-cte` branch** — 3 stability/perf commits. Not merged.
3. **`claude/splice-matrix-railway-setup-IIG3Q` branch** — exists, status not deeply audited (HEAD `1a29a97`).
4. **OSP T1-T5 pitch-revision wave** — substantially shipped to main (T1 odd+even, T2 odd, T3 even, T4 trailer fixes, T5 fixes). T2 even, T3 odd, T4 main lessons, T5 main lessons status unclear from commit log alone — would need per-file inspection.
5. **T6 brief** — verifier A + B reports landed (`071aec7`, `25f614f`), brief re-baseline shipped (`c38d3e6`). Authoring NOT visible in main commits. Next step queued but un-started.
6. **Moodle teardown** — fully un-started. `routes/oauth2.js` (332 lines) + `moodle/` directory + `TRAINING_URL` env var all live.
7. **`audit-output/osp-rewrite-discovery/` scaffolding** — created by THIS report; was missing entirely before.
8. **OSP-RW.2 scaffold artifacts** (splash page, routing, LessonLayout, API, schema) — none exist. Doc §4 implies "IN FLIGHT" but no commits or files match.
9. **OSP-RW.3 primitives** (Quiz extension, AnnotatedDiagram, WorkedExample, BranchingScenario) — none exist.
10. Top-level `.md` planning docs (`PORTAL_LAUNCHER_PLAN.md`, `PROJECT_NORTH_STAR.md`, `SPLICE_BUILD_PLAN.md`, `SPLICE_MATRIX_SUGGESTIONS.md`, `CLEANUP_CANDIDATES.md`) — content/freshness unknown; may carry stale plans the orchestrator should read or retire.

## Coverage gaps (≤120 words)

- Could NOT clone `kodaicards/osp-design-training` standalone — local proxy returned 502 `repository not authorized`. Only the in-tree mirror at `osp-training/` was inspectable. Cannot confirm whether the standalone repo has divergent commits, branches, or rewrite-in-progress work that the in-tree mirror doesn't have.
- Did NOT inspect file-level content of pitch-revision commits (e.g., did each L1.x revision commit actually weave plain-English vs stack it? did acronym glossaries land?). Pure git-log-level scan only.
- Did NOT verify state of T2 even / T3 odd / T4 / T5 main-lesson revisions — commit log shows partial coverage but per-lesson confirmation skipped for time.
- Did NOT inspect contents of the 3 unmerged feature branches in depth — only commit messages.
- Did NOT verify the `public/training/` bundle's actual SPA content matches current `osp-training/src/`.
- Did NOT cross-check Carter's 12 module curriculum-split table in §2 against actual module file content.

=== AGENT B REPORT END ===
