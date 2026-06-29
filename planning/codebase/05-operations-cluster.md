# 05 — Operations cluster (the "tool") — PARTIAL (backend read-APIs + nav)

> Mapped 2026-06-29. The operations cluster = the keystone UI Carter works in (branded "Projects"). This covers the read-API route modules + the shared nav. Done: money_view, cluster_views, search, hours_summary, my_work, app_nav. **Pending: routes/dashboard.js, export_bundle.js, + the HTML pages** (service-areas/area/billing/money/hours/pipeline/job-board/clients/invoices/settings/audit) → 05b.

## The cluster page set (from `app_nav.js` rail)
Rail links: **Dashboard · Projects (`service-areas.html`) · Pipelines · Billing · Billing (KS) · Job board · Hours · Import hours · Money · Clients · Invoices · People (admin-only) · Training (→training-admin) · Audit log · Settings · Admin (admin-only)**. So "Projects" in the UI = the keystone `service-areas.html`. Rail is **role-gated client-side**: `data-admin-only` links render `display:none` and are revealed only after `/api/auth/me` confirms admin (fail-closed) — cosmetic; real gating is server-side per-endpoint. Rail also hosts **global search** (→ `/api/search`, 250ms debounce).

## `money_view.js` (334) — manager/admin, READ-ONLY, never leaks $ to non-managers
`/api/money/margin` (per-SA estimate vs billed + variance) · `/aging` (AR buckets 0-30/31-60/61-90/90+, excludes draft/void) · `/revenue?group=month|client|program` · `/statement?client_id=` (per-client SAs + invoices + buckets + outstanding) · `/invoice/:id` (drill-in) · `/program-financials` (RUS vs non-RUS) · `/invoices.csv` (accounting export). CSV cells guard **formula injection** (`=+-@` → prefix `'`). 
- **⚠ O16 (big architectural seam, flagged IN the code):** **invoices link to a CLIENT, not a service area** — `invoice_items.project_id` references the **legacy `projects`** table, and the keystone SA-bill (chunk 03) inserts items with `project_id = NULL`. So there is **no clean invoice→service_area join.** Consequences: "billed per area" is derived from `service_area_jobs` (status='billed'/billed_date), NOT from invoices; `program-financials` **cannot attribute invoice revenue per program** (returns job-based only, to avoid an N× fan-out). → The invoice/billing layer is still legacy-projects-oriented while the work model is keystone. This is the core billing-model debt; ties to O15 (3 billing paths). Resolve at chunk 07.

## `cluster_views.js` (67) — `/api/cluster/invoices` (filterable list) + `/api/cluster/clients` (clients w/ active_area_count, total_billed, outstanding). Clean.
## `search.js` (52) — `/api/search?q=` → service_areas + clients + invoices (ILIKE, 10 each). Powers the rail search. **Does NOT search jobs or people** (idea: extend).
## `hours_summary.js` (133) — `/api/hours/summary[.csv]` per (staff, job), **NEVER dollars** (labor view). Source = time_entries ⋈ service_area_jobs (keystone only; `te.service_area_job_id IS NOT NULL` → legacy-projects hours excluded). CSV groupable by person/client/area. "— Unattributed —" bucket for null staff. Feeds people.html's Hours column.
## `my_work.js` (142) — caller-scoped, hours-only: `/api/my/jobs` (assigned via assigned_user_id OR linked staff_id), `/api/my/hours` (Mon–Sun weekly recap), `/api/my/entries` (recent). **This is the field/contractor + 1099-app base (System D groundwork)** — the timeclock/my-work surface.

## Flags / findings
- **O16 (new): invoices ↔ service areas are not linked** (invoice_items → legacy projects; keystone bill creates orphan items). Split-brained billing attribution. Highest-value billing finding so far. → open_items.
- Hours views are keystone-only (legacy-projects time entries don't show in /api/hours/summary) — fine post-cutover, but during coexistence some hours could be invisible here. (minor, note for cutover)
- search scope could include people/jobs (small idea).
- Money math all server-side ✅; CSV injection guards ✅; manager/admin gating ✅.

## Reapproach-if
- Chunk 07 (billing): O16 + O15 — reconcile invoices↔SA + the 3 billing paths; this is the big one.
- 05b: read routes/dashboard.js (legacy dashboard vs keystone /api/dashboard/overview), export_bundle.js, + the cluster HTML pages (verify which endpoints each calls; user-test the live pages).
- Chunk 09 (hours): my_work is the field surface → System D (1099 app) builds on it.
