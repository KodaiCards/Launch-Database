# Workspace API Reference

> `routes/folder_workspace.js` — collaborative folder/file storage with permission inheritance, versioning, and soft-delete recovery.

## Overview

The Workspace API provides a shared folder tree with role-based access control. Folder permissions cascade down from parent to child via inheritance, with support for public/private/specific sharing modes. Files support full version history with restore capability.

## Permission Model

| Folder Kind | Owner Access | Manager/Admin | Other Employees | Specific Share |
|---|---|---|---|---|
| `user_home` | read/edit | read/edit | no access | N/A |
| `shared_public` | read/edit | read/edit | read-only | N/A |
| `shared_managers` | N/A | read/edit | no access | N/A |
| `shared_specific` | (by share) | read/edit | (by share) | view/edit |
| `regular` | inherits from parent | read/edit | inherits | (by parent) |

**Inheritance rule:** A child folder's effective permission walks up the parent chain to find the first non-`inherit` `share_mode`. The ancestor that set the effective mode owns the ACL for all descendants (F4 fix: uses `effectiveAncestorId`).

**Manager override:** Any user with role `manager` or `admin` has unconditional read/edit on all folders and files.

---

## Endpoints

### GET /api/workspace/tree

Fetch the folder tree visible to the authenticated user.

```
GET /api/workspace/tree?root=user|shared|all
```

**Query Parameters:**
- `root` (default: `user`) — `user` = user's own home + descendants; `shared` = shared roots only; `all` = both (managers see all users' homes)

**Response:**
```json
{
  "folders": [
    {
      "id": "uuid",
      "name": "My Folder",
      "parent_id": "uuid|null",
      "kind": "user_home|shared_public|shared_managers|shared_specific|regular",
      "owner_user_id": "uuid",
      "project_id": "uuid|null",
      "share_mode": "inherit|public|private|specific",
      "effective_can_edit": true|false,
      "children": [...]
    }
  ],
  "root_count": 2
}
```

**Auth:** `requireAuth()` — any authenticated user.

**Errors:**
- 200: Success
- 500: Database error

**Example:**
```bash
curl -H "Cookie: lfs_session=..." http://localhost/api/workspace/tree?root=all
```

---

### POST /api/workspace/folders

Create a folder under a parent.

```
POST /api/workspace/folders
Content-Type: application/json

{
  "name": "Project Docs",
  "parent_id": "uuid",
  "share_mode": "inherit|public|private|specific",  // optional; default: inherit
  "project_id": "uuid"  // optional; links folder to a project
}
```

**Required:** `name`, `parent_id`

**Caller must have** `canEdit` on the parent folder.

**Response:**
```json
{
  "id": "uuid",
  "parent_id": "uuid",
  "name": "Project Docs",
  "kind": "regular",
  "owner_user_id": "uuid",
  "project_id": "uuid|null",
  "share_mode": "inherit"
}
```

**Auth:** `requireAuth()`

**Errors:**
- 400: Missing `name` or `parent_id`
- 403: No `canEdit` permission on parent
- 500: Database error

**Security:** Folder ownership (`owner_user_id`) is set to the authenticated user. Callers cannot escalate permissions above what they have on the parent.

---

### PUT /api/workspace/folders/:id

Update a folder's name, share_mode, or project_id.

```
PUT /api/workspace/folders/:id
Content-Type: application/json

{
  "name": "New Name",            // optional
  "share_mode": "public|private", // optional; cannot change `kind`
  "project_id": "uuid|null"      // optional; null clears the link
}
```

**Caller must have** `canEdit` on the folder itself.

**Response:** Updated folder object (same shape as POST response).

**Auth:** `requireAuth()`

**Errors:**
- 400: Invalid `share_mode`
- 403: No `canEdit` permission
- 404: Folder not found
- 500: Database error

**Security:** Immutable fields (`kind`, `owner_user_id`) cannot be changed via PUT.

---

### DELETE /api/workspace/folders/:id

Soft-delete a folder and all descendants recursively.

```
DELETE /api/workspace/folders/:id
```

**Caller must have** `canEdit` on the folder.

**Restrictions:**
- Cannot delete root folders (`kind` = `user_home`, `shared_public`, `shared_managers`, `shared_specific`)
- Soft-delete: marked `deleted_at`, storage preserved

**Response:**
```json
{ "success": true }
```

**Auth:** `requireAuth()`

**Errors:**
- 400: Attempting to delete root folder
- 403: No `canEdit` permission
- 404: Folder not found
- 500: Database error

**Cascade behavior:** All descendant folders and their files are marked `deleted_at = NOW()`.

---

### POST /api/workspace/folders/:id/share

Grant per-user view/edit permission on a `share_mode=specific` folder.

```
POST /api/workspace/folders/:id/share
Content-Type: application/json

{
  "user_id": "uuid",
  "permission": "view|edit"
}
```

**Restrictions:**
- Only works on folders with `share_mode = specific`
- Caller must have `canEdit` on the folder

**Response:**
```json
[
  { "user_id": "uuid", "permission": "view|edit" },
  { "user_id": "uuid2", "permission": "edit" }
]
```

Returns the updated share list for the folder.

**Auth:** `requireAuth()`

**Errors:**
- 400: Invalid `permission` value or folder is not `specific`-mode
- 403: No `canEdit` permission
- 404: Folder not found
- 500: Database error

**Conflict handling:** If the user already has a share, the permission is updated (upsert via `ON CONFLICT`).

---

### DELETE /api/workspace/folders/:id/share/:user_id

Revoke a share grant.

```
DELETE /api/workspace/folders/:id/share/:user_id
```

**Caller must have** `canEdit` on the folder.

**Response:**
```json
{ "success": true }
```

**Auth:** `requireAuth()`

**Errors:**
- 403: No `canEdit` permission
- 404: Folder or share not found
- 500: Database error

---

### GET /api/workspace/folders/:id/files

List files in a folder.

```
GET /api/workspace/folders/:id/files
```

**Caller must have** `canRead` on the folder.

**Response:**
```json
[
  {
    "id": "uuid",
    "filename": "report.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 102400,
    "uploaded_at": "2026-05-28T10:30:00Z",
    "uploaded_by_name": "Alice",
    "current_version_count": 3
  }
]
```

**Auth:** `requireAuth()`

**Errors:**
- 403: No `canRead` permission
- 404: Folder not found
- 500: Database error

---

### POST /api/workspace/folders/:id/files

Upload one or more files to a folder (multipart/form-data).

```
POST /api/workspace/folders/:id/files
Content-Type: multipart/form-data

file1=<binary> &file2=<binary>
```

**Caller must have** `canEdit` on the folder.

**Constraints:**
- Max file size: 50MB per file
- Concurrent uploads of same filename to same folder are serialized via `SELECT ... FOR UPDATE` (F2 fix: closes TOCTOU race)
- Storage layout: `/uploads/workspace/users/{user_id}/{folder_id}/{file_id}.{ext}`

**Response:**
```json
[
  {
    "id": "uuid",
    "filename": "report.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 102400,
    "uploaded_at": "2026-05-28T10:30:00Z",
    "uploaded_by_name": "Alice",
    "current_version_count": 1
  }
]
```

**Auth:** `requireAuth()`

**Errors:**
- 400: No files / file exceeds 50MB
- 403: No `canEdit` permission
- 404: Folder not found
- 500: Database error

**Version behavior:**
- If a file with the same `filename` already exists in the folder: current version is snapshotted, new upload becomes head, `current_version_count` increments
- If new filename: new file entry created with `current_version_count = 1`

---

### GET /api/workspace/search

Search for files by filename across all accessible folders.

```
GET /api/workspace/search?q=report&limit=50
```

**Query Parameters:**
- `q` (required): Search term (2+ chars); case-insensitive substring match
- `limit` (optional, default 50, max 200): Result count cap

**Response:**
```json
{
  "hits": [
    {
      "file_id": "uuid",
      "filename": "report_q1_2026.pdf",
      "folder_id": "uuid",
      "folder_path": "My Docs / Financial",
      "size_bytes": 102400,
      "uploaded_at": "2026-05-28T10:30:00Z",
      "uploaded_by_name": "Alice"
    }
  ],
  "total": 1
}
```

**Auth:** `requireAuth()`

**Errors:**
- 200: Success (empty hits array if no matches)
- 500: Database error

**Security:** Results are filtered by caller's read permissions on each folder. Overfetches at query time, post-filters to enforce permissions.

---

### GET /api/workspace/files/:id/download

Download a file (stream as attachment).

```
GET /api/workspace/files/:id/download
```

**Caller must have:**
- `canRead` on the parent folder
- File must not be deleted (`deleted_at IS NULL`)

**Security (F1 fix):** Storage key is validated for containment before reading from disk (prevents path traversal).

**Response:** Binary file stream with `Content-Disposition: attachment; filename="..."`

**Auth:** `requireAuth()`

**Errors:**
- 404: File not found or no read permission (same response to prevent IDOR enumeration)
- 500: Disk I/O error

---

### DELETE /api/workspace/files/:id

Soft-delete a file (mark `deleted_at`, keep storage).

```
DELETE /api/workspace/files/:id
```

**Caller must have** `canEdit` on the parent folder.

**Response:**
```json
{ "success": true }
```

**Auth:** `requireAuth()`

**Errors:**
- 403: No `canEdit` permission
- 404: File not found
- 500: Database error

**Note:** Storage file is NOT deleted; only the DB row is marked. Allows restoration.

---

### GET /api/workspace/files/:id/versions

List version history for a file.

```
GET /api/workspace/files/:id/versions
```

**Caller must have:**
- `canRead` on the parent folder
- File must not be deleted (F3 fix: `deleted_at IS NULL`)

**Response:**
```json
[
  {
    "id": "uuid",
    "sha256": "abc123...",
    "size_bytes": 102400,
    "uploaded_at": "2026-05-28T10:00:00Z",
    "uploaded_by_name": "Alice"
  },
  {
    "id": "uuid",
    "sha256": "def456...",
    "size_bytes": 98304,
    "uploaded_at": "2026-05-27T15:30:00Z",
    "uploaded_by_name": "Bob"
  }
]
```

Versions are ordered `DESC` by `uploaded_at` (most recent first).

**Auth:** `requireAuth()`

**Errors:**
- 403: No `canRead` permission
- 404: File not found
- 500: Database error

---

### POST /api/workspace/files/:id/restore/:version_id

Restore a prior version as the current head.

```
POST /api/workspace/files/:id/restore/:version_id
Content-Type: application/json
{}
```

**Caller must have** `canEdit` on the parent folder.

**Workflow:**
1. Fetch the target version (must match `file_id`)
2. Snapshot current head as a new version
3. Restore version as the new head
4. Increment `current_version_count`

**Response:**
```json
{
  "id": "uuid",
  "filename": "report.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 98304,
  "sha256": "def456...",
  "uploaded_at": "2026-05-28T11:30:00Z",
  "uploaded_by": "uuid",
  "current_version_count": 4
}
```

**Auth:** `requireAuth()`

**Errors:**
- 403: No `canEdit` permission
- 404: File or version not found
- 500: Database error

---

### GET /api/workspace/files/:file_id/versions/:version_id/download

Download a specific prior version of a file.

```
GET /api/workspace/files/:file_id/versions/:version_id/download
```

**Caller must have:** `canRead` on the parent folder (same as downloading head).

**Response:** Binary file stream.

**Auth:** `requireAuth()`

**Errors:**
- 404: File/version not found or no read permission
- 500: Disk I/O error

---

## Security Model

### IDOR Prevention

All endpoints validate that the requested folder/file belongs to the caller's accessible tree **before** returning data. Two-layer defense:

1. **Permission walk:** `getEffectivePermission()` walks ancestor chain to determine `canRead` / `canEdit`
2. **Query-time FK check:** Downloads/restores verify the file's `folder_id` resolves to an accessible parent

**Example (F4 fix):** When granting shares on a `shared_specific` folder, we use `effectiveAncestorId` (the ancestor that owns the ACL) not the child's ID. This prevents descendants from appearing as separate share targets.

### Storage Containment (F1 fix)

Before reading from disk, the `storage_key` is validated:
```javascript
if (!isStorageKeyContained(file.storage_key)) {
  return res.status(404).json({ error: 'File not found' });
}
```

Prevents path-traversal attacks (e.g., `../../../etc/passwd`).

### Deleted File Access (F3 fix)

Queries include `deleted_at IS NULL` to prevent trashed files from being downloaded, restored, or version-listed after soft-delete.

### Opaque Error Messages

Download errors return 404 (not 403) to prevent attacker enumeration of whether a file exists.

---

## Audit Logging

All mutations trigger `logAudit()`:

| Action | Entity Type | Details |
|---|---|---|
| `workspace.folder_create` | `workspace_folder` | name, parent_id, share_mode, project_id |
| `workspace.folder_update` | `workspace_folder` | name, share_mode, project_id |
| `workspace.trash` | `workspace_folder` or `workspace_file` | (entity_id alone) |
| `workspace.share_grant` | `workspace_folder` | user_id, permission |
| `workspace.share_revoke` | `workspace_folder` | user_id |
| `workspace.file_upload` | `workspace_file` | filename, size_bytes |
| `workspace.file_restore` | `workspace_file` | version_id |

---

## Examples

### Create a private project folder
```bash
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project X - Designs",
    "parent_id": "550e8400-e29b-41d4-a716-446655440000",
    "share_mode": "private",
    "project_id": "550e8400-e29b-41d4-a716-446655440001"
  }' \
  http://localhost/api/workspace/folders
```

### Upload a file
```bash
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -F "file=@design.pdf" \
  http://localhost/api/workspace/folders/550e8400-e29b-41d4-a716-446655440000/files
```

### Grant view permission to a team member
```bash
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -H "Content-Type: application/json" \
  -d '{"user_id": "550e8400-e29b-41d4-a716-446655440002", "permission": "view"}' \
  http://localhost/api/workspace/folders/550e8400-e29b-41d4-a716-446655440000/share
```

### Search for files
```bash
curl -H "Cookie: lfs_session=..." \
  "http://localhost/api/workspace/search?q=budget&limit=10"
```

### Restore a prior version
```bash
curl -X POST \
  -H "Cookie: lfs_session=..." \
  http://localhost/api/workspace/files/550e8400-e29b-41d4-a716-446655440000/restore/550e8400-e29b-41d4-a716-446655440003
```

---

## Database Schema (Summary)

| Table | Columns |
|---|---|
| `workspace_folders` | id, parent_id, name, kind, owner_user_id, project_id, share_mode, created_by, created_at, updated_at, deleted_at, deleted_by |
| `workspace_files` | id, folder_id, filename, mime_type, size_bytes, sha256, storage_key, uploaded_by, uploaded_at, current_version_count, deleted_at, deleted_by |
| `workspace_file_versions` | id, file_id, sha256, storage_key, size_bytes, uploaded_by, uploaded_at |
| `workspace_folder_shares` | folder_id, user_id, permission, granted_by, granted_at |

---

## Version History

- **Wave 57:** Initial folder workspace backend
- **2026-05-21 F1:** Containment check for storage_key (path-traversal defense)
- **2026-05-21 F2:** Serializable transaction with FOR UPDATE on upload (TOCTOU race fix)
- **2026-05-21 F3:** Add `deleted_at IS NULL` to download/versions queries (prevent trashed-file access)
- **2026-05-21 F4:** Use `effectiveAncestorId` in share permission lookup (fix descendant-folder share grants)
