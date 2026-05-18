# T13 (Inspection & Quality Assurance) — Research Brief R-5

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R5.md` written.

**Agent:** T13 Research R-5 — field-crew worker / learner usability framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP lineman / construction foreman stepping into the inspector role for the first time. Field-experienced, no formal engineering school, 10+ years hanging cable and digging trench. Reading T13 lessons to become a competent QA inspector. Hunting for:
- Vocabulary I'd hit cold without foundation
- Math that skips steps I can't follow without a degree
- Field-practice gaps where book theory ≠ what I encounter on a real RUS job
- BranchingScenarios that punish me for doing what experienced crews actually do
- Quiz questions testing memorization instead of judgment I can USE in the field
- Examples that assume I already know engineering concepts I haven't been taught

**Independent gap-research per directive 22:** sampled under-audited lessons (L02 aerial/clearance, L05 slack/pedestal, L06 punch list, L08 grounding inspection). These lessons received fewer direct findings across R-1..R-4 than L01 (DAG violations), L04 (Proctor conflicts), L07 (Form 219 legal gaps), and L09 (contractor rights). Applying learner-usability lens specifically to these under-audited surfaces.

**NOT duplicating R-1..R-4 findings.** This brief focuses on learner-experience gaps that no prior framing caught.

---

## §1: Under-Audited Lesson Deep Dives

### T13.L02 — Aerial Inspection: What to Look For

R-1 through R-4 flagged: G-1 (wind/season clearance), G-2 (overlash), C-3 (Grade B/C distinction), R4-L1 (NESC clearance = negligence per se). Zero findings addressed HOW a field-experienced lineman would actually learn to do the visual sag check.

#### FINDING R5-H1 (HIGH) — Visual sag check method described but NOT TAUGHT

**What a lineman learner encounters:**

R-1 describes the sag check method as: *"The inspector sights across the sag point of the cable with a level — when the line-of-sight from one support attachment-height to the other passes through the wire's midpoint at the expected sag depth below the attachment chord, the sag is approximately correct."*

A new inspector reading this has zero context for:

1. **What is "the attachment chord"?** The chord is an imaginary line between the two attachment points. A learner with 10 years on the job knows what attachment points are (they've set hundreds of them) but does NOT necessarily know the term "chord" in a geometric context or how to visually establish the chord in the field without a transit.

2. **How do I know where "midspan" is?** On a 350-ft span with no pavement markings, how does a field inspector locate the midpoint from ground level accurately enough for a useful sag estimate? R-1 says "the sag is at midspan" but doesn't explain HOW to find midspan from the ground.

3. **What does "within 10% of the sag limit" mean practically?** The escalation rule says "use an instrument when within 10% of limit." A new inspector needs a concrete example: "Design sag = 4.0 ft. If your visual estimate is anywhere from 3.7 ft to 4.3 ft, set up the level — visual estimation isn't precise enough."

4. **No mention of the string-and-stake method.** Many RUS field inspectors who lack a transit use a string line stretched between attachment height markers on adjacent poles to establish the chord visually. This is a real field technique and the most accessible method for a non-engineer first-time inspector. R-1 only mentions "engineering level" as an alternative to the transit — the string-line method is the non-instrument fallback most field-experienced learners will actually use.

**Why this is HIGH:** T13 teaches inspection. If the sag check method is described but not actually taught step-by-step in a way a field lineman can execute independently, the lesson produces inspectors who write "sag: approximate" on the inspection log rather than performing the check. That's a systematic QA failure on every aerial build this person inspects.

**Fix:** Add a step-by-step sag check procedure in L02 scope:
1. Locate the nearest attachment point markers on both poles (the point where the messenger meets the clamp).
2. Establish midspan: count equal sections from both poles, or pace the span and halve it.
3. Place your eye at attachment height on one pole (use a tape or marker at that pole) and sight to the attachment height on the opposite pole. The imaginary line between them is the chord.
4. The cable at midspan should sag below that chord by the design sag depth.
5. If your sag estimate is within ~10% of the design value (example: design = 4.0 ft, your estimate is 3.7–4.3 ft), confirm with a level or string-line.
6. String-line method: stretch a taut string or chalk line between the two poles at attachment height. Measure down from the string to the cable at midspan — this distance is the sag.

Include a `<WorkedExample>` or `<AnnotatedDiagram>` demonstrating the string-line method with numbers.

---

#### FINDING R5-M1 (MEDIUM) — Drip loop: the field definition skips the "HOW to inspect" step

R-1's definition of drip loop is technically correct. But from a learner usability perspective: the lesson says *what* a drip loop is (gravity causes water to run to the low point) and *why* it matters (keeps water out of closures). It does NOT say **how to verify one on inspection** or **what "no drip loop" looks like in the field vs. "drip loop present."**

Field reality: drip loops on aerial-to-closure entries are sometimes 2 inches of downward curve and sometimes 18 inches. What's the minimum drip that counts? Learners need a concrete inspection criterion:
- **Acceptable drip loop:** cable makes a downward arc, lowest point is at least [X] inches below the closure entry port, so water on the cable runs DOWN and DRIPS before it reaches the port.
- **Failed drip loop:** cable enters the port pointing upward or level, or makes a drip arc whose lowest point is above the entry port.

Without this, a new inspector will mark "drip loop: present" for any cable that curves slightly before entry, including cables where water would still run INTO the fitting.

**Fix:** Add a minimum drip depth criterion (industry practice) to the drip loop definition in L02, or add a `<HotSpot>` interactive showing three closures: one with correct drip loop, one with marginal, one with none. Learner clicks to identify which needs a punch list.

---

### T13.L05 — Slack, Storage, and Access Point Checks

R-1 through R-4 flagged C-8 (slack number conflict with T10.L06), G-6 (label format), G-7 (coil direction). No learner-usability findings in prior rounds.

#### FINDING R5-M2 (MEDIUM) — Pedestal access check describes a list but not an ORDER of operations

R-1's `pedestal access check` definition lists six items to verify: plumb, anchored, latched/locked, labeled, drip loop, cable entry sealed. But for a field-crew learner, **order matters**. If I arrive at a pedestal and start the check, what's the logical inspection sequence?

A line crew member used to doing things systematically (they sequence pole climbing, lashing, splicing) will ask: "Do I start outside or inside? Do I check the label before I open it, or after? Do I test the lock before or after I check the cable entry?"

The current R-1 brief presents this as a flat list. Learners are more successful when inspection checklists have an explicit sequence tied to what they observe in physical space — exterior before interior, top-down, etc.

**Practical gap:** R-1's vocabulary definition says "latched and locked (where specified)" but doesn't address: how does the inspector KNOW if the pedestal is supposed to be locked on a given project? The spec sheet? The contract? A visual observation of a hasp but no padlock? New inspectors who don't know where to find the locking requirement will skip this item entirely.

**Fix:** Add to L05 scope: a structured pedestal inspection sequence (exterior first: plumb → anchored → labeled → latched/locked per contract → drip loop; then interior: cable entry sealed → NIU population → slack coil). Add a sentence on where to find the locking requirement (contract scope or design drawing note).

---

#### FINDING R5-M3 (MEDIUM) — Slack verification: the tape-measure step is described but the RECORDING FORMAT is not

R-1 book-vs-field section correctly identifies that many inspectors estimate slack visually ("that's about 30 feet") rather than measuring. The lesson instructs: measure with a tape at "critical slack points." 

But for a new inspector: **what does the recorded entry look like?** R-1 never shows an example inspection record entry. A field-experienced person who's been on the crew side knows what a contractor's tally sheet looks like — but they've never maintained the INSPECTOR'S version of that document.

Without a sample format, learners:
1. Improvise their own format (which may be incomplete)
2. Omit required fields (which entry is the "critical slack point" designation? who designates it?)
3. Produce records that don't match the Form 219 grounding documentation format expected by the engineer

**Fix:** Add to L05 a sample inspection log entry for slack verification:
```
Closure ID: SP-14
Location: Station 142+40, LHS pedestal
Measured slack: 28 ft (tape measured, wire pulled straight)
Specified minimum: 30 ft
Result: DEFICIENT — 2 ft short
Action: Punch list #PL-007, correction required before Form 219
Inspector initials: ___   Date: ___
```
This models both the format AND the action-documentation expected. A `<WorkedExample>` primitive could display this interactively.

---

### T13.L06 — What Triggers a Punch List vs. a Kick-Back

R-1 through R-4 focused heavily on this lesson (decision framework table, retainage, partial payment, the 10% grounding threshold citation gap). No learner-usability findings.

#### FINDING R5-H2 (HIGH) — The BranchingScenario punishes the correct experienced-crew behavior

R-1's T13.L06 BranchingScenario classifies 5 deficiencies. Item #3: "Wrong cable type installed on a 2,000-ft segment." R-1's table says: kick-back (wrong material cannot be corrected in-place).

But from a field-experienced learner's perspective, this scenario is MISSING the critical step: **how do I know it's the wrong cable type?** A line crew foreman knows cable designations (they order the cable) but may not know all the specification requirements that make a specific cable "correct" vs. "wrong" for a RUS project.

The scenario branches to "kick-back" but doesn't teach the inspector how to verify the cable type claim. The real inspection skill is: compare the cable reel's specification label (or manufacturer's certification letter) against the contract's cable specification. If the inspector doesn't know WHERE to find the contract's cable specification or WHAT to match against it, the kick-back scenario is untestable in the field.

Similarly: Deficiency #2 in the scenario: "Three consecutive spans with sag 15% below design value." For an experienced lineman as a new inspector, the REAL question is: "How did I get a measurement that said 15% low — did I use the string-line method? Did I actually measure or estimate?" The scenario assumes the measurement is correct without addressing measurement confidence — which is the real field judgment call.

**The underlying learner-usability problem:** The BranchingScenario teaches the DECISION framework but not the VERIFICATION step that precedes the decision. A new inspector who reaches a branch point in the field will be asking "but how do I KNOW?" before they can make the decision.

**Fix:** Add to each branch scenario: a one-sentence "How you verify this" step before the decision branch. Example: "Wrong cable type: Open the reel label and compare the specification code to the contract drawing's cable schedule. If no match: kick-back." This makes the scenario teach inspection verification AND decision-making together.

---

#### FINDING R5-M4 (MEDIUM) — "Isolated deficiency" vs. "pattern" distinction is not operationalized for a new inspector

R-1's decision framework table says: "Pattern of same deficiency (≥3 occurrences in a segment) = kick-back." But: what is a "segment"? A span? A section between poles? Between handholes? The contract stationing? For an experienced lineman, "segment" has a physical meaning they're used to — but the inspection context uses it as a specific administrative unit.

Without knowing what a segment is, a new inspector can't apply the "≥3 occurrences in a segment" rule. They might see 3 drip-loop failures spread across 4 different contract segments and call each a separate isolated deficiency, when the aggregate should trigger a kick-back.

**Fix:** Add to L06 a definition or cross-reference: "segment" in the inspection context = the unit of construction specified in the contract pay schedule, typically matching a stationing range or a permit section. If the contract doesn't define inspection segments, the inspector's engineer should designate them. Add to author prompt: include a note on what "segment" means in punch-list/kick-back decisions.

---

### T13.L08 — Bonding and Grounding Inspection

R-1 through R-4: most findings focus on citation accuracy (NEC §250.53 vs §250.56), threshold clarity, primary protector inspection gap. No learner-usability findings.

#### FINDING R5-H3 (HIGH) — The clamp-on ground resistance meter: zero instruction on HOW TO USE IT

R-1 states: "Inspectors do not repeat the full IEEE 81 test for every pole; they verify the contractor's test log and spot-check using a clamp-on ground resistance meter at selected poles."

For a field lineman transitioning to inspector: they know what a multimeter is, they've done continuity checks. But a clamp-on ground resistance meter (Fluke 1630, AEMC 6416, etc.) is DIFFERENT from a continuity tester or a multimeter. It uses a different operating principle (electromagnetic induction) and requires specific technique — especially for the clamp-on method on an aerial pole's grounding conductor:

1. **The clamp goes AROUND the bonding conductor, not around the ground rod itself** — this is counterintuitive and a common first-time mistake.
2. **The reading must be taken with the bonding conductor CONNECTED** — some new inspectors disconnect the conductor first (because they're used to resistance tests requiring open-circuit conditions). Disconnecting invalidates the clamp-on reading by breaking the current return path.
3. **Stray electromagnetic fields from nearby power lines affect the reading.** In a joint-use environment (telecom on the same pole as power distribution), the clamp-on reading can be significantly disturbed. The inspector needs to know whether the reading is credible or whether the fall-of-potential method is required.
4. **Which number on the meter display is the ground resistance?** Clamp-on meters display loop resistance, which includes the ground rod plus the return path. On a properly bonded aerial plant, this approximates the individual rod resistance. But if two or more rods are interconnected, the clamp-on reading includes both — which is what you want, but new users often don't understand why the reading differs from a single-rod fall-of-potential test.

The lesson teaches THAT a spot-check is done with a clamp-on meter, but does NOT teach HOW to use the meter. An inspector who doesn't know how to operate it correctly will either get wrong readings or skip the spot-check entirely (which is what the book-vs-field section identifies as the common failure mode — but the lesson doesn't address whether the inspector actually knows how to use the tool).

**Fix:** Add to L08 a step-by-step "clamp-on spot-check procedure" (4-5 steps, no jargon, referencing the physical tool):
1. Locate the bonding conductor (the wire running from the messenger to the ground rod).
2. Open the clamp and place it around the bonding conductor — the conductor passes through the center of the clamp jaw.
3. Keep the clamp at least 18 inches from any metal hardware (suspension clamps, through-bolts) and at least 24 inches from any energized supply conductor.
4. Read the displayed resistance value. Expected: ≤25 Ω for a properly-grounded pole in most RUS contracts. Record in the grounding inspection log.
5. If the meter reads OL (overload) or clearly unstable (reading jumping by more than ±5 Ω), flag for full fall-of-potential test rather than accepting or rejecting based on the unstable reading.

A `<WorkedExample>` with a diagram of clamp placement would be extremely valuable here.

---

#### FINDING R5-M5 (MEDIUM) — Bond continuity check is described but the EQUIPMENT needed is not identified for a lineman

R-1 defines `bond continuity check` as: "Performed with a clamp-on ohmmeter or continuity tester. Acceptable reading: ≤1 Ω loop resistance."

A field-experienced lineman will hear "ohmmeter" and reach for their multimeter. **But the continuity function on a typical digital multimeter tests resistance at microamp current levels — it is NOT the same as a loop resistance test for a bonded aerial plant.** The ≤1 Ω threshold in a ground environment requires a low-resistance ohmmeter (a 4-wire Kelvin bridge or a dedicated bond tester) for accurate measurement at low values.

For most RUS field inspection purposes, the clamp-on ground resistance meter (same tool as in R5-H3 above) measures the bond loop resistance when placed around the conductor with the system active. This is "good enough" for a spot-check. But the lesson tells the learner to use an "ohmmeter" without specifying: does a $15 radio-shack digital multimeter work? No. Does the $350 Fluke clamp-on they're using for ground resistance work? Yes, if used correctly.

**Fix:** In L08, specify the tool: "Bond continuity check uses the SAME clamp-on ground resistance meter as the resistance spot-check (placed around the bonding conductor between the messenger and the ground rod). A standard digital multimeter continuity beeper is NOT adequate for this measurement — it operates at microamp current and cannot accurately resolve the ≤1 Ω threshold in a field environment."

---

## §2: Global Learner-Usability Findings (Cross-Lesson)

These gaps appear across multiple lessons or in the lesson design overall — not isolated to a single lesson.

### FINDING R5-M6 (MEDIUM) — No "inspection kit" lesson or reference: what tools does an inspector carry?

Every lesson in T13 assumes the inspector arrives at the job site and begins inspecting. But for a field-crew person transitioning to inspector role, a basic question is never answered: **what do I bring with me?**

Compare this to T10 (OSP Construction), which presumably teaches the crew's tool requirements for each task. T13 never provides the equivalent for inspectors. Field crew learners will ask:
- Do I need a transit, or can I use a level?
- What brand/model clamp-on meter should I get?
- What forms do I print out and carry?
- Do I need a probe rod, or does the contractor bring one for me?
- Do I need a torque wrench? (Spoiler: yes, to spot-check hardware torque. Never mentioned in R-1.)

**The specific gap identified in L02:** T13.L02 introduces `hardware torque compliance` and says hardware must be tightened to manufacturer's specified torque. **But the lesson does not tell the inspector that they need to carry a torque wrench to verify torque.** A verbal check ("did you torque that?") and a visual check (bolt is seated flush) are insufficient for documentation purposes. Without mentioning the tool, a learner will do the visual check and believe they've completed the hardware inspection.

**Fix:** Either (a) add an L01-type "inspector's tool kit" content section to T13.L01 (listing the minimum tools: probe rod or cover card, tape measure, clamp-on ground resistance meter, torque wrench or torque multiplier screwdriver, inspection log forms, camera) OR (b) integrate tool identification into each lesson's interactivity ("What tool do you need for this check? Pick from the kit."). Option (a) is simpler and establishes a usable mental model before the learner hits the specific checks in L02–L08.

---

### FINDING R5-M7 (MEDIUM) — BranchingScenarios assume the inspector is ALONE on the job; real field reality involves crew dynamics

R-1's BranchingScenarios (L04 depth deficiency, L05 slack shortage, L06 deficiency classification, L10 capstone) consistently frame the inspector as the sole decision-maker: "What is your required action?"

But on actual RUS construction projects, especially ones Carter's firm does for PSC, the inspector is typically present when the contractor's superintendent or foreman is ALSO there. The real decision isn't just "punch list or kick-back" — it's "punch list or kick-back in front of a contractor superintendent who is going to push back, and possibly threaten to go around you to the project manager."

Field-crew learners know this dynamic well from the crew side. They've been on the receiving end of inspectors who backed down, got overruled, or found a compromise. As an inspector, they need to know:
1. What to say when the contractor says "that's within tolerance in the industry."
2. What to do when the contractor's project manager calls their project manager.
3. Whether they have the authority to issue a written punch list item even if the contractor verbally disputes it.

The current BranchingScenarios present clean decisions in a social vacuum. Adding even one scenario branch that includes "Contractor disputes your punch list item on the spot" would teach the learner the PROCESS for handling disputes — not just the classification framework.

**Fix:** Add one branch option to at least the L06 and L10 BranchingScenarios: "Contractor says your deficiency call is wrong and asks you to accept. What do you do? A: Defer and remove from punch list; B: Document your finding as written and tell the contractor disputes go through the project engineer; C: Negotiate a compromise on the spot." The correct answer (B) with explanation of why (AIA A201 §12.2 anti-waiver, inspector as owner's agent not arbitrator) teaches both the procedure AND the doctrine from R-4-H2 in a learner-accessible way.

---

### FINDING R5-L1 (LOW) — Quiz questions throughout T13 test RECALL of rules, not APPLICATION of judgment

R-1's quiz questions as described:
- L07: "Which of these is NOT a required component of a RUS Form 219 package?" (recall test)
- L05: "What is the primary reason minimum slack at a splice closure is specified?" (recall test)

These questions can be answered correctly by someone who memorized the lesson bullet points without having internalized any judgment. A field-crew learner who has 10 years of experience will know these answers from pattern matching — but they won't know HOW TO APPLY the rule in a novel situation.

Better quiz design for this audience: scenario-based questions that require judgment application:
- "You arrive at a closure where the contractor measured 33 ft of slack. The spec says 30 ft minimum. But the slack is coiled against a 4-inch radius bend. Do you accept? Why or why not?" (Tests both slack quantity AND the bend radius interaction that invalidates otherwise-adequate slack)
- "The contractor's Form 219 package has all 8 components signed and stamped, but the OTDR test reports show results from 14 days before the acceptance walk — 2 days before the last 400 ft of cable was blown in. Is the package complete? Why or why not?"

These questions force application, not recall. They also teach content the learner will USE — the answers model the reasoning process a real inspector applies.

**Fix:** In the author prompt for T13, require that at least 50% of quiz questions use a scenario format ("You observe X, the spec says Y, what do you do?") rather than a pure recall format ("What is the minimum slack at a splice closure?").

---

### FINDING R5-L2 (LOW) — L01's "inspector vs. contractor" framing misses the inspector-as-CREW-MEMBER transition for this audience

R-1's T13.L01 is titled "The Inspector's Role: Not the Enemy." This is written from the perspective of a new inspector who might act adversarially. But Carter's audience is line-crew members BECOMING inspectors — they spent years on the contractor side. Their problem is NOT that they'll be adversarial — it's that they'll be TOO SYMPATHETIC to the crew and defer to contractor judgment because they identify with the crew.

For a lineman-turned-inspector, the hardest part of the role is writing up your former coworker or a crew doing good work under difficult conditions. The lesson's psychological framing ("not the enemy") is correct for a traditional engineering-school-trained inspector who might be cold or adversarial. But for this audience, the lesson should acknowledge:

"If you've spent years on the crew side, your instinct will be to cut the crew some slack — you know what it's like to have hard rock at 34 inches when the spec says 36. The job of the inspector is NOT to punish the crew for conditions they didn't create. BUT your job IS to document what you see, accurately, so the owner has a true record of what was built. Accurate documentation of a real-world constraint (hard rock at road crossing) is BETTER for the contractor than a log that says '36 inches achieved' when it wasn't — because the deviation log creates a record that protects both the owner AND the contractor if the DOT ever does a post-construction audit."

This reframe is specifically calibrated to the lineman-turned-inspector audience and is missing from R-1's L01.

---

## §3: Convergence Check on R-1..R-4 Findings Not Addressed

Explicitly confirming that R-5's framing did NOT find any reason to dispute the following R-1..R-4 findings:

| Finding | R-5 Assessment |
|---|---|
| R-2 C-1: `acceptance walk` DAG violation (vocabulary_introduced vs. vocabulary_assumed) | CONFIRMED — From a learner perspective, this would also create confusion: student has already learned `acceptance walk` in T10; T13 re-introducing it with a similar but slightly different definition would confuse the learner. The R-3 verification is correct. |
| R-2 C-8: Slack numbers conflict (30 ft vs. T10.L06 values) | CONFIRMED — A learner who learned different numbers in T10 and T13 will not know which one to use on the job. This is a learner-usability problem in addition to a DAG violation. |
| R-3 R3-M3: `cover card` dual-definition conflict | CONFIRMED — Critical learner confusion. Student learns "cover card = document" in T10. T13 says "cover card = physical tool." They would be uncertain what to say when asked on the job. |
| R-4 R4-H2: Waiver by course of conduct missing | CONFIRMED from usability angle — A lineman-turned-inspector will absolutely fall into the "I'll let this one go" pattern. Teaching the legal consequence of that behavior (even in simplified terms) is more likely to change behavior for this audience than a book rule about documentation. |
| R-2 G-5: Pre-backfill vs. post-backfill inspection stages missing | CONFIRMED — Field-experienced learner would immediately recognize: "you're telling me to probe AFTER they've backfilled? I know from crew side that waiting until after backfill means we're excavating if there's a problem. Why didn't the lesson tell me to catch this earlier?" The gap is learner-obvious once framed from the crew side. |

---

## §4: Summary of New R-5 Findings

### HIGH (3)

| ID | Lesson | Description |
|---|---|---|
| R5-H1 | T13.L02 | Visual sag check method described but not taught — no step-by-step procedure for string-line method; field lineman can't execute the check independently. Missing: midspan location method, chord establishment, string-line technique. |
| R5-H2 | T13.L06 | BranchingScenario punishes experienced-crew behavior — scenario assumes the inspector's measurement is correct without teaching the VERIFICATION step that precedes the decision ("how do I know it's the wrong cable type?"). |
| R5-H3 | T13.L08 | Clamp-on ground resistance meter: zero instruction on how to use it. Five critical technique errors possible (where clamp goes, connected vs. disconnected conductor, EM interference, loop vs. single-rod reading). Teaches THAT a spot-check is done; does NOT teach HOW to do it. |

### MEDIUM (5)

| ID | Lesson | Description |
|---|---|---|
| R5-M1 | T13.L02 | Drip loop inspection: no minimum drip arc criterion. Inspector cannot distinguish "adequate drip loop" from "cable curves slightly before entry." Needs a minimum measurement (or `<HotSpot>` interactive) to operationalize. |
| R5-M2 | T13.L05 | Pedestal access check: flat list without inspection sequence or guidance on where to find the locking requirement (spec or contract). Learner will skip "latched and locked" if they don't know where to verify it's required. |
| R5-M3 | T13.L05 | Slack verification: tape-measure instruction exists; recording format is not shown. Learner produces incomplete field records that won't integrate into Form 219 package. |
| R5-M4 | T13.L06 | "Isolated deficiency" vs. "pattern" — "segment" is undefined in inspection context. Learner applies ≥3-occurrences rule incorrectly if they don't know what unit constitutes a "segment." |
| R5-M5 | T13.L08 | Bond continuity check — "ohmmeter" instruction is ambiguous. Standard digital multimeter continuity function is NOT adequate; clamp-on is the correct tool. Learner will reach for wrong equipment. |
| R5-M6 | T13.L01/global | No "inspector's tool kit" established. Inspector arrives at a job with no guidance on what tools are required. Specific gap: torque wrench for hardware torque compliance (L02) is never mentioned. |
| R5-M7 | T13.L06/L10 | BranchingScenarios present decisions in a social vacuum. Missing a branch: "Contractor disputes your finding on-site." Teaches the classification framework but not the process for handling real-time field disputes. |

### LOW (2)

| ID | Lesson | Description |
|---|---|---|
| R5-L1 | T13 global | Quiz questions test recall of rules, not application of judgment. Scenario-based questions required for at least 50% of quiz items to serve field-experienced learners. |
| R5-L2 | T13.L01 | L01 framing ("not the enemy") is calibrated for engineer-type adversarial behavior; this audience is lineman-turned-inspector who will err toward DEFERRING to crew, not antagonizing them. Reframe required for the actual psychological challenge this audience faces. |

---

## §5: R-5 Saturation Assessment

Under field-crew worker/learner usability framing, R-5 found:
- **3 new HIGH findings** not caught by R-1..R-4 — all in lessons under-audited by prior agents (L02, L06, L08)
- **5 new MEDIUM findings** not caught by prior agents — learner-usability problems that cross the boundary between pedagogy and content
- **2 new LOW findings** — quiz design and audience calibration

**Assessment: YELLOW.** The three HIGH findings (R5-H1, R5-H2, R5-H3) affect the lesson's core teaching value: a learner who reads L02 cannot execute the sag check; a learner who reads L06 cannot verify before deciding; a learner who reads L08 cannot perform the spot-check. These are usability failures — the lesson describes but does not teach the skills. They must be addressed in the author canonical before dispatching T13 authoring.

The MEDIUM findings (R5-M1 through R5-M7) represent incremental improvements that move the lesson from "understandable by engineers" to "executable by a field crew member." They should be in the author canonical as authoring guidance, not as post-authoring fixes.

**VERDICT: NOT SATURATED.** R-5 finding count and independence from R-1..R-4 confirms another framing (e.g., safety/training-effectiveness or curriculum-transfer framing) would likely yield additional finds. The lesson pool is rich with usability gaps that citation-heavy and legal-framing auditors systematically missed because they were focused on what the content SAYS rather than whether a field lineman can DO the inspection after reading it.

---

=== T13 RESEARCH R-5 BRIEF END ===
