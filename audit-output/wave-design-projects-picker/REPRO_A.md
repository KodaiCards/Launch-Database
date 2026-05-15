# Design Portal — Project Picker Bug: REPRO_A (UI Flow Walk)

**Agent:** A (UI-flow walk framing)
**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`

---

## 1. Project-Picker Inventory Table

| Selector ID | File | Trigger | Endpoint | Current Behavior | Includes Rollups | Scoped By |
|---|---|---|---|---|---|---|
| `#proj-client` | `design.html:432` | "New Project" modal open (`openProjectModal()`) | `/api/clients` via `ensureCachesLoaded()` | Populates all clients | N/A | none |
| `#proj-ptype` | `design.html:472` | Same modal open | Static enum (rus/bau/gfr/other) hardcoded in JS | Static 4-option list | N/A | none |
| `#proj-existing` | `design.html:447` | Client selected (`clientChanged()` → `loadExistingProjectsForClient()`) | `GET /api/projects?client_id={X}&status=active` | Returns ALL rows for client, `is_rollup` filter applied client-side | **Y — rollups included in API response; filtered client-side** | client only; `project_type` filter silently fails (see §2) |
| `#proj-contract` | `design.html:436` | Client selected via `clientChanged()` | `GET /api/contracts?client_id={X}` | **Bug: never populates** (see §2 — `clientId` undeclared) | N/A | N/A |
| `#proj-concentrator` | `design.html:458` | Contract changed OR EC has ec_service_areas | `/api/engineering-contracts/:id/service-areas` | EC-scoped SA list; falls back to legacy concentrators | N/A | EC-scoped |
| `#proj-job` | `design.html:479` | Client/program selected | `GET /api/jobs?program=` or `?client_id=` | Filtered by program or client | N/A | program or client |
| `#proj-status-filter` | `design.html:387` | Hidden shim — legacy only | N/A | Hidden DOM element, feeds hidden `#dpb` table (dead UI) | N/A | N/A |

**Active pickers:** `#proj-existing` is the picker the user sees and is the source of the reported bug.

---

## 2. Bug Repro

**Picker:** `#proj-existing` (selector: `design.html:447`)
**Trigger:** User opens "New Project" modal → selects a client → `clientChanged()` fires → `loadExistingProjectsForClient()` runs.

**Broken call chain:**

1. `loadExistingProjectsForClient()` (`design.html:1216`) calls:
   ```
   GET /api/projects?client_id={X}&status=active[&project_type={ptype}]
   ```
2. The route handler is `routes/projects.js:29`. Query reads:
   ```javascript
   const { status, client_id, type } = req.query; // line 30
   if (type) { where.push(`p.project_type=$${i++}`); ... }
   ```
   The frontend sends `project_type` in the query string but the backend reads `type`. **The filter param name is mismatched — the type filter never fires.**

3. The route executes `SELECT p.* FROM projects p ... WHERE p.status='active' AND p.client_id=X` with **no `is_rollup` filter in SQL**. All rollup rows (`is_rollup=TRUE`) for the client are returned alongside leaf projects.

4. Client-side: `const leaves = (rows || []).filter(p => !p.is_rollup);` (`design.html:1233`) should filter rollups out. **This filter works IF `is_rollup` is present in the API response.** Confirmed: `SELECT p.*` in `routes/projects.js:64` does include `is_rollup`.

**Why the user sees "inspection a dozen times":**

The `ensureRollupChain()` in `portal_module.js` creates team-level rollup rows named after the job's team. Prior to migration 0009, the construction/inspection team was named `'inspection'` → rollup rows were inserted with `name = 'Inspection Team'` (or similar). Multiple clients each generated their own rollup rows with that name. Post-migration 0009, new rollups are named `'Construction Team'`, but **old rollup rows already in the DB retain the pre-migration name** "Inspection" (or the raw team value used as fallback). When the client picker fires, the API returns all of those rollup rows before the client-side `!p.is_rollup` filter can strip them — but **only if `is_rollup` is correctly set to `true` in the DB for those rows**.

The critical question: if any rollup rows were inserted before `is_rollup` column was reliably set (or if a code path created them without setting it), they would have `is_rollup = NULL` or `false`, causing `!p.is_rollup` to be `true`, leaking them into the picker. The column default is `DEFAULT false` (`schema.sql:420`), so any rollup row created without explicitly setting `is_rollup=TRUE` would pass the client-side filter and appear in the dropdown.

**The second bug — `clientId` undeclared in `clientChanged()`:**

`design.html:1192`:
```javascript
async function clientChanged(preserveJobId){
  // clientId is NEVER declared in this function's scope
  ...
  if (!clientId) { sel.innerHTML = '<option value="">None / N/A</option>'; return; }  // line 1192
```

`clientId` is only declared as `const clientId = ...` inside OTHER functions (`effectiveProgramForPortalProjectModal`, `applyPortalProjectModalFieldGating`, `loadExistingProjectsForClient`). In `clientChanged()` itself it is undeclared. In non-strict mode browsers, accessing an undeclared variable returns `undefined`. `!undefined` is `true`, so the `return` fires immediately. **The contracts dropdown is NEVER populated in design.html.** This prevents the Contract field from working, which in turn blocks EC-scoped SA/WO# resolution.

---

## 3. Trigger Identification

**Primary trigger:** Opening the "New Project" modal (`openProjectModal()`, `design.html:793`) and selecting a client from `#proj-client`. This fires `clientChanged()` which calls `loadExistingProjectsForClient()`.

**Secondary trigger:** The modal is also opened via `editProject(id)` (`design.html:810`) which calls `populateProjectFormDropdowns()` then `clientChanged(p.job_id)`. The same broken `clientId` undeclared reference fires in this path too.

There is NO "specific action after page load" that's separate — the bug fires on every client selection within the project modal.

---

## 4. Cascade-Feasibility Analysis

**User's desired cascade:** Client → Program (RUS/BAU/GFR/Other) → Service Area → Job (leaf)

| Cascade Level | Data Available? | Existing Endpoint | Gap |
|---|---|---|---|
| Client | Yes | `/api/clients` | None — client picker already works |
| Program | Yes | Static enum (rus/bau/gfr/other) | `#proj-ptype` already exists but must be populated BEFORE loading SAs/jobs |
| Service Area | Partial | `/api/engineering-contracts/:id/service-areas` (EC-scoped) or `/api/concentrators` (PSC legacy) | For non-EC clients, free-text only; no dedicated "list all SAs for client+program" endpoint |
| Job (leaf) | Yes | `/api/jobs?program=X` or `?client_id=X` | Works but only after client+program known |

**What would need to be built:**
- A "list service areas by client + program" endpoint — today EC-scoped SAs live at `/api/engineering-contracts/:id/service-areas`, which requires knowing the EC ID first. A convenience endpoint `GET /api/service-areas?client_id=X&program=Y` that joins through ECs would power the cascade.
- The `#proj-existing` picker refresh should be triggered by BOTH client change AND program change (currently only fires on client change; `ptypeChanged()` does NOT call `loadExistingProjectsForClient()`).

---

## 5. Permitting Mirror

`permitting.html` has the same `#proj-existing` picker with the same `loadExistingProjectsForClient()` function using the same mismatched `?project_type=` param name (`permitting.html:1206`). Client-side `!p.is_rollup` filter is also the same (`permitting.html:1209`).

**Key difference:** `permitting.html:1150` correctly declares `const clientId = document.getElementById('proj-client').value;` at the TOP of `clientChanged()`. So permitting's contracts dropdown DOES populate correctly. Design.html's `clientChanged()` is missing that declaration — contracts never load.

**Bug present in both portals:** `?project_type=` vs `?type=` mismatch (program-filter never fires in `proj-existing`).
**Bug present only in design.html:** `clientId` undeclared in `clientChanged()` — contracts dropdown always cleared on client selection.

---

## 6. Top 3 Open Questions for Fix-Agent

1. **Are there existing rollup rows in the DB with `is_rollup = NULL` or `false`?** The client-side `!p.is_rollup` filter would fail to exclude them. A data-migration or a server-side `AND is_rollup = false` clause in the `proj-existing` query would be safer than relying on the client-side filter alone.

2. **Should `loadExistingProjectsForClient()` also fire when `#proj-ptype` changes?** Currently `ptypeChanged()` does NOT call it. If the cascade includes program filtering, the existing-project list should refresh when program is changed — or the server-side `type` filter should be fixed so the `proj-existing` list reflects the chosen program.

3. **Fix scope for contracts in design.html:** The simplest fix is adding `const clientId = document.getElementById('proj-client')?.value;` at the top of `clientChanged()` in design.html (mirroring permitting.html). But should this also trigger a review of whether the contracts dropdown is functionally needed at all for the new cascade UX? If the cascade moves to Client → Program → SA → Job, the Contract field may become less prominent.

---

=== DESIGN PICKER REPRO A END ===
