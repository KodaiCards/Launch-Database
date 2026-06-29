# Codebase Map — INDEX (the total build, mapped first-hand)

> Owned by Planning. **Goal (Carter 2026-06-28):** map the entire build first-hand, **down to how every piece interacts**, so Planning can monitor/instruct the CEO, **instantly know how a feature he suggests fits + the best way to build it**, and proactively recommend features (built or not). **Multi-session marathon** — notes live here so they survive compaction. Last updated 2026-06-29.

## Method (how each chunk is mapped)
- **Small chunks**, one subsystem/file-cluster at a time → its own notes file `planning/codebase/NN-area.md`.
- Each note captures: **what it does · how it WIRES to other pieces** (who calls it, what it calls, data in/out) **· data/tables touched · my THOUGHT PROCESS** (what I expected, what I found, *why* I read it this way) **· flags/risks/gaps · open questions · "reapproach-if" triggers.** Not dry facts — the reasoning, so a later me can tell if something was missed *because I didn't think of it then*.
- **Build on existing docs, then verify vs code** (don't re-derive): `docs/route_index.md`, `docs/feature_inventory.md`, `docs/security_model.md`, `docs/MONDAY_DEMO_SCRIPT.md` are starting maps — confirm each against the actual code (plan-vs-built).
- **Reapproach:** when a later chunk changes a prior conclusion, **go back and update that chunk** + mark it ♻️. Iterative, not one-pass.
- **Depth: EXHAUSTIVE, including dead code** (Carter 2026-06-29 — overrides my earlier "skip legacy"). Dead/legacy code is mapped too because it reveals the program's **history**: started-but-unfinished ideas, abandoned directions, and cleanup candidates (Carter wants dead code *gone* anyway). For each dead area note: what it was · why it likely died/abandoned · salvage-or-delete. **Nothing is skipped.**
- **CEO is PAUSED during the map** (Carter) → I map a *frozen state*; no moving-target churn. (Reapproach still applies when a *later chunk* changes how I'd read a *prior* one.)
- **Pair user-test with code:** for user-facing areas, also drive the live app and note behavior-vs-code (the third leg). Bar = **"nothing can break"** — flag every fragility/risk, not just gaps.

## Resume protocol (after compaction / new session)
`PLANNING.md` → this INDEX → the checklist below → continue the next ⬜, or any ♻️. Each chunk file is self-contained.

## Coverage checklist
Status: ⬜ not started · 🔄 in progress · ✅ mapped · ♻️ reapproach needed. Priority: **P1** spine/foundation · **P2** active systems (we build on these) · **P3** breadth · **PL** legacy/light-touch.

| # | Area | Key files | Pri | Status |
|---|---|---|---|---|
| 01 | **Spine** — boot, middleware order, route mounts, PORTAL_DEFS/launcher | `server.js` | P1 | ✅ → `01-spine.md` |
| 02 | **Auth** — JWT, roles, requireAuth/Admin/Manager, signup/register | `auth.js` | P1 | ✅ → `02-auth.md` |
| 03 | **Keystone core** — service areas + jobs model | `routes/service_areas.js`, `concentrators.js`, migr 0064+ | P1 | ⬜ |
| 04 | **People/roster** (just shipped) | `routes/people.js`, `staff.js`, `people.html`, `admin_users.js` | P1 | ⬜ |
| 05 | **Operations cluster** — the tool | cluster_views/money_view/hours_summary/my_work/search/export_bundle/dashboard + `public/service-areas.html, area.html …` + `app_nav.js` | P2 | ⬜ |
| 06 | **Projects/jobs/contracts** | projects, jobs, contracts, engineering_contracts, clients, project_detail, project_types | P2 | ⬜ |
| 07 | **Billing/invoices/money** | billing, billing_keystone, invoices, invoice_templates, revenue, projections, project_billing, pricing, budgets + invoice_generator/template_engine | P2 | ⬜ |
| 08 | **Pipelines** — permitting/design/inspection | permits, design_pipeline, inspection, potential_permits | P2 | ⬜ |
| 09 | **Hours/time** | time_entries, hours_csv, hours_import, _hours_match + timeclock_module.js | P2 | ⬜ |
| 10 | **Portals** — customer/client | customer_portal, client_portal(_v2), portal_access, impersonation + `customer.html, client/` | P2 | ⬜ |
| 11 | **Training** — SPA + admin | `osp-training/` (router/components/lessons/catalog), `routes/training.js`, `training-admin.html` | P2 | ⬜ |
| 12 | **Map + splice** | `public/map/fiber_route_manager_v33.html`, splice, map_integration, _map_estimate, frm_storage_adapter.js | P2 | ⬜ |
| 13 | **Files/photos/workspace/DWG** | folder_workspace, dwg_sync(_two_way), project_photos/documents, downloads, file_activity + photos/workspace/offline-sync | P3 | ⬜ |
| 14 | **Shared/infra** | `_helpers, _sse, _audit`, `db.js`, `db_migrations.js`, `lib/`, `scripts/` | P1 | ⬜ |
| 15 | **Frontend shared** | `app-shell.css/js`, `app_nav.js`, api client, undo_bar | P2 | ⬜ |
| 16 | **Legacy admin** (cutover source — what's stranded) | `public/admin.html` + JS | P3 | ⬜ |
| 17 | **Big legacy modules** (light — confirm dead/role) | `automation.js`, `portal_module.js` | PL | ⬜ |
| 18 | **Migrations + schema** | `migrations/`, `schema.sql` | P3 | ⬜ |
| 19 | **Desktop (Electron)** | `desktop/` | P3 | ⬜ |
| 20 | **Tests** | `tests/` | P3 | ⬜ |

*Adjust as I discover more. Each ✅ gets a `NN-area.md` file. Findings that change plans → `INVENTORY.md`; new feature ideas → `ideas.md`; gaps/questions → `open_items.md`.*
