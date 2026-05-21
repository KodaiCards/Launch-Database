// public/js/client_portal.js — client portal beta: fetch + render + poll.
//
// Three columns: Design | Permitting | Construction (deferred).
// Polls every 20s and re-renders with a "last updated" footer.

(function () {
  'use strict';

  // project_type values that map to each column
  const DESIGN_TYPES = new Set(['design', 're', 'resident engineer', 'inspection']);
  const PERMIT_TYPES = new Set(['permitting']);

  // Sort order for derived_status within a column
  const STATUS_ORDER = { in_progress: 0, not_started: 1, completed: 2, billed: 3 };

  let lastUpdated = null;
  let pollTimer = null;

  function statusPillHTML(derived) {
    const map = {
      not_started: { cls: 'pill-gray',  label: 'Not Started' },
      in_progress: { cls: 'pill-blue',  label: 'In Progress' },
      completed:   { cls: 'pill-green', label: 'Completed'   },
      billed:      { cls: 'pill-teal',  label: 'Billed'      },
    };
    const s = map[derived] || { cls: 'pill-gray', label: derived };
    return `<span class="cp-pill ${s.cls}" role="status">${s.label}</span>`;
  }

  function formatMoney(val) {
    if (val == null || val === '' || Number(val) === 0) return null;
    return '$' + Number(val).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function formatHours(actual, expected) {
    const a = Number(actual);
    const e = Number(expected);
    if (!a && !e) return null;
    if (a && e)  return `${a.toFixed(1)} hrs logged / ${e.toFixed(1)} hrs est.`;
    if (a)       return `${a.toFixed(1)} hrs logged`;
    return `${e.toFixed(1)} hrs est.`;
  }

  function formatFootage(footage, miles) {
    if (footage && Number(footage) > 0) {
      return Number(footage).toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ft';
    }
    if (miles && Number(miles) > 0) {
      return Number(miles).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mi';
    }
    return null;
  }

  function renderCard(p) {
    const money   = formatMoney(p.expected_revenue);
    const hrs     = formatHours(p.actual_hours, p.expected_hours);
    const footage = formatFootage(p.footage, p.miles);

    const meta = [
      money   ? `<div class="cp-card-money">${money}</div>` : '',
      hrs     ? `<div class="cp-card-meta">${hrs}</div>` : '',
      footage ? `<div class="cp-card-meta">${footage}</div>` : '',
    ].join('');

    return `
      <div class="cp-project-card">
        <div class="cp-card-name">${escapeHtml(p.name)}</div>
        ${statusPillHTML(p.derived_status)}
        ${meta}
      </div>`;
  }

  function renderColumn(projects) {
    if (!projects.length) {
      return '<div class="cp-empty">No projects to display.</div>';
    }
    return projects.map(renderCard).join('');
  }

  function groupAndSort(projects) {
    const design  = [];
    const permit  = [];

    for (const p of projects) {
      const t = (p.project_type || '').toLowerCase();
      if (DESIGN_TYPES.has(t)) design.push(p);
      else if (PERMIT_TYPES.has(t)) permit.push(p);
      // other types intentionally omitted from client view
    }

    const byStatus = (a, b) =>
      (STATUS_ORDER[a.derived_status] ?? 99) - (STATUS_ORDER[b.derived_status] ?? 99);

    design.sort(byStatus);
    permit.sort(byStatus);

    return { design, permit };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateLastUpdated() {
    const el = document.getElementById('cp-last-updated');
    if (!el || !lastUpdated) return;
    const secs = Math.round((Date.now() - lastUpdated) / 1000);
    el.textContent = secs < 5 ? 'Just updated' : `Last updated ${secs}s ago`;
  }

  async function fetchAndRender() {
    try {
      const resp = await fetch('/api/client-portal/projects', { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const projects = await resp.json();

      const { design, permit } = groupAndSort(projects);

      const designCol = document.getElementById('cp-col-design');
      const permitCol = document.getElementById('cp-col-permit');

      if (designCol) designCol.innerHTML = renderColumn(design);
      if (permitCol) permitCol.innerHTML = renderColumn(permit);

      lastUpdated = Date.now();
      updateLastUpdated();
    } catch (err) {
      console.error('[client_portal] fetch failed', err);
    }
  }

  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    // Update the "X seconds ago" label every 5s without a full fetch
    setInterval(updateLastUpdated, 5000);
    // Full refetch every 20s
    pollTimer = setInterval(fetchAndRender, 20000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchAndRender();
    startPolling();
  });
})();
