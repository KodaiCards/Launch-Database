-- 5.D.7: Per-project custom layer definitions.
-- MVP: layer creation + sidebar entry. Feature-add in Phase 5.E.
CREATE TABLE IF NOT EXISTS splice_custom_layers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  name            VARCHAR(80) NOT NULL,
  geometry_type   VARCHAR(10) NOT NULL CHECK (geometry_type IN ('point','line','polygon')),
  default_style   JSONB NOT NULL DEFAULT '{"color":"#6366F1"}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, name)
);

CREATE INDEX IF NOT EXISTS idx_splice_custom_layers_project ON splice_custom_layers(project_id);

-- Per-project custom layer features (geometry + attributes).
-- Feature-add UI comes in Phase 5.E; schema ships now so plumbing is complete.
CREATE TABLE IF NOT EXISTS splice_custom_features (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id        UUID NOT NULL REFERENCES splice_custom_layers(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  geometry        JSONB NOT NULL,   -- GeoJSON Point, LineString, or Polygon
  attributes      JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_custom_features_layer ON splice_custom_features(layer_id);
CREATE INDEX IF NOT EXISTS idx_splice_custom_features_project ON splice_custom_features(project_id);
