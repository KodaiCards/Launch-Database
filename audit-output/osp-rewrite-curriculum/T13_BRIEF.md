# T13 (Inspection & Quality Assurance) — Research Brief R-1

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF.md` written.

**Agent:** T13 Research R-1 — primary-source-skeptical / high-precision framing  
**Date:** 2026-05-18  
**Word count:** ~4,800  
**Teaching position:** 16 of 19 (after T12 Testing; before T15 Restoration & Outage Response)

---

## Section 1: Topic Scope

**Title:** Inspection & Quality Assurance  
**Category:** General learning — teaching position 16

**Scope:** Everything a field inspector, project engineer, or QA technician needs to walk constructed OSP plant and determine whether it meets contract, NESC, and RUS requirements. Covers the inspector's role and authority, aerial plant inspection methodology (clearances, sag verification, hardware torque, drip loops, grounding compliance), underground plant inspection (depth and cover, backfill compaction, restoration quality), pole-top condition assessment (wood treatment, decay detection, structural compliance), slack inventory and access point verification, splice case and closure verification, the punch list vs. kick-back decision framework, and the RUS Form 219 close-out package workflow. Also covers bonding and grounding inspection as a QA gate, contractor vs. owner QA rights, and sampling-rate philosophy.

**Why this position in the DAG is correct:**
- T01 — provides project lifecycle vocabulary (inspector role, punch list concept, as-built awareness)
- T05 — provides NESC clearance numbers, sag and loading rules that define the accept/reject thresholds
- T10 — provides construction vocabulary (depth probe, cover card, compaction, DFR, kick-back authority) that T13 builds upon; T10.L11 introduces the inspector concept from the construction crew's POV
- T12 — provides the acceptance testing framework (OLTS/OTDR thresholds, IEC 61300-3-35 end-face grading) that inspectors use as the measurement gate for T13's documentation step
- T14 — provides bonding and grounding vocabulary (ground resistance, aerial plant bonding schedule, ground test log) that T13.L08 applies in a QA inspection context
- T18 — provides safety protocols for field inspection (fall protection at poles, confined-space entry for manhole inspection, PPE selection)

**Topics that depend on T13:**
- T15 — Restoration & Outage Response: "Is the plant in acceptable condition?" is the baseline T15 references; the inspector's punch list is the known-deficiency list that guides restoration prioritization
- T16 — As-Built Documentation: the RUS Form 219 package (T13.L07) is the primary deliverable that feeds T16's as-built documentation workflow

---

## Section 2: Per-Lesson List (L01–L10)

### T13.L01 — The Inspector's Role: Not the Enemy
**Type:** Foundation  
**Time estimate:** 20 min

**Learning objectives:**
1. Explain the difference between contractor QC (self-checking) and owner/engineer QA (independent acceptance).
2. Describe the legal and contractual basis for an inspector's authority to reject non-conforming work.
3. Define the inspector's documentation obligations on a RUS-financed project.

**vocabulary_introduced (5 terms):**
- **inspector (OSP):** The engineer's or owner's field representative responsible for verifying that constructed plant meets the contract documents, applicable codes, and agency requirements before acceptance and payment. Distinct from the contractor's own quality-control crew. (Source: RUS Bulletin 1751F-630 §7 — owner inspection rights on RUS-financed projects; industry practice)
- **QA/QC (Quality Assurance / Quality Control):** QC = the contractor's internal process for checking their own work. QA = the owner's or engineer's independent process for verifying that QC was effective and the product meets specifications. (Source: industry practice — RUS engineering manuals use this distinction; FOA CFOS-O KSAs reference QA acceptance testing)
- **punch list:** A written list of construction deficiencies — items that are non-conforming but do not stop work — that the contractor must correct before final acceptance and final payment. Contrasts with a kick-back, which stops work. (Source: RUS Bulletin 1751F-630 §7; T10.L11 introduced this term — T13.L01 teaches the inspector's authority to create and enforce it)
- **kick-back authority:** The inspector's contractual right to stop acceptance of a section of work, refuse to approve a pay application for that section, and require rework before the work will be considered. Exercised when deficiencies are systemic, safety-threatening, or require re-excavation. (Source: RUS Bulletin 1751F-635 §8; T10.L11 introduced the concept — T13.L01 teaches the formal mechanism)
- **acceptance walk:** A scheduled field walkthrough in which the engineer, inspector, owner, and contractor representative jointly verify completion of punch list items and declare the work substantially complete and acceptable. Triggers final payment in most RUS contracts. (Source: industry practice; RUS Form 219 close-out trigger)

**vocabulary_assumed:**
- `inspector`, `punch list`, `kick-back authority`, `field inspector`, `substantial completion`, `acceptance walk` → T10.L11 (introduced from construction crew's POV; this lesson teaches from the inspector's authority perspective)
- `RUS Form 219` → T10.L10 (awareness-only mention as a forward-reference; T13.L07 teaches the full workflow)
- `AHJ` → T09.L01
- `as-designed`, `as-built` → T04.L02, T10.L10

**Key concepts:** The inspector is not the contractor's adversary — they are the quality gate that protects the owner's investment and the public's safety. Inspectors who antagonize crews slow projects; inspectors who defer to crews produce deficient plant. The goal is documented evidence of compliance, not finding fault for its own sake.

**Book vs. field:** Book standard: inspector documents every deficiency in writing, obtains the contractor's signature acknowledging the punch list, and withholds payment on non-conforming items. Field reality: on fast-paced RUS projects with schedule pressure, inspectors often give verbal warnings first and escalate to written punch lists when the crew doesn't self-correct within the same day. The risk of deferring to verbal warnings: if the contractor disputes a punch list item later, undocumented verbal notice doesn't support the engineer's position.

**Interactivity:** `<Quiz>` — MC: Which of these is the inspector's first action when they observe non-conforming work? (Options: stop the crew immediately / document the deficiency / call the owner / ignore it if minor); `<BranchingScenario>` intro scenario framing

---

### T13.L02 — Aerial Inspection: What to Look For
**Type:** Working  
**Time estimate:** 30 min

**Learning objectives:**
1. Apply NESC clearance rules to verify that a completed aerial attachment meets minimum vertical and horizontal clearances.
2. Identify hardware compliance items: correct hardware type, torque, drip loop, lashing, lashing clamps.
3. Describe the sag check process — how to verify that installed sag approximates the design value without an instrument.

**vocabulary_introduced (5 terms):**
- **clearance verification:** The act of measuring or estimating vertical and horizontal clearances at the point of minimum clearance (midspan over a road, or at a crossing) and comparing to the applicable NESC Rule 232 minimum, adjusted for loading district and grade of construction. (Source: NESC C2-2023 Rule 232 [paywalled — `[confirm edition]`]; RUS Bulletin 1751F-630 §5 aerial clearance requirements)
- **hardware torque compliance:** Verification that all threaded hardware (bolt-type clamps, suspension clamps, deadend hardware, lashing clamps) has been tightened to the manufacturer's specified torque value. Under-torqued hardware loosens under wind-induced vibration; over-torqued hardware crushes cable jacket or cracks cast hardware. (Source: hardware manufacturer installation guides; ANSI O5.1 `[confirm edition]` pole hardware context; field practice — industry)
- **drip loop:** A deliberate downward loop formed in the service drop or service entrance cable before it enters a closure, pedestal, or building entry fitting. Gravity causes water to run down and drip off the lowest point of the loop rather than following the cable into the fitting. (Source: industry practice — RUS 1751F-630 service-drop installation guidance; field practice documentation)
- **lashing compliance:** Verification that lashed fiber cable has the correct lashing wire gauge, lashing helix pitch, and lashing clamp spacing per the lashing machine's deployment specification and the RUS/contract requirements. Overlash attachment is also checked for the required intermediate lashing clamps at specified intervals. (Source: RUS Bulletin 1751F-630 §5 aerial lashing requirements; industry practice)
- **sag check (visual):** An approximation technique where the inspector sights across the sag point of the cable with a level — when the line-of-sight from one support attachment-height to the other passes through the wire's midpoint at the expected sag depth below the attachment chord, the sag is approximately correct. Precise instrument measurement uses a transit; the visual method is used for mid-construction spot checks. (Source: industry practice — BICSI OSPDR field verification guidance; RUS 1751F-630 commentary on in-progress inspection)

**vocabulary_assumed:**
- `clearance`, `Rule 232`, `sag formula`, `loading district`, `grade of construction` → T05.L01, T05.L02, T05.L04, T05.L06, T05.L07
- `attachment`, `span`, `midspan`, `messenger`, `lashing` → T01.L02, T01.L03
- `joint-use`, `ILA` → T05.L08
- `NESC` → T05.L01

**Key concepts:** Clearance violations discovered after construction are vastly more expensive to fix than those caught during installation. Inspect at midspan for vertical clearance; inspect at the closest approach point for horizontal separation. Hardware inspection is systematic, not selective — every pole every span.

**Book vs. field:** NESC requires minimum clearances measured under the heaviest-loading condition (per loading district) which is not directly observable during inspection in non-winter conditions. Book practice: inspect against the design clearance, which includes a margin above the NESC minimum to account for future sag creep. Field reality: crews sometimes read the NESC minimum as the installed target, dropping the design margin. Inspector must verify against the design drawings, not just the NESC tables.

**Interactivity:** `<AnnotatedDiagram>` — aerial span cross-section showing measurement points for vertical clearance (road, railroad, waterway), horizontal separation to supply conductors, attachment height, and drip loop; click each point to see its acceptance criterion; `<WorkedExample>` — calculate whether a span at 30°F with 10-ft sag over a road meets NESC Rule 232 for Light loading district Grade B

---

### T13.L03 — Pole-Top Inspection
**Type:** Working  
**Time estimate:** 25 min

**Learning objectives:**
1. Identify the external indicators of pole decay, woodpecker damage, and mechanical damage that constitute rejection criteria.
2. Describe the CCA treatment check and bore-and-plug inspection method.
3. Apply the NESC grade-of-construction and pole-class requirements to determine whether an existing pole's condition is acceptable for continued service.

**vocabulary_introduced (4 terms):**
- **pole top condition assessment:** Visual and limited physical inspection of a wood pole above the attachment zone, focusing on CCA treatment integrity, woodpecker holes, mechanical damage (vehicle strikes, storm damage), split top, and checking (surface cracking from drying). (Source: ANSI O5.1 `[confirm edition]` — standard for wood pole inspection criteria; RUS Bulletin 1751F-630 §3 pole condition requirements for RUS-financed aerial plant)
- **CCA treatment:** Chromated Copper Arsenate — the copper/chrome/arsenic preservative system used in most utility poles produced before approximately 2004. Provides fungal and insect decay resistance. Visual check: the characteristic greenish or brownish-green surface coloration of CCA-treated wood. Inspect for weathering-away of surface treatment at pole top (most exposed zone). (Source: ANSI O5.1; USDA Forest Products Laboratory wood preservative guidance; industry practice)
- **bore-and-plug inspection:** An internal inspection method in which a hollow drill bit is used to extract a plug of wood from the pole interior at groundline and below. The extracted core is visually and physically assessed for internal decay (soft, discolored, or absent wood). The plug is re-inserted; the hole is sealed. Determines whether a pole that appears acceptable externally has internal hollow decay. (Source: ANSI O5.1 `[confirm edition]`; RUS Bulletin 1751F-630 §3 commentary on accepted inspection methods; field practice)
- **checking (wood):** Surface cracks in a wood pole running along the grain, caused by differential drying between the surface and interior wood fibers. Shallow checking is normal and does not affect structural capacity. Deep checking (≥ 1/3 pole diameter) reduces bending strength and is a rejection criterion. Distinct from splits (through cracks separating wood fibers) and woodpecker holes (local penetrations). (Source: ANSI O5.1; USDA Forest Products Laboratory pole inspection guidance)

**vocabulary_assumed:**
- `pole class`, `grade of construction` → T01.L02, T05.L04
- `loading district`, `pole loading` → T05.L05, T05.L06
- `PPE (fall protection at poles)`, `fall arrest system` → T18.L04

**Key concepts:** A pole that fails structural criteria is a life-safety issue, not just a deficiency. Inspectors must know the rejection thresholds, not just "does this look bad." Pole replacement cost is the contractor's exposure if they installed on a pole that fails inspection — motivating early buy-in.

**Book vs. field:** ANSI O5.1 defines quantified inspection criteria (minimum residual wall thickness, % cross-section decay). Book standard: document numerical measurements. Field reality: most field inspectors use visual and "sound-of-tap" heuristics — tap the pole with a hammer and listen for hollow resonance. The sound-of-tap method is a fast screen, not a formal inspection. For RUS close-out packages, a documented visual inspection with ANSI O5.1 category code is required even if the underlying judgment was based on the tap test.

**Interactivity:** `<AnnotatedDiagram>` — pole cross-section with labeled inspection zones (above groundline, groundline, below groundline); `<BranchingScenario>` — "Pole top shows split top + woodpecker cavity 2 in. deep at 15 ft elevation. Design clearance margin is 0.8 ft. What is your decision? A: punch list, B: kick-back + require engineering evaluation, C: no action — woodpecker damage is cosmetic"

---

### T13.L04 — Underground Inspection: Depth and Cover
**Type:** Working  
**Time estimate:** 25 min

**Learning objectives:**
1. Describe the depth-probe method and explain when to probe vs. when to require exposure.
2. Apply RUS Bulletin 1751F-635 minimum cover requirements to determine accept/reject at three representative points.
3. Identify backfill compaction acceptance criteria and how to assess compaction without laboratory testing.

**vocabulary_introduced (4 terms):**
- **cover card:** A pre-cut rigid card (typically 6 in. or 12 in. long) used to verify minimum cover over a buried conduit or cable. The inspector inserts the probe rod, marks the depth at grade, then measures against the card to confirm the required cover depth is met. Quick field tool — not a substitute for formal depth survey on critical crossings. (Source: industry practice — referenced in RUS 1751F-635 inspection guidance; T10.L04 introduced `depth probe` and `cover card` from the construction crew's perspective; T13.L04 uses them from the inspector's perspective)
- **proctor density:** A soil compaction standard derived from the Proctor Compaction Test (ASTM D698, Standard Proctor; ASTM D1557, Modified Proctor). Specifies the maximum dry density at optimum moisture content for a given soil. Trench backfill is typically specified at 95% of modified Proctor density for road-bearing zones, 90% for non-traffic zones. (Source: ASTM D1557 `[confirm edition]`; RUS Bulletin 1751F-635 §7 backfill and compaction requirements)
- **depth verification at critical crossings:** At road crossings, railroad crossings, waterway crossings, and specified utility crossings, the inspector requires formal depth verification (survey-grade measurement or pull-tape measurement at the bore entry/exit) rather than the probe method. Minimum cover at these crossings is typically greater than open-ROW cover and is specified in the permit. (Source: RUS Bulletin 1751F-635 §5 crossing requirements; 23 CFR state DOT encroachment permit conditions; USACE NWP 57 / NWP 12 conditions for water crossings)
- **ghost trench:** Surface evidence of a backfilled trench visible after restoration — linear subsidence, differential grass growth, or frost heave patterns that reveal the trench line. Indicates inadequate compaction or improper backfill material. Inspector documents ghost trenches during the 30-day survivability inspection (if specified in the contract). (Source: RUS Bulletin 1751F-635 commentary on restoration inspection; T10.L08 introduced `ghost trench` from the construction crew perspective)

**vocabulary_assumed:**
- `depth probe`, `cover card`, `GPR`, `finished grade`, `natural grade` → T10.L04
- `trench backfill`, `pavement match`, `sod restoration`, `proctor density`, `ghost trench` → T10.L08
- `conduit`, `burial depth` → T01.L02, T06
- `HDD`, `open-cut`, `plowing` → T10.L02, T10.L03

**Key concepts:** Depth deficiencies are the single most common RUS inspection rejection — they are invisible after backfill and only discoverable by probing or exposure. The inspector's documentation (photos + depth log + station references) is the owner's only evidence if a utility strike happens later.

**Book vs. field:** RUS 1751F-635 specifies minimum cover as measured from finished grade, not natural grade. Book standard: probe from finished grade; record measurement to nearest 0.1 ft; compare to spec minimum. Field reality: contractors' depth measurements from natural grade (pre-installation) often understate cover when road shoulder is restored to slightly above natural grade. Inspector must measure from the final restored surface. On slopes, "uphill cover" is the controlling depth.

**Interactivity:** `<WorkedExample>` — depth verification at three points: probe measures 34 in., 31 in., 29 in. along a 200-ft segment; spec requires 36 in. under roadway, 24 in. in green space; determine which points are deficient; `<BranchingScenario>` — "Depth probe at 29 in. under road shoulder. Spec requires 36 in. Contractor says the bore was aimed at 36 in. but soil was hard. What is your required action? A: Punch list only; B: Expose and verify; C: Accept with a deviation log entry"

---

### T13.L05 — Slack, Storage, and Access Point Checks
**Type:** Working  
**Time estimate:** 20 min

**Learning objectives:**
1. Verify that installed slack loops and storage coils meet design specifications for length, location, and securing.
2. Inspect pedestal and NIU installations for access, weatherproofing, identification labeling, and slack compliance.
3. Describe the consequence of inadequate slack at a closure or junction point for future splicing, restoration, and network expansion.

**vocabulary_introduced (4 terms):**
- **slack inventory:** A documented measurement of cable slack at every splice location, closure, pedestal, and access point — compared to the minimum slack specified in the design documents. Minimum slack is typically 30 ft at above-ground splice closures and 50–100 ft at underground vaults, to allow future resplicing without pulling cable. (Source: RUS Bulletin 1751F-630 §6 aerial plant slack requirements; RUS Bulletin 1751F-635 §7 underground plant slack; industry practice)
- **storage coil check:** Verification that the slack storage coil (cable figure-8 or single-coil racked inside a vault or hanging on a strand) is secured, does not exceed the cable's minimum bend radius, and is correctly labeled with cable ID. Over-tight bends in storage coils are a field-introduced macrobend source. (Source: industry practice — BICSI OSPDR cable storage guidance; T10.L06 introduced `storage coil` from the installation crew's perspective)
- **pedestal access check:** Verification that a pedestal or NIU is plumb, properly anchored, latched and locked (where specified), labeled with the design ID and fiber count, has a drip loop at cable entry, and that the cable entry fitting is sealed against water infiltration. (Source: RUS Bulletin 1751F-635 §8 pedestal requirements; industry practice)
- **NIU verify:** Confirmation that a Network Interface Unit (NIU) is correctly populated — fiber ports match the design splice matrix, each drop-side port is labeled per TIA-606-D or contract labeling convention, and the physical splice or terminus within the NIU is documented on the as-built redline. (Source: industry practice; TIA-606-D `[confirm edition]` labeling standards; T01.L07 introduced NIU as a vocabulary concept in strand maps)

**vocabulary_assumed:**
- `slack loop`, `storage coil`, `MSA`, `NIU slack`, `expansion loop` → T10.L06
- `FDH`, `NAP`, `drop` → T01.L07
- `bend radius` → T03
- `as-built redline` → T10.L10

**Key concepts:** Inadequate slack forces the splicer to pull cable tight to reach a closure — taut cable in a vault vibrates under trucks and fails at the grip or at the first bend. The 30 ft / 50 ft minimums exist because re-splicing after a fiber cut requires at least one resplice on each side with fresh cable ends.

**Book vs. field:** Book standard: measure each slack storage with a tape and record in the inspection log. Field reality: many inspectors estimate slack visually ("that's about 30 feet") and record the estimate as measured. For RUS close-out packages, recorded values that turn out to be wrong create engineering liability. The correct practice is a tape measurement at every splice closure designated in the contract documents as a "critical slack point."

**Interactivity:** `<BranchingScenario>` — slack shortage scenario: "Closure A has 22 ft slack instead of the specified 30 ft. Contractor says adding slack requires pulling cable from the previous span. Your options: A: punch list; B: immediate kick-back; C: accept with deviation log entry"; `<Quiz>` — MC: What is the primary reason minimum slack at a splice closure is specified in the contract?

---

### T13.L06 — What Triggers a Punch List vs. a Kick-Back
**Type:** Working  
**Time estimate:** 25 min

**Learning objectives:**
1. Apply a decision framework to classify 10 construction deficiencies as punch list items or kick-backs.
2. Explain the payment consequence of each classification.
3. Describe when a punch list item becomes a kick-back (systematic recurrence).

**vocabulary_introduced (3 terms):**
- **material deficiency:** A deficiency involving incorrect materials — wrong cable type, wrong conduit grade, wrong hardware type — as distinct from an installation deficiency (correct materials, wrong installation method). Material deficiencies typically trigger a kick-back because the wrong material cannot be "corrected in place" without replacement. (Source: RUS Bulletin 1751F-635 §8; industry practice)
- **rework:** The contractor's action of correcting a rejected installation element to bring it into compliance, at the contractor's cost. Rework triggers a new inspection cycle before the affected section may be added to the pay application. (Source: standard construction contract terms; RUS 1751F-630 §7 inspection and acceptance language)
- **retainage:** A percentage of the contract price (typically 5–10%) withheld from every pay application until final acceptance. Protects the owner's ability to fund rework if the contractor abandons the project after receiving payment. Released at final acceptance walk. (Source: RUS loan administration guidance; standard construction contract terms; T13.L09 also covers retainage from the contractor-rights perspective)

**vocabulary_assumed:**
- `punch list`, `kick-back authority` → T10.L11 (construction POV) and T13.L01 (inspector authority POV)
- `depth verification`, `cover card`, `slack inventory` → T13.L04, T13.L05
- `deviation log` → T10.L10
- `pay application` → T10.L10

**Key concepts:** The punch list/kick-back distinction is the inspector's most consequential daily decision. Over-using kick-backs antagonizes contractors and slows legitimate work. Under-using them allows systemic deficiencies to accumulate and compound. The decision rule: a single isolated deficiency that can be corrected without affecting adjacent work = punch list. A pattern of the same deficiency, a safety-threatening condition, or a deficiency that requires re-excavation = kick-back.

**Book vs. field:** Book standard: every deficiency gets written documentation, contractor acknowledgment, and a scheduled correction date before the work proceeds. Field reality: verbal punch lists on fast-paced jobs are common — especially for minor hardware items (un-torqued bolt, unlabeled closure). The risk: the contractor finishes the project, submits for final payment, and disputes items that were never documented in writing.

**Interactivity:** `<BranchingScenario>` — classify 5 deficiencies one at a time: (1) Single bolt under-torqued on a suspension clamp; (2) Three consecutive spans with sag 15% below design value; (3) Wrong cable type installed on a 2,000-ft segment; (4) Depth at 34 in. vs. 36 in. spec, isolated occurrence in a hard-rock zone; (5) No drip loops on 8 of 10 poles in a section. Decision tree: punch list vs. kick-back vs. escalate to engineer.

---

### T13.L07 — RUS Form 219: Close-Out Package
**Type:** Working  
**Time estimate:** 25 min

**Learning objectives:**
1. Identify all required components of a RUS Form 219 close-out package.
2. Walk through the signature chain from contractor QC to engineer certification to owner submission.
3. Explain what happens if the Form 219 package is incomplete at the time of RUS loan draw.

**vocabulary_introduced (4 terms):**
- **RUS Form 219:** The standard USDA Rural Development close-out documentation package for RUS-financed telecommunications construction. Consists of as-built drawings, splice matrix, test reports (OLTS/OTDR per RUS 1753F-401), material-certification letters, contractor's completion statement, and the engineer's certification of substantial completion. Without a complete Form 219, the RUS borrower cannot draw down the final loan disbursement for that construction segment. (Source: RUS Form 219 [public domain — USDA RD forms repository]; RUS Bulletin 1751F-630 §7 close-out requirements)
- **as-built signature:** The contractor's stamped and signed acknowledgment that the construction has been completed in accordance with the design documents, or that all deviations have been documented in the deviation log. Required on all as-built drawings submitted as part of the Form 219 package. (Source: RUS Bulletin 1751F-630 §7; standard engineering contract requirements; T10.L10 introduced as-built redlines)
- **engineer certification (Form 219):** The licensed professional engineer's (PE) written certification that: (1) the work was inspected; (2) the work meets the design documents and applicable codes; (3) the testing results are on file and meet the contract acceptance criteria; (4) any noted punch list items are non-material or have been resolved. The PE's stamp creates personal professional liability — this is not a rubber-stamp action. (Source: RUS Bulletin 1751F-630 §7; state professional engineering licensing requirements — AHJ-dependent; industry practice)
- **loan draw (RUS):** The disbursement of a portion of the RUS loan funds to the borrower, triggered by evidence of completion of the corresponding construction scope. Each draw requires a completed Form 219 (or equivalent documentation) for the segment being drawn against. Incomplete or deficient Form 219 packages cause draw delays that can impact the borrower's cash flow. (Source: 7 CFR Part 1755 §1755.903; RUS loan administration guidance — public USDA RD borrower guidance)

**vocabulary_assumed:**
- `RUS Form 219` → T10.L10 (awareness), T13.L07 is the primary teaching lesson
- `as-built redline` → T10.L10
- `OLTS`, `OTDR`, `acceptance threshold`, `SOR file`, `loss report`, `test report components` → T12.L01, T12.L13, T12.L14
- `splice matrix` → T01.L07 (awareness); T11 (splicing context)
- `deviation log` → T10.L10
- `RUS 1753F-401` acceptance thresholds → T12.L13

**Key concepts:** The Form 219 is a legal document that links construction quality to federal loan funds. An inspector who signs off on deficient work is creating federal-program liability for the engineer and the borrower. The Form 219 package should be assembled continuously as construction progresses — not assembled in a panic at the end when the borrower needs the draw.

**Book vs. field:** Book standard: Form 219 submitted within 30 days of substantial completion; engineer PE stamp and signature on file. Field reality: on multi-segment projects, Form 219 packages often accumulate for months until the borrower needs a draw — at which point the inspector is reconstructing documentation from memory and incomplete field notes. Best practice from the field: treat every week's inspection notes as a Form 219 entry, not as a temporary memo.

**Interactivity:** `<WorkedExample>` — walk through a simulated Form 219 package: identify which components are present, which are missing, and what the consequence of each missing component is for the loan draw; `<Quiz>` — MC: Which of these is NOT a required component of a RUS Form 219 package? (Options: as-built drawings / contractor's completion statement / OLTS/OTDR test reports / engineer PE stamp / NESC clearance survey conducted by an AHJ)

---

### T13.L08 — Bonding and Grounding Inspection
**Type:** Working  
**Time estimate:** 25 min

**Learning objectives:**
1. Verify aerial plant bonding at each pole: messenger bond, secondary bond, and downlead to ground rod.
2. Apply the ground resistance acceptance threshold to fall-of-potential test results.
3. Document grounding inspection findings in the format required by RUS Bulletin 1751F-810 and 47 CFR §32.2420.

**vocabulary_introduced (3 terms):**
- **ground resistance test (inspection context):** The inspector's verification that the installed grounding electrode system meets the contract acceptance threshold — typically 25 Ω or lower per NEC Article 250 / RUS 1751F-810, or the lower threshold specified in the contract. The test method is fall-of-potential per IEEE 81. Inspectors do not repeat the full IEEE 81 test for every pole; they verify the contractor's test log and spot-check using a clamp-on ground resistance meter at selected poles. (Source: RUS Bulletin 1751F-810 §3; IEEE 81 `[confirm edition]`; NEC 250.53 `[confirm edition]`; T14.L06 introduced fall-of-potential test method)
- **bond continuity check:** A continuity resistance test verifying that the messenger is electrically bonded to the bonding conductor at each intermediate pole and dead-end. Performed with a clamp-on ohmmeter or continuity tester. Acceptable reading: ≤1 Ω loop resistance between the test point and the nearest established ground. (Source: RUS Bulletin 1751F-810 §3; IEEE Std 487 `[confirm edition]`; T14.L03 introduced messenger bond vocabulary)
- **aerial plant bonding schedule:** A pole-by-pole grounding documentation form showing each pole's ground rod depth, conductor gauge, measured resistance, and inspector verification signature. Required as part of the Form 219 grounding documentation. Not a narrative description — a structured log with a row per pole. (Source: RUS Bulletin 1751F-810 §3; T14.L10 introduced the aerial plant bonding schedule concept from the design perspective)

**vocabulary_assumed:**
- `grounding`, `bonding`, `messenger bond`, `downlead`, `ground rod`, `NEC 250.52`, `surge arrester` → T14.L01, T14.L03, T14.L04, T14.L07
- `fall-of-potential`, `clamp-on method`, `ground test log`, `aerial plant bonding schedule` → T14.L06, T14.L10
- `IBT-entry`, `GES-tie-in`, `TGB` → T19 (headend grounding vocabulary)
- `IEEE 81` → T14.L06

**Key concepts:** Grounding inspection is not optional on RUS projects — it is a Form 219 requirement. An ungrounded or poorly-grounded aerial plant exposes the utility's own field crew to stray voltage and lightning-induced surges. Inspectors who accept contractor grounding on the contractor's word (without reviewing the test log and spot-checking) are creating liability for themselves and the borrower.

**Book vs. field:** Book standard: inspector reviews all ground resistance test results, verifies each is at or below the contract threshold, and spot-checks a minimum of 10% of poles in a given segment with an independent clamp-on reading. Field reality: many RUS inspectors review the contractor's log but conduct zero independent spot-checks. The risk: a contractor who fills in a log with compliant numbers without actually testing. The physical check — a clamp-on reading that confirms the log's values — is the difference between auditable evidence and paper compliance.

**Interactivity:** `<WorkedExample>` — inspector's grounding checklist for a 10-pole segment: five poles log 18–22 Ω (compliant), two log 27 Ω (over 25 Ω threshold), one has no bond clamp (open circuit). Walk through: which items are punch list, which are kick-back, what goes in the Form 219 grounding documentation

---

### T13.L09 — Contractor vs. Owner Inspection Rights
**Type:** Working  
**Time estimate:** 20 min

**Learning objectives:**
1. Describe the contractor's right to self-inspect and document disagreement with an inspector's punch list.
2. Explain the dispute resolution process specified in standard RUS construction contracts.
3. Define retainage release conditions and final lien waiver requirements.

**vocabulary_introduced (3 terms):**
- **contractor QC (self-inspection):** The contractor's own internal quality-control process — checking work before the engineer's inspector sees it. A contractor with a functioning QC program catches deficiencies before the inspector does, reducing punch list items and avoiding kick-backs. Under RUS contracts, the contractor is required to certify QC has been performed before submitting for acceptance inspection. (Source: RUS Bulletin 1751F-630 §7; standard AIA construction contract general conditions; industry practice)
- **right of rejection:** The owner's or engineer's contractual right to reject any work that does not conform to the contract documents, at any point during construction and up to final acceptance. This right does not expire when the inspector "passes" an intermediate phase — final acceptance walk is the definitive acceptance event. (Source: RUS loan administration guidance; standard construction contract general conditions — AIA A201 §12.2 `[confirm edition]`)
- **final lien waiver:** A legal document signed by the contractor (and all subcontractors and material suppliers) waiving any future claim against the owner's property for unpaid labor or materials. Required before retainage release. Protects the owner from a situation where they pay the contractor but the contractor fails to pay subcontractors, who then lien the owner's property. (Source: standard construction contract requirements; state lien law — AHJ-dependent; RUS loan administration guidance)

**vocabulary_assumed:**
- `retainage` → T13.L06 (introduced in the kick-back/punch-list context)
- `acceptance walk`, `QA/QC` → T13.L01
- `Form 219`, `engineer certification` → T13.L07
- `pay application`, `deviation log` → T10.L10

**Key concepts:** The inspector is the owner's agent, not an arbitrator. When the contractor disputes a punch list item, the resolution process flows through the engineer, not through the inspector alone. Inspectors who make ad-hoc accommodations ("we'll let this one go") without engineering authorization create informal deviations that are impossible to defend if deficiencies surface later.

**Book vs. field:** Book standard: all punch list disputes are resolved in writing with engineering sign-off before the deficiency is removed from the punch list. Field reality: verbal accommodations happen constantly on fast-paced rural projects. The practice of keeping a personal field notebook (inspector's log, not the official form) captures verbal agreements and provides a contemporaneous record if a dispute escalates.

**Interactivity:** `<Quiz>` — drag-to-match: match each scenario to the correct classification (contractor QC issue, inspector punch list, kick-back, dispute requiring engineering adjudication)

---

### T13.L10 — T13 Capstone Quiz
**Type:** Capstone quiz  
**Time estimate:** 30 min

**Learning objectives:** Demonstrate mastery of all T13 concepts: inspector authority, aerial and underground inspection methods, pole-top assessment, slack and access checks, punch list vs. kick-back decision, Form 219 close-out package, grounding inspection, and contractor/owner inspection rights.

**vocabulary_assumed:** All T13 vocabulary (L01–L09).

**Quiz structure:**
- 20 questions MC + scenario
- Domain breakdown (per ARCH.md §5): 30% aerial inspection, 25% underground inspection, 25% punch list/Form 219, 20% grounding + contractor rights
- Includes one `<BranchingScenario>` integrating multiple lessons: "You are the project inspector on a RUS 250-pole aerial build in Light loading district. Walk through: (1) clearance check at a road crossing; (2) pole-top inspection showing deep checking + a woodpecker hole; (3) contractor submits a depth log showing 34 in. on three road crossings specified at 36 in.; (4) grounding log shows 28 Ω at 5 of 60 poles. Make the punch list / kick-back determination for each, then assemble the Form 219 checklist and identify what's missing."

---

## Section 3: Critical Content — Detailed Coverage

### Visual vs. Instrument Inspection Hierarchy

The inspector applies visual methods first (faster, requires no equipment setup) and escalates to instrument verification only when visual evidence is ambiguous or when the contract requires it for a specific item class.

**Visual-only items (adequate for most line-item acceptance):**
- Hardware type compliance (suspension clamp vs. deadend, correct bolt grade)
- Drip loop presence
- Label and ID marker presence
- Closure seal integrity (visual seal confirmation, no cable bulge at port)
- Pedestal plumb and anchoring
- Sod restoration continuity (no ghost trench visible at 30-day check)

**Visual + measurement required:**
- Clearances — measure at minimum-clearance point; estimate first then measure when close to limit
- Sag — visual estimate first; instrument (transit or engineering level) when within 10% of limit
- Depth — probe all segments; expose-and-measure at crossings and at suspicious probe readings
- Ground resistance — clamp-on spot-check; full fall-of-potential for installations that failed once and were re-driven

**Instrument-only (no visual substitute):**
- Ground resistance (pass/fail determination — clamp-on or fall-of-potential per IEEE 81)
- Bond continuity (ohmmeter required for loop resistance)
- Fiber acceptance testing (OLTS Tier-1 + OTDR Tier-2 per T12 acceptance criteria)

### RUS Form 219 Close-Out Workflow

The Form 219 package is assembled from documentation generated throughout construction — not retrospectively. Components:

1. **As-built drawings** — contractor-stamped redlines showing final route, structure locations, depths, and deviations from design
2. **Splice matrix** — fiber-count-by-splice-location table with as-built fiber assignments
3. **Test reports** — OLTS loss reports (per TIA-526-7A/14B via NECA/FOA 301) + OTDR SOR files (per RUS 1753F-401 bidirectional average requirement) for every fiber in the build
4. **Material certification** — manufacturer letters or QA records confirming RUS-listed materials were installed
5. **Contractor's completion statement** — signed contractor certification that the work is complete and QC has been performed
6. **Inspection logs** — daily field inspection reports, depth logs, grounding test log (bonding schedule)
7. **Punch list disposition** — copy of the punch list with each item marked "corrected" and re-inspection date
8. **Engineer's certification** — PE-stamped letter certifying substantial completion

**Sampling rate philosophy:** On a 5,000-pole aerial project, inspecting every pole is not always achievable with available inspector resources. Standard sampling practice:
- 100% inspection of all road crossings, railroad crossings, and other permit-condition structures
- 100% of NESC Grade B crossing spans
- 100% of spliced locations (closures, terminals, pedestals)
- Minimum 25% of running spans (randomly distributed, not contiguous)
- 100% of any spans where the contractor's daily field report flagged a deviation
- Statistical escalation: if 10% of a sampled segment fails, expand to 100% of that segment

(Source: industry QA practice — BICSI OSPDR inspection sampling guidance; RUS 1751F-630 §7 inspection requirements do not define a sampling rate, creating AHJ discretion; this is a field-practice norm, not a codified standard)

### Punch List vs. Kick-Back Decision Framework

| Condition | Classification |
|---|---|
| Isolated single deficiency, correctable in-place, no safety risk | Punch list |
| Pattern of same deficiency (≥3 occurrences in a segment) | Kick-back |
| Safety-threatening condition (unstable pole, insufficient clearance over road) | Kick-back + immediate stop |
| Wrong material installed | Kick-back (material must be removed and replaced) |
| Deficiency requiring re-excavation of buried plant | Kick-back |
| Missing documentation (label, tag, drip loop — not a structural issue) | Punch list |
| Ground resistance above threshold, isolated | Punch list (re-drive ground rod) |
| Ground resistance above threshold, 10%+ of poles in segment | Kick-back |

---

## Section 4: Book vs. Field Practice — Required Divergences

| Topic | Book Standard | Field Practice | Risk of Confusion |
|---|---|---|---|
| Clearance measurement | Measure to nearest 0.1 ft, record measurement vs. design value | Visual estimate + measure only when close to limit | Under-estimating clearance deficiency at long spans where visual estimate is inaccurate |
| Sag verification | Transit instrument measurement at each span | Eyeball level-sight from pole to pole | Missing sag creep in high-temperature periods (worst-case sag not observable in mild weather) |
| Depth measurement | Probe + measure from finished grade | Many measure from natural grade (pre-construction) | Overclaims depth when finished grade is below natural grade |
| Ground resistance acceptance | 25 Ω per NEC 250.53 / RUS 1751F-810 (verify contract threshold — may be lower) | Accept contractor's log without independent spot-check | Paper compliance without physical verification |
| Punch list documentation | Written, contractor-signed, dated, stored in project file | Verbal "I'll let you fix that tomorrow" | Undocumented deviations appear in the Form 219 package with no resolution evidence |
| Form 219 assembly | Assembled continuously throughout construction | Assembled at draw request | Missing documentation discovered at draw time causes draw delays and cash-flow problems |
| Sampling rate | No codified standard — AHJ discretion applies | "We got to most of them" | Systematic pattern of deficiency in un-inspected spans goes undiscovered |

---

## Section 5: DAG Pointer Verification (T13 vocabulary_assumed)

The following vocabulary_assumed items have been verified against the DAG registry:

| Term | Source lesson per ARCH.md | DAG registry match |
|---|---|---|
| `punch list`, `kick-back authority`, `field inspector`, `substantial completion`, `acceptance walk` | T10.L11 | ✓ in `dag-registry.json` T10.L11 vocabulary_introduced |
| `depth probe`, `cover card`, `GPR` | T10.L04 | ✓ in `dag-registry.json` T10.L04 vocabulary_introduced |
| `slack loop`, `storage coil`, `MSA`, `NIU slack` | T10.L06 | ✓ in `dag-registry.json` T10.L06 vocabulary_introduced |
| `TCP`, `flagger station`, `MUTCD Part 6` | T10.L09 | ✓ in `dag-registry.json` T10.L09 vocabulary_introduced |
| `DFR`, `deviation log`, `as-built redline`, `pay application` | T10.L10 | ✓ in `dag-registry.json` T10.L10 vocabulary_introduced |
| `clearance`, `Rule 232`, `loading district`, `grade of construction` | T05.L01, T05.L04, T05.L06 | ✓ in `dag-registry.json` T05 vocabulary_introduced |
| `sag formula`, `sag-to-span ratio` | T05.L02, T05.L07 | ✓ in `dag-registry.json` T05.L02, T05.L07 |
| `pole class`, `joint-use` | T01.L02 | ✓ in `dag-registry.json` T01.L02 |
| `OLTS`, `OTDR`, `acceptance threshold`, `SOR file`, `loss report`, `test report components` | T12.L01, T12.L13, T12.L14 | ✓ in `dag-registry.json` T12 vocabulary_introduced |
| `IEC 61300-3-35 zone map`, `CIC sequence` | T12.L11 | ✓ in `dag-registry.json` T12.L11 |
| `LOTO`, `fall protection`, `PPE` | T18.L01–L05 | ✓ CLOSED topic |
| `grounding`, `bonding`, `messenger bond`, `ground rod`, `surge arrester` | T14.L01, T14.L03, T14.L04, T14.L07 | ✓ in `dag-registry.json` T14 vocabulary_introduced |
| `fall-of-potential`, `ground test log`, `aerial plant bonding schedule` | T14.L06, T14.L10 | ✓ in `dag-registry.json` T14.L06, T14.L10 |
| `TGB`, `IBT-entry`, `GES-tie-in` | T19 | ✓ CLOSED topic |

**No DAG violations identified.** All vocabulary_assumed terms have confirmed introductions in prior closed topics.

---

## Section 6: Interactivity Primitive Opportunities (Per-Lesson Summary)

| Lesson | Primary Primitive | Secondary Primitive | Notes |
|---|---|---|---|
| L01 | `<BranchingScenario>` (inspector authority decision) | `<Quiz>` (MC) | Foundation tone, light interactivity |
| L02 | `<AnnotatedDiagram>` (aerial span inspection points) | `<WorkedExample>` (clearance calc) | Diagram is the core — labeled measurement points |
| L03 | `<AnnotatedDiagram>` (pole cross-section inspection zones) | `<BranchingScenario>` (pole top rejection) | |
| L04 | `<WorkedExample>` (depth verification at 3 points) | `<BranchingScenario>` (depth deficiency response) | Math is central — depth calculation |
| L05 | `<BranchingScenario>` (slack shortage) | `<Quiz>` (MC) | |
| L06 | `<BranchingScenario>` (classify 5 deficiencies) | `<Quiz>` | Core decision framework |
| L07 | `<WorkedExample>` (Form 219 assembly walkthrough) | `<Quiz>` (MC) | Documentation workflow |
| L08 | `<WorkedExample>` (grounding inspection log review) | `<Quiz>` | Standards-heavy; worked example grounds it |
| L09 | `<Quiz>` (drag-to-match) | — | Lighter lesson — conceptual rights |
| L10 | `<BranchingScenario>` (integrated capstone) | `<Quiz>` (20Q) | Full scenario |

---

## Section 7: Citation Index

All citations are registry-verified against `audit-output/citation-registry.md` where applicable. New sources not in registry are flagged.

**Registry hits (no re-verification needed):**
- `29 CFR §1910.268` — Registry verified 2026-05-17
- `29 CFR §1910.147` (LOTO, assumed from T18) — Registry verified 2026-05-17
- `29 CFR §1910.146` (confined space, T18 prereq) — Registry verified 2026-05-17
- `7 CFR 1751F-630` — Registry verified 2026-05-17
- `7 CFR 1751F-635` — Registry verified 2026-05-17
- `33 CFR Part 323` (USACE Section 404, T09 prereq) — Registry verified 2026-05-17
- `NESC C2-2023` — Registry verified 2026-05-17 (paywalled; edition mark preserved)
- `NESC Rule 232` — Registry verified 2026-05-17

**New citations for registry (not yet in citation-registry.md):**

| Citation | Title/Description | Source | Scope |
|---|---|---|---|
| RUS Form 219 | RUS Close-Out Documentation Package | https://www.rd.usda.gov/resources/forms [public] | T13.L07 — Form 219 close-out workflow |
| RUS Bulletin 1751F-810 §3 | Bonding and Grounding Inspection Requirements | USDA RD publications repository | T13.L08 — grounding inspection acceptance threshold |
| 7 CFR Part 1755 §1755.903 | RUS Telecommunications Standards — loan draw requirements | https://ecfr.gov/current/title-7/part-1755 | T13.L07 — loan draw trigger |
| ANSI O5.1 | Wood Poles — Specifications and Dimensions | ANSI [paywalled — `[confirm edition]`] | T13.L03 — pole inspection criteria, CCA treatment |
| ASTM D1557 | Standard Test Method for Laboratory Compaction Characteristics (Modified Proctor) | ASTM [paywalled — `[confirm edition]`] | T13.L04 — proctor density acceptance |
| IEEE 81 | Guide for Measuring Earth Resistivity, Ground Impedance, and Earth Surface Potentials | IEEE [paywalled — `[confirm edition]`] | T13.L08 — fall-of-potential test method |
| NECA/FOA 301 | Standard for Installing and Testing Fiber Optic Cables | NECA/FOA [paywalled — `[confirm edition]`] | T13.L07 — acceptance testing reference in Form 219 |
| RUS 1753F-401 | Fiber Optic Splicing — Maximum allowable splice loss | USDA RD [verify current bulletin number] | T13.L07 — test report acceptance threshold in Form 219 |

---

## Section 8: Proposed Allowlist Additions

The following sources were used in this brief and are not yet on the allowlist. Flag for orchestrator review:

1. **RUS Form 219** — USDA RD public forms repository. Standard close-out documentation package for RUS-financed telecom construction. Should be added to the allowlist under "Federal Regulations / Telecom & RUS" section.
2. **ANSI O5.1** — Already in allowlist under "ANSI / ICEA" section. Confirmed.
3. **ASTM D1557** — Standard Proctor compaction test. Not currently on allowlist. Add under "ASTM" section for T13 and T10 use.
4. **NECA/FOA 301** — Fiber installation and testing standard. Referenced as secondary source in T12 brief; should be formally on the allowlist. Add under "FOA (Fiber Optic Association)" section.

---

=== T13 RESEARCH R-1 BRIEF END ===
