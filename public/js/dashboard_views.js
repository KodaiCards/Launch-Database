// public/js/dashboard_views.js — Admin Dashboard tab + companion cards.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Owns everything that paints the Dashboard tab itself plus the click-
// through "what's actually counted?" modals that the dashboard tiles
// open. Companion cards (Needs Attention, Bill-Now Preview, PSC RUS
// 90-day projection) live here too because loadDashboard kicks them
// off in parallel — they aren't called from anywhere else.
//
//   showActiveList            — Active Projects tile drilldown
//   showProjectedList         — Projected Revenue tile drilldown
//   loadNeedsAttention        — auto-hide alert card driven by
//                               /api/automation/* endpoints
//   loadBillNowPreview        — auto-hide bill-today preview by client
//   loadInspectionProjection  — admin-only PSC RUS 90-day projection
//   loadDashboard             — main tab loader: KPI tiles + project
//                               tree with unlimited depth + recursive
//                               revenue rollup
//   dtreeToggle               — chevron expand/collapse for the
//                               dashboard project tree
//
// Globals this module reads:
//   api(), esc(), fmt(), fmtMoney() — global helpers
//   statusBadge(), typeBadge()      — global badge renderers
//   openModal(), closeModal()       — global modal helpers
//   showProjectDetail()             — drilldown opener
//   editProject()                   — project edit modal
//   showView()                      — tab navigator
//   projectsTreeState               — shared expand/collapse state
//   allProjects                     — global projects cache
//   setHtmlIfChanged()              — flicker-free DOM write
//
// Functions exposed on window:
//   showActiveList, showProjectedList, loadNeedsAttention,
//   loadBillNowPreview, loadInspectionProjection, loadDashboard,
//   dtreeToggle

(function () {
  // Click handler for the Active Projects tile — shows EXACTLY which projects
  // are counted, so you can spot anything that shouldn't be there. From the
  // list, click any row to open its detail popup, or use the trash button to
  // delete (or move to completed) right from here.
  async function showActiveList() {
    document.getElementById('active-list-body').innerHTML = '<div style="padding:40px;text-align:center"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--text-muted)"></i></div>';
    openModal('active-list-modal');
    try {
      const data = await api('/api/dashboard/active-list');
      const rows = data.projects || [];
      document.getElementById('active-list-body').innerHTML = `
        <div style="padding:14px 18px;background:var(--gray-light);font-size:13px;color:var(--text-muted);margin-bottom:8px">
          <strong style="color:var(--text);font-size:14px">${data.count} project${data.count === 1 ? '' : 's'} counted.</strong>
          Counts only leaf projects with status=active and a real Job (not "Other"). If something here shouldn't be active, click it to open and change its status, or delete it.
        </div>
        <table style="width:100%;font-size:13px">
          <thead><tr style="background:var(--white);border-bottom:1px solid var(--gray-border)">
            <th style="padding:8px 12px;text-align:left">Project</th>
            <th style="padding:8px 12px;text-align:left">Client</th>
            <th style="padding:8px 12px;text-align:left">Parent</th>
            <th style="padding:8px 12px;text-align:left">Job</th>
            <th style="padding:8px 12px;text-align:left">WO #</th>
          </tr></thead>
          <tbody>${rows.map(r => `<tr style="border-bottom:1px solid var(--gray-border);cursor:pointer" onclick="closeModal('active-list-modal');showProjectDetail('${r.id}')">
            <td style="padding:8px 12px;font-weight:600">${esc(r.name)}</td>
            <td style="padding:8px 12px">${esc(r.client_name || '—')}</td>
            <td style="padding:8px 12px;color:var(--text-muted)">${esc(r.parent_name || '—')}</td>
            <td style="padding:8px 12px">${esc(r.job_name || '—')}</td>
            <td style="padding:8px 12px;font-family:monospace">${esc(r.work_order_number || '—')}</td>
          </tr>`).join('') || '<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-muted)">No projects match.</td></tr>'}</tbody>
        </table>`;
    } catch (e) {
      document.getElementById('active-list-body').innerHTML = '<div style="padding:24px;color:var(--danger)">Failed: ' + esc(e.message) + '</div>';
    }
  }

  // Click handler for the Revenue tab Projected Revenue tile. Lists every leaf
  // project that has a projected_revenue value set, grouped by client → contract
  // for readability. Each row links to that project's detail popup. The bottom
  // row totals the column for sanity (should match the tile).
  async function showProjectedList() {
    document.getElementById('projected-list-body').innerHTML = '<div style="padding:40px;text-align:center"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--text-muted)"></i></div>';
    openModal('projected-list-modal');
    try {
      const data = await api('/api/revenue/projected-total');
      const projects = data.projects || [];
      if (!projects.length) {
        document.getElementById('projected-list-body').innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted)">No projects have a projected revenue set yet. Edit a project to add one.</div>';
        return;
      }
      // Group by client for readability
      const byClient = {};
      projects.forEach(p => {
        const c = p.client_name || '(no client)';
        (byClient[c] = byClient[c] || []).push(p);
      });
      let html = `<div style="padding:14px 18px;background:var(--gray-light);font-size:13px;color:var(--text-muted);margin-bottom:8px">
        <strong style="color:var(--text);font-size:14px">${projects.length} project${projects.length !== 1 ? 's' : ''} contributing.</strong>
        Total: <strong style="color:var(--primary)">${fmtMoney(data.total)}</strong>${data.without_projected > 0 ? ` · <span style="color:var(--text-muted)">${data.without_projected} project${data.without_projected !== 1 ? 's' : ''} without a projected value (not counted)</span>` : ''}
      </div>`;
      for (const [client, list] of Object.entries(byClient)) {
        const clientTotal = list.reduce((s, p) => s + (parseFloat(p.projected_revenue) || 0), 0);
        html += `<div style="padding:10px 16px;background:var(--primary-light);font-weight:700;color:var(--primary);display:flex;justify-content:space-between"><span>${esc(client)}</span><span>${fmtMoney(clientTotal)}</span></div>`;
        html += `<table style="width:100%;font-size:13px;border-collapse:collapse">
          <thead><tr style="background:var(--white);border-bottom:1px solid var(--gray-border)">
            <th style="padding:8px 12px;text-align:left;color:var(--text-muted);font-size:11px;text-transform:uppercase">Project</th>
            <th style="padding:8px 12px;text-align:left;color:var(--text-muted);font-size:11px;text-transform:uppercase">Job</th>
            <th style="padding:8px 12px;text-align:left;color:var(--text-muted);font-size:11px;text-transform:uppercase">Status</th>
            <th style="padding:8px 12px;text-align:right;color:var(--text-muted);font-size:11px;text-transform:uppercase">Projected</th>
          </tr></thead>
          <tbody>${list.map(p => {
            const ancestry = [p.grandparent_name, p.parent_name].filter(Boolean).join(' › ');
            return `<tr style="border-bottom:1px solid var(--gray-border);cursor:pointer" onclick="closeModal('projected-list-modal');showProjectDetail('${p.id}')">
              <td style="padding:8px 12px"><div style="font-weight:600">${esc(p.name)}</div>${ancestry ? `<div style="color:var(--text-muted);font-size:11px;margin-top:2px">${esc(ancestry)}</div>` : ''}${p.work_order_number ? `<div style="color:var(--text-muted);font-size:11px;margin-top:2px;font-family:monospace">WO ${esc(p.work_order_number)}</div>` : ''}</td>
              <td style="padding:8px 12px">${esc(p.job_name || '—')}</td>
              <td style="padding:8px 12px">${statusBadge(p.status)}</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:var(--primary)">${fmtMoney(p.projected_revenue)}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>`;
      }
      document.getElementById('projected-list-body').innerHTML = html;
    } catch (e) {
      document.getElementById('projected-list-body').innerHTML = '<div style="padding:24px;color:var(--danger)">Failed: ' + esc(e.message) + '</div>';
    }
  }

  // ─── Needs Attention card ────────────────────────────────────────────────
  // Pulls from the /api/automation/* endpoints in parallel and renders a
  // compact "stuff worth fixing" panel. Only shows when there's actually
  // something flagged (zero alerts → card stays hidden).
  async function loadNeedsAttention() {
    const card = document.getElementById('needs-attention-card');
    const body = document.getElementById('needs-attention-body');
    if (!card || !body) return;

    // Run all checks in parallel — failures on one shouldn't kill the card.
    const settled = await Promise.allSettled([
      api('/api/automation/stale-permits?days=30'),
      api('/api/automation/permits-awaiting-invoice'),
      api('/api/automation/budget-burn?threshold=0.8'),
    ]);
    const stale  = settled[0].status === 'fulfilled' ? (settled[0].value.permits || []) : [];
    const await_ = settled[1].status === 'fulfilled' ? (settled[1].value.permits || []) : [];
    const burns  = settled[2].status === 'fulfilled' ? (settled[2].value.alerts  || []) : [];

    const total = stale.length + await_.length + burns.length;
    if (total === 0) {
      card.style.display = 'none';
      return;
    }
    card.style.display = '';

    // Compact list rendering — each row is one actionable item with a "Go"
    // button that jumps to the relevant view.
    const rows = [];
    for (const p of stale.slice(0, 5)) {
      rows.push({
        icon: 'fa-clock', color: '#F0A500',
        title: `Permit stale ${p.days_in_stage}d in submitted`,
        sub: `${p.client_name || '—'} · ${p.project_name}${p.work_order_number ? ' · WO# ' + p.work_order_number : ''}`,
        action: () => showProjectDetail(p.project_id),
        actionLabel: 'Open',
      });
    }
    for (const p of await_.slice(0, 5)) {
      rows.push({
        icon: 'fa-file-invoice', color: '#1B5FA0',
        title: 'Permit at "billed" stage but no invoice yet',
        sub: `${p.client_name || '—'} · ${p.project_name} · ${fmtMoney(p.expected_revenue || 0)} expected`,
        action: () => showProjectDetail(p.project_id),
        actionLabel: 'Open',
      });
    }
    for (const b of burns.slice(0, 5)) {
      const pct = Math.round((b.burn_ratio || 0) * 100);
      rows.push({
        icon: 'fa-wallet', color: '#DC3545',
        title: `Budget code ${b.code} at ${pct}%`,
        sub: `${b.budget_name || '—'} · ${b.project_name || '—'} · ${fmtMoney(b.billed)} of ${fmtMoney(b.allocated)}`,
        action: () => b.project_id && showProjectDetail(b.project_id),
        actionLabel: 'Open',
      });
    }

    body.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${rows.map((r, i) => `
            <tr style="border-bottom:1px solid var(--gray-border)">
              <td style="padding:10px 14px;width:32px;text-align:center"><i class="fa-solid ${r.icon}" style="color:${r.color}"></i></td>
              <td style="padding:10px 8px">
                <div style="font-weight:500">${esc(r.title)}</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${esc(r.sub)}</div>
              </td>
              <td style="padding:10px 14px;text-align:right">
                <button class="btn btn-sm btn-secondary" data-na-idx="${i}">${esc(r.actionLabel)}</button>
              </td>
            </tr>
          `).join('')}
          ${total > rows.length ? `
            <tr><td colspan="3" style="padding:10px 14px;text-align:center;color:var(--text-muted);font-size:12px">+ ${total - rows.length} more — see automation endpoints for the full list</td></tr>
          ` : ''}
        </tbody>
      </table>
    `;
    // Wire the Open buttons. Inline onclick would need to escape the
    // closure, so we attach handlers after render.
    body.querySelectorAll('button[data-na-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-na-idx'), 10);
        const row = rows[idx];
        if (row && typeof row.action === 'function') row.action();
      });
    });
  }

  // ─── Bill-now preview card ─────────────────────────────────────────────
  async function loadBillNowPreview() {
    const card = document.getElementById('bill-now-card');
    const body = document.getElementById('bill-now-body');
    const totalEl = document.getElementById('bill-now-total');
    if (!card || !body) return;
    let data;
    try {
      data = await api('/api/automation/bill-now-preview');
    } catch (e) {
      card.style.display = 'none';
      return;
    }
    if (!data.by_client || !data.by_client.length) {
      card.style.display = 'none';
      return;
    }
    card.style.display = '';
    totalEl.textContent = `${fmtMoney(data.total_unbilled)} across ${data.project_count} project${data.project_count !== 1 ? 's' : ''}`;
    body.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--gray-light)">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Client</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Projects</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">If billed today</th>
          </tr>
        </thead>
        <tbody>
          ${data.by_client.map(c => `
            <tr style="border-top:1px solid var(--gray-border);cursor:pointer" onclick="showView('billing')">
              <td style="padding:8px 12px;font-weight:500">${esc(c.client_name || '— No client —')}</td>
              <td style="padding:8px 12px;text-align:right;color:var(--text-muted)">${c.projects.length}</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:var(--success,#28A745)">${fmtMoney(c.subtotal)}</td>
            </tr>
          `).join('')}
          <tr style="background:var(--gray-light);border-top:2px solid var(--gray-border);font-weight:600">
            <td style="padding:10px 12px">Total</td>
            <td style="padding:10px 12px;text-align:right">${data.project_count}</td>
            <td style="padding:10px 12px;text-align:right;color:var(--success,#28A745)">${fmtMoney(data.total_unbilled)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  // ─── Inspection revenue projection card ────────────────────────────────
  // RETIRED pending revisit. Loader is now a no-op — leaves the
  // dashboard tile + the projection card in their static
  // "UNDER CONSTRUCTION" state set in the HTML. Skips the
  // /api/automation/psc-rus-projection fetch entirely so the dashboard
  // doesn't pay that round-trip on every page load.
  // To re-enable, restore the body of this function from git history
  // (or the version below this line, which we'd un-comment).
  async function loadInspectionProjection() {
    return;  // retired — see comment above
    /* original body retained for revival:
    const card = document.getElementById('psc-rus-projection-card');
    const body = document.getElementById('psc-rus-projection-body');
    const tile = document.getElementById('s-90d-projection');
    if (!card || !body) return;
    let data;
    try {
      data = await api('/api/automation/psc-rus-projection');
    } catch (e) {
      card.style.display = 'none';
      if (tile) tile.textContent = '—';
      return;
    }
    const rows = data.rows || [];
    if (tile) tile.textContent = fmtMoney(data.total_projected_revenue || 0);
    if (!rows.length) {
      card.style.display = 'none';
      return;
    }
    card.style.display = '';

    // Each umbrella row carries a per-job breakdown (Inspection / RE /
    // Permitting / Other). Render the umbrella headline + projection on top,
    // then the breakdown rows underneath. Other-bucket projects are listed
    // for visibility but show "Not projected" instead of a $ figure.
    body.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--gray-light)">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Engineering Contract / Job</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Hrs (MTD)</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Budget</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">90-Day Projection</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const exhaustBg = r.will_exhaust_budget ? 'background:var(--warning-light);' : '';
            const headline = esc(r.engineering_contract_name || 'Engineering contract');
            const subBits = [esc(r.client_name || '—')];
            if (r.loan_name) subBits.push(`loan: ${esc(r.loan_name)}`);
            subBits.push(`${r.project_count} project${r.project_count !== 1 ? 's' : ''}`);
            const sub = subBits.join(' · ');
            const budgetCell = r.budget_allocated > 0
              ? `<div style="font-weight:600">${fmtMoney(r.budget_remaining)} <span style="font-size:11px;color:var(--text-muted);font-weight:400">left</span></div>
                 <div style="font-size:11px;color:var(--text-muted)">of ${fmtMoney(r.budget_allocated)} total</div>
                 <div style="font-size:11px;color:var(--text-muted)">${fmtMoney(r.billed_to_date)} billed</div>`
              : '—';
            // Umbrella header row
            let html = `<tr style="border-top:2px solid var(--gray-border);${exhaustBg}border-left:3px solid var(--primary,#1B5FA0);background:var(--gray-light)">
              <td style="padding:10px 12px">
                <div style="font-weight:700;font-size:13px">
                  <i class="fa-solid fa-folder-tree" style="color:var(--primary,#1B5FA0);margin-right:6px"></i>${headline}
                  ${r.will_exhaust_budget ? '<span style="margin-left:6px;font-size:10px;color:#e65100;background:#FFE0B2;padding:1px 6px;border-radius:8px;font-weight:600">BUDGET CAP REACHED</span>' : ''}
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${sub}</div>
              </td>
              <td style="padding:10px 12px;text-align:right;font-weight:600">${fmt(r.mtd_hours, 'hrs')}</td>
              <td style="padding:10px 12px;text-align:right">${budgetCell}</td>
              <td style="padding:10px 12px;text-align:right;font-weight:700;color:var(--primary);font-size:14px">${fmtMoney(r.projected_remaining_revenue)}</td>
            </tr>`;
            // Per-job breakdown rows
            for (const b of (r.breakdown || [])) {
              const projCell = b.projectable
                ? `<span style="font-weight:500">${fmtMoney(b.projected_remaining_revenue)}</span>`
                : `<span style="color:var(--text-muted);font-size:11px;font-style:italic">Not projected</span>`;
              html += `<tr style="border-top:1px solid var(--gray-border)">
                <td style="padding:6px 12px 6px 36px;color:var(--text-muted);font-size:12px">
                  <span style="color:var(--text);font-weight:500">${esc(b.job_label)}</span>
                  <span style="margin-left:6px">· ${b.project_count} project${b.project_count !== 1 ? 's' : ''}</span>
                  ${b.billed_to_date > 0 ? `<span style="margin-left:6px">· ${fmtMoney(b.billed_to_date)} billed</span>` : ''}
                </td>
                <td style="padding:6px 12px;text-align:right;font-size:12px">${fmt(b.mtd_hours, 'hrs')}</td>
                <td style="padding:6px 12px;text-align:right;color:var(--text-muted);font-size:11px">—</td>
                <td style="padding:6px 12px;text-align:right;font-size:12px">${projCell}</td>
              </tr>`;
            }
            return html;
          }).join('')}
          <tr style="background:var(--gray-light);border-top:2px solid var(--gray-border);font-weight:700">
            <td style="padding:10px 12px" colspan="3">Total 90-day projection</td>
            <td style="padding:10px 12px;text-align:right;color:var(--primary);font-size:14px">${fmtMoney(data.total_projected_revenue)}</td>
          </tr>
        </tbody>
      </table>
    `;
    */
  }

  async function loadDashboard() {
    // Run the Needs Attention + Inspection projection cards in parallel with
    // the dashboard load. Wrapped in try/catch so non-admin viewers (who
    // get 403 on the automation endpoints) don't see an error toast.
    loadNeedsAttention().catch(() => {});
    loadInspectionProjection().catch(() => {});
    loadBillNowPreview().catch(() => {});

    try {
    // Initialize dashboard period controls on first load.
    const yEl = document.getElementById('dash-year');
    const pEl = document.getElementById('dash-period');
    const mEl = document.getElementById('dash-month');
    if (yEl && yEl.options.length === 0) {
      const cy = new Date().getFullYear();
      for (let y = cy + 1; y >= cy - 3; y--) {
        const o = new Option(y, y);
        if (y === cy) o.selected = true;
        yEl.add(o);
      }
    }
    if (mEl && !mEl.value) {
      mEl.value = String(new Date().getMonth() + 1);
    }
    // Show/hide month picker based on period mode
    const period = pEl?.value || 'ytd';
    if (mEl) mEl.style.display = period === 'month' ? '' : 'none';

    // Build API query
    const params = new URLSearchParams();
    params.set('period', period);
    if (yEl?.value) params.set('year', yEl.value);
    if (period === 'month' && mEl?.value) params.set('month', mEl.value);

    const d = await api('/api/dashboard?' + params.toString());

    // Update tile labels to reflect the chosen period
    const periodLabel = d.period?.label || 'YTD';
    document.getElementById('dash-period-label').textContent = `Project overview · ${periodLabel}`;
    document.getElementById('s-period-label').textContent = period === 'month'
      ? `Earned ${periodLabel}`
      : 'Earned YTD';
    document.getElementById('s-year-label').textContent = `Year (${d.period?.year || new Date().getFullYear()})`;

    document.getElementById('s-active').textContent = d.active_projects;
    document.getElementById('s-month-rev').textContent = fmtMoney(d.month_revenue);
    document.getElementById('s-ytd').textContent = fmtMoney(d.ytd_revenue);

    const tbody = document.getElementById('dash-projects-body');
    // The Active Projects card was removed from the dashboard (lives only on
    // the Projects tab now). The KPI tiles above still need updating, but
    // the project-tree render below has nothing to render into — bail.
    if (!tbody) return;
    const all = d.recent_projects || [];
    if (!all.length) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>No active projects</p></div></td></tr>'; return; }

    // Build lookup and children map for unlimited depth
    const byId = {};
    all.forEach(p => byId[p.id] = p);
    const childrenOf = {};
    all.forEach(p => { if (p.parent_id) { (childrenOf[p.parent_id] = childrenOf[p.parent_id] || []).push(p); } });
    const roots = all.filter(p => !p.parent_id || !byId[p.parent_id]);

    // Build rows recursively — use server-computed ytd_revenue. Reads
    // projectsTreeState so user-expanded nodes survive polling re-renders.
    function buildRows(projects, depth, parentGroupClass, parentExpanded) {
      let html = '';
      for (const p of projects) {
        const indent = depth * 28;
        const prefix = depth > 0 ? '<span style="color:var(--text-muted);margin-right:4px">└</span>' : '';
        const kids = childrenOf[p.id] || [];
        const expandable = kids.length > 0;
        const groupKey = 'dt-' + p.id;
        const chevId = 'dc-' + p.id;
        const bg = depth === 0 ? '' : depth % 2 === 1 ? 'background:var(--gray-light)' : 'background:var(--row-alt)';

        // Visibility flows from parent's expanded state (root rows always visible).
        const isVisible = depth === 0 || parentExpanded;
        const thisExpanded = projectsTreeState.isExpanded(p.id);
        const display = !isVisible ? 'display:none;' : '';
        const inlineStyle = `cursor:pointer;${display}${bg}`;
        const cls = parentGroupClass
          ? `class="dtree dtree-${parentGroupClass}"`
          : '';

        const ytd = parseFloat(p.ytd_revenue) || 0;
        const hours = parseFloat(p.actual_hours) || 0;
        const area = p.concentrator_area ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px">(${esc(p.concentrator_area)})</span>` : '';
        const badge = expandable ? `<span style="font-size:10px;color:var(--primary);margin-left:6px;font-weight:600;background:var(--primary-light);padding:1px 6px;border-radius:10px">${kids.length}</span>` : '';
        const chevRotation = expandable && thisExpanded ? 'transform:rotate(90deg);' : '';
        const chevron = expandable
          ? `<span onclick="event.stopPropagation();dtreeToggle('${p.id}','${groupKey}','${chevId}')" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;cursor:pointer;margin-right:4px;background:var(--gray-light);border:1px solid var(--gray-border)"><i class="fa-solid fa-chevron-right" id="${chevId}" style="font-size:11px;color:var(--text-muted);transition:transform .2s;${chevRotation}"></i></span>`
          : (depth === 0 ? '<span style="width:32px;display:inline-block"></span>' : '');

        html += `<tr ${cls} onclick="showProjectDetail('${p.id}')" style="${inlineStyle}">
          <td class="td-name" style="padding-left:${12 + indent}px">${chevron}${prefix}${esc(p.name)}${area}${badge}</td>
          <td>${esc(p.client_name || '—')}</td>
          <td class="td-mono">${esc(p.work_order_number || '—')}</td>
          <td>${typeBadge(p.project_type)}</td>
          <td style="font-weight:600;color:var(--primary)">${fmtMoney(ytd)}${hours > 0 ? '<br><span style="font-size:10px;color:var(--text-muted);font-weight:400">' + fmt(hours, 'hrs') + '</span>' : ''}</td>
          <td>${statusBadge(p.status)}</td>
          <td><button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();editProject('${p.id}')"><i class="fa-solid fa-pen"></i></button></td>
        </tr>`;

        if (expandable) {
          html += buildRows(kids, depth + 1, groupKey, thisExpanded);
        }
      }
      return html;
    }

    // Skip the DOM write if the rendered HTML is identical to last tick.
    // Avoids the destroy+recreate flicker that closed open dropdowns and
    // wiped focus/hover state inside the dashboard tree.
    setHtmlIfChanged(tbody, buildRows(roots, 0, null, true));
    } catch (err) {
      console.error('[loadDashboard] failed:', err);
      if (window.LFS && window.LFS.toast) {
        window.LFS.toast.error('Dashboard failed to load: ' + (err.message || 'Unknown error'));
      }
    }
  }

  // Dashboard tree toggle. Dashboard-specific dt-/dc- prefixes avoid
  // colliding with the Projects view's pt-/pc- ids when both trees
  // might co-exist in the DOM. See makeTreeToggle in tree_state.js.
  const dtreeToggle = makeTreeToggle({
    state: projectsTreeState,
    chevIdPrefix: 'dc-',
    groupKeyPrefix: 'dt-',
    rowClassPrefix: 'dtree-',
  });

  window.showActiveList = showActiveList;
  window.showProjectedList = showProjectedList;
  window.loadNeedsAttention = loadNeedsAttention;
  window.loadBillNowPreview = loadBillNowPreview;
  window.loadInspectionProjection = loadInspectionProjection;
  window.loadDashboard = loadDashboard;
  window.dtreeToggle = dtreeToggle;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  let _dashStaleTimer = null;
  let _dashStale = false;

  function _dashDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'dashboard') {
      _dashStale = true;
      return;
    }
    clearTimeout(_dashStaleTimer);
    _dashStaleTimer = setTimeout(loadDashboard, 500);
  }

  const _dashSseEvents = [
    'project_added', 'project_updated', 'project_deleted',
    'time_entry_added', 'time_entry_updated', 'time_entry_deleted', 'time_entries_bulk_deleted',
    'invoice_created', 'invoice_voided', 'batch_committed', 'batch_voided',
  ];
  _dashSseEvents.forEach(ev => document.addEventListener('sse:' + ev, _dashDebounce));

  (window._showViewHooks = window._showViewHooks || []).push(function(view) {
    if (view === 'dashboard' && _dashStale) {
      _dashStale = false;
      clearTimeout(_dashStaleTimer);
      _dashStaleTimer = setTimeout(loadDashboard, 100);
    }
  });
})();
