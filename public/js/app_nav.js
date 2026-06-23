// app_nav.js — shared left-nav rail injected into keystone screens so the
// portal reads as one app. Include with: <script src="/js/app_nav.js" data-active="KEY"></script>
// where KEY is one of: dashboard | service-areas | pipelines.
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
    + '.app-nav .soon{margin-left:auto;font-size:9px;color:var(--text-muted);background:var(--surface-3);border-radius:5px;padding:1px 5px}';
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
    + link('dashboard', '/dashboard.html', 'fa-gauge-high', 'Dashboard')
    + link('service-areas', '/service-areas.html', 'fa-diagram-project', 'Service areas')
    + link('pipelines', '/pipeline.html?team=permitting', 'fa-table-columns', 'Pipelines')
    + soon('fa-file-invoice-dollar', 'Billing')
    + soon('fa-clock', 'Hours')
    + soon('fa-users', 'Clients')
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
})();
