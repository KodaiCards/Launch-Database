// public/js/unbilled_hours_panel.js — Unbilled hours panel on the
// Admin Hours tab.
//
// Sister of held_timecards.js. Renders any time_entries row with
// is_billable=FALSE — typically CSV-imported rows whose timeclock
// "customer" was a placeholder (Miscellaneous, Permitting, or a bare
// "WO #N" with no customer prefix). These hours are intentionally
// project-less; the panel groups them by category and lets the admin
// edit (re-classify) or delete a row.
//
// Globals this module reads:
//   esc(), fmt()                — global helpers
//   openEditTimeEntryModal()    — admin Hours edit modal
//   deleteTimeEntry()           — admin Hours delete handler

(function () {
  const CATEGORY_LABELS = {
    misc:       'Miscellaneous',
    permitting: 'Permitting',
    wo_only:    'Unassigned WO #'
  };

  function renderUnbilledHoursPanel(unbilledEntries) {
    const panel = document.getElementById('unbilled-hours-panel');
    const body  = document.getElementById('unbilled-hours-body');
    const count = document.getElementById('unbilled-hours-count');
    const totalEl = document.getElementById('unbilled-hours-total');
    if (!panel || !body) return;
    if (!unbilledEntries || !unbilledEntries.length) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = '';
    const total = unbilledEntries.reduce((s, e) => s + parseFloat(e.hours || 0), 0);
    if (count)   count.textContent   = `(${unbilledEntries.length} entr${unbilledEntries.length === 1 ? 'y' : 'ies'})`;
    if (totalEl) totalEl.textContent = fmt(total, 'hrs');

    // Group by category. Missing/unknown categories get bucketed under 'misc'
    // since the most common path here is a row imported before unbilled_category
    // existed (legacy data) where we still want to surface it as overhead.
    const byCat = {};
    for (const e of unbilledEntries) {
      const cat = e.unbilled_category || 'misc';
      (byCat[cat] = byCat[cat] || []).push(e);
    }
    const sections = Object.keys(byCat).sort().map(cat => {
      const rows = byCat[cat].slice().sort((a, b) =>
        String(b.entry_date || '').localeCompare(String(a.entry_date || '')));
      const catTotal = rows.reduce((s, e) => s + parseFloat(e.hours || 0), 0);
      return `
        <div style="margin-top:6px">
          <div style="padding:8px 12px;background:var(--gray-light);font-weight:600;font-size:13px;display:flex;justify-content:space-between">
            <span>${esc(CATEGORY_LABELS[cat] || cat)}</span>
            <span style="color:var(--text-muted);font-weight:500">${fmt(catTotal, 'hrs')} • ${rows.length} entr${rows.length === 1 ? 'y' : 'ies'}</span>
          </div>
          <table style="width:100%;font-size:13px">
            <thead>
              <tr style="background:var(--gray-light)">
                <th style="padding:6px 10px;text-align:left">Date</th>
                <th style="padding:6px 10px;text-align:left">Staff</th>
                <th style="padding:6px 10px;text-align:right">Hours</th>
                <th style="padding:6px 10px;text-align:left">Job / Notes</th>
                <th style="padding:6px 10px;text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(e => `
                <tr style="border-top:1px solid var(--gray-border)">
                  <td style="padding:6px 10px">${esc(String(e.entry_date || '').slice(0, 10))}</td>
                  <td style="padding:6px 10px">${esc(e.staff_name || '—')}</td>
                  <td style="padding:6px 10px;text-align:right;font-weight:600">${e.hours}</td>
                  <td style="padding:6px 10px;color:var(--text-muted);font-size:12px">${esc(e.job_title || e.notes || '')}</td>
                  <td style="padding:6px 10px;text-align:right;white-space:nowrap">
                    <button class="btn btn-sm btn-secondary btn-icon" onclick="openEditTimeEntryModal('${e.id}')" title="Edit / re-classify"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteTimeEntry('${e.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    body.innerHTML = sections;
  }

  window.renderUnbilledHoursPanel = renderUnbilledHoursPanel;
})();
