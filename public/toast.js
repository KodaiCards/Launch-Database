/* Launch Fiber Services — Toast notification helper.
 *
 * Drop-in replacement for native `alert()` and "shows-as-status" patterns.
 * Stays out of the way (top-right corner), auto-dismisses, supports
 * success / info / warn / error, and never steals focus.
 *
 * Usage:
 *   LFS.toast.success('Saved.');
 *   LFS.toast.error('Could not save: ' + err.message);
 *   LFS.toast.info('3 permits ready to invoice', { actionLabel: 'Review',
 *                                                    onAction: () => location.hash = '#billing' });
 *   LFS.toast.show({ message, type: 'warn', durationMs: 6000 });
 *
 * No dependencies. ~3 KB. Safe to load on every page.
 */
(function () {
  if (window.LFS && window.LFS.toast) return; // already loaded

  // Inject the stylesheet exactly once. Inlined here so the helper is one
  // file to ship, no separate CSS request, no CSP-style cascade headaches.
  var STYLE_ID = 'lfs-toast-style';
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    // Tokens with hex fallbacks: pages that haven't loaded the token
    // system (login screen, plain-static pages) still render readable
    // toasts. Pages that DO have the tokens (admin + 4 portals) get
    // automatic dark-mode contrast.
    style.textContent = [
      '#lfs-toast-stack{position:fixed;top:14px;right:14px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:360px;pointer-events:none;font-family:Inter,system-ui,sans-serif}',
      '.lfs-toast{pointer-events:auto;background:var(--surface-2,#fff);border:1px solid var(--gray-border,#DEE2E6);border-left:4px solid var(--text-muted,#6C757D);border-radius:8px;padding:10px 12px;box-shadow:0 4px 16px rgba(0,0,0,.18);font-size:14px;line-height:1.4;color:var(--text,#212529);animation:lfsToastIn .18s ease-out;display:flex;align-items:flex-start;gap:10px}',
      '.lfs-toast.lfs-toast-success{border-left-color:var(--success,#28A745)}',
      '.lfs-toast.lfs-toast-info{border-left-color:var(--info,#1B5FA0)}',
      '.lfs-toast.lfs-toast-warn{border-left-color:var(--warning,#F0A500)}',
      '.lfs-toast.lfs-toast-error{border-left-color:var(--danger,#DC3545)}',
      '.lfs-toast.lfs-toast-leaving{animation:lfsToastOut .15s ease-in forwards}',
      '.lfs-toast-msg{flex:1;word-break:break-word}',
      '.lfs-toast-btn{background:transparent;border:0;color:var(--primary,#1B5FA0);font-weight:500;cursor:pointer;padding:0;font-size:13px}',
      '.lfs-toast-btn:hover{text-decoration:underline}',
      '.lfs-toast-close{background:transparent;border:0;color:var(--text-muted,#6C757D);cursor:pointer;font-size:16px;line-height:1;padding:0 0 0 4px;margin-left:auto}',
      '@keyframes lfsToastIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}',
      '@keyframes lfsToastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(20px);opacity:0}}',
      // Mobile: full-width at top, easier to read on phones
      '@media (max-width:640px){#lfs-toast-stack{left:8px;right:8px;top:8px;max-width:none}}',
    ].join('');
    document.head.appendChild(style);
  }

  function ensureStack() {
    var stack = document.getElementById('lfs-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'lfs-toast-stack';
      // Default to polite; individual error toasts use assertive via a
      // peer alert div — see show() below.
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }

  function show(opts) {
    if (typeof opts === 'string') opts = { message: opts };
    var message = opts.message || '';
    var type = opts.type || 'info';                          // success | info | warn | error
    var durationMs = opts.durationMs != null ? opts.durationMs
                   : (type === 'error' ? 7000 : 4000);
    var actionLabel = opts.actionLabel;
    var onAction = opts.onAction;

    var stack = ensureStack();

    // Error toasts use role="alert" + aria-live="assertive" so screen
    // readers interrupt the current announcement. We append a temporary
    // assertive div next to the polite stack, then move the toast element
    // into the main stack where it renders visually.
    var isError = (type === 'error');
    var assertiveEl;
    if (isError) {
      assertiveEl = document.getElementById('lfs-toast-assertive');
      if (!assertiveEl) {
        assertiveEl = document.createElement('div');
        assertiveEl.id = 'lfs-toast-assertive';
        assertiveEl.setAttribute('role', 'alert');
        assertiveEl.setAttribute('aria-live', 'assertive');
        assertiveEl.setAttribute('aria-atomic', 'true');
        assertiveEl.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
        document.body.appendChild(assertiveEl);
      }
      // Briefly announce the message text into the assertive region so
      // screen readers interrupt and read it immediately.
      assertiveEl.textContent = message;
      setTimeout(function () { if (assertiveEl) assertiveEl.textContent = ''; }, 1000);
    }

    var el = document.createElement('div');
    el.className = 'lfs-toast lfs-toast-' + type;

    var msg = document.createElement('div');
    msg.className = 'lfs-toast-msg';
    msg.textContent = message;
    el.appendChild(msg);

    if (actionLabel && typeof onAction === 'function') {
      var btn = document.createElement('button');
      btn.className = 'lfs-toast-btn';
      btn.type = 'button';
      btn.textContent = actionLabel;
      btn.addEventListener('click', function () { try { onAction(); } catch (e) {} dismiss(); });
      el.appendChild(btn);
    }

    var close = document.createElement('button');
    close.className = 'lfs-toast-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '×';
    close.addEventListener('click', dismiss);
    el.appendChild(close);

    stack.appendChild(el);

    var dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      el.classList.add('lfs-toast-leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
    }
    if (durationMs > 0) {
      var t = setTimeout(dismiss, durationMs);
      // Pause auto-dismiss while the user is hovering — they're reading it.
      el.addEventListener('mouseenter', function () { clearTimeout(t); });
      el.addEventListener('mouseleave', function () { t = setTimeout(dismiss, 1500); });
    }
    return { dismiss: dismiss };
  }

  window.LFS = window.LFS || {};
  window.LFS.toast = {
    show: show,
    success: function (msg, opts) { return show(Object.assign({ message: msg, type: 'success' }, opts || {})); },
    info:    function (msg, opts) { return show(Object.assign({ message: msg, type: 'info'    }, opts || {})); },
    warn:    function (msg, opts) { return show(Object.assign({ message: msg, type: 'warn'    }, opts || {})); },
    error:   function (msg, opts) { return show(Object.assign({ message: msg, type: 'error'   }, opts || {})); },
  };

  // Replace native alert() with toast — strictly better UX than a modal
  // that steals focus, and lets us keep all existing call sites intact
  // (~110 of them in index.html alone). Heuristic classifies the toast
  // tone from the message text. Can disable per-page with
  // window.LFS_REPLACE_ALERT = false BEFORE this script loads.
  if (window.LFS_REPLACE_ALERT !== false && !window._lfsAlertPatched) {
    window._lfsAlertPatched = true;
    var _nativeAlert = window.alert.bind(window);
    window.alert = function (msg) {
      try {
        var s = String(msg == null ? '' : msg);
        var lower = s.toLowerCase();
        var type = 'info';
        if (/error|fail|cannot|can't|couldn't|invalid|denied|forbidden|expired/i.test(lower)) {
          type = 'error';
        } else if (/saved|created|deleted|updated|success|done\b|complete\b|added/i.test(lower)) {
          type = 'success';
        } else if (/warn|caution|missing|required|please/i.test(lower)) {
          type = 'warn';
        }
        window.LFS.toast.show({ message: s, type: type, durationMs: type === 'error' ? 8000 : 5000 });
      } catch (e) {
        // If the toast machinery itself broke, fall back to the real alert
        // so the user isn't left with a silent no-op.
        _nativeAlert(msg);
      }
    };
  }

  // Global unhandled-rejection handler. Many `await api()` calls in the
  // existing pages drop errors silently — the user sees "nothing happened"
  // when something actually failed. Surfacing those as a toast is strictly
  // better than silence. Set window.LFS_CATCH_REJECTIONS = false BEFORE
  // this script loads to disable.
  if (window.LFS_CATCH_REJECTIONS !== false) {
    window.addEventListener('unhandledrejection', function (e) {
      // Ignore common noise: 401 redirects, aborted fetches.
      var reason = e.reason;
      if (reason && reason.name === 'AbortError') return;
      var msg = (reason && (reason.message || reason.toString())) || 'Something went wrong';
      // Trim Bloat: long stack traces in messages
      if (msg.length > 200) msg = msg.slice(0, 200) + '…';
      window.LFS.toast.error(msg);
    });
    // Same idea for synchronous errors in inline handlers.
    window.addEventListener('error', function (e) {
      // Skip resource-load failures (image 404, etc) — too noisy.
      if (!e.message || e.error == null) return;
      window.LFS.toast.error(e.message);
    });
  }
})();
