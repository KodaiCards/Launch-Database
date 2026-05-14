# REDTEAM B — Backwards-Compat / Regression Verification
> Framing: backwards-compat, regression, cross-portal
> Branch: `claude/debug-previous-issues-MoN9D` HEAD `830309f`
> Date: 2026-05-14

---

## 1. Canonical Scope-vs-Carter-Answer Corrections

Carter's locked answers (2026-05-14): **Q2** sessionStorage only (NOT localStorage). **Q3** NOBODY auto-creates — picker is strictly read-only over existing records. **Q4** Completed projects hidden from clock-in cascade, visible in edit-entry / back-fill modal only.

**Contradictions in CANONICAL.md:**

| # | Section | What canonical says | Carter's answer | Severity |
|---|---|---|---|---|
| C1 | §4 Q2 text | "should those three values be saved (in localStorage)..." — asks about localStorage as the mechanism | sessionStorage ONLY | HIGH — fix-agent will implement localStorage if not corrected |
| C2 | §4 Q3 text | Describes auto-create bypass path; recommends "require approval" but leaves it open | NOBODY auto-creates. Picker is strictly read-only over existing records. No `resolveOrCreateProject` for new records. Mismatched combo = clock-in fails, user retries. | CRITICAL — `resolveOrCreateProject` auto-create helper in P2-A is ENTIRELY DROPPED per Carter's answer |
| C3 | P2-A item 2 | "Add `resolveOrCreateProject(...)`... auto-creates leaf project" | No auto-create. Read-only. | CRITICAL — this entire function is out of scope |
| C4 | P2-A item 3 | "Log `audit_logs` entry with `action='timeclock_autocreate_project'` on auto-create" | No auto-create, no audit log entry for creation | DROP |
| C5 | P2-A test case 4 | "no existing project → auto-creates → `was_created: true`" | NO auto-create path exists | DROP |
| C6 | P2-A test case 5 | "Concurrent auto-create...both succeed, one project created" | DROP | DROP |
| C7 | §8 R3 | "Q3 unanswered — auto-create bypasses approval" | Answered. No auto-create at all. R3 closes. | INFORMATIONAL |
| C8 | §4 Q4 text | Lists options: (a) auto-create new, (b) reuse completed, (c) error | Carter: completed hidden from clock-in, visible in edit-entry only | Cascade picker must filter `status='completed'` client-side; no resolution code needed |
| C9 | §9 GATE line | "Carter must answer Q2, Q3, Q4 before Phase 2" | All three now answered — GATE is cleared | Dispatch unblocked |

**Net canonical patch needed:** P2-A must be rewritten. `resolveOrCreateProject` drops entirely. Clock-in with new path does a server-side SELECT-only lookup (`(client_id, job_id, work_order_number)` → `project_id`); if no match, return error 422 with message "No project found — check WO# and retry." No creation. The `picker-data` endpoint and the FE cascade rebuild are unaffected.

---

## 2. Six-Caller Verification Table

Audit B identified 6 rollup-needing callers. I verified each by reading the file.

| Caller | File:Line | Call form | Passes `?leaves_only=` | OK/Risk |
|---|---|---|---|---|
| `populateParentDropdown` | `public/js/projects_tab.js:103` | `api('/api/projects')` — no params | NO (correct) | OK — gets rollups as parent targets |
| `allProjects` refresh post-create | `public/admin.html:3645` | `api('/api/projects')` — no params | NO (correct) | OK |
| `allProjects` lazy-load in modal | `public/admin.html:4259` | `api('/api/projects')` — no params | NO (correct) | OK |
| `projectsCache` tree render | `public/design.html:755` | `/api/projects` + optional `?status=` only | NO (correct) | OK — renders rollups as tree folders |
| `projectsCache` tree render | `public/permitting.html:742` | `/api/projects` + optional `?status=` only | NO (correct) | OK |
| `projectsCache` full refresh | `public/design.html:1351` | `api('/api/projects')` — no params | NO (correct) | OK |

Two additional callers do pass params but not rollup-related:
- `design.html:1226` / `permitting.html:1204` — pass `?client_id=X&status=active` then JS-filter `!p.is_rollup`. These ALSO correctly receive rollups (used to build tree and leaf picker from same response). No collision risk.
- `permitting.html:1472` (post-create link) — `api('/api/projects')` — no params.

**Zero callers pass any rollup-filter param today. Zero would be affected by adding the new opt-in `?leaves_only=true`.** None are in `tests/`.

---

## 3. `?leaves_only` Name-Collision Verdict

Verified `routes/projects.js:29–111`. The `whereStr` block reads ONLY `status`, `client_id`, `type` from `req.query`. No existing param named `leaves_only`, `leaf`, `rollup`, `include_rollups`, or similar. **Zero name collision. Safe to add.**

---

## 4. `?limit=all` Support Verdict

**ALREADY SUPPORTED.** `routes/projects.js:43–58`:
```js
const rawLimit  = req.query.limit;
const skipLimit = rawLimit === 'all';
```
When `skipLimit=true`, the LIMIT clause is omitted and only an OFFSET is appended. The canonical's `?leaves_only=true&limit=all` call will work without any additional route changes.

---

## 5. Tree-Views Regression Check

| Portal | Tree loader | Params passed | Rollups returned? | Phase 1 risk |
|---|---|---|---|---|
| Admin (`projects_tab.js`) | `loadProjects()` + `populateParentDropdown()` | Status/client_id filters only OR no params | YES — full list | NONE — `?leaves_only=true` is timeclock-only opt-in |
| Design | `loadProjects()` at `:755` | `?status=X` or no params | YES | NONE |
| Permitting | `loadProjects()` at `:742` | `?status=X` or no params | YES | NONE |
| All portals via `projectsCache` full refresh | Lines 1351 (design), 1325 (permitting) | No params | YES | NONE |

No portal calls `/api/projects` with any param that could accidentally activate `?leaves_only=true`. The opt-in is safe.

---

## 6. Existing Timeclock Features Preservation

| Feature | Code path | Phase 1 impact | Phase 2 impact | Status |
|---|---|---|---|---|
| Clock-in to leaf project | `clockIn()` → `POST /api/timeclock/clock-in { project_id }` | None — timeclock.html:656 changes from `?status=active` to `?status=active&leaves_only=true&limit=all`; populateProjectSelect still works same way | P2-A: legacy `{project_id}` path preserved per canonical §P2-A item 3 | SAFE |
| Quick-clock buttons | `quickClockIn()` → `POST /api/timeclock/clock-in { project_id }` | None — not affected by picker URL change | P2-A must keep legacy path | SAFE (verify in P2-A prompt) |
| Switch-project mid-shift | `openSwitchModal()` → `populateProjectSelect(#switch-project)` → `doSwitch()` | None — `#switch-project` reads same `projectsCache` | P2-B rebuilds switch modal | SAFE for Phase 1; P2-B must update switch modal |
| Entry-edit modal | `openEditEntryModal()` → `populateClientSelect + populateProjectSelect` with `#entry-project` | None — entry modal reads same `projectsCache`; NOT using `?leaves_only=true` | Canonical correctly defers entry modal change | SAFE |
| Backfill manual entry modal | Same as entry-edit path | None | Canonical §P2-B item 7 explicitly says "Entry edit modal: no changes" | SAFE |
| Hours summary / weekly review | `loadWeek()` → `GET /api/timeclock/week` — independent endpoint, no project picker | None | None | SAFE |
| Manager view of team time | `hours_tab.js`, `unbilled_hours_panel.js` — admin-side, reads `time_entries` directly | None | None | SAFE |
| `time_entries` FK constraint | `project_id REFERENCES projects(id) RESTRICT` | None — project IDs unchanged | P2-A: server-side lookup returns existing `project_id`; INSERT unchanged | SAFE |

**One regression risk:** `populateProjectSelect` on the switch modal (`:952`) will still use the old `projectsCache` loaded at page init with `?status=active` (no `leaves_only` flag in Phase 1). After Phase 1, `projectsCache` is loaded with `?leaves_only=true&limit=all`. The switch modal calls `populateProjectSelect(document.getElementById('switch-project'))` which reads the same `projectsCache`. Phase 1 therefore DOES change the switch modal picker contents — it now gets a leaves-only list. This is correct behavior (the switch modal should also show only leaves), but the CANONICAL does not call this out explicitly. **Not a regression — it's an improvement — but fix-agent must be aware.**

---

## 7. Schema Migration Drop Verification

Spec (`timeclock-picker-spec.md`) pre-build checklist at §Pre-build confirms: "**Schema migrations: None required.** All columns exist." No new tables, no new columns. Carter's Q3 answer (no auto-create) eliminates any need for a `pending_project_request_id` path. **CANONICAL is correct to include no migration. Verified clean.**

---

## 8. `ec_work_orders` vs `concentrators` Dual-Path

CANONICAL.md P2-A item 1 states:
> "Work orders: try `ec_work_orders JOIN ec_service_areas` first (modern path); fall back to `contracts → concentrators` (PSC legacy path); return `[]` if both empty."

Spec (Area E Q4 resolved) confirms the three-step JOIN path from `client_id` to `concentrators` via `contracts.friendly_label`. The spec also confirms `ec_work_orders` is the modern FK path (added in migration 0031).

**Verdict: CANONICAL addresses the dual-path in P2-A item 1.** The precedence order is correct (modern FK path first). However, the canonical is silent on **what `work_order_number` value is returned** from each path — `ec_work_orders.number` vs `concentrators.work_order_number` — and whether they have the same format/type. The fix-agent for P2-A must normalize both to the same return shape. This is an implementation detail gap in the canonical, not a structural error. Flag as LOW risk for P2-A prompt.

---

## 9. Phase Atomicity

| State | FE behavior | BE behavior | Working state? |
|---|---|---|---|
| Phase 1 only | `timeclock.html:656` calls `?status=active&leaves_only=true&limit=all`; `populateProjectSelect` adds `child_count===0` guard | `routes/projects.js` supports `?leaves_only=true` | YES — clock-in via `#ci-project` + `#switch-project` still works, now with hardened list |
| P2-A only, P2-B not yet | `timeclock.html` unchanged (still uses Phase 1 picker); new `picker-data` endpoint exists but FE doesn't call it | `timeclock_module.js` has new endpoint + updated clock-in path | YES — no FE calls the new endpoint yet; legacy path unchanged |
| P2-B added | FE now calls `picker-data`; `#ci-project` removed | P2-A already deployed | YES — new endpoint present before FE uses it |
| P2-C added | A11y + disabled states + preview polish | No BE changes | YES — purely additive |

**Atomicity verdict: PASS.** Each dispatch is independently deployable. P2-B → P2-A ordering is enforced by the canonical (P2-B prompt includes "verify P2-A CI green before proceeding"). The 2026-05-11 demo-failure lesson (atomic BE/FE) is satisfied.

---

## 10. CI Test Additions Needed

| Phase | Test file | What to add | Notes |
|---|---|---|---|
| Phase 1 | `tests/project_tree_delete.test.js` | Add assertion: `GET /api/projects?status=active&leaves_only=true` returns zero rows with `is_rollup=TRUE`; and that `GET /api/projects` (no flag) still returns rollup rows | Existing NULL-leaf test (line 137) already validates `= FALSE` vs `IS NOT TRUE` — just add the `?leaves_only=true` case |
| P2-A | `tests/timeclock_picker.test.js` (NEW) | `GET /api/timeclock/picker-data?client_id=X` returns `{ jobs, work_orders }`; `POST /api/timeclock/clock-in { project_id }` still works; `POST /api/timeclock/clock-in { client_id, job_id, work_order_number }` — existing match returns project_id; no match → 422 error (NOT auto-create per Carter's Q3 answer) | CRITICAL: canonical test case 4+5 (auto-create) are DROPPED per Carter's Q3 |
| P2-B | `tests/browser/timeclock_picker.spec.js` (NEW) | Assert `#ci-client` exists and is populated; client selection populates `#ci-job`; `#ci-project` DOM ID does NOT exist; clock-in submits successfully | Must grep `tests/**/*.spec.js` for `ci-project` before removing DOM ID |
| P2-B | Pre-push check | `grep -rn "ci-project" tests/` must return zero hits | Confirmed zero hits today (from AUDIT_B). Canonical R5 already captures this. |
| Phase 1 + P2-A | `tests/schema_shape.test.js` | Add `time_clock_sessions.project_id` FK assertion | Low priority but good hygiene |

---

## 11. Top 5 Backwards-Compat / Regression Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| **R-BC1** | CANONICAL's `resolveOrCreateProject` auto-create is **entirely out of scope** per Carter's Q3 answer. Fix-agent implementing P2-A from the unpatched canonical will build a feature Carter explicitly rejected. | CRITICAL | Patch canonical before P2-A dispatch: server-side clock-in with new path does SELECT-only; no match → 422 error. Drop test cases 4+5. |
| **R-BC2** | CANONICAL Q2 says "localStorage" but Carter said "sessionStorage only." Fix-agent will implement the wrong storage mechanism. | HIGH | Patch canonical §Q2 answer to say sessionStorage before P2-B dispatch. |
| **R-BC3** | P2-B removes `#ci-project` DOM ID. If any code path between now and P2-B adds a test referencing `#ci-project`, CI will break. | MEDIUM | P2-B prompt must include mandatory pre-push grep. Canonical R5 captures this. |
| **R-BC4** | `permitting.html:1472` post-create link grabs `projs[0]` (newest) via `api('/api/projects')`. If the newest row created happens to be a rollup (from `ensureRollupChain`), it links the potential_permit to a rollup. This is a pre-existing bug, not introduced by this wave, but Phase 1's `?leaves_only=true` won't help it because this caller doesn't use the flag. | LOW | Flag as pre-existing bug for a future wave. Not introduced by this canonical. |
| **R-BC5** | `ec_work_orders.number` vs `concentrators.work_order_number` format may differ (string vs int, leading zeros). If P2-A normalizes inconsistently, the server-side SELECT-match for `(client_id, job_id, work_order_number)` will silently miss rows. | MEDIUM | P2-A prompt must explicitly normalize both WO# sources to VARCHAR and match `projects.work_order_number` format before doing the SELECT lookup. |

---

## Net Verdict

**NEEDS-CANONICAL-PATCH**

Two critical corrections required before dispatch:
1. Drop `resolveOrCreateProject` auto-create entirely (Carter Q3: read-only). Rewrite P2-A clock-in as SELECT-only with 422 on no-match.
2. Change canonical Q2 from "localStorage" to "sessionStorage".

Phase 1 is clear to dispatch as-is after these patches. Phase 2 gate is unblocked (all three Q2/Q3/Q4 answered).

=== TIMECLOCK REDTEAM B BC END ===
