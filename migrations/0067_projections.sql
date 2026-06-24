-- Migration 0067: Projections + completed→final lifecycle + bill_trigger
--
-- Supports docs/projections_design.md. ADDITIVE + idempotent.
--   service_area_jobs.bill_trigger  — 'progressive' (default) | 'completed'.
--       progressive = bills as work accrues (hourly monthly, footage by qty);
--       completed   = bills once at "completed" (build_finalized_at) — covers
--       build-complete fixed jobs AND close-out jobs (plant records, final inventory).
--   service_area_routes.closed_at / service_areas.closed_at — the "final" stage:
--       archived/immutable (read-only), set AFTER everything is billed. Not a
--       billing trigger; "completed" (build_finalized_at) is.
--
-- Projection base = each job's EXPECTED amount (footage/qty × rate, or
-- estimated_amount), set at creation — holds for RUS and non-RUS. The RUS
-- engineering budget (existing budgets table) is an overlay/pace view.

ALTER TABLE service_area_jobs
  ADD COLUMN IF NOT EXISTS bill_trigger varchar(20) NOT NULL DEFAULT 'progressive';

DO $$ BEGIN
  ALTER TABLE service_area_jobs
    ADD CONSTRAINT service_area_jobs_bill_trigger_check
    CHECK (bill_trigger IN ('progressive', 'completed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE service_area_routes ADD COLUMN IF NOT EXISTS closed_at timestamptz;
ALTER TABLE service_areas       ADD COLUMN IF NOT EXISTS closed_at timestamptz;
