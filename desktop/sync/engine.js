const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');
const manifest = require('./manifest');

/**
 * Sync engine — manages push/pull and conflict resolution
 */
class SyncEngine {
  constructor(backendUrl, cookie) {
    this.backendUrl = backendUrl;
    this.cookie = cookie;
    this.syncInProgress = false;
    this.lastSyncAt = null;
    this.syncErrors = [];
    this.conflicts = [];
    this.syncEvents = [];
  }

  /**
   * Fetch current server manifest by walking the workspace tree
   */
  async fetchServerManifest() {
    try {
      const response = await fetch(`${this.backendUrl}/api/workspace/tree?root=user`, {
        method: 'GET',
        headers: { Cookie: this.cookie || '' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workspace tree: ${response.statusText}`);
      }

      const tree = await response.json();
      const serverManifest = [];

      await this._walkServerTree(tree, '', serverManifest);

      return serverManifest;
    } catch (err) {
      throw new Error(`fetchServerManifest error: ${err.message}`);
    }
  }

  /**
   * Recursively walk server tree to extract file manifest
   */
  async _walkServerTree(items, parentPath, manifest) {
    if (!Array.isArray(items)) return;

    for (const item of items) {
      // H-3 (Wave 99): strip path-separator characters from server-supplied
      // item names so a malicious server cannot inject traversal segments like
      // "../../evil" into the accumulated relative path.
      const safeName = (item.name || '').replace(/[/\\]/g, '_').replace(/\.\./g, '__');
      const currentPath = parentPath ? `${parentPath}/${safeName}` : safeName;

      if (item.type === 'folder') {
        if (item.id && this._shouldFetchFolderContents()) {
          try {
            const response = await fetch(`${this.backendUrl}/api/workspace/folders/${item.id}/files`, {
              method: 'GET',
              headers: { Cookie: this.cookie || '' },
            });
            if (response.ok) {
              const files = await response.json();
              await this._walkServerTree(files, currentPath, manifest);
            }
          } catch (err) {
            console.warn(`Error fetching folder ${item.id}:`, err);
          }
        }
      } else if (item.type === 'file') {
        manifest.push({
          path: currentPath.replace(/\\/g, '/'),
          file_id: item.id,
          uploaded_at: item.uploaded_at || item.created_at,
          sha256: item.sha256 || '',
        });
      }
    }
  }

  /**
   * Stub: decide if we should eagerly fetch folder contents or traverse via children
   */
  _shouldFetchFolderContents() {
    return true;
  }

  /**
   * Push a local file to server
   */
  async pushFile(localRootPath, relativePath, fileData) {
    try {
      const pathParts = relativePath.split('/');
      const fileName = pathParts.pop();
      const folderPath = pathParts.length > 0 ? pathParts.join('/') : null;

      let targetFolderId = 'root';
      if (folderPath) {
        targetFolderId = await this._ensureFolderPath(folderPath);
      }

      const form = new FormData();
      form.append('file', fileData, fileName);

      const response = await fetch(
        `${this.backendUrl}/api/workspace/folders/${targetFolderId}/files`,
        {
          method: 'POST',
          headers: { Cookie: this.cookie || '' },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      this._logEvent(`Uploaded ${relativePath}`);
      return result;
    } catch (err) {
      this.syncErrors.push(`Push error for ${relativePath}: ${err.message}`);
      throw err;
    }
  }

  /**
   * H-3 (Wave 99): Verify that a resolved path stays inside localRootPath.
   * Throws if the path would escape the sync root (path traversal guard).
   * @param {string} localRootPath  Absolute path to the sync root directory.
   * @param {string} relativePath   Server-supplied relative path.
   * @returns {string}              The safe absolute path.
   */
  _safeJoin(localRootPath, relativePath) {
    const resolvedRoot = path.resolve(localRootPath);
    // Strip any leading slashes or drive-letter prefixes from the relative path
    // to prevent the server supplying an absolute path component.
    const sanitized = relativePath.replace(/^[/\\]+/, '').replace(/^[a-zA-Z]:/, '');
    const fullPath = path.resolve(resolvedRoot, sanitized);
    // Ensure the resolved path starts with the root (+ separator) so a path
    // that resolves exactly to the root is allowed but nothing above it.
    if (fullPath !== resolvedRoot && !fullPath.startsWith(resolvedRoot + path.sep)) {
      throw new Error(
        `[security] Path traversal detected: "${relativePath}" resolves outside sync root`
      );
    }
    return fullPath;
  }

  /**
   * Pull a file from server
   */
  async pullFile(localRootPath, relativePath, fileId) {
    try {
      const response = await fetch(`${this.backendUrl}/api/workspace/files/${fileId}/download`, {
        method: 'GET',
        headers: { Cookie: this.cookie || '' },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const buffer = await response.buffer();

      // H-3 (Wave 99): validate path before writing to filesystem.
      const fullPath = this._safeJoin(localRootPath, relativePath);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, buffer);

      this._logEvent(`Downloaded ${relativePath}`);
      return { success: true };
    } catch (err) {
      this.syncErrors.push(`Pull error for ${relativePath}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Delete a file from server
   */
  async deleteFileOnServer(fileId, relativePath) {
    try {
      const response = await fetch(`${this.backendUrl}/api/workspace/files/${fileId}`, {
        method: 'DELETE',
        headers: { Cookie: this.cookie || '' },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      this._logEvent(`Deleted ${relativePath} on server`);
      return { success: true };
    } catch (err) {
      this.syncErrors.push(`Delete error for ${relativePath}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Ensure a folder path exists on server; create intermediate folders if needed
   */
  async _ensureFolderPath(folderPath) {
    return 'root';
  }

  /**
   * Handle conflicts: rename local file to .conflict-<timestamp>.<ext> and pull server version
   */
  async resolveConflict(localRootPath, relativePath, serverFile) {
    try {
      // H-3 (Wave 99): validate path before any filesystem operation.
      const fullPath = this._safeJoin(localRootPath, relativePath);
      const ext = path.extname(relativePath);
      const baseName = path.basename(relativePath, ext);
      const ts = Date.now();
      const conflictPath = path.join(path.dirname(fullPath), `${baseName}.conflict-${ts}${ext}`);

      await fs.rename(fullPath, conflictPath);
      this._logEvent(`Conflict detected: renamed ${relativePath} to ${baseName}.conflict-${ts}${ext}`);
      this.conflicts.push(`${baseName}.conflict-${ts}${ext}`);

      if (serverFile.file_id) {
        await this.pullFile(localRootPath, relativePath, serverFile.file_id);
      }

      return { resolved: true, conflictPath };
    } catch (err) {
      this.syncErrors.push(`Conflict resolution error for ${relativePath}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Full sync cycle: scan local, fetch server, determine changes, apply them
   */
  async runSync(localRootPath) {
    if (this.syncInProgress) {
      return { success: false, error: 'Sync already in progress' };
    }

    this.syncInProgress = true;
    this.syncErrors = [];
    this.conflicts = [];

    try {
      const localManifest = await manifest.scanLocalFolder(localRootPath);

      const serverManifest = await this.fetchServerManifest();

      const pushChanges = manifest.determinePushChanges(localManifest);
      const pullChanges = manifest.determinePullChanges(localManifest, serverManifest);
      const conflictPaths = manifest.detectConflicts(pushChanges, pullChanges);

      for (const change of pushChanges) {
        if (conflictPaths.includes(change.path)) {
          continue;
        }

        const fullPath = path.join(localRootPath, change.path);
        try {
          const fileData = await fs.readFile(fullPath);
          await this.pushFile(localRootPath, change.path, fileData);
          manifest.updateLocalFileCache(change.path, change.mtime, change.sha256);
        } catch (err) {
          this.syncErrors.push(`Failed to push ${change.path}: ${err.message}`);
        }
      }

      for (const change of pullChanges) {
        if (conflictPaths.includes(change.path)) {
          await this.resolveConflict(localRootPath, change.path, change);
        } else {
          try {
            await this.pullFile(localRootPath, change.path, change.file_id);
            manifest.updateLocalFileCache(change.path, change.mtime, change.sha256);
          } catch (err) {
            this.syncErrors.push(`Failed to pull ${change.path}: ${err.message}`);
          }
        }
      }

      manifest.updateServerManifest(serverManifest);

      this.lastSyncAt = new Date().toISOString();
      this.syncInProgress = false;

      return {
        success: true,
        lastSyncAt: this.lastSyncAt,
        summary: {
          pushed: pushChanges.filter((c) => !conflictPaths.includes(c.path)).length,
          pulled: pullChanges.filter((c) => !conflictPaths.includes(c.path)).length,
          conflicts: conflictPaths.length,
        },
        errors: this.syncErrors,
        conflicts: this.conflicts,
        events: this.syncEvents,
      };
    } catch (err) {
      this.syncInProgress = false;
      this.syncErrors.push(`Sync failed: ${err.message}`);
      return { success: false, error: err.message, errors: this.syncErrors };
    }
  }

  /**
   * Get current sync status
   */
  getSyncStatus() {
    return {
      lastSyncAt: this.lastSyncAt,
      isRunning: this.syncInProgress,
      errors: this.syncErrors,
      conflicts: this.conflicts,
      events: this.syncEvents.slice(-20),
    };
  }

  /**
   * Log a sync event for UI display
   */
  _logEvent(message) {
    const event = {
      timestamp: new Date().toISOString(),
      message,
    };
    this.syncEvents.push(event);
    if (this.syncEvents.length > 100) {
      this.syncEvents.shift();
    }
  }
}

module.exports = SyncEngine;
