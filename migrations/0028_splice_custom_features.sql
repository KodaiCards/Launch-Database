-- 5.H.7: Custom layer feature storage — geometry + attributes per feature.
-- NOTE: The splice_custom_features table was already created in migration 0027
-- as forward-compatible schema. This migration is idempotent (IF NOT EXISTS).
-- The Phase 5.H frontend drawing tools + backend endpoints are now wired up.

CREATE TABLE IF NOT EXISTS splice_custom_features (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id        UUID NOT NULL REFERENCES splice_custom_layers(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  name            VARCHAR(120),
  geometry_json   JSONB NOT NULL,   -- GeoJSON Point, LineString, or Polygon
  attributes_jsonb JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_custom_features_layer   ON splice_custom_features(layer_id);
CREATE INDEX IF NOT EXISTS idx_splice_custom_features_project ON splice_custom_features(project_id);

-- Migrate existing 0027 columns (geometry → geometry_json, attributes → attributes_jsonb)
-- if the table was created by 0027 with the old column names.
DO $$
BEGIN
  -- Add geometry_json if missing (0027 used 'geometry')
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='splice_custom_features' AND column_name='geometry'
               AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='splice_custom_features' AND column_name='geometry_json')) THEN
    ALTER TABLE splice_custom_features RENAME COLUMN geometry TO geometry_json;
  END IF;
  -- Add attributes_jsonb if missing (0027 used 'attributes')
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='splice_custom_features' AND column_name='attributes'
               AND NOT EXISTS (SELECT 1 FROM information_schema.columns
                               WHERE table_name='splice_custom_features' AND column_name='attributes_jsonb')) THEN
    ALTER TABLE splice_custom_features RENAME COLUMN attributes TO attributes_jsonb;
  END IF;
  -- Add name column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='splice_custom_features' AND column_name='name') THEN
    ALTER TABLE splice_custom_features ADD COLUMN name VARCHAR(120);
  END IF;
  -- Add updated_at if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='splice_custom_features' AND column_name='updated_at') THEN
    ALTER TABLE splice_custom_features ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;
