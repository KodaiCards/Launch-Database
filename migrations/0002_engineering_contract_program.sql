-- migrations/0002_engineering_contract_program.sql — Path B refactor.
--
-- Background: the system mistakenly modeled "RUS work" at the CLIENT level
-- (clients.is_rus). In reality, RUS is a government-program designation
-- that lives at the engineering-contract level. PSC (the client) has BOTH
-- RUS work (under the "RUS 217 Engineering Contract GA 1706 - A72"
-- umbrella) AND ordinary non-RUS work — same client, two completely
-- different billing/reporting regimes.
--
-- This migration introduces engineering_contracts.program — the canonical
-- per-contract program classification used to gate RUS-specific behaviors
-- (PSC RUS PDF format, RUS projection, RUS inspection scope, RUS pricing
-- defaults). clients.is_rus is preserved for backward compat as a hint
-- ("this client does at least some RUS work") but is no longer used to
-- gate program-specific rendering.
--
-- Idempotent. Safe to re-run.

-- ─── 1. Add the program column ───────────────────────────────────────────
-- Allowed values:
--   'rus'   — USDA Rural Utilities Service work. Triggers the PSC RUS
--             invoice template, the dedicated projection/inspection tab,
--             and the RUS-specific job/billing-code defaults.
--   'bau'   — Business-as-usual private fiber work. Standard hourly/footage
--             billing, generic invoice template.
--   'gfr'   — GF(R) program (a separate fiber-build category).
--   'other' — Anything else (pilot programs, one-off engagements). Generic
--             treatment unless a specific template is uploaded.
ALTER TABLE engineering_contracts
  ADD COLUMN IF NOT EXISTS program VARCHAR(20);

-- CHECK constraint added separately so re-runs don't fail when the column
-- already exists with the constraint. We drop-then-add to keep the wording
-- in this file authoritative.
DO $migration$
BEGIN
  -- Drop any prior version of the constraint so we can keep its definition
  -- here (single source of truth).
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'engineering_contracts'
      AND constraint_name = 'engineering_contracts_program_check'
  ) THEN
    ALTER TABLE engineering_contracts
      DROP CONSTRAINT engineering_contracts_program_check;
  END IF;

  ALTER TABLE engineering_contracts
    ADD CONSTRAINT engineering_contracts_program_check
    CHECK (program IS NULL OR program IN ('rus','bau','gfr','other'));
END
$migration$;

-- ─── 2. Backfill existing rows ───────────────────────────────────────────
-- Heuristic for one-time backfill:
--   • Engineering contract whose name contains 'RUS' (case-insensitive)
--     → program = 'rus'
--   • Engineering contract whose loan_name is non-NULL
--     → program = 'rus' (loan-financed work is RUS in this shop's world)
--   • Otherwise leave NULL — admin sets it explicitly in Settings.
-- Only updates rows where program IS NULL so re-runs preserve manual edits.
UPDATE engineering_contracts
   SET program = 'rus'
 WHERE program IS NULL
   AND (
        name ILIKE '%rus%'
     OR loan_name IS NOT NULL
   );

-- ─── 3. Index for program-scoped queries ─────────────────────────────────
-- Projection and inspection both filter by program; this is hot-path.
CREATE INDEX IF NOT EXISTS idx_engineering_contracts_program
  ON engineering_contracts (program)
  WHERE program IS NOT NULL;

-- ─── 4. Sanity-log what we backfilled ────────────────────────────────────
-- Owner can grep server boot logs for this notice to see what changed.
DO $log$
DECLARE
  rus_count INT;
  null_count INT;
BEGIN
  SELECT COUNT(*) INTO rus_count   FROM engineering_contracts WHERE program = 'rus';
  SELECT COUNT(*) INTO null_count  FROM engineering_contracts WHERE program IS NULL;
  RAISE NOTICE '[migration 0002] engineering_contracts.program: % rows = rus, % rows still NULL (admin must set).',
               rus_count, null_count;
END
$log$;
