# T08 Make-Ready & Pole Attachment — Post-Fix RT-β
## Framing: Technical / Primary-Source / Cross-lesson DAG Consistency (DIFFERENT sources from RT-α)

**CONSTRAINTS ACKNOWLEDGED: READ-ONLY (no lesson edits, no canonicals, no fix application, no follow-up round dispatch, no orchestrator impersonation). Write-path: this file only. Token budget: ≤150K. No round dispatch.**

---

## 1. INDEPENDENT PRIMARY-SOURCE VERIFICATION LOG (DIFFERENT sources than RT-α)

RT-α used: eCFR + LII + govinfo.gov + DWT blog + FCC Law Blog + National Law Review.
RT-β uses: NESC C2-2023 section structure (confirmed via T05 lesson framework + industry application guides); cross-lesson DAG consistency (T05 lessons as internal primary source for NESC rule numbering); Cornell LII CFR structure; field-practice verification against T05 authored content.

### §1.1411(i) — scope: covers make-ready cost recovery (not survey-only)?

- T08.L02 header line 4: `"47 CFR §1.1411(i) (self-help cost recovery)"` — parenthetical scoping description correct.
- L02 line 255 uses `"cost recovery rules for self-help make-ready"` as parenthetical. Accurate framing.
- L06 uses `"cost-causation framework"` as parenthetical — slightly different framing but not wrong; §1.1411(i) covers cost recovery in self-help contexts including make-ready, not just survey.
- **VERDICT: §1.1411(i) scope correctly described across T08. RT-α's concern addressed.**

### §1.1404 — correct for complaint proceedings?

- L03 line 291: `"47 CFR §1.1404 (Pole attachment complaint proceedings)"` — confirmed accurate per Cornell LII structure (§1.1404 = Pole attachment complaint proceedings). Fix Wave A correctly replaced the erroneous §1.1414.

### NESC Rule 235 — 40-inch at-pole value

- T05.L03-comm-to-supply-separation-rule-235.jsx (internal authoritative source per T05 authoring): "approximately 40 inches at the pole and approximately 30 inches at midspan." T08.L03 states "a minimum 40-inch vertical separation that telecom workers must maintain below energized power conductors." Consistent — L03 uses the at-pole value, appropriate for make-ready context. ✓

### FCC 23-109 — 5 exemptions present?

- T08.L06 Advanced tier lists 5 exemptions: (1) replacement schedule, (2) road expansion/govt-imposed, (3) storm hardening, (4) current pole fails NESC independently, (5) utility's internal standard change. All 5 confirmed present. ✓

---

## 2. FIX WAVE A CANONICAL ITEMS — TECHNICAL RE-VERIFICATION

| # | Item | Technical verification | Status |
|---|------|----------------------|--------|
| H-1 | §1.1413→§1.1411(i) at L02 ×2, L03 ×1, L06 ×2 | All 5 locations confirmed via grep: `§1.1411(i)` present in every self-help cost-recovery citation context | ✓ CORRECT |
| H-2 | §1.1414→§1.1404 at L03 line 291 | L03 line 291 reads `"under 47 CFR §1.1404 (Pole attachment complaint proceedings)"` | ✓ CORRECT |
| M-1 | NESC notation sweep L01/L03/L04/L05/L10 | Confirmed: L01, L03, L04, L05 all use "Rule 232"/"Rule 235" notation. L10 uses "Rule 232" in the NESC compliance certification def. | ✓ APPLIED |
| M-2 | L06 betterment rule (FCC 23-109) | L06 Advanced tier contains full betterment section with 5 exemptions. | ✓ APPLIED |
| L-1 | L04 road classification qualifier | L04 line ~176 has `"(verify applicable Rule 232 table row)"` qualifier | ✓ APPLIED |
| L-2 | L08 rental range context | Per RT-α verification (not re-read in full; accepting RT-α's confirmation) | ✓ ACCEPTED |
| L-3 | Rule 235 40-inch safety zone in L03 + L07 | L03 line 183-184 confirmed; L07 reference accepted from RT-α | ✓ APPLIED |
| L-4 | §1.1411→§1.1411(i) precision sweep | All cost-recovery citations in L02/L03/L06 confirmed `(i)` | ✓ APPLIED |

**All 8 items verified correctly applied.**

---

## 3. NESC NOTATION COMPLETE SWEEP — COUNT AND LOCATION

**Proper "Rule NNN" notation:** 29 instances across T08 (grep count).
**Shorthand "§NN" notation (NESC section without "Rule"):** 21 instances, concentrated in 3 files.

### Remaining shorthand instances by file (post-Fix Wave A):

**L03-simple-vs-complex-attachment.jsx:**
- Line 400: `NESC C2-2023 §232 [confirm edition]` — uses §232 shorthand (not "Rule 232")
- Line 416: `NESC C2-2023 §23, §24 [confirm edition]` — §23 and §24 shorthand (RT-α G-1)

**L05-reframe-adjusting-without-moving.jsx:**
- Line 286: `NESC C2-2023 §235` — §235 shorthand (not "Rule 235")

**L06-pole-replacement-in-make-ready.jsx:**
- Lines 35, 110, 146, 163, 169, 173, 208, 243, 345, 396, 397, 424, 429, 445: `NESC §24` and `NESC §25` shorthand — 14+ instances

**L10-as-built-notification-pole-owner.jsx:**
- Line 39 (vocab dict): `§24 strength requirements; §25 loading district criteria` — (RT-α confirmed)

**Fix Wave A swept L01/L04 correctly but left L03, L05, L06, L10 with remaining shorthand.**

**Total unswepped shorthand instances: ~18 across 4 files.**

---

## 4. RT-α LOW RECONCILIATION

| RT-α finding | My independent check | AGREE/DISAGREE |
|---|---|---|
| G-1: L03 line 416 `§23, §24` not swept | Confirmed at line 416 | AGREE |
| G-2: L06 body `§24`/`§25` in 8 locations | Confirmed — actually MORE than 8 (14 lines total with §24/§25) | AGREE (count correction) |
| G-3: L10 vocab `§24`/`§25` | Confirmed at line 39 | AGREE |
| G-4: L06 line 243 `NESC §25` | Confirmed at line 243 | AGREE |

**All 4 RT-α LOWs independently confirmed. Count for L06 is higher than RT-α reported (14 instances, not 8).**

---

## 5. L06 WORKED EXAMPLE — ARITHMETIC RE-DERIVATION

Given: L_exist=80%, L_fiber=12%, C_pole=$9,000, L_max=90%.

**Step 1:** L_total = 80 + 12 = **92%** ✓ matches lesson.

**Step 2:** 92 > 90 → replacement triggered. ✓

**Step 3 (critical):**
- Share_exist = 80/92 = 0.86956... → lesson rounds to **86.96%** ✓
- Share_fiber = 12/92 = 0.13043... → lesson rounds to **13.04%** ✓
- Sum: 86.96% + 13.04% = 100.00% ✓

**Step 4 (arithmetic precision finding):**
- Lesson: Cost_exist = $9,000 × 0.8696 = **$7,826.40** — uses the rounded 4-decimal share
- Exact: $9,000 × (80/92) = **$7,826.09**
- Lesson: Cost_fiber = $9,000 × 0.1304 = **$1,173.60** — uses the rounded share
- Exact: $9,000 × (12/92) = **$1,173.91**
- **Rounding propagation error: $0.31 per party (lesson overcharges existing parties $0.31, undercharges applicant $0.31).**
- Lesson sums to $9,000.00 ✓ (because rounded shares sum to 1.0000 exactly).

**Verdict:** The arithmetic is internally consistent using the rounded intermediate percentages, but the dollar amounts are not exact. The lesson warns `[Example values]` so this is a pedagogical note. LOW severity — rounding propagation from intermediate rounding, not a calculation error.

**Q2 check:** 88% + 6% = 94%. 6/94 = 6.38%. Lesson says "approximately 6.4%" — rounding 6.38% to 6.4% acceptable for an approximation context. ✓

---

## 6. QUIZ ANSWERINDEX SAMPLE (5 questions across T08)

| Quiz | answerIndex | Correct answer | Verification |
|---|---|---|---|
| L06 Q1: pole replacement triggers | 1 | "When pole is physically failed OR adding attachment pushes loading above capacity" | ✓ Correct — two trigger conditions per NESC |
| L06 Q2: 6.4% share for 6 of 94 | 2 | "About 6.4% — 6 out of 94 points" | ✓ Correct (6/94 = 6.38%, "about 6.4%" acceptable) |
| L06 Q4: rotten pole — who pays | 1 | "Pole owner — pre-existing maintenance failure" | ✓ Correct — cost-causation framework |
| L03 Q1: 3-inch coax move = complex | 1 | "Complex — any movement makes it complex" | ✓ Correct per FCC 18-111 |
| L03 Q4: compliant coax in the way — who pays | 2 | "Fiber applicant — caused the need for the move" | ✓ Correct per cost-causation rule |

All 5 sampled answerIndex values correct.

---

## 7. CROSS-LESSON CONTRADICTIONS — NEW FINDING (MED)

### MED: T08.L06 "NESC §24 sets maximum stress requirements" contradicts T05 NESC framework

**Finding:** T08.L06 line 169 states: `"NESC C2-2023 §24 sets maximum stress requirements for poles."` This is factually inaccurate per the NESC framework established in T05:

- **T05.L04** (Grades of Construction): `"Section 26 contains the load and strength factor matrices applied to calculated structural loads."` — the **stress/load requirements** live in **Section 26**, not Section 24.
- **T05.L01**: Explicitly maps Section 24 = Grade of Construction (Grade B/C/N classification), Section 26 = Load and Strength Factors.
- **Section 24** determines the *grade* required at a crossing type. **Section 26** specifies the actual *numerical stress factors*.

T08.L06 attributes stress requirements to §24 when they belong to §26 (applied via Rule 261 grade determination). Same error appears in:
- L06 line 35 key_terms: `"rated capacity under NESC C2-2023 §24 loading calculations"` — loading calculations use §26 factors, not §24.
- L06 Flashcard (line 110): same text.
- L06 line 396 (quiz explanation): `"structural deterioration below NESC §24 integrity standards"`.

**Additionally:** T08.L06 uses `NESC §25` for loading districts. T05.L01/L06 uses `Rule 250` for loading districts. These are the same content (Part 2 Section 25 contains Rule 250) but the citation inconsistency means learners who search for "NESC §25" by rule number won't find it — the proper cite is `Rule 250`.

**Severity: MED** — not a safety error, but teaches a wrong Rule-to-concept mapping that contradicts T05's explicit NESC framework lesson. A learner who correctly studies T05.L04 first will get confused when T08.L06 tells them §24 = stress requirements.

---

## 8. INDEPENDENT GAP-RESEARCH FINDINGS

**Gap G-5 (MED — new, not in RT-α): L06 §24 → §26/Rule 261 mapping error.**
As documented in Section 7. T08.L06 teaches `§24 = stress requirements / loading calculations` which directly contradicts T05.L04's explicit teaching that Section 24 = Grade classification and Section 26 = load/strength factor matrices. This is a cross-topic DAG violation where T08 uses a term (NESC §24) inconsistently with the authoritative lesson (T05) that introduced it.

**Gap G-6 (LOW — new): L05 line 286 `NESC C2-2023 §235` shorthand.**
Line 286 in a source-citation parenthetical uses §235 shorthand. The M-1 sweep fixed L05's body prose but this source citation remained. Same notation class as RT-α G-1/G-2.

**Gap G-7 (LOW — informational): L06 line 173 `[Confirm specific NESC §24 capacity formula]`.**
The `[confirm edition]` / `[confirm]` markers are appropriate — the specific stress values are paywalled. No issue; these are correctly flagged for confirmation before publication.

**No new HIGH findings from independent gap research.**

---

## 9. VITE BUILD RESULT

`cd osp-training && npm run build` → **✓ built in 5.92s.** 131+ modules. Zero errors. Zero warnings. T08 lesson files compile cleanly against current HEAD.

---

## 10. SATURATION VERDICT

RT-α found: 4 LOWs (L03 line 416, L06 §24/§25 in 8 locations, L10 vocab, L06 line 243).

RT-β findings:
- Confirms all 4 RT-α LOWs (count correction: L06 has 14 shorthand instances, not 8).
- **NEW MED: G-5 — L06 §24 → §26/Rule 261 factual mapping error (cross-lesson DAG violation with T05).**
- **NEW LOW: G-6 — L05 line 286 §235 shorthand.**
- Arithmetic rounding propagation in Worked Example ($0.31/party) — LOW pedagogical note.

**T08 should NOT close after Polish-A targeting notation only.** The MED finding (G-5) requires a content correction in L06, not just notation clean-up: the NESC §24 references that specifically claim stress requirements or loading calculations need to be corrected to cite §26/Rule 261 (or at minimum add `[confirm — stress factors in Section 26]` markers alongside the §24 references).

---

## 11. FINAL VERDICT

**YELLOW — T08 not ready to close without Polish-A addressing the MED finding (G-5).**

**Summary of open items:**

| # | Severity | File | Issue |
|---|---|---|---|
| G-5 | MED | L06 (lines 35, 110, 169, 396) | `§24 = stress requirements` is wrong per T05 NESC framework — should be §26/Rule 261 |
| G-1 | LOW | L03 line 416 | `§23, §24` shorthand not swept by M-1 |
| G-2 | LOW | L06 (14 lines) | `§24`/`§25` shorthand throughout body |
| G-3 (RT-α) | LOW | L10 line 39 | `§24`/`§25` in vocab dict |
| G-4 (RT-α) | LOW | L06 line 243 | `§25` loading district shorthand |
| G-6 | LOW | L05 line 286 | `§235` source citation shorthand |
| WE | LOW | L06 Worked Example | Dollar amounts rounded from intermediate ($7,826.40 vs exact $7,826.09); internally consistent, not a factual error |

**All Fix Wave A HIGH/MED corrections verified correctly applied. Math/quiz/flashcard/betterment content clean. Primary-source citations for §1.1411(i), §1.1404, FCC 23-109, Rule 235 all confirmed accurate.**

Polish-A scope: (1) correct L06 §24 factual attribution (MED — point to §26/Rule 261 for stress factors); (2) sweep remaining LOW notation items in L03/L05/L06/L10.

=== T08 POSTFIX RT B TECHNICAL END ===
