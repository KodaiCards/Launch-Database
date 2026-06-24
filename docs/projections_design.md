# Revenue projections — design for review (v1)

> Driver: HANDOFF cutover #5 (projections, "important, keep + improve"). Projects **remaining revenue** per concentrator / EC / client on the keystone model, using engineering-budget burn rate + known close-out work, with a two-stage completed→final lifecycle and strict modularity (never merge work across client / EC / program / time). Map tab is the deferred consumer. Last updated 2026-06-24.

## Carter's requirements (2026-06-24)
- **RUS** projects have an **engineering budget**; project revenue mostly via **burn rate** of that budget.
- Some jobs are **close-out** — billed only at the **end** (e.g. *updating plant records*, $850, billed at the end of **each route**; footage **preloaded from the map**). Their projection must be **accounted for** even though unbilled.
- Need a **"completed"** stage **between** in-progress and **"final"**: build done = *completed*; post-completion work (e.g. **final inventory**) happens after; when everything's truly done = *final*.
- **Modularity:** same geographic area worked for an EC, then years later as **BAU (no EC)** → those jobs + maps must **not** combine. Multiple **clients** in one area → not combined **unless we choose to**. Keep it modular.
- An **overall map tab**: select clients / service areas → see their jobs in that area.

## Lifecycle: `active → completed → final` (CONFIRMED 2026-06-24)
- **completed** (`build_finalized_at`) — build done and **all billing happens here**, including build-complete and **close-out** jobs (plant records, final inventory). The operational + billing end state.
- **final** (`closed_at`) — **archived/immutable**: nothing will ever change, still accessible read-only. **Not a billing trigger** — it locks the record after everything's billed + settled.

So close-out jobs bill **at completed**; `final` is the archive/lock.

## Job billing timing — `bill_trigger` (unifies billing + projection)
New `service_area_jobs.bill_trigger`:
- `progressive` (default) — billed as work accrues: hourly monthly, footage by completed qty. *Most jobs; e.g. Resident Engineer bills the entire lifecycle.*
- `completed` — billed once at **completed** (`build_finalized_at`). Covers build-complete fixed jobs **and** close-out jobs (plant records, final inventory).

Per-job + modular — each job picks its trigger. Refines the shipped billing ledger: "fixed earned when finalized" becomes "earned when its `bill_trigger` milestone fires." Projection reads the same field for what's still coming.

## Projection model (CONFIRMED 2026-06-24)
**The projection basis is the job's EXPECTED amount, known at creation** (footage/qty preloaded from the map × rate, or estimated_amount for hourly/fixed) — this holds for **both RUS and non-RUS**. Projected total = Σ expected; projected-remaining = **Σ (expected − billed)** per job. Computed per job, rolled up, **never merging across client/EC/program** (rollups opt-in by EC or client).

- **Every job:** `projected_remaining = expected_amount − billed_to_date`. Progressive jobs draw down as they bill; `completed`-trigger jobs sit at full expected until completion.
- **RUS engineering-budget overlay** (a *view*, not the base number — close-out jobs are **within** the budget so no double-count): show `engineering_budget` vs Σ projected-engineering vs billed, plus **burn rate** (engineering_billed ÷ months-elapsed) → projected monthly run-rate + projected completion date. Flags if projected runs over/under budget.

EC/client rollup = Σ of its concentrators' projected-remaining (+ the budget-burn pace at EC level for RUS).

## Schema — migration `0067_projections.sql` (additive, idempotent)
```sql
ALTER TABLE service_area_jobs   ADD COLUMN IF NOT EXISTS bill_trigger varchar(20) NOT NULL DEFAULT 'progressive';
  -- CHECK in ('progressive','completed')   -- close-out folds into 'completed'
ALTER TABLE service_area_routes ADD COLUMN IF NOT EXISTS closed_at timestamptz;  -- 'final' = archived/locked
ALTER TABLE service_areas       ADD COLUMN IF NOT EXISTS closed_at timestamptz;
-- Engineering budget: reuse existing budgets (EC-scoped, total_amount). Exact amount
-- doesn't matter yet (budgets get reworked in #4); the per-job expected amount is the base.
```

## Endpoints
- `GET /api/projections/service-area/:id` → billed, projected-remaining, projected-total, per-job breakdown (with bill_trigger + which milestone gates it), and completion %.
- `GET /api/projections/ec/:id` → engineering-budget burn (budget, billed, remaining, monthly burn rate, projected completion date) + close-out/footage remaining + total.
- `GET /api/projections?group=ec|client|program` → rollup of projected-remaining (and budget burn where RUS). Modular: never merges across the grouping key.

## Modularity (mostly already true)
The keystone already isolates work: each `service_area` belongs to one client + optional EC + program, so the **same ground worked for an EC vs BAU = two separate service areas** — never merged. Projections + the map group by service area and roll up only by explicit EC/client. Combining is opt-in (you pick what to view together). No schema change needed for this; just don't write any query that merges by geography.

## Information architecture (Carter 2026-06-24) — no new rail items
- **Projections = a tab inside Money** (`money.html`: Margin · Aging · Revenue · Program · **Projections**). It's a forward-looking financial view next to the actuals it derives from; manager/admin gated like the rest of Money. Backend endpoints unchanged — just where the UI lives.
- **Overall map = a tab inside Service Areas** (`service-areas.html`: **List | Map**). The aggregate map with client/SA selectors. The per-SA map stays in the workspace (`area.html`).
- **Lifecycle actions (mark completed / mark final)** live on the **workspace** (`area.html`) where the SA is managed — Money/Projections stays read-only.

## Overall map tab (deferred — map is on hold)
The data is ready to drive it (every SA carries client/EC/program + `map_geometry` hook). When the map lands: a tab rendering all SAs, with client/SA selectors that surface that area's jobs. **Build now:** a `GET /api/map/service-areas` data endpoint (id, name, client, EC, program, geometry, status) so the tab is a thin render later. **Defer:** the actual map rendering until Carter's map arrives.

## Resolved (Carter 2026-06-24)
1. ✅ Lifecycle: `completed` (build_finalized_at) where build-complete **and close-out** jobs bill; `final` (closed_at) = archived/immutable/read-only, not a billing trigger.
2. ✅ Budget amount doesn't matter yet — use existing EC budget; refine in #4.
3. ✅ Close-out jobs are **within** the budget → projection = per-job `expected − billed` (no double-count); budget is an overlay/pace view.
4. ✅ **Projection base = the job's expected amount, set at creation** (footage/qty × rate), for RUS *and* non-RUS.
5. ✅ `bill_trigger` = `progressive` | `completed` (RE is progressive across the lifecycle; plant records/final inventory are `completed`); per-job + modular.
- Remaining detail: burn-rate window (since first bill vs EC start) — I'll default to **since first bill** and surface it; tweakable.

## Sequence once confirmed
(a) migration 0067 → (b) wire `bill_trigger` into the billing ledger (close-out earns at `closed_at`, build-complete at `build_finalized_at`) + the two-stage finalize actions → (c) projection endpoints (CEO, tested vs dev DB: budget burn, close-out remaining, completed-vs-final) → (d) `GET /api/map/service-areas` data endpoint → (e) fan projection + two-stage UI + (later) map tab to C2.
