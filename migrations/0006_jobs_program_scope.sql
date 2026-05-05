-- migrations/0006_jobs_program_scope.sql
--
-- Replaces the for_psc_client / for_generic_client boolean pair on `jobs`
-- with a single `program_scope` enum (rus | non_rus | shared). Owner asked
-- for cleaner segregation in the dropdowns: a RUS-program project shows
-- only RUS-scope (or shared) jobs; a non-RUS project shows only non-RUS
-- (or shared) jobs.
--
-- The legacy boolean columns are KEPT for one release window so any
-- code that hasn't been updated yet keeps working. They'll be dropped
-- in a follow-up migration after the codebase fully migrates over.
--
-- Idempotent. Safe to re-run.

-- ─── 1. Add the program_scope column ───────────────────────────────────
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS program_scope VARCHAR(20);

-- CHECK constraint mirrors the enum + the application-layer validators.
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'jobs'
      AND constraint_name = 'jobs_program_scope_check'
  ) THEN
    ALTER TABLE jobs DROP CONSTRAINT jobs_program_scope_check;
  END IF;

  ALTER TABLE jobs
    ADD CONSTRAINT jobs_program_scope_check
    CHECK (program_scope IS NULL OR program_scope IN ('rus','non_rus','shared'));
END
$migration$;

-- ─── 2. Backfill from existing flags ───────────────────────────────────
-- Mapping (idempotent — only updates rows where program_scope IS NULL):
--   for_psc_client=TRUE  AND for_generic_client=TRUE  → 'rus'
--                        (Permitting trio: DOT/County/RR — they have
--                         RUS billing codes so they're RUS-anchored
--                         in the new model. If owner wants them shared
--                         later, flip in Settings.)
--   for_psc_client=TRUE  AND for_generic_client=FALSE → 'rus'
--   for_psc_client=FALSE AND for_generic_client=TRUE  → 'non_rus'
--   for_psc_client=FALSE AND for_generic_client=FALSE → 'shared'
--                        (defensive — historically rare; means admin-only
--                         or unscoped. Treat as shared so they don't
--                         disappear from every dropdown.)
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'for_psc_client'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'for_generic_client'
  ) THEN
    UPDATE jobs
       SET program_scope = CASE
                             WHEN for_psc_client     THEN 'rus'
                             WHEN for_generic_client THEN 'non_rus'
                             ELSE 'shared'
                           END
     WHERE program_scope IS NULL;
  ELSE
    -- Fresh DB without the legacy flags — default everything to 'shared'.
    UPDATE jobs SET program_scope = 'shared' WHERE program_scope IS NULL;
  END IF;
END
$migration$;

-- ─── 3. Index for filtered job lookups ─────────────────────────────────
-- Hot path: the project-create dropdown filters by program_scope on
-- every modal open.
CREATE INDEX IF NOT EXISTS idx_jobs_program_scope ON jobs (program_scope) WHERE active = TRUE;

-- ─── 4. Sanity log ─────────────────────────────────────────────────────
DO $log$
DECLARE
  rus_count INT;
  non_rus_count INT;
  shared_count INT;
  null_count INT;
BEGIN
  SELECT COUNT(*) INTO rus_count     FROM jobs WHERE program_scope = 'rus';
  SELECT COUNT(*) INTO non_rus_count FROM jobs WHERE program_scope = 'non_rus';
  SELECT COUNT(*) INTO shared_count  FROM jobs WHERE program_scope = 'shared';
  SELECT COUNT(*) INTO null_count    FROM jobs WHERE program_scope IS NULL;
  RAISE NOTICE '[migration 0006] jobs.program_scope: rus=%, non_rus=%, shared=%, null=%.',
               rus_count, non_rus_count, shared_count, null_count;
END
$log$;
