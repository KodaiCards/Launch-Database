// public/js/revenue_tab.js — Admin Revenue tab.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Three-section dashboard for revenue analytics:
//   - Period bar (YTD button + 12 monthly tiles).
//   - KPI tiles + monthly trend chart.
//   - Tables: Revenue by Client, Project Detail (hierarchical
//     tree), and Unbilled (with Bill... action per row).
//
// State on window:
//   revSelectedMonth  — null when YTD is selected, otherwise 1-12.
//                       Read by permits_tab.js (advancePermitFromPopup),
//                       showProjectDetail, and showBillingReport.
//
// Globals this module reads:
//   api(), esc(), fmt(), fmtMoney()  — global helpers
//   typeBadge(), statusBadge()       — global badge renderers
//   MONTH_NAMES, MONTH_FULL          — month-label constants
//   projectsTreeState                — shared tree expand state
//   allProjects                      — global cache (for cascade collapse)
//   showProjectDetail()              — drilldown opener
//   showProjectedList()              — projected revenue tile drilldown
//   markBilled()                     — bill-now flow opener
//
// Functions exposed on window:
//   selectRevMonth, renderRevenueDetail, rtreeToggle, loadRevenue

(function () {
  // Bind state on window so still-inline callers (showProjectDetail,
  // showBillingReport) and other modules (permits_tab) keep working.
  if (typeof window.revSelectedMonth === 'undefined') window.revSelectedMonth = null; // null = YTD
  let revMonthlySummary = [];

  function selectRevMonth(month) {
    window.revSelectedMonth = month;
    loadRevenue();
  }

  // Render the revenue project-detail table as a hierarchical tree.
  // Parent rows show summed period_hours and earned of all descendants
  // so collapsed view still shows meaningful totals.
  function renderRevenueDetail(details) {
    const tbody = document.getElementById('rev-detail-body');
    if (!details.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No project activity for this period</td></tr>';
      return;
    }

    const byId = {};
    details.forEach(p => byId[p.id] = p);
    const childrenOf = {};
    details.forEach(p => { if (p.parent_id && byId[p.parent_id]) { (childrenOf[p.parent_id] = childrenOf[p.parent_id] || []).push(p); } });
    const roots = details.filter(p => !p.parent_id || !byId[p.parent_id]);

    function sumTree(p) {
      let hrs = parseFloat(p.period_hours) || 0;
      let earned = parseFloat(p.earned) || 0;
      for (const kid of (childrenOf[p.id] || [])) {
        const s = sumTree(kid);
        hrs += s.hrs; earned += s.earned;
      }
      return { hrs, earned };
    }

    function buildRevRows(projects, depth, parentGroupClass, parentExpanded) {
      let html = '';
      for (const p of projects) {
        const indent = depth * 28;
        const prefix = depth > 0 ? '<span style="color:var(--text-muted);margin-right:4px">└</span>' : '';
        const kids = childrenOf[p.id] || [];
        const expandable = kids.length > 0;
        const groupKey = 'rv-' + p.id;
        const chevId = 'rc-' + p.id;
        const bg = depth === 0 ? '' : depth % 2 === 1 ? 'background:var(--gray-light)' : 'background:var(--row-alt)';

        const isVisible = depth === 0 || parentExpanded;
        const thisExpanded = projectsTreeState.isExpanded(p.id);

        const trClass = ['clickable'];
        if (parentGroupClass) trClass.push('rtree', 'rtree-' + parentGroupClass);
        const trStyle = parentGroupClass ? `${!isVisible ? 'display:none;' : ''}${bg}` : bg;
        const trAttrs = `class="${trClass.join(' ')}" style="${trStyle}"`;
        const totals = sumTree(p);
        const earnedColor = totals.earned > 0 ? 'var(--primary)' : 'var(--text-muted)';
        const badge = expandable ? `<span style="font-size:10px;color:var(--primary);margin-left:6px;font-weight:600;background:var(--primary-light);padding:1px 6px;border-radius:10px">${kids.length}</span>` : '';
        const chevRotation = expandable && thisExpanded ? 'transform:rotate(90deg);' : '';
        const chevron = expandable
          ? `<span onclick="event.stopPropagation();rtreeToggle('${p.id}','${groupKey}','${chevId}')" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;cursor:pointer;margin-right:4px;background:var(--gray-light);border:1px solid var(--gray-border)"><i class="fa-solid fa-chevron-right" id="${chevId}" style="font-size:11px;color:var(--text-muted);transition:transform .2s;${chevRotation}"></i></span>`
          : (depth === 0 ? '<span style="width:32px;display:inline-block"></span>' : '');

        html += `<tr ${trAttrs} onclick="showProjectDetail('${p.id}')">
          <td class="td-name" style="padding-left:${12 + indent}px">${chevron}${prefix}${esc(p.name)}${badge}</td>
          <td>${esc(p.client_name || '—')}</td>
          <td class="td-mono">${esc(p.work_order_number || '—')}</td>
          <td>${typeBadge(p.project_type)}</td>
          <td>${fmt(totals.hrs, 'hrs')}</td>
          <td style="font-weight:600;color:${earnedColor}">${fmtMoney(totals.earned)}</td>
          <td>${statusBadge(p.status)}</td>
        </tr>`;
        if (expandable) html += buildRevRows(kids, depth + 1, groupKey, thisExpanded);
      }
      return html;
    }

    tbody.innerHTML = buildRevRows(roots, 0, null, true);
  }

  // Revenue tree toggle — uses shared projectsTreeState state. Same pattern
  // as dtreeToggle, just operates on the rtree-/rc- DOM hierarchy.
  function rtreeToggle(projectId, groupKey, chevId) {
    const wasExpanded = projectsTreeState.isExpanded(projectId);
    if (wasExpanded) {
      projectsTreeState.collapse(projectId);
      const list = (typeof allProjects !== 'undefined' && allProjects) ? allProjects : [];
      const collectDescendants = (parentId, acc) => {
        list.filter(p => p.parent_id === parentId).forEach(c => {
          acc.add(c.id);
          collectDescendants(c.id, acc);
        });
      };
      const descs = new Set();
      collectDescendants(projectId, descs);
      projectsTreeState.collapseAll([...descs]);
    } else {
      projectsTreeState.expand(projectId);
    }

    const rows = document.querySelectorAll('.rtree-' + groupKey);
    const chev = document.getElementById(chevId);
    rows.forEach(r => {
      r.style.display = wasExpanded ? 'none' : 'table-row';
      if (wasExpanded) {
        const nestedChevs = r.querySelectorAll('[id^="rc-"]');
        nestedChevs.forEach(nc => {
          nc.style.transform = 'rotate(0deg)';
          const nestedKey = 'rv-' + nc.id.replace('rc-', '');
          document.querySelectorAll('.rtree-' + nestedKey).forEach(n => n.style.display = 'none');
        });
      }
    });
    if (chev) chev.style.transform = wasExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
  }

  async function loadRevenue() {
    const y = document.getElementById('rev-year').value;
    const m = window.revSelectedMonth;
    const isYTD = m === null;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    // Period label
    document.getElementById('rev-period-label').textContent = isYTD
      ? `Year-to-Date ${y}` : `${MONTH_FULL[(m || 1) - 1]} ${y}`;

    // YTD button state
    document.getElementById('rev-ytd-btn').className = 'btn btn-sm ' + (isYTD ? 'btn-primary' : 'btn-secondary');

    // Load all data
    const [monthly, byClient, details, unbilled, projectedTotal] = await Promise.all([
      api('/api/revenue/monthly-summary?year=' + y),
      api('/api/revenue/by-client?year=' + y + (m ? '&month=' + m : '')),
      api('/api/revenue/details?year=' + y + (m ? '&month=' + m : '')),
      api('/api/revenue/unbilled'),
      api('/api/revenue/projected-total')
    ]);
    revMonthlySummary = monthly;

    // ── Month selector bar ──
    const bar = document.getElementById('rev-month-bar');
    bar.innerHTML = monthly.map((mo, i) => {
      const mn = i + 1;
      const earned = parseFloat(mo.earned) || 0;
      const isSelected = window.revSelectedMonth === mn;
      const isFuture = parseInt(y) === now.getFullYear() && mn > currentMonth;
      return `<div onclick="selectRevMonth(${mn})" style="
        background:${isSelected ? 'var(--primary)' : 'var(--white)'};
        color:${isSelected ? '#fff' : isFuture ? 'var(--text-muted)' : 'var(--text)'};
        border:1px solid ${isSelected ? 'var(--primary)' : 'var(--gray-border)'};
        border-radius:8px;padding:8px 4px;text-align:center;cursor:pointer;
        opacity:${isFuture ? '0.5' : '1'};transition:all .15s;
      ">
        <div style="font-size:11px;font-weight:600">${MONTH_NAMES[i]}</div>
        <div style="font-size:13px;font-weight:700;margin-top:2px">${earned > 0 ? fmtMoney(earned) : '—'}</div>
      </div>`;
    }).join('');

    // ── Stats ──
    const totalExpected = byClient.reduce((s, c) => s + parseFloat(c.expected_total || 0), 0);
    const totalEarned = byClient.reduce((s, c) => s + parseFloat(c.earned_total || 0), 0);
    const totalBilled = byClient.reduce((s, c) => s + parseFloat(c.billed_total || 0), 0);
    const totalHours = byClient.reduce((s, c) => s + parseFloat(c.total_hours || 0), 0);
    const totalUnbilled = unbilled.reduce((s, p) => s + parseFloat(p.earned_amount || 0), 0);

    // YTD totals from monthly summary
    const ytdEarned = monthly.reduce((s, mo) => s + (parseFloat(mo.earned) || 0), 0);
    const ytdBilled = monthly.reduce((s, mo) => s + (parseFloat(mo.billed) || 0), 0);
    const ytdHours = monthly.reduce((s, mo) => s + (parseFloat(mo.hours) || 0), 0);

    const periodLabel = isYTD ? 'YTD' : MONTH_NAMES[(m || 1) - 1];
    const projTotal = parseFloat(projectedTotal?.total) || 0;
    document.getElementById('rev-stats').innerHTML = `
      <div class="stat-card accent">
        <div class="stat-label">${periodLabel} Earned</div>
        <div class="stat-value">${fmtMoney(isYTD ? ytdEarned : totalEarned)}</div>
        <div class="stat-sub">${fmt(isYTD ? ytdHours : totalHours, 'hrs')} worked</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${periodLabel} Billed</div>
        <div class="stat-value" style="color:var(--success)">${fmtMoney(isYTD ? ytdBilled : totalBilled)}</div>
      </div>
      <div class="stat-card ${totalUnbilled > 0 ? 'warn' : ''}">
        <div class="stat-label">Unbilled Completed</div>
        <div class="stat-value">${fmtMoney(totalUnbilled)}</div>
        <div class="stat-sub">${unbilled.length} project${unbilled.length !== 1 ? 's' : ''}</div>
      </div>
      ${isYTD && projTotal > 0 ? `<div class="stat-card" onclick="showProjectedList()" style="cursor:pointer" title="Click to see which projects make up this number">
        <div class="stat-label">Projected Revenue</div>
        <div class="stat-value">${fmtMoney(projTotal)}</div>
      </div>` : ''}
    `;

    // ── Monthly trend chart ──
    const maxEarned = Math.max(...monthly.map(mo => parseFloat(mo.earned) || 0), 1);
    document.getElementById('rev-trend-body').innerHTML = monthly.map((mo, i) => {
      const earned = parseFloat(mo.earned) || 0;
      const billed = parseFloat(mo.billed) || 0;
      const pct = (earned / maxEarned * 100);
      const mn = i + 1;
      const isSelected = window.revSelectedMonth === mn;
      const isFuture = parseInt(y) === now.getFullYear() && mn > currentMonth;
      return `<div onclick="selectRevMonth(${mn})" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;opacity:${isFuture ? '0.3' : '1'}">
        <span style="font-size:10px;font-weight:600;color:var(--text-muted)">${earned > 0 ? fmtMoney(earned) : ''}</span>
        <div style="width:100%;display:flex;flex-direction:column;justify-content:flex-end;height:80px">
          <div style="width:100%;background:${isSelected ? 'var(--primary)' : billed > 0 ? 'var(--success)' : 'var(--chart-bar)'};border-radius:4px 4px 0 0;min-height:${earned > 0 ? '4' : '0'}px;height:${pct}%;transition:height .3s"></div>
        </div>
        <span style="font-size:10px;font-weight:${isSelected ? '700' : '500'};color:${isSelected ? 'var(--primary)' : 'var(--text-muted)'}">${MONTH_NAMES[i]}</span>
      </div>`;
    }).join('');

    // ── Revenue by client table ──
    document.getElementById('rev-client-title').textContent = isYTD ? 'Revenue by Client — YTD' : `Revenue by Client — ${MONTH_FULL[(m || 1) - 1]}`;
    const clientRows = byClient.filter(c => parseFloat(c.project_count) > 0);
    document.getElementById('rev-client-body').innerHTML = clientRows.length ? clientRows.map(c => `
      <tr>
        <td class="td-name">${esc(c.client_name)}</td>
        <td>${c.project_count}</td>
        <td>${fmt(parseFloat(c.total_hours || 0), 'hrs')}</td>
        <td style="font-weight:600;color:var(--primary)">${fmtMoney(c.earned_total)}</td>
        <td style="color:var(--success)">${fmtMoney(c.billed_total)}</td>
      </tr>`).join('') + `<tr style="background:var(--gray-light);font-weight:700">
        <td>Total</td><td>${clientRows.reduce((s, c) => s + parseInt(c.project_count || 0), 0)}</td>
        <td>${fmt(totalHours, 'hrs')}</td>
        <td style="color:var(--primary)">${fmtMoney(totalEarned)}</td><td style="color:var(--success)">${fmtMoney(totalBilled)}</td>
      </tr>` : '<tr><td colspan="5" class="empty-state">No revenue data for this period</td></tr>';

    // ── Project detail table (hierarchical with expand/collapse) ──
    document.getElementById('rev-detail-title').textContent = isYTD ? 'Project Detail — YTD' : `Project Detail — ${MONTH_FULL[(m || 1) - 1]}`;
    renderRevenueDetail(details);

    // ── Unbilled table ──
    document.getElementById('unbilled-body').innerHTML = unbilled.length ? unbilled.map(p => {
      const kindTag = p.bill_kind === 'in_progress'
        ? '<span style="background:var(--warning-light);border:1px solid var(--warning);color:var(--warning-text);padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">In progress</span>'
        : '<span style="background:var(--primary-light);color:var(--primary);padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">Completed</span>';
      return `<tr>
        <td class="td-name">${esc(p.name)} ${kindTag}</td>
        <td>${esc(p.client_name || '—')}</td>
        <td>${typeBadge(p.project_type)}</td>
        <td>${p.completed_date ? new Date(p.completed_date + 'T00:00:00').toLocaleDateString() : (p.bill_kind === 'in_progress' ? 'Active' : '—')}</td>
        <td style="font-weight:600">${fmtMoney(p.earned_amount || 0)}</td>
        <td><button class="btn btn-sm btn-success" onclick="markBilled('${p.id}')"><i class="fa-solid fa-check"></i> Bill...</button></td>
      </tr>`;
    }).join('') : '<tr><td colspan="6" class="empty-state" style="padding:24px;text-align:center">No unbilled work</td></tr>';
  }

  window.selectRevMonth = selectRevMonth;
  window.renderRevenueDetail = renderRevenueDetail;
  window.rtreeToggle = rtreeToggle;
  window.loadRevenue = loadRevenue;
})();
