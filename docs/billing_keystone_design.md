# Billing → keystone: design for review (v3)

> Draft for Carter. v3 captures the **progressive, reconcilable** model he described: monthly hours per concentrator, footage billed incrementally from the map (some in June, more in July, final in Aug), all job types fluid + correctable without code changes. Scope = produce invoice records; PDF/sending HOLD until Phase 4. Last updated 2026-06-24.

## The model in Carter's words (2026-06-24)
- Invoices generated **monthly**, per concentrator; mostly **hours** (timecards are **weekly pay periods**, invoiced monthly — a June invoice carries June hours only).
- **Some roles bill at different rates.**
- Sometimes bill **when a route is final**, sometimes **when the concentrator is final**.
- **Footage** pulls from the **map**: how much *could* be billed (expected) and how much is *ready/built* (completed). May bill the completed portion in June, more in July, the **final in Aug**.
- A month gets a **"closed" tag by the 10th of the next month** — *informational only*: editing, new invoices, and corrections stay possible.
- If hours/quantities are **removed** after billing, the difference appears on the **next invoice as a reconciliation** (credit) — which can be **deleted** if we choose not to reconcile.
- "Things need to be fluid enough to feel natural and be possible **without rewriting code**."

## Core principle — a billing ledger (one rule for every pattern)
For each billing run, for each job in a concentrator:
```
billable_now = earned_to_date − already_billed_to_date
```
- **earned_to_date** by billing type:
  - *hourly* — Σ logged hours × rate (from `time_entries`)
  - *footage* — completed_quantity × rate (from the map / completed measure)
  - *fixed* — full amount once its milestone (route-final / SA-final) is reached, else 0 (or a manual %)
- **already_billed_to_date** = Σ amount of that job's prior non-void `invoice_items` (the ledger).
- `billable_now > 0` → a **charge** line. `< 0` → a **reconciliation** (credit) line, flagged and **deletable** before the invoice is finalized.

This single operation yields: monthly hours (each run picks up the new month's unbilled hours), **progressive footage** (June bills completed-so-far, July bills the new completed delta, Aug bills the final delta), milestone fixed, **catch-up** (late hours bill next run), and **corrections** (negative delta → credit). No per-type branching beyond computing `earned_to_date`. That's the "no rewrite" property.

## Period, cadence, closed tag
- **Calendar-month** invoices, per concentrator. Weekly timecards roll into the month by `entry_date`.
- **Closed tag:** a lightweight per-month marker (auto-set after the 10th of the following month; manually toggleable). Purely informational — it does **not** lock edits or block new/correcting invoices. Drives display ("June closed") and a gentle "billing a closed month" hint, nothing more.

## Schema — migration `0066_billing_keystone.sql`
```sql
ALTER TABLE invoices      ADD COLUMN service_area_id uuid REFERENCES service_areas(id),
                          ADD COLUMN engineering_contract_id uuid REFERENCES engineering_contracts(id);
ALTER TABLE invoice_items ADD COLUMN service_area_job_id uuid REFERENCES service_area_jobs(id),
                          ADD COLUMN line_kind varchar(20) DEFAULT 'charge';  -- 'charge' | 'reconciliation'
-- (invoices.billing_period_start/_end and invoice_items.period_year/_month already exist.)
CREATE TABLE billing_period_close (   -- the informational closed tag
  period_month date PRIMARY KEY,      -- first-of-month
  closed_at timestamptz, closed_by_user_id uuid
);
CREATE INDEX ON invoices (service_area_id);
CREATE INDEX ON invoice_items (service_area_job_id);
```
The ledger ("already billed") is derived by summing `invoice_items` per `service_area_job_id` — **no per-entry billed flag needed**, which is what keeps corrections automatic. All new columns nullable / defaulted → legacy invoices untouched. Apply to dev now, hold prod for cutover (your call #4).

**Footage "completed" source:** progressive footage needs a *completed quantity that grows over time*. The map will drive this later (map↔materials sync is deferred). **For now** the completed measure is set manually (a job/route completed field) and the same ledger bills its deltas; when the map lands, it just feeds that number — no billing-code change. (Flag below.)

## Backend
- `GET /api/billing/worklist?period=YYYY-MM` → per concentrator → per job: `earned_to_date`, `billed_to_date`, `billable_now`, suggested `line_kind`. The review/preview screen; shows charges + proposed reconciliations.
- `POST /api/billing/run { period, service_area_ids[], exclude_item_keys?[] }` → one **draft** invoice per concentrator from `billable_now` lines (period-stamped, SA/EC set); `exclude_item_keys` drops reconciliation (or any) lines you don't want. Transactional.
- Draft invoices remain fully editable (add/remove lines) until finalized — so deleting a reconciliation line "if we decide not to reconcile" is just editing the draft.
- Milestone convenience: `POST /api/service-areas/:id/bill` and `POST /api/service-area-routes/:id/bill` are thin wrappers that run the ledger scoped to that SA / route.
- `GET /api/billing/report?group=client|ec|program|month` from the new links (also fixes the task-34 program-revenue split).

## UI (fan to C2 after backend lands)
`billing.html` reworked: month picker → concentrator worklist (earned / billed / billable per job, charges vs reconciliations) → "Generate drafts" → editable draft invoices (drop lines, adjust) → invoices list + report. Closed-month badges. Drop the project-based paths.

## Out of scope (deliberate)
- PDF / sending (HOLD, Phase 4). This build yields correct **draft** invoice records.
- **Map-driven** footage completion — uses a manual completed measure now; map feeds it later with no billing change.
- Auto-scheduled monthly runs (manual trigger now). Real invoice numbers (Phase 4).

## Confirm before I build (3 points)
1. **Rates:** a single rate per discipline-job covers "different roles bill differently" (each discipline = its rate), **or** do multiple roles work one job at different rates (→ I'd model rate per role/line)? My default: **rate per discipline-job** (simplest, matches current schema). ⟵ the one I'm least sure on.
2. **Footage completed measure (interim):** OK to bill footage against a **manually-set completed quantity** until the map lands (then map feeds the same field)? 
3. **Ledger model itself:** does "bill `earned − already-billed`, negatives = deletable credits" match how you think about it? If yes, everything above follows.

## Sequence once confirmed
(a) migration 0066 → (b) ledger engine + worklist/run/milestone/report endpoints (CEO, tested vs dev DB: progressive footage across 3 months, monthly hours isolation, catch-up, reconciliation credit, no-double-bill) → (c) program-financials onto the new links → (d) fan `billing.html` to C2 → (e) retire legacy project billing at cutover.
