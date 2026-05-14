# Timeclock Projects Picker — Canonical Fix Plan
> Peer cross-check + consolidation. Date: 2026-05-14.
> Inputs: REPRO_A, REPRO_B, AUDIT_A_SCOPE, AUDIT_B_RISK, timeclock-picker-spec.md
> Independent verifications: /api/projects caller inventory, ensureRollupChain source, is_rollup schema.

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
| F8 | `child_count` guard missing from `populateProjectSelect` (uses `!is_rollup` only, not `child_count===0`) | B (REPRO_B §4) | AGREE — noted in AUDIT_A §5 | AGREE | CONFIRMED. Minor latent bug. Fix: add `child_count === 0` secondary guard in Phase 1. |
| F9 | LIMIT 1000 truncation risk on `loadProjects()` call | A (REPRO_A §5) | AGREE | AGREE (REPRO_B §9.3) | CONFIRMED. Phase 1: timeclock passes `?leaves_only=true&limit=all`. |
| F10 | No race condition in picker initialization (loadProjects awaited before renderClockCard) | B (REPRO_B §5) | AGREE | AGREE | CONFIRMED. Not a bug. |
| F11 | `ensureRollupChain` race condition on concurrent clock-ins for same (client,job,WO#) | B (AUDIT_B §7) | UNCERTAIN — not explicitly addressed | AGREE (AUDIT_B Risk #1) | **See §5 below.** `findOrCreateRollup` already has 23505-catch + re-find + retry. Race condition is HANDLED, not unhandled. See §5 for full verdict. |
| F12 | Zero existing test coverage for timeclock picker | B (AUDIT_B §6) | AGREE (implied in AUDIT_A §9) | AGREE | CONFIRMED. Three test files required in Phase 2. |
| F13 | Cascade fix requires new `picker-data` endpoint + `resolveOrCreateProject` helper | Both | AGREE | AGREE | CONFIRMED per spec. |
| F14 | Switch Project modal must be updated alongside clock-in card | A (REPRO_A §7 Q2 implied) | AGREE | AGREE | CONFIRMED. Both surfaces share `populateProjectSelect`; both must move to cascade. |

**Cross-check tally: AGREE 12 / DISAGREE 0 (after resolution) / UNCERTAIN 0 (after resolution)**
Two genuine disputes resolved: F4 (root cause diagnosis) and F6 (default vs opt-in filter).

---

## 2. Reconciled Surgical Fix Definition

**B is correct: no default filter. Opt-in `?leaves_only=true` only.**

The safe surgical fix is:
1. **`routes/projects.js`**: Add `?leaves_only=true` opt-in param. When present: append `AND p.is_rollup IS NOT TRUE` to `whereStr`. Default behavior unchanged (all callers unaffected).
2. **`public/timeclock.html:656`**: Change `loadProjects()` call to `GET /api/projects?status=active&leaves_only=true&limit=all`.
3. **`public/timeclock.html:689`**: Add `child_count === 0` secondary guard alongside `!p.is_rollup` in `populateProjectSelect`. Closes the latent `is_rollup=FALSE, child_count>0` edge case.

**Important:** This fix reduces payload size and closes hardening gaps but does NOT resolve the user-visible "12× Inspection" UX problem. That requires Phase 2 cascade. Ship Phase 1 as prep/hardening, not as user-facing fix.

**SQL form for any server-side rollup filter: `AND p.is_rollup IS NOT TRUE`** (never `= FALSE` — handles nullable rows correctly).

---

## 3. Reconciled Cascade Plan

A (Batches 1–4) and B (Tiers A→B→C) are compatible decompositions. Unified plan: **3 sequenced fix-agent dispatches + 1 polish dispatch**, strictly sequential (B depends on A, C depends on B).

| Dispatch | Scope | Commit target |
|---|---|---|
| **P1 (surgical)** | `routes/projects.js` + `timeclock.html:656+689` | 1 commit (BE param + FE call + guard) |
| **P2-A (cascade BE)** | `timeclock_module.js` only | 1–2 commits: `picker-data` endpoint + `resolveOrCreateProject` + modify clock-in/switch + `timeclock_picker.test.js` |
| **P2-B (cascade FE)** | `public/timeclock.html` only | 1–2 commits: replace `#ci-project` with 3-dropdown cascade + rewrite `clockIn()` + switch modal + browser spec |
| **P2-C (polish)** | `public/timeclock.html` | 1 commit: a11y, disabled states, preview line, mobile sizing |

Sequential constraint: P1 must land before P2-A; P2-A must land before P2-B (FE calls new `picker-data` endpoint; 404 if BE not deployed first). P2-C can follow P2-B directly.

---

## 4. Spec Gap Questions for Carter

Three questions from spec Area E that must be answered before P2-A ships. Restated in plain English:

**Q2 — Should the picker remember your last selection?**
When you clock in using the new Client → Job → WO# cascade, should those three values be saved (in localStorage) so they're pre-filled the next time you open the timeclock? Or start blank every time? (Quick-clock buttons already handle "same project as yesterday," so blank-start is fine if you prefer clean state.)

**Q3 — Can any employee auto-create a project from the timeclock? (SECURITY DECISION)**
When a (client, job, WO#) combo doesn't match an existing project, the system will auto-create one so the employee can clock in without waiting for admin. Today, project creation requires admin approval. Should timeclock auto-creates bypass approval (convenience) or go through the existing approval queue (control)? This affects billing tree integrity — a typo in WO# creates a phantom project. Recommendation: require approval, but Carter must confirm.

**Q4 — What happens if the matching project is already marked "completed"?**
If an employee picks (PSC, Inspection, WO#16300) and the only project matching that combo was previously marked completed, should the system: (a) auto-create a fresh active project for that combo, (b) reuse the completed project (and re-activate it), or (c) show an error? Recommendation: (a) auto-create new, but Carter must confirm.

**Additional gating question (E Q5, not previously flagged as blocker):**
Quick-clock buttons send `{ project_id }` to `POST /api/timeclock/clock-in`. The plan keeps this path alive in parallel with the new `{ client_id, job_id, work_order_number }` path. This is the correct approach — confirm before P2-A ships so the fix-agent doesn't break quick-clock.

---

## 5. Race Condition Verdict

**Verdict: `ensureRollupChain` race condition is ALREADY HANDLED. Not a new bug. No additional fix required in Phase 1.**

Independent reading of `portal_module.js:173–230` (`findOrCreateRollup`):
- SELECT first — if rollup row exists, return immediately.
- INSERT — if INSERT succeeds, return new id.
- **On `23505` (unique violation):** catch block fires. Re-SELECT to find the winner. If found, return it. If not found (collision with a real project name), retry with `[rollup_level] name` prefix.

This is a correct optimistic-concurrency pattern. Two concurrent clock-ins for the same (client,job,WO#) with no existing leaf:
- Both enter INSERT. One wins, one gets 23505.
- The loser's catch block re-SELECTs and finds the winner's row.
- Both return the same rollup id. No unhandled error. No silent failure.

**Scope ruling:** No Phase 1 work required for the race condition. AUDIT_B Risk #1 overstated severity — the code already handles it. Red team should verify this reading independently.

The one genuine gap: `resolveOrCreateProject` (the new helper that wraps `ensureRollupChain` for the clock-in path) does not yet exist. It must be written in P2-A with the same `ON CONFLICT DO NOTHING` + retry discipline. This is scoped into P2-A, not Phase 1.

---

## 6. NULL `is_rollup` Filter Pattern — Locked

**All new server-side filters that exclude rollup rows MUST use:**
```sql
AND p.is_rollup IS NOT TRUE
```

**Never use `AND p.is_rollup = FALSE`** — this silently excludes rows where `is_rollup IS NULL`. The column has `DEFAULT FALSE` but no `NOT NULL` constraint (`schema_core.sql:825`). The `uniq_project_name_per_parent` index uses `COALESCE(parent_id::text, 'ROOT')` (not rollup-aware), confirming nullable rows exist in the schema design. The existing test at `project_tree_delete.test.js:137` asserts NULL-is_rollup rows survive `GET /api/projects?status=active` — this test would catch a `= FALSE` mistake if run.

---

## 7. Canonical Fix Plan

### Phase 1 — Surgical Hardening (~1 commit)

**Files changed:** `routes/projects.js` (add param), `public/timeclock.html` (update call + guard)

**Changes:**
1. `routes/projects.js` — add `?leaves_only=true` opt-in param. When present: `AND p.is_rollup IS NOT TRUE` added to WHERE. Confirm `IS NOT TRUE` form (not `= FALSE`). All existing callers unaffected.
2. `timeclock.html:656` — `loadProjects()` call becomes `GET /api/projects?status=active&leaves_only=true&limit=all`.
3. `timeclock.html:populateProjectSelect` — add `child_count === 0` secondary guard alongside `!p.is_rollup`.

**Acceptance criteria:**
- `GET /api/projects?leaves_only=true` returns zero rows with `is_rollup=TRUE`.
- `GET /api/projects` (no flag) still returns rollup rows (tree views unaffected).
- `project_tree_delete.test.js` still passes (NULL-is_rollup leaves survive).
- CI green on push.

**Note:** This does NOT change the user-visible picker UX. Communicate clearly: Phase 1 is backend hardening. User still sees 12 "Inspection" entries until Phase 2 ships.

---

### Phase 2 — Cascade Rebuild (3 dispatches, strictly sequential)

**Pre-dispatch blocker:** Carter must answer Q2, Q3, Q4 (§4 above) before P2-A ships.

#### P2-A — Backend Cascade (1–2 commits)
**Files:** `timeclock_module.js`, new `tests/timeclock_picker.test.js`

1. Add `GET /api/timeclock/picker-data?client_id=X` — returns `{ jobs: [...], work_orders: [...] }`. Jobs from `routes/jobs.js` logic with `client_id` filter. Work orders: try `ec_work_orders JOIN ec_service_areas` first (modern path); fall back to `contracts → concentrators` (PSC legacy path); return `[]` if both empty (non-PSC clients).
2. Add `resolveOrCreateProject({ client_id, job_id, work_order_number }, pgClient)` helper in `timeclock_module.js`. Wraps `ensureRollupChain`. Transaction-wrapped. Handles conflict with same `ON CONFLICT` + re-SELECT retry discipline as `findOrCreateRollup`.
3. Modify `POST /api/timeclock/clock-in` — accept either `{ project_id }` (legacy, unchanged) OR `{ client_id, job_id, work_order_number }` (new path, calls `resolveOrCreateProject`). Log `audit_logs` entry with `action='timeclock_autocreate_project'` on auto-create.
4. Modify `POST /api/timeclock/switch` — same dual-path shape.

**Tests (new `tests/timeclock_picker.test.js`):**
- `GET /api/timeclock/picker-data?client_id=X` returns jobs + work_orders
- `POST /api/timeclock/clock-in` with `{ project_id }` still works (backward compat)
- `POST /api/timeclock/clock-in` with `{ client_id, job_id, work_order_number }` — existing project match
- Same with no existing project → auto-creates → `was_created: true` in response
- Concurrent auto-create (two simultaneous calls, same combo) → both succeed, one project created

**Acceptance criteria:** All test cases pass. CI green. Legacy `{ project_id }` path unchanged.

#### P2-B — Frontend Cascade (1–2 commits)
**Files:** `public/timeclock.html`, new `tests/browser/timeclock_picker.spec.js`

**Pre-push check:** `grep -rn "ci-project" tests/` — confirm zero test references before removing the DOM ID.

1. Replace `<select id="ci-project">` in clock-in card with `<select id="ci-client">`, `<select id="ci-job">`, `<select id="ci-wo">`.
2. On page load: populate `ci-client` from `GET /api/clients`.
3. On client change: `GET /api/timeclock/picker-data?client_id=X` → populate `ci-job` and `ci-wo`. If `work_orders.length === 0`, hide `ci-wo` entirely.
4. Add "Will clock into: [Client] / [Job] / [WO#]" preview `<div>` updated reactively.
5. Modify `clockIn()` to send `{ client_id, job_id, work_order_number }`.
6. Update Switch modal with same three dropdowns + same cascade logic.
7. Entry edit modal: no changes (keeps existing Client → Project cascade).

**Browser test (`tests/browser/timeclock_picker.spec.js`):**
- `#ci-client` select exists and is populated
- Selecting a client populates `#ci-job`
- Clock-in submits successfully (against test fixture)

**Acceptance criteria:** Clock-in with cascade works end-to-end. Preview renders. Switch modal works. Quick-clock buttons unaffected. `#ci-project` DOM ID removed. Browser spec passes. CI green.

#### P2-C — Polish (1 commit)
**Files:** `public/timeclock.html`

- `ci-job` and `ci-wo` disabled until `ci-client` selected.
- `aria-live="polite"` on preview div.
- Error state when `resolveOrCreateProject` fails (network error, auth failure).
- Mobile sizing: `ci-client`/`ci-job`/`ci-wo` at `min-height: 44px` at `max-width:600px`.

**Acceptance criteria:** Tab flow: Client → Job → WO → Clock In. Preview readable by screen reader. Mobile taps pass 44px check.

---

## 8. Risk Register

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Fix-agent uses `= FALSE` instead of `IS NOT TRUE` in SQL | HIGH | Explicit instruction in prompt; `project_tree_delete.test.js` catches it |
| R2 | Fix-agent adds `IS NOT TRUE` as default filter (breaks trees) | HIGH | Explicit instruction: opt-in flag ONLY; existing tests catch it |
| R3 | Q3 unanswered — auto-create bypasses approval; phantom projects on WO# typos | HIGH | P2-A blocked until Carter answers; default: require approval unless explicitly told otherwise |
| R4 | P2-B dispatched before P2-A lands — FE calls 404 on `picker-data` | MEDIUM | Sequential dispatch enforced; P2-B prompt includes check "verify P2-A CI green before proceeding" |
| R5 | `#ci-project` removed without grepping tests | MEDIUM | Pre-push grep required in P2-B prompt; currently zero test refs (confirmed) |
| R6 | resolveOrCreateProject lacks transaction discipline — partial rollup chain on DB error | MEDIUM | P2-A scope explicitly requires `BEGIN/ROLLBACK` wrapping + `ON CONFLICT + re-SELECT retry` |
| R7 | LIMIT-all on large project tables in Phase 1 — payload bloat | LOW | Mitigated when `picker-data` endpoint ships in P2-A (timeclock stops needing full project list) |
| R8 | E Q5 (quick-clock backward compat) — fix-agent hard-cuts the `project_id` path | LOW | P2-A prompt explicitly preserves both clock-in paths |

---

## 9. Dispatch Sequence

```
PHASE 1
  Fix Agent P1 (1 commit)
    routes/projects.js  ←  ?leaves_only=true opt-in param
    timeclock.html:656  ←  ?leaves_only=true&limit=all
    timeclock.html:689  ←  child_count===0 secondary guard
    Push → CI green verify
    
  Red Team (≥2, READ-ONLY)
    Verify: opt-in param only, IS NOT TRUE form, existing callers unaffected,
    child_count guard correct. Confirm no default-filter regression.

GATE: Carter answers Q2, Q3, Q4 before Phase 2.

PHASE 2 (strictly sequential A → B → C)
  Fix Agent P2-A (1–2 commits)
    timeclock_module.js  ←  picker-data endpoint + resolveOrCreateProject + clock-in/switch
    tests/timeclock_picker.test.js  ←  new, covers all 5 test cases above
    Push → CI green verify

  Red Team P2-A (≥2, READ-ONLY)
    Verify: backward compat path, ON CONFLICT + retry in resolveOrCreateProject,
    picker-data returns correct shape, audit_log on autocreate, tests cover concurrent case.

  Fix Agent P2-B (1–2 commits)
    public/timeclock.html  ←  3-dropdown cascade + clockIn() + switch modal
    tests/browser/timeclock_picker.spec.js  ←  new
    Pre-push: grep tests/ for ci-project (must be 0 hits before removal)
    Push → CI green verify

  Red Team P2-B (≥2, READ-ONLY)
    Verify: ci-project DOM ID gone, new IDs match browser spec, switch modal updated,
    quick-clock buttons unaffected, picker-data 404 impossible (P2-A already landed).

  Fix Agent P2-C (1 commit)
    public/timeclock.html  ←  polish / a11y
    Push → CI green verify

  Post-Fix Verification (READ-ONLY)
    Confirm all Phase 1 + Phase 2 canonical items addressed. Zero regressions.
    Confirm CI green on final HEAD.
```

---

=== TIMECLOCK CANONICAL END ===
