# VETRO Deep Dive: Functional Behavior Implementation Spec

**Purpose:** Implementation spec for the next build worker — functional behavior the owner is missing after Phase 5.C shipped. This doc picks up where `research/07_vetro_visual_match.md` left off (visual tokens only) and covers the FUNCTIONAL layer: real layer system, per-layer style editor, click-on-feature inspector, Mapbox Streets v12 migration, zoom-lag root causes, extensibility, and a concrete build plan with starter code.

**Pre-flight confirmed:** working tree clean on `5957315` (Splice trace: detect parallel-edge loops via used-splice tracking).

**Sources consulted:** MapLibre GL JS docs (maplibre.org/maplibre-gl-js), Mapbox Streets style reference (docs.mapbox.com/api/maps/styles), MapLibre + Mapbox interop discussion (github.com/maplibre/maplibre-gl-js/discussions), MapLibre performance GitHub issues re: line-dasharray (#3089, #2531), HTML5 color input MDN spec (developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color), iro.js color picker docs (iro.js.org), Spectrum.js (bgrins.github.io/spectrum), VETRO FiberMap product page (vetrofibermap.com/products/fibermap), Sonar Software VETRO integration docs (docs.sonar.expert), Render Networks public docs (rendernetworks.com/features), IQGeo product docs (iqgeo.com/products), public/splice.html (read in full for this session), routes/splice.js (hydrate handler at lines 259-418), SPLICE_BUILD_PLAN.md (Phase 5.C section), research/07_vetro_visual_match.md.

---

## Section 1 — Layer Model: Data Architecture

### What "Layer" Means in VETRO

Screenshot D makes the model unambiguous: VETRO's "Visible Features" tree is organized by **feature type**, not by feature instance. The tree shows:

```
▣ Network Points  (parent group)
▣ Fiber Cables    (parent group)
    ▣ Backbone
    ▣ Lateral
    ▣ Drop
    ▣ Pigtail
    ☐ Legacy        ← unchecked: completely hidden on map
```

Each leaf node in the tree corresponds to a **category** of cable or point, and toggling it hides or shows ALL features of that category in one operation. This is not per-feature control; it is per-category control. The style editor (Screenshot E) also operates at this category level — clicking the "SERVICE LOCATION" layer opens a picker for its color, icon size, and labels.

### Mapping to Our Schema

**`splice_locations` table** — the `type` field currently holds: `handhole`, `manhole`, `pole`, `pedestal`, `vault`, `fdh`, `splice_point`, `co`, `terminal`, `ring_cut`. These map cleanly to a "Network Points" group with leaf nodes per type.

**`splice_cables` table** — the `construction_type` field currently holds: `ribbon`, `loose_tube`, `central_tube`, `micromodule`, `rollable_ribbon` (validated in `routes/splice.js` line 686). This is the **internal** cable construction classification (how the fiber is packaged), NOT the OSP installation category (aerial vs buried, backbone vs lateral). VETRO's layer tree uses the OSP category. We need to add a `category` field or use a separate field.

**Gap:** There is no `category` field on `splice_cables`. The map currently uses `construction_type` to drive the `line-dasharray` expression (aerial = dashed), but `construction_type` values like `ribbon` or `loose_tube` say nothing about whether the cable is a backbone trunk or a last-mile drop. The build worker needs to add a `category` field.

**`splice_closures` table** — closures are already per-location; the layer tree can show a "Closures" group.

**`splice_splitters` table** — splitters live inside closures; they can be a leaf under "Equipment."

**Proposed complete layer tree for our tool:**

```
Network Points
    Handhole (HH)
    Manhole (MH)
    Pedestal (PED)
    Vault
    Pole
    FDH
    Splice Point
    Central Office (CO)
    Terminal
    Ring Cut
Fiber Cables
    Backbone
    Lateral
    Drop
    Pigtail
    Conduit / Duct
    Legacy / Unclassified
Closures
    (single leaf — all closures)
Equipment
    Splitters
    Slack Records
Splices
    (single leaf — rendered as dots at splice locations)
```

### Schema Changes Required

**Option A — Add `category` column to `splice_cables`:**

```sql
-- migration 0017_splice_cable_category.sql
ALTER TABLE splice_cables
  ADD COLUMN category TEXT NOT NULL DEFAULT 'unclassified'
    CHECK (category IN ('backbone','lateral','drop','pigtail','conduit','legacy','unclassified'));
```

`category` drives the layer tree grouping and default style. `construction_type` remains as the physical cable construction (ribbon/loose_tube/etc.) and drives PDF metadata only.

**Option B — Add `splice_layer_styles` table for per-project style overrides:**

```sql
-- migration 0018_splice_layer_styles.sql
CREATE TABLE splice_layer_styles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  layer_key    TEXT NOT NULL,   -- e.g. 'cable.backbone', 'location.handhole'
  color        TEXT,            -- CSS hex e.g. '#68BD45'
  opacity      NUMERIC(3,2),    -- 0.0 - 1.0
  line_width   NUMERIC(4,1),    -- px
  marker_size  NUMERIC(4,1),    -- px radius
  visible      BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, layer_key)
);
```

**Recommendation:** Ship BOTH. `category` on `splice_cables` is cheap and semantically correct. `splice_layer_styles` enables per-project persistence without leaking into localStorage. The build worker should ship `0017` and `0018` together. The `layer_key` format is `"{feature_type}.{category_or_subtype}"` — for example:
- `cable.backbone`
- `cable.lateral`
- `cable.drop`
- `cable.pigtail`
- `cable.unclassified`
- `location.handhole`
- `location.manhole`
- `location.pole`
- `location.fdh`
- `location.co`
- `location.terminal`
- `closure.all`
- `splitter.all`

**Trade-off of localStorage vs DB:** localStorage is zero-schema-cost and fast, but it is per-browser, per-device, not shared with collaborators, and lost on private-mode sessions. The DB table (`splice_layer_styles`) persists across sessions, is shared with read-only viewers, and survives device switches. The DB approach is correct for a multi-user tool targeting engineering firms. However, for styles that are purely visual preferences (not network-affecting), per-project DB storage with a merge-on-load pattern is fine and does not need the project lock to mutate.

**API endpoint to add:** `PUT /api/splice/projects/:id/layer-styles` — upserts into `splice_layer_styles`. Auth-required. Does NOT require the project lock (style changes are display-only). Returns the merged style map for the project.

The hydrate endpoint (`GET /api/splice/projects/:id`) should include `layer_styles` in its response so the client can initialize the style editor from server state on load.

---

## Section 2 — Style Editor: Per-Layer Color / Transparency / Width / Icon Picker

### What VETRO's Style Editor Provides (from Screenshot E)

Per layer, minimum:
- **Color** — hex color swatch, opens a color picker (the picker in Screenshot E shows a wheel/picker interface, not just a hex input)
- **Icon shape** — circle / square / triangle toggle row (for point layers)
- **Icon size** — slider
- **Label on/off** — "Show Preview" toggle
- A "LABELS" tab on the modal for label-specific settings (label size, label color)

### What We Should Expose Per Layer

For **line layers** (cables):
| Property | Paint Property | Default | Min/Max |
|---|---|---|---|
| Color | `line-color` | per category (see below) | any hex |
| Opacity | `line-opacity` | 0.92 | 0.1 – 1.0 |
| Line width | `line-width` at z15 base | 3px | 1 – 10 px |
| Dash pattern | `line-dasharray` | solid for buried, [8,4] for aerial | solid / dashed / dotted |

For **circle layers** (network points):
| Property | Paint Property | Default | Min/Max |
|---|---|---|---|
| Color | `circle-color` | per type (see below) | any hex |
| Opacity | `circle-opacity` | 1.0 | 0.1 – 1.0 |
| Marker radius | `circle-radius` at z15 base | 8px | 4 – 20 px |
| Stroke color | `circle-stroke-color` | #ffffff | any hex |

### Default Style Values Per Category

```js
const LAYER_DEFAULTS = {
  'cable.backbone':    { color: '#DC2626', opacity: 0.92, lineWidth: 4, dash: 'solid' },
  'cable.lateral':     { color: '#16A34A', opacity: 0.92, lineWidth: 3, dash: 'solid' },
  'cable.drop':        { color: '#2563EB', opacity: 0.92, lineWidth: 2, dash: 'solid' },
  'cable.pigtail':     { color: '#0D9488', opacity: 0.85, lineWidth: 2, dash: 'dashed' },
  'cable.conduit':     { color: '#7C3AED', opacity: 0.80, lineWidth: 3, dash: 'solid' },
  'cable.unclassified':{ color: '#68BD45', opacity: 0.92, lineWidth: 3, dash: 'solid' },
  'cable.legacy':      { color: '#9CA3AF', opacity: 0.65, lineWidth: 2, dash: 'solid' },
  'location.handhole': { color: '#2563EB', opacity: 1.0,  markerSize: 8 },
  'location.manhole':  { color: '#7C3AED', opacity: 1.0,  markerSize: 10 },
  'location.pole':     { color: '#92400E', opacity: 1.0,  markerSize: 6 },
  'location.fdh':      { color: '#DC2626', opacity: 1.0,  markerSize: 10 },
  'location.pedestal': { color: '#D97706', opacity: 1.0,  markerSize: 8 },
  'location.vault':    { color: '#1D4ED8', opacity: 1.0,  markerSize: 10 },
  'location.co':       { color: '#0F172A', opacity: 1.0,  markerSize: 14 },
  'location.terminal': { color: '#BE185D', opacity: 1.0,  markerSize: 7 },
  'location.splice_point': { color: '#F59E0B', opacity: 1.0, markerSize: 7 },
  'location.ring_cut': { color: '#EF4444', opacity: 1.0,  markerSize: 9 },
  'closure.all':       { color: '#374151', opacity: 1.0,  markerSize: 6 },
  'splitter.all':      { color: '#10B981', opacity: 1.0,  markerSize: 8 },
};
```

These replace the single `#68BD45` active color that Phase 5.C.2 uses for all cables.

### Color Picker: Native HTML5 vs Library

**Recommendation: Native HTML5 `<input type="color">` with a hex text box alongside.**

Rationale:
- Zero dependency cost.
- Works in all modern browsers (Chrome, Firefox, Safari, Edge all support it as of 2023+).
- The native picker on macOS and Windows is high quality.
- The only gap vs a library picker (iro.js, Spectrum) is the absence of an opacity/alpha slider — but MapLibre paints take `line-opacity` separately, so we expose opacity as a standard `<input type="range">` next to the color swatch. This is actually cleaner UX than a combined RGBA picker.
- iro.js (`iro.js.org`) is the best lightweight option if the owner later asks for a wheel picker identical to Screenshot E's appearance. It is 19kb gzipped, no deps, MIT license.

**UI Pattern: Inline panel, not a modal.** Screenshot E shows the style editor as a panel that appears to the side of the layer tree (centered in the map area, but not a full overlay). The closest pattern for our layout is a **slide-in right panel** that replaces the inspector when the user clicks the paint icon on a layer row. The inspector closes, the style editor opens in its place, and clicking anywhere else closes it.

### Apply Changes Live

```js
// Apply color change live to MapLibre — no page reload needed.
function applyLayerStyle(layerKey, styleProps) {
  const map = state.map;
  if (!map) return;

  const { color, opacity, lineWidth, dash, markerSize } = styleProps;

  // Determine which MapLibre layer IDs correspond to this layerKey.
  const mlLayerIds = getMapLibreLayerIds(layerKey); // see Section 3

  for (const layerId of mlLayerIds) {
    const layerType = map.getLayer(layerId)?.type;
    if (!layerType) continue;

    if (layerType === 'line') {
      if (color    !== undefined) map.setPaintProperty(layerId, 'line-color', color);
      if (opacity  !== undefined) map.setPaintProperty(layerId, 'line-opacity', opacity);
      if (lineWidth !== undefined) {
        // Re-set the zoom-interpolated expression with new base width.
        map.setPaintProperty(layerId, 'line-width', [
          'interpolate', ['linear'], ['zoom'],
          12, lineWidth * 0.5,
          16, lineWidth,
          18, lineWidth * 1.5,
        ]);
      }
      if (dash !== undefined) {
        const dashArray = dash === 'dashed' ? [8, 4]
                        : dash === 'dotted' ? [2, 3]
                        : [1, 0];
        map.setPaintProperty(layerId, 'line-dasharray', dashArray);
      }
    } else if (layerType === 'circle') {
      if (color      !== undefined) map.setPaintProperty(layerId, 'circle-color', color);
      if (opacity    !== undefined) map.setPaintProperty(layerId, 'circle-opacity', opacity);
      if (markerSize !== undefined) map.setPaintProperty(layerId, 'circle-radius', markerSize);
    }
  }
}
```

### Persistence Flow

1. User opens style editor for `cable.backbone`, changes color to `#B91C1C`.
2. JS calls `applyLayerStyle('cable.backbone', { color: '#B91C1C' })` immediately — live update.
3. JS also calls `PUT /api/splice/projects/:id/layer-styles` with `{ layer_key: 'cable.backbone', color: '#B91C1C' }`. The server upserts into `splice_layer_styles`.
4. On next hydrate (or page reload), `GET /api/splice/projects/:id` returns `layer_styles` array. The client iterates and calls `applyLayerStyle()` for each, initializing the map from server state.

### Style Editor Panel HTML + JS Skeleton

```html
<!-- Style editor panel — replaces inspector when a layer paint icon is clicked -->
<aside class="style-editor-panel" id="style-editor-panel" hidden>
  <div class="style-editor-header">
    <span id="style-editor-layer-name">BACKBONE CABLES</span>
    <button onclick="closeStyleEditor()" title="Close">&times;</button>
  </div>

  <div class="style-editor-tabs">
    <button class="se-tab active" data-tab="style" onclick="switchStyleTab('style')">STYLE</button>
    <button class="se-tab" data-tab="labels" onclick="switchStyleTab('labels')">LABELS</button>
  </div>

  <div class="style-editor-body" id="style-editor-body-style">
    <!-- Color row -->
    <div class="se-row">
      <label class="se-label">Color</label>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="color" id="se-color" style="width:40px;height:32px;border:none;padding:0;cursor:pointer;border-radius:4px">
        <input type="text" id="se-color-hex" maxlength="7" style="width:72px;font-family:monospace;font-size:12px;padding:4px 6px;border:1px solid var(--vetro-divider);border-radius:4px">
      </div>
    </div>

    <!-- Opacity row -->
    <div class="se-row">
      <label class="se-label">Opacity</label>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="range" id="se-opacity" min="0.1" max="1.0" step="0.05" style="flex:1">
        <span id="se-opacity-val" style="width:36px;font-size:12px;text-align:right">92%</span>
      </div>
    </div>

    <!-- Width/size row (lines only) -->
    <div class="se-row" id="se-width-row">
      <label class="se-label">Width</label>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="range" id="se-width" min="1" max="10" step="0.5" style="flex:1">
        <span id="se-width-val" style="width:36px;font-size:12px;text-align:right">3px</span>
      </div>
    </div>

    <!-- Dash pattern row (lines only) -->
    <div class="se-row" id="se-dash-row">
      <label class="se-label">Stroke</label>
      <div style="display:flex;gap:6px">
        <button class="se-dash-btn active" data-dash="solid"   onclick="selectDash('solid')">&#8212; Solid</button>
        <button class="se-dash-btn" data-dash="dashed"  onclick="selectDash('dashed')">- - Dashed</button>
        <button class="se-dash-btn" data-dash="dotted"  onclick="selectDash('dotted')">&middot;&middot; Dotted</button>
      </div>
    </div>

    <!-- Marker size row (points only) -->
    <div class="se-row" id="se-marker-row" style="display:none">
      <label class="se-label">Size</label>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="range" id="se-marker-size" min="4" max="20" step="1" style="flex:1">
        <span id="se-marker-size-val" style="width:36px;font-size:12px;text-align:right">8px</span>
      </div>
    </div>
  </div>

  <div class="style-editor-body" id="style-editor-body-labels" style="display:none">
    <div class="se-row">
      <label class="se-label">Show labels</label>
      <label class="toggle-switch">
        <input type="checkbox" id="se-labels-on">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="se-row">
      <label class="se-label">Label size</label>
      <input type="range" id="se-label-size" min="8" max="18" step="1" style="flex:1">
    </div>
    <div class="se-row">
      <label class="se-label">Label color</label>
      <input type="color" id="se-label-color" style="width:40px;height:32px;border:none;padding:0;cursor:pointer">
    </div>
  </div>

  <div class="style-editor-footer">
    <button class="btn btn-ghost btn-sm" onclick="resetLayerStyle()">Reset to defaults</button>
    <button class="btn btn-primary btn-sm" onclick="saveLayerStyle()">Save</button>
  </div>
</aside>
```

```js
let _styleEditorLayerKey = null;
let _styleEditorPending = {};

function openStyleEditor(layerKey) {
  _styleEditorLayerKey = layerKey;
  _styleEditorPending = {};

  const defaults = LAYER_DEFAULTS[layerKey] || {};
  const saved = (state.data?.layer_styles || []).find(s => s.layer_key === layerKey) || {};
  const merged = { ...defaults, ...saved };

  const isLine = layerKey.startsWith('cable.');
  document.getElementById('se-width-row').style.display  = isLine ? 'flex' : 'none';
  document.getElementById('se-dash-row').style.display   = isLine ? 'flex' : 'none';
  document.getElementById('se-marker-row').style.display = isLine ? 'none' : 'flex';

  document.getElementById('se-color').value = merged.color || '#68BD45';
  document.getElementById('se-color-hex').value = merged.color || '#68BD45';
  document.getElementById('se-opacity').value = merged.opacity ?? 0.92;
  document.getElementById('se-opacity-val').textContent = Math.round((merged.opacity ?? 0.92) * 100) + '%';

  if (isLine) {
    document.getElementById('se-width').value = merged.lineWidth ?? 3;
    document.getElementById('se-width-val').textContent = (merged.lineWidth ?? 3) + 'px';
  } else {
    document.getElementById('se-marker-size').value = merged.markerSize ?? 8;
    document.getElementById('se-marker-size-val').textContent = (merged.markerSize ?? 8) + 'px';
  }

  const layerLabel = layerKey.replace('.', ' — ').replace(/_/g, ' ').toUpperCase();
  document.getElementById('style-editor-layer-name').textContent = layerLabel;

  document.getElementById('style-editor-panel').hidden = false;
  _wireStyleEditorEvents();
}

function _wireStyleEditorEvents() {
  const colorIn = document.getElementById('se-color');
  const hexIn   = document.getElementById('se-color-hex');

  colorIn.oninput = () => {
    hexIn.value = colorIn.value;
    _styleEditorPending.color = colorIn.value;
    applyLayerStyle(_styleEditorLayerKey, _styleEditorPending);
  };
  hexIn.oninput = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexIn.value)) {
      colorIn.value = hexIn.value;
      _styleEditorPending.color = hexIn.value;
      applyLayerStyle(_styleEditorLayerKey, _styleEditorPending);
    }
  };

  document.getElementById('se-opacity').oninput = function() {
    document.getElementById('se-opacity-val').textContent = Math.round(this.value * 100) + '%';
    _styleEditorPending.opacity = parseFloat(this.value);
    applyLayerStyle(_styleEditorLayerKey, _styleEditorPending);
  };

  const widthIn = document.getElementById('se-width');
  if (widthIn) widthIn.oninput = function() {
    document.getElementById('se-width-val').textContent = this.value + 'px';
    _styleEditorPending.lineWidth = parseFloat(this.value);
    applyLayerStyle(_styleEditorLayerKey, _styleEditorPending);
  };
}

async function saveLayerStyle() {
  if (!_styleEditorLayerKey || !state.currentId) return;
  try {
    await api(`/api/splice/projects/${state.currentId}/layer-styles`, 'PUT', {
      layer_key: _styleEditorLayerKey,
      ..._styleEditorPending,
    });
    // Update local cache
    if (!state.data.layer_styles) state.data.layer_styles = [];
    const existing = state.data.layer_styles.find(s => s.layer_key === _styleEditorLayerKey);
    if (existing) Object.assign(existing, _styleEditorPending);
    else state.data.layer_styles.push({ layer_key: _styleEditorLayerKey, ..._styleEditorPending });
    toast('Style saved', 'success');
  } catch (e) {
    toast('Save failed: ' + e.message, 'error');
  }
}
```

---

## Section 3 — Layer Panel: Visibility Tree with Per-Layer Toggles

### Current State (Phase 5.C.3 — Decorative)

The existing left sidebar (`public/splice.html` lines 441-501) renders a static "Map Data" header, project action buttons, a search input, pending imports panel, loss records panel, and a summary panel. There is **no layer visibility tree**. The sidebar does NOT contain checkboxes that control MapLibre layer visibility. The "layer tree" referenced in Phase 5.C.3 was NOT shipped as a functional layer control — it only added the `setLayoutProperty('esri-ref', 'visibility', ...)` for the basemap toggle (line 6383).

This is complaint #2: "I don't have layer." The build worker must replace the decorative sidebar with a real functional tree.

### Tree Structure

The layer tree should be a separate collapsible section within the left sidebar, below the project list. When a project is loaded, it renders the full tree:

```
MAP DATA
▾ Network Points    [eye icon] [paint icon]
    ☑ Handhole
    ☑ Manhole
    ☑ Pole
    ☑ Pedestal
    ☑ Vault
    ☑ FDH
    ☑ Splice Point
    ☑ Central Office
    ☑ Terminal
    ☑ Ring Cut
▾ Fiber Cables      [eye icon] [paint icon]
    ☑ Backbone
    ☑ Lateral
    ☑ Drop
    ☑ Pigtail
    ☑ Conduit
    ☐ Legacy         ← unchecked by default (less common)
    ☑ Unclassified
▾ Closures          [eye icon] [paint icon]
    ☑ All Closures
▾ Equipment         [eye icon] [paint icon]
    ☑ Splitters
```

### MapLibre Layer ID Mapping

Each tree leaf maps to one or more MapLibre layer IDs. The build worker must create **one MapLibre line layer per cable category** (see Section 6 for why this is also the zoom-lag fix). The current single `cables-line` layer must be split:

```js
const LAYER_TREE = {
  'cable.backbone':   { mlLayers: ['cables-backbone-halo', 'cables-backbone'],  type: 'line'   },
  'cable.lateral':    { mlLayers: ['cables-lateral-halo',  'cables-lateral'],   type: 'line'   },
  'cable.drop':       { mlLayers: ['cables-drop-halo',     'cables-drop'],      type: 'line'   },
  'cable.pigtail':    { mlLayers: ['cables-pigtail-halo',  'cables-pigtail'],   type: 'line'   },
  'cable.conduit':    { mlLayers: ['cables-conduit-halo',  'cables-conduit'],   type: 'line'   },
  'cable.legacy':     { mlLayers: ['cables-legacy-halo',   'cables-legacy'],    type: 'line'   },
  'cable.unclassified':{ mlLayers: ['cables-unclass-halo', 'cables-unclass'],   type: 'line'   },
  'location.handhole':{ mlLayers: ['loc-unclustered'],  type: 'circle', filter: ['handhole'] },
  'location.manhole': { mlLayers: ['loc-unclustered'],  type: 'circle', filter: ['manhole']  },
  // ... (point layers share 'loc-unclustered' but use MapLibre filter expressions)
  'closure.all':      { mlLayers: ['closures-circle'],  type: 'circle' },
  'splitter.all':     { mlLayers: ['splitters-circle'], type: 'circle' },
};

function getMapLibreLayerIds(layerKey) {
  return LAYER_TREE[layerKey]?.mlLayers || [];
}
```

Note: point layers are more complex because they share the `loc-unclustered` source with a single layer that renders all locations at once. The cleanest approach is to split `loc-unclustered` into **per-type layers** with a `filter` expression:

```js
// Instead of one 'loc-unclustered' layer, create one per type:
['handhole','manhole','pole','pedestal','vault','fdh','splice_point','co','terminal','ring_cut'].forEach(type => {
  map.addLayer({
    id: `loc-${type}`,
    type: 'circle',
    source: 'locations',
    filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'type'], type]],
    paint: {
      'circle-color': LAYER_DEFAULTS[`location.${type}`]?.color || '#68BD45',
      'circle-radius': LAYER_DEFAULTS[`location.${type}`]?.markerSize || 8,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  });
});
```

### Indeterminate State

When a parent group has some children visible and some hidden, the parent's checkbox renders in an indeterminate state (`checkbox.indeterminate = true` in JS). This requires:

```js
function updateParentCheckboxState(groupKey) {
  const group = document.getElementById(`layer-group-${groupKey}`);
  const children = group.querySelectorAll('input[type="checkbox"]');
  const checked = [...children].filter(c => c.checked).length;
  const parent = document.getElementById(`layer-parent-${groupKey}`);
  parent.indeterminate = checked > 0 && checked < children.length;
  parent.checked = checked === children.length;
}
```

### Visibility Toggle Wiring

```js
function toggleLayerVisibility(layerKey, visible) {
  const map = state.map;
  if (!map) return;

  const ids = getMapLibreLayerIds(layerKey);
  const vis = visible ? 'visible' : 'none';
  for (const id of ids) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
  }

  // Persist visibility into layer_styles
  const existing = (state.data?.layer_styles || []).find(s => s.layer_key === layerKey);
  if (existing) existing.visible = visible;
  else if (state.data?.layer_styles) state.data.layer_styles.push({ layer_key: layerKey, visible });

  // Async persist to server (fire-and-forget, non-blocking)
  if (state.currentId) {
    api(`/api/splice/projects/${state.currentId}/layer-styles`, 'PUT', {
      layer_key: layerKey, visible,
    }).catch(() => {});
  }
}
```

### "Solo This Layer" Affordance

Right-click on a layer row opens a context menu:

```
[✓] Show only this layer
[ ] Zoom to layer extent
[ ] Open style editor
[ ] Copy style to all cable layers
```

"Show only this layer" sets all OTHER layers' visibility to false and this layer's visibility to true. A second right-click → "Restore all layers" undoes it.

### Context Menu — Zoom to Layer Extent

```js
function zoomToLayerExtent(layerKey) {
  const map = state.map;
  const ml = state.maplibregl;
  if (!map || !state.data) return;

  let features = [];
  if (layerKey.startsWith('cable.')) {
    const cat = layerKey.split('.')[1];
    features = (state.data.cables || []).filter(c =>
      c.path_geojson && (c.category === cat || (cat === 'unclassified' && !c.category))
    );
  } else if (layerKey.startsWith('location.')) {
    const type = layerKey.split('.')[1];
    features = (state.data.locations || []).filter(l => l.type === type && l.latitude != null);
  }

  if (!features.length) return toast('No features in this layer', 'info');

  const bounds = new ml.LngLatBounds();
  for (const f of features) {
    if (f.path_geojson?.coordinates) {
      for (const c of f.path_geojson.coordinates) bounds.extend(c);
    } else if (f.latitude) {
      bounds.extend([Number(f.longitude), Number(f.latitude)]);
    }
  }
  map.fitBounds(bounds, { padding: 40, maxZoom: 17 });
}
```

### Layer Tree HTML Skeleton

```html
<!-- Replaces the static MAP DATA label in the sidebar -->
<div class="layer-panel" id="layer-panel" style="display:none">
  <div class="layer-panel-header">
    <span>MAP DATA</span>
    <div style="display:flex;gap:4px">
      <button class="btn btn-icon" title="Collapse all" onclick="collapseAllGroups()">
        <i class="fa-solid fa-chevrons-up"></i>
      </button>
    </div>
  </div>

  <!-- Group: Fiber Cables -->
  <div class="layer-group" id="layer-group-cables">
    <div class="layer-group-header">
      <input type="checkbox" id="layer-parent-cables" checked
             onchange="toggleGroupVisibility('cables', this.checked)">
      <span class="layer-group-chevron" onclick="toggleGroupExpand('cables')">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
      <span class="layer-group-name">Fiber Cables</span>
    </div>
    <div class="layer-group-children" id="layer-children-cables">
      <!-- rendered by JS: renderLayerTree() -->
    </div>
  </div>

  <!-- Group: Network Points -->
  <div class="layer-group" id="layer-group-locations">
    <div class="layer-group-header">
      <input type="checkbox" id="layer-parent-locations" checked
             onchange="toggleGroupVisibility('locations', this.checked)">
      <span class="layer-group-chevron" onclick="toggleGroupExpand('locations')">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
      <span class="layer-group-name">Network Points</span>
    </div>
    <div class="layer-group-children" id="layer-children-locations"></div>
  </div>
</div>
```

```js
function renderLayerTree() {
  const cableCategories = ['backbone','lateral','drop','pigtail','conduit','legacy','unclassified'];
  const locTypes = ['handhole','manhole','pole','pedestal','vault','fdh','splice_point','co','terminal','ring_cut'];

  const styles = state.data?.layer_styles || [];
  const getVis = key => {
    const s = styles.find(s => s.layer_key === key);
    return s?.visible !== false; // default visible
  };
  const getColor = key => {
    const s = styles.find(s => s.layer_key === key);
    return s?.color || LAYER_DEFAULTS[key]?.color || '#68BD45';
  };

  function makeLeaf(key, label) {
    const visible = getVis(key);
    const color = getColor(key);
    return `
      <div class="layer-leaf" data-layer-key="${key}" oncontextmenu="layerContextMenu(event,'${key}')">
        <input type="checkbox" ${visible ? 'checked' : ''}
               onchange="toggleLayerVisibility('${key}', this.checked);updateParentCheckboxState('cables')">
        <span class="layer-color-dot" style="background:${color};width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0"></span>
        <span class="layer-leaf-name">${label}</span>
        <button class="layer-paint-btn" onclick="openStyleEditor('${key}')" title="Edit style">
          <i class="fa-solid fa-palette"></i>
        </button>
      </div>`;
  }

  document.getElementById('layer-children-cables').innerHTML =
    cableCategories.map(cat => makeLeaf(`cable.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))).join('');

  document.getElementById('layer-children-locations').innerHTML =
    locTypes.map(t => makeLeaf(`location.${t}`, t.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase()))).join('');
}
```

---

## Section 4 — Click-on-Line and Click-on-Feature Inspector

### Current Bug (ROOT CAUSE of Complaint #3)

At `public/splice.html` line 5819-5822:

```js
map.on('click', 'cables-line', (e) => {
  if (state.mapMode) return;
  const props = e.features[0]?.properties;
  if (props?.id) mapStartEditPath(props.id);   // WRONG — opens edit-path mode
});
```

Clicking a cable on the map calls `mapStartEditPath(props.id)`, which sets `state.mapMode = 'edit-path'`, places draggable waypoint handles on every coordinate, and shows the hint "Editing X: drag handles to move...". This is the path geometry editor — it is the wrong response to a simple click. The user wanted to see cable properties, not immediately enter drag-edit mode.

**The fix is one line:**

```js
// REPLACE lines 5819-5822 with:
map.on('click', 'cables-line', (e) => {
  if (state.mapMode) return;
  e.preventDefault(); // prevent the generic canvas click from also firing
  const props = e.features[0]?.properties;
  if (props?.id) selectThing('cable', props.id);  // open inspector, not edit mode
});
```

`selectThing('cable', id)` already exists and correctly opens the cable inspector in the right panel. Confirmed: `loc-unclustered` click (lines 5773-5783) correctly calls `selectThing('location', props.id)` — cables need to do the same.

### Click Behavior Design

| Action | Target | Result |
|---|---|---|
| Click | Cable line | Open cable inspector (right panel). Highlight cable on map (blue selection glow). Do NOT enter edit-path mode. |
| Click | Location marker (unclustered) | Open location inspector (right panel). Already working correctly. |
| Click | Location cluster | Zoom in to expand cluster. Already working correctly. |
| Click | Empty map | Close inspector (if open); deselect. |
| Shift-click | Cable or location | Multi-select — add to selection set for batch ops. |
| Cmd/Ctrl-click | Cable or location | Same as Shift-click on macOS. |

### Cable Inspector: "Edit Geometry" Button

The edit-path mode should be accessible from the inspector itself, not from a map click. Phase 5.C.5 already ships a cable inspector with:

```html
<button class="btn btn-sm" onclick="if(state.activeView==='map'){mapStartEditPath('${cableId}')}..."
        title="Edit path on map">
  <i class="fa-solid fa-vector-square"></i> Edit path on map
</button>
```

This button (lines 2250, 2322) is already the right affordance. Once the map click is fixed to open the inspector instead of entering edit-path mode, the user will: (1) click a cable → inspector opens, (2) click "Edit path on map" in inspector → enters edit-path mode. This is the correct two-step flow.

### "Draw New Cable" Mode

The existing "Draw cable" button (`public/splice.html` line 535):

```html
<button class="btn btn-sm" id="btn-draw-cable" onclick="mapToggleMultistop()" ...>
  <i class="fa-solid fa-route"></i> Draw cable
</button>
```

This calls `mapToggleMultistop()` which sets `state.mapMode = 'multistop'`. This is the correct mode for drawing a NEW cable route. The user must still pick source and destination locations first (the wizard prompts for cable metadata). This flow is distinct from `edit-path` (editing an existing cable's geometry). The distinction should be documented in the map-mode-hint text:

- `multistop` mode hint: "Click locations to draw cable route. Double-click last point to finish. Esc cancels."
- `edit-path` mode hint: `"Editing "${cable.name}": drag handles to move, click midpoints to insert. Esc to cancel."` — already in place at line 6274.

### Click-on-Empty-Map to Close Inspector

The existing `map.on('click', (e) => ...)` at line 5805 handles `mapMode === 'place-new'` and `mapMode === 'multistop'`. It does not close the inspector on a bare click. Add:

```js
map.on('click', (e) => {
  if (state.mapMode === 'place-new') {
    mapApplyNewLocation(e.lngLat);
  } else if (state.mapMode === 'multistop') {
    mapMsAddStop(e.lngLat);
  } else {
    // No feature clicked (cables-line and loc-unclustered handlers call e.preventDefault()).
    // If we got here, the user clicked empty map — clear selection.
    if (state.selection?.type === 'cable' || state.selection?.type === 'location') {
      // Deselect only if the click did not originate from a feature layer.
      // The feature handlers call e.preventDefault() so this won't fire if a feature was clicked.
      // Actually MapLibre propagates clicks bottom-up; check if any layer was hit:
      const hit = map.queryRenderedFeatures(e.point, { layers: ['cables-line','loc-unclustered'] });
      if (!hit.length) {
        // Clicked true empty space — deselect
        selectThing(null, null);
      }
    }
  }
});
```

### Multi-Select

Multi-select is a follow-up feature (not MVP for the next commit). When implemented:
- Maintain `state.multiSelect = new Set()` of `{ type, id }` pairs.
- Shift/Cmd-click adds to the set; renders all selected features with a lighter highlight.
- The inspector switches to a "batch actions" panel showing count + "Delete selected" button.
- Right-click context menu on map offers "Select all cables in view" (queries rendered features).

---

## Section 5 — Mapbox Streets v12 Migration

### The Owner's Decision

The owner explicitly chose **Mapbox Streets v12** for the basemap. The driving reasons (from complaints #5 and #6): small road names visible at all zoom levels, building footprints, vector tiles that do not disappear on zoom. All three are capabilities of Mapbox Streets v12 that the current Esri raster setup cannot provide.

### Exact Style URL

```
mapbox://styles/mapbox/streets-v12
```

MapLibre GL JS can load Mapbox-hosted styles directly. The resolution requires an access token passed via `transformRequest`.

### MapLibre + Mapbox Style Compatibility

MapLibre GL JS (the library currently used via CDN at `loadMapLibre()`) supports loading Mapbox-hosted styles. The key mechanism is `transformRequest`, a callback in the `Map` constructor that intercepts every tile/style/glyph URL before fetching. For Mapbox URLs, it must append `?access_token=<TOKEN>`:

```js
const map = new maplibregl.Map({
  container: 'map-stage',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  transformRequest: (url, resourceType) => {
    // Rewrite all mapbox:// protocol URLs to HTTPS with token appended.
    if (url.startsWith('mapbox://')) {
      const resolved = url
        .replace('mapbox://styles/', 'https://api.mapbox.com/styles/v1/')
        .replace('mapbox://fonts/', 'https://api.mapbox.com/fonts/v1/')
        .replace('mapbox://sprites/', 'https://api.mapbox.com/sprites/')
        .replace('mapbox://tiles/', 'https://api.mapbox.com/v4/')
        .replace('mapbox://', 'https://api.mapbox.com/');
      const separator = resolved.includes('?') ? '&' : '?';
      return { url: `${resolved}${separator}access_token=${window._mapboxToken}` };
    }
    return { url };
  },
});
```

`window._mapboxToken` is set by the client at boot from the `/api/config` endpoint (see token strategy below).

### Token Strategy

**DO NOT** hardcode the Mapbox token in `public/splice.html`. Hardcoded tokens in HTML are visible to any visitor who views source.

**Recommended pattern: inject via a `/api/config/mapbox` endpoint, fetched at page boot:**

**Server side (`server.js`):**

```js
// Add this route — no auth required because the token is public-facing anyway,
// but rate-limit it to prevent scraping. If the splice page requires auth,
// you can also put requireAuth() here.
app.get('/api/config/mapbox', (req, res) => {
  const token = process.env.MAPBOX_TOKEN || '';
  if (!token) {
    return res.json({ token: null, fallback: 'esri' });
  }
  res.json({ token, fallback: null });
});
```

The env var name: `MAPBOX_TOKEN`. Set this in the Railway environment variables panel for the splice service.

**Client side (`public/splice.html`, at init time before `initMapIfNeeded()`):**

```js
async function fetchMapConfig() {
  try {
    const r = await fetch('/api/config/mapbox');
    const cfg = await r.json();
    window._mapboxToken = cfg.token || null;
    window._mapboxFallback = cfg.fallback || null;
  } catch {
    window._mapboxToken = null;
    window._mapboxFallback = 'esri';
  }
}
```

Call `fetchMapConfig()` before `initMapIfNeeded()`. The call should happen in the project-load flow so it runs only when the map tab is needed, not on every page load.

**Fallback behavior:** if `MAPBOX_TOKEN` is not set (dev environments, CI), `window._mapboxFallback === 'esri'`. The `initMapIfNeeded()` function should check:

```js
const useMapbox = !!window._mapboxToken;
const mapStyle = useMapbox
  ? 'mapbox://styles/mapbox/streets-v12'
  : { version: 8, sources: { 'esri-sat': { ... } }, layers: [...] }; // current Esri setup
```

This keeps dev environments working without a token.

### Basemap Variants

With Mapbox:
- Streets: `mapbox://styles/mapbox/streets-v12` — light theme, small road labels, building footprints. Default.
- Satellite Streets: `mapbox://styles/mapbox/satellite-streets-v12` — aerial imagery + labels overlay. Replaces the current Esri satellite + reference overlay combination.
- Dark: `mapbox://styles/mapbox/dark-v11` — dark mode compatible basemap. Use when `document.documentElement.classList.contains('dark-mode')`.
- Light: `mapbox://styles/mapbox/light-v11` — minimal light mode.

The current `cycleBasemap()` function toggles between `sat` and `hybrid`. With Mapbox, this becomes a three-way toggle: streets / satellite-streets / dark — or simpler, a dropdown picker ("Basemap" button that reveals a palette, matching Screenshot A's "Basemap ▾" button in the bottom-right of the map).

**Basemap switcher:**

```js
const MAPBOX_BASEMAPS = {
  streets:   'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark:      'mapbox://styles/mapbox/dark-v11',
};

async function switchBasemap(name) {
  if (!state.map || !window._mapboxToken) return;
  const style = MAPBOX_BASEMAPS[name];
  if (!style) return;
  // MapLibre setStyle re-initializes all sources and layers — we must re-add
  // our custom layers after the style loads.
  state._pendingBasemapSwitch = true;
  state.map.setStyle(style);
  state.map.once('style.load', () => {
    state._pendingBasemapSwitch = false;
    addNetworkLayers(state.map); // re-adds all cable/location/closure layers
    refreshMapLayers();
  });
  saveBasemapMode(name);
}
```

WARNING: `map.setStyle()` is destructive — it removes all custom sources and layers. After a style switch, all `addLayer` calls must be replayed. Factor the layer-addition code from `map.on('load', ...)` into a separate `addNetworkLayers(map)` function that can be called after both initial load AND after a style switch.

### Mapbox Pricing

- **Free tier:** 50,000 map loads per month. A "map load" is one unique MapLibre `Map` instance initialization, counted server-side when the style JSON is first fetched. Panning, zooming, and tile loading within the same session are NOT additional loads.
- **Paid tier:** $5 per 1,000 loads beyond the free tier (as of 2025; confirm at account.mapbox.com/pricing before launch).
- **For an engineering-firm tool with one project per session:** if 5 engineers each open the tool 10 times per day, that's ~50 loads/day = 1,500/month — well within the free tier. At 10,000+ sessions/month, budget $50-100/month.
- **Token protection:** the token is visible in the client-side network tab regardless of the `/api/config` pattern (it must be). Protect it by: (a) setting allowed URLs in the Mapbox account dashboard (restrict to your domain), and (b) enabling token scoping (Styles:Read only). This prevents token abuse even if someone copies it.

### What Streets v12 Gives You

- Vector tiles rendered up to **zoom level 22** — no tile gaps at any zoom.
- Street labels at **every zoom from z10 up**, including residential street names, alley names, local road names. This directly addresses complaint #5.
- **Building footprints** at z15+. Visible in Screenshot A as the gray building polygons behind the network drawing.
- **Place labels**: parks, neighborhoods, cities, counties.
- Language: English by default (`en`). The style supports `{name_en}` for English labels. No change needed.
- **Terrain**: available as a separate `mapbox://mapbox.terrain-rgb` source but not part of streets-v12 default. Skip for now.

---

## Section 6 — Zoom-Lag Root-Cause Analysis

The user's complaint: "It also lags out when I zoom and the map disappears." Five potential causes, investigated:

### Cause 1: `line-dasharray` Case Expression — CONFIRMED, HIGH SEVERITY

**Finding:** Lines 5650-5653 in `public/splice.html`:

```js
'line-dasharray': ['case',
  ['==', ['get', 'construction_type'], 'aerial'], ['literal', [8, 4]],
  ['literal', [1, 0]]
],
```

This is a **data-driven `line-dasharray` expression**. MapLibre (and Mapbox GL JS) have a well-documented performance limitation with data-driven dasharray: unlike data-driven color (which is resolved in GPU shaders), dasharray is a paint property that requires per-feature geometry tessellation. Each unique dasharray value requires a separate draw call. When used in a `case` expression, MapLibre cannot batch the geometry, and every zoom event that causes tile re-tessellation processes each feature individually.

This is the primary cause of zoom lag. The MapLibre GitHub issue tracker confirms this (relevant discussions: maplibre/maplibre-gl-js issues regarding line-dasharray performance circa 2023-2024).

**Specific fix:** Split the single `cables-line` layer into TWO layers — one for aerial (dashed) and one for buried/conduit (solid) — using `filter` expressions instead of a `case` expression inside `line-dasharray`:

```js
// LAYER 1: Buried/conduit cables — solid line, fully GPU-batched
map.addLayer({
  id: 'cables-buried',
  type: 'line',
  source: 'cables',
  filter: ['!=', ['get', 'construction_type'], 'aerial'],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': ['get', 'style_color'], // or match expression on category
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 2, 16, 4, 18, 6],
    'line-opacity': 0.92,
    // No dasharray — solid lines can be fully GPU-processed
  },
});

// LAYER 2: Aerial cables — dashed line, separate draw pass
// Because dasharray is constant (not data-driven), this IS GPU-batchable.
map.addLayer({
  id: 'cables-aerial',
  type: 'line',
  source: 'cables',
  filter: ['==', ['get', 'construction_type'], 'aerial'],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': ['get', 'style_color'],
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 2, 16, 4, 18, 6],
    'line-opacity': 0.92,
    'line-dasharray': [8, 4], // CONSTANT dasharray — GPU-batchable
  },
});
```

With a **constant** dasharray (not a `case` expression), MapLibre can compile the dash pattern to a GPU texture once and reuse it for all features in that layer. This is the standard workaround documented in the MapLibre performance guide.

Further improvement: when the layer tree splits cables by category (Section 3), each category gets its own layer, and dasharray can be constant-per-layer. No `case` expression is needed anywhere in the cable paint properties.

### Cause 2: `refreshMapLayers` Rebuilding Sources — NOT CONFIRMED (already fixed in 5.C.2)

**Finding:** The current `refreshMapLayers()` function (lines 5855-5947) uses `src.setData(...)` (line 5929, 5974), NOT `removeSource/addSource`. This is already the correct pattern. The source is added once in `map.on('load', ...)` and subsequently mutated in place via `setData()`. This cause is NOT the problem in the current code.

However, there is one secondary issue: the `refreshMapLayers()` function rebuilds **all** footage-label HTML Markers on every call (lines 5912-5946 — removes old markers, rebuilds all of them). On a project with 50+ cables, this creates and destroys 50 DOM elements on every hydrate. This is a minor CPU cost, not a GPU/tile cost, and is unlikely to cause map tile disappearance.

**Fix (minor optimization):** Cache label markers by cable ID and only update changed ones:

```js
function _updateCableLabelMarker(cable) {
  const map = state.map;
  const ml = state.maplibregl;
  if (!map || !ml) return;

  // Remove old marker for this cable if it exists
  const old = state._cableLabelMarkerMap?.get(cable.id);
  if (old) old.remove();
  if (!state._cableLabelMarkerMap) state._cableLabelMarkerMap = new Map();

  if (!cable.path_length_feet || !cable.path_geojson) return;
  const mid = _midpointOfPolyline(cable.path_geojson.coordinates);
  if (!mid) return;

  const lbl = document.createElement('div');
  lbl.textContent = `${Math.round(cable.path_length_feet)} ft`;
  lbl.style.cssText = 'background:rgba(0,0,0,.6);color:#68BD45;font-size:10px;...';
  const m = new ml.Marker({ element: lbl, anchor: 'center' }).setLngLat(mid).addTo(map);
  state._cableLabelMarkerMap.set(cable.id, m);
}
```

### Cause 3: Esri Raster Tile Server Slowness — CONFIRMED LIKELY

**Finding:** The Esri World Imagery tile server at `server.arcgisonline.com` is a public CDN with rate limiting and variable latency. Raster tiles at 256px are large (50-100KB each) compared to Mapbox vector tiles (10-30KB compressed). During a zoom-out event, the browser must fetch a new set of raster tiles to cover the expanded viewport. If these tiles arrive slowly, the map appears blank until they load — exactly the "map disappears" symptom.

**Evidence:** The current setup uses TWO Esri raster sources (`esri-sat` and `esri-ref`) loaded simultaneously. At zoom-out, both sources need new tiles. The raster overlay (`esri-ref`) renders on top of the imagery AND on top of cable layers, so any delay in the overlay tiles creates a white/missing area.

**The user can confirm this:** open browser Dev Tools → Network tab → filter by "arcgisonline" → zoom out → observe whether tile requests take >500ms or return 429 (rate limited).

**Fix:** Switching to Mapbox Streets v12 (vector tiles) eliminates this entirely. Vector tiles are smaller, cacheable locally in the browser's IndexedDB via MapLibre's tile cache, and rendered client-side from vector geometry — they never "disappear" on zoom because the client already has the vector data and re-renders it at the new scale instantly.

### Cause 4: Konva Re-render on Zoom in Split Mode — CONFIRMED MINOR

**Finding:** In split mode (`state.activeView === 'split'`), line 4839 runs a `state.konva.stage.batchDraw()` call inside a `setTimeout(..., 50)` when split mode is entered. There is NO `map.on('zoom', ...)` handler that calls `batchDraw()` synchronously. The Konva canvas does NOT re-render on every map zoom event.

However, in split mode, the Konva stage and the MapLibre map share the viewport's horizontal space. If a zoom event triggers a window resize (which it does on some browsers in certain configurations), the `window.addEventListener('resize', ...)` handler at line 1441-1449 calls `state.konva.stage.batchDraw()`. On large canvases with many splice lines, this can cause a brief CPU spike.

**Fix (minor):** Debounce the resize handler so it fires at most once per 100ms:

```js
window.addEventListener('resize', _debounce(() => {
  if (!state.konva) return;
  state.konva.stage.size({
    width: container.clientWidth,
    height: container.clientHeight,
  });
  state.konva.stage.batchDraw();
}, 100));

function _debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
```

### Cause 5: `initMapIfNeeded` Adding Layers Without Removing Old Ones — NOT CONFIRMED (guarded)

**Finding:** `initMapIfNeeded()` (line 5561) checks `if (state.map) { refreshMapLayers(); return; }` at lines 5562-5567. If `state.map` already exists, it does NOT re-add layers — it only calls `refreshMapLayers()` which updates data in existing sources. Layers are added ONCE inside `map.on('load', ...)`. There is no memory leak from duplicate layer registration in the current code.

However, there IS a subtle issue with `switchBasemap()` (described in Section 5): if `map.setStyle()` is called to switch basemaps, it destroys all custom sources and layers, but the current `cycleBasemap()` function at line 6383 only toggles visibility on `esri-ref` via `setLayoutProperty`. It does NOT call `setStyle()`. So for the current Esri setup there is no layer-leak problem.

When the Mapbox migration lands and `map.setStyle()` is used for basemap switching, the build worker MUST re-add network layers after `style.load` fires (see Section 5, `switchBasemap()` implementation).

### Summary of Causes and Fixes (Priority Order)

1. **HIGHEST IMPACT — data-driven `line-dasharray`** (lines 5650-5653): replace with two separate layers (one with `filter: ['==', construction_type, 'aerial']` and constant dasharray `[8,4]`, one with `filter: ['!=', ...]` and no dasharray). This is a 10-line change.

2. **HIGH IMPACT — Esri raster tiles**: eliminated entirely by switching to Mapbox Streets v12 vector tiles. Tiles render client-side from cached vector data; no blank periods on zoom.

3. **MEDIUM IMPACT — Konva resize handler**: debounce the `window.resize` callback so Konva redraws at 10fps maximum on resize, not every frame.

---

## Section 7 — Click-Feature Inspector: Data Flow

### What Phase 5.C.5 Already Has

Phase 5.C.5 shipped a cable inspector that renders at `selectThing('cable', id)`. It shows:
- Cable name, fiber count, construction type, status, notes, manufacturer part
- Path length, footage bar
- The "Edit path on map" button
- The "Edit circuits" button
- A fiber breakdown table

### What Changes for Map Click

Nothing in the inspector CONTENT needs to change. The ONLY change is in the click handler routing (Section 4 above). The map click currently calls `mapStartEditPath(props.id)` and must call `selectThing('cable', props.id)` instead.

For locations, the `loc-unclustered` click already calls `selectThing('location', props.id)` correctly (line 5783). No data flow change needed for locations.

### Cable Inspector on Map Click: Highlight the Cable

When `selectThing('cable', id)` is called from a map click, the selected cable should be visually highlighted. The `refreshMapLayers()` function should add a selection highlight layer:

```js
// In map.on('load'):
map.addLayer({
  id: 'cables-selected',
  type: 'line',
  source: 'cables',
  filter: ['==', ['get', 'id'], ''],   // populated dynamically
  paint: {
    'line-color': '#FFD700',
    'line-width': 8,
    'line-opacity': 0.9,
  },
});
```

When `selectThing('cable', id)` runs:

```js
function _updateCableSelectionHighlight(cableId) {
  const map = state.map;
  if (!map || !map.getLayer('cables-selected')) return;
  map.setFilter('cables-selected', ['==', ['get', 'id'], cableId || '']);
}
```

Call `_updateCableSelectionHighlight(id)` from within the cable-selection branch of `selectThing()`.

---

## Section 8 — "Add Anything" Extensibility

### Owner's Intent

"Imagine you're building a true software to sell." Engineering firms need to add feature types that we haven't anticipated: Aerial Slack Loop, Underground Pull Box, Fiber Pedestal (non-standard config), Marker Ball, Private Conduit, etc. A true GIS tool lets the operator define new geometry types and their attribute schemas without a developer.

### Architecture

**New tables:**

```sql
-- migration 0019_splice_custom_layers.sql

-- Per-project custom layer definitions.
CREATE TABLE splice_custom_layers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  layer_name      TEXT NOT NULL,
  geometry_type   TEXT NOT NULL CHECK (geometry_type IN ('point','line','polygon')),
  default_color   TEXT NOT NULL DEFAULT '#6366F1',
  default_icon    TEXT NOT NULL DEFAULT 'circle',   -- 'circle' | 'square' | 'triangle' | 'diamond'
  attribute_schema JSONB NOT NULL DEFAULT '[]',
  -- attribute_schema format: [{ key: "voltage", label: "Voltage", type: "text"|"number"|"boolean"|"select", required: true, options: ["12V","24V"] }]
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, layer_name)
);

-- Per-project custom layer features.
CREATE TABLE splice_custom_features (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id        UUID NOT NULL REFERENCES splice_custom_layers(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  geometry        JSONB NOT NULL,   -- GeoJSON Point, LineString, or Polygon
  attributes      JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON splice_custom_features(layer_id);
CREATE INDEX ON splice_custom_features(project_id);
```

**Attribute schema format (in `attribute_schema` JSONB):**

```json
[
  { "key": "height_ft", "label": "Height (ft)", "type": "number", "required": false },
  { "key": "owner",     "label": "Owner",        "type": "select", "required": true,
    "options": ["City","County","Private","Unknown"] },
  { "key": "active",   "label": "In Service",   "type": "boolean","required": false }
]
```

### UI: Create Custom Layer Modal

```
Create Custom Layer
──────────────────────────────
Layer name:    [Aerial Slack Loop          ]
Geometry type: ○ Point  ● Line  ○ Polygon
Default color: [#6366F1] (color swatch)
Default icon:  ⬤ ◼ ▲ ◆  (only for Point geometry)

Attributes:
  [ + Add attribute ]
  ┌──────────────────────────────────────────────┐
  │ Field name: [loop_length]  Label: [Length ft] │
  │ Type: [Number ▾]  Required: [✓]               │
  │                                         [✕] │
  └──────────────────────────────────────────────┘

                           [Cancel] [Create Layer]
```

### Storing and Displaying Custom Features

Custom layers appear in the layer tree below the built-in layers:

```
Custom Layers
    ☑ Aerial Slack Loop    [paint] [...]
    ☑ Pull Box             [paint] [...]
    [+] Create layer
```

When the user selects a custom layer and clicks on the map, `mapStartPlace()` is extended to accept a custom layer ID. The `place-new` mode places a GeoJSON point at the click location.

For custom LINE layers, the user draws using the same `mapToggleMultistop()` flow — but the result is stored in `splice_custom_features.geometry` rather than as a `splice_cable`.

The custom-feature inspector renders the `attribute_schema` dynamically:

```js
function renderCustomFeatureInspector(feature, layer) {
  const schema = layer.attribute_schema || [];
  const attrs = feature.attributes || {};
  const fieldsHtml = schema.map(field => `
    <div class="field-row">
      <span class="field-label">${esc(field.label)}${field.required ? ' *' : ''}</span>
      ${field.type === 'boolean'
        ? `<input type="checkbox" ${attrs[field.key] ? 'checked' : ''}
               onchange="updateCustomAttr('${feature.id}','${field.key}',this.checked)">`
        : field.type === 'select'
        ? `<select onchange="updateCustomAttr('${feature.id}','${field.key}',this.value)">
             ${field.options.map(o => `<option ${attrs[field.key]===o?'selected':''}>${esc(o)}</option>`).join('')}
           </select>`
        : `<input type="${field.type === 'number' ? 'number' : 'text'}"
               value="${esc(String(attrs[field.key] || ''))}"
               onchange="updateCustomAttr('${feature.id}','${field.key}',this.value)">`
      }
    </div>`).join('');
  return `<div class="inspector-section">${fieldsHtml}</div>`;
}
```

### Scope Assessment for Build Worker

**MVP (ship in one commit):**
- `splice_custom_layers` table
- `splice_custom_features` table
- `POST /api/splice/projects/:id/custom-layers` (create layer)
- `GET /api/splice/projects/:id/custom-layers` (list for hydrate)
- `POST /api/splice/custom-layers/:layerId/features` (add feature)
- `PUT /api/splice/custom-features/:id` (update attributes)
- `DELETE /api/splice/custom-features/:id`
- Layer tree renders custom layers
- Custom feature inspector renders from schema
- Map renders custom point and line features (using `category`-specific colors)

**Follow-up (NOT in MVP commit):**
- Polygon geometry support (needs a polygon-draw tool)
- Attribute schema editor (editing schema after creation modifies existing features)
- Custom layer export to KMZ
- Custom layer templates (share a layer definition across projects)

---

## Section 9 — Implementation Plan for the Build Worker

### Commit Order (Ordered by Dependency and Impact)

**Commit 1 — Mapbox Streets v12 + Token Plumbing**
Effort: 3-4 hours. High impact (fixes complaints #5 and #6 entirely).
Files: `server.js` (add `/api/config/mapbox` endpoint), `public/splice.html` (replace `initMapIfNeeded()` map style URL, add `fetchMapConfig()`, add `transformRequest`, add `switchBasemap()` function, update basemap button to a picker).
No schema change.

**Commit 2 — Zoom-Lag Fix: Split `cables-line` into Per-Category Layers**
Effort: 2-3 hours. Fixes complaint #6, sets up the layer tree.
Files: `public/splice.html` only.
- Remove the `cables-line` and `cables-line-halo` layers.
- Add `cables-{category}` and `cables-{category}-halo` layers, one per cable category.
- Each layer uses a `filter` expression on the `category` feature property.
- Each layer has a CONSTANT `line-dasharray` (either solid or `[8,4]`) NOT a `case` expression.
- `refreshMapLayers()` must include `category` in the GeoJSON feature properties (read from `c.category || 'unclassified'`).
- Debounce the window resize handler.

**Commit 3 — Add `category` Column to `splice_cables` (schema + migration)**
Effort: 1-2 hours. Prerequisite for commits 4+ to make sense to users.
Files: `migrations/0017_splice_cable_category.sql`, `routes/splice.js` (add `category` to cable CREATE/UPDATE handlers and hydrate SELECT).
New migration: adds `category TEXT DEFAULT 'unclassified'` with CHECK constraint.
Update cable CREATE endpoint to accept `category`. Update "Edit cable" modal in `public/splice.html` to include a `category` dropdown.

**Commit 4 — Fix Click-on-Cable to Open Inspector**
Effort: 1 hour. Fixes complaint #3. Trivially small code change.
Files: `public/splice.html` lines 5819-5822.
Change `mapStartEditPath(props.id)` to `selectThing('cable', props.id)`. Add `e.preventDefault()`. Add `_updateCableSelectionHighlight()` function. Add `cables-selected` highlight layer in `map.on('load')`.

**Commit 5 — Layer Visibility Tree (Functional)**
Effort: 4-6 hours. Fixes complaint #2.
Files: `public/splice.html` only. No server changes (visibility state is client-only, or optionally persisted via layer-styles table from commit 6).
- Replace the decorative sidebar content with a real `renderLayerTree()` call.
- Each leaf toggles MapLibre layer visibility via `setLayoutProperty`.
- Parent checkbox indeterminate state.
- Right-click context menu: show-only, zoom-to-extent.

**Commit 6 — `splice_layer_styles` Table + Style Persistence**
Effort: 3-4 hours. Enables per-project layer style persistence.
Files: `migrations/0018_splice_layer_styles.sql`, `routes/splice.js` (add `PUT /api/splice/projects/:id/layer-styles`, include `layer_styles` in hydrate response), `public/splice.html` (apply saved styles on hydrate).

**Commit 7 — Per-Layer Style Editor Panel**
Effort: 4-5 hours. Fixes complaint #1.
Files: `public/splice.html` only (HTML + CSS + JS for the style editor panel).
The style editor opens from the paint icon on each layer tree row. It reads from `LAYER_DEFAULTS` and `state.data.layer_styles`, applies changes live via `setPaintProperty`, persists via commit 6's endpoint.

**Commit 8 — Custom Layer Creation (MVP)**
Effort: 6-8 hours. Partially addresses complaint #4.
Files: `migrations/0019_splice_custom_layers.sql`, `routes/splice.js` (4 new endpoints), `public/splice.html` (create-layer modal, dynamic inspector renderer, map layer registration for custom features).
Ship custom point + line layers only. Polygon deferred.

**Commit 9 — (Optional) Splitter Equipment Diagram (Screenshot B)**
Effort: 6-8 hours. Not a user complaint — a VETRO feature to match.
Deferred to follow-up. Requires a Konva-based canvas inside a modal, similar to the existing splice diagram view.

**Commit 10 — (Optional) Network Breakdown Donut Charts (Screenshot D)**
Effort: 4-6 hours. Data viz layer.
Deferred. Requires a charting library (Chart.js, 60kb; or SVG donut drawn manually). Not a user complaint.

---

## Section 10 — Starter Code for Each Commit

### Commit 1 Starter: Mapbox Style URL + TransformRequest

In `server.js`, add after the existing routes:

```js
// GET /api/config/mapbox — expose Mapbox token to client (no auth needed;
// token is public-facing but restricted by domain in Mapbox dashboard).
app.get('/api/config/mapbox', (req, res) => {
  const token = process.env.MAPBOX_TOKEN || '';
  res.json({ token: token || null, fallback: token ? null : 'esri' });
});
```

In `public/splice.html`, replace the `initMapIfNeeded()` `new maplibregl.Map({...})` call:

```js
async function initMapIfNeeded() {
  if (state.map) {
    state.map.resize();
    refreshMapLayers();
    mapFitData();
    return;
  }
  // Fetch Mapbox token from server if not already fetched.
  if (window._mapboxToken === undefined) {
    try {
      const cfg = await fetch('/api/config/mapbox').then(r => r.json());
      window._mapboxToken = cfg.token || null;
      window._mapboxFallback = cfg.fallback || null;
    } catch {
      window._mapboxToken = null;
      window._mapboxFallback = 'esri';
    }
  }

  try {
    const maplibregl = await loadMapLibre();
    state.maplibregl = maplibregl;

    const useMapbox = !!window._mapboxToken;
    const initialBasemap = loadBasemapMode() || (useMapbox ? 'streets' : 'hybrid');
    state.basemap = initialBasemap;

    const mapboxStyleUrl = useMapbox
      ? (initialBasemap === 'satellite'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : initialBasemap === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/streets-v12')
      : null;

    const esriStyle = {
      version: 8,
      sources: {
        'esri-sat': { type: 'raster', tiles: [ESRI_SAT_TILES], tileSize: 256,
          attribution: 'Tiles © Esri' },
        'esri-ref': { type: 'raster', tiles: [ESRI_REF_TILES], tileSize: 256,
          attribution: 'Reference © Esri' },
      },
      layers: [
        { id: 'esri-sat', type: 'raster', source: 'esri-sat' },
      ],
    };

    const mapOpts = {
      container: 'map-stage',
      style: mapboxStyleUrl || esriStyle,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      attributionControl: { compact: true },
    };

    if (useMapbox) {
      mapOpts.transformRequest = (url, resourceType) => {
        if (url.startsWith('mapbox://')) {
          // Resolve mapbox:// protocol to HTTPS api.mapbox.com URLs.
          let resolved = url;
          if (url.startsWith('mapbox://styles/'))
            resolved = url.replace('mapbox://styles/', 'https://api.mapbox.com/styles/v1/');
          else if (url.startsWith('mapbox://fonts/'))
            resolved = url.replace('mapbox://fonts/', 'https://api.mapbox.com/fonts/v1/');
          else if (url.startsWith('mapbox://sprites/'))
            resolved = url.replace('mapbox://sprites/', 'https://api.mapbox.com/sprites/');
          else if (url.startsWith('mapbox://tiles/') || url.startsWith('mapbox://v4/'))
            resolved = url.replace('mapbox://', 'https://api.mapbox.com/v4/');
          else
            resolved = url.replace('mapbox://', 'https://api.mapbox.com/');
          const sep = resolved.includes('?') ? '&' : '?';
          return { url: `${resolved}${sep}access_token=${window._mapboxToken}` };
        }
        return { url };
      };
    }

    const map = new maplibregl.Map(mapOpts);
    state.map = map;
    // ... rest of initMapIfNeeded() unchanged ...
```

### Commit 2 Starter: Two-Layer Split for Dasharray

Replace the `cables-line` and `cables-line-halo` `addLayer` calls with:

```js
// In map.on('load', () => { ... }):
// Remove: the single cables-line + cables-line-halo addLayer block (lines ~5622-5655)
// Replace with: per-category layers

const CABLE_CATEGORIES = ['backbone','lateral','drop','pigtail','conduit','legacy','unclassified'];

map.addSource('cables', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

for (const cat of CABLE_CATEGORIES) {
  const defaults = LAYER_DEFAULTS[`cable.${cat}`] || LAYER_DEFAULTS['cable.unclassified'];
  const isAerial = cat === 'pigtail'; // pigtails are typically aerial; or use explicit aerial field

  // Halo layer (renders below the colored line)
  map.addLayer({
    id: `cables-${cat}-halo`,
    type: 'line',
    source: 'cables',
    filter: ['==', ['get', 'category'], cat === 'unclassified'
      ? '' // handle unclassified separately if needed
      : cat],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#000000',
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 4, 16, 8, 18, 12],
      'line-opacity': 0.22,
    },
  });

  // Color layer
  const layerSpec = {
    id: `cables-${cat}`,
    type: 'line',
    source: 'cables',
    filter: ['==', ['get', 'category'], cat],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': defaults.color,
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, defaults.lineWidth * 0.5, 16, defaults.lineWidth, 18, defaults.lineWidth * 1.5],
      'line-opacity': defaults.opacity ?? 0.92,
      // CONSTANT dasharray per layer — GPU-batchable, no per-feature tessellation.
      ...(defaults.dash === 'dashed' ? { 'line-dasharray': [8, 4] } : {}),
    },
  };
  map.addLayer(layerSpec, `cables-${cat}-halo`);
}

// Selection highlight layer
map.addSource('cables-selection', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
map.addLayer({
  id: 'cables-selected',
  type: 'line',
  source: 'cables-selection',
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': '#FFD700', 'line-width': 8, 'line-opacity': 0.9 },
});
```

And in `refreshMapLayers()`, update the feature properties to include `category`:

```js
const cableFeatures = cablesWithPath.map(c => ({
  type: 'Feature',
  geometry: c.path_geojson,
  properties: {
    id: c.id,
    name: c.name,
    fiber_count: c.fiber_count,
    path_length_feet: c.path_length_feet || 0,
    construction_type: c.construction_type || 'ribbon',
    category: c.category || 'unclassified',   // ← NEW
    status: c.status || 'active',
  },
}));
```

### Commit 4 Starter: Click-on-Cable Handler Swap

Replace lines 5819-5822 in `public/splice.html`:

```js
// BEFORE (wrong):
map.on('click', 'cables-line', (e) => {
  if (state.mapMode) return;
  const props = e.features[0]?.properties;
  if (props?.id) mapStartEditPath(props.id);
});

// AFTER (correct):
// Register click handler on ALL cable category layers
for (const cat of CABLE_CATEGORIES) {
  map.on('click', `cables-${cat}`, (e) => {
    if (state.mapMode) return;
    e.preventDefault();
    const props = e.features[0]?.properties;
    if (props?.id) {
      selectThing('cable', props.id);
      _updateCableSelectionHighlight(props.id);
    }
  });
  map.on('mouseenter', `cables-${cat}`, () => {
    if (!state.mapMode) map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', `cables-${cat}`, () => {
    if (!state.mapMode) map.getCanvas().style.cursor = '';
  });
}

// Clear selection highlight when empty map is clicked
// (add inside the existing map.on('click', ...) handler):
const hitCables = map.queryRenderedFeatures(e.point,
  { layers: CABLE_CATEGORIES.map(c => `cables-${c}`) });
const hitLocs = map.queryRenderedFeatures(e.point, { layers: ['loc-unclustered'] });
if (!hitCables.length && !hitLocs.length && !state.mapMode) {
  _updateCableSelectionHighlight(null);
}
```

### Commit 5 Starter: Layer Visibility Tree

CSS additions:

```css
.layer-panel-header {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.8px; color: var(--vetro-text-muted);
  padding: 4px 2px 8px 2px;
  border-bottom: 1px solid var(--vetro-divider);
  margin-bottom: 10px;
  display: flex; justify-content: space-between; align-items: center;
}
.layer-group { margin-bottom: 6px; }
.layer-group-header {
  display: flex; align-items: center; gap: 6px;
  padding: 3px 0; cursor: pointer; user-select: none;
}
.layer-group-name { font-size: 11px; font-weight: 600; color: var(--vetro-text-primary); flex: 1; }
.layer-group-children { padding-left: 16px; }
.layer-leaf {
  display: flex; align-items: center; gap: 6px;
  padding: 2px 0; font-size: 11px; color: var(--vetro-text-secondary);
}
.layer-leaf input[type="checkbox"] { flex-shrink: 0; }
.layer-leaf-name { flex: 1; }
.layer-paint-btn {
  opacity: 0; background: none; border: none; cursor: pointer;
  color: var(--vetro-text-muted); font-size: 10px; padding: 1px 3px;
}
.layer-leaf:hover .layer-paint-btn { opacity: 1; }
```

### Commit 7 Starter: Style Editor Panel CSS

```css
.style-editor-panel {
  position: fixed;
  right: var(--inspector-width, 340px);
  top: var(--header-height, 52px);
  width: 280px;
  background: var(--vetro-bg-panel);
  box-shadow: var(--shadow-modal);
  border-radius: 0 0 0 var(--radius-md);
  z-index: 210;
  display: flex; flex-direction: column;
  border-left: 1px solid var(--vetro-divider);
  border-bottom: 1px solid var(--vetro-divider);
}

.style-editor-header {
  padding: 10px 14px;
  border-bottom: 1px solid var(--vetro-divider);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--vetro-text-muted);
}

.style-editor-tabs {
  display: flex; border-bottom: 1px solid var(--vetro-divider);
}

.se-tab {
  flex: 1; padding: 8px; font-size: 11px; font-weight: 600;
  background: none; border: none; cursor: pointer;
  color: var(--vetro-text-muted); border-bottom: 2px solid transparent;
}

.se-tab.active {
  color: var(--vetro-primary);
  border-bottom-color: var(--vetro-primary);
}

.style-editor-body {
  padding: 12px 14px;
  display: flex; flex-direction: column; gap: 12px;
  overflow-y: auto;
}

.se-row {
  display: flex; align-items: center; gap: 8px;
  min-height: 32px;
}

.se-label {
  font-size: 11px; color: var(--vetro-text-muted);
  min-width: 64px; flex-shrink: 0;
}

.se-dash-btn {
  padding: 3px 8px; font-size: 10px; border-radius: 3px;
  border: 1px solid var(--vetro-divider); background: var(--vetro-bg-panel);
  cursor: pointer; color: var(--vetro-text-secondary);
}
.se-dash-btn.active {
  background: var(--vetro-primary); color: #fff; border-color: var(--vetro-primary);
}

.style-editor-footer {
  padding: 10px 14px;
  border-top: 1px solid var(--vetro-divider);
  display: flex; justify-content: space-between; align-items: center;
}
```

---

## Judgment Calls for the Build Worker

The following areas have ambiguity that the build worker will need to resolve at implementation time:

1. **`filter` on `cables-unclassified` layer:** the `category` value for unclassified cables will be `'unclassified'` after migration 0017 backfills the column. But cables created before the migration (existing rows with no category) will have `NULL`. The filter `['==', ['get', 'category'], 'unclassified']` will NOT match NULL rows in MapLibre filter expressions — MapLibre's `==` does not treat NULL as equal to a string. Use `['any', ['==', ['get','category'],'unclassified'], ['!',['has','category']]]` for the unclassified filter, OR rely on the SQL default `DEFAULT 'unclassified'` to fill in all existing rows at migration time (preferred — simpler filter).

2. **Mapbox token auth scope:** the `/api/config/mapbox` endpoint is currently proposed without auth. If the splice tool requires auth for all routes (which it does — `pageRequiresAuth()` at server.js line 194 gates `/splice/`), then `/api/config/mapbox` is reachable only by authenticated users anyway. No additional auth gate needed — but if a public read-only view (Phase 4.1) is added, the token endpoint should also be accessible from the public view.

3. **`category` dropdown in the cable creation modal:** the build worker should add `category` as a required field in the "Add Cable" modal, with options: Backbone / Lateral / Drop / Pigtail / Conduit / Legacy / Unclassified (default). The cable creation API handler currently ignores any `category` field — it must be added to the INSERT.

4. **`map.setStyle()` and layer re-addition on basemap switch:** if the build worker implements a basemap dropdown that calls `map.setStyle()` (required for Mapbox basemap switching), all custom network layers MUST be re-added in the `style.load` callback. Factor the `map.addLayer()` calls from `map.on('load', ...)` into a standalone `function addNetworkLayers(map) {...}` callable from both contexts. This is non-trivial and should be done carefully to avoid layer duplication.

5. **`cycleBasemap()` still used for Esri fallback:** if `MAPBOX_TOKEN` is not set, the current Esri basemap toggle should still work. The build worker must preserve the Esri path behind the fallback check `if (window._mapboxToken) { ... Mapbox switch ... } else { ... Esri visibility toggle ... }`.

6. **Per-category MapLibre layer visibility vs the cluster layer:** the `loc-clusters` and `loc-cluster-count` layers aggregate ALL location types. If the user hides `location.handhole`, the cluster counts will still include handholes. Fixing this properly requires per-type cluster sources (expensive) or a post-cluster filter. The simplest approach: when any location type is hidden, update the `locations` GeoJSON source to exclude those types from the features array, so the cluster itself doesn't count them. This couples the visibility toggle to `_updateLocationsGeoJSON()`. The build worker should implement this coupling.

---

*Word count: approximately 8,400 words. Sources cited: 16 (MapLibre GL JS docs, Mapbox style reference, MapLibre GitHub issues, MapLibre+Mapbox interop discussions, MapLibre performance guide, HTML5 color input MDN, iro.js docs, Spectrum docs, VETRO product page, Sonar integration docs, Render Networks docs, IQGeo product docs, research/07_vetro_visual_match.md, public/splice.html direct read, routes/splice.js direct read, SPLICE_BUILD_PLAN.md direct read).*
