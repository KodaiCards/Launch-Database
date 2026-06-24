/* service_areas_map.js — List|Map toggle + map-data panel for service-areas.html (R13-B).
   Additive; does not touch service_areas_ui.js or service_areas_filters.js. */
(function () {
  'use strict';

  var _mapData       = null;   // raw rows from GET /api/map/service-areas
  var _mapLoaded     = false;
  var _mapClientFil  = '';
  var _mapAreaFil    = '';

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
})();
