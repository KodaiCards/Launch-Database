# Wave 2 FE-Crit — HIGH Fix Report

> Fix agent run against canonical H-1..H-8 + NF-1 backend.
> Verification baseline: `a413ec0`. All items built against `718a581` HEAD.
> Push cadence: one commit per item (or paired items sharing a file), pull-rebase before every push.

---

## Per-item status table

| # | Status | SHA | File(s) | Notes |
|---|---|---|---|---|
| **H-1** | ADDRESSED | `c3f1d7b` | `public/js/hours_tab.js` | Both api() calls wrapped in try/catch. `closeModal` + `loadHours()` moved to success branch only. Bare `alert()` validation converted to `alertDialog({title,message})`. Regression flag met: modal stays open on error. |
| **H-2** | ADDRESSED | `a946fc8` | `public/js/hours_tab.js` | Outer try/catch wraps full loadHours() body. Error renders inline to `#hours-tree-body`. `finally` clears load-guard. |
| **H-3** | ADDRESSED | `a829170` | `public/js/billing_tab.js` | `Promise.all` wrapped in try/catch. On failure: error card rendered into `#billing-stats`, early return. Matches `loadPermits` pattern. |
| **H-4** | ADDRESSED | `2e8fcfd` | `public/js/permits_tab.js` | try/catch around api() call. Downstream calls (`reloadProjectDetail`, `loadPermits`, `loadDashboard`) in success branch only. `alertDialog({title,message})` on error. Regression flag met. |
| **H-5** | ADDRESSED | `2e8fcfd` | `public/js/permits_tab.js` | try/catch around api('/api/permits'). Error rendered inline to `#permit-doc-list`. `list` ref hoisted before try block. |
| **H-6** | ADDRESSED | `efa27dc` | `public/js/hours_tab.js` | try/catch around DELETE api(). `loadHours()` + undo bar in success branch only. Native `confirm()` → `await confirmDialog({danger:true})`. `alertDialog` on catch. Regression flag met: no reappearing entry on failure. |
| **H-7** | ADDRESSED | `d6d0e12` | `public/admin.html` | `onchange="loadHours()"` added to `#hrs-month` and `#hrs-year`. Both now match `#hrs-period` + `#hrs-groupby` wiring. |
| **H-8** | ADDRESSED | `d45676d` | `public/js/tree_state.js`, `public/js/revenue_tab.js`, `public/js/projects_tab.js` | `revenueTreeState = makeTreeState('revenue')` singleton added to tree_state.js. `renderRevenueDetail` (`thisExpanded`) and `rtreeToggle` constructor both updated to use `revenueTreeState`. Dashboard + Projects continue sharing `projectsTreeState`. Stale comment in projects_tab.js updated. Regression flag met: both revenue_tab.js references updated. |
| **NF-1 (backend)** | ADDRESSED | `828117f` | `auth.js` | `staff_id` added to `/api/auth/me` SELECT column list. Response body now includes `staff_id`, unblocking the M-1 frontend pre-fill. |

---

## L-2 fold-in note

L-2 (double-fire on `hrs-period` restore) was fixed as part of the H-2 commit, not as a standalone. The load-guard (`_loadHoursGuard` flag + 50ms coalescing timer) was added in `a946fc8` **before** the H-7 `onchange` handlers were wired in `d6d0e12`. Sequence matters: the guard was in place before H-7 made month+year also fire `loadHours()`, so the double/triple-fire path from `persistFilter` restoring all three selects synchronously is already collapsed to one fetch. L-2 is fully addressed as a side-effect of the H-2+H-7 combined fix.

---

## Regression safety

- `loadDashboard` + `loadRevenue` Phase-1 try/catch: untouched.
- `billingHistoryTreeState` / `hoursTreeState` separation: untouched.
- SSE debounce pattern: untouched across all tabs.
- Projects + Dashboard `projectsTreeState` sharing: confirmed unchanged.
- `confirmDialog` / `alertDialog` calls: all use opts-object form `{title, message}` matching dialog.js signature.

---

## Items NOT in this wave (deferred per scope)

- M-1 frontend pre-fill (`openTimeEntryModal` staff pre-select) — MED wave.
- M-2, M-3, M-5, M-6 — MED wave.
- L-1, L-3 — LOW wave.

=== WAVE 2 FE-CRIT HIGH FIX REPORT END ===
