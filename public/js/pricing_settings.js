// public/js/pricing_settings.js — Pricing entries Settings panel.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Legacy "pricing entries" CRUD — per (project_type, job) combination,
// stores a billing_code + billing_type + rate. The newer Jobs settings
// owns most of this responsibility now (per-job rate + billing type),
// but pricing_entries are still consumed by the CSV import's billing-
// code → job mapping and a few legacy reports.
//
// Globals this module reads:
//   api(), esc(), fmtMoney()        — global helpers
//   pricingCache                    — global cache (lifted to window)
//   projectTypesCache               — global cache loaded by loadProjectTypes()
//   jobsCache                       — global cache loaded by loadJobs()
//   refreshSettingsDot()            — global helper
//
// Functions exposed on window for inline event handlers:
//   populatePricingFormDropdowns, renderPricingList, savePricingEntry,
//   editPricingEntry, deletePricingEntry

(function () {
  function populatePricingFormDropdowns() {
    const tSel = document.getElementById('new-pe-type');
    const jSel = document.getElementById('new-pe-job');
    const types = (typeof projectTypesCache !== 'undefined' && projectTypesCache) ? projectTypesCache : [];
    const jobs = (typeof jobsCache !== 'undefined' && jobsCache) ? jobsCache : [];
    if (tSel) {
      tSel.innerHTML = '<option value="">Select type...</option>' +
        types.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
    }
    if (jSel) {
      jSel.innerHTML = '<option value="">Select job...</option>' +
        jobs.map(j => {
          const label = j.name === 'Permitting' ? 'Permitting (DOT)' : j.name;
          return `<option value="${j.id}">${esc(label)}${j.is_permitting ? ' (Permitting)' : ''}</option>`;
        }).join('');
    }
  }

  function renderPricingList() {
    const root = document.getElementById('pricing-list-body');
    if (!root) return;
    const cache = (typeof pricingCache !== 'undefined' && pricingCache) ? pricingCache : [];
    if (!cache.length) {
      root.innerHTML = '<div class="empty-state" style="padding:24px;text-align:center;color:var(--text-muted)">No pricing entries yet. Add one above.</div>';
      return;
    }

    // Group by project type for readability
    const byType = {};
    cache.forEach(pe => {
      const k = pe.project_type_name || '— No type —';
      (byType[k] = byType[k] || []).push(pe);
    });

    let html = '';
    for (const [typeName, entries] of Object.entries(byType)) {
      html += `<div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--primary);padding:6px 0;border-bottom:2px solid var(--primary-light);margin-bottom:6px">${esc(typeName)}</div>
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <thead><tr style="color:var(--text-muted);font-size:11px;text-transform:uppercase">
            <th style="text-align:left;padding:6px 8px">Job</th>
            <th style="text-align:left;padding:6px 8px">Code</th>
            <th style="text-align:left;padding:6px 8px">Type</th>
            <th style="text-align:right;padding:6px 8px">Rate</th>
            <th style="text-align:left;padding:6px 8px">Notes</th>
            <th></th>
          </tr></thead>
          <tbody>${entries.map(pe => `<tr style="border-top:1px solid var(--gray-border)">
            <td style="padding:6px 8px;font-weight:600">${esc(pe.job_name || '—')}${pe.is_permitting ? ' <span style="color:var(--warning);font-size:10px;margin-left:4px">⚡ permit calc</span>' : ''}</td>
            <td style="padding:6px 8px;font-family:monospace;font-size:12px">${esc(pe.billing_code || '—')}</td>
            <td style="padding:6px 8px">${esc(pe.billing_type)}</td>
            <td style="padding:6px 8px;text-align:right;font-weight:600">${pe.rate != null ? fmtMoney(pe.rate) : '—'}${pe.billing_type === 'hourly' ? '/hr' : pe.billing_type === 'footage' ? '/mi' : ''}</td>
            <td style="padding:6px 8px;color:var(--text-muted)">${esc(pe.notes || '')}</td>
            <td style="padding:6px 8px;text-align:right;white-space:nowrap">
              <button class="btn btn-sm btn-secondary btn-icon" onclick="editPricingEntry('${pe.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="deletePricingEntry('${pe.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
    }
    root.innerHTML = html;
  }

  async function savePricingEntry() {
    const project_type_id = document.getElementById('new-pe-type').value;
    const job_id = document.getElementById('new-pe-job').value;
    const billing_code = document.getElementById('new-pe-code').value.trim() || null;
    const billing_type = document.getElementById('new-pe-billing-type').value;
    const rate = parseFloat(document.getElementById('new-pe-rate').value);
    const notes = document.getElementById('new-pe-notes').value.trim() || null;

    if (!project_type_id || !job_id) return alert('Project type and job are required.');
    if (isNaN(rate) || rate < 0) return alert('Enter a valid non-negative rate.');

    try {
      await api('/api/pricing', 'POST', { project_type_id, job_id, billing_code, billing_type, rate, notes });
      document.getElementById('new-pe-code').value = '';
      document.getElementById('new-pe-rate').value = '';
      document.getElementById('new-pe-notes').value = '';
      window.pricingCache = await api('/api/pricing');
      renderPricingList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function editPricingEntry(id) {
    const cache = (typeof pricingCache !== 'undefined' && pricingCache) ? pricingCache : [];
    const pe = cache.find(p => p.id === id);
    if (!pe) return;
    const newRate = prompt(`Update rate for ${pe.job_name} (${pe.project_type_name})\nCurrent: ${pe.rate}`, pe.rate);
    if (newRate === null) return;
    const r = parseFloat(newRate);
    if (isNaN(r) || r < 0) return alert('Invalid rate.');
    try {
      await api('/api/pricing/' + id, 'PUT', { rate: r });
      window.pricingCache = await api('/api/pricing');
      renderPricingList();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  async function deletePricingEntry(id) {
    if (!confirm('Delete this pricing entry?')) return;
    try {
      await api('/api/pricing/' + id, 'DELETE');
      window.pricingCache = await api('/api/pricing');
      renderPricingList();
      if (typeof refreshSettingsDot === 'function') refreshSettingsDot();
    } catch (e) { alert('Failed: ' + e.message); }
  }

  window.populatePricingFormDropdowns = populatePricingFormDropdowns;
  window.renderPricingList = renderPricingList;
  window.savePricingEntry = savePricingEntry;
  window.editPricingEntry = editPricingEntry;
  window.deletePricingEntry = deletePricingEntry;
})();
