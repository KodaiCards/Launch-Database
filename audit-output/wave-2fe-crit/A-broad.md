# Wave 2 FE-Crit Remainder — Auditor A (broad fresh-eyes)

## Stack snapshot

Admin SPA + extracted JS tab modules (hours_tab, billing_tab, revenue_tab, projects_tab, permits_tab, inspection_tab, dashboard_views, project_picker, tree_state, dialog). `persistFilter` restores from localStorage. Three independent tree-state objects. `confirmDialog`/`alertDialog` available. Phase-1 `try/catch` landed on `loadDashboard` and `loadRevenue`; remaining tabs vary in coverage.

## Findings

| # | Severity | Category | File | Line range | Snippet | Issue (1 line) | Fix shape (1 line) | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | HIGH | State-mgmt / unhandled throw | `public/js/hours_tab.js` | 61–78 | `let entries = await api(...)` | `loadHours()` has no outer try/catch — network error leaves the Hours tab blank/frozen with no user feedback | Wrap function body in `try { ... } catch (err) { ... toast/error-render ... }` matching `loadDashboard` pattern | HIGH |
| 2 | HIGH | State-mgmt / unhandled throw | `public/js/billing_tab.js` | 62–77 | `const [unbilled, invoices] = await Promise.all([...])` | `loadBilling()` has no outer try/catch — either API call throwing leaves Billing tab blank/silent | Same pattern: outer `try/catch` with error render into `billing-stats` or a toast | HIGH |
| 3 | HIGH | State-mgmt / unhandled throw | `public/js/hours_tab.js` | 496–517 | `await api('/api/time-entries', 'POST', body)` / `await api('/api/time-entries/' + id, 'PUT', body)` | `saveTimeEntry()` has no try/catch — a server error closes the modal AND leaves the entry unsaved with no feedback | Wrap both API calls in try/catch; on error keep modal open + show error | HIGH |
| 4 | HIGH | State-mgmt / unhandled throw | `public/js/permits_tab.js` | 121–128 | `await api('/api/permits/' + projectId + '/advance', 'PUT', {})` | `advancePermitFromPopup()` has no try/catch — permit advance failure silently stalls the popup with no error | Add try/catch; on error call `alertDialog` and abort downstream calls | HIGH |
| 5 | HIGH | State-mgmt / unhandled throw | `public/js/permits_tab.js` | 138–143 | `const permits = await api('/api/permits')` | `loadPermitDocs()` has no try/catch — failure shows nothing in the open modal body (blank list) | Add try/catch; render inline error into `#permit-doc-list` | HIGH |
| 6 | HIGH | persistFilter re-trigger gap | `public/admin.html` | 1090–1096 | `<select id="hrs-month">` / `<select id="hrs-year">` | `hrs-month` and `hrs-year` have no `onchange` handler — `persistFilter` restores values and dispatches a `change` event, but nothing catches it; restored period/year are silently ignored until another control fires | Add `onchange="loadHours()"` to both elements, matching the `hrs-period` / `hrs-groupby` pattern (line 1086, 1097) | HIGH |
| 7 | MEDIUM | Tree state cross-contamination | `public/js/revenue_tab.js` / `public/js/projects_tab.js` / `public/js/dashboard_views.js` | rev:78,113 / proj:248,317 / dash:354,403 | `projectsTreeState.isExpanded(p.id)` in all three | Dashboard, Projects, and Revenue trees all share `projectsTreeState` — expanding a project in Revenue bleeds into Projects tree; collapsing all in Projects collapses Revenue tree too | Give Revenue its own `makeTreeState('revenue')` instance; update `rtreeToggle` config and `renderRevenueDetail` to use it | HIGH |
| 8 | MEDIUM | Actor pre-fill missing | `public/js/permits_tab.js` / `public/admin.html` | permits:131–136 / admin:1918 | `<input id="doc-uploader" placeholder="Your name">` | `openPermitDocs()` never pre-fills `#doc-uploader` with the logged-in user's name — `currentUser.full_name` is available but unused | In `openPermitDocs()`, set `document.getElementById('doc-uploader').value = (window.currentUser?.full_name || window.currentUser?.username || '')` | MEDIUM |
| 9 | MEDIUM | Actor pre-fill missing | `public/js/design_docs.js` / `public/admin.html` | design_docs:18–23 / admin:1960 | `<input id="design-doc-uploader" placeholder="Your name">` | `openDesignDocs()` never pre-fills `#design-doc-uploader` with the logged-in user | Same fix: set value from `window.currentUser` in `openDesignDocs()` | MEDIUM |
| 10 | MEDIUM | Actor pre-fill missing | `public/js/hours_tab.js` | 395–408 | `document.getElementById('te-staff').value = ''` | `openTimeEntryModal()` (new-entry path) sets `te-staff` to blank; if the logged-in user is a staff member their `staff_id` could be pre-filled from `currentUser` | On open, look up `window.currentUser?.id` in `staff[]` and pre-select if found | MEDIUM |
| 11 | MEDIUM | Native confirm/alert in extracted modules | `public/js/hours_tab.js` | 520, 544, 501, 550, 552, 558 | `if (!confirm('Delete this time entry?'))` | Six `confirm()` / `alert()` calls remain in `hours_tab.js` after Phase-1 sweep (deleteTimeEntry, deleteAllHoursForStaff, saveTimeEntry, error paths) — blocks thread, breaks dark-mode UX | Replace with `confirmDialog` / `alertDialog` from `dialog.js` (already loaded) | MEDIUM |
| 12 | MEDIUM | Native confirm/alert in extracted modules | `public/js/billing_tab.js` | 263, 274, 53, 59, 270, 281 | `if (!confirm(action)) return` | Four `confirm()` + two `alert()` in `billing_tab.js` (deleteInvoice, deleteBilledProject, editInvoiceAmount error paths) | Same: replace with `confirmDialog` / `alertDialog` | MEDIUM |
| 13 | MEDIUM | Native confirm/alert in extracted modules | `public/js/permits_tab.js` | 115, 190, 191, 223 | `alert('Advance failed: ' + e.message)` | Three `alert()` calls in permits_tab.js (advancePermit catch, uploadDoc validation, uploadDoc error) | Replace with `alertDialog` | MEDIUM |
| 14 | LOW | State-mgmt / no cleanup on filter restore | `public/admin.html` | 2951–2966 | `el.dispatchEvent(new Event('change', { bubbles: true }))` | `persistFilter()` fires a `change` event on every restored element at init — for tabs not yet active this triggers `loadHours()` / `loadPermits()` etc. before the user navigates there, wasting API calls and racing with the tab's own `showView` load | Gate: skip initial data-fetch if the element's tab is not currently active (check `currentView` or only dispatch `change` for filter elements where the tab is visible) | LOW |

## Negative findings (checked + confirmed clean)

- `loadDashboard` and `loadRevenue` — both have outer try/catch since Phase-1; confirmed at lines 391–396 (`dashboard_views.js`) and 261–266 (`revenue_tab.js`)
- `loadProjects` — has inner try/catch at lines 57–62 (`projects_tab.js`); renders inline error to `#projects-body`
- `loadPermits` — has outer try/catch at lines 37–43 (`permits_tab.js`); renders inline error to `#permits-body`
- `loadInspection` — has outer try/catch at lines 193–198 (`inspection_tab.js`); renders inline error to `#inspection-body`
- `billingHistoryTreeState` is correctly separate from `hoursTreeState` — billing invoice history no longer bleeds into Hours tree (confirmed `billing_tab.js` lines 288–318)
- `dialog.js` — `confirmDialog` / `alertDialog` fully implemented, no functional bugs found
- `project_picker.js` — leaf-only filter logic clean; no state leakage
- SSE debounce pattern — all six tab modules implement visibility-aware debounce (`_dashStale`, `_hoursStale`, etc.); re-renders correctly deferred when not active tab
- `deleteProjectDoc` in `api.js` — properly uses `confirmDialog`

## Coverage gaps

- Did not read `public/js/jobs_settings.js`, `public/js/clients_settings.js`, `public/js/pricing_settings.js` — Settings-only; lower daily-use risk. Flag for Phase-3 if scope widens.
- Did not read full `public/admin.html` inline script beyond key sections (project save/edit modal, splice-related inline code). ~4000 lines unread; may contain additional uncaught throws in modal submit handlers.
- Did not audit `public/permitting.html` or `public/design.html` inline scripts for actor pre-fill — portals have their own `currentUser` but doc-uploader fields are admin-only.
- `public/js/audit_drawer.js`, `public/js/overlay_modal.js`, `public/js/undo_bar.js` — utility modules; not audited.

=== WAVE 2 FE-CRIT AUDITOR A REPORT END ===
