const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const Store = require('electron-store');

const manifestStore = new Store({ name: 'sync-manifest' });

/**
 * Scan local directory and produce manifest: {path, size_bytes, mtime, sha256}[]
 */
async function scanLocalFolder(localRootPath) {
  const manifest = [];

  async function walk(dir, relativePrefix = '') {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;

        // W99-L2: skip symlinks to prevent traversal outside the root folder.
        // entry.isFile() follows symlinks (returns true for symlinked files),
        // so we must explicitly skip symbolic links before the isFile check.
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) {
          await walk(fullPath, relativePath);
        } else if (entry.isFile()) {
          try {
            const stat = await fs.stat(fullPath);
            const content = await fs.readFile(fullPath);
            const sha256 = crypto.createHash('sha256').update(content).digest('hex');

            manifest.push({
              path: relativePath.replace(/\\/g, '/'),
              size_bytes: stat.size,
              mtime: stat.mtimeMs,
              sha256,
            });
          } catch (err) {
            console.error(`Error reading file ${fullPath}:`, err);
          }
        }
      }
    } catch (err) {
      console.error(`Error scanning directory ${dir}:`, err);
    }
  }

  await walk(localRootPath);
  return manifest;
}

/**
 * Get last known server manifest from local cache
 */
function getLastKnownServerManifest() {
  return manifestStore.get('serverManifest', []);
}

/**
 * Update local cache with new server manifest
 */
function updateServerManifest(serverManifest) {
  manifestStore.set('serverManifest', serverManifest);
}

/**
 * Get local mtime/sha cache for a file
 */
function getLocalFileCache(relativePath) {
  const cache = manifestStore.get('localCache', {});
  return cache[relativePath] || null;
}

/**
 * Update local file cache
 */
function updateLocalFileCache(relativePath, mtime, sha256) {
  const cache = manifestStore.get('localCache', {});
  cache[relativePath] = { mtime, sha256 };
  manifestStore.set('localCache', cache);
}

/**
 * Clear a file from local cache (e.g., after delete)
 */
function clearLocalFileCache(relativePath) {
  const cache = manifestStore.get('localCache', {});
  delete cache[relativePath];
  manifestStore.set('localCache', cache);
}

/**
 * Determine which files need to be pushed (new or changed locally)
 */
function determinePushChanges(localManifest) {
  const changes = [];
  const lastServerManifest = getLastKnownServerManifest();
  const lastServerMap = new Map(lastServerManifest.map((f) => [f.path, f]));

  for (const localFile of localManifest) {
    const cache = getLocalFileCache(localFile.path);
    const lastServerFile = lastServerMap.get(localFile.path);

    if (!lastServerFile && !cache) {
      changes.push({ action: 'push', type: 'new', path: localFile.path, ...localFile });
      continue;
    }

    if (cache && (cache.sha256 !== localFile.sha256 || cache.mtime !== localFile.mtime)) {
      changes.push({ action: 'push', type: 'changed', path: localFile.path, ...localFile });
      continue;
    }
  }

  return changes;
}

/**
 * Determine which files need to be pulled (new or updated on server)
 */
function determinePullChanges(localManifest, serverManifest) {
  const changes = [];
  const localMap = new Map(localManifest.map((f) => [f.path, f]));
  const localCache = manifestStore.get('localCache', {});

  for (const serverFile of serverManifest) {
    const localFile = localMap.get(serverFile.path);

    if (!localFile) {
      changes.push({ action: 'pull', type: 'new', path: serverFile.path, ...serverFile });
      continue;
    }

    const cache = localCache[serverFile.path];
    if (serverFile.uploaded_at && localFile.mtime) {
      const serverTime = new Date(serverFile.uploaded_at).getTime();
      if (serverTime > localFile.mtime && serverFile.sha256 !== (cache?.sha256)) {
        changes.push({ action: 'pull', type: 'updated', path: serverFile.path, ...serverFile });
      }
    }
  }

  return changes;
}

/**
 * Detect conflicts (same path, different content)
 */
function detectConflicts(pushChanges, pullChanges) {
  const conflicts = [];
  const pushPaths = new Set(pushChanges.map((c) => c.path));
  const pullPaths = new Set(pullChanges.map((c) => c.path));

  for (const path of pushPaths) {
    if (pullPaths.has(path)) {
      conflicts.push(path);
    }
  }

  return conflicts;
}

module.exports = {
  scanLocalFolder,
  getLastKnownServerManifest,
  updateServerManifest,
  getLocalFileCache,
  updateLocalFileCache,
  clearLocalFileCache,
  determinePushChanges,
  determinePullChanges,
  detectConflicts,
};
