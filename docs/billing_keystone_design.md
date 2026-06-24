# Billing → keystone: design for review

> Draft for Carter (HANDOFF §6 / cutover decision #1 fallout). The cluster currently *bills the retiring `projects` tree*; this moves billing onto the **service-area** model so we can drop projects. Scoped to **producing invoice records** — PDF generation / sending stays on HOLD until ROADMAP Phase 4 (decision #3). Last updated 2026-06-24.

## Current state (verified)
- **Keystone billing already half-exists:** `POST /api/service-areas/:id/bill` gathers a service area's done-but-unbilled jobs (`status in issued/client_approved/complete`, `actual_amount > 0`), creates **one draft invoice**, writes `invoice_items` per job, and stamps each job `billed_date` + `status='billed'`. Driven today only by the per-SA "Generate invoice" button.
- **The cluster `billing.html` is still legacy:** it calls `/api/billing/bill-multiple`, `/api/billing/batches`, `/api/revenue/unbilled`, `/api/projects/` — all **project-based**. Once projects retire, this breaks.
- **Schema gaps (the real blocker):**
  - `invoices` has **no `service_area_id` / `engineering_contract_id`** — invoices link to `client_id` only. The SA name lives in `notes`/item text. → can't cleanly attribute revenue per service area / EC / program (this is exactly why the R7 program-financials fix had to fall back to client-level).
  - `invoice_items` carries legacy `project_id`, **no `service_area_job_id`** — line items can't trace back to the keystone job they billed.
  - `/api/revenue/unbilled` is projects-based (one row per project).

## Proposed model
**The service area is the billable unit** (consistent with the whole keystone). Billing a service area = create an invoice from its done-unbilled jobs. Add the missing links so revenue attributes cleanly.

### Schema — migration `0066_invoice_service_area_link.sql`
```sql
ALTER TABLE invoices       ADD COLUMN service_area_id uuid REFERENCES service_areas(id),
                           ADD COLUMN engineering_contract_id uuid REFERENCES engineering_contracts(id);
ALTER TABLE invoice_items  ADD COLUMN service_area_job_id uuid REFERENCES service_area_jobs(id);
CREATE INDEX ON invoices (service_area_id);
CREATE INDEX ON invoices (engineering_contract_id);
```
All nullable → legacy project-based invoices keep working untouched during the transition. (Deploy note: Railway `startCommand=node server.js` skips auto-migrate — apply this to the DB deliberately, same as 0064/0065. Needs your OK or I apply it to the dev DB and hold prod for cutover.)

### Backend
1. **Enhance the existing SA bill** (`POST /api/service-areas/:id/bill`): set `invoices.service_area_id` + `engineering_contract_id` (from the SA), and `invoice_items.service_area_job_id` per line. No behavior change otherwise.
2. **Batch bill** (replaces legacy `bill-multiple`): `POST /api/billing/bill-areas { service_area_ids:[...], combine?:bool }`. Default = one invoice per SA (clean attribution); `combine:true` = one invoice per client with each SA's jobs as line items (for clients who want a single consolidated bill). Transactional; returns the created invoices.
3. **Keystone unbilled queue** (replaces `/api/revenue/unbilled`): `GET /api/billing/unbilled` → service areas that have done-but-unbilled billable jobs, with their billable total, client, EC/program. Drives the batch-bill picker.
4. **Keystone billing report** (replaces `/api/billing/report`): `GET /api/billing/report?group=client|ec|program|month` → billed totals from `invoices` joined via the new `service_area_id`/`engineering_contract_id`. This also lets `money_view` program-financials finally split invoice revenue by program accurately (retires the task-34 client-level fallback).

### UI (fan to C2 once backend lands)
Rework `billing.html` onto the keystone: **Unbilled queue** (checkbox list from `/api/billing/unbilled`, "Bill selected" → batch endpoint, combine toggle) · **Invoices list** (reuse `GET /api/billing/invoices` + drill-in) · **Report** (the grouped totals). Drop the project-based code paths. Internal admin; money is fine here.

## What this build does NOT include (deliberate)
- **PDF generation / sending** — HOLD until Phase 4 simple template (#3). Keystone billing produces `draft` invoice records; the send/PDF step is separate and stays legacy for now.
- **Monthly/recurring billing** — the keystone has `is_ongoing` + `billing_cadence='monthly'`, but a recurring monthly billing *run* is its own feature (period windows, idempotency). Flag for a follow-up; this build is one-time/manual billing of done work.
- **Real invoice numbers** — still `INV-<timestamp>`; proper numbering is a Phase-4/template concern.

## Open decisions for you
1. **Default invoice granularity:** one invoice **per service area** (my recommendation — cleanest attribution, matches SA-as-unit) vs one consolidated invoice **per client** batching SAs. (I'd ship per-SA default + a `combine` option; tell me if clients actually want consolidated.)
2. **What "done" means for billing:** currently a job is billable when `status in (issued, client_approved, complete)` and `actual_amount > 0`. Is that the right trigger, or should billing be allowed earlier / gated differently?
3. **Monthly/ongoing SAs:** confirm recurring billing is a later feature (not this build).
4. **Migration timing:** OK to apply `0066` to the dev DB now and hold prod until cutover, or do you want to switch Railway to `npm start` (auto-migrate) first?

## Sequence once you approve
(a) migration 0066 → (b) enhance SA bill + batch + unbilled + report endpoints (CEO, tested vs dev DB) → (c) point `money_view` program-financials at the new linkage → (d) fan `billing.html` rework to C2 → (e) retire legacy project billing at cutover.
