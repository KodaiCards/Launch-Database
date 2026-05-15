# T04 Brief — Route Survey & Pre-Engineering

## Topic Scope

**Route Survey & Pre-Engineering** is the bridge between permitting/planning (T09, which depends on T04) and design (T05/T06). A crew walks or flies a proposed route, documents existing conditions, audits poles, flags safety/constructability issues, and produces the geo-spatial + pole-inventory deliverables that the design engineer uses to create detailed engineering. The outcome is a hand-off package — maps, pole data, photographs, ROW notes, cost drivers — that the design team cannot do their job without. This topic teaches the **what**, **why**, and **how** of capturing field reality accurately so it doesn't surprise the engineer later.

**Audience framing (field-experienced, no engineering training):** Your crew has done walk-throughs before; this topic formalizes what you're already looking at. You'll learn the specific tools (drone LiDAR, RTK GNSS), the deliverable standards (KMZ, shapefile, PDF/A), and the legal/accounting requirements (47 CFR 32) that turn a walk into a surveyed route. The lesson progressively builds from "what to see" (L01) → "how to capture it" (L02–L04) → "what format it goes out in" (L06–L08). L05 (Route Alternatives) teaches tradeoff reasoning — when to choose aerial vs. underground based on what you found.

## Prerequisite Vocabulary Check

**From T01 (Fundamentals):**
- OSP, fiber optic, cable, pole, conduit, attachment, make-ready, ROW, joint-use, clearance, load, span, utility, contractor, RUS, NESC

**From T18 (Safety/OSHA):**
- hazard recognition, fall protection, confined space, PPE, 1910.268, hierarchy of controls, lockout-tagout, LOTO, vehicle safety, traffic control

**New in T04 (added):**
- site walk, existing utility, hazard identification, photo log, drone, LiDAR, point cloud, planimetric, GSD (ground sample distance), RTK GNSS, landbase, shapefile, geodatabase, coordinate system, datum, pole audit, attachment-height measurement, existing occupancy, make-ready flag, cost-effectiveness, constructability, permitting risk, route scoring, KMZ, .SHP, PDF/A, DWG, deliverable package, 47 CFR 32, plant accounting, cost allocation, record retention, handoff package, design input, as-surveyed, design constraints

## Lesson List (10 lessons, 295 min total)

| ID | Title | Type | Prerequisites | Learning objectives | Vocabulary introduced | Est. time | Interactivity |
|---|---|---|---|---|---|---|---|
| T04.L01 | The Site Walk — What You're Looking For | foundation | T01, T18 | Identify physical features, existing utilities, hazards, and photo-logging patterns during a field walk | site walk, existing utility, hazard identification, photo log | 25 min | BranchingScenario (field route decision with consequences); HotSpot (click hazards in a route-walk photo); Quiz; Flashcards |
| T04.L02 | Drone and LiDAR Survey Methods | working | T01, T04.L01, T18 | Describe how drone LiDAR captures topography and obstacles; interpret point-cloud data for route planning | drone, LiDAR, point cloud, planimetric, GSD | 25 min | AnnotatedDiagram (LiDAR data layers overlay — bare earth, obstruction, canopy); WorkedExample (GSD calculation: GSD = (sensor pixel size µm × flight altitude m AGL) / focal length mm); Quiz; Flashcards |
| T04.L03 | GIS Landbase Creation | working | T01, T04.L01, T04.L02 | Construct a GIS landbase from aerial imagery, property boundaries, and utility records; understand coordinate systems and datum-mismatch detection | landbase, shapefile, geodatabase, coordinate system, datum, UTM, NAD83 | 25 min | AnnotatedDiagram (GIS layer stack — aerial image + boundary + utility overlay); Sortable (drag coordinate-system layers into priority order) OR WorkedExample (compute UTM zone from longitude); Quiz; Flashcards |
| T04.L04 | Pole Audit — Field vs. Records | working | T01, T02, T04.L01, T04.L03 | Measure pole attachment heights in the field; cross-check against design records; flag existing occupancy and make-ready needs for design-engineer follow-up | pole audit, attachment-height measurement, existing occupancy, make-ready flag | 30 min | WorkedExample (field measure-and-flag: record pole height + existing attachment heights + proposed attachment zone; flag clearance margin for design review); AnnotatedDiagram (pole-cross-section labeling existing/proposed attachment heights); Quiz; Flashcards |
| T04.L05 | Route Alternatives Analysis | working | T01, T04.L01, T04.L03 | Compare aerial vs. underground cost, constructability, environmental, and permitting tradeoffs at the conceptual field-comparison level | cost-effectiveness, constructability, permitting risk, route scoring, tradeoff analysis | 25 min | BranchingScenario (two route options with distinct cost/constructability/permitting profiles; learner picks based on scenario brief); Quiz; Flashcards |
| T04.L06 | KMZ, Shapefile, and PDF Deliverables | working | T04.L02, T04.L03 | Package GIS data for handoff to designers and stakeholders; understand format constraints and compatibility | KMZ, .SHP, geotiff, PDF/A, DWG, CAD, deliverable package, versioning | 20 min | AnnotatedDiagram (file-format comparison table); SideBySide (PDF/A vs. Shapefile vs. KMZ tradeoff — when to use which); Quiz; Flashcards |
| T04.L07 | Record-Keeping Requirements — 47 CFR 32 | working | T01, T04.L04 | Explain plant-account coding and the record-retention requirements for RUS borrowers | 47 CFR 32, plant accounting, cost allocation, record retention, RUS Form 1755-A, construction cost ledger | 20 min | BranchingScenario (you're allocating survey costs — which plant account?); Quiz (MC on document retention timelines and cost-pool allocation); Flashcards |
| T04.L08 | Handing Off to Design | working | T04.L01–L07 | Assemble a complete survey handoff package; identify incomplete data before releasing to the design team | handoff package, design input, as-surveyed, design constraints, gap analysis, deliverable checklist | 20 min | BranchingScenario (incomplete handoff with missing pole data; learner decides whether to release or supplement); Quiz; Flashcards |
| T04.L09 | Pre-Engineering for RUS Jobs | working | T01, T04.L01–L08 | Explain RUS construction package conventions, unit codes, and field engineering data sheets required before engineering can begin | RUS pre-engineering, construction unit code, RUS field engineering data sheet, RUS contract forms, construction package | 20 min | Sortable (drag construction-package documents into RUS submission order); AnnotatedDiagram (sample RUS package cover sheet with labeled sections); Quiz; Flashcards |
| T04.L10 | T04 Capstone Quiz | capstone-quiz | T04.L01–L09 | Integrate route-survey skills: route walk → drone capture → GIS upload → pole audit → handoff | — | 30 min | Quiz (20–25 MC); BranchingScenario (integrative field-survey scenario covering the full T04 workflow) |

**Total: 10 lessons, 295 minutes (~4.9 hours)**

## Per-Lesson Interactivity Recommendations

- **T04.L01 (Site Walk)** — BranchingScenario (learner encounters 3 route options with different hazards/utilities; picks one + sees consequences). HotSpot (click hazards in a route-walk photo — e.g., unmarked manhole, low-hanging energized drop, unstable shoulder). Quiz (MC on hazard-spotting). Flashcards.
- **T04.L02 (Drone/LiDAR)** — AnnotatedDiagram (interactive point-cloud layer stack: bare earth, obstruction, canopy classified; click each layer to toggle). WorkedExample (GSD = (sensor pixel size µm × flight altitude m AGL) / focal length mm; inputs: pixel size 3.76 µm, altitude 100 m AGL, focal length 24 mm → GSD = 15.7 mm → 1.57 cm per pixel; sanity check: "a 1.6 cm GSD means each image pixel covers about 1.6 cm on the ground — a utility pole is clearly visible but thin wires may blur"). Quiz (MC on interpreting LiDAR color-coded elevation). Flashcards.
- **T04.L03 (GIS Landbase)** — AnnotatedDiagram (GIS layer stack: aerial photo base → boundary outline overlay → utility-locate layer → route proposal overlay; click each layer to highlight). Sortable (drag coordinate-system layers into priority order by trust level — surveyed control point, RTK field measurement, handheld GPS, aerial imagery, NAD27 legacy raster). Quiz (MC on coordinate-system choice rationale, datum-mismatch detection). Flashcards.
- **T04.L04 (Pole Audit)** — WorkedExample (field measure-and-flag scenario: "Pole 14 is measured at 45 ft in the field; design drawing says 40 ft. Existing attachment is at 28 ft. Proposed fiber at 30 ft. Clearance between proposed and existing = 30 − 28 = 2 ft. Flag for design engineer: clearance below typical joint-use requirements — make-ready review needed." Frame as capture-and-flag; no NESC rule application in T04). AnnotatedDiagram (pole cross-section with existing + proposed attachment heights labeled; click each zone to annotate height). Quiz (MC on make-ready triggers, attachment-height measurement procedure). Flashcards.
- **T04.L05 (Route Alternatives)** — BranchingScenario (two route segments: aerial vs. UG; each has cost category, constructability cues, permitting complexity indicator; learner picks + sees tradeoff consequences at the field-comparison level). Quiz (MC on constructability cue interpretation — what crew observations suggest aerial vs. UG). Flashcards.
- **T04.L06 (KMZ/Shapefile/PDF)** — AnnotatedDiagram (comparison chart: format columns = GIS-native, proprietary, ArcGIS-compatible, mobile-friendly, print-friendly; rows = KMZ, SHP, geotiff, PDF/A, DWG; color-coded checkmarks). SideBySide (compare PDF/A vs. Shapefile vs. KMZ for three stakeholder scenarios: field crew, design engineer, permit agency). Quiz (MC on which format for each stakeholder). Flashcards.
- **T04.L07 (47 CFR 32 Record-Keeping)** — BranchingScenario (you're allocating survey field costs across a 3-segment job — which plant account per 47 CFR 32 USOA for each cost type: labor, vehicle, equipment, subcontract). Quiz (MC on retention requirements and cost-pool assignment). Flashcards.
- **T04.L08 (Handoff to Design)** — BranchingScenario (learner receives survey package; missing: pole heights for 3 poles, no LiDAR coverage for 500 ft ravine section, photo log incomplete for make-ready zones; learner decides release-now-or-rework + sees consequences of incomplete handoff). Quiz (MC on handoff completeness criteria). Flashcards.
- **T04.L09 (Pre-Engineering for RUS Jobs)** — Sortable (drag construction-package documents into RUS submission order: field notes → Form 740 → unit-code sheets → budget estimate → environmental checklist → engineer certification). AnnotatedDiagram (annotated RUS package cover sheet: each labeled field explains what goes where). Quiz (MC on RUS construction-unit-code categories and sequencing). Flashcards.
- **T04.L10 (Capstone Quiz)** — Quiz (20–25 MC covering the full T04 topic: site walk hazards, GSD calculation, GIS layer stack, pole audit measure-and-flag, route-alternative conceptual tradeoffs, format selection, 47 CFR 32 retention, handoff completeness, RUS pre-engineering). BranchingScenario (integrative field-survey scenario: learner role-plays a site-walk-to-handoff sequence with decision points at each stage). No flashcards (capstone tier).

## Capstone Quiz Scope

**Integrative assessment: Site-to-Design Handoff Completeness** (~20–25 questions, 1–2 scenarios)

- **Scenario A (BranchingScenario, 15 min):** Learner receives survey data for a 2-mile route: mixed aerial/UG, one river crossing, two utility poles requiring make-ready, LiDAR from 2026-02 flight. Decision points: (1) spot 3 data gaps in the package; (2) which pole(s) need RTK height confirmation; (3) which GIS layers are critical for the design engineer; (4) identify correct plant-account bucket for the survey cost.
- **Scenario B (BranchingScenario):** Design engineer returns survey feedback: "Need updated pole-height for P14 (existing occupancy changed); LiDAR coverage missing for the 500 ft ravine." Learner proposes a remediation plan (drone re-flight? RTK re-visit? timeline trade-offs?) and sees consequences of each choice.
- **MC questions (20–25 total):** hazard-spotting on a photo log, GSD calculation, format selection, 47 CFR 32 retention requirements, pole measure-and-flag procedure, route-alternative conceptual tradeoff reasoning, coordinate-system / datum-mismatch detection, deliverable-package completeness, RUS pre-engineering package documents. **No NESC rule application** — clearance compliance is T05 scope; T04 capstone only tests field measurement and flagging.

## Citations Table

Every standard / RUS bulletin / BICSI reference in the lesson set, with source + section/clause:

| Claim | Source | Section/Clause | Type |
|---|---|---|---|
| Pole attachment-height measurement procedure (T04.L04) | RUS Bulletin 1751F-630 | § 7 (Aerial Plant — Attachment heights and clearance) | primary |
| NESC Rule 235 clearance (between conductors of different circuits / utilities on the same supporting structure — joint-use inter-conductor clearance) | NESC C2-2023 [confirm edition] | Rule 235 | primary |
| Clearance margin calculations — practical field procedure | RUS Bulletin 1751F-630 | § 7.2 (sag and tension tables) | primary |
| Confined-space entry hazard (manhole/handhole survey) | 29 CFR 1910.146 | § 1910.146(b) (definition of acceptable O₂ range 19.5%–23.5%) | primary |
| Fall protection for pole-top work (hazard recognition in L01) | 29 CFR 1910.268 | § 1910.268(g)(1) (fall protection at poles) | primary |
| Lockout-tagout during pole audit (de-energizing joint-use) | 29 CFR 1910.147 | Full subpart | primary |
| LiDAR point-cloud classification (L02) | FOA Reference Guide to Fiber Optics | [confirm chapter — FOA Reference Guide chapter on outside plant survey methods / aerial survey techniques] | secondary |
| GIS landbase creation (coordinate systems, datum) | USGS National Geodetic Survey — CRS definitions | Public domain; coordinate reference system documentation (ngs.noaa.gov) | secondary |
| RTK GNSS positional accuracy | NOAA NGS CORS — Continuously Operating Reference Stations | RTK accuracy spec: sub-decimeter (ngs.noaa.gov/CORS/) | secondary |
| 47 CFR 32 record retention and cost allocation (L07) | 47 CFR 32 | Full subpart; plant-account codes per USOA (e.g., § 32.2210 plant accounts; § 32.27 records retention) | primary |
| RUS Form 1755-A construction cost ledger | RUS Bulletin 1751F-630 | Appendix; RUS.USDA.gov forms | primary |
| PDF/A archival format | ISO/IEC 19005-1 (PDF/A-1) | Full standard; retention period [confirm — FCC 47 CFR 42 schedule + RUS loan-life may extend beyond standard practice] | secondary |
| Shapefile format (.SHP) | ESRI White Paper on Shapefile Spec | Technical reference (publicly available) | secondary |
| KMZ (Google Earth) interoperability | OGC KML Standard | 2.3 (Open Geospatial Consortium) | secondary |

## Author Guardrails

1. **Vocabulary introduction discipline (STRICT).** Every term in "vocabulary_introduced" at lesson top MUST be defined in the lesson prose before that term is used in a worked example or quiz question. Cross-reference T01 + T18 vocabulary_introduced sets in the lesson's vocabulary_assumed section to ensure NO forward-references to terms not yet taught. **T04.L04 scope boundary:** T04 comes BEFORE T05 in the teaching DAG. L04 introduces attachment-height measurement as a field-data-capture skill — NOT NESC code compliance derivation. The worked example must be framed as "measure-and-flag": record the pole height, record existing attachment heights, record the proposed attachment zone, calculate the raw clearance margin, and flag the result for the design engineer's review. **Do NOT name or cite any NESC Rule number in T04 lesson content.** NESC Rule 235 (clearance between conductors of different circuits / utilities) and Rule 232 (conductor-to-ground vertical clearance) are T05 scope — they get cited and applied in T05 when the design engineer runs the compliance calculation. T04's job is to capture the field measurements that feed those rules. The author guardrail for L04 is: "A field walker measures. A design engineer applies the code."

2. **Citations with section numbers.** Every reference to RUS 1751F-630, NESC C2-2023, CFR, 47 CFR 32, etc., MUST include the section/subsection number. Do NOT write "RUS says..." without citing the section. For paywalled NESC and OSPDR, use `[confirm edition]` if the specific section is not independently verifiable.

3. **Plain-English + acronym glossary at top.** Every lesson opens with "In Plain English" (plain-language framing of why a crew cares) + an acronym table (acronym, full name, what it means in practice). Unpack every acronym on first use in the prose.

4. **Worked examples over abstract theory.** L04's "pole audit in the field" should include a real or plausible scenario: "You measure a pole as 45 ft in the field. The design drawing says 40 ft. Records show two existing attachments at heights X and Y. The new fiber attachment is proposed at height Z. What's the clearance margin? What do you flag?" Show every step.

5. **Field vs. book practice** (Carter's rule). The brief requires the following book-vs-field gaps be taught in the specified lessons. For each gap, teach: (a) what the standard says, (b) what experienced crews actually do, (c) the clear distinction between them, and (d) the risk of confusing them.

   - **L02 — Drone ops (FAA Part 107 + LAANC vs. Class G practice):**
     - **Book:** FAA Part 107.51 and 107.41 require LAANC pre-flight authorization (or a waiver) for any UAS operation in controlled airspace. The digital authorization via the FAA DroneZone portal or a LAANC-enabled app (e.g., Aloft) is required before flight in Class B/C/D/E surface area.
     - **Field:** Most OSP route surveys happen in Class G (uncontrolled) airspace over rural areas. Crews commonly launch without any formal authorization, relying on a visual scan and awareness that no airport is within 5 statute miles. This is legally permissible in Class G but leaves the operator exposed if a manned aircraft appears or an incident occurs.
     - **Teach both:** When to file LAANC vs. when Class G permits immediate flight; how to confirm airspace class before launch (FAA's B4UFLY app or sectional charts); the legal exposure if a Class G flight still triggers a 107.23 reckless-operation finding.

   - **L03 — GIS datum mismatch (NAD83 / WGS84 surveyed vs. NAD27 legacy rasters):**
     - **Book:** FGDC metadata standards require all geospatial datasets to declare the horizontal datum (NAD83, WGS84, NAD27) and coordinate reference system (CRS) explicitly. GIS interoperability assumes both layers share the same CRS or are reprojected before overlay.
     - **Field:** Handheld GPS units (Garmin, older Trimble units) sometimes default to WGS84 while the project basemap is projected in NAD27 or a legacy state-plane system. The positional error can reach 150–300 ft on a basemap/GPS mismatch — big enough to place a pole at the wrong address. Many crews don't notice until the designer's CAD overlay doesn't align.
     - **Teach both:** How to check a layer's CRS in GIS software (right-click → Properties → CRS); how to detect a datum mismatch in the field (GPS point lands visibly off-road on the basemap); how to flag it for GIS reconciliation before handoff rather than assuming they line up.

   - **L05 — Route alternatives scoring (weighted matrix vs. experienced-PM intuition):**
     - **Book:** Formal route-selection methodologies (BICSI OSPDR, RUS planning guidance) recommend a weighted scoring matrix — assign weights to cost, constructability, permitting complexity, environmental impact; score each route option; pick the highest scorer.
     - **Field:** An experienced project manager often makes the aerial-vs-UG call in a 30-second walkthrough based on: who owns the ROW, whether the road authority plays nice, how many encroachments are in the segment, and whether the crew has the boring rig available. The PM's mental model produces the same answer the matrix produces — just faster and without paperwork.
     - **Teach both:** The matrix is valuable documentation for RUS submittal and for justifying costs to a client. The PM's gut is valuable for rapid field triage. A good surveyor can do the quick-triage version in the field and attach a formalized scoring sheet to the handoff package afterward.

   - **L07 — 47 CFR 32 plant accounts (USOA codes vs. field cost-lumping):**
     - **Book:** 47 CFR Part 32 Uniform System of Accounts (USOA) requires RUS borrowers to code every cost to a specific plant account (e.g., § 32.2410 cable and wire; § 32.2420 poles; § 32.2220 land and land rights; § 32.6512 motor vehicles). Labor, materials, and overhead must be allocated separately per account class. Auditors reconcile cost records to these codes.
     - **Field:** Most field supervisors lump all survey costs — labor, truck, equipment, subcontract — into a single "Other Plant" bucket and let the accounting department sort it out. The auditor then has to reconstruct the allocation from timesheets and invoices. This works until an RUS loan audit scrutinizes the plant-account breakdown and flags under-allocated cable vs. over-allocated overhead.
     - **Teach both:** The correct account codes for common survey costs; the risk of lumping into catch-all accounts (audit exposure, loan compliance); the practical workflow of noting the account code on the daily timesheet so the office doesn't have to reconstruct it.

   Additionally, the example in Guardrail #5 concerns joint-use inter-conductor clearance — the correct NESC rule is **Rule 235** (clearance between conductors of different circuits on the same supporting structure), NOT Rule 232 (conductor-to-ground vertical clearance). However, because T04 scope is field measurement only (not rule application), the author should NOT cite any NESC rule number in T04 lesson content. Rule 235 is the T05 design-engineer tool. In T04.L04, the framing is: "measure the gap between existing and proposed; flag it for design review." That's it.

6. **No AI signals.** Lessons never mention "AI," "Claude," "language model," "generated," or "auto-generated." Content reads as if a senior OSP field engineer wrote it.

7. **Safety integration (T18 foundation):** L01 (The Site Walk) opens by covering hazard spotting — confined-space indicators near manholes, fall hazards on poles, vehicle traffic on roadway shoulders, energized-line proximity. Cross-reference T18.L01 (Hazard Awareness) + T18.L02 (LOTO) in the scenario context. Don't teach the full LOTO procedure (that's T18), but flag when a survey requires de-energization coordination.

8. **47 CFR 32 framing in L07:** This is a **record-keeping and accounting** lesson, not a regulatory-compliance deep dive. Focus on: "Why does RUS require long-term record retention? (Because they audit plant investment over the life of the loan.) What gets coded to what plant account? (Your survey cost, plus makeup labor, plus materials.) How do you justify the allocation?" Avoid tax or audit interpretation — stick to the practical workflow of logging costs and retaining supporting documents. **Important:** Do NOT state a specific retention period (e.g., "15 years") without confirming the current FCC 47 CFR 42 schedule and applicable RUS loan-life requirement — RUS loan terms can extend beyond standard FCC retention minimums. Author should cite `[confirm — FCC 47 CFR 42 retention schedule; RUS loan-life may extend]` in the lesson body rather than hardcoding a period.

9. **Handing off to design (L08) as a quality gate.** Frame the BranchingScenario around the theme: "You're the quality checkpoint. If you hand off incomplete data, the designer wastes time asking for re-work. If you hand off clean, they start drawing immediately." Make it clear that a crew's reputation depends on the handoff.

10. **GIS/RTK/LiDAR language.** These are tools the crew may or may not have used before. Plain-English analogies in L02:
    - **Drone LiDAR = a camera that bounces laser light off everything and times how long the bounce takes, then draws a 3D map.**
    - **RTK GNSS = GPS that's accurate to a few centimeters instead of 30 feet, because it talks to ground stations that correct for atmospheric delays.**
    - **Shapefile = a bag of related files (.shp, .shx, .dbf) that together store one GIS layer (like "poles" or "duct runs") — think of it as a spreadsheet that also knows where things are on a map.**

11. **Avoid tool-specific workflows.** The brief assumes crews may use Datafield, Katapult, Osmose, or manual survey methods. Don't teach "how to use Datafield" — teach "what a site walk collects" and "what format it goes out in," letting the field tool be the implementation detail.

12. **Flashcard requirement.** Every lesson MUST include a `key_terms` export with every term in `vocabulary_introduced`. Definitions pulled verbatim from the lesson prose. Example: if the prose says "A pole audit is the field process of measuring existing conditions...", the flashcard definition is exactly that sentence (or minimal rewrite for clarity). No new definitions invented.

=== T04 BRIEF END ===
