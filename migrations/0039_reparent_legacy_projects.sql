-- Migration 0039: Reparent legacy flat projects into existing SA rollup folders
--
-- Context: Projects created before the Wave 1 rollup hierarchy had parent_id IS NULL.
-- Many carry concentrator_id (PSC SA link) or engineering_contract_id + work_order_number
-- (EC path), which lets us find the SA folder already in the DB and set parent_id.
--
-- This migration ONLY re-parents into EXISTING folders. It never creates new folders.
-- Already-parented rows are skipped (parent_id IS NULL filter).
-- Safe to re-run: filtered by parent_id IS NULL AND is_rollup IS NOT TRUE.
--
-- ── Companion audit query (run before applying to preview impact) ──────────────
-- Concentrator path:
--   SELECT p.id, p.name, p.concentrator_id, sa.id AS folder_id, sa.name AS folder_name
--   FROM projects p
--   JOIN projects sa
--     ON sa.is_rollup = TRUE
--    AND sa.rollup_level = 'service_area'
--    AND sa.rollup_key = p.concentrator_id::text
--   WHERE p.parent_id IS NULL
--     AND p.is_rollup IS NOT TRUE
--     AND p.concentrator_id IS NOT NULL;
--
-- EC work-order path:
--   SELECT p.id, p.name, p.engineering_contract_id, p.work_order_number,
--          sa_folder.id AS folder_id, sa_folder.name AS folder_name
--   FROM projects p
--   JOIN ec_work_orders wo
--     ON wo.engineering_contract_id = p.engineering_contract_id
--    AND wo.number = p.work_order_number
--   JOIN projects sa_folder
--     ON sa_folder.is_rollup = TRUE
--    AND sa_folder.rollup_level = 'service_area'
--    AND sa_folder.rollup_key = wo.service_area_id::text
--   WHERE p.parent_id IS NULL
--     AND p.is_rollup IS NOT TRUE
--     AND p.engineering_contract_id IS NOT NULL
--     AND p.work_order_number IS NOT NULL;
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

DO $$
DECLARE
  v_concentrator_count INTEGER := 0;
  v_ec_wo_count        INTEGER := 0;
BEGIN

  -- Pass 1: concentrator_id path (PSC legacy projects)
  -- rollup_key for these folders is concentrator_id::text (see portal_module.js:areaKey)
  UPDATE projects p
  SET    parent_id = sa.id
  FROM   projects sa
  WHERE  p.parent_id IS NULL
    AND  p.is_rollup IS NOT TRUE
    AND  p.concentrator_id IS NOT NULL
    AND  sa.is_rollup = TRUE
    AND  sa.rollup_level = 'service_area'
    AND  sa.rollup_key = p.concentrator_id::text;

  GET DIAGNOSTICS v_concentrator_count = ROW_COUNT;
  RAISE NOTICE '0039: concentrator path — % projects reparented', v_concentrator_count;

  -- Pass 2: engineering_contract_id + work_order_number path
  -- rollup_key for these folders is ec_service_areas.id (UUID) — see portal_module.js
  -- resolve-or-create MODE 1 sets rollup_key = service_area_id (ec_service_areas.id).
  UPDATE projects p
  SET    parent_id = sa_folder.id
  FROM   ec_work_orders wo
  JOIN   projects sa_folder
    ON   sa_folder.is_rollup = TRUE
   AND   sa_folder.rollup_level = 'service_area'
   AND   sa_folder.rollup_key = wo.service_area_id::text
  WHERE  p.parent_id IS NULL
    AND  p.is_rollup IS NOT TRUE
    AND  p.engineering_contract_id IS NOT NULL
    AND  p.work_order_number IS NOT NULL
    AND  wo.engineering_contract_id = p.engineering_contract_id
    AND  wo.number = p.work_order_number
    AND  wo.service_area_id IS NOT NULL;

  GET DIAGNOSTICS v_ec_wo_count = ROW_COUNT;
  RAISE NOTICE '0039: EC work-order path — % projects reparented', v_ec_wo_count;

  RAISE NOTICE '0039: total reparented = %', v_concentrator_count + v_ec_wo_count;
END $$;

COMMIT;
