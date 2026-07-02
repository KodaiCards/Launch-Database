# CLAUDE.md — Launch Database

> **New instance? Governance + current state live in `planning/`.** Read [`planning/ROLES.md`](planning/ROLES.md) (chain of command: **Carter > Planning > CEO > Builders/Auditor**) then YOUR role charter: [`planning/PLANNING.md`](planning/PLANNING.md) (Planning) / [`planning/CEO.md`](planning/CEO.md) (CEO) / [`planning/AUDITOR.md`](planning/AUDITOR.md) (Auditor). Boot text per role: [`planning/BOOT_PROMPTS.md`](planning/BOOT_PROMPTS.md). Current state: [`planning/INVENTORY.md`](planning/INVENTORY.md) + `planning/PLANNING.md` CURRENT STATE. (`HANDOFF.md` is retired — a tombstone points here.)

> Older process docs are archived at `docs/archive/`. This file is the lean project background; product plan = `docs/PRODUCT_PLAN.md` + `docs/IMPLEMENTATION_PLAN.md`; phased build = `ROADMAP.md`.

## What this is

An internal multi-portal operations platform for **Launch Fiber Services** (Macon, GA — solo founder, Carter). It runs the day-to-day of a fiber engineering services firm: projects, time tracking, billing/invoicing, permitting + design pipelines, a fiber splice-matrix tool, an OSP/ISP training app, and client/customer portals. Primary client is **PSC**, much of it on **RUS** (government) engineering contracts — so the data is real revenue + government project tracking. Quality bar is high.

**Stack:** Express + vanilla JS (no frontend framework; inline scripts per portal + shared modules in `public/js/`) + PostgreSQL. Puppeteer for PDF rendering, Anthropic SDK for the AI assistant, Playwright for browser tests. Deployed on **Railway** (auto-migrates on deploy).

## Run it

- `npm start` — prod boot (runs `scripts/auto_migrate.js` via `prestart` first; aborts deploy if a migration fails).
- `npm run dev` — nodemon dev server.
- `npm run migrate` — run pending migrations manually.
- `npm run schema:sync` — regenerate `schema.sql` from migrations + pg_dump (deterministic; CI checks this matches).
- `npm test` — backend unit tests (Node test runner).
- `npm run test:browser` — Playwright E2E specs.
- `npm run build:osp` — build the training SPA (`osp-training/`) into `public/training/`.

**Requires** `DATABASE_URL`. Other env: `JWT_SECRET`, `ADMIN_PASSWORD`, `ALLOWED_ORIGINS`, `PORTAL_MODE` (empty = admin; or `design`/`permitting`/`timeclock`/`splice`/`customer` for single-tenant instances), `ANTHROPIC_API_KEY`, `UPLOAD_DIR`. Node >= 18.15.

## Layout

- `server.js` — boot, middleware order, auth install, portal launcher (`PORTAL_DEFS`), route wiring.
- `auth.js` — JWT + `lfs_session` cookie auth, roles, `requireAuth`/`requireAdmin`/`requireManagerOrAdmin`, rate limiting.
- `routes/*.js` — one module per area (projects, jobs, contracts, engineering_contracts, clients, billing, invoices, revenue, permits, design_pipeline, inspection, time_entries, training, splice, client_portal*, customer_portal, dashboard, folder_workspace, dwg_sync, etc.). `_helpers.js`, `_sse.js`, `_audit.js` are shared.
- `public/*.html` + `public/js/*.js` — the portals (admin, design, permitting, timeclock, splice, customer, client, login, workspace, photos, downloads, offline-sync) on a shared design system: `public/css/app-shell.css` + `public/js/app-shell.js` (topbar/sidebar/toast/modal/skeleton/theme; light + dark).
- `migrations/00xx_*.sql` — ordered, idempotent. `schema.sql` is the generated snapshot.
- `osp-training/` — React/Vite source for the training SPA (separate build).
- `desktop/` — Electron app (field/offline use).
- `research/` — GIS/mapping platform studies (OZMap, Vetro, etc.) — input for the future map feature.
- `docs/` — current reference (route_index, security_model, design_system, feature_inventory, API docs).

## Domain model (current → target)

**Today:** projects form a rollup-of-rollups tree (`Client → Engineering Contract → Service Area → Job-leaf`), all `projects` rows distinguished by `is_rollup`/`rollup_level`/`rollup_key`. This is being replaced — it's the main source of UX friction.

**Target (see `ROADMAP.md`):** the **Service Area / Concentrator is the unit of work**, with **jobs as line items inside it** (each job: discipline, employee, billing type, rate, hours, status, $, dates). Service-area total = sum of its jobs → feeds invoicing. **Engineering Contract stays visible and means RUS**; non-RUS work sits directly under the client. Clients see their service areas' status; maps + materials attach per service area.

Key terms: **EC** = engineering contract (umbrella, carries `program`: rus/bau/gfr/other). **RUS** = the government program (PSC's). **Service Area / Concentrator** = a unit of work for a client. **Job** = a billable discipline within it (permitting/design/inspection/construction). Hours roll into a job's $ and into the Hours tab per person+job. **D014 (planned, not yet built): COUNTY becomes the top organizing level** — Service Areas nest within a county and can be non-RUS; a permit always shows under its County (+ its SA if it has one). See `planning/decisions.md` D014.

## Deployment gotchas (hard-won — kept from the retired HANDOFF)

- **Migrations DO auto-run on deploy** — Railway runs `node server.js` → `start()` → `runMigrations()` (corrected 2026-06-29; the old "startCommand skips auto-migrate" note was wrong). `npm start` also migrates via `prestart`.
- **CRLF fakes "stale deploy" diffs:** `core.autocrlf=true` means working-tree files are CRLF but deployed blobs are LF — never byte-compare a live asset against a working-tree file; use `git show <ref>:path` or `tr -d '\r'`. When "nothing changed on the URL," suspect routing/launcher/tile before the pipeline.
- **`tests/` is plural** — `npm test` globs `tests/*.test.js`; a file in `test/` is invisible.
- **Money math is server-side only; customer-facing surfaces never leak internal $** (rate/estimated/actual/cost/margin) — verify on every merge that touches portals.
- Railway domain: **`launchfiber.app`** (canonical as of 2026-07-02, Carter; old `launchfiberadminportal.xyz` kept during the transition). ⚠ **Any new domain MUST be added to the `ALLOWED_ORIGINS` env var (comma-separated, exact `https://…`, no trailing slash) or CORS rejects it — the "origin not allowed" error** (`server.js:74/84`). auto-deploy from `main`; **one shared DB** (dev = prod — treat destructive ops accordingly; backups are on as of 2026-07-01).

## How we work (governance source of truth = `planning/ROLES.md`)

- **Chain: Carter (founder, final say) > Planning Agent (source of truth; owns `planning/` + all root docs; adjudicates + merges) > CEO (architecture + build) > Builders/Auditor.** Workers are **branch-scoped** — they post work + thread entries (`planning/threads/<agent>.md`) to their OWN branch, **never main**; Planning's branch-aware watcher picks it up, reviews, and curates/merges to `main`. **All directive/scope/schema/convention changes come from Planning only** (Carter above it) — a worker wanting one posts a `PROPOSAL`/`BLOCKED` note on its thread and holds, never decides unilaterally. **Foundation first, then fan out** — the keystone data-model rebuild lands before downstream tracks parallelize.
- **Claude writes code directly.** The old "manager never writes code, route every fix through a sub-agent" rule is retired. Use sub-agents/parallelism only when a task is genuinely parallel or large — with judgment, not ritual.
- **Cost discipline: cheap + accurate over haste.** Prefer the lower-token approach as long as accuracy holds. No agent fan-out or exhaustive multi-pass workflows for their own sake — minimum that yields a correct result. Cut verbosity and redundant exploration; never cut accuracy.
- **Product polish bar is high; chat is casual.** Carter is direct/decisive, dislikes confirmation pop-ups, wants everything streamlined and auto-populated ("if X then Y" with override). Push back when warranted — he asks, he doesn't order. Confirm before destructive/irreversible actions (data wipes, Railway service deletion, force-push).
- **Git:** work on a branch, not `main`, unless told otherwise. Commit/push only when asked.

## Pointers

- `ROADMAP.md` — the phased plan (Phase 0 cleanup → keystone rebuild → accounts → billing → timeclock → client portal → KMZ sync → real-time → search → materials) with locked decisions and open items.
- `docs/route_index.md`, `docs/security_model.md`, `docs/feature_inventory.md` — current architecture reference.
