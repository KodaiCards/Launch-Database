# CLAUDE.md — Launch Database

> **⚖ GOVERNANCE (2026-07-02 canon): read [`law/CONSTITUTION.md`](law/CONSTITUTION.md) FIRST**, then the rest of `law/` (PRODUCT_BAR → PLAN → GATES → DECISIONS), then [`ops/COMMS.md`](ops/COMMS.md). Chain: **Carter > Partner (law) > Registrar (merge/enforce) > Foremen / Verification Owners.** Role boot prompts: [`law/BOOT.md`](law/BOOT.md). **Boot read = law/ + ops/COMMS + your claimed issue's spec — nothing else** (~5k tokens; growth is a defect). `docs/` is pull-on-demand reference. The pre-canon planning corpus is archived at `archive/planning-2026-06/` — history, not law.

## What this is

An internal multi-portal operations platform for **Launch Fiber Services** (Macon, GA — solo founder, Carter). It runs the day-to-day of a fiber engineering services firm: projects, time tracking, billing/invoicing, permitting + design pipelines, a fiber splice-matrix tool, an OSP/ISP training app, and client/customer portals. Primary client today is **PSC**, much of it on **RUS** (government) engineering contracts — real revenue + government project tracking; the quality bar is high. **RUS is a program profile, never a client assumption** (law §7) — future RUS work may be a different client, rates, codes, SAs, WO#s.

**Stack:** Express + vanilla JS (no frontend framework; inline scripts per portal + shared modules in `public/js/`) + PostgreSQL. Puppeteer for PDF rendering, Playwright for browser tests. React/Vite for the training SPA only. Deployed on **Railway** (auto-migrates on deploy).

## Run it

- `npm start` — prod boot (runs `scripts/auto_migrate.js` via `prestart`; aborts deploy if a migration fails).
- `npm run dev` — nodemon dev server.
- `npm run migrate` — run pending migrations manually.
- `npm run schema:sync` — regenerate `schema.sql` from migrations + pg_dump.
- `npm test` — backend unit tests. `npm run test:browser` — Playwright E2E.
- `npm run build:osp` — build the training SPA (`osp-training/`) into `public/training/`.
- `npm run premerge` — the merge floor: build + lint + Playwright lesson walk + tests (see `law/GATES.md`).

**Requires** `DATABASE_URL`. Other env: `JWT_SECRET`, `ADMIN_PASSWORD`, `ALLOWED_ORIGINS`, `PORTAL_MODE` (empty = admin; or `design`/`permitting`/`timeclock`/`splice`/`customer`), `ANTHROPIC_API_KEY`, `UPLOAD_DIR`. Node ≥ 18.15.

## Layout

- `law/` — governance + standards (the boot read). `specs/` — ratified feature specs + `ideas/` + `CALLUPS.md`. `ops/` — COMMS (board mechanics, FROZEN), INVENTORY (feature-state map, Registrar-owned).
- `server.js` — boot, middleware order, auth install, portal launcher, route wiring. `auth.js` — JWT + cookie auth, roles, rate limiting.
- `routes/*.js` — one module per area. `_helpers.js`, `_sse.js` shared.
- `public/*.html` + `public/js/*.js` — the portals on a shared design system (`public/css/app-shell.css` + `public/js/app-shell.js`; light + dark).
- `migrations/00xx_*.sql` — ordered, idempotent. `schema.sql` = generated snapshot.
- `osp-training/` — training SPA source (separate build → `public/training/`).
- `desktop/` — Electron app (field/offline, peripheral). `map/` + `public/map/` — the working Leaflet map tool.
- `docs/` — reference only: `route_index.md` (API map), `security_model.md`, `design_system.md`, `map_requirements.md`, PRODUCT_PLAN/IMPLEMENTATION_PLAN (subordinate to specs).

## Domain model

`Client → [Engineering Contract (RUS program) → Construction Contract] → Service Area/Concentrator → Jobs` (line items: discipline · employee · billing type · rate · hours · $ · status · dates). Non-RUS service areas sit directly under the client. **County is the universal first grouping level** (law §7). SA total = Σ jobs → billing. Hours attribute to a **job, an area/WO, or overhead** — never orphaned (L-004). Keystone schema is live (migration 0064); the legacy `admin.html` rollup tree is being retired (cutover = PLAN 2.3).

## Deployment gotchas (hard-won)

- **Migrations DO auto-run on deploy** — `node server.js` → `start()` → `runMigrations()`. `npm start` also migrates via `prestart`.
- **CRLF fakes "stale deploy" diffs:** `core.autocrlf=true` — never byte-compare a live asset against the working tree; use `git show <ref>:path` or `tr -d '\r'`.
- **`tests/` is plural** — `npm test` globs `tests/*.test.js`.
- **Money math is server-side only; customer-facing surfaces never leak internal $** — verify on every merge that touches portals.
- Domain: **`launchfiber.app`** (canonical). ⚠ Any new domain MUST be added to `ALLOWED_ORIGINS` (comma-separated, exact `https://…`, no trailing slash) or CORS rejects it (`server.js:74/84`). Auto-deploys from `main`; **one shared DB** (dev = prod — treat destructive ops accordingly; backups on).
- CI (GitHub Actions) is permanently dead — `npm run premerge` locally is the safety net.

## How we work

Everything is in `law/` — don't duplicate it here. Shortest version: build only from ratified specs; every package gets independent verification (never self-certified); only the Registrar merges `main`; only Carter flips visibility; ≤4 active workers; chat casual, product polish high; push back when warranted; confirm before destructive/irreversible actions.
