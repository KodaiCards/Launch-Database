# Wave 3 FE-A11y — Discovery Report

## Stack Snapshot

Six portal HTML files examined: `admin.html`, `permitting.html`, `design.html`, `timeclock.html`, `splice.html`, `launcher.html`. Login, customer, and splice_view covered incidentally. Prior temp-Claude work (`edde65a` / `c0e4c65`) shipped modal `role="dialog"` + `aria-modal` + `aria-labelledby` on all static modals and the `overlay_modal.js` shared utility (with full focus-trap + focus-return). Form `label for=` linkage and focus-trap on static HTML modals were NOT addressed and represent the dominant remaining work.

---

## Per-Portal Counts

| Portal | Static modals | Modals w/ role=dialog | Modals missing role=dialog | Dynamic modals missing ARIA | Inputs (w/ id) | Labeled (for= or aria-label) | UNLABELED | Close btns w/o aria-label |
|---|---|---|---|---|---|---|---|---|
| **admin.html** | 25 | 25 | 0 | 0 | 158 | 5 | **153** | 4 (non-modal: undo-bar, AI-panel, AI-file-clear, audit-drawer) |
| **permitting.html** | 2 | 2 | 0 | 1 (account-modal) | 30 | 13 | **17** | 1 (account-modal X btn) |
| **design.html** | 3 | 3 | 0 | 1 (account-modal) | 34 | 13 | **21** | 1 (account-modal X btn) |
| **timeclock.html** | 2 | 2 | 0 | 0 | 16 | 11 | **5** (sibling labels, no for=) | 0 |
| **splice.html** | 2 | 2 | 0 | 0 | 86 | 1 | **85** | 0 |
| **launcher.html** | 0 | — | — | 0 | 0 | — | — | 0 |
| **login.html** | 0 | — | — | 0 | 2 | 2 | 0 | 0 |

**Totals: 326 inputs with IDs, ~281 unlabeled. All 34 static modals have correct ARIA attributes.**

---

## Focus Trap Status

| Portal | Static modal focus trap | Focus return on close | ESC key dismiss |
|---|---|---|---|
| admin.html | **NO** (openModal just adds `.open` class) | **NO** | YES (line 7895) |
| permitting.html | **NO** (`om()` just adds `.open`) | **NO** | **NO** |
| design.html | **NO** (`om()` just adds `.open`) | **NO** | **NO** |
| timeclock.html | **NO** | **NO** | Not found |
| overlay_modal.js (shared) | YES — full trap + return | YES | YES |
| dialog.js (confirmDialog/alertDialog) | Partial (initial focus, no Tab trap) | YES | YES |

`overlay_modal.js` is fully compliant. All static `.modal-overlay` HTML modals (25 in admin, 2 each in permitting/design, 2 in timeclock) lack Tab focus trapping and focus-return on close.

---

## Dynamic Modals Missing ARIA

**permitting.html line 1770–1803 & design.html line 1754–1788:** The `showAccountModal()` function creates a `div.modal-overlay` via `createElement` but sets NO `role="dialog"`, `aria-modal`, `aria-labelledby`, no focus trap, no ESC key handler, no focus return. Close button (line 1778 / 1762) has no `aria-label`.

---

## Color Contrast Issues

| Pair | Ratio | WCAG AA (4.5:1) | Used in |
|---|---|---|---|
| `--text-muted #6C757D` on `--surface-1 #F5F7FA` | **4.37:1** | **FAIL** | Filter labels, helper text on card backgrounds |
| `--text-muted #6C757D` on `--surface-2 #FFFFFF` | 4.69:1 | Marginal pass | Form helper text |
| `--primary #1B5FA0` on `--surface-2 #FFFFFF` | 6.58:1 | Pass (warn: <7:1 AA-Large) | Button text |
| `--warning #FFC107` on white | **1.63:1** | **FAIL** | Warning icons (decorative only, but icon-as-status) |
| dark mode `--primary #4A90D9` on `--surface-2 #242B36` | **4.26:1** | **FAIL** | Active element indicators, link text in dark mode |

Primary risk: `--text-muted` on `--surface-1` fails 4.5:1. This hits filter labels, table secondary text, and card metadata — used heavily in every portal. Dark mode primary link text on surface-2 also fails.

---

## Top 10 Highest-Impact Fixes

| # | Priority | File(s) | Issue | Scope |
|---|---|---|---|---|
| 1 | **CRITICAL** | admin/permitting/design/timeclock | Focus trap missing on all 31 static HTML modals | Add `keydown` Tab trap + focus-return to `openModal`/`om` functions globally |
| 2 | **HIGH** | admin.html | 153 inputs with sibling `<label>` (no `for=`) — screenreaders cannot associate labels to controls | Add `for=` to each `<label>`, add `id=` where missing |
| 3 | **HIGH** | splice.html | 85 inputs with sibling `<label>` and no `for=` association | Same as above; splice is primary contractor interface |
| 4 | **HIGH** | permitting/design | `showAccountModal()` dynamic modal missing `role="dialog"`, `aria-modal`, `aria-labelledby`, close-button `aria-label`, ESC handler, focus trap + return | 2 files, same code pattern — single fix propagated |
| 5 | **HIGH** | permitting/design | Static modals (`om`/`cm`) have NO ESC key dismiss | Add global `keydown` Escape handler (pattern exists in admin.html at line 7895) |
| 6 | **MEDIUM** | admin.html | Non-modal icon buttons missing `aria-label`: undo-bar dismiss (line 603), AI panel close (line 1419), AI file clear (line 1445), audit drawer close (line 1168) | 4 buttons, add `aria-label` |
| 7 | **MEDIUM** | design/permitting | 17–21 unlabeled inputs in project-modal and settings-modal | Add `for=` to sibling labels |
| 8 | **MEDIUM** | All portals (light theme) | `--text-muted` on `--surface-1` fails 4.5:1 (4.37:1) | Darken `--text-muted` from `#6C757D` to `#5A6370` (~4.9:1) |
| 9 | **MEDIUM** | All portals (dark theme) | `--primary #4A90D9` on `--surface-2 #242B36` fails 4.5:1 (4.26:1) | Lighten dark-mode `--primary` to `#5A9FE0` (~4.7:1) |
| 10 | **LOW** | admin/permitting/design | nav tabs: `aria-selected` updated by `showView()` (admin) but no `aria-selected` update in permitting/design — they use the same `om`/`cm` pattern but lack the tab-switch listener | Verify `showView()` equivalent updates `aria-selected` in permitting/design portals |

---

## What Was Confirmed Clean (Negative Findings)

- All 34 static `modal-overlay` divs have `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at a valid title `id`. Temp-Claude wave landed this correctly.
- All 34 static modal close buttons have `aria-label="Close dialog"` with `<i aria-hidden="true">`.
- `overlay_modal.js`: full Tab focus trap, focus-return to prior element, ESC dismiss, MutationObserver cleanup. Fully compliant.
- `dialog.js` (`confirmDialog` / `alertDialog`): role, modal, labelledby, ESC, click-outside, initial focus. Compliant.
- `admin.html` nav tablist: `role="tablist"`, each tab has `role="tab"` + `aria-selected` + `aria-controls`, panels have `role="tabpanel"` + `aria-labelledby`. `showView()` correctly toggles `aria-selected`. 
- Skip-nav present in admin, permitting, design, timeclock, launcher. Visually hidden until focused.
- All portal `<img>` tags have `alt` text. FA icons use `aria-hidden="true"` consistently.
- `login.html`: both inputs have `<label for=>`. Error region has `role="alert"` + `aria-live="assertive"`.
- Undo bar has `role="status"` + `aria-live="polite"` in admin and timeclock.
- No `outline:none` / `outline:0` CSS found in any portal file. Browser-default focus rings preserved for buttons; inputs have explicit `outline:2px solid var(--primary)` on focus.
- `launcher.html`: minimal HTML, fully labeled buttons, proper `<main>` landmark.

---

## Coverage Gaps

Did not read JS modules under `public/js/` beyond `overlay_modal.js` and `dialog.js` (scoped to focus-trap relevance). Did not audit `splice_view.html` (public contractor view — separate scope warranted). Did not audit CSS files in `public/css/` beyond variables embedded in HTML `<style>` blocks. Dynamic content rendered by JS (project tree rows, billing rows, timeclock time-entry rows) not audited for ARIA — these are lower-risk as they are data-display not form controls. `customer.html` checked only for modals (1, fully compliant); not full-audited.

---

=== WAVE 3 FE-A11Y DISCOVERY END ===
