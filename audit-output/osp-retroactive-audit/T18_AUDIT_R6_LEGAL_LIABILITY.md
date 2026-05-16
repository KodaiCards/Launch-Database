# T18 Retroactive Audit R-6: Legal/Liability — Plaintiff's-Counsel Lens

**Topic:** T18 "Safety & OSHA" — `osp-training/src/lessons/T18/*.jsx`
**Framing:** Legal/liability — plaintiff's-counsel + OSHA general-duty-clause + civil negligence lens
**Auditor:** R-6 (independent pass; R-1/2/3/4/5 reports read AFTER independent analysis)
**Date:** 2026-05-16

---

## 1. Independent Findings (new — legal/liability class)

### R6-NEW-1 | MED | L03 H₂S IDLH Teaching Creates Plaintiff Exhibit: "Training Said 100 ppm Was the Danger Threshold"

**Location:** `L03-confined-space-entry.jsx` lines 291–295 (Advanced section) + L03 atmosphere table line 165

**Issue (legal lens):** L03's Advanced section teaches: "At 100 ppm it paralyzes your sense of smell." NIOSH and OSHA IDLH for H₂S is 50 ppm (29 CFR 1910.146 IDLH definition cross-referenced with NIOSH 1994 documentation). The atmosphere table correctly sets the exit threshold at `< 1 ppm` but the prose "100 ppm paralyzes smell" creates a cognitive anchor: a worker reading this might reasonably conclude "100 ppm is when things get dangerous — below that I'm okay because I can smell it."

**Plaintiff's argument (wrongful death scenario):** "Defendant's training stated the H₂S danger threshold was when smell became paralyzed at 100 ppm. Our decedent entered a vault at 60 ppm — below defendant's stated danger threshold. Defendant knew or should have known NIOSH IDLH is 50 ppm. The training created a false safety impression that caused the fatal entry decision."

This finding is corroborated by R-2's A-1 (H₂S IDLH 100→50 ppm) and R-3's T-1 (secondary implication of 100 ppm prose is dangerous even post-IDLH fix). The legal-liability dimension adds: the 100 ppm prose is a standalone civil liability exhibit even if the table is corrected, because a worker reads prose before tables.

**Fix shape:** Revise L03 Advanced section. Remove the 100 ppm olfactory note or immediately follow it with: "However — the H₂S IDLH is 50 ppm. You can smell H₂S at low concentrations, but olfactory fatigue begins well below the IDLH. Never rely on smell. Rely on your monitor."

---

### R6-NEW-2 | MED | L04 Free-Climb Teaching Creates Liability Gap: No "Safe Defaults" for Interrupted Climbing

**Location:** `L04-fall-protection-poles-aerial-lifts.jsx` lines 124–128 (foundations) + Advanced section lines 252–275

**Issue (legal lens):** L04 correctly teaches that 29 CFR 1910.268(g)(1) and OSHA's 2012 interpretation letter permit free-climbing to reach the work position. The lesson's current framing is: "free-climb permitted during ascent; fall protection required at the work position."

What L04 does NOT teach: what to do when climbing is interrupted before reaching the work position — e.g., a worker who stops mid-climb to answer a radio, rest, or look at a hardware problem. Under the 2012 interpretation letter, free-climb permission applies to movement. An interrupted climb at height where the worker pauses and performs any task — even "holding a tool to pass it to someone" — arguably converts the paused position into a work position requiring fall protection.

**Plaintiff's argument:** "Defendant's training said 'free climbing is permitted' without specifying that any pause or task at height converts the location to a work position. Decedent stopped to remove an obstruction at 25 feet without fall protection. Defendant's training did not teach this distinction."

**Fix shape:** Add to the Advanced section or Book vs. Field callout: "Free-climb permission covers continuous movement up the pole. If you pause to perform any task at height — even briefly — that position becomes a work position and fall protection must be applied before the task begins. 'Free climb' is not a license to work at any height without protection."

---

### R6-NEW-3 | MED | L07 "Informal Field Rule" Teaching Creates Assumed-Knowledge Gap + Civil Exposure

**Location:** `L07-working-near-energized-conductors.jsx` lines 187–199 (Book vs. Field callout)

**Issue (legal lens):** L07's Book vs. Field section describes the informal field norm for joint-use work: "I'm in the communication space, below the neutral — I don't touch anything above me." This is accurate field ethnography. However, the lesson then lists three specific failure modes where this rule breaks down: (a) deteriorated conductor insulation, (b) induced voltage on messenger, (c) down conductor energized at ground level.

The lesson does NOT teach workers how to assess whether conditions (a), (b), or (c) exist before relying on the "I'm in the communication space" informal rule. It names the failure modes but not the assessment procedure.

**Plaintiff's argument:** "Defendant's training taught employees that working near energized conductors in the communication space was acceptable per an 'informal field rule.' Defendant's training listed three conditions where that rule fails. However, defendant's training did not teach employees HOW to assess whether those conditions existed before applying the informal rule. Decedent was injured by condition (a) — deteriorated insulation — which the training taught was a known failure mode but provided no inspection guidance for."

**Fix shape:** Add a brief "how to spot the three failure modes" checklist after the failure-mode list: (a) visual conductor insulation inspection from the climb approach; (b) test messenger with ground-rod voltage tester before cutting (already in the induced voltage section of L07 Advanced — cross-reference it here); (c) look for downed or sagged conductors before pole approach. Three sentences. No new knowledge required — just connecting the warning to the detection method.

---

### R6-NEW-4 | MED | L09 Hospitalization Table Contradicts Itself — OSHA 1904.39 Misstatement With Regulatory Exposure

**Location:** `L09-incident-reporting-osha-300.jsx` lines 232–238 (severe incident table) + L09 flashcard `T18-L09-fc-severe`

**Issue (legal/regulatory accuracy):** The L09 table at lines 232–238 says:
- "In-patient hospitalization (for treatment, not observation)" → 24-hour report

The flashcard `T18-L09-fc-severe` says:
- "In-patient hospitalization, amputation, or loss of an eye: report to OSHA within 24 hours."

29 CFR 1904.39(a)(3) current text (post-2016 revision): "You must report the in-patient hospitalization of one or more employees." The regulation does NOT include the "for treatment, not observation" qualifier in the current text — that language was in a pre-2016 proposed rule comment but was NOT adopted. The current rule requires reporting any in-patient hospitalization.

**Plaintiff's argument:** "Defendant's training stated that hospitalization 'for observation only' was not a reportable event. An employee was admitted for overnight observation after a workplace accident. Defendant failed to report within 24 hours as required by 29 CFR 1904.39. Defendant's training misstated the rule and caused the reporting failure."

**Regulatory risk:** If Carter's firm trained workers using this language and then failed to report an observation-stay hospitalization on the grounds that "it was observation only," OSHA would cite the reporting failure AND the inadequate training as separate violations.

**Fix shape:** Remove "for treatment, not observation" qualifier from the table and flashcard. Replace with: "Any in-patient hospitalization — whether for treatment or observation — triggers the 24-hour reporting requirement per 29 CFR 1904.39(a)(3)." This is also a previously flagged finding (R2-A4 + R1-F2) — the legal-liability framing adds that the wrong language creates downstream regulatory exposure, not just a quiz-answer error.

---

### R6-NEW-5 | LOW | LOTO BranchingScenario Scenario Teaches Incorrect Sequence Ordering in Step 2

**Location:** `L02-lockout-tagout-loto.jsx` BranchingScenario, node `step2`

**Issue (legal lens):** The `step2` node asks "Are there other energy sources to identify?" and presents two choices — one noting "just one DC circuit" and one noting "check for stored energy too." The `isOptimal: false` path (just one circuit) is annotated: "Watch out: some EDFA shelves carry fiber-side optical power." The node then routes BOTH paths to `step3` (apply lockout) — meaning a learner who misses the stored-energy check proceeds directly to applying the lock without being corrected on the stored-energy identification requirement from 29 CFR 1910.147(d)(2) ("identify and isolate all energy sources").

The problem: per 1910.147(d), Step 2 is "identify ALL energy sources." Stored energy (capacitors) is an energy source that must be identified at Step 2, before applying the lock at Step 4. A learner who takes the non-optimal path learns "the lock protects you; stored energy is released later" — which is the correct sequence — but they did NOT identify the stored energy at Step 2 as required.

**Plaintiff's argument:** "Defendant's LOTO training allowed a learner path through the BranchingScenario that did not require identification of stored energy sources before applying the lockout device. A worker trained by this curriculum identified only the primary circuit breaker, applied the lock, and was then injured by stored capacitive energy. Defendant's interactive training specifically permitted this error path to conclude at the lockout step without correction."

**Fix shape:** In `step2`, the non-optimal path (`wrong-start` branch text for missing stored energy) should end at a corrective `isEnd: true` node that requires learner to restart from `step2` after the correction — not route silently to `step3`. This makes the error instructive rather than permissive.

---

### R6-NEW-6 | LOW | L05 Glove Re-Test Language Creates Assumed Compliance Claim

**Location:** `L05-ppe-hands-head-eyes-feet.jsx` lines 319–325 (Advanced section)

**Issue (legal lens):** L05 states: "Gloves have a service life of 6 months from the date they're put into service; re-test and re-certification is required after 6 months per ASTM D120."

This is partially correct but legally imprecise in a way that creates employer liability:
- ASTM D120 requires re-testing at 6 months from the date of last test (not from date of first use)
- The distinction matters: gloves in a storeroom unused for 18 months since last test are due for re-test; gloves put into service 3 months ago from a 12-month-old test lot are ALSO overdue

**Plaintiff's argument:** "Defendant's training stated gloves require re-testing 'after 6 months from the date they're put into service.' Decedent's gloves had been in service for 4 months but had not been re-tested since they were manufactured 14 months earlier. Defendant's training taught employees that 6 months from first use was the compliance standard, causing them to believe gloves were in compliance when they were not. Defendant's training created a false compliance assumption."

This finding corroborates R-2 A-3 (rubber glove "6-month service life" should be "6-month re-test interval") and adds the plaintiff's-counsel framing.

**Fix shape:** "Rubber insulating gloves must be re-tested every 6 months from the date of last test — not from the date first put into service. Gloves sitting in storage since their factory test are already accruing time against the 6-month clock. Always check the 'last tested' label on the glove cuff before use."

---

## 2. Plaintiff's-Counsel Walk-Through — Two Hypothetical Scenarios

### Scenario A: H₂S Confined Space Fatality

**Facts (hypothetical):** Worker enters a telecom vault adjacent to a sewer main. Pre-entry gas monitor reads 0.5 ppm H₂S (within the L03 table's `< 1 ppm` threshold). During work, sewer main cracks and H₂S rises to 65 ppm. Worker does not exit because (a) the monitor alarm threshold was set at 100 ppm by company procedure, and (b) the worker recalled training stating "100 ppm paralyzes the sense of smell" — implying anything below 100 ppm was in a recognizable hazard range. Worker loses consciousness at 65 ppm and dies.

**Plaintiff's case from T18 curriculum:**
1. L03 Advanced states "At around 100 ppm it paralyzes your sense of smell" (line 293) — plaintiff argues this taught 100 ppm as the danger threshold. **R6-NEW-1.**
2. The atmosphere table correctly states `< 1 ppm` as the safe entry limit — but plaintiff argues the 100 ppm prose contradicts the table and caused the worker to set monitor alarm at 100 ppm per "training."
3. Actual H₂S IDLH is 50 ppm per NIOSH/OSHA — worker was above IDLH and not warned to exit. **R2-A1** (IDLH error in L03 flashcard/table).
4. The attendant training does not explicitly cover "attendant initiates immediate rescue/evacuation when monitor reads above IDLH" — it says "initiate rescue procedures if a hazard develops" but does not define the IDLH trigger level precisely.

**Plaintiff's standard from 29 CFR 1926.21(b)(2):** "The employer shall instruct each employee in the recognition and avoidance of unsafe conditions." The 100 ppm prose trained the employee to recognize 100 ppm as the danger threshold rather than 50 ppm.

### Scenario B: LOTO Electrocution in Fiber Hut

**Facts (hypothetical):** Worker performs LOTO on a 48V DC battery rack following the procedure taught in L02. Worker locks the circuit breaker, then immediately begins servicing the power supply module. Worker does not release or verify stored energy (capacitors). Worker receives an arc from a capacitor discharge. Injury is serious (flash burns, hand amputation).

**Plaintiff's case from T18 curriculum:**
1. L02 BranchingScenario routes both paths at `step2` to `step3` without requiring the learner to identify stored energy as a separate energy source that must be isolated. **R6-NEW-5.**
2. The 6-step LOTO sequence is described in L02 prose (lines 107–141), but Step 6 is "Release or restrain stored energy. Bleed hydraulic pressure, discharge capacitors to ground. Then verify." The BranchingScenario does not give the learner the opportunity to execute this step before reaching `step5-end` (cleared to work). **R5-NEW-2 + R4-NEW-1.**
3. Plaintiff argues: "Defendant's interactive scenario simulation — the primary competency-building exercise for this safety procedure — never required learners to demonstrate stored-energy release or zero-energy verification. The scenario declared the learner 'cleared to work' after applying the lock, omitting the two steps most protective against capacitive injury."

---

## 3. R-1/2/3/4/5 Reconciliation (20 cumulative findings)

| # | Finding | R-6 Verdict | Legal-liability dimension |
|---|---------|-------------|--------------------------|
| R1-F1 | Methane lighter-than-air; L03 "heavier-than-air" wrong | CONCUR | R6 legal: "training taught methane accumulates at the bottom where workers crouch — worker stayed low in a methane-filled space" plaintiff argument. |
| R1-F2 | L09 OSHA 300 hospitalization double-definition | CONCUR | Elevated to R6-NEW-4 — the "observation only" qualifier is a standalone regulatory violation risk, not just a quiz error. |
| R1-F3 | DAG: fall protection T04→T18.L04 broken | CONCUR | No new legal dimension beyond what prior rounds documented. |
| R1-F4 | DAG: PPE T04→T18.L05 broken | CONCUR | No new legal dimension. |
| R1-F5 | DAG: safety zone T07→T18.L01 | CONCUR | No new legal dimension. |
| R1-F6 | DAG: T08.L01 missing prereq T18.L02 | CONCUR | Legal: workers using splice tools (T08) without LOTO training (T18.L02) creates employer-liability gap if powered equipment is encountered. |
| R1-F7 | OSHA 2012-08-27 interpretation letter URL unverifiable | CONCUR | Legal: unverifiable citations in training materials are plaintiff exhibit "defendant couldn't verify its own training sources." |
| R1-F8 | O₂ imprecision note | CONCUR — minor | Low civil exposure. |
| R2-A1 | H₂S IDLH 100→50 ppm | CONCUR | Already captured in R6-NEW-1. Critical legal finding — highest civil exposure in the curriculum. |
| R2-A2 | BranchingScenario "heaviest gases" error | CONCUR | Legal: "training taught methane sinks to where workers crouch." Plaintiff-counsel exhibit if worker injury in low-position work in methane-present space. |
| R2-A3 | Rubber glove "service life" vs "re-test interval" | CONCUR | Elevated in R6-NEW-6 with legal dimension. |
| R2-A4 | L09 hospitalization contradiction | CONCUR | Same as R1-F2 / R6-NEW-4. |
| R3-T1 | H₂S 100 ppm prose dangerous even post-IDLH fix | CONCUR | Directly supports R6-NEW-1. Both the table AND the prose need revision. |
| R3-T2 | Catalytic bead sensor false-low in O₂-deficient atmosphere | CONCUR | Legal: "training did not teach that the gas monitor may give false-safe readings in O₂-deficient conditions." High plaintiff-counsel value — sensor reads 0% LEL when in fact methane is present above LEL if O₂ depleted. |
| R4-NEW-1 | L02 BranchingScenario omits verify-zero-energy | CONCUR | Directly supports R6-NEW-5. Combined: LOTO scenario both omits stored-energy ID (step2) and verify-zero-energy (step5). |
| R5-NEW-1 | PPE inspection competency not assessed | CONCUR | Legal: employer's training record shows workers "trained" on glove use but no documented competency assessment of inspection procedure. Post-incident OSHA inspection will request training records. |
| R5-NEW-2 | L02 LOTO lesson_type overstated | CONCUR | Legal: lesson_type 'working' creates employer defense claim "we trained to working level." If LOTO procedure incomplete (R4-NEW-1 + R6-NEW-5), that claim is false and could constitute training-record fraud in a regulatory context. |
| R5-NEW-3 | L07 lesson_type overstated | CONCUR | Legal: same issue — lesson_type 'working' for an awareness-level lesson overstates employer's training record for energized conductor work. |
| R5-NEW-4 | Capstone lacks LOTO integration scenario | CONCUR | Legal: capstone is the employer's competency certification record. Without application-level LOTO scenario, the capstone does not certify the procedure. |
| R5-NEW-5 | "Competent person" vocabulary missing | CONCUR | Legal: gap in OSHA enforcement vocabulary — workers cannot understand or respond to OSHA citations using this term. |

---

## 4. DAG Sweep

No new DAG violations found beyond the four documented in R-1/R-5. Legal-liability dimension on existing DAG gaps:

**R1-F6 (T08.L01 missing T18.L02 prereq) — highest civil exposure of the four DAG gaps.** Splice work (T08) involves powered splice shelves, generator-fed huts, and battery racks. A T08 worker who has not completed T18.L02 (LOTO) can proceed to splice-work lessons that reference energized equipment without LOTO qualification. If injury occurs, the employer cannot demonstrate the LOTO training prerequisite was enforced before field deployment.

---

## 5. Final Verdict: RED

**Severity assignment:**
- 4 MED (R6-NEW-1, R6-NEW-2, R6-NEW-3, R6-NEW-4)
- 2 LOW (R6-NEW-5, R6-NEW-6)
- 0 new HIGH

**Cumulative pool: 26 items** (20 prior + 6 new)

**Why RED despite no new HIGH:** The overall cumulative pool contains 4 HIGHs (methane density, H₂S IDLH, BranchingScenario methane-at-bottom, LOTO verify-zero-energy) that have not been fixed. The legal-liability framing establishes that three of those four HIGHs represent standalone plaintiff's-counsel exhibits in hypothetical worker-injury litigation. An unfixed H₂S IDLH value (100 ppm vs. 50 ppm) in a safety training curriculum is not merely a factual error — it is a documented training deficiency that creates civil liability exposure for the employer. The curriculum in its current state should not be marked complete or deployed for actual field-crew onboarding until the HIGH + MED pool is addressed.

**Saturation recommendation: SATURATED.**

R-6 found 6 new findings, but they are all extensions or legal-dimension elevations of prior round findings rather than wholly new factual errors. The physics and regulatory accuracy space has been comprehensively covered across six distinct framings. The marginal return of R-7 in any available framing (instructional design / accessibility / specific-citation line-by-line) would likely yield zero new HIGHs and 1–2 LOW duplicates. The finding pool is complete.

**Recommended next step:** Dispatch single fix-agent against the consolidated 26-item canonical list. Priority:
1. HIGH (4 items): methane density, H₂S IDLH 50 ppm + prose revision, LOTO verify-zero-energy + step2 stored-energy ID, BranchingScenario methane correction
2. MED (10 items): R6-NEW-1 through R6-NEW-4, R5-NEW-1/2/3, hospitalization "observation" qualifier (R1-F2/R2-A4), glove re-test vs service-life (R2-A3), H₂S secondary prose (R3-T1)
3. LOW (12 items): sensor caveat (R3-T2), R6-NEW-5/6, R5-NEW-4/5, DAG edges, OSHA letter URL note, O₂ imprecision

=== T18 AUDIT R6 LEGAL-LIABILITY END ===
