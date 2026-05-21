// public/js/impersonation_banner.js — Impersonation warning banner (Wave 13C)
//
// Included in: launcher.html, customer.html, admin.html, and any portal that
// should show the banner when an admin is viewing as another user.
//
// On load: calls /api/auth/me; if the response includes impersonator_id,
// renders a sticky top banner with an EXIT button.

(function () {
  const BANNER_ID = 'lfs-impersonation-banner';

  function injectBannerStyles() {
    if (document.getElementById('lfs-impersonation-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'lfs-impersonation-banner-styles';
    style.textContent = `
      #${BANNER_ID} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        background: #b45309;
        color: #fff;
        font-family: system-ui, sans-serif;
        font-size: 13px;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,.3);
      }
      #${BANNER_ID} .lfs-imp-msg {
        flex: 1;
        font-weight: 500;
      }
      #${BANNER_ID} .lfs-imp-exit {
        background: rgba(255,255,255,.2);
        border: 1px solid rgba(255,255,255,.5);
        color: #fff;
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
      }
      #${BANNER_ID} .lfs-imp-exit:hover {
        background: rgba(255,255,255,.35);
      }
      /* Push the page content down so the banner doesn't overlap */
      body.lfs-impersonating {
        padding-top: 40px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function renderBanner(meData) {
    if (document.getElementById(BANNER_ID)) return;
    injectBannerStyles();

    const fullName = meData.full_name || meData.username || 'unknown';
    const role = (meData.role || '').replace(/_/g, ' ');
    const adminName = meData.impersonator_name || 'Admin';

    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.innerHTML = `
      <span class="lfs-imp-msg">
        &#9888;&#65039; Viewing as <strong>${_esc(fullName)}</strong>
        (${_esc(role)}) &mdash; session started by ${_esc(adminName)}
      </span>
      <button class="lfs-imp-exit" onclick="_endImpersonation()">EXIT &rarr;</button>
    `;
    document.body.prepend(banner);
    document.body.classList.add('lfs-impersonating');
  }

  // Safe HTML-escape; we don't have access to admin.html's esc() here.
  function _esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window._endImpersonation = async function () {
    try {
      await fetch('/api/admin/end-impersonation', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (_) { /* ignore network errors — we're closing anyway */ }
    // Try to close the tab; fall back to redirecting to the launcher so the
    // admin ends up somewhere useful.
    try { window.close(); } catch (_) {}
    // window.close() only works on tabs opened by script; if it silently
    // fails, redirect instead.
    setTimeout(() => { window.location.href = '/launcher.html'; }, 150);
  };

  // Run check after DOM is ready.
  function checkImpersonation() {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.impersonator_id) renderBanner(data);
      })
      .catch(() => { /* non-fatal */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkImpersonation);
  } else {
    checkImpersonation();
  }
})();
