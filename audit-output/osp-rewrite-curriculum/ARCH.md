# OSP Training Rewrite — Architecture Synthesis (OSP-RW.0b)

**Status:** Carter sign-off required before OSP-RW.2 scaffold begins.
**Prepared by:** Architecture Synthesis Agent (OSP-RW.0b)
**Date:** 2026-05-15
**Word count:** ~5,800

---

## Section 1: Source-of-Truth Decision — Option C (3-Way Merge, JSX-Led)

**Decision: C — JSX as pitch baseline, markdown injected for depth, verified pitch-revision diffs folded in.**

**Justification (≤200 words):**

The JSX corpus (~7,144 LOC, 89 sections) is uniformly A-grade: rigorous citations, consistent book/field callout voice, and real interactivity (LinkBudgetCalculator, OTDRTraceViewer, TopologyCanvas, CertificationSim). R-C found zero F-grade sections and only 3 B-grade. Discarding this content in favor of Option A alone wastes the highest-quality source we have.

The markdown tree (~22,000 LOC, 64 files) is structurally aligned with the per-lesson granularity we need — one .md file per lesson is already the naming convention. Its depth on topics like cable selection and hardware accessories exceeds what the JSX modules cover in those areas. Discarding it (Option A alone) leaves ~15,000 LOC of potentially usable depth on the floor.

Option B (markdown-only) abandons JSX's interactive elements and the Carter-reads-cold-passed pitch quality in M02 even + M09 odd sections, which is a direct cost with no compensating benefit.

Option C's only cost is migration complexity. This is manageable: JSX prose + interactivity = the skeleton per lesson; markdown content = depth injected into the foundations/working/advanced tiers; verified pitch-revision commits (T1-T5, SHA-verified before trust) = additive polish layer. Authors follow this priority stack for every lesson.

**Priority stack for authoring agents:**
1. JSX source section for pitch register and interactive elements
2. Markdown lesson file for depth expansion (if path exists in `content/osp-*/`)
3. SHA-verified pitch-revision content (only after git verification per R-C salvage table)
4. Net-new authoring where no source exists (new topics: Fundamentals, Route Survey, Staking, Inspection, Restoration)

---

## Section 2: Complete Topic List (Locked Proposal)

**23 topics total: 19 general + 4 cert-prep.** Teaching order is the topological sort of the prerequisite DAG (Section 3). All 18 R-A topics retained; T19 added at teaching position 7–8 (after T06, before T14) per Carter 2026-05-16. C01–C03 cert-prep topics migrated to future ISP course per Carter 2026-05-16 — removed from OSP cert track scope; C04 retains OSP Designer + CFOS/CFOT only.

**Modifications from R-A's original numbering:**
- Safety/OSHA moved from position 18 → position 2 in teaching order. Life-safety must precede every field-touching topic. The stable topic ID remains T18 for cross-referencing; the teaching sequence position is 2.
- T19 (Headend / CO + Rack-Side Hardware Basics) added at teaching position 7–8 — inserted between T06 (Underground Design, position 8) and T14 (Bonding/Grounding, position 9) in the DAG. Carter locked this position 2026-05-16. Topic ID T19 was next available general ID.
- T02 expanded: T02.L07b (Long-Haul Awareness) inserted after T02.L07; lesson count 12 → 13. G.655 coverage added to T02.L08.
- T03 expanded: T03.L05b (Multimode OM Cable Products — cable-product context for OM1–OM5 at OSP↔ISP handoff) inserted after T03.L05; lesson count 12 → 13.
- C01–C03 cert-prep topics: REMOVED from OSP course authoring scope. All three migrate to the future ISP course per Carter 2026-05-16. They are retained as entries in the topic table below (for navigation/awareness) but are NOT authored as part of OSP-RW. RCDD mock exam also removed — see Section 7.
- M07 (Fiber Topology) content distributed across Topics 16 (As-Built/GIS) and T13 (Identification/Color Codes embedded in Splicing and Testing). M07 as a standalone topic is absorbed, per R-A Section 6 recommendation.

| Teaching # | Topic ID | Topic | Scope | Est. lessons | DAG prereqs (Topic IDs) | Anchor standards | Category |
|---|---|---|---|---|---|---|---|
| 1 | T01 | Fundamentals & Vocabulary | Defines the OSP universe: what OSP vs. ISP means, parts of a pole, parts of a cable, splice-case anatomy, project lifecycle from survey to as-built. Every downstream lesson assumes this vocabulary. | 10 | none | RUS 1751F-630 §1; FOA CFOT KSAs | general |
| 2 | T18 | Safety & OSHA | OSHA 1910.268 (Telecom), 1910.269 (Power), 1910.146 (Confined Space/manholes), 1910.147 (LOTO), fall protection, PPE, PPG glove classes, traffic control, MAD/MAB awareness. Taught immediately after vocabulary so every field-touching lesson can reference it. | 10 | T01 | OSHA 1910.268, 1910.146, 1910.147; ANSI Z89.1; MUTCD | general |
| 3 | T02 | Fiber Physics | Why light travels in glass, attenuation, dispersion, macrobend/microbend, decibels, link budgets, wavelength windows used in OSP. | 12 | T01 | ITU-T G.652/G.657; TIA-568.3-D; FOA Reference | general |
| 4 | T03 | Cable Selection & Materials | Loose-tube vs. ribbon vs. rollable-ribbon, OSP-rated jackets, armor types, messenger options, RUS-listed materials, fiber-count selection, pulling tension and bend-radius specs that drive product choice. | 12 | T01, T02 | RUS 1753F-201; ICEA S-87-640; TIA-598-D | general |
| 5 | T04 | Route Survey & Pre-Engineering | Site walks, drone/LiDAR capture, GIS landbase creation, pole audits, existing-utility identification, route-alternatives analysis, the deliverables that hand off to design. | 10 | T01, T18 | Industry practice (Datafield, Katapult, Osmose); 47 CFR 32 | general |
| 6 | T09 | Permitting & Environmental | Permitting layer cake (federal/state/county/municipal), NEPA CE C-8, Section 106 NHPA/SHPO/THPO, ESA & IPaC, USACE NWP 12 (2026 reissue), state DOT encroachment, ROW/easement basics. | 12 | T01, T04 | NEPA; 36 CFR 800; USACE NWP 12; state DOT manuals | general |
| 7 | T05 | OSP Design — Aerial | NESC clearances, pole loading, grades of construction, sag/tension, loading districts, joint-use rules, attachment-height calculations, ice/wind loading, ADSS design, PON/FTTH topology at the distribution level. | 15 | T01, T02, T03, T04 | NESC C2-2023 §§23, 25, 26; RUS 1751F-630 | general |
| 8 | T06 | OSP Design — Underground | Conduit/duct selection, burial-depth rules, manhole/handhole/vault sizing, HDD vs. trenching vs. plowing decision matrix, route alignment, separation from foreign utilities. | 12 | T01, T03, T04 | RUS 1751F-635, 1751F-643; NESC §32, §35 | general |
| **9** | **T19** | **Headend / CO + Rack-Side Hardware Basics** | CO/hut/headend layout, OLT/CMTS as black boxes, –48VDC power plant, battery backup, HVAC/fire-suppression awareness, headend grounding boundary (OSP MGN to HGER/TGB), rack-side hardware (patch panels, LIU, FOSC, interconnect vs. cross-connect), and FDH internals beyond the box. Introduces 3 grounding terms (primary protector, IBT-entry, GES-tie-in) with explicit forward-references to T14. Depth ceiling: enough for an OSP engineer to design the OSP↔ISP handoff and converse with ISP technicians. ISP-side depth defers to future ISP course. | **10** | **T01, T05, T06, T18** | **TIA-607-D [confirm ed.]; TIA-568.3-D; NFPA 76; RUS 1751F-810 §3; ANSI/ATIS-0600336 (NEBS); Telcordia GR-63-CORE; BICSI 002-2024** | general |
| 10 | T14 | Bonding, Grounding & Electrical Protection | Why we ground, ground-resistance targets, MGN bonding, messenger bonding, NEC 250.52 electrodes, IBT/GES, surge protection, lightning protection, stray voltage detection and LOTO sequencing for OSP. T14.L05 assumes primary protector / IBT-entry / GES-tie-in vocab from T19. | 12 | T01, T02, T05, T06, T18, **T19** | RUS 1751F-815; NESC §9 + §215; NEC Art. 250; IEEE 1100; IEEE Std 487 | general |
| 11 | T07 | Staking | Walking the design on the ground: stake placement, call-out conventions, photographing/coding pole tags, marking proposed attachment points, capturing field measurements for make-ready packets. | 10 | T01, T04, T05, T06, T18 | RUS Form 740; industry practice | general |
| 12 | T08 | Make-Ready & Pole Attachment | OTMR vs. multi-party, the 15-day FCC clock, simple-vs-complex determinations, transfer/reframe/replacement, reading a make-ready estimate, paying attachment fees, the as-built loop back to the pole owner. | 12 | T01, T05, T07 | 47 CFR 1.1411 (OTMR); FCC 18-111; NESC §23 | general |
| 13 | T10 | OSP Construction | Call-811, HDD/trench/plow execution, conduit fill and pull tension, slack loops, manhole/handhole installation, restoration of pavement and sod, daily field reporting, traffic control integration. | 12 | T01, T06, T07, T08, T18 | RUS 1751F-635, 1751F-643; CGA Best Practices v19 | general |
| 14 | T11 | Splicing | Fusion vs. mechanical, core vs. cladding alignment, ribbon/mass splicing, splice-loss budgets, splice-case types, gel-sealing, prep tools, cleave quality, splicer maintenance, TIA-598 color codes and color-blind crew patterns. | 15 | T01, T02, T03, T10 | TIA-455; ITU-T L.400; FOA CFOS-S KSAs; RUS 1753F-401; TIA-598-D | general |
| 15 | T12 | Testing — OLTS, OTDR, Inspection | Tier-1 (OLTS) vs. Tier-2 (OTDR), pulse-width selection, dead zones, launch/receive cables, bidirectional averaging, end-face inspection (IEC 61300-3-35), event tables, acceptance criteria, dual-wavelength macrobend detection. | 15 | T01, T02, T11 | TIA-568.3-D Annex; IEC 61280-4-2; IEC 61300-3-35; FOA CFOS-T | general |
| 16 | T13 | Inspection & Quality Assurance | Walking constructed plant: visual vs. instrument inspection, pole-top inspection, attachment compliance, depth/cover verification, slack at pedestals, punch-list vs. kick-back triggers, RUS Form 219 close-out workflow. | 10 | T01, T05, T10, T12, T18 | RUS Form 219; industry QA practice | general |
| 17 | T15 | Restoration & Outage Response | Fault-locate with OTDR, splice-trailer emergency response, civil-crew coordination, temporary vs. permanent repair, Methods of Procedure (MOPs), customer communications during outages. | 10 | T01, T11, T12, T13 | FOA Restoration Guide; industry practice | general |
| 18 | T16 | As-Built Documentation & GIS | What an as-built is, splice matrix schemas, GIS export formats (SHP/GDB/KML), TIA-606-D administration classes, reconciling as-built to as-designed, fiber topology canvas, RUS Form 219 documentation package. | 10 | T01, T10, T11, T13, T15 | TIA-606-D; RUS Form 219; 47 CFR 32 | general |
| 19 | T17 | Project Estimation & Revenue | Cost data realities, aerial-vs-underground ratios, productivity modeling, contract types (lump-sum/T&M/GMP), change orders, contingency, CPHP/CPHC/FTTH KPIs, RFP/RFQ/BOM basics. | 10 | T01, T05, T06, T08, T10, T16 | FBA/Cartesian cost reports; FCC 18-111; CPHP/CPHC industry KPIs | general |
| 20 | C01 | Networking Blueprints (RCDD prep) | **MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16.** Retained as table entry for awareness only. NOT authored in OSP-RW. ISP/TIA-568/569/606/607 content: four telecom spaces, backbone vs. horizontal, work-area outlets, TIA-606-D administration, TIA-607 PBB/SBB bonding and grounding for inside plant. | 8 | T01, T02, **T19** | TIA-568/569/606/607; BICSI TDMM | cert |
| 21 | C02 | RCDD Core | **MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16.** Retained as table entry for awareness only. NOT authored in OSP-RW. Firestopping (UL 1479), EMC/FCC Part 15, power/telecom separation, ICT distribution, RCDD design checklist. | 8 | C01 | UL 1479/ASTM E814; FCC Part 15; BICSI TDMM 15 | cert |
| 22 | C03 | Data Center Standards | **MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16.** Retained as table entry for awareness only. NOT authored in OSP-RW. TIA-942-C Rated 1–4, Uptime Tier I–IV, MPO/MTP Base-8/Base-12, hot/cold aisle containment, BICSI 002-2024 vs TIA-942-C scope. | 8 | C01, C02 | TIA-942-C; Uptime Tier; BICSI 002-2024 | cert |
| 23 | C04 | Certification Practice Exam Bank | **OSP Designer + CFOS/CFOT only** (RCDD mock removed — see Section 7). Exam strategy, per-domain content reviews, timed practice rounds, scoring analysis, and final mock exams. Expanded from existing M12's 5 sections. | 12 | T01–T19 for OSP Designer; T01–T02+T11+T12 for CFOT | BICSI OSP Designer blueprint; FOA CFOS exam structures | cert |

**General-track total: 19 topics, ~222 lessons.**
_(T01–T18: 209 lessons; +T19: 10 lessons; +T02.L07b: 1 lesson; +T03.L05b: 1 lesson = 222.)_
**Cert-prep total: 4 topics, ~36 lessons (C01–C03 not authored in OSP-RW; C04 = 12 lessons).**
**Grand total: ~234 lessons authored in OSP-RW** (222 general + 12 C04). C01–C03 (24 lessons) move to future ISP course.

---

## Section 3: Cross-Curriculum Prerequisite DAG

### DAG adjacency list (reads as "must complete X before unlocking Y")

```
T01 (Fundamentals)    → T02, T03, T04, T05, T06, T07, T08, T09, T10, T11, T12,
                         T13, T14, T15, T16, T17, T18, T19 (universal root)
T18 (Safety/OSHA)     → T04, T07, T08, T10, T13, T14, T19 (every field-touching topic)
T02 (Fiber Physics)   → T03, T05, T11, T12, T14
T03 (Cable Selection) → T05, T06, T10, T11
T04 (Route Survey)    → T05, T06, T07, T09
T05 (Aerial Design)   → T07, T08, T13, T14, T17, T19
T06 (Underground Design) → T07, T10, T13, T14, T17, T19
T07 (Staking)         → T08, T10
T08 (Make-Ready)      → T10, T17
T09 (Permitting)      → T10, T17
T10 (Construction)    → T11, T13, T15, T16
T11 (Splicing)        → T12, T15, T16
T12 (Testing)         → T13, T15, T16
T13 (Inspection/QA)   → T15, T16
T14 (Grounding)       → T13 (grounding inspection is part of QA)
T15 (Restoration)     → T16
T16 (As-Built/GIS)    → T17
T17 (Estimation)      → [terminal, general-track root to cert unlock]
T19 (Headend/CO)      → C01 [future ISP course] (T19 seeds ISP vocab)
```

### Topological sort (sequential learner path)

T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → **T19** → T14 → T07 → T08 → T10 → T11 → T12 → T13 → T15 → T16 → T17 → C04 [C01/C02/C03 migrated to future ISP course]

### Vocabulary sets introduced per topic (10 terms each)

| Topic | Terms introduced | Terms assumed (from prior topics) |
|---|---|---|
| T01 | OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH | none |
| T18 | LOTO, confined space, PPG glove class, MAD/MAB, Z89.1 hard hat, MUTCD, SDS, OSHA 1910.268, permit-required confined space, atmospheric testing | T01 vocab |
| T02 | wavelength, attenuation (dB/km), dispersion (CD/PMD), MFD, macrobend, microbend, dB/dBm, link budget, OSNR, G.652.D, G.657.A1 | T01 vocab |
| T03 | loose-tube, ribbon, rollable ribbon, armor, dielectric, ADSS, RUS-listed, ICEA S-87-640, bend radius, pulling tension | T01, T02 vocab |
| T04 | landbase, LiDAR, RTK GNSS, photogrammetry, planimetric, KMZ, pole audit, attachment height, midspan clearance, route alternatives | T01, T18 vocab |
| T09 | NEPA, CE C-8, NHPA §106, SHPO, THPO, ESA, IPaC, NWP 12, ROW, easement, AHJ, encroachment permit | T01, T04 vocab |
| T05 | NESC, Rule 232, Rule 250, loading district (Light/Medium/Heavy/Extreme), grade of construction, sag-tension, joint-use, pole loading, ice loading, ADSS sag | T01, T02, T03, T04 vocab |
| T06 | HDD, open-cut, plowing, innerduct, microduct, manhole, handhole, vault, conduit fill (40% rule), pull tension | T01, T03, T04 vocab |
| T19 | CO, hut, headend (internals), OLT (as black box), CMTS, MDF, IDF, –48VDC, rectifier, battery string, ATS (automatic transfer switch), CRAC, HGER, TGB (Telecom Grounding Busbar), LIU, FOSC (rack-mount), patch panel, interconnect, cross-connect, FDH internals (modular bay, splitter cassette), primary protector (building-entry), IBT-entry, GES-tie-in | T01, T05, T06, T18 vocab |
| T14 | MGN, IBT (full electrical depth), GES (full design), bond, ground rod, ground resistance, NEC 250.52, surge arrester, stray voltage, TBB (Telecom Bonding Backbone), TMGB | T01, T02, T05, T06, T18, T19 vocab (primary protector / IBT-entry / GES-tie-in assumed from T19) |
| T07 | stake, station, P.I. (point of intersection), centerline, offset, RUS Form 740, pole tag, call-out, plan-and-profile | T01, T04, T05, T06 vocab |
| T08 | OTMR, simple attachment, complex attachment, transfer, reframe, replacement, FCC 15-day clock, attachment fee, make-ready estimate | T01, T05, T07 vocab |
| T10 | Call-811, locate ticket, daylight, sleeve, slack loop, restoration, daily field report, HDD pilot bore, backfill, compaction | T01, T06, T07, T08, T18 vocab |
| T11 | fusion splice, mechanical splice, core-align, cladding-align, MFD mismatch, cleave angle, splice case, gel seal, TIA-598 color sequence, splice tray | T01, T02, T03, T10 vocab |
| T12 | OLTS, OTDR, insertion loss, return loss, EDZ/ADZ dead zone, launch cable, bidirectional average, event analysis, IEC 61300-3-35, macrobend signature | T01, T02, T11 vocab |
| T13 | punch list, kick-back, pole-top inspection, depth verification, slack inventory, RUS Form 219, acceptance testing, QA/QC | T01, T05, T10, T12 vocab |
| T15 | fault locate, splice trailer, MOP, RPO/RTO (telecom variant), temporary patch, permanent splice, emergency mobilization | T01, T11, T12, T13 vocab |
| T16 | as-designed, as-built, splice matrix, .SHP/.GDB, .KML, TIA-606-D class 1–4, reconciliation, GIS commit | T01, T10, T11, T13, T15 vocab |
| T17 | CPHP, CPHC, FTTH take rate, lump-sum, T&M, GMP, contingency, change order, RFP, BOQ | T01, T05, T06, T08, T10, T16 vocab |

### Resolution of the 3 named prereq violations (R-C)

**Violation 1 — M01 §1.1: "dispersion/PON/DWDM/G.652" before taxonomy.**
Resolution: T01 (Fundamentals) introduces fiber types at anatomy level (SMF vs. MMF, what G.652/G.657 designations mean in plain English). T02 (Fiber Physics) then teaches dispersion as a physics phenomenon applied to already-named fiber types. G.652.D and G.657.A1 are defined in T03 (Cable Selection) at the product-spec level. Lesson T02.L01 ("Why these wavelengths?") rewrites the opening to say: "You learned in T01 what SMF and MMF are. Now we explain *why* SMF uses 1310 nm and 1550 nm." PON/DWDM architectures are deferred to T05 (Aerial Design) Lesson 14-15 (PON/FTTH OSP design).

**Violation 2 — M02 §2.2: NESC Rule 232 by number before NESC orientation.**
Resolution: T05's first lesson is "What NESC Is and How to Read It" — covers how the code is organized (Parts, Rules, Sections, Tables), what an AHJ is, why NESC governs joint-use attachments, and how to find a specific Rule. §2.1's excellent framing becomes this dedicated T05.L01 lesson. Only after that does T05.L02 teach Rule 232 vertical clearances by name and number.

**Violation 3 — M07 §7.4: 12-color sequence before color-ID fundamentals.**
Resolution: T11 (Splicing) L01 opens with "Why we color-code fibers" (position counting, the 12-color system, the 8-letter mnemonic used in the field, and the color-blind crew accommodation). T11.L02 then teaches the full TIA-598 sequence within that context, including the UPC/APC green/blue distinction and the mating prohibition. The TopologyCanvas and color-code interactive reference follow only after both foundation lessons complete.

---

## Section 4: Per-Topic Lesson List

Full 245-lesson list by topic. Capstone quizzes shown at end of each topic.

### T01 — Fundamentals & Vocabulary (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T01.L01 | What is OSP vs. ISP? | foundation | OSP, ISP, headend, OLT, ONT | 20 | Quiz (MC) | net-new |
| T01.L02 | Parts of a Pole | foundation | attachment, span, midspan, sag, grade | 20 | AnnotatedDiagram (pole cross-section) | net-new |
| T01.L03 | Parts of a Cable | foundation | sheath, buffer tube, ripcord, armor, messenger | 20 | AnnotatedDiagram (cable cross-section) | net-new |
| T01.L04 | Inside a Splice Case | foundation | splice case, splice tray, gel seal, fan-out | 20 | AnnotatedDiagram (splice case internals) | net-new |
| T01.L05 | The OSP Project Lifecycle | foundation | survey, design, permit, build, test, as-built | 25 | BranchingScenario (lifecycle decision) | net-new |
| T01.L06 | Who Does What on an OSP Job | foundation | designer, staker, make-ready crew, splicer, inspector | 20 | Quiz (MC + drag-match roles) | net-new |
| T01.L07 | Reading a Strand Map | working | strand map, FDH, NAP, drop | 25 | AnnotatedDiagram (sample strand map) | M07 §7.1 |
| T01.L08 | Key Acronyms Field Reference | foundation | all T01 vocab consolidated | 15 | Flashcard deck | net-new |
| T01.L09 | OSP Standards Landscape | foundation | RUS, NESC, TIA, NEC, FCC, BICSI — what each governs | 20 | Quiz (MC) | M02 §2.1 partial |
| T01.L10 | T01 Capstone Quiz | capstone-quiz | — | 30 | Quiz (15Q MC + drag-match) | net-new |

### T18 — Safety & OSHA (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T18.L01 | OSHA 1910.268 — Telecom Safety Overview | foundation | 1910.268, general duty clause, hazard recognition | 20 | Quiz (MC) | net-new |
| T18.L02 | Lockout/Tagout (LOTO) — 1910.147 | working | LOTO, energy isolation, lock, tag, verify | 25 | BranchingScenario (LOTO sequence) | net-new |
| T18.L03 | Confined Space Entry — Manholes | working | permit-required confined space, atmospheric testing, attendant, rescue plan | 30 | AnnotatedDiagram (manhole entry setup); Quiz | net-new |
| T18.L04 | Fall Protection — Poles and Aerial Lifts | working | lanyard, self-retracting lifeline, bucket truck, 100% tie-off | 25 | Quiz (MC) | net-new |
| T18.L05 | PPE Selection — Hands, Head, Eyes, Feet | foundation | PPG glove class (00/0/1/2), ANSI Z89.1, dielectric boots | 20 | AnnotatedDiagram (PPE chart) | net-new |
| T18.L06 | Traffic Control — MUTCD Basics | working | MUTCD, TCP, flagger certification, work zone setup | 25 | BranchingScenario (work zone setup) | net-new |
| T18.L07 | Working Near Energized Conductors | working | MAD/MAB, approach distance table, NESC §9, 1910.269 | 25 | WorkedExample (MAD calc for voltage class); Quiz | net-new |
| T18.L08 | Hazardous Materials on an OSP Job | working | SDS, fill-gel exposure, HDPE fumes, silica dust | 20 | Quiz (MC) | net-new |
| T18.L09 | Incident Reporting and OSHA 300 Log | foundation | OSHA 300, recordable incident, near-miss, first report | 20 | Quiz (MC) | net-new |
| T18.L10 | T18 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + scenario) | net-new |

### T02 — Fiber Physics (13 lessons — T02.L07b added 2026-05-16; G.655 added to T02.L08)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T02.L01 | Why Light Travels in Glass | foundation | total internal reflection, core, cladding, NA | 20 | AnnotatedDiagram (ray diagram) | M01 §1.1 (rewrite opening) |
| T02.L02 | Attenuation — Three Numbers Framework | working | spec/typical/planning dB/km triplet | 30 | WorkedExample (budget with 3 numbers); Quiz | M01 §1.2 |
| T02.L03 | Dispersion — Why Fast Signals Blur | working | CD, PMD, MFD, coherent systems | 25 | Quiz (MC + drag-match) | M01 §1.3 |
| T02.L04 | Macrobend and Microbend | working | macrobend, microbend, mandrel test | 20 | AnnotatedDiagram (bend test); Quiz | M01 §1.4 |
| T02.L05 | Decibels Without the Algebra Fear | foundation | dB, dBm, log ratio, µW to dB | 30 | WorkedExample (step-by-step log conversion); Quiz | M01 §1.5 (B-grade → full rewrite) |
| T02.L06 | Link Budget — Worked Example | working | Tx power, Rx sensitivity, safety margin, budget | 35 | WorkedExample (LinkBudgetCalculator); Quiz | M01 §1.6 + component |
| T02.L07 | Wavelength Windows — 850/1310/1550/1625 | working | wavelength, CWDM, DWDM window, O/E/S/C/L band | 25 | AnnotatedDiagram (wavelength spectrum) | M01 §1.1 (moved here) |
| T02.L07b | Long-Haul Awareness — When Feeder Meets a Carrier | working | coherent optics, DWDM channel, transponder, mux/demux (ROADM concept), ILA (in-line amplifier), handoff demarc | 25 | AnnotatedDiagram (feeder-to-long-haul handoff point); Quiz (MC) | net-new; standards: ITU-T G.694.1 [paywalled — confirm edition], ITU-T G.671 [paywalled], ITU-T G.698.2 [paywalled]; secondary: FOA Reference Guide, G.652.D/G.654.E PMD spec context |
| T02.L08 | Single-Mode vs. Multimode — Choosing | working | SMF, MMF, OM1, OM2, OM3, OM4, OM5, OS2, reach table, laser-optimized MMF, G.655 (NZ-DSF) | 25 | Quiz (MC + drag-match) | M01 §1.1 + M03 §3.6 partial; **G.655 paragraph added** (ITU-T G.655 — Non-Zero Dispersion-Shifted SMF; used in carrier DWDM backbones where chromatic dispersion must be balanced); OM1/OM2 Flashcard cards added |
| T02.L09 | Polarization Mode Dispersion (Advanced) | advanced | PMD, DGD, SOPMD, PMD-limited span | 20 | Quiz (MC) | net-new (R-A gap) |
| T02.L10 | Fiber Characterization Testing | working | OTDR characterization, CD measurement, PMD measurement | 20 | Quiz (MC) | net-new (R-A gap) |
| T02.L11 | Fiber Physics in the Field vs. the Book | working | real-world attenuation variation, bend-insensitive smf, field gotchas | 20 | BranchingScenario (troubleshoot high attenuation) | net-new |
| T02.L12 | T02 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + WorkedExample verify) | net-new — **NOTE: formerly L12; now re-labeled L13 in teaching order; file stays L12.t02-capstone-quiz.jsx on disk** |

**Note for authoring agent:** The capstone quiz file (`L12.t02-capstone-quiz.jsx`) stays at its current filename. The new `L07b` lesson inserts between `L07` and `L08` in the lesson sequence. The `lessonFileIndex` key `'T02.L07b'` must be added pointing to `'../lessons/T02/L07b.long-haul-awareness.jsx'`.

### T03 — Cable Selection & Materials (13 lessons — T03.L05b added 2026-05-16)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T03.L01 | Loose-Tube vs. Tight-Buffer vs. Ribbon | foundation | loose-tube, tight-buffered, ribbon, rollable-ribbon | 25 | AnnotatedDiagram (cable constructions); Quiz | net-new |
| T03.L02 | OSP vs. Riser vs. Indoor/Outdoor Rating | foundation | OSP, OFNR, OFNP, outdoor-rated, dual-rated | 20 | Quiz (MC + drag) | net-new |
| T03.L03 | Armor and Jacket Selection | working | rodent-proof armor, interlocked armor, direct-burial, plenum | 25 | BranchingScenario (select cable for environment) | net-new |
| T03.L04 | Messenger Cable — Lashed vs. ADSS | working | ADSS, messenger, lashing wire, sag-tension for dielectric | 25 | WorkedExample (ADSS sag calc) | M01 §1.4 + net-new |
| T03.L05 | G.652 vs. G.657 — When to Use Bend-Insensitive | working | G.652.D, G.657.A1, G.657.A2, ITU-T bend spec | 20 | Quiz (MC + drag) | M01 §1.4 |
| T03.L05b | Multimode Fiber Cable Products — OM Grades at the OSP↔ISP Handoff | working | OM cable product context, jacket color convention (book vs. field), VCSEL vs. DFB transceiver cost implication, OSP-always-SMF rule, OM3/OM4/OM5 cable form factors at CO/FDH entry | 30 | WorkedExample (why OM4 can't reach 4 km OSP run — 10× over limit vs. OS2 with 26.6 dB margin remaining); Quiz (MC + drag-match OM grade to jacket color and max reach) | T02.L08 assumed for OM1–OM5 physics; net-new cable-product context; standards: IEC 60793-2-10 [paywalled — confirm ed.]; TIA-492AAAB (OM2) [paywalled]; TIA-492AAAD (OM4) [paywalled]; TIA-492AAAE (OM5) [paywalled]; TIA-568.3-D (jacket colors); IEEE 802.3 (reach values) |
| T03.L06 | RUS Acceptance Listing — What It Means | working | RUS-listed, 1753F-201, acceptance testing, buy-American | 25 | Quiz (MC); BranchingScenario (spec a RUS job) | net-new |
| T03.L07 | Fiber Count Selection | working | fiber count, fill ratio, dark fiber, growth margin | 25 | WorkedExample (count calc for routes with splits) | net-new |
| T03.L08 | Cable Pulling Tension and Bend Radius | working | max pull tension, minimum bend radius, kellems grip, mid-assist | 30 | WorkedExample (tension calc); AnnotatedDiagram | content/osp-cable-selection/ (SHA-verified) |
| T03.L09 | Gel-Filled vs. Dry-Block vs. Water-Blocked | working | flooding compound, water-blocking tape, dry-block, gel cleanup | 20 | Quiz (MC) | net-new |
| T03.L10 | ICEA S-87-640 and TIA-598-D Standards | advanced | ICEA S-87-640, TIA-598-D, color code standard, qualification test | 20 | Quiz (MC) | net-new |
| T03.L11 | Cable Specification Reading — Real Datasheet | working | spec interpretation, tolerance bands, aging factors | 25 | WorkedExample (walk a vendor datasheet) | net-new |
| T03.L12 | T03 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + BranchingScenario) | net-new |

**Note for authoring agent:** T03.L05b is a new file `L05b.multimode-om-cable-products.jsx`. It does NOT re-teach the physics of OM1–OM5 (T02.L08 owns that). It teaches CABLE PRODUCT selection: which OM grade appears in which cable form factor, where an OSP engineer encounters multimode at the OSP↔ISP handoff, and the OSP-always-SMF rule with the worked math showing why (OM4 max 400 m vs. any OSP run). The `vocabulary_assumed` block cites T02.L08 for all OM1–OM5 terms. Do NOT rename on-disk files T03.L06–L12. Add `'T03.L05b'` to `lessonFileIndex`.

### T04 — Route Survey & Pre-Engineering (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T04.L01 | The Site Walk — What You're Looking For | foundation | site walk, existing utility, hazard identification, photo log | 25 | BranchingScenario (field route decision) | net-new |
| T04.L02 | Drone and LiDAR Survey Methods | working | drone, LiDAR, point cloud, planimetric, GSD | 25 | AnnotatedDiagram (LiDAR data layer) | net-new |
| T04.L03 | GIS Landbase Creation | working | landbase, shapefile, geodatabase, coordinate system, datum | 25 | AnnotatedDiagram (GIS layer stack) | M03 §3.6 partial |
| T04.L04 | Pole Audit — Field vs. Records | working | pole audit, attachment height measurement, existing occupancy, make-ready flag | 30 | WorkedExample (height + clearance calc); AnnotatedDiagram | net-new |
| T04.L05 | Route Alternatives Analysis | working | cost-effectiveness, constructability, permitting risk, route scoring | 25 | BranchingScenario (aerial vs. underground route tradeoff) | net-new |
| T04.L06 | KMZ, Shapefile, and PDF Deliverables | working | KMZ, .SHP, PDF/A, DWG, deliverable package | 20 | Quiz (MC) | M03 §3.6 partial |
| T04.L07 | Record-Keeping Requirements — 47 CFR 32 | working | 47 CFR 32, plant accounting, cost allocation, record retention | 20 | Quiz (MC) | net-new |
| T04.L08 | Handing Off to Design | working | handoff package, design input, as-surveyed, design constraints | 20 | BranchingScenario (incomplete handoff consequences) | net-new |
| T04.L09 | Pre-Engineering for RUS Jobs | working | RUS pre-engineering, Form 740 inputs, budget vs. engineering | 20 | Quiz (MC) | net-new |
| T04.L10 | T04 Capstone Quiz | capstone-quiz | — | 30 | Quiz (15Q MC + BranchingScenario) | net-new |

### T09 — Permitting & Environmental (12 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T09.L01 | The Permitting Layer Cake | foundation | federal/state/county/municipal, federal nexus, jurisdictional | 25 | AnnotatedDiagram (layer cake diagram); Quiz | M03 §3.1 |
| T09.L02 | NEPA — CE, EA, and EIS | working | NEPA, CE C-8, EA, FONSI, EIS, extraordinary circumstances | 30 | Quiz (MC + drag) | M03 §3.2 |
| T09.L03 | Section 106 — Historic Properties | working | NHPA §106, SHPO, THPO, APE, 30-day clock, finding of effect | 30 | BranchingScenario (§106 adverse effect path) | M03 §3.3 |
| T09.L04 | ESA, Bats, and IPaC | working | ESA, T&E species, IPaC, Section 7, biological assessment | 25 | Quiz (MC) | M03 §3.4 |
| T09.L05 | USACE NWP 12 — The 2026 Reissue | working | NWP 12, PCN, PRE, waters of the US, 2026 changes | 25 | Quiz (MC) | net-new (R-A: NWP 12 2026 update) |
| T09.L06 | State DOT Encroachment Permits | working | encroachment permit, PE stamp, TCP, surety bond | 25 | BranchingScenario (permit path by state) | M03 §3.5 |
| T09.L07 | ROW, Easements, and Private Property | working | prescriptive easement, license, fee-simple, dedication | 25 | Quiz (MC) | M02 §2.7 |
| T09.L08 | Municipal ROW — Timelines and Reality | working | franchise agreement, municipal fiber fee, ROW restoration, timeline | 25 | BranchingScenario (delay scenario) | M03 §3.5 |
| T09.L09 | Tribal Coordination — THPO and NHO | working | THPO, NHO, government-to-government, sacred sites | 20 | Quiz (MC) | net-new |
| T09.L10 | Permit Tracking and the PM Problem | working | permit log, shot clock, OTMR interface, critical path | 20 | Quiz (MC) | M03 §3.7 partial |
| T09.L11 | RUS Environmental Review | advanced | RUS environmental report, CE checklist, BEAD environmental | 20 | Quiz (MC) | net-new |
| T09.L12 | T09 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + BranchingScenario) | net-new |

### T05 — OSP Design — Aerial (15 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T05.L01 | What NESC Is and How to Read It | foundation | C2-2023, Rule, Table, Part, AHJ, paywalled standard | 25 | Quiz (MC) | M02 §2.1 (expanded) |
| T05.L02 | Vertical Clearance — Rule 232 | working | Rule 232, Table 232-1, track, road, water clearances | 30 | WorkedExample (clearance calc at wire crossing); Quiz | M02 §2.2 |
| T05.L03 | Comm-to-Supply Separation — Rule 235 | working | Rule 235, communication worker safety zone, neutral | 25 | AnnotatedDiagram (pole cross-section); Quiz | M02 §2.3 |
| T05.L04 | Grades of Construction | working | Grade B, Grade C, Grade N, redundancy factors | 25 | Quiz (MC + drag-match) | net-new |
| T05.L05 | Pole Loading — Section 26 | working | pole load, horizontal component, wind span, weight span | 30 | WorkedExample (pole load sum); AnnotatedDiagram | M02 §2.4 |
| T05.L06 | Loading Districts — Rule 250 | working | Light/Medium/Heavy/Extreme Wind, ice load, psf, loading map | 30 | WorkedExample (ice+wind load for Macon GA); AnnotatedDiagram | M02 §2.5 |
| T05.L07 | Sag-Tension — Catenary Math | advanced | catenary, sag, horizontal tension, initial vs. final sag | 35 | WorkedExample (sag formula step-by-step) | net-new (R-A gap) |
| T05.L08 | Joint Use — Who Owns What on the Pole | working | joint use, attachment agreement, overlashing rights, ILA | 25 | BranchingScenario (attachment conflict) | M02 §2.6 partial |
| T05.L09 | OTMR in Aerial Design | working | OTMR, 15-day clock, simple vs. complex (design side) | 25 | Quiz (MC) | M02 §2.8 partial |
| T05.L10 | ADSS Aerial Design | working | ADSS, wind drag, self-damping, hardware attachment | 30 | WorkedExample (ADSS sag + tension) | net-new (R-B recommendation) |
| T05.L11 | OPGW and Hybrid Cables | advanced | OPGW, shield wire replacement, ground fault | 20 | Quiz (MC) | net-new |
| T05.L12 | PON / FTTH Aerial Topology | working | PON, GPON, EPON, split ratio, power budget, FDH placement | 30 | WorkedExample (FTTH link budget aerial); AnnotatedDiagram | net-new (R-B recommendation) |
| T05.L13 | Make-Ready in the Design | working | make-ready cost estimate, transfer conflict, design hold | 25 | BranchingScenario (design-to-make-ready handoff) | M02 §2.6 + M03 §3.7 |
| T05.L14 | Aerial Design QA Checklist | hands-on-walkthrough | design check, clearance verification, pole-load summary | 25 | BranchingScenario (find the clearance error in a design) | net-new |
| T05.L15 | T05 Capstone Quiz | capstone-quiz | — | 30 | Quiz (25Q MC + WorkedExample verify) | net-new |

### T06 — OSP Design — Underground (12 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T06.L01 | HDD vs. Open-Cut vs. Plowing | foundation | HDD, open-cut trench, plowing, decision matrix | 25 | BranchingScenario (choose method for soil/depth) | M09 §9.2 |
| T06.L02 | Burial Depth Rules — Federal, State, Local | working | RUS 1751F-635, NEC 830.47, AHJ override, minimum cover | 30 | WorkedExample (depth by soil/cover type); Quiz | M09 §9.3 |
| T06.L03 | Conduit and Innerduct Selection | working | Sch 40/80 PVC, HDPE, microduct, innerduct, pull string | 25 | AnnotatedDiagram (conduit stack); Quiz | M09 §9.4 partial |
| T06.L04 | Conduit Fill and Pull Tension | working | conduit fill (40%), pull tension, jam ratio, coefficient of friction | 30 | WorkedExample (fill and tension calc) | M09 §9.4 |
| T06.L05 | Manhole, Handhole, and Vault Sizing | working | manhole, handhole, vault, H-20 loading, traffic vs. non-traffic | 25 | AnnotatedDiagram (access structure types); Quiz | M09 §9.5 |
| T06.L06 | Separation from Foreign Utilities | working | separation, APWA color, parallel separation, crossing separation | 25 | AnnotatedDiagram (utility cross-section); Quiz | net-new + M09 §9.1 partial |
| T06.L07 | Directional Boring — Pilot and Ream | working | pilot bore, reaming, swabbing, bentonite slurry, ground heave | 25 | BranchingScenario (HDD problem scenarios) | net-new |
| T06.L08 | Riser, Pedestal, and NIU Placement | working | riser, pedestal, NIU, terminal, access spacing | 25 | AnnotatedDiagram (pedestal layout) | content/osp-hardware-accessories/ partial |
| T06.L09 | NESC Underground Rules §32, §35 | advanced | NESC §32, §35, supply/communication separation underground | 20 | Quiz (MC) | net-new |
| T06.L10 | RUS 1751F-643 — Innerduct Standard | advanced | 1751F-643, innerduct qualification, traceability | 20 | Quiz (MC) | net-new |
| T06.L11 | Underground Design QA Checklist | hands-on-walkthrough | design check, depth verification on plan, fill calc | 20 | BranchingScenario (find the depth error) | net-new |
| T06.L12 | T06 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + WorkedExample) | net-new |

### T19 — Headend / CO + Rack-Side Hardware Basics (10 lessons) — ADDED 2026-05-16

**Teaching position:** 9 (after T06 Underground Design, before T14 Bonding/Grounding). Carter locked position 2026-05-16.

**DAG prereqs:** T01, T05, T06, T18.

**Audience depth ceiling:** OSP engineer needs enough knowledge to: (a) design the OSP↔ISP handoff correctly on a drawing, (b) communicate with CO/ISP technicians using their vocabulary, (c) specify the building-entry grounding point on the engineering package. NOT required: full CO design, HVAC sizing, NEBS certification, TIA-607 interior design. That depth is ISP-course scope.

**Field-practice gap this topic closes:** Most OSP engineers stop at the building entry on their drawing. In field practice this means the CO-entry primary protector, duct seal, and armor bond are often omitted from the OSP spec package because "that's the CO team's problem." It is NOT — on RUS-program builds, the OSP engineer owns the building envelope, power spec, and building-entry grounding through the IBT. Lessons are explicitly designed to show this.

**Critical book-vs-field gap (R-B research, Scenario 3):** Feeder cable armor bonded to nearest available ground (field shortcut) vs. TIA-607 single-point IBT at building entry (book). Shortcut destroys OLT line cards in GPR events. T19.L06 must teach both sides with the consequences.

| ID | Title | Type | Key vocab introduced | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T19.L01 | CO / Hut / Headend — What the Building Is | foundation | CO (Central Office), hut, headend, MDF, IDF, equipment room, MER (Main Equipment Room), TR (Telecommunications Room) | 20 | AnnotatedDiagram (headend floor-plan — rack bays, battery plant, HVAC zone, entry conduit penetration) | net-new; M05 §5.1 partial migration (MDF/IDF); TIA-942-C §5 awareness; **NEC 770.26 scope note:** OSP-rated (OFNR/OFNP/OFNRX/OFNPX) cable can run max 50 ft inside building before transitioning to indoor-rated or continuous conduit — cross-ref to L08 |
| T19.L02 | OLT and CMTS as Black Boxes | foundation | OLT (Optical Line Terminal), CMTS (Cable Modem Termination System), GPON port, DOCSIS, upstream/downstream signal path | 20 | Quiz (MC + drag-match signal path from feeder fiber to subscriber) | net-new; ANSI/ATIS-0600336 awareness |
| T19.L03 | –48VDC Power Plant — Why DC, Not AC | working | –48VDC, rectifier, distribution bus, battery string, float voltage, negative-ground convention | 25 | WorkedExample (battery backup runtime calc: OLT draw × Ah rating = hours; sanity-check against RUS headend spec minimum); Quiz | net-new; Telcordia GR-63-CORE [paywalled — confirm]; ANSI/ATIS-0600336; book-vs-field: full –48VDC battery plant (book/large CO) vs. UPS-on-AC (field/rural hut) |
| T19.L04 | Battery Backup and Generator Transfer | working | UPS, generator, ATS (automatic transfer switch), runtime, VRLA battery, N+1 string redundancy | 20 | BranchingScenario (power failure sequence: utility loss → battery → generator start → transfer → battery float restore) | net-new; NFPA 110-2022 §8.4 (generator test schedule) [paywalled — confirm]; BICSI 002-2024 (N+1 recommendation) [paywalled]; book-vs-field: N+1 HVAC + weekly generator test (book) vs. single mini-split + test-only-before-storm (field/rural) |
| T19.L05 | HVAC and Fire Suppression — Awareness | foundation | CRAC (Computer Room Air Conditioning), sensible heat load, clean-agent suppression (FM-200/Novec 1230), pre-action sprinkler, ASHRAE A2 envelope | 15 | Quiz (MC — select the right suppression type for CO vs. server room) | net-new; NFPA 76-2022 (telecom fire protection) [paywalled]; NFPA 75 (IT equipment fire protection) [paywalled]; TIA-942-C §6.1 |
| T19.L06 | Headend Grounding — Where OSP MGN Terminates | working | HGER (Headend Ground Electrode Ring/Rail), TGB (Telecommunications Grounding Busbar), TBB (Telecommunications Bonding Backbone) [forward-ref: T14 owns full design], primary protector (building entry, introduces here), IBT-entry (building-entry bond point, introduces here), GES-tie-in (introduces here) | 30 | AnnotatedDiagram (OSP feeder → armor bond → building-entry IBT → TMGB → TGB rack chain); WorkedExample (trace the GPR fault-current path without primary protector vs. with) | net-new; RUS 1751F-810 §3 (OSP-side building-entry bonding); NEC Art. 250.94 (IBT requirement); TIA-607-D §7 and §9 [paywalled — confirm edition]; IEEE Std 487 (GPR context); **book-vs-field CRITICAL:** single-point IBT at entry (book/TIA-607) vs. nearest available ground bus (field shortcut) → OLT line-card destruction in GPR event. This is the single most consequential OSP-to-CO handoff mistake. |
| T19.L07 | Rack-Side Hardware — Patch Panels and LIU | working | patch panel, LIU (Light Interface Unit), interconnect, cross-connect, port density, SC/LC/MPO connector field | 25 | AnnotatedDiagram (rack layout: ODF top, battery plant bottom, OLT shelf mid); Quiz (MC + drag-match: which port type → which application) | net-new; M05 §5.2 partial; TIA-568.3-D §6 (interconnect vs. cross-connect definition); book-vs-field: TIA-568 cross-connect vocabulary vs. field shorthand ("the patch point", "the panel") |
| T19.L08 | FOSC and Splice Enclosures in the Headend | working | rack-mount FOSC, splice tray, express vs. split fiber, pigtail termination | 20 | AnnotatedDiagram (FOSC inside headend vs. outside plant FOSC — same product, different mounting); Quiz | net-new; NEC Art. 770 (building-entry cable requirements); **NEC 770.26 scope:** OSP cable 50-ft limit + transition to OFNR/OFNP or continuous conduit — cable entry demarc point lesson objective |
| T19.L09 | FDH Internals — Beyond the Box | working | FDH (Fiber Distribution Hub) internals, modular bay, splitter cassette, connector field, demarc, drop fiber routing at FDH | 25 | AnnotatedDiagram (FDH modular bay + splitter cassette + connector field labeled); BranchingScenario (fiber routing decision: express through FDH vs. split at FDH vs. split at pedestal) | net-new; RUS FTTH design guides; field practice: connector-field labeling at FDH is often the first place the TIA-606-D administration standard is ignored (marker-on-tape vs. machine-readable) |
| T19.L10 | T19 Capstone Quiz | capstone-quiz | — | 30 | Quiz (15Q MC + AnnotatedDiagram identify — label the headend floor-plan zones) | net-new |

**Build sequencing note:** T19 depends on T06 (Underground) being authored + RT-verified first, since T19.L01 references conduit-entry routing as an assumed concept. T19 may be dispatched in Batch C (parallel with T05 and T14, per Section 8) — T19 does not depend on T14 (it precedes T14 in teaching order). T19 is independent of T07/T08/T10/T11/T12.

**T14 update — vocabulary_assumed:** When T14.L05 is authored, its `vocabulary_assumed` block MUST include:
```jsx
vocabulary_assumed: [
  { term: 'primary protector', definition: 'Building-entry surge protection device', source_lesson_id: 'T19.L06' },
  { term: 'IBT-entry', definition: 'Intersystem bonding termination at building entry', source_lesson_id: 'T19.L06' },
  { term: 'GES-tie-in', definition: 'Connection of OSP feeder armor/messenger to the building grounding electrode system', source_lesson_id: 'T19.L06' },
]
```

---

### T14 — Bonding, Grounding & Electrical Protection (12 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T14.L01 | Why We Ground — The Drain Analogy | foundation | grounding, bonding, fault current, equipotential | 20 | Quiz (MC) | net-new |
| T14.L02 | MGN — Multi-Grounded Neutral | working | MGN, neutral wire, grounds per mile, NESC §9 | 25 | AnnotatedDiagram (MGN system diagram); Quiz | net-new |
| T14.L03 | Messenger Bonding Rules | working | messenger bond, NESC §215C/D, bonded-messenger separation | 25 | WorkedExample (separation calc with bonded messenger) | net-new |
| T14.L04 | NEC 250.52 Electrodes | working | ground rod, concrete-encased electrode (Ufer), water pipe, 4 AWG | 25 | Quiz (MC + drag-match electrodes) | net-new |
| T14.L05 | IBT and GES — Full Electrical Depth | working | IBT (full mechanics), GES (design, sizing, IEEE 81 testing), TBB (Telecom Bonding Backbone), TMGB (Telecom Main Grounding Busbar) | 25 | AnnotatedDiagram (IBT/GES placement + TBB/TMGB chain) | net-new; **vocabulary_assumed from T19:** `primary protector` (T19.L06), `IBT-entry` (T19.L06), `GES-tie-in` (T19.L06). T14.L05 MUST open with: "In T19.L06 you saw the OSP cable bond into the building-entry IBT point. Now here's the full electrical depth: why that bond matters, how the GES is designed and tested, and how TIA-607's TBB/TMGB chain carries the ground connection through the building." |
| T14.L06 | Ground Resistance Testing — IEEE 81 | working | IEEE 81, fall-of-potential, 25 Ω target, 5 Ω target | 30 | WorkedExample (3-point measurement calc) | net-new |
| T14.L07 | Surge Arresters and Lightning Protection | working | surge arrester, primary protector, MOV, gap arrester | 25 | Quiz (MC + drag-match components) | M06 §6.6 (field side only) |
| T14.L08 | Stray Voltage Detection and Remediation | working | stray voltage, induced AC voltage, ground rod tester, LOTO sequence | 25 | BranchingScenario (stray voltage on messenger pre-splice) | net-new |
| T14.L09 | Cathodic Protection Basics | working | cathodic protection, NACE SP0169, dielectric flange, corrosion cell | 20 | Quiz (MC) | net-new (T6 §L6.9 resolved, R-B confirms) |
| T14.L10 | RUS 1751F-815 Bonding and Grounding | advanced | 1751F-815, aerial plant bonding schedule, ground test log | 25 | Quiz (MC); WorkedExample (RUS ground test log) | net-new |
| T14.L11 | NESC §9 Grounds-Per-Mile Requirement | advanced | grounds per mile, NESC §9, rural vs. urban rate | 20 | WorkedExample (route grounding plan) | net-new |
| T14.L12 | T14 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + WorkedExample verify) | net-new |

### T07 — Staking (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T07.L01 | What a Staker Does — Field Role | foundation | staker, stake, call-out, field verification | 20 | Quiz (MC) | net-new |
| T07.L02 | Reading Plans in the Field | working | plan-and-profile, stationing, offset, PI | 25 | AnnotatedDiagram (reading a staking plan) | net-new |
| T07.L03 | Photographing and Coding Pole Tags | working | pole tag, GPS coordinate, SCID, attachment photo | 25 | AnnotatedDiagram (pole tag anatomy); BranchingScenario | net-new |
| T07.L04 | Measuring Existing Attachments | working | attachment height measurement, clearance field measurement, tape vs. laser | 25 | WorkedExample (measure + check against Rule 232) | net-new |
| T07.L05 | Staking Notes — RUS Form 740 | working | RUS Form 740, staking sheet, field notes, annotation | 25 | Quiz (MC + drag) | net-new |
| T07.L06 | Make-Ready Data Collection | working | make-ready packet, transfer flag, replacement flag, burden of proof | 25 | BranchingScenario (identify make-ready needs during staking) | net-new |
| T07.L07 | Underground Staking — Marking the Route | working | survey stake, offset stake, flagging, bore pit location | 20 | AnnotatedDiagram (underground staking pattern) | net-new |
| T07.L08 | Katapult and GIS-Based Staking Tools | working | Katapult, FieldCom, digital staking, photo-attach | 25 | AnnotatedDiagram (digital staking workflow) | net-new |
| T07.L09 | Staking QA — What the Engineer Reviews | working | QA review, catch rate, field-vs-design conflict | 20 | BranchingScenario (engineer reviews staking package) | net-new |
| T07.L10 | T07 Capstone Quiz | capstone-quiz | — | 30 | Quiz (15Q MC + BranchingScenario) | net-new |

### T08 — Make-Ready & Pole Attachment (12 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T08.L01 | OTMR vs. Multi-Party — The FCC Rule | foundation | OTMR, multi-party, FCC 18-111, 47 CFR 1.1411 | 25 | Quiz (MC) | M02 §2.8 + M03 §3.7 |
| T08.L02 | The 15-Day Clock | working | 15-day clock, self-help remedy, FCC enforcement | 25 | BranchingScenario (clock scenario) | M03 §3.7 partial |
| T08.L03 | Simple vs. Complex Attachment | working | simple attachment, complex attachment, determination criteria | 25 | Quiz (MC + drag-match) | net-new |
| T08.L04 | Transfer — Moving Someone Else's Wire | working | transfer, height compliance, make-ready cost causation | 25 | AnnotatedDiagram (transfer mechanics); Quiz | net-new |
| T08.L05 | Reframe — Adjusting Without Moving | working | reframe, rearrangement, power-utility-owned | 20 | Quiz (MC) | net-new |
| T08.L06 | Pole Replacement in Make-Ready | working | pole replacement, joint cost, replacement analysis | 25 | WorkedExample (split cost scenario) | net-new |
| T08.L07 | Reading a Make-Ready Estimate | working | MRE line items, labor rate, materials, contingency | 30 | WorkedExample (walk a real-format MRE); BranchingScenario | M11 §11.3 |
| T08.L08 | Attachment Fees and Annual Rents | working | attachment fee, annual rental, FCC rate methodology | 25 | WorkedExample (fee calc per FCC formula) | net-new |
| T08.L09 | Application, Permit, and Inspection Path | working | attachment application, permit, inspection, tie-in notice | 25 | BranchingScenario (application to in-service) | net-new |
| T08.L10 | As-Built Notification Back to Pole Owner | working | as-built notice, pole-loading update, NESC compliance cert | 20 | Quiz (MC) | net-new |
| T08.L11 | Make-Ready as a PM Problem | advanced | critical path, make-ready float, schedule risk | 20 | BranchingScenario (schedule slip scenario) | M03 §3.7 |
| T08.L12 | T08 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + BranchingScenario) | net-new |

### T10 — OSP Construction (12 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T10.L01 | Call-811 Before You Dig | foundation | Call-811, locate ticket, APWA color codes, ticket validity, CGA | 25 | AnnotatedDiagram (APWA color map); Quiz | M09 §9.1 |
| T10.L02 | HDD Execution — From Bore Pit to Pull | working | pilot bore, reaming, slurry management, product pull | 30 | BranchingScenario (HDD through rock) | M09 §9.2 |
| T10.L03 | Open-Cut Trench and Plow Execution | working | trenching, plowing, shoring, open-cut restoration | 25 | Quiz (MC) | M09 §9.2 |
| T10.L04 | Burial Depth Verification | working | depth probe, hand-dig, inspector sign-off, cover card | 25 | WorkedExample (depth at crossing calc + check) | M09 §9.3 |
| T10.L05 | Conduit Pulling — Load Calculation | working | pull tension, capstan, mid-assist, fish tape | 30 | WorkedExample (pull tension over 3 bends) | M09 §9.4 |
| T10.L06 | Slack Loops — Why and Where | working | slack loop, storage coil, MSA, NIU slack, expansion loop | 25 | AnnotatedDiagram (slack loop at pedestal); Quiz | M09 §9.6 |
| T10.L07 | Manhole and Handhole Installation | working | cast-in-place, pre-cast, traffic loading, frame-and-cover | 25 | AnnotatedDiagram (manhole assembly); Quiz | M09 §9.5 |
| T10.L08 | Pavement and Sod Restoration | working | trench backfill, compaction, pavement match, sod restoration | 20 | BranchingScenario (restoration dispute) | net-new |
| T10.L09 | Traffic Control in Construction Zones | working | MUTCD Part 6, TCP, flagger station, lane closure | 25 | AnnotatedDiagram (work zone layout) | T18 cross-ref |
| T10.L10 | Daily Field Reporting | working | daily field report (DFR), quantity tracking, deviation log | 20 | BranchingScenario (DFR discrepancy) | net-new |
| T10.L11 | Construction QA — Inspector's Role | working | field inspector, punch-list trigger, kick-back authority | 20 | BranchingScenario (inspector finds depth violation) | net-new |
| T10.L12 | T10 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + BranchingScenario) | net-new |

### T11 — Splicing (15 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T11.L01 | Why We Color-Code Fibers | foundation | TIA-598 color sequence, 12-color, mnemonic, color-blind accommodation | 20 | AnnotatedDiagram (color tube/fiber map); Quiz | M07 §7.4 (moved here per DAG fix) |
| T11.L02 | TIA-598 Color Sequence — Every Fiber | working | all 12 colors, tube color, fiber position counting | 25 | Quiz (MC + drag-match colors) | M07 §7.4 |
| T11.L03 | Splice Loss — Four Numbers | working | FOA 0.15, field ≤0.05, ITU-T 0.10, contract 0.30 dB | 30 | WorkedExample (accept/reject a measured splice); Quiz | M04 §4.1 |
| T11.L04 | Fusion Splicing — Step by Step | foundation | arc, strip, clean, cleave, align, splice, test | 30 | AnnotatedDiagram (fusion splicer operation); Quiz | M04 §4.2 |
| T11.L05 | Core-Align vs. Cladding-Align | working | LID, core-align, cladding-align, MFD mismatch | 25 | WorkedExample (MFD mismatch loss prediction); Quiz | M04 §4.3 |
| T11.L06 | Cleave Angle and Arc Quality | working | cleave angle, cleaver maintenance, arc calibration | 25 | Quiz (MC + drag) | M04 §4.2 partial |
| T11.L07 | Ribbon / Mass Fusion Splicing | working | ribbon splice, mass fusion, 12F/24F, productivity | 25 | WorkedExample (ribbon productivity calc) | M04 §4.4 |
| T11.L08 | Mechanical Splicing | working | mechanical splice, index-matching gel, emergency use | 20 | Quiz (MC) | M04 §4.5 |
| T11.L09 | Splice Case Types | working | dome, butt-splice, inline, pedestal, aerial vs. vault case | 25 | AnnotatedDiagram (case type comparison) | M04 §4.6 |
| T11.L10 | Gel-Seal vs. Heat-Shrink vs. Re-enterable | working | gel seal, heat-shrink, re-enterable closure, field preference | 20 | BranchingScenario (case selection for environment) | net-new (R-A gap) |
| T11.L11 | Splice Tray Loading and Fiber Management | working | tray, buffer tube, express loop, slack storage | 25 | AnnotatedDiagram (tray loading pattern) | M04 §4.6 |
| T11.L12 | Connector Loss — Three Numbers | working | UPC, APC, insertion loss spec/reference-grade/max | 25 | WorkedExample (connector loss budget); Quiz | M04 §4.7 |
| T11.L13 | Splicer Maintenance Schedule | working | arc calibration, cleaver blade replacement, electrode life | 20 | Quiz (MC) | net-new (R-A gap) |
| T11.L14 | Field Hygiene — Before the First Cleave | working | cleanliness, IPA wipe, controlled environment, dust cap | 20 | Quiz (MC) | M07 §7.6 partial |
| T11.L15 | T11 Capstone Quiz | capstone-quiz | — | 30 | Quiz (25Q MC + WorkedExample + drag-match) | net-new |

### T12 — Testing (15 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T12.L01 | Tier 1 vs. Tier 2 — OLTS vs. OTDR | foundation | OLTS, OTDR, insertion loss test, TIA-526 | 25 | Quiz (MC + drag-match test types) | M08 §8.1 |
| T12.L02 | OLTS — Bidirectional and Averaging | working | reference method, averaging, directional variation | 25 | WorkedExample (bi-di average calc) | M08 §8.1 |
| T12.L03 | OTDR Fundamentals | working | pulse width, range, averaging time, IOR setting | 30 | WorkedExample (parameter selection); AnnotatedDiagram | M08 §8.2 |
| T12.L04 | Dead Zones — EDZ and ADZ | working | EDZ, ADZ, launch cable, receive cable sizing | 30 | AnnotatedDiagram (dead zone diagram) | M08 §8.3 |
| T12.L05 | Ghost Reflections | working | ghost, coherence length, reflection source, masking | 25 | Quiz (MC) | M08 §8.3 |
| T12.L06 | Launch and Receive Cables | working | launch fiber, receive fiber, MFD mismatch gainer | 25 | WorkedExample (gainer calc) | M08 §8.4 |
| T12.L07 | Bidirectional OTDR — When and Why | working | bidirectional, direction-dependent loss, averaging | 25 | WorkedExample (bi-di OTDR avg) | M08 §8.4 + R-B CFOS/O |
| T12.L08 | Reading an OTDR Trace | working | event table, reflection, loss event, fiber end | 30 | OTDRTraceViewer (interactive); Quiz | M08 §8.5 + component |
| T12.L09 | Macrobend Detection — Dual-Wavelength | working | 1310 vs. 1550 signature, G.657, macrobend confirmation | 25 | WorkedExample (dual-wavelength difference calc) | M08 §8.6 |
| T12.L10 | IOR, Distance Errors, and Cursor Pitfalls | advanced | EIOR, distance error calc, automated cursor, manual cursor | 25 | WorkedExample (distance error calc) | M08 §8.7 |
| T12.L11 | End-Face Inspection — IEC 61300-3-35 | working | IEC 61300-3-35, end-face zone map, grade A/B/C/D, cleaning | 30 | AnnotatedDiagram (end-face zone map); Quiz | net-new + M08 partial |
| T12.L12 | PMD and CD Measurement | advanced | PMD, CD, measurement equipment, limits for high-speed systems | 20 | Quiz (MC) | net-new (R-A gap) |
| T12.L13 | Acceptance Testing — What Passes | working | acceptance threshold, TIA-568 link model, NECA-FOA 301 | 25 | BranchingScenario (pass/fail scenario) | net-new |
| T12.L14 | Test Documentation and Reports | working | OTDR report, loss report, event table, archival | 20 | Quiz (MC) | net-new |
| T12.L15 | T12 Capstone Quiz | capstone-quiz | — | 30 | Quiz (25Q MC + WorkedExample + OTDRTraceViewer) | net-new |

### T13 — Inspection & QA (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T13.L01 | The Inspector's Role — Not the Enemy | foundation | inspector, QA/QC, punch list, kick-back authority | 20 | Quiz (MC) | net-new |
| T13.L02 | Aerial Inspection — What to Look For | working | clearance verification, hardware torque, sag check, drip loop | 30 | AnnotatedDiagram (aerial attachment inspection points) | net-new |
| T13.L03 | Pole-Top Inspection | working | pole top condition, CCA treatment, woodpecker damage, NESC compliance | 25 | BranchingScenario (pole top rejection) | net-new |
| T13.L04 | Underground Inspection — Depth and Cover | working | depth probe, cover card, back-fill compaction, restoration check | 25 | WorkedExample (depth verification at three points) | net-new |
| T13.L05 | Slack, Storage, and Access Point Checks | working | slack inventory, storage coil check, pedestal access, NIU verify | 20 | BranchingScenario (slack shortage scenario) | M09 §9.6 |
| T13.L06 | What Triggers a Punch List vs. a Kick-Back | working | punch list, kick-back, material deficiency, rework | 25 | BranchingScenario (classify 5 deficiencies) | net-new |
| T13.L07 | RUS Form 219 — Close-Out Package | working | RUS Form 219, as-built signature, engineer certification | 25 | WorkedExample (walk through a Form 219) | net-new |
| T13.L08 | Bonding and Grounding Inspection | working | ground resistance test, bond continuity, IBT/GES verify | 25 | WorkedExample (inspection checklist + acceptance) | T14 cross-ref |
| T13.L09 | Contractor vs. Owner Inspection Rights | working | contractor QC, owner QA, right of rejection, retainage | 20 | Quiz (MC) | net-new |
| T13.L10 | T13 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + BranchingScenario) | net-new |

### T15 — Restoration & Outage Response (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T15.L01 | Outage Response — The First 30 Minutes | foundation | MOP, mobilization, RPO, RTO, outage bridge call | 20 | BranchingScenario (outage first response) | net-new |
| T15.L02 | Fault Locate with OTDR | working | fault locate, break signature, mechanical damage, ORL change | 30 | WorkedExample (OTDR fault locate distance calc) | net-new |
| T15.L03 | Physical Route Walk — Finding the Break | working | physical locate, marker post, as-built comparison, probe | 25 | BranchingScenario (locate a buried break) | net-new |
| T15.L04 | Temporary vs. Permanent Repair | working | temporary patch, through-splice, permanent restoration | 25 | BranchingScenario (temporary vs. perm decision) | net-new |
| T15.L05 | Splice Trailer Setup | working | splice trailer, generator, climate control, OTDR setup, traffic control | 25 | AnnotatedDiagram (splice trailer layout) | net-new |
| T15.L06 | Emergency Civil Work | working | hand-dig, emergency excavation, vacuum excavation, shoring | 20 | Quiz (MC) | net-new |
| T15.L07 | Customer Communication During Outages | working | outage notice, ETR, bridge update, escalation | 20 | BranchingScenario (communication chain) | net-new |
| T15.L08 | Method of Procedure (MOP) | working | MOP, step sequence, rollback plan, change control | 25 | WorkedExample (write a simple MOP) | net-new |
| T15.L09 | Post-Restoration As-Built Update | working | post-restoration as-built, splice record update, OTDR archive | 20 | Quiz (MC) | net-new |
| T15.L10 | T15 Capstone Quiz | capstone-quiz | — | 30 | Quiz (15Q MC + BranchingScenario) | net-new |

### T16 — As-Built Documentation & GIS (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T16.L01 | As-Built vs. As-Designed — The Gap | foundation | as-designed, as-built, reconciliation, the last-to-slip rule | 25 | Quiz (MC) | M09 §9.7 |
| T16.L02 | Splice Matrix — What It Is and Why | working | splice matrix, CSV schema, tube/fiber/from/to, routing | 30 | TopologyCanvas (interactive); Quiz | M07 §7.2 |
| T16.L03 | Fiber Pathing — Tracking Every Fiber | working | fiber path, express, split, through-splice, end point | 25 | WorkedExample (trace fiber 73 through splice matrix) | M07 §7.3 |
| T16.L04 | TIA-606-D Administration Classes | working | TIA-606-D, Class 1–4, identifier format, label standard | 25 | Quiz (MC + drag-match) | M05 §5.5 |
| T16.L05 | GIS Export Formats — SHP, GDB, KML | working | shapefile, file geodatabase, KML, attribute table, projection | 25 | AnnotatedDiagram (GIS format comparison) | M03 §3.6 + M07 §7.5 |
| T16.L06 | Industry Tools — VETRO, 3-GIS, IQGeo | working | VETRO, 3-GIS, IQGeo, Bentley, field-to-office workflow | 20 | Quiz (MC) | M07 §7.5 |
| T16.L07 | RUS Form 219 Documentation Package | working | Form 219, submittal, engineer certification, retention | 25 | WorkedExample (Form 219 checklist) | net-new + T13 cross-ref |
| T16.L08 | 47 CFR 32 — Plant Record-Keeping | working | USOA accounts, plant records, 5-year retention, FCC audit | 20 | Quiz (MC) | net-new |
| T16.L09 | GIS Commit and Withhold Incentive | working | GIS acceptance, 5% retainage, withhold-final lever | 20 | BranchingScenario (GIS rejection consequence) | M09 §9.7 |
| T16.L10 | T16 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + TopologyCanvas exercise) | net-new |

### T17 — Project Estimation & Revenue (10 lessons)
| ID | Title | Type | Key vocab added | Time (min) | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T17.L01 | The Cost-Data Problem | foundation | $/ft variance, source bias, location factor, union vs. non-union | 25 | Quiz (MC) | M11 §11.1 |
| T17.L02 | Aerial vs. Underground Cost Ratios | working | ratio, cost per mile aerial vs. UG, terrain factor | 25 | WorkedExample (route cost comparison) | M11 §11.2 |
| T17.L03 | Make-Ready as a Cost Line Item | working | MRE budget, contingency for make-ready, cost-causation | 25 | WorkedExample (make-ready budget scenario) | M11 §11.3 |
| T17.L04 | Splice and Drop Labor Costs | working | splice labor, drop install, productivity, BLS OEWS | 25 | WorkedExample (labor cost build-up) | M11 §11.4 |
| T17.L05 | Contract Types — Lump-Sum, T&M, GMP | working | lump-sum, T&M, GMP, risk allocation | 25 | BranchingScenario (select contract type) | M11 §11.5 |
| T17.L06 | RFP, RFQ, and BOM Basics | working | RFP, RFQ, BOM, bid schedule, scope of work | 25 | WorkedExample (read and mark up a simple RFP) | M11 §11.5 partial |
| T17.L07 | Contingency and Change Orders | working | construction contingency, escalation contingency, change order | 25 | WorkedExample (contingency calc) | M11 §11.6 |
| T17.L08 | CPHP and CPHC — The FTTH Math | advanced | CPHP, CPHC, take rate, HC, HP, HP+, EVM | 35 | WorkedExample (CPHC = CPHP ÷ take rate derivation) | M11 §11.7 |
| T17.L09 | Revenue Estimation for RUS Jobs | advanced | RUS budget form, unit cost schedule, contingency percentage | 25 | WorkedExample (build a simple unit-cost estimate) | net-new |
| T17.L10 | T17 Capstone Quiz | capstone-quiz | — | 30 | Quiz (20Q MC + WorkedExample verify) | net-new |

### Cert-Prep Topics (C01–C04) — lesson-level detail

Per CLAUDE.md §2, these migrate from existing M05/M06/M10/M12 with per-lesson structural rewrite. No lesson-level re-authoring table is repeated here — each maps 1:1 to existing JSX sections (all A-grade per R-C). C04 expands M12's 5 sections to 12 lessons by adding: CFOT mock exam lesson, CFOS/O mock exam lesson, OSP Designer mock exam lesson, RCDD domain deep-dives (3 separate lessons), cert strategy and study-plan lesson, and an ethics/test-integrity lesson (already at M12 §12.3 — preserve verbatim per R-C's highest-signal call).

---

## Section 5: Migration Manifest (source → new lesson map, summary)

Full manifest lives in the per-lesson rows in Section 4. Summary by migration effort class:

| Effort class | Count | Description |
|---|---|---|
| Verbatim / minor reformat | ~52 | JSX section migrates as-is into per-lesson file (M04 §4.1-4.8, M08 §8.1-8.8, M09 §9.1-9.8, M11 §11.1-11.8, M05 full, M06 full, M10 full, M12 §12.1-12.5) |
| Prose surgery (pitch + markdown depth inject) | ~40 | JSX pitch-quality base + markdown content depth injection (M01 §1.2-1.6, M02 §2.1-2.9, M03 §3.1-3.7, M07 §7.1-7.8) |
| Re-author from brief | ~153 | Net-new lessons for new topics (T01, T04, T07, T13, T14, T15, T18) + expansion lessons across T05, T06, T10, T11, T12, T16, T17 |

---

## Section 6: Per-Topic Capstone Quiz Scope

| Topic | Item count | Domain weights | Question types | Pass threshold |
|---|---|---|---|---|
| T01 | 15 | all T01 vocab equally | MC, drag-match | 70% |
| T18 | 20 | 30% LOTO/confined space; 25% PPE; 25% traffic control; 20% electrical awareness | MC, scenario | 80% (safety: higher threshold) |
| T02 | 20 | 35% link budget; 30% attenuation/dispersion; 20% fiber types; 15% decibel math | MC, WorkedExample verify | 70% |
| T03 | 20 | 30% cable type selection; 25% specs/standards; 25% RUS listing; 20% pulling | MC, BranchingScenario | 70% |
| T04 | 15 | 35% field methods; 30% GIS/deliverables; 35% route analysis | MC, BranchingScenario | 70% |
| T09 | 20 | 30% NEPA/§106; 25% USACE; 25% ROW/easements; 20% state DOT | MC, BranchingScenario | 70% |
| T05 | 25 | 30% NESC clearances; 25% sag-tension; 25% pole loading; 20% ADSS/PON | MC, WorkedExample verify | 70% |
| T06 | 20 | 30% conduit/depth; 25% method selection; 25% hardware; 20% standards | MC, WorkedExample verify | 70% |
| T14 | 20 | 30% MGN/bonding; 25% ground resistance; 25% NEC 250.52; 20% surge/stray voltage | MC, WorkedExample verify | 70% |
| T07 | 15 | 35% form/documentation; 35% field measurement; 30% make-ready flags | MC, BranchingScenario | 70% |
| T08 | 20 | 30% OTMR process; 25% simple/complex; 25% fee/cost; 20% PM | MC, BranchingScenario | 70% |
| T10 | 20 | 25% 811/locates; 25% execution methods; 25% QA; 25% documentation | MC, BranchingScenario | 70% |
| T11 | 25 | 25% fusion process; 20% loss numbers; 20% closures; 20% color codes; 15% connectors | MC, drag-match, WorkedExample verify | 70% |
| T12 | 25 | 25% OLTS; 30% OTDR; 20% dead zones; 15% end-face; 10% PMD/CD | MC, WorkedExample verify, OTDRTraceViewer | 70% |
| T13 | 20 | 30% aerial inspection; 25% underground inspection; 25% punch list; 20% Form 219 | MC, BranchingScenario | 70% |
| T15 | 15 | 35% fault locate; 30% repair sequence; 35% MOP/comm | MC, BranchingScenario | 70% |
| T16 | 20 | 30% splice matrix; 25% GIS formats; 25% TIA-606-D; 20% Form 219 | MC, TopologyCanvas exercise | 70% |
| T17 | 20 | 30% CPHP/CPHC; 25% contract types; 25% cost ratios; 20% change orders | MC, WorkedExample verify | 70% |
| T19 | 15 | 30% headend layout/power; 25% grounding boundary (primary protector/IBT/TGB); 25% rack hardware; 20% FDH internals | MC, AnnotatedDiagram identify | 70% |

---

## Section 7: Per-Cert Mock Exam Spec

### BICSI OSP Designer
- **100 items, 120 minutes** (mirrors real exam per R-B).
- **Item mix:** 70 MC / 20 multi-response / 10 enhanced matching.
- **Domain weighting:** BICSI does NOT publish per-domain percentages. Equal weight across 9 JTA competencies (~11 items each) until BICSI publishes. Disclosed in the mock exam UI: "BICSI has not published domain weights for this exam. Items are distributed equally across the nine job-task competencies."
- **Pass threshold:** 70% (proxy; BICSI publishes pass/fail only, no cut score). Disclosed as proxy.
- **Item pool:** ≥250 items, stratified random draw of 100.
- **Result detail:** competency-level + domain-level scoring + remediation links to T01-T17 + C04 lessons.

### BICSI RCDD — REMOVED FROM OSP COURSE
**Migrated to future ISP course per Carter 2026-05-16.** The RCDD mock exam specification block is preserved here for reference only — it will be re-created in the ISP course ARCH document when that course is scoped.

_Archived spec (do not author in OSP-RW):_
- 100 items, 150 minutes. Domain weighting (v15): 10% Define Scope / 63% Design ICT Solutions / 11% Bid/Tender / 16% Installation Support. Pass threshold: 70% proxy. Item pool: ≥300 items. Prereqs: C01 + C02 (ISP course). This mock will live in the ISP course alongside C01/C02/C03 content.

### FOA CFOT
- **100 items, 90 minutes** (FOA does not publish exam time; 90 min is industry-typical; disclosed as estimated).
- **Item mix:** 60 MC / 25 matching / 15 true-false (mirrors FOA format per R-B).
- **Hands-on portion:** explicitly flagged as out-of-scope — "The hands-on portion of the CFOT exam must be completed at an FOA-Approved school. This platform covers the written portion only."
- **Pass threshold:** 70% (FOA-published).
- **Item pool:** ≥200 items.
- **Domain gating:** CFOT unlocks after T01 + T02 + T11 + T12 completion.

### FOA CFOS/O
- **100 items, 90 minutes** (same disclosure as CFOT).
- **Item mix:** 60 MC / 25 matching / 15 true-false.
- **Hands-on:** same out-of-scope disclaimer as CFOT.
- **Pass threshold:** 70% (FOA-published).
- **Item pool:** ≥200 items.
- **Prereq gating:** CFOS/O unlocks after CFOT track completion + T01-T17 recommended (CFOT + 2-yr field experience is the real cert prereq; we surface the experience note as advisory only — we can't verify field hours).

---

## Section 8: Build Sequencing

### Template topic: T02 (Fiber Physics)
Rationale: T02 maps directly to existing M01 (349 LOC, all A-grade, 8 sections → 12 lessons via expansion). It is the richest existing source + has the most interactive components (LinkBudgetCalculator, existing quiz bank). A successfully-templated T02 demonstrates the JSX-led Option C migration at its best. After Carter reviews T02 as template, the remaining topics proceed in waves.

### OSP-RW.3 — Interactive Primitives (build order)
1. `<Quiz>` extension (fill-in-blank added to existing InteractiveQuiz) — needed by every topic.
2. `<WorkedExample>` generalized from LinkBudgetCalculator — needed by T02, T05, T06, T11, T12, T14, T17.
3. `<AnnotatedDiagram>` generalized from OTDRTraceViewer — needed by T01, T04, T05, T06, T11, T12.
4. `<BranchingScenario>` net-new FSM — needed by T04, T05, T06, T07, T08, T09, T10, T13, T15.

### OSP-RW.4 — Template topic (T02 Fiber Physics, ≥2 worker agents)
Carter reviews T02 output, locks template before OSP-RW.5.

### OSP-RW.5 — Remaining 21 topics (parallelizable by topic; different files = no push contention)
Wave priority order (DAG-respecting, most foundational first):
- Batch A (parallel): T01, T18, T03
- Batch B (parallel): T04, T09
- Batch C (parallel): T05, T06 — then **T19** (after T06 RT-clean; T19 depends on T06), **T14** (after T19 RT-clean; T14.L05 vocab_assumed from T19)
- Batch D (parallel): T07, T08, T10
- Batch E (parallel): T11, T12
- Batch F (parallel): T13, T15, T16, T17
- Cert prep: C04 only (C01/C02/C03 migrated to future ISP course per Carter 2026-05-16)

**Sequencing note for T19:** T19 cannot start until T06 is RT-clean (T19 assumes conduit-entry routing as background context). T14 cannot start until T19 is RT-clean (T14.L05 requires T19.L06's primary protector / IBT-entry / GES-tie-in terms). This means Batch C runs as: T05+T06 in parallel → T19 → T14, rather than T05+T06+T14 fully parallel.

Each topic wave: ≥2 author workers + ≥2 RT verifiers (READ-ONLY). Carter reviews first topic in each batch before the next batch starts if he wants a check-in; otherwise OSP-RW.5 runs through.

### OSP-RW.6 — Moodle teardown
Per CLAUDE.md §2 teardown scope. Single fix-agent + 2 RT verifiers. No dependency on content completion.

### OSP-RW.7 — E2E QA + production cut
Playwright spec covers splash → course → lesson → all 4 interactivity types → progress save → cert attempt → admin view. Carter walkthrough required before production cut.

---

## Section 9: Locked Decisions (no open questions)

All scope decisions were locked by the orchestrator before architect dispatch and confirmed by RT verification. The architecture executes against these locks. No outstanding decisions for Carter on these items — see CLAUDE.md §2 for the full lock list.

- **Topic count: 23 topics (19 general + 4 cert-prep), locked.** T04 (Route Survey) and T07 (Staking) remain as separate topics. No compression. T19 added at general teaching position 9.
- **T19 teaching position: 9 (after T06, before T14), locked per Carter 2026-05-16.** DAG Path Y: T19 introduces primary protector / IBT-entry / GES-tie-in at CO-context level; T14.L05 reclaims for full electrical depth. T14 is NOT split.
- **C01 / C02 / C03 — migrated to future ISP course, locked per Carter 2026-05-16.** These three cert-prep topics (Networking Blueprints / RCDD Core / Data Center Standards) are NOT authored in OSP-RW. They appear in the topic table as placeholders only. Their lesson content will be authored when the ISP course is scoped and initiated. C01's prereqs will include T19 (T19 seeds ISP vocabulary).
- **RCDD mock exam: REMOVED from OSP course, locked per Carter 2026-05-16.** The RCDD mock exam specification belongs to the future ISP course. C04 (OSP Practice Exam Bank) retains: OSP Designer + CFOT + CFOS/O mock exams only.
- **C04 cert tracks retained in OSP course: BICSI OSP Designer + FOA CFOT + FOA CFOS/O only.** The C04-RCDD certTrack entry is removed from course-catalog.js.
- **CFOT folded into C04, locked.** CFOT lessons are included in C04 (Certification Practice Exam Bank) and CFOS/O is gated on CFOT completion within C04. No separate C05 topic.
- **G.655 added to T02.L08 (not a new lesson), locked.** G.655 (Non-Zero Dispersion-Shifted SMF) is used in carrier DWDM backbones. Small addition to the authored T02.L08 file only; no new lesson required.
- **T03.L05b scope: cable-product context only.** T03.L05b does NOT re-teach OM physics (T02.L08 owns that). It teaches which OM cable product an OSP engineer encounters and why OSP always means SMF.

---

=== OSP-RW.0b ARCHITECTURE SYNTHESIS END ===
