# T08 Make-Ready & Pole Attachment — R-3 Retroactive Audit
## Framing: Forensic / Incident-Investigation / Field-Failure-Scenarios

**CONSTRAINTS ACKNOWLEDGED: READ-ONLY. Write-path limited to this file only. No lesson edits. No canonicals. No fix application. No follow-up round dispatch. No orchestrator impersonation.**

---

## Stack Snapshot (≤80 words)

R-3 forensic sweep confirms the two R-2 HIGHs (§1.1413 and §1.1414 wrong-topic) independently via primary-source search — eCFR section titles confirmed: §1.1413 = "Complaints by incumbent local exchange carriers" (not cost recovery), §1.1414 = "Review period for pole attachment complaints" (not dispute resolution procedure). Self-help cost recovery is confirmed in §1.1411(i). R-3 adds one new MED: T08 is silent on the 2023 FCC 23-109 betterment/cost-allocation rule changes that directly affect L06 pole-replacement cost-causation scenarios. All 12 forensic scenarios assessed. Quiz math confirmed correct.

---

## Forensic Scenario Coverage Table

| # | Scenario | Coverage verdict | Lesson:Location | Gap / Adequacy |
|---|----------|-----------------|-----------------|----------------|
| 1 | OTMR self-help fee dispute → ALJ → wrong CFR cited → case dismissed | **Present + INADEQUATE** | L02:254-256, L04:various | §1.1413 cited throughout as "cost recovery for self-help" — wrong section. Learner citing §1.1413 in an actual proceeding would likely be dismissed or corrected by opposing counsel. Self-help cost recovery lives in §1.1411(i). This is R-2's HIGH R2-N1 — confirmed independently. |
| 2 | Pole-replacement betterment dispute — proportional cost only | **Present + INADEQUATE (MED)** | L06 | FCC 23-109 (December 2023) clarified the betterment rule significantly: attacher pays only incremental cost above equivalent-pole cost when defective pole must be replaced with taller/stronger pole; "necessitated solely" examples enumerated. T08 L06 teaches the proportional load-share framework but does NOT mention the 2023 betterment rule update. A learner litigating a betterment dispute using only L06 knowledge would miss the FCC 23-109 defense ("pole was already on replacement schedule" → attacher owes nothing for equivalent pole). |
| 3 | OSHA 1910.269 climbing-space violation — worker safety zone | **Present + Adequate (delegated)** | L01:lines ~338-347 | T08 correctly states that energized power conductors "cannot be moved by telecom contractors regardless of OTMR rules; NESC §23 + utility tariff governs" and T18.L01 covers OSHA via vocabulary_assumed. OSHA 1910.269 is not cited by name in T08, but T18 covers MAD/MAB and the prerequisite chain is intact. Adequate via delegation. |
| 4 | NESC Rule 232 vertical clearance compliance failure at road crossing | **Present + Adequate** | L04:170-200, L05:various | Rule 232 and road clearance are directly addressed in L04 cost-causation scenarios. "15 ft 6 in" value with road-class qualifier gap (R-1 F5, R-2 confirmed) is a LOW finding already captured. Adequate for foundational clearance teaching. |
| 5 | 5G small-cell §6409(a) deemed-granted shot clock — local jurisdiction sued | **Absent — but out of scope** | — | §6409(a) / 47 CFR §1.6100 (Wireless Facility Modifications) governs small cell collocations, not macro aerial fiber attachments. T08 correctly scopes to aerial fiber. R-2 adversarial sweep already confirmed this as appropriate out-of-scope omission. No gap within T08's defined scope. |
| 6 | Betterment dispute — utility uses make-ready to upgrade entire grid, attacher claims betterment allocation | **Present + INADEQUATE (MED, same as #2)** | L06:30-50 | Same FCC 23-109 gap. T08 teaches "proportional load share" but not the 2023 "necessitated solely" framework and examples (road expansion, pole already on replacement schedule, storm hardening, applicable law). A learner defending against inflated pole-replacement charges would lack the FCC 23-109 argument. |
| 7 | Pole-loading analysis dispute — utility uses old ANSI O5.1 + NESC Rule 250, attacher disputes | **Present + Adequate (delegated)** | L06 + T05 | L06 correctly cites NESC §24 for structural requirements + T05 (pole loading) as the loading analysis lesson. T05 covers NESC loading districts, Rule 250-series design loads. Cross-topic delegation is clean. |
| 8 | Wireless attachment to wood pole + RF safety compliance failure | **Absent — out of scope** | — | RF/EMF safety on shared poles (FCC OET Bulletin 65, OSHA 1910.97) is outside T08's fiber-make-ready scope. Appropriate omission. |
| 9 | Joint-use agreement breach — utility unilaterally changes JU pole accessor without 30-day notice | **Present + Adequate** | L08:vocabulary_introduced tariff/JU | T08 addresses JU agreement structure via tariff/ILEC tariff book definitions and attachment agreement terms. 30-day notice specifics depend on JU contract terms, not CFR. Adequate at T08's depth. |
| 10 | Make-ready cost allocation across multiple attachers — proportional vs. equal split | **Present + Adequate** | L06:80-120 | Cost causation principle (proportional to load contribution) is taught in L06 worked example (80%/12% split). FCC framework confirmed correct. |
| 11 | Climbing space encroachment by RF coax — NESC Rule 235 communication-worker safety zone, 40-inch minimum | **Present + INADEQUATE (LOW)** | L01, L04 | NESC Rule 235 establishes the 40-inch minimum between lowest supply attachment and top of communication space. T08 does not explicitly teach Rule 235 or the communication-worker safety zone concept. A staker or PM relying solely on T08 would not know the Rule 235 enforcement hook during make-ready. T05 covers loading/clearance; T07 covers pole audit. This is a delegation gap — the safety zone is part of the make-ready site evaluation and belongs in T08's "reading a pole audit" section (L03, L07). LOW because T18 covers worker safety and the gap is field-context rather than a factual error. |
| 12 | State PUC opt-out from FCC §224 — what's actually different in opt-out states? | **Present + Adequate** | L01:355-363 | T08 correctly flags "roughly 22 states have certified programs" and instructs learners to verify current FCC list. The lesson correctly notes OTMR may be "available under state rule, modified, or not available at all." The specific differences (state PUC vs. FCC jurisdiction, opt-out implications) are noted with a verify-at-publication marker. Adequate for field audience. |

---

## CFR Citation Cascade Sweep

Primary-source verification of ALL §1.141x citations appearing in T08 (R-1/R-2 flagged §1.1413 and §1.1414; R-3 sweeps the remaining section family):

| CFR Section | Claimed use in T08 | Actual section title (eCFR confirmed) | Match? |
|-------------|-------------------|--------------------------------------|--------|
| 47 CFR §1.1411 | Core OTMR authority — timeline, 15-day clock, self-help | "Timeline for access to utility poles" ✓ | **CORRECT** |
| 47 CFR §1.1411(i) | Self-help cost recovery (how applicant bills pole owner) | Confirmed: self-help provisions in §1.1411(i) — "a new attacher may conduct the make-ready in place of the utility" — correct home for cost recovery | **CORRECT (used implicitly; should be cited explicitly as §1.1411(i))** |
| 47 CFR §1.1413 | "Cost recovery rules for self-help make-ready" — L02:255, L02:402, L04:various, L06:various | Actual title: **"Complaints by incumbent local exchange carriers"** — WRONG substantive topic | **WRONG (confirmed R-2 R2-N1)** |
| 47 CFR §1.1414 | "Dispute resolution procedure (informal negotiation → FCC complaint)" — L03 | Actual title: **"Review period for pole attachment complaints"** — 180-day review clock, NOT dispute resolution | **WRONG (confirmed R-2 R2-N2)** |
| 47 CFR §1.1404 | Not cited in T08 | Actual title: "Pole attachment complaint proceedings" — this is the correct dispute resolution section T08 should reference | **MISSING — should replace §1.1414 in L03** |
| 47 U.S.C. §224 | Pole Attachment Act citation | Confirmed correct — §224 is the Pole Attachment Act | **CORRECT** |
| 47 U.S.C. §224(c) | State-certified program framework | Confirmed correct | **CORRECT** |
| 47 U.S.C. §224(f) | FCC enforcement authority / forfeitures | Confirmed correct | **CORRECT** |

**R-3 cascade finding:** No additional wrong-section citations beyond the two R-2 HIGHs. §1.1411, §224, §224(c), §224(f) all independently verified correct. The §1.1413/§1.1414 errors are isolated — not part of a systemic naming-shift pattern. Confirmed that the correct home for dispute resolution is §1.1404 ("Pole attachment complaint proceedings") and self-help cost recovery is §1.1411(i).

---

## R-1/R-2 Reconciliation (≤120 words)

R-1 and R-2 findings independently confirmed by R-3:
- **R2-N1 (§1.1413 wrong topic) — CONFIRMED HIGH.** eCFR title unambiguous: "Complaints by incumbent local exchange carriers." Self-help cost recovery is §1.1411(i). 5 locations across L02/L04/L06 need correction.
- **R2-N2 (§1.1414 wrong topic) — CONFIRMED HIGH.** eCFR title unambiguous: "Review period for pole attachment complaints" (180-day review clock). Dispute resolution = §1.1404. L03 needs correction.
- **R1-F1 (schema deviation L07–L11) — CONFIRM LOW per R-2.** Style-only, no operational DAG or rendering break.
- **R1-F2 (NESC §23 notation) — CONFIRMED MED.** NESC uses Rule numbering (230-series), not §23.

---

## Structured New Findings

| ID | Severity | Category | Lesson:Location | Issue | Fix Shape | Source | Confidence |
|----|----------|----------|-----------------|-------|-----------|--------|------------|
| R3-N1 | **MED** | Missing rule (post-2023 FCC order) | L06: cost causation section | FCC 23-109 (December 2023 pole attachment order) clarified the "necessitated solely" betterment standard: when a defective pole must be replaced, attacher pays only the INCREMENTAL cost of a stronger/taller pole (not the full equivalent-pole cost); and enumerated specific conditions where the replacement is NOT "necessitated solely" by the new attacher (pole on replacement schedule, road expansion, storm hardening, applicable law, NESC failure independent of new load). T08 L06 teaches proportional load-share correctly but is silent on these exemptions and the 2023 update. A learner disputing a pole-replacement invoice from a utility that used make-ready to upgrade aging infrastructure would not know to invoke the FCC 23-109 betterment defense. | Add a sub-section to L06 Advanced tier: "FCC 23-109 betterment rule (2023): when attacher owes nothing for equivalent-pole cost + when attacher owes only incremental cost." Cite FCC 23-109 + current 47 CFR Part 1 Subpart J betterment provisions. | FCC 23-109 (Dec 2023); search-confirmed DWT and FCC Law Blog analyses; §1.1411 OTMR amendments | HIGH |
| R3-N2 | **LOW** | Missing safety-zone reference | L03/L07: pole audit reading section | T08 teaches how to read a pole audit (L03, L07) for simple vs. complex and clearance determination, but does not explicitly reference NESC Rule 235's communication-worker safety zone (40-inch minimum between lowest supply conductor and top of communications space, reducible to 30 inches if supply neutral is bonded). This is a field-usability gap: a staker reviewing a pole audit for make-ready needs to verify the 40-inch safety zone is maintained post-make-ready, not just check attachment heights for NESC §232 ground clearance. No factual error — the gap is coverage. | Add one sentence in L03 or L07 working tier: "The pole audit must also verify that the proposed attachment maintains the NESC Rule 235 40-inch communication-worker safety zone below the lowest supply-space conductor (reducible to 30 inches if supply neutral is bonded per Rule 235)." | NESC Rule 235 — confirmed via NESC clearing-house guides and Alden ikeGPS references; search-verified 40-inch standard | MEDIUM |
| R3-N3 | **LOW** | Citation precision | L02:254-256, L02:401-402 | §1.1411(i) is the correct subsection for self-help cost recovery, but T08 cites §1.1413 [confirm section] rather than §1.1411(i) [confirm subsection]. Even if the [confirm section] markers survive, the wrong parent section is cited. Once §1.1413 is corrected (per R2-N1 fix), the replacement citation should be §1.1411(i) with a [confirm subsection] marker — not just "§1.1411" (the whole section covers the full 15-day clock timeline; the cost-recovery sub-provision is specifically (i)). | After applying R2-N1 fix, update to "47 CFR §1.1411(i) [confirm subsection]" rather than bare "§1.1411" for cost-recovery references. | eCFR §1.1411; OJUA OTMR summary document confirmed self-help = §1.1411(i) | HIGH |

---

## Pedagogy / Field-Crew Learner Check

Sampled L09 and L11 as a field-crew learner with no FCC background:

**L09 (Application, Permit, and Inspection Path):** Acronyms generally defined inline via the vocabulary_introduced dict (schema deviation noted in R-1/R-2). AHJ, MRE, NESC all defined. The vocabulary_introduced is a dict (L09 schema deviation pattern). No material pedagogy gap — content reads accessibly.

**L11 (Make-Ready as PM Problem):** Plain-English analogy (foundation pour) is strong. Float calculation is clearly explained. FCC timeline pressure is correctly framed as "use as leverage, not weapon" — matches field practice.

**OTMR/multi-party plain-English framing (L01):** "house renovation with one general contractor vs. five separate trades" analogy is excellent and field-accessible. No pedagogy gap.

**FCC procedural content (L02, L03):** §1.1413 wrong-topic citation is an accuracy issue, not a pedagogy issue. Once fixed, the 15-day clock sequence and self-help procedure steps are written clearly and would be understandable to a field PM with no legal background.

---

## Quiz / Flashcard Depth Audit (L09, L10, L11, L12 sample)

Re-derived independently:

| Quiz ID | Question | Stated answerIndex | Independent verification |
|---------|----------|-------------------|--------------------------|
| L09 (no explicit quiz found — schema deviation, content in vocab_introduced dict) | — | — | Schema-deviated L09 has no Quiz component in the read portion. Vocabulary content is rich. No quiz math to verify. |
| L10 (similar schema deviation) | — | — | No quiz questions found in lines read. Content is narrative + vocab dict. |
| L11 float Q2 (confirmed by R-1/R-2) | back-end = 3+1+1=5; Week 18−5=13; expected Week 12; float=1 week | answerIndex 1 (1 week) | **1 week ✓** — re-derived independently |
| L12 Cap Q06 cost-split | 88+14=102; 88/102=86.3%, 14/102=13.7% | "approximately 86/14" | **86.3%/13.7% ✓** |
| L12 Cap Q09 | 1 pole × $120/yr × 20 yr = $2,400 | answerIndex correct | **$2,400 ✓** |
| L12 Cap Q15 float | back-end = 2+1+1=4; Week 14−4=10; expected Week 9; float=1 week | 1 week | **1 week ✓** |

All quiz math re-derived correctly. No quiz arithmetic errors found.

---

## Cross-Topic DAG Sample (5 pointers)

| Lesson | Term assumed | Claimed source | R-3 verification |
|--------|-------------|----------------|------------------|
| L01 | 'pole attachment' | T05.L08 | T05.L08 covers pole attachment per T05 audit history ✓ |
| L02 | 'make-ready' | T07.L02 | T07.L02 introduces make-ready — T07 closed GREEN ✓ |
| L04 | 'NESC clearance' | T05.L04 | T05.L04 covers NESC clearance per T05 audit ✓ |
| L09 | 'NESC' | T05.L01 | T05.L01 introduces NESC — confirmed ✓ |
| L11 | 'self-help remedy' | T08.L02 | T08.L02 introduces in meta.vocabulary_introduced ✓ |

DAG pointers all sound. No cross-topic DAG break found.

---

## Vite Build Result

`cd osp-training && npm run build` — **✓ Built successfully in 5.75s.** Zero errors. Zero warnings. T08 lesson files compile cleanly against current HEAD.

---

## Saturation Verdict

**HIGH curve: R-1=0 HIGH, R-2=2 HIGH, R-3=0 new HIGH.** HIGH pool appears saturated after R-2. No new HIGH errors were found in R-3's forensic sweep — the §1.1413/§1.1414 wrong-topic citations are independently confirmed but not new discoveries.

**MED curve: R-3 adds 1 new MED (R3-N1: FCC 23-109 betterment gap).** R-1 found 3 MED, R-2 found 1 MED (tolling completeness), R-3 found 1 new MED. Not yet saturated on MED.

**LOW curve: R-3 adds 2 new LOWs (R3-N2 Rule 235 safety-zone, R3-N3 §1.1411(i) subsection specificity).** LOW pool still producting. Not saturated.

**Saturation hint for R-4 (if warranted by orchestrator):** Focus on (a) state opt-out implications in practice (what IS different in a certified state for OTMR?), (b) joint-use agreement contractual terms vs. FCC-governed defaults (T08 describes FCC framework only; JU agreements may vary), (c) whether L09/L10/L11 lack of Quiz components is intentional (schema deviation) or a gap requiring authoring. R-4 would likely find primarily LOWs.

**Orchestrator recommendation:** The fix wave should address R2-N1, R2-N2, and R3-N3 together (all §1.141x citation corrections in one pass), and R3-N1 (FCC 23-109 betterment, L06 Advanced tier addition) separately. R-4 is optional given diminishing HIGH returns; R-3's forensic framing was the highest-leverage remaining angle.

---

`=== T08 AUDIT R3 FORENSIC END ===`
