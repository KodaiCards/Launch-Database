# OSP Topic 6 — Bonding & Grounding: Discovery

> Aligned to BICSI OSP-DRD Domain 8. Follows Topics 2–3 format.
> Estimated 4–5 hrs. Safety-critical content — zero-error bar on factual claims.

---

## 10-Lesson Outline

| # | Lesson Title | Est. Duration | Best Interactive Types |
|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | 25 min | Flashcards (NEC Art. 100 terms), multiple-choice |
| 6.2 | Regulatory Framework: NEC Article 250, NESC §92–99, and IEEE 1100 | 25 min | Flashcards (code-scope vocabulary), drag-drop (match scenario to governing code body), multiple-choice |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | 30 min | Flashcards (hardware names, MGN terms), scenario (specify complete pole ground assembly for a joint-use pole), multiple-choice |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | 25 min | Flashcards (bond strap specs, arrestor rules), drag-drop (label closure grounding assembly), multiple-choice |
| 6.5 | Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | 25 min | Flashcards (rod specs, resistivity ranges), scenario (select grounding configuration given high-resistivity soil reading), multiple-choice |
| 6.6 | Building Entry Grounding: NEC Article 770, Primary Protectors, and Duct Seal Requirements | 25 min | Flashcards (NEC §770.93/770.100 rules), drag-drop (label building-entry assembly), multiple-choice |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Grounding, and Utility Ground Integration | 20 min | Flashcards (NESC 92 rules, FDH vocabulary), multiple-choice |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | 25 min | Flashcards (arrester types, VPL, keraunic level), scenario (place arresters + ground ring on a mixed aerial/UG schematic), multiple-choice |
| 6.9 | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | 25 min | Flashcards (induction terms, OSHA citations, PPG steps), scenario (correct pre-work sequence before handling messenger with 48 V stray on joint-use pole), multiple-choice |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | 30 min | Flashcards (test method terms, 62% rule, acceptance thresholds), scenario (validate 62% rule; accept or remediate against facility-class threshold), multiple-choice |

**Total estimated duration: ~4.5 hrs**

---

## Lesson Scope Detail

**6.1** Grounding = intentional earth connection for reference potential + fault-return path; bonding = connecting metallic parts to equalize potential and prevent arcing. Fiber carries no current but OSP messenger strand, armored sheath, and closure hardware accumulate charge from lightning induction, AC coupling, and static — without bonding/grounding that charge paths through equipment or installer. Covers NEC Art. 100 definitions (bonding, grounding, GES, EGC, bonding jumper) and the grounding electrode system as OSP bonding backbone. *NEC Art. 100; Art. 250 Pt. I; NESC Rule 012; BICSI OSP-DRD Ch. 8; IEEE 1100 §1.2.*

**6.2** NEC Article 250 governs on-premises wiring inward from the building entrance; NESC §92–99 governs utility-side infrastructure — joint-use poles, aerial messengers, underground conduit in ROW — with hand-off at the service entrance; IEEE 1100 (Emerald Book) is non-mandatory recommended practice bridging both for telecom scenarios. Lesson includes a code-lookup exercise matching described scenarios to the governing standard. *NEC Art. 250 Pts. I–II; NESC Rules 92–99; IEEE 1100 §1.3; BICSI OSP-DRD Ch. 8.1; ANSI/TIA-758-C §7.*

**6.3** Complete pole ground assembly: bond clamp at messenger, #6 AWG copper downlead protected from grade to 8 ft (NESC Rule 96), 5/8-in. × 8-ft copper-clad rod (NEC §250.52(A)(5)), supplemental rods where resistance exceeds target. MGN bonding (NESC Rule 96F): bonding the fiber messenger to the multi-grounded neutral equalizes potential with power conductors and eliminates arc-over risk at contact. Worked scenario: specify the complete ground assembly for a joint-use pole with a distribution transformer. *NESC Rules 92, 96, 96F; NEC §250.52, §250.66; BICSI OSP-DRD Ch. 8.2; IEEE 1100 §8.4.2; RUS 1715E-110 §4; PLP/Hubbell app notes.*

**6.4** Messenger bonded at every splice closure — not just terminal poles — to prevent charge buildup between poles (NESC Rule 96F). ADSS (all-dielectric) cable requires no armor bond; armored aerial cable requires armor bonded at each closure and each run end, bond strap rated for fault current. Lightning arrestors at every aerial-to-underground transition, installed on the aerial (exposed) side, grounded to local pole ground — never floating. *NESC Rule 96F; BICSI OSP-DRD Ch. 8.2; ANSI/TIA-758-C §7.2; IEEE 1100 §8.5; Hubbell/PLP app notes.*

**6.5** Minimum 5/8-in. × 8-ft copper-clad rod (NEC §250.52(A)(5)); supplemental rods in parallel if resistance > 25 Ω (NEC §250.56); rod spacing minimum one rod-length apart. Perimeter ground for large enclosures: buried bare #2 AWG copper ring (NEC §250.52(A)(4); IEEE 1100 §8.3). Soil resistivity governs achievable resistance — clay (~100 Ω·m) one rod; sandy soil bentonite or supplemental; rock/gravel requires Ufer or CHEMROD. Test-before-bury rule. *NEC §250.52, §250.56, §250.66; NESC Rule 92; IEEE 1100 §8.3; IEEE 81 §4; BICSI OSP-DRD Ch. 8.3; ANSI/TIA-758-C §7.3.*

**6.6** NEC §770.93: metallic OSP cable components entering a building require a listed primary protector (UL 497B) bonded to the building GES; NEC §770.100: GEC connects to the same electrode as power service and all other service protectors — equipotential bonding eliminates inter-system potential differences. Entrance conduit, weatherhead, duct seal required. Regulatory boundary: NESC governs the plant up to the protector; NEC governs from the protector inward. *NEC Art. 770 §770.93, §770.100; NEC §250.94; NESC Rule 230E; BICSI OSP-DRD Ch. 8.4; ANSI/TIA-758-C §7.4; UL 497B.*

**6.7** NESC Rule 92: all conductive parts of communication systems on or adjacent to electrical supply structures bond to the supply system's GES. Equipment in a CO bonds to the existing CO ground bus (Telcordia GR-1275) — not a separate independent electrode (parallel electrodes create inter-system potential). FDH housing on co-op structures bonds to the utility pole ground regardless of cable type inside. Conductor minimum #6 AWG (NESC Rule 96C); IEEE 1100 recommends #2 AWG in high-fault-current environments. *NESC Rules 92, 96; IEEE 1100 §8.3–8.4; Telcordia GR-1275 §4; BICSI OSP-DRD Ch. 8.5; ANSI/TIA-758-C §7.5.*

**6.8** Arrester types: gas-tube for first-strike absorption; MOV for secondary clamping; combination units for comprehensive coverage; VPL must match protected equipment's rated surge immunity. Placement: one arrester per aerial-to-underground transition and every facility entry; intervals ≤1 mile on exposed aerial in HKL zones (>60 thunderstorm-days/year). Ground ring: buried bare copper at 18–24 in. depth encircles facility, limits GPR during nearby strikes (IEEE 80). Protection coordination: line-side arrester → equipment clamp → equipment immunity must be a matched set. *IEEE 1100 §8.6; IEEE 80 §14; NESC Rule 97; BICSI OSP-DRD Ch. 8.6; ANSI/TIA-758-C §7.6; IEEE C62.41.2.*

**6.9** AC induction: parallel run between fiber metallic components and a power conductor creates transformer coupling; induced voltage on a floating messenger can reach hundreds of volts adjacent to distribution primaries. Intermittently bonded armor means touching an un-bonded section exposes the technician to full accumulated potential. Pre-work sequence: (1) LOTO per OSHA 1910.333; (2) install PPG — ground jumper from messenger/armor to pole ground before hands contact cable; (3) test stray voltage before removing PPG; (4) rated rubber gloves per voltage class. OSHA 1910.269 MAD applies. ADSS outer jacket accumulates capacitive charge near power conductors even without metallic armor. *OSHA 29 CFR 1910.333; OSHA 29 CFR 1910.269; NESC Rule 441; IEEE 1048; BICSI OSP-DRD Ch. 8.7; ANSI/TIA-758-C §7.7.*

**6.10** 3-pole fall-of-potential (IEEE 81 §9.3): current probe at 5× rod length; potential probe at 62%. 62% rule validation: move probe ±10% — resistance change <2% confirms valid remote-earth zone. Acceptance thresholds: ≤25 Ω single rod (NEC §250.56); ≤5 Ω FDH/CO (Telcordia GR-1275); ≤1 Ω substation-adjacent (IEEE 80). Remediation: supplemental rods, bentonite, CHEMROD, perimeter ring. Clamp-on method (IEEE 81 §9.4): valid only within a multi-electrode GES — cannot be primary acceptance test for a new single-rod installation. *IEEE 81 §9.3–9.4; NEC §250.56; Telcordia GR-1275 §5; IEEE 80 §14.5; BICSI OSP-DRD Ch. 8.8; ANSI/TIA-758-C §7.8.*

---

## Interactive Type Distribution

| Interactive Type | Lesson(s) | Count |
|---|---|---|
| Flashcard set (mandatory every lesson) | 6.1–6.10 | 10 |
| Multiple-choice quiz (mandatory every lesson) | 6.1–6.10 | 10 |
| Scenario (branching / worked problem) | 6.3, 6.5, 6.8, 6.9, 6.10 | 5 |
| Drag-and-drop | 6.2, 6.4, 6.6 | 3 |

Scenarios concentrate on decision-heavy and safety-critical lessons: pole configuration selection, soil remediation decision, arrester placement, stray voltage pre-work sequence, and test result interpretation. Drag-and-drop covers code-body matching (6.2) and assembly labeling (6.4, 6.6).

---

## Final Exam Structure (~25 questions, 70% pass)

| Lesson coverage | Question count |
|---|---|
| 6.1 Fundamentals | 2 |
| 6.2 Regulatory Framework | 2 |
| 6.3 Pole Grounding | 3 |
| 6.4 Aerial Closure Grounding | 2 |
| 6.5 Underground Pedestal Grounding | 2 |
| 6.6 Building Entry Grounding | 3 |
| 6.7 Co-Located Bonding | 2 |
| 6.8 Lightning Protection | 3 |
| 6.9 Stray Voltage Hazards | 3 |
| 6.10 Ground Resistance Testing | 3 |
| **Total** | **25** |

Question split: ~18 multiple-choice / 7 scenario-applied. Lessons 6.8 and 6.9 each include at least one scenario exam question where the wrong answer states a safety consequence — reinforces the stakes of this domain.

---

## Citation Source Matrix

| # | NEC | NESC | BICSI | TIA-758-C | IEEE | Other |
|---|---|---|---|---|---|---|
| 6.1 | Art. 100; 250 Pt. I | Rule 012 | Ch. 8 | — | 1100 §1.2 | — |
| 6.2 | Art. 250 Pts. I–II | Rules 92–99 | Ch. 8.1 | §7 | 1100 §1.3 | — |
| 6.3 | §250.52, §250.66 | Rules 92, 96, 96F | Ch. 8.2 | §7.2 | 1100 §8.4.2 | RUS 1715E-110 §4; PLP/Hubbell |
| 6.4 | — | Rule 96F | Ch. 8.2 | §7.2 | 1100 §8.5 | Hubbell/PLP |
| 6.5 | §250.52, §250.56, §250.66 | Rule 92 | Ch. 8.3 | §7.3 | 1100 §8.3; 81 §4 | — |
| 6.6 | Art. 770 §770.93/100; §250.94 | Rule 230E | Ch. 8.4 | §7.4 | — | UL 497B |
| 6.7 | — | Rules 92, 96 | Ch. 8.5 | §7.5 | 1100 §8.3–8.4 | Telcordia GR-1275 §4 |
| 6.8 | — | Rule 97 | Ch. 8.6 | §7.6 | 1100 §8.6; 80 §14; C62.41.2 | — |
| 6.9 | — | Rule 441 | Ch. 8.7 | §7.7 | 1048 | OSHA 1910.333/1910.269 |
| 6.10 | §250.56 | — | Ch. 8.8 | §7.8 | 81 §9.3–9.4; 80 §14.5 | Telcordia GR-1275 §5 |

---

## Open Questions for User

1. **Stray voltage scenario calibration (6.9):** What voltage class does the crew encounter most on joint-use work — 7.2 kV distribution primary, 35 kV sub-transmission, other? A voltage-class-specific scenario is directly usable as a pre-job brief.

2. **CO/FDH grounding spec (6.7):** Lesson cites Telcordia GR-1275 as the CO/FDH acceptance standard. Does the team work in facilities governed by a co-op or CLEC spec that supersedes GR-1275?

3. **Ground resistance acceptance threshold (6.10):** Does the office SOP specify a tighter target than 25 Ω (NEC) / 5 Ω (Telcordia FDH)? Internal SOP numbers are more memorable than code minimums and should be the authoritative threshold in both lesson and exam.

=== OSP TOPIC 6 DISCOVERY END ===
