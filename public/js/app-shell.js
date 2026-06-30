/* ============================================================
   Launch Fiber Services — App-Shell JavaScript Module v1
   ============================================================
   Drop-in JS companion to /css/app-shell.css.
   Exposes window.AppShell with helpers for topbar mounting,
   sidebar mounting, toasts, modals, theme, skeletons, and
   authenticated user info.

   Usage:
     <script src="/js/app-shell.js" defer></script>
     // On DOMContentLoaded:
     AppShell.init({ title: 'Admin', portalId: 'admin' });

   This module is a COMPANION to the existing LFS.toast helper
   (toast.js). AppShell.toast() calls LFS.toast if present,
   and falls back to its own minimal toast implementation so
   portals that haven't migrated yet still work.
   ============================================================ */
(function (global) {
  'use strict';

  if (global.AppShell) return; // idempotent

  /* ----------------------------------------------------------
     INTERNAL HELPERS
  ---------------------------------------------------------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function ce(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'style') el.setAttribute('style', attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    if (html !== undefined) el.innerHTML = html;
    return el;
  }
  function on(el, ev, fn) { el && el.addEventListener(ev, fn); }

  var _user = null;           // cached from /api/auth/me
  var _topbarEl = null;
  var _sidebarEl = null;
  var _modalStack = [];

  /* ----------------------------------------------------------
     THEME
  ---------------------------------------------------------- */
  // Theme catalog. data-theme = light|dark base; data-skin = the chosen theme id.
  // Each skin's palette + pattern live in app-shell.css. Default = graphite (dark).
  var THEMES = {
    graphite:  { base: 'dark', label: 'Graphite steel', dot: '#3B82C4', pattern: null    },
    obsidian:  { base: 'dark', label: 'Obsidian',       dot: '#4FD1E0', pattern: null    },
    nightsky:  { base: 'dark', label: 'Night sky',      dot: '#FDE9A8', pattern: 'stars' },
    blueprint: { base: 'dark', label: 'Blueprint',      dot: '#4FD1E0', pattern: 'grid'  }
  };
  var THEME_ORDER = ['graphite', 'obsidian', 'nightsky', 'blueprint'];
  var DEFAULT_THEME = 'graphite';
  var _theme = DEFAULT_THEME;

  // Map any stored value (null / legacy 'dark'|'light' / id) to a usable theme id.
  function _normalizeTheme(v) {
    if (v && THEMES[v]) return v;
    if (v === 'light') return 'light';     // legacy light stays light (base palette)
    if (v === 'dark')  return 'graphite';  // legacy dark → new default dark skin
    return DEFAULT_THEME;
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('lfs-theme'); } catch (e) {}
    _applyTheme(_normalizeTheme(saved));
  }

  function _applyTheme(id) {
    var root = document.documentElement;
    var t = THEMES[id];
    if (t) {
      root.setAttribute('data-theme', t.base);
      root.setAttribute('data-skin', id);
      _renderPattern(t.pattern);
    } else {
      // 'light' or any base value — no skin, no pattern.
      root.setAttribute('data-theme', id === 'light' ? 'light' : 'dark');
      root.removeAttribute('data-skin');
      _renderPattern(null);
    }
    _theme = id;
    _markPickerActive(id);
  }

  function setTheme(id) {
    id = _normalizeTheme(id);
    try { localStorage.setItem('lfs-theme', id); } catch (e) {}
    _applyTheme(id);
    // Persist to server (best-effort).
    try {
      fetch('/api/auth/me/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ theme: id })
      }).catch(function () {});
    } catch (e) {}
  }

  // Back-compat: any old toggleTheme() caller flips default-dark ↔ light.
  function toggleTheme() {
    setTheme(_theme === 'light' ? DEFAULT_THEME : 'light');
  }

  function _renderPattern(kind) {
    var el = document.getElementById('app-pattern');
    if (!kind) { if (el && el.parentNode) el.parentNode.removeChild(el); return; }
    if (!el) {
      if (!document.body) return;
      el = document.createElement('div');
      el.id = 'app-pattern';
      el.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(el, document.body.firstChild);
    }
    el.className = 'app-pattern app-pattern-' + kind;
    el.innerHTML = '';
    if (kind === 'stars') _genStars(el);
  }

  function _genStars(el) {
    var cols = ['#ffffff', '#ffffff', '#FDEFB0', '#7FB2FF'];
    var html = '';
    for (var i = 0; i < 90; i++) {
      var sz = (Math.random() * 1.3 + 0.7).toFixed(1);
      var c = cols[Math.floor(Math.random() * cols.length)];
      var op = (Math.random() * 0.55 + 0.35).toFixed(2);
      html += '<span class="app-pattern-star" style="width:' + sz + 'px;height:' + sz +
              'px;background:' + c + ';opacity:' + op + ';top:' + (Math.random() * 100).toFixed(2) +
              '%;left:' + (Math.random() * 100).toFixed(2) + '%"></span>';
    }
    el.innerHTML = html;
  }

  function _markPickerActive(id) {
    var items = document.querySelectorAll('.app-theme-menu-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-theme-id') === id) items[i].classList.add('active');
      else items[i].classList.remove('active');
    }
  }

  /* ----------------------------------------------------------
     USER INFO
  ---------------------------------------------------------- */
  function getUser() {
    if (_user) return Promise.resolve(_user);
    return fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (data) {
        _user = data;
        return data;
      })
      .catch(function () { return null; });
  }

  function signOut() {
    return fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin'
    }).then(function () {
      _user = null;
      window.location.href = '/login.html';
    }).catch(function () {
      window.location.href = '/login.html';
    });
  }

  function _initials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function _roleLabel(role) {
    var map = { admin: 'Admin', manager: 'Manager', employee: 'Employee',
                designer: 'Designer', permitter: 'Permitter' };
    return map[role] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User');
  }

  /* ----------------------------------------------------------
     TOPBAR
  ---------------------------------------------------------- */
  /**
   * Mount the app topbar at the top of <body>.
   * @param {Object} opts
   *   opts.title      {string}  Portal display name (e.g. "Admin")
   *   opts.portalId   {string}  Used for analytics / active state
   *   opts.showBack   {boolean} Show ← Launcher link (default: auto-detect)
   *   opts.userMenu   {boolean} Show user menu chip (default: true)
   *   opts.logoSrc    {string}  Override logo src
   */
  function mountTopbar(opts) {
    opts = opts || {};
    if (_topbarEl) return _topbarEl; // already mounted

    var showBack  = opts.showBack !== undefined ? opts.showBack : (window.location.pathname !== '/launcher.html' && window.location.pathname !== '/');
    var userMenu  = opts.userMenu !== false;
    var title     = opts.title || '';
    var logoSrc   = opts.logoSrc || '/img/launch-fiber-logo-transparent.png';
    var logoAlt   = 'Launch Fiber Services';

    var bar = ce('header', { 'class': 'app-topbar', role: 'banner' });

    // ← Launcher back
    if (showBack) {
      var back = ce('a', {
        href: '/',
        'class': 'app-topbar-back',
        'aria-label': 'Back to Launcher'
      }, '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Launcher');
      bar.appendChild(back);
    }

    // Logo
    var logo = ce('img', {
      src: logoSrc,
      alt: logoAlt,
      'class': 'app-topbar-logo'
    });
    // If logo fails to load, fall back to text
    logo.onerror = function () {
      var brand = ce('span', { 'class': 'app-topbar-brand' }, 'Launch Fiber');
      bar.replaceChild(brand, logo);
    };
    bar.appendChild(logo);

    // Divider + portal title
    if (title) {
      var div = ce('div', { 'class': 'app-topbar-divider', 'aria-hidden': 'true' });
      var t   = ce('span', { 'class': 'app-topbar-title' }, _esc(title));
      bar.appendChild(div);
      bar.appendChild(t);
    }

    // Spacer
    bar.appendChild(ce('div', { 'class': 'app-topbar-spacer', 'aria-hidden': 'true' }));

    // Actions container
    var actions = ce('div', { 'class': 'app-topbar-actions' });

    // Theme picker (replaces the light/dark toggle)
    var themeWrap = ce('div', { 'class': 'app-theme-picker' });
    var themeBtn = ce('button', {
      'class':         'app-topbar-icon-btn',
      type:            'button',
      title:           'Theme',
      'aria-label':    'Theme',
      'aria-haspopup': 'true',
      'aria-expanded': 'false'
    }, '<i class="fa-solid fa-palette" aria-hidden="true"></i>');
    var themeMenu = ce('div', { 'class': 'app-theme-menu', role: 'menu' });
    THEME_ORDER.forEach(function (id) {
      var t = THEMES[id];
      var item = ce('button', {
        'class':         'app-theme-menu-item',
        type:            'button',
        role:            'menuitemradio',
        'data-theme-id': id
      }, '<span class="app-theme-dot" style="background:' + t.dot + '"></span>' +
         '<span class="app-theme-name">' + t.label + '</span>' +
         '<i class="fa-solid fa-check app-theme-check" aria-hidden="true"></i>');
      on(item, 'click', function (e) {
        e.stopPropagation();
        setTheme(id);
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      });
      themeMenu.appendChild(item);
    });
    on(themeBtn, 'click', function (e) {
      e.stopPropagation();
      var open = themeMenu.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    on(document, 'click', function () {
      themeMenu.classList.remove('open');
      themeBtn.setAttribute('aria-expanded', 'false');
    });
    themeWrap.appendChild(themeBtn);
    themeWrap.appendChild(themeMenu);
    actions.appendChild(themeWrap);
    _markPickerActive(_theme);

    // User menu (populated after getUser() resolves)
    if (userMenu) {
      var userChip = ce('div', {
        'class':       'app-topbar-user',
        role:          'button',
        tabindex:      '0',
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
        'aria-label':  'User menu'
      });

      var avatarEl = ce('div', { 'class': 'app-topbar-user-avatar' }, '?');
      var nameEl   = ce('span', { 'class': 'app-topbar-user-name' }, '...');
      var chevron  = ce('i', { 'class': 'fa-solid fa-chevron-down', style: 'font-size:10px;opacity:.7', 'aria-hidden': 'true' });

      userChip.appendChild(avatarEl);
      userChip.appendChild(nameEl);
      userChip.appendChild(chevron);

      // Dropdown
      var dropdown = ce('div', { 'class': 'app-topbar-user-dropdown', role: 'menu' });
      var roleLabel = ce('div', { 'class': 'app-topbar-user-role' }, '&nbsp;');
      var signOutBtn = ce('button', {
        'class': 'app-topbar-user-dropdown-item',
        type:    'button',
        role:    'menuitem'
      }, '<i class="fa-solid fa-right-from-bracket" aria-hidden="true" style="width:16px;text-align:center"></i>&nbsp; Sign out');
      on(signOutBtn, 'click', function () { signOut(); });

      dropdown.appendChild(roleLabel);
      dropdown.appendChild(ce('div', { 'class': 'app-topbar-user-dropdown-divider', 'aria-hidden': 'true' }));
      dropdown.appendChild(signOutBtn);
      userChip.appendChild(dropdown);

      // Toggle on click / keyboard
      function toggleUserMenu(e) {
        var open = userChip.getAttribute('aria-expanded') === 'true';
        userChip.setAttribute('aria-expanded', open ? 'false' : 'true');
      }
      on(userChip, 'click', function (e) {
        e.stopPropagation();
        toggleUserMenu();
      });
      on(userChip, 'keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleUserMenu(); }
        if (e.key === 'Escape') userChip.setAttribute('aria-expanded', 'false');
      });
      on(document, 'click', function () {
        userChip.setAttribute('aria-expanded', 'false');
      });

      actions.appendChild(userChip);

      // Populate after auth
      getUser().then(function (u) {
        if (!u) {
          nameEl.textContent = 'Sign in';
          avatarEl.textContent = '?';
          return;
        }
        var name = u.full_name || u.name || u.email || 'User';
        avatarEl.textContent = _initials(name);
        nameEl.textContent = name;
        roleLabel.textContent = _roleLabel(u.role);
        // Sync theme from server preference
        if (u.theme) {
          var sid = _normalizeTheme(u.theme);
          try { localStorage.setItem('lfs-theme', sid); } catch (e) {}
          _applyTheme(sid);
        }
      });
    }

    bar.appendChild(actions);

    // Insert as first child of body
    document.body.insertBefore(bar, document.body.firstChild);
    _topbarEl = bar;

    // Reflect the active theme in the picker
    _markPickerActive(_theme);

    return bar;
  }

  /* ----------------------------------------------------------
     SIDEBAR
  ---------------------------------------------------------- */
  /**
   * Mount a collapsible sidebar navigation.
   * @param {Object} opts
   *   opts.items       {Array}   Nav items — each: { label, href, icon, badge, section, active }
   *                              section: string — renders a section header before this item
   *   opts.collapsible {boolean} Show collapse toggle (default: true)
   *   opts.collapsed   {boolean} Start collapsed (default: false)
   *   opts.containerId {string}  ID of element to receive .app-with-sidebar class (default: 'main' or body)
   */
  function mountSidebar(opts) {
    opts = opts || {};
    if (_sidebarEl) return _sidebarEl;

    var items      = opts.items || [];
    var collapsible = opts.collapsible !== false;
    var collapsed  = opts.collapsed || false;

    var sidebar = ce('aside', {
      'class': 'app-sidebar' + (collapsed ? ' collapsed' : ''),
      'aria-label': 'Main navigation'
    });

    var nav = ce('ul', { 'class': 'app-sidebar-nav', role: 'list' });

    items.forEach(function (item) {
      if (item.section) {
        var sec = ce('li');
        var secLabel = ce('div', { 'class': 'app-sidebar-section', 'aria-hidden': 'true' }, _esc(item.section));
        sec.appendChild(secLabel);
        nav.appendChild(sec);
      }

      var li    = ce('li', { role: 'none' });
      var tag   = item.href ? 'a' : 'button';
      var attrs = {
        'class':       'app-sidebar-item' + (item.active ? ' active' : ''),
        type:          tag === 'button' ? 'button' : undefined,
        role:          'menuitem',
        'aria-current': item.active ? 'page' : undefined
      };
      if (item.href) attrs.href = item.href;
      var inner = '';
      if (item.icon) {
        inner += '<i class="' + _esc(item.icon) + '" aria-hidden="true"></i>';
      }
      inner += '<span class="app-sidebar-item-label">' + _esc(item.label) + '</span>';
      if (item.badge != null) {
        inner += '<span class="app-sidebar-badge" aria-label="' + _esc(String(item.badge)) + ' items">' + _esc(String(item.badge)) + '</span>';
      }
      var link = ce(tag, attrs, inner);
      if (item.onClick) on(link, 'click', item.onClick);
      li.appendChild(link);
      nav.appendChild(li);
    });

    sidebar.appendChild(nav);

    // Collapse toggle
    if (collapsible) {
      var footer = ce('div', { 'class': 'app-sidebar-footer' });
      var collapseBtn = ce('button', {
        'class':      'app-sidebar-item',
        type:         'button',
        'aria-label': collapsed ? 'Expand sidebar' : 'Collapse sidebar',
        title:        collapsed ? 'Expand sidebar' : 'Collapse sidebar'
      }, '<i class="fa-solid fa-chevrons-left" aria-hidden="true"></i>' +
         '<span class="app-sidebar-item-label">Collapse</span>');
      on(collapseBtn, 'click', function () {
        var isCollapsed = sidebar.classList.toggle('collapsed');
        collapseBtn.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
        collapseBtn.title = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
        var icon = qs('i', collapseBtn);
        if (icon) icon.className = isCollapsed
          ? 'fa-solid fa-chevrons-right'
          : 'fa-solid fa-chevrons-left';
        // Update page wrapper
        var wrap = _getContentWrap(opts.containerId);
        if (wrap) wrap.classList.toggle('sidebar-collapsed', isCollapsed);
        try { localStorage.setItem('lfs-sidebar-collapsed', isCollapsed ? '1' : '0'); } catch (e) {}
      });
      footer.appendChild(collapseBtn);
      sidebar.appendChild(footer);
    }

    // Insert after topbar (or first in body if no topbar)
    if (_topbarEl && _topbarEl.nextSibling) {
      document.body.insertBefore(sidebar, _topbarEl.nextSibling);
    } else {
      document.body.insertBefore(sidebar, document.body.firstChild);
    }

    // Apply .app-with-sidebar to content wrapper
    var wrap = _getContentWrap(opts.containerId);
    if (wrap) {
      wrap.classList.add('app-with-sidebar');
      if (collapsed) wrap.classList.add('sidebar-collapsed');
    }

    // Restore collapse state
    try {
      var saved = localStorage.getItem('lfs-sidebar-collapsed');
      if (saved === '1' && !collapsed) {
        sidebar.classList.add('collapsed');
        if (wrap) wrap.classList.add('sidebar-collapsed');
      }
    } catch (e) {}

    _sidebarEl = sidebar;
    return sidebar;
  }

  function _getContentWrap(id) {
    if (id) return qs('#' + id) || qs('.' + id);
    return qs('main') || qs('.app-content') || qs('#main-content');
  }

  /* ----------------------------------------------------------
     TOAST
  ---------------------------------------------------------- */
  /**
   * Show a toast notification.
   * Delegates to LFS.toast if available (toast.js); otherwise
   * uses built-in minimal implementation.
   * @param {string}  message
   * @param {string}  kind     'success' | 'error' | 'warning' | 'info'
   * @param {Object}  opts     { durationMs, actionLabel, onAction }
   */
  function toast(message, kind, opts) {
    kind = kind || 'info';
    opts = opts || {};

    // Delegate to existing LFS.toast if available
    if (global.LFS && global.LFS.toast) {
      var fn = global.LFS.toast[kind] || global.LFS.toast.show;
      if (fn) {
        fn.call(global.LFS.toast, typeof message === 'string'
          ? { message: message, type: kind === 'warning' ? 'warn' : kind,
              durationMs: opts.durationMs, actionLabel: opts.actionLabel,
              onAction: opts.onAction }
          : message);
        return;
      }
    }

    // Built-in fallback
    var container = _ensureToastContainer();
    var el = ce('div', {
      'class': 'toast toast-' + kind,
      role: kind === 'error' ? 'alert' : 'status',
      'aria-live': kind === 'error' ? 'assertive' : 'polite',
      'aria-atomic': 'true'
    });
    var msg = ce('span', { 'class': 'toast-message' }, _esc(String(message)));
    el.appendChild(msg);

    if (opts.actionLabel && opts.onAction) {
      var actBtn = ce('button', { 'class': 'toast-action-btn', type: 'button' }, _esc(opts.actionLabel));
      on(actBtn, 'click', function () { opts.onAction(); _dismissToast(el); });
      el.appendChild(actBtn);
    }

    var closeBtn = ce('button', {
      'class': 'toast-close-btn',
      type: 'button',
      'aria-label': 'Dismiss notification'
    }, '×');
    on(closeBtn, 'click', function () { _dismissToast(el); });
    el.appendChild(closeBtn);

    container.appendChild(el);

    var ms = opts.durationMs != null ? opts.durationMs : (kind === 'error' ? 7000 : 4000);
    if (ms > 0) setTimeout(function () { _dismissToast(el); }, ms);
  }

  function _ensureToastContainer() {
    var c = qs('.toast-container');
    if (!c) {
      c = ce('div', {
        'class': 'toast-container',
        role: 'region',
        'aria-label': 'Notifications',
        'aria-live': 'polite'
      });
      document.body.appendChild(c);
    }
    return c;
  }

  function _dismissToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('toast-leaving');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 160);
  }

  /* ----------------------------------------------------------
     MODAL
  ---------------------------------------------------------- */
  /**
   * Open a modal dialog.
   * @param {string|HTMLElement} content  HTML string or element for modal body
   * @param {Object} opts
   *   opts.title      {string}   Modal title
   *   opts.size       {string}   'sm' | '' | 'lg' | 'xl' | 'full'
   *   opts.footer     {string|HTMLElement}  Optional footer HTML or element
   *   opts.onClose    {Function} Called when modal closes
   *   opts.closeOnBackdrop {boolean} default true
   */
  function openModal(content, opts) {
    opts = opts || {};

    var backdrop = ce('div', { 'class': 'modal-backdrop open', role: 'dialog', 'aria-modal': 'true' });
    if (opts.title) backdrop.setAttribute('aria-labelledby', 'app-modal-title');
    backdrop.setAttribute('aria-label', opts.title || 'Dialog');

    var sizeClass = opts.size ? 'modal-' + opts.size : '';
    var dialog = ce('div', { 'class': 'modal-dialog ' + sizeClass });

    // Header
    var header = ce('div', { 'class': 'modal-header' });
    if (opts.title) {
      var titleEl = ce('h2', { 'class': 'modal-title', id: 'app-modal-title' }, _esc(opts.title));
      header.appendChild(titleEl);
    }
    var closeBtn = ce('button', {
      'class':      'modal-close',
      type:         'button',
      'aria-label': 'Close dialog'
    }, '&times;');
    on(closeBtn, 'click', function () { closeModal(backdrop, opts.onClose); });
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // Body
    var body = ce('div', { 'class': 'modal-body' });
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
    dialog.appendChild(body);

    // Footer
    if (opts.footer) {
      var footer = ce('div', { 'class': 'modal-footer' });
      if (typeof opts.footer === 'string') footer.innerHTML = opts.footer;
      else if (opts.footer instanceof HTMLElement) footer.appendChild(opts.footer);
      dialog.appendChild(footer);
    }

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    _modalStack.push({ backdrop: backdrop, onClose: opts.onClose });

    // Backdrop click to close
    if (opts.closeOnBackdrop !== false) {
      on(backdrop, 'click', function (e) {
        if (e.target === backdrop) closeModal(backdrop, opts.onClose);
      });
    }

    // Escape key
    var escHandler = function (e) {
      if (e.key === 'Escape') { closeModal(backdrop, opts.onClose); }
    };
    on(document, 'keydown', escHandler);
    backdrop._escHandler = escHandler;

    // Focus trap — focus first focusable inside dialog
    setTimeout(function () {
      var focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    }, 50);

    return { backdrop: backdrop, body: body, dialog: dialog };
  }

  function closeModal(backdropOrLast, onClose) {
    var entry;
    if (backdropOrLast && backdropOrLast.classList) {
      // specific backdrop passed
      var idx = _modalStack.findIndex(function (m) { return m.backdrop === backdropOrLast; });
      if (idx !== -1) entry = _modalStack.splice(idx, 1)[0];
      else entry = { backdrop: backdropOrLast, onClose: onClose };
    } else {
      entry = _modalStack.pop();
    }
    if (!entry) return;
    var el = entry.backdrop;
    if (!el) return;
    if (el._escHandler) document.removeEventListener('keydown', el._escHandler);
    el.classList.remove('open');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
    var cb = onClose || entry.onClose;
    if (cb) cb();
  }

  /* ----------------------------------------------------------
     SKELETON
  ---------------------------------------------------------- */
  /**
   * Replace element's content with animated skeleton lines.
   * @param {HTMLElement} el     Target element
   * @param {number}      lines  Number of skeleton text lines (default 3)
   */
  function showSkeleton(el, lines) {
    if (!el) return;
    el._originalHTML = el.innerHTML;
    var n = lines || 3;
    var html = '<div style="display:flex;flex-direction:column;gap:8px;padding:8px 0">';
    for (var i = 0; i < n; i++) {
      var w = i === n - 1 ? '55%' : (i % 2 === 0 ? '90%' : '75%');
      html += '<div class="skeleton skeleton-text" style="width:' + w + '"></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function hideSkeleton(el) {
    if (!el) return;
    if (el._originalHTML !== undefined) {
      el.innerHTML = el._originalHTML;
      delete el._originalHTML;
    }
  }

  /* ----------------------------------------------------------
     STRING ESCAPE (XSS prevention)
  ---------------------------------------------------------- */
  function _esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ----------------------------------------------------------
     INIT SHORTHAND
  ---------------------------------------------------------- */
  /**
   * One-call init: theme + topbar + optional sidebar.
   * @param {Object} opts  Passed to mountTopbar; sidebar key: opts.sidebar (array or false)
   */
  function init(opts) {
    opts = opts || {};
    initTheme();
    mountTopbar(opts);
    if (opts.sidebar && Array.isArray(opts.sidebar)) {
      mountSidebar({ items: opts.sidebar });
    }
  }

  /* ----------------------------------------------------------
     PUBLIC API
  ---------------------------------------------------------- */
  global.AppShell = {
    init:         init,
    initTheme:    initTheme,
    toggleTheme:  toggleTheme,
    setTheme:     setTheme,
    themes:       THEMES,
    mountTopbar:  mountTopbar,
    mountSidebar: mountSidebar,
    toast:        toast,
    openModal:    openModal,
    closeModal:   closeModal,
    showSkeleton: showSkeleton,
    hideSkeleton: hideSkeleton,
    getUser:      getUser,
    signOut:      signOut,
    // Expose version for debugging
    version:      '1.0.0'
  };

}(window));
