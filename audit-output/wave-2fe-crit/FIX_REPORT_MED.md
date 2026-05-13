# Wave 2 FE-Crit — MEDIUM + LOW Fix Report

Fix agent run against `audit-output/wave-2fe-crit/CANONICAL.md`.
Branch: `claude/debug-previous-issues-MoN9D`.

---

## Per-item status

| # | Item | Status | SHA | Notes |
|---|---|---|---|---|
| M-1 | `openTimeEntryModal()` pre-fill `te-staff` to `currentUser.staff_id` | ADDRESSED | `13d3fa1` | New-entry path only. Guards: checks `staff_id` present AND option exists in dropdown via `CSS.escape`. Edit path (`openEditTimeEntryModal`) unaffected — sets from existing entry. Backend half (NF-1) already at `828117f`. |
| M-2 | `openPermitDocs()` pre-fill `#doc-uploader` with `currentUser.full_name \|\| username` | ADDRESSED | `4d6324f` | Set on modal open before `loadPermitDocs()`. Falls back to empty string when `currentUser` absent. |
| M-3 | `openDesignDocs()` pre-fill `#design-doc-uploader` | ADDRESSED | `4d6324f` | Same pattern as M-2. |
| M-4 | Client-filter restore race — `proj-client-filter` transient unfiltered render | DEFERRED | — | Downgraded MEDIUM→LOW by verification `a413ec0` (OVERSTATED — `Promise.all` completes before `showView()`). Optional per canonical; deferred to follow-up wave. |
| M-5 | `loadPermitDocs()` over-fetches entire `/api/permits` per modal open | ADDRESSED | `784de45` | Module-level `_permitDocCache` Map (keyed by projectId). First open fetches, caches. Subsequent opens for same project skip API call. Cache busted on `uploadDoc()` success and `deletePermitDoc()` success. No backend change needed. |
| M-6 | Native `confirm()` / `alert()` survivors in `hours_tab.js`, `billing_tab.js`, `permits_tab.js` | ADDRESSED | `7f60d40` | All 16 sites replaced. Destructive deletes use `danger: true` + explicit `confirmLabel`. See commit message for full site list. Zero `confirm()`/`alert()` remain in the three modules (verified by grep). |
| L-1 | `persistFilter()` fires `change` on inactive-tab elements at init | ADDRESSED | `b6863c2` | Guard: `el.closest('.view').classList.contains('active')` before dispatching. Inactive tabs skip the dispatch; `showView()` calls the load function directly on navigation. Fallback to dispatch when no `.view` ancestor found. |
| L-2 | `hrs-period` restore double-fires `loadHours()` | ALREADY DONE | — | Folded into H-7 fix (SHA `d6d0e12`) during HIGH wave per canonical note. |
| L-3 | Deleting last invoice in client group leaves dangling `billingHistoryTreeState` key | ADDRESSED | `61fa9a9` | `billingHistoryTreeState.clear()` called before `loadBilling()` on successful invoice delete. Tree re-renders from fresh API data; dangling chevron-expanded orphan eliminated. |

---

## Regression checks

- `openEditTimeEntryModal` sets `te-staff` from existing entry — verified M-1 doesn't touch the EDIT path.
- `loadPermitDocs` post-upload still calls fresh fetch (cache busted before call) — verified in M-5.
- `deleteInvoice` `billingHistoryTreeState.clear()` only fires on confirmed success — catch path unchanged.
- `persistFilter` fallback `tabIsActive = true` for elements outside `.view` — no existing wiring is broken.
- All 5 syntax-checked files pass `node -c`.

---

## Deferred / out of scope

- **M-4**: downgraded to LOW + optional per verification. Deferred to follow-up wave.
- **Settings-module audits** (`jobs_settings.js`, `clients_settings.js`, `pricing_settings.js`): out of Wave 2 FE-Crit scope per CANONICAL.md.

=== WAVE 2 FE-CRIT MED FIX REPORT END ===
