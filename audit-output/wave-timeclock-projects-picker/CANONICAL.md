# Timeclock Projects Picker — Canonical Fix Plan
> Peer cross-check + consolidation. Date: 2026-05-14.
> Inputs: REPRO_A, REPRO_B, AUDIT_A_SCOPE, AUDIT_B_RISK, timeclock-picker-spec.md
> Independent verifications: /api/projects caller inventory, ensureRollupChain source, is_rollup schema.

---

## PATCH HISTORY

| Date | Patches Applied | Sections Changed |
|---|---|---|
| 2026-05-14 | A: Removed all 8 auto-create references (Carter Q3 lock: nobody auto-creates, picker strictly read-only, no-match = 422). B: localStorage → sessionStorage throughout (Carter Q2 lock). C: `?leaves_only` parse-hardening locked form added. D: Edit-entry completed-projects gap (new, Carter Q4 lock) added to Phase 1. E: `child_count` guard changed to `!(Number(p.child_count) > 0)` (undefined-safe). F: `?limit=all` already-supported note added. G: Phase 1 acceptance criteria updated. H: Phase 2 acceptance criteria updated. Q3/Q4 spec-gap section updated to closed status. | §3 P2-A, §4, §5, §7 Phase 1, §7 Phase 2, §8 R3, §9 GATE, self-audit table added |

---

## Self-Audit Table

| Q | Carter's lock | CANONICAL references | All consistent? |
|---|---|---|---|
| Q2 | sessionStorage only (NOT localStorage) | §4 Q2 text; §7 P2-B item; §7 P2-B acceptance criteria; §9 dispatch sequence P2-B | **Y** — all instances use sessionStorage |
| Q3 | NOBODY auto-creates; picker is strictly read-only; mismatched combo = 422, user retries | §4 Q3 text (closed); §5 race verdict; §7 P2-A items 2–4; §7 P2-A tests; §8 R3; §9 P2-A scope | **Y** — all `resolveOrCreateProject` and INSERT references removed; server-side SELECT-only; 422 on no-match |
| Q4 | Completed projects hidden on clock-in; visible in edit-entry / back-fill modal only | §4 Q4 text (closed); §7 Phase 1 item 4; §7 Phase 1 acceptance criteria item 3; §7 P2-B item 7; §9 Phase 1 | **Y** — clock-in callers use `status=active`; edit-entry modal gets `include_completed=true` flag (Option X) |

---

## 1. Cross-Check Table

| # | Finding | Raised By | A AGREE/DISAGREE/UNCERTAIN | B AGREE/DISAGREE/UNCERTAIN | Canonical Verdict |
|---|---|---|---|---|---|
| F1 | Primary symptom surface is `timeclock.html` only (`#ci-project`, `#switch-project`) | Both | AGREE | AGREE | CONFIRMED |
| F2 | Root picker: `populateProjectSelect()` line 689, filter `!p.is_rollup` | Both | AGREE | AGREE | CONFIRMED |
| F3 | API source: `GET /api/projects?status=active`, no server-side `is_rollup` filter | Both | AGREE | AGREE | CONFIRMED |
| F4 | **Why 12 "Inspections" appear: real leaf projects, one per WO/SA, not rollup leak** | A (REPRO_A §3, AUDIT_A §5) | AGREE — filter works; collision is real data | UNCERTAIN — "Both paths land same symptom" (REPRO_B §3) | **RESOLVED: A is correct.** `is_rollup=TRUE` reliably set by `findOrCreateRollup`. 12 are real leaves. Rollup-null path is theoretical only (no code path creates it, confirmed by `findOrCreateRollup` source). Symptom = name collision, not rollup leak. |
| F5 | `is_rollup` is nullable (no NOT NULL), COALESCE in unique index proves nullable rows expected | B (AUDIT_B §4) | UNCERTAIN — "theoretical; no known code path produces it for rollup rows" (AUDIT_A §3) | AGREE | **RESOLVED: B wins on the schema fact.** Column is nullable. Any new server-side filter MUST use `IS NOT TRUE`. However A is correct that no production code path creates NULL-rollup rows in normal operation. |
| F6 | Adding `AND p.is_rollup IS NOT TRUE` as a DEFAULT breaks 5+ callers | B (AUDIT_B §3) | DISAGREE in AUDIT_A (A proposed default filter in §7) | AGREE | **B is correct.** Independent grep found 12 GET-list callers; callers at `projects_tab.js:103`, `admin.html:3645/4259`, `design.html:1351`, `permitting.html:1325/1472` all require rollups. Default filter breaks parent dropdown + tree views. Opt-in `?leaves_only=true` is the safe path. |
| F7 | Surgical fix alone does NOT resolve user-visible symptom (12 Inspection labels persist) | Both (per REPRO_B §3 + AUDIT_B §3) | AGREE — "fix is hardening, not symptom-addressing" | AGREE | CONFIRMED |
| F8 | `child_count` guard missing from `populateProjectSelect` (uses `!is_rollup` only, not `child_count===0`) | B (REPRO_B §4) | AGREE — noted in AUDIT_A §5 | AGREE | CONFIRMED. Minor latent bug. Fix: add `!(Number(p.child_count) > 0)` defensive guard in Phase 1 (see §7). |
| F9 | LIMIT 1000 truncation risk on `loadProjects()` call | A (REPRO_A §5) | AGREE | AGREE (REPRO_B §9.3) | CONFIRMED. Phase 1: timeclock passes `?leaves_only=true&limit=all`. `?limit=all` is already supported at `routes/projects.js:43–58` — no route change needed (RT B finding). |
| F10 | No race condition in picker initialization (loadProjects awaited before renderClockCard) | B (REPRO_B §5) | AGREE | AGREE | CONFIRMED. Not a bug. |
| F11 | `ensureRollupChain` race condition on concurrent clock-ins for same (client,job,WO#) | B (AUDIT_B §7) | UNCERTAIN — not explicitly addressed | AGREE (AUDIT_B Risk #1) | **See §5 below.** `findOrCreateRollup` already has 23505-catch + re-find + retry. Race condition is HANDLED, not unhandled. Moot for timeclock path per Q3 lock (no auto-create from timeclock). See §5. |
| F12 | Zero existing test coverage for timeclock picker | B (AUDIT_B §6) | AGREE (implied in AUDIT_A §9) | AGREE | CONFIRMED. Three test files required in Phase 2. |
| F13 | Cascade fix requires new `picker-data` endpoint + server-side project resolution | Both | AGREE | AGREE | CONFIRMED per spec. Resolution is SELECT-only (Carter Q3 — no auto-create). |
| F14 | Switch Project modal must be updated alongside clock-in card | A (REPRO_A §7 Q2 implied) | AGREE | AGREE | CONFIRMED. Both surfaces share `populateProjectSelect`; both must move to cascade. |

**Tally: AGREE 12 / DISAGREE 0 / UNCERTAIN 0. Two disputes resolved: F4 (root cause) and F6 (default vs opt-in).**

---

## 2. Reconciled Surgical Fix Definition

**B is correct: no default filter. Opt-in `?leaves_only=true` only.**

The safe surgical fix is:
1. **`routes/projects.js`**: Add `?leaves_only=true` opt-in param. When present: append `AND p.is_rollup IS NOT TRUE` to `whereStr`. Default behavior unchanged (all callers unaffected). **`?limit=all` is already supported — no additional route change needed.**
2. **`public/timeclock.html:656`**: Change `loadProjects()` call to `GET /api/projects?status=active&leaves_only=true&limit=all`.
3. **`public/timeclock.html:689`**: Add `!(Number(p.child_count) > 0)` secondary guard alongside `!p.is_rollup` in `populateProjectSelect`. Undefined-safe: `Number(undefined)` is `NaN`; `NaN > 0` is `false`; `!(false)` is `true` — treats missing `child_count` as leaf-safe.
4. **`public/timeclock.html` edit-entry modal**: Add `?include_completed=true` flag for edit-entry context (see §7 Phase 1 item 4).

**Important:** This fix reduces payload size and closes hardening gaps but does NOT resolve the user-visible "12× Inspection" UX problem. That requires Phase 2 cascade. Ship Phase 1 as prep/hardening, not as user-facing fix.

**SQL form for any server-side rollup filter: `AND p.is_rollup IS NOT TRUE`** (never `= FALSE` — handles nullable rows correctly).

---

## 3. Reconciled Cascade Plan

A (Batches 1–4) and B (Tiers A→B→C) are compatible decompositions. Unified plan: **3 sequenced fix-agent dispatches + 1 polish dispatch**, strictly sequential (B depends on A, C depends on B).

| Dispatch | Scope | Commit target |
|---|---|---|
| **P1 (surgical)** | `routes/projects.js` + `timeclock.html:656+689` + edit-entry modal | 1 commit (BE param + FE call + guard + edit-entry fix) |
| **P2-A (cascade BE)** | `timeclock_module.js` only | 1–2 commits: `picker-data` endpoint + SELECT-only project resolver + modify clock-in/switch + `timeclock_picker.test.js` |
| **P2-B (cascade FE)** | `public/timeclock.html` only | 1–2 commits: replace `#ci-project` with 3-dropdown cascade + rewrite `clockIn()` + switch modal + browser spec |
| **P2-C (polish)** | `public/timeclock.html` | 1 commit: a11y, disabled states, preview line, mobile sizing |

Sequential: P1 → P2-A → P2-B → P2-C. FE calls `picker-data`; 404 if P2-A not deployed first.

---

## 4. Spec Gap Questions for Carter

**Q2 — Stickiness: CLOSED (Carter 2026-05-14)**
Picker selections (Client, Job, WO#) are saved in **sessionStorage** — per-tab only, clears on tab close / logout. NOT localStorage. Per Carter 2026-05-14.

**Q3 — Auto-create auth: CLOSED (Carter 2026-05-14)**
**NOBODY auto-creates.** The picker is strictly read-only over existing records. When a `(client_id, job_id, work_order_number)` combo does not match any existing active project, clock-in returns **HTTP 422 Unprocessable Entity** with a clear error message (e.g., "No matching project found — check WO# or contact admin to create the project"). The user retries or contacts admin. No INSERT statements anywhere in the timeclock resolution path. Per Carter 2026-05-14.

**Q4 — Completed projects: CLOSED (Carter 2026-05-14)**
Completed projects are **hidden from clock-in cascade** and **visible in edit-entry / back-fill modal only**. Clock-in and switch-project callers always use `status=active`. The edit-entry modal calls with `?include_completed=true` (see §7 Phase 1 item 4). Per Carter 2026-05-14.

**E Q5 (not a blocker):** Quick-clock buttons send `{ project_id }` — legacy path stays alive in parallel with the new cascade path. Confirm P2-A preserves it.

**All Q2/Q3/Q4 answered. Phase 2 gate UNBLOCKED.**

---

## 5. Race Condition Verdict

**Verdict: `ensureRollupChain` race condition is ALREADY HANDLED. Not a new bug. No additional fix required in Phase 1.**

Independent reading of `portal_module.js:173–230` (`findOrCreateRollup`):
- SELECT first — if rollup row exists, return immediately.
- INSERT — if INSERT succeeds, return new id.
- **On `23505` (unique violation):** catch block fires. Re-SELECT to find the winner. If found, return it. If not found (collision with a real project name), retry with `[rollup_level] name` prefix.

Correct optimistic-concurrency pattern. Two concurrent clock-ins: one INSERT wins, 23505 loser's catch re-SELECTs the winner's row. Both return same rollup id. No unhandled error.

**Scope ruling:** No Phase 1 work required. AUDIT_B Risk #1 overstated — already handled.

**Under Q3 strict read-only (Carter 2026-05-14), `ensureRollupChain` is NOT called from the timeclock path at all.** Race condition is entirely moot for timeclock. Remains relevant for `POST /api/projects` flow only.

---

## 6. NULL `is_rollup` Filter Pattern — Locked

**All new server-side filters that exclude rollup rows MUST use:**
```sql
AND p.is_rollup IS NOT TRUE
```

**Never use `AND p.is_rollup = FALSE`** — silently excludes NULL rows. Column has `DEFAULT FALSE` but no `NOT NULL` (`schema_core.sql:825`). `project_tree_delete.test.js:137` asserts NULL-is_rollup leaves survive the list endpoint — catches `= FALSE` mistakes.

---

## 7. Canonical Fix Plan

### Phase 1 — Surgical Hardening (~1 commit)

**Files changed:** `routes/projects.js` (add param), `public/timeclock.html` (update call + guard + edit-entry fix)

**Changes:**
1. `routes/projects.js` — add `?leaves_only=true` opt-in param with parse-hardened form:
   ```js
   const leavesOnly = ['true','1','on'].includes(String(req.query.leaves_only ?? '').toLowerCase());
   if (leavesOnly) { where.push(`p.is_rollup IS NOT TRUE`); }
   ```
   This handles `true`, `TRUE`, `True`, `1`, `on`. `?limit=all` already supported at `:43–58` — no change needed. Confirm `IS NOT TRUE` form (not `= FALSE`). All existing callers unaffected.
2. `timeclock.html:656` — `loadProjects()` call becomes `GET /api/projects?status=active&leaves_only=true&limit=all`. Clock-in and switch-project callers only. Per Carter Q4: `status=active` to exclude completed projects from clock-in picker.
3. `timeclock.html:populateProjectSelect` — replace `child_count === 0` with undefined-safe form `!(Number(p.child_count) > 0)` alongside `!p.is_rollup`. Reasoning: `Number(undefined)` is `NaN`; `NaN > 0` is `false`; `!(false)` is `true` — treats missing `child_count` as leaf-safe, handles string `'0'` from JSON, handles absent column from partial responses.
4. `timeclock.html` edit-entry modal (`openEditEntryModal`) — **Option X (chosen):** the edit-entry context calls `GET /api/projects?leaves_only=true&limit=all&include_completed=true`. Route handler ORs in `status = 'completed'` when `include_completed=true` is present, so back-fill against completed projects works. The clock-in and switch-project pickers are unchanged (they keep `status=active`). This is the cleanest route-signature fit — `include_completed=true` is an additive flag that doesn't rewrite the existing `status` param logic, and it mirrors the existing `status` param convention in `routes/projects.js`. Accepted: **Option X**.

**Acceptance criteria:**
1. `GET /api/projects?leaves_only=true` returns zero rows with `is_rollup=TRUE`.
2. `GET /api/projects` (no flag) still returns rollup rows (tree views unaffected).
3. `project_tree_delete.test.js` still passes (NULL-is_rollup leaves survive). Add test for `?leaves_only=TRUE` (uppercase) and `?leaves_only=1` both activating the filter.
4. Edit-entry modal can select a completed project for back-fill.
5. Clock-in and switch-project callers cannot select completed projects.
6. `populateProjectSelect` uses `!(Number(p.child_count) > 0)` defensive guard.
7. CI green on push.

**Note:** Phase 1 is backend hardening + edit-entry fix. Clock-in UX unchanged — user still sees 12 "Inspection" entries until Phase 2 ships.

---

### Phase 2 — Cascade Rebuild (3 dispatches, strictly sequential)

**Phase 2 gate: Carter answered Q2/Q3/Q4. GATE IS CLEARED.**

#### P2-A — Backend Cascade (1–2 commits)
**Files:** `timeclock_module.js`, new `tests/timeclock_picker.test.js`

1. Add `GET /api/timeclock/picker-data?client_id=X` — returns `{ jobs: [...], work_orders: [...] }`. Jobs from `routes/jobs.js` logic with `client_id` filter. Work orders: try `ec_work_orders JOIN ec_service_areas` first (modern path); fall back to `contracts → concentrators` (PSC legacy path); return `[]` if both empty (non-PSC clients). Normalize both WO# sources to VARCHAR matching `projects.work_order_number` format before returning (RT B finding — format parity required for SELECT-match).
2. **Server-side SELECT-only project resolution.** Given `(client_id, ec_id, work_order_number, job_id)` as inputs, the endpoint runs a parameterized SELECT joining `projects → ec_work_orders / engineering_contracts`. If exactly one active leaf project matches, return its `project_id`. If zero matches, return HTTP 422 `{error: 'no_project_match'}` with message "No matching project found — check WO# or contact admin." If more than one matches, return HTTP 422 `{error: 'ambiguous_match', candidates: [...]}`. **No INSERT statements anywhere in the resolution path. No `resolveOrCreateProject` helper. No `ensureRollupChain` call.**
3. Modify `POST /api/timeclock/clock-in` — accept either `{ project_id }` (legacy, unchanged) OR `{ client_id, job_id, work_order_number }` (new path, runs SELECT-only resolution). Both paths look up `project_id` and pass it to the existing clock-in logic unchanged. No auto-create, no audit log for project creation.
4. Modify `POST /api/timeclock/switch` — same dual-path shape.

**Tests (new `tests/timeclock_picker.test.js`):**
- `GET /api/timeclock/picker-data?client_id=X` returns `{ jobs, work_orders }`
- `POST /api/timeclock/clock-in` with `{ project_id }` still works (backward compat)
- `POST /api/timeclock/clock-in` with `{ client_id, job_id, work_order_number }` — existing active project match → returns session
- `POST /api/timeclock/clock-in` with `{ client_id, job_id, work_order_number }` — no matching project → 422 `no_project_match` (NOT auto-create)
- `POST /api/timeclock/clock-in` with `{ client_id, job_id, work_order_number }` — ambiguous match → 422 `ambiguous_match`

**Acceptance criteria:** All tests pass. CI green. Legacy `{ project_id }` path unchanged. No INSERT path in timeclock resolution.

#### P2-B — Frontend Cascade (1–2 commits)
**Files:** `public/timeclock.html`, new `tests/browser/timeclock_picker.spec.js`

**Pre-push check:** `grep -rn "ci-project" tests/` — confirm zero test references before removing the DOM ID.

1. Replace `<select id="ci-project">` in clock-in card with `<select id="ci-client">`, `<select id="ci-job">`, `<select id="ci-wo">`.
2. On page load: populate `ci-client` from `GET /api/clients`.
3. On client change: `GET /api/timeclock/picker-data?client_id=X` → populate `ci-job` and `ci-wo`. If `work_orders.length === 0`, hide `ci-wo` entirely.
4. Add "Will clock into: [Client] / [Job] / [WO#]" preview `<div>` updated reactively.
5. Modify `clockIn()` to send `{ client_id, job_id, work_order_number }`. On 422: `window.LFS.toast.error()` with message from server body. No `alert()`.
6. Save picker selections to **sessionStorage** on success. Per-session only — clears on tab close/logout. Per Carter 2026-05-14. NOT localStorage.
7. Update Switch modal with same three dropdowns + same cascade logic.
8. Entry edit modal: no cascade changes. Edit-entry already gets `include_completed=true` in Phase 1.

**Browser test (`tests/browser/timeclock_picker.spec.js`):**
- `#ci-client` select exists and is populated
- Selecting a client populates `#ci-job`
- `#ci-project` DOM ID is ABSENT
- Clock-in submits successfully (against test fixture)

**Acceptance criteria:** Cascade works end-to-end. Preview renders. Switch modal works. Quick-clock unaffected. `#ci-project` removed. sessionStorage stickiness. Browser spec passes. CI green.

#### P2-C — Polish (1 commit)
**Files:** `public/timeclock.html`

- `ci-job` and `ci-wo` disabled until `ci-client` selected.
- `aria-live="polite"` on preview div.
- Error state when server returns 422 (no-match or ambiguous): use toast, not alert.
- Mobile sizing: `ci-client`/`ci-job`/`ci-wo` at `min-height: 44px` at `max-width:600px`.

**Acceptance criteria:** Tab flow: Client → Job → WO → Clock In. Preview readable by screen reader. Mobile taps pass 44px check.

---

## 8. Risk Register

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Fix-agent uses `= FALSE` instead of `IS NOT TRUE` in SQL | HIGH | Explicit instruction in prompt; `project_tree_delete.test.js` catches it |
| R2 | Fix-agent adds `IS NOT TRUE` as default filter (breaks trees) | HIGH | Explicit instruction: opt-in flag ONLY; existing tests catch it |
| R3 | ~~Q3 auto-create bypasses approval~~ | ~~HIGH~~ | **RESOLVED — Carter Q3: NOBODY auto-creates. 422 on no-match. No INSERT path.** |
| R4 | P2-B dispatched before P2-A lands — FE calls 404 on `picker-data` | MEDIUM | Sequential dispatch enforced; P2-B prompt includes check "verify P2-A CI green before proceeding" |
| R5 | `#ci-project` removed without grepping tests | MEDIUM | Pre-push grep required in P2-B prompt; currently zero test refs (confirmed) |
| R6 | ~~resolveOrCreateProject transaction discipline~~ | ~~MEDIUM~~ | **RESOLVED — function does not exist. No auto-create path.** |
| R7 | LIMIT-all on large project tables in Phase 1 — payload bloat | LOW | Mitigated when `picker-data` endpoint ships in P2-A (timeclock stops needing full project list). `?limit=all` already supported at `routes/projects.js:43–58`. |
| R8 | E Q5 (quick-clock backward compat) — fix-agent hard-cuts the `project_id` path | LOW | P2-A prompt explicitly preserves both clock-in paths |
| R9 | `?leaves_only=TRUE` (uppercase) silently skips filter if not parse-hardened | MEDIUM | Locked parse form in §7 Phase 1 item 1 handles all of `true/TRUE/True/1/on` via `.toLowerCase()` |
| R10 | Edit-entry modal shows only active projects — back-fill on completed project breaks | MEDIUM | Phase 1 item 4 adds `?include_completed=true` flag (Option X); accepted |
| R11 | `ec_work_orders.number` vs `concentrators.work_order_number` format mismatch | MEDIUM | P2-A must normalize both to VARCHAR matching `projects.work_order_number` before SELECT-match |

---

## 9. Dispatch Sequence

```
PHASE 1
  Fix Agent P1 (1 commit)
    routes/projects.js  ←  ?leaves_only opt-in, parse-hardened: ['true','1','on'].includes(...)
                            ?limit=all already works — no route change needed
    timeclock.html:656  ←  ?leaves_only=true&limit=all&status=active (clock-in/switch callers)
    timeclock.html:689  ←  !(Number(p.child_count) > 0) undefined-safe guard
    timeclock.html edit-entry  ←  ?include_completed=true flag (Option X) for back-fill access
    Push → CI green verify

  Red Team (≥2, READ-ONLY)
    Verify: opt-in param only, IS NOT TRUE form, existing callers unaffected,
    child_count guard uses !(Number(p.child_count) > 0),
    edit-entry gets include_completed, clock-in stays status=active.
    Confirm no default-filter regression.

GATE: Carter Q2/Q3/Q4 — ALL ANSWERED. Phase 2 UNBLOCKED.

PHASE 2 (strictly sequential A → B → C)
  Fix Agent P2-A (1–2 commits)
    timeclock_module.js  ←  picker-data endpoint + SELECT-only resolver + clock-in/switch (dual-path)
    tests/timeclock_picker.test.js  ←  new, 5 test cases (success/no-match/ambiguous, NOT auto-create)
    NO resolveOrCreateProject. NO INSERT. 422 on no-match/ambiguous.
    Push → CI green verify

  Red Team P2-A (≥2, READ-ONLY)
    Verify: backward compat path, SELECT-only (no INSERT), 422 on no-match,
    picker-data shape correct, no autocreate audit_log, tests cover no-match case.

  Fix Agent P2-B (1–2 commits)
    public/timeclock.html  ←  3-dropdown cascade + clockIn() + switch modal
    tests/browser/timeclock_picker.spec.js  ←  new
    sessionStorage stickiness (NOT localStorage). Pre-push: grep tests/ for ci-project (0 hits required).
    Push → CI green verify

  Red Team P2-B (≥2, READ-ONLY)
    Verify: ci-project gone, new IDs in browser spec, switch modal updated,
    quick-clock unaffected, sessionStorage confirmed.

  Fix Agent P2-C (1 commit) — polish / a11y → Push → CI green verify

  Post-Fix Verification (READ-ONLY) — all canonical items addressed, zero regressions, CI green final HEAD.
```

---

=== TIMECLOCK CANONICAL END ===
