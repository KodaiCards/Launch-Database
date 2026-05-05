-- migrations/0003_drop_clients_is_rus.sql — finish the Path B refactor.
--
-- Background: clients.is_rus was originally treated as a program
-- classification ("this client does RUS work"). Path B (migration 0002)
-- moved the source of truth to engineering_contracts.program. Phase 1
-- of the polish cleanup drained every read of clients.is_rus from the
-- application code; this migration drops the column itself.
--
-- Safety:
--   • Phase 1 already removed every code path that READS the column.
--   • show_contract / show_work_order are no longer derived from is_rus
--     — those columns hold their own values now (one-time backfill on
--     a prior boot already ran).
--   • Idempotent via DROP COLUMN IF EXISTS.
--
-- After this runs, clients carries only identity (id/name/notes/
-- show_contract/show_work_order/created_at). Program classification
-- lives exclusively on engineering_contracts.program.

ALTER TABLE clients DROP COLUMN IF EXISTS is_rus;

-- Sanity log so the boot log carries a clear record of what happened.
DO $log$
DECLARE
  has_col BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'is_rus'
  ) INTO has_col;
  IF has_col THEN
    RAISE WARNING '[migration 0003] clients.is_rus column still present after DROP — investigate.';
  ELSE
    RAISE NOTICE '[migration 0003] clients.is_rus dropped (or already absent). Path B cleanup complete.';
  END IF;
END
$log$;
