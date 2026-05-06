# Legacy / AutoCAD-Lineage Network Design Tools

Products covered: netTerrain (Graphical Networks), Bentley OpenComms Designer, SmallWorld GE Communications

These three platforms represent the incumbent generation of outside-plant (OSP) network design software. They emerged from — or deeply intertwine with — CAD, GIS, and enterprise database traditions, and they remain the tools of record at many large telcos, cable MSOs, utilities, and municipalities. This document examines each in depth and closes with a synthesis comparing the legacy stack to cloud-native challengers.

---

## netTerrain OSP (Graphical Networks)

### What It Does

netTerrain OSP is a web-based fiber management and outside-plant documentation platform from Graphical Networks, a Gaithersburg, MD company. It provides GIS-enabled mapping of physical infrastructure — fiber cables, conduits, manholes, splice cans, towers, splitters, and buffers — alongside logical network views including circuit paths and port-to-port connectivity. Unlike pure CAD tools, netTerrain is a database-first system: every element is a typed object in a graph database, not just a drawing symbol. Engineers can zoom from street view to individual strand in seconds, with the map and inventory staying in sync.

netTerrain ships in three product lines: Logical (network documentation and diagramming), DCIM (data-center infrastructure management), and OSP (outside plant and fiber). A customer can purchase OSP standalone or bundle it with Logical for end-to-end inside-plus-outside-plant coverage.

[Product page](https://graphicalnetworks.com/products/netterrain-osp/) | [OSP overview](https://graphicalnetworks.com/outside-plant/)

### Pricing Model

Graphical Networks publishes partial pricing. The entry-level tier starts at approximately **$944/year** (subscription) or **$2,517 one-time** (perpetual) for up to 100 objects. A 500-object tier runs roughly **$2,944/year** or **$7,851 perpetual**. Enterprise tiers (thousands to millions of objects) require a custom quote from sales.

Both on-premises and cloud-hosted deployments are available. On-premises licenses include unlimited read-only users, while the cloud package tiers are limited to 1, 5, or 20 named users depending on the plan. Perpetual licenses include a yearly maintenance fee for support and updates (unverified — vendor positioning, exact maintenance percentage not published).

[Pricing guide](https://graphicalnetworks.com/blog-how-is-netterrain-priced-dcim-logical-osp/) | [Pricing page](https://graphicalnetworks.com/products/netterrain-pricing-and-licensing/)

### Target Customer

netTerrain OSP targets telecom operators, competitive ISPs (CLECs, fiber overbuilders), municipalities running their own fiber plant, utility companies, and network consulting firms. It is positioned as a mid-market alternative to the heavier GE Smallworld and Esri-based stacks, appealing to organizations that want a dedicated OSP tool without needing to stand up a full enterprise GIS. Reviewers frequently describe it as accessible to non-GIS specialists and easy to learn relative to legacy platforms. [Capterra](https://www.capterra.com/p/189774/netTerrain-OSP/)

### Splice-Planning Depth

netTerrain OSP models splice connectivity at the port-to-port level. Engineers can place splice can locations on the map, document which fiber strands terminate in each closure, and trace circuit paths across multiple splice points. The system handles complex topologies such as 244-strand trunk cables with multiple ring splices. Custom equipment types can be created in the catalog to represent non-standard closures or trays. However, the splice modeling is connectivity-driven rather than graphical-schematic: you get a database view of which fiber connects to which, but the tool does not auto-generate a splicer-grade graphical splice diagram showing tray positions, buffer tube colors, and ribbon assignments in a visual layout. That distinction matters for field crews expecting a printable splice diagram rather than a data export. (Unverified — based on product documentation and user review synthesis.)

### Map / GIS

The GIS engine uses OpenStreetMap as the default basemap, with support for KML and KMZ import/export. Engineers can import existing plant data from Google Earth KMZ files with a few clicks. The platform does not natively support Esri ArcGIS as a basemap or data source (it is not an ArcGIS extension). DXF/AutoCAD import is not directly supported — CAD drawings must be converted to raster (JPG) for overlay. This is a meaningful limitation when migrating legacy CAD-based plant records.

[KML/KMZ import blog](https://graphicalnetworks.com/blog-manage-your-outside-plant-with-dynamic-maps-importing-kml-kmz-maps/)

### Field Workflow

netTerrain is 100% web-based and accessible in any modern browser, on-premises or in the cloud. This means a field technician with a tablet and connectivity can look up fiber records, trace circuits, or update splice documentation in real time. However, there is no purpose-built offline mobile app with cached maps and forms for disconnected field work. The platform lacks splicer-specific feedback tools, QR code scan-to-locate workflows, or field task assignment queues. It is better described as a web-accessible engineering database than a field workforce management tool. (Unverified — vendor does not prominently advertise offline mobile capability.)

### PDF / Deliverables

netTerrain can generate network diagrams, circuit reports, and inventory exports. Users can print or export maps and logical diagrams as PDFs. There is no formalized splicer-grade deliverable workflow — no redline markup system, no version-controlled drawing set, and no automated splice-diagram generator analogous to what a telecom drafter would produce in AutoCAD. Deliverables are primarily data exports (Excel, PDF screenshots) rather than stamped engineering drawings.

### AutoCAD Interop

netTerrain does not operate inside AutoCAD and does not read or write DXF natively. It is a web application that sits alongside CAD tools rather than integrating with them. The intended migration path for customers with legacy CAD plant records is to import geographic data via KML/KMZ or Excel bulk import, then re-document the plant in netTerrain's own schema. This can be a significant data-migration effort for utilities with decades of AutoCAD drawings.

### UI/UX Layout

The interface is a modern web browser layout with a GIS map pane dominating the center of the screen. A left sidebar provides a hierarchical tree of network objects (sites, cables, closures, circuits). Clicking an element opens a properties panel on the right. Separate diagram tabs handle logical views (rack diagrams, inside-plant schematics). The overall experience is closer to a lightweight GIS web app than a heavy desktop CAD tool. Users consistently praise it as intuitive compared to Smallworld or Esri ArcFM. The map interactivity is zoom-and-pan with layered object overlays, and the catalog-based object placement means network engineers with no GIS background can become productive quickly.

### Strengths

- Accessible web UI; low GIS expertise required
- Flexible object model; custom equipment types without coding
- Dual deployment (cloud or on-premises) with transparent entry-level pricing
- Port-to-port connectivity tracing across inside and outside plant
- Rapid KML/KMZ ingestion of existing plant data
- Mid-market price point significantly below Smallworld or Esri ArcFM stacks

### Weaknesses

- No splicer-grade graphical splice diagrams (tray/buffer/ribbon layout)
- No native DXF/AutoCAD import; CAD legacy migration is manual
- No offline mobile app for field crews; browser-only in disconnected environments
- Not an Esri extension — organizations standardized on ArcGIS must maintain two platforms
- Object-count pricing model can become expensive as inventory scales
- Deliverable quality (PDF diagrams) below what an AutoCAD drafter produces for contract drawings

### Notable Screenshot Description

The canonical marketing screenshot shows a dark-themed GIS map of a metropolitan area with fiber routes drawn as colored polylines overlaid on OpenStreetMap streets. Clicking a route reveals a blue properties panel listing cable name, fiber count, and conduit path. A second screenshot shows the logical diagram view: a rack-style inside-plant schematic with patch panels, splice enclosures, and port grids, where individual ports are colored to indicate connectivity status. The zoom-from-city-to-strand transition is demonstrated in a side-by-side comparison showing the same cable first as a thick route line at city zoom, then as individual numbered fiber strands at maximum zoom.

---

## Bentley OpenComms Designer

### What It Does

OpenComms Designer is Bentley Systems' GIS-native engineering platform for planning, designing, constructing, and maintaining hybrid fiber-coax (HFC), pure fiber (FTTx), and coaxial cable networks. It is built on Bentley's MicroStation CAD engine and OpenCities Map (formerly Bentley Map), giving it the precision of a full CAD drafting tool combined with an enterprise spatial database backend (Oracle Spatial). The product suite includes independent but integrated modules: Fiber (FTTx/OSP design), Coax (HFC/CATV design), Facilities (aerial and underground structure design), and Duct (conduit and multi-duct design). A companion product, OpenComms PowerView, provides read-only viewing for non-engineering stakeholders.

Bentley markets OpenComms as "the only hybrid fiber coaxial solution that includes the productivity of CAD and all the benefits of an open enterprise GIS." The CONNECT Edition (current release) aligns OpenComms with Bentley's broader infrastructure lifecycle management (ILM) platform, connecting design data to project delivery and asset management workflows.

[Product page](https://www.bentley.com/software/opencomms-designer/) | [eBook/overview PDF](https://www.bentley.com/wp-content/uploads/eBook-OpenComms-EN.pdf) | [Bentley Docs introduction](https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v2025/Help/en/topics/339992/GUID-DB6BB673-078C-4D09-8379-9700F573F16E.html) | [OpenComms community wiki](https://communities.bentley.com/products/communications_network_design/w/communications_network_design__wiki/53726/opencomms-designer-connect-edition)

### Pricing Model

OpenComms Designer follows Bentley's standard commercial licensing model: a **perpetual license** (one-time purchase) plus an annual SELECT maintenance subscription. SELECT includes 24/7 technical support, software updates, learning resources, and license pooling (allowing the same seat to be used across multiple machines via a license server). Term (subscription) licenses are also available for organizations that prefer OpEx over CapEx.

Specific dollar amounts are not publicly listed — pricing is enterprise-quoted based on module selection, seat count, and deployment scale. Industry context suggests five-figure annual costs for mid-sized deployments, with large MSO or telco deployments reaching six figures per year inclusive of maintenance. Bentley also offers an Enterprise License Subscription (ELS) for organizations needing broad portfolio access. [SELECT overview](https://www.bentley.com/wp-content/uploads/FS-OpenComms-Designer-LTR-LR.pdf)

### Target Customer

OpenComms Designer's primary customers are cable MSOs (multiple-system operators), CATV engineers, and broadband network builders who need to design hybrid fiber-coax plant at scale. It is widely used by engineering firms that provide contract design services to cable operators. The product also covers FTTx networks, making it relevant to fiber-to-the-home overbuilders. The tool is engineered for professional network designers and CAD-trained engineers, not for generalist IT staff. Government agencies building broadband infrastructure and utilities with cable TV subsidiaries are also in the addressable market.

### Splice-Planning Depth

OpenComms Designer has genuine splice-engineering depth. The Fiber module supports:

- **Splice enclosure modeling**: a splice enclosure object houses a configurable number of trays, slots, and holders
- **Per-fiber splice assignment**: from a GUI, the designer selects which fibers to splice, the splice type (fusion, mechanical), the tray and slot position within the enclosure, and the fiber entry port for each incoming sheath
- **Automatic and manual splicing**: the tool can automatically assign splices based on fiber count and closure capacity, or the engineer can override with manual assignments
- **Loss budget calculation**: signal attenuation is computed through the fiber path including splice losses, enabling optical link validation at design time

This puts OpenComms Designer meaningfully above tools that treat splice points as simple nodes. It produces structured splice documentation — not just a map dot — that captures tray layout and connection details.

[Splice Enclosures documentation](https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-9EE55814-812F-4E18-8D02-B52890520DD7.html) | [Fiber module documentation](https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-B7335739-2C11-4C7E-8297-477F1F9CD991.html)

### Map / GIS

OpenComms Designer is a full GIS engineering environment powered by Bentley's OpenCities Map, which is built on Oracle Spatial. The spatial database stores all network geometry natively. The tool produces and consumes standard geospatial formats; output drawings are MicroStation DGN files, which can be exchanged with other Bentley products. While DXF export (for AutoCAD) is possible via MicroStation's translation capabilities, it is not the native format. There is no documented native Esri ArcGIS integration (OpenComms uses Oracle Spatial rather than an Esri geodatabase), though field data can be exchanged via standard GIS interchange formats. The map environment provides full CAD precision — snapping, dimensioning, coordinate system control — rather than the simpler zoom-and-pan of web GIS apps. (Unverified — based on product documentation and Bentley community posts.)

### Field Workflow

OpenComms Designer includes work order lifecycle management: designers create work orders, supervisors assign them, and contractors execute them. A "disconnected contractor workflow" feature allows a subset of the design data to be checked out, worked on without a live database connection, and checked back in — addressing the reality that field engineers often work in areas without reliable connectivity. This is closer to a formal engineering document management workflow than to a mobile-first splicer field tool: it is not a native mobile app with offline maps and GPS tracking, but rather a disconnected editing mode of the full desktop client. There is no mention of QR code scanning or splicer-to-engineer feedback loops in the product documentation. (Unverified — based on Bentley product marketing and documentation.)

### PDF / Deliverables

Because OpenComms is built on MicroStation, it produces full CAD-quality drawings as output — DGN files that can be printed to PDF at any scale with title blocks, legends, and standard drafting conventions. Splice schedule reports, bill-of-materials reports, cable pulling diagrams, and signal-level calculation summaries are available as structured reports. The deliverable quality matches what an engineering firm would submit for permit applications or contractor bid packages — a significant advantage over web-based tools. Version management is handled via the underlying Oracle Spatial workspace management rather than a purpose-built document versioning system.

### AutoCAD Interop

OpenComms Designer does not run inside AutoCAD; it runs inside MicroStation. Bentley and Autodesk are direct competitors, and the two ecosystems are largely separate. MicroStation can read and write DXF/DWG files for exchange purposes, but the native OpenComms data model lives in Oracle Spatial, not in AutoCAD or an Autodesk format. Organizations coming from an AutoCAD heritage must decide whether to migrate to the MicroStation/Bentley stack or to export AutoCAD geometry as DXF for import into OpenComms. For the cable MSO market — where Bentley has deep penetration — this is not a barrier because MicroStation is already the standard. For the broader telecom market, many operators still use AutoCAD-based workflows and find the Bentley ecosystem unfamiliar.

### UI/UX Layout

The OpenComms Designer interface is a classic thick-client Windows desktop application. The MicroStation window occupies most of the screen, showing a GIS map with network elements drawn as CAD objects (polylines for cables, symbols for equipment, annotation for node labels). A task-pane ribbon at the top organizes HFC, fiber, facilities, and duct design workflows. A right-hand properties panel shows attributes for the selected element. Dialog boxes handle splice configuration, work order creation, and signal calculation. The CAD lineage shows in the interaction model: precise coordinate entry, snapping, layer management, and reference file attachments are all standard MicroStation behaviors. New users with a CAD background will feel at home; users from a web GIS or SaaS background will find the UI visually dated and cognitively demanding.

### Strengths

- Full CAD-precision engineering environment with MicroStation base
- Deep splice modeling: enclosure, tray, slot, and connection type fully documented
- Integrated signal/loss budget calculation at design time
- Work order lifecycle management with disconnected contractor workflows
- CAD-quality deliverables for permitting and contract packages
- Oracle Spatial backend supports large, multi-user enterprise deployments
- Proven ROI in MSO and cable operator environments (Bentley cites 40% first-year ROI in one documented case study)

### Weaknesses

- Thick-client Windows desktop only; no browser-based or mobile access
- MicroStation ecosystem — organizations on AutoCAD face tooling barrier
- No native Esri ArcGIS integration; runs on Oracle Spatial
- Pricing opaque and enterprise-only; requires direct sales engagement
- Significant training investment required; not accessible to non-CAD users
- No splicer-grade mobile field app; disconnected mode is a desktop feature, not a purpose-built tablet workflow
- UI is visually dated relative to cloud-native competitors
- CAD operators must be licensed MicroStation users — additional seat cost

### Notable Screenshot Description

OpenComms Designer screenshots (visible in Bentley marketing PDFs) show a MicroStation workspace with a GIS aerial photo basemap overlaid with color-coded cable routes: thick blue lines for trunk fiber, thinner orange lines for distribution coax, red markers for amplifier nodes, and yellow markers for tap locations. The ribbon toolbar at top contains HFC-specific sections: "Fiber Design," "Coax Design," "Duct Design," "Work Orders." A secondary screenshot shows the splice enclosure dialog: a grid representing a 24-tray closure with individual tray cells clickable to assign fiber pairs, cable entry port selectors on the left, and a summary table showing splice type (fusion/mechanical) and loss value per connection. Signal-level diagrams in a separate pane show dBmV levels cascading downstream from the headend.

---

## GE Smallworld / GE Vernova Network Inventory (Communications)

### What It Does

Smallworld is a GIS and network inventory platform originally developed by Smallworld Systems Ltd., founded in Cambridge, England, in 1989. GE Energy acquired the company in September 2000; it has since operated as GE Digital and most recently under **GE Vernova** following GE's corporate reorganization. Smallworld is now the historical foundation for GE Vernova's "Geospatial Network Management" (GNM) portfolio, which covers electric, gas, water, and telecom networks.

For telecommunications, the relevant products are **Smallworld Network Inventory (Physical Network Inventory, or PNI)** and related modules including Physical Route Manager (PRM) and Optical Network Atlas (ONA). These collectively provide a database of all physical network assets — cables, ducts, manholes, splice closures, termination points, ODFs (optical distribution frames) — with full geographic positioning. The platform is proven at over 170 telcos worldwide according to GE Vernova marketing.

[GE Vernova GNM page](https://www.gevernova.com/software/products/geospatial-network-management-smallworld-gis) | [Wikipedia](https://en.wikipedia.org/wiki/Smallworld) | [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-g6lp2e66vx64y) | [GIS Geography review](https://gisgeography.com/ge-smallworld-gis/)

### Pricing Model

Smallworld pricing is entirely opaque in public sources. No list prices are published. It is an enterprise-only, custom-quoted platform. Independent reviewers note it is "cost expensive to support" — a characterization consistent with large-enterprise GIS platforms. Implementation costs (professional services, data migration, customization in the Magik programming language) typically dwarf license costs, with multi-year implementations common at Tier 1 operators. AWS and Azure Marketplace listings exist for SaaS versions, but pricing is listed as "contact for private offer." [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-g6lp2e66vx64y) | [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/ge_vernova.smallworld-network-inventory-for-telecom?tab=overview)

### Target Customer

Smallworld's core target is Tier 1 and Tier 2 telecom operators — national and regional carriers, large cable MSOs, and integrated utility-telecom operators. The platform has notable deployments at electric and gas utilities that also operate telecommunications networks. It scales to hundreds of millions of network objects, making it a natural fit for national-level operators with complex network topologies. AWS itself deployed Smallworld Network Inventory to manage its fiber backbone, per a GE Vernova case study. Small ISPs, municipalities, and mid-market operators are generally priced out or find the implementation complexity unjustifiable. [AWS case study](https://www.gevernova.com/software/blog/aws-deploys-smallworld-network-inventory)

### Splice-Planning Depth

Smallworld PNI models network topology at high fidelity: cables, fiber strands, splices, ODFs, and port-level connectivity are all first-class objects in the spatial database. The **Optical Network Atlas (ONA)** module auto-generates printable optical route schemes — showing ODFs, splice points, and fiber paths — directly from traced routes in the database. ONA provides: detailed descriptions of target devices on fiber routes, graphic presentation of fiber connections to and from ODFs, and "inside splice" documentation. Reports include bill of materials, splice reports, cable pulling diagrams, manhole butterfly diagrams, and trench cross-sections — a comprehensive documentation package for construction and maintenance crews. Physical Route Manager (PRM) groups fibers, ports, and splices into managed "routes" representing end-to-end logical connections, supporting service provisioning and fiber lease management. PRM, ONA, and a CATV-Design module became available on Smallworld 5.0, indicating the platform's continued investment in fiber-specific workflows as it modernizes its stack. [Globema ONA overview](https://www.globema.com/portfolio/optical-network-atlas/) | [Smallworld 5.0 module release](https://www.globema.com/learn-smallworld-pni-5-0-modules/)

### Map / GIS

Smallworld is built on its own proprietary GIS engine — a spatial relational database using the Magik object-oriented language, running on a 64-bit JVM. It does not use Oracle Spatial or an Esri geodatabase as its native store. The platform integrates with Esri ArcGIS, Hexagon Intergraph, and Pitney Bowes MapInfo for data exchange, but is not an ArcGIS extension — Esri users cannot simply open Smallworld data in ArcMap or ArcGIS Pro without an explicit integration layer. The GIS capabilities are full-featured: accurate spatial geometry, coordinate system management, spatial queries, and proximity analysis. However, user reviewers on G2 and TrustRadius note that "mapping capabilities and spatial queries from a user perspective are quite limited" compared to modern GIS tools — meaning the data model is sophisticated but the cartographic presentation and interactive map tools feel dated. [Smallworld Wikipedia](https://en.wikipedia.org/wiki/Smallworld)

### Field Workflow

Historically, Smallworld was a thick-client desktop application only — a known weakness as field mobility became expected. GE Vernova has added web client access in recent versions, and the ONA module can deliver route schemes via a web interface to improve field access. A third-party ecosystem has developed around Smallworld, with partners like Realworld Systems building the **Smallworld Design Gateway (SDG)** — a dedicated tool for managing design workflows and contractor collaboration on top of the Smallworld database. [SDG — Realworld Systems](https://realworld-systems.com/solutions/smallworld-design-gateway-sdg/) Mobile offline capability for splicers is not a native product feature; it requires third-party integration or custom development. QR codes, GPS check-in, and splicer-feedback forms are not in-box.

### PDF / Deliverables

ONA-generated route schemes are designed specifically for field use and are printable as PDFs that include full splice documentation, cable identifiers, and route diagrams. These are more structured and splicer-relevant than what most web GIS platforms produce. The bill-of-materials and splice reports have been used in construction and maintenance workflows at major operators. Versioning is handled by Smallworld's workspace management system (similar to a version-controlled database), which allows designers to work in private workspaces before committing changes to the production network record. This is a robust approach to change management, more rigorous than document-file versioning. (Unverified — based on product documentation and third-party partner materials.)

### AutoCAD Interop

Smallworld does not integrate with AutoCAD; it is an entirely separate GIS platform. Exchange with AutoCAD-based workflows requires exporting geometry to DXF or GIS interchange formats (Shapefile, GML) and importing into the other tool. Smallworld's native exchange path is with other GIS systems (Esri, MapInfo) and with OSS/BSS systems via standard network inventory APIs. The Magik programming environment is the primary customization path, and it is highly specialized — staff experienced in Magik are rare and expensive compared to AutoCAD or Python/Esri developers.

### UI/UX Layout

The classic Smallworld UI is a thick-client application that pre-dates modern web UX conventions — it was originally designed in the 1990s and has evolved incrementally. The map view is the central element, rendered in the proprietary GIS engine. Tool palettes and menus follow older desktop conventions (floating toolbars, modal dialogs). Object selection triggers an attribute form that can be very long for complex network elements. The ONA web client provides a more modern browser-based map viewer for the specific use case of optical route documentation. Reviewer consensus across G2, TrustRadius, and industry blogs is that the UI is one of the platform's biggest liabilities: steep learning curve, non-intuitive workflows for users outside the GIS/network engineering specialty, and a feeling of software designed for the tool's database power rather than for the user's daily tasks.

### Strengths

- Proven at Tier 1 scale: 170+ global telco deployments
- Deep fiber/splice/ODF data model with full port-level connectivity
- ONA auto-generates structured, printable optical route documentation
- Workspace versioning for safe multi-user design environments
- Broad utility coverage: electric, gas, water, telecom in one platform
- Proprietary GIS engine designed specifically for network topology (not a repurposed general GIS)
- Cloud/SaaS delivery now available via AWS and Azure marketplaces
- Active partner ecosystem (Globema, Realworld Systems) extends functionality

### Weaknesses

- Opaque, expensive pricing; suitable for Tier 1 only
- Magik programming language for customization — rare skills, expensive consultants
- Thick-client UI with steep learning curve; "harder to learn compared to other platforms"
- Spatial query and mapping UX described as limited by end-users despite rich backend
- No native mobile field app for splicers; field access added via web client or third-party tools
- Data capture workflows for construction as-built recording are cited as a pain point
- Long implementation timelines (multi-year for Tier 1 deployments)
- Not cost-effective for mid-market or small operators

### Notable Screenshot Description

GE Vernova's marketing materials and the GIS Geography review show a Smallworld desktop window with a dense vector GIS map showing a metropolitan area's utility and telecom infrastructure — electric lines, gas mains, and fiber routes overlaid on a street basemap, with different asset types in distinct colors. The toolbar runs across the top in a classic Windows MDI (Multiple Document Interface) layout. A secondary panel shows an ONA optical route diagram: a vertical flow-chart-style schematic with splice points as horizontal bars, fibers as thin lines connecting them, and ODF shelves at each end — the kind of diagram a field technician would carry in a binder to a splice vault. The web client screenshot shows a simplified map view with a floating route information panel — clearly a different, lighter tool than the full thick client.

---

## Synthesis: AutoCAD-Lineage Stack vs. Cloud-Native

### Where the Legacy Stack Still Wins

**Regulatory and contractual deliverables.** OpenComms Designer and Smallworld produce CAD-quality or engineering-stamped outputs that can be submitted for permits, franchising authorities, and construction contracts. Cloud-native tools typically produce PDF screenshots or data exports — usable internally but not always acceptable as formal engineering documentation.

**Scale and complexity.** Smallworld at a Tier 1 operator manages hundreds of millions of assets with workspace-versioned multi-user access, a capability that purpose-built OSP SaaS tools (netTerrain, VETRO, OZmap) have not yet matched at equivalent scale.

**Splice engineering depth.** OpenComms Designer's splice enclosure model — tray, slot, splice type, loss budget — is more engineering-rigorous than anything in the cloud-native generation today. If a design team needs to produce installation-ready splice schedules that specify exactly which fiber occupies which position in which tray, OpenComms delivers that; most cloud tools do not.

**Ecosystem lock-in (as a feature).** For cable MSOs standardized on Bentley MicroStation, and for electric utilities standardized on Smallworld, the integration with their existing workflows, training programs, and enterprise IT infrastructure is a real advantage — not just inertia.

### Where the Legacy Stack Loses

**Field mobility and splicer workflow.** None of these three tools provides a purpose-built mobile offline app for field technicians. The legacy assumption is that field data returns to the office for entry by drafters. Modern fiber overbuilders — especially RDOF- and BEAD-funded rural deployments — need splicers to enter as-built data in the field, on a tablet, at the splice vault. The legacy stack cannot serve this use case without expensive third-party augmentation.

**Onboarding speed and cost.** A cloud-native competitor can have a small ISP operational in days; Smallworld implementations run for years. OpenComms requires MicroStation-licensed CAD operators. netTerrain bridges some of this gap but still demands a data-migration project for organizations with legacy AutoCAD plant records.

**Total cost of ownership for mid-market.** Smallworld and OpenComms are priced for large enterprises. A 50-employee fiber ISP building out a rural county has no realistic path to either platform. netTerrain is accessible at the low end, but its splice documentation limitations may force operators to maintain a parallel CAD workflow for contractor drawings anyway — eliminating the productivity gain.

**Real-time collaboration and API integration.** Cloud-native tools expose REST APIs, webhooks, and integrations with modern OSS/BSS platforms. The legacy stack's integration story is typically point-to-point interfaces built in Magik or via file exchange — slower, more brittle, and requiring specialized developers.

**UI modernity.** A new hire in 2025 who has used Google Maps, Figma, and modern web apps will find Smallworld's interface jarring and netTerrain adequate but not compelling. Operator UX directly affects data quality — systems that are tedious to use produce incomplete records. Cloud-native tools with consumer-grade UX have a systematic advantage in data completeness for organizations that value field-entered as-built records over drafting-room-maintained design documents.

### Net Assessment

The legacy stack — Smallworld for Tier 1, OpenComms for MSOs, netTerrain for mid-market — remains the tool of record for large-scale, engineering-precise, contract-deliverable-grade outside plant design. It will not be displaced at Tier 1 carriers in the near term. But the growth market — rural fiber expansion under BEAD, small ISPs, municipal networks, and overbuilders who need fast network-as-a-service launches — is being captured by cloud-native challengers that prioritize field workflow, fast onboarding, and API-driven OSS integration. The legacy stack's deepest moat is splice-engineering rigor and regulatory deliverable quality; its biggest vulnerability is the last fifty meters between the design office and the splicer's hands in the field.
