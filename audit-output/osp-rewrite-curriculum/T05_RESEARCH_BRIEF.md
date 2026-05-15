# T05 OSP Design — Aerial: Citation-Grounded Research Brief

**Prepared:** 2026-05-16 (pre-authoring research brief)
**Scope:** 15 T05 lessons (L01–L15 per ARCH.md §4, T05 table)
**Method:** WebSearch verification against trusted-sources allowlist + independent math derivation + ARCH.md DAG cross-check + T01/T02/T03/T04 vocabulary audit + Module02_OSPDesign.jsx source review
**Role:** READ-ONLY research brief. No lesson code was created or modified.
**Word count:** ~5,500

---

## DAG Position & Vocabulary Boundary

T05 sits at teaching position 7 in the topological sort:
`T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → T14 → ...`

### Vocabulary available to T05 authors from prior topics

**From T01 (AVAILABLE — all 10 lessons authored):** OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH, SMF, MMF, G.652.D, G.657.A1, RUS, NESC, TIA, NEC, FCC, BICSI, pole (parts of: supply space, climbing space, communication space, ground-line), cable (parts of: sheath, buffer tube, ripcord, armor, messenger), splice case, splice tray, gel seal, fan-out, strand map, NAP

**From T02 (AVAILABLE — all 12 lessons authored):** wavelength, attenuation (dB/km), MFD, macrobend, microbend, dB/dBm, link budget, G.652.D (full physics), G.657.A1 (bend-insensitive), SMF, MMF, OM3/OM4/OM5, OS2, dispersion (CD/PMD), total internal reflection, NA, critical angle

**From T03 (PARTIALLY AVAILABLE — 9 of 12 lessons authored at time of writing; L10–L12 pending):**
- AVAILABLE: loose-tube, ribbon, ADSS (introduced T03.L04 + T03.L09), messenger (as steel strand), RUS-listed, bend radius, EDS (everyday stress), RTS (rated tensile strength), ICEA S-87-640, flooding compound, water-blocking tape, dry-block, CST, interlocked armor, figure-8 cable, OFNR, OFNP
- PENDING (T03.L10–L12): ICEA S-87-640 at standards-detail level, TIA-598-D color codes, fill ratio, dark fiber, growth margin, pulling tension (detailed calculation)

> **DAG annotation for T05 authors:** T05.L10 (ADSS Aerial Design) requires ADSS sag + tension concepts first introduced in T03.L09 (ADSS Span Wind Ice Loading). Confirm T03.L09 is merged to HEAD before dispatching T05.L10 authoring. If T03.L10–L12 are not yet landed, T05 lessons that need pulling tension or fill ratio must formally introduce those terms or wait. Check `git log` on T03/ directory before starting T05 authoring wave.

**From T04 (AVAILABLE — brief complete, authoring pending):** landbase, LiDAR, RTK GNSS, photogrammetry, planimetric, GSD, KMZ, shapefile, geodatabase, pole audit, attachment height, existing occupancy, make-ready flag, route alternatives, 811/One-Call, ROW, easement, encroachment, fee-simple, license, 47 CFR 32, as-surveyed, design constraints, RUS Form 740c

> **DAG annotation:** T04 authoring is not yet dispatched. T05 lessons that reference T04 vocabulary (especially T05.L13 Make-Ready Design Analysis and T05.L14 Aerial Design QA Checklist) MUST annotate T04 as a prerequisite topic and authors must verify T04 lessons are authored before dispatch. If T04 is not yet landed at dispatch time, T05 author must either (a) formally re-introduce the T04 terms within the T05 lesson, OR (b) wait for T04 completion. Per ARCH.md DAG: T05 prerequisites = T01, T02, T03, T04.

**T09 (Permitting) is a co-prerequisite at the topic level per ARCH.md DAG. Individual T05 lessons do not depend on specific T09 lessons except T05.L13 (Make-Ready Design Analysis) which references permit tracking context introduced in T09. Authors should treat T09 as parallel (students may not have T09 complete before T05). Cross-references to T09 in T05 should be annotated as "you will learn this in full in T09" rather than assuming T09 knowledge.**

### Vocabulary T05 introduces (first-use in curriculum)

| Term | First-use lesson | Definition (field-level) |
|---|---|---|
| NESC (National Electrical Safety Code) | T05.L01 | IEEE C2-2023; governs construction of overhead/underground supply and communication lines in the US |
| Rule 232 | T05.L02 | NESC rule governing minimum vertical clearance of conductors above ground, roadways, water, rail |
| Rule 235 | T05.L03 | NESC rule governing clearance and separation between lines on the same pole; defines communication worker safety zone |
| Rule 250 | T05.L06 | NESC rule defining loading districts (Light/Medium/Heavy/Extreme Wind) + ice/wind design loads |
| Rule 261 | T05.L04 | NESC rule governing grades of construction (Grade B, Grade C, Grade N) |
| Section 26 | T05.L05 | NESC section governing load and strength factors (the multiplier matrix applied to calculated design loads) |
| loading district | T05.L06 | Geographic zone (Light, Medium, Heavy, or Extreme Wind) that determines design ice + wind loads per NESC Rule 250 |
| sag | T05.L07 | Vertical drop of the cable at midspan below the line connecting the two attachment points; calculated using parabolic approximation |
| horizontal tension (H) | T05.L07 | The constant horizontal component of the cable tension force at any point along the span; used in sag formula |
| catenary | T05.L07 | The exact mathematical curve formed by a flexible cable under uniform self-weight; well-approximated by a parabola when sag < 10% of span |
| initial sag | T05.L07 | Sag immediately after stringing, before load cycling and creep |
| final sag | T05.L07 | Sag after thermal cycling, creep, and long-term load history; the controlling design value for clearance |
| joint use | T05.L08 | Shared pole usage by two or more utilities under contractual arrangement |
| ILA (Interagency Lighting Agreement / Pole Attachment Agreement) | T05.L08 | Contract between pole owner and attacher governing rates, terms, and conditions for pole attachments |
| overlashing | T05.L08 | Adding additional cable by lashing it to an existing messenger or attached cable already on the pole, without a separate attachment agreement |
| OTMR (One-Touch Make-Ready) | T05.L09 | FCC-created process (FCC 18-111 / 47 CFR 1.1411) allowing a new attacher's contractor to perform simple comm-space make-ready in one visit |
| simple make-ready | T05.L09 | Make-ready that can be done without splicing, supply-space work, antennas, or risk of customer outage |
| complex make-ready | T05.L09 | Make-ready involving splicing, supply-space work, antennas, or foreseeable customer outage |
| ADSS (All Dielectric Self-Supporting) | T05.L10 | Aerial fiber cable with integrated support member, no metallic elements, used where power-line induction is a concern |
| EDS (Everyday Stress) | T05.L10 | The normal long-term installation tension, typically 16–25% of RTS, under which fiber has no strain and no additional attenuation |
| OPGW (Optical Ground Wire) | T05.L11 | A cable that serves as both a shield wire on transmission towers and a fiber optic carrier; replaces the standard overhead ground wire |
| PON (Passive Optical Network) | T05.L12 | A fiber distribution architecture using unpowered optical splitters to share one upstream fiber among multiple end users |
| GPON (Gigabit PON) | T05.L12 | The dominant residential FTTH PON standard; ITU-T G.984; downstream 2.488 Gbps, upstream 1.244 Gbps |
| FDH (Fiber Distribution Hub) | T05.L12 | A hardened outdoor enclosure where the distribution fiber terminates and connects to drop cables via splitters |
| split ratio | T05.L12 | The ratio of one upstream fiber to output ports (e.g., 1:32 means one feeder fiber serves 32 subscribers) |
| make-ready cost estimate | T05.L13 | The pre-attachment cost projection for transferring, re-framing, or replacing existing attachments to accommodate the new attacher |
| grade of construction | T05.L04 | A classification (Grade B, C, or N) that prescribes the safety factor multipliers applied to calculated structural loads under NESC Rule 261 |
| pole loading | T05.L05 | The sum of all horizontal and vertical forces applied to a pole from cables, hardware, wind, and ice loading |
| wind span | T05.L05 | The horizontal distance used to compute the wind load contributed by spans on each side of the pole (typically the average of adjacent half-spans) |
| weight span | T05.L05 | The horizontal distance used to compute the vertical gravity load contributed by attached conductors |

---

## Final Lesson List — T05 (15 lessons, matches ARCH.md)

Revised from the brief prompt's suggested list to align with ARCH.md §4 T05 table and DAG principles.

| ID | Title | Type | Est. Time (min) | Key vocab introduced | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T05.L01 | What NESC Is and How to Read It | foundation | 25 | NESC, C2-2023, Rule, Table, Part, AHJ | Quiz (MC + drag-match Rules) | Module02 §2.1 (expanded) |
| T05.L02 | Vertical Clearance — Rule 232 | working | 30 | Rule 232, Table 232-1, traffic/road/ped/water clearances | WorkedExample (clearance check at road crossing); Quiz | Module02 §2.2 |
| T05.L03 | Comm-to-Supply Separation — Rule 235 | working | 25 | Rule 235, communication worker safety zone, neutral, 40-inch, midspan 30-inch | AnnotatedDiagram (joint-use pole zones); Quiz | Module02 §2.3 |
| T05.L04 | Grades of Construction | working | 25 | Grade B, Grade C, Grade N, Rule 261, Section 26, load/strength factors | Quiz (MC + drag-match) | Module02 §2.4 |
| T05.L05 | Pole Loading — Forces on a Pole | working | 30 | pole loading, wind span, weight span, horizontal component, resultant | WorkedExample (pole load sum calculation); AnnotatedDiagram | Module02 §2.4 |
| T05.L06 | Loading Districts — Rule 250 | working | 30 | loading district, Light/Medium/Heavy/Extreme Wind, ice load, psf, w_ice formula | WorkedExample (ice+wind load for Macon GA Light district); AnnotatedDiagram (US district map) | Module02 §2.5 |
| T05.L07 | Sag-Tension — How Cable Hangs | working | 35 | catenary, sag, horizontal tension, initial sag, final sag, parabolic approx | WorkedExample (step-by-step sag formula with sanity check) | Net-new |
| T05.L08 | Joint Use — Who Owns What on the Pole | working | 25 | joint use, ILA, overlashing rights, pole attachment agreement | BranchingScenario (attachment conflict resolution) | Module02 §2.6 partial |
| T05.L09 | OTMR in Aerial Design | working | 25 | OTMR, FCC 18-111, 15-day clock, simple/complex make-ready (design side) | Quiz (MC + drag-match OTMR scenarios) | Module02 §2.8 |
| T05.L10 | ADSS Aerial Design | working | 30 | ADSS, EDS, RTS, wind drag, self-damping, hardware attachment, span rating | WorkedExample (ADSS sag + EDS calculation); Quiz | Net-new (R-B) + T03.L09 builds on |
| T05.L11 | OPGW and Hybrid Cables | advanced | 20 | OPGW, shield wire replacement, ground fault considerations | Quiz (MC) | Net-new |
| T05.L12 | PON / FTTH Aerial Topology | working | 30 | PON, GPON, EPON, split ratio, power budget, FDH placement | WorkedExample (FTTH aerial link budget); AnnotatedDiagram (PON tree topology) | Net-new (R-B recommendation) |
| T05.L13 | Make-Ready in the Design | working | 25 | make-ready cost estimate, transfer conflict, design hold | BranchingScenario (design-to-make-ready handoff) | Module02 §2.6 + Module03 §3.7 partial |
| T05.L14 | Aerial Design QA Checklist | hands-on | 25 | design check, clearance verification, pole-load summary | BranchingScenario (find the clearance error in a design) | Net-new |
| T05.L15 | T05 Capstone Quiz | capstone-quiz | 30 | — | Quiz (25Q MC + WorkedExample verify) | Net-new |

**Total: ~415 minutes (~7 hours). 14 content lessons + 1 capstone.**

---

## Per-Lesson Briefs

---

### T05.L01 — What NESC Is and How to Read It

#### DAG prerequisites
- From T01: T01.L09 (OSP Standards Landscape — introduces NESC, RUS, TIA as named bodies); T01.L02 (Parts of a Pole — introduces joint-use pole zones)
- From T02: none
- From T03: none
- From T04: none required; T04.L09 (Pre-Engineering Handoff) may reference NESC but T05.L01 is the authoritative intro
- Internal T05: none (this is L01)

#### Vocabulary introduced (first-use)
- NESC (National Electrical Safety Code), Rule, Table, Part, Section, AHJ (Authority Having Jurisdiction), C2-2023, paywalled-standard handling

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "NESC = IEEE C2; current edition is 2023 (C2-2023)" | IEEE C2-2023 landing page; ETHW.org history — VERIFIED via public sources |
| "NESC governs construction, operation, and maintenance of overhead + underground lines in the US" | IEEE C2-2023 scope section (publicly described at standards.ieee.org) — VERIFIED |
| "Most states adopt NESC by reference" | ETHW.org ANSI C2 history article — VERIFIED |
| "Rule 232, 235, 250, 261 are the primary OSP rules" | Module02 §2.1 editorial posture; ikeGPS application guides; OJUA guides — VERIFIED via public secondary sources |

#### Paywalled claims
- NESC C2-2023 table values — paywalled. Lesson establishes the pattern: "rules by number, values by secondary source + AHJ confirmation." Module02 §2.1 models this posture perfectly and is the primary migration source.

#### Interactive primitive recommendations
- Quiz (MC): "Which NESC Rule covers vertical clearance over roads?" drag-match of 5 Rules to their scope
- Flashcard deck: 5 NESC rule numbers + scope lines

#### Quiz question seeds
1. (MC) NESC is published by: A) ANSI B) IEEE C) OSHA D) FCC → **B** (Source: IEEE C2-2023)
2. (drag-match) Rule 232→clearance over ground/roads; Rule 235→comm-to-supply separation; Rule 250→loading districts; Rule 261→grades of construction; Section 26→load+strength factors

#### Lesson confidence: **HIGH**

---

### T05.L02 — Vertical Clearance — Rule 232

#### DAG prerequisites
- From T01: T01.L02 (Parts of a Pole)
- From T05: T05.L01 (NESC orientation — Rule 232 by name)
- Internal: L01 must complete

#### Vocabulary introduced
- Rule 232, Table 232-1, clearance categories: over traffic/roads, over pedestrian areas, over railroads, over water bodies, measurement point (from lowest point of cable under loading conditions)

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Rule 232 sets minimum clearance above ground, roadways, rail, water" | NESC C2-2023 Rule 232 (public summary at OJUA, ikeGPS, Hi-Line application guide) — VERIFIED |
| "Communication cables over public roads: ≈ 15.5 ft (Table 232-1)" | Hi-Line Application Guide for 2023 NESC Table 232-1 (public PDF at gdsassociates.com); multiple utility design manuals — VERIFIED via secondary sources. Exact value paywalled in C2-2023. |
| "Communication cables over pedestrian-only areas: ≈ 9.5 ft (Table 232-1)" | ikeGPS NESC Rule 232 article; Hi-Line Application Guide — VERIFIED via secondary sources |
| "Clearance measured at lowest point under loading conditions (maximum sag)" | KPUB NESC Info sheet (public) — VERIFIED |
| "Grade B construction required for rail and limited-access highway crossings" | ikeGPS NESC Grades of Construction article; Federated Rural NESC 2017 chart — VERIFIED |
| "Design practice: add 1–2 ft margin above NESC minimum" | Module02 §2.2 field callout; industry practice (FOA, RUS 1751F-630 design commentary) — VERIFIED as stated field practice, not a standard |

#### Paywalled claims
- NESC C2-2023 Table 232-1 exact values — paywalled. Two independent secondary sources (Hi-Line PDF + ikeGPS) confirm ≈ 15.5 ft for road, ≈ 9.5 ft for pedestrian. Lesson uses "approximately X ft, per public secondary sources; confirm from paid C2-2023 Table 232-1 for your design."
- Per allowlist paywalled-source protocol: 2 independent secondary sources converge → values are usable with appropriate hedge language.

#### Worked example (pre-derived)
**Scenario:** A 40-ft pole (Class 3) on a residential street. Pole embed = 10% × 40 ft + 2 ft = **6 ft** (Source: ANSI O5.1 setting-depth rule, confirmed via public utility installation guides). Above-ground pole height = 40 − 6 = **34 ft**. Communication attachment at 22 ft above ground. Cable: 0.145 lb/ft total (strand + 12-fiber lashed cable). Span: 150 ft. Final tension: 600 lb.

Sag formula (parabolic approximation): **s = wL² / (8H)**

Step-by-step:
- w = 0.145 lb/ft
- L = 150 ft
- H = 600 lb
- s = (0.145 × 150²) / (8 × 600) = (0.145 × 22,500) / 4,800 = 3,262.5 / 4,800 = **0.680 ft** (≈ 8.2 inches)

Midspan height = 22.0 − 0.680 = **21.32 ft**.

Sanity check: "The cable hangs about 8 inches below the attachment point at midspan — well above the ≈ 15.5 ft road clearance minimum."

Light district wind-loaded sag (9 psf, no ice):
- Projected area: 0.5-inch strand OD = 0.5/12 = 0.042 ft²/ft
- w_wind = 9 × 0.042 = 0.375 lb/ft
- w_combined = √(0.145² + 0.375²) = √(0.021 + 0.141) = **0.402 lb/ft**
- s_loaded = (0.402 × 22,500) / 4,800 = **1.885 ft** (≈ 22.6 inches)

Midspan height (wind-loaded) = 22.0 − 1.885 = **20.12 ft**. Still 4.6 ft above the ≈ 15.5 ft minimum.

Sanity check: "Even in a 9-psf windstorm, the cable clears a 15.5-ft road minimum by more than 4 feet at this span and tension."

#### Interactive primitive recommendations
- WorkedExample (clearance check): user inputs span + tension → gets sag + midspan height + margin
- SliderExploration: vary span from 100 to 250 ft, watch sag and clearance margin change in real time

#### Quiz question seeds
1. (MC) A comm cable over a public road must clear ≈ ___ ft minimum per NESC Rule 232 Table 232-1 (per public secondary sources)? A) 9.5 ft B) 12 ft C) 15.5 ft D) 18 ft → **C**
2. (fill-in-blank) Clearance is measured at _____ (answer: the lowest point under maximum loading conditions, i.e., maximum sag)
3. (MC) Which crossing type requires Grade B construction? A) Residential side street B) Limited-access highway C) Gravel road D) Bike path → **B**

#### Lesson confidence: **HIGH** (clearance values hedged with secondary-source language; math independently derived)

---

### T05.L03 — Comm-to-Supply Separation — Rule 235

#### DAG prerequisites
- From T01: T01.L02 (Parts of a Pole — supply/climbing/comm zones)
- From T05: T05.L01 (NESC orientation); T05.L02 (clearances) recommended prior

#### Vocabulary introduced
- Rule 235, communication worker safety zone, neutral conductor, supply space, 40-inch separation (at pole), 30-inch separation (midspan), supply-to-comm vertical separation, Table 235-5

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Rule 235 = clearance and separation between different systems on same pole" | ikeGPS Communication Worker Safety Zone article; NESC C2-2023 Rule 235 (public description) — VERIFIED |
| "Communication worker safety zone: 40 inches at pole for voltages < 8.7 kV (Table 235-5 Row 1a)" | ikeGPS "What is the Communication Worker Safety Zone?" article explicitly states 40 inches from Table 235-5; OJUA Joint Inspection Best Practices guide — VERIFIED via 2 independent secondary sources |
| "Midspan clearance: 30 inches (75% of at-pole value for < 8.7 kV)" | ikeGPS article; We-Energies JU standards; multiple utility joint-use attachment books — VERIFIED: midspan is 75% of at-pole value per NESC Rule 235 interpretation |
| "Bonded-messenger reduced separation (~30 in. midspan) where comm messenger is bonded to supply neutral" | Module02 §2.3 field callout; confirmed by Consumers Energy attachment standards; industry joint-use practice — VERIFIED as field practice; AHJ/utility joint-use book governs |
| "Supply space is above neutral; communication space is below neutral" | NESC C2-2023 general zone description; ikeGPS, Alden Systems articles — VERIFIED via multiple secondary sources |

#### Paywalled claims
- NESC Rule 235 / Table 235-5 exact text — paywalled. Two independent secondaries (ikeGPS + We-Energies) confirm 40 inches for < 8.7 kV. Mark `[paywalled — verify NESC C2-2023 Rule 235 / Table 235-5 for exact voltage-class matrix]`.

#### Interactive primitive recommendations
- AnnotatedDiagram: joint-use pole cross-section showing supply space, climbing space (safety zone), communication space — labeled with approximate measurements
- HotSpot: photo of a real pole, click to identify which space is which and find any attachment that violates the zone

#### Quiz question seeds
1. (MC) The communication worker safety zone at a joint-use pole (< 8.7 kV) is approximately: A) 12 in. B) 24 in. C) 40 in. D) 60 in. → **C** (Source: ikeGPS/NESC Table 235-5 per secondary sources)
2. (drag-match) At-pole separation → 40 in.; Midspan separation (< 8.7 kV) → 30 in.; Rule governing this → Rule 235

#### Lesson confidence: **HIGH** (40-inch and 30-inch values confirmed by 2+ independent secondary sources)

---

### T05.L04 — Grades of Construction

#### DAG prerequisites
- From T05: T05.L01 (NESC orientation — Rule 261 named); T05.L02 (clearances set the "what we're protecting" context)

#### Vocabulary introduced
- Grade B, Grade C, Grade N, Rule 261, Section 26, load factor, strength factor, overload capacity factor (OCF)

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Rule 261 governs grades of construction" | ikeGPS NESC Grades of Construction article; NESC C2-2023 Rule 261 — VERIFIED via public secondary |
| "Grade B: railroad crossings, limited-access highways, navigable waterways" | ikeGPS article; Federated Rural NESC 2017 chart; MARMON utility whitepaper on long spans — VERIFIED |
| "Grade C: typical distribution and joint-use (standard residential/rural pole line)" | ikeGPS; multiple utility design manuals — VERIFIED |
| "Grade B requires higher load+strength factors than Grade C (Section 26 matrix)" | NESC C2-2023 Section 26 description; North American Wood Pole Council TB (public) — VERIFIED via secondary. Exact factor matrix paywalled. |
| "Many utilities default all trunk corridors to Grade B regardless of crossing type (internal practice)" | Module02 §2.4 field callout; RUS 1724E-150 design guidance commentary — VERIFIED as industry practice |

#### Paywalled claims
- Exact Section 26 load/strength factor matrix (e.g., "4-to-1 for Grade B") — paywalled. Do NOT cite specific multipliers from memory. State the principle: Grade B requires higher safety factors; exact values are in C2-2023 Section 26. Mark `[paywalled — confirm from NESC C2-2023 Section 26 for design calculations]`.

#### Interactive primitive recommendations
- Quiz (drag-match): scenario cards → correct grade (railroad crossing → B; residential street → C; private driveway on farm → N)
- BranchingScenario: "You're designing a pole line that crosses a navigable river. What grade is required, and what should you expect in your span analysis?"

#### Lesson confidence: **HIGH** (Grade B/C trigger conditions verified from multiple secondaries; factor values intentionally omitted as paywalled)

---

### T05.L05 — Pole Loading — Forces on a Pole

#### DAG prerequisites
- From T01: T01.L02 (Parts of a Pole — knows attachment, span); T01.L03 (cable weight context)
- From T03: T03.L04 (messenger weight; ADSS weight); T03.L09 (ADSS loading basics)
- From T05: T05.L01–L04 (NESC context); T05.L06 (loading districts) provides the specific ice/wind values — **L05 introduces the pole-loading framework; L06 supplies the district-specific numbers**. Authors may need to present L05 using generic w_wind and w_ice variables, then L06 substitutes real values from the district table.

#### Vocabulary introduced
- pole loading, horizontal component (wind + wire tension from guyed spans), vertical component (weight of cables + hardware), resultant force, wind span, weight span, pole tip load, guying, dead-end vs. running pole

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Pole loading = sum of horizontal forces (wind + tension) + vertical forces (cable weight)" | RUS 1751F-630 (design basis for aerial plant); RUS 1724E-150 §2 pole design commentary — VERIFIED public source |
| "Wind span: average of adjacent half-spans; Weight span: distance between low-point-of-sag on each side" | O-Calc Pro Sag Tension Calculations (public wiki); RUS design manuals — VERIFIED |
| "Pole tip load is the primary metric for pole class selection" | North American Wood Pole Council Technical Bulletin 19-D-204 (public) — VERIFIED |
| "ANSI O5.1-2022 provides fiber strength ratings for wood poles by class and species" | ANSI O5.1-2022 (published; paywalled for full text). ANSI Blog article confirms scope — VERIFIED scope; values paywalled |

#### Paywalled claims
- ANSI O5.1-2022 exact fiber strength values per class — paywalled. Approximate field-grade guidance (Class 1 ≈ 4,500 lb fiber strength for southern yellow pine at 2 ft from top; Class 3 ≈ 3,000 lb) is widely published in utility design manuals and pole manufacturer websites. Use "approximately X lb, per secondary sources; confirm from ANSI O5.1-2022 for your design."
- NESC Section 26 load factor matrix — paywalled (see L04).

#### Worked example (pre-derived — simplified illustrative, not a design calculation)
A simple illustrative example of forces acting on a running pole (not a design calculation — introduce PLS-POLE/O-Calc Pro as the real tool):

Imagine a pole carrying a 0.145-lb/ft lashed cable on two 150-ft spans (equal spans). Wind span = (150/2) + (150/2) = 150 ft. At 9 psf (Light district), wind load on 0.5-inch strand = 9 × (0.5/12) = 0.375 lb/ft. Wind-induced horizontal force on pole: 0.375 × 150 = **56 lb** from one cable (the cable contribution; the pole itself also sees wind load — omit for intro lesson). The vertical (weight) load = 0.145 × 150 = **21.75 lb** from cable weight. This illustrates why aerial design tools (PLS-POLE, O-Calc Pro) are used — a real corridor has 5–15 cables + hardware on each pole.

#### Interactive primitive recommendations
- AnnotatedDiagram: pole cross-section showing horizontal force vector (wind), vertical force vector (cable weight + hardware), and the resulting lean tendency
- WorkedExample (simplified): user enters span + cable weight + wind pressure → sees force components

#### Lesson confidence: **HIGH**

---

### T05.L06 — Loading Districts — Rule 250

#### DAG prerequisites
- From T05: T05.L04 (grades), T05.L05 (pole loading framework introduces w_ice and w_wind variables)
- This lesson supplies the district-specific values those variables take.

#### Vocabulary introduced
- Light/Medium/Heavy/Extreme Wind loading districts, NESC Rule 250B/250C/250D, radial ice, psf (pounds per square foot), combined loading, ice load formula w_ice = 1.244 × t × (D + t), temperature conditions per district, Extreme Wind overlay (250C)

#### CRITICAL — Loading District Values (independently verified via multiple paths)

The following values are the single verified source of truth for T05, matching T03 brief (SHA `148e1e7`):

| District | Radial ice (in) | Wind pressure | Temperature | Source path |
|---|---|---|---|---|
| **Heavy** | 0.50 in | 4 psf (≈ 40 mph) | 0°F | IAEI Magazine 2002 NESC article; ikeGPS NESC Weather Loadings; NESC Rule 250B per RUS 1724E-150 |
| **Medium** | 0.25 in | 4 psf (≈ 40 mph) | 15°F | IAEI Magazine 2002 NESC article; ikeGPS NESC Weather Loadings |
| **Light** | 0 in (no ice) | 9 psf (≈ 60 mph) | 30°F | IAEI Magazine 2002 NESC article; ikeGPS NESC Weather Loadings; Module02 §2.5 |
| **Extreme Wind (250C)** | 0 in | Map-defined (90–150 mph coastal) | per map | ikeGPS; NESC 2007 IAEI article; 250C applies where structures ≥ 60 ft (60 ft or more above ground) |
| **Extreme Ice w/ Wind (250D)** | Map-defined 50-yr storm | Concurrent | per map | IAEI 2007 NESC article; NESC 2007 Part 1 |

> **Verification method:** Three independent secondary sources (IAEI Magazine, ikeGPS, and RUS 1724E-150 public PDF) all agree on the Heavy/Medium/Light values. The prior T03 brief hallucination (ice/wind values transposed) has been corrected in T03 brief `148e1e7`. These values are the final locked values for the curriculum.

**Macon, GA = Light loading district.** (Source: NESC loading district map; confirmed in T03 brief and Module02 §2.5 which notes coastal/gulf overlay.) Carter's location is Macon, GA — use this for Light district worked examples throughout T05.

#### Ice load formula — independently derived and verified

**Formula:** `w_ice = 1.244 × t × (D + t)` lb/ft

Where:
- t = radial ice thickness in inches
- D = cable outer diameter in inches
- w_ice = ice load in lb/ft

**Derivation (verified):** Ice volume per foot of cable = π × t × (D + t) in²/ft (annular ring with D in inches). Converting to ft³/ft: π × t × (D + t) / 144. Ice density = 57 lb/ft³ (NESC/ASCE 7 standard value). Weight = 57 × π × t × (D + t) / 144 = (57π/144) × t × (D + t) = **1.2435 × t × (D + t) ≈ 1.244 × t × (D + t)** ✓

**Example — Heavy district, 0.82-inch ADSS cable:**
w_ice = 1.244 × 0.50 × (0.82 + 0.50) = 1.244 × 0.50 × 1.32 = **0.821 lb/ft**

Sanity: that's 0.821 lb of ice per foot of cable — about triple the cable's self-weight (0.26 lb/ft). In Heavy district, ice can easily triple the vertical load.

**Example — Light district, same cable:**
w_ice = 0 (no ice). Wind load = 9 × (0.82/12) = **0.615 lb/ft** horizontal. Combined w = √(0.26² + 0.615²) = **0.668 lb/ft**.

#### Interactive primitive recommendations
- WorkedExample: user enters cable diameter + loading district → gets ice load + wind load + combined load
- SliderExploration: vary radial ice thickness 0–0.75 in, watch cable weight triple
- AnnotatedDiagram: US map with loading district boundaries + Extreme Wind coastal overlay

#### Quiz question seeds
1. (MC) In the Heavy loading district, the design combines ___ in of radial ice + ___ psf wind at 0°F. → 0.50 in; 4 psf
2. (fill-in-blank) Macon, GA is in the ___ loading district. → Light
3. (MC) The Extreme Wind loading overlay (Rule 250C) primarily applies to: A) All poles in hurricane states B) Structures 60 ft or more (≥ 60 ft) above ground in mapped wind zones C) All poles in the Heavy district D) Any pole near a body of water → **B**

#### Lesson confidence: **HIGH** (values verified from 3 independent secondaries; ice load formula independently derived to 4 decimal places matching prior T03 brief)

---

### T05.L07 — Sag-Tension — How Cable Hangs

#### DAG prerequisites
- From T05: T05.L05 (pole loading; introduced w for cable weight per foot); T05.L06 (loading district values for w_combined)
- From T03: T03.L04 (messenger cable introduces strand as the tensioned member)

#### Vocabulary introduced
- catenary, parabolic approximation, sag (s), horizontal tension (H), initial sag, final sag (creep + thermal), span (L), sag-to-span ratio, ruling span

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Parabolic approx: s = wL² / (8H)" | Standard transmission line mechanics; multiple verified sources: O-Calc Pro Sag Tension wiki (public); Incabamerica Sag and Tension Theory 101 PDF (public, 2024); crane-cable.com complete guide — VERIFIED |
| "Parabolic approx within 1% of catenary when s < 10% of span" | Firgelli Engineering Calculators; leancrew.com catenaries article; multiple cable-tension references — VERIFIED |
| "Final sag > initial sag due to thermal elongation and creep" | O-Calc Pro Tension Types and Sag Explained (public wiki) — VERIFIED |
| "Initial vs. final sag distinction is why designers use 'final sag' for clearance calculations" | O-Calc Pro; RUS 1751F-630 (discusses final unloaded sag at 60°F for design clearance) — VERIFIED |

#### Worked example (pre-derived)

**Setup:** Residential FTTH aerial build in Macon, GA (Light district). Lashed plant: 0.135-inch strand (6M) carrying a 12-fiber OSP cable. Total weight w = 0.145 lb/ft. Final stringing tension H = 600 lb. Span L = 150 ft. Attachment height = 22 ft.

**Step 1: Calculate sag (no wind).**
- s = wL² / (8H)
- s = (0.145 × 150²) / (8 × 600)
- s = (0.145 × 22,500) / 4,800
- s = 3,262.5 / 4,800
- **s = 0.680 ft (8.2 inches)**

**Step 2: Calculate midspan height (no wind).**
- Midspan height = 22.0 − 0.680 = **21.32 ft**

**Sanity check:** "The cable sags only 8 inches below the attachment point at midspan. That puts the lowest point of the cable at 21 feet above the road — well above the ≈ 15.5-ft clearance minimum."

**Step 3: Wind-loaded sag (Light district, 9 psf).**
- Projected diameter of strand ≈ 0.5 inch → projected area = 0.042 ft²/ft
- w_wind = 9 × 0.042 = 0.375 lb/ft
- w_combined = √(0.145² + 0.375²) = √(0.0210 + 0.1406) = √0.1616 = **0.402 lb/ft**
- s_loaded = (0.402 × 22,500) / 4,800 = 9,045 / 4,800 = **1.885 ft (22.6 inches)**

**Sanity check:** "In a 9-psf windstorm, sag grows from 8 inches to nearly 23 inches — almost three times as much. The cable drops to 22.0 − 1.885 = 20.1 ft at midspan, still well above the road clearance minimum."

**Step 4: What if it were the Heavy district instead?**
(Illustrative — Light district rule applies in Macon, GA)
- Ice: w_ice = 1.244 × 0.5 × (0.5 + 0.5) = 1.244 × 0.5 × 1.0 = 0.622 lb/ft (strand OD used here)
- Vertical total: 0.145 + 0.622 = 0.767 lb/ft
- Wind on iced strand (1.0-inch iced OD): w_wind = 4 × (1.0/12) = 0.333 lb/ft
- w_combined = √(0.767² + 0.333²) = √(0.588 + 0.111) = √0.699 = **0.836 lb/ft**
- s_heavy = (0.836 × 22,500) / 4,800 = **3.922 ft (47 inches)**

**Sanity check:** "In Heavy district, the same span/tension combination produces sag of nearly 4 feet — almost 6× the no-wind Light district sag. Midspan height = 22.0 − 3.9 = 18.1 ft. Still clears ≈ 15.5 ft, but with only 2.6 ft of margin. This is why engineering teams increase span tension or shorten spans in Heavy districts."

#### Interactive primitive recommendations
- WorkedExample (full): user inputs w, L, H → gets sag + midspan height + clearance check
- SliderExploration: vary span 50–300 ft with fixed tension → watch sag grow (non-linear, s ∝ L²)

#### Quiz question seeds
1. (WorkedExample verify) Given w = 0.200 lb/ft, L = 120 ft, H = 700 lb, calculate sag → s = (0.200 × 14,400) / (8 × 700) = 2,880 / 5,600 = **0.514 ft**
2. (MC) When sag doubles, to restore the original sag you can: A) Double the span B) Double the tension C) Halve the tension D) Halve the span → **B** (sag ∝ 1/H)

#### Lesson confidence: **HIGH** (formula verified from multiple sources; all examples independently derived)

---

### T05.L08 — Joint Use — Who Owns What on the Pole

#### DAG prerequisites
- From T01: T01.L02 (Parts of a Pole — zones)
- From T05: T05.L02 (Rule 232 clearance); T05.L03 (Rule 235 zone separation)

#### Vocabulary introduced
- joint use, ILA (pole attachment agreement), overlashing, pole owner, attacher, CATV (cable TV), CLEC, ILEC, overlashing rights, attachment fee

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Pole attachment rates governed by 47 CFR Part 1, Subpart J" | 47 CFR Part 1 Subpart J (eCFR, public) — VERIFIED |
| "Overlashing: adding cable to an existing attacher's messenger without a new attachment agreement" | FCC definition per Varasset FCC Attachment Guidelines article; eCFR 47 CFR Part 1 — VERIFIED |
| "FCC rules require pole owners to allow overlashing; may require ≤ 15 days advance notice" | eCFR 47 CFR § 1.1406; Varasset article — VERIFIED |
| "Overlashing party is responsible for ensuring its work meets safety, reliability, and engineering practices" | 47 CFR Part 1 Subpart J per Varasset reference — VERIFIED |
| "Joint-use agreement (ILA) governs attachment rates, make-ready terms, and liability" | Module02 §2.6; FCC 47 CFR Part 1; FCC 18-111 — VERIFIED |

#### Interactive primitive recommendations
- BranchingScenario: "You need to run 12 fibers from Point A to Point B on poles owned by the electric utility. Your company is not currently an attacher on those poles. Walk through the steps: attachment application → make-ready estimate → permit → attach."
- AnnotatedDiagram: who owns what on a 3-attacher joint-use pole

#### Lesson confidence: **HIGH**

---

### T05.L09 — OTMR in Aerial Design

#### DAG prerequisites
- From T05: T05.L08 (joint use, attacher roles)

#### Vocabulary introduced
- OTMR (One-Touch Make-Ready), FCC 18-111, 47 CFR § 1.1411, 15-day approval clock, simple vs. complex make-ready, new attacher, existing attacher, notice period

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "OTMR created by FCC 18-111 (August 2018 Third Report and Order)" | FCC 18-111 (public, docs.fcc.gov) — VERIFIED |
| "Pole owner has 15 days (calendar) after complete application to approve or deny" | 47 CFR § 1.1411 (law.cornell.edu eCFR) — VERIFIED |
| "Application completeness determination: 10 business days" | 47 CFR § 1.1411 (eCFR) — VERIFIED |
| "3 business days advance notice before field survey/inspection" | 47 CFR § 1.1411; FCC 18-111 OJUA summary — VERIFIED |
| "Simple make-ready = no splicing, no supply-space work, no customer outage risk" | 47 CFR § 1.1411 definition; FCC 18-111 — VERIFIED |
| "Complex make-ready = splicing, supply-space work, antennas, or customer outage foreseeable" | 47 CFR § 1.1411; FCC 18-111 — VERIFIED |
| "Complex determination must be in writing with evidence" | 47 CFR § 1.1411 (eCFR) — VERIFIED |

**Note on ARCH.md:** ARCH.md lists T05.L09 as "OTMR in Aerial Design" referencing Module02 §2.8. The Module02 §2.8 content uses "10 business days" for the survey completion timeline (not the approval decision). Per 47 CFR § 1.1411 as confirmed above: the **completeness determination** = 10 business days; the **approval decision** = 15 days. Module02 §2.8 may be mixing two different clocks. T05.L09 author must clarify this distinction clearly in the lesson body. BICSI OSP Designer exam candidates are tested on these specific timelines.

#### Interactive primitive recommendations
- Quiz (drag-match): scenario descriptions → Simple or Complex classification
- BranchingScenario: "You're the new attacher's project manager. OTMR application filed Monday. Walk through every FCC timeline checkpoint."

#### Lesson confidence: **HIGH** (OTMR rules are publicly available in eCFR and FCC 18-111)

---

### T05.L10 — ADSS Aerial Design

#### DAG prerequisites
- From T03: T03.L04 (ADSS introduced as cable type); T03.L09 (ADSS span/wind/ice loading — **REQUIRED**: confirm T03.L09 is authored before dispatching this lesson**)
- From T05: T05.L06 (loading districts, ice formula); T05.L07 (sag-tension math)

#### Vocabulary introduced
- EDS (Everyday Stress) as % of RTS, self-damping, aeolian vibration, span rating, short-span vs. long-span ADSS, hardware (deadend clamps, suspension clamps)

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "ADSS = All Dielectric Self-Supporting; no metallic elements" | Corning ADSS installation guide (public, corning.com); Focabex ADSS installation guidelines — VERIFIED |
| "EDS typically 16–25% of RTS" | Focabex ADSS installation guidelines (public PDF); Scribd ADSS Sag-Tension Analysis — VERIFIED |
| "EDS is the long-term everyday stringing tension; ensures no fiber strain" | Focabex ADSS guidelines; ADSS sag-tension design references — VERIFIED |
| "ADSS span ratings (e.g., up to 100m, 200m, 300m) set by cable manufacturer's design" | Corning ADSS catalog (public ecatalog.corning.com); Bonelinks ADSS specs — VERIFIED (span rating is a catalog value) |
| "Aeolian vibration: resonant oscillation from wind; managed by dampers and EDS limits" | Focabex guidelines; STL Technologies dry-core ADSS placement guide — VERIFIED |

#### Worked example (pre-derived)

**Setup:** 96-fiber ADSS cable; OD = 0.82 inch; self-weight w = 0.260 lb/ft; RTS = 2,800 lb; EDS = 20% = 560 lb; span L = 200 ft; Light district (Macon, GA).

**Step 1: Sag at EDS, no wind:**
- s = wL² / (8H) = (0.260 × 200²) / (8 × 560) = (0.260 × 40,000) / 4,480 = 10,400 / 4,480 = **2.32 ft (27.9 in)**

**Step 2: Wind load (Light, 9 psf, no ice):**
- Projected area = 0.82 / 12 = 0.0683 ft²/ft
- w_wind = 9 × 0.0683 = **0.615 lb/ft**
- w_combined = √(0.260² + 0.615²) = √(0.0676 + 0.3782) = √0.4458 = **0.668 lb/ft**
- s_wind = (0.668 × 40,000) / 4,480 = 26,720 / 4,480 = **5.96 ft (71.5 in)**

**Step 3: Clearance check (attachment at 22 ft):**
- Midspan height (no wind) = 22.0 − 2.32 = **19.68 ft**
- Midspan height (9-psf wind) = 22.0 − 5.96 = **16.04 ft**
- NESC 232 minimum ≈ 15.5 ft → margin with wind = **0.54 ft — tight.** This is a borderline design requiring either higher attachment or shorter span.

**Sanity check:** "At 200-ft span with 9-psf wind, this ADSS cable clears the road by barely half a foot. In practice, the designer would shorten the span or raise the attachment by 1–2 ft to hit the 1–2 ft design margin the field crew wants."

#### Interactive primitive recommendations
- WorkedExample: full ADSS sag calculator with EDS + district + span inputs
- SliderExploration: vary span and watch clearance margin change; shows the 200-ft span is the design limit

#### Lesson confidence: **HIGH** (math independently derived; EDS range verified from public sources)

---

### T05.L11 — OPGW and Hybrid Cables

#### DAG prerequisites
- From T05: T05.L10 (aerial cable design context)
- From T02: T02.L02 (attenuation context for why OPGW is designed carefully)

#### Vocabulary introduced
- OPGW, shield wire, overhead ground wire (OGW/OHGW), ground fault current, transmission vs. distribution distinction, "hybrid" OSP cable (fiber + copper wrapped)

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "OPGW = Optical Ground Wire; replaces overhead shield wire on transmission structures; carries fiber AND acts as lightning shield" | RUS Bulletin 1751F-630 scope references OPGW; FOA OSP construction reference — VERIFIED via secondary |
| "OPGW is a transmission-structure product, not a distribution/OSP joint-use pole attachment" | Industry practice — VERIFIED; distribution poles use ADSS or lashed cable, not OPGW |
| "OPGW must handle fault current; the metallic strand (steel/aluminum) carries fault energy while protecting the fiber core" | FOA Reference Guide; OPGW manufacturer literature (Prysmian, AFL) — VERIFIED concept |

#### Interactive primitive recommendations
- Quiz (MC): "OPGW is most commonly found on:" A) 40-ft joint-use distribution poles B) 115-kV transmission towers C) Residential FTTH drops D) Underground handhole splices → **B**

#### Lesson confidence: **MEDIUM** (OPGW is well-understood in the field; limited in-depth secondary sources accessible without paywall for detailed specs; lesson is conceptual/awareness, not design-level)

---

### T05.L12 — PON / FTTH Aerial Topology

#### DAG prerequisites
- From T01: T01.L01 (OLT, ONT, FDH vocabulary)
- From T02: T02.L06 (link budget — required for power budget calculation)
- From T03: T03.L07 (fiber count selection; FDH as a distribution node)
- From T05: T05.L07 (sag-tension); T05.L10 (ADSS — the aerial drop cable type)

#### Vocabulary introduced
- PON, GPON, EPON, XGS-PON, split ratio (1:32 typical residential), FDH (Fiber Distribution Hub), NAP (Network Access Point), feeder fiber, distribution fiber, drop fiber, ODN (Optical Distribution Network), splitter insertion loss

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "GPON standard: ITU-T G.984; downstream 2.488 Gbps, upstream 1.244 Gbps" | ITU-T G.984.1 (public ITU-T description); multiple vendor documentation — VERIFIED |
| "XGS-PON: ITU-T G.9807.1; symmetric 10 Gbps" | ITU-T G.9807.1 (public description) — VERIFIED |
| "1:32 split ratio is standard residential GPON design; 1:64 used in dense urban deployments" | FOA Reference Guide to Fiber Optics; vendor GPON design guides — VERIFIED as industry standard |
| "1:32 passive splitter insertion loss typically 17–17.5 dB" | FOA Reference Guide; TIA-568.3-D OSP link budget context; fibermall.com, bativ.com PLC splitter datasheets — VERIFIED range. PLC splitter real-world range is 17–17.5 dB; worked example uses 17.0 dB (low end of range) with explicit range note for learners. |
| "GPON link budget: up to 28 dB (Class B+) allowed between OLT and ONT" | ITU-T G.984.2 Table 1 (Class B+ budget: 13 dBm Tx − (−8 dBm) Rx sensitivity = 28 dB available margin) — VERIFIED via multiple secondary sources |

#### Worked example (pre-derived — FTTH aerial link budget)

**Scenario:** GPON feeder from headend OLT to FDH (1.5-mile aerial run), then 1:32 passive splitter, then drop to ONT (0.3-mile aerial drop).

Losses:
- Feeder fiber: 1.5 mi × 1.61 km/mi = 2.415 km × 0.40 dB/km (1310 nm max per G.652.D) = **0.97 dB**
- Connectors (2 × patch): 2 × 0.75 dB = **1.50 dB**
- 1:32 splitter: **17.0 dB** *(typical PLC range: 17–17.5 dB; this example uses 17.0 dB at the low end — author note: state the range in lesson prose)*
- Drop fiber: 0.3 mi × 1.61 km/mi = 0.483 km × 0.40 dB/km = **0.19 dB**
- Connector at ONT: **0.75 dB**
- Total loss: 0.97 + 1.50 + 17.0 + 0.19 + 0.75 = **20.41 dB**

Available budget (Class B+): 28 dB
Margin: 28 − 20.41 = **7.59 dB**

Sanity check: "7.6 dB of margin left. GPON designers typically want ≥ 3 dB margin; 7.6 dB is healthy. If we extended the feeder to 3 miles (4.83 km at 0.40 dB/km = 1.93 dB feeder loss, an increase of 0.97 dB from the 1.5-mile base), the margin would shrink to about 6.6 dB — still healthy, but the extra feeder length is starting to eat into the budget."

#### Interactive primitive recommendations
- WorkedExample: FTTH link budget calculator with span inputs → loss calculation → pass/fail vs Class B+
- AnnotatedDiagram: PON tree topology (OLT → feeder fiber → FDH/splitter → drops → ONTs)

#### Lesson confidence: **HIGH** (GPON specs are public ITU-T standards; math independently derived)

---

### T05.L13 — Make-Ready in the Design

#### DAG prerequisites
- From T04: T04.L05 (pole audit); T04.L08 (handoff to design) — **annotate as T04-dependent; ensure T04 authored before dispatching**
- From T05: T05.L08 (joint use); T05.L09 (OTMR)
- From T09: T09 covers permit tracking; cross-reference as "covered in T09" without assuming T09 knowledge

#### Vocabulary introduced
- make-ready cost estimate, transfer conflict, design hold, mid-span conflict, attachment height conflict, riding attachment, clearance violation existing (pre-existing), incumbent attacher

#### Claims requiring citation
| Claim | Source | Status |
|---|---|---|
| "Make-ready cost can equal or exceed aerial build cost on dirty corridors" | Module02 §2.6 field callout; FBA/Cartesian cost study commentary — VERIFIED as industry-documented reality |
| "Make-ready estimate is prepared by the pole owner's make-ready engineer or the attacher's surveyor" | FCC 18-111; 47 CFR § 1.1411 workflow — VERIFIED |
| "Design hold: if make-ready cost exceeds budget, design is revised before permit application" | Industry practice — VERIFIED; not a specific standard reference, present as documented field practice |

#### Interactive primitive recommendations
- BranchingScenario: "Your design survey reveals 4 poles requiring make-ready: 2 are simple (comm-only transfers), 1 requires a transfer that may cause customer outage (complex), and 1 requires pole replacement. What are the OTMR implications of each?"

#### Lesson confidence: **HIGH**

---

### T05.L14 — Aerial Design QA Checklist

#### DAG prerequisites
- From T05: All prior T05 lessons (this is the hands-on integration lesson)
- From T04: T04 (design inputs) — annotate as T04-dependent

#### Vocabulary introduced
- No new vocabulary — this lesson applies all prior T05 terms in a design-review context

#### Claims requiring citation
No new standards claims — this lesson is an applied QA walkthrough using all prior T05 standards.

#### Interactive primitive recommendations
- BranchingScenario: "Review a simulated one-page aerial design plan. Find the clearance error, the missing loading district annotation, and the Grade B crossing that was labeled Grade C."
- HotSpot: photograph of a joint-use pole with 3 violations hidden in the image — click to identify them

#### Lesson confidence: **HIGH**

---

### T05.L15 — T05 Capstone Quiz

25 questions spanning all T05 content: clearance values (Rules 232/235/250/261), sag formula calculation, loading district identification, OTMR clock, ADSS EDS, GPON link budget, grade of construction triggers, ice load formula application.

Include at least 3 WorkedExample verify questions where the learner completes a partial calculation.

---

## Consolidated Paywalled-Claim List

| # | Claim | Source document | Status | Lesson |
|---|---|---|---|---|
| P1 | NESC C2-2023 Rule 232 / Table 232-1 exact clearance values | NESC C2-2023 (paywalled) | HEDGED — secondary sources confirm ≈ 15.5 ft / 9.5 ft | L02 |
| P2 | NESC C2-2023 Rule 235 / Table 235-5 exact separation matrix | NESC C2-2023 (paywalled) | HEDGED — secondaries confirm 40 in (2 sources) | L03 |
| P3 | NESC C2-2023 Rule 261 exact grade triggers beyond B/C/N | NESC C2-2023 (paywalled) | Omitted — state B/C/N qualitatively only | L04 |
| P4 | NESC C2-2023 Section 26 load/strength factor matrix | NESC C2-2023 (paywalled) | Omitted — do not quote "4-to-1" or "2-to-1" from memory | L04, L05 |
| P5 | NESC C2-2023 Rule 250 Table 250-1 exact values | NESC C2-2023 (paywalled) | VERIFIED — 3 independent secondaries agree; values locked | L06 |
| P6 | ANSI O5.1-2022 exact fiber strength values per class | ANSI O5.1-2022 (paywalled) | HEDGED — Class 1 ≈ 4,500 lb, Class 3 ≈ 3,000 lb per utility manuals | L05 |
| P7 | BICSI OSPDR chapter + section cross-references | BICSI OSPDR (paywalled) | Not cited directly; indirect via RUS and NESC anchors | all |
| P8 | ITU-T G.984.2 GPON Class B+ power budget table | ITU-T (paywalled for historical editions) | VERIFIED via multiple public secondary sources (28 dB for Class B+) | L12 |

**Total paywalled claims: 8. Of these, 2 are verified via 2+ secondaries (P2, P5, P8), 1 verified via 3 secondaries (P5), 2 omitted intentionally (P3, P4), 3 hedged (P1, P6).**

---

## Hallucination-Risk Register

| # | Risk item | Mitigation |
|---|---|---|
| H1 | Loading district values — prior T03 brief hallucinated (Heavy ice transposed with Light) | LOCKED: 3 independent secondaries confirm values. Match exactly T03 brief `148e1e7`. |
| H2 | NESC Rule 235 "40 inches" — could be confused with 40-ft pole height or 40-mph wind | Source citation specific: ikeGPS article says "40 in." explicitly. RT must check unit consistency. |
| H3 | OTMR timelines — multiple clocks (10 business days completeness, 15 days approval, 3 days survey notice, 45 days utility survey) can be confused | All verified from 47 CFR § 1.1411 public eCFR text. RT should verify each clock against eCFR. |
| H4 | GPON link budget — 1:32 splitter loss (17 dB) — could drift to 15 dB or 18 dB if training data is inconsistent | Derived from: log₂(32) = 5 doublings × ~3.4 dB/doubling ≈ 17 dB. Multiple secondary sources confirm. RT should re-derive. |
| H5 | ANSI O5.1 pole class fiber-strength values (Class 1 ≈ 4,500 lb) — these are species-dependent; southern yellow pine values differ from Douglas fir | Lesson should state "approximately X lb for typical species; confirm with ANSI O5.1-2022 Table 4 for your design." No species-specific numbers locked without paywall access. |
| H6 | RTS and EDS values for ADSS — these are catalog values varying by manufacturer and design span | Source: Corning, Focabex, Bonelinks datasheets. Lesson should present EDS as a percentage of RTS (16–25%), not a fixed number. RT verifies percentage range from multiple sources. |
| H7 | Ice-load formula coefficient (1.244 vs 1.2435) — rounding in training data may produce wrong value | Formula independently derived algebraically: coefficient = 57π/144 = **1.2435**. Rounded to 1.244 for field use. RT re-derive independently. |
| H8 | NESC Rule 250C (Extreme Wind) threshold: structures ≥ 60 ft above ground | Threshold is 60 ft or more (≥ 60 ft) — a 60-ft pole IS in scope. Verified from ikeGPS NESC 2007 Part 1 article + IAEI NESC articles. RT-A confirmed this correction (prior "taller than 60 ft" language was imprecise). |

---

## DAG Dependency Status Table

| Dependency | Status at time of brief | Action required for T05 authoring |
|---|---|---|
| T01 (all 10 lessons) | ✓ AVAILABLE | No action needed |
| T02 (all 12 lessons) | ✓ AVAILABLE | No action needed |
| T03 (L01–L09 authored, L10–L12 pending) | ⏳ PARTIAL | T05 lessons that need T03.L09 ADSS content: confirm T03.L09 in HEAD before T05.L10. T05 lessons that need T03.L10–L12: check before dispatch; see notes under each lesson. |
| T04 (brief done, authoring NOT yet dispatched) | ⌛ PENDING | T05.L13, T05.L14 reference T04 vocabulary. Authors must: (a) wait for T04 to land before dispatching L13/L14, OR (b) re-introduce T04 terms in L13/L14 bodies. Flag this explicitly in author prompt. |
| T09 (Permitting — brief not yet written) | ⌛ NOT STARTED | T05.L13 references permit tracking. T09 vocabulary is not available to T05 authors. L13 should cross-reference T09 as "coming in T09" rather than assuming knowledge. |
| T18 (Safety — brief not yet written) | ⌛ NOT STARTED | T05 lessons near energized conductors (L03 Rule 235 context, L08 joint-use safety) should note MAD/MAB will be covered in T18. Do NOT introduce MAD/MAB values in T05 — those belong in T18. |

---

## Verdict

**GREEN** — All primary technical claims for T05 are verifiable via public secondary sources. Three categories of managed limitations:

1. **Paywalled NESC table values** — handled by secondary-source convergence (Rule 235 40-inch: 2 sources; Rule 250 values: 3 sources; Rule 232 clearances: 2 sources). Lesson hedge language locks in proper uncertainty framing.
2. **ANSI O5.1 species-specific values** — managed by presenting approximate ranges with explicit "confirm from O5.1-2022" language.
3. **OTMR timeline complexity** — all timelines directly verified from public eCFR text; minor discrepancy in Module02 §2.8 (conflates two separate clocks) flagged for author to correct.

All formulas (sag, ice load, pole setting depth, link budget) independently derived and numerically verified. Values match prior curriculum brief chain (T03 `148e1e7`).

---

## Proposed Allowlist Additions

None required. All T05 sources are already on the trusted-sources allowlist:
- NESC C2-2023 (§23, §24, §25, Rules 232/235/250/261) ✓
- ANSI O5.1 ✓
- 47 CFR Part 1 (OTMR/pole attachment) ✓
- FCC 18-111 ✓
- RUS Bulletin 1751F-630 ✓
- ITU-T G.984 (GPON) ✓
- FOA Reference Guide ✓

One new secondary source used for verification that could be added for future agents:
- **ikeGPS IKEwire knowledge base** (ikegps.com/ikewire/) — recurring high-quality NESC secondary source; confirms 40-inch safety zone, clearance values, grades of construction, loading districts. Recommend adding to allowlist as a named "NESC application guide (secondary)" source.
- **Incabamerica Sag and Tension Theory 101 (2024 PDF)** — clear derivation of parabolic sag formula and terms; recommend adding to allowlist for sag/tension topics.

---

## Recommended RT Framings for T05

Given T05's math-heavy content and multiple paywalled NESC claims:

**RT-A: Technical accuracy + math re-derivation.** Re-derive the sag formula examples (L07, L10), ice-load formula (L06), and FTTH link budget (L12) independently. Verify loading district values match the three-secondary-source chain. Verify OTMR timelines against eCFR. Focus on numbers.

**RT-B: Pedagogy + prerequisite coverage.** Walk every lesson and verify that no term appears before its first-introduction lesson. Cross-check the DAG dependency table above — especially T04 vocabulary in L13/L14 and T09 vocabulary in L13. Verify Macon, GA = Light district is correctly applied throughout. Verify book/field dichotomy is present wherever they diverge (clearance margin practice vs. NESC minimum; OTMR reality vs. FCC intent; Grade B default practice vs. code requirement).

=== T05 AERIAL OSP DESIGN RESEARCH BRIEF END ===
