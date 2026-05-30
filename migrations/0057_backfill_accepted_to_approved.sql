-- Migration 0057: backfill potential_permits.status = 'accepted' to 'approved'
--
-- Wave 199 canonicalized the frontend on 'approved'. Wave 197 added a DB
-- CHECK accepting both transiently. This migration migrates legacy 'accepted'
-- rows to 'approved' so a follow-up wave can tighten the CHECK to drop
-- 'accepted' entirely.
--
-- Idempotent: re-running is a no-op once all rows are migrated.

UPDATE potential_permits
   SET status = 'approved'
 WHERE status = 'accepted';

-- Log how many rows changed for the deploy operator to verify.
DO $$
DECLARE
  remaining int;
BEGIN
  SELECT COUNT(*) INTO remaining FROM potential_permits WHERE status = 'accepted';
  RAISE NOTICE 'Wave 202B: % potential_permits rows still at status=accepted (expected 0)', remaining;
END $$;
