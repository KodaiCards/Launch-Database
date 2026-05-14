# Timeclock Project Picker — Rebuild Spec

> **Status:** Discovery updated 2026-05-14 via full code read.
> Original spec drafted 2026-05-13 from user conversation. This revision
> adds verified schema facts, confirmed endpoint inventory, and corrected
> gap analysis.
> Build deferred until Phase 2 (projection) and Wave 2 FE-Crit remainder ship.

---

## Area A — Current State

### Files involved
- `timeclock_module.js` (791 LOC) — all `/api/timeclock/*` routes + schema bootstrap + audit logger
- `public/timeclock.html` (1343 LOC) — the full timeclock portal (styles + HTML + all JS inline)
- `routes/time_entries.js` — CRUD for `time_entries` rows (the output of clock-out)
- `routes/concentrators.js` — service area (concentrator) list
- `routes/jobs.js` — jobs list with `client_id` / `engineering_contract_id` / `program` filter support
- `routes/engineering_contracts.js` — EC CRUD (admin only)
- `portal_module.js` — `ensureRollupChain`, `findOrCreateRollup`, project-request flow

### How the picker works TODAY

**Clock-in flow (pre-clock form):**
1. Page loads → `loadProjects()` fires `GET /api/projects?status=active` → all active projects into `projectsCache`
2. `populateProjectSelect()` builds a flat `<select id="ci-project">` of leaf-only projects (rollups excluded), optionally scoped by a client filter
3. Entries table and manual-entry modal have `Client → Project → Job` three-level dropdowns, but the main clock-in card has only `Project → Job`
4. The client dropdown in the entry modal (`<select id="entry-client">`) is populated from `projectsCache` (distinct client_ids extracted in JS — no API call). This means the client list is bounded by which clients already have active leaf projects the user can see
5. On project select → `populateJobSelect()` fires `GET /api/jobs` (all jobs, cached as `jobsCache._all`), then filters by the project's team in JS
6. Clock-in body sent: `{ project_id, job_id? }` to `POST /api/timeclock/clock-in`
7. The existing `timeclock.html` also loads concentrators once: `allConcentrators` is populated for use in the "Request New Project" modal only — concentrators drive the WO# display there but NOT in the main clock-in picker

**What `time_clock_sessions` stores:**
`user_id`, `staff_id`, `project_id`, `job_id`, `job_title`, `started_at`, `ended_at`, `notes`, `created_time_entry_id`, `forgot_clock_out`

**What `time_entries` stores:**
`id`, `project_id`, `staff_id`, `entry_date`, `hours`, `job_title`, `notes`, `import_batch`, `is_billable`, `pending_project_request_id`, `created_at` — plus `user_id` added by timeclock bootstrap

**`/api/timeclock/recent`** returns the top-3 most-recently-clocked projects for quick-clock buttons, including `project_id`, `job_id`, `job_title`, `work_order_number`, `project_name`, `client_name`.

---

## Area B — Spec (What User Wants)

From CLAUDE.md §2 + user's own words (2026-05-13):

> "Job would be the available jobs and client, then optionally add the different WO# that populate from that client, jobs that populate from that client"

Cascading picker flow:
```
Client (required) → Job (required, filtered by client) → WO# (optional, filtered by client)
```

**WO# display format (confirmed from spec):** `"{service_area_name} - {wo_number}"` (e.g., `"Crossroad School - 16300"`). Source: `concentrators` table — each row has `area_name`, `work_order_number`, `contract_label`.

**Auto-create behavior:** when `(client, job, WO#)` combination has no matching leaf project, system auto-creates a leaf project slotted into the correct rollup chain via `ensureRollupChain`. User never leaves timeclock.

**Preview line:** real-time "Will clock into: PSC / Construction / Crossroad School / PSC Inspection — 16300" before Clock In.

**Quick-clock buttons preserved:** they use `project_id` directly from `time_clock_sessions`, so they survive the picker rebuild without changes.

---

## Area C — Gap Analysis

### What exists today vs what's needed

| Dimension | Today | Target |
|---|---|---|
| Client dropdown in clock-in | Absent from clock-in card (only in entry edit modal, populated from projectsCache) | Present in clock-in card; sourced from `/api/clients` directly |
| Job dropdown in clock-in | Flat list of all jobs after project selected | Filtered by selected client's EC program using `?client_id=&engineering_contract_id=` params already supported by `/api/jobs` |
| WO# dropdown | Absent from clock-in card | New dropdown; source: `/api/concentrators` (already exists) filtered by client's `contract_label` |
| Clock-in body | `{ project_id, job_id }` | `{ client_id, job_id, work_order_number }` (project resolved server-side) |
| Project resolution | Client picks an exact leaf project | New `resolveOrCreateProject()` helper: match or auto-create leaf |
| Auto-create rollup | `ensureRollupChain` exists in `portal_module.js`, already used by `POST /api/projects` | Needs to be called from `POST /api/timeclock/clock-in` |
| Preview line | None | New frontend reactive display |
| Entry edit modal | Has Client → Project cascade (client from projectsCache; project filtered by client in JS) | Same cascade works; can optionally upgrade to Client → Job → WO# shape later |

### Backend endpoints: what exists, what's missing

**Exists today:**
- `GET /api/clients` — `requireAuth()` gated, returns all clients (routes/clients.js)
- `GET /api/jobs?client_id=&engineering_contract_id=&program=` — full cascade-aware filter already implemented in routes/jobs.js; supports manual `job_assignments` override + fallback heuristic by program_scope
- `GET /api/concentrators?contract_label=` — `requireAuth()` gated (routes/concentrators.js)
- `GET /api/engineering-contracts?client_id=` — `requireAuth()` gated; returns ECs for a client with child contract counts
- `POST /api/timeclock/clock-in` — accepts `{ project_id, job_id }` today
- `POST /api/timeclock/switch` — same shape

**Missing / needs to be added:**
- `GET /api/timeclock/picker-data?client_id=X` — single call returning `{ jobs: [...], work_orders: [...] }` for a client (avoids 2 waterfall calls on each client selection; debounces the network)
- `POST /api/timeclock/resolve-or-create-project` — standalone resolution endpoint for the preview line (optional; clock-in can call internally)
- Modify `POST /api/timeclock/clock-in` to accept `{ client_id, job_id, work_order_number }` and internally call `resolveOrCreateProject`
- Modify `POST /api/timeclock/switch` — same

### Schema gaps: confirmed clean

All columns needed by `resolveOrCreateProject` already exist:
- `projects.client_id`, `projects.job_id`, `projects.work_order_number`, `projects.is_rollup`, `projects.status`, `projects.engineering_contract_id` ✓
- `jobs.team`, `jobs.program_scope` (added by migration 0006: `rus | non_rus | shared`) ✓
- `concentrators.area_name`, `concentrators.work_order_number`, `concentrators.contract_label` ✓
- `ensureRollupChain` in portal_module.js — three-level hierarchy (client → team → service_area) ✓
- `engineering_contracts.program` — drives job filter via program_scope ✓

**One schema clarification needed:** `concentrators` is scoped by `contract_label` (a string, e.g., `"PSC RUS Contract 1706-A72"`) rather than by `client_id`. The picker must resolve: given `client_id`, find the right `contract_label` to filter concentrators. Path: `GET /api/engineering-contracts?client_id=X` → pick the active RUS EC → use its `contract_number` or name to look up concentrators. For non-PSC clients, the WO# dropdown may be empty or use `projects.work_order_number` as the source instead.

---

## Area D — Scope Decomposition

### Batch 1: Backend endpoints (new picker-data + resolve-or-create + modify clock-in/switch)
**Scope:** `timeclock_module.js`, `routes/time_entries.js`
**Work:**
- Add `GET /api/timeclock/picker-data?client_id=X`: queries `/api/jobs` (with `client_id` filter) and `/api/concentrators` (with `contract_label` derived from client's active EC). Returns `{ jobs, work_orders }`.
- Add `resolveOrCreateProject({ client_id, job_id, work_order_number }, pool)` helper function (wraps existing `ensureRollupChain`).
- Modify `POST /api/timeclock/clock-in` to accept either `{ project_id }` (backward compat) or `{ client_id, job_id, work_order_number }` (new path).
- Modify `POST /api/timeclock/switch` same shape.
- Wrap resolve-or-create in a transaction (rollback if rollup creation fails mid-chain).
- Write `audit_logs` entry on auto-create with `action='timeclock_autocreate_project'`.

**Acceptance criteria:** `POST /api/timeclock/clock-in` with `{client_id, job_id, work_order_number}` clocks in against an auto-resolved/created project. `was_created` in response body. `POST` with `{project_id}` still works unchanged.

**Risk:** MEDIUM — touches the clock-in hot path; requires transaction discipline for rollup creation.
**Auditor count:** 2 (standard wave, code quality + adversarial race-condition check on rollup create)

### Batch 2: Frontend picker UI rebuild
**Scope:** `public/timeclock.html` (clock-in card section + entry modal)
**Work:**
- Remove `<select id="ci-project">` from clock-in card.
- Add `<select id="ci-client">`, `<select id="ci-job">`, `<select id="ci-wo">`.
- Populate `ci-client` from `GET /api/clients` on page load.
- On client change → `GET /api/timeclock/picker-data?client_id=X` → populate `ci-job` and `ci-wo`.
- Add "Will clock into" preview `<div>` updated reactively.
- Modify `clockIn()` to send `{ client_id, job_id, work_order_number }`.
- Update Switch modal with same three dropdowns.
- Quick-clock buttons: no change (they use `project_id` directly, still supported).
- Entry edit modal: keep existing Client → Project cascade (separate UX, doesn't need the new cascade for now).

**Acceptance criteria:** Clock-in with new cascade works end-to-end. Preview renders. Switch modal works. Quick-clock buttons unaffected. Mobile layout OK (`max-width:600px` breakpoint).

**Risk:** LOW to MEDIUM — frontend-only except for the new API call pattern.
**Auditor count:** 2 (standard)

### Batch 3: Auto-create rollup flow (included in Batch 1 but needs separate smoke test)
**Scope:** resolve-or-create path in `timeclock_module.js` + `portal_module.js:ensureRollupChain`
**Work:** Integration tests: `resolveOrCreateProject` with (a) existing project match, (b) no match → auto-create, (c) multi-match → most-recent wins, (d) no EC → project created with `engineering_contract_id=NULL`.
**Acceptance criteria:** Test suite passes all four cases. Rollback on partial-create verified.
**Risk:** MEDIUM — touches rollup chain which is load-bearing for billing tree integrity.
**Auditor count:** 2 (standard; treat like data-integrity wave)

### Batch 4: Polish + a11y
**Scope:** `public/timeclock.html`
**Work:** Preview line SR-friendly (`aria-live="polite"`). Disabled state on `ci-job` and `ci-wo` until `ci-client` selected. Error state when resolve-or-create fails. Mobile thumb-friendly sizing (existing `@media(max-width:600px)` breakpoint already handles most of it).
**Acceptance criteria:** Tab flow is Client → Job → WO → Clock In. NVDA announces preview updates. Mobile taps meet 44px minimum.
**Risk:** LOW
**Auditor count:** 1 (trivial polish)

---

## Area E — Open Questions for User

1. **WO# source for non-PSC clients.** `concentrators` is tied to `contract_label` (PSC RUS contracts). Non-PSC clients use `service_area_label` (free text on projects). Should the WO# dropdown show `projects.work_order_number` values for non-PSC clients, or just hide the dropdown entirely? Or is WO# always PSC-only?

2. **Default-select / stickiness.** Should the three dropdowns remember the last-used `(client, job, WO#)` across sessions (localStorage)? Or always start blank? Quick-clock buttons handle "resume yesterday's project" — so the picker can start blank without friction.

3. **Permission: can any logged-in user auto-create projects?** Today, engineers can request a new project (admin approval required). The new auto-create path would bypass approval. Is that acceptable for the daily timeclock workflow, or should auto-create go through the existing approval queue too?

4. **`status = 'completed'` match behavior.** If the only matching project for `(client, job, WO#)` is `status='completed'`, should the picker (a) auto-create a new project anyway, (b) use the completed one, or (c) surface an error? Recommendation: (a) auto-create new, but confirm.

5. **Backward-compat cutover.** The Quick-clock buttons send `{ project_id }` to `POST /api/timeclock/clock-in`. Plan is to keep the old `project_id` path alive in parallel. Confirm this is acceptable rather than hard-cutover.

---

## Pre-build schema verification checklist

- [x] `jobs.team` exists (VARCHAR(20), values: design/permitting/construction/both/shared/NULL) — confirmed `routes/jobs.js`
- [x] `jobs.program_scope` exists (migration 0006: `rus | non_rus | shared`) — confirmed
- [x] `concentrators.area_name` + `concentrators.work_order_number` + `concentrators.contract_label` — confirmed `scripts/schema_core.sql:417`
- [x] `projects.work_order_number` (VARCHAR(100)) — confirmed `scripts/schema_core.sql:135`
- [x] `projects.is_rollup`, `projects.rollup_level`, `projects.rollup_key` — confirmed `server.js:891-893`
- [x] `projects.engineering_contract_id` — confirmed, added by Wave RUS-Fix migration 0023
- [x] `ensureRollupChain` callable from new code — exported at `portal_module.js:1091`
- [ ] Confirm: how to map `client_id` → `contract_label` for the concentrators lookup (via `engineering_contracts.contract_number` or name? Need to verify which field `concentrators.contract_label` matches)
- [ ] Confirm job_assignments behavior when no assignments exist for a client: the heuristic in `routes/jobs.js` falls back to `program_scope` filter — verify it returns the right jobs for non-PSC clients

=== TIMECLOCK PICKER DISCOVERY END ===
