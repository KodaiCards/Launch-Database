# OSP Topic 3 — Survey & Route Design: Discovery

> Scope: read-only content scoping for Topic 3 of the OSP training curriculum.
> Template follows Topic 1 (Cable Selection) and Topic 2 (Splice & Termination) structure.
> Aligned to BICSI OSP-DRD survey/design domains and RUS Bulletin 1751F family.
> Estimated 5 hrs total.

---

## 12-Lesson Outline

| # | Lesson Title | Est. Duration | Best Interactive Types |
|---|---|---|---|
| 3.1 | Pre-Survey Desk Research: GIS, Parcel Data, and Utility Records | 20 min | Flashcards (data source vocabulary), multiple-choice quiz |
| 3.2 | Field Survey Methodology: Route Walking, Photo Documentation, and Station Offsets | 25 min | Flashcards (survey notation, station math), scenario (decide survey approach for terrain), multiple-choice |
| 3.3 | NESC Clearances and Right-of-Way Requirements | 25 min | Flashcards (clearance values by crossing type), drag-drop (match clearance rule to scenario), multiple-choice |
| 3.4 | Aerial Route Design: Pole Loading, Span Lengths, and Midspan Height | 30 min | Flashcards (loading district terms, sag math), scenario (span-length decision from sag-tension table), multiple-choice |
| 3.5 | Underground Route Design: Burial Depth, Separation, Conduit Systems, and Handholes | 25 min | Flashcards (depth/separation minimums), drag-drop (match conduit type to scenario), multiple-choice |
| 3.6 | Direct-Bury Route Design: Plowing, Trenching, and Site Restoration | 20 min | Flashcards (plow vs. trench decision criteria), scenario (select installation method for mixed terrain), multiple-choice |
| 3.7 | Aerial-to-Underground Transitions: Riser Design and Attachment Hardware | 20 min | Flashcards (hardware terminology), drag-drop (label riser assembly components), multiple-choice |
| 3.8 | Crossings: Road, Rail, Water — Bore vs. Aerial vs. Direct | 30 min | Scenario (select crossing method given agency and depth constraints), flashcards (permit class vocabulary), multiple-choice |
| 3.9 | Splice Point Placement and Slack Storage Strategy | 20 min | Flashcards (slack loop rules, closure spacing), scenario (place splice points on a route sketch), multiple-choice |
| 3.10 | Construction Drawings and Bill of Materials | 25 min | Flashcards (drawing layer/symbol vocabulary), drag-drop (identify drawing elements), multiple-choice |
| 3.11 | Route Permitting and Agency Approvals | 25 min | Flashcards (agency types, permit class vocabulary), scenario (identify required permits for a mixed-terrain route), multiple-choice |
| 3.12 | Final Route Documentation: RUS-Style and BICSI-Style As-Builts | 20 min | Scenario (compliance audit — identify missing as-built deliverables), flashcards, multiple-choice |

**Total estimated duration: ~5 hrs**

---

## Lesson Scope Detail

### Lesson 3.1 — Pre-Survey Desk Research: GIS, Parcel Data, and Utility Records
**Duration:** 20 min

Before a crew touches the ground, a competent route designer has already resolved the bulk of the alignment using publicly available data. This lesson covers the core desk-research toolkit: county GIS parcel viewers (property boundary, ownership, and zoning data); state DOT roadway and ROW centerline data; USGS topographic layers (elevation, waterbody, wetland boundaries); county soil surveys (NRCS Web Soil Survey) for burial feasibility; 811 utility atlas records and One-Call pre-notification requirements; electric utility pole-line records (where available) for attachment feasibility; and aerial/satellite imagery for surface feature identification. Covers data quality limitations — GIS layers are approximate, not survey-grade — and the required field-verification step for every desk-identified constraint. Introduces the concept of fatal-flaw screening: identifying alignment showstoppers (protected wetlands, railroad ROW, private easement conflicts) at the desk before committing to a field survey.

**Best interactives:** Flashcard set (data source names, agency sources, terminology), multiple-choice quiz (selecting the correct data source for a given question type).

**Sources:** USGS National Map Viewer (public); NRCS Web Soil Survey (public); FEMA FIRM flood maps (public); state DOT open GIS portals (public); BICSI OSP-DRD Manual, Ch. 3 (survey and route planning); RUS Bulletin 1751F-630 §2 (pre-construction planning requirements).

---

### Lesson 3.2 — Field Survey Methodology: Route Walking, Photo Documentation, and Station Offsets
**Duration:** 25 min

This lesson covers the physical execution of an OSP route field survey. Topics: establishing a survey baseline (stationing from a fixed reference point), station offset notation (0+00 format used in RUS and DOT practice), photo documentation standards (GPS-tagged images at each station, facing forward and backward, plus perpendicular shots at obstacles), locating and marking existing utilities encountered during the walk, field sketching conventions (scale, north arrow, property/ROW boundary callouts), and identifying field conditions that differ from desk-research data (e.g., GIS shows open field but field shows drainage ditch). Covers crew composition and equipment: GPS receiver, measuring wheel or total station, survey paint/stakes, photo log, and field sketch tablet. Addresses the difference between a reconnaissance survey (route feasibility) and a design survey (precise offsets for construction drawings).

**Best interactives:** Flashcard set (station offset notation, photo-log requirements, survey equipment vocabulary), scenario (given a mixed-terrain route sketch, decide reconnaissance vs. design survey approach and identify the field data needed at each obstacle), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3 (field survey requirements); AASHTO utility accommodation policy manual (public); public utility coordination guidance from FHWA (publicly available).

---

### Lesson 3.3 — NESC Clearances and Right-of-Way Requirements
**Duration:** 25 min

The NESC (National Electrical Safety Code, C2-2023) establishes minimum vertical and horizontal clearance requirements that govern every aerial fiber route. This lesson covers: vertical clearances above roadways (NESC Rule 232, Table 232-1 — 15.5 ft minimum for communication lines over roads in NESC loading districts), clearances above railroad tracks (Rule 232 — 26.5 ft minimum), clearances above navigable waterways (Rule 234), and horizontal clearances from power lines and structures (Rule 238). Covers right-of-way concepts: fee-simple ROW, utility easement, joint-use (co-location) agreements, and the distinction between permitted ROW and owned ROW. Addresses how NESC clearances interact with local AHJ (authority having jurisdiction) requirements — NESC is a minimum; state public utility commissions may exceed it. Includes a worked midspan-clearance calculation: given a span, sag, and attachment height, verify NESC compliance.

**Best interactives:** Flashcard set (NESC clearance values, ROW terminology), drag-drop (match NESC rule number to crossing type and required clearance), multiple-choice.

**Sources:** NESC C2-2023 Rules 232, 234, 238 (citable without reading the full text); BICSI OSP-DRD Manual, Ch. 3.3 and Ch. 6.3; AASHTO utility accommodation policy (public); RUS Bulletin 1751F-630 §4 (ROW and easement requirements).

---

### Lesson 3.4 — Aerial Route Design: Pole Loading, Span Lengths, and Midspan Height
**Duration:** 30 min

The longest lesson in the topic, covering the engineering decisions that produce a compliant aerial OSP route. Topics: NESC loading districts (light, medium, heavy, extreme wind) and how they drive design ice/wind load cases (Rules 250–251); catenary sag-tension relationships (sag is a function of span, cable weight per unit length, and tension; tension must maintain NESC minimum clearance at maximum sag under full ice load); pole loading analysis (transverse load from cable weight + wind, longitudinal load at dead-ends, vertical load from cable weight — NESC Rule 261); joint-use pole attachment positions and communication space geometry (NESC Rule 238; communication attachments occupy the bottom tier of the utility space, above the minimum ground clearance); and span-length design from sag-tension tables. Includes a worked example: given attachment height, cable unit weight, NESC loading district, and maximum allowed sag, determine maximum span length. Covers guy-wire requirements at dead-ends, corners, and excessive-load poles.

**Best interactives:** Flashcard set (loading district definitions, sag-tension terminology, pole loading components), scenario (step through a span-length determination from a manufacturer sag-tension table given NESC loading district and attachment height), multiple-choice.

**Sources:** NESC C2-2023 Rules 230, 232, 250–251, 261 (citable sections); IEEE 1222 §5 (ADSS sag-tension and span rating); BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1715E-110 (electric and telecommunications joint-use pole construction, publicly available); AASHTO pole placement and clearance standards.

---

### Lesson 3.5 — Underground Route Design: Burial Depth, Separation, Conduit Systems, and Handholes
**Duration:** 25 min

Underground conduit routes are the dominant infrastructure pattern for urban and suburban OSP. This lesson covers: minimum burial depth by context (ANSI/TIA-758-C §6.3: 24 in. general, 36 in. under roads, 48+ in. under railroads); separation requirements from other utilities — 12 in. horizontal from electrical conduit up to 50 V, 18 in. from higher-voltage electrical (NESC Rule 354; ANSI/TIA-758-C §6.1); conduit selection (Schedule 40/80 PVC, HDPE, rigid steel — matched to burial depth and traffic load); duct bank design (multiple conduit in a common trench, encased in concrete for road crossings); handhole and manhole sizing and spacing (BICSI OSP-DRD maximum pull-section length = 500 ft between accessible pull points); and conduit fill ratio management (NEC Chapter 9 — 40% maximum fill for multiple cables). Addresses marking requirements (NESC Rule 354; warning tape at 12 in. above the conduit). Covers the "boring vs. open-cut" decision for road crossings: open-cut is faster where pavement can be cut; bore is required where pavement cannot be disrupted (traffic, permit restrictions, railroad ROW).

**Best interactives:** Flashcard set (depth/separation minimums, conduit material vocabulary), drag-drop (match conduit material and configuration to installation scenario), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.1, §6.3; NESC C2-2023 Rule 354; NEC Chapter 9 (conduit fill); BICSI OSP-DRD Manual, Ch. 6.1–6.2; RUS Bulletin 1751F-635 §3 (underground plant construction requirements); FHWA utility accommodation policy (public).

---

### Lesson 3.6 — Direct-Bury Route Design: Plowing, Trenching, and Site Restoration
**Duration:** 20 min

Direct-bury (no conduit) is the dominant installation method for rural OSP where traffic and utility density are low. This lesson covers: vibratory plow vs. chain trencher vs. rock saw — when each is appropriate (soil type, depth requirement, rock presence, proximity to existing utilities); minimum burial depths by context per ANSI/TIA-758-C §6.3 (24 in. general rural; 36 in. under improved roads); bedding and backfill requirements (sand bedding in rocky terrain; compaction requirements for under-road crossings); marker tape placement (12 in. above the cable); restoration requirements — agricultural land (topsoil restoration, compaction limits, seed bed preparation; required in many ROW agreements), pavement cuts (saw-cut, tamp, and patch to equal or better pavement condition), and revegetation. Addresses the mechanical interaction between plow installation and cable — plow-installed cable is subject to tensile and bending loads during installation; cable must meet plowability bend-radius requirements.

**Best interactives:** Flashcard set (plow vs. trench decision criteria, restoration terms), scenario (given a 3-mile mixed terrain route — flat cropland, gravel road crossing, fence row with buried irrigation — select the correct installation method and restoration requirement for each segment), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.3, §6.4; BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5 (construction methods for rural fiber — publicly available); state DOT utility accommodation standards (publicly available per state).

---

### Lesson 3.7 — Aerial-to-Underground Transitions: Riser Design and Attachment Hardware
**Duration:** 20 min

Where an aerial route terminates and the cable descends to grade level for an underground segment, the transition is one of the highest-failure-risk points in an OSP plant: UV exposure, vehicle impact, water ingress, and inadequate strain relief all concentrate here. This lesson covers the complete riser assembly: pole attachment bracket, cable clamp and strain relief (must not allow cable tension to reach the conduit or splice hardware below), riser conduit (Schedule 80 PVC or rigid metallic conduit from ground level to 8 ft minimum above grade), conduit cap or weatherhead (to exclude water, birds, and insects), drip loop geometry (minimum 12 in. below conduit entry to shed water), and grounding/bonding of metallic armor at the transition point (NESC Rule 352). Addresses the aerial-to-underground splice option vs. continuous cable through the transition (cable continuous is preferred where span geometry allows; splice at the transition adds a failure point without benefit unless fiber count or cable type must change).

**Best interactives:** Flashcard set (riser assembly component names, drip loop requirement), drag-drop (label a riser assembly diagram — bracket, clamp, riser conduit, drip loop, weatherhead, ground bond), multiple-choice.

**Sources:** NESC C2-2023 Rules 235G, 352, 354; BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §6.1, §6.4; RUS Bulletin 1751F-630 §6 (service entrance and transition construction).

---

### Lesson 3.8 — Crossings: Road, Rail, Water — Bore vs. Aerial vs. Direct
**Duration:** 30 min

Crossings are the highest-complexity, highest-permit-burden elements of any OSP route. This lesson covers the three primary crossing types and the engineering and agency requirements for each.

**Road crossings:** AASHTO and FHWA utility accommodation policies; bore vs. open-cut decision (bore required on Interstate and NHS routes; open-cut permitted where AHJ allows with pavement restoration); minimum burial depth (36 in. under roads per ANSI/TIA-758-C §6.3; DOT may require more); casing pipe requirements for bore under arterials.

**Rail crossings:** requires railroad company written permission (each railroad has its own standards); typical requirements: casing pipe, minimum 48 in. depth, 5 ft minimum horizontal separation from nearest rail, bore — never open-cut; Class A permit (applicant-funded) vs. Class B (railroad-funded) permit types. Coordination with FRA (Federal Railroad Administration) if crossing affects signal systems.

**Water crossings:** USACE Section 404 (wetland/waterway fill) and Section 10 (navigable waters) permit classes: Nationwide Permit 12 (utility crossings — most OSP routes qualify with conditions) vs. Individual Permit (larger impacts); state environmental agency 401 Water Quality Certification; aerial crossing option (cable span over waterway — must meet NESC Rule 234 clearances above ordinary high water mark); directional bore under the waterway bed (preferred for navigable water — no surface disturbance).

**Best interactives:** Scenario (given a route with a state highway crossing, Class I railroad crossing, and a navigable creek — select the correct installation method, required permits, and depth for each crossing), flashcard set (permit class vocabulary, agency names, depth requirements), multiple-choice.

**Sources:** NESC C2-2023 Rules 232, 234 (citable); AASHTO utility accommodation policy manual (public); USACE Nationwide Permit 12 (publicly available); ANSI/TIA-758-C §6.3; BICSI OSP-DRD Manual, Ch. 3.4 and Ch. 6.2; RUS Bulletin 1751F-630 §7 (crossing requirements for rural fiber routes).

---

### Lesson 3.9 — Splice Point Placement and Slack Storage Strategy
**Duration:** 20 min

Splice point placement is a design decision with direct impact on construction cost, maintenance access, and long-term network management. This lesson covers: splice spacing driven by cable reel length (standard 2-km and 4-km reels — splice locations must align with manageable reel breaks); slack loop requirements at every splice closure (minimum 10 m per side of closure per ANSI/TIA-758-C §6.4; RUS Bulletin 1751F-630 requires 15–20 m for aerial closures to allow lowering to ground for maintenance); closure placement criteria — accessible by standard equipment (ground-level in pedestal, pole-mounted with sufficient clearance, or in manhole/handhole); figure-8 slack coil storage in pedestals and handholes; and aerial slack loop storage at the pole. Addresses the "mid-span splice" problem — splicing outside a proper enclosure creates water-ingress risk and is prohibited by ANSI/TIA-758-C. Covers the splice point staking process: walk the designed route and place stakes at planned splice locations before excavation begins, confirming ground-level access and equipment staging.

**Best interactives:** Flashcard set (slack requirements, reel length standards, closure placement rules), scenario (given a 7.4 km route sketch with terrain features and reel breaks, identify valid splice point locations and flag invalid placement choices), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.4 (slack loop requirements); BICSI OSP-DRD Manual, Ch. 8.1 (closure placement); RUS Bulletin 1751F-630 §8 (splice point planning); RUS Bulletin 1751F-635 §4 (slack storage requirements).

---

### Lesson 3.10 — Construction Drawings and Bill of Materials
**Duration:** 25 min

Construction drawings are the legal and operational document set that authorizes and guides field construction. This lesson covers: the standard OSP drawing set — route plan sheet (plan view at 1:200 or 1:400 scale, showing property lines, ROW, pole/handhole positions, crossing locations, cable route), profile sheet (elevation view for underground routes showing depth, separation from other utilities, and crossing depths), detail sheets (standard installation details: riser assembly, handhole layout, aerial attachment, direct-bury cross-section), and a materials legend sheet. Covers the bill of materials (BOM) — itemized list of all materials with quantities, specifications, and part numbers; BOM must match drawing quantities exactly for contractor procurement and RUS/grant reimbursement. Addresses CAD/GIS drawing standards (layers, symbols, line types) per ANSI/TIA-758-C Annex C and BICSI OSP-DRD drawing conventions. Covers the drawing review and revision process: IFC (Issued for Construction) set vs. As-Built revision.

**Best interactives:** Flashcard set (drawing type names, BOM terminology, IFC vs. as-built distinction, standard symbols), drag-drop (identify labeled elements on a sample route plan-view excerpt — ROW line, cable route, pole position, splice point, crossing callout), multiple-choice.

**Sources:** ANSI/TIA-758-C Annex C (OSP drawing standards); BICSI OSP-DRD Manual, Ch. 10 (construction documentation); RUS Bulletin 1751F-630 §9 (drawing and BOM requirements for RUS-funded projects); RUS Form 515c (standard plant diagram format for RUS submissions — publicly available).

---

### Lesson 3.11 — Route Permitting and Agency Approvals
**Duration:** 25 min

An OSP route that crosses public ROW, navigable water, railroad ROW, state/federal land, or a utility easement requires permits before construction can begin. This lesson covers the full permit landscape for a typical rural/suburban OSP route: state DOT utility permit (required for any attachment to or crossing of state road ROW — each state has its own application process and timeline); railroad crossing permit (each railroad's own process — Class A, B, or C; typical timeline 60–90 days); USACE Section 404/10 (water and wetland impacts — Nationwide Permit 12 covers most OSP utility crossings with notification; Individual Permit for larger impacts); FCC Part 1 (local zoning coordination for aerial poles — varies by jurisdiction); state environmental agency 401 Water Quality Certification (accompanies USACE); tribal historic preservation officer (THPO) coordination for routes on or near tribal lands; NHPA Section 106 review for USDA RUS-funded projects. Covers how to build a permit matrix for a route and estimate the critical-path permit timeline for project scheduling.

**Best interactives:** Flashcard set (agency acronyms, permit class definitions, NWP 12 scope), scenario (given a route with three crossing types — state highway, navigable creek, active rail line — build the permit matrix and identify the critical-path permit), multiple-choice.

**Sources:** USACE NWP 12 permit conditions (publicly available); FHWA utility permit guidance (public); RUS Bulletin 1751F-630 §10 (permitting requirements for RUS-funded projects); AASHTO utility accommodation policy (public); ANSI/TIA-758-C §6.1.

---

### Lesson 3.12 — Final Route Documentation: RUS-Style and BICSI-Style As-Builts
**Duration:** 20 min

As-built documentation closes the design-to-construction loop and is the permanent record of what was built. This lesson covers: what constitutes a complete as-built set — revised plan and profile drawings with as-built depths, pole positions, and splice point GPS coordinates; OTDR test files and splice loss logs (Topic 2 output, cross-referenced); photo log with GPS-tagged installation photos at each splice point, crossing, and transition; installation diary (crew notes on field deviations from the IFC drawing set); final BOM reconciliation (materials ordered vs. materials installed). Covers RUS-specific submission requirements: RUS Form 515c (plant record of OSP route), Form 219 (contractor material/labor completion certification), and the project close-out package required for RUS loan/grant reimbursement. Covers BICSI OSP-DRD as-built documentation standard (Chapter 10). Addresses version control — as-builts must be filed in a format accessible for the plant's 30+ year service life; paper + GIS layer is the standard.

**Best interactives:** Scenario (compliance audit — given a project close-out checklist, identify which as-built deliverables are missing before RUS reimbursement can be requested), flashcard set (RUS form numbers and purpose, as-built component definitions), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 10; RUS Bulletin 1751F-630 §11 (as-built and record requirements); RUS Form 515c and Form 219 (publicly available); ANSI/TIA-758-C §9 (acceptance and as-built documentation).

---

## Interactive Type Distribution

| Interactive Type | Lesson(s) | Count |
|---|---|---|
| Flashcard set (mandatory every lesson) | 3.1–3.12 | 12 |
| Multiple-choice quiz (mandatory every lesson) | 3.1–3.12 | 12 |
| Scenario (branching / worked problem) | 3.2, 3.6, 3.8, 3.9, 3.11, 3.12 | 6 |
| Drag-and-drop | 3.3, 3.5, 3.7, 3.10 | 4 |

Every lesson ships with at minimum one flashcard set and one multiple-choice quiz — consistent with Topics 1 and 2. Scenarios are concentrated in the decision-heavy lessons (installation method selection, crossing-method decisions, permit matrix construction). Drag-drop is used for spatial/labeling tasks (clearance rule matching, conduit selection, riser assembly labeling, drawing element identification).

---

## Final Exam Structure (~25 questions)

Cumulative across all 12 lessons. 70% pass threshold. Questions randomized from question bank. Each question cites source standard(s). Emphasis on applied decision-making over pure recall — consistent with Topics 1 and 2.

| Lesson coverage | Approximate question count |
|---|---|
| 3.1 Pre-Survey Desk Research | 1 |
| 3.2 Field Survey Methodology | 2 |
| 3.3 NESC Clearances + ROW | 3 |
| 3.4 Aerial Route Design | 3 |
| 3.5 Underground Route Design | 2 |
| 3.6 Direct-Bury Route Design | 2 |
| 3.7 Aerial-to-Underground Transitions | 1 |
| 3.8 Crossings | 3 |
| 3.9 Splice Point Placement | 2 |
| 3.10 Construction Drawings + BOM | 2 |
| 3.11 Route Permitting | 2 |
| 3.12 Final Route Documentation | 2 |
| **Total** | **25** |

Question types: multiple-choice (majority), scenario-based (5–6 questions requiring applying a rule or decision framework to a field condition — consistent with the "million-dollar program" quality bar for practical training content).

---

## Citation Source Matrix

| Lesson | NESC C2-2023 | ANSI/TIA-758-C | BICSI OSP-DRD | RUS Bulletins | Other |
|---|---|---|---|---|---|
| 3.1 | — | — | Ch. 3 | 1751F-630 §2 | USGS; NRCS WSS; FEMA FIRM |
| 3.2 | — | — | Ch. 3 | 1751F-630 §3 | AASHTO utility accommodation; FHWA |
| 3.3 | Rules 232, 234, 238 | — | Ch. 3.3, 6.3 | 1751F-630 §4 | AASHTO utility accommodation |
| 3.4 | Rules 230, 232, 250–251, 261 | — | Ch. 6.3 | 1715E-110 | IEEE 1222 §5; AASHTO |
| 3.5 | Rule 354 | §6.1, §6.3 | Ch. 6.1–6.2 | 1751F-635 §3 | NEC Ch. 9; FHWA |
| 3.6 | — | §6.3, §6.4 | Ch. 6.2 | 1751F-630 §5 | State DOT accommodation standards |
| 3.7 | Rules 235G, 352, 354 | §6.1, §6.4 | Ch. 6.3 | 1751F-630 §6 | — |
| 3.8 | Rules 232, 234 | §6.3 | Ch. 3.4, 6.2 | 1751F-630 §7 | USACE NWP 12; AASHTO; FRA |
| 3.9 | — | §6.4 | Ch. 8.1 | 1751F-630 §8; 1751F-635 §4 | — |
| 3.10 | — | Annex C | Ch. 10 | 1751F-630 §9; Form 515c | — |
| 3.11 | — | §6.1 | Ch. 3.4 | 1751F-630 §10 | USACE NWP 12; FHWA; AASHTO |
| 3.12 | — | §9 | Ch. 10 | 1751F-630 §11; Forms 515c, 219 | — |

---

## Open Questions for User

1. **RUS project context:** Most of the office's work appears to be RUS-program rural fiber. Should Lesson 3.12 give primary emphasis to RUS Form 515c / Form 219 close-out documentation (vs. BICSI-style as-builts)? If the team regularly submits to RUS reimbursement cycles, the RUS-specific form numbers and submission checklist are directly reusable on the job.

2. **Crossing permit depth:** The office likely has a standard suite of crossings (state highway, rail, creek/drainage) on rural routes. Are there specific permit agencies or railroad companies (e.g., BNSF, UP, short-line) whose permit processes the team deals with repeatedly? Lesson 3.11 can include a brand-specific permit-process walkthrough for frequently encountered agencies rather than generic treatment.

3. **CAD/GIS tooling for Lesson 3.10:** The construction drawing lesson references ANSI/TIA-758-C Annex C drawing conventions. Does the office use a specific CAD/GIS platform (AutoCAD, Civil 3D, ESRI ArcGIS, QGIS) for OSP route design? If so, the drawing-element drag-drop interactive can reference that platform's symbol library, making it immediately usable in daily work.

=== OSP TOPIC 3 DISCOVERY END ===
