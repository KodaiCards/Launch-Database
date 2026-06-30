// app_nav.js — shared left-nav rail injected into keystone screens so the
// portal reads as one app. Include with: <script src="/js/app_nav.js" data-active="KEY"></script>
// where KEY is one of: dashboard | service-areas | pipelines | hours | hours-import | money | job-board | clients | invoices | billing | billing-ks | people | audit | settings.
// Wraps the page's existing content (minus <script>s) into a flex shell beside
// the rail; element ids are preserved so page scripts keep working.

(function () {
  'use strict';
  var active = (document.currentScript && document.currentScript.getAttribute('data-active')) || '';

  // Apply the saved theme synchronously so operations pages honor the user's
  // pick immediately (the full engine + picker = app-shell.js, loaded below).
  // Keys match app-shell.js: 'lfs-theme' holds a skin id (or 'light'); default = dark/graphite.
  (function preApplyTheme() {
    try {
      var saved = localStorage.getItem('lfs-theme');
      var SKINS = { graphite: 1, obsidian: 1, nightsky: 1, blueprint: 1 };
      var root = document.documentElement;
      if (saved && SKINS[saved]) { root.setAttribute('data-theme', 'dark'); root.setAttribute('data-skin', saved); }
      else if (saved === 'light') { root.setAttribute('data-theme', 'light'); root.removeAttribute('data-skin'); }
      else { root.setAttribute('data-theme', 'dark'); root.setAttribute('data-skin', 'graphite'); }
    } catch (e) {}
  })();

  var css = ''
    + '.app-shell{display:flex;height:100vh}'
    + '.app-rail{width:176px;background:var(--surface-2);border-right:1px solid var(--border-strong);padding:12px 9px;display:flex;flex-direction:column;gap:2px;flex-shrink:0}'
    + '.app-mainwrap{flex:1;min-width:0;height:100vh;display:flex;flex-direction:column}'
    + '.app-brand{display:flex;align-items:center;gap:8px;padding:6px 10px 14px;font-size:15px;font-weight:700;color:var(--text)}'
    + '.app-brand i{color:var(--primary)}'
    + '.app-nav{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:8px;font-size:13px;color:var(--text-secondary);text-decoration:none}'
    + '.app-nav:hover{background:var(--surface-1)}'
    + '.app-nav.active{background:var(--primary-light);color:var(--primary-dark);font-weight:600}'
    + '.app-nav.dis{color:var(--text-muted)}'
    + '.app-nav .soon{margin-left:auto;font-size:9px;color:var(--text-muted);background:var(--surface-3);border-radius:5px;padding:1px 5px}'
    /* global search */
    + '.rail-search-wrap{position:relative;padding:0 2px 10px}'
    + '.rail-search{width:100%;padding:6px 28px 6px 8px;border:1px solid var(--border-strong,#ddd);border-radius:6px;font-size:12px;background:var(--surface-1);color:var(--text,#212529);outline:none}'
    + '.rail-search:focus{border-color:var(--primary,#1B5FA0)}'
    + '.rail-search-ico{position:absolute;right:10px;top:50%;transform:translateY(-60%);color:var(--text-muted,#5A6470);font-size:11px;pointer-events:none}'
    + '.rail-results{position:absolute;top:100%;left:2px;right:2px;background:var(--surface-2,#fff);border:1px solid var(--border-strong,#ddd);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:999;max-height:320px;overflow-y:auto;display:none}'
    + '.rail-results.open{display:block}'
    + '.rail-result{display:flex;flex-direction:column;padding:8px 10px;cursor:pointer;border-bottom:1px solid var(--border-strong,#ddd);text-decoration:none;color:var(--text,#212529)}'
    + '.rail-result:last-child{border-bottom:none}'
    + '.rail-result:hover{background:var(--surface-1)}'
    + '.rr-label{font-size:12px;font-weight:500}'
    + '.rr-sub{font-size:11px;color:var(--text-muted,#5A6470)}'
    + '.rr-type{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--primary,#1B5FA0);font-weight:600}'
    + '.rr-empty{padding:10px;font-size:12px;color:var(--text-muted,#5A6470);text-align:center}';
  // Theme picker (rail) + hide the legacy per-page #themeToggle (superseded).
  css += '#themeToggle{display:none!important}'
    + '.rail-theme{position:relative;margin-top:auto;padding-top:8px}'
    + '.rail-theme-btn{display:flex;align-items:center;gap:9px;width:100%;padding:9px 11px;border:none;background:none;border-radius:8px;font-size:13px;color:var(--text-secondary);cursor:pointer;text-align:left;font-family:inherit}'
    + '.rail-theme-btn:hover{background:var(--surface-1)}'
    + '.rail-theme-menu{position:absolute;bottom:calc(100% + 4px);left:2px;right:2px;background:var(--surface-2);border:1px solid var(--border-strong);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);padding:6px;z-index:1000;display:none}'
    + '.rail-theme-menu.open{display:block}'
    + '.rail-theme-menu .app-theme-menu-item{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:7px;font-size:12px;color:var(--text-secondary);cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:inherit}'
    + '.rail-theme-menu .app-theme-menu-item:hover{background:var(--surface-1)}'
    + '.rail-theme-menu .app-theme-menu-item.active{background:var(--primary-light);color:var(--primary-dark);font-weight:600}'
    + '.rail-theme-swatch{width:14px;height:14px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.25)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // adminOnly links start hidden (display:none) and are revealed only after we
  // confirm the signed-in user is an admin (see the /api/auth/me fetch below).
  // Secure-by-default: a non-admin never sees them, even briefly. This is the
  // foundation for finer-grained per-permission rail gating later.
  function link(key, href, icon, label, adminOnly) {
    return '<a class="app-nav' + (key === active ? ' active' : '') + '" href="' + href + '"'
      + (adminOnly ? ' data-admin-only="1" style="display:none"' : '')
      + '><i class="fa-solid ' + icon + '"></i> ' + label + '</a>';
  }
  function soon(icon, label) {
    return '<span class="app-nav dis"><i class="fa-solid ' + icon + '"></i> ' + label + ' <span class="soon">soon</span></span>';
  }

  var rail = document.createElement('nav');
  rail.className = 'app-rail';
  rail.innerHTML =
    '<div class="app-brand"><i class="fa-solid fa-tower-broadcast"></i> Launch</div>'
    + '<div class="rail-search-wrap" id="rail-search-wrap">'
    + '<input class="rail-search" id="rail-search-input" type="search" placeholder="Search…" autocomplete="off" aria-label="Global search">'
    + '<i class="fa-solid fa-magnifying-glass rail-search-ico"></i>'
    + '<div class="rail-results" id="rail-results" role="listbox" aria-live="polite" aria-label="Search results"></div>'
    + '</div>'
    + link('dashboard', '/dashboard.html', 'fa-gauge-high', 'Dashboard')
    + link('service-areas', '/service-areas.html', 'fa-diagram-project', 'Projects')
    + link('pipelines', '/pipeline.html?team=permitting', 'fa-table-columns', 'Pipelines')
    + link('billing', '/billing.html', 'fa-file-invoice-dollar', 'Billing')
    + link('billing-ks', '/billing-keystone.html', 'fa-layer-group', 'Billing (KS)')
    + link('job-board', '/job-board.html', 'fa-briefcase', 'Job board')
    + link('hours', '/hours.html', 'fa-clock', 'Hours')
    + link('hours-import', '/hours-import.html', 'fa-file-import', 'Import hours')
    + link('money', '/money.html', 'fa-coins', 'Money')
    + link('clients', '/clients.html', 'fa-users', 'Clients')
    + link('invoices', '/invoices.html', 'fa-file-invoice', 'Invoices')
    + link('people', '/people.html', 'fa-id-badge', 'People', true)
    + link('training', '/training-admin.html', 'fa-graduation-cap', 'Training')
    + link('audit', '/audit.html', 'fa-clock-rotate-left', 'Audit log')
    + link('settings', '/settings.html', 'fa-sliders', 'Settings')
    + '<a class="app-nav" data-admin-only="1" style="margin-top:auto;display:none" href="/admin.html"><i class="fa-solid fa-gear"></i> Admin</a>'
    + '<div class="rail-theme" id="rail-theme">'
    +   '<button class="rail-theme-btn" id="rail-theme-btn" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-palette"></i> Theme</button>'
    +   '<div class="rail-theme-menu" id="rail-theme-menu" role="menu"></div>'
    + '</div>';

  var wrap = document.createElement('div');
  wrap.className = 'app-mainwrap';
  // Move existing content (keep <script>s in place so they still execute).
  Array.prototype.slice.call(document.body.childNodes).forEach(function (n) {
    if (n.nodeName !== 'SCRIPT') wrap.appendChild(n);
  });
  var shell = document.createElement('div');
  shell.className = 'app-shell';
  shell.appendChild(rail);
  shell.appendChild(wrap);
  document.body.appendChild(shell);

  // ── Theme picker ───────────────────────────────────────────────────────────
  // Reuse the single deployed theme engine (app-shell.js) so the operations
  // cluster gets the same picker + skins as the launcher/portals — no second
  // engine, no drift. app-shell.js has no auto-mount, so loading it is safe.
  function _initThemePicker() {
    if (!window.AppShell) return;
    try { AppShell.initTheme(); } catch (e) {}
    var menu = document.getElementById('rail-theme-menu');
    var btn  = document.getElementById('rail-theme-btn');
    var box  = document.getElementById('rail-theme');
    if (!menu || !btn || !box) return;
    var themes = AppShell.themes || {};
    var cur = document.documentElement.getAttribute('data-skin') || '';
    menu.innerHTML = Object.keys(themes).map(function (id) {
      var t = themes[id] || {};
      return '<button class="app-theme-menu-item' + (id === cur ? ' active' : '') + '" role="menuitem" data-theme-id="' + id + '">'
        + '<span class="rail-theme-swatch" style="background:' + (t.dot || '#888') + '"></span>'
        + (t.label || id) + '</button>';
    }).join('');
    Array.prototype.forEach.call(menu.querySelectorAll('.app-theme-menu-item'), function (it) {
      it.addEventListener('click', function () {
        try { AppShell.setTheme(it.getAttribute('data-theme-id')); } catch (e) {}
        menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      });
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  if (window.AppShell) { _initThemePicker(); }
  else {
    var _shellScript = document.createElement('script');
    _shellScript.src = '/js/app-shell.js';
    _shellScript.onload = _initThemePicker;
    document.head.appendChild(_shellScript);
  }

  // ── Role-gated rail items ──────────────────────────────────────────────────
  // Admin-only links (data-admin-only) render hidden and are revealed only once
  // we confirm the signed-in user is an admin. Non-admins never see them. This
  // is the seam for the broader permissions pass to come.
  fetch('/api/auth/me', { credentials: 'include' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (u) {
      if (u && u.role === 'admin') {
        Array.prototype.forEach.call(
          rail.querySelectorAll('[data-admin-only]'),
          function (el) { el.style.removeProperty('display'); }  // preserves other inline styles (e.g. margin-top:auto)
        );
      }
    })
    .catch(function () { /* leave hidden on error — fail closed */ });

  // ── Global search ────────────────────────────────────────────────────────────
  var _searchTimer = null;
  var searchInput  = document.getElementById('rail-search-input');
  var resultsEl    = document.getElementById('rail-results');

  function typeHref(type, id) {
    if (type === 'area')    return '/service-areas.html#' + id;
    if (type === 'client')  return '/clients.html';
    if (type === 'invoice') return '/money.html';
    return '#';
  }
  function typeIcon(type) {
    if (type === 'area')    return 'fa-diagram-project';
    if (type === 'client')  return 'fa-users';
    if (type === 'invoice') return 'fa-file-invoice-dollar';
    return 'fa-circle';
  }
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  searchInput.addEventListener('input', function () {
    clearTimeout(_searchTimer);
    var q = this.value.trim();
    if (!q || q.length < 2) { resultsEl.classList.remove('open'); return; }
    _searchTimer = setTimeout(function () { doSearch(q); }, 250);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { resultsEl.classList.remove('open'); searchInput.value = ''; }
  });

  document.addEventListener('click', function (e) {
    if (!document.getElementById('rail-search-wrap').contains(e.target)) {
      resultsEl.classList.remove('open');
    }
  });

  async function doSearch(q) {
    try {
      var res = await fetch('/api/search?q=' + encodeURIComponent(q), { credentials: 'include' });
      if (!res.ok) return;
      var data = await res.json();
      renderResults(data.results || []);
    } catch (e) { /* best-effort */ }
  }

  function renderResults(results) {
    if (!results.length) {
      resultsEl.innerHTML = '<div class="rr-empty">No results for that term.</div>';
    } else {
      resultsEl.innerHTML = results.map(function (r) {
        var href = typeHref(r.type, r.id);
        var sub  = [r.sub, r.meta].filter(Boolean).join(' · ');
        return '<a class="rail-result" href="' + esc(href) + '">'
          + '<span class="rr-type"><i class="fa-solid ' + typeIcon(r.type) + '"></i> ' + esc(r.type) + '</span>'
          + '<span class="rr-label">' + esc(r.label) + '</span>'
          + (sub ? '<span class="rr-sub">' + esc(sub) + '</span>' : '')
          + '</a>';
      }).join('');
    }
    resultsEl.classList.add('open');
  }
})();
