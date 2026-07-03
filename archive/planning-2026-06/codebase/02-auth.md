# 02 — Auth (`auth.js`, 821 lines)

> Mapped 2026-06-29 (full read). The authn/authz core: JWT, roles, the middleware everything gates through, the users table, admin user CRUD, impersonation. Installed globally by `server.js` step 7 (`installAuthRoutes`).

## Config / constants
- `JWT_SECRET` — **FATAL exit in prod if unset**; dev gets an ephemeral random (sessions die on restart). `JWT_EXPIRY='7d'`, cookie `lfs_session`, `BCRYPT_ROUNDS=12`, `MIN_PASSWORD_LEN=10`.
- **Cross-service token isolation:** `JWT_AUDIENCE` (env, default `'lfs'`) + `JWT_ISSUER` (env, default `'lfs-auth'`) signed AND verified — a token minted on another service sharing the secret still fails aud/iss. (Note: staging/prod should pin different audiences — relevant to the demo/dev-env idea.)
- **Rate limiter** = in-memory sliding window. **⚠ single-process only** — multi-instance/scaled deploys get per-process limits (weaker brute-force protection) + state resets on restart. Test bypass requires BOTH `NODE_ENV=test` AND `LFS_DISABLE_RATELIMIT_FOR_TESTS=1` (hardened so a misconfigured prod can't disable it).
- `DUMMY_HASH` — bcrypt-compared when username not found → constant-time login (anti user-enumeration).

## Roles & team model
`VALID_ROLES` = **admin · design_manager · permitting_manager · design_engineer · permitting_engineer · contractor · customer · trainee**.
- `teamForRole`: `design_*`→design, `permitting_*`→permitting, `construction_*`/`inspection_*`→construction.
- `teamsForUser`: admin → [design,permitting,construction]; else primary team + `users.extra_teams[]` (multi-team membership).
- `canAccessPortal(user, mode)`: admin always; else team ∈ teamsForUser.
- `isManagerOrAdmin`: admin | design_manager | permitting_manager.
- **`canCreateProjects` (Wave 15) = the ONLY capability mechanism today:** admin/manager yes; customer no; else looks for a `user_portal_access` row with sentinel key `__cap_create_projects__`. DB error → deny non-managers. → **This is the embryo of System F** (capability grants) — currently a single magic-key capability, no general `requireCapability`. System F is genuinely unbuilt.

## users table (bootstrapAuthSchema)
`users(id, username UNIQUE, password_hash, role, team, full_name, email, active, created_at, last_login, updated_at)` + added cols: `theme`, `extra_teams TEXT[]`, `tokens_invalid_after TIMESTAMPTZ`, `dashboard_layout JSONB`, **`staff_id`** (the link to `staff` — added elsewhere; used here in joins). Also adds `created_by_user_id`/`updated_by_user_id` to projects, `user_id` to time_entries, `uploaded_by_user_id` to permit_documents.
**Admin seed:** from `ADMIN_PASSWORD` env — creates `admin` if missing; **⚠ REFRESHES the admin password on EVERY boot if `ADMIN_PASSWORD` is set** (+ appends to `/var/log/lfs/admin_password_bootstrap.log`). So if the env var stays set, every deploy resets admin's password to it (a UI password change would revert next deploy). Reactivates a disabled admin.

## Session mechanics
- `signToken` {id,username,role,team}+aud/iss; `verifyToken` HS256+aud+iss; `extractToken` = cookie first, then `Bearer` header.
- **`tokens_invalid_after`** = the revocation lever: logout, password change, deactivate all bump it to NOW(); `authMiddleware` + the SSE heartbeat reject any token with `iat` older than it. Clean stateless-ish revocation.
- **`authMiddleware` is POPULATE-ONLY** (sets `req.user` or just `next()` with none) — it does NOT enforce. Enforcement = the server.js public-path gate + `requireAuth`/`requireAdmin` per route. → This is exactly why a route mounted without the right mw is silently open (chunk-01 vuln pattern). 
- **Impersonation** (Wave 13C): `authMiddleware` checks `lfs_impersonation` cookie FIRST; loads target user, re-validates BOTH target.active AND the impersonator's `tokens_invalid_after` (revoking the admin kills the impersonation), logs every impersonated request. 1h TTL. No chaining (guard in the impersonate endpoint, chunk TBD).
- `requireAuth(roles)`: 401 no-user; 403 wrong role; **empty array = any authed role** (Item 20 fix). `requireAdmin`=requireAuth('admin'); `requireManagerOrAdmin`=requireAuth(['admin','design_manager','permitting_manager']).

## Auth routes
`POST /api/auth/login` (rate-limited per-ip[10/15m] + per-user[5/15m]; dummy-hash compare; cookie + body token; updates last_login) · **`POST /api/auth/register`** (open self-signup → **trainee**; rate-limited 8/hr/ip; username 3–60 + `[a-zA-Z0-9._-]`; **password ≥8** ⚠ inconsistent with the ≥10 elsewhere; auto-login) · `POST /api/auth/logout` (clear cookie + bump tokens_invalid_after) · `GET /api/auth/me` (+ `can_create_projects` + impersonator context) · `GET /api/auth/portal-urls` (PORTAL_URLS env) · `PUT /api/auth/me/theme` · `GET|PUT /api/auth/me/dashboard-layout` (per-user jsonb) · `POST /api/auth/change-password` (verify current, bump tokens, re-issue, audit).

## Admin user CRUD (`/api/users`, requireAdmin) — confirms CEO Correction B
`GET` (LEFT JOIN staff via staff_id → staff_name) · `POST` (role∈VALID_ROLES, pw≥10, extra_teams cleaned) · `PUT /:id` (dynamic SET; role change also sets team; password change bumps tokens; **can't deactivate own**; `staff_id` linkable) · **`DELETE /:id`** — soft (deactivate + bump tokens) by default; **`?hard=1` permanently deletes but REFUSES if the user is still active** (must soft-delete first); can't delete own. → This is the full user-account CRUD the People page (chunk 04) now surfaces; the staff↔user link is `users.staff_id`.

## Flags / findings (→ open_items where it matters)
- **Password-length inconsistency:** register ≥8 vs ≥10 everywhere else. (minor)
- **Rate limiter in-memory single-process** — weak under multi-instance/scaling; resets on restart. (security/scaling flag)
- **ADMIN_PASSWORD refresh-on-boot** — admin pw pinned to env if left set; UI changes revert on deploy. (operational flag)
- **Plan-vs-built:** ROADMAP Phase 3 employee signup (`@launchfiber.com` + shared code) and contractor single-use invite codes are **NOT built** — `register` is open-to-anyone → trainee only. (gap)
- **System F embryo:** only `canCreateProjects` exists; no general capability/`requireCapability`, no `director` role. (confirms F unbuilt)
- Token-in-body → sessionStorage = XSS-exfil surface (vs httpOnly cookie). (minor)

## Reapproach-if
- Chunk 04 (people.js): how it composes `users` (this) + `staff` into the merged roster; whether mutations use these `/api/users` endpoints.
- Chunk 11 (training): how `trainee` role + `TRAINING_ONLY_LOCKDOWN` + migration-0079 visibility interact (the admin-ungated check lives across server.js + training.js).
- System F work (future): build `requireCapability` generalizing the `canCreateProjects` sentinel pattern.
- routes/impersonation (later): confirm the no-chaining guard + token issue path.
