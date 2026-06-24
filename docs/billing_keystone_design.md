# Billing → keystone: design for review (v2)

> Draft for Carter. Moves billing off the retiring `projects` tree onto the **service-area / concentrator** model. **v2 corrects the model** after Carter's clarification: billing is mostly **monthly hours per concentrator**, plus milestone bills at route-final / concentrator-final. Scope = produce invoice records; PDF/sending stays HOLD until Phase 4 (#3). Last updated 2026-06-24.

## The actual billing model (Carter, 2026-06-24)
> "Invoices are generated **monthly**, regardless of build status in some circumstances. Sometimes we bill some jobs when the **route is final**, sometimes when the **concentrator is final**, and **most of the time we bill hours per concentrator monthly** — so that invoice can **not** include last month's hours."

Three patterns, one concentrator at a time:
1. **Monthly hours per concentrator (common).** Every month, per concentrator, invoice **that month's logged hours**. Each monthly invoice carries a billing period and includes **only that period's** hours — prior months are already billed and must never re-bill.
2. **Milestone — route final.** When a route is finalized, bill selected jobs on that route.
3. **Milestone — concentrator final.** When the service area is finalized, bill its remaining jobs.

Hours recur monthly; milestone bills happen once for the thing billed. Billing is an **admin action** (you choose what/when), not auto-derived from status — status is just the gate for *eligibility*.

## The key correctness mechanism — track billed-ness at the right grain
The v1 mistake was marking a *job* "billed" once. That breaks monthly hours (a job accrues hours across many months and is billed every month). So:
- **Hours → track on `time_entries`.** New nullable `time_entries.invoice_id`. A monthly run bills the unbilled (`invoice_id IS NULL`) hourly entries whose `entry_date` falls in the period, then stamps `invoice_id` on them. ⟹ "this invoice can't include last month's hours" holds **by construction**, and re-running a month can't double-bill.
- **Milestone (fixed / footage) → track on the job.** `service_area_jobs.billed_date` (exists) marks the one-time bill of a fixed/footage job at route/SA finalize.

## Schema — migration `0066_invoice_service_area_link.sql`
```sql
ALTER TABLE invoices      ADD COLUMN service_area_id uuid REFERENCES service_areas(id),
                          ADD COLUMN engineering_contract_id uuid REFERENCES engineering_contracts(id);
ALTER TABLE invoice_items ADD COLUMN service_area_job_id uuid REFERENCES service_area_jobs(id);
ALTER TABLE time_entries  ADD COLUMN invoice_id uuid REFERENCES invoices(id);
CREATE INDEX ON invoices (service_area_id);
CREATE INDEX ON invoices (engineering_contract_id);
CREATE INDEX ON time_entries (invoice_id);
```
Already present (no change needed): `invoices.billing_period_start/_end`, `invoice_items.period_year/_month`. All new columns nullable → legacy project invoices keep working through the transition. (Deploy: Railway skips auto-migrate — I apply 0066 to the dev DB now and hold prod for cutover, per your OK on #4.)

## Backend
1. **Billing worklist:** `GET /api/billing/unbilled?period=YYYY-MM` → per concentrator: (a) unbilled hours in that period grouped by hourly job, and (b) un-billed milestone amounts (fixed/footage jobs on finalized routes / finalized SAs). This is the screen you bill from.
2. **Monthly hours run:** `POST /api/billing/bill-monthly { period:'YYYY-MM', service_area_ids?:[...] }` → for each concentrator, sum its unbilled hourly `time_entries` in the period per job → **one invoice per concentrator** (period-stamped, `service_area_id`/EC set) with a line per job (hours × rate) → stamp those entries' `invoice_id`. Skips concentrators with no period hours. Transactional.
3. **Milestone — concentrator:** enhance existing `POST /api/service-areas/:id/bill` → bill the SA's remaining unbilled **fixed/footage** jobs (and stamp `billed_date`); set the new SA/EC links + items' `service_area_job_id`.
4. **Milestone — route:** `POST /api/service-area-routes/:id/bill` → same, scoped to one finalized route's jobs.
5. **Report:** `GET /api/billing/report?group=client|ec|program|month` from `invoices` via the new links — also lets `money_view` program-financials finally split invoice revenue by program (retires the task-34 client-level fallback).

## UI (fan to C2 after backend lands)
Rework `billing.html` onto the keystone: a **month picker + concentrator worklist** (`/api/billing/unbilled?period=`) with "Bill month's hours" (batch) and per-route / per-SA milestone "Bill" actions; **invoices list** (reuse `GET /api/billing/invoices`) with period + drill-in; **report** tab. Drop the project-based paths.

## Out of scope (deliberate)
- **PDF / sending** — HOLD until Phase 4 simple template (#3). This build yields `draft` invoice records with correct amounts/periods/links.
- **Auto-scheduled** monthly runs — this build is a **manual** monthly trigger (you pick period + concentrators and click). A cron/auto-run can come later.
- **Real invoice numbers** — still `INV-<timestamp>`; proper numbering is a Phase-4 concern.

## Open decisions (most now resolved)
- ✅ Granularity = **per concentrator**, monthly. ✅ Eligibility gate = job status as in v1.  ✅ Monthly billing **is** in this build. ✅ Apply 0066 to dev, hold prod.
- ❓ **Billing period definition:** calendar month by `entry_date` (e.g. June = 06-01…06-30)? Or a custom cycle (e.g. 26th→25th)? Default I'll build: **calendar month**.
- ❓ **Hours rate source:** bill hours at the **job's `rate`** (current behavior). Correct, or is there a per-period/role rate that can differ? Default: job rate.
- ❓ **Re-billing a partial month:** if you bill June mid-month then more June hours get logged, a second June run will bill just the new entries (a 2nd June invoice). Fine, or should June be "closed" once billed? Default: allow the catch-up invoice (safest — never silently drops hours).

## Sequence once you confirm the 3 ❓
(a) migration 0066 → (b) bill-monthly + milestone(SA/route) + unbilled-worklist + report endpoints (CEO, tested vs dev DB incl. the no-double-bill + period-isolation cases) → (c) point program-financials at the new links → (d) fan `billing.html` to C2 → (e) retire legacy project billing at cutover.
