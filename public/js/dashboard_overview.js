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

  // Theme is applied + switched by app_nav.js + app-shell.js (one shared engine).

  let d = null, pipe = {}, aging = null, hoursData = null, revenueMonths = null, marginRows = null;
  let _period = 'month';

  function periodRange(period) {
    const now = new Date();
    if (period === 'quarter') {
      const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const qEnd   = new Date(qStart.getFullYear(), qStart.getMonth() + 3, 0);
      return { from: qStart.toISOString().slice(0, 10), to: qEnd.toISOString().slice(0, 10) };
    }
    if (period === 'all') return { from: '', to: '' };
    // default: month
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    return { from, to };
  }

  window.setPeriod = async function (p) {
    _period = p;
    ['month','quarter','all'].forEach(k => {
      const btn = document.getElementById(`pd-${k}`);
      if (!btn) return;
      const active = k === p;
      btn.style.background = active ? 'var(--primary)' : '';
      btn.style.color = active ? '#fff' : 'var(--text-secondary)';
    });
    const { from, to } = periodRange(p);
    const qs = from ? `?from=${from}&to=${to}` : '';
    hoursData = await fetch(`/api/hours/summary${qs}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null).catch(() => null);
    renderTiles();
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) renderTab(activeTab.dataset.tab);
  };

  async function boot() {
    try {
      const { from, to } = periodRange('month');
      [d, pipe, aging, hoursData, revenueMonths, marginRows] = await Promise.all([
        api('/api/dashboard/overview'),
        api('/api/service-area-pipelines').then(p => p.pipelines || {}).catch(() => ({})),
        fetch('/api/money/aging', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/api/hours/summary?from=${from}&to=${to}`, { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/money/revenue?group=month', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/money/margin', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
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
    const arTotal = aging ? money(aging.grand_total) : '—';
    const arCount = aging ? aging.invoice_count : '—';
    const tiles = [
      { lbl: 'Active areas', val: t.service_areas, sub: `${t.sa_rus} RUS · ${t.sa_non_rus} non-RUS` },
      { lbl: 'Jobs in flight', val: t.jobs, sub: 'across all areas' },
      { lbl: 'Est. pipeline', val: money(t.estimated_total), sub: 'sum of job estimates' },
      { lbl: 'Unbilled', val: money(rtb.total), sub: `${num(rtb.count)} ready to bill` },
      { lbl: 'AR outstanding', val: arTotal, sub: `${arCount} invoice${arCount === 1 ? '' : 's'}` },
    ];
    $('tiles').innerHTML = tiles.map(x =>
      `<div class="tile"><div class="lbl">${x.lbl}</div><div class="val">${esc(x.val)}</div><div class="sub">${esc(x.sub)}</div></div>`).join('');
  }

  function renderAttention() {
    const a = d.alerts || {}, rtb = d.ready_to_bill || {};
    // Overdue invoices: 90+ day AR bucket
    const overdue90 = aging && aging.buckets && aging.buckets['90+'] ? aging.buckets['90+'] : null;
    // Zero-job areas: service areas with no jobs (job_count === 0) from margin data
    const zeroJobs = marginRows ? (marginRows.rows || []).filter(r => r.job_count === 0).length : null;
    const items = [
      { dot: 'var(--success)', t: 'Ready to bill', v: `${num(rtb.count)} · ${money(rtb.total)}`, tab: 'bill' },
      { dot: 'var(--warning)', t: 'In revision', v: num(a.in_revision), tab: 'pipeline' },
      { dot: 'var(--warning)', t: 'Stale > 14d', v: num(a.stale), tab: 'pipeline' },
      overdue90 !== null
        ? { dot: overdue90.count > 0 ? 'var(--danger)' : 'var(--success)', t: 'Overdue (90+ d)', v: `${overdue90.count} inv · ${money(overdue90.total)}`, href: '/invoices.html' }
        : null,
      zeroJobs !== null
        ? { dot: zeroJobs > 0 ? 'var(--warning)' : 'var(--success)', t: 'Areas with no jobs', v: zeroJobs, href: '/service-areas.html' }
        : null,
    ].filter(Boolean);
    $('attention').innerHTML = items.map(x =>
      x.href
        ? `<a class="att" href="${x.href}" style="text-decoration:none;color:inherit"><span class="dot" style="background:${x.dot}"></span>${x.t} <span class="v">· ${esc(x.v)}</span></a>`
        : `<div class="att" ${x.tab ? `data-go="${x.tab}"` : ''}><span class="dot" style="background:${x.dot}"></span>${x.t} <span class="v">· ${esc(x.v)}</span></div>`
    ).join('');
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

    // Month-over-month from /api/money/revenue?group=month
    let momHtml = '';
    if (revenueMonths && (revenueMonths.rows || []).length >= 2) {
      const rows = revenueMonths.rows; // sorted newest-first
      const thisM = rows[0], lastM = rows[1];
      const diff = thisM.total - lastM.total;
      const pct  = lastM.total ? Math.round(Math.abs(diff) / lastM.total * 100) : null;
      const sign  = diff >= 0 ? '+' : '−';
      const col   = diff >= 0 ? 'var(--success-text)' : 'var(--danger-text)';
      const pctStr = pct !== null ? ` (${pct}%)` : '';
      momHtml = `<div style="padding:10px 16px;font-size:13px;border-top:1px solid var(--border-weak)">
        <span style="color:var(--text-muted)">Month-over-month revenue:</span>
        <strong style="margin-left:6px;color:${col}">${sign}${money(Math.abs(diff))}${pctStr}</strong>
        <span style="color:var(--text-muted);margin-left:4px">${esc(lastM.label)} → ${esc(thisM.label)}</span>
      </div>`;
    }

    const agingHtml = aging ? (() => {
      const b = aging.buckets || {};
      const bkts = [['0-30','0–30 days','var(--success)'],['31-60','31–60 days','var(--info)'],['61-90','61–90 days','var(--warning)'],['90+','90+ days','var(--danger)']];
      return `<div class="card" style="margin-top:14px">
        <div class="card-h">AR aging <a href="/money.html">Open money →</a></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;padding:14px">
          ${bkts.map(([key, label, col]) => { const bk = b[key] || {total:0,count:0}; return `<div style="border-left:3px solid ${col};padding:8px 12px;background:var(--surface-1);border-radius:6px"><div style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px">${label}</div><div style="font-size:18px;font-weight:700;margin:4px 0 2px">${money(bk.total)}</div><div style="font-size:11px;color:var(--text-muted)">${num(bk.count)} invoice${bk.count === 1 ? '' : 's'}</div></div>`; }).join('')}
        </div>
        <div class="note">AR total: ${money(aging.grand_total)} across ${aging.invoice_count} outstanding invoice${aging.invoice_count === 1 ? '' : 's'}.</div>
      </div>`;
    })() : '';
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Estimated pipeline by program</div>
      <div class="kv"><span class="k">RUS (engineering contracts)</span><strong>${money(r.est_rus)}</strong></div>
      <div class="kv"><span class="k">Non-RUS (BAU / GFR / Other)</span><strong>${money(r.est_non_rus)}</strong></div>
      <div class="kv"><span class="k">Actual billed</span><strong>${money(r.actual_total)}</strong></div>
      <div class="note">Actual billed = total of invoices created from billed jobs.</div>
      ${momHtml}
    </div>
    <div class="card" style="margin-top:14px"><div class="card-h">By client</div>${
      bc.length ? bc.map(c => `<div class="kv"><span class="k">${esc(c.client_name)} <span class="muted">· ${c.sa_count} area(s)</span></span><strong>${money(c.estimated_total)}</strong></div>`).join('')
      : '<div class="muted" style="padding:14px">No clients with service areas yet.</div>'}</div>
    ${agingHtml}`;
  }

  function renderBill() {
    const r = d.ready_to_bill || {};
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Ready to bill <a href="/billing.html">Open billing →</a></div>
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
    // Build per-person rows from /api/hours/summary if available
    let personRows = '';
    if (hoursData && (hoursData.rows || []).length) {
      const byPerson = new Map();
      for (const r of hoursData.rows) {
        const key = r.staff_name || r.staff_id || 'Unknown';
        const cur = byPerson.get(key) || 0;
        byPerson.set(key, cur + (r.total_hours || 0));
      }
      const sorted = [...byPerson.entries()].sort((a, b) => b[1] - a[1]);
      personRows = `<div class="card" style="margin-top:14px">
        <div class="card-h">This month by person <a href="/hours.html">Full Hours view →</a></div>
        ${sorted.map(([name, hrs]) => `<div class="kv"><span class="k">${esc(name)}</span><strong>${num(hrs).toFixed(1)} hrs</strong></div>`).join('')}
      </div>`;
    }
    $('tabContent').innerHTML = `<div class="card">
      <div class="card-h">Hours & utilization</div>
      <div class="bigrow">
        <div class="big">${total.toFixed(0)}<span class="u">total hours</span></div>
        <div class="big">${bill.toFixed(0)}<span class="u">billable</span></div>
        <div class="big">${num(h.overhead).toFixed(0)}<span class="u">overhead</span></div>
        <div class="big">${util}%<span class="u">utilization</span></div>
      </div>
      <div class="note">Hours populate as the contractor timeclock logs against jobs — Phase 5. Time not on a billable job counts as overhead.</div>
    </div>${personRows}`;
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
