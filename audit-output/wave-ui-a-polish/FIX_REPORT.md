# Wave UI-A Polish — Fix Report

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14

---

## Item 1 — Training tile back-link

**Status: ALREADY DONE (no change needed)**

`public/training/index.html` already has a fixed header injected around the React SPA's `<div id="root">` with a styled "← Back to Launcher" `<a href="/">` link. The header is position:fixed at top, z-index:9999, dark `#0B1A2E` background with a semi-transparent back-link button. The SPA body has `padding-top:48px` to clear it. Nothing to add.

Verified by reading: `public/training/index.html:10-55`

---

## Item 2 — Dark-mode logo inversion

**Status: ALREADY DONE (no change needed)**

All portals that display the `launch-fiber-logo-transparent.png` image already have dark-mode inversion CSS:

| Portal | CSS rule |
|---|---|
| `login.html` | `html[data-theme="dark"] .logo img{filter:brightness(0) invert(1) opacity(0.92)}` |
| `admin.html` | `html[data-theme="dark"] .header-logo{filter:brightness(0) invert(1) opacity(0.92)}` |
| `permitting.html` | `html[data-theme="dark"] .header-logo{filter:brightness(0) invert(1) opacity(0.92)}` |
| `design.html` | `html[data-theme="dark"] .header-logo{filter:brightness(0) invert(1) opacity(0.92)}` |
| `timeclock.html` | `html[data-theme="dark"] .header-logo{filter:brightness(0) invert(1) opacity(0.92)}` |
| `launcher.html` | `filter:brightness(0) invert(1) opacity(0.95)` always applied (topbar is always dark) |

`splice.html` and `customer.html` use text/icon logos (no image), so no inversion needed.

---

## Item 3 — Single-square tile layout

**Status: IMPLEMENTED**

**Before:** The launcher used `grid-template: <row fr> / <col fr>` filling a fixed-height box (`height: min(480px, ...)`). Because the box was wider (max 720px) than it was tall (max 480px), tiles were rectangular in most layouts — e.g. a 2×2 grid produced ~355px wide × ~235px tall tiles.

**Changes made to `public/launcher.html`:**

1. **`.launcher-box`** — removed fixed `height: min(480px, ...)`, replaced with `height: auto` + `max-height: calc(100vh - topbar - footer - 40px)`. Height is now driven by tile content rather than a viewport fraction.

2. **`.launcher-grid`** — removed `height: 100%`, changed to `height: auto`. Grid rows are now `auto` (not `fr`), so each tile's `aspect-ratio:1/1` determines row height.

3. **Count-driven layouts** — changed from `grid-template: <rows> / <cols>` (fr rows) to `grid-template-columns` only (fr cols, auto rows):
   - count=1: `1fr` (1 column)
   - count=2: `1fr 1fr` (2 columns, 1 row of squares)
   - count=3: `1fr 1fr 1fr` (3 columns, 1 row)
   - count=4: `1fr 1fr` (2 columns, 2 rows)
   - count=5–6: `repeat(3, 1fr)` (3 columns, 2 rows)
   - count=7–9: `repeat(3, 1fr)` (3 columns, 3 rows)

4. **`.tile`** — added `aspect-ratio: 1/1` and `width: 100%`. The column width drives tile width; aspect-ratio makes height match. Result: every tile is a perfect square regardless of count.

5. **Hero tile (count=1)** — added `max-width:320px; margin:0 auto` on the grid so the single square tile doesn't stretch the full 720px. Keeps it at a sensible hero size.

6. **`#tile-area`** — changed `overflow: hidden` to `overflow: auto` so the tile grid can scroll vertically if it exceeds the available area on smaller screens (rare, but correct behavior).

7. **Mobile breakpoint (`max-width: 600px`)** — replaced single-column layout with 2-column layout so mobile tiles are also square and fit comfortably on a phone screen. Single-tile (count=1) still goes full-width. Removed `grid-auto-rows` and `min-height` rules that fought the aspect-ratio.

**After:** With 6 portals (typical), the 3×2 grid renders each tile as `(720-20)/3 = ~233px` squares on desktop. On a 375px phone the 2-col layout gives `(375-24-10)/2 = ~170px` squares. All tiles are uniform size and shape.

---

## Scope confirmed clean

- No changes to `public/training/` (built React dist)
- No backend code touched
- No other portal HTMLs modified
- Only `public/launcher.html` changed (Item 3)

=== UI-A POLISH FIX REPORT END ===
