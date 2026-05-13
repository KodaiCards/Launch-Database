// public/js/design_potential_tabs.js — Admin Design Pipeline + Potential Permits tabs.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Two related admin views bundled together because both deal with the
// permitting/design pipeline workflow:
//   - Design Pipeline: 4-stage workflow (potential → started → review →
//     completed) with stat bars, advance/regress buttons, document
//     attachments via openDesignDocs.
//   - Potential Permits: queue of submitted permit candidates from the
//     permitting portal — each pending one can be accepted (creates a
//     real permit project), rejected, or deleted.
//
// Constants exposed on window for callers that still inline (the Design
// pipeline view markup uses DESIGN_STAGES/LABELS for its tile bar):
//   DESIGN_STAGES, DESIGN_LABELS
//
// Globals this module reads:
//   api(), esc()                        — global helpers
//   statusBadge()                       — global status pill renderer
//   openModal(), closeModal()           — global modal helpers
//   openProjectModal()                  — project create modal opener
//   showProjectDetail()                 — project detail drilldown
//   loadDashboard()                     — refresh dashboard after a stage
//                                         change
//   openDesignDocs()                    — design docs viewer (still inline)
//
// Functions exposed on window:
//   loadDesign, regressDesign, regressPermit, advanceDesign,
//   loadPotentialPermits, openPotentialPermitModal, savePotentialPermit,
//   acceptPotentialPermit, rejectPotentialPermit, deletePotentialPermit

(function () {
  const DESIGN_STAGES = ['potential', 'started', 'review_process', 'completed'];
  const DESIGN_LABELS = { potential:'Potential', started:'Started', review_process:'Review Process', completed:'Completed' };

  // Expose constants for any inline code that still reads them.
  window.DESIGN_STAGES = DESIGN_STAGES;
  window.DESIGN_LABELS = DESIGN_LABELS;

  async function loadDesign() {
    let projects;
    try {
      projects = await api('/api/design');
    } catch (e) {
      const tbody = document.getElementById('design-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="empty-state" style="color:var(--danger)">Failed to load design projects: ${esc(e.message)}</td></tr>`;
      return;
    }
    const stageFilter = document.getElementById('design-stage-filter')?.value || '';
    const counts = {}; DESIGN_STAGES.forEach(s => counts[s]=0);
    projects.forEach(p => { if(p.current_stage) counts[p.current_stage]++; });
    // Stage tiles are clickable — clicking one sets the filter (and re-clicking
    // the active one clears it). Mirrors the Permitting stage bar UX.
    document.getElementById('design-stage-bar').innerHTML = DESIGN_STAGES.map(s => {
      const c = {potential:'#6c757d',started:'var(--primary)',review_process:'#ff9800',completed:'var(--success)'}[s];
      const active = stageFilter === s;
      const ring = active ? 'box-shadow:0 0 0 3px rgba(0,0,0,0.18) inset;' : '';
      const toggleVal = active ? '' : s;
      return `<div onclick="document.getElementById('design-stage-filter').value='${toggleVal}';loadDesign()" style="background:${c};color:#fff;padding:12px;border-radius:8px;text-align:center;cursor:pointer;${ring}"><div style="font-size:22px;font-weight:700">${counts[s]}</div><div style="font-size:11px;text-transform:uppercase">${DESIGN_LABELS[s]}</div></div>`;
    }).join('');

    const tbody = document.getElementById('design-body');
    if (!projects.length) { tbody.innerHTML='<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-drafting-compass"></i><p>No design projects</p></div></td></tr>'; return; }

    // Apply stage filter (client-side — /api/design returns the full list).
    const filtered = stageFilter
      ? projects.filter(p => (p.current_stage || 'potential') === stageFilter)
      : projects;

    if (!filtered.length) { tbody.innerHTML=`<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-drafting-compass"></i><p>No projects in stage "${DESIGN_LABELS[stageFilter] || stageFilter}"</p></div></td></tr>`; return; }

    // Sort: further-along stages on top. Within a stage, newest updated_at first.
    const sortedProjects = [...filtered].sort((a, b) => {
      const sa = DESIGN_STAGES.indexOf(a.current_stage || 'potential');
      const sb = DESIGN_STAGES.indexOf(b.current_stage || 'potential');
      if (sa !== sb) return sb - sa;
      return (b.updated_at || '').localeCompare(a.updated_at || '');
    });

    tbody.innerHTML = sortedProjects.map(p => {
      const stage = p.current_stage || 'potential';
      const si = DESIGN_STAGES.indexOf(stage);
      const pipe = DESIGN_STAGES.map((s,i)=>`<div style="flex:1;height:8px;border-radius:4px;background:${i<si?'var(--success)':i===si?'var(--primary)':'#ddd'}" title="${DESIGN_LABELS[s]}"></div>`).join('');
      return `<tr>
        <td class="td-name">${esc(p.name)}</td>
        <td>${esc(p.client_name||'—')}</td>
        <td class="td-mono">${esc(p.work_order_number||'—')}</td>
        <td>${statusBadge(stage)}</td>
        <td><div style="display:flex;gap:2px;min-width:120px">${pipe}</div><span style="font-size:10px;color:var(--text-muted)">${DESIGN_LABELS[stage]}</span></td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();openDesignDocs('${p.id}','${esc(p.name)}')" title="Final Map / DWG"><i class="fa-solid fa-paperclip"></i></button>
          ${stage!=='potential'?`<button class="btn btn-sm btn-secondary btn-icon" onclick="regressDesign('${p.id}','${esc(p.name)}')" title="Move back one stage"><i class="fa-solid fa-backward-step"></i></button>` : ''}
          ${stage!=='completed'?`<button class="btn btn-sm btn-primary" onclick="advanceDesign('${p.id}',this)"><i class="fa-solid fa-forward"></i> Advance</button>`:'<span style="color:var(--success);font-weight:600"><i class="fa-solid fa-check"></i> Done</span>'}
        </td>
      </tr>`;
    }).join('');
  }

  // Regress (back up) a design pipeline project by one stage.
  async function regressDesign(projectId, projectName) {
    if (!confirm(`Move "${projectName||''}" back one stage in the design pipeline?`)) return;
    try {
      await api(`/api/design/${projectId}/regress`, 'PUT', {});
      if (typeof loadDesign === 'function') loadDesign();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch (e) { alert('Regress failed: ' + e.message); }
  }

  // Regress (back up) a permitting pipeline project by one stage.
  async function regressPermit(projectId, projectName) {
    if (!confirm(`Move "${projectName||''}" back one stage in the permit pipeline?`)) return;
    try {
      await api(`/api/permits/${projectId}/regress`, 'PUT', {});
      if (typeof loadPermits === 'function') loadPermits();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch (e) { alert('Regress failed: ' + e.message); }
  }

  async function advanceDesign(projectId, btn) {
    // Double-submit guard: disable the clicked Advance button for the API call.
    // loadDesign() re-renders the row on success so re-enable is only needed on error.
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; }
    try {
      const r = await api(`/api/design/${projectId}/advance`, 'PUT', {});
      if (r.current === 'completed') alert('Design completed! It will appear in your Billing tab.');
      loadDesign();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch(e) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-forward"></i> Advance'; }
      alert('Error: '+e.message);
    }
  }

  // ─── Potential Permits ──────────────────────────────────────────────
  async function loadPotentialPermits() {
    const permits = await api('/api/potential-permits');
    const tbody = document.getElementById('potential-permits-body');
    if (!permits.length) { tbody.innerHTML='<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-lightbulb"></i><p>No potential permits submitted yet</p></div></td></tr>'; return; }
    tbody.innerHTML = permits.map(p => {
      const sc = {pending:'var(--primary)',accepted:'var(--success)',rejected:'var(--danger)'}[p.status]||'#ccc';
      return `<tr>
        <td class="td-name">${esc(p.sr_hwy||'—')}</td>
        <td>${esc(p.county||'—')}</td>
        <td>${esc(p.route||'—')}</td>
        <td>${esc(p.submitted_by||'—')}</td>
        <td><span style="background:${sc};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
        <td style="font-size:12px;color:var(--text-muted)">${new Date(p.created_at).toLocaleDateString()}</td>
        <td style="white-space:nowrap">
          ${p.status==='pending'?`<button class="btn btn-sm btn-success" onclick="acceptPotentialPermit('${p.id}','${esc(p.sr_hwy||'')}','${esc(p.county||'')}','${esc(p.route||'')}')"><i class="fa-solid fa-plus"></i> Create Permit</button>
          <button class="btn btn-sm btn-danger btn-icon" onclick="rejectPotentialPermit('${p.id}')"><i class="fa-solid fa-xmark"></i></button>`:''}
          ${p.status==='accepted'&&p.project_id?`<button class="btn btn-sm btn-secondary" onclick="showProjectDetail('${p.project_id}')"><i class="fa-solid fa-eye"></i> View</button>`:''}
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent" onclick="deletePotentialPermit('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  function openPotentialPermitModal() {
    ['pp-sr-hwy','pp-county','pp-route','pp-submitted-by','pp-notes'].forEach(id=>document.getElementById(id).value='');
    // Actor pre-fill: populate submitted_by from the logged-in user so the
    // field isn't left blank. Backend still uses req.user as the authoritative
    // actor; this is a UX convenience so the user sees who will be recorded.
    const subByEl = document.getElementById('pp-submitted-by');
    if (subByEl && typeof currentUser !== 'undefined' && currentUser) {
      subByEl.value = currentUser.full_name || currentUser.username || '';
    }
    openModal('pp-modal');
  }

  async function savePotentialPermit() {
    const sr = document.getElementById('pp-sr-hwy').value.trim();
    if (!sr) return alert('SR/HWY is required');
    // Double-submit guard
    const saveBtn = document.querySelector('#pp-modal .btn-primary[onclick*="savePotentialPermit"]');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…'; }
    try {
      await api('/api/potential-permits','POST',{
        sr_hwy:sr, county:document.getElementById('pp-county').value.trim(),
        route:document.getElementById('pp-route').value.trim(),
        submitted_by:document.getElementById('pp-submitted-by').value.trim(),
        notes:document.getElementById('pp-notes').value.trim()
      });
      closeModal('pp-modal'); loadPotentialPermits();
    } catch(e) {
      if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit'; }
      alert('Error: '+e.message);
    }
  }

  async function acceptPotentialPermit(ppId, srHwy, county, route) {
    // Pre-fill the project creation modal for a new permit.
    openProjectModal();
    document.getElementById('proj-name').value = (srHwy||'') + ' Permitting';
    document.getElementById('proj-notes').value = `From potential permit. SR/HWY: ${srHwy||'N/A'}, County: ${county||'N/A'}, Route: ${route||'N/A'}`;
    // Store ppId for linking after save.
    window._pendingPotentialPermitId = ppId;
  }

  async function rejectPotentialPermit(id) {
    if (!confirm('Reject this potential permit?')) return;
    try {
      await api('/api/potential-permits/'+id,'PUT',{status:'rejected',reviewed_by:'Admin'});
      loadPotentialPermits();
    } catch(e) { alert('Error: '+e.message); }
  }

  async function deletePotentialPermit(id) {
    if (!confirm('Delete this potential permit?')) return;
    try {
      await api('/api/potential-permits/'+id,'DELETE');
      loadPotentialPermits();
    } catch(e) { alert('Error: '+e.message); }
  }

  window.loadDesign = loadDesign;
  window.regressDesign = regressDesign;
  window.regressPermit = regressPermit;
  window.advanceDesign = advanceDesign;
  window.loadPotentialPermits = loadPotentialPermits;
  window.openPotentialPermitModal = openPotentialPermitModal;
  window.savePotentialPermit = savePotentialPermit;
  window.acceptPotentialPermit = acceptPotentialPermit;
  window.rejectPotentialPermit = rejectPotentialPermit;
  window.deletePotentialPermit = deletePotentialPermit;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  // Design pipeline and potential-permits views previously only refreshed on
  // the 60s recovery poll. Wire SSE events so changes appear within 500ms.
  let _designStaleTimer = null;
  let _designStale = false;
  let _potentialStaleTimer = null;
  let _potentialStale = false;

  function _designDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'design') {
      _designStale = true;
      return;
    }
    clearTimeout(_designStaleTimer);
    _designStaleTimer = setTimeout(loadDesign, 500);
  }

  function _potentialDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'potential-permits') {
      _potentialStale = true;
      return;
    }
    clearTimeout(_potentialStaleTimer);
    _potentialStaleTimer = setTimeout(loadPotentialPermits, 500);
  }

  ['project_added', 'project_updated', 'project_deleted',
   'permit_added', 'permit_updated', 'permit_deleted',
  ].forEach(ev => document.addEventListener('sse:' + ev, _designDebounce));

  ['project_added', 'project_updated', 'project_deleted',
  ].forEach(ev => document.addEventListener('sse:' + ev, _potentialDebounce));

  (window._showViewHooks = window._showViewHooks || []).push(function(view) {
    if (view === 'design' && _designStale) {
      _designStale = false;
      clearTimeout(_designStaleTimer);
      _designStaleTimer = setTimeout(loadDesign, 100);
    }
    if (view === 'potential-permits' && _potentialStale) {
      _potentialStale = false;
      clearTimeout(_potentialStaleTimer);
      _potentialStaleTimer = setTimeout(loadPotentialPermits, 100);
    }
  });
})();
