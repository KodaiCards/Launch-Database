/* public/js/job_board.js — read-only job board grouped by status */

(function () {
  'use strict';

  const STATUSES = [
    ['not_started',  'Not started'],
    ['in_progress',  'In progress'],
    ['revision',     'Revision'],
    ['done',         'Done'],
    ['billed',       'Billed'],
    ['on_hold',      'On hold'],
  ];

  let _allJobs = [];
  let _groupBy = 'status';

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    loadJobs();
    document.getElementById('jb-search').addEventListener('input', render);
    document.getElementById('jb-team').addEventListener('change', render);
    document.getElementById('jb-program').addEventListener('change', render);
  });

  window.setGroupBy = function (g) {
    _groupBy = g;
    ['status','team','client'].forEach(k => {
      const btn = document.getElementById(`grp-${k}`);
      if (!btn) return;
      const active = k === g;
      btn.style.background = active ? 'var(--primary)' : '';
      btn.style.color = active ? '#fff' : 'var(--text-secondary)';
    });
    render();
  };

  async function loadJobs() {
    const wrap = document.getElementById('board-wrap');
    try {
      const res = await fetch('/api/service-area-jobs', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        wrap.innerHTML = '<div class="empty-state"><i class="fa-solid fa-lock"></i>Login required.</div>';
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      _allJobs = await res.json();
      render();
    } catch (e) {
      wrap.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Failed to load. ${esc(e.message || '')}</div>`;
    }
  }

  function filtered() {
    const q    = (document.getElementById('jb-search').value || '').toLowerCase().trim();
    const team = document.getElementById('jb-team').value;
    const prog = document.getElementById('jb-program').value;
    return _allJobs.filter(j => {
      if (team && j.team !== team) return false;
      if (prog && (j.program || '') !== prog) return false;
      if (q) {
        const text = [j.job_name, j.service_area_name, j.client_name, j.assigned_staff_name].join(' ').toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }

  function render() {
    const jobs = filtered();
    const wrap = document.getElementById('board-wrap');
    if (!jobs.length) {
      wrap.innerHTML = '<div class="empty-state"><i class="fa-solid fa-briefcase"></i>No jobs match the current filters.</div>';
      return;
    }
    if (_groupBy === 'status') {
      renderByStatus(jobs, wrap);
    } else {
      renderByKey(jobs, wrap, _groupBy);
    }
  }

  function renderByStatus(jobs, wrap) {
    const byStatus = new Map(STATUSES.map(([k]) => [k, []]));
    for (const j of jobs) {
      const key = j.status || 'not_started';
      if (!byStatus.has(key)) byStatus.set(key, []);
      byStatus.get(key).push(j);
    }
    const colsHtml = STATUSES.map(([key, label]) => {
      const bucket = byStatus.get(key) || [];
      const cardsHtml = bucket.length
        ? bucket.map(j => jobCard(j)).join('')
        : '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px">Empty</div>';
      return `<div class="col-wrap">
        <div class="col-header"><span>${esc(label)}</span><span class="cnt">${bucket.length}</span></div>
        ${cardsHtml}
      </div>`;
    }).join('');
    wrap.innerHTML = `<div class="board">${colsHtml}</div>`;
  }

  function renderByKey(jobs, wrap, groupKey) {
    const map = new Map();
    for (const j of jobs) {
      const key = (groupKey === 'team' ? j.team : j.client_name) || '— Unassigned —';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(j);
    }
    const sorted = [...map.entries()].sort((a, b) => b[1].length - a[1].length);
    const colsHtml = sorted.map(([label, bucket]) =>
      `<div class="col-wrap">
        <div class="col-header"><span>${esc(label)}</span><span class="cnt">${bucket.length}</span></div>
        ${bucket.map(j => jobCard(j)).join('')}
      </div>`
    ).join('');
    wrap.innerHTML = `<div class="board">${colsHtml}</div>`;
  }

  function jobCard(j) {
    const teamTag  = j.team   ? `<span class="tag tag-${esc(j.team)}">${esc(j.team)}</span>` : '';
    const progTag  = j.engineering_contract_id
      ? '<span class="tag tag-rus">RUS</span>'
      : (j.program ? `<span class="tag tag-${esc(j.program)}">${esc(j.program.toUpperCase())}</span>` : '');
    const assigned = j.assigned_staff_name ? `<div class="assigned"><i class="fa-solid fa-user" style="font-size:9px"></i> ${esc(j.assigned_staff_name)}</div>` : '';
    return `<div class="job-card">
      <div class="job-card-name">${esc(j.job_name || '—')}</div>
      <div class="job-card-area">${esc(j.client_name || '—')} · ${esc(j.service_area_name || '—')}</div>
      <div class="job-card-meta">${teamTag}${progTag}</div>
      ${assigned}
    </div>`;
  }

  window.clearFilters = function () {
    document.getElementById('jb-search').value = '';
    document.getElementById('jb-team').value = '';
    document.getElementById('jb-program').value = '';
    render();
  };

  window.toggleDark = function () {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('lfs_theme', dark ? 'light' : 'dark');
    updateDmIcon();
  };
  function applyStoredTheme() {
    const stored = localStorage.getItem('lfs_theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    updateDmIcon();
  }
  function updateDmIcon() {
    const icon = document.getElementById('dm-icon');
    if (!icon) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
