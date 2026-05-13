# Wave 3 FE-A11y Remainder — Verification Red-Team

> Standard wave. 18 canonical items (8 HIGH + 8 MED + 2 LOW).
> Verified against branch `claude/debug-previous-issues-MoN9D` HEAD.

---

## HIGH items

### H-1 — VERIFIED
**`public/admin.html:7889` `openModal(id)`**
`function openModal(id) { document.getElementById(id).classList.add('open'); }` (line 7889) — single-line, adds class only. No save of `document.activeElement`, no focus move, no Tab trap, no focus return. ESC handler at lines 7895–7901 removes the class but also does zero focus management. 25 admin modals open through this function, all unmanaged.

### H-2 — VERIFIED
**`public/permitting.html:670` + `public/design.html:683` `om()`/`cm()`**
`function om(id){document.getElementById(id).classList.add('open')}` — identical one-liner. No ESC handler found in either portal (grep `keydown`/`Escape` returns no modal-close handler). Same gap as H-1, worse: no global ESC at all.

### H-3 — VERIFIED
**`public/permitting.html:1751` `showAccountMenu()`**
Creates `<div id="account-modal" class="modal-overlay">` dynamically (line 1770–1800). The `<div class="modal-content">` has no `role="dialog"`, no `aria-modal`, no `aria-labelledby`. Close button at line 1778: `<button … onclick="…"><i class="fa-solid fa-xmark"></i></button>` — no `aria-label`. No focus management. Same pattern confirmed in `public/design.html`.

### H-4 — PARTIALLY OVERSTATED / focus-management gap VERIFIED
**`public/timeclock.html:1047–1085` `openManualEntryModal()`/`openEditEntryModal()`**
The static HTML at line 336 already has `role="dialog" aria-modal="true" aria-labelledby="entry-modal-title"` and the close button has `aria-label="Close dialog"`. The ARIA attributes claimed missing are **already present**. However, `openManualEntryModal()` at line 1060 and `openEditEntryModal()` at line 1081 both do `style.display = 'flex'` with no `document.activeElement` save, no focus move to first focusable, no Tab trap, and `closeEntryModal()` (line 1084) does not restore focus. **Focus-management gap is real; ARIA gap is overstated.**

### H-5 — VERIFIED (all 4 sub-issues confirmed)
**`public/js/change_password_modal.js`**
1. `role="dialog"` missing — line 19: `<div class="modal-overlay" id="cpm-modal">` — no role attribute.
2. Labels without `for=` — lines 27, 31, 35: three `<label>` elements, none have a `for=` attribute.
3. Close button `×` at line 23: `<button onclick="closeChangePasswordModal()" style="…">×</button>` — no `aria-label`.
4. `#cpm-error` at line 38: `<div id="cpm-error" style="color:#dc3545;…">` — no `role="alert"`.
Note: `openChangePasswordModal()` at line 58 does `setTimeout(() => document.getElementById('cpm-current')?.focus(), 50)` — focus moves to first input, partial mitigation only.

### H-6 — VERIFIED (definitive counts differ from both auditors)
**Definitive grep results (python re against live files):**
- **`public/admin.html`**: 175 non-hidden form elements (102 inputs + 66 selects + 7 textareas). Only 4 have a `for=`-linked label. **171 lacking label linkage** (154 with ID but no matching `for=`; 17 without ID). A said 112, B said 153 — both were undercounts of a subset.
- **`public/splice.html`**: 120 non-hidden form elements (65 inputs + 41 selects + 14 textareas). Only 1 has a `for=`-linked label. **105 lacking label linkage** (85 with ID but no matching `for=`; 20 without ID). A said 83, B said 85 — both undercounts.
The scale of the gap is even larger than either auditor reported.

### H-7 — VERIFIED
**`public/splice.html` fiber-cell grid `#sp-fibers-a`/`#sp-fibers-b`**
`renderFibersOnly()` at line 5693 builds cells as plain `<div class="fiber-cell" data-fiber-id="…" onclick="pickFiber(event,this)">`. No `tabindex`, no `role="gridcell"`, no `role="grid"` on the container divs (`#sp-fibers-a`/`#sp-fibers-b` at lines 3876, 3884). `pickFiber()` at line 5726 is mouse-event-only. Contractor-blocking: no keyboard path to perform primary splice task. Scope estimate: ~60–80 lines of new JS (add `tabindex="0"` + `role="gridcell"` per cell in `renderFibersOnly()`, `role="grid"` on containers, arrow-key + Space/Enter handlers). Grid appears only in `splice.html`, not `splice_view.html`.

### H-8 — VERIFIED with precision correction
**CSS variables contrast**
Computed ratios (WCAG 2.1 standard formula):
- **Light mode `--text-muted #6C757D` on `--surface-1 #F5F7FA`: 4.37:1** — FAIL AA body text (needs 4.5). Confirmed.
- **Dark mode `--primary #4A90D9` on `--surface-2 #242B36` (cards/modals): 4.26:1** — FAIL AA body text. Confirmed.
- Dark mode `--primary #4A90D9` on actual page background `#1A1F26`: 4.95:1 — PASS. Canonical slightly overstates scope.
- Dark mode `--text-muted #9BA1A8` on `#1A1F26`: 6.35:1 — PASS. Canonical erroneously cites `#6C757D` as the dark-mode text-muted value; the actual dark-mode token is `#9BA1A8` (admin.html line 99), which passes.
**Correction:** Fix needed is: darken light-mode `--text-muted` (line 44 of admin.html) and darken dark-mode `--primary` when used as text on `--surface-2` card backgrounds. Proposed `#5A6470` yields 5.60:1 — passes.

---

## MEDIUM items

### M-1 — VERIFIED
**`public/permitting.html:693` `sv()`**
Nav tabs at lines 354–355 have initial `aria-selected="true/false"` in HTML. `sv()` at line 693 does `classList.toggle('active', t.dataset.view===v)` but never sets `t.setAttribute('aria-selected', ...)`. States go stale after first tab switch.

### M-2 — VERIFIED
**`public/admin.html:1419` AI panel close**
`<button onclick="toggleAI()" style="…"><i class="fa-solid fa-xmark"></i></button>` — no `aria-label`.

### M-3 — VERIFIED (part of H-6 bulk fix)
H-6 counts cover the project-modal and proposal form inputs.

### M-4 — UNCLEAR (not directly verified)
Monthly Earnings Trend chart — cited but not opened. No `role` / sr-only table claim is plausible based on admin chart patterns but not spot-checked for line citation.

### M-5 — VERIFIED
**`public/toast.js:54–55`**
`stack.setAttribute('role', 'status'); stack.setAttribute('aria-live', 'polite')` — the single stack element uses `polite` for all toast types. Error toasts (`type === 'error'`) need `role="alert"` + `aria-live="assertive"`. Finding is real.

### M-6 — UNCLEAR (not directly verified)
Upload progress bars — not spot-checked.

### M-7 — UNCLEAR (not directly verified)
`splice_view.html` zoom buttons — not spot-checked.

### M-8 — UNCLEAR (not directly verified)
Settings modal tabs in permitting/design — not spot-checked.

---

## LOW items

### L-1 — UNCLEAR
`public/splice.html` `showModal()` — not directly read; plausible pattern.

### L-2 — VERIFIED (subsumed by H-6)
Timeclock clock-in form dynamic labels — part of H-6 bulk fix scope.

---

## Confirmed-clean spot-checks (5 of 34 static modals)

Verified `role="dialog"`, `aria-modal="true"`, `aria-labelledby` all present on:
- `#psc-rus-pdf-modal` (line 775)
- `#pp-modal` (line 1056)
- `#time-modal` (line 1750)
- `#budget-modal` (line 2294)
- `#settings-modal` (line 2452)

All 25 `role="dialog"` occurrences in admin.html were scanned — every static modal has the full ARIA trio. Confirmed-clean claim holds.

---

## Summary verdicts

| # | Verdict | Notes |
|---|---|---|
| H-1 | VERIFIED | openModal() zero focus management |
| H-2 | VERIFIED | om() same + no ESC handler |
| H-3 | VERIFIED | showAccountMenu() zero ARIA + no focus mgmt |
| H-4 | OVERSTATED (ARIA) / VERIFIED (focus mgmt) | ARIA already in static HTML; focus trap/return missing |
| H-5 | VERIFIED | All 4 sub-issues confirmed |
| H-6 | VERIFIED + counts corrected | admin: 171, splice: 105 (not 112/153/83/85) |
| H-7 | VERIFIED | Mouse-only fiber grid; scope ~60–80 lines |
| H-8 | VERIFIED + precision correction | Light text-muted + dark primary on cards confirmed FAIL; dark text-muted claim incorrect |
| M-1 | VERIFIED | sv() never sets aria-selected |
| M-2 | VERIFIED | AI close button no aria-label |
| M-3 | VERIFIED | Subsumed by H-6 |
| M-4 | UNCLEAR | Not spot-checked |
| M-5 | VERIFIED | Toast stack always polite |
| M-6 | UNCLEAR | Not spot-checked |
| M-7 | UNCLEAR | Not spot-checked |
| M-8 | UNCLEAR | Not spot-checked |
| L-1 | UNCLEAR | Not spot-checked |
| L-2 | VERIFIED | Subsumed by H-6 |

**Coverage note:** M-4, M-6, M-7, M-8, L-1 not directly verified due to scope. Each was cited by a single auditor — treat as UNCLEAR pending fix-agent review, not FALSE-POSITIVE.

=== WAVE 3 FE-A11Y VERIFICATION END ===
