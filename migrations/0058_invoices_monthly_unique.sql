-- Migration 0058: monthly billing idempotency — coverage confirmation
--
-- Background:
--   Migration 0043 (2026-05-13) added period_year/period_month columns to
--   invoice_items plus a unique partial index
--     idx_invoice_items_project_period
--       ON invoice_items(project_id, period_year, period_month)
--       WHERE period_year IS NOT NULL AND period_month IS NOT NULL
--   This is the database-level guard that prevents double-billing the same
--   project for the same month. The `invoices` table itself has no
--   project_id / period_year / period_month columns (one invoice can span
--   many projects via invoice_items), so a constraint cannot be placed
--   directly on `invoices`.
--
-- Wave 205 (this migration):
--   Re-asserts the existing partial unique index with CREATE INDEX IF NOT
--   EXISTS so a fresh DB built from migrations sequentially has the guard
--   regardless of which migrations have already been applied. Also serves
--   as a checkpoint that audits the two prior code paths that bypassed
--   the guard by inserting NULL period_year/period_month into
--   invoice_items (now patched in routes/projects.js and routes/billing.js
--   to pass the period columns through so the unique index fires).
--
-- Idempotent: CREATE INDEX IF NOT EXISTS — safe to re-run.

CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_items_project_period
  ON invoice_items (project_id, period_year, period_month)
  WHERE period_year IS NOT NULL AND period_month IS NOT NULL;
