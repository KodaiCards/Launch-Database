// public/js/clients_settings.js — Clients management Settings panel.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Inline-editable Clients table inside the Settings modal. Each row has
// inline edit (name + notes), per-client opt-in toggles for "Show
// Contract" + "Show WO#" on new-project forms, and a delete button.
// Delete previews the cascade impact (contracts / projects / invoices /
// time entries) and requires the operator to type the name to confirm —
// so a fat-fingered click can't nuke a client and its entire billing
// history.
//
// Path B (2026-05-04): the RUS column + checkbox were removed from this
// panel. Program classification now lives on engineering contracts via
// `engineering_contracts.program`, set in the Engineering Contracts
// settings panel. The `clients.is_rus` column is being phased out.
//
// Globals this module reads:
//   api(), esc()        — global helpers
//   clients             — global cache loaded by loadClients()
//   loadClients()       — global loader
//
// Functions exposed on window for inline event handlers:
//   renderClientsList, setClientFlag, saveNewClient, editClient,
//   saveClient, deleteClient

(function () {
  function renderClientsList() {
    const root = document.getElementById('clients-list-body');
    if (!root) return;
    const list = (typeof clients !== 'undefined' && clients) ? clients : [];
    if (!list.length) {
      root.innerHTML = '<div class="empty-state" style="padding:12px;text-align:center;color:var(--text-muted)">No clients yet.</div>';
      return;
    }
    root.innerHTML = `<table style="width:100%;font-size:13px;border-collapse:collapse">
      <thead><tr style="color:var(--text-muted);font-size:11px;text-transform:uppercase">
        <th style="text-align:left;padding:6px 8px">Name</th>
        <th style="text-align:center;padding:6px 8px;white-space:nowrap" title="Show the Construction Contract field on new-project forms for this client">Show<br>Const. Contract</th>
        <th style="text-align:center;padding:6px 8px;white-space:nowrap" title="Show the Work Order # field on new-project forms for this client">Show<br>WO#</th>
        <th style="text-align:left;padding:6px 8px">Notes</th>
        <th></th>
      </tr></thead>
      <tbody>${list.map(c => `<tr data-client-id="${c.id}" style="border-top:1px solid var(--gray-border)">
        <td style="padding:6px 8px;font-weight:600">${esc(c.name)}</td>
        <td style="padding:6px 8px;text-align:center"><input type="checkbox" ${c.show_contract ? 'checked' : ''} onchange="setClientFlag('${c.id}','show_contract',this.checked)"></td>
        <td style="padding:6px 8px;text-align:center"><input type="checkbox" ${c.show_work_order ? 'checked' : ''} onchange="setClientFlag('${c.id}','show_work_order',this.checked)"></td>
        <td style="padding:6px 8px;color:var(--text-muted)">${esc(c.notes || '—')}</td>
        <td style="padding:6px 8px;text-align:right;white-space:nowrap">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="editClient('${c.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteClient('${c.id}','${esc(c.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`).join('')}</tbody></table>
      <div style="font-size:11px;color:var(--text-muted);margin-top:8px;padding:6px 4px;line-height:1.5">
        <i class="fa-solid fa-circle-info"></i> <b>Show Construction Contract</b> / <b>Show WO#</b> control whether those fields appear on the New Project form for this client. Toggle here to opt in per client. Program classification (RUS / BAU / GFR / Other) lives on each engineering contract — see the Engineering Contracts panel.
      </div>`;
  }

  // Inline toggle for show_contract / show_work_order on a single client.
  async function setClientFlag(clientId, flagName, checked) {
    try {
      await api('/api/clients/' + clientId, 'PUT', { [flagName]: !!checked });
      await loadClients();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function saveNewClient() {
    const name = document.getElementById('new-client-name').value.trim();
    const notes = document.getElementById('new-client-notes').value.trim() || null;
    if (!name) return alert('Client name required');
    try {
      await api('/api/clients', 'POST', { name, notes });
      document.getElementById('new-client-name').value = '';
      document.getElementById('new-client-notes').value = '';
      document.getElementById('clients-add-form').style.display = 'none';
      await loadClients();
      renderClientsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  function editClient(id) {
    const list = (typeof clients !== 'undefined' && clients) ? clients : [];
    const client = list.find(c => c.id === id);
    if (!client) return;
    const tr = document.querySelector(`#clients-list-body tr[data-client-id="${id}"]`);
    if (!tr) return;
    tr.innerHTML = `
      <td style="padding:6px 8px"><input type="text" id="ec-name-${id}" value="${esc(client.name)}" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td colspan="2" style="padding:6px 8px;text-align:center;color:var(--text-muted);font-size:11px">— preserved —</td>
      <td style="padding:6px 8px"><input type="text" id="ec-notes-${id}" value="${esc(client.notes || '')}" placeholder="Optional" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--gray-border);border-radius:4px"></td>
      <td style="padding:6px 8px;text-align:right;white-space:nowrap">
        <button class="btn btn-sm btn-primary" onclick="saveClient('${id}')"><i class="fa-solid fa-check"></i></button>
        <button class="btn btn-sm btn-secondary" onclick="renderClientsList()"><i class="fa-solid fa-xmark"></i></button>
      </td>`;
  }

  async function saveClient(id) {
    const name = document.getElementById(`ec-name-${id}`).value.trim();
    const notes = document.getElementById(`ec-notes-${id}`).value.trim() || null;
    if (!name) return alert('Name required');
    try {
      await api('/api/clients/' + id, 'PUT', { name, notes });
      await loadClients();
      renderClientsList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deleteClient(id, name) {
    // Preview the cascade impact before confirming.
    let preview;
    try {
      preview = await api('/api/clients/' + id + '?preview=true', 'DELETE');
    } catch (e) {
      return alert('Could not preview: ' + e.message);
    }
    const msg = `Delete client "${name}"?

This will cascade-delete:
  • ${preview.contracts} contract${preview.contracts !== 1 ? 's' : ''}
  • ${preview.projects} project${preview.projects !== 1 ? 's' : ''}
  • ${preview.invoices} invoice${preview.invoices !== 1 ? 's' : ''}
  • All time entries on those projects

This cannot be undone. Type the client name below to confirm:`;
    const typed = prompt(msg);
    if (typed !== name) return; // cancelled or mistyped
    try {
      await api('/api/clients/' + id, 'DELETE');
      await loadClients();
      renderClientsList();
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  window.renderClientsList = renderClientsList;
  window.setClientFlag = setClientFlag;
  window.saveNewClient = saveNewClient;
  window.editClient = editClient;
  window.saveClient = saveClient;
  window.deleteClient = deleteClient;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  // Clients settings panel is inside the settings modal — always "active"
  // in the sense that changes from another tab should be reflected when
  // the user next opens or scrolls to the panel. Debounce + reload.
  let _clientsStaleTimer = null;

  function _clientsSseRefresh() {
    clearTimeout(_clientsStaleTimer);
    _clientsStaleTimer = setTimeout(async () => {
      await loadClients();
      renderClientsList();
    }, 500);
  }

  ['client_added', 'client_updated', 'client_deleted'].forEach(ev =>
    document.addEventListener('sse:' + ev, _clientsSseRefresh)
  );
})();
