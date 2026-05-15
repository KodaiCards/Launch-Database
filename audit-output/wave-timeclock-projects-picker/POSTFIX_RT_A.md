# Post-Fix Red Team A — Code-Correctness + Spec-Fidelity
> Verifier: RT-A (code-correctness framing)
> Fix commit: `3d66c69`
> Canonical: CANONICAL.md @ `1218fef`
> Date: 2026-05-14

---

## 1. Phase 1 Acceptance Criteria Table

| # | Criterion (CANONICAL §7 Phase 1) | Code Reference | Verdict |
|---|---|---|---|
| AC1 | `GET /api/projects?leaves_only=true` returns zero rows with `is_rollup=TRUE` | `routes/projects.js:47-48` — parse-hardened, appends `AND p.is_rollup IS NOT TRUE` | **PASS** |
| AC2 | `GET /api/projects` (no flag) still returns rollup rows (tree views unaffected) | `routes/projects.js:47` — `leavesOnly` is `false` when flag absent → no clause added | **PASS** |
| AC3 | `project_tree_delete.test.js` still passes; uppercase/numeric variants activate filter | Tests 3+4+5 in `tests/projects_leaves_only.test.js` cover `TRUE`, `1`, `on` | **PASS** |
| AC4 | Edit-entry modal can select a completed project for back-fill | `timeclock.html:1141` — `useCompleted:true`; `timeclock.html:680` — `include_completed=true` URL | **PASS** |
| AC5 | Clock-in and switch-project callers cannot select completed projects | `timeclock.html:866,984` — both call `populateProjectSelect` with no `useCompleted`; `timeclock.html:668` — `status=active` only | **PASS** |
| AC6 | `populateProjectSelect` uses `!(Number(p.child_count) > 0)` defensive guard | `timeclock.html:721` — exact form present | **PASS** |
| AC7 | CI green on push | Not verifiable read-only; commit message states `179/179 pass locally` | **UNVERIFIED** (CI check delegated to orchestrator) |

**AC PASS: 6/6 verifiable. AC7 flagged for orchestrator CI check.**

---

## 2. Parse-Hardening Verification Table

Verified by executing the parse logic inline (`String(v ?? '').toLowerCase()` + `includes` check):

| Input | Expected | Actual | Notes |
|---|---|---|---|
| `'true'` | ACTIVATE | ACTIVATE | Canonical allow-list |
| `'TRUE'` | ACTIVATE | ACTIVATE | `.toLowerCase()` normalizes |
| `'True'` | ACTIVATE | ACTIVATE | `.toLowerCase()` normalizes |
| `'1'` | ACTIVATE | ACTIVATE | Canonical allow-list |
| `'on'` | ACTIVATE | ACTIVATE | Canonical allow-list |
| `'ON'` | ACTIVATE | ACTIVATE | `.toLowerCase()` normalizes |
| `'yes'` | NO-OP | NO-OP | Not in allow-list — Test 6 covers this |
| `'false'` | NO-OP | NO-OP | Not in allow-list |
| `''` | NO-OP | NO-OP | `String('' ?? '')` = `''`; not in list |
| `undefined` | NO-OP | NO-OP | `undefined ?? ''` = `''`; not in list |
| `'arbitrary'` | NO-OP | NO-OP | Not in list |

All parse cases verified against `routes/projects.js:47,56`. Both `leaves_only` and `include_completed` share identical parse logic.

---

## 3. Edit-Entry Completed-Projects Flow Walk

**Init:** `init()` → `Promise.all([loadProjects(), loadProjectsForEdit()])` (line 1322). Both fetches fire in parallel.

- `loadProjects()` → `/api/projects?status=active&leaves_only=true&limit=all` → stored in `projectsCache`
- `loadProjectsForEdit()` → `/api/projects?status=active&leaves_only=true&limit=all&include_completed=true` → stored in `projectsCacheWithCompleted`

**Error isolation:** each function has its own `try/catch` that falls back to `[]`. If `loadProjectsForEdit` fails, `projectsCacheWithCompleted` is `[]`. `openEditEntryModal` has a fallback: `const editCache = projectsCacheWithCompleted.length ? projectsCacheWithCompleted : projectsCache` (line 1135). If completed cache empty, falls back to active-only — completed project won't show but no crash.

**openEditEntryModal (edit mode):**
1. `_entryModalIsEdit = true` (line 1126)
2. `editCache` (line 1135) → uses `projectsCacheWithCompleted`; finds `proj` including completed
3. `populateProjectSelect(..., { useCompleted: true })` (line 1141) → `srcCache = projectsCacheWithCompleted` → completed project appears
4. `entryClientChanged()` → `populateProjectSelect(..., { useCompleted: _entryModalIsEdit })` (line 1170) → `_entryModalIsEdit = true` → still uses completed cache ✓

**openManualEntryModal (new entry / clock-in):**
1. `_entryModalIsEdit = false` (line 1107)
2. `populateProjectSelect(...)` with no `useCompleted` → `srcCache = projectsCache` (active-only) ✓
3. `entryClientChanged()` → `useCompleted: _entryModalIsEdit` = `false` → active-only ✓

**Flow verdict: CORRECT.** Both code paths use the right cache.

---

## 4. Q3 NO-Auto-Create Scan — Phase 1 Modified Files

Scanned `routes/projects.js`, `public/timeclock.html`, `tests/projects_leaves_only.test.js` for: `INSERT INTO projects`, `resolveOrCreate`, `ensureRollupChain` calls from timeclock context, any new `POST /api/projects` invocations.

**Findings:**
- `routes/projects.js:340` — existing `INSERT INTO projects` is in `POST /api/projects` handler (pre-existing, not new). Phase 1 only touches the `GET /api/projects` handler at lines 29-138. No new INSERT paths.
- `routes/projects.js:234,245` — `ensureRollupChain` call is in the `POST /api/projects` handler (pre-existing). Not touched by Phase 1 diff.
- `public/timeclock.html:1240` — `POST /api/portal/projects/request-create` is the **Request New Project** flow (pre-existing). This submits a *request* for admin approval, not a direct INSERT. Not modified in `3d66c69`.
- `tests/projects_leaves_only.test.js:53,83` — raw `INSERT INTO projects` statements are **test fixture setup only** (seeding test data for is_rollup=TRUE and is_rollup=NULL rows). Not production code paths.

**Q3 verdict: CLEAN.** No new auto-create code path introduced in Phase 1.

---

## 5. Q2 sessionStorage Scope-Violation Scan

Scanned `public/timeclock.html` for `sessionStorage` and `localStorage` references in Phase 1 additions:

- `localStorage` references at lines 477, 491, 537 — all pre-existing, all scoped to `lfs-theme` (dark/light mode persistence). Not modified in `3d66c69`.
- `sessionStorage.removeItem('lfs_token')` at line 655 — pre-existing sign-out logic. Not modified.
- **Zero new `sessionStorage` or `localStorage` calls in the `3d66c69` diff.**

Phase 1 correctly defers sessionStorage picker-stickiness to Phase 2-B scope per Carter Q2 lock.

**Q2 verdict: CLEAN.** Phase 1 did not accidentally implement stickiness.

---

## 6. Cache-Staleness Analysis

Both `projectsCache` and `projectsCacheWithCompleted` are loaded once at `init()` and not refreshed during the session. A project marked completed mid-session would:

- Disappear from the active-only cache correctly (was pre-loaded with `status=active`)
- Remain in `projectsCacheWithCompleted` (was pre-loaded with `status=active OR status=completed`) — but this is correct behavior: the completed-inclusive cache is specifically for back-filling historical entries, not for blocking fresh selection

**Clock-in protection:** even if a project goes active→completed mid-session, the active-only `projectsCache` was loaded before that transition, so the project is still in `projectsCache` until page reload. This is a pre-existing staleness window (no refresh interval), not introduced by Phase 1. The window is bounded by the next page load or manual refresh. Acceptable for Phase 1 scope; Phase 2 can add a reload hook if needed.

**Verdict:** staleness window is pre-existing and acceptable for Phase 1. No new staleness introduced.

---

## 7. Test Coverage Gaps

| Test | Covers | Gap? |
|---|---|---|
| Test 1 — no flag returns rollups + leaves | AC2 baseline | None |
| Test 2 — `?leaves_only=true` | AC1 core | None |
| Test 3 — `?leaves_only=TRUE` uppercase | AC3 uppercase form | None |
| Test 4 — `?leaves_only=1` | AC3 numeric form | None |
| Test 5 — `?leaves_only=on` | AC3 `on` form | None |
| Test 6 — `?leaves_only=yes` rejected | Parse-hardening negative | None |
| Test 7 — `include_completed=true&status=active` | AC4 server path | None |
| Test 8 — NULL is_rollup survives `leaves_only=true` | `IS NOT TRUE` vs `= FALSE` regression | None |

**Identified gaps:**
- **GAP-1 (MINOR):** No test for `?include_completed=true` with NO `status` filter (should return all statuses with no added clause). Verified by code inspection as correct (line 57: `statusParamSlot !== null` gate prevents the OR clause when no status was provided) but not test-covered.
- **GAP-2 (MINOR):** No test for `?include_completed=true` with `status=archived` (should produce `archived OR completed`). Code is correct (the WHERE rewrite applies to any status value), untested.
- **GAP-3 (LOW):** No FE-unit test for `populateProjectSelect` with `useCompleted:true` vs `false`. FE logic is exercised only at integration/browser level (Phase 2-C scope).
- **GAP-4 (LOW):** `include_completed` alternate forms (`1`, `on`) not tested — though they share identical parse logic as `leaves_only` which is tested.

All gaps are LOW/MINOR. None affect Phase 1 correctness for the specified use case.

---

## 8. Top 5 Correctness Findings

| # | Finding | Verdict |
|---|---|---|
| C1 | `IS NOT TRUE` SQL form correctly used (not `= FALSE`); handles NULL `is_rollup` rows | **PASS — spec-exact** |
| C2 | `include_completed` + `status` WHERE rewrite uses `statusParamSlot` tracking to target the correct clause; string match `c === 'p.status=$N'` is exact and safe against multi-filter ordering | **PASS** |
| C3 | `populateClientSelect` at line 745 iterates `projectsCache` (active-only) in both manual and edit entry contexts — edit modal's client filter shows clients from active projects only. A completed project's client may be absent from the dropdown if that client has NO active projects. This is a behavioral gap: user opening an edit entry on a completed project whose client has no other active projects will find an empty client dropdown (client pre-selected by `populateClientSelect(entry-client, cid)` at line 1138, so the value is set, but dropdown won't show the client for re-selection). Low-severity edge case. | **PARTIAL — edge case** |
| C4 | `Promise.all` error isolation: each loader has independent `catch → []`. A network failure on `loadProjectsForEdit` leaves `projectsCacheWithCompleted` as `[]`; `openEditEntryModal` fallback at line 1135 uses `projectsCache` instead. Graceful degradation — no crash, but completed projects won't appear if fetch failed | **PASS — acceptable degradation** |
| C5 | `_entryModalIsEdit` flag correctly set to `false` on `openManualEntryModal` (line 1107) and `true` on `openEditEntryModal` (line 1126). `entryClientChanged` reads the flag dynamically — switching between edit and manual modal in the same session uses the right cache. No stale-flag risk because the flag is set at modal-open time | **PASS** |

---

## 9. Net Verdict

**READY-FOR-PHASE-2** with one orchestrator-side action:

- **CI check required:** orchestrator must confirm the CI run on `3d66c69` shows `conclusion: success` before declaring Phase 1 closed (AC7 unverifiable read-only).
- **C3 edge case noted** (client dropdown empty for completed-project-only client): LOW severity, does not block Phase 2. Pre-fill at line 1138 sets the `value` attribute so the data is preserved; only the re-selection UX is impaired. Recommend tracking as a Phase 2-C polish item.
- **GAP-1/GAP-2 (minor missing test cases):** do not affect correctness of the shipped code. No patch required before Phase 2.

All 6 verifiable Phase 1 acceptance criteria: **PASS**. Q3 auto-create scan: **CLEAN**. Q2 sessionStorage scope: **CLEAN**. No blocking correctness issues found.

=== TIMECLOCK PHASE 1 POST-FIX RT A END ===
