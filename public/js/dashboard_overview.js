// dashboard_overview.js — E-layout dashboard: metric tiles + tabbed detail.
// Grounded in the new service-area / pipeline model (/api/dashboard/overview).

(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  document.documentElement.setAttribute('data-theme', localStorage.getItem('lfs_theme') || 'light');
  $('themeToggle').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t); localStorage.setItem('lfs_theme', t);
  });

  let data = null, pipe = {};

  async function boot() {
    try {
      [data, pipe] = await Promise.all([
        api('/api/dashboard/overview'),
        api('/api/service-area-pipelines').then(p => p.pipelines || {}).catch(() => ({})),
      ]);
      renderTiles();
      renderTab('pipeline');
      document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        renderTab(t.dataset.tab);
      }));
    } catch (e) {
      $('tabContent').innerHTML = `<div class="muted" style="padding:20px">Failed to load: ${esc(e.message)}</div>`;
    }
  }

  function renderTiles() {
    const t = data.totals;
    const tiles = [
      { lbl: 'Service areas', val: t.service_areas, sub: `${t.sa_rus} RUS · ${t.sa_non_rus} non-RUS` },
      { lbl: 'Jobs in flight', val: t.jobs, sub: 'across all service areas' },
      { lbl: 'Estimated pipeline', val: money(t.estimated_total), sub: 'sum of job estimates' },
      { lbl: 'Hours logged', val: Number(t.hours_total).toFixed(0), sub: 'billable + overhead' },
    ];
    $('tiles').innerHTML = tiles.map(x =>
      `<div class="tile"><div class="lbl">${x.lbl}</div><div class="val">${esc(x.val)}</div><div class="sub">${esc(x.sub)}</div></div>`).join('');
  }

  function countFor(team, stage) {
    const r = (data.by_team_stage || []).find(x => x.team === team && x.status === stage);
    return r ? r.count : 0;
  }

  function renderTab(tab) {
    if (tab === 'pipeline') return renderPipeline();
    if (tab === 'recent') return renderRecent();
    if (tab === 'clients') return renderClients();
  }

  function renderPipeline() {
    const teams = ['permitting', 'design'];
    $('tabContent').innerHTML = teams.map(team => {
      const stages = [...(pipe[team] || []), 'revision'];
      if (!stages.length) return '';
      return `<div class="card">
        <div class="card-h">${team[0].toUpperCase() + team.slice(1)} pipeline
          <a href="/pipeline.html?team=${team}">Open board →</a></div>
        <div class="stage-row">
          ${stages.map(s => `<div class="stage ${s === 'revision' ? 'rev' : ''}">
            <div class="s-lbl">${esc(s)}</div><div class="s-cnt">${countFor(team, s)}</div></div>`).join('')}
        </div></div>`;
    }).join('') || '<div class="muted" style="padding:20px">No pipeline data.</div>';
  }

  function renderRecent() {
    const rows = data.recent || [];
    $('tabContent').innerHTML = `<div class="card"><div class="card-h">Recent service areas</div>${
      rows.length ? rows.map(sa => `<div class="row">
        <div><div class="nm">${esc(sa.name)}</div><div class="mt">${esc(sa.client_name || '')}</div></div>
        <div style="display:flex;align-items:center;gap:10px">
          ${sa.engineering_contract_id ? '<span class="badge badge-rus">RUS</span>' : `<span class="badge badge-prog">${esc((sa.program || 'n/a').toUpperCase())}</span>`}
          <span class="mt">${sa.job_count} job(s)</span>
          <strong>${money(sa.estimated_total)}</strong>
        </div></div>`).join('')
      : '<div class="muted" style="padding:16px">No service areas yet.</div>'}</div>`;
  }

  function renderClients() {
    const rows = data.by_client || [];
    $('tabContent').innerHTML = `<div class="card"><div class="card-h">By client</div>${
      rows.length ? rows.map(c => `<div class="row">
        <div class="nm">${esc(c.client_name)}</div>
        <div style="display:flex;align-items:center;gap:14px"><span class="mt">${c.sa_count} area(s)</span><strong>${money(c.estimated_total)}</strong></div>
      </div>`).join('')
      : '<div class="muted" style="padding:16px">No clients with service areas yet.</div>'}</div>`;
  }

  boot();
})();
