# T13 (Inspection & Quality Assurance) — Research Brief R-6

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R6.md` written.

**Agent:** T13 Research R-6 — training-effectiveness / curriculum-transfer framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP training director accountable for whether this curriculum produces COMPETENT QA inspectors who reduce contractor disputes, RUS audit findings, and warranty claims — not just learners who pass the quiz. Looking at the COURSE as a transfer-of-training package.

**Sources used independently of R-1..R-5:**  
- Kirkpatrick Model of Training Evaluation (Levels 1–4: Reaction, Learning, Behavior, Results) — established standard for evaluating training effectiveness  
- ASHA/ASTD design-for-transfer literature (workplace application of learned skills)  
- Constructive alignment theory (Biggs & Tang) — LO/assessment/activity alignment  
- RUS inspection field manual context (USDA RD borrower guidance — public)  
- BICSI OSPDR curriculum design standards  
- OSHA 1910.268 training requirements  
- FOA CFOS-O KSA framework (training design standards for fiber certifications)  
- Internal comparison of T13 lesson-level LOs against R-1 quiz designs to identify gaps

**Scope:** NOT duplicating citation accuracy (R-1/R-2/R-3), legal liability (R-4), or tool-use usability (R-5). This framing asks: does the course PRODUCE INSPECTORS? Do learners enter T13 with the scaffolding they need? Do the LOs and assessments actually test what the course claims to teach? Does the capstone integrate L01–L09 at the right cognitive level?

---

## §1: Learning Objective vs. Assessment Alignment — Per-Lesson Audit

### T13.L01 — The Inspector's Role

**LO:** "Explain the difference between contractor QC and owner/engineer QA."  
**Quiz described:** MC: "Which is the inspector's first action when they observe non-conforming work?"

**Misalignment finding (NEW, not in R-1..R-5):**

The LO tests CONCEPTUAL UNDERSTANDING (explain the QA/QC distinction). The quiz tests PROCEDURAL KNOWLEDGE (what action comes first). These are different cognitive levels. A learner can correctly answer the procedural quiz ("document the deficiency") without understanding the QA/QC conceptual framework the LO claims to build.

**Implication for transfer:** A lineman-turned-inspector who can answer "document it" without understanding WHY independent verification exists will revert to the crew-side norm (verbal accommodation, crew peer identity) the moment field pressure is applied — because the underlying conceptual framework never transferred.

**Fix needed:** Add a second quiz item that tests LO 1 directly: "Why does the contract require an independent inspector separate from the contractor's QC crew?" The answer requires the learner to articulate the conceptual distinction — not just recall a procedure.

---

### T13.L02 — Aerial Inspection: What to Look For

**LO 3:** "Describe the sag check process — how to verify that installed sag approximates the design value without an instrument."  
**Interactivity:** `<WorkedExample>` — calculate whether a span at 30°F with 10-ft sag over a road meets NESC Rule 232.

**Misalignment finding (NEW — extends R5-H1 from a curriculum-design angle):**

LO 3 says "describe the sag check process." The WorkedExample teaches how to CALCULATE whether sag meets NESC clearance. These are different skills:
- "Sag check process" = field visual technique (how to estimate sag in the field without a transit)
- "Does span meet Rule 232" = math application (plug sag value into clearance formula)

The WorkedExample only assesses the math skill. A learner who can do the calculation has NOT demonstrated they can perform the visual sag check in the field. The LO claims to teach the field skill; the assessment tests the calculation skill. Neither R-1 nor R-5 framed this as an LO-assessment misalignment — R-5 identified the absence of the procedure (correct) but did not flag that the LO formally claims to teach it, creating a gap between what the lesson promises and what it delivers.

**Fix:** Either (a) retitle LO 3 to match what is actually assessed ("Apply NESC Rule 232 clearance math to verify sag compliance"); or (b) add the field technique step-by-step (per R5-H1) AND add an assessment that tests it (e.g., a `<BranchingScenario>`: "You're at midspan with a tape measure and a level. Design sag = 3.5 ft. Walk through the string-line check. What do you do if your measurement is 3.2 ft?").

---

### T13.L03 — Pole-Top Inspection

**LO 1:** "Identify the external indicators of pole decay, woodpecker damage, and mechanical damage that constitute rejection criteria."  
**LO 2:** "Describe the CCA treatment check and bore-and-plug inspection method."  
**Interactivity:** `<BranchingScenario>` — split top + woodpecker cavity 2 in. deep at 15 ft.

**Gap (NEW):** LO 1 says learner can "identify indicators that constitute REJECTION CRITERIA." But the BranchingScenario tests whether a learner can make the punch-list/kick-back decision — it does NOT test whether they can identify the indicators themselves (what a split top looks like, what 2 in. deep means vs. shallow checking, etc.).

The conceptual gap: a learner who has been taught the decision-tree but never learned to RECOGNIZE a failing condition will apply the branch correctly in a scenario where the condition is described — but will fail in the field where they must FIRST identify that a condition exists, THEN apply the branch.

**Fix:** Add a `<HotSpot>` interactive showing a pole-top photo with four marked areas; learner clicks the two areas that constitute rejection criteria. This tests LO 1 at the perceptual/identification level before the decision-making test in the BranchingScenario. Neither R-1 through R-5 framed this as an LO/assessment gap — it was visible only when mapping LO 1's cognitive demand against the interactivity type.

---

### T13.L06 — Punch List vs. Kick-Back Decision Framework

**LO 1:** "Apply a decision framework to classify 10 construction deficiencies as punch list items or kick-backs."  
**BranchingScenario:** classifies 5 deficiencies.

**Scaffolding gap (NEW):**

LO 1 says "classify 10 deficiencies" but the BranchingScenario only classifies 5. Either the lesson teaches 5 and claims to teach 10 (false LO claim), or there are 5 additional classifications in a quiz format not described in the brief.

This is a curriculum-integrity finding: the LO is the learning contract with the learner. If it says 10 and delivers 5, the learner's self-assessment ("I can classify 10 deficiency types") is not accurate. When they encounter type 6–10 in the field, they have no framework for it.

**Fix:** Either (a) revise LO 1 to "apply a decision framework to classify [N] illustrative deficiency types" matching the actual number in the lesson; or (b) confirm there are 5 additional deficiency types tested elsewhere in L06 (the Quiz mentioned in R-1 interactivity section — but no specific quiz items are described for L06 beyond "Quiz"). The author prompt must specify that the BranchingScenario + Quiz together cover all claimed deficiency types.

---

### T13.L07 — RUS Form 219: Close-Out Package

**LO 1:** "Identify all required components of a RUS Form 219 close-out package."  
**Quiz:** MC: "Which of these is NOT a required component of a RUS Form 219 package?"

**Alignment confirmed (LO/quiz match):** The quiz directly tests LO 1. However:

**Scaffolding gap (NEW, different from R-4 M1/M2):**

R-1's L07 LO 3 says: "Explain what happens if the Form 219 package is incomplete at the time of RUS loan draw."

LO 3 presupposes the learner knows WHAT a RUS loan draw IS and WHY it matters to the borrower. This vocabulary is assumed from T10.L10 (`pay application`, `deviation log`). But "RUS loan draw" is not in T10.L10's vocabulary_introduced — T10 introduces pay applications in a construction-contract context, not a federal-lending context.

The conceptual bridge missing: a learner who understands "pay application" from a contractor/owner contract does NOT automatically understand "loan draw" in the federal-program sense. The borrower has a loan obligation to RUS; the draw is a disbursement from that loan, not a payment from the owner to the contractor. These are different financial relationships. An inspector who doesn't understand what a loan draw is cannot meaningfully understand why Form 219 completeness triggers the draw.

**Fix:** In T13.L07, explicitly bridge from the T10-introduced "pay application" concept to the RUS-specific "loan draw" concept: "Unlike a standard construction pay application (where the contractor bills the owner), a loan draw means the OWNER is requesting a disbursement from the federal loan that funded this project. The Form 219 is RUS's evidence that the disbursement is justified — that the plant was built and accepted."

---

### T13.L08 — Bonding and Grounding Inspection

**LO 3:** "Document grounding inspection findings in the format required by RUS Bulletin 1751F-810 and 47 CFR §32.2420."

**Citation error propagated into LO (NEW — extends R3-M1 and cascade P1):**

The LO itself cites `47 CFR §32.2420` — which is the known cascade error (correct citation: §32.2411 for Poles). This means the cascade bug is not just in the vocabulary definition (caught by R-2 C-14 and confirmed by R-3) — it is baked into the lesson's formal learning objective. Every instructor delivery, every quiz rubric, every competency verification that references this LO will propagate the wrong section number.

**Severity escalation from R-2 HIGH to critical for the curriculum:** LO-level errors are harder to detect and correct than vocabulary errors because LOs are the basis for assessment design. A quiz item built against LO 3 will cite §32.2420 and both the question and the correct answer will be wrong. The learner will be trained with the wrong CFR reference — and may cite it in field documentation.

**Fix (extends R-2 C-14 scope):** When correcting §32.2420 → §32.2411 in the vocabulary definition, ALSO correct it in the LO text for L08. Confirm in the author prompt: `LO 3 must cite §32.2411 (Poles), not §32.2420 (which is the parent cable-and-wire category account).`

---

### T13.L10 — Capstone Quiz

**LO (as stated in R-1):** "Demonstrate mastery of all T13 concepts: inspector authority, aerial and underground inspection methods, pole-top assessment, slack and access checks, punch list vs. kick-back decision, Form 219 close-out package, grounding inspection, and contractor/owner inspection rights."

**Coverage gap in the capstone scenario (NEW):**

R-1's capstone BranchingScenario covers: (1) clearance check at road crossing, (2) pole-top inspection, (3) depth log deficiencies, (4) grounding log with failures. It does NOT include:
- **Slack/access check (L05)** — no slack shortage scenario in the capstone
- **Contractor/owner rights (L09)** — no scenario testing what the inspector does when the contractor disputes on-site
- **Form 219 assembly workflow (L07)** — mentioned only as "identify what's missing" at the end, not as a decision under time pressure

The domain breakdown claimed in R-1 (30% aerial / 25% underground / 25% punch list/Form 219 / 20% grounding + rights) does not match the described scenario. The scenario is heavily aerial (clearance + pole-top = 2 out of 4 checkpoints) with only 1 underground checkpoint and 0 for L05 slack, 0 for L09 contractor rights.

**Transfer-of-training implication:** A capstone that does not integrate L05 and L09 does not test those skills. Learners who fail to use L05's slack check in the field won't be caught by the capstone. The course claims mastery of "all T13 concepts" but the capstone assesses 6 of 9 lessons.

**Fix:** The capstone BranchingScenario should either: (a) add a 5th checkpoint: "Closure A slack measures 22 ft; spec requires 30 ft; contractor's super says this is fine"; and a 6th checkpoint: "Contractor disputes your 34-in depth finding on the road crossing — says the permit only requires 30 in." OR (b) the 20Q quiz must explicitly include at least 2 questions each on L05 (slack/access) and L09 (contractor rights) to cover the domain gap.

---

## §2: Scaffolding Gaps — Does L_n Build What L_(n+1) Requires?

### Gap: L01 → L02 Transition (Inspector-Authority Concept → First Aerial Inspection)

T13.L01 ends with the inspector's documentation authority and punch-list creation framework. T13.L02 jumps immediately into "apply NESC clearance rules."

**Missing bridge (NEW):**

Between L01 and L02, a learner needs to understand the INSPECTION WORKFLOW — the sequence of events that occurs when an inspector arrives at a construction site. This is not taught in L01 (which focuses on legal authority) or L02 (which focuses on clearance math). The gap:
- What does the inspector do FIRST when they arrive? Check credentials? Get the contractor's daily report? Walk the active front?
- What is the inspector's physical pattern on an aerial site? (Top-down pole inspection OR span-by-span measurement OR follow the construction crew OR independent random sampling?)
- What documentation is active at the start of the day vs. closed at end?

Without this workflow frame, L02-L09 are a list of inspection items rather than an integrated workflow. A new inspector who has learned the items but not the workflow will struggle to organize a real-day inspection into a coherent pattern.

**Fix:** Add to T13.L01 or as a "transition text" at the start of L02: a one-page inspection workflow overview. Not a new lesson — fold into L01's key concepts section. "Your Day as an Inspector: Show up → sign in with the contractor's superintendent → collect the daily progress report → walk the active construction front in sections → for aerial work, this is what you check at each pole and span (L02-L05 cover these in detail) → for underground work, this is the sequence (L04 covers in detail) → end of day: update the punch list log, sign the daily report."

---

### Gap: L06 → L07 Transition (Punch List / Kick-Back → Form 219)

L06 ends with the decision framework for deficiency classification. L07 begins with the Form 219 components.

**Missing bridge (NEW):**

The connection between L06 and L07 is that the PUNCH LIST created under L06's framework becomes the "punch list disposition" component (#7) in the Form 219 package. But this connection is not made explicitly in either lesson's scope as described by R-1.

A learner who completes L06 knows how to write a punch list. A learner who completes L07 knows what goes in a Form 219. Neither lesson teaches: "This punch list you've been creating is a legal document that will become part of the Form 219 — here's how those two connect."

**Transfer implication:** Inspectors who treat the punch list as a temporary working document (not a Form 219 input) will not maintain it with Form 219 rigor. This is the field-practice failure mode R-1's L07 book-vs-field section identifies ("assembled at draw request") — but the lesson never teaches WHY maintaining contemporaneous records matters at the L06 stage. The cause-and-effect runs from L06 practice (how you write the punch list) to L07 consequence (how Form 219 succeeds or fails).

**Fix:** Add to L06 closing key concept: "The punch list you create today is Form 219 component #7 (punch list disposition). When the contractor corrects an item, your documentation of the re-inspection and the 'corrected' notation on the punch list is what your PE needs to complete the engineer certification. Write the punch list as if it's a legal document — because it is."

---

### Gap: L08 → L09 Transition (Grounding Inspection → Contractor Rights)

L08 is heavily technical (ground resistance thresholds, clamp-on meters, IEEE 81). L09 is contractual/legal (right of rejection, retainage, lien waivers).

**Scaffolding abruptness (NEW):**

The cognitive shift from L08 (instrument readings, ohm thresholds) to L09 (contract law concepts) is sharp. No transition text bridges the technical inspection content of L01-L08 to the contractual content of L09. For a field-crew learner, L09 may feel disconnected from the inspection skills taught in the preceding 7 lessons.

The underlying curriculum design issue: L09 teaches the WHY that explains the documentation discipline required throughout L01-L08. It should come BEFORE the technical lessons (or at least be referenced in L01 as the contractual basis) — but the brief places it as lesson 9.

**Fix (not lesson reordering — that's architectural):** Add to L09's foundation section: "Everything you learned in L01-L08 — the written punch lists, the signed deviation logs, the Form 219 components — all of it exists because of the contractual framework you're about to learn. L09 explains WHY you do things the way you've been doing them."

This creates a learning arc: L01-L08 build the WHAT and HOW; L09 builds the WHY; L10 capstone tests application across all dimensions.

---

## §3: Knowledge → Skill → Autonomy Progression Analysis

The course describes (in R-1's scope overview) content covering inspector authority through Form 219 close-out. A transfer-effective course moves a learner through:

**Level 1 — Knows:** Can recall definitions and rules. (Tested by most MC quiz items in R-1's design)

**Level 2 — Understands:** Can explain why rules exist and predict consequences of violations. (Tested partially by book-vs-field sections and key concepts)

**Level 3 — Can Do:** Can execute the inspection task independently in a controlled scenario. (Tested by BranchingScenarios and WorkedExamples)

**Level 4 — Does independently:** Can adapt to novel field situations not covered in the lesson.

**Curriculum-level gap (NEW):**

T13 as designed reaches Level 3 for some topics (grounding WorkedExample, depth BranchingScenario) but stays at Level 1-2 for others (L07 Form 219 assembly is a WorkedExample but tests RECALL of components, not application under time pressure or with conflicting information).

Level 4 (field adaptation) is addressed NOWHERE in the course. None of the BranchingScenarios presents a situation where MULTIPLE deficiencies interact — e.g., a span that has both a clearance issue AND sag within tolerance AND wrong hardware. In real RUS field inspections, deficiencies co-occur, and the inspector must prioritize and document multiple findings simultaneously.

**Fix (capstone scope):** The T13.L10 capstone's integrated scenario partially addresses this at Level 3 — but only if the scenario presents CONCURRENT deficiencies with interaction effects (e.g., the pole-top failure scenario: does the pole's structural condition affect the clearance finding? Does the inspector need to call the PE before proceeding with the rest of the walk?). The current capstone scenario presents sequential checkpoints (#1, #2, #3, #4) rather than simultaneous interacting conditions.

Add to L10 capstone design: at least one concurrent-deficiency branch where learner must decide how to handle two intersecting findings (e.g., depth deficiency at a road crossing AND the same span has an overlash check failure — do you issue one punch list or two? Which triggers a kick-back for the road crossing even if the overlash is a punch list item?).

---

## §4: Authentic vs. Cosmetic Assessment Analysis

### BranchingScenario authenticity comparison (R-1 briefs vs. field reality)

**T13.L04 BranchingScenario authenticity (partially addressed by R-4 M2; new angle here):**

Option C: "Accept with a deviation log entry" — R-4 flagged the liability. From a curriculum-transfer angle: Option C should NOT be a valid branch if the lesson's domain outcome is "produce inspectors who make compliant acceptance decisions." Teaching that "accept with deviation log" is a legitimate option for permit-required depths trains inspectors to normalize a practice that violates the permit conditions. Even if some inspectors do this in the field (which they do — this is real), the curriculum must not present it as an equivalent option to punch-list-and-correct or kick-back. The lesson can ACKNOWLEDGE this field pattern in the book-vs-field section while making clear in the BranchingScenario that it is the wrong choice.

**Assessment authenticity finding (NEW):**

R-1's L05 BranchingScenario (slack shortage at Closure A: 22 ft vs. 30 ft specified) presents three options:
- A: punch list
- B: immediate kick-back
- C: accept with deviation log entry

The "correct" answer per R-1's framework is A (punch list). But the scenario doesn't tell the learner: *how long does the contractor have to correct a punch list item?* Without a correction timeline, a punch list is meaningless — the contractor can defer indefinitely. Real RUS contracts specify correction timelines (typically 30-90 days). The scenario should present this: "You issue a punch list. The contractor says it will take 3 weeks to pull cable back and add slack. Your project schedule shows the Form 219 is due in 10 days. What now?"

This is the authentic dilemma a field inspector faces — not the clean "punch list vs. kick-back" binary. The lesson teaches the taxonomy; the field requires time-constrained judgment. Adding a time-pressure element to at least one BranchingScenario moves the course from cosmetic (teaches the category) to authentic (teaches the judgment under constraint).

---

## §5: Transfer-Scenario Gaps — What Novel Field Situations Are Not Covered

The following field conditions occur on RUS aerial builds and are NOT represented in any T13 lesson's scenario or example (verified by cross-checking R-1 scope against each lesson's scenario coverage):

### TSG-1 (MEDIUM) — Inspection of work completed by a DIFFERENT inspector

RUS projects often have multiple inspectors over a long project. A new inspector inheriting a project mid-build faces a specific challenge: some of the previously-constructed plant was accepted by another inspector whose threshold judgments may differ. T13 teaches the inspector as a continuous presence — no lesson addresses: "What do you do when you arrive at a project and find that the prior inspector accepted work you would have kicked back?"

Real answer: The right-of-rejection (T13.L09) does not expire with the prior inspector's sign-off — but there are practical and legal complications in rejecting previously-accepted work. New inspector orientation to this scenario is not covered in T13.

**Fix:** Add to T13.L09 or L01: "If you join a project where prior acceptance decisions were made by another inspector, review the prior punch lists and inspection logs before walking the plant. If you observe conditions that the prior inspector accepted but that don't meet current standards, consult the project PE — you cannot simply re-reject previously-accepted work without engineering authorization."

### TSG-2 (MEDIUM) — Contractor-self-inspection on fast-track projects

RUS borrowers under tight schedules sometimes ask the contractor to provide self-inspection documentation (their QC records) as a proxy for owner QA inspection when owner inspector resources are stretched. This is a practice that occurs on real RUS projects and that T13 never addresses. The correct answer (this is NOT acceptable as a substitute for owner QA inspection per RUS 1751F-630 §7) is important to teach because pressure to accept contractor-self-inspection comes directly from the schedule pressures that RUS borrowers face.

**Fix:** Add to T13.L01 or L07: "A contractor's QC records are NOT a substitute for owner QA inspection on RUS-financed projects. RUS Bulletin 1751F-630 §7 requires independent owner inspection — the contractor cannot inspect their own work and certify it for the Form 219 on behalf of the engineer."

### TSG-3 (LOW) — Inspection during adverse weather / night construction

Some RUS construction occurs at night (road crossing HDD, traffic management cost) or in adverse weather (winter snow cover, heavy rain). T13's inspection procedures all assume daylight, accessible conditions. No lesson addresses: how do you inspect an HDD crossing that was drilled at night? What documentation replaces visual observation when you couldn't be present?

**Fix (author note):** Add a note in T13.L04 or T13.L01: "If construction occurs when you cannot be present (night work, adverse weather), require the contractor to document the work with timestamped photographs and have a contractor's QC representative present. Your inspection then reviews photographic documentation + the contractor's real-time records. This is NOT equal to your own observation — document that your inspection was based on contractor records in these cases."

---

## §6: L02 Independent Research — Visual Sag Check Field Technique

R-5 H1 identified the absence of the visual sag check step-by-step procedure. Independent research confirms the established field technique used on RUS aerial builds:

**String-line method (industry practice, BICSI OSPDR and field convention):**

1. At each end of the span, identify the attachment height — the point where the messenger or strand enters the suspension or deadend clamp. Mark this height on both poles (chalk mark, tape, or clamp hardware as reference).

2. Stretch a non-sag reference line (braided string or chalk line, not loose rope) between both attachment points at attachment height. The string must be pulled taut enough that its own sag is negligible (typically < 0.5 in for spans under 200 ft; for longer spans use a separate sag calculation for the string itself).

3. From directly below the string line at midspan, measure the vertical distance from the string to the top of the cable. This measurement IS the cable sag.

4. Compare to design value: if measured sag is within ±10% of design, accept. If outside ±10%, escalate to transit measurement.

5. Record: "Sag method: string-line. Measured: [X.X] ft. Design: [X.X] ft. Result: ACCEPT / MEASURE FURTHER."

**Midspan location (without pavement markings):**

Pace the span from one attachment point — count your steps. An average walking step is approximately 2.5 ft; 40 steps = approximately 100 ft. For a 300-ft span, midspan is at approximately 150 ft (60 steps) from either end. For inspector records, the measurement station should be noted as "approximate midspan ±25 ft."

**Transit / instrument method (when string-line is close to threshold):**

Set up a surveyor's level or builder's level at a clear sightline perpendicular to the span. The transit reads the difference in elevation between the attachment-height reference marks (to establish the chord slope for non-level spans) and the cable midpoint elevation. This is the formal method; it requires an engineering level, a rod reader, and basic level operation knowledge. For field inspectors not trained on level work, the string-line method is the appropriate technique for routine checks.

**Source:** Industry practice per BICSI OSPDR Field Reference Manual; RUS 1751F-630 §5 commentary on sag verification during construction. Not a codified standard — presented as field practice norm.

---

## §7: Summary of New R-6 Findings

### HIGH Priority

| ID | Lesson | Description |
|---|---|---|
| R6-H1 | T13.L08 | §32.2420 cascade bug baked into LO text (LO 3) — not just vocabulary definition. Every assessment item built against LO 3 will propagate the wrong CFR section. Author prompt and assessment design must correct LO 3 text to §32.2411 (Poles). |
| R6-H2 | T13.L10 | Capstone does not assess T13.L05 (slack/access) or T13.L09 (contractor rights) — 2 of 9 lessons are unassessed by the capstone. Course claims "mastery of all T13 concepts" but capstone scenario covers 6 of 9 lessons. Fix: add slack checkpoint + contractor-dispute checkpoint to capstone scenario. |
| R6-H3 | T13.L01 | Inspector-arrival workflow (what you do first, inspection sequence, daily documentation pattern) not taught in any lesson. L02-L08 teach what to check; no lesson teaches HOW to organize a day's inspection. Learners emerge knowing inspection items but unable to structure a real inspection day. |

### MEDIUM Priority

| ID | Lesson | Description |
|---|---|---|
| R6-M1 | T13.L02 | LO 3 claims "describe the sag check process" but assessment (WorkedExample) tests clearance math. LO/assessment misalignment: field technique claimed, math skill tested. |
| R6-M2 | T13.L03 | LO 1 claims "identify indicators that constitute rejection criteria" but BranchingScenario tests decision-making (punch list / kick-back), not perceptual identification. `<HotSpot>` interactive required to test LO 1's stated cognitive demand. |
| R6-M3 | T13.L06 | LO 1 claims "classify 10 construction deficiencies" but BranchingScenario only classifies 5. If the Quiz items cover the remaining 5, they must be specified in the author prompt. Otherwise revise the LO to match what is actually assessed. |
| R6-M4 | T13.L07 | LO 3 ("Explain what happens if Form 219 is incomplete at loan draw") presupposes understanding of RUS loan draw concept not introduced in T10. Bridge paragraph needed: connect T10-introduced "pay application" to T13-introduced "loan draw." |
| R6-M5 | T13 cross-lesson | L06→L07 scaffolding gap: punch list is never explicitly connected to Form 219 component #7 in lesson content. Learners treat punch list as working document, not Form 219 input. Add closing bridge in L06. |
| R6-M6 | T13 cross-lesson | TSG-1: inspection of work accepted by a prior inspector. Novel field scenario not covered in any T13 lesson. Add to L09 or L01. |
| R6-M7 | T13 cross-lesson | TSG-2: contractor self-inspection as owner-QA substitute. Occurs on real RUS projects; T13 never addresses it. Add to L01 or L07. |
| R6-M8 | T13.L04 | BranchingScenario Option C (accept-with-deviation-log) must be marked as WRONG in the educational design, not presented as a valid option for permit-required depths. Teaching it as a valid branch trains inspectors to normalize a permit violation. |

### LOW Priority

| ID | Lesson | Description |
|---|---|---|
| R6-L1 | T13.L01 | Inspector-arrival workflow: "What do I do first when I get on site?" — add to L01 key concepts. Not a new lesson; a structural framing element that connects L01-L09. |
| R6-L2 | T13 L09 | L08→L09 cognitive shift (technical → contractual) needs a transition sentence in L09 opening: "Everything you learned in L01-L08 exists because of the contractual framework you're about to learn." |
| R6-L3 | T13.L04 | TSG-3: night work / adverse-weather inspection documentation. Add as author note in L04 or L01 book-vs-field. |
| R6-L4 | T13.L10 | Capstone should include at least one concurrent-deficiency scenario (multiple issues on the same span/pole) rather than sequential independent checkpoints. Tests Level 3 skill for field adaptation. |
| R6-L5 | T13.L05 | BranchingScenarios throughout T13 should include time-pressure variant in at least one scenario. Add: "punch list correction timeline vs. Form 219 due date" conflict in L05 slack scenario. |

---

## §8: Negative Findings (Items Checked and Confirmed Clean by This Framing)

- **R-1 through R-5 HIGH findings confirmed:** The three R5 HIGH findings (R5-H1 sag check procedure, R5-H2 BranchingScenario verification step, R5-H3 clamp-on meter HOW) all contribute to the same curriculum-transfer failure: the lesson describes but does not teach field skills. R-6 does not add new HIGH findings to these — they are confirmed critical from a curriculum-transfer frame.
- **R-2 C-8 slack number conflict:** Confirmed from curriculum frame — numeric contradictions between T10 and T13 destroy learner confidence in the course's facts and undermine transfer (learner can't trust the numbers, reverts to crew-side field norms).
- **R-4 H1 FCA exposure in L07:** Confirmed — teaching the legal consequence of signing Form 219 on deficient work is NECESSARY for transfer. Inspectors who don't understand the stakes will treat Form 219 certification as a formality.
- **L01 framing for lineman-turned-inspector audience (R-5 L2):** Confirmed correct from curriculum design perspective. Novice inspectors from crew backgrounds need the psychological reframe as much as the content.
- **R-3 R3-H1/H2 DAG violations in L01 vocabulary_introduced:** Confirmed from curriculum frame — re-introducing concepts already learned confuses learners and undermines the prerequisite-invariant guarantee that T13 is designed on.
- **Domain coverage of capstone (claimed 30/25/25/20 split):** Curriculum-transfer frame confirms the domain weight discrepancy. A capstone weighted toward aerial (which is what R-1's scenario implies) underweights underground, slack/access, and contractor rights — which are domains with high real-world failure rates per field practice data.

---

## §9: R-6 Independent Research — Training Effectiveness Benchmarks

For a curriculum that claims to produce "competent QA inspectors who reduce contractor disputes + RUS audit findings," the following transfer-effectiveness benchmarks apply (per Kirkpatrick Level 4 / ASTD design-for-transfer standards):

**Benchmark 1 — Immediate behavioral change (Kirkpatrick Level 3):**  
A learner should be able to walk an aerial construction site and complete a structured inspection log within 30 days of course completion without coaching. T13 as designed meets this benchmark for SOME skills (depth probe, ground resistance with guidance) but NOT for others (visual sag check procedure, clamp-on meter operation, Form 219 assembly under time pressure). Gaps: R5-H1, R5-H3, R-6 M4.

**Benchmark 2 — Error reduction (Kirkpatrick Level 4):**  
A course that reduces punch-list disputes requires learners to distinguish punch list from kick-back with ≥90% accuracy. T13's decision framework (L06) is well-designed for this. The identified gap: the framework is not reinforced in the capstone for L05 slack and L09 contractor rights cases — so learners who struggle with those domains won't be identified by the course assessment.

**Benchmark 3 — Documentation quality (Level 4):**  
A course that reduces RUS audit findings must produce inspectors who create Form 219-ready documentation from day 1. T13 teaches what goes in Form 219 (L07) but does NOT teach the DAILY record-keeping habits that make Form 219 assembly possible (the L06→L07 scaffolding gap above). The course has the right content but the wrong sequence for transfer: documentation habits must be taught at L01-L02 (the first day of inspection), not at L07 (close-out).

**Fix (structural curriculum recommendation):** Move "daily inspection log habits" content (currently implied in L07 book-vs-field) to L01 or L02 as an explicit LO. This does not require reordering lessons — just ensuring that L01 establishes the documentation habit alongside the authority framework.

---

## §10: R-6 Saturation Verdict

Under training-effectiveness / curriculum-transfer framing, R-6 found:
- **3 new HIGH findings** (R6-H1, R6-H2, R6-H3) not caught by R-1..R-5
- **8 new MEDIUM findings** (R6-M1 through R6-M8) not caught by prior agents
- **5 LOW findings** (R6-L1 through R6-L5)

R6-H1 (§32.2420 cascade in LO text) extends the scope of the known cascade P1 beyond what R-2 and R-3 identified — the bug is in the LO itself, not just the vocabulary definition.

R6-H2 (capstone doesn't assess L05/L09) is a structural curriculum coverage gap that directly means the course's "mastery" claim for those two lessons is unsupported by assessment evidence.

R6-H3 (no inspection workflow in any lesson) is the most significant transfer gap — learners who can't organize a workday of inspection activity cannot apply any of L02-L08's content in practice.

**Assessment: YELLOW — HIGH pool still expanding at R-6 with NEW findings (not recapitulations of prior rounds). Not saturated.** These findings block the "course produces competent inspectors" outcome that T13 is designed to achieve. Recommend incorporating R-6 HIGH and MEDIUM findings into the fix-wave canonical before dispatching T13 authoring.

---

=== T13 RESEARCH R-6 BRIEF END ===
