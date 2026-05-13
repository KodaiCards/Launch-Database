// public/js/bulk_bill_modal.js — Projects-tab "Bill selected" review modal.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
// Replaces the legacy confirm() prompt with a real review modal that
// fetches /api/invoices/preview-makeup, displays the makeup, and gathers
// invoice number / date / name before POSTing /api/billing/bill-multiple.
//
// Triggered by the "Bill selected" button in the Projects-tab floating
// action bar (#bulk-action-bar). The modal is built dynamically — no
// markup commitment in index.html.
//
// Globals this module reads:
//   api()                  — fetch wrapper from /js/api.js
//   esc(), fmtMoney()      — global helpers
//   bulkSelected (Set)     — current bulk-action selection
//   bulkClearSelection()   — clears the selection after a successful bill
//   loadProjects, loadBilling, loadDashboard — refresh the views
//   window.LFS.toast       — typed toast helper
//
// Functions exposed on window for inline onclick handlers:
//   bulkBill, openBulkBillModal, confirmBulkBill

(function () {
  async function bulkBill() {
    if (!bulkSelected.size) return;
    await openBulkBillModal([...bulkSelected]);
  }

  // Real review modal for the Projects-tab bulk-bill action — replaces
  // the old confirm() prompt. Shows the inferred makeup (client, eng
  // contract, projects, amounts) and gathers invoice number / date /
  // name before POSTing /api/billing/bill-multiple. Mirrors the same
  // flow the Billing tab's bill-selected-modal uses, but driven from a
  // project_ids array instead of pre-staged line items.
  async function openBulkBillModal(projectIds) {
    if (!Array.isArray(projectIds) || !projectIds.length) return;
    // Fetch makeup so the review shows real numbers.
    let makeup = null;
    try {
      makeup = await api('/api/invoices/preview-makeup', 'POST', { project_ids: projectIds });
    } catch (e) {
      return alert('Failed to assemble bill: ' + e.message);
    }
    const m = (makeup && makeup.makeup) || {};
    const conflicts = (makeup && makeup.conflicts) || [];
    const projects = (makeup && makeup.projects) || [];
    const total = projects.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

    const today = new Date().toISOString().split('T')[0];
    const id = 'bulk-bill-modal';
    const titleHTML = `<i class="fa-solid fa-file-invoice-dollar"></i> Bill ${projectIds.length} project${projectIds.length === 1 ? '' : 's'} as one invoice`;
    const bodyHTML = `
      ${conflicts.length ? `
        <div style="background:var(--warning-light,#FFF3E0);border-left:4px solid var(--warning,#F0A500);padding:10px 14px;border-radius:6px;margin-bottom:14px">
          <div style="font-weight:600;color:var(--warning-text,#e65100);margin-bottom:4px"><i class="fa-solid fa-triangle-exclamation"></i> Can't bill yet — fix these first:</div>
          <ul style="margin:6px 0 0 20px;padding:0;font-size:13px">
            ${conflicts.map(c => `<li>${esc(c)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      <div style="background:var(--gray-light);padding:12px 14px;border-radius:8px;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:140px 1fr;gap:6px 12px;font-size:13px">
          <div style="color:var(--text-muted)">Client</div><div><strong>${esc(m.client_name || '—')}</strong></div>
          <div style="color:var(--text-muted)">Engineering Contract</div><div>${esc(m.engineering_contract_name || '—')}</div>
          <div style="color:var(--text-muted)">Job</div><div>${esc(m.job_name || '—')}</div>
          <div style="color:var(--text-muted)">Projects</div><div>${projects.length}</div>
          <div style="color:var(--text-muted)">Total</div><div style="font-weight:700;color:var(--success-text,var(--success))">${fmtMoney(total)}</div>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-row">
          <div class="form-group">
            <label for="bbm-inv-number">Invoice Number *</label>
            <input type="text" id="bbm-inv-number" placeholder="e.g. 2026-04-001">
          </div>
          <div class="form-group">
            <label for="bbm-inv-date">Invoice Date</label>
            <input type="date" id="bbm-inv-date" value="${today}">
          </div>
        </div>
        <div class="form-group">
          <label for="bbm-inv-name">Invoice Name <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
          <input type="text" id="bbm-inv-name" placeholder="e.g. Construction Inspection — April 2026">
        </div>
      </div>
    `;
    const footerHTML = `
      <button class="btn btn-secondary" onclick="closeOverlayModal('${id}')">Cancel</button>
      <button class="btn btn-primary" id="bbm-confirm-btn" onclick="confirmBulkBill(${JSON.stringify(projectIds).replace(/"/g, '&quot;')})" ${conflicts.length ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        <i class="fa-solid fa-check"></i> Create Invoice
      </button>
    `;
    openOverlayModal({ id, titleHTML, bodyHTML, footerHTML });
    setTimeout(() => document.getElementById('bbm-inv-number')?.focus(), 50);
  }

  async function confirmBulkBill(projectIds) {
    const invoice_number = document.getElementById('bbm-inv-number').value.trim();
    const invoice_date = document.getElementById('bbm-inv-date').value || new Date().toISOString().split('T')[0];
    const invoice_name = document.getElementById('bbm-inv-name').value.trim() || null;
    if (!invoice_number) return alert('Invoice number is required.');
    const btn = document.getElementById('bbm-confirm-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Billing...';
    try {
      const res = await api('/api/billing/bill-multiple', 'POST', {
        project_ids: projectIds,
        invoice_number, invoice_date, invoice_name,
      });
      closeOverlayModal('bulk-bill-modal');
      if (window.LFS && window.LFS.toast) {
        window.LFS.toast.success(`Invoice ${invoice_number} created${res.total ? ' for ' + fmtMoney(res.total) : ''}.`);
      } else {
        alert(`Invoice ${invoice_number} created.`);
      }
      if (typeof bulkClearSelection === 'function') bulkClearSelection();
      if (typeof loadProjects === 'function') loadProjects();
      if (typeof loadBilling === 'function') loadBilling();
      if (typeof loadDashboard === 'function') loadDashboard();
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Create Invoice';
      alert('Bulk bill failed: ' + (e.message || e));
    }
  }

  window.bulkBill = bulkBill;
  window.openBulkBillModal = openBulkBillModal;
  window.confirmBulkBill = confirmBulkBill;
})();
