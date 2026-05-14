# Timeclock Projects Picker — Repro B (Code + State Machine + Schema)

> Agent B — code, state-machine, and schema framing.
> READ-ONLY. No code modified.
> Date: 2026-05-14

---

## 1. Endpoint Table

| Endpoint | SQL WHERE | is_rollup filter? | Params | Invocation site |
|---|---|---|---|---|
| `GET /api/projects?status=active` | `p.status='active'` | **NO** — returns ALL rows incl. rollups | `status`, `client_id`, `type`, `limit`, `offset` | `timeclock.html:656` — `loadProjects()` on page init |
| `GET /api/timeclock/recent` | `s.user_id=$1 AND s.started_at > NOW()-interval AND p.id IS NOT NULL` | N/A — joins `time_clock_sessions`; only project_id stored | `days`, `limit` | `timeclock.html:850` — `renderQuickClockButtons()` |
| `GET /api/timeclock/active` | `s.user_id=$1 AND s.ended_at IS NULL` | N/A | none | `timeclock.html:1282` — `loadActiveSession()` |

The **only** project list feeding the picker is `GET /api/projects?status=active` at `timeclock.html:656`.

---

## 2. Schema Map

```
clients (id, name)
   │
   ├─ FK: engineering_contracts.client_id → clients.id
   │        (id, client_id, name, program [rus|bau|gfr|other])
   │           │
   │           ├─ FK: ec_service_areas.engineering_contract_id
   │           │        (id, engineering_contract_id, name)
   │           └─ FK: ec_work_orders.engineering_contract_id
   │                    (id, engineering_contract_id, service_area_id, number)
   │
   ├─ FK: projects.client_id → clients.id
   │        (id, client_id, engineering_contract_id, parent_id, is_rollup,
   │         rollup_level, rollup_key, name, program, job_id, status, ...)
   │         SELF-REF: projects.parent_id → projects.id
   │
   └─ FK: contracts.client_id → clients.id (legacy)
            ↘ JOIN: contracts.friendly_label → concentrators.contract_label

time_clock_sessions
   (user_id, staff_id, project_id FK→projects.id, job_id FK→jobs.id,
    started_at, ended_at, created_time_entry_id FK→time_entries.id)

time_entries
   (project_id FK→projects.id RESTRICT, staff_id FK→staff.id,
    user_id FK→users.id, entry_date, hours, pending_project_request_id)
```

**Cascade-relevant FK path for Client → Program → SA → Job:**

```
clients.id
  → engineering_contracts.client_id      (program = rus/bau/gfr/other)
    → ec_service_areas.engineering_contract_id  (service area level)
      → ec_work_orders.engineering_contract_id  (WO# with service_area_id link)
  → projects.client_id                   (leaf projects bind to EC via engineering_contract_id)
    → projects.job_id → jobs.id          (job type for billing category)
```

`time_entries` binds to `projects.id` directly. `time_clock_sessions` also binds to `projects.id`. No FK to `ec_service_areas` or `ec_work_orders` on either table — those are resolved at clock-in resolution time, not stored on the time row.

---

## 3. Root Cause

**The `GET /api/projects` query at `routes/projects.js:63-105` has no `is_rollup = FALSE` filter.** It returns every project with `status='active'`, rollups and leaves alike.

```javascript
// routes/projects.js:63-105 (the full list endpoint)
const { rows } = await pool.query(`
  SELECT p.*,
    cl.name as client_name,
    ...
    (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) as child_count,
    ...
  FROM projects p
  LEFT JOIN clients cl ON cl.id = p.client_id
  ...
  ${whereStr}       -- only status/client_id/type filters; NO is_rollup filter
  GROUP BY ...
  ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
  LIMIT $${i++} OFFSET $${i++}
`, params);
```

`timeclock.html:689` filters these in JS:
```javascript
let leaves = projectsCache.filter(p => !p.is_rollup);
```

This filter depends on `p.is_rollup` being `true` on rollup rows. **If rollup rows have `is_rollup=NULL` or `is_rollup=false` in the database, this filter is ineffective** — they pass through and appear in the picker. The `child_count` subquery IS computed but `populateProjectSelect` does NOT use `child_count` as a fallback filter. It relies entirely on `is_rollup`.

**Why "Inspection" appears ~12 times:** "Inspection" is a common `project_type` and likely also the `name` shared across `service_area`-level rollup rows (`rollup_level='service_area'` with `name` set to something like "PSC Inspection"). If these rows have `is_rollup=NULL` (null treated as falsy by the JS `!p.is_rollup` check but stored as SQL NULL which the Postgres default is `false`), they pass the JS filter.

The more likely explanation: rollup rows have `is_rollup=TRUE` in the DB but carry `project_type='inspection'` — and leaf projects named "Inspection" exist for each service area, repeating the name across 12 WO areas. The JS `!p.is_rollup` filter then correctly excludes the actual rollup rows but lets through the leaf-level inspection projects that all share the name "Inspection" because the `name` column is populated from the rollup hierarchy pattern (team/SA name copied to leaf). **Both paths land the same symptom.**

**Primary confirmed bug:** `routes/projects.js:63` — no `AND NOT p.is_rollup` WHERE clause. The default LIMIT 1000 also means a large install could silently truncate project results before all leaves are seen.

---

## 4. Regression Bisect

**Most likely culprit: `7f3b6cb` (Feature: EC WO# + Service Areas).**

This commit introduced `ec_service_areas` and `ec_work_orders` tables and wired `engineering_contract_id` onto `projects`. It also updated the project-creation flow to call `ensureRollupChain` which creates rollup rows (`is_rollup=TRUE`) for `client`, `team`, and `service_area` levels automatically. Before this commit, rollup rows likely didn't exist in quantity; after it, every new project creation triggers 3 rollup rows whose `project_type` inherits the parent's type — likely `'inspection'` for inspection-program ECs.

**Secondary candidate: `916f11f` (Mirror EC WO/SA pickers to design.html + permitting.html)** — may have triggered `ensureRollupChain` retroactively for existing ECs, generating a batch of rollup rows at migration time.

Neither the `timeclock.html` `populateProjectSelect` function nor `routes/projects.js` was touched by these commits to add a compensating `is_rollup` filter.

**The `public/js/project_picker.js` module (line 47) correctly filters on `child_count === 0`:**
```javascript
function _looksLikeLeaf(p) {
  if (typeof p.child_count === 'number') return p.child_count === 0;
  return true;
}
```
But `timeclock.html` does NOT use `populateProjectPicker` from this module. It has its own inline `populateProjectSelect` that checks only `p.is_rollup` — and misses the `child_count` secondary defense. **This is a second latent bug:** a project with `is_rollup=FALSE` but `child_count > 0` (a structural parent that wasn't flagged as rollup) would still appear in the timeclock picker even though it's not a true leaf.

---

## 5. State Machine

**Picker repopulation triggers:**

```
page load
  → init()
    → loadProjects()           [fills projectsCache once]
    → loadActiveSession()      [if active session → renders clock-in/active card]
    → renderQuickClockButtons() [reads /api/timeclock/recent for last 3 projects]

clock-in card render (timeclock.html:834)
  → populateProjectSelect(#ci-project)   [uses projectsCache; no refetch]

entry modal open (openManualEntryModal, timeclock.html:1081-1082)
  → populateClientSelect(#entry-client)  [uses projectsCache; no refetch]
  → populateProjectSelect(#entry-project) [uses projectsCache; no refetch]

entry client change (entryClientChanged, timeclock.html:1128-1130)
  → populateProjectSelect(#entry-project, null, { client_id: cid })

project select change (entryProjectChanged, timeclock.html:1117-1124)
  → populateJobSelect(#entry-job, pid)   [may fetch /api/jobs if not cached]
```

**Race condition analysis:**

No race between picker population and project cache load: `loadProjects()` is `await`ed inside `init()` before `loadActiveSession()`. The clock-in card renders inside `loadActiveSession()` at `timeclock.html:834` after the await returns — so `projectsCache` is guaranteed populated when `populateProjectSelect` fires. Clean sequential initialization.

**One potential staleness issue:** `projectsCache` is loaded once on page init and never refreshed during the session. If admin creates a new project after the engineer opens the timeclock tab, it won't appear until page reload. Not a root cause of the rollup bug but relevant for production reliability.

---

## 6. persistFilter Interaction

`grep -rn "persistFilter" public/timeclock.html` → **zero hits.** `persistFilter` is a design/permitting-portal pattern (the `projects_tab.js` / `admin.js` filter-persistence mechanism). It does not interact with the timeclock picker at all.

---

## 7. Cascade Schema-Readiness Table

| Cascade Level | Existing Endpoint | `is_rollup` Filter Available? | Cascade-Ready? |
|---|---|---|---|
| **Client** | `GET /api/clients` — `requireAuth()`, returns all clients | N/A | ✓ Ready — use as cascade root |
| **Program** (EC) | `GET /api/engineering-contracts?client_id=X` — `requireAuth()`, filters by `client_id` | N/A | ✓ Ready — returns EC + program field |
| **Service Area** | `GET /api/timeclock/picker-data?client_id=X` — **does not exist yet** (spec: query `ec_service_areas JOIN ec_work_orders` + legacy `concentrators` fallback) | N/A | ✗ Needs new endpoint |
| **Job** | `GET /api/jobs?client_id=&engineering_contract_id=&program=` — full cascade-aware filter in `routes/jobs.js` | N/A | ✓ Ready |
| **Leaf Project Resolution** | `POST /api/timeclock/clock-in` accepts `{project_id}` today | N/A | ✗ `resolveOrCreateProject` helper missing; needs new `{client_id, job_id, work_order_number}` path |

The existing `GET /api/projects?status=active` is NOT cascade-ready — it must NOT be used as the leaf-project source in the new cascade UI. The new cascade resolves projects server-side via `resolveOrCreateProject`.

---

## 8. Timeclock Build Maturity Assessment

**Verdict: PARTIAL — functional stub with a correct architecture but an incomplete UX.**

What's complete:
- `timeclock_module.js` — clock-in/out/switch/active/recent endpoints, session schema, audit log, soft/hard cap enforcement, forgot-clock-out detection. Production-quality backend.
- `time_entries.js` — CRUD with auth, engineer scoping, undo bucket, billable flag. Production-quality.
- Schema: `time_clock_sessions` + `time_entries` + `time_entry_audit` with correct FKs. Complete.
- Quick-clock buttons (recent-project fast-lane). Complete and correct.
- Manual entry modal with Client → Project cascade (works correctly today for leaf selection). Complete.

What's incomplete:
- **Main clock-in card has no Client filter** — engineer must scroll a flat list of all leaf projects across all clients. This is the primary UX complaint.
- **No Program or Service Area level** in the picker — user wants Client → Job → WO# cascade to narrow to the right project without knowing the exact project name.
- `resolveOrCreateProject` helper (auto-creates leaf project from `(client, job, WO#)`) — absent. Required for the new cascade to work without forcing the user to manually find exact project names.
- `GET /api/timeclock/picker-data` endpoint — absent. Required to serve job + WO# lists for a given client in a single call.

A complete discovery spec was previously written at `audit-output/future/timeclock-picker-spec.md` (274 lines). It documents all gap items, 4-batch scope decomposition, schema readiness checklist, and open questions. The fix work is a **frontend rebuild (Batch 2) + backend endpoint additions (Batch 1)** — roughly 2-3 focused agent dispatches using the existing spec.

**Surgical bug fix scope (narrower than full rebuild):** adding `AND NOT p.is_rollup` to `GET /api/projects` WHERE clause (or adding `?is_rollup=false` filter param) would eliminate the rollup leak immediately. The existing `populateProjectSelect` in `timeclock.html` already has the JS-side `!p.is_rollup` guard — the guard just needs the DB column to be reliable. This is a 1-line server-side fix that closes the reported symptom without requiring the full cascade rebuild.

---

## 9. Top 3 Open Questions for Fix Agent

1. **Are rollup rows consistently flagged `is_rollup=TRUE` in production, or are some NULL?** The JS filter `!p.is_rollup` treats NULL as falsy (passes through). If any rollup rows have `is_rollup=NULL` (possible if created before migration 0023 added the column default), the surgical server-side filter `AND NOT p.is_rollup` must use `AND (p.is_rollup IS NULL OR p.is_rollup = FALSE)` inverted logic — i.e. `AND p.is_rollup IS NOT TRUE`. Confirm DB state before choosing the WHERE predicate.

2. **Surgical fix vs full cascade rebuild — which does the user want now?** The spec at `audit-output/future/timeclock-picker-spec.md` was deferred to a future phase. The reported bug (rollups appearing) is fixable in ~1 line server-side. The desired UX (Client → Job → WO# cascade) requires Batch 1 + Batch 2 work (~3 agent dispatches). Confirm scope before dispatching a fix agent.

3. **LIMIT 1000 truncation risk:** `GET /api/projects?status=active` defaults to LIMIT 1000. If the production install has more than 1000 active projects (plausible at scale with many WO-level leaf projects), the timeclock's `projectsCache` will silently truncate. The fix agent should add `?limit=all` to the `loadProjects()` API call in `timeclock.html:656`, OR implement server-side pagination on the picker. Note that `?limit=all` on a large project table carries a perf cost — the server-side filter approach (new `picker-data` endpoint) is cleaner long-term.

---

=== TIMECLOCK PICKER REPRO B END ===
