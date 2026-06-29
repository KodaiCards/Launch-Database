# 16 — Legacy admin.html (THE CUTOVER SOURCE) — ✅ COMPLETE

> Mapped 2026-06-29 at inventory/wiring level. `public/admin.html` (9904 ln) = the OLD full admin monolith. **The point of this chunk: what's STRANDED here that the new operations cluster (chunk 05) doesn't have.** Answer (verified by which HTML loads each module): **ALL configuration/settings + several operational views are admin.html-ONLY, and the cluster's `settings.html` is a stub (loads only `app_nav.js`).** ⇒ the cutover is PARTIAL: daily-work views migrated to keystone; config + legacy views did NOT. **admin.html is still load-bearing — it CANNOT be deleted yet** (critical caveat for the pre-authorized legacy-delete).

## ⭐⭐ The stranded-features inventory (I2 — concrete)
Verified: each module below is loaded by **admin.html ONLY** (no operations-cluster page loads it). The cluster covers keystone daily work (service-areas, job-board, money, hours-import, clients, invoices); everything here is the gap.

| Stranded module (admin.html only) | Feature | New-UI status | Ties |
|---|---|---|---|
| `pricing_settings.js` | **`pricing_entries` rate config** (job×program×code→rate) | NOT in cluster | **I4** (the rate source lives only here) |
| `jobs_settings.js` | Job catalog CRUD (the D013 config table) | NOT in cluster | chunk 06 |
| `settings_portal_access.js` | **Portal access + capability grants** (`user_portal_access`, CAP_CREATE_PROJECTS) | NOT in cluster | chunk 10 |
| `invoice_templates.js` | **Reference-PDF→Claude template engine UI** | NOT in cluster | **I5** |
| `construction_contracts.js` | **CC + cost_catalog** (map pricing catalog, Excel upload) | NOT in cluster | chunk 12 map |
| `engineering_contracts.js` | EC management (RUS umbrella, budgets) | partial (clients.html has some EC, chunk 05) | chunk 06 |
| `settings_client_links.js` | `customer_clients` linking (customer↔client) | NOT in cluster | chunk 10 |
| `settings_staff_view.js` | Staff settings | People page exists (chunk 04) but settings here | chunk 04 |
| `admin_users.js` | **User CRUD incl DELETE** | People shows roster; full CRUD/delete here | **chunk 04** (the original stranded finding) |
| `migration_tools.js` | Data migration/admin tools | NOT in cluster | — |
| `client_portal_admin.js` | Client-org/token admin (v2 portal) | NOT in cluster | chunk 10 (O25) |
| `inspection_tab.js` | **RUS inspection rollup view** | NOT in cluster rail | chunk 08 |
| `revenue_tab.js` | Legacy revenue dashboard | cluster has Money (keystone) | chunk 07c (O18) |
| `billing_tab.js` | Legacy bulk-bill + **billing-status at-a-glance** | cluster has Billing/Billing(KS) | **I3** ("existed in old admin.html") |
| `design_potential_tabs.js` / `permits_tab.js` | Legacy design/permitting pipelines | cluster has Pipelines/Job-board (keystone) | chunk 08 (O18) |
| `held_timecards.js` / `unbilled_hours_panel.js` | Admin hours panels | NOT in cluster | chunk 09 |
| `training_admin.js` | Training admin (also has training-admin.html) | rail links Training | chunk 11 |

## ⭐ O30 — the operations-cluster `settings.html` is a STUB → no config UI in the new app
`public/settings.html` loads **only `app_nav.js`** (no settings content modules). So clicking **Settings** in the new operations cluster lands on a near-empty page; **all real configuration (pricing/jobs/portal-access/templates/CCs/client-links/staff) is reachable ONLY via legacy admin.html.** Consequences: (1) an admin living in the new UI must bounce back to admin.html to configure anything; (2) the I4 rate config + I5 template engine + capability grants are "backend-wired-but-no-new-UI" exactly as Carter suspected (I2). → open_items O30. (Verify on a live UI pass that settings.html truly has no inline content — grep shows only app_nav.js.)

## What admin.html IS (architecture)
- 9904-line monolith, `data-view` tabs: dashboard · projects (LEGACY tree) · design · permitting · potential-permits · inspection · hours · billing · revenue · clients. All LEGACY-projects-oriented.
- Loads ~45 scripts: the shared layer (app-shell, api, undo_bar, dialog, overlay_modal, focus_trap — chunk 15) + the per-feature modules above + project_picker/project_cascade/tree_state (the legacy rollup-tree UI) + audit_drawer/bulk_bill_modal/dashboard_layout.
- So admin.html = the legacy projects-tree admin + the ONLY home for config. The operations cluster (service-areas.html etc.) is the keystone replacement for the DAILY-WORK views only.

## Findings
- **⭐ I2 cutover inventory = CONCRETE (this table).** The stranded set is large: ALL settings/config + user-CRUD + client-org admin + legacy inspection/revenue/billing/pipeline views. The cutover isn't just data-model — there's a whole **config-UI migration** (settings.html → real modules) that hasn't started.
- **⭐ O30: settings.html is a stub** — the new UI has no config surface; admin.html is the only config home.
- **⭐ CRITICAL caveat for the pre-authorized legacy-delete (memory `project_training_launch_pivot` / Phase D):** admin.html **cannot be deleted** until pricing/jobs/portal-access/templates/CCs/user-CRUD/client-links are rebuilt in the cluster — deleting it now removes the ONLY way to configure the platform. Flag before any legacy purge.
- **I3 confirmed prior-art:** `billing_tab.js` (admin.html) holds the legacy billing view incl the "did I bill this" at-a-glance Carter wants rebuilt (I3).
- **I4 / I5 are reachable only in admin.html** — when surfacing them (I2 sweep), the work is "rebuild the UI in the cluster," not "build the backend" (backends exist: pricing_entries, invoice_template_engine).

## Reapproach-if
- Deep UI pass (deferred): read the key admin.html modules' actual UI (pricing_settings, billing_tab for I3, admin_users for the user-CRUD/delete) when Carter prioritizes surfacing them.
- Cutover planning: this inventory + O18/O25/O27 (data-model parallels) + O30 (settings stub) = the full cutover scope. The keystone Settings page needs: pricing, jobs, portal-access/capabilities, invoice-templates, construction-contracts/catalog, client-links, staff, user-CRUD.
- Verify live: does settings.html have inline content (grep says only app_nav.js → likely stub)? Does the new cluster have ANY inspection view (chunk 08 said no rail link)?
- Feed: update `ideas.md` I2 with this concrete inventory; I3/I4/I5 all point here for the UI work.