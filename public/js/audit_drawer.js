// public/js/audit_drawer.js — Time Clock audit drawer + detail modal.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
// The drawer slides in from the Hours toolbar's "Audit Log" button and
// is backed by /api/_admin/timeclock-audit. Filters: user, date range,
// meaningful-only. Rows have an eye icon that opens the detail modal
// with the full chronological history for that one time entry.
//
// Globals this script depends on (all defined in the inline <script>
// block of index.html, loaded after this file):
//   api()        — fetch wrapper from /js/api.js
//   esc()        — HTML-escape helper
//   usersCache   — admin users list (loaded by loadUsers())
//
// All exported functions are global (window.openAuditDrawer, etc.) so
// the existing inline onclick handlers in index.html keep working
// without an event-listener migration.

(function () {
  let auditUsersLoaded = false;

  // Drawer open/close. Defaults the date range to the Hours tab's
  // currently selected month so the drawer's first view matches what
  // the admin is looking at on the page behind it.
  function openAuditDrawer() {
    const drawer = document.getElementById('audit-drawer');
    const backdrop = document.getElementById('audit-drawer-backdrop');
    if (!drawer || !backdrop) return;
    drawer.style.display = 'flex';
    backdrop.style.display = 'block';
    // Pre-fill from + to from Hours tab filters when empty (don't
    // clobber a range the admin already picked inside the drawer).
    try {
      const fromEl = document.getElementById('audit-filter-from');
      const toEl = document.getElementById('audit-filter-to');
      const period = document.getElementById('hrs-period')?.value || 'month';
      const m = parseInt(document.getElementById('hrs-month')?.value || '0', 10);
      const y = parseInt(document.getElementById('hrs-year')?.value || '0', 10);
      if (fromEl && !fromEl.value && y) {
        if (period === 'ytd') {
          fromEl.value = `${y}-01-01`;
          if (toEl && !toEl.value) toEl.value = `${y}-12-31`;
        } else if (m) {
          const last = new Date(y, m, 0).getDate();
          fromEl.value = `${y}-${String(m).padStart(2,'0')}-01`;
          if (toEl && !toEl.value) toEl.value = `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
        }
      }
    } catch {}
    loadAuditLog();
  }

  function closeAuditDrawer() {
    const drawer = document.getElementById('audit-drawer');
    const backdrop = document.getElementById('audit-drawer-backdrop');
    if (drawer) drawer.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  }

  async function loadAuditLog() {
    // First load: populate the user filter dropdown.
    if (!auditUsersLoaded) {
      try {
        if (!window.usersCache || !window.usersCache.length) {
          window.usersCache = await api('/api/users');
        }
        const sel = document.getElementById('audit-filter-user');
        while (sel.options.length > 1) sel.remove(1);
        // Sort users alphabetically by display name for easier scanning.
        [...window.usersCache].sort((a,b) => (a.full_name||a.username).localeCompare(b.full_name||b.username))
          .forEach(u => sel.add(new Option(u.full_name || u.username, u.id)));
        auditUsersLoaded = true;
      } catch(e) { /* leave dropdown with just "All users" if load fails */ }
    }

    // Build query string from active filters.
    const params = new URLSearchParams();
    const userFilter = document.getElementById('audit-filter-user').value;
    const fromFilter = document.getElementById('audit-filter-from').value;
    const toFilter = document.getElementById('audit-filter-to').value;
    const meaningfulOnly = document.getElementById('audit-filter-meaningful').checked;
    if (userFilter) params.set('user_id', userFilter);
    if (fromFilter) params.set('from', fromFilter);
    // 'to' filter is end-of-day inclusive — append T23:59:59 so the day is fully covered.
    if (toFilter) params.set('to', toFilter + 'T23:59:59');
    if (meaningfulOnly) params.set('meaningful_only', 'true');
    params.set('limit', '200');

    const tbody = document.getElementById('audit-body');
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Loading…</td></tr>';

    let rows;
    try {
      rows = await api('/api/_admin/timeclock-audit?' + params.toString());
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state" style="color:var(--danger)">Failed: ${esc(e.message)}</td></tr>`;
      return;
    }

    document.getElementById('audit-results-title').textContent =
      `Audit Entries · ${rows.length}${rows.length === 200 ? '+' : ''} shown`;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No audit entries match the current filters.</td></tr>';
      return;
    }

    // Action color coding via the token system; the cascade flips
    // to dark variants automatically.
    const styles = {
      created: 'background:var(--success-light);color:var(--success-text)',
      updated: 'background:var(--info-light);color:var(--info-text)',
      deleted: 'background:var(--danger-light);color:var(--danger-text)',
      restored: 'background:var(--warning-light);color:var(--warning-text)',
    };

    tbody.innerHTML = rows.map(r => {
      const when = new Date(r.at);
      const whenStr = when.toLocaleDateString('en-US', {month:'short', day:'numeric'}) + ' ' +
                      when.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'});
      const actor = esc(r.actor_full_name || r.actor_username || 'unknown');
      const meaningful = r.meaningful
        ? '<i class="fa-solid fa-circle" style="color:var(--warning);font-size:7px;margin-right:5px" title="Meaningful change"></i>'
        : '';
      const summary = esc(r.change_summary || '');
      const project = esc(r.project_name || '—');
      const source = esc(r.source || 'api');
      const actionStyle = styles[r.action] || 'background:var(--gray-light);color:var(--text)';
      return `<tr>
        <td style="font-size:12px;white-space:nowrap">${esc(whenStr)}</td>
        <td style="font-size:12px">${actor}</td>
        <td><span style="${actionStyle};padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;text-transform:uppercase">${esc(r.action)}</span></td>
        <td style="font-size:12px">${meaningful}${summary}</td>
        <td style="font-size:12px;color:var(--text-muted)">${project}</td>
        <td><span style="background:var(--gray-light);padding:2px 8px;border-radius:8px;font-size:10px;color:var(--text-muted);text-transform:uppercase">${source}</span></td>
        <td style="text-align:right">
          <button class="btn btn-sm btn-secondary btn-icon" onclick="viewAuditDetail('${esc(r.time_entry_id)}', '${esc(r.id)}')" title="View full history"><i class="fa-solid fa-eye"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  // Open the detail modal — fetches all audit rows for this one time entry
  // and renders them as a chronological history with before/after diffs.
  async function viewAuditDetail(timeEntryId, focusedAuditId) {
    document.getElementById('audit-detail-modal').style.display = 'flex';
    const body = document.getElementById('audit-detail-body');
    body.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Loading history…</div>';

    let history;
    try {
      history = await api('/api/_admin/timeclock-audit/' + encodeURIComponent(timeEntryId));
    } catch (e) {
      body.innerHTML = `<div style="color:var(--danger);padding:12px">Failed to load: ${esc(e.message)}</div>`;
      return;
    }

    document.getElementById('audit-detail-title').textContent =
      `Time Entry History · ${history.length} change${history.length === 1 ? '' : 's'}`;

    if (!history.length) {
      body.innerHTML = '<div class="empty-state">No history found.</div>';
      return;
    }

    // Render each event as a card. The card focused-on (the row admin clicked)
    // gets highlighted so admin can see which entry triggered the drilldown.
    body.innerHTML = history.map(h => {
      const isFocus = String(h.id) === String(focusedAuditId);
      const when = new Date(h.at);
      const whenStr = when.toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit'});
      const actor = esc(h.actor_full_name || h.actor_username || 'unknown');

      // Diff rendering — show before/after side by side for updates only;
      // creates/deletes show just the new/old state respectively.
      let diffHtml = '';
      if (h.action === 'updated' && h.before_data && h.after_data) {
        diffHtml = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">BEFORE</div>
            <pre style="background:var(--gray-light);padding:8px;border-radius:6px;font-size:11px;white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto;margin:0">${esc(JSON.stringify(h.before_data, null, 2))}</pre>
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">AFTER</div>
            <pre style="background:var(--gray-light);padding:8px;border-radius:6px;font-size:11px;white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto;margin:0">${esc(JSON.stringify(h.after_data, null, 2))}</pre>
          </div>
        </div>`;
      } else if (h.before_data || h.after_data) {
        const data = h.after_data || h.before_data;
        diffHtml = `<div style="margin-top:8px">
          <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">${h.after_data ? 'NEW STATE' : 'DELETED STATE'}</div>
          <pre style="background:var(--gray-light);padding:8px;border-radius:6px;font-size:11px;white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto;margin:0">${esc(JSON.stringify(data, null, 2))}</pre>
        </div>`;
      }

      return `<div style="border:${isFocus ? '2px solid var(--primary)' : '1px solid var(--gray-border)'};border-radius:8px;padding:12px;margin-bottom:10px;${isFocus ? 'background:var(--primary-light)' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="background:var(--white);border:1px solid var(--gray-border);padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;text-transform:uppercase">${esc(h.action)}</span>
            ${h.meaningful ? '<span style="background:var(--warning);color:#000;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:600">MEANINGFUL</span>' : ''}
            <strong style="font-size:13px">${esc(h.change_summary || '')}</strong>
          </div>
          <div style="font-size:11px;color:var(--text-muted);text-align:right">
            <div>${esc(whenStr)}</div>
            <div>by <strong>${actor}</strong> · via ${esc(h.source || 'api')}</div>
          </div>
        </div>
        ${diffHtml}
      </div>`;
    }).join('');
  }

  function closeAuditDetailModal() {
    document.getElementById('audit-detail-modal').style.display = 'none';
  }

  // Expose to window so existing inline onclick handlers in index.html
  // still resolve. Avoid module-style exports — the host page uses the
  // simple non-bundler pattern documented in HANDOFF.md.
  window.openAuditDrawer = openAuditDrawer;
  window.closeAuditDrawer = closeAuditDrawer;
  window.loadAuditLog = loadAuditLog;
  window.viewAuditDetail = viewAuditDetail;
  window.closeAuditDetailModal = closeAuditDetailModal;
})();
