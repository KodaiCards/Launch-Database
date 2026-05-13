# Wave 3 FE-A11y Fix-Agent A — Focus Management Report

> Scope: H-1 + H-2 + H-3 + H-4 + H-5 (focus management across admin, permitting, design, timeclock portals + change_password_modal).
> Branch: `claude/debug-previous-issues-MoN9D`

---

## Summary

All 5 HIGH items addressed across 6 commits. Shared `focus_trap.js` helper is the foundation; each modal-open function now saves prevFocus, traps Tab cycles, handles ESC, and restores focus on close.

---

## Items addressed

| # | Status | Notes |
|---|---|---|
| H-1 | ADDRESSED | admin.html `openModal`/`closeModal` now use `_modalTraps` registry + `trapFocus()`. ESC handler delegated to trap (old global keydown removed). Click-outside calls `closeModal(id)` for proper focus restore. |
| H-2 | ADDRESSED | permitting.html + design.html `om()`/`cm()` expanded into registry-backed wrappers calling `trapFocus()` with ESC. |
| H-3 | ADDRESSED | permitting.html + design.html + timeclock.html `showAccountMenu()`: added `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on overlay; `aria-label="Close dialog"` on close button; `aria-hidden` on decorative icons; `_closeAccountMenu()` helper ensures `trap.release()` runs on every dismiss path. |
| H-4 | ADDRESSED (focus-trap only — ARIA already present) | timeclock.html `openManualEntryModal()`/`openEditEntryModal()` refactored via `_openEntryModalCommon()` which calls `trapFocus()`. `closeEntryModal()` calls `_entryModalTrap.release()`. Static HTML `role="dialog"` + `aria-modal` + `aria-labelledby` confirmed already correct per VERIFICATION.md. |
| H-5 | ADDRESSED (all 4 sub-issues) | `change_password_modal.js`: added `role="dialog"` + `aria-modal` + `aria-labelledby="cpm-title"` to overlay; `for=` attributes on all 3 labels (cpm-current, cpm-new, cpm-confirm); `aria-label="Close dialog"` on × button; `role="alert"` on `#cpm-error`; focus trap replaces `setTimeout` fallback. |

---

## Commits

| SHA | Description |
|---|---|
| `06f545e` | Commit 1: `public/js/focus_trap.js` — shared helper |
| `af6f1e5` | Commit 2: admin.html `openModal`/`closeModal` + `focus_trap.js` script tag |
| `55dc8aa` | Commit 3: permitting.html + design.html `om`/`cm` + `showAccountMenu` |
| `cc86b83` | Commit 4: timeclock.html `showAccountMenu` + `openEntryModal` focus trap |
| `f365960` | Commit 5: `change_password_modal.js` full H-5 fix |
| (this file) | Commit 6: FIX_REPORT_A_FOCUS_MGMT.md |

---

## Implementation notes

### focus_trap.js design

Exposes `window.trapFocus(modalEl, opts) → { release() }`. Opts: `escClose` (default true), `onEsc` callback, `initialFocus` override. Uses `FOCUSABLE` selector list matching `overlay_modal.js`. Idempotent guard (`if (window.trapFocus) return`).

### Why not extend overlay_modal.js

`overlay_modal.js` handles dynamically-created, DOM-injected modals that are built fresh on each open. The target modals here use a different pattern: static HTML toggled by `classList.add('open')` or `style.display = 'flex'`. Separate helper keeps the concerns cleanly split.

### ESC handler consolidation (admin.html)

The original admin.html had a global `keydown` ESC listener that called `classList.remove('open')` without focus restore. This was replaced by per-modal ESC in `trapFocus`. The global click-outside listener was updated to call `closeModal(id)` (focus-aware) instead of `classList.remove`. No duplicate handlers.

### Focus restore path

All dismiss paths (ESC, click-outside, inline `onclick="closeModal(id)"` buttons) now call the same close function which calls `trap.release()`. This guarantees `prevFocus.focus()` is called exactly once per open/close cycle.

---

## Verification

- **Boot smoke:** `node server.js` starts cleanly (DB connection failures are expected in this env — no boot crash).
- **npm test:** 40/60 tests pass. 20 failures are pre-existing DB-dependent tests requiring a live Postgres connection — identical to baseline, no regressions introduced.
- **Playwright:** No `tests/browser/*.spec.js` files reference any changed IDs (`openModal`, `cpm-modal`, `entry-modal`, `account-modal`, `showAccountMenu`). Zero Playwright impact.
- **Scope adherence:** No H-6, H-7, H-8, or MED items touched. `public/splice*.html` and splice JS not modified.

---

## Confirmed clean (out of scope, no regression)

- All 34 static modals with existing `role/aria-modal/aria-labelledby` — not touched.
- `overlay_modal.js` and `dialog.js` focus-trap implementations — not modified.
- Admin ESC global listener removal: tested that the `trapFocus` ESC handler fires per-modal and handles the "topmost" semantics (only the active trap responds since only one set of handlers is live at a time under normal usage).

=== FE-A11Y FIX-A FOCUS MGMT REPORT END ===
