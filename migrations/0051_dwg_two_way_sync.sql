-- Wave 52: DWG two-way sync — canonical + staging + versioning
-- Conflict model: per-user staging, manual promotion to canonical

BEGIN;

-- Canonical files (server-side source of truth per project + filename)
CREATE TABLE IF NOT EXISTS dwg_canonical_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  last_modified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  last_modified_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, filename)
);
CREATE INDEX idx_dwg_canonical_project ON dwg_canonical_files (project_id);
CREATE INDEX idx_dwg_canonical_modified ON dwg_canonical_files (last_modified_at DESC);

-- Version history (snapshots when canonical is updated)
CREATE TABLE IF NOT EXISTS dwg_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_file_id uuid NOT NULL REFERENCES dwg_canonical_files(id) ON DELETE CASCADE,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_dwg_versions_canonical_uploaded ON dwg_versions (canonical_file_id, uploaded_at DESC);

-- User staging area (per-user, per-project, per-filename)
CREATE TABLE IF NOT EXISTS dwg_staging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  pushed_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'promoted', 'rejected', 'superseded')),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_notes text,
  UNIQUE (user_id, project_id, filename, pushed_at)
);
CREATE INDEX idx_dwg_staging_pending ON dwg_staging (status, pushed_at DESC) WHERE status = 'pending';
CREATE INDEX idx_dwg_staging_user ON dwg_staging (user_id, status, pushed_at DESC);
CREATE INDEX idx_dwg_staging_project ON dwg_staging (project_id, status);

COMMIT;
