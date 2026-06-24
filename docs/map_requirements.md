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
- Exact map tech (KMZ / GIS / OZMap / Vetro — `research/`); Carter to deliver.
- Whether the map is the editing surface for quantities or read-only source.
