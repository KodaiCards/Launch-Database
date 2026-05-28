// Launch Fiber Photos — Service Worker
// Provides offline support and caching strategy

const CACHE_NAME = 'launch-fiber-photos-v2';
const STATIC_ASSETS = [
  '/',
  '/photos/',
  '/photos/index.html',
  '/photos/photos.js',
  '/photos/photos.css',
  '/photos/scanner.html',
  '/photos/scanner.js',
  '/photos/scanner.css',
  '/photos/vendor/opencv.min.js',
  '/photos/vendor/jscanify.min.js',
  '/photos/manifest.webmanifest',
  '/photos/icons/icon-192.svg',
  '/photos/icons/icon-512.svg'
];

// Install event — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Cache addAll error (some assets may be 404):', err);
        // Continue even if some assets fail
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event — network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: network-first (don't cache API responses)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache API responses
          return response;
        })
        .catch(() => {
          // Return offline fallback if network fails
          return new Response(
            JSON.stringify({ error: 'Offline' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Don't cache non-200 responses or other origins
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background sync (best-effort, not all browsers support it)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-photos') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_PHOTOS' });
        });
      })
    );
  }
});
