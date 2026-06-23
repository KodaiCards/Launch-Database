/* public/js/money_view.js — Admin "Money" view (Phase 4) */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    loadMargin();
    loadAging();
  });

  const fmt = n => '$' + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── Margin ────────────────────────────────────────────────────────────────

  async function loadMargin() {
    const card = document.getElementById('margin-card');
    try {
      const res = await fetch('/api/money/margin', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        card.innerHTML = lockMsg(); return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      renderMargin(data);
    } catch (e) {
      card.innerHTML = errMsg(e);
    }
  }

  function renderMargin(data) {
    const rows = data.rows || [];
    const card = document.getElementById('margin-card');
    if (!rows.length) {
      card.innerHTML = '<div class="empty-state"><i class="fa-solid fa-scale-balanced"></i>No service areas yet.</div>';
      return;
    }
    const t = data.totals || {};
    card.innerHTML = `<div class="table-wrap"><table>
      <thead><tr>
        <th>Client</th><th>Service Area</th><th class="num">Jobs</th>
        <th class="num">Estimated</th><th class="num">Billed</th><th class="num">Variance</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td>${esc(r.client_name || '—')}</td>
          <td>${esc(r.service_area_name || '—')}</td>
          <td class="num">${r.job_count}</td>
          <td class="num">${fmt(r.estimated_total)}</td>
          <td class="num">${fmt(r.billed_total)}</td>
          <td class="num ${varClass(r.variance)}">${varStr(r.variance)}</td>
        </tr>`).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="2">All service areas</td>
        <td></td>
        <td class="num">${fmt(t.estimated_total)}</td>
        <td class="num">${fmt(t.billed_total)}</td>
        <td class="num ${varClass(t.variance)}">${varStr(t.variance)}</td>
      </tr></tfoot>
    </table></div>`;
  }

  function varClass(v) { return (v || 0) >= 0 ? 'pos' : 'neg'; }
  function varStr(v) { const n = Number(v) || 0; return (n >= 0 ? '+' : '−') + fmt(Math.abs(n)).slice(1); }

  // ── AR aging ──────────────────────────────────────────────────────────────

  async function loadAging() {
    const card = document.getElementById('aging-card');
    try {
      const res = await fetch('/api/money/aging', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        card.innerHTML = lockMsg();
        document.getElementById('aging-grid').innerHTML = '';
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      renderAging(data);
    } catch (e) {
      card.innerHTML = errMsg(e);
    }
  }

  function renderAging(data) {
    const b = data.buckets || {};
    const order = [['0-30', 'b0'], ['31-60', 'b1'], ['61-90', 'b2'], ['90+', 'b3']];
    document.getElementById('aging-grid').innerHTML = order.map(([key, cls]) => {
      const bk = b[key] || { label: key, count: 0, total: 0 };
      return `<div class="aging-card ${cls}">
        <div class="aging-label">${esc(bk.label)}</div>
        <div class="aging-total">${fmt(bk.total)}</div>
        <div class="aging-count">${bk.count} invoice${bk.count === 1 ? '' : 's'}</div>
      </div>`;
    }).join('');

    // Flatten all bucketed invoices into one detail table, oldest first.
    const all = [];
    for (const [key] of order) (b[key]?.invoices || []).forEach(inv => all.push({ ...inv, bucket: b[key].label }));
    const card = document.getElementById('aging-card');
    if (!all.length) {
      card.innerHTML = '<div class="empty-state"><i class="fa-regular fa-circle-check"></i>No outstanding invoices.</div>';
      return;
    }
    all.sort((x, y) => (y.age_days || 0) - (x.age_days || 0));
    card.innerHTML = `<div class="table-wrap"><table>
      <thead><tr>
        <th>Invoice #</th><th>Client</th><th>Date</th><th>Age</th><th>Status</th><th class="num">Total</th>
      </tr></thead>
      <tbody>
        ${all.map(inv => `<tr style="cursor:pointer" onclick="openInvModal('${esc(inv.id)}','${esc(inv.invoice_number||'Invoice')}')">
          <td><a style="color:var(--primary);text-decoration:none">${esc(inv.invoice_number || '—')}</a></td>
          <td>${esc(inv.client_name || '—')}</td>
          <td>${esc(inv.invoice_date || '—')}</td>
          <td>${inv.age_days != null ? inv.age_days + 'd' : '—'}</td>
          <td><span class="tag">${esc(inv.status || '—')}</span></td>
          <td class="num">${fmt(inv.total_amount)}</td>
        </tr>`).join('')}
      </tbody>
      <tfoot><tr>
        <td colspan="5">${data.invoice_count} outstanding</td>
        <td class="num">${fmt(data.grand_total)}</td>
      </tr></tfoot>
    </table></div>`;
  }

  // ── Invoice drill-in modal ────────────────────────────────────────────────

  window.openInvModal = async function (id, num) {
    const modal = document.getElementById('inv-modal');
    const body  = document.getElementById('inv-modal-body');
    const title = document.getElementById('inv-modal-title');
    title.textContent = 'Invoice ' + num;
    body.innerHTML = '<div class="loading-row"><span class="spinner"></span>Loading…</div>';
    modal.classList.remove('hidden');
    try {
      const res = await fetch(`/api/money/invoice/${encodeURIComponent(id)}`, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const { invoice: inv, items } = await res.json();
      body.innerHTML = `
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;font-size:13px">
          <div><strong>Client:</strong> ${esc(inv.client_name || '—')}</div>
          <div><strong>Date:</strong> ${esc(inv.invoice_date || '—')}</div>
          <div><strong>Status:</strong> <span class="tag">${esc(inv.status || '—')}</span></div>
          <div><strong>Total:</strong> ${fmt(inv.total_amount)}</div>
        </div>
        ${items.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Description</th><th>Project</th><th class="num">Qty</th><th>Unit</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>
          <tbody>${items.map(it => `<tr>
            <td>${esc(it.description || '—')}</td>
            <td>${esc(it.project_name || '—')}</td>
            <td class="num">${it.quantity != null ? it.quantity : '—'}</td>
            <td>${esc(it.unit || '—')}</td>
            <td class="num">${it.rate != null ? fmt(it.rate) : '—'}</td>
            <td class="num">${fmt(it.amount)}</td>
          </tr>`).join('')}</tbody>
          <tfoot><tr><td colspan="5">Total</td><td class="num">${fmt(inv.total_amount)}</td></tr></tfoot>
        </table></div>` : '<div class="empty-state"><i class="fa-regular fa-file"></i>No line items.</div>'}`;
    } catch (e) {
      body.innerHTML = errMsg(e);
    }
  };

  window.closeInvModal = function () {
    document.getElementById('inv-modal').classList.add('hidden');
  };

  // ── Export ────────────────────────────────────────────────────────────────

  window.exportInvoices = function () {
    window.location.href = '/api/money/invoices.csv';
  };

  // ── Shared ────────────────────────────────────────────────────────────────

  function lockMsg() { return '<div class="empty-state"><i class="fa-solid fa-lock"></i>Manager or admin access required.</div>'; }
  function errMsg(e) { return `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i>Failed to load. ${esc(e.message || '')}</div>`; }

  window.toggleDark = function () {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('lfs-theme', dark ? 'light' : 'dark');
    updateDmIcon();
  };
  function applyStoredTheme() {
    const stored = localStorage.getItem('lfs-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    updateDmIcon();
  }
  function updateDmIcon() {
    const icon = document.getElementById('dm-icon');
    if (!icon) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
