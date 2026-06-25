# Map requirements — living spec (what the map must do for the system)

> **CEO-maintained, on Carter's instruction (2026-06-24):** Carter will deliver a map; we'll likely have to build/change it to fit our system. This doc is the running spec of everything the map must provide + a **diagnostic checklist** to diff against on delivery, so we can identify exactly what it does NOT do yet. Keep this current as the design evolves. Cross-refs: `docs/projections_design.md` (the math the map feeds), `docs/billing_keystone_design.md`, memory `feature_service_area_routes_materials_map`, `research/` (OZMap/Vetro studies).

## Role: the map is the source of truth for quantities, geometry, and designations
Projections, budgets, billing "expected", and progress all **derive from map data**. Until the map lands, these inputs are entered **manually** (materials expected/completed, job footage, SA miles, unit catalog) and the math is identical — the map just replaces manual entry as the source.

## What the map must PROVIDE (per service area / route)
1. **Route geometry → footage + mileage** per route (and rolled to SA). Drives engineering footage expected (ft × rate) and the **hourly mileage allocation**.
2. **Plotted construction units** (handholes, pedestals, splice closures, fiber ft, etc.) with **counts per route** → construction expected via the **per-contract cost catalog** (unit → $).
3. **Permitting line** — a special map line with a **permitting designation** → pulls **footage only** (permitting hours determined later).
4. **Per-route attribution** — routes subdivide an SA; quantities/footage attributable to each route.
5. **Completed vs expected quantities** — built-so-far (→ progress + actual cost) vs total expected (→ projection).
6. **Designation / line types** — distinguish construction route vs engineering footage vs permitting line.
7. **Layering / modularity** — co-located work for a different client / EC / program / time stays a **separate layer**; never merged unless explicitly chosen.
8. **Unit identifiers that link to our per-contract catalog** (map "Handhole" → catalog item "Handhole" = $200 on that contract).
9. **Client / SA / route selection** — for the Service Areas → Map tab (pick a client/area → its jobs in that ground).

## What the system DERIVES from the map
- **Contract miles by discipline** = Σ route mileage by designation (feeds the contract "budget area").
- **Construction expected** = Σ (map units × per-contract catalog price).
- **Engineering footage expected** = Σ (map footage × rate).
- **Permitting footage** from the permitting line.
- **Hourly (contract) allocation:** `per_mile_rate(discipline) = remaining $ ÷ remaining miles`; `SA expected = SA.miles × per_mile_rate`. (Worked: 10 mi / 4 SAs / $100k inspecting → $10k/mi → 2.5-mi SA = $25k.)
- **Progress** = completed ÷ expected (units / footage). **Remaining** = total − billed/completed.
- Contract totals (budget + miles) are **derived from the map**, not hand-entered (manual interim only).

## Storage / integration the map must support
- `service_areas.map_geometry` + `service_area_routes.map_geometry` (jsonb) already exist; `map_file_path`/`map_filename` too.
- **Export/sync:** map → DB — geometry + per-route quantities + designations → `service_areas` / `service_area_routes` / `service_area_materials` / `service_area_jobs`. (The map↔materials/quantity sync is currently DEFERRED.)

## Diagnostic checklist — fill in WHEN THE MAP IS DELIVERED
For each: does the delivered map do it? If not, it's on the build/change list.
- [ ] Outputs per-route geometry → footage + mileage
- [ ] Plots + counts construction units per route
- [ ] Supports a permitting-line designation → footage
- [ ] Distinguishes line/designation types (construction / engineering / permitting)
- [ ] Tags geometry by client / SA / route / program (separate layers, no merge)
- [ ] Tracks completed vs expected quantities (progress)
- [ ] Units link to our per-contract cost catalog
- [ ] Exports/syncs to our DB schema (map_geometry + quantities + designations)
- [ ] Client / SA / route selection for the overall-map tab
- [ ] (expand as the map's real shape arrives)

## Open / TBD
- Permitting **hours** derivation (footage now; hours later).
- Whether the map is the editing surface for quantities or read-only source.

---

# Map-first Service Areas UX — LOCKED (Carter 2026-06-24, walked through 2 interactive models)

The Service Areas tab becomes **map-first**. All maps are **real geo (Leaflet)** and **editable + movable** (pan/zoom + draw/edit).

**Overview (default view of the Service Areas tab):**
- Big map, **Macon-centered**, **all builds plotted at true coordinates** (`center_lat/lng`), pins **status-colored**.
- Each build shows its **hand-drawn SA boundary** polygon. **Clustering** when zoomed out (count bubbles that expand on zoom).
- **Filter client → SA** (side list synced to the map). Click a build (list or pin) → map **flies/zooms to it** → **Open** → SA detail.

**SA detail = map-as-header over the construction/engineering data:**
- Header map: real geo, **view-by-default**, with an **Edit** button (flips on the fiber-map draw/place/split tools), an **Expand** (big enough to work in), and a **resize handle** (drag map height).
- **Bidirectional linking:** hover a unit row ↔ its pin glows; click a row → map flies to that unit; click a pin/line → **quick data card** → **Open properties** opens the element modal. **Jump-to-unit box** (type `HH-7` → fly).
- **Construction / Engineering toggle** (the split); construction rows = units priced via CC catalog, engineering = footage/designation + mileage-allocated hourly.
- **SA boundary is hand-drawable from day one** (auto-hull suggestion as a starting point, fully editable), saved per SA.

**Backend ready (migration 0072 + endpoints):** `service_areas.boundary`/`center_lat`/`center_lng`; `PUT /api/service-areas/:id/boundary`; `GET /api/map/service-areas` returns boundary+center; plus map_store persistence, `/api/service-areas/:id/map-rollup`, projection construction/combined blocks, CC catalog + estimate.

**Frontend = C2 R15.** Key architecture note: for the detail-view row↔pin↔card linking, prefer **inlining** the fiber map into the SA detail page (same JS context) over the R14 iframe, or use postMessage — the rows and map must talk.

# Delivered map — `map/fiber_route_manager_v33.html` (v33, 2026-06-24) — diagnosis

Carter delivered the foundation: a **Leaflet OSP design tool** ("Fiber Route Manager · Launch Fiber Services · OSP"), 2362-line self-contained HTML (Leaflet + JSZip). Reviewed in full + run locally (renders, tiles load, centered on Macon). **Not the final version — this is the base we build on.**

## What it is / strengths (strong foundation)
- **Org:** Projects → Plans (multiple plan overlays per project; show/hide/ghost overlays).
- **Three element layers:** **Spans** (cable polylines), **Structures** (points), **Conduit** (polylines). Drawing with **snapping**, **follow-path** (trace existing line), and **split-at-structures**.
- **Element data (already stored per element):**
  - Span: `name, cableId, cableType (aerial/underground/directBuried/innerduct), fiberCount, status, contractor, installDate, jobRef, notes, path(geometry), lengthFt`.
  - Structure: `name, ptype (handhole/vault/pedestal/spliceCase/pullBox/manhole/riser/terminal/cabinet/flowerpot/other), structureId, manufacturer, size, status, contractor, jobRef, lat/lng`.
  - Conduit: `conduitType, size, ductCount, status, lengthFt, jobRef, …`.
- **Status lifecycle:** proposed → permitted → underConstruction → asBuilt → active → existing.
- **BOM:** counts structures by type+status, cable by status; totals feet / miles / spans / structures; CSV export. Status filter chips.
- **Exports:** CSV, GeoJSON, KML, KMZ, Shapefile (WGS84).
- **Storage:** a `store` abstraction that **prefers an injected `window.storage.get/set`** and falls back to localStorage — keyed per plan (`frm_segs_<plan>`, `frm_pts_<plan>`, `frm_cond_<plan>`, projects/plans/active).

## Checklist vs our spec
- ✅ Per-route geometry → footage/mileage (`lengthFt`, total miles).
- ✅ Plots + counts construction units per type (`ptype`) with status.
- 🟡 Permitting: has a `permitted` **status** and could carry a permitting line, but **no dedicated permitting-designation that rolls footage to permitting** as its own bucket.
- 🟡 Designation/line types: has `cableType` + `status` + `fiberCount`, but **no engineering/construction/permitting discipline** on an element.
- 🟡 Layers/modularity: Plans give layering, but **no client/SA/EC/CC tagging** — org is Project/Plan, not our entities.
- ✅ Completed vs expected: `status` gives it (asBuilt/active = built; proposed/permitted = planned) — needs our rollup.
- ❌ Units link to a **cost catalog**: no `$`/price/rate anywhere — counts only.
- 🟡 Export/sync to our DB: file exports + the `window.storage` hook exist, but **no DB-backed adapter** yet.
- ✅ Client/SA/route selection: Project/Plan switching exists (not yet our entities).
- ✅ A real `jobRef` field on every element — the hook to link to our jobs (currently free text).

## Gaps → what's needed to make it work for us
1. **Cost/catalog layer** — elements carry no $. Add a **per-CC unit-cost catalog** keyed by `ptype`/`cableType` (Handhole→$200); the map provides counts/footage, our system prices → construction/engineering **expected**.
2. **Business linkage** — map a **Plan → our `service_area`** (and Project → client or EC/CC). Turn `jobRef` from free text into a **picker resolving to `service_area_job` IDs** (fed by our API).
3. **Discipline / permitting designation** — add a designation on spans (engineering footage vs construction vs **permitting line**) so footage rolls to the right bucket; or derive it from the linked job's discipline.
4. **DB integration** — inject `window.storage` with a **DB-backed, authenticated adapter** (per-SA), and/or a **parse-on-sync** that turns elements into our normalized tables (footage by discipline, unit counts by type+status, miles) → feeds projections / budgets / billing **expected + completed**.
5. **Embed + auth** — mount inside the app as the **Service Areas → Map tab** (authed), not a standalone tool.
6. **Completed/expected rollup** — map element `status` → `service_area_materials.completed_quantity` + job actuals (asBuilt=completed; all=expected).

## Recommended integration sequence (when we build it, with the map)
1. **Data bridge:** DB-backed `window.storage` adapter (authed API), plans persisted per service area.
2. **Linkage:** Plan↔SA mapping + `jobRef`→service_area_job picker + a discipline/permitting designation field.
3. **Catalog + rollups:** per-CC unit-cost catalog (`ptype`→$) + the map→expected/completed rollup feeding the contract-allocation engine, projections, budgets, billing.
4. **Embed:** mount as the Service Areas → Map tab; retire the placeholder.

## POC status — 2026-06-24 (the data chain is PROVEN)
Migration `0069_map_integration_poc.sql` + `routes/map_integration.js` (mounted) deliver the core chain Carter asked to see, **verified end-to-end against the dev DB** (`tests/map_integration.test.js`):
- **DB-backed `window.storage`** — `GET/PUT /api/map/store/:key`; the map's injectable storage now persists server-side. Adapter ready: `map/frm_storage_adapter.js` (include before the map script on embed).
- **Construction contracts + cost catalog** — `POST /api/construction-contracts`, `POST /api/construction-contracts/:id/catalog` (uploads the **Excel** unit list — or JSON — item→$, keyed to map `ptype`).
- **The estimate** — `GET /api/map/estimate?plan=&cc=` counts a stored plan's structures by ptype, prices via the catalog: **13 handholes × $200 + 2 pedestals × $150 = $2,900 expected, $1,000 completed (5 built), 1,500 ft summed.** That's "map reports 13 handholes → reference the contract → price it" working.
- Schema also added `service_areas.construction_contract_id` + `service_areas.miles` (SA↔CC link + mileage for the later allocation).

**Closing the loop — progress (2026-06-24):**
- ✅ **1/4** SA↔map-plan link (`service_areas.map_plan_id`, migration 0070) + `GET /api/service-areas/:id/map-rollup`.
- ✅ **3/4** map construction feeds the SA projection (`construction` + `combined` blocks; shared `routes/_map_estimate.js`).
- ✅ **2/4** dual designation on spans (engineering/construction/permitting checkboxes in the span modal; footage bucketed `footage_by_designation`, dual-counted). Verified live in the preview.
- ⏳ **4/4** mileage allocation for hourly (per-mile = remaining$ ÷ miles × SA miles).
- Also next: `jobRef`→service_area_job picker; footage→engineering footage pricing (×rate).

**Canonical map copy = `public/map/fiber_route_manager_v33.html`** (served + actively developed). `map/fiber_route_manager_v33.html` is the pristine delivered-v33 archive; `map/_serve.js` (the `map-preview` launch config) now serves `public/` so the preview shows the live copy.

**Still POC-level / next:** `jobRef`→service_area_job picker; embed live-persistence proof in the authed app; the mileage allocation. (Backend verified via DB tests; map UI verified live in preview.)

**Bottom line:** the foundation is well-built and well-architected for integration — `jobRef`, `lengthFt`, `status`, `ptype`, and the injectable `window.storage` are exactly the hooks we need. The work is the **linkage + costing + DB sync** layer (above), plus the contract-allocation engine it feeds (still deferred until this lands). `map/_serve.js` + `.claude/launch.json` `map-preview` run it locally.
