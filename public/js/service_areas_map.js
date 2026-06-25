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

  // ── Overview Leaflet map state (R15.1) ────────────────────────────────────────
  var _overviewMap   = null;
  var _ovMarkers     = {};   // sa.id → L.Marker
  var _ovBoundaries  = {};   // sa.id → L.GeoJSON layer
  var _ovCluster     = null;
  var _leafletReady  = false;

  // ── Overview boundary edit state (R15.5) ─────────────────────────────────────
  var _ovBndSaId    = null;  // SA id currently being boundary-edited
  var _ovBndMode    = false;
  var _ovBndItems   = null;  // L.FeatureGroup for draw/edit
  var _ovBndLayer   = null;  // current drawn polygon layer
  var _ovBndHandler = null;  // L.Draw.Polygon handler
  var _ovBndEditH   = null;  // L.EditToolbar.Edit handler
  var _ovBndOrigGeo = null;  // original GeoJSON for cancel restoration
  var _ovBndSaData  = null;  // the SA row data object

  // ── View toggle ──────────────────────────────────────────────────────────────
  window.saSetView = function (view) {
    var main     = document.getElementById('main');
    var mapPanel = document.getElementById('map-panel');
    var btnList  = document.getElementById('view-btn-list');
    var btnMap   = document.getElementById('view-btn-map');
    if (!main || !mapPanel) return;

    var isMap = view === 'map';
    main.style.display     = isMap ? 'none' : '';
    mapPanel.style.display = isMap ? 'flex' : 'none';

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
    if (isMap) ensureLeaflet(initOverviewMap);
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
      if (_overviewMap) plotSaMarkers(_mapData);
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

  // ── Render sidebar list (R15.1 — compact cards synced to the Leaflet map) ────
  function renderMapList(rows) {
    var listEl = document.getElementById('map-sa-list');
    if (!listEl) return;

    var filtered = (rows || []).filter(function (r) {
      if (_mapClientFil && r.client_name !== _mapClientFil) return false;
      if (_mapAreaFil   && String(r.id)  !== _mapAreaFil)   return false;
      return true;
    });

    if (!filtered.length) {
      listEl.innerHTML = '<div style="padding:20px 12px;text-align:center;color:var(--text-muted);font-size:12px"><i class="fa-solid fa-diagram-project"></i><br>No service areas match.</div>';
      return;
    }

    var html = '<div style="padding:8px 0">';
    filtered.forEach(function (r) {
      var prog     = (r.program || '').toUpperCase();
      var lc       = r.closed_at ? 'Final·Archived' : r.build_finalized_at ? 'Completed' : 'Active';
      var lcColor  = r.closed_at ? 'var(--success-text)' : r.build_finalized_at ? 'var(--info-text)' : 'var(--text-muted)';
      var lcBg     = r.closed_at ? 'var(--success-light)' : r.build_finalized_at ? 'var(--info-light)' : 'var(--surface-3)';
      var pinColor = ovStatusColor(r);
      var hasPin   = r.center_lat != null && r.center_lng != null;
      html += '<div role="listitem" data-sa-id="' + esc(r.id) + '"'
        + ' style="padding:8px 12px;border-bottom:1px solid var(--border-weak);cursor:pointer;transition:background .1s"'
        + ' onclick="ovClickListItem(this,' + JSON.stringify(r.id) + ')"'
        + ' onmouseenter="this.style.background=\'var(--surface-1)\'"'
        + ' onmouseleave="this.style.background=this._selected?\'var(--primary-light)\':\'\'">'
        + '<div style="display:flex;align-items:flex-start;gap:6px">'
        + '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:' + pinColor + ';flex-shrink:0;margin-top:3px;' + (hasPin ? '' : 'opacity:.3') + '" title="' + (hasPin ? 'Has coordinates' : 'No coordinates set') + '"></span>'
        + '<div style="min-width:0;flex:1">'
        + '<div style="font-weight:600;font-size:12px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(r.name) + '</div>'
        + '<div style="font-size:11px;color:var(--text-muted);margin-top:1px">' + esc(r.client_name || '—')
          + (prog ? ' · <span style="font-weight:700">' + prog + '</span>' : '') + '</div>'
        + '<div style="margin-top:4px;display:flex;align-items:center;gap:5px">'
        + '<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:8px;background:' + lcBg + ';color:' + lcColor + '">' + lc + '</span>'
        + '<a href="/area.html?id=' + esc(r.id) + '" onclick="event.stopPropagation()"'
          + ' style="font-size:10px;color:var(--primary);text-decoration:none;font-weight:600">Open ↗</a>'
        + '</div>'
        + '</div></div></div>';
    });
    html += '</div>';
    listEl.innerHTML = html;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── Overview Leaflet map (R15.1) ─────────────────────────────────────────────
  function ovStatusColor(r) {
    if (r.closed_at)          return '#28A745';
    if (r.build_finalized_at) return '#1B5FA0';
    return '#9BA1A8';
  }

  function ovPinIcon(color) {
    return L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + color
        + ';border:2px solid rgba(0,0,0,.22);box-shadow:0 1px 5px rgba(0,0,0,.32)"></div>',
      iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -9],
    });
  }

  function ensureLeaflet(cb) {
    if (typeof L !== 'undefined') { cb(); return; }
    var hrefs = [
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css',
    ];
    hrefs.forEach(function (href) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href;
      document.head.appendChild(l);
    });
    function loadScript(src, next) {
      var s = document.createElement('script'); s.src = src; s.onload = next;
      document.head.appendChild(s);
    }
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js', function () {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js', cb);
    });
  }

  function initOverviewMap() {
    if (_overviewMap) { setTimeout(function () { _overviewMap.invalidateSize(); }, 100); return; }
    var el = document.getElementById('overview-map');
    if (!el) return;

    _overviewMap = L.map('overview-map', { center: [32.8407, -83.6324], zoom: 11 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(_overviewMap);

    if (typeof L.markerClusterGroup !== 'undefined') {
      _ovCluster = L.markerClusterGroup({ maxClusterRadius: 50 });
      _overviewMap.addLayer(_ovCluster);
    }
    // If data already loaded, plot it
    if (_mapData) plotSaMarkers(_mapData);
  }

  function plotSaMarkers(rows) {
    if (!_overviewMap) return;
    // Remove old layers
    Object.values(_ovBoundaries).forEach(function (l) { _overviewMap.removeLayer(l); });
    if (_ovCluster) _ovCluster.clearLayers();
    _ovMarkers = {}; _ovBoundaries = {};

    (rows || []).forEach(function (r) {
      var color = ovStatusColor(r);

      // Boundary polygon
      if (r.boundary) {
        try {
          var bndry = typeof r.boundary === 'string' ? JSON.parse(r.boundary) : r.boundary;
          var layer = L.geoJSON(bndry, {
            style: { color: color, weight: 2, fillOpacity: 0.07, opacity: 0.5 }
          }).addTo(_overviewMap);
          _ovBoundaries[r.id] = layer;
        } catch (_) {}
      }

      // Pin (only when coordinates exist)
      if (r.center_lat != null && r.center_lng != null) {
        var marker = L.marker([r.center_lat, r.center_lng], { icon: ovPinIcon(color) });
        marker.bindPopup(ovMakeSaPopup(r), { minWidth: 190 });
        marker.on('click', function () { ovHighlightList(r.id); });
        _ovMarkers[r.id] = marker;
        (_ovCluster || _overviewMap).addLayer(marker);
      }
    });
  }

  function ovMakeSaPopup(r) {
    var prog = (r.program || '').toUpperCase();
    var lc   = r.closed_at ? 'Final·Archived' : r.build_finalized_at ? 'Completed' : 'Active';
    return '<div style="font-size:12px">'
      + '<div style="font-weight:700;font-size:13px;margin-bottom:3px">' + esc(r.name) + '</div>'
      + '<div style="color:#666;font-size:11px;margin-bottom:2px">' + esc(r.client_name || '—') + '</div>'
      + (prog ? '<span style="font-size:10px;font-weight:700;background:#eee;padding:1px 5px;border-radius:8px">' + prog + '</span> ' : '')
      + '<span style="font-size:10px;color:#888">' + lc + '</span>'
      + '<div style="margin-top:7px;display:flex;gap:5px;flex-wrap:wrap">'
      + '<a href="/area.html?id=' + esc(r.id) + '" style="display:inline-block;padding:4px 12px;background:#1B5FA0;color:#fff;border-radius:5px;font-size:11px;font-weight:600;text-decoration:none">Open →</a>'
      // R15.5 — boundary edit from the overview map
      + '<button onclick="window.ovEditBoundary(' + esc(JSON.stringify(r.id)) + ')" style="padding:4px 10px;border:1px solid #ccc;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;background:#fff;color:#333">'
      + '<i class=\'fa-solid fa-draw-polygon\'></i> Boundary</button>'
      + '</div></div>';
  }

  function ovHighlightList(id) {
    var listEl = document.getElementById('map-sa-list');
    if (!listEl) return;
    listEl.querySelectorAll('[data-sa-id]').forEach(function (el) {
      var sel = el.dataset.saId === id;
      el._selected = sel;
      el.style.background = sel ? 'var(--primary-light)' : '';
      if (sel) el.scrollIntoView({ block: 'nearest' });
    });
  }

  // List item click: highlight + fly the map to the SA's pin
  window.ovClickListItem = function (el, id) {
    ovHighlightList(id);
    var marker = _ovMarkers[id];
    if (marker && _overviewMap) {
      _overviewMap.flyTo(marker.getLatLng(), Math.max(_overviewMap.getZoom(), 14), { duration: 0.8 });
      marker.openPopup();
    }
  };

  // CC drawer toggle
  window.saToggleCcPanel = function () {
    var drawer = document.getElementById('cc-drawer');
    var btn    = document.getElementById('cc-panel-btn');
    if (!drawer) return;
    var open = drawer.style.display === 'none';
    drawer.style.display = open ? '' : 'none';
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (_overviewMap) setTimeout(function () { _overviewMap.invalidateSize(); }, 320);
  };

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
      var sel  = cc.id === _selectedCcId;
      // HTML-escape the JSON args so their string-quotes don't terminate the
      // double-quoted attribute (and to neutralize any markup in cc.name).
      var args = esc(JSON.stringify(cc.id) + ',' + JSON.stringify(cc.name));
      return '<div role="button" tabindex="0" onclick="saSelectCc(' + args + ')"'
        + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \')saSelectCc(' + args + ')"'
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

  // ── R15.5 — Overview map boundary editing ─────────────────────────────────────

  function ovFlash(msg, type) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:10px 18px;'
      + 'border-radius:8px;font-size:13px;font-weight:500;z-index:9999;white-space:nowrap;'
      + 'box-shadow:0 4px 12px rgba(0,0,0,.25);'
      + (type === 'err' ? 'background:#DC3545;color:#fff' : 'background:#212529;color:#fff');
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, 3200);
  }

  function ensureLeafletDraw(cb) {
    if (typeof L !== 'undefined' && typeof L.Draw !== 'undefined') { cb(); return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.min.css';
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function ovBndShowBar(show) {
    var bar = document.getElementById('ov-bnd-bar');
    if (!bar) return;
    bar.style.display = show ? 'flex' : 'none';
    if (show && _ovBndSaData) {
      var nameEl = document.getElementById('ov-bnd-sa-name');
      if (nameEl) nameEl.textContent = _ovBndSaData.name || 'Boundary';
    }
    // disable popup interactions while editing
    var ccBtn = document.getElementById('cc-panel-btn');
    if (ccBtn) ccBtn.disabled = show;
  }

  function ovBndSetLayer(layer) {
    if (_ovBndLayer) _ovBndItems.removeLayer(_ovBndLayer);
    _ovBndLayer = layer;
    _ovBndItems.addLayer(_ovBndLayer);
    if (_ovBndEditH) { try { _ovBndEditH.disable(); } catch(_){} }
    _ovBndEditH = new L.EditToolbar.Edit(_overviewMap, { featureGroup: _ovBndItems });
    _ovBndEditH.enable();
    var drawBtn = document.getElementById('ov-bnd-draw-btn');
    if (drawBtn) drawBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Redraw';
  }

  function ovBndExit() {
    _ovBndMode    = false;
    _ovBndSaId    = null;
    _ovBndSaData  = null;
    _ovBndItems   = null;
    _ovBndLayer   = null;
    _ovBndHandler = null;
    _ovBndEditH   = null;
    ovBndShowBar(false);
    var ccBtn = document.getElementById('cc-panel-btn');
    if (ccBtn) ccBtn.disabled = false;
  }

  window.ovEditBoundary = function(saId) {
    if (!_overviewMap) return;
    // close any open popup first
    _overviewMap.closePopup();

    var saRow = (_mapData || []).find(function(r){ return r.id === saId; });
    if (!saRow) { ovFlash('Service area data not found', 'err'); return; }

    ensureLeafletDraw(function() {
      _ovBndMode   = true;
      _ovBndSaId   = saId;
      _ovBndSaData = saRow;
      _ovBndOrigGeo = saRow.boundary || null;

      _ovBndItems = new L.FeatureGroup();
      _overviewMap.addLayer(_ovBndItems);

      // If existing boundary: remove display layer and add editable version
      if (_ovBoundaries[saId]) {
        _overviewMap.removeLayer(_ovBoundaries[saId]);
        delete _ovBoundaries[saId];
      }
      var bndGeo = saRow.boundary;
      if (bndGeo) {
        try {
          var geo = typeof bndGeo === 'string' ? JSON.parse(bndGeo) : bndGeo;
          var ring = geo.coordinates ? geo.coordinates[0]
            : (geo.geometry ? geo.geometry.coordinates[0] : null);
          if (ring) {
            var latlngs = ring.map(function(c){ return [c[1], c[0]]; });
            var poly = L.polygon(latlngs, { color: '#1B5FA0', weight: 2.5, fillOpacity: 0.12 });
            ovBndSetLayer(poly);
          }
        } catch(_) {}
      }

      ovBndShowBar(true);
      ovFlash('Boundary edit — adjust vertices or draw a new polygon, then save');
    });
  };

  window.ovBndDraw = function() {
    if (!_overviewMap || !_ovBndMode) return;
    if (_ovBndEditH)  { try { _ovBndEditH.disable(); }  catch(_){} _ovBndEditH = null; }
    if (_ovBndHandler){ try { _ovBndHandler.disable(); } catch(_){} }
    _ovBndHandler = new L.Draw.Polygon(_overviewMap, {
      shapeOptions: { color: '#1B5FA0', weight: 2.5, fillOpacity: 0.12 }
    });
    _ovBndHandler.enable();
    _overviewMap.once('draw:created', function(e) {
      _ovBndHandler = null;
      ovBndSetLayer(e.layer);
    });
    ovFlash('Click to add vertices — double-click to close polygon');
  };

  window.ovBndSave = async function() {
    if (!_ovBndMode || !_ovBndItems) return;
    var layers = [];
    _ovBndItems.eachLayer(function(l){ layers.push(l); });
    if (!layers.length) { ovFlash('Draw a boundary polygon first', 'err'); return; }

    if (_ovBndEditH) { try { _ovBndEditH.save(); _ovBndEditH.disable(); } catch(_){} }

    var layer = layers[0];
    var geo = layer.toGeoJSON();
    var coords = geo.geometry && geo.geometry.coordinates && geo.geometry.coordinates[0];
    if (!coords || coords.length < 3) { ovFlash('Invalid boundary polygon', 'err'); return; }

    var ring = (coords[coords.length-1][0]===coords[0][0] && coords[coords.length-1][1]===coords[0][1])
      ? coords.slice(0,-1) : coords;
    var avgLat = ring.reduce(function(s,c){return s+c[1];},0)/ring.length;
    var avgLng = ring.reduce(function(s,c){return s+c[0];},0)/ring.length;
    var saId = _ovBndSaId;

    try {
      var res = await fetch('/api/service-areas/'+encodeURIComponent(saId)+'/boundary', {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boundary: geo.geometry,
          center_lat: Math.round(avgLat*1e6)/1e6,
          center_lng: Math.round(avgLng*1e6)/1e6
        })
      });
      if (!res.ok) { var err = await res.json(); throw new Error(err.error || 'HTTP '+res.status); }

      // Update in-memory map data
      var saRow = (_mapData||[]).find(function(r){return r.id===saId;});
      if (saRow) {
        saRow.boundary   = geo.geometry;
        saRow.center_lat = avgLat;
        saRow.center_lng = avgLng;
      }
      // Remove editable feature group + redraw as static boundary
      if (_ovBndItems) _overviewMap.removeLayer(_ovBndItems);
      var color = saRow ? ovStatusColor(saRow) : '#9BA1A8';
      var newLayer = L.geoJSON(geo.geometry, {
        style: { color: color, weight: 2, fillOpacity: 0.07, opacity: 0.5 }
      }).addTo(_overviewMap);
      _ovBoundaries[saId] = newLayer;
      // Move pin to new center
      if (saRow && _ovMarkers[saId]) {
        _ovMarkers[saId].setLatLng([avgLat, avgLng]);
      }
      ovBndExit();
      ovFlash('Boundary saved');
    } catch(e) {
      ovFlash(e.message||'Failed to save boundary', 'err');
      if (_ovBndItems && _ovBndLayer) {
        _ovBndEditH = new L.EditToolbar.Edit(_overviewMap, { featureGroup: _ovBndItems });
        _ovBndEditH.enable();
      }
    }
  };

  window.ovBndCancel = function() {
    if (_ovBndHandler) { try { _ovBndHandler.disable(); } catch(_){} }
    if (_ovBndEditH)   { try { _ovBndEditH.disable();   } catch(_){} }
    var saId = _ovBndSaId;
    if (_ovBndItems && _overviewMap) _overviewMap.removeLayer(_ovBndItems);
    // Restore original boundary
    if (_ovBndOrigGeo && _overviewMap && saId) {
      try {
        var geo = typeof _ovBndOrigGeo==='string' ? JSON.parse(_ovBndOrigGeo) : _ovBndOrigGeo;
        var saRow = (_mapData||[]).find(function(r){return r.id===saId;});
        var color = saRow ? ovStatusColor(saRow) : '#9BA1A8';
        _ovBoundaries[saId] = L.geoJSON(geo, {
          style:{ color:color, weight:2, fillOpacity:0.07, opacity:0.5 }
        }).addTo(_overviewMap);
      } catch(_){}
    }
    ovBndExit();
  };

})();
