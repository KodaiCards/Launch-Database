> ⚖ **REFERENCE ONLY (2026-07-02).** Authoritative sequence = `law/PLAN.md`; ratified `specs/` supersede this doc where they differ. Do not boot-read.

# Launch Fiber — Implementation Plan (concrete, buildable)

> **Why this doc exists (META-RULE — honor it forever):** plans get passed over on handoff/compaction when they state *intent* ("model billing per job") but not the *system* (tables, endpoints, UI, steps). **Every system below is specified concretely enough to build without re-deriving it.** When you add to this doc, keep that bar: actual schema, actual routes, actual UI, ordered steps, done-when. No vague verbs.
>
> Pairs with: `docs/PRODUCT_PLAN.md` (the why + priorities) and `ROADMAP.md` (phase mechanics). This doc = the **how**.
> Last updated **2026-06-26**.

## Conventions (apply to every system)
- **Migrations:** `migrations/00NN_*.sql`, ordered, **idempotent** (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`). ⚠ Migration numbers in this doc are STALE (0079–0084 are taken) — ALWAYS take the next free number at build time. **Step 0 of every migration: confirm exact existing columns against `schema.sql` / the live DB first** — don't trust this doc's column lists blindly; they're the design, verify before writing DDL. Apply with `node -r dotenv/config scripts/run_migrations.js --target <file>`; ⚠ CORRECTED: migrations AUTO-RUN on deploy (`start()`→`runMigrations()`); `npm start` also migrates via `prestart`.
- **Routes:** one module per area, `module.exports = function(app, pool, mw){…}`, mounted in `server.js` (CEO wires the mount; workers can't touch server.js). **`requireAuth` is a FACTORY** → `requireAuth()` / `requireAuth(['admin'])`; **`requireAdmin` is middleware** (use directly). New: `requireCapability('x')` (System F).
- **Money math is server-side only.** JS never computes `$`. Client renders server numbers.
- **UI:** no confirmation pop-ups (optimistic + undo bar `public/js/undo_bar.js`); auto-populate derivable fields; `esc(JSON.stringify(id))` in any onclick; operations pages share `public/js/app_nav.js` rail.
- **Tests:** `tests/*.test.js` (plural), `node -r dotenv/config --test tests/<f>`; add a unit test per pure calc (billing, projection, rollup).

## Existing building blocks (reuse — don't rebuild)
- Tables: `service_areas` (cols incl. `construction_contract_id`, `miles`, `map_plan_id`, `boundary`, `center_lat/lng`, `map_geometry`, `map_file_path`), `service_area_jobs` (discipline/team, employee, status, dates, `label`, `cost_category`), `service_area_routes`, `service_area_materials` (expected + `completed_quantity`), `service_area_material_units`, `time_entries` (person, job, hours, date, `is_billable`, `unbilled_category`), `job_assignments`, `construction_contracts`, `cost_catalog` (item/ptype → $), `contract_allocations`, `map_store` (k/v per plan), `engineering_contracts` (`program`), `clients`, `users`, `user_portal_access`, `access_requests`, `pricing_entries`, `permit_documents`.
- Routes: `service_areas.js` (keystone core — CEO-owned), `projections.js`, `billing_keystone.js`, `money_view.js`, `map_integration.js` (`GET/PUT /api/map/store/:key`, `GET /api/map/estimate`), `_map_estimate.js`, `hours_import.js` + `_hours_match.js`, `portal_access.js`.
- Map tool: `public/map/fiber_route_manager_v33.html` (draws spans/structures/conduit, BOM tally + CSV export, status lifecycle, injectable `window.storage`, cost-catalog POC). Adapter: `map/frm_storage_adapter.js`.

---

# SYSTEM A — Billing per job (+ codes, rates, submission)
*Carter's flagged gap. This is the concrete "add billables per job".*

### A0. Job-type catalog + rate breakdown (the definitions — admin-only) — CONFIRMED 2026-06-26
**Two layers, kept separate:** **job *type*** (catalog definition + rates) vs **job *instance*** (`service_area_jobs`, a type placed on a service area). Manage rates on the *type*; create *instances* from types on the board.
- **`job_types`** (extend the existing `jobs` "universal rate source" table — confirm its columns first): `id`, `name`, `team`/`discipline`, `program_scope text` (`rus|non-rus|both`), `billing_method`, `billing_timing`, `bill_unit`, `active`. RUS-scoped types may suggest default codes, but the actual code split is per-instance (A1, varies per project).
- **`rate_catalog`** = the rate rows shown in a type's **collapsible breakdown** (one row per *circumstance*): keyed by `(job_type_id × client_id|null × engineering_contract_id|null × program)` → `rate`, `unit`, `effective_date`, `active`. A type has **many** rate rows (PSC-RUS, client-X, non-RUS…).
- **Auto-pick by context:** creating an instance on a service area resolves the rate from `rate_catalog` by the SA's client + program (precedence: EC-specific → client-specific → program default → discipline default). **Manual override stored on the instance** (`service_area_jobs.bill_rate`).
- **Access:** catalog (types + rate rows) = **admin only** (`requireAdmin` / capability `manage_catalog`); managers/engineers create instances + override a rate.
- **UI:** Operations → Settings → **Jobs**: each job type is a **bar; expand → its rate breakdown** (rows per client/program circumstance, add/edit). Instance creation (SA board) shows the auto-picked rate with an override field.

### A1. Data model (migration 0079_job_billing.sql)
- **Extend `service_area_jobs`:**
  - `billing_method text` — `'fixed' | 'hourly' | 'milestone'`
  - `billing_timing text` — `'front' | 'continuous' | 'back'`
  - `billable_amount numeric(12,2)` — fixed/milestone total fee (null for hourly)
  - `bill_rate numeric(10,2)` — hourly/unit rate (auto-filled from rate_catalog; override stored here)
  - `bill_unit text` — `'hour' | 'foot' | 'each' | 'lump'`
  - `bill_status text default 'pending'` — `'pending' | 'ready' | 'submitted'`
- **`rate_catalog`** — defined in **A0** (rate rows per circumstance: `job_type_id × client × EC × program → rate`). Auto-picked by SA context on instance create; override → `service_area_jobs.bill_rate`.
- **`job_billing_codes`** (the multi-code split — one job → many RUS codes, total unchanged): `id uuid pk`, `service_area_job_id uuid fk`, `code text`, `label text`, `allocation_pct numeric(5,2) null`, `allocation_amount numeric(12,2) null`. **Set PER INSTANCE — the split varies per project (confirmed 2026-06-26)**; the type may suggest codes but the allocation is entered on the job. **Validation:** Σ allocations = job billable (pct sums to 100, or amounts sum to billable_amount). Coding is a *reporting overlay* — never changes the job's economics.
- **`billing_submissions`**: `id uuid pk`, `client_id uuid`, `period text`, `status text default 'draft'` (`draft|submitted`), `format_key text` (per-client template), `file_path text null`, `created_by uuid`, `submitted_at timestamptz null`, `created_at`.
- **`billing_lines`**: `id uuid pk`, `submission_id uuid fk`, `service_area_job_id uuid fk`, `code text`, `description text`, `qty numeric`, `rate numeric(10,2)`, `amount numeric(12,2)`, `hours numeric null`. One job explodes into one line **per code**.

### A2. API (routes/job_billing.js — new, mounted in server.js)
- `GET /api/service-area-jobs/:jobId/billing` → config + codes + billed-to-date. `requireAuth()`.
- `PUT /api/service-area-jobs/:jobId/billing` → set method/timing/rate/billable; server auto-fills `bill_rate` from rate_catalog if blank. `requireManagerOrAdmin`.
- `GET/POST/DELETE /api/service-area-jobs/:jobId/billing/codes` → manage code allocations; **server validates the sum**. `requireManagerOrAdmin`.
- `GET/POST/PATCH /api/rate-catalog` → manage rates. `requireAdmin`.
- `GET /api/billing/ready` → ready-to-submit queue: jobs where (billable_to_date − billed) > 0 and `bill_status='ready'`, grouped by client/SA. `requireCapability('manage_billing')`.
- `POST /api/billing/submissions` → build a submission from selected jobs/period; explode into `billing_lines` by code. `requireCapability('manage_billing')`.
- `GET /api/billing/submissions/:id` / `POST /api/billing/submissions/:id/render` → view + generate PDF/CSV in `format_key` (puppeteer path, like invoices). `PATCH /api/billing/submissions/:id` → mark `submitted`.

### A3. Billable-to-date logic (server, pure fn — unit-tested)
- `fixed` + `front`: billable when status ≥ delivered/approved/issued, else 0.
- `fixed` + `back`: billable when status = complete, else 0.
- `hourly` + `continuous`: billable = Σ billable hours on the job × `bill_rate`.
- `milestone`: billable = Σ reached-milestone amounts (milestones table optional later; v1 = manual mark).

### A4. UI
- **Per-job billing panel** (in `public/area.html` job-expand, beside hours/docs): method + timing dropdowns, rate (auto-filled, editable), billable amount; **codes editor** — add `code` + `%`/amount, live-validates to 100%/total, shows the split.
- **Operations → Billing tab** (`public/billing.html` or cluster): ready-to-submit queue → select → "Build submission" → preview lines (by code) → generate package (per-client format) → "Mark submitted".

### A5. Build steps
1. Migration 0079 (confirm existing `service_area_jobs` cols first).
2. `routes/job_billing.js` + mount; rate auto-fill; code-sum validation.
3. Billable-to-date pure module + `tests/job_billing.test.js`.
4. Per-job billing panel UI.
5. Billing tab: ready queue + submission builder + render (needs Carter's per-client samples → `format_key` templates).
6. Seed `rate_catalog` + submission formats from Carter's samples (RUS inspection, RUS design, non-RUS permitting).

### A6. Done-when
Set a job's method/timing/rate/codes; codes validate to the total; ready queue shows billable work; a submission renders in the client's format with one line per code; marking submitted moves it out of the queue. Economics unaffected by code count.

---

# SYSTEM B — Projections (aggregation, not one rule)

### B1. Data model
Mostly derived (no heavy storage). Optional `projection_snapshots` (`id, scope, taken_at, payload jsonb`) for partner history. Inputs: job billing config + status + hours + map scope (`service_areas.miles`, materials qty) + `contract_allocations`.

### B2. Per-job projection (server, pure fns — unit-tested in `tests/projections.test.js`)
For each job compute `{expected_total, recognized_to_date, remaining, bucket}`:
- `front` → expected = billable_amount; recognized = expected if delivered else 0; bucket = `billable_now`.
- `continuous` → expected = contract allocation for this SA/job when present (`SA.miles × per_mile_rate`, per-mile = remaining$ ÷ remaining miles) else `remaining_scope × bill_rate`; recognized = hours×rate to date; remaining = expected − recognized; **pace** = recent hrs/wk → projected finish; bucket = `over_construction`. **Return a range** `[low, high]` from a `pace_weeks` param.
- `back` → expected = billable_amount; recognized = 0 until complete; bucket = `at_closeout`.

### B3. API (extend routes/projections.js)
- `GET /api/projections/summary?client=&cc=&sa=&pace_weeks=` → per-bucket totals (`billable_now / over_construction / at_closeout`) + per-job breakdown + the pace assumption used. `requireCapability('cockpit')`.

### B4. UI (Operations → Money/Cockpit → Projections)
Stacked/timeline view by bucket, per contract; **pace slider** (re-queries with `pace_weeks`); continuous shown as a range; partner-export (PDF/CSV).

### B5. Build steps
1. Per-job projection module + tests.
2. `summary` endpoint with buckets + tunable pace.
3. Projections UI + pace control + export.
*(Contract-allocation engine for `continuous` uses map-derived `miles`/remaining — deferred until the map integration (System C) lands; interim inputs manual.)*

### B6. Done-when
A contract shows expected revenue split into now/during-construction/at-closeout; the continuous slice moves with the pace slider; numbers reconcile to the per-job billable logic in System A.

---

# SYSTEM C — Map + Production tracker (the construction side)
*The map is already an authoring tool (`fiber_route_manager_v33.html`). This is integration, phased. Full diagnosis: `docs/map_requirements.md`.*

### C1. Data model (migration 0080_production.sql)
- Reuse: `map_store`, `cost_catalog`, `service_areas.map_plan_id`/`construction_contract_id`/`miles`, `service_area_materials` (expected + `completed_quantity`).
- **`daily_production`** (the daily cards): `id uuid pk`, `service_area_id uuid`, `route_id uuid null`, `construction_contract_id uuid`, `entry_date date`, `work_order text`, `road text`, `grid text`, `inspector_user_id uuid`, `unit_code text`, `qty numeric`, `notes text`, `created_by uuid`, `created_at`. (Mirrors the Coda card fields: Concentrator=SA, Date, WO, Route, Road, Grid, Items, Inspector, Qty.)
- **`daily_production_attachments`**: `id`, `daily_production_id fk`, `file_path`, `kind text` (`signed_sheet|asbuilt|redline|photo`), `uploaded_by`, `uploaded_at`. (Signed sheet = the agreement artifact; never lose it.)

### C2. Completion sources (two paths — both roll into the rollup)
- **Geometry units:** office lady marks the map element `status='asBuilt'` → persisted via `PUT /api/map/store/:key` → rollup counts asBuilt as completed.
- **No-geometry units (drops):** office enters completed count in a per-route table → `service_area_materials.completed_quantity`.
- `daily_production` is the **field record + evidence + report source**; it's what the office lady works from to mark completion. Authoritative completed number = map status (geometry) / material count (non-geometry).

### C3. API
- Embed/persist: `GET/PUT /api/map/store/:key` (exists) via authed adapter.
- `GET /api/map/estimate?plan=&cc=` (exists) → BOM × catalog = expected/completed/cost.
- `POST /api/construction-contracts/:id/catalog` (exists) → upload Excel unit list (item→$).
- `GET /api/service-areas/:id/bom-export` → **Excel `Unit = qty`** (align to their format; CSV export already in the map).
- `GET/POST /api/service-areas/:id/daily-production` → list (filters: date, inspector, route, unit) / create. `POST /api/daily-production/:id/attachments`.
- `GET /api/service-areas/:id/production-rollup` → per unit: expected, current, expected_cost, current_cost, % complete, over/behind flag → route → SA → CC.
- `PUT /api/service-areas/:id/materials/:unit/completed` → set completed count (no-geometry path).
- `POST /api/service-areas/:id/production-report` → generate the package (units + signed sheets) for client/prime/construction.

### C4. UI
- **Operations → Map tab:** embed `fiber_route_manager_v33.html` authed, full-screen capable, **one map + toggleable layers**; Plan↔SA link; `jobRef`→service_area_job picker. (Retire the standalone splice tile.)
- **Production tracker views (reproduce Coda):** per CC/SA/route unit tables (expected/current/cost/%/flags, red when current>expected) + **daily-cards view** filterable like the screenshots.
- **Office-compiler surface:** enter/receive daily cards + attachments; mark completion (map or count table); one-click report-out.

### C5. Build steps (phased — do NOT attempt all at once; this scope killed the old splice tool)
1. Embed map authed as Operations Map tab; DB storage adapter; Plan↔SA link; jobRef→job picker.
2. Per-CC cost catalog from Excel; **BOM export Excel (`Unit=qty`)** (fast early win).
3. `daily_production` + `daily_production_attachments` + intake (office + 1099/inspector) UI.
4. `production-rollup` endpoint + tracker unit tables + daily-cards view.
5. Completion: map asBuilt path + per-route count table → rollup.
6. Report-out generator (client/prime/construction).
7. **Splice layer** (System G).

### C6. Fluidity requirement (make-or-break)
Units/categories are **data, not code**: `cost_catalog` rows are admin/engineer-defined; inspectors only pick. Drawn features tag to a `unit_code` and self-tally (length→footage, point→count). **No-geometry categories (drops) roll up via `service_area_materials` without a map drawing.** New unit/category = a catalog row + optional drawable type → no migration.

### C7. Done-when
Engineer draws units → expected BOM + Excel export; office marks completion → current totals + % roll up SA→CC→client matching the Coda tracker; daily cards carry signed sheets; one click sends the report to client/prime/construction; "drops" (no drawing) still roll up.

---

# SYSTEM D — Hours capture (the linchpin — must be trustworthy)

### D1. Data model (migration 0081_hours_confidence.sql)
- Extend `time_entries`: `source text` (`'engineer_app'|'1099_app'|'workforce_import'|'manual'`), `confirmed_at timestamptz null`, `confirmed_by uuid null`. (Overhead already via `unbilled_category`.)

### D2. API
- `POST /api/time-entries` (exists) — engineer daily log + 1099 app; **IDOR-guarded to own assigned jobs** for contractor/1099.
- `GET /api/my/assigned-jobs` — the 1099/inspector's assigned SAs/jobs (from `job_assignments`).
- `POST /api/hours-import/workforce` — Workforce CSV → match to jobs (extend `hours_import.js` + `_hours_match.js`).
- `GET /api/hours/confirm?user=&week=` + `POST /api/hours/confirm` — weekly confirm loop (sets `confirmed_at/by`).
- `GET /api/hours/anomalies` — flags: hours on a not-started job; billable hours but no status movement; erratic week-over-week; active staff zero-hour days; **orphan hours (no job + no overhead bucket)**.

### D3. UI
- **Engineer:** daily hour-log widget (pick job → hours → note) in operations.
- **1099 mobile clock app:** own portal (PWA, phone-first, minimal) — pick assigned SA/job → clock in/out or enter hours + note → submit. (Reuse the contractor-timeclock work; this is its purpose.)
- **Office/admin:** Workforce CSV import screen (reuse hours-import UI); **weekly confirm review**; **anomaly queue**.

### D4. Build steps
1. Migration 0081 (source/confirm cols).
2. Engineer daily-log UI (POST time-entries).
3. 1099 PWA clock app (assignment-scoped, IDOR-guarded).
4. Workforce CSV import adapter (confirm Carter: does Workforce export CSV?).
5. Weekly confirm loop + anomaly endpoint + UI.

### D5. Done-when
Every paid hour lands on a job or an explicit overhead bucket (no orphans); engineers log daily; 1099s clock in-app (no more texts); W2 inspection hours import from Workforce; a weekly confirm catches gaps; anomalies surface for review. **This feeds System A (billing), E (cost/cockpit), B (projections).**

---

# SYSTEM E — Director cockpit + early warning (internal only)

### E1. Data model (migration 0082_app_settings.sql)
- **`app_settings`** (`key text pk`, `value jsonb`, `updated_by`, `updated_at`): `internal_cost_rate` (default 45), `fixed_fee_warn_pct` (0.8), `rus_cap_warn_pct`, `util_warn_pct`, `util_window_weeks`. Director-editable.

### E2. API (routes/cockpit.js — capability-gated `requireCapability('cockpit')`)
- `GET /api/cockpit/profitability?client=&cc=&sa=` → per job/SA/CC: revenue (billable, System A), cost (Σ hours × `internal_cost_rate`), margin.
- `GET /api/cockpit/utilization?period=` → per person: billable ÷ available hours + throughput (jobs advanced / permits submitted / daily-production entries), **peer-relative percentile**.
- `GET /api/cockpit/alerts` → fixed-fee cost ≥ `fixed_fee_warn_pct` × fee; RUS projected billings ≥ `rus_cap_warn_pct` × contract cap before scope done; person below `util_warn_pct` over `util_window_weeks`.

### E3. UI
- **Operations → Cockpit tab** (capability-gated): profitability table, projections (System B), alerts feed (+ a rail badge), utilization. 
- **Client project view (separate, existing customer portal):** engineering + construction **billable** $ + progress — **never** internal cost/margin.

### E4. Build steps
1. Migration 0082 (`app_settings`) + a settings editor (director).
2. `routes/cockpit.js` (profitability/utilization/alerts), capability-gated.
3. Alert computation (on-read v1; scheduled feed/badge later).
4. Cockpit UI + alerts badge.

### E5. Done-when
Director sees live margin (rev − hours×$45) per job/SA/CC, revenue projection by timing, and gets flagged FIRST when a fixed-fee job nears its fee, a RUS contract will cap before scope completes, or a person's utilization slips. Client view shows none of it.

---

# SYSTEM F — Roles & access (assignment-driven + capability grants)

### F1. Data model (migration 0083_capabilities.sql)
- **`user_capabilities`** (`id`, `user_id`, `capability text`, `granted_by`, `granted_at`). Capabilities: `cockpit`, `all_hours`, `manage_billing`, `manage_users`, `all_projects`, `production_compiler`. (Same shape as `user_portal_access`.)
- **Role defaults** (code map): each base role → a default capability set; `user_capabilities` rows are **additive grants** on top.

### F2. API
- `GET /api/me/capabilities` → resolved caps (role defaults ∪ grants).
- `GET/POST/DELETE /api/admin/users/:id/capabilities` → manage grants. `requireAdmin`.
- **Middleware `requireCapability(cap)`** in `auth.js`: checks role defaults ∪ grants; used by cockpit/billing/etc.

### F3. UI
- **Admin → user management:** capability checkboxes per user (role defaults shown locked, grants toggle — mirror the existing Portal Access matrix).
- **Rail/nav:** gate links by capability — extend `app_nav.js`'s `data-admin-only` pattern to `data-capability="cockpit"`, revealed from `/api/me/capabilities` (fail-closed).
- **Assignment-driven views:** everyday surfaces filter by `job_assignments` (your jobs), so inspector↔engineer flips need no relabel; capability gates *sensitivity* (cost/management) only.

### F4. Build steps
1. Migration 0083 (`user_capabilities`) + role-default map + resolver.
2. `requireCapability` middleware.
3. `/api/me/capabilities` + admin capability CRUD.
4. Capability UI (admin) + rail gating by capability; assignment-driven view filters.

### F5. Done-when
You can grant the cockpit to your director, "see all hours" to a lead, or billing to someone, without making them admin; a person's everyday view follows their assignments; sensitive surfaces are fail-closed.

---

# SYSTEM G — Splice (a map layer, phased)

### G1. Scope
Fold splicing into the Map tab. Click a **closure/splice point** → its **splice matrix/diagram** → **printable PDF splice diagrams for splice techs** (paper). Not ACAD; not field tablets.

### G2. Data model (migration 0084_splice.sql)
- **`splice_closures`** (or reuse map structures with `ptype='spliceCase'`): link to a map structure id + SA/route.
- **`splice_assignments`**: `id`, `closure_id`, `in_cable`, `in_fiber`, `out_cable`, `out_fiber`, `type` (through/drop/tap), `tray`, `notes`. (The matrix rows.)

### G3. API (routes/splice_map.js)
- `GET/PUT /api/closures/:id/splices` — read/edit the matrix for a closure.
- `GET /api/closures/:id/diagram.pdf` — render the printable splice diagram (puppeteer).

### G4. Build steps (phased)
1. Better drawing/markup viewport (part of System C step 1).
2. Closure data model + attach to map features.
3. Per-closure splice matrix UI (reached by clicking a closure).
4. **Printable splice diagram PDF** for techs.

### G5. Done-when
A planner clicks a closure on the map, edits its splice matrix, and prints a clean per-closure splice diagram for the field. Old standalone splice tile retired.

---

# Consolidated build order (dependency-aware)
1. **Finish training pivot** (C2 curriculum) — *current*.
2. **Phase D cleanup** — delete legacy `routes/inspection.js` + `routes/permits.js` (pre-authorized).
3. **Keystone cutover** — operations cluster becomes the tool; retire `admin.html` rollup.
4. **System D — Hours capture** (engineer log → 1099 app → Workforce import → confirm/anomaly). *Foundation for A/B/E.*
5. **System A — Billing per job** (config + codes + rates + submission). *Needs D + Carter's samples.*
6. **System C — Map + Production tracker** (embed → catalog/BOM export → daily_production → rollup → completion → report-out). *Phased.*
7. **System B — Projections** (needs A + map scope from C for continuous).
8. **System E — Cockpit + early warning** (needs A + D; B feeds it).
9. **System F — Roles & capabilities** (can land earlier in part — the rail-gating seam exists; full grants here).
10. **System G — Splice-on-map** (after C's viewport).
11. **Later:** real-time consolidation, global search polish, KMZ folder-sync, mobile/PWA.

# Inputs needed from Carter (blockers, by system)
- **A/B:** one real **sample of each submission** (RUS inspection, RUS design, non-RUS permitting) → defines `format_key` + codes. Confirm the **RUS job codes** list.
- **D:** does **Workforce export CSV**? (and a sample) → import adapter.
- **C:** final map version (boss-dependent; working version is enough to start).
- **E:** confirm alert thresholds (fixed-fee %, RUS cap %, utilization %/window).

---
*Cross-refs: `docs/PRODUCT_PLAN.md`, `ROADMAP.md`, `docs/map_requirements.md`, `docs/projections_design.md`, `docs/budgets_design.md`, `docs/billing_keystone_design.md`, `docs/cutover_inventory.md`, memory `project_product_plan`.*
