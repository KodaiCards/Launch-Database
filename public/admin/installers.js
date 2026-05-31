/* public/admin/installers.js — Desktop Installers admin page (Wave 238)
 * Drag-and-drop upload + list/delete. Exposed as window.Installers.
 */
(function () {
  'use strict';

  const MANIFEST_URL = '/api/downloads/manifest';
  const UPLOAD_URL   = '/api/admin/downloads/installers';
  const DELETE_URL   = (filename) => `/api/admin/downloads/installers/${encodeURIComponent(filename)}`;
  const MAX_BYTES    = 200 * 1024 * 1024;
  const ALLOWED_RE   = /\.(exe|dmg|deb|AppImage)$/i;

  // ── DOM ──
  const $ = (id) => document.getElementById(id);
  let dropZone, fileInput, progressWrap, progressName, progressPct, progressFill;
  let listSkeleton, listEmpty, listError, listErrorMsg, listTableWrap, listTbody;
  let uploading = false;

  // ── Toast helper (AppShell.toast fallback to alert) ──
  function toast(msg, kind) {
    if (window.AppShell && typeof AppShell.toast === 'function') {
      AppShell.toast(msg, kind || 'info');
    } else {
      // eslint-disable-next-line no-alert
      alert(msg);
    }
  }

  function fmtBytes(n) {
    if (!Number.isFinite(n) || n <= 0) return '—';
    const mb = n / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = n / 1024;
    return `${kb.toFixed(0)} KB`;
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function platformLabel(p) {
    if (p === 'windows') return { label: 'Windows', icon: 'fa-brands fa-windows' };
    if (p === 'macos')   return { label: 'macOS',   icon: 'fa-brands fa-apple' };
    return { label: 'Linux', icon: 'fa-brands fa-linux' };
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── State transitions ──
  function showState(name) {
    listSkeleton.hidden = name !== 'loading';
    listSkeleton.setAttribute('aria-hidden', name === 'loading' ? 'false' : 'true');
    listEmpty.hidden    = name !== 'empty';
    listError.hidden    = name !== 'error';
    listTableWrap.hidden = name !== 'table';
  }

  // ── List load ──
  async function refresh() {
    showState('loading');
    try {
      const r = await fetch(MANIFEST_URL, { credentials: 'same-origin' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const installers = Array.isArray(data && data.installers) ? data.installers : [];
      renderList(installers);
    } catch (e) {
      listErrorMsg.textContent = (e && e.message) ? `Failed to load: ${e.message}` : 'Failed to load installers.';
      showState('error');
    }
  }

  function renderList(installers) {
    if (installers.length === 0) {
      showState('empty');
      return;
    }
    // Newest first
    const sorted = installers.slice().sort((a, b) => {
      const ta = a.released_at ? Date.parse(a.released_at) : 0;
      const tb = b.released_at ? Date.parse(b.released_at) : 0;
      return tb - ta;
    });

    const rows = sorted.map((inst) => {
      const plat = platformLabel(inst.platform);
      return `
        <tr data-filename="${escapeHtml(inst.filename)}">
          <td>
            <span class="platform-badge ${escapeHtml(inst.platform || 'linux')}">
              <i class="${plat.icon}" aria-hidden="true"></i> ${plat.label}
            </span>
          </td>
          <td class="filename-cell">${escapeHtml(inst.filename)}</td>
          <td>${fmtBytes(inst.size_bytes)}</td>
          <td>${fmtDate(inst.released_at)}</td>
          <td class="col-actions">
            <button type="button" class="btn-delete" data-filename="${escapeHtml(inst.filename)}" aria-label="Delete ${escapeHtml(inst.filename)}">
              <i class="fa-solid fa-trash" aria-hidden="true"></i> Delete
            </button>
          </td>
        </tr>`;
    }).join('');

    listTbody.innerHTML = rows;
    showState('table');

    // Wire delete buttons
    listTbody.querySelectorAll('button.btn-delete').forEach((btn) => {
      btn.addEventListener('click', onDeleteClick);
    });
  }

  // ── Delete ──
  async function onDeleteClick(ev) {
    const btn = ev.currentTarget;
    const filename = btn.getAttribute('data-filename');
    if (!filename) return;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;

    btn.disabled = true;
    try {
      const r = await fetch(DELETE_URL(filename), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      toast(`Deleted "${filename}"`, 'success');
      refresh();
    } catch (e) {
      btn.disabled = false;
      toast((e && e.message) ? `Delete failed: ${e.message}` : 'Delete failed', 'error');
    }
  }

  // ── Upload ──
  function validateFile(file) {
    if (!file) return 'No file selected.';
    if (!ALLOWED_RE.test(file.name)) return 'Only .exe, .dmg, .deb, or .AppImage files are allowed.';
    if (file.size > MAX_BYTES) return `File too large (${fmtBytes(file.size)}). Max 200 MB.`;
    if (file.size === 0) return 'File is empty.';
    return null;
  }

  function setProgress(name, pct) {
    progressWrap.hidden = false;
    progressName.textContent = name;
    const p = Math.max(0, Math.min(100, Math.round(pct)));
    progressPct.textContent = `${p}%`;
    progressFill.style.width = `${p}%`;
  }

  function clearProgress() {
    progressWrap.hidden = true;
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';
    progressName.textContent = '';
  }

  function uploadFile(file) {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('installer', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);
      xhr.withCredentials = true;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(file.name, (e.loaded / e.total) * 100);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText || '{}')); }
          catch (_) { resolve({}); }
        } else {
          let msg = `HTTP ${xhr.status}`;
          try { const body = JSON.parse(xhr.responseText || '{}'); if (body && body.error) msg = body.error; }
          catch (_) {}
          reject(new Error(msg));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.onabort = () => reject(new Error('Upload aborted'));
      xhr.send(form);
    });
  }

  async function handleFile(file) {
    if (uploading) return;
    const err = validateFile(file);
    if (err) { toast(err, 'error'); return; }

    uploading = true;
    setProgress(file.name, 0);
    try {
      await uploadFile(file);
      toast(`Uploaded "${file.name}"`, 'success');
      clearProgress();
      refresh();
    } catch (e) {
      clearProgress();
      toast((e && e.message) ? `Upload failed: ${e.message}` : 'Upload failed', 'error');
    } finally {
      uploading = false;
      // Reset file input so the same file can be re-picked after a failure
      if (fileInput) fileInput.value = '';
    }
  }

  // ── Drag/drop wiring ──
  function wireDropZone() {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    $('btn-pick').addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) handleFile(f);
    });

    ['dragenter', 'dragover'].forEach((evt) => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('is-dragging');
      });
    });
    ['dragleave', 'drop'].forEach((evt) => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (evt === 'dragleave' && e.target !== dropZone) return;
        dropZone.classList.remove('is-dragging');
      });
    });
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length > 0) handleFile(files[0]);
    });
  }

  // ── Public API ──
  function init() {
    dropZone      = $('drop-zone');
    fileInput     = $('file-input');
    progressWrap  = $('upload-progress');
    progressName  = $('progress-name');
    progressPct   = $('progress-pct');
    progressFill  = $('progress-fill');
    listSkeleton  = $('list-skeleton');
    listEmpty     = $('list-empty');
    listError     = $('list-error');
    listErrorMsg  = $('list-error-msg');
    listTableWrap = $('list-table-wrap');
    listTbody     = $('list-tbody');

    if (!dropZone || !listTbody) return;  // page not loaded

    wireDropZone();
    refresh();
  }

  window.Installers = { init, refresh };
}());
