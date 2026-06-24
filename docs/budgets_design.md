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

## Resolved (Carter 2026-06-24)
1. ✅ Show **both** billed (drawn-down) and projected (committed) per code.
2. ✅ Auto-**suggest** the code by discipline, **manual override** always.
3. ✅ **Two separate budgets:** the **engineering** budget (EC-scoped, RUS — this doc) **and** a separate **construction** budget. The whole service-area experience splits into **construction vs engineering sides** with fully separate data (costs, employees, materials, budgets) — neither bleeds into the other. → add `budgets.kind` (`engineering`|`construction`) and a `service_area_id` scope so construction budgets attach to the SA (or route); engineering budgets stay EC-scoped.
4. ✅ Setup: engineering budget in the **EC panel**, construction budget on the **service area**; utilization in **Money** and surfaced in the SA view.

## Bigger picture this opened — the SA construction/engineering split view
Carter's vision for the service-area detail (mockup being built, then a dedicated design doc):
- Click an SA → **popup with the interactable map + three totals: construction cost · engineering cost · combined.**
- Click **Construction** → detailed view: **materials used so far + construction management (progress bars) + projected vs actual cost**, for the whole SA. Click a **route** → same view scoped to that route (formatted like the SA page; pick your detail).
- Every detail viewport has a **Switch to Engineering / Switch to Construction** toggle. **Engineering** view mirrors the Construction format with its data: **hours + billing (design, footage billing, hours)**.
- This builds on the existing keystone `cost_category` (engineering vs construction by discipline), materials, routes, and the billing/projection ledgers. Construction budget = the new piece. Design doc to follow the mockup.

## Sequence once confirmed
(a) migration 0069 → (b) rework budget summary onto the keystone + `budget_code_id` on job create/edit + auto-suggest → (c) tested vs dev DB (per-code billed/projected/remaining, over/under) → (d) fan budget-setup + utilization + per-job-code UI to C2 → (e) the projections EC overlay gains the per-code breakdown.
