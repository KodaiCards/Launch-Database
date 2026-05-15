# OSP-RW Curriculum Scoping — Research Agent A — Domain Coverage

## Stack snapshot (≤120 words)

Surveyed 12 existing JSX modules (`osp-training/src/modules/Module01-12_*.jsx`),
RUS 1751F-* bulletin index (USDA Rural Development), 2023 NESC overview
(IEEE/ATIS), BICSI OSP Designer 2025 blueprint, FOA CFOS-O KSAs, USACE NWP 12
2026 reissuance, FCC OTMR rule (47 CFR 1.1411), OSHA 1910.268
(Telecommunications), and several real OSP engineering firm scope statements
(Datafield, Katapult, Osmose, Cyient, Richesin, Eagle EAC). Cross-referenced
community-college fiber programs (SOWELA, MCC, KCTCS) and DoD UFGS 33 82 00.
Carter's named topics — design, staking, make-ready, physics, splicing,
inspection — are six of an estimated 18-topic complete curriculum. Three of
those six are NOT standalone topics in the existing 12 modules: dedicated
**Staking**, **Make-Ready**, and **Inspection** topics are missing or buried.

---

## Section 1: Proposed complete topic list

The numbering below is the recommended teaching sequence (see Section 2 for the
prerequisite graph that justifies it). Each topic targets 8–15 lessons per
Carter's "extreme depth" directive. Topics flagged **GENERAL** are core
field-crew curriculum; topics flagged **CERT-PREP** belong to the Certification
Prep splash section per CLAUDE.md §2.

| #  | Topic                                          | Scope (2 sentences)                                                                                                                                                                                                  | Est. lessons | Primary standards anchor                                                                       |
| -- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| 1  | **Fundamentals & Vocabulary** (NEW)            | A pre-requisite primer that defines the OSP universe: what OSP vs. ISP means, the parts of a pole, the parts of a cable, what a splice case looks like inside, the lifecycle from survey to as-built.                | 8–10         | RUS 1751F-630 §1; FOA CFOT KSAs                                                                |
| 2  | **Fiber Physics**                              | Why light travels in glass, attenuation, dispersion, macrobend/microbend, decibels, link budgets, the wavelength windows used in OSP.                                                                                | 10–12        | ITU-T G.652/657; FOA Reference                                                                 |
| 3  | **Cable Selection & Materials** (NEW)          | Loose-tube vs. ribbon vs. rollable-ribbon, OSP-rated jackets, armor types, messenger options, RUS-listed materials, fiber count selection, pulling tension and bend-radius specs that drive product choice.          | 10–12        | RUS 1753F-201 (Acceptance Listing); ICEA S-87-640; TIA-598-D                                   |
| 4  | **Route Survey & Pre-Engineering** (NEW)       | Site walks, drone/LiDAR capture, GIS landbase creation, pole audits, existing-utility identification, route alternatives analysis, the deliverables that hand off to design.                                         | 8–10         | None primary; industry practice (Datafield, Katapult, Osmose); 47 CFR 32 (record-keeping)      |
| 5  | **OSP Design — Aerial**                        | NESC clearances, pole loading, grades of construction, sag/tension, loading districts, joint-use rules, attachment-height calculations, ice/wind loading.                                                            | 12–15        | NESC C2-2023 §§23, 25, 26; RUS 1751F-630                                                       |
| 6  | **OSP Design — Underground**                   | Conduit/duct selection, burial-depth rules, manhole/handhole/vault sizing, HDD vs. trenching vs. plowing decision matrix, route alignment, separation from foreign utilities.                                        | 10–12        | RUS 1751F-635, 1751F-643; NESC §32, §35                                                        |
| 7  | **Staking** (NEW — split out of design)        | Walking the design on the ground: stake placement, call-out conventions, photographing/coding pole tags, marking proposed attachment points, capturing field measurements that feed back into make-ready packets.    | 8–10         | RUS Form 740; industry practice (Osmose, Katapult)                                             |
| 8  | **Make-Ready & Pole Attachment** (NEW topic)   | OTMR vs. multi-party, the 15-day FCC clock, simple-vs-complex determinations, transfer/reframe/replacement, reading a make-ready estimate, paying attachment fees, the as-built loop back to the pole owner.         | 10–12        | 47 CFR 1.1411 (OTMR); FCC 18-111; NESC §23                                                     |
| 9  | **Permitting & Environmental**                 | Permitting layer cake (federal/state/county/municipal), NEPA CE C-8, Section 106 NHPA/SHPO/THPO, ESA & IPaC, USACE NWP 12, state DOT encroachment, ROW/easement basics.                                              | 10–12        | NEPA; 36 CFR 800; USACE NWP 12 (2026 reissue); state DOT manuals                               |
| 10 | **OSP Construction**                           | Call-811, HDD/trench/plow execution, conduit fill and pull tension, slack loops, manhole/handhole installation, restoration of pavement and sod, daily field reporting.                                              | 10–12        | RUS 1751F-635, 1751F-643; CGA Best Practices v19                                               |
| 11 | **Splicing**                                   | Fusion vs. mechanical, core vs. cladding alignment, ribbon/mass splicing, splice-loss budgets, splice-case types and gel-sealing, prep tools, cleave quality, splicer maintenance.                                   | 12–15        | TIA-455 (FOTPs); ITU-T L.400; FOA CFOS-S KSAs; RUS 1753F-401                                   |
| 12 | **Testing — OLTS, OTDR, Inspection** (split from M08) | Tier-1 (OLTS) vs. Tier-2 (OTDR), pulse width selection, dead zones, launch/receive cables, bidirectional averaging, end-face inspection (IEC 61300-3-35), event tables, acceptance criteria.                  | 12–15        | TIA-568.3-D Annex; IEC 61280-4-2; IEC 61300-3-35; FOA CFOS-T                                   |
| 13 | **Inspection & Quality Assurance** (NEW topic) | Walking a constructed plant: visual inspection vs. instrument inspection, pole top inspection, attachment compliance, depth/cover verification, slack at pedestals, what triggers a punch-list vs. a kick-back.      | 8–10         | RUS Form 219; industry practice; ASME/AWS-style QA frameworks                                  |
| 14 | **Bonding, Grounding & Electrical Protection** | Why we ground, ground-resistance targets, MGN bonding, messenger bonding, NEC 250.52 electrodes, IBT/GES, surge protection, lightning protection, stray voltage detection.                                           | 10–12        | RUS 1751F-815; NESC §9 + §215; NEC Art. 250; IEEE 1100                                         |
| 15 | **Restoration & Outage Response** (NEW)        | Fault-locate workflow with OTDR, splice-trailer emergency response, civil-crew coordination, temporary vs. permanent repair, MOPs (Method of Procedure), customer-comm during outages.                               | 8–10         | FOA Restoration Guide; industry practice (Trace, Wired Comm, NFM)                              |
| 16 | **As-Built Documentation & GIS** (NEW)         | What an as-built actually is, splice matrix CSV schemas, GIS export formats (Esri SHP/GDB, KML), TIA-606-D administration classes, reconciling as-built to as-designed, RUS Form 219 close-out.                      | 8–10         | TIA-606-D; RUS Form 219; 47 CFR 32                                                             |
| 17 | **Project Estimation & Revenue**               | Cost data realities, aerial-vs-underground ratios, productivity modeling, contract types (lump-sum/T&M/GMP), change orders, contingency, CPHP/CPHC FTTH KPIs.                                                        | 8–10         | FBA/Cartesian cost reports; FCC 18-111 (cost-causation); industry KPIs                         |
| 18 | **Safety & OSHA**                              | OSHA 1910.268 (Telecom), 1910.269 (Power), 1910.146 (Confined Space — manholes), 1910.147 (LOTO), fall protection, MAD/MAB, PPE, PPG glove classes, hot-work, traffic control.                                       | 8–10         | OSHA 1910.268; 1910.146; 1910.147; ANSI Z89.2; MUTCD                                           |
| **CERT** | **Networking Blueprints (RCDD prep)**     | Inside-plant TIA-568/569/606/607/942 vocabulary at the level the RCDD exam tests. Stays in cert track.                                                                                                               | 8 (existing) | TIA-568/569/606/607; BICSI TDMM                                                                |
| **CERT** | **RCDD Core**                              | Firestopping, EMC, primary protectors, ICT distribution, design checklists for the RCDD blueprint.                                                                                                                   | 8 (existing) | UL 1479 / ASTM E814; FCC Part 15; BICSI TDMM                                                   |
| **CERT** | **Data Center Standards**                 | TIA-942 Rated 1–4, Uptime Tier I–IV, MPO/MTP, hot/cold aisle, ANSI/BICSI 002.                                                                                                                                        | 8 (existing) | TIA-942-C; Uptime Tier; BICSI 002-2024                                                         |
| **CERT** | **Certification Practice Exam Bank**      | RCDD / FOA CFOS / OSP Designer practice items + exam-strategy lessons.                                                                                                                                               | 8–15 + bank  | BICSI OSP/RCDD blueprints; FOA CFOS exam structures                                            |

**General-track total: 18 topics, ~170–215 lessons.**
**Cert-prep track: 4 topics, ~32–47 lessons** (mostly migrated from existing M05/M06/M10/M12 with structural adjustments).

---

## Section 2: Topic-level prerequisite graph

Carter's strict rule: nothing taught without prior context. Adjacency list
(`A → B` means B requires A taught first):

```
Topic 1 (Fundamentals)        → 2, 3, 4, 7, 18
Topic 2 (Fiber Physics)       → 3, 11, 12, 15
Topic 3 (Cable Selection)     → 5, 6, 10, 11
Topic 4 (Route Survey)        → 5, 6, 7, 9
Topic 5 (Aerial Design)       → 7, 8, 14, 17
Topic 6 (Underground Design)  → 7, 10, 14, 17
Topic 7 (Staking)             → 8, 10, 13
Topic 8 (Make-Ready)          → 10, 17
Topic 9 (Permitting)          → 10, 17
Topic 10 (Construction)       → 11, 13, 15, 16
Topic 11 (Splicing)           → 12, 15, 16
Topic 12 (Testing)            → 13, 15, 16
Topic 13 (Inspection/QA)      → 16
Topic 14 (Grounding/Elec.)    → 5, 6, 10, 13
Topic 15 (Restoration)        → 16
Topic 16 (As-Built/GIS)       → 17
Topic 17 (Estimation)         → (terminal — pulls from everything)
Topic 18 (Safety/OSHA)        → spans every field-touching topic; teach early
```

**Critical sequencing notes:**

- **Topic 1 (Fundamentals) and Topic 18 (Safety) MUST come before any field-touching topic.** Currently neither exists as a standalone — Carter cannot have someone read Module 4 (Splicing) before Module 1 (Fiber Physics) and have a chance with the vocabulary, and Safety is presently scattered across module sidebars.
- **Topic 14 (Grounding) is a sneaky prerequisite.** The existing M02 OSP Design references bonded-messenger reduced separation (Rule 215D) without first teaching MGN/IBT/GES. Topic 14 should land before Topic 5 OR Topic 5's grounding-adjacent sections must defer to Topic 14 cross-refs.
- **Topic 4 (Route Survey) is currently invisible** in the existing 12 modules. Without it, learners jump straight from "what is OSP" to "design clearances," skipping the entire site-walk → landbase → route-alternatives chain that is 30%+ of an OSP engineer's week.
- **Topics 11 (Splicing) and 12 (Testing) have a tight cross-dependency.** Splicing creates the loss number; OTDR measures it. Teach Splicing first because the test exists to verify the splice; the splicer needs to understand what the OTDR will say before they execute.

---

## Section 3: Required vocabulary per topic (top 5–10 terms)

| Topic                       | Core terms / acronyms                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1 Fundamentals              | OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH                 |
| 2 Fiber Physics             | wavelength, attenuation (dB/km), dispersion, MFD, macrobend, microbend, dB, link budget, OSNR              |
| 3 Cable Selection           | loose-tube, ribbon, rollable ribbon, armor, dielectric, all-dielectric self-supporting (ADSS), G.652.D, G.657.A1, RUS-listed |
| 4 Route Survey              | landbase, LiDAR, RTK GNSS, photogrammetry, planimetric, KMZ, pole audit, attachment height, midspan ground clearance       |
| 5 Aerial Design             | NESC, Rule 232, Rule 250, loading district (Light/Medium/Heavy/Extreme Wind), grade of construction, sag-tension, joint use |
| 6 Underground Design        | HDD, open-cut, plowing, innerduct, microduct, manhole, handhole, vault, conduit fill (40% rule), pull tension              |
| 7 Staking                   | stake, station, P.I. (point of intersection), centerline, offset, RUS Form 740, pole tag, attachment call-out             |
| 8 Make-Ready                | OTMR, simple/complex, transfer, reframe, replacement, attachment fee, application, as-built notice         |
| 9 Permitting                | NEPA, CE C-8, NHPA §106, SHPO/THPO, ESA, IPaC, NWP 12, ROW, easement, encroachment permit                  |
| 10 Construction             | Call-811, locate ticket, daylight, sleeve, slack loop, restore, daily field report                          |
| 11 Splicing                 | fusion, mechanical, core align, cladding align, MFD mismatch, cleave angle, splice case, gel seal, fan-out  |
| 12 Testing                  | OLTS, OTDR, IL, RL, dead zone (EDZ/ADZ), launch cable, bidirectional average, end-face (IEC 61300-3-35)    |
| 13 Inspection/QA            | punch list, kick-back, pole-top inspection, depth verification, slack inventory, RUS Form 219               |
| 14 Grounding/Electrical     | MGN, IBT, GES, bond, ground rod, ground resistance, NEC 250.52, surge, primary protector, MAD/MAB         |
| 15 Restoration              | fault locate, splice trailer, MOP, RPO/RTO (telecom variant), temporary patch, permanent splice            |
| 16 As-Built/GIS             | as-designed, as-built, splice matrix, .SHP/.GDB, .KML, TIA-606-D class 1–4, RUS Form 219                   |
| 17 Estimation               | CPHP, CPHC, FTTH, lump-sum, T&M, GMP, contingency, change order, escalation                                 |
| 18 Safety/OSHA              | LOTO, confined space, MAD/MAB, PPG class (00/0/1/2/3/4), Z89.2 hard hat, MUTCD                              |

---

## Section 4: Existing-module coverage analysis

| New topic                              | Existing module(s)                                | Coverage % | Gaps                                                                                          | Stale content                                     |
| -------------------------------------- | -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1 Fundamentals                         | scattered intros; M01 §1.1                         | ~10%       | No standalone primer; cable-anatomy, pole-anatomy, lifecycle never taught explicitly           | None                                              |
| 2 Fiber Physics                        | **M01 (8 sections)**                               | ~80%       | Needs more worked link-budget variations, dispersion-limited spans, polarization-mode dispersion | Mostly current                                    |
| 3 Cable Selection                      | M01 §1.4 (bend) only                               | ~5%        | Material selection, RUS acceptance, jacket/armor decision matrix, ICEA S-87-640 absent         | None                                              |
| 4 Route Survey                         | none                                               | ~0%        | Entire topic missing — drone/LiDAR/landbase/pole audit                                         | None                                              |
| 5 Aerial Design                        | **M02 (9 sections)**                               | ~75%       | Sag-tension calc walkthrough, ice/wind worked example, grade-of-construction matrix needs depth | M02 §2.6/2.7 conflate aerial-vs-underground; should split |
| 6 Underground Design                   | M02 §2.6 partial; M09 partial                      | ~30%       | No standalone — currently fused into M02 + M09                                                 | M09 mixes design and execution                    |
| 7 Staking                              | none                                               | ~0%        | Entire topic missing                                                                          | None                                              |
| 8 Make-Ready                           | M03 §3.7; M11 §11.3                                | ~25%       | OTMR step-by-step missing, simple-vs-complex determination missing, FCC 47 CFR 1.1411 not cited | None                                              |
| 9 Permitting                           | **M03 (8 sections)**                               | ~85%       | NWP 12 2026 reissue update; state DOT specifics                                                | NWP 12 references may pre-date 2026 final rule    |
| 10 Construction                        | **M09 (8 sections)**                               | ~70%       | Daily field reporting, restoration of pavement, traffic control                                | None                                              |
| 11 Splicing                            | **M04 (8 sections)**                               | ~75%       | Closure types catalog, gel-seal vs. heat-shrink, splicer-maintenance schedule                  | None                                              |
| 12 Testing                             | **M08 (8 sections)**                               | ~70%       | End-face inspection IEC 61300-3-35 thin; PMD/CD measurement absent                             | None                                              |
| 13 Inspection/QA                       | scattered (M03 §3.7, M09 §9.7)                     | ~10%       | No dedicated topic; punch-list workflow, RUS Form 219, kick-back triggers absent              | None                                              |
| 14 Grounding/Electrical                | M02 §2.3 (separation); M06 §6.5/6.6 (ICT-side)     | ~25%       | OSP-side grounding (RUS 1751F-815, MGN bonding) absent — M06 covers ICT/TIA-607 only          | M06 is RCDD/ICT-flavored, not OSP-applicable      |
| 15 Restoration                         | none                                               | ~0%        | Entire topic missing                                                                          | None                                              |
| 16 As-Built/GIS                        | M07 (matrix); M09 §9.7 partial                     | ~35%       | TIA-606-D classes thin, GIS export formats absent, RUS Form 219 not present                   | M07 conflates topology and as-built/admin         |
| 17 Estimation                          | **M11 (8 sections)**                               | ~85%       | CPHP/CPHC formula derivations could deepen; otherwise current                                  | None                                              |
| 18 Safety/OSHA                         | scattered sidebars (M02, M09)                      | ~5%        | No dedicated topic; 1910.268, 1910.146 (confined space — manholes), 1910.147 LOTO absent      | None                                              |
| CERT: Networking Blueprints            | **M05**                                            | 100%       | Keep as-is; restructure into per-lesson files                                                  | M05 §5.7 standards quick-ref needs annual refresh |
| CERT: RCDD Core                        | **M06**                                            | 100%       | Keep as-is; surge-protector section could deepen                                              | None                                              |
| CERT: Data Center                      | **M10**                                            | 100%       | Keep as-is; M10 §10.7 forthcoming-standards needs annual refresh                              | None                                              |
| CERT: Practice Exam Bank               | **M12**                                            | 100%       | Bank is 68 questions; deepen to 150+ for full RCDD-equivalent simulation                       | None                                              |

---

## Section 5: Topics to ADD that existing 12 modules don't cover

1. **Topic 1 — Fundamentals & Vocabulary.** Carter's audience profile (field-experienced, no engineering training) demands a primer that explicitly defines OSP terminology before any technical content. Without it, every downstream lesson re-defines the same terms or assumes them.
2. **Topic 3 — Cable Selection & Materials.** Real OSP designers spend significant time selecting between G.652.D vs. G.657.A1, loose-tube vs. ribbon, ADSS vs. messenger-supported, 144-ct vs. 288-ct vs. 432-ct. The existing M01 only mentions bend loss; no module teaches the selection decision.
3. **Topic 4 — Route Survey & Pre-Engineering.** This is 30%+ of the OSP engineering workflow (per Datafield, Katapult, Cyient scope statements) and is entirely missing. Drone/LiDAR/GIS landbase creation is now the industry default for greenfield routes and Carter's crew will encounter it on every PSC RUS build.
4. **Topic 7 — Staking.** Carter named this explicitly. It is a discrete field workflow distinct from design and from inspection. Stakers walk the design with field tools, mark proposed attachments, photograph pole tags, and feed data back to the make-ready packet.
5. **Topic 8 — Make-Ready & Pole Attachment.** Currently mentioned in M03 §3.7 and M11 §11.3 but never taught as a process. The FCC OTMR rule (47 CFR 1.1411), simple-vs-complex determinations, and the make-ready packet workflow deserve a dedicated topic — this is half the schedule risk on every aerial build.
6. **Topic 13 — Inspection & QA.** Carter named this. Distinct from staking (pre-build) and construction (build): inspection happens post-build, walks the constructed plant against the as-designed, generates punch lists, drives kick-backs to contractors. Currently scattered.
7. **Topic 14 — Bonding, Grounding & Electrical Protection (OSP-side).** M06 covers ICT/TIA-607 (inside plant). The OSP-side grounding curriculum — RUS 1751F-815, MGN bonding, NESC §9 grounds-per-mile, surge protectors at the demarc — is missing.
8. **Topic 15 — Restoration & Outage Response.** Real OSP firms run 24/7 splice-trailer programs (Wired Comm, Trace, NFM, SOBO). Workflow distinct from construction-time splicing.
9. **Topic 16 — As-Built Documentation & GIS.** M07 covers the splice matrix as a topology tool; M09 §9.7 mentions as-built reconciliation in passing. Neither teaches the deliverable: TIA-606-D class system, GIS export formats, RUS Form 219 close-out.
10. **Topic 18 — Safety & OSHA.** Currently scattered through sidebars. Confined-space entry into manholes (1910.146), LOTO (1910.147), telecom-specific 1910.268, MAD/MAB approach distances — these are life-safety topics that need a dedicated home, not call-outs.

---

## Section 6: Topics in existing modules that don't deserve standalone topic status

- **M07 (Fiber Topology & Matrix) — partially overlapping with new Topic 16 (As-Built/GIS).** Recommend folding M07 §7.1–7.4 (topology canvas, splice matrix, fiber pathing, color codes) into Topic 16, keeping M07 §7.5–7.7 (industry tools, hygiene, interactive canvas) as Topic 16's interactive-element heavy lessons. M07 standalone is too narrow for a 12-topic field-crew curriculum.
- **M05/M06 (Networking Blueprints + RCDD Core) — keep but move to Cert-Prep splash.** These teach inside-plant content for the RCDD exam, not OSP field work. Per CLAUDE.md §2 Architecture v2 split, they belong in Certification Prep (Advanced), not General Learning.
- **M10 (Data Center) — keep but move to Cert-Prep splash.** Same reasoning. PSC RUS rural projects don't typically build Tier-IV data centers; this is RCDD/exam content.
- **M12 (Certification Sim) — keep, expand to 8–15 lessons, move to Cert-Prep splash.** Currently 5 sections + 68-Q bank. Per CLAUDE.md §2, this is the cert-prep practice-exam surface and gets 3–10 net-new lessons authored during OSP-RW.5.

Nothing in the existing 12 should be deleted outright — every shipped section has citation work and field framing that will be salvaged. Reorganization is the move, not deletion.

---

## Section 7: Estimated totals

- **Total general topics:** 18 (current existing standalone: ~6; net-new or restructured: 12)
- **Total general lessons:** ~170–215 (range reflects per-topic 8–15 sweet spot)
- **Cert-prep topics:** 4 (M05, M06, M10, M12 — restructured into per-lesson files)
- **Cert-prep lessons:** ~32–47 (roughly 8–12 per topic, with M12 expanded to 8–15)
- **Grand total lessons (general + cert):** ~200–260

**Topic ordering proposal (numbered, satisfies prerequisite DAG):**

1. Fundamentals & Vocabulary
2. Safety & OSHA *(taught early so every later field-touching lesson can reference it)*
3. Fiber Physics
4. Cable Selection & Materials
5. Route Survey & Pre-Engineering
6. Permitting & Environmental
7. OSP Design — Aerial *(grounding cross-refs to Topic 14)*
8. OSP Design — Underground
9. Bonding, Grounding & Electrical Protection
10. Staking
11. Make-Ready & Pole Attachment
12. OSP Construction
13. Splicing
14. Testing — OLTS, OTDR, Inspection
15. Inspection & QA
16. Restoration & Outage Response
17. As-Built Documentation & GIS
18. Project Estimation & Revenue *(terminal — pulls from everything)*

(Topic 18-Safety in original Section 1 list is renumbered to position 2 here for early-teaching reasons. Topic 2 in original list — Fiber Physics — moves to position 3. The Section-1 numbering is a stable identifier; this list is the teaching sequence.)

---

## Source references (mandatory)

- **RUS bulletins** — USDA Rural Development bulletin index ([rd.usda.gov/resources/regulations/bulletins](https://www.rd.usda.gov/resources/regulations/bulletins)). Verified bulletins: 1751F-630 (Aerial Plant Design), 1751F-635 (Construction with filled cables), 1751F-643 (Innerduct), 1751F-815 (Bonding/Grounding), 1751F-801 (Electrical Protection introduction). RUS 1738 = Electric Borrowers Program (NOT distance learning — confirmed via T4 RT B in CLAUDE.md §4).
- **NESC** — IEEE C2-2023, [IEEE-SA overview](https://standards.ieee.org/beyond-standards/what-you-need-to-know-about-the-2023-national-electrical-safety-code/). Sections referenced: §9 (Grounding), §215C/D (Bonding rules), §232 (Vertical clearance), §250 (Loading districts), §32, §35 (Underground).
- **BICSI** — [OSP Designer credential](https://www.bicsi.org/education-certification/certification/osp), 2025 blueprint update with 30% FTTP/FTTH design weight. TDMM 15th Edition referenced in M05/M06.
- **FOA** — [CFOS-O KSAs](https://foa.org/KSAs.html); [CFOS Specialist Certifications](https://www.thefoa.org/adv-cert.htm); [FOA Reference for Fiber Optics](https://www.thefoa.org/tech/ref/basic/design.html).
- **TIA standards** — TIA-758-C (Customer-owned OSP), TIA-568.3-D (Optical fiber cabling components), TIA-598-D (Fiber identification), TIA-606-D (Administration), TIA-607-D (Bonding/grounding ICT), TIA-942-C (Data centers), TIA-455 (FOTPs).
- **FCC OTMR** — [47 CFR 1.1411](https://www.law.cornell.edu/cfr/text/47/1.1411); FCC 18-111 Third Report and Declaratory Ruling.
- **USACE NWP 12** — [2026 reissuance final rule](https://esassoc.com/news-and-ideas/2026/03/usace-2026-nationwide-permits-final-rule-revisions-and-what-they-mean-for-project-sponsors/), Federal Register published 1/8/2026.
- **OSHA** — [1910.268 Telecommunications](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.268); 1910.269 (Power); 1910.146 (Confined Space — manholes); 1910.147 (LOTO); 1926 Subpart V (Construction).
- **DoD UFGS** — [33 82 00 Telecommunications Outside Plant](https://www.wbdg.org/FFC/DOD/UFGS/UFGS%2033%2082%2000.pdf) (USACE/NAVFAC/AFCEC unified guide spec).
- **Industry firm scope statements** — [Datafield USA](https://datafieldusa.com/osp-engineering/); [Katapult Engineering](https://www.katapultengineering.com/blog/innovative-osp-technology); [Osmose Make-Ready](https://www.osmose.com/make-ready-survey-design); [Cyient OSP](https://www.cyient.com/blog/building-fiber-at-scale-turning-osp-engineering-into-a-strategic-advantage); [Richesin OSP 2025](https://richesinengineering.com/blog/high-performance-osp-network-design-2025/); [Eagle EAC](https://eagle-eac.com/industries/telecom/).
- **Restoration practice** — [NCTI Emergency Restoration](https://ncti.com/emergency-restoration-fiber-optics/); [Light Brigade FTTx Restoration](https://www.lightbrigade.com/post/emergency-fttx-restoration-best-practices); [Trace Fiber Services](https://trace-fs.com/civil-crews-and-fiber-splicers-respond-to-osp-damages/); [NFM Consulting Emergency Repair](https://nfmconsulting.com/knowledge/emergency-fiber-repair/).
- **Community-college programs surveyed** — SOWELA (LA), Metropolitan CC (NE), Somerset CC / KCTCS (KY), SUNY Westchester, Bossier Parish CC, Jackson State CC. All anchor on FOA CFOT → CFOS-O / CFOS-S / CFOS-T tracks, none teach the design / staking / make-ready / inspection topics that an OSP engineering firm needs — confirms the gap.
- **Existing modules** — `osp-training/src/modules/Module01-12_*.jsx` in `kodaicards/Launch-Database` repo, HEAD `eb18688`.

=== RESEARCH AGENT A REPORT END ===
