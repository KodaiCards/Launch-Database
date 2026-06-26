// app_nav.js — shared left-nav rail injected into keystone screens so the
// portal reads as one app. Include with: <script src="/js/app_nav.js" data-active="KEY"></script>
// where KEY is one of: dashboard | service-areas | pipelines | hours | hours-import | money | job-board | clients | invoices | billing | billing-ks | people | audit | settings.
// Wraps the page's existing content (minus <script>s) into a flex shell beside
// the rail; element ids are preserved so page scripts keep working.

(function () {
  'use strict';
  var active = (document.currentScript && document.currentScript.getAttribute('data-active')) || '';

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
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function link(key, href, icon, label) {
    return '<a class="app-nav' + (key === active ? ' active' : '') + '" href="' + href + '"><i class="fa-solid ' + icon + '"></i> ' + label + '</a>';
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
    + link('people', '/people.html', 'fa-id-badge', 'People')
    + link('training', '/training-admin.html', 'fa-graduation-cap', 'Training')
    + link('audit', '/audit.html', 'fa-clock-rotate-left', 'Audit log')
    + link('settings', '/settings.html', 'fa-sliders', 'Settings')
    + '<a class="app-nav" style="margin-top:auto" href="/admin.html"><i class="fa-solid fa-gear"></i> Admin</a>';

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
