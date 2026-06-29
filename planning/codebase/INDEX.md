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
| 03 | **Keystone core** — service areas + jobs model | `routes/service_areas.js`, `concentrators.js`, migr 0064+ | P1 | ✅ → `03-keystone.md` |
| 04 | **People/roster** (just shipped) | `routes/people.js`, `staff.js`, `people.html`, `admin_users.js` | P1 | ✅ → `04-people.md` (people.js+staff.js+people.html; admin_users.js→ch16 legacy) |
| 05 | **Operations cluster** — the tool | cluster_views/money_view/hours_summary/my_work/search/export_bundle/dashboard + `public/service-areas.html, area.html …` + `app_nav.js` | P2 | ✅ first-pass → `05-operations-cluster.md` (backend full; HTML pages at wiring-level — deep UI pass deferred) |
| 06 | **Projects/jobs/contracts** | projects, jobs, contracts, engineering_contracts, clients, project_detail, project_types | P2 | ✅ → `06-projects.md` (06a catalog/clients/types · 06b contracts/ECs/projects-tree · 06c legacy projects.js+detail). Headline: rate-fallback ×10+ (D013/I4); O18 parallel tables |
| 07 | **Billing/invoices/money** | billing, billing_keystone, invoices, invoice_templates, revenue, projections, project_billing, pricing, budgets + invoice_generator/template_engine | P2 | ✅ → `07-billing.md` (engines O15/O16/O19 · invoice-PDF O20/I5 · projection/budget/pricing: **pricing_entries=rate config (I4 reframe)**, **projections.js has map/alloc engine already=I6**, keystone money-trio coherent; legacy dupes = cutover debt) |
| 08 | **Pipelines** — permitting/design/inspection | permits, design_pipeline, inspection, potential_permits | P2 | ✅ → `08-pipelines.md` (ALL legacy permit_stages/design_stages on project_id ⟂ keystone service_area_jobs.status=O18; potential_permits=design→permitting intake; inspection=RUS rollup view NOT daily paperwork → **O21 gap**; stages hard-coded) |
| 09 | **Hours/time** (TRUST-CRITICAL) | time_entries, hours_csv, hours_import, _hours_match + timeclock_module.js | P2 | ✅ → `09-hours.md` — **3 fixable causes of "don't trust hours": O23 split-brain (project_id ⟂ service_area_job_id; timeclock=legacy), O22 inconsistent silent rounding (timeclock 2dp vs manual/CSV 0.25-snap), O24 keystone importer no-dedup→re-import doubles. Positives: dedicated time_entry_audit, no-silent-loss, tz-correct.** |
| 10 | **Portals** — customer/client | customer_portal, client_portal(_v2), portal_access, impersonation + `customer.html, client/` | P2 | ✅ → `10-portals.md` (**O25** sprawl: 3 modules + 2 identity models; customer_portal=only keystone one; v2=token-org most complete. **I7** demo/dev-access=assemble v2-token+impersonation+flag. **I8** "future" customer features partly built. portal_access=capability grants. impersonation hardened) |
| 11 | **Training** — SPA + admin | `osp-training/` (router/components/lessons/catalog), `routes/training.js`, `training-admin.html` | P2 | ✅ → `11-training.md` (MECHANISM only, R18 honored). **Healthy + pivot-ready**: monotonic competency-gated progress (PASS=70), visibility-aware admin overview, preset-based flip (`user_training_access`+presets+overrides), signup→admin works. Cleanest/isolated subsystem. O26 curation≠security (minor) |
| 12 | **Map + splice** | `public/map/fiber_route_manager_v33.html`, splice, map_integration, _map_estimate, frm_storage_adapter.js | P2 | ✅ → `12-map-splice.md` — MAP engine BUILT@POC (map_store KV + computeEstimate + cost_catalog + SA.map_plan_id → projections; **I6 confirmed, roadmap=productionize/render/KMZ/materials-sync onto existing engine**; O27 KV-vs-relational fork). SPLICE = isolated 17k-ln tool (~17 splice_* tables, own auth/SSE/roadmap) scope-mapped |
| 13 | **Files/photos/workspace/DWG** | folder_workspace, dwg_sync(_two_way), project_photos/documents, downloads, file_activity + photos/workspace/offline-sync | P3 | ✅ → `13-files.md` — 6 file subsystems; **service-area-job-documents=project_documents.js** (permit_documents dual-keyed, 2GB DWG); **O28 HIGH** UPLOAD_DIR volume-mount data-loss risk (built-in /api/_debug/uploads detector); uploads hardened (magic-bytes); most subsystems legacy project_id |
| 14 | **Shared/infra** | `_helpers, _sse, _audit`, `db.js`, `db_migrations.js`, `lib/`, `scripts/` | P1 | ✅ → `14-shared-infra.md` (scripts/lib summary-level) |
| 15 | **Frontend shared** | `app-shell.css/js`, `app_nav.js`, api client, undo_bar | P2 | ✅ → `15-frontend.md` — AppShell design system (theme/topbar/sidebar/toast/modal/skeleton, accessible, XSS-esc); api() (cookie+Bearer, 401-bounce, XHR upload-progress); undo_bar wired end-to-end (→ **O14 is a small fix**); ~40 per-feature modules (Track 1.2 split); O29 CSRF/SameSite verify (low) |
| 16 | **Legacy admin** (cutover source — what's stranded) | `public/admin.html` + JS | P3 | ✅ → `16-legacy-admin.md` — **STRANDED-FEATURES INVENTORY (I2 concrete)**: ALL config (pricing/jobs/portal-access/templates/CCs/client-links/staff/user-CRUD) + legacy inspection/revenue/billing(I3) live in admin.html ONLY; **O30** cluster settings.html is a stub → **admin.html CANNOT be deleted yet** (guardrail for Phase D). Backends exist → work = rebuild UI |
| 17 | **Big legacy modules** (light — confirm dead/role) | `automation.js`, `portal_module.js` | PL | ⬜ |
| 18 | **Migrations + schema** | `migrations/`, `schema.sql` | P3 | ⬜ |
| 19 | **Desktop (Electron)** | `desktop/` | P3 | ⬜ |
| 20 | **Tests** | `tests/` | P3 | ⬜ |

*Adjust as I discover more. Each ✅ gets a `NN-area.md` file. Findings that change plans → `INVENTORY.md`; new feature ideas → `ideas.md`; gaps/questions → `open_items.md`.*
