/**
 * Wave 57: Folder Workspace Backend
 *
 * Permission model:
 * - Manager/admin role: always canRead=true, canEdit=true (full access to any folder)
 * - user_home root + descendants: owner has canRead/canEdit; manager/admin have canRead/canEdit
 * - shared_public: all employees canRead=true, canEdit=false (only manager/admin canEdit)
 * - shared_managers: only manager/admin canRead=true, canEdit=true
 * - shared_specific: workspace_folder_shares rows drive permission
 * - 'inherit' share_mode: walks up parent chain to nearest non-'inherit' ancestor
 */

const express = require('express');
const { requireAuth } = require('../auth');
const { logAudit } = require('./_audit');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Factory: instantiate routes with pool
function createFolderWorkspaceRoutes(pool) {
  const router = express.Router();

  // ==================== PERMISSION HELPERS ====================

  /**
   * Walk up folder parent chain to find effective (non-'inherit') share_mode.
   * Returns { canRead, canEdit, effectiveMode, kind }.
   */
  async function getEffectivePermission(folderId, requestingUserId, requestingUserRole) {
    // Managers/admins always have full access
    if (['manager', 'admin'].includes(requestingUserRole)) {
      return { canRead: true, canEdit: true, effectiveMode: 'special', kind: 'manager_override' };
    }

    let currentId = folderId;
    let folder = null;

    // Walk up parent chain to find effective share_mode
    while (currentId) {
      const result = await pool.query(
        'SELECT id, parent_id, kind, owner_user_id, share_mode FROM workspace_folders WHERE id = $1',
        [currentId]
      );
      if (result.rows.length === 0) break;

      folder = result.rows[0];

      // If share_mode is not 'inherit', use this folder's settings
      if (folder.share_mode !== 'inherit') {
        break;
      }

      // Otherwise, move to parent and keep walking
      currentId = folder.parent_id;
    }

    if (!folder) {
      return { canRead: false, canEdit: false, effectiveMode: 'not_found', kind: null };
    }

    const effectiveMode = folder.share_mode === 'inherit' ? 'private' : folder.share_mode;

    // Apply permission logic per effective mode
    if (folder.kind === 'user_home') {
      // Owner of user_home can always read/edit
      if (folder.owner_user_id === requestingUserId) {
        return { canRead: true, canEdit: true, effectiveMode: 'user_home_owner', kind: 'user_home' };
      }
      return { canRead: false, canEdit: false, effectiveMode: 'user_home_other', kind: 'user_home' };
    }

    if (folder.kind === 'shared_public') {
      // All employees can read shared_public; only managers can edit
      return { canRead: true, canEdit: false, effectiveMode: 'shared_public', kind: 'shared_public' };
    }

    if (folder.kind === 'shared_managers') {
      // Only managers can access shared_managers (but manager check above handles this)
      return { canRead: false, canEdit: false, effectiveMode: 'shared_managers', kind: 'shared_managers' };
    }

    if (folder.kind === 'shared_specific' || effectiveMode === 'specific') {
      // Check workspace_folder_shares table for this user
      const rootId = folderId; // For shared_specific roots
      const shareResult = await pool.query(
        'SELECT permission FROM workspace_folder_shares WHERE folder_id = $1 AND user_id = $2',
        [rootId, requestingUserId]
      );

      if (shareResult.rows.length > 0) {
        const permission = shareResult.rows[0].permission;
        return {
          canRead: true,
          canEdit: permission === 'edit',
          effectiveMode: 'specific_granted',
          kind: 'shared_specific'
        };
      }
      return { canRead: false, canEdit: false, effectiveMode: 'specific_denied', kind: 'shared_specific' };
    }

    // Regular folder inheriting from parent
    if (effectiveMode === 'public') {
      return { canRead: true, canEdit: false, effectiveMode: 'public', kind: 'regular' };
    }

    if (effectiveMode === 'private') {
      // Only owner (of the root) can access private folders
      // For now, assume private folders are only under user_homes
      return { canRead: false, canEdit: false, effectiveMode: 'private', kind: 'regular' };
    }

    return { canRead: false, canEdit: false, effectiveMode: 'unknown', kind: null };
  }

  // ==================== ENDPOINTS ====================

  /**
   * GET /api/workspace/tree?root=user|shared|all
   * Returns folder tree visible to caller
   */
  router.get('/tree', requireAuth(), async (req, res) => {
    try {
      const { root = 'user' } = req.query;
      const userId = req.user.id;
      const userRole = req.user.role || 'employee';

      let folders = [];

      if (root === 'user' || root === 'all') {
        // User's own home tree
        const userHomeResult = await pool.query(
          'SELECT id FROM workspace_folders WHERE kind = $1 AND owner_user_id = $2 AND parent_id IS NULL',
          ['user_home', userId]
        );

        if (userHomeResult.rows.length > 0) {
          const homeId = userHomeResult.rows[0].id;
          const homeTree = await buildFolderTree(homeId, userId, userRole);
          folders.push(homeTree);
        }
      }

      if (root === 'shared' || root === 'all') {
        // Shared roots visible to caller
        const sharedResult = await pool.query(
          "SELECT id FROM workspace_folders WHERE kind LIKE 'shared_%' AND parent_id IS NULL ORDER BY name"
        );

        for (const sharedRow of sharedResult.rows) {
          const sharedTree = await buildFolderTree(sharedRow.id, userId, userRole);
          if (sharedTree) {
            folders.push(sharedTree);
          }
        }
      }

      if (root === 'all' && ['manager', 'admin'].includes(userRole)) {
        // Manager view: all users' home trees
        const allUsersResult = await pool.query(
          'SELECT id, owner_user_id FROM workspace_folders WHERE kind = $1 AND parent_id IS NULL ORDER BY owner_user_id',
          ['user_home']
        );

        for (const userRow of allUsersResult.rows) {
          const userTree = await buildFolderTree(userRow.id, userId, userRole);
          if (userTree) {
            folders.push(userTree);
          }
        }
      }

      res.json({ folders, root_count: folders.length });
    } catch (err) {
      console.error('GET /tree error:', err);
      res.status(500).json({ error: 'Failed to fetch tree' });
    }
  });

  /**
   * Helper: build folder tree recursively
   */
  async function buildFolderTree(folderId, userId, userRole) {
    const perm = await getEffectivePermission(folderId, userId, userRole);
    if (!perm.canRead) return null;

    const folderResult = await pool.query(
      'SELECT id, parent_id, name, kind, owner_user_id, project_id, share_mode FROM workspace_folders WHERE id = $1',
      [folderId]
    );

    if (folderResult.rows.length === 0) return null;
    const folder = folderResult.rows[0];

    // Get children
    const childrenResult = await pool.query(
      'SELECT id FROM workspace_folders WHERE parent_id = $1 ORDER BY name',
      [folderId]
    );

    const children = [];
    for (const childRow of childrenResult.rows) {
      const childTree = await buildFolderTree(childRow.id, userId, userRole);
      if (childTree) {
        children.push(childTree);
      }
    }

    return {
      id: folder.id,
      name: folder.name,
      parent_id: folder.parent_id,
      kind: folder.kind,
      owner_user_id: folder.owner_user_id,
      project_id: folder.project_id,
      share_mode: folder.share_mode,
      effective_can_edit: perm.canEdit,
      children
    };
  }

  /**
   * POST /api/workspace/folders
   * Create folder
   */
  router.post('/folders', requireAuth(), async (req, res) => {
    try {
      const { name, parent_id, share_mode, project_id } = req.body;
      const userId = req.user.id;

      if (!name || !parent_id) {
        return res.status(400).json({ error: 'name and parent_id required' });
      }

      // Verify parent exists and caller has canEdit
      const parentPerm = await getEffectivePermission(parent_id, userId, req.user.role);
      if (!parentPerm.canEdit) {
        return res.status(403).json({ error: 'Cannot create folder in this location' });
      }

      const newFolderId = crypto.randomUUID();
      const finalShareMode = share_mode || 'inherit';

      await pool.query(
        `INSERT INTO workspace_folders (id, parent_id, name, kind, owner_user_id, project_id, share_mode, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [newFolderId, parent_id, name, 'regular', userId, project_id || null, finalShareMode, userId]
      );

      await logAudit(req.user, {
        action: 'workspace.folder_create',
        entity_type: 'workspace_folder',
        entity_id: newFolderId,
        details: { name, parent_id, share_mode: finalShareMode, project_id }
      });

      const newFolder = await pool.query(
        'SELECT id, parent_id, name, kind, owner_user_id, project_id, share_mode FROM workspace_folders WHERE id = $1',
        [newFolderId]
      );

      res.json(newFolder.rows[0]);
    } catch (err) {
      console.error('POST /folders error:', err);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });

  /**
   * PUT /api/workspace/folders/:id
   * Update folder (name, share_mode, project_id)
   */
  router.put('/folders/:id', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, share_mode, project_id } = req.body;
      const userId = req.user.id;

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to edit this folder' });
      }

      // Get current folder to check kind (immutable)
      const currentResult = await pool.query(
        'SELECT kind FROM workspace_folders WHERE id = $1',
        [id]
      );
      if (currentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (share_mode) {
        updates.push(`share_mode = $${paramIndex++}`);
        values.push(share_mode);
      }
      if (project_id !== undefined) {
        updates.push(`project_id = $${paramIndex++}`);
        values.push(project_id || null);
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const updateQuery = `UPDATE workspace_folders SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      const result = await pool.query(updateQuery, values);

      await logAudit(req.user, {
        action: 'workspace.folder_update',
        entity_type: 'workspace_folder',
        entity_id: id,
        details: { name, share_mode, project_id }
      });

      res.json(result.rows[0]);
    } catch (err) {
      console.error('PUT /folders/:id error:', err);
      res.status(500).json({ error: 'Failed to update folder' });
    }
  });

  /**
   * DELETE /api/workspace/folders/:id
   * Recursive delete (cannot delete user_home or shared_* roots)
   */
  router.delete('/folders/:id', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const folderResult = await pool.query(
        'SELECT kind FROM workspace_folders WHERE id = $1',
        [id]
      );

      if (folderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      const folder = folderResult.rows[0];
      if (['user_home', 'shared_public', 'shared_managers', 'shared_specific'].includes(folder.kind)) {
        return res.status(400).json({ error: 'Cannot delete root folders' });
      }

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to delete this folder' });
      }

      await pool.query('DELETE FROM workspace_folders WHERE id = $1', [id]);

      await logAudit(req.user, {
        action: 'workspace.folder_delete',
        entity_type: 'workspace_folder',
        entity_id: id
      });

      res.json({ success: true });
    } catch (err) {
      console.error('DELETE /folders/:id error:', err);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });

  /**
   * POST /api/workspace/folders/:id/share
   * Grant per-user share permission (only for share_mode='specific' folders)
   */
  router.post('/folders/:id/share', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, permission } = req.body;
      const userId = req.user.id;

      if (!['view', 'edit'].includes(permission)) {
        return res.status(400).json({ error: 'permission must be view or edit' });
      }

      const folderResult = await pool.query(
        'SELECT share_mode FROM workspace_folders WHERE id = $1',
        [id]
      );

      if (folderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      if (folderResult.rows[0].share_mode !== 'specific') {
        return res.status(400).json({ error: 'Can only grant shares on specific-mode folders' });
      }

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to manage shares' });
      }

      await pool.query(
        `INSERT INTO workspace_folder_shares (folder_id, user_id, permission, granted_by, granted_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (folder_id, user_id) DO UPDATE SET permission = $3, granted_at = NOW()`,
        [id, user_id, permission, userId]
      );

      await logAudit(req.user, {
        action: 'workspace.share_grant',
        entity_type: 'workspace_folder',
        entity_id: id,
        details: { user_id, permission }
      });

      const shareList = await pool.query(
        'SELECT user_id, permission FROM workspace_folder_shares WHERE folder_id = $1 ORDER BY user_id',
        [id]
      );

      res.json(shareList.rows);
    } catch (err) {
      console.error('POST /folders/:id/share error:', err);
      res.status(500).json({ error: 'Failed to grant share' });
    }
  });

  /**
   * DELETE /api/workspace/folders/:id/share/:user_id
   * Revoke share permission
   */
  router.delete('/folders/:id/share/:user_id', requireAuth(), async (req, res) => {
    try {
      const { id, user_id } = req.params;
      const userId = req.user.id;

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to manage shares' });
      }

      await pool.query(
        'DELETE FROM workspace_folder_shares WHERE folder_id = $1 AND user_id = $2',
        [id, user_id]
      );

      await logAudit(req.user, {
        action: 'workspace.share_revoke',
        entity_type: 'workspace_folder',
        entity_id: id,
        details: { user_id }
      });

      res.json({ success: true });
    } catch (err) {
      console.error('DELETE /folders/:id/share/:user_id error:', err);
      res.status(500).json({ error: 'Failed to revoke share' });
    }
  });

  /**
   * GET /api/workspace/folders/:id/files
   * List files in folder
   */
  router.get('/folders/:id/files', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canRead) {
        return res.status(403).json({ error: 'No permission to read this folder' });
      }

      const filesResult = await pool.query(
        `SELECT f.id, f.filename, f.mime_type, f.size_bytes, f.uploaded_at, f.current_version_count,
                u.name as uploaded_by_name
         FROM workspace_files f
         LEFT JOIN users u ON f.uploaded_by = u.id
         WHERE f.folder_id = $1
         ORDER BY f.filename`,
        [id]
      );

      res.json(filesResult.rows);
    } catch (err) {
      console.error('GET /folders/:id/files error:', err);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  /**
   * POST /api/workspace/folders/:id/files
   * Multipart upload (reuses Wave 49 MIME patterns, 50MB cap)
   */
  router.post('/folders/:id/files', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const perm = await getEffectivePermission(id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to upload to this folder' });
      }

      // Reuse Wave 49 upload logic (simplified for this spec)
      // In production, use multer + appropriate MIME handling
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const uploadedFiles = [];

      for (const key of Object.keys(req.files)) {
        const file = req.files[key];
        if (file.size > 50 * 1024 * 1024) {
          return res.status(400).json({ error: 'File exceeds 50MB limit' });
        }

        const fileId = crypto.randomUUID();
        const sha256 = crypto.createHash('sha256').update(file.data).digest('hex');
        const uploadDir = process.env.UPLOAD_DIR || '/tmp/uploads';
        const userStorageDir = path.join(uploadDir, 'workspace', 'users', userId, id);
        await fs.mkdir(userStorageDir, { recursive: true });

        const ext = path.extname(file.name);
        const storageKey = path.join(userStorageDir, `${fileId}${ext}`);
        await fs.writeFile(storageKey, file.data);

        // Check if file with same name already exists (snapshot version)
        const existingResult = await pool.query(
          'SELECT id FROM workspace_files WHERE folder_id = $1 AND filename = $2',
          [id, file.name]
        );

        if (existingResult.rows.length > 0) {
          const existingId = existingResult.rows[0].id;

          // Snapshot current version
          const currentResult = await pool.query(
            'SELECT sha256, storage_key, size_bytes, uploaded_by FROM workspace_files WHERE id = $1',
            [existingId]
          );
          const current = currentResult.rows[0];

          await pool.query(
            `INSERT INTO workspace_file_versions (file_id, sha256, storage_key, size_bytes, uploaded_by, uploaded_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [existingId, current.sha256, current.storage_key, current.size_bytes, current.uploaded_by]
          );

          // Update file with new version
          const versionCount = await pool.query(
            'SELECT COUNT(*) as cnt FROM workspace_file_versions WHERE file_id = $1',
            [existingId]
          );

          await pool.query(
            `UPDATE workspace_files SET sha256 = $1, storage_key = $2, size_bytes = $3, uploaded_by = $4,
             uploaded_at = NOW(), current_version_count = $5
             WHERE id = $6`,
            [sha256, storageKey, file.size, userId, versionCount.rows[0].cnt + 1, existingId]
          );

          uploadedFiles.push({
            id: existingId,
            filename: file.name,
            mime_type: file.mimetype,
            size_bytes: file.size,
            uploaded_by_name: req.user.name,
            uploaded_at: new Date().toISOString(),
            current_version_count: versionCount.rows[0].cnt + 1
          });
        } else {
          // New file
          await pool.query(
            `INSERT INTO workspace_files (id, folder_id, filename, mime_type, size_bytes, sha256, storage_key, uploaded_by, uploaded_at, current_version_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 1)`,
            [fileId, id, file.name, file.mimetype, file.size, sha256, storageKey, userId]
          );

          uploadedFiles.push({
            id: fileId,
            filename: file.name,
            mime_type: file.mimetype,
            size_bytes: file.size,
            uploaded_by_name: req.user.name,
            uploaded_at: new Date().toISOString(),
            current_version_count: 1
          });
        }

        await logAudit(req.user, {
          action: 'workspace.file_upload',
          entity_type: 'workspace_file',
          entity_id: fileId,
          details: { filename: file.name, size_bytes: file.size }
        });
      }

      res.json(uploadedFiles);
    } catch (err) {
      console.error('POST /folders/:id/files error:', err);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });

  /**
   * GET /api/workspace/files/:id/download
   * Stream file (IDOR-safe via folder permission check)
   */
  router.get('/files/:id/download', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT id, folder_id, filename, storage_key FROM workspace_files WHERE id = $1',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = fileResult.rows[0];

      // IDOR check: verify caller can read the parent folder
      const perm = await getEffectivePermission(file.folder_id, userId, req.user.role);
      if (!perm.canRead) {
        return res.status(404).json({ error: 'File not found' });
      }

      const fileData = await fs.readFile(file.storage_key);
      res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
      res.set('Content-Type', 'application/octet-stream');
      res.send(fileData);
    } catch (err) {
      console.error('GET /files/:id/download error:', err);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  /**
   * DELETE /api/workspace/files/:id
   * Hard delete file + storage
   */
  router.delete('/files/:id', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT folder_id, storage_key FROM workspace_files WHERE id = $1',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = fileResult.rows[0];

      // Check canEdit on parent folder
      const perm = await getEffectivePermission(file.folder_id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to delete this file' });
      }

      // Delete storage file
      try {
        await fs.unlink(file.storage_key);
      } catch (fsErr) {
        // Storage file may not exist; continue anyway
        console.warn('Could not delete storage file:', file.storage_key, fsErr);
      }

      // Delete from DB (cascade handles versions)
      await pool.query('DELETE FROM workspace_files WHERE id = $1', [id]);

      await logAudit(req.user, {
        action: 'workspace.file_delete',
        entity_type: 'workspace_file',
        entity_id: id
      });

      res.json({ success: true });
    } catch (err) {
      console.error('DELETE /files/:id error:', err);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  /**
   * GET /api/workspace/files/:id/versions
   * List version history
   */
  router.get('/files/:id/versions', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT folder_id FROM workspace_files WHERE id = $1',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const perm = await getEffectivePermission(fileResult.rows[0].folder_id, userId, req.user.role);
      if (!perm.canRead) {
        return res.status(403).json({ error: 'No permission to read this file' });
      }

      const versionsResult = await pool.query(
        `SELECT v.id, v.sha256, v.size_bytes, v.uploaded_at, u.name as uploaded_by_name
         FROM workspace_file_versions v
         LEFT JOIN users u ON v.uploaded_by = u.id
         WHERE v.file_id = $1
         ORDER BY v.uploaded_at DESC`,
        [id]
      );

      res.json(versionsResult.rows);
    } catch (err) {
      console.error('GET /files/:id/versions error:', err);
      res.status(500).json({ error: 'Failed to list versions' });
    }
  });

  /**
   * POST /api/workspace/files/:id/restore/:version_id
   * Restore prior version as current head
   */
  router.post('/files/:id/restore/:version_id', requireAuth(), async (req, res) => {
    try {
      const { id, version_id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT folder_id FROM workspace_files WHERE id = $1',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const perm = await getEffectivePermission(fileResult.rows[0].folder_id, userId, req.user.role);
      if (!perm.canEdit) {
        return res.status(403).json({ error: 'No permission to restore versions' });
      }

      const versionResult = await pool.query(
        'SELECT sha256, storage_key, size_bytes FROM workspace_file_versions WHERE id = $1 AND file_id = $2',
        [version_id, id]
      );

      if (versionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Version not found' });
      }

      const version = versionResult.rows[0];

      // Snapshot current as a version
      const currentResult = await pool.query(
        'SELECT sha256, storage_key, size_bytes, uploaded_by FROM workspace_files WHERE id = $1',
        [id]
      );
      const current = currentResult.rows[0];

      await pool.query(
        `INSERT INTO workspace_file_versions (file_id, sha256, storage_key, size_bytes, uploaded_by, uploaded_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [id, current.sha256, current.storage_key, current.size_bytes, current.uploaded_by]
      );

      // Restore version as current
      const versionCount = await pool.query(
        'SELECT COUNT(*) as cnt FROM workspace_file_versions WHERE file_id = $1',
        [id]
      );

      await pool.query(
        `UPDATE workspace_files SET sha256 = $1, storage_key = $2, size_bytes = $3, uploaded_by = $4,
         uploaded_at = NOW(), current_version_count = $5
         WHERE id = $6`,
        [version.sha256, version.storage_key, version.size_bytes, userId, versionCount.rows[0].cnt + 1, id]
      );

      await logAudit(req.user, {
        action: 'workspace.file_restore',
        entity_type: 'workspace_file',
        entity_id: id,
        details: { version_id }
      });

      const updatedFile = await pool.query(
        'SELECT * FROM workspace_files WHERE id = $1',
        [id]
      );

      res.json(updatedFile.rows[0]);
    } catch (err) {
      console.error('POST /files/:id/restore/:version_id error:', err);
      res.status(500).json({ error: 'Failed to restore version' });
    }
  });

  /**
   * GET /api/workspace/manager/user-homes
   * Admin/manager-only: list all user-home roots
   */
  router.get('/manager/user-homes', requireAuth(), async (req, res) => {
    try {
      const { role } = req.user;

      if (!['manager', 'admin'].includes(role)) {
        return res.status(403).json({ error: 'Manager access required' });
      }

      const result = await pool.query(
        `SELECT f.owner_user_id, u.name as user_name, f.id as home_folder_id, MAX(f.updated_at) as last_activity_at
         FROM workspace_folders f
         LEFT JOIN users u ON f.owner_user_id = u.id
         WHERE f.kind = 'user_home' AND f.parent_id IS NULL
         GROUP BY f.owner_user_id, u.name, f.id
         ORDER BY u.name`
      );

      res.json(result.rows);
    } catch (err) {
      console.error('GET /manager/user-homes error:', err);
      res.status(500).json({ error: 'Failed to list user homes' });
    }
  });

  return router;
}

module.exports = createFolderWorkspaceRoutes;
