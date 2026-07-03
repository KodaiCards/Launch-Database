# 07 — Billing / invoices / money — ✅ COMPLETE (07a engines · 07b invoice/PDF · 07c projection/budget/reporting)

> Mapped 2026-06-29. The highest-stakes money area (real revenue + government billing). **07a done = the reconciliation core:** billing.js (legacy), billing_keystone.js (ledger), + the service_areas.js `:id/bill` shim (re-read from chunk 03). **This resolves O15 (3 billing paths) and refines O16 (invoice↔SA link).** Pending → 07b: invoices.js, invoice_templates.js, invoice_generator.js (1189), invoice_template_engine.js (614) — the invoice/PDF stack. 07c: revenue.js (549), projections.js (256), budgets.js (503), project_billing.js (258), pricing.js (173) — money-reporting + projection + budget layer.

## ⭐ O15 RESOLVED — there are THREE billing paths; here's what each does + which is canonical

| # | Path | File / endpoint | Operates on | Invoice link written | Status | Verdict |
|---|------|------|------|------|------|------|
| 1 | **Legacy bulk** | `billing.js` `POST /bill-multiple` + batches | **legacy `projects`** | `invoice_items.project_id` set; `invoices.service_area_id` = **NULL** | `sent`/`draft` | **RETIRE with the legacy projects tree** |
| 2 | **Simple SA shim** | `service_areas.js` `POST /api/service-areas/:id/bill` | keystone `service_area_jobs` | **NEITHER** — `project_id=NULL` AND `service_area_job_id` not in the INSERT; `invoices.service_area_id`=NULL | `draft` | **WORST — orphan invoices; retire or delegate to #3** |
| 3 | **Progressive ledger** | `billing_keystone.js` `/worklist` + `/run` | keystone `service_areas`/`service_area_jobs`/`routes` | `invoice_items.service_area_job_id` set; `invoices.service_area_id` + `engineering_contract_id` set | `draft` | **✅ CANONICAL go-forward engine** |

**Recommendation to CEO (billing rebuild):** make **#3 (billing_keystone) THE billing engine.** Retire #1 (legacy, projects-based) when the projects tree retires; **fix or remove #2** (the simple `:id/bill` in service_areas.js) — it creates invoices linked to nothing but the client, so they can't be attributed per-SA or per-program. Today #1/#2/#3 all coexist (server.js comment line 760: *"Coexists with legacy routes/billing.js during cutover"* — so this coexistence is **known + intentional-for-now**, not an accident).

### #3 `billing_keystone.js` (221) — the elegant one (study this before touching billing)
**One rule for every billing pattern:** `billable_now = earned_to_date − already_billed_to_date` per job.
- **earned**: hourly = Σ hours(≤ period end) × rate · footage = completed footage × rate (manual now, map-fed later) · fixed = `estimated_amount` once its route (or the area, when route-less) is finalized (`bill_trigger='completed'` milestone), else 0; `progressive` accrues continuously.
- **already-billed** = Σ the job's non-void `invoice_items.amount` keyed by **`service_area_job_id`** — *derived, no per-entry billed flag.* ⇒ corrections automatically fall out as **negative reconciliation lines** (`line_kind='reconciliation'`). This is why one code path yields monthly-hourly, progressive-footage, milestone-fixed, catch-up, AND credits.
- `/worklist?period=YYYY-MM` → earned/billed/billable per job grouped by SA. `/run` → one DRAFT invoice per SA from billable lines (skips |billable|<$0.005). `/report?group=client|ec|program|month` (filters `service_area_id IS NOT NULL` → keystone-only). `/periods` + `/periods/:month/close` = an **informational "month closed" tag that NEVER locks editing** (`billing_period_close` table) — deliberate (Carter dislikes hard locks).
- Money-safe: all cents rounded via `CENT()`; manager/admin gated.

### #1 `billing.js` (666) — the legacy bulk engine (projects-based)
- `POST /bill-multiple`: bill N legacy projects as ONE invoice. **HARD-CODED RATE FALLBACK again** (line 74: inspection 90/re 100/permitting 90 — another I4 copy). Cadence-aware: `one_time`→`status='billed'`+`billed_date`; `monthly`→stays active to reappear next month. Integer-cents accumulation (no float drift). `idx_invoice_items_project_period` unique partial index blocks double-billing a project+month (23505→409 with deep-link to existing invoice).
- **Billing batches** (`billing_batches`/`billing_batch_items`): save a frozen project group for review → `confirm` makes an invoice (reuses `inferInvoiceMakeup` from invoice_generator) → `delete` returns projects to the queue. Ownership-scoped (managers only touch their own batches; admin any).
- `GET /report` (month/year + YTD by invoice_date) — **⚠ SHADOWED, see O19.**

### #2 `service_areas.js :id/bill` (re-read, ~line 905-935) — the orphan-maker
Selects SA jobs `WHERE billed_date IS NULL AND status IN ('issued','client_approved','complete') AND actual_amount>0`, sums, creates ONE draft invoice. **But:** `INSERT INTO invoices (client_id, invoice_number, invoice_date, total_amount, status, notes)` — no `service_area_id`. `INSERT INTO invoice_items (invoice_id, project_id=NULL, …)` — no `service_area_job_id`. ⇒ the resulting invoice is attributable to the **client only**. This is the actual source of the "invoices aren't linked to SAs" complaint.

## ⭐ O16 REFINED — the invoice↔SA link EXISTS (keystone path); it's path-dependent + under-used by reporting
- `invoice_items` carries BOTH `project_id` (legacy) AND `service_area_job_id` (keystone); `invoices` carries `service_area_id` + `engineering_contract_id`.
- **billing_keystone `/run` populates all of them** → those invoices ARE joinable to SA/EC/program. So my chunk-05 statement "no clean invoice→SA join" was too strong: it's true for paths #1 (project_id only) and #2 (nothing), **false for #3**.
- Remaining real problem: (a) path #2 makes orphan invoices, and (b) `money_view.js`/`program-financials` (chunk 05) derive per-program from `service_area_jobs` status instead of joining `invoices.service_area_id`/`invoice_items.service_area_job_id`, so keystone invoice $ isn't attributed per program. **Fix = retire #1/#2 + repoint money_view's program attribution at the keystone columns.** Lower-effort than I first feared.

## Findings (07a)
- **O15 → RESOLVED** with the table above + recommendation (canonical = billing_keystone; retire legacy + simple shim). Logged.
- **O16 → REFINED** (link exists on keystone path; fix = retire orphan paths + repoint reporting). Logged.
- **O19 (new, real bug): `GET /api/billing/report` is double-registered.** Defined in BOTH billing_keystone.js (line 163) and billing.js (line 622), different response shapes (keystone: `{group, rows}` by client/ec/program/month; legacy: `{year,month,monthly_revenue,ytd_revenue,invoices}`). server.js mounts **keystone first (761) → legacy second (921)**, so Express serves the **keystone** handler and **billing.js's /report is DEAD**. If `billing.html` still calls `/api/billing/report` expecting the legacy month/year shape, it silently gets the keystone shape → likely broken legacy billing report. → verify billing.html on the deepening/UI pass.
- **I4 (rate fallback) +1 copy** in billing.js bill-multiple (line 74). Tally keeps climbing.
- **Design note worth keeping:** the "earned − billed (derived)" ledger is genuinely good architecture — progressive/milestone/reconciliation from one rule, no per-entry billed flag to drift. Any billing work should extend THIS, not the legacy queue.

---
## 07b — the invoice/PDF stack (invoices.js, invoice_generator.js, invoice_templates.js, invoice_template_engine.js) — mapped 2026-06-29

### `invoices.js` (253) — legacy invoice route surface (list + void + RUS-PDF endpoints)
- `GET /api/invoices?year=` — lists invoices w/ items via `invoice_items ⋈ projects ON ii.project_id` (LEFT). **⚠ keystone invoices (where items carry `service_area_job_id`, `project_id=NULL`) render with NULL project_name/type/WO#** — they show up but blank. O16 facet (the LIST is project_id-only).
- `POST /generate-pdf` (explicit EC+job+period) · `/generate-pdf-from-projects` (infer scope from project_ids, 422+conflicts if ambiguous) · `/preview-makeup` · `/preview-data` — all delegate to `invoice_generator.js`. **RUS-only** (generator throws if EC.program≠'rus').
- `DELETE /:id` (void): finds linked projects via `invoice_items.project_id`, sets `projects.status='completed'`+clears billed_date; `?wipe_hours=true` (ADMIN-ONLY, deletes time_entries — destructive) ; whole thing transactional. **⚠ Void only unbills LEGACY projects — a keystone invoice's `service_area_jobs.billed_date` would NOT be reset by void.** O16/O20 facet.

### `invoice_generator.js` (1189) — the LEGACY hardcoded PSC RUS PDF (pdfkit) — **100% projects-based**
Confirmed by grep + read: references ONLY `engineering_contracts`/`contracts`/`projects`/`concentrators`/`time_entries(project_id)`/`staff`/`jobs`. **Zero `service_area_job_id`/`service_areas`.**
- `buildInvoiceData(pool,{ec_id,job_id,period,contract_ids?})`: EC+`program='rus'` gate (loud throw otherwise) → contracts under EC → per contract a **WITH RECURSIVE walk of the `projects` tree** to find non-rollup leaves matching `job_id`, resolving WO# from leaf/ancestor/`concentrators`; hourly = Σ `time_entries.hours` in period (ancestor-walk + `job_title` match), footage = `projects.footage`×rate (or `expected_revenue`). Builds **timecards grouped by staff** (RUS audit trail). Skips zero-activity WOs/contracts.
- `renderInvoicePdf`/`renderSummaryPage`/`renderTimecardsPages` (504-944) = pdfkit layout: RUS summary page (loan banner, friendly contract labels, WO rows, totals) + per-employee timecard pages. Mapped at wiring level (layout, not logic).
- `inferInvoiceMakeup(pool, projectIds)` (979) + `buildInvoiceDataFromProjects` (1157): infer EC/job/period from selected legacy `project_ids` (used by the Print-PDF modal AND by billing.js batches save). Also projects-based.

### `invoice_templates.js` (515) + `invoice_template_engine.js` (614) — ⭐ the CONFIGURABLE template system (D013-positive, go-forward)
**Reference-PDF-driven invoice templating:** owner uploads a sample PDF for a **(job, client) pair** → **Claude vision (`analyzeInvoicePdf`)** produces an HTML template with **mustache placeholders** (`{{client.name}}`, `{{period.month_year}}`, `{{#each contracts}}`, `{{{company_logo}}}` → inline base64) → stored (`generated_html`) → at invoice time `substituteTemplate(html,data)` fills it → **puppeteer `renderHtmlToPdf`** → stream. CRUD + `regenerate` (re-run Claude) + reference-PDF download. Explicitly: *"Kept separate from invoice_generator.js (the legacy hardcoded PSC RUS path) so both can coexist while the owner migrates job-by-job."*
- **This IS the per-client/non-RUS invoice-format system Carter wanted** (memory `reference_invoice_non_rus_formats`). It exists + is built. → surface to Carter (is it in use? does it need the keystone data port?).
- **⚠ but the DATA is likely still legacy:** invoice_templates.js imports BOTH `invoiceGenerator` AND `tplEngine` (line 28-29) → the template path almost certainly fills templates with `invoiceGenerator.buildInvoiceData*` output = legacy projects data. So the configurable engine swaps the **renderer** (puppeteer/HTML vs pdfkit) but **not the data model.** → verify which data feeds `preview-template` on the 07b deep pass; if legacy, O20 covers it.

## Findings (07b)
- **⭐⭐ O20 (the #1 billing-cutover blocker): invoice DATA assembly + RUS PDF are legacy-projects-ONLY.** `billing_keystone` can CREATE keystone invoices, but `invoice_generator` (and, likely, the template engine's data) read `projects`/`concentrators`/`time_entries.project_id` with zero keystone awareness. ⇒ a keystone-billed invoice has **no submittable RUS PDF** and renders blank in the legacy list; void won't reset its job. **The canonical billing ENGINE (keystone ledger) and the canonical DELIVERABLE (RUS PDF) are on opposite sides of the cutover.** The billing rebuild MUST port invoice data assembly to `service_area_jobs` (hours via `time_entries.service_area_job_id`, WO# via SA, contracts via EC) — not just switch which engine runs. Biggest, most concrete billing risk found. → open_items O20.
- **⭐ I5 (D013-positive, ALREADY BUILT): the reference-PDF→Claude-vision→mustache→puppeteer template system** = configurable per-(job,client) invoice formats. Directly satisfies `reference_invoice_non_rus_formats`. Likely under-surfaced (ties I2 backend-wired-but-no-UI sweep). → ideas I5; surface to Carter.
- invoices.js list (project_id-only join) + void (projects-only unbill) = two more O16 facets — the whole legacy invoice surface ignores keystone items.
- I4 rate-fallback: invoice_generator uses `jobs.default_rate` (not the hardcoded CASE) — so it's NOT a new I4 copy; good (it reads the catalog). The fallback CASE is concentrated in the dashboards/detail/billing.js, not here.

---
## 07c — money-reporting + projection + budget layer (pricing, projections, budgets, revenue, project_billing) — mapped 2026-06-29 → **07 COMPLETE**

### `pricing.js` (173) — ⭐ `pricing_entries` = the CONFIGURABLE rate source (this is what I4 should centralize ON)
`pricing_entries` table = **(job_id × program × billing_code) → {billing_type, rate}** (Phase 3b: keyed on `program` directly, 1:1 with `engineering_contracts.program`). `GET /api/pricing/lookup?job_id&program&billing_code` returns the default rate (most-specific code first, falls back to no-code row) — **project creation auto-fills the rate from here.** `/gaps` drives the settings red-dot (active job × program with no `pricing_entries` row). CRUD manager/admin; upsert on `(job_id, program, COALESCE(billing_code,'__no_code__'))`.
- **⭐ I4 REFRAME:** a real, data-driven rate config ALREADY EXISTS (`pricing_entries` + `jobs.default_rate`). The 10+ hardcoded `CASE 'inspection' 90 / 're' 100 / 'permitting' 90` fallbacks are legacy SQL that simply never got pointed at it. So I4 = *"repoint the hardcoded CASEs at `pricing_entries`/`jobs.default_rate`"* — a cleanup that consolidates ONTO an existing config table, not a new build. Even lower-risk/higher-leverage than first framed.

### `projections.js` (256) — ⭐ the KEYSTONE projection engine (modern; built ahead of the map)
100% keystone (`service_areas`+`service_area_jobs`+`invoice_items.service_area_job_id`). Base = each job's EXPECTED (`estimated_amount`, else `footage×rate`); `projected_remaining = expected − billed`. **Same for RUS & non-RUS** (configurability — RUS budget is an OVERLAY, not a fork). Endpoints: `/service-area/:id` (per-SA jobs + totals + completion%), `/ec/:id` (**budget burn**: budget vs projected vs billed, burn_rate_monthly, projected_months_to_budget, per-`budget_code` breakdown — this IS `feature_inspection_revenue_projection`, generalized), `?group=client|ec|program` (strictly-modular rollup, never merges across keys), `/map/service-areas`.
- **⭐⭐ Already built AHEAD of the map (memory said "deferred until map lands"):** `mileageBlock` = the **contract-allocation engine** (`contract_allocations` table: per-discipline budget; `per_mile = remaining_$ ÷ remaining_miles`; `sa_expected = SA.miles × per_mile`) AND `computeEstimate` (`_map_estimate.js`) = **map-derived construction** ($ from map units × the CC catalog when `sa.map_plan_id` is set). So the per-mile hourly allocation + per-CC catalog + map-as-source-of-truth projection logic from `project_map_requirements_spec` **EXISTS** — only the map *rendering*/KMZ-sync is deferred. → surface to Carter (I6); the map feature has a big head start.

### `budgets.js` (503) — HYBRID budget layer (RUS budget-cap), keystone-aware on actuals
`budgets` scope to EXACTLY ONE of `project_id` (legacy) OR `engineering_contract_id` (the EC overlay). `budget_codes` = (code, description, `allocated_amount`, optional `job_id` to narrow a code to one discipline). **By-area summary + the EC burn join `budget_codes → service_area_jobs` (KEYSTONE) for actuals + keystone `invoice_items.service_area_job_id` for billed** (lines 111-119) — so the RUS budget-cap CONSUMES keystone data even though budget defs can still be legacy-scoped. IDOR-hardened (codes scoped to budget's EC). Mostly forward-compatible.

### `revenue.js` (549) — LEGACY money reporting (parallel to projections.js)
100% `projects`-based (joins `projects`/parent_id, `time_entries.project_id`, `project_months` snapshot table). **HARD-CODED RATE FALLBACK again** (lines 218-221 — another I4 copy; tally now ~6 files). This is the legacy revenue dashboard/report; `projections.js` is its keystone replacement → **another O18 parallel pair** (legacy `revenue.js` vs keystone `projections.js`).

### `project_billing.js` (258) — LEGACY project lifecycle billing (more invoice-creation paths)
`POST /:id/unbill` (status→completed, delete its invoice_items by project_id) · `PUT /:id/mark-billed` · `POST /:id/bill-and-clone` (mark billed [one_time] or keep active [monthly], **snapshot invoice + invoice_items.project_id**, optionally clone a follow-on project for next period — the ongoing-hourly pattern). Manager team-scope enforced (design_mgr can't touch permitting). All legacy/projects. **bill-and-clone is a 5th invoice-creating path** (writes `invoice_items.project_id`).

## Findings (07c) — area 07 COMPLETE
- **⭐ I4 reframed (see pricing.js):** config rate source already exists (`pricing_entries`); I4 = repoint the ~6-file hardcoded CASE fallback at it. Updated I4.
- **⭐ I6 (new, surface to Carter): the projection/allocation engine is built ahead of the map.** `contract_allocations` (per-mile hourly alloc), `computeEstimate` (map units × CC catalog), EC budget-burn — all live in projections.js/_map_estimate.js. memory `project_map_requirements_spec` had these "deferred until the map lands"; only rendering/KMZ-sync remains. The map feature is closer than the roadmap implies. → ideas I6.
- **O18 expands:** add legacy `revenue.js` ⟂ keystone `projections.js` to the parallel-pairs list. And **invoice-creation has 5 code paths** — 4 legacy-projects (`bill-multiple`, `generate-monthly-invoice`, `bill-and-clone`, the simple `:id/bill`-orphan) + 1 keystone (`/run`). The legacy money surface is large; the cutover must retire 4 paths down to the keystone ledger. → O18 note.
- **Positive:** projections.js + budgets.js (EC overlay) + billing_keystone = a coherent KEYSTONE money trio (projection ↔ budget ↔ ledger), all joined by `service_area_job_id` + `budget_code_id`. The modern money model is internally consistent; the debt is purely the *legacy* duplicates (revenue.js, billing.js, project_billing.js, invoice_generator) hanging on for the projects tree.

## Reapproach-if
- 07b deep-verify (carried): which data feeds `preview-template`/`render-pdf-from-html` (legacy vs keystone) — confirm on UI pass.
- Cutover (O18/O20): billing is the densest parallel-tables case — 5 invoice paths, legacy vs keystone reporting, RUS-PDF legacy-only. The billing rebuild = retire 4 legacy paths, port invoice data assembly to keystone (O20), repoint money_view + revenue at keystone columns (O16), centralize rates on pricing_entries (I4).
- UI pass: billing.html (legacy, /report shadow O19) vs billing-keystone.html (ledger) — which does Carter use day-to-day? + is the projection/map engine (I6) reachable in the UI?
- 08 pipelines next.
