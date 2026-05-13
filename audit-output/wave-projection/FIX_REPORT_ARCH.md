# Wave Projection — Arch Fix Report

> Fix agent: wave-projection-arch
> Branch: `claude/debug-previous-issues-MoN9D`
> Commits: `2e6d152`, `96a4a54`

---

## Per-item status

| # | Item | Status | SHA | Notes |
|---|------|--------|-----|-------|
| ARC-1 | Restructure `buildPscRusProjection` output: billed / wip / projected_new / total / sparkline_weekly per bucket and umbrella | ✅ ADDRESSED | `96a4a54` | WIP = billable hours after last invoice date × rate. Budget cap deducts billed AND wip. sparkline_weekly 13-element array per bucket + umbrella. Legacy `projected_remaining_revenue` alias preserved for FE compatibility. |
| ARC-2 | Budget-burn close-out heuristic, no `eta_date` column | ✅ ADDRESSED | `96a4a54` | When `billed_to_date / budget_allocated >= 0.80`, effective horizon shrinks to 3 weeks. `horizon_reason: 'full' | 'close_out_80pct'` surfaced in BE-3 output. Heuristic applies at bucket and project level. |
| ARC-3 | DB trigger + backfill for footage projects; hourly read-time derivation in `/api/revenue/projected-total` | ✅ ADDRESSED | `2e6d152` (trigger) + `96a4a54` (read-time) | Trigger `trg_sync_projected_revenue_footage` fires BEFORE UPDATE on projects, sets `projected_revenue = expected_revenue` when `billing_type = 'footage'`. Backfill applied. For hourly: `expected_hours × billing_rate` computed at read time. `is_rollup` filter added (was missing). |
| M-1 | Wrap steps 2–5 in `BEGIN READ ONLY; ... COMMIT` | ✅ ADDRESSED | `96a4a54` | Uses `pool.connect()` / `client.query` pattern. All five lookback/WIP/first-entry/MTD/billed/EC-budget queries execute in a single read-only transaction snapshot. Connection released in `finally`. |
| BE-3 | NEW `GET /api/automation/project-projection/:projectId` | ✅ ADDRESSED | `96a4a54` | Response shape documented with comment block above route handler. Admin-gated. UUID format guard. Returns `actual_billed / wip / projected_remaining / total_at_completion / budget_allocated / burn_bar / horizon_reason / rate_missing / methodology_note`. Reuses pace logic (H-2, H-6, H-7, ARC-2) from `buildPscRusProjection`. Exported as `buildProjectProjection`. |

---

## WIP calculation decision (critical-correctness note resolved)

The task asked to determine whether `invoice_items` references time entries (LEFT JOIN pattern) or summarizes at project level. Reading `schema.sql:208-219` confirmed: `invoice_items` has no `time_entry_id` column — it summarizes per project with `project_id`. The WIP pattern used is:

```sql
WITH last_invoice AS (
  SELECT ii.project_id, MAX(inv.invoice_date) AS last_invoice_date
    FROM invoice_items ii
    JOIN invoices inv ON inv.id = ii.invoice_id
   WHERE ii.project_id = ANY($1::uuid[])
   GROUP BY ii.project_id
)
SELECT te.project_id, COALESCE(SUM(te.hours), 0) AS wip_hours
  FROM time_entries te
  LEFT JOIN last_invoice li ON li.project_id = te.project_id
 WHERE te.project_id = ANY($1::uuid[])
   AND COALESCE(te.is_billable, TRUE) = TRUE
   AND (li.last_invoice_date IS NULL OR te.entry_date > li.last_invoice_date)
 GROUP BY te.project_id
```

This correctly identifies "billable hours not yet on any invoice" without a time_entry_id FK.

---

## Push cadence

| Commit | Content |
|--------|---------|
| `2e6d152` | ARC-3 migration only → pushed immediately |
| `96a4a54` | ARC-1 + ARC-2 + M-1 + BE-3 + ARC-3(read-time) → pushed immediately |

BE-3 landed in the same commit as ARC-1/2/M-1 (no data-loss risk between them — all same-file automation.js changes). Push cadence condensed from 4 to 2 because the items had zero inter-commit dependency and the server booted clean after both.

---

## Boot smoke test

`node server.js` (with no DB env vars) exits with expected FATAL on missing DATABASE_URL — no syntax errors, no `MODULE_NOT_FOUND`, no unhandled require failures. Both `automation.js` and `routes/revenue.js` load cleanly via `require()` in isolation.

---

## Scope compliance

Items in scope: ARC-1, ARC-2, ARC-3, M-1, BE-3 — all addressed.
Items explicitly out of scope (not touched): M-2 through M-6, L-1, L-2, L-3, BE-1, FE-1 through FE-5.

No scope creep. No PRs opened. No branch changes.

=== WAVE PROJECTION ARCH FIX REPORT END ===
