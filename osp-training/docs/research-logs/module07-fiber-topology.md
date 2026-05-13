# Module 7 — Fiber Topology & Matrix research log

> Curriculum Architect (Agent A) research notes for the Fiber Topology &
> Matrix module: managing nodes and connections (replacing manual Excel
> trackers), splice matrix tracking, fiber pathing, color codes (TIA-598),
> tube/buffer/strand identification, "where does fiber 73 go?" workflows,
> industry tools (3-GIS, VETRO FiberMap, IQGeo, Bentley OpenComms Designer,
> ARAMIS, Synchronoss Spatial Suite), and the spreadsheet/Visio
> documentation that this platform aims to obsolete.
>
> Editorial premise of this module: the gap is enormous. The textbook
> ("use a fiber-management system") and the field ("we have a shared
> drive of 32 Excel files and a folder of Visio files we update once a
> month") are not the same job. A training platform has to teach both —
> and has to acknowledge that for most small-to-mid splicers and outside
> contractors, Excel is still the system of record.

---

## 1. Standards & official sources consulted

### 1.1 TIA-598 fiber color code

- **ANSI/TIA-598-D** (current revision; -C is widely cited because -D was
  re-affirmed without major numerical change to the 12-color sequence):
  Optical fiber cable color coding for fibers, buffered fibers, fiber
  units, and groups within OSP and premises cables.
- **The 12-color sequence (positions 1–12), republished by virtually every
  fiber vendor:**
  1. Blue
  2. Orange
  3. Green
  4. Brown
  5. Slate (gray)
  6. White
  7. Red
  8. Black
  9. Yellow
  10. Violet
  11. Rose (pink)
  12. Aqua
  - Status: VERIFIED-via-secondary-source. Republished at the FOA tech
    page <https://www.thefoa.org/tech/ColCodes.htm>, the BradyID guide
    <https://www.bradyid.com/resources/fiber-optic-color-code>, the
    Broadband Library
    <https://broadbandlibrary.com/decoding-the-fiber-optic-color-codes/>,
    and the Wikipedia summary <https://en.wikipedia.org/wiki/TIA-598-C>.
    All four show the identical sequence; we are confident enough to
    teach this without quoting the standard text.
  - The FOA reference card at thefoa.org/tech/ColCodes.htm currently
    blocks raw HTTP fetches but the sequence is reproduced widely; we
    cross-confirmed via Wikipedia (TIA-598-C) and the Brady reference
    page.

- **Cables larger than 12 fibers**: the same 12 colors repeat in the
  next group, with each fiber additionally **striped or tracer-marked**
  to identify the *group*. Common implementations:
  - For a 24F single-tube cable, fibers 13–24 are the same 12 colors but
    striped (e.g., fiber 13 = blue with a black tracer, fiber 14 = orange
    with a black tracer ...).
  - For multi-tube cable, the **buffer tubes** themselves follow the
    same 12-color sequence, and within each tube the fibers are colored
    1–12.
  - Status: VERIFIED-via-secondary-source. FOA, Brady, Wikipedia all
    state this; vendor practice (Corning, OFS, Prysmian) follows it.
  - **Vendor exception alert:** Some vendors and some legacy military /
    federal cables use other schemes. The exam-correct answer is
    TIA-598; the field-correct answer is "look at the cable's printed
    legend or the manufacturer's spec sheet."

- **Jacket color codes** (TIA-598 specifies the *premises* cable jacket
  color for non-military applications):
  - **Yellow** — single-mode (OS1, OS2). Status: VERIFIED-via-secondary-source.
  - **Orange** — multimode 62.5/125 (OM1) or 50/125 (OM2). Status:
    VERIFIED-via-secondary-source.
  - **Aqua** — laser-optimized 50/125 (OM3, OM4). Status:
    VERIFIED-via-secondary-source.
  - **Lime green** — OM5 (wideband multimode). Status:
    VERIFIED-via-secondary-source via vendor catalogs (Corning,
    CommScope) — TIA-598 was updated to add OM5; the published color
    is lime green / "ericalime."
  - The Wikipedia TIA-598 page summarizes this; vendor product pages
    at Corning and CommScope confirm.

- **Connector boot/housing colors** (TIA-568 references TIA-598-style
  conventions):
  - **Beige** = OM1 multimode.
  - **Black** = OM2 multimode.
  - **Aqua** = OM3 / OM4 multimode.
  - **Lime green** = OM5.
  - **Blue** = single-mode UPC.
  - **Green** = single-mode APC.
  - Status: VERIFIED-via-secondary-source. Republished at FOA and Brady
    references; field practice is fairly consistent except in cheap
    imported assemblies that use the wrong jacket color.

### 1.2 Splice matrix conventions (industry, not formal standard)

- A "splice matrix" or "splice sheet" is a table mapping a **fiber
  position in cable A** to a **fiber position in cable B** at a splice
  point. There is no ANSI/TIA standard that prescribes the layout. Common
  industry layouts:
  - **Row-per-fiber** with columns for tube/strand/color/destination.
  - **Two-cable side-by-side** layout where the row number itself is the
    splice tray position.
  - **Splice closure cassette layout** drawings that match the physical
    tray order.
- Vendor splice closure manuals (Commscope FOSC, Tyco/CommScope, Sumitomo,
  Fujikura) ship pre-printed splice sheets that crews fill out by hand
  during the splice. These hand-marked sheets are the only contemporaneous
  record of "what fiber went where" in many builds.
- Status: VERIFIED-via-secondary-source via splice.me's industry
  historical post,
  <https://splice.me/blog/origins-of-fiber-optic-splice-sheets-part-1/>.

### 1.3 Industry topology / fiber-management tools

- **VETRO FiberMap** — cloud GIS-based fiber mapping, splice diagrams,
  inventory, and field collection. <https://vetrofibermap.com/>. Strong
  in muni/co-op fiber and Tier-2/3 ISPs.
- **3-GIS** — fiber design + lifecycle management; harmonizes copper and
  fiber; multi-product suite (Web, Mobile, Admin, CAD, Diagramming,
  Prospector). <https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis>.
  Heavy use among incumbent telcos and large utility builds.
- **IQGeo Network Manager Telecom** — geospatial, "digital twin" of fiber
  network with planning/design/build/operate lifecycle.
  <https://www.iqgeo.com/blog/exploring-osp-a-guide-to-outside-plant-fiber-optic-networks>.
  Common at Tier-1 carriers; expensive.
- **Bentley OpenComms Designer** — successor to Bentley Fiber, Bentley
  Coax, Bentley Inside Plant, and Expert Designer for Communications.
  <https://www.bentley.com/software/opencomms-designer/>; user docs at
  <https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-DB6BB673-078C-4D09-8379-9700F573F16E.html>.
  CAD-/MicroStation-based; popular in cable MSO and large utility
  programs that already standardized on Bentley.
- **Synchronoss Spatial Suite** (formerly Intec/Setics Sttar; portfolio
  has shifted ownership multiple times). Status: VERIFIED-via-secondary-source
  through industry directories like
  <https://wifitalents.com/best/fiber-mapping-software/>; product line
  has been re-branded several times — UNVERIFIED on which exact product
  is currently sold under the Synchronoss name in 2026; we should
  confirm before quoting features.
- **ARAMIS** (now part of Render Networks / used to be sold as a
  build-management tool by ARAMIS Tech) — focuses on construction
  workflow and as-built capture more than topology engineering.
  Verification of current ownership: UNVERIFIED-needs-paid-doc; vendor
  page references found but year unclear.
- **netTerrain OSP** (Graphical Networks) — DCIM-adjacent OSP tool with
  splice diagram generation. <https://graphicalnetworks.com/outside-plant/>.
- **Splice.me** — purpose-built splice diagram & matrix tool, openly
  positioned as "the spreadsheets-and-suffering replacement."
  <https://splice.me/>.
- **OZmap** — Brazilian-origin fiber mapping & splice diagramming
  platform. <https://ozmap.com/en/>.
- **CircuitVision cvFiber** — fiber-optic mapping, splice, inventory.
  <https://www.circuitvision.com/products/cvfiber/>.
- **Crescent Link / CrescentLink Geograph**, **Patch Manager**,
  **Render Networks**, **Biarri Networks**, **OSP Insight** — also
  appear in the industry comparison roundups (Splice.me's blog,
  ZipDo Software Advice, MAP-IT-RIGHT 2026 review).

---

## 2. Forums & community practice

- **Slashdot — "Best Software For Tracking Fiber Optic Networks?"**,
  <https://tech.slashdot.org/story/13/06/08/1627245/ask-slashdot-best-software-for-tracking-fiber-optic-networks>.
  2013 thread, but the answers are durable: most respondents say "we
  use Excel and Visio." A few mention IBM Maximo, Smallworld (now part
  of GE/IQGeo), and homegrown databases. Field-practice insight:
  every commenter who works at a small ISP or muni says they tried a
  vendor product and went back to Excel.
- **Splice.me — "Origins of Fiber Optic Splice Sheets, Part 1"**,
  <https://splice.me/blog/origins-of-fiber-optic-splice-sheets-part-1/>.
  History of the hand-drawn splice sheet, the role of the vendor closure
  documentation, and how those sheets became the "row-per-fiber" Excel
  templates used today. The article describes a real mid-size ISP with
  **16 Excel files in the "north" folder, 6 in "south,"** each
  representing a fiber cluster, each cluster's nodes on separate tabs.
  This is a plausible field reality of a working network.
- **Splice.me — "Problems of fiber splice documentation management in
  different software"**,
  <https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/>.
  Concrete pain points called out: (a) Excel can't represent the
  topology of a Y-splice or a 1×8 splitter; (b) Visio loses backwards
  links when a stencil is copied; (c) AutoCAD splice diagrams are
  drawn but not searchable; (d) handing off to the field tech means
  printing 30 PDFs, and the hand-marked corrections never make it
  back to the master.
- **Cabling Installation & Maintenance — "Manage your fiber-optic
  network using software"**,
  <https://www.cablinginstall.com/cable/fiber/article/16465451/manage-your-fiber-optic-network-using-software>.
  Industry editorial; reasonable summary of what the major tools do
  but treats vendor claims at face value.
- **Cabling Installation & Maintenance — "Simple Excel spreadsheet
  program can help with cable management"**,
  <https://www.cablinginstall.com/home/article/16467488/simple-excel-spreadsheet-program-can-help-with-cable-management>.
  This is the editorial that *justifies* the gap. A trade publication
  whose readers run real networks publishes a how-to on managing fiber
  in Excel. The gap between "use a topology engine" and "use Excel" is
  not the curriculum's invention — it is documented in the trade press.
- **Reddit r/fiberoptics** and **r/networking** discussions of fiber
  documentation: most threads since 2018 land on the same answer —
  small contractors use Excel + Visio + Bluebeam, mid-sized ISPs may
  buy VETRO or netTerrain, Tier-1 carriers buy IQGeo or Bentley.
  Specific URLs intentionally omitted here because Reddit search
  results vary by date and the curriculum should not pin to a single
  thread; a representative thread snapshot is preserved in the
  Splice.me history post.
- **Splice.me — "Fiber Mapping: How to Make a Fiber Network Map
  Yourself"**,
  <https://splice.me/blog/fiber-mapping-how-to-make-a-fiber-network-map/>.
  Walks through the Excel-to-tool migration pain in concrete terms.
- **VETRO — "What is OSP? An Introduction to Outside Plant Fiber Optic
  Network Management"**,
  <https://vetrofibermap.com/what-is-osp-an-introduction-to-outside-plant-fiber-optic-network-management/>.
  Vendor-ish but a fair primer.
- **IQGeo blog — "Exploring OSP — A guide to Outside Plant fiber optic
  networks"**, <https://www.iqgeo.com/blog/exploring-osp-a-guide-to-outside-plant-fiber-optic-networks>.

---

## 3. Field vs. textbook gaps (with concrete examples)

1. **"Use a fiber management system."** Textbook (RCDD/OSP study guides):
   "design and operate the network in a fiber management system." Field:
   most builders maintain three parallel sources of truth:
   - the **GIS / topology engine** (if they have one) — usually the most
     out of date,
   - the **as-built Excel** — kept by the splicer who did the work,
   - the **Visio splice diagram** — drawn for the customer's project
     close-out package and never updated again.
   The training has to teach how to *reconcile* these, not pretend the
   topology engine is the only artifact.

2. **"Where does fiber 73 go?"** Textbook answer: "query the fiber
   management system for the trace." Field reality: the splicer opens
   the project's Excel master, uses Ctrl-F for "73," finds three
   matches, and walks back through the splice tabs to find the right
   one. Often the answer is "73 in cable A is 1 in cable B because we
   started over at the splice tray."
   - Field workflow we should explicitly teach: **trace by tube → trace
     by position-within-tube → trace by destination port → trace by
     OTDR distance.** The fiber number is rarely sufficient alone.

3. **Splitter math.** A 1×8 PON splitter takes 1 input fiber and gives
   8 output fibers. Excel cannot represent this without introducing
   "virtual fibers." Real splice sheets handle it by either (a)
   listing the same row 8 times, or (b) creating a separate "splitter
   sheet." Tools like Splice.me, VETRO, IQGeo handle it natively. The
   curriculum has to teach (a) the splitter convention and (b) how to
   read a hand-marked splitter splice sheet.

4. **TIA-598 vs. vendor labels.** TIA-598 says fiber 5 is **slate**
   (gray). Field crews call it "gray." Some Asian vendors print "grey."
   Some old NEC-marked cables use a slightly different shade.
   Color-blind splicers (a real population) use position counting and
   the printed legend on the cable, not color. We should teach
   position-counting as an explicit skill.

5. **Buffer-tube color count.** TIA-598 says tubes 1–12 follow the same
   12-color sequence. For tubes 13–24, the same colors repeat with a
   tracer or stripe — but **what color the stripe is varies by vendor**.
   Corning's standard is a black stripe (yellow on the black-base
   tube); other vendors use red or yellow tracer. Exam answer: black
   stripe for the second group. Field answer: read the legend.

6. **Loose tube vs. ribbon vs. rollable ribbon.** TIA-598 was written
   primarily around loose-tube and tight-buffered cable. Modern
   high-count cables (288F+, 864F, 1728F, 3456F) are **ribbon** or
   **rollable ribbon**, with 12-fiber ribbons stacked in a tube. Color
   coding still applies, but the *unit* is the ribbon, and ribbons
   carry their own marker. The exam may not yet ask about rollable
   ribbon; the field absolutely deals with it.

7. **"Topology engine" myth.** RCDD-track materials assume a TMS
   (telecom management system) with topology awareness. Most field
   crews do not have one, do not get trained on the one their employer
   bought, and rely on hand-marked PDFs. Teaching to the tool the
   employer has is more useful than teaching to a generic TMS.

8. **Visio is not a topology tool.** Stencils for fiber from
   Splice.me's free pack
   <https://splice.me/blog/visio-fiber-stencils-fiber-cables-odfs-cabinets/>
   are widely used. They look pretty. They have **zero data model** —
   moving a stencil does not move its data, copying a stencil
   duplicates a "fiber" in name but not in linkage. Fiber 73 in Visio
   is a label. Crews who pretend Visio is a system of record always
   end up with phantom fiber-73s.

9. **As-built lag.** Textbook: keep the as-built current. Field: the
   contractor closes out the project, hands over an Excel + Visio
   package, and within 6 months the customer has done 4 patches that
   never went into the package. By year 2 the as-built is decorative.
   The platform should teach that the audit-cycle is the real
   maintenance task, not the initial drawing.

10. **Cross-vendor data exchange.** There is no widely adopted
    interchange format for fiber topology. **GeoJSON for the geometry**,
    **CSV for the splice matrix**, and **PDF for the close-out** is
    the practical state of the art. KMZ is sometimes added for
    visual handoff. Anything richer (SHP, FGDB) is locked to a
    vendor stack.

---

## 4. Open questions for Red Team / user

1. Which **single tool** (if any) should the curriculum standardize
   on for hands-on exercises? VETRO has a free tier; 3-GIS does not;
   IQGeo and Bentley are paid. Splice.me has a free trial. Picking
   none and teaching the *concepts* tool-agnostically is also viable
   and arguably better.
2. Do we teach **TIA-598-D** explicitly (the current revision) or
   leave the "-C" reference, which is what the public web has the
   most material on?
3. Is the audience **OSP-build splicers**, **ISP design engineers**,
   or **ICT designers in commercial buildings**? The Excel/Visio
   gap is most extreme for OSP-build splicers; commercial premises
   designers have BIM tools.
4. Do we cover **PON splitter math** (1×8, 1×16, 1×32) in this
   module or push it to the OSP module?
5. **Rollable ribbon** — yes/no? It is the dominant new-build cable
   type for high-count fiber but is barely covered in any current
   exam blueprint.
6. We should validate the **Synchronoss Spatial Suite** ownership
   chain before naming it as a current tool; the brand has changed
   hands at least twice.
7. Should we provide a **canonical splice matrix CSV schema** as an
   editorial default the platform endorses, even though no standard
   defines one?

---

## 5. Recommended editorial defaults for the module

- Teach the **TIA-598 12-color sequence** as canon, with the field
  notes: "slate is gray," "rose is pink," "color-blind splicers use
  position." Print the sequence in the module from the
  vendor-republished form (we have multiple corroborating public
  sources).
- Teach **buffer tube → fiber → connector** as a three-level
  identification tree. Tube color is the first axis, fiber color
  within the tube is the second, connector color is informational
  only (mode/UPC/APC).
- Teach **two ways** to identify fiber 73:
  - the **textbook way** (look it up in the topology engine), and
  - the **field way** (count tubes, count fibers within tube, sanity
    check with the splice sheet).
- Teach the **splice matrix** as the fundamental document, *not* the
  GIS map. The matrix is what the splicer signs off on. The GIS map
  is a customer-facing artifact.
- Teach a **canonical CSV schema** for splice matrix that the
  platform's tool will export and consume:
  - `cable_id`, `tube_color`, `fiber_position`, `fiber_color`,
    `splice_point_id`, `splice_position`, `peer_cable_id`,
    `peer_tube_color`, `peer_fiber_position`, `peer_fiber_color`,
    `loss_db`, `notes`.
  - This is an editorial recommendation — not a standard.
- Survey the **named industry tools** without endorsing one: VETRO,
  3-GIS, IQGeo, Bentley OpenComms Designer, Splice.me, OZmap,
  netTerrain OSP, CircuitVision cvFiber, Render Networks, Biarri.
  Be explicit that **Synchronoss Spatial Suite** and **ARAMIS** are
  cited because students will encounter the names in RFPs but the
  product offerings are in flux as of 2026.
- Acknowledge **Excel + Visio + Bluebeam** as the de facto stack and
  teach how to convert between it and a topology engine. The platform's
  value prop is meeting the user in their actual workflow.
- Walk through a worked **"where does fiber 73 go?"** exercise using
  a published example splice matrix (we will author one in the
  module's exercise file).
- For multi-tube cables, teach the **tube-color tracer** convention
  for tubes 13–24 (and beyond) but warn the student to read the
  vendor cable spec because tracer color is not standardized in the
  same way as base color.
- End the module with a **field hygiene checklist**: as-built drift
  audits, version control for the master Excel, single source of
  truth designation, sign-off requirements at the splice closure.

---

## 6. Source URLs (consolidated)

- TIA-598-C Wikipedia summary: <https://en.wikipedia.org/wiki/TIA-598-C>
- FOA fiber color codes reference: <https://www.thefoa.org/tech/ColCodes.htm>
- Brady fiber color code guide: <https://www.bradyid.com/resources/fiber-optic-color-code>
- Broadband Library decoding article: <https://broadbandlibrary.com/decoding-the-fiber-optic-color-codes/>
- VETRO FiberMap: <https://vetrofibermap.com/>
- VETRO OSP intro post: <https://vetrofibermap.com/what-is-osp-an-introduction-to-outside-plant-fiber-optic-network-management/>
- 3-GIS product page: <https://www.3-gis.com/en/fiber-network-planning-management-software-3-gis>
- IQGeo OSP guide: <https://www.iqgeo.com/blog/exploring-osp-a-guide-to-outside-plant-fiber-optic-networks>
- Bentley OpenComms Designer: <https://www.bentley.com/software/opencomms-designer/>
- Bentley OpenComms intro doc: <https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-DB6BB673-078C-4D09-8379-9700F573F16E.html>
- Bentley OpenComms Fiber doc: <https://docs.bentley.com/LiveContent/web/OpenComms%20Designer-v1/en/GUID-B7335739-2C11-4C7E-8297-477F1F9CD991.html>
- Splice.me homepage: <https://splice.me/>
- Splice.me origins-of-splice-sheets: <https://splice.me/blog/origins-of-fiber-optic-splice-sheets-part-1/>
- Splice.me CAD-vs-Visio-vs-Excel comparison: <https://splice.me/blog/problems-of-fiber-splice-documentation-management-in-different-software-autocad-vs-ms-visio-vs-excel-vs-the-world-vs-splice-me/>
- Splice.me 2025 software comparison: <https://splice.me/blog/fiber-network-management-software-solutions-how-to-streamline-your-fiber-optic-network-in-2024/>
- Splice.me Visio stencils: <https://splice.me/blog/visio-fiber-stencils-fiber-cables-odfs-cabinets/>
- Splice.me network mapping how-to: <https://splice.me/blog/fiber-mapping-how-to-make-a-fiber-network-map/>
- OZmap homepage: <https://ozmap.com/en/>
- Graphical Networks netTerrain OSP: <https://graphicalnetworks.com/outside-plant/>
- Graphical Networks fiber mapping OSP vs GIS: <https://graphicalnetworks.com/blog-fiber-mapping-software-osp-vs-gis/>
- CircuitVision cvFiber: <https://www.circuitvision.com/products/cvfiber/>
- Cabling Install — manage fiber-optic network with software: <https://www.cablinginstall.com/cable/fiber/article/16465451/manage-your-fiber-optic-network-using-software>
- Cabling Install — Excel for cable management: <https://www.cablinginstall.com/home/article/16467488/simple-excel-spreadsheet-program-can-help-with-cable-management>
- Slashdot — best software for tracking fiber: <https://tech.slashdot.org/story/13/06/08/1627245/ask-slashdot-best-software-for-tracking-fiber-optic-networks>
- Industry roundup (WiFiTalents): <https://wifitalents.com/best/fiber-mapping-software/>
- MAP-IT-RIGHT 2026 review: <https://mapitright.com/2026/03/30/the-best-fiber-mapping-tools-of-2026-a-comprehensive-review/>
