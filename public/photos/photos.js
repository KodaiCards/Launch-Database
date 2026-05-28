// Launch Fiber Photos — PWA app logic (IIFE)
(function() {
  'use strict';

  // ── Security helpers ──────────────────────────────────────────────────────
  // esc() — HTML-escape a value before inserting into innerHTML.
  // Prevents stored XSS via user-supplied caption / uploader_name / filename
  // returned by the API (HIGH-2 fix).
  function esc(val) {
    if (val == null) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // ── IndexedDB constants (MED-2) ───────────────────────────────────────────
  // Version bumped 1→2 to trigger onupgradeneeded if needed (store already
  // exists, so upgrade is a no-op).
  const IDB_NAME    = 'LaunchFiberPhotos';
  const IDB_VERSION = 2;
  const QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  // App state
  const state = {
    user: null,
    projects: [],
    selectedProjectId: null,
    currentPhoto: null,
    gpsCoordinates: null,
    uploading: false,
    offlineQueue: []
  };

  // DOM elements
  const authCheck = document.getElementById('auth-check');
  const appEl = document.getElementById('app');
  const projectPicker = document.getElementById('project-picker');
  const recentProjectPicker = document.getElementById('recent-project-picker');
  const photoInput = document.getElementById('photo-input');
  const photoPreview = document.getElementById('photo-preview');
  const previewImg = document.getElementById('preview-img');
  const clearPhotoBtn = document.getElementById('clear-photo');
  const captionInput = document.getElementById('caption-input');
  const gpsToggle = document.getElementById('gps-toggle');
  const gpsStatus = document.getElementById('gps-status');
  const uploadBtn = document.getElementById('upload-btn');
  const uploadMessage = document.getElementById('upload-message');
  const toast = document.getElementById('toast');
  const tabBtns = document.querySelectorAll('.tab-bar__btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const recentGrid = document.getElementById('recent-grid');
  const mineGrid = document.getElementById('mine-grid');

  // Initialize
  init();

  async function init() {
    try {
      // Check authentication
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      const user = await meRes.json();
      state.user = user;

      // Load projects
      await loadProjects();

      // Setup event listeners
      setupEventListeners();

      // Hide auth check, show app
      authCheck.style.display = 'none';
      appEl.style.display = 'flex';

      // Load offline queue from IndexedDB
      loadOfflineQueue();
    } catch (e) {
      console.error('Init error:', e);
      showToast('Failed to initialize', 'error');
    }
  }

  async function loadProjects() {
    try {
      const res = await fetch('/api/projects?limit=all&leaves_only=true', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.projects = data.rows || [];

      // Populate pickers
      [projectPicker, recentProjectPicker].forEach(picker => {
        picker.innerHTML = '<option value="">Select a project...</option>';
        state.projects.forEach(proj => {
          const opt = document.createElement('option');
          opt.value = proj.id;
          opt.textContent = proj.name || '(Unnamed)';
          picker.appendChild(opt);
        });
      });
    } catch (e) {
      console.error('Load projects error:', e);
      showToast('Failed to load projects', 'error');
    }
  }

  function setupEventListeners() {
    // Photo file input
    photoInput.addEventListener('change', onPhotoSelected);
    clearPhotoBtn.addEventListener('click', clearPhoto);

    // GPS toggle
    gpsToggle.addEventListener('change', onGpsToggleChange);

    // Upload button
    uploadBtn.addEventListener('click', onUpload);

    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Project picker changes
    projectPicker.addEventListener('change', (e) => {
      state.selectedProjectId = e.target.value;
    });

    recentProjectPicker.addEventListener('change', (e) => {
      if (e.target.value) {
        loadRecentPhotos(e.target.value);
      }
    });

    // Online/offline event listeners
    window.addEventListener('online', drainOfflineQueue);

    // MED-2: clear offline queue on logout to wipe persistent sensitive data
    // (GPS coordinates + full-resolution photo base64) from shared-device storage.
    // Hook logout button clicks and the lfs:logout custom event.
    const logoutEls = document.querySelectorAll('[data-logout], #logout-btn, .logout-btn');
    logoutEls.forEach(el => el.addEventListener('click', clearOfflineQueue));
    window.addEventListener('lfs:logout', clearOfflineQueue);
    // Also clear on session expiry detected by other tabs/code.
    window.addEventListener('lfs:session-expired', clearOfflineQueue);
  }

  function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    state.currentPhoto = file;
    const reader = new FileReader();
    reader.onload = (evt) => {
      previewImg.src = evt.target.result;
      photoPreview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    photoInput.value = '';
    state.currentPhoto = null;
    photoPreview.style.display = 'none';
    previewImg.src = '';
  }

  function onGpsToggleChange() {
    if (gpsToggle.checked) {
      requestGpsCoordinates();
    } else {
      state.gpsCoordinates = null;
      gpsStatus.style.display = 'none';
      gpsStatus.textContent = '';
    }
  }

  function requestGpsCoordinates() {
    if (!navigator.geolocation) {
      gpsStatus.textContent = '❌ Geolocation not supported';
      gpsStatus.style.display = 'block';
      return;
    }

    gpsStatus.textContent = '📍 Capturing location...';
    gpsStatus.style.display = 'block';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.gpsCoordinates = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        const acc = Math.round(state.gpsCoordinates.accuracy);
        gpsStatus.textContent = `✅ Location captured (±${acc}m accuracy)`;
      },
      (err) => {
        state.gpsCoordinates = null;
        gpsStatus.textContent = `❌ Location denied or unavailable`;
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  async function onUpload() {
    if (!state.selectedProjectId) {
      showToast('Please select a project', 'error');
      return;
    }

    if (!state.currentPhoto) {
      showToast('Please select a photo', 'error');
      return;
    }

    if (state.uploading) return;
    state.uploading = true;
    uploadBtn.disabled = true;

    try {
      const formData = new FormData();
      formData.append('project_id', state.selectedProjectId);
      formData.append('photo', state.currentPhoto);
      formData.append('caption', captionInput.value);
      formData.append('taken_at', new Date().toISOString());

      if (state.gpsCoordinates) {
        formData.append('gps_lat', state.gpsCoordinates.lat);
        formData.append('gps_lon', state.gpsCoordinates.lon);
        formData.append('gps_accuracy_m', state.gpsCoordinates.accuracy);
      }

      const res = await fetch('/api/project-photos', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      showToast('Photo uploaded successfully', 'success');

      // Clear form
      clearPhoto();
      captionInput.value = '';
      state.selectedProjectId = null;
      projectPicker.value = '';
      state.gpsCoordinates = null;
      gpsStatus.style.display = 'none';
      gpsToggle.checked = true;

      // Refresh recent photos if that tab is visible
      if (recentProjectPicker.value) {
        loadRecentPhotos(recentProjectPicker.value);
      }
    } catch (e) {
      console.error('Upload error:', e);

      if (!navigator.onLine) {
        // Queue for offline retry — MED-2: include userId so drain skips
        // items enqueued by a different user on shared devices.
        const photoData = {
          projectId: state.selectedProjectId,
          caption: captionInput.value,
          gps: state.gpsCoordinates,
          timestamp: Date.now(),
          userId: state.user && state.user.id,
          photoBase64: await fileToBase64(state.currentPhoto)
        };

        queueOfflineUpload(photoData);
        showToast('Queued for upload when online', 'success');
        clearPhoto();
      } else {
        showToast(e.message || 'Upload failed', 'error');
      }
    } finally {
      state.uploading = false;
      uploadBtn.disabled = false;
    }
  }

  async function loadRecentPhotos(projectId) {
    try {
      const res = await fetch(`/api/project-photos?project_id=${projectId}&limit=50`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      recentGrid.innerHTML = '';
      if (data.rows.length === 0) {
        recentGrid.innerHTML = '<p class="text--muted">No photos yet</p>';
        return;
      }

      data.rows.forEach(photo => {
        const card = createPhotoCard(photo);
        recentGrid.appendChild(card);
      });
    } catch (e) {
      console.error('Load recent photos error:', e);
      recentGrid.innerHTML = '<p class="text--muted">Failed to load photos</p>';
    }
  }

  function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    // HIGH-2 fix: esc() all user-controlled values before inserting into innerHTML
    // to prevent stored XSS via malicious caption, uploader_name, or filename.
    card.innerHTML = `
      <img src="/api/project-photos/${esc(photo.id)}/download" alt="${esc(photo.filename)}" class="photo-card__img">
      <div class="photo-card__info">
        ${photo.caption ? `<div>${esc(photo.caption)}</div>` : ''}
        <div style="font-size: 0.7rem; opacity: 0.8;">${esc(photo.uploader_name || 'Unknown')}</div>
      </div>
    `;
    return card;
  }

  function switchTab(tabName) {
    // Update button states
    tabBtns.forEach(btn => {
      btn.classList.toggle('tab-bar__btn--active', btn.dataset.tab === tabName);
    });

    // Update content visibility
    tabContents.forEach(content => {
      content.classList.toggle('tab-content--active', content.id === `tab-${tabName}`);
    });

    // Load content if needed
    if (tabName === 'recent' && recentProjectPicker.value) {
      loadRecentPhotos(recentProjectPicker.value);
    } else if (tabName === 'mine') {
      loadMyPhotos();
    }
  }

  async function loadMyPhotos() {
    if (!state.user) return;

    try {
      const res = await fetch(`/api/project-photos?limit=50`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Note: this endpoint doesn't have a direct "my uploads" filter;
      // we'd need a dedicated endpoint or filter by user_id on the backend.
      // For now, show a placeholder message.
      mineGrid.innerHTML = '<p class="text--muted">My uploads feature coming soon</p>';
    } catch (e) {
      console.error('Load my photos error:', e);
      mineGrid.innerHTML = '<p class="text--muted">Failed to load your uploads</p>';
    }
  }

  // ── Offline queue (IndexedDB) — MED-2 hardened ───────────────────────────
  // Version 2 stores { userId, timestamp, ... } per item so:
  //   (a) drain skips items belonging to a different logged-in user
  //       (session-mismatch protection on shared / kiosk devices)
  //   (b) items older than QUEUE_TTL_MS (7 days) are purged on load
  //   (c) clearOfflineQueue() wipes IndexedDB on logout, removing persistent
  //       GPS coordinates + full-resolution photo base64 blobs

  function openIdb() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { autoIncrement: true });
        }
        // No schema changes needed for v2 — items simply gain new fields.
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  function queueOfflineUpload(photoData) {
    openIdb().then((db) => {
      const tx = db.transaction('queue', 'readwrite');
      tx.objectStore('queue').add(photoData);
    }).catch((e) => {
      console.error('IndexedDB queue error:', e);
    });
  }

  // MED-2: wipe all queued items from IndexedDB on logout.
  function clearOfflineQueue() {
    openIdb().then((db) => {
      const tx = db.transaction('queue', 'readwrite');
      tx.objectStore('queue').clear();
    }).catch((e) => {
      console.warn('IndexedDB clear error (non-fatal):', e);
    });
    state.offlineQueue = [];
  }

  function loadOfflineQueue() {
    openIdb().then((db) => {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      const allReq    = store.getAll();
      const allKeysReq = store.getAllKeys();

      let items = null;
      let keys  = null;

      function maybeProcess() {
        if (items === null || keys === null) return;
        const now = Date.now();
        const currentUserId = state.user && state.user.id;
        const keysToDelete = [];
        const validItems   = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const key  = keys[i];
          // MED-2(b): TTL purge — drop stale items.
          if (item.timestamp && (now - item.timestamp) > QUEUE_TTL_MS) {
            keysToDelete.push(key);
            continue;
          }
          // MED-2(a): skip items from other users on shared devices.
          // Items without a userId (legacy, pre-v2) are kept as-is.
          if (item.userId && currentUserId && item.userId !== currentUserId) {
            keysToDelete.push(key);
            continue;
          }
          validItems.push(item);
        }

        if (keysToDelete.length > 0) {
          const delTx = db.transaction('queue', 'readwrite');
          const delStore = delTx.objectStore('queue');
          keysToDelete.forEach(k => delStore.delete(k));
        }

        state.offlineQueue = validItems;
        if (navigator.onLine && validItems.length > 0) {
          drainOfflineQueue();
        }
      }

      allReq.onsuccess     = () => { items = allReq.result;     maybeProcess(); };
      allKeysReq.onsuccess = () => { keys  = allKeysReq.result; maybeProcess(); };
    }).catch((e) => {
      console.error('loadOfflineQueue IDB error:', e);
    });
  }

  async function drainOfflineQueue() {
    if (state.offlineQueue.length === 0) return;
    const currentUserId = state.user && state.user.id;

    for (const item of state.offlineQueue) {
      // MED-2(a): don't submit another user's queued photo via current session.
      if (item.userId && currentUserId && item.userId !== currentUserId) {
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('project_id', item.projectId);
        formData.append('photo', await base64ToBlob(item.photoBase64, 'image/jpeg'));
        formData.append('caption', item.caption || '');
        formData.append('taken_at', new Date(item.timestamp).toISOString());

        if (item.gps) {
          formData.append('gps_lat', item.gps.lat);
          formData.append('gps_lon', item.gps.lon);
          formData.append('gps_accuracy_m', item.gps.accuracy);
        }

        const res = await fetch('/api/project-photos', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (res.ok) {
          // Remove from queue
          state.offlineQueue = state.offlineQueue.filter(q => q !== item);
          saveOfflineQueueToDb();
        }
      } catch (e) {
        console.error('Offline queue item failed:', e);
      }
    }
  }

  function saveOfflineQueueToDb() {
    openIdb().then((db) => {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.clear();
      state.offlineQueue.forEach(item => store.add(item));
    }).catch((e) => {
      console.error('saveOfflineQueueToDb error:', e);
    });
  }

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function base64ToBlob(base64, mimeType) {
    const bstr = atob(base64.split(',')[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mimeType });
  }
})();
