// public/js/engineering_contracts.js — Engineering Contracts settings.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
// Cache + render + CRUD for the umbrella entity above billing contracts.
// Mirrors the pattern used by renderClientsList / renderContractsList.
//
// The cache is exposed on window.engineeringContractsCache because the
// still-inline Construction Contracts section reads it (to populate
// the "Engineering Contract" dropdown in the Add Contract form). Don't
// drop the window assignment without checking those callers.
//
// Globals this module reads:
//   api()         — fetch wrapper from /js/api.js
//   esc()         — global helper
//   clients       — global cache (loaded by loadClients())
//
// Functions exposed on window for the existing inline onclick handlers:
//   loadEngineeringContracts, renderEngineeringContractsList,
//   saveNewEngineeringContract, editEngineeringContract,
//   saveEngineeringContract, deleteEngineeringContract

(function () {
  let engineeringContractsCache = [];

  // Allowed program values must match the CHECK constraint in
  // migrations/0002_engineering_contract_program.sql and the route layer
  // in routes/engineering_contracts.js.
  const PROGRAM_OPTIONS = [
    { value: '',      label: '— Not set —' },
    { value: 'rus',   label: 'RUS (USDA Rural Utilities Service)' },
    { value: 'bau',   label: 'BAU (Business as Usual)' },
    { value: 'gfr',   label: 'GF(R)' },
    { value: 'other', label: 'Other' },
  ];

  function programLabel(value) {
    if (!value) return '—';
    const opt = PROGRAM_OPTIONS.find(o => o.value === value);
    return opt ? opt.label.replace(/\s*\(.*?\)$/, '') : value;
  }

  function programOptionsHtml(selected) {
    return PROGRAM_OPTIONS.map(o =>
      `<option value="${o.value}"${(selected || '') === o.value ? ' selected' : ''}>${o.label}</option>`
    ).join('');
  }

  async function loadEngineeringContracts() {
    try {
      engineeringContractsCache = await api('/api/engineering-contracts');
    } catch (e) {
      engineeringContractsCache = [];
    }
    // Mirror to window so the still-inline Construction Contracts +
    // Add Contract form code can read the same list. Drop this when
    // those sections also extract.
    window.engineeringContractsCache = engineeringContractsCache;
  }

  function renderEngineeringContractsList() {
    const root = document.getElementById('eng-contracts-list-body');
    if (!root) return;
    // Populate the client dropdown in the Add form (needs `clients`
    // cache loaded by loadClients()).
    const clientSel = document.getElementById('new-ec-client');
    if (clientSel && (window.clients || []).length) {
      while (clientSel.options.length > 1) clientSel.remove(1);
      [...window.clients].sort((a,b) => a.name.localeCompare(b.name))
        .forEach(c => clientSel.add(new Option(c.name, c.id)));
    }
    // If window.clients isn't ready yet the clients-loaded event will
    // trigger a re-render once it is (listener registered below).
    if (!engineeringContractsCache.length) {
      root.innerHTML = '<div class="empty-state" style="padding:12px;text-align:center;color:var(--text-muted)">No engineering contracts yet. Add one above to group billing contracts under a single budget.</div>';
      return;
    }
    root.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--gray-light)">
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Client</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Name</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Number</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Loan</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase" title="RUS-program ECs gate the PSC RUS PDF template, the projection tab, and inspection scope.">Program</th>
            <th style="padding:8px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Contracts</th>
            <th style="padding:8px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Projects</th>
            <th style="padding:8px;text-align:right"></th>
          </tr>
        </thead>
        <tbody>
          ${engineeringContractsCache.map(ec => `
            <tr data-ec-id="${ec.id}" style="border-top:1px solid var(--gray-border)">
              <td style="padding:6px 8px">${esc(ec.client_name || '—')}</td>
              <td style="padding:6px 8px;font-weight:500">${esc(ec.name)}</td>
              <td style="padding:6px 8px;font-family:monospace;color:var(--text-muted)">${esc(ec.contract_number || '—')}</td>
              <td style="padding:6px 8px;color:var(--text-muted)">${esc(ec.loan_name || '—')}</td>
              <td style="padding:6px 8px;text-transform:uppercase;font-size:11px;letter-spacing:.04em;color:${ec.program === 'rus' ? 'var(--success)' : 'var(--text-muted)'}">${esc(programLabel(ec.program))}</td>
              <td style="padding:6px 8px;text-align:right">${ec.contract_count}</td>
              <td style="padding:6px 8px;text-align:right">${ec.project_count}</td>
              <td style="padding:6px 8px;text-align:right;white-space:nowrap">
                <button class="btn btn-sm btn-secondary" onclick="editEngineeringContract('${ec.id}')" title="Edit fields"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-secondary" onclick="toggleEcWosaPanel('${ec.id}')" title="Manage WO# and Service Areas" style="font-size:11px;padding:3px 7px">WO/SA</button>
                <button class="btn btn-sm" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteEngineeringContract('${ec.id}', '${esc(ec.name)}', ${ec.contract_count})" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
            <tr id="ec-wosa-panel-${ec.id}" style="display:none;background:var(--gray-light)">
              <td colspan="8" style="padding:0">
                <div style="padding:12px 16px;border-top:2px solid var(--primary,#1a73e8)">
                  <div style="font-weight:600;font-size:13px;margin-bottom:10px">WO# &amp; Service Areas — ${esc(ec.name)}</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                    <!-- Service Areas sub-panel -->
                    <div>
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px">Service Areas</div>
                      <div id="ec-sa-list-${ec.id}" style="margin-bottom:8px;font-size:13px"></div>
                      <div style="display:flex;gap:6px">
                        <input type="text" id="ec-sa-new-name-${ec.id}" aria-label="New service area name" placeholder="Area name" style="flex:2;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">
                        <input type="text" id="ec-sa-new-wo-${ec.id}" aria-label="Work order number" placeholder="WO# (optional)" style="width:90px;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px;font-family:monospace">
                        <input type="text" id="ec-sa-new-notes-${ec.id}" aria-label="New service area notes" placeholder="Notes (optional)" style="flex:3;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">
                        <button class="btn btn-sm btn-primary" onclick="addEcServiceArea('${ec.id}')"><i class="fa-solid fa-plus"></i> Add</button>
                      </div>
                    </div>
                    <!-- Work Orders sub-panel -->
                    <div>
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px">Work Orders</div>
                      <div id="ec-wo-list-${ec.id}" style="margin-bottom:8px;font-size:13px"></div>
                      <div style="display:flex;gap:6px">
                        <input type="text" id="ec-wo-new-num-${ec.id}" aria-label="New work order number" placeholder="WO# (e.g. 16316)" style="flex:2;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">
                        <input type="text" id="ec-wo-new-desc-${ec.id}" aria-label="New work order description" placeholder="Description (optional)" style="flex:3;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">
                        <select id="ec-wo-new-sa-${ec.id}" aria-label="New work order service area" style="flex:2;font-size:12px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">
                          <option value="">— No service area —</option>
                        </select>
                        <button class="btn btn-sm btn-primary" onclick="addEcWorkOrder('${ec.id}')"><i class="fa-solid fa-plus"></i> Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // ── WO / SA panel helpers ────────────────────────────────────────────────────

  // Per-EC caches so we don't re-fetch when the panel is already open.
  const _ecSaCache = {};
  const _ecWoCache = {};

  async function toggleEcWosaPanel(ecId) {
    const panel = document.getElementById(`ec-wosa-panel-${ecId}`);
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    if (isOpen) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = '';
    await refreshEcWosaPanel(ecId);
  }

  async function refreshEcWosaPanel(ecId) {
    try {
      const [sas, wos] = await Promise.all([
        api(`/api/engineering-contracts/${ecId}/service-areas`),
        api(`/api/engineering-contracts/${ecId}/work-orders`),
      ]);
      _ecSaCache[ecId] = sas;
      _ecWoCache[ecId] = wos;
      renderEcSaList(ecId, sas);
      renderEcWoList(ecId, wos, sas);
      // Populate the SA picker in the WO add form
      const saSel = document.getElementById(`ec-wo-new-sa-${ecId}`);
      if (saSel) {
        saSel.innerHTML = '<option value="">— No service area —</option>' +
          sas.map(sa => `<option value="${sa.id}">${esc(sa.name)}</option>`).join('');
      }
    } catch (e) {
      console.error('Failed to load WO/SA panel', e && e.message);
    }
  }

  function renderEcSaList(ecId, sas) {
    const el = document.getElementById(`ec-sa-list-${ecId}`);
    if (!el) return;
    if (!sas.length) {
      el.innerHTML = '<div style="color:var(--text-muted);font-size:12px">None yet.</div>';
      return;
    }
    el.innerHTML = sas.map(sa => `
      <div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid var(--gray-border)">
        <span id="ec-sa-display-${sa.id}" style="flex:1">${esc(sa.name)}${sa.work_order_number ? ` <span style="font-family:monospace;color:var(--text-muted);font-size:11px">WO# ${esc(sa.work_order_number)}</span>` : ''}${sa.notes ? ` <span style="color:var(--text-muted);font-size:11px">· ${esc(sa.notes)}</span>` : ''}</span>
        <div id="ec-sa-edit-${sa.id}" style="display:none;flex:1;gap:4px">
          <input type="text" id="ec-sa-edit-name-${sa.id}" aria-label="Service area name" value="${esc(sa.name)}" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px;flex:2">
          <input type="text" id="ec-sa-edit-wo-${sa.id}" aria-label="Work order number" value="${esc(sa.work_order_number || '')}" placeholder="WO# (optional)" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px;width:90px;font-family:monospace">
          <input type="text" id="ec-sa-edit-notes-${sa.id}" aria-label="Service area notes" value="${esc(sa.notes || '')}" placeholder="Notes" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px;flex:1">
        </div>
        <button class="btn btn-sm btn-secondary" id="ec-sa-btn-edit-${sa.id}" onclick="startEcSaEdit('${sa.id}','${ecId}')" style="font-size:11px;padding:2px 6px">Edit</button>
        <button class="btn btn-sm btn-primary" id="ec-sa-btn-save-${sa.id}" onclick="saveEcSaEdit('${sa.id}','${ecId}')" style="display:none;font-size:11px;padding:2px 6px">Save</button>
        <button class="btn btn-sm btn-secondary" id="ec-sa-btn-cancel-${sa.id}" onclick="cancelEcSaEdit('${sa.id}')" style="display:none;font-size:11px;padding:2px 6px">Cancel</button>
        <button class="btn btn-sm" onclick="deleteEcServiceArea('${sa.id}','${ecId}')" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border);font-size:11px;padding:2px 6px" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  function renderEcWoList(ecId, wos, sas) {
    const el = document.getElementById(`ec-wo-list-${ecId}`);
    if (!el) return;
    if (!wos.length) {
      el.innerHTML = '<div style="color:var(--text-muted);font-size:12px">None yet.</div>';
      return;
    }
    const saMap = {};
    (sas || []).forEach(sa => { saMap[sa.id] = sa.name; });
    el.innerHTML = wos.map(wo => `
      <div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid var(--gray-border)">
        <span id="ec-wo-display-${wo.id}" style="flex:1;font-family:monospace">WO# ${esc(wo.number)}${wo.service_area_name ? ` <span style="font-family:sans-serif;color:var(--text-muted);font-size:11px">· ${esc(wo.service_area_name)}</span>` : ''}${wo.description ? ` <span style="font-family:sans-serif;color:var(--text-muted);font-size:11px">· ${esc(wo.description)}</span>` : ''}</span>
        <div id="ec-wo-edit-${wo.id}" style="display:none;flex:1;gap:4px">
          <input type="text" id="ec-wo-edit-num-${wo.id}" aria-label="Work order number" value="${esc(wo.number)}" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px;width:80px;font-family:monospace">
          <input type="text" id="ec-wo-edit-desc-${wo.id}" aria-label="Work order description" value="${esc(wo.description || '')}" placeholder="Desc" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px;flex:1">
          <select id="ec-wo-edit-sa-${wo.id}" aria-label="Work order service area" style="font-size:12px;padding:2px 5px;border:1px solid var(--gray-border);border-radius:3px">
            <option value="">— No SA —</option>
            ${(sas || []).map(sa => `<option value="${sa.id}"${wo.service_area_id === sa.id ? ' selected' : ''}>${esc(sa.name)}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-sm btn-secondary" id="ec-wo-btn-edit-${wo.id}" onclick="startEcWoEdit('${wo.id}','${ecId}')" style="font-size:11px;padding:2px 6px">Edit</button>
        <button class="btn btn-sm btn-primary" id="ec-wo-btn-save-${wo.id}" onclick="saveEcWoEdit('${wo.id}','${ecId}')" style="display:none;font-size:11px;padding:2px 6px">Save</button>
        <button class="btn btn-sm btn-secondary" id="ec-wo-btn-cancel-${wo.id}" onclick="cancelEcWoEdit('${wo.id}')" style="display:none;font-size:11px;padding:2px 6px">Cancel</button>
        <button class="btn btn-sm" onclick="deleteEcWorkOrder('${wo.id}','${ecId}')" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border);font-size:11px;padding:2px 6px" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  // ── Service Area inline edit helpers ────────────────────────────────────────

  function startEcSaEdit(saId, ecId) {
    document.getElementById(`ec-sa-display-${saId}`).style.display = 'none';
    const editDiv = document.getElementById(`ec-sa-edit-${saId}`);
    editDiv.style.display = 'flex';
    document.getElementById(`ec-sa-btn-edit-${saId}`).style.display = 'none';
    document.getElementById(`ec-sa-btn-save-${saId}`).style.display = '';
    document.getElementById(`ec-sa-btn-cancel-${saId}`).style.display = '';
  }

  function cancelEcSaEdit(saId) {
    document.getElementById(`ec-sa-display-${saId}`).style.display = '';
    document.getElementById(`ec-sa-edit-${saId}`).style.display = 'none';
    document.getElementById(`ec-sa-btn-edit-${saId}`).style.display = '';
    document.getElementById(`ec-sa-btn-save-${saId}`).style.display = 'none';
    document.getElementById(`ec-sa-btn-cancel-${saId}`).style.display = 'none';
  }

  async function saveEcSaEdit(saId, ecId) {
    const name = document.getElementById(`ec-sa-edit-name-${saId}`)?.value.trim();
    const work_order_number = document.getElementById(`ec-sa-edit-wo-${saId}`)?.value.trim() || null;
    const notes = document.getElementById(`ec-sa-edit-notes-${saId}`)?.value.trim() || null;
    if (!name) return alert('Name required');
    try {
      await api(`/api/ec-service-areas/${saId}`, 'PUT', { name, work_order_number, notes });
      // Invalidate the project modal's SA cache so next open fetches fresh data.
      if (window._projEcSaCache) delete window._projEcSaCache[ecId];
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function addEcServiceArea(ecId) {
    const name = document.getElementById(`ec-sa-new-name-${ecId}`)?.value.trim();
    const work_order_number = document.getElementById(`ec-sa-new-wo-${ecId}`)?.value.trim() || null;
    const notes = document.getElementById(`ec-sa-new-notes-${ecId}`)?.value.trim() || null;
    if (!name) return alert('Area name required');
    try {
      await api(`/api/engineering-contracts/${ecId}/service-areas`, 'POST', { name, work_order_number, notes });
      document.getElementById(`ec-sa-new-name-${ecId}`).value = '';
      document.getElementById(`ec-sa-new-wo-${ecId}`).value = '';
      document.getElementById(`ec-sa-new-notes-${ecId}`).value = '';
      // Invalidate the project modal's SA cache so next open fetches fresh data.
      if (window._projEcSaCache) delete window._projEcSaCache[ecId];
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteEcServiceArea(saId, ecId) {
    if (!confirm('Delete this service area? Any work orders linked to it will lose their service-area link (they will not be deleted).')) return;
    try {
      await api(`/api/ec-service-areas/${saId}`, 'DELETE');
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  // ── Work Order inline edit helpers ──────────────────────────────────────────

  function startEcWoEdit(woId, ecId) {
    document.getElementById(`ec-wo-display-${woId}`).style.display = 'none';
    document.getElementById(`ec-wo-edit-${woId}`).style.display = 'flex';
    document.getElementById(`ec-wo-btn-edit-${woId}`).style.display = 'none';
    document.getElementById(`ec-wo-btn-save-${woId}`).style.display = '';
    document.getElementById(`ec-wo-btn-cancel-${woId}`).style.display = '';
  }

  function cancelEcWoEdit(woId) {
    document.getElementById(`ec-wo-display-${woId}`).style.display = '';
    document.getElementById(`ec-wo-edit-${woId}`).style.display = 'none';
    document.getElementById(`ec-wo-btn-edit-${woId}`).style.display = '';
    document.getElementById(`ec-wo-btn-save-${woId}`).style.display = 'none';
    document.getElementById(`ec-wo-btn-cancel-${woId}`).style.display = 'none';
  }

  async function saveEcWoEdit(woId, ecId) {
    const number = document.getElementById(`ec-wo-edit-num-${woId}`)?.value.trim();
    const description = document.getElementById(`ec-wo-edit-desc-${woId}`)?.value.trim() || null;
    const service_area_id = document.getElementById(`ec-wo-edit-sa-${woId}`)?.value || null;
    if (!number) return alert('WO# required');
    try {
      await api(`/api/ec-work-orders/${woId}`, 'PUT', { number, description, service_area_id });
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function addEcWorkOrder(ecId) {
    const number = document.getElementById(`ec-wo-new-num-${ecId}`)?.value.trim();
    const description = document.getElementById(`ec-wo-new-desc-${ecId}`)?.value.trim() || null;
    const service_area_id = document.getElementById(`ec-wo-new-sa-${ecId}`)?.value || null;
    if (!number) return alert('WO# required');
    try {
      await api(`/api/engineering-contracts/${ecId}/work-orders`, 'POST', { number, description, service_area_id });
      document.getElementById(`ec-wo-new-num-${ecId}`).value = '';
      document.getElementById(`ec-wo-new-desc-${ecId}`).value = '';
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteEcWorkOrder(woId, ecId) {
    if (!confirm('Delete this work order?')) return;
    try {
      await api(`/api/ec-work-orders/${woId}`, 'DELETE');
      await refreshEcWosaPanel(ecId);
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  async function saveNewEngineeringContract() {
    const name = document.getElementById('new-ec-name').value.trim();
    const contract_number = document.getElementById('new-ec-number').value.trim() || null;
    const loan_name = document.getElementById('new-ec-loan').value.trim() || null;
    const client_id = document.getElementById('new-ec-client').value;
    const notes = document.getElementById('new-ec-notes').value.trim() || null;
    // Program is optional in the form. The backend stores NULL when not set.
    const programEl = document.getElementById('new-ec-program');
    const program = programEl ? (programEl.value || null) : null;
    if (!client_id) return alert('Client required');
    if (!name) return alert('Name required');
    try {
      await api('/api/engineering-contracts', 'POST', { client_id, name, contract_number, loan_name, notes, program });
      document.getElementById('new-ec-name').value = '';
      document.getElementById('new-ec-number').value = '';
      document.getElementById('new-ec-loan').value = '';
      document.getElementById('new-ec-notes').value = '';
      if (programEl) programEl.value = '';
      document.getElementById('eng-contracts-add-form').style.display = 'none';
      await loadEngineeringContracts();
      renderEngineeringContractsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  function editEngineeringContract(id) {
    const ec = engineeringContractsCache.find(x => x.id === id);
    if (!ec) return;
    const tr = document.querySelector(`#eng-contracts-list-body tr[data-ec-id="${id}"]`);
    if (!tr) return;
    tr.innerHTML = `
      <td style="padding:6px 8px;color:var(--text-muted)">${esc(ec.client_name || '—')}</td>
      <td style="padding:6px 8px"><input type="text" id="ec-edit-name-${id}" aria-label="EC name" value="${esc(ec.name)}" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px"><input type="text" id="ec-edit-num-${id}" aria-label="EC contract number" value="${esc(ec.contract_number || '')}" placeholder="—" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px;font-family:monospace"></td>
      <td style="padding:6px 8px"><input type="text" id="ec-edit-loan-${id}" aria-label="EC loan name" value="${esc(ec.loan_name || '')}" placeholder="e.g. Reconnect 3" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px"><select id="ec-edit-program-${id}" aria-label="EC program" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">${programOptionsHtml(ec.program)}</select></td>
      <td colspan="2" style="padding:6px 8px;text-align:right;color:var(--text-muted);font-size:11px">${ec.contract_count} contracts · ${ec.project_count} projects</td>
      <td style="padding:6px 8px;text-align:right;white-space:nowrap">
        <button class="btn btn-sm btn-primary" onclick="saveEngineeringContract('${id}')"><i class="fa-solid fa-check"></i></button>
        <button class="btn btn-sm btn-secondary" onclick="renderEngineeringContractsList()"><i class="fa-solid fa-xmark"></i></button>
      </td>
    `;
  }

  async function saveEngineeringContract(id) {
    const name = document.getElementById(`ec-edit-name-${id}`).value.trim();
    const contract_number = document.getElementById(`ec-edit-num-${id}`).value.trim() || null;
    const loan_name = document.getElementById(`ec-edit-loan-${id}`).value.trim() || null;
    const programEl = document.getElementById(`ec-edit-program-${id}`);
    // Send program=null when the user picked "— Not set —" so the backend
    // can NULL the column. Sending undefined would skip the field entirely.
    const program = programEl ? (programEl.value || null) : undefined;
    if (!name) return alert('Name required');
    try {
      const payload = { name, contract_number, loan_name };
      if (program !== undefined) payload.program = program;
      await api('/api/engineering-contracts/' + id, 'PUT', payload);
      await loadEngineeringContracts();
      renderEngineeringContractsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteEngineeringContract(id, name, contractCount) {
    if (contractCount > 0) {
      return alert(`"${name}" has ${contractCount} contract${contractCount !== 1 ? 's' : ''} attached. Move or delete those first before deleting this engineering contract.`);
    }
    if (!confirm(`Delete engineering contract "${name}"? Any budget attached to it will also be deleted. This cannot be undone.`)) return;
    try {
      await api('/api/engineering-contracts/' + id, 'DELETE');
      await loadEngineeringContracts();
      renderEngineeringContractsList();
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  // Re-populate the Client dropdown in the Add Engineering Contract form
  // when the client cache becomes available (same race as construction_contracts.js).
  document.addEventListener('clients-loaded', function () {
    const clientSel = document.getElementById('new-ec-client');
    if (!clientSel || !(window.clients || []).length) return;
    if (clientSel.options.length <= 1) {
      while (clientSel.options.length > 1) clientSel.remove(1);
      [...window.clients].sort((a,b) => a.name.localeCompare(b.name))
        .forEach(c => clientSel.add(new Option(c.name, c.id)));
    }
  });

  window.loadEngineeringContracts = loadEngineeringContracts;
  window.renderEngineeringContractsList = renderEngineeringContractsList;
  window.saveNewEngineeringContract = saveNewEngineeringContract;
  window.editEngineeringContract = editEngineeringContract;
  window.saveEngineeringContract = saveEngineeringContract;
  window.deleteEngineeringContract = deleteEngineeringContract;
  // WO / SA panel
  window.toggleEcWosaPanel = toggleEcWosaPanel;
  window.addEcServiceArea = addEcServiceArea;
  window.deleteEcServiceArea = deleteEcServiceArea;
  window.startEcSaEdit = startEcSaEdit;
  window.cancelEcSaEdit = cancelEcSaEdit;
  window.saveEcSaEdit = saveEcSaEdit;
  window.addEcWorkOrder = addEcWorkOrder;
  window.deleteEcWorkOrder = deleteEcWorkOrder;
  window.startEcWoEdit = startEcWoEdit;
  window.cancelEcWoEdit = cancelEcWoEdit;
  window.saveEcWoEdit = saveEcWoEdit;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  let _ecStaleTimer = null;

  function _ecSseRefresh() {
    clearTimeout(_ecStaleTimer);
    _ecStaleTimer = setTimeout(async () => {
      await loadEngineeringContracts();
      renderEngineeringContractsList();
      // If the project-create modal is currently open and its EC row is visible
      // (RUS/GF(R) program selected), re-populate the EC dropdown so a newly
      // created EC appears without the user having to close and reopen the modal.
      const modal = document.getElementById('project-modal');
      const ecRow = document.getElementById('proj-ec-row');
      if (modal && modal.classList.contains('open') &&
          ecRow && ecRow.style.display !== 'none' &&
          typeof populateEcDropdown === 'function') {
        populateEcDropdown();
      }
    }, 500);
  }

  ['engineering_contract_added', 'engineering_contract_updated', 'engineering_contract_deleted',
   'client_added', 'client_updated', 'client_deleted'].forEach(ev =>
    document.addEventListener('sse:' + ev, _ecSseRefresh)
  );
})();
