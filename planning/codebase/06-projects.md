# 06 — Projects layer (legacy tree + catalog/entities) — PARTIAL

> Mapped 2026-06-29. The legacy `projects` rollup tree + the catalog/contract/client entities both the legacy AND keystone lean on. **Done this pass: jobs.js, clients.js, project_types.js.** Pending → 06b: contracts.js, engineering_contracts.js (687), projects.js (1544, the big legacy CRUD), project_detail.js (326), projects_tree.js (82).

## `jobs.js` (519) — the work-category catalog (IMPORTANT for D013)
Jobs = the work-category entity (replaced the legacy `project_type` enum for billing). Each: `default_billing_type` (hourly/footage), `default_rate`, `is_permitting` (triggers the miles→hours calc), `team`, `billing_code` (RUS code), **`program_scope`** (`rus|non_rus|shared` — the new enum that replaced the `for_psc_client`/`for_generic_client` bools, mirrored for back-compat).
- **GET /api/jobs** = two-layer resolution: **(1) manual `job_assignments` override** (migration 0032 — pins a job to client/EC/team scope; if any pin matches the request scope, return ONLY pinned jobs, bypassing the heuristic) → **(2) heuristic** (explicit `program` → EC's program → client's EC-program mix → all). This is the "manual assignment overrides heuristic" feature (memory `feature_manual_job_assignment`).
- **Owner rule enforced: RUS jobs REQUIRE a `billing_code`** (create + update both reject RUS without one). Non-RUS/shared don't.
- `manually_overridden_at`: PUT stamps it when a config field changes → the boot reseed (chunk 01) then PRESERVES admin's edits; `/reset-override` clears it to opt back into canonical defaults. `propagate-rate` applies a job's rate to all projects using it (dry-run supported). DELETE = soft.
- **⭐ D013 REFINEMENT (corrects chunk-01 framing):** the job catalog **is already configurable data** — `jobs` is a CRUD table with `program_scope` + admin overrides. The chunk-01 "hard-coded catalog" is really a **seed of *defaults*** into this editable table (admin can add/edit/override; reseed respects overrides). So the catalog is largely D013-compliant. **The genuinely hard-coded bits are the RATE FALLBACKS** (dashboard.js inspection 90 / RE 100 / permitting 90, repeated in revenue calcs) + the seed values — those are the D013 cleanup targets, not the catalog itself.

## `clients.js` (198) — client CRUD + cascade picker
`GET /api/clients` (any auth) · POST/PUT/DELETE (admin) — fields: name, notes, `show_contract`, `show_work_order`. **`is_rus` fully retired** (Path B / migration 0003 — program classification now lives on `engineering_contracts.program`). `GET /api/clients/:id/service-areas?program=` = cascade picker (joins `ec_service_areas` ⋈ engineering_contracts by program; used by timeclock/design/permitting portals). DELETE cascades (contracts/projects/time/invoices) with `?preview=true` counts. SSE broadcasts on mutate. Clean. Backs `clients.html` (chunk 05).

## `project_types.js` (45) — DEAD compat shim
The `project_types` table was **dropped** (Phase 3b); replaced by the `engineering_contracts.program` enum. GET returns the 4 program values (rus/bau/gfr/other) as fake `{id,name,active}` rows so old dropdowns still populate; **POST/PUT/DELETE → 410 Gone.** Pure legacy-compat — cleanup candidate once no frontend calls `/api/project-types`. Good artifact of the "program enum replaced project_type table" history.

## Findings
- **D013 refined:** job catalog = configurable data (good); rate *fallbacks* (hard-coded in dashboard/revenue) + the seed are the real config-as-code targets.
- `job_assignments` = the manual-pin override (migration 0032) — confirms `feature_manual_job_assignment`.
- `project_types.js` is a dead 410-shim — cleanup.
- `ec_service_areas` table (used by the cascade picker) is the LEGACY service-area table (distinct from keystone `service_areas` AND from `concentrators` — there are now 3 "service area"-ish tables: `service_areas` [keystone], `concentrators` [old], `ec_service_areas` [EC cascade]). ⚠ Naming/▼model overlap → flag for the EC chunk (06b) + cutover.

## Reapproach-if
- 06b: contracts.js, engineering_contracts.js (the EC = RUS entity + `ec_service_areas`), projects.js (the 1544-ln legacy rollup CRUD — the thing the keystone replaces; map for history + cutover), project_detail.js, projects_tree.js.
- Cutover planning: reconcile the THREE service-area-ish tables (service_areas / concentrators / ec_service_areas).
- D013 work: centralize the rate fallbacks (one configurable rate source).
