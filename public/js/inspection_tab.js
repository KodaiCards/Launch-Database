// public/js/inspection_tab.js — RUS tab loader.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
// Path B (2026-05-04): renamed from "PSC RUS" to "RUS" — the tab now
// scopes by engineering_contracts.program='rus' across any client, not
// PSC specifically.
//
// Renders the RUS-program scope view: KPI tiles + per-project rows with
// hours/revenue rollup + ongoing toggle + edit/detail actions.
//
// Globals this module reads:
//   api(), esc()                  — global helpers
//   fmtHours, fmtMoney            — global formatters
//   statusBadge()                 — global status pill renderer
//   editProject, showProjectDetail — global modal openers (still inline)
//
// Functions exposed on window:
//   loadInspection, toggleOngoing

(function () {
  async function loadInspection() {
    // Default the month picker to the current month on first load.
    const monthInput = document.getElementById('insp-month');
    if (monthInput && !monthInput.value) {
      const now = new Date();
      monthInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    }
    const period = document.getElementById('insp-period').value;
    const month = monthInput?.value || '';
    const statusFilter = document.getElementById('insp-status')?.value || '';
    let qs = period === 'month' && month ? `?period=month&month=${month}` : `?period=ytd`;
    if (statusFilter) qs += `&status=${encodeURIComponent(statusFilter)}`;

    let data;
    try {
      data = await api('/api/inspection' + qs);
    } catch (e) {
      document.getElementById('inspection-body').innerHTML =
        `<tr><td colspan="9" class="empty-state" style="color:var(--danger)">Failed to load: ${esc(e.message)}</td></tr>`;
      return;
    }

    // KPI tiles
    const t = data.totals || {};
    const periodLabel = period === 'month'
      ? new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      : 'Year to Date';
    document.getElementById('insp-tile-hours').textContent = fmtHours(t.hours || 0);
    document.getElementById('insp-tile-hours-sub').textContent = periodLabel;
    document.getElementById('insp-tile-revenue').textContent = fmtMoney(t.revenue || 0);
    document.getElementById('insp-tile-revenue-sub').textContent = periodLabel;
    document.getElementById('insp-tile-projects').textContent = t.active_projects || 0;
    document.getElementById('insp-tile-inspectors').textContent = t.inspector_count || 0;

    // Project rows
    const tbody = document.getElementById('inspection-body');
    if (!data.projects?.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="fa-solid fa-helmet-safety"></i><p>No RUS-program projects with activity${period==='month'?' for '+periodLabel:''}.</p><p style="font-size:12px;color:var(--text-muted)">Any active project under an engineering contract whose program is set to RUS will surface here once it has logged hours, regardless of job team.</p></td></tr>`;
      return;
    }
    tbody.innerHTML = data.projects.map(p => `
      <tr style="${p.is_ongoing ? 'background:rgba(253,126,20,0.05)' : ''}">
        <td>
          <div style="font-weight:600">${esc(p.name)}</div>
          <div style="font-size:11px;color:var(--text-muted)">${esc(p.job_name || '—')}</div>
        </td>
        <td>${esc(p.client_name || '—')}</td>
        <td style="font-family:monospace;font-size:12px">${esc(p.work_order_number || '—')}</td>
        <td>${esc(p.service_area || '—')}</td>
        <td style="text-align:right;font-weight:600">${fmtHours(p.hours_in_period)}</td>
        <td style="text-align:right;font-weight:600;color:var(--success)">${fmtMoney(p.revenue_in_period)}</td>
        <td style="text-align:center">
          <input type="checkbox" ${p.is_ongoing ? 'checked' : ''}
            onchange="toggleOngoing('${p.id}', this.checked)"
            title="Ongoing projects roll over month-to-month and don't auto-close until you mark them complete">
        </td>
        <td>${statusBadge(p.status)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-icon btn-secondary" onclick="editProject('${p.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm btn-icon btn-secondary" onclick="showProjectDetail('${p.id}')" title="Details"><i class="fa-solid fa-eye"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // Toggle ongoing flag — updates the row inline via the API.
  async function toggleOngoing(projectId, isOngoing) {
    try {
      await api(`/api/projects/${projectId}/ongoing`, 'PUT', { is_ongoing: isOngoing });
      loadInspection();
    } catch (e) {
      alert('Failed: ' + e.message);
      loadInspection();  // restore checkbox to actual server state
    }
  }

  window.loadInspection = loadInspection;
  window.toggleOngoing = toggleOngoing;
})();
