# 03 — Keystone core (`routes/service_areas.js` 1055 ln + `routes/concentrators.js` 53 ln)

> Mapped 2026-06-29 (full read). The **Job Board backend** — Carter's #1 area. Service Area = unit of work; `service_area_jobs` = billable line items inside it. Migration 0064+. This is what the operations cluster renders; it replaces the legacy rollup-of-rollups `projects` tree. **It is substantially built.**

## Model & rules (the spine of the spine)
- **STAFF_ROLES** = admin, design_manager, permitting_manager, design_engineer, permitting_engineer. SA reads are **staff-only** (no contractor/customer/trainee). Writes = `requireManagerOrAdmin`.
- **EC ⟺ RUS enforced**: creating/updating an SA with `engineering_contract_id` forces `program='rus'` (DB CHECK too). PROGRAMS = rus/bau/gfr/other.
- **Per-team pipelines** (`PIPELINES`): permitting `potential→started→submitted→approved→issued`; design `potential→started→submitted→client_approved`; **construction = [] (no pipeline)**. `submitted` can branch to `revision`; resolving revision → approval stage. `nextStatus`/`prevStatus` drive advance/regress.
- **Cost bucket by discipline** (`costCategoryFor`): construction team → `construction` cost (labor); permitting/design/inspection → `engineering` cost (what LFS bills). Materials = construction cost, separate line.
- **Money math is server-side** (recomputeJob + workspace rollup) — confirms the rule; frontend renders server numbers.
- **mw fallback pattern:** each module does `requireAdmin = mw.requireAdmin || passthrough` — ⚠ if server.js didn't pass mw it'd be an OPEN no-op (server.js DOES pass it here; the pattern is the chunk-01 vuln vector).

## Data model touched
`service_areas` (client_id, engineering_contract_id, name, work_order_number, program, status, notes, is_ongoing, billing_cadence, client_visible, client_visible_metrics jsonb, map_file_path/filename, build_finalized_at, closed_at, created/updated_by) · `service_area_routes` (optional subdivision: own map/status/finalize/close) · `service_area_jobs` (job_id→jobs catalog, team, route_id, cost_category, assigned_staff_id/assigned_user_id, billing_type[hourly/footage/fixed], rate, status, estimated_amount, actual_hours, actual_amount, footage, miles, budget_code_id, geometry jsonb, label) · `service_area_materials` (item, quantity=EXPECTED, completed_quantity=installed, unit, unit_cost, source[manual/bom_csv/map], map_feature_ref) · `service_area_material_units` (per-unit status pending/installed/removed, installed_date, map_feature_ref) · `time_entries` (service_area_job_id, staff_id, user_id, hours, is_billable).

## Endpoint groups
- **SAs:** list (rolled-up job totals; filters) · detail (+jobs) · create (EC⟺RUS) · update (allowlist + client_visible_metrics) · delete (**hard DELETE — no undo bucket; relies on FK cascade → VERIFY it doesn't silently nuke jobs+time_entries/hours**, see flags) · finalize (route + area-cascade) · close (archive, soft/informational, NOT a bill trigger).
- **Routes:** CRUD; jobs/materials carry nullable `route_id` (no routes → area-level). 
- **Materials + units:** CRUD; **units are the MAP-SYNC TARGET** — marking a unit `installed` re-rolls the material's `completed_quantity`; `map_feature_ref` links a row to a drawn map feature. This is the map↔production completion link Carter described (office marks features complete → rolls up).
- **`GET /api/service-areas/:id/workspace`** = THE consolidated cluster view (area + routes + jobs/materials grouped by route + per-person hours + **server cost rollups**: engineering_cost, construction_labor, materials_cost, construction_cost, total_cost, progress_pct). `employee_label`="Various (N)" for multi-person jobs.
- **Jobs (line items):** add (auto-fill team/billing_type/rate from `jobs` catalog + `pricing_entries` by program precedence; auto label "<Discipline> — <SA>"; geometry/miles/budget_code) · update (re-tag cost_category on team change; recomputeJob) · delete · **advance/regress** (pipeline, revision branch, no confirm → undo bar) · flat list (`GET /api/service-area-jobs`, team/status filters → the per-team pipeline kanban).
- **Hours:** `POST /api/service-area-jobs/:id/time-entries` — **contractor IDOR guard** (contractor logs ONLY against assigned jobs via assigned_user_id/assigned_staff_id; staff can log any + collaborator hours via explicit staff_id); **auto self-attribution**; **contractors get a money-free response** (actual_amount stripped). recomputeJob after.
- **Billing:** `POST /api/service-areas/:id/bill` (transactional: ready-to-bill jobs [status issued/client_approved/complete, unbilled, actual_amount>0] → ONE invoice + mark billed) · `GET /api/billing/invoices`.
- **Dashboard:** `GET /api/dashboard/overview` (totals, per-team-stage tallies, recent SAs, per-client rollups, ready-to-bill+aging, RUS-vs-nonRUS revenue split, alerts [in_revision, stale>14d], hours billable-vs-overhead). `GET /api/service-area-pipelines` exposes the pipeline map.

## concentrators.js (legacy, separate table)
`concentrators` = the OLD "small area under PSC RUS contract" table feeding the legacy rollup chain (the server.js boot machinery + `ec_service_areas` seed). GET (auth) + POST (admin). **Distinct from `service_areas`** despite the shared "service area / concentrator" name — concentrators is pre-keystone. Light cleanup candidate once the rollup tree is retired.

## Flags / findings (→ open_items)
- **O14 VERIFY (data-loss risk):** `DELETE /api/service-areas/:id` is a hard delete with no undo bucket. Confirm the FK behavior on `service_area_jobs`/`time_entries`/`materials` (migration 0064) — if `ON DELETE CASCADE`, deleting an SA destroys its jobs AND their logged hours. Given "nothing can break" + hours-are-sacred, this needs a guard/undo like the legacy projects delete has.
- **O15: three billing paths coexist** — (a) this SA `:id/bill` (simple, one invoice), (b) legacy `routes/billing.js`, (c) `routes/billing_keystone.js` (progressive ledger). Which is canonical? Risk of divergent logic. Resolve at billing chunk (07).
- **Plan-vs-built:** **System A (per-job billing_method front/continuous/back + billable_amount + bill_rate + RUS code split)** from IMPLEMENTATION_PLAN is **NOT built** — current model is the simpler `billing_type` (hourly/footage/fixed)+rate. The per-job codes/timing overlay is greenfield.
- **D013 tie-in:** job auto-fill pulls from the hard-coded `jobs` catalog (chunk 01) + `pricing_entries`. Making the catalog data-driven (D013) flows through here.
- **Map hooks already baked:** `geometry`, `miles`, `map_feature_ref` on jobs/materials/units → map integration (chunk 12) has its DB landing spots ready.

## Reapproach-if
- Migration 0064 (chunk 18): confirm FK ON DELETE for O14; confirm exact columns vs what's used here.
- Operations cluster UI (chunk 05): which endpoints `service-areas.html`/`area.html` actually call (esp. workspace).
- Billing (07): reconcile the three billing paths (O15).
- Map (12): how `map_feature_ref`/units sync actually fires (the office-marks-complete flow).
