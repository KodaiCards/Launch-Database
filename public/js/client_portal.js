// public/js/client_portal.js — Wave 13B: per-client scoped client portal.
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

  function displayName(p) {
    const parts = [];
    if (p.service_area_label) parts.push(p.service_area_label);
    if (p.work_order_number)  parts.push(p.work_order_number);
    parts.push(p.name);
    return parts.join(' / ');
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
        <div class="cp-card-name">${escapeHtml(displayName(p))}</div>
        ${statusPillHTML(p.derived_status)}
        ${meta}
      </div>`;
  }

  function renderColumnBody(projects) {
    if (!projects.length) {
      return '<div class="cp-empty">No projects to display.</div>';
    }
    return projects.map(renderCard).join('');
  }

    // Build a column element; returns null to signal "hide this column".
  // All three columns hide when empty (empty-column rule applies to all).
  function buildColumnEl(type, projects) {
    if (projects.length === 0) return null;

    const configs = {
      design:       { icon: 'fa-drafting-compass', title: 'Design'       },
      permitting:   { icon: 'fa-file-signature',   title: 'Permitting'   },
      construction: { icon: 'fa-hard-hat',          title: 'Construction' },
    };
    const { icon, title } = configs[type];

    const bodyHtml = renderColumnBody(projects);

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

  // Derive column bucket from jobs.team when available, else fall back to project_type.
  function columnBucket(p) {
    const team = (p.team || '').toLowerCase();
    if (team === 'design')       return 'design';
    if (team === 'permitting')   return 'permitting';
    if (team === 'construction') return 'construction';
    // No job or job has no team — classify by project_type.
    const t = (p.project_type || '').toLowerCase();
    if (DESIGN_TYPES.has(t))     return 'design';
    if (PERMIT_TYPES.has(t))     return 'permitting';
    if (CONST_TYPES.has(t))      return 'construction';
    return null;
  }

  // Render a grid (3-column layout) from a flat project array for one client.
  // Returns the grid element (possibly fewer than 3 columns if some are empty).
  function renderGrid(projects) {
    const design       = [];
    const permit       = [];
    const construction = [];

    for (const p of projects) {
      const bucket = columnBucket(p);
      if (bucket === 'design')       design.push(p);
      else if (bucket === 'permitting') permit.push(p);
      else if (bucket === 'construction') construction.push(p);
    }

    const byStatus = (a, b) =>
      (STATUS_ORDER[a.derived_status] ?? 99) - (STATUS_ORDER[b.derived_status] ?? 99);

    design.sort(byStatus);
    permit.sort(byStatus);
    construction.sort(byStatus);

    const grid = document.createElement('div');
    grid.className = 'cp-grid';
    grid.setAttribute('role', 'main');
    grid.setAttribute('aria-label', 'Project columns');

    const designEl  = buildColumnEl('design', design);
    const permitEl  = buildColumnEl('permitting', permit);
    const constEl   = buildColumnEl('construction', construction);

    if (designEl)  grid.appendChild(designEl);
    if (permitEl)  grid.appendChild(permitEl);
    if (constEl)   grid.appendChild(constEl);

    // If all three are hidden (no projects at all), signal caller
    if (!designEl && !permitEl && !constEl) return null;

    return grid;
  }

  // ─── Render modes ─────────────────────────────────────────────────────────

  // customer or admin viewing single client — plain 3-column grid
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

  // admin viewing all clients — one section per client
  function renderAllClients(projects) {
    const content = document.getElementById('cp-content');
    if (!content) return;

    // Group rows by client_id
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

    // Sort by client name
    const sorted = Array.from(byClient.entries()).sort((a, b) =>
      a[1].name.localeCompare(b[1].name)
    );

    for (const [, { name, rows }] of sorted) {
      const grid = renderGrid(rows);
      if (!grid) continue; // skip clients with no displayable projects

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
