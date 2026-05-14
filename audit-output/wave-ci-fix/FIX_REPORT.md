# CI Smoke Fix Report — wave-ci-fix
**Date:** 2026-05-14  
**Branch:** `claude/debug-previous-issues-MoN9D`  
**Fix commit:** see git log

---

## Root Cause Analysis

### Failure: "Run backend smoke tests" step — 13 tests failing in `tests/oauth2.test.js`

Two distinct bugs in `server.js`, both introduced when `routes/oauth2.js` was wired in without updating the surrounding server infrastructure.

---

### Bug 1 — Global auth middleware intercepted `/oauth2/*` routes before oauth2 handler

**Where:** `server.js` `pageRequiresAuth()` function (line ~310)

**What happened:** Express evaluates middleware in registration order. The global auth middleware (added before oauth2 routes) calls `pageRequiresAuth(req.path)` to determine if a path needs a logged-in user. `/oauth2/authorize`, `/oauth2/token`, and `/oauth2/userinfo` were not in the exemption list, so `pageRequiresAuth` returned `true` for all of them.

For any unauthenticated request, the middleware executed `res.redirect('/login?next=...')` — a 302 — BEFORE Express ever reached the `routes/oauth2.js` handler.

**Test symptom:** `oauth2.test.js` sends requests without a session cookie (as an external OAuth2 client would). Tests expecting 400 (bad `client_id`, bad `redirect_uri`) got 302 instead because the global middleware short-circuited the oauth2 route handler entirely.

**The irony:** `routes/oauth2.js` already has correct auth handling:
- `/oauth2/authorize`: validates `client_id`/`redirect_uri` first, then redirects to `/login` only after validation passes (line 168 in oauth2.js)
- `/oauth2/token`: server-to-server, explicitly no session cookie
- `/oauth2/userinfo`: validates its own Bearer token, returns 401 on invalid token

**Fix:** Added `/oauth2/` prefix to `pageRequiresAuth` exemption list with an explanatory comment. The oauth2 routes manage their own auth internally.

---

### Bug 2 — `express.urlencoded()` middleware missing; token endpoint body unparsed

**Where:** `server.js` body parser setup (line ~79)

**What happened:** The OAuth2 spec requires the token endpoint to accept `application/x-www-form-urlencoded` POST bodies. `server.js` only had `express.json()` installed — no urlencoded parser. When `oauth2.test.js` POSTed to `/oauth2/token` with `Content-Type: application/x-www-form-urlencoded`, `req.body` was `undefined`. The route destructured `{}` from it, getting `grant_type = undefined`, and immediately returned 400 "Unsupported grant_type; expected authorization_code" — before checking `client_id` or `client_secret`.

**Test symptom:** Token tests got wrong 400 errors (grant_type message instead of expected client_credentials / redirect_uri / invalid-code messages). Valid code exchange tests got 400 instead of 200.

**Fix:** Added `app.use(express.urlencoded({ extended: false }))` immediately after `app.json()`. This only activates for requests with matching Content-Type header; harmless to existing JSON-only routes.

---

## What Failed Before

- `tests/oauth2.test.js`: 13/16 tests failing
- All authorize-param-validation tests → got 302, expected 400
- All token endpoint tests → got wrong 400 (grant_type message), expected specific 400s or 200
- userinfo valid-token test → got 401 (no token to mint because token exchange failed)
- Full suite: 158/171 pass, 13 fail

---

## What Changed

`server.js` — two additions:

1. `pageRequiresAuth()`: added `if (reqPath.startsWith('/oauth2/')) return false;` with explanatory comment (7 lines including comment block)
2. Body parsers: added `app.use(express.urlencoded({ extended: false }));` with comment (4 lines)

No changes to `routes/oauth2.js` — the route logic was correct; only the surrounding infrastructure was missing.

---

## Local Verification

Before fix:
```
# tests 171 | pass 158 | fail 13
```

After fix:
```
# tests 171 | pass 171 | fail 0
```

Full suite 171/171 — confirmed locally against a live Postgres 16 instance with the same env vars as CI (`TEST_DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `NODE_ENV=test`).

---

## Post-Fix CI Status

Push triggered a new CI run. Link: https://github.com/KodaiCards/Launch-Database/actions (check latest run on `claude/debug-previous-issues-MoN9D`).

Previously failing runs (all "Run backend smoke tests" step):
- `25837004682` — failure (a4510dd)
- `25834845169` — failure (335ca7f)
- `25834814751` — failure (df8e3cb)
- `25834678537` — failure (3fb0d5d)
- `25834657187` — failure (1c155ed)

=== CI SMOKE FIX REPORT END ===
