/* public/admin/file-activity.js — File Activity admin page IIFE (Wave 122)
 * Fetch + render + filters + pagination + detail modal.
 * Exposed as window.FileActivity for inline onclick handlers.
 */
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────────
  const API_BASE     = '/api/admin/file-activity';
  const PAGE_LIMIT   = 100;

  // Map action suffix → CSS class for the badge
  const ACTION_CLASS = {
    upload:           'upload',
    version_download: 'download',
    zip_download:     'download',
    download:         'download',
    trash:            'trash',
    restore:          'restore',
    purge:            'purge',
    delete:           'delete',
    push:             'push',
    promote:          'promote',
    reject:           'reject',
  };

  // FA icons for action suffixes
  const ACTION_ICON = {
    upload:           'fa-upload',
    version_download: 'fa-download',
    zip_download:     'fa-file-zipper',
    download:         'fa-download',
    trash:            'fa-trash',
    restore:          'fa-rotate-left',
    purge:            'fa-fire',
    delete:           'fa-trash-can',
    push:             'fa-cloud-arrow-up',
    promote:          'fa-circle-check',
    reject:           'fa-circle-xmark',
  };

  // ── State ──────────────────────────────────────────────────────────────────
  let state = {
    offset: 0,
    total:  0,
    loading: false,
    filters: {},
    actionEnum: [], // populated from first API response
  };

  // ── DOM helpers ────────────────────────────────────────────────────────────
  function el(id) { return document.getElementById(id); }

  function escHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTs(isoStr) {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    } catch (_) { return isoStr; }
  }

  // ── Action badge HTML ──────────────────────────────────────────────────────
  function actionBadge(action) {
    if (!action) return '<span class="action-badge other">—</span>';
    const parts  = action.split('.');
    const suffix = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join('.');
    const cls    = ACTION_CLASS[suffix] || 'other';
    const icon   = ACTION_ICON[suffix]  || 'fa-file';
    return `<span class="action-badge ${escHtml(cls)}" title="${escHtml(action)}">
      <i class="fa-solid ${escHtml(icon)}" aria-hidden="true"></i>
      ${escHtml(prefix ? prefix + '.' : '')}${escHtml(suffix)}
    </span>`;
  }

  // ── Read filter values from form ───────────────────────────────────────────
  function readFilters() {
    return {
      action:      el('filter-action')?.value      || '',
      entity_type: el('filter-entity-type')?.value || '',
      actor:       el('filter-actor')?.value?.trim() || '',
      from:        el('filter-from')?.value        || '',
      to:          el('filter-to')?.value          || '',
      q:           el('filter-q')?.value?.trim()   || '',
    };
  }

  // ── Populate action dropdown from enum ────────────────────────────────────
  function populateActionDropdown(actions) {
    const sel = el('filter-action');
    if (!sel || sel.children.length > 1) return; // already populated
    actions.forEach(a => {
      const opt = document.createElement('option');
      opt.value       = a;
      opt.textContent = a;
      sel.appendChild(opt);
    });
  }

  // ── Fetch and render ───────────────────────────────────────────────────────
  async function loadPage(offset, filters) {
    if (state.loading) return;
    state.loading = true;

    el('btn-apply').disabled = true;
    el('fa-tbody').innerHTML = `<tr><td colspan="7"><div class="fa-loading">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading…
    </div></td></tr>`;
    el('btn-prev').disabled = true;
    el('btn-next').disabled = true;

    const params = new URLSearchParams({ limit: PAGE_LIMIT, offset });
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    try {
      const res = await fetch(`${API_BASE}?${params}`, { credentials: 'same-origin' });

      if (res.status === 401 || res.status === 403) {
        renderError('Access denied — admin role required.', 'fa-lock');
        return;
      }
      if (!res.ok) {
        renderError(`Server error (HTTP ${res.status}). Please try again.`, 'fa-triangle-exclamation');
        return;
      }

      const data = await res.json();

      // Cache enum
      if (data.file_actions && state.actionEnum.length === 0) {
        state.actionEnum = data.file_actions;
        populateActionDropdown(data.file_actions);
      }

      state.offset = offset;
      state.total  = data.total || 0;
      state.filters = filters;

      // Header stats
      el('stat-total').textContent = state.total.toLocaleString();
      el('stat-today').textContent = (data.total_today || 0).toLocaleString();

      renderTable(data.events || []);
      updatePager(offset, data.total || 0);

    } catch (err) {
      console.error('[file-activity] fetch error:', err);
      renderError('Network error — check your connection.', 'fa-wifi');
    } finally {
      state.loading = false;
      el('btn-apply').disabled = false;
    }
  }

  function renderError(msg, icon) {
    el('fa-tbody').innerHTML = `<tr><td colspan="7">
      <div class="fa-empty">
        <i class="fa-solid ${escHtml(icon)}" aria-hidden="true"></i>
        <p>${escHtml(msg)}</p>
      </div>
    </td></tr>`;
    el('btn-prev').disabled = true;
    el('btn-next').disabled = true;
    el('pager-info').textContent = '';
  }

  function renderTable(events) {
    if (!events || events.length === 0) {
      el('fa-tbody').innerHTML = `<tr><td colspan="7">
        <div class="fa-empty">
          <i class="fa-solid fa-inbox" aria-hidden="true"></i>
          <p>No file activity events match your filters.</p>
        </div>
      </td></tr>`;
      return;
    }

    const rows = events.map((ev, idx) => {
      const ts     = formatTs(ev.at);
      const badge  = actionBadge(ev.action);
      const actor  = escHtml(ev.actor_username || '—');
      const etype  = escHtml(ev.entity_type || '—');
      const eid    = escHtml(ev.entity_id   || '—');
      const source = escHtml(ev.source      || '—');
      const ip     = escHtml(ev.ip          || '—');

      return `<tr tabindex="0" role="button" aria-label="View details for event ${escHtml(String(ev.id))}"
                  data-event-id="${escHtml(String(ev.id))}"
                  onkeydown="if(event.key==='Enter'||event.key===' '){FileActivity.openDetail(this.dataset.eventId)}"
                  onclick="FileActivity.openDetail('${escHtml(String(ev.id))}')">
        <td title="${escHtml(ev.at || '')}">${escHtml(ts)}</td>
        <td>${badge}</td>
        <td>${actor}</td>
        <td>${etype}</td>
        <td class="mono-id" title="${eid}">${eid}</td>
        <td>${source}</td>
        <td class="mono-id">${ip}</td>
      </tr>`;
    });

    el('fa-tbody').innerHTML = rows.join('');
  }

  function updatePager(offset, total) {
    const start   = total === 0 ? 0 : offset + 1;
    const end     = Math.min(offset + PAGE_LIMIT, total);
    const hasPrev = offset > 0;
    const hasNext = offset + PAGE_LIMIT < total;

    el('pager-info').textContent = total === 0
      ? 'No results'
      : `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`;

    el('btn-prev').disabled = !hasPrev;
    el('btn-next').disabled = !hasNext;
  }

  // ── Detail modal ───────────────────────────────────────────────────────────
  async function openDetail(eventId) {
    const overlay = el('fa-modal-overlay');
    const body    = el('fa-modal-body');

    body.innerHTML = `<div class="fa-loading"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading…</div>`;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    el('fa-modal-header')?.querySelector('.fa-modal-close')?.focus();

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(eventId)}`, { credentials: 'same-origin' });
      if (!res.ok) {
        body.innerHTML = `<p style="color:var(--danger);padding:12px">Failed to load event (HTTP ${res.status}).</p>`;
        return;
      }
      const ev = await res.json();
      renderDetail(ev);
    } catch (err) {
      console.error('[file-activity] detail fetch error:', err);
      body.innerHTML = `<p style="color:var(--danger);padding:12px">Network error loading event detail.</p>`;
    }
  }

  function renderDetail(ev) {
    const body = el('fa-modal-body');

    const field = (label, val, mono) =>
      `<div class="detail-field">
        <span class="field-label">${escHtml(label)}</span>
        <span class="field-val${mono ? ' mono' : ''}">${escHtml(val != null ? String(val) : '—')}</span>
      </div>`;

    const jsonBlock = (label, obj) => {
      const content = obj == null
        ? '<span class="json-null">null</span>'
        : `<pre class="json-block">${escHtml(JSON.stringify(obj, null, 2))}</pre>`;
      return `<div class="json-section">
        <h3>${escHtml(label)}</h3>
        ${content}
      </div>`;
    };

    body.innerHTML = `
      <div class="detail-grid">
        ${field('Event ID',     ev.id,             true)}
        ${field('Timestamp',    formatTs(ev.at),   false)}
        ${field('Action',       ev.action,         true)}
        ${field('Actor',        ev.actor_username, false)}
        ${field('Actor type',   ev.actor_type,     false)}
        ${field('Entity type',  ev.entity_type,    false)}
        ${field('Entity ID',    ev.entity_id,      true)}
        ${field('Source',       ev.source,         false)}
        ${field('IP address',   ev.ip,             true)}
        ${field('User agent',   ev.user_agent,     false)}
      </div>
      ${jsonBlock('Meta', ev.meta)}
      ${jsonBlock('Before data', ev.before_data)}
      ${jsonBlock('After data',  ev.after_data)}
    `;
  }

  function closeModal(evt) {
    // If called from overlay click, only close when clicking the overlay itself
    if (evt && evt.target !== el('fa-modal-overlay')) return;
    const overlay = el('fa-modal-overlay');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const overlay = el('fa-modal-overlay');
      if (overlay && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // ── Public API (called from inline onclick) ────────────────────────────────
  function applyFilters() {
    loadPage(0, readFilters());
  }

  function clearFilters() {
    ['filter-action', 'filter-entity-type', 'filter-actor', 'filter-from', 'filter-to', 'filter-q']
      .forEach(id => { const e = el(id); if (e) e.value = ''; });
    loadPage(0, {});
  }

  function prevPage() {
    const newOffset = Math.max(0, state.offset - PAGE_LIMIT);
    loadPage(newOffset, state.filters);
  }

  function nextPage() {
    const newOffset = state.offset + PAGE_LIMIT;
    if (newOffset < state.total) loadPage(newOffset, state.filters);
  }

  // ── Dark-mode inherit from admin shell ────────────────────────────────────
  // If loaded standalone, attempt to inherit admin's theme from sessionStorage.
  (function syncTheme() {
    try {
      const theme = sessionStorage.getItem('lfs_theme') || localStorage.getItem('lfs_theme');
      if (theme) document.documentElement.setAttribute('data-theme', theme);
    } catch (_) {}
  })();

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadPage(0, {});
  });

  // Expose on window for inline handlers + potential external callers
  window.FileActivity = { applyFilters, clearFilters, prevPage, nextPage, openDetail, closeModal };

})();
