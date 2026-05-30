-- Migration 0056 — Add DB-level CHECK constraint invariants
--
-- Two invariants currently enforced only at the application layer:
--   1. budgets.total_amount must be non-negative (routes/budgets.js F7 guard).
--   2. potential_permits.status must be one of the known status values
--      (routes/potential_permits.js ALLOWED_STATUSES guard).
--
-- Defense-in-depth: enforce at the DB so direct SQL writes, bulk imports,
-- or future endpoints that miss the validation cannot violate invariants.
--
-- Constraints are idempotent (DROP IF EXISTS then ADD) so this migration
-- is safe to re-run.
--
-- Status enum chosen INCLUSIVELY across all writers found in the codebase:
--   * routes/potential_permits.js ALLOWED_STATUSES = pending|approved|rejected|withdrawn
--   * public/permitting.html line 2013 writes status='accepted' on conversion path
--   * public/permitting.html filter dropdown + display uses 'accepted'
-- Union: pending, approved, accepted, rejected, withdrawn.
-- ('accepted' vs 'approved' frontend/backend disagreement is a separate latent
--  bug; the CHECK constraint accepts both to avoid breaking either path.)

BEGIN;

ALTER TABLE budgets
  DROP CONSTRAINT IF EXISTS budgets_total_amount_nonneg;

ALTER TABLE budgets
  ADD CONSTRAINT budgets_total_amount_nonneg
    CHECK (total_amount IS NULL OR total_amount >= 0);

ALTER TABLE potential_permits
  DROP CONSTRAINT IF EXISTS potential_permits_status_enum;

ALTER TABLE potential_permits
  ADD CONSTRAINT potential_permits_status_enum
    CHECK (
      status IS NULL OR status IN (
        'pending',
        'approved',
        'accepted',
        'rejected',
        'withdrawn'
      )
    );

COMMIT;
