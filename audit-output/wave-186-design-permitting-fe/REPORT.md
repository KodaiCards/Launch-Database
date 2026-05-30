# Wave 186 — Frontend Security Audit: design.html + permitting.html

**Auditor:** Wave-186 agent (read-only)
**Date:** 2026-05-30
**Branch:** agent/wave-186-design-permitting-fe
**Files:** `public/design.html` (2520 lines), `public/permitting.html` (2509 lines)

---

## Stack Snapshot

Both portals are vanilla-JS SPAs behind `requireAuth()`. Auth is `credentials:'include'` (httpOnly `lfs_session` cookie) with a sessionStorage Bearer fallback (`lfs_token`). HTML is built via template-literal `innerHTML` assignments throughout. A shared `esc(s)` helper (DOM `textContent→innerHTML` encoding) provides HTML-entity escaping for most user-supplied fields.

---

## Findings

### F1 — MEDIUM — Stored XSS: `${p.status}` unescaped in `loadPotential()` innerHTML (both portals)

Verified by reading: `design.html:1988`, `permitting.html:1952`

```js
// design.html:1986-1988
const c = { pending:'var(--portal-color)', accepted:'#28A745', rejected:'#DC3545' }[p.status] || '#ccc';
return `<tr>...
  <td><span style="background:${c};color:#fff;...">${p.status}</span></td>
```

`p.status` from `/api/potential-permits` is interpolated directly into `innerHTML` without `esc()`. The CSS background is whitelist-keyed (unknown values fall through to `'#ccc'`, no CSS injection), but the text content `${p.status}` in the `<span>` body is unprotected. If a malformed status ever reaches the DB (direct write, migration artifact, or future permissive endpoint), it renders as raw HTML.

Fix shape: `${esc(p.status)}` in both `loadPotential()` functions.

---

### F2 — MEDIUM — Stored XSS: `${sr.status}` unescaped in `formatRequestRow()` innerHTML (both portals)

Verified by reading: `design.html:2193, 2196`, `permitting.html:2197, 2200`

```js
// design.html:2192-2196
const reviewedBit = sr.status !== 'pending'
  ? `<span style="color:var(--text-muted)"> · ${sr.status} by ${esc(sr.reviewed_by||'—')}...`
  : '';
return `<div style="...border-left:3px solid ${colors[sr.status]}...">
  <span style="...color:${colors[sr.status]}">${sr.status}</span> ·
```

`sr.status` appears unescaped in two innerHTML positions per portal: in the `reviewedBit` text fragment (line 2193) and in the main span text (line 2196). The CSS `color:${colors[sr.status]}` is whitelist-keyed (`{pending,approved,rejected}`) — unknown values produce `undefined` (invalid but harmless CSS). The text positions are the risk surface.

The `entityLabel` fallback (`sr.entity_type` at line 2188) is passed through `esc(entityLabel)` at the render site (line 2197) — that path is safe.

Fix shape: Replace both `${sr.status}` text interpolations in `formatRequestRow()` with `${esc(sr.status)}`.

---

### F3 — MEDIUM — JWT stored in JS-accessible sessionStorage (both portals)

Verified by reading: `design.html:748`

```js
const tok = sessionStorage.getItem('lfs_token');
if (tok) o.headers['Authorization'] = 'Bearer ' + tok;
```

`lfs_token` (a JWT) is read from sessionStorage, which is accessible to any same-origin script including injected ones. If F1 or F2 are exploited, an attacker can exfiltrate the token via `sessionStorage.getItem('lfs_token')` and replay it. The primary auth path (httpOnly cookie) is XSS-resistant; the sessionStorage fallback degrades that protection.

Severity is MEDIUM rather than HIGH: token is tab-scoped (sessionStorage, not localStorage), exploitation requires XSS landing first, and primary auth doesn't depend on this path.

Fix shape: If the Bearer fallback is dead code, remove the sessionStorage read and Authorization header path. If required for specific flows, document explicitly.

---

### F4 — LOW — `p.id` in inline onclick attributes without `esc()` (inconsistent pattern, both portals)

Verified by reading: `design.html:1930-1933`, `permitting.html:1887-1890, 818`

```js
// design.html:1930
onclick="regressDesign('${p.id}','${esc(p.name)}')"
onclick="editProject('${p.id}')"
onclick="deleteProjectFromPipeline('${p.id}','${esc(p.name)}')"
```

`p.id` is used without `esc()` while `p.name` in the same attributes is correctly wrapped. PostgreSQL UUIDs cannot contain `'`, `<`, `>`, or `&`, so there is no exploitable injection in practice. The inconsistency is a code-pattern risk: future endpoints surfacing non-UUID IDs would silently introduce injection.

Fix shape: Apply `esc(p.id)` consistently alongside `esc(p.name)`.

---

### F5 — LOW — `window.open()` without `noopener` (design.html)

Verified by reading: `design.html:373`

```js
window.open('/offline-sync.html', '_blank')
```

Missing `noopener` gives the opened page access to `window.opener`. Target is same-origin and server-controlled, so no current tabnapping risk.

Fix shape: `window.open('/offline-sync.html', '_blank', 'noopener,noreferrer')`

---

### F6 — LOW — `esc()` does not block `javascript:` URIs in href attributes (both portals)

Verified by reading: `design.html:2290`

```js
`<a href="${esc(portalUrlsCache[p])}" target="_blank" rel="noopener" ...>`
```

`esc()` encodes `<>&"'` via DOM `textContent→innerHTML` but `javascript:alert(1)` passes through unchanged. `portalUrlsCache` is server-generated from `PORTAL_DEFS` (not user input), so practical risk is low. Risk: any future caller using `esc()` to sanitize href values has a false sense of security.

Fix shape: For href contexts, validate URL starts with `/` or `https:` before insertion. Document that `esc()` is HTML-content encoding only, not URL sanitization.

---

### F7 — LOW — CSRF relies entirely on SameSite cookie semantics; no token-based protection

Verified by reading: `design.html:747` — `credentials:'include'`, no CSRF token in request headers

Both portals send state-mutating requests (POST/PUT/DELETE) via `api()` with no custom CSRF header. CSRF protection relies solely on `SameSite=Lax` cookie behavior. For a government project tracking tool with financial exposure, token-based CSRF protection (synchronizer token or double-submit cookie) would be standard defense-in-depth.

Fix shape: Backend wave — `X-CSRF-Token` header check on state-mutating routes; token delivered via meta tag.

---

## Verified Clean

| # | What was checked | Result |
|---|---|---|
| C1 | `<a target="_blank">` in portals dropdown (design.html:2290) | All have `rel="noopener"` |
| C2 | `?next=` redirect: `window.location.href='/login?next='+encodeURIComponent(window.location.pathname)` (design.html:756) | Uses `window.location.pathname` (server path), NOT URL params — not an open redirect |
| C3 | `loadPipeline()` name/client_name/work_order_number (design.html:1926, permitting.html:1883) | All wrapped with `esc()` |
| C4 | File upload preview rendering | No `FileReader`/`createObjectURL`/blob preview rendering found in either file |
| C5 | Cascade picker sessionStorage keys (`lf_dp_cascade_*`) | Values are server-returned UUIDs/enum strings; not rendered back into innerHTML |
| C6 | `acceptPotential` sr_hwy in onclick (permitting.html:1940-1944) | `esc(p.sr_hwy||'').replace(/'/g,"\\'")` applied; final assignment is `.value =` (not innerHTML) |
| C7 | `formatRequestRow` entityLabel fallback (`sr.entity_type`) | `esc(entityLabel)` applied at render site (design.html:2197) |
| C8 | CSS injection via status color maps | All whitelist-object lookups — unknown keys produce `undefined` (invalid CSS, not injected code) |
| C9 | `badge-${p.status}` class attribute (permitting.html:817) | Class attribute injection — no HTML injection possible |
| C10 | `renderProjects()` status badge text (permitting.html:817) | `${esc(p.status)}` — correctly escaped |
| C11 | `DL[x]` in progress bar `title` (design.html:1925) | Hardcoded local object mapping known stage strings — not user data |
| C12 | Client-side role gating (`u.role === 'admin'`) | Gates UI visibility only; data access gated server-side — acceptable pattern |
| C13 | sessionStorage cascade client/program/SA selection | IDs, not credentials — tab-scoped, low sensitivity |

---

## Coverage Gaps

1. **Backend status field validation** — severity of F1/F2 depends on whether the backend enforces `CHECK (status IN (...))`. If it does, F1/F2 are informational. Backend audit is separate.
2. **DWG file listing metadata rendering** — no file-listing render loop found in the audited sections. If file metadata (filename, uploader) is rendered in a separate modal or component file, that surface was not covered.
3. **Notes/comments display** — no dedicated notes render loop found. If project notes are displayed via a separate JS module or modal, that is outside scope.
4. **Workspace integration** — not identified as a distinct rendering surface in the current codebase; may be a future build feature.

---

## Summary Table

| Finding | Severity | File(s) | Fix |
|---|---|---|---|
| F1 — `${p.status}` unescaped in loadPotential | MEDIUM | both | 2-line |
| F2 — `${sr.status}` unescaped in formatRequestRow | MEDIUM | both | 3-line |
| F3 — JWT in sessionStorage | MEDIUM | both | Architectural |
| F4 — `p.id` unescaped in onclick | LOW | both | 4-line per portal |
| F5 — window.open without noopener | LOW | design.html | 1-line |
| F6 — esc() doesn't block javascript: in href | LOW | both | Document + validator |
| F7 — No CSRF token | LOW | both | Backend wave |

**Verdict: YELLOW** — 2 MEDs (exploitable only if XSS lands + DB has unvalidated status values), 1 MED (architectural token storage), 4 LOWs. No confirmed HIGH. Primary fix targets are F1+F2 (`esc()` on status fields).

=== WAVE-186 DESIGN PERMITTING FE REPORT END ===
