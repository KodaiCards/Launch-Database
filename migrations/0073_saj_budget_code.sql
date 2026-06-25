-- Migration 0073: link keystone jobs to RUS budget codes (budgets rework #4).
--
-- docs/budgets_design.md: the legacy budget feature computed "spent" from the
-- retiring projects tree (projects.budget_code_id). Re-point it onto the keystone
-- so a service_area_job draws against a budget code, and utilization can be built
-- on the billing ledger (billed) + projection (expected) per code. ADDITIVE + idempotent.

ALTER TABLE service_area_jobs ADD COLUMN IF NOT EXISTS budget_code_id uuid REFERENCES budget_codes(id);
CREATE INDEX IF NOT EXISTS idx_saj_budget_code ON service_area_jobs (budget_code_id);
