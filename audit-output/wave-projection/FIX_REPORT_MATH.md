# Wave Projection — Math Fix Report

> Fix agent: wave-projection-math-fix
> Commit: `529c476`
> Scope: H-1 through H-8, L-4 (9 canonical items)
> Branch: `claude/debug-previous-issues-MoN9D`

---

## Per-item status

| # | Status | File:lines | Change shape |
|---|---|---|---|
| H-1 | ADDRESSED | `automation.js` `buildBillNowPreview` ~L726-774 | Rewrote hourly CTE: added `billable_hours` CTE (live `SUM(time_entries.hours WHERE is_billable)`) and `project_billed` CTE; hourly `earned` now uses `CASE WHEN manual_invoice_amount IS NOT NULL THEN manual_invoice_amount ELSE hours_done × rate END`; `already_billed` and `unbilled_amount` derived from live CTEs. |
| H-2 | ADDRESSED | `automation.js` `buildPscRusProjection` lookback query ~L261-278; `buildInspectionRevenueProjection` recent_hours CTE ~L512-534 | Added `AND COALESCE(is_billable, TRUE) = TRUE` to both lookback queries. Comment explains intent. |
| H-3 | ADDRESSED | `automation.js` `buildPscRusProjection` project query ~L240; permitting bucket ~L390-396 | Changed `status IN ('active', 'billed')` → `status IN ('active')`. Changed permitting bucket from `Math.max(0, expected - bucketBilled)` to per-project `Math.max(0, expected - billed)` reduction before sum. |
| H-4 | ADDRESSED | `automation.js` `computeRow` ~L657-660 | Added guard: `if ((weighted_rate || 0) <= 0) return { ...zeroed, rate_missing: true }`. Eliminates `Infinity` budgetHours and garbage projected hours on zero-rate rows. |
| H-5 | ADDRESSED | `automation.js` `buildPscRusProjection` bucket loop ~L396-450 | Rate numerator/denominator loop skips projects with `billing_rate <= 0`. Falls back to simple average of positive rates only. Sets `bucketNoRate = true` when entire bucket has no usable rate; `bucketProjection = 0` and `bucket_no_rate: true` in breakdown output. |
| H-6 | ADDRESSED | `automation.js` `buildPscRusProjection` ~L271-296, bucket pace calc ~L420-450 | Added `firstEntryByProject` query (`MIN(entry_date) WHERE is_billable`). Per-project `effectiveLookback = MIN(lookbackWeeks, ceil(weeksSinceFirst))`. Bucket divisor = average effective lookback across projects with hours. |
| H-7 | ADDRESSED | `automation.js` lookback + MTD CTEs ~L261-278; `routes/inspection.js` ~L38-65 | SQL CTEs: `CURRENT_DATE` → `(NOW() AT TIME ZONE 'America/Chicago')::date` in all projection/lookback/MTD boundaries. Node: `now.toISOString().slice(0,10)` → `dateInBusinessTz(now)` (helper imported from `automation.js`; `dateInBusinessTz` added to module.exports). |
| H-8 | ADDRESSED | `automation.js` `computeRow` ~L692-697; SELECT ~L544-548; umbrella/standalone callers ~L732-790 | `hours_recent_unweighted` added to SELECT. `computeRow` accepts new `hours_recent_unweighted` parameter and uses it as pace divisor (`paceHrs`). Both umbrella and standalone callers now aggregate and pass `hours_recent_unweighted`. `hours_last_n_weeks` output field updated to expose unweighted count. |
| L-4 | ADDRESSED | `automation.js` `buildBillNowPreview` footage CTE ~L756-774 | Added `project_billed` CTE (shared with hourly branch). Footage `already_billed` = `COALESCE(SUM(invoice_items.amount), 0)`. `unbilled_amount = expected_revenue - already_billed` (was `expected_revenue` hardcoded). |

---

## Out of scope (not touched)

ARC-1, ARC-2, ARC-3, M-1 through M-6, L-1 through L-3, FE-1 through FE-5, BE-1, BE-3.

---

## Boot smoke test

```
node server.js → exits with DATABASE_URL not set (no DB in CI environment).
No module errors, no syntax errors.
node --check automation.js → OK
node --check routes/inspection.js → OK
```

---

## Adjacent observations (notes only, not committed)

- `buildPscRusProjection` still makes 4+ separate pool.query calls (M-1: race window). Deferred to second fix-agent per scope constraint.
- `buildInspectionRevenueProjection` is now an unused code path (legacy alias routes to `buildPscRusProjection`). L-2 @deprecated annotation deferred to second dispatch.
- `computeRow` H-6 effective lookback is only implemented in `buildPscRusProjection`'s inline pace calc, not in `buildInspectionRevenueProjection`'s `computeRow`. The inspection function doesn't have per-project first-entry data in its current query shape. Surfaced as a note for the next wave.

=== WAVE PROJECTION MATH FIX REPORT END ===
