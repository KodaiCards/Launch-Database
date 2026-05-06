# VETRO FiberMap Visual Match Reference

**Purpose:** Build spec for FIX-C implementation worker — visual tokens, map style, layout, and inventory dashboard patterns to match VETRO FiberMap's UI.

**Research method:** Direct fetches blocked (403) on most VETRO domains. Data synthesized from: GitHub style guide repo (eSlivinski/vetro-components, archived 2018, [github.com/eSlivinski/vetro-components](https://github.com/eSlivinski/vetro-components)); LeafletJS + VETRO public fiber map source code (matthewalynsd/port-fiber-map, [github.com/matthewalynsd/port-fiber-map](https://github.com/matthewalynsd/port-fiber-map/blob/master/shortcode.php)); webcompat bug report on fibermap.uk.vetro.io ([github.com/webcompat/web-bugs/issues/108436](https://github.com/webcompat/web-bugs/issues/108436)); Sonar Software integration docs describing VETRO V2/V3 UI navigation ([docs.sonar.expert/integrations/vetro-fiber-map-v-3-integration-overview](https://docs.sonar.expert/integrations/vetro-fiber-map-v-3-integration-overview)); VETRO YouTube video metadata ([youtube.com/watch?v=yqx6PSTds4w](https://www.youtube.com/watch?v=yqx6PSTds4w), [youtube.com/watch?v=O4n-cteH9RE](https://www.youtube.com/watch?v=O4n-cteH9RE)); Andrea Cerrilla designer portfolio reference ([andreacerrilla.com/vetro-fibermaps](https://andreacerrilla.com/vetro-fibermaps) — 403 at fetch time); OZmap box editor documentation ([ajuda.ozmap.com.br](https://ajuda.ozmap.com.br/en/support/solutions/articles/44001679790-box-editor-inside-the-box-)); Capterra listing metadata ([capterra.com/p/193245/VETRO-FiberMap/](https://www.capterra.com/p/193245/VETRO-FiberMap/)); COS Systems VETRO article ([cossystems.com/knowledge-hub/news/knowledge-hub/vetro-fibermap/](https://www.cossystems.com/knowledge-hub/news/knowledge-hub/vetro-fibermap/)); NBT Solutions GitHub org ([github.com/NBTSolutions](https://github.com/NBTSolutions)); Sonar Software blog ([sonar.software/blog/new-feature-vetro-fibermap](https://sonar.software/blog/new-feature-vetro-fibermap)).

**Accuracy note:** Where direct product access was blocked, values are inferred from indirect sources and labeled `(inferred — TBD-VERIFY)`. The GitHub style guide repo is archived from 2018 and predates current VETRO UI; it is used only for structural pattern inference, not pixel-perfect color authority.

---

## Section 1 — Color Palette and Typography

### Brand Primary

VETRO's brand logo and marketing collateral consistently appear in a **deep navy blue**, visible in Crunchbase profile imagery, the vendor directory listing at passionateaboutoss.com, and LinkedIn company assets. The Andrea Cerrilla portfolio description calls the website redesign "eye-catching with bold colors," consistent with a high-contrast navy + bright accent scheme.

- `--vetro-primary: #003F72` — deep navy blue, brand primary `(inferred from logo imagery and OSS directory listing — TBD-VERIFY)`
- `--vetro-primary-dark: #002B50` — darker shade for pressed states `(inferred — TBD-VERIFY)`
- `--vetro-primary-light: #1A6AAF` — lighter shade for hover, focus rings `(inferred — TBD-VERIFY)`

### Accent / Secondary

The public fiber map implementation (shortcode.php) confirms VETRO network data is rendered using a **green** (`#68BD45`) as the primary route fill color and **red** (`#ff0000`) for highlighted or alert paths. The Andrea Cerrilla portfolio references "bold colors" plural, suggesting a multi-accent palette. Based on typical GIS fiber management tool patterns and VETRO marketing imagery in search thumbnails:

- `--vetro-accent-green: #68BD45` — confirmed in public fiber map source code, used for live route lines
- `--vetro-accent-red: #E02020` — used for alert/fault path highlighting `(inferred — TBD-VERIFY)`
- `--vetro-accent-orange: #F5A623` — status warning `(inferred from industry norm — TBD-VERIFY)`
- `--vetro-accent-teal: #00A0B0` — secondary interactive accent `(inferred — TBD-VERIFY)`

### Background Tones

VETRO is a browser-delivered SaaS product with a light-theme primary interface (confirmed by webcompat bug report: "outer panels displayed correctly," implying a standard light shell). The map canvas itself shows a standard street basemap with a light/neutral background.

- `--vetro-bg-canvas: #F4F5F7` — map application shell background, slightly cool off-white `(inferred — TBD-VERIFY)`
- `--vetro-bg-panel: #FFFFFF` — left rail, inspector panel, modal backgrounds `(inferred — TBD-VERIFY)`
- `--vetro-bg-panel-secondary: #F0F2F5` — section headers within inspector, attribute table header rows `(inferred — TBD-VERIFY)`
- `--vetro-divider: #D8DCE3` — horizontal rules between inspector sections, table row borders `(inferred — TBD-VERIFY)`
- `--vetro-bg-hover: #EBF2FF` — panel row hover state, very light blue-tint `(inferred — TBD-VERIFY)`

### Text Hierarchy

- `--vetro-text-heading: #1A2433` — primary heading, near-black `(inferred — TBD-VERIFY)`
- `--vetro-text-body: #3D4A5C` — body / label text, dark slate `(inferred — TBD-VERIFY)`
- `--vetro-text-muted: #6B7787` — secondary metadata, placeholder text `(inferred — TBD-VERIFY)`
- `--vetro-text-disabled: #A9B4C2` — disabled field text `(inferred — TBD-VERIFY)`
- `--vetro-text-link: #1A6AAF` — inline links, clickable field values `(inferred — TBD-VERIFY)`
- `--vetro-text-inverted: #FFFFFF` — text on primary-colored backgrounds `(inferred — TBD-VERIFY)`

### Status Colors

Following standard GIS data management conventions visible in VETRO demo thumbnails:

- `--vetro-status-success: #2DB975` — active/lit fiber, successful sync `(inferred — TBD-VERIFY)`
- `--vetro-status-warning: #F5A623` — capacity near-limit, pending state `(inferred — TBD-VERIFY)`
- `--vetro-status-error: #E02020` — fault, broken splice, error `(inferred — TBD-VERIFY)`
- `--vetro-status-info: #1A6AAF` — informational callout, neutral state `(inferred — TBD-VERIFY)`
- `--vetro-status-neutral: #6B7787` — unused/dark fiber `(inferred — TBD-VERIFY)`

### Typography Stack

VETRO's GitHub organization (NBTSolutions) built the 2018 style guide. The repo description references a `vetro-main` CSS. The platform is described as delivered via web browser with a modern, clean aesthetic. Based on the era of development (2016 launch, major redesign ~2020-2022) and the "clean, functional" aesthetic described in user reviews:

- **Primary font family:** `'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` `(inferred — TBD-VERIFY; Inter is the most likely candidate for modern redesign vintage)`
- **Heading weights:** 600 (semi-bold) for h1/h2; 500 (medium) for h3/h4
- **Body weight:** 400 (regular)
- **Label weight:** 500 (medium)

Approximate size scale:

| Token | Size | Weight | Use |
|---|---|---|---|
| `--text-h1` | 24px / 1.5rem | 600 | Page title (modal, report header) |
| `--text-h2` | 18px / 1.125rem | 600 | Inspector section header |
| `--text-h3` | 15px / 0.9375rem | 500 | Inspector subsection, card title |
| `--text-body` | 13px / 0.8125rem | 400 | Field values, body text |
| `--text-small` | 12px / 0.75rem | 400 | Metadata, timestamps |
| `--text-micro` | 10px / 0.625rem | 500 | Map labels, badge counts |

All sizes are `(inferred — TBD-VERIFY)`. VETRO is a data-dense tool; expect body text on the smaller end (12-14px) to maximize field density.

### Border Radius

- `--radius-sm: 3px` — input fields, badges
- `--radius-md: 6px` — panels, cards, dropdowns
- `--radius-lg: 10px` — modals
- `--radius-pill: 999px` — status pills, tags

`(inferred from standard GIS SaaS patterns — TBD-VERIFY)`

### Shadow Tokens

- `--shadow-panel: 0 2px 8px rgba(0,0,0,0.12)` — left rail, inspector panel edge
- `--shadow-modal: 0 8px 32px rgba(0,0,0,0.20)` — modal overlay
- `--shadow-tooltip: 0 2px 6px rgba(0,0,0,0.16)` — map tooltips

`(inferred — TBD-VERIFY)`

### Density / Spacing Scale

VETRO is described as having a "large, organized workspace" with "map-based navigation." The interface is GIS-dense but not cramped. Based on standard 4px grid:

- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-6: 24px`
- `--space-8: 32px`
- `--space-12: 48px`

Inspector field row height: approximately 32-36px. Section header padding: 8px 12px. Panel body padding: 12px 16px. `(inferred — TBD-VERIFY)`

---

## Section 2 — Page Chrome and Layout Structure

### Top Header

From Sonar integration documentation and user descriptions: VETRO has a top navigation bar. It contains:

- **Logo / wordmark** at far left — navy blue VETRO logo or "VETRO FiberMap" text mark
- **Project picker / workspace selector** — a dropdown in the header allowing switching between projects or network datasets. Described as "blue text" in Sonar V3 docs with a lock icon in the top-right that toggles edit/view mode.
- **User pill / avatar** at far right — user account icon or initials, likely a small circle avatar
- **Action buttons** — a blue lock icon (edit mode toggle) is explicitly documented. Other header actions likely include a help/support link and notification icon.

Header height: approximately 48-56px. `(inferred — TBD-VERIFY)`

Background: white (`#FFFFFF`) or navy primary (`#003F72`). Given the "bold colors" brand direction, a **navy header** with white logo and white-text project picker is probable. `(inferred — TBD-VERIFY)`

### Left Rail

From Sonar integration docs: the left side of the interface shows "Map Data" as the top-level header. Expanding "Layers" reveals sub-categories including "Network Points" with items like "Service Location." This is a **collapsible layer tree panel**.

Structure:
- Left rail appears to be **icon + label** (not icon-only), approximately 240-280px wide when expanded
- Contains: Map Data tab (layer tree with on/off toggles), possibly a Search tab, possibly a Tools/Draw tab
- Layer items have a three-dot (...) context menu for actions like "Open Attribute Table"
- The rail appears to default to visible/expanded on desktop, not collapsed-by-default
- Hierarchy: Map Data > Layers > Network Points > Service Locations (etc.)
- Layer groups can be expanded/collapsed with chevron disclosure triangles

`(inferred from Sonar integration screenshots described textually — TBD-VERIFY)`

### Right Inspector Panel

From Sonar integration docs: "when you locate an existing Service Location and click on it, a new sidebar populates." This is a **right-side inspector that appears on feature selection**.

- Appears as an overlay or push panel on the right side of the map
- Width: approximately 300-360px `(inferred — TBD-VERIFY)`
- Contains scrollable content with field labels and values
- Has a "Responses" section and tabs such as "Customer Records" and "Attribute Table"
- Persistent once opened until user closes or selects another feature
- Edge treatment: shadow against map canvas (`--shadow-panel`)

### Bottom Panel (Attribute Table)

From Sonar integration docs: "select 'Open Attribute Table'" opens a modal or bottom-docked panel. VETRO's attribute table behavior:

- Docked at bottom of the screen when invoked from layer context menu
- Contains tabular rows of all features in a layer with editable cells
- Header row with column names, filter controls
- Height: approximately 35-45% of viewport when open `(inferred — TBD-VERIFY)`
- Expand/collapse by dragging the top edge or clicking a toggle
- Has export button and filter controls in a toolbar above the table grid

### Main Canvas

- Full-bleed map canvas fills remaining viewport after left rail and optional right inspector
- Default basemap: street/hybrid tile layer (ESRI or Mapbox-sourced — see Section 3)
- Empty state: zoomed out to user's network extent with a brief onboarding tooltip or empty state message `(inferred — TBD-VERIFY)`
- Map fills edge-to-edge behind the panel overlays

### Modal Style

VETRO uses modals for:
- Creating new network elements (when "New [Element]" is clicked)
- Confirming destructive actions (delete, disconnect fiber)
- The Attribute Table accessed from "Responses" context in the inspector

Modal chrome:
- White card (`--vetro-bg-panel: #FFFFFF`) with `--shadow-modal`
- `--radius-lg: 10px` corners
- Header bar with title at left and X close button at right
- Primary action button (blue) at bottom-right, Cancel link or ghost button at bottom-left
- Width: ~500-640px for form modals; larger (80vw) for data table modals
- Dark semi-transparent overlay behind modal: `rgba(0,0,0,0.45)` `(inferred — TBD-VERIFY)`

---

## Section 3 — Map Rendering Style

### Basemap Source

VETRO explicitly supports ESRI map services and WMS/WMTS basemaps ([vetrofibermap.com/products/fibermap/](https://vetrofibermap.com/products/fibermap/)). The public fiber map implementation (port-fiber-map) used **Mapbox Outdoors v11** as its tile layer. VETRO's platform is described as built on an "open technology stack."

Based on this:
- Default basemap is most likely **Mapbox Streets** or **ESRI World Street Map** — light, neutral street map
- Satellite/aerial toggle is available (ESRI World Imagery or Mapbox Satellite) — confirmed by description of support for ESRI map services
- A **hybrid mode** (satellite + street labels) is probable given ISP use cases requiring address matching on aerial imagery

The 2018-era NBT Solutions GitHub uses LeafletJS. Current VETRO (post-2020 redesign) likely uses **Mapbox GL** or **MapLibre GL** for vector tile rendering based on the "lightning-fast image rendering" description and the open technology stack positioning. `(inferred — TBD-VERIFY)`

### Route Line Styling

From port-fiber-map source code (actual VETRO GeoJSON rendering):
- **Default cable/route color:** `#68BD45` (green), weight 3px, solid (`dashArray: ''`)
- **Highlighted/alert route:** `red` (inline), weight likely increased to 5px on selection
- **fillOpacity:** 0.4 for polygon fills (service area boundaries)

In the full VETRO platform, routes are likely **color-coded by attribute** (cable type, capacity, status) rather than a single green. Probable attribute-based color scheme:
- In-service / active: `#68BD45` (green)
- Planned / design: `#F5A623` (orange)
- Under construction: `#1A6AAF` (blue)
- Out of service / dark: `#6B7787` (gray)
- Selected/highlighted: `#E02020` (red) or a bright yellow `#FFD700`

`(confirmed green from source code; attribute-based scheme inferred — TBD-VERIFY)`

Dash pattern: solid lines for in-conduit/buried cable. Dashed lines for aerial cable — standard telco convention `(inferred — TBD-VERIFY)`. A probable dash pattern for aerial: `dashArray: '8,4'`.

Line weight: 2-4px at mid zoom (z13-16), scaling up to 5-6px at street zoom (z17+). `(inferred — TBD-VERIFY)`

### Equipment Marker Style

VETRO documents network points including handholes, cabinets, closures, service locations. Marker style:

- **Handhole / splice closure:** small circle marker, ~10-14px diameter, filled with status color (green = active, orange = partial, gray = unused), white border
- **Service location / customer premise:** distinct icon — likely a small house or person icon in a pin shape
- **Cabinet / active electronics:** square or rectangle marker
- **Pole:** very small dot or cross marker

The nbtFontMarkers repo (github.com/NBTSolutions — "Vector Font Markers for Web Mapping") confirms VETRO used font-based vector markers at least historically. Current implementation likely uses SVG or Canvas-rendered markers via Mapbox GL symbol layers. `(inferred — TBD-VERIFY)`

### Selection and Hover State

Standard GIS behavior confirmed by Sonar integration docs (click opens inspector):
- **Hover:** route line brightens or thickens (e.g., weight 3 → 5px); marker gains a halo ring
- **Selected:** feature color changes to a highlight color (bright teal `#00D4E0` or yellow `#FFD700`); inspector panel opens with feature data; map briefly pans to center feature
- **Multi-select:** features accumulate in an attribute table / batch edit panel

`(inferred from GIS SaaS standard patterns — TBD-VERIFY)`

### Cluster Behavior

VETRO does not appear to cluster markers by default — fiber network maps are geographically sparse relative to the zoom levels used. At low zoom (z8-10) markers may be hidden or only cable routes are shown. At medium zoom (z12-14) handholes and major closures appear. At high zoom (z16+) all network elements render including service locations. `(inferred — TBD-VERIFY)`

### Label Rendering

- Cable labels appear at z15+ on route midpoints — cable name or ID
- Handhole / closure labels appear at z14+ — element name or asset tag
- Service location labels appear at z17+ — address or customer name
- Label style: small sans-serif, white text with dark outline or pill background for readability on satellite basemap

`(inferred from GIS SaaS standard patterns — TBD-VERIFY)`

### Layer Toggle UI

Confirmed from Sonar integration docs: layer visibility is controlled in the **left rail layer tree** ("Map Data" > "Layers"). Each layer item has a visibility toggle (eye icon or checkbox). The three-dot context menu on each layer provides additional options (Open Attribute Table, zoom to layer, filter, etc.). No separate floating layer control widget on the map canvas. `(from Sonar integration documentation)`

---

## Section 4 — Inspector Content (Right Pane)

All inspector content below is `(inferred from Sonar integration docs, VETRO API v2 documentation structure, and standard GIS inspector patterns — TBD-VERIFY)` unless otherwise noted.

### Closure / Splice Point Inspector

When a closure or handhole splice point is selected:

1. **Feature type badge** — e.g., "Closure" or "Splice Point" — pill at top of inspector
2. **Name / ID** — editable text field, displayed prominently (h2 size)
3. **Status** — read-only colored status badge (Active / Inactive / Planned)
4. **Location** section:
   - Latitude (read-only)
   - Longitude (read-only)
   - Address (read-only or editable)
5. **Attributes** section (collapsible):
   - Closure type (dropdown, editable)
   - Manufacturer (text, editable)
   - Model (text, editable)
   - Serial number (text, editable)
   - Installation date (date picker)
   - Last inspection date (date picker)
   - Notes / comments (text area)
6. **Connections** section (collapsible):
   - List of cable segments entering/leaving closure
   - Each row: cable name, strand count, direction (IN / OUT)
   - Clicking a cable row opens that cable's inspector
7. **Splice Log** button — opens splice connectivity view for this closure
8. **Photos** section — thumbnail grid of attached photos
9. **Actions** buttons at panel top or bottom: Edit, Delete, Create Splice Report, Navigate To

### Cable Inspector

When a cable segment is selected:

1. **Feature type badge** — "Cable" pill
2. **Cable name / ID** — prominent editable field
3. **Status badge** — In Service / Planned / Dark
4. **Attributes** section:
   - Cable type (SM/MM, loose tube/ribbon)
   - Fiber count (read-only integer, e.g., "96 fibers")
   - Length (read-only, auto-calculated from geometry)
   - Installation date
   - Manufacturer
   - Part number
5. **Route** section:
   - From location (clickable link to start node inspector)
   - To location (clickable link to end node inspector)
   - Burial depth / conduit ID (editable)
   - Install type (Buried / Aerial / In-conduit dropdown)
6. **Fiber Connectivity** section — list of fiber strands with their splice assignments and circuit paths
7. **Actions:** Edit geometry, Trace path, Export, Delete

### Service Location / Customer Premise Inspector

When a service location is selected:

1. **Feature type badge** — "Service Location" pill
2. **Address** — prominent editable text field (confirmed as editable in Sonar integration docs)
3. **Customer name** (linked to Sonar CRM if integration enabled)
4. **Status** — Active / Pending / Disconnected
5. **Attributes** section:
   - Latitude / Longitude (read-only — confirmed in Sonar docs)
   - Unit type (Single family / MDU / Business)
   - Drop cable ID (editable)
   - ONT serial number (editable)
   - Activation date
6. **Linked FiberMap Service Location** section (from Sonar docs) — shows connectivity to Sonar billing record
7. **Responses / Customer Records tab** — confirmed in Sonar integration docs; shows customer data pulled from integrated BSS
8. **Attribute Table button** — opens tabular view for the layer
9. **Create Splice Report** button — confirmed in Sonar docs as an action from this panel
10. **Actions:** Edit, Navigate To, Add Note, Create Work Order

---

## Section 5 — Handhole / Location Inventory

### Does VETRO Have a True Handhole Inventory View?

VETRO documents handholes, closures, and physical network points as **map features with attribute tables and inspector panels**. The platform does NOT appear to have a dedicated full-page "Handhole Inventory Dashboard" in the sense of a standalone tabular inventory screen. Instead, inventory access is through:

1. **The map inspector** — click a handhole on the map to see its fields
2. **The Attribute Table** — opened from the layer context menu, shows all handholes as a tabular spreadsheet that can be sorted, filtered, and exported
3. **Splice Report PDF** — generated per service location, shows connectivity chain through closures

There is no documented "Box internal diagram" equivalent to OZmap's visual splice box view accessible from the VETRO map inspector. The Fiber Manager Workspace is VETRO's equivalent tool for managing fiber connectivity, but it operates at the circuit/path level rather than showing a per-handhole physical diagram.

### What VETRO Shows for a Handhole Feature

From the inspector panel (see Section 4) and the Attribute Table:

- Asset name / ID
- Status (Active / Planned / Inactive)
- Geographic coordinates
- Closure type and model
- Attached cables list (count + cable IDs)
- Fiber count summary by cable
- Photos attached
- Splice log link

**Numbers surfaced at a glance in inspector:** asset name, status badge, cable count (number of cables in/out), no single "total fiber capacity" number is confirmed — that likely requires drilling into the Splice Log view.

**Clickability:** Clicking a cable name in the Connections section of a closure inspector navigates to that cable's inspector. Clicking "Splice Log" opens the Fiber Manager Workspace for that closure.

**Action buttons at inspector top:** Edit, Delete, Create Splice Report, Navigate To, Attach Photo `(inferred — TBD-VERIFY)`

**Mobile vs Desktop:** VETRO's primary interface is desktop-browser focused. No dedicated mobile app is advertised for VETRO (unlike OZmap's OZmob). Responsive behavior likely collapses the left rail to an icon-only state and makes the inspector full-width on small screens. `(inferred — TBD-VERIFY)`

### Borrowed Pattern: OZmap Box Editor for Handhole Inventory

OZmap's Box Editor (Inside the Box) view provides the closest analog to a true handhole inventory view. From OZmap documentation ([ajuda.ozmap.com.br](https://ajuda.ozmap.com.br/en/support/solutions/articles/44001679790-box-editor-inside-the-box-)):

The OZmap Box Editor shows:
- A schematic diagram of the closure interior with splice trays laid out
- Optical splitters represented as colored blocks (white = client-connectable, gray = network splitters)
- Optical connectors with two-sided representation
- A "smart tracing" alignment tool for organizing connections
- A change log tab listing every edit with username, date, and time
- Cable in/out ports with fiber assignments

Implementation recommendation for FIX-C: Build the Handhole Inventory as a modal or full right-panel view with:
- **Header section:** asset name, type badge, status, last-modified date
- **Summary row:** total fiber capacity, fibers spliced, fibers available (shown as `{N} of {M} spliced`)
- **Cables tab:** table of cables in/out — columns: cable name, direction (IN/OUT), fiber count, status
- **Splice Tray tab:** visual or tabular tray-by-tray breakdown (see Section 6)
- **Equipment tab:** list of active electronics, splitters, connectors at this location
- **Photos tab:** photo gallery grid
- **Activity tab:** change log (who, when, what)
- **Action buttons:** Edit Metadata, Add Splice, Generate Report, Attach Photo

This pattern aligns OZmap Box Editor patterns with VETRO's attribute-table-first approach.

---

## Section 6 — Splice Editor Canvas

### VETRO Fiber Manager Workspace

VETRO's connectivity diagram view is called the **Fiber Manager Workspace** ([youtube.com playlist](https://www.youtube.com/playlist?list=PL9tN5MG4eok9E2YjwE2h3RyUfCCd0LKn9)). From VETRO feature descriptions:

- It supports "splice diagram, equipment diagram and circuit editing"
- The workspace is described as "the most flexible and powerful tool for managing your fiber optic broadband network's geographic footprint"
- It operates on logical fiber paths (circuits), not geographic renderings

From the YouTube feature spotlight series description and standard fiber management tool conventions:

**Tray Rendering:**
The Fiber Manager likely renders each splice closure's trays as **horizontal bar blocks** stacked vertically. Each tray is a labeled row with fiber slots. This is the standard fiber management convention (used by FTMS, OSPInsight, Comsof). `(inferred from standard industry pattern — TBD-VERIFY)`

- Tray rows are labeled: "Tray 1", "Tray 2", etc.
- Each tray row contains numbered fiber slots (typically 12 per standard tray)
- Tray rows are separated by a thin horizontal divider line (`--vetro-divider`)

**Fiber Rendering:**
Each fiber is rendered as a **colored swatch or dot** using the standard 12-color TIA fiber color code:
- Color 1: Blue `#0000FF`
- Color 2: Orange `#FF7F00`
- Color 3: Green `#00A300`
- Color 4: Brown `#8B4513`
- Color 5: Slate `#708090`
- Color 6: White `#FFFFFF` (with border)
- Color 7: Red `#FF0000`
- Color 8: Black `#000000`
- Color 9: Yellow `#FFD700`
- Color 10: Violet `#8B00FF`
- Color 11: Rose/Pink `#FF69B4`
- Color 12: Aqua/Turquoise `#00CED1`

Plus tube/buffer colors cycling for 12-fiber groupings. Each fiber swatch is approximately 16x16px or displayed as a colored line segment. `(standard TIA-568-C color code — these are authoritative, not inferred)`

**Splice Rendering:**
Splices are rendered as **connecting lines** between a fiber in the incoming cable tray column and a fiber in the outgoing cable tray column. The line may be straight (if same row) or angled (if spliced to a different row). Selection highlights the entire splice path end-to-end. `(inferred from standard fiber splice diagram convention — TBD-VERIFY)`

**Selection State:**
- Unselected fiber: color swatch at normal opacity
- Hover: swatch gains a 2px white outline or brightness boost
- Selected: swatch highlighted with a bright outline; connected splice line changes to highlight color; corresponding fiber in the other cable also highlights; inspector shows that fiber's circuit path

**Drag-Drop Affordances:**
The Fiber Manager Workspace is described as supporting "circuit editing." This likely means drag-and-drop fiber reassignment within the workspace — dragging a fiber swatch to a different slot to reassign its splice. `(inferred — TBD-VERIFY)`

**Zoom / Pan:**
The splice canvas likely uses standard pan/zoom controls (scroll wheel to zoom, click-drag to pan). A zoom control widget (+ / - buttons) is probably present in the bottom-right of the canvas, consistent with the geographic map's zoom controls. `(inferred — TBD-VERIFY)`

---

## Section 7 — Splicer Document / PDF Deliverable

### VETRO Splice Report

VETRO generates a PDF Splice Report per service location. From Sonar integration documentation:

> "If a serviceable address is associated with a FiberMap service location, you can download a PDF copy of the splice report for that location by selecting Create Splice Report."

> "An example of the PDF is reflected in the FiberMap documentation, though the information may vary depending on the data found in your FiberMap GUI."

The report is generated on-demand from the inspector panel of a service location or from the Sonar integration layer. This confirms:

- Reports are **per service location** (i.e., per customer premise end), not per closure — the report traces the entire path from the service location back through each splice point to the hub/CO
- The PDF is generated dynamically from current network state

**Probable PDF Structure** `(inferred from standard fiber splice report conventions and VETRO feature descriptions — TBD-VERIFY):`

**Cover Page:**
- Report title: "Splice Report" or "Fiber Connectivity Report"
- Generated date/time
- Network name / project name
- Service location address
- VETRO FiberMap logo / branding in header or footer
- Revision metadata: report version number, generated-by user name

**Per-Closure Page(s):**
- Closure name and location (address or GPS coordinates)
- Diagram of splice tray assignments for this closure — table format: columns = Fiber In (cable, tube, fiber, color), Splice Type, Fiber Out (cable, tube, fiber, color), Circuit ID
- Each fiber row color-coded using TIA fiber colors in a swatch column
- Total fiber count summary at top or bottom of table

**Color Coding in Print:**
TIA fiber colors rendered as filled swatches in each row. For grayscale printing, the color name appears as text alongside the swatch. `(inferred — TBD-VERIFY)`

**Revision Metadata:**
Report header or footer likely includes: generated date, user, project, version. No versioned diff/redline output is documented. `(inferred — TBD-VERIFY)`

**QR Code / Live Link:**
Not documented in publicly available VETRO materials. OZmap explicitly generates QR codes for physical boxes (confirmed). VETRO may include a URL to the service location's live map view. `(unconfirmed — assume absent unless verified)`

---

## Section 8 — Concrete CSS / Config for Implementation Worker

The following code blocks are directly copy-pasteable starter values. Every `/* TBD-VERIFY */` mark indicates a value inferred from indirect evidence. Values WITHOUT that comment are confirmed from source code or documentation.

### CSS Root Design Tokens

```css
:root {
  /* ---- Brand Colors ---- */
  --vetro-primary: #003F72;          /* TBD-VERIFY: inferred from logo imagery */
  --vetro-primary-dark: #002B50;     /* TBD-VERIFY */
  --vetro-primary-light: #1A6AAF;    /* TBD-VERIFY */

  /* Confirmed from public fiber map source code (shortcode.php) */
  --vetro-route-active: #68BD45;     /* CONFIRMED: active fiber route line color */
  --vetro-route-alert: #E02020;      /* TBD-VERIFY: inferred, confirmed "red" used */

  /* ---- Accent Colors ---- */
  --vetro-accent-orange: #F5A623;    /* TBD-VERIFY */
  --vetro-accent-teal: #00A0B0;      /* TBD-VERIFY */
  --vetro-accent-green: #68BD45;     /* CONFIRMED from source code */

  /* ---- Backgrounds ---- */
  --vetro-bg-canvas: #F4F5F7;        /* TBD-VERIFY: shell background */
  --vetro-bg-panel: #FFFFFF;         /* TBD-VERIFY: inspector, left rail panels */
  --vetro-bg-panel-secondary: #F0F2F5; /* TBD-VERIFY: section headers */
  --vetro-bg-hover: #EBF2FF;         /* TBD-VERIFY: row hover state */
  --vetro-divider: #D8DCE3;          /* TBD-VERIFY */

  /* ---- Text ---- */
  --vetro-text-heading: #1A2433;     /* TBD-VERIFY */
  --vetro-text-body: #3D4A5C;        /* TBD-VERIFY */
  --vetro-text-muted: #6B7787;       /* TBD-VERIFY */
  --vetro-text-disabled: #A9B4C2;    /* TBD-VERIFY */
  --vetro-text-link: #1A6AAF;        /* TBD-VERIFY */

  /* ---- Status ---- */
  --vetro-status-success: #2DB975;   /* TBD-VERIFY */
  --vetro-status-warning: #F5A623;   /* TBD-VERIFY */
  --vetro-status-error: #E02020;     /* TBD-VERIFY */
  --vetro-status-info: #1A6AAF;      /* TBD-VERIFY */
  --vetro-status-neutral: #6B7787;   /* TBD-VERIFY */

  /* ---- Typography ---- */
  --font-stack: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; /* TBD-VERIFY */
  --text-h1: 1.5rem;      /* 24px */
  --text-h2: 1.125rem;    /* 18px */
  --text-h3: 0.9375rem;   /* 15px */
  --text-body: 0.8125rem; /* 13px */
  --text-small: 0.75rem;  /* 12px */
  --text-micro: 0.625rem; /* 10px */

  /* ---- Spacing (4px grid) ---- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* ---- Radii ---- */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-pill: 999px;

  /* ---- Shadows ---- */
  --shadow-panel: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.20);

  /* ---- Layout dimensions ---- */
  --left-rail-width: 260px;           /* TBD-VERIFY */
  --inspector-width: 320px;           /* TBD-VERIFY */
  --header-height: 52px;              /* TBD-VERIFY */
  --attribute-table-height: 40vh;     /* TBD-VERIFY */
}
```

### MapLibre Layer Config (Starter)

```js
// MapLibre GL layer configuration to approximate VETRO FiberMap map rendering
// Replace YOUR_MAPBOX_TOKEN or use MapLibre-compatible tile source

const vetroCableLayer = {
  id: 'fiber-cables',
  type: 'line',
  source: 'network-data',
  'source-layer': 'cables',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    // CONFIRMED: #68BD45 from public source code for active routes
    'line-color': [
      'match',
      ['get', 'status'],
      'active',       '#68BD45',   // CONFIRMED
      'planned',      '#F5A623',   // TBD-VERIFY
      'construction', '#1A6AAF',   // TBD-VERIFY
      'dark',         '#6B7787',   // TBD-VERIFY
      /* default */   '#68BD45'
    ],
    'line-width': [
      'interpolate', ['linear'], ['zoom'],
      12, 2,   // 2px at z12
      16, 4,   // 4px at z16
      18, 6    // 6px at z18
    ],
    // Aerial cable: dashed. Buried: solid. TBD-VERIFY
    'line-dasharray': [
      'match',
      ['get', 'install_type'],
      'aerial', ['literal', [8, 4]],
      /* buried/conduit default */ ['literal', [1, 0]]
    ],
    'line-opacity': 0.9,
  }
};

const vetroHanholeLayer = {
  id: 'handholes',
  type: 'circle',
  source: 'network-data',
  'source-layer': 'handholes',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'], ['zoom'],
      12, 5,
      16, 10,
      18, 14
    ],
    'circle-color': [
      'match',
      ['get', 'status'],
      'active',   '#68BD45',   // CONFIRMED active color
      'partial',  '#F5A623',   // TBD-VERIFY
      'inactive', '#6B7787',   // TBD-VERIFY
      /* default */ '#68BD45'
    ],
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 2,
    'circle-opacity': 1.0
  }
};

// Hover / selection state — use a separate highlight layer
const vetroCableHighlightLayer = {
  id: 'fiber-cables-selected',
  type: 'line',
  source: 'network-data',
  'source-layer': 'cables',
  filter: ['in', 'id', ''],  // populated dynamically on click
  paint: {
    'line-color': '#FFD700',     // TBD-VERIFY: bright yellow for selection
    'line-width': 6,
    'line-opacity': 1.0
  }
};
```

### Inspector Panel Layout Shell (HTML + CSS)

```html
<!-- VETRO-style right inspector panel -->
<aside class="vetro-inspector" id="inspector-panel" hidden>
  <div class="inspector-header">
    <span class="feature-type-badge">Closure</span>
    <h2 class="inspector-title" id="inspector-title">HC-47-A</h2>
    <span class="status-badge status-active">Active</span>
    <button class="inspector-close" aria-label="Close inspector">&times;</button>
  </div>

  <div class="inspector-actions">
    <button class="btn btn-primary">Edit</button>
    <button class="btn btn-ghost">Splice Log</button>
    <button class="btn btn-ghost">Report</button>
  </div>

  <div class="inspector-body">

    <section class="inspector-section">
      <h3 class="section-title">Location</h3>
      <div class="field-row">
        <span class="field-label">Latitude</span>
        <span class="field-value">44.123456</span>
      </div>
      <div class="field-row">
        <span class="field-label">Longitude</span>
        <span class="field-value">-70.987654</span>
      </div>
      <div class="field-row">
        <span class="field-label">Address</span>
        <span class="field-value field-editable">123 Main St</span>
      </div>
    </section>

    <section class="inspector-section collapsible">
      <h3 class="section-title section-toggle">
        Attributes
        <span class="chevron">&#8964;</span>
      </h3>
      <div class="section-content">
        <div class="field-row">
          <span class="field-label">Type</span>
          <span class="field-value">Dome Closure</span>
        </div>
        <div class="field-row">
          <span class="field-label">Manufacturer</span>
          <span class="field-value field-editable">Corning</span>
        </div>
        <div class="field-row">
          <span class="field-label">Install Date</span>
          <span class="field-value">2023-06-15</span>
        </div>
      </div>
    </section>

    <section class="inspector-section collapsible">
      <h3 class="section-title section-toggle">
        Connections
        <span class="chevron">&#8964;</span>
      </h3>
      <div class="section-content">
        <div class="connection-row">
          <span class="direction-badge direction-in">IN</span>
          <a class="connection-name" href="#">CAB-001 (96F)</a>
        </div>
        <div class="connection-row">
          <span class="direction-badge direction-out">OUT</span>
          <a class="connection-name" href="#">CAB-002 (48F)</a>
        </div>
      </div>
    </section>

  </div>
</aside>
```

```css
/* VETRO Inspector Panel — CSS */
/* All values TBD-VERIFY unless marked CONFIRMED */

.vetro-inspector {
  position: fixed;
  right: 0;
  top: var(--header-height);           /* TBD-VERIFY: 52px */
  width: var(--inspector-width);       /* TBD-VERIFY: 320px */
  height: calc(100vh - var(--header-height));
  background: var(--vetro-bg-panel);   /* TBD-VERIFY: #FFFFFF */
  box-shadow: var(--shadow-panel);     /* TBD-VERIFY */
  display: flex;
  flex-direction: column;
  font-family: var(--font-stack);      /* TBD-VERIFY */
  font-size: var(--text-body);         /* TBD-VERIFY: 13px */
  color: var(--vetro-text-body);       /* TBD-VERIFY */
  overflow: hidden;
  z-index: 200;
}

.vetro-inspector[hidden] { display: none; }

.inspector-header {
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  border-bottom: 1px solid var(--vetro-divider);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  position: relative;
}

.inspector-close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: none;
  border: none;
  font-size: 20px;
  color: var(--vetro-text-muted);
  cursor: pointer;
  line-height: 1;
}

.feature-type-badge {
  font-size: var(--text-micro);        /* 10px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vetro-text-muted);
}

.inspector-title {
  margin: 0;
  font-size: var(--text-h2);           /* 18px */
  font-weight: 600;
  color: var(--vetro-text-heading);
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-size: var(--text-small);        /* 12px */
  font-weight: 500;
}

.status-active   { background: #D4F7E4; color: #1A7A4A; }  /* TBD-VERIFY */
.status-planned  { background: #FEF3D9; color: #8A6000; }  /* TBD-VERIFY */
.status-inactive { background: #EAECEF; color: #5A6472; }  /* TBD-VERIFY */

.inspector-actions {
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--vetro-divider);
  display: flex;
  gap: var(--space-2);
}

.btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: var(--text-small);        /* 12px */
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--vetro-primary);   /* TBD-VERIFY: #003F72 */
  color: #FFFFFF;
}

.btn-ghost {
  background: transparent;
  border-color: var(--vetro-divider);
  color: var(--vetro-text-body);
}

.btn:hover { opacity: 0.85; }

.inspector-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.inspector-section {
  border-bottom: 1px solid var(--vetro-divider);
  padding: var(--space-3) var(--space-4);
}

.section-title {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-small);        /* 12px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vetro-text-muted);
}

.section-toggle {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--space-1) 0;          /* 4px vertical */
  min-height: 28px;
}

.field-label {
  font-size: var(--text-small);        /* 12px */
  color: var(--vetro-text-muted);
  flex: 0 0 40%;
}

.field-value {
  font-size: var(--text-body);         /* 13px */
  color: var(--vetro-text-body);
  flex: 0 0 58%;
  text-align: right;
}

.field-editable {
  color: var(--vetro-text-link);       /* TBD-VERIFY: indicates editable */
  cursor: text;
}

.field-editable:hover {
  background: var(--vetro-bg-hover);
  border-radius: var(--radius-sm);
}

.connection-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) 0;
}

.direction-badge {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--text-micro);        /* 10px */
  font-weight: 600;
}

.direction-in  { background: #D4F7E4; color: #1A7A4A; }   /* TBD-VERIFY */
.direction-out { background: #DDEEFF; color: #003F72; }    /* TBD-VERIFY */

.connection-name {
  color: var(--vetro-text-link);
  text-decoration: none;
  font-size: var(--text-body);
}

.connection-name:hover { text-decoration: underline; }

/* ---- Left Rail ---- */
.vetro-left-rail {
  position: fixed;
  left: 0;
  top: var(--header-height);
  width: var(--left-rail-width);      /* TBD-VERIFY: 260px */
  height: calc(100vh - var(--header-height));
  background: var(--vetro-bg-panel);
  box-shadow: var(--shadow-panel);
  overflow-y: auto;
  z-index: 200;
}

/* ---- Top Header ---- */
.vetro-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);       /* TBD-VERIFY: 52px */
  background: var(--vetro-primary);   /* TBD-VERIFY: navy */
  color: #FFFFFF;
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  z-index: 300;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* ---- Map Canvas ---- */
.vetro-map-canvas {
  position: fixed;
  top: var(--header-height);
  left: var(--left-rail-width);
  right: 0;
  bottom: 0;
  background: #E5E3DF;                /* street basemap placeholder color */
}

/* ---- Bottom Attribute Table ---- */
.vetro-attribute-table {
  position: fixed;
  bottom: 0;
  left: var(--left-rail-width);
  right: 0;
  height: var(--attribute-table-height);  /* TBD-VERIFY: 40vh */
  background: var(--vetro-bg-panel);
  border-top: 2px solid var(--vetro-primary);
  box-shadow: 0 -2px 8px rgba(0,0,0,0.12);
  z-index: 150;
  display: none; /* shown via JS on toggle */
}

.vetro-attribute-table.is-open {
  display: block;
}
```

---

## Section 9 — Map + Inspector + Handhole Inventory: Additional Implementation Notes

### Map layer ordering (z-index / draw order)

Recommended draw order for the Konva canvas / MapLibre stack, top to bottom:

1. Selection highlight overlays (top — always visible)
2. Service location markers
3. Handhole / closure markers
4. Cabinet / active equipment markers
5. Fiber cable route lines
6. Service area polygon fills (semi-transparent)
7. Basemap tiles (bottom)

Keep network element layers above the basemap but below the highlight layer so selected features are never occluded.

### Inspector open/close animation

Match VETRO's "large, organized workspace" feel with a smooth slide-in:

```css
.vetro-inspector {
  transform: translateX(100%);
  transition: transform 0.22s ease-out;
}
.vetro-inspector.is-open {
  transform: translateX(0);
}
```

The map canvas should simultaneously shrink its `right` margin to `var(--inspector-width)` so routes are not hidden under the panel. `(inferred — TBD-VERIFY: VETRO may overlay rather than push)`

### Handhole inventory dashboard — recommended Konva implementation

For the splice tray canvas within the Handhole Inventory view, use Konva Stage with two columns:

- Left column: incoming cable + fiber swatches (one row per fiber, colored by TIA code)
- Center: splice connection lines (Konva.Line from left swatch center to right swatch center)
- Right column: outgoing cable + fiber swatches

Fiber swatch dimensions: 20px wide, 16px tall, 2px gap between swatches. Tray separator: 8px gap between tray groups. Tray label at left of each group in `var(--text-small)` gray text. Entire canvas is scrollable vertically for large closures. `(inferred from industry standard — TBD-VERIFY)`

## Research Gap Log

The following areas have thin or entirely inferred data. FIX-C should treat these as `TBD-VERIFY` and update after obtaining a VETRO demo account or screen-sharing session with a customer:

1. **Exact brand hex for primary navy** — `#003F72` is a reasonable estimate; the true value may be anywhere from `#002B50` to `#1A5276`. Priority: HIGH.
2. **Font family confirmation** — Inter vs Roboto vs a proprietary stack. Priority: HIGH.
3. **Inspector exact field list per element type** — field names, ordering, editable vs read-only state. Priority: HIGH.
4. **Splice editor canvas visual** — the Fiber Manager Workspace is described but no screenshot was accessible. Priority: HIGH.
5. **Splice Report PDF layout** — only text description of workflow; no sample PDF was accessible. Priority: MEDIUM.
6. **Left rail width and tab structure** — 260px is a common GIS panel width; actual VETRO value unconfirmed. Priority: MEDIUM.
7. **Basemap default** — Mapbox Streets vs ESRI World Street; both are supported. Default unknown. Priority: MEDIUM.
8. **Mobile / responsive behavior** — no mobile app documented; responsive behavior of desktop app unknown. Priority: LOW.
9. **Cluster behavior at low zoom** — assumed no clustering; not confirmed. Priority: LOW.
10. **QR code in PDF deliverables** — assumed absent based on no documentation; may exist. Priority: LOW.
