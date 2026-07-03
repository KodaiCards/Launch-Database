# 01 — Spine (`server.js`, 2293 lines)

> Mapped 2026-06-29 (first-hand, full read). The boot file: middleware order, route mounts, security model, boot sequence, and a large amount of legacy rollup-tree machinery. This is the backbone everything hangs off.

## What it is / its job
Single Express app. Loads middleware → installs auth (which globally populates `req.user`) → mounts ~55 route modules → error handlers → SPA fallback → `start()` runs all schema bootstraps + the migration runner, then `app.listen`. Exports `{ app, start }`; auto-starts only when run directly (`require.main === module`), so tests import it and call `start({port:0})`.

## Middleware order (registration order = execution order — this ordering IS the security model)
1. `app.set('trust proxy', 1)` — Railway LB hop; MUST precede anything reading `req.ip`/`req.protocol` (else rate-limit buckets everyone into one IP + CSRF same-origin check breaks).
2. **Security headers** — `nosniff`, `X-Frame-Options: DENY`, HSTS (1yr) when https.
3. **CORS** — locked to `ALLOWED_ORIGINS` (comma-env); localhost allowed in dev; `credentials:true`. Empty in prod → warns, cross-origin rejected.
4. `express.json({limit:'10mb'})` + `express.urlencoded({limit:'1mb'})`.
5. **CSRF guard** — for state-changing methods, requires no-Origin OR Origin/Referer ∈ ALLOWED_ORIGINS / same-host. `/api/auth/login` special-cased (login-CSRF). **Bearer-header callers exempt** (header not auto-sent cross-site). 
6. `PORTAL_MODE` read (env: ''=admin, design/permitting/timeclock/splice/customer).
7. **`installAuthRoutes(app, pool)`** ← registers cookieParser + authMiddleware GLOBALLY → `req.user`. Everything after sees `req.user`; anything before doesn't. Source of `requireAuth`(factory) / `requireAdmin`(mw) / `requireManagerOrAdmin` / `canAccessPortal` / `canCreateProjects` / token helpers / `rateLimitOk` / `cookieOpts`.
8. **Customer scope guard** (security-critical) — `req.user.role==='customer'` may hit ONLY `/api/auth/*`, `/api/customer/*`, `/api/me/portals`; every other `/api/*` → 403. Defense against a customer JWT reading `/api/projects` etc.
9. **`PORTAL_DEFS` + `GET /api/me/portals`** (the launcher feed) — see below.
10. `installPortalExtensions` (portal_module.js) → 11. timeclock module (routes + `makeAuditLogger` → `auditTimeEntry`, reused by time_entries) → 12. automation module (routes; scheduler started later) → 13. SSE (`_sse.attach`, after auth, before static).
14. **Public-path auth gate** (`pageRequiresAuth` + middleware): unauthed → `/login` redirect (HTML) or 401 (`/api`). Public: `/login`, `/signup`, `/api/auth/*`, `/toast.js`,`/keyboard.js`,`/css/app-shell.css`,`/js/app-shell.js`,`/img/*`,`/favicon.ico`, `/splice/field/*`, `/splice/view/*`, `/api/splice/view/*`. **`APP_PASSWORD` HTTP-Basic fallback** (transition; timing-safe compare; synthesizes an admin `req.user`).
15. PORTAL_MODE endpoint blocks (non-admin portals 403 on `/api/revenue|invoices|billing|ai|hours|dashboard` + upload routes).
16. **Static serves (order matters):** `/training`(auth SPA)→ sw-dwg-sync.js → `/client`(token-auth at API layer, not here) → `/photos`(auth PWA) → `/workspace`(auth) → `/downloads/installers`(auth, INSTALLERS_DIR) → `express.static(public)` → **`/uploads`** (auth + path-traversal guard + `Content-Disposition: attachment` for non-image/non-PDF — **SVG forced to attachment = stored-XSS prevention**).

## PORTAL_DEFS + the lockdown (launcher)
`PORTAL_DEFS[]` = tiles: admin, **operations** (`/service-areas.html` — the keystone tool, `canAccess` admin|design|permitting), splice, design, permitting, timeclock, **training**, customer(client), client_portal, offline_sync, workspace, downloads, file_activity. Each has `canAccess(user)`.
`GET /api/me/portals` filters by audience + canAccess + `user_portal_access` overrides. **⚠ `TRAINING_ONLY_LOCKDOWN = true` is HARD-CODED (line ~373):** non-admin employees see ONLY the training tile; admin sees all; customers untouched. Sets `can_request_access`. → This is the training-pivot lockdown; it's a code constant (per D013 should be config/data). It's *why* non-admin staff see only training.

## Route-mount inventory (~55 modules, each `require('./routes/X')(app, pool, mw)`)
clients · contracts · engineering_contracts · jobs · project_types · pricing · staff · **people** (new merged roster) · projects · **service_areas** (keystone) · my_work · hours_summary · money_view · billing_keystone · projections · map_integration · projects_tree · export_bundle · cluster_views · search · audit_view · system_info · undo · time_entries · hours_csv · hours_import · ai · project_detail · permits · project_documents · dwg_two_way_sync · admin · budgets · potential_permits · concentrators · dashboard · design_pipeline · inspection · recent_activity · revenue · audit_log · project_photos · downloads · file_activity · invoices · invoice_templates · customer_portal · project_billing · reports · billing · splice · training · access_requests · portal_access · client_portal · client_portal_v2 · folder_workspace(`app.use('/api/workspace')`) · dwg_sync · impersonation.
Inline in server.js: `POST /api/admin/diag/wave14-cleanup`, `GET /api/admin/diag/rollup-state`, `GET /api/config/mapbox`.

**⚠ Auth-gating is passed per-mount via the `mw` object, and a missing arg SILENTLY NO-OPS** (module destructures `mw.requireAuth`; if not passed → `undefined` → route ungated). History shows this bit hard: an "H-1" pass *added* `requireAuth` to many GETs that were leaking unauthenticated (clients, contracts, ECs, staff, pricing, reports, project_detail, concentrators, budgets), and "C-2/C-3" fixed `potential_permits` + `inspection` which had `{}` (no-op) instead of real mw. **REAPPROACH trigger:** when mapping each route module, verify its *actual* gating matches what server.js passes — this is a recurring vuln pattern.

## Error handling / fallback
`app.use('/api', errHandler)` (multer `LIMIT_FILE_SIZE`→413 w/ real cap; else JSON 500) → `/api` 404 JSON guard → portal HTML aliases (`/permitting`,`/design`,`/client-portal`,`/offline-sync`) → `/index.html`→`/admin.html` → PORTAL_MODE single-portal serve (injects `ADMIN_API_BASE`, routes `/uploads`→admin service) → `/`→launcher (customer→`/client/`) → `*`→404 (unified) / portal HTML (PORTAL_MODE).

## Boot sequence — `start(opts)`
`safeBootstrap(label, fn)` wraps EACH step so a DB failure never blocks `app.listen` (so disk-recovery endpoints stay reachable). Order: `initSchema` → `bootstrapV3Schema` → `bootstrapAuthSchema` (users + seeds default admin) → `bootstrapDefensiveRecentMigrations` → `applyDeferredSchemaStatements` → `bootstrapTimeClockSchema` → **`runMigrations(pool)` (db_migrations.js)** → automation scheduler (unless `skipScheduler`) → audit auto-archive (env `AUDIT_AUTO_ARCHIVE_ENABLED`) → workspace purge (env `WORKSPACE_AUTO_PURGE_ENABLED`) → `app.listen`. Socket timeouts set to 30 min (multi-GB uploads).

## ⚠ BIG FINDING — migrations DO run on boot (contradicts handoff guidance)
`start()` calls `runMigrations(pool)` on **every** boot (line ~2191). The HANDOFF/memory says "Railway `startCommand=node server.js` skips `prestart`→`auto_migrate.js`, so migrations don't auto-run; apply manually." But `server.js start()` runs the migration runner itself, independent of `prestart`. **So pending migrations likely DO auto-apply on every Railway deploy.** → **VERIFY** (logged O13); if confirmed, the "apply migrations manually" rule is stale and should be corrected in memory/HANDOFF. This is a plan-vs-built discrepancy.

## Legacy machinery that runs EVERY boot (history + cleanup target)
- **`bootstrapV3Schema()`** — big idempotent DDL block for the **legacy rollup model** (`projects.is_rollup/rollup_level/rollup_key`, `is_ongoing`, `show_contract/show_work_order`), FK→RESTRICT swaps (no accidental cascade nukes), FK indexes, and creates `engineering_contracts`, `invoice_templates`, `customer_clients`, `billing_batches`/`billing_batch_items`, `undo_buckets`. **Plus the HARD-CODED canonical jobs seed** (the job catalog — see below).
- **`bootstrapDefensiveRecentMigrations()` + WAVE 14/19/20** — hundreds of lines of idempotent SQL building/reparenting/dedup/renaming the **legacy rollup folder tree** (Client→EC→SA→Contract folders inside `projects`). This is the rollup-of-rollups the keystone replaces. It runs on every startup. → **Major cleanup target** once the keystone cutover completes; also the clearest artifact of the program's history (the pre-keystone data model).

## ⚠ The hard-coded job catalog (`jobsToSeed`, line ~1502) — important
The 12 canonical jobs are a JS array seeded on boot (respecting `jobs.manually_overridden_at` so admin edits survive): **County/DOT/RR Permitting** (footage, code a-2-D), **Resident Engineer** ($100/hr, g-1-B-1, construction), **Inspection** ($90/hr, g-1-B-4, construction), **Update Plant Records** / **OSP Staking Aerial** / **OSP Staking Underground** ($850 footage, design), **Construction Progress Reports** (g-1-I-3, both), + 3 non-PSC (OSP Design & Fiber Assignments, Staking Fiber Assignments, Records Management). This is the **RUS job catalog Carter described** (the real codes/rates). **Per D013 this should be DATA, not a code array** — currently it's hard-coded + re-seeded each boot. (Note: matches BUSINESS.md's RUS disciplines.)

## Open questions / flags raised → (also in open_items)
- **O13 VERIFY:** does `runMigrations` actually auto-apply on Railway boot? (correct the "apply manually" guidance if yes).
- The hard-coded **job catalog** + **TRAINING_ONLY_LOCKDOWN** flag are config-as-code → D013 candidates.
- **No staging gate** (main→prod auto-deploy) — confirms O10.
- Legacy rollup boot machinery is a large cleanup target post-cutover.

## Reapproach-if
- When mapping `auth.js` (02): confirm the exact role list + how `canAccessPortal`/`requireManagerOrAdmin` resolve (referenced heavily here).
- When mapping each route module: verify actual auth gating vs the `mw` passed here (the silent-no-op pattern).
- When mapping keystone (03) + projects (06): the legacy rollup tree vs `service_areas` coexistence — confirm which the live operations cluster actually uses.
