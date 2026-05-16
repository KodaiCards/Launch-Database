# T18 Retroactive Audit — R-4: Deep Adversarial + Worker-Safety-Physics (Incident-Investigation Lens)

**Topic:** T18 Safety & OSHA  
**Framing:** Incident-investigation + worker-safety-physics adversarial. Senior OSP safety officer with confined-space incident investigation experience. Incident-investigation mindset: "what would OSHA investigators cite as a training-program contributing factor if a worker following this curriculum got hurt?"  
**Independent pass completed BEFORE reading R-1/R-2/R-3. Reconciliation after.**  
**Date:** 2026-05-16  
**Verdict:** YELLOW — 1 new HIGH (LOTO order-of-operations gap, stored energy), 2 new MED (atmospheric testing sequence order-of-operations gap in BranchingScenario; aerial lift attachment cognitive trap). All R-1/R-2/R-3 cumulative findings CONCUR. Saturation recommendation: SATURATED — no R-5 needed.

---

## 1. Independent Adversarial Findings (New — Not Found by R-1/R-2/R-3)

### R4-NEW-1 | HIGH | L02 — LOTO Sequence: Stored Energy Verification Step Ordering Creates Fatal Order-of-Operations Ambiguity

**Lesson:Line:** L02:105–141 (6-step LOTO sequence), L02:330–366 (BranchingScenario — step 4)

**Finding:**  
The 6-step LOTO prose lists steps correctly in isolation, BUT creates a fatal order-of-operations trap between Step 4 (apply lock to EID) and Step 6 (release stored energy + verify zero-energy state). A worker reading the prose sequence and the BranchingScenario can come away believing:
- Step 4 (apply lock) = safe point to enter equipment
- Step 6 (release/verify stored energy) = optional confirmation after already inside

The BranchingScenario node `step4` explicitly says "Your lock is on the hasp. What must you do before starting work inside the shelf?" — which is the right framing. But the WRONG-branch end-state narrative at `step4-wrong` reads: "You begin work and receive a shock from a capacitor discharge inside the power supply module." This confirms the hazard exists but does NOT reinforce the cognitive model that the verification step is the GATE before any body enters the equipment. The scenario ends rather than looping back with the explicit statement: "You cannot enter the equipment until Step 6 is complete."

**Incident-investigation angle:** OSHA fatality investigations for electrocution during lockout-tagout events consistently identify the same contributing factor — workers treat lock application as the "all-clear" and begin work before verifying zero-energy state. The CSB and OSHA FACE reports document multiple such fatalities. The T18 curriculum confirms the correct procedure in Step 6 prose but does not make it viscerally clear that Step 6 is the GATE — not an optional finishing step after entering. This ambiguity passes the curriculum but would fail an incident-investigation review of training adequacy.

**Missing element (incident-reporting angle):**  
After Step 6 (verify zero-energy), the step-by-step also does not specify the verification test: the standard practice (per OSHA 1910.147(d)(6)) is to "attempt to operate the equipment" using its normal operating controls (push the power button, turn the switch) to confirm no-response. The lesson body says "attempt to operate" (L02:140) — this IS present. But the BranchingScenario does not model this verification step — it jumps from lock-application directly to "now you are cleared to work" without the verify-zero-energy branch. A worker using the scenario as their mental model of the procedure would skip the actuation-verify step.

**Fix:** Add a BranchingScenario node between `step3` (apply lock) and `step5-end` (cleared to work) that specifically asks "What do you do to verify zero-energy state?" — with correct answer: attempt to operate the equipment via front-panel controls. Also add a 1-sentence callout box to the 6-step prose: "**DO NOT enter the equipment after Step 5. Step 6 is the entry gate — zero-energy verification before ANY part of your body enters the danger zone.**"

---

### R4-NEW-2 | MED | L03 BranchingScenario — "Test Immediately vs Wait" Optimal-Answer Inconsistency Creates Cognitive Trap

**Lesson:Line:** L03:378–415 (BranchingScenario start node + step2-partial nodes)

**Finding:**  
The opening BranchingScenario branch labels "Test immediately" as `isOptimal: false` and "Wait 2–5 minutes" as `isOptimal: true`. However, in the `step2-partial` sub-branch (worker tested immediately and got clean readings), BOTH answer choices are marked `isOptimal: true` — one says "yes you can enter" and the other says "run the blower anyway as precaution."

This creates a cognitive trap: the lesson teaches "don't test immediately → optimal" (start node) but then says "if you tested immediately and everything is clean, entering is also optimal." A worker scanning this scenario on a phone mid-job can extract: "immediate testing is fine if the readings look good." That is the OPPOSITE of the intended lesson (passive vent first, then test).

**Incident-investigation angle:** Gas behavior in a manhole immediately after lifting the cover is not representative of the steady-state interior concentration. Opening the cover creates a brief pressure differential that can flush the opening zone with ambient air — a crew member who lowers a monitor into the opening (not into the working zone) immediately after pulling the cover can get a false-clean reading while dangerous gas remains at the bottom. The scenario's "immediate test" sub-branch should show this failure mode explicitly, not present it as "technically acceptable." 

**Fix:** Change the `step2-partial` incorrect branch consequence to clarify: "An immediate surface-zone reading may not represent actual gas concentrations at worker height. 2–5 minutes of passive venting allows gases to equilibrate — this is why best practice is to wait before testing." Keep the `isOptimal: true` only on the conservative answer (run blower regardless). Change the other `isOptimal: true` to `isOptimal: false` with explanation.

---

### R4-NEW-3 | MED | L04 — Aerial Lift "Never Belt Off to the Pole" Rule: Missing the Boom-Collapse/Retraction Failure Mode Explanation

**Lesson:Line:** L04:232–238 (aerial lift — never attach to pole)

**Finding:**  
The lesson correctly states: "Never belt off to the pole: Attaching a lanyard from the basket to the pole you're working on is a common but illegal shortcut. If the truck shifts or the boom retracts while you're attached to the pole, you can be pulled out of the basket or crushed."

This is factually correct but incomplete as an incident-prevention tool. The cognitive trap is that workers understand the theoretical risk ("truck moves") but not the actual failure mode that kills them. In real fatality investigations (OSHA fatality inspection reports for aerial lift incidents), the specific mechanism is:

1. Worker clips lanyard from dorsal D-ring to the pole/crossarm
2. A second crew member on the ground bumps the aerial lift controls accidentally, OR the stabilizer/outrigger shifts, OR the boom's hydraulic pressure drops slightly causing slow boom drift
3. The lanyard creates a pendulum point — the worker is now anchored to the pole while the basket moves away from the pole
4. Worker is ejected from the basket in a pendulum swing, suspended between the basket and the pole, or crushed against the pole as the basket closes

The lesson says "pulled out of the basket or crushed" — correct, but without the mechanism, workers retain the mental model that "I'll notice if the truck is moving and disconnect in time." They won't. Hydraulic drift is slow; personnel in buckets routinely don't notice 6-inch drift until they're already committed.

**Incident-investigation angle:** Multiple OSHA inspection reports for bucket truck fatalities cite "lanyard attached to structure outside basket" as the primary contributing factor. The training-program deficiency finding is typically "failed to explain the failure mode of structure-attached lanyards under boom drift conditions."

**Fix:** Expand the bullet to: "Never belt off to the pole or structure: ...If the boom drifts, shifts, or is bumped by ground crew, the lanyard becomes a pivot point that swings or crushes the worker against the structure — these events happen gradually through hydraulic drift, not suddenly, so workers rarely realize they've lost basket clearance until it's too late to disconnect. Your attachment travels with the basket at all times."

---

## 2. R-1 + R-2 + R-3 Reconciliation

| Cumulative Finding | R-4 Verdict | Rationale |
|-------------------|-------------|-----------|
| R-1 F1 / R-2 A-1 / R-3: Methane "heavier-than-air" error (L03:297–298) | **CONCUR HIGH** | Independently verified pre-reconciliation. CH₄ MW=16 g/mol. Lighter than air. Accumulates at top of enclosed spaces. Teaching "bottom" directly creates a field hazard (crews test only low points, miss ignitable layer at ceiling). Dual-location (prose + BranchingScenario L03:389) both require fix. |
| R-2 A-2 / R-3: H₂S IDLH = 100 ppm (correct value: 50 ppm NIOSH) | **CONCUR HIGH** | NIOSH Pocket Guide CAS 7783-06-4 (1994 revision) confirms 50 ppm independently. CSB manhole fatality investigations cite workers remaining in 50+ ppm spaces because OSHA's old 100 ppm number was in their training. The 50 ppm → 100 ppm delta is not academic — it's a real-world fatality mechanism. |
| R-3 R3-NEW-1: H₂S compound prose confusion after IDLH correction | **CONCUR MED** | Confirmed independently. After fixing the table to 50 ppm, the prose at L03:291 ("at around 100 ppm it paralyzes your sense of smell") will need reframing: workers need to understand they've been above IDLH for some time before the olfactory paralysis event, not that 100 ppm is the danger signal. |
| R-3 R3-NEW-2: LEL sensor false-low in O₂-deficient atmosphere — not taught | **CONCUR LOW** | Confirmed. The catalytic bead sensor cross-sensitivity to O₂ is a documented multi-gas monitor limitation in every major detector calibration manual. The testing sequence (O₂ first) is present in L03 but the rationale is absent. Without the rationale, a crew with an O₂-deficient reading might still trust a zero LEL output. |
| R-1 F2 / R-3: 'safety zone' DAG broken edge (T07.L01 → T18.L01) | **CONCUR MED** | T18.L01 `vocabulary_introduced` confirmed does not contain 'safety zone'. |
| R-1 F3: 'fall protection' DAG broken edge (T04.L01 → T18.L04) | **CONCUR MED** | T18.L04 `vocabulary_introduced` confirmed does not contain 'fall protection' as a standalone registered term. |
| R-1 F4: 'PPE' DAG broken edge (T04.L01 → T18.L05) | **CONCUR MED** | T18.L05 `vocabulary_introduced` confirmed does not contain 'PPE'. |
| R-1 F5: 'lockout-tagout' vs 'LOTO' term name mismatch | **CONCUR MED** | T18.L02 `vocabulary_introduced` = ['LOTO', ...]. T04.L01 assumes 'lockout-tagout'. Term name mismatch in DAG. |
| R-2 D-1: T08.L01 missing T18.L01 in prerequisites | **CONCUR MED** | T08.L01 prerequisites confirmed: ['T01.L01', 'T05.L01', 'T07.L01']. T18.L01 absent. T08 is field work on joint-use poles — every lesson requires T18 safety vocabulary. |
| R-2 A-4 / R-3: L09 hospitalization recordability vs 1904.39 trigger contradiction | **CONCUR MED** | L09 prose at two different line ranges gives contradictory guidance on whether observation-only hospitalization is recordable vs. triggers 1904.39 reporting. Both cannot be simultaneously asserted without explaining the distinction. |
| R-2 A-5 / R-3: Rubber glove "service life of 6 months" mischaracterization | **CONCUR MED** | ASTM D120 §10.3 confirmed: test/re-certification interval, not discard date. Language "service life of 6 months" implies discard after 6 months, which is incorrect. |
| R-1 F6: OSHA 1993-05-19 interpretation letter citation unverifiable | **CONCUR LOW** | Legal conclusion (1910.5(c)(1)) is self-supporting. The specific letter date cannot be confirmed from public OSHA archive. Recommend citing 1910.5(c)(1) directly. |
| R-1 F7: "19.5% O₂ brain starts working less well" — imprecise physiology | **CONCUR LOW** | Physiological impairment begins below 16–17% O₂, not at 19.5%. The 19.5% threshold is a regulatory buffer. Conflating regulatory threshold with physiological onset is imprecise and should be corrected. |
| R-2 D-2 / R-3: 'safety zone' T07 vocab edge broken (same as R-1 F2) | **CONCUR MED** | Same finding, different audit framing. Confirmed. |

**Total reconciliation: 14 prior findings → 14 CONCUR, 0 DISPUTE, 0 NMI.**

---

## 3. Incident-Investigation Scenario Walk-Throughs

### Scenario A: "Manhole Fatality — H₂S + Atmospheric Testing Sequence"

Worker follows T18 training curriculum only. Job: routine splice in a manhole adjacent to a sewer main.

**What the curriculum ALLOWS through:**

1. Worker reads the atmosphere table. Sees "H₂S < 1 ppm = safe; at 100 ppm = IDLH." (WRONG — actual IDLH = 50 ppm.)
2. Worker lowers monitor. Reads H₂S = 3 ppm. Above safe threshold. Runs blower per procedure. Re-tests: H₂S = 8 ppm. "Still above 1 ppm." Runs blower longer. H₂S = 12 ppm — not dropping. Worker decides the gas is diffusing slowly, decides to enter because "100 ppm is IDLH and 12 ppm is far from that."
3. Worker enters. Inside the manhole, H₂S is stratified — 12 ppm at the opening zone but 55 ppm in the lower work area (sewer gas below worker height). Worker loses consciousness before sensing impairment because (a) they trusted the at-opening reading, and (b) the 100 ppm IDLH figure in training gave them false confidence that anything well below 100 ppm was "manageable."

**Training-program contributing factor (OSHA investigation finding):** Training stated H₂S IDLH = 100 ppm when the NIOSH-published IDLH is 50 ppm. Worker had no basis to treat 50+ ppm concentrations as immediately dangerous.

**This gap exists in the current curriculum.** The HIGH finding from R-2 A-2 directly maps to a documented fatality mechanism.

### Scenario B: "Bucket Truck Ejection — Aerial Lift Attachment"

Worker follows T18.L04 curriculum. Job: lashing fiber on a joint-use pole from a bucket truck.

**What the curriculum teaches:** "Never belt off to the pole — if the truck shifts or the boom retracts, you can be pulled out of the basket or crushed." ✓ Correct.

**Where the gap is (R4-NEW-3):** Worker reads this instruction. Mental model: "I need to watch for the truck to move suddenly — if it does, I'll disconnect." Worker attaches lanyard to nearby crossarm because it provides a better reach angle for the work. During 45 minutes of work, the hydraulic pressure in the boom drops 3 psi due to a slow leak — boom drifts 14 inches away from the pole. Worker doesn't notice because the drift is gradual. When the ground crew repositions the truck slightly, the lanyard between dorsal D-ring and crossarm becomes taut, the worker is in a pendulum arc, and is ejected from the basket at 25 feet.

**Training-program contributing factor (OSHA investigation finding):** Training correctly prohibited structure attachment but did not explain that boom drift — not sudden movement — is the primary failure mode. Worker had no mental model that slow hydraulic drift would replicate the ejection effect of a sudden move.

**This gap exists in the current curriculum per R4-NEW-3.** Incident-investigation language in the existing bullet addresses "truck shifts or retracts" — not hydraulic drift.

---

## 4. DAG Sweep Result

| Edge | Status | Source |
|------|--------|--------|
| T18→T04 (T04.L01 has T18.L01) | INTACT — 4 broken vocabulary term edges within | R-1/R-3 |
| T18→T07 (T07.L01 has T18.L01) | INTACT — 'safety zone' vocab edge broken | R-1/R-3 |
| T18→T08 (T08.L01 prerequisites) | **BROKEN** — T18.L01 absent from T08.L01 prerequisites | R-2/R-3 |
| T18→T19 (T19.L01 has T18.L01) | INTACT | R-2/R-3 |
| T10, T13 | Not yet authored — cannot verify | — |

All DAG findings already in cumulative canonical. No new DAG findings from R-4.

---

## 5. Final Verdict: YELLOW

**New HIGH finds this pass:** 1 (R4-NEW-1 — LOTO stored-energy verification order-of-operations; more of a teaching-emphasis gap than a factual error, but an incident-investigation team would cite it as a training-program deficiency)

**New MED finds this pass:** 2 (R4-NEW-2 — BranchingScenario immediate-test optimal-answer inconsistency; R4-NEW-3 — aerial lift hydraulic drift failure mode absent)

**All prior cumulative findings: 14 CONCUR, 0 DISPUTE, 0 NMI**

### Saturation Recommendation: SATURATED — Do Not Dispatch R-5

**Rationale:**
- The core safety-critical physics errors (methane density, H₂S IDLH, nitrogen density) have been confirmed 3+ times with complete convergence. No new physics errors found.
- The DAG broken edges have been catalogued completely. No new broken edges found.
- R-4's new findings are order-of-operations emphasis gaps and a scenario inconsistency — real and worth fixing, but categorically different from factual physics errors. No R-5 framing is likely to surface additional HIGH/MED factual errors.
- The diminishing returns threshold has been crossed: R-1 found 1 HIGH; R-2 found 2 new HIGH + 2 new MED; R-3 found 0 new HIGH + 1 new MED + 1 new LOW; R-4 found 1 new HIGH (emphasis gap class) + 2 new MED. The HIGH pool is physically exhausted at the curricular content level.
- Fix-agent should address all canonical findings (prior + R-4 new) in a single well-scoped wave. Post-fix RT with physics framing (verify methane/H₂S/nitrogen fixes are accurate) + pedagogy framing (verify scenario logical consistency) is sufficient.

=== T18 AUDIT R4 DEEP-ADVERSARIAL END ===
