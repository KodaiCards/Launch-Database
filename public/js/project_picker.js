// public/js/project_picker.js — shared "leaf projects only" select populator.
//
// Why: every project dropdown in the system used to show ALL projects
// (rollups + leaves). Picking a rollup never made sense — you can't log
// time against a folder, can't bill it, can't permit it. Owner asked
// every picker to show leaves only with an "+ Add New" affordance.
//
// Public surface — both attached to window for portal compat:
//   populateProjectPicker(selectEl, projects, opts)
//     selectEl  — <select> to populate
//     projects  — array from /api/projects (must include child_count and
//                 ideally client_id, status)
//     opts:
//       client_id        — filter to one client (optional)
//       active_only      — drop status !== 'active' (default true)
//       placeholder      — first option label (default "Select project…")
//       selected         — id to mark selected (optional)
//       group_by_client  — render <optgroup>s by client_name (default false)
//
//   wireAddNewButton(buttonEl, onClick)
//     simple thin wrapper so portal pages don't have to remember to wire
//     the "+ Add" button. The host provides the click handler — admin
//     creates directly, portals open the pending-approval flow.
//
// This module is self-contained (no api/cookie imports) so it works in
// admin, design, permitting, and timeclock portals identically.

(function () {
  function _looksLikeLeaf(p) {
    // Treat missing child_count as "unknown, assume leaf" — the alternative
    // (drop the row) is worse UX since all-rollup datasets would show no
    // projects at all.
    if (typeof p.child_count === 'number') return p.child_count === 0;
    return true;
  }

  function populateProjectPicker(selectEl, projects, opts) {
    if (!selectEl) return;
    opts = opts || {};
    const clientId = opts.client_id || null;
    const activeOnly = opts.active_only !== false;
    const placeholder = opts.placeholder || 'Select project…';
    const selected = opts.selected || null;
    const groupByClient = !!opts.group_by_client;

    // Filter
    let rows = (projects || []).slice().filter(_looksLikeLeaf);
    if (activeOnly) rows = rows.filter(p => !p.status || p.status === 'active');
    if (clientId)   rows = rows.filter(p => String(p.client_id) === String(clientId));

    // Sort: client > project name (cheap label compare; keeps things stable)
    rows.sort((a, b) => {
      const ca = (a.client_name || '').toLowerCase();
      const cb = (b.client_name || '').toLowerCase();
      if (ca !== cb) return ca.localeCompare(cb);
      return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase());
    });

    // Render
    selectEl.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder;
    selectEl.appendChild(ph);

    function _label(p) {
      const wo = p.work_order_number ? ` · WO#${p.work_order_number}` : '';
      return `${p.name}${wo}`;
    }

    if (groupByClient) {
      let lastClient = null;
      let group = null;
      for (const p of rows) {
        const cli = p.client_name || '— No client —';
        if (cli !== lastClient) {
          group = document.createElement('optgroup');
          group.label = cli;
          selectEl.appendChild(group);
          lastClient = cli;
        }
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = _label(p);
        if (selected && String(selected) === String(p.id)) opt.selected = true;
        group.appendChild(opt);
      }
    } else {
      for (const p of rows) {
        const opt = document.createElement('option');
        opt.value = p.id;
        // When not grouping, prefix with client to give the operator a
        // disambiguator inline: "PSC · Reconnect 3"
        opt.textContent = (p.client_name ? p.client_name + ' · ' : '') + _label(p);
        if (selected && String(selected) === String(p.id)) opt.selected = true;
        selectEl.appendChild(opt);
      }
    }
    return rows.length;
  }

  function wireAddNewButton(buttonEl, onClick) {
    if (!buttonEl || typeof onClick !== 'function') return;
    buttonEl.addEventListener('click', (e) => {
      e.preventDefault();
      onClick(e);
    });
  }

  window.populateProjectPicker = populateProjectPicker;
  window.wireAddNewButton = wireAddNewButton;
})();
