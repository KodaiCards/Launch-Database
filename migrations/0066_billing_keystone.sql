-- Migration 0066: Billing → keystone (service-area / progressive-ledger billing)
--
-- Moves billing off the retiring `projects` tree onto the service-area model and
-- supports the progressive, reconcilable ledger (design: docs/billing_keystone_design.md).
-- ADDITIVE + idempotent only — new nullable columns, defaulted column, one new
-- table. Legacy project-based invoices keep working untouched during cutover.
--
-- What this reserves (behavior built in routes/billing_keystone.js):
--   invoices.service_area_id / engineering_contract_id  — clean per-SA / per-EC /
--       per-program revenue attribution (retires the task-34 client-level fallback)
--   invoice_items.service_area_job_id                   — a line traces to its keystone job
--   invoice_items.line_kind ('charge'|'reconciliation') — credits/true-ups vs charges
--   billing_period_close                                — informational "month closed" tag
--       (auto after the 10th of the following month / manual); never locks editing.
--
-- Ledger model: each run bills (earned_to_date − already_billed_to_date) per job.
-- "already billed" is DERIVED by summing a job's non-void invoice_items — so there
-- is no per-entry billed flag to keep in sync, and corrections fall out as negative
-- (reconciliation) lines automatically. invoices.billing_period_start/_end and
-- invoice_items.period_year/_month already exist (used for the period stamp).

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS service_area_id uuid REFERENCES service_areas(id),
  ADD COLUMN IF NOT EXISTS engineering_contract_id uuid REFERENCES engineering_contracts(id);

ALTER TABLE invoice_items
  ADD COLUMN IF NOT EXISTS service_area_job_id uuid REFERENCES service_area_jobs(id),
  ADD COLUMN IF NOT EXISTS line_kind varchar(20) NOT NULL DEFAULT 'charge';

DO $$ BEGIN
  ALTER TABLE invoice_items
    ADD CONSTRAINT invoice_items_line_kind_check
    CHECK (line_kind IN ('charge', 'reconciliation'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS billing_period_close (
  period_month date PRIMARY KEY,           -- first-of-month for the closed period
  closed_at timestamptz NOT NULL DEFAULT now(),
  closed_by_user_id uuid
);

CREATE INDEX IF NOT EXISTS idx_invoices_service_area ON invoices (service_area_id);
CREATE INDEX IF NOT EXISTS idx_invoices_engineering_contract ON invoices (engineering_contract_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_sa_job ON invoice_items (service_area_job_id);
