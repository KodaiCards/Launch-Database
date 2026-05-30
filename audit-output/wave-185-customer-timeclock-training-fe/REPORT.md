# Wave 185 — Frontend Security Audit
## Files: public/customer.html + public/timeclock.html + public/training.html

**Write-path constraints acknowledged: only `audit-output/wave-185-customer-timeclock-training-fe/REPORT.md` written.**

**Audit date:** 2026-05-30
**Files checked:** `public/customer.html` (427 lines), `public/timeclock.html` (1863 lines)
**`public/training.html`** — NOT PRESENT (Vite dist served under `/training/`, no training.html entrypoint in `public/`).

---

## SECTION 1: public/customer.html

### VERIFIED CLEAN

| Check | Result |
|---|---|
| innerHTML with DB-sourced data | All fields run through `esc()` before innerHTML assignment (lines 248, 265-294, 306-333, 348-368, 395) |
| esc() completeness | `esc()` at line 214 handles `& < > " '` - all five HTML special chars |
| onclick attribute injection | Only use is `onclick="cpOpenDetail('${esc(p.id)}')"` at line 279; `p.id` is a server-generated UUID containing only `[0-9a-f-]` - no injectable chars even without esc |
| target=_blank | None present |
| localStorage / sessionStorage | Only `lfs-theme` (non-sensitive UI preference) at line 194 |
| lfs_token in sessionStorage | Not present |
| Open redirect | Hard-coded `/login` redirect only (lines 221, 412) |
| eval / Function() constructors | None |
| iframes | None |
| Mixed content (http:// resources) | None - all external resources loaded via https CDN |
| Client-side role gating | No role checks in customer.html; all data scoping enforced server-side via `requireAuth(['customer'])` + `clientIdsForUser()` |
| notes field XSS | `p.notes` rendered at line 316 via `esc(p.notes)`. The `/api/customer/projects/:id` SQL does NOT SELECT `notes` column; `p.notes` always falsy. Dead code path but correctly escaped. |
| CSRF | All state-changing fetches use `credentials: 'same-origin'`; server sets `sameSite: 'lax'` (auth.js:88) - adequate CSRF mitigation |
| Authentication gates | `requireAuth(['customer'])` enforced on all `/api/customer/*` endpoints server-side |
| Invoice data isolation | `clientIdsForUser(req.user.id)` scopes every query to current user's linked clients |

**VERDICT: GREEN** - No exploitable vulnerabilities found.

---

## SECTION 2: public/timeclock.html

### FINDING T-1 — HIGH — Stored XSS via job_title in quick-clock button onclick attribute

**Severity:** HIGH
**Verified by reading:** `timeclock.html:950-963`

**Code snippet (lines 950-962):**
```javascript
slot.innerHTML = `
  ...
  ${recents.map(r => {
    return `<button ...
      onclick="quickClockIn('${esc(r.project_id)}','${esc(r.job_id||'')}','${esc(r.job_title||'')}')">
      ...
    </button>`;
  }).join('')}
`;
```

**Attack path:**
1. Authenticated employee submits clock-in with `job_title = ');alert(document.cookie)//`
2. Server stores it verbatim in `time_clock_sessions.job_title` (TEXT, no character constraint)
3. `/api/timeclock/recent` returns this `job_title`
4. `renderQuickClockSlot` calls `esc(r.job_title)` → `&#39;);alert(document.cookie)//`
5. Written into double-quoted HTML attribute: `onclick="quickClockIn('uuid','','&#39;);alert(document.cookie)//')"`
6. Browser HTML-decodes the attribute value BEFORE passing to JavaScript: `&#39;` → `'`
7. JavaScript executes: `quickClockIn('uuid','','')` then `alert(document.cookie)`
8. XSS fires on page load - no interaction required

**Root cause:** `esc()` prevents breaking out of HTML attribute double-quotes `"..."` but does NOT prevent injection into the JS single-quoted string literal `'...'` inside those quotes. The HTML-decode step happens before JS evaluation, so `&#39;` becomes `'` in the JS context.

**Impact:** Stored XSS. Attacker with employee credentials can execute arbitrary JS in other employees' browsers. `lfs_session` is `httpOnly` so direct cookie theft is blocked, but the JS can make authenticated API calls (CSRF-equivalent escalation). Any employee who clocked into the poisoned project in the last 14 days is affected.

**Fix shape:** Replace string-interpolation-into-onclick with data attributes + addEventListener:
```javascript
const btn = document.createElement('button');
btn.dataset.projectId = r.project_id || '';
btn.dataset.jobId = r.job_id || '';
btn.dataset.jobTitle = r.job_title || '';
btn.addEventListener('click', () =>
  quickClockIn(btn.dataset.projectId, btn.dataset.jobId, btn.dataset.jobTitle));
```
Data attributes accept arbitrary text without HTML entity confusion. DOM-assigned listeners receive raw string values without the HTML-decode step.

---

### FINDING T-2 — MED — Client-side can_create_projects gate not enforced server-side

**Severity:** MED
**Verified by reading:** `timeclock.html:579` and `portal_module.js:755`

**Code (timeclock.html:579):**
```javascript
if (addNewBtn && currentUser.can_create_projects) addNewBtn.style.display = '';
```

**Backend (portal_module.js:755):**
```javascript
app.post('/api/portal/projects/request-create', requireAuth(), async (req, res) => {
  // NO can_create_projects check - any authenticated employee can call this
```

**Attack path:** Any authenticated employee can POST directly to `/api/portal/projects/request-create` with valid JSON, bypassing the UI visibility gate.

**Impact:** Employees without the capability can spam project creation requests into the admin approval queue. Not a data-integrity escape (admin must still approve), but an authorization bypass.

**Fix shape:** Add to the handler after `requireAuth()`:
```javascript
if (!(await canCreateProjects(req.user, pool))) {
  return res.status(403).json({ error: 'Not authorized to request project creation.' });
}
```

---

### FINDING T-3 — LOW — Ghost sessionStorage.removeItem('lfs_token') in signOut()

**Severity:** LOW
**Verified by reading:** `timeclock.html:689`

```javascript
async function signOut(){
  try { await fetch('/api/auth/logout', ...); } catch(e){}
  try { sessionStorage.removeItem('lfs_token'); } catch(e){} // dead code
  // ...
}
```

No code path in timeclock.html writes `lfs_token` to sessionStorage. This is dead cleanup code from a prior Bearer token auth design. No active security risk, but misleads future developers about the auth model.

**Fix shape:** Remove `sessionStorage.removeItem('lfs_token')` and its try/catch wrapper.

---

### VERIFIED CLEAN (timeclock.html)

| Check | Result |
|---|---|
| innerHTML content rendering | All DB-sourced strings run through `esc()` in `renderEntries()`, `renderClockCard()`, display portion of `renderQuickClockSlot()` |
| openEditEntryModal onclick param | `e.id` is UUID (server-generated, `[0-9a-f-]` chars only) - safe |
| target=_blank | Line 625 uses `rel="noopener"` correctly |
| eval / Function() | None |
| iframes | None |
| Mixed content | None |
| Open redirect | Hard-coded `/login` only |
| Portal URLs in href | Sourced from `PORTAL_URLS` env var (server-controlled), also esc()'d, rel="noopener" present |
| SSE event source URL | Same-origin `/api/events/stream` only - no user-controlled URL |
| Account modal rendering | `esc(u.full_name)`, `esc(u.email)` at lines 666-667 |
| pending-banner innerHTML | `esc(name)` and `esc(work_order_number)` applied (line 1720) |
| rnp-error messages | `errEl.textContent = ...` not innerHTML (line 1723) |
| CSRF | `credentials: 'same-origin'` + `sameSite: 'lax'` - adequate |
| Clickjacking | Server sets `X-Frame-Options: DENY` globally (server.js:63) |

---

## SECTION 3: public/training.html

**NOT PRESENT** — No `public/training.html`. Training is a pre-built Vite SPA under `public/training/`. The bundled JS is minified and not auditable here. Source audit would require `osp-training/src/` review.

---

## AGGREGATE FINDINGS

| # | Severity | File | Issue |
|---|---|---|---|
| T-1 | **HIGH** | timeclock.html:955 | Stored XSS - job_title in quick-clock onclick attribute; esc() insufficient for JS string literal in HTML event handler |
| T-2 | **MED** | timeclock.html:579 / portal_module.js:755 | Client-side can_create_projects gate not enforced server-side on /api/portal/projects/request-create |
| T-3 | **LOW** | timeclock.html:689 | Stale sessionStorage.removeItem('lfs_token') ghost cleanup - dead code from prior auth design |

**customer.html:** GREEN (0 findings)
**timeclock.html:** RED (1 HIGH + 1 MED + 1 LOW)
**training.html:** SKIPPED (not present)

### Aggregate verdict: RED (T-1 stored XSS is merge-blocking)

---

## COVERAGE GAPS

- `/public/training/` Vite bundle: minified, not audited here; `osp-training/src/` source audit needed
- Backend `/api/timeclock/clock-in` job_title length/character validation not checked - server-side sanitization would be defence-in-depth
- `public/js/change_password_modal.js`, `public/js/project_picker.js`, `public/js/undo_bar.js` (loaded by timeclock.html) - out of scope for this wave

=== WAVE 185 REPORT END ===
