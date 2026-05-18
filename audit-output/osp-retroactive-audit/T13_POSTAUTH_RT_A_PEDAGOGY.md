# T13 Post-Author RT-α — Pedagogy / Coverage / DAG Framing

**Topic:** T13 — Inspection & Quality Assurance  
**Agent role:** Post-author Red Team RT-α (pedagogy / coverage completeness / citation existence)  
**Scope:** All 12 authored lessons (L01, L11, L12, L02–L09 in teaching order + L10 capstone)  
**Author wave commits reviewed:** `8f6a000 → 7f18797 → db9e2fe → 26c12dd`  
**Canonical:** T13_CANONICAL.md (`cc8baf0`) — 24 HIGH findings  
**Read-only framing:** This agent reads and reports only. No fixes applied.  
**Write-path:** This file only.

---

## Section 1: Pre-Checks

**Vite build:** ✅ CLEAN — `npm run build` in `osp-training/` — built in 5.73s, zero errors, 12 T13 lesson chunks generated.

**Schema validator (12/12):** All 12 lesson files pass: `meta` export with `id: 'T13.Lxx'`, `order`, `vocabulary_introduced`, `key_terms`, `vocabulary_assumed`, default function export.

**Flashcard coverage:** All lessons with `vocabulary_introduced` entries have matching `key_terms` array entries.  
- L01: 6 vocab → 6 key_terms ✅  
- L02: 3 → 3 ✅  
- L03: 2 → 2 ✅  
- L04: 2 → 2 ✅  
- L05: 0 → 0 ✅  
- L06: 2 → 2 ✅  
- L07: 3 → 3 ✅  
- L08: 3 → 3 ✅  
- L09: 3 → 3 ✅  
- L10: 0 (capstone) ✅  
- L11: 8 → 8 ✅  
- L12: 11 → 11 ✅  

*Note: parser regex false-alarm on backslash-escaped apostrophe in `'RUS Form 553a (Contractor\'s Certificate)'` — all 8 L11 key_terms confirmed present by direct file read.*

**Flashcard render check (all lessons with key_terms):**  
`{meta.key_terms.map((kt) => (<Flashcard key={kt.term} .../>))}` pattern confirmed present in L01, L02, L03, L04, L06, L07, L08, L09, L11, L12. L10 capstone has no key_terms (correct — capstone-quiz type). ✅

---

## Section 2: HIGH Findings Verification (all 24)

| ID | Lesson | Canonical requirement | Verified |
|----|--------|----------------------|---------|
| H-01 | L01 | `acceptance walk`, `punch list`, `kick-back authority` → vocabulary_assumed T10.L11 (not introduced) | ✅ All 3 in vocabulary_assumed → T10.L11 |
| H-02 | L01 | `inspector (OSP)` → vocabulary_assumed T01.L06 | ✅ Present in vocabulary_assumed |
| H-03 | L05 | No independent numeric minimums; defer to T10.L06 MSA | ✅ vocab_assumed has `MSA` → T10.L06; quiz Q1 explicitly states "T13 does NOT introduce independent slack minimums" |
| H-04 | L08 | §32.2411 (Poles) NOT §32.2420 in vocabulary_introduced, LO-3, body | ✅ Header comment: "§32.2411 — NOT §32.2420"; vocabulary_introduced: `47 CFR §32.2411 (Poles)`; LO-1 states "§32.2411"; key_term definition explicitly contrasts §32.2420 |
| H-05 | L07 | FCA cross-reference; vocabulary_assumed `FCA implied certification → T04.L09` | ✅ vocabulary_assumed includes `FCA implied certification → T04.L09`; L07 body and quiz cover FCA §3729 exposure |
| H-06 | L01/L09 | Waiver by course of conduct — AIA A201-2017 §3.3.1; written objection preserves rights | ✅ L01 has full BranchingScenario on waiver-by-conduct; AIA A201 §3.3.1 cited; L09 also references waiver doctrine |
| H-07 | L03 | Visual sag check — step-by-step string-line method, midspan location, escalation | ✅ L03 body has Steps 1-4 (midspan identification, string-line setup, measure sag, compare to schedule); BranchingScenario includes sag check scenario; quiz Q covers string-line method |
| H-08 | L06 | BranchingScenario — verification step BEFORE decision tree | ✅ `cableVerificationScenario` starts with "verify before accepting"; correct_verify node has three-step verification before acceptance/rejection decision |
| H-09 | L04 | Clamp-on ground resistance HOW — IEEE 81-2012 §7 WorkedExample with 5 steps | ✅ `groundResistanceWorked` WorkedExample with 5 steps: loop check, EM interference check, clamp placement, read/record, borderline handling |
| H-10 | L10 | Capstone covers L05 (slack) and L09 (contractor dispute) | ✅ Capstone question c08 covers L05 slack location register; question c09/c10 L06; questions c16-c17 cover L09 DSC + prior-inspector scenarios; L09 retainage-release scenario at c20 |
| H-11 | L01 | Inspector-arrival daily workflow (6-step) | ✅ `dailyWorkflowSteps` array with 6 steps; TimelineSequence interactive; full prose description |
| H-12 | L03 | Pre-climb structural go/no-go decision tree | ✅ `preclimbScenario` BranchingScenario; vocabulary_introduced: `pre-climb structural assessment`, `go/no-go decision (pole condition)`; NESC Rule 261 condemnation cited |
| H-13 | L04 | Confined-space cross-reference; vocabulary_assumed `confined space, atmospheric testing, attendant → T18.L03` | ✅ vocabulary_assumed present; `vaultEntryScenario` BranchingScenario with explicit stop-work + atmospheric test requirement; 29 CFR 1910.268(o) cited |
| H-14 | L02 | Pre-construction conference checklist per RUS Form 515 §3(a) | ✅ L02 has Sortable interactive with 7 pre-construction conference items; vocabulary_introduced `pre-construction acceptance baseline` + `acceptance criteria document` |
| H-15 | L02 | Three FHWA inspection cadence models (continuous/milestone/sampling) | ✅ vocabulary_introduced `inspection cadence`; key_term defines all three models; LO-3 references cadence choice |
| H-16 | L01 + L11 | RUS Form 565 referenced in L01; new L11 created | ✅ L01 explicitly references Form 565; L11 created with full vocabulary_introduced for 8 terms including RUS Form 565 |
| H-17 | L07 + L11 | Form 553a parallel close-out; Form 7d advance chain taught in L11 | ✅ L07 vocabulary_assumed includes `RUS Form 553a → T13.L11`; L11 introduces both forms with key_term definitions; L07 quiz Q4 covers Form 553a parallel submission |
| H-18 | L12 | Davis-Bacon Act new lesson (WH-347, prevailing wage, worker classification) | ✅ L12 created; Davis-Bacon Act vocabulary_introduced; 40 USC §3142 cited; WH-347 weekly collection taught; capstone c22 covers misclassification scenario |
| H-19 | L07 | OTDR archive verification checklist (bidirectional, SOR, launch subtracted, delivered to owner) | ✅ vocabulary_introduced `OTDR archive verification checklist`; key_term definition with 5 required elements; quiz Q2 covers SOR format; checklist table in L07 body |
| H-20 | L04 | GPS accuracy verification ASCE 38-22 Quality Levels | ✅ LO-4 references ASCE 38-22 QL verification; quiz Q covers QL-D through QL-A definitions; L04 body section on GPS accuracy |
| H-21 | L07 | OTDR calibration (GR-196-CORE §5.5 annual) | ✅ L07 quiz Q1 explicitly references Telcordia GR-196-CORE §5.5; "SHALL witness" mandatory language per 7 CFR §1755.400(b) used |
| H-22 | L07 | OLTS calibration (TIA-526-7 §8) | ✅ L07 body mentions OLTS calibration per TIA-526-7 §8; reference measurement at session start taught |
| H-23 | L04 + L07 | NEC §250.56 (not §250.53) for 25Ω threshold | ✅ L04 LO-5: "Identify the correct NEC section (§250.56, not §250.53)"; WorkedExample cites §250.56; quiz Q1 explicitly teaches §250.56 vs §250.53 distinction. L07 vocabulary_assumed: `ground resistance threshold (25Ω, NEC §250.56) → T14.L06`. No §250.53 misuse found in any lesson. |
| H-24 | L04 | `proctor density` removed from vocabulary_introduced; vocabulary_assumed → T10.L08 | ✅ vocabulary_assumed has `proctor density → T10.L08`; L04 key_term for `ASTM D1557 Modified Proctor` explicitly notes "This term was introduced in T10.L08. In T13, we verify…" |

**24/24 HIGH findings VERIFIED as applied.**

---

## Section 3: Selected MED Findings Check

| ID | Verified |
|----|---------|
| M-01 | ✅ L04 key_term for `ASTM D1557 Modified Proctor` uses `cover card` to mean physical depth-verification tool; vocabulary_assumed includes `cover card → T10.L04` |
| M-04 | ✅ L04 BranchingScenario vaultEntryScenario handles stop-work correctly; depth-deviation scenario does not offer "accept with note" for permit-required depths |
| M-05 | ✅ L01 advanced section: "Inspector's personal field notebook is discoverable evidence. Under FRCP Rule 34..." |
| M-06 | ✅ L03 BranchingScenario includes drip_check node with explicit "minimum 6-inch arc below weather head" criterion |
| M-08 | ✅ L05 quiz Q2: "Coil count × estimated per-wrap length, GPS coordinates of the storage location, structure type" |
| M-09 | ✅ L01 vocabulary_introduced: `inspection segment`; key_term defines segment in OSP context with kick-back ≥3 rule |
| M-10 | ✅ L04 clamp-on WorkedExample note: "for bond strap resistance measurements ≤0.1Ω, the clamp-on DMM approach is inadequate — a 4-wire Kelvin (DLRO) measurement is required" |
| M-12 | ✅ L06 BranchingScenario uses `cableVerificationScenario`; dispute resolution in L09 BranchingScenario (contractor disputes finding on-site) |
| M-13 | ✅ L02 LO-3 is "Choose the appropriate inspection cadence…" — not the "demonstrate field technique" language that mismatched |
| M-14 | ✅ L03 LO says "State the THREE aerial deficiency types" — matches BranchingScenario's sag + drip loop + lashing pitch |
| M-17 | ✅ L03 WorkedExample Step 3: "using a non-conductive fiberglass measuring rod (NEVER a metal tape near energized conductors per 29 CFR 1910.268(b)(20))" |
| M-18 | ✅ L04 quiz Q2 explicitly tests that active 811 locate ticket must be confirmed before probing |
| M-20 | ✅ L09 vocabulary_introduced: `DSC (differing-site conditions) protocol`; key_term explicitly states "Inspector CANNOT verbally approve spec deviations — only the EOR can approve in writing" |
| M-21 | ✅ L09 vocabulary_introduced `retainage release milestone`; key_term covers AIA A201-2017 §9.8 substantial vs final completion |
| M-22 | ✅ L09 vocabulary_introduced `re-inspection cost allocation`; key_term covers cost allocation rule |
| M-23 | ✅ L12 covers NEPA conditions of approval; vocabulary_assumed in L09: `NEPA → T09` |
| M-24 | ✅ L07 vocabulary_assumed: `2 CFR §200.334 records retention → T13.L12`; L12 introduces the term |
| M-25 | ✅ L05 quiz Q3 tests GPS coordinates + access info required for slack location register |
| M-26 | ✅ L06 vocabulary_introduced `lot/batch number verification`; three-way match procedure taught |

---

## Section 4: Teaching Order and DAG Consistency

**Teaching order in meta.order fields:**
- L01: order 1  
- L11: order 2  
- L12: order 3  
- L02: order 4  
- L03: order 5  
- L04: order 6  
- L05: order 7  
- L06: order 8  
- L07: order 9  
- L08: order 10  
- L09: order 11  
- L10: order 12  

**Matches canonical specified teaching order:** ✅  
`L01 → L11 → L12 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10`  
Index.js comment confirms this order. ✅

**Critical forward-reference check (L07 assumes L11/L12 vocabulary):**
- L07 vocabulary_assumed includes `RUS Form 553a → T13.L11` and `2 CFR §200.334 records retention → T13.L12` — both correct since L11 (order 2) and L12 (order 3) precede L07 (order 9). ✅
- L02 vocabulary_assumed includes `RUS Form 565 (Inspector's Daily Report) → T13.L11` — L11 (order 2) precedes L02 (order 4). ✅

**L04 prerequisite includes T18.L03 (confined space):** `prerequisites: ['T13.L03', 'T18.L03']` ✅

---

## Section 5: H₂S IDLH Value Verification (cascade-defense per T18 precedent)

**L04 BranchingScenario (vault entry):** "H₂S at 100 ppm (the NIOSH IDLH) can cause rapid incapacitation"  
**L10 capstone quiz c07:** "H₂S IDLH = 100 ppm (NIOSH)"  
**Independent verification:** 100 ppm is the NIOSH IDLH for H₂S per NIOSH Pocket Guide (NPG ID NPGD0337). The T18 cascade bug (wrong value was 50 ppm, which is OSHA STEL ceiling) is NOT present here. Both L04 and L10 correctly state 100 ppm. ✅

---

## Section 6: NEC §250.56 Verification

**L04 WorkedExample:** "NEC §250.56 acceptance threshold of 25Ω" — correct.  
**L04 quiz Q1:** "NEC §250.56 specifies…the 25Ω maximum resistance for a single driven rod" — correct.  
**Web search confirmed:** NEC §250.56 = 25Ω threshold for single driven rod; §250.53 = installation method/depth. ✅

---

## Section 7: Citation Accuracy Finding — 7 CFR §1753.19 [Reserved]

**Finding severity: MED**  
**Affected lessons:** L01 (header comment), L11 (vocabulary_introduced: `7 CFR §1753.19 inspection obligation`, multiple body references, key_term definition cites §1753.19)

**Evidence:** Per eCFR (https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1753), section 7 CFR §1753.19-1753.20 is **[Reserved]** — the section contains no regulatory text. Web search confirmed via govregs.com: "7 CFR 1753.19-1753.20 — §[Reserved]".

The content attributed to §1753.19 ("competent resident inspection at all times") is correct as a RUS program requirement and consistent with RUS guidance documents and field practice. However, the specific CFR citation may be wrong. The actual current regulatory anchor for inspection requirements likely lives in 7 CFR §1753.17 (Engineering services), §1753.47 (Plans and specifications, subpart F), or in RUS construction bulletin/contract form language rather than a standalone §1753.19.

**Note:** This is a citation precision issue, not a content error. The "competent resident inspection" obligation is real and standard RUS program practice. Form 565 is a real form. The substance is correct — only the CFR section number attribution may be inaccurate.

**Recommended fix:** Add `[confirm section]` marker to all §1753.19 citations in L11 (key_term definition, vocabulary_introduced label, body text). The section header on L11 cites "7 CFR §1753.19" — should be changed to "7 CFR §1753 (verify current section)" or the correct current section identified. Until a primary-source lookup confirms the exact active section, the `[confirm section]` marker follows the canonical's own "if a standard's edition is in flux, mark it" rule.

**Cascade check:** L01 header comment cites §1753.19 and §1753.21. L01 body does NOT cite §1753.19 in prose that would face a learner. Only L11 has learner-visible §1753.19 citations in key_terms and quiz explanations.

---

## Section 8: MED Finding — §32.2411 Key Term Definition Has Internal Inconsistency

**Finding severity: LOW**  
**Lesson:** L08  
**Location:** `key_terms[0].definition` for `47 CFR §32.2411 (Poles)`

**Evidence:** The definition reads:
> "Do not confuse with §32.2410 (Cable and wire), **§32.2411 (Poles)**, or §32.2420 (parent 'Cable and wire facilities' umbrella)."

The phrase "Do not confuse with §32.2411 (Poles)" within the §32.2411 definition is circular self-reference — it tells the learner not to confuse this term with itself. The intended meaning is probably "Do not confuse §32.2411 (Poles) with §32.2410 (Cable and Wire) or §32.2420 (parent umbrella)." Minor editorial clarity issue.

---

## Section 9: LOW Finding — L10 Capstone Missing L11 Assessment

**Finding severity: LOW**  
**Lesson:** L10

The capstone prerequisites list includes `T13.L11` and `T13.L12` (correct), but scanning the capstone questions (c01–c25 reviewed): the capstone has dedicated questions for L01 (c01/c02), L02 (c03), L03 (c04/c05), L04 (c06/c07), L05 (c08), L06 (c09/c10), L07 (c11/c12), L08 (c13), L09 (c15/c16/c17/c20), L10 integration (c21), L12 (c22/c23). However, L11-specific content (Form 565 daily records procedures, loan advance suspension trigger, competent-resident-inspection multi-crew scenarios, Form 7d chain) does not appear as a standalone capstone question — it appears only as background context in c11 (Form 219 close-out). Form 7d and the advance chain from L11 are not assessed in the capstone independently.

**Impact:** A learner who does not retain L11's Form 565 cadence and loan-advance-chain content could pass the capstone without demonstrating that knowledge.

---

## Section 10: LOW Finding — L03 Sag Procedure Step-by-Step Depth

**Finding severity: LOW**  
**Lesson:** L03  
**Canonical requirement (H-07):** Step-by-step visual sag inspection procedure including escalation path.

L03 body has Steps 1–4 (midspan identification, string-line setup, measure, escalation note). The BranchingScenario aerialDeficiencyScenario teaches the under-sag vs over-sag distinction well. However, the escalation criterion ("what sag deviation triggers engineer notification vs. inspector-documents-and-moves-on") is not quantified — the text says "compare to engineered sag schedule" but does not specify the tolerance window at which escalation fires. Most sag schedules have ±1–2 inch tolerance; the lesson mentions "14±2 inches" in a BranchingScenario answer but this is within the scenario, not as a standalone escalation rule in the procedure steps. A learner may not know whether a 3-inch deviation requires engineer review or just a punch-list entry.

---

## Section 11: Saturation Hint for RT-β

**High-priority verification targets for RT-β (technical/math-derivation/field-practice-accuracy framing):**

1. **7 CFR §1753.19 [Reserved] — HIGHEST PRIORITY:** Independent primary-source lookup to identify the correct active CFR section for the "competent resident inspection" and Form 565 obligation. Search 7 CFR §1753.17 (engineering services), §1753.47 (plans/specs subpart F), §1753.48 (inspection procedures), and RUS Bulletin 1753F-401 directly. The §1753.19 [Reserved] finding needs a definitive tiebreaker before the lesson can be declared citation-clean.

2. **Form 553a existence and current form number:** Verify RUS Form 553a is an active form with the described content (Contractor's Certificate for final close-out). The RUS forms page lists Form 506, 515, 217, 219 — Form 553a should be confirmed independently.

3. **Telcordia GR-196-CORE §5.5 calibration interval:** Verify annual calibration is correct per GR-196-CORE (vs. some other interval). Also confirm the NIST-traceable reference verification requirement.

4. **§32.2411 in current eCFR Part 32:** Confirm Account 2411 = "Poles" per current 47 CFR Part 32 plant accounts. The DAG registry shows this was confirmed via T01 polish-3 (`d7161ad`), but an independent Part 32 lookup would reinforce.

5. **ASCE 38-22 QL-A definition:** Verify "potholing/physical exposure" = QL-A (not QL-B or QL-C) per the actual ASCE 38-22 standard. The authored definition in L04 quiz lists QL-D (records only) through QL-A (highest confidence — physical exposure), which matches standard descriptions but should be confirmed.

6. **L03 string-line sag tolerance:** What is the industry-standard tolerance window for a visual sag check before engineer escalation is required? The lesson omits this, and RT-β should assess whether the omission creates a teachable gap vs. a legitimate "project-specific" caveat.

7. **Davis-Bacon dollar-threshold claim in L12:** L12 states "no minimum dollar threshold for RUS loans." Verify this is correct — some federal programs have thresholds; confirm 40 USC §3142 + 29 CFR Part 5 explicitly covers RUS loans without threshold.

---

## Summary

**Verdict: YELLOW**

**Reason:** 24/24 HIGH canonical findings verified as applied. Vite build clean. Schema 12/12 pass. Flashcard coverage complete. Teaching order DAG-compliant. All critical citation fixes (§32.2411, §250.56, FCA, Form 553a) verified.

**One MED finding identified via independent gap research:**
- **NEW-MED-1 (§1753.19 [Reserved]):** The core regulatory citation for the "competent resident inspection" obligation and Form 565 requirement in L11 cites 7 CFR §1753.19, which eCFR confirms is [Reserved] (no active regulatory text). This is a citation accuracy issue that needs a primary-source tiebreaker before L11 can be declared citation-clean. The substantive content is correct RUS practice; only the section number citation is in question.

**Two LOW findings:**
- **NEW-LOW-1 (L08 key_term circular self-reference):** §32.2411 definition says "do not confuse with §32.2411" — internal typo in the prohibition list.
- **NEW-LOW-2 (L10 capstone gaps L11 content):** L11-specific material (Form 565 daily cadence, Form 7d advance chain, loan-advance-suspension trigger) is not assessed as a standalone capstone question.
- **NEW-LOW-3 (L03 sag escalation threshold unquantified):** Step-by-step procedure exists but escalation trigger (tolerance window for engineer notification) is not defined.

**RT-β priority:** §1753.19 citation tiebreaker (primary-source lookup to 7 CFR §1753.17/§1753.47/§1753.48 and RUS Bulletin 1753F-401). Also Form 553a existence verification, GR-196-CORE interval, ASCE 38-22 QL-A.

=== T13 RT-α PEDAGOGY REPORT END ===
