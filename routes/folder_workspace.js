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
    // F4 fix: track the ID of the folder that resolved the effective mode,
    // so that shared_specific share lookups query the ancestor (not the original child).
    let effectiveAncestorId = folderId;

    // Walk up parent chain to find effective share_mode
    while (currentId) {
      const result = await pool.query(
        'SELECT id, parent_id, kind, owner_user_id, share_mode FROM workspace_folders WHERE id = $1',
        [currentId]
      );
      if (result.rows.length === 0) break;

      folder = result.rows[0];

      // If share_mode is not 'inherit', this folder resolved the effective mode
      if (folder.share_mode !== 'inherit') {
        effectiveAncestorId = currentId; // record the ancestor that owns the ACL
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
      // F4 fix: use effectiveAncestorId (the folder that owns the ACL), not the original
      // child folderId. workspace_folder_shares rows are keyed to the root that set
      // share_mode='specific'; using the child's ID caused a miss for all descendants.
      const shareResult = await pool.query(
        'SELECT permission FROM workspace_folder_shares WHERE folder_id = $1 AND user_id = $2',
        [effectiveAncestorId, requestingUserId]
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
          'SELECT id FROM workspace_folders WHERE kind = $1 AND owner_user_id = $2 AND parent_id IS NULL AND deleted_at IS NULL',
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
          "SELECT id FROM workspace_folders WHERE kind LIKE 'shared_%' AND parent_id IS NULL AND deleted_at IS NULL ORDER BY name"
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
          'SELECT id, owner_user_id FROM workspace_folders WHERE kind = $1 AND parent_id IS NULL AND deleted_at IS NULL ORDER BY owner_user_id',
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
      'SELECT id, parent_id, name, kind, owner_user_id, project_id, share_mode FROM workspace_folders WHERE id = $1 AND deleted_at IS NULL',
      [folderId]
    );

    if (folderResult.rows.length === 0) return null;
    const folder = folderResult.rows[0];

    // Get children (active only)
    const childrenResult = await pool.query(
      'SELECT id FROM workspace_folders WHERE parent_id = $1 AND deleted_at IS NULL ORDER BY name',
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
   * Recursive soft-delete (mark folder + descendants as deleted_at)
   */
  router.delete('/folders/:id', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const folderResult = await pool.query(
        'SELECT kind FROM workspace_folders WHERE id = $1 AND deleted_at IS NULL',
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

      // Recursive soft-delete: mark folder + all descendants + their files
      await pool.query(`
        WITH RECURSIVE descendants AS (
          SELECT id FROM workspace_folders WHERE id = $1
          UNION ALL
          SELECT f.id FROM workspace_folders f
          JOIN descendants d ON f.parent_id = d.id
        )
        UPDATE workspace_folders
        SET deleted_at = now(), deleted_by = $2
        WHERE id IN (SELECT id FROM descendants)
      `, [id, userId]);

      // Also mark all files in deleted folders
      await pool.query(`
        UPDATE workspace_files
        SET deleted_at = now(), deleted_by = $1
        WHERE folder_id IN (
          WITH RECURSIVE descendants AS (
            SELECT id FROM workspace_folders WHERE id = $2
            UNION ALL
            SELECT f.id FROM workspace_folders f
            JOIN descendants d ON f.parent_id = d.id
          )
          SELECT id FROM descendants
        )
      `, [userId, id]);

      await logAudit(req.user, {
        action: 'workspace.trash',
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
         WHERE f.folder_id = $1 AND f.deleted_at IS NULL
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
   * GET /api/workspace/search?q=<query>&limit=50
   * Searches workspace_files by filename (ILIKE %query%) and returns hits the caller can read.
   * Searches across ALL folders the caller has access to.
   * Returns: { hits: [{file_id, filename, folder_id, folder_path, size_bytes, uploaded_at, uploaded_by_name}], total }
   */
  router.get('/search', requireAuth(), async (req, res) => {
    try {
      const q = (req.query.q || '').trim();
      if (!q || q.length < 2) {
        return res.json({ hits: [], total: 0 });
      }

      const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
      const userId = req.user.id;
      const userRole = req.user.role || 'employee';

      // Query all files where filename ILIKE %q%, JOIN to folders
      // Use a recursive CTE to build folder_path strings
      // Exclude trashed files and folders
      const { rows } = await pool.query(`
        WITH RECURSIVE folder_paths AS (
          SELECT id, name AS path, parent_id, kind, owner_user_id, share_mode, project_id
          FROM workspace_folders WHERE parent_id IS NULL AND deleted_at IS NULL
          UNION ALL
          SELECT f.id, fp.path || ' / ' || f.name, f.parent_id, f.kind, f.owner_user_id, f.share_mode, f.project_id
          FROM workspace_folders f
          JOIN folder_paths fp ON f.parent_id = fp.id
          WHERE f.deleted_at IS NULL
        )
        SELECT
          wf.id AS file_id, wf.filename, wf.size_bytes, wf.uploaded_at,
          wf.folder_id, fp.path AS folder_path, fp.kind, fp.owner_user_id, fp.share_mode, fp.project_id,
          (SELECT username FROM users WHERE id = wf.uploaded_by) AS uploaded_by_name
        FROM workspace_files wf
        JOIN folder_paths fp ON fp.id = wf.folder_id
        WHERE wf.filename ILIKE $1 AND wf.deleted_at IS NULL
        ORDER BY wf.uploaded_at DESC
        LIMIT $2
      `, ['%' + q + '%', limit * 3]); // over-fetch since we filter post-query

      // Filter by permission
      const visible = [];
      for (const row of rows) {
        const perm = await getEffectivePermission(row.folder_id, userId, userRole);
        if (perm.canRead) {
          visible.push({
            file_id: row.file_id,
            filename: row.filename,
            folder_id: row.folder_id,
            folder_path: row.folder_path,
            size_bytes: row.size_bytes,
            uploaded_at: row.uploaded_at,
            uploaded_by_name: row.uploaded_by_name || '?',
          });
          if (visible.length >= limit) break;
        }
      }

      res.json({ hits: visible, total: visible.length });
    } catch (err) {
      console.error('GET /search error:', err);
      res.status(500).json({ error: 'Search failed' });
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

        // F2 fix: wrap the check-then-insert/update in a serialisable transaction with
        // SELECT ... FOR UPDATE to close the TOCTOU race. Two concurrent uploads of the
        // same filename to the same folder would previously both read 0 rows on the SELECT,
        // then both attempt an INSERT, causing a 23505 unique-constraint crash and orphaning
        // one of the uploaded disk files.  With FOR UPDATE the second transaction blocks
        // until the first commits, then reads the now-existing row and enters the UPDATE
        // (version-snapshot) branch.
        const client = await pool.connect();
        let uploadResult;
        try {
          await client.query('BEGIN');

          // Lock the row (if it exists) to prevent concurrent INSERT race
          const existingResult = await client.query(
            'SELECT id FROM workspace_files WHERE folder_id = $1 AND filename = $2 FOR UPDATE',
            [id, file.name]
          );

          let fileResultEntry;
          if (existingResult.rows.length > 0) {
            const existingId = existingResult.rows[0].id;

            // Snapshot current version
            const currentResult = await client.query(
              'SELECT sha256, storage_key, size_bytes, uploaded_by FROM workspace_files WHERE id = $1',
              [existingId]
            );
            const current = currentResult.rows[0];

            await client.query(
              `INSERT INTO workspace_file_versions (file_id, sha256, storage_key, size_bytes, uploaded_by, uploaded_at)
               VALUES ($1, $2, $3, $4, $5, NOW())`,
              [existingId, current.sha256, current.storage_key, current.size_bytes, current.uploaded_by]
            );

            // Update file with new version
            const versionCount = await client.query(
              'SELECT COUNT(*) as cnt FROM workspace_file_versions WHERE file_id = $1',
              [existingId]
            );

            await client.query(
              `UPDATE workspace_files SET sha256 = $1, storage_key = $2, size_bytes = $3, uploaded_by = $4,
               uploaded_at = NOW(), current_version_count = $5
               WHERE id = $6`,
              [sha256, storageKey, file.size, userId, versionCount.rows[0].cnt + 1, existingId]
            );

            fileResultEntry = {
              id: existingId,
              filename: file.name,
              mime_type: file.mimetype,
              size_bytes: file.size,
              uploaded_by_name: req.user.name,
              uploaded_at: new Date().toISOString(),
              current_version_count: versionCount.rows[0].cnt + 1
            };
          } else {
            // New file
            await client.query(
              `INSERT INTO workspace_files (id, folder_id, filename, mime_type, size_bytes, sha256, storage_key, uploaded_by, uploaded_at, current_version_count)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 1)`,
              [fileId, id, file.name, file.mimetype, file.size, sha256, storageKey, userId]
            );

            fileResultEntry = {
              id: fileId,
              filename: file.name,
              mime_type: file.mimetype,
              size_bytes: file.size,
              uploaded_by_name: req.user.name,
              uploaded_at: new Date().toISOString(),
              current_version_count: 1
            };
          }

          await client.query('COMMIT');
          uploadResult = fileResultEntry;
        } catch (txErr) {
          await client.query('ROLLBACK');
          throw txErr;
        } finally {
          client.release();
        }

        uploadedFiles.push(uploadResult);

        await logAudit(req.user, {
          action: 'workspace.file_upload',
          entity_type: 'workspace_file',
          entity_id: uploadResult.id,
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

      // F3 fix: add deleted_at IS NULL so trashed files cannot be downloaded
      const fileResult = await pool.query(
        'SELECT id, folder_id, filename, storage_key FROM workspace_files WHERE id = $1 AND deleted_at IS NULL',
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

      // F1 fix: containment check before reading storage_key from DB
      if (!isStorageKeyContained(file.storage_key)) {
        console.error('[workspace] storage_key containment failure on download:', file.storage_key);
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
   * Soft-delete file (mark deleted_at, keep storage file)
   */
  router.delete('/files/:id', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT folder_id FROM workspace_files WHERE id = $1 AND deleted_at IS NULL',
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

      // Soft delete: mark deleted_at, keep storage file
      await pool.query(
        'UPDATE workspace_files SET deleted_at = now(), deleted_by = $1 WHERE id = $2',
        [userId, id]
      );

      await logAudit(req.user, {
        action: 'workspace.trash',
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

      // F3 fix: add deleted_at IS NULL so trashed files' version history is inaccessible
      const fileResult = await pool.query(
        'SELECT folder_id FROM workspace_files WHERE id = $1 AND deleted_at IS NULL',
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
   * GET /api/workspace/files/:file_id/versions/:version_id/download
   * Download a specific prior version of a file.
   * Permission: same as downloading the head (caller must have canRead on the parent folder).
   * 404 if file_id or version_id is malformed, doesn't exist, or version doesn't belong to the file.
   */
  router.get('/files/:file_id/versions/:version_id/download', requireAuth(), async (req, res) => {
    try {
      const { file_id, version_id } = req.params;
      const userId = req.user.id;

      // Basic UUID validation (check for RFC 4122 format)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(file_id) || !uuidRegex.test(version_id)) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      // Look up the file + version + verify they're related
      const versionResult = await pool.query(`
        SELECT v.id AS version_id, v.storage_key, v.size_bytes, v.uploaded_at,
               f.id AS file_id, f.filename, f.mime_type, f.folder_id
        FROM workspace_file_versions v
        JOIN workspace_files f ON f.id = v.file_id
        WHERE v.id = $1 AND v.file_id = $2
      `, [version_id, file_id]);

      if (versionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Version not found' });
      }

      const row = versionResult.rows[0];

      // Permission check on parent folder
      const perm = await getEffectivePermission(row.folder_id, userId, req.user.role);
      if (!perm.canRead) {
        return res.status(404).json({ error: 'Version not found' }); // 404 not 403 to avoid existence leak
      }

      // F1 fix: containment check on version storage_key before streaming
      if (!isStorageKeyContained(row.storage_key)) {
        console.error('[workspace] storage_key containment failure on version download:', row.storage_key);
        return res.status(404).json({ error: 'Version not found' });
      }

      // Verify file exists on disk
      try {
        await fs.access(row.storage_key, fs.constants.R_OK);
      } catch (err) {
        console.error('[workspace] version file missing:', row.storage_key);
        return res.status(404).json({ error: 'Version file missing on disk' });
      }

      // Set Content-Type + Content-Disposition + stream
      res.setHeader('Content-Type', row.mime_type || 'application/octet-stream');
      const safeName = row.filename.replace(/"/g, '');
      // Embed version timestamp in download filename so user knows which version they got
      const baseExt = path.extname(safeName);
      const baseName = path.basename(safeName, baseExt);
      const versionStamp = new Date(row.uploaded_at).toISOString().replace(/[:.]/g, '-');
      const downloadName = `${baseName}-v${versionStamp}${baseExt}`;
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);

      fs.createReadStream(row.storage_key).pipe(res);
    } catch (err) {
      console.error('[workspace] version download error:', err);
      res.status(500).json({ error: 'Internal error' });
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

  /**
   * GET /api/workspace/by-project/:project_id
   * Returns folders attached to a project + their immediate files (1 level deep).
   * Response: { folders: [{id, name, share_mode, file_count, files: [{id, filename, size_bytes, uploaded_at, uploaded_by_name}]}] }
   * Filters by visibility (caller must have canRead permission on each folder).
   */
  router.get('/by-project/:project_id', requireAuth(), async (req, res) => {
    try {
      const { project_id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get all folders linked to this project
      const foldersResult = await pool.query(
        `SELECT id, name, share_mode FROM workspace_folders
         WHERE project_id = $1 AND kind = 'regular'
         ORDER BY name`,
        [project_id]
      );

      const folders = [];

      for (const folder of foldersResult.rows) {
        // Check if caller has canRead permission on this folder
        const perm = await getEffectivePermission(folder.id, userId, userRole);
        if (!perm.canRead) {
          continue; // Skip folders user cannot read
        }

        // Get immediate files (first 20)
        const filesResult = await pool.query(
          `SELECT id, filename, size_bytes, uploaded_at, uploaded_by_name
           FROM workspace_files
           WHERE folder_id = $1
           ORDER BY filename
           LIMIT 20`,
          [folder.id]
        );

        // Get total file count
        const countResult = await pool.query(
          `SELECT COUNT(*) as count FROM workspace_files WHERE folder_id = $1`,
          [folder.id]
        );

        folders.push({
          id: folder.id,
          name: folder.name,
          share_mode: folder.share_mode,
          file_count: parseInt(countResult.rows[0].count, 10),
          files: filesResult.rows
        });
      }

      res.json({ folders });
    } catch (err) {
      console.error('GET /by-project/:project_id error:', err);
      res.status(500).json({ error: 'Failed to load project folders' });
    }
  });

  /**
   * GET /api/workspace/trash
   * List trashed items visible to caller
   * Managers/admins see all; others see only their own deletions
   */
  router.get('/trash', requireAuth(), async (req, res) => {
    try {
      const userId = req.user.id;
      const isManager = ['admin', 'manager'].includes(req.user.role);

      const [trashedFiles, trashedFolders] = await Promise.all([
        pool.query(`
          SELECT wf.id, wf.filename, wf.size_bytes, wf.deleted_at, wf.deleted_by,
                 u.username AS deleted_by_name,
                 wf.folder_id
          FROM workspace_files wf
          LEFT JOIN users u ON u.id = wf.deleted_by
          WHERE wf.deleted_at IS NOT NULL
          ${isManager ? '' : 'AND wf.deleted_by = $1'}
          ORDER BY wf.deleted_at DESC
          LIMIT 200
        `, isManager ? [] : [userId]),
        pool.query(`
          SELECT id, name, deleted_at, deleted_by, parent_id, kind
          FROM workspace_folders
          WHERE deleted_at IS NOT NULL
          ${isManager ? '' : 'AND deleted_by = $1'}
          ORDER BY deleted_at DESC
          LIMIT 200
        `, isManager ? [] : [userId]),
      ]);

      res.json({
        files: trashedFiles.rows,
        folders: trashedFolders.rows
      });
    } catch (err) {
      console.error('GET /trash error:', err);
      res.status(500).json({ error: 'Failed to list trash' });
    }
  });

  /**
   * POST /api/workspace/files/:id/restore
   * Restore trashed file (clear deleted_at + deleted_by)
   */
  router.post('/files/:id/restore', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const fileResult = await pool.query(
        'SELECT deleted_by FROM workspace_files WHERE id = $1 AND deleted_at IS NOT NULL',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'Trashed file not found' });
      }

      const file = fileResult.rows[0];
      const isManager = ['admin', 'manager'].includes(req.user.role);

      // Only the deleter or a manager can restore
      if (!isManager && file.deleted_by !== userId) {
        return res.status(403).json({ error: 'No permission to restore this file' });
      }

      const restored = await pool.query(
        'UPDATE workspace_files SET deleted_at = NULL, deleted_by = NULL WHERE id = $1 RETURNING *',
        [id]
      );

      await logAudit(req.user, {
        action: 'workspace.restore',
        entity_type: 'workspace_file',
        entity_id: id
      });

      res.json(restored.rows[0]);
    } catch (err) {
      console.error('POST /files/:id/restore error:', err);
      res.status(500).json({ error: 'Failed to restore file' });
    }
  });

  /**
   * POST /api/workspace/folders/:id/restore
   * Restore trashed folder + all descendants + their files
   */
  router.post('/folders/:id/restore', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const folderResult = await pool.query(
        'SELECT deleted_by FROM workspace_folders WHERE id = $1 AND deleted_at IS NOT NULL',
        [id]
      );

      if (folderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Trashed folder not found' });
      }

      const folder = folderResult.rows[0];
      const isManager = ['admin', 'manager'].includes(req.user.role);

      if (!isManager && folder.deleted_by !== userId) {
        return res.status(403).json({ error: 'No permission to restore this folder' });
      }

      // Recursive restore: folder + descendants
      await pool.query(`
        WITH RECURSIVE descendants AS (
          SELECT id FROM workspace_folders WHERE id = $1
          UNION ALL
          SELECT f.id FROM workspace_folders f
          JOIN descendants d ON f.parent_id = d.id
        )
        UPDATE workspace_folders
        SET deleted_at = NULL, deleted_by = NULL
        WHERE id IN (SELECT id FROM descendants)
      `, [id]);

      // Also restore files in those folders
      await pool.query(`
        UPDATE workspace_files
        SET deleted_at = NULL, deleted_by = NULL
        WHERE folder_id IN (
          WITH RECURSIVE descendants AS (
            SELECT id FROM workspace_folders WHERE id = $1
            UNION ALL
            SELECT f.id FROM workspace_folders f
            JOIN descendants d ON f.parent_id = d.id
          )
          SELECT id FROM descendants
        )
      `, [id]);

      await logAudit(req.user, {
        action: 'workspace.restore',
        entity_type: 'workspace_folder',
        entity_id: id
      });

      res.json({ success: true });
    } catch (err) {
      console.error('POST /folders/:id/restore error:', err);
      res.status(500).json({ error: 'Failed to restore folder' });
    }
  });

  /**
   * DELETE /api/workspace/files/:id/purge
   * Permanently hard-delete trashed file + storage
   * Admin only
   */
  router.delete('/files/:id/purge', requireAuth(), async (req, res) => {
    try {
      const { id } = req.params;
      const isAdmin = req.user.role === 'admin';

      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can purge files' });
      }

      const fileResult = await pool.query(
        'SELECT storage_key FROM workspace_files WHERE id = $1 AND deleted_at IS NOT NULL',
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: 'Trashed file not found' });
      }

      const file = fileResult.rows[0];

      // F1 fix: containment check before deleting storage_key from disk
      if (!isStorageKeyContained(file.storage_key)) {
        console.error('[workspace] storage_key containment failure on purge:', file.storage_key);
        return res.status(500).json({ error: 'Storage path error' });
      }

      // Delete storage file
      try {
        await fs.unlink(file.storage_key);
      } catch (fsErr) {
        console.warn('Could not delete storage file:', file.storage_key, fsErr);
      }

      // Hard delete from DB
      await pool.query('DELETE FROM workspace_files WHERE id = $1', [id]);

      await logAudit(req.user, {
        action: 'workspace.purge',
        entity_type: 'workspace_file',
        entity_id: id
      });

      res.json({ success: true });
    } catch (err) {
      console.error('DELETE /files/:id/purge error:', err);
      res.status(500).json({ error: 'Failed to purge file' });
    }
  });

  /**
   * POST /api/workspace/trash/purge-old
   * Admin-only: hard-delete items trashed > 30 days ago
   * Wave 70: delegates to standalone purgeOldWorkspaceTrash helper for scheduler reuse
   */
  router.post('/trash/purge-old', requireAuth(), async (req, res) => {
    try {
      const isAdmin = req.user.role === 'admin';

      if (!isAdmin) {
        return res.status(403).json({ error: 'Only admins can purge old trash' });
      }

      // Call the standalone helper function
      const result = await purgeOldWorkspaceTrash(pool);

      await logAudit(req.user, {
        action: 'workspace.purge_old',
        details: {
          files_purged: result.rows_purged,
          files_deleted: result.files_deleted,
          folders_purged: result.folders_purged
        }
      });

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      console.error('POST /trash/purge-old error:', err);
      res.status(500).json({ error: 'Failed to purge old trash' });
    }
  });

  return router;
}

/**
 * Wave 70: Standalone helper for scheduled trash purge.
 * Hard-deletes workspace files and folders where deleted_at < now() - retention_days.
 * Callable directly from scheduler without HTTP context.
 */
async function purgeOldWorkspaceTrash(pool, options = {}) {
  try {
    const retentionDays = options.retentionDays || 30;
    const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

    // Step 1: Find files past retention
    const { rows: toPurge } = await pool.query(`
      SELECT id, storage_key, filename
      FROM workspace_files
      WHERE deleted_at IS NOT NULL
        AND deleted_at < now() - ($1 || ' days')::interval
    `, [String(retentionDays)]);

    if (!toPurge.length) {
      console.log(`[workspace-purge] no files past ${retentionDays}-day retention`);
      return { rows_purged: 0, files_deleted: 0, folders_purged: 0 };
    }

    // Step 2: Delete each file from disk (best-effort) + DB row
    let filesDeleted = 0;
    for (const file of toPurge) {
      try {
        const filePath = path.join(UPLOAD_DIR, file.storage_key);
        await fs.unlink(filePath).catch(() => null);
        filesDeleted++;
      } catch (err) {
        console.error('[workspace-purge] failed to delete file:', file.storage_key, err.message);
      }
      // Hard-delete from DB
      await pool.query('DELETE FROM workspace_files WHERE id = $1', [file.id]);
    }

    // Step 3: Also purge orphaned folders past retention (leaf folders only)
    const { rowCount: foldersPurged } = await pool.query(`
      DELETE FROM workspace_folders
      WHERE deleted_at IS NOT NULL
        AND deleted_at < now() - ($1 || ' days')::interval
        AND id NOT IN (SELECT DISTINCT parent_id FROM workspace_folders WHERE parent_id IS NOT NULL)
    `, [String(retentionDays)]);

    console.log(`[workspace-purge] purged ${toPurge.length} files + ${foldersPurged} folders past ${retentionDays}-day retention`);

    return {
      rows_purged: toPurge.length,
      files_deleted: filesDeleted,
      folders_purged: foldersPurged || 0
    };
  } catch (e) {
    console.error('[workspace-purge]', e && e.message);
    throw e;
  }
}

module.exports = createFolderWorkspaceRoutes;
module.exports.purgeOldWorkspaceTrash = purgeOldWorkspaceTrash;
