// public/js/offline_sync.js — Offline DWG sync front-end.
//
// Pairs with routes/dwg_sync.js (Wave 35 backend).
//
// Responsibilities:
//   1. Pick a root sync directory via showDirectoryPicker(), persist its
//      FileSystemDirectoryHandle in IndexedDB so we survive reloads.
//   2. List remote projects available for sync (GET /api/dwg-sync/projects)
//      and render badge state vs local manifest.
//   3. Sync a single project: fetch manifest, skip unchanged-by-sha256 files,
//      stream new bytes straight to disk via File System Access, persist new
//      local manifest, POST sync state.
//   4. Render the "Synced offline" section from IDB so users can see synced
//      projects even when offline.
//   5. Register the /sw-dwg-sync.js service worker scoped to /offline-sync/.

(function () {
  'use strict';

  // ─── Constants ─────────────────────────────────────────────────────────────
  const DB_NAME = 'lfs-dwg-sync';
  const DB_VERSION = 1;
  const STORE_MANIFESTS = 'manifests';      // keyPath: project_id
  const STORE_DIR_HANDLES = 'dir_handles';  // keyPath: id (we use 'root')
  const STORE_PENDING = 'pending_syncs';    // keyPath: project_id

  const SUPPORTS_FS_ACCESS =
    typeof window !== 'undefined' &&
    typeof window.showDirectoryPicker === 'function';

  // ─── State ─────────────────────────────────────────────────────────────────
  let rootDirHandle = null;          // FileSystemDirectoryHandle
  let availableProjects = [];        // [{ project_id, project_name, client_name, dwg_count, latest_doc_at, manifest_etag (server), last_synced_at (server) }]
  let serverSyncState = [];          // [{ project_id, last_synced_at, manifest_etag, client_label }]
  let syncingProjectIds = new Set(); // projects currently being synced (UI disabling)

  // ─── DOM refs ──────────────────────────────────────────────────────────────
  const $folderEmptyMsg = document.getElementById('folder-empty-msg');
  const $folderName = document.getElementById('folder-name');
  const $folderNameText = document.getElementById('folder-name-text');
  const $folderNeedsPermission = document.getElementById('folder-needs-permission');
  const $btnPickFolder = document.getElementById('btn-pick-folder');
  const $btnPickFolderLabel = document.getElementById('btn-pick-folder-label');
  const $btnResumePermission = document.getElementById('btn-resume-permission');
  const $bannerUnsupported = document.getElementById('banner-unsupported');
  const $bannerOffline = document.getElementById('banner-offline');
  const $availableList = document.getElementById('available-list');
  const $syncedList = document.getElementById('synced-list');
  const $toastHost = document.getElementById('toast-host');

  // ─── Toast ─────────────────────────────────────────────────────────────────
  function toast(msg, kind) {
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast-' + kind : '');
    el.textContent = msg;
    $toastHost.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  // ─── Slug helper ───────────────────────────────────────────────────────────
  // Normalize a project name into a safe folder name. Allow [A-Za-z0-9._-];
  // replace everything else with '-'. Collapse runs of '-' and trim.
  function slug(name) {
    if (!name) return 'project';
    let s = String(name).trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-');
    s = s.replace(/^-+|-+$/g, '');
    return s || 'project';
  }

  // ─── IndexedDB helpers ─────────────────────────────────────────────────────
  function openDb() {
    return new Promise(function (resolve, reject) {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (ev) {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_MANIFESTS)) {
          db.createObjectStore(STORE_MANIFESTS, { keyPath: 'project_id' });
        }
        if (!db.objectStoreNames.contains(STORE_DIR_HANDLES)) {
          db.createObjectStore(STORE_DIR_HANDLES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_PENDING)) {
          db.createObjectStore(STORE_PENDING, { keyPath: 'project_id' });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(storeName, key) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function idbPut(storeName, value) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function idbGetAll(storeName) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, 'readonly');
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = function () { resolve(req.result || []); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function idbDelete(storeName, key) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).delete(key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  // ─── Permission helpers ────────────────────────────────────────────────────
  async function ensureRwPermission(handle, request) {
    if (!handle || typeof handle.queryPermission !== 'function') return false;
    const opts = { mode: 'readwrite' };
    const current = await handle.queryPermission(opts);
    if (current === 'granted') return true;
    if (!request) return false;
    const requested = await handle.requestPermission(opts);
    return requested === 'granted';
  }

  // ─── Folder pick / restore ─────────────────────────────────────────────────
  async function restoreRootHandleFromIdb() {
    const stored = await idbGet(STORE_DIR_HANDLES, 'root');
    if (stored && stored.handle) {
      rootDirHandle = stored.handle;
      const ok = await ensureRwPermission(rootDirHandle, false);
      renderFolderStatus(rootDirHandle, ok);
      return ok;
    }
    renderFolderStatus(null, false);
    return false;
  }

  async function pickRootFolder() {
    if (!SUPPORTS_FS_ACCESS) {
      toast('This browser does not support folder picking.', 'danger');
      return;
    }
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
      const ok = await ensureRwPermission(handle, true);
      if (!ok) {
        toast('Permission denied.', 'warning');
        return;
      }
      rootDirHandle = handle;
      await idbPut(STORE_DIR_HANDLES, { id: 'root', handle: handle, picked_at: new Date().toISOString() });
      toast('Folder ready for sync.', 'success');
      renderFolderStatus(handle, true);
      // Re-render available list since sync buttons may have been disabled.
      renderAvailable();
      renderSynced();
    } catch (err) {
      if (err && err.name === 'AbortError') return; // user cancelled
      console.error('[offline-sync] pickRootFolder error:', err);
      toast('Failed to pick folder: ' + (err && err.message ? err.message : 'unknown'), 'danger');
    }
  }

  async function resumePermission() {
    if (!rootDirHandle) return pickRootFolder();
    const ok = await ensureRwPermission(rootDirHandle, true);
    if (ok) {
      toast('Folder access restored.', 'success');
      renderFolderStatus(rootDirHandle, true);
      renderAvailable();
      renderSynced();
    } else {
      toast('Permission still denied.', 'warning');
    }
  }

  function renderFolderStatus(handle, hasPermission) {
    if (!handle) {
      $folderEmptyMsg.style.display = '';
      $folderName.style.display = 'none';
      $folderNeedsPermission.style.display = 'none';
      $btnPickFolderLabel.textContent = 'Choose folder';
      $btnResumePermission.style.display = 'none';
      return;
    }
    $folderEmptyMsg.style.display = 'none';
    $folderName.style.display = '';
    $folderNameText.textContent = handle.name || '(unnamed)';
    $btnPickFolderLabel.textContent = 'Re-pick folder';
    if (hasPermission) {
      $folderNeedsPermission.style.display = 'none';
      $btnResumePermission.style.display = 'none';
    } else {
      $folderNeedsPermission.style.display = '';
      $btnResumePermission.style.display = '';
    }
  }

  // ─── Server data ───────────────────────────────────────────────────────────
  async function api(path, opts) {
    const init = Object.assign({ credentials: 'include' }, opts || {});
    init.headers = Object.assign({ 'Accept': 'application/json' }, init.headers || {});
    const res = await fetch(path, init);
    if (!res.ok) {
      let detail = '';
      try { const j = await res.json(); detail = j.error || ''; } catch (e) { /* ignore */ }
      throw new Error((detail || ('HTTP ' + res.status)) + ' (' + path + ')');
    }
    return res.json();
  }

  async function loadAvailable() {
    if (!navigator.onLine) {
      $availableList.innerHTML = '<div class="empty">Offline — connect to refresh available projects.</div>';
      return;
    }
    try {
      const data = await api('/api/dwg-sync/projects');
      availableProjects = (data && data.projects) || [];
      renderAvailable();
    } catch (err) {
      console.error('[offline-sync] loadAvailable error:', err);
      $availableList.innerHTML = '<div class="empty">Failed to load projects: ' + escapeHtml(err.message) + '</div>';
    }
  }

  async function loadServerSyncState() {
    if (!navigator.onLine) return;
    try {
      const data = await api('/api/dwg-sync/state');
      serverSyncState = (data && data.state) || [];
    } catch (err) {
      console.error('[offline-sync] loadServerSyncState error:', err);
      serverSyncState = [];
    }
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString(); } catch (e) { return String(iso); }
  }

  function badgeFor(project, localManifest) {
    if (!localManifest || !localManifest.manifest_etag) {
      return { kind: 'neutral', icon: 'fa-circle', text: 'Never synced' };
    }
    if (project.manifest_etag && localManifest.manifest_etag === project.manifest_etag) {
      return { kind: 'success', icon: 'fa-check', text: 'Current' };
    }
    return { kind: 'warning', icon: 'fa-triangle-exclamation', text: 'Stale' };
  }

  async function renderAvailable() {
    if (!availableProjects.length) {
      $availableList.innerHTML = '<div class="empty">No projects with DWG files available to sync.</div>';
      return;
    }
    const localManifests = await idbGetAll(STORE_MANIFESTS);
    const localByPid = new Map(localManifests.map(function (m) { return [String(m.project_id), m]; }));

    const html = availableProjects.map(function (p) {
      const local = localByPid.get(String(p.project_id));
      const badge = badgeFor(p, local);
      const syncing = syncingProjectIds.has(String(p.project_id));
      const hasFolder = !!rootDirHandle;
      const btnDisabled = syncing || !hasFolder;
      const btnTitle = !hasFolder ? 'Choose a sync folder first' : (syncing ? 'Syncing…' : 'Sync this project');
      const disabledAttr = btnDisabled ? ' disabled' : '';
      const btnInner = syncing
        ? '<i class="fa-solid fa-spinner spin" aria-hidden="true"></i> Syncing'
        : '<i class="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i> Sync';
      const fileCount = p.dwg_count || 0;
      return '<div class="project-row" data-pid="' + escapeHtml(p.project_id) + '">'
        + '<div class="project-meta">'
        +   '<span class="project-name">' + escapeHtml(p.project_name) + '</span>'
        +   '<span class="project-client">' + escapeHtml(p.client_name || '(no client)') + '</span>'
        +   '<span class="project-counts">'
        +     '<span><i class="fa-solid fa-file" aria-hidden="true"></i> ' + fileCount + ' file' + (fileCount === 1 ? '' : 's') + '</span>'
        +     '<span><i class="fa-solid fa-clock" aria-hidden="true"></i> Latest: ' + fmtDate(p.latest_doc_at) + '</span>'
        +   '</span>'
        + '</div>'
        + '<div class="project-actions">'
        +   '<span class="badge badge-' + badge.kind + '"><i class="fa-solid ' + badge.icon + '" aria-hidden="true"></i> ' + escapeHtml(badge.text) + '</span>'
        +   '<button class="btn btn-primary btn-sm js-sync-btn" data-pid="' + escapeHtml(p.project_id) + '"' + disabledAttr
        +     ' title="' + escapeHtml(btnTitle) + '" aria-label="Sync ' + escapeHtml(p.project_name) + '">'
        +     btnInner
        +   '</button>'
        + '</div>'
        + '</div>';
    }).join('');
    $availableList.innerHTML = html;

    // Wire up sync buttons.
    Array.prototype.forEach.call($availableList.querySelectorAll('.js-sync-btn'), function (btn) {
      btn.addEventListener('click', function () {
        const pid = btn.getAttribute('data-pid');
        const proj = availableProjects.find(function (p) { return String(p.project_id) === String(pid); });
        if (proj) syncProject(proj);
      });
    });
  }

  async function renderSynced() {
    const local = await idbGetAll(STORE_MANIFESTS);
    if (!local.length) {
      $syncedList.innerHTML = '<div class="empty">No synced projects yet. Pick a folder and sync a project to get started.</div>';
      return;
    }
    const html = local
      .sort(function (a, b) {
        const ad = a.last_synced_at ? Date.parse(a.last_synced_at) : 0;
        const bd = b.last_synced_at ? Date.parse(b.last_synced_at) : 0;
        return bd - ad;
      })
      .map(function (m) {
        const canOpen = !!rootDirHandle;
        return ''
          + '<div class="project-row" data-pid="' + escapeHtml(m.project_id) + '">'
          +   '<div class="project-meta">'
          +     '<span class="project-name">' + escapeHtml(m.project_name || '(unnamed project)') + '</span>'
          +     '<span class="project-client">' + escapeHtml(m.client_name || '(no client)') + '</span>'
          +     '<span class="project-counts">'
          +       '<span><i class="fa-solid fa-file" aria-hidden="true"></i> ' + (m.file_count || 0) + ' file' + (m.file_count === 1 ? '' : 's') + '</span>'
          +       '<span><i class="fa-solid fa-clock" aria-hidden="true"></i> Synced: ' + fmtDate(m.last_synced_at) + '</span>'
          +     '</span>'
          +   '</div>'
          +   '<div class="project-actions">'
          +     '<button class="btn btn-secondary btn-sm js-open-folder" data-pid="' + escapeHtml(m.project_id) + '"'
          +       (canOpen ? '' : ' disabled')
          +       ' title="' + (canOpen ? 'Reveal subfolder name' : 'Pick a sync folder first') + '"'
          +       ' aria-label="Show local folder for ' + escapeHtml(m.project_name || '') + '">'
          +       '<i class="fa-solid fa-folder-open" aria-hidden="true"></i> Show folder'
          +     '</button>'
          +   '</div>'
          + '</div>';
      })
      .join('');
    $syncedList.innerHTML = html;
    Array.prototype.forEach.call($syncedList.querySelectorAll('.js-open-folder'), function (btn) {
      btn.addEventListener('click', async function () {
        const pid = btn.getAttribute('data-pid');
        const manifest = await idbGet(STORE_MANIFESTS, isNaN(Number(pid)) ? pid : Number(pid));
        if (!manifest || !rootDirHandle) return;
        const sub = slug(manifest.project_name || ('project-' + pid));
        // We can't programmatically open Finder/Explorer from a web page; surface
        // the folder name so the user can navigate manually.
        toast('Local folder: ' + (rootDirHandle.name || '(root)') + '/' + sub, 'success');
      });
    });
  }

  // ─── Sync routine ──────────────────────────────────────────────────────────
  async function syncProject(project) {
    const pid = String(project.project_id);
    if (syncingProjectIds.has(pid)) return;
    if (!rootDirHandle) {
      toast('Pick a sync folder first.', 'warning');
      return;
    }
    const permitted = await ensureRwPermission(rootDirHandle, true);
    if (!permitted) {
      toast('Folder permission denied — cannot sync.', 'danger');
      renderFolderStatus(rootDirHandle, false);
      return;
    }

    syncingProjectIds.add(pid);
    renderAvailable();

    try {
      // 1. Fetch manifest.
      const manifest = await api('/api/dwg-sync/projects/' + encodeURIComponent(pid) + '/manifest');
      const files = manifest && manifest.files ? manifest.files : [];
      const serverEtag = manifest && manifest.etag ? manifest.etag : null;

      // 2. Locate / create per-project subfolder.
      const sub = slug(project.project_name || ('project-' + pid));
      const projDir = await rootDirHandle.getDirectoryHandle(sub, { create: true });

      // 3. Load existing local manifest for skip-by-sha256.
      const existing = await idbGet(STORE_MANIFESTS, isNaN(Number(pid)) ? pid : Number(pid));
      const existingBySha = new Map();
      const existingFilesById = new Map();
      if (existing && Array.isArray(existing.files)) {
        existing.files.forEach(function (f) {
          if (f.doc_id != null) existingFilesById.set(String(f.doc_id), f);
          if (f.sha256 && f.file_name) existingBySha.set(f.doc_id + ':' + f.sha256, f);
        });
      }

      // 4. Download each file (skip unchanged).
      let downloaded = 0;
      let skipped = 0;
      for (const f of files) {
        if (!f.file_name) continue;
        const matchKey = (f.doc_id + ':' + (f.sha256 || ''));
        const had = existingFilesById.get(String(f.doc_id));
        const unchanged = !!(had && f.sha256 && had.sha256 === f.sha256 && existingBySha.has(matchKey));
        if (unchanged) {
          skipped++;
          continue;
        }
        // Fetch + write.
        const resp = await fetch(f.url, { credentials: 'include' });
        if (!resp.ok) {
          throw new Error('Download failed for ' + f.file_name + ' (HTTP ' + resp.status + ')');
        }
        const fileHandle = await projDir.getFileHandle(sanitizeFileName(f.file_name), { create: true });
        const writable = await fileHandle.createWritable();
        if (resp.body && typeof resp.body.pipeTo === 'function') {
          await resp.body.pipeTo(writable);
        } else {
          const buf = await resp.arrayBuffer();
          await writable.write(buf);
          await writable.close();
        }
        downloaded++;
      }

      // 5. Persist new local manifest in IDB.
      const localManifest = {
        project_id: isNaN(Number(pid)) ? pid : Number(pid),
        project_name: project.project_name,
        client_name: project.client_name,
        manifest_etag: serverEtag,
        file_count: files.length,
        last_synced_at: new Date().toISOString(),
        files: files.map(function (f) {
          return {
            doc_id: f.doc_id,
            file_name: f.file_name,
            file_path: f.file_path,
            file_size: f.file_size,
            sha256: f.sha256,
            updated_at: f.updated_at,
          };
        }),
      };
      await idbPut(STORE_MANIFESTS, localManifest);

      // 6. POST sync state back to server.
      const clientLabel = (rootDirHandle.name || 'local-folder') + ' (' +
        (navigator.userAgent.match(/(Chrome|Edge|Firefox|Safari)\/[\d.]+/) || ['browser'])[0] + ')';
      try {
        await api('/api/dwg-sync/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: localManifest.project_id,
            manifest_etag: serverEtag,
            client_label: clientLabel,
          }),
        });
        await idbDelete(STORE_PENDING, localManifest.project_id);
      } catch (postErr) {
        // Queue for retry on next online connection.
        await idbPut(STORE_PENDING, {
          project_id: localManifest.project_id,
          manifest_etag: serverEtag,
          client_label: clientLabel,
          queued_at: new Date().toISOString(),
        });
        console.warn('[offline-sync] POST /state failed, queued for retry:', postErr && postErr.message);
      }

      toast(
        'Synced "' + project.project_name + '" — ' + downloaded + ' new, ' + skipped + ' unchanged.',
        'success'
      );
    } catch (err) {
      console.error('[offline-sync] syncProject error:', err);
      toast('Sync failed: ' + (err && err.message ? err.message : 'unknown'), 'danger');
    } finally {
      syncingProjectIds.delete(pid);
      renderAvailable();
      renderSynced();
    }
  }

  // Strip path separators from a filename — defense in depth even though the
  // server validates file_path. file_name itself shouldn't ever contain slashes
  // but treat it as untrusted.
  function sanitizeFileName(name) {
    return String(name).replace(/[\\/]+/g, '_').replace(/^\.+/, '_');
  }

  // ─── Drain pending sync-state POSTs when online ────────────────────────────
  async function drainPendingState() {
    if (!navigator.onLine) return;
    const pending = await idbGetAll(STORE_PENDING);
    for (const p of pending) {
      try {
        await api('/api/dwg-sync/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: p.project_id,
            manifest_etag: p.manifest_etag,
            client_label: p.client_label,
          }),
        });
        await idbDelete(STORE_PENDING, p.project_id);
      } catch (err) {
        console.warn('[offline-sync] drainPendingState retry failed:', err && err.message);
        // Stop on first failure; we'll try again later.
        break;
      }
    }
  }

  // ─── Online / offline ──────────────────────────────────────────────────────
  function renderOnlineBanner() {
    $bannerOffline.style.display = navigator.onLine ? 'none' : '';
  }

  window.addEventListener('online', async function () {
    renderOnlineBanner();
    await drainPendingState();
    await loadAvailable();
    await loadServerSyncState();
    renderAvailable();
  });
  window.addEventListener('offline', renderOnlineBanner);

  // ─── Service worker registration ───────────────────────────────────────────
  function registerSw() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('/sw-dwg-sync.js', { scope: '/offline-sync/' })
      .then(function (reg) {
        console.log('[offline-sync] service worker registered, scope:', reg.scope);
      })
      .catch(function (err) {
        console.warn('[offline-sync] service worker registration failed:', err && err.message);
      });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  async function init() {
    if (!SUPPORTS_FS_ACCESS) {
      $bannerUnsupported.style.display = '';
      $btnPickFolder.disabled = true;
    }
    renderOnlineBanner();

    $btnPickFolder.addEventListener('click', pickRootFolder);
    $btnResumePermission.addEventListener('click', resumePermission);

    if (SUPPORTS_FS_ACCESS) {
      try {
        await restoreRootHandleFromIdb();
      } catch (err) {
        console.warn('[offline-sync] restore handle failed:', err && err.message);
      }
    }

    await Promise.all([loadAvailable(), loadServerSyncState()]);
    await renderSynced();
    await drainPendingState();
    registerSw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
