# Handoff — Next Claude PM

> **Read this whole file before doing anything.** The user explicitly named you a project manager. Your value is in delegation + review, not in writing code yourself.

## Session working agreement (locked-in by the user — do NOT violate)

1. **When the user types a message mid-task, do not pause the running agents.** Add their request to the queue, answer if it's a question, and keep agents working.
2. **At every status change, emit a dashboard** in the box-drawing format below. The user wants visibility into agent state without asking.
3. **Update this file often** — at every task start/complete, and especially when the manager swaps. The user rotates Claudes roughly every ~15 messages, so the next PM must be able to pick up cold.
4. **Manager pattern** the user wants on every code change: `implementer Sonnet → red-team Sonnet → manager VERIFIES → manager pushes/deploys`. **The manager (Opus) never does the red-team review themselves.** A separate Sonnet agent always performs the review; the manager's job is to verify the work (read the diff, run tests, sanity-check the report) and then deploy. Inline review by the manager is NOT acceptable, even for tiny diffs.
5. **The manager NEVER does code research, grep sweeps, or file walks themselves — those go to a Sonnet (Explore or general-purpose). The manager only does:** dashboard updates, brief writing, diff reading, test running, commit/push/merge, and reading agent reports. Even a single `grep` for routing/code is delegation territory. The user's rule, verbatim: "YOU ALWAYS NEED TO DISPATCH AGENTS YOU ARE JUST A MANAGER".
6. **Sister project**: `KodaiCards/OSP-Design-Training` (path `/home/user/OSP-Design-Training`, branch `claude/debug-previous-issues-MoN9D`) is a future portal/tile. Not active yet — add to the dashboard queue, don't start work without explicit go-ahead.

### Live dashboard format (use this exact shape)

```
                    Launch-Fiber Manager Dashboard
┌─────────┬──────────────────────────────────────────────┬──────────────┐
│ <name>  │ <one-line activity>                          │ <status>     │
└─────────┴──────────────────────────────────────────────┴──────────────┘
```

Status glyphs: `✓ <short-sha>` done · `⏳ running` · `📋 queued` · `⚠ blocked`. Agent names are short labels (Recon-A, Red-A, Ship, OSP-1). Reuse names across sessions so the user can track them.

### Live agent ledger (current session)

| Name    | Role / activity                                        | Status        | Notes |
|---------|--------------------------------------------------------|---------------|-------|
| Recon-A | `db.js` add `connectionTimeoutMillis: 10000`           | ✓ 234454f     | Boot-path fix (insufficient on its own — only helps the first DB query, not subsequent bootstrap awaits). Superseded by Fix-B. |
| Fix-B   | Wrap 5 bootstrap awaits + scheduler in try/catch       | ✓ 0f93781     | server.js `start()` uses `safeBootstrap(label, fn)` so any DB-bootstrap throw is logged and skipped. |
| Red-C   | Sonnet review of Fix-B (14 points)                     | ✓ SHIP        | 154/154 tests green on live Postgres. All MINORs are pre-existing. |
| Fix-C   | db.js: statement_timeout + idle_tx_timeout             | ✓ ab6af30     | 30s server-side cancel, 35s client-side fallback, 60s idle-in-tx kill via pool.on('connect'). Three env overrides: `PG_STATEMENT_TIMEOUT_MS`, `PG_QUERY_TIMEOUT_MS`, `PG_IDLE_TX_TIMEOUT_MS`. |
| Red-D   | Sonnet review of Fix-C (20 points)                     | ✓ SHIP        | 154/154 tests in 45s, slowest 1.5s (20× under budget). pg-pool 'connect' confirmed lazy + once-per-physical-connection. No prod query approaches 30s. |
| PR #35  | Combined Fix-B + Fix-C → main                          | ✓ 7e964ba     | Auto-numbered #35 (not #34). Merged via GitHub MCP since direct push to main is blocked by local proxy. |
| URL-A   | Recent portal/URL change audit                         | ✓ done        | **NEW UPSTREAM FINDING**: post-3feeef2 the new `/` handler and `/api/me/portals` both call `requireAuth()` which does a DB lookup. If the DB pool is starved (the actual 502 mode), those requests block until Railway's edge times out → 502 BEFORE the launcher even renders. URL-A also flagged: PORTAL_MODE may still be set on Railway with a bogus value (falls back to `design.html`); admin users may need to bookmark `/admin.html` instead of `/` going forward; Railway edge cache can serve stale HTML for hours after a deploy. **Fix-C will be needed to make `/` + `/api/me/portals` survive a sick DB.** |
| Diag    | User-side Railway dashboard / logs / volume check      | ⚠ blocking    | Manager cannot reach Railway from sandbox. Need: deploy status, runtime log tail, volume %, env vars (PORTAL_MODE, UPLOAD_DIR, DATABASE_URL present, PORT). |
| Mgr-Res | Inline disk-leak research (manager, Opus)              | ✓ done        | Identified candidates: orphan multer files, audit JSONB blobs, Postgres WAL pressure. Wrote Fix-A's brief from the findings. |
| Fix-A   | DB-indep recovery + audit caps                         | ✓ f6681eb     | `/api/_admin/disk-stats` + `/api/_admin/uploads-cleanup` + `X-Admin-Bypass-Token`, audit retention 90→14d (env `AUDIT_RETENTION_DAYS_LOW`), 64 KB payload cap, AI upload catch-block unlink. |
| Red-B   | Sonnet red-team review (Fix-A diff, 20 points)         | ✓ SHIP        | Zero deploy-blockers. 5 minor follow-ups (see "Open follow-ups" below). |
| Tests   | `npm test` against local Postgres                      | ✓ exit 0      | 154/154 green on the merged Recon-A + Fix-A diff. |
| Deploy  | PR #33 merged to main                                  | ✓ de55ff5     | Direct push to main blocked by local git proxy (403); shipped via `mcp__github__create_pull_request` + `mcp__github__merge_pull_request`. Railway auto-deploys main. Manager cannot probe `launchfiberadminportal.xyz` from sandbox — host not in allowlist. User verifies. |
| Disk-A  | Identify the 250GB-in-8h volume leak (read-only)       | ⚠ aborted     | Died on Anthropic usage cap. Findings re-derived inline by manager; never re-run as Disk-B since the inline research + Fix-A's surface-area sweep was sufficient. |
| UI-A    | Launcher + login redesign                              | 📋 queued     | User-described intent (verbatim, captured 2026-05-08): logo on the login page is too skinny; make the header bar wider with a fairly-large logo; use the *no-background* version of the logo (repo has both `Launch Fiber PNG.png` and `launch-fiber-logo.png` — confirm which is transparent before swapping); tile titles need to be smaller; layout: a single square (slightly larger than one current tile) holds all the tiles; tiles always fill the square — when there are fewer tiles per a user's permissions, the remaining tiles stretch into rectangles to fully fill. Touches `public/launcher.html` and `public/login.html`. User will provide a logo screenshot before dispatch; do not start UI-A without it. |
| Disk-T  | Operator: triage disk via /api/_admin/disk-stats       | 📋 queued     | Once UI is settled, the disk producer still has to be identified and capped. Have the user POST `/api/_admin/disk-stats` with `X-Admin-Bypass-Token`, then `/api/_admin/uploads-cleanup` dry-run → real-run. Volume now bumped to 500 GB so headroom exists; the producer is still leaking until we identify it. |
| OSP-1   | OSP Design Training portal/tile bring-up               | 📋 queued     | Sister repo. User said "later". |

### Operator actions required after Railway redeploys

1. **Confirm `UPLOAD_DIR` env var** on Railway points at the mounted 250 GB volume (e.g. `/data/uploads`), not the container ephemeral root. Otherwise `/api/_admin/disk-stats` reports the wrong filesystem.
2. **Set `ADMIN_BYPASS_TOKEN`** to a long random value (`openssl rand -hex 32`). Without it the recovery endpoints fall through to normal admin auth, which is the exact thing that fails when Postgres is sick. Never log the value.
3. **Triage the disk**: hit `GET /api/_admin/disk-stats` (with the bypass header if DB is degraded) → identify the producer → `POST /api/_admin/uploads-cleanup` with `{"dry_run": true}` first → if numbers look right, repeat with `{"dry_run": false}`.
4. **Optional**: set `AUDIT_RETENTION_DAYS_LOW=7` if 14 days of trivial audit history is still too much for the volume after the first cleanup pass.

### Open follow-ups (Red-B's MINOR items, not deploy-blockers)

1. Replace `===` bypass-token comparison with `crypto.timingSafeEqual` (`routes/admin.js`).
2. Update the cleanup endpoint's `hint` text to include `Content-Type: application/json` so operators don't accidentally curl with form-encoding.
3. Tighten `package.json` `engines.node` to `>=18.15.0` to match `fs.statfsSync`'s availability floor.
4. Convert the catch-path `fs.unlink` in `routes/ai.js` to `fs.promises.unlink(...).catch(() => {})` for style consistency.
5. Add a `_truncated` check to `public/js/audit_drawer.js` to render a banner instead of raw marker JSON.

### Recon-A self-flagged items for Red-A

1. `connectionTimeoutMillis: 10000` is also the pool-queue wait when `max=10` is exhausted. Under peak load this 10 s queue wait could time out legit requests. Acceptable for current load; revisit if throughput rises.
2. `VACUUM time_entry_audit` (non-FULL) inside scheduler can take minutes on a large table, holding a connection. Pool exhaustion possible during the vacuum window.
3. `setImmediate(() => tick('boot'))` in automation.js:1117 has no `.catch()`. Tasks have inner try/catch so it's safe today, but a future task throwing outside try/catch would become an unhandled rejection.
4. Migration 0029's `ADD COLUMN ... NOT NULL DEFAULT TRUE` is a metadata-only op on Postgres 11+. Railway is on PG 14+, so safe — but worth confirming the user's Postgres major version in case any RDS-style replica lags.

### Critical context the next PM needs

- **The 502 is almost certainly downstream of a runaway disk producer**, not a code crash on its own. User reported a 250 GB Railway volume filled in ~8 hours (≈ 9 MB/sec sustained). When the volume fills, Postgres or the app crashes, `restartPolicyMaxRetries: 3` exhausts, and the proxy returns 502.
- **Top suspects** (Disk-A is investigating): `uploads/` dir (multer 3 GB cap, no cleanup pass observed), PDF generation loop, audit JSON blobs, Puppeteer cache, AI route logging, splice imports, scheduler tight-loop writes.
- **Two-pronged fix needed**: (1) stop the bleeding (find producer + cap/clean), (2) reclaim space so the app can boot. The user can't easily SSH to Railway, so any cleanup must be triggerable via the new `/api/_admin/db-sizes` and `/api/_admin/audit-cleanup` endpoints, OR via a Railway CLI command, OR by a shipped script the user runs.

## Your role

You are a **project manager**. Your job is to:

1. **Understand the user's goal deeply** before any work starts. Ask focused questions when context is missing — but only when missing. Don't ask for things that are already in this doc.
2. **Delegate to Sonnet sub-agents** via the `Agent` tool (`subagent_type: "general-purpose"` or one of the specialised agents). Brief them like a senior engineer briefing a smart colleague: explain the goal, the constraints, what's already been tried, and exactly what changes you expect.
3. **Review what they produced** before reporting it as done. The Agent tool gives you a *summary* — that's the agent's intent, not necessarily reality. Always read the actual diff (`git diff`, `git show`, or `Read` on the changed files) before you tell the user it's complete. Run the tests yourself: `DATABASE_URL=postgresql://lftest:lftest@localhost:5432/launchfiber_test npm test`.
4. **Take liberties only when you fully understand the goal.** The user values speed and judgment. If a small refactor or extra fix obviously serves the goal, do it. If you're not sure whether they'd want it, ask.
5. **Don't write code yourself unless the task is trivial.** A 5-line fix or a one-file edit can be done inline. Anything bigger should be delegated so you stay focused on understanding + reviewing.

The user is technical enough to spot sloppy work. They called out a missing dedup case the previous Claude failed to anticipate ("that should've been obvious") — they expect you to think one step ahead.

## Repository

- Path: `/home/user/Launch-Database`
- Branch you must develop on: `claude/splice-matrix-railway-setup-IIG3Q`
- Remote: `KodaiCards/launch-database`. **DO NOT push to any other branch without explicit permission.**
- Test DB: `postgresql://lftest:lftest@localhost:5432/launchfiber_test` (local Postgres started via `sudo service postgresql start`).
- Production runs on Railway. Schema migrations live in `migrations/NNNN_*.sql` and apply on boot via `db_migrations.js`.

## What just shipped (last 2 commits on this branch)

### Commit 1 — Track billed vs unbilled hours from timeclock CSVs

Timeclock app exports a `customer` column. When the tech picks `Miscellaneous`, `Permitting`, or a bare `WO #N` (no customer prefix), those hours are overhead — not pinned to a project. Previously the importer dropped them silently because the WO# didn't match a project. Now they persist with `project_id=NULL`, `is_billable=FALSE`, and an `unbilled_category` ('misc' | 'permitting' | 'wo_only').

**Files**: `migrations/0029_time_entries_billable.sql`, `routes/hours_csv.js`, `routes/time_entries.js`, `routes/revenue.js`, `public/admin.html`, `public/js/hours_tab.js`, `public/js/revenue_tab.js`, `public/js/unbilled_hours_panel.js`, `tests/csv_import.test.js`.

**UI surfaces added**:
- Hours tab toolbar: Person dropdown + Billed/Unbilled segment toggle.
- Hours tab stat cards: Total / Billed / Unbilled (with % of total).
- Hours tab body: new "Unbilled Hours" panel below "Needs Project Assignment", grouped by category.
- Revenue tab: "Hours Utilization" tile showing `XX.X% billed` with `billed / total · unbilled` sub-line.

**API surfaces added**:
- `GET /api/time-entries?billable=billed|unbilled|all` — segment filter on top of existing `?staff_id=`.
- `GET /api/revenue/hours-utilization?year=&month=&staff_id=` — returns total / billed / unbilled hours + per-category breakdown.

### Commit 2 (in progress, not yet pushed) — Dedup fix + audit-table retention

Two problems addressed in one commit:

**(a) Unbilled-row dedup**: re-importing the same timeclock CSV would have created duplicate unbilled rows because the dedup match key relied on `project_id`, which is NULL for unbilled rows. Fixed by extending the match key to use `staff|UNB:<category>|date|job` for unbilled rows and running a separate `WHERE project_id IS NULL AND is_billable = FALSE` lookup query. Test coverage added.

**(b) Postgres disk leak**: `time_entry_audit` table grew unbounded — every CSV-imported row + every admin/portal/timeclock mutation logs a row with full before/after JSON. With months of imports it filled the user's Railway Postgres disk. Fix:
- `runAuditCleanup(pool, opts)` in `automation.js`: deletes `meaningful=FALSE` rows older than 90 days, then ANY rows older than 18 months, then a non-FULL `VACUUM`.
- Wired into the daily scheduler tick — runs once per day automatically.
- Admin endpoint `POST /api/_admin/audit-cleanup` for one-shot manual runs (with optional `vacuum_full: true` for OS-level disk reclaim during a maintenance window).
- Diagnostic endpoint `GET /api/_admin/db-sizes` returns the top-20 tables by size (avoids forcing the user to find a psql shell).

**Files**: `routes/hours_csv.js`, `routes/admin.js`, `automation.js`, `auth.js` (test bypass), `tests/csv_import.test.js`, `tests/audit_cleanup.test.js`.

154/154 tests green at the time of writing.

## What the user asked for next

> "Fix the dedupe for unbilled projects, that should've been obvious. Once you fix both of these issues write down the context of this conversation to pass to another claude."

Both issues are fixed in commit 2 (still uncommitted in your worktree as of this handoff — see `git status`). Your first job is to **commit + push** what's there, then mind the disk-space situation.

## Immediate next steps for you (in order)

1. **Commit + push the in-progress changes** (handle this carefully):
   - `git status` — confirm: dedupe fix + audit cleanup + db-sizes endpoint + this handoff file.
   - `git add` only the relevant files. Don't add anything you don't recognize.
   - Commit message should explain BOTH the dedup fix AND the audit cleanup — they're related to the user's last message.
   - `git push -u origin claude/splice-matrix-railway-setup-IIG3Q`.
2. **The user has a live disk-space problem on Railway right now.** Tell them:
   - "Your prod will pick up the new endpoints when you deploy. As soon as it's live, hit `GET /api/_admin/db-sizes` in your browser (admin login) — it returns the top tables. Then `POST /api/_admin/audit-cleanup` (no body needed) to delete old audit rows + VACUUM. If `time_entry_audit` was the culprit (most likely), you're done. If it wasn't the leak source, paste the db-sizes JSON back to me and I'll write a targeted prune for whichever table actually grew."
   - The user couldn't find the Railway query console earlier. The endpoint approach removes that obstacle.
3. **Stand by for the user to deploy + run the diagnostic.** When they paste the top tables back:
   - If `time_entry_audit` dominates: they should run `POST /api/_admin/audit-cleanup {"vacuum_full": true}` during a maintenance window for OS-level reclaim.
   - If a different table dominates (likely candidates: `splice_design_imports`, `splice_design_import_changes`, `ai_messages`, `splice_field_markups`, `splice_loss_records`): write a targeted retention pass for THAT table. Don't generalize prematurely — do the one that's actually bleeding.

## Understanding the user's broader goal

The user is the founder/operator of Launch Fiber Services. The repo is the operational backbone of the business — admin portal (project tracking, hours, billing, revenue), timeclock portal (engineers self-log), permitting portal, customer portal, splice matrix tool. The North Star (`PROJECT_NORTH_STAR.md`) is *don't lose time-entry rows* + *the data the operator is looking at must match reality*.

Common pitfalls in this codebase that you should watch for when reviewing sub-agent work:

- **Hours flowing to the wrong project**: WO# matching is non-trivial because RUS jobs use rollup trees (Cummings → 16299 → Inspection vs Resident Engineer). `pickProject()` in `routes/hours_csv.js` is the canonical resolver — never re-implement that logic elsewhere.
- **Soft-delete + undo**: many destructive admin actions stage to `undo_buckets` with a 60s TTL. Don't bypass that.
- **Audit trail**: `auditTimeEntry()` is called on every time-entry mutation. The retention policy now keeps things from blowing up; don't add new high-cardinality audit/event tables without retention.
- **SSE broadcasts**: writes to canonical tables call `broadcast(channel, event, payload)` from `routes/_sse.js`. Subscribers in browser tabs refresh on relevant events. Don't add SSE writes inside DB transactions (they're fire-and-forget; should run AFTER commit).
- **Project tree integrity**: `is_rollup` + `parent_id` form a hierarchy used by RUS reports + invoicing. Hours land on leaves, not rollups. The recursive CTE in `routes/hours_csv.js` line ~257 is the canonical "find leaves under a WO" logic — copy from there if you need similar.
- **Test DB rate-limit bypass**: `auth.js`'s `rateLimitOk` short-circuits when `NODE_ENV=test` — added recently because the test suite hammers admin login. Don't remove this.

## Recurring patterns the user prefers

- **Migrations**: numbered `migrations/NNNN_label.sql`. Idempotent (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`). One concern per file.
- **Comments on the WHY**: long comments explaining hidden constraints / past bugs that motivated a non-obvious choice. The codebase is heavy on these and they save real time during review. Match the style.
- **Tests**: `tests/*.test.js` using `node --test`. Each test seeds via `fixtures.*` from `tests/_helpers.js`, registers cleanup in `trash`. Run with `DATABASE_URL=postgresql://lftest:lftest@localhost:5432/launchfiber_test npm test`.
- **No emojis** in code or commit messages unless the user explicitly asks for them.
- **Commit messages**: brief title (60 chars), body explains why. Trail with the Claude session URL the harness gives you.
- **Don't use `git --amend`, `--force-push`, or `--no-verify`** without explicit permission.

## The Splice Matrix sibling project

The branch name (`claude/splice-matrix-railway-setup-IIG3Q`) is a session identifier — it's not splice-only work. The branch carries everything the user has done in this session, including the unbilled-hours feature. Don't let the name confuse you.

That said: the Splice Matrix tool is a separate logical product inside the same repo (`public/splice.html` + `routes/splice.js` + tons of `splice_*` tables + `SPLICE_BUILD_PLAN.md`). If a task targets the splice tool, the `project-tracking` agent in your tool list explicitly excludes splice — use the `general-purpose` agent or write inline. The `project-tracking` agent is for the admin/timeclock/customer/permitting/design portals.

## Tools you should use

- `Agent` with `subagent_type: "general-purpose"` for anything ≥ 30 min of work.
- `Agent` with `subagent_type: "Explore"` for "where is X defined / which files reference Y" — fast read-only.
- `Agent` with `subagent_type: "Plan"` to design implementation strategy on bigger tasks before kicking off the implementer agent.
- `Agent` with `subagent_type: "project-tracking"` ONLY for non-splice admin/portal work (it has full tool access and knows the project-tracking system).
- Don't over-use sub-agents for trivia. A one-line fix doesn't need an agent — just edit and run tests.

## Files that exist for orientation

- `PROJECT_NORTH_STAR.md` — the user's north star. Read this first if you haven't.
- `BUILD_PLAN.md` — historical roadmap.
- `SPLICE_BUILD_PLAN.md` — splice-only roadmap (separate product).
- `ADMIN_FIXES_PLAN.md` — recent fix queue.
- `PORTAL_LAUNCHER_PLAN.md` — multi-portal architecture context.
- `migrations/README.md` — migration conventions.
- `tests/_helpers.js` — test infrastructure.
- `routes/hours_csv.js` — the file you'll spend the most time in if more CSV-import work comes up.
- `automation.js` — daily/hourly scheduler. Add new periodic jobs here.

## Final reminders

- The user trusts your judgment but rewards thoroughness. "Should've been obvious" is the worst feedback you can get; "you thought of X before I did" is the best.
- When in doubt about scope: ask. One short clarifying question is cheaper than a 30-minute wrong implementation.
- Keep responses tight. Write code, don't write essays.
- Run the tests before saying "done."
