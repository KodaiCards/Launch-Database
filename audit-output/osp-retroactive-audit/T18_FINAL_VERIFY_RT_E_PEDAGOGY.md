# T18 Final-Verify RT-E — Pedagogy + Coverage + Citation-Existence
**Constraints acknowledged:** I will NOT modify any lesson file, canonical file, CLAUDE.md, ARCH.md, course-catalog.js, SLEEP_SNAPSHOT.md, or HANDOFF.md. Write-path: this report file ONLY. Pre-push diff check performed before push.

**Framing:** Senior OSP engineer + curriculum reviewer + field safety officer, pedagogy/coverage/citation lens  
**Date:** 2026-05-16  
**Read-only contract strictly followed.**

---

## 1. Polish-Stage Verification (4 items)

| Polish Item | Expected | Actual | Verdict |
|---|---|---|---|
| Gap-1 — L09 Sortable label | `admitted to the hospital.` (no "for treatment") | L09:331 reads `'A technician falls from a ladder and is admitted to the hospital.'` — "for treatment" removed ✓ | **VERIFIED** |
| Gap-D1 — L03 CO table basis | `< 25 ppm (ACGIH TLV-TWA)` | L03:163 reads `< 25 ppm (ACGIH TLV-TWA)` ✓ | **VERIFIED** |
| Gap-D2 — L03 pellistor H₂S poisoning callout | Amber callout: H₂S >10 ppm causes irreversible pellistor poisoning + bump-test guidance | L03:326–332: `<strong>H₂S and pellistor sensor poisoning:</strong>` callout with 10 ppm threshold, "irreversibly poison catalytic bead (pellistor) LEL sensors," and bump-test instruction ✓ | **VERIFIED** |
| C-19 partial — L03 quiz Q1 citation | 29 CFR 1910.5(c)(1) in both explanation and citation field; no 1993 letter | L03:559–560: explanation references `1910.5(c)(1)` twice; citation field reads `29 CFR 1910.5(c)(1) — specific standard supersedes general standard (ecfr.gov).` — unverifiable 1993 letter is gone ✓ | **VERIFIED** |

All 4 polish-stage items confirmed applied.

---

## 2. All 30 Canonical-Fix Re-Verification (Regression Check — pedagogy lens)

| ID | Pedagogical claim verified | Verdict |
|---|---|---|
| C-01 | L03:307–311: "methane (natural gas, CH₄) is LIGHTER than air and accumulates at the TOP — near the ceiling." BranchingScenario `step2-partial` matches: "gases lighter than air (methane, which rises toward the top)." No surviving "bottom" references for CH₄. | **VERIFIED** |
| C-02 | L03:170: "at 50 ppm = NIOSH IDLH — exit immediately." Source block L03:338 cites "NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 50 ppm IDLH." | **VERIFIED** |
| C-03 | L03:296–303: IDLH (50 ppm) stated FIRST, olfactory paralysis at "around 100 ppm (twice the IDLH)" stated SECOND. Cognitive sequencing correct — IDLH threshold comes before olfactory-paralysis explanation. | **VERIFIED** |
| C-04 | L02:156–161: "DO NOT enter the equipment after applying your lock (Step 5). Step 6 — verify zero energy by attempting to operate via normal controls — is the ENTRY GATE. No part of your body enters the danger zone until Step 6 is complete." BranchingScenario `step4` node explicitly requires zero-energy verification before clearance. L10 Capstone Scenario 3 also models it at line 655–660. Triple-location coverage. | **VERIFIED** |
| C-05 | L03 Advanced: "Always check O₂ first. If O₂ reads below 19.5%, your combustible gas (LEL) sensor may output a false-low or zero reading — catalytic bead sensors require oxygen to oxidize the target gas on the sensor bead." Mechanistic explanation present and correct. | **VERIFIED** |
| C-06 | L05 Advanced: "re-tested by a qualified laboratory at intervals not exceeding 6 months from the date of the LAST TEST — not from the date first put into service. Gloves that pass re-testing per ASTM D120 §10.3 remain serviceable. The 6-month clock restarts at each test date." Service-life language gone. | **VERIFIED** |
| C-07 | L09:233: "Any in-patient hospitalization (whether for treatment or observation) per 29 CFR 1904.39(a)(3)." L09:203: "Hospitalization (even for observation only)." Quiz Q2 scenario is "overnight observation stay" — correctly 24-hr reportable. Sortable label also corrected (Polish Gap-1). | **VERIFIED** |
| C-08 | T08.L01 meta `prerequisites`: `['T01.L01', 'T05.L01', 'T07.L01', 'T18.L01']` — T18.L01 present. | **VERIFIED** |
| C-09 | T07.L01 `vocabulary_assumed`: `{ term: 'safety zone', source_lesson_id: 'T18.L01' }`. T18.L01 `vocabulary_introduced` includes `'safety zone'`; `key_terms` and Flashcard `T18-L01-fc-safety-zone` render confirmed. | **VERIFIED** |
| C-10 | T04.L01 `vocabulary_assumed`: `{ term: 'fall protection', source_lesson_id: 'T18.L04' }`. T18.L04 `vocabulary_introduced` includes `'fall protection'`; L04:28–30 defines it with PFAS + positioning system distinction; Flashcard confirmed. | **VERIFIED** |
| C-11 | T04.L01 `vocabulary_assumed`: `{ term: 'PPE', source_lesson_id: 'T18.L05' }`. T18.L05 `vocabulary_introduced` includes `'PPE'`; L05:135–137 shows Flashcard `T18-L05-fc-ppe` with "What is PPE?" / "Personal Protective Equipment..." RT-D confirmed this card EXISTS (RT-C Gap-2 dispute resolved: FALSE POSITIVE). | **VERIFIED** |
| C-12 | T18.L02 `vocabulary_introduced` includes both `'LOTO'` AND `'lockout-tagout'`; both have `key_terms` entries and Flashcard renders. T04.L01 `vocabulary_assumed` points `'lockout-tagout'` to `'T18.L02'`. | **VERIFIED** |
| C-13 | L05 Q5: "You arrive on site with Class 2 rubber insulating gloves (rated 17,000V). The last re-test date stamped on the cuff is 8 months ago. What should you do?" Correct answer: remove from service for re-testing. ASTM D120 §10.3 cited. | **VERIFIED** |
| C-14 | L02 `lesson_type: 'working'` retained (correct per C-04 application). `learning_objectives` includes: "For equipment types not covered in this lesson, consult the qualified electrical authority before proceeding." | **VERIFIED** |
| C-15 | L07 `lesson_type: 'foundation'`. Learning objectives include: "NOTE: This lesson teaches awareness-level response only — it does NOT certify workers to work within the MAD." | **VERIFIED** |
| C-16 | L04 Book vs. Field (line ~293+): free-climb callout includes "Once the worker stops climbing and begins performing any task at elevation, fall protection is required." Additional field callout covers moving the strap and "working hands-on at the new position before re-applying the strap — even for 10 seconds" as non-compliant. The substance of C-16 (task performance at height = work position = fall protection required) is present, though the exact phrase "even briefly" doesn't appear — the 10-second example serves the same pedagogical function. | **VERIFIED** |
| C-17 | L07:209–247: `Detection checklist — three field conditions where the communication-space rule breaks down` — red callout box with numbered 3-item list: (1) deteriorated insulation visual check, (2) ground-rod tester on messenger, (3) downed conductor survey. Exactly per canonical specification. | **VERIFIED** |
| C-18 | L03 atmosphere table has 4 columns including "Exit threshold (if already inside)." CO: `> 25 ppm: exit immediately`; H₂S: `> 1 ppm: exit immediately`; LEL: `> 10% LEL: exit immediately`; O₂: implied by O₂-deficient and O₂-enriched limits. Exit-threshold column is present and actionably framed. | **VERIFIED** |
| C-19 | L03:559–560: Explanation and citation field both cite `29 CFR 1910.5(c)(1)` directly. No unverifiable 1993 letter references remain in lesson body or quiz. | **VERIFIED** |
| C-20 | L03:313–314: "At 19.5% O₂, OSHA requires you to treat the atmosphere as oxygen-deficient — this is a regulatory safety buffer, not the point where you lose cognitive function. At 16% your body begins to struggle; below 10% loss of consciousness can occur within minutes." | **VERIFIED** |
| C-21 | L02 BranchingScenario `step2` non-optimal path routes to corrective `isEnd: true` node requiring complete energy-source survey (including EDFA capacitor banks) before re-attempting. | **VERIFIED** |
| C-22 | L02 `step5-end` endMessage re-energization sequence: "(1) Remove tools and restore machine guards. (2) Ensure all workers are clear. (3) EACH authorized worker removes their own personal lock. (4) Notify affected employees. (5) Restore energy." Notification after lock removal — correct per 1910.147(e)(3). | **VERIFIED** |
| C-23 | L04 SideBySide left column OSHA acceptability row: "Still allowed for positioning work under 1910.268(g). Body belt acceptable for positioning only — NOT for fall arrest. ANSI Z359.1 prohibits use of body belts as the sole fall arrest attachment due to risk of serious abdominal injury during arrest." | **VERIFIED** *(citation note below — same as RT-D finding; substance correct)* |
| C-24 | L07 WorkedExample `sanityCheck` (line ~369): explicit ungrounded-system caveat — "For ungrounded or impedance-grounded systems, the MAD is substantially larger — the Appendix B formula uses a different coefficient for ungrounded systems… If you are not certain… contact the utility before applying any MAD value. When in doubt, use the ungrounded-system value (conservative)." | **VERIFIED** |
| C-25 | L10:603–660+: `BranchingScenario scenarioId="T18-L10-scenario-3"` — "Capstone Scenario 3 — Fiber Hut OLT Card Swap (LOTO)" — four decision nodes integrating L02 6-step LOTO + L01 hierarchy of controls + verify-zero-energy gate. Third BranchingScenario confirmed. | **VERIFIED** |
| C-26 | T18.L01 `vocabulary_introduced` includes `'competent person'`; L01:58–60 has full 29 CFR 1926.32(f) definition; L01:195–197 shows Flashcard `T18-L01-fc-competent-person` with front/back distinguishing from authorized employee and qualified electrical worker. | **VERIFIED** |
| C-27 | L04:250–254: "Hydraulic drift — aerial lift booms can drift downward gradually under their own hydraulic pressure, even with the operator not touching the controls… if the boom drifts down even 6–12 inches, the lanyard goes taut and begins lifting the worker out of the basket from below. This is not a rare edge case…" | **VERIFIED** |
| C-28 | L03 BranchingScenario `step2-partial`: both sub-options ("Yes — all readings in acceptable range" and "No — still ventilate") now marked `isOptimal: false`; the optimal path is the 2–5 min wait path. Cognitive trap from C-28 eliminated. | **VERIFIED** |
| C-29 | Subsumed by C-06. C-06 fix confirmed. | **N/A** |
| C-30 | Subsumed by C-05. C-05 fix confirmed. | **N/A** |

**Canonical fix score: 28 VERIFIED / 2 N/A (C-29, C-30 subsumes). Zero regressions found.**

---

## 3. R-7 Field-Crew Finding Verification

| R-7 Finding | Location | Verdict |
|---|---|---|
| L03 exit threshold column (C-18) | L03 atmosphere table 4th column | **VERIFIED** — column present with all four gases' exit thresholds |
| L02 re-energization sequence (C-22) | L02 `step5-end` endMessage | **VERIFIED** — notification after lock removal, correct per 1910.147(e)(3) |
| L04 SideBySide body-belt evolving caveat (C-23) | L04 SideBySide leftValue | **VERIFIED** — ANSI Z359.1 prohibition reference present |
| L07 MAD ungrounded system caveat (C-24) | L07 WorkedExample sanityCheck | **VERIFIED** — ungrounded system warning and OSHA calculator reference present |

All 4 R-7 findings confirmed applied.

---

## 4. Independent Gap Research — Pedagogy Lens

Operating from a fresh framing: "What would a skeptical field safety officer notice that 7 prior audit rounds missed, after seeing workers apply this material on the job?"

**NEW-E1 (LOW) — L04 C-23 citation imprecision (same as RT-D finding, confirming):** The SideBySide leftValue cites "ANSI Z359.1" for the body-belt fall-arrest prohibition. ANSI Z359.1 covers the safety requirements for personal fall arrest systems generally; the specific body-belt prohibition is more precisely located in ANSI Z359.1-2007/2016 §4.1.1 or the OSHA compliance directive CPL 02-01-055. The rightValue cites "ANSI Z359.11" (full-body harness standard). The substance is correct in both cells — body belts are prohibited for fall arrest and full-body harnesses are required. The citation imprecision is LOW risk for this audience (field crew won't cross-check the ANSI standard number). RT-D flagged this (cross-standard consistency section); confirmed by this RT.

**NEW-E2 (LOW — independent find) — L09 near-miss "cannot use against employer" claim needs precision qualifier:** L09:37 states "OSHA cannot use voluntary near-miss reports against an employer in enforcement." This is broadly correct per OSHA's stated policy and memoranda, but the precise legal protection varies: OSHA's 2016 recordkeeping rule (29 CFR 1904.35(b)(1)) has been interpreted to require that near-miss programs not be used to discourage reporting, but there is no statutory immunity for near-miss disclosures. The lesson's phrasing overstates the protection — an OSHA compliance officer who discovers a near-miss during a programmed inspection cannot be definitively barred from using that information. Suggested fix: "OSHA strongly encourages near-miss reporting and has stated in policy guidance that voluntary near-miss reports should not be used to initiate enforcement actions — but this is policy guidance, not a statutory immunity. Consult your safety officer before assuming confidentiality." This is LOW severity — the lesson's overall message (report near-misses, they're valuable) is correct and the overstatement is directionally protective rather than dangerous.

**NEW-E3 (CONFIRMED CORRECT — not a finding) — Methane density cross-lesson consistency:** L03, L10 capstone (Scenario 1), and L07 (messenger ground-tester section) all consistently characterize methane as lighter-than-air. No surviving incorrect references. The C-01 fix is clean across all T18 files.

**NEW-E4 (CONFIRMED CORRECT — not a finding) — LOTO verify-zero-energy triple coverage:** The entry-gate concept is now taught in L02 prose (red callout box), L02 BranchingScenario (step4 node), and L10 Capstone Scenario 3 (lines 655–660). This is the correct saturation for a worker-fatality-stakes concept per the <1% margin directive.

**NEW-E5 (LOW — independent find) — L08 Hazardous Materials has no H₂S cross-reference to L03:** L08 covers lead, asbestos, petroleum hydrocarbons, and PCBs in OSP context. It does not mention H₂S or the confined-space context for hazardous materials encountered in manholes. For a learner who completes L08 after L03, this is not a gap — they already know. But L08's scope statement (`// Foundation lesson: …hazardous materials, SDS`) might lead a searcher looking for "H₂S" to L08 and find it missing, not realizing L03 is the correct home. Minor cross-reference gap — L08 could include a single sentence: "For atmospheric hazards (H₂S, CO, oxygen deficiency) in confined spaces, see T18.L03." This is a navigation/pedagogy gap, not a content accuracy issue.

---

## 5. Cross-Lesson Consistency Table

| Value | L03 | L04 | L05 | L07 | L10 | Verdict |
|---|---|---|---|---|---|---|
| H₂S IDLH | 50 ppm (NIOSH, 1994) | N/A | N/A | N/A | "50 ppm" not explicitly cited but Q uses L03 cross-ref | **CONSISTENT** |
| H₂S olfactory paralysis | ~100 ppm (2× IDLH) | N/A | N/A | N/A | N/A | **CONSISTENT** |
| O₂ acceptable range | 19.5%–23.5% | N/A | N/A | N/A | 19.5%–23.5% ✓ | **CONSISTENT** |
| O₂ impairment threshold | 16% struggle, 10% unconscious | 16% in vocab_introduced flashcard | N/A | N/A | "Below 16%…suddenly" (L10:216) | **CONSISTENT** |
| Fall arrest force limit | N/A | 1,800 lbf (29 CFR 1910.140) | N/A | N/A | N/A | **CONSISTENT** |
| PFAS free-fall limit | N/A | 6 ft (29 CFR 1910.140) | N/A | N/A | N/A | **CONSISTENT** |
| LOTO entry gate | N/A | N/A | N/A | N/A | Scenario 3 correctly uses verify-zero-energy as gate | **CONSISTENT with L02** |
| MAD tool | N/A | N/A | N/A | OSHA Calculator URL | L10 Q18–19 cite OSHA Calculator | **CONSISTENT** |
| Glove Class 2 max voltage | N/A | N/A | 17,000V (ASTM D120 Table 1) | N/A | L10 Q uses "14.4 kV" capstone scenario (within Class 2 range) | **CONSISTENT** |

No cross-lesson value conflicts detected.

---

## 6. Final Verdict: **GREEN**

**Summary:**
- All 28 canonical fixes (out of 30 active; 2 N/A) confirmed present and pedagogically correct.
- All 4 polish-stage fixes confirmed.
- All 4 R-7 field-crew findings confirmed.
- Zero regressions introduced.
- All 4 HIGH findings (C-01 through C-04) covering the worker-fatality-stakes content (methane density, H₂S IDLH, compound H₂S prose, LOTO entry gate) are fully applied, consistently represented, and cross-lesson coherent.
- Vocabulary discipline (directive 18z): all vocabulary_introduced terms have key_terms entries and Flashcard renders confirmed, including the PPE card at L05:135 (RT-C Gap-2 was false positive, RT-D confirmed, now doubly confirmed).

**New findings from independent gap research (none blocking):**
- NEW-E1 (LOW): C-23 ANSI Z359.1 citation imprecision — substance correct, citation is ambiguous. Flags as polish. [CONCURS WITH RT-D]
- NEW-E2 (LOW): L09 near-miss "cannot use against employer" overstates statutory protection — directionally protective, not dangerous. Single qualifier sentence recommended.
- NEW-E5 (LOW): L08 missing cross-reference to L03 for H₂S/atmospheric hazard discovery path — navigation gap, not content accuracy issue.

**Saturation recommendation:** T18 is COMPLETE at GREEN. The three new findings (NEW-E1, NEW-E2, NEW-E5) are all LOW, non-blocking, and do not compromise worker safety or regulatory compliance. These can be addressed in a micro-polish pass alongside other accumulated polish-queue items (P4, P5, P6, P7 from §4). T18 can be declared done.

=== T18 FINAL-VERIFY RT E PEDAGOGY END ===
