// public/js/client_portal_admin.js
// Admin UI helpers for Client Portal v1 (E2).
// Manages org creation, user management, and token generation within Settings.

(function() {
  // ── State ────────────────────────────────────────────────────────────
  let _currentOrgId = null;

  // ── Load org list into the settings panel ───────────────────────────
  async function cpLoadOrgs() {
    const body = document.getElementById('cp-orgs-list');
    if (!body) return;
    try {
      const orgs = await api('GET', '/api/admin/client-orgs');
      if (!orgs.length) {
        body.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;text-align:center">No client organizations yet. Create one to get started.</div>';
        return;
      }
      body.innerHTML = orgs.map(o => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-weak)">
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:13px">${esc(o.name)}${o.short_name ? ` <span style="color:var(--text-muted);font-weight:400">(${esc(o.short_name)})</span>` : ''}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
              ${o.primary_user_name ? `Primary: ${esc(o.primary_user_name)}${o.primary_user_email ? ` &lt;${esc(o.primary_user_email)}&gt;` : ''}` : 'No primary user'}
              &nbsp;&middot;&nbsp;
              ${o.user_count} user${o.user_count !== 1 ? 's' : ''}
              &nbsp;&middot;&nbsp;
              ${o.active_token_count} active token${o.active_token_count !== 1 ? 's' : ''}
              &nbsp;&middot;&nbsp;
              <span style="color:${o.status === 'active' ? 'var(--success)' : 'var(--danger)'}">${esc(o.status)}</span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="cpOpenOrgDetail('${o.id}')"><i class="fa-solid fa-users"></i> Manage</button>
        </div>
      `).join('');
    } catch (e) {
      body.innerHTML = `<div style="padding:12px;color:var(--danger);font-size:12px">Failed to load organizations: ${esc(String(e))}</div>`;
    }
  }

  // ── Create org modal ─────────────────────────────────────────────────
  function cpOpenCreateOrgModal() {
    document.getElementById('cp-org-name').value = '';
    document.getElementById('cp-org-short').value = '';
    document.getElementById('cp-org-logo').value = '';
    document.getElementById('cp-org-color').value = '';
    openModal('cp-create-org-modal');
  }

  async function cpSubmitCreateOrg() {
    const btn = document.getElementById('cp-create-org-btn');
    const name = document.getElementById('cp-org-name').value.trim();
    if (!name) { alert('Organization name is required.'); return; }
    btn.disabled = true;
    try {
      await api('POST', '/api/admin/client-orgs', {
        name,
        short_name:  document.getElementById('cp-org-short').value.trim() || null,
        logo_url:    document.getElementById('cp-org-logo').value.trim() || null,
        theme_color: document.getElementById('cp-org-color').value.trim() || null,
      });
      closeModal('cp-create-org-modal');
      cpLoadOrgs();
    } catch (e) {
      alert('Failed to create organization: ' + e.message);
    } finally {
      btn.disabled = false;
    }
  }

  // ── Org detail modal ─────────────────────────────────────────────────
  async function cpOpenOrgDetail(orgId) {
    _currentOrgId = orgId;
    document.getElementById('cp-org-detail-name').textContent = 'Loading…';
    document.getElementById('cp-org-users-body').innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i></div>';
    openModal('cp-org-detail-modal');
    try {
      const data = await api('GET', `/api/admin/client-orgs/${orgId}`);
      document.getElementById('cp-org-detail-name').textContent = data.org.name;
      renderOrgUsers(data.users);
    } catch (e) {
      document.getElementById('cp-org-users-body').innerHTML = `<div style="color:var(--danger);font-size:12px">Failed to load: ${esc(String(e))}</div>`;
    }
  }

  function renderOrgUsers(users) {
    const body = document.getElementById('cp-org-users-body');
    if (!users.length) {
      body.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:13px">No users yet. Add one to generate a login link.</div>';
      return;
    }
    body.innerHTML = users.map(u => {
      const activeTokens = (u.tokens || []).filter(t => !t.revoked_at && (!t.expires_at || new Date(t.expires_at) > new Date()));
      return `
        <div style="border:1px solid var(--border-weak);border-radius:6px;padding:10px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="flex:1">
              <span style="font-weight:600;font-size:13px">${u.name ? esc(u.name) : '<em style="color:var(--text-muted)">Unnamed</em>'}</span>
              ${u.is_primary ? ' <span style="font-size:10px;background:var(--primary);color:#fff;border-radius:3px;padding:1px 5px">Primary</span>' : ''}
              ${u.email ? `<span style="font-size:11px;color:var(--text-muted);margin-left:6px">${esc(u.email)}</span>` : ''}
            </div>
            <span style="font-size:11px;color:${u.status === 'active' ? 'var(--success)' : 'var(--danger)'}">${esc(u.status)}</span>
            <button class="btn btn-primary btn-sm" onclick="cpGenerateToken('${u.id}')"><i class="fa-solid fa-link"></i> Generate Login Link</button>
          </div>
          ${activeTokens.length ? `
            <div style="font-size:11px;color:var(--text-muted)">
              ${activeTokens.length} active token${activeTokens.length !== 1 ? 's' : ''}
              — last used: ${activeTokens[0].last_used_at ? new Date(activeTokens[0].last_used_at).toLocaleString() : 'never'}
              ${activeTokens.map(t => `
                <button class="btn btn-secondary btn-sm" style="margin-left:6px;font-size:10px;padding:2px 6px" onclick="cpRevokeToken('${t.id}')">Revoke</button>
              `).join('')}
            </div>
          ` : '<div style="font-size:11px;color:var(--text-muted)">No active tokens</div>'}
        </div>
      `;
    }).join('');
  }

  // ── Add user modal ───────────────────────────────────────────────────
  function cpOpenAddUserModal() {
    document.getElementById('cp-user-name').value = '';
    document.getElementById('cp-user-email').value = '';
    document.getElementById('cp-user-primary').checked = false;
    openModal('cp-add-user-modal');
  }

  async function cpSubmitAddUser() {
    const btn = document.getElementById('cp-add-user-btn');
    btn.disabled = true;
    try {
      await api('POST', `/api/admin/client-orgs/${_currentOrgId}/users`, {
        name:       document.getElementById('cp-user-name').value.trim() || null,
        email:      document.getElementById('cp-user-email').value.trim() || null,
        is_primary: document.getElementById('cp-user-primary').checked,
      });
      closeModal('cp-add-user-modal');
      await cpOpenOrgDetail(_currentOrgId);
    } catch (e) {
      alert('Failed to add user: ' + e.message);
    } finally {
      btn.disabled = false;
    }
  }

  // ── Generate token ───────────────────────────────────────────────────
  async function cpGenerateToken(userId) {
    try {
      const data = await api('POST', `/api/admin/client-orgs/${_currentOrgId}/users/${userId}/tokens`, {});
      document.getElementById('cp-token-url').textContent = data.login_url;
      openModal('cp-token-modal');
      await cpOpenOrgDetail(_currentOrgId);
    } catch (e) {
      alert('Failed to generate token: ' + e.message);
    }
  }

  function cpCopyTokenUrl() {
    const url = document.getElementById('cp-token-url').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        const btn = event.target.closest('button');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      });
    } else {
      prompt('Copy this login URL:', url);
    }
  }

  // ── Revoke token ─────────────────────────────────────────────────────
  async function cpRevokeToken(tokenId) {
    if (!confirm('Revoke this login token? The client will be logged out and their link will stop working.')) return;
    try {
      await api('POST', `/api/admin/client-tokens/${tokenId}/revoke`, {});
      await cpOpenOrgDetail(_currentOrgId);
      cpLoadOrgs();
    } catch (e) {
      alert('Failed to revoke token: ' + e.message);
    }
  }

  // ── Create Approval Request (Wave 49b) ──────────────────────────────
  function cpOpenCreateApprovalModal() {
    if (!_currentOrgId) {
      alert('No org selected');
      return;
    }
    // Clear form fields
    document.getElementById('cp-approval-title').value = '';
    document.getElementById('cp-approval-description').value = '';
    document.getElementById('cp-approval-project').value = '';
    document.getElementById('cp-approval-document').value = '';
    document.getElementById('cp-approval-error').style.display = 'none';
    openModal('cp-create-approval-modal');
  }

  async function cpSubmitCreateApproval() {
    const orgId = _currentOrgId;
    if (!orgId) {
      alert('No org selected');
      return;
    }

    const title = document.getElementById('cp-approval-title').value.trim();
    const description = document.getElementById('cp-approval-description').value.trim() || null;
    const projectId = document.getElementById('cp-approval-project').value.trim() || null;
    const documentId = document.getElementById('cp-approval-document').value.trim() || null;

    if (!title) {
      showApprovalError('Title is required');
      return;
    }

    const btn = document.getElementById('cp-create-approval-btn');
    btn.disabled = true;
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner" style="animation:spin 1s linear infinite"></i>';

    try {
      const approval = await api('POST', `/api/admin/client-orgs/${orgId}/approvals`, {
        title,
        description,
        project_id: projectId,
        document_id: documentId
      });

      closeModal('cp-create-approval-modal');
      alert(`Approval "${approval.title}" created successfully`);

      // Refresh org detail to show updated state
      if (_currentOrgId) {
        await cpOpenOrgDetail(_currentOrgId);
      }
    } catch (e) {
      showApprovalError(e.message || 'Request failed');
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }

  function showApprovalError(msg) {
    const errDiv = document.getElementById('cp-approval-error');
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Hook into openSettings so the list loads when admin opens the modal.
  const _origOpenSettings = window.openSettings;
  window.openSettings = function(...args) {
    if (_origOpenSettings) _origOpenSettings(...args);
    cpLoadOrgs();
  };

  // Expose functions globally for onclick handlers.
  window.cpOpenCreateOrgModal      = cpOpenCreateOrgModal;
  window.cpSubmitCreateOrg         = cpSubmitCreateOrg;
  window.cpOpenOrgDetail           = cpOpenOrgDetail;
  window.cpOpenAddUserModal        = cpOpenAddUserModal;
  window.cpSubmitAddUser           = cpSubmitAddUser;
  window.cpGenerateToken           = cpGenerateToken;
  window.cpCopyTokenUrl            = cpCopyTokenUrl;
  window.cpRevokeToken             = cpRevokeToken;
  window.cpOpenCreateApprovalModal = cpOpenCreateApprovalModal;
  window.cpSubmitCreateApproval    = cpSubmitCreateApproval;
  window.cpLoadOrgs                = cpLoadOrgs;
})();
