# Wave Projection — Medium + Low Fix Report

> Fix agent: Claude (Sonnet 4.6)
> Branch: `claude/debug-previous-issues-MoN9D`
> Session: 2026-05-13 (Wave Projection cleanup tier)

---

## Per-item status table

| # | Item | Status | SHA | Notes |
|---|---|---|---|---|
| M-2 | Surface NULL `expected_revenue` permitting projects via BE-1 | ADDRESSED | `e900fc0` | BE-1 List 2 returns permitting projects with NULL expected_revenue. No projection math changes per spec. |
| M-3 | `/api/revenue/projected-total`: add `'billed'` exclusion comment + coverage caveat | ADDRESSED | `2f111f5` | 5-line comment block added explaining open-pipeline intent. `coverage_note` field was already present from arch wave. |
| M-4 | `buildMonthlyBillingDraft` `already_billed` CTE: two-branch match for legacy NULL `billing_period_start` | ADDRESSED | `634cd9b` | Strict period match + fallback `invoice_date` year+month match. Mirrors revenue.js monthly CTE pattern. |
| M-5 | Rename "Next 90 Day Projection" tile → "RUS Next 13 Weeks" + MTD sub-label | ADDRESSED | `2f111f5` | admin.html tile label updated. Sub-label element `#s-90d-mtd-label` added. Frontend rendering is FE wave. |
| M-6 | `routes/inspection.js`: add `stale:true` flag + exclude from `active_projects` count | ADDRESSED | `995a0a2` | `stale = p.is_ongoing && hours === 0` set per project. `active_projects` reducer now checks `!p.stale`. |
| L-1 | `will_exhaust_budget`: change `>=` to `>` | ADDRESSED (already applied) | `529c476` | The math fix wave already applied the `>` operator. This wave added a clarifying comment to document the intent. See `995a0a2`. |
| L-2 | `buildInspectionRevenueProjection`: add `@deprecated` JSDoc + `console.warn` on first call | ADDRESSED | `00e04d0` | JSDoc `@deprecated` added above function. Module-level `_inspectionProjectionWarnedOnce` guard + `console.warn` on first invocation. |
| L-3 | Verify `SELECT COUNT(*) FROM projects WHERE billing_cadence IS NULL AND status='active'` | DEFERRED — DB unavailable | `00e04d0` | No Railway credentials in agent environment. Cannot run the live count. Comment added in `routes/revenue.js` at the `billing_cadence IS NULL` usage explaining: NULL cadence is safely routed to the one-time queue (correct behavior, no double-bill risk). Provides the UPDATE statement and instructs to record the count when DB access is available. |
| BE-1 | `GET /api/automation/projection-data-quality` (admin-gated, 5 lists) | ADDRESSED | `e900fc0` | Full endpoint implemented in `automation.js` inside `installAutomationRoutes`. 5 queries, full response schema in comment block above handler. |

---

## L-3 SQL result count

**Count: NOT RUN** — no database credentials in agent environment (no `.env` / Railway vars).

The `billing_cadence IS NULL` rows are handled safely in the existing unbilled
query: `(p.billing_cadence IS NULL OR p.billing_cadence = 'one_time')` routes
them to the one-time queue rather than the monthly queue. This is correct
behavior — a NULL row will not be double-billed. When DB access is available,
run:

```sql
SELECT COUNT(*) FROM projects WHERE billing_cadence IS NULL AND status='active';
```

If > 0:
```sql
UPDATE projects SET billing_cadence = 'one_time'
WHERE billing_cadence IS NULL;
```

Record the count in the comment at `routes/revenue.js` line ~432.

---

## Commit SHAs

| Commit | Content |
|---|---|
| `2f111f5` | M-3 + M-5: projected-total billed exclusion comment + tile label refactor |
| `634cd9b` | M-4: buildMonthlyBillingDraft already_billed CTE — legacy invoice fallback |
| `995a0a2` | M-6 + L-1: inspection stale flag + will_exhaust_budget comment |
| `00e04d0` | L-2 + L-3: deprecate buildInspectionRevenueProjection + billing_cadence comment |
| `e900fc0` | BE-1: GET /api/automation/projection-data-quality — admin data-quality endpoint |

---

## BE-1 response schema (summary)

```
GET /api/automation/projection-data-quality

{
  as_of: ISO timestamp,
  lists: {
    null_or_zero_rate:     [{project_id, name, client_name, ec_name, billing_type, status, suggested_action}],
    null_expected_revenue: [{project_id, name, client_name, ec_name, billing_type, status, suggested_action}],
    stale_footage_revenue: [{project_id, name, client_name, ec_name, billing_type, status, suggested_action}],
    sparse_history:        [{project_id, name, client_name, ec_name, billing_type, status, distinct_weeks, suggested_action}],
    ec_no_budget:          [{ec_id, ec_name, client_name, program, suggested_action}],
  },
  summary: {
    null_or_zero_rate_count, null_expected_revenue_count,
    stale_footage_revenue_count, sparse_history_count,
    ec_no_budget_count, total_issues
  }
}
```

---

## Adjacent observations (not committed)

- The `buildInspectionRevenueProjection` deprecation comment references "next cleanup wave" — when that wave runs, verify no external tests or scripts import it before removing.
- `#s-90d-mtd-label` sub-label element is wired in HTML but will show "MTD: — hrs | 13-wk pace: pending" until the FE rendering wave populates it via the existing `/api/automation/psc-rus-projection` response shape.

=== WAVE PROJECTION MED FIX REPORT END ===
