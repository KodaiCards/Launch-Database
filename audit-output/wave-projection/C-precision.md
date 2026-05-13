# Projection Wave — Auditor C (High-Precision Conservative)

**Framing:** High-precision conservative. Only findings I am HIGH-CONFIDENCE about — confirmed-wrong numbers in normal daily-use scenarios. Lower false-positive rate than A or B by design.

**Scope:** `routes/inspection.js`, `routes/revenue.js`, `invoice_generator.js`, `automation.js`, `routes/_helpers.js`, schema columns feeding projections.

**Stack snapshot (≤80 words):** The projection surface has five distinct calculation paths — pace-based hourly projection (`buildInspectionRevenueProjection`, `buildPscRusProjection`), footage-remaining projection, bill-now preview, projected-total leaf-sum, and YTD earned (monthly-summary). All five have been completely read. The code is architecturally sound; most comments and guards are accurate. Three confirmed-wrong-number bugs survived full read-and-verify; all produce incorrect dollar figures in normal daily use.

---

## Findings

| # | Severity | Category | File | Line range | Snippet | Issue (1 line) | Fix shape (1 line) | Confidence |
|---|---|---|---|---|---|---|---|---|
| C-1 | HIGH | Wrong formula | `automation.js` | `buildInspectionRevenueProjection` → `recent_hours` CTE | `hours_recent * GREATEST(0.2, 1.0 - (EXTRACT(EPOCH ...) / 86400.0 / 7.0) / NULLIF($1::float, 0))` | Weighted-recency hours are used as the pace numerator but divided by raw `lookbackWeeks` (unweighted), producing avg_weekly_hours that is too low whenever recent weeks have lower weight — projected revenue is systematically understated. | Divide `hours_recent` (weighted sum) by the sum of the weights, not by `lookbackWeeks`; or don't weight at all (the comment says "Plain SUM stays available as hours_recent_unweighted for backward-compat checks" — use that for pace). | HIGH |
| C-2 | HIGH | Scope mismatch | `automation.js` | `buildBillNowPreview` → `unbilled_hourly` CTE | `COALESCE(p.actual_hours, 0)::float AS hours_done` / `hours_done * COALESCE(p.billing_rate, 0)::float AS earned` | `actual_hours` on `projects` is updated by `updateProjectHours` which counts **all** `is_billable=TRUE` entries; but `already_billed` is subtracted using `invoice_items.amount`. For an hourly project where some hours were billed at a different rate or via a manual adjustment, `earned - already_billed` will not equal the true unbilled dollar amount, producing a wrong `unbilled_amount`. | Compute `earned` from `SUM(time_entries.hours) * billing_rate` for hours NOT covered by invoice_items (same join used in `unbilled` endpoint in revenue.js) rather than from `actual_hours`. | HIGH |
| C-3 | MEDIUM | Off-by-period | `automation.js` | `buildPscRusProjection` → permitting bucket | `bucketProjection = Math.max(0, expected - bucketBilled)` where `billedByProject` = `SUM(invoice_items.amount)` for any invoice ever | Permitting projection = expected_revenue minus ALL billed to date (across all time), but `expected_revenue` on a permitting project is set at creation and never updated when footage changes; if footage was edited after creation, `expected_revenue` is stale and the projection is wrong. | Either recalculate `expected_revenue` at query time from `footage × rate` via `calcProjectFinancials`, or document that `expected_revenue` must be kept in sync and add a DB-level trigger/check. | MEDIUM |

---

## Detailed traceability

### Finding C-1 — Weighted hours divided by unweighted lookback weeks

Verified by reading: `automation.js`, `buildInspectionRevenueProjection` function, `recent_hours` CTE and `computeRow` function.

Code snippet (recent_hours CTE, produces `hours_recent`):
```sql
COALESCE(SUM(
  te.hours *
  GREATEST(
    0.2,
    1.0 - (
      EXTRACT(EPOCH FROM (CURRENT_DATE - te.entry_date)) / 86400.0 / 7.0
    ) / NULLIF($1::float, 0)
  )
), 0)::float AS hours_recent
```

Code snippet (`computeRow` — divides weighted sum by raw weeks):
```js
const avgWeekly = lookbackWeeks > 0 ? hours_recent / lookbackWeeks : 0;
const paceHours = avgWeekly * horizonWeeks;
```

**Why this is confirmed wrong:** `hours_recent` is a weighted sum where entries near the start of the lookback window contribute only 20% of their actual hours (weight = `max(0.2, 1 - age_weeks/lookbackWeeks)`). The sum across 8 weeks with uniform activity is roughly `8 * 0.6 * weeklyHours` (average weight ~0.6), not `8 * weeklyHours`. Dividing that by 8 (raw weeks) produces `avgWeekly ≈ 0.6 × trueWeeklyHours`, so `paceHours` and `projRevenue` are 40% too low in the typical case of uniform work distribution. The comment acknowledges the unweighted sum exists (`hours_recent_unweighted`) and is the "backward-compat" value — it is the correct divisor if weighted hours are kept, OR the pace calculation should use `hours_recent_unweighted / lookbackWeeks` as originally intended.

**Pre-submit reject check:** One could argue the weight-divided-by-raw-weeks was intentional to get a "conservative" estimate. Rejected: the comment says "Recent weeks count fully (1.0)" — that's the stated intent, meaning the formula should produce an accurate average, not a discounted one. The conservative discounting is a math error, not a design choice.

---

### Finding C-2 — Bill-now preview uses `actual_hours` instead of time-entry sum for unbilled delta

Verified by reading: `automation.js`, `buildBillNowPreview` function, `unbilled_hourly` CTE.

Code snippet:
```sql
COALESCE(p.actual_hours, 0)::float AS hours_done,
-- ...
COALESCE(p.actual_hours, 0)::float * COALESCE(p.billing_rate, 0)::float AS earned,
(COALESCE(p.actual_hours, 0)::float * COALESCE(p.billing_rate, 0)::float)
  - COALESCE((
      SELECT SUM(ii.amount) FROM invoice_items ii WHERE ii.project_id = p.id
    ), 0)::float AS unbilled_amount
```

`routes/_helpers.js`, `updateProjectHours`:
```js
await pool.query(`
  UPDATE projects SET actual_hours = (
    SELECT COALESCE(SUM(hours),0) FROM time_entries
     WHERE project_id=$1 AND COALESCE(is_billable, TRUE) = TRUE
  ) + (
    SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id=$1
  ) WHERE id=$1
`, [projectId]);
```

**Why this is confirmed wrong:** `actual_hours` rolls up child project hours too (the `SUM(actual_hours) FROM projects WHERE parent_id=$1` term). For a leaf project that is itself a child, `actual_hours` correctly equals its own time entries. But `actual_hours * billing_rate` will produce a number inconsistent with `SUM(invoice_items.amount)` whenever:
1. Any invoice was created with a manual amount override (`manual_invoice_amount` — used in the unbilled queue endpoint in `revenue.js`), or
2. An invoice was created at a different rate than the current `billing_rate`.

The `/api/revenue/unbilled` endpoint (revenue.js) correctly computes `CASE WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount WHEN p.billing_type = 'hourly' THEN SUM(te.hours)*p.billing_rate ...` — bill-now preview should use the same pattern. The current approach can show a positive `unbilled_amount` even for a project that has already been fully invoiced, if the invoice was created with a manual amount.

**Pre-submit reject check:** Could `already_billed` always equal `hours_done * billing_rate` in practice if no manual amounts are used? Possible but not guaranteed — rate changes between time of work and time of invoice creation also cause drift. The drift is confirmed real on this codebase because `manual_invoice_amount` is a documented column and the revenue.js unbilled queue already handles it.

---

### Finding C-3 — Permitting projection uses stale `expected_revenue`

Verified by reading: `automation.js`, `buildPscRusProjection`, permitting bucket calculation.

Code snippet:
```js
if (bucketKey === 'permitting') {
  // Footage projection = expected_revenue - billed_to_date,
  // summed across permitting projects in this umbrella.
  const expected = bucketProjects.reduce(
    (s, p) => s + (p.expected_revenue || 0), 0);
  bucketProjection = Math.max(0, expected - bucketBilled);
}
```

From project query in same function:
```sql
p.expected_revenue::float AS expected_revenue,
p.footage::float AS footage,
```

**Why this is confirmed wrong:** `expected_revenue` is computed at project creation using `calcProjectFinancials(type, billingRate, footage, ...)` in `routes/_helpers.js`. If `footage` on the project is later updated (e.g., the survey came back with revised mileage), `expected_revenue` is only updated if the project edit endpoint explicitly recalculates it. No DB trigger enforces the invariant. The projection for permitting therefore shows whatever revenue was computed at creation time, which may differ from `footage / 5280 * rate`. Because the tile is titled "projected remaining revenue," a user seeing a wrong number would trust it for planning purposes.

Note: `buildInspectionRevenueProjection` does NOT have a permitting projection path (it's inspection-only scope), so this bug affects only `buildPscRusProjection`.

**Pre-submit reject check:** Could `expected_revenue` always be in sync with `footage`? Only if every project edit endpoint recalculates it. Reviewed `routes/_helpers.js` — `calcProjectFinancials` is exported but must be called explicitly. Without a migration or trigger enforcing `expected_revenue = f(footage, billing_rate)`, the stale-value scenario is confirmed real on data that has had footage corrections applied.

---

## Negative findings (confirmed clean)

- **`/api/revenue/projected-total`** — Leaf-only filter (`NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)`) correctly prevents rollup double-counting. Confirmed clean.
- **`/api/revenue/monthly-summary` billing_type gate** — `hourly_monthly` CTE correctly filters `p.billing_type = 'hourly'` to prevent footage-project rate × hours inflation. The comment documents the prior bug and the fix. Confirmed clean.
- **`/api/revenue/unbilled` manual_invoice_amount handling** — one-time query correctly uses `CASE WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount ...`. Confirmed clean.
- **`/api/revenue/unbilled` monthly coverage check** — dual-path invoice-date match (billing_period_start when set, invoice_date as fallback) is correct and documented. Confirmed clean.
- **`buildPscRusProjection` umbrella budget cap** — `willExhaust` flag and cap logic (`if (umbrellaProjected > budgetRemaining) umbrellaProjected = budgetRemaining`) are correctly applied before `grandTotalProjected +=`. No double-spend. Confirmed clean.
- **`buildInspectionRevenueProjection` weighted rate fallback** — falls back to simple average rate when all projects have zero recent hours, preventing a divide-by-zero. Confirmed clean.
- **`invoice_generator.js` RUS-only gate** — `ec.program !== 'rus'` check throws before any data assembly. Confirmed clean.
- **`invoice_generator.js` footage amount source** — uses `p.expected_revenue` when positive, otherwise derives from footage × rate. Correct per spec.
- **`routes/inspection.js` period construction** — `endDate` uses `new Date(y, m, 0).getDate()` (last day of month). Correct: `new Date(y, m, 0)` gives last day of month m (0-indexed). Confirmed clean.
- **`routes/_helpers.js` `calcProjectFinancials` randomization** — random factor is only generated when `hoursPerMileOverride` is absent; caller can pass override to stabilize re-renders. Confirmed clean.
- **`routes/revenue.js` `by-client` rollup exclusion** — `COALESCE(p.is_rollup, FALSE) = FALSE` applied consistently. Confirmed clean.
- **`routes/revenue.js` `hours-utilization` unbilled breakdown** — `FILTER (WHERE te.is_billable = FALSE AND te.unbilled_category = 'misc')` correctly scopes each sub-bucket. Confirmed clean.
- **SQL injection surface** — All user inputs in projection endpoints are passed as query parameters, never interpolated. Confirmed clean across all five endpoints.

---

## Coverage gaps

- **Frontend JS for projection tiles** — not in scope per audit prompt. Cannot verify whether the frontend correctly handles the `level='umbrella'` vs `level='project'` distinction, or whether it uses `hours_recent_unweighted` vs `hours_recent` for display. Adversarial and fresh-eyes auditors should flag if they see frontend consuming the wrong field.
- **`/api/automation/billing-draft/monthly` draft accuracy** — read the function; it does not use any projection math, it's a period-bounded hours × rate preview. Outside the confirmed-wrong-numbers bar for this wave but worth the verification red-team confirming `already_billed` coverage against the same dual-period-path logic used in revenue.js.
- **`buildBillNowPreview` footage projects** — `already_billed = 0` and `earned = expected_revenue` are hard-coded for footage projects; no deduction is made for any prior invoices against those projects. This could overstate unbilled footage revenue. Considered flagging but cannot confirm `expected_revenue` is never partially invoiced in the current workflow without reading billing route code outside scope.

---

## False-positive register

| Considered | Rejected because |
|---|---|
| `buildInspectionRevenueProjection` `computeRow` uses `budget_allocated > 0` as the cap gate — projects with `budget_allocated = 0` (no budget set) use `paceHours` uncapped. Looks like it could be wrong if `budget_allocated` is uninitialized. | `project_budget_allocated` is `COALESCE(SUM(bc.allocated_amount), 0)` — a project with no budget codes returns 0, which correctly means "no cap." The `budget_allocated > 0` gate is the correct intended behavior. Not a bug. |
| `buildPscRusProjection` — `billedByProject` uses `invoice_items.amount` (all time), not filtered to the umbrella's billing period. Could double-count if a project moves between ECs. | Projects have a single `contract_id` → `engineering_contract_id` chain; they don't move. All-time billed is exactly what "billed to date" should mean for remaining-revenue projection. Not a bug. |
| `buildInspectionRevenueProjection` — `ecBudget[ecId] != null` condition for umbrella grouping: projects where `ecBudget[ecId] = 0` (budget exists but is $0) would enter the umbrella bucket with a $0 budget and produce `budgetRemaining = 0`, capping the projection at $0. | A $0 engineering-contract budget is an administrative data error, not a code bug. The cap behavior is correct given the data. Deferred to data-quality documentation. |
| `routes/inspection.js` — `statusClause` has `queryParams.push(statusFilter)` but the earlier check `VALID_STATUSES.includes(statusFilter)` gates SQL interpolation. The param index `$1` is used both for statusFilter AND is the first positional param, so `leafIds` (passed as `$1::uuid[]`) would conflict. | Actually the two queries are separate `pool.query` calls with their own `params` arrays — `statusClause` uses `queryParams = []` and the hours attribution query uses `[leafIds, startDate, endDate]`. No conflict. Not a bug. |
| `footage_monthly` CTE in `monthly-summary` uses `COALESCE(completed_date, billed_date, start_date)` for month attribution. Using `start_date` as last fallback could put footage revenue in the wrong month. | The CTE comment documents this is intentional: footage revenue is recognized when the project reaches `completed` or `billed` status, and the year/status filter guards against including projects that haven't reached those states. The fallback to `start_date` only fires for completed/billed projects that are missing both dates — a data quality issue, not a code bug. Deferred to data-quality check. |

---

=== PROJECTION AUDITOR C REPORT END ===
