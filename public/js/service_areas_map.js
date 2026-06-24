/* service_areas_map.js — List|Map toggle + map-data panel + CC/estimate for service-areas.html (R13-B, R14).
   Additive; does not touch service_areas_ui.js or service_areas_filters.js. */
(function () {
  'use strict';

  var _mapData       = null;   // raw rows from GET /api/map/service-areas
  var _mapLoaded     = false;
  var _mapClientFil  = '';
  var _mapAreaFil    = '';

  // ── CC state ─────────────────────────────────────────────────────────────────
  var _ccList        = [];
  var _selectedCcId  = null;
  var _selectedCcName = '';

  // ── View toggle ──────────────────────────────────────────────────────────────
  window.saSetView = function (view) {
    var main     = document.getElementById('main');
    var mapPanel = document.getElementById('map-panel');
    var btnList  = document.getElementById('view-btn-list');
    var btnMap   = document.getElementById('view-btn-map');
    if (!main || !mapPanel) return;

    var isMap = view === 'map';
    main.style.display     = isMap ? 'none' : '';
    mapPanel.style.display = isMap ? '' : 'none';

    if (btnList) {
      btnList.classList.toggle('active', !isMap);
      btnList.setAttribute('aria-pressed', isMap ? 'false' : 'true');
      btnList.style.background = isMap ? '' : 'var(--primary)';
      btnList.style.color      = isMap ? '' : '#fff';
    }
    if (btnMap) {
      btnMap.classList.toggle('active', isMap);
      btnMap.setAttribute('aria-pressed', isMap ? 'true' : 'false');
      btnMap.style.background = isMap ? 'var(--primary)' : '';
      btnMap.style.color      = isMap ? '#fff' : '';
    }

    if (isMap && !_mapLoaded) loadMapData();
    if (isMap) loadCcList();
  };

  // ── Load map data ────────────────────────────────────────────────────────────
  async function loadMapData() {
    _mapLoaded = true;
    var listEl = document.getElementById('map-sa-list');
    if (listEl) listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px"><span style="display:inline-block;width:14px;height:14px;border:2px solid currentColor;border-radius:50%;border-right-color:transparent;animation:spin .6s linear infinite;vertical-align:-2px;margin-right:6px"></span>Loading map data…</div>';
    try {
      var res = await fetch('/api/map/service-areas', { credentials: 'include' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      _mapData = await res.json();
      populateMapFilters(_mapData);
      renderMapList(_mapData);
    } catch (e) {
      if (listEl) listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--danger-text);font-size:13px"><i class="fa-solid fa-triangle-exclamation"></i> Failed to load: ' + esc(e.message) + '</div>';
    }
  }

  function populateMapFilters(rows) {
    var clientSel = document.getElementById('map-client-sel');
    var saSel     = document.getElementById('map-sa-sel');
    if (!clientSel || !saSel) return;

    // Client options
    var seenClients = new Set();
    (rows || []).forEach(function (r) {
      if (r.client_name && !seenClients.has(r.client_name)) {
        seenClients.add(r.client_name);
        var opt = document.createElement('option');
        opt.value = r.client_name; opt.textContent = r.client_name;
        clientSel.appendChild(opt);
      }
    });

    // All-SA options (pre-populate; filters update this)
    populateSaOptions(rows);
  }

  function populateSaOptions(rows) {
    var saSel = document.getElementById('map-sa-sel');
    if (!saSel) return;
    // Remove all except first "All service areas"
    while (saSel.options.length > 1) saSel.remove(1);
    var filtered = _mapClientFil
      ? (rows || []).filter(function (r) { return r.client_name === _mapClientFil; })
      : (rows || []);
    filtered.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r.id; opt.textContent = r.name;
      saSel.appendChild(opt);
    });
  }

  window.saMapFilterClient = function () {
    _mapClientFil = (document.getElementById('map-client-sel') || {}).value || '';
    _mapAreaFil   = '';
    var saSel = document.getElementById('map-sa-sel');
    if (saSel) saSel.value = '';
    populateSaOptions(_mapData);
    renderMapList(_mapData);
  };

  window.saMapFilterArea = function () {
    _mapAreaFil = (document.getElementById('map-sa-sel') || {}).value || '';
    renderMapList(_mapData);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  function renderMapList(rows) {
    var listEl = document.getElementById('map-sa-list');
    if (!listEl) return;

    var filtered = (rows || []).filter(function (r) {
      if (_mapClientFil && r.client_name !== _mapClientFil) return false;
      if (_mapAreaFil   && r.id          !== _mapAreaFil)   return false;
      return true;
    });

    if (!filtered.length) {
      listEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:13px"><i class="fa-solid fa-diagram-project"></i> No service areas match the filter.</div>';
      return;
    }

    var rowsHtml = filtered.map(function (r) {
      var prog  = (r.program || '').toUpperCase();
      var lc    = r.closed_at ? 'Final·Archived' : r.build_finalized_at ? 'Completed' : (r.status || 'active');
      var lcColor = r.closed_at ? 'var(--success-text)' : r.build_finalized_at ? 'var(--info-text)' : 'var(--text-muted)';
      var lcBg    = r.closed_at ? 'var(--success-light)' : r.build_finalized_at ? 'var(--info-light)' : 'var(--surface-3)';
      var geom    = r.map_geometry ? '<span style="font-size:10px;color:var(--primary);margin-left:6px" title="Has map geometry"><i class="fa-solid fa-location-dot"></i></span>' : '';
      return '<tr>'
        + '<td style="padding:9px 14px"><a href="/area.html?id=' + esc(r.id) + '" style="color:var(--primary);font-weight:500">' + esc(r.name) + '</a>' + geom + '</td>'
        + '<td style="padding:9px 14px">' + esc(r.client_name || '—') + '</td>'
        + '<td style="padding:9px 14px">' + (prog ? '<span style="display:inline-block;padding:2px 7px;border-radius:9px;font-size:10px;font-weight:700;background:var(--surface-3);color:var(--text-muted)">' + prog + '</span>' : '—') + '</td>'
        + '<td style="padding:9px 14px">' + (r.ec_name ? esc(r.ec_name) : '<span style="color:var(--text-muted)">—</span>') + '</td>'
        + '<td style="padding:9px 14px"><span style="display:inline-block;padding:2px 8px;border-radius:9px;font-size:11px;font-weight:600;background:' + lcBg + ';color:' + lcColor + '">' + esc(lc) + '</span></td>'
        + '</tr>';
    }).join('');

    listEl.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">'
      + '<thead><tr style="background:var(--surface-1)">'
      + '<th style="text-align:left;padding:9px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--text-muted);border-bottom:1px solid var(--border-strong)">Service Area</th>'
      + '<th style="text-align:left;padding:9px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--text-muted);border-bottom:1px solid var(--border-strong)">Client</th>'
      + '<th style="text-align:left;padding:9px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--text-muted);border-bottom:1px solid var(--border-strong)">Program</th>'
      + '<th style="text-align:left;padding:9px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--text-muted);border-bottom:1px solid var(--border-strong)">EC</th>'
      + '<th style="text-align:left;padding:9px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--text-muted);border-bottom:1px solid var(--border-strong)">Status</th>'
      + '</tr></thead>'
      + '<tbody>' + rowsHtml + '</tbody>'
      + '</table>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── Construction Contracts ────────────────────────────────────────────────────
  async function loadCcList() {
    var listEl = document.getElementById('map-cc-list');
    if (!listEl) return;
    try {
      var res = await fetch('/api/construction-contracts', { credentials: 'include' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      _ccList = await res.json();
      renderCcList();
      populateEstCcSel();
    } catch (e) {
      if (listEl) listEl.innerHTML = '<div style="color:var(--danger-text);font-size:12px">' + esc(e.message) + '</div>';
    }
  }

  function renderCcList() {
    var listEl = document.getElementById('map-cc-list');
    if (!listEl) return;
    if (!_ccList.length) {
      listEl.innerHTML = '<div style="color:var(--text-muted);font-size:12px">No contracts yet.</div>';
      return;
    }
    listEl.innerHTML = _ccList.map(function (cc) {
      var sel = cc.id === _selectedCcId;
      return '<div role="button" tabindex="0" onclick="saSelectCc(' + JSON.stringify(cc.id) + ',' + JSON.stringify(cc.name) + ')"'
        + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \')saSelectCc(' + JSON.stringify(cc.id) + ',' + JSON.stringify(cc.name) + ')"'
        + ' style="padding:7px 10px;border-radius:6px;cursor:pointer;margin-bottom:3px;font-size:12px;'
        + (sel ? 'background:var(--primary-light);color:var(--primary-dark);font-weight:600' : 'background:var(--surface-1)')
        + '">'
        + '<div style="font-weight:600">' + esc(cc.name) + '</div>'
        + (cc.client_name ? '<div style="color:var(--text-muted);font-size:11px">' + esc(cc.client_name) + '</div>' : '')
        + '</div>';
    }).join('');
  }

  window.saShowNewCcForm = function () {
    var form = document.getElementById('cc-new-form');
    var btn  = document.getElementById('cc-new-btn');
    if (form) form.style.display = '';
    if (btn)  btn.style.display  = 'none';
    var inp = document.getElementById('cc-name-inp');
    if (inp) inp.focus();
  };

  window.saHideNewCcForm = function () {
    var form = document.getElementById('cc-new-form');
    var btn  = document.getElementById('cc-new-btn');
    if (form) form.style.display = 'none';
    if (btn)  btn.style.display  = '';
  };

  window.saCreateCc = async function () {
    var nameEl  = document.getElementById('cc-name-inp');
    var notesEl = document.getElementById('cc-notes-inp');
    var name    = (nameEl  || {}).value || '';
    var notes   = (notesEl || {}).value || '';
    if (!name.trim()) { if (nameEl) nameEl.focus(); return; }
    try {
      var res = await fetch('/api/construction-contracts', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), notes: notes.trim() || null })
      });
      if (!res.ok) { var err = await res.json(); throw new Error(err.error || 'HTTP ' + res.status); }
      var cc = await res.json();
      window.saHideNewCcForm();
      if (nameEl)  nameEl.value  = '';
      if (notesEl) notesEl.value = '';
      await loadCcList();
      window.saSelectCc(cc.id, cc.name);
    } catch (e) {
      var listEl = document.getElementById('map-cc-list');
      if (listEl) listEl.insertAdjacentHTML('afterbegin', '<div style="color:var(--danger-text);font-size:12px;margin-bottom:6px">' + esc(e.message) + '</div>');
    }
  };

  window.saSelectCc = async function (id, name) {
    _selectedCcId   = id;
    _selectedCcName = name;
    renderCcList();
    var wrap    = document.getElementById('cc-catalog-wrap');
    var nameEl  = document.getElementById('cc-catalog-name');
    if (wrap)   wrap.style.display = '';
    if (nameEl) nameEl.textContent = name;
    await loadCatalog(id);
    // sync estimate CC picker
    var estSel = document.getElementById('est-cc-sel');
    if (estSel && id) estSel.value = id;
  };

  async function loadCatalog(ccId) {
    var tbl = document.getElementById('cc-catalog-table');
    if (!tbl) return;
    tbl.innerHTML = '<div style="color:var(--text-muted);font-size:11px">'
      + '<span style="display:inline-block;width:10px;height:10px;border:2px solid currentColor;border-radius:50%;border-right-color:transparent;animation:spin .6s linear infinite;vertical-align:-1px;margin-right:4px"></span>Loading…</div>';
    try {
      var res = await fetch('/api/construction-contracts/' + encodeURIComponent(ccId) + '/catalog', { credentials: 'include' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var rows = await res.json();
      renderCatalogTable(rows, tbl);
    } catch (e) {
      tbl.innerHTML = '<div style="color:var(--danger-text);font-size:11px">' + esc(e.message) + '</div>';
    }
  }

  function renderCatalogTable(rows, tbl) {
    if (!rows.length) {
      tbl.innerHTML = '<div style="color:var(--text-muted);font-size:11px">No catalog items — upload an Excel/CSV price list.</div>';
      return;
    }
    tbl.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:11px">'
      + '<thead><tr style="background:var(--surface-3)">'
      + '<th style="text-align:left;padding:4px 6px;color:var(--text-muted)">Item key</th>'
      + '<th style="text-align:left;padding:4px 6px;color:var(--text-muted)">Label</th>'
      + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Unit</th>'
      + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Unit price</th>'
      + '</tr></thead><tbody>'
      + rows.map(function (r) {
        return '<tr style="border-bottom:1px solid var(--border-weak)">'
          + '<td style="padding:4px 6px;font-family:monospace">' + esc(r.item_key) + '</td>'
          + '<td style="padding:4px 6px">' + esc(r.label || '') + '</td>'
          + '<td style="padding:4px 6px;text-align:right">' + esc(r.unit || '—') + '</td>'
          + '<td style="padding:4px 6px;text-align:right;font-weight:600">$' + esc(String(r.unit_price)) + '</td>'
          + '</tr>';
      }).join('')
      + '</tbody></table>';
  }

  window.saUploadCatalog = async function () {
    var fileInput = document.getElementById('cc-catalog-file');
    var tbl       = document.getElementById('cc-catalog-table');
    if (!fileInput || !fileInput.files[0] || !_selectedCcId) return;
    if (tbl) tbl.innerHTML = '<div style="color:var(--text-muted);font-size:11px">'
      + '<span style="display:inline-block;width:10px;height:10px;border:2px solid currentColor;border-radius:50%;border-right-color:transparent;animation:spin .6s linear infinite;vertical-align:-1px;margin-right:4px"></span>Uploading…</div>';
    var fd = new FormData();
    fd.append('file', fileInput.files[0]);
    try {
      var res = await fetch('/api/construction-contracts/' + encodeURIComponent(_selectedCcId) + '/catalog', {
        method: 'POST', credentials: 'include', body: fd
      });
      if (!res.ok) { var err = await res.json(); throw new Error(err.error || 'HTTP ' + res.status); }
      fileInput.value = '';
      await loadCatalog(_selectedCcId);
    } catch (e) {
      if (tbl) tbl.innerHTML = '<div style="color:var(--danger-text);font-size:11px"><i class="fa-solid fa-triangle-exclamation"></i> ' + esc(e.message) + '</div>';
    }
  };

  function populateEstCcSel() {
    var sel = document.getElementById('est-cc-sel');
    if (!sel) return;
    var prev = sel.value;
    while (sel.options.length > 1) sel.remove(1);
    (_ccList || []).forEach(function (cc) {
      var opt = document.createElement('option');
      opt.value = cc.id; opt.textContent = cc.name;
      sel.appendChild(opt);
    });
    if (prev) sel.value = prev;
  }

  // ── Estimate ──────────────────────────────────────────────────────────────────
  window.saRunEstimate = async function () {
    var ccId   = ((document.getElementById('est-cc-sel')  || {}).value || '').trim();
    var planId = ((document.getElementById('est-plan-id') || {}).value || '').trim();
    var el     = document.getElementById('map-est-result');
    if (!ccId || !planId) {
      if (el) el.innerHTML = '<div style="color:var(--warning-text);font-size:12px;padding:8px;background:var(--warning-light);border-radius:6px"><i class="fa-solid fa-triangle-exclamation"></i> Pick a contract and enter a plan ID.</div>';
      return;
    }
    if (el) el.innerHTML = '<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:12px 0">'
      + '<span style="display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-radius:50%;border-right-color:transparent;animation:spin .6s linear infinite;vertical-align:-2px;margin-right:6px"></span>Running estimate…</div>';
    try {
      var res = await fetch('/api/map/estimate?plan=' + encodeURIComponent(planId) + '&cc=' + encodeURIComponent(ccId), { credentials: 'include' });
      if (!res.ok) { var err = await res.json(); throw new Error(err.error || 'HTTP ' + res.status); }
      var data = await res.json();
      renderEstimate(data, el);
    } catch (e) {
      if (el) el.innerHTML = '<div style="color:var(--danger-text);font-size:12px"><i class="fa-solid fa-triangle-exclamation"></i> ' + esc(e.message) + '</div>';
    }
  };

  function renderEstimate(d, el) {
    var structs   = d.structures || [];
    var unpriced  = d.unpriced   || [];
    var rowsHtml  = structs.map(function (s) {
      return '<tr style="border-bottom:1px solid var(--border-weak)">'
        + '<td style="padding:4px 6px">' + esc(s.label || s.item_key) + '</td>'
        + '<td style="padding:4px 6px;text-align:right">' + esc(String(s.count)) + '</td>'
        + '<td style="padding:4px 6px;text-align:right">' + esc(String(s.completed)) + '</td>'
        + '<td style="padding:4px 6px;text-align:right">' + (s.unit_price != null ? '$' + esc(String(s.unit_price)) : '<span style="color:var(--text-muted)">—</span>') + '</td>'
        + '<td style="padding:4px 6px;text-align:right;font-weight:' + (s.priced ? '600' : '400') + '">'
          + (s.expected != null ? '$' + esc(String(s.expected)) : '<span style="color:var(--text-muted)">—</span>') + '</td>'
        + '<td style="padding:4px 6px;text-align:right">' + (s.completed_value != null ? '$' + esc(String(s.completed_value)) : '<span style="color:var(--text-muted)">—</span>') + '</td>'
        + '</tr>';
    }).join('');
    var unpricedHtml = unpriced.length
      ? '<div style="margin-top:8px;padding:6px 8px;background:var(--warning-light);border-radius:6px;font-size:11px;color:var(--warning-text)"><i class="fa-solid fa-triangle-exclamation"></i> Unpriced items: ' + unpriced.map(esc).join(', ') + '</div>'
      : '';
    el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">'
      + estKpi('Expected',  '$' + esc(String(d.construction_expected  || 0)))
      + estKpi('Completed', '$' + esc(String(d.construction_completed || 0)))
      + estKpi('Remaining', '$' + esc(String(d.construction_remaining || 0)))
      + '</div>'
      + '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px"><i class="fa-solid fa-ruler"></i> Footage: ' + esc(String(d.footage_total || 0)) + ' ft</div>'
      + (structs.length ? '<div style="max-height:200px;overflow-y:auto;border:1px solid var(--border-strong);border-radius:6px">'
          + '<table style="width:100%;border-collapse:collapse;font-size:11px">'
          + '<thead><tr style="background:var(--surface-3)">'
          + '<th style="text-align:left;padding:4px 6px;color:var(--text-muted)">Item</th>'
          + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Count</th>'
          + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Done</th>'
          + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">$/Unit</th>'
          + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Expected</th>'
          + '<th style="text-align:right;padding:4px 6px;color:var(--text-muted)">Completed</th>'
          + '</tr></thead>'
          + '<tbody>' + rowsHtml + '</tbody>'
          + '</table></div>'
        : '<div style="color:var(--text-muted);font-size:12px">No structures found in this plan.</div>')
      + unpricedHtml;
  }

  function estKpi(label, value) {
    return '<div style="background:var(--surface-1);border:1px solid var(--border-strong);border-radius:8px;padding:8px 10px;text-align:center">'
      + '<div style="font-size:10px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">' + label + '</div>'
      + '<div style="font-size:13px;font-weight:700">' + value + '</div>'
      + '</div>';
  }

})();
