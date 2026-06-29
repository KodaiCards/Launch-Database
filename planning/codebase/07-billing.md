# 07 — Billing / invoices / money — 🔄 (07a: the engine reconciliation, O15+O16 RESOLVED)

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

## Reapproach-if
- 07b (invoice_generator 1189 + template_engine 614 + invoice_templates 515 + invoices 253): the PDF/templating stack — which engine(s) feed it; does it read project_id or service_area_job_id? (ties O16). `inferInvoiceMakeup` lives here (used by batches).
- 07c (revenue/projections/budgets/project_billing/pricing): the reporting + RUS budget-cap layer; expect more I4 rate-fallback copies + the RUS projection-vs-budget logic (memory `feature_inspection_revenue_projection`). `pricing.js` may be the closest thing to a rate source → check vs I4.
- Cutover (O18): billing is the clearest parallel-tables case — 3 engines, 2 invoice-link shapes. The billing rebuild is where O15/O16/O18 converge.
- UI pass: billing.html (legacy, /report shadow bug O19) vs billing-keystone.html (ledger) — confirm which Carter actually uses day-to-day.
