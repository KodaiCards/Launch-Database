-- Migration 0032: manual job-assignment table
--
-- Overrides the program_scope/for_*_client heuristic in GET /api/jobs
-- when at least one matching row exists.
--
-- Semantics: nullable scoping columns (client_id, engineering_contract_id, team)
-- let an assignment be scoped to any combination — just-client, just-EC, just-team,
-- or a tuple. A row pins one job to one scope combination.
--
-- Filter precedence in GET /api/jobs (see routes/jobs.js):
--   1. Resolve request scope (client_id, ec_id, team from query params).
--   2. Query job_assignments for rows whose scope overlaps the request
--      (NULL in the assignment means "any" — matches any request value for that axis).
--   3. If matching assignment rows exist → return ONLY those jobs. Heuristic bypassed.
--   4. If no matching rows → fall through to the existing program_scope heuristic.
--
-- The unique-pin index uses COALESCE with sentinel UUIDs/strings because Postgres
-- treats two NULLs as NOT equal in standard UNIQUE indexes, which would allow
-- inserting the same (job_id, NULL, NULL, NULL) row twice. PostgreSQL only
-- accepts expressions in CREATE UNIQUE INDEX, not in inline UNIQUE table
-- constraints — earlier version of this migration tried the latter and failed
-- with `syntax error at or near "("`. The unique-pin lives as a separate
-- expression index below.

CREATE TABLE IF NOT EXISTS job_assignments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                  uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id               uuid REFERENCES clients(id) ON DELETE CASCADE,
  engineering_contract_id uuid REFERENCES engineering_contracts(id) ON DELETE CASCADE,
  team                    text,
  created_at              timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT job_assignments_at_least_one_scope
    CHECK (client_id IS NOT NULL OR engineering_contract_id IS NOT NULL OR team IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS job_assignments_unique_pin
  ON job_assignments (
    job_id,
    COALESCE(client_id,               '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(engineering_contract_id, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(team, '')
  );

CREATE INDEX IF NOT EXISTS idx_job_assignments_job
  ON job_assignments(job_id);

CREATE INDEX IF NOT EXISTS idx_job_assignments_client
  ON job_assignments(client_id)
  WHERE client_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_job_assignments_ec
  ON job_assignments(engineering_contract_id)
  WHERE engineering_contract_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_job_assignments_team
  ON job_assignments(team)
  WHERE team IS NOT NULL;
