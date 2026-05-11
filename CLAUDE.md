# CLAUDE.md — Launch Database Project Context

> Canonical merged context for this repo. Synthesized from PROJECT_NORTH_STAR, BUILD_PLAN, ADMIN_FIXES_PLAN, HANDOFF_NEXT_PM, PORTAL_LAUNCHER_PLAN, SPLICE_*, README. Original docs preserved at root for history. Update this file as authoritative going forward.

Last merged: 2026-05-09

---

## 1. Project North Star

**Launch Fiber Services** is an OSP (outside-plant) fiber engineering firm in Macon, Georgia. It designs fiber networks for clients (PSC, COX, IFT, TRI-CO, Secure Vision). Owner: Carter Trantham. He runs the firm and writes the company's project-management software himself, with Claude as the primary coding collaborator.

This repo IS that internal platform. It manages:

- **Clients, contracts, engineering contracts** — the legal/billing umbrella structure. Engineering contracts carry a `program` field (`rus` / `bau` / `gfr` / `other`) that drives template selection and program-specific projections.
- **Projects** — design, permitting, inspection, and rollup containers, organized as a tree (`Client → Engineering Contract → Contract # → Service Area / WO → Team → Job`).
- **Time tracking** — hours logged via a dedicated time-clock portal, manually, or via CSV import.
- **Permitting / Design pipelines** — multi-stage workflows with paperclip document attachments.
- **Billing** — invoice generation including a custom PSC RUS PDF generator (footage and hourly variants), bulk billing, billing batches, mark-billed / unbill / bill-and-clone. The RUS template is gated on `engineering_contracts.program = 'rus'`.
- **AI Assistant** — Claude tool-using chat (model `claude-sonnet-4-6`) that creates projects, logs hours, queries data, advances permits, runs admin SQL, etc. Approval gate on every destructive action.
- **Audit log** — full timeline on every time-entry mutation with retention pruning.
- **Splice Matrix** — fiber splice planning tool with Konva canvas + MapLibre/Mapbox map + matrix/PDF deliverable. Largest single subsystem.
- **Multi-portal launcher** — single deploy serves admin / splice / design / permitting / timeclock / customer / client portals via path-based routing.

**Mindset:** internal tool, owner-operated, no third-party users today. Engineers and managers log in. Customers don't (yet).

### How the owner works

- Domain expert in OSP fiber. Trust his calls on fiber counts, ribbon vs loose tube, ring cuts, color codes, closure models, billing rates.
- **Not formally trained in software.** Use plain language; explain framework jargon inline. He once said he didn't know the term "tech stack" — write at that level.
- **Decisive when given concrete options.** Two-or-three options with tradeoffs, not open-ended "what would you like?".
- **Likes data depth and granularity — does NOT want minimal builds.** Quote: *"I have never said anything bad about overengineering, I'm a data nerd and the more the better as long as its neat and clean in the UI and code."* Constraints: (a) UI stays neat, code stays clean, (b) work ships and ties to a real workflow he uses. Modeling correctness welcomed; speculative scaffolding for never-realized requirements is wasted.
- **Push directly to `main`, no PRs (his personal style).** Railway auto-deploys all services in 1–2 minutes. CI runs `node --test` + Playwright on every push. **Note**: this orchestrator's policy (§13) currently overrides the "push direct" default — manager pattern dictates a review pipeline.
- **NO worktrees.** GitHub Desktop confusion outweighs isolation benefit.
- **Pace:** fix-and-go, push-and-keep-moving. Smallest thing that works — but if "smallest" elides depth he wants, restore the depth.
- **Whole-thing requests.** "Do the entire thing at once, don't stop. Check yourself as you go along." Execute end-to-end; surface blockers in the final summary, not by stopping.
- **GitHub Actions billing was paused for several days** (resolved 2026-05-05). CI gates every push again.

---

## 2. Architecture

### Tech stack

| Layer | What |
|---|---|
| Backend | Node.js >=18 (Railway runs Node 20 per `nixpacks.toml`), Express 4 |
| DB | PostgreSQL via `pg`, `gen_random_uuid()` from pgcrypto |
| Frontend | **Vanilla JS** (no React, no build step). Admin app is a single ~10000-line `public/admin.html` SPA. Portals are standalone HTML files. Shared client modules in `public/js/*.js`. Shared CSS in `public/app-shell.css`. |
| Auth | JWT in cookies + `Authorization: Bearer` from `sessionStorage.lfs_token`. Roles: `admin`, `design_manager`, `permitting_manager`, `design_engineer`, `permitting_engineer`, `customer`, plus `construction_*` after the 2026-05-06 rename. `req.user.staff_id` links a user to a staff record. |
| AI | `@anthropic-ai/sdk` v0.39, model `claude-sonnet-4-6`. Tool-using chat with approval gate. |
| PDF | `pdfkit` (PSC RUS invoice generator) and `puppeteer` (general HTML→PDF, splice). |
| Maps | MapLibre GL JS via CDN; Mapbox Streets v12 vector tiles when `MAPBOX_TOKEN` set, else Esri World Imagery raster fallback. |
| Canvas | Konva.js, CDN-pinned at 9.3.16, for the splice diagram editor. |
| Uploads | `multer` to `UPLOAD_DIR` (Railway persistent volume, default `/data/uploads`). 3 GB cap per file. Daily orphan-file prune in `automation.js`. |
| KMZ/DXF | `@tmcw/togeojson`, `dxf-parser`, `proj4`, `archiver`, `adm-zip`, `xlsx`. |
| Deploy | Railway, **single consolidated service** at `portal.launchfiber.com` (was per-portal services; consolidated under PORTAL_LAUNCHER_PLAN Phase 1). `PORTAL_MODE` env var still supported as fallback. |
| Tests | `node --test --test-concurrency=1 --test-timeout=180000 tests/*.test.js` for backend smoke + Playwright (`tests/browser/*.spec.js`) for browser. CI runs both on every push. |

### Multi-portal layout (post-launcher consolidation, 2026-05-07)

| URL | Description |
|---|---|
| `portal.launchfiber.com/` | Launcher — role-aware tile grid for employees |
| `/admin.html` | Admin SPA (projects, billing, staff, AI) |
| `/splice.html` | Splice Matrix (fiber planning + PDF export) |
| `/permitting.html` | Permitting Portal |
| `/design.html` | Design Portal |
| `/timeclock.html` | Time Clock |
| `/client/` | Client Launcher (customer-role users) |
| `/customer.html` | Customer Portal (read-only client view, currently "Under Construction" placeholder) |
| `/splice_view.html` | Public read-only splice viewer (token-gated) |
| `/login.html` | Shared login |

`PORTAL_MODE` is no longer set on Railway. The launcher (`public/launcher.html` and `public/client/index.html`) hits `GET /api/me/portals?audience=employee|client`, which returns the entitlement-filtered tile list from `PORTAL_DEFS`. Single-portal users auto-redirect; admins see all tiles. Every portal has a `← Launcher` back-arrow component.

Old per-portal Railway services stay alive for ~30 days after cutover for QR-code link compatibility, then teardown.

---

## 3. Domain terminology

- **OSP** — Outside Plant. Physical fiber infrastructure outside buildings.
- **RUS** — USDA Rural Utilities Service program. A *program*, not a client. Heavily PSC's territory but ALSO touches other clients.
- **BAU** — "Business as usual" non-RUS work, contractually distinct from RUS.
- **GFR** — Government Fiber Rural (or similar) — a third program enum value. Uses RUS infrastructure but its own pricing.
- **PSC, COX, IFT, TRI-CO, Secure Vision** — clients. PSC has BOTH RUS and non-RUS engineering contracts.
- **Engineering contract** — umbrella legal contract carrying the `program` field. One client → many engineering contracts → many billing contracts.
- **Service area / WO (Work Order)** — geographic chunk of work. Examples: Knoxville WO 16298, Cummings 16299.
- **Team** — Permitting (DOT / RR / County) and Construction (was "Inspection" pre-2026-05-06; renamed via migration 0009). Resident Engineer is a Construction sub-role.
- **Ribbon** — 12 fibers fused into a flat ribbon, mass-fusion-spliced 12 at a time. Hard requirement: splice UI must let designers grab a ribbon as one object.
- **Loose tube** — each fiber spliced individually.
- **Ring cut** — mid-span access point. Three lanes: **express** (passes through), **spliced** (terminated/joined here), **stored** (slack coiled in closure).
- **TIA-598 fiber color order** — `1.blue 2.orange 3.green 4.brown 5.slate 6.white 7.red 8.black 9.yellow 10.violet 11.rose 12.aqua`. 2-letter codes: BL OR GR BR SL WH RD BK YL VT/VL RS AQ.
- **Common fiber counts** — 12, 24, 48, 96, 144, 288, 432, 864. Shop regularly does 432, occasionally 864.
- **Rollup project** — `is_rollup=TRUE` container, organize-only, no time entries. Filtered out of "active projects" counts.
- **Held timecard** — `time_entries.project_id IS NULL` row pending admin assignment to a real or to-be-created project.
- **Setting change request** — portal-side proposal of a destructive change that admin must approve.
- **Approval gate** — AI-side: `_pendingApprovals` Map; user clicks Apply on the chat card before any destructive AI tool runs.
- **PORTAL_MODE** — legacy env var that locked a Railway service to one SPA. Now optional; absence triggers the launcher.

### Clients vs Programs (CRITICAL — burned multiple sessions)

| Axis | Where it lives | Examples |
|---|---|---|
| **Client** (who pays) | `clients` table | PSC, COX, IFT, TRI-CO, Secure Vision |
| **Program** (kind of work) | `engineering_contracts.program` | `rus`, `bau`, `gfr`, `other` |

PSC has BOTH RUS-program work ("RUS 217 Engineering Contract GA 1706 - A72") AND ordinary BAU work. The PSC RUS PDF template, the dedicated revenue projection, and inspection-tab scope all gate on **program**, not on the client.

Legacy `clients.is_rus` boolean was DROPPED in migration 0003. `project_types` table was DROPPED in migration 0004. Both are retired enums; new code referencing them is regressing.

### Rate baseline

Defaults; actual rates live on `pricing_entries` per job × program × billing_code:
- Inspection (RUS): $90/hr
- Resident Engineer (RUS): $100/hr
- Permitting (DOT/RR/County): $90/hr at 27.5 hr/mile (15-hr min), with tapered rate after 2 miles down to a 5 hr/mile floor.
- Design / Other: variable, prompted on creation.

---

## 4. Modules / surface area

### Top-level Node files

| File | Lines | Role |
|---|---|---|
| `server.js` | ~1190 | Express boot, multer, CORS, middleware, route wiring, schema bootstrap |
| `auth.js` | ~730 | JWT auth + bootstrapAuthSchema + user CRUD + change-password + rate limiting |
| `automation.js` | ~1150 | Daily/hourly scheduler, audit-cleanup, orphan-file prune, PSC RUS projection builder |
| `db.js` | ~250 | pg pool config, statement timeouts, initSchema, deferred-statement queue |
| `db_migrations.js` | ~120 | Versioned migration runner — reads `migrations/NNNN_*.sql`, applies via transactions, tracks in `schema_migrations` |
| `portal_module.js` | ~1045 | PORTAL_MODE-conditional routes + `ensureRollupChain` + `isDuplicateProject` + setting-change-requests |
| `timeclock_module.js` | ~790 | /api/timeclock/* + `time_entry_audit` schema + `makeAuditLogger` factory |
| `invoice_generator.js` | ~1180 | PSC RUS PDF builder (pdfkit). Gates on `ec.program='rus'`. |
| `invoice_template_engine.js` | ~600 | AI-driven invoice template upload + rendering (puppeteer) |
| `schema.sql` | ~58 KB | Base schema (still partial source of truth; `bootstrapV3Schema` in server.js also runs ALTERs) |

### Routes (`routes/*.js`) — 30+ modules, one HTTP resource each

Notable: `splice.js` is **306 KB** (largest in repo, > `ai.js` 128 KB, > `admin.html` 450 KB). `_helpers.js`, `_csv_stage.js`, `_splice_validation.js`, `_sse.js` are shared utilities. All wired from `server.js`.

Quick map (group by domain):

- **Core CRUD**: `clients`, `staff`, `engineering_contracts`, `contracts`, `projects`, `jobs`, `pricing`, `concentrators`, `project_types` (legacy shim).
- **Hours / billing**: `time_entries`, `hours_csv` (CSV import; `pickProject()` is canonical WO# resolver), `revenue`, `billing`, `invoices`, `invoice_templates`, `project_billing`, `reports`.
- **Pipelines**: `permits`, `potential_permits`, `design_pipeline`, `inspection` (RUS-program scope), `dashboard`, `project_detail`, `project_documents`, `budgets`.
- **AI / undo / admin**: `ai` (chat + tools + approval gate + system prompt), `undo` (POST `/api/undo/:token`), `admin` (`/api/_admin/{migrate-nesting, orphan-files, adopt-orphan, prune-orphan-files, hours-backfill, disk-stats, uploads-cleanup, audit-cleanup, db-sizes, …}`).
- **Splice**: `splice` (entire subsystem API), `_splice_validation` (capacity, double-splice, color mismatch, ribbon integrity).
- **Customer**: `customer_portal` (`/api/customer/*` — deferred, mostly stubs).
- **Infra**: `_sse` (broadcast bus), `_helpers` (`updateProjectHours`, `calcProjectFinancials`, `collectProjectTree`), `_csv_stage` (TTL'd Map shared by `hours_csv.js` + `ai.js`).

### Public assets (`public/`)

- `admin.html` — ~10000-line admin SPA (was `index.html`; renamed in launcher consolidation)
- `splice.html` — splice editor (Konva canvas + MapLibre/Mapbox map + matrix view)
- `splice_view.html` — public read-only splice viewer (token-gated, no login)
- `design.html`, `permitting.html`, `timeclock.html`, `customer.html` — portal SPAs
- `launcher.html`, `client/index.html` — role-aware tile launchers
- `login.html` — shared login
- `app-shell.css`, `launcher-back.css` — shared styles
- `toast.js`, `keyboard.js` — global helpers
- `js/` — 27 admin tab modules (api, undo_bar, tree_state, overlay_modal, project_picker, dashboard_views, projects_tab, hours_tab, revenue_tab, billing_tab, inspection_tab, etc.)
- `img/launch-fiber-logo-transparent.png` — high-res transparent logo (added 2026-05-08 per Logo-E)

### Migrations (`migrations/0001_*.sql` … `0029_*.sql`)

29 versioned files, applied at boot via `db_migrations.runMigrations(pool)`. Tracked in `schema_migrations` table. See §8 for the splice-specific slot accounting.

---

## 5. Completed work (institutional memory)

Synthesized from BUILD_PLAN, ADMIN_FIXES_PLAN, HANDOFF_NEXT_PM, PORTAL_LAUNCHER_PLAN.

#### BUILD_PLAN batch (claude/add-audit-log-hours-x0XCd, ~17 items)

- Audit log slide-out drawer from Hours toolbar (replaces standalone "Time Audit" tab); CSV imports now write `time_entry_audit` rows (source='csv').
- Edit timecard via pencil-icon modal (admin + portal).
- Undo bar empty-text bug fixed.
- Contracts → Construction Contracts rename, restructured to group by engineering contract umbrella; engineering contract is the top-level header.
- Billing batch cleanup on project delete (all 3 paths + undo replay).
- AI: PSC RUS `create_project` alias resolver + `bulk_delete_projects` tool.
- Portal change-password modal + undo bar (shared `public/js/change_password_modal.js`).
- PSC RUS tab status filter; print stylesheet for billing report; invoice PDF dynamic row heights; project picker helper (leaves-only).
- Timeclock entry modal cascade Client→Project→Job; held-timecard flow with `time_entries.pending_project_request_id` retro-attach on approval.
- Design + Permitting portals: delete-with-approval (HTTP 202 + setting_change_request), "Existing Project for this Client" dropdown.
- Admin Hours "Needs Project Assignment" panel.
- Color token system rework — full dark-mode token set (`--primary/-dark/-light/-text`, `--surface-1/2/3`, `--text/--text-secondary/--text-muted`, `--border-strong/weak`, `--success/-light/-text`, `--warning/-light/-text`, `--danger/-light/-text`, `--info/-light/-text`). WCAG AA on `#1A1F26`.
- Customer portal scaffold: `customer` role + `customer_clients` junction + 5 GET endpoints; UI is "Under Construction" placeholder (render code preserved at commit `aa9f6d0`).
- Admin Clients tab "Under Construction" with `/api/admin/client-progress` live but dispatch commented out.
- Dashboard drag-to-reorder with persisted layout.
- Mass alert→toast classification.
- CSV would-modify preview (`/api/hours/csv-validate` classifies new/duplicate/modify/conflict; auto-skip duplicates).
- Inspection projection weighted-recency (`max(0.2, 1 - age_in_weeks/lookback)`).
- Track 1.4 versioned migrations runner; `req.user.staff_id` populated.

#### Path B: client/program separation (2026-05-04 → 2026-05-05)

migrations 0002-0006 moved RUS-vs-other gating from `clients.is_rus` (dropped in 0003) onto `engineering_contracts.program`. `project_types` table dropped in 0004; replaced with the program enum on `engineering_contracts.program`, `projects.program` (auto-derived from EC), and `pricing_entries.program`. `/api/project-types` is a legacy compat shim (returns 4 program rows; writes 410 Gone). Frontend Project Type dropdown is a static program enum; Settings → Pricing groups by program. End-to-end verification on production via Claude-in-Chrome MCP — clean.

#### Splice Matrix Phase 1 → Phase 5.H (2026-05-05 → 2026-05-07)

See §8 for full splice timeline. 28 splice migrations applied (0001 + 0007/0008/0010-0028). Phases 1, 2A, 2B, 2C, 3 (geographic/KMZ/DXF), 4 (competitive-research-driven), 5.A-5.H all shipped.

#### Admin fixes 8-pack (2026-05-06)

| # | Issue | Commit |
|---|---|---|
| 1 | Project edit modal pre-fill | a1e77f2 |
| 5 | Hours 0.25-aligned no rounding | b3c5a0b |
| 8 | Invoice print: infer job from batched projects | d41285d |
| 2 | CSV importer assigns wrong job | b3363d9 |
| 4 | AI Inspection tree drops SA + WO# | b2958df |
| 7 | Logo: AI stripping Launch logo from invoice templates | f84ebc2 |
| 3 | Manual `is_rollup` flag — UI + AI tool support | d3adc14 |
| 6 | Rename Inspection team → Construction (migration 0009) | d61a826 |

#### Portal launcher consolidation (2026-05-07)

7-commit Phase 1 + 2 (`2a64cb7` PORTAL_DEFS + `/api/me/portals` → `b7b2b44` launcher.html → `3feeef2` rename index.html → admin.html → `816d367` back-arrow → `d87600f` client launcher → `3027389` SPLICE_PUBLIC_URL → `3c80a7c` bento grid). Plus UX persistence layer (localStorage filter + form-draft keys, location.hash tab persistence) and full SSE coverage across admin + portals (24+ event names, debounced + visibility-aware).

#### Track unbilled hours + audit retention (2026-05-08)

migration 0029 added `time_entries.is_billable` + `unbilled_category`. Timeclock CSV `customer` column distinguishes billed (project-pinned) vs unbilled (Misc/Permitting/WO-only) overhead — unbilled rows persist with `project_id=NULL`. `GET /api/time-entries?billable=billed|unbilled|all` filter; `GET /api/revenue/hours-utilization` breakdown. Hours tab toggle + stat cards + Unbilled Hours panel; Revenue tab Hours Utilization tile. Unbilled-row dedup uses `staff|UNB:<category>|date|job` key. `runAuditCleanup` daily scheduler + `/api/_admin/audit-cleanup` + `/api/_admin/db-sizes`.

#### 502 / disk-leak recovery (2026-05-08 → 2026-05-09)

Six-commit response to Railway 502 + 250 GB volume fill in 8h:
- `234454f` Recon-A — pg-pool `connectionTimeoutMillis: 10s`.
- `f6681eb` Fix-A — DB-independent `/api/_admin/disk-stats`, `/api/_admin/uploads-cleanup`, `X-Admin-Bypass-Token`, audit retention 90→14d, 64 KB payload cap, AI upload catch-block unlink.
- `de55ff5` PR #33 merged.
- `0f93781` Fix-B — `safeBootstrap(label, fn)` wraps 5 bootstrap awaits + scheduler so DB-bootstrap throws are logged and skipped.
- `ab6af30` Fix-C — `statement_timeout` + `idle_in_transaction_timeout` via `pool.on('connect')`. Env overrides: `PG_STATEMENT_TIMEOUT_MS`, `PG_QUERY_TIMEOUT_MS`, `PG_IDLE_TX_TIMEOUT_MS`.
- `7e964ba` PR #35 merged.

154/154 tests green throughout. Post-deploy operator follow-ups: confirm `UPLOAD_DIR`, set `ADMIN_BYPASS_TOKEN`, triage via `/api/_admin/disk-stats` → `/api/_admin/uploads-cleanup` (dry-run first), optionally `AUDIT_RETENTION_DAYS_LOW=7`.

#### Recent polish (2026-05-08 → 09)

- `b79b9e4` — prevent duplicate upload submissions (Dedup-A)
- `9e41518` — replace logo everywhere + fix upload-button icon (Fix-D + Logo-D)
- `68e9523` — regression test for RUS project with `contract_id=NULL`
- `46f29e9` — replace 218×76 logo stub with 630×219 high-res transparent PNG (Logo-E)

---

## 6. Active scope (as of 2026-05-09)

Branch in flight: **`claude/debug-previous-issues-MoN9D`** (this manager session).

Per HANDOFF_NEXT_PM ledger:

- **UI-A (queued)** — Launcher + login redesign. Owner provided intent: bigger logo, transparent variant, smaller tile titles, single-square layout where tiles stretch to fill remaining cells when fewer entitlements. Touches `public/launcher.html` + `public/login.html`. Awaiting logo screenshot before dispatch.
- **Disk-T (queued)** — Operator triage of disk via `/api/_admin/disk-stats` + `/api/_admin/uploads-cleanup`. Volume bumped to 500 GB; producer of the leak still unidentified.
- **OSP-1 (queued)** — Sister repo `KodaiCards/OSP-Design-Training` portal/tile bring-up. User said "later".
- **Diag (blocked, user-side)** — Railway dashboard / logs / volume status. Manager cannot reach Railway from sandbox.

The 502 + disk-leak postmortem is closed (PR #33 + PR #35 merged). The ledger continues into UI/UX polish.

---

## 7. Open / queued work

### Immediate next steps from HANDOFF_NEXT_PM

1. UI-A launcher+login redesign (waiting on logo screenshot).
2. Identify the 250 GB-in-8h disk producer once the operator runs the diagnostic endpoints.
3. Bring up OSP-Design-Training as a launcher tile.

### Open follow-ups (Red-B's MINOR items, not deploy-blockers)

1. Replace `===` bypass-token comparison with `crypto.timingSafeEqual` (`routes/admin.js`).
2. Update the cleanup endpoint's `hint` text to include `Content-Type: application/json` so operators don't curl with form-encoding.
3. Tighten `package.json` `engines.node` to `>=18.15.0` to match `fs.statfsSync`'s availability floor.
4. Convert the catch-path `fs.unlink` in `routes/ai.js` to `fs.promises.unlink(...).catch(() => {})` for style consistency.
5. Add a `_truncated` check to `public/js/audit_drawer.js` to render a banner instead of raw marker JSON.

### Recon-A self-flagged items

1. `connectionTimeoutMillis: 10000` is also the pool-queue wait when `max=10` is exhausted. Acceptable for current load; revisit if throughput rises.
2. `VACUUM time_entry_audit` (non-FULL) inside scheduler can take minutes on a large table, holding a connection.
3. `setImmediate(() => tick('boot'))` in automation.js:1117 has no `.catch()`. Tasks have inner try/catch so safe today.
4. Migration 0029's `ADD COLUMN ... NOT NULL DEFAULT TRUE` is metadata-only on Postgres 11+. Railway is on PG 14+.

### Scale follow-ups (queued, none urgent)

Surfaced during `claude/scale-pass-sse-cte`. Become real at 500+ active projects, multi-tab admin sessions, larger billing batches.

- **S-1** — N+1 in monthly invoice builder (`routes/billing.js` ~80). Replace per-project SUM with single `ANY($1::uuid[])` query.
- **S-2** — N+1 in `findLeafFor()` rollup-reattribution loop (`routes/admin.js` ~669). Pre-compute `(rollup_id → leaf_id)` in a single batched recursive CTE.
- **S-3** — Unbounded `SELECT *` from projects in billing route. Add `LIMIT 5000` and only select needed columns.
- **S-4** — `dashboard.js` ytd_revenue scalar subquery per row. Compute once via CTE+JOIN; right-shape is a materialized column at 1000+ active projects.
- **S-5** — SSE reconnect timer can stack in `admin.html`. Guard with `_reconnectTimer` clearTimeout.

### Splice Phase 6+ (deferred)

- Phase 4.7 — Fujikura Splice+ fusion-splicer integration ingest (loss records bound by GPS proximity).
- Phase 4.8 — AI splice-photo validation (DEFERRED 2026-05-06).
- Splice Phase 5.I — structured custom-feature attribute schema (currently free-form JSON).
- Phase 5.E candidate — bulk re-categorization UI for cables.

### Track 1.3 remainder

`server.js` still has ~1200 inline AI tools / ~755 lines of CSV import logic that the BUILD_PLAN earmarks for extraction into `routes/ai.js` and `routes/hours_csv.js`. **Note**: a substantial extraction has already happened (see route module sizes). Verify scope of remaining work before re-opening.

### Revenue projection logic — RETIRED 2026-05-05

All five tiles render `UNDER CONSTRUCTION` placeholder. Backend untouched. To revive:
1. Restore dashboard tile gradient + value template.
2. Un-comment `loadInspectionProjection` body in `public/js/dashboard_views.js`.
3. Restore Revenue tab tile condition + click handler.
4. Restore project-detail modal Projected Revenue + Remaining tile templates.
5. Set Projected Revenue form-group `display: block` on project create/edit modal.

Math itself probably needs a second pass.

### Customer self-service portal — deferred

Backend partially scaffolded (`routes/customer_portal.js` 5 GETs). Don't start without explicit OK.

### Inspection revenue projection refinements — deferred

Open math questions on which projects count, ongoing vs completed, monthly cadence overhang. Subsumed into the projection-retirement revival.

### Client progress view (admin) — deferred

`/api/admin/client-progress` is live; UI was stubbed to "Under Construction".

### Customer-portal project-level completion view — deferred

When the customer portal goes live.

---

## 8. Splice subsystem

The largest single subsystem in the repo. Owner-stated north star: **a premium splicer deliverable + faster engineer workflow.** The PDF is the product; the canvas is the editor for the artifact.

### What it does

A visual splice planning tool for the design team. Designers create a project, lay out cables and splice closures on a satellite map and/or schematic diagram, drag fibers (or whole 12-fiber ribbons) to define splices, and export a printable PDF for splicers in the field. Replaces an Excel-based workflow.

The splicer is the audience for the PDF deliverable — splicers do not log into the tool. They scan QR codes on the printed PDF that link to the public read-only viewer, and they upload field photos / Fujikura Splice+ JSON via no-login token URLs.

### Two unique differentiators (don't dilute these)

1. **Closure-internal physical realism** — tray-by-tray fill bars, ribbon stacking, slack indicators. Most commercial tools show connectivity schematics, not the inside of the closure.
2. **No-login splicer feedback loop** — splicers don't sign in. Field markup happens via QR-code-on-PDF + public photo upload, not an app.

### Position rules out

GIS asset lifecycle, FTTH auto-design, splicer mobile app, DWDM channel planning, AI auto-routing, Salesforce-flavored ticketing, real-time multi-cursor (Figma-style CRDT — file-lock + SSE handles 95%).

### Current state — Phase 1 → 5.H all shipped

- **Phase 1**: CRUD, hydrate, file-lock, SSE, Konva canvas, single + ribbon splice, Tabloid PDF.
- **Phase 2A**: PDF polish, validation engine, ring-cut three-lane, strand circuit naming.
- **Phase 2B**: Templates + project clone, version snapshots + diff PDF, no-login QR field markup.
- **Phase 2C**: Multi-cable canvas, splitters, slack modeling, path tracing, CSV/Excel paste.
- **Phase 3A-3E**: lat/lon + GeoJSON paths + MapLibre map; KMZ export/import + staging schema; DXF import with proj4js + 2-control-point affine; submit-and-review merge UX. Phase 3F (DWG via OdaFileConverter) **SKIPPED**.
- **Phase 4.1-4.7**: project public tokens, TIA-598 2-letter codes, Map↔diagram split with selection sync, splice matrix tabular editor, threaded comments, public template library, Fujikura Splice+ ingest. Phase 4.8 (AI photo validation) **DEFERRED**.
- **Phase 5.A**: smoke + small fixes (hybrid map labels, dismissible warnings, "24f" hardcoded fix, shift-click multi-select, traceable unspliced/express/dead).
- **Phase 5.B**: VETRO UX overhaul (handhole add, kill ingest naming popup, trayless splice, click-shows-paths, drag-drop multi-fiber).
- **Phase 5.C**: VETRO visual match + Handhole/Cable Inventory dashboards.
- **Phase 5.D**: Mapbox migration (token via `/api/config/mapbox`), zoom-lag fixes, layer tree, style editor; cable category column + `splice_layer_styles` + `splice_custom_layers`.
- **Phase 5.E**: bug fixes + range selection (Map first-render, replace `confirm()`, dark-mode header `#0B1A2E`, view-tabs into canvas chrome, Add Location placement mode, attribute-table counts, undo snackbar, shift-click range fill).
- **Phase 5.F**: diagram topology rewrite (location nodes + cable edges, LOD zoom, tray drill-down, splice arcs end-to-end fiber path on hover, sticky labels + minimap).
- **Phase 5.G**: PDF deliverable v2 (cover metadata, per-project + per-closure QRs, Mapbox Static map, navy headers + alternating rows, gen hash).
- **Phase 5.H**: UX polish round 2 (empty states, sidebar tabs, compact lock pill, per-type marker shapes, legend overlay, scoped search, custom-layer feature adding via migration 0028).

### Audit findings (SPLICE_MATRIX_SUGGESTIONS.md, 2026-05-07)

A 1M-context Sonnet 4.7 audit on production. State of the art (don't break): VETRO design-token alignment (`#003F72` navy, `#68BD45` route green, Inter, 4-px grid); dark mode end-to-end (no OSP competitor ships this); four-view tab model (Diagram/Map/Split/Matrix); generous schema (10 location types, trayless splices, ribbon groups, splitters, versions, share tokens, comments, field markup, loss records); 25+ migrations.

Top-5 highest-leverage fixes from that audit, all since shipped: Map first-render (`4c60c58`), replace `confirm()` (`359a3ce`), Add Location placement mode (`0a04eb1`), anchor diagram cables to location nodes (Phase 5.F), upgrade PDF deliverable (Phase 5.G).

### Migration slot accounting

Splice slots: 0001, 0007, 0008, 0010-0022, 0024-0028 (24 splice migrations). Names map to phases as documented in SPLICE_BUILD_PLAN. Unrelated migrations interleaved: 0002-0006 + 0009 (Path B + Construction rename), 0029 (time_entries_billable). **Slot 0023 is not in the repo** — appears to have been skipped or absorbed during reordering.

### Anti-features (DO NOT BUILD)

- Login-required splicer mobile app.
- Real-time multi-cursor (Figma-style CRDT).
- AI auto-routing / auto-design.
- Salesforce-flavored ticketing/asset lifecycle.
- DWDM channel planning.
- Phase 4.8 (AI splice-photo validation) — explicitly deferred.

### Splice service deployment notes

- `MAPBOX_TOKEN` env var on Railway. Without it, falls back to Esri World Imagery raster.
- `SPLICE_PUBLIC_URL` env var should be set so QR codes encode the right absolute URL. Default is `https://portal.launchfiber.com` post-launcher consolidation.
- `splice.html` SSE relies on JWT cookie (EventSource can't send Bearer). Same-origin → cookie auto-travels.
- `PUPPETEER_CACHE_DIR=/app/.cache/puppeteer` if PDF export 500s with `puppeteer not installed`.
- Splice service has no Railway volume; field markup uploads land as BYTEA in Postgres (chosen over admin-volume signed URL for v2 simplicity).

---

## 9. Portal Launcher

Per PORTAL_LAUNCHER_PLAN.md. Owner ask 2026-05-07: collapse per-portal Railway services to one URL with a role-aware launcher.

### End state (Phases 1 + 2 shipped, 7 commits)

Every employee lands at `portal.launchfiber.com/`, sees a launcher showing only the portals their role permits, can deep-link directly to a portal via bookmark, and can return via top-left back arrow. Customer users land on a parallel client launcher at `/client/`.

### `PORTAL_DEFS` table (single-source mapping)

A list of `{ id, audience: 'employee'|'client', url, name, icon, canAccess(user) }` objects. The launcher renders whatever `/api/me/portals?audience=...` returns. Currently 6 entries: admin / splice / design / permitting / timeclock / customer. Adding a portal is a one-row change.

### Permission matrix

| Role | admin | splice | design | permitting | timeclock | customer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| `admin` | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `design_manager` | — | ✓ | ✓ | — | ✓ | — |
| `design_engineer` | — | ✓ | ✓ | — | ✓ | — |
| `permitting_manager` | — | — | — | ✓ | ✓ | — |
| `permitting_engineer` | — | — | — | ✓ | ✓ | — |
| `construction_*` | — | view-only* | — | — | ✓ | — |
| `customer` | — | — | — | — | — | ✓ |

`extra_teams` extends entitlements. Construction users access splice via the QR public-share token flow (no launcher tile needed).

### Auto-redirect

Single-portal users get a 302 to their one portal. `?stay=1` skips the redirect.

### Rollback

Re-set `PORTAL_MODE` env var on Railway. The old per-portal lock code stays in `server.js` as a fallback.

### Phase 3 — future client portals (placeholder)

- Splice Docs (read-only viewer for clients)
- Project Tracking (client view of status/progress/milestones)
- Construction Tracking (client view of stage progress/photos/daily reports)

Each is a one-row addition to `PORTAL_DEFS`.

### UX Persistence Layer (admin.html)

`lf_filter:<tab>:<element-id>` keys (16+, ≤200 chars) for filter state with per-tab xmark icon. `lf_form:project-modal` for autosave drafts (≤50 KB) with "Draft restored" banner that survives Cancel/Close. `location.hash` for tab persistence via `showView` + popstate. Settings → "Clear all saved UI state" wipes both.

### Live Updates (SSE)

`routes/_sse.js` exposes `attach(app, mw)` and `broadcast(channel, event, payload)`. Channels: `admin`, `team:design`, `team:permitting`, `team:construction`. 25s ping heartbeat; `X-Accel-Buffering: no` for nginx.

24+ event names: `project_*`, `time_entry_*` (incl. `bulk_deleted`), `contract_*`, `engineering_contract_*`, `client_*`, `staff_*`, `permit_updated`, `invoice_created/voided`, `batch_committed/voided`. `permit_added/deleted` and `job_*` reserved.

Client pattern: per-portal IIFE with auto-reconnect, 500ms debounced reload, visibility-aware staleness flag (`_*Stale`) deferred until tab is active; `showView` wrapped to detect stale-on-activate.

**Coverage commitment**: every interactive view that reads data MUST refresh via SSE. Polling is recovery heartbeat (60s) only. Outstanding to migrate: `loadPipeline`, `loadPotential`, `loadDesign`, `loadPermits`, `refreshProjectDetail`, `refreshApprovalsBadge`. Out of scope: one-shot dialogs, customer portal, splice tool (own project-scoped SSE).

---

## 10. Admin fixes

Per ADMIN_FIXES_PLAN.md (2026-05-06). All 8 issues shipped.

| # | Issue | Approach | Commit |
|---|---|---|---|
| 1 | Project edit modal pre-fill | Investigate `openProjectModal()`/`editProject()`; cascade fired AFTER pre-fill clobbered fields | a1e77f2 |
| 5 | Hours 0.25-aligned no rounding | Snap-to-0.25 half-up, never floor/truncate; displayed = stored | b3c5a0b |
| 8 | Invoice print no-job error | Infer single job from batched projects; mixed jobs → clear error | d41285d |
| 2 | CSV importer wrong job | At commit, project's `job_id` overrides CSV `job_title` text | b3363d9 |
| 4 | AI Inspection tree drops SA + WO# | Server-side inheritance: bulk_create_projects inherits `concentrator_id` and `work_order_number` from parent | b2958df |
| 7 | Logo: AI strips Launch logo | Canonical `public/img/launch-fiber-logo-transparent.png`; vision-detected "Launch Fiber Services" text → reference the asset, not inline text | f84ebc2 |
| 3 | Manual `is_rollup` flag | UI checkbox; AI tools accept `is_rollup`; system prompt explains rollup vs job-bearing | d3adc14 |
| 6 | Inspection team → Construction | migration 0009; rename data + role gating + UI labels; compat shim accepts both during rollover | d61a826 |

### Things NOT to touch during admin fixes

- Splice matrix files.
- The PSC RUS PDF gate's `program='rus'` filter.
- `is_rus` references — already removed in migration 0003.
- The existing rollup filter in count/list queries.

---

## 11. Conflicts and inconsistencies between source docs

### C1. Branch policy: push to main vs PRs

- **PROJECT_NORTH_STAR §2 says**: "Push directly to `main`, no PRs. Railway auto-deploys."
- **HANDOFF_NEXT_PM §1 says**: orchestrator manager pattern uses `implementer Sonnet → red-team Sonnet → manager VERIFIES → manager pushes/deploys`. PR #33 + #35 went through `gh pr create` + `gh pr merge` because direct push to main was blocked by local proxy (403).
- **This document §13 says**: branch is `claude/debug-previous-issues-MoN9D`; push to that branch only; no PRs unless explicitly asked.

**Recommended resolution**: HANDOFF_NEXT_PM and §13 are the active operating rules for orchestrator-managed sessions. PROJECT_NORTH_STAR's "push to main" is the owner's personal default when working solo with one Claude. Both true in different contexts.

### C2. Repo path discrepancy

- **HANDOFF_NEXT_PM §Repository says**: `/home/user/Launch-Database` (capital L, capital D).
- **Actual path on this VM**: `/home/user/launch-database` (lowercase). Branch present and correct.

**Recommended resolution**: HANDOFF_NEXT_PM's path is from a different VM. Use lowercase here.

### C3. Inspection vs Construction terminology

- **PROJECT_NORTH_STAR §1 (header) and §6.D say**: "Inspection."
- **ADMIN_FIXES_PLAN issue #6 says**: rename Inspection team → Construction; migration 0009 changes `jobs.team` enum + `staff.role` values.
- **Multiple downstream docs**: still use "Inspection" prose (north star, handoff).

The migration shipped (`d61a826`). `routes/inspection.js` filename intentionally retained ("RUS-program scope view, not team-bound").

**Recommended resolution**: in code, "construction" is canonical for new writes; "inspection" survives as compat shim for stale JWTs and the route filename. In prose, treat the two as synonyms when reading old docs.

### C4. PROJECT_NORTH_STAR layout vs reality

- **PROJECT_NORTH_STAR §5 says**: `index.html ~10000-line admin SPA`.
- **Actual filesystem**: `public/admin.html` (renamed during launcher consolidation, commit `3feeef2`). `index.html` no longer exists at `public/` root; `public/client/index.html` is the client launcher.

**Recommended resolution**: this CLAUDE.md uses `public/admin.html`. PROJECT_NORTH_STAR should be updated next pass.

### C5. PORTAL_MODE current status

- **PROJECT_NORTH_STAR §1 + §4 say**: `PORTAL_MODE` is the gate for which portal Railway service serves which SPA.
- **PORTAL_LAUNCHER_PLAN says**: drop PORTAL_MODE from production env vars; serve all portals from a single service via path routing. Phase 1 shipped (`3feeef2`).

**Recommended resolution**: production no longer sets PORTAL_MODE. Code still honors it as a fallback for the rollback plan. Old Railway services still alive for ~30 days post-cutover for QR-code link compatibility.

### C6. Migration slot 0009

- **PROJECT_NORTH_STAR §6.B says**: "Phase 2 ring cuts should land at `migrations/0007_splice_ring_cuts.sql` (or whatever the next free slot is)."
- **SPLICE_BUILD_PLAN says**: 0007 ended up holding `splice_strand_state`; 0008 holds `splice_strand_metadata`; 0009 holds the unrelated `rename_inspection_team_to_construction`.
- **Actual filesystem**: matches SPLICE_BUILD_PLAN.

**Recommended resolution**: SPLICE_BUILD_PLAN's slot accounting is canonical. PROJECT_NORTH_STAR's hint about 0006/0007 is stale.

### C7. server.js layout claim

- **PROJECT_NORTH_STAR §5 says**: "server.js ~3200 lines — wiring + 3 still-inline blocks (AI tools, hours CSV, v3 schema bootstrap)."
- **Actual `wc -l`**: 1189.

**Recommended resolution**: AI tools + hours CSV have been substantially extracted into route modules (`routes/ai.js` ~128 KB, `routes/hours_csv.js` ~44 KB). PROJECT_NORTH_STAR's 3200-line figure is pre-Track 1.3.

### C8. Slot 0023 missing

- **SPLICE_BUILD_PLAN §migration slot accounting** lists 0023 implicitly through slot allocation but no `0023_*.sql` file exists in `migrations/`.

**Recommended resolution**: slot was probably reordered and the file renamed during Phase 4-5 churn. Not a bug; document the gap.

### C9. customer.html status — "Under Construction" placeholder vs live

- **BUILD_PLAN §0.5 says**: customer portal UI is "Under Construction" placeholder; backend lives.
- **PORTAL_LAUNCHER_PLAN §Phases says**: client launcher's only tile is "Customer Portal" pointing at `customer.html`.

**Recommended resolution**: customer launcher tile lights up but lands on the UC placeholder. Owner has not green-lit going live.

### C10. Splice service domain

- **PROJECT_NORTH_STAR §6.B**: `launchfiber-splicematrix.xyz` placeholder hardcoded in design.html nav-tab + admin Portals dropdown.
- **PORTAL_LAUNCHER_PLAN**: `portal.launchfiber.com/splice.html` is the new path.

**Recommended resolution**: post-consolidation, all splice links are path-based at `portal.launchfiber.com`. The `launchfiber-splicematrix.xyz` references should have been search-and-replaced during commit `3027389` / `3c80a7c`. Verify if any stale URLs survive.

---

## 12. Claude observations

This is the orchestrator's voice — opinionated, candid.

### Biggest risk right now

**Disk leak is unidentified.** `Disk-T` is queued, the producer of the 250 GB-in-8h leak is not pinned down, and the bypass-token / audit-cleanup endpoints are now in place but the actual leak source has not been confirmed via `/api/_admin/disk-stats`. The Fix-A/B/C trio gave the system tools to survive a sick DB and recover gracefully, but the root cause is unaddressed. Until the operator runs the diagnostic and reports, we don't know which suspect is the bleeder (`time_entry_audit`, splice imports, AI uploads, splice loss records, audit JSON blobs). Volume bumped to 500 GB buys time, not a fix.

### Most valuable next move

**Run `/api/_admin/disk-stats` and `/api/_admin/db-sizes` against production**, paste the output into the next session, identify the producer, and write a targeted retention pass. Everything else (UI-A, OSP-1) is cosmetic compared to a system that crashed in 8 hours.

Second most valuable: actually verify post-cutover that `portal.launchfiber.com` is the bookmark of record for the team and the per-portal Railway services can be torn down. The 30-day window is closing.

### What's overengineered or speculative

- **Splice phase 5.D's MapLibre/Mapbox dual-codepath** is technically right (graceful fallback when no MAPBOX_TOKEN) but doubles the surface to test. Once Mapbox is the default-on production setup, the Esri fallback is rarely exercised and accumulates rot. Either commit to dual-render rigor or pick one.
- **`PORTAL_DEFS` `extra_teams` extension** — it's the right shape, but I haven't seen a non-admin user with extra_teams in any of the docs. It's pre-built capacity for a workflow nobody has demonstrated needing.
- **Pre-snapshot before undo** in Phase 5.E (every undo is itself undoable). Real, but adds a transactional snapshot op to every delete. Question whether the splice tool's "I just deleted the wrong cable" rate justifies that level of write amplification.
- **Custom-layer feature adding (Phase 5.H #7)** — drawing tools + per-layer feature CRUD without a structured attribute schema. Ships v1, but the free-form JSON textarea is a temporary affordance. Phase 5.I should land before this becomes a default workflow.

### What's underbuilt or under-tested

- **The splice tool has 7 test files (`splice*.test.js`)** but `routes/splice.js` is 306 KB. Test coverage relative to surface area is the lowest in the repo. Phase 4-5 shipped fast; verification was MCP browser sessions, not regression tests.
- **The PSC RUS PDF generator (`invoice_generator.js`, 1180 lines, gated on program='rus')** has one test file (`tests/psc_rus_pdf.test.js`) and is load-bearing for a major billing flow. Any regression here is a customer-facing money problem.
- **Customer portal** — backend has 5 GETs but the UI is permanently under construction. If "deferred" stretches past 6 months, either green-light it or remove the surface. Half-built features rot.
- **`runAuditCleanup` runs daily, non-FULL VACUUM in scheduler.** If `time_entry_audit` is ever the disk producer (likely), the daily vacuum holds a connection for minutes. There's no test for what happens during the window.
- **The `confirm()` → `confirmDialog()` migration in Phase 5.E** was 17 sites in `splice.html`. Were equivalent sites in `admin.html` / portal HTMLs migrated? Not addressed in the docs.

### Architecture smells

- **`schema.sql` + `bootstrapV3Schema()` + `migrations/`** are three sources of schema truth. Path B's `pricing_entries.project_type_id` resurrection bug (commits `755baa5` + `d0e3436`) is exactly the kind of regression that recurs as long as the dual-source-of-truth exists. The migration runner is the canonical path "going forward" — but `schema.sql` still runs every boot. **Track 1.4 is half-done; close it.**
- **`server.js` still has inline `bootstrapV3Schema()` ALTERs.** Every new column added there is a future migration debt. Discipline required to keep new schema in `migrations/` only.
- **`routes/splice.js` at 306 KB** is the kind of file that resists refactoring because no module wants to take a slice. Splitting along subsystem boundaries (locations, cables, closures, splices, imports, validation, PDF) would help, but the cost is real coupling discovery work.
- **Admin SPA is a single `public/admin.html` at ~10000 lines.** The owner is right that vanilla JS without a build step has been correct so far. But `public/js/*` already extracts 27 modules — the SPA is actually a multi-file system pretending to be single-file. The `<script src=...>` orchestration in admin.html and IIFE + `window.X = X` export pattern is duct tape. If this codebase grows to where multiple Claudes work in parallel often, the duct tape will fail.
- **`public/admin.html` is 450 KB.** The browser parses, paints, and lays out before any JS runs. On mobile, that's seconds of latency before anything is interactive. The launcher consolidation already exposed this when admins land on `/` and have to wait for `admin.html` to fully load before the first useful render. Code splitting is a real lever, but the build-step prohibition makes it hard.
- **`automation.js` hand-rolls the scheduler.** It works, but error semantics, missed-run recovery, and observability are all DIY. A scheduled-jobs library (or pg-boss / bullmq via redis) would professionalize this.
- **The AI tool `write_sql` exists** (per PROJECT_NORTH_STAR §1). That's a load-bearing trust boundary — Claude can run arbitrary SQL through the approval gate. The approval gate is the entire safety story. If the gate ever fails open, the consequence is data loss. Worth a security review pass.
- **JWT secrets distributed across services** (PROJECT_NORTH_STAR §7 — "set the SAME JWT_SECRET on every service"). The launcher consolidation reduces this to one service in production, but the multi-service rollback plan re-distributes. If any service leaks the secret, all services are compromised. Consider rotating to per-issuer keys with JWKS once the migration window closes.

### Direct take

The codebase is genuinely impressive for one operator + AI. It's also clearly the work of an owner who likes data depth and lets it accumulate. The splice tool went from 0 to "VETRO-grade" in three weeks of intense Claude work — that's real. The Path B refactor cleaning up `clients.is_rus`/`project_types` was overdue and shipped clean.

The biggest threat is operational: the disk leak is an unsolved mystery, the audit pipeline retention is new (tests exist but production data hasn't aged into them yet), and the team-of-one structure means there's no second pair of eyes on "did anything go wrong while we were sleeping."

What to optimize for next: **operational confidence**. Diagnostics endpoints. Identify the leak. Get the volume usage chart flat. Then resume feature work.

---

## 13. Standing rules (orchestrator-level)

- **Branch**: `claude/debug-previous-issues-MoN9D`. Push only to this branch.
- **No `--no-verify`**, no skipping hooks, no `--no-gpg-sign`.
- **No PRs unless explicitly asked.**
- **Sequential push to shared branches.** Concurrent pushes race git's index.
- **Pipeline for fixes**: dual auditor → red-team consolidator → fix → self-verify. Manager (Opus) verifies + ships, never reviews inline.
- **Manager dispatches everything.** `YOU ALWAYS NEED TO DISPATCH AGENTS YOU ARE JUST A MANAGER`. Even single-line research = delegation.
- **Manager keeps `/home/user/manager-notes.md` as session-level source of truth** (this CLAUDE.md is repo-level).
- **Original planning docs preserved through the audit pipeline.** Don't edit / delete `PROJECT_NORTH_STAR.md`, `BUILD_PLAN.md`, `ADMIN_FIXES_PLAN.md`, `HANDOFF_NEXT_PM.md`, `PORTAL_LAUNCHER_PLAN.md`, `SPLICE_*.md`, `README.md` until the audit pipeline approves cleanup.
- **No source-code modifications** in merge/cleanup commits. Docs only.
- **Test DB** for verifications: `postgresql://lftest:lftest@localhost:5432/launchfiber_test` (local Postgres started via `sudo service postgresql start`).
- **Test command**: `DATABASE_URL=postgresql://lftest:lftest@localhost:5432/launchfiber_test npm test`. Target: 154/154 green.
- **Commit messages**: brief title (~60 chars), body explains why. Trail with the Claude session URL the harness gives.
- **Don't commit secrets**: `.env`, credentials. `.gitignore` covers `.env*`, `uploads/`, `node_modules/`, `playwright-report/`, `test-results/`, `package-lock.json`.

---

## 14. File / directory map

```
launch-database/
├── README.md                          # Railway deploy steps
├── PROJECT_NORTH_STAR.md              # original entry-point doc (preserved)
├── BUILD_PLAN.md                      # original feature-batch plan (preserved)
├── ADMIN_FIXES_PLAN.md                # original 8-issue plan (preserved)
├── HANDOFF_NEXT_PM.md                 # original PM handoff (preserved)
├── PORTAL_LAUNCHER_PLAN.md            # original launcher plan (preserved)
├── SPLICE_BUILD_PLAN.md               # original splice roadmap (preserved)
├── SPLICE_COMPETITIVE_RESEARCH.md     # original competitive research (preserved, partial)
├── SPLICE_MATRIX_SUGGESTIONS.md       # original audit punch-list (preserved)
├── CLAUDE.md                          # THIS FILE — canonical merged context
├── CLEANUP_CANDIDATES.md              # cleanup survey
│
├── server.js                          # Express boot, route wiring (~1190 lines)
├── auth.js                            # JWT auth + user CRUD (~730 lines)
├── automation.js                      # scheduler + audit cleanup + projection (~1150 lines)
├── db.js                              # pg pool + initSchema (~250 lines)
├── db_migrations.js                   # versioned migration runner (~120 lines)
├── portal_module.js                   # PORTAL_MODE-conditional + setting-change-requests (~1045 lines)
├── timeclock_module.js                # /api/timeclock/* + audit logger (~790 lines)
├── invoice_generator.js               # PSC RUS PDF (pdfkit) (~1180 lines)
├── invoice_template_engine.js         # AI invoice templates (puppeteer) (~600 lines)
├── schema.sql                         # base schema (still partial source of truth)
├── package.json
├── playwright.config.js
├── nixpacks.toml                      # Railway build config
├── railway.json                       # Railway deploy config
├── .env.example
├── .gitignore
│
├── routes/                            # ~30 route modules
│   ├── _csv_stage.js                  # shared csvStage Map
│   ├── _helpers.js                    # backend helpers
│   ├── _splice_validation.js          # splice validation engine
│   ├── _sse.js                        # SSE broadcast bus
│   ├── ai.js                          # ~128 KB — AI chat + tools + approval gate
│   ├── splice.js                      # ~306 KB — entire splice subsystem API
│   ├── admin.js                       # ~60 KB — admin endpoints (disk-stats, audit-cleanup, etc.)
│   ├── projects.js, time_entries.js, billing.js, … (24 more)
│
├── public/                            # frontend (no build step)
│   ├── admin.html                     # ~10000-line SPA (450 KB)
│   ├── splice.html                    # splice editor (480 KB)
│   ├── splice_view.html               # public read-only splice viewer (token-gated)
│   ├── design.html, permitting.html, timeclock.html, customer.html
│   ├── launcher.html                  # employee launcher
│   ├── client/index.html              # client launcher
│   ├── login.html
│   ├── app-shell.css, launcher-back.css
│   ├── toast.js, keyboard.js
│   ├── img/launch-fiber-logo-transparent.png
│   └── js/                            # 27 admin tab modules
│
├── migrations/                        # 29 versioned SQL files (slot 0023 missing)
│   └── README.md
│
├── tests/                             # node --test backend smoke + Playwright browser
│   ├── _helpers.js, _sanity.test.js
│   ├── ai_*.test.js, audit_cleanup.test.js
│   ├── csv_import.test.js, hours_*.test.js
│   ├── inspection_attribution.test.js
│   ├── project_tree_delete.test.js
│   ├── psc_rus_pdf.test.js
│   ├── schema_shape.test.js
│   ├── splice*.test.js (7 files)
│   ├── split_statements.test.js
│   ├── sse_leak.test.js
│   └── browser/ (Playwright specs)
│
├── research/                          # competitive corpus for splice tool
│   ├── 01_ozmap_vetro.md
│   ├── 02_gis_platforms.md
│   ├── 03_legacy_autocad.md
│   ├── 04_newer_others.md
│   ├── 05_adjacent.md
│   ├── 06_ui_patterns.md
│   ├── 07_vetro_visual_match.md
│   └── 08_vetro_deep_dive.md
│
├── .claude/
│   └── agents/project-tracking.md     # team-shared subagent persona (version-controlled)
│
└── .github/workflows/test.yml         # CI: node --test + Playwright on every push
```

### Likely-unused / cleanup candidates flagged for survey

See `CLEANUP_CANDIDATES.md`.

---

## 15. Open questions for the user

1. **Disk-leak producer** — what does `/api/_admin/disk-stats` return when triggered against production? Without that, the next mitigation is a guess.
2. **PORTAL_MODE per-portal services** — are the per-portal Railway services torn down yet? Per PORTAL_LAUNCHER_PLAN the 30-day window from 2026-05-07 closes around 2026-06-06. If they're still running, that's spend.
3. **Customer portal UI** — green light to ship the actual customer.html SPA, or hold? It's been "Under Construction" since the customer-clients junction shipped.
4. **Splice tool Phase 6 vs other-feature focus** — splice is at "Phase 5.H complete." What's the priority order for: Phase 4.7 fusion-splicer ingest follow-on, Phase 5.I structured custom-feature attributes, OSP-1 sister repo bring-up, customer portal go-live?
5. **Logo screenshot for UI-A** — the launcher + login redesign is queued pending a logo screenshot. Is that delivered? Does `public/img/launch-fiber-logo-transparent.png` (added in commit `46f29e9`) suffice as the "no-background variant"?
6. **OSP-Design-Training tile** — schema and entry shape? Single tile pointing at an external URL, or embedded route in this service?
7. **Audit retention floors** — `AUDIT_RETENTION_DAYS_LOW` defaults to 14d; the Fix-A handoff suggests setting to 7 if 14d is still too much. Has the operator made that call?
8. **Bookmark migration status** — has the team transitioned to `portal.launchfiber.com` as the bookmark of record?
9. **`MAPBOX_TOKEN`** — is it set on production? Without it the splice map falls back to Esri raster, which is the documented degraded-mode but not the intended UX.
10. **Stale `launchfiber-splicematrix.xyz` references** — were the search-and-replace passes for the old splice service URL completed? PROJECT_NORTH_STAR §6.B mentions hardcoded references in `public/design.html` (nav-tab) and `public/admin.html` (Portals dropdown).

---

*End of CLAUDE.md. The original eight planning docs remain at the repo root for the audit pipeline. Update this file as authoritative going forward.*
