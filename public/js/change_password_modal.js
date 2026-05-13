// public/js/change_password_modal.js — shared change-password modal.
//
// Used by the 3 portals (timeclock, design, permitting). Self-contained:
// injects its own HTML on first openChangePasswordModal() call so portal
// pages don't need to duplicate the markup, and posts to the existing
// /api/auth/change-password endpoint.
//
// Each portal already has its own api() implementation, but this module
// uses fetch() directly so it works regardless of whether api() is loaded.
//
// A11y: role=dialog, aria-modal, aria-labelledby, for=/id= label pairs,
// aria-label on close button, role=alert on error element, focus trap.

(function () {
  let _injected = false;
  let _trap = null;

  function _inject() {
    if (_injected) return;
    _injected = true;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="cpm-title"
           class="modal-overlay" id="cpm-modal"
           style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2100;align-items:center;justify-content:center">
        <div style="background:var(--white,#fff);color:var(--text,#212529);border-radius:10px;padding:18px;max-width:420px;width:92%;box-shadow:0 10px 30px rgba(0,0,0,.3)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <strong id="cpm-title" style="font-size:16px">Change Password</strong>
            <button aria-label="Close dialog" onclick="closeChangePasswordModal()" style="background:transparent;border:0;color:var(--text-muted,#6c757d);font-size:18px;cursor:pointer">&times;</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div>
              <label for="cpm-current" style="font-size:12px;color:var(--text-muted,#6c757d);display:block;margin-bottom:4px">Current Password</label>
              <input type="password" id="cpm-current" autocomplete="current-password" style="width:100%;padding:8px;border:1px solid var(--gray-border,#dee2e6);border-radius:6px;background:var(--white,#fff);color:var(--text,#212529)">
            </div>
            <div>
              <label for="cpm-new" style="font-size:12px;color:var(--text-muted,#6c757d);display:block;margin-bottom:4px">New Password (min 6 chars)</label>
              <input type="password" id="cpm-new" autocomplete="new-password" style="width:100%;padding:8px;border:1px solid var(--gray-border,#dee2e6);border-radius:6px;background:var(--white,#fff);color:var(--text,#212529)">
            </div>
            <div>
              <label for="cpm-confirm" style="font-size:12px;color:var(--text-muted,#6c757d);display:block;margin-bottom:4px">Confirm New Password</label>
              <input type="password" id="cpm-confirm" autocomplete="new-password" style="width:100%;padding:8px;border:1px solid var(--gray-border,#dee2e6);border-radius:6px;background:var(--white,#fff);color:var(--text,#212529)">
            </div>
            <div id="cpm-error" role="alert" style="color:#dc3545;font-size:12px;display:none"></div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">
            <button onclick="closeChangePasswordModal()" style="padding:8px 14px;background:transparent;border:1px solid var(--gray-border,#dee2e6);border-radius:6px;cursor:pointer;color:var(--text,#212529)">Cancel</button>
            <button onclick="submitChangePasswordModal()" style="padding:8px 14px;background:#1B5FA0;color:#fff;border:0;border-radius:6px;cursor:pointer;font-weight:600"><i class="fa-solid fa-key" aria-hidden="true"></i> Update</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  window.openChangePasswordModal = function () {
    _inject();
    document.getElementById('cpm-current').value = '';
    document.getElementById('cpm-new').value = '';
    document.getElementById('cpm-confirm').value = '';
    const err = document.getElementById('cpm-error');
    err.style.display = 'none';
    err.textContent = '';
    const m = document.getElementById('cpm-modal');
    m.style.display = 'flex';
    // A11y: trap focus inside the modal; move focus to first input immediately.
    if (window.trapFocus) {
      if (_trap) _trap.release();
      _trap = trapFocus(m, {
        escClose: true,
        onEsc: window.closeChangePasswordModal,
        initialFocus: document.getElementById('cpm-current'),
      });
    } else {
      // Fallback: direct focus move (matches original setTimeout pattern).
      setTimeout(() => document.getElementById('cpm-current')?.focus(), 50);
    }
  };

  window.closeChangePasswordModal = function () {
    const m = document.getElementById('cpm-modal');
    if (m) m.style.display = 'none';
    // Release focus trap and restore focus to the trigger element.
    if (_trap) { _trap.release(); _trap = null; }
  };

  window.submitChangePasswordModal = async function () {
    const cur = document.getElementById('cpm-current').value;
    const newp = document.getElementById('cpm-new').value;
    const conf = document.getElementById('cpm-confirm').value;
    const err = document.getElementById('cpm-error');
    err.style.display = 'none';
    err.textContent = '';
    if (!cur || !newp) { err.textContent = 'Both passwords required'; err.style.display = 'block'; return; }
    if (newp !== conf) { err.textContent = 'New passwords do not match'; err.style.display = 'block'; return; }
    if (newp.length < 6) { err.textContent = 'New password must be at least 6 characters'; err.style.display = 'block'; return; }
    try {
      const r = await fetch('/api/auth/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password: cur, new_password: newp }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Change failed');
      window.closeChangePasswordModal();
      if (window.LFS && window.LFS.toast) window.LFS.toast.success('Password updated.');
      else alert('Password updated.');
    } catch (e) {
      err.textContent = 'Failed: ' + (e.message || e);
      err.style.display = 'block';
    }
  };
})();
