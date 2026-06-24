# Admin → Cluster cutover inventory (keep / migrate / drop)

> **Purpose:** HANDOFF §6 step 1. What legacy `public/admin.html` (9.8k lines, tabs: dashboard · projects · permitting · design · inspection · potential-permits · hours · clients · billing · revenue) still does that the **operations cluster** doesn't yet — so we can settle, WITH Carter, what gets retired, ported, or dropped before redirecting `admin.html` to the cluster.
>
> Method: compared admin.html's tabs + the endpoints it calls against the cluster pages/JS (`dashboard_overview`, `service_areas_ui`, `pipeline_board`, `billing_view`, `money_view`, `hours_view`, `job_board`, `clients`, `people`, `settings*`, `audit`). Decision-altitude, not an exhaustive line audit. Last updated 2026-06-24.

## Legend
- **RETIRE** — cluster already covers it; drop the legacy tab once data flows through the new model.
- **CLOSE-GAP** — partially covered; finish the cluster side, then retire.
- **MIGRATE** — legacy-only and needed; must port to the cluster before cutover.
- **HOLD** — keep legacy reachable on purpose until a planned replacement lands (don't port twice).
- **DROP?** — candidate to kill outright; **Carter decides**.

## The table

| Legacy feature (admin.html) | Cluster today | Call |
|---|---|---|
| **Dashboard** (KPIs) | `dashboard.html` (KPIs, needs-attention, period filter) | **RETIRE** |
| **Projects rollup tree** (`/api/projects` CRUD, project detail) | Replaced by keystone `service_areas` + `service_area_jobs` (`service-areas.html` + `area.html`) | **RETIRE the UI**; legacy *data* = decision #1 below |
| **Hours view** | `hours.html` (per-person, presets, CSV export) | **RETIRE** |
| **Revenue / margin / aging** | `money.html` (margin, aging, statements, program-financials, revenue rollup) | **RETIRE** |
| **Pipeline** (permitting/design status) | `pipeline.html` (`/api/service-area-pipelines`, keystone) | **CLOSE-GAP** — cluster pipelines the *new* model; depends on projects-data decision |
| **Billing** (`/api/billing/batches`, bill-multiple, report) | `billing.html` is the **legacy project-based** UI relocated (calls `bill-multiple`, `/api/projects/`, `preview-makeup`); keystone billing is the separate per-SA `POST /api/service-areas/:id/bill` | **CLOSE-GAP → real work:** cluster billing must move onto the keystone SA-bill path since projects are being retired (decision #1). Today only the per-SA "Generate invoice" button drives keystone billing — needs a proper cluster billing surface. Tangled with invoice-gen HOLD (#3). |
| **Clients** | `clients.html` (read-only; **C2 R10 adding create/edit**) | **CLOSE-GAP** (in flight) |
| **Hours CSV importer + review queue** (`/api/hours/csv-validate · csv-commit · csv-review-queue`) | — none (cluster exports, doesn't import) | **MIGRATE** — this is the hours *data-entry path*; highest-priority port (decision #2) |
| **Invoice generation + PDF** (`/api/invoices/generate-pdf`, preview-makeup, AI-vision template) | `invoices.html` is read-only list + drill-in | **HOLD** until ROADMAP Phase 4 simple configurable template, then replace (decision #3) |
| **User / account management** (`admin_users.js`, `/api/users`, roles, portal access) | `settings_portal_access.js` / `settings_staff_view.js` exist; people.html read-only | **CLOSE-GAP or MIGRATE** — confirm account create/role-edit lives in cluster settings |
| **Budgets / budget-codes** (EC-level) | — none | **DECIDE: MIGRATE or DROP?** (decision #4) |
| **Pricing / project-types / jobs catalog** (`pricing_settings`, `project_types`, `jobs_settings`) | settings sub-modules exist | **CLOSE-GAP** — confirm reachable from cluster `settings.html` |
| **Potential permits / permits / inspection tabs** | keystone jobs carry permitting/design/inspection disciplines, but dedicated permit + potential-permit tracking is legacy | **DECIDE: MIGRATE or DROP?** (decision #5) |
| **AI assistant** (`/api/ai/chat`, ai/upload) | — none in cluster | **DROP?** — Carter decides if it survives the cutover |
| **Setting-requests approval workflow** (`/api/setting-requests`) | — none | **DROP?** — niche; Carter decides |
| **RUS / project projection** (`/api/automation/*`) | — none in cluster | **DECIDE: MIGRATE or DROP?** — ties to the inspection-revenue-projection feature |

## Decisions — SETTLED 2026-06-24 (Carter)
1. **Legacy `projects` data:** **NOT migrated.** Archive read-only or delete entirely — Carter's fine with either. *(CEO rec: archive read-only first since it's real RUS/government revenue history; delete later once nothing references it.)* → **no data-migration project; just a read-only archive or removal at cutover.**
2. **Hours CSV importer:** **MIGRATE (port to cluster).** It's the live hours data-entry path. Must re-point it to attribute hours to the keystone `service_area_jobs` / `time_entries` model, not the legacy projects tree.
3. **Invoice generation:** **HOLD then replace** — keep legacy reachable until the ROADMAP Phase-4 simple configurable template ships, then cut over.
4. **Budgets / budget-codes:** **MIGRATE with rework.** Carter still wants budget tracking but the legacy implementation was poor — needs a redesign pass on the keystone model (EC-level + per-service-area budgets), not a straight port.
5. **Permits / inspection / RUS projection:** **MIGRATE with rework + re-evaluation.** Projections are important and must be kept/improved. **Potential-permits is ALREADY done** in the cluster pipeline section — drop it from the port list. Remaining: permits tracking, inspection, and the RUS/project projection engine — rethink the design as we port.
6. **AI assistant + setting-requests approval workflow:** **KILL.** Do not carry into the cutover; remove the routes/UI/code once dependencies are clear.

## Sequencing (decisions landed)
Foundation done (keystone model + write endpoints). Order:
- **(a) CLOSE-GAP (in flight / cheap):** clients+EC write [C2 R10] · billing batch-billing/report parity check · confirm settings/user-mgmt reachable from cluster.
- **(b) Hours CSV importer port** [#2] — **BACKEND DONE 2026-06-24** (`routes/hours_import.js` + `_hours_match.js`, validate+commit→`service_area_jobs`/`time_entries`, recompute, inline review-resolve; matching unit-tested 12/12 + integration-tested vs dev DB; mounted). **Remaining: the import UI** → fanned to C2 as R11. Persistent cross-session review queue (needs a small migration) deferred.
- **(c) Budgets redesign+port** [#4] and **Permits/inspection/projection redesign+port** [#5] — each needs a short design pass WITH Carter before building (he wants rework, not a straight port). Projections are the priority within #5.
- **(d) Kill** AI assistant + setting-requests [#6] — remove from cutover scope; delete code when safe.
- **(e) Cutover:** redirect `admin.html` → cluster, archive (or delete) legacy projects data, update the launcher tile. Invoice gen stays on HOLD until Phase 4 [#3].
