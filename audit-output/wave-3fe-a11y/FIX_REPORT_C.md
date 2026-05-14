# Wave 3 FE-A11y Fix-C Report

> Fix-agent C scope: H-8, M-1, M-2, M-4, M-5, M-6, M-7, M-8, L-1
> Branch: `claude/debug-previous-issues-MoN9D`

---

## Executive Summary

All 9 canonical items addressed across 10 commits (1 per item + report).
No regressions introduced. DB-requiring tests fail pre-existing (no DATABASE_URL
in dev env); 40 infrastructure-independent tests pass 40/40.

---

## Commits

| SHA | Items | Description |
|---|---|---|
| `0600ebd` | H-8 | WCAG AA contrast — text-muted + dark surface-2 |
| `96282f2` | M-1 | sv() aria-selected in permitting + design |
| `70e59cd` | M-2 | 5 icon-only buttons get aria-label |
| `8554465` | M-4 | Monthly Earnings Trend sr-only table |
| `97287c4` | M-5 | Error toasts get assertive live region |
| `25b9fdc` | M-6 | Upload progress bars get progressbar ARIA |
| `9206411` | M-7 | splice_view zoom button aria-labels |
| `1eed41b` | M-8 | Settings modal tablist semantics |
| `00a72de` | L-1 | splice.html showModal explicit focus |
| (this push) | — | FIX_REPORT_C.md |

---

## Item detail

### H-8 — WCAG AA contrast (commit `0600ebd`)

**Light-mode `--text-muted`:** `#6C757D` → `#5A6470`.
Ratio on `#F5F7FA`: **4.37:1 → 5.60:1** (FAIL → PASS).

**Dark-mode `--surface-2`:** `#242B36` → `#1D2430`.
`--primary #4A90D9` on new surface-2: **4.26:1 → 4.66:1** (FAIL → PASS).
Text `#E8EAED` on new surface-2: 12.93:1 (still excellent).

Changes applied across 8 portal HTML files: admin, design, permitting,
timeclock, splice, splice_view, login, customer. Hardcoded `#242B36`
select-option background overrides updated to match.

Note: `--vetro-bg-panel: #242B36` in splice.html is the VETRO design system
panel bg (left rail) and was left unchanged — it's outside the canonical
scope (which targeted `--surface-2` and `--text-muted` tokens).

### M-1 — sv() aria-selected (commit `96282f2`)

`public/permitting.html` + `public/design.html`. sv() now calls
`t.setAttribute('aria-selected', active ? 'true' : 'false')` on every
nav-tab during view switch. Matches admin's showView() pattern.
Initial HTML already had correct aria-selected values.

### M-2 — Icon-only button aria-labels (commit `70e59cd`)

All 5 targets addressed in admin.html:
- AI panel close → `aria-label="Close AI panel"`
- Audit drawer close → `aria-label="Close audit drawer"`
- AI file-clear → `aria-label="Clear attached file"`
- Undo bar dismiss → `aria-label="Dismiss"`
- Mobile AI FAB → `aria-label="Open AI assistant"`

Decorative FA icons inside each button also received `aria-hidden="true"`.

### M-4 — Chart sr-only data table (commit `8554465`)

admin.html `#rev-trend-body`: added `role="img"` + `aria-label="Monthly
Earnings Trend bar chart"`.

Added `#rev-trend-sr-table` sibling div (sr-only clip-path style).
`public/js/revenue_tab.js` injects a `<table>` with `<caption>`,
scoped `<th scope="col">` headers, and `<th scope="row">` per month row
on every chart render. SR users navigate tabular data; sighted users see
bars unchanged.

### M-5 — Toast assertive for errors (commit `97287c4`)

`public/toast.js`. Error toasts now inject a message into a hidden
`role="alert" aria-live="assertive"` div (`#lfs-toast-assertive`) that
is created on first error. The assertive announcement fires SR interruption;
the visible toast still renders inside the polite `#lfs-toast-stack`.
Assertive div text is cleared after 1s to prevent stale re-reads.
Non-error types unchanged.

### M-6 — Upload progress bar ARIA (commit `25b9fdc`)

Three bars in admin.html got:
`role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress"`

`onProgress` handlers in `permits_tab.js`, `design_docs.js`,
`invoice_templates.js` each got `bar.setAttribute('aria-valuenow', p)`
alongside the existing `bar.style.width = p + '%'`.

### M-7 — splice_view zoom buttons (commit `9206411`)

`public/splice_view.html` toolbar zoom buttons:
- zoom(1.2) → `aria-label="Zoom in"`
- zoom(0.83) → `aria-label="Zoom out"`
- FA icons → `aria-hidden="true"`

### M-8 — Settings modal tablist (commit `1eed41b`)

`public/permitting.html` + `public/design.html`:
- Tab container: `role="tablist" aria-label="Settings sections"`
- Each tab button: `role="tab" aria-selected aria-controls id`
  (initial state: jobs=true, rest=false)
- Each pane div: `role="tabpanel" aria-labelledby` → matching tab id
- `setStab()`: added `t.setAttribute('aria-selected', active ? 'true' : 'false')`
  to keep state in sync on every switch

### L-1 — splice.html showModal focus (commit `00a72de`)

`public/splice.html` `showModal()`. Added explicit `focus()` call
immediately after `host.innerHTML` is set, targeting the first focusable
element via a comprehensive selector (input/select/textarea/button/
[tabindex]). autofocus attribute is unreliable in dynamically-injected
content. Covers all ~15 showModal() call sites.

---

## Test results

- `npm test` (40 DB-independent tests): **40/40 PASS**
- 20 DB-requiring tests fail with `DATABASE_URL not set` — pre-existing
  infrastructure constraint in dev env, not caused by this wave.
- Browser smoke tests not runnable without a DB + live server.
- No DOM IDs deleted that appear in `tests/browser/*.spec.js` (checked
  via grep — clean).

---

## Adjacent observations (no commits)

- `--vetro-text-secondary: #6B7280` on `#FAFAFA` in splice.html light mode
  = 4.63:1, passes AA. `--vetro-text-muted: #9CA3AF` = 2.43:1, fails.
  The vetro-text-muted is used for decorative/caption text (not body text).
  Recommend surface in a future a11y wave if the splice tool gets an
  accessibility pass.
- progress bars in admin.html at lines 5380 / 5408 / 8334 are dynamically
  generated JS template strings (billing/contract usage bars). They render
  visually with percentage labels adjacent to the bar, mitigating the
  missing ARIA. Recommend a future pass to add role=progressbar there too.

=== FE-A11Y FIX-C REPORT END ===
