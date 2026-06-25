# Projects tab — map-first IA (LOCKED, Carter 2026-06-25)

Renames the **Service Areas** tab to **Projects** and makes the **map the home base**. Walked through an interactive model; decisions below are locked.

## The hierarchy (left tree, nested + collapsible)
```
Client
 └─ [Engineering Contract]        (optional — RUS/BAU/etc.)
     └─ [Construction Contract]   (optional — within the EC)
         └─ Service Area          (ALWAYS present; = the town for simple work, manually creatable)
             └─ [Route]           (optional subdivision)
                 └─ PROJECT       (the leaf = an individual permit or design job)
```
- **A "project" is the lowest level — an individual permitting or design job.** In the data model that **= a `service_area_job`** with discipline `permitting`/`design` (the user-facing name for those jobs). No new entity.
- **EC, CC, Route are optional layers; SA is always there.** Contract-less work still nests under an SA (the town), entered manually.
- **Rolled up by default**, click to unroll. Every node has a **visibility toggle that cascades** (toggle PSC off → every EC/CC/SA/route/project under it leaves the map). Toggle individually too. **Click a node → map zooms to it.**

## The map = home base + creation surface (synced everywhere)
- The Projects tab opens **map-first** with the tree on the left. Same synced map as the SA detail + overview.
- **+ New project (primary path):** pick discipline (permitting/design) + fill manual fields (client/EC/CC/SA/route), then **draw the line on the map** → **auto-fills footage + miles** from the geometry (and units from any plotted structures → construction $ via the CC catalog). Drawing is optional but convenient.
- **Manual path:** create the project in the pipeline with manual fields; it won't appear on the map until a line is drawn. Its detail map viewport shows **"No location."** Manual fields let you link it to an SA/route.
- **Permitting line = a span tagged `permitting`;** drawing it creates the permit project + auto-fills footage/miles. Design is the same pattern.

## Opening a node → the detail view we already built
Clicking a project (or SA) opens the existing **map-header + construction/engineering split** detail (jobs/units, hours, billing), with the **"No location"** state when there's no geometry.

## Documents
**Permit documents live in the permit project** (the job) — a documents store keyed on the project/job, ported from the legacy `permit_documents` (which was on `project_id`).

## Inspection / construction — kill legacy once covered
Retire legacy `routes/inspection.js` + `routes/permits.js` once the keystone surfaces, **by SA / WO#**: **revenue, hours, employees, job code.** The permitting *workflow* is already keystone (pipeline board); the gaps are documents + the SA/WO# reporting coverage.

## Build phases (multi-round; UI ships with each per the standing rule)
- **A — Rename + nested tree:** Service Areas → Projects; the Client→EC→CC→SA→Route→project rollup with cascade visibility toggles + click-to-zoom on the map. (C2 frontend; backend tree assembled from existing endpoints or a `/api/projects/tree` rollup.)
- **B — New-project flow:** manual create (job under SA/route) + **map-draw create with footage/miles autofill** (backend: create-job-from-geometry + store the line; frontend: the modal + draw mode).
- **C — Permit documents:** documents table + upload/list endpoints keyed on the project/job; docs section in the detail.
- **D — Inspection coverage + legacy kill:** ensure revenue/hours/employees/job-code by SA/WO# (extend projections/hours), then retire `inspection.js` + `permits.js`.

## Confirmed (Carter 2026-06-25)
1. ✅ Project = lowest level = the individual permit/design job. 2. ✅ Contract-less work still nests in an SA (the town, manual). 3. ✅ Draw autofills **footage + miles**. 4. ✅ Opening a node uses the detail view we built.
