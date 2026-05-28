# Workspace Folder Schema Reference

## Overview

The workspace subsystem provides hierarchical file and folder management with access control, versioning, and soft-delete (trash) semantics. It enables multi-user collaborative access to project documents with granular permission controls.

**Core design principles:**
- Hierarchical tree structure (self-referential parent_id)
- File versioning with automatic history tracking
- Share modes: inherited, private, public, or specific user list
- Soft-delete with 30-day retention before hard purge
- Role-based ACL via `workspace_folder_shares` table

---

## Tables

### `workspace_folders`

Hierarchical folder tree with permission modes and soft-delete.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Unique folder identifier |
| `parent_id` | uuid | REFERENCES workspace_folders(id) ON DELETE CASCADE | Self-reference; NULL = root |
| `name` | text | NOT NULL | Folder name |
| `kind` | text | NOT NULL, CHECK IN ('user_home', 'shared_public', 'shared_managers', 'shared_specific', 'regular') | Folder classification (see kinds below) |
| `owner_user_id` | uuid | REFERENCES users(id) ON DELETE CASCADE | For user_home: the owner; for shared: creator |
| `project_id` | uuid | REFERENCES projects(id) ON DELETE SET NULL | Optional project linkage |
| `share_mode` | text | NOT NULL DEFAULT 'inherit', CHECK IN ('inherit', 'private', 'public', 'specific') | Permission model (see modes below) |
| `created_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | User who created the folder |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | Last update timestamp |
| `deleted_at` | timestamptz | (nullable) | Soft-delete marker; NULL = active |
| `deleted_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | User who deleted the folder |

**Unique Constraint:** `(parent_id, name)` — folder names unique within a parent

**Indexes:**
- `idx_workspace_folders_parent` on `(parent_id)` — fast traversal
- `idx_workspace_folders_owner` on `(owner_user_id, kind)` — user home discovery
- `idx_workspace_folders_project` on `(project_id) WHERE project_id IS NOT NULL` — project link lookups
- `idx_workspace_folders_active` on `(parent_id) WHERE deleted_at IS NULL` — active folder traversal
- `idx_workspace_folders_trash` on `(deleted_at DESC) WHERE deleted_at IS NOT NULL` — trash listing

#### Folder Kinds

- **`user_home`** — Personal home directory. Root (parent_id NULL). Owned by single user. Created per-user at first login or admin action.
- **`shared_public`** — Public shared folder. Root. Visible to all authenticated users. Created at migration time.
- **`shared_managers`** — Managers-only shared folder. Root. Visible to users with 'manager' role. Created at migration time.
- **`shared_specific`** — Shared with explicit user list. Access controlled via `workspace_folder_shares` table.
- **`regular`** — Default kind. Sub-folder within any parent. User-created content.

#### Share Modes

- **`inherit`** — Use parent's effective share_mode (default). Simplifies permission inheritance.
- **`private`** — Only owner and users in workspace_folder_shares can access. Breaks inheritance chain.
- **`public`** — All authenticated users can view (read-only unless workspace_folder_shares grants edit).
- **`specific`** — Only users explicitly listed in workspace_folder_shares can access. ACL-driven.

**Effective permission calculation:**
Walk from node to nearest ancestor with `share_mode != 'inherit'`. Use that ancestor's mode as the effective mode for the subtree (unless overridden lower).

#### Seed Rows (Migration 0053)

```
Public Shared Root:
  id: <uuid>
  parent_id: NULL
  name: 'Public'
  kind: 'shared_public'
  share_mode: 'public'
  owner_user_id: <admin_user_id>

Managers Shared Root:
  id: <uuid>
  parent_id: NULL
  name: 'Managers'
  kind: 'shared_managers'
  share_mode: 'specific'
  owner_user_id: <admin_user_id>
```

---

### `workspace_files`

Files stored in folders with versioning metadata.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Unique file identifier |
| `folder_id` | uuid | NOT NULL REFERENCES workspace_folders(id) ON DELETE CASCADE | Parent folder |
| `filename` | text | NOT NULL | File name (with extension) |
| `mime_type` | text | NOT NULL | MIME type (e.g., 'application/pdf') |
| `size_bytes` | bigint | NOT NULL | File size in bytes |
| `sha256` | text | NOT NULL | SHA256 hash of current content |
| `storage_key` | text | NOT NULL | S3/disk storage location (see conventions below) |
| `uploaded_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | User who uploaded current version |
| `uploaded_at` | timestamptz | NOT NULL DEFAULT now() | Current version upload time |
| `current_version_count` | int | NOT NULL DEFAULT 1 | Total number of versions (current + archived) |
| `deleted_at` | timestamptz | (nullable) | Soft-delete marker; NULL = active |
| `deleted_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | User who deleted the file |

**Unique Constraint:** `(folder_id, filename)` — filenames unique within a folder

**Indexes:**
- `idx_workspace_files_folder` on `(folder_id)` — list folder contents
- `idx_workspace_files_active` on `(folder_id) WHERE deleted_at IS NULL` — active contents only
- `idx_workspace_files_trash` on `(deleted_at DESC) WHERE deleted_at IS NOT NULL` — trash listing

#### Versioning Semantics

When a file is uploaded to a folder:
1. If `(folder_id, filename)` exists and `deleted_at IS NULL`:
   - Move current row's `{storage_key, sha256, size_bytes, uploaded_by, uploaded_at}` to `workspace_file_versions`
   - Insert new row with updated content
   - Increment `current_version_count`
2. If `deleted_at IS NOT NULL` (file in trash):
   - Hard-delete the row (or restore from trash first, then repeat above)
3. If row doesn't exist:
   - Create new file record

**Default retention:** 10 versions per file (implementation detail in routes, not schema)

#### Storage Key Convention

```
UPLOAD_DIR/workspace/users/<user_id>/<folder_id>/<uuid>.<ext>
```

Example:
```
uploads/workspace/users/550e8400-e29b-41d4-a716-446655440000/
  aabbccdd-eeff-4466-8899-aabbccddee00/
    file123-uuid.pdf
```

---

### `workspace_file_versions`

Version history for files (when a file is overwritten, prior version archived here).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() | Version record id |
| `file_id` | uuid | NOT NULL REFERENCES workspace_files(id) ON DELETE CASCADE | Parent file |
| `size_bytes` | bigint | NOT NULL | Size of this version |
| `sha256` | text | NOT NULL | SHA256 of this version's content |
| `storage_key` | text | NOT NULL | S3/disk location of this version |
| `uploaded_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | Who uploaded this version |
| `uploaded_at` | timestamptz | NOT NULL DEFAULT now() | When this version was created |

**Indexes:**
- `idx_workspace_file_versions_file` on `(file_id, uploaded_at DESC)` — version history for a file

#### Retention Semantics

- Default: keep 10 versions per file
- Oldest versions automatically purged when count exceeds limit
- Hard-delete (storage cleanup) triggered by cron job or manual purge operation
- No soft-delete on versions — archived versions are permanent until purged

---

### `workspace_folder_shares`

Explicit access control for `share_mode='specific'` folders.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `folder_id` | uuid | NOT NULL REFERENCES workspace_folders(id) ON DELETE CASCADE | Target folder |
| `user_id` | uuid | NOT NULL REFERENCES users(id) ON DELETE CASCADE | User granted access |
| `permission` | text | NOT NULL CHECK IN ('view', 'edit') | Access level: read-only or read-write |
| `granted_by` | uuid | REFERENCES users(id) ON DELETE SET NULL | Admin who granted access |
| `granted_at` | timestamptz | NOT NULL DEFAULT now() | When access was granted |

**Primary Key:** `(folder_id, user_id)` — one ACL entry per user per folder

**Index:**
- `idx_workspace_folder_shares_user` on `(user_id)` — all folders a user has access to

#### Permission Levels

- **`view`** — Read-only. User can download files, list folder contents. Cannot upload, delete, or modify.
- **`edit`** — Read-write. Full access including upload, rename, delete, and permission modification (admin-granted).

#### Inheritance Rules

Explicit ACLs only apply when parent folder has `share_mode='specific'`. For `share_mode='public'` or `'private'`, this table is ignored.

---

## Soft-Delete & Trash (Migration 0054)

Both `workspace_folders` and `workspace_files` include soft-delete columns (added in Wave 68):

- `deleted_at` — timestamptz, NULL while active, non-NULL when trashed
- `deleted_by` — uuid, user who deleted the item

### Trash Zone

Users see "Active" and "Trash" zones:
- **Active:** `WHERE deleted_at IS NULL`
- **Trash:** `WHERE deleted_at IS NOT NULL`

### Retention & Purge

- **Soft-delete window:** 30 days default
- **Hard-purge trigger:** `deleted_at < now() - interval '30 days'`
- **Purge mechanism:** cron job or manual admin command
- **Restore:** set `deleted_at = NULL`, `deleted_by = NULL` when user recovers from trash

### Cascading Deletes

When a folder is deleted:
- Folder marked `deleted_at = <timestamp>`
- All child folders recursively marked (cascade via schema)
- All child files recursively marked (cascade via schema)

Restore of a parent folder does NOT automatically restore children (manual per-item restore).

---

## Permission Model

### Access Decision Tree

```
Is the user the owner_user_id of a user_home root?
  YES → Full access (view/edit)
  NO ↓

Does the folder have an explicit workspace_folder_shares entry for this user?
  YES → Use the permission level from that entry
  NO ↓

Walk to nearest ancestor with share_mode != 'inherit':
  share_mode='private'   → Only if in workspace_folder_shares → view/edit
  share_mode='public'    → All authenticated users → view only
  share_mode='specific'  → Only if in workspace_folder_shares → view/edit
  (ROOT with no explicit mode) → Default to 'public' or 'private' per kind
```

### Examples

**Scenario 1: User Alice's home folder**
- Folder kind='user_home', owner_user_id=alice_id
- Alice: full access
- Bob: no access (unless workspace_folder_shares grants it)

**Scenario 2: Shared public folder**
- Folder kind='shared_public', share_mode='public'
- Any authenticated user: view only
- Folder admin (created_by): can edit, delete, change permissions

**Scenario 3: Project-scoped shared folder**
- Folder kind='regular', parent=shared_specific_root, share_mode='specific'
- workspace_folder_shares has {folder_id, alice_id, 'edit'} and {folder_id, bob_id, 'view'}
- Alice: can upload, edit, delete
- Bob: read-only
- Carol: no access

---

## Indexes Summary

### Lookup by Traversal
- `idx_workspace_folders_parent` — fast parent-to-child tree walk
- `idx_workspace_files_folder` — list files in a folder

### Lookup by User
- `idx_workspace_folders_owner` — user home discovery ("My Home")
- `idx_workspace_folder_shares_user` — "Shared with Me"

### Lookup by Project
- `idx_workspace_folders_project` — files associated with a project

### Lookup by Status
- `idx_workspace_folders_active` — active folders only (exclude trash)
- `idx_workspace_files_active` — active files only
- `idx_workspace_folders_trash` — trash listing (deleted_at DESC for "recently deleted")
- `idx_workspace_files_trash` — trash file listing

### Lookup by Version
- `idx_workspace_file_versions_file` — version history (most recent first)

---

## Migrations

### Migration 0053: `folder_workspace.sql`
- Creates base tables: workspace_folders, workspace_files, workspace_file_versions, workspace_folder_shares
- Creates base indexes
- Inserts seed rows (Public shared root, Managers shared root)
- Sets up self-reference constraint on workspace_folders(parent_id)

### Migration 0054: `workspace_trash.sql`
- Adds `deleted_at` and `deleted_by` columns to both folders and files
- Creates active-filter indexes (WHERE deleted_at IS NULL)
- Creates trash-listing indexes (WHERE deleted_at IS NOT NULL)

**Idempotency notes:**
- Both migrations use `IF NOT EXISTS` on table creation
- Column additions use `IF NOT EXISTS` on ALTER TABLE
- Index creation uses `IF NOT EXISTS`
- Safe to re-run without side effects

---

## Constraints & Validation

### Unique Constraints
- **Folders:** `(parent_id, name)` — no duplicate folder names within a parent
- **Files:** `(folder_id, filename)` — no duplicate filenames within a folder
- **Shares:** `(folder_id, user_id)` PRIMARY KEY — one ACL entry per user per folder

### Foreign Keys & Cascading
- `workspace_folders.parent_id` → `workspace_folders(id) ON DELETE CASCADE` — deleting a parent folder cascades to all children
- `workspace_folders.owner_user_id` → `users(id) ON DELETE CASCADE` — deleting a user deletes their home folder tree
- `workspace_folders.project_id` → `projects(id) ON DELETE SET NULL` — unlinking a project doesn't delete the folder
- `workspace_files.folder_id` → `workspace_folders(id) ON DELETE CASCADE` — deleting a folder deletes all files
- `workspace_file_versions.file_id` → `workspace_files(id) ON DELETE CASCADE` — deleting a file deletes all versions
- `workspace_folder_shares.folder_id` → `workspace_folders(id) ON DELETE CASCADE` — deleting a folder removes all ACL entries
- `workspace_folder_shares.user_id` → `users(id) ON DELETE CASCADE` — deleting a user removes all their ACLs

### Checks
- `workspace_folders.kind` — must be one of: user_home, shared_public, shared_managers, shared_specific, regular
- `workspace_folders.share_mode` — must be one of: inherit, private, public, specific
- `workspace_folder_shares.permission` — must be one of: view, edit

---

## Common Queries

### List Active Folders in a Parent
```sql
SELECT id, name, kind, share_mode
  FROM workspace_folders
 WHERE parent_id = $1
   AND deleted_at IS NULL
 ORDER BY name;
```

### List Active Files in a Folder
```sql
SELECT id, filename, mime_type, size_bytes, uploaded_at
  FROM workspace_files
 WHERE folder_id = $1
   AND deleted_at IS NULL
 ORDER BY filename;
```

### Get User's Home Folder
```sql
SELECT id, name
  FROM workspace_folders
 WHERE owner_user_id = $1
   AND kind = 'user_home'
   AND deleted_at IS NULL
 LIMIT 1;
```

### List Folders Shared with a User
```sql
SELECT DISTINCT f.id, f.name, fs.permission
  FROM workspace_folders f
  JOIN workspace_folder_shares fs ON f.id = fs.folder_id
 WHERE fs.user_id = $1
   AND f.deleted_at IS NULL
 ORDER BY f.name;
```

### List File Versions (Most Recent First)
```sql
SELECT id, size_bytes, sha256, uploaded_by, uploaded_at
  FROM workspace_file_versions
 WHERE file_id = $1
 ORDER BY uploaded_at DESC;
```

### List Trashed Items (Recently Deleted)
```sql
SELECT id, name, deleted_at, deleted_by
  FROM workspace_folders
 WHERE deleted_at IS NOT NULL
 ORDER BY deleted_at DESC
 LIMIT 20;
```

### Hard-Purge Items Older than 30 Days
```sql
DELETE FROM workspace_files
 WHERE deleted_at < (now() - interval '30 days');

DELETE FROM workspace_folders
 WHERE deleted_at < (now() - interval '30 days');
```

---

## Related Tables

- **`users`** — User records referenced by owner_user_id, created_by, deleted_by, uploaded_by, granted_by
- **`projects`** — Project records referenced by project_id for folder-to-project linkage

---

## API Endpoints (Route Bindings)

The workspace subsystem is exposed via:
- `GET /api/workspace/folders/:folder_id` — get folder details + ACL
- `GET /api/workspace/folders/:folder_id/contents` — list active contents (folders + files)
- `GET /api/workspace/folders/:folder_id/trash` — list trashed contents
- `POST /api/workspace/folders/:folder_id/folders` — create subfolder
- `POST /api/workspace/folders/:folder_id/files` — upload file
- `PUT /api/workspace/folders/:folder_id` — update folder (rename, share_mode, project_id)
- `PUT /api/workspace/files/:file_id` — update file (rename, re-upload)
- `DELETE /api/workspace/folders/:folder_id` — soft-delete folder
- `DELETE /api/workspace/files/:file_id` — soft-delete file
- `POST /api/workspace/restore/:id` — restore from trash
- `GET /api/workspace/shares/:folder_id` — list ACL entries for a folder
- `POST /api/workspace/shares/:folder_id/:user_id` — grant access
- `DELETE /api/workspace/shares/:folder_id/:user_id` — revoke access

(Endpoints subject to change; refer to routes/workspace.js for definitive API contract.)

---

## Version History

| Date | Wave | Change |
|------|------|--------|
| 2026-05-XX | 57 | Initial workspace schema (tables + indexes) |
| 2026-05-XX | 68 | Add soft-delete columns + trash retention |
| 2026-05-28 | 90 | Schema documentation |
