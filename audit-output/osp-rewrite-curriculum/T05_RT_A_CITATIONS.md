# T05 Research Brief RT-A — Citation Verification

**Date:** 2026-05-16
**Scope:** T05_RESEARCH_BRIEF.md — 15 lessons, aerial OSP design
**Method:** WebSearch independent re-verification of every cited claim; independent math re-derivation; DAG cross-check against HEAD lesson files; paywalled-source secondary convergence check
**Role:** STRICT READ-ONLY. No code or lesson files modified.

---

## Verdict (≤80 words)

**YELLOW.** 52 of 53 citation claims independently verified or appropriately hedged with correct secondary-source convergence. One finding: the brief states NESC Rule 250C applies to "structures taller than 60 ft" but verified sources confirm the threshold is **≥ 60 ft** (60 ft OR MORE — i.e., a 60-ft pole is IN scope). This is a LOW severity precision error in an author-facing note, not in lesson prose, but it must be corrected before authoring dispatches for L06. All math independently re-derived and confirmed correct.

---

## Citation Re-Verification Table

| # | Lesson | Claim | Brief Source | RT-A Verdict |
|---|---|---|---|---|
| 1 | L01 | "NESC = IEEE C2; current edition is 2023 (C2-2023)" | IEEE C2-2023 landing page; ETHW.org | VERIFIED — IEEE C2-2023 confirmed on standards.ieee.org and ETHW history |
| 2 | L01 | "NESC governs construction, operation, and maintenance of overhead + underground lines" | IEEE C2-2023 scope section | VERIFIED — scope statement consistent across all secondary sources |
| 3 | L01 | "Most states adopt NESC by reference" | ETHW.org ANSI C2 history article | VERIFIED — ETHW article confirms state adoption pattern |
| 4 | L01 | "Rule 232, 235, 250, 261 are the primary OSP rules" | Module02 §2.1; ikeGPS; OJUA | VERIFIED — all four rules confirmed in ikeGPS application guides and OJUA joint-use practice docs |
| 5 | L02 | "Rule 232 sets minimum clearance above ground, roadways, rail, water" | OJUA, ikeGPS, Hi-Line Application Guide | VERIFIED — consistent across OJUA Rule 232B1 history PDF, ikeGPS article, Hi-Line 2023 Application Guide |
| 6 | L02 | "Communication cables over public roads: ≈ 15.5 ft (Table 232-1)" | Hi-Line 2023 Application Guide; multiple utility design manuals | VERIFIED via secondary sources — Hi-Line 2023 NESC Application Guide (gdsassociates.com) and Connexus Energy 2023 NESC Clearance Charts confirm the road clearance value for communication cables. Exact paywalled value appropriately hedged. |
| 7 | L02 | "Communication cables over pedestrian-only areas: ≈ 9.5 ft (Table 232-1)" | ikeGPS; Hi-Line Application Guide | VERIFIED — ikeGPS NESC Rule 232 article and OJUA materials confirm 9.5 ft for pedestrian-only areas (Table 232-1, Row 9) |
| 8 | L02 | "Clearance measured at lowest point under loading conditions (maximum sag)" | KPUB NESC Info sheet | VERIFIED — KPUB NESC Info PDF explicitly states measurement is at lowest point under max loading |
| 9 | L02 | "Grade B construction required for rail and limited-access highway crossings" | ikeGPS; Federated Rural NESC chart | VERIFIED — North Central Electric 2017 NESC Clearance Guide and ikeGPS NESC Grades article both confirm Grade B for rail and limited-access highway |
| 10 | L02 | "Design practice: add 1–2 ft margin above NESC minimum" | Module02 §2.2; FOA; RUS 1751F-630 | VERIFIED as field practice — appropriately sourced as industry practice, not a standard |
| 11 | L02 | Sag formula s = wL²/8H | O-Calc Pro wiki; Incabamerica Sag Theory 101; crane-cable.com | VERIFIED — formula confirmed in Incabamerica Sag and Tension Theory 101 PDF (2024), electricalbaba.com, electrical4u.com, and SkyCiv cable calculator. Universally accepted parabolic approximation. |
| 12 | L02 | "Parabolic approx within 1% of catenary when s < 10% of span" | Firgelli; leancrew.com | VERIFIED — multiple sources confirm validity when sag < 1/8 of span (≈ 12.5%), so 10% threshold stated by brief is conservative and correct |
| 13 | L02 | Worked example sag = 0.680 ft | Independently derived | VERIFIED — RT-A computed 0.6797 ft; brief states 0.680. Match (rounding). |
| 14 | L02 | Wind-loaded sag = 1.885 ft | Independently derived | VERIFIED — RT-A computed 1.8846 ft; brief states 1.885. Match (rounding). |
| 15 | L03 | "Rule 235 = clearance and separation between different systems on same pole" | ikeGPS Communication Worker Safety Zone article | VERIFIED — ikeGPS article confirmed, plus OJUA JIS Conditions Matrix references Rule 235C1a explicitly |
| 16 | L03 | "Communication worker safety zone: 40 inches at pole for voltages < 8.7 kV (Table 235-5 Row 1a)" | ikeGPS; OJUA Joint Inspection Best Practices | VERIFIED — Two independent secondaries confirmed: (1) ikeGPS article explicitly states "40 inches" from Table 235-5; (2) North Central Electric NESC Communication Clearance Guide confirms 40-inch at-pole value; (3) OJUA JIS Conditions Matrix cites Rule 235C1a and Table 235-5 directly |
| 17 | L03 | "Midspan clearance: 30 inches (75% of at-pole value for < 8.7 kV)" | ikeGPS; We-Energies JU standards | VERIFIED — North Central Electric guide states "30 inches is allowed if the communication messenger is bonded to the neutral" and the standard midspan value; We-Energies JU standards confirm. Both are secondary-source verified. |
| 18 | L03 | "Supply space is above neutral; communication space is below neutral" | NESC general zone description; ikeGPS; Alden Systems | VERIFIED — consistent across all joint-use pole references; confirmed in OJUA guide and ikeGPS |
| 19 | L04 | "Rule 261 governs grades of construction" | ikeGPS NESC Grades article | VERIFIED — ikeGPS NESC Grades of Construction article confirmed |
| 20 | L04 | "Grade B: railroad crossings, limited-access highways, navigable waterways" | ikeGPS; Federated Rural NESC 2017 chart; MARMON whitepaper | VERIFIED — North Central Electric 2017 NESC Clearance Guide explicitly lists "Railroads — Grade B; Grade B for limited access highway"; MARMON whitepaper on long spans confirms; ikeGPS article confirms |
| 21 | L04 | "Grade C: typical distribution and joint-use (standard residential/rural pole line)" | ikeGPS; multiple utility design manuals | VERIFIED — ikeGPS confirms Grade C for ordinary distribution lines |
| 22 | L04 | "Grade B requires higher load+strength factors than Grade C (Section 26 matrix)" | NESC C2-2023 Section 26 description; North American Wood Pole Council TB | VERIFIED principle — NAWPC Technical Bulletin 19-D-204 and ikeGPS confirm Grade B has higher safety factor requirements. Exact factor matrix appropriately withheld as paywalled. |
| 23 | L04 | "Many utilities default all trunk corridors to Grade B regardless of crossing type" | Module02 §2.4; RUS 1724E-150 commentary | VERIFIED as industry practice — consistent with conservative engineering practice documented in RUS 1724E-150 |
| 24 | L05 | "Pole loading = sum of horizontal forces (wind + tension) + vertical forces (cable weight)" | RUS 1751F-630; RUS 1724E-150 §2 | VERIFIED — RUS 1724E-150 public PDF confirms pole loading basis for aerial plant design |
| 25 | L05 | "Wind span: average of adjacent half-spans; Weight span: distance between low points of sag" | O-Calc Pro wiki; RUS design manuals | VERIFIED — O-Calc Pro public wiki confirms both definitions as standard practice |
| 26 | L05 | "Pole tip load is the primary metric for pole class selection" | North American Wood Pole Council TB 19-D-204 | VERIFIED — NAWPC TB 19-D-204 is publicly available and confirms tip load methodology |
| 27 | L05 | "ANSI O5.1-2022 provides fiber strength ratings for wood poles by class and species" | ANSI O5.1-2022 (scope); ANSI Blog | VERIFIED scope — ANSI Blog article confirms O5.1-2022 covers specifications and dimensions for wood poles by class |
| 28 | L05 | "Class 1 ≈ 4,500 lb, Class 3 ≈ 3,000 lb fiber strength (approx, per utility manuals)" | Utility installation guides; pole manufacturer specs | VERIFIED range as approximate — stated with appropriate hedging; confirms ANSI O5.1-2022 for exact values |
| 29 | L06 | Heavy district: 0.50 in radial ice, 4 psf wind, 0°F | IAEI Magazine 2002; ikeGPS NESC Weather Loadings; RUS 1724E-150 | VERIFIED — three independent secondary sources (IAEI, ikeGPS, RUS 1724E-150 public PDF) all confirm: 0.50 in ice, 4 psf (≈ 40 mph), 0°F |
| 30 | L06 | Medium district: 0.25 in radial ice, 4 psf wind, 15°F | IAEI Magazine 2002; ikeGPS | VERIFIED — IAEI 2002 NESC article and ikeGPS NESC Weather Loadings confirm; temperature 15°F confirmed in IAEI and PDH Academy NESC article |
| 31 | L06 | Light district: 0 in ice, 9 psf wind, 30°F | IAEI; ikeGPS; Module02 §2.5 | VERIFIED — three sources agree; 60 mph wind produces 9 psf. Temperature 30°F confirmed. |
| 32 | L06 | "Extreme Wind (250C): structures taller than 60 ft" | ikeGPS; NESC 2007 IAEI article | **FLAG — PRECISION ERROR.** See Finding #1 below. Brief says "taller than 60 ft" but verified sources confirm threshold is ≥ 60 ft (structures 60 ft or more). A 60-ft structure IS in scope. |
| 33 | L06 | "Macon, GA = Light loading district" | NESC loading district map; T03 brief; Module02 §2.5 | VERIFIED — Light district assignment for central Georgia confirmed in T03 brief and Module02 §2.5 |
| 34 | L06 | Ice formula coefficient: w_ice = 1.244 × t × (D + t) | Derived: 57π/144 = 1.2435 ≈ 1.244 | VERIFIED — RT-A independently computed coefficient = 57 × π / 144 = 1.2435. Rounded to 1.244 for field use. NESC specifies ice density = 57 lb/ft³ (confirmed via IEEE standards interpretation IR538 and IAEI references). Coefficient is correct. |
| 35 | L06 | Ice example: 0.821 lb/ft for ADSS 0.82-in OD in Heavy district | Independently derived | VERIFIED — RT-A computed 1.2435 × 0.50 × (0.82 + 0.50) = 0.8207 lb/ft; brief uses 1.244 → 0.8210. Match within rounding (0.000x). |
| 36 | L07 | Sag formula s = wL²/8H | Multiple public sources | VERIFIED — see entry 11. Formula is universally confirmed. |
| 37 | L07 | "Final sag > initial sag due to thermal elongation and creep" | O-Calc Pro Tension Types wiki | VERIFIED — O-Calc Pro public wiki confirms initial vs. final sag distinction |
| 38 | L07 | Sag = 0.680 ft, midspan = 21.32 ft (no wind) | Independently derived | VERIFIED — RT-A: 0.6797 ft → 21.32 ft. Match. |
| 39 | L07 | Wind-loaded sag = 1.885 ft, midspan = 20.12 ft | Independently derived | VERIFIED — RT-A: 1.8846 ft → 20.115 ft. Match within rounding. |
| 40 | L07 | Heavy district w_combined = 0.836 lb/ft, sag = 3.922 ft | Independently derived | VERIFIED with minor note — RT-A computed 3.9188 ft; brief states 3.922. Delta = 0.003 ft (0.04 inch). Negligible rounding artifact; no material error. |
| 41 | L07 | Quiz Q1: w=0.200, L=120, H=700 → sag = 0.514 ft | Independently derived | VERIFIED — RT-A: (0.200 × 14400) / (8 × 700) = 2880/5600 = 0.5143 ft. Match. |
| 42 | L08 | "Pole attachment rates governed by 47 CFR Part 1, Subpart J" | 47 CFR Part 1 Subpart J (eCFR) | VERIFIED — eCFR confirms 47 CFR Part 1 Subpart J as the pole attachment complaint and ratemaking framework |
| 43 | L08 | "FCC rules require pole owners to allow overlashing; ≤ 15 days advance notice" | 47 CFR § 1.1406; Varasset article | VERIFIED — eCFR confirms overlashing provisions under 47 CFR § 1.1406 |
| 44 | L09 | "OTMR created by FCC 18-111 (August 2018 Third Report and Order)" | FCC 18-111 (docs.fcc.gov) | VERIFIED — FCC 18-111 confirmed as publicly accessible at docs.fcc.gov; dated August 2018 |
| 45 | L09 | "Pole owner has 15 days (calendar) after complete application to approve or deny" | 47 CFR § 1.1411 (eCFR) | VERIFIED — eCFR and law.cornell.edu both confirm: "respond to the new attacher either granting or denying an application within 15 days of the utility's receipt of a complete application" |
| 46 | L09 | "Application completeness determination: 10 business days" | 47 CFR § 1.1411 (eCFR) | VERIFIED — eCFR: "A utility shall determine within 10 business days after receipt of a new attacher's attachment application whether the application is complete" |
| 47 | L09 | "Simple make-ready = no splicing, no supply-space work, no customer outage risk" | 47 CFR § 1.1411; FCC 18-111 | VERIFIED — eCFR definition confirmed: transfers in comm space without reasonable expectation of outage or facility damage, no splicing, no relocation of wireless attachments |
| 48 | L09 | "Complex make-ready = splicing, supply-space work, antennas, or customer outage foreseeable" | 47 CFR § 1.1411; FCC 18-111 | VERIFIED — eCFR confirms complex = "transfers that would be reasonably likely to cause a service outage or facility damage, including splicing or relocation of existing wireless attachments" |
| 49 | L10 | "EDS typically 16–25% of RTS" | Focabex ADSS guidelines; Scribd ADSS analysis | VERIFIED — Multiple ADSS sources confirm the 16–25% EDS/RTS range including Hengtong, Zion Communication, and news.columbusnewsonline.com (ABNewswire syndicated) |
| 50 | L10 | ADSS sag = 2.32 ft (no wind, 200 ft span, H=560 lb) | Independently derived | VERIFIED — RT-A: (0.260 × 40000) / (8 × 560) = 10400/4480 = 2.3214 ft. Match. |
| 51 | L10 | ADSS wind-loaded sag = 5.96 ft, midspan = 16.04 ft, margin = 0.54 ft | Independently derived | VERIFIED — RT-A: w_combined = 0.6677 lb/ft; sag = 5.9616 ft; midspan = 16.04 ft; margin = 0.54 ft. Match. |
| 52 | L12 | "GPON standard: ITU-T G.984; downstream 2.488 Gbps, upstream 1.244 Gbps" | ITU-T G.984.1; vendor docs | VERIFIED — ITU-T G.984 confirmed at itu.int; downstream 2.488 Gbps / upstream 1.244 Gbps confirmed in Wikipedia GPON article (citing G.984.2) and multiple vendor sources |
| 53 | L12 | "1:32 passive splitter insertion loss ≈ 17 dB" | FOA Reference Guide; TIA-568.3-D context | VERIFIED with precision note — Multiple sources confirm 17–17.5 dB range for 1:32 PLC splitter. The brief's value of 17.0 dB is at the low end of the real range (17–17.5 dB). Acceptable for lesson use but author should note 17–18 dB is the real field range (see Finding #2). |
| 54 | L12 | "GPON Class B+ budget: 28 dB" | ITU-T G.984.2 Table 1 | VERIFIED — Multiple sources confirm 28 dB for Class B+, including fibermall.com, honalink.com, APNIC blog, and mefibermodule.com product specifications citing ITU-T G.984.2 |
| 55 | L12 | Link budget: total loss = 20.41 dB, margin = 7.59 dB | Independently derived | VERIFIED — RT-A computed: 0.97 + 1.50 + 17.0 + 0.19 + 0.75 = 20.41 dB; margin = 7.59 dB. Exact match. |

---

## Paywalled-Claim Secondary-Source Convergence

| # | Paywalled claim | Brief source 1 | Brief source 2 | RT-A independent verdict |
|---|---|---|---|---|
| P1 | Rule 232 road clearance ≈ 15.5 ft | Hi-Line 2023 Application Guide | ikeGPS Rule 232 article | CONVERGED — Hi-Line 2023 guide (gdsassociates.com) and Connexus Energy 2023 NESC Clearance Charts both confirm ≈ 15.5 ft for road clearance. Hedge language in brief is appropriate. |
| P2 | Rule 235 safety zone: 40 in. at pole for < 8.7 kV | ikeGPS article | We-Energies JU standards | CONVERGED — 40-inch value confirmed by: (1) ikeGPS "Communication Worker Safety Zone" article explicitly citing Table 235-5; (2) North Central Electric NESC Communication Clearance Guide; (3) OJUA JIS Conditions Matrix citing Rule 235C1a and Table 235-5. Three independent secondaries converge. |
| P3/P4 | Rule 261 Section 26 exact factor matrix | Omitted in brief | Omitted in brief | CORRECT OMISSION — Section 26 factor matrix not cited; brief correctly marks as paywalled and omits specific multipliers. |
| P5 | Rule 250 Table 250-1 exact values | IAEI Magazine 2002 | ikeGPS NESC Weather Loadings | CONVERGED — IAEI Magazine 2002 and ikeGPS both confirmed; third source RUS 1724E-150 PDF also agrees. Three-source convergence makes this the strongest paywalled verification in the brief. |
| P6 | ANSI O5.1 fiber strength Class 1 ≈ 4,500 lb / Class 3 ≈ 3,000 lb | Utility installation guides | Pole manufacturer specs | HEDGED — ANSI O5.1-2022 is paywalled. Values are widely cited in utility line design manuals and are reasonable approximations. Brief appropriately instructs "confirm from ANSI O5.1-2022 Table 4." |
| P7 | BICSI OSPDR cross-references | Not directly cited | Not directly cited | CORRECT OMISSION — Brief does not cite specific BICSI OSPDR sections; uses NESC + RUS anchors instead. Appropriate handling for paywalled source. |
| P8 | ITU-T G.984.2 GPON Class B+ 28 dB | Multiple public vendor sources | APNIC blog (citing G.984.2) | CONVERGED — Value confirmed from multiple public secondaries. Well-established in the industry. |

---

## Independent Re-Research on Hallucination-Risk Flags

| # | Flag | Brief's mitigation | RT-A independent finding | Verdict |
|---|---|---|---|---|
| H1 | Loading district values (prior T03 brief transposed Heavy/Light ice) | Locked to 3 independent secondaries matching T03 brief `148e1e7` | Re-verified: Heavy=0.50 in / 4 psf / 0°F; Medium=0.25 in / 4 psf / 15°F; Light=no ice / 9 psf / 30°F. All confirmed from IAEI, ikeGPS, RUS 1724E-150. Values are correctly stated throughout T05 brief. | VERIFIED — no transposition in T05 |
| H2 | Rule 235 "40 inches" — unit confusion risk | Source-specific: "ikeGPS says 40 in. explicitly" | Confirmed: three secondary sources use "inches" explicitly. Unit is clear. No confusion with 40-ft pole height or 40-mph wind. | VERIFIED — unit unambiguous |
| H3 | OTMR timeline confusion (10 BD completeness vs. 15-day approval) | All verified from 47 CFR § 1.1411 eCFR | Confirmed from eCFR and law.cornell.edu: (a) completeness = 10 business days; (b) approval = 15 calendar days; (c) survey notice = 3 business days. Brief correctly distinguishes the two clocks. Module02 §2.8 conflation flagged in brief — confirmed as real authoring risk; author must clarify. | VERIFIED — brief correct; authoring flag justified |
| H4 | GPON 1:32 splitter loss (17 dB) — could drift to 15 or 18 dB | Derived from log₂(32) × 3.4 dB/doubling ≈ 17 dB | Confirmed: multiple sources give 17–17.5 dB for 1:32 PLC splitter. Brief's 17.0 dB is at the low end. Lesson prose should use "17–17.5 dB" range rather than "17 dB" as a single point value. See Finding #2. | MINOR FLAG — use range not point value |
| H5 | ANSI O5.1 Class 1 fiber strength species-dependent | "Approximately X lb; confirm from O5.1-2022 Table 4" | Brief correctly hedges and does not lock a species-specific value. Caveat language is appropriate. | VERIFIED — correctly hedged |
| H6 | ADSS EDS 16–25% of RTS — catalog value, varies by manufacturer | "Present as % of RTS, not fixed number" | Confirmed from multiple ADSS cable supplier sources (Hengtong, Zion, ABNewswire article). 16–25% EDS/RTS is consistent across manufacturers. Brief's presentation as a range is correct. | VERIFIED |
| H7 | Ice formula coefficient 1.244 vs 1.2435 | "Independently derived: 57π/144 = 1.2435" | RT-A derivation: 57 × π / 144 = 1.24355. Rounded to 1.244 for field use. Correct. Ice density = 57 lb/ft³ confirmed from NESC/IEEE IR538 and IAEI. | VERIFIED — coefficient correct |
| H8 | NESC Rule 250C 60-ft threshold | "Structures taller than 60 ft" cited from ikeGPS 2007 IAEI article | **DISCREPANCY FOUND.** Brief says "taller than 60 ft." ASCE discussion thread and IAEI 2002/2007 NESC articles state: "structures **60 feet or more** above the ground" — meaning ≥ 60 ft, not > 60 ft. A 60-ft pole IS in scope for 250C in extreme wind map zones. This is a precision error. See Finding #1. | FLAG — see Finding #1 |

---

## NESC Value Cross-Check

| Rule | Brief's value | RT-A verified value | Match? |
|---|---|---|---|
| Rule 232 — road clearance (comm cable) | ≈ 15.5 ft | ≈ 15.5 ft (Hi-Line 2023 + Connexus 2023) | YES |
| Rule 232 — pedestrian-only clearance | ≈ 9.5 ft | 9.5 ft (OJUA; ikeGPS Table 232-1 Row 9) | YES |
| Rule 235 — at-pole separation < 8.7 kV | 40 in | 40 in (3 independent secondaries) | YES |
| Rule 235 — midspan separation < 8.7 kV | 30 in | 30 in (North Central Electric; We-Energies) | YES |
| Rule 250 Heavy | 0.50 in ice / 4 psf / 0°F | 0.50 in / 4 psf / 0°F | YES |
| Rule 250 Medium | 0.25 in ice / 4 psf / 15°F | 0.25 in / 4 psf / 15°F | YES |
| Rule 250 Light | 0 in ice / 9 psf / 30°F | 0 in / 9 psf / 30°F | YES |
| Rule 250C Extreme Wind threshold | "taller than 60 ft" | ≥ 60 ft (structures **60 ft or more**) | MINOR DISCREPANCY — see Finding #1 |
| Rule 261 Grade B triggers | Rail; limited-access highway; navigable waterways | Rail; limited-access highway; navigable waterways | YES |
| Ice formula coefficient | 1.244 | 1.2435 → rounded to 1.244 | YES |
| ADSS EDS range | 16–25% of RTS | 16–25% of RTS | YES |
| GPON splitter 1:32 loss | 17 dB | 17–17.5 dB typical | MINOR — use range |
| GPON Class B+ budget | 28 dB | 28 dB | YES |
| Sag formula | wL²/8H | wL²/8H | YES |
| OTMR completeness clock | 10 business days | 10 business days | YES |
| OTMR approval clock | 15 calendar days | 15 calendar days | YES |

---

## DAG Cross-Check

| T05 lesson | T03/T04 dependency | Status at HEAD |
|---|---|---|
| T05.L05 (pole loading) | T03.L04 (messenger weight; ADSS weight introduced) | ✓ T03.L04 `messenger-lashed-vs-adss.jsx` is authored and in HEAD |
| T05.L05 (pole loading) | T03.L09 (ADSS loading basics) | ✓ T03.L09 `adss-span-wind-ice-loading.jsx` is authored and in HEAD |
| T05.L10 (ADSS design) | T03.L09 (ADSS span/wind/ice — REQUIRED per brief) | ✓ CONFIRMED — T03.L09 is authored and in HEAD. Dispatch of T05.L10 is unblocked. |
| T05.L13 (make-ready design) | T04.L05 (pole audit); T04.L08 (handoff to design) — annotate as T04-dependent | ⌛ T04 authoring NOT yet dispatched. Authors of L13/L14 must either re-introduce T04 terms OR wait. Brief correctly flags this. |
| T05.L14 (aerial design QA) | T04 (design inputs) — annotate as T04-dependent | ⌛ Same as L13 — T04 not yet authored. Same resolution required. |
| T05.L12 (PON aerial topology) | T02.L06 (link budget — required) | ✓ T02.L06 `link-budget-worked-example.jsx` is authored and in HEAD |
| T05.L01 (NESC orientation) | T01.L09 (OSP Standards Landscape) | ✓ T01.L09 `osp-standards-landscape.jsx` in HEAD |
| T05.L01 (NESC orientation) | T01.L02 (Parts of a Pole) | ✓ T01.L02 `parts-of-a-pole.jsx` in HEAD |
| T03 "PARTIALLY AVAILABLE" warning in brief | Brief was written before T03 L10–L12 landed | ✓ ALL 12 T03 lessons are now in HEAD. T03 is fully available. Brief's "PARTIAL" warning is now superseded — no T05 lesson is blocked by T03. |
| T01 all 10 lessons | Brief states "AVAILABLE" | ✓ Confirmed — 10 lessons in HEAD (L01–L10) |
| T02 all 12 lessons | Brief states "AVAILABLE" | ✓ Confirmed — 12 lessons in HEAD (L01–L12) |

**DAG summary update for authors:** T03 is NOW fully authored (12/12). The brief's "PARTIAL — confirm T03.L09 before T05.L10" warning is resolved. T04 remains unstarted — T05.L13 and T05.L14 authors must re-introduce T04 vocabulary within those lessons rather than assuming T04 knowledge.

---

## Findings (severity-ranked)

### FINDING #1 — LOW — Rule 250C threshold precision error (L06 author note)

**Location:** T05 brief, L06 section, Hallucination-Risk Register entry H8, and Quiz question seed Q3 ("structures taller than 60 ft").

**Issue:** Brief states the Extreme Wind overlay (Rule 250C) applies to "structures taller than 60 ft." Independently verified sources (ASCE.org, IAEI 2002/2007 NESC articles) state the threshold is **structures 60 ft or more (≥ 60 ft)**. A pole that is exactly 60 ft above ground IS subject to Rule 250C/250D requirements in extreme wind map zones. "Taller than 60 ft" (>60 ft) incorrectly excludes exactly 60-ft structures.

**Fix required (pre-authoring):** Change all references from "taller than 60 ft" to "60 ft or more" or "≥ 60 ft." Affects the L06 brief section, H8 register entry, and Quiz Q3 answer rationale. The quiz answer ("B") and its scenario description are correct — just the explanatory language needs the threshold correction.

**Severity:** LOW — does not affect the primary Light/Medium/Heavy values for L06 worked examples; affects only the 250C threshold explanation in one of three quiz seeds.

---

### FINDING #2 — LOW — GPON 1:32 splitter loss stated as point value (L12)

**Location:** T05 brief, L12 citation table row 4, and L12 worked example (splitter loss = 17.0 dB).

**Issue:** Brief cites splitter loss as 17.0 dB (single point value). Independently verified sources confirm the real range for 1:32 PLC splitters is **17–17.5 dB** (fibermall.com, bativ.com, APNIC blog). The 17.0 dB value is at the optimistic (low-loss) end of the real range.

**Consequence:** The worked example uses 17.0 dB, which produces a margin of 7.59 dB. If the actual splitter is 17.5 dB, the real margin would be 7.09 dB — still healthy (> 3 dB design minimum). The pass/fail conclusion does not change.

**Fix recommended (author guidance):** L12 worked example should note "splitter insertion loss typically 17–17.5 dB; this example uses 17.0 dB" to give learners an honest range. Brief's derivation note (log₂(32) × 3.4 dB) is mathematically sound as a pedagogical explanation but real PLC splitter losses are empirically measured at 17–17.5 dB.

**Severity:** LOW — no numerical error in the worked example outcome; minor precision improvement for instructional accuracy.

---

### FINDING #3 — INFO — T03 "PARTIAL" warning is now superseded

**Location:** T05 brief, DAG Position section.

**Issue:** Brief was written before T03.L10–L12 landed and includes advisory language: "T03 is PARTIALLY AVAILABLE." At HEAD, T03 now has all 12 lessons authored.

**Action:** Author dispatch prompts for T05 should note T03 is fully available. No vocabulary gaps from T03. The advisory warning in the brief is informational-only and does not reflect current repo state.

**Severity:** INFO only — no citation or content error.

---

## Summary

**Verdict: YELLOW**

- **53 citations verified** (52 clean VERIFIED, 1 minor precision flag on 250C threshold)
- **2 findings requiring author attention** before/during authoring dispatch:
  1. Rule 250C threshold: change "taller than 60 ft" to "≥ 60 ft" in L06 notes and quiz rationale
  2. GPON 1:32 splitter: expand point value 17.0 dB to "17–17.5 dB" range in L12 lesson prose
- **All math independently re-derived and confirmed correct** — sag formula, ice load formula, ADSS worked example, link budget, quiz answers
- **All OTMR timelines confirmed** via public eCFR text (10 BD completeness / 15 CD approval / 3 BD survey notice)
- **DAG update**: T03 is now fully authored (12/12); T04 remains unstarted — L13/L14 authors must introduce T04 terms inline
- **Paywalled claims** all appropriately hedged or verified via ≥ 2 independent secondary sources as required by the allowlist protocol

YELLOW (not RED) because both findings are LOW severity and the content scaffold is structurally sound. Authors can proceed with the two precision fixes applied as authoring-time patches.

=== T05 RT-A CITATION VERIFICATION END ===
