# PROJECT_NORTH_STAR.md — read this first

> If you are the next Claude (or a human picking up this code cold), read this top-to-bottom before writing anything. It captures what this project is, why it exists, what's been built, what's deferred, and what the owner cares about. Every section earns its place.
>
> **You are encouraged to deviate.** The methods described here are how prior sessions solved problems given the constraints they hit. If you see a cleaner path, take it — and update this doc. The owner cares about goals being met, not specific implementations being preserved. When you change methods, write down what you changed and why so the *next* Claude doesn't have to reverse-engineer it.

---

## 1. What this is

Launch Fiber Services is an OSP (outside-plant) fiber engineering firm in Macon, Georgia. It designs fiber networks for clients — PSC, COX, IFT, TRI-CO, Secure Vision. **PSC is just a client name** — they happen to give the shop a lot of RUS-program (USDA Rural Utilities Service) work, but they also send ordinary non-RUS work just like every other client. RUS is a program, not a client (see §3 domain primer below — this distinction has burned multiple sessions). The owner is Carter Trantham. He runs the firm and writes the company's project-management software himself, with Claude as the primary coding collaborator.

The software (this repo) is that internal platform. It manages:

- **Clients, contracts, engineering contracts** — the legal / billing umbrella structure. Engineering contracts carry a `program` field (`rus` / `bau` / `gfr` / `other`) that drives template selection and program-specific projections.
- **Projects** — design, permitting, inspection, and rollup containers, organized as a tree (`Client → Engineering Contract → Contract # → Service Area / WO → Team → Job`).
- **Time tracking** — hours logged via a dedicated time-clock portal, manually, or via CSV import. Tracks per-staff, per-project, per-day.
- **Permitting pipeline** — a five-stage workflow (potential → started → submitted → approved → checklist) per permit project, with paperclip document attachments.
- **Design pipeline** — similar pipeline for design work.
- **Billing** — invoice generation including a custom PSC RUS PDF generator (footage and hourly variants), bulk billing, billing batches, mark-billed / unbill / bill-and-clone. The RUS template is gated on `engineering_contracts.program = 'rus'`.
- **AI Assistant** — Claude tool-using chat that can create projects (single + bulk via `bulk_create_projects`), log hours, query data, advance permits, run admin SQL via `write_sql`, etc. Approval gate on every destructive action.
- **Audit log** — full timeline on every time-entry mutation.
- **Three portals served from the same codebase** via `PORTAL_MODE` env var:
  - `admin` — the full app at `launchfiberadminportal.xyz` (this is the bulk of the surface).
  - `design` — the Design portal at `launchfiberdesignportal.xyz`.
  - `permitting` — the Permitting portal at `launchfiberpermittingportal.xyz`.
  - `timeclock` — engineer clock-in/out at `launchfibertimeclock.xyz`.
  - `customer` — placeholder, deferred (see §6).

The deliverable mindset: **internal tool, owner-operated, no third-party users today.** Engineers and managers log in. Customers don't (yet).

---

## 2. The owner — how he works

- Domain expert in OSP fiber. Trust his calls on fiber counts, ribbon vs loose tube, ring cuts, color codes, closure models, billing rates.
- **Not formally trained in software.** Use plain language. Don't drop framework jargon without explaining it inline. He once said he didn't know the term "tech stack" — that's the level to write at.
- **Decisive when given concrete options.** If you have a question, give two or three options with tradeoffs, not an open-ended "what would you like?" Open-ended questions stall.
- **Likes data depth and granularity — does NOT want minimal builds.** Quote: *"I have never said anything bad about overengineering, I'm a data nerd and the more the better as long as its neat and clean in the UI and code."* When in doubt, build the richer model. The constraints are: (a) the UI stays neat and the code stays clean, (b) the work actually ships and ties to a real workflow he uses. "Future hooks for hypothetical features no one asked for" is still wasted work, but adding a `program` enum because it's the *correct* model — even if today it only has two practical values — is exactly his preference. Earlier copies of this doc said "hates over-engineering"; that was a mischaracterization.
- **Push directly to `main`, no PRs.** Railway auto-deploys all four services in 1–2 minutes. CI runs `node --test` + Playwright on every push. There is **no local Node** — verification path is push → Railway preview → click around the live app.
- **Pace: fix-and-go, push-and-keep-moving.** Don't sit on a 6-commit branch. Ship the smallest thing that works, but if "smallest thing that works" elides depth he wants, restore the depth.
- **NO worktrees.** GitHub Desktop confusion outweighs isolation benefit. Work in the main checkout.
- **Communication style:** owner drops bullet lists of issues, says "go," expects autonomy. Don't wait for re-confirmation between bullet items. They'll spot-check; if something's wrong they'll say so.
- **Whole-thing requests.** When he says "do the entire thing at once, don't stop. Check yourself as you go along," it's literal — execute end-to-end through the file list, self-verify between edits, and don't pause for approval mid-way unless you hit a real blocker. Surface blockers in the final summary, not by stopping.
- **GitHub Actions billing was paused for several days.** As of 2026-05-05 it's restored. CI gates every push again.

---

## 3. Domain primer — read this even if you think you know fiber

You'll write tools and PDFs wrong without this.

**Cable counts.** Common fiber counts: 12, 24, 48, 96, 144, 288, 432, 864. The shop regularly works on 432 and occasionally 864. Any tool that handles cables must remain readable at 432.

**Ribbon vs loose tube construction.** A ribbon is 12 fibers fused into a flat ribbon, mass-fusion-spliced 12 at a time as one unit. The shop uses ribbon construction heavily. Loose tube is each fiber spliced individually. UI for splicing must let designers grab a ribbon as a single object, not 12 fibers — that's a hard requirement.

**Ring cuts.** A mid-span access point where the cable jacket is opened, specific tubes/ribbons accessed (and either spliced out or stored in the closure), and the rest pass through untouched ("express"). Three lanes: **express**, **spliced**, **stored**.

**Fiber color codes — TIA-598.** Colors in order, both fibers in a tube and tubes within a cable:

1. blue · 2. orange · 3. green · 4. brown · 5. slate · 6. white · 7. red · 8. black · 9. yellow · 10. violet · 11. rose · 12. aqua

### Clients vs Programs — orthogonal axes (CRITICAL)

The DB models two independent dimensions, and earlier sessions repeatedly conflated them:

| Axis | Where it lives | Examples |
|---|---|---|
| **Client** (who the customer is) | `clients` table | PSC, COX, IFT, TRI-CO, Secure Vision |
| **Program** (what kind of work) | `engineering_contracts.program` | `rus`, `bau`, `gfr`, `other` |

A single client can have engineering contracts in multiple programs. **PSC in particular has BOTH RUS-program work (under "RUS 217 Engineering Contract GA 1706 - A72") AND ordinary BAU work** — same client, two completely different billing/reporting regimes. The distinction matters because the PSC RUS PDF template, the dedicated revenue projection, and the inspection-tab scope all gate on **program**, not on the client.

The legacy `clients.is_rus` boolean is preserved for backward compat as a hint flag ("this client does at least some RUS work") but is **not the source of truth for program classification**. Don't write new code that reads it as if it were. Every new RUS-vs-other gate must read `engineering_contracts.program`. The Path B refactor (2026-05-04) moved the existing gates onto `program`; if you find any leftover `is_rus`-driven gating in invoice / projection / inspection / job-filter code, that's a bug.

### PSC RUS billing structure

- One **engineering contract** umbrella: "RUS 217 Engineering Contract GA 1706 - A72" with loan name "Reconnect 3." `program = 'rus'`.
- Three **billing contracts** under it: 515-3 / 515-4 / 515-5 (aliased "Contract 3 / 4 / 5").
- Each contract has multiple **service areas / WO numbers** (Knoxville WO 16298, Cummings 16299, Crossroad School 16300, etc.).
- Each WO breaks down into **per-team** work — Permitting (DOT / RR / County) and Inspection (Inspection + Resident Engineer).
- The custom PSC RUS PDF generator (`invoice_generator.js`) renders this hierarchy as an invoice. Two variants: hourly (Inspection / RE) renders timecard pages; permitting (footage) renders summary only with footage formatted as `X.XX mi` if > 5280 ft else `X,XXX ft`. Gates on `ec.program === 'rus'`.

PSC's *non-RUS* work would live under a separate engineering contract on the same client with `program = 'bau'` (or whatever applies) and would NOT use the RUS template — that's why scoping matters.

**Rate baseline (typical defaults; actual rates live on `pricing_entries` per job × program × billing_code):**
- Inspection (RUS): $90/hr
- Resident Engineer (RUS): $100/hr
- Permitting (DOT/RR/County): $90/hr at 27.5 hr/mile (15-hr min)
- Design / Other: variable, prompted on creation

**Non-RUS-program work** needs its own invoice templates. Don't re-use the PSC RUS template. See memory `reference_invoice_non_rus_formats.md`.

---

## 4. Tech stack

| Layer | What |
|---|---|
| Backend | Node.js >=18, Express 4 |
| DB | PostgreSQL via `pg`, `gen_random_uuid()` from pgcrypto |
| Frontend | **Vanilla JS** (no React, no build step). Admin app is a single ~10000-line `public/index.html` SPA. Portals are standalone HTML files. Shared client modules in `public/js/*.js`. Shared CSS in `public/app-shell.css`. |
| Auth | JWT in cookies + `Authorization: Bearer` from `sessionStorage.lfs_token`. Roles: `admin`, `design_manager`, `permitting_manager`, `design_engineer`, `permitting_engineer`, `customer`. `req.user.staff_id` links a user to a staff record. |
| AI | `@anthropic-ai/sdk` v0.x, model `claude-sonnet-4-6`. Tool-using chat with approval gate. |
| PDF | `pdfkit` (invoice generator) and `puppeteer` (general HTML→PDF). |
| Uploads | `multer` to `UPLOAD_DIR` (Railway persistent volume). Daily orphan-file prune in `automation.js` + manual endpoint at `/api/_admin/prune-orphan-files`. |
| Deploy | Railway, four services (`admin`, `design`, `permitting`, `timeclock`) from one repo gated by `PORTAL_MODE` env var. |
| Tests | `node --test tests/*.test.js` for backend smoke + Playwright for browser. CI runs both on every push. |

---

## 5. Repo layout

```
server.js                      ~3200 lines — wiring + 3 still-inline blocks
                               (AI tools, hours CSV, v3 schema bootstrap)

routes/                        ~30 modules, one HTTP resource each
  _helpers.js                  shared backend utilities
  _csv_stage.js                shared csvStage Map
  ai.js                        AI chat, tools, approval gate (~1900 lines)
  hours_csv.js                 CSV import (validate + commit)
  projects.js                  project CRUD + recalc + with-hours / with-tree delete
  project_billing.js           mark-billed / unbill / bill-and-clone
  project_documents.js         file uploads per project
  permits.js                   permit pipeline + advance/regress + docs
  invoices.js                  invoice list + PSC RUS PDF generator
  invoice_templates.js         per-job-per-client PDF template upload + AI analysis
  billing.js                   bill-multiple + billing batches
  revenue.js                   manager+admin revenue queries
  reports.js                   /api/reports/{hours,billing}
  dashboard.js                 dashboard + active-list
  inspection.js                RUS-program scope view (program='rus' projects)
  design_pipeline.js           design pipeline advance/regress
  potential_permits.js         potential permits CRUD
  budgets.js                   /api/budgets/* + /api/budget-codes/*
  concentrators.js             concentrators (service areas with WO#s)
  contracts.js                 billing contracts + cascade delete + undo
  engineering_contracts.js     umbrella CRUD (carries the program field)
  clients.js                   clients CRUD
  staff.js                     staff CRUD
  jobs.js                      jobs CRUD + reset-override + propagate-rate
  project_types.js             project types CRUD (BAU/GFR/RUS/Other)
  pricing.js                   pricing + lookup + gaps
  time_entries.js              time entries CRUD + bulk + by-staff delete
  undo.js                      POST /api/undo/:token replay
  admin.js                     /api/_admin/{migrate-nesting, orphan-files,
                                            adopt-orphan, prune-orphan-files,
                                            hours-backfill, ...}
  customer_portal.js           /api/customer/* (deferred, mostly stubs)

public/
  index.html                   ~10000-line admin SPA
  design.html                  Design portal
  permitting.html              Permitting portal
  timeclock.html               Time clock portal
  customer.html                Customer placeholder
  login.html                   Shared login
  app-shell.css                Shared styles
  toast.js                     Toast helpers + global unhandledrejection handler
  keyboard.js                  Global keyboard shortcuts
  js/                          ~26 admin tab modules + helpers (api, undo_bar,
                               tree_state, overlay_modal, project_picker, etc.)

migrations/                    versioned SQL applied at boot via db_migrations.js
  README.md                    authoring rules
  0001_splice_schema.sql                       splice matrix tables (see §6.B)
  0002_engineering_contract_program.sql        program enum on engineering_contracts
  0003_drop_clients_is_rus.sql                 retire legacy clients.is_rus column
  0004_drop_project_types_table.sql            collapse project_types into program enum

automation.js                  scheduler + digest + orphan-file prune
db.js                          pg pool + initSchema
db_migrations.js               versioned migration runner
auth.js                        JWT auth + bootstrapAuthSchema
invoice_generator.js           PSC RUS PDF builder (pdfkit) — gates on ec.program='rus'
portal_module.js               PORTAL_MODE-conditional routes + ensureRollupChain
                               + isDuplicateProject + setting-change-requests
timeclock_module.js            /api/timeclock/* + audit logger
schema.sql                     base schema (still partially canonical;
                               server.js's bootstrapV3Schema also runs ALTERs)

tests/                         node --test backend smoke + Playwright browser
.github/workflows/test.yml     CI runs both on every push to main
```

---

## 6. Active deferred features — the carry-over list

These are scoped or partially started. Build only when the owner asks. Each block below explains *what / why / current state / how to revive*.

### 6.A Revenue projection logic — RETIRED 2026-05-05

**What it was.** Five tiles across the admin showing projected revenue: dashboard "Next 90 Day Projection," PSC RUS Revenue Projection card, Revenue tab "Projected Revenue" tile, and two tiles in the project-detail modal (Projected Revenue + Remaining). Plus an input field on the project create/edit form.

**Why retired.** The math was opinionated and the owner wasn't confident the numbers reflected reality. He decided to shelf the visible surface until the underlying logic is reviewed. Quote: *"Retire the projection logic for now. We will revisit it in the future."*

**Current state.**

- All five tiles render an `UNDER CONSTRUCTION` placeholder with a wrench icon.
- The project create/edit form's Projected Revenue input is `display:none` (still in the DOM so the existing save path works without changes — empty string saves as NULL).
- `loadInspectionProjection()` in `public/js/dashboard_views.js` is stubbed `return;` at the top. The original body is preserved inside a `/* */` block right below the early return so reviving is a one-line revert.
- Backend untouched: `/api/inspection`, `/api/revenue/projected-total`, `/api/automation/psc-rus-projection` still serve. `projects.projected_revenue` and `projects.expected_revenue` columns still populate via `calcProjectFinancials()` on every project create/update. `showProjectedList()` drilldown function still exists; just not reachable from the (no-longer-clickable) tile.

**To revive.**

1. Restore the dashboard tile gradient + value template (currently grey + UNDER CONSTRUCTION).
2. Un-comment the `loadInspectionProjection` body in `public/js/dashboard_views.js`.
3. On the Revenue tab tile, restore the `isYTD && projTotal > 0` condition + click handler.
4. On the project-detail modal, restore the Projected Revenue + Remaining tile templates (footage variant + monthly/container variant).
5. On the project create/edit form, set the Projected Revenue form-group `display: block`.

The math itself probably needs a second pass (the owner's concerns with the numbers were the trigger). Read `routes/revenue.js` and `automation.js`'s `psc-rus-projection` builder before reviving.

### 6.B Splice Matrix tool — SCOPED, schema written, not yet built

**What it is.** A visual splice planning tool for the design team. New full-screen page in the platform reachable from the Design Portal. Designers create a project, lay out cables and splice closures, drag fibers (or whole 12-fiber ribbons) to define splices, export a printable PDF for splicers in the field. Replaces an Excel-based workflow that doesn't match the topological nature of splice data.

The deliverable is a **PDF for splicers**. Splicers do not interact with the tool.

**Why deferred.** Scoped + designed in a prior session (2026-05-03) but the owner pivoted to other features. Schema is on disk, route module + canvas page + PDF endpoint not yet built.

**Current state.**

- `migrations/0001_splice_schema.sql` exists in this repo. It will auto-apply on next server boot via the runner in `db_migrations.js`. Tables: `splice_projects`, `splice_locations`, `splice_cables`, `splice_buffer_tubes`, `splice_fibers`, `splice_closures`, `splice_trays`, `splice_ribbon_groups`, `splices` (the join), `splice_closure_models` (organic picklist).
- The schema's CHECK constraints accept fiber counts in (12, 24, 48, 96, 144, 288, 432, 864). Construction type is (`ribbon` | `loose_tube`). Location type enum includes (`co | splice_point | fdh | terminal | ring_cut`) but Phase 1 only uses `splice_point`.
- The tool's a `splice_closure_models` table has columns `(model PK, default_tray_count, default_tray_capacity, use_count, last_used_at)` — it's intentionally empty; the closure-create UI is free-text + datalist that grows as designers type model names. Owner explicitly said *don't preload anything*.

**Six pre-build questions answered (don't re-ask):**

1. **Where in the design portal?** Full-screen `/splice.html` link from a third nav-tab, NOT an embedded view.
2. **Canvas library:** Konva.js. Render via CDN — no build step. Use layer caching, only redraw the dragged shape's layer, collapse-by-default to buffer tubes (one rect per 12 fibers), expand on click/zoom.
3. **PDF page size:** 11×17 (tabloid) default with optional custom override per project.
4. **Excel import:** No. All projects start fresh.
5. **Concurrent editing:** Yes, simple model — file lock acquired on open with locker name; second viewer sees "view only / take over" button. Committed actions broadcast via Server-Sent Events. Mid-drag is NOT broadcast. 10-min stale-lock timeout, 60s heartbeat.
6. **Closure models picklist:** Don't preload — let it grow from designer input.

**Phase plan.**

- **Phase 1** — vertical slice: create project → place one cable → one closure → one splice → save → click Export → get a PDF. Then widen to multi-cable, multi-closure, ribbon-as-unit drag, tray capacity warnings, project list, SSE broadcasts. Phase 1 replaces the Excel pain (~60% of the tool's value).
- **Phase 2** — topology + ring cuts. Add CO / FDH / terminal / ring_cut location types. Pathway tracing (graph walk over splices). Three-lane ring cut UI (express / spliced / stored). New table `splice_ring_cut_assignments` as **`0006_*.sql`** (the next free migration slot — 0001 splice schema, 0002 program enum, 0003 dropped is_rus, 0004 dropped project_types, 0005 seeded RUS pricing).
- **Phase 3** — polish. Templates, copy/paste between projects, validation rules (tray capacity, fiber spliced twice, color mismatch — warn, don't block), better PDF layouts.
- **Phase 4** — deferred. Don't think about it.

**Out-of-scope guardrails.** No FK relationships to existing project/billing tables (splice projects are standalone; only soft-link to `staff(id)` for designer attribution). No bill of materials. No splicer interaction surface (splicers receive a PDF, they don't log in). No client-facing views. No Phase 4 future-state architecture.

**Build order for Phase 1.**

1. Verify migration applied — push and watch Railway log for `[migrations] applied 0001_splice_schema.sql`.
2. Write `routes/splice.js` — vertical slice endpoints first (project CRUD, full-state hydrate, lock, heartbeat, cable+tube+fiber generator, closure+tray generator, single splice, ribbon-splice, closure-models picklist, PDF export). Wire into `server.js` near the route-module block. Match the existing route-module shape (try/catch returning `{error: e.message}` on 500).
3. Write `public/splice.html` — single-page Konva editor. Match the visual style + dark-mode tokens of `public/design.html`. Use the same `api()` helper pattern.
4. PDF export endpoint — puppeteer + HTML template. Crude is fine for Phase 1: cover page, one page per closure with a tray table listing splices, both fibers' cable name + tube color + fiber color + position. **Get the rough PDF in front of an actual splicer before investing in editor polish** — the editor can be perfect and the tool still fails if the document doesn't work in the field.
5. Add the Splice Matrix link to `public/design.html` nav as `<a class="nav-tab" href="/splice.html">…</a>` (no `data-view`, no `onclick` — it's a real navigation away).
6. Write `tests/splice.test.js` — round-trip a project, verify cable generates `fiber_count / 12` tubes + `fiber_count` fibers with correct TIA-598 colors at correct positions, verify lock/unlock/relock works, verify ribbon splice creates 12 splices linked to one ribbon group.

**Key auth/audit decisions.** Every endpoint goes through `requireAuth`; no role gate (any logged-in staff with a `staff_id` can use the tool — Design Portal already filters who reaches the link). No splice-side audit log preemptively — the time-entry audit pattern (`time_entry_audit` in `timeclock_module.js:111-125`) is the template if the owner asks later.

**Files to read before building:** `routes/jobs.js`, `routes/design_pipeline.js`, `db_migrations.js`, `migrations/README.md`, `public/design.html` (head + nav + api() helper), `public/app-shell.css`. Match conventions exactly.

**Pre-build state (2026-05-05 — owner is starting this work next, possibly via a fresh Claude on a VM).**

- **Migration slot to use for Phase 2 ring-cut tables:** `migrations/0006_splice_ring_cuts.sql`. Migrations 0001 (splice schema, already applied) and 0002–0005 (Path B + RUS pricing seed) are taken. Pick 0006 for any new splice work that touches new tables.
- **Migration 0001 (splice schema) is already applied in production.** Verify with `SELECT count(*) FROM splice_projects` returning a numeric (even if 0). The Phase 1 build can assume every splice table from `migrations/0001_splice_schema.sql` exists.
- **No Phase 1 routes or HTML exist yet.** `routes/splice.js` and `public/splice.html` do not exist. Server.js does not register them. The Design portal does not link to `/splice.html`. Phase 1 is greenfield.
- **Don't touch `public/design.html` more than the nav-link addition.** That file is a working portal for design managers; the splice link is a single `<a class="nav-tab" href="/splice.html">` insert, not a refactor.
- **Use `requireAuth()`** (no role gate) on every splice endpoint. The Design portal already gates who reaches the link; doubling up on roles would block design engineers who legitimately use the tool.
- **Do not link splice tables to `projects`/`contracts`/`engineering_contracts`/`clients`.** This was an explicit owner decision — splice projects are standalone. Soft-link only to `staff(id)` for designer attribution.
- **Konva via CDN.** No npm install, no build step. Pin a specific version in the `<script src=...>` so a Konva release doesn't silently break the editor.
- **Phase 1 deliverable test:** owner wants the rough PDF in front of an actual splicer before investing in editor polish. Whatever shape Phase 1 takes, prioritize getting a printable PDF out of the canvas state ahead of UI niceness. The PDF is the actual product; the canvas is a tool to produce it.

**If you're a fresh Claude on a VM picking this up cold, also read §7 "Verifying changes against the live deployed app" — the Claude-in-Chrome MCP setup gives you direct fetch() access to the deployed admin portal at launchfiberadminportal.xyz, which is invaluable for confirming a migration applied or an endpoint shape matches expectations. There's no local Node, so push-and-verify-via-Chrome is the canonical loop.**

**Post-Path-B polish landed 2026-05-05 (no impact on splice work, but useful context):**

- **Portal access from admin.** The admin shell now exposes the three sub-portals two ways: a `Portals` dropdown in the top-right header (between Approvals and AI Assistant) and contextual `Open Portal` buttons in the section headers of the Permitting, Design, and Hours tabs. All open `https://launchfiber{permitting|design|timeclock}portal.xyz/` in a new tab. Don't re-add a fourth surface — the existing two are enough. If the splice tool ever needs a portal-style link, mirror the same pattern (header dropdown entry + per-tab button) instead of inventing a new one.
- **Admin Design tab has parity with Permitting.** It now carries a stage filter (`#design-stage-filter`: potential / started / review_process / completed) and a `New Project` button (`showView('projects');openProjectModal('design')`). Stage-bar tiles are clickable and toggle the filter. Filtering is client-side in `loadDesign()` (`public/js/design_potential_tabs.js`); `/api/design` still returns the full list. If you add a stage to the Design pipeline, update both `DESIGN_STAGES`/`DESIGN_LABELS` in that JS module and the `<option>` list in `index.html`'s `#design-stage-filter`.
- **Rollups vs real projects.** As of the post-Path-B audit, every dashboard / revenue / count query that surfaces "projects" filters out `is_rollup=TRUE` containers. If you add a new query that counts or lists projects for any user-facing tile or table, include `AND COALESCE(p.is_rollup, FALSE) = FALSE` — otherwise rollup containers leak into "Active Projects" tile counts and "no projects in this category" feels broken when the count shows N. Centralized in `routes/dashboard.js`, `routes/revenue.js`, `routes/budgets.js`, `routes/clients.js`, `routes/engineering_contracts.js`, `routes/reports.js`. Splice projects are standalone (no `projects` row), so this doesn't apply to splice work, but it's the kind of thing easy to regress in adjacent features.
- **Permitting taper math.** `routes/_helpers.js#calcProjectFinancials` applies a tapered rate to permitting hours: random base 25-30 hr/mile for the first 2 miles, then drops 2 hr/mile/mile down to a 5 hr/mile floor. Manual rate override still works. Don't reach into permitting math from splice code.
- **Field-gating priority.** Project-create modal effective program is derived as: explicit `program` selection > selected contract's EC.program > client's EC mix. RUS and GF(R) both load RUS contracts + concentrators ("uses RUS infrastructure"); only RUS auto-loads RUS jobs ("uses RUS jobs"). BAU/Other use free-text Service Area. WO# is RUS-only. This logic lives in `applyProjectModalFieldGating()` in `index.html` and is mirrored in `design.html` + `permitting.html`. If splice projects ever need a similar gating concept, copy this hierarchy verbatim instead of inventing one.

### 6.C Customer self-service portal — deferred

Backend partially scaffolded (`routes/customer_portal.js` has 5 customer-facing GETs: `/me`, `/projects`, `/projects/:id`, `/invoices`, `/invoices/:id`). Admin-side wiring exists (`/api/admin/client-progress`, `/api/customer-clients/*`). Public HTML at `public/customer.html` is the placeholder.

**Don't start without explicit OK.** Owner will give the green light when the rest of the system has stabilized. When asked, the entrypoint is a real `customer.html` SPA that consumes the existing `/api/customer/*` endpoints, the new `customer_clients` linking table for "this customer can see these clients."

### 6.D Inspection revenue projection refinements — deferred

The PSC RUS 90-day projection logic had open math questions (which projects count, ongoing-vs-completed, monthly cadence overhang). Now subsumed into §6.A — when projections come back online, this is the work that needs doing first.

### 6.E Client progress view — admin-side per-client completion view — deferred

A Clients tab in admin that shows per-client project completion progress (% done, on-time vs late, projected hand-off date). Currently the tab renders an "Under Construction" panel; backend `/api/admin/client-progress` is live but the UI markup was stubbed out.

### 6.F Customer-portal project-level completion view — deferred

When the customer portal goes live (§6.C), each customer project surfaces a "% done / remaining / projected revenue / vs historical pace" panel. Same shape as 6.E but customer-facing.

---

## 7. Conventions — match these, change them deliberately

### Backend

- **Route module shape:** `module.exports = function installFooRoutes(app, pool, mw) { ... }`. Destructure `{ requireAuth, requireAdmin, ... }` from `mw`. Wire into `server.js` in the route-module block.
- **Every endpoint** is wrapped in `try/catch` that returns `{ error: e.message }` on 500. Don't break this pattern — the global JSON error handler at `/api` depends on it for clean fallbacks.
- **Auth pattern:** `requireAuth()` (any logged-in user), `requireAuth('admin')` (single role), `requireAuth(['admin','design_manager','permitting_manager'])` (multi-role), or the shortcuts `requireAdmin`, `requireManagerOrAdmin`. Always **call** the factory — `requireAuth()` not bare `requireAuth`. There's been a regression on this twice.
- **Customer scope guard:** customer-role JWTs can only reach `/api/auth/*` and `/api/customer/*`. Enforced by middleware in `server.js` near line 150. Don't bypass.
- **Schema changes** go in `migrations/NNNN_label.sql` per the runner in `db_migrations.js`. Do NOT add to `schema.sql` or the v3 bootstrap in `server.js` — that's two sources of truth, painful to keep in sync. The migration runner is the canonical path going forward. Latest migration: `0002_engineering_contract_program.sql`.
- **Idempotent SQL only:** `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, etc. A re-run on a partially-failed migration must not corrupt data.
- **Multer file uploads** stream to `UPLOAD_DIR` (Railway persistent volume). Daily orphan-prune scheduled from `automation.js`; on-demand at `/api/_admin/prune-orphan-files`.
- **Approval gate on AI mutations:** every destructive AI tool routes through `_pendingApprovals` Map. The frontend renders an approval card; user clicks Apply; AI loop resumes. Don't bypass — the pattern catches hallucinations.

### Program-vs-client gating (Path B, 2026-05-04, all phases complete)

The program enum (`'rus' | 'bau' | 'gfr' | 'other' | NULL`) is the canonical classifier across the system. NULL means "admin hasn't classified yet" — most behaviors should treat that as non-RUS.

- **`engineering_contracts.program`** — the source of truth for the umbrella's program.
- **`projects.program`** — set on each project; auto-derived from the project's EC at create/update time, falls back to caller-supplied or legacy free-text. Phase 3b column.
- **`pricing_entries.program`** — pricing keys directly on program (was `project_type_id` → `project_types.name`). Phase 3b refactor; the `project_types` table itself was dropped in migration 0004.

- **`clients.is_rus`** — RETIRED in migration 0003. Must not appear in new code. If you find it lingering somewhere, it's a bug.
- **`project_types` table** — RETIRED in migration 0004. The `/api/project-types` route still exists as a legacy compat shim (returns the program enum shaped as `{id, name, active}` rows for old dropdowns); writes return 410 Gone.

The PSC RUS PDF generator, the projection in `automation.js`, the inspection-tab scope (`routes/inspection.js`), and the project-create job filter (`routes/jobs.js`) all read `program`. The job-picker also accepts `engineering_contract_id` to scope precisely; falling back to `client_id` opens the picker up to BOTH `for_psc_client` and `for_generic_client` jobs when the client has mixed-program engineering contracts (PSC's case).

AI assistant: `getDBContext()` exposes `engineering_contracts` with their program; system prompt explains the client-vs-program distinction; `create_engineering_contract` / `update_engineering_contract` tools accept the `program` field.

Frontend project-create modal Project Type dropdown is a static program enum (rus|bau|gfr|other); Settings → Pricing groups by program.

#### Path B live verification log (2026-05-05)

After all five migrations (0001 splice schema, 0002 program column, 0003 drop is_rus, 0004 drop project_types, 0005 RUS pricing seed) deployed to production, an end-to-end audit was run against the live admin portal. Notable confirmed live:

- `clients` API response **does not include `is_rus`** — column gone for real.
- `engineering_contracts.program` populated for the existing "RUS 217 Engineering Contract GA 1706 - A72" row (backfilled by migration 0002's `name ILIKE '%rus%'` heuristic).
- `pricing_entries` carries `program` on every row (10 RUS-program rows seeded by migration 0005). `/api/pricing/lookup?program=rus` works; `/api/pricing/lookup?program=bau` returns null (expected — admin hasn't priced BAU work yet).
- `/api/project-types` legacy compat shim returns 4 program rows shaped `{id, name, active}`.
- `/api/jobs?client_id=PSC` returns the RUS-class job set; `/api/jobs?client_id=COX` returns the generic-class set; the mixed-program OR-mode is wired and ready for when PSC gets a BAU EC.
- Auto-derive of `projects.program` from the project's contract_id → engineering_contract is **confirmed live** — a project created without an explicit program field correctly inherits the EC's program.
- **PSC RUS PDF gate verified end-to-end with real data**: created a sandbox BAU EC + contract + project, hit all three RUS PDF endpoints (`/api/invoices/generate-pdf-from-projects`, `/api/invoices/generate-pdf`, `/api/invoices/generate-pdf/preview-data`), all three rejected with the exact program-mismatch error message specifying "program 'bau', not 'rus'" and pointing the user at Settings → Engineering Contracts → Program. Sandbox cleaned up; production state restored.
- Browser console clean during page load (only Chrome extension noise from MetaMask, no app errors). All ~15 API calls returned 200 OK.

### Frontend

- **No bundler, no modules, no transpilation.** Vanilla JS. Owner deploys via Railway nixpacks; build steps add risk.
- **Admin app `public/index.html`** is a single ~10000-line SPA. Tab loaders extracted to `public/js/<tab>_tab.js` modules use the IIFE + `window.X = X` export pattern so existing inline `onclick=` handlers keep working.
- **Match dark-mode tokens.** Hex literals are forbidden in new code; use the CSS tokens defined in `:root` (light) and `html[data-theme="dark"]` (dark). Token names: `--primary`, `--surface-1/2/3`, `--text` / `--text-secondary` / `--text-muted`, `--border-strong/weak`, `--success` / `--warning` / `--danger` / `--info` plus `-light` and `-text` variants.
- **API calls** go through the `api()` helper in `public/js/api.js`. Sends cookies + Bearer fallback from `sessionStorage.lfs_token`. 401 bounces to `/login`.
- **Approval cards** render via `renderApprovalCard()` in `index.html`. The card's content is a header + N action rows (each with checkbox + summary + raw JSON `<details>`) + footer (Reject all / Apply selected). Children of the chat container need `flex-shrink: 0` — a bug that bit us at 6d109f1.
- **Mobile breakpoints** at `≤640px` apply across admin + design + permitting portals (header tightens, modals fullscreen, stat cards stack, nav-tab icons hide). Timeclock has its own ≤600px breakpoint with thumb-friendly tap targets.
- **Engineering Contracts settings UI** carries a Program dropdown on both create and edit forms. The values map to the `program` enum (rus/bau/gfr/other) plus a `— Not set —` option that posts NULL.

### AI assistant

- **System prompt** lives at the top of `routes/ai.js`. Update it when behavior changes — the model follows it religiously. The current prompt has a "CLIENTS vs PROGRAMS — CRITICAL DISTINCTION" block; do not delete it without replacing equivalent content.
- **`tool_choice` flips to `'any'`** when `userWantsAction(messages)` matches a confirmation phrase (`yes`, `proceed`, `go`, `start`, `run it`, etc.) anchored to the start of the user's last message, OR a nudge (`did you start`, `why didn't you`, `just do it`, `c'mon`) OR an action verb (`create`, `add`, `update`, `delete`, `import`, `build`, `make`, `start`, `run`, `execute`, `generate`). Off-topic chitchat falls through to `'auto'`. The classifier is what makes the AI actually fire tools instead of writing prose forever.
- **Loop iterations after the first** stay on `tool_choice: 'auto'` so Claude can finalize with text after running a tool. `MAX_ITERATIONS = 15`.
- **Hallucination guard** fires if the final text claims an action (past/future/progressive tense) but no successful modifying tool ran. Appends a red warning to the response.
- **`max_tokens` per call: 8192.** Anthropic SDK refuses non-streaming requests above that threshold ("Streaming is strongly recommended for operations that may take longer than 10 minutes"). If you ever see that 500 in the wild, it's because someone bumped this number — drop it back to 8192 OR migrate the chat handler to `anthropic.messages.stream()`. The stream rewrite unlocks higher caps and is a worthwhile cleanup when you have an hour.
- **Bulk operations:** prefer `bulk_create_projects` over multiple `create_project` calls when scaffolding more than ~5 projects. The bulk tool uses `local_id` / `parent_local_id` for intra-batch parent refs and inherits `client_id` / `contract_id` / `concentrator_id` from the nearest ancestor (so the AI doesn't have to repeat UUIDs on every spec, which blew past max_tokens before the inheritance was added).
- **Diagnostic hook:** when `/api/ai/chat` would return an empty response (no text, no tool results), it carries a `_debug_empty` field with the raw `stop_reason` + content shape. Useful for debugging without redeploying.

### Workflow

- **Push directly to `main`.** No PRs. Railway redeploys.
- **No worktrees.**
- **Update this file (PROJECT_NORTH_STAR.md) and BUILD_PLAN.md** when work lands or new ideas surface.
- **Add a regression test** when: a class of bug recurred (silent typos, polling state loss, unguarded innerHTML), you shipped a load-bearing endpoint (PSC RUS PDF, billing flows, AI chat), or the test fits in <30 lines. Don't add a test for every CRUD update.

### Verifying changes against the live deployed app

Local Node isn't installed on the owner's machine, so the standard verify path is push → Railway → live preview. Two tools the owner explicitly OKs using on production:

1. **CI (GitHub Actions)** — runs `node --test` + Playwright on every push. Smoke tests boot a fresh Postgres, apply schema.sql + migrations, exercise the auth + main API paths. Use this for "did the SQL apply, did the routes parse." Watch via `gh run list --branch main` / `gh run view <id> --log-failed`.
2. **Claude in Chrome (MCP)** — there's a paired browser ("Browser 1", deviceId in the user's account) already authenticated to launchfiberadminportal.xyz as `ctrantham` (admin). To use:
   - `mcp__Claude_in_Chrome__list_connected_browsers` → pick the device → `select_browser`
   - `tabs_context_mcp` to get tabIds (the admin tab is usually open already)
   - `javascript_tool` with `action: 'javascript_exec'` to run `fetch()` against `/api/...` on the deployed URL — this is by far the highest-leverage tool for verification since you can hit any endpoint with the user's session cookie and read JSON back.
   - `computer` (screenshot, click, type) for visual checks of modals + tables
   - **Hard-reload after a Railway deploy.** Browser caches index.html; `location.reload(true)` or fetch `?_cb=...` to confirm the new bytes are served. Saw this exact issue during the Path B audit — a stale tab showed "PSC RUS" when the deployed HTML already said "RUS".

**Owner's policy on production data**: creating sandbox rows on production to verify a behavior is OK as long as you clean up afterward. The Path B audit created a temp BAU engineering contract + contract + project to verify the PDF rejection path, then deleted them in reverse-FK order (project → contract → EC). Use names with a clear `AUDIT-...` or `(sandbox - delete me)` prefix so anything that survives a crash is easy to find. Verify cleanup by re-fetching the IDs and confirming 404.

### Schema vs migrations interaction (lesson from Path B audit)

`schema.sql` runs on every boot (per-statement try/catch; idempotent constructs only). Migrations in `migrations/NNNN_*.sql` run once per filename via `db_migrations.js` and are tracked in the `schema_migrations` table.

**The trap:** `schema.sql`'s `IF NOT EXISTS` ALTERs and `CREATE TABLE IF NOT EXISTS` will resurrect anything a migration dropped. After Phase 3b dropped `project_types` + `pricing_entries.project_type_id`, schema.sql's old seed kept re-creating the table and ALTER-ing the column back on every Railway re-deploy, then the legacy DO-block seed failed because the column didn't match the seed shape. Caught in CI logs: `column "project_type_id" of relation "pricing_entries" does not exist` on every boot.

**Fix pattern**: when a migration drops something, also strip the corresponding `IF NOT EXISTS`/CREATE in schema.sql so the resurrection can't happen. Move any seed data that depended on the dropped column into a new migration keyed on the new column. The Path B fix lives in commits `755baa5` + `d0e3436` — the schema.sql cleanup + migration 0005 RUS pricing seed pattern.

**Migration tolerance pattern:** if a migration's backfill UPDATE references a table/column that schema.sql no longer creates on fresh DBs, wrap the UPDATE in `DO/IF EXISTS` against `information_schema`. Migration 0004's project_types backfill is the canonical example — it skips on fresh DBs but still backfills on existing production DBs that have the legacy table.

---

## 8. Common gotchas — things that have already burned a session

- **Conflating PSC (client) with RUS (program).** PSC is a client; RUS is a program. PSC has both RUS and non-RUS engineering contracts. Code that filters on `clients.is_rus` for program-classification purposes is wrong — switch to `engineering_contracts.program = 'rus'`. The Path B refactor (2026-05-04) cleaned this up across `automation.js`, `routes/inspection.js`, `invoice_generator.js`, `routes/jobs.js`, and the AI tools. The `clients.is_rus` column itself was dropped in migration 0003. If you find any leftover `is_rus` reference in NEW code, that's regressing.
- **`project_types` is a retired enum.** Programs (rus|bau|gfr|other) live as a fixed enum on `engineering_contracts.program`, `projects.program`, and `pricing_entries.program`. The `project_types` table was dropped in migration 0004 (Phase 3b). The `/api/project-types` endpoint still exists as a compat shim but returns the static program enum shaped like the old rows; admin can no longer add/rename/delete program values. If you see `project_type_id` in new code, that's regressing.
- **`requireAuth` factory called bare.** `app.get('/x', requireAuth, ...)` — wrong. `app.get('/x', requireAuth(), ...)` — right. The bare reference fires the factory once at boot and uses its return value as middleware, which still happens to *work* for `requireAuth` with no args, but breaks `requireAuth(['admin'])`. Two regressions of this fixed.
- **Schema dual source of truth.** `schema.sql` claims to be canonical but the `bootstrapV3Schema()` in `server.js` also runs ALTERs at boot. Track 1.4 plans to consolidate via `migrations/`. New schema work should ONLY go in `migrations/NNNN_label.sql` — never touch `schema.sql` or the v3 bootstrap.
- **Polling rebuild every 8s** in the admin app's tab loaders. New widgets that hold state across rebuilds need the `tree_state.js` primitive (`makeTreeState(name)`). The Projects tab's expand-state-across-poll is the canonical example.
- **`toast.js` global `unhandledrejection` handler** turns ANY unhandled async error into a popup toast. If a confusing toast appears, the actual stack is in the browser console (F12) — the toast text is whatever the rejection produced.
- **Portal HTML files** had orphan `<tbody>` inside `<div>` (Chrome's parser silently dropped them) and broke `getElementById`. Wrap any compatibility shim row in a `<table>` if you add one.
- **Multer error handler** previously read `err.field` and produced "File too large. Maximum size for this upload is pdf limited." Now maps field name to known caps (50 MB for invoice templates, 3 GB for general uploads).
- **Customer-role JWTs** could read every admin endpoint before 2026-05-04. The fix is the global middleware that gates customer JWTs to `/api/auth/*` + `/api/customer/*` only (`server.js` near line 150). Don't undo that.
- **`migrate-nesting`** used to silently DELETE every empty rollup folder. As of 2026-05-05 it requires `{confirm: true}` in the body; default is dry-run. Empty rollups are KEPT (owner explicitly asked).
- **Approval card collapsed to 3px** in flex-column container. `.ai-msg { flex-shrink: 0 }` is the fix; don't drop it.
- **Duplicate AI tool definitions.** `create_engineering_contract` had two separate definitions in `routes/ai.js` (early + EXPANDED TOOLS section) before Path B. Anthropic's API rejects duplicates. If you add a new tool, search the file for the name first.
- **AI generation latency.** A single `bulk_create_projects` with 99 specs takes ~50s on Sonnet 4.6. Don't add a frontend timeout shorter than ~3 min.
- **Railway proxy timeout = 5 min.** If the chat loop iterates many times with Anthropic API in between, the request can exceed this. The `MAX_ITERATIONS = 15` cap is the safety net.
- **Empty Anthropic responses** in production: usually `stop_reason='max_tokens'`. The `_debug_empty` field added in 29d6520 surfaces this on the response.
- **`schema.sql` resurrects what migrations dropped.** Idempotent `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS` happily re-create dropped objects on every boot. Whenever a migration drops a column or table, also remove the matching CREATE/ALTER from schema.sql. Caught in the Path B audit — `pricing_entries.project_type_id` was getting "fixed" on every Railway boot until commits `755baa5` + `d0e3436` fixed it. See §7 "Schema vs migrations interaction" for the pattern.
- **The split_statements regression test counts CREATE TABLE in raw text vs split statements.** A comment block that contains the literal phrase `CREATE TABLE` will inflate the regex count by one without producing a matching split statement, breaking the test. Avoid the keyword in schema.sql comments — say "the block below" instead. Bit twice during Path B (commits `9454ea9` and `d0e3436`).
- **Browser caches the admin SPA hard.** A Railway deploy can land on the server but a stale tab still shows the old HTML for hours. After every push, hard-reload (`location.reload(true)` or fetch with `cache: 'no-store'`) before declaring a UI change "live." Saw this exactly during the Path B audit: nav-tab text was "PSC RUS" in a stale tab while the deployed HTML already said "RUS".
- **Anthropic tool-schema validator dislikes `enum: [..., null]`.** Mixing a string enum with a literal null value is technically valid JSON Schema 7 but Anthropic's strict validator can reject it. For nullable enum fields, use `type: ['string', 'null']` and validate the enum server-side instead. Pattern lives in `routes/ai.js` create/update_project for `program`. Failed once during the Path B audit (commit `6600954`).

---

## 9. The four sibling docs (read order)

This file is the entry point. After you read it, branch into:

- **`BUILD_PLAN.md`** — owner's living per-feature-batch plan. Active feature work is logged here in the same per-track format. Update when work lands.
- **`README.md`** — Railway deploy steps, environment variables, file structure summary.
- **`migrations/README.md`** — migration authoring rules.
- **`tests/README.md`** (if it exists) — test-suite conventions.

---

## 10. To the next Claude — adapting this plan

You can change every method described here. The owner cares about goals being met: the system manages projects + hours + billing accurately, the AI assistant proposes destructive actions through an approval gate, the splice matrix tool replaces the Excel pain when it ships, projections come back online when the math is reviewed.

**You are encouraged to:**

- Replace the vanilla-JS admin SPA with a build-step framework if the codebase reaches a point where that's clearly the right move. (Today it isn't — the owner has been clear that build steps add risk and don't pay for themselves at this scale. But that calculus changes if the SPA reaches 20k lines or the team grows.)
- Re-architect the AI chat handler to use streaming if you want to lift `max_tokens` above 8192 cleanly.
- Consolidate the schema into a single source of truth via the migrations runner. Track 1.4 was scoped for this; nothing's blocking it.
- Pick a different canvas library for the splice matrix if Konva turns out wrong for your use case.
- Inline the deferred features (customer portal, projection logic) when the owner asks.
- Add data depth/granularity when it ties to a real workflow. The owner explicitly likes that — see §2.

**You are NOT encouraged to:**

- Build "future hooks" for hypothetical features no one has asked for. Modeling correctness is welcomed; speculative scaffolding for never-realized requirements is still wasted work.
- Bypass the approval gate for AI mutations. That's a load-bearing safety guarantee.
- Touch `schema.sql` or the v3 bootstrap. Use the migrations runner.
- Re-litigate the splice-matrix six-questions or the projection retirement. They're decided. Read §6.A and §6.B carefully before second-guessing.
- Reintroduce client-level program classification. RUS lives on the engineering contract, not the client. See §3 and §8.

**When the owner gives you a prompt:**

1. Read the prompt. Identify what they want.
2. Check this file's deferred-features list (§6) to see if it's already scoped.
3. Check `BUILD_PLAN.md` to see if it's already in flight.
4. Identify the smallest end-to-end slice that ships value — but if "smallest" elides depth he wants (see §2), restore the depth.
5. Build it. Test it. Push it. Tell the owner what landed.
6. **Update this file** if the result changes the architecture, conventions, or deferred-feature state.

You have full context now. Build well.

---

*Last updated 2026-05-05 — Path B complete (all four phases shipped + an audit pass that caught real bugs and verified the system end-to-end on production via Claude-in-Chrome MCP). Post-Path-B polish landed the same day: admin portal-access surfaces (header `Portals` dropdown + per-tab `Open Portal` buttons in Permitting/Design/Hours), Design-tab parity with Permitting (stage filter + New Project button + clickable stage tiles, in `public/js/design_potential_tabs.js` + `index.html#view-design`), rollup-vs-real-project filter applied across all count/list queries, permitting taper math (5 hr/mile floor after 2 miles), and program-aware field gating in the project-create modal across admin + design + permitting portals. None of this affects splice work; see the "Post-Path-B polish" block in §6.B for details. Owner is starting the Splice Matrix tool next, possibly via a fresh Claude on a VM. The relevant handoff is §6.B + §7 "Verifying changes against the live deployed app". Previous standalone handoffs (HANDOFF.md, NEXT_STEPS.md, SESSION_HANDOFF.md, CLEANUP_PLAN.md, SPLICE_MATRIX_HANDOFF.md) were absorbed into this document and removed from the repo. Migration slot 0006 is still free — nothing landed in 0006-0099 today.*
