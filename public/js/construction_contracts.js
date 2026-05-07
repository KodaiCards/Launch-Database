// public/js/construction_contracts.js — Construction Contracts settings.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Lists every billing contract with its client + engineering contract +
// friendly label. Inline edit lets the admin attach contracts to an
// engineering contract umbrella and set the "Contract 3" / "Contract 4"
// friendly labels used on PSC RUS invoice summaries. Renders grouped
// by engineering-contract umbrella with standalone contracts in a
// fallback bucket.
//
// Globals this module reads:
//   api(), esc()              — global helpers
//   showUndoBar()             — from /js/undo_bar.js
//   loadEngineeringContracts  — from /js/engineering_contracts.js (window.*)
//   window.clients            — global cache loaded by loadClients()
//   window.engineeringContractsCache — set by /js/engineering_contracts.js
//   loadProjects, loadHours, loadDashboard — global tab loaders
//
// Functions exposed on window for inline onclick handlers:
//   loadContractList, renderContractsList, deleteContract,
//   openAddContractForm, filterContractEcDropdown, saveNewContract,
//   editContract, saveContractEdit

(function () {
  let contractsCache = [];

  async function loadContractList() {
    try {
      contractsCache = await api('/api/contracts');
    } catch (e) {
      contractsCache = [];
    }
  }

  function renderContractsList() {
    const root = document.getElementById('contracts-list-body');
    if (!root) return;
    const ecCache = window.engineeringContractsCache || [];
    // Populate client + engineering-contract dropdowns in the Add form.
    // If window.clients isn't ready yet we skip for now; the clients-loaded
    // event listener below will call renderContractsList() again once it is.
    const clientSel = document.getElementById('new-contract-client');
    if (clientSel && (window.clients || []).length) {
      while (clientSel.options.length > 1) clientSel.remove(1);
      [...window.clients].sort((a,b) => a.name.localeCompare(b.name))
        .forEach(c => clientSel.add(new Option(c.name, c.id)));
    }
    const ecSel = document.getElementById('new-contract-ec');
    if (ecSel && ecCache.length) {
      while (ecSel.options.length > 1) ecSel.remove(1);
      [...ecCache]
        .sort((a,b) => (a.client_name || '').localeCompare(b.client_name || '') || a.name.localeCompare(b.name))
        .forEach(ec => ecSel.add(new Option(`${ec.client_name || '?'} · ${ec.name}`, ec.id)));
    }

    if (!contractsCache.length) {
      root.innerHTML = '<div class="empty-state" style="padding:12px;text-align:center;color:var(--text-muted)">No contracts yet. Add one above.</div>';
      return;
    }
    // Group by engineering contract — the umbrella that owns billing
    // contracts is the natural top-level entity. Standalone contracts
    // (no umbrella) fall into a "— Standalone —" bucket and still group
    // by client underneath for readability.
    const byEc = new Map();
    for (const c of contractsCache) {
      const key = c.engineering_contract_id || `__standalone__${c.client_name || ''}`;
      if (!byEc.has(key)) {
        byEc.set(key, {
          ec_id: c.engineering_contract_id || null,
          ec_name: c.engineering_contract_name || null,
          ec_number: c.engineering_contract_number || null,
          client_name: c.client_name || null,
          contracts: [],
        });
      }
      byEc.get(key).contracts.push(c);
    }
    // Sort umbrellas first, standalones last; alphabetical within each group.
    const ordered = [...byEc.values()].sort((a, b) => {
      if (!!a.ec_id !== !!b.ec_id) return a.ec_id ? -1 : 1;
      return String(a.ec_name || a.client_name || '').localeCompare(String(b.ec_name || b.client_name || ''));
    });
    let html = '';
    for (const grp of ordered) {
      const heading = grp.ec_name
        ? `<i class="fa-solid fa-folder-tree" style="color:var(--primary,#1B5FA0);margin-right:6px"></i>${esc(grp.ec_name)}${grp.ec_number ? ` <span style="color:var(--text-muted);font-family:monospace;font-weight:400;font-size:11px">${esc(grp.ec_number)}</span>` : ''}<span style="color:var(--text-muted);font-weight:500;font-size:11px;margin-left:8px">${esc(grp.client_name || '—')}</span>`
        : `<span style="color:var(--text-muted);font-weight:600">— Standalone —</span><span style="color:var(--text-muted);font-weight:500;font-size:11px;margin-left:8px">${esc(grp.client_name || '—')}</span>`;
      html += `<div style="margin-top:14px;border:1px solid var(--gray-border);border-radius:6px;overflow:hidden">
        <div style="background:var(--gray-light);padding:8px 12px;font-size:13px;font-weight:600;border-bottom:1px solid var(--gray-border)">${heading}</div>`;
      html += `<table style="width:100%;border-collapse:collapse"><thead>
        <tr style="background:var(--white)">
          <th style="padding:6px 8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Number</th>
          <th style="padding:6px 8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Name</th>
          <th style="padding:6px 8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Label</th>
          <th style="padding:6px 8px;text-align:right"></th>
        </tr></thead><tbody>`;
      for (const c of grp.contracts) {
        html += `<tr data-contract-id="${c.id}" style="border-top:1px solid var(--gray-border)">
          <td style="padding:6px 8px;font-family:monospace">${esc(c.contract_number)}</td>
          <td style="padding:6px 8px;color:var(--text-muted)">${esc(c.name || '—')}</td>
          <td style="padding:6px 8px;color:var(--text-muted)">${esc(c.friendly_label || '—')}</td>
          <td style="padding:6px 8px;text-align:right;white-space:nowrap">
            <button class="btn btn-sm btn-secondary" onclick="editContract('${c.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteContract('${c.id}', '${esc(c.contract_number).replace(/'/g, "\\'")}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>`;
      }
      html += `</tbody></table></div>`;
    }
    root.innerHTML = html;
  }

  // Delete a contract from the Settings list. First attempt is non-cascading.
  // If the server says projects still reference it (409), we offer to cascade
  // — that deletes every project under the contract (each as a tree of its
  // own descendants, time entries, permit data) plus the contract itself,
  // all in one transaction. Either path captures an undo snapshot the
  // operator can replay within 15 seconds.
  async function deleteContract(id, contractNumber) {
    if (!confirm(`Delete contract "${contractNumber}"? You'll get a 15-second undo window after the delete.`)) return;
    try {
      const r = await api('/api/contracts/' + id, 'DELETE');
      await loadContractList();
      renderContractsList();
      if (r && r.undo_token) {
        showUndoBar(`Deleted contract "${contractNumber}".`, r.undo_token);
      }
      return;
    } catch (e) {
      // 409 = contract has dependent projects. Offer cascade.
      const msg = String(e.message || '');
      const m = msg.match(/(\d+)\s+project/);
      const count = m ? parseInt(m[1], 10) : null;
      if (count) {
        const ok = confirm(
          `Contract "${contractNumber}" has ${count} project${count !== 1 ? 's' : ''} attached.\n\n` +
          `Delete the contract AND those ${count} project${count !== 1 ? 's' : ''} ` +
          `(plus every sub-project, time entry, and permit attached to them)?\n\n` +
          `You'll get a 15-second undo window after the delete.`
        );
        if (!ok) return;
        try {
          const r2 = await api('/api/contracts/' + id + '?cascade=1', 'DELETE');
          await loadContractList();
          renderContractsList();
          if (typeof loadProjects === 'function') loadProjects();
          if (typeof loadHours === 'function') loadHours();
          if (typeof loadDashboard === 'function') loadDashboard();
          if (r2 && r2.undo_token) {
            const summary = `Deleted contract "${contractNumber}" + ${r2.deleted_projects} project${r2.deleted_projects !== 1 ? 's' : ''} + ${r2.deleted_time_entries} time entries.`;
            showUndoBar(summary, r2.undo_token);
          }
        } catch (e2) {
          alert('Cascade delete failed: ' + e2.message);
        }
        return;
      }
      alert('Delete failed: ' + e.message);
    }
  }

  // Open the Add Contract form. ALWAYS re-fetches engineering contracts
  // first so the dropdown can't be stale. Also ensures the client cache
  // is populated — if it hasn't loaded yet, call loadClients() now so
  // the Client dropdown isn't empty when the form opens.
  async function openAddContractForm() {
    if (typeof loadEngineeringContracts === 'function') {
      await loadEngineeringContracts();
    }
    // Ensure clients are available before rendering the form dropdown.
    if (!(window.clients || []).length && typeof loadClients === 'function') {
      try { await loadClients(); } catch (e) { /* non-fatal */ }
    }
    renderContractsList();
    document.getElementById('contracts-add-form').style.display = 'block';
  }

  // When the client changes, narrow the EC dropdown to ECs belonging
  // to that client. Saves the user from picking an EC that doesn't
  // match.
  function filterContractEcDropdown() {
    const ecSel = document.getElementById('new-contract-ec');
    const clientId = document.getElementById('new-contract-client').value;
    if (!ecSel) return;
    const ecCache = window.engineeringContractsCache || [];
    while (ecSel.options.length > 1) ecSel.remove(1);
    const filtered = clientId
      ? ecCache.filter(ec => ec.client_id === clientId)
      : ecCache;
    filtered
      .slice()
      .sort((a, b) => (a.client_name || '').localeCompare(b.client_name || '') || a.name.localeCompare(b.name))
      .forEach(ec => ecSel.add(new Option(`${ec.client_name || '?'} · ${ec.name}`, ec.id)));
  }

  async function saveNewContract() {
    const client_id = document.getElementById('new-contract-client').value;
    const contract_number = document.getElementById('new-contract-number').value.trim();
    const name = document.getElementById('new-contract-name').value.trim() || null;
    const engineering_contract_id = document.getElementById('new-contract-ec').value || null;
    const friendly_label = document.getElementById('new-contract-label').value.trim() || null;
    if (!client_id) return alert('Client required');
    if (!contract_number) return alert('Contract number required');

    // Defensive double-check before sending: if an EC was picked, verify
    // it's still in the live engineering_contracts table. Catches the
    // race where the EC was deleted in another tab between the dropdown
    // populate and the save click.
    if (engineering_contract_id) {
      try {
        if (typeof loadEngineeringContracts === 'function') await loadEngineeringContracts();
        const ecCache = window.engineeringContractsCache || [];
        const stillThere = ecCache.find(e => e.id === engineering_contract_id);
        if (!stillThere) {
          renderContractsList();
          return alert('The selected engineering contract is no longer available — the dropdown was refreshed. Please pick again.');
        }
      } catch (e) { /* if the refresh fails, proceed and let the server FK do its job */ }
    }

    try {
      await api('/api/contracts', 'POST', { client_id, contract_number, name, engineering_contract_id, friendly_label });
      document.getElementById('new-contract-number').value = '';
      document.getElementById('new-contract-name').value = '';
      document.getElementById('new-contract-label').value = '';
      document.getElementById('contracts-add-form').style.display = 'none';
      await loadContractList();
      renderContractsList();
    } catch (e) {
      // FK error → friendlier message + auto-refresh so the user can retry
      if (e.message && e.message.includes('engineering_contract_id_fkey')) {
        if (typeof loadEngineeringContracts === 'function') await loadEngineeringContracts();
        renderContractsList();
        alert('The engineering contract you picked no longer exists. The dropdown has been refreshed — please pick again and Save.');
      } else {
        alert('Failed: ' + e.message);
      }
    }
  }

  function editContract(id) {
    const c = contractsCache.find(x => x.id === id);
    if (!c) return;
    const tr = document.querySelector(`#contracts-list-body tr[data-contract-id="${id}"]`);
    if (!tr) return;
    const ecCache = window.engineeringContractsCache || [];
    const ecOpts = ['<option value="">— None (standalone) —</option>']
      .concat(ecCache
        .filter(ec => ec.client_id === c.client_id)
        .map(ec => `<option value="${esc(ec.id)}"${c.engineering_contract_id === ec.id ? ' selected' : ''}>${esc(ec.name)}</option>`));
    tr.innerHTML = `
      <td style="padding:6px 8px;font-family:monospace"><input type="text" id="ct-edit-num-${id}" value="${esc(c.contract_number)}" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px;font-family:monospace"></td>
      <td style="padding:6px 8px"><input type="text" id="ct-edit-name-${id}" value="${esc(c.name || '')}" placeholder="—" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px"><select id="ct-edit-ec-${id}" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px">${ecOpts.join('')}</select></td>
      <td style="padding:6px 8px"><input type="text" id="ct-edit-label-${id}" value="${esc(c.friendly_label || '')}" placeholder="e.g. Contract 3" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px;text-align:right;white-space:nowrap">
        <button class="btn btn-sm btn-primary" onclick="saveContractEdit('${id}')"><i class="fa-solid fa-check"></i></button>
        <button class="btn btn-sm btn-secondary" onclick="renderContractsList()"><i class="fa-solid fa-xmark"></i></button>
      </td>`;
  }

  async function saveContractEdit(id) {
    const contract_number = document.getElementById(`ct-edit-num-${id}`).value.trim();
    const name = document.getElementById(`ct-edit-name-${id}`).value.trim() || null;
    const engineering_contract_id = document.getElementById(`ct-edit-ec-${id}`).value || null;
    const friendly_label = document.getElementById(`ct-edit-label-${id}`).value.trim() || null;
    if (!contract_number) return alert('Contract number required');
    try {
      await api('/api/contracts/' + id, 'PUT', { contract_number, name, engineering_contract_id, friendly_label });
      await loadContractList();
      renderContractsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  // Re-populate the Client dropdown in the Add form whenever the client
  // cache finishes loading (race condition: Settings panel may render
  // before loadClients() resolves, leaving the dropdown empty).
  document.addEventListener('clients-loaded', function () {
    const clientSel = document.getElementById('new-contract-client');
    if (!clientSel || !(window.clients || []).length) return;
    // Only re-populate if the form is currently open and the dropdown is still empty.
    if (clientSel.options.length <= 1) {
      while (clientSel.options.length > 1) clientSel.remove(1);
      [...window.clients].sort((a,b) => a.name.localeCompare(b.name))
        .forEach(c => clientSel.add(new Option(c.name, c.id)));
    }
  });

  window.loadContractList = loadContractList;
  window.renderContractsList = renderContractsList;
  window.deleteContract = deleteContract;
  window.openAddContractForm = openAddContractForm;
  window.filterContractEcDropdown = filterContractEcDropdown;
  window.saveNewContract = saveNewContract;
  window.editContract = editContract;
  window.saveContractEdit = saveContractEdit;
})();
