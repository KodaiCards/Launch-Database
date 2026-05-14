# Phase 9C — FE-A11y Fix Report

**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`
**Scope:** 2 items deferred from Wave 3 FE-A11y (VETRO contrast + ddrop panel ARIA)
**Files changed:** `public/splice.html` only

---

## Item 1 — VETRO panel contrast

**File:** `public/splice.html`
**Commit:** `0d2b3aa` (pre-rebase) → landed as push to remote, SHA `0d2b3aa`

### Root cause

`--vetro-text-secondary` light mode was `#6B7280`. On the primary surface (`--vetro-bg-panel: #FFFFFF`) this gave 4.83:1 and narrowly passed. However, on `--vetro-bg-panel-secondary: #F0F2F5` it gave **4.31:1**, failing WCAG AA for normal text (threshold 4.5:1). The original adjacent observation in the POST_FIX_VERIFICATION cited `#6B7280 on #242B36 = 2.95:1` — that scenario (light-mode text on dark-mode panel) confirmed there was no cross-theme safety margin either.

### Fix

Changed `:root { --vetro-text-secondary }` from `#6B7280` to `#4B5563` (light mode only — dark mode `#B8BFC9` unchanged).

### Before/After contrast ratios

| Surface | Before | After | Requirement |
|---|---|---|---|
| `#FFFFFF` (bg-panel, light) | 4.83:1 PASS* | **7.56:1 PASS** | ≥4.5:1 |
| `#F0F2F5` (bg-panel-secondary, light) | 4.31:1 **FAIL** | **6.74:1 PASS** | ≥4.5:1 |
| `#FAFAFA` (bg, light) | 4.63:1 PASS | **7.24:1 PASS** | ≥4.5:1 |
| `#242B36` (bg-panel, dark) | 7.69:1 PASS (unchanged) | 7.69:1 PASS | ≥4.5:1 |
| `#1F2630` (bg-panel-secondary, dark) | 8.22:1 PASS (unchanged) | 8.22:1 PASS | ≥4.5:1 |

*narrowly passing but with no headroom on slightly-off-white surfaces

Dark mode variables untouched. Change is exactly 1 CSS variable in `:root`.

---

## Item 2 — ddrop fiber panel ARIA

**File:** `public/splice.html`
**Commit:** `5a8493d`

### Root cause

The two drag-drop fiber splicing panel wrapper divs (`ddrop-panel-location-<id>` and `ddrop-panel-closure-<id>`) had no ARIA landmark. Screen readers could not identify these panels as distinct named regions when navigating by landmarks.

### Fix

Added `role="region"` and `aria-label` to both wrapper divs inside their respective JS template literals:

**Location inspector panel** (line 3554):
```html
<div ... id="ddrop-panel-location-${locationId}"
  role="region"
  aria-label="Fiber splicing — ${esc(loc.name)}">
```

**Closure inspector panel** (line 3717):
```html
<div ... id="ddrop-panel-closure-${closureId}"
  role="region"
  aria-label="Fiber splicing — ${esc(cl.model || 'Closure')}">
```

### Rationale

- `role="region"` is correct (not `role="dialog"`) — panels are inline sections, not modal overlays.
- `aria-label` interpolates the entity name (location name or closure model) so screen readers announce "Fiber splicing — Handhole 3A" or "Fiber splicing — Corning UniCam 96F" distinctly per panel.
- `esc()` wraps both interpolations for XSS safety — consistent with all other entity-name interpolations in these same template literals.
- Interactive controls inside (cable `<select>` elements, range `<input>` elements, action buttons) are native keyboard-accessible elements — no roving tabindex or focus trap needed.

---

## Commit list

| Commit | Description |
|---|---|
| `0d2b3aa` | P9C A11y [1/2]: VETRO text-secondary contrast light mode |
| `5a8493d` | P9C A11y [2/2]: ddrop fiber panel role=region + aria-label |
| (this report) | P9C A11y fix report |

---

## Regression check

- Only `public/splice.html` modified.
- CSS variable change affects rendered text color in light mode. Dark mode is untouched.
- ARIA attributes are additive — no existing behavior removed. Script logic unmodified.
- No Playwright test IDs affected (no DOM IDs added/removed).

=== PHASE 9C A11Y FIX REPORT END ===
