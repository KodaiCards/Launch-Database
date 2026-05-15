# OSP Topic 6 — Bonding & Grounding: BRIEF FRAMING B (Learner Outcomes + Daily-Job Applicability)

**Branch:** `claude/debug-previous-issues-MoN9D`  
**Date:** 2026-05-14  
**Agent:** Discovery B — learner-outcomes + daily-job framing (parallel to Agent A; A's output not read)  
**Source inputs:** DISCOVERY.md (T6 wave dir) · T4 L4.7 (NEC 250 grounding code basis) · T5 L5.1 (pole hardware; T6 deferrals at line 52) · T5 L5.9 (FDH; T6 defer at line 47, 142, 272) · T5 FINAL BRIEF · T4 FINAL BRIEF · T3 BATCH_C_BRIEF · T1 L1.2 structural format  
**Word cap:** 1500 words

---

## §1 Topic 6 Learner Outcome

By the end of Topic 6, a learner can:

1. **Distinguish** bonding from grounding and classify each OSP component (messenger, armor, FDH housing, protector) as requiring which treatment.
2. **Specify** a complete pole ground assembly (downlead, electrode, MGN bond) citing NESC Rules 92/96/96F.
3. **Select** electrode type and size for a given soil resistivity and facility class (drop, FDH, CO/hub); apply NEC §250.52/§250.56 and Telcordia GR-1275 thresholds.
4. **Review** a building-entry riser detail for IBT and protector grounding omissions; cite NEC §250.94, §800.93, §770.100.
5. **Design** a lightning protection scheme (arrester placement interval, ground ring) scaled to keraunic level; cite IEEE C62.41.2 and NESC Rule 97.
6. **Execute** PPG pre-work sequence before touching messenger or armor on a joint-use pole; cite OSHA 1910.333/1910.269 and NESC Rule 441.
7. **Perform** a 3-pole fall-of-potential test, validate the 62% rule, and accept or remediate against the applicable facility threshold.
8. **Deliver** a RUS-compliant grounding as-built package — bonding schedule, test log, electrode GPS — per RUS 1751F-630 §6.3.

---

## §2 Lesson Outline Proposal — 10 Lessons (~4.5 hrs)

| # | Title | Duration | Intensity |
|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | 25 min | STANDARD |
| 6.2 | Regulatory Framework: NEC Art. 250, NESC §§92–99, and IEEE 1100 | 25 min | STANDARD |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | 30 min | HIGH-INTENSITY |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | 25 min | HIGH-INTENSITY |
| 6.5 | Underground Pedestal and FDH Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | 25 min | HIGH-INTENSITY |
| 6.6 | Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal | 25 min | HIGH-INTENSITY |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition | 20 min | STANDARD |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | 25 min | HIGH-INTENSITY |
| 6.9 | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | 25 min | HIGH-INTENSITY |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | 30 min | HIGH-INTENSITY |

**Total: ~4.5 hrs. 10 lessons. 7 HIGH-INTENSITY / 3 STANDARD.**

Lesson count (10) matches DISCOVERY.md draft. Sequence matches the logical build chain: conceptual foundation (6.1–6.2) → aerial plant (6.3–6.4) → underground/cabinet (6.5) → building entry (6.6) → co-located equipment (6.7) → system-level protection design (6.8) → hazard recognition and safety procedure (6.9) → verification and documentation (6.10).

---

## §3 Daily-Job Hooks per Lesson

| Lesson | Concrete Daily-Job Scenario (one-liner) |
|---|---|
| 6.1 | New closure on joint-use pole: classify messenger, armor, ADSS jacket — bond, ground, or neither? |
| 6.2 | PSC RUS route: aerial run under NESC Rule 96F, building entry governed by NEC §250 — identify the boundary and the handoff point |
| 6.3 | Specify complete ground assembly for a Macon GA joint-use pole: red-clay soil, co-op distribution, RUS aerial plant — derive conductor size, rod spec, MGN bond citation |
| 6.4 | Review as-built photo log: crew closed mid-route splice without armor bond — flag it, cite it, describe the consequence |
| 6.5 | New FDH on red-clay Georgia pad site (resistivity ~100 Ω·m): design electrode configuration to meet Telcordia GR-1275 ≤5 Ω; document for RUS submittal |
| 6.6 | Permit drawing review: electrical contractor says "bond to the Ufer slab" — red-mark every NEC 800.100/250.94 violation before PE stamp |
| 6.7 | Pole-mounted FDH: co-op GES tests at 8 Ω — bond to utility GES or add independent rod? Cite NESC Rule 92 + GR-1275 multi-ground prohibition |
| 6.8 | 3-mile aerial feeder, 65 thunderstorm-days/year county: build arrester placement schedule and ground ring spec for both A/UG transitions |
| 6.9 | Pole record shows 48 VAC stray on last maintenance visit — walk crew through PPG pre-work sequence before opening messenger lashing; cite OSHA 1910.333 |
| 6.10 | 3-pole test result: 28 Ω at new single-rod FDH — apply NEC §250.56 vs. GR-1275 threshold; accept, remediate, or escalate and document for RUS close-out |

---

## §4 Common Failure Modes Addressed per Lesson

| Lesson | Failure Mode Prevented |
|---|---|
| 6.1 | Bonding FDH to an independent rod instead of the building GES — parallel electrodes create inter-system potential differences that destroy equipment at lightning events |
| 6.2 | Citing NEC Art. 250 to govern a joint-use pole aerial run — NESC governs utility ROW; mixing them leaves a compliance gap at the handoff boundary |
| 6.3 | Installing a messenger bond strap without a down-lead to a driven rod — bonding without an earth path provides no fault return |
| 6.4 | Skipping armor bond at mid-route splices — floating armor segment accumulates charge and arcs through the closure |
| 6.5 | Accepting 28 Ω at an FDH because NEC §250.56 says ≤25 Ω — without knowing Telcordia GR-1275 requires ≤5 Ω for active telecom facilities |
| 6.6 | Terminating protector ground on an unlisted "telephone ground bar" instead of a listed IBT — not a NEC 800.100-compliant termination |
| 6.7 | Adding an independent ground rod at a pole-mounted FDH instead of bonding to the utility GES — creates potential difference that damages equipment under fault |
| 6.8 | Omitting arresters at A/UG transitions because "the UG section is short" — every transition is an exposure point |
| 6.9 | Touching messenger before installing PPG — "it's fiber, no current" assumption; metallic messenger couples AC induction even from all-dielectric cable deployments |
| 6.10 | Using clamp-on meter as primary acceptance test for a new single-rod installation — valid only within an existing multi-electrode GES; yields falsely optimistic readings on isolated new rods |

---

## §5 Cross-Topic Dependencies

| Dependency | Direction | Scope |
|---|---|---|
| T4 L4.7 (NEC Art. 250 code basis) | T4 → T6 prerequisite | L4.7 stops at code-pointer level (IBT/electrode types). T6 L6.6 builds installation practice on that foundation. |
| T4 L4.6 (NEC Art. 800 + Ch. 8) | T4 → T6 prerequisite | Art. 800.93 protector conductor sizing is T4 content; T6 L6.6 assumes it. |
| T5 L5.1 (pole hardware) | T5 → T6 prerequisite | T5 L5.1 line 52 defers strand bonding + MGN bonding to T6 L6.3/L6.4 explicitly. |
| T5 L5.8/L5.9 (pedestals + FDH) | T5 → T6 prerequisite | T5 L5.9 line 47 + 272 defer FDH housing grounding to T6 L6.7 explicitly. |
| T4 L4.4 / T9 (Work Rules) | T6 → T9 forward pointer | T6 L6.9 owns PPG pre-work sequence at code-citation level; T9 owns field execution. Same boundary as T4 L4.4/L4.13 — stop at citation, forward-reference T9. |
| T3 L3.12 (as-built documentation) | T3 ↔ T6 cross-ref | T6 L6.10 test logs feed the RUS close-out package taught in T3 L3.12. Cross-reference both ways. |

---

## §6 Interactive Element Ideas

Every lesson: mandatory flashcard set + 5-question MC quiz (T2/T5 baseline convention).

Scenario (branching / worked problem) for lessons requiring design judgment: 6.3 (pole assembly spec), 6.5 (soil/electrode selection), 6.6 (riser detail red-mark with 3 intentional omissions), 6.9 (PPG pre-work sequence — wrong step order produces consequence screen), 6.10 (3-pole test result: apply 62% rule + accept/remediate).

Drag-and-drop: 6.2 (route segment → controlling standard), 6.4 (label splice-closure assembly: bond strap / arrestor / ground lead), 6.8 (place arrester symbols on 3-mile aerial route schematic).

Final exam: 20 questions (2 per lesson × 10), 70% pass threshold (14/20), ~50% recall / ~50% applied scenario.

---

## §7 Open Questions for Red Team / Orchestrator

1. **L6.9 voltage class:** 7.2 kV single-phase distribution assumed for PPG/MAD scenario. If PSC RUS routes near Macon regularly run under 25 kV sub-transmission, rubber glove class and MAD tables differ substantially — confirm with Carter before L6.9 is authored.

2. **Lesson count convergence:** Both framing agents landed at 10 lessons with near-identical titles. Strong signal the scope is complete — but orchestrator should spot-check that no sub-topic (e.g., cathodic protection isolation for buried metallic conduit adjacent to gas lines) was dropped from both framings simultaneously.

3. **RUS test log format (L6.10):** No T1–T5 lesson specifies the RUS-accepted ground resistance test log format (column headers, GPS fields, instrument calibration note). L6.10 should include a test log template artifact and cross-reference T3 L3.12. Verify T3 L3.12 does not already define this before authoring.

=== T6 BRIEF FRAMING B END ===
