# PROJECT_NORTH_STAR.md — read this first

> If you are the next Claude (or a human picking up this code cold), read this top-to-bottom before writing anything. It captures what this project is, why it exists, what's been built, what's deferred, and what the owner cares about. Every section earns its place.
>
> **You are encouraged to deviate.** The methods described here are how prior sessions solved problems given the constraints they hit. If you see a cleaner path, take it — and update this doc. The owner cares about goals being met, not specific implementations being preserved. When you change methods, write down what you changed and why so the *next* Claude doesn't have to reverse-engineer it.

---

## 1. What this is

Launch Fiber Services is an OSP (outside-plant) fiber engineering firm in Macon, Georgia. It designs fiber networks for clients — PSC (RUS), COX, IFT, TRI-CO, Secure Vision. The owner is Carter Trantham. He runs the firm and writes the company's project-management software himself, with Claude as the primary coding collaborator.

The software (this repo) is that internal platform. It manages:

- **Clients, contracts, engineering contracts** — the legal / billing umbrella structure.
- **Projects** — design, permitting, inspection, and rollup containers, organized as a tree (`Client → Engineering Contract → Contract # → Service Area / WO → Team → Job`).
- **Time tracking** — hours logged via a dedicated time-clock portal, manually, or via CSV import. Tracks per-staff, per-project, per-day.
- **Permitting pipeline** — a five-stage workflow (potential → started → submitted → approved → checklist) per permit project, with paperclip document attachments.
- **Design pipeline** — similar pipeline for design work.
- **Billing** — invoice generation including a custom PSC RUS PDF generator (footage and hourly variants), bulk billing, billing batches, mark-billed / unbill / bill-and-clone.
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
- **Hates over-engineering.** "Future hooks" almost always wasted work. Build what's asked, ship it, see whether the next thing is what we thought it would be.
- **Push directly to `main`, no PRs.** Railway auto-deploys all four services in 1–2 minutes. CI runs `node --test` + Playwright on every push. There is **no local Node** — verification path is push → Railway preview → click around the live app.
- **Pace: fix-and-go, push-and-keep-moving.** Don't sit on a 6-commit branch. Ship the smallest thing that works.
- **NO worktrees.** GitHub Desktop confusion outweighs isolation benefit. Work in the main checkout.
- **Communication style:** owner drops bullet lists of issues, says "go," expects autonomy. Don't wait for re-confirmation between bullet items. They'll spot-check; if something's wrong they'll say so.
- **GitHub Actions billing was paused for several days.** As of 2026-05-05 it's restored. CI gates every push again.

---

## 3. Domain primer — read this even if you think you know fiber

You'll write tools and PDFs wrong without this.

**Cable counts.** Common fiber counts: 12, 24, 48, 96, 144, 288, 432, 864. The shop regularly works on 432 and occasionally 864. Any tool that handles cables must remain readable at 432.

**Ribbon vs loose tube construction.** A ribbon is 12 fibers fused into a flat ribbon, mass-fusion-spliced 12 at a time as one unit. The shop uses ribbon construction heavily. Loose tube is each fiber spliced individually. UI for splicing must let designers grab a ribbon as a single object, not 12 fibers — that's a hard requirement.

**Ring cuts.** A mid-span access point where the cable jacket is opened, specific tubes/ribbons accessed (and either spliced out or stored in the closure), and the rest pass through untouched ("express"). Three lanes: **express**, **spliced**, **stored**.

**Fiber color codes — TIA-598.** Colors in order, both fibers in a tube and tubes within a cable:

1. blue · 2. orange · 3. green · 4. brown · 5. slate · 6. white · 7. red · 8. black · 9. yellow · 10. violet · 11. rose · 12. aqua

**PSC RUS billing structure.**

- One **engineering contract** umbrella: "RUS 217 Engineering Contract GA 1706 - A72" with loan name "Reconnect 3."
- Three **billing contracts** under it: 515-3 / 515-4 / 515-5 (aliased "Contract 3 / 4 / 5").
- Each contract has multiple **service areas / WO numbers** (Knoxville WO 16298, Cummings 16299, Crossroad School 16300, etc.).
- Each WO breaks down into **per-team** work — Permitting (DOT / RR / County) and Inspection (Inspection + Resident Engineer).
- The custom PSC RUS PDF generator (`invoice_generator.js`) renders this hierarchy as an invoice. Two variants: hourly (Inspection / RE) renders timecard pages; permitting (footage) renders summary only with footage formatted as `X.XX mi` if > 5280 ft else `X,XXX ft`.

**Rate baseline:**
- Inspection (RUS): $90/hr
- Resident Engineer (RUS): $100/hr
- Permitting (DOT/RR/County): $90/hr at 27.5 hr/mile (15-hr min)
- Design / Other: variable, prompted on creation

**Non-PSC clients** need their own invoice templates. Don't re-use the PSC RUS template.

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
  inspection.js                PSC RUS scope view
  design_pipeline.js           design pipeline advance/regress
  potential_permits.js         potential permits CRUD
  budgets.js                   /api/budgets/* + /api/budget-codes/*
  concentrators.js             concentrators (service areas with WO#s)
  contracts.js                 billing contracts + cascade delete + undo
  engineering_contracts.js     umbrella CRUD
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
  0001_splice_schema.sql       splice matrix tables (see §7.B)

automation.js                  scheduler + digest + orphan-file prune
db.js                          pg pool + initSchema
db_migrations.js               versioned migration runner
auth.js                        JWT auth + bootstrapAuthSchema
invoice_generator.js           PSC RUS PDF builder (pdfkit)
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
- **Phase 2** — topology + ring cuts. Add CO / FDH / terminal / ring_cut location types. Pathway tracing (graph walk over splices). Three-lane ring cut UI (express / spliced / stored). New table `splice_ring_cut_assignments` as `0002_*.sql`.
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
- **Schema changes** go in `migrations/NNNN_label.sql` per the runner in `db_migrations.js`. Do NOT add to `schema.sql` or the v3 bootstrap in `server.js` — that's two sources of truth, painful to keep in sync. The migration runner is the canonical path going forward.
- **Idempotent SQL only:** `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, etc. A re-run on a partially-failed migration must not corrupt data.
- **Multer file uploads** stream to `UPLOAD_DIR` (Railway persistent volume). Daily orphan-prune scheduled from `automation.js`; on-demand at `/api/_admin/prune-orphan-files`.
- **Approval gate on AI mutations:** every destructive AI tool routes through `_pendingApprovals` Map. The frontend renders an approval card; user clicks Apply; AI loop resumes. Don't bypass — the pattern catches hallucinations.

### Frontend

- **No bundler, no modules, no transpilation.** Vanilla JS. Owner deploys via Railway nixpacks; build steps add risk.
- **Admin app `public/index.html`** is a single ~10000-line SPA. Tab loaders extracted to `public/js/<tab>_tab.js` modules use the IIFE + `window.X = X` export pattern so existing inline `onclick=` handlers keep working.
- **Match dark-mode tokens.** Hex literals are forbidden in new code; use the CSS tokens defined in `:root` (light) and `html[data-theme="dark"]` (dark). Token names: `--primary`, `--surface-1/2/3`, `--text` / `--text-secondary` / `--text-muted`, `--border-strong/weak`, `--success` / `--warning` / `--danger` / `--info` plus `-light` and `-text` variants.
- **API calls** go through the `api()` helper in `public/js/api.js`. Sends cookies + Bearer fallback from `sessionStorage.lfs_token`. 401 bounces to `/login`.
- **Approval cards** render via `renderApprovalCard()` in `index.html`. The card's content is a header + N action rows (each with checkbox + summary + raw JSON `<details>`) + footer (Reject all / Apply selected). Children of the chat container need `flex-shrink: 0` — a bug that bit us at 6d109f1.
- **Mobile breakpoints** at `≤640px` apply across admin + design + permitting portals (header tightens, modals fullscreen, stat cards stack, nav-tab icons hide). Timeclock has its own ≤600px breakpoint with thumb-friendly tap targets.

### AI assistant

- **System prompt** lives at the top of `routes/ai.js`. Update it when behavior changes — the model follows it religiously.
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

---

## 8. Common gotchas — things that have already burned a session

- **`requireAuth` factory called bare.** `app.get('/x', requireAuth, ...)` — wrong. `app.get('/x', requireAuth(), ...)` — right. The bare reference fires the factory once at boot and uses its return value as middleware, which still happens to *work* for `requireAuth` with no args, but breaks `requireAuth(['admin'])`. Two regressions of this fixed.
- **Schema dual source of truth.** `schema.sql` claims to be canonical but the `bootstrapV3Schema()` in `server.js` also runs ALTERs at boot. Track 1.4 plans to consolidate via `migrations/`. New schema work should ONLY go in `migrations/NNNN_label.sql` — never touch `schema.sql` or the v3 bootstrap.
- **Polling rebuild every 8s** in the admin app's tab loaders. New widgets that hold state across rebuilds need the `tree_state.js` primitive (`makeTreeState(name)`). The Projects tab's expand-state-across-poll is the canonical example.
- **`toast.js` global `unhandledrejection` handler** turns ANY unhandled async error into a popup toast. If a confusing toast appears, the actual stack is in the browser console (F12) — the toast text is whatever the rejection produced.
- **Portal HTML files** had orphan `<tbody>` inside `<div>` (Chrome's parser silently dropped them) and broke `getElementById`. Wrap any compatibility shim row in a `<table>` if you add one.
- **Multer error handler** previously read `err.field` and produced "File too large. Maximum size for this upload is pdf limited." Now maps field name to known caps (50 MB for invoice templates, 3 GB for general uploads).
- **Customer-role JWTs** could read every admin endpoint before 2026-05-04. The fix is the global middleware that gates customer JWTs to `/api/auth/*` + `/api/customer/*` only (`server.js` near line 150). Don't undo that.
- **`migrate-nesting`** used to silently DELETE every empty rollup folder. As of 2026-05-05 it requires `{confirm: true}` in the body; default is dry-run. Empty rollups are KEPT (owner explicitly asked).
- **Approval card collapsed to 3px** in flex-column container. `.ai-msg { flex-shrink: 0 }` is the fix; don't drop it.
- **AI generation latency.** A single `bulk_create_projects` with 99 specs takes ~50s on Sonnet 4.6. Don't add a frontend timeout shorter than ~3 min.
- **Railway proxy timeout = 5 min.** If the chat loop iterates many times with Anthropic API in between, the request can exceed this. The `MAX_ITERATIONS = 15` cap is the safety net.
- **Empty Anthropic responses** in production: usually `stop_reason='max_tokens'`. The `_debug_empty` field added in 29d6520 surfaces this on the response.

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

**You are NOT encouraged to:**

- Add features the owner didn't ask for. He has explicitly said overengineering is the standard route to wasted work. When tempted, push back.
- Bypass the approval gate for AI mutations. That's a load-bearing safety guarantee.
- Touch `schema.sql` or the v3 bootstrap. Use the migrations runner.
- Re-litigate the splice-matrix six-questions or the projection retirement. They're decided. Read §6.A and §6.B carefully before second-guessing.

**When the owner gives you a prompt:**

1. Read the prompt. Identify what they want.
2. Check this file's deferred-features list (§6) to see if it's already scoped.
3. Check `BUILD_PLAN.md` to see if it's already in flight.
4. Identify the smallest end-to-end slice that ships value.
5. Build it. Test it. Push it. Tell the owner what landed.
6. **Update this file** if the result changes the architecture, conventions, or deferred-feature state.

You have full context now. Build well.

---

*Last updated 2026-05-05. Previous handoffs (HANDOFF.md, NEXT_STEPS.md, SESSION_HANDOFF.md, CLEANUP_PLAN.md) and the standalone SPLICE_MATRIX_HANDOFF.md were absorbed into this document and removed from the repo.*
