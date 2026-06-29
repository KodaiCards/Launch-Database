# 00 — SYNTHESIS: the whole-build map (executive summary for Carter)

> **Marathon complete 2026-06-29: all 20 areas mapped first-hand** (`01`–`20` + `14`), every structural claim schema-verified (chunk 18). This is the top-level read; each `NN-area.md` has the detail; `open_items.md` (O-series) + `ideas.md` (I-series) are the live registries. Written by Planning per Carter's "map every aspect of this build" directive.

## The one-paragraph picture
The platform is **mid-migration from a legacy `projects` rollup-tree to a keystone `service_areas`/`service_area_jobs` model**, and the single biggest theme is that the migration built **parallel** structures rather than migrating in place — so legacy and keystone coexist across tables, billing paths, hours columns, projections, dashboards, and even the UI (new operations cluster vs old admin.html). The **daily-work views** moved to the keystone; **all configuration + the RUS PDF + several operational views did NOT.** Two subsystems (**training**, **splice**) are cleanly isolated and healthy; the **core (projects/hours/billing/portals)** carries the cutover debt. The foundations are solid (auth, audit, migrations, upload hardening, the design system, the keystone money-trio); the risk is concentrated in the unfinished cutover + a few operational gaps.

## O-series RANKED by severity (act in this order)
**HIGH / verify-now**
- **O28 — UPLOAD_DIR volume mount (data loss).** If no Railway volume is mounted at UPLOAD_DIR, every uploaded doc/photo/2GB-DWG deliverable vanishes on redeploy. Built-in detector: `GET /api/_debug/uploads`. **30-second check; real client/RUS deliverables at stake.**
- **O20 — RUS PDF is legacy-only (#1 billing-cutover blocker).** The keystone billing ledger can create invoices, but the actual RUS PDF + invoice data assembly read only legacy `projects` → a keystone-billed invoice has no submittable government document. Must port invoice assembly to `service_area_jobs` BEFORE retiring legacy projects.

**HIGH-MEDIUM (the "I don't trust hours" cluster + billing correctness)**
- **O23 — hours split-brain** (verified): hours attach to EITHER `project_id` (legacy: manual + old CSV + timeclock) OR `service_area_job_id` (keystone), no DB constraint, separate views → **different totals on different screens.** The root of the distrust.
- **O22 — hours rounding silent + inconsistent** (test-locked = intentional): timeclock stores 2-decimal, manual/CSV snap to 0.25, editing a timeclock entry silently snaps it. **Policy decision for Carter** (silent-snap vs reject-non-grid).
- **O24 — keystone CSV importer has no dedup/billed-guard** → re-uploading a timecard doubles hours (legacy importer protects against this). Parity gap.
- **O15/O16/O19 — billing engine sprawl:** 5 invoice-creation paths (4 legacy + 1 keystone); canonical = `billing_keystone` ledger; the simple `:id/bill` makes orphan invoices; `/api/billing/report` is double-registered (legacy one dead).
- **O14 — keystone SA-delete** (verified, downgraded to medium): cascade-destroys jobs/routes/materials config with **no undo**, but hours survive (SET NULL) and billed SAs are FK-protected. **Small fix** (wire the existing undo bucket + UI).

**MEDIUM (cutover scope)**
- **O30 — no config UI in the new app:** settings.html is a stub; ALL config (pricing/jobs/portal-access/templates/CCs/client-links/staff/user-CRUD) lives only in legacy admin.html. **admin.html CANNOT be deleted yet.**
- **O18/O17 — parallel legacy/keystone tables** (the cutover's true scope): SA×3, contracts×2, dashboards×2, billing paths×5, hours columns×2, projections×2, tree×2. Needs ONE reconciliation map; cutover must PORT richer legacy features (sparklines, dedup), not just reroute.
- **O25 — external-access sprawl:** 3 portal modules + 2 identity models. Consolidate to v2-token-identity + keystone data.
- **O27 — map data is KV-JSON** (not relational): fine for estimate, limiting for materials-sync/multi-user. The map-productionization fork.
- **O21 — RUS daily field paperwork: confirmed NOT built** (greenfield gap → I9).

**LOW**
- **O26** training visibility = curation not security · **O29** CSRF relies on SameSite (verify) · **O31** hours-audit hard-deleted at 18mo vs general audit 3yr.

## The CUTOVER MAP (the ONE reconciliation that unblocks most of the above)
Legacy `projects` tree → keystone `service_areas`/`service_area_jobs`. To finish it:
1. **Hours:** pick one column (`service_area_job_id`), migrate legacy `project_id` entries, add the exactly-one CHECK (pattern: `budgets.budget_scope_exactly_one`), repoint all writers (manual/timeclock/importers) + views. Resolves O23/O22/O24.
2. **Billing:** make `billing_keystone` the only engine; **port invoice data assembly + the RUS PDF to `service_area_jobs`** (O20); retire the 4 legacy invoice paths; repoint money_view/revenue at keystone columns (O16); de-dup `/report` (O19).
3. **Projections:** port the richer legacy `automation.js` engines (sparklines/forecast/monthly-draft) onto keystone `projections.js`.
4. **Config UI:** build the keystone Settings page (pricing/jobs/portal-access/templates/CCs/client-links/staff/user-CRUD) so admin.html can retire (O30).
5. **Then** retire: legacy `projects`/`concentrators`/`ec_service_areas`, `revenue.js`, `billing.js`, `project_billing.js`, `invoice_generator` (after port), admin.html, bootstrapV3Schema. **Guardrail: don't delete admin.html until step 4.**

## Ideas (I-series) — much is ALREADY BUILT, just unsurfaced
- **I6 — the map/projection ENGINE exists ahead of the map** (contract-allocation per-mile, map-estimate via cost catalog, budget-burn). Map roadmap = render + KMZ-sync + materials-sync onto it, NOT build projections.
- **I5 — configurable invoice-template engine exists** (sample PDF → Claude vision → mustache → puppeteer) = the non-RUS per-client format need, already built.
- **I8 — "future" customer-portal features partly built** (customer_portal live, keystone /service-areas + invoices + admin client-progress).
- **I7 — demo/dev-access = assemble existing pieces** (v2 client tokens + impersonation + portal-mode flag), not a build.
- **I4 — rate config exists** (`pricing_entries`); the work is repointing ~6 hardcoded fallback copies at it.
- **I2 — stranded-features inventory = DONE** (chunk 16): the backends exist; the work is rebuilding UI in the cluster.
- **I3 — billing-status "did I bill this"** prior-art is in admin.html billing_tab.
- **I9 — RUS daily field paperwork** (the one real greenfield, O21).
- **I1 — scheduling/monthly-projection**: the detectors + projection math exist (automation.js); wire to a cockpit.

## Two isolated subsystems vs the entangled core
- **Healthy + isolated (safe to evolve independently):** Training (own schema, SPA, gating; pivot-ready) · Splice (26 tables, own auth/SSE; its own roadmap).
- **Entangled core (needs the cutover):** projects · hours · billing · projections · portals · files — all carry the legacy↔keystone duality.

## What's genuinely HEALTHY (don't touch / build on)
Auth (JWT + revocation + impersonation hardening) · the dual audit system (general append-only 3yr + dedicated per-hour `time_entry_audit`) · upload hardening (magic-byte + allowlist + IDOR) · migrations (79, versioned, checksummed, CI drift-validated) · the shared design system (AppShell, accessible) + undo infra · the **keystone money-trio** (billing_keystone ledger + budgets + projections — internally coherent, the right target) · the 64-file test suite (revises the QA-net concern down).

## Highest-leverage next moves (Planning's recommendation)
1. **O28** — verify the upload volume (minutes, data-loss).
2. **Hours unification** (O23/O22/O24) — directly fixes the trust Carter named; it's the keystone-cutover's first domino.
3. **Config-UI in the cluster** (O30) — unblocks retiring admin.html + surfaces I4/I5/I3.
4. **Billing port** (O20/O16/O15) — the RUS PDF onto keystone is the cutover's hardest blocker.
5. Decide **I9** (RUS daily paperwork) priority given the ~6mo RUS-sunset horizon.
