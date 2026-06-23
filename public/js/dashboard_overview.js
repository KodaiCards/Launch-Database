// dashboard_overview.js — E-layout command center: KPI tiles + needs-attention
// + four detail tabs (Revenue / Ready to bill / Hours / Pipeline), inside the
// shared nav shell. Grounded in /api/dashboard/overview (service-area model).
// Honest about what's live now vs filled in by later phases.

(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const num = (n) => Number(n || 0);

  document.documentElement.setAttribute('data-theme', localStorage.getItem('lfs_theme') || 'light');
  $('themeToggle').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t); localStorage.setItem('lfs_theme', t);
  });

  let d = null, pipe = {};

  async function boot() {
    try {
      [d, pipe] = await Promise.all([
        api('/api/dashboard/overview'),
        api('/api/service-area-pipelines').then(p => p.pipelines || {}).catch(() => ({})),
      ]);
      renderTiles(); renderAttention(); renderTab('revenue');
      document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active'); renderTab(t.dataset.tab);
      }));
    } catch (e) {
      $('tabContent').innerHTML = `<div class="muted" style="padding:20px">Failed to load: ${esc(e.message)}</div>`;
    }
  }

  function renderTiles() {
    const t = d.totals, rtb = d.ready_to_bill || {};
    const tiles = [
      { lbl: 'Active areas', val: t.service_areas, sub: `${t.sa_rus} RUS · ${t.sa_non_rus} non-RUS` },
      { lbl: 'Jobs in flight', val: t.jobs, sub: 'across all areas' },
      { lbl: 'Est. pipeline', val: money(t.estimated_total), sub: 'sum of job estimates' },
      { lbl: 'Unbilled', val: money(rtb.total), sub: `${num(rtb.count)} ready to bill` },
    ];
    $('tiles').innerHTML = tiles.map(x =>
      `<div class="tile"><div class="lbl">${x.lbl}</div><div class="val">${esc(x.val)}</div><div class="sub">${esc(x.sub)}</div></div>`).join('');
  }

  function renderAttention() {
    const a = d.alerts || {}, rtb = d.ready_to_bill || {};
    const items = [
      { dot: 'var(--success)', t: 'Ready to bill', v: `${num(rtb.count)} · ${money(rtb.total)}`, tab: 'bill' },
      { dot: 'var(--warning)', t: 'In revision', v: num(a.in_revision), tab: 'pipeline' },
      { dot: 'var(--warning)', t: 'Stale > 14d', v: num(a.stale), tab: 'pipeline' },
      { dot: 'var(--danger)', t: 'Permits due', v: `${num(a.permits_due)}`, tab: null },
    ];
    $('attention').innerHTML = items.map(x =>
      `<div class="att" ${x.tab ? `data-go="${x.tab}"` : ''}><span class="dot" style="background:${x.dot}"></span>${x.t} <span class="v">· ${esc(x.v)}</span></div>`).join('');
    $('attention').querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => {
      const tab = el.dataset.go;
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
      renderTab(tab);
    }));
  }

  function renderTab(tab) {
    if (tab === 'revenue') return renderRevenue();
    if (tab === 'bill') return renderBill();
    if (tab === 'hours') return renderHours();
    if (tab === 'pipeline') return renderPipeline();
  }

  function renderRevenue() {
    const r = d.revenue || {}, bc = d.by_client || [];
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Estimated pipeline by program</div>
      <div class="kv"><span class="k">RUS (engineering contracts)</span><strong>${money(r.est_rus)}</strong></div>
      <div class="kv"><span class="k">Non-RUS (BAU / GFR / Other)</span><strong>${money(r.est_non_rus)}</strong></div>
      <div class="kv"><span class="k">Actual billed</span><strong>${money(r.actual_total)}</strong></div>
      <div class="note">Actual billed = total of invoices created from billed jobs. (Period filter + per-client split coming.)</div>
    </div>
    <div class="card" style="margin-top:14px"><div class="card-h">By client</div>${
      bc.length ? bc.map(c => `<div class="kv"><span class="k">${esc(c.client_name)} <span class="muted">· ${c.sa_count} area(s)</span></span><strong>${money(c.estimated_total)}</strong></div>`).join('')
      : '<div class="muted" style="padding:14px">No clients with service areas yet.</div>'}</div>`;
  }

  function renderBill() {
    const r = d.ready_to_bill || {};
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Ready to bill <a href="#">Open billing →</a></div>
      <div class="bigrow">
        <div class="big">${num(r.count)}<span class="u">jobs done, unbilled</span></div>
        <div class="big">${money(r.total)}<span class="u">estimated value</span></div>
        <div class="big">${num(r.oldest_days)}d<span class="u">oldest waiting</span></div>
      </div>
      <div class="note">"Done" = issued / client-approved / complete with no billed date. One-click invoicing lands in Phase 4.</div>
    </div>`;
  }

  function renderHours() {
    const h = d.hours || {};
    const total = num(h.total), bill = num(h.billable), util = total ? Math.round(bill / total * 100) : 0;
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Hours & utilization</div>
      <div class="bigrow">
        <div class="big">${total.toFixed(0)}<span class="u">total hours</span></div>
        <div class="big">${bill.toFixed(0)}<span class="u">billable</span></div>
        <div class="big">${num(h.overhead).toFixed(0)}<span class="u">overhead</span></div>
        <div class="big">${util}%<span class="u">utilization</span></div>
      </div>
      <div class="note">Hours populate as the contractor timeclock logs against jobs — Phase 5. Time not on a billable job counts as overhead.</div>
    </div>`;
  }

  function renderPipeline() {
    const countFor = (team, st) => { const r = (d.by_team_stage || []).find(x => x.team === team && x.status === st); return r ? r.count : 0; };
    $('tabContent').innerHTML = ['permitting', 'design'].map(team => {
      const stages = [...(pipe[team] || []), 'revision'];
      if (!stages.length) return '';
      return `<div class="card" style="margin-bottom:14px">
        <div class="card-h">${team[0].toUpperCase() + team.slice(1)} pipeline <a href="/pipeline.html?team=${team}">Open board →</a></div>
        <div class="stage-row">${stages.map(s => `<div class="stage ${s === 'revision' ? 'rev' : ''}"><div class="s-lbl">${esc(s)}</div><div class="s-cnt">${countFor(team, s)}</div></div>`).join('')}</div>
      </div>`;
    }).join('') || '<div class="muted" style="padding:20px">No pipeline data.</div>';
  }

  boot();
})();
