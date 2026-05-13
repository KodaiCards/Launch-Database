/**
 * public/js/dialog.js — shared confirmDialog / alertDialog helpers.
 *
 * Replaces native confirm() / alert() in destructive flows across admin,
 * design, and permitting portals. Does NOT require a pre-existing #modal-host
 * element — it appends its own overlay to document.body and removes it on
 * resolution.
 *
 * Usage:
 *   const ok = await confirmDialog({ title: 'Delete?', message: '...', confirmLabel: 'Delete', danger: true });
 *   if (!ok) return;
 *
 *   await alertDialog({ title: 'Info', message: '...' });
 *
 * Both functions are exposed on window so they're available to inline
 * onclick handlers as well as module-style code.
 */
(function () {
  if (window.confirmDialog && window.alertDialog) return; // already loaded

  var _hostId = 'lfs-dialog-host';

  function _ensureHost() {
    var h = document.getElementById(_hostId);
    if (!h) {
      h = document.createElement('div');
      h.id = _hostId;
      document.body.appendChild(h);
    }
    return h;
  }

  /**
   * confirmDialog({ title, message, confirmLabel, danger })
   *   title        — dialog heading (required)
   *   message      — body text, may contain \n (rendered as line breaks)
   *   confirmLabel — text on the confirm button (default: 'Confirm')
   *   danger       — if true, confirm button renders in danger/red style
   *
   * Resolves true (confirmed) or false (cancelled / Esc / backdrop click).
   */
  function confirmDialog(opts) {
    opts = opts || {};
    var title        = opts.title        || 'Confirm';
    var message      = opts.message      || '';
    var confirmLabel = opts.confirmLabel || 'Confirm';
    var danger       = !!opts.danger;

    return new Promise(function (resolve) {
      var host = _ensureHost();
      var uid  = 'dlg-' + Date.now();
      var btnCls = danger ? 'btn btn-danger' : 'btn btn-primary';

      var overlay = document.createElement('div');
      overlay.id  = uid + '-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', uid + '-title');
      overlay.style.cssText = [
        'position:fixed;inset:0;z-index:9999',
        'background:rgba(0,0,0,.45)',
        'display:flex;align-items:center;justify-content:center',
        'padding:16px',
      ].join(';');

      overlay.innerHTML = [
        '<div style="background:var(--surface-2,#fff);border:1px solid var(--gray-border,#dee2e6);border-radius:12px;',
        'max-width:440px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.22);overflow:hidden">',
          '<header style="display:flex;align-items:center;justify-content:space-between;',
          'padding:16px 20px 12px;border-bottom:1px solid var(--gray-border,#dee2e6)">',
            '<h2 id="' + uid + '-title" style="margin:0;font-size:16px;font-weight:700;color:var(--text,#212529)">',
              _esc(title),
            '</h2>',
            '<button id="' + uid + '-x" aria-label="Close dialog" ',
            'style="background:transparent;border:0;color:var(--text-muted,#6c757d);',
            'cursor:pointer;font-size:20px;line-height:1;padding:0 2px">&times;</button>',
          '</header>',
          '<div style="padding:16px 20px;font-size:13px;line-height:1.55;',
          'color:var(--text,#212529);white-space:pre-wrap;word-break:break-word">',
            _esc(message),
          '</div>',
          '<footer style="display:flex;justify-content:flex-end;gap:8px;',
          'padding:12px 20px 16px;border-top:1px solid var(--gray-border,#dee2e6)">',
            '<button id="' + uid + '-cancel" class="btn btn-secondary">Cancel</button>',
            '<button id="' + uid + '-ok" class="' + btnCls + '">' + _esc(confirmLabel) + '</button>',
          '</footer>',
        '</div>',
      ].join('');

      host.appendChild(overlay);

      // Focus the cancel button by default — keyboard users don't accidentally
      // confirm destructive actions by hitting Enter.
      var cancelBtn = document.getElementById(uid + '-cancel');
      if (cancelBtn) setTimeout(function () { cancelBtn.focus(); }, 0);

      function cleanup(result) {
        host.removeChild(overlay);
        document.removeEventListener('keydown', onKey);
        resolve(result);
      }

      document.getElementById(uid + '-ok').onclick     = function () { cleanup(true);  };
      document.getElementById(uid + '-cancel').onclick = function () { cleanup(false); };
      document.getElementById(uid + '-x').onclick      = function () { cleanup(false); };
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) cleanup(false);
      });

      function onKey(e) {
        if (e.key === 'Escape') cleanup(false);
      }
      document.addEventListener('keydown', onKey);
    });
  }

  /**
   * alertDialog({ title, message })
   *   Simple single-button info dialog. Resolves when dismissed.
   */
  function alertDialog(opts) {
    opts = opts || {};
    var title   = opts.title   || 'Notice';
    var message = opts.message || '';

    return new Promise(function (resolve) {
      var host = _ensureHost();
      var uid  = 'adlg-' + Date.now();

      var overlay = document.createElement('div');
      overlay.id  = uid + '-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', uid + '-title');
      overlay.style.cssText = [
        'position:fixed;inset:0;z-index:9999',
        'background:rgba(0,0,0,.45)',
        'display:flex;align-items:center;justify-content:center',
        'padding:16px',
      ].join(';');

      overlay.innerHTML = [
        '<div style="background:var(--surface-2,#fff);border:1px solid var(--gray-border,#dee2e6);border-radius:12px;',
        'max-width:400px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.22);overflow:hidden">',
          '<header style="display:flex;align-items:center;justify-content:space-between;',
          'padding:16px 20px 12px;border-bottom:1px solid var(--gray-border,#dee2e6)">',
            '<h2 id="' + uid + '-title" style="margin:0;font-size:16px;font-weight:700;color:var(--text,#212529)">',
              _esc(title),
            '</h2>',
            '<button id="' + uid + '-x" aria-label="Close dialog" ',
            'style="background:transparent;border:0;color:var(--text-muted,#6c757d);',
            'cursor:pointer;font-size:20px;line-height:1;padding:0 2px">&times;</button>',
          '</header>',
          '<div style="padding:16px 20px;font-size:13px;line-height:1.55;',
          'color:var(--text,#212529);white-space:pre-wrap;word-break:break-word">',
            _esc(message),
          '</div>',
          '<footer style="display:flex;justify-content:flex-end;gap:8px;',
          'padding:12px 20px 16px;border-top:1px solid var(--gray-border,#dee2e6)">',
            '<button id="' + uid + '-ok" class="btn btn-primary">OK</button>',
          '</footer>',
        '</div>',
      ].join('');

      host.appendChild(overlay);

      var okBtn = document.getElementById(uid + '-ok');
      if (okBtn) setTimeout(function () { okBtn.focus(); }, 0);

      function cleanup() {
        host.removeChild(overlay);
        document.removeEventListener('keydown', onKey);
        resolve();
      }

      document.getElementById(uid + '-ok').onclick = cleanup;
      document.getElementById(uid + '-x').onclick  = cleanup;
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) cleanup();
      });

      function onKey(e) {
        if (e.key === 'Escape') cleanup();
      }
      document.addEventListener('keydown', onKey);
    });
  }

  /** Minimal HTML-escape for title/message content. */
  function _esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.confirmDialog = confirmDialog;
  window.alertDialog   = alertDialog;
})();
