// public/js/held_timecards.js — "Needs Project Assignment" warning panel.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
// The panel sits above the Hours tab tree and surfaces every
// time_entries row with project_id=NULL — typically rows logged on the
// timeclock against a "+ Add New" project request that's still pending
// or got rejected. Each row offers [edit] (opens the existing time-
// entry edit modal so admin can pick a real project) and [trash]
// (deletes the orphan row).
//
// Globals this module reads:
//   esc()                       — global helper
//   openEditTimeEntryModal()    — admin Hours modal opener (still inline)
//   deleteTimeEntry()           — admin Hours delete handler (still inline)

(function () {
  function renderHeldTimecardsPanel(heldEntries) {
    const panel = document.getElementById('held-timecards-panel');
    const body = document.getElementById('held-timecards-body');
    const count = document.getElementById('held-timecards-count');
    if (!panel || !body) return;
    if (!heldEntries || !heldEntries.length) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = '';
    if (count) count.textContent = `(${heldEntries.length} timecard${heldEntries.length === 1 ? '' : 's'})`;
    // Sort newest entry_date first so freshly-rejected requests bubble up.
    const sorted = heldEntries.slice().sort((a, b) =>
      String(b.entry_date || '').localeCompare(String(a.entry_date || '')));
    body.innerHTML = `
      <table style="width:100%;font-size:13px">
        <thead>
          <tr style="background:var(--gray-light)">
            <th style="padding:8px 10px;text-align:left">Date</th>
            <th style="padding:8px 10px;text-align:left">Staff</th>
            <th style="padding:8px 10px;text-align:right">Hours</th>
            <th style="padding:8px 10px;text-align:left">Notes</th>
            <th style="padding:8px 10px;text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(e => `
            <tr style="border-top:1px solid var(--gray-border)">
              <td style="padding:6px 10px">${esc(String(e.entry_date || '').slice(0,10))}</td>
              <td style="padding:6px 10px">${esc(e.staff_name || '—')}</td>
              <td style="padding:6px 10px;text-align:right;font-weight:600">${e.hours}</td>
              <td style="padding:6px 10px;color:var(--text-muted);font-size:12px">${esc(e.notes || '')}</td>
              <td style="padding:6px 10px;text-align:right;white-space:nowrap">
                <button class="btn btn-sm btn-secondary btn-icon" onclick="openEditTimeEntryModal('${e.id}')" title="Assign project + edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deleteTimeEntry('${e.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.renderHeldTimecardsPanel = renderHeldTimecardsPanel;
})();
