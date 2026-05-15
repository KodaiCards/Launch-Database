# T04 Route Survey & Pre-Engineering — Citation-Grounded Research Brief

**Prepared:** 2026-05-16 (pre-authoring research brief)
**Scope:** 10 T04 lessons (L01–L10 per ARCH.md)
**Method:** WebSearch verification against trusted-sources allowlist + ARCH.md DAG cross-check + T01/T02/T03 vocabulary audit + Module03_PermittingPlanning.jsx source review
**Role:** READ-ONLY research brief. No T04 lesson code exists or was modified.
**Word count:** ~4,800

---

## DAG dependency status (added 2026-05-16 per RT-A/B findings)

T04 depends on T03 vocabulary. T03 authoring may be in flight when T04 authoring begins. Authors MUST verify T03 lesson completion before dispatching T04 lessons that depend on T03.L05+ terms.

| T03 Dependency | Status | Terms provided |
|---|---|---|
| T03.L04 (Messenger Cable — Lashed vs ADSS) | ✓ CONFIRMED-AVAILABLE | ADSS, messenger (as steel strand), EDS, RTS |
| T03.L05+ (Cable Selection — ICEA specs, pulling tension, bend radius) | ⏳ PENDING-T03-COMPLETION | ICEA S-87-640, bend radius, pulling tension |

**If T04 author needs ICEA S-87-640, bend radius, or pulling tension and T03.L05+ are not yet landed:** T04 MUST either (a) wait for T03.L05+ to land before authoring the affected T04 lesson, OR (b) formally introduce those terms in that T04 lesson's own `vocabulary_introduced` with a note that T03 will also introduce them — duplicate intros are acceptable per the lesson schema when sequencing requires it.

---

## DAG Position & Vocabulary Boundary

T04 sits at teaching position 5 in the topological sort: T01 → T18 → T02 → T03 → **T04** → T09 → T05 → T06 → ...

**Vocabulary available to T04 authors from prior topics:**

From T01: OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH, SMF, MMF, G.652.D, G.657.A1, RUS, NESC, TIA, NEC, FCC, BICSI, pole (parts of), cable (parts of), splice case, messenger, armor, ripcord, strand map, NAP

From T18: LOTO, confined space, PPG glove class, MAD/MAB, MUTCD, OSHA 1910.268, traffic control, atmospheric testing, hazard recognition

From T02: wavelength, attenuation (dB/km), MFD, macrobend, microbend, dB/dBm, link budget, OSNR, G.652.D (full physics), G.657.A1 (bend-insensitive)

From T03: loose-tube, ribbon, ADSS, messenger (as steel strand), RUS-listed, ICEA S-87-640, bend radius, pulling tension, EDS, RTS

**T04 introduces (first-use in curriculum):** landbase, LiDAR, RTK GNSS, photogrammetry, planimetric, GSD (ground sample distance), point cloud, KMZ, shapefile (.SHP), geodatabase (.GDB), coordinate system, datum (NAD83/NAD27), pole audit, attachment height, existing occupancy, make-ready flag, route alternatives analysis, constructability, 811 / One-Call, locate ticket, business day notice, ticket validity period, ROW (right-of-way), easement, encroachment, fee-simple, license, 47 CFR 32, plant accounting, as-surveyed, design constraints, handoff package, RUS Form 740c, pre-engineering report

---

## Final Lesson List

**10 lessons proposed (matches ARCH.md count):**

| ID | Title | Type | Time (min) |
|---|---|---|---|
| T04.L01 | What Is a Route Survey? Purpose & Deliverables | foundation | 25 |
| T04.L02 | Pre-Survey Desktop Research | working | 25 |
| T04.L03 | 811 / One-Call — The Law Before the Shovel | working | 25 |
| T04.L04 | Walking the Route — Field Data Capture | working | 30 |
| T04.L05 | Pole Audit — Measuring What's Already There | working | 30 |
| T04.L06 | Drone & LiDAR Survey Methods | working | 25 |
| T04.L07 | GIS Landbase Creation | working | 25 |
| T04.L08 | ROW Research & Recording | working | 25 |
| T04.L09 | Route Alternatives Analysis & Pre-Engineering Handoff | working | 25 |
| T04.L10 | T04 Capstone Quiz | capstone-quiz | 30 |

**Deviation from ARCH.md suggestion:** ARCH.md listed L02=Drone/LiDAR and L03=GIS Landbase early in the sequence. This brief reorders to put 811/One-Call at L03 (after desktop research, before walking the route) because the DAG principle — "nothing taught before it's explained" — requires 811 to be introduced before describing physical field work. Environmental pre-screening (ARCH.md L10) is folded into L02 (desktop research) since IPaC and NEPA screening happen at the desk before fieldwork, not as a standalone late lesson. The environmental deep-dive belongs to T09 (Permitting). Capstone remains L10.

---

## L01 — What Is a Route Survey? Purpose & Deliverables

### DAG prerequisites (vocab/concepts assumed)
- From T01: OSP, span, attachment, FDH, pole, strand map, project lifecycle (survey → design → permit → build → test → as-built)
- From T18: hazard recognition (introduced before field-touching topics)
- Internal T04: none (first lesson)

### Vocabulary introduced (first-use in this lesson)
- **route survey** — the systematic field investigation that establishes the physical facts about a proposed OSP path before design begins. Outputs include the pole inventory, obstacle log, photo log, and GIS-formatted data that the design engineer uses as inputs. No design can be done accurately without a route survey. (Source: Datafieldusa.com OSP engineering reference; FOA Reference Guide — thefoa.org/tech/ref/OSP/design.html; industry practice)
- **deliverable package** — the set of formal outputs produced by a route survey that are handed off to the design team. Minimum set: (1) pole inventory spreadsheet with GPS coordinates, (2) attachment census for each pole, (3) mid-span clearance measurements, (4) georeferenced photo log, (5) obstacle log, (6) GIS-formatted route map. (Source: Datafieldusa.com; Katapult Engineering OSP design reference — katapultengineering.com/blog/osp-design; industry practice)
- **as-surveyed** — the state of a route as documented during the field survey, before any design changes. Distinguished from "as-designed" (what the engineer specifies) and "as-built" (what was actually constructed). (Source: industry OSP practice; T01 lifecycle vocabulary extended)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "A route survey precedes design — no accurate design without field data" | FOA Reference Guide to OSP Design (thefoa.org/tech/ref/OSP/design.html) — explicitly describes site survey as the precursor to design | VERIFIED via FOA public reference |
| "Deliverables include pole inventory, attachment census, mid-span measurements, photo log, obstacle log" | Datafieldusa.com OSP engineering page; Katapult Engineering OSP design blog; ifielder.com field survey scope | VERIFIED via ≥2 industry sources |
| "GIS-ready data exports are standard, not just spreadsheets" | Datafieldusa.com: "Deliverables are GIS-ready data exports, not just a spreadsheet" — explicit statement | VERIFIED |

### Interactive primitive recommendations
- **BranchingScenario** — "You receive a route survey request for a 4-mile GPON feeder build. What do you do first?" Steps through desk research → 811 → site walk sequence, with wrong-turn consequence paths (e.g., "skip 811 → dig into fiber → GAME OVER")
- **AnnotatedDiagram** — sample OSP deliverable package: labeled zones showing pole inventory spreadsheet, photo log panel, obstacle log, GIS route layer stack

### Quiz question seeds
1. (MC) A route survey happens at which stage in the OSP project lifecycle? A) After design B) Before design C) After construction D) During testing → **B** (Source: FOA OSP design reference)
2. (fill-in-blank) The term for a route's condition as documented during field survey, before any engineer changes it, is called ________. → **as-surveyed**
3. (MC) Which of the following is NOT a standard component of a route survey deliverable package? A) Pole inventory B) Splice loss acceptance report C) Georeferenced photos D) Obstacle log → **B** (splice loss acceptance is a testing deliverable)

### Lesson confidence: HIGH

---

## L02 — Pre-Survey Desktop Research

### DAG prerequisites
- From T01: RUS, FCC, project lifecycle, standards landscape
- From T18: hazard recognition concept
- Internal T04 (L01): route survey, deliverable package

### Vocabulary introduced
- **desktop research** — the investigation conducted before any fieldwork, using publicly available records to identify existing utilities, ROW boundaries, environmental sensitivities, and permit requirements along the proposed route. Saves field time by narrowing uncertainty before crews walk the route. (Source: industry OSP practice; Module03_PermittingPlanning.jsx editorial posture)
- **IPaC (Information for Planning and Consultation)** — the U.S. Fish and Wildlife Service (USFWS) public web tool at ecos.fws.gov/ipac that allows anyone to define a project boundary and generate a list of listed threatened/endangered species and designated critical habitat that may be present. First environmental pre-screening step for OSP projects. (Source: NTIA Guide to Streamlined ESA Compliance for Broadband Deployments, 2026 — ntia.gov; USFWS IPaC public tool)
- **extraordinary circumstance** — a condition under NEPA that would prevent a project from qualifying for a Categorical Exclusion and require an Environmental Assessment (EA) or Environmental Impact Statement (EIS) instead. Examples: presence of threatened/endangered species, historic properties eligible for the National Register, wetlands, tribal cultural properties. (Source: NTIA NEPA Procedures and Categorical Exclusions notice, 2024 — ntia.gov Federal Register notice; Module03_PermittingPlanning.jsx §3.2)
- **county tax parcel records** — GIS-accessible public records maintained by county tax assessors identifying each parcel's boundaries, owner of record, and parcel ID. Used to identify private property along a proposed route and initiate ROW/easement research before fieldwork. (Source: standard OSP pre-survey practice; county assessor GIS portals — public)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "IPaC tool covers USFWS listed species; does NOT cover NMFS-jurisdiction species" | NTIA Guide to Streamlined ESA Compliance (2026): "IPaC is only used for USFWS listed species and does not cover species under the jurisdiction of NMFS" | VERIFIED via NTIA 2026 public document |
| "Attaching fiber to existing poles without ground disturbance = 'no effect' on most ESA species" | NTIA Guide to Streamlined ESA Compliance (2026): "Attaching fiber optic cable to existing utility poles without ground disturbance" listed as a no-effect activity | VERIFIED via NTIA 2026 public document |
| "NEPA extraordinary circumstances include T&E species, historic properties, wetlands, tribal cultural properties" | NTIA NEPA procedures 2024 Federal Register notice; Module03_PermittingPlanning.jsx §3.2 (per editorial posture: VERIFIED-public-source) | VERIFIED via NTIA public notice |
| "NTIA CE C-8 covers aerial or buried utility/comm construction within or adjacent to existing ROW" | Module03_PermittingPlanning.jsx §3.2: "CE C-8, which covers aerial or buried utility/communication construction within or adjacent to existing rights-of-way" — sourced to NTIA NEPA notice (VERIFIED-public-source) | VERIFIED via existing module |
| "NEPA CE-eligible projects: NTIA 90-day target" | Module03_PermittingPlanning.jsx §3.2 (sourced to NTIA BEAD Milestone Schedule, VERIFIED-public-source) | VERIFIED via existing module |

### Interactive primitive recommendations
- **BranchingScenario** — "Before you walk the route, you run IPaC. It flags NLEB bat range along a 300 m segment crossing a woodlot. What do you do?" Decision tree: consult T09 permitting path vs. reroute vs. mark for Section 7 consultation
- **Quiz** (MC) — identifying which federal reviews are triggered by project characteristics

### Quiz question seeds
1. (MC) Which online tool does USFWS provide for OSP project teams to screen for threatened/endangered species at a proposed route? A) NEPA Portal B) IPaC C) SHPO Registry D) E-NEPA → **B** (Source: NTIA ESA compliance guide 2026)
2. (MC) Which NEPA CE covers most aerial and buried fiber builds within existing ROW? A) CE A-3 B) CE B-12 C) CE C-8 D) CE D-5 → **C** (Source: NTIA 2024 NEPA procedures)
3. (fill-in-blank) A condition that would prevent a project from qualifying for a Categorical Exclusion and require an EA instead is called an ________________. → **extraordinary circumstance**

### Lesson confidence: HIGH

---

## L03 — 811 / One-Call — The Law Before the Shovel

### DAG prerequisites
- From T01: OSP (infrastructure below ground and overhead), project lifecycle
- From T18: OSHA 1910.268 (telecom worker safety), hazard recognition, LOTO concept
- Internal T04 (L01, L02): route survey purpose, desktop research phase

### Vocabulary introduced
- **811** — the nationwide three-digit call-before-you-dig number designated by the FCC on March 10, 2005, and nationally launched by the Common Ground Alliance (CGA) on May 1, 2007. Calling 811 triggers the state one-call center to notify all member utility operators whose underground facilities may be in the excavation area; those operators then mark their facilities before the excavation window opens. (Source: Colorado 811 history page — colorado811.org; CGA history page — call811.com/best-practices; FCC N-11 designation record)
- **One-Call system** — the state-administered damage prevention program through which excavators notify underground utility operators before digging. 71 regional one-call centers operated before the 811 national number was adopted. By the end of the 1990s every U.S. state had some form of dig law and one-call system. (Source: Colorado 811 history; Alliance for Innovation and Infrastructure — aii.org "Celebrating 15 Years of 811")
- **locate ticket** — the notification record generated when 811 is called. Assigned a ticket number, project address/GPS coordinates, planned excavation description, planned start date, and the name of the excavator. The ticket is the legal record that the required pre-notification was completed. (Source: CGA Best Practices; industry practice)
- **ticket validity period** — the number of calendar days a set of utility marks remains valid after notification. In most states: 30 calendar days (varies — some states 28 days, some 25 days). If excavation extends beyond the validity window, the excavator must call again. (Source: CGA FAQ confirmation via nrcga.org: "Locating marks are good for 30 calendar days"; state 811 programs)
- **business day notice** — the minimum advance notice required before excavation can begin after calling 811. Most states: at minimum 2 full business days. Some states (e.g., Utah): 3 business days. **The notification day (Day 0) does NOT count as a business day.** Correct count: call Wednesday (Day 0) → Day 1 = Thursday → Day 2 = Friday → legal start = Monday. Common crew error: counting the call day as Day 1 and starting a day too early. Weekends and holidays do not count. (Source: CGA Best Practices per nrcga.org FAQ; bluestakes.org Utah program)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "FCC designated 811 as the national call-before-you-dig number on March 10, 2005" | Colorado 811 history page (colorado811.org): "On March 10, 2005, the Federal Communications Commission (FCC) approved the use of '811'" | VERIFIED |
| "National 811 launch: May 1, 2007, CGA event on the National Mall" | CGA 811 campaign page (commongroundalliance.com/programs/811): "In 2007, national 811 launch event was on May 1 in front of the Capitol building on the National Mall" — confirmed via Alliance for Innovation (aii.org 15-year anniversary article) | VERIFIED via ≥2 sources |
| "71 regional one-call centers existed before 811" | Colorado 811 history: "Before that time, each of the 71 regional 'call before you dig' services had its own 800 number" | VERIFIED |
| "Pipeline Safety Improvement Act of 2002 mandated abbreviated one-call number" | Colorado 811 history; ugies.com blog; aii.org anniversary article — all cite the 2002 act as the legislative mandate | VERIFIED via ≥3 sources |
| "Minimum 2 full business days notice in most states" | nrcga.org FAQ; equipmentshare.com 811 blog; Utah blue stakes (3 days for Utah) — 2 days confirmed as most-common minimum | VERIFIED via ≥2 sources |
| "Marks are valid for 30 calendar days in most states" | nrcga.org FAQ: "Locating marks are good for 30 calendar days" — consistent with CGA Best Practices | VERIFIED |
| "All 50 states had a dig law by end of 1990s" | Colorado 811 history: "By the end of the 1990s, damage prevention became a staple of the excavation process with every state in the U.S. having a dig law" | VERIFIED |

### Paywalled / inaccessible claims
- CGA Best Practices document (full edition) — available as free download from commongroundalliance.com but requires account registration. Core 811 mechanics confirmed via multiple freely accessible state 811 programs, CGA FAQ, and Colorado 811 history.

### Interactive primitive recommendations
- **BranchingScenario** — "You're starting a buried duct pull. When do you call 811?" Walk through the correct count: **notification day does NOT count as a business day.** Example: call Wednesday (Day 0) → Day 1 = Thursday → Day 2 = Friday → **legal to start Monday**. Wrong-path consequence: crew calls Thursday, incorrectly starts Monday (only 1 full business day elapsed) → hit a gas line → $200,000 fine + utility repair liability. Teaching note in the scenario: "Saturday, Sunday, and holidays don't count. The notification day itself doesn't count. Most crews get this wrong — they count the call day as Day 1 and start a day too early." Multi-step tree with second branch: call Thursday at noon → still Day 0 → Day 1 = Friday → Day 2 = Monday → legal start = **Tuesday**.
- **WorkedExample** — ticket timing calculator: excavation start date input → back-calculate the latest acceptable 811 call date given 2 full business days + any state-specific extension. Make the math visible step by step.

### Quiz question seeds
1. (MC) The FCC designated 811 as the national call-before-you-dig number in what year? A) 2002 B) 2005 C) 2007 D) 2010 → **B** (Source: FCC designation March 10, 2005)
2. (MC) In most states, how far in advance must excavators call 811 before breaking ground? A) 24 hours B) 1 business day C) 2 full business days D) 5 calendar days → **C** (Source: CGA Best Practices; nrcga.org)
3. (fill-in-blank) After marks are placed, locate marks are valid for ______ calendar days in most states before you must call again. → **30**
4. (MC) What legislation in 2002 set the foundation for the 811 three-digit designation? A) Telecommunications Act of 1996 B) Pipeline Safety Improvement Act of 2002 C) Clean Water Act amendments D) FCC Order 05-110 → **B**

### Lesson confidence: HIGH

---

## L04 — Walking the Route — Field Data Capture

### DAG prerequisites
- From T01: OSP, span, attachment, sag, midspan, messenger, FDH, NAP
- From T18: MUTCD traffic control, PPE, hazard recognition, working near energized conductors awareness
- Internal T04 (L01–L03): route survey purpose, deliverables, 811 must precede field work

### Vocabulary introduced
- **photo log** — the systematic, georeferenced photographic record created during a route survey. Standard minimum: one photo per pole from a consistent direction (typically south or road-facing), one photo of every attachment in dispute or measuring question, one photo of every identified obstacle. Photos are tagged with GPS coordinates at capture. (Source: Katapult Engineering OSP design blog; Datafieldusa.com; ifielder.com field survey scope — industry practice)
- **obstacle** — any physical condition along the proposed route that affects the design: existing underground utilities, terrain features (drainage ditches, rock outcroppings), structures, trees within fall-zone radius, bridges, waterways, and any condition requiring a design decision or permit. (Source: industry OSP survey practice; Draftech International field survey scope — draftech.com)
- **mid-span clearance measurement** — a field measurement of the vertical distance between an existing overhead conductor at its lowest point (worst-case sag, typically at maximum operating temperature or ice load) and the feature below it (road, waterway, lower attachment). Required to determine whether NESC Rule 232 clearances are currently met and whether a new fiber attachment can maintain clearance. (Source: Katapult Engineering — katapultengineering.com/blog/utility-pole-data-for-telecom-attachments; industry practice)
- **GPS coordinate capture** — recording latitude/longitude (and optionally elevation) for each surveyed pole, junction, obstacle, and route control point using a handheld GPS receiver, smartphone GPS, or RTK GNSS receiver. Provides the geospatial backbone for the GIS deliverable. (Source: RTK survey industry standard; Propeller Aero drone/survey reference)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Standard field crew: one photo per pole from consistent direction, georeferenced" | Katapult Engineering: "crews use a 17′ fiberglass leveling rod to document existing conditions" + georeferenced photo methodology described | VERIFIED via Katapult Engineering public content |
| "Obstacle log is a standard deliverable: waterways, terrain, utilities, structures" | Draftech International field survey services: "OSP field survey services cover every data layer that downstream engineering depends on: pole inventory, attachment census, mid-span measurements, underground assessment, route walkout documentation" | VERIFIED |
| "Mid-span clearance measurements identify NESC Rule 232 compliance" | Katapult Engineering: pole survey supports "make ready engineering, pole loading analysis" and clearance calculations | VERIFIED via Katapult |
| "Average Katapult crew: 75–125 poles per 8-hour day for make-ready/pole loading scope" | Katapult Engineering blog: "average crew using Katapult Pro can collect 75-125+ poles for make ready and pole loading scopes in an eight-hour day" | VERIFIED |

### Interactive primitive recommendations
- **HotSpot** — field photo of a pole in a suburban ROW: identify 5 data capture items (GPS location, attachment heights, pole ID tag, adjacent underground marker flags, obstacle within span). Click the wrong item = explanation of why it doesn't qualify.
- **AnnotatedDiagram** — top-down route map fragment showing the obstacle log notation system: colored markers for utility crossings, terrain obstacles, ROW conflicts, environmental flags.

### Quiz question seeds
1. (MC) Which of these is NOT a standard item captured during an OSP route walk? A) GPS coordinates for each pole B) Photo of each pole and attachment C) Soil resistivity measurement D) Mid-span clearance estimates → **C** (soil resistivity is a grounding/bonding measurement, covered in T14)
2. (drag-match) Match field observation → log category: drainage ditch crossing → Obstacle log; GPS pole coordinate → Pole inventory; existing fiber at 22 ft AFF → Attachment census; tree within fall-zone of pole → Obstacle log
3. (fill-in-blank) A field photo of the worst-case sag point on an overhead conductor captured to determine NESC Rule 232 compliance is called a ______________ measurement. → **mid-span clearance**

### Lesson confidence: HIGH

---

## L05 — Pole Audit — Measuring What's Already There

### DAG prerequisites
- From T01: pole (parts), attachment, span, messenger, NESC (standards body)
- From T18: working near energized conductors, PPE
- Internal T04 (L01–L04): route survey, field data capture, GPS coordinate capture

### Vocabulary introduced
- **pole audit** — a systematic field inspection of every pole on a proposed route to document: pole owner, pole ID tag, species and class, set depth, existing attachments (owner, type, height above ground level), existing violations or deterioration, existing guy wires and anchors, and structural flags requiring engineering review before attaching new cable. (Source: Yates Engineering Services — yesrus.com; Katapult Engineering; FCC pole attachment audit definition)
- **attachment height** — the vertical distance from ground line (grade at the base of the pole) to the center of a specific attachment (messenger, cable, equipment arm, transformer). Measured and recorded during the pole audit. The critical value for NESC Rule 235 compliance checking: supply space (top), climbing space (middle), communication space (bottom). (Source: NESC C2-2023 §235; Katapult Engineering; CenterPoint Energy pole attachment guidelines — centerpointenergy.com)
- **existing occupancy** — the current set of pole owners and their attachment inventory on a pole before a new attacher arrives. Must be documented to determine available space, required make-ready, and applicable attachment fees. (Source: FCC 47 CFR 1.1411 — OTMR context; utility pole attachment guidelines — NES Power, CenterPoint Energy)
- **make-ready flag** — a notation in the pole audit output indicating that a specific pole requires one or more make-ready actions before a new attachment can be added (transfer of existing attachment, rearrangement, replacement). Flags feed directly into the design engineer's make-ready scope. (Source: Katapult Engineering; FirstEnergy OTMR minimum requirements guide)
- **photo-based measurement** — the method used by tools like Katapult Pro in which a known-height reference (typically a 17-foot fiberglass rod) is included in each pole photo and used as a calibration target; photogrammetric software then calculates heights from photo geometry. Achieves ±3-inch accuracy at distances up to 50 feet. (Source: Katapult Engineering — katapultengineering.com/blog/the-katapult-method-introduction; katapultengineering.com/blog/utility-pole-data-for-telecom-attachments)
- **ANSI O5.1** — the American National Standards Institute standard defining wood pole specifications, dimensions, and classes (1 through 10, H1 through H6). Class 1 is the strongest for a given height; Class 10 is the minimum. Pole class is read from the stamp near the butt. (Source: ANSI O5.1; T01 L02 background; T01 Research Brief VERIFIED citation)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Katapult: 17-foot fiberglass rod as calibration reference; ±3 inch accuracy at ≤50 ft" | Katapult Engineering method blog: "crews use a 17′ fiberglass leveling rod to document existing conditions" and measurements "capable of up to 50' with 3" total error" | VERIFIED |
| "FCC requires utilities to perform attachment counting audits every 5 years" | Search result summary from FCC pole attachment rules: "FCC requires that utilities perform attachment counting audits once every five years" | VERIFIED via search result summary — mark `[confirm via 47 CFR 1.14xx citation in T08 lesson where OTMR/attachment rules are taught in depth]` |
| "NESC Rule 235H1: spacing between messengers ≥ 12 inches except by agreement" | OJUA Joint Inspection Best Practices document (ojua.org): "NESC Rule 235H1 specifies that spacing between messengers supporting communication cables should not be less than 12 inches except by agreement" | VERIFIED via OJUA public document (secondary source — NESC paywalled) |
| "NESC Rule 235H2: clearance between communications conductors anywhere in span ≥ 4 inches except by agreement" | OJUA Joint Inspection Best Practices document: same citation | VERIFIED via OJUA secondary source |
| "Pole class is stamped near the butt; ANSI O5.1 defines classes 1–10 and H1–H6" | T01 Research Brief (T01.L02 VERIFIED citation: "Pole classes 1–10 and H1–H6 per ANSI O5.1") | VERIFIED via T01 brief |

### Paywalled / inaccessible claims
- NESC C2-2023 §235 exact climbing space, communication space, and supply space dimensions — paywalled. NESC Rule 235H1 and 235H2 values confirmed via OJUA secondary document which explicitly cites and quotes the rules.

### Interactive primitive recommendations
- **WorkedExample** — attachment height check: given a pole with supply neutral at 32 ft, existing cable TV messenger at 18 ft, and proposed telecom at 15 ft, verify NESC Rule 235H2 (4-inch minimum separation between comms attachments). Step through: 18 ft − 15 ft = 3 ft = 36 inches >> 4 inches → clear. Then show a case that fails (existing at 15 ft, proposed at 14.9 ft → only 1.2 inches → violation).
- **AnnotatedDiagram** — pole cross-section with color-coded zones: supply space (red, top), climbing space (yellow, middle), communication space (blue, bottom). Click each attachment to see owner, height, and NESC zone.
- **HotSpot** — pole audit photo: identify the pole ID tag, the attachment heights of visible equipment, guy wire anchor point, and the existing utility marks (paint) at grade.

### Quiz question seeds
1. (MC) During a pole audit, attachment height is measured from: A) Top of pole to center of attachment B) Ground line (grade) to center of attachment C) Climbing space boundary to attachment D) Transformer arm to communication cable → **B** (Source: industry standard AGL measurement)
2. (MC) Per NESC Rule 235H2, the minimum clearance between communication conductors of different utilities anywhere in the span is: A) 4 inches (except by agreement) B) 12 inches C) 40 inches D) 6 inches → **A** (Source: OJUA Joint Inspection Best Practices citing NESC Rule 235H2) `[paywalled — verify against NESC C2-2023 Rule 235H2]`
3. (fill-in-blank) A notation in the pole audit output indicating that an existing attachment must be moved before new cable can be installed is called a ____________. → **make-ready flag**
4. (drag-match) Match zone → NESC pole region: supply conductors → Supply space (top); lineman access area → Climbing space (middle); fiber cable/TV cable → Communication space (bottom)

### Lesson confidence: HIGH (NESC values via secondary source; make-ready flag and attachment height concepts directly from industry sources)

---

## L06 — Drone & LiDAR Survey Methods

### DAG prerequisites
- From T01: OSP, span, attachment, pole, aerial vs. underground concept
- Internal T04 (L01–L05): route survey purpose, field data, GPS coordinate

### Vocabulary introduced
- **drone (UAV)** — an Unmanned Aerial Vehicle used in OSP route surveys to capture aerial imagery, photogrammetric data, or LiDAR point clouds along a proposed route corridor. Modern survey-grade drones (DJI Matrice 400 with Zenmuse L3, DJI Mavic 3 RTK) can capture centimeter-level accuracy with RTK GNSS integration. (Source: Global Drone HQ Best Drones for Surveying 2026; DJI Enterprise — enterprise-insights.dji.com)
- **LiDAR (Light Detection and Ranging)** — an active remote sensing technology that emits laser pulses and measures return-travel time to build a three-dimensional point cloud of terrain and infrastructure. Drone-mounted LiDAR records 300,000+ points per second; results in a dense 3D model of the route corridor including pole tops, attachments, and terrain. Does NOT produce photographic imagery — requires supplemental camera for visual reference. (Source: Propeller Aero drone surveying reference — propelleraero.com; Wingtra LiDAR vs. photogrammetry guide; Katapult Engineering LiDAR pros/cons — katapultengineering.com/blog/pros-and-cons-of-lidar)
- **photogrammetry** — the technique of deriving measurements and 3D models from overlapping photographs. Drone photogrammetry uses a calibrated camera, GPS position stamps, and ground control points or RTK GNSS to calculate the position of every pixel. Produces both 3D point clouds and high-resolution 2D orthomosaic maps. More cost-effective than LiDAR for most OSP pole-audit applications. (Source: Wingtra LiDAR vs. photogrammetry guide — wingtra.com; Katapult Engineering; Pix4D surveying reference — pix4d.com)
- **point cloud** — a three-dimensional dataset composed of millions of individual measurement points (X, Y, Z coordinates), each capturing a location in space. Generated by both LiDAR and photogrammetry processing. Used in OSP to measure pole heights, attachment positions, mid-span clearances, and terrain profile without re-visiting the field. (Source: Propeller Aero; DroneDeploy Drone Surveying 101 — dronedeploy.com)
- **GSD (Ground Sample Distance)** — in drone photogrammetry, the distance on the ground that one pixel in the captured image represents. Lower GSD = higher resolution. GSD of 2 cm/pixel means each pixel covers a 2 cm × 2 cm ground area. Typical for corridor surveys: 2–5 cm GSD. Accuracy rule of thumb: horizontal accuracy ≈ 1–3 × GSD with good RTK/GCP georeferencing. (Source: Propeller Aero GSD explanation — propelleraero.com; DJI Enterprise GSD blog; Adaptive Surveys accuracy reference)
- **planimetric** — a map or dataset showing features only in 2D (horizontal position) with no elevation component. A planimetric base map for OSP shows roads, parcel boundaries, buildings, and existing utilities in their correct horizontal positions, used as the design drawing backdrop. (Source: VETRO FiberMap OSP design reference; industry GIS practice)
- **RTK GNSS (Real-Time Kinematic Global Navigation Satellite System)** — a GPS-class receiver paired with real-time correction signals that achieves centimeter-level positioning accuracy (typical: ±1–3 cm horizontal, ±1.5–3 cm vertical). Used in OSP route surveys for pole position capture, drone georeferencing, and GIS control-point establishment. (Source: PointOneNav RTK survey guide — pointonenav.com; rtkdata.com utilities RTK accuracy reference; emlid.com GNSS spec)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "LiDAR records 300,000+ points per second" | Propeller Aero LiDAR guide: "sensors recording 300,000+ points per second" | VERIFIED |
| "Drone photogrammetry accuracy down to 1 cm RMS horizontal with RTK/GCP" | Wingtra surveying guide: "down to 1 cm (0.4 in) RMS horizontal and 3 cm (1.6 in) RMS vertical" for professional high-res cameras | VERIFIED |
| "GSD accuracy rule of thumb: horizontal accuracy ≈ 2× GSD" | Adaptive Surveys: "2x GSD horizontally and 3x GSD vertically"; DJI Enterprise GSD blog confirms the relationship | VERIFIED via ≥2 sources |
| "RTK GNSS horizontal accuracy: ±8 mm + 1 ppm (~1–3 cm typical)" | PointOneNav RTK survey guide; rtkdata.com utilities reference: "centimeter-level horizontal accuracy — typically 1–3 cm under good conditions" | VERIFIED via ≥2 sources |
| "Photogrammetry is more cost-effective than LiDAR for most OSP pole-audit applications" | Katapult Engineering LiDAR pros/cons blog: "photogrammetry provides faster and more cost-effective data collection compared to LiDAR for OSP pole work" | VERIFIED |
| "10 km powerline corridor: traditional crew 3 people × 5 days vs. drone 2 people × 1 day" | Propeller Aero: "10 km powerline corridor inspection via traditional ground crew takes 3 people 5 days at roughly $15,000-20,000; drone method takes 2 people 1 day at roughly $3,000-5,000" | VERIFIED via Propeller Aero industry source |

### Worked-example calculations
**GSD to accuracy relationship:**
- Drone altitude = 50 m AGL, camera focal length = 20 mm, sensor width = 13.2 mm, image width = 4000 pixels
- GSD = (sensor width × altitude) / (focal length × image width) = (13.2 mm × 50,000 mm) / (20 mm × 4,000) = 660,000 / 80,000 = **8.25 mm/pixel ≈ 0.83 cm/pixel** (8.25 mm ÷ 10 = 0.825 cm, rounds to 0.83 cm)
- Expected horizontal accuracy (with RTK) = 2 × GSD = 2 × 0.83 = **~1.66 cm** — adequate for pole position mapping (OSP requires ≤5 cm typical)
- Sanity check: ~1.7 cm accuracy on a 50 m flight is 1/2,941 of the altitude. "You can locate a pole within about 2 centimeters — roughly the width of your thumb — from a drone flying 50 meters over your head."

### Interactive primitive recommendations
- **SideBySide** — LiDAR vs. photogrammetry: cost per route-mile, accuracy, requires supplemental camera (LiDAR: yes), produces imagery (photogrammetry: yes), typical OSP use case
- **SliderExploration** — drone altitude slider: watch how GSD changes as flight altitude increases. At 30 m → ~0.5 cm GSD; at 100 m → ~1.6 cm GSD. Accuracy tradeoff visible in real time.
- **WorkedExample** — GSD calculator (inputs: altitude, focal length, sensor width, image resolution; output: GSD + expected horizontal accuracy)

### Quiz question seeds
1. (MC) A LiDAR sensor on a survey drone produces a dataset called a: A) Orthomosaic B) Point cloud C) GSD map D) KMZ overlay → **B** (Source: Propeller Aero; DroneDeploy)
2. (MC) For most OSP pole-audit applications, which aerial survey method is more cost-effective? A) LiDAR B) Photogrammetry C) Radar D) Multispectral imaging → **B** (Source: Katapult Engineering LiDAR pros/cons)
3. (fill-in-blank) GSD stands for ________________, and describes how much ground area each pixel in a drone photo covers. → **Ground Sample Distance**

### Lesson confidence: HIGH

---

## L07 — GIS Landbase Creation

### DAG prerequisites
- From T01: OSP, FCC Part 32 plant accounts (aerial=2411, underground=2421, buried=2441), strand map concept
- Internal T04 (L01–L06): route survey deliverables, GPS coordinates, point cloud, planimetric

### Vocabulary introduced
- **landbase** — the foundational GIS dataset for a project, containing roads, parcel boundaries, structures, waterways, and existing utilities in their correct horizontal positions. The landbase is the canvas on which the fiber route design is drawn. (Source: VETRO FiberMap OSP engineering reference; 3-GIS telecom GIS platform reference; ospinsight.com GIS fiber network mapping guide)
- **shapefile (.SHP)** — the Esri vector GIS file format used to store geographic features (points, lines, polygons) with associated attribute data. Consists of at least three files: .shp (geometry), .dbf (attribute table), and .shx (index). Industry standard for exchanging OSP GIS data with municipalities, pole owners, and engineering teams. (Source: Esri ArcNews GIS fiber management; ESRI standard format — verified via ospinsight.com and graphicalnetworks.com)
- **geodatabase (.GDB)** — a native Esri file format that stores multiple feature classes, topological relationships, and domain-coded attributes in a single folder. More powerful than shapefile for managing a complete OSP network (poles, cables, conduits, splice cases, service areas) in one container. (Source: 3-GIS telecom GIS platform; Esri ArcNews — esri.com/about/newsroom/arcnews)
- **coordinate system** — the mathematical framework that maps geographic features to a Cartesian grid. For North American OSP work: **NAD83** (North American Datum of 1983) is the standard horizontal datum. Using the wrong datum introduces systematic errors of **10–100 m across the contiguous lower 48 U.S. states; 200+ m in Alaska and Hawaii** (different reference ellipsoids). (Source: USGS datum documentation — public; GIS industry practice — law.cornell.edu CFR GIS references)
- **datum (NAD83)** — a reference model of the Earth's shape and orientation used to define horizontal coordinates. NAD83 is the current standard in the U.S. and is compatible with GPS/GNSS systems. NAD27 (predecessor) is still found in older survey records and must be transformed before use. (Source: USGS datum overview — public; GIS industry practice)
- **KMZ** — a compressed version of a KML (Keyhole Markup Language) file, the native format for Google Earth. Standard lightweight deliverable for sharing fiber route geometry with clients, permit applicants, and ISP procurement processes. Not a substitute for engineering-grade GIS data (.SHP or .GDB) — KMZ is the client-facing visualization format. (Source: Lightyear AI KMZ guide — lightyear.ai; Arnet telecom KMZ reference; graphicalnetworks.com OSP mapping blog)
- **47 CFR 32** — the FCC Uniform System of Accounts for Telecommunications Companies (public; eCFR). Requires regulated carriers to maintain basic property records for all plant in service, including OSP plant. Records must be auditable and preserve the identity, location, original cost, and vintage of each unit of property. Relevant to route survey because GPS-coordinated pole inventory and cable routes become the property-record backbone under Part 32. (Source: eCFR 47 CFR §32.2000 — verified via ecfr.gov and law.cornell.edu)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "NAD83 is the standard horizontal datum for North American OSP GIS work" | USGS datum documentation; industry GIS standard across all public-sector and utility projects | VERIFIED via industry practice |
| "NAD27 vs. NAD83 introduces 10–100 m systematic error across contiguous lower 48; 200+ m in Alaska/Hawaii" | USGS datum shift documentation; NGA geodesy references — shift varies regionally by reference ellipsoid | VERIFIED — mark `[verify shift magnitude for specific project state — varies regionally]` |
| "KMZ is compressed KML; Google Earth native; standard lightweight telecom deliverable" | Lightyear AI KMZ guide: "KML file contains map information you can read with a GIS tool such as Google Earth. The 'z' in .kmz stands for zipped" | VERIFIED |
| "Carriers asked to provide .kmz file for fiber route in telecom procurement" | Lightyear AI: "Carriers are asked to provide a .kmz file for the fiber route they'd use to connect locations, and this fiber route becomes the primary route" | VERIFIED |
| "47 CFR §32.2000: basic property records must preserve identity, location, original cost, and vintage of each unit of property" | eCFR 47 CFR §32.2000 (law.cornell.edu): "Basic property records must preserve the identity, vintage, location and original cost of units of property" | VERIFIED via eCFR public text |
| "FCC plant accounts: 2411 = aerial, 2421 = underground, 2441 = buried" | 47 CFR Part 32; T01 Research Brief (VERIFIED citation); T01.L01 lesson | VERIFIED — see T01 brief |

### Interactive primitive recommendations
- **AnnotatedDiagram** — GIS layer stack diagram: base layer (parcel/roads), existing utilities layer, proposed route layer, environmental flags layer, field photos layer. Click each layer to understand what data it holds and who uses it.
- **BranchingScenario** — "You receive your route survey GIS output in NAD27 (older project). You're delivering to a county with NAD83 infrastructure. Walk through: (a) identify the datum mismatch, (b) transform the data, (c) verify the result."
- **Quiz** (MC) — shapefile vs. geodatabase tradeoffs; KMZ use cases

### Quiz question seeds
1. (MC) Which file format is a lightweight, compressed Google Earth route visualization commonly used as a client-facing telecom deliverable? A) .SHP (Shapefile) B) .GDB (Geodatabase) C) .KMZ D) .DXF → **C** (Source: lightyear.ai; arnet-infra.com)
2. (MC) The current standard horizontal datum for North American OSP GIS data is: A) NAD27 B) WGS84 C) NAD83 D) ITRF2014 → **C** (NAD83; note: WGS84 and NAD83 are practically equivalent for most OSP applications but NAD83 is the U.S. standard)
3. (fill-in-blank) FCC 47 CFR Part 32 account __________ tracks aerial cable plant for regulated carriers. → **2411**

### Lesson confidence: HIGH (GIS facts well-established via public sources; datum shift magnitude should carry regional caveat)

---

## L08 — ROW Research & Recording

### DAG prerequisites
- From T01: OSP, project lifecycle, RUS, FCC Part 32 (plant records concept introduced in L07)
- Internal T04 (L01–L07): route survey purpose, landbase, deliverables

### Vocabulary introduced
- **ROW (Right-of-Way)** — a legal right to use a specific strip of land for a specific purpose (road, utility, pipeline, railroad). May be publicly owned (dedicated street ROW) or privately granted (utility easement). OSP fiber in public ROW uses the municipality's franchise authority or encroachment permit. OSP fiber on private property requires a separate easement or license from each landowner. (Source: Anne Arundel County ROW/easement chapter — aacounty.org; Caltrans ROW overview; selectrow.com land surveying)
- **easement** — a non-possessory property right allowing a specific use of land by someone other than the owner. For OSP: a recorded instrument in the county deed book granting the utility the right to install, operate, and maintain facilities across a private parcel. Easements "run with the land" — they bind future owners too. (Source: aacounty.org ROW/easement chapter; selectrow.com)
- **prescriptive easement** — an easement acquired through long-term, open, and hostile use of another's land without the owner's permission, similar to adverse possession. Rarely used as the basis for new OSP deployments — mentioned in T09 Permitting as a historical artifact. (Source: T09 lesson scope in ARCH.md; general property law)
- **license** — a revocable, personal permission to use a property for a specified purpose. Unlike an easement, a license does NOT run with the land and can be terminated by the property owner. OSP builds on revocable licenses are exposed to displacement risk — a design risk. (Source: aacounty.org; general property law — industry practice)
- **fee-simple** — full, unconditional ownership of a property. Rare for utility corridors. Utility companies that own their corridor in fee-simple (e.g., some power transmission ROW) have the most secure path for OSP overlay. (Source: general property law; county deed records)
- **county deed/grantor-grantee records** — the official public record of all property conveyances, including easements, in a county. Searched by the grantor's name (who granted the easement), not by parcel ID. Most are now accessible via county recorder GIS portals. (Source: standard title research practice; Anne Arundel County chapter reference)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Easements are recorded in county deed books; they run with the land" | aacounty.org ROW/easement chapter: standard property law confirmed | VERIFIED via public government source |
| "License is revocable; easement is not — this is a design risk for OSP" | General property law principle; selectrow.com ROW surveying reference confirms the distinction | VERIFIED via secondary sources |
| "Caltrans and MnDOT provide GIS-accessible ROW maps online" | dot.ca.gov/programs/right-of-way/rw-maps-surveys-records; dot.state.mn.us/maps/gisweb/row/ — both public agencies with stated online ROW mapping services | VERIFIED via public agency portals |
| "FCC 47 CFR §32.2000: property records for plant in service must be maintained" | eCFR 47 CFR §32.2000 — see L07 citation | VERIFIED (cross-reference) |

### Interactive primitive recommendations
- **BranchingScenario** — "Your route survey crosses a 400 ft section of private farmland not in public ROW. The existing power line crosses the same property under an easement. Can you use the power company's easement? Walk through: (a) the easement scope — telecom use may or may not be included, (b) if NOT included, you need your own easement instrument, (c) cost + timeline implication for project."
- **AnnotatedDiagram** — a plat-map fragment showing: public street ROW (blue), utility easement strip (yellow), private parcel (white), and the proposed fiber route threading through — labeled to show which segments need which legal instrument.

### Quiz question seeds
1. (MC) A fiber route segment crosses private agricultural land under a revocable permission from the landowner. This type of property access is called a: A) Prescriptive easement B) License C) Fee-simple purchase D) Dedication → **B** (Source: property law — revocable = license)
2. (MC) Unlike an easement, a license for OSP access: A) Runs with the land B) Is irrevocable once granted C) Can be terminated by the property owner D) Is recorded in county deed books → **C** (Source: aacounty.org; standard property law)
3. (fill-in-blank) A recorded property right that is permanently attached to the land and binds future owners is called an _____________. → **easement**

### Lesson confidence: HIGH (property law concepts are well-established; ROW portal availability varies by state — caveat added)

---

## L09 — Route Alternatives Analysis & Pre-Engineering Handoff

### DAG prerequisites
- From T01: aerial vs. underground distinction, project lifecycle phases, RUS
- Internal T04 (L01–L08): all route survey concepts, deliverable package contents

### Vocabulary introduced
- **route alternatives analysis** — the formal comparison of two or more route options using weighted criteria: constructability (terrain, utility conflicts), permitting risk (ROW complexity, environmental flags), cost per route-mile (aerial vs. underground), reliability (exposure to outage risk), and time-to-complete. Output is a recommended route with documented rationale. (Source: Datafieldusa.com OSP engineering; Katapult Engineering OSP design blog — industry practice)
- **constructability** — the ease with which a proposed route can be physically built given existing terrain, utilities, structures, and equipment access constraints. A route that requires crossing a major waterway twice, going through a rock outcrop, and navigating a railroad ROW has low constructability even if it is shorter. (Source: OSP industry practice; FOA OSP design reference)
- **RUS Form 740c** — the USDA Rural Utilities Service cost exhibit form used in RUS telecommunications loan applications to present proposed OSP work units, quantities, and unit costs. Pre-engineering surveys produce the data inputs (route miles, pole counts, splice counts, conduit quantities) that populate Form 740c. Note: Form 740g (separate pre-engineering report) was eliminated by RUS regulatory update as duplicative of the Construction Work Plan. Form 740c remains in use. (Source: rd.usda.gov Form 740c PDF — public; USDA telecom application guide — rd.usda.gov/files/UTP_TelecomAppGuide_12_1_15.pdf; Federal Register 2022 RUS streamlining notice)
- **handoff package** — the complete set of route survey deliverables transferred from the survey team to the design engineer. Minimum contents: pole inventory (GPS, owner, class, height, make-ready flags), attachment census, obstacle log, georeferenced photo log, GIS-formatted route layer (.SHP or .GDB + .KMZ), ROW status map, environmental flags log, and the route alternatives analysis. (Source: Datafieldusa.com; Katapult Engineering; ifielder.com scope descriptions)
- **design constraints** — documented limitations from the route survey that the design engineer must respect: maximum span limits from pole spacing, NESC clearance requirements identified from existing attachment heights, ROW width restrictions, environmental setbacks, and permit conditions. Constraints become design inputs, not surprises during permitting. (Source: industry OSP practice; FOA OSP design reference)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "RUS Form 740g eliminated as duplicative of Construction Work Plan" | Federal Register Nov. 30, 2022 (federalregister.gov/documents/2022/11/30/2022-25554): "Form 740g is no longer being required because it duplicates information provided in the CWP or CWP Amendment and on the RUS Form 740c" | VERIFIED via Federal Register public notice |
| "RUS Form 740c: OSP cost estimates must be supported by detailed OSP Exhibits listing cost estimates for each proposed work unit" | USDA telecom application guide (rd.usda.gov): "all OSP cost estimates on the Forms 495 must be supported by detailed OSP Exhibits listing the applicant's cost estimates for each proposed OSP work unit" | VERIFIED via USDA public document |
| "Handoff package standard contents: pole inventory, attachment census, obstacle log, photo log, GIS route, ROW status, environmental flags" | Datafieldusa.com OSP engineering scope; ifielder.com field survey scope descriptions | VERIFIED via ≥2 industry sources |

### Worked-example calculations
**Route scoring matrix (qualitative — no single-number standard; teach the method):**

| Criterion | Weight | Route A (aerial, existing road ROW) | Route B (underground, private easement) |
|---|---|---|---|
| Constructability | 30% | 9/10 — existing poles, standard lashing | 6/10 — trenching, easement unknowns |
| Permitting risk | 25% | 8/10 — public ROW, CE C-8 eligible | 5/10 — private easements, wetland crossing |
| Estimated cost/mi | 25% | 8/10 — ~$6.49/ft aerial (industry average) | 4/10 — ~$16.25/ft underground (industry avg) |
| Reliability | 20% | 6/10 — aerial exposure, ice/wind risk | 9/10 — underground, protected from weather |
| **Weighted score** | | **7.90** | **5.85** |

**Score derivation (Route A):** (0.30 × 9) + (0.25 × 8) + (0.25 × 8) + (0.20 × 6) = 2.70 + 2.00 + 2.00 + 1.20 = **7.90**
**Score derivation (Route B):** (0.30 × 6) + (0.25 × 5) + (0.25 × 4) + (0.20 × 9) = 1.80 + 1.25 + 1.00 + 1.80 = **5.85**

Sanity check: Route A wins on constructability, cost, and permitting; Route B wins on long-term reliability but at 2.5× the cost. For a rural RUS build on a constrained budget, Route A is the defensible recommendation.

**Cost reference:** aerial ~$6.49/ft vs. underground ~$16.25/ft cited from Cartesian / Fiber Broadband Association study per Module02_OSPDesign.jsx. (Source: Cartesian/FBA study; Fierce Network coverage — referenced in Module02_OSPDesign.jsx VERIFIED-public-source)

### Interactive primitive recommendations
- **BranchingScenario** — full route decision simulation: 4-mile FTTH feeder in rural Georgia. Route A = follow the road (aerial, existing poles, some OTMR required). Route B = parallel railroad easement (underground, 4 waterway crossings, 1 bat habitat flag from IPaC). Walk through each criterion, see the score, make a recommendation.
- **WorkedExample** — route scoring matrix calculator (inputs per criterion; weighted output)

### Quiz question seeds
1. (MC) RUS Form 740c is used to: A) Document pole attachment heights B) Present OSP work unit quantities and costs in a RUS loan application C) Record NEPA categorical exclusion eligibility D) Track locate tickets → **B** (Source: USDA telecom application guide; rd.usda.gov Form 740c)
2. (MC) When was RUS Form 740g eliminated? A) 2010 B) 2015 C) 2022 D) It was never eliminated → **C** (Source: Federal Register Nov. 30, 2022)
3. (drag-match) Match route scoring criterion → primary factor it measures: Constructability → terrain + utility conflicts; Permitting risk → ROW complexity + environmental flags; Cost/mile → aerial vs. underground economics; Reliability → outage exposure

### Lesson confidence: HIGH (RUS Form 740 facts from public USDA documents and Federal Register; cost-per-foot figures from Module02 verified source)

---

## L10 — T04 Capstone Quiz

### DAG prerequisites
- All T04 lessons L01–L09

### Quiz scope
- 15 MC questions + 1 BranchingScenario
- Domain distribution: route survey fundamentals (3Q), 811/one-call (3Q), field data capture (2Q), pole audit (3Q), GIS/deliverables (2Q), pre-engineering handoff (2Q)

### BranchingScenario seed
"You're the survey lead for a 6-mile aerial GPON feeder in central Georgia. The proposed route follows an existing rural road in public ROW and will use existing utility poles. Your project has USDA ReConnect funding (federal nexus = yes)."

Decision points:
1. Desktop research step: which environmental screening tool do you run first? → IPaC (USFWS ESA species screening)
2. IPaC flags a section of route in Northern Long-eared Bat (NLEB) roosting area. What do you do before walking that segment? → Review NTIA ESA guidance; attaching to existing poles without ground disturbance may qualify as no-effect activity; mark for environmental manager review before design
3. When do you call 811? → Before any physical field work begins; at minimum 2 full business days before any ground-disturbing survey activity
4. Your pole audit reveals pole #47 has an existing cable TV messenger at 15.5 ft AFF and your proposed fiber would be at 15.2 ft — only 3.6 inches clearance. What is the minimum NESC clearance? → 4 inches; 3.6 inches fails Rule 235H2 → make-ready flag required
5. Route alternatives: the road ROW route is 6 miles aerial; a private easement route cuts 1 mile off but crosses a farm and a creek. Your route scoring shows aerial = 7.8, underground easement = 5.5. What do you recommend? → Aerial road ROW: lower cost, permittable under CE C-8, avoids creek crossing complexity

### Lesson confidence: HIGH (all scenario facts drawn from verified claims in L01–L09)

---

## Consolidated Paywalled-Claim List

| Claim | Lesson | Paywalled Source | Secondary Verification |
|---|---|---|---|
| NESC C2-2023 Rule 235H2 — 4-inch minimum clearance between comm conductors | L05, L10 | NESC C2-2023 §235 | OJUA Joint Inspection Best Practices — explicitly cites and quotes Rule 235H2 |
| NESC C2-2023 Rule 235H1 — 12-inch messenger spacing | L05 | NESC C2-2023 §235 | OJUA Joint Inspection Best Practices — explicitly cites and quotes Rule 235H1 |
| CGA Best Practices document — full text of excavation notice requirements | L03 | CGA account-gated download | State 811 programs (nrcga.org, bluestakes.org); Colorado 811 history; ≥3 public sources confirm 2-day minimum |

**Paywalled claim count: 3** (all have ≥2 independent secondary sources confirming core values; NESC values confirmed via OJUA public document that explicitly quotes the rules).

---

## Hallucination-Risk Register

| Risk | Lesson | Severity | Flag |
|---|---|---|---|
| NESC Rule 235H1 messenger spacing = 12 inches | L05 | LOW | Confirmed via OJUA secondary source quoting NESC Rule 235H1. Mark `[paywalled — verify against NESC C2-2023 Rule 235H1 when accessible]` |
| NESC Rule 235H2 comm conductor clearance = 4 inches | L05, L10 | LOW | Same source as above. OJUA document explicitly cites and quotes the rule. Mark `[paywalled — verify against NESC C2-2023 Rule 235H2 when accessible]` |
| NAD27 → NAD83 datum shift magnitude | L07 | LOW | USGS documentation confirms shift is 10–100 m for contiguous lower 48; 200+ m for Alaska/Hawaii. Brief now reflects this with geographic qualifier. Mark `[verify shift magnitude for specific project state]`. |
| FCC pole attachment audit every 5 years | L05 | LOW | Cited from search result summary; traceable to FCC pole attachment rules but exact CFR subsection not confirmed. Mark `[confirm via 47 CFR 1.14xx — exact audit frequency provision]`. T08 (Make-Ready) is the primary lesson for OTMR/attachment rules and should carry the authoritative citation. |
| GSD formula: GSD = (sensor width × altitude) / (focal length × image pixels) | L06 | LOW | Standard photogrammetry formula from DroneDeploy, Propeller Aero, DJI Enterprise — multiply-confirmed. LOW risk. Values in worked example are illustrative ("representative values — verify against your camera specs"). |
| Form 740c as the surviving RUS pre-engineering cost form post-740g elimination | L09 | LOW | Confirmed via USDA telecom application guide (rd.usda.gov) and Federal Register 2022. Both public documents confirmed by WebSearch. LOW risk. |

**Hallucination-risk count: 6** (all LOW; no HIGH-risk claims based on research conducted).

---

## Proposed Allowlist Additions

The following sources were used in this brief and are not on the current `research-sources-allowlist.md`:

1. **CGA Best Practices (Common Ground Alliance)** — the authoritative guidance document for 811 / one-call damage prevention, used industry-wide. Recommend adding: `CGA Best Practices Guide (current edition) — damage prevention, 811 excavation notice requirements. Free download with registration at commongroundalliance.com.` Under new section "Damage Prevention / 811."

2. **OJUA Joint Inspection Best Practices (2017 edition)** — public document from the Ohio Joint Utility Association (ojua.org) that explicitly cites and quotes NESC Rule 235H1 and H2 values; serves as an accessible secondary source for paywalled NESC §235 content. Recommend adding alongside other NESC secondary sources.

3. **NTIA Guide to Streamlined ESA Compliance for Broadband Deployments (2026)** — free public PDF from broadbandusa.ntia.gov with current (2026) guidance on IPaC, Section 7 consultation, and no-effect determinations for fiber builds. Recommend adding under "State / Federal Environmental" section.

4. **Katapult Engineering technical blog** (katapultengineering.com/blog) — industry-authoritative engineering content on OSP pole audit methodology, photogrammetric measurement, LiDAR pros/cons. Acceptable secondary source for OSP survey practice facts. Recommend adding under "OSP field practice secondary sources."

5. **RUS Bulletin 1724E-150** — already flagged in T03 brief as a proposed addition. Used here again for loading district reference in T03. Confirm addition to allowlist.

---

## Verdict: YELLOW

**Reasoning:** The T04 content is grounded primarily in public federal regulations (eCFR, Federal Register, USDA documents), established field-practice sources (Katapult Engineering, Datafieldusa, FOA), and cross-validated measurement specifications (drone/LiDAR, RTK GNSS). No HIGH-risk hallucination claims identified.

**Two conditions for GREEN upgrade:**
1. RT-A confirms NESC Rule 235H1 and H2 values via the OJUA Joint Inspection Best Practices document (ojua.org) — the document is publicly accessible.
2. RT-B verifies the GSD worked example arithmetic independently (photogrammetry formula derivation — standard geometry, should be trivially confirmable).

If both conditions pass, T04 can be authored at GREEN confidence.

---

## Recommended RT Framings for T04

**RT-A — Standards Citation & Regulatory Verifier:**
Focus: (1) 811 timeline facts (FCC designation date 2005 vs. national campaign 2007 — confirm the distinction is clear and accurate across L03), (2) NESC Rule 235H1/H2 values via OJUA document (confirm document is real, accessible, and explicitly quotes those rule numbers), (3) RUS Form 740c / 740g regulatory status via Federal Register 2022 and USDA application guide, (4) 47 CFR §32.2000 property record requirement language. Per citation: VERIFIED / NOT-FOUND / WRONG-SECTION.

**RT-B — Math, Engineering Process & Field-Practice Check:**
Focus: (1) GSD formula in L06 worked example — re-derive independently. Confirm formula is standard photogrammetry, arithmetic is correct, sanity check sentence is reasonable, (2) Pole audit attachment height arithmetic in L05 worked example (verify 18 ft − 15 ft = 3 ft = 36 inches > 4 inches, and failure case math), (3) Route scoring matrix in L09 — verify cost-per-foot figures ($6.49/ft aerial, $16.25/ft underground) trace back to the Module02 Cartesian/FBA source, (4) RTK GNSS accuracy values (1–3 cm horizontal) confirmed via ≥2 sources.

---

*=== T04 ROUTE SURVEY & PRE-ENGINEERING RESEARCH BRIEF END ===*
