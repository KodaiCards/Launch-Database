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
  // Local helper — only loadPermits reads this.
  function pipelineViz(currentIdx) {
    return '<div class="pipeline">' + STAGES.map((s, i) => {
      const dot = `<div class="pipeline-dot${i < currentIdx ? ' done' : i === currentIdx ? ' current' : ''}"></div>`;
      const line = i > 0 ? `<div class="pipeline-line${i <= currentIdx ? ' done' : ''}"></div>` : '';
      return line + dot;
    }).join('') + '</div>';
  }

  async function loadPermits() {
    const permits = await api('/api/permits');
    const stageFilter = document.getElementById('perm-stage-filter').value;
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
          ${currentIdx < STAGES.length - 1 ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();advancePermit('${p.id}')">→ ${STAGE_LABELS[STAGES[currentIdx + 1]]}</button>` : '<span style="color:var(--success);font-size:12px"><i class="fa-solid fa-check"></i> Done</span>'}
          <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();openPermitDocs('${p.id}','${esc(p.name)}')" title="Documents"><i class="fa-solid fa-paperclip"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="event.stopPropagation();confirmDeleteProject('${p.id}','${esc(p.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  async function advancePermit(projectId) {
    // No name prompt — server uses the original creator's name (stored at
    // permit creation) or 'unknown' as a fallback.
    await api('/api/permits/' + projectId + '/advance', 'PUT', {});
    loadPermits();
    if (typeof loadDashboard === 'function') loadDashboard();
  }

  // Advance a permit from inside the project detail popup, then reload the
  // popup contents so the new stage shows immediately.
  async function advancePermitFromPopup(projectId) {
    await api('/api/permits/' + projectId + '/advance', 'PUT', {});
    const yEl = document.getElementById('rev-year');
    const y = (yEl && yEl.value) || String(new Date().getFullYear());
    const m = (typeof revSelectedMonth !== 'undefined') ? revSelectedMonth : null;
    if (typeof reloadProjectDetail === 'function') reloadProjectDetail(projectId, m, y);
    if (typeof loadPermits === 'function') loadPermits();
    if (typeof loadDashboard === 'function') loadDashboard();
  }

  function openPermitDocs(projectId, name) {
    window.currentPermitProjectId = projectId;
    document.getElementById('permit-doc-title').textContent = 'Documents — ' + name;
    openModal('permit-doc-modal');
    loadPermitDocs(projectId);
  }

  async function loadPermitDocs(projectId) {
    const permits = await api('/api/permits');
    const p = permits.find(x => x.id === projectId);
    const docs = p?.documents || [];
    const list = document.getElementById('permit-doc-list');
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
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-border)">
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

  async function deletePermitDoc(docId) {
    if (!confirm('Delete this document? The file is removed from disk too.')) return;
    try {
      const r = await fetch('/api/projects/documents/' + docId, { method: 'DELETE' });
      if (!r.ok) throw new Error('Delete failed: ' + r.status);
      // Re-render the docs list against the current project.
      if (window.currentPermitProjectId) loadPermitDocs(window.currentPermitProjectId);
    } catch (e) { alert(e.message); }
  }

  async function uploadDoc() {
    const file = document.getElementById('doc-file').files[0];
    const projectId = window.currentPermitProjectId;
    if (!file || !projectId) return alert('Select a file first');
    if (file.size > 2 * 1024 * 1024 * 1024) return alert('File exceeds 2 GB limit (got ' + (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB)');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('doc_type', document.getElementById('doc-type').value);
    fd.append('revision_number', document.getElementById('doc-rev').value);
    fd.append('uploaded_by', document.getElementById('doc-uploader').value);
    try {
      const r = await fetch('/api/permits/' + projectId + '/documents', { method: 'POST', body: fd });
      if (!r.ok) {
        const j = await r.json().catch(() => ({ error: 'Upload failed: ' + r.status }));
        throw new Error(j.error || 'Upload failed');
      }
      document.getElementById('doc-file').value = '';
      loadPermitDocs(projectId);
    } catch (e) { alert('Upload failed: ' + e.message); }
  }

  window.loadPermits = loadPermits;
  window.advancePermit = advancePermit;
  window.advancePermitFromPopup = advancePermitFromPopup;
  window.openPermitDocs = openPermitDocs;
  window.loadPermitDocs = loadPermitDocs;
  window.uploadDoc = uploadDoc;
  window.deletePermitDoc = deletePermitDoc;
})();
