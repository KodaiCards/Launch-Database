-- Add period_year / period_month to invoice_items so the monthly-billing
-- idempotency guard can be enforced at the database level.
--
-- The bill-multiple endpoint receives (project_id, period_year, period_month)
-- per line item but previously discarded those values after using them to
-- filter time_entries. Storing them enables a unique partial index that
-- prevents a second POST for the same project+month from creating a duplicate
-- invoice item (and by extension a duplicate invoice).

ALTER TABLE invoice_items
  ADD COLUMN IF NOT EXISTS period_year  integer,
  ADD COLUMN IF NOT EXISTS period_month integer;

-- Unique partial index: only applies where both period columns are populated
-- (i.e. monthly-cadence billing). One-time invoices have NULLs and are
-- unaffected by this constraint (NULLs are never equal in a unique index).
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_items_project_period
  ON invoice_items(project_id, period_year, period_month)
  WHERE period_year IS NOT NULL AND period_month IS NOT NULL;
