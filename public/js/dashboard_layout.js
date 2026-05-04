// public/js/dashboard_layout.js — per-user dashboard layout + customize.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Each `.lfs-widget` element on the dashboard has a stable
// data-widget-id. Two pieces of layout state per widget:
//   { hidden: boolean, order: number }
// The whole map persists to /api/auth/me/dashboard-layout and re-applies
// on every page load.
//
// Customize mode (toggleDashboardCustomize):
//   - draws a dashed outline on every widget
//   - shows a per-widget toolbar with [eye] (toggle hidden) + a drag
//     hint
//   - HTML5 drag-and-drop lets the operator reorder widgets within
//     their parent container
// Exits with another click on the Customize button — saves layout +
// removes the chrome.
//
// Globals this module reads:
//   api()                — fetch wrapper from /js/api.js
//   window.LFS.toast.info — used to flash the customize-mode tip
//
// Functions exposed on window:
//   loadDashboardLayout, applyDashboardLayout, saveDashboardLayout,
//   toggleDashboardCustomize

(function () {
  let _dashLayout = {};
  let _dashCustomizeOn = false;
  let _dashDraggingId = null;

  async function loadDashboardLayout() {
    try {
      _dashLayout = await api('/api/auth/me/dashboard-layout') || {};
    } catch (e) { _dashLayout = {}; }
    applyDashboardLayout();
  }

  function applyDashboardLayout() {
    document.querySelectorAll('.lfs-widget').forEach(el => {
      const id = el.getAttribute('data-widget-id');
      const cfg = _dashLayout[id] || {};
      // Honor "hidden" but never override a card our load function
      // decided to hide (e.g. needs-attention shows only when there
      // ARE alerts) — the load function uses inline display:none which
      // we leave alone here.
      if (cfg.hidden) {
        el.dataset.layoutHidden = '1';
        el.style.display = 'none';
      } else if (el.dataset.layoutHidden === '1') {
        el.dataset.layoutHidden = '';
        el.style.display = '';
      }
    });
    // Reorder: walk widgets in their stored order and re-append to
    // their shared parent in that sequence. Widgets without a stored
    // order keep their original document order at the end (sort is
    // stable).
    const widgets = [...document.querySelectorAll('.lfs-widget')];
    if (!widgets.length) return;
    // Group widgets by parent node — different siblings may live in
    // different containers (e.g. inside .stats-grid vs .card siblings)
    // and we don't want to mix them across containers.
    const byParent = new Map();
    widgets.forEach(el => {
      const parent = el.parentElement;
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent).push(el);
    });
    for (const [parent, els] of byParent) {
      els.sort((a, b) => {
        const ao = (_dashLayout[a.getAttribute('data-widget-id')] || {}).order;
        const bo = (_dashLayout[b.getAttribute('data-widget-id')] || {}).order;
        const av = (ao == null) ? Number.POSITIVE_INFINITY : ao;
        const bv = (bo == null) ? Number.POSITIVE_INFINITY : bo;
        return av - bv;
      });
      for (const el of els) parent.appendChild(el);
    }
  }

  async function saveDashboardLayout() {
    try {
      await api('/api/auth/me/dashboard-layout', { method: 'PUT', body: JSON.stringify(_dashLayout) });
    } catch (e) {
      if (window.LFS && window.LFS.toast) window.LFS.toast.error('Failed to save layout');
    }
  }

  function toggleDashboardCustomize() {
    _dashCustomizeOn = !_dashCustomizeOn;
    if (_dashCustomizeOn) {
      if (window.LFS && window.LFS.toast) window.LFS.toast.info('Drag widgets to reorder. Click the eye icon to hide / show. Click Customize again when done.');
      document.querySelectorAll('.lfs-widget').forEach(el => {
        const id = el.getAttribute('data-widget-id');
        el.style.outline = '2px dashed var(--primary)';
        el.style.outlineOffset = '4px';
        el.style.cursor = 'grab';
        el.style.opacity = (_dashLayout[id] && _dashLayout[id].hidden) ? '0.4' : '1';
        el.style.display = '';  // show even hidden ones in customize mode
        el.draggable = true;
        // Inject a small toolbar at the top-right of the widget so the
        // hide/show toggle is unambiguous (clicking the bg used to
        // toggle visibility, which made dragging hard).
        _dashEnsureToolbar(el);
        el.addEventListener('dragstart', _dashDragStart);
        el.addEventListener('dragover', _dashDragOver);
        el.addEventListener('drop', _dashDrop);
        el.addEventListener('dragend', _dashDragEnd);
      });
    } else {
      document.querySelectorAll('.lfs-widget').forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.cursor = '';
        el.style.opacity = '';
        el.draggable = false;
        el.removeEventListener('dragstart', _dashDragStart);
        el.removeEventListener('dragover', _dashDragOver);
        el.removeEventListener('drop', _dashDrop);
        el.removeEventListener('dragend', _dashDragEnd);
        _dashRemoveToolbar(el);
      });
      applyDashboardLayout();
      saveDashboardLayout();
    }
  }

  function _dashEnsureToolbar(el) {
    if (el.querySelector('.lfs-widget-toolbar')) return;
    const id = el.getAttribute('data-widget-id');
    const isHidden = _dashLayout[id] && _dashLayout[id].hidden;
    const tb = document.createElement('div');
    tb.className = 'lfs-widget-toolbar';
    tb.style.cssText = 'position:absolute;top:6px;right:6px;z-index:5;display:flex;gap:4px;background:var(--surface-2);border:1px solid var(--gray-border);border-radius:6px;padding:2px';
    tb.innerHTML = `
      <button title="${isHidden ? 'Show' : 'Hide'}" style="background:transparent;border:0;cursor:pointer;padding:4px 6px;color:var(--text);font-size:12px"><i class="fa-solid fa-${isHidden ? 'eye-slash' : 'eye'}"></i></button>
      <span style="color:var(--text-muted);font-size:11px;align-self:center;padding:0 4px"><i class="fa-solid fa-grip-vertical"></i> drag</span>
    `;
    // Make sure the parent is positioned so absolute placement anchors right.
    const pos = window.getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    tb.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation(); e.preventDefault();
      if (!_dashLayout[id]) _dashLayout[id] = {};
      _dashLayout[id].hidden = !_dashLayout[id].hidden;
      el.style.opacity = _dashLayout[id].hidden ? '0.4' : '1';
      const ic = tb.querySelector('i');
      ic.className = _dashLayout[id].hidden ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
    el.appendChild(tb);
  }
  function _dashRemoveToolbar(el) {
    const tb = el.querySelector('.lfs-widget-toolbar');
    if (tb) tb.remove();
  }

  function _dashDragStart(e) {
    const id = e.currentTarget.getAttribute('data-widget-id');
    _dashDraggingId = id;
    e.currentTarget.style.opacity = '0.4';
    try { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; } catch {}
  }
  function _dashDragOver(e) {
    // preventDefault is required to allow drop. The visual cue is the
    // outline change on the dragover target.
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.style.outline = '2px solid var(--primary)';
  }
  function _dashDrop(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const targetId = target.getAttribute('data-widget-id');
    target.style.outline = '2px dashed var(--primary)';
    if (!_dashDraggingId || _dashDraggingId === targetId) return;
    // Reorder DOM: insert dragging element before target (or after if
    // it was already before). Persist the resulting order in
    // _dashLayout.
    const dragging = document.querySelector(`.lfs-widget[data-widget-id="${_dashDraggingId}"]`);
    if (!dragging || !target) return;
    if (dragging.parentElement !== target.parentElement) return; // can't cross containers
    const siblings = [...target.parentElement.children].filter(el => el.classList.contains('lfs-widget'));
    const draggingIndex = siblings.indexOf(dragging);
    const targetIndex = siblings.indexOf(target);
    if (draggingIndex < targetIndex) {
      target.parentElement.insertBefore(dragging, target.nextSibling);
    } else {
      target.parentElement.insertBefore(dragging, target);
    }
    // Re-stamp order on every sibling to keep the numbers dense.
    const updated = [...target.parentElement.children].filter(el => el.classList.contains('lfs-widget'));
    updated.forEach((el, idx) => {
      const id = el.getAttribute('data-widget-id');
      if (!_dashLayout[id]) _dashLayout[id] = {};
      _dashLayout[id].order = idx;
    });
  }
  function _dashDragEnd(e) {
    e.currentTarget.style.opacity = (_dashLayout[e.currentTarget.getAttribute('data-widget-id')] || {}).hidden ? '0.4' : '1';
    document.querySelectorAll('.lfs-widget').forEach(el => { el.style.outline = '2px dashed var(--primary)'; });
    _dashDraggingId = null;
  }

  window.loadDashboardLayout = loadDashboardLayout;
  window.applyDashboardLayout = applyDashboardLayout;
  window.saveDashboardLayout = saveDashboardLayout;
  window.toggleDashboardCustomize = toggleDashboardCustomize;

  // Run on every page load — same trigger the inline version had.
  window.addEventListener('load', () => loadDashboardLayout());
})();
