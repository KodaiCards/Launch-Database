-- 5.D.4: Cable category column drives per-layer styling and the Visible Features tree.
-- Existing cables default to 'unclassified'; owners can re-categorize via the
-- matrix view Category column or the cable inspector dropdown.
ALTER TABLE splice_cables
  ADD COLUMN IF NOT EXISTS category VARCHAR(20) NOT NULL DEFAULT 'unclassified';

-- Apply CHECK constraint via a named constraint so it's idempotent on re-run.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'splice_cables_category_check'
      AND conrelid = 'splice_cables'::regclass
  ) THEN
    ALTER TABLE splice_cables
      ADD CONSTRAINT splice_cables_category_check
      CHECK (category IN ('backbone','lateral','drop','pigtail','conduit','legacy','unclassified'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_splice_cables_category ON splice_cables(category);

-- Per-project per-layer style overrides. layer_id is a stable string like
-- 'cable.backbone' or 'location.handhole'; style_json holds paint + layout
-- overrides the user has configured in the Style Editor.
CREATE TABLE IF NOT EXISTS splice_layer_styles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  layer_id        VARCHAR(80) NOT NULL,
  style_json      JSONB NOT NULL DEFAULT '{}',
  visible         BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, layer_id)
);

CREATE INDEX IF NOT EXISTS idx_splice_layer_styles_project ON splice_layer_styles(project_id);
