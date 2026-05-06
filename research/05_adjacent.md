# Adjacent Tools and OSP Industry Context

Tools covered: AutoCAD / Civil 3D, Google Earth Pro, QGIS, Figma / Miro / Lucidchart.
Industry trends: the OSP workflow pipeline, handoff failures, field crew tools, GIS vs CAD tension, AI noise.

---

## AutoCAD and Civil 3D

### What designers use it for in OSP

AutoCAD is the most common drafting environment for OSP deliverables. Designers use it to produce the full set of construction documents: plan and profile sheets, route maps, pole and manhole drawings, detail sheets, permit packages, and splice diagrams. The High-Level Design (HLD) shows the fiber route on a geographic base; the Low-Level Design (LLD) is the construction-ready package that includes splice plans, bill of materials inputs, and pull-sheet details. Civil 3D adds corridor modeling and surface data useful for underground conduit design where grade and depth matter. Firms like Savvy IT, DrafTech International, and DimensionIndia explicitly list AutoCAD and Civil 3D as their primary production platforms for OSP deliverables [(DrafTech)](https://draftech.com/services/cad-gis.html).

OSP designers who work on aerial routes lean toward vanilla AutoCAD with custom block libraries — poles, strand, aerial cable, strand markers. Underground-heavy shops often use Civil 3D because it handles existing utility conflict checking and can reference survey data directly. Permit drawings in particular must conform to local utility authority standards, and AutoCAD DWG is the near-universal submission format.

### Why they use it instead of a dedicated splice tool

There is no single dominant tool that covers the entire OSP workflow from route design to splice diagram. AutoCAD is the lingua franca of engineering deliverables and every OSP firm already has licenses, trained staff, and block libraries. Building splice diagrams in AutoCAD avoids a separate software purchase and keeps everything in one file format. In practice the splice diagram is often drawn as a separate DWG sheet (or a layout tab within the same drawing) and referenced into the permit set. This reuse is convenient until the splice assignments change, at which point every reference in the drawing must be manually updated — a notorious pain point.

The Autodesk community forum discussion on AutoCAD LT for OSP work (fiber cable, manholes) illustrates the gap: a user asked which flavor of AutoCAD is appropriate and the answer was "AutoCAD or AutoCAD LT can draw the geometry but are not industry-specific; Civil 3D may make sense for the civil side, and AutoCAD Electrical or MEP for the fiber side" — revealing that no single Autodesk product covers OSP end-to-end [(Autodesk Community)](https://forums.autodesk.com/t5/autocad-lt-forum/autocad-2018-lt-fiber-optic-cabes-relating-to-outside-plant-osp/td-p/8515746).

### What it lets designers do

- Produce permit-quality plan sheets tied to real-world coordinates (when projected correctly)
- Layer management separates cable routes, conduit, poles, labels, and splice points — allowing selective printing for different audiences
- Block attributes allow structured fiber count, cable type, and span length data embedded in drawing elements
- Layout viewports let designers compose multiple scales on a single sheet (overview + inset detail)
- XREF chains allow master route DWGs to be referenced into permit sheets, enabling distributed team editing
- Civil 3D corridor objects model trench profiles for underground routing with grade data and surface conflicts

### What it cannot do (the gap splice tools fill)

AutoCAD has no concept of fiber continuity. The drawing knows about lines and blocks, not about the logical path of a specific fiber strand through a cascade of closures. A splice diagram in AutoCAD is a picture of a splice, not a model of one. This means:

- No automated end-to-end trace: you cannot ask "which splice closures does fiber 24 pass through between the hub and this drop location?" without manually following the diagram.
- No constraint enforcement: assigning the same fiber twice, or leaving a fiber unassigned, is invisible to AutoCAD.
- Version control for splice assignments is manual — multiple versions of splice DWGs circulate via email with no single source of truth.
- AutoCAD cannot generate a splice matrix from the diagram; the matrix must be maintained separately (typically in Excel), creating two artifacts that diverge.
- Field redlines (as-built changes) must be manually incorporated into the DWG by a draftsperson — no live sync from field to drawing.

Industry vendors who market against AutoCAD for splice work explicitly cite these gaps. Splice.me's marketing states: "Ditch Excel, AutoCAD, Visio & sheets — 20x faster network management" [(Splice.me)](https://splice.me/). Graphical Networks notes that "zooming in on microblock splice trays is like surgery with oven mitts, and one wrong layer turns diagrams into a mess" (unverified — paraphrased from marketing copy).

### Specific UI patterns worth examining

- **Layout viewports**: The way AutoCAD manages multi-scale sheets (model space + paper space) is genuinely powerful for permit packages, but it is notoriously confusing for new users. The mental model of "two spaces" is a recurring complaint on OSP forums. A splice tool should avoid this two-space confusion and keep the design canvas and the output view unified.
- **Layer manager**: AutoCAD's layer discipline (naming conventions, color-by-layer, freeze/thaw) is actually a useful UI pattern for OSP — designers are trained to organize complexity via layers. A splice tool that uses a similar "view filter" concept (show only spliced fibers, show only unassigned fibers) would feel natural to this audience.
- **Block attributes**: Structured metadata embedded in geometry is useful, but AutoCAD's attribute workflow (attdef, attedit, eattedit) is arcane. A better pattern is inline editable fields on a selected element, which is how modern tools like Figma handle component properties.
- **XREF chains**: Powerful for large teams but fragile (broken paths on file moves). Modern tools use cloud references that resolve automatically — a clear improvement to borrow.

### Notable workflow insights

Every OSP design firm interviewed in the Savvy IT and DrafTech service descriptions separates the AutoCAD deliverables into at least three distinct packages: HLD (route overview), LLD (construction sheets + splice plan), and as-built (field-corrected redlines incorporated back into DWG). The hand-off between LLD and as-built is where data most commonly breaks down — the field crew marks up a paper print, and the draftsperson re-enters the changes days or weeks later. This lag is the core gap that mobile field tools are trying to close.

---

## Google Earth Pro

### What designers use it for in OSP

Google Earth Pro is the de-facto lightweight GIS viewer used throughout the OSP industry for route visualization and stakeholder communication. Designers export their fiber route geometry from AutoCAD or GIS as a KMZ/KML file and open it in Google Earth Pro for client walkthroughs, municipality presentations, and internal route reviews. Google Earth Pro is free (since 2015) and runs on Windows, Mac, and Linux, which means every project stakeholder — including non-technical clients and permit authorities — can open and view the route without a GIS or CAD license.

OSP job postings routinely list "proficiency in KMZ and Google Earth" as a required skill alongside AutoCAD and GIS [(datafieldusa.com)](https://datafieldusa.com/osp-engineering/). The Fiber Network Alliance publishes membership fiber line maps downloadable as KMZ for Google Earth [(fibernetworkalliance.com)](https://www.fibernetworkalliance.com/membership-map-line/). VETRO FiberMap and other OSP platforms explicitly support KMZ export for this reason.

### Why they use it instead of a dedicated tool

Google Earth Pro satisfies a specific niche that neither AutoCAD nor ArcGIS fills cheaply: high-resolution satellite imagery with street-level photographic context, zero licensing cost, and universal accessibility. A designer can export the proposed fiber route as a KMZ, email it to a municipal engineer, and that engineer can fly down the route in Google Earth without installing anything. This stakeholder accessibility is not replicable in AutoCAD (DWG requires a license) or ArcGIS (expensive, complex). QGIS is free but less intuitive for non-GIS users.

### What it lets designers do

- Visualize proposed routes draped on satellite imagery at multiple zoom levels
- Overlay the KMZ route against visible aerial features (roads, buildings, existing utility poles) as a sanity check before formal design begins
- Conduct route reconnaissance without a physical site visit — useful for early feasibility
- Share routes with clients and permit authorities who lack CAD/GIS software
- Measure distances along proposed routes using Google Earth's ruler tool as a quick span-length check
- View historical imagery to understand how a corridor has changed over time (useful for understanding when permits may be required)

### What it cannot do

Google Earth Pro has no fiber-specific data model. It displays geometry but knows nothing about fiber counts, splice closures, conduit types, or signal budgets. Key limitations:

- No editing of fiber attributes in the KMZ — changes require going back to the source tool (AutoCAD or GIS), re-exporting, and re-distributing
- No collaborative editing — the KMZ is a static file snapshot, not a live view
- No network topology — you cannot query "what is connected to this node" in Google Earth
- No splice diagram capability whatsoever
- Imagery is not always current and can be years out of date in rural areas, leading to route decisions based on stale data (unverified — informed speculation based on documented imagery currency issues)
- No projection control — Google Earth uses WGS84/Web Mercator only, which can create apparent geometry errors when overlaid with locally projected survey data

### UI patterns worth borrowing (or not)

Google Earth's **fly-to-location** and smooth terrain drape are genuinely excellent for spatial orientation. A splice tool that needs to place closures in geographic context would benefit from an embedded map view with similar smooth zoom behavior. The **time slider** for historical imagery is a clever UI pattern that OSP tools have not adopted — showing how a route corridor changed over time could be valuable for as-built comparison.

The **placemark balloon** (click a point, see a popup) is the pattern every OSP GIS tool uses for asset detail display. It works well at low asset density but becomes overwhelming in dense urban networks where every pole is a click target. Context-aware detail panels that appear on hover rather than click, or that aggregate nearby assets, are better for dense splice map views.

### Notable workflow insights

The KMZ workflow is a lossy one-way street: AutoCAD or GIS exports to KMZ, stakeholders view in Google Earth, comments come back via email or PDF markup, and the designer manually incorporates changes. There is no round-trip. This pattern is so entrenched that OSP platform vendors (VETRO, IQGeo) specifically market their ability to serve a "live Google Maps-like view" as a replacement for the KMZ email loop.

---

## QGIS

### What designers use it for in OSP

QGIS is the primary free GIS alternative to ESRI ArcGIS in the OSP world. Designers use it for route analysis, spatial queries (proximity to roads, existing utility infrastructure, parcel boundaries), and producing map-based deliverables when a full ArcGIS license is not available. QGIS reads and writes shapefiles, GeoPackages, PostGIS, and KMZ — covering most OSP data formats.

The QGIS ecosystem includes fiber-specific plugins. **FiberQ** is an open-source FTTx/GPON/FTTH network design plugin for QGIS that provides a workflow from project setup to deliverables — start with a GeoPackage for local work or connect to PostGIS for team projects [(FiberQ QGIS Plugin)](https://plugins.qgis.org/plugins/fiberq/). The **FTTH Fiber Optic Network Design System** plugin automatically generates optic network designs using graph algorithms from RUIAN cadastral data [(QGIS Plugin Registry)](https://plugins.qgis.org/plugins/FiberOpticNetworkDesignSystem/). **KSavi Geospatial Network Inventory (GNI) FREE** is a free FTTH inventory system built on QGIS for operators planning, designing, and building FTTH networks [(ksavinetworkinventory.com)](https://ksavinetworkinventory.com/). A 2013 QGIS case study documented FTTH/GPON network planning in Poland for the EU Digital Agenda, establishing QGIS as a legitimate OSP design environment early on [(QGIS Case Studies)](https://qgis.org/project/case-studies/poland_ffth/).

Training programs now exist specifically for FTTx network planning and design using QGIS (paired with AutoCAS), indicating that QGIS-native OSP workflows are a recognized discipline, not a hobbyist workaround [(Exuberant Solutions)](https://exuberantsolutions.com/fttx-network-planning-design-qgis.htm).

### Why they use it instead of a dedicated splice tool

Cost is the primary driver. ArcGIS licensing is expensive — a single ArcGIS Pro license runs $1,500+/year, and full Enterprise stacks can run tens of thousands. QGIS is free and open source. For small ISPs, rural co-ops, and emerging-market operators (where much of new FTTH deployment is happening), QGIS plus fiber plugins is a viable alternative to both commercial GIS and dedicated OSP design tools.

QGIS also integrates well with PostGIS, allowing team-based geodatabase workflows without buying an ESRI platform. For engineers with GIS training, the QGIS environment is familiar and extensible through Python plugins.

### What it lets designers do

- Perform spatial route optimization using road network layers, terrain data, and parcel boundaries
- Manage fiber network assets in a geodatabase schema (cables, closures, conduits, poles as feature classes)
- Run proximity analysis: how many homes within 300m of a proposed route? (critical for FTTH feasibility)
- Generate distance-to-service calculations for drop fiber design
- Produce cartographic map outputs for permit packages and stakeholder presentations
- FiberQ specifically: model GPON splitter trees, calculate signal budgets from geometry, produce splice schedule outputs

### What it cannot do

QGIS, even with fiber plugins, is a GIS tool at its core — it models geography, not logical fiber connectivity. Limitations:

- No native splice diagram editor — the closest plugins produce schematic outputs but not interactive splice tray diagrams
- No fiber strand tracking through closures: QGIS can model cables as features but not the individual strand paths through a cascade
- FiberQ's splice outputs are static reports, not interactive diagrams that can be edited in place
- No mobile-first field interface — QGIS is a desktop application; field use requires either QGIS Mobile (QField) or data sync workarounds
- No fusion splicer integration — OTDR results and splice machine loss readings do not flow back into QGIS automatically
- Plugin quality is uneven; FiberQ and GNI FREE are maintained but niche, and users report documentation gaps (unverified — informed speculation based on typical open-source plugin maintenance patterns)

### UI patterns worth borrowing (or not)

QGIS's **attribute table** is a useful UI pattern for bulk fiber assignment: a spreadsheet-like view of all features in a layer, sortable and filterable. OSP designers are comfortable in this view because it mirrors Excel. A splice tool that offers a tabular assignment view alongside the graphical splice diagram would match this mental model.

QGIS's **layer panel** (a tree of layers with visibility toggles and symbology control) is the standard for managing complex OSP maps. The pattern of "turn on the aerial imagery, turn off the parcel layer, add the proposed route" is second nature to OSP GIS users. A splice diagram tool that uses a similar filter/visibility control for fiber tubes and strands would feel familiar.

Avoid QGIS's **processing toolbox** model for fiber-specific tasks — it requires understanding GIS algorithm terminology (buffer, dissolve, clip) that is alien to field crews and splicers. Task-specific guided workflows are better for that audience.

### Notable workflow insights

The gap between QGIS route design and splice documentation is large and unoccupied by free tools. FiberQ produces splice schedules but not interactive diagrams. The result is that OSP designers using QGIS for route work typically pivot to AutoCAD, Visio, or Excel for splice documentation — a context switch that introduces version drift. This is the exact gap a splice-native tool can fill.

---

## Figma, Miro, and Lucidchart

### What designers use these for in OSP

These tools are not purpose-built for OSP, but they appear in splice documentation workflows as workarounds when dedicated tools are unavailable or too expensive. Splice.me's competitive analysis specifically lists "Lucidchart" and "Draw.io" alongside AutoCAD, Visio, and Excel as tools that OSP designers currently use for fiber splice documentation [(Splice.me competitive blog)](https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/). A 2025 telecom solutions review lists Figma, Miro, Lucidchart, and FigJam as viable network diagram platforms for IT and telecom teams [(TelcoSolutions)](https://www.telcosolutions.net/2025/07/03/network-diagram-template/).

Figma's community file library includes a "Network Diagram" template [(Figma Community)](https://www.figma.com/community/file/1100594710452335478/network-diagram) that telecom teams use as a starting point for logical network diagrams. Lucidchart has an explicit telecom and network diagram template category with ANSI/TIA standard shapes. Miro's infinite canvas and real-time collaboration make it popular for workshop-style OSP planning sessions where multiple engineers are annotating a route map together.

### Why they use these instead of dedicated tools

- **Lucidchart**: Has a ready library of network shapes, supports real-time collaboration, exports to PDF/PNG/Visio, and runs in a browser. For teams that already pay for a G Suite or Microsoft 365 bundle that includes Lucidchart, there is zero marginal cost to use it for a splice diagram.
- **Miro**: The infinite canvas model is well-suited to the "paste a KMZ screenshot and annotate it" workflow that OSP planners use in early project phases. Multiple stakeholders can annotate simultaneously.
- **Figma/FigJam**: UI designers who move into network documentation (or vice versa) bring Figma habits with them. Figma's component system can be used to build reusable fiber closure and splice tray blocks, and its auto-layout can handle some of the repetitive alignment work in splice diagrams (unverified — informed speculation, not observed in published OSP case studies).

### What these tools let designers do

- Real-time collaborative diagram editing without file version conflicts
- Comment threads tied to specific diagram elements (a pattern entirely absent from AutoCAD and Visio desktop workflows)
- Easy shape and connector library management
- Browser-based access — no install, shareable via URL
- Export to multiple formats (PDF, PNG, SVG, Visio) for downstream use in permit packages

### What they cannot do

These are general-purpose diagramming tools with no fiber data model:

- No fiber strand tracking, no continuity checking, no signal budget
- No integration with GIS or CAD source data — the diagram is manually drawn, not generated from a network model
- No splice closure or cable library specific to the OSP domain (designers must build or import custom shape sets)
- No fusion splicer data import
- Lucidchart and Miro are cloud-only SaaS — connectivity required, which is a problem in the field
- No structured data export: you cannot query a Lucidchart splice diagram for all unassigned fibers

### UI patterns worth borrowing

- **Real-time multiplayer cursors** (Figma/Miro): seeing where your teammate is working in a shared diagram is genuinely useful for distributed OSP design teams. This pattern is almost entirely absent from CAD and specialized fiber tools.
- **Comment threads on diagram elements** (Figma/Miro): attaching a review comment to a specific splice closure is far more precise than "see email thread re: closure 14." OSP review cycles (designer → PE stamp → client → utility authority) would benefit enormously from this pattern.
- **Component/symbol libraries with live sync** (Figma): when a symbol is updated in the library, all instances update. This is superior to AutoCAD block replacement workflows. A splice tool with a maintained library of OSP-standard closure and cable symbols that auto-updates would save hours of block management.
- **Infinite canvas with semantic zoom** (Miro): as you zoom out, details collapse to icons; as you zoom in, they expand to full labels. This is the right model for a splice tool that must display both the full route (kilometers) and an individual tray (centimeters).

### What not to borrow

Figma's **frame-based artboard model** is the wrong paradigm for geographic data — it imposes a fixed canvas size that fights with the unbounded nature of a fiber route. Lucidchart's **template-picker modal** on new document creation is a friction point that delays getting to the actual work. Miro's **infinite canvas without coordinate anchoring** means diagrams have no real-world position — fine for brainstorming, wrong for splice maps that must align to geographic features.

---

## Industry Trends and Workflow Research

### The Typical OSP Design Pipeline

The canonical OSP design workflow, as described by multiple engineering firms and training programs, runs in roughly six phases:

1. **Feasibility and route planning**: Desktop analysis using GIS (ArcGIS or QGIS) or Google Earth. Engineers walk proposed routes with GPS devices, capturing pole locations and existing infrastructure. KMZ files circulate for stakeholder review. Tools: ArcGIS, QGIS, Google Earth Pro, Katapult Pro (for aerial pole attachments).

2. **High-Level Design (HLD)**: Route geometry is formalized in AutoCAD or a GIS platform, producing an overview drawing showing fiber path, splice location candidates, and major equipment sites. Tools: AutoCAD, Civil 3D, ArcGIS, GIS-native platforms like IQGeo.

3. **Low-Level Design (LLD)**: Construction-ready drawings including plan sheets, profile sheets, conduit/aerial details, splice plans, and a bill of materials. Splice assignments are planned and documented. Tools: AutoCAD (primary), with splice matrix in Excel as a parallel artifact.

4. **Permitting and client approval**: The LLD package is submitted to municipalities, utility authorities, and the client. Revisions cycle back to AutoCAD. KMZ exports support presentations. Tools: AutoCAD, PDF, KMZ, email.

5. **Construction and field documentation**: Civil crews install conduit, pull cable, and set closures. Splicers splice and test. Field crews use printed plan sheets, occasionally tablets with mobile apps. Fusion splicers (Fujikura, Sumitomo, INNO) capture splice loss data internally. OTDR traces are stored as .SOR files. Tools: Printed DWG sheets, mobile apps (FiberOSP, Fulcrum, Katapult Pro for pole work), fusion splicer onboard storage.

6. **As-built documentation**: Field redlines (marked-up prints or photos) are returned to the office. Draftspeople update the AutoCAD DWGs. The GIS database is updated to reflect actual construction. Tools: AutoCAD redlines, GIS update workflows, occasionally specialized as-built platforms.

[(Savvy IT OSP Design Guide)](https://savvy-it.com/insights/what-is-osp-design-a-complete-guide-to-outside-plant-engineering-and-fiber-optic-network-planning/) | [(DrafTech International)](https://draftech.com/services/cad-gis.html) | [(VETRO FiberMap)](https://vetrofibermap.com/what-is-osp-an-introduction-to-outside-plant-fiber-optic-network-management/)

### Where the Handoffs Fail

The industry has converged on a clear set of failure points:

**LLD to field**: The splice plan delivered to field crews is a static PDF or paper print. If the plan changes during construction (a common occurrence — "no fiber network stays as-built for longer than a couple weeks" is a direct quote from industry sources), the field crew is working from stale documentation. There is no mechanism in the standard workflow to push plan updates to the field and confirm receipt [(VETRO)](https://vetrofibermap.com/osp-technology-management-software/).

**Field to as-built**: Redline markups must be physically transported back to the office and manually re-entered by a draftsperson. The lag is typically days to weeks, during which the as-built state is unknown. Splice loss measurements from fusion splicers live on the splicer's onboard storage and are rarely integrated into the project record in any structured way.

**Splice plan to splice diagram**: The splice matrix (an Excel table of fiber-to-fiber assignments) and the splice diagram (a visual drawing of tray and closure layout) are maintained as separate artifacts. They diverge. Multiple versions circulate. Engineers report spending more time reconciling versions than performing the underlying design work [(Splice.me competitive analysis)](https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/).

**GIS to CAD**: When the route geometry lives in ArcGIS and the construction drawings are in AutoCAD, any field-driven route change must be updated in both systems manually. The two systems do not talk to each other by default. IQGeo and similar GIS-native OSP platforms market specifically against this gap [(IQGeo)](https://www.iqgeo.com/solutions/integrated-network/fiber-optic-network-planning-design-software).

### The Mobile Splicer Market

Field crews carry a mix of equipment and apps. The fusion splicer itself (Fujikura, Sumitomo, INNO Instrument, Furukawa) has become a connected device: Fujikura's Splice+ cloud connectivity app links the splicer to a smartphone via Bluetooth, capturing GPS location, splice loss results, and tool usage data in real time [(Fujikura Splice+)](https://www.fusionsplicer.fujikura.com/products/splice-plus-cloud-connectivity-app/). OTDR units (EXFO, VIAVI, AFL) similarly produce .SOR trace files that can be exported.

Beyond the splicer hardware, field crews use:

- **FiberOSP**: A mobile-first platform for OSP construction task execution — photo capture, fusion splice tracking, OTDR result logging, power meter verification, QA signoff, and completion gates. Designed specifically for the field-to-office data flow [(FiberOSP)](https://fiberosp.com/).
- **Fulcrum**: A general-purpose field data collection platform with a published fiber optic splicing and testing app template [(Fulcrum)](https://www.fulcrumapp.com/apps/fiber-optic-splicing-and-testing-app/). Less purpose-built than FiberOSP, but configurable.
- **Fycelium**: An iOS app for keeping field crews on the current fiber network model, tracking job progress, and managing network rollout acceptance [(Fycelium App Store)](https://apps.apple.com/us/app/fycelium/id1535074006).
- **Katapult Pro**: Used for aerial pole attachment workflows — photo-based pole data capture, make-ready engineering, and SPIDAcalc integration [(Katapult Engineering)](https://www.katapultengineering.com/katapult-pro).

The notable gap: none of these field tools closes the loop back to the splice diagram. FiberOSP logs that a splice was performed; it does not update the splice diagram in AutoCAD or a GIS platform. The splice diagram and the as-built record remain separate artifacts.

### GIS-Native vs CAD-Native: The Long-Running Tension

The OSP industry is genuinely split on this, and the debate has been running for at least a decade. The core argument:

**CAD-native camp**: AutoCAD produces the deliverables that utility authorities, municipalities, and clients actually accept. Construction crews read DWG-derived PDF prints. The precision of CAD geometry (snap, ortho, dimensioning) is necessary for permit drawings. GIS is good for planning but not for construction documentation.

**GIS-native camp**: Fiber networks are geographic objects. Managing them in a GIS database (with spatial queries, topology rules, and live mapping) is fundamentally more powerful than managing them as CAD geometry. A GIS-native platform can answer "how many homes pass within 100m of this route" in seconds; AutoCAD cannot. CAD drawings become stale artifacts; a GIS database stays live.

Industry analysts and platform vendors have landed on a hybrid consensus: GIS for network inventory and planning, CAD for permit deliverables. As one OSP engineering firm states: "Modern design requires integration of GIS (ESRI/IQGeo) for asset mapping and real-time visibility, and AutoCAD for HLD/LLD drawings, base maps, detail sheets, and permit packages" [(ATCO Telecom)](https://www.atcotelecom.com/post/cad-vs-gis-in-telecommunications). Platforms like IQGeo sit at the GIS-native end and generate CAD-compatible outputs; Katapult Pro sits in the middle with a GIS backbone and PDF/DWG export.

The splice diagram has not been claimed by either camp. It is logically a network inventory object (GIS territory) but visually a schematic drawing (CAD territory). This ambiguity is why splice documentation remains stuck in Excel and Visio.

### What Trade Shows and Industry Analysts Are Covering

**OFC 2025** (Optical Fiber Communications Conference, San Diego, March 2025, ~17,000 attendees) was dominated by AI and fiber demand driven by hyperscale data centers. AI inference workloads require 10x more fiber than traditional data center connectivity; AT&T publicly stated "agentic AI workflow is going to rewrite the whole industry." Hollow-core fiber, 1.6T coherent transceivers, and subsea capacity were also major themes. OSP field tool innovation was not a highlighted track — the conference skews toward optical physics and carrier architecture rather than outside plant construction tools [(DataCenter Dynamics OFC 2025)](https://www.datacenterdynamics.com/en/analysis/ofc-2025-hollow-core-fiber-hype-stands-out-amid-the-ai-overload/) | [(Precision OT OFC 2025)](https://www.precisionot.com/ofc-2025-ai-fiber-optics-and-future-networks/).

**Fiber Connect** (the Fiber Broadband Association's main annual event) focuses more directly on deployment practice and OSP economics. The FBA's FTTx Outside Plant Design Program is a formal certification for OSP designers, covering route design, permitting, splice planning, and construction documentation — evidence that the industry has recognized OSP design as a distinct professional discipline requiring standardized training [(Fiber Broadband Association)](https://fiberbroadband.org/education-and-certification/fttx-outside-plant-design-program/).

**ISE Magazine** and **Lightwave Online** cover the deployment side of the industry. Recurring themes in 2024-2025 coverage: rural broadband buildout (driven by BEAD program funding in the US), workforce shortages in fiber splicing and construction, and the push for faster design-to-permit timelines. The workforce shortage point is directly relevant to tool design — splicers are expensive and scarce, so documentation tools that reduce re-splice events (caused by incorrect splice plans) have direct economic value.

### Generative AI in OSP Design: Signal vs Noise

The AI signal in OSP is real but narrowly focused on **automated route optimization**, not on splice diagram generation. Biarri Networks' FOND Platform and Comsof Fiber are the two most credible automated fiber network planning tools. Both use combinatorial optimization (not generative AI per se) to produce minimum-cost network designs from demand point data. Biarri claims 25x faster design versus traditional manual methods; Comsof Fiber is integrated with IQGeo's platform [(Biarri Networks)](https://biarrinetworks.com/fond-platform) | [(IQGeo + Comsof)](https://www.iqgeo.com/blog/accelerate-fiber-planning-and-design-with-iqgeo-and-comsof).

Generative AI (LLM-based) in OSP is largely aspirational as of mid-2025. Magnasoft's blog claims generative AI can "instantly create multiple versions of a fiber route plan based on terrain, customer density, and cost" and "auto-generate detailed design drawings" [(Magnasoft)](https://www.magnasoft.com/blog/why-gen-ai-is-the-strategic-upgrade-telecom-network-design-has-been-waiting-for/) — but this describes optimization capabilities that Biarri and Comsof already have, not novel LLM capabilities. The FOA's published AI overview (authored by a CFOS/I-certified designer) treats AI in fiber design as synonymous with Biarri-style ML optimization, not with generative text/image models [(FOA AI in Fiber Design)](https://www.thefoa.org/images/AI_FO.pdf).

The honest assessment: generative AI for splice diagram creation does not exist in any shipping product as of mid-2025. The noise level around "AI for OSP" is high; the practical reality is constraint-based route optimization and, at the frontier, predictive maintenance on live networks. Splice documentation automation remains a manual problem.

---

## Summary: Workflow Gaps a Dedicated Tool Should Fill

The adjacent tool survey reveals five structural gaps that no current tool combination reliably closes:

1. **Splice plan ↔ splice matrix synchronization**: The diagram (visual) and the matrix (tabular) are always two separate artifacts that diverge. A tool where the diagram and matrix are the same underlying data model — editing one updates the other — would eliminate the most common source of version conflict.

2. **Field redline integration**: As-built changes captured in the field (marked-up prints, photos, fusion splicer loss readings) have no structured path back into the splice diagram. A tool with a mobile companion that captures field deviations and syncs them to the design model closes this loop.

3. **End-to-end fiber trace**: No current general-purpose tool (AutoCAD, QGIS, Visio, Lucidchart) can answer "trace fiber strand 24 from the hub to the drop, through every closure it passes." This is a fundamental query that splice tooling must support.

4. **Stakeholder-accessible route review**: The KMZ/Google Earth email loop is entrenched because it is universally accessible. A splice tool that can publish a shareable, read-only web view of the splice plan (no license required for viewers) would displace the KMZ workflow for splice-specific review.

5. **Splicer hardware data capture**: Fusion splicers (Fujikura Splice+, etc.) capture GPS location and splice loss per weld. No design tool ingests this data to auto-populate as-built splice records. Closing this integration gap would eliminate the manual as-built entry step entirely.
