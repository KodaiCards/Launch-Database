# Wave 2 FE-Crit Remainder — Verification Red-Team

## Stack snapshot

Admin SPA with extracted JS tab modules. Phase-1 try/catch landed on `loadDashboard` + `loadRevenue`. Remaining tabs (hours, billing, permits) have scattered coverage. `tree_state.js` provides `makeTreeState` factory + three singletons. `persistFilter` wires localStorage restore + change dispatch. `confirmDialog`/`alertDialog` available in `dialog.js`. Verification done against HEAD `f7fe9a8`.

---

## Verification table

| # | Status | Rationale | Snippet |
|---|---|---|---|
| **H-1** | VERIFIED | `saveTimeEntry()` has no try/catch. Both `api()` calls at lines 511+513 are bare awaits — rejection propagates uncaught. | `await api('/api/time-entries/' + encodeURIComponent(id), 'PUT', body);` (hrs_tab.js:511) `await api('/api/time-entries', 'POST', body);` (hrs_tab.js:513) |
| **H-2** | VERIFIED | `loadHours()` body has no outer try/catch. `let entries = await api(...)` at line 78 throws unguarded on failure. Compare: `loadDashboard` has explicit catch. | `let entries = await api(\`/api/time-entries?${qs}\`);` (hours_tab.js:78) |
| **H-3** | VERIFIED | `loadBilling()` has no outer try/catch. `Promise.all` at line 74 throws unguarded. Compare: `loadPermits` has explicit catch rendering into `#permits-body`. | `const [unbilled, invoices] = await Promise.all([api('/api/revenue/unbilled'), api('/api/invoices?year=' + year)]);` (billing_tab.js:74) |
| **H-4** | VERIFIED | `advancePermitFromPopup()` has no try/catch (lines 121-129). Sibling `advancePermit()` at lines 104-117 has a try/catch with alert + re-enable guard — inconsistent. | `async function advancePermitFromPopup(projectId) { await api('/api/permits/' + projectId + '/advance', 'PUT', {});` (permits_tab.js:121-122) |
| **H-5** | VERIFIED | `loadPermitDocs()` has no try/catch — `await api('/api/permits')` at line 139 throws unguarded on failure. Modal body stays blank. | `async function loadPermitDocs(projectId) { const permits = await api('/api/permits');` (permits_tab.js:138-139) |
| **H-6** | VERIFIED | `deleteTimeEntry()` has no try/catch. The DELETE api call at line 521 is bare-await. On failure, `loadHours()` still fires (line 522), entry reappears. | `const resp = await api('/api/time-entries/' + id, 'DELETE'); loadHours();` (hours_tab.js:521-522) |
| **H-7** | VERIFIED | `hrs-month` (line 1090) and `hrs-year` (line 1096) have no `onchange`. `hrs-period` at line 1086 has `onchange="loadHours()"` and `hrs-groupby` at line 1097 has `onchange="loadHours()"`. Gap confirmed. | `<select class="filter" id="hrs-month">` (admin.html:1090) vs `<select class="filter" id="hrs-period" onchange="loadHours()">` (admin.html:1086) |
| **H-8** | VERIFIED | All three trees share single `projectsTreeState` instance. `rtreeToggle` (revenue_tab.js:112-117), `ptreeToggle` (projects_tab.js:316-320), and `dtreeToggle` (dashboard_views.js:402-407) all pass `state: projectsTreeState`. `tree_state.js` comment at line 62-65 explicitly acknowledges the shared singleton. | `const rtreeToggle = makeTreeToggle({ state: projectsTreeState, ... })` (revenue_tab.js:112-113) |
| **M-1** | VERIFIED with amendment | `openTimeEntryModal()` sets `te-staff` to `''` at line 401 with no pre-fill. Issue confirmed. **Critical amendment: `/api/auth/me` (auth.js:394) SELECT does NOT include `staff_id` — `window.currentUser.staff_id` will always be `undefined`.** Fix must also add `staff_id` to the `/api/auth/me` query. | `SELECT id, username, role, team, extra_teams, full_name, email, theme FROM users WHERE id = $1` (auth.js:394) — `staff_id` absent |
| **M-2** | VERIFIED | `openPermitDocs()` at line 131-136 opens modal and calls `loadPermitDocs()` — no pre-fill of `#doc-uploader` from `window.currentUser`. | `function openPermitDocs(projectId, name) { window.currentPermitProjectId = projectId; ... openModal('permit-doc-modal');` (permits_tab.js:131-134) |
| **M-3** | VERIFIED | `openDesignDocs()` at design_docs.js:18-23 opens modal and calls `loadDesignDocs()` — no pre-fill of `#design-doc-uploader`. | `function openDesignDocs(projectId, name) { currentDesignProjectId = projectId; ... openModal('design-doc-modal'); loadDesignDocs(projectId); }` (design_docs.js:18-23) |
| **M-4** | OVERSTATED (but real) | The audit described `showView('projects')` firing before `loadClients()` completes — this is incorrect. `await Promise.all([loadClients(),...])` at line 3048 fully awaits before `showView(_initHash)` at line 3066. However a real but milder race exists: `persistFilter` for `proj-status-filter` (line 3013) fires synchronously before `Promise.all`, triggering a floating `loadProjects()` without the client filter populated. That first load is unfiltered; corrected only after `loadClients()` fires a second load. Result is a transient unfiltered render, not a persistent mismatch as described. Fix shape (re-trigger inside `loadClients()` callback) is appropriate but description severity overstated. | `].forEach(([key, id]) => persistFilter(key, document.getElementById(id)));` (admin.html:3028) fires before `await Promise.all([loadClients(),...])` (admin.html:3048) |
| **M-5** | VERIFIED | `loadPermitDocs()` fetches all permits on line 139 to find one project's docs. Called on every modal open and every upload. | `const permits = await api('/api/permits'); const p = permits.find(x => x.id === projectId); const docs = p?.documents \|\| [];` (permits_tab.js:139-141) |
| **M-6** | VERIFIED | All 16 sites confirmed: hours_tab.js lines 472, 501, 520, 544, 550, 552, 558 (7 calls); billing_tab.js lines 53, 59, 263, 270, 274, 281 (6 calls); permits_tab.js lines 115, 190, 191, 223 (4 calls). All native `confirm()`/`alert()`. | `if (!confirm('Delete this time entry?')) return;` (hours_tab.js:520) |
| **L-1** | VERIFIED | `persistFilter` at line 2959 fires `el.dispatchEvent(new Event('change', { bubbles: true }))` unconditionally for all restored elements, including those in inactive tabs. This triggers `loadHours()`, `loadPermits()`, etc. before user visits those tabs. | `el.dispatchEvent(new Event('change', { bubbles: true }));` (admin.html:2959) |
| **L-2** | VERIFIED | `hrs-period` has `onchange="loadHours()"` (admin.html:1086). `persistFilter` restores value and fires `change` → `loadHours()`. If hours is start tab, `showView('hours')` fires `loadHours()` a second time. Confirmed double-load path. | `<select class="filter" id="hrs-period" onchange="loadHours()">` (admin.html:1086) — change fires during `persistFilter` AND on `showView('hours')` |
| **L-3** | VERIFIED | `deleteInvoice()` at line 259-271 calls `loadBilling()` on success. `restoreBillingHistoryExpandedState()` then iterates `billingHistoryTreeState.keys()` — the deleted client's key persists in the Set (only `billingHistoryTreeState.collapseChildren` + `collapse` are called on toggle, never on `loadBilling` refresh). | `function restoreBillingHistoryExpandedState() { for (const key of billingHistoryTreeState.keys()) {` (billing_tab.js:311-312) — no cleanup of orphaned keys post-delete |

---

## Regression-impact notes

- **H-1 (saveTimeEntry try/catch):** Fix must NOT call `closeModal('time-modal')` or `loadHours()` in the error path. Current code at line 515-516 calls both unconditionally — the fix needs to move them into the success branch only. Low-risk structural change.
- **H-4 (advancePermitFromPopup try/catch):** `reloadProjectDetail`, `loadPermits`, and `loadDashboard` must only fire on success. If put in catch without guarding, calling `reloadProjectDetail` after a failed advance could show stale popup state.
- **H-7 (hrs-month / hrs-year onchange):** Adding `onchange="loadHours()"` will double-fire during `persistFilter` restore (once from the change event, once again if hours is the starting tab via `showView`). This is the L-2 bug. The H-7 fix makes L-2 apply to month+year selects as well. Fix agent should address L-2 at the same time (load-guard flag recommended over suppressing synthetic change events, which would break the month/year live-update UX).
- **H-8 (Revenue tree state separation):** Revenue tab renders via `renderRevenueDetail()` which reads `projectsTreeState.isExpanded(p.id)` at revenue_tab.js:78. Fix must also update this reference to the new `revenueTreeState`. The `rtreeToggle` call at line 112 needs `state: revenueTreeState` instead of `state: projectsTreeState`. Dashboard and Projects trees are unaffected.
- **M-1 (staff pre-fill) — NEW FINDING FLAG:** Fix agent must also modify `auth.js:394` to include `staff_id` in the `/api/auth/me` SELECT. Without this, `window.currentUser?.staff_id` is always `undefined` and the pre-fill silently no-ops. Low-risk backend query change; `staff_id` is already on the users table.

---

## New findings

| # | Severity | Issue | File:line |
|---|---|---|---|
| NF-1 | HIGH | `/api/auth/me` SELECT at auth.js:394 omits `staff_id`. `window.currentUser.staff_id` is always `undefined` — M-1 fix is a no-op without a backend change. | `auth.js:394` |

---

## Coverage gaps

- Did not verify `advancePermit` (the non-popup variant) beyond confirming it has try/catch — its error path uses native `alert()` which is a M-6 catch on line 115 (already included).
- Did not read full `admin.html` inline script (~7000 lines) beyond the sections cited. Any additional `confirm()`/`alert()` calls in inline scripts outside the cited line ranges are unverified.
- Did not verify server-side `GET /api/permits/:id/documents` endpoint existence for M-5 fix shape — that endpoint may need to be created.
- Settings modules (`jobs_settings.js`, `clients_settings.js`, `pricing_settings.js`) remain out of scope per canonical deferred list.

=== WAVE 2 FE-CRIT VERIFICATION END ===
