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
// Admin users additionally see an amber warning bar when unattributed hours
// exist (entries on rollups with no leaf match). The bar includes a
// "View details" link that opens a diagnostic modal with per-group
// "Reattribute" buttons wired to the existing reattribute-rollup-hours
// endpoint (PR #16).
//
// Globals this module reads:
//   api(), esc()                  — global helpers
//   fmtHours, fmtMoney            — global formatters
//   statusBadge()                 — global status pill renderer
//   editProject, showProjectDetail — global modal openers (still inline)
//   window.__currentUser          — { role } set by auth layer; 'admin' triggers debug fetch
//
// Functions exposed on window:
//   loadInspection, toggleOngoing

(function () {
  // ─── Unattributed-hours warning bar ──────────────────────────────────────
  // Only shown to admin users. Fetched in parallel with the main data so the
  // tab still loads fast even if the debug endpoint is slow.

  // Cached debug data so the modal can be re-opened without a second fetch.
  let _lastDebugData = null;

  function isAdmin() {
    try { return (window.__currentUser || {}).role === 'admin'; }
    catch { return false; }
  }

  // Render or clear the amber warning bar above the table.
  function renderWarningBar(debugData) {
    _lastDebugData = debugData;
    const container = document.getElementById('rus-warning-bar');
    if (!container) return;
    const uh = debugData && debugData.summary && debugData.summary.unattributed_hours_total;
    if (!uh || uh <= 0) {
      container.innerHTML = '';
      return;
    }
    const n = typeof uh === 'number' ? uh.toFixed(1) : uh;
    container.innerHTML = `
      <div id="rus-warn-inner" style="
        background:#fff3cd;border:1px solid #ffc107;border-radius:6px;
        padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;
        gap:12px;font-size:13px;color:#664d03">
        <i class="fa-solid fa-triangle-exclamation" style="color:#ffc107;font-size:16px"></i>
        <span><strong>${n} hours</strong> in the period are unattributed (entries on rollups with no leaf match).</span>
        <a href="#" onclick="_rusShowDebugModal();return false;"
           style="margin-left:auto;font-weight:600;color:#664d03;text-decoration:underline;white-space:nowrap">
          View details
        </a>
      </div>`;
  }

  // Build and show the diagnostic modal. Uses _lastDebugData cached by renderWarningBar.
  window._rusShowDebugModal = function () {
    const data = _lastDebugData;
    if (!data) return;
    // Remove any stale modal
    const old = document.getElementById('rus-debug-modal');
    if (old) old.remove();

    const breakdown = data.unattributed_breakdown || [];

    const rowsHtml = breakdown.length === 0
      ? '<p style="color:var(--text-muted);padding:12px">No unattributed groups found.</p>'
      : breakdown.map(g => {
          const candidatesHtml = (g.candidate_leaves_under_this_project || []).map(lf => `
            <li style="margin:3px 0;color:${lf.would_match ? 'var(--success)' : 'var(--text-muted)'}">
              <strong>${esc(lf.name)}</strong>
              ${lf.job_name ? `(job: ${esc(lf.job_name)})` : '(no job)'}
              — ${esc(lf.why)}
            </li>`).join('');
          const reattributeBtn = g.best_guess_leaf_id
            ? `<button class="btn btn-sm btn-secondary" style="margin-top:6px"
                 onclick="_rusReattribute('${esc(g.project_id)}','${esc(g.best_guess_leaf_id)}',this)">
                 Reattribute to ${esc(
                   (g.candidate_leaves_under_this_project || []).find(l => l.id === g.best_guess_leaf_id)?.name || 'leaf'
                 )}
               </button>`
            : `<span style="font-size:11px;color:var(--text-muted)">Multiple candidates — use Reattribute tool to resolve manually.</span>`;

          return `
            <div style="border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px">
              <div style="font-weight:600">${esc(g.project_name)}</div>
              <div style="font-size:12px;color:var(--text-muted);margin:2px 0">
                job_title on entries: <strong>${esc(g.job_title_on_entry || '(empty)')}</strong>
                &nbsp;·&nbsp; ${g.entry_count} entr${g.entry_count===1?'y':'ies'}
                &nbsp;·&nbsp; ${typeof g.hours === 'number' ? g.hours.toFixed(1) : g.hours}h
                ${g.is_rollup ? '&nbsp;·&nbsp;<span style="color:var(--warning)">rollup</span>' : ''}
              </div>
              ${candidatesHtml ? `<ul style="margin:6px 0 6px 16px;padding:0;font-size:12px">${candidatesHtml}</ul>` : ''}
              ${reattributeBtn}
            </div>`;
        }).join('');

    const modal = document.createElement('div');
    modal.id = 'rus-debug-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center';
    modal.innerHTML = `
      <div style="background:var(--surface-1);border-radius:10px;width:min(680px,96vw);max-height:85vh;
                  display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.25)">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ffc107"></i>
          <strong style="font-size:15px">Unattributed Hours — Debug</strong>
          <span style="font-size:12px;color:var(--text-muted);margin-left:4px">
            ${data.summary.entries_unattributed} entries &nbsp;·&nbsp;
            ${typeof data.summary.unattributed_hours_total === 'number' ? data.summary.unattributed_hours_total.toFixed(1) : data.summary.unattributed_hours_total}h unattributed
            of ${data.summary.total_entries_in_rus_chain} total in period
          </span>
          <button onclick="document.getElementById('rus-debug-modal').remove()"
                  style="margin-left:auto;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted)"
                  title="Close">&times;</button>
        </div>
        <div style="padding:16px 20px;overflow-y:auto;flex:1">${rowsHtml}</div>
        <div style="padding:10px 20px;border-top:1px solid var(--border);font-size:11px;color:var(--text-muted)">
          "Reattribute" buttons call the existing reattribute-rollup-hours endpoint (dry_run=false for the specific project).
          Run the full <strong>Reattribute Rollup Hours</strong> tool in Settings → Migration Tools for a bulk pass.
        </div>
      </div>`;
    // Close on backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  };

  // Per-row reattribute action — moves entries from the rollup to the named
  // leaf via the existing reattribute endpoint, scoped to just that project.
  window._rusReattribute = async function (projectId, leafId, btn) {
    btn.disabled = true;
    btn.textContent = 'Reattributing…';
    try {
      const result = await api('/api/_admin/reattribute-rollup-hours', 'POST', {
        dry_run: false,
        project_ids: [projectId],
      });
      const moved = result && result.moved != null ? result.moved : '?';
      btn.textContent = `Done (${moved} moved)`;
      btn.style.color = 'var(--success)';
      // Reload the tab so hours update without a full page refresh.
      setTimeout(() => {
        const m = document.getElementById('rus-debug-modal');
        if (m) m.remove();
        if (typeof loadInspection === 'function') loadInspection();
      }, 800);
    } catch (e) {
      btn.disabled = false;
      btn.textContent = 'Reattribute failed — retry';
      console.error('[rus] reattribute failed:', e);
    }
  };

  // ── Period/month visibility ──────────────────────────────────────────────
  // Hide the month picker when the period dropdown is set to YTD.
  // Called on page load and whenever the dropdown changes.
  function syncRusPeriodVisibility() {
    const period = document.getElementById('insp-period')?.value;
    const monthEl = document.getElementById('insp-month');
    if (monthEl) monthEl.style.display = period === 'month' ? '' : 'none';
  }
  document.getElementById('insp-period')?.addEventListener('change', syncRusPeriodVisibility);
  syncRusPeriodVisibility();

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

    // Fire the debug fetch in parallel (admin-only). The main render
    // proceeds regardless of whether the debug call succeeds.
    const debugPromise = isAdmin()
      ? api('/api/_admin/rus-hours-debug' + qs).catch(() => null)
      : Promise.resolve(null);

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

    // Project rows — grouped by contract per owner spec 2026-05-06:
    // "The projects in the RUS section need to be within a contract
    // roll up for organization also. Always."
    const tbody = document.getElementById('inspection-body');
    if (!data.projects?.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="fa-solid fa-helmet-safety"></i><p>No RUS-program projects with activity${period==='month'?' for '+periodLabel:''}.</p><p style="font-size:12px;color:var(--text-muted)">Any active project under an engineering contract whose program is set to RUS will surface here once it has logged hours, regardless of job team.</p></td></tr>`;
      return;
    }

    // Bucket rows by contract_label. "— Unassigned" gets its own bucket
    // (rare; should only happen for legacy rows where the contract was
    // never set).
    const byContract = new Map();
    for (const p of data.projects) {
      const key = p.contract_label || '— Unassigned —';
      if (!byContract.has(key)) byContract.set(key, []);
      byContract.get(key).push(p);
    }
    // Sort contracts alphabetically; render a section header row per
    // contract followed by its project rows.
    const sortedContracts = [...byContract.keys()].sort((a, b) => a.localeCompare(b));
    const html = [];
    for (const contractKey of sortedContracts) {
      const rows = byContract.get(contractKey);
      const totalHours = rows.reduce((s, r) => s + (r.hours_in_period || 0), 0);
      const totalRevenue = rows.reduce((s, r) => s + (r.revenue_in_period || 0), 0);
      html.push(`
        <tr style="background:var(--surface-3);font-weight:700">
          <td colspan="4" style="padding:10px 12px;color:var(--primary)">
            <i class="fa-solid fa-folder-open" style="margin-right:6px"></i>${esc(contractKey)}
            <span style="margin-left:8px;font-weight:500;color:var(--text-muted);font-size:11px">${rows.length} project${rows.length===1?'':'s'}</span>
          </td>
          <td style="text-align:right;padding:10px 12px">${fmtHours(totalHours)}</td>
          <td style="text-align:right;padding:10px 12px;color:var(--success)">${fmtMoney(totalRevenue)}</td>
          <td colspan="3"></td>
        </tr>
      `);
      for (const p of rows) {
        html.push(`
          <tr style="${p.is_ongoing ? 'background:rgba(253,126,20,0.05)' : ''}">
            <td style="padding-left:24px">
              <div style="font-weight:600">${esc(p.display_name || p.name)}</div>
              <div style="font-size:11px;color:var(--text-muted)">${esc(p.job_name || '—')}</div>
            </td>
            <td>${esc(p.client_name || '—')}</td>
            <td style="font-family:monospace;font-size:12px">${esc(p.work_order_number || p.resolved_wo || '—')}</td>
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
        `);
      }
    }
    tbody.innerHTML = html.join('');

    // Resolve the parallel debug fetch and render the warning bar (admin only).
    // We do this AFTER the main render so the table is already visible if the
    // debug call is slow.
    if (isAdmin()) {
      const debugData = await debugPromise;
      renderWarningBar(debugData);
    }
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

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  // Debounce: if several events arrive within 500 ms (e.g. bulk import),
  // collapse them into a single reload. Visibility-aware: if the RUS/
  // Inspection tab is not the active view, mark it stale and reload on
  // next showView('inspection') call instead of fetching in the background.
  let _inspStaleTimer = null;
  let _inspStale = false;

  function _inspDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'inspection') {
      _inspStale = true;
      return;
    }
    clearTimeout(_inspStaleTimer);
    _inspStaleTimer = setTimeout(loadInspection, 500);
  }

  const _inspSseEvents = [
    'time_entry_added', 'time_entry_updated', 'time_entry_deleted', 'time_entries_bulk_deleted',
    'project_updated', 'project_deleted',
  ];
  _inspSseEvents.forEach(ev => document.addEventListener('sse:' + ev, _inspDebounce));

  (window._showViewHooks = window._showViewHooks || []).push(function(view) {
    if (view === 'inspection' && _inspStale) {
      _inspStale = false;
      clearTimeout(_inspStaleTimer);
      _inspStaleTimer = setTimeout(loadInspection, 100);
    }
  });
})();
