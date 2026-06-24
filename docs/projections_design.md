# Revenue projections — design for review (v1)

> Driver: HANDOFF cutover #5 (projections, "important, keep + improve"). Projects **remaining revenue** per concentrator / EC / client on the keystone model, using engineering-budget burn rate + known close-out work, with a two-stage completed→final lifecycle and strict modularity (never merge work across client / EC / program / time). Map tab is the deferred consumer. Last updated 2026-06-24.

## Carter's requirements (2026-06-24)
- **RUS** projects have an **engineering budget**; project revenue mostly via **burn rate** of that budget.
- Some jobs are **close-out** — billed only at the **end** (e.g. *updating plant records*, $850, billed at the end of **each route**; footage **preloaded from the map**). Their projection must be **accounted for** even though unbilled.
- Need a **"completed"** stage **between** in-progress and **"final"**: build done = *completed*; post-completion work (e.g. **final inventory**) happens after; when everything's truly done = *final*.
- **Modularity:** same geographic area worked for an EC, then years later as **BAU (no EC)** → those jobs + maps must **not** combine. Multiple **clients** in one area → not combined **unless we choose to**. Keep it modular.
- An **overall map tab**: select clients / service areas → see their jobs in that area.

## Lifecycle change: `active → completed → final`
Today routes/SAs have `build_finalized_at` (one finalize). Split into two milestones:
- **completed** = the *build* is done → keep `build_finalized_at` as this. Triggers build-complete billing (progressive footage final, build-complete fixed jobs).
- **final** = everything (close-out: plant records, final inventory…) is done → new **`closed_at`** on `service_area_routes` + `service_areas`. Triggers **close-out** job billing.

So a route can be **completed** (built, mostly billed) but not **final** (plant records / inventory still to bill). Projection counts the close-out work as remaining until `closed_at`.

## Job billing timing — `bill_trigger` (unifies billing + projection)
New `service_area_jobs.bill_trigger`:
- `progressive` (default) — billed as work accrues (hourly monthly; footage by completed qty). *Most jobs.*
- `build_complete` — billed once the route/SA is **completed** (`build_finalized_at`).
- `closeout` — billed once the route/SA is **final** (`closed_at`). *Plant records, final inventory.*

This refines the billing ledger already shipped: the "fixed earned when finalized" rule becomes "earned when its `bill_trigger` milestone is reached." Projection reads the same field to know what's still coming.

## Projection model
Projected total = **billed-to-date + projected-remaining**, computed per job then rolled up, **never merging across client/EC/program** (each concentrator is independent; rollups are opt-in by EC or client).

Projected-remaining per job by type:
- **Engineering (hourly, budget-bound, RUS):** the EC **engineering budget** is the cap. `remaining = max(0, engineering_budget − engineering_billed)`. **Burn rate** = engineering_billed ÷ months-elapsed → projected monthly run-rate + projected completion date.
- **Footage (progressive):** `expected_footage (from map) × rate − billed`.
- **Close-out / build-complete fixed/footage:** `known_amount − billed` (known_amount from map-preloaded footage × rate, or estimated_amount). Counts as remaining until its trigger fires, then it's billed.
- Non-RUS / no-budget work: `Σ estimated_amount − billed` per job.

EC/client rollup = Σ of its concentrators' projected-remaining (+ the budget-burn timing at EC level for RUS).

## Schema — migration `0067_projections.sql` (additive, idempotent)
```sql
ALTER TABLE service_area_jobs   ADD COLUMN IF NOT EXISTS bill_trigger varchar(20) NOT NULL DEFAULT 'progressive';
  -- CHECK in ('progressive','build_complete','closeout')
ALTER TABLE service_area_routes ADD COLUMN IF NOT EXISTS closed_at timestamptz;
ALTER TABLE service_areas       ADD COLUMN IF NOT EXISTS closed_at timestamptz;
-- Engineering budget: reuse existing budgets (EC-scoped, total_amount) + budget_codes.
-- (Whether a separate "engineering" budget number is needed = open Q2.)
```

## Endpoints
- `GET /api/projections/service-area/:id` → billed, projected-remaining, projected-total, per-job breakdown (with bill_trigger + which milestone gates it), and completion %.
- `GET /api/projections/ec/:id` → engineering-budget burn (budget, billed, remaining, monthly burn rate, projected completion date) + close-out/footage remaining + total.
- `GET /api/projections?group=ec|client|program` → rollup of projected-remaining (and budget burn where RUS). Modular: never merges across the grouping key.

## Modularity (mostly already true)
The keystone already isolates work: each `service_area` belongs to one client + optional EC + program, so the **same ground worked for an EC vs BAU = two separate service areas** — never merged. Projections + the map group by service area and roll up only by explicit EC/client. Combining is opt-in (you pick what to view together). No schema change needed for this; just don't write any query that merges by geography.

## Overall map tab (deferred — map is on hold)
The data is ready to drive it (every SA carries client/EC/program + `map_geometry` hook). When the map lands: a tab rendering all SAs, with client/SA selectors that surface that area's jobs. **Build now:** a `GET /api/map/service-areas` data endpoint (id, name, client, EC, program, geometry, status) so the tab is a thin render later. **Defer:** the actual map rendering until Carter's map arrives.

## Confirm before I build (the domain calls)
1. **Two-stage lifecycle:** `build_finalized_at`="completed" + new `closed_at`="final"; close-out jobs bill at `closed_at`. Right model/naming?
2. **Engineering budget source:** use the existing EC budget (`budgets.total_amount`, EC-scoped) as the engineering cap? Or is the engineering budget a *subset* (specific budget_codes / a separate number)? (This is also budgets-rework #4 — I can use the EC total now and refine with #4.)
3. **Close-out vs budget (the double-count question):** are close-out jobs (plant records, final inventory) **inside** the engineering budget (so `budget − billed` already counts them — projection just shifts their *timing* to `closed_at`), or **separate** line items added **on top** of the budget? This determines whether projection = budget-burn alone vs budget-burn **+** close-out amounts.
4. **Burn-rate window:** monthly burn = engineering_billed ÷ months since first bill (vs since EC start date)? And cap projected revenue at the budget (never project past it)?
5. **`bill_trigger` model** (`progressive`/`build_complete`/`closeout`) — does that capture how you decide when each job bills?

## Sequence once confirmed
(a) migration 0067 → (b) wire `bill_trigger` into the billing ledger (close-out earns at `closed_at`, build-complete at `build_finalized_at`) + the two-stage finalize actions → (c) projection endpoints (CEO, tested vs dev DB: budget burn, close-out remaining, completed-vs-final) → (d) `GET /api/map/service-areas` data endpoint → (e) fan projection + two-stage UI + (later) map tab to C2.
