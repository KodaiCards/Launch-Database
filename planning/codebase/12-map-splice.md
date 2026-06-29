# 12 — Map + Splice (the 2nd pillar + the standalone splice tool) — ✅ COMPLETE

> Mapped 2026-06-29. Two very different things bundled by topic: (A) the **MAP** = Carter's #2 product pillar + the bus-factor core (he's the sole map-holder); the engine is BUILT at POC level (confirms I6). (B) **SPLICE** = a large (17k-line), deep, ISOLATED fiber-splicing tool with its own roadmap (mapped at SCOPE level per CLAUDE.md, not line-by-line).

## A) THE MAP — engine is BUILT (POC), confirms + reshapes I6
**The chain works end-to-end today:** FRM tool draws → `map_store` → `computeEstimate` prices via `cost_catalog` → `service_areas.map_plan_id` links it → projections/budgets consume it.

### Pieces
- **FRM tool** `public/map/fiber_route_manager_v33.html` (2374 ln, 158KB) — a standalone fiber-route map (draws **structures/points** [poles, handholes…] + **spans/segments** with footage). Versioned ("v33" → much iteration). Mapped at wiring level (it's a big self-contained canvas tool).
- **`public/map/frm_storage_adapter.js` (27 ln)** — injects `window.storage` so the map persists **server-side** via `/api/map/store/:key` (DB) instead of localStorage. Include before the map script when embedding in the authed app. `get→{value}`, `set(k,string)`.
- **`map_store` table** (map_integration.js) — generic **key→value** store. Keys: `frm_pts_<plan>` (structures JSON), `frm_segs_<plan>` (spans JSON). GET/PUT `/api/map/store/:key`, manager/admin.
- **`construction_contracts` (CC) + `cost_catalog`** — per-CC unit price list (`item_key→unit_price`), uploaded from **Excel** ("Handhole = $200"); `item_key` matches the map's `ptype`. `POST /api/construction-contracts/:id/catalog` (xlsx/csv or JSON, loose column matching). So **the per-CC catalog Carter wanted is BUILT.**
- **`_map_estimate.js` `computeEstimate(pool, plan, ccId)`** — THE map→$ engine (one source of truth; used by map_integration AND projections chunk 07c): reads frm_pts/frm_segs, counts structures by `ptype`, prices via catalog, buckets **span footage by DESIGNATION** (engineering/construction/permitting — **dual-designation allowed**, untagged='unassigned'), `BUILT` statuses (asbuilt/active/existing)=completed. Returns structures + footage_by_designation + construction_expected/completed/remaining. **This is why the map is "source of truth for units/miles/footage/permitting"** (memory `project_map_requirements_spec`) — the footage_by_designation feeds permitting/engineering/construction numbers.
- **SA linkage:** `service_areas.map_plan_id` + `construction_contract_id` + `boundary` (jsonb hand-drawn) + `center_lat/lng`. `PUT /api/service-areas/:id/boundary` (draw on map), `GET /api/service-areas/:id/map-rollup` (derive SA construction $ from its linked plan). Feeds projections.js (chunk 07c mileageBlock + construction block) + budgets.

### ⭐ I6 confirmed + reshaped (the map roadmap is smaller than it looks)
The projection/allocation/estimate ENGINE exists: persistence (map_store), pricing (cost_catalog + computeEstimate), designation-bucketed footage, SA link, projections/budgets consumption. **What's actually deferred/missing:** (1) it's a labeled **"POC bridge"** — not productionized; (2) **in-app map RENDERING** (chunk 07c `/api/map/service-areas` said "rendering deferred until KMZ sync"); (3) **KMZ import/sync** (roadmap); (4) **materials sync** (map features → `service_area_materials`, chunk 03 deferred). So the map feature = **"productionize + render + KMZ-sync + materials-sync onto an existing engine,"** NOT "build projections from scratch." Tell Carter — this materially shrinks the map roadmap.

### ⚠ O27 (map productionization consideration): map data is generic-KV JSON, not relational
The map persists whole-plan JSON blobs in `map_store` (`frm_pts_<plan>`/`frm_segs_<plan>`), parsed only by `computeEstimate`. Works for estimate, but **per-feature queries (materials sync, per-structure status, incremental updates, concurrent edit) are hard against a JSON blob.** Productionizing the map (esp. materials sync + multi-user editing) likely wants **relational structures/spans tables**. Not a bug — the POC shape — but the key decision when the map graduates from POC. → open_items O27 (medium, map-productionization).

## B) SPLICE — a large, isolated, standalone tool (scope-level map)
`routes/splice.js` (**7314 ln**) + `public/splice.html` (**9763 ln**) + `_splice_validation.js` = the **Fiber Splice Matrix** tool. Per CLAUDE.md it's a SEPARATE tool with its own roadmap (`SPLICE_BUILD_PLAN.md`) — mapped at scope level tonight (deep-read deferred; flag if Carter wants a dedicated pass).
- **Deep domain model (~17 `splice_*` tables):** `splice_projects` (owner = `designer_id`), `splice_cables`→`splice_buffer_tubes`→`splice_fibers`, `splice_locations`→`splice_closures`→`splice_trays`→`splices`, `splice_ribbon_groups`, `splice_strand_states`, `splice_splitters`(+`_outputs`), `splice_cable_states`, `splice_loss_records`, `splice_layer_styles`, `splice_custom_layers`, `splice_custom_features`. A real fiber-splice CAD/matrix data model.
- **Own auth/ownership** (`requireSpliceAccess` via `designer_id`), **real-time SSE** keyed by `splice_project_id` (collaborative editing), layer styling/custom layers (it's a drawing tool).
- **ISOLATED from the keystone** — uses its own `splice_projects`, NOT `service_areas`/`projects`. Like training, it's a clean self-contained subsystem (the entanglement is all in projects/hours/billing/portals).
- **Product-plan future:** "splice-as-map-layer" (`project_map_requirements_spec`) — i.e. eventually surface splice on the map. Today they're separate tools.

## Findings
- **⭐ I6 CONFIRMED + reshaped:** map engine built (POC); roadmap = productionize/render/KMZ/materials-sync onto it, not build-from-scratch. Highest-value map finding — shrinks the #2 pillar's scope.
- **O27 (new, medium): map storage is generic-KV JSON** (`map_store` blobs) — fine for estimate, limiting for materials-sync/per-feature/multi-user. The relational-vs-KV decision is the map-productionization fork.
- **Splice = large isolated tool** (17k ln, ~17 tables, own auth/SSE/roadmap). Not keystone-entangled. Candidate for its own deep-map pass; "splice-as-map-layer" is the integration future.
- **Two clean isolated subsystems** (training, splice) vs the entangled core (projects/hours/billing/portals) — useful mental model: the isolated ones are safe to evolve independently; the core needs the cutover.
- **Bus-factor (memory `project_business_reality`): the map is the sole-map-holder risk.** The engine being built + server-persisted (map_store, not Carter's local files) is a partial de-risk — but only if Carter actually uses the server-backed FRM (not a local copy). Verify which he uses live. → ties O-series bus-factor concern.

## Reapproach-if
- Chunk 07c reapproach: projections.js construction block + mileageBlock consume computeEstimate — now fully traced (map→estimate→projection chain complete).
- Chunk 03 reapproach: "map is source of truth for materials, sync deferred" — confirmed; the deferred piece is map-features→`service_area_materials` (needs O27 relational decision).
- Chunk 18 (migrations): confirm map_store / cost_catalog / construction_contracts / splice_* schema + service_areas.map_plan_id/boundary columns.
- If Carter prioritizes the map: this chunk + I6 + O27 are the inputs; a dedicated deep-read of fiber_route_manager_v33.html (the drawing logic, ptypes, designations) would be the next step.
- Splice: dedicated deep pass deferred — flag to Carter (7314+9763 ln is its own project; SPLICE_BUILD_PLAN.md governs it).