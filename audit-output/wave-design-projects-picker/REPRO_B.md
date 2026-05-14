# REPRO B — Design Portal Projects Picker Bug
**Framing:** code / state-machine walk
**Date:** 2026-05-14

---

## 1. Endpoint Table

| Endpoint | SQL filter for `is_rollup` | Params accepted | Invoked from design.html |
|---|---|---|---|
| `GET /api/projects` | **NONE** — returns all rows including `is_rollup=TRUE` | `?status`, `?client_id`, `?type`, `?limit`, `?offset` | Line 755 (`loadProjects`), Line 1226 (`loadExistingProjectsForClient`), Line 1351 (`ensureCachesLoaded` → `projectsCache`) |
| `GET /api/projects/:id` | N/A — single row by PK | — | Line 864 (`editProject`) |
| `GET /api/design` | `WHERE p.project_type='design'` (no rollup filter) | — | Line 1365 (`loadPipeline`) |
| `GET /api/engineering-contracts/:id/service-areas` | N/A | — | Line 1109 (`populateEcScopedWoSaForModal`) |
| `GET /api/engineering-contracts/:id/work-orders` | N/A | — | Line 1110 (`populateEcScopedWoSaForModal`) |

**Key observation:** `GET /api/projects` has no `is_rollup` filter at the SQL level. The endpoint returns every project row that matches the `status`/`client_id`/`type` params — rollup folders included.

Verified by reading: `routes/projects.js:24-80`

Code snippet (WHERE clause construction):
```js
const { status, client_id, type } = req.query;
let where = [];
let params = [];
let i = 1;
if (status) { where.push(`p.status=$${i++}`); params.push(status); }
if (client_id) { where.push(`p.client_id=$${i++}`); params.push(client_id); }
if (type) { where.push(`p.project_type=$${i++}`); params.push(type); }
// ... no is_rollup condition added anywhere
const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
```

---

## 2. Schema Map

```
clients
  id (PK)
  name
  show_contract  (bool — gates Contract field in modal)
  show_work_order
        │
        │ client_id
        ▼
engineering_contracts
  id (PK)
  client_id  ──────────────────────► clients.id
  name, program (rus|bau|gfr|other)
        │
        ├── ec_service_areas
        │     engineering_contract_id ──► engineering_contracts.id
        │     name (SA label, e.g. "Macon", "Warner Robins")
        │
        └── ec_work_orders
              engineering_contract_id ──► engineering_contracts.id
              service_area_id ──────────► ec_service_areas.id  (nullable)
              number (WO# text)
        │
contracts
  id (PK)
  client_id ──────────────────────► clients.id
  engineering_contract_id ────────► engineering_contracts.id  (nullable)
        │
        │ contract_id
        ▼
projects
  id (PK)
  parent_id ──────────────────────► projects.id  (self-ref; NULL = root)
  client_id ──────────────────────► clients.id
  contract_id ────────────────────► contracts.id
  engineering_contract_id ────────► engineering_contracts.id  (direct FK, derived from contract)
  concentrator_id ────────────────► concentrators.id  (legacy SA for PSC)
  is_rollup   BOOLEAN DEFAULT false
  rollup_level  VARCHAR(20)  — 'client' | 'team' | 'service_area' | NULL
  rollup_key    TEXT         — opaque string for ancestor matching
  program       VARCHAR(20)  — rus|bau|gfr|other (mirrored from EC)
  job_id ─────────────────────────► jobs.id

concentrators
  id (PK)
  area_name, contract_label, work_order_number  (legacy PSC SA table)
```

**Cascade-relevant FKs:**
- Client is on `projects.client_id` directly (not derived from rollup ancestry).
- Program is on `projects.program` (denormalized from EC at create/edit time).
- Service Area: for PSC clients via `concentrators` table (legacy) OR `ec_service_areas` via EC-scoped pickers. For non-PSC: free-text `service_area_label` baked into rollup_key.
- There is **no direct SA FK column** on leaf projects — SA is stored on the rollup ancestor row (`rollup_level='service_area'`) or inferred from the concentrator.

---

## 3. Root Cause

**There are two separate symptoms, not one:**

### Symptom A — Projects tab table shows rollup folder rows

`loadProjects()` (design.html:753) calls:
```
GET /api/projects?status=active
```
`routes/projects.js` SQL has no `is_rollup=FALSE` clause → returns all active projects including every rollup folder.

`renderProjects()` (design.html:764) renders the raw array with no client-side rollup filter. Result: the Projects tab table lists PSC rollup folders (e.g. rows named "Inspection" — a rollup_level='service_area' or 'team' row) repeated for each active rollup under PSC. These are the "dozen Inspection rows" the user sees.

Verified by reading: `public/design.html:753-790`

```js
async function loadProjects(){
  const status = document.getElementById('proj-status-filter')?.value || '';
  const url = '/api/projects' + (status ? '?status=' + encodeURIComponent(status) : '');
  try {
    projectsCache = await api(url);
    renderProjects(projectsCache);   // ← renders ALL rows, rollups included
  } catch (e) { ... }
}
```

### Symptom B — "Existing Project" picker in New Project modal also shows rollups (secondary, partially mitigated)

`loadExistingProjectsForClient()` (design.html:1216) calls:
```
GET /api/projects?client_id=X&status=active
```
Then applies a client-side filter at line 1233:
```js
const leaves = (rows || []).filter(p => !p.is_rollup);
```
This does filter correctly — **but only if `is_rollup` is present in the response**. The `GET /api/projects` endpoint does `SELECT p.*` which includes `is_rollup`, so `is_rollup` is present. This picker is therefore working correctly in isolation.

**However,** `ensureCachesLoaded()` (design.html:1350) also populates `projectsCache`:
```js
if (force || !projectsCache.length) {
  try { projectsCache = await api('/api/projects'); } catch(e){}
}
```
This fetches with no filters at all — no `status`, no `client_id`, no rollup guard. This `projectsCache` is then passed directly to `renderProjects()` on any SSE-triggered `loadProjects()` call, again showing rollups.

**Primary cite:** `public/design.html:753-762` (loadProjects/renderProjects, no rollup filter)
**Secondary cite:** `public/design.html:1350-1352` (ensureCachesLoaded projectsCache, no filter)
**Endpoint cite:** `routes/projects.js:24-80` (SQL builds WHERE without is_rollup condition)

---

## 4. Regression Bisect

**Likely culprit commit: `916f11f`** (2026-05-12) "Mirror EC WO/SA pickers to design.html + permitting.html"

This commit added 118 lines to design.html including the `contractChanged()` → `populateEcScopedWoSaForModal()` wiring. The commit message notes: "openProjectModal() reset block clears any stale injected proj-wo-select between modal opens" — indicating it touched the modal open path.

However, the `loadProjects` + `renderProjects` rollup-leakage was almost certainly present **before** `916f11f`. The Projects tab is a compatibility shim (wrapped in `display:none`) as of the current code, not the primary Pipeline view. The user-reported "dropdown" is most likely the `proj-existing` picker inside the Add Project modal, which was introduced in an earlier wave.

**More probable earlier culprit:** commit `7f3b6cb` (2026-05-11) "Feature: EC WO + Service Areas" — added the EC-scoped pickers. Before this commit, design.html only had concentrator-based SA + free-text WO. After this commit `ensureCachesLoaded` started caching all projects unfiltered for the modal's dropdown population logic.

The `proj-existing` picker's `.filter(p => !p.is_rollup)` guard was presumably added when the `loadExistingProjectsForClient` function was first introduced — but `loadProjects`/`renderProjects` were never updated to match.

---

## 5. State-Machine Analysis

```
Page load
  └─► loadPipeline()           ← hits /api/design (design-only, not rollup issue)

sv('pipeline') called
  └─► loadPipeline()

"Add Project" button clicked
  └─► openProjectModal()
        └─► ensureCachesLoaded()
              └─► api('/api/projects')  → projectsCache (ALL projects, no filter)
        └─► populateProjectFormDropdowns()

proj-client changed
  └─► clientChanged()
        └─► loadExistingProjectsForClient()
              └─► api('/api/projects?client_id=X&status=active')
              └─► .filter(p => !p.is_rollup)   ← correct guard here
              └─► populates #proj-existing
        └─► refilterJobsDropdown()
        └─► refresh contracts dropdown

proj-contract changed
  └─► contractChanged()
        └─► populateEcScopedWoSaForModal(ecId)
              └─► api('/api/engineering-contracts/:id/service-areas')
              └─► api('/api/engineering-contracts/:id/work-orders')
              └─► populates #proj-concentrator from ec_service_areas
              └─► injects #proj-wo-select from ec_work_orders

SSE: project_added/updated/deleted
  └─► _debounce('projects', () => callIfExists('loadProjects'))
        └─► loadProjects()
              └─► api('/api/projects?status=active')
              └─► renderProjects(projectsCache)   ← renders rollups in #dpb
```

**Race condition:** none. The issue is structural, not timing-based. `loadProjects` unconditionally renders whatever the endpoint returns.

**State-machine gap:** No path exists where the Projects tab (#dpb) is populated with leaves-only. Every code path that calls `renderProjects()` passes the raw unfiltered API response.

---

## 6. persistFilter Interaction

`persistFilter` does **not exist** in design.html. There are zero references to `persistFilter`, `localStorage`, or filter-state persistence in the design portal's inline script. This is an admin portal (Wave 2 FE-Crit) concern only.

`project_picker.js` is also **not loaded** in design.html — only `toast.js`, `keyboard.js`, `dialog.js`, `focus_trap.js`, `undo_bar.js`, and `change_password_modal.js` are imported.

No `persistFilter` interaction with this bug.

---

## 7. Cascade Schema-Readiness

The user wants: **Client → Program (RUS/BAU) → Service Area → Job**

| Level | Current state | What's needed |
|---|---|---|
| **Client** | EXISTS — `#proj-client` select, populated from `/api/clients` | Ready as-is |
| **Program** | PARTIAL — `#proj-ptype` select exists but is hidden unless PSC/show_contract. Populated from `/api/project-types` (which maps to program enum). No cascading relationship to SA or Job. | Needs to be always-visible and drive SA + Job filtering |
| **Service Area** | PARTIAL — Two tracks: (1) `#proj-concentrator` select (PSC/EC-scoped via `ec_service_areas`), (2) free-text `#proj-service-area` input. Neither is chained to Program. SA picker shown/hidden by `applyPortalProjectModalFieldGating()` based on client flags. | Needs Program → SA cascade; EC-scoped SAs already exist in DB as `ec_service_areas` filtered by `engineering_contract_id` |
| **Job** | EXISTS — `#proj-job` select, filtered by `program_scope` via `refilterJobsDropdown()`. Jobs do have `program_scope` column that maps to rus/bau/gfr/other. | **Already cascades from Program** via `refilterJobsDropdown()` — this part works. Needs SA pre-selection to finish the chain. |

**What's missing for the full cascade:**
- Program must trigger SA repopulation: when user picks "RUS", filter `ec_service_areas` to ECs with `program='rus'`, populate SA picker. Needs new endpoint or client-side filter on already-fetched EC data.
- SA selection must narrow Job list: already partially done (jobs filtered by `program_scope`), but SA → specific EC WO# auto-population is only wired via `contractChanged()` not via a direct Program→SA→WO cascade.
- No new schema columns needed — `ec_service_areas.engineering_contract_id` → `engineering_contracts.program` already provides the join for Program → SA.

---

## 8. Three Highest-Value Open Questions for Fix-Agent

1. **Which surface is broken for the user?** The Projects tab table (`#dpb`) is hidden (`display:none`) in current design.html — it's a compatibility shim. If the user is seeing rollups "in the dropdown," they may mean the `#proj-existing` picker inside the Add Project modal (which IS correctly filtering), OR they may be using the admin portal's design view (`design_potential_tabs.js`). The fix-agent should confirm: is the symptom in the admin portal's Design Pipeline tab or the design engineer's design.html modal?

2. **Fix scope for `loadProjects`/`renderProjects`:** Adding `?is_rollup=false` as a query param to the existing `/api/projects` endpoint requires a 1-line SQL change in `routes/projects.js` (add `if (req.query.is_rollup === 'false') where.push('p.is_rollup=FALSE')`). Alternatively, add a client-side filter in `renderProjects`. Which approach? The SQL approach is cleaner and protects all callers.

3. **Cascade redesign scope:** The user's stated goal ("Client → Program → Service Area → Job") is a **new feature** (cascade picker), not a bug fix. The existing modal already has the pieces but they're not chained in the right order. Should the fix-agent build the cascade in this wave, or fix only the rollup-leakage and defer cascade to a separate feature wave?

---

`=== DESIGN PICKER REPRO B END ===`
