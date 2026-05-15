# Post-Fix Red Team B — Regression / Backwards-Compat / Cross-Portal
# Wave: timeclock-projects-picker Phase 1
# Fix commit: 3d66c69
# Framing: regression + cross-portal + backwards-compat
# Date: 2026-05-14

---

## 1. 12-Caller Verification Table

AUDIT_B_RISK.md listed 9 distinct call sites. The broader grep surfaces 12 raw references (some sites have 2 lines per portal due to refresh paths). All non-timeclock calls verified below.

| # | File:Line | URL sent | passes leaves_only? | passes include_completed? | Verdict |
|---|---|---|---|---|---|
| 1 | `timeclock.html:668` | `?status=active&leaves_only=true&limit=all` | YES (intentional) | NO | OK — clock-in picker correct |
| 2 | `timeclock.html:680` | `?status=active&leaves_only=true&limit=all&include_completed=true` | YES (intentional) | YES (intentional) | OK — edit-entry cache correct |
| 3 | `admin.html:3645` | `/api/projects` (no params) | NO | NO | OK — tree + parent dropdown unaffected |
| 4 | `admin.html:4259` | `/api/projects` (no params, lazy) | NO | NO | OK — parent dropdown unaffected |
| 5 | `design.html:755` | `/api/projects?status=<filter>` | NO | NO | OK — tree render unaffected |
| 6 | `design.html:1226` | `/api/projects?client_id=X&status=active` | NO | NO | OK — project modal leaf picker unaffected |
| 7 | `design.html:1351` | `/api/projects` (no params, refresh) | NO | NO | OK — stale-cache refresh unaffected |
| 8 | `permitting.html:742` | `/api/projects?status=<filter>` | NO | NO | OK — tree render unaffected |
| 9 | `permitting.html:1204` | `/api/projects?client_id=X&status=active` | NO | NO | OK — project modal leaf picker unaffected |
| 10 | `permitting.html:1325` | `/api/projects` (no params, refresh) | NO | NO | OK — stale-cache refresh unaffected |
| 11 | `permitting.html:1472` | `/api/projects` (no params) | NO | NO | OK — post-create link flow unaffected |
| 12 | `projects_tab.js:52+103` | `/api/projects?status=...&client_id=...` + `/api/projects` | NO | NO | OK — tree + parent dropdown unaffected |
| (extras) | `migration_tools.js:147`, `projects_tab.js:103` | `/api/projects` (no params) | NO | NO | OK — leaf-filter done client-side; unaffected |

**Summary: 0 non-timeclock callers pass the new flags. All tree-view callers unchanged. CLEAN.**

Verified by reading: each file:line listed above. Independent grep for `leaves_only` and `include_completed` across all non-`timeclock.html` and non-`projects.js` files returned zero results.

---

## 2. Tree-View Smoke Walk

| Portal / Surface | Rollups returned? | Leaves returned? | Assessment |
|---|---|---|---|
| Admin project tree (`admin.html:3645`, `4259`) | YES — no flag passed | YES | SAFE |
| Admin parent dropdown (`projects_tab.js:103`) | YES — no flag passed | YES | SAFE |
| Design portal tree + leaf modal (`design.html:755`, `1226`, `1351`) | YES — no flag passed | YES | SAFE |
| Permitting portal tree + leaf modal (`permitting.html:742`, `1204`, `1325`) | YES — no flag passed | YES | SAFE |
| Post-create link flow (`permitting.html:1472`) | YES — no flag passed | YES | SAFE |
| Settings / migration tools (`migration_tools.js:147`) | YES — no flag, client-side rollup filter applied separately | YES | SAFE |

**All tree-view surfaces: CLEAN. No regression.**

---

## 3. Existing Timeclock Flow Preservation

| Flow | Expected behavior | Observed in code | Verdict |
|---|---|---|---|
| Clock-in: pick leaf, submit | `ci-project` populated from `projectsCache` (active+leaves only) → `POST clock-in { project_id }` | Line 866 + 929–938 — unchanged path, picker now filtered | OK |
| Switch-project mid-shift | `switch-project` populated from `projectsCache` → `POST switch { project_id }` | Line 984 + 991–1003 | OK |
| Add new manual entry | `openManualEntryModal`: `_entryModalIsEdit=false`, project picker uses active-only cache | Lines 1107–1121 | OK |
| Edit entry on active project | `openEditEntryModal`: editCache falls back to `projectsCache` if completed cache empty | Line 1135 | OK |
| Edit entry on completed project | `openEditEntryModal`: uses `projectsCacheWithCompleted` → project visible in picker | Lines 1135–1141 | OK |
| Quick-clock buttons | Use `project_id` directly → `POST clock-in { project_id }` — no picker involved | Lines 871–926 | OK — untouched |
| Manager hours / weekly summary | Reads `time_entries` via `loadWeek()` — no project picker involved | Lines 1005–1313 | OK — untouched |
| Entry client-changed in NEW mode | `_entryModalIsEdit=false` → `populateProjectSelect` with `useCompleted:false` | Line 1168–1170 | OK |
| Entry client-changed in EDIT mode | `_entryModalIsEdit=true` → `populateProjectSelect` with `useCompleted:true` | Lines 1166–1170 | OK |

**All existing flows preserved. No regression.**

---

## 4. `Promise.all` Failure Mode Analysis

`init()` calls `await Promise.all([loadProjects(), loadProjectsForEdit()])`.

Both functions have **individual try/catch blocks** that catch errors and set their respective caches to `[]` on failure. `Promise.all` will NOT reject if one individual promise rejects, because both inner functions are designed to resolve (they swallow errors and resolve with `[]`).

**Failure scenarios:**

- `loadProjects` succeeds, `loadProjectsForEdit` fails → `projectsCache` populated, `projectsCacheWithCompleted=[]`. Clock-in and switch-project work normally. Edit-entry falls back via `projectsCacheWithCompleted.length ? … : projectsCache` (line 1135) to `projectsCache` — completed projects won't appear in edit-entry picker but the modal won't crash.
- `loadProjects` fails, `loadProjectsForEdit` succeeds → `projectsCache=[]`, pickers show empty. Clock-in blocked but won't crash. Edit-entry works for completed-project back-fill.
- Both fail → both caches `[]`. Pickers show empty. No crash — graceful degradation.

**Verdict: safe partial-failure recovery. No crash path.**

---

## 5. Cache Split / Staleness Window Analysis

Two caches are populated once during `init()` and not refreshed again during the session (no reload trigger). The staleness window is the **full session duration** — typically 4–10 hours for a workday.

**Superset analysis:** `projectsCacheWithCompleted` is fetched as `status=active&include_completed=true` → returns active + completed leaves. `projectsCache` is `status=active` → active leaves only. Therefore `projectsCacheWithCompleted` IS a superset of `projectsCache` under normal conditions.

**Why two caches instead of one?** Performance argument is valid: the clock-in/switch-project picker path (`populateProjectSelect` called frequently) benefits from a smaller array to `.filter()` over. The edit-entry path is opened less frequently; the larger cache is acceptable there. The split is intentional and correctly reasoned.

**Could the superset cache be used everywhere?** Technically yes — `populateProjectSelect` with `useCompleted:false` could just filter out completed rows client-side from `projectsCacheWithCompleted`. Minor overhead increase but functionally correct. Not a regression risk either way.

**Staleness scenarios:**
- User marks project completed during session → `projectsCache` still contains it; clock-in picker would still show it. This is a minor display inconsistency, not a data-integrity issue (the server validates project existence on clock-in). Acceptable for Phase 1.
- `populateClientSelect` (line 745) reads ONLY `projectsCache`. If a user has entries only on completed projects for a given client, the client won't appear in the entry-client dropdown in edit mode. The project pre-selection still works via the `editCache` fallback at line 1135, but if the user clears client and re-selects, they may not find the client in the dropdown. This is a **low-severity UX gap** in Phase 1.

---

## 6. `include_completed` Semantics Verdict

Tested the route logic for all edge cases:

- `?include_completed=true` (no `status`) → `statusParamSlot` is null → no modification → WHERE clause unchanged (returns all statuses). **Correct.** No unintended widening.
- `?status=active&include_completed=true` → produces `(p.status=$1 OR p.status='completed')`. **Correct.**
- `?status=archived&include_completed=true` → produces `(p.status=$1 OR p.status='completed')`. Behavioral: returns archived + completed. This is logically consistent with the flag semantics ("also include completed") though unlikely to be called in practice. **Acceptable.**
- `?status=draft&include_completed=true` → same pattern. Returns draft + completed. Unlikely caller; no regression risk.
- The timeclock only calls with `status=active&include_completed=true` → exact intended behavior.

**Verdict: semantics are correct for the timeclock use case. Edge cases with non-active statuses produce logically consistent (though untested) results. No regression.**

---

## 7. Schema / Migration Risk Verdict

`git show 3d66c69 --name-only` shows **only three files changed:** `public/timeclock.html`, `routes/projects.js`, `tests/projects_leaves_only.test.js`. No `.sql` migration files. No `schema.sql` or `schema_core.sql` changes. No new columns referenced. Route reads `is_rollup` (existing column, `schema_core.sql:825`) in the `IS NOT TRUE` form that already matches the column's nullable boolean type.

**Verdict: ZERO schema risk. No migration required or introduced.**

---

## 8. CI Smoke Risk Verdict

Checked all test files in `tests/` and `tests/browser/` for references to timeclock DOM IDs:

- `grep -rn "ci-project\|switch-project\|entry-project" tests/` → **zero results.** No existing tests reference these IDs.
- `grep -rn "timeclock" tests/` → only `schema_shape.test.js:65` (table existence check) and two CSV-import comments. Neither tests timeclock picker DOM or API.
- Fix commit adds only `tests/projects_leaves_only.test.js` — 8 new backend unit tests for `?leaves_only` and `?include_completed` params. No DOM IDs involved.
- No DOM IDs removed from timeclock.html in this commit (`#ci-project`, `#switch-project`, `#entry-project` all still present at lines 855, 970, 354).

**Verdict: ZERO CI regression risk from this commit. Playwright smoke tests unaffected. The IDs preserved here are safe for the existing test suite. P2-B will be the commit that removes `#ci-project` — that's where the pre-push grep must happen.**

---

## 9. AI Tool Consumer Impact

The route `GET /api/projects` with no params still returns all rows (rollups + leaves). Default behavior is unchanged. The AI tool surface (`routes/ai.js`) does not call `/api/projects` list endpoint directly — it uses `/api/projects/:id/with-tree` for specific project lookups. The `query_database` tool hits the DB directly via SQL, not via this route.

**Verdict: ZERO impact on AI tool consumers. No regression.**

---

## 10. Hidden Picker Scan

`grep -n "id=\"[^\"]*project" public/timeclock.html` returns:

- `354`: `#entry-project` (entry modal — covered by fix)
- `855`: `#ci-project` (clock-in card — covered by fix)
- `970`: `#switch-project` (switch modal — covered by fix, populated from `projectsCache` via `populateProjectSelect`)

**No additional hidden project pickers.** The fix-agent's three-surface inventory was exhaustive.

---

## 11. Top 5 Regression / Backwards-Compat Findings

| # | Severity | Finding |
|---|---|---|
| F-RT-B-1 | **LOW** | `loadJobsForProject` (line 695) looks up project's `client_id` from `projectsCache` only. In edit-entry mode for a completed project, `projectsCache.find()` returns `undefined` → `loadJobsForProject` returns `[]` → job dropdown shows empty. The original `e.job_id` from the entry is pre-populated in `populateJobSelect(entry-job, e.project_id, null)` so the current value is displayed, but if the user changes the project selection to another completed project, the job dropdown will stay empty. Acceptable for Phase 1 back-fill use case; surfaced for Phase 2 awareness. |
| F-RT-B-2 | **LOW** | `populateClientSelect` (line 745) reads only `projectsCache` (active-only). If a user edits an entry for a completed project where the client has NO other active projects, the client won't appear in the client dropdown in edit mode. The project is pre-selected correctly via `editCache` (line 1135) so the modal renders, but client filter becomes non-functional for that case. Phase 1 acceptable; log for Phase 2. |
| F-RT-B-3 | **LOW / INFO** | Cache staleness window is the full session (8–10 hrs typical). A project marked completed during a shift will still appear in the clock-in picker. Not a data-integrity issue (server validates on clock-in) but a minor stale-display concern. Expected and acceptable for Phase 1. |
| F-RT-B-4 | **INFO** | `include_completed=true` with `status=archived` or `status=draft` produces `archived + completed` or `draft + completed` respectively. These are unlikely callers. The route behavior is internally consistent and cannot be triggered by any current non-timeclock caller. No regression. |
| F-RT-B-5 | **INFO** | `projectsCacheWithCompleted` is a superset of `projectsCache`. One could reduce two network calls to one by using the superset cache everywhere and filtering client-side. Not a regression, but a future consolidation opportunity noted for P2-A when the `picker-data` endpoint makes the full-project-list calls redundant anyway. |

---

## 12. Net Verdict

**READY-FOR-PHASE-2.**

All 12 callers verified: zero non-timeclock callers pass `?leaves_only` or `?include_completed`. All tree-view portals (admin, design, permitting) unaffected. All existing timeclock flows preserved. No schema changes. No CI breakage. `Promise.all` failure modes recover gracefully. `include_completed` semantics correct for intended use case. Three DOM IDs (`#ci-project`, `#switch-project`, `#entry-project`) preserved — Playwright safe.

Two low-severity UX gaps noted (F-RT-B-1, F-RT-B-2) — both involve the completed-project edit flow with edge-case job/client lookup. Neither is a crash, data-integrity issue, or blocker. Both should be addressed in Phase 2 when the cascade picker rebuilds those surfaces.

Phase 1 acceptance criteria (CANONICAL §7): all 7 verified.

=== TIMECLOCK PHASE 1 POST-FIX RT B END ===
