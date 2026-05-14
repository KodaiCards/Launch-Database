# OSP Topic 4 — Codes & Standards: Brief Framing A (Standards + Regulatory Citation Matrix)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Discovery / Brief — READ-ONLY (lesson files untouched)
**Framing:** Standards + regulatory citation matrix — anchor every lesson in citable primary sources before content is authored.
**Brief word cap:** 1500 words

---

## §1 Topic 4 Official Scope

**BICSI alignment:** BICSI OSP Design Reference Manual (OSP-DRD), Domain 2 — "Codes, Standards, and Regulations." Domain 2 covers the normative references that govern OSP design and construction: NESC, NEC, ANSI/TIA series, IEC fiber standards, OSHA, RUS/USDA bulletins, and the federal/state/local permitting framework. The DISCOVERY.md correctly places Topic 4 here.

**RUS 1751F-630 alignment:** RUS Bulletin 1751F-630 (Telecommunications Standards and Specifications for Materials and Construction, Aerial Plant) is the primary regulatory anchor for RUS-funded OSP. The bulletin explicitly cites NESC, NEC, and ANSI/TIA-758-C as governing standards for the physical plant (§2.1 General Requirements), and requires compliance with applicable state and local codes (§2.2). Every Topic 4 lesson that covers a standard touched by RUS work should lead with the RUS framing before the BICSI/ANSI/TIA secondary treatment — consistent with the RUS-primary framing locked in Batch A of Topics 2 and 3.

**Curriculum positioning:** Topic 4 is the standards backbone for the entire curriculum. Topics 3 (Route Design) and 5 (Hardware) repeatedly cite NESC, TIA-758-C, and OSHA — Topics 4 students encounter these as the authoritative sources for rules they already met in earlier topics. Framing the lessons as "the law behind the rule" (not "here is a new rule") anchors prior knowledge.

---

## §2 Lesson Outline Proposal

The DISCOVERY.md 15-lesson, ~4.75 hr outline is sound and covers the required standard families. Refinements below reflect the standards-framing perspective:

| # | Lesson Title | Duration | Key Refinement |
|---|---|---|---|
| 4.1 | NESC Overview: Purpose, Editions, Structure, and Applicability | 20 min | Add IEEE Std 5 designation; clarify state adoption vs. utility applicability trigger |
| 4.2 | NESC Part 2 — Overhead Lines: Clearances and Loading Districts | 25 min | Add Rules 230–231 (applicability scope) before clearance tables; worked midspan calc |
| 4.3 | NESC Part 3 — Underground Lines: Cover, Conduit, and Separation | 20 min | Cross-reference ANSI/TIA-758-C §6.1 for conduit specs co-located with NESC Rule 354 |
| 4.4 | NESC Part 4 — Work Rules: Code-Citation Level | 20 min | Framed as "which rule number governs which hazard class" — safety practice depth deferred to Topic 9 |
| 4.5 | NEC Article 770 — Optical Fiber Cables In-Building | 25 min | OFN/OFR/OFC cable type hierarchy; firestop requirements at penetrations; Article 770.113 listing requirements |
| 4.6 | NEC Article 800 + Chapter 8 — Communications Wiring | 20 min | Article 800.93 protector grounding; Chapter 8 independence from Chapters 1–7; 800.100 bonding |
| 4.7 | NEC Article 250 — Grounding and Bonding Code Basis | 20 min | 250.94 Intersystem Bonding Termination (IBT); cross-reference only — Topic 6 covers installation practice |
| 4.8 | ANSI/TIA-758-C — Customer-Owned OSP Cabling Standard | 25 min | Primary standard for campus/building-campus OSP; §3 definitions, §6 pathway, §9 acceptance |
| 4.9 | ANSI/TIA-568.3-D — Optical Fiber Components and Performance | 25 min | IL/RL maximums Table 5; connector types; channel vs. permanent-link model for OSP |
| 4.10 | TIA-598-D Color Codes + TIA-606-C Labeling Standard | 20 min | 12- and 24-fiber sequences; binder groups; TIA-606-C OSP identifier hierarchy |
| 4.11 | ANSI/TIA-526 Testing Series — Tier 1 vs. Tier 2 | 25 min | 526-14-B (SM OLTS); 526-7 (MM OLTS + OTDR appendix); acceptance test selection criteria |
| 4.12 | IEC Fiber Standards: 60794, 61300, 61753, 60529 | 25 min | P/O/G-class under 61753; IP rating derivation from 60529; reference table vs. TIA-568.3-D |
| 4.13 | OSHA 1910 / 1926 — Code References Overview | 20 min | 1910 vs. 1926 applicability trigger (general industry vs. construction); Subpart S, Subpart K, 1910.146 |
| 4.14 | RUS / USDA Bulletins: 1751F-630, 1751F-635, 1715E-110, Form 219 | 25 min | Applicability: USDA-financed projects; which bulletin controls which plant type; Form 219 approval chain |
| 4.15 | DOT, Railroad, and USACE Permit Code References | 20 min | 23 CFR Part 645; AAR clearances; USACE 33 CFR 320–332; NWP 12 conditions |

**Total estimated duration: ~4.75 hrs** (unchanged from DISCOVERY.md)

---

## §3 Citation Source Matrix — Per-Lesson Required Citations

| Lesson | Primary Standard | Supporting Standard(s) | RUS Bulletin | Notes |
|---|---|---|---|---|
| 4.1 | NESC C2-2023 (IEEE Std 5-2023), §1 Purpose, Rules 010–019 | BICSI OSP-DRD Ch. 2.1 | 1751F-630 §2.1 (general requirements reference to NESC) | State adoption status varies; AHJ may adopt earlier edition |
| 4.2 | NESC Rules 230–238, Tables 232-1, 234-1; Rules 250–252 (loading) | BICSI OSP-DRD Ch. 2.2, 6.3 | 1751F-630 §4 (ROW and clearance requirements) | Loading districts: Light/Medium/Heavy/Extreme Wind (Rule 250) |
| 4.3 | NESC Rules 320–355, Rule 354 (cover depth table) | ANSI/TIA-758-C §6.1, §6.3; NEC Ch. 9 | 1751F-635 §3 | TIA-758-C §6.3 is stricter than NESC Rule 354 for telecom conduit |
| 4.4 | NESC Rules 400–499 (Work Rules); Rules 420–424 (approach distances) | BICSI OSP-DRD Ch. 2.4 | 1751F-630 §2.2 (safety code compliance) | Full safety practice in Topic 9 |
| 4.5 | NEC Art. 770 (NFPA 70-2023); 770.113 (cable listing); 770.24 (firestop) | BICSI OSP-DRD Ch. 2.5 | — | Cable type table: OFN/OFNR/OFNP/OFC/OFCR/OFCP |
| 4.6 | NEC Art. 800; 800.93 (protector grounding); 800.100 (bonding); NEC Ch. 8 | BICSI OSP-DRD Ch. 2.5 | — | Ch. 8 is independent of Chs. 1–7 per Art. 800.3 |
| 4.7 | NEC Art. 250; 250.94 (IBT); 250.52 (electrode system) | BICSI OSP-DRD Ch. 3.1 | 1751F-630 §6.3 (grounding of aerial cable) | Topic 6 covers installation depth |
| 4.8 | ANSI/TIA-758-C (2019): §3 (definitions), §6 (pathway), §7 (splice), §9 (acceptance) | BICSI OSP-DRD Ch. 2.6; NESC Rule 354 | 1751F-630 (references TIA-758-C throughout) | TIA-758-C is the authoritative standard for customer-owned OSP |
| 4.9 | ANSI/TIA-568.3-D (2021): §5 (cable), §6 (connectors), Table 5 (IL/RL) | BICSI OSP-DRD Ch. 2.6 | 1751F-630 §3 (fiber performance requirements) | Supersedes 568-C.3; SM IL ≤ 0.75 dB/connector, RL ≥ 26 dB UPC |
| 4.10 | ANSI/TIA-598-D (2019): §4 (color coding); TIA-606-C (2020): §6 (OSP IDs) | BICSI OSP-DRD Ch. 10.2 | 1751F-630 §9 (drawing and labeling requirements) | 12-fiber: blue-orange-green-brown-slate-white-red-black-yellow-violet-rose-aqua |
| 4.11 | ANSI/TIA-526-14-B (SM OLTS); TIA-526-7 (MM OLTS + OTDR appendix) | BICSI OSP-DRD Ch. 9.1; IEC 61300-3-4 | 1751F-630 §9 (acceptance test requirements) | Tier 1 = OLTS only; Tier 2 = OTDR + OLTS; selection per project spec |
| 4.12 | IEC 60794-1-2 (cable construction); IEC 61300-3-4 (attenuation by OTDR); IEC 61753-1 (performance categories); IEC 60529 (IP ratings) | ANSI/TIA-568.3-D; BICSI OSP-DRD Ch. 2.7 | — | P-class (premises), O-class (OSP), G-class (harsh) per IEC 61753 |
| 4.13 | 29 CFR 1910 (General Industry): Subpart S (Electrical), §1910.146 (Confined Space); 29 CFR 1926 (Construction): Subpart K (Electrical), Subpart V (Power Transmission) | BICSI OSP-DRD Ch. 2.8 | 1751F-630 §2.2 (OSHA compliance reference) | Applicability trigger: 1910 = general industry; 1926 = construction activity |
| 4.14 | RUS Bulletin 1751F-630 (aerial); 1751F-635 (underground); 1715E-110 (design guide); RUS Form 219 | BICSI OSP-DRD Ch. 2.9; ANSI/TIA-758-C | All listed | Applies only to USDA-financed telecom projects; Form 219 = material approval |
| 4.15 | 23 CFR Part 645 (utility relocations, federal-aid highways); USACE 33 CFR Parts 320–332 (Section 404/408); AAR Engineering Standards (clearances) | BICSI OSP-DRD Ch. 2.10; ANSI/TIA-758-C §6.1 | 1751F-630 §7, §10 (crossing and permit requirements) | NWP 12 covers most OSP utility crossings; 0.1-acre fill limit; regional suspension caveat applies |

---

## §4 Worked-Example / Quiz Scenarios — Per Lesson

**4.2 NESC Part 2 (Clearances):** A communications cable spans 175 ft between poles in an NESC Medium loading district. Attachment height is 28 ft. Published sag at Maximum Loading = 4.2 ft. Midspan height = 28 − 4.2 = 23.8 ft. NESC Table 232-1 requires 15.5 ft minimum above a public road. Margin = 8.3 ft. Derivation: NESC Rule 232, Table 232-1, row "Communications conductors / roads."

**4.3 NESC Part 3 (Cover depth):** Telecom conduit crosses a public road. NESC Rule 354, Table 354-1 requires 24 in. under roads in conduit. ANSI/TIA-758-C §6.3 requires 36 in. under improved roads. Controlling requirement is TIA-758-C (stricter). RUS 1751F-635 §3 is consistent with TIA-758-C. Quiz question: which standard controls — NESC Rule 354 or TIA-758-C §6.3?

**4.8 ANSI/TIA-758-C (Conduit fill):** A 4-in. Schedule 40 PVC conduit (inner diameter 4.026 in., cross-sectional area 12.73 in²). Cable OD = 0.63 in., area = 0.312 in². Maximum 40% fill per NEC Chapter 9 = 5.09 in². Number of cables = floor(5.09 / 0.312) = 16 cables. Derivation: NEC Ch. 9 Table 1 (40% fill for >2 conductors); TIA-758-C §6.1 references NEC Ch. 9.

**4.9 ANSI/TIA-568.3-D (Connector IL/RL):** SM UPC connector spec: IL ≤ 0.75 dB; RL ≥ 26 dB. SM APC connector spec: IL ≤ 0.75 dB; RL ≥ 60 dB. Quiz scenario: a GPON OLT requires RL ≥ 32 dB at the OLT port — which connector polish type is required? Answer: APC (RL ≥ 60 dB). Derivation: TIA-568.3-D Table 5.

**4.11 TIA-526 Test Tier Selection:** A new 48-fiber SM OSP backbone, RUS-funded, 12 km route between two COs. Project specification requires BICSI OSP-DRD compliance. Required test tier: Tier 2 (OTDR + OLTS per TIA-526-14-B bidirectional). Derivation: BICSI OSP-DRD Ch. 9.1 states Tier 2 required for OSP backbone acceptance; TIA-526-14-B §5 (procedure for SM OLTS); TIA-526-7 OTDR appendix for SM OTDR measurement.

**4.14 RUS Bulletin Applicability:** A rural cooperative is building a 48-count SM aerial fiber route using USDA RUS loan funds. Which bulletin controls materials specification? Answer: RUS 1751F-630 (aerial plant). If the same project includes a conduit segment, also 1751F-635 (underground plant). Form 219 required for material/contractor approval before procurement. Derivation: 1751F-630 §1 (scope); 1751F-635 §1 (scope).

**4.15 USACE NWP 12 Applicability:** A direct-bore crossing of a navigable creek, disturbing 0.05 acres of wetland fill. NWP 12 applies (utility line activities; fill < 0.1-acre limit; not suspended in this district). Required: pre-construction notification (PCN) to district engineer. State 401 Water Quality Certification required concurrently. Derivation: USACE NWP 12 General Condition 31 (PCN triggers); 33 CFR 330.5 (NWP conditions).

---

## §5 Final Exam Shape

**Question count:** 25 questions (consistent with Topics 2 and 3)
**Pass threshold:** 18/25 correct (70%)
**Format:** Identical to Topics 1–3: A–D options, `[CORRECT]` inline, `*Rationale:*` block with per-option citation sub-bullets, randomized from lesson-number-ordered question bank.

| Lesson | Q Count | Rationale |
|---|---|---|
| 4.1 NESC Overview | 1 | Applicability framing only — recall |
| 4.2 NESC Part 2 Clearances | 2 | Includes 1 worked clearance calculation |
| 4.3 NESC Part 3 Underground | 2 | Includes 1 standard-selection scenario |
| 4.4 NESC Part 4 Work Rules | 1 | Rule-to-hazard mapping — recall |
| 4.5 NEC Art. 770 | 2 | Cable type hierarchy + firestop |
| 4.6 NEC Art. 800 + Ch. 8 | 2 | Protector grounding + Ch. 8 independence |
| 4.7 NEC Art. 250 | 1 | IBT location — recall |
| 4.8 TIA-758-C | 2 | Includes conduit fill scenario |
| 4.9 TIA-568.3-D | 2 | IL/RL spec selection scenario |
| 4.10 TIA-598-D + TIA-606 | 2 | Color sequence + identifier structure |
| 4.11 TIA-526 Testing | 2 | Tier selection scenario |
| 4.12 IEC Standards | 2 | IP rating derivation + performance class |
| 4.13 OSHA 1910/1926 | 1 | Applicability trigger — recall |
| 4.14 RUS Bulletins | 2 | Bulletin selection + Form 219 chain |
| 4.15 DOT/Railroad/USACE | 1 | NWP 12 applicability scenario |
| **Total** | **25** | |

**Question type split:** ~60% recall/recognition (standard number → rule scope), ~40% applied scenario (given project conditions, select controlling standard or derive a value). 5–6 scenario-type questions.

**Citation distribution:** Every question cites the exact standard section in its rationale block. RUS bulletin citations appear in Q4.14 and wherever they impose a stricter requirement than ANSI/TIA (e.g., Q4.3 cover depth).

---

## §6 Open Questions for Red Team / Orchestrator

**Q1 — NESC applicability scope for non-utility OSP (highest-priority):** The NESC strictly applies to utilities and utility-affiliated work in public rights-of-way. The office's primary work is customer-owned OSP under TIA-758-C jurisdiction (campus, building-campus, enterprise). Lessons 4.1–4.4 should clarify whether NESC rules are binding on the office's typical project types or serve as "minimum reference floor" that AHJs and joint-use pole agreements invoke. If framed incorrectly, students may over-apply NESC to customer-owned plant or under-apply it to joint-use pole work. The brief should specify: NESC is mandatory when the route shares utility poles (joint-use agreement triggers it) or traverses utility ROW; TIA-758-C governs customer-owned plant in private easements. This distinction is missing from the DISCOVERY.md lesson scope summaries for L4.1–4.4.

**Q2 — IEC 61753 P/O/G-class vs. TIA-568.3-D performance tables (medium-priority):** IEC 61753-1 classifies connectors into P-class (premises), O-class (OSP), and G-class (harsh environment). ANSI/TIA-568.3-D uses insertion loss / return loss tables. These two frameworks are not directly equivalent — a connector can be IEC O-class and not meet TIA-568.3-D IL requirements for a specific channel configuration, or vice versa. Lesson 4.12 (IEC Standards) and Lesson 4.9 (TIA-568.3-D) risk creating a false equivalence if not carefully cross-referenced. The red team should verify whether the brief instructs authors to map the two frameworks explicitly rather than treating them as interchangeable.

**Q3 — TIA-526-14-B vs. TIA-526-14-C edition currency (lower-priority but citation-critical):** DISCOVERY.md cites "TIA-526-14-B" for SM OLTS testing. TIA issued TIA-526-14-C in late 2023 (pending confirmation of exact publication date). If the "-C" edition is current, authoring lessons against "-14-B" creates citation drift. The red team should confirm the current edition of TIA-526-14 before Lesson 4.11 is authored, and cross-check against the same citation used in Topic 2 Lesson 2.11 to ensure internal consistency across the curriculum.

---

=== T4 BRIEF FRAMING A END ===
