// public/js/permits_tab.js — Admin Permitting tab.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Renders the 5-stage permit pipeline (potential → started → submitted →
// approved → checklist) with stage-summary tiles, stage filter, advance
// buttons, regress, paperclip → permit docs, and inline delete. Also
// owns the Permit Docs modal (file list + upload).
//
// Globals this module reads:
//   STAGES, STAGE_LABELS         — global pipeline constants
//   api(), esc(), escUrl()       — global helpers
//   showProjectDetail()          — global drilldown
//   confirmDeleteProject()       — global delete confirm
//   regressPermit()              — exposed by design_potential_tabs.js
//   loadDashboard()              — global dashboard refresh
//   reloadProjectDetail()        — popup reloader (still inline)
//   revSelectedMonth             — revenue-tab month state
//   openModal(), closeModal()    — modal helpers
//
// Functions exposed on window:
//   loadPermits, advancePermit, advancePermitFromPopup,
//   openPermitDocs, loadPermitDocs, uploadDoc, deletePermitDoc

(function () {
  // Per-project document cache (M-5). Avoids re-fetching the full /api/permits
  // list on every modal open. Keys: projectId (string), values: docs array.
  // Busted after a successful upload so the next loadPermitDocs sees fresh data.
  const _permitDocCache = new Map();

  // Local helper — only loadPermits reads this.
  function pipelineViz(currentIdx) {
    return '<div class="pipeline">' + STAGES.map((s, i) => {
      const dot = `<div class="pipeline-dot${i < currentIdx ? ' done' : i === currentIdx ? ' current' : ''}"></div>`;
      const line = i > 0 ? `<div class="pipeline-line${i <= currentIdx ? ' done' : ''}"></div>` : '';
      return line + dot;
    }).join('') + '</div>';
  }

  async function loadPermits() {
    let permits;
    try {
      permits = await api('/api/permits');
    } catch (e) {
      const tbody = document.getElementById('permits-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="empty-state" style="color:var(--danger)">Failed to load permits: ${esc(e.message)}</td></tr>`;
      return;
    }
    const stageFilter = document.getElementById('perm-stage-filter')?.value || '';
    // Stage summary bar
    const bar = document.getElementById('permit-stage-bar');
    const stageCounts = {};
    STAGES.forEach(s => stageCounts[s] = permits.filter(p => {
      const stages = p.stages || [];
      const incomplete = stages.find(st => !st.completed_at);
      return incomplete?.stage === s;
    }).length);
    bar.innerHTML = STAGES.map(s => `
      <div class="stat-card" style="padding:10px 12px;cursor:pointer" onclick="document.getElementById('perm-stage-filter').value='${s}';loadPermits()">
        <div class="stat-label" style="font-size:10px">${STAGE_LABELS[s]}</div>
        <div style="font-size:20px;font-weight:700">${stageCounts[s]}</div>
      </div>`).join('');

    const filtered = stageFilter ? permits.filter(p => {
      const incomplete = (p.stages || []).find(st => !st.completed_at);
      return incomplete?.stage === stageFilter;
    }) : permits;

    // Sort: further-along stages on top. Items at "billed" go above "approved",
    // approved above "submitted", etc. Within a stage, most-recently-updated first.
    const stageOf = (p) => {
      const stages = p.stages || [];
      const incomplete = stages.find(s => !s.completed_at);
      return incomplete?.stage || stages[stages.length - 1]?.stage || 'potential';
    };
    filtered.sort((a, b) => {
      const sa = STAGES.indexOf(stageOf(a));
      const sb = STAGES.indexOf(stageOf(b));
      if (sa !== sb) return sb - sa;
      return (b.updated_at || '').localeCompare(a.updated_at || '');
    });

    const tbody = document.getElementById('permits-body');
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-file-signature"></i><p>No permits found</p></div></td></tr>'; return; }

    tbody.innerHTML = filtered.map(p => {
      const stages = p.stages || [];
      const currentStage = stages.find(s => !s.completed_at);
      const currentStageName = currentStage?.stage || stages[stages.length - 1]?.stage || 'potential';
      const currentIdx = STAGES.indexOf(currentStageName);
      const docs = p.documents || [];
      return `<tr onclick="showProjectDetail('${p.id}')" style="cursor:pointer">
        <td class="td-name">${esc(p.name)}<br><span style="font-size:11px;color:var(--text-muted)">${docs.length} doc${docs.length !== 1 ? 's' : ''}</span></td>
        <td>${esc(p.client_name || '—')}</td>
        <td class="td-mono">${esc(p.work_order_number || '—')}</td>
        <td style="white-space:nowrap">${p.footage ? Math.round(p.footage).toLocaleString() + ' LF' : '—'}</td>
        <td><span class="badge badge-stage-${currentStageName}">${STAGE_LABELS[currentStageName] || currentStageName}</span></td>
        <td>${pipelineViz(currentIdx)}</td>
        <td style="white-space:nowrap">
          ${currentIdx > 0 ? `<button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();regressPermit('${p.id}','${esc(p.name)}')" title="Move back one stage"><i class="fa-solid fa-backward-step"></i></button>` : ''}
          ${currentIdx < STAGES.length - 1 ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();advancePermit('${p.id}',this)">→ ${STAGE_LABELS[STAGES[currentIdx + 1]]}</button>` : '<span style="color:var(--success);font-size:12px"><i class="fa-solid fa-check"></i> Done</span>'}
          <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();openPermitDocs('${p.id}','${esc(p.name)}')" title="Documents"><i class="fa-solid fa-paperclip"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="event.stopPropagation();confirmDeleteProject('${p.id}','${esc(p.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  async function advancePermit(projectId, btn) {
    // Double-submit guard: disable the clicked Advance button for the duration
    // of the API call. loadPermits() re-renders the row so we don't need to
    // re-enable on success (the button is destroyed by the re-render).
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; }
    try {
      await api('/api/permits/' + projectId + '/advance', 'PUT', {});
      loadPermits();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch (e) {
      if (btn) { btn.disabled = false; btn.innerHTML = '→ Next'; }
      alertDialog({ title: 'Advance failed', message: e.message });
    }
  }

  // Advance a permit from inside the project detail popup, then reload the
  // popup contents so the new stage shows immediately.
  async function advancePermitFromPopup(projectId) {
    try {
      await api('/api/permits/' + projectId + '/advance', 'PUT', {});
      // Success-only: only reload popup/lists after a confirmed advance
      const yEl = document.getElementById('rev-year');
      const y = (yEl && yEl.value) || String(new Date().getFullYear());
      const m = (typeof revSelectedMonth !== 'undefined') ? revSelectedMonth : null;
      if (typeof reloadProjectDetail === 'function') reloadProjectDetail(projectId, m, y);
      if (typeof loadPermits === 'function') loadPermits();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch (e) {
      alertDialog({ title: 'Advance failed', message: e.message });
    }
  }

  function openPermitDocs(projectId, name) {
    window.currentPermitProjectId = projectId;
    document.getElementById('permit-doc-title').textContent = 'Documents — ' + name;
    // Pre-fill uploader field with logged-in user's display name so staff
    // don't have to type it on every upload.
    const uploaderEl = document.getElementById('doc-uploader');
    if (uploaderEl) {
      uploaderEl.value = (window.currentUser && (window.currentUser.full_name || window.currentUser.username)) || '';
    }
    openModal('permit-doc-modal');
    loadPermitDocs(projectId);
  }

  async function loadPermitDocs(projectId) {
    const list = document.getElementById('permit-doc-list');
    let docs;
    if (_permitDocCache.has(String(projectId))) {
      // Use in-memory cache — avoids a full /api/permits fetch on modal open.
      docs = _permitDocCache.get(String(projectId));
    } else {
      let permits;
      try {
        permits = await api('/api/permits');
      } catch (e) {
        if (list) list.innerHTML = `<p style="color:var(--danger);font-size:13px">Failed to load documents: ${esc(e.message)}</p>`;
        return;
      }
      const p = permits.find(x => x.id === projectId);
      docs = p?.documents || [];
      _permitDocCache.set(String(projectId), docs);
    }
    if (!docs.length) { list.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No documents uploaded yet.</p>'; return; }
    list.innerHTML = docs.map(d => {
      const ext = (d.file_name.split('.').pop() || '').toLowerCase();
      const iconCls = ext === 'pdf' ? 'fa-file-pdf'
        : (ext === 'dwg' || ext === 'dxf') ? 'fa-compass-drafting'
        : (ext === 'png' || ext === 'jpg' || ext === 'jpeg') ? 'fa-image'
        : (ext === 'doc' || ext === 'docx') ? 'fa-file-word'
        : (ext === 'zip') ? 'fa-file-zipper'
        : 'fa-file';
      const iconColor = ext === 'pdf' ? 'var(--danger)'
        : (ext === 'dwg' || ext === 'dxf') ? 'var(--primary)'
        : 'var(--text-muted)';
      const sizeMb = d.file_size ? (d.file_size / 1024 / 1024).toFixed(1) + ' MB' : '';
      // DWG/DXF can't render in browser — offer Download instead of View.
      const action = (ext === 'dwg' || ext === 'dxf' || ext === 'zip')
        ? `<a href="/uploads/${escUrl(d.file_path)}" download="${esc(d.file_name)}" class="btn btn-sm btn-secondary"><i class="fa-solid fa-download"></i></a>`
        : `<a href="/uploads/${escUrl(d.file_path)}" target="_blank" class="btn btn-sm btn-secondary"><i class="fa-solid fa-arrow-up-right-from-square"></i> View</a>`;
      return `
      <div data-doc-id="${esc(d.id)}" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-border)">
        <i class="fa-solid ${iconCls}" style="color:${iconColor};font-size:18px"></i>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.file_name)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${esc(d.doc_type)} · Rev ${d.revision_number} · ${sizeMb} · ${esc(d.uploaded_by || 'Unknown')} · ${new Date(d.created_at).toLocaleDateString()}</div>
        </div>
        ${action}
        <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deletePermitDoc('${d.id}')" title="Delete file"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    }).join('');
  }

  // After delete, just remove that one row from the DOM. Avoids
  // re-fetching /api/permits (which pulls every project's stages and
  // documents) just to render this modal one row shorter.
  function deletePermitDoc(docId) {
    return deleteProjectDoc(docId, () => {
      const list = document.getElementById('permit-doc-list');
      const row = list && list.querySelector('[data-doc-id="' + CSS.escape(docId) + '"]');
      if (row) row.remove();
      if (list && !list.querySelector('[data-doc-id]')) {
        list.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No documents uploaded yet.</p>';
      }
      // Bust cache so a subsequent re-open reflects the deletion.
      if (window.currentPermitProjectId) _permitDocCache.delete(String(window.currentPermitProjectId));
    });
  }

  async function uploadDoc() {
    const file = document.getElementById('doc-file').files[0];
    const projectId = window.currentPermitProjectId;
    if (!file || !projectId) { await alertDialog({ title: 'No file selected', message: 'Select a file first.' }); return; }
    if (file.size > 2 * 1024 * 1024 * 1024) { await alertDialog({ title: 'File too large', message: 'File exceeds 2 GB limit (got ' + (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB).' }); return; }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('doc_type', document.getElementById('doc-type').value);
    fd.append('revision_number', document.getElementById('doc-rev').value);
    fd.append('uploaded_by', document.getElementById('doc-uploader').value);

    const btn = document.getElementById('permit-doc-upload-btn');
    const wrap = document.getElementById('permit-doc-progress-wrap');
    const bar = document.getElementById('permit-doc-progress-bar');
    const pct = document.getElementById('permit-doc-progress-pct');
    const lbl = document.getElementById('permit-doc-progress-label');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading…'; }
    if (wrap) {
      wrap.style.display = '';
      bar.style.width = '0';
      pct.textContent = '0%';
      lbl.textContent = `Uploading ${(file.size / 1024 / 1024).toFixed(1)} MB…`;
    }
    try {
      await apiUpload('/api/permits/' + projectId + '/documents', fd, {
        onProgress: (loaded, total) => {
          if (!wrap) return;
          const p = total ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
          bar.style.width = p + '%';
          bar.setAttribute('aria-valuenow', p);
          pct.textContent = p + '%';
          if (p >= 100) lbl.textContent = 'Saving on server…';
        },
      });
      document.getElementById('doc-file').value = '';
      // Bust cache so the post-upload reload fetches fresh server-side data.
      _permitDocCache.delete(String(projectId));
      loadPermitDocs(projectId);
    } catch (e) {
      await alertDialog({ title: 'Upload failed', message: e.message });
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-upload"></i> Upload'; }
      if (wrap) wrap.style.display = 'none';
    }
  }

  window.loadPermits = loadPermits;
  window.advancePermit = advancePermit;
  window.advancePermitFromPopup = advancePermitFromPopup;
  window.openPermitDocs = openPermitDocs;
  window.loadPermitDocs = loadPermitDocs;
  window.uploadDoc = uploadDoc;
  window.deletePermitDoc = deletePermitDoc;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  // Mirror the debounce pattern used by billing_tab.js, hours_tab.js etc.
  // Permit events were previously only caught by the 60s recovery poll;
  // now they trigger an immediate (debounced 500ms) reload on the active view.
  let _permitStaleTimer = null;
  let _permitStale = false;

  function _permitDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'permitting') {
      _permitStale = true;
      return;
    }
    clearTimeout(_permitStaleTimer);
    _permitStaleTimer = setTimeout(loadPermits, 500);
  }

  ['permit_added', 'permit_updated', 'permit_deleted',
   'project_added', 'project_updated', 'project_deleted',
  ].forEach(ev => document.addEventListener('sse:' + ev, _permitDebounce));

  (window._showViewHooks = window._showViewHooks || []).push(function(view) {
    if (view === 'permitting' && _permitStale) {
      _permitStale = false;
      clearTimeout(_permitStaleTimer);
      _permitStaleTimer = setTimeout(loadPermits, 100);
    }
  });
})();
