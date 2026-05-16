# T18 Retroactive Audit R-7: Field-Crew Worker Learner Perspective

**Topic:** T18 "Safety & OSHA" — `osp-training/src/lessons/T18/*.jsx`
**Framing:** Field-crew worker LEARNER perspective — new hire, 5-year vet, phone-in-a-manhole usability, low-literacy stress-response, cognitive load
**Auditor:** R-7 (independent pass; R-1 through R-6 reports read AFTER independent analysis below)
**Date:** 2026-05-16

---

## 1. Independent Findings (NEW — field-usability class, prior 6 rounds missed)

### R7-NEW-1 | MED | L03 Atmospheric Limits Table Is NOT Reference-During-Job Usable on a Phone

**Location:** `L03-confined-space-entry.jsx` lines 138–174 (atmosphere table + source citation)

**Scenario:** Worker is topside about to enter a manhole. Gas monitor shows numbers. Worker pulls up L03 on their phone to cross-check the values.

**Usability defect:** The table headers are: "Gas / Parameter | Safe Range | Action if Outside Range." Under poor lighting with gloves on, a worker scans for their reading. The CO column says "< 25 ppm" with action "Ventilate; identify source before entry." A worker reading "40 ppm CO" finds the table but sees NO EXPLICIT EXIT THRESHOLD — the table only states a minimum-for-entry limit, not an in-space emergency limit. If a worker is already inside and CO rises to 40 ppm, the table gives them "entry" rules, not "already-inside-and-it-rose" rules.

**Cognitive load defect:** Under stress (gas alarm sounding), a worker reading this table needs to invert the logic: "the table says < 25 ppm for entry, so > 25 ppm means exit." That inversion is a cognitive step that stress makes harder, not easier. The BranchingScenario in L03 correctly teaches "exit at 40 ppm CO," but the table does not say this explicitly.

**Fix shape (small):** Add a fourth column "Exit threshold (if already inside)" to the atmosphere table with explicit exit values: CO > 25 ppm = exit; H₂S > 1 ppm = exit immediately; LEL > 10% = exit; O₂ < 19.5% or > 23.5% = exit. This doubles as a pocket-reference card during a mid-job gas event.

---

### R7-NEW-2 | LOW | L04 ANSI Z359 Body-Belt Restriction Stated Incorrectly in SideBySide Component

**Location:** `L04-fall-protection-poles-aerial-lifts.jsx` SideBySide component, `comparisonRows`, row "OSHA acceptability (1910.268)"

**Issue:** The SideBySide row says: "Body belt NOT acceptable for fall arrest." This is correct. However, the left column (Positioning System) says "Body belt acceptable for positioning." The ANSI Z359.11-2021 standard currently recommends AGAINST body belts even for positioning, preferring full-body harnesses. OSHA 1910.268(g)(1) does still reference "safety belt and strap" as acceptable, but ANSI consensus is moving away from body belts. The lesson does address this in the Book vs. Field section (lines 199–216), but the SideBySide table says "body belt acceptable for positioning" as a flat statement without the evolving-standard caveat.

**Worker misread risk:** A worker reads the table on their phone and takes away "body belt is fine for positioning." They skip the Book vs. Field callout in the main text (which they read two screens earlier). The table becomes their reference point.

**Fix shape:** Add a parenthetical to the SideBySide left column OSHA row: "Body belt still allowed under 1910.268(g)(1) for positioning, but ANSI Z359.11 recommends full-body harness even for positioning — see Book vs. Field note above."

---

### R7-NEW-3 | MED | L07 MAD WorkedExample Approximation Formula Is Misleading at Higher Voltages

**Location:** `L07-working-near-energized-conductors.jsx` lines 278–326 (WorkedExample component)

**Field-crew usability defect:** The WorkedExample disclaimer says: "⚠ IMPORTANT: The formula below is a simplified linear approximation for teaching purposes only." However, the formula itself (`MAD = max(1.9, 1.9 + 0.022 × kV)`) produces a value at 7.2 kV of approximately 2.06 ft and at 72 kV of approximately 3.48 ft. OSHA MAD Calculator values at these voltages are roughly 2.0 ft and 3.5 ft respectively — close enough for the stated "building intuition" purpose.

**The real problem is the mental model the formula embeds:** Workers who use this tool will internalize "MAD grows very slowly with voltage — from 2 ft at 7 kV to 3.5 ft at 72 kV, that's only 1.5 feet over a 10x voltage increase." This is the correct shape, but the takeaway encourages a worker to think "a few more feet covers a lot more voltage." In reality, the REASON you always use the calculator is that the formula is non-linear with surges and system configuration factors that the linear approximation omits. A worker who uses the approximation on a system with unusual configuration (ungrounded, or with a high overvoltage ratio) may significantly underestimate the actual MAD.

**Stress-scenario risk:** Under time pressure, a worker might use the WorkedExample approximation instead of the actual OSHA calculator. The tool teaches them to distrust the calculator ("the approximation is basically the same") rather than always defaulting to the calculator.

**Fix shape:** Add a locked text line in the WorkedExample sanityCheck function output (not just the disclaimer header): "This approximation CANNOT be used for real field decisions. The linear model does not account for system configuration, surge factors, or ungrounded system voltage. For ungrounded systems, the actual MAD from the OSHA Calculator may be significantly higher. Always use the calculator: osha.gov/power-generation/rulemaking/madcalculator."

---

### R7-NEW-4 | LOW | L02 LOTO BranchingScenario End Node Is Inconsistent With LOTO Sequence Teaching

**Location:** `L02-lockout-tagout-loto.jsx` BranchingScenario, node `step5-end`

**Issue:** The `step5-end` end message says: "All six LOTO steps completed correctly. When done, remember: remove tools, clear the area, notify affected employees, then EACH authorized worker removes their own lock before power is restored."

The re-energization sequence here is: remove tools → clear area → notify → remove lock → restore power.

But 29 CFR 1910.147(e)(3) states: remove tools → ensure employees are clear → each authorized employee removes own lock → notify affected employees → restore energy.

The sequence taught in `step5-end` puts "notify" BEFORE "remove lock" — the correct order is "remove lock" THEN "notify affected employees." This is a subtle sequencing error that directly contradicts the re-energization section in L02's working-tier content (lines 180–186) which correctly teaches the sequence as: (1) remove tools, (2) ensure clear, (3) each worker removes own lock, (4) notify affected, (5) restore energy.

The BranchingScenario end message and the lesson prose teach different sequences. A learner who finishes the scenario but didn't fully read the prose takes away the wrong order from the scenario's final summary.

**Fix shape:** Update `step5-end` endMessage re-energization sequence to match 1910.147(e)(3) and the lesson's working-tier content: "remove tools → ensure all clear → each authorized worker removes own lock → notify affected employees → restore energy."

---

## 2. Worker Scenario Walk-Throughs — How the Curriculum Works in Field Use

### Scenario A: New hire, first solo manhole job, reads on phone at lunch

Worker reads L03 during lunch before their first solo vault entry. Strong: the In Plain English section is excellent — "A telecom manhole looks like a simple hole in the ground. It is not." lands immediately. The PRCS vs. 1910.268 distinction (the book vs. field callout) is the hardest cognitive load spike in the entire T18 curriculum — it requires holding two standards simultaneously and knowing which supersedes which. A new hire reading this on a phone at lunch will likely under-retain the superseding-standard nuance.

**Stickiness problem:** The 1910.268 vs. 1910.146 distinction is the most safety-critical concept in L03 (workers who misapply PRCS permit requirements for routine manholes either skip testing entirely ("we don't need a permit") or grind work to a halt), but it's buried inside a callout box that requires careful reading. Under cognitive load from new-job stress, the new hire's retention will be: "test the air, have an attendant, ventilate if needed." The standard-superseding-standard nuance will be lost. This is acceptable — the behavioral outcome is correct even without retaining the regulatory theory — but it may cause confusion at a job safety meeting when a safety officer references 1910.146.

**Recommendation (enhancement, not blocker):** Add a single "bottom line" sentence after the callout: "For routine telecom manhole work: follow the 1910.268(o) process (test, ventilate, attend). The full 1910.146 permit process only kicks in for conditions you cannot control with testing and ventilation."

### Scenario B: Veteran skims L04 fall protection for refresher

The veteran's dominant mental model is "body belt + pole strap = how we do it." L04's Book vs. Field section directly addresses this. A veteran skimming will find it immediately because it's in a colored callout box. This is good UX design for the refresher use case.

**Where the veteran disagrees and may disengage:** The SideBySide "Positioning System vs. PFAS" comparison directly challenges 40-year field practice. A veteran who reads "positioning straps don't arrest falls" will mentally add "except they kind of do if the strap catches." They're not wrong (a pole strap CAN catch a short fall), but they're right for the wrong reason — the strap wasn't designed for arrest and the arrest forces can injure. The lesson states this (lines 179–185) but only in prose. The SideBySide table doesn't include a "what happens to a body-belt wearer in a real arrest" outcome row. Adding that row ("Body belt concentrates arrest force on abdomen — can cause internal organ injury at fall distances where a harness would leave the worker uninjured") would create a more visceral hook for the skeptical veteran.

### Scenario C: Worker in a manhole needs the gas thresholds in 30 seconds

Opens L03 on phone. Has to scroll past the In Plain English section, past the 3-column acronyms table, past the confined space definition section to get to the thresholds table. The table is approximately the 4th screenful of content on a phone. Under gloves and in a dark space, locating a specific value takes ~45 seconds minimum, not 30.

**Quick-reference gap (R7-NEW-1 is a symptom of this broader gap):** T18 lacks a dedicated "field reference" card or mini-lesson that consolidates all the emergency threshold numbers in one place: gas thresholds (L03), fall protection heights (L04), glove classes (L05), traffic buffer distances (L06), MAB distances (L07), SDS section numbers (L08), OSHA report timelines (L09). A single "T18 Field Reference" lesson or sidebar component — formatted as a phone-friendly table — would have zero curriculum impact but massive field-usability value. This is an enhancement, not a correctness bug.

### Scenario D: Stress-induced narrowing — LEL alarm during manhole work

Worker inside a manhole, CO alarm sounds. The L03 BranchingScenario scenario `step3-enter → wrong-stay` teaches the correct exit behavior. But the behavioral gap is whether the worker's muscle memory (shaped by training) generates the "exit immediately" response without consulting the curriculum.

**What the curriculum gets right:** The BranchingScenario forces the learner to CHOOSE to stay (bad path) and then experience the consequence narrated in first-person ("you begin experiencing headache and disorientation"). First-person consequence narration is the strongest available mnemonic for stress-condition recall. This is excellent instructional design — no fix needed.

**What could be stronger:** The lesson doesn't teach the physical exit procedure (ladder grip sequence, equipment priority). "Exit immediately" is the right message, but a worker experiencing early CO impairment (80 ppm → headache + reduced coordination) may struggle with a ladder they've never practiced exiting quickly. This is a field-training / physical-drill gap that classroom training cannot fully address — but a sentence noting "equipment is secondary to getting out; do not stop for tools or splice materials" would reinforce the priority.

---

## 3. R-1 through R-6 Reconciliation

Reading R-1 through R-6 reports after the independent pass above.

| Finding | R-7 Assessment |
|---|---|
| R1-F1: ANSI Z359.11 body belt restriction understated | CONCUR. Also flagged as R7-NEW-2 from field-learner angle. |
| R1-F2: 1904.39 hospitalization "observation only" qualifier | CONCUR. R-6 flagged as regulatory misstatement. Field crew angle: a supervisor who read this lesson might tell a worker who's hospitalized for observation "we don't have to report this." HIGH stakes for small contractor. |
| R1-F3: L07 MAD Worked Example approximation has no audit trail formula | CONCUR and EXTEND via R7-NEW-3 — the approximation actively teaches workers to distrust the calculator. |
| R2-A1: H₂S IDLH should be 50 ppm not 100 ppm | CONCUR. From field learner perspective: the "100 ppm paralyzes smell" sentence is read as the danger threshold sentence. The 50 ppm IDLH is in the table (< 1 ppm entry safe) but the prose creates a 100 ppm anchor. Also aligns with R6-NEW-1. |
| R2-A2: L04 4-foot free-climb trigger described as "4 feet above ground" but 1910.268(g)(1) says "more than 4 feet" | CONCUR. Minor but a learner reading "working more than 4 feet above ground" (line 117) and the lesson saying "at more than 4 feet" are consistent — the lesson correctly uses "more than 4 feet" throughout. Concur the 4-ft vs. 4-ft+ distinction should be explicit in the quiz, which it is in Q1 ("more than 4 feet"). NMI (no marginal input from R-7). |
| R2-A3: L02 LOTO capstone scenario missing capacitor step | CONCUR (this is also R6-NEW-5). From field-learner angle: the LOTO BranchingScenario is the best-designed scenario in T18 — workers who complete it will remember LOTO. The R7-NEW-4 sequencing error in the end node is a separate issue from R6-NEW-5's stored-energy identification gap. |
| R3-T1: H₂S secondary implication even if 50 ppm corrected | CONCUR. The 100 ppm prose anchor needs to be actively dismantled, not just the number corrected. |
| R3-T2: Missing heat stress as standalone topic | CONCUR — OSHA cites heat illness under General Duty Clause (mentioned in L01 but not taught). From field-learner angle: in Macon, GA (Carter's location, summer temps routinely >95°F), heat illness is a real daily hazard for outdoor OSP crews. It warrants more than a parenthetical. However, this is a CURRICULUM GAP (scope) not a correctness defect. NMI — already captured in R-3. |
| R4: LOTO entry gate prerequisite for field-touching topics | CONCUR. From field-learner perspective: learners who skip LOTO (L02) and go directly to L03 (confined space) or L04 (fall protection) will encounter "hierarchy of controls" as assumed knowledge without the LOTO mechanics. The prerequisite enforcement is a platform/system question, but the lesson prerequisites metadata does correctly list T18.L01 and T18.L02 where needed. NMI. |
| R5: Capstone gate score 80% appropriate | CONCUR. 80% is appropriate. From field-learner angle: the capstone at 22 MC questions is the right length but the two BranchingScenario items are not formally scored in the capstone — they're pedagogically valuable but a learner can fail all BranchingScenario decision points and still pass at 80% on MC. Consider adding "pass both scenarios" as an additional capstone requirement. Enhancement, not blocker. |
| R6-NEW-1: H₂S 100 ppm prose anchor (legal) | CONCUR. R-7 independently found the same issue from usability angle (prose creates danger threshold anchor). |
| R6-NEW-2: Free-climb interrupted-task gap | CONCUR. The field-learner angle reinforces: a worker WILL pause mid-climb to handle an unexpected task. The current curriculum teaches "free-climb to work position, fall protection at work position" but not "any pause = work position." |
| R6-NEW-3: Informal field rule failure-mode detection gap | CONCUR and EXTEND. From field-learner angle: the three failure modes listed (deteriorated insulation, induced voltage, downed conductor) are described but NOT associated with a pre-work checklist. A worker going to a joint-use pole should have 3 specific things to look for BEFORE climbing. This is a missing "pre-work checklist" element. |
| R6-NEW-4: 1904.39 hospitalization "observation" qualifier | CONCUR (same as R1-F2). |
| R6-NEW-5: LOTO BranchingScenario stored energy identification gap | CONCUR. This is distinct from R7-NEW-4 (sequencing error in end node re-energization order). Both exist independently. |

---

## 4. DAG Sweep

T18 teaches at position #2 in the teaching order (after T01, before T02). DAG check:

**L01 prerequisites:** [`T01.L01`] — T01.L01 introduces 'OSP', 'RUS', and 'NESC'. L01 assumes these. Correct.

**L02 prerequisites:** [`T18.L01`] — L02 assumes 'hierarchy of controls', 'hazard recognition', '1910.268'. All introduced in L01. Correct.

**L03 prerequisites:** [`T18.L01`, `T18.L02`] — assumes LOTO and energy isolating device (from L02). Correct.

**L04 prerequisites:** [`T18.L01`] only — assumes '1910.268' (from L01). Correct. Does not list L02 as prerequisite, which is fine since LOTO is not needed for fall protection understanding.

**L05 prerequisites:** [`T18.L01`] — assumes hazard recognition and hierarchy. Correct.

**L06 prerequisites:** [`T18.L01`, `T18.L05`] — assumes 'hi-vis vest' (from L05). Correct. The cross-reference is the right dependency.

**L07 prerequisites:** [`T18.L01`, `T18.L05`] — assumes 'PPG glove class' and 'ANSI Z89.1 Class E' from L05. Also assumes 'pole' from T01.L01. Correct.

**L08 prerequisites:** [`T18.L01`] — assumes 'SDS' (from L01). Correct.

**L09 prerequisites:** [`T18.L01`] — assumes '1910.268' (from L01). Correct.

**L10 (capstone):** prerequisite list is all L01–L09. Correct.

**DAG CLEAN** — no violations detected. All vocabulary_assumed terms trace to their stated source_lesson_id.

One observation: L07 assumes 'pole' from `T01.L01` in vocabulary_assumed. That cross-topic assumption is fine. L07 also uses 'LOTO' implicitly (mentions LOTO sequencing for energized conductors in the Advanced section indirectly) but does not formally assume it — this is acceptable since the L07 advanced content doesn't depend on LOTO mechanics, only awareness.

---

## 5. Final Verdict + Saturation Recommendation

**Verdict: YELLOW**

**New findings this round (R-7):**
- R7-NEW-1: MED — L03 gas table lacks in-space exit thresholds (field-usability defect)
- R7-NEW-2: LOW — L04 SideBySide body-belt statement overstated without ANSI Z359 caveat
- R7-NEW-3: MED — L07 WorkedExample approximation teaches distrust of calculator
- R7-NEW-4: LOW — L02 BranchingScenario end node re-energization sequence contradicts lesson prose

**Total cumulative pool (all 7 rounds):**
- 4 HIGH
- 16 MED (14 prior + 2 new R7)
- 10 LOW (8 prior + 2 new R7)
- **Total: 30 findings**

**Saturation assessment:**

R-7 found 2 MED and 2 LOW new findings. The MED findings are from framings prior rounds hadn't specifically targeted (phone-in-field usability, in-space emergency reference). The LOWs are edge cases in BranchingScenario components not examined closely before.

**HIGH pool: saturated.** Three consecutive rounds (R-4, R-5, R-6, R-7) have found zero new HIGH findings. The 4 HIGHs from R-1/R-2/R-4 appear to be the ceiling.

**MED/LOW pool: not fully saturated.** R-7 still produced 4 new finds, though diminishing (R-5 found 5, R-6 found 6, R-7 found 4). A potential R-8 with ADA/accessibility framing or curriculum-sequencing-within-T18 framing could still surface 1-2 additional MEDs, particularly around: the BranchingScenario scoring gap (capstone), the heat stress scope gap, or the "pre-work inspection checklist" pattern missing from L07.

**Recommendation:** STOP AUDITING. Dispatch FIX WAVE. The 4 new R-7 findings are real but not HIGH severity. The cumulative 30-finding pool has enough signal to act on. A hypothetical R-8 is unlikely to find anything that changes the fix priority order. Return diminishing relative to cost.

**Top 3 fix priorities from R-7:**
1. R7-NEW-4 + R6-NEW-5: Fix both LOTO BranchingScenario errors (end-node sequence + stored energy) in one pass — same file, same scenario.
2. R7-NEW-1: Add exit-threshold column to L03 gas table — minimal effort, maximum field-usability gain.
3. R7-NEW-3: Strengthen the WorkedExample disclaimer with ungrounded-system caveat — one sentence in `sanityCheck` function.

=== T18 AUDIT R7 FIELD-CREW END ===
