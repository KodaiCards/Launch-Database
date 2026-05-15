# OSP Topic 6 — Grounding, Bonding & Electrical Protection: Brief Framing A (Standards + Citation)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Discovery Agent A — Standards + Citation framing (re-dispatch; prior attempt hit usage cap mid-run)
**Framing:** Standards hierarchy + citation matrix. Derive each lesson's anchor standard(s) first; work backward to content.
**Sources:** DISCOVERY.md · T4_FINAL_BRIEF.md (grounding deferrals from L4.7) · T5_FINAL_BRIEF.md (grounding deferrals from L5.1, L5.9) · Standards: NEC Art. 250/770/800, NESC Rules 92/96/97/441, IEEE 81/1100/80, TIA-607-C, RUS 1751F-815/630, NFPA 780, IEC 62305

---

## §1 Topic 6 Official Scope

**BICSI Domain:** OSP-DRD Chapter 8 — Grounding, Bonding, and Electrical Protection. DISCOVERY.md correctly identifies this as the governing chapter.

**Scope alignment across standards:**

| Standard | Scope boundary for T6 |
|---|---|
| NEC Art. 250 | On-premises GES, IBT, electrode types (§250.52), electrode conductors (§250.66), intersystem bonding termination (§250.94). Code pointer taught in T4 L4.7; T6 owns installation practice depth. |
| NEC Art. 770 | OSP cable metallic sheath protection at building entry. T6 expands T4 L4.6 to cover primary protectors (UL 497B), Article 770.93/100 grounding, and duct seals. |
| NEC Art. 800 | Communication circuit grounding and bonding at building entry. T4 L4.6 introduced code structure; T6 L6.6 owns implementation depth. |
| NESC Rules 92, 96, 96F, 97, 441 | Utility-side bonding and grounding (joint-use poles, messenger strand, MGN bonding), arrester placement, stray voltage procedures. Full utility-side grounding authority. |
| IEEE 1100 (Emerald Book) | Recommended practice bridging NEC and NESC for telecom grounding. Non-mandatory but widely adopted. |
| IEEE 81 | Earth resistance measurement — 3-pole fall-of-potential and clamp-on methods. Lab/field standard; §9.3 (fall-of-potential) and §9.4 (clamp-on) are primary test sections. |
| IEEE 80 | AC substation grounding — ground potential rise (GPR). Relevant for arrester coordination and ground ring sizing near utility infrastructure. |
| TIA-607-C | Generic Telecommunications Bonding and Grounding for Customer Premises. Complements NEC Art. 250 for customer-owned OSP. Sections §4 (system architecture) and §5 (conductor sizing) are primary. |
| RUS 1751F-815 | RUS Grounding bulletin — primary RUS authority for grounding on RUS-funded outside plant. Stricter specs (conductor size, rod count, testing interval) take precedence over code minimums. |
| RUS 1751F-630 §7 | Aerial plant grounding — rod spec at poles, MGN bonding, downlead protection. Cross-reference in aerial grounding lessons. |
| NFPA 780 | Lightning Protection Code — air terminal placement, down conductors, bonding, ground rings. Complements IEC 62305 for US-adopted facilities. |
| IEC 62305 | International lightning protection — four protection levels (LPL I–IV). Relevant for GIS-adjacent and substation-adjacent facilities; less frequently cited on rural OSP than NFPA 780. |
| OSHA 29 CFR 1910.333 / 1910.269 | Electrical safety — lockout/tagout and PPG use. Code pointer for stray voltage lesson; T9 owns execution procedures. |
| Telcordia GR-1275 | CO and FDH grounding acceptance thresholds (≤5 Ω FDH; ≤1 Ω CO). Testing frequency and documentation requirements. |

**NESC/NEC boundary:** NESC governs utility plant (joint-use poles, aerial messenger, underground conduit in ROW) through the point of attachment / service entrance. NEC governs from the service entrance inward. T4 L4.7 established this boundary at code-pointer level; T6 teaches to both sides with the boundary as an explicit lesson frame.

---

## §2 Lesson Outline Proposal

DISCOVERY.md lesson structure is sound and adopted as base. The following table adds the standards framing layer, intensity assessment, and citation-depth notes from Agent A's perspective.

| # | Title | Scope (standards-anchored) | Duration | Intensity | Primary Standards | Supporting Standards | RUS |
|---|---|---|---|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | NEC Art. 100 definitions: bonding, grounding electrode system (GES), equipment grounding conductor (EGC), bonding jumper. NESC Rule 012 (definitions). Why fiber OSP messenger, armor, and closure hardware accumulate charge. This lesson is definitional — establishes vocabulary that every subsequent lesson uses. **No installation content here; pure definition + rationale.** | 25 min | STANDARD | NEC Art. 100; NEC Art. 250 Pt. I (§250.2) | NESC Rule 012; BICSI OSP-DRD Ch. 8; IEEE 1100 §1.2 | RUS 1751F-815 §1 (definitions section) |
| 6.2 | Regulatory Framework: NEC Art. 250 / NESC Rules 92–99 / IEEE 1100 | NEC vs. NESC scope boundary (the "handoff point" introduced in T4 L4.7 now taught deeply). NESC §92–99 full rule mapping. IEEE 1100 as non-mandatory bridge standard. TIA-607-C §4 for customer-owned plant. Scenario: code-body selection given route segment description (utility pole vs. customer easement vs. building entry). | 25 min | STANDARD | NEC Art. 250 Pts. I–II; NESC Rules 92–99 | BICSI OSP-DRD Ch. 8.1; TIA-607-C §4; ANSI/TIA-758-C §7; IEEE 1100 §1.3 | RUS 1751F-815 §2; 1751F-630 §7 |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | Complete pole ground assembly: bond clamp at messenger, #6 AWG Cu downlead protected grade-to-8-ft (NESC Rule 96), 5/8-in. × 8-ft copper-clad rod (NEC §250.52(A)(5)), supplemental rods if resistance > 25 Ω (NEC §250.56). MGN bonding (NESC Rule 96F): bonding fiber messenger to multi-grounded neutral eliminates arc-over risk. **Worked example: joint-use pole with distribution transformer — specify complete ground assembly.** T5 L5.1 deferred strand bonding to this lesson — explicitly acknowledge the deferral in lesson opener. | 30 min | HIGH-INTENSITY | NESC Rules 92, 96, 96F; NEC §250.52(A)(5), §250.56, §250.66 | BICSI OSP-DRD Ch. 8.2; IEEE 1100 §8.4.2; ANSI/TIA-758-C §7.2 | RUS 1751F-815 §3; RUS 1751F-630 §7; RUS 1715E-110 §4 |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | NESC Rule 96F: messenger bonded at every splice closure. Armored aerial cable: armor bonded at each closure and run end; bond strap rated for fault current. ADSS exemption (no metallic armor — bonding not required; confirm with BICSI OSP-DRD Ch. 8.2). Arrestors at every aerial-to-underground transition, installed on aerial (exposed) side. **T5 L5.1 deferred strand bonding/grounding to this lesson explicitly.** | 25 min | HIGH-INTENSITY | NESC Rule 96F; NEC Art. 800 (protector at transition) | BICSI OSP-DRD Ch. 8.2; ANSI/TIA-758-C §7.2; IEEE 1100 §8.5 | RUS 1751F-815 §3; RUS 1751F-630 §7 |
| 6.5 | Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | 5/8-in. × 8-ft Cu-clad rod (NEC §250.52(A)(5)); supplemental rods in parallel if resistance > 25 Ω (NEC §250.56); rod spacing minimum one rod-length. Perimeter ground ring: buried bare #2 AWG Cu ring at 18–24 in. for large enclosures (NEC §250.52(A)(4); IEEE 1100 §8.3). Soil resistivity types and remediation: clay (~100 Ω·m) one rod; sandy soil → bentonite or supplemental rods; rock/gravel → Ufer or CHEMROD. **T5 L5.9 deferred FDH housing grounding to T6 L6.7 — note in this lesson that pedestal grounding (this lesson) and FDH housing grounding (L6.7) are distinct topics.** | 25 min | HIGH-INTENSITY | NEC §250.52, §250.56, §250.66; NESC Rule 92 | IEEE 1100 §8.3; IEEE 81 §4 (soil resistivity measurement intro); BICSI OSP-DRD Ch. 8.3; ANSI/TIA-758-C §7.3 | RUS 1751F-815 §4; RUS 1751F-635 §5 |
| 6.6 | Building Entry Grounding: NEC Art. 770, Primary Protectors, and Duct Seals | NEC §770.93: metallic OSP cable components require listed primary protector (UL 497B) bonded to building GES. NEC §770.100: GEC from protector bonds to same electrode as power service + all other service protectors (equipotential bonding). NEC §250.94 IBT. Entrance conduit, weatherhead, duct seal. NESC/NEC boundary lesson: NESC governs the plant up to the protector; NEC governs from the protector inward. **T4 L4.7 taught the IBT code pointer; T4 L4.6 introduced Art. 800 structure; T6 L6.6 owns the combined installation practice.** | 25 min | HIGH-INTENSITY | NEC Art. 770 §770.93, §770.100; NEC §250.94; NEC Art. 800 §800.93, §800.100 | NESC Rule 230E; BICSI OSP-DRD Ch. 8.4; ANSI/TIA-758-C §7.4; UL 497B listing | RUS 1751F-815 §5 |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Grounding, and Utility Ground Integration | **T5 L5.9 deferred FDH housing grounding explicitly to this lesson.** NESC Rule 92: all conductive parts of communication systems on or adjacent to electrical supply structures bond to the supply system's GES. FDH housing on co-op poles bonds to utility pole ground (not independent electrode). CO/FDH grounding bus: bond to existing building GES (Telcordia GR-1275) — parallel electrodes create inter-system potential. Conductor minimum #6 AWG (NESC Rule 96C); #2 AWG recommended in high-fault-current environments (IEEE 1100). TIA-607-C §5 conductor sizing for customer-owned FDH. | 20 min | STANDARD | NESC Rules 92, 96C; TIA-607-C §5 | IEEE 1100 §8.3–8.4; Telcordia GR-1275 §4; BICSI OSP-DRD Ch. 8.5; ANSI/TIA-758-C §7.5 | RUS 1751F-815 §5; 7 CFR Part 1755 + PE-60 |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | Arrester types: gas-tube (first-strike absorption), MOV (secondary clamping), combination units. VPL (voltage protection level) must match equipment rated surge immunity. Placement: one arrester per aerial-to-underground transition and every facility entry; intervals ≤1 mile on exposed aerial in HKL zones (>60 thunderstorm-days/year). Ground ring: buried bare Cu at 18–24 in. depth encircling facility (IEEE 80 §14; NFPA 780 §4.13). Protection coordination chain: line-side arrester → equipment clamp → equipment immunity. NFPA 780 air terminal and down-conductor sizing. IEC 62305 LPL I–IV for high-exposure sites. | 25 min | HIGH-INTENSITY | NFPA 780 §4.5, §4.13; IEEE 80 §14; NESC Rule 97; IEEE C62.41.2 | BICSI OSP-DRD Ch. 8.6; ANSI/TIA-758-C §7.6; IEEE 1100 §8.6; IEC 62305 §4 | RUS 1751F-815 §6 |
| 6.9 | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | AC induction: parallel run between fiber metallic components and power conductor creates transformer coupling; floating messenger can accumulate hundreds of volts adjacent to distribution primaries. Intermittently bonded armor: touching an un-bonded section creates full accumulated potential exposure. PPG pre-work sequence (OSHA 1910.333 LOTO + OSHA 1910.269 MAD): (1) LOTO; (2) install PPG (ground jumper messenger/armor to pole ground before hands contact cable); (3) test stray voltage before PPG removal; (4) rated rubber gloves per voltage class. ADSS outer jacket accumulates capacitive charge near power conductors even without metallic armor. Code pointer only — T9 owns execution. **Macon GA joint-use scenario: distribution primary (7.2 kV is the PSC-typical class; teach this as primary example).** | 25 min | HIGH-INTENSITY | OSHA 29 CFR 1910.333; OSHA 29 CFR 1910.269; NESC Rule 441 | IEEE 1048 (PPG practices); BICSI OSP-DRD Ch. 8.7; ANSI/TIA-758-C §7.7 | RUS 1751F-815 §7 (stray voltage safety) |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | **3-pole fall-of-potential (IEEE 81 §9.3):** current probe at 5× rod length; potential probe at 62% distance. 62% rule validation: move probe ±10% — resistance change <2% confirms valid remote-earth zone. **Acceptance thresholds (derive each — sources vary):** ≤25 Ω single rod (NEC §250.56); ≤5 Ω FDH/CO (Telcordia GR-1275); ≤1 Ω substation-adjacent (IEEE 80). **Authoring guard: derive each threshold from its cited standard section before writing [CORRECT] tag.** Remediation: supplemental rods, bentonite, CHEMROD, perimeter ring. Clamp-on method (IEEE 81 §9.4): valid only within multi-electrode GES — NOT primary acceptance test for new single-rod installation. RUS 1751F-815 testing interval and documentation requirements. | 30 min | HIGH-INTENSITY | IEEE 81 §9.3, §9.4; NEC §250.56; Telcordia GR-1275 §5; IEEE 80 §14.5 | BICSI OSP-DRD Ch. 8.8; ANSI/TIA-758-C §7.8 | RUS 1751F-815 §8 (testing + documentation) |

**Total estimated duration: ~4.5 hrs (255 min). 10 lessons. Intensity: 6 HIGH-INTENSITY (L6.3, L6.4, L6.5, L6.6, L6.8, L6.9, L6.10) / 3 STANDARD (L6.1, L6.2, L6.7).**

Note on lesson count: DISCOVERY.md proposed 10 lessons; this framing retains 10. Topic scope does not justify splitting any lesson beyond the current size — the HIGH-INTENSITY lessons are well-bounded. If red team finds that L6.3 (pole grounding) + L6.5 (underground grounding) overlap significantly, consider merging and shifting the freed slot to expand L6.9 (stray voltage has safety-critical depth that could absorb 5 additional minutes). Do not split until after red-team review.

---

## §3 Citation Source Matrix (per lesson)

| # | NEC | NESC | BICSI | TIA-758-C / TIA-607-C | IEEE | Other |
|---|---|---|---|---|---|---|
| 6.1 | Art. 100; 250 Pt. I (§250.2) | Rule 012 | Ch. 8 | — | 1100 §1.2 | RUS 1751F-815 §1 |
| 6.2 | Art. 250 Pts. I–II | Rules 92–99 | Ch. 8.1 | TIA-758-C §7; TIA-607-C §4 | 1100 §1.3 | RUS 1751F-815 §2; 1751F-630 §7 |
| 6.3 | §250.52(A)(5); §250.56; §250.66 | Rules 92, 96, 96F | Ch. 8.2 | TIA-758-C §7.2 | 1100 §8.4.2 | RUS 1751F-815 §3; 1751F-630 §7; 1715E-110 §4 |
| 6.4 | Art. 800 (protector) | Rule 96F | Ch. 8.2 | TIA-758-C §7.2 | 1100 §8.5 | RUS 1751F-815 §3; 1751F-630 §7 |
| 6.5 | §250.52(A)(4); §250.52(A)(5); §250.56; §250.66 | Rule 92 | Ch. 8.3 | TIA-758-C §7.3 | 1100 §8.3; 81 §4 | RUS 1751F-815 §4; 1751F-635 §5 |
| 6.6 | Art. 770 §770.93, §770.100; §250.94; Art. 800 §800.93, §800.100 | Rule 230E | Ch. 8.4 | TIA-758-C §7.4 | — | UL 497B; RUS 1751F-815 §5 |
| 6.7 | — | Rules 92, 96C | Ch. 8.5 | TIA-758-C §7.5; TIA-607-C §5 | 1100 §8.3–8.4 | Telcordia GR-1275 §4; RUS 1751F-815 §5; 7 CFR 1755 + PE-60 |
| 6.8 | — | Rule 97 | Ch. 8.6 | TIA-758-C §7.6 | 80 §14; 1100 §8.6; C62.41.2 | NFPA 780 §4.5, §4.13; IEC 62305 §4; RUS 1751F-815 §6 |
| 6.9 | — | Rule 441 | Ch. 8.7 | TIA-758-C §7.7 | 1048 | OSHA 1910.333; OSHA 1910.269; RUS 1751F-815 §7 |
| 6.10 | §250.56 | — | Ch. 8.8 | TIA-758-C §7.8 | 81 §9.3, §9.4; 80 §14.5 | Telcordia GR-1275 §5; RUS 1751F-815 §8 |

**Standards density assessment:** Every lesson has ≥3 citable standard sections. L6.3, L6.5, L6.6, L6.10 have the highest citation density — these are also the HIGH-INTENSITY lessons where worked-example derivations are most critical. Authors on these four lessons must verify each numeric value (rod length, conductor size, resistance threshold) from its cited standard section before writing any [CORRECT] tag.

---

## §4 Worked-Example Anchors (per lesson)

| # | Worked-Example Description | Derivation Path | Key Numbers (verify before authoring) |
|---|---|---|---|
| 6.1 | Static charge scenario: ADSS cable adjacent to distribution primary — why bonding applies even without metallic armor | Capacitive charge accumulation concept; cite IEEE 1100 §1.2; no numeric derivation required | Qualitative only |
| 6.2 | Route segment code-body selection: utility pole / customer easement / building entry — identify controlling standard per segment | NESC/NEC boundary rule from T4 L4.7 applied per segment; cite NESC Rule 012 trigger + NEC §90.2(B) exclusion | Qualitative + citation matching |
| 6.3 | **Joint-use pole with distribution transformer:** specify complete ground assembly | (1) Bond clamp at messenger (NESC Rule 96F); (2) #6 AWG Cu downlead, PVC-protected grade to 8 ft (NESC Rule 96); (3) 5/8-in. × 8-ft Cu-clad rod (NEC §250.52(A)(5)); (4) Test resistance; (5) supplemental rod if >25 Ω, spaced ≥1 rod-length apart (NEC §250.56). MGN bond to neutral if joint-use (NESC Rule 96F). | #6 AWG Cu, 5/8 × 8 ft, 25 Ω threshold, ≥8-ft spacing supplemental rod |
| 6.4 | **Armored aerial closure — specify bond strap and arrestor placement at aerial-to-UG transition** | (1) Armor bond strap at closure (NESC Rule 96F); (2) arrestor on aerial (exposed) side; (3) arrestor grounded to pole ground, not floating; (4) ADSS: no armor bond required — confirm BICSI OSP-DRD Ch. 8.2 | Qualitative + placement rules |
| 6.5 | **High-resistivity soil scenario: 3 ground rods, sandy loam, measured 28 Ω after single rod** — select remediation | (1) Single rod > 25 Ω threshold (NEC §250.56) → supplemental rod required; (2) Sandy loam ~200 Ω·m → add second rod ≥8-ft spacing; (3) Re-test; if still >25 Ω → bentonite backfill or CHEMROD; (4) If FDH → must achieve ≤5 Ω (Telcordia GR-1275 §5) — stricter threshold applies. | 25 Ω (NEC §250.56); 5 Ω (GR-1275 FDH); 8-ft rod-spacing |
| 6.6 | **Building entry detail omitting primary protector bond** — identify violation, cite standard, specify fix | (1) Locate protector (listed per UL 497B); (2) Confirm protector GEC runs to same electrode as power service (NEC §770.100); (3) Verify IBT installed (NEC §250.94); (4) Duct seal at entrance conduit. Cite NEC §770.93 for the protector requirement. | NEC §770.93, §770.100, §250.94; UL 497B |
| 6.7 | **FDH on co-op distribution pole — specify bonding configuration** | (1) NESC Rule 92: bond FDH housing to utility pole ground (not independent electrode); (2) Minimum #6 AWG Cu (NESC Rule 96C); (3) Verify terminal resistance ≤5 Ω (Telcordia GR-1275 §4); (4) Parallel electrodes NOT permitted — creates inter-system potential. | #6 AWG min; ≤5 Ω; no parallel electrodes |
| 6.8 | **Aerial segment in high-keraunic zone (>60 thunderstorm-days/year): specify arrester placement and ground ring** | (1) Arrester at every aerial-to-UG transition (NESC Rule 97); (2) Additional arresters at ≤1-mile intervals on exposed aerial (BICSI OSP-DRD Ch. 8.6); (3) Ground ring: buried bare Cu at 18–24 in. depth, encircle facility (NFPA 780 §4.13); (4) VPL ≤ equipment rated surge immunity (IEEE C62.41.2). | ≤1-mile interval; 18–24 in. burial; VPL selection |
| 6.9 | **Pre-work sequence before handling messenger with 7.2 kV distribution primary on joint-use pole** | (1) OSHA 1910.333 LOTO; (2) PPG: install ground jumper from messenger to pole ground before hands contact cable (IEEE 1048); (3) Test stray voltage with hot stick + meter; (4) Rated rubber gloves per 7.2 kV voltage class (OSHA 1910.269 MAD); (5) Do NOT remove PPG until work complete and test confirms clearance. | 7.2 kV distribution primary as the PSC-typical joint-use class |
| 6.10 | **3-pole fall-of-potential test: 5/8-in. × 8-ft rod, results at 50%/62%/75% = 18/22/28 Ω — validate 62% rule, accept or remediate** | (1) 62% rule validation: ΔR at ±10% = |28−18| = 10 Ω; 10/22 = 45% change → exceeds 2% threshold → 62% zone NOT in remote earth → test invalid; (2) Action: move current probe further (5× rod length = 5 × 8 ft = 40 ft — verify actual probe placement); if probe was already at 5× rod length, extend to 10× and re-test. **Authoring guard: the 2% threshold and 5× placement rule must be cited from IEEE 81 §9.3 — do not state values without section citation.** | IEEE 81 §9.3; 62% position; 2% ΔR tolerance; 5× current probe distance |

---

## §5 Final Exam Shape

- **Questions:** 20 (2 per lesson × 10 lessons). Consistent with T4 (32 Qs / 16 lessons = 2 per lesson) and T5 (26 Qs / 13 lessons = 2 per lesson) convention.
- **Pass threshold:** 14/20 (70%) — math: 20 × 0.70 = 14.0 → 14/20 = 70.0%. Clean calculation.
- **Format:** A–D options; `[CORRECT]` inline; `*Rationale:*` italic block; bold per-option sub-bullets with 1-line rationale + citation section; lesson-ordered in source; randomized at Moodle import.

| Lesson | Qs | Types |
|---|---|---|
| 6.1 Definitions | 2 | 1 NEC Art. 100 term recall + 1 bonding-need scenario (ADSS charge accumulation) |
| 6.2 Regulatory Framework | 2 | 1 NESC/NEC boundary recall + 1 code-body selection scenario (3-segment route) |
| 6.3 Pole Grounding | 2 | 1 ground assembly component recall + 1 MGN bonding scenario (joint-use pole) |
| 6.4 Aerial Closure Grounding | 2 | 1 ADSS vs. armored cable bonding requirement recall + 1 arrestor placement scenario |
| 6.5 Underground Grounding | 2 | 1 rod spec recall (NEC §250.52) + 1 soil-resistivity remediation scenario |
| 6.6 Building Entry Grounding | 2 | 1 UL 497B primary protector recall + 1 building-entry violation identification scenario |
| 6.7 Co-Located Bonding | 2 | 1 NESC Rule 92 application recall + 1 FDH bonding configuration scenario |
| 6.8 Lightning Protection | 2 | 1 arrester type + VPL recall + 1 HKL zone placement scenario (safety consequence wrong answer) |
| 6.9 Stray Voltage | 2 | 1 PPG sequence recall + 1 pre-work sequence selection scenario (safety consequence wrong answer — wrong order = exposure) |
| 6.10 Ground Resistance Testing | 2 | 1 62% rule recall + 1 test-validity scenario (probe placement validation) |
| **Total** | **20** | ~50% recall / ~50% applied scenario |

**Safety questions (L6.8 and L6.9):** wrong answers in the rationale block must state the safety consequence (e.g., "Incorrect — installing PPG after hands contact cable means the installer is already exposed to accumulated induction voltage, which can reach lethal levels at 7.2 kV primary proximity"). Per T4/T5 convention, this reinforces that the question is not merely procedural.

---

## §6 Cross-Topic Dependencies

### Inbound deferrals (content T6 must deliver)

| Source Lesson | What was deferred | T6 Lesson that owns it |
|---|---|---|
| **T4 L4.7** NEC Art. 250 code pointer | "Hard stop at code-pointer level — installation depth = Topic 6" (T4 Final Brief §1 L4.7 scope column, verbatim). T4 taught IBT location (§250.94) and electrode types (§250.52) at code pointer level only. | L6.2 (regulatory framework depth) + L6.6 (IBT installation practice) + L6.5 (electrode installation) |
| **T5 L5.1** strand bonding/grounding | T5 Final Brief §5: "Explicit deferral in L5.1: 'strand bonding/grounding — see T6 L6.3'" (verbatim). T5 taught strand selection and damper placement but explicitly deferred all grounding practice to T6. | **L6.3** (pole grounding including messenger bond) |
| **T5 L5.9** FDH housing grounding | T5 Final Brief §5: "L5.9 teaches FDH as terminal hardware unit only. Explicit deferral in L5.9 body: 'FDH housing grounding — see T6 L6.7'" (verbatim). T5 L5.9 and L5.10 deferred all grounding to T6. | **L6.7** (co-located equipment bonding including FDH housing) |

**Authoring instruction:** Each of L6.3, L6.7 must open with an explicit "In T5 L5.X, we deferred [specific content] to this lesson. This is where it lives." — do not assume learners connected the cross-reference; state it explicitly.

### Outbound cross-references (what T6 sends forward)

| T6 Content | Destination |
|---|---|
| Stray voltage field procedures (code pointer in L6.9) | T9 L9.x (exact lesson TBD — owned by T9 brief) |
| PPG installation execution and MAD approach distances | T9 (OSHA 1910.269 procedures) |
| Earth resistance measurement field execution | T9 (field testing procedures, if covered) |

---

## §7 Open Questions for Red Team / Orchestrator

**Q1 — RUS 1751F-815 edition and section numbering (HIGH priority):** DISCOVERY.md cites RUS 1751F-815 throughout as the primary RUS grounding bulletin. The section numbers cited (§1 definitions, §2 framework, §3 aerial, §4 underground, §5 building entry/FDH, §6 lightning, §7 stray voltage, §8 testing) are structurally plausible but have NOT been verified against an actual copy of 1751F-815. **Before authoring, an agent must confirm the actual section map of 1751F-815 or flag it as UNVERIFIED-STRUCTURE.** If 1751F-815 does not exist as a discrete bulletin, the primary RUS grounding authority reverts to 1751F-630 §7 (aerial) and 1751F-635 §5 (underground) — which are confirmed citations in T4 and T5 final briefs. The orchestrator should resolve this before the authoring brief is issued.

**Q2 — L6.9 voltage class calibration:** DISCOVERY.md open question OQ1 asked what voltage class the crew encounters most on joint-use work. This framing defaults to **7.2 kV distribution primary** as the PSC-typical class based on rural co-op distribution norms. If Carter's team regularly works adjacent to 35 kV sub-transmission, the rubber glove class and MAD distances in the scenario change. Orchestrator or user should confirm before L6.9 exam question is written.

**Q3 — L6.10 IEEE 81 §9.3 numeric precision:** The 62% rule derivation in the worked example assumes the 2% ΔR tolerance threshold is a verbatim IEEE 81 §9.3 value. This must be verified by the authoring agent from an actual IEEE 81 copy before [CORRECT] is written. If the tolerance is stated differently in the standard (e.g., as a range or as a qualitative criterion), the exam question framing must adapt. Do not write [CORRECT] on a numeric threshold that has not been traced to a standard section.

---

*Word count: ~1,490 words (target ≤1,500).*

=== T6 BRIEF FRAMING A END ===
