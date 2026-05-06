# Competitive Research: OZmap and VETRO FiberMap

Prepared for the Splice competitive matrix. Covers OZmap and VETRO FiberMap in depth.
Other vendors covered in parallel research files.

---

## OZmap

### 1. What It Does

OZmap is a cloud-based, GIS-enabled fiber network management and documentation platform developed by devOZ, a company headquartered in Florianópolis, Brazil since 2012. The platform is purpose-built for FTTx/FTTH ISPs and enables operators to create, visualize, and manage their entire outside-plant fiber network in a single web-based system. Core capabilities span infrastructure mapping (poles, ducts, conduits, boxes), splice matrix generation, logical network diagrams, active monitoring hooks (OTDR, Edge Switch integration), and a companion mobile app (OZmob) for field teams. The platform is positioned specifically at the fast-growing Latin American ISP market but has expanded to clients in [28 countries](https://ozmap.com/en/who-we-are/). A partnership with [FiBrasil](https://ozmap.com/en/the-importance-of-telecommunications-for-the-future-of-work-3/) — one of Brazil's largest open-access fiber wholesalers — signals enterprise-tier reach despite the platform's SMB roots.

### 2. Pricing Model

OZmap does not publish per-seat or per-asset pricing publicly. The vendor offers both an "Essential" (basic) plan tier and a full enterprise plan, with interested customers directed to a sales form. The existence of an [Essential Plans page](https://ozmap.com/en/essential-plans/) suggests a tiered SaaS model, but specific dollar amounts are not disclosed. Pricing is negotiated per engagement. No free tier or freemium option is advertised. The model appears to be subscription SaaS, sized by network scale or user count (unverified — vendor positioning).

### 3. Target Customer

OZmap targets small-to-medium regional ISPs, primarily in Brazil and Latin America, where the FTTH buildout is driven by [thousands of regional providers](https://ozmap.com/en/) rather than large incumbent telcos. The software is optimized for operators building GPON/FTTH access networks from scratch, often with lean engineering teams that need to document infrastructure quickly. The FiBrasil partnership and expansion to 28 countries suggest growing interest from mid-market carriers and open-access wholesale operators beyond LatAm. OZmap also markets to contractors and field technicians through its OZmob mobile product. No evidence of utility or municipal market targeting was found.

### 4. Splice-Planning Depth

OZmap offers meaningful splice-planning functionality. Users can [create and share splice diagrams](https://ozmap.com/en/) with field teams, documenting fusions between cables, boxes, and posts. The platform supports splice matrices — tracking which fibers connect through which closures — and allows registration of splice trays, splitters, OLTs, DIO frames, and passes. The [Complete Route Report](https://ozmap.com/en/release-notes/) feature (added 2024) lets a user select a fiber strand and generate a report tracing the full route end-to-end, exportable as CSV, XLS, or KML, with a Logic Diagram in PDF. Box internal diagrams show capacity, occupancy, and port assignments. However, the platform does not appear to offer the level of per-ribbon-per-fiber color-coded splice worksheet granularity that purpose-built splice CAD tools provide; its strength is in the OSP documentation layer that contextualizes splice points on a live GIS map. Whether it tracks individual buffer tubes and ribbon assignments within a closure is not confirmed in public documentation (unverified — vendor positioning).

### 5. Map / GIS

OZmap is built around a GIS core described as "robust, intuitive, and easy-to-use." The platform provides FTTH network mapping centralized on a map canvas with support for registering network elements georeferenced to real-world coordinates. Data export is explicitly listed as [KMZ, box diagrams, and information tables](https://ozmap.com/en/), with routes also exportable as KML. A [Complete Route Report](https://ozmap.com/en/release-notes/) can be exported in KML format in addition to CSV and XLS. The platform supports import from KMZ and KML (noted in data migration workflows). No explicit DXF/DWG export or direct AutoCAD file import is mentioned in public documentation; the primary basemap engine is not publicly specified (likely OpenStreetMap or Google Maps satellite underneath — unverified). Coordinate system support is not detailed publicly. GIS tools include element grouping/ungrouping on the map canvas and viability route overlays showing splitter port availability.

### 6. Field Workflow

OZmap's mobile companion app, [OZmob](https://ozmap.com/en/ozmob/), is available on both iOS (App Store) and Android (Google Play). It is designed specifically for field technicians performing maintenance, inspections, and network construction. Key OZmob capabilities:

- **Offline mode**: When no internet/3G is available, OZmob works fully offline and syncs with OZmap once connectivity is restored. Technicians can view network elements, change deployment states, and add new elements without internet.
- **QR code scanning**: OZmap generates [QR codes](https://ozmap.com/en/ozmap-qrcode-tips/) for physical boxes. A technician scanning a box QR code with OZmob is immediately taken to the box's internal diagram, showing its full internal structure. This enables on-site documentation of functional changes.
- **Pendency management**: Technicians can create and edit work orders and pendencies offline, ensuring field efficiency without connectivity.
- **Client sketches and box diagrams**: Viewable in the app for reference during on-site work.
- **Fiber color display**: The app shows the color coding of loose tubes and individual fibers in the connections list without requiring the user to open the full diagram.
- **Splice client addition**: Technicians can add clients to splices directly from the field app.
- **Diagram export with highlights**: A May 2025 OZmob release added the ability to export diagrams with specific fibers highlighted, useful for splicer handoff documentation.

The feedback loop from field to office is primarily through OZmob's sync mechanism. There is no specific mention of a redline markup or annotation layer that splicers return to the engineering team (unverified — vendor positioning).

### 7. PDF / Deliverables

OZmap generates several types of printable and exportable documents:

- **Logic Diagram**: Exportable as PDF, showing the logical structure of a network segment.
- **Box diagrams**: Viewable in-platform and exportable per the data export suite.
- **Complete Route Report**: Exportable in CSV, XLS, and KML formats; includes the full splice route.
- **Splice diagrams**: Shareable with field teams (format not explicitly specified — likely in-app or PDF).
- **Diagrams with highlighted fibers** (OZmob, May 2025): Can be exported to support splicer-grade handoff documents.

OZmap does not appear to offer versioned deliverable history, redline diff outputs, or a formal as-built drawing package equivalent to engineering CAD deliverables. The PDF outputs are described primarily as operational reference documents rather than contractor-grade construction prints (unverified — vendor positioning).

### 8. AutoCAD Interop

No explicit DXF or DWG import/export capability is documented in OZmap's public marketing or release notes. The primary geospatial I/O formats mentioned are KMZ, KML, CSV, and XLS. OZmap does assist with [large-scale data migration](https://ozmap.com/en/ozmap-specialized-solutions-for-fiber-optic-networks/) using "analysts and software developers processing data to ensure existing network information works with OZmap," which suggests custom import pipelines rather than native AutoCAD interop. If a customer's existing infrastructure documentation lives in AutoCAD, they would likely need a manual or scripted conversion step. This is a notable gap for contractors or engineers whose upstream deliverables come from CAD-first workflows.

### 9. UI / UX Layout Patterns

OZmap's web application centers on a full-canvas GIS map view. Based on product page imagery and descriptions:

- The primary interface is a dark-themed or neutral-toned GIS map occupying most of the screen, with network elements (boxes, cables, poles) rendered as symbols and lines on the map canvas.
- A left or top panel provides layer controls, search, and element registration tools.
- Clicking a network element (box, pole, cable) opens a side panel or modal showing that element's attributes, connections, and internal diagram.
- Box internal diagrams use a tabular/schematic layout showing splice trays, ports, and occupancy — presented as a logical diagram rather than a physical rendering.
- Color coding is used to distinguish fiber states (active, available, pending).
- The OZmob mobile app interface is described as "user-friendly and intuitive," with a list-based navigation for network elements and a map view for geo-navigation. The box diagram in OZmob is accessible by QR code scan and shows the full internal part of the box.
- Typography and palette: vendor screenshots (not directly accessible during this research) suggest a clean, functional UI with a light or dark map background, colored element overlays, and sans-serif typography consistent with modern web GIS tools. No unusual visual density or custom map styling was observed in publicly described screenshots.

### 10. Strengths (User Praise)

Based on available case study and marketing material (direct user review aggregators blocked during research):

- **Technical support**: OZmap's support team is consistently praised. One case study reports project time reduced from 2 hours to 30 minutes (75% reduction) after OZmap implementation.
- **Offline mobile**: The OZmob offline capability is highlighted as a key differentiator for field teams in areas with poor connectivity — common in rural LatAm deployments.
- **QR code workflow**: The physical-to-digital link via box QR codes is noted as a significant operational improvement.
- **Integration ecosystem**: Native integrations with major Brazilian ISP ERP/OSS systems (Voalle, IXC, SGP) reduce double-entry. API availability supports custom integrations.
- **Network documentation completeness**: Users value OZmap's ability to store photos of boxes and poles directly in the system for organized field reference.
- **LatAm fit**: The platform's design is tuned to the Brazilian FTTH market's operational realities (small teams, rapid rollout, passive infrastructure density).

Source: [OZmap case study — BRSuper](https://ozmap.com/en/brsuper-ozmap-telecom-network-management-success-story/), [OZmap case study — Netcomplus](https://ozmap.com/en/netcomplus-and-ozmap-migration-and-success-in-network-management/).

### 11. Weaknesses (User Complaints)

- **Limited public review record in English**: OZmap has a thin Capterra/G2 review footprint in English, making independent third-party assessment difficult. Most feedback is surfaced through vendor-curated case studies.
- **No AutoCAD interop**: No native DXF/DWG support means integration with CAD-first engineering workflows requires custom conversion.
- **Pricing opacity**: Pricing is entirely behind a sales contact form, making budget-stage evaluation difficult for procurement teams.
- **Splice planning granularity**: The platform does not appear to offer fiber-level splice worksheets with per-ribbon, per-tube, per-fiber color tracking comparable to a dedicated splice CAD tool. It covers splice points at the network documentation layer.
- **Geographic/language skew**: The platform's primary language has historically been Portuguese. While English documentation and UI exist, the ecosystem of training resources, community forums, and partner integrations is heavily Brazil-centric.
- **Review aggregator gap**: No verified Capterra or G2 reviews were accessible during this research; the 4.9/5 rating cited on OZmap's own marketing material is unverified via third-party sources.

### 12. Notable UI Screenshots

Direct access to vendor website and media was blocked (403 errors) during this research. From available search result descriptions and OZmap marketing content:

- OZmap's product hero imagery shows a dark map canvas with fiber routes rendered as colored lines on a satellite or street basemap. Network boxes appear as labeled icons at splice point locations.
- The box internal diagram view shows a schematic representation of splice trays and port assignments, rendered as a logical diagram (not a photo or photorealistic render).
- OZmob's Google Play store listing shows a mobile interface with a map view and an element detail view, consistent with a simplified version of the desktop GIS interface.
- The [OZmap integrations page](https://ozmap.com/en/integrations/) shows a hub-and-spoke diagram connecting OZmap to ERP systems (Voalle, IXC, SGP), provisioning tools, chatbots, and CRMs — illustrating the platform's OSS integration philosophy.

---

## VETRO FiberMap

### 1. What It Does

VETRO FiberMap is a cloud-based, browser-delivered fiber network management GIS platform founded in 2016 by Will Mitchell and Sean Myers, headquartered in Portland, Maine. The platform is purpose-built for broadband providers — ISPs, electric cooperatives, municipalities, and CLECs — to plan, design, build, and operate fiber optic networks end-to-end from a single system. Its tagline, "radically simpler fiber management," reflects a deliberate positioning against legacy desktop GIS tools (QGIS, ArcGIS) and spreadsheet-based approaches. VETRO covers demand mapping, engineering design, bill of materials generation, splice management, circuit editing, field crew coordination, and network operations — delivered through any web browser with no client install. The company reported [$10.7M in revenue with 98 employees](https://getlatka.com/companies/vetro-fibermap) and has raised funding ($42.1M per PitchBook) to build out its platform for the US rural broadband build wave.

### 2. Pricing Model

VETRO FiberMap does not publicly disclose per-seat or per-asset pricing. It is explicitly a [subscription SaaS model](https://www.capterra.com/p/193245/VETRO-FiberMap/pricing/) that converts fiber management from a capital expense to an operational expense — the standard SaaS framing. Contact is required for a quote. No free tier or trial is advertised. The company's focus on small-to-mid ISPs and cooperatives suggests pricing designed to be accessible to organizations without large IT budgets, but specifics are not publicly confirmed (unverified — vendor positioning).

### 3. Target Customer

VETRO explicitly targets [ISPs, electric co-ops, local governments, and others deploying and managing fiber](https://vetrofibermap.com/). The sweet spot is described as small-to-mid-sized fiber ISPs and community fiber networks taking a DIY approach to building rural broadband in the United States. Case studies include [Pioneer Broadband](https://vetrofibermap.com/pioneer-broadband-leverages-vetro-fibermap-bring-world-class-broadband-rural-northern-downeast-maine-communities/) (rural Maine cooperative) and [Mercury Broadband](https://www.prweb.com/releases/2022/8/prweb18857409.htm) (regional ISP). The US focus is strong; VETRO is well-positioned for organizations navigating BEAD and RDOF funding programs that require detailed network documentation and reporting. Municipal broadband and electric utility fiber arms are a growing segment. Large incumbent telcos are not the primary target.

### 4. Splice-Planning Depth

VETRO FiberMap has genuine splice-planning depth, described as a system where VETRO "became the source of truth for the splicing of fiber circuits and physical fiber assets." Key capabilities:

- **Splice log creation**: The platform generates splice logs that validate design and document actual splicing work. A [PDF copy of the splice report](https://www.capterra.com/p/193245/VETRO-FiberMap/) for serviceable addresses associated with FiberMap service locations can be downloaded.
- **Splice diagram editing**: Users can edit fiber paths using splice diagram, equipment diagram, and circuit editing features — including adding splitters to FTTH networks mid-route.
- **Circuit editing tools**: A dedicated [circuit editing toolset](https://www.youtube.com/watch?v=zbRQJrUeZ-g) allows editing of any established fiber path, rerouting circuits, and managing connectivity end-to-end.
- **Design validation**: VETRO catches splice errors before they become field problems by validating logical connectivity against the physical network model.
- **Time savings**: Users report [minimum 50% time savings on connectivity/splicing tasks](https://www.cossystems.com/knowledge-hub/news/knowledge-hub/vetro-fibermap/) vs. desktop GIS, and up to 90% savings vs. spreadsheets.

The splice planning is clearly beyond coarse infrastructure tracking but may not reach the per-ribbon, per-fiber-color worksheet level of dedicated splice CAD tools. The platform models splice connectivity logically (circuits, paths, endpoints) more than physically (tube colors, ribbon assignments per closure). This is consistent with its target audience of network designers, not individual splicers filling out field worksheets.

### 5. Map / GIS

VETRO FiberMap is built on an open technology stack, browser-delivered, with a GIS engine designed specifically for fiber rather than adapted from a general-purpose GIS. Key GIS capabilities:

- **Browser-based map viewer**: Described as offering "lightning-fast image rendering" with a large, organized workspace and map-based navigation and drill-down.
- **Attribute Table**: Edit attributes of multiple features simultaneously, add new attributes to layers, and export selected features.
- **Analytics / Network Dashboard**: Draw polygons on the map to research data within an area; search on any text-based attribute.
- **Layer customization**: Custom maps highlight elements by feature type, placement, and capacity, establishing visual shorthand for team communication.
- **GIS-ready export formats**: Designs can be shared in [GIS-ready formats](https://www.fibre-systems.com/product/vetro-fibermap-launches-cloud-based-fttx-mapping). KMZ/KML support is implied by GIS-ready positioning but not explicitly listed in public documentation. DXF export is not confirmed.
- **Open APIs**: The platform is API-driven, enabling data exchange with other GIS/OSS systems.
- A known weakness: VETRO is not a full GIS program like QGIS or ArcGIS. Users have noted difficulty editing data after import — vertices are hard to align, and snapping may snap to unintended segments. This is a documented limitation from user reviews.

### 6. Field Workflow

[VETRO Mobile](https://www.youtube.com/watch?v=Gt_Gh1YpHVg) brings real-time GIS, splice management, and offline map access to field engineers, fiber techs, and deployment teams. Key field capabilities:

- **Offline map access**: Field crews can access downloaded map tiles and network data without connectivity.
- **Real-time GIS**: When connected, field edits sync immediately to the office, enabling direct submission of drawings to editors for immediate review and placement.
- **Splice management in field**: VETRO Mobile includes splice management functionality, enabling field documentation of actual splice work against the design model.
- **Direct submission workflow**: Field teams submit drawings/markups directly to editors, "significantly streamlining provisioning and ensuring more efficient field experience" per COS Systems.
- **No QR code workflow documented**: Unlike OZmap, VETRO does not publicly describe a physical QR code tagging system for infrastructure elements.

The field-to-office feedback loop is described as tighter than traditional desktop GIS workflows, but the specific markup/redline format is not detailed in publicly accessible documentation.

### 7. PDF / Deliverables

- **Splice reports**: Downloadable as PDF for individual serviceable addresses, including splice log and connectivity path documentation.
- **Mapbook**: VETRO's Mapbook feature has been improved sufficiently that users now use it "for permitting purposes" — indicating suitability for regulatory/permit submissions. Earlier versions were criticized for map quality.
- **Bill of Materials (BOM)**: Generated from network designs, supporting construction cost estimation.
- **No versioned deliverable history or redline diffs**: Not documented in public materials. VETRO does have an Audit Log (implemented as part of its re-platforming), which tracks changes, but a formal versioned document output with redline comparison is not described (unverified — vendor positioning).

### 8. AutoCAD Interop

VETRO FiberMap's public materials do not explicitly describe DXF or DWG import/export capability. The platform's GIS-first architecture suggests it expects network data in GIS formats (shapefiles, KML, GeoJSON, etc.) rather than AutoCAD formats. The platform's "open technology stack" and API-driven design would technically allow custom integration pipelines for DXF data, but native AutoCAD interop is not advertised. This is a gap for engineering teams whose upstream design work lives in AutoCAD Civil 3D or AutoCAD Map 3D. Users coming from CAD-first workflows would need a conversion step (unverified — vendor positioning based on absence of documentation).

### 9. UI / UX Layout Patterns

VETRO FiberMap's interface is web-based, requiring no client software installation. Based on product page descriptions, YouTube demo video descriptions, and the [design portfolio entry by Andrea Cerrilla](https://andreacerrilla.com/vetro-fibermaps) (a designer who worked on the product):

- **Map-centric layout**: The primary view is a full-screen or near-full-screen map canvas, consistent with GIS-first design tools. The map occupies the bulk of the screen real estate.
- **Left panel / toolbar**: Navigation tools, layer controls, and feature-type selectors are positioned in a left sidebar or top toolbar. The interface uses a "large, organized workspace" with map-based navigation.
- **Attribute panels**: Clicking a network feature opens an attribute panel (likely right sidebar or modal) showing feature properties, connectivity, and related data.
- **Circuit editing mode**: A dedicated editing mode with tools for drawing fiber routes, placing equipment, and editing splice points — distinct from the view-only network map.
- **Network Dashboard**: An analytics panel for drawing query polygons and searching network data by attribute.
- **Color palette and typography**: The platform uses a clean, modern SaaS aesthetic consistent with US-market broadband tools. The map canvas uses standard GIS color conventions for feature types (cables, equipment, conduit). Typography is sans-serif; the overall palette is light/neutral with colored map overlays. From the Andrea Cerrilla design portfolio description, the UI emphasizes clarity and density appropriate for engineering-level users.
- **VETRO Mobile**: The mobile interface is a simplified version of the web app, optimized for touch navigation with the map canvas as primary and element detail as secondary view.

From the [Smarter Fiber Planning webinar thumbnail](https://www.youtube.com/watch?v=O4n-cteH9RE) (May 2024): the VETRO interface shown in webinar marketing appears as a mid-density map with colored fiber route overlays on a street/satellite basemap, with a feature attribute panel on the right side.

### 10. Strengths (User Praise)

Based on Capterra review summaries and COS Systems/Sonar integration partner documentation:

- **Ease of use**: Consistently praised. Trainers can get low-experience designers productive within one week; view-only users are trained in approximately one hour. This is a significant differentiator vs. desktop GIS tools.
- **Splice time savings**: Users report 50-90% time reduction on connectivity and splicing tasks compared to prior tools.
- **Design-to-deployment speed**: VETRO enables rapid FTTP design iteration — engineering teams can move quickly from demand analysis through design to construction documentation within one platform.
- **Collaboration**: Real-time access across departments (engineering, marketing, leadership, field) from any browser eliminates the "stale spreadsheet" problem.
- **Integration ecosystem**: Native integrations with [Sonar Software](https://sonar.software/blog/new-feature-vetro-fibermap) (BSS/OSS), [COS Systems demand aggregation](https://www.cossystems.com/knowledge-hub/news/interoperability-of-cos-systems-demand-aggregation-suite-with-vetro-fibermap/), and [CCMI](https://www.ccmi.com/vetro-fibermap-and-ccmi-announce-industry-leading-platform-integration/) for dark fiber management indicate a mature integration story for US-market OSS/BSS stacks.
- **Permitting-ready output**: Mapbook improvement to permit-quality map output is praised.

Source: [Capterra VETRO FiberMap reviews](https://www.capterra.com/p/193245/VETRO-FiberMap/reviews/), [COS Systems VETRO profile](https://www.cossystems.com/knowledge-hub/news/knowledge-hub/vetro-fibermap/).

### 11. Weaknesses (User Complaints)

- **Not a full GIS**: The most cited weakness. VETRO is not equivalent to QGIS or ArcGIS for complex geospatial editing. Vertex alignment is difficult; snapping is imprecise and may snap to unintended segments.
- **Splice depth at physical layer**: The platform models circuits and logical connectivity well but does not appear to reach the individual-strand/ribbon/tube level of detail that dedicated splice worksheet tools offer.
- **Map quality (historical)**: Earlier versions were criticized for poor map print quality. This has been improved but the Mapbook was not always permit-ready — an issue for regulatory submissions.
- **Pricing opacity**: Like OZmap, pricing is not publicly listed, requiring a sales engagement before budget evaluation.
- **US-centric**: While the platform could theoretically be used globally, its integrations, case studies, and go-to-market are exclusively US-focused. No LatAm or European market presence is documented.
- **No QR code tagging**: No documented physical asset tagging workflow (unlike OZmap's QR code system), which limits the physical-to-digital link for field crews working with passive infrastructure.

Source: [Capterra VETRO FiberMap reviews](https://www.capterra.com/p/193245/VETRO-FiberMap/reviews/).

### 12. Notable UI Screenshots

Direct access to vendor site was blocked during this research (403 errors). From available marketing descriptions and YouTube video thumbnails:

- VETRO FiberMap's hero map view (visible in webinar thumbnails, YouTube video preview frames) shows colored fiber route lines on a street map basemap, with equipment markers at key nodes. The map density is high for design-heavy views, with multiple overlapping route layers.
- The circuit editing screen (per YouTube description of [circuit editing demo](https://www.youtube.com/watch?v=zbRQJrUeZ-g)) shows a fiber path highlighted end-to-end with editing handles at splice points, enabling rerouting of circuits by dragging path segments.
- The analytics/Network Dashboard view features a polygon draw tool on the map canvas with a data result panel surfacing pass counts, address counts, and equipment tallies for the selected area.
- VETRO Mobile shows a map-first interface with floating action buttons for field actions (adding elements, changing status), consistent with Material Design conventions common in US SaaS mobile tools.

---

## Synthesis: OZmap vs. VETRO FiberMap

### Where Each Is Stronger

**OZmap is stronger for:**
- Latin American FTTH ISPs building GPON/PON access networks with lean teams and limited budgets.
- Offline-first field operations in areas with poor connectivity, via the mature OZmob companion app.
- Physical asset tagging workflows using QR codes on closure hardware.
- Deep integration with the Brazilian ISP OSS/ERP ecosystem (Voalle, IXC, SGP).
- Raw network documentation volume — registering poles, boxes, cables, OTDR equipment, splitters rapidly across large passive networks.

**VETRO FiberMap is stronger for:**
- US broadband providers navigating BEAD, RDOF, and similar funding-program documentation requirements.
- Organizations that prioritize ease of adoption across non-technical staff (marketing, leadership, field) alongside engineering.
- Collaborative design environments where multiple departments need live map access.
- Design-to-construction speed, with BOM generation and permit-quality Mapbook output.
- Integration with US-market OSS/BSS platforms (Sonar, COS Systems, CCMI).
- Splice log generation and circuit editing that ties physical fiber assets to logical service paths.

### What They Share

Both platforms are cloud-based, browser-delivered SaaS tools built specifically for fiber/FTTH network management — not adapted from general-purpose GIS. Both cover OSP documentation (poles, cables, closures, splitters), splice planning at the network documentation layer, mobile field access with some offline capability, and API-based integration with adjacent OSS/BSS systems. Neither publishes pricing. Neither provides native AutoCAD DXF/DWG interop. Neither appears to reach the per-fiber-per-ribbon-color worksheet granularity of dedicated splice CAD tools.

### What They Miss (Relative to a Dedicated Splice Tool)

Both OZmap and VETRO FiberMap treat splice planning as a network documentation function — capturing which fibers connect through which closures — rather than as a physical splicing workflow. Neither appears to generate splicer-grade, paper-ready worksheets showing per-tube, per-ribbon, and per-fiber color assignments for a specific closure with before/after comparison. Neither documents the individual mechanical splice or fusion splice event at the fiber level in a format a splicer carries to the field and marks up. This is the gap that a purpose-built splice diagram tool occupies: the physical-layer, per-event, contractor-ready documentation that bridges engineering intent and field execution.

Versioned deliverable management (redline diffs, as-built vs. design comparison) is absent from both platforms' documented feature sets. For projects requiring formal as-built deliverable packages, both tools would need to be supplemented.

---

*Research conducted May 2026. Web access to vendor sites, Capterra, G2, and TrustRadius was blocked (403) during this research session; information is drawn from search engine result excerpts, cached/indexed descriptions, partner documentation, YouTube video descriptions, and App Store listings. Claims labeled (unverified — vendor positioning) could not be confirmed via independent third-party sources.*
