# Red Team A — Adversarial / Break-the-Fix Verification
# Timeclock Projects Picker Wave
# Agent: Red Team A (adversarial framing) — READ-ONLY
# Date: 2026-05-14

---

## 1. Canonical Scope vs Carter's Locked Answers — Corrections Required

Carter answered Q2/Q3/Q4 AFTER CANONICAL.md was written. The canonical has **four places** that now contradict those locked answers and must be patched before a fix-agent is dispatched.

| Location in CANONICAL | Contradiction | Carter's lock |
|---|---|---|
| §3 P2-A scope item 2: "Add `resolveOrCreateProject(…)` helper… Wraps `ensureRollupChain`" | Implies auto-create is in scope for P2-A | Q3: **NOBODY auto-creates.** Picker is strictly read-only over existing records. |
| §3 P2-A scope item 3: "calls `resolveOrCreateProject`" on clock-in with `{client_id, job_id, work_order_number}` | Same — server would attempt to auto-create on unmatched combo | Q3: Mismatched typo = clock-in fails, user retries. No create. |
| §3 P2-A test case 4: "no existing project → auto-creates → `was_created: true` in response" | Explicit auto-create test | Q3: This test case must be **replaced** with a test that asserts `400/422` (no match = hard fail). |
| §3 P2-A test case 5: "Concurrent auto-create (two simultaneous calls, same combo)" | Concurrent create test | Q3: Entire concurrent-create scenario is moot — no auto-create path exists. |
| §4 Q3 framing: describes "approval bypass" option | Auto-create framing in the spec-gap section | Still present as an open question even though Carter closed it. Q3 is CLOSED. |
| §5 Race condition verdict: "resolveOrCreateProject… must be written in P2-A with the same ON CONFLICT…" | Scoped as required P2-A work | With no auto-create, `resolveOrCreateProject` is not needed at all. The race condition verdict is **moot**. |
| §7 P2-A scope (canonical fix plan): repeats `resolveOrCreateProject` + `audit_logs` auto-create entry | Same issue, repeated in the actionable section | Must be removed entirely. |
| §8 Risk R3: "Q3 unanswered — auto-create bypasses approval" | Framed as still-open risk | Carter closed it: Q3 is answered. R3 should be updated: "resolved: no auto-create." |

**Net correction count: 8 distinct places in CANONICAL.md that imply auto-create.** Every one must be purged or rewritten before P2-A ships.

**What P2-A clock-in path should do instead (strict read-only):**
- `POST /api/timeclock/clock-in` with `{client_id, job_id, work_order_number}` → SELECT leaf project matching that exact combo.
- If found (exactly one active match): clock in. If found >1 (ambiguous): return 422 with disambiguation message. If found 0 (no match): return 400/422 with "No project found for that combination — check spelling or contact admin."
- No `resolveOrCreateProject`. No `ensureRollupChain` call from this path.

**Impact on race condition verdict (§5):** The `ensureRollupChain` race condition discussion is still valid for the existing `POST /api/projects` flow but is NOT a concern for the timeclock cascade path under Q3-strict-read-only. Remove from P2-A scope.

**Q4 — Completed projects filter.** Carter: hidden from clock-in, visible in edit-entry only. CANONICAL §3 P2-A does not specify a `status='active'` filter on the leaf-project lookup in `resolveOrCreateProject`. With auto-create removed, the server-side lookup must add `AND p.status = 'active'` — completed projects must not be clock-in targets.

---

## 2. `?leaves_only` Parse Hardening — Required Form

**Verified by reading `routes/projects.js:29–55`:** current `req.query` parsing uses direct string equality (`=== 'all'` for limit). Node/Express `req.query` always delivers strings. The canonical specifies `?leaves_only=true` as the opt-in flag.

**Locked parse pattern for fix-agent:**
```javascript
const leavesOnly = req.query.leaves_only === 'true' || req.query.leaves_only === '1';
```

**Attack surface findings:**
- `?leaves_only=TRUE` (uppercase): evaluates to `false` with `=== 'true'` — **bypass**. Fix: add `.toLowerCase()` or include both strings.
- `?leaves_only=1`: evaluates to `false` unless explicitly handled. Not exploitable in a security sense (it just defeats the filter silently), but inconsistent with standard Express convention. Include `=== '1'` in the locked form above.
- `?leaves_only=` (empty string): `'' === 'true'` is `false` — safe (filter not applied).
- `?leaves_only=false`: `'false' === 'true'` is `false` — safe.
- URL-encoded `%74rue` for `true`: Express `req.query` auto-decodes percent-encoding before the handler sees it — parses as `'true'`, handled correctly.

**Recommended locked form (to include in fix-agent prompt):**
```javascript
const leavesOnly = String(req.query.leaves_only || '').toLowerCase() === 'true'
                   || req.query.leaves_only === '1';
if (leavesOnly) {
  where.push(`p.is_rollup IS NOT TRUE`);
}
```

This handles `true`, `True`, `TRUE`, `1`, rejects everything else.

---

## 3. `IS NOT TRUE` Semantics Verdict

**Verdict: CORRECT and sufficient for current and foreseeable schema.**

`IS NOT TRUE` evaluates:
- `FALSE` → `TRUE` (leaf passes)
- `NULL` → `TRUE` (NULL-is_rollup row passes — correct per schema intent)
- `TRUE` → `FALSE` (rollup excluded — correct)

**Verified:** `schema_core.sql:825` — `is_rollup BOOLEAN DEFAULT FALSE`, no `NOT NULL`. The `uniq_project_name_per_parent` partial index uses `WHERE (COALESCE(is_rollup, false) = false)` — confirming NULL rows are valid leaf rows in the schema design. `project_tree_delete.test.js` inserts a leaf with no explicit `is_rollup` value (defaults to NULL/false) and asserts it appears in `GET /api/projects?status=active`. That test will catch any `= FALSE` mistake.

**Future 3-state column risk:** if a future migration converts `is_rollup` to a tri-state enum (e.g. `rollup_type = 'leaf' | 'client' | 'team'`), `IS NOT TRUE` would be meaningless. That's a migration-level concern, not a current concern. No action required now.

**Other `is_rollup` patterns in `routes/projects.js`:** The file does not reference `is_rollup` in any WHERE clause at all today (confirmed by reading the full route). The only `is_rollup` usage is in INSERT/UPDATE parameter binding. No existing `= FALSE` pattern to fix.

---

## 4. `child_count === 0` Guard Verdict

**Verdict: DEFENSIVE GUARD IS NEEDED — `child_count` is NOT guaranteed.**

**Verified by reading `routes/projects.js:70`:** the query includes `(SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) as child_count` as a subquery in `SELECT p.*`. It is always computed when the list endpoint is called.

**However:** `populateProjectSelect` in `timeclock.html:689` uses the shared `projectsCache` which is populated from `GET /api/projects?status=active`. If any other code path ever stores a partial project object into `projectsCache` (e.g. from a different endpoint like `GET /api/projects/:id` which does NOT compute `child_count`), the guard `child_count === 0` would evaluate `undefined === 0` → `false` — filtering out every project.

**Current risk level: LOW** — `projectsCache` is only populated from the list endpoint. But the guard should be written defensively:
```javascript
let leaves = projectsCache.filter(p =>
  !p.is_rollup &&
  (p.child_count === undefined || p.child_count === 0 || Number(p.child_count) === 0)
);
```
or equivalently: `!p.is_rollup && !(Number(p.child_count) > 0)`.

This form: passes when `child_count` is absent (undefined), passes when it is `0`, passes when it is `'0'` (string from JSON), fails when it is a positive number.

---

## 5. Clock-In Failure UX Under Q3 Strict Read-Only

**The current `clockIn()` function at `timeclock.html:896–910` does:**
```javascript
async function clockIn(){
  const project_id = document.getElementById('ci-project').value;
  const job_id = document.getElementById('ci-job').value || null;
  if (!project_id){ alert('Please select a project before clocking in.'); return; }
  try {
    await api('/api/timeclock/clock-in', 'POST', { project_id, job_id });
    ...
  } catch(e){
    alert('Clock in failed: ' + e.message);
  }
}
```

**Under Phase 2 with a new `{client_id, job_id, work_order_number}` path:**
- If the combo finds no matching project, the server returns a 4xx.
- The catch block fires: `alert('Clock in failed: ' + e.message)` where `e.message` is the raw server error string.
- The user sees something like: `"Clock in failed: No project found for that combination — check spelling or contact admin."`

**Verdict: The failure mode is usable but not polished.** `alert()` is already flagged in Phase 1 demo-blocker cleanup for replacement with `confirmDialog()`. If Phase 2-B ships before that cleanup, engineers see a raw browser `alert()` on no-match.

**Required in P2-B prompt:** The error toast must display a human-readable message specifically for the no-match case (HTTP 422/400). The generic catch-all "Clock in failed: ..." is acceptable for network errors, but the no-match case deserves a specific message: "No matching project found. Check your selections or contact admin to create the project." Use the existing `window.LFS.toast.error()` pattern (visible in `quickClockIn()` at `timeclock.html:877`) — NOT `alert()`.

---

## 6. sessionStorage Kiosk Leak — Verdict

**Verdict: NO LEAK RISK. sessionStorage is tab-scoped by the browser, not user-scoped, and the timeclock auth is cookie-based, not sessionStorage-based.**

**Verified by reading `timeclock.html` auth model:**
- `api()` function at `timeclock.html:528` uses `credentials:'same-origin'` (cookie-based auth). The `sessionStorage.removeItem('lfs_token')` in `signOut()` at `timeclock.html:649` is a cleanup call for the old Bearer fallback pattern (per Monday demo post-mortem). It is not the primary auth mechanism.
- `loadCurrentUser()` calls `GET /api/auth/me` which resolves the session cookie. Each browser tab has its own session independent of sessionStorage.
- `projectsCache`, `jobsCache`, `activeSession`, `currentUser` are all JS heap variables scoped to the page, not sessionStorage.

**Q2 — Stickiness:** Carter answered sessionStorage only (not localStorage). The CANONICAL correctly reflects this (§3 P2-A, P2-C do not spec localStorage). Confirm fix-agent uses `sessionStorage.setItem` / `sessionStorage.getItem` — these ARE tab-scoped and DO clear when the tab closes, so a shared kiosk where browser tabs are distinct per user is safe.

**One edge case:** if a kiosk uses a single persistent tab for all users (e.g. one tab never closes, users just walk up and log in), the sessionStorage selection from user A would persist for user B in that same tab after user A's session cookie expires. However: (a) the existing auth system requires re-login when the cookie expires — at that point page reload clears JS heap, and (b) sessionStorage for picker state is cosmetic (pre-fills dropdowns), not a security boundary. This is LOW risk, not exploitable.

---

## 7. Edit-Entry Completed Projects — Separate Filter Needed

**Verdict: YES, separate filter path needed. Not implemented in CANONICAL as written.**

**Verified by reading `timeclock.html:1090–1110` (`openEditEntryModal`):**
```javascript
populateProjectSelect(document.getElementById('entry-project'), e.project_id, { client_id: cid || null });
```

`populateProjectSelect` filters `projectsCache.filter(p => !p.is_rollup)` — it does NOT filter by `status`. The `projectsCache` is populated from `GET /api/projects?status=active`, which already excludes completed projects server-side via the `status=active` WHERE clause.

**Carter's Q4 lock: completed projects visible in edit-entry / back-fill modal only.**

**Gap:** `loadProjects()` calls `GET /api/projects?status=active` — so completed projects are NOT in the cache at all. An engineer trying to edit an existing time entry that references a completed project will see the project pre-selected in the dropdown (from `selectedId` arg), but if they change the client filter and try to re-select it, the completed project will not appear in the list (it was excluded by `status=active`).

**Required fix for P2-B:** The edit-entry modal needs a separate `loadProjects` call that includes `status=completed` projects (or a combined call for `status=active,completed`). The CANONICAL does not specify this. This is a **new gap** not covered by any CANONICAL item.

**Severity:** MEDIUM — affects correctness of back-fill entries on completed projects, which are real billing records on RUS contracts.

---

## 8. Race Conditions — Other Than `ensureRollupChain`

**Under Q3 strict read-only, `ensureRollupChain` is not called from the timeclock path — that race is moot (see §1).**

**Other race conditions reviewed:**

1. **`projectsCache` staleness:** Cache loaded once on `init()`, never refreshed during session. If admin creates or completes a project after the engineer opens the timeclock tab, the picker state does not update until page reload. Not a race condition in the traditional sense — it's a staleness window. The 5s `setInterval(loadWeek, 5000)` does NOT refresh `projectsCache`. The 1.5s `setInterval(loadActiveSession, 1500)` also does not.
   - **Risk:** Engineer picks a project via the cascade, but the matching project was completed or deleted between page load and clock-in. Server returns 404/error. Error message via `alert()` tells them to retry. LOW severity — acceptable UX for an internal tool.
   - **CANONICAL does not address this.** Should add a `loadProjects()` call on clock-in card render (after clock-out) to reduce the staleness window. Not a blocker but worth noting.

2. **Switch-project modal `populateProjectSelect` staleness:** Same issue — uses `projectsCache` as of page load. Same LOW severity.

3. **No other race conditions found** in the existing clock-in, clock-out, or switch-project flows. The timeclock backend (`timeclock_module.js`) was not changed in this wave. Its existing session logic (SELECT FOR UPDATE on active session check) is not affected.

---

## 9. Backwards-Compat 6-Caller Verification

AUDIT_B_RISK found 9 callers of `GET /api/projects`; 6 need rollups. Verified each:

| Caller | File | Flag passed? | Verdict |
|---|---|---|---|
| `populateParentDropdown` | `projects_tab.js:103` | No flag — plain `GET /api/projects` | **OK** — default behavior unchanged (no flag = rollups included) |
| `allProjects` tree render | `admin.html:3645` | No flag | **OK** |
| `allProjects` tree render | `admin.html:4259` | No flag | **OK** |
| `loadProjects()` design portal | `design.html:755` | No flag | **OK** |
| `loadProjects()` permitting portal | `permitting.html:742` | No flag | **OK** |
| Post-create refresh | `permitting.html:1472` | No flag | **OK** |

**All 6 rollup-needing callers pass no flag — they will continue to receive rollups.** The opt-in `?leaves_only=true` pattern is safe.

**The 3 leaves-only callers** (timeclock, orphan panel, migration_tools) also pass no flag today. After P1 fix, only `timeclock.html:656` gets the new flag. The others continue JS-side filtering — no regression.

---

## 10. Test Files to Create or Extend

**Exact paths based on verified repo test conventions:**

| File | Action | What to cover |
|---|---|---|
| `tests/project_tree_delete.test.js` | **EXTEND** — add 1 test | `GET /api/projects?leaves_only=true` returns zero rows with `is_rollup=TRUE`; `GET /api/projects` (no flag) still returns rollup rows. Use the existing rollup fixture from line 138. |
| `tests/timeclock_picker.test.js` | **CREATE** (new file) | `GET /api/timeclock/picker-data?client_id=X` returns `{jobs, work_orders}`; `POST /api/timeclock/clock-in` with `{project_id}` still works (backward compat); `POST /api/timeclock/clock-in` with `{client_id, job_id, work_order_number}` — matching active project succeeds; same with no match → `4xx` error (NOT auto-create); same with completed-project match → `4xx` (completed excluded from clock-in). |
| `tests/browser/timeclock_picker.spec.js` | **CREATE** (new browser spec) | `#ci-client` exists and is populated after load; selecting client populates `#ci-job`; `#ci-project` DOM ID is ABSENT (pre-push grep: `grep -rn "ci-project" tests/` must return 0 hits before P2-B agent removes it); clock-in submits and does not throw a `pageerror`. |

**Do NOT create a new `schema_shape.test.js` test for `time_clock_sessions` columns** — AUDIT_B suggested this but the schema_shape test already verifies table existence. Column-level FK assertions for timeclock sessions are not part of this wave's scope and would inflate test maintenance.

---

## 11. CI Smoke Risk — DOM ID Changes

**Verified by reading all 3 browser spec files:**

- `tests/browser/psc_rus_tab.spec.js`: asserts `#view-inspection`, `#insp-period`, `#insp-status`. No timeclock DOM IDs. **SAFE.**
- `tests/browser/projects_tree_state.spec.js`: admin portal projects tree. No timeclock DOM IDs. **SAFE.**
- `tests/browser/_db.js`: helper only, no assertions.

**Current timeclock DOM IDs that P2-B will delete:** `#ci-project`, `#switch-project` (replaced by `#ci-client`, `#ci-job`, `#ci-wo`, `#switch-client`, `#switch-job`, `#switch-wo`).

**Grep result (verified):** zero existing browser specs reference `ci-project` or `switch-project`. No CI breakage risk from removing these IDs — **provided** the new `tests/browser/timeclock_picker.spec.js` is created IN THE SAME P2-B COMMIT that removes the old IDs (per 2026-05-13 lesson: new DOM IDs must have test coverage from the start).

**Additional DOM ID to watch:** `#entry-project` in the edit-entry modal is NOT being removed in this wave (CANONICAL defers edit-entry cascade). Confirm fix-agent does not accidentally touch it.

---

## 12. Top 5 Break-the-Fix Scenarios

| # | Scenario | How it breaks | Mitigation |
|---|---|---|---|
| **1** | Fix-agent reads CANONICAL before Q3 patch, implements `resolveOrCreateProject` auto-create | Any employee can create phantom projects with a WO# typo; billing tree corrupted on RUS government contracts | **BLOCK dispatch until CANONICAL is patched.** Remove all auto-create language before fix-agent sees it. |
| **2** | Fix-agent uses `?leaves_only=TRUE` (uppercase) in the FE call | Server receives `'TRUE'`; `=== 'true'` is `false`; filter silently skipped; rollups included in picker (if any slip through) | Lock the parse form to `String(…).toLowerCase() === 'true'` as specified in §2. |
| **3** | Fix-agent adds `IS NOT TRUE` as a **default** WHERE clause (not opt-in) | Breaks 6 callers: parent dropdown empties, all project tree views collapse to leaves only, portal-mode project list breaks | Explicit prompt instruction: opt-in flag ONLY. Existing test `project_tree_delete.test.js` (rollup-in-list assertion) will catch it. |
| **4** | P2-B removes `#ci-project` DOM ID without adding the new `timeclock_picker.spec.js` browser test in the same commit | CI passes (no existing test references `ci-project`) but the new IDs have zero coverage; future regressions are invisible | Mandate same-commit test creation. P2-B prompt must include: "create `tests/browser/timeclock_picker.spec.js` asserting `#ci-client` + `#ci-job` + `#ci-wo` in this same commit." |
| **5** | Edit-entry modal uses `GET /api/projects?status=active` only; back-fill entry on a completed project loses project selection | Engineer tries to fix an hours entry on a completed project; completed project is absent from picker; entry saves with wrong project_id or `null` | P2-B prompt must specify: edit-entry modal loads `GET /api/projects?status=active,completed` (or equivalent) — separate from the clock-in cascade which is active-only. |

---

=== TIMECLOCK REDTEAM A ADV END ===
