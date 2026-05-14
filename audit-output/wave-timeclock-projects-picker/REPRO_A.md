# REPRO_A — Timeclock Projects Picker Bug (UI-Flow Framing)

---

## 1. Timeclock Surface Inventory

| File | Purpose | Visibility | Type |
|---|---|---|---|
| `public/timeclock.html` | Full standalone time-clock portal (clock-in/out, week view, entries table, edit modal) | All authenticated employees via `/timeclock` route | **Standalone portal** |
| `public/admin.html` | Links to external timeclock URL (`launchfibertimeclock.xyz`) + held-timecard panel + timeclock-audit admin surface | Admin only | Embedded admin tools, not a picker surface |
| `public/js/hours_tab.js`, `public/js/unbilled_hours_panel.js`, `public/js/held_timecards.js` | Admin-side time entry management surfaces; no project picker used by staff | Admin only | Read-only management |

**Primary bug surface: `public/timeclock.html` only.** The project picker that staff interact with daily lives entirely in this file.

---

## 2. Project-Picker Inventory

| Selector | Location | Trigger | Endpoint | Includes rollups | Scoped by |
|---|---|---|---|---|---|
| `#ci-project` | Pre-clock-in form (main clock card, clocked-out state) | `renderClockCard()` on page load / after clock-out. Populated via `populateProjectSelect(el)` — no opts | `GET /api/projects?status=active` | **NO** — `!p.is_rollup` filter at `timeclock.html:689` | None — flat list of all active leaves across all clients, programs, and service areas |
| `#ci-job` | Pre-clock-in form, below project picker | `ciProjectChanged()` on project select change | `GET /api/jobs` (cached globally) | N/A — jobs table, not projects | By selected project |
| `#switch-project` | Switch Project modal (clocked-in state) | `openSwitchModal()` | Same `projectsCache` | Same `!p.is_rollup` filter — `timeclock.html:952` | None — same flat list |
| `#switch-job` | Switch Project modal | `switchProjectChanged()` | Same jobs cache | N/A | By selected project |
| `#entry-project` | Entry edit modal (manual add + edit existing) | `openManualEntryModal()` / `openEditEntryModal()` | Same `projectsCache` | Same `!p.is_rollup` filter — `timeclock.html:689` | Optional: scoped by `#entry-client` selection |
| `#entry-client` | Entry edit modal — client filter | Always populated on modal open | Derived from `projectsCache` (distinct `client_id` values) | N/A | — |
| `#entry-job` | Entry edit modal | `entryProjectChanged()` | Same jobs cache | N/A | By selected project |

**Key structural finding:** The entry-edit modal has a Client → Project cascade (client select narrows project list). The pre-clock-in form (`#ci-project`) has **no cascade at all** — it is a single flat dropdown with no client, program, or service-area filter.

---

## 3. Bug Repro

**Root cause: Not rollup rows leaking through. The filter works. The symptom is correct leaf rows that happen to share the same project `name`.**

The project tree for PSC/RUS follows the rollup hierarchy:

```
Client rollup (PSC)
  └── Team rollup (Inspection / Resident Engineer / etc.)
       └── Service Area rollup (WO#1234-area, WO#1235-area, ...)
            └── Leaf project (name="Inspection", project_type='inspection', is_rollup=FALSE)
```

Every WO in PSC/RUS has its own leaf project named "Inspection" — one per service area. The `populateProjectSelect` function at `timeclock.html:684–705` correctly filters `!p.is_rollup`, but the label it renders is:

```js
// timeclock.html:701-702
const cli = (!opts.client_id && p.client_name) ? `${esc(p.client_name)} — ` : '';
html.push(`<option value="${esc(p.id)}"${sel}>${cli}${esc(p.name)}${wo}</option>`);
```

For a leaf named "Inspection" under WO#1234, the label is:
```
PSC — Inspection [WO#1234]
```

With 12 WO areas each having an Inspection leaf, you get 12 options all starting with "PSC — Inspection [...]" — visually identical except for the WO# suffix which is easy to overlook. The user's experience: "It just says inspection like a dozen times."

**Verified by reading: `public/timeclock.html:684–705`**
```js
function populateProjectSelect(selectEl, selectedId, opts){
  opts = opts || {};
  const html = ['<option value="">— Select project —</option>'];
  let leaves = projectsCache.filter(p => !p.is_rollup);   // correct — no rollups
  if (opts.client_id) {
    leaves = leaves.filter(p => String(p.client_id) === String(opts.client_id));
  }
  // No program filter. No service-area filter.
  // Label: "PSC — Inspection [WO#1234]" — repeated N times for N service areas.
```

**Secondary issue (NULL rollup risk):** `is_rollup boolean DEFAULT false` — no NOT NULL constraint. If any rollup rows have `is_rollup = NULL` (e.g. from legacy or admin-direct inserts), `!null === true` in JS and they would pass the filter. However, the route always explicitly sets `is_rollup` via INSERT param `$24`, so this is low-risk for new rows. Worth checking with a DB query in fix-agent work.

**API response shape:** `GET /api/projects?status=active` returns `p.*` via `SELECT p.*` at `routes/projects.js:64`. The `is_rollup` column is included. The `child_count` subquery at `routes/projects.js:70` is also present. The shared `project_picker.js` module uses `child_count === 0` as leaf detection; the timeclock's inline function uses `!is_rollup`. These diverge for any leaf with children (hypothetically possible if a leaf was re-parented), but for the main bug this distinction is irrelevant.

---

## 4. Trigger Identification

**Trigger: page load (not "after a specific action").** The pre-clock-in form renders immediately when a user who is clocked out loads `timeclock.html`. The `init()` sequence at `timeclock.html:1278` is:

```
loadCurrentUser() → loadProjects() → loadActiveSession() → renderClockCard()
```

`loadProjects()` at `timeclock.html:654` fetches `/api/projects?status=active` and stores the full active project list in `projectsCache` (no filtering). Then `renderClockCard()` renders the clock-out state which calls `populateProjectSelect(document.getElementById('ci-project'))` with no `opts` — all leaves, no cascade.

If the user phrased it as "after a specific action" they may mean: it only becomes visible/noticeable when they specifically go to clock in (the form is only rendered when not clocked in). There's no deferred load or second action — the broken list is immediately present on the first page load for a clocked-out user.

**Switch Project modal** shows the same unfiltered flat list when the user clicks "Switch Project" while clocked in.

---

## 5. Cascade Feasibility

**User-desired UX: Client → Program → Service Area → Job**

| Step | Data Available | Work Needed |
|---|---|---|
| **Client** | `p.client_name` / `p.client_id` on every project row already in `projectsCache`. `populateClientSelect()` already exists in `timeclock.html:710–725` (used in entry-edit modal). | **Zero backend work.** Wire a `#ci-client` `<select>` above `#ci-project`; re-use existing `populateClientSelect()` + `entryClientChanged()`-style handler. |
| **Program (RUS / BAU / GFR / Other)** | `p.program` field on every project row (`routes/projects.js:64` returns `p.*`). No current UI filter for this field. | **Zero backend work.** Add a `#ci-program` select; filter `projectsCache` by `p.program`. Values: `rus`, `bau`, `gfr`, `other`, plus NULL for unclassified. |
| **Service Area** | Represented by the rollup row named after the WO/area (`rollup_level = 'service_area'`). The leaf projects' `parent_id` chain leads to the SA rollup. To build this cascade you need to walk the parent chain OR add a `service_area_label` / `concentrator_id` / `work_order_number` filter on the leaf. `p.work_order_number` is already returned on leaves. | **Zero backend work if using WO# as proxy.** A `#ci-wo` dropdown populated with distinct WO# values from filtered leaves. OR: a multi-level filter by `parent_id` walking the rollup tree from `projectsCache` (all rollup rows are already in the cache since `populateProjectSelect` just skips them — they're still fetched). |
| **Job (Inspection / RE / Permitting / etc.)** | `p.name` on the leaf project (e.g., "Inspection"). Alternatively `p.project_type` (`'inspection'`, `'re'`, etc.). Both are returned. | **Zero backend work.** A `#ci-type` select populated with distinct `p.name` or `p.project_type` values from the filtered leaf set. |

**Net assessment:** the full cascade can be implemented entirely client-side using the existing `projectsCache` payload. No new API endpoints or schema changes required. The `program` and `client_id` fields are already on every project row returned by the existing `/api/projects?status=active` call.

**Caveat:** with 1000-row default limit on `/api/projects`, large deployments might truncate the cache. If PSC has 1000+ projects, the cascade would silently miss some. Fix: timeclock should call `/api/projects?status=active&limit=all` or the fix-agent should evaluate whether the limit bites in practice.

---

## 6. Daily-Use Impact Assessment

**Who uses it:** every design engineer, permitting engineer, and construction engineer in the office — i.e., every non-admin, non-manager employee. Per CLAUDE.md §2: "Time logging is a daily-use surface for everyone in the office."

**Frequency:** multiple times per day per employee. Clock-in at start of task, clock-out or switch at every project change, plus manual entry corrections.

**What "broken" costs daily:**
- Engineer must scroll through 12+ identical-looking "PSC — Inspection" options and identify the correct WO# from a 4–5 digit suffix that may not be memorized.
- Engineers picking the wrong WO# means hours land on the wrong project — incorrect billing, incorrect invoice rollup, incorrect inspection-tab reporting. This is financial exposure on RUS government contracts where hours-per-WO are reported.
- Without the cascade, the "Select project" interaction for a 60-second clock-in task becomes a 20–30 second disambiguation exercise.
- Clock-out friction reduces adoption; missed clock-outs mean the week view understates team hours.

---

## 7. Three Highest-Value Open Questions for Fix-Agent

1. **Cascade depth: WO# or rollup tree?** WO# as the service-area proxy is simpler (one extra select, uses existing `p.work_order_number`). Walking the rollup parent chain shows the actual area name (more meaningful to the user). Which does Carter prefer? The rollup approach requires fetching rollup rows from `projectsCache` (they're already there — just need to not filter them out during the cascade build step).

2. **What happens to the Switch Project modal?** It uses the same inline `populateProjectSelect` with no cascade. Fix-agent must update both the pre-clock-in picker AND the switch-project modal, or the problem reappears mid-shift.

3. **Should `#ci-client` be pre-filled?** If the company has only one client (PSC), surfacing a client dropdown adds a required click with no information value. Consider: skip the Client step if `projectsCache` contains only one distinct client, and auto-select it. Same logic for Program if all active projects share one program.

---

=== TIMECLOCK PICKER REPRO A END ===
