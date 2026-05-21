-- Migration 0037: EC Job Visibility
--
-- Adds ec_job_visibility: explicit per-EC job allow-list.
--
-- Semantics (opt-in with legacy fallback):
--   No rows for an EC → picker falls back to legacy for_psc_client /
--   for_generic_client / program_scope filters. Existing ECs are unaffected
--   on day 1. Admins opt-in specific jobs per EC at their pace.
--
-- Job-visibility precedence for GET /api/engineering-contracts/:ecId/jobs:
--   1. job_assignments rows matching this EC / client override everything.
--   2. If no job_assignments match, ec_job_visibility rows are used.
--   3. If ec_job_visibility is empty, legacy global filters apply.
--
-- Construction-contract attachment (section B2 of WAVE_2_DESIGN.md):
--   No new table needed. contracts.engineering_contract_id (NULLABLE FK, added
--   migration 0031) is the storage mechanism. API endpoints set / clear that
--   column. If future design requires exclusive ownership, add UNIQUE on
--   contracts.engineering_contract_id and migrate null rows in a later migration.

CREATE TABLE IF NOT EXISTS ec_job_visibility (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  engineering_contract_id uuid        NOT NULL
                                      REFERENCES engineering_contracts(id)
                                      ON DELETE CASCADE,
  job_id                  uuid        NOT NULL
                                      REFERENCES jobs(id)
                                      ON DELETE CASCADE,
  created_at              timestamptz NOT NULL DEFAULT NOW(),
  created_by_user_id      uuid        REFERENCES users(id)
                                      ON DELETE SET NULL,
  UNIQUE (engineering_contract_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_ec_job_visibility_ec
  ON ec_job_visibility (engineering_contract_id);

CREATE INDEX IF NOT EXISTS idx_ec_job_visibility_job
  ON ec_job_visibility (job_id);

CREATE INDEX IF NOT EXISTS idx_ec_job_visibility_created_by
  ON ec_job_visibility (created_by_user_id)
  WHERE created_by_user_id IS NOT NULL;
