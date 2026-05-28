-- Migration 0052 — Project photos table + indexes
-- Supports mobile PWA photo uploads with GPS + timestamp tracking

BEGIN;

CREATE TABLE IF NOT EXISTS project_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  storage_key text NOT NULL,
  caption text,
  taken_at timestamptz,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  gps_lat double precision,
  gps_lon double precision,
  gps_accuracy_m real,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_photos_project ON project_photos (project_id, uploaded_at DESC) WHERE status = 'active';
CREATE INDEX idx_project_photos_user ON project_photos (uploaded_by, uploaded_at DESC);
CREATE INDEX idx_project_photos_taken ON project_photos (taken_at) WHERE taken_at IS NOT NULL;

COMMIT;
