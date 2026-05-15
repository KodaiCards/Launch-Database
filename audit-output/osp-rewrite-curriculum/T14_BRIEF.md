# T14 (Bonding, Grounding & Electrical Protection) — Research Brief

**Status:** Ready for author dispatch  
**Research agent:** T14-Research (single agent, re-baseline after reverted rogue agent)  
**Date:** 2026-05-16  
**Word count:** ~2,400  

---

## Section 1: Topic Scope (locked per ARCH.md §2 row 9)

**T14 title per ARCH.md = "Bonding, Grounding & Electrical Protection"**

**Category:** General learning (18 general topics, position 9 of 18 in teaching order)

**Scope:** Why OSP plant must be bonded and grounded; bonding vs. grounding definitions; the regulatory framework (NEC Art. 250, NESC §9 + Rules 92–99, IEEE 1100, RUS 1751F-815 / fallback chain); pole-ground assemblies and MGN bonding; aerial closure and messenger grounding; underground pedestal and cabinet grounding; building-entry primary protectors and IBT; co-located equipment bonding; lightning protection (surge arresters, ground rings, protection coordination); stray-voltage detection and LOTO-based de-energization; ground resistance testing (IEEE 81 fall-of-potential); and RUS 1751F-815 bonding schedule documentation.

**Teaching prerequisites (per DAG):** T01 (Fundamentals), T02 (Fiber Physics — introduces fiber cable metallic components and sheath/messenger anatomy), T05 (Aerial Design — introduces messenger strand, NESC clearance zones), T06 (Underground Design — introduces pedestal/vault hardware), T18 (Safety/OSHA — introduces LOTO/lockout-tagout, hierarchy of controls, PPE)

**Topics that depend on T14:** T13 (Inspection & QA — grounding inspection, bond-continuity check, ground-resistance acceptance)

**Teaching order note:** T14 falls at position 9 of 18 in the general curriculum. It immediately follows T06 (Underground Design) because pedestal/vault grounding is a direct continuation of the underground-design hardware introduced there. It precedes T07 (Staking) and T08 (Make-Ready) because stakers and make-ready crews work near bonded plant and need grounding fundamentals before touching existing cable hardware.

**Estimated lessons:** 12 (per ARCH.md lesson table: T14.L01–T14.L12)  
**Estimated total duration:** ~290 minutes (20+25+25+25+20+30+25+25+20+25+20+30)

**Audience framing (field-experienced, no formal engineering training):** Your crew has bonded a messenger and installed a ground rod. This topic explains WHY those steps matter — what happens if you skip them, how to verify you've done it right, and what "good" looks like when an inspector shows up with a ground-resistance tester. Carter's L6.9-style guidance applies throughout: crew does NOT routinely work near energized high-voltage lines in the way a lineman does. Stray-voltage detection and de-energization sequencing (LOTO) are the priority — not MAD approach-distance tables or PPG rubber-glove-class math.

---

## Section 2: Lesson List with Interactivity Map

| Lesson ID | Title | Type | Key vocab introduced | Assumed vocab (prerequisite topics) | Learning objective | Est. time | Interactivity | Source |
|---|---|---|---|---|---|---|---|---|
| T14.L01 | Why We Ground — The Drain Analogy | foundation | grounding, bonding, fault current, equipotential, ground potential rise | OSP, fiber cable, messenger, pole, utility, NEC, NESC (from T01) | Learner explains why OSP metallic components accumulate charge and why equipotential bonding protects crew and equipment | 20 min | Quiz (MC); Flashcards | net-new |
| T14.L02 | MGN — Multi-Grounded Neutral | working | MGN, neutral wire, grounds per mile, neutral-to-ground bond | joint-use, distribution, strand (from T05); NESC from T01 | Learner describes how MGN reduces fault current exposure for communications equipment on shared poles; identifies the bonding point for a fiber messenger on an MGN system | 25 min | AnnotatedDiagram (MGN system cross-section: distribution primary + neutral + comm messenger + bond clamp + downlead + ground rod); Quiz (MC); Flashcards | net-new |
| T14.L03 | Messenger Bonding Rules | working | messenger bond, bond clamp, downlead, NESC Rule 96F, bonded-messenger separation, ADSS exemption | messenger strand, aerial cable (from T05) | Learner specifies the complete messenger bond assembly at a pole; explains the ADSS exemption (no metallic armor = no bonding requirement); applies NESC Rule 96F in a joint-use scenario | 25 min | WorkedExample (specify bond-clamp + downlead + ground rod for a joint-use pole with distribution transformer; verify separation distance for bonded messenger per T05 geometry); Quiz; Flashcards | net-new |
| T14.L04 | NEC 250.52 Electrodes | working | ground rod, concrete-encased electrode (Ufer), water pipe electrode, ring electrode, 4 AWG bare copper, 5/8-in. × 8-ft copper-clad rod, supplemental electrode | NEC, GES (from T01 + T06 introduction) | Learner identifies NEC 250.52(A) electrode types; selects the correct electrode for a given site; knows when a supplemental rod is required (NEC §250.56 — resistance > 25 Ω) | 25 min | Quiz (MC + drag-match: electrode type → NEC code designation + installation spec); Flashcards | net-new |
| T14.L05 | IBT and GES — What They Are | working | IBT (intersystem bonding termination), GES (grounding electrode system), PBB (primary bonding busbar), SBB (secondary bonding busbar), bonding conductor | building entry, NEC, NESC (from T01); TIA-607 forward-noted in T06 | Learner explains what the IBT is, where it lives at building entry, why multiple service types (power, cable, telephone) must bond to the same GES, and what the PBB/SBB hierarchy means for an FDH | 20 min | AnnotatedDiagram (building entry with IBT, GES, primary protector, duct seal labeled; click each component for function description); Quiz; Flashcards | net-new |
| T14.L06 | Ground Resistance Testing — IEEE 81 | working | fall-of-potential, current probe, potential probe, 62% rule, clamp-on method, soil resistivity | ground rod, supplemental rod, GES (from T14.L04–L05); IEEE 81 introduced here | Learner sets up the 3-pole fall-of-potential test per IEEE 81 §9.3; applies the 62% rule for probe placement; validates the test with the ±10% probe-movement check; interprets results against 25 Ω (NEC §250.56) and 5 Ω (GR-1275) acceptance thresholds | 30 min | WorkedExample (3-pole fall-of-potential setup: 5/8-in. × 8-ft rod, current probe at 5× rod-length = 40 ft, potential probe at 62% = 24.8 ft; substitution + result interpretation; sanity check: "measured 18 Ω — below 25 Ω, good for general OSP; not below 5 Ω FDH threshold — add supplemental rod"); AnnotatedDiagram (fall-of-potential setup diagram with probe positions labeled); Quiz; Flashcards | net-new |
| T14.L07 | Surge Arresters and Lightning Protection | working | surge arrester, primary protector, MOV (metal oxide varistor), gas-tube arrester, VPL (voltage protection level), ground ring | aerial-to-underground transition, pedestal (from T06); building entry (from T05 + T06) | Learner identifies the three arrester technologies (gas-tube, MOV, combination); selects placement (one per aerial-to-underground transition and every facility entry); explains the protection coordination chain: line-side arrester → equipment clamp → equipment immunity rating | 25 min | Quiz (MC + drag-match: arrester type → first-strike absorption vs. secondary clamping vs. combined); AnnotatedDiagram (protection coordination chain); Flashcards | M06 §6.6 (field side only) |
| T14.L08 | Stray Voltage Detection and Remediation | working | stray voltage, induced AC voltage, floating messenger, ground rod tester, LOTO sequence, de-energization | fault current, equipotential (from T14.L01); LOTO, 1910.147 (from T18) | Learner detects stray voltage on a messenger before splice work using a ground-rod tester (contact voltage test); executes the LOTO de-energization sequence before making contact; understands why floating metallic components accumulate voltage near distribution primaries even without direct contact | 25 min | BranchingScenario (stray voltage found on messenger pre-splice: branch 1 = install PPG and proceed; branch 2 = confirm de-energization via LOTO first, then test again → each branch shows consequence); Quiz; Flashcards | net-new |
| T14.L09 | Cathodic Protection Basics | working | cathodic protection, corrosion cell, anode, cathode, sacrificial anode, dielectric flange, union, isolation coupling | buried conduit, duct, pedestal (from T06); soil types (from T06.L05) | Learner explains why buried metallic conduit adjacent to gas or water mains creates a corrosion cell; identifies the dielectric flange/union as the isolation solution per NACE SP0169; knows when cathodic protection is required vs. optional on a typical RUS job | 20 min | Quiz (MC); Flashcards | net-new (T6 §L6.9 resolved per ARCH.md) |
| T14.L10 | RUS 1751F-815 Bonding and Grounding | advanced | 1751F-815, aerial plant bonding schedule, ground test log, RUS Form 219 (grounding section) | All prior T14 vocab; RUS 1751F-815 or fallback chain (per Section 5 below) | Learner applies the RUS-specific bonding schedule to an aerial plant segment (conductor sizing, ground-rod spacing, test interval); completes a RUS-format ground test log compatible with Form 219 close-out documentation | 25 min | Quiz (MC — RUS vs. NEC threshold comparison); WorkedExample (fill out a RUS ground test log: electrode ID, measured resistance, acceptance threshold, pass/fail, retest date); Flashcards | net-new |
| T14.L11 | NESC §9 Grounds-Per-Mile Requirement | advanced | grounds per mile, rural vs. urban rate, NESC Section 09, supplemental ground, grounding interval | MGN (from T14.L02); NESC (from T14.L01–L04) | Learner applies NESC Section 09 to determine the required number of ground electrodes per mile of aerial plant; designs a route grounding plan for a 5-mile RUS aerial segment | 20 min | WorkedExample (5-mile aerial route: NESC §9 minimum interval, calculate number of ground rods required; then apply RUS 1751F-815 stricter interval if applicable; show which number wins); Quiz; Flashcards | net-new |
| T14.L12 | T14 Capstone Quiz | capstone-quiz | — | All T14 vocabulary (T14.L01–L11) | Learner integrates T14 knowledge: given a route segment with aerial + underground + building-entry components, specify the complete grounding and bonding plan, interpret a ground-resistance test result, and identify the correct remediation if it fails | 30 min | Quiz (20Q MC + 1 WorkedExample verify); BranchingScenario (multi-point route with mixed plant; learner must specify grounding at pole, pedestal, and building entry, then interpret IEEE 81 results) | net-new |

---

## Section 3: Interactivity Recommendations (per Carter's 2026-05-15 directive + T02 template)

**Interactivity mix (all required primitives used):**

1. **Quiz (MC + drag-match)** — present in every lesson (not just L12). Examples:
   - L01: MC on fault current path — "where does fault current go if no ground rod is present?" (floats to nearest contact point = crew member)
   - L04: drag-match NEC 250.52(A) electrode types to their installation specs (5/8 in × 8 ft rod = A(5), Ufer ≥ 20 ft bare Cu = A(3), water pipe = A(1))
   - L07: MC on arrester placement — "you're bringing aerial cable underground at a handhole; where does the arrester go?" (aerial/exposed side, before the transition)

2. **AnnotatedDiagram** — three core systems with click-to-label + hover-explain:
   - L02: MGN pole cross-section — distribution primary, neutral, comm messenger, bond clamp, #6 AWG downlead, ground rod; click each component to see function + rule citation
   - L05: Building-entry IBT diagram — weatherhead, entrance conduit, primary protector (UL 497B), IBT, GES connection, duct seal; click to annotate each component
   - L06: Fall-of-potential probe layout — current probe, potential probe, 62% position, valid remote-earth zone; interactive slider on probe position shows resistance reading changing

3. **WorkedExample** — calculations with step-by-step algebra + sanity-check:
   - L03: Messenger bond + separation: given a 230-ft span with bonded messenger, calculate the reduced separation from distribution neutral using NESC Rule 96F geometry; sanity check "the reduction applies because the messenger is bonded to the neutral every X feet, keeping them at the same potential"
   - L06: Fall-of-potential (primary): current probe at 5× rod length = 40 ft; potential probe at 62% of 40 ft = 24.8 ft; measured R = 18 Ω; compare to 25 Ω (NEC, pass) and 5 Ω (GR-1275, fail → add supplemental rod)
   - L10: RUS ground test log: 3 electrodes along a 1-mile aerial segment; record measured resistance, compare to RUS 1751F-815 threshold, note pass/fail, schedule retest for any > threshold

4. **BranchingScenario** — multi-step decision trees with state persistence:
   - L08: Stray voltage on messenger at splice point. Branch 1: skip testing → contact cable → shock event (lesson: always test first). Branch 2: test contact voltage (shows 90 V AC) → initiate LOTO → re-test → 0 V → proceed. Branch 3: test → 90 V → apply PPG without LOTO confirmation → LOTO wasn't properly executed → incident (lesson: LOTO is the process, not PPG alone). Each branch shows realistic outcome + regulatory consequence (OSHA 1910.147 citation risk)
   - L12 capstone: mixed-plant route segment; learner must ground at pole (select downlead + rod), at pedestal (select rod + perimeter ring decision), and at building entry (specify primary protector + IBT + GES connection); then interpret IEEE 81 test result (one electrode at 28 Ω — above 25 Ω threshold → learner selects remediation: supplemental rod vs. bentonite vs. do-nothing) and reach acceptance

**Flashcards (mandatory per Carter's 2026-05-16 lock):**  
Every lesson with `key_terms` named export includes flashcards for ALL vocabulary introduced in that lesson. Definitions extracted verbatim from the lesson prose. Examples:
- L01: "grounding" → "The intentional connection of conductive OSP components to the earth through a grounding electrode, providing a low-impedance path for fault current so it flows into the ground instead of through crew or equipment."
- L01: "bonding" → "Electrically connecting conductive components (messenger, armor, closures, cabinets) so they are at the same potential; bonding prevents voltage differences between metallic components that could arc or shock when contact is made."
- L02: "MGN" → "Multi-Grounded Neutral — a distribution system design in which the neutral conductor is connected to earth at every pole (or at defined intervals per NESC §9), creating a continuous low-impedance return path for fault current."
- L04: "Ufer electrode" → "A concrete-encased electrode per NEC §250.52(A)(3): at least 20 feet of bare copper conductor (minimum #4 AWG) or ½-inch reinforcing rod embedded in concrete that is in contact with the earth; provides a high-surface-area ground electrode where driving rods is impractical."
- L06: "62% rule" → "The potential-probe placement rule in IEEE 81 fall-of-potential testing: the potential probe must be positioned at 62% of the distance between the electrode under test and the current probe to fall within the valid remote-earth zone where the ground resistance measurement is stable."

---

## Section 4: Capstone Quiz Scope (L12)

20Q MC + 1 WorkedExample + 1 BranchingScenario. Tiered difficulty (foundations 40%, working 50%, advanced 10%):

**Foundations tier (8 questions):**
- Define bonding vs. grounding (one-sentence distinction)
- Name the NEC 250.52(A) electrode for "rod ≥ 8 ft long, ≥ 5/8 in. diameter"
- Identify the NESC rule that requires messenger bonding at every splice closure
- Match arrester type to primary function (gas-tube = first-strike absorption; MOV = secondary clamping)
- Explain why ADSS cable does not require bonding (no metallic armor)
- State the NEC §250.56 single-rod resistance threshold (25 Ω)
- State the GR-1275 FDH/CO threshold (5 Ω)
- Describe what IBT stands for and where it belongs at building entry

**Working tier (10 questions):**
- Apply fall-of-potential probe placement (current probe at 5× rod length, potential probe at 62%)
- Calculate the required supplemental rod spacing given soil resistivity (rod spacing ≥ 1 rod length)
- Sequence the stray-voltage LOTO steps before touching a messenger (test → confirm LOTO → re-test → proceed)
- Select the correct arrester placement for an aerial-to-underground transition
- Identify the isolation component for buried metallic conduit adjacent to gas main (dielectric flange, NACE SP0169)
- Apply NESC §9 minimum grounding interval to an aerial route segment
- Specify the complete pole ground assembly (bond clamp + #6 AWG downlead + 5/8 × 8 ft rod)
- Interpret an IEEE 81 result: measured 22 Ω at an aerial pole — pass or fail vs. 25 Ω NEC? vs. 5 Ω GR-1275?
- Select remediation for a 32 Ω result at an FDH site (supplemental rod in parallel, minimum 1 rod-length spacing)
- Complete a RUS ground test log record for a failed electrode (record measured value, threshold, fail notation, retest due date)

**Advanced tier (2 questions):**
- Compare NEC §250.56 (25 Ω) vs. RUS 1751F-815 vs. GR-1275 (5 Ω) — when does each apply?
- Identify the grounding-authority boundary between NESC and NEC at a building entry (NESC governs plant up to and including the protector; NEC governs from protector inward)

**Integrative scenario (required):** Learner receives a 3-mile aerial route with one underground riser at mile 2 and a building-entry FDH at mile 3. Design the grounding plan: (1) pole-ground interval and assembly spec for the aerial segment; (2) arrester placement at the aerial-to-underground transition; (3) pedestal rod + perimeter ring decision at the riser; (4) primary protector + IBT spec at the building entry; (5) interpret the IEEE 81 results when one pole reads 28 Ω (fails 25 Ω → specify remediation) and the FDH reads 6 Ω (fails 5 Ω GR-1275 → specify remediation).

---

## Section 5: Citations (RUS, NESC, NEC, IEEE, OSHA)

**RUS 1751F-815 status:** The allowlist entry for RUS 1751F-815 includes the note "verify current state — may be incorporated into 810 or separate." Prior research briefs (T6 Framing A, Verifier B) flagged this as CRITICAL-UNRESOLVED — section numbers (§1–§8) were structurally inferred, not verified from an actual copy. RUS 1751F-810 (Electrical Protection of Communication Facilities) is on the allowlist as a confirmed discrete bulletin. **Fallback chain documented:** RUS 1751F-630 §7 (aerial plant grounding — confirmed in T04/T05 work) + RUS 1751F-635 §5 (underground plant grounding — confirmed in T05/T06 work). Author must verify 1751F-815's existence via USDA/RUS bulletin index before citing any section numbers. If the discrete bulletin exists, cite by section. If it has been incorporated into 1751F-810, cite 1751F-810 with the applicable section. If neither confirms, fall back to 1751F-630 §7 (aerial) and 1751F-635 §5 (underground) and mark all T14.L10 grounding-schedule claims as `[confirm 1751F-815 or 1751F-810 edition + section]`.

All citations below are from the allowlist with section/clause. Paywalled sources (NESC C2-2023, IEEE standards) follow allowlist rule #4 — marked `[confirm edition]`.

| Cited standard | Section/Clause | Claim | Status | Source type |
|---|---|---|---|---|
| NEC NFPA 70-2023 | Art. 100 | Definitions: bonding, grounding electrode system (GES), bonding jumper, equipment grounding conductor | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.2 | Definitions: ground, grounding | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.52(A)(1) | Water pipe electrode | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.52(A)(3) | Concrete-encased electrode (Ufer): ≥20 ft bare copper ≥4 AWG or ≥½-in. reinforcing rod | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.52(A)(4) | Ring electrode: buried bare copper conductor ≥20 ft | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.52(A)(5) | Rod and pipe electrode: ≥8 ft length, ≥5/8 in. diameter (copper-clad) | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.56 | Supplemental electrode required when single-rod resistance > 25 Ω; second rod must be installed; rod spacing ≥ one rod length | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.66 | Grounding electrode conductor sizing (referenced in downlead sizing discussions) | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | §250.94 | IBT (intersystem bonding termination) requirements at building entry | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | Art. 770 §770.93 | Metallic OSP cable components require listed primary protector bonded to building GES | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | Art. 770 §770.100 | GEC from protector bonds to same electrode as power service + all other service protectors | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NEC NFPA 70-2023 | Art. 800 §800.93, §800.100 | Communications cable primary protector bonding requirements (parallel to Art. 770) | ALLOWLIST PRIMARY | NEC NFPA 70 |
| NESC C2-2023 | Section 09 | Grounding methods for communication systems; grounds per mile; electrode specifications | ALLOWLIST PRIMARY (paywalled `[confirm edition]`) | NESC C2 |
| NESC C2-2023 | Rule 92 | Bonding of communication systems to supply system GES when co-located on poles | ALLOWLIST PRIMARY (paywalled) | NESC C2 |
| NESC C2-2023 | Rule 96 | Grounding conductor (downlead) protection: grade to 8 ft, minimum conductor size | ALLOWLIST PRIMARY (paywalled) | NESC C2 |
| NESC C2-2023 | Rule 96C | Minimum conductor size in high-fault-current environments | ALLOWLIST PRIMARY (paywalled) | NESC C2 |
| NESC C2-2023 | Rule 96F | Bonded-messenger MGN bonding requirement; messenger bonded at every splice closure | ALLOWLIST PRIMARY (paywalled) | NESC C2 |
| NESC C2-2023 | Rule 97 | Lightning protection — arrester placement and ground ring requirements | ALLOWLIST PRIMARY (paywalled) | NESC C2 |
| IEEE 81 | §9.3 | Three-pole fall-of-potential method; probe placement (current probe at 5× rod length, potential probe at 62%); ±10% validation | ALLOWLIST PRIMARY | IEEE 81 |
| IEEE 81 | §9.4 | Clamp-on method: valid only within multi-electrode GES; not for primary acceptance test on new single-rod installation | ALLOWLIST PRIMARY | IEEE 81 |
| IEEE Std 1100 | §1.2–1.3 | Single-point bonded grounding principle; all GES must bond to one common system | ALLOWLIST PRIMARY | IEEE 1100 |
| IEEE Std 1100 | §8.3 | Perimeter ground ring specification: buried bare #2 AWG Cu at 18–24 in. for large enclosures | ALLOWLIST PRIMARY | IEEE 1100 |
| IEEE Std 1100 | §8.4.2 | Pole ground assembly specifications | ALLOWLIST PRIMARY | IEEE 1100 |
| IEEE Std 1100 | §8.5 | Aerial-to-underground transition bonding and arrester placement | ALLOWLIST PRIMARY | IEEE 1100 |
| IEEE Std 1100 | §8.6 | Protection coordination chain for lightning/surge | ALLOWLIST PRIMARY | IEEE 1100 |
| TIA-607-D | §4 | TBD — bonding/grounding system architecture for customer-owned OSP (PBB/SBB hierarchy) | ALLOWLIST PRIMARY `[confirm edition]` | TIA-607-D |
| TIA-607-D | §5 | Bonding conductor sizing for customer-owned FDH | ALLOWLIST PRIMARY `[confirm edition]` | TIA-607-D |
| TIA-758-C | §7 | Customer-owned OSP bonding and grounding — messenger bonding, pedestal grounding, building entry | ALLOWLIST PRIMARY `[confirm edition]` | TIA-758-C |
| OSHA 29 CFR 1910.147 | Full | Lockout/tagout — the required procedure before contacting de-energized conductors | ALLOWLIST PRIMARY (public eCFR) | OSHA |
| OSHA 29 CFR 1910.333 | Full | Selection and use of work practices for electrical work (stray voltage scenario framing) | ALLOWLIST PRIMARY (public eCFR) | OSHA |
| OSHA 29 CFR 1910.268 | (a), (g) | Telecommunications field work standard — primary OSHA authority for OSP crews; referenced in stray-voltage framing | ALLOWLIST PRIMARY (public eCFR) | OSHA |
| NACE SP0169 | Full | Cathodic protection and isolation coupling (dielectric flange) for buried metallic conduit adjacent to foreign utilities | SECONDARY — cite with `[confirm current edition]`; NACE/AMPP now controls | Industry standard |
| RUS 1751F-630 | §7 | Aerial plant grounding — fallback anchor if 1751F-815 unconfirmed | ALLOWLIST PRIMARY | RUS Bulletin (public USDA PDF) |
| RUS 1751F-635 | §5 | Underground plant grounding — fallback anchor if 1751F-815 unconfirmed | ALLOWLIST PRIMARY | RUS Bulletin (public USDA PDF) |
| RUS 1751F-810 | Full | Electrical protection of communication facilities — confirmed discrete bulletin on allowlist | ALLOWLIST PRIMARY | RUS Bulletin |
| RUS 1751F-815 | §1–§8 | Bonding & grounding bulletin — verify discrete existence before citing any section numbers; fallback to 1751F-630 §7 + 1751F-635 §5 | AUTHORING-GUARD — see RUS 1751F-815 status above | RUS Bulletin (verify) |
| Telcordia GR-1275 | §5 | CO/FDH/central-office ground resistance acceptance threshold (5 Ω) | SECONDARY — widely cited by industry authors; mark `[confirm edition]` | Telcordia |

**Field-practice divergences to teach explicitly per Carter's rule:**
- **Book (NEC §250.56):** A single ground rod must achieve ≤25 Ω or be supplemented with a second rod. **Field:** RUS aerial crews typically drive one rod at every dead-end pole and treat 25 Ω as the floor — but at FDH sites they test to the 5 Ω GR-1275 threshold, which often requires two rods in bentonite or a perimeter ring. The gap: NEC only requires ≤25 Ω, but RUS-funded close-out documentation requires testing and logging every electrode to its appropriate threshold.
- **Book (NESC Rule 96F):** Messenger bonded to supply neutral at every splice closure. **Field:** In some joint-use agreements, the pole owner's book specifies bonding at every other pole or every 1,000 ft. Crews following the utility's joint-use pole agreement may use the less-frequent interval — but the NESC Rule is the floor; if the agreement is more permissive than NESC, NESC controls.
- **Book (LOTO per OSHA 1910.147):** Full lockout-tagout sequence required before contacting any conductor that could be energized. **Field:** Crews sometimes apply PPG (personnel protective grounding) as a shortcut without confirming the LOTO has been established upstream. L14.L08 teaches both procedures and makes clear that PPG supplements LOTO, it does not replace it — and that a LOTO with PPG applied is the required sequence, not PPG alone.

---

## Section 6: Author Guardrails (per agent-protocol.md + Carter voice rules)

**Vocabulary discipline:**
- T14 lessons may use all terms introduced in T01 (Fundamentals), T02 (Fiber Physics — cable anatomy, messenger, armor), T05 (Aerial Design — strand, clearance, NESC Rule 232), T06 (Underground Design — pedestal, vault, conduit, riser), T18 (Safety/OSHA — LOTO, hierarchy of controls, PPE, confined space).
- T14 introduces these net-new terms (all locked in lesson table): grounding, bonding, fault current, equipotential, ground potential rise, MGN, neutral wire, grounds per mile, neutral-to-ground bond, messenger bond, bond clamp, downlead, NESC Rule 96F, bonded-messenger separation, ADSS exemption, ground rod, Ufer electrode, water pipe electrode, ring electrode, 4 AWG bare copper, 5/8-in. × 8-ft copper-clad rod, supplemental electrode, IBT, GES, PBB, SBB, bonding conductor, fall-of-potential, current probe, potential probe, 62% rule, clamp-on method, soil resistivity, surge arrester, primary protector, MOV, gas-tube arrester, VPL, ground ring, stray voltage, induced AC voltage, floating messenger, LOTO sequence, de-energization, cathodic protection, corrosion cell, anode, cathode, sacrificial anode, dielectric flange, isolation coupling, aerial plant bonding schedule, ground test log, grounds per mile.
- **Forward-reference ban:** Do NOT assume terms from T07 (Staking), T08 (Make-Ready), T10 (Construction), T11 (Splicing), or T13 (Inspection) until those topics are explicitly in scope. A T14 lesson may forward-note "we'll apply this inspection standard in T13" but cannot teach T13 vocabulary without definition.
- Every acronym on first use: "MGN (multi-grounded neutral)", "IBT (intersystem bonding termination)", "GES (grounding electrode system)", "MOV (metal oxide varistor)", "LOTO (lockout-tagout)", "ADSS (all-dielectric self-supporting)", "PBB (primary bonding busbar)", "SBB (secondary bonding busbar)", "VPL (voltage protection level)".

**Carter's L6.9 reframe — applies to ALL T14 lessons:**
- Audience does NOT routinely work near energized high-voltage distribution primaries in the way utility linemen do.
- Drop PPG glove-class/MAD approach-distance math. That is lineman training, not OSP crew training.
- Keep: stray-voltage detection (contact voltage test with a ground-rod tester), LOTO de-energization sequencing (OSHA 1910.147), and the recognition that a floating messenger can accumulate hazardous voltage from inductive coupling — without any direct contact with energized lines.
- L08 (Stray Voltage) owns this content. The branching scenario demonstrates testing → LOTO → re-test → proceed. No rubber-glove voltage class tables. No MAD tables.

**Math discipline (per §1 pitch-revision rule + T02 template):**
- Every formula with step-by-step derivation. Example for L06 fall-of-potential:
  - Setup: "Your ground rod is 8 ft long. Current probe goes at 5 × 8 ft = 40 ft from the rod. Potential probe goes at 62% × 40 ft = 24.8 ft from the rod."
  - Test: "Move the potential probe ±10% (± 4 ft) — does the reading change more than 2%? If yes, remote earth is not established — move current probe farther out."
  - Result: "Reading = 18 Ω. Compare to 25 Ω (NEC §250.56): 18 < 25, pass for aerial pole. Compare to 5 Ω (GR-1275): 18 > 5, fail for FDH — add a supplemental rod in parallel, minimum 8 ft away."
  - Sanity check: "18 Ω is in the normal range for clay soil with a single 8-ft rod. Sandy or gravelly soil may read 50–200 Ω before remediation — that's why soil resistivity matters."
- Worked example for L11 grounds-per-mile: "NESC §9 requires one ground at intervals not exceeding [confirm from NESC C2-2023 §9]. On a 5-mile segment, minimum required electrodes = 5 miles × X grounds/mile = Y. If RUS 1751F-815 specifies a stricter interval, use whichever is more frequent." Author must look up the NESC §9 interval from the paywalled standard using the allowlist paywalled-source rule (2 independent sources) before writing the worked number.

**No AI references:** Content reads as if a senior OSP engineer wrote it. No "this was generated," no AI meta-signals. Red team flags this.

**Facts only, no guesses:** If RUS 1751F-815 section numbers cannot be independently verified, mark as `[confirm 1751F-815 §X or fallback to 1751F-630 §7]`. Do NOT invent section numbers for paywalled bulletins. Better to teach the rule (verified) than to cite a section number (fabricated).

---

## Section 7: Capstone Quiz Acceptance Criteria

Red team verifies:
1. All 20+ MC questions have a single [CORRECT] answer independently derivable from lesson worked examples and cited standards.
2. All distractors are plausible misderivations (e.g., "confused 62% rule probe position with 50%", "applied NEC 25 Ω threshold to FDH site that requires 5 Ω GR-1275", "used clamp-on method for primary acceptance test where IEEE 81 §9.4 says it's invalid").
3. The ground-resistance WorkedExample in L12 matches the exact calculation sequence taught in L06 — same probe-spacing formula, same comparison structure, same threshold hierarchy (NEC vs. GR-1275 vs. RUS).
4. The branching scenario consequences are realistic: if learner picks "skip LOTO and apply PPG only," the consequence is factually correct (PPG without upstream de-energization confirmation leaves crew exposed to fault current — OSHA 1910.147 is violated).
5. No quiz question requires knowledge of T07, T08, T10, T11, or T13 vocabulary that hasn't been defined in T14 lessons.

---

## Section 8: Lesson Authoring Priority Stack

Per ARCH.md §1 (Option C source-of-truth), authors follow this priority:
1. **JSX source (existing modules)** — Module06_RCDDCore.jsx §6.5–6.6 (grounding/bonding/TIA-607 — customer-premises side; field content limited but good pitch-register reference), Module05_NetworkingBlueprints.jsx §5.6 (TIA-607 PBB/SBB/TBB — inside-plant application; migrate IBT/GES concept to OSP context), Module02_OSPDesign.jsx §2.1 (mentions bonded-messenger reduced separation — source content for L03)
2. **Net-new authoring** — the bulk of T14. No prior module owns OSP-side grounding with the depth needed. Aerial bonding, pole-ground assembly, IEEE 81 fall-of-potential, stray-voltage detection, cathodic protection, and the RUS-specific bonding schedule are all net-new.
3. **Prior framing brief (read-only, as source content)** — `audit-output/wave-osp-topic6/BRIEF_FRAMING_A.md` contains a detailed lesson-level outline for what was then called "T6 Grounding." That framing was NOT applied to the wrong topic (the reverted rogue agent applied it at the wrong path). Its content is valid source material for T14 authoring — particularly the per-lesson learning objectives, citation source matrix (§3), and worked-example anchors (§4). Author READS this framing brief as source; does NOT re-use any SHAs or fabricated provenance.

T14 source map:
- L01: net-new (foundation definitions)
- L02: net-new (MGN system; NESC §9 + Rule 96F introduction)
- L03: net-new + M02 §2.1 (bonded-messenger separation source)
- L04: net-new (NEC 250.52 electrode types)
- L05: M05 §5.6 + M06 §6.5 (IBT/GES/PBB/SBB — repitch from inside-plant to OSP context)
- L06: net-new (IEEE 81 fall-of-potential)
- L07: M06 §6.6 field-side content (arrester placement) + net-new expansion
- L08: net-new (stray voltage + LOTO; T18 vocab assumed)
- L09: net-new (cathodic protection; NACE SP0169)
- L10: net-new (RUS 1751F-815 bonding schedule and test log)
- L11: net-new (NESC §9 grounds-per-mile with worked route example)
- L12: net-new (capstone)

---

## Section 9: Known Research Constraints + Paywalled Sources

**Paywalled sources used (per allowlist rule #4):**
- NESC C2-2023 Section 09 and Rules 92, 96, 96C, 96F, 97 — grounding and bonding rules for communication systems. If author cannot access directly, fallback: cite NESC rules via RUS 1751F-630 §7 (which summarizes relevant NESC requirements for aerial RUS plant in plain English) and RUS 1751F-635 §5 (underground equivalent). Mark lessons as `[confirm current NESC C2-2023 Rule XX]`.
- IEEE 81, IEEE Std 1100 — ground resistance testing and grounding practice. Both are paywalled. Per allowlist paywalled-source rule: minimum 2 research agents from DIFFERENT trusted-secondary sources for convergence. FOA Reference Guide (foa.org, public) discusses ground resistance testing; RUS bulletins summarize IEEE 81 procedure for field use. Convergence from FOA + RUS = verified. Mark as `[confirm IEEE 81 §9.3 probe-placement formula if your org has access]`.
- TIA-607-D, TIA-758-C — customer-owned OSP bonding/grounding. Paywalled. Secondary path: Module05/Module06 JSX source (already verified against secondary sources in prior RT work) and BICSI OSPDR chapter 8 summaries (public-secondary level). Mark as `[confirm edition]`.
- RUS 1751F-815 — verify discrete existence (see above). Public USDA RD site may have a bulletin index. If found, it is public (all RUS 1751F-series bulletins are public USDA PDFs). If not found as discrete, use fallback chain.

**Telcordia GR-1275:** Not on the allowlist as a primary source. Author cites the 5 Ω threshold with `[confirm Telcordia GR-1275 §5 — secondary source; widely cited in OSP grounding literature but paywalled; verify against current edition]`. Do NOT state 5 Ω as a regulatory mandate — it is an industry guideline for CO/FDH equipment grounding.

**Proposed addition to allowlist (flagged for orchestrator):**
- **NACE SP0169** (now AMPP SP0169-2013) — Control of External Corrosion on Underground or Submerged Metallic Piping Systems. Controls cathodic protection and isolation (dielectric flange/union) requirements. Referenced in T14.L09. Not currently on the allowlist — orchestrator should add to the allowlist before author dispatch so RT can verify the citation.

---

## Section 10: Lesson Author Checklists (Template per T02)

Every author must verify:
- [ ] All vocabulary in Section 2 lesson table covered in lesson body (definitions in lesson prose; flashcard definitions match verbatim)
- [ ] Every formula derivation complete (step-by-step, no "obviously" or "by inspection")
- [ ] Worked examples use real numbers + sanity-check sentence after calculation
- [ ] RUS 1751F-815 existence confirmed before citing section numbers; fallback chain cited if not found
- [ ] NESC Rule citations verified via RUS fallback secondary source if paywalled copy unavailable
- [ ] Carter's L6.9 reframe applied throughout — no MAD tables, no PPG glove-class tables
- [ ] Stray-voltage lesson (L08) teaches LOTO as required, PPG as supplement — not interchangeable
- [ ] Book-vs-field divergences explicitly taught (NEC 25 Ω vs. GR-1275 5 Ω; LOTO vs. PPG-alone; NESC Rule 96F vs. joint-use-book intervals)
- [ ] Flashcards present for every `key_terms` item (definition verbatim from lesson prose)
- [ ] No AI-meta language, no vendor names (Corning, OFS, Panduit) unless directly relevant to product specification
- [ ] All quiz [CORRECT] answers independently derivable from lesson worked examples and cited standards
- [ ] Citation section numbers exist in the referenced standard (spot-check 2–3 per author; mark `[confirm edition]` for paywalled standards not directly accessed)
- [ ] Prerequisite-invariant check: every term used assumes only T01 + T02 + T05 + T06 + T18 vocabulary; no T07/T08/T10/T11/T13 terms used without immediate definition

---

=== T14 BRIEF END ===
