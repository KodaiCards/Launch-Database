// public/js/billing_tab.js — Admin Billing tab.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Two halves:
//   Unbilled queue: groups Client → Parent project → Job, each row has
//     a checkbox into the persistent _billSelectedByKey Map (defined
//     inline still). Selecting rows enables the floating bill-selected
//     bar at the top.
//   Invoice History: a 3-level collapsible tree (Month → Client →
//     Invoice → line items), with per-invoice delete (with or without
//     wiping hours).
//
// Adjacent billing flows still live inline (Print PDF modal cluster,
// PSC RUS PDF generator, Saved Batches loader, bulk bill-selected
// modal, single-project markBilled flow). They share state with the
// project modal and bill-selection machinery — extracting them in
// pieces would create more cross-file dependencies than it removes.
//
// Globals this module reads:
//   api(), esc(), fmt(), fmtMoney()  — global helpers
//   typeBadge()                      — global badge renderer
//   MONTH_NAMES, MONTH_FULL          — month-label constants
//   setHtmlIfChanged()               — flicker-free DOM write
//   _restoreBillCheckboxes()         — selection re-tick after rerender
//   updateBillSelectedFooter()       — footer count refresh
//   billingHistoryTreeState          — separate state from hoursTreeState
//   editProject(), confirmDeleteProject() — project edit/delete
//   loadBatches(), loadRevenue(),    — neighbor refreshers
//     loadDashboard(), loadHours(),
//     loadProjects()
//
// Functions exposed on window:
//   editInvoiceAmount, loadBilling, deleteInvoice, deleteBilledProject

(function () {
  // Quick-edit handler for the Billable Amount cell in the Billing tab.
  // Prompts for a new manual invoice amount and PUTs it on the project.
  // Setting it to blank (or 0) clears the override and reverts to the
  // auto-calculated amount (hours × rate, or footage × rate).
  async function editInvoiceAmount(projectId, projectName, currentAmount) {
    const input = prompt(
      `Override invoice amount for "${projectName}".\n\nLeave blank to clear the override and use the auto-calculated amount.\nOtherwise enter a dollar amount (no $ sign needed):`,
      currentAmount > 0 ? currentAmount.toFixed(2) : ''
    );
    if (input === null) return;  // user cancelled
    const trimmed = input.trim();
    let manual_invoice_amount;
    if (trimmed === '' || trimmed === '0') {
      manual_invoice_amount = null;  // clear override
    } else {
      const parsed = parseFloat(trimmed);
      if (isNaN(parsed) || parsed < 0) {
        await alertDialog({ title: 'Invalid amount', message: 'Please enter a valid positive number, or leave blank to clear.' });
        return;
      }
      manual_invoice_amount = parsed;
    }
    try {
      await api(`/api/projects/${projectId}`, 'PUT', { manual_invoice_amount });
      loadBilling();  // refresh row + totals
    } catch (e) { await alertDialog({ title: 'Update failed', message: e.message }); }
  }

  async function loadBilling() {
    const yrSel = document.getElementById('billing-year');
    if (yrSel.options.length === 0) {
      const now = new Date();
      for (let y = now.getFullYear() + 1; y >= now.getFullYear() - 3; y--) {
        const o = new Option(y, y);
        if (y === now.getFullYear()) o.selected = true;
        yrSel.add(o);
      }
    }
    const year = yrSel.value;

    let unbilled, invoices;
    try {
      [unbilled, invoices] = await Promise.all([
        api('/api/revenue/unbilled'),
        api('/api/invoices?year=' + year)
      ]);
    } catch (e) {
      document.getElementById('billing-stats').innerHTML =
        `<div class="stat-card" style="border-left:4px solid var(--danger)"><div class="stat-label">Error</div><div class="stat-value" style="font-size:14px;color:var(--danger)">Failed to load billing: ${esc(e.message)}</div></div>`;
      return;
    }

    // ── Unbilled section ──
    const totalUnbilled = unbilled.reduce((s, p) => s + parseFloat(p.earned_amount || 0), 0);
    const totalBilled = invoices.reduce((s, inv) => s + parseFloat(inv.total_amount || 0), 0);

    document.getElementById('billing-stats').innerHTML = `
      <div class="stat-card warn"><div class="stat-label">Unbilled</div><div class="stat-value">${fmtMoney(totalUnbilled)}</div><div class="stat-sub">${unbilled.length} project${unbilled.length !== 1 ? 's' : ''}</div></div>
      <div class="stat-card accent"><div class="stat-label">Billed ${year}</div><div class="stat-value">${fmtMoney(totalBilled)}</div><div class="stat-sub">${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}</div></div>
    `;

    const tbody = document.getElementById('billing-body');
    if (!unbilled.length) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state" style="padding:24px"><i class="fa-solid fa-check-circle" style="color:var(--success);font-size:24px"></i><p>All completed projects have been billed!</p></div></td></tr>';
    } else {
      // Group: Client → Parent project (grandparent_name or parent_name) → Job (project_type)
      const byClient = {};
      unbilled.forEach(p => {
        const c = p.client_name || 'No Client';
        const parent = p.grandparent_name || p.parent_name || '— No parent —';
        const jobLabel = p.project_type || 'other';
        byClient[c] = byClient[c] || {};
        byClient[c][parent] = byClient[c][parent] || {};
        byClient[c][parent][jobLabel] = byClient[c][parent][jobLabel] || [];
        byClient[c][parent][jobLabel].push(p);
      });

      let html = '';
      for (const [client, byParent] of Object.entries(byClient)) {
        // Sum across the whole client
        let clientTotal = 0;
        for (const byJob of Object.values(byParent)) {
          for (const projs of Object.values(byJob)) {
            for (const p of projs) clientTotal += parseFloat(p.earned_amount || 0);
          }
        }
        html += `<tr style="background:var(--primary-light)">
          <td></td>
          <td colspan="5" style="font-weight:700;color:var(--primary);padding:10px 16px"><i class="fa-solid fa-building" style="margin-right:6px"></i>${esc(client)}</td>
          <td style="font-weight:700;color:var(--primary)">${fmtMoney(clientTotal)}</td><td></td><td></td></tr>`;

        for (const [parent, byJob] of Object.entries(byParent)) {
          html += `<tr style="background:var(--gray-light)">
            <td></td>
            <td colspan="8" style="padding-left:32px;font-weight:600;color:var(--text)"><i class="fa-solid fa-folder" style="color:var(--text-muted);margin-right:6px"></i>${esc(parent)}</td></tr>`;
          for (const [jobLabel, projs] of Object.entries(byJob)) {
            for (const p of projs) {
              const hrs = parseFloat(p.logged_hours) || 0;
              const rate = parseFloat(p.billing_rate) || 0;
              const earned = parseFloat(p.earned_amount) || 0;
              const isMonthly = p.billing_cadence === 'monthly';
              // queue_key is unique per row — for monthly it's "<project_id>-<y>-<m>";
              // for one-time it's just the project_id. Used as the checkbox identity
              // so the user can select multiple months of the same project (or not).
              const periodLabel = (p.period_year && p.period_month)
                ? `${MONTH_NAMES[p.period_month - 1]} ${p.period_year}`
                : (p.completed_date ? new Date(p.completed_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
              const cadenceTag = isMonthly
                ? `<span style="background:var(--primary-light);color:var(--primary);padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;margin-left:4px">monthly</span>`
                : '';
              // Manual override indicator — show a yellow pin if billing has been overridden
              const overridePin = p.manual_invoice_amount != null
                ? '<i class="fa-solid fa-thumbtack" style="color:var(--warning);font-size:9px;margin-left:4px" title="Invoice amount manually overridden — click amount to edit"></i>'
                : '';
              html += `<tr data-queue-key="${esc(p.queue_key)}">
                <td style="text-align:center;padding:6px"><input type="checkbox" class="bill-row-cb"
                  data-id="${p.id}"
                  data-queue-key="${esc(p.queue_key)}"
                  data-client-id="${esc(p.client_id || '')}"
                  data-amount="${earned}"
                  data-period-year="${p.period_year || ''}"
                  data-period-month="${p.period_month || ''}"
                  onchange="billRowToggled(this)"></td>
                <td class="td-name" style="padding-left:48px">└ ${esc(p.name)}${cadenceTag}</td>
                <td>${esc(p.concentrator_area || p.work_order_number || '—')}</td>
                <td>${typeBadge(p.project_type)}</td>
                <td>${fmt(hrs, 'hrs')}</td>
                <td>$${rate.toFixed(2)}/hr</td>
                <td style="font-weight:600;cursor:pointer;color:var(--primary);text-decoration:underline dotted" onclick="editInvoiceAmount('${p.id}','${esc(p.name).replace(/'/g, "\\'")}', ${earned})" title="Click to override invoice amount">${fmtMoney(earned)}${overridePin}</td>
                <td>${periodLabel}</td>
                <td style="white-space:nowrap;text-align:right">
                  <button class="btn btn-sm btn-icon btn-secondary" onclick="event.stopPropagation();editProject('${p.id}')" title="Edit project"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="event.stopPropagation();confirmDeleteProject('${p.id}','${esc(p.name).replace(/'/g, "\\'")}')" title="Delete project"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>`;
            }
          }
        }
      }
      // Skip the DOM write if nothing changed — same flicker/selection-loss
      // fix as the Projects tab. _restoreBillCheckboxes re-applies persistent
      // selection state regardless (covers rows that were rebuilt with
      // different content but same queue_key).
      setHtmlIfChanged(tbody, html);
      _restoreBillCheckboxes();
      updateBillSelectedFooter();
    }

    // ── Invoice history ──
    document.getElementById('invoice-history-title').textContent = `Invoice History — ${year}`;
    const historyContainer = document.getElementById('invoice-history-body');

    if (!invoices.length) {
      setHtmlIfChanged(historyContainer, '<div class="empty-state" style="padding:24px"><p>No invoices for this year</p></div>');
      return;
    }

    // Group invoices by month
    const byMonth = {};
    invoices.forEach(inv => {
      const m = parseInt(inv.month) || 0;
      if (!byMonth[m]) byMonth[m] = [];
      byMonth[m].push(inv);
    });

    let hHtml = '';
    const monthsSorted = Object.keys(byMonth).map(Number).sort((a, b) => b - a);
    for (const m of monthsSorted) {
      const monthInvs = byMonth[m];
      const monthTotal = monthInvs.reduce((s, i) => s + parseFloat(i.total_amount || 0), 0);
      const monthKey = 'inv-m-' + m;
      hHtml += `<div onclick="billingHtreeToggle('${monthKey}')" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--gray-border);font-weight:700;background:var(--white)">
        <div><i class="fa-solid fa-chevron-right" id="hc-${monthKey}" style="font-size:10px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i><i class="fa-solid fa-calendar-days" style="color:var(--primary);margin-right:6px"></i> ${MONTH_FULL[m - 1] || 'Unknown'} ${year}</div>
        <div style="display:flex;align-items:center;gap:12px"><span style="font-size:14px;color:var(--primary)">${fmtMoney(monthTotal)}</span><span style="font-size:11px;color:var(--text-muted)">${monthInvs.length} invoice${monthInvs.length !== 1 ? 's' : ''}</span></div>
      </div>`;

      // Group by client within month
      const byClient = {};
      monthInvs.forEach(inv => { const c = inv.client_name || 'No Client'; if (!byClient[c]) byClient[c] = []; byClient[c].push(inv); });

      for (const [client, clientInvs] of Object.entries(byClient)) {
        const clientKey = monthKey + '-c-' + client.replace(/\W/g, '');
        const clientTotal = clientInvs.reduce((s, i) => s + parseFloat(i.total_amount || 0), 0);
        hHtml += `<div class="htree htree-${monthKey}" onclick="event.stopPropagation();billingHtreeToggle('${clientKey}')" style="display:none;cursor:pointer;padding:10px 16px 10px 40px;border-bottom:1px solid var(--border-weak);background:var(--gray-light);font-weight:600">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div><i class="fa-solid fa-chevron-right" id="hc-${clientKey}" style="font-size:9px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i><i class="fa-solid fa-building" style="color:var(--text-muted);margin-right:6px;font-size:12px"></i> ${esc(client)}</div>
            <div style="font-size:13px">${fmtMoney(clientTotal)}</div>
          </div>
        </div>`;

        for (const inv of clientInvs) {
          const invKey = clientKey + '-i-' + inv.id.substring(0, 8);
          hHtml += `<div class="htree htree-${clientKey}" onclick="event.stopPropagation();billingHtreeToggle('${invKey}')" style="display:none;cursor:pointer;padding:8px 16px 8px 64px;border-bottom:1px solid var(--border-weak);background:var(--surface-3);font-size:13px;color:var(--text)">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div><i class="fa-solid fa-chevron-right" id="hc-${invKey}" style="font-size:8px;color:var(--text-muted);margin-right:8px;transition:transform .2s"></i><i class="fa-solid fa-file-invoice" style="color:var(--text-muted);margin-right:6px;font-size:11px"></i> ${inv.invoice_number ? esc(inv.invoice_number) : 'Invoice'} — <span style="font-weight:600">${fmtMoney(inv.total_amount)}</span></div>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:11px;color:var(--text-muted)">${new Date(inv.invoice_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <button class="btn btn-sm btn-danger btn-icon" onclick="event.stopPropagation();deleteInvoice('${inv.id}',false)" title="Delete invoice (keep hours)"><i class="fa-solid fa-trash"></i></button>
                <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();deleteInvoice('${inv.id}',true)" title="Delete invoice AND wipe hours" style="font-size:10px"><i class="fa-solid fa-eraser"></i></button>
              </div>
            </div>
          </div>`;

          // Invoice line items (jobs)
          const items = inv.items || [];
          for (const item of items) {
            hHtml += `<div class="htree htree-${invKey}" style="display:none;padding:6px 16px 6px 88px;border-bottom:1px solid var(--border-weak);background:var(--surface-2);font-size:12px;color:var(--text-muted)">
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div>
                  ${item.project_name ? esc(item.project_name) : esc(item.description)}
                  ${item.project_type ? ' ' + typeBadge(item.project_type) : ''}
                  ${item.work_order_number ? ' <span class="td-mono" style="font-size:10px">WO# ' + esc(item.work_order_number) + '</span>' : ''}
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span>${item.quantity ? item.quantity + ' ' + esc(item.unit || '') : '—'}</span>
                  <span>@ $${parseFloat(item.rate || 0).toFixed(2)}</span>
                  <span style="font-weight:600;color:var(--text)">${fmtMoney(item.amount)}</span>
                  ${item.project_id ? '<button class="btn btn-sm btn-danger btn-icon" onclick="event.stopPropagation();deleteBilledProject(\'' + item.project_id + '\')" title="Delete this billed project" style="width:18px;height:18px;font-size:9px"><i class="fa-solid fa-xmark"></i></button>' : ''}
                </div>
              </div>
            </div>`;
          }
        }
      }
    }
    setHtmlIfChanged(historyContainer, hHtml);
    restoreBillingHistoryExpandedState();

    // Saved batches — runs in parallel; the card stays hidden when none.
    if (typeof loadBatches === 'function') loadBatches().catch(() => {});
  }

  async function deleteInvoice(invoiceId, wipeHours) {
    const message = wipeHours
      ? 'Delete this invoice, unbill the projects, AND erase all their logged hours?'
      : 'Delete this invoice and unbill the linked projects? Hours will be kept.';
    const ok = await confirmDialog({ title: 'Delete invoice?', message, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api('/api/invoices/' + invoiceId + '?wipe_hours=' + wipeHours, 'DELETE');
      loadBilling();
      if (typeof loadRevenue === 'function') loadRevenue();
      if (typeof loadDashboard === 'function') loadDashboard();
      if (typeof loadHours === 'function') loadHours();
    } catch (e) { await alertDialog({ title: 'Delete failed', message: e.message }); }
  }

  async function deleteBilledProject(projectId) {
    const ok = await confirmDialog({ title: 'Delete billed project?', message: 'Delete this billed project and all its hours? This will remove it from revenue.', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api('/api/projects/' + projectId + '/with-hours', 'DELETE');
      loadBilling();
      if (typeof loadRevenue === 'function') loadRevenue();
      if (typeof loadDashboard === 'function') loadDashboard();
      if (typeof loadProjects === 'function') loadProjects();
    } catch (e) { await alertDialog({ title: 'Delete failed', message: e.message }); }
  }

  // ── Invoice-history tree toggle ────────────────────────────────────────────
  // Dedicated toggle for the billing invoice-history tree so it uses
  // billingHistoryTreeState (not hoursTreeState). Collapsing/expanding
  // billing months/clients/invoices no longer bleeds into the Hours tree.
  function billingHtreeToggle(key) {
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
      const allNested = document.querySelectorAll(`[class*="htree-${key}-"]`);
      allNested.forEach(n => n.style.display = 'none');
      billingHistoryTreeState.collapseChildren(key);
      billingHistoryTreeState.collapse(key);
    } else {
      billingHistoryTreeState.expand(key);
    }
    if (chev) chev.style.transform = showing ? 'rotate(0deg)' : 'rotate(90deg)';
  }

  // Re-apply previously-expanded keys after the invoice history HTML is rebuilt.
  function restoreBillingHistoryExpandedState() {
    for (const key of billingHistoryTreeState.keys()) {
      const rows = document.querySelectorAll('.htree-' + key);
      rows.forEach(r => { r.style.display = 'block'; });
      const chev = document.getElementById('hc-' + key);
      if (chev) chev.style.transform = 'rotate(90deg)';
    }
  }

  window.billingHtreeToggle = billingHtreeToggle;
  window.editInvoiceAmount = editInvoiceAmount;
  window.loadBilling = loadBilling;
  window.deleteInvoice = deleteInvoice;
  window.deleteBilledProject = deleteBilledProject;

  // ── SSE live-update hooks ──────────────────────────────────────────────────
  let _billStaleTimer = null;
  let _billStale = false;

  function _billDebounce() {
    if (typeof currentView !== 'undefined' && currentView !== 'billing') {
      _billStale = true;
      return;
    }
    clearTimeout(_billStaleTimer);
    _billStaleTimer = setTimeout(loadBilling, 500);
  }

  const _billSseEvents = [
    'invoice_created', 'invoice_voided',
    'batch_committed', 'batch_voided',
    'project_updated', 'project_deleted',
  ];
  _billSseEvents.forEach(ev => document.addEventListener('sse:' + ev, _billDebounce));

  (window._showViewHooks = window._showViewHooks || []).push(function(view) {
    if (view === 'billing' && _billStale) {
      _billStale = false;
      clearTimeout(_billStaleTimer);
      _billStaleTimer = setTimeout(loadBilling, 100);
    }
  });
})();
