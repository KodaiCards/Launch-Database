// app_nav.js — shared left-nav rail injected into the operations cluster so the
// portal reads as one app. Include with:
//   <script src="/js/app_nav.js" data-active="KEY"></script>
// where KEY is one of: dashboard | service-areas | pipelines | hours | hours-import
//   | money | job-board | clients | invoices | billing | billing-ks | people
//   | audit | settings.
//
// Chrome model (WP-C / redesign_ui.md — the LOCKED spec):
//   • The prod-proven centered-logo TOPBAR (AppShell.mountTopbar) sits fixed at the
//     top: centered logo + theme PICKER top-right + user menu. ONE theme engine
//     (app-shell.js / 'lfs-theme'), ONE control (the picker). No sun/moon anywhere.
//   • A LEFT HAMBURGER in the topbar toggles the rail collapsed/expanded; content
//     scoots IN-FLOW (the rail is a flex column whose width animates to 0 — not an
//     overlay). State persists in localStorage ('lfs-rail-collapsed').
//   • Rail icons "bubble" on hover (scale ~1.2×) and pop a tooltip with the item name.
// Wraps the page's existing content (minus <script>s) into a flex shell beside the
// rail; element ids are preserved so page scripts keep working.

(function () {
  'use strict';
  var active = (document.currentScript && document.currentScript.getAttribute('data-active')) || '';

  // Apply the saved theme synchronously so operations pages honor the user's pick
  // immediately with no flash (the full engine + picker = app-shell.js, loaded below).
  // Key matches app-shell.js: 'lfs-theme' holds a skin id (or 'light'); default = dark/graphite.
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

  var RAIL_KEY = 'lfs-rail-collapsed';
  var startCollapsed = false;
  try { startCollapsed = localStorage.getItem(RAIL_KEY) === '1'; } catch (e) {}

  var css = ''
    // Shell sits BELOW the fixed 56px topbar (AppShell.mountTopbar).
    + '.app-shell{display:flex;height:calc(100vh - var(--topbar-h,56px));margin-top:var(--topbar-h,56px)}'
    + '.app-rail{width:176px;background:var(--surface-2);border-right:1px solid var(--border-strong);padding:12px 9px;display:flex;flex-direction:column;gap:2px;flex-shrink:0;overflow-x:hidden;overflow-y:auto;transition:width .18s ease,padding .18s ease}'
    + '.app-mainwrap{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;overflow:auto}'
    // Collapsed (push-reflow): the rail shrinks to an icon strip; content scoots in-flow.
    + '.app-shell.rail-collapsed .app-rail{width:52px;padding-left:6px;padding-right:6px}'
    + '.app-shell.rail-collapsed .app-nav span,'
    + '.app-shell.rail-collapsed .app-nav .soon,'
    + '.app-shell.rail-collapsed .rail-search-wrap{opacity:0;width:0;overflow:hidden;pointer-events:none}'
    + '.app-shell.rail-collapsed .app-nav{justify-content:center;padding-left:0;padding-right:0}'
    // Nav items.
    + '.app-nav{position:relative;display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:8px;font-size:13px;color:var(--text-secondary);text-decoration:none;white-space:nowrap}'
    + '.app-nav:hover{background:var(--surface-1)}'
    + '.app-nav.active{background:var(--primary-light);color:var(--primary-dark);font-weight:600}'
    + '.app-nav.dis{color:var(--text-muted)}'
    + '.app-nav .soon{margin-left:auto;font-size:9px;color:var(--text-muted);background:var(--surface-3);border-radius:5px;padding:1px 5px}'
    // Bubble micro-interaction: icon scales ~1.2× on hover.
    + '.app-nav i{transition:transform .12s ease;flex-shrink:0;width:18px;text-align:center}'
    + '.app-nav:hover i{transform:scale(1.2)}'
    // Name tooltip (pops on hover — the item name to the right of the icon).
    + '.app-nav[data-tip]::after{content:attr(data-tip);position:absolute;left:calc(100% + 8px);top:50%;transform:translateY(-50%) scale(.96);white-space:nowrap;background:var(--surface-3,#222);color:var(--text,#fff);font-size:11px;font-weight:600;padding:4px 8px;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .12s ease,transform .12s ease;z-index:1200}'
    + '.app-nav:hover[data-tip]::after{opacity:1;transform:translateY(-50%) scale(1)}'
    // global search
    + '.rail-search-wrap{position:relative;padding:0 2px 10px;transition:opacity .12s ease}'
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
    + '.rr-empty{padding:10px;font-size:12px;color:var(--text-muted,#5A6470);text-align:center}'
    // PURGE the legacy per-page sun/moon controls everywhere (belt-and-suspenders —
    // the buttons + their JS are also being removed from the pages themselves).
    + '#themeToggle,#dm-toggle,.theme-toggle{display:none!important}'
    // Hamburger (mounted into the topbar-left by _mountTopbarChrome).
    + '.app-rail-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:none;background:rgba(255,255,255,.10);color:#fff;border-radius:8px;cursor:pointer;font-size:15px}'
    + '.app-rail-toggle:hover{background:rgba(255,255,255,.20)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // adminOnly links start hidden and are revealed only after we confirm the
  // signed-in user is an admin (see the /api/auth/me fetch below). Secure-by-default.
  // data-tip carries the item name for the hover tooltip (works collapsed OR expanded).
  function link(key, href, icon, label, adminOnly) {
    return '<a class="app-nav' + (key === active ? ' active' : '') + '" href="' + href + '" data-tip="' + label + '"'
      + (adminOnly ? ' data-admin-only="1" style="display:none"' : '')
      + '><i class="fa-solid ' + icon + '"></i> <span>' + label + '</span></a>';
  }
  function soon(icon, label) {
    return '<span class="app-nav dis" data-tip="' + label + '"><i class="fa-solid ' + icon + '"></i> <span>' + label + ' <span class="soon">soon</span></span></span>';
  }

  var rail = document.createElement('nav');
  rail.className = 'app-rail';
  // NOTE: no "Launch" wordmark here — the logo now lives centered in the topbar.
  rail.innerHTML =
    '<div class="rail-search-wrap" id="rail-search-wrap">'
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
    + link('settings', '/settings.html', 'fa-sliders', 'Settings')
    + '<a class="app-nav" data-admin-only="1" data-tip="Admin" style="margin-top:auto;display:none" href="/admin.html"><i class="fa-solid fa-gear"></i> <span>Admin</span></a>';

  var wrap = document.createElement('div');
  wrap.className = 'app-mainwrap';
  // Move existing content (keep <script>s in place so they still execute).
  Array.prototype.slice.call(document.body.childNodes).forEach(function (n) {
    if (n.nodeName !== 'SCRIPT') wrap.appendChild(n);
  });
  var shell = document.createElement('div');
  shell.className = 'app-shell' + (startCollapsed ? ' rail-collapsed' : '');
  shell.appendChild(rail);
  shell.appendChild(wrap);
  document.body.appendChild(shell);

  // ── Topbar + hamburger ─────────────────────────────────────────────────────
  // Mount the prod-proven centered-logo topbar (logo center / picker top-right /
  // user menu) and inject a left hamburger that toggles the rail (push-reflow).
  function _mountTopbarChrome() {
    if (!window.AppShell) return;
    try { AppShell.initTheme(); } catch (e) {}
    try { AppShell.mountTopbar({ showBack: true, userMenu: true }); } catch (e) {}

    var bar = document.querySelector('.app-topbar');
    if (bar && !document.getElementById('app-rail-toggle')) {
      var ham = document.createElement('button');
      ham.id = 'app-rail-toggle';
      ham.className = 'app-rail-toggle';
      ham.type = 'button';
      ham.setAttribute('aria-label', 'Toggle navigation');
      ham.setAttribute('title', 'Toggle navigation');
      ham.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      ham.addEventListener('click', function () {
        var collapsed = shell.classList.toggle('rail-collapsed');
        try { localStorage.setItem(RAIL_KEY, collapsed ? '1' : '0'); } catch (e) {}
      });
      // Place the hamburger first (topbar-left, before the ← Launcher back link).
      bar.insertBefore(ham, bar.firstChild);
    }
  }
  if (window.AppShell) { _mountTopbarChrome(); }
  else {
    var _shellScript = document.createElement('script');
    _shellScript.src = '/js/app-shell.js';
    _shellScript.onload = _mountTopbarChrome;
    document.head.appendChild(_shellScript);
  }

  // ── Role-gated rail items ──────────────────────────────────────────────────
  // Admin-only links (data-admin-only) render hidden and are revealed only once
  // we confirm the signed-in user is an admin. Non-admins never see them.
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
