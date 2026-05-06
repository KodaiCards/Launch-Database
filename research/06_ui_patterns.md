# UI Patterns in OSP / Fiber-Design Software

Cross-cutting visual-design synthesis across OZmap, VETRO FiberMap, 3-GIS, IQGeo / OSPInsight,
netTerrain OSP, Bentley OpenComms, Render Networks, SiteTracker, Smallworld GE, KGPCo Sentinel,
splice.me, PATCH MANAGER, Katapult Pro, Biarri FOND, and the adjacent tools (AutoCAD/Civil 3D,
QGIS/FiberQ, Fulcrum).

Other agents cover per-vendor product details. This document focuses exclusively on reusable
patterns — layout decisions, visual metaphors, interaction models — that can inform the
Launch Fiber Splice Matrix product.

---

## 1. Canvas Paradigms

OSP tools have converged on three distinct canvas archetypes. Understanding which archetype a
tool uses explains most of its downstream UX decisions.

**Full-bleed geographic canvas (GIS-primary)**
Tools in this group — VETRO FiberMap ([vetrofibermap.com](https://vetrofibermap.com/products/fibermap/)),
3-GIS ([3-gis.com](https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis)),
IQGeo Network Manager Telecom ([iqgeo.com](https://www.iqgeo.com/products/network-manager-telecom)),
Katapult Pro ([katapultengineering.com](https://www.katapultengineering.com/katapult-pro)), and
Biarri FOND ([biarrinetworks.com](https://biarrinetworks.com/fond-platform)) — treat the
geographic map as the primary work surface. Network elements (cables, conduits, closures) are
placed directly on satellite or street-map imagery. The splice graph is secondary: it appears
only when the user drills into a specific closure from the map. VETRO describes this as "map-based
navigation and drill-down to move users from tool to tool quickly." The advantage is spatial
intuition; the disadvantage is that the logical connectivity of the splice network is invisible
until you click into individual nodes.

**Hybrid split-view (map + schematic side-by-side)**
IQGeo's built-in schematic view ([iqgeo.com](https://www.iqgeo.com/products/network-manager-telecom))
and netTerrain OSP ([graphicalnetworks.com](https://graphicalnetworks.com/products/netterrain-osp/))
support a split-pane model where a geographic map occupies the left portion of the screen and a
logical node-and-edge diagram lives on the right. When the user selects a cable on the map, the
corresponding logical path highlights on the schematic side. IQGeo calls this "built-in tracing
and schematic views." netTerrain explicitly supports zooming "from street to strand views in
seconds," which implies a progressive disclosure model rather than a true side-by-side layout:
clicking on a conduit zooms the schematic inward to the buffer tube level, then to individual
strands.

**Diagram-first (schematic-primary, map as decoration)**
OSPInsight SpliceGUI/Splice Pro ([ospinsight.com](https://get.ospinsight.com/fiber-management-system-software))
and splice.me ([splice.me](https://splice.me/)) put the logical splice diagram on center stage.
In OSPInsight, the canvas shows rectangular blocks representing buffer tubes, with colored lines
between them indicating fused pairs. The map, if present, is accessed through a separate tab or
panel rather than being the primary workspace. Splice.me is diagram-only: it has no geographic
layer at all. This works well for splicer documentation but breaks down when field crews need to
locate the physical closure.

**Flat-table (spreadsheet metaphor)**
Legacy tools — Excel splice sheets, AutoCAD tables, the "Splice Key Editor" in pre-visualization
OSPInsight — represent connectivity as rows of data rather than a graph. OSPInsight's own docs
describe the old Splice Key Editor as "organized like a spreadsheet rather than a graphical
summary." Bentley OpenComms Designer
([bentley.com](https://www.bentley.com/software/opencomms-designer/)) generates splice reports
and BOM tables, but the primary editing environment is AutoCAD's familiar drafting canvas, not a
purpose-built splice graph.

**What works best:** The hybrid split-view is the most productive pattern for engineers who need
both spatial context and logical connectivity visible at once. The Launch Fiber Splice Matrix should
default to diagram-first (since splice connectivity is its core value) but include a map minimap
or map-peek modal anchored to the closure's GPS coordinates.

---

## 2. Inspector Layouts

**Right-pane inspector (persistent)**
VETRO FiberMap and netTerrain OSP use a persistent right-side panel that loads attribute data
when the user clicks a network element. VETRO's Sonar integration documentation describes this
as "a new sidebar" that populates on element click. This panel typically shows: asset name, cable
type, fiber count, owner, install date, and status. Field density is medium — roughly 8-12 fields
visible without scrolling. The inspector does not replace the canvas; the two coexist.

**Floating modal (overlay)**
Smallworld GE ([gevernova.com](https://www.gevernova.com/software/products/geospatial-network-management-smallworld-gis))
and older Bentley OpenComms follow an MDI (multiple-document interface) desktop convention: editing
an element opens a modal window that floats over the map. This pattern predates browser-based tools
and is now considered a legacy anti-pattern for web software — it forces the user to close the
modal before returning context to the map.

**Bottom attribute table (spreadsheet overlay)**
VETRO FiberMap includes an "Attribute Table" accessible from the bottom of the screen, allowing
multi-row editing of multiple features simultaneously. This is the GIS-standard ArcGIS pattern.
It is useful for bulk edits (e.g., marking 24 fibers as "available" in one action) but is
confusing for newcomers because it is not obviously connected to the map selection.

**Inline contextual drawer (modern)**
Render Networks
([rendernetworks.com](https://www.rendernetworks.com/construction-and-operations)) surfaces task
details in a side drawer that slides in from the right when a map task is tapped on mobile or
clicked on desktop. The drawer shows task status, crew assignment, attached photos, and work
instructions. This pattern collapses well on mobile (full-screen drawer) and works on desktop
(half-width overlay). It is the correct model for field-facing tools.

**Closure inspector field density comparison:**

| Tool | Fields visible w/o scroll | Has custom fields | Edit inline |
|---|---|---|---|
| VETRO FiberMap | ~10 | Yes | Yes |
| netTerrain OSP | ~12 | Yes (templates) | Yes |
| OSPInsight Splice Pro | ~8 (fiber-level) | Limited | Yes |
| Render Networks (task) | ~6 | Via checklists | Yes |
| Bentley OpenComms | ~15+ | Yes (schema-driven) | Modal only |

The optimal inspector for a splice matrix shows: closure name, closure type, GPS coordinates,
cable count, fiber count per cable, tray count, and last-edited timestamp — all above the fold,
with overflow in an expandable section.

---

## 3. Map Integration

**Full-bleed basemap with vector overlay**
VETRO FiberMap, 3-GIS, and Katapult Pro render network elements as vector layers directly over
satellite or street imagery. VETRO uses browser-based rendering described as "lightning-fast image
rendering." The standard basemap providers in this space are: Google Maps satellite (Katapult Pro
uses aerial imagery and Street View), OpenStreetMap / Mapbox (common in newer cloud-native tools),
and Esri basemaps (Smallworld, 3-GIS, SiteTracker GIS Link via ArcGIS). Biarri FOND emphasizes
"location-accurate network designs, GIS data, and stakeholder feedback in a web-based map,"
suggesting a Mapbox or similar web-tile provider.

**Map as tab / secondary view**
OSPInsight and splice.me treat the geographic map as secondary. In OSPInsight, the map is one
module in a broader tabbed interface. In splice.me, there is no map at all — the tool is
diagram-only by design.

**Overlay and redline on construction drawings**
Render Networks ([rendernetworks.com](https://www.rendernetworks.com/resources/media-mobileapp))
added the ability to view "geo-referenced construction drawings as a visual overlay directly on
the project map." This is a significant affordance: the engineer's PDF construction drawing aligns
with the real-world map tiles, so a field tech can toggle between the design intent and the
satellite view of the actual street. Katapult Pro supports a similar concept with street-view
integration.

**Map-diagram synchronization**
IQGeo's schematic and map views are synchronized: selecting a cable on the map highlights it in
the schematic. netTerrain supports the same pattern. This bidirectional linking is the gold standard
for tools that need both spatial and logical views. It requires maintaining two representations of
the same underlying graph, which is architecturally complex but worth it.

**What to borrow:** For the Splice Matrix, a map minimap widget anchored to the active closure's
GPS coordinate — with a "jump to map" button that opens a modal with a full-bleed satellite view
and the closure's upstream/downstream neighbors highlighted — provides spatial context without
making the map the primary canvas.

---

## 4. Splicer / Field Handoff UX

This is the weakest area across the entire tool category.

**Per-closure PDF (most common)**
VETRO FiberMap generates a "PDF copy of the splice report for that location." The PDF is associated
with a serviceable address and downloaded on demand. There is no mention of QR codes, offline sync,
or feedback loops from the field in VETRO's documentation. This is essentially a static export.
The field splicer receives a PDF, uses it, and any corrections are made separately — there is no
digital channel from the field back to the design record.

**Tabular splice schedule (AutoCAD / Bentley lineage)**
Bentley OpenComms generates splice reports and BOM tables as part of its workorder output. These
are table-formatted documents (typically exported to PDF or print) listing cable-from, tube-from,
fiber-from, cable-to, tube-to, fiber-to, splice type, and attenuation values. The format is
information-dense but not scan-friendly at a glance. Continuum LLC's Smallworld splice matrix work
([cadmath.com](https://cadmath.com/case-study-splice-matrix.html)) follows a similar matrix-grid
layout.

**OSPInsight: graphical export**
OSPInsight Splice Pro and SpliceGUI allow users to "export them for field technicians to reference
at the actual splice locations." The export format is a graphical image (screenshot of the
SpliceGUI canvas) rather than a structured PDF. This is better than a pure table but lacks
the structured data that would enable a field tech to search or filter.

**Render Networks: mobile-first, photo-back loop**
Render Networks is the clear standout in field handoff. The platform delivers tasks to field crews
with GPS-located work instructions on iOS/Android. Crews can capture photos, submit as-built data,
and "redline task geometries/locations" — all within the app. The redline feeds back to the
project record in near real-time. This is the only tool in the category that closes the
design-to-field-to-as-built loop digitally. However, Render is a construction management
platform, not a splice documentation tool — it does not show fiber strand connectivity.

**Fulcrum: forms-based splice logging**
Fulcrum ([fulcrumapp.com](https://www.fulcrumapp.com/apps/fiber-optic-splicing-and-testing-app/))
offers a configurable mobile form for fiber optic splicing and testing. Field techs fill in a
structured checklist: cable ID, fiber colors, splice type, OTDR loss reading. Photos are captured
inline. This is a generic form platform, not a purpose-built splice diagram tool, but it
demonstrates the value of structured field capture over PDF/paper.

**QR codes: notable by absence**
No major OSP tool in this research prominently features QR codes on closure-level splice
documents. This is a meaningful gap. A QR code on a printed or laminated splice schedule linking
back to the live record in the platform would give field techs immediate access to the as-designed
state, with no search required. The Launch Fiber Splice Matrix should ship this on day one.

---

## 5. Color Palette and Density

**OZmap**
OZmap ([ozmap.com](https://ozmap.com/en/)) describes a "GIS system" and "Box Editor and Viewer"
but its public marketing materials do not show detailed UI screenshots with hex-level fidelity.
The homepage hero images use a deep navy/blue brand palette with white labels. The map canvas
renders cables in color-coded lines over satellite imagery, consistent with Mapbox-style vector
tile rendering. The overall aesthetic is clean and modern — more consumer web than enterprise.

**VETRO FiberMap**
VETRO positions itself as a "browser-based map viewer" with "lightning-fast image rendering" and
"a large, organized workspace." From marketing materials, the primary brand color is a medium
blue (~#2C6EE0). The map canvas uses white/light-gray backgrounds with colored network element
overlays. Information density is medium — the interface is not packed, with generous padding
between controls.

**netTerrain OSP**
netTerrain 10.0 ([graphicalnetworks.com](https://graphicalnetworks.com/blog-netterrain-10-0-release/))
introduced "a cleaner, faster interface with broad usability improvements across diagrams, tables,
and navigation." Prior to 10.0, user reviews on G2 mentioned the interface looking dated. The 10.0
refresh appears to have moved from a toolbar-heavy desktop-web hybrid toward a flatter, more modern
layout. Capterra reviews rate its ease of use at 4.8/5. The product uses a neutral gray background
for diagrams with colored node shapes for different network element types.

**Smallworld GE**
Smallworld ([gevernova.com](https://www.gevernova.com/software/products/geospatial-network-management-smallworld-gis))
is a Java-based desktop application, now also available on AWS. One G2 reviewer described "non
proportional icons" that "look like a childs coloring book," suggesting an older visual language
with limited design investment. The MapFrame interface has a top toolbar with many small icons, a
large central map canvas, and dockable panels. Color density is high — the map is loaded with
layer symbology from decades of GIS convention. There is no dark mode. Light gray background
dominates. Typography is system sans-serif (Java defaults).

**OSPInsight / SpliceGUI**
The SpliceGUI visualization uses a canvas where rectangular blocks (buffer tubes) are displayed
in their TIA-598 colors, with splice lines connecting fiber endpoints between adjacent blocks.
The overall background appears to be a light neutral (white or off-white). The interface predates
modern design systems — it reads as a thick-client Windows application translated to a browser
addon. There is no dark mode.

**Splice.me**
Splice.me ([splice.me](https://splice.me/)) has the most focused visual language of any tool in
this category. The canvas is white. Network elements are minimalist: cable lines, connector
circles, tray rectangles. Color is used functionally (TIA-598 colors for strands) rather than
decoratively. The interface has a top menu bar and a narrow property panel. Typography appears to
be a clean system sans-serif. The tool supports toggling between black-and-white and colored
diagram modes — the monochrome mode is designed for print. Information density is low to medium;
the canvas is generous, with each tray block well-spaced.

**Render Networks**
From the iOS App Store listing and product page, Render Networks uses a map-centric interface with
accent colors drawn from its brand palette (orange accent on dark navy header). The mobile app
adapts the task list to a card-based layout — each task is a tappable card with a status indicator
(color pill: green = complete, yellow = in progress, red = flagged). Typography is iOS Human
Interface Guidelines–compliant (SF Pro equivalent). High-contrast, legible at arm's length.

**Light/dark mode availability:**
None of the OSP-specific tools in this research advertise a dark mode. Render Networks' mobile app
appears to use a light-default theme. Splice.me is light-only. netTerrain 10.0's marketing does
not mention dark mode. This is an opportunity for the Launch Fiber Splice Matrix to differentiate
— a well-implemented dark mode would be valued by engineers who work in low-light conditions
(NOCs, field shelters at night).

---

## 6. Mobile / Responsive

**Full mobile companion: Render Networks**
Render Networks has the most mature mobile companion in the category. The app is available on iOS
and Android, delivers GPS-located task instructions to field crews, supports photo capture,
redlines (geometry edits), and real-time sync back to the project. It is a purpose-built native
app, not a responsive web view. The mobile UI adapts the map-plus-task-list to a full-screen
vertical layout: map on top, task cards scrollable below.

**Limited mobile: OZmap**
OZmap ([ozmap.com](https://ozmap.com/en/)) offers Android and iOS applications for "managing your
network even without internet." This implies offline-first architecture with sync on reconnect.
The mobile capability is primarily network viewing and basic data collection, not splice design.

**Field inspection: netTerrain**
netTerrain has an iOS app ([apps.apple.com/us/app/netterrain](https://apps.apple.com/us/app/netterrain/id1545529863))
that mirrors the web platform's diagram view on mobile. User reviews on the App Store are sparse,
suggesting limited field adoption. The app appears to be a responsive rendering of the web
interface rather than a purpose-built mobile experience.

**Smallworld FieldSmart**
Smallworld offers a "FieldSmart client for managing network data in the field, with support for
redlining and attribute updates" and "web-access to network inventory on pads and smartphones."
This is described in product documentation but screenshots are not publicly visible. Given
Smallworld's Java desktop heritage, the mobile client is likely a stripped-down web view rather
than a native app.

**SiteTracker mobile**
SiteTracker ([apps.apple.com/us/app/sitetracker-app](https://apps.apple.com/us/app/sitetracker-app/id1316614647))
is a native iOS/Android app that allows field teams to work on or offline, markup documents, view
site information, and complete checklists. It benefits from Salesforce's design system beneath,
which means a polished, accessible UI. However, SiteTracker is a project management tool, not a
splice diagram tool.

**The gap: splice diagrams on mobile**
No tool in this research provides a readable, touchscreen-optimized splice tray diagram on a phone.
This is the most significant mobile gap in the category. On a 6-inch screen, a 144-fiber splice
diagram needs a pan-and-zoom model with clear fiber strand color labels (not just color fills,
since color discrimination degrades at small sizes) and a searchable fiber index. The Launch Fiber
Splice Matrix should design this from the start.

---

## 7. Search and Navigation

**Attribute-based search**
netTerrain supports an "AI-based search (beta) with context-aware search powered by Gemini LLM"
as of the 10.0 release. Prior to that, search was attribute-based: enter a cable ID, address, or
element name to jump to it on the map. This is the standard pattern across all GIS-based tools.
VETRO's documentation references searching by serviceable address to locate the splice report for
a location.

**Map-spatial navigation**
All GIS-primary tools (VETRO, 3-GIS, IQGeo, Katapult Pro) use the map itself as navigation.
Zooming in reveals more network elements; zooming out shows only major trunk cables. This is
familiar to anyone who has used Google Maps, but it is slow for finding a specific closure by
name when the user does not know the geographic location.

**Project-level faceted navigation**
Biarri FOND ([biarrinetworks.com](https://biarrinetworks.com/fond-collaboration)) emphasizes
"geospatial commenting and customizable visualization" and centralizing data storage, which implies
project-level containers. SiteTracker has project dashboards filtered by geography, status, and
assignee — the standard Salesforce-derived filter pattern. IQGeo offers three editions
(Insight, Professional, Enterprise) with progressively richer data management, implying that
multi-project navigation is an enterprise-tier feature.

**Cable tracing as navigation**
Several tools use network tracing as a navigation primitive. OSPInsight's Taper Report lets users
"understand where they have capacity in their network, down to the individual fiber strands."
Splice.me has a "Trace" command: select a connector between pages of the diagram, click Trace,
and the tool highlights all fibers in that cable end-to-end. netTerrain supports "tracing fiber
and coax networks down to individual strands." This is a fundamentally different navigation model
from search: instead of finding a named element, the user navigates by following a signal path.

**What to borrow:** A global search bar that accepts: closure name, cable ID, fiber address
(e.g., "B3-T2-F11" = buffer 3, tray 2, fiber 11), GPS coordinates, and customer circuit ID.
Results should show a ranked list with type badges (Closure / Cable / Fiber / Circuit) and a
one-click jump to the relevant canvas view.

---

## 8. Onboarding / Empty State

This area has received the least design attention in the OSP category. Most tools are sold to
enterprise customers through a sales-led motion with dedicated onboarding and training.

**Training-first, not product-led**
Bentley OpenComms requires setup of fiber spans, splice enclosures, head-ends, cabinets, splitters,
splice trays, and other devices before any design work can begin. This schema setup is an
engineering task, not a guided onboarding experience. VETRO similarly requires data import or
manual setup. Neither tool has a publicly documented "empty state" experience with sample data.

**Katapult Pro: configurable models on intake**
Katapult Pro provides "configurable models, tools, and deliverables based on your project needs
and markets, and includes custom coding packages as a part of their onboarding process." This is
consultant-assisted onboarding, not self-serve.

**OZmap: documentation-led**
OZmap has published a series of articles for new professionals entering the field, indicating an
investment in educational content. Their docs cover Box Editor basics and element customization.
This is a sensible approach for a domain-specific tool but does not substitute for an in-product
guided experience.

**Splice.me: self-serve, low friction**
Splice.me is described as requiring "no onboarding or minimal external assistance" and as "very
intuitive." It is the only tool in the category that appears designed for self-service adoption.
New users can create a splice diagram in three clicks without reading documentation. This is a
strong differentiator and validates the thesis that complexity is not inherent to the domain.

**What the Launch Fiber Splice Matrix should do:** Ship a pre-populated "demo project" with a
three-closure, two-cable example network. The empty state for a new user should show the demo
project with clear "this is example data — start your own project" callouts, not a blank canvas
with a single "Create New" button. The splice diagram should be pre-colored with TIA-598 colors
so users immediately understand the color model before they have to configure it.

---

## 9. Color Coding for Fiber Strands

The TIA-598 standard ([wikipedia.org](https://en.wikipedia.org/wiki/TIA-598-C)) defines 12 colors
for fiber identification, in order: Blue, Orange, Green, Brown, Slate (gray), White, Red, Black,
Yellow, Violet, Rose (pink), Aqua (teal). For cables over 12 fibers, the sequence repeats with
a stripe/tracer.

**How tools represent the 12 colors:**

*OSPInsight SpliceGUI:* Buffer tube blocks are filled with the TIA-598 color as the background
fill of the rectangular block. Individual fiber lines between blocks are drawn in the fiber's
strand color. This is the most direct representation — the color is the primary identifier. Works
well on screen, degrades on monochrome print.

*Splice.me:* Supports two modes. In colored mode, fiber lines are drawn in TIA-598 colors. In
black-and-white mode (print-optimized), fibers are labeled with abbreviated color codes (BL = Blue,
OR = Orange, GR = Green, BR = Brown, SL = Slate, WH = White, RD = Red, BK = Black, YL = Yellow,
VT = Violet, RS = Rose, AQ = Aqua). The "Color Cables" toggle switches between modes. This is
the right pattern for a tool that needs to produce both screen-legible and print-legible output.

*netTerrain OSP:* Allows "any color combination of your choice" when connecting strands, meaning
the tool does not enforce TIA-598 — the engineer configures it. For organizations that document
as-built connections correctly this is fine; for new installations it introduces risk of
non-standard color assignment.

*VETRO FiberMap:* Integrates TIA-598 standards, referenced in product descriptions of splice
diagram and strand identification. Exact rendering method (filled block vs. colored line vs. text
label) is not described in public documentation.

*AutoCAD/Visio (legacy):* Engineers manually draw colored lines or use colored layers. There is
no enforcement of TIA-598 order, no automatic color assignment, and no validation that the same
color is not used twice in a buffer. This is the root cause of a large portion of splice
documentation errors.

**What works at a glance vs. at print resolution:**
Color fills on strand lines are fast to read at screen resolution but fail in three scenarios:
(1) monochrome printing, (2) engineers with red-green color deficiency (~8% of males), and
(3) adjacent strands of similar hue (Slate vs. White, Rose vs. Red). The best implementations
combine color fill with a short letter code inside or adjacent to the strand, a high-contrast
border, and consistent per-buffer striping patterns for tubes 13+.

**Recommendation for the Splice Matrix:** Use TIA-598 color fills as the primary identifier.
Add a 2-letter abbreviation label on each strand. In print/export mode, render a bordered box
around the color fill to ensure it reproduces well in grayscale. For > 12-fiber buffers, add a
diagonal stripe pattern overlay to the fill rather than relying on subtle color differences alone.

---

## 10. Diff and Version UX

This is the most underdeveloped area in the entire tool category. No tool reviewed has a
purpose-built "A vs. B" revision comparison view.

**Splice.me changelog**
Splice.me has a changelog ([splice.me/whats-new-and-changelog/](https://splice.me/whats-new-and-changelog/))
listing product version history, but this is a developer changelog, not an in-product diff view
for network design revisions.

**netTerrain 10.0**
The 10.0 release adds "time-series performance for SNMP data" — this is network operations
telemetry, not design version comparison. No mention of design diff.

**General approach in the category**
Version control in OSP tools is typically file-based (saving a new export, renaming with a date
stamp) or database-snapshot-based (restoring a prior database state). Neither approach surfaces
in the UI as a diff view. The closest analogy is the Esri/ArcGIS model of "versioned editing,"
where edits are tracked in a staging area before being reconciled to the default version —
similar conceptually to a Git branch-and-merge model, but the UI for reviewing differences is
minimal (a table of changed features, not a visual overlay).

**The opportunity**
A splice matrix diff view should: (1) accept two design states (e.g., "Design Rev A" vs.
"Design Rev B"), (2) highlight added connections in green, removed connections in red, and
changed connections in amber — using the same color-coded strand canvas as the main view,
(3) provide a summary sidebar listing the count of changes by closure, and (4) allow the user
to accept or reject individual changes (merge workflow). This does not exist anywhere in the
market today.

---

## 11. Field Markup / As-Built Capture

**Render Networks: richest as-built workflow**
Render Networks ([rendernetworks.com](https://www.rendernetworks.com/platform)) is the clear
category leader here. Field crews can: submit GPS-accurate as-built data, attach photos and
documentation to completed tasks, redline task geometry directly in the app, and flag items
for office review. Changes are visible to the project team in near real-time. The product page
describes this as replacing "paper-based construction approaches with digital workflows and data
capture."

**OZmap: photo storage on closures**
OZmap documentation notes that "the functionality of storing photos of the boxes and poles
directly in the system has brought great organization and efficiency." Photos are associated
with a box element (closure or pole) and stored alongside the GIS record. No voice notes or
inline annotation on printed docs is mentioned.

**SiteTracker mobile: markup and checklists**
SiteTracker's mobile app allows users to "markup documents, view site information, and complete
checklists." Document markup is the PDF annotation pattern — the field tech opens a design PDF,
draws on it with a stylus or finger, and submits the marked-up version. This is better than
no markup capability but does not feed structured data back to the network model.

**Katapult Pro: photos at poles**
Katapult Photos ([katapultengineering.com](https://www.katapultengineering.com/katapult-pro))
"allows users to store, measure, and deliver field data." In the pole attachment context, this
means photos of pole construction, measured against a calibration target. The analogue for
splice closures would be: photo of the completed closure with fiber positions visible, with
measurements (tube labels, fiber color) attached.

**What is absent across the category:**
No tool offers voice notes at the closure level. No tool has inline annotation directly on
a rendered splice diagram (i.e., drawing on the digital tray view on a tablet). No tool has
automated capture from OTDR test equipment directly into the splice record, though AFL's Fiber
Processing Software ([aflglobal.com](https://www.aflglobal.com/en/Products/Fusion-Splicing/Specialty-Fusion-Splicing-Equipment/Splicers/Fiber-Processing-Software-FPS))
shows this is technically feasible.

---

## 12. Anti-Patterns to Avoid

**1. Modal-heavy editing flows (universal legacy problem)**
Smallworld GE and older Bentley OpenComms open a new window or dialog for every edit operation.
This destroys spatial context and forces the user to re-establish orientation after every property
change. Any new tool should use inline editing or a persistent side drawer, never a blocking modal.
Rule of thumb: if closing the edit dialog causes the map to repaint from scratch, the pattern is wrong.

**2. PDF-of-spreadsheet as the field document (VETRO FiberMap, most legacy tools)**
The dominant field document format in this category is a PDF generated from a table — essentially
a screenshot of a spreadsheet. This format is: hard to read in direct sunlight, impossible to
search or filter, provides no feedback channel, and becomes out of date the moment it is printed.
VETRO's splice report is explicitly described as a static PDF export with no QR code or live link.
A splice schedule delivered to a field splicer should have a URL or QR code linking to the live
record, a clear date-of-generation stamp, and a revision hash so the splicer can tell at a glance
whether the document is current.

**3. Color-only fiber identification (no text backup)**
Tools that represent fiber strands purely as colored lines (no letter codes, no position numbers)
break on monochrome print, fail for color-deficient users, and are ambiguous when two adjacent
strands have similar hues (Slate vs. White, Rose vs. Red). Always pair color with at least one
non-color identifier.

**4. Map-as-search (requiring geographic knowledge to find a record)**
Tools that require the user to know approximately where something is on a map before they can
find it in the database penalize users with large or unfamiliar networks. A global keyword search
is a baseline requirement, not a premium feature.

**5. Schematic-only tools with no map tether**
Splice.me and similar diagram-only tools are excellent for documentation but produce artifacts
that cannot be located on a map. When a splicer needs to find a closure in the field and only
has the splice diagram, they have no spatial reference. The absence of a GPS anchor on the
diagram is a genuine field safety risk.

**6. Over-reliance on zoom for density management**
Several GIS-primary tools hide network detail at high zoom levels and reveal it at low zoom
levels. This creates a discoverability problem: users do not know what they cannot see until they
zoom in enough to find it. A better pattern is a network tree / outline panel that lists all
elements hierarchically, independent of the map view.

---

## Sources

- [OZmap product page](https://ozmap.com/en/)
- [OZmap software details](https://ozmap.com/en/ozmap-details/)
- [OZmap specialized solutions](https://ozmap.com/en/ozmap-specialized-solutions-for-fiber-optic-networks/)
- [OZmap Box Editor documentation](https://ajuda.ozmap.com.br/en/support/solutions/articles/44001679790-box-editor-inside-the-box-)
- [VETRO FiberMap product page](https://vetrofibermap.com/products/fibermap/)
- [VETRO FiberMap GIS network mapping](https://vetrofibermap.com/fiber-network-mapping/)
- [VETRO Sonar integration overview](https://docs.sonar.expert/integrations/vetro-fibermap-integration-overview)
- [VETRO YouTube overview](https://www.youtube.com/watch?v=yqx6PSTds4w)
- [3-GIS fiber network management](https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis)
- [IQGeo Network Manager Telecom](https://www.iqgeo.com/products/network-manager-telecom)
- [IQGeo Insight edition](https://www.iqgeo.com/products/network-manager-telecom/insight-edition)
- [IQGeo single pane of glass blog](https://blog.iqgeo.com/managing-your-network-through-a-single-pane-of-glass-going-beyond-gis)
- [OSPInsight product page](https://get.ospinsight.com/fiber-management-system-software)
- [OSPInsight SpliceGUI tool](https://blog.ospinsight.com/what-is-the-splicegui-tool)
- [OSPInsight Splice Pro tool](https://blog.ospinsight.com/2022/what-is-the-splice-pro-tool)
- [OSPInsight Visualization Tools Add-On](https://blog.ospinsight.com/introducing-the-visualization-tools-add-on)
- [netTerrain OSP product page](https://graphicalnetworks.com/products/netterrain-osp/)
- [netTerrain 10.0 release](https://graphicalnetworks.com/blog-netterrain-10-0-release/)
- [netTerrain fiber mapping blog](https://graphicalnetworks.com/blog-fiber-mapping-software-amp-fiber-strand-documentation-what-how-why/)
- [netTerrain OSP Capterra profile](https://www.capterra.com/p/189774/netTerrain-OSP/)
- [netTerrain settings: fiber diagram tuning](https://graphicalnetworks.com/blog-netterrain-settings-fiber-and-outside-plant-diagram-tuning/)
- [Bentley OpenComms Designer](https://www.bentley.com/software/opencomms-designer/)
- [Bentley OpenComms fiber documentation](https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-B7335739-2C11-4C7E-8297-477F1F9CD991.html)
- [Render Networks platform page](https://www.rendernetworks.com/platform)
- [Render Networks mobile app announcement](https://www.rendernetworks.com/resources/media-mobileapp)
- [Render Networks construction and operations](https://www.rendernetworks.com/construction-and-operations)
- [SiteTracker fiber networks page](https://www.sitetracker.com/industries/fiber-networks/)
- [SiteTracker GIS Link](https://www.sitetracker.com/products-services/sitetracker-gis-link/)
- [SiteTracker mobile iOS app](https://apps.apple.com/us/app/sitetracker-app/id1316614647)
- [SiteTracker + VETRO partnership](https://www.sitetracker.com/sitetracker-and-vetro-announce-partnership-to-accelerate-fiber-deployment/)
- [Smallworld GIS — GE Vernova](https://www.gevernova.com/software/products/geospatial-network-management-smallworld-gis)
- [Smallworld Wikipedia](https://en.wikipedia.org/wiki/Smallworld)
- [GE Smallworld G2 reviews](https://www.g2.com/products/ge-smallworld/reviews)
- [Smallworld Nordic telecom](https://www.smallworldnordic.com/telecom)
- [Globema Smallworld GIS](https://www.globema.com/solutions/smallworld-gis/)
- [Splice.me homepage](https://splice.me/)
- [Splice.me changelog](https://splice.me/whats-new-and-changelog/)
- [Splice.me fiber strand color codes](https://splice.me/blog/fiber-optic-strand-tube-color-codes-in-splice-me/)
- [Splice.me vs AutoCAD vs Visio vs Excel](https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/)
- [Splice.me diagram platforms guide 2024](https://splice.me/blog/fiber-splice-diagram-creation-platforms-how-to-streamline-fiber-optic-network-management-in-2024/)
- [PATCH MANAGER outside plant fiber management](https://patchmanager.com/solutions/outside-plant-fiber-management/)
- [PATCH MANAGER fiber splicing](https://patchmanager.com/blog/fiber-splicing-with-patch-manager/)
- [Katapult Pro product page](https://www.katapultengineering.com/katapult-pro)
- [Biarri FOND platform](https://biarrinetworks.com/fond-platform)
- [Biarri FOND collaboration](https://biarrinetworks.com/fond-collaboration)
- [FiberQ QGIS plugin](https://www.fiberq.net/)
- [FiberQ GitHub](https://github.com/vukovicvl/fiberq)
- [Fulcrum fiber optic splicing app](https://www.fulcrumapp.com/apps/fiber-optic-splicing-and-testing-app/)
- [TIA-598 Wikipedia](https://en.wikipedia.org/wiki/TIA-598-C)
- [OSP vs GIS fiber mapping blog](https://graphicalnetworks.com/blog-fiber-mapping-software-osp-vs-gis/)
- [Continuum splice matrix case study](https://cadmath.com/case-study-splice-matrix.html)
- [Top 5 GIS tools for OSP fiber (fibkit.com)](https://blog.fibkit.com/2024/07/the-top-5-gis-software-tools-for-osp.html)
- [AFL Fiber Processing Software](https://www.aflglobal.com/en/Products/Fusion-Splicing/Specialty-Fusion-Splicing-Equipment/Splicers/Fiber-Processing-Software-FPS)
