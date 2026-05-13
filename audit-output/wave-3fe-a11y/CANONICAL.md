# Wave 3 FE-A11y Remainder — Canonical Fix List

> Built from Auditor A (broad, 17 findings, 8 HIGH) + Auditor B (UX-flow, 12 findings, 5 HIGH). STANDARD wave.

---

## Scope summary

Frontend accessibility remainder after temp-Claude's partial Wave 3 FE-A11y (commits `edde65a`, `c0e4c65`). The 34 static modals are correctly ARIA-attributed. Gaps cluster in dynamic modals, focus management, form labels, color contrast.

---

## HIGH (8 items — strong A+B convergence)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **H-1** | A + B (2/2) | `public/admin.html:7889` `openModal()` | **No focus move / Tab trap / focus return.** 25 admin modals open via this function. Keyboard users tab through page content behind the open modal; screen readers don't know the modal opened. | Wrap `openModal()` to: (a) save `document.activeElement`, (b) move focus to first focusable in modal, (c) install Tab handler that loops within modal, (d) on close return focus to saved element. Pattern matches `overlay_modal.js`. |
| **H-2** | A + B (2/2) | `public/permitting.html` + `public/design.html` `om()`/`cm()` lines ~670 | **Same gap as H-1 + no ESC handler at all.** | Use same shared focus-trap helper as H-1; add ESC handler. Refactor om/cm to call the shared helper. |
| **H-3** | A + B (2/2) | `public/permitting.html` + `public/design.html` + `public/timeclock.html` `showAccountMenu()` | **Dynamic account-modal zero ARIA.** Created via createElement, no role="dialog", no aria-modal, no aria-labelledby. Close button no aria-label. No focus management. Affects 3 portals. | Add the missing attributes on create. Apply the same focus-trap helper from H-1. Add aria-label to close button. |
| **H-4** | A (1/2 — covered by B-style focus-trap concerns) | `public/timeclock.html:1060, 1081` `openEntryModal()` | **Modal opens via `display:flex` toggle — no ARIA, no focus management.** | Convert to use `overlay_modal.js` OR replicate the same focus-trap pattern. |
| **H-5** | A + B (2/2) | `public/js/change_password_modal.js` | **Cross-portal a11y gaps.** No `role="dialog"`. 3 `<label>` elements without `for=`. `×` close button no `aria-label`. `#cpm-error` no `role="alert"` so validation errors silent to SR. | Add ARIA roles + aria-labels + for= on each label + role="alert" on the error element. |
| **H-6** | A + B (2/2 — note label count differs: A says 112+83, B says 153+85 — both agree thousands missing) | `public/admin.html` (112-153 admin) + `public/splice*.html` (83-85) | **Form labels missing `for=` linkage.** Sibling `<label>text</label><input>` patterns mean screen readers can't associate. | Generate IDs + add `for=`/`id=` pairs. Bulk fix via script; manually verify edge cases. Top priority: project modal (153 inputs), splice grids, hours form. |
| **H-7** | B (1/2) | `public/splice_*.html` fiber-cell `<div>` grid | **Splice/drop grid is mouse-only.** No `tabindex`, no `role`, no keyboard handlers. **Contractor surface — they can't perform primary splice task keyboard-only.** | Add `role="grid"` + per-cell `role="gridcell"` + `tabindex` + arrow-key navigation + Space/Enter trigger. Sizeable scope but contractor-blocking. |
| **H-8** | A + B (2/2) | CSS variables `--text-muted #6C757D` + `--primary #4A90D9` | **WCAG AA contrast fails.** `--text-muted` on `--surface-1 #F5F7FA` = 4.37:1. Dark `--primary` on `--surface-2 #242B36` = 4.26:1. Both used in body text + form labels across all portals. | Darken `--text-muted` to `#5A6470` (≈5.7:1) and lighten dark-mode `--primary` slightly OR darken `--surface-2`. Test both themes. |

## MEDIUM (8 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **M-1** | A + B (2/2) | `public/permitting.html` + `public/design.html` `sv()` | **Tab `aria-selected` not updated on switch.** Screen readers announce wrong selected state. | Update `aria-selected` in sv() the same way admin's `showView()` does. |
| **M-2** | A (1/2) | `public/admin.html` AI panel close (line 1419) + audit-drawer close + AI file-clear + undo-bar dismiss + mobile AI FAB | **5 icon-only buttons no aria-label.** | Add aria-label to each. |
| **M-3** | A + B (2/2 in spirit) | admin project-modal 153 unlabeled inputs + design/permitting proposal forms 14-17 inputs | **Smaller cluster of H-6.** Already covered by H-6 bulk fix; flagged separately because these are highest-traffic. | Part of H-6. |
| **M-4** | A (1/2) | Monthly Earnings Trend chart in admin | **No `role` + no sr-only data table.** Charts inaccessible to SR users. | Add sr-only `<table>` mirroring chart data + `role="img"` + descriptive `aria-label` on chart container. |
| **M-5** | B (1/2) | `public/js/toast.js` | **Uses `aria-live="polite"` for error toasts.** Should be `assertive` for errors. | Make role/aria-live conditional on toast variant: errors → `role="alert"` + `aria-live="assertive"`; info → polite. |
| **M-6** | B (1/2) | upload progress bars across portals | **No `role="progressbar"` ARIA.** | Add `role="progressbar"` + `aria-valuenow` + `aria-valuemax`. |
| **M-7** | B (1/2) | `public/splice_view.html` zoom buttons | **No `aria-label`** | Add aria-label="Zoom in" / "Zoom out". |
| **M-8** | B (1/2) | Settings modal tabs in permitting + design | **No `role="tab"` / `aria-selected`** | Add tablist semantics. Same pattern as admin nav. |

## LOW (2 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **L-1** | A | `public/splice.html` `showModal()` | Relies on `autofocus` attr without explicit `.focus()` post-render | Add explicit `.focus()` call. |
| **L-2** | A | timeclock clock-in form | Dynamically injected template — labels missing `for=` | Part of H-6 bulk fix. |

## Confirmed clean

- All 34 static modals have correct `role/aria-modal/aria-labelledby` (verified by both A and B)
- `overlay_modal.js`, `dialog.js` fully compliant
- Admin nav tablist fully compliant (`showView()` correctly toggles aria-selected — sv() is the bug, M-1)
- Login + launcher fully clean
- All FA icons `aria-hidden`
- Skip-nav in all portals
- Status badges include text (not color-only)
- Toast close button labeled

## Verification tier guide

**Full convergence (light verify):** H-1, H-2, H-3, H-5, H-6, H-8, M-1, M-3

**1-auditor (full verify):** H-4 (timeclock modal), H-7 (splice grid keyboard nav — biggest scope), M-2/4/5/6/7/8

## Acceptance criteria for fix-agents

1. All HIGHs addressed; M-1 + M-3 included with H-6 bulk fix. LOWs deferred OK.
2. `npm test` 155/155.
3. Playwright `tests/browser/*.spec.js` still passes — esp. modal-open flows.
4. Suggested split:
   - **Fix-agent A (focus management):** H-1 + H-2 + H-3 + H-4 + H-5 — one shared focus-trap helper + apply across modals
   - **Fix-agent B (labels bulk):** H-6 + M-3 — script-driven generation of for=/id= pairs across admin/splice/permitting/design
   - **Fix-agent C (contrast + remaining):** H-8 + M-1 + M-2 + M-4..M-8 + L-1 + L-2
   - **Fix-agent D (splice grid keyboard):** H-7 — biggest scope; standalone

5. Per-commit pull-rebase + push.

=== WAVE 3 FE-A11Y CANONICAL END ===
