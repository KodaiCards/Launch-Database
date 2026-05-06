# GIS Platforms: 3-GIS (Hexagon) and IQGeo (formerly myWorld / Critigen)

This document covers two GIS-native, enterprise-grade fiber network management platforms: **3-GIS**, now owned and operated under [Hexagon AB](https://hexagon.com/solutions/utilities-fiber-network-management), and **IQGeo**, which rebranded from myWorld in January 2019 after spinning out of the Ubisense group. Both are positioned as the system of record for OSP/ISP fiber infrastructure at telecom and utility scale. Neither targets the lightweight ISP market directly.

---

## 3-GIS (Hexagon)

### 1. What It Does

3-GIS is a web-based fiber network management platform that describes itself as "the third generation of GIS" — a deliberate pivot from paper drawings to CAD-on-desktop to collaborative browser-based editing. The product is [marketed by 3-GIS](https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis) (a Hexagon subsidiary) to telecom operators, electric utilities, gas utilities, and municipalities that need a single authoritative source of network truth across planning, engineering, construction, and operations.

The platform is built on top of [ArcGIS Enterprise](https://blog.3-gis.com/blog/how-do-esri-and-3-gis-work-together), meaning it extends Esri's geodatabase stack with telecom-specific business logic rather than replacing it. The 3-GIS server sits inside the ArcGIS Enterprise architecture and handles the domain intelligence — understanding fiber strand relationships, splice topology, and light-path continuity — that generic GIS cannot provide out of the box.

The core product, **3-GIS | Web**, combines:

- Full-editing GIS in the browser (no desktop GIS client required for most workflows)
- Light path tracing (end-to-end signal continuity across splices and connectors)
- Project tracking and milestone management
- Single-click constructible work packet generation
- Real-time as-built update and delivery

A companion app, **3-GIS | Mobile**, extends the platform to Android for field use. Hexagon has also positioned the suite under the broader [HxGN NetWorks](https://hexagon.com/products/hxgn-networks-comms) umbrella, which includes HxGN NetWorks Comms — a complementary CAD-within-GIS platform aimed at civil infrastructure records — though 3-GIS | Web remains the primary fiber-focused product.

### 2. Pricing Model

3-GIS does not publish pricing. Capterra and SaaSworthy list it as **custom quote only** with no free tier. Target contract size is enterprise — regional telcos, AltNets, and utilities — meaning deals typically involve professional services for data migration and configuration on top of licensing. The platform is described as suitable for [AltNets](https://www.3-gis.com/end-to-end-fibre-design-and-management-solutions-for-altnets) (UK alternative network operators), which implies flexibility for mid-market operators, but pricing is opaque (unverified — vendor positioning). Android mobile access is confirmed as included in the platform, suggesting mobile is not a separate SKU.

### 3. Target Customer

Stated targets are telecom service providers, electric and gas utilities, engineering firms, and municipalities. The [telecom and utility landing page](https://www.3-gis.com/telecom-and-utility-network-management-software-3-gis) covers both verticals equally, with specific messaging for AltNets. At the low end, the platform requires ArcGIS Enterprise, which itself carries significant licensing cost, placing the practical floor at regional ISP / mid-market AltNet scale (several hundred to several thousand route miles). Very small ISPs without existing Esri infrastructure are unlikely customers.

Hexagon's acquisition signals that the platform is increasingly pitched to utilities alongside telcos — the [Hexagon utilities page](https://hexagon.com/solutions/utilities-fiber-network-management) frames 3-GIS as part of a broader infrastructure asset management portfolio alongside electric, gas, and water network tools.

### 4. Splice Planning Depth

3-GIS demonstrates meaningful splice-planning depth, not just infrastructure tracking. Key features documented:

- **Connectivity modeling**: Per [3-GIS's own research](https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis), 40% of network modelers spend the majority of their time on logical connections and splicing. The product addresses this directly with a structured splice point configuration system.
- **Splice point behavior configuration**: Upfront rules define how splices behave — which strands connect to which, how trays are assigned — reducing ad hoc data entry in the field. Users can configure splice point templates for common enclosure types (unverified depth on individual tray/ribbon models — vendor positioning).
- **Splice sheets and diagrams**: The platform generates construction outputs including splice sheets and diagrams as part of work packet delivery.
- **Light path tracing**: Signal continuity can be traced end-to-end across multiple splice points, which is required for service activation and fault isolation.
- **Strand-level data model**: Data in 3-GIS is stored in standard Esri format with separate feature classes for fiber cables, structures (cabinets, manholes, poles), and splice points, with full attribute tables on each.

What is not clearly documented: individual ribbon management within a closure (multi-fiber ribbon splice tracking), nor explicit microduct connectivity modeling. These gaps may exist at the configuration layer but are not prominently featured in public materials.

### 5. Map / GIS Integration

3-GIS's GIS story is deeply Esri-native:

- **ArcGIS Enterprise required**: The platform runs on top of ArcGIS Enterprise; organizations must license and maintain an Esri stack. This is both a strength (deep geodatabase capabilities, standard coordinate reference systems, Esri Portal for collaboration) and a constraint (no Esri = no 3-GIS).
- **Reference GIS layers**: Additional Esri-compatible data layers (parcels, aerial imagery, street centerlines) can be consumed as basemap or analysis layers.
- **Coordinate systems**: Because it uses ArcGIS Enterprise, any coordinate reference system supported by Esri is supported natively — WGS84, NAD83, state plane, UTM, etc.
- **Data in Esri format**: Feature classes remain in standard Esri geodatabase format, meaning data is portable to ArcGIS Pro, ArcMap, or other Esri tools without conversion.
- **KMZ/KML/DXF**: Export capabilities are not explicitly documented in public materials. Because the underlying data is Esri geodatabase, standard Esri export tools (KML export, feature class to CAD) are theoretically available, but 3-GIS does not market these as first-class features (unverified — vendor positioning).
- **Non-Esri integration**: QGIS and Mapbox are not mentioned as supported platforms; the architecture is Esri-exclusive.

### 6. Field Workflow — Mobile, Offline, Splicer Feedback

**3-GIS | Mobile** (Android) is designed for field crews:

- Field technicians can view, edit, and create features from their mobile device, updating records to reflect real-world conditions.
- **Signal Trace** in mobile allows field technicians to see all circuits and signals on a cable, identify which customers are on each strand in an affected cable, and generate a splice report in the field.
- **Fault location**: The [mobile/fault blog post](https://blog.3-gis.com/blog/using-3-gis-web-and-mobile-to-find-a-fault-location) demonstrates that field crews can use the mobile app for fault diagnosis, correlating splice points and trace paths.
- **Offline capability**: Android mobile access implies some offline function, but the degree of offline-first support (full dataset download vs. tile caching only) is not clearly published (unverified).
- **QR codes**: Not mentioned in public materials.
- **Splicer feedback loop**: The mobile app can feed updates back to the central GIS in real time, which maintains data consistency for the engineering team.

### 7. PDF / Deliverables — Splicer-Grade Printables

3-GIS generates construction outputs as part of work packet delivery, including:

- **Splice sheets**: Tabular documentation of strand assignments at each closure
- **Splice diagrams**: Visual diagrams of connectivity within a splice enclosure
- **Complete as-builts**: Delivered after construction milestones

The quality and layout of PDF deliverables — whether they meet the density and precision expectations of a field splicer (numbered trays, ribbon colors, port-by-port strand routing) — is not described in detail in public materials (unverified — vendor positioning). Versioning and redline diff functionality are not mentioned publicly.

### 8. AutoCAD Interop — DXF/DWG Ingest, Layer Mapping

HxGN NetWorks Comms (the Hexagon platform that overlaps with 3-GIS in some deployments) is documented as delivering [CAD capabilities within the GIS environment](https://hexagon.com/products/hxgn-networks-comms), explicitly designed to replace separate CAD tools and improve design documentation. This implies DWG/DXF handling is available within the Hexagon stack.

For 3-GIS | Web specifically, AutoCAD interop is not prominently documented. Because the data store is ArcGIS Enterprise, the Esri "Feature Class to CAD" and "CAD to Feature Class" tools are available as standard Esri GP tools, which support DXF and DWG export and ingest. Layer mapping and coordinate reference system handling would follow standard Esri conventions. However, 3-GIS does not market this as a first-class 3-GIS capability (unverified — dependent on Esri toolchain).

One user review on Capterra noted that the import feature "is unreliable and cannot handle large files; if one fiber is corrupt in a file of hundreds, the entire import will fail rather than skip the corrupt fiber" — suggesting bulk data ingest (including CAD imports) has known fragility.

### 9. UI/UX Layout

3-GIS | Web presents as a browser-based GIS application with a layout consistent with enterprise telecom GIS platforms:

- **Map-centric canvas** dominating the viewport, with network features rendered as styled polylines and point symbols on an Esri basemap.
- **Left or top panel** for layer management, project selection, and feature search (standard Esri Portal-style layout).
- **Right panel or modal** for attribute editing, splice configuration, and work packet generation.
- **Esri color palette and symbology**: Because the platform sits on ArcGIS Enterprise, the default cartographic styling follows Esri conventions — blue/orange/grey utility symbology with standard GIS icon sets.
- **Typography**: Esri's default sans-serif stack (typically Open Sans or similar).
- No dark mode or modern SaaS aesthetic is evident; the UI reflects the enterprise GIS heritage.

User reviews describe the interface as "intuitive and easy to use" for core GIS tasks, with the connectivity manager noted as accessible to users without prior fiber connectivity experience.

### 10. Strengths (Per Reviews and Public Record)

- [Capterra rating: 4.3/5](https://www.capterra.com/p/135010/3-GIS-Network-Solutions/) based on 10 reviews
- Deep integration with Esri ecosystem — data remains in standard format, usable by ArcGIS Pro/ArcMap
- Splice workflow configuration upfront reduces field data entry errors
- Light path tracing end-to-end is a genuine differentiator over basic OSP tools
- Work packet generation streamlines construction handoff
- Broad vertical reach: telco + electric + gas + municipal in one platform
- Actively developed under Hexagon with enterprise support pedigree

### 11. Weaknesses (Per Reviews and Public Record)

- **Esri lock-in**: Requires ArcGIS Enterprise licensing — significant cost overhead before 3-GIS adds value
- **Import reliability**: Bulk import reportedly fails on any corrupt record rather than skipping, making large data migrations risky
- **Performance**: Users report the platform runs slowly and can be difficult to navigate
- **Bulk attribute editing**: Limited compared to working directly in ArcGIS attribute tables
- **Symbology management**: Switching between different network views requires creating separate togglable layers, not a single dynamic renderer
- **No transparent pricing**: Custom quote only; no public tiers for smaller operators
- **Mobile depth unclear**: Android app exists but offline-first depth and QR/barcode workflows are not documented
- **No QGIS/Mapbox path**: Organizations not already on Esri cannot adopt 3-GIS without a major platform investment

### 12. Notable Screenshots Described

**Screenshot A — 3-GIS | Web Map Canvas** (from vendor marketing materials): A browser-based map view showing a suburban fiber network. Route cables are rendered as colored polylines (dark blue for buried cable, orange for aerial) on an Esri Streets basemap. Left sidebar shows a layer tree with categories for Cables, Structures, Splice Points, and Work Areas. A selected splice closure is highlighted with a callout bubble showing closure ID, address, and strand count. The visual density is consistent with enterprise GIS — not simplified for field use.

**Screenshot B — 3-GIS | Mobile Fault Trace** (from blog post on fault location): An Android tablet view showing a network map with a traced signal path highlighted in a contrasting color (likely red or yellow) from a reported fault location back through splice points to a hub. The mobile UI uses larger touch targets than the web version. A side panel lists the affected circuits and customer IDs on the traced cable.

---

## IQGeo (formerly myWorld, formerly Critigen lineage)

### 1. What It Does

IQGeo is a Cambridge, UK-based geospatial software company founded in 1994. The company has operated under several identities: originally part of the Ubisense group, it spun out the geospatial software division as myWorld, then [rebranded to IQGeo in January 2019](https://www.iqgeo.com/news/iqgeo-launched-accelerate-global-growth-myworld-software) following the sale of the Ubisense RTLS/SmartSpace division. The connection to "Critigen" appears to relate to a North American systems integration and GIS services arm that has since been absorbed into the IQGeo product brand (unverified — the Critigen brand is not prominently documented in current IQGeo public materials).

IQGeo describes itself as an [AI-powered geospatial network management platform](https://www.iqgeo.com/) targeting telecoms and utilities. Its two primary products for fiber are:

- **Network Manager Telecom**: The core system of record for fiber, copper, and coaxial networks — covering planning, design, construction, and operations. Available in three editions: Insight, Professional, and Enterprise.
- **Workflow Manager**: Launched July 2024, a [field operations platform](https://www.iqgeo.com/news/iqgeo-transforms-fiber-network-planning-and-operations-with-new-workflow-manager-software) that integrates with Network Manager Telecom to manage field crews, work orders, splice tasks, and as-built capture through tablets online and offline.

A third product, **Network Adapter**, provides bidirectional integration between Network Manager and OSS/BSS systems (billing, service activation, workforce management). IQGeo also maintains a partnership with [FME by Safe Software](https://fme.safe.com/partners/iqgeo/) for data transformation and migration.

The platform has over [100,000 active software users](https://www.iqgeo.com/) globally, with customers including major utility providers, leading telecom network operators, and two of the top three US cable companies.

### 2. Pricing Model

IQGeo does not publish list pricing. The platform uses a **tiered edition model**:

- **Insight**: Entry-level, suited to private fiber network owners and smaller operators
- **Professional**: Mid-market broadband and telecom operators
- **Enterprise**: Large-scale operators requiring deep OSS/BSS integration, custom workflows, and enterprise support

All editions scale up seamlessly per IQGeo's positioning, though exact upgrade triggers (user count, network size, feature gates) are not published. Custom quotes are required. TrustRadius and SoftwareSuggest confirm enterprise pricing with no free trial. The value proposition centers on ROI from reduced manual processes — IQGeo and partners claim [90% reduction in network design time and build costs](https://nerdisa.com/iqgeo/) (unverified — vendor positioning; figure appears in a review article citing IQGeo marketing).

### 3. Target Customer

IQGeo targets [mid-market to large enterprise](https://bestfibernetworkmanagementsoftware.com/read-more/5) telecom and utility operators:

- Regional and national fiber network operators building out FTTH/FTTB
- Cable operators managing hybrid fiber-coax plant
- Electric and gas utilities with fiber for grid communications
- Government and transportation networks

The platform is described as over-specified for small ISPs. The Enterprise edition's OSS/BSS integration capabilities (SAP, workforce management, billing) point to Tier 2/3 carriers and regional telcos as the sweet spot. IQGeo's [North American customer base](https://www.iqgeo.com/) is particularly strong in utilities.

### 4. Splice Planning Depth

IQGeo Network Manager Telecom demonstrates deep splice-planning capability:

- **Strand-level tracing**: The system can [trace fiber and coax networks down to individual strands, splices, and connections](https://www.iqgeo.com/products/network-manager-telecom).
- **Splice closure and patch panel modeling**: Users can model down to splice closures, patch panels, and strand-level detail.
- **Automated splice scheme generation**: The platform [automatically generates graphical splice schemes, tabular splice reports, microduct connectivity reports, and drawings](https://www.iqgeo.com/products/network-manager-telecom), saving time from manual updates.
- **Microduct connectivity**: Explicit microduct connectivity reports and diagrams are generated, indicating blow-fiber topology is a first-class object.
- **Flexible design rule options**: Users control splice locations, cabinet connectivity, and duct assignments through configurable rules — more granular than a simple connectivity graph.
- **Strand-level attributes**: Rich metadata can be attached to individual strands (status, glass type, OSS system ID) for OSS/BSS integration.
- **AI-assisted as-built validation**: Workflow Manager's [visual AI](https://www.iqgeo.com/news/iqgeo-transforms-fiber-network-planning-and-operations-with-new-workflow-manager-software) analyzes field photos of cabinet installations and fiber splicing to automatically validate quality and update the network model — a differentiating capability not present in 3-GIS's public documentation.

What is less clear from public sources: explicit tray-by-tray ribbon management within a multi-ribbon closure (i.e., tray 1 = ribbons 1–4, tray 2 = ribbons 5–8). IQGeo documents strand-level and closure-level detail but does not prominently feature individual ribbon/tray mapping in marketing materials (unverified — may exist at configuration layer).

### 5. Map / GIS Integration

IQGeo's GIS story is architecture-agnostic compared to 3-GIS:

- **Own geospatial engine**: IQGeo runs its own geospatial platform (descended from myWorld's native geospatial stack), not dependent on ArcGIS Enterprise. This is a significant architectural difference from 3-GIS.
- **Open APIs**: Network Manager integrates with GIS, CAD, SAP, and other platforms through [open APIs](https://www.iqgeo.com/products/network-manager-telecom), enabling data exchange without duplication.
- **FME integration**: The [IQGeo–FME partnership](https://fme.safe.com/partners/iqgeo/) enables ETL between IQGeo and hundreds of GIS, CAD, and database formats (Esri Shapefile, GeoDatabase, KML, DXF, DWG, PostGIS, etc.).
- **Esri interop**: IQGeo can consume and publish Esri-format data via FME and open APIs, but is not built on ArcGIS Enterprise — organizations with existing Esri investments can integrate rather than replace.
- **Coordinate systems**: As a GIS-native platform, IQGeo supports standard CRS transformations (WGS84, NAD83, ETRS89, etc.) though specific documentation is not in public marketing materials.
- **KMZ/KML/DXF**: Via FME, IQGeo can ingest and export to standard exchange formats. Direct native KML/DXF export is not clearly documented as a first-class feature separate from FME (unverified).

### 6. Field Workflow — Mobile, Offline, Splicer Feedback

IQGeo's field story is among the strongest in the category:

- **Offline-first tablet app**: [Field staff can download their work area, update records offline, and sync changes back automatically](https://www.iqgeo.com/products/network-manager-telecom). This is a genuine offline-first architecture, not just tile caching.
- **Workflow Manager (2024)**: An [easy-to-use solution on tablets](https://www.iqgeo.com/news/iqgeo-transforms-fiber-network-planning-and-operations-with-new-workflow-manager-software) for field crews and contractors to execute digital project workflows both online and offline. The app provides phase-specific work orders (e.g., OTDR testing, fiber splicing, cabinet installation) with milestone-based ticket generation.
- **Redlines in the field**: Construction crews can [redline in the field during actual construction](https://www.iqgeo.com/news/iqgeo-transforms-fiber-network-planning-and-operations-with-new-workflow-manager-software). Photos and redlines are captured in the mobile app.
- **Visual AI validation**: Real-time AI photo analysis validates field work (cabinet installation, splice quality) automatically, updating the network model without manual data entry.
- **As-built digital capture**: Crews document as-built activities as they occur through digital data entry, media attachments, and automated network model updates — eliminating paper-based processes.
- **Splice-specific workflows**: Splicing tasks are managed through structured work orders that span construction milestones, with each milestone using its own ticket generation rules for phase-specific splice tasks.
- **QR codes**: Not mentioned in public materials.
- **Splicer feedback loop**: The Workflow Manager → Network Manager integration creates a real-time splicer feedback loop — splice work documented in the field immediately updates the network model of record.

### 7. PDF / Deliverables — Splicer-Grade Printables

IQGeo is notably stronger in documented deliverable output than 3-GIS:

- **Graphical splice schemes**: Automatically generated visual diagrams of splice connectivity (unverified depth on fiber-tray-ribbon granularity).
- **Tabular splice reports**: Structured tables of strand assignments per closure.
- **Microduct connectivity reports**: Dedicated output type for microduct/blown-fiber topology.
- **Drawings**: Automated drawing generation from the network model.

Versioning, redline diffs, and PDF version control are not explicitly documented in public materials. The field redline capability in Workflow Manager implies some form of markup-vs-plan comparison, but formatted PDF deliverables for redline review are not described (unverified).

### 8. AutoCAD Interop — DXF/DWG Ingest, Layer Mapping

- **FME-based interop**: Via the IQGeo–FME partnership, DXF and DWG files can be ingested and exported with layer mapping and CRS transformation as FME workflow steps.
- **Open API**: CAD data can be pushed or pulled via IQGeo's REST APIs.
- **Native CAD import**: Not documented as a first-class native feature in Network Manager Telecom's UI — CAD interop appears to be an integration/ETL task rather than a point-and-click import (unverified).
- **COS Systems integration**: A [native bidirectional integration with COS Business Engine](https://www.cossystems.com/knowledge-hub/news/iqgeo-cos-integration/) is available, illustrating IQGeo's broader integration model for OSS/BSS systems, which extends to CAD-origin data via FME.

### 9. UI/UX Layout

IQGeo Network Manager Telecom presents a modern GIS application aesthetic:

- **Map-centric layout**: Large map canvas with the network rendered over configurable basemaps (Esri, OpenStreetMap, or custom tile services are plausible given the open architecture).
- **Left navigation panel**: Asset search, layer control, and project/work order navigation.
- **Contextual right panel**: Feature attribute editing, splice configuration, and task assignment.
- **Mobile-first design philosophy**: The tablet UI in Workflow Manager uses large touch targets, swipe-based navigation, and simplified data entry — clearly designed for field use rather than adapted from a desktop GIS.
- **Color palette**: IQGeo marketing materials show a dark navy/teal brand palette. The application UI uses a lighter, neutral background with colored network overlays (orange/yellow for active cables, grey for passive routes) per industry convention.
- **Typography**: Clean, modern sans-serif (appears to be a custom or common SaaS sans-serif stack).
- **Dashboard and reporting views**: Workflow Manager includes project progress dashboards for construction managers tracking milestone completion across field crews.

User reviews note the platform as user-friendly with smart workflows, and field crews are described as empowered rather than burdened.

### 10. Strengths (Per Reviews and Public Record)

- [G2 rating: 4.7/5](https://www.g2.com/products/3-gis-web/pricing) (strong for an enterprise niche product)
- Architecture-agnostic: not locked to ArcGIS Enterprise, lowering total cost of ownership for non-Esri shops
- Genuine offline-first mobile for field crews
- Workflow Manager with AI photo validation is a differentiated 2024 capability
- Automated splice scheme and microduct report generation
- Three-edition model allows entry at smaller scale with upgrade path
- Strong OSS/BSS integration story (Network Adapter, FME, open APIs)
- 100,000+ active users across fiber, telecom, and utility verticals
- Responsive support consistently noted by reviewers

### 11. Weaknesses (Per Reviews and Public Record)

- **Over-spec for small ISPs**: Analytics and data management depth exceeds what smaller or less complex networks need
- **Localized support gaps**: Global reach may mean less responsive local support in some regions (per review aggregators)
- **Data remediation prerequisite**: Organizations with fragmented or paper-based GIS records face significant cleanup work before IQGeo delivers full value; implementation timelines can extend considerably
- **No published pricing**: Custom quote only — procurement process is opaque for budget planning
- **SCADA/ADMS gap**: Network Manager is not a real-time control system; SCADA/outage management requires separate specialist tools
- **CAD import UX**: DXF/DWG ingest is not a native point-and-click workflow; FME or API integration required
- **Limited public reviews**: As a niche enterprise product, independent review data is thin — G2 and Capterra aggregate counts are low compared to horizontal SaaS tools

### 12. Notable Screenshots Described

**Screenshot A — Network Manager Telecom Map View** (from IQGeo product video): A browser-based GIS view showing a dense urban fiber network. Active fiber routes are rendered as colored polylines on a light grey basemap. A selected splice closure callout shows the closure name, location, and a summary of strand utilization (e.g., "24/96 strands in use"). The right panel shows a structured attribute form for the closure with fields for closure type, installation date, and assigned contractor.

**Screenshot B — Workflow Manager Tablet Field View** (from Workflow Manager launch materials): A tablet interface showing a work order for a splice task at a specific closure location. The screen is divided into a map (top half, showing route to the closure) and a task checklist (bottom half) with photo upload prompts for each splice milestone. An AI validation indicator shows a green checkmark for a completed cabinet installation photo. The typography is large and touch-friendly; the overall aesthetic is more consumer-app than enterprise GIS.

**Screenshot C — Automated Splice Scheme Diagram** (from IQGeo product documentation): A graphical splice scheme showing fiber strand assignments within a closure, rendered as a structured grid. Rows represent trays, columns represent input/output fiber positions, with color coding for different cable sheaths entering the closure. A tabular summary below the diagram lists strand-level continuity from input cable to output cable.

---

## Synthesis: Where Each Is Strong, What They Share, What They Miss

### Where 3-GIS Is Strong

3-GIS wins in organizations already running ArcGIS Enterprise. The platform's data model is standard Esri — no conversion, no lock-in beyond what ArcGIS Enterprise already imposes — and existing GIS staff understand the data structures immediately. Light path tracing and splice point configuration templates represent genuine depth for telcos and utilities that need signal continuity visibility. The Hexagon parent adds enterprise credibility and integration with HxGN NetWorks Comms for civil infrastructure records.

### Where IQGeo Is Strong

IQGeo leads on field operations depth. The Workflow Manager with offline-first tablet support and AI photo validation is a 2024 differentiator that 3-GIS does not publicly match. Automated splice scheme generation and microduct connectivity reports are more prominently documented capabilities. The three-edition tiering gives operators a lower entry point without the ArcGIS Enterprise overhead. For organizations without an existing Esri investment, IQGeo is the more accessible path.

### What They Share

Both platforms are enterprise-only, custom-priced, and not suitable for ISPs under approximately 500 route miles without significant IT infrastructure investment. Both provide strand-level connectivity modeling, field mobile apps, work order or work packet management, and integration with OSS/BSS systems. Both treat the GIS map as the primary interface and require professional services for deployment and data migration. Neither publishes transparent pricing tiers.

### What They Miss

Neither platform prominently documents tray-by-tray ribbon management within multi-ribbon closures as a marketed first-class feature — a gap relative to purpose-built splice documentation tools. Redline PDF diff workflows (comparing design drawings to as-built) are mentioned in field capture but not documented as a deliverable format with version control. QR code scanning for field asset identification is absent from both platforms' public documentation. Neither offers a self-service free trial or sandbox — the barrier to evaluation is high relative to modern SaaS alternatives in the space.

---

## Sources

- [3-GIS Fiber Network Management Software](https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis)
- [3-GIS | Web product page](https://www.3-gis.com/software/3-gis-web)
- [3-GIS Telecom and Utility Network Management](https://www.3-gis.com/telecom-and-utility-network-management-software-3-gis)
- [3-GIS AltNet solutions page](https://www.3-gis.com/end-to-end-fibre-design-and-management-solutions-for-altnets)
- [3-GIS FAQ](https://www.3-gis.com/faq)
- [3-GIS Mobile](https://www.3-gis.com/software/3-gis-mobile)
- [3-GIS Blog: How Esri and 3-GIS Work Together](https://blog.3-gis.com/blog/how-do-esri-and-3-gis-work-together)
- [3-GIS Blog: Connectivity Modeling](https://blog.3-gis.com/blog/how-3-gis-web-makes-fiber-network-connectivity-modeling-easier)
- [3-GIS Blog: Using Web and Mobile for Fault Location](https://blog.3-gis.com/blog/using-3-gis-web-and-mobile-to-find-a-fault-location)
- [Hexagon Utilities and Fiber Network Management](https://hexagon.com/solutions/utilities-fiber-network-management)
- [HxGN NetWorks Comms — Hexagon](https://hexagon.com/products/hxgn-networks-comms)
- [HxGN NetWorks Portfolio](https://hexagon.com/products/hxgn-networks-portfolio)
- [Advanced Fiber Design with Hexagon Solutions](https://aliresources.hexagon.com/network-management-with-hxgn-networks/advanced-fiber-design-with-hexagon-s-solutions)
- [3-GIS Capterra Reviews](https://www.capterra.com/p/135010/3-GIS-Network-Solutions/reviews/)
- [3-GIS SourceForge Product Page](https://sourceforge.net/software/product/3-GIS/)
- [3-GIS on Slashdot](https://slashdot.org/software/p/3-GIS/)
- [IQGeo Homepage](https://www.iqgeo.com/)
- [IQGeo Network Manager Telecom](https://www.iqgeo.com/products/network-manager-telecom)
- [IQGeo Network Manager Telecom Enterprise Edition](https://www.iqgeo.com/product/network-manager-telecom/enterprise-edition)
- [IQGeo Network Manager Deployment Options](https://www.iqgeo.com/products/network-manager-telecom/deployment-options)
- [IQGeo Fiber Network Planning and Design Solutions](https://www.iqgeo.com/solutions/fiber-network-planning-design-software)
- [IQGeo Optimized Fiber Network Planning](https://www.iqgeo.com/telecom-use-cases/optimized-planning)
- [IQGeo Workflow Manager Launch News](https://www.iqgeo.com/news/iqgeo-transforms-fiber-network-planning-and-operations-with-new-workflow-manager-software)
- [IQGeo Workflow Manager — Cambridge Network Coverage](https://www.cambridgenetwork.co.uk/news/iqgeo-transforms-fiber-network-planning-and-operations-new-workflow-manager-software)
- [IQGeo June 2025 Product Release Roundup](https://www.iqgeo.com/blog/whats-new-at-iqgeo-product-release-roundup-june-2025)
- [IQGeo August 2023 Product Release Roundup](https://blog.iqgeo.com/whats-new-at-iqgeo-product-release-roundup-august-2023)
- [IQGeo Relaunch from myWorld — Announcement](https://www.iqgeo.com/news/iqgeo-launched-accelerate-global-growth-myworld-software)
- [IQGeo Build Management for Fiber Networks](https://www.iqgeo.com/solutions/construction-management-for-fiber-networks)
- [IQGeo Platform Overview Video](https://video.iqgeo.com/iqgeo-platform-product-overview-1)
- [IQGeo Network Manager Telecom Product Overview Video](https://video.iqgeo.com/network-manager-telecom-product-1)
- [IQGeo Editions Explained Video](https://video.iqgeo.com/network-manager-telecom-editions-1)
- [IQGeo + Comsof Fiber Integration Video](https://video.iqgeo.com/iqgeo-network-manager-telecom-and)
- [IQGeo + COS Systems Integration](https://www.cossystems.com/knowledge-hub/news/iqgeo-cos-integration/)
- [IQGeo + FME Partnership](https://fme.safe.com/partners/iqgeo/)
- [IQGeo SourceForge Reviews](https://sourceforge.net/software/product/IQGeo/)
- [IQGeo Capterra India](https://www.capterra.in/software/218279/iqgeo)
- [IQGeo Fiber Broadband Association — Editions Announcement](https://fiberbroadband.org/2023/08/01/fiber-operators-can-start-fast-and-easily-scale-up-with-new-iqgeo-software-editions/)
- [IQGeo GISUser Relaunch Article](https://gisuser.com/2019/01/iqgeo-launched-to-accelerate-global-growth-of-myworld-software/)
- [Splice.me: GIS vs NoGIS Fiber Mapping](https://splice.me/blog/gis-vs-nogis-fiber-mapping-and-cable-management/)
- [Splice.me: Fiber Network Management Software Guide](https://splice.me/blog/fiber-network-management-software-solutions-how-to-streamline-your-fiber-optic-network-in-2024/)
- [Best Fiber Network Management Software: IQGeo Review](https://bestfibernetworkmanagementsoftware.com/read-more/5)
- [Nerdisa IQGeo Review 2025](https://nerdisa.com/iqgeo/)
- [Esri Community: Importing 3-GIS Data into ArcGIS Pro](https://community.esri.com/t5/telecommunications-questions/importing-3gis-data-into-arcgis-pro/td-p/1330812)
