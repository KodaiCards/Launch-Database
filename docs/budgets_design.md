# Budgets rework — design for review (v1)

> Driver: cutover #4 ("migrate, still want it, legacy did poorly"). Re-points the RUS engineering-budget feature off the retiring `projects` tree onto the keystone (`service_area_jobs`), and uses the billing ledger for real utilization (billed + projected, not just an estimate). Last updated 2026-06-24.

## What budgets are (today) + why legacy fell down
- A **budget** is EC-scoped (`budgets.engineering_contract_id`, `total_amount`) — the RUS **engineering** budget for that contract.
- It's split into **budget codes** (`budget_codes`: `code`, `description`, `allocated_amount`, optional `job_id`) — the RUS billing codes, each with a dollar allocation.
- **Utilization** (`GET /api/budgets/:id/summary`): "spent" per code = earned revenue summed from **`projects` linked via `projects.budget_code_id`** (footage→expected_revenue, hourly→actual_hours×rate).

**Why it did poorly:**
1. **Stranded on the projects tree** — utilization joins `projects`, which is being retired. Keystone `service_area_jobs` have **no budget-code link**, so the keystone can't see budgets at all.
2. **"Spent" is an estimate, not actuals** — it sums expected/earned, with no awareness of what's actually been **billed**. No billed-vs-projected-vs-allocated picture.
3. Linking work to a code was manual project-by-project; no auto-suggest by discipline.

## The rework
Keep the shape that works (EC budget → RUS codes with allocations) but move it onto the keystone and make utilization real.

### Schema — migration `0069_budget_keystone.sql` (additive, idempotent)
```sql
ALTER TABLE service_area_jobs ADD COLUMN IF NOT EXISTS budget_code_id uuid REFERENCES budget_codes(id);
CREATE INDEX IF NOT EXISTS idx_saj_budget_code ON service_area_jobs (budget_code_id);
-- budgets stays EC-scoped; budget_codes unchanged (code/allocated_amount/job_id).
```
A keystone job optionally draws against a RUS budget code — the same idea as `projects.budget_code_id`, on the new model.

### Utilization, rebuilt on the ledger (per code)
For each budget code: 
- **allocated** = `allocated_amount`.
- **billed** = Σ `invoice_items.amount` of the code's `service_area_jobs` (non-void) — *actual draw-down* (from the billing ledger we shipped).
- **projected** = Σ `expected` of the code's jobs (`estimated_amount` or footage×rate) — *committed/forecast*.
- **remaining** = allocated − billed; **projected remaining** = allocated − projected; **over/under** flag when projected > allocated.

Rolls up to the budget total (allocated / billed / projected / remaining). This is the EC engineering-budget burn the projections overlay already shows — now broken out **per RUS code**.

### Auto-populate (Carter's "if X then Y", override-able)
When a job is added under a RUS EC, **suggest its budget code** from the EC's codes by matching discipline/job (`budget_codes.job_id` or a discipline map) — pre-fill, always overridable. Cuts the manual code-assignment that made legacy tedious.

### Endpoints
- Rework `GET /api/budgets/:id/summary` → keystone utilization above (drop the `projects` join).
- `GET /api/budgets?engineering_contract_id=` (exists) for the EC's budget; keep budget + code CRUD (exists).
- `PUT /api/service-area-jobs/:id` already edits jobs → accept `budget_code_id` (so the workspace can set/override a job's code).

### UI (fan to C2)
- **Budget setup** lives where the EC is managed — the EC panel in `clients.html` (C2 added EC CRUD in R10): set the engineering budget total + its RUS codes/allocations.
- **Utilization view** lives in **Money**, next to Projections (allocated / billed / projected / remaining per code + total; over/under coloring).
- **Per-job code** picker on the workspace (`area.html`) job rows (auto-suggested).

## Confirm before I build
1. **"Spent" = show both** actual **billed** (drawn-down) and **projected** (committed) against each code's allocation — yes? (Legacy only showed an estimate; the ledger lets us show both.)
2. **Auto-suggest code by discipline** when adding a job under a RUS EC (override-able) — match how you'd want it? And is the code↔discipline mapping reliable (e.g. one code per discipline per EC), or is it looser (assign manually with a suggestion)?
3. **Budget = engineering only** (RUS engineering services LFS bills), construction handled separately — correct? Or do RUS budgets also carry construction codes?
4. **Placement:** budget setup in the EC panel (clients) + utilization view in Money — good, or do you want it all in one place?

## Sequence once confirmed
(a) migration 0069 → (b) rework budget summary onto the keystone + `budget_code_id` on job create/edit + auto-suggest → (c) tested vs dev DB (per-code billed/projected/remaining, over/under) → (d) fan budget-setup + utilization + per-job-code UI to C2 → (e) the projections EC overlay gains the per-code breakdown.
