-- Migration 0040: Add EC rollup level between Client and Service Area folders.
--
-- Carter's directive (2026-05-21): "Can you make the Roll ups more encompassing,
-- Like one big rollup for Client, then EC then what you have already"
--
-- New hierarchy: Client folder → EC folder → SA folder → leaves
-- Previous:      Client folder → SA folder → leaves
--
-- For each active engineering_contract, this migration ensures an EC rollup
-- folder exists (rollup_level='engineering_contract', rollup_key=ec.id::text)
-- parented under the Client folder, then re-parents any SA folders whose
-- engineering_contract_id matches into that EC folder.
--
-- CAVEAT: SA folders whose engineering_contract_id IS NULL (legacy concentrator-
-- based folders created before the EC-scoped path was introduced) are left alone
-- under their current parent. They remain legacy until a future migration or
-- manual admin action links them to an EC.
--
-- Idempotent: safe to re-run. The EC folder INSERT has a NOT EXISTS guard;
-- the SA re-parent skips rows already correctly parented via
-- "sa.parent_id <> ef.id" check.

BEGIN;

DO $$
DECLARE
  v_ec_created    INTEGER := 0;
  v_sa_reparented INTEGER := 0;
BEGIN

  -- Step 1: For each active engineering_contract that doesn't yet have an
  -- EC rollup folder, create one under the Client folder.
  INSERT INTO projects (
    name, client_id, parent_id, engineering_contract_id, program,
    status, is_rollup, rollup_level, rollup_key, project_type
  )
  SELECT
    ec.name || ' (' || UPPER(COALESCE(ec.program, 'EC')) || ')',
    ec.client_id,
    cf.id,
    ec.id,
    ec.program,
    'active', TRUE, 'engineering_contract', ec.id::text, 'rollup'
  FROM engineering_contracts ec
  LEFT JOIN projects cf
    ON cf.is_rollup = TRUE
   AND cf.rollup_level = 'client'
   AND cf.rollup_key = ec.client_id::text
  WHERE ec.active IS NOT FALSE
    AND NOT EXISTS (
      SELECT 1 FROM projects ef
      WHERE ef.is_rollup = TRUE
        AND ef.rollup_level = 'engineering_contract'
        AND ef.rollup_key = ec.id::text
    );

  GET DIAGNOSTICS v_ec_created = ROW_COUNT;
  RAISE NOTICE '0040: created % EC rollup folder(s)', v_ec_created;

  -- Step 2: Re-parent SA folders that have engineering_contract_id set
  -- to point to their corresponding EC folder instead of directly to the
  -- client or team folder.
  -- Skips SA folders where engineering_contract_id IS NULL (legacy concentrator
  -- path) — those stay under their current parent until manually linked.
  -- Skips SA folders already correctly parented under the EC folder
  -- (sa.parent_id = ef.id guard).
  UPDATE projects sa
  SET parent_id = ef.id
  FROM projects ef
  WHERE sa.is_rollup = TRUE
    AND sa.rollup_level = 'service_area'
    AND sa.engineering_contract_id IS NOT NULL
    AND ef.is_rollup = TRUE
    AND ef.rollup_level = 'engineering_contract'
    AND ef.rollup_key = sa.engineering_contract_id::text
    AND sa.parent_id IS DISTINCT FROM ef.id;

  GET DIAGNOSTICS v_sa_reparented = ROW_COUNT;
  RAISE NOTICE '0040: reparented % SA folder(s) under EC folder(s)', v_sa_reparented;

  RAISE NOTICE '0040: complete — EC folders created = %, SA folders reparented = %',
    v_ec_created, v_sa_reparented;
END $$;

COMMIT;
