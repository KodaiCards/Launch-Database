// public/js/invoice_templates.js — Invoice Templates settings + preview.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Reference-PDF-driven invoice generator. Owner uploads a PDF sample
// per (job, client); Claude vision analyses the layout once and stores
// the resulting HTML template (with mustache placeholders). At billing
// time the system fills + renders to PDF via puppeteer. Falls back to
// the hardcoded PSC RUS pdfkit layout when no template exists.
//
// Surfaces:
//   - Settings → Invoice Templates panel (list + upload + edit/delete)
//   - Invoice preview modal (filled HTML editable before PDF render)
//
// Globals this module reads:
//   api()                          — fetch wrapper from /js/api.js
//   esc()                          — global helper
//   openModal(), closeModal()      — global modal helpers
//   jobsCache, clients             — global caches
//   window.LFS.toast               — typed toast helper

(function () {
  let invoiceTemplatesCache = [];
  const INVOICE_TEMPLATE_FIELDS = [
    '{{client.name}}', '{{job.name}}', '{{job.billing_code}}',
    '{{period.start}}', '{{period.end}}', '{{period.month_year}}',
    '{{rate.amount}}', '{{rate.formatted}}',
    '{{engineering_contract.name}}', '{{engineering_contract.number}}',
    '{{engineering_contract.loan_name}}',
    '{{totals.hours}}', '{{totals.footage}}', '{{totals.amount}}',
    '{{generated_at}}', '{{is_footage}}', '{{is_permitting}}',
    '{{#each contracts}} … {{friendly_label}} {{contract_amount}} {{#each wos}} {{work_order_number}} {{hours}} {{amount}} {{/each}} {{/each}}',
    '{{#each timecards}} … {{staff_name}} {{total_hours}} {{#each entries}} {{date}} {{wo}} {{hours}} {{/each}} {{/each}}',
  ];

  async function loadInvoiceTemplates() {
    try {
      invoiceTemplatesCache = await api('/api/invoice-templates');
    } catch (e) {
      invoiceTemplatesCache = [];
      throw e;
    }
  }

  function renderInvoiceTemplatesList() {
    const root = document.getElementById('invoice-templates-list-body');
    if (!root) return;
    const list = invoiceTemplatesCache || [];
    if (!list.length) {
      root.innerHTML = '<div class="empty-state" style="padding:12px;text-align:center;color:var(--text-muted)">No invoice templates yet. Upload a PDF sample for a (Job, Client) to get started.</div>';
      return;
    }
    root.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--gray-light)">
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Job</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Client</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Name</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Status</th>
            <th style="padding:8px;text-align:left;font-size:11px;color:var(--text-muted);text-transform:uppercase">Updated</th>
            <th style="padding:8px;text-align:right"></th>
          </tr>
        </thead>
        <tbody>
          ${list.map(t => {
            const status = t.analysis_status === 'ready'
              ? `<span style="background:var(--success-light);color:var(--success-text);padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600">Ready</span>`
              : t.analysis_status === 'failed'
              ? `<span style="background:var(--danger-light);color:var(--danger-text);padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600" title="${esc(t.analysis_error || '')}">Failed</span>`
              : `<span style="background:var(--warning-light);color:var(--warning-text);padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600">Pending</span>`;
            const updated = t.updated_at ? new Date(t.updated_at).toLocaleDateString() : '—';
            return `<tr style="border-top:1px solid var(--gray-border)">
              <td style="padding:6px 8px;font-weight:500">${esc(t.job_name || '—')}</td>
              <td style="padding:6px 8px">${esc(t.client_name || '—')}</td>
              <td style="padding:6px 8px;color:var(--text-muted)">${esc(t.name || '—')}</td>
              <td style="padding:6px 8px">${status}</td>
              <td style="padding:6px 8px;color:var(--text-muted);font-size:11px">${esc(updated)}</td>
              <td style="padding:6px 8px;text-align:right;white-space:nowrap">
                <button class="btn btn-sm btn-secondary" onclick="openInvoiceTemplateEdit('${esc(t.id)}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  // Upload modal — populates Job + Client dropdowns from existing caches.
  function openInvoiceTemplateUploadModal() {
    const jobSel = document.getElementById('itu-job');
    const cliSel = document.getElementById('itu-client');
    if (jobSel) {
      jobSel.innerHTML = '<option value="">— Select —</option>';
      const jobs = (typeof jobsCache !== 'undefined' && Array.isArray(jobsCache)) ? jobsCache : [];
      [...jobs].sort((a,b) => (a.name||'').localeCompare(b.name||''))
        .forEach(j => jobSel.add(new Option(j.name, j.id)));
    }
    if (cliSel) {
      cliSel.innerHTML = '<option value="">— Select —</option>';
      const cls = (typeof clients !== 'undefined' && Array.isArray(clients)) ? clients : [];
      [...cls].sort((a,b) => (a.name||'').localeCompare(b.name||''))
        .forEach(c => cliSel.add(new Option(c.name, c.id)));
    }
    document.getElementById('itu-name').value = '';
    document.getElementById('itu-notes').value = '';
    document.getElementById('itu-file').value = '';
    document.getElementById('itu-error').style.display = 'none';
    openModal('invoice-template-upload-modal');
  }

  async function submitInvoiceTemplateUpload() {
    const jobId = document.getElementById('itu-job').value;
    const clientId = document.getElementById('itu-client').value;
    const name = document.getElementById('itu-name').value.trim();
    const notes = document.getElementById('itu-notes').value.trim();
    const file = document.getElementById('itu-file').files[0];
    const errEl = document.getElementById('itu-error');
    errEl.style.display = 'none';
    if (!jobId || !clientId) { errEl.textContent = 'Job and Client are required.'; errEl.style.display = 'block'; return; }
    if (!file) { errEl.textContent = 'PDF file required.'; errEl.style.display = 'block'; return; }
    if (file.size > 50 * 1024 * 1024) {
      errEl.textContent = `File exceeds 50 MB limit (got ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
      errEl.style.display = 'block';
      return;
    }
    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('job_id', jobId);
    fd.append('client_id', clientId);
    if (name) fd.append('name', name);
    if (notes) fd.append('notes', notes);

    const btn = document.getElementById('itu-submit-btn');
    const progWrap = document.getElementById('itu-progress-wrap');
    const progBar = document.getElementById('itu-progress-bar');
    const progPct = document.getElementById('itu-progress-pct');
    const progLabel = document.getElementById('itu-progress-label');
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading…';
    progWrap.style.display = '';
    progBar.style.width = '0';
    progPct.textContent = '0%';
    progLabel.textContent = `Uploading ${(file.size / 1024 / 1024).toFixed(1)} MB…`;
    try {
      const data = await apiUpload('/api/invoice-templates', fd, {
        onProgress: (loaded, total) => {
          const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
          progBar.style.width = pct + '%';
          progBar.setAttribute('aria-valuenow', pct);
          progPct.textContent = pct + '%';
          if (pct >= 100) {
            // Upload finished — server is now running Claude analysis (15-30s).
            // Swap the label to make it clear we're not still pushing bytes.
            progLabel.textContent = 'Analyzing… (15-30s)';
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing…';
          }
        },
      });
      closeModal('invoice-template-upload-modal');
      await loadInvoiceTemplates();
      renderInvoiceTemplatesList();
      if (data.analysis && data.analysis.ok === false) {
        alert(`Template saved, but AI analysis failed: ${data.analysis.error || 'unknown'}.\nYou can re-analyze from the template detail.`);
      } else if (window.LFS && window.LFS.toast) {
        window.LFS.toast.success('Template uploaded and analyzed.');
      }
    } catch (e) {
      errEl.textContent = 'Failed: ' + (e.message || e);
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Upload &amp; Analyze';
      progWrap.style.display = 'none';
    }
  }

  async function openInvoiceTemplateEdit(id) {
    let t;
    try { t = await api('/api/invoice-templates/' + id); }
    catch (e) { alert('Failed to load: ' + e.message); return; }
    document.getElementById('ite-id').value = t.id;
    document.getElementById('ite-title').textContent =
      `Edit Template — ${t.job_name || '?'} · ${t.client_name || '?'}`;
    document.getElementById('ite-html').value = t.generated_html || '';
    document.getElementById('ite-status').textContent =
      t.analysis_status === 'ready' ? `Ready · last analyzed ${t.analyzed_at ? new Date(t.analyzed_at).toLocaleString() : '—'}`
      : t.analysis_status === 'failed' ? `Analysis failed: ${t.analysis_error || 'unknown'}`
      : 'Pending analysis';
    document.getElementById('ite-schema-doc').textContent = INVOICE_TEMPLATE_FIELDS.join('\n');
    refreshInvoiceTemplatePreview();
    openModal('invoice-template-edit-modal');
  }

  function refreshInvoiceTemplatePreview() {
    const html = document.getElementById('ite-html').value || '<div style="color:#888;padding:20px">No HTML yet.</div>';
    const iframe = document.getElementById('ite-preview');
    if (!iframe) return;
    iframe.srcdoc = html;
  }

  async function saveInvoiceTemplate() {
    const id = document.getElementById('ite-id').value;
    const generated_html = document.getElementById('ite-html').value;
    try {
      await api('/api/invoice-templates/' + id, 'PUT', { generated_html });
      if (window.LFS && window.LFS.toast) window.LFS.toast.success('Template saved.');
      document.getElementById('ite-status').textContent = 'Saved · ' + new Date().toLocaleTimeString();
      await loadInvoiceTemplates(); renderInvoiceTemplatesList();
    } catch (e) { alert('Save failed: ' + e.message); }
  }

  async function regenerateInvoiceTemplate() {
    const id = document.getElementById('ite-id').value;
    if (!id) return;
    if (!confirm('Re-analyze the original PDF? This overwrites your current template HTML and takes 15-30s.')) return;
    const btn = document.getElementById('ite-regenerate-btn');
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing…';
    try {
      const data = await api('/api/invoice-templates/' + id + '/regenerate', 'POST');
      if (data.analysis && data.analysis.ok === false) {
        alert('Re-analysis failed: ' + (data.analysis.error || 'unknown'));
      } else {
        const t = await api('/api/invoice-templates/' + id);
        document.getElementById('ite-html').value = t.generated_html || '';
        document.getElementById('ite-status').textContent =
          `Ready · re-analyzed ${new Date().toLocaleString()}`;
        refreshInvoiceTemplatePreview();
        await loadInvoiceTemplates(); renderInvoiceTemplatesList();
      }
    } catch (e) {
      alert('Re-analysis failed: ' + e.message);
    } finally {
      btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Re-analyze PDF';
    }
  }

  async function deleteInvoiceTemplate() {
    const id = document.getElementById('ite-id').value;
    if (!id) return;
    if (!confirm('Delete this invoice template? The reference PDF will also be removed. The hardcoded fallback path will resume for this (job, client) until a new template is uploaded.')) return;
    try {
      await api('/api/invoice-templates/' + id, 'DELETE');
      closeModal('invoice-template-edit-modal');
      await loadInvoiceTemplates(); renderInvoiceTemplatesList();
      if (window.LFS && window.LFS.toast) window.LFS.toast.success('Template deleted.');
    } catch (e) { alert('Delete failed: ' + e.message); }
  }

  function openReferencePdf() {
    const id = document.getElementById('ite-id').value;
    if (!id) return;
    // Open in a new tab; auth is cookie-based so the GET works without
    // additional headers. The route streams the PDF inline.
    window.open('/api/invoice-templates/' + id + '/reference', '_blank', 'noopener');
  }

  // ─ Invoice Preview (billing flow) ────────────────────────────────────
  // Called from the bill-selected flow when the system has a template
  // for the invoice's (job, client) pair. Shows the filled HTML in an
  // iframe; admin can edit before downloading the final PDF.
  async function openInvoicePreviewFromTemplate(payload) {
    let resp;
    try {
      resp = await api('/api/invoices/preview-template', 'POST', payload);
    } catch (e) {
      alert('Preview failed: ' + e.message);
      return null;
    }
    if (!resp.has_template) {
      return resp;   // caller decides whether to fall back to legacy generator
    }
    document.getElementById('ipv-html').value = resp.html || '';
    document.getElementById('ipv-status').textContent = 'Loaded from template — edit if needed before downloading.';
    refreshInvoicePreviewIframe();
    openModal('invoice-preview-modal');
    return resp;
  }

  function refreshInvoicePreviewIframe() {
    const html = document.getElementById('ipv-html').value || '';
    const iframe = document.getElementById('ipv-preview');
    if (iframe) iframe.srcdoc = html;
  }

  async function downloadInvoicePdfFromPreview() {
    const html = document.getElementById('ipv-html').value;
    if (!html) { alert('No HTML to render.'); return; }
    const status = document.getElementById('ipv-status');
    status.textContent = 'Rendering PDF…';
    try {
      const r = await fetch('/api/invoices/render-pdf-from-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ html, filename: 'invoice.pdf' }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = 'Rendered.';
    } catch (e) {
      status.textContent = 'Render failed: ' + (e.message || e);
      alert('Render failed: ' + e.message);
    }
  }

  window.loadInvoiceTemplates = loadInvoiceTemplates;
  window.renderInvoiceTemplatesList = renderInvoiceTemplatesList;
  window.openInvoiceTemplateUploadModal = openInvoiceTemplateUploadModal;
  window.submitInvoiceTemplateUpload = submitInvoiceTemplateUpload;
  window.openInvoiceTemplateEdit = openInvoiceTemplateEdit;
  window.refreshInvoiceTemplatePreview = refreshInvoiceTemplatePreview;
  window.saveInvoiceTemplate = saveInvoiceTemplate;
  window.regenerateInvoiceTemplate = regenerateInvoiceTemplate;
  window.deleteInvoiceTemplate = deleteInvoiceTemplate;
  window.openReferencePdf = openReferencePdf;
  window.openInvoicePreviewFromTemplate = openInvoicePreviewFromTemplate;
  window.refreshInvoicePreviewIframe = refreshInvoicePreviewIframe;
  window.downloadInvoicePdfFromPreview = downloadInvoicePdfFromPreview;
})();
