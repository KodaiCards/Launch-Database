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
| **Billing** (`/api/billing/batches`, bill-multiple, report) | `billing.html` + bulk-bill + unbilled-hours + per-SA `bill` endpoint | **CLOSE-GAP** — verify batch-billing/report parity with legacy before retiring |
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

## Decisions for Carter (the short list — the rest are mechanical)
1. **Legacy `projects` data:** migrate into the keystone `service_areas` model, or leave `admin.html` read-only as an archive during transition? (There's a `migration_tools.js` already — leverage it if migrating.)
2. **Hours CSV importer:** the #1 must-not-lose. Port to the cluster *before* cutover, or keep admin reachable solely for hours import until ported? (Recommend: port — it's the live data-entry path.)
3. **Invoice generation:** HOLD legacy until the Phase-4 simple template, then cut over (recommend), or port sooner?
4. **Budgets/budget-codes:** still used for EC-level budget tracking, or dead?
5. **Permits / potential-permits / inspection + RUS projection:** which migrate vs drop? (These are the RUS-heavy gov features — likely keep at least inspection/projection.)
6. **Outright DROP candidates:** AI assistant, setting-requests approval workflow — kill in the cutover, or keep?

## Sequencing (once decisions land)
Foundation already done (keystone model + write endpoints). Order: **(a)** finish CLOSE-GAP items (clients write [C2 R10], billing parity, settings/user-mgmt reachability) → **(b)** MIGRATE the hours CSV importer → **(c)** decide projects-data migration → **(d)** redirect `admin.html` → cluster, update the launcher tile. Invoice gen stays on HOLD until Phase 4.
