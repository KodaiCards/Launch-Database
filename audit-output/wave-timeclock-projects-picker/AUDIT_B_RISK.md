# AUDIT B — Risk, Regression & Dependency Analysis
# Timeclock Projects Picker Bug
# Agent B (risk + regression + dependency framing) — READ-ONLY
# Date: 2026-05-14

---

## 1. `/api/projects` Caller Inventory

All callers of the list endpoint `GET /api/projects` (no `:id` suffix):

| Caller | File:Line | Wants Leaves Only | Wants Rollups Too | Wants Both w/ Flag | Notes |
|--------|-----------|:-----------------:|:-----------------:|:------------------:|-------|
| `loadProjects()` (timeclock) | `public/timeclock.html:656` | YES (JS filter `!p.is_rollup`) | NO | — | Bug surface; full list fetched, JS-filtered to leaves |
| `loadProjects()` (design portal) | `public/design.html:755` | YES (JS filter `!p.is_rollup` at :1233) | YES (tree table shows all) | **BOTH** | Admin tree renders all incl. rollups; leaf picker filters client-side |
| `loadProjects()` (permitting portal) | `public/permitting.html:742` | YES (JS filter `!p.is_rollup` at :1209) | YES (tree table shows all) | **BOTH** | Same pattern as design |
| `projectsCache` full refresh | `design.html:1351`, `permitting.html:1325` | NO — both tree + leaf surfaces share cache | YES | **BOTH** | Stale-cache refresh on modal open |
| `loadProjects()` (projects_tab.js admin) | `public/js/projects_tab.js:52` | YES (leaf picker via `populateProjectPicker`) | YES (tree table) | **BOTH** | Tree shows rollups as folders; leaf pickers use `child_count===0` |
| `allProjects` full refresh | `admin.html:3645`, `admin.html:4259` | NO — raw full list used for parent picker | YES | **BOTH** | Parent picker needs rollups to assign parent_id |
| Orphan-files reassign panel | `public/js/migration_tools.js:147` | YES (JS filter `!p.is_rollup`) | NO | — | Only real projects shown in orphan attachment dropdown |
| `populateParentDropdown` | `public/js/projects_tab.js:103` | NO | YES — **required** | — | Rollups must appear as valid parent targets |
| Post-new-project-create refresh | `permitting.html:1472` | NO (finds newest by array position) | YES | — | Grabs newest to link potential_permit; rollup filtering not relevant |

**Summary:** 9 distinct call sites. **5 need rollups** (tree views, parent dropdown, post-create linking). **4 are leaves-only** (timeclock picker, orphan panel, leaf dropdowns in design/permitting modals). None currently pass a flag — all rely on client-side filtering after receiving the full list.

---

## 2. Route Signature Current State

`routes/projects.js:29–112` (the list endpoint) supports these query params:

- `?status=` — filter by `p.status`
- `?client_id=` — filter by `p.client_id`
- `?type=` — filter by `p.project_type`
- `?limit=N` / `?limit=all` — pagination cap (default 1000, max 5000)
- `?offset=N` — pagination offset

**There is NO `?include_rollups=`, `?leaves_only=`, or any rollup-filter flag.** The endpoint has zero awareness of `is_rollup` in its WHERE clause. All filtering is done client-side by callers.

Verified by reading: `routes/projects.js:29–112` — `whereStr` is built only from `status`, `client_id`, `type`.

---

## 3. Surgical-Fix Backwards-Compatibility Risk

**Proposed surgical fix:** Add `AND p.is_rollup IS NOT TRUE` to `whereStr` in `routes/projects.js:63`.

**Verdict: BREAKS 5 callers.** 

Callers that would break:

1. **`populateParentDropdown`** (`projects_tab.js:103`) — explicitly fetches `GET /api/projects` (no params) to populate the parent-project picker. It must show rollups as valid parents. A default `is_rollup IS NOT TRUE` filter would make rollup-type parents invisible, causing new leaf projects to be created without parents → flat orphan roots.

2. **`allProjects` tree render** (`admin.html:3645`, `admin.html:4259`, `design.html:1351`, `permitting.html:1325`) — the project tree in all portals renders rollup rows as collapsible folder nodes. Filtering them out server-side collapses the tree to a flat leaf list, breaking the folder/expand UX entirely.

3. **Post-create link** (`permitting.html:1472`) — fetches `/api/projects` unfiltered after creating a project to find the newest and link a potential_permit. If the newest created row happens to be a rollup (e.g., an `ensureRollupChain` create), this code would miss it. Lower severity but still a behavior change.

**Safe surgical fix path** (backwards-compatible): Default the endpoint to return all rows (current behavior). Add an opt-in `?leaves_only=true` param. Callers that want leaves-only can pass it. The timeclock's `loadProjects()` call becomes `GET /api/projects?status=active&leaves_only=true`. No existing caller is broken. Net change: 2–3 lines in `routes/projects.js` + 1 line in `timeclock.html:656`.

However — this surgical fix only addresses the volume problem (rollup rows leaking in). Per REPRO_A's confirmed root cause: **rollup rows are already correctly excluded by the JS `!p.is_rollup` filter**. The real UX problem is that 12 identically-named leaf projects ("Inspection") exist, one per WO area. The surgical fix reduces a ~1200-row unfiltered list to a ~400-row filtered list, but the "12× Inspection" ambiguity **survives**. The surgical fix is necessary but not sufficient.

---

## 4. Schema `is_rollup` Constraint Audit

| Property | Value |
|---|---|
| Column type | `boolean` |
| Default | `DEFAULT false` |
| NOT NULL constraint | **ABSENT** — nullable |
| Defined in | `schema.sql:420` (baseline schema) |
| Added via migration | `scripts/schema_core.sql:825` — `ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_rollup BOOLEAN DEFAULT FALSE` |
| Migration referencing column | `0023_ec_rollup_linkage.sql` — uses `is_rollup = TRUE/FALSE` equality (not `IS TRUE`) |
| Partial index | `idx_projects_rollup` — `WHERE (is_rollup = true)` |
| Unique index | `uniq_project_name_per_parent` — `WHERE (COALESCE(is_rollup, false) = false)` — **this index already uses COALESCE, confirming nullable rows are expected** |

**Verdict: `is_rollup` is nullable (no NOT NULL constraint). NULL rows exist in production (the COALESCE in the unique index proves this was anticipated).** The JS filter `!p.is_rollup` handles NULL correctly (`!null === true`), so NULL rows pass as leaves. The safe SQL form for any new server-side filter is `AND p.is_rollup IS NOT TRUE` (handles both `FALSE` and `NULL`). Do **not** use `AND p.is_rollup = FALSE` — that excludes NULL rows from results, breaking contract-free rows seeded without explicit `is_rollup`.

Evidence: `project_tree_delete.test.js:150` inserts a rollup with `is_rollup=TRUE` explicitly. The leaf child omits `is_rollup` (defaults to NULL or false). The test at line 137 asserts the leaf appears in `GET /api/projects?status=active`, confirming that NULL/false rows must survive any filter.

---

## 5. Cascade-Build Scope Per Spec

Per `audit-output/future/timeclock-picker-spec.md`:

**Endpoints — new or modified:**
- `GET /api/timeclock/picker-data?client_id=X` — new. Queries jobs (existing `/api/jobs` with `client_id` filter) + work_orders (from `concentrators` via `contracts.friendly_label` JOIN, or `ec_work_orders` if modern path exists). Returns `{ jobs, work_orders }`.
- `POST /api/timeclock/clock-in` — modify to accept `{ client_id, job_id, work_order_number }` alongside existing `{ project_id }`. Internal `resolveOrCreateProject()` call wrapping `ensureRollupChain`.
- `POST /api/timeclock/switch` — same shape change as clock-in.
- `resolveOrCreateProject()` helper — new function in `timeclock_module.js`, calls `portal_module.js:ensureRollupChain`. Needs transaction discipline.

**Schema migrations:** None required. All columns exist (`projects.engineering_contract_id`, `projects.work_order_number`, `jobs.program_scope`, `concentrators.*`, `ec_work_orders.*`).

**Frontend changes (timeclock.html):**
- Remove `<select id="ci-project">` from clock-in card.
- Add `<select id="ci-client">`, `<select id="ci-job">`, `<select id="ci-wo">`.
- Add preview `<div aria-live="polite">`.
- Rewrite `clockIn()` and `openSwitchModal()`.
- Update Switch modal with same three dropdowns.
- Entry edit modal: keep existing Client → Project cascade (no change required for this wave).

**Test coverage gaps:**
- No backend unit test for `POST /api/timeclock/clock-in` with `{ client_id, job_id, work_order_number }`.
- No test for `resolveOrCreateProject` with existing match / no-match / partial-rollup-chain.
- No test for `GET /api/timeclock/picker-data`.
- No Playwright spec for timeclock portal at all (confirmed by `grep` above — zero browser specs cover `ci-project`, `ci-client`, or any timeclock DOM IDs).

---

## 6. CI Smoke-Test Coverage Gap

Current test coverage for timeclock picker:

| Test file | Covers timeclock picker? |
|---|---|
| `tests/schema_shape.test.js` | Only asserts `time_clock_sessions` table exists — no endpoint tests |
| `tests/project_tree_delete.test.js` | Tests `GET /api/projects` list and tree delete — not timeclock |
| `tests/browser/projects_tree_state.spec.js` | Admin projects tree expand — no timeclock |
| `tests/browser/psc_rus_tab.spec.js` | PSC inspection tab — no timeclock |
| All other tests | No timeclock coverage |

**Coverage gap: 100%.** No test exercises `POST /api/timeclock/clock-in`, `GET /api/timeclock/picker-data`, or any timeclock DOM path. 

**New tests required for fix-agent:**
1. Backend: `tests/timeclock_picker.test.js` — test `picker-data` endpoint, clock-in with `{ client_id, job_id, work_order_number }` (existing project match + auto-create + rollback on failure), clock-in with legacy `{ project_id }` still works.
2. Schema: Add `time_clock_sessions` column assertions to `schema_shape.test.js` (add `project_id`, `job_id` FK assertions).
3. Browser: `tests/browser/timeclock_picker.spec.js` — assert the three cascade dropdowns exist, client selection populates job list, clock-in submits. (Mirrors the lesson from 2026-05-13: deleting DOM IDs without grepping tests caused CI break. New DOM IDs must have test coverage from the start.)

---

## 7. Cross-Portal Blast Radius

| Route / File | Change Required | Risk |
|---|---|---|
| `timeclock_module.js` | Add `picker-data` endpoint; modify `clock-in` + `switch` | MEDIUM — hot path, needs transaction discipline |
| `portal_module.js` | `ensureRollupChain` called from new context — no code change, but must verify it handles concurrent calls safely (two staff clocking in simultaneously for same WO → race on rollup creation) | HIGH — race condition risk on rollup insert |
| `routes/projects.js` | Only changed if `?leaves_only=true` param added (surgical fix component). No other changes. | LOW |
| `routes/jobs.js` | No change — `?client_id=` filter already supported | NONE |
| `routes/concentrators.js` | No change — `picker-data` endpoint calls DB directly via pool, not via internal HTTP | NONE |
| `public/timeclock.html` | Rebuild clock-in card + switch modal + `clockIn()` + `openSwitchModal()` | MEDIUM — large inline script, no framework, easy to introduce regressions in adjacent modal logic |
| `tests/browser/psc_rus_tab.spec.js` | No DOM IDs from timeclock.html referenced — safe | NONE |
| `tests/project_tree_delete.test.js` | No timeclock IDs — safe | NONE |
| Entry edit modal (`#entry-project`, `#entry-client`) | Spec defers this — no change in cascade wave | NONE |
| Quick-clock buttons | Use `project_id` directly → `POST /api/timeclock/clock-in { project_id }`. Legacy path preserved → no change | NONE |
| Admin hours_tab / held_timecards | Read-only consumers of `time_entries` — unaffected | NONE |

**Rollup-race condition (high severity):** `ensureRollupChain` does `SELECT … WHERE … FOR UPDATE` on the rollup row, then `INSERT IF NOT EXISTS`. Two concurrent clock-ins for the same `(client, job, WO)` with no matching leaf project will both enter the `INSERT` branch. Postgres unique constraints prevent duplicate inserts (one will error), but the error is not currently handled in `ensureRollupChain`. Fix-agent must wrap the `resolveOrCreateProject` path in `ON CONFLICT DO NOTHING` + retry logic or a serializable transaction.

---

## 8. Risk Profile Comparison

### Option 1 — Surgical SQL fix only (`AND p.is_rollup IS NOT TRUE` in route)
- **Risk:** HIGH if applied as default-filter. BREAKS parent dropdown + tree views for 5 callers.
- **Risk:** LOW if applied as opt-in `?leaves_only=true`. Backwards-compatible. Timeclock `loadProjects()` passes the flag.
- **UX improvement:** Marginal. Reduces network payload (fewer rows) but does not fix the "12× Inspection" label ambiguity. User still sees 12 identically-named options.
- **Test effort:** 1 backend assertion for `?leaves_only=true` response shape.
- **Verdict:** Necessary but not sufficient. Ship as part of Option 3, not standalone.

### Option 2 — Full cascade picker rebuild (Client → Job → WO# → Clock In)
- **Risk:** MEDIUM-HIGH due to: (a) `ensureRollupChain` race condition on concurrent clock-ins; (b) large frontend surgery on a 1343-line inline-script HTML; (c) zero existing test coverage means any regression is invisible until a user hits it.
- **UX improvement:** Complete. Fully resolves the "12× Inspection" ambiguity. Matches user's exact stated need.
- **Test effort:** ~3 new test files required.
- **Dispatch risk:** Large enough scope (timeclock_module.js BE changes + timeclock.html FE rebuild + tests) that a single fix-agent run risks API failure mid-run (per 2026-05-13 lesson). Must be split.
- **Verdict:** Correct end state, but not safe as a single dispatch.

### Option 3 — Both sequenced (surgical fix → then cascade rebuild)
- **Risk:** LOWEST. Surgical fix (opt-in `?leaves_only=true` + timeclock uses it) ships immediately with minimal blast radius. Cascade rebuild follows in a separate wave with proper test scaffolding.
- **UX improvement:** Surgical fix: marginal. Cascade: complete. Together: complete.
- **Test effort:** Incremental (surgical: 1 assertion; cascade: 3 new files).
- **Sequencing rule:** Surgical fix must be a separate commit from the cascade FE rebuild to avoid atomic BE+FE failure (per Monday demo post-mortem lesson).
- **Verdict:** RECOMMENDED.

---

## 9. Recommended Fix-Agent Dispatch Plan

**Dispatch A — Surgical fix (1 commit, low risk):**
- Scope: `routes/projects.js` + `public/timeclock.html:656`.
- Change: Add `?leaves_only=true` param support to GET /api/projects; timeclock `loadProjects()` passes it.
- Separate commit: backend first (add param, keep default unchanged), then frontend (pass param in timeclock).
- Tests: add 1 assertion to `project_tree_delete.test.js` confirming `?leaves_only=true` excludes rollups.
- Push after each commit (per 2026-05-13 lesson — push aggressively; don't accumulate).
- Single fix-agent is appropriate for this scope (trivial-to-low complexity).
- Post-push: verify CI green before declaring done.

**Dispatch B — Cascade rebuild BE (1–2 commits):**
- Scope: `timeclock_module.js` only.
- Change: Add `GET /api/timeclock/picker-data`; add `resolveOrCreateProject()` with `ON CONFLICT` + retry; modify `POST /api/timeclock/clock-in` + `switch` to accept new shape.
- Tests: new `tests/timeclock_picker.test.js` — covers `picker-data`, clock-in both paths, conflict/retry.
- Push after each commit.
- Single fix-agent; medium scope but contained to one file + one test file.

**Dispatch C — Cascade rebuild FE (1–2 commits):**
- Scope: `public/timeclock.html` only.
- Change: Replace `#ci-project` with 3-dropdown cascade; rewrite `clockIn()` + switch modal.
- Tests: new `tests/browser/timeclock_picker.spec.js` — assert dropdowns exist, client populates jobs, clock-in works.
- Fix-agent must grep `tests/**/*.spec.js` for any `ci-project` / `#ci-project` references before removing that DOM ID. (Per 2026-05-13 lesson.)
- Push after each commit.
- Single fix-agent.

**Dispatch D — Post-fix verification (read-only):**
- Verify Dispatch A+B+C all landed. CI green check. Confirm `time_clock_sessions` entries have correct `project_id` values via `schema_shape.test.js`.

---

## 10. Top 5 Highest-Severity Risks

1. **CRITICAL — `ensureRollupChain` race condition.** Two staff clocking in simultaneously for the same `(client, job, WO#)` with no existing leaf project → both enter `INSERT` branch → one fails with unique-constraint violation → unhandled error → clock-in silently fails for one staff member. Mitigation: `ON CONFLICT DO NOTHING` + `SELECT` retry in `resolveOrCreateProject`. Must be fixed in Dispatch B before Dispatch C ships.

2. **HIGH — Surgical fix breaks parent dropdown / tree views if applied as default.** If fix-agent adds `AND p.is_rollup IS NOT TRUE` directly to the WHERE clause instead of as an opt-in flag, every project tree in every portal collapses to leaves-only. Rollup folders disappear, new projects can't be parented. Mitigation: opt-in `?leaves_only=true` param only.

3. **HIGH — `is_rollup` is nullable; `AND p.is_rollup = FALSE` would exclude NULL rows.** If any fix-agent uses `= FALSE` instead of `IS NOT TRUE` in SQL, contract-free rows with no explicit `is_rollup` value are silently excluded from `GET /api/projects`. The existing test at `project_tree_delete.test.js:137` would catch this if run — but it must be run. Mitigation: use `IS NOT TRUE` form in all new SQL; ensure test suite passes.

4. **MEDIUM — Cascade FE rebuild deletes `#ci-project` DOM ID; any future test referencing it will break.** Currently zero tests reference `#ci-project` (confirmed by grep). But if any are added between now and Dispatch C, the fix-agent must grep tests before removing. Mitigation: add `tests/browser/timeclock_picker.spec.js` in Dispatch C that asserts the NEW DOM IDs (`#ci-client`, `#ci-job`, `#ci-wo`) rather than the old one — so the new test IS the documentation of the expected shape.

5. **MEDIUM — Dispatch B + Dispatch C must be sequenced, not parallel.** Both touch different files (`timeclock_module.js` vs `timeclock.html`), so a parallel push is technically safe for push contention. However, the FE (Dispatch C) calls the new `picker-data` endpoint from Dispatch B — if Dispatch C is deployed before Dispatch B, the FE will 404 on `GET /api/timeclock/picker-data`. Backend must land first. Mitigation: sequential dispatch order A → B → C.

---

Verified by reading:
- `routes/projects.js:29–112` — full list endpoint, no rollup filter, no flags
- `schema.sql:420` — `is_rollup boolean DEFAULT false` (no NOT NULL)
- `scripts/schema_core.sql:825` — `ALTER TABLE … ADD COLUMN IF NOT EXISTS is_rollup BOOLEAN DEFAULT FALSE`
- `public/timeclock.html:654–705` — `loadProjects()` + `populateProjectSelect()`
- `public/js/projects_tab.js:52–103` — tree render + parent dropdown
- `public/admin.html:3645,4259` — `allProjects` fetches
- `public/design.html:755,1226,1233,1351` — design portal project list + leaf filter
- `public/permitting.html:742,1204,1209,1325` — permitting portal project list + leaf filter
- `public/js/project_picker.js:30` — `child_count===0` leaf detection
- `public/js/migration_tools.js:147–152` — orphan panel leaf filter
- `audit-output/future/timeclock-picker-spec.md` — full spec
- `tests/project_tree_delete.test.js:130–175` — is_rollup constraint + `/api/projects?status=active` assertion
- All test files in `tests/` and `tests/browser/` — confirmed zero timeclock picker coverage

=== TIMECLOCK AUDIT B RISK END ===
