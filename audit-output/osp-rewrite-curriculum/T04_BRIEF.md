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

## Lesson List (10 lessons, 245 min total)

| ID | Title | Type | Prerequisites | Learning objectives | Vocabulary introduced | Est. time | Interactivity |
|---|---|---|---|---|---|---|---|
| T04.L01 | The Site Walk — What You're Looking For | foundation | T01, T18 | Identify physical features, existing utilities, hazards, and photo-logging patterns during a field walk | site walk, existing utility, hazard identification, photo log | 25 min | BranchingScenario (field route decision with consequences) |
| T04.L02 | Drone and LiDAR Survey Methods | working | T01, T04.L01, T18 | Describe how drone LiDAR captures topography and obstacles; interpret point-cloud data for route planning | drone, LiDAR, point cloud, planimetric, GSD | 25 min | AnnotatedDiagram (LiDAR data layers overlay — bare earth, obstruction, canopy); WorkedExample (GSD calculation) |
| T04.L03 | GIS Landbase Creation | working | T01, T04.L01, T04.L02 | Construct a GIS landbase from aerial imagery, property boundaries, and utility records; understand coordinate systems | landbase, shapefile, geodatabase, coordinate system, datum, UTM, NAD83 | 25 min | AnnotatedDiagram (GIS layer stack — aerial image + boundary + utility overlay); Quiz (MC on layer interpretation) |
| T04.L04 | Pole Audit — Field vs. Records | working | T01, T02, T05 (aerial loading), T04.L01, T04.L03 | Measure pole attachment heights in the field; cross-check against design records; flag existing occupancy and make-ready | pole audit, attachment-height measurement, existing occupancy, make-ready flag, clearance requirement | 30 min | WorkedExample (NESC Rule 232 clearance calc: pole height − existing attachment − proposed attachment); AnnotatedDiagram (pole-cross-section labeling existing/proposed attachment heights) |
| T04.L05 | Route Alternatives Analysis | working | T01, T04.L01, T04.L03, T05 (aerial), T06 (underground) | Compare aerial vs. underground cost, constructability, environmental, and permitting tradeoffs for a given route segment | cost-effectiveness, constructability, permitting risk, route scoring, tradeoff analysis | 25 min | BranchingScenario (two route options with distinct cost/constructability/permitting profiles; learner picks based on scenario brief) |
| T04.L06 | KMZ, Shapefile, and PDF Deliverables | working | T04.L02, T04.L03 | Package GIS data for handoff to designers and stakeholders; understand format constraints and compatibility | KMZ, .SHP, geotiff, PDF/A, DWG, CAD, deliverable package, versioning | 20 min | AnnotatedDiagram (file-format comparison table); Quiz (MC on format selection for different stakeholders) |
| T04.L07 | Record-Keeping Requirements — 47 CFR 32 | working | T01, T04.L04 | Explain plant-account coding and the 15-year record-retention requirement for RUS borrowers | 47 CFR 32, plant accounting, cost allocation, record retention, RUS Form 1755-A, construction cost ledger | 20 min | Quiz (MC on document retention timelines and cost-pool allocation) |
| T04.L08 | Handing Off to Design | working | T04.L01–L07 | Assemble a complete survey handoff package; identify incomplete data before releasing to the design team | handoff package, design input, as-surveyed, design constraints, gap analysis, deliverable checklist | 20 min | BranchingScenario (incomplete handoff with missing pole data; learner decides whether to release or supplement) |

**Total: 10 lessons, 245 minutes (~4.1 hours)**

## Per-Lesson Interactivity Recommendations

- **T04.L01 (Site Walk)** — BranchingScenario (learner encounters 3 route options with different hazards/utilities; picks one + sees consequences). Quiz (MC on hazard-spotting). Flashcards (new vocab).
- **T04.L02 (Drone/LiDAR)** — AnnotatedDiagram (interactive point-cloud layer stack: bare earth, obstruction, canopy classified; click each layer to toggle). WorkedExample (GSD = pixel footprint at nadir; input image resolution + drone altitude → GSD output). Quiz (MC on interpreting LiDAR color-coded elevation). Flashcards.
- **T04.L03 (GIS Landbase)** — AnnotatedDiagram (GIS layer stack: aerial photo base → boundary outline overlay → utility-locate layer → route proposal overlay; click each layer to highlight). Quiz (MC on coordinate-system choice rationale, datum transformation tolerance). Flashcards.
- **T04.L04 (Pole Audit)** — WorkedExample (NESC Rule 232 clearance: pole height − existing attachment height − conductor sag − required clearance = clearance margin; learner inputs pole height + existing occupancy, gets worked calc + sanity check). AnnotatedDiagram (pole cross-section with existing + proposed attachment heights labeled; click each zone to show clearance rules). Quiz (MC on make-ready triggers, attachment-height measurement procedure). Flashcards.
- **T04.L05 (Route Alternatives)** — BranchingScenario (two route segments: aerial vs. UG; each has cost, constructability score, permitting complexity; learner picks + sees tradeoff consequences). Sortable (rank constructability factors: cost, ROW negotiation effort, utility coordination, environmental impact — different "correct" orders for different scenarios, learner sees why). Flashcards.
- **T04.L06 (KMZ/Shapefile/PDF)** — AnnotatedDiagram (comparison chart: format columns = GIS-native, proprietary, ArcGIS-compatible, mobile-friendly, print-friendly; rows = KMZ, SHP, geotiff, PDF/A, DWG; color-coded checkmarks). Quiz (MC on which format for each stakeholder). Flashcards.
- **T04.L07 (47 CFR 32 Record-Keeping)** — Quiz (MC on retention timeline, cost-pool assignment, RUS vs. non-RUS accounting split). Timeline/Sequence (drag 5 cost categories into the correct plant-account code order). Flashcards.
- **T04.L08 (Handoff to Design)** — BranchingScenario (learner receives survey package; missing: pole heights for 3 poles, no LiDAR coverage for 500 ft ravine section, photo log incomplete for make-ready zones; learner decides release-now-or-rework + sees consequences of incomplete handoff). Checklist / interactive (click items in the handoff checklist to self-verify completeness). Flashcards.

## Capstone Quiz Scope

**Integrative assessment: Site-to-Design Handoff Completeness** (~25 questions, 1–2 scenarios)

- **Scenario A (15 min):** Learner receives survey data for a 2-mile route: mixed aerial/UG, one river crossing, two utility poles requiring make-ready, LiDAR from 2026-02 flight. Asked: (1) spot 3 data gaps in the package; (2) which pole(s) need RTK height confirmation; (3) which GIS layers are critical for the design engineer; (4) write the cost-pool allocation for the survey cost.
- **Scenario B (branching):** Design engineer returns survey feedback: "Need updated pole-height for P14 (existing occupancy changed); LiDAR coverage missing for the 500 ft ravine." Learner proposes a remediation plan (drone re-flight? RTK re-visit? timeline trade-offs?).
- **MC questions (10):** hazard-spotting on a photo log, format selection, 47 CFR 32 retention, NESC clearance calc, route-alternative tradeoff reasoning, coordinate-system choice, deliverable-package completeness.

## Citations Table

Every standard / RUS bulletin / BICSI reference in the lesson set, with source + section/clause:

| Claim | Source | Section/Clause | Type |
|---|---|---|---|
| Pole attachment-height measurement procedure (T04.L04) | RUS Bulletin 1751F-630 | § 7 (Aerial Plant — Attachment heights and clearance) | primary |
| NESC Rule 232 clearance (vertical clearances of conductors above ground) | NESC C2-2023 | Rule 232 | primary |
| NESC Rule 250 clearance (between conductors of different circuits) | NESC C2-2023 | Rule 250 | primary |
| Clearance margin calculations — practical field procedure | RUS Bulletin 1751F-630 | § 7.2 (sag and tension tables) | primary |
| Confined-space entry hazard (manhole/handhole survey) | 29 CFR 1910.146 | § 1910.146(b) (definition of acceptable O₂ range 19.5%–23.5%) | primary |
| Fall protection for pole-top work (hazard recognition in L01) | 29 CFR 1910.268 | § 1910.268(g)(1) (fall protection at poles) | primary |
| Lockout-tagout during pole audit (de-energizing joint-use) | 29 CFR 1910.147 | Full subpart | primary |
| LiDAR point-cloud classification (L02) | FOA Reference Guide to Fiber Optics | Section on survey methods (public-domain portions) | secondary |
| GIS landbase creation (coordinate systems, datum) | USGS / NIST Standards for Geospatial Data | CRS definitions (public domain) | secondary |
| RTK GNSS positional accuracy | NIST / CORS documentation | RTK accuracy spec: sub-decimeter | secondary |
| 47 CFR 32 record retention and cost allocation (L07) | 47 CFR 32 | Full subpart; plant-account codes per USOA | primary |
| RUS Form 1755-A construction cost ledger | RUS Bulletin 1751F-630 | Appendix; RUS.USDA.gov forms | primary |
| PDF/A archival format | ISO/IEC 19005-1 (PDF/A-1) | Full standard; industry practice for 15-year retention | secondary |
| Shapefile format (.SHP) | ESRI White Paper on Shapefile Spec | Technical reference (publicly available) | secondary |
| KMZ (Google Earth) interoperability | OGC KML Standard | 2.3 (Open Geospatial Consortium) | secondary |

## Author Guardrails

1. **Vocabulary introduction discipline (STRICT).** Every term in "vocabulary_introduced" at lesson top MUST be defined in the lesson prose before that term is used in a worked example or quiz question. Cross-reference T01 + T18 vocabulary_introduced sets in the lesson's vocabulary_assumed section to ensure NO forward-references to terms not yet taught. **T04.L04 depends on "attachment height" concepts from T05 (aerial design) — clarify in the T04.L04 prereq that attachment height is T05 material that is ASSUMED to be understood.** Actually, per the ARCH.md teaching DAG, T04 comes BEFORE T05. **FIX: T04.L04 must introduce attachment-height measurement as a field-practice topic (not the design calculation), separate from T05's NESC-based design constraints.** The worked example in L04 uses NESC Rule 232 — that rule is in T05 scope, not T04. **AUTHOR GUIDANCE: In L04, frame the worked example as "measuring what's there and checking against the NESC rule that the design will use" — teach the measurement + the verification concept, but defer the full NESC Rule 232 derivation to T05.L01.**

2. **Citations with section numbers.** Every reference to RUS 1751F-630, NESC C2-2023, CFR, 47 CFR 32, etc., MUST include the section/subsection number. Do NOT write "RUS says..." without citing the section. For paywalled NESC and OSPDR, use `[confirm edition]` if the specific section is not independently verifiable.

3. **Plain-English + acronym glossary at top.** Every lesson opens with "In Plain English" (plain-language framing of why a crew cares) + an acronym table (acronym, full name, what it means in practice). Unpack every acronym on first use in the prose.

4. **Worked examples over abstract theory.** L04's "pole audit in the field" should include a real or plausible scenario: "You measure a pole as 45 ft in the field. The design drawing says 40 ft. Records show two existing attachments at heights X and Y. The new fiber attachment is proposed at height Z. What's the clearance margin? What do you flag?" Show every step.

5. **Field vs. book practice** (Carter's rule). For example:
   - **Book:** NESC Rule 232 requires 4-foot vertical clearance between OSP cable and a telephone cable on joint-use.
   - **Field:** Many older poles show 2-foot overlaps due to legacy construction standards (pre-NESC 1997). Your job in a survey is to measure what's there and flag make-ready needed to meet current code.
   - The lesson teaches BOTH — what the code says and what the crew typically finds.

6. **No AI signals.** Lessons never mention "AI," "Claude," "language model," "generated," or "auto-generated." Content reads as if a senior OSP field engineer wrote it.

7. **Safety integration (T18 foundation):** L01 (The Site Walk) opens by covering hazard spotting — confined-space indicators near manholes, fall hazards on poles, vehicle traffic on roadway shoulders, energized-line proximity. Cross-reference T18.L01 (Hazard Awareness) + T18.L02 (LOTO) in the scenario context. Don't teach the full LOTO procedure (that's T18), but flag when a survey requires de-energization coordination.

8. **47 CFR 32 framing in L07:** This is a **record-keeping and accounting** lesson, not a regulatory-compliance deep dive. Focus on: "Why does RUS require 15-year retention? (Because they audit plant investment.) What gets coded to what plant account? (Your survey cost, plus makeup labor, plus materials.) How do you justify the allocation?" Avoid tax or audit interpretation — stick to the practical workflow of logging costs and retaining supporting documents.

9. **Handing off to design (L08) as a quality gate.** Frame the BranchingScenario around the theme: "You're the quality checkpoint. If you hand off incomplete data, the designer wastes time asking for re-work. If you hand off clean, they start drawing immediately." Make it clear that a crew's reputation depends on the handoff.

10. **GIS/RTK/LiDAR language.** These are tools the crew may or may not have used before. Plain-English analogies in L02:
    - **Drone LiDAR = a camera that bounces laser light off everything and times how long the bounce takes, then draws a 3D map.**
    - **RTK GNSS = GPS that's accurate to a few centimeters instead of 30 feet, because it talks to ground stations that correct for atmospheric delays.**
    - **Shapefile = a bag of related files (.shp, .shx, .dbf) that together store one GIS layer (like "poles" or "duct runs") — think of it as a spreadsheet that also knows where things are on a map.**

11. **Avoid tool-specific workflows.** The brief assumes crews may use Datafield, Katapult, Osmose, or manual survey methods. Don't teach "how to use Datafield" — teach "what a site walk collects" and "what format it goes out in," letting the field tool be the implementation detail.

12. **Flashcard requirement.** Every lesson MUST include a `key_terms` export with every term in `vocabulary_introduced`. Definitions pulled verbatim from the lesson prose. Example: if the prose says "A pole audit is the field process of measuring existing conditions...", the flashcard definition is exactly that sentence (or minimal rewrite for clarity). No new definitions invented.

=== T04 BRIEF END ===
