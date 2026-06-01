-- Migration 0062: Rollup integrity hardening (W246)
--
-- Background (W245-A audit + W245-B forensic verification):
--   Duplicate Contract / Service-Area rollup folders accumulated in the admin
--   Projects tree because:
--     (1) idx_projects_rollup (added in migration 0045 / 0049 era) is a NON-
--         UNIQUE partial index — application-layer findOrCreateRollup has a
--         TOCTOU race window with no DB safety net under it.
--     (2) Several INSERT paths (bulk_create_projects in routes/ai.js, admin
--         POST /api/projects with manual is_rollup=true) created rollup rows
--         WITHOUT populating rollup_level / rollup_key. Those orphan rollups
--         can never be deduped by subsequent cascade calls (which look up by
--         level+key).
--     (3) contracts table has no UNIQUE on (client_id, contract_number) —
--         duplicate contracts → duplicate contract-level rollups.
--
-- This migration:
--   A. Backfills NULL rollup_key / rollup_level on existing rollup rows where
--      derivable. Orphans that can't be derived get rollup_level='legacy_orphan'
--      so the new unique index excludes them.
--   B. Adds partial UNIQUE index uniq_rollup_per_parent on
--      (parent_id, rollup_key, rollup_level) WHERE is_rollup=TRUE AND
--      rollup_level <> 'legacy_orphan'. Cancels future duplicate creation.
--   C. Adds CHECK constraint requiring rollup rows to carry level+key
--      (legacy_orphan rows pre-date this rule and are exempt via the index).
--   D. Adds UNIQUE on contracts(client_id, contract_number) if absent.
--
-- Idempotent: every step wrapped in IF NOT EXISTS / EXCEPTION-handled DO
-- blocks. Re-running on a partially-applied state is safe.

BEGIN;

-- ─── A. Backfill NULL rollup_level / rollup_key on existing rollup rows ──────
--
-- Goal: every rollup row should have BOTH rollup_level and rollup_key, OR be
-- marked 'legacy_orphan' so the new unique index ignores it.
--
-- Strategy: mark as 'legacy_orphan' any rollup row that is missing EITHER
-- column. These are the orphan rows from routes/ai.js bulk_create_projects
-- and admin manual is_rollup=true POSTs. They CAN'T be retroactively assigned
-- correct level+key without business-context decisions, so we exempt them
-- from the new constraint and leave them in place. Carter can manually
-- consolidate later via the admin UI.

UPDATE projects
   SET rollup_level = 'legacy_orphan'
 WHERE is_rollup = TRUE
   AND (rollup_level IS NULL OR rollup_key IS NULL);

-- Also handle the inverse case: rows with level/key but NULL key text.
-- COALESCE to a deterministic marker so the index doesn't index NULL keys.
UPDATE projects
   SET rollup_key = id::text
 WHERE is_rollup = TRUE
   AND rollup_level = 'legacy_orphan'
   AND rollup_key IS NULL;

-- ─── B. Partial UNIQUE index — the real safety net ──────────────────────────
--
-- Future rollup creation through any code path (findOrCreateRollup, AI bulk
-- insert, admin POST, migration 0040/0041 re-runs) now collides at the DB
-- level if a duplicate (parent_id, rollup_key, rollup_level) appears.
--
-- findOrCreateRollup already catches 23505 and re-SELECTs the winner — this
-- index makes that branch fire reliably instead of being dead code.

CREATE UNIQUE INDEX IF NOT EXISTS uniq_rollup_per_parent
  ON projects (COALESCE(parent_id::text, 'ROOT'), rollup_level, rollup_key)
  WHERE is_rollup = TRUE AND rollup_level <> 'legacy_orphan';

-- ─── C. CHECK constraint — enforce level+key going forward ──────────────────
--
-- legacy_orphan rows are grandfathered via the rollup_level check; new rollup
-- rows must carry both level and key.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'projects_rollup_level_key_required'
  ) THEN
    ALTER TABLE projects
      ADD CONSTRAINT projects_rollup_level_key_required
      CHECK (
        is_rollup IS NOT TRUE
        OR rollup_level = 'legacy_orphan'
        OR (rollup_level IS NOT NULL AND rollup_key IS NOT NULL)
      ) NOT VALID;
  END IF;
EXCEPTION WHEN duplicate_object THEN
  -- Already added in a prior partial run — no-op.
  NULL;
END $$;

-- VALIDATE separately so the ADD CONSTRAINT doesn't error on legacy rows
-- that slipped through the backfill (defense in depth).
DO $$
BEGIN
  ALTER TABLE projects
    VALIDATE CONSTRAINT projects_rollup_level_key_required;
EXCEPTION WHEN check_violation THEN
  -- A row still violates — leave constraint NOT VALID so future inserts are
  -- still checked but the legacy row isn't blocking the migration. Carter
  -- can investigate via:
  --   SELECT id, name, parent_id, rollup_level, rollup_key FROM projects
  --   WHERE is_rollup=TRUE AND rollup_level<>'legacy_orphan'
  --     AND (rollup_level IS NULL OR rollup_key IS NULL);
  RAISE NOTICE 'projects_rollup_level_key_required left NOT VALID — legacy rows survive';
END $$;

-- ─── D. UNIQUE on contracts(client_id, contract_number) ─────────────────────
--
-- Duplicate contracts (same client, same number) cascade into duplicate
-- contract-level rollup folders. This is the upstream fix.
--
-- Skip if pre-existing duplicates would block the constraint — let Carter
-- consolidate manually first, but surface the issue via NOTICE.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
     WHERE schemaname = 'public'
       AND indexname = 'uniq_contracts_client_number'
  ) THEN
    BEGIN
      CREATE UNIQUE INDEX uniq_contracts_client_number
        ON contracts (client_id, contract_number)
        WHERE client_id IS NOT NULL;
    EXCEPTION WHEN unique_violation THEN
      RAISE NOTICE 'uniq_contracts_client_number creation deferred — pre-existing duplicates. Investigate via: SELECT client_id, contract_number, COUNT(*) FROM contracts GROUP BY 1,2 HAVING COUNT(*)>1;';
    END;
  END IF;
END $$;

COMMIT;
