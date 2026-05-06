// public/js/projects_tab.js — Admin Projects tab loader + tree.
//
// Extracted from public/index.html as part of CLEANUP_PLAN.md Track 1.2.
//
// Owns:
//   - loadProjects: pulls /api/projects with the active filters and
//     populates allProjects, the project tree body, the time-entry
//     project dropdown, and the parent-project dropdown.
//   - populateParentDropdown: indented hierarchy in the New Project
//     modal's Parent picker; excludes the project itself + descendants
//     so a self-referential cycle isn't possible.
//   - filterProjects: token-based fuzzy search ("psc4" matches
//     "PSC IND #4"). Pulls in ancestors of every match so the tree
//     context isn't lost when matches are deep.
//   - renderProjects: recursive tree render with rollup-up YTD revenue,
//     projected revenue, and hours. Persistent expand state via
//     projectsTreeState (shared with Dashboard + Revenue trees).
//   - ptreeToggle / ptreeExpandAll: tree expand/collapse with
//     descendant cascade, mirrored to the persistent state so the
//     1.5s polling re-render doesn't collapse the user's selection.
//
// The Project create/edit modal handlers (openProjectModal,
// editProject, saveProject, autosave, deleteProject, …) stay inline.
// They share state with the bulk-billing selection, the inline
// quickAdd panels for client/contract/concentrator/parent/budgetcode,
// and the Settings modal — splitting them out would create more
// cross-file dependencies than it removes.
//
// Globals this module reads:
//   api(), esc(), fmt(), fmtMoney()    — global helpers
//   typeBadge(), statusBadge()         — global badge renderers
//   setHtmlIfChanged()                 — flicker-free DOM write
//   projectsTreeState                  — shared tree expand state
//   allProjects                        — global cache (reassigned here)
//   populateProjectPicker()            — leaves-only picker helper
//   showProjectDetail()                — drilldown opener
//   editProject()                      — project edit modal opener
//   showBudgetForProject()             — budget panel opener
//   markBilled()                       — single-project bill flow
//   confirmDeleteProject()             — delete confirm w/ cascade preview
//   bulkSelected, bulkOnChange()       — bulk-billing selection
//
// Functions exposed on window:
//   loadProjects, populateParentDropdown, filterProjects,
//   renderProjects, ptreeToggle, ptreeExpandAll

(function () {
  async function loadProjects() {
    const status = document.getElementById('proj-status-filter')?.value || '';
    const clientId = document.getElementById('proj-client-filter')?.value || '';
    const type = document.getElementById('proj-type-filter')?.value || '';
    let q = '/api/projects?';
    if (status) q += `status=${status}&`;
    if (clientId) q += `client_id=${clientId}&`;
    if (type) q += `type=${type}&`;
    allProjects = await api(q);
    renderProjects(allProjects);
    // Time entry project dropdown — leaves only via the shared picker
    // helper. Picking a rollup never made sense (you can't log time
    // against a folder); restricting to leaves is the same UX the
    // portals have used since the start.
    const tp = document.getElementById('te-project');
    if (tp && typeof populateProjectPicker === 'function') {
      populateProjectPicker(tp, allProjects, {
        placeholder: 'Select project...',
        group_by_client: true,
      });
    } else if (tp) {
      // Fallback if the helper hasn't loaded — keep the legacy behavior
      // rather than break the modal.
      while (tp.options.length > 1) tp.remove(1);
      allProjects.forEach(p => tp.add(new Option(`${p.name} (${p.client_name || ''})`, p.id)));
    }
    // Populate parent project dropdown — allow top-level AND mid-level as parents
    populateParentDropdown(null);
  }

  // Build the parent-project dropdown with proper indentation showing hierarchy.
  // Always fetches ALL projects (unfiltered) so new sub-projects appear immediately.
  async function populateParentDropdown(editingId) {
    const pp = document.getElementById('proj-parent');
    if (!pp) return;
    while (pp.options.length > 1) pp.remove(1);

    // Always fetch full unfiltered list for the dropdown
    let dropdownProjects;
    try {
      dropdownProjects = await api('/api/projects');
    } catch (e) {
      dropdownProjects = allProjects; // fallback
    }

    // Build descendant set for editing project
    const excluded = new Set();
    if (editingId) {
      excluded.add(editingId);
      const kidMap = {};
      dropdownProjects.forEach(p => { if (p.parent_id) { (kidMap[p.parent_id] = kidMap[p.parent_id] || []).push(p.id); } });
      const stack = [editingId];
      while (stack.length) {
        const id = stack.pop();
        for (const kid of (kidMap[id] || [])) { if (!excluded.has(kid)) { excluded.add(kid); stack.push(kid); } }
      }
    }

    // Walk recursively for indented options
    const childrenOf = {};
    dropdownProjects.forEach(p => { if (p.parent_id) { (childrenOf[p.parent_id] = childrenOf[p.parent_id] || []).push(p); } });
    const roots = dropdownProjects.filter(p => !p.parent_id);

    function addOptions(projects, depth) {
      for (const p of projects) {
        if (excluded.has(p.id)) continue;
        const indent = '   '.repeat(depth) + (depth > 0 ? '└ ' : '');
        pp.add(new Option(`${indent}${p.name} (${p.client_name || ''})`, p.id));
        addOptions(childrenOf[p.id] || [], depth + 1);
      }
    }
    addOptions(roots, 0);
  }

  function filterProjects() {
    const q = document.getElementById('proj-search').value.toLowerCase().trim();
    if (!q) { renderProjects(allProjects); return; }

    const byId = {};
    allProjects.forEach(p => byId[p.id] = p);

    // Token-based fuzzy match: split the query on whitespace AND any
    // non-alphanumeric character, so "psc4" matches "PSC IND #4" and
    // "psc 4" matches the same. Each token must appear somewhere in the
    // project's haystack — order doesn't matter, separators don't matter.
    const tokens = q.split(/[\s\W_]+/).filter(Boolean);

    const keep = new Set();
    allProjects.forEach(p => {
      const hayParts = [
        p.name, p.client_name, p.contract_number, p.work_order_number,
        p.project_type, p.notes, p.parent_name, p.concentrator_area,
      ].filter(Boolean).join(' ').toLowerCase();
      // Strip non-alnum from the haystack too so a query of "psc4" matches
      // "PSC IND #4" → haystack becomes "psc ind 4" and "psc4" → "psc4"
      // → both contain "psc" and "4" tokens.
      const flatHay = hayParts.replace(/[\W_]+/g, ' ');
      const flatHayTight = flatHay.replace(/\s+/g, '');  // for compact match like "psc4"
      const allTokensMatch = tokens.every(t => flatHay.includes(t) || flatHayTight.includes(t));
      if (allTokensMatch) keep.add(p.id);
    });
    // Pull in every ancestor of every match so the tree context isn't lost
    for (const id of [...keep]) {
      let cur = byId[id];
      while (cur && cur.parent_id) {
        keep.add(cur.parent_id);
        cur = byId[cur.parent_id];
      }
    }

    // Render with expandAll=true so the user actually sees the matches
    renderProjects(allProjects.filter(p => keep.has(p.id)), true);
  }

  function renderProjects(list, expandAll = false) {
    const tbody = document.getElementById('projects-body');
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-folder-open"></i><p>No projects found</p></div></td></tr>';
      return;
    }

    // Build lookup and children map for unlimited depth
    const byId = {};
    list.forEach(p => byId[p.id] = p);
    const childrenOf = {};
    list.forEach(p => { if (p.parent_id && byId[p.parent_id]) { (childrenOf[p.parent_id] = childrenOf[p.parent_id] || []).push(p); } });
    const roots = list.filter(p => !p.parent_id || !byId[p.parent_id]);

    // Infer billing rate from project type when not explicitly set
    function inferRate(p) {
      const r = parseFloat(p.billing_rate);
      if (r && r > 0) return r;
      const t = (p.project_type || '').toLowerCase();
      if (t === 'inspection') return 90;
      if (t === 're' || t === 'resident engineer') return 100;
      if (t === 'permitting') return 90;
      return 0;
    }

    // Recursive rollup — only leaf projects generate revenue from their hours.
    // Parent/container projects aggregate from children only.
    function sumTree(p) {
      const kids = childrenOf[p.id] || [];
      const isLeaf = kids.length === 0;
      let logged = parseFloat(p.logged_hours) || 0;
      let revenue = parseFloat(p.expected_revenue) || 0;
      let ytd = 0;
      // Projected = SUM of leaves' projected_revenue. Containers don't carry
      // their own projected_revenue value — that's how we avoid double-counting.
      let projected = 0;
      if (isLeaf) {
        const rate = inferRate(p);
        if ((p.billing_type || '').toLowerCase() === 'footage') {
          if (['completed', 'billed'].includes(p.status)) ytd = revenue;
        } else if (logged > 0 && rate > 0) {
          ytd = logged * rate;
        }
        projected = parseFloat(p.projected_revenue) || 0;
      }

      for (const kid of kids) {
        const s = sumTree(kid);
        logged += s.logged; revenue += s.revenue; ytd += s.ytd;
        projected += s.projected;
      }
      return { logged, revenue, ytd, projected };
    }

    function buildProjRows(projects, depth, parentGroupClass, parentExpanded) {
      let html = '';
      for (const p of projects) {
        const indent = depth * 28;
        const prefix = depth > 0 ? '<span style="color:var(--text-muted);margin-right:4px">└</span>' : '';
        const kids = childrenOf[p.id] || [];
        const expandable = kids.length > 0;
        const isLeaf = !expandable;
        const groupKey = 'pt-' + p.id;
        const chevId = 'pc-' + p.id;
        const bg = depth === 0 ? '' : depth % 2 === 1 ? 'background:var(--gray-light)' : 'background:var(--row-alt)';

        // A row is visible if every ancestor is currently expanded.
        const isVisible = depth === 0 || parentExpanded;

        // For this node: if expanded (or expandAll override), descendants
        // get parentExpanded=true.
        const thisExpanded = expandAll || projectsTreeState.isExpanded(p.id);

        const startHidden = !isVisible;
        const display = startHidden ? 'display:none;' : '';
        const trAttrs = parentGroupClass
          ? `class="ptree ptree-${parentGroupClass}" style="${display}${bg};cursor:pointer"`
          : `style="${bg};cursor:pointer"`;
        const sums = sumTree(p);
        const badge = expandable ? `<span style="font-size:10px;color:var(--primary);margin-left:6px;font-weight:600;background:var(--primary-light);padding:1px 6px;border-radius:10px">${kids.length}</span>` : '';
        const chevRotation = expandable && thisExpanded ? 'transform:rotate(90deg);' : '';
        const chevron = expandable
          ? `<span onclick="event.stopPropagation();ptreeToggle('${p.id}','${groupKey}','${chevId}')" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;cursor:pointer;margin-right:4px;background:var(--gray-light);border:1px solid var(--gray-border)"><i class="fa-solid fa-chevron-right" id="${chevId}" style="font-size:11px;color:var(--text-muted);transition:transform .2s;${chevRotation}"></i></span>`
          : (depth === 0 ? '<span style="width:32px;display:inline-block"></span>' : '');

        // Use server-computed ytd_revenue — no frontend calculation needed
        const ytd = parseFloat(p.ytd_revenue) || 0;
        // Leaves show their own logged_hours; rollups roll up via the
        // recursive sumTree result so a parent row shows the sum across
        // every descendant leaf. Owner-flagged 2026-05-06: rollups
        // were displaying "0 hrs logged" even when children had hours
        // because we were reading p.logged_hours (own only).
        const ownLogged = parseFloat(p.logged_hours) || 0;
        const rolledLogged = sums.logged || 0;
        const displayLogged = isLeaf ? ownLogged : rolledLogged;
        const ytdCell = isLeaf
          ? `<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">YTD Revenue</span><br><strong style="color:var(--primary);font-size:14px">${fmtMoney(ytd)}</strong><br><span style="font-size:11px;color:var(--text-muted)">${fmt(displayLogged, 'hrs')} logged</span>`
          : `<span style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">YTD Revenue</span><br><strong style="color:var(--primary);font-size:14px">${fmtMoney(ytd)}</strong><br><span style="font-size:11px;color:var(--text-muted)">${fmt(displayLogged, 'hrs')} · ${kids.length} sub-project${kids.length !== 1 ? 's' : ''}</span>`;

        // Projected: leaves show their own projected_revenue; containers show
        // rolled-up sum from descendant leaves only (sums.projected handles this,
        // computed in sumTree above with no double-counting).
        const projAmount = sums.projected || 0;
        const projCell = projAmount > 0
          ? `<strong style="color:var(--text);font-size:14px">${fmtMoney(projAmount)}</strong>${!isLeaf && ytd > 0 ? `<br><span style="font-size:11px;color:var(--text-muted)">${Math.round((ytd / projAmount) * 100)}% earned</span>` : ''}`
          : '<span style="color:var(--text-muted);font-size:12px">—</span>';

        // Only LEAF projects are bulk-selectable — rollups don't have hours
        // to bill or status worth toggling on their own.
        const checkbox = isLeaf
          ? `<input type="checkbox" class="bulk-row-cb" data-id="${p.id}" data-status="${esc(p.status || '')}" onclick="event.stopPropagation();bulkOnChange()" ${bulkSelected.has(p.id) ? 'checked' : ''}>`
          : '';
        html += `<tr ${trAttrs} onclick="showProjectDetail('${p.id}')">
          <td style="text-align:center" onclick="event.stopPropagation()">${checkbox}</td>
          <td class="td-name" style="padding-left:${12 + indent}px">${chevron}${prefix}${esc(p.name)}${badge}</td>
          <td>${esc(p.client_name || '—')}<br><span class="td-muted" style="font-size:11px">${esc(p.contract_number || '')}</span></td>
          <td class="td-mono">${esc(p.work_order_number || '—')}</td>
          <td>${typeBadge(p.project_type)}</td>
          <td>${projCell}</td>
          <td>${ytdCell}</td>
          <td>${statusBadge(p.status)}</td>
          <td style="white-space:nowrap">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();editProject('${p.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
            ${depth === 0 ? `<button class="btn btn-sm btn-secondary btn-icon" onclick="event.stopPropagation();showBudgetForProject('${p.id}','${esc(p.name)}')" title="Budget"><i class="fa-solid fa-wallet"></i></button>` : ''}
            ${p.status === 'completed' && !p.billed_date ? `<button class="btn btn-sm btn-success" onclick="event.stopPropagation();markBilled('${p.id}')" title="Mark billed"><i class="fa-solid fa-check"></i></button>` : ''}
            <button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:1px solid var(--gray-border)" onclick="event.stopPropagation();confirmDeleteProject('${p.id}','${esc(p.name)}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>`;
        if (expandable) html += buildProjRows(kids, depth + 1, groupKey, thisExpanded);
      }
      return html;
    }

    // Skip the DOM write if nothing changed — same flicker/dropdown fix as
    // the dashboard tree above.
    setHtmlIfChanged(tbody, buildProjRows(roots, 0, null, true));
  }

  // Shared toggle: see makeTreeToggle in tree_state.js.
  const ptreeToggle = makeTreeToggle({
    state: projectsTreeState,
    chevIdPrefix: 'pc-',
    groupKeyPrefix: 'pt-',
    rowClassPrefix: 'ptree-',
  });

  // Show or hide every branch in the projects tree at once.
  function ptreeExpandAll(expand) {
    if (expand) {
      const list = (typeof allProjects !== 'undefined' && allProjects) ? allProjects : [];
      projectsTreeState.expandAll(list.map(p => p.id));
    } else {
      projectsTreeState.clear();
    }
    document.querySelectorAll('#projects-body tr.ptree').forEach(r => {
      r.style.display = expand ? 'table-row' : 'none';
    });
    document.querySelectorAll('#projects-body [id^="pc-"]').forEach(c => {
      c.style.transform = expand ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  }

  window.loadProjects = loadProjects;
  window.populateParentDropdown = populateParentDropdown;
  window.filterProjects = filterProjects;
  window.renderProjects = renderProjects;
  window.ptreeToggle = ptreeToggle;
  window.ptreeExpandAll = ptreeExpandAll;
})();
