// public/js/settings_client_links.js — Customer ↔ Client link UI (Wave 13C)
//
// Adds a "Linked Client(s)" column to the Users & Roles table for
// customer-role users. Non-customer users show "—".
//
// Depends on: api(), esc() from admin.html inline scope.

// Cached client list for the add-link dropdown.
let _clientsListCache = null;

async function _ensureClientsLoaded() {
  if (_clientsListCache) return _clientsListCache;
  try {
    _clientsListCache = await api('/api/clients');
  } catch (e) {
    _clientsListCache = [];
  }
  return _clientsListCache;
}

// Called from renderUsersList() for each customer-role user row.
// Returns an HTML string for the "Linked Client(s)" cell.
function renderClientLinksCell(userId) {
  return `<td style="padding:6px 8px;font-size:12px" id="client-links-cell-${userId}">
    <span style="color:var(--text-muted);font-size:11px"><i class="fa-solid fa-spinner fa-spin" style="margin-right:4px"></i>loading</span>
  </td>`;
}

// Loads links for a single user and replaces the cell content.
async function loadClientLinksForRow(userId) {
  const cell = document.getElementById(`client-links-cell-${userId}`);
  if (!cell) return;
  try {
    const links = await api(`/api/customer-clients/${userId}`);
    cell.innerHTML = _buildClientLinksCellContent(userId, links);
  } catch (e) {
    cell.innerHTML = `<span style="color:var(--danger-text);font-size:11px">${esc(e.message)}</span>`;
  }
}

function _buildClientLinksCellContent(userId, links) {
  const chips = links.map(lk =>
    `<span style="display:inline-flex;align-items:center;gap:3px;background:var(--primary-light);color:var(--primary);font-size:10px;padding:1px 6px;border-radius:10px;margin:1px">
      ${esc(lk.client_name)}
      <button style="background:none;border:none;cursor:pointer;color:var(--primary);padding:0;font-size:10px;line-height:1" onclick="removeClientLink('${userId}','${lk.client_id}')" title="Remove link">✕</button>
    </span>`
  ).join('');

  const addPart = `<button class="btn btn-sm btn-secondary" style="font-size:10px;padding:2px 6px;margin-left:2px"
    onclick="openAddClientLinkDropdown('${userId}',this)" title="Link to a client">
    <i class="fa-solid fa-plus"></i>
  </button>`;

  return `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:2px">${chips}${addPart}</div>`;
}

async function openAddClientLinkDropdown(userId, btn) {
  // Prevent double-open.
  const existing = document.getElementById(`client-link-picker-${userId}`);
  if (existing) { existing.remove(); return; }

  const clients = await _ensureClientsLoaded();
  if (!clients.length) return alert('No clients found.');

  const select = document.createElement('select');
  select.id = `client-link-picker-${userId}`;
  select.style.cssText = 'font-size:12px;padding:2px 4px;border:1px solid var(--border-weak);border-radius:4px;background:var(--surface);color:var(--text);margin-left:4px';
  select.innerHTML = '<option value="">— pick client —</option>' +
    clients.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');

  select.onchange = async () => {
    const clientId = select.value;
    if (!clientId) return;
    select.remove();
    await addClientLink(userId, clientId);
  };

  // Close on outside click.
  const onOutside = (e) => {
    if (!select.contains(e.target) && e.target !== btn) {
      select.remove();
      document.removeEventListener('mousedown', onOutside);
    }
  };
  document.addEventListener('mousedown', onOutside);

  btn.insertAdjacentElement('afterend', select);
  select.focus();
}

async function addClientLink(userId, clientId) {
  try {
    await api('/api/customer-clients', 'POST', { user_id: userId, client_id: clientId });
    const links = await api(`/api/customer-clients/${userId}`);
    const cell = document.getElementById(`client-links-cell-${userId}`);
    if (cell) cell.innerHTML = _buildClientLinksCellContent(userId, links);
  } catch (e) {
    alert('Could not link client: ' + e.message);
  }
}

async function removeClientLink(userId, clientId) {
  try {
    await api(`/api/customer-clients/${userId}/${clientId}`, 'DELETE');
    const links = await api(`/api/customer-clients/${userId}`);
    const cell = document.getElementById(`client-links-cell-${userId}`);
    if (cell) cell.innerHTML = _buildClientLinksCellContent(userId, links);
  } catch (e) {
    alert('Could not remove link: ' + e.message);
  }
}
