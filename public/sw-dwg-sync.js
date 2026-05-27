// public/sw-dwg-sync.js — service worker scoped to /offline-sync/
//
// Purpose:
//   1. Precache the offline-sync app shell so the page loads cold without network.
//   2. Network-first for /api/dwg-sync/state so live state shows when online but
//      degrade gracefully to cached state when offline.
//   3. Replay queued sync-state POSTs from IndexedDB on background-sync wakeup.
//
// Explicitly DOES NOT cache /api/dwg-sync/files/* — those bytes are streamed
// straight to disk via the File System Access API, so caching them in the SW
// would double-store and waste storage quota.
//
// Scope: /offline-sync/  (set via register({ scope: '/offline-sync/' }))
// File location: served from / with Service-Worker-Allowed: /offline-sync/

'use strict';

const CACHE_VERSION = 'lfs-dwg-sync-v1';
const SHELL_ASSETS = [
  '/offline-sync.html',
  '/js/offline_sync.js',
  '/app-shell.css',
];

// ─── Install: precache app shell ─────────────────────────────────────────────
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // Add() rejects if any single fetch fails; addAll is all-or-nothing.
      // Use individual adds with catch to be tolerant of optional assets.
      return Promise.all(SHELL_ASSETS.map(function (url) {
        return cache.add(new Request(url, { credentials: 'include' }))
          .catch(function (err) {
            console.warn('[sw-dwg-sync] precache miss for', url, err && err.message);
          });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// ─── Activate: clean up old caches + take control ────────────────────────────
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_VERSION && k.indexOf('lfs-dwg-sync-') === 0) {
          return caches.delete(k);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ─── Fetch: network-first for /api/dwg-sync/state, cache-first for shell ─────
self.addEventListener('fetch', function (event) {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests scoped to /offline-sync/ or its assets.
  if (url.origin !== self.location.origin) return;

  // Never cache file-content downloads — they go straight to disk via FS API.
  if (url.pathname.startsWith('/api/dwg-sync/files/')) return;

  // Sync-state: network-first, fall back to cached.
  if (url.pathname === '/api/dwg-sync/state' && req.method === 'GET') {
    event.respondWith(networkFirst(req));
    return;
  }

  // Shell assets + the html page: cache-first.
  const isShell = SHELL_ASSETS.indexOf(url.pathname) !== -1;
  const isHtmlNavigate = req.mode === 'navigate' && url.pathname === '/offline-sync';
  if (isShell || isHtmlNavigate) {
    event.respondWith(cacheFirst(req, isHtmlNavigate ? '/offline-sync.html' : url.pathname));
    return;
  }

  // Everything else: default network passthrough (no-op).
});

function networkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then(function (cache) {
        cache.put(req, copy).catch(function () { /* ignore quota errors */ });
      });
    }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (cached) {
      return cached || new Response(JSON.stringify({ error: 'Offline', state: [] }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
}

function cacheFirst(req, cacheKey) {
  return caches.open(CACHE_VERSION).then(function (cache) {
    return cache.match(cacheKey || req).then(function (cached) {
      if (cached) {
        // Refresh in background.
        fetch(req).then(function (res) {
          if (res && res.ok) cache.put(cacheKey || req, res.clone()).catch(function () {});
        }).catch(function () { /* ignore */ });
        return cached;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          cache.put(cacheKey || req, res.clone()).catch(function () {});
        }
        return res;
      });
    });
  });
}

// ─── Background sync: replay queued POST /api/dwg-sync/state ─────────────────
self.addEventListener('sync', function (event) {
  if (event.tag !== 'lfs-dwg-sync-state-drain') return;
  event.waitUntil(drainPendingState());
});

// IndexedDB helpers — minimal duplicate of the page-side helpers because the
// SW has no access to the page's JS module.
const DB_NAME = 'lfs-dwg-sync';
const DB_VERSION = 1;
const STORE_PENDING = 'pending_syncs';

function openDb() {
  return new Promise(function (resolve, reject) {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      // If the SW opens the DB before the page does, we have to create stores
      // to avoid VersionError. Mirror the page-side schema.
      const db = req.result;
      if (!db.objectStoreNames.contains('manifests')) {
        db.createObjectStore('manifests', { keyPath: 'project_id' });
      }
      if (!db.objectStoreNames.contains('dir_handles')) {
        db.createObjectStore('dir_handles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PENDING)) {
        db.createObjectStore(STORE_PENDING, { keyPath: 'project_id' });
      }
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

function idbGetAllPending() {
  return openDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(STORE_PENDING, 'readonly');
      const req = tx.objectStore(STORE_PENDING).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function idbDeletePending(key) {
  return openDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(STORE_PENDING, 'readwrite');
      tx.objectStore(STORE_PENDING).delete(key);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

async function drainPendingState() {
  let pending = [];
  try {
    pending = await idbGetAllPending();
  } catch (err) {
    console.warn('[sw-dwg-sync] pending read failed:', err && err.message);
    return;
  }
  for (const p of pending) {
    try {
      const res = await fetch('/api/dwg-sync/state', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: p.project_id,
          manifest_etag: p.manifest_etag,
          client_label: p.client_label,
        }),
      });
      if (res && res.ok) {
        await idbDeletePending(p.project_id);
      } else {
        // Stop on first non-ok to avoid hammering the server.
        break;
      }
    } catch (err) {
      console.warn('[sw-dwg-sync] drain POST failed:', err && err.message);
      break;
    }
  }
}
