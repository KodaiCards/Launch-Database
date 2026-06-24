// service_areas_ui.js — Phase 2 keystone admin screen.
// Browse clients → service areas → inline-editable job line items.
// Talks to routes/service_areas.js. No confirmation pop-ups: edits auto-save,
// status moves are one-click with an undo bar.

(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const state = {
    clients: [], staff: [], jobs: [], ecs: [], pipelines: {}, approval: {},
    areas: [], selectedId: null, detail: null, hoursJob: null,
  };

  // ── Theme ────────────────────────────────────────────────────────────────
  const savedTheme = localStorage.getItem('lfs_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  $('themeToggle').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('lfs_theme', t);
  });

  // ── Undo bar ───────────────────────────────────────────────────────────────
  let undoAction = null, undoTimer = null;
  function showUndo(msg, action) {
    undoAction = action;
    $('undoMsg').textContent = msg;
    $('undoBar').classList.add('show');
    $('undoBtn').style.display = '';
    clearTimeout(undoTimer);
    undoTimer = setTimeout(() => $('undoBar').classList.remove('show'), 6000);
  }
  function flash(msg) {
    $('undoMsg').textContent = msg;
    $('undoBtn').style.display = 'none';
    $('undoBar').classList.add('show');
    clearTimeout(undoTimer);
    undoTimer = setTimeout(() => $('undoBar').classList.remove('show'), 5000);
  }
  $('undoBtn').addEventListener('click', async () => {
    $('undoBar').classList.remove('show');
    if (undoAction) { const a = undoAction; undoAction = null; try { await a(); } catch (e) { /* ignore */ } }
  });

  // ── Load ────────────────────────────────────────────────────────────────
  async function boot() {
    try {
      const [clients, staff, jobs, ecs, pipe] = await Promise.all([
        api('/api/clients').catch(() => []),
        api('/api/staff').catch(() => []),
        api('/api/jobs').catch(() => []),
        api('/api/engineering-contracts').catch(() => []),
        api('/api/service-area-pipelines').catch(() => ({ pipelines: {}, approval_stage: {} })),
      ]);
      state.clients = clients || [];
      state.staff = staff || [];
      state.jobs = (jobs || []).filter(j => j.active !== false);
      state.ecs = ecs || [];
      state.pipelines = pipe.pipelines || {};
      state.approval = pipe.approval_stage || {};
      await loadAreas();
    } catch (e) {
      $('clientList').innerHTML = `<div class="muted" style="padding:10px;font-size:12px">Failed to load: ${esc(e.message)}</div>`;
    }
  }

  async function loadAreas() {
    state.areas = await api('/api/service-areas').catch(() => []);
    renderSidebar();
  }

  // ── Sidebar ────────────────────────────────────────────────────────────────
  function renderSidebar() {
    const byClient = {};
    for (const sa of state.areas) {
      (byClient[sa.client_id] = byClient[sa.client_id] || { name: sa.client_name || 'Unknown', items: [] }).items.push(sa);
    }
    const groups = Object.values(byClient).sort((a, b) => a.name.localeCompare(b.name));
    if (!groups.length) {
      $('clientList').innerHTML = `<div class="muted" style="padding:10px;font-size:12px">No service areas yet. Click “+ Service Area”.</div>`;
      return;
    }
    $('clientList').innerHTML = groups.map(g => `
      <div class="client-group">
        <div class="client-head">${esc(g.name)}</div>
        ${g.items.map(sa => `
          <div class="sa-item ${sa.id === state.selectedId ? 'active' : ''}" data-id="${sa.id}">
            <div>
              <div>${esc(sa.name)}</div>
              <div class="meta">${Number(sa.job_count) || 0} job(s) · ${money(sa.estimated_total)}</div>
            </div>
            ${sa.engineering_contract_id
              ? `<span class="badge badge-rus">RUS</span>`
              : `<span class="badge badge-prog">${esc((sa.program || 'n/a').toUpperCase())}</span>`}
          </div>`).join('')}
      </div>`).join('');
    $('clientList').querySelectorAll('.sa-item').forEach(el =>
      el.addEventListener('click', () => selectArea(el.dataset.id)));
  }

  async function selectArea(id) {
    state.selectedId = id;
    renderSidebar();
    $('main').innerHTML = `<div class="muted" style="padding:20px">Loading…</div>`;
    state.detail = await api('/api/service-areas/' + id).catch(e => { $('main').innerHTML = `<div class="empty">${esc(e.message)}</div>`; return null; });
    if (state.detail) renderDetail();
  }

  // ── Detail / jobs table ──────────────────────────────────────────────────
  const STATUS_TEAMS = ['permitting', 'design', 'construction'];

  function renderDetail() {
    const sa = state.detail;
    const jobs = sa.jobs || [];
    const estTotal = jobs.reduce((s, j) => s + Number(j.estimated_amount || 0), 0);
    const hrsTotal = jobs.reduce((s, j) => s + Number(j.actual_hours || 0), 0);

    $('main').innerHTML = `
      <div class="sa-title-row">
        <div class="sa-title">${esc(sa.name)}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" id="billBtn"><i class="fa-solid fa-file-invoice-dollar"></i> Bill ready jobs</button>
          <button class="btn btn-secondary btn-sm" id="delSaBtn"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      <div class="sa-sub">
        <span>${esc(sa.client_name || '')}</span>
        ${sa.ec_name ? `<span class="badge badge-rus">RUS · ${esc(sa.ec_name)}</span>` : `<span class="badge badge-prog">${esc((sa.program || 'n/a').toUpperCase())}</span>`}
        <span class="muted">·</span><span>${esc(sa.billing_cadence === 'monthly' ? 'Monthly' : 'One-time')}</span>
        <span class="muted">·</span>
        <span id="cvToggle" class="badge" role="button" tabindex="0"
          title="Toggle whether this service area shows in the client portal"
          style="cursor:pointer;${sa.client_visible
            ? 'background:var(--success-light);color:var(--success-text)'
            : 'background:var(--surface-1);color:var(--text-muted)'}">
          <i class="fa-solid fa-${sa.client_visible ? 'eye' : 'eye-slash'}"></i> ${sa.client_visible ? 'Client-visible' : 'Hidden from client'}
        </span>
      </div>

      <table class="jobs-table">
        <thead><tr>
          <th>Discipline</th><th>Employee</th><th>Billing</th>
          <th class="col-num">Rate</th><th class="col-num">Est $</th><th class="col-num">Hours</th>
          <th>Status</th><th></th>
        </tr></thead>
        <tbody id="jobRows">
          ${jobs.map(rowHtml).join('')}
          ${jobs.length ? '' : `<tr><td colspan="8" class="muted" style="text-align:center;padding:18px">No jobs yet — add one below.</td></tr>`}
        </tbody>
        <tfoot class="tfoot"><tr>
          <td colspan="4">Service-area total</td>
          <td class="col-num">${money(estTotal)}</td>
          <td class="col-num">${(hrsTotal || 0).toFixed(2)}</td>
          <td colspan="2"></td>
        </tr></tfoot>
      </table>

      <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
        <select id="addJobSel"><option value="">+ Add job…</option>${jobOptions()}</select>
      </div>`;

    $('delSaBtn').addEventListener('click', deleteArea);
    $('billBtn').addEventListener('click', billArea);
    $('addJobSel').addEventListener('change', addJob);
    const cv = $('cvToggle');
    cv.addEventListener('click', toggleClientVisible);
    cv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleClientVisible(); } });
    bindRowHandlers();
  }

  // Flip whether this service area is visible in the client portal. Optimistic
  // + undo bar (no confirm popup), matching the status-chip convention.
  async function toggleClientVisible() {
    const sa = state.detail;
    const prev = !!sa.client_visible;
    const next = !prev;
    sa.client_visible = next;
    renderDetail();
    try {
      await api('/api/service-areas/' + state.selectedId, 'PUT', { client_visible: next });
      showUndo(next ? 'Now visible to client' : 'Hidden from client', async () => {
        await api('/api/service-areas/' + state.selectedId, 'PUT', { client_visible: prev });
        await refreshDetail();
      });
    } catch (e) {
      sa.client_visible = prev; renderDetail();
      flash('Failed to update visibility: ' + e.message);
    }
  }

  function jobOptions() {
    const byTeam = {};
    for (const j of state.jobs) (byTeam[j.team || 'other'] = byTeam[j.team || 'other'] || []).push(j);
    return Object.keys(byTeam).sort().map(team =>
      `<optgroup label="${esc(team)}">${byTeam[team].map(j => `<option value="${j.id}">${esc(j.name)}</option>`).join('')}</optgroup>`
    ).join('');
  }

  function rowHtml(j) {
    const staffOpts = `<option value="">—</option>` + state.staff.map(s =>
      `<option value="${s.id}" ${s.id === j.assigned_staff_id ? 'selected' : ''}>${esc(s.name)}</option>`).join('');
    const billOpts = ['hourly', 'footage', 'fixed'].map(b =>
      `<option value="${b}" ${b === j.billing_type ? 'selected' : ''}>${b}</option>`).join('');
    return `<tr data-job="${j.id}" data-team="${esc(j.team || '')}" data-status="${esc(j.status)}">
      <td>${esc(j.job_name || j.team || '—')}</td>
      <td><select data-f="assigned_staff_id">${staffOpts}</select></td>
      <td><select data-f="billing_type">${billOpts}</select></td>
      <td class="col-num"><input data-f="rate" type="number" step="0.01" value="${j.rate ?? ''}"></td>
      <td class="col-num"><input data-f="estimated_amount" type="number" step="0.01" value="${j.estimated_amount ?? ''}"></td>
      <td class="col-num">${Number(j.actual_hours || 0).toFixed(2)} <button class="btn-ghost" data-loghrs title="Log hours" style="padding:2px 5px"><i class="fa-solid fa-plus"></i></button></td>
      <td>${chipsHtml(j)}</td>
      <td><button class="btn-ghost" data-del><i class="fa-solid fa-xmark"></i></button></td>
    </tr>`;
  }

  function chipsHtml(j) {
    const seq = state.pipelines[j.team] || [];
    if (!seq.length) return `<span class="chip current">${esc(j.status)}</span>`;
    if (j.status === 'revision') {
      const appr = state.approval[j.team];
      return `<span class="chip revision">revision</span><span class="chip next" data-adv="next">→ ${esc(appr)}</span>`;
    }
    const i = seq.indexOf(j.status);
    let html = seq.map((st, idx) => {
      const cls = idx < i ? 'done' : (idx === i ? 'current' : '');
      if (idx === i + 1) return `<span class="chip next" data-adv="next">${esc(st)} →</span>`;
      return `<span class="chip ${cls}">${esc(st)}</span>`;
    }).join('');
    if (j.status === 'submitted') html += `<span class="chip next revision" data-adv="revision">↻ revision</span>`;
    return html;
  }

  function bindRowHandlers() {
    document.querySelectorAll('#jobRows tr[data-job]').forEach(tr => {
      const jobId = tr.dataset.job;
      tr.querySelectorAll('[data-f]').forEach(el =>
        el.addEventListener('change', () => saveField(jobId, el.dataset.f, el.value)));
      tr.querySelector('[data-del]')?.addEventListener('click', () => deleteJob(jobId));
      tr.querySelector('[data-loghrs]')?.addEventListener('click', () => openHoursModal(jobId));
      tr.querySelectorAll('[data-adv]').forEach(el =>
        el.addEventListener('click', () => advance(jobId, el.dataset.adv)));
    });
  }

  async function saveField(jobId, field, value) {
    try { await api('/api/service-area-jobs/' + jobId, 'PUT', { [field]: value === '' ? null : value }); await refreshDetail(); }
    catch (e) { alert('Save failed: ' + e.message); }
  }

  async function advance(jobId, to) {
    const job = (state.detail.jobs || []).find(j => j.id === jobId);
    const prev = job ? job.status : null;
    try {
      await api('/api/service-area-jobs/' + jobId + '/advance', 'POST', to === 'revision' ? { to: 'revision' } : {});
      await refreshDetail();
      showUndo('Status updated', async () => { await api('/api/service-area-jobs/' + jobId, 'PUT', { status: prev }); await refreshDetail(); });
    } catch (e) { alert(e.message); }
  }

  async function addJob() {
    const sel = $('addJobSel');
    const jobId = sel.value;
    if (!jobId) return;
    try { await api('/api/service-areas/' + state.selectedId + '/jobs', 'POST', { job_id: jobId }); await refreshDetail(); }
    catch (e) { alert('Add failed: ' + e.message); }
    sel.value = '';
  }

  async function deleteJob(jobId) {
    const job = (state.detail.jobs || []).find(j => j.id === jobId);
    try {
      await api('/api/service-area-jobs/' + jobId, 'DELETE');
      await refreshDetail();
      // Undo = re-create from the captured row.
      showUndo('Job removed', async () => {
        if (!job) return;
        await api('/api/service-areas/' + state.selectedId + '/jobs', 'POST', {
          job_id: job.job_id, team: job.team, assigned_staff_id: job.assigned_staff_id,
          billing_type: job.billing_type, rate: job.rate, status: job.status,
          estimated_amount: job.estimated_amount,
        });
        await refreshDetail();
      });
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  async function deleteArea() {
    const id = state.selectedId;
    try {
      await api('/api/service-areas/' + id, 'DELETE');
      state.selectedId = null; state.detail = null;
      $('main').innerHTML = `<div class="empty"><i class="fa-solid fa-diagram-project"></i><div>Service area deleted.</div></div>`;
      await loadAreas();
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  async function refreshDetail() {
    state.detail = await api('/api/service-areas/' + state.selectedId);
    renderDetail();
    await loadAreas(); // keep sidebar totals fresh
  }

  // ── Create-SA modal ──────────────────────────────────────────────────────
  function openModal() {
    $('m_client').innerHTML = state.clients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    syncEcOptions();
    $('m_name').value = '';
    $('saModal').classList.add('open');
  }
  function syncEcOptions() {
    const clientId = $('m_client').value;
    const ecs = state.ecs.filter(e => e.client_id === clientId);
    $('m_ec').innerHTML = `<option value="">— None (non-RUS) —</option>` +
      ecs.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
    toggleProgram();
  }
  function toggleProgram() {
    // EC selected ⟺ RUS, so hide the manual program picker when an EC is chosen.
    $('m_progWrap').style.display = $('m_ec').value ? 'none' : 'block';
  }
  $('newSaBtn').addEventListener('click', openModal);
  $('m_cancel').addEventListener('click', () => $('saModal').classList.remove('open'));
  $('m_client').addEventListener('change', syncEcOptions);
  $('m_ec').addEventListener('change', toggleProgram);
  $('m_save').addEventListener('click', async () => {
    const body = {
      client_id: $('m_client').value,
      name: $('m_name').value.trim(),
      engineering_contract_id: $('m_ec').value || null,
      program: $('m_ec').value ? 'rus' : ($('m_program').value || null),
    };
    if (!body.name) { $('m_name').focus(); return; }
    try {
      const sa = await api('/api/service-areas', 'POST', body);
      $('saModal').classList.remove('open');
      await loadAreas();
      selectArea(sa.id);
    } catch (e) { alert('Create failed: ' + e.message); }
  });

  // ── Hours modal + billing ──────────────────────────────────────────────────
  function openHoursModal(jobId) {
    state.hoursJob = jobId;
    const job = (state.detail.jobs || []).find(j => j.id === jobId);
    $('h_jobname').textContent = job ? (job.job_name || job.team || 'job') : '';
    $('h_staff').innerHTML = `<option value="">Me (my account)</option>` +
      state.staff.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    $('h_hours').value = ''; $('h_note').value = '';
    $('h_entries').innerHTML = 'Loading…';
    api('/api/service-area-jobs/' + jobId + '/time-entries').then(es => {
      $('h_entries').innerHTML = es.length
        ? es.map(e => `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid var(--border-weak)"><span>${esc(e.staff_name || '(unattributed)')}</span><span>${Number(e.hours).toFixed(2)}h</span></div>`).join('')
        : '<span class="muted">No hours logged yet.</span>';
    }).catch(() => { $('h_entries').innerHTML = ''; });
    $('hoursModal').classList.add('open');
  }
  $('h_cancel').addEventListener('click', () => $('hoursModal').classList.remove('open'));
  $('h_save').addEventListener('click', async () => {
    const hours = parseFloat($('h_hours').value);
    if (!hours || hours <= 0) { $('h_hours').focus(); return; }
    const body = { hours, notes: $('h_note').value || null };
    const staff = $('h_staff').value; if (staff) body.staff_id = staff;
    try {
      await api('/api/service-area-jobs/' + state.hoursJob + '/time-entries', 'POST', body);
      $('hoursModal').classList.remove('open');
      await refreshDetail();
      flash('Hours logged');
    } catch (e) { alert('Log failed: ' + e.message); }
  });

  async function billArea() {
    try {
      const r = await api('/api/service-areas/' + state.selectedId + '/bill', 'POST');
      await refreshDetail();
      flash('Invoice created: ' + money(r.invoice.total_amount) + ' · ' + r.item_count + ' item(s)');
    } catch (e) { alert(e.message); }
  }

  // ── R10.3: Inline-create affordances for the SA modal ─────────────────────
  // These functions wire the "+ New Client" and "+ New EC" buttons in the
  // SA-create modal. After a create, we re-fetch and re-populate the pickers.

  function _icRefreshPickers(newClientId, newEcId) {
    return Promise.all([
      api('/api/clients').catch(() => state.clients),
      api('/api/engineering-contracts').catch(() => state.ecs),
    ]).then(([clients, ecs]) => {
      state.clients = clients || [];
      state.ecs = ecs || [];
      $('m_client').innerHTML = state.clients
        .map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
      if (newClientId) $('m_client').value = newClientId;
      syncEcOptions();
      if (newEcId) {
        $('m_ec').value = newEcId;
        toggleProgram();
      }
    });
  }

  // Inline new-client
  const icClientModal = document.getElementById('icClientModal');
  const icEcModal     = document.getElementById('icEcModal');

  if (document.getElementById('m_newClientBtn')) {
    document.getElementById('m_newClientBtn').addEventListener('click', () => {
      document.getElementById('ic_name').value = '';
      icClientModal.classList.add('open');
      setTimeout(() => document.getElementById('ic_name').focus(), 50);
    });
  }
  if (document.getElementById('ic_cancel')) {
    document.getElementById('ic_cancel').addEventListener('click', () => icClientModal.classList.remove('open'));
  }
  if (icClientModal) {
    icClientModal.addEventListener('click', e => { if (e.target === icClientModal) icClientModal.classList.remove('open'); });
  }
  if (document.getElementById('ic_save')) {
    document.getElementById('ic_save').addEventListener('click', async () => {
      const name = (document.getElementById('ic_name').value || '').trim();
      if (!name) { document.getElementById('ic_name').focus(); return; }
      const btn = document.getElementById('ic_save');
      btn.disabled = true; btn.textContent = 'Creating…';
      try {
        const c = await api('/api/clients', 'POST', { name });
        icClientModal.classList.remove('open');
        await _icRefreshPickers(c.id, null);
      } catch (e) { alert('Create client failed: ' + e.message); }
      finally { btn.disabled = false; btn.textContent = 'Create'; }
    });
  }

  // Inline new-EC
  if (document.getElementById('m_newEcBtn')) {
    document.getElementById('m_newEcBtn').addEventListener('click', () => {
      const clientId = $('m_client').value;
      if (!clientId) { flash('Select a client first'); return; }
      document.getElementById('ie_name').value = '';
      document.getElementById('ie_contract_number').value = '';
      document.getElementById('ie_program').value = 'rus';
      const note = document.getElementById('ie_prog_note');
      if (note) note.style.display = 'flex';
      icEcModal.classList.add('open');
      setTimeout(() => document.getElementById('ie_name').focus(), 50);
    });
  }
  if (document.getElementById('ie_cancel')) {
    document.getElementById('ie_cancel').addEventListener('click', () => icEcModal.classList.remove('open'));
  }
  if (icEcModal) {
    icEcModal.addEventListener('click', e => { if (e.target === icEcModal) icEcModal.classList.remove('open'); });
  }
  if (document.getElementById('ie_program')) {
    document.getElementById('ie_program').addEventListener('change', function () {
      const note = document.getElementById('ie_prog_note');
      if (note) note.style.display = this.value === 'rus' ? 'flex' : 'none';
    });
  }
  if (document.getElementById('ie_save')) {
    document.getElementById('ie_save').addEventListener('click', async () => {
      const name = (document.getElementById('ie_name').value || '').trim();
      if (!name) { document.getElementById('ie_name').focus(); return; }
      const clientId = $('m_client').value;
      if (!clientId) { flash('Select a client first'); return; }
      const btn = document.getElementById('ie_save');
      btn.disabled = true; btn.textContent = 'Creating…';
      try {
        const body = {
          client_id: clientId,
          name,
          contract_number: (document.getElementById('ie_contract_number').value || '').trim() || null,
          program: document.getElementById('ie_program').value,
        };
        const ec = await api('/api/engineering-contracts', 'POST', body);
        icEcModal.classList.remove('open');
        await _icRefreshPickers(null, ec.id);
      } catch (e) { alert('Create EC failed: ' + e.message); }
      finally { btn.disabled = false; btn.textContent = 'Create'; }
    });
  }

  boot();
})();
