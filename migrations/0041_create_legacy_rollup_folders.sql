-- Migration 0041: Create-and-reparent for legacy concentrator-based projects.
--
-- Context: Migration 0039 reparented leaves into EXISTING SA folders — but
-- found 0 matches because no SA (or Client) rollup folders existed for legacy
-- PSC RUS concentrator-based projects. Migration 0040 created EC rollup
-- folders for engineering_contracts rows — but PSC RUS legacy data has no
-- engineering_contracts row, so 0 EC folders were created either.
--
-- This migration fills the gap: it creates Client rollup folders (if absent)
-- and SA rollup folders (keyed on concentrator_id, matching the canonical
-- rollup_key convention from scripts/schema_core.sql lines 970-980), then
-- re-parents all legacy flat leaves into the newly-created SA folders.
--
-- Hierarchy produced:
--   Client folder (rollup_level='client', rollup_key=client_id::text)
--     └─ SA folder (rollup_level='service_area', rollup_key=concentrator_id::text)
--          └─ leaf projects (parent_id = SA folder)
--
-- Projects with concentrator_id IS NULL but client_id IS NOT NULL are attached
-- directly to their Client folder (acceptable for one-off / Test projects).
--
-- Idempotent:
--   - Client INSERT has NOT EXISTS guard on rollup_level='client' + rollup_key.
--   - SA INSERT has NOT EXISTS guard on rollup_level='service_area' + rollup_key.
--   - Leaf UPDATE filters WHERE parent_id IS NULL (already-reparented rows skipped).
--
-- ── Companion audit queries (run before applying to preview impact) ────────────
--
-- Preview Client folders that will be created:
--   SELECT cl.id, cl.name
--   FROM clients cl
--   WHERE EXISTS (
--     SELECT 1 FROM projects p
--     WHERE p.client_id = cl.id
--       AND p.parent_id IS NULL
--       AND p.is_rollup IS NOT TRUE
--   )
--   AND NOT EXISTS (
--     SELECT 1 FROM projects cf
--     WHERE cf.is_rollup = TRUE
--       AND cf.rollup_level = 'client'
--       AND cf.rollup_key = cl.id::text
--   );
--
-- Preview SA folders that will be created:
--   SELECT DISTINCT con.id AS concentrator_id, con.area_name,
--          p.client_id, cl.name AS client_name
--   FROM projects p
--   JOIN concentrators con ON con.id = p.concentrator_id
--   JOIN clients cl ON cl.id = p.client_id
--   WHERE p.parent_id IS NULL
--     AND p.is_rollup IS NOT TRUE
--     AND p.concentrator_id IS NOT NULL
--     AND NOT EXISTS (
--       SELECT 1 FROM projects sa
--       WHERE sa.is_rollup = TRUE
--         AND sa.rollup_level = 'service_area'
--         AND sa.rollup_key = p.concentrator_id::text
--     );
--
-- Preview leaves that will be reparented under SA folders:
--   SELECT p.id, p.name, p.concentrator_id, con.area_name
--   FROM projects p
--   JOIN concentrators con ON con.id = p.concentrator_id
--   WHERE p.parent_id IS NULL
--     AND p.is_rollup IS NOT TRUE
--     AND p.concentrator_id IS NOT NULL;
--
-- Preview leaves with no concentrator_id that will attach to Client folder:
--   SELECT p.id, p.name, p.client_id, cl.name AS client_name
--   FROM projects p
--   JOIN clients cl ON cl.id = p.client_id
--   WHERE p.parent_id IS NULL
--     AND p.is_rollup IS NOT TRUE
--     AND p.client_id IS NOT NULL
--     AND p.concentrator_id IS NULL;
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

DO $$
DECLARE
  v_client_folders_created INTEGER := 0;
  v_sa_folders_created     INTEGER := 0;
  v_leaves_reparented      INTEGER := 0;
BEGIN

  -- STEP 1: Ensure a Client rollup folder exists for every client that has
  -- legacy flat (unparented, non-rollup) projects.
  INSERT INTO projects (
    name, client_id, status, is_rollup, rollup_level, rollup_key, project_type
  )
  SELECT
    cl.name,
    cl.id,
    'active',
    TRUE,
    'client',
    cl.id::text,
    'rollup'
  FROM clients cl
  WHERE EXISTS (
    SELECT 1 FROM projects p
    WHERE p.client_id = cl.id
      AND p.parent_id IS NULL
      AND p.is_rollup IS NOT TRUE
  )
  AND NOT EXISTS (
    SELECT 1 FROM projects cf
    WHERE cf.is_rollup = TRUE
      AND cf.rollup_level = 'client'
      AND cf.rollup_key = cl.id::text
  );

  GET DIAGNOSTICS v_client_folders_created = ROW_COUNT;
  RAISE NOTICE '0041: Step 1 — created % Client rollup folder(s)', v_client_folders_created;

  -- STEP 2: Ensure an SA rollup folder exists for every distinct concentrator_id
  -- found in legacy flat projects. rollup_key = concentrator_id::text matches the
  -- canonical convention from scripts/schema_core.sql and migration 0039 Pass 1.
  -- Parent = the Client folder created/found in Step 1.
  -- DISTINCT ON (p.concentrator_id) collapses multiple projects sharing the same
  -- concentrator into a single INSERT row.
  INSERT INTO projects (
    name, client_id, parent_id, concentrator_id, status,
    is_rollup, rollup_level, rollup_key, project_type
  )
  SELECT DISTINCT ON (p.concentrator_id)
    COALESCE(con.area_name, 'Service Area'),
    p.client_id,
    cf.id,
    p.concentrator_id,
    'active',
    TRUE,
    'service_area',
    p.concentrator_id::text,
    'rollup'
  FROM projects p
  JOIN concentrators con ON con.id = p.concentrator_id
  JOIN projects cf
    ON cf.is_rollup = TRUE
   AND cf.rollup_level = 'client'
   AND cf.rollup_key = p.client_id::text
  WHERE p.parent_id IS NULL
    AND p.is_rollup IS NOT TRUE
    AND p.concentrator_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM projects sa
      WHERE sa.is_rollup = TRUE
        AND sa.rollup_level = 'service_area'
        AND sa.rollup_key = p.concentrator_id::text
    );

  GET DIAGNOSTICS v_sa_folders_created = ROW_COUNT;
  RAISE NOTICE '0041: Step 2 — created % SA rollup folder(s)', v_sa_folders_created;

  -- STEP 3: Re-parent legacy flat projects that have a concentrator_id under
  -- their newly-created (or pre-existing) SA rollup folder.
  -- Identical logic to migration 0039 Pass 1, but now the SA folders exist.
  -- WHERE parent_id IS NULL ensures already-parented rows are skipped.
  UPDATE projects p
  SET    parent_id = sa.id
  FROM   projects sa
  WHERE  p.parent_id IS NULL
    AND  p.is_rollup IS NOT TRUE
    AND  p.concentrator_id IS NOT NULL
    AND  sa.is_rollup = TRUE
    AND  sa.rollup_level = 'service_area'
    AND  sa.rollup_key = p.concentrator_id::text;

  GET DIAGNOSTICS v_leaves_reparented = ROW_COUNT;
  RAISE NOTICE '0041: Step 3 — reparented % concentrator-path leaf project(s)', v_leaves_reparented;

  -- STEP 4: For legacy flat projects with no concentrator_id but a valid
  -- client_id, attach them directly to the Client folder. These render
  -- under the client without an SA intermediate (acceptable for Test /
  -- one-off projects that were never assigned a service area).
  UPDATE projects p
  SET    parent_id = cf.id
  FROM   projects cf
  WHERE  p.parent_id IS NULL
    AND  p.is_rollup IS NOT TRUE
    AND  p.client_id IS NOT NULL
    AND  p.concentrator_id IS NULL
    AND  cf.is_rollup = TRUE
    AND  cf.rollup_level = 'client'
    AND  cf.rollup_key = p.client_id::text;

  GET DIAGNOSTICS v_leaves_reparented = v_leaves_reparented + ROW_COUNT;
  RAISE NOTICE '0041: Step 4 — reparented no-concentrator leaf project(s) under client folder';

  RAISE NOTICE '0041: COMPLETE — Client folders created: %, SA folders created: %, leaves reparented: %',
    v_client_folders_created, v_sa_folders_created, v_leaves_reparented;
END $$;

COMMIT;
