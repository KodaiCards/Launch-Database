# SPEC — County-universal pass (PLAN 2.10, law §7)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint batch, *5 session). Ruling: **county REQUIRED on new work going forward**; existing rows get a one-time backfill with an "Unassigned" bucket.

## Scope
- `counties` reference table (GA seeded, extensible — data not code) + `county_id` on service_areas, projects/jobs (inherit from SA, overridable), permits (REUSE the existing legacy county column — reconcile into the same reference, never parallel it).
- **Required on create** for new SAs/projects/permits (dropdown); existing rows backfilled once; leftovers land in a visible "Unassigned" bucket that burns down manually.
- **Grouping**: every list/rollup that groups, groups county-FIRST (law §7) — projects, job board, billing views, dashboards. The mini-jobs board (2.15) and the mobile job list ship county-first from day one.
- Map autofill later (banked: Census TIGER/Line + turf.js point-in-polygon on the existing Leaflet stack) just removes the typing; county is also the offline map-pack unit (desktop).

## Done-when
- Creating an SA without a county is impossible; every grouped view shows county as the first level; Unassigned bucket visible and shrinkable; permits' legacy county data flows into the same reference (no duplicate county concepts anywhere).
