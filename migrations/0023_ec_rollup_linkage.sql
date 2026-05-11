-- 0023_ec_rollup_linkage.sql — direct EC FK on projects.
-- Adds engineering_contract_id so rollup folders and leaf projects
-- have a direct FK to their umbrella EC. Previously only derivable
-- via projects.contract_id → contracts.engineering_contract_id,
-- which was fragile for rollups (no contract_id) and leaves with
-- NULL contract_id.
-- Idempotent. Safe to re-run.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS engineering_contract_id
  UUID REFERENCES engineering_contracts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_engineering_contract_id
  ON projects (engineering_contract_id)
  WHERE engineering_contract_id IS NOT NULL;

-- Pass 1: leaf projects with contract_id (unambiguous)
UPDATE projects p
   SET engineering_contract_id = c.engineering_contract_id
  FROM contracts c
 WHERE p.contract_id = c.id
   AND p.is_rollup = FALSE
   AND p.engineering_contract_id IS NULL
   AND c.engineering_contract_id IS NOT NULL;

-- Pass 2: leaf projects without contract_id but single-EC client (best-guess)
UPDATE projects p
   SET engineering_contract_id = (
     SELECT ec.id FROM engineering_contracts ec
     WHERE ec.client_id = p.client_id
       AND ec.program = p.program
     GROUP BY ec.id HAVING COUNT(*) = 1
     LIMIT 1
   )
 WHERE p.is_rollup = FALSE
   AND p.contract_id IS NULL
   AND p.program IS NOT NULL
   AND p.engineering_contract_id IS NULL;

-- Pass 3: team/service-area rollups whose leaf descendants all share one EC
WITH RECURSIVE rollup_tree AS (
  SELECT r.id AS rollup_id, r.id AS node_id, r.parent_id, r.is_rollup, r.engineering_contract_id
  FROM projects r
  WHERE r.is_rollup = TRUE AND r.rollup_level IN ('team', 'service_area')
  UNION ALL
  SELECT rt.rollup_id, p.id, p.parent_id, p.is_rollup, p.engineering_contract_id
  FROM projects p
  JOIN rollup_tree rt ON p.parent_id = rt.node_id
),
rollup_ec_counts AS (
  SELECT rollup_id, engineering_contract_id, COUNT(*) AS leaf_count
  FROM rollup_tree
  WHERE is_rollup = FALSE AND engineering_contract_id IS NOT NULL
  GROUP BY rollup_id, engineering_contract_id
),
rollup_unique_ec AS (
  SELECT rollup_id, (array_agg(engineering_contract_id))[1] AS ec_id
  FROM rollup_ec_counts
  GROUP BY rollup_id
  HAVING COUNT(DISTINCT engineering_contract_id) = 1
)
UPDATE projects p
   SET engineering_contract_id = ru.ec_id
  FROM rollup_unique_ec ru
 WHERE p.id = ru.rollup_id
   AND p.engineering_contract_id IS NULL;

DO $log$
DECLARE
  leaf_linked INT; leaf_null INT; rollup_linked INT; rollup_null INT;
BEGIN
  SELECT COUNT(*) INTO leaf_linked   FROM projects WHERE is_rollup=FALSE AND engineering_contract_id IS NOT NULL;
  SELECT COUNT(*) INTO leaf_null     FROM projects WHERE is_rollup=FALSE AND engineering_contract_id IS NULL;
  SELECT COUNT(*) INTO rollup_linked FROM projects WHERE is_rollup=TRUE  AND engineering_contract_id IS NOT NULL;
  SELECT COUNT(*) INTO rollup_null   FROM projects WHERE is_rollup=TRUE  AND engineering_contract_id IS NULL;
  RAISE NOTICE '[0023] projects.engineering_contract_id: leaves linked=%%, null=%%. rollups linked=%%, null=%%.',
               leaf_linked, leaf_null, rollup_linked, rollup_null;
END $log$;
