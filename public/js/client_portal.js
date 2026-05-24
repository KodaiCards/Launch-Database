// public/js/client_portal.js — Wave 13B: per-client scoped client portal.
// Wave 16: nested grouping (team → contract → job → area) + dynamic layout.
//
// Modes:
//   customer role        — 3 columns, server scopes to their clients. No toolbar.
//   admin/staff, no filter — per-client sections. Toolbar shows "All clients".
//   admin/staff, client selected — 3 columns for that one client (mimics customer view).
//
// Hide-empty-column rule: all three columns hidden when they have no projects.

(function () {
  'use strict';

  const DESIGN_TYPES = new Set(['design']);
  const PERMIT_TYPES = new Set(['permitting']);
  const CONST_TYPES  = new Set(['construction', 're', 'resident engineer', 'inspection']);

  const STATUS_ORDER = { in_progress: 0, not_started: 1, completed: 2, billed: 3 };

  let currentUser  = null;
  let currentClientId = ''; // '' = all, '<uuid>' = single-client filter
  let lastUpdated  = null;
  let pollTimer    = null;

  // ─── HTML helpers ────────────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

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

  // Derive column bucket from jobs.team when available, else fall back to project_type.
  function columnBucket(p) {
    const team = (p.team || '').toLowerCase();
    if (team === 'design')       return 'design';
    if (team === 'permitting')   return 'permitting';
    if (team === 'construction') return 'construction';
    const t = (p.project_type || '').toLowerCase();
    if (DESIGN_TYPES.has(t))     return 'design';
    if (PERMIT_TYPES.has(t))     return 'permitting';
    if (CONST_TYPES.has(t))      return 'construction';
    return null;
  }

  // ─── Leaf card (area) ────────────────────────────────────────────────────

  function renderAreaCard(p) {
    const areaLabel = p.service_area_label || p.name;
    const money     = formatMoney(p.expected_revenue);
    const hrs       = formatHours(p.actual_hours, p.expected_hours);
    const footage   = formatFootage(p.footage, p.miles);
    const meta = [
      money   ? `<div class="cp-card-money">${escapeHtml(money)}</div>` : '',
      hrs     ? `<div class="cp-card-meta">${escapeHtml(hrs)}</div>` : '',
      footage ? `<div class="cp-card-meta">${escapeHtml(footage)}</div>` : '',
    ].join('');
    return `
      <div class="cp-project-card">
        <div class="cp-card-name">${escapeHtml(areaLabel)}</div>
        ${statusPillHTML(p.derived_status)}
        ${meta}
      </div>`;
  }

  // ─── Grouping tree builder ────────────────────────────────────────────────
  //
  // Returns a nested structure:
  //   { contracts: Map<contractKey, { label, jobs: Map<jobKey, { label, projects: [] }> }> }
  //
  // contractKey = contract_id or '__none__' (no contract).
  // When contractKey is '__none__', the contract level is skipped in rendering.
  // jobKey = job_name or project_type, used as the group-level-2 label.

  function buildGroupingTree(projects) {
    const byStatus = (a, b) =>
      (STATUS_ORDER[a.derived_status] ?? 99) - (STATUS_ORDER[b.derived_status] ?? 99);

    // Map: contractKey → { label, jobs: Map<jobKey, { label, projects }> }
    const contracts = new Map();

    for (const p of projects) {
      const contractKey   = p.contract_id || '__none__';
      const contractLabel = p.contract_id ? (p.contract_label || p.contract_number || 'Contract') : '__none__';
      const jobLabel      = p.job_name || p.project_type || 'Other';

      if (!contracts.has(contractKey)) {
        contracts.set(contractKey, { label: contractLabel, jobs: new Map() });
      }
      const contractEntry = contracts.get(contractKey);

      if (!contractEntry.jobs.has(jobLabel)) {
        contractEntry.jobs.set(jobLabel, { label: jobLabel, projects: [] });
      }
      contractEntry.jobs.get(jobLabel).projects.push(p);
    }

    // Sort projects within each job group by status
    for (const [, c] of contracts) {
      for (const [, j] of c.jobs) {
        j.projects.sort(byStatus);
      }
    }

    return contracts;
  }

  // ─── Render nested column body (contract → job → area) ───────────────────

  function renderNestedColumnBody(projects) {
    if (!projects.length) {
      return '<div class="cp-empty">No projects to display.</div>';
    }

    const contracts = buildGroupingTree(projects);
    let html = '';

    for (const [contractKey, { label: contractLabel, jobs }] of contracts) {
      const hasContract = contractKey !== '__none__';

      if (hasContract) {
        // Group level 1: contract header
        html += `<div class="cp-contract-group">
          <div class="cp-contract-header">
            <i class="fa-solid fa-file-contract cp-contract-icon" aria-hidden="true"></i>
            <span class="cp-contract-label">${escapeHtml(contractLabel)}</span>
          </div>`;
      }

      // Group level 2: job rollups
      for (const [, { label: jobLabel, projects: jobProjects }] of jobs) {
        html += `<div class="cp-job-group">
          <div class="cp-job-header">${escapeHtml(jobLabel)}</div>
          <div class="cp-job-areas">`;
        for (const p of jobProjects) {
          html += renderAreaCard(p);
        }
        html += '</div></div>';
      }

      if (hasContract) {
        html += '</div>'; // close cp-contract-group
      }
    }

    return html;
  }

  // ─── Column element builder ───────────────────────────────────────────────

  function buildColumnEl(type, projects) {
    if (projects.length === 0) return null;

    const configs = {
      design:       { icon: 'fa-drafting-compass', title: 'Design'       },
      permitting:   { icon: 'fa-file-signature',   title: 'Permitting'   },
      construction: { icon: 'fa-hard-hat',          title: 'Construction' },
    };
    const { icon, title } = configs[type];

    const bodyHtml = renderNestedColumnBody(projects);

    const el = document.createElement('section');
    el.className = 'cp-column';
    el.setAttribute('aria-labelledby', `col-${type}-heading`);
    el.innerHTML = `
      <div class="cp-col-header">
        <i class="fa-solid ${icon} cp-col-icon" aria-hidden="true"></i>
        <span class="cp-col-title" id="col-${type}-heading">${title}</span>
      </div>
      <div class="cp-col-body" aria-live="polite" aria-label="${title} projects">
        ${bodyHtml}
      </div>`;
    return el;
  }

  // ─── Dynamic layout grid builder ──────────────────────────────────────────
  //
  // When only ONE non-empty team category exists, expand it to full page width
  // (single-column expanded layout, contract groups flow horizontally inside).
  // When multiple categories exist, keep them as columns sized to fit.

  function renderGrid(projects) {
    const design       = [];
    const permit       = [];
    const construction = [];

    for (const p of projects) {
      const bucket = columnBucket(p);
      if (bucket === 'design')            design.push(p);
      else if (bucket === 'permitting')   permit.push(p);
      else if (bucket === 'construction') construction.push(p);
    }

    const designEl  = buildColumnEl('design', design);
    const permitEl  = buildColumnEl('permitting', permit);
    const constEl   = buildColumnEl('construction', construction);

    if (!designEl && !permitEl && !constEl) return null;

    const nonEmpty = [designEl, permitEl, constEl].filter(Boolean);
    const count    = nonEmpty.length;

    const grid = document.createElement('div');
    grid.setAttribute('role', 'main');
    grid.setAttribute('aria-label', 'Project columns');

    if (count === 1) {
      // Single non-empty category — full-width expanded layout
      grid.className = 'cp-grid cp-grid-single';
      nonEmpty[0].classList.add('cp-column-full');
    } else if (count === 2) {
      grid.className = 'cp-grid cp-grid-two';
    } else {
      grid.className = 'cp-grid cp-grid-three';
    }

    for (const el of nonEmpty) grid.appendChild(el);

    return grid;
  }

  // ─── Render modes ─────────────────────────────────────────────────────────

  function renderSingleClient(projects) {
    const content = document.getElementById('cp-content');
    if (!content) return;

    const grid = renderGrid(projects);
    if (!grid) {
      content.innerHTML = '<div class="cp-empty" style="padding:40px 0;text-align:center">No active projects to display.</div>';
    } else {
      content.innerHTML = '';
      content.appendChild(grid);
    }
  }

  function renderAllClients(projects) {
    const content = document.getElementById('cp-content');
    if (!content) return;

    const byClient = new Map();
    for (const p of projects) {
      const key = p.client_id || '__none__';
      if (!byClient.has(key)) {
        byClient.set(key, { name: p.client_name || 'Unknown Client', rows: [] });
      }
      byClient.get(key).rows.push(p);
    }

    if (byClient.size === 0) {
      content.innerHTML = '<div class="cp-empty" style="padding:40px 0;text-align:center">No active projects to display.</div>';
      return;
    }

    content.innerHTML = '';

    const sorted = Array.from(byClient.entries()).sort((a, b) =>
      a[1].name.localeCompare(b[1].name)
    );

    for (const [, { name, rows }] of sorted) {
      const grid = renderGrid(rows);
      if (!grid) continue;

      const section = document.createElement('div');
      section.className = 'cp-client-section';
      section.innerHTML = `
        <div class="cp-client-heading">
          <i class="fa-solid fa-building" aria-hidden="true"></i>
          ${escapeHtml(name)}
        </div>`;
      section.appendChild(grid);
      content.appendChild(section);
    }

    if (content.children.length === 0) {
      content.innerHTML = '<div class="cp-empty" style="padding:40px 0;text-align:center">No active projects to display.</div>';
    }
  }

  // ─── Page title / subtitle based on mode ─────────────────────────────────

  function updatePageTitle() {
    const titleEl = document.getElementById('cp-page-title');
    const subEl   = document.getElementById('cp-page-sub');
    if (!titleEl || !subEl) return;

    const isCustomer = currentUser && currentUser.role === 'customer';
    if (isCustomer) {
      titleEl.textContent = 'Your Projects';
      subEl.textContent   = 'Design and permitting activity — updates automatically.';
    } else if (currentClientId) {
      const sel = document.getElementById('cp-view-as');
      const clientName = sel ? (sel.options[sel.selectedIndex] || {}).text || 'Selected Client' : 'Selected Client';
      titleEl.textContent = clientName + ' — Projects';
      subEl.textContent   = 'Viewing exactly what this client sees.';
    } else {
      titleEl.textContent = 'All Clients — Project Overview';
      subEl.textContent   = 'Per-client design and permitting activity — updates automatically.';
    }
  }

  // ─── Fetch and render ─────────────────────────────────────────────────────

  async function fetchAndRender() {
    try {
      let url = '/api/client-portal/projects';
      if (currentClientId) url += '?client_id=' + encodeURIComponent(currentClientId);

      const resp = await fetch(url, { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const projects = await resp.json();

      const isCustomer   = currentUser && currentUser.role === 'customer';
      const singleClient = isCustomer || !!currentClientId;

      updatePageTitle();

      if (singleClient) {
        renderSingleClient(projects);
      } else {
        renderAllClients(projects);
      }

      lastUpdated = Date.now();
      updateLastUpdated();
    } catch (err) {
      console.error('[client_portal] fetch failed', err);
    }
  }

  // ─── Admin toolbar init ───────────────────────────────────────────────────

  async function initAdminToolbar() {
    const toolbar = document.getElementById('cp-admin-toolbar');
    const sel     = document.getElementById('cp-view-as');
    if (!toolbar || !sel) return;

    toolbar.style.display = 'flex';

    try {
      const resp = await fetch('/api/client-portal/clients-with-active-projects', { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const clients = await resp.json();

      for (const c of clients) {
        const opt = document.createElement('option');
        opt.value       = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
      }
    } catch (err) {
      console.error('[client_portal] clients fetch failed', err);
    }

    sel.addEventListener('change', function () {
      currentClientId = this.value;
      const notice = document.getElementById('cp-view-as-notice');
      if (notice) {
        notice.textContent = currentClientId
          ? 'Showing exactly what this client sees.'
          : '';
      }
      fetchAndRender();
    });
  }

  // ─── Time label ──────────────────────────────────────────────────────────

  function updateLastUpdated() {
    const el = document.getElementById('cp-last-updated');
    if (!el || !lastUpdated) return;
    const secs = Math.round((Date.now() - lastUpdated) / 1000);
    el.textContent = secs < 5 ? 'Just updated' : `Last updated ${secs}s ago`;
  }

  // ─── Polling ──────────────────────────────────────────────────────────────

  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    setInterval(updateLastUpdated, 5000);
    pollTimer = setInterval(fetchAndRender, 20000);
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', async function () {
    try {
      const meResp = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (meResp.ok) currentUser = await meResp.json();
    } catch (_) { /* continue without user — behave as customer */ }

    const isCustomer = !currentUser || currentUser.role === 'customer';
    if (!isCustomer) {
      await initAdminToolbar();
    }

    await fetchAndRender();
    startPolling();
  });
})();
