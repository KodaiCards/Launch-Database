-- Migration 0080: training-visibility singleton settings.
--
-- WP-A (training-visibility REBUILD). The old model had FIVE conflicting "base"
-- concepts + a hard-coded OSP default + a Published preset auto-seeded with the
-- whole OSP track. This replaces that with ONE server-authoritative model:
--
--   visible(non-admin) = ( default_preset ∪ per-user SHOW − per-user HIDE ) ∩ published_preset
--   visible(admin)     = everything
--
-- Two RESERVED presets (rows in training_presets) carry the two global sets:
--   • __published__  — the lessons that are live at all (admin "Publish")
--   • __default__    — exactly what a fresh signup sees (admin "New-user default")
-- Per-user grant/revoke stays in user_training_overrides (mode 'show'|'hide').
--
-- This singleton table PINS those two presets BY ID (faster + rename-safe than
-- name lookups). It also back-fills: if a legacy 'Published' preset already exists
-- (from the prior mechanism, holding Carter's current T01 curation), we adopt it as
-- published_preset_id so NO curation is lost on cutover.
--
-- ADDITIVE + idempotent.

CREATE TABLE IF NOT EXISTS training_visibility (
  id                  boolean PRIMARY KEY DEFAULT true CHECK (id),  -- singleton: only one row (id = true)
  published_preset_id uuid REFERENCES training_presets(id) ON DELETE SET NULL,
  default_preset_id   uuid REFERENCES training_presets(id) ON DELETE SET NULL,
  updated_by          uuid,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Seed the two reserved presets (idempotent — name match) and the singleton row.
DO $$
DECLARE
  pub_id uuid;
  def_id uuid;
BEGIN
  -- __published__ : adopt a legacy 'Published' preset if one exists (carry curation),
  -- else reuse an existing __published__, else create empty.
  SELECT id INTO pub_id FROM training_presets WHERE name = '__published__' ORDER BY created_at LIMIT 1;
  IF pub_id IS NULL THEN
    SELECT id INTO pub_id FROM training_presets WHERE name = 'Published' ORDER BY created_at LIMIT 1;
    IF pub_id IS NOT NULL THEN
      -- Rename the legacy preset to the reserved name so there is one canonical row.
      UPDATE training_presets SET name = '__published__',
             description = 'Lessons live to trainees (admin Publish). Managed by the visibility engine.'
       WHERE id = pub_id;
    END IF;
  END IF;
  IF pub_id IS NULL THEN
    INSERT INTO training_presets (name, description)
      VALUES ('__published__', 'Lessons live to trainees (admin Publish). Managed by the visibility engine.')
      RETURNING id INTO pub_id;
  END IF;

  -- __default__ : the new-user default set. Created EMPTY (no hard-coded OSP seed —
  -- that auto-seed was the bug). Admin sets it via the New-user-default editor.
  SELECT id INTO def_id FROM training_presets WHERE name = '__default__' ORDER BY created_at LIMIT 1;
  IF def_id IS NULL THEN
    INSERT INTO training_presets (name, description)
      VALUES ('__default__', 'Which SUBJECTS a brand-new signup can access (admin New-user default). Intersected with published at resolve.')
      RETURNING id INTO def_id;
    -- Carter's model: a fresh signup defaults to the OSP SUBJECT (the whole track,
    -- stored as a track scope so newly-published OSP topics flow in automatically —
    -- NOT a hard-coded lesson list). Resolver intersects with published, so a new
    -- user sees all PUBLISHED OSP. Seeded only on first create (idempotent).
    INSERT INTO training_preset_scopes (preset_id, scope_type, scope_id)
      VALUES (def_id, 'track', 'osp');
  END IF;

  -- Singleton row pins both.
  INSERT INTO training_visibility (id, published_preset_id, default_preset_id)
    VALUES (true, pub_id, def_id)
  ON CONFLICT (id) DO UPDATE SET
    published_preset_id = COALESCE(training_visibility.published_preset_id, EXCLUDED.published_preset_id),
    default_preset_id   = COALESCE(training_visibility.default_preset_id,   EXCLUDED.default_preset_id);
END $$;

-- Migrate existing per-user access rows so the new resolver strands nobody:
--   • base='all' for a non-admin = "see everything" under the OLD model. Under the
--     new model the default path = the new-user default. We DROP these all-rows so
--     those users resolve through the default path (no stale 'all' the new resolver
--     can't model). Their explicit per-user overrides (show/hide) are PRESERVED
--     (separate table, untouched) and still layer on top.
--   • base='preset'/'none' rows are left as-is; the resolver still honors an explicit
--     per-user preset pin if present, else falls to the default. (Admins are resolved
--     by role, never by a row.)
-- NOTE: we cannot tell role from user_training_access alone; deleting only base='all'
-- rows is safe because 'all' is exactly the ambiguous legacy default we're retiring.
DELETE FROM user_training_access WHERE base = 'all';
