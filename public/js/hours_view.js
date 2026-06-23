/* public/js/hours_view.js — Admin "Hours by Person" view */

(function () {
  'use strict';

  let _lastData = null;          // cached API response for client-side regroup
  let _groupBy  = 'person';      // 'person' | 'client' | 'area'

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    load();
  });

  // ── Date helpers ─────────────────────────────────────────────────────────

  function isoDate(d) { return d.toISOString().slice(0, 10); }

  // Date preset buttons (tasks 6)
  window.setPreset = function (preset) {
    const now = new Date();
    let from = '', to = '';
    if (preset === 'week') {
      const dow = (now.getDay() + 6) % 7;
      const mon = new Date(now); mon.setDate(now.getDate() - dow);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      from = isoDate(mon); to = isoDate(sun);
    } else if (preset === 'month') {
      from = isoDate(new Date(now.getFullYear(), now.getMonth(), 1));
      to   = isoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    }
    // 'all' → leave from/to empty
    document.getElementById('from').value = from;
    document.getElementById('to').value   = to;
    load();
  };

  function currentRange() {
    return {
      from: document.getElementById('from').value || '',
      to:   document.getElementById('to').value   || '',
    };
  }

  // ── Data load ─────────────────────────────────────────────────────────────

  async function load() {
    const results = document.getElementById('results');
    results.innerHTML = '<div class="loading-row"><span class="spinner"></span>Loading hours…</div>';
    const { from, to } = currentRange();
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to)   qs.set('to',   to);
    try {
      const res = await fetch(`/api/hours/summary?${qs}`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        results.innerHTML = '<div class="empty-state"><i class="fa-solid fa-lock"></i>Manager or admin access required.</div>';
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      _lastData = await res.json();
      render(_lastData);
    } catch (e) {
      results.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Failed to load hours. ${esc(e.message || '')}</div>`;
    }
  }

  // ── Group-by toggle (task 5) — no extra fetch ────────────────────────────

  window.setGroup = function (g) {
    _groupBy = g;
    ['person', 'client', 'area'].forEach(k => {
      const el = document.getElementById(`grp-${k}`);
      if (el) el.classList.toggle('active', k === g);
    });
    if (_lastData) render(_lastData);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  function render(data) {
    const rows = data.rows || [];
    document.getElementById('grand-total').textContent = (data.total_hours || 0).toFixed(1);
    const results = document.getElementById('results');

    if (!rows.length) {
      results.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clock"></i>No hours logged for this range.</div>';
      return;
    }

    // Build groups based on current toggle.
    const groups = buildGroups(rows, _groupBy);
    results.innerHTML = groups.map(g => renderGroup(g)).join('');
  }

  function buildGroups(rows, groupBy) {
    const map = new Map();
    for (const r of rows) {
      let key, label;
      if (groupBy === 'client') {
        key   = r.client_name || '— No client —';
        label = r.client_name || '— No client —';
      } else if (groupBy === 'area') {
        key   = (r.client_name || '') + '|' + (r.service_area_name || '');
        label = [r.client_name, r.service_area_name].filter(Boolean).join(' · ') || '— No area —';
      } else {
        // person (default)
        key   = r.staff_id || r.staff_name;
        label = r.staff_name || '— Unattributed —';
      }
      if (!map.has(key)) map.set(key, { label, rows: [], total: 0 });
      const g = map.get(key);
      g.rows.push(r);
      g.total += r.total_hours || 0;
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }

  // Column headers differ per grouping — omit the dimension we're already
  // grouping on so the table stays tight.
  function renderGroup(g) {
    const colDefs = _groupBy === 'person'
      ? [['Client','client_name'], ['Service Area','service_area_name'], ['Team','team'], ['Job','job_name']]
      : _groupBy === 'client'
      ? [['Person','staff_name'], ['Service Area','service_area_name'], ['Team','team'], ['Job','job_name']]
      : /* area */
        [['Person','staff_name'], ['Team','team'], ['Job','job_name']];

    const headerCells = colDefs.map(([h]) => `<th>${h}</th>`).join('') +
      `<th class="num">Entries</th><th class="num">Hours</th>`;

    const bodyRows = g.rows.map(r => {
      const cells = colDefs.map(([, key]) => {
        if (key === 'team') return `<td>${r.team ? `<span class="tag tag-${esc(r.team)}">${esc(cap(r.team))}</span>` : '—'}</td>`;
        return `<td>${esc(r[key] || '—')}</td>`;
      }).join('');
      return `<tr>${cells}<td class="num">${r.entry_count}</td><td class="num">${(r.total_hours || 0).toFixed(1)}</td></tr>`;
    }).join('');

    return `<div class="person-group">
      <div class="person-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="person-name"><i class="fa-solid fa-chevron-down chev"></i>${esc(g.label)}</span>
        <span class="person-total">${g.total.toFixed(1)} hrs</span>
      </div>
      <div class="job-table-wrap">
        <table>
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    </div>`;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  window.applyFilter = load;

  window.clearFilter = function () {
    document.getElementById('from').value = '';
    document.getElementById('to').value   = '';
    load();
  };

  window.exportCsv = function (group) {
    const { from, to } = currentRange();
    const qs = new URLSearchParams();
    if (from)  qs.set('from', from);
    if (to)    qs.set('to',   to);
    if (group) qs.set('group', group);
    window.location.href = `/api/hours/summary.csv?${qs}`;
  };

  // ── Theme ─────────────────────────────────────────────────────────────────

  window.toggleDark = function () {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('lfs-theme', dark ? 'light' : 'dark');
    updateDmIcon();
  };

  function applyStoredTheme() {
    const stored = localStorage.getItem('lfs-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    updateDmIcon();
  }

  function updateDmIcon() {
    const icon = document.getElementById('dm-icon');
    if (!icon) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
