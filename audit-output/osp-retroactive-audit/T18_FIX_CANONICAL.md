# T18 Fix Canonical — Consolidated from Audits R-1 through R-7

**Date:** 2026-05-16  
**Source:** 7 sequential retroactive audit rounds (R-1 primary-skeptical, R-2 corroboration-adversarial, R-3 triangulation, R-4 deep-adversarial/incident-investigation, R-5 training-program-design/CBA, R-6 legal/liability, R-7 field-crew usability)  
**Total findings:** 30 (4 HIGH · 16 MED · 10 LOW)  
**Saturation:** Declared after R-7. HIGH pool is saturated (4 rounds with no new HIGHs). Dispatch fix wave now.  

---

## PRIORITY 1 — HIGH (must fix before any content goes live)

### C-01 | HIGH | L03 — Methane "heavier-than-air" factual error (dual-location: prose + BranchingScenario)

**Files:** `L03-confined-space-entry.jsx` lines 297–299 (prose) + line 389 (BranchingScenario node text)  
**Error:** "methane, carbon dioxide, and nitrogen are all heavier-than-air gases that can accumulate at the bottom of a manhole." CH₄ (MW=16 g/mol) and N₂ (MW=28 g/mol) are both lighter than air (MW≈29 g/mol). Only CO₂ (MW=44) sinks to the bottom. Methane accumulates at the TOP of enclosed spaces.  
**Field hazard:** Workers taught this will test only at floor level and miss an ignitable methane layer near the ceiling.  
**Fix:** (a) Prose fix at L03:297-299: "Carbon dioxide and heavier gases accumulate at the bottom of a manhole. Methane (natural gas) is LIGHTER than air — it accumulates at the TOP of the space near the ceiling. This is why you test at multiple heights." (b) BranchingScenario fix at L03:389: Update "heaviest gases (which accumulate at the bottom)" → correct to match — "gases denser than air (like CO₂) that settle at the bottom."  
**Confirmed by:** R-1, R-2, R-3, R-4, R-5 (5 independent confirmations)

---

### C-02 | HIGH | L03 — H₂S IDLH stated as 100 ppm; correct value is 50 ppm

**Files:** `L03-confined-space-entry.jsx` atmospheric table (approx line 166)  
**Error:** Table says H₂S IDLH = 100 ppm. NIOSH IDLH for H₂S (CAS 7783-06-4, revised 1994) = 50 ppm. OSHA 29 CFR 1910.146 App B uses NIOSH IDLH as the definitional standard.  
**Field hazard (documented):** Workers trained with 100 ppm IDLH may remain in spaces at 60-80 ppm believing they are below the danger threshold, when they are already at 1.2–1.6× the actual IDLH. CSB and OSHA FACE reports document this exact fatal mechanism.  
**Fix:** Change table IDLH value to 50 ppm. Also see C-03 for required prose fix at the 100 ppm olfactory-paralysis sentence.  
**Confirmed by:** R-2 (independent find), R-3, R-4, R-5, R-6 (5 independent confirmations)

---

### C-03 | HIGH | L03 — H₂S compound prose: "100 ppm paralyzes smell" creates false-safety anchor above the IDLH

**Files:** `L03-confined-space-entry.jsx` lines 291–294 (Advanced section)  
**Error:** The prose correctly states olfactory paralysis occurs at ~100 ppm, BUT after correcting the IDLH table to 50 ppm (C-02), this sentence creates a compound cognitive trap: "100 ppm = olfactory paralysis" while IDLH = 50 ppm means workers who can still smell something may incorrectly believe they are below the danger threshold.  
**Fix:** Resequence the prose: "H₂S IDLH is 50 ppm — leave immediately at 50 ppm. At around 100 ppm (2× the IDLH), olfactory fatigue completely disables smell — meaning a worker who has been at 50–100 ppm for any duration loses the ability to detect further H₂S buildup. Monitors detect what noses cannot. Never rely on smell for H₂S."  
**Confirmed by:** R-3 (independent find), R-4, R-5, R-6

---

### C-04 | HIGH | L02 — LOTO BranchingScenario missing verify-zero-energy step (entry gate not modeled)

**Files:** `L02-lockout-tagout-loto.jsx` BranchingScenario nodes  
**Error:** The BranchingScenario goes from lock application (step 4) to "cleared to work" without modeling the 29 CFR 1910.147(d)(6) verify-zero-energy step: attempt to operate the equipment via its normal controls to confirm no response. Workers training via the scenario learn that lock application = all-clear to enter, which is the most common LOTO fatality contributing factor documented in OSHA FACE reports.  
**Fix:** Add a BranchingScenario node between `step3` (apply lock) and `step5-end` (cleared to work) that asks: "What must you do before entering the equipment?" — correct answer: "Attempt to operate via front-panel controls to verify zero energy state." Wrong branch shows the capacitor discharge consequence. Also add a 1-sentence callout in the 6-step prose: "DO NOT enter after Step 5 (apply lock). Step 6 (verify zero energy) is the ENTRY GATE — no part of your body enters the danger zone until Step 6 is complete."  
**Confirmed by:** R-4 (independent find), R-5, R-6

---

## PRIORITY 2 — MED

### C-05 | MED | L03 — LEL catalytic bead sensor under-reads in O₂-deficient atmosphere — rationale absent

**Files:** `L03-confined-space-entry.jsx` (testing sequence section, ~line 260)  
**Error:** L03 teaches the correct testing sequence (O₂ → LEL → CO → H₂S) but does not explain the functional reason: catalytic bead sensors require oxygen to burn the target gas on the sensor bead. In O₂-deficient atmospheres (< ~16% O₂), these sensors output a false ZERO LEL. A crew that sees 0% LEL in a space with low O₂ may be falsely reassured.  
**Fix:** Add one sentence after the sequence instruction: "Always check O₂ first — if O₂ is below 19.5%, your combustible gas (LEL) sensor may give a false-low reading and cannot be trusted. Do not enter until O₂ is in the acceptable range AND the LEL reads clean."  
**Confirmed by:** R-3 (independent find), R-4

---

### C-06 | MED | L05 — Rubber insulating gloves "service life of 6 months" should be "re-test interval not to exceed 6 months"

**Files:** `L05-ppe-hands-head-eyes-feet.jsx` lines 319–325 (Advanced section)  
**Error:** "Gloves have a service life of 6 months from the date they're put into service; re-test and re-certification is required after 6 months per ASTM D120." ASTM D120 §10.3 specifies a TEST INTERVAL (not a service life or discard date) not to exceed 6 months from last test. Gloves that pass re-testing remain serviceable. The current language implies discard after 6 months, which is wrong and costly.  
**Legal dimension (R-6):** Also creates compliance liability — if workers understand "service life" as the clock, gloves with a 14-month-old last test but only 4 months in service will be treated as compliant when they are not.  
**Fix:** Replace "service life of 6 months from date put into service" → "re-test interval not to exceed 6 months from date of LAST TEST. Gloves that pass re-testing by a qualified laboratory remain serviceable. The 6-month clock restarts at each test date, not at first use."  
**Confirmed by:** R-2 (independent find), R-3, R-4, R-5, R-6

---

### C-07 | MED | L09 — Hospitalization "for treatment, not observation" qualifier is incorrect and creates regulatory exposure

**Files:** `L09-incident-reporting-osha-300.jsx` severe incident table (lines 232–238) + flashcard `T18-L09-fc-severe`  
**Error:** Table says "In-patient hospitalization (for treatment, not observation)" triggers 24-hr 1904.39 report. 29 CFR 1904.39(a)(3) current text (post-2016 revision) says: "You must report the in-patient hospitalization of one or more employees" — no treatment-vs-observation qualifier in current rule. The "observation only" carve-out was in a pre-2016 proposed-rule comment but was NOT adopted in the final rule.  
**Regulatory risk:** If a worker is admitted for "observation only" and the employer fails to report because they read this lesson, OSHA can cite both the reporting failure and inadequate training.  
**Fix:** Remove "for treatment, not observation" qualifier from table AND flashcard. Replace with: "Any in-patient hospitalization (whether for treatment or observation) triggers the 24-hour reporting requirement per 29 CFR 1904.39(a)(3)."  
**Confirmed by:** R-2 (independent find R-2 A-4), R-3, R-4, R-5 (R1-F2 as internal contradiction), R-6 (independent legal-liability angle)

---

### C-08 | MED | T08.L01 — Missing T18.L01 in prerequisites (broken DAG edge)

**Files:** `osp-training/src/lessons/T08/L01-otmr-vs-multi-party.jsx` meta prerequisites array  
**Error:** T08 (Make-Ready & Pole Attachment) covers field work on joint-use poles — requires T18 safety vocabulary (MAD/MAB, PPE, fall protection, LOTO, OSHA 1910.268). ARCH.md mandates T18→T08 edge. T08.L01 prerequisites are `['T01.L01', 'T05.L01', 'T07.L01']` — T18.L01 is absent.  
**Fix:** Add `'T18.L01'` to T08.L01 prerequisites array. Since downstream T08 lessons chain from L01, this propagates the edge.  
**Confirmed by:** R-2 (independent find), R-3, R-4

---

### C-09 | MED | T07.L01 — 'safety zone' assumed from T18.L01 but never introduced there (broken DAG vocab edge)

**Files:** `osp-training/src/lessons/T07/L01-what-a-staker-does.jsx` meta vocabulary_assumed  
**Error:** `vocabulary_assumed: [{ term: 'safety zone', source_lesson_id: 'T18.L01' }]` — T18.L01 `vocabulary_introduced` = `['general duty clause', '1910.268', 'hazard recognition', 'hierarchy of controls', 'SDS']`. 'safety zone' is not in this list, not in `key_terms`, and has no Flashcard in L01.  
**Fix option A:** Add 'safety zone' to T18.L01 `vocabulary_introduced` + `key_terms` + Flashcard card. Definition: "The clear working area established on a job site where hazards are controlled and workers can safely perform tasks — typically defined by barriers, distances, and TCP measures."  
**Fix option B:** Find the lesson where 'safety zone' IS introduced and update T07.L01 to point there instead.  
**Fix agent should apply option A** (adding to T18.L01 is simpler and the definition fits the L01 context).  
**Confirmed by:** R-1 (independent find F2), R-2, R-3, R-4, R-5

---

### C-10 | MED | T04.L01 — 'fall protection' assumed from T18.L04 but never registered in T18.L04 vocab_introduced (broken DAG vocab edge)

**Files:** `osp-training/src/lessons/T04/L01-*.jsx` meta vocabulary_assumed; `L04-fall-protection-poles-aerial-lifts.jsx` meta vocabulary_introduced  
**Error:** T04.L01 assumes `{ term: 'fall protection', source_lesson_id: 'T18.L04' }`. T18.L04 `vocabulary_introduced` = `['lanyard', 'self-retracting lifeline (SRL)', '100% tie-off', 'positioning system', 'aerial lift']`. 'fall protection' as a standalone registered term is absent (taught throughout L04 but not formally registered).  
**Fix:** Add `'fall protection'` to T18.L04 `vocabulary_introduced` + `key_terms` + Flashcard. Definition: "A system of equipment and procedures that prevents workers from falling from elevations or arrests a fall before the worker reaches a lower level. Includes both Positioning Systems and Personal Fall Arrest Systems (PFAS) per 29 CFR 1910.268(g)."  
**Confirmed by:** R-1 (F3), R-3, R-4, R-5

---

### C-11 | MED | T04.L01 — 'PPE' assumed from T18.L05 but not in T18.L05 vocab_introduced (broken DAG vocab edge)

**Files:** `osp-training/src/lessons/T04/L01-*.jsx` meta vocabulary_assumed; `L05-ppe-hands-head-eyes-feet.jsx` meta vocabulary_introduced  
**Error:** T04.L01 assumes `{ term: 'PPE', source_lesson_id: 'T18.L05' }`. T18.L05 `vocabulary_introduced` = `['PPG glove class', 'ANSI Z89.1 Class E', 'ANSI Z89.1 Class G', 'dielectric boots', 'hi-vis vest']`. 'PPE' is absent.  
**Fix:** Add `'PPE'` to T18.L05 `vocabulary_introduced` + `key_terms` + Flashcard. Definition: "Personal Protective Equipment — equipment worn by a worker to minimize exposure to hazards that cause serious workplace injuries and illnesses. Includes gloves, hard hats, eye protection, safety boots, high-visibility vests, and respiratory protection per 29 CFR 1910.132."  
**Note:** 'PPE' is referenced parenthetically in T18.L01 hierarchy-of-controls Flashcard but is not the lesson where it is formally introduced. L05 (PPE lesson) is the correct introduction point.  
**Confirmed by:** R-1 (F4), R-3, R-4, R-5

---

### C-12 | MED | T04.L01 — 'lockout-tagout' assumed from T18.L02 but L02 registers 'LOTO' not 'lockout-tagout' (DAG term name mismatch)

**Files:** `osp-training/src/lessons/T04/L01-*.jsx` meta vocabulary_assumed; `L02-lockout-tagout-loto.jsx` meta vocabulary_introduced  
**Error:** T04.L01 assumes `{ term: 'lockout-tagout', source_lesson_id: 'T18.L02' }`. T18.L02 `vocabulary_introduced` = `['LOTO', 'energy isolating device', 'authorized employee (LOTO)', 'affected employee (LOTO)']`. 'lockout-tagout' (hyphenated) is not registered; 'LOTO' is.  
**Fix:** Add `'lockout-tagout'` as an alias entry in T18.L02 `vocabulary_introduced` + `key_terms` + Flashcard referencing the same definition as 'LOTO'. Or add it as a second `vocabulary_introduced` entry alongside 'LOTO'. Definition: "Lockout/Tagout — the formal name for LOTO procedures defined in 29 CFR 1910.147. The lockout/tagout procedure ensures that machines and equipment are properly shut off and not able to be started again until maintenance or service work is completed."  
**Confirmed by:** R-1 (F5), R-3, R-4, R-5

---

### C-13 | MED | L05 — PPE inspection/maintenance not assessed (OSHA 1910.132(d)(2) competency gap)

**Files:** `L05-ppe-hands-head-eyes-feet.jsx` quiz section; `L10-t18-capstone-quiz.jsx`  
**Error:** L05 Advanced section teaches three OSHA-required inspection/maintenance skills: (a) rubber glove air-inflation test before each use, (b) hard hat replacement intervals, (c) harness retire-after-fall policy. None of these appears in L05's 4-question quiz or L10's 22-question capstone. Per 29 CFR 1910.132(d)(2), training must cover "proper care, maintenance, useful life and disposal of the PPE" — a curriculum that teaches but does not assess inspection competency does not produce a defensible OSHA training record.  
**Fix:** Add 1-2 quiz questions in L05 targeting inspection/maintenance. Suggested Q5: "You arrive on site with Class 2 rubber gloves (rated 17kV). The last re-test date stamped on the cuff is 8 months ago. What do you do?" — Correct: Remove from service, tag for laboratory re-test. Also add 1 capstone scenario integrating PPE inspection as a decision node, or integrate into the existing scenarios.  
**Confirmed by:** R-5 (independent find R5-NEW-1)

---

### C-14 | MED | L02 — `lesson_type: 'working'` overstated; verify-zero-energy step missing makes procedure incomplete

**Files:** `L02-lockout-tagout-loto.jsx` meta (line 8), learning_objectives  
**Error:** `lesson_type: 'working'` signals application-level competency. But the BranchingScenario omits the verify-zero-energy step (C-04). Until C-04 is fixed, the lesson teaches a partial LOTO procedure (5 steps instead of 6). Even after C-04 is fixed, learning objectives should be scoped explicitly to OSP fiber-hut-class equipment.  
**Fix:** After applying C-04, add scoping language to learning_objectives: "Apply the 1910.147(d) LOTO procedure to OSP fiber hut and generator-class equipment. For novel equipment not covered in this lesson, consult the qualified electrical authority before proceeding." Retain `lesson_type: 'working'` only after C-04 is confirmed applied.  
**Confirmed by:** R-5 (independent find R5-NEW-2)

---

### C-15 | MED | L07 — `lesson_type: 'working'` overstates competency (correct ceiling is awareness)

**Files:** `L07-working-near-energized-conductors.jsx` meta (line 8), learning_objectives  
**Error:** L07's decision tree is: "Within MAD? → YES → STOP. Call the utility." The lesson explicitly states "Most OSP telecom crew members are NOT 1910.269-qualified." Lesson_type 'working' implies the learner can independently apply the skill in a work context. The actual competency ceiling is "recognize the hazard and stop" — an awareness-level skill. A learner who sees `lesson_type: 'working'` may believe they are qualified to assess approaches to energized conductors.  
**Fix:** Change `lesson_type` to `'foundation'`. Add a callout in learning_objectives: "This lesson develops AWARENESS-level competency only. Independent work near energized conductors requires 1910.269 qualification via a separate employer-provided program."  
**Confirmed by:** R-5 (independent find R5-NEW-3)

---

### C-16 | MED | L04 — Free-climb teaching does not address interrupted-climbing work-position conversion

**Files:** `L04-fall-protection-poles-aerial-lifts.jsx` Advanced section lines 252–275  
**Error:** L04 correctly teaches free-climb is permitted during ascent. It does NOT teach that any pause at height to perform a task (even briefly) converts that position to a work position requiring fall protection. OSHA's 2012 interpretation letter permits free-climb during movement only.  
**Legal dimension (R-6):** A worker who stops mid-climb to address an obstacle "for just a second" without applying fall protection is not protected by the free-climb permission.  
**Fix:** Add to Advanced section or Book vs. Field callout: "Free-climb permission covers continuous movement up the pole. Any pause at height to perform a task — even briefly — converts that position to a work position. Fall protection must be applied before any task begins at height, even a momentary one."  
**Confirmed by:** R-6 (independent find R6-NEW-2)

---

### C-17 | MED | L07 — "Informal field rule" failure modes listed without detection procedure

**Files:** `L07-working-near-energized-conductors.jsx` Book vs. Field callout lines 187–199  
**Error:** L07 lists three conditions where the "I'm in the comms space, below the neutral" informal rule breaks down: (a) deteriorated conductor insulation, (b) induced voltage on messenger, (c) downed conductor energized at ground level. The lesson does NOT teach how to assess whether these conditions exist before relying on the informal rule.  
**Fix:** Add a 3-item "spot-check before you climb" checklist after the failure-mode list: "(a) Visual conductor inspection from the approach: look for cracked, missing, or frayed insulation on conductors above your work space. (b) Test the messenger with a ground-rod voltage tester before cutting or attaching — see the induced-voltage section above for the test procedure. (c) Survey for sagged or downed conductors before approaching the pole base."  
**Confirmed by:** R-6 (independent find R6-NEW-3)

---

### C-18 | MED | L03 — Gas atmosphere table lacks exit-threshold column (field-usability defect)

**Files:** `L03-confined-space-entry.jsx` atmosphere table (lines 138–174)  
**Error:** Table columns are "Gas / Parameter | Safe Range | Action if Outside Range." A worker already inside who needs to know WHEN to exit (not whether to enter) must invert the entry criteria under cognitive load. The BranchingScenario correctly teaches exit behavior ("exit at 40 ppm CO") but the reference table does not state exit thresholds explicitly. Under a gas alarm in a dark manhole with gloves, the table is not usable as a quick reference for exit decisions.  
**Fix:** Add a fourth column: "Exit threshold (if already inside)" — CO > 25 ppm; H₂S > 1 ppm; LEL > 10%; O₂ < 19.5% or > 23.5%. This is the same value as the entry limit but framing it explicitly for the exit use case eliminates the cognitive inversion under stress.  
**Confirmed by:** R-7 (independent find R7-NEW-1)

---

## PRIORITY 3 — LOW

### C-19 | LOW | L03 — OSHA 1993-05-19 interpretation letter citation unverifiable; cite 1910.5(c)(1) directly

**Files:** `L03-confined-space-entry.jsx` line 306  
**Error:** Lesson cites "OSHA interpretation letter 1993-05-19 (osha.gov)" as the basis for 1910.268(o) superseding 1910.146. The legal conclusion (specific standard supersedes general per 1910.5(c)(1)) is correct and self-supporting. The specific letter date could not be confirmed from public OSHA interpretation letter archive.  
**Fix:** Replace the citation with a direct reference to 29 CFR 1910.5(c)(1): "Per 29 CFR 1910.5(c)(1), when a specific standard (1910.268) covers a condition, it supersedes the more general standard (1910.146) for that specific condition — this is OSHA's longstanding rule for telecom confined spaces." Remove or verify the 1993 letter citation independently before publication.  
**Confirmed by:** R-1 (F6), R-2, R-3

---

### C-20 | LOW | L03 — "19.5% O₂ the brain starts working less well" conflates regulatory threshold with physiology

**Files:** `L03-confined-space-entry.jsx` line 299  
**Error:** "At 19.5% O₂ the brain starts working less well." The 19.5% O₂ threshold is OSHA's regulatory buffer (29 CFR 1910.146(b)) with safety margin. Actual physiological cognitive impairment begins below ~16–17% O₂ in healthy adults; at 19.5% there is minimal measurable effect.  
**Fix:** Change to: "At 19.5% O₂, OSHA requires you to treat the atmosphere as oxygen-deficient — this threshold is a regulatory safety margin, not the point where you lose cognitive function. At 16% O₂ your body begins to struggle; below 10% you can lose consciousness within minutes. The 19.5% threshold gives you a buffer to exit safely before impairment begins."  
**Confirmed by:** R-1 (F7), R-3, R-4

---

### C-21 | LOW | L02 — LOTO BranchingScenario `step2`: non-optimal path routes to `step3` without correction of missing stored-energy identification

**Files:** `L02-lockout-tagout-loto.jsx` BranchingScenario node `step2`  
**Error:** `step2` non-optimal path ("just one DC circuit") routes to `step3` (apply lockout) without correcting the missed stored-energy identification requirement from 29 CFR 1910.147(d)(2). A learner taking the wrong path proceeds to lock application without identifying all energy sources.  
**Fix:** In `step2`, non-optimal path should end at a corrective `isEnd: true` node: "You identified only the primary circuit. LOTO Step 2 (29 CFR 1910.147(d)(2)) requires identifying ALL energy sources — including stored energy (capacitors, spring tension, hydraulic pressure). Return to Step 2 and identify the EDFA shelf's capacitor banks before applying the lock." Set `isEnd: true` with option to retry from `step2`.  
**Confirmed by:** R-6 (independent find R6-NEW-5)

---

### C-22 | LOW | L02 — LOTO BranchingScenario `step5-end` re-energization sequence contradicts lesson prose

**Files:** `L02-lockout-tagout-loto.jsx` BranchingScenario node `step5-end` endMessage  
**Error:** `step5-end` end node teaches re-energization sequence: "remove tools → clear area → notify affected employees → EACH authorized worker removes own lock → restore power." 29 CFR 1910.147(e)(3) sequence is: remove tools → ensure employees are clear → EACH authorized worker removes own lock → notify affected employees → restore energy. The lesson's working-tier prose (lines 180–186) correctly teaches the right sequence, but the BranchingScenario's final summary contradicts it. Learners who finish the scenario take away the wrong order.  
**Fix:** Update `step5-end` endMessage sequence to: "Remove tools and restore machine guards → ensure all workers are clear of the equipment → each authorized worker removes their own personal lock → notify affected employees that the equipment is being re-energized → restore energy."  
**Confirmed by:** R-7 (independent find R7-NEW-4)

---

### C-23 | LOW | L04 — SideBySide body-belt "acceptable for positioning" stated without ANSI Z359 evolving-standard caveat

**Files:** `L04-fall-protection-poles-aerial-lifts.jsx` SideBySide component `comparisonRows`  
**Error:** SideBySide left column (Positioning System) "OSHA acceptability" row says "Body belt acceptable for positioning" as a flat statement. ANSI Z359.11-2021 recommends against body belts even for positioning; the lesson's Book vs. Field section addresses this but workers who reference the table directly may miss the nuance.  
**Fix:** Add parenthetical to the SideBySide entry: "Body belt still allowed under 1910.268(g)(1) for positioning — but ANSI Z359.11 recommends full-body harness even for positioning work. See Book vs. Field note."  
**Confirmed by:** R-7 (independent find R7-NEW-2)

---

### C-24 | LOW | L07 — WorkedExample MAD approximation doesn't warn about ungrounded systems

**Files:** `L07-working-near-energized-conductors.jsx` WorkedExample sanityCheck output (lines 278–326)  
**Error:** WorkedExample approximation formula is presented with a disclaimer but doesn't warn that for ungrounded systems, the linear approximation may significantly underestimate the actual MAD from the OSHA Calculator. The sanityCheck text ("this calculator approximates the Appendix B formula; always verify using the actual OSHA calculator") doesn't mention the category of systems where the error is most dangerous.  
**Fix:** Add to sanityCheck output: "This approximation cannot be used for field decisions. For ungrounded systems or high-impedance grounded systems, the actual OSHA Calculator MAD may be significantly higher than this approximation. Always use the calculator: osha.gov/power-generation/rulemaking/madcalculator"  
**Confirmed by:** R-7 (independent find R7-NEW-3)

---

### C-25 | LOW | L10 — Capstone lacks LOTO integration BranchingScenario

**Files:** `L10-t18-capstone-quiz.jsx` BranchingScenarios section  
**Error:** L10 capstone has 2 integrative BranchingScenarios (manhole entry + incident classification). LOTO (L02) appears only in 3 MC questions; no integrative scenario tests LOTO procedure execution. OSHA program auditors specifically evaluate application-level assessment for highest-fatality-risk topics.  
**Fix:** Add a third BranchingScenario: "You're preparing to work in a fiber hut to swap a failed OLT card. Walk through the LOTO procedure." Decision nodes: recognize energy sources → locate EIDs → notify affected employees → apply LOTO → verify zero energy → proceed/abort. Integrate L02 procedures + L07 MAD awareness.  
**Confirmed by:** R-5 (independent find R5-NEW-4)

---

### C-26 | LOW | T18 — 'competent person' (29 CFR 1926.32(f)) not introduced anywhere in curriculum

**Files:** T18.L01 or T18.L04 vocabulary_introduced  
**Error:** T18 introduces `authorized employee (LOTO)` (L02) and `qualified electrical worker` (L07), but not `competent person` per 29 CFR 1926.32(f). OSHA enforcement citations for confined space, fall protection, and atmospheric testing frequently reference "failure to provide competent person supervision." T18 graduates cannot navigate this OSHA enforcement language.  
**Fix:** Add `'competent person'` to T18.L01 or T18.L04 `vocabulary_introduced` + `key_terms` + Flashcard. Definition: "A person designated by the employer who is capable of identifying existing and predictable hazards in the surroundings or working conditions which are unsanitary, hazardous, or dangerous to employees, and who has authorization to take prompt corrective measures (29 CFR 1926.32(f)). Contrast with: authorized employee (LOTO, 1910.147) and qualified electrical worker (1910.269)."  
**Confirmed by:** R-5 (independent find R5-NEW-5)

---

### C-27 | LOW | L04 — Aerial lift hydraulic drift failure mode not explained (boom-collapse/ejection mechanism incomplete)

**Files:** `L04-fall-protection-poles-aerial-lifts.jsx` lines 232–238 (aerial lift — never belt off to pole)  
**Error:** Lesson correctly states "never belt off to the pole — if the truck shifts or boom retracts, you can be pulled out or crushed." But it doesn't explain that HYDRAULIC DRIFT (slow, gradual boom movement from minor pressure drop) is the primary failure mode — not sudden movement. Workers think "I'll notice if the truck is moving" but hydraulic drift is imperceptible until the lanyard is taut.  
**Fix:** Expand the bullet: "Never belt off to the pole or structure. If boom drifts — even slowly through gradual hydraulic pressure drop — the lanyard between your harness and the pole becomes a pivot point that swings or crushes you against the structure. This happens gradually, not suddenly. You will not notice 6-inch boom drift until the lanyard is already taut. Your attachment always travels with the basket."  
**Confirmed by:** R-4 (independent find R4-NEW-3)

---

### C-28 | LOW | L03 — L03 BranchingScenario "test immediately" sub-branch creates cognitive trap (optimal answer inconsistency)

**Files:** `L03-confined-space-entry.jsx` BranchingScenario `step2-partial` sub-branch  
**Error:** The opening node correctly marks "wait 2-5 minutes" as `isOptimal: true` and "test immediately" as `isOptimal: false`. But the `step2-partial` sub-branch (worker tested immediately and got clean readings) marks BOTH "enter" AND "run blower anyway" as `isOptimal: true`. A worker who takes the immediate-test path can extract: "if readings are clean, immediate testing is fine." That contradicts the first branch teaching.  
**Fix:** Change the `step2-partial` immediate-test-then-clean path consequence: mark `isOptimal: false` and add explanation: "An immediate surface-zone reading may not represent actual gas concentrations at worker height inside the space. Passive venting allows gas stratification to equilibrate — this is why best practice is always wait 2–5 minutes before testing, regardless of immediate readings."  
**Confirmed by:** R-4 (independent find R4-NEW-2)

---

### C-29 | LOW | L06 — L05 glove re-test language creates assumed compliance claim (legal dimension of C-06)

**Notes:** This is the legal-liability dimension of C-06. No additional fix required — addressed by C-06 fix.  
**Confirmed by:** R-6 (R6-NEW-6, subsumes C-06's legal angle)

---

### C-30 | LOW | L07 — R3-NEW-2 LEL sensor rationale (same as C-05)

**Notes:** Covered by C-05. No separate fix entry needed.

---

## Fix Agent Instructions

**Branch:** `main`  
**Push policy:** `git fetch origin main && git merge FETCH_HEAD --no-edit`, then `git -c commit.gpgsign=false commit`, then `git push origin main`  
**Write-path allowlist:** `osp-training/src/lessons/T18/*.jsx` + `osp-training/src/lessons/T07/L01-what-a-staker-does.jsx` + `osp-training/src/lessons/T08/L01-*.jsx` + `osp-training/src/lessons/T04/L01-*.jsx`  
**DO NOT modify:** CLAUDE.md, ARCH.md, course-catalog.js, any other lesson files  

**Commit order (priority-first):**
1. Commit 1: L03 HIGH fixes — C-01 (methane density prose + scenario), C-02 (H₂S IDLH 50 ppm), C-03 (H₂S compound prose)
2. Commit 2: L02 HIGH fixes — C-04 (verify-zero-energy BranchingScenario node) + C-21 (step2 non-optimal) + C-22 (step5-end sequence)
3. Commit 3: L09 MED fix — C-07 (hospitalization qualifier removal)
4. Commit 4: L05 MED fixes — C-06 (glove re-test language) + C-13 (PPE inspection quiz questions)
5. Commit 5: L04 MED/LOW fixes — C-16 (free-climb interrupted task), C-23 (SideBySide body-belt), C-27 (hydraulic drift)
6. Commit 6: L07 MED/LOW fixes — C-15 (lesson_type), C-17 (failure mode detection), C-24 (ungrounded system caveat)
7. Commit 7: L03 remaining — C-05 (LEL sensor caveat), C-19 (citation), C-20 (O₂ physiology), C-28 (BranchingScenario optimal inconsistency), C-18 (exit threshold column)
8. Commit 8: L02 remaining — C-14 (lesson_type + learning_objectives scoping)
9. Commit 9: L10 LOW — C-25 (LOTO integration BranchingScenario in capstone)
10. Commit 10: DAG vocab fixes — C-09 (safety zone → T18.L01 + T07.L01), C-10 (fall protection → T18.L04), C-11 (PPE → T18.L05), C-12 (lockout-tagout alias → T18.L02) + C-26 (competent person → T18.L01 or L04) + C-08 (T08.L01 prereq)

**After all commits:** run `git diff HEAD~10 --stat` to verify only allowlisted files modified. Report SHA of each commit.

---

## Polish Stage — Applied 2026-05-16 (post-verify RT pair + Haiku ground-truth resolution)

**Conflict resolution outcomes (orchestrator-decided before this stage):**
- Gap-2 (PPE Flashcard): FALSE POSITIVE — `T18-L05-fc-ppe` exists at L05 lines 134-138. NO FIX.
- Gap-3 (L02 lesson_type "working"): RT-D DISPUTE accepted — correct as-is for application-level LOTO content. NO FIX.
- Gap-4 (Group LOTO Q5 missing): RT-D verified Q1 covers 1910.147(f)(3) Group LOTO. NO FIX.

### Polish commit 1 — L09 Gap-1 (SHA: `c34cb77`)

**Gap-1 | LOW | L09 Sortable label residual**
- File: `L09-incident-reporting-osha-300.jsx`
- BEFORE: `label: 'A technician falls from a ladder and is admitted to the hospital for treatment.'`
- AFTER: `label: 'A technician falls from a ladder and is admitted to the hospital.'`
- Rationale: C-07 fix corrected prose/table per 29 CFR 1904.39(a)(3) (any in-patient hospitalization, treatment or observation). Sortable label retained "for treatment" residual. Removed to match corrected regulatory framing.
- Status: APPLIED ✓

### Polish commit 2 — L03 Gap-D1 + Gap-D2 + C-19 partial (SHA: `f4d351b`)

**Gap-D1 | LOW | L03 CO threshold basis attribution**
- File: `L03-confined-space-entry.jsx` atmospheric table CO row
- BEFORE: `<td className="px-3 py-2 font-mono">&lt; 25 ppm</td>`
- AFTER: `<td className="px-3 py-2 font-mono">&lt; 25 ppm (ACGIH TLV-TWA)</td>`
- Rationale: Matches H₂S entry's explicit "NIOSH IDLH" attribution for framing symmetry.
- Status: APPLIED ✓

**Gap-D2 | LOW | L03 Pellistor sensor H₂S poisoning**
- File: `L03-confined-space-entry.jsx` Advanced section after existing LEL-O₂ note
- BEFORE: No H₂S pellistor poisoning callout.
- AFTER: Added amber callout block: H₂S >10 ppm causes irreversible pellistor sensor poisoning → persistent false-zero LEL after event → bump-test or sensor replacement required. Cross-references manufacturer bump-test guidance.
- Status: APPLIED ✓

**C-19 partial | LOW | L03 quiz Q1 citation residual**
- File: `L03-confined-space-entry.jsx` Quiz Q1 explanation + citation field
- BEFORE (explanation): `...OSHA confirmed in a 1993 interpretation letter that 1910.268(o) — not 1910.146 — governs routine telecom manhole entry...`; citation: `...OSHA interpretation letter 1993-05-19.`
- AFTER (explanation): `...Per 29 CFR 1910.5(c)(1), specific standards supersede general ones — when a specific standard (1910.268) covers a condition, it supersedes the more general standard (1910.146) for that condition...`; citation: `...29 CFR 1910.5(c)(1) — specific standard supersedes general standard (ecfr.gov).`
- Rationale: Prior C-19 fix corrected prose body; quiz citation field retained unverifiable 1993 letter reference. Both explanation text and citation field now cite 1910.5(c)(1) directly.
- Status: APPLIED ✓

### Neighborhood scan — no additional same-pattern bugs found
- L09 Sortable ±20 lines: no other "for treatment" or "observation" qualifier residuals.
- L03 atmospheric table ±20 lines: O₂, LEL, H₂S rows have explicit basis attribution where applicable; CO was the only gap. H₂S row cites "NIOSH IDLH" in the action column (consistent with Gap-D1 fix).
- L03 Q1 quiz ±20 lines: Q2–Q4 citations checked; all reference primary sources (ecfr.gov, osha.gov) with no unverifiable letter references.

---

## Polish Stage 2 — Applied 2026-05-16 (final-verify RT-E pedagogy + RT-F technical, 5 LOWs)

**SHA:** `fed393c`  
**Files modified:** L03, L04, L08, L09 (4 files, 37 insertions, 9 deletions)

### NEW-E1 | LOW | L04 ANSI Z359.1 citation imprecision

- File: `L04-fall-protection-poles-aerial-lifts.jsx`
- Locations: Book/vs.Field callout (Working section), SideBySide OSHA-acceptability row, Quiz Q2 citation field
- BEFORE: Referenced "ANSI Z359.1" as the operative fall arrest standard / body-belt restriction source.
- AFTER: Z359.1 identified as the umbrella standard; specific sub-standards now cited as Z359.4 (Safety Requirements for Use, Inspection, and Maintenance) and Z359.11 (Safety Requirements for Full Body Harnesses) as applicable to body-belt vs. harness arrest requirements.
- Status: APPLIED ✓

### NEW-E2 | LOW | L09 near-miss protection overstated as absolute immunity

- File: `L09-incident-reporting-osha-300.jsx`
- Locations: `key_terms` definition, Flashcard `T18-L09-fc-nearmiss`, Quiz Q3 explanation
- BEFORE (key_terms): "OSHA cannot use voluntary near-miss reports against an employer in enforcement."
- AFTER (key_terms): "OSHA has stated it will not use voluntary near-miss reports as a basis for citations under 29 CFR 1904.35(b)(1)(i) and OSH Act §11(c) whistleblower protections — but this is an enforcement policy, not an absolute statutory immunity."
- Flashcard and Q3 explanation harmonized to same framing.
- Status: APPLIED ✓

### NEW-E5 | LOW | L08 missing L03 cross-reference for atmospheric/confined-space hazards

- File: `L08-hazardous-materials-osp.jsx`
- Location: HDPE conduit / vault heat fusion protection paragraph
- BEFORE: "If working in a confined vault with heat fusion, the ventilation requirement from T18.L03 applies simultaneously."
- AFTER: Expanded to explicit navigational cross-reference: "See T18.L03 (Confined Space Entry) for full atmospheric monitoring procedures and IDLH thresholds — the forced-air blower requirement from 29 CFR 1910.268(o)(2) and the atmospheric testing protocol apply simultaneously with any heat fusion or cutting work in an enclosed vault."
- Status: APPLIED ✓

### NEW-F1 | LOW | L03 CO IDLH not stated alongside CO TLV-TWA

- File: `L03-confined-space-entry.jsx`
- Location: Atmospheric table CO row, Action column
- BEFORE: CO Action column read "Ventilate; identify source before entry." — no IDLH value.
- AFTER: Added "NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay." to the CO action column, matching the framing of the H₂S row which already cited "50 ppm = NIOSH IDLH."
- Status: APPLIED ✓

### NEW-F3 | LOW | L04 PFAS anchor point 5,000 lbf minimum missing

- File: `L04-fall-protection-poles-aerial-lifts.jsx`
- Location: New callout box added at end of Working section, before source citation line
- BEFORE: No PFAS anchor point strength requirement taught.
- AFTER: Added sky-blue callout: "PFAS anchor points must support ≥5,000 lbf per worker attached OR be designed by a qualified person with a 2× safety factor (29 CFR 1910.140(c)(13))." Field note covers messenger strand and crossarm verification.
- Status: APPLIED ✓

### Neighborhood scan findings (not fixed — report only)

- L04 ±20 lines from PFAS callout: Aerial lift bullet list references "PFAS or travel restraint system" per 1910.67(c)(2)(v) — this is accurate. No anchor-strength qualifier for aerial lift basket attachment points (boom/basket structure, not improvised anchors) — intentional, basket attachment is a rated structural element, the 5,000 lbf instruction applies to improvised OSP field anchors.
- L03 ±20 lines from CO IDLH addition: O₂ row lists "Below 16% = IDLH" — technically the NIOSH IDLH for O₂ deficiency is atmosphere <16% O₂; this is correct. H₂S row correctly shows 50 ppm IDLH. No inconsistency detected.
- L09 ±20 lines from near-miss fixes: The "fieldNote" on Q3 ("Even though it's not legally required, report it internally...") is good practical guidance and not affected by the statutory-vs-policy framing fix. No changes needed.
- L08 ±20 lines from cross-reference addition: Gel cleaning rags item + silica dust item both correctly direct to SDS sections; no atmospheric-hazard cross-references warranted (those chemicals don't create confined-space atmospheric hazards). No additional cross-refs needed.

---

## Polish-3 Fixes (from final-verify-2 RT-G + RT-H findings) — APPLIED `a7e8bc8`

### NEW-G1 | MED | L04 — ANSI Z359.4 wrong title at 3 locations

- RT-G finding: Z359.4 title incorrectly described as "Safety Requirements for Use, Inspection, and Maintenance of Fall Protection Equipment." Actual ANSI/ASSP Z359.4-2013 (R2022) title: "Safety Requirements for Assisted-Rescue and Self-Rescue Systems, Subsystems and Components."
- RT-H independently confirmed from ASSP.org store page. Preferred fix: replace all 3 Z359.4 instances with Z359.1 + Z359.11 (unambiguous PFAS/harness standards).
- Locations fixed: (1) L04:213-218 Book/Field prose — "ANSI Z359.4 (Safety Requirements for Use, Inspection, and Maintenance)" → "ANSI Z359.1 ('The Fall Protection Code' — overarching PFAS system requirements) and Z359.11 (Safety Requirements for Full Body Harnesses)"; (2) L04 SideBySide leftValue "ANSI Z359.4 and Z359.11" → "ANSI Z359.1 ('The Fall Protection Code') and Z359.11"; (3) L04 Q2 citation "ANSI Z359.4 + Z359.11" → "ANSI Z359.1 ('The Fall Protection Code') + Z359.11."
- Primary-source authority: ASSP.org confirmed by RT-H agent (cited in T18_FINAL_VERIFY_RT_H_TECHNICAL.md). Z359.1 = "The Fall Protection Code"; Z359.11 = "Safety Requirements for Full Body Harnesses"; Z359.4 = "Assisted-Rescue and Self-Rescue Systems."
- Status: APPLIED ✓ (`a7e8bc8`)

### NEW-G2 | LOW | L03 — CO IDLH wording creates competing exit signal

- RT-G finding: L03 atmospheric table Action column for CO read "NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay." The "exit immediately" language in the Action column competes with column 4's "exit immediately at > 25 ppm" threshold.
- Fix: Softened Action-column text to informational context: "(For scale: NIOSH IDLH = 1,200 ppm = immediate threat to life — the 25 ppm exit threshold in column 4 is your actual trigger, far before IDLH.)" Column 4 remains the unambiguous exit trigger.
- Status: APPLIED ✓ (`a7e8bc8`)

---

## Neighborhood scan from Polish-3 (surface only, no fixes)

- L04 ±20 lines from Z359.1+Z359.11 fixes: Z359.1 described as "overarching PFAS system requirements" — accurate for teaching purposes; GAP-H4 noted "umbrella" framing slightly imprecise but non-misleading. Z359.11 references unchanged and verified correct. No additional Z359 errors found.
- L03 ±20 lines from CO table fix: H₂S row retained "at 50 ppm = NIOSH IDLH — exit immediately" in Action column — correct and not competing (H₂S exit threshold in column 4 is > 1 ppm, so the IDLH context provides useful scale without creating a competing trigger). O₂ row "Below 16% = IDLH" correct. No additional table issues.

---

## Polish-4 Fixes (from final-verify-3 RT-J findings) — APPLIED 2026-05-16

### NEW-J1 | HIGH | L03 — H₂S IDLH corrected from 50 ppm → 100 ppm at 3 distinct locations

**Primary-source verification:**
- NIOSH IDLH documentation, CAS 7783-06-4, revised 1994: "The revised IDLH for hydrogen sulfide is 100 ppm based on acute inhalation toxicity data in humans." (cdc.gov/niosh/idlh/7783064.html — confirmed via WebSearch returning NIOSH primary source result text)
- NIOSH Pocket Guide to Chemical Hazards, H₂S entry (npgd0337): IDLH listed as 100 ppm; olfactory fatigue documented at 100 ppm per Poda 1966. (cdc.gov/niosh/npg/npgd0337.html)
- Both sources independently confirm 100 ppm. The 50 ppm figure appearing in earlier audit rounds reflected confusion with OSHA STEL (15 ppm 10-min ceiling) or older pre-1994 literature.

**Note on C-02/C-03 in this canonical:** Those entries were written BEFORE the RT-J reversal. C-02 claimed "correct value = 50 ppm" and C-03 proposed resequencing around 50 ppm. Both are now superseded by NEW-J1 (100 ppm confirmed from NIOSH primary sources). The Polish-3 neighborhood scan note ("H₂S row retained 'at 50 ppm = NIOSH IDLH' — correct") is also superseded.

**Fixes applied to `L03-confined-space-entry.jsx`:**

1. **Location 1 — Atmospheric table Action column (line ~170):**
   - BEFORE: `Evacuate and ventilate immediately; at 50 ppm = NIOSH IDLH — exit immediately.`
   - AFTER: `Evacuate and ventilate immediately; at 100 ppm = NIOSH IDLH — exit immediately, no re-entry without SCBA.`

2. **Location 2+3+J2 — Advanced section prose (lines ~296–304, 3 changes in one block):**
   - BEFORE: `The NIOSH IDLH for H₂S is **50 ppm**: at 50 ppm you must exit immediately. At around 100 ppm (twice the IDLH), H₂S completely paralyzes your sense of smell — meaning a worker who has been breathing 50–100 ppm H₂S has already been above IDLH and loses the ability to detect further buildup.`
   - AFTER: `The NIOSH IDLH for H₂S is **100 ppm**: at or above 100 ppm you must exit immediately — no re-entry without supplied-air SCBA. At the IDLH (100 ppm), H₂S can induce olfactory paralysis within minutes — workers lose the smell-warning signal precisely AT the immediate-danger threshold. Your nose goes numb exactly when the danger is worst.`
   - J2 resolution: "twice the IDLH" phrase eliminated; olfactory paralysis now correctly placed AT the IDLH (100 ppm), consistent with NIOSH NPG Poda 1966 citation.

3. **Location 3 — Footer citation (lines ~338–340):**
   - BEFORE: `NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 50 ppm IDLH.`
   - AFTER: `NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 100 ppm IDLH (cdc.gov/niosh/idlh/7783064.html); NIOSH Pocket Guide to Chemical Hazards, H₂S entry (cdc.gov/niosh/npg/npgd0337.html).`

- Status: APPLIED ✓

### NEW-J2 | LOW (consequential) | L03 — "twice the IDLH" phrase resolved

- Resolved inline with NEW-J1 Location 2+3 block above.
- Status: APPLIED ✓ (no separate commit needed)

---

## Neighborhood scan from Polish-4 (surface only, no fixes applied)

- **L03 line ~285 — "H₂S at 50 ppm today" (field reality paragraph):** This uses 50 ppm as an EXAMPLE CONCENTRATION in a scenario ("a sewer main cracked two blocks away and now there's H₂S at 50 ppm"), NOT as an IDLH claim. 50 ppm is a plausible field reading (below IDLH of 100 ppm) that illustrates why skipping atmospheric testing is dangerous. This usage is CORRECT and should NOT be changed — it demonstrates a hazardous-but-sub-IDLH reading that would be detected by a monitor, reinforcing the "test every time" message.
- **L03 atmospheric table O₂ row — "Below 16% = IDLH":** The NIOSH IDLH for O₂ deficiency references oxygen concentrations below which immediate danger exists; 16% is the commonly-cited threshold associated with loss of consciousness. This is defensible teaching language. Not an IDLH value for a specific chemical compound — no change needed.
- **L03 BranchingScenario "step2" node — gas concentrations:** The scenario uses LEL = 12%, CO = 3 ppm, H₂S = 0 ppm as a scenario reading. No IDLH references in scenario text. Unaffected by this patch.
- **No additional 50-ppm IDLH references found** in ±20 lines around each fix location or in flashcard/key_terms arrays.

---

## Polish-5 Fixes (from final-verify-4 RT-K + RT-L findings) — PARTIALLY APPLIED 2026-05-16

### RT-K Gap-K1 | LOW | L03 — "olfactory paralysis within minutes" at 100 ppm overstated

- Per NIOSH NPG (Poda 1966 citation, cdc.gov/niosh/npg/npgd0337.html): 100 ppm causes olfactory FATIGUE; full nerve PARALYSIS occurs at 150 ppm+. Lesson was conservatively protective but technically imprecise.
- BEFORE: `At the IDLH (100 ppm), H₂S can induce olfactory paralysis within minutes — workers lose the smell-warning signal precisely AT the immediate-danger threshold.`
- AFTER: `At the IDLH (100 ppm), H₂S induces olfactory fatigue within minutes — workers lose the smell-warning signal precisely AT the immediate-danger threshold. Full olfactory nerve paralysis can occur at 150 ppm and above. Either way, smell-warning becomes unreliable at the immediate-danger threshold — a calibrated monitor is the only reliable detection.`
- Status: APPLIED ✓ (`d97f3d3`)

### RT-K Gap-K2 | LOW | L03 — OSHA PEL distinction absent

- Lesson used NIOSH IDLH throughout but never referenced OSHA PEL (Construction 29 CFR 1926.55 = 10 ppm TWA; General Industry 29 CFR 1910.1000 Table Z-2 = 20 ppm ceiling / 50 ppm 10-min peak). Crews working construction sites need to know which PEL governs their work.
- Added new callout box "OSHA PEL vs. NIOSH IDLH — know the difference" in the advanced section, immediately before the footer citation.
- Also added 1926.55 and 1910.1000 Table Z-2 to footer citation line.
- Status: APPLIED ✓ (`d97f3d3`)

### RT-L-1 | LOW-MED | L03 — "irreversibly poison" pellistor sensor classification held pending primary-source verification

- RT-L finding: H₂S at field-encountered concentrations is a REVERSIBLE inhibitor of catalytic bead sensors (sensitivity recovers when H₂S is removed; bump-test verifies recovery). "Irreversibly poison" language is technically incorrect per sensor manufacturer literature.
- **HOLD REASON:** All sensor manufacturer web sources (Blackline Safety, Industrial Scientific, MSA, Honeywell Analytics, Draeger, RKI, Crowcon, ISA, etc.) returned HTTP 403 during polish-5 execution. Could not obtain primary-source verbatim quote to confirm the reversibility classification per orchestrator's mandatory verification requirement.
- **Existing text retained:** "H₂S concentrations above 10 ppm can irreversibly poison catalytic bead (pellistor) LEL sensors..." plus "Consult your monitor manufacturer's guidance on H₂S exposure limits for the sensor type in use."
- **Technical note for orchestrator:** The existing text's "irreversibly poison" language is widely used in the confined space safety community and some manufacturers DO describe H₂S poisoning as irreversible at higher concentrations — the precise classification depends on concentration, exposure duration, and sensor design. The bump-test guidance that follows is correct regardless. The manufacturer consultation note mitigates the risk of workers relying on a degraded sensor.
- **Action needed:** Orchestrator to adjudicate: (a) accept existing "irreversibly poison" + manufacturer consultation note as conservative/protective field language, OR (b) dispatch a fresh agent with a different WebFetch approach to obtain primary-source confirmation of reversibility classification before applying the rewrite.
- Status: HELD — primary-source verification failed, orchestrator adjudication required

---

## Neighborhood scan from Polish-5 (surface only, no fixes applied)

- **L03 lines 319-323 (LEL sensor O₂ note):** Content correct and unaffected. No issues in ±20-line window around K1 fix location.
- **L03 lines 326-334 (pellistor sensor poisoning callout):** RT-L-1 fix held as above. Existing text + manufacturer guidance note is a defensible conservative position pending adjudication.
- **L03 source citation block (lines 335-341):** Updated in K2 fix. Citation block now includes 1926.55 and 1910.1000 Table Z-2. No additional missing citations found in ±20-line scan.

=== T18 FIX CANONICAL END ===
