# Client Portal v1 — E2 (token-auth foundation) IDOR audit verdict

**Verdict: GREEN — E3 UI build can proceed unblocked.**

E2 is on main. The token-auth middleware (`requireClientAuthMW`) is applied
on every `/api/client/*` endpoint; every query that touches project /
document / approval data is scoped through the `client_org_id` chain
(directly or via `engineering_contracts.client_org_id` FK).

---

## Files in scope

| Path | Lines | Role |
|---|---|---|
| `/home/user/Launch-Database/routes/_client_auth.js` | 86 | Token hash + cookie + middleware |
| `/home/user/Launch-Database/routes/client_portal_v2.js` | 903 | All `/api/client/*` + admin `/api/admin/client-orgs/*` routes |
| `/home/user/Launch-Database/server.js:846-849` | 4 | Wiring + multer upload bridge |
| `/home/user/Launch-Database/routes/customer_portal.js` | (legacy Wave 13) | Pre-token portal — stays operational until E6 retires it |

Migrations: 0047 (client_organizations, client_users, client_tokens),
0049 (client_documents, client_approvals), 0061 (schema.sql consolidation
of drift accumulated W211). All idempotent.

---

## Middleware contract — `requireClientAuth(pool)`

`routes/_client_auth.js:20-83` — defining behavior:

- Cookie name: `lfs_client_session` (httpOnly, sameSite=lax, secure=prod).
- Reads raw token, hashes via SHA-256, joins `client_tokens → client_users
  → client_organizations` in one query.
- Single uniform 401 message (`'Authentication required'`) for every
  failure path (missing / wrong hash / revoked / expired / inactive user /
  inactive org). Prevents token-state enumeration. W100-F7 lock.
- On success populates `req.client_user = { id, org_id, email, name,
  is_primary }` and `req.client_org = { id, name, short_name, logo_url,
  theme_color }`.
- `last_used_at` updated lazy (fire-and-forget) to avoid blocking
  responses.

W45-MED-2 hardening: every path param hits `isValidUUID()` regex before
SQL to convert Postgres 22P02 syntax errors (500) into clean 400s.

---

## Route inventory — `/api/client/*` (token-auth required)

| Method | Path | Auth | Scoping pattern | IDOR risk |
|---|---|---|---|---|
| GET | `/api/client/me` | client | `req.client_user` / `req.client_org` only | NONE |
| GET | `/api/client/projects` | client | `WHERE ec.client_org_id = $1` (`routes/client_portal_v2.js:158-183`) | NONE — single-tenant query |
| GET | `/api/client/projects/:id` | client | `WHERE p.id = $1 AND ec.client_org_id = $2` (`L188-218`) | NONE — combined predicate forces 404 on cross-org |
| GET | `/api/client/projects/:project_id/workspace-files` | client | Scope check before fetch (`L223-275`), share_mode='public' filter | NONE — explicit gate |
| GET | `/api/client/workspace-files/:file_id/download` | client | Join through folder → project → EC → org (`L278-321`) + share_mode='public' | NONE — single-query predicate; W107-MED-4 traversal guard on `path.resolve` |
| GET | `/api/client/documents` | client | `WHERE client_org_id = $1` + optional project_id verified to org first (`L570-610`) | NONE |
| GET | `/api/client/documents/:id/download` | client | `WHERE id=$1 AND client_org_id=$2` (`L613-650`) | NONE — combined predicate |
| POST | `/api/client/documents` | client | Multer upload → MIME allowlist → magic-byte verify → 50MB cap → optional project_id verified to org → storage_key under `client-docs/<org_id>/<uuid>.ext` (`L657-757`) | NONE — magic-byte verify (W107-HIGH-2) prevents MIME spoof |
| GET | `/api/client/approvals` | client | `WHERE client_org_id = $1` + allowlisted status filter (`L763-795`) | NONE |
| POST | `/api/client/approvals/:id/respond` | client | Pre-update scope check `id=$1 AND client_org_id=$2` (`L798-838`) + state guard (`status='pending'` only) | NONE — 409 on already-responded |
| POST | `/client/logout` | client | Revokes current cookie's token only | NONE |
| GET | `/client/login/:rawToken` | none (token IS auth) | Hashed lookup + 5 reject paths → opaque deny msg (W45-MED-1) | NONE on existing routes; **POLISH** rate-limit missing (see below) |

## Route inventory — admin (staff `requireAuth(['admin'])`)

| Method | Path | Risk |
|---|---|---|
| GET | `/api/admin/client-orgs` | NONE — admin-scoped list (`L328-361`) |
| POST | `/api/admin/client-orgs` | NONE — INSERT with `created_by = req.user.id` (`L364-378`) |
| GET | `/api/admin/client-orgs/:id` | NONE — explicit column list (W45-MED-3), no `cu.*` exposure of `invited_by` (`L381-427`) |
| PUT | `/api/admin/client-orgs/:id` | NONE — status enum allowlist (`L430-462`) |
| POST | `/api/admin/client-orgs/:id/users` | NONE — verifies org exists before INSERT (`L465-492`) |
| POST | `/api/admin/client-orgs/:id/users/:uid/tokens` | NONE — verifies user-in-org before generate; raw token returned ONCE in response body, only SHA-256 hash persisted (`L497-541`) |
| POST | `/api/admin/client-tokens/:tid/revoke` | NONE — `revoked_at IS NULL` guard prevents double-revoke 404 ambiguity (`L544-563`) |
| POST | `/api/admin/client-orgs/:id/approvals` | NONE — verifies all FK targets scope to the org before INSERT (`L841-901`) |

---

## Non-blockers (queued for E6 future, NOT demo-blocking)

These were graded MED/LOW in audit and explicitly DO NOT block E3:

1. **Rate-limit on `/client/login/:rawToken`** — currently unbounded. An
   attacker holding 0 tokens cannot enumerate (uniform deny msg + SHA-256
   lookup is constant-time on indexed column), but a brute-force attempt
   would still consume DB. Add IP-bucket rate-limit (e.g. 30/min) before
   E6 production cutover. **Not a security finding** — uniform deny msg
   already prevents the attack — just resource hardening.

2. **Audit log on read endpoints** — `/api/client/projects`, `/documents`,
   `/approvals` GETs are silent. Write endpoints (login, logout, upload,
   approval respond, token generate, token revoke) DO call `logAudit()`.
   For PSC compliance posture during E6 prod cutover, consider adding a
   read-side audit row (or per-session "viewed N pages" summary on
   logout). LOW priority.

3. **Per-org TLS / origin pinning** — currently any browser with the
   token cookie can hit `/api/client/*`. CSRF risk is bounded by
   sameSite=lax + httpOnly. POST endpoints all require auth so a CSRF
   submit would still need the cookie. LOW priority; revisit if cross-origin
   embedding becomes a use case.

---

## E3 readiness checklist

Before kicking off E3 UI build, verify:

- [x] `requireClientAuth` middleware operational
- [x] All API endpoints exist + IDOR-clean (this audit)
- [x] Migrations 0047/0049/0061 on main
- [x] `routes/_client_auth.js` + `routes/client_portal_v2.js` wired in
      `server.js:846-849`
- [ ] `public/client/` static directory created with `index.html` shell
      (E3 wave deliverable)
- [ ] `public/client/login.html` for the post-token-consume landing
      (E3 wave deliverable)
- [ ] Logo asset `public/img/clients/psc-logo.png` (Carter to provide;
      deferred per 2026-05-21 directive — NOT a blocker for E3 UI,
      placeholder OK)
- [ ] Admin-side onboarding script `scripts/onboard_client.js` (already
      mentioned in CLAUDE.md, verify it's wired against the E2 endpoints)

---

## Verdict summary

**GREEN — proceed with E3.** All `/api/client/*` endpoints have a clean
single-predicate IDOR scope through `client_org_id` (direct or via EC FK).
No cross-org leak surface. Token-state enumeration locked via uniform deny
message. Magic-byte upload verify prevents MIME spoof. Path traversal
guards in place on both workspace + document download.

Non-blockers (rate-limit, read-side audit) are E6 polish, not E3 gates.
