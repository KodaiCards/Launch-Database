// public/js/admin_users.js — Standalone User Management UI (Wave 82)
// Exposes window.AdminUsers.open() — opens a full-screen modal with user
// table, search/filter, create/edit/role-change/reset-password/deactivate.
// All mutations use the existing /api/users/* endpoints in auth.js.
//
// Designed as a pure IIFE — no dependencies beyond what admin.html already
// loads (fetch + credentials:include, LFS.toast, esc(), confirmDialog()).

(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  // ─── Constants ──────────────────────────────────────────────────────────────

  const VALID_ROLES = [
    'admin',
    'design_manager',
    'permitting_manager',
    'design_engineer',
    'permitting_engineer',
    'customer',
  ];

  const ROLE_LABELS = {
    admin:                'Admin',
    design_manager:       'Design Mgr',
    permitting_manager:   'Permit Mgr',
    design_engineer:      'Design Eng',
    permitting_engineer:  'Permit Eng',
    customer:             'Customer',
  };

  const MIN_PW_LEN = 10;

  // ─── Module State ───────────────────────────────────────────────────────────

  let _allUsers = [];         // raw list from GET /api/users
  let _searchTerm = '';
  let _roleFilter = '';
  let _showInactive = false;

  // ─── Escape helper ──────────────────────────────────────────────────────────
  // Use the global esc() if present (defined in admin.html); otherwise define
  // a safe inline fallback so the module works stand-alone.

  function _esc(s) {
    if (typeof esc === 'function') return esc(s);
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── Toast helper ───────────────────────────────────────────────────────────

  function _toast(msg, type) {
    // type: 'success' | 'error' | 'warn'
    if (window.LFS && window.LFS.toast) {
      if (type === 'error') window.LFS.toast.error(msg);
      else if (type === 'warn') window.LFS.toast.warn(msg);
      else window.LFS.toast.success(msg);
      return;
    }
    // Inline fallback toast
    const t = document.createElement('div');
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    Object.assign(t.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '9999',
      padding: '12px 18px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#fff',
      background: type === 'error' ? 'var(--danger, #ef4444)'
                : type === 'warn'  ? 'var(--warning, #f59e0b)'
                :                    'var(--success, #22c55e)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      transition: 'opacity 0.3s',
    });
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 350); }, 2800);
  }

  // ─── Fetch helper ────────────────────────────────────────────────────────────

  async function _apiFetch(path, method, body) {
    const opts = {
      method: method || 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  // ─── Modal DOM Management ────────────────────────────────────────────────────

  const OVERLAY_ID  = 'admin-users-overlay';
  const INNER_ID    = 'admin-users-modal';

  function _ensureOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'admin-users-modal-title');
    Object.assign(overlay.style, {
      display: 'none',
      position: 'fixed',
      inset: '0',
      zIndex: '1300',
      background: 'rgba(0,0,0,0.55)',
      overflowY: 'auto',
      padding: '24px 16px',
    });

    overlay.innerHTML = `
      <div id="${INNER_ID}" style="
        background: var(--surface, #fff);
        border-radius: 12px;
        max-width: 960px;
        width: 100%;
        margin: 0 auto;
        box-shadow: 0 8px 40px rgba(0,0,0,0.22);
        display: flex;
        flex-direction: column;
        min-height: 400px;
      ">
        <!-- Header -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid var(--border-weak, #e5e7eb);
        ">
          <span id="admin-users-modal-title" style="font-size:16px;font-weight:700">
            <i class="fa-solid fa-users" style="color:var(--primary);margin-right:8px" aria-hidden="true"></i>
            User Management
          </span>
          <button id="admin-users-close-btn"
            class="btn btn-icon btn-secondary"
            aria-label="Close User Management"
            style="flex-shrink:0"
          ><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </div>

        <!-- Toolbar -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border-weak, #e5e7eb);
        ">
          <div style="position:relative;flex:1;min-width:160px">
            <i class="fa-solid fa-magnifying-glass" style="
              position:absolute;left:10px;top:50%;transform:translateY(-50%);
              color:var(--text-muted);font-size:12px;pointer-events:none
            " aria-hidden="true"></i>
            <input
              id="admin-users-search"
              type="search"
              placeholder="Search username or name…"
              aria-label="Search users"
              style="
                width:100%;padding:7px 10px 7px 30px;
                border:1px solid var(--border-weak,#e5e7eb);
                border-radius:6px;font-size:13px;
                background:var(--surface,#fff);color:var(--text,#111);
                box-sizing:border-box;
              "
            >
          </div>

          <select id="admin-users-role-filter" aria-label="Filter by role" style="
            padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);
            border-radius:6px;font-size:13px;
            background:var(--surface,#fff);color:var(--text,#111);min-width:150px;
          ">
            <option value="">All roles</option>
            ${VALID_ROLES.map(r => `<option value="${r}">${ROLE_LABELS[r] || r}</option>`).join('')}
          </select>

          <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;white-space:nowrap">
            <input type="checkbox" id="admin-users-show-inactive" style="width:auto">
            Show deactivated
          </label>

          <div style="flex:1"></div>

          <button id="admin-users-new-btn" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-user-plus" aria-hidden="true"></i> New User
          </button>
        </div>

        <!-- Table body -->
        <div id="admin-users-table-wrap" style="flex:1;overflow-x:auto;padding:0 20px 20px">
          <div id="admin-users-table-body" style="margin-top:12px">
            <div style="padding:32px;text-align:center;color:var(--text-muted)">
              <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading users…
            </div>
          </div>
        </div>
      </div>

      <!-- ── Create / Edit User sub-modal ─────────────────────────────────── -->
      <div id="admin-users-form-overlay" role="dialog" aria-modal="true" aria-labelledby="auf-title" style="
        display:none;position:fixed;inset:0;z-index:1400;
        background:rgba(0,0,0,0.45);
        display:none;align-items:center;justify-content:center;
      ">
        <div style="
          background:var(--surface,#fff);border-radius:10px;
          max-width:520px;width:95%;padding:24px;
          box-shadow:0 4px 32px rgba(0,0,0,0.22);
          position:relative;
        ">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
            <span id="auf-title" style="font-size:15px;font-weight:700"></span>
            <button id="auf-close" class="btn btn-icon btn-secondary" aria-label="Close form">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <input type="hidden" id="auf-user-id">

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label for="auf-username" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">Username *</label>
              <input id="auf-username" type="text" autocomplete="off" spellcheck="false" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
            </div>
            <div>
              <label for="auf-fullname" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">Full Name</label>
              <input id="auf-fullname" type="text" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
            </div>
            <div>
              <label for="auf-email" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">Email</label>
              <input id="auf-email" type="email" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
            </div>
            <div>
              <label for="auf-role" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">Role *</label>
              <select id="auf-role" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
                ${VALID_ROLES.map(r => `<option value="${r}">${ROLE_LABELS[r] || r}</option>`).join('')}
              </select>
            </div>
          </div>

          <div id="auf-pw-wrap" style="margin-top:12px">
            <label for="auf-password" id="auf-pw-label" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">Password *</label>
            <input id="auf-password" type="password" autocomplete="new-password" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
            <p id="auf-pw-hint" style="font-size:11px;color:var(--text-muted);margin:4px 0 0">Min ${MIN_PW_LEN} characters. Tell the user their temporary password — there is no email reset yet.</p>
          </div>

          <div id="auf-active-wrap" style="display:none;margin-top:12px">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
              <input type="checkbox" id="auf-active" style="width:auto">
              Account active
            </label>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px">
            <button id="auf-cancel" class="btn btn-secondary">Cancel</button>
            <button id="auf-save" class="btn btn-primary">
              <i class="fa-solid fa-check" aria-hidden="true"></i> Save
            </button>
          </div>
        </div>
      </div>

      <!-- ── Deactivate / Reactivate Confirm sub-modal ──────────────────── -->
      <div id="admin-users-deact-overlay" role="dialog" aria-modal="true" aria-labelledby="aud-title" style="
        display:none;position:fixed;inset:0;z-index:1400;
        background:rgba(0,0,0,0.45);
        align-items:center;justify-content:center;
      ">
        <div style="
          background:var(--surface,#fff);border-radius:10px;
          max-width:420px;width:95%;padding:24px;
          box-shadow:0 4px 32px rgba(0,0,0,0.22);
        ">
          <h3 id="aud-title" style="font-size:15px;font-weight:700;margin:0 0 10px"></h3>
          <p id="aud-msg" style="font-size:13px;color:var(--text-muted);margin:0 0 20px"></p>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <button id="aud-cancel" class="btn btn-secondary">Cancel</button>
            <button id="aud-confirm" class="btn" style="background:var(--danger,#ef4444);color:#fff;border:none">Confirm</button>
          </div>
        </div>
      </div>

      <!-- ── Reset Password sub-modal ────────────────────────────────────── -->
      <div id="admin-users-pw-overlay" role="dialog" aria-modal="true" aria-labelledby="aupw-title" style="
        display:none;position:fixed;inset:0;z-index:1400;
        background:rgba(0,0,0,0.45);
        align-items:center;justify-content:center;
      ">
        <div style="
          background:var(--surface,#fff);border-radius:10px;
          max-width:420px;width:95%;padding:24px;
          box-shadow:0 4px 32px rgba(0,0,0,0.22);
        ">
          <h3 id="aupw-title" style="font-size:15px;font-weight:700;margin:0 0 10px">Reset Password</h3>
          <p id="aupw-username" style="font-size:13px;color:var(--text-muted);margin:0 0 14px"></p>
          <input type="hidden" id="aupw-user-id">
          <label for="aupw-pw" style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:4px">New Password *</label>
          <input id="aupw-pw" type="password" autocomplete="new-password" style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid var(--border-weak,#e5e7eb);border-radius:6px;font-size:13px;background:var(--surface,#fff);color:var(--text,#111)">
          <p style="font-size:11px;color:var(--text-muted);margin:4px 0 20px">Min ${MIN_PW_LEN} characters. All existing sessions for this user will be invalidated.</p>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <button id="aupw-cancel" class="btn btn-secondary">Cancel</button>
            <button id="aupw-save" class="btn btn-primary">
              <i class="fa-solid fa-key" aria-hidden="true"></i> Reset Password
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    _bindOverlayEvents(overlay);
  }

  // ─── Event Binding ────────────────────────────────────────────────────────

  function _bindOverlayEvents(overlay) {
    // Close main modal
    document.getElementById('admin-users-close-btn').addEventListener('click', _close);
    overlay.addEventListener('click', e => { if (e.target === overlay) _close(); });
    document.addEventListener('keydown', _onKeyDown);

    // Search / filter
    document.getElementById('admin-users-search').addEventListener('input', e => {
      _searchTerm = e.target.value.trim().toLowerCase();
      _render();
    });
    document.getElementById('admin-users-role-filter').addEventListener('change', e => {
      _roleFilter = e.target.value;
      _render();
    });
    document.getElementById('admin-users-show-inactive').addEventListener('change', e => {
      _showInactive = e.target.checked;
      _render();
    });

    // New user
    document.getElementById('admin-users-new-btn').addEventListener('click', () => _openForm(null));

    // Sub-modal — Create/Edit form
    document.getElementById('auf-close').addEventListener('click', _closeForm);
    document.getElementById('auf-cancel').addEventListener('click', _closeForm);
    document.getElementById('auf-save').addEventListener('click', _saveForm);

    // Sub-modal — Deactivate confirm
    document.getElementById('aud-cancel').addEventListener('click', _closeDeact);
    // aud-confirm handler set dynamically per row

    // Sub-modal — Reset password
    document.getElementById('aupw-cancel').addEventListener('click', _closePw);
    document.getElementById('aupw-save').addEventListener('click', _savePw);

    // Focus trap within the main overlay
    overlay.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = overlay.querySelectorAll(
        'button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  function _onKeyDown(e) {
    if (e.key === 'Escape') {
      // Close innermost open sub-modal first, then main modal
      const pwOverlay  = document.getElementById('admin-users-pw-overlay');
      const deactOverlay = document.getElementById('admin-users-deact-overlay');
      const formOverlay  = document.getElementById('admin-users-form-overlay');
      if (pwOverlay && pwOverlay.style.display !== 'none')    { _closePw(); return; }
      if (deactOverlay && deactOverlay.style.display !== 'none') { _closeDeact(); return; }
      if (formOverlay && formOverlay.style.display !== 'none')   { _closeForm(); return; }
      _close();
    }
  }

  // ─── Open / Close ─────────────────────────────────────────────────────────

  async function open() {
    _ensureOverlay();
    const overlay = document.getElementById(OVERLAY_ID);
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Focus the close button for accessibility
    setTimeout(() => {
      const btn = document.getElementById('admin-users-close-btn');
      if (btn) btn.focus();
    }, 80);
    await loadUsers();
  }

  function _close() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _onKeyDown);
  }

  // ─── Load + Render ────────────────────────────────────────────────────────

  async function loadUsers() {
    const tbody = document.getElementById('admin-users-table-body');
    if (!tbody) return;
    try {
      _allUsers = await _apiFetch('/api/users');
      _render();
    } catch (e) {
      tbody.innerHTML = `<div style="padding:24px;text-align:center;color:var(--danger,#ef4444)">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        Could not load users: ${_esc(e.message)}
      </div>`;
    }
  }

  function _filtered() {
    return _allUsers.filter(u => {
      if (!_showInactive && !u.active) return false;
      if (_roleFilter && u.role !== _roleFilter) return false;
      if (_searchTerm) {
        const hay = ((u.username || '') + ' ' + (u.full_name || '') + ' ' + (u.email || '')).toLowerCase();
        if (!hay.includes(_searchTerm)) return false;
      }
      return true;
    });
  }

  function _render() {
    const tbody = document.getElementById('admin-users-table-body');
    if (!tbody) return;
    const list = _filtered();

    if (!list.length) {
      tbody.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">
        ${_allUsers.length ? 'No users match the current filters.' : 'No users yet.'}
      </div>`;
      return;
    }

    let html = `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:var(--surface-2,#f9fafb);border-bottom:2px solid var(--border-weak,#e5e7eb)">
          <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Username</th>
          <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Full Name</th>
          <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Email</th>
          <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Role</th>
          <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Last Login</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)">Active</th>
          <th style="padding:8px 10px"></th>
        </tr>
      </thead>
      <tbody>`;

    for (const u of list) {
      const last = u.last_login ? new Date(u.last_login).toLocaleDateString() : '—';
      const activeIcon = u.active
        ? `<i class="fa-solid fa-circle-check" style="color:var(--success,#22c55e)" aria-label="Active"></i>`
        : `<i class="fa-solid fa-circle-pause" style="color:var(--text-muted)" aria-label="Deactivated"></i>`;
      const roleLabel = ROLE_LABELS[u.role] || u.role;
      const roleBadgeColor = u.role === 'admin'
        ? 'var(--danger,#ef4444)'
        : u.role.endsWith('_manager') ? 'var(--warning,#f59e0b)' : 'var(--primary,#3b82f6)';

      html += `<tr style="border-bottom:1px solid var(--border-weak,#e5e7eb);${u.active ? '' : 'opacity:0.6'}">
        <td style="padding:8px 10px;font-family:monospace;font-weight:700">${_esc(u.username)}</td>
        <td style="padding:8px 10px">${_esc(u.full_name || '—')}</td>
        <td style="padding:8px 10px;color:var(--text-muted);font-size:12px">${_esc(u.email || '—')}</td>
        <td style="padding:8px 10px">
          <span style="
            display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;
            background:${roleBadgeColor}22;color:${roleBadgeColor}
          ">${_esc(roleLabel)}</span>
        </td>
        <td style="padding:8px 10px;color:var(--text-muted);font-size:12px">${_esc(last)}</td>
        <td style="padding:8px 10px;text-align:center">${activeIcon}</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap">
          <button class="btn btn-sm btn-secondary" onclick="window._adminUsersEditUser('${u.id}')" title="Edit user" style="margin-right:4px">
            <i class="fa-solid fa-pen" aria-hidden="true"></i>
          </button>
          <button class="btn btn-sm btn-secondary" onclick="window._adminUsersResetPw('${u.id}')" title="Reset password" style="margin-right:4px">
            <i class="fa-solid fa-key" aria-hidden="true"></i>
          </button>
          ${u.active
            ? `<button class="btn btn-sm" onclick="window._adminUsersDeactivate('${u.id}','${_esc(u.username)}')"
                title="Deactivate" style="background:transparent;border:1px solid var(--danger,#ef4444);color:var(--danger,#ef4444)">
                <i class="fa-solid fa-ban" aria-hidden="true"></i>
              </button>`
            : `<button class="btn btn-sm" onclick="window._adminUsersReactivate('${u.id}','${_esc(u.username)}')"
                title="Reactivate" style="background:transparent;border:1px solid var(--success,#22c55e);color:var(--success,#22c55e)">
                <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
              </button>`
          }
        </td>
      </tr>`;
    }

    html += '</tbody></table>';
    tbody.innerHTML = html;
  }

  // ─── Create / Edit Form ──────────────────────────────────────────────────

  function _openForm(user) {
    const isNew = !user;
    document.getElementById('auf-title').textContent = isNew ? 'New User' : `Edit: ${user.username}`;
    document.getElementById('auf-user-id').value = isNew ? '' : user.id;
    document.getElementById('auf-username').value = isNew ? '' : (user.username || '');
    document.getElementById('auf-fullname').value = isNew ? '' : (user.full_name || '');
    document.getElementById('auf-email').value    = isNew ? '' : (user.email || '');
    document.getElementById('auf-role').value     = isNew ? 'design_engineer' : (user.role || 'design_engineer');
    document.getElementById('auf-password').value = '';
    document.getElementById('auf-pw-label').innerHTML = isNew
      ? 'Password *'
      : 'New Password <span style="color:var(--text-muted);font-weight:400">(leave blank to keep current)</span>';
    document.getElementById('auf-pw-hint').textContent = isNew
      ? `Min ${MIN_PW_LEN} characters. Tell the user their temporary password — there is no email reset yet.`
      : 'Only fill this in if you want to reset their password.';
    document.getElementById('auf-active-wrap').style.display = isNew ? 'none' : '';
    if (!isNew) document.getElementById('auf-active').checked = !!user.active;

    const fo = document.getElementById('admin-users-form-overlay');
    fo.style.display = 'flex';
    setTimeout(() => document.getElementById('auf-username').focus(), 60);
  }

  function _closeForm() {
    const fo = document.getElementById('admin-users-form-overlay');
    if (fo) fo.style.display = 'none';
  }

  async function _saveForm() {
    const id       = document.getElementById('auf-user-id').value;
    const username = document.getElementById('auf-username').value.trim();
    const fullname = document.getElementById('auf-fullname').value.trim() || null;
    const email    = document.getElementById('auf-email').value.trim() || null;
    const role     = document.getElementById('auf-role').value;
    const password = document.getElementById('auf-password').value;
    const active   = document.getElementById('auf-active').checked;

    if (!username) { _toast('Username is required.', 'error'); return; }
    if (/\s/.test(username)) { _toast('Username cannot contain spaces.', 'error'); return; }
    if (!id && !password) { _toast('Password is required for new users.', 'error'); return; }
    if (password && password.length < MIN_PW_LEN) {
      _toast(`Password must be at least ${MIN_PW_LEN} characters.`, 'error'); return;
    }

    const saveBtn = document.getElementById('auf-save');
    saveBtn.disabled = true;
    try {
      if (id) {
        const body = { username, role, full_name: fullname, email, active };
        if (password) body.password = password;
        await _apiFetch(`/api/users/${id}`, 'PUT', body);
        _toast(`User "${username}" updated.`);
      } else {
        await _apiFetch('/api/users', 'POST', { username, password, role, full_name: fullname, email });
        _toast(`User "${username}" created.`);
      }
      _closeForm();
      await loadUsers();
      // Sync the in-page usersCache if it exists (so the inline settings section stays consistent)
      if (typeof window.loadUsers === 'function') window.loadUsers();
    } catch (e) {
      _toast(`Save failed: ${e.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
    }
  }

  // ─── Deactivate / Reactivate ──────────────────────────────────────────────

  function _showDeact(user, isDeactivate) {
    const overlay = document.getElementById('admin-users-deact-overlay');
    document.getElementById('aud-title').textContent = isDeactivate
      ? `Deactivate "${user.username}"?`
      : `Reactivate "${user.username}"?`;
    document.getElementById('aud-msg').textContent = isDeactivate
      ? 'They will no longer be able to sign in. Their history and time entries are preserved.'
      : 'They will be able to sign in again using their existing credentials.';
    document.getElementById('aud-confirm').textContent = isDeactivate ? 'Deactivate' : 'Reactivate';
    document.getElementById('aud-confirm').style.background = isDeactivate
      ? 'var(--danger,#ef4444)'
      : 'var(--success,#22c55e)';
    overlay.style.display = 'flex';

    // Wire confirm button (replace each time to avoid stale closures)
    const confirmBtn = document.getElementById('aud-confirm');
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
    newConfirm.addEventListener('click', async () => {
      newConfirm.disabled = true;
      try {
        await _apiFetch(`/api/users/${user.id}`, 'PUT', { active: isDeactivate ? false : true });
        _closeDeact();
        _toast(isDeactivate ? `"${user.username}" deactivated.` : `"${user.username}" reactivated.`);
        await loadUsers();
        if (typeof window.loadUsers === 'function') window.loadUsers();
      } catch (e) {
        _toast(`Failed: ${e.message}`, 'error');
      } finally {
        newConfirm.disabled = false;
      }
    });

    setTimeout(() => newConfirm.focus(), 60);
  }

  function _closeDeact() {
    const o = document.getElementById('admin-users-deact-overlay');
    if (o) o.style.display = 'none';
  }

  // ─── Reset Password ────────────────────────────────────────────────────────

  function _openResetPw(user) {
    document.getElementById('aupw-title').textContent = `Reset Password: ${user.username}`;
    document.getElementById('aupw-username').textContent = `Enter a new temporary password for ${user.full_name || user.username}.`;
    document.getElementById('aupw-user-id').value = user.id;
    document.getElementById('aupw-pw').value = '';
    const o = document.getElementById('admin-users-pw-overlay');
    o.style.display = 'flex';
    setTimeout(() => document.getElementById('aupw-pw').focus(), 60);
  }

  function _closePw() {
    const o = document.getElementById('admin-users-pw-overlay');
    if (o) o.style.display = 'none';
  }

  async function _savePw() {
    const id  = document.getElementById('aupw-user-id').value;
    const pw  = document.getElementById('aupw-pw').value;
    if (!pw) { _toast('Enter a new password.', 'error'); return; }
    if (pw.length < MIN_PW_LEN) { _toast(`Password must be at least ${MIN_PW_LEN} characters.`, 'error'); return; }
    const saveBtn = document.getElementById('aupw-save');
    saveBtn.disabled = true;
    try {
      // PUT /api/users/:id with just a password field triggers password_change audit action
      await _apiFetch(`/api/users/${id}`, 'PUT', { password: pw });
      _closePw();
      _toast('Password reset. All existing sessions for this user have been invalidated.');
      await loadUsers();
      if (typeof window.loadUsers === 'function') window.loadUsers();
    } catch (e) {
      _toast(`Reset failed: ${e.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
    }
  }

  // ─── Global onclick shims (needed for table button onclick attributes) ──────

  window._adminUsersEditUser = function (id) {
    const u = _allUsers.find(x => x.id === id);
    if (!u) return;
    _openForm(u);
  };

  window._adminUsersDeactivate = function (id, username) {
    const u = _allUsers.find(x => x.id === id) || { id, username };
    _showDeact(u, true);
  };

  window._adminUsersReactivate = function (id, username) {
    const u = _allUsers.find(x => x.id === id) || { id, username };
    _showDeact(u, false);
  };

  window._adminUsersResetPw = function (id) {
    const u = _allUsers.find(x => x.id === id);
    if (!u) return;
    _openResetPw(u);
  };

  // ─── Public API ─────────────────────────────────────────────────────────────

  window.AdminUsers = { open };

  // Wire up the launch button if the DOM is already ready
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'open-user-mgmt-btn') {
      window.AdminUsers.open();
    }
    // Also handle clicks on children of the button (e.g., the icon)
    const btn = e.target && e.target.closest('#open-user-mgmt-btn');
    if (btn) window.AdminUsers.open();
  });

})();
