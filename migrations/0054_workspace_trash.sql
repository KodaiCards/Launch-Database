-- Wave 68: Workspace soft-delete + trash zone
-- Files/folders marked deleted_at instead of hard-deleted
-- 30-day retention before hard-purge

ALTER TABLE workspace_files ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE workspace_files ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE workspace_folders ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE workspace_folders ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES users(id) ON DELETE SET NULL;

-- Indexes: efficient filtering of active vs trashed
CREATE INDEX IF NOT EXISTS idx_workspace_files_active ON workspace_files (folder_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workspace_folders_active ON workspace_folders (parent_id) WHERE deleted_at IS NULL;

-- Trash listing indexes
CREATE INDEX IF NOT EXISTS idx_workspace_files_trash ON workspace_files (deleted_at DESC) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_workspace_folders_trash ON workspace_folders (deleted_at DESC) WHERE deleted_at IS NOT NULL;
