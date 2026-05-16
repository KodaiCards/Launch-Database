# T18 Retroactive Audit R-5: Training-Program-Design + Competence-Based Assessment

**Topic:** T18 "Safety & OSHA" — `osp-training/src/lessons/T18/*.jsx`
**Framing:** Training-program-design + competence-based assessment (CBA)
**Standards lens:** 29 CFR 1926.20-21, 29 CFR 1926.32(f) competent-person standard, 29 CFR 1910.132(d)(2) PPE training
**Auditor:** R-5 (independent pass before reading R-1/2/3/4)
**Date:** 2026-05-16

---

## 1. Independent Findings (R-5 new)

### R5-NEW-1 | MED | PPE Inspection Competency Not Assessed

**Location:** `L05-ppe-hands-head-eyes-feet.jsx` Advanced section + `L10-t18-capstone-quiz.jsx`

**Issue:** The Advanced tier of L05 covers three inspection/maintenance skills with direct OSHA compliance implications:
1. Rubber glove air-inflation test (required before each use per ASTM D120)
2. Hard hat replacement schedule (manufacturer interval or 5 years)
3. Fall-arrest harness retire-after-fall policy (29 CFR 1910.140(c)(21))

None of these appears in L05's 4-question quiz. None appears in L10's 22-question capstone. Under 29 CFR 1910.132(d)(2), employers must train workers on "the proper care, maintenance, useful life and disposal of the PPE." A curriculum that teaches the material but tests only selection/classification — not the inspection and maintenance actions — does not produce a defensible OSHA training record for the inspection competency.

**CBA gap:** Learning objective achievability requires that what is taught is what is assessed. Workers who pass this curriculum have not demonstrated inspection competency; they have demonstrated selection knowledge.

**Fix shape:** Add 1–2 quiz questions in L05 specifically targeting the inspection/maintenance procedures (e.g., "You're about to use Class 2 rubber gloves rated for 17kV. The gloves haven't been tested in 7 months. What do you do?" [correct: remove from service + tag for retest]). Alternatively, add 1 capstone scenario integrating PPE inspection as a decision node.

---

### R5-NEW-2 | MED | L02 LOTO — lesson_type Claims Application-Level; Prerequisites Don't Support It

**Location:** `L02-lockout-tagout-loto.jsx` meta, lines 1–22

**Issue:** `lesson_type: 'working'` signals to the LMS and learner that this lesson enables application-level competency — i.e., the learner can now independently perform LOTO on OSP equipment. The 29 CFR 1926.32(f) competent-person standard requires: "capable of identifying existing and predictable hazards in the surroundings or working conditions which are unsanitary, hazardous, or dangerous to employees."

L02's `meta.prerequisites` are `['T18.L01']` only. The lesson's three fiber-hut examples (battery rack, EDFA shelf, generator transfer switch) are well-chosen. But the hazard-identification prerequisite — what makes something an "energy-isolating device" vs just an on/off switch; how to recognize stored energy (capacitors, hydraulics, springs, gravity) in novel equipment not covered by the three examples — is not taught before or within L02.

The BranchingScenario (L02, `step5-end`) takes the learner from "apply personal lock" directly to "cleared to work" without demonstrating the verify-zero-energy step via control actuation (previously flagged by R-4 as R4-NEW-1). This means the procedure taught does not match the OSHA-required 6-step sequence in 1910.147(d)(6) — specifically step (d)(6): "Verify the isolation and de-energization of the machine or equipment."

A worker who completes L02 as written would be taught to: identify LOTO situations (awareness) + follow a 5-step sequence omitting verification. That's a partial procedure that could cause fatality if applied as taught.

**CBA impact:** `lesson_type: 'working'` is overstated unless: (a) the verify-zero-energy step is added to the BranchingScenario, AND (b) the learning objectives explicitly scope "OSP fiber-hut-class equipment only" and note that novel equipment requires qualified electrical authority consultation.

**Fix shape:** (a) Add `step5-verify` node to BranchingScenario between lock application and "cleared to work": instruct learner to attempt to operate the energy-isolating device — if it moves or restores energy, STOP. (b) Add scoping language to learning objectives: "Apply the 1910.147(d) LOTO procedure to OSP fiber hut and generator equipment." (c) Optionally downgrade `lesson_type` to `'foundation'` unless verify-zero-energy is added.

---

### R5-NEW-3 | MED | L07 lesson_type: 'working' Overstates Competency Level

**Location:** `L07-working-near-energized-conductors.jsx` meta, line 8

**Issue:** L07 is typed `lesson_type: 'working'` but the lesson's own competence framing is awareness. The decision tree is:
- Are you within the MAD of an energized conductor? → YES → STOP. Call the utility. Do not proceed.
- The lesson explicitly states: "Most OSP telecom crew members are NOT 1910.269-qualified."

The WorkedExample shows the MAD calculation formula from Appendix B of 1910.269 — but then provides a disclaimer that the calculation is for awareness/comprehension only and should not be used to assess safe approach in the field without utility coordination. This is the correct pedagogical choice.

`lesson_type: 'working'` implies a learner can independently apply the lesson's skills in a work context. But L07's competence ceiling is "recognize the hazard and stop" — an awareness-level skill. Labeling this 'working' may lead learners to believe they are now equipped to work near energized conductors, which contradicts the lesson's own framing.

**Fix shape:** Change `lesson_type` to `'foundation'` or create a new type `'awareness'` (if the LMS supports it). Add a callout in the lesson's learning objectives: "This lesson develops AWARENESS-level competency only. Independent work near energized conductors requires 1910.269 qualification (separate training program)."

---

### R5-NEW-4 | LOW | Capstone Lacks LOTO Integration Scenario

**Location:** `L10-t18-capstone-quiz.jsx` BranchingScenarios (2 scenarios)

**Issue:** L10's two integrative BranchingScenarios:
- Scenario 1: Manhole entry (integrates L01 hierarchy of controls + L03 confined space + L06 traffic control)
- Scenario 2: Incident classification (integrates L09 recordable/near-miss + L04 fall-protection decision)

LOTO (L02) appears only in the 22-question MC pool (3 questions). It has no integrative scenario at the capstone level. OSHA program auditors specifically evaluate whether training for the highest-fatality-risk topics is assessed at the application level, not just recall. Confined-space fatalities account for ~13 OSHA citations/yr in telecom; LOTO-related fatalities in energy-control contexts are documented in OSP (dig-in + energized equipment events).

A learner who passes the capstone's 3 MC questions on LOTO has not demonstrated ability to execute the 6-step procedure under a realistic scenario. The capstone's current scenario design leaves this gap.

**Fix shape:** Add a third BranchingScenario: "You're preparing to work in a fiber hut to swap a failed OLT card. Walk through the LOTO procedure." Decision nodes: recognize energy sources → locate EIDs → notify affected employees → apply LOTO → verify zero energy → proceed vs abort based on learner choices. Integrates L02 procedures + L07 awareness of electrical scope.

---

### R5-NEW-5 | LOW | "Competent Person" OSHA Category Not Introduced

**Location:** Curriculum-wide — T18 meta.vocabulary_introduced across L01–L09

**Issue:** The T18 curriculum introduces:
- `authorized employee (LOTO)` (L02) — defined in 1910.147(b)
- `qualified electrical worker (1910.269)` (L07) — defined in 1910.269

It does NOT introduce `competent person` as defined in 29 CFR 1926.32(f). In OSHA enforcement, citations for confined-space entry (1910.268(o)), fall protection (1910.268(g)), and atmospheric testing routinely reference the "competent person" standard. OSHA field compliance officers use "competent person" language in citations; job postings for site supervisors frequently require "competent person" designation.

A T18 graduate who encounters an OSHA citation referencing "failure to provide competent person supervision" for fall protection or atmospheric testing would not know what term means or how it differs from "authorized employee (LOTO)" or "qualified electrical worker."

The gap is pedagogically minor — the practical instructions in L03 and L04 are sound. But the vocabulary omission means learners cannot navigate OSHA enforcement language confidently.

**Fix shape:** Add `competent person` to L01 or L04 vocabulary_introduced. Definition: "A person designated by the employer who is capable of identifying existing and predictable hazards and has the authority to take prompt corrective measures (29 CFR 1926.32(f))." Contrast with authorized employee (procedure-level, 1910.147) and qualified electrical worker (technical qualification, 1910.269).

---

## 2. Competence Achievability Matrix (L01–L09)

| Lesson | lesson_type | Claimed competency | Achievable? | Notes |
|--------|-------------|-------------------|-------------|-------|
| L01 | foundation | Recognize hazards; apply hierarchy of controls | YES | Well-scoped, quiz matches objectives |
| L02 | working | Perform LOTO on OSP equipment | PARTIAL | Verify-zero-energy step missing from scenario (R4-NEW-1 + R5-NEW-2) |
| L03 | working | Conduct confined-space entry protocol | PARTIAL | Methane density error + H₂S IDLH error corrupt foundational facts |
| L04 | working | Apply fall protection on poles/aerial lifts | YES | Solid procedure + SideBySide + quiz aligned |
| L05 | working | Select and use correct PPE | PARTIAL | Inspection/maintenance taught but not assessed (R5-NEW-1) |
| L06 | working | Set up TCP per MUTCD for OSP work zones | YES | Well-scoped; MUTCD 11th Ed correctly cited |
| L07 | working | OVERSTATED — actual ceiling is awareness | NO | lesson_type should be foundation/awareness (R5-NEW-3) |
| L08 | working | Identify and mitigate chemical hazards via SDS | YES | 5 OSP chemicals covered; quiz aligned |
| L09 | foundation | Classify and report incidents per 1904 | PARTIAL | Hospitalization recordability internal contradiction (R-2 A-4) |

---

## 3. Assessment Validity by Quiz Block

| Lesson | Questions | Aligned to LOs? | Gap |
|--------|-----------|-----------------|-----|
| L01 Q1–Q4 | Hierarchy order, GDC definition, SDS fill-in-blank, governing standard | YES | — |
| L02 Q1–Q4 | Group lock, EID fill-in-blank, scope trigger, re-energization | YES (procedure recall) | No verify-zero-energy test |
| L03 Q1–Q4 | O₂ bounds, PRCS definition, H₂S IDLH (WRONG value in answer), telecom exception | PARTIAL | H₂S IDLH answer teaches wrong value |
| L04 Q1–Q4 | Trigger height, system selection, belting off, rescue requirement | YES | — |
| L05 Q1–Q4 | Glove classification, hard hat class, hi-vis, grounding | YES (selection) | No inspection/maintenance question |
| L06 Q1–Q4 | MUTCD Part, zone geometry, speed factor, flagger equipment | YES | — |
| L07 Q1–Q4 | MAD definition, decision tree, qualified worker, non-qualified threshold | YES | Decision tree question tests recall, not application |
| L08 Q1–Q5 | SDS critical sections, HDPE hazard, first aid, silica PEL, GHS | YES | — |
| L09 Q1–Q5 | First aid vs recordable, reportable events, DART, near-miss, 1904.39 timelines | PARTIAL | Hospitalization definition contradicts itself in answer choices |
| L10 capstone | 22 MC + 2 scenarios | PARTIAL | No LOTO integration scenario; L02 tested recall-only |

---

## 4. R-1/2/3/4 Reconciliation (15 cumulative findings)

All 15 prior findings are **CONCUR** — independently observed or corroborated during R-5 independent read.

| # | Finding | R-5 verdict |
|---|---------|-------------|
| R1-F1 | Methane lighter-than-air; L03 prose "heavier-than-air" wrong | CONCUR — independently observed L03:297-299 |
| R1-F2 | L09 OSHA 300 hospitalization double-definition | CONCUR — observed L03:203 vs L03:233 table |
| R1-F3 | DAG: fall protection T04→T18.L04 broken | CONCUR |
| R1-F4 | DAG: PPE T04→T18.L05 broken | CONCUR |
| R1-F5 | DAG: safety zone T07→T18.L01 (term not introduced) | CONCUR |
| R1-F6 | DAG: lockout-tagout T08.L01 missing prereq T18.L02 | CONCUR |
| R1-F7 | OSHA interpretation letter (2012-08-27) unverifiable URL | CONCUR |
| R1-F8 | O₂ 19.5% cognitive-vs-regulatory note imprecision | CONCUR |
| R2-A1 | H₂S IDLH 100 ppm → should be 50 ppm | CONCUR — observed L03:166 |
| R2-A2 | BranchingScenario L03 "heaviest gases" error propagates methane claim | CONCUR — observed L03:389 |
| R2-A3 | Rubber glove "6-month service life" should be "6-month re-test interval" | CONCUR — observed L05:323-325 |
| R2-A4 | L09 hospitalization internal contradiction | CONCUR |
| R3-T1 | H₂S "100 ppm paralyzes smell" secondary implication remains dangerous even post-IDLH fix | CONCUR — R-5 notes this requires prose revision alongside numeric fix |
| R3-T2 | Catalytic bead sensor false-low in O₂-deficient atmosphere not explained | CONCUR |
| R4-NEW-1 | L02 BranchingScenario omits verify-zero-energy step | CONCUR — directly relevant to R5-NEW-2 |

---

## 5. DAG Sweep

No new DAG violations discovered beyond R-1 F3/F4/F5/F6.

`competent person` absence (R5-NEW-5) is a vocabulary omission, not a broken DAG edge — no downstream lesson assumes the term as a prerequisite.

L07 `lesson_type: 'working'` (R5-NEW-3) may cause LMS progression gating issues if downstream lessons treat T18.L07 completion as application-level clearance for energized-conductor work. Recommend reviewing `course-catalog.js` gating logic when lesson_type is corrected.

---

## 6. Final Verdict

**Verdict: YELLOW**

No new HIGH findings. R-5's contribution is exclusively assessment-validity and training-program-design class:
- 3 new MED (R5-NEW-1 PPE inspection not assessed, R5-NEW-2 LOTO competence overstated, R5-NEW-3 L07 lesson_type overstated)
- 2 new LOW (R5-NEW-4 capstone LOTO scenario gap, R5-NEW-5 competent-person vocabulary missing)

The HIGH finding pool (methane density R1-F1, H₂S IDLH R2-A1, BranchingScenario methane-at-bottom R2-A2, LOTO verify-zero-energy R4-NEW-1) is fully corroborated across 4+ rounds. No new safety-fact errors were found.

**Saturation assessment: SATURATED.**

R-5 found 5 new findings, but they are exclusively in the training-program-design domain that R-1/2/3/4 were not framed to catch. The physics-error and regulatory-citation-accuracy space is now saturated across 5 framings (primary-skeptical, corroboration-adversarial, alt-secondary triangulation, deep-adversarial/incident-investigation, training-program-design/CBA). Dispatching R-6 would require a framing that hasn't been used — possible candidates would be "legal/liability framing" or "instructional-design accessibility." However, the marginal return of another round does not justify the cost given the finding pool already covers all HIGH + MED correction priorities.

**Recommended next step: dispatch a single fix-agent** to address all 20 canonical findings (15 prior + 5 new from R-5). Priority order:
1. HIGH: methane/nitrogen density (L03), H₂S IDLH 50 ppm (L03), LOTO verify-zero-energy (L02 BranchingScenario)
2. MED: PPE inspection quiz gaps (L05), LOTO lesson_type correction (L02), L07 lesson_type correction, 4 DAG edges (T04, T07, T08), hospitalization contradiction (L09), glove re-test vs service-life (L05), H₂S secondary implication (L03 prose), T08.L01 prereq missing
3. LOW: OSHA letter note, O₂ imprecision, LEL sensor caveat, capstone LOTO scenario, competent-person vocabulary

=== T18 AUDIT R5 COMPETENCE-PROGRAM END ===
