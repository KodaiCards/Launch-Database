// public/js/settings_portal_access.js — Portal Access settings panel (Wave 12)
//
// Renders a checkbox matrix: staff users (rows) × portals (columns).
// Role-default access shows a locked checked checkbox.
// Override access shows an unlocked checked checkbox (can revoke).
// Absent access shows an unchecked checkbox (can grant).
//
// Wave 15: adds a "Can Create Projects" capability column at the right edge.
// Admin/manager rows show locked+checked (role default, cannot uncheck).
// Other staff rows show a toggleable checkbox (grants/revokes __cap_create_projects__).

const CAP_CREATE_PROJECTS = '__cap_create_projects__';
const MANAGER_ROLES = new Set(['admin', 'design_manager', 'permitting_manager']);

let _portalAccessMatrix = null;
// Wave 15: tracks which user IDs have the create-projects capability grant.
let _capCreateProjectsSet = new Set();

async function loadPortalAccessMatrix() {
  const body = document.getElementById('portal-access-body');
  if (!body) return;
  try {
    // Fetch portal matrix and capability grants in parallel.
    const [matrix, capRows] = await Promise.all([
      api('/api/portal-access'),
      _fetchCapCreateProjectsGrants(),
    ]);
    _portalAccessMatrix = matrix;
    _capCreateProjectsSet = new Set((capRows || []).map(r => r.user_id));
    renderPortalAccessMatrix();
  } catch (e) {
    body.innerHTML = `<div style="color:var(--danger-text);padding:12px">Failed to load portal access: ${esc(e.message)}</div>`;
  }
}

// Returns rows from user_portal_access for __cap_create_projects__.
// Falls back to empty array on error so matrix still renders.
async function _fetchCapCreateProjectsGrants() {
  try {
    const resp = await api('/api/portal-access/capabilities');
    return resp || [];
  } catch (e) {
    console.warn('[settings_portal_access] Could not load capability grants:', e && e.message);
    return [];
  }
}

function renderPortalAccessMatrix() {
  const body = document.getElementById('portal-access-body');
  if (!body || !_portalAccessMatrix || !_portalAccessMatrix.length) {
    if (body) body.innerHTML = '<div class="empty-state" style="padding:12px;color:var(--text-muted)">No staff users found.</div>';
    return;
  }

  const portals = _portalAccessMatrix[0].portals;

  const headerCols = portals.map(p =>
    `<th style="padding:4px 10px;text-align:center;font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-muted);white-space:nowrap">${esc(p.label)}</th>`
  ).join('');

  // Wave 15: capability column header
  const capHeader = `<th style="padding:4px 10px;text-align:center;font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-muted);white-space:nowrap;border-left:2px solid var(--border-weak)">Can Create Projects</th>`;

  const rows = _portalAccessMatrix.map(u => {
    const cells = u.portals.map(p => {
      const checked = p.hasRoleDefault || p.hasOverride;
      if (p.hasRoleDefault) {
        return `<td style="padding:6px 10px;text-align:center">
          <label title="Role default — cannot be removed" style="cursor:default">
            <input type="checkbox" checked disabled style="cursor:default;accent-color:var(--primary)">
            <i class="fa-solid fa-lock" style="font-size:9px;color:var(--text-muted);margin-left:2px" title="Role default"></i>
          </label>
        </td>`;
      }
      return `<td style="padding:6px 10px;text-align:center">
        <input type="checkbox"
          ${checked ? 'checked' : ''}
          style="cursor:pointer;accent-color:var(--primary)"
          onchange="togglePortalAccess(this,'${esc(u.user_id)}','${esc(p.key)}')"
          title="${checked ? 'Granted — uncheck to revoke' : 'Click to grant access'}">
      </td>`;
    }).join('');

    // Wave 15: capability cell — locked for admin/manager, toggleable for others
    const isManagerOrAdmin = MANAGER_ROLES.has(u.role);
    const capGranted = isManagerOrAdmin || _capCreateProjectsSet.has(u.user_id);
    const capCell = isManagerOrAdmin
      ? `<td style="padding:6px 10px;text-align:center;border-left:2px solid var(--border-weak)">
          <label title="Role default — admin/manager can always create projects" style="cursor:default">
            <input type="checkbox" checked disabled style="cursor:default;accent-color:var(--primary)">
            <i class="fa-solid fa-lock" style="font-size:9px;color:var(--text-muted);margin-left:2px" title="Role default"></i>
          </label>
        </td>`
      : `<td style="padding:6px 10px;text-align:center;border-left:2px solid var(--border-weak)">
          <input type="checkbox"
            ${capGranted ? 'checked' : ''}
            style="cursor:pointer;accent-color:var(--primary)"
            onchange="toggleCapCreateProjects(this,'${esc(u.user_id)}')"
            title="${capGranted ? 'Granted — uncheck to revoke' : 'Click to grant project create access'}">
        </td>`;

    const roleLabel = u.role.replace(/_/g, ' ');
    return `<tr style="border-top:1px solid var(--border-weak)">
      <td style="padding:6px 8px;white-space:nowrap">
        <strong style="font-size:13px">${esc(u.full_name)}</strong>
        <span style="font-size:11px;color:var(--text-muted);margin-left:6px">${esc(roleLabel)}</span>
      </td>
      ${cells}
      ${capCell}
    </tr>`;
  }).join('');

  body.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead>
      <tr>
        <th style="padding:4px 8px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-muted)">User</th>
        ${headerCols}
        ${capHeader}
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

async function togglePortalAccess(checkbox, userId, portalKey) {
  checkbox.disabled = true;
  try {
    if (checkbox.checked) {
      await api(`/api/users/${userId}/portal-access/${portalKey}`, 'POST');
    } else {
      await api(`/api/users/${userId}/portal-access/${portalKey}`, 'DELETE');
    }
    // Refresh the local cache row so future renders stay consistent.
    if (_portalAccessMatrix) {
      const row = _portalAccessMatrix.find(u => u.user_id === userId);
      if (row) {
        const p = row.portals.find(x => x.key === portalKey);
        if (p) p.hasOverride = checkbox.checked;
      }
    }
  } catch (e) {
    alert('Failed to update portal access: ' + e.message);
    checkbox.checked = !checkbox.checked;
  } finally {
    checkbox.disabled = false;
  }
}

// Wave 15: grant/revoke the __cap_create_projects__ capability for a staff user.
async function toggleCapCreateProjects(checkbox, userId) {
  checkbox.disabled = true;
  try {
    if (checkbox.checked) {
      await api(`/api/users/${userId}/portal-access/${CAP_CREATE_PROJECTS}`, 'POST');
      _capCreateProjectsSet.add(userId);
    } else {
      await api(`/api/users/${userId}/portal-access/${CAP_CREATE_PROJECTS}`, 'DELETE');
      _capCreateProjectsSet.delete(userId);
    }
  } catch (e) {
    alert('Failed to update project create access: ' + e.message);
    checkbox.checked = !checkbox.checked;
  } finally {
    checkbox.disabled = false;
  }
}
