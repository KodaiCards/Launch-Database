-- migrations/0004_drop_project_types_table.sql — Phase 3b polish.
--
-- Goal: collapse the parallel project_types enum into the canonical
-- engineering_contracts.program enum. Before this migration the schema
-- had two independent program-classification mechanisms:
--
--   project_types          (id, name)             — 'BAU' | 'GF(R)' | 'RUS' | 'Other'
--   engineering_contracts.program (text)          — 'bau' | 'gfr'  | 'rus' | 'other'
--
-- pricing_entries was keyed on project_type_id (FK → project_types) and
-- projects carried both project_type_id (FK) and project_type (free text)
-- — three sources for the same idea. This migration:
--
--   1. Adds `program` to pricing_entries and to projects.
--   2. Backfills both columns from the existing project_types data.
--   3. Drops UNIQUE/FK constraints and the project_type_id columns.
--   4. Drops the project_types table.
--
-- The free-text `projects.project_type` column STAYS — but DON'T confuse
-- it with the new program enum. Historically `project_type` carried
-- legacy JOB-CATEGORY strings ('inspection', 'permitting', 're',
-- 'design', 'other') while `project_type_id` carried the program FK.
-- Confusing naming. After this migration:
--   • `program` (rus|bau|gfr|other) is the program classification.
--   • `project_type` (text) keeps its legacy job-category meaning and
--      is still read by legacy display paths and a couple of filters.
-- New rows: program is auto-derived from EC; project_type is a job-
-- category tag set by the project create flow based on the chosen job.
-- They are NOT lock-step.
--
-- The backfill below opportunistically reads project_type to recover
-- program for OLD rows where the user typed the program name into the
-- legacy column (rare but possible) — that's the only place these two
-- columns ever overlap.
--
-- Idempotent. Safe to re-run.

-- ─── 1. Add program column to pricing_entries ───────────────────────────
ALTER TABLE pricing_entries ADD COLUMN IF NOT EXISTS program VARCHAR(20);

-- Backfill from project_types.name (BAU → bau, GF(R) → gfr, RUS → rus, Other → other).
-- Idempotent: only updates rows where program IS NULL.
--
-- Wrapped in a "does the legacy table still exist?" guard. Existing
-- production DBs at the time this migration first applied did still
-- have project_types — that's why the backfill works there. Fresh DBs
-- created after the schema.sql cleanup never had project_types in the
-- first place, so we skip the UPDATE there. (This same migration file
-- runs fresh on those DBs because nothing has applied it yet.)
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'project_types'
      AND table_schema = 'public'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pricing_entries'
      AND column_name = 'project_type_id'
      AND table_schema = 'public'
  ) THEN
    UPDATE pricing_entries pe
       SET program = CASE LOWER(pt.name)
                       WHEN 'bau'   THEN 'bau'
                       WHEN 'gf(r)' THEN 'gfr'
                       WHEN 'rus'   THEN 'rus'
                       WHEN 'other' THEN 'other'
                       ELSE LOWER(pt.name)
                     END
      FROM project_types pt
     WHERE pe.project_type_id = pt.id
       AND pe.program IS NULL;
  ELSE
    RAISE NOTICE '[migration 0004] project_types table or pricing_entries.project_type_id absent — skipping legacy backfill (fresh DB or already-cleaned state).';
  END IF;
END
$migration$;

-- CHECK constraint mirrors engineering_contracts.program (drop-then-add for
-- single source of truth in this file).
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'pricing_entries'
      AND constraint_name = 'pricing_entries_program_check'
  ) THEN
    ALTER TABLE pricing_entries DROP CONSTRAINT pricing_entries_program_check;
  END IF;

  ALTER TABLE pricing_entries
    ADD CONSTRAINT pricing_entries_program_check
    CHECK (program IS NULL OR program IN ('rus','bau','gfr','other'));
END
$migration$;

-- Drop the old UNIQUE (job_id, project_type_id, billing_code) and replace
-- with UNIQUE (job_id, program, billing_code). Postgres auto-named the old
-- one but we look it up via information_schema to be defensive.
DO $migration$
DECLARE
  old_uq TEXT;
BEGIN
  SELECT constraint_name INTO old_uq
  FROM information_schema.table_constraints
  WHERE table_name = 'pricing_entries'
    AND constraint_type = 'UNIQUE'
    AND constraint_name LIKE '%project_type_id%';
  IF old_uq IS NOT NULL THEN
    EXECUTE 'ALTER TABLE pricing_entries DROP CONSTRAINT ' || quote_ident(old_uq);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '[migration 0004] old pricing_entries UNIQUE drop skipped: % (%)', SQLERRM, SQLSTATE;
END
$migration$;

-- New unique. NULLS NOT DISTINCT lets us treat (job_id, program, NULL billing_code)
-- as a single uniqueness slot — same behavior as the old constraint.
-- (Not all PG versions support NULLS NOT DISTINCT; we fall back to creating
-- an expression index that COALESCEs NULL to a sentinel string.)
DO $migration$
BEGIN
  EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uniq_pricing_entries_job_program_code
           ON pricing_entries (job_id, program, COALESCE(billing_code, ''__no_code__''))';
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[migration 0004] pricing_entries unique index create failed: % (%)', SQLERRM, SQLSTATE;
END
$migration$;

-- ─── 2. Add program column to projects + backfill ───────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS program VARCHAR(20);

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'projects'
      AND constraint_name = 'projects_program_check'
  ) THEN
    ALTER TABLE projects DROP CONSTRAINT projects_program_check;
  END IF;

  ALTER TABLE projects
    ADD CONSTRAINT projects_program_check
    CHECK (program IS NULL OR program IN ('rus','bau','gfr','other'));
END
$migration$;

-- Backfill projects.program in priority order:
--   (a) from the project's engineering contract, if attached
--   (b) from project_types via project_type_id (legacy DBs only)
--   (c) from the legacy free-text project_type column where it
--       happens to match a program label
UPDATE projects p
   SET program = ec.program
  FROM contracts c, engineering_contracts ec
 WHERE p.contract_id = c.id
   AND c.engineering_contract_id = ec.id
   AND ec.program IS NOT NULL
   AND p.program IS NULL;

-- Same legacy-table guard as the pricing backfill above.
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'project_types'
      AND table_schema = 'public'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects'
      AND column_name = 'project_type_id'
      AND table_schema = 'public'
  ) THEN
    UPDATE projects p
       SET program = CASE LOWER(pt.name)
                       WHEN 'bau'   THEN 'bau'
                       WHEN 'gf(r)' THEN 'gfr'
                       WHEN 'rus'   THEN 'rus'
                       WHEN 'other' THEN 'other'
                       ELSE LOWER(pt.name)
                     END
      FROM project_types pt
     WHERE p.project_type_id = pt.id
       AND p.program IS NULL;
  END IF;
END
$migration$;

UPDATE projects
   SET program = CASE LOWER(project_type)
                   WHEN 'bau'   THEN 'bau'
                   WHEN 'gf(r)' THEN 'gfr'
                   WHEN 'rus'   THEN 'rus'
                   WHEN 'other' THEN 'other'
                   ELSE NULL  -- legacy values like 'inspection', 'permitting', 'design' — those describe the JOB, not the program
                 END
 WHERE program IS NULL
   AND project_type IS NOT NULL;

-- ─── 3. Drop the FK columns and the project_types table ────────────────
-- Order matters: drop columns referencing project_types BEFORE dropping
-- the table. ON DELETE CASCADE on the FKs would handle this implicitly
-- on table drop, but being explicit is safer.
ALTER TABLE pricing_entries DROP COLUMN IF EXISTS project_type_id;
ALTER TABLE projects        DROP COLUMN IF EXISTS project_type_id;

DROP TABLE IF EXISTS project_types;

-- ─── 4. Index for program-scoped pricing lookups ───────────────────────
CREATE INDEX IF NOT EXISTS idx_pricing_entries_program ON pricing_entries (program);
CREATE INDEX IF NOT EXISTS idx_projects_program        ON projects (program) WHERE program IS NOT NULL;

-- ─── 5. Sanity log ─────────────────────────────────────────────────────
DO $log$
DECLARE
  pe_with_program  INT;
  pe_total         INT;
  proj_with_program INT;
  proj_total       INT;
BEGIN
  SELECT COUNT(*) INTO pe_total           FROM pricing_entries;
  SELECT COUNT(*) INTO pe_with_program    FROM pricing_entries WHERE program IS NOT NULL;
  SELECT COUNT(*) INTO proj_total         FROM projects;
  SELECT COUNT(*) INTO proj_with_program  FROM projects WHERE program IS NOT NULL;
  RAISE NOTICE '[migration 0004] pricing_entries: %/% have program. projects: %/% have program. project_types table dropped.',
               pe_with_program, pe_total, proj_with_program, proj_total;
END
$log$;
