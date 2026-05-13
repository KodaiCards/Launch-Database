# Wave Projection — Canonical Fix List

> Built from Auditor A (broad), Auditor B (adversarial), Auditor C (high-precision conservative)
> + orchestrator methodology overlay. Includes frontend rendering spec for the 3 UC tiles.
> One fix-agent will work the entire list end-to-end.

---

## Design contract (read first — defines what tiles look like + what numbers mean)

### Tile 1 — "RUS Next 90 Days" (admin.html:705, formerly "Next 90 Day Projection")

**Scope:** RUS-program engineering contracts only. We can't reliably project BAU/GFR/Other (no equivalent budget infrastructure or rate consistency).

**Why RUS-only is honest:** Other programs lack the budget allocations, rate consistency, and time_entry density to support pace-based forecasting. Renaming the tile makes the scope explicit.

**Output shape (one tile, one number, three sub-numbers):**

```
$XXX,XXX  RUS Projected Revenue (next 90 days)
  ├── $XX,XXX  Already billed (period MTD)
  ├── $XX,XXX  Logged, not yet invoiced (WIP)
  └── $XX,XXX  Projected new work (pace × remaining horizon)

[sparkline: weekly projected revenue over horizon]
[data-quality chip: "All clear" or "3 issues — view in settings"]
```

**Why the three-number split is critical:** Current code computes a single "projected" number that DOUBLE-COUNTS WIP (already-worked-but-not-yet-invoiced hours flow into pace AND are subtracted from `budget - billed_to_date`). Splitting them removes the double-count and gives the admin actionable info ("can I invoice that WIP now?").

### Tile 2 — Drill-in expansion of Tile 1

Triggered by clicking Tile 1. Replaces the obsolete `display:none` "RUS Revenue Projection" tile at admin.html:771 (DELETE that HTML block).

**Output shape:** 4 sub-buckets (Inspection / RE / Permitting / Misc) with the same billed / WIP / projected split per bucket, plus weekly pace and remaining budget per bucket.

```
Bucket          Billed   WIP    Projected  Total    Pace/wk   Budget Rem
─────────────────────────────────────────────────────────────────────────
Inspection      $XX,XXX  $X,XXX  $XX,XXX   $XX,XXX  $XX,XXX   $XX,XXX
RE              ...
Permitting      (footage: expected − billed)
Misc            (no projection — flagged)
```

### Tile 3 — Project drill-down "Projected Revenue" (admin.html:6350)

Single project's completion forecast.

**Output shape:**
- 4 numbers: Actual to date (billed) / WIP (logged + unbilled) / Projected remaining / Total at completion
- Burn bar: green (billed) | yellow (WIP) | blue (projected new) | red overflow segment if total > budget

### Tile metadata (all three)

- "?" tooltip on each tile explaining the math (1 sentence: "Based on 8-week billable-hours pace × billing rate, capped at remaining EC budget")
- Data-quality chip: "All clear" green / "N issues — view in settings" amber, links to the new settings panel

### NEW: "Projection Data Quality" admin panel (Settings → Admin → Projection Data Quality)

Hidden in settings (not on dashboard). Surfaces:
- Projects with `billing_rate IS NULL` or `billing_rate = 0` (count, list)
- Projects with `expected_revenue IS NULL` on permitting type (count, list)
- Projects with stale `expected_revenue` (footage was edited but `expected_revenue` not updated — Auditor C-3)
- Projects with sparse history (<3 weeks of entries) currently affecting pace
- ECs with `budget_allocated IS NULL` or `= 0` (uncapped projections)

For each: project name + link to project drill-down + suggested action.

---

## Canonical fix list

Tier convention:
- **HIGH** = wrong dollar number visible on dashboard, or double-bill risk
- **MEDIUM** = degrades projection accuracy or hides data quality
- **LOW** = cosmetic / cleanup
- Source code: `auditor:finding-id` for traceability

### HIGH — Math correctness (8 items)

| # | Source | File | Issue | Fix |
|---|---|---|---|---|
| H-1 | A-1 + C-2 | `automation.js` `buildBillNowPreview` `unbilled_hourly` CTE | `actual_hours × billing_rate − invoice_items.amount` is wrong when `manual_invoice_amount` was used or rate changed mid-project. Ships wrong unbilled $ to admin. | Mirror `/api/revenue/unbilled` pattern: `CASE WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount ELSE SUM(te.hours WHERE is_billable) × billing_rate END − COALESCE(SUM(invoice_items.amount), 0)`. Use live `time_entries` SUM, not `actual_hours`. |
| H-2 | A-2 | `automation.js` `buildPscRusProjection` lookback CTE | `entry_date >= CURRENT_DATE - 8 weeks` sums all hours including non-billable (overhead, permitting, WO-only). Inflates pace. **User explicitly confirmed overhead does NOT count.** | Add `AND COALESCE(te.is_billable, TRUE) = TRUE` to the lookback CTE in `buildPscRusProjection` AND `buildInspectionRevenueProjection` AND `buildBillNowPreview` if applicable. |
| H-3 | A-3 + B-4 | `automation.js` `buildPscRusProjection` project query | `status IN ('active', 'billed')` includes one-time `billed` projects in forward-looking pace. Done work projects future hours. | Exclude `'billed'` from the pace query: `status IN ('active')` for hourly bucketing. For permitting/footage, `'billed'` projects' `expected − billed_to_date` should floor at $0 per project (already mostly handled, verify floor is per-project not per-bucket). |
| H-4 | B-1 | `automation.js` `buildInspectionRevenueProjection.computeRow` | `weighted_rate === 0` → `budgetHours = Infinity` → unbounded `projHours`, then × $0 rate = silent $0 with garbage `projected_remaining_hours`. | Guard: `if (rate <= 0) { return { ...zeroed, rate_missing: true }; }` and surface flag in data-quality panel. |
| H-5 | B-2 + A-5 + B-11 | `automation.js` `buildPscRusProjection` weighted-rate fallback | If ALL projects in a bucket have `billing_rate = NULL` or `= 0`, bucket projects $0 silently. AI-created projects (Wave-2 BE-AI bug context) often have `billing_rate = 0`. | (a) Skip projects where `billing_rate <= 0` from rate calc (don't drag denominator down). (b) When entire bucket is zero-rate, set bucket projection to $0 AND raise `bucket_no_rate: true` flag for data-quality panel. (c) Optional v2: job-type fallback rate (Inspection=$90, RE=$100) — defer for now, surface as warning instead. |
| H-6 | B-3 | `automation.js` `buildPscRusProjection` pace formula | `avgWeekly = totalLookbackHrs / lookbackWeeks` always divides by 8, even for projects with <8 weeks of history. New projects look 62% slower than reality. | Compute `effective_lookback_weeks = MIN(lookbackWeeks, ceil((CURRENT_DATE - first_entry_date) / 7))` per project. Use effective lookback as the divisor. Surface `effective_lookback` in output for transparency. |
| H-7 | B-5 + B-6 + B-14 | `automation.js` lookback / MTD CTEs + `routes/inspection.js` `endDate` | `CURRENT_DATE` is server-UTC, not Chicago. Entries logged 6-11 PM Chicago can land outside the intended window. ~14% of a week's work potentially miscounted at boundary. | Use `(NOW() AT TIME ZONE 'America/Chicago')::date` everywhere `CURRENT_DATE` is used in projection / MTD / lookback math. In Node, use the existing `dateInBusinessTz()` helper from `automation.js` instead of `new Date().toISOString().slice(0,10)`. |
| H-8 | C-1 | `automation.js` `buildInspectionRevenueProjection.computeRow` | Weighted-recency `hours_recent` divided by raw `lookbackWeeks` (unweighted). Average weight ~0.6, so pace is systematically ~40% understated. | Use `hours_recent_unweighted / lookbackWeeks` for pace (the comment explicitly says it's kept for this purpose). Or compute `sum_of_weights` and divide weighted hours by that. Pick one approach and document. |

### HIGH — Architecture (3 items, my methodology overlay)

| # | Source | File | Issue | Fix |
|---|---|---|---|---|
| ARC-1 | orchestrator | `automation.js` `buildPscRusProjection` output shape + `revenue.js` projection consumers | Single `projected_revenue` number conflates billed + WIP + new-work pace. Umbrella budget cap subtracts only `billed_to_date`, allowing pace to project hours that are ALREADY in the unbilled pipeline. Double-counts WIP. | Restructure `buildPscRusProjection` output: per-EC return `{billed, wip, projected_new, total, sparkline_weekly}`. Compute `wip = SUM(te.hours WHERE is_billable AND no invoice_item) × billing_rate`. Compute `projected_new = pace × remaining_horizon × rate`, capped at `budget - billed - wip` (not just `budget - billed`). |
| ARC-2 | orchestrator | `automation.js` `buildPscRusProjection` per-project pace | Per-project `pace × horizon` extrapolates 13 weeks even for projects with `eta_date` 3 weeks out. Overstates projection. | Per-project `effective_horizon = MIN(global_horizon_weeks, weeks_until_eta_date)` where `eta_date IS NOT NULL`. Where `eta_date IS NULL`, use full horizon. |
| ARC-3 | A-13 + C-3 + orchestrator | `schema.sql` + `routes/projects.js` (project edit endpoint) | `projected_revenue` static column drifts from `expected_revenue` for footage projects when footage is edited. For hourly projects, the column is user-entered, often NULL, never auto-syncs. | (a) Add DB trigger `BEFORE UPDATE ON projects` that sets `projected_revenue = expected_revenue WHERE billing_type = 'footage'`. (b) For hourly projects, derive `projected_revenue` at read time from `expected_hours × billing_rate` in `/api/revenue/projected-total` rather than reading the stored column. Document that the stored column is footage-only canonical. |

### MEDIUM — Correctness + UX (6 items)

| # | Source | File | Issue | Fix |
|---|---|---|---|---|
| M-1 | B-8 | `automation.js` `buildPscRusProjection` steps 2–4 | Three separate `pool.query` calls for lookback / MTD / billed-to-date. Race window if a time_entry or invoice commits between queries. | Wrap steps 1–5 in a single `BEGIN READ ONLY; ... COMMIT` transaction OR combine into one CTE. Prefer the transaction for readability. |
| M-2 | A-4 + A-5 | `automation.js` permitting bucket + rate fallback | `expected_revenue IS NULL` permitting projects silently contribute $0. NULL-rate projects silently excluded from rate calc. | Surface both in the new "Projection Data Quality" panel (FE-DQ below). Don't change projection math beyond that — these are data issues, not math bugs. |
| M-3 | A-9 + B-10 | `routes/revenue.js` `/api/revenue/projected-total` | `status IN ('active', 'completed')` excludes `billed` footage projects with leftover `projected_revenue`. Coverage gap (`with_projected` / `without_projected` counts) only shown in drilldown modal, not on tile. | (a) Document the `'billed'` exclusion is intentional ("shows only open pipeline"). (b) Show coverage caveat inline on tile: "X of Y projects have projected revenue set." |
| M-4 | B-12 | `automation.js` `buildMonthlyBillingDraft` `already_billed` CTE | `billing_period_start = $1 AND billing_period_end = $2` strict match. Legacy invoices with NULL `billing_period_start` won't match → could double-bill a monthly project. | **Adjacent scope, but high enough severity to fix in this wave.** Mirror two-branch match logic from `revenue.js` monthly CTE: check `billing_period_start` first, fall back to `invoice_date` year+month match. |
| M-5 | A-6 + A-11 | `automation.js` + tile labels | "Next 90 Day" label vs `horizonWeeks=13` (91 days) mismatch. MTD vs 8-week lookback semantically distinct but UI doesn't separate them. | Standardize: rename label to "RUS Next 90 Days" and set `horizonWeeks = 12.857` (90 days exactly) OR keep `13` and label "RUS Next 13 Weeks". Pick "13 Weeks" for clarity (engineering work is weekly-paced). On tile, show "MTD: X hrs / 13-wk pace: $Y" so the two are distinct. |
| M-6 | B-9 | `routes/inspection.js` result composition | `is_ongoing` projects with 0 hours in period are kept and counted in `active_projects`. Inflates active count. | **Adjacent scope.** Add `stale: true` flag for `is_ongoing` projects with 0 hours in window. Exclude them from `active_projects` count but keep in result list with the flag. |

### LOW — Cleanup + cosmetic (3 items)

| # | Source | File | Issue | Fix |
|---|---|---|---|---|
| L-1 | B-13 | `automation.js` `buildInspectionRevenueProjection.computeRow` | `will_exhaust_budget = paceHours >= budgetHours` — at exact equality flag fires but `projected_remaining_hours = budgetHours` (not over). | Change to `paceHours > budgetHours` for consistency. |
| L-2 | A-10 | `automation.js` `buildInspectionRevenueProjection` | Function fully implemented but the alias route now points to `buildPscRusProjection`. Risk of silent divergence. | Add `@deprecated` JSDoc + console.warn on first call + plan to remove in a follow-up wave. Don't remove now — verify no other callers. |
| L-3 | B-15 | `routes/revenue.js` `unbilled` one-time query | Theoretical edge: `billing_cadence = NULL` legacy rows could appear in both one-time and monthly queues. | Verify with a one-shot SQL: `SELECT COUNT(*) FROM projects WHERE billing_cadence IS NULL AND status='active'`. If 0, document the verification in code comment. If >0, set `billing_cadence='one_time'` for legacy NULL rows in a migration. |

### Frontend rendering scope (5 items, all NEW work)

| # | Surface | Spec |
|---|---|---|
| FE-1 | `public/admin.html:705` Tile 1 | Replace UNDER CONSTRUCTION with rendered "RUS Next 90 Days" — 1 main number + 3 sub-numbers (billed/WIP/projected/total) + weekly sparkline + data-quality chip. Click → expand to Tile 2. |
| FE-2 | `public/admin.html:771` Tile 2 | DELETE current `display:none` HTML block. Build as in-place expansion of Tile 1: 4-row table (Inspection / RE / Permitting / Misc) × columns (Billed / WIP / Projected / Total / Pace/wk / Budget Remaining). |
| FE-3 | `public/admin.html:6350` Tile 3 | Replace UNDER CONSTRUCTION in project drill-down with: 4 numbers (Actual / WIP / Projected / Total) + horizontal burn bar (green/yellow/blue/red-overflow). Methodology tooltip. |
| FE-4 | `public/admin.html` Settings → Admin section | Build new "Projection Data Quality" panel. Lists: NULL/zero-rate projects, NULL `expected_revenue` permitting projects, stale `expected_revenue` (footage edited after creation), sparse-history projects, ECs with no budget. Per-row: project name + link + suggested action. |
| FE-5 | All 3 tiles | "?" methodology tooltip — single sentence per tile explaining the math. |

### Backend endpoint scope (NEW + modified)

| # | Endpoint | Spec |
|---|---|---|
| BE-1 | NEW `/api/automation/projection-data-quality` (admin only) | Returns the 5 lists for the data-quality panel. Single endpoint, structured response. |
| BE-2 | MODIFY `/api/automation/psc-rus-projection` | Output shape changes per ARC-1 (split into billed/wip/projected_new/total + per-EC, per-bucket, sparkline_weekly). All HIGH math fixes applied. |
| BE-3 | NEW `/api/automation/project-projection/:projectId` (admin or owner) | Returns Tile 3 data: actual / WIP / projected / total / budget / burn-bar segments. |

---

## Out of scope for this wave (deferred with reason)

- **EVM (earned-value management) methodology.** Industry standard for government engineering contracts but requires planned schedules per project, which we don't track. Document in CLAUDE.md as a future option.
- **Monte Carlo confidence bands on pace.** Useful for sparse-data projects. Adds complexity. Defer to v2 enhancement after v1 ships and we see real usage.
- **Materialized view / cached projection.** Current data volume doesn't warrant. Add `projection_cache` table refreshed nightly only if dashboard load times degrade.
- **Per-WO# (work-order) breakdown.** User explicitly noted: WO# splits aren't tracked, only EC totals. Projection stays at EC level.
- **Multi-program projection (BAU / GFR / Other).** Other programs lack budget infrastructure + rate consistency. Tile 1 honestly scoped to RUS only.

---

## Verification tier (for verification red-team)

- **3+ auditor convergence (quick spot-check):** none — no item appeared on all 3 audits.
- **2-auditor convergence:** H-1 (A+C), H-3 (A+B), H-5 (A+B), H-7 (B duplicates internal), ARC-3 (A+C). These get full verification.
- **1-auditor or orchestrator:** all others. These get full end-to-end verification.

---

## Acceptance criteria for fix-agent

1. All HIGH and MEDIUM canonical items addressed OR explicitly deferred with reason in fix report.
2. New endpoints (`BE-1`, `BE-3`) documented with response shape comments.
3. Frontend tiles render real data — no placeholder text. Empty/zero state designed for "no RUS data yet" case.
4. Data-quality panel populated with at least one example for each category from current DB state.
5. No regression in existing `/api/revenue/*` endpoints.
6. `npm test` passes (or current safety net — confirm with orchestrator before running).
7. Local boot smoke test: `node server.js` doesn't error on startup.

=== CANONICAL LIST END ===
