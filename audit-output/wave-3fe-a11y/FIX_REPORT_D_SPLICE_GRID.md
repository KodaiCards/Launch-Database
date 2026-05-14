# Fix Report D — Splice Fiber Grid Keyboard Accessibility (H-7)

**Wave:** Wave 3 FE-A11y  
**Canonical item:** H-7  
**Agent:** Fix-Agent D  
**Commit:** `4b5e595`  
**File modified:** `public/splice.html`

---

## Canonical item addressed

| # | Canonical issue | Status |
|---|---|---|
| H-7 | Splice/drop grid is mouse-only. No `tabindex`, no `role`, no keyboard handlers. Contractor-blocking. | ADDRESSED |

---

## Implementation summary

### 1. ARIA grid semantics (`renderFibersOnly`)

**Container (`#sp-fibers-a` / `#sp-fibers-b`):**
- `role="grid"` set on every render when fibers are present; removed (along with aria-label/colcount/rowcount) when grid resets to empty-pane placeholder.
- `aria-label="Side A fiber selection"` / `"Side B fiber selection"`.
- `aria-colcount="6"` (matches `.fiber-grid` CSS `repeat(6,1fr)`).
- `aria-rowcount` computed as `Math.ceil(fibers.length / FIBER_GRID_COLS)`.

**Each fiber cell (`<div class="fiber-cell">`):**
- `role="gridcell"`.
- `aria-colindex` (1-based column position within current row).
- `aria-rowindex` (1-based row number).
- `aria-label="Fiber N color [in use]"` — descriptive, includes position, color, and in-use status.
- `data-fiber-idx` — flat index into rendered fiber array; used by keyboard handler for O(1) navigation.
- Roving tabindex: first cell (or last-focused cell, restored from `grid._spFocusedFiberId`) gets `tabindex="0"`; all others get `tabindex="-1"`.

**Constant:** `const FIBER_GRID_COLS = 6` declared above `renderFibersOnly` to match CSS and centralise the column count.

### 2. Keyboard navigation handler (`fiberGridKeydown`)

New function `window.fiberGridKeydown` wired via `onkeydown` on every cell.

| Key | Action |
|---|---|
| ArrowRight | Focus next cell (clamps at row end of grid) |
| ArrowLeft | Focus previous cell (clamps at grid start) |
| ArrowDown | Focus cell in next row (clamps at grid end) |
| ArrowUp | Focus cell in previous row (clamps at grid start) |
| Home | Focus first cell in current row |
| End | Focus last cell in current row |
| Ctrl+Home | Focus first cell in grid |
| Ctrl+End | Focus last cell in grid |
| Space / Enter | Activate cell — calls `pickFiber(event, el)` (respects Shift-modifier for additive selection) |
| Tab | Natural exit from grid; no `preventDefault` |

Roving tabindex update: on every move, previous cell gets `tabindex="-1"`, next cell gets `tabindex="0"` and `.focus()`. `grid._spFocusedFiberId` is updated so `renderFibersOnly` can restore focus after DOM rebuild.

### 3. `pickFiber` updates

- **In-use guard:** `if (inUse) return;` added at function entry. Prevents keyboard Space/Enter from selecting in-use fibers, matching existing mouse `cursor:not-allowed` + opacity visual guard.
- **Focus tracking:** sets `grid._spFocusedFiberId = fid` on activation so the roving tabindex survives the `renderFibersOnly` DOM rebuild triggered by every selection change.

### 4. Focus-visible CSS

Added after `.fiber-cell.in-use:hover`:

```css
.fiber-cell:focus { outline: none }
.fiber-cell:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: 3px; z-index: 1; position: relative }
```

- `:focus` suppresses browser default outline (which would double-ring with the border-based selected state).
- `:focus-visible` shows a clean 2px primary-color ring on keyboard navigation only (mouse clicks do not trigger `:focus-visible` in modern browsers).
- `z-index:1; position:relative` ensures the outline is not clipped by adjacent cells.

---

## Scope boundary verification

- `splice_view.html`: grep confirmed zero `fiber-cell`, `fiber-grid`, `renderFibersOnly`, `pickFiber` references — no changes needed.
- `admin.html`, `permitting.html`, `design.html`, `timeclock.html`: not touched (out of scope).
- Labels in `splice.html` (H-6 scope): not touched.

---

## Keyboard walkthrough (mental trace)

1. User Tabs into dialog → focus lands on Side A cable `<select>`.
2. User selects cable, selects tube → `renderFibersOnly('a')` fires, grid renders with first cell `tabindex="0"`.
3. User Tabs → focus enters `#sp-fibers-a`; first fiber cell is focused, `:focus-visible` ring appears.
4. User presses ArrowRight → next cell gets focus; `:focus-visible` ring moves.
5. User presses Space → `pickFiber(event, el)` called → fiber selected → `renderFibersOnly` rebuilds DOM → `grid._spFocusedFiberId` restores `tabindex="0"` to the selected cell.
6. User Tabs → focus leaves grid naturally to Side B cable `<select>`.

---

## Boot + test results

- Boot smoke: `node server.js` started without crash (DB ECONNREFUSED expected — no local Postgres).
- Backend tests: 40/60 pass; 20 failures all `DATABASE_URL not set` — pre-existing baseline unaffected by this change.
- No Playwright tests for splice grid exist; existing `psc_rus_tab.spec.js` and `projects_tree_state.spec.js` are unaffected (no splice DOM IDs referenced).

---

## Adjacent observations (not committed)

- The `ddrop` fiber panel (drag-drop splice, `ddropFiberClick`, ~lines 6230–6260) also renders `.fiber-cell` divs with no ARIA semantics. That surface is more complex (drag-drop + A-side click selection + B-side drop targets). A future H-7b could address it using a similar roving-tabindex pattern, with additional `draggable` + keyboard drag simulation for the A→B fiber assignment.

=== FE-A11Y FIX-D SPLICE GRID REPORT END ===
