-- Wave 57: Folder Workspace Backend
-- Hierarchical folder tree with file versioning, ACL-based sharing

-- Hierarchical folders. Root rows have parent_id NULL.
-- "Home" roots are auto-created per user; "shared" roots are admin-managed.
CREATE TABLE IF NOT EXISTS workspace_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES workspace_folders(id) ON DELETE CASCADE,
  name text NOT NULL,
  -- One of: 'user_home' (root for a single user), 'shared_public', 'shared_managers', 'shared_specific', 'regular'
  -- Root rows (parent_id NULL) MUST be user_home, shared_public, shared_managers, or shared_specific
  kind text NOT NULL CHECK (kind IN ('user_home', 'shared_public', 'shared_managers', 'shared_specific', 'regular')),
  owner_user_id uuid REFERENCES users(id) ON DELETE CASCADE,    -- For user_home roots: the user. For others: creator.
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,    -- Optional project link
  -- Share mode: inherited from nearest ancestor with explicit mode unless overridden
  -- 'inherit' = use parent's effective mode; 'private', 'public', 'specific' = override
  share_mode text NOT NULL DEFAULT 'inherit' CHECK (share_mode IN ('inherit', 'private', 'public', 'specific')),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Uniqueness: folder names unique within a parent
  UNIQUE (parent_id, name)
);

CREATE INDEX IF NOT EXISTS idx_workspace_folders_parent ON workspace_folders (parent_id);
CREATE INDEX IF NOT EXISTS idx_workspace_folders_owner ON workspace_folders (owner_user_id, kind);
CREATE INDEX IF NOT EXISTS idx_workspace_folders_project ON workspace_folders (project_id) WHERE project_id IS NOT NULL;

-- Files within folders
CREATE TABLE IF NOT EXISTS workspace_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid NOT NULL REFERENCES workspace_folders(id) ON DELETE CASCADE,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  -- Versioning: when a file is overwritten, prior storage_key + sha256 + size go to workspace_file_versions
  current_version_count int NOT NULL DEFAULT 1,
  UNIQUE (folder_id, filename)
);

CREATE INDEX IF NOT EXISTS idx_workspace_files_folder ON workspace_files (folder_id);

-- Version history (last N versions per file, default keep 10)
CREATE TABLE IF NOT EXISTS workspace_file_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL REFERENCES workspace_files(id) ON DELETE CASCADE,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  storage_key text NOT NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_file_versions_file ON workspace_file_versions (file_id, uploaded_at DESC);

-- Explicit share list for share_mode='specific' folders
CREATE TABLE IF NOT EXISTS workspace_folder_shares (
  folder_id uuid NOT NULL REFERENCES workspace_folders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission text NOT NULL CHECK (permission IN ('view', 'edit')),
  granted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (folder_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_folder_shares_user ON workspace_folder_shares (user_id);
