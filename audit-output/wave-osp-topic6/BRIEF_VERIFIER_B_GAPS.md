# OSP Topic 6 — T6 Brief Verifier B: Gap-Hunting + Open-Q Consolidation

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Read-only Verifier B — gap-hunting + open-Q consolidation framing
**Inputs read:** BRIEF_FRAMING_A.md · BRIEF_FRAMING_B.md · DISCOVERY.md · T4_FINAL_BRIEF.md · T5_FINAL_BRIEF.md · T3 BATCH_C_BRIEF.md (L3.12 scope)
**Framing:** A's output NOT read. Independent gap hunt.
**Word cap:** 2000 words

---

## §1 BICSI Domain 6 Scope Gap Analysis

Checklist of known BICSI OSP-DRD Chapter 8 sub-topics × covered Y/N by current 10-lesson outline.

| Domain 6 Topic | Covered in 10-Lesson Outline? | Notes |
|---|---|---|
| Bonding vs. grounding definitions (NEC Art. 100 / NESC Rule 012) | **Y** — L6.1 | Solid |
| NEC / NESC regulatory framework + boundary | **Y** — L6.2 | Solid |
| Pole grounding (downlead, rod, MGN) | **Y** — L6.3 | Solid |
| Aerial closure + messenger bonding | **Y** — L6.4 | Solid |
| Underground pedestal + soil resistivity | **Y** — L6.5 | Solid |
| Building entry / primary protector / IBT | **Y** — L6.6 | Solid |
| Co-located equipment / FDH to utility GES | **Y** — L6.7 | Solid |
| Lightning / surge arrester / ground ring | **Y** — L6.8 | Solid |
| Stray voltage / PPG / AC induction | **Y** — L6.9 | Solid |
| Ground resistance testing + acceptance | **Y** — L6.10 | Solid |
| **Cathodic protection isolation** (buried metallic conduit near cathodic-protected gas/water infrastructure) | **NOT COVERED** | Brief B §7 OQ2 explicitly flagged as possible simultaneous drop. No lesson covers dielectric unions, impressed-current interference, or NACE SP0169 isolation requirements. |
| **SPD coordination with primary protector** (let-through voltage hierarchy, equipment immunity margin) | **PARTIAL** — L6.8 addresses VPL vs. equipment immunity but in the context of lightning arresters only. No lesson covers coordination chain from primary protector → secondary SPD on active equipment. | Gap in depth for co-located active equipment scenarios |
| **Equipotential bonding for fenced compound enclosures** (outdoor cabinet compound / utility-fence perimeter bond) | **NOT COVERED** | No lesson addresses bonding of galvanized security fencing to GES. NEC §250.112 requires metal enclosure bonding; outdoor compound fences at hub sites are a field-common scenario. |
| **Ground-loop mitigation for long aerial spans** with mid-span grounds | **NOT COVERED** | No lesson addresses ground loop current path created when both ends of a long aerial segment are bonded to independent utility grounds. IEEE 1100 §8.5 covers this; omission is a common failure mode in rural long-haul aerial. |
| **Pre-energization grounding sequence** (before connecting active equipment to AC power) | **NOT COVERED** | L6.9 covers stray voltage on un-energized aerial cable (PPG sequence). But no lesson covers the sequence for connecting active electronics inside a hut/cabinet to AC — verifying cabinet GES before energizing. Brief B §3 failure modes table does not include this. |
| **Coordination with electrical utility's MGN (multi-grounded neutral)** at co-op transformer locations | **PARTIAL** — L6.3 mentions MGN bonding at joint-use poles but does not address scenarios where the utility's MGN resistance is too high and the bond creates a noise/fault path rather than a reference path. | Present as a concept; coordination failure mode absent |
| **As-built grounding documentation + RUS test log format** | **NOT COVERED** in any lesson body. Brief B §7 OQ3 flags this explicitly. L3.12 covers as-built records for the overall project but does NOT include a grounding test log template or GPS electrode documentation column — confirmed by reading T3 BATCH_C_BRIEF.md L3.12 scope. L6.10 mentions "RUS 1751F-815 testing interval and documentation requirements" in Brief A but provides zero detail on what fields the log must contain. | **HIGH-PRIORITY GAP** — Authoring a worked test log template here prevents L6.10 from being a theoretical lesson that fails at RUS close-out. |
| **Lightning damage repair + post-strike inspection sequence** | **NOT COVERED** | No lesson addresses what to inspect or replace after a direct strike event. T9 may own execution, but no code-citation pointer lesson exists in T1–T6. |
| **IEEE 367 / induced AC voltage on telecom conductors** | **NOT COVERED** | Neither brief cites IEEE 367 (recommended practice for determining voltage on commun circuits near power lines). This is relevant to L6.9 stray voltage but provides the analytical basis for quantifying induced voltage — its absence means L6.9 teaches "touch PPG and test" without teaching the physics of why induction produces the magnitudes it does. |
| **ATIS 0600321 / GR-1089 NEBS-3 grounding requirements** | **NOT COVERED** | Neither brief mentions GR-1089 (NEBS Level 3 grounding for CO-class buildings) or ATIS 0600321 (electrical protection from external sources). If PSC has any central-office or hub-site work, these standards govern. Low probability for pure rural OSP but should be flagged for Carter's awareness. |
| **47 CFR Part 68 grounding subset** | **NOT COVERED** | FCC Part 68 governs equipment connected to PSTN. For RUS rural builds that terminate at customer NIDs, Part 68 has NID grounding requirements. L6.6 covers primary protectors but does not reference Part 68. Low-probability gap for aerial OSP but present. |

**Score: 10 of 10 BICSI Ch. 8 core lessons covered. 6 BICSI-adjacent topics missing or materially partial.**

---

## §2 Daily-Job Scenario Gaps

Brief B covers daily-job scenarios well for the core 10 lessons. Gaps:

1. **Existing as-built shows only one ground rod at an FDH from a prior contractor** — no test log. How does the field team verify adequacy or document for RUS close-out? L6.10 covers testing methodology but has no scenario anchored to this "inherited plant" problem.
2. **Active equipment cabinet shows equipment malfunctions after a nearby lightning strike** — inspect, test, and document for insurance/RUS claim. No lesson owns post-strike inspection checklist.
3. **Long-haul aerial segment on rural cooperative: both terminal poles bond to independent utility grounds** — is this acceptable or does it create a ground loop? L6.3/L6.4 don't address this.
4. **Fenced outdoor hub compound with gate hardware** — does the fence need to be bonded to the GES? Who owns the bonding if the fence is utility-owned but the cabinet inside is PSC-owned? No lesson covers this compound scenario.

---

## §3 Standards-Citation Gaps

| Standard | Cited in Current Outline? | Risk if Absent |
|---|---|---|
| **IEEE 367** (induced voltage on telecom circuits near power) | NOT cited anywhere | L6.9 teaches PPG procedure without the analytical framework that explains why induction produces dangerous magnitudes. Citation required for curriculum claiming to explain "why." |
| **NESC Rule 215** (working space clearances near grounded structures) | NOT cited | Marginal T6 scope; T9 likely owns. Low risk. |
| **GR-1089 / NEBS Level 3** | NOT cited | Low risk for pure rural OSP; flag for CO/hub-site scope if applicable. |
| **OSHA 1910.137** (rubber insulating equipment specifications) | NOT cited | L6.9 cites 1910.269 MAD but not 1910.137, which governs the glove class and dielectric test interval. An authoring agent may write a PPG quiz question citing only 1910.269 for the glove spec, when 1910.137 is the equipment standard. **Medium-priority citation gap in L6.9.** |
| **NACE SP0169 / SP0286** | NOT cited in T6 (SP0286 cited in T5 L5.1 for galvanic isolation) | Cathodic protection isolation is absent. If buried metallic conduit runs near gas/water infrastructure, NACE SP0169 governs isolation couplings. |
| **ATIS 0600321** | NOT cited | Low risk for rural aerial OSP. |
| **47 CFR Part 68** | NOT cited | Low risk unless NID grounding at customer premises is in scope. |
| **RUS 1751F-630 §6.3** | Cited in T4 L4.7 as a cross-reference anchor; **Brief A's L6.10 references "RUS 1751F-815 §8"** for testing documentation. BUT RUS 1751F-815 existence is Framing A's unresolved OQ1. If 1751F-815 does not exist, the documentation anchor reverts to **1751F-630 §6.3** (aerial) and **1751F-635 §5** (underground). This is the highest-probability citation risk in the entire brief. | **CRITICAL — resolve before authoring.** |

---

## §4 Worked-Example Math Gaps

| Math Computation | Addressed in Current Outline? | Notes |
|---|---|---|
| Soil resistivity → ground rod count + spacing (full table derivation) | **PARTIAL** — L6.5 covers soil resistivity remediation conceptually and Brief A provides a scenario. But neither brief specifies deriving **rod count from measured soil resistivity using the Dwight formula** (ρ/2πL × (ln(4L/d) − 1)), which is the standard analytical method. | Authoring agents should derive this formula rather than presenting lookup tables only. |
| Bonding conductor sizing per fault current (NEC Table 250.66) | **NOT COVERED** — L6.7 states "#6 AWG minimum (NESC Rule 96C)" but neither brief derives the sizing from NEC Table 250.66 based on service entrance conductor size. A learner cannot select a bonding conductor for a non-default service size without this derivation. | **Medium-priority math gap.** |
| Earth-resistance threshold per facility class (derive each from cited standard) | **ADDRESSED** — Brief A L6.10 table explicitly lists thresholds and their sources (NEC, GR-1275, IEEE 80). | No gap. |
| SPD let-through voltage (VPL) coordination margin calculation | **PARTIAL** — L6.8 states VPL must be ≤ equipment rated surge immunity but does not derive the margin calculation. | Low risk — VPL coordination is typically a lookup, not a derivation. |
| Mid-span ground spacing for messenger continuity | **NOT COVERED** — neither brief addresses intervals between mid-span messenger grounds on long aerial runs. NESC Rule 96F requires bonding at closures; the interim bonding interval on runs with no mid-span closure is unaddressed. | **Low-priority math gap but present.** |

---

## §5 Cross-Topic Dependencies Missed by Both Briefs

| Gap | Analysis |
|---|---|
| **T2 L2.6 splice closure bonding** | T2 covers closure architecture; metallic closure body requires armor bond. Both briefs teach armor bonding in L6.4 but do NOT state "T2 L2.6 introduced metallic closure body; T6 L6.4 owns bonding practice." The cross-reference is one-directional (T6 → T5) but the T2 → T6 deferral chain is not documented. Authors may omit the "Why does closure armor bond exist?" setup that T2 established. |
| **T3 L3.12 as-built records** | Brief B §5 correctly notes the L6.10 test log → RUS close-out cross-reference. **However, T3 BATCH_C_BRIEF L3.12 scope does NOT include a grounding test log template** — it covers OTDR test files, splice logs, GPS photos, Form 515c/219. If T6 L6.10 also doesn't produce a test log artifact, the gap falls between the two topics and is never closed. One of the two topics must own the grounding test log format explicitly. |
| **T5 L5.8 (pedestals) FDH grounding deferral to T6 L6.7** | Both briefs correctly acknowledge this. No additional gap. |
| **T9 stray voltage execution deferral** | Both briefs correctly point L6.9 → T9. No additional gap. |
| **T2 splicing closure (grounding inside multi-conductor closures)** | Neither brief covers bonding of metallic shield / armor within a closure that houses multiple cable entries. This is a BICSI OSP-DRD Ch. 8.2 sub-topic: when a closure has both armored and un-armored cable entries, which metallic elements get bonded and how. |

---

## §6 Consolidated Open Questions for Carter (Prioritized)

| Priority | Question | Impact if Unresolved |
|---|---|---|
| **P1 — CRITICAL** | Does RUS Bulletin 1751F-815 (dedicated grounding bulletin) exist as a discrete document, or does the RUS grounding authority reside in 1751F-630 §7 (aerial) and 1751F-635 §5 (underground)? (Brief A §7 Q1) | Every L6.1–L6.10 RUS citation uses 1751F-815 section numbers that are structurally inferred, not verified. If the bulletin doesn't exist, all 10 lessons need citation replacement before authoring begins. Block-one issue. |
| **P2 — HIGH** | What voltage class does the crew encounter most on joint-use work — 7.2 kV distribution, 25 kV sub-transmission, other? (Brief A §7 Q2 + Brief B §7 Q1 — same question from both framings) | Determines rubber glove class (OSHA 1910.137), MAD distances (OSHA 1910.269), and the exam scenario parameters in L6.9. Wrong assumption = potentially dangerous lesson content. |
| **P3 — HIGH** | Which party owns the grounding test log template for the RUS close-out package — T3 L3.12 or T6 L6.10? T3's L3.12 scope covers OTDR/splice/GPS/photo logs but does NOT explicitly include a ground resistance test log. T6 L6.10 can own it, but that must be a deliberate authoring directive, not an accident of omission. (Brief B §7 Q3 partially addresses this; verifier B confirms the T3 gap via source file review) | If neither topic authors the ground resistance test log template, the learner completes a RUS close-out package that is missing a required deliverable. |
| **P4 — MEDIUM** | Does cathodic protection isolation (buried metallic conduit near gas/water infrastructure) belong in T6? If PSC routes near cathodic-protected gas infrastructure, NACE SP0169 requires dielectric isolation couplings at structure crossings. Brief B §7 Q2 explicitly flagged this; verifier B confirms neither brief assigns a lesson to cover it. | If it belongs in T6, a scope addition is needed. If it belongs in T9 (field procedures) or is out of scope entirely, that decision should be captured explicitly so authors don't accidentally include or omit. |
| **P5 — LOW** | Does the office use a tighter internal acceptance threshold than 25 Ω (NEC) or 5 Ω (GR-1275 FDH)? (DISCOVERY.md OQ3) | Internal SOP numbers are more memorable and should be the authoritative threshold in daily-job scenarios. No authoring blocker but strengthens daily-use value. |

---

## §7 Risk Register

| Risk | Severity | Lesson(s) Affected | Mitigation |
|---|---|---|---|
| RUS 1751F-815 non-existence — all 10 lessons cite section numbers from a bulletin whose structure is inferred | **CRITICAL** | 6.1–6.10 | Resolve P1 before authoring brief is issued. Authoring agents must not begin writing until citation anchor is confirmed. |
| L6.9 voltage-class calibration — wrong glove class / MAD taught in a safety-critical lesson | **HIGH** | 6.9 | Resolve P2 before L6.9 is authored. Wrong voltage class in PPG scenario could teach a technically incorrect safety procedure. |
| Ground resistance test log gap — neither T3 L3.12 nor T6 L6.10 explicitly owns the grounding test log template | **HIGH** | 6.10 (and T3 L3.12 retroactively) | Resolve P3. Add explicit authoring directive to L6.10 to include a test log artifact with RUS-required columns (date, electrode GPS, instrument, reading, method, technician). |
| OSHA 1910.137 citation omission — L6.9 teaches rubber gloves via 1910.269 MAD only, missing the glove specification standard | **MEDIUM** | 6.9 | Add OSHA 1910.137 to L6.9 citation matrix. Authoring agent must specify glove class using 1910.137 voltage class table, not just the 1910.269 MAD table. |
| NEC Table 250.66 bonding conductor sizing absent — L6.7 cites #6 AWG minimum without teaching the derivation for non-default service sizes | **MEDIUM** | 6.7 | Add worked example: select bonding conductor size given a specified service entrance conductor. Add NEC Table 250.66 to L6.7 citation matrix. |
| Cathodic protection isolation unaddressed — could produce lesson silently wrong for routes near gas/water infrastructure | **MEDIUM** | None currently | Resolve P4. Either add a compact sub-section in L6.5 (underground grounding) or explicitly scope-exclude. |
| Ground-loop risk on long aerial spans with independent terminal grounds — failure mode not taught | **LOW-MEDIUM** | 6.4 / 6.3 | Add IEEE 1100 §8.5 ground loop callout in L6.4. A single paragraph + one quiz distractor is sufficient. |
| IEEE 367 absent from L6.9 — PPG lesson teaches procedure without analytical basis for induction magnitudes | **LOW** | 6.9 | Add IEEE 367 as a supporting citation in L6.9 to cover the physics rationale for "why messenger can have hundreds of volts." Not required for exam question; required for curriculum depth. |

---

## §8 Net Verdict

**NEEDS-5-ADDITIONS-OR-CARTER-INPUT**

The 10-lesson core is well-structured and internally consistent. Both framings converged on the same titles, durations, and intensities — strong signal the core scope is right. The brief IS complete enough to authorize authoring if Carter confirms the five additions below.

**Required before issuing authoring brief:**
1. **P1 resolved** (1751F-815 existence) — block-one citation issue.
2. **P2 resolved** (voltage class) — safety-critical.
3. **P3 resolved** (test log ownership) — assign explicitly to L6.10.
4. **L6.9 citation matrix add** OSHA 1910.137 (rubber insulating equipment) alongside 1910.269.
5. **L6.7 math gap** — add NEC Table 250.66 bonding conductor sizing derivation.

**Carter input needed on:**
- P4 (cathodic protection scope) — yes/no/T9-defer.

**Can proceed to authoring without:**
- GR-1089 / ATIS / 47 CFR Part 68 (low probability for rural aerial OSP, scope-exclude is acceptable).
- IEEE 367 (add as supporting citation in L6.9 reading content, not as a new lesson).
- Ground-loop callout (add as callout box in L6.4, not a new lesson).

=== T6 BRIEF VERIFIER B END ===
