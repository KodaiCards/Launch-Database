// Launch Fiber Photos — PWA app logic (IIFE)
(function() {
  'use strict';

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
        // Queue for offline retry
        const photoData = {
          projectId: state.selectedProjectId,
          caption: captionInput.value,
          gps: state.gpsCoordinates,
          timestamp: Date.now(),
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

  // Offline queue (IndexedDB)
  function queueOfflineUpload(photoData) {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported');
      return;
    }

    const request = indexedDB.open('LaunchFiberPhotos', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.add(photoData);
    };

    request.onerror = (e) => {
      console.error('IndexedDB error:', e);
    };
  }

  function loadOfflineQueue() {
    if (!('indexedDB' in window)) return;

    const request = indexedDB.open('LaunchFiberPhotos', 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) return;

      const tx = db.transaction('queue', 'readonly');
      const store = tx.objectStore('queue');
      const allReq = store.getAll();

      allReq.onsuccess = () => {
        state.offlineQueue = allReq.result;
        if (navigator.onLine && state.offlineQueue.length > 0) {
          drainOfflineQueue();
        }
      };
    };
  }

  async function drainOfflineQueue() {
    if (state.offlineQueue.length === 0) return;

    for (const item of state.offlineQueue) {
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
    if (!('indexedDB' in window)) return;

    const request = indexedDB.open('LaunchFiberPhotos', 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.clear();

      state.offlineQueue.forEach(item => {
        store.add(item);
      });
    };
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
