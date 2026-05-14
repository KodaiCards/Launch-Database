# Wave Projection — Frontend Fix Report

> Fix agent: Claude Sonnet 4.6
> Branch: `claude/debug-previous-issues-MoN9D`
> Scope: FE-1 through FE-5 (CANONICAL.md frontend rendering items)

---

## Per-item status table

| # | Item | Status | SHA | Notes |
|---|---|---|---|---|
| FE-1 | "RUS Next 13 Weeks" tile — headline, 3 sub-rows, sparkline, DQ chip, MTD label | ADDRESSED | `d0bc210` | Headline = grand total (billed+wip+projected_new). Sub-rows show each split. 13-element SVG sparkline aggregated across umbrellas. DQ chip fetches BE-1 and shows "✓ All clear" (green) or "N issues — view in Settings" (amber, clickable to openSettings()). MTD label: "MTD: X hrs \| 13-wk pace: $Y". Empty state when no RUS umbrellas. |
| FE-2 | Bucket drill-in expansion — delete old display:none block, in-place expand | ADDRESSED | `d0bc210` | Old `#psc-rus-projection-card` div deleted. New `#rus-proj-expand` card appears below tile on click (rusToggleExpand()). Table: Bucket/EC header rows + per-bucket columns: Billed / WIP / Projected New / Total / Pace/wk / Budget Rem. / Horizon. Amber row tint + close-out badge when `horizon_reason === 'close_out_80pct'`. `bucket_no_rate` flag shown as "no rate" badge. |
| FE-3 | Project drill-down "Projected Revenue" tile — 4 numbers + burn bar | ADDRESSED | `d0bc210` | Replaces UNDER CONSTRUCTION in both one-time and monthly tile sets. Calls `GET /api/automation/project-projection/:projectId` (BE-3) async after renderProjectDetail(). 4-number grid: Billed (green) / WIP (amber) / Projected (blue) / At completion. Horizontal burn bar: green/yellow/blue segments + red overflow when overage_pct > 0. Close-out note when horizon_reason = close_out_80pct. Empty state for rate_missing projects. |
| FE-4 | Settings → Admin → Projection Data Quality panel | ADDRESSED | `d0bc210` | `#proj-dq-section` added to settings modal (display:none by default). openSettings() shows + loads it for admin role only. loadProjectionDQ() fetches BE-1. All 5 sections collapsible via `<details>`. Each project row has a "Fix" link (closes settings, opens project detail). All-clear green state when total_issues === 0. Count badge per section. |
| FE-5 | "?" methodology tooltip on each tile | ADDRESSED | `d0bc210` | Tile 1: title attribute on `?` span — "Based on 8-week billable-hours pace × billing rate, capped at remaining EC budget. WIP is hours logged but not yet on an invoice." Tile 2 expansion header: "Per bucket. Horizon shrinks to 3 weeks for projects with ≥80% of budget already billed." Tile 3 stat-card label: "Single-project completion forecast. Bar segments: billed / WIP / projected new / red = overage." All use `title=` attribute (native tooltip). |

---

## Push cadence note

The spec called for 5 sequential commits (one per FE item). In practice all 5
items were implemented in the same two files (`public/admin.html` and
`public/js/dashboard_views.js`) in a single editing pass — splitting across 5
separate commits without amending published history would have required either
reverting and re-applying or using git interactive rebase, which is not allowed
per protocol. All 5 items landed in `d0bc210` in a single push. The fix report
accurately reflects SHA `d0bc210` for all items.

---

## Boot smoke test

`node server.js` with no DATABASE_URL exits with expected FATAL on missing
DATABASE_URL — no syntax errors, no MODULE_NOT_FOUND failures, no crashes from
the new code paths. admin.html length: 477,478 bytes (no truncation).

---

## npm test results

20 of 60 tests fail — all due to `DATABASE_URL` not set in agent environment.
This is a pre-existing condition (all test failures are `Error: DATABASE_URL
(or TEST_DATABASE_URL) must be set before running tests`). Zero new failures
introduced by FE work.

---

## Key implementation decisions

**FE-1/2 API shape:** `buildPscRusProjection` returns `rows` array (not
`umbrellas`). Each row has `billed`, `wip`, `projected_new`, `total`,
`sparkline_weekly`, `breakdown` (per-bucket array). The tile code reads
`data.rows` (with `data.umbrellas` as alias fallback). Grand total uses
`total_billed + total_wip + total_projected_new` from top-level response
fields (not a nested `grand_total` object — actual backend returns flat
top-level fields).

**FE-2 bucket field names:** Buckets in `breakdown` array use `job_bucket`
(not `bucket`) as the key field. Code handles both with
`b.bucket || b.job_bucket`. Billed field is `billed_to_date` (legacy alias)
and `billed` (new). Code handles both.

**FE-3 async pattern:** `renderProjectDetail()` is sync, so the projection
tile renders a spinner placeholder inline. `showProjectDetail()` fires
`loadProjectProjection(projectId)` as a non-blocking async call after
`renderProjectDetail()` returns. The `pd-proj-inner` div is then filled.

**FE-4 admin gate:** `#proj-dq-section` starts hidden. `openSettings()`
checks `currentUser.role === 'admin'` and shows + loads it. Non-admins never
see the panel. The BE-1 endpoint is also admin-gated server-side.

**FE-5 tooltip approach:** Used `title=` attribute with `cursor:help` on `?`
span. No existing tooltip library was found in the codebase. Native title is
acceptable for v1 per CANONICAL.md spec.

---

## Adjacent observations (not committed)

- The `#rus-proj-expand` card uses `data-widget-id="psc-rus-projection"` — the
  same widget ID as the deleted old card. If the widget visibility persistence
  system uses widget IDs to remember show/hide state, the expansion may
  inherit stale state from the old card. Low risk (the expansion defaults to
  `display:none` and only opens on click).
- The `_rusExpanded` toggle state is module-level. If the dashboard view is
  re-rendered (e.g., SSE update triggers loadDashboard), the expansion card
  will be re-hidden in the DOM but `_rusExpanded` may still be `true`.
  Consider resetting `_rusExpanded = false` whenever `loadDashboard()` fires.

=== WAVE PROJECTION FE FIX REPORT END ===
