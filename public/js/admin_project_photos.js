/**
 * Wave 62: Admin Project Photos Module
 *
 * Loads and renders field photos uploaded via the mobile Photos PWA.
 * Exposes window.AdminProjectPhotos.load(projectId)
 */

window.AdminProjectPhotos = (function() {

  const state = { projectId: null, offset: 0, limit: 12, total: 0 };

  /**
   * Load and render project field photos
   * @param {string} projectId - UUID of the project
   */
  async function load(projectId) {
    if (!projectId) {
      console.warn('AdminProjectPhotos.load: projectId required');
      return;
    }

    state.projectId = projectId;
    state.offset = 0;
    state.total = 0;

    const gridEl = document.getElementById('proj-photos-grid');
    const countEl = document.getElementById('proj-photos-count');

    if (!gridEl || !countEl) {
      console.warn('AdminProjectPhotos.load: proj-photos-grid or proj-photos-count element not found');
      return;
    }

    gridEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px">Loading photos…</p>';

    await fetchAndAppend(true);
  }

  /**
   * Fetch photos from API and append to grid
   * @param {boolean} replace - if true, replace grid; if false, append
   */
  async function fetchAndAppend(replace) {
    const gridEl = document.getElementById('proj-photos-grid');
    const countEl = document.getElementById('proj-photos-count');
    const loadMoreBtn = document.getElementById('proj-photos-load-more');

    if (!gridEl || !countEl) return;

    try {
      const params = new URLSearchParams({
        project_id: state.projectId,
        limit: state.limit,
        offset: state.offset
      });

      const response = await api(`/api/project-photos?${params}`, 'GET');
      const { rows, total } = response;

      state.total = total;

      if (rows.length === 0 && state.offset === 0) {
        // No photos at all
        gridEl.innerHTML = `
          <p style="padding:12px;text-align:center;color:var(--text-muted);font-size:13px">
            No photos uploaded yet.
            <a href="/photos/" target="_blank" style="color:var(--primary)">Upload in the Photos PWA</a>.
          </p>
        `;
        countEl.textContent = '(0)';
        return;
      }

      // Update count
      countEl.textContent = `(${total})`;

      // Build thumbnail grid
      let html = '';
      rows.forEach((photo) => {
        const photoId = escUrl(photo.id);
        const caption = esc(photo.caption || photo.filename || 'photo');
        const hasGPS = photo.gps_lat && photo.gps_lon;
        const gpsText = hasGPS ? `${photo.gps_lat.toFixed(5)}, ${photo.gps_lon.toFixed(5)}` : 'No GPS';
        const takenAt = photo.taken_at ? new Date(photo.taken_at).toLocaleString() : 'Unknown';
        const uploadedAt = photo.uploaded_at ? new Date(photo.uploaded_at).toLocaleString() : 'Unknown';
        const uploaderName = esc(photo.uploader_name || 'Unknown user');

        html += `
          <div
            class="proj-photo-thumbnail"
            style="
              cursor:pointer;
              width:120px;
              height:120px;
              margin:8px;
              border:1px solid var(--border-weak);
              border-radius:6px;
              overflow:hidden;
              background:var(--surface-3);
              position:relative;
              flex-shrink:0;
            "
            onclick="window.AdminProjectPhotos.showLightbox('${photoId}', '${esc(caption)}', '${uploaderName}', '${uploadedAt}', '${gpsText}')"
            title="${caption}"
          >
            <img
              src="/api/project-photos/${photoId}/download"
              style="width:100%;height:100%;object-fit:cover"
              alt="${caption}"
              loading="lazy"
            />
          </div>
        `;
      });

      if (replace) {
        gridEl.innerHTML = html;
      } else {
        gridEl.innerHTML += html;
      }

      // Show/hide load-more button
      const hasMore = state.offset + state.limit < state.total;
      if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
      }

    } catch (err) {
      console.error('AdminProjectPhotos.fetchAndAppend:', err);
      gridEl.innerHTML = `
        <p style="color:var(--danger-text);font-size:13px">
          Failed to load photos. Please refresh.
        </p>
      `;
    }
  }

  /**
   * Display a lightbox modal with full-size photo + metadata
   */
  function showLightbox(photoId, caption, uploaderName, uploadedAt, gpsText) {
    // Remove any existing lightbox
    const existing = document.getElementById('proj-photos-lightbox');
    if (existing) existing.remove();

    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.id = 'proj-photos-lightbox';
    lightbox.style.cssText = `
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.8);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:10000;
    `;

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.remove();
    });

    // Close on Escape key
    const keyListener = (e) => {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.removeEventListener('keydown', keyListener);
      }
    };
    document.addEventListener('keydown', keyListener);

    // Content container
    const content = document.createElement('div');
    content.style.cssText = `
      background:var(--surface-2);
      border-radius:8px;
      max-width:90vw;
      max-height:90vh;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      box-shadow:0 4px 20px rgba(0,0,0,0.3);
    `;

    // Header with close button
    const header = document.createElement('div');
    header.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:12px 16px;
      border-bottom:1px solid var(--border-weak);
      background:var(--surface-3);
    `;

    const title = document.createElement('span');
    title.style.cssText = 'font-weight:600;color:var(--text);font-size:14px;flex:1;word-break:break-all';
    title.textContent = caption;
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.style.cssText = `
      background:none;
      border:none;
      font-size:18px;
      cursor:pointer;
      color:var(--text);
      padding:4px 8px;
    `;
    closeBtn.onclick = () => lightbox.remove();
    header.appendChild(closeBtn);
    content.appendChild(header);

    // Image container
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
      flex:1;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#000;
      overflow:auto;
      padding:16px;
    `;

    const img = document.createElement('img');
    img.src = `/api/project-photos/${photoId}/download`;
    img.style.cssText = `
      max-width:100%;
      max-height:100%;
      object-fit:contain;
    `;
    imgContainer.appendChild(img);
    content.appendChild(imgContainer);

    // Metadata footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding:12px 16px;
      border-top:1px solid var(--border-weak);
      background:var(--surface-3);
      font-size:12px;
      color:var(--text-secondary);
    `;

    const metaLines = [
      `<strong>Uploaded:</strong> ${uploadedAt}`,
      `<strong>By:</strong> ${uploaderName}`,
      `<strong>GPS:</strong> ${gpsText}`
    ];

    footer.innerHTML = metaLines.map(line => `<div style="margin:4px 0">${line}</div>`).join('');
    content.appendChild(footer);

    lightbox.appendChild(content);
    document.body.appendChild(lightbox);
  }

  // Load more button click handler
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'proj-photos-load-more') {
      state.offset += state.limit;
      fetchAndAppend(false);
    }
  });

  return {
    load,
    showLightbox
  };
})();
