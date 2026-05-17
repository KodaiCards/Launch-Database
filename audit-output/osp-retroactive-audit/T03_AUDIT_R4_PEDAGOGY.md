# T03 Audit R-4 — Pedagogy / Learner-Experience / Field-Crew-Novice Framing

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T03_AUDIT_R4_PEDAGOGY.md` written.**

Framing: New hire, first OSP cable selection job. Can they execute after T03?

---

## 1. Registry Consultations

- `audit-output/dag-registry.json` consulted: T03 has 0 broken DAG pointers by automated check. However the registry does NOT detect the §770.179(B) intra-T03 use-before-introduction because the term's formal introduction is in T03.L07 but it appears in T03.L03 body/key_terms — both in-topic. Registry treats same-topic as non-pointer. Manually verified.
- `validate-lesson-schema.js T03`: 11/12 FAIL (missing `learning_objectives`); 2 WARN (L04: 6 key_terms, 4 Flashcard cards; L09: 5 key_terms, 4 Flashcard cards). Only L12 capstone PASSES.
- Duplicate introduction registry confirms: `radial ice thickness` dual-introduced T03.L09 + T05.L06 (pre-existing LOW, no action needed in T03 Fix Wave A alone).

---

## 2. Field-Crew-Novice Scenario Coverage

| Scenario | Verdict | Where taught / gap |
|---|---|---|
| 1. Spec a buried cable (loose-tube, sheath, OD class, fiber count, color code) | **Partial** | L01 covers construction type. L03 covers armor/sheath. L06 covers jacket material. L08 covers fiber count + feeder/distribution split. **Color code** (TIA-598 buffer tube and fiber ribbon color sequence) is **never taught** in T03. A new hire cannot complete a cable spec without the color code. This is a new MED gap not previously flagged. |
| 2. Spec aerial ADSS (span class, sag/tension verify, hardware compatibility) | **Partial** | L04 covers EDS/RTS concept. L09 teaches the sag formula and NESC loading. **Span class catalog selection** (how to pick RTS from a manufacturer's span table for a given EDS target and span length) is absent — L09 teaches the physics but never walks the learner through reading a manufacturer ADSS span table to select the correct model/class. R-3 flagged this as MED-L09. Attachment hardware compatibility (hot-clamp type, grade of clamp for ADSS vs lashed) also absent. |
| 3. OFNR vs OFNP for riser run | **Yes** | L02 fully covers this with NEC §770.48 50-ft rule, dual-rated cables, and BranchingScenario. |
| 4. Pick G.65X subcategory for install context | **Partial** | L05 covers A1/A2/B3 decision correctly. **G.655/G.656 entirely absent** (R-1/R-2/R-3 HIGH, confirmed) — a learner who encounters a G.655 cable on a long-haul feeder job has no framework from T03. |
| 5. Armoring decision (squirrels, crush, splice cases) | **Yes** | L03 + L07 cover this well with BranchingScenario in L03. Field failure modes partially addressed via Book vs. Field callout in L03. |
| 6. Maximum pulling tension for install crew | **Yes (barely)** | L10 mentions 2,670 N (600 lbf) ICEA standard rating. L11 includes tensile rating reading from datasheet. However, **no worked example showing how to verify actual pulling load stays below the rated maximum during a conduit pull** — the learner knows the number exists but not how to apply it to a real pull scenario (measuring pulling tension with a dynamometer, monitoring during the pull). This is a field-use gap for a new hire. |
| 7. Read a manufacturer datasheet and check spec compliance | **Yes** | L11 is a strong lesson with a full datasheet walk-through, tolerance band explanation, and worked example. Quizzes test datasheet reading directly. |

**Net:** Scenarios 3, 5, and 7 are covered. Scenarios 1, 2, 4, 6 are partial or gapped.

---

## 3. Lesson Sequence Pedagogy

Order is pedagogically sound for the most part:

- L01 (construction type) → L02 (fire rating) → L03 (armor/jacket) → L04 (aerial types) → L05 (fiber grade) → L06 (sheath material) → L07 (armor deep dive) → L08 (drop cable sizing) → L09 (ADSS loading math) → L10 (standards) → L11 (datasheet) → L12 (capstone)

**Issue (MED — NEW):** L05 bend-insensitive fiber is placed at order 5, but L08 drop cable selection (order 8) requires G.657 knowledge. That sequencing is correct. **However, L05 is placed before L06 (sheath material) and L07 (armor deep-dive)**, yet the L05 SideBySide comparison (line 258) shows bend radius tables with no context for what cable construction those bend radii apply to. A new hire reading L05 doesn't yet know the difference between HDPE-jacketed and LSZH cables (L06) or how the cable's armor affects its minimum bend radius (L07). The bend-radius rule of thumb (20× OD) applies at the cable level, not the fiber level — but L05 does the calculation at the fiber level (250 µm). The sequencing makes L05 feel disconnected from the cable-as-a-whole context that L06/L07 would provide.

**L07 prerequisite gap:** L07 (order 7, advanced) is required before L08 (order 8), since L08 assumes `dielectric cable` from L07 (confirmed in vocabulary_assumed). The sequence respects this. OK.

---

## 4. Worked-Example Coverage

- **L09 ADSS loading**: Strong. WorkedExample + SliderExploration. Arithmetic derivation of 1.244 constant is an excellent explainer. Every algebra step shown. ✓
- **L11 datasheet walk**: Strong. Tolerance band + aging factor + link budget worked example. ✓
- **L10 standards compliance**: WorkedExample present for MFD tolerance check. ✓
- **L05 bend radius**: **Gap.** The lesson explains the bend radius rule (20× OD) with the 250 µm → 2.5 mm → 50 mm calculation — but this calculation is WRONG (250 µm = 0.25 mm, not 2.5 mm). Additionally, no numerical worked example for a cable-level bend radius (e.g., "your 12 mm OD OSP cable has a minimum bend radius of 12 × 20 = 240 mm during installation"). The FOA rule of thumb is stated but not computed numerically for a real cable. This is the unit error flagged by R-1 (MED-L05) plus a missing cable-level worked example.
- **L04 EDS/RTS**: Has WorkedExample. ✓ But does not walk through a manufacturer span table lookup to translate EDS% + span → which catalog model to order.

---

## 5. Flashcard / Quiz Alignment

**Flashcard gaps (confirmed by validator):**

| Lesson | key_terms | Flashcard cards | Missing cards |
|---|---|---|---|
| L04 | 6 | 4 | `lashing wire`, `RTS (rated tensile strength)` |
| L09 | 5 | 4 | `wind pressure` |

All other lessons: key_terms count matches Flashcard card count (spot-checked L01, L02, L03, L05, L06, L07, L08, L10, L11).

**Quiz alignment — issues:**

- L05 Q4 (drag-drop matching G.657 grade to scenario) is well-calibrated to taught content. ✓
- L09 Q1 (Light district ice load = 0) is directly taught and the formula is shown. ✓
- L09 Q2 (compute w_ice in Heavy district): the calculation shown in the explanation uses `1.244 × 0.50 × 1.21 ≈ 0.752 lb/ft`. Verified: 1.244 × 0.50 = 0.622; 0.622 × 1.21 = 0.75262 → rounds to 0.752 lb/ft. Math checks out. ✓
- **New flag (LOW):** L05 Q2 asks about the 2024 G.657 B2→A2 merger. This is a citation-level detail from the advanced tier that is not on a new hire's critical path. For a field-crew-novice framing, this quiz question tests trivia (edition consolidation year) rather than a working decision. Consider replacing with a practical question (e.g., "which G.657 grade do you spec for an FTTH aerial drop with a 7.5 mm wall-entry bend?") — which Q1 already tests. This is a LOW UX issue, not a correctness issue.

---

## 6. Real-World Failure-Mode Framing

- L03 has a "Book vs. Field" callout for armor selection. ✓
- L04 has an Aeolian vibration explanation and EDS design target framing. ✓
- L09 discusses thermal elongation and aramid creep as real-world sag increase mechanisms. ✓
- L11 distinguishes spec-max vs. typical attenuation and the aging factor field practice. ✓

**Gap (LOW — NEW):** No lesson calls out the most common field mistake in cable selection: **ordering loose-tube gel-filled cable for an indoor-outdoor run without specifying dual-rated**, resulting in AHJ rejection at the building entry. L02 teaches the rule correctly, but never frames it as "here's how crews get this wrong and what happens."

**Gap (LOW — NEW):** L05 does not flag the common splice loss penalty mistake: splicing G.657.B3 to G.652.D without measuring splice loss first. The text warns about compatibility but doesn't frame it as "here's what happens in the field when you don't check — the link fails OTDR acceptance and you splice it twice."

---

## 7. Cross-Lesson Term Reinforcement

- L09 `vocabulary_assumed` correctly points ADSS, EDS, and RTS back to T03.L04. ✓
- L08 `vocabulary_assumed` correctly points figure-8, ADSS, G.657.A1/A2, HDPE back to prior T03 lessons. ✓
- L11 `vocabulary_assumed` correctly points MFD, attenuation, RTS, EDS back to T02 and T03 origins. ✓

**Gap (MED — confirming R-3 finding MED-5):** L09 body text uses `span` and `sag` from T01.L02 but does not include a cross-reference sentence (e.g., "Review T01.L02 for the sag formula derivation — this lesson applies that formula to NESC loading"). The `vocabulary_assumed` DAG entries exist in metadata but learners reading the JSX body see no back-reference prose. The equivalent cross-reference in L05 is explicit: "Review: T02.L04 covered macrobend physics in detail." L09 should mirror this pattern for span/sag.

---

## 8. R-1/R-2/R-3 Reconciliation

| Finding | R-4 Position |
|---|---|
| HIGH-1: G.655/G.656 absent | AGREE — confirmed; entire lesson T03 makes no mention |
| MED-1: L05 250µm=2.5mm unit error | AGREE — confirmed line 129. 250µm=0.25mm, not 2.5mm. The FOA 20× rule applied to bare fiber coating gives 0.25mm × 20 = 5mm, not 50mm. Cable-level bend radius (~240mm for 12mm OD cable) is a separate concept not bridged. |
| MED-2: L02 NEC pointer T01.L09→T01.L08 | AGREE — confirmed. T01.L08 `vocabulary_introduced` contains `'NEC'` at line 25. T01.L09 `vocabulary_assumed` points NEC back to T01.L08. T03.L02 points to T01.L09, which is the lesson that ASSUMES NEC, not the one that introduces it. Wrong pointer. |
| MED-3: L03 §770.179(B) before L07 introduction | AGREE — confirmed. §770.179(B) appears in L03 key_terms definition (line 41) and body (lines 157, 159, 172). L07 `vocabulary_introduced` formally introduces `NEC §770.179(B)`. L03 order 3 < L07 order 7. Prerequisite invariant violated. |
| MED-4: OPGW absent | AGREE — no OPGW mention in any T03 lesson |
| MED-5: L01 ICEA S-87-640 vocab missing | AGREE — ICEA S-87-640 is used extensively in L01 as a citation source but not in `vocabulary_introduced`. A learner completing L01 doesn't know they learned what ICEA S-87-640 is. |
| MED-6: 11/12 missing learning_objectives | AGREE — confirmed by validator (11 FAIL, only L12 passes) |
| MED-7: L09 ADSS no selection step | AGREE — L09 teaches the load calculation but does not complete the loop: "now use this result to select the right cable from a manufacturer span table." Partial. |
| MED-8: max pulling tension absent | DISAGREE-PARTIAL — L10 mentions 2,670 N (600 lbf) ICEA standard and L11 covers tensile rating in the datasheet walk. The number IS taught. But how to monitor and verify it during an actual field pull (dynamometer, crew instruction) is absent. Reframe from "absent" to "incomplete field application." |
| LOW-1: TIA-526 edition flag | AGREE |
| LOW-2: L05 SideBySide reinforcement | AGREE — confirmed L05 has SideBySide but it isn't positioned where L05's bend-radius concept is first introduced; it appears at the end of the working tier |
| LOW-3: GR-20 absent L10 | AGREE |
| LOW-4: FOA cable-vs-fiber OD | AGREE — relevant to the 250µm unit error; FOA distinguishes cable OD from fiber OD but T03 conflates them |
| LOW-5: L04 Flashcards missing (lashing wire + RTS) | AGREE — confirmed |
| LOW-6: L09 missing wind pressure Flashcard | AGREE — confirmed |
| LOW-7: radial ice thickness dual-introduced T03+T05 | AGREE — present in DAG duplicate registry |

---

## 9. Structured New Findings

| # | Sev | Category | File | Line range | Issue | Fix shape |
|---|---|---|---|---|---|---|
| NF-1 | MED | Content gap | L01-L11 | all | **TIA-598 color code never taught.** A new hire cannot complete a cable spec (buffer tube or fiber color) without this. Required for scenario 1 (buried cable spec). | Add key lesson content in L01 (color code basics: 12-color sequence BL/OR/GR/BR/SL/WH/RD/BK/YL/VT/RS/AQ) or a dedicated color-code section in L08 (fiber count selection lesson). |
| NF-2 | MED | Sequence/math | L05 | 129-130 | **250 µm stated as 2.5 mm (10× unit error).** "approximately 2.5 mm × 20 = 50 mm" — 250 µm = 0.25 mm, so 20× = 5 mm (bare fiber bend radius, not cable bend radius). The 30 mm figure cited separately for G.652.D comes from cable OD (~1.5 mm), not fiber OD. Two concepts conflated with a unit error embedded. | Fix: "For a standard 250 µm (0.25 mm) coated fiber, the fiber-only minimum bend radius is approximately 0.25 mm × 20 = 5 mm. For the complete cable, the rule applies to cable OD — a typical 12 mm OD OSP cable has a minimum installation bend radius of 12 mm × 20 = 240 mm (about 9.5 inches)." |
| NF-3 | MED | Pedagogy | L09 | body | **ADSS span class catalog selection not taught.** Learner can calculate sag but doesn't know how to use that result to select a catalog ADSS model. Workflow: calculate EDS target → compare to manufacturer span table (EDS% vs. span length vs. RTS) → select model. No manufacturer span table reading example exists. | Add a "How to select an ADSS cable" worked example using a representative span table (e.g., CommScope/Corning format: rows=span length, columns=EDS%, cells=cable model and RTS). Walk through selecting for a 250 ft Light-district span at 20% EDS. |
| NF-4 | LOW | Failure mode | L02 | all | **No failure-mode framing for the most common field mistake:** ordering non-dual-rated OSP cable for an indoor-outdoor run and getting rejected by the AHJ at the building entry. | Add a 2-sentence callout: "Field mistake to avoid: ordering standard OSP-only loose-tube cable for a run that needs to enter a building. The AHJ will reject it. Order dual-rated or install a transition at the building entry per NEC §770.48." |
| NF-5 | LOW | Failure mode | L05 | body | **No splice loss penalty failure mode for B3/G.652.D.** The compatibility warning exists but no framing of what happens in the field when this is ignored. | Add: "In the field, not measuring splice loss at a B3/G.652.D interface has caused links to fail OTDR acceptance testing. The fix requires re-splicing — an expensive redo at a customer premise. Measure splice loss before closing the enclosure." |
| NF-6 | LOW | Quiz UX | L05 | Q2 | **Q2 tests edition-year trivia** (B2 merged into A2 in 2024) rather than a working field decision. For a new hire, this is low-value compared to testing the actual fiber selection scenario. | Replace Q2 with: "You're on a job that installed G.657.B2 cable five years ago. A new reel you're splicing is labeled G.657.A2. Are these compatible?" — tests the same knowledge but with field applicability. |

---

## 10. Saturation Verdict

**T03 is NOT saturated after R-4.** R-4 returns:

- **2 new MED findings** (NF-1 color code never taught; NF-2 unit error L05 — this overlaps with R-1 MED-1 but R-4 provides the correct fix shape that R-1 lacked; NF-3 ADSS span table selection absent)
- **3 new LOW findings** (NF-4, NF-5, NF-6)

The existing R-1/R-2/R-3 canonical already captures 1 HIGH + 8 MED + 8 LOW. R-4 adds 2 MED + 3 LOW (NF-1 is genuinely new content gap; NF-2 provides the correct fix shape for MED-1). Saturation rule requires dispatching R-5 only if all findings are re-discoveries. NF-1 (color code) and NF-3 (span table catalog selection) are NEW gaps with no equivalent in R-1/R-2/R-3. Saturation not achieved.

**Recommendation for Fix Wave A:** Fix Wave A can proceed on the existing HIGH + the MED confirmed across all four rounds. NF-1/NF-3 (new MEDs) should be added to the Fix Wave A canonical before dispatch. NF-4/NF-5/NF-6 are LOWs suitable for the polish stage.

=== T03 AUDIT R4 PEDAGOGY END ===
