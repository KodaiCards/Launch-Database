# Wave 2 FE-Crit — Post-Fix Verification

> Branch: `claude/debug-previous-issues-MoN9D`
> HEAD verified: `ee01d53` (FIX_REPORT_MED)
> Canonical baseline: `718a581`
> Fix commits verified: `c3f1d7b`, `a946fc8`, `efa27dc`, `2e8fcfd`, `a829170`, `d6d0e12`, `d45676d`, `828117f`, `13d3fa1`, `4d6324f`, `784de45`, `7f60d40`, `b6863c2`, `61fa9a9`

---

## Stack snapshot

14 fix commits across HIGH, MED, and LOW tiers were opened and read against canonical. All 9 regression-risk checks passed. One minor observation in the load-guard (not a correctness bug). Boot smoke not run (no Postgres available in environment — noted as coverage gap).

---

## Per-canonical-item status

| # | Status | SHA | Evidence |
|---|---|---|---|
| **H-1** | ADDRESSED | `c3f1d7b` | Both api() calls wrapped in try/catch. `closeModal` + `loadHours()` inside success branch only. Bare `alert()` → `alertDialog({title,message})`. Error: modal stays open. |
| **H-2** | ADDRESSED | `a946fc8` | Outer try/catch wraps full `loadHours()` body. Error renders to `#hours-tree-body` with danger style. `finally` clears `_loadHoursGuard`. |
| **H-3** | ADDRESSED | `a829170` | `Promise.all` wrapped in try/catch. Error card rendered to `#billing-stats`, early return. Matches `loadPermits` pattern. |
| **H-4** | ADDRESSED | `2e8fcfd` | try/catch around api() call. `reloadProjectDetail`, `loadPermits`, `loadDashboard` in success branch only. `alertDialog` on error. Regression flag met. |
| **H-5** | ADDRESSED | `2e8fcfd` | try/catch around `api('/api/permits')`. Error rendered inline to `#permit-doc-list`. `list` ref hoisted before try. |
| **H-6** | ADDRESSED | `efa27dc` | try/catch around DELETE api(). `loadHours()` + undo bar in success branch only. `confirm()` → `await confirmDialog({danger:true})`. `alertDialog` on catch. No reappearing entry on failure. |
| **H-7** | ADDRESSED | `d6d0e12` | `onchange="loadHours()"` added to `#hrs-month` and `#hrs-year` in admin.html. Both match `#hrs-period` + `#hrs-groupby` wiring. |
| **H-8** | ADDRESSED | `d45676d` | `revenueTreeState = makeTreeState('revenue')` added to `tree_state.js`. `renderRevenueDetail` line 78: `revenueTreeState.isExpanded(p.id)`. `rtreeToggle` constructor: `state: revenueTreeState`. Zero `projectsTreeState` refs remain in `revenue_tab.js`. Dashboard + Projects continue sharing `projectsTreeState`. Regression flag met (both revenue_tab.js references updated). |
| **M-1** | ADDRESSED | `13d3fa1` + `828117f` | Backend: `staff_id` in `SELECT` + `res.json(rows[0])` returns it. Frontend: new-entry path only. Guards: checks `window.currentUser.staff_id` present AND `option[value="${CSS.escape(myStaffId)}"]` exists in dropdown before setting. Edit path (`openEditTimeEntryModal`) sets from existing entry — untouched. |
| **M-2** | ADDRESSED | `4d6324f` | `openPermitDocs()` sets `#doc-uploader` to `currentUser.full_name \|\| currentUser.username` before `openModal()`. Falls back to `''` if `currentUser` absent. |
| **M-3** | ADDRESSED | `4d6324f` | `openDesignDocs()` sets `#design-doc-uploader` same pattern as M-2. |
| **M-4** | DEFERRED-OK | — | Downgraded LOW by verification `a413ec0` (OVERSTATED — `Promise.all` completes before `showView()`). Optional per canonical; deferred to follow-up wave. Acceptable deferral. |
| **M-5** | ADDRESSED | `784de45` | Module-level `_permitDocCache` Map keyed by `projectId`. Cache busted: (1) `uploadDoc()` success — before `loadPermitDocs()` call; (2) `deletePermitDoc()` success callback — uses `window.currentPermitProjectId` which is reliably set in `openPermitDocs()` before any delete can be triggered. No backend change needed. |
| **M-6** | ADDRESSED | `7f60d40` | `grep -nE "\bconfirm\(|\balert\("` on `hours_tab.js`, `billing_tab.js`, `permits_tab.js` returns zero non-comment hits. All 16 sites replaced with `confirmDialog`/`alertDialog`. Destructive deletes use `danger: true` + `confirmLabel`. |
| **L-1** | ADDRESSED | `b6863c2` | Guard: `el.closest('.view').classList.contains('active')` before dispatching. Inactive-tab elements skip synthetic change event. `showView()` calls load function directly on navigation — verified in admin.html `showView()` body (lines 3102–3124). Falls back to `tabIsActive = true` for elements with no `.view` ancestor. Reliable signal (DOM `classList.contains('active')`, not CSS queries). |
| **L-2** | ADDRESSED (folded) | `a946fc8` + `d6d0e12` | Load-guard deployed before H-7 onchange handlers wired. Three simultaneous `persistFilter` change dispatches coalesce to one fetch. Canonical fold-in confirmed. |
| **L-3** | ADDRESSED | `61fa9a9` | `billingHistoryTreeState.clear()` called before `loadBilling()` on confirmed invoice delete success. Catch path unchanged. Dangling chevron-expanded orphan eliminated. |
| **NF-1 (backend)** | ADDRESSED | `828117f` | `staff_id` added to SELECT column list. `res.json(rows[0])` returns all selected columns — `staff_id` included in response body. Unblocks M-1 frontend pre-fill. |

---

## Regression sweep results (9 checks)

1. **H-1 (`saveTimeEntry`) — success-only `closeModal` + `loadHours`:** PASS. Both calls inside `try` block after api() resolves. `catch` only calls `alertDialog`. Modal stays open on error.
   ```js
   try {
     if (id) { await api('/api/time-entries/' + encodeURIComponent(id), 'PUT', body); }
     else { await api('/api/time-entries', 'POST', body); }
     closeModal('time-modal');
     loadHours();
   } catch (e) { alertDialog({ title: 'Save failed', message: e.message }); }
   ```

2. **H-4 (`advancePermitFromPopup`) — downstream calls success-only:** PASS. `reloadProjectDetail`, `loadPermits`, `loadDashboard` all inside the `try` block after api() resolves. `catch` block only calls `alertDialog`.

3. **H-7 + L-2 load-guard — prevents simultaneous triple-fire:** PASS. `_loadHoursGuard` flag + 50ms coalescing timer in place at `a946fc8`. `finally` clears `_loadHoursGuard`. Note: `finally` does not cancel `_loadHoursPendingTimer` — after a guarded call lands, the timer can fire ~50ms later, triggering one additional fetch if `_loadHoursPending` is still `true`. This is a minor inefficiency (one extra init fetch), not a correctness bug or loop. Acceptable.

4. **H-8 — `renderRevenueDetail` at revenue_tab.js:78 uses `revenueTreeState`:** PASS. Line 78 reads `const thisExpanded = revenueTreeState.isExpanded(p.id)`. Zero `projectsTreeState` references remain in `revenue_tab.js`. Dashboard + Projects unchanged.

5. **NF-1 — `staff_id` in SELECT + response body:** PASS. `SELECT id, username, role, team, extra_teams, full_name, email, theme, staff_id FROM users WHERE id = $1` followed by `res.json(rows[0])` — all selected columns returned.

6. **M-1 — pre-fill NEW path only, guard for staff existence:** PASS. `openTimeEntryModal()` sets `te-staff` only if `myStaffId` is truthy AND `option[value="${CSS.escape(myStaffId)}"]` exists. `openEditTimeEntryModal()` uses `e.staff_id` from existing entry — no interaction with pre-fill logic.

7. **M-5 — cache busted on upload AND delete:** PASS. Upload: `_permitDocCache.delete(String(projectId))` before `loadPermitDocs(projectId)` in `uploadDoc()` success path. Delete: `_permitDocCache.delete(String(window.currentPermitProjectId))` in `deletePermitDoc()` success callback. `window.currentPermitProjectId` reliably set in `openPermitDocs()` before delete buttons are rendered.

8. **M-6 — zero native `confirm()`/`alert()` in three modules:** PASS. `grep -nE "\bconfirm\(|\balert\("` on `hours_tab.js`, `billing_tab.js`, `permits_tab.js` returns zero hits (excluding comment lines and `alertDialog`/`confirmDialog` calls).

9. **L-1 — gate uses reliable signal:** PASS. `tabView.classList.contains('active')` reads live DOM class state. `showView()` adds/removes `.active` class before load functions fire — signal is current at dispatch time. Not brittle.

---

## Regression safety — existing patterns

- `loadDashboard` + `loadRevenue` Phase-1 try/catch: untouched. Verified in `dashboard_views.js` try/catch structure.
- `billingHistoryTreeState` / `hoursTreeState` separation: untouched. `tree_state.js` still exports both; L-3 fix uses `billingHistoryTreeState.clear()` correctly.
- SSE debounce pattern: not touched by any fix commit.
- `projectsTreeState` sharing between Dashboard + Projects: confirmed unchanged.
- All 7 modified JS files + `auth.js` pass `node -c` syntax check.

---

## New findings

**NF-2 (LOW) — `_loadHoursGuard` finally block does not cancel pending timer.** When `persistFilter` synchronously fires 3 change events, the guard activates, `_loadHoursPending = true`, and a 50ms timer is queued. The in-flight fetch completes (guard cleared in `finally`), then ~50ms later the timer fires — `_loadHoursPending` is still `true` — and triggers one extra `loadHours()` call. Net result: 2 fetches on every init with 3 filter selects restored (instead of 1). Not a correctness issue; no loop risk (second call runs unguarded and clears nothing). Minor inefficiency. Fix: add `clearTimeout(_loadHoursPendingTimer); _loadHoursPending = false;` to the `finally` block. Low priority.

---

## Coverage gaps

- **Boot smoke not run** — no Postgres available in verification environment. Cannot confirm `node server.js` boots clean. The fix commits only touch frontend JS and `auth.js` (one-line SELECT change) — boot-crash risk is minimal.
- **Settings modules** (`jobs_settings.js`, `clients_settings.js`, `pricing_settings.js`) — out of Wave 2 FE-Crit scope per canonical. Deferred to follow-up sweep.
- **Full `public/admin.html` inline script** — A and B both noted partial coverage. Out of current scope.
- **SSE server-side emission verification** — out of FE scope per canonical.

---

=== WAVE 2 FE-CRIT POST-FIX VERIFICATION END ===
