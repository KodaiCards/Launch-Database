// public/js/hours_tab.js — Admin Hours tab + time-entry modal.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Owns the entire Hours tab and the time-entry modal flow:
//   - loadHours: 3-mode renderer (calendar / project tree / flat
//     groupBy). Calendar grid colors days red/yellow/green based on
//     whether a weekday has any hours; click an empty past day to
//     open the create modal pre-filled with that date, click a day
//     with entries to open a per-day detail overlay.
//   - htreeToggle / restoreHrsExpandedState: tree expand/collapse
//     against the htree-/hc- DOM hierarchy, with state persisted in
//     hoursTreeState so polling re-renders survive open sections.
//     htreeToggle is also called from the Billing tab's invoice
//     history tree (same hierarchy convention).
//   - openTimeEntryModal / openTimeEntryModalForDate /
//     openCalendarDayDetail: entry-points into the time-entry modal.
//   - openEditTimeEntryModal: edit existing entry, sourced from the
//     module-internal _hoursEntriesById map populated by loadHours.
//   - viewTimeEntryHistory: opens the audit-detail drawer for the
//     entry currently in the modal.
//   - saveTimeEntry: create-or-update against /api/time-entries.
//   - deleteTimeEntry / deleteAllHoursForStaff: soft-delete with
//     undo bar surfaced via showUndoBar() and the server-supplied
//     undo_token.
//
// Globals this module reads:
//   api(), esc(), fmt(), fmtMoney()       — global helpers
//   typeBadge(), TYPE_LABELS              — type rendering
//   hoursTreeState                        — shared tree expand state
//   renderHeldTimecardsPanel()            — held_timecards module
//   showUndoBar()                         — undo_bar module
//   viewAuditDetail()                     — audit drawer (still inline)
//   allProjects                           — global projects cache
//   loadProjects(), loadDashboard()       — neighbor tab refreshers
//   openModal(), closeModal()             — global modal helpers
//
// Functions exposed on window:
//   loadHours, htreeToggle, restoreHrsExpandedState,
//   openTimeEntryModal, openTimeEntryModalForDate,
//   openCalendarDayDetail, openEditTimeEntryModal,
//   viewTimeEntryHistory, saveTimeEntry, deleteTimeEntry,
//   deleteAllHoursForStaff, showHoursTypeBreakdown

(function () {
  // Entry lookup populated by loadHours() so the pencil-icon click can hand
  // the full row to openEditTimeEntryModal without re-fetching.
  const _hoursEntriesById = new Map();

  async function loadHours() {
    const period = document.getElementById('hrs-period')?.value || 'month';
    const m = document.getElementById('hrs-month').value;
    const y = document.getElementById('hrs-year').value;
    // Hide month picker in YTD mode
    const mEl = document.getElementById('hrs-month');
    if (mEl) mEl.style.display = period === 'ytd' ? 'none' : '';

    // Build query — month+year if month mode, year only for YTD
    let qs;
    if (period === 'ytd') {
      qs = `year=${y}`;
    } else {
      qs = `month=${m}&year=${y}`;
    }
    let entries = await api(`/api/time-entries?${qs}`);
    const periodLabel = period === 'ytd'
      ? `YTD ${y}`
      : new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('hrs-report-title').textContent = `Hours Report — ${periodLabel}`;

    const total = entries.reduce((s, e) => s + parseFloat(e.hours), 0);
    const byType = {};
    entries.forEach(e => { byType[e.project_type] = (byType[e.project_type] || 0) + parseFloat(e.hours); });
    const staffCount = new Set(entries.map(e => e.staff_name).filter(Boolean)).size;
    document.getElementById('hrs-stats').innerHTML = [
      `<div class="stat-card accent"><div class="stat-label">Total Hours</div><div class="stat-value">${fmt(total, 'hrs')}</div><div class="stat-sub">${staffCount} staff member${staffCount !== 1 ? 's' : ''}</div></div>`,
      ...Object.entries(byType).map(([t, h]) => `<div class="stat-card" style="cursor:pointer" onclick="showHoursTypeBreakdown('${esc(t)}','${esc(TYPE_LABELS[t] || t)}')" title="Click to see who logged these hours"><div class="stat-label">${TYPE_LABELS[t] || t}</div><div class="stat-value">${fmt(h, 'hrs')}</div></div>`)
    ].join('');

    const container = document.getElementById('hours-tree-body');
    const grouped = document.getElementById('hours-grouped-body');
    const groupBy = document.getElementById('hrs-groupby')?.value || 'project';

    // Held timecards: rows with no real project. Surface them in the warning
    // panel above the tree and filter them out of the regular entries list.
    // Stash held rows in the entry-by-id map up front, BEFORE the tree-
    // rendering loop replaces it; the held panel's [pencil] button looks up
    // by id, and skipping this leaves held rows un-editable.
    const heldEntries = entries.filter(e => !e.project_id);
    _hoursEntriesById.clear();
    for (const e of heldEntries) _hoursEntriesById.set(String(e.id), e);
    if (typeof renderHeldTimecardsPanel === 'function') renderHeldTimecardsPanel(heldEntries);
    entries = entries.filter(e => !!e.project_id);
    // Calendar / non-project group-by branches return before reaching the
    // project-tree loop that normally populates the map. Pre-populate here
    // so openCalendarDayDetail() can look up entries regardless of groupBy.
    for (const e of entries) _hoursEntriesById.set(String(e.id), e);

    if (!entries.length) {
      container.style.display = '';
      if (grouped) grouped.style.display = 'none';
      container.innerHTML = '<div class="empty-state" style="padding:40px"><i class="fa-regular fa-clock"></i><p>No hours logged for this period</p></div>';
      return;
    }

    // Calendar grid: month view with one cell per day, hours total per day,
    // empty days highlighted in red so missing time entries are obvious.
    // YTD mode falls back to the table view (calendar over a full year is
    // too dense to be useful at a glance).
    if (groupBy === 'calendar' && period !== 'ytd') {
      container.style.display = 'none';
      grouped.style.display = '';
      const yr = parseInt(y, 10);
      const mo = parseInt(m, 10);  // 1-12
      const firstDay = new Date(yr, mo - 1, 1);
      const lastDay = new Date(yr, mo, 0);
      const daysInMonth = lastDay.getDate();
      const firstWeekday = firstDay.getDay();  // 0=Sun
      // Bucket hours per YYYY-MM-DD in business-tz (entry_date already that)
      const byDay = {};
      const entriesByDay = {};
      for (const e of entries) {
        const k = String(e.entry_date).slice(0, 10);
        byDay[k] = (byDay[k] || 0) + parseFloat(e.hours || 0);
        (entriesByDay[k] = entriesByDay[k] || []).push(e);
      }
      let html = `<div style="padding:14px">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px;font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;text-align:center">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">`;
      // Pad with empty cells for days before the 1st
      for (let i = 0; i < firstWeekday; i++) html += `<div style="min-height:78px"></div>`;
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${yr}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hours = byDay[dateKey] || 0;
        const dayOfWeek = (firstWeekday + d - 1) % 7;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = (() => {
          const t = new Date();
          return t.getFullYear() === yr && (t.getMonth() + 1) === mo && t.getDate() === d;
        })();
        // Highlight: weekday with no hours = danger tint (likely forgotten),
        // weekday with low hours = warning tint, normal = success tint,
        // today gets a primary border. All via the token system so dark
        // mode + custom themes get the right shades automatically.
        let bg = 'var(--surface-2)', border = '1px solid var(--gray-border)';
        if (!isWeekend && hours === 0) { bg = 'var(--danger-light)'; }
        else if (!isWeekend && hours < 4) { bg = 'var(--warning-light)'; }
        else if (hours > 0) { bg = 'var(--success-light)'; }
        if (isToday) border = '2px solid var(--primary)';
        const isFuture = (() => {
          const cellD = new Date(yr, mo - 1, d);
          const today = new Date(); today.setHours(0, 0, 0, 0);
          return cellD > today;
        })();
        if (isFuture) { bg = 'var(--surface-1)'; }
        const entryCount = (entriesByDay[dateKey] || []).length;
        // Future cells are read-only (nothing to edit); cells with entries
        // are click-to-drilldown; empty past cells offer "+ Add" via the
        // existing time-entry modal pre-filled with the picked date.
        const isClickable = !isFuture;
        const cursor = isClickable ? 'cursor:pointer' : 'cursor:default';
        const handler = isFuture
          ? ''
          : entryCount > 0
            ? `onclick="openCalendarDayDetail('${dateKey}')"`
            : `onclick="openTimeEntryModalForDate('${dateKey}')"`;
        html += `<div ${handler} style="background:${bg};border:${border};border-radius:6px;padding:8px;min-height:78px;display:flex;flex-direction:column;${cursor};transition:transform .1s" title="${dateKey}${isClickable ? (entryCount > 0 ? ' — click to view ' + entryCount + ' entr' + (entryCount === 1 ? 'y' : 'ies') : ' — click to add hours') : ''}" ${isClickable ? 'onmouseover="this.style.transform=\'scale(1.02)\'" onmouseout="this.style.transform=\'\'"' : ''}>
          <div style="font-size:11px;color:var(--text-muted);font-weight:600">${d}</div>
          <div style="flex:1;display:flex;align-items:center;justify-content:center">
            ${hours > 0 ? `<div style="font-size:18px;font-weight:600;color:var(--text)">${fmtHours(hours)}<span style="font-size:11px;color:var(--text-muted);margin-left:2px">h</span></div>` :
              isFuture ? '' :
              isWeekend ? '<div style="font-size:11px;color:var(--text-muted)">—</div>' :
              '<div style="font-size:11px;color:var(--danger-text);font-weight:600">no entries</div>'}
          </div>
          ${entryCount > 0 ? `<div style="font-size:10px;color:var(--text-muted);text-align:right">${entryCount} entr${entryCount === 1 ? 'y' : 'ies'}</div>` : ''}
        </div>`;
      }
      html += `</div>
        <div style="margin-top:14px;padding:10px;background:var(--gray-light);border-radius:6px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px">
          <span><strong>${fmtHours(total)} hrs</strong> · ${entries.length} entries</span>
          <span style="display:flex;gap:14px;color:var(--text-muted)">
            <span><span style="display:inline-block;width:12px;height:12px;background:var(--danger-light);border:1px solid var(--gray-border);vertical-align:middle;margin-right:4px"></span>No hours (weekday)</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:var(--warning-light);border:1px solid var(--gray-border);vertical-align:middle;margin-right:4px"></span>Under 4h</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:var(--success-light);border:1px solid var(--gray-border);vertical-align:middle;margin-right:4px"></span>OK</span>
          </span>
        </div>
      </div>`;
      grouped.innerHTML = html;
      return;
    }

    // Group-by toggle: anything other than 'project' renders a flat grouped
    // table instead of the project-tree view. Each row is one bucket with
    // hours summed and entry count. Quick alternative views for different
    // billing/reporting questions ("how many hours per WO?", "per staff?").
    if (groupBy !== 'project') {
      container.style.display = 'none';
      grouped.style.display = '';
      const keyFns = {
        client:   e => e.client_name || '— No client —',
        contract: e => e.contract_number || '— No contract —',
        wo:       e => e.work_order_number || '— No WO# —',
        staff:    e => e.staff_name || '— Unassigned —',
        job:      e => e.project_job_name || e.job_title || '— No job —',
      };
      const labels = { client: 'Client', contract: 'Contract', wo: 'WO #', staff: 'Staff', job: 'Job' };
      const keyFn = keyFns[groupBy];
      const buckets = {};
      for (const e of entries) {
        const k = keyFn(e);
        if (!buckets[k]) buckets[k] = { hours: 0, count: 0 };
        buckets[k].hours += parseFloat(e.hours || 0);
        buckets[k].count++;
      }
      const rows = Object.entries(buckets).sort((a, b) => b[1].hours - a[1].hours);
      grouped.innerHTML = `
        <table style="width:100%">
          <thead>
            <tr>
              <th>${esc(labels[groupBy] || groupBy)}</th>
              <th style="text-align:right">Hours</th>
              <th style="text-align:right">Entries</th>
              <th style="text-align:right">% of total</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(([k, v]) => `
              <tr>
                <td>${esc(k)}</td>
                <td style="text-align:right;font-weight:600">${fmt(v.hours, 'hrs')}</td>
                <td style="text-align:right;color:var(--text-muted)">${v.count}</td>
                <td style="text-align:right;color:var(--text-muted)">${total > 0 ? Math.round((v.hours / total) * 100) : 0}%</td>
              </tr>
            `).join('')}
            <tr style="border-top:2px solid var(--gray-border);font-weight:600">
              <td>Total</td>
              <td style="text-align:right">${fmt(total, 'hrs')}</td>
              <td style="text-align:right">${entries.length}</td>
              <td style="text-align:right">100%</td>
            </tr>
          </tbody>
        </table>
      `;
      return;
    }

    // 'project' groupBy → fall through to the existing project-tree render
    container.style.display = '';
    if (grouped) grouped.style.display = 'none';

    // Build tree: Employee → Client → Project → Job entries
    // Also extend the per-entry lookup with the now-filtered (project-bearing)
    // rows. We DO NOT clear the map here — held rows were added above and
    // need to stay reachable from the held-timecards panel's edit button.
    const tree = {};
    entries.forEach(e => {
      _hoursEntriesById.set(String(e.id), e);
      const emp = e.staff_name || 'Unassigned';
      const cli = e.client_name || 'No Client';
      const proj = e.project_name || 'No Project';
      const hrs = parseFloat(e.hours) || 0;
      if (!tree[emp]) tree[emp] = { hours: 0, staff_id: e.staff_id || null, clients: {} };
      tree[emp].hours += hrs;
      if (!tree[emp].clients[cli]) tree[emp].clients[cli] = { hours: 0, projects: {} };
      tree[emp].clients[cli].hours += hrs;
      if (!tree[emp].clients[cli].projects[proj]) tree[emp].clients[cli].projects[proj] = { hours: 0, type: e.project_type, wo: e.work_order_number, entries: [] };
      tree[emp].clients[cli].projects[proj].hours += hrs;
      tree[emp].clients[cli].projects[proj].entries.push(e);
    });

    const sortedEmps = Object.entries(tree).sort((a, b) => b[1].hours - a[1].hours);

    let html = '';
    for (const [emp, empData] of sortedEmps) {
      const empKey = 'he-' + emp.replace(/\W/g, '');
      html += `<div class="hrs-row" onclick="htreeToggle('${empKey}')" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--gray-border);font-weight:700">
        <div><i class="fa-solid fa-chevron-right" id="hc-${empKey}" style="font-size:10px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i><i class="fa-solid fa-user" style="color:var(--primary);margin-right:6px"></i> ${esc(emp)}</div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:14px;color:var(--primary)">${fmt(empData.hours, 'hrs')}</span>
          ${empData.staff_id ? `<button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="event.stopPropagation();deleteAllHoursForStaff('${empData.staff_id}','${esc(emp)}')" title="Delete all hours for this employee in this period"><i class="fa-solid fa-trash"></i></button>` : ''}
        </div>
      </div>`;

      for (const [cli, cliData] of Object.entries(empData.clients).sort((a, b) => b[1].hours - a[1].hours)) {
        const cliKey = empKey + '-c-' + cli.replace(/\W/g, '');
        html += `<div class="htree htree-${empKey}" onclick="event.stopPropagation();htreeToggle('${cliKey}')" style="display:none;cursor:pointer;padding:10px 16px 10px 40px;border-bottom:1px solid #f0f0f0;background:var(--gray-light);font-weight:600">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div><i class="fa-solid fa-chevron-right" id="hc-${cliKey}" style="font-size:9px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i><i class="fa-solid fa-building" style="color:var(--text-muted);margin-right:6px;font-size:12px"></i> ${esc(cli)}</div>
            <div style="font-size:13px;color:var(--text)">${fmt(cliData.hours, 'hrs')}</div>
          </div>
        </div>`;

        for (const [proj, projData] of Object.entries(cliData.projects).sort((a, b) => b[1].hours - a[1].hours)) {
          const projKey = cliKey + '-p-' + proj.replace(/\W/g, '');
          html += `<div class="htree htree-${cliKey}" onclick="event.stopPropagation();htreeToggle('${projKey}')" style="display:none;cursor:pointer;padding:8px 16px 8px 64px;border-bottom:1px solid #f5f5f5;background:#f8f9fa;font-weight:500;font-size:13px">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div><i class="fa-solid fa-chevron-right" id="hc-${projKey}" style="font-size:8px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i>└ ${esc(proj)} ${projData.wo ? '<span class="td-mono" style="font-size:11px;color:var(--text-muted);margin-left:4px">WO# ' + esc(projData.wo) + '</span>' : ''} ${typeBadge(projData.type)}</div>
              <div style="font-size:13px">${fmt(projData.hours, 'hrs')}</div>
            </div>
          </div>`;

          // Individual time entries
          for (const e of projData.entries.sort((a, b) => a.entry_date.localeCompare(b.entry_date))) {
            html += `<div class="htree htree-${projKey}" style="display:none;padding:6px 16px 6px 88px;border-bottom:1px solid #fafafa;background:#fdfdfd;font-size:12px;color:var(--text-muted)">
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div>
                  <span style="min-width:60px;display:inline-block">${new Date(e.entry_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  ${e.job_title ? '<span style="color:var(--text);margin-left:8px">' + esc(e.job_title) + '</span>' : ''}
                  ${e.notes ? '<span style="margin-left:8px;font-style:italic">' + esc(e.notes) + '</span>' : ''}
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-weight:600;color:var(--text)">${e.hours} hrs</span>
                  <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();openEditTimeEntryModal('${e.id}')" style="width:20px;height:20px;font-size:10px" title="Edit"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-sm btn-danger btn-icon" onclick="event.stopPropagation();deleteTimeEntry('${e.id}')" style="width:20px;height:20px;font-size:10px" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>`;
          }
        }
      }
    }
    container.innerHTML = html;
    // Re-apply previously-expanded keys so polling re-renders don't visually
    // collapse rows the user had open.
    restoreHrsExpandedState();
  }

  // Hours-tab tree state lives in hoursTreeState (shared instance from
  // /js/tree_state.js). Without it, every poll-driven loadHours() rebuild
  // collapsed back to the default closed state. Keys are hierarchy paths
  // like 'jane-2026-04' / 'jane-2026-04-WO123', so collapsing a parent
  // also has to drop matching children — see collapseChildren().
  function htreeToggle(key) {
    const rows = document.querySelectorAll('.htree-' + key);
    const chev = document.getElementById('hc-' + key);
    const showing = rows[0] && rows[0].style.display !== 'none';
    rows.forEach(r => {
      r.style.display = showing ? 'none' : 'block';
      if (showing) {
        const nested = r.querySelectorAll('[id^="hc-"]');
        nested.forEach(c => c.style.transform = 'rotate(0deg)');
      }
    });
    if (showing) {
      // Collapse all nested levels — also drop their state so they stay
      // closed across the next render.
      const allNested = document.querySelectorAll(`[class*="htree-${key}-"]`);
      allNested.forEach(n => n.style.display = 'none');
      hoursTreeState.collapseChildren(key);
      hoursTreeState.collapse(key);
    } else {
      hoursTreeState.expand(key);
    }
    if (chev) chev.style.transform = showing ? 'rotate(0deg)' : 'rotate(90deg)';
  }

  // Re-apply previously-expanded keys after the tree HTML is rebuilt.
  function restoreHrsExpandedState() {
    for (const key of hoursTreeState.keys()) {
      const rows = document.querySelectorAll('.htree-' + key);
      rows.forEach(r => { r.style.display = 'block'; });
      const chev = document.getElementById('hc-' + key);
      if (chev) chev.style.transform = 'rotate(90deg)';
    }
  }

  function openTimeEntryModal() {
    document.getElementById('te-id').value = '';
    document.getElementById('te-modal-title').textContent = 'Log Hours';
    document.getElementById('te-history-btn').style.display = 'none';
    document.getElementById('te-save-btn').innerHTML = 'Save';
    document.getElementById('te-project').value = '';
    document.getElementById('te-staff').value = '';
    document.getElementById('te-hours').value = '';
    document.getElementById('te-title').value = '';
    document.getElementById('te-notes').value = '';
    document.getElementById('te-date').value = new Date().toISOString().split('T')[0];
    if (typeof allProjects !== 'undefined' && !allProjects.length && typeof loadProjects === 'function') loadProjects();
    openModal('time-modal');
  }

  // Calendar grid click handlers (Hours tab → calendar group-by). Empty
  // past cells open the create modal pre-filled with the picked date;
  // cells with entries open a small day-detail modal that lists each
  // entry with [edit] / [delete] actions, then offers "+ Add another".
  function openTimeEntryModalForDate(dateKey) {
    openTimeEntryModal();
    if (dateKey) document.getElementById('te-date').value = dateKey;
  }

  function openCalendarDayDetail(dateKey) {
    // Pull entries for this date from the in-memory map populated by
    // loadHours. Avoids a re-fetch and keeps the day modal cheap.
    const matches = [];
    for (const e of _hoursEntriesById.values()) {
      if (String(e.entry_date || '').slice(0, 10) === dateKey) matches.push(e);
    }
    matches.sort((a, b) => (a.staff_name || '').localeCompare(b.staff_name || '')
      || String(a.created_at || '').localeCompare(String(b.created_at || '')));
    const total = matches.reduce((s, e) => s + (parseFloat(e.hours) || 0), 0);
    const dateLabel = new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US',
      { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const id = 'cal-day-detail-modal';
    const titleHTML = `<i class="fa-regular fa-calendar"></i> ${esc(dateLabel)} <span style="color:var(--text-muted);font-size:13px;font-weight:400;margin-left:8px">${fmtHours(total)} hrs · ${matches.length} entr${matches.length === 1 ? 'y' : 'ies'}</span>`;
    const bodyHTML = matches.length ? `
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:var(--gray-light);border-bottom:1px solid var(--gray-border)">
          <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Staff</th>
          <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Project</th>
          <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Job / Notes</th>
          <th style="padding:8px;text-align:right;font-size:11px;color:var(--text-muted);text-transform:uppercase">Hours</th>
          <th style="padding:8px;text-align:right"></th>
        </tr></thead>
        <tbody>
          ${matches.map(e => `
            <tr style="border-top:1px solid var(--gray-border)">
              <td style="padding:6px 8px">${esc(e.staff_name || '—')}</td>
              <td style="padding:6px 8px">${esc(e.project_name || '—')}${e.work_order_number ? `<br><span style="font-family:monospace;font-size:11px;color:var(--text-muted)">WO# ${esc(e.work_order_number)}</span>` : ''}</td>
              <td style="padding:6px 8px;color:var(--text-muted);font-size:12px">${esc(e.job_title || '')}${e.notes ? '<br>' + esc(e.notes) : ''}</td>
              <td style="padding:6px 8px;text-align:right;font-weight:600">${e.hours}</td>
              <td style="padding:6px 8px;text-align:right;white-space:nowrap">
                <button class="btn btn-sm btn-secondary btn-icon" onclick="closeOverlayModal('${id}');openEditTimeEntryModal('${e.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="closeOverlayModal('${id}');deleteTimeEntry('${e.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : `<div class="empty-state" style="padding:24px;text-align:center;color:var(--text-muted)">No entries on this day.</div>`;
    const footerHTML = `
      <button class="btn btn-secondary" onclick="closeOverlayModal('${id}')">Close</button>
      <button class="btn btn-primary" onclick="closeOverlayModal('${id}');openTimeEntryModalForDate('${dateKey}')"><i class="fa-solid fa-plus"></i> Add Hours</button>
    `;
    openOverlayModal({ id, titleHTML, bodyHTML, footerHTML });
  }

  // Edit existing entry — entry comes from _hoursEntriesById (populated by
  // loadHours). Falls back to a polite bail if the id isn't in the map
  // (e.g. after a polling refresh dropped it).
  async function openEditTimeEntryModal(id) {
    const e = _hoursEntriesById.get(String(id));
    if (!e) {
      alert('Entry no longer in view. Refresh and try again.');
      return;
    }
    if (typeof allProjects !== 'undefined' && !allProjects.length && typeof loadProjects === 'function') await loadProjects();
    document.getElementById('te-id').value = e.id;
    document.getElementById('te-modal-title').textContent = 'Edit Time Entry';
    document.getElementById('te-history-btn').style.display = '';
    document.getElementById('te-save-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
    document.getElementById('te-project').value = e.project_id || '';
    document.getElementById('te-staff').value = e.staff_id || '';
    document.getElementById('te-date').value = (e.entry_date || '').slice(0, 10);
    document.getElementById('te-hours').value = e.hours;
    document.getElementById('te-title').value = e.job_title || '';
    document.getElementById('te-notes').value = e.notes || '';
    openModal('time-modal');
  }

  // Drill into the audit history for the entry currently open in the time-modal.
  function viewTimeEntryHistory() {
    const id = document.getElementById('te-id').value;
    if (!id) return;
    if (typeof viewAuditDetail === 'function') viewAuditDetail(id, null);
  }

  async function saveTimeEntry() {
    const id = document.getElementById('te-id').value;
    const proj = document.getElementById('te-project').value;
    const hrs = document.getElementById('te-hours').value;
    const date = document.getElementById('te-date').value;
    if (!proj || !hrs || !date) return alert('Project, hours and date are required');
    const body = {
      project_id: proj,
      staff_id: document.getElementById('te-staff').value || null,
      entry_date: date,
      hours: parseFloat(hrs),
      job_title: document.getElementById('te-title').value,
      notes: document.getElementById('te-notes').value,
    };
    if (id) {
      await api('/api/time-entries/' + encodeURIComponent(id), 'PUT', body);
    } else {
      await api('/api/time-entries', 'POST', body);
    }
    closeModal('time-modal');
    loadHours();
  }

  async function deleteTimeEntry(id) {
    if (!confirm('Delete this time entry?')) return;
    const resp = await api('/api/time-entries/' + id, 'DELETE');
    loadHours();
    if (typeof loadDashboard === 'function') loadDashboard();
    // Server returns an undo_token snapshot of the deleted row; surface
    // the standard 15s undo bar so accidental clicks are recoverable.
    if (resp && resp.undo_token && typeof showUndoBar === 'function') {
      showUndoBar('Time entry deleted.', resp.undo_token);
    }
  }

  async function deleteAllHoursForStaff(staffId, name) {
    // Match the period the Hours tab is currently showing. In YTD mode the
    // month picker is hidden but its value persists from the last month
    // view — passing it would scope the delete to one month, often
    // matching nothing, which produced the "successfully deleted 0
    // entries" surprise.
    const period = document.getElementById('hrs-period')?.value || 'month';
    const m = document.getElementById('hrs-month').value;
    const y = document.getElementById('hrs-year').value;
    const periodLabel = period === 'ytd'
      ? `YTD ${y}`
      : new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const qs = period === 'ytd' ? `year=${y}` : `month=${m}&year=${y}`;
    if (!confirm(`Delete ALL hours for ${name} in ${periodLabel}?\n\nThis will:\n• Remove every time entry this employee logged in this period\n• Recompute totals on every affected project\n\nYou'll get a 15-second undo window after the delete.`)) return;
    try {
      const r = await api(`/api/time-entries/by-staff/${staffId}?${qs}`, 'DELETE');
      if (r.undo_token && r.deleted > 0 && typeof showUndoBar === 'function') {
        showUndoBar(`Deleted ${r.deleted} time ${r.deleted === 1 ? 'entry' : 'entries'} for ${name}.`, r.undo_token);
      } else if (r.deleted === 0) {
        alert(`No time entries found for ${name} in ${periodLabel}.`);
      } else {
        alert(`Deleted ${r.deleted} time ${r.deleted === 1 ? 'entry' : 'entries'}.`);
      }
      loadHours();
      if (typeof loadDashboard === 'function') loadDashboard();
      if (typeof loadProjects === 'function') loadProjects();
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  }

  // Drilldown modal for the per-type stat tiles. Reads from the
  // _hoursEntriesById map populated by loadHours — same pattern as
  // openCalendarDayDetail — so the click is instant with no extra
  // network round-trip. Each row's edit/delete actions reuse the
  // existing modal handlers.
  function showHoursTypeBreakdown(projectType, label) {
    const period = document.getElementById('hrs-period')?.value || 'month';
    const m = document.getElementById('hrs-month').value;
    const y = document.getElementById('hrs-year').value;
    const periodLabel = period === 'ytd'
      ? `YTD ${y}`
      : new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const matches = [];
    for (const e of _hoursEntriesById.values()) {
      if (e.project_type === projectType && e.project_id) matches.push(e);
    }
    matches.sort((a, b) => (a.staff_name || '').localeCompare(b.staff_name || '')
      || String(a.entry_date || '').localeCompare(String(b.entry_date || '')));

    const byStaff = new Map();
    let total = 0;
    for (const e of matches) {
      const name = e.staff_name || '— Unassigned —';
      if (!byStaff.has(name)) byStaff.set(name, { hours: 0, entries: [] });
      const bucket = byStaff.get(name);
      const h = parseFloat(e.hours) || 0;
      bucket.hours += h;
      total += h;
      bucket.entries.push(e);
    }
    const staffSorted = [...byStaff.entries()].sort((a, b) => b[1].hours - a[1].hours);

    const id = 'hrs-type-detail-modal';
    const titleHTML = `<i class="fa-solid fa-helmet-safety"></i> ${esc(label)} — ${esc(periodLabel)}
      <span style="color:var(--text-muted);font-size:13px;font-weight:400;margin-left:8px">${fmtHours(total)} hrs · ${matches.length} entr${matches.length === 1 ? 'y' : 'ies'} · ${byStaff.size} staff</span>`;
    const bodyHTML = matches.length
      ? staffSorted.map(([name, bucket]) => `
        <div style="border-top:1px solid var(--gray-border)">
          <div style="padding:10px 14px;background:var(--gray-light);font-weight:700;display:flex;justify-content:space-between;align-items:center">
            <div><i class="fa-solid fa-user" style="color:var(--primary);margin-right:6px"></i>${esc(name)}</div>
            <div style="color:var(--primary);font-size:14px">${fmt(bucket.hours, 'hrs')} <span style="color:var(--text-muted);font-size:11px;font-weight:500;margin-left:6px">${bucket.entries.length} entr${bucket.entries.length === 1 ? 'y' : 'ies'}</span></div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tbody>
              ${bucket.entries.map(e => `
                <tr style="border-top:1px solid var(--gray-border)">
                  <td style="padding:6px 14px;color:var(--text-muted);width:90px;white-space:nowrap">${new Date(e.entry_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td style="padding:6px 8px">${esc(e.project_name || '—')}${e.work_order_number ? ` <span style="font-family:monospace;font-size:11px;color:var(--text-muted)">WO# ${esc(e.work_order_number)}</span>` : ''}</td>
                  <td style="padding:6px 8px;color:var(--text-muted);font-size:12px">${esc(e.job_title || '')}${e.notes ? ' · ' + esc(e.notes) : ''}</td>
                  <td style="padding:6px 8px;text-align:right;font-weight:600;width:60px">${e.hours}</td>
                  <td style="padding:6px 14px;text-align:right;white-space:nowrap;width:74px">
                    <button class="btn btn-sm btn-secondary btn-icon" onclick="closeOverlayModal('${id}');openEditTimeEntryModal('${e.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="closeOverlayModal('${id}');deleteTimeEntry('${e.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')
      : `<div class="empty-state" style="padding:32px;text-align:center;color:var(--text-muted)">No entries of this type for ${esc(periodLabel)}.</div>`;
    const footerHTML = `<button class="btn btn-secondary" onclick="closeOverlayModal('${id}')">Close</button>`;
    openOverlayModal({ id, titleHTML, bodyHTML, footerHTML, maxWidth: '880px', bodyStyle: 'overflow:auto;padding:0' });
  }

  window.loadHours = loadHours;
  window.htreeToggle = htreeToggle;
  window.restoreHrsExpandedState = restoreHrsExpandedState;
  window.openTimeEntryModal = openTimeEntryModal;
  window.openTimeEntryModalForDate = openTimeEntryModalForDate;
  window.openCalendarDayDetail = openCalendarDayDetail;
  window.openEditTimeEntryModal = openEditTimeEntryModal;
  window.viewTimeEntryHistory = viewTimeEntryHistory;
  window.saveTimeEntry = saveTimeEntry;
  window.deleteTimeEntry = deleteTimeEntry;
  window.deleteAllHoursForStaff = deleteAllHoursForStaff;
  window.showHoursTypeBreakdown = showHoursTypeBreakdown;
})();
