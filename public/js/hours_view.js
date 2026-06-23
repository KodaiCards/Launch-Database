/* public/js/hours_view.js — Admin "Hours by Person" view (Phase 5 follow-up) */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    load();
  });

  function currentRange() {
    const from = document.getElementById('from').value || '';
    const to = document.getElementById('to').value || '';
    return { from, to };
  }

  async function load() {
    const results = document.getElementById('results');
    results.innerHTML = '<div class="loading-row"><span class="spinner"></span>Loading hours…</div>';
    const { from, to } = currentRange();
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    try {
      const res = await fetch(`/api/hours/summary?${qs}`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        results.innerHTML = '<div class="empty-state"><i class="fa-solid fa-lock"></i>Manager or admin access required.</div>';
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      render(data);
    } catch (e) {
      results.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Failed to load hours. ${esc(e.message || '')}</div>`;
    }
  }

  function render(data) {
    const rows = data.rows || [];
    document.getElementById('grand-total').textContent = (data.total_hours || 0).toFixed(1);
    const results = document.getElementById('results');

    if (!rows.length) {
      results.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clock"></i>No hours logged for this range.</div>';
      return;
    }

    // Group rows by staff member.
    const byStaff = new Map();
    for (const r of rows) {
      const key = r.staff_id || r.staff_name;
      if (!byStaff.has(key)) byStaff.set(key, { name: r.staff_name, jobs: [], total: 0 });
      const g = byStaff.get(key);
      g.jobs.push(r);
      g.total += r.total_hours || 0;
    }

    results.innerHTML = [...byStaff.values()].map(g => `
      <div class="person-group">
        <div class="person-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <span class="person-name"><i class="fa-solid fa-chevron-down chev"></i>${esc(g.name)}</span>
          <span class="person-total">${g.total.toFixed(1)} hrs</span>
        </div>
        <div class="job-table-wrap">
          <table>
            <thead><tr>
              <th>Client</th><th>Service Area</th><th>Team</th><th>Job</th>
              <th class="num">Entries</th><th class="num">Hours</th>
            </tr></thead>
            <tbody>
              ${g.jobs.map(j => `<tr>
                <td>${esc(j.client_name || '—')}</td>
                <td>${esc(j.service_area_name || '—')}</td>
                <td>${j.team ? `<span class="tag tag-${esc(j.team)}">${esc(cap(j.team))}</span>` : '—'}</td>
                <td>${esc(j.job_name || '—')}</td>
                <td class="num">${j.entry_count}</td>
                <td class="num">${(j.total_hours || 0).toFixed(1)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');
  }

  window.applyFilter = load;

  window.clearFilter = function () {
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    load();
  };

  window.exportCsv = function () {
    const { from, to } = currentRange();
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    window.location.href = `/api/hours/summary.csv?${qs}`;
  };

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

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
