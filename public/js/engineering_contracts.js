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
              <td style="padding:6px 8px;text-align:right">${ec.contract_count}</td>
              <td style="padding:6px 8px;text-align:right">${ec.project_count}</td>
              <td style="padding:6px 8px;text-align:right;white-space:nowrap">
                <button class="btn btn-sm btn-secondary" onclick="editEngineeringContract('${ec.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteEngineeringContract('${ec.id}', '${esc(ec.name)}', ${ec.contract_count})" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async function saveNewEngineeringContract() {
    const name = document.getElementById('new-ec-name').value.trim();
    const contract_number = document.getElementById('new-ec-number').value.trim() || null;
    const loan_name = document.getElementById('new-ec-loan').value.trim() || null;
    const client_id = document.getElementById('new-ec-client').value;
    const notes = document.getElementById('new-ec-notes').value.trim() || null;
    if (!client_id) return alert('Client required');
    if (!name) return alert('Name required');
    try {
      await api('/api/engineering-contracts', 'POST', { client_id, name, contract_number, loan_name, notes });
      document.getElementById('new-ec-name').value = '';
      document.getElementById('new-ec-number').value = '';
      document.getElementById('new-ec-loan').value = '';
      document.getElementById('new-ec-notes').value = '';
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
      <td style="padding:6px 8px"><input type="text" id="ec-edit-name-${id}" value="${esc(ec.name)}" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px"><input type="text" id="ec-edit-num-${id}" value="${esc(ec.contract_number || '')}" placeholder="—" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px;font-family:monospace"></td>
      <td style="padding:6px 8px"><input type="text" id="ec-edit-loan-${id}" value="${esc(ec.loan_name || '')}" placeholder="e.g. Reconnect 3" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
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
    if (!name) return alert('Name required');
    try {
      await api('/api/engineering-contracts/' + id, 'PUT', { name, contract_number, loan_name });
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

  window.loadEngineeringContracts = loadEngineeringContracts;
  window.renderEngineeringContractsList = renderEngineeringContractsList;
  window.saveNewEngineeringContract = saveNewEngineeringContract;
  window.editEngineeringContract = editEngineeringContract;
  window.saveEngineeringContract = saveEngineeringContract;
  window.deleteEngineeringContract = deleteEngineeringContract;
})();
