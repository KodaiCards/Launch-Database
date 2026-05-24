// public/js/client_portal.js — Wave 13B: per-client scoped client portal.
// Wave 16: nested grouping (team → contract → job → area) + dynamic layout.
// Wave 18: collapsible tree at every node level + per-node overviews + clickable leaf detail.
//
// Modes:
//   customer role        — 3 columns, server scopes to their clients. No toolbar.
//   admin/staff, no filter — per-client sections. Toolbar shows "All clients".
//   admin/staff, client selected — 3 columns for that one client (mimics customer view).
//
// Hide-empty-column rule: all three columns hidden when they have no projects.
//
// Tree collapse state stored in sessionStorage so it survives a poll refresh
// within the same browser session but resets on a new tab/window.

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

  // ─── Session-persisted collapse state ────────────────────────────────────
  // Keys stored: 'cp_collapsed_<nodeId>' = '1'
  // By default every node is EXPANDED except job-level nodes, which start
  // collapsed (so the initial view shows contracts but not individual leaf cards
  // until you drill in).

  const STORAGE_PREFIX = 'cp_collapsed_';

  function isCollapsed(nodeId) {
    return sessionStorage.getItem(STORAGE_PREFIX + nodeId) === '1';
  }

  function setCollapsed(nodeId, collapsed) {
    if (collapsed) {
      sessionStorage.setItem(STORAGE_PREFIX + nodeId, '1');
    } else {
      sessionStorage.removeItem(STORAGE_PREFIX + nodeId);
    }
  }

  // When a parent collapses, cascade-collapse its children so that
  // re-expanding the parent doesn't show previously-expanded grandchildren.
  function cascadeCollapse(nodeId) {
    const prefix = STORAGE_PREFIX + nodeId + '-';
    const toRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    toRemove.forEach(k => sessionStorage.removeItem(k));
  }

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

  // ─── Overview computation ────────────────────────────────────────────────
  //
  // Given an array of leaf projects, compute rolled-up stats for display
  // in a node header. All computation is client-side from the API rows.

  function computeOverview(projects) {
    const counts = {};
    let totalHours = 0;
    let totalCost = 0;
    let hasCost = false;

    for (const p of projects) {
      const s = p.derived_status || 'not_started';
      counts[s] = (counts[s] || 0) + 1;
      totalHours += Number(p.actual_hours) || 0;
      if (p.expected_revenue && Number(p.expected_revenue) > 0) {
        totalCost += Number(p.expected_revenue);
        hasCost = true;
      }
    }

    const total = projects.length;
    const statusParts = [];
    if (counts.in_progress) statusParts.push(`${counts.in_progress} in progress`);
    if (counts.not_started) statusParts.push(`${counts.not_started} not started`);
    if (counts.completed)   statusParts.push(`${counts.completed} completed`);
    if (counts.billed)      statusParts.push(`${counts.billed} billed`);

    return {
      total,
      totalHours: totalHours > 0 ? totalHours.toFixed(1) : null,
      statusSummary: statusParts.join(', ') || 'no projects',
      cost: hasCost ? formatMoney(totalCost) : null,
    };
  }

  function renderOverviewBadge(overview) {
    const parts = [];
    parts.push(`<span class="cp-ov-count">${overview.total} area${overview.total !== 1 ? 's' : ''}</span>`);
    if (overview.totalHours) {
      parts.push(`<span class="cp-ov-meta">${overview.totalHours} hrs</span>`);
    }
    if (overview.statusSummary) {
      parts.push(`<span class="cp-ov-status">${escapeHtml(overview.statusSummary)}</span>`);
    }
    if (overview.cost) {
      parts.push(`<span class="cp-ov-cost">${escapeHtml(overview.cost)}</span>`);
    }
    return `<span class="cp-overview">${parts.join('<span class="cp-ov-sep">·</span>')}</span>`;
  }

  // ─── Project detail modal ─────────────────────────────────────────────────

  function openDetailModal(p) {
    const existing = document.getElementById('cp-detail-modal');
    if (existing) existing.remove();

    const areaLabel = escapeHtml(p.service_area_label || p.name);
    const money     = formatMoney(p.expected_revenue);
    const hrs       = formatHours(p.actual_hours, p.expected_hours);
    const footage   = formatFootage(p.footage, p.miles);

    const rows = [
      ['Status', statusPillHTML(p.derived_status)],
      hrs     ? ['Hours', escapeHtml(hrs)] : null,
      footage ? ['Footage', escapeHtml(footage)] : null,
      money   ? ['Value', escapeHtml(money)] : null,
      p.job_name     ? ['Job', escapeHtml(p.job_name)] : null,
      p.contract_label && p.contract_label !== p.contract_number
        ? ['Contract', escapeHtml(p.contract_label)] : null,
      p.work_order_number ? ['WO #', escapeHtml(p.work_order_number)] : null,
    ].filter(Boolean);

    const tableRows = rows.map(([label, value]) =>
      `<tr><th class="cp-detail-th">${escapeHtml(label)}</th><td class="cp-detail-td">${value}</td></tr>`
    ).join('');

    const modal = document.createElement('div');
    modal.id = 'cp-detail-modal';
    modal.className = 'cp-detail-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', p.service_area_label || p.name);
    modal.innerHTML = `
      <div class="cp-detail-box">
        <div class="cp-detail-header">
          <span class="cp-detail-title">${areaLabel}</span>
          <button class="cp-detail-close" aria-label="Close detail" id="cp-detail-close-btn">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div class="cp-detail-body">
          <table class="cp-detail-table">
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>`;

    document.body.appendChild(modal);

    const close = () => { modal.remove(); };
    document.getElementById('cp-detail-close-btn').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    // Focus the close button for a11y
    document.getElementById('cp-detail-close-btn').focus();
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

    const card = document.createElement('div');
    card.className = 'cp-project-card cp-clickable';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${areaLabel}`);
    card.innerHTML = `
      <div class="cp-card-name">${escapeHtml(areaLabel)}</div>
      ${statusPillHTML(p.derived_status)}
      ${meta}`;

    const open = () => openDetailModal(p);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    return card;
  }

  // ─── Collapsible node header builder ─────────────────────────────────────
  //
  // Returns a header element that toggles its sibling body when clicked.
  // nodeId  — unique string key used for sessionStorage collapse state.
  // content — inner HTML for the header (icon + label).
  // overview — optional overview object from computeOverview().
  // className — CSS class for the header element.
  // defaultCollapsed — initial state when no sessionStorage entry exists.

  function buildCollapseHeader({ nodeId, content, overview, className, defaultCollapsed = false }) {
    const startCollapsed = sessionStorage.getItem(STORAGE_PREFIX + nodeId) !== null
      ? isCollapsed(nodeId)
      : defaultCollapsed;

    const header = document.createElement('div');
    header.className = className + ' cp-collapsible-header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', startCollapsed ? 'false' : 'true');

    const ovBadge = overview ? renderOverviewBadge(overview) : '';
    header.innerHTML = `
      <i class="fa-solid fa-chevron-right cp-chev" aria-hidden="true"
         style="transform:rotate(${startCollapsed ? 0 : 90}deg)"></i>
      ${content}
      ${ovBadge}`;

    return { header, startCollapsed };
  }

  // ─── Grouping tree builder ────────────────────────────────────────────────

  function buildGroupingTree(projects) {
    const byStatus = (a, b) =>
      (STATUS_ORDER[a.derived_status] ?? 99) - (STATUS_ORDER[b.derived_status] ?? 99);

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

    for (const [, c] of contracts) {
      for (const [, j] of c.jobs) {
        j.projects.sort(byStatus);
      }
    }

    return contracts;
  }

  // ─── Render nested column body (contract → job → area) ───────────────────
  //
  // Returns a DocumentFragment to avoid repeated innerHTML assignments.
  // Job nodes default to COLLAPSED so the initial view shows contracts
  // without showing every individual area card (avoids a wall of text).

  function renderNestedColumnBody(projects, colType) {
    const frag = document.createDocumentFragment();

    if (!projects.length) {
      const empty = document.createElement('div');
      empty.className = 'cp-empty';
      empty.textContent = 'No projects to display.';
      frag.appendChild(empty);
      return frag;
    }

    const contracts = buildGroupingTree(projects);

    for (const [contractKey, { label: contractLabel, jobs }] of contracts) {
      const hasContract = contractKey !== '__none__';

      // Gather all leaves under this contract for the overview
      const contractLeaves = [];
      for (const [, j] of jobs) contractLeaves.push(...j.projects);

      if (hasContract) {
        const contractNodeId = `cp-contract-${contractKey}`;
        const contractOv = computeOverview(contractLeaves);
        const { header, startCollapsed } = buildCollapseHeader({
          nodeId: contractNodeId,
          content: `<i class="fa-solid fa-file-contract cp-contract-icon" aria-hidden="true"></i>
                    <span class="cp-contract-label">${escapeHtml(contractLabel)}</span>`,
          overview: contractOv,
          className: 'cp-contract-header',
          defaultCollapsed: false, // contracts expand by default
        });

        const group = document.createElement('div');
        group.className = 'cp-contract-group';
        group.appendChild(header);

        const body = document.createElement('div');
        body.className = 'cp-contract-body';
        if (startCollapsed) body.style.display = 'none';

        // Build jobs inside the contract body
        for (const [, { label: jobLabel, projects: jobProjects }] of jobs) {
          const jobNodeId = `cp-job-${contractKey}-${jobLabel.replace(/\s+/g, '_')}`;
          const jobOv = computeOverview(jobProjects);
          const { header: jobHeader, startCollapsed: jobCollapsed } = buildCollapseHeader({
            nodeId: jobNodeId,
            content: `<span class="cp-job-header-label">${escapeHtml(jobLabel)}</span>`,
            overview: jobOv,
            className: 'cp-job-header cp-job-header-collapsible',
            defaultCollapsed: true, // jobs start collapsed
          });

          const jobGroup = document.createElement('div');
          jobGroup.className = 'cp-job-group';
          jobGroup.appendChild(jobHeader);

          const jobBody = document.createElement('div');
          jobBody.className = 'cp-job-areas';
          if (jobCollapsed) jobBody.style.display = 'none';

          for (const p of jobProjects) {
            jobBody.appendChild(renderAreaCard(p));
          }

          jobGroup.appendChild(jobBody);
          attachToggle(jobHeader, jobBody, jobNodeId, false);
          body.appendChild(jobGroup);
        }

        group.appendChild(body);
        attachToggle(header, body, contractNodeId, false);
        frag.appendChild(group);

      } else {
        // No contract level — just render job groups directly
        for (const [, { label: jobLabel, projects: jobProjects }] of jobs) {
          const jobNodeId = `cp-job-nocontract-${colType}-${jobLabel.replace(/\s+/g, '_')}`;
          const jobOv = computeOverview(jobProjects);
          const { header: jobHeader, startCollapsed: jobCollapsed } = buildCollapseHeader({
            nodeId: jobNodeId,
            content: `<span class="cp-job-header-label">${escapeHtml(jobLabel)}</span>`,
            overview: jobOv,
            className: 'cp-job-header cp-job-header-collapsible',
            defaultCollapsed: true,
          });

          const jobGroup = document.createElement('div');
          jobGroup.className = 'cp-job-group';
          jobGroup.appendChild(jobHeader);

          const jobBody = document.createElement('div');
          jobBody.className = 'cp-job-areas';
          if (jobCollapsed) jobBody.style.display = 'none';

          for (const p of jobProjects) {
            jobBody.appendChild(renderAreaCard(p));
          }

          jobGroup.appendChild(jobBody);
          attachToggle(jobHeader, jobBody, jobNodeId, false);
          frag.appendChild(jobGroup);
        }
      }
    }

    return frag;
  }

  // ─── Toggle wiring ────────────────────────────────────────────────────────
  //
  // headerEl  — the clickable header element (has .cp-chev inside).
  // bodyEl    — the container that expands/collapses.
  // nodeId    — sessionStorage key.
  // cascadeOnCollapse — if true, also cascade-collapse child node sessions.

  function attachToggle(headerEl, bodyEl, nodeId, cascadeOnCollapse) {
    const toggle = () => {
      const collapsed = bodyEl.style.display === 'none';
      if (collapsed) {
        // Expand
        bodyEl.style.display = '';
        headerEl.setAttribute('aria-expanded', 'true');
        setCollapsed(nodeId, false);
        const chev = headerEl.querySelector('.cp-chev');
        if (chev) chev.style.transform = 'rotate(90deg)';
      } else {
        // Collapse
        bodyEl.style.display = 'none';
        headerEl.setAttribute('aria-expanded', 'false');
        setCollapsed(nodeId, true);
        if (cascadeOnCollapse) cascadeCollapse(nodeId);
        const chev = headerEl.querySelector('.cp-chev');
        if (chev) chev.style.transform = 'rotate(0deg)';
      }
    };

    headerEl.addEventListener('click', toggle);
    headerEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
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

    // Column-level overview
    const colOv = computeOverview(projects);
    const colNodeId = `cp-col-${type}`;
    const { header: colHeader, startCollapsed: colCollapsed } = buildCollapseHeader({
      nodeId: colNodeId,
      content: `<i class="fa-solid ${icon} cp-col-icon" aria-hidden="true"></i>
                <span class="cp-col-title" id="col-${type}-heading">${title}</span>`,
      overview: colOv,
      className: 'cp-col-header',
      defaultCollapsed: false, // top-level columns always open by default
    });

    const bodyEl = document.createElement('div');
    bodyEl.className = 'cp-col-body';
    bodyEl.setAttribute('aria-live', 'polite');
    bodyEl.setAttribute('aria-label', `${title} projects`);
    if (colCollapsed) bodyEl.style.display = 'none';
    bodyEl.appendChild(renderNestedColumnBody(projects, type));

    const el = document.createElement('section');
    el.className = 'cp-column';
    el.setAttribute('aria-labelledby', `col-${type}-heading`);
    el.appendChild(colHeader);
    el.appendChild(bodyEl);

    attachToggle(colHeader, bodyEl, colNodeId, true);
    return el;
  }

  // ─── Dynamic layout grid builder ──────────────────────────────────────────

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
