# Wave 2 FE-Crit — Auditor B: UX-Flow / Daily-Workflow Report

**Framing:** Walk actual users through their daily jobs. Find where UI lies, fails silently, or surprises the user.
**Scope:** public/js/hours_tab.js, permits_tab.js, projects_tab.js, billing_tab.js, dashboard_views.js, revenue_tab.js, tree_state.js, public/admin.html (init + showView + persistFilter).
**Word budget:** ≤1200 words.

---

## Stack snapshot

Filter persistence and tree-state infrastructure are solid — the plumbing for localStorage restore and SSE-driven stale flags is well-designed. The daily-workflow breaks cluster around three patterns: (1) silent API failure on destructive forms, (2) staff identity not inferred on the time-entry form, and (3) a load-ordering race that means a restored client filter silently shows all-projects data on first tab visit. The Permit Docs modal has a gratuitous full-list fetch on every open. No cross-tree state bleed (billingHistoryTreeState and hoursTreeState are properly separated post-fix).

---

## Findings

| # | Sev | Category | File | Line range | Snippet | Issue | Fix shape | Conf |
|---|-----|----------|------|-----------|---------|-------|-----------|------|
| B-1 | HIGH | Error-handling / silent fail | public/js/hours_tab.js | 496–516 | `await api('/api/time-entries', 'POST', body)` / `await api('/api/time-entries/' + id, 'PUT', body)` | `saveTimeEntry()` has no try/catch. If the POST or PUT throws (network error, 4xx, 5xx), the promise rejects, the modal stays open with no feedback, and `loadHours()` is never called. The user thinks they saved but didn't — and has no visible error to act on. | Wrap the `api()` calls in try/catch; on error: alert or toast the error, keep modal open so the user's input isn't lost. | HIGH |
| B-2 | HIGH | Error-handling / silent fail | public/js/hours_tab.js | 519–529 | `const resp = await api('/api/time-entries/' + id, 'DELETE')` | `deleteTimeEntry()` has no try/catch. A network failure silently succeeds from the user's perspective (the confirm already passed) but the entry is not deleted. Then `loadHours()` is called and the entry reappears — deeply confusing because the confirm modal already dismissed. | Wrap in try/catch; show alert on failure; only call `loadHours()` on success. | HIGH |
| B-3 | MEDIUM | Actor pre-fill — designer logs hours | public/js/hours_tab.js | 395–407 | `document.getElementById('te-staff').value = '';` | `openTimeEntryModal()` always blanks the staff field. `currentUser` is set in admin.html (line 7002) and includes `staff_id` when the linked user has one. A designer opening "Log hours" should see themselves pre-selected — right now they must scroll a dropdown every time. Daily-use friction: every time entry requires a manual staff selection. | In `openTimeEntryModal()`, if `currentUser?.staff_id` is set, pre-select it: `document.getElementById('te-staff').value = currentUser.staff_id`. | HIGH |
| B-4 | MEDIUM | persistFilter re-trigger gap | public/admin.html | 3028–3035, 3103 | `persistFilter(key, el)` fires `el.dispatchEvent(new Event('change'))` → but `proj-client-filter` is wired AFTER `loadClients()` in async `init()`, while `loadProjects()` is called at line 3103 via `showView('projects')` | Scenario: user had client=PSC filtered, refreshes page. `persistFilter` restores the select value. But `loadClients()` runs async in `init()`, and `persistFilter` for the client filter fires AFTER `Promise.all` completes. If the user is on the projects tab by hash (init line 3066), `showView('projects')` fires `loadProjects()` before `loadClients()` finishes wiring the client filter — projects load unfiltered, UI shows filtered. The user sees stale (all-projects) data that doesn't match the UI state. | Call `loadProjects()` again inside `loadClients()` callback only when `proj-client-filter` is restored to a non-empty value (i.e. after `persistFilter` runs for that key, if stored value is non-empty). | MEDIUM |
| B-5 | MEDIUM | Error-handling / silent fail | public/js/billing_tab.js | 74–77 | `const [unbilled, invoices] = await Promise.all([api(...), api(...)]);` | `loadBilling()` has no try/catch. If either API call fails (common when session expires or server restarts), the billing tab renders blank with no error message. The user sees an empty tab and doesn't know whether to reload or whether something is wrong with their data. Compare: `loadPermits()` has explicit catch with user-facing error in the table. | Wrap in try/catch with error render into `#billing-stats` or a status row, matching `loadPermits()` pattern. | MEDIUM |
| B-6 | MEDIUM | Wasteful UX / round-trip | public/js/permits_tab.js | 138–142 | `async function loadPermitDocs(projectId) { const permits = await api('/api/permits'); const p = permits.find(x => x.id === projectId)` | `loadPermitDocs()` fetches the entire permits list (every project's stages + documents) just to find the documents for one project. This is called every time the Docs modal opens AND after every upload. On a large dataset this is slow and wastes bandwidth. There should be a `GET /api/permits/:id/documents` endpoint (or reuse the already-fetched project data passed from `openPermitDocs`). | Pass the document list from the `openPermitDocs()` caller context, or hit a single-project endpoint. At minimum, cache the last-loaded project docs on the modal open so `loadPermitDocs()` post-upload only re-fetches the one project. | MEDIUM |
| B-7 | MEDIUM | Filter UX — re-trigger on restore | public/js/hours_tab.js | 61–78 | `async function loadHours() { const period = ... const m = document.getElementById('hrs-month').value;` | When `hrs-period` is restored to `ytd` by `persistFilter`, the `change` event fires `syncHrsPeriodVisibility` (hides month picker) but also fires `loadHours()` via the `onchange="loadHours()"` on the select (line 1086 in admin.html). This double-fires loadHours — once from the change event during init and again from `showView('hours')` if hours is the starting tab. Not a crash but an extra API call on every page load for hours-tab users. | In `persistFilter`, conditionally suppress the synthetic `change` event for elements that have an explicit `onchange` that calls a load function, OR have `loadHours` check a "already loading" guard flag. | LOW |
| B-8 | LOW | UX consistency | public/js/hours_tab.js | 519–521 | `if (!confirm('Delete this time entry?'))` | `deleteTimeEntry()` uses native `confirm()` while `deleteAllHoursForStaff()` uses native `confirm()` with a multi-line message, and `deleteProjectDoc()` in api.js uses `confirmDialog()`. Inconsistency: some deletes get the polished modal with danger styling; single-entry delete gets the browser OS dialog. | Replace `confirm(...)` with `await confirmDialog({ title: 'Delete time entry?', ..., danger: true })` matching the pattern used elsewhere. | LOW |
| B-9 | LOW | UX — invoice history tree post-delete | public/js/billing_tab.js | 259–270 | `await api('/api/invoices/...DELETE'); loadBilling();` | When a user expands Month → Client → Invoice to find a specific invoice and deletes it, `loadBilling()` re-renders the entire tree and calls `restoreBillingHistoryExpandedState()`. The restored expand state should re-open the same month and client — this part works. However if the deleted invoice was the last invoice in a client group, the client key still exists in `billingHistoryTreeState` and `restoreBillingHistoryExpandedState()` will attempt to show rows that no longer exist (no-op, but the chevron state is wrong — shows expanded but no children visible). | After `loadBilling()`, call `billingHistoryTreeState.clear()` when the invoice was the last one in its client group, OR let the re-render's `setHtmlIfChanged` handle it (it does, but the state has a dangling key). | LOW |

---

## Negative findings (checked and confirmed clean)

- **billingHistoryTreeState / hoursTreeState separation** — billing tree toggle uses `billingHistoryTreeState`, hours tree toggle uses `hoursTreeState`. No bleed between them. State-separation fix from Phase 1 is working correctly.
- **persistFilter for project filters** — status, type, and search filters (B-4 describes the client-filter edge case, but the other three are clean: wired before `showView` so their `change` dispatch correctly re-queries with the restored value).
- **loadHours try/catch** — `deleteAllHoursForStaff` has try/catch with alert on failure (line 545-558). Clean.
- **SSE stale flag pattern** — all tabs correctly mark `_*Stale = true` when not the active view, and drain the flag on `_showViewHooks`. No missed SSE-on-inactive-tab issues.
- **Tree expand state on SSE re-render** — `restoreHrsExpandedState()` is called after every `loadHours()` rebuild. Hours tree correctly repaints open sections after SSE-triggered reloads.
- **Filter double-restore on `hrs-period`** — `persistFilter` restores the value and fires change; `syncHrsPeriodVisibility` runs and hides/shows month picker correctly before data fetch. Cosmetic flash is avoided.

---

## Coverage gaps

- Did not read `inspection_tab.js`, `design_potential_tabs.js`, `construction_contracts.js` — these are in scope for Wave 2 FE-Crit broadly but fell outside the 7 specific daily workflows enumerated in this audit prompt. (~150 lines unread)
- Did not read the full `admin.html` inline script (~7000 lines) — focused on `init()`, `showView()`, `persistFilter()`, `loadStaff()`, `loadClients()`, and the SSE subscriber block (approximately 300 lines read out of 7000).
- `loadPermits` SSE subscription: `permit_added`, `permit_updated`, `permit_deleted`, `project_added`, `project_updated`, `project_deleted` are wired. Did not verify server-side SSE emission for `permit_*` events against routes/permits.js — out of scope for this FE audit.

---

=== WAVE 2 FE-CRIT AUDITOR B REPORT END ===
