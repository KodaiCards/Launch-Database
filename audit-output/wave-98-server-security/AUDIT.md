# Wave 98 — server.js Security Audit

**Scope:** server.js top-level middleware order, static mounts, cookies, CORS, body parsers, trust proxy, error handler, rate limiting, CSRF, route mounting order.
**Framing:** Adversarial attacker + strict middleware-order analysis.
**Date:** 2026-05-28
**Model:** claude-sonnet-4-6

---

## FINDINGS

---

### F-1 — MEDIUM — Unprotected `/permitting` and `/design` HTML routes (no requireAuth gate)

**File:line:** `server.js:988-989`

**Snippet:**
```js
app.get('/permitting', (req, res) => res.sendFile(path.join(__dirname, 'public', 'permitting.html')));
app.get('/design', (req, res) => res.sendFile(path.join(__dirname, 'public', 'design.html')));
```

**Attack path:**
An unauthenticated user can `GET /permitting` or `GET /design` and receive the full portal HTML shell without a valid session. The HTML itself loads JS that calls authenticated API endpoints (which would return 401/403), but:
1. The HTML shell reveals portal structure, endpoint paths, client-side logic, and any inline secrets embedded via PORTAL_MODE injection.
2. Consistent with the global `pageRequiresAuth()` guard, but that guard only applies to the global auth middleware (line 392), which handles paths generically. These named routes at 988-989 are registered AFTER `express.static` (line 509) would already have served them — meaning `express.static` would serve `/permitting.html` without auth anyway. The net effect is a layered miss: both the named alias and the static fallback are ungated.
3. Compare: `/client-portal` (line 992), `/offline-sync` (line 996), `/training/*` (line 473-476), `/photos/*` (line 496-499) all use `requireAuth()`. The `/permitting` and `/design` named aliases are inconsistently ungated.

**Severity reasoning:** The API endpoints are properly gated. The exposure is HTML + JS source. For an internal tool at the described sensitivity level (government project tracking, RUS engineering contracts) this is MEDIUM — the attack surface is reconnaissance, not direct data exfiltration.

**Fix shape:** Add `requireAuth()` middleware to both routes:
```js
app.get('/permitting', requireAuth(), (req, res) => res.sendFile(...));
app.get('/design', requireAuth(), (req, res) => res.sendFile(...));
```
Also add `pageRequiresAuth()` entries for `/permitting` and `/design` so the global redirect fires consistently. Note: `express.static(public/)` at line 509 also serves `permitting.html` and `design.html` directly — the named alias fix alone is insufficient. Either move those files out of the public static root or add a blanket `requireAuth()` before `express.static`.

---

### F-2 — MEDIUM — `/client` static mount is ungated (client portal HTML served without auth)

**File:line:** `server.js:493`

**Snippet:**
```js
app.use('/client', express.static(path.join(__dirname, 'public', 'client')));
```

**Attack path:**
`public/client/` is served as a public static tree with no auth check. The comment at line 491-492 says:
> "Not gated with requireAuth() here; authentication is at the API layer via the lfs_client_session cookie validated by requireClientAuth middleware."

The API endpoints under `/api/client/*` are properly token-gated. However the HTML/JS/CSS at `/client/` is fully public — any anonymous user can fetch `index.html`, inspect the client portal's structure, enumerate endpoint paths, read any inline configuration or client-side logic, and understand what data the portal exposes. For a system handling named client organizations (PSC, government contracts), this leaks the existence of the portal and its design to unauthenticated actors.

**Severity reasoning:** API layer is gated. This is a reconnaissance exposure, not a direct data leak. MEDIUM — consistent with F-1.

**Fix shape:** The design decision (auth-at-API-layer) is intentional and documented. If that stays, add a `Content-Security-Policy` and `Cache-Control: no-store` on the HTML to reduce leakage. If stricter access control is wanted, consider a lightweight token-check middleware that at minimum verifies the request originates from a known client organization before serving the HTML.

---

### F-3 — MEDIUM — SVG files served inline without `Content-Type: image/svg+xml` + `sandbox` CSP

**File:line:** `server.js:532-540`

**Snippet:**
```js
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
// ...
} else if (imageExts.has(ext)) {
    // sendFile sets Content-Type from extension; just don't force attachment
}
```

**Attack path:**
Express `sendFile` sets `Content-Type` from the file extension. For `.svg` that resolves to `image/svg+xml`. SVG is an XML-based format that can contain `<script>` tags, `<a href="javascript:...">`, and `onload=` event handlers. When a user-uploaded SVG is served inline (not as attachment), the browser executes the embedded JS in the context of the page's origin — stored XSS.

The comment at line 531 says "force download for everything else to prevent stored-XSS via uploaded HTML/SVG/JS files" but then SVG is in the image exception set, defeating the protection. `.svg` should be in the "force attachment" bucket, not the inline-image bucket.

**Severity reasoning:** Requires an attacker to upload a malicious SVG (upload requires auth), and a victim to open the `/uploads/<uuid>_evil.svg` URL directly (which the attacker would have to socially engineer). MEDIUM — real stored XSS vector but gated behind authenticated upload + direct URL access.

**Fix shape:**
```js
const inlineImageExts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']); // SVG removed
// SVG gets attachment treatment like HTML/JS
```
Or, serve SVG with `Content-Type: image/svg+xml` + `Content-Disposition: attachment` to force download.

---

### F-4 — LOW — Open redirect via `?next=` parameter in login flow

**File:line:** `server.js:426, 433` and `public/login.html:161-162`

**Snippet (server):**
```js
return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
```
**Snippet (client):**
```js
const params = new URLSearchParams(window.location.search);
return params.get('next') || '/';
// ...
window.location.href = getRedirectTarget();
```

**Attack path:**
`req.originalUrl` can be an absolute URL if the request path is crafted as `GET http://evil.com/path HTTP/1.1`. Express populates `req.originalUrl` from the request line's path, but a reverse-proxied request with a host rewrite could set it to `//evil.com` or `https://evil.com/...`. The login page then sets `window.location.href` to the raw `next` value — if that value is an external URL, the browser follows it after login, enabling phishing.

Concretely: if an attacker can deliver a URL like `/login?next=https://evil.com/steal-creds`, after the user logs in successfully they're redirected to `evil.com`.

**Severity reasoning:** Requires the attacker to deliver the crafted URL to the victim (social engineering). The `encodeURIComponent` encoding on the server side doesn't prevent this — it just URL-encodes the full redirect URL, which the client-side `URLSearchParams` decodes back verbatim. LOW — not directly exploitable without user interaction but is a real phishing amplifier.

**Fix shape:**
Client-side validation before redirect:
```js
function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || '/';
  // Only allow same-origin redirects
  if (next.startsWith('//') || /^https?:\/\//i.test(next)) return '/';
  return next;
}
```

---

### F-5 — LOW — `express.urlencoded` has no explicit body size limit

**File:line:** `server.js:83`

**Snippet:**
```js
app.use(express.urlencoded({ extended: false }));
```

**Attack path:**
`express.json` has an explicit `{ limit: '10mb' }` cap (line 79). `express.urlencoded` has no corresponding limit, defaulting to Express's internal limit of 100kb. This is a lower risk than JSON but inconsistent — a form-encoded body bomb at the default 100kb cap could consume memory on high concurrency. For a low-traffic internal app this is very low risk.

**Severity reasoning:** Default Express limit is 100kb (not unlimited). Not a meaningful DoS vector for this deployment. LOW — documentation/consistency gap.

**Fix shape:**
```js
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
```

---

### F-6 — LOW — In-memory rate limiter is process-local (reset on restart, ineffective behind load balancer)

**File:line:** `auth.js:56-73`

**Snippet:**
```js
const _rlBuckets = new Map();
function rateLimitOk(key, limit, windowMs) { ... }
```

**Attack path:**
The `_rlBuckets` Map is module-level, reset on every process restart. On Railway, a redeploy or crash restart resets all rate-limit counters. If there are multiple instances (horizontally scaled), each instance has its own counter — an attacker distributing login attempts across requests to multiple instances gets N×limit attempts per window.

The current Railway deployment is described as single-instance, making this theoretical. But a process restart mid-attack (e.g., triggered by the attacker via a separate DoS vector) resets the counter.

**Severity reasoning:** Currently single-process. The 10-attempts/15-min IP limit + 5-attempts/15-min username limit is meaningful for a solo-deployment. LOW — becomes MEDIUM in a multi-instance or restartable deployment.

**Fix shape:** For current deployment: add a comment documenting the limitation. For scale: move rate-limit state to Redis or Postgres.

---

### F-7 — LOW — No security response headers (X-Content-Type-Options, X-Frame-Options, HSTS)

**File:line:** `server.js` — not present anywhere

**Attack path:**
No global middleware sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, or a `Content-Security-Policy`. Without:
- `X-Content-Type-Options: nosniff` — browsers may MIME-sniff uploaded files served inline, potentially executing non-JS content as JS in older browsers.
- `X-Frame-Options: DENY` — the admin portal can be iframed by a malicious page (clickjacking vector on state-change buttons).
- `HSTS` — on Railway (HTTPS), without HSTS the browser may retry via HTTP on initial connect, enabling downgrade attacks.

**Severity reasoning:** The app runs behind Railway's TLS termination. Clickjacking risk is real for the admin portal's destructive actions (delete project, approve invoice). LOW overall — the app is internal with a small user population.

**Fix shape:**
```js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});
```
Mount this as the first middleware after `app.set('trust proxy', 1)`.

---

## VERIFIED CLEAN

The following items were explicitly checked and found clean:

| Item | Status | Evidence |
|---|---|---|
| CORS wildcard | CLEAN | `origin` callback uses explicit allowlist; no `*` anywhere. `credentials: true` with dynamic origin correctly implemented (line 66-78). |
| CORS empty-ALLOWED_ORIGINS in prod | CLEAN | Line 63-64 warns and causes all cross-origin requests to be rejected (not permitted). Same-origin requests pass the `!origin` check correctly. |
| `trust proxy` setting | CLEAN | `app.set('trust proxy', 1)` at line 54, before any middleware that reads `req.ip`. Correctly set before CORS, CSRF, and rate-limit middleware. |
| CSRF state-changing endpoints | CLEAN | Middleware at line 90-131 checks Origin/Referer for all non-GET/HEAD/OPTIONS requests. Bearer-header callers exempted correctly. Login endpoint gets dedicated CSRF treatment (line 94-112). |
| CSRF login endpoint | CLEAN | Lines 94-112 check cross-origin login separately — unknown origins are rejected with 403. |
| JSON body limit | CLEAN | `express.json({ limit: '10mb' })` at line 79. Prevents JSON body bombs. |
| Multer file size limit | CLEAN | `limits: { fileSize: MAX_UPLOAD_BYTES }` (3GB) at line 47. Multer streams to disk, keeping RAM usage low. |
| Upload path traversal | CLEAN | `path.resolve()` + prefix check at lines 521-524. Correct pattern — resolves symlinks and checks the resulting absolute path starts with UPLOAD_DIR. |
| `requireAuth()` on `/training` | CLEAN | Lines 473-476 — both the static mount and SPA fallback use `requireAuth()`. |
| `requireAuth()` on `/photos` | CLEAN | Lines 496-499 — static mount + SPA fallback both gated. |
| `requireAuth()` on `/workspace` static | CLEAN | Lines 503-506 — static mount + SPA fallback both gated. |
| `/workspace` API routes (folder_workspace.js) | CLEAN | All router endpoints use `requireAuth()` from `../auth` (self-imported). `/api/workspace` mounted at line 814 without requiring injection — safe because the router enforces its own auth. |
| Error handler stack trace leak | CLEAN | Line 982: `res.status(status).json({ error: (err && err.message) ? err.message : 'Internal server error' })` — sends `err.message` only, not `err.stack`. Stack is logged server-side only (line 981). |
| Cookie `httpOnly` | CLEAN | `auth.js:87` — `httpOnly: true` for `lfs_session`. |
| Cookie `secure` | CLEAN | `auth.js:89` — `secure: process.env.NODE_ENV === 'production'`. Enabled in prod. |
| Cookie `sameSite` | CLEAN | `auth.js:88` — `sameSite: 'lax'`. Appropriate for cookie-auth + SPA. |
| Cookie `maxAge` | CLEAN | `auth.js:440` — 7 days (604800000ms). Reasonable for a work-session tool. |
| Client portal v2 cookies | CLEAN | `client_portal_v2.js:36-38` — same `httpOnly: true`, `sameSite: 'lax'`, `secure: prod` pattern. |
| Rate limit on login (IP) | CLEAN | 10 attempts / 15-min window per IP. Uses `req.ip` which reads correctly from Railway behind `trust proxy: 1`. |
| Rate limit on login (username) | CLEAN | 5 attempts / 15-min window per username. Prevents targeted brute force on known accounts. |
| Timing-safe APP_PASSWORD compare | CLEAN | Lines 409-411 — `crypto.timingSafeEqual` used. Length pre-check correctly done before the compare. |
| Customer role API fence | CLEAN | Lines 179-188 — customer-role JWTs blocked from all `/api/*` except `/api/auth/` and `/api/customer/`. |
| Portal mode API blocks | CLEAN | Lines 438-458 — revenue/invoices/billing/AI/hours/dashboard blocked for portal instances. |
| `/client-portal` auth | CLEAN | Line 992 — `requireAuth()` applied. |
| `/offline-sync` auth | CLEAN | Line 996 — `requireAuth()` applied. |
| Splice field/view token gating | CLEAN | `routes/splice.js` uses `_resolveFieldToken()` to look up tokens in DB before serving. Token expiry is enforced. |
| `project_types` route (empty mw) | CLEAN | Line 617: `require('./routes/project_types')(app, pool, {})`. The module falls back to `requireAuth` from the passed-in `mw.requireAuth` or uses a fallback closure. Line 29 of project_types.js: `const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next())`. **NOTE:** This means GET /api/project-types IS ungated when empty `{}` is passed — see F-8. |
| Route mounting order (API 404 catch-all) | CLEAN | Line 1054-1056: hard 404 for unknown `/api/*` paths mounted AFTER all route modules. Prevents SPA fallback from swallowing API misses. |
| ADMIN_API_BASE injection | CLEAN | Line 1031: `JSON.stringify(ADMIN_API_BASE)` properly serializes the env var — no raw HTML injection possible from the env var. |
| Auth middleware registration order | CLEAN | `installAuthRoutes` (line 169) registers `cookieParser` + `authMiddleware` globally BEFORE any route modules are registered. All routes that use `req.user` are mounted after line 169. |
| SSE registration order | CLEAN | Lines 353-355: SSE registered before `express.static` (line 509), preventing static from swallowing `/api/events/stream`. |
| `/uploads` auth | CLEAN | Line 517: `requireAuth()` middleware before the upload handler. |

---

### F-8 — MEDIUM — `GET /api/project-types` is unauthenticated (empty middleware object passed)

**File:line:** `server.js:617`, `routes/project_types.js:29,31`

**Server snippet:**
```js
require('./routes/project_types')(app, pool, {});
```
**Route snippet:**
```js
const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
app.get('/api/project-types', requireAuth(), async (req, res) => {
    res.json(PROGRAM_ROWS);
});
```

**Attack path:**
`server.js` passes an empty object `{}` — `mw.requireAuth` is `undefined`, so the fallback `() => (req, res, next) => next()` is used, which is a no-op. Any unauthenticated caller can `GET /api/project-types` and receive the four program enum values (rus/bau/gfr/other). The actual data exposed is low-sensitivity (it's a fixed enum, publicly visible in the HTML dropdown labels anyway), but this is architecturally inconsistent — every other route module accepts and uses `requireAuth`. 

The comment on line 28 says "Wave 1.5 [UNGATED]: GET /api/project-types was missing auth" — indicating this was a known gap that received a fix comment but was never actually fixed (the `{}` pass still defeats it).

**Severity reasoning:** Data sensitivity is very low (four enum strings). MEDIUM because of the pattern: this exact "empty mw object" bug has already been patched twice in the codebase (comments reference C-2 and C-3 fixing similar issues in potential_permits and inspection), and the unfixed comment at line 617 signals the fix was intended but incomplete.

**Fix shape:**
```js
require('./routes/project_types')(app, pool, { requireAuth });
```

---

## COVERAGE GAPS

- **Individual route modules not audited:** Each of the 30+ route modules (`routes/clients.js`, `routes/projects.js`, etc.) was not fully read — only their registration call in `server.js` was audited. Internal IDOR, missing ownership checks, and SQL injection risks within those modules are out of scope for this wave.
- **`auth.js` JWT implementation:** Only the cookie settings and rate-limit subsystem were audited. The full JWT signing/verification chain (secret strength, algorithm pinning, `iat`/`exp` validation, `tokens_invalid_after` enforcement) was not deeply reviewed.
- **`portal_module.js` + `timeclock_module.js`:** Route registration from those modules was not audited.
- **`routes/client_portal_v2.js` admin endpoints:** Token generation, revocation, and admin management routes beyond cookie settings were not audited.
- **WebSocket / SSE auth re-validation on reconnect:** Whether the SSE heartbeat actually re-validates the session (as mentioned at line 355) was not verified in `routes/_sse.js`.
- **Multer field-count / file-count limits:** Only `fileSize` was checked. `fields`, `files`, and `parts` limits were not verified.

---

## VERDICT

**YELLOW** — 3 MEDIUM findings (F-1, F-2, F-3/F-8), 4 LOW findings (F-4–F-7).

The security architecture is substantially sound: CORS is locked down, CSRF is enforced via Origin/Referer, cookies are correctly configured, rate limiting exists on login, the error handler does not leak stacks, the upload path traversal guard is correct, and auth middleware is registered in the right order.

The highest-priority fixes:
1. **F-8** (`/api/project-types` unauthenticated) — 1-line fix, pass `{ requireAuth }`.
2. **F-1** (`/permitting` and `/design` HTML ungated) — add `requireAuth()` to both named routes; also requires blocking direct static access via `express.static`.
3. **F-3** (SVG served inline — stored XSS vector) — remove `.svg` from inline-image exception set.
4. **F-7** (missing security response headers) — add `X-Content-Type-Options`, `X-Frame-Options`, HSTS as a global middleware.

=== WAVE 98 SERVER SECURITY AUDIT END ===
