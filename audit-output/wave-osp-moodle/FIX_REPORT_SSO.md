# Fix Report — OSP Moodle SSO Bridge

**Wave:** wave-osp-moodle (Area B — SSO Bridge)
**Date:** 2026-05-14
**Agent:** fix-agent (orchestrator-direct, no sub-agent dispatch)

---

## Summary

Implemented the OAuth2 Authorization Code flow SSO bridge for Moodle's
`auth_oauth2` plugin. Three new endpoints, wired into `server.js`,
documented in `.env.example`, and covered by 16 integration tests.

---

## Commits

| SHA | Description |
|---|---|
| `c90ee18` | `routes/oauth2.js` — new route module (authorize, token, userinfo) |
| `002c76a` | Wire into `server.js`; export `rateLimitOk` from `auth.js` |
| `73888c6` | `.env.example` — OAuth2 env var documentation |
| `ffd5775` | `tests/oauth2.test.js` — 16 integration tests |

---

## Scope delivered

### GET /oauth2/authorize
- Validates `client_id` against `OAUTH2_CLIENT_ID` env var (constant-time comparison not needed here — client_id is non-secret).
- Validates `response_type=code` (only supported type).
- Validates `redirect_uri` against `OAUTH2_ALLOWED_REDIRECT_URIS` (comma-separated env var).
- Unauthenticated users: 302 → `/login?next=<encoded-self-URL>` so they return after login.
- Authenticated users: generates 32-byte cryptographically random hex code, stores in in-memory Map with 5-min TTL, issues 302 to `redirect_uri?code=<code>&state=<state>`.
- Rate limit: 10 requests / 5 min / IP.
- Audit log: structured JSON to stdout on every authorize + every rejection.

### POST /oauth2/token
- Validates `grant_type=authorization_code`.
- Constant-time comparison for both `client_id` and `client_secret` against env vars (`crypto.timingSafeEqual`, pad-to-equal-length before compare).
- Looks up and atomically consumes the code (single-use: deleted on first lookup).
- Validates `redirect_uri` matches what was stored with the code at issue time.
- Mints a Moodle-audience JWT: `audience='moodle-sso'`, `issuer=JWT_ISSUER`, 15-min TTL. Uses `OAUTH2_JWT_SECRET` if set, falls back to `JWT_SECRET`. Separate secret isolates Moodle tokens from session tokens.
- Returns `{ access_token, token_type: "Bearer", expires_in: 900 }`.
- Rate limit: 20 requests / 5 min / IP.

### GET /oauth2/userinfo
- Reads `Authorization: Bearer <token>` header.
- Verifies JWT with `audience='moodle-sso'` — rejects any token with wrong audience (including main session JWTs).
- Cross-checks `tokens_invalid_after` against `payload.iat` — password change or deactivation invalidates outstanding Moodle access tokens.
- Returns OIDC-compatible profile: `{ sub, email, name, preferred_username, lfs_role }`.

### In-memory code store
- `Map<code_hex, { user_id, redirect_uri, expires_at }>`.
- 60-second sweep interval, `.unref()` (doesn't hold process open).
- LRU cap: 1000 entries (evicts oldest on overflow).
- Single-process safe (Railway single-dyno). Future multi-instance: replace with Redis TTL keys.

### auth.js change
- `rateLimitOk` added to `module.exports` so route modules can reuse the shared sliding-window rate limiter.

### server.js change
- `signToken`, `verifyToken`, `rateLimitOk` added to the `require('./auth')` destructure.
- `require('./routes/oauth2')(app, pool, { requireAuth, signToken, verifyToken, rateLimitOk })` wired just before the API error handler.

---

## Items NOT in scope (not implemented, not deferred — explicitly excluded by task)

- Moodle provisioning.
- Training tile URL rewire (from `/training/` to `https://training.launchfiber.com`).
- Database-backed code store (in-memory Map is correct for single-process deployment).
- PKCE / additional OAuth2 grant types.

---

## Required env vars to activate

| Var | Required | Notes |
|---|---|---|
| `OAUTH2_CLIENT_ID` | Yes | Arbitrary stable string; paste same into Moodle issuer |
| `OAUTH2_CLIENT_SECRET` | Yes | Strong random; paste same into Moodle issuer |
| `OAUTH2_ALLOWED_REDIRECT_URIS` | Yes | Comma-separated; include Moodle's callback URL |
| `OAUTH2_JWT_SECRET` | Recommended | Separate signing key for moodle-sso tokens; falls back to `JWT_SECRET` |

---

## Sample curl flow (end-to-end)

```bash
# 1. User clicks Training tile → Moodle → redirects to authorize.
#    (In real flow, browser does this with session cookie. Curl simulation:)
curl -v --cookie "lfs_session=<valid_session_token>" \
  "https://app.launchfiber.com/oauth2/authorize?client_id=launch-fiber-moodle&redirect_uri=https%3A%2F%2Ftraining.launchfiber.com%2Fadmin%2Foauth2callback.php&response_type=code&state=abc123"
# → 302 Location: https://training.launchfiber.com/admin/oauth2callback.php?code=<64-hex>&state=abc123

# 2. Moodle server calls token endpoint with the code.
curl -X POST https://app.launchfiber.com/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "code=<64-hex-from-step-1>" \
  -d "client_id=launch-fiber-moodle" \
  -d "client_secret=<OAUTH2_CLIENT_SECRET>" \
  -d "redirect_uri=https://training.launchfiber.com/admin/oauth2callback.php"
# → { "access_token": "<jwt>", "token_type": "Bearer", "expires_in": 900 }

# 3. Moodle fetches user profile.
curl -H "Authorization: Bearer <access_token-from-step-2>" \
  https://app.launchfiber.com/oauth2/userinfo
# → { "sub": "<user-uuid>", "email": "user@launchfiber.com", "name": "Jane Smith",
#     "preferred_username": "jsmith", "lfs_role": "design_engineer" }
```

---

## Moodle issuer configuration (when Moodle is provisioned)

In Moodle: Site administration → Plugins → Authentication → OAuth2 → Add new issuer.

| Moodle field | Value |
|---|---|
| Name | Launch Fiber SSO |
| Client ID | `<OAUTH2_CLIENT_ID>` value |
| Client secret | `<OAUTH2_CLIENT_SECRET>` value |
| Authentication endpoint | `https://app.launchfiber.com/oauth2/authorize` |
| Token endpoint | `https://app.launchfiber.com/oauth2/token` |
| Userinfo endpoint | `https://app.launchfiber.com/oauth2/userinfo` |
| Scopes | (leave default or use `openid email profile`) |
| Map: Username | `preferred_username` |
| Map: Email | `email` |
| Map: Full name | `name` |
| Map: ID | `sub` |

=== OSP SSO FIX REPORT END ===
