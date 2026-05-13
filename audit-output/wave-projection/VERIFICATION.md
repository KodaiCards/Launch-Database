# Wave Projection — Verification Red-Team Report

## Stack snapshot

Verified against commit `e4d8880` on `claude/debug-previous-issues-MoN9D`. Primary files read in full: `automation.js` (50KB), `routes/revenue.js` (22KB), `routes/inspection.js` (17KB), `schema.sql` (50KB), `public/admin.html` (line-search on 465KB). All 20 canonical items opened at cited line ranges. ARC-2 required schema search — `eta_date` column does not exist anywhere in schema.

---

## Canonical item verifications

| Canonical # | Status | File:line | Snippet | Rationale |
|---|---|---|---|---|
| H-1 | VERIFIED | `automation.js` `buildBillNowPreview` `unbilled_hourly` CTE | `COALESCE(p.actual_hours, 0)::float * COALESCE(p.billing_rate, 0)::float AS earned` | Uses `actual_hours` (denormalized) not live `time_entries` SUM; ignores `manual_invoice_amount`; confirmed wrong vs. `revenue.js` unbilled pattern |
| H-2 | VERIFIED | `automation.js` `buildPscRusProjection` step 2 lookback | `FROM time_entries WHERE entry_date >= (CURRENT_DATE - ($1 \|\| ' weeks')::interval) AND project_id = ANY($2::uuid[])` | No `AND COALESCE(te.is_billable, TRUE) = TRUE` filter; non-billable hours inflate pace |
| H-3 | VERIFIED | `automation.js` `buildPscRusProjection` project query | `AND p.status IN ('active', 'billed')` | `'billed'` included in forward-looking pace; confirmed code has no exclusion of done projects |
| H-4 | VERIFIED | `automation.js` `buildInspectionRevenueProjection` `computeRow` | `const budgetHours = weighted_rate > 0 ? budgetRemaining / weighted_rate : Infinity;` then `const projHours = budget_allocated > 0 ? Math.min(paceHours, budgetHours) : paceHours;` | When `weighted_rate === 0`: `budgetHours = Infinity`, `projHours = paceHours`, `projRevenue = paceHours * 0 = 0`; silent garbage |
| H-5 | VERIFIED | `automation.js` `buildPscRusProjection` rate fallback | `const rates = bucketProjects.map(p => p.billing_rate \|\| 0).filter(r => r > 0);` then `if (rates.length) rate = rates.reduce(...)` else `rate = 0` | If ALL projects have `billing_rate = NULL/0`, `rates` is empty, `rate = 0`, bucket projects $0 with no warning flag |
| H-6 | VERIFIED | `automation.js` `buildPscRusProjection` step 2 + pace formula | `totalLookbackHrs / lookbackWeeks` always divides by `lookbackWeeks=8`; no check for project age or effective history length | New projects get pace divided by full 8 weeks regardless of when first entry was logged — confirmed no `effective_lookback_weeks` calculation exists |
| H-7 | VERIFIED | `automation.js` lookback/MTD CTEs | Step 2: `CURRENT_DATE - ($1 \|\| ' weeks')::interval`; Step 3: `date_trunc('month', CURRENT_DATE)` | Uses bare `CURRENT_DATE` (DB server UTC) not `(NOW() AT TIME ZONE 'America/Chicago')::date`; `dateInBusinessTz()` helper exists in same file but is not used in these queries |
| H-8 | VERIFIED | `automation.js` `buildInspectionRevenueProjection` `computeRow` | `const avgWeekly = lookbackWeeks > 0 ? hours_recent / lookbackWeeks : 0;` | `hours_recent` is the weighted sum (avg weight ~0.6 for uniform activity); denominator is raw `lookbackWeeks`; comment confirms `hours_recent_unweighted` exists for this purpose but is not used |
| ARC-1 | VERIFIED | `automation.js` `buildPscRusProjection` output shape | Returns single `projected_remaining_revenue` per bucket; `umbrellaProjected` accumulates all buckets into one number | No split into `billed/wip/projected_new`; WIP (logged-but-not-invoiced hours) not computed; budget cap subtracts only `billed_to_date` not WIP, allowing double-count |
| ARC-2 | FALSE-POSITIVE | `schema.sql` — `eta_date` column search | Column `eta_date` does not exist anywhere in `schema.sql`, migrations listing, or `projects` table DDL | `projects` table has `completed_date`, `billed_date`, `start_date` — no `eta_date`. The canonical's fix is valid as a new feature but the "current code uses eta_date" premise is wrong; it never existed. Fix-agent should ADD this column and then use it, not merely wire it up |
| ARC-3 | VERIFIED | `schema.sql` projects trigger block + backfill | Trigger block: only `projects_updated_at` fires `set_updated_at()` — no trigger syncing `projected_revenue` from `expected_revenue`. Backfill: `UPDATE projects SET projected_revenue = expected_revenue WHERE projected_revenue IS NULL AND billing_type = 'footage'` is a one-time copy only | No `BEFORE UPDATE` trigger on `projects` for `projected_revenue` sync; confirmed the backfill comment says "one-time copy". Gap is real |
| M-1 | VERIFIED | `automation.js` `buildPscRusProjection` steps 2–4 | Three separate `pool.query()` calls (lookback step 2, MTD step 3, billed step 4) with no wrapping transaction | Race window confirmed; no `BEGIN READ ONLY` wrapper exists |
| M-2 | VERIFIED | `automation.js` `buildPscRusProjection` permitting bucket | `const expected = bucketProjects.reduce((s, p) => s + (p.expected_revenue \|\| 0), 0);` | NULL `expected_revenue` silently collapses to 0; no coverage count surfaced in output |
| M-3 | VERIFIED | `routes/revenue.js` `/api/revenue/projected-total` | `AND p.status IN ('active', 'completed')` — `'billed'` excluded; `with_projected`/`without_projected` count in response but not shown inline on tile | Status filter confirmed; coverage counts exist in API response but frontend renders only in drilldown modal per JS analysis |
| M-4 | VERIFIED | `automation.js` `buildMonthlyBillingDraft` `already_billed` CTE | `WHERE i.billing_period_start = $1 AND i.billing_period_end = $2` — strict match only | No fallback to `invoice_date` year+month match; `revenue.js` unbilled monthly path has the dual-path logic (confirmed); billing draft does not |
| M-5 | VERIFIED | `automation.js` `buildPscRusProjection` / `admin.html:L706` | Code: `horizonWeeks = 13` (default); HTML: `<div class="stat-label">Next 90 Day Projection</div>` at admin.html line 706 | Label says "90 Day", code uses 13 weeks (91 days); mismatch confirmed |
| M-6 | VERIFIED | `routes/inspection.js` result composition | `if (hours === 0 && !p.is_ongoing && !p.is_permitting && p.status !== 'active' && !statusFilter) continue;` | `is_ongoing=TRUE` projects with 0 hours are kept; counted in `active_projects` accumulator: `if (p.status === 'active' \|\| p.is_ongoing) acc.active_projects++`; no `stale` flag |
| L-1 | VERIFIED | `automation.js` `buildInspectionRevenueProjection` `computeRow` | `will_exhaust_budget: budget_allocated > 0 && paceHours >= budgetHours` | Uses `>=` not `>`; at exact equality flag fires but no actual overrun occurs |
| L-2 | VERIFIED | `automation.js` `buildInspectionRevenueProjection` export | Function is fully implemented (~200 lines) and exported in `module.exports`; route `inspection-projection` now calls `buildPscRusProjection` | Legacy alias confirmed to call PSC RUS function; `buildInspectionRevenueProjection` is dead code with no `@deprecated` JSDoc and no `console.warn` |
| L-3 | VERIFIED (gap real) | `routes/revenue.js` `unbilled` one-time query | `WHERE p.billed_date IS NULL AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')` | Monthly projects with `billing_cadence IS NULL` could theoretically appear in both queues; `schema.sql` sets default `'one_time'` but old rows may have NULL; no in-code SQL verification exists |
| FE-1 | VERIFIED (location correct) | `public/admin.html` line 705–707 | `<div class="stat-card" ...><div class="stat-label">Next 90 Day Projection</div><div class="stat-value" id="s-90d-projection" ...><i class="fa-solid fa-screwdriver-wrench"...>UNDER CONSTRUCTION</div>` | UNDER CONSTRUCTION tile at correct location; id `s-90d-projection` exists for JS hookup |
| FE-2 | VERIFIED (location correct) | `public/admin.html` lines 766–773 | `<div id="psc-rus-projection-card" class="card lfs-widget" ... style="margin-bottom:14px;display:none">` containing `UNDER CONSTRUCTION` | `display:none` card confirmed at correct location; title shows "RUS Revenue Projection" — matches canonical delete+replace spec |
| FE-3 | VERIFIED (location correct) | `public/admin.html` lines 6347–6375 | `html += \`<div class="stat-card"...><div class="stat-label">Projected Revenue</div><div class="stat-value"...>UNDER CON...` (JS render function, two occurrences) | Both hourly and footage branches render UNDER CONSTRUCTION; correct locations for fix-agent to target |
| FE-4 | VERIFIED (gap real) | `public/admin.html` Settings section | No "Projection Data Quality" panel exists in settings HTML; settings section confirmed at lines 2433+ with jobs/clients/contracts panels but no projection-quality panel | New work; location for insertion confirmed |
| FE-5 | VERIFIED (gap real) | All 3 tile locations | No `title` attribute or `?` tooltip element exists on any of the 3 UNDER CONSTRUCTION tiles | New work required |
| BE-1 | VERIFIED (gap real) | `automation.js` route list | `installAutomationRoutes` registers: digest, stale-permits, budget-burn, permits-awaiting-invoice, bill-now-preview, psc-rus-projection, inspection-projection (legacy), billing-draft/monthly — no `/api/automation/projection-data-quality` | New endpoint required |
| BE-2 | VERIFIED (gap real) | `automation.js` `buildPscRusProjection` return shape | Returns `{lookback_weeks, horizon_weeks, horizon_days, umbrella_count, total_projected_revenue, rows[]}` — no `billed/wip/projected_new` split | Output shape change required per ARC-1 |
| BE-3 | VERIFIED (gap real) | `automation.js` route list | No `/api/automation/project-projection/:projectId` route exists | New endpoint required |

---

## ARC-2 clarification

**ARC-2 status: FALSE-POSITIVE on the "current code uses eta_date" premise — but the fix direction is still correct.**

The canonical says "per-project `effective_horizon = MIN(global_horizon_weeks, weeks_until_eta_date)` where `eta_date IS NOT NULL`." The `eta_date` column does not exist in the schema. `projects` table has `completed_date`, `billed_date`, `start_date` — nothing called `eta_date`. The fix-agent must: (a) add a migration to add `eta_date DATE` to `projects`, (b) then implement the effective-horizon logic referencing it. The underlying problem (13-week extrapolation even for projects completing in 3 weeks) is real and the fix approach is correct — the column just needs to be created first.

---

## Deferral cross-checks

| Deferred item | Status | Rationale |
|---|---|---|
| EVM (earned-value management) | CONFIRMED-OK | Requires planned schedules per project; `projects` table has no schedule/milestone columns. Deferral justified |
| Monte Carlo confidence bands | CONFIRMED-OK | No variance data stored per project or per week. Current data supports only point estimates. Deferral justified |
| Materialized view / cached projection | CONFIRMED-OK | No `projection_cache` table in schema; current query volume is on-demand only. Deferral justified |
| Per-WO# breakdown | CONFIRMED-OK | `time_entries` schema confirmed: columns are `id, project_id, staff_id, entry_date, hours, job_title, notes, import_batch, is_billable, unbilled_category, created_at`. No WO# column. `projects` has `work_order_number` but it's EC-level grouping, not per-entry. Deferral is accurate |
| Multi-program projection (BAU/GFR/Other) | CONFIRMED-OK | `buildPscRusProjection` correctly gates on `ec.program = 'rus'`. Other programs have no equivalent budget infrastructure in schema. Deferral justified |

---

## New findings

| # | Severity | File:line | Issue | Why this wasn't in canonical |
|---|---|---|---|---|
| NF-1 | MEDIUM | `automation.js` `buildPscRusProjection` step 2 | H-2 canonical correctly identifies the `is_billable` filter is missing from the **lookback** CTE. However, the same missing filter also applies to `buildInspectionRevenueProjection`'s `recent_hours` CTE — that CTE also omits `AND COALESCE(te.is_billable, TRUE) = TRUE`. The canonical's H-2 fix shape mentions applying to `buildInspectionRevenueProjection` too, so this is a reminder note, not a new finding. **Omit from fix scope** — covered by H-2. | Canonical already names both functions in H-2 fix shape; including for completeness |
| NF-2 | LOW | `automation.js` `buildBillNowPreview` footage branch | `unbilled_footage` CTE computes `already_billed = 0::float` hardcoded for footage projects, with no deduction for any prior partial invoices. A footage project billed at 50% via a manual invoice would still appear with `unbilled_amount = expected_revenue` (full amount). Auditor C flagged this as a coverage gap; it is a real edge-case but requires understanding the footage billing workflow to assess severity. Low risk if footage projects are always billed in a single transaction. | Auditor C noted in coverage gaps but didn't flag as a finding; worth the fix-agent noting |

---

## Coverage gaps

- `admin.html` JS functions `loadDashboard`, `loadRevenue`, and the project drilldown render functions were searched by pattern; exact function bodies were not line-traced due to file size. Line numbers confirmed by pattern search. Fix-agent should trace the JS call chain when wiring new endpoints.
- `routes/projects.js` (38KB) not read — the ARC-3 fix requires verifying the project edit endpoint calls `calcProjectFinancials` for footage projects. Fix-agent should check this before writing the trigger migration.
- Migration files (0001–0029) not read individually; schema column inventory taken from `schema.sql` which includes all `ALTER TABLE ADD COLUMN IF NOT EXISTS` blocks.

=== WAVE PROJECTION VERIFICATION END ===
