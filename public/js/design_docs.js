// public/js/design_docs.js — Design project Final Map docs modal.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Simpler than permit docs: no doc-type selector, no revision tracking,
// no checklist. Just "Final Map" — drop a PDF/DWG and go.
//
// Globals this module reads:
//   api(), esc(), escUrl()      — global helpers
//   openModal()                 — modal helper
//
// Functions exposed on window:
//   openDesignDocs, loadDesignDocs, uploadDesignDoc, deleteDesignDoc

(function () {
  let currentDesignProjectId = null;

  function openDesignDocs(projectId, name) {
    currentDesignProjectId = projectId;
    document.getElementById('design-doc-title').textContent = 'Final Map — ' + name;
    openModal('design-doc-modal');
    loadDesignDocs(projectId);
  }

  async function loadDesignDocs(projectId) {
    try {
      const docs = await api('/api/projects/' + projectId + '/documents');
      const list = document.getElementById('design-doc-list');
      if (!docs.length) {
        list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:12px">No final map uploaded yet.</p>';
        return;
      }
      list.innerHTML = docs.map(d => {
        const ext = (d.file_name.split('.').pop() || '').toLowerCase();
        const iconCls = ext === 'pdf' ? 'fa-file-pdf'
          : (ext === 'dwg' || ext === 'dxf') ? 'fa-compass-drafting'
          : (ext === 'png' || ext === 'jpg' || ext === 'jpeg') ? 'fa-image'
          : (ext === 'zip') ? 'fa-file-zipper'
          : 'fa-file';
        const iconColor = ext === 'pdf' ? 'var(--danger)'
          : (ext === 'dwg' || ext === 'dxf') ? 'var(--primary)'
          : 'var(--text-muted)';
        const sizeMb = d.file_size ? (d.file_size / 1024 / 1024).toFixed(1) + ' MB' : '';
        const action = (ext === 'dwg' || ext === 'dxf' || ext === 'zip')
          ? `<a href="/uploads/${escUrl(d.file_path)}" download="${esc(d.file_name)}" class="btn btn-sm btn-secondary" title="Download (browser cannot preview ${ext.toUpperCase()})"><i class="fa-solid fa-download"></i></a>`
          : `<a href="/uploads/${escUrl(d.file_path)}" target="_blank" class="btn btn-sm btn-secondary"><i class="fa-solid fa-arrow-up-right-from-square"></i> View</a>`;
        return `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-border)">
          <i class="fa-solid ${iconCls}" style="color:${iconColor};font-size:20px"></i>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.file_name)}</div>
            <div style="font-size:11px;color:var(--text-muted)">${sizeMb} · ${esc(d.uploaded_by || 'Unknown')} · ${new Date(d.created_at).toLocaleString()}</div>
          </div>
          ${action}
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteDesignDoc('${d.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>`;
      }).join('');
    } catch (e) {
      document.getElementById('design-doc-list').innerHTML =
        '<p style="color:var(--danger);font-size:13px">Failed to load: ' + esc(e.message) + '</p>';
    }
  }

  async function uploadDesignDoc() {
    const file = document.getElementById('design-doc-file').files[0];
    if (!file || !currentDesignProjectId) return alert('Select a file first');
    if (file.size > 2 * 1024 * 1024 * 1024)
      return alert('File exceeds 2 GB limit (got ' + (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB)');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('doc_type', 'final_map');
    fd.append('uploaded_by', document.getElementById('design-doc-uploader').value || '');

    const btn = document.getElementById('design-doc-upload-btn');
    const wrap = document.getElementById('design-doc-progress-wrap');
    const bar = document.getElementById('design-doc-progress-bar');
    const pct = document.getElementById('design-doc-progress-pct');
    const lbl = document.getElementById('design-doc-progress-label');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading…'; }
    if (wrap) {
      wrap.style.display = '';
      bar.style.width = '0';
      pct.textContent = '0%';
      lbl.textContent = `Uploading ${(file.size / 1024 / 1024).toFixed(1)} MB…`;
    }
    try {
      await apiUpload('/api/projects/' + currentDesignProjectId + '/documents', fd, {
        onProgress: (loaded, total) => {
          if (!wrap) return;
          const p = total ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
          bar.style.width = p + '%';
          pct.textContent = p + '%';
          if (p >= 100) lbl.textContent = 'Saving on server…';
        },
      });
      document.getElementById('design-doc-file').value = '';
      document.getElementById('design-doc-uploader').value = '';
      loadDesignDocs(currentDesignProjectId);
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-upload"></i> Upload'; }
      if (wrap) wrap.style.display = 'none';
    }
  }

  function deleteDesignDoc(docId) {
    return deleteProjectDoc(docId, () => {
      if (currentDesignProjectId) loadDesignDocs(currentDesignProjectId);
    });
  }

  window.openDesignDocs = openDesignDocs;
  window.loadDesignDocs = loadDesignDocs;
  window.uploadDesignDoc = uploadDesignDoc;
  window.deleteDesignDoc = deleteDesignDoc;
})();
