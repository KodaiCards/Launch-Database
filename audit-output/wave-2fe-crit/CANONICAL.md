# Wave 2 FE-Crit Remainder — Canonical Fix List

> Built from Auditor A (broad fresh-eyes, 14 findings) + Auditor B (UX-flow, 9 findings).
> 17 deduplicated items. Standard wave per CLAUDE.md auditor-count rules.

---

## Scope summary

Frontend state-management correctness across the admin SPA + extracted tab modules. Daily-workflow polish that builds on Phase 1's try/catch landings on `loadDashboard` + `loadRevenue`. Files touched: `public/js/{hours,billing,permits,revenue,projects,design_docs}_tab.js`, `public/js/dashboard_views.js`, `public/js/tree_state.js`, `public/admin.html` (inline init / showView / persistFilter / select element wiring).

---

## HIGH — silent failure + state corruption (8 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| H-1 | A-3 + B-1 (2 auditors) | `public/js/hours_tab.js:496-516` | `saveTimeEntry()` has no try/catch. POST or PUT throwing → modal stays open, no feedback, entry not saved. User believes save succeeded. **Daily data-loss risk.** | Wrap both `api(...)` calls in try/catch. On error: `alertDialog`, keep modal open with input intact, do NOT call `loadHours()`. |
| H-2 | A-1 | `public/js/hours_tab.js:61-78` | `loadHours()` has no outer try/catch — Hours tab blanks on any API failure. | Wrap function body in try/catch matching `loadDashboard` pattern; render inline error to `#hours-body`. |
| H-3 | A-2 + B-5 (2 auditors) | `public/js/billing_tab.js:62-77` | `loadBilling()` has no outer try/catch — either `Promise.all` arm throwing leaves Billing tab blank, no feedback. | Wrap in try/catch; render error into `#billing-stats` matching `loadPermits` pattern. |
| H-4 | A-4 | `public/js/permits_tab.js:121-128` | `advancePermitFromPopup()` has no try/catch — permit advance failure silently stalls popup. | Add try/catch; on error call `alertDialog`, do NOT proceed to refresh. |
| H-5 | A-5 | `public/js/permits_tab.js:138-143` | `loadPermitDocs()` has no try/catch — failure shows blank list in open modal. | Add try/catch; render inline error to `#permit-doc-list`. |
| H-6 | B-2 | `public/js/hours_tab.js:519-529` | `deleteTimeEntry()` has no try/catch. Confirm passes → silent delete failure → `loadHours()` runs anyway → entry reappears. **Deeply confusing.** | Wrap in try/catch; show alertDialog on failure; only call `loadHours()` on success. |
| H-7 | A-6 | `public/admin.html:1090-1096` | `<select id="hrs-month">` and `<select id="hrs-year">` have NO `onchange` handler. `persistFilter` restores their values + dispatches `change`, but nothing catches it — restored period/year are silently ignored. | Add `onchange="loadHours()"` to both elements, matching `hrs-period` / `hrs-groupby` (line 1086, 1097). |
| H-8 | A-7 | `public/js/{revenue_tab.js:78,113 / projects_tab.js:248,317 / dashboard_views.js:354,403}` | Dashboard, Projects, and Revenue trees all share a single `projectsTreeState` instance. Expanding a project in Revenue bleeds into Projects tree; collapsing one collapses both. | Give Revenue its own `makeTreeState('revenue')` instance; update `rtreeToggle` and `renderRevenueDetail` to use it. Dashboard tree is its own debate — keep evaluation in fix-agent's report. |

## MEDIUM — UX friction + data quality (6 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| M-1 | A-10 + B-3 (2 auditors) | `public/js/hours_tab.js:395-407` | `openTimeEntryModal()` blanks `#te-staff` on open. `window.currentUser.staff_id` is supposed to be set but verification (NF-1) found `/api/auth/me` doesn't SELECT `staff_id`. Both ends need fixing. Every time-entry log requires manual staff dropdown selection. | **2-part fix:** (a) in `auth.js:394` `/api/auth/me` SELECT — add `staff_id` to the column list + return it in the response body. (b) in `openTimeEntryModal()` pre-select `te-staff` to `window.currentUser?.staff_id` when present and the staff exists in the dropdown options. |
| M-2 | A-8 | `public/js/permits_tab.js:131-136` (admin.html:1918) | `openPermitDocs()` never pre-fills `#doc-uploader` with logged-in user name. | Set value from `window.currentUser?.full_name \|\| window.currentUser?.username` on modal open. |
| M-3 | A-9 | `public/js/design_docs.js:18-23` (admin.html:1960) | `openDesignDocs()` never pre-fills `#design-doc-uploader`. | Same fix as M-2. |
| M-4 | B-4 | `public/admin.html:3028-3035, 3103` | Client-filter restore race: described as persistent mismatch, **verification (a413ec0) found this is OVERSTATED** — `Promise.all` actually completes before `showView()` so persistent mismatch doesn't occur. Real issue: transient unfiltered render from `proj-status-filter` early `change` dispatch that self-corrects. **Severity downgraded MEDIUM → LOW.** | Lower priority fix; re-trigger `loadProjects()` inside `loadClients()` callback when `proj-client-filter` restored value is non-empty. Optional — defer if time-constrained. |
| M-5 | B-6 | `public/js/permits_tab.js:138-142` | `loadPermitDocs()` fetches the entire permits list to find one project's docs. Slow + wasteful, called per modal open + per upload. | Pass document list from `openPermitDocs()` caller context, OR hit a single-project endpoint (`GET /api/permits/:id/documents`), OR cache last-loaded project docs on modal open. |
| M-6 | A-11 + A-12 + A-13 + B-8 (4 callouts) | `public/js/hours_tab.js` (6 sites: 520, 544, 501, 550, 552, 558), `billing_tab.js` (6 sites: 263, 274, 53, 59, 270, 281), `permits_tab.js` (4 sites: 115, 190, 191, 223) | Native `confirm()` / `alert()` survivors in extracted modules. Blocks thread, breaks dark-mode UX, inconsistent with Phase-1 sweep. | Replace each with `confirmDialog` / `alertDialog` from `dialog.js`. Already loaded. |

## LOW — polish + edge cases (3 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| L-1 | A-14 | `public/admin.html:2951-2966` | `persistFilter()` fires `change` event on every restored element at init — for tabs not yet active, this triggers `loadHours()` / `loadPermits()` etc. before user navigates there. Wasted API calls + races with tab's own `showView` load. | Gate: skip `change` dispatch if the element's tab is not currently active; OR debounce in the load function. |
| L-2 | B-7 | `public/js/hours_tab.js:61-78` | When `hrs-period` is restored, `change` fires `syncHrsPeriodVisibility` AND `loadHours()` via inline onchange; then `showView('hours')` re-fires `loadHours()` if hours is the starting tab. Double API call on every hours-tab page load. | Either suppress synthetic `change` in `persistFilter` for elements with explicit `onchange`, OR add a load-guard flag to `loadHours()`. |
| L-3 | B-9 | `public/js/billing_tab.js:259-270` | Deleting the last invoice in a client group leaves a dangling key in `billingHistoryTreeState`. `restoreBillingHistoryExpandedState` shows chevron expanded but no children exist. Cosmetic. | After `loadBilling()` post-delete, call `billingHistoryTreeState.clear()` for the orphaned client key. |

## Out of scope (deferred with reason)

- **Settings-module audits** (`jobs_settings.js`, `clients_settings.js`, `pricing_settings.js`) — A flagged as coverage gap. Lower daily-use risk; defer to a follow-up sweep wave.
- **Full `public/admin.html` inline script (~7000 unread lines)** — A and B both noted partial coverage. Significant remaining surface; defer to a follow-up wave once Phase 3 lands.
- **Server-side SSE emission verification** — B noted SSE subscriptions in admin.html but didn't verify server emits all 6 event types. Out of FE scope; defer to a SSE plumbing wave.

## Verification tier guide (for verification red-team) — COMPLETED a413ec0

- **2-auditor convergence (quick spot-check):** H-1, H-3, M-1, M-6 — all VERIFIED.
- **1-auditor unique (full end-to-end verify):** 16/17 VERIFIED. M-4 OVERSTATED (downgraded LOW above). NF-1 new finding folded into M-1.

## Regression-risk flags from verification (a413ec0) — fix-agent must address

- **H-1 fix:** `closeModal()` + `loadHours()` must move to the success branch only — currently they run unconditionally even if `api(...)` would throw.
- **H-4 fix:** Downstream calls (`reloadProjectDetail`, etc.) must be success-only — guard against running after the catch.
- **H-7 + L-2 interact:** adding `onchange="loadHours()"` to month/year compounds L-2 (double-fire). Fix BOTH together — add a load-guard flag or debounce in `loadHours()` so multiple synchronous `change` dispatches collapse to one fetch.
- **H-8 fix:** Revenue's `renderRevenueDetail` reads `projectsTreeState.isExpanded` directly at `revenue_tab.js:78` — that line MUST also be updated to use the new `revenueTreeState`. Don't miss it when refactoring the toggle constructor.

## Acceptance criteria for fix-agent

1. All 17 items addressed OR explicitly deferred with reason in FIX_REPORT.
2. `node server.js` boots clean (smoke).
3. No regression in: existing try/catch on `loadDashboard` + `loadRevenue` (Phase 1), `billingHistoryTreeState` / `hoursTreeState` separation, SSE debounce pattern across all tabs.
4. Frontend tests if any.
5. `confirmDialog` / `alertDialog` replacements preserve existing semantics (danger flag where current `confirm()` is destructive).
6. Per-commit push cadence (after API failures earlier this session — minimize per-failure work loss).

=== WAVE 2 FE-CRIT CANONICAL END ===
