// billing_view.js — invoices list (new model) with expandable line items.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.documentElement.setAttribute('data-theme', localStorage.getItem('lfs_theme') || 'light');
  $('themeToggle').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t); localStorage.setItem('lfs_theme', t);
  });

  (async () => {
    let invoices;
    try { invoices = await api('/api/billing/invoices'); }
    catch (e) { $('invoiceList').innerHTML = `<div class="muted">Failed to load: ${esc(e.message)}</div>`; return; }
    if (!invoices.length) { $('invoiceList').innerHTML = `<div class="muted">No invoices yet — bill a service area's ready jobs to create one.</div>`; return; }

    $('invoiceList').innerHTML = invoices.map(inv => {
      const cls = inv.status === 'paid' ? 'pill-paid' : (inv.status === 'sent' ? 'pill-sent' : 'pill-draft');
      const items = (inv.items || []).map(it =>
        `<div class="item"><span>${esc(it.description)}</span><span class="muted">${Number(it.quantity || 0)} ${esc(it.unit || '')} · </span><span>${money(it.amount)}</span></div>`).join('')
        || '<div class="muted" style="padding:6px 0">No line items.</div>';
      return `<div class="inv">
        <div class="inv-h" data-inv="${inv.id}">
          <div><div class="inv-num">${esc(inv.invoice_number || inv.id.slice(0, 8))}</div>
            <div class="inv-meta">${esc(inv.client_name || '')} · ${esc(inv.invoice_date || '')} · ${(inv.items || []).length} item(s)</div></div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="pill ${cls}">${esc(inv.status || 'draft')}</span>
            <span class="inv-total">${money(inv.total_amount)}</span>
          </div>
        </div>
        <div class="items" id="items-${inv.id}">${items}</div>
      </div>`;
    }).join('');

    document.querySelectorAll('.inv-h').forEach(h =>
      h.addEventListener('click', () => $('items-' + h.dataset.inv).classList.toggle('open')));
  })();
})();
