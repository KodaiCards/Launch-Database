// public/js/settings_portal_access.js — Portal Access settings panel (Wave 12)
//
// Renders a checkbox matrix: staff users (rows) × portals (columns).
// Role-default access shows a locked checked checkbox.
// Override access shows an unlocked checked checkbox (can revoke).
// Absent access shows an unchecked checkbox (can grant).

let _portalAccessMatrix = null;

async function loadPortalAccessMatrix() {
  const body = document.getElementById('portal-access-body');
  if (!body) return;
  try {
    _portalAccessMatrix = await api('/api/portal-access');
    renderPortalAccessMatrix();
  } catch (e) {
    body.innerHTML = `<div style="color:var(--danger-text);padding:12px">Failed to load portal access: ${esc(e.message)}</div>`;
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

  const rows = _portalAccessMatrix.map(u => {
    const cells = u.portals.map(p => {
      const checked = p.hasRoleDefault || p.hasOverride;
      if (p.hasRoleDefault) {
        // Locked — cannot uncheck
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

    const roleLabel = u.role.replace(/_/g, ' ');
    return `<tr style="border-top:1px solid var(--border-weak)">
      <td style="padding:6px 8px;white-space:nowrap">
        <strong style="font-size:13px">${esc(u.full_name)}</strong>
        <span style="font-size:11px;color:var(--text-muted);margin-left:6px">${esc(roleLabel)}</span>
      </td>
      ${cells}
    </tr>`;
  }).join('');

  body.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead>
      <tr>
        <th style="padding:4px 8px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-muted)">User</th>
        ${headerCols}
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
