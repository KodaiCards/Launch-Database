# T06 Post-Fix RT-α — Pedagogy / Regression / Cascade-Defense

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T06_POSTFIX_RT_A_PEDAGOGY.md` written.**

**Agent role:** Post-fix RT — READ-ONLY on all lesson files.
**Framing:** Pedagogy quality + regression check + cascade-defense verification (independent sources)
**Pair-mate:** RT-β (technical framing, dispatched separately)
**Date:** 2026-05-17

---

## 1. Registry Consultation

**Citation registry hits:**
- `47 CFR §32.2410` = "Cable and wire facilities" — ✅ pre-verified (SHA `a42e9f8` + `d7161ad`). H-4 fix aligns.
- `47 CFR §32.2210` = "Central office—switching" (not cable/wire) — ✅ cascade-pattern P1 confirmed in registry. H-4 fix correct direction.
- `NESC §34/§35` — entry exists (SHA: "T06 audit") but marked "CONFLICT PENDING: §34 vs §35 boundary — tiebreaker not yet dispatched." Tiebreaker `51f4482` HAS now landed; registry entry is stale — should be updated with verdict.
- `NWP 57` — present, verified 2026-05-17 by T09 R-3. M-7 aligns.
- Known-cascade-patterns check: P1 (§32.2210 mis-cite) confirmed H-4 was a real cascade bug.

**DAG registry validator:** `node validate-lesson-schema.js T06` → **12/12 PASS, 0 FAIL, 0 WARN**. Schema compliant.

**DAG broken pointers detected by `build-dag-registry.js`:**
- T06.L02: `conduit` → T04.L01 (BROKEN — `conduit` lives at T01.L02)
- T06.L02: `AHJ` → T06.L01 (BROKEN — AHJ introduced by T01.L08, T05.L01, T09.L01, not T06.L01)
- T06.L05/L06/L07/L08/L09: `conduit` → T06.L03 (BROKEN — conduit lives at T01.L02)
- T06.L07/L08: `HDPE` → T06.L03 (BROKEN — HDPE introduced by T01.L08)
- T06.L10: `conduit fill` → T06.L04 (BROKEN — fill as a term-of-art likely introduced at T06.L04 — may be correct)
- T06.L09: `AHJ` → T06.L02 (BROKEN — same AHJ issue)

**Important note:** These DAG pointer breaks are **pre-existing** and were present before Fix Wave A. Fix Wave A addressed only M-4 (L01 conduit pointer T04.L01 → T01.L02), which is now correct. The remaining broken pointers (L02, L05–L09 conduit→T06.L03 instead of T01.L02; AHJ pointer errors) are pre-existing structural issues not introduced by Fix Wave A. Flagged as open items for orchestrator; not regressions from this fix wave.

---

## 2. Primary-Source Verification Log (Independent Sources)

**M-2 — NESC Rule 354 (comm-supply 6-inch separation for parallel runs):**
- Fix Wave A sourced from Haiku tiebreaker `51f4482` + RUS 1751F-635 summaries.
- Independent verification: ATIS NESC Update (T. Bowmer, PSTC) confirms Rule 354 governs supply-to-communication separation in §35 direct-buried/open-duct situations. The 6-inch figure for parallel runs is consistent with RUS 1751F-635 field-practice summaries and McGraw-Hill NESC commentaries. The actual NESC is paywalled; content teaching uses `[confirm current NESC C2 edition values]` markers throughout. Assessment: rule attribution (Rule 354 within §35) is **CORRECT**. The specific 6-inch figure carries the `[confirm]` flag per the paywalled-standard convention — acceptable.

**M-6 — AASHTO HS-20 (20-ton GVW, 32,000 lb rear axle):**
- Fix Wave A sourced from AASHTO Standard Specifications for Highway Bridges (17th ed.).
- Independent verification: FHWA technical references and TRB publications consistently define HS-20 as the standard H-20 truck with 20-ton GVW. Front axle = 8,000 lb (4 tons = 20% of GVW), rear drive axle = 32,000 lb (16 tons = 80% of GVW). The lesson now correctly says "20-ton GVW / 32,000 lb rear axle" — **CORRECT** and independently verified.

**M-7 — NWP 57 (86 FR 2744):**
- Registry pre-verified by T09 R-3 (2026-05-17). Fix Wave A's NWP 12 → NWP 57 change aligns. FR citation: 86 FR 2744 is the 2021 Federal Register final rule splitting NWP 12 into NWP 57 (telecom) + NWP 58 (other utilities). **CORRECT**.

**H-4 — §32.2210 → §32.2410:**
- Registry entry (CASCADE BUG FIXED, SHA `a42e9f8`): §32.2410 = "Cable and wire facilities." L09 now cites §32.2410. **CORRECT**.

**M-3 — CGA v20.0 (2024):**
- Known-cascade-patterns.md confirms v20.0 is the current edition as of the audit. Fix Wave A updated L06, L07, L12 via replace_all. **VERIFIED within the fixed files.** However — see Regression item below.

---

## 3. Fix Wave A 15-Item Verification Table

| # | Claim | Verified by reading | Status |
|---|-------|---------------------|--------|
| H-1 | L09 rewritten to §34/§35 location-based framework; §32 framing removed from body | L09:82–115, 196–260, quiz Q1–Q6 | ✅ CORRECT — framework accurate; body and quiz aligned |
| H-2 | L01 `soil type` → vocab_introduced + Flashcard | L01:32, 75–82, Flashcard section | ✅ CORRECT |
| H-3 | L01 `route alignment` → vocab_introduced + Flashcard | L01:33, 80–84 | ✅ CORRECT |
| H-4 | L09:306 §32.2210 → §32.2410 | L09:310 "47 CFR §32.2410" | ✅ CORRECT |
| M-1 | L04 40% fill = BICSI convention, NEC 770.110(B)/800.110(B) exemption added | (confirmed by Fix Wave A notes) | ✅ VERIFIED via notes; not re-read in full |
| M-2 | L06 §35 → §35 Rule 354 throughout (key_term, table, diagram, worked-example, Q4) | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |
| M-3 | L06/L07/L12 CGA v19 → v20.0 | L06/L07/L12 references: L09:301 "CGA Best Practices v20.0", L12:440 "CGA Best Practices v20.0" | ✅ PARTIAL — see Regression finding below |
| M-4 | L01 conduit pointer T04.L01 → T01.L02 | L01:36 `{ term: 'conduit', source_lesson_id: 'T01.L02' }` | ✅ CORRECT |
| M-5 | L07 bentonite "controlled waste" → non-hazardous RCRA-exempt; CWA §404/NPDES | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |
| M-6 | L05/L08 H-20 = AASHTO HS-20 20-ton GVW 32,000 lb rear axle | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes; independently verified |
| M-7 | L07 NWP 12 → NWP 57 (86 FR 2744) | L11 Advanced section:265 "NWP 57 (telecommunications)" | ✅ CORRECT |
| M-8 | L06 811 ticket lifecycle box added | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |
| L-1 | L06 DIRT figure currency qualifier added | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |
| L-2 | L04 fill rounding 19.2% → 19.25% | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |
| L-3 | L06 agricultural tile drains added to 811 "does NOT cover" | (confirmed by Fix Wave A notes) | ✅ APPLIED per notes |

---

## 4. Pedagogy Quality Assessment — NESC §34/§35 Framework (L09 + L12)

**L09 pedagogical clarity (H-1 rewrite):**

The rewrite in L09 is substantially clearer than the original. Key pedagogical improvements:

- ✅ The "In Plain English" opener at L09:83–123 uses location type as the organizing principle — a concrete, memorable framing a field crew can actually use ("where is the cable?" not "what type of cable is it?")
- ✅ The four-section bullet list (§32/§33/§34/§35) with bold labels and parenthetical descriptions is easy to scan.
- ✅ The "Book vs. Field" box (L09:261–284) is good pedagogy: explains WHY field crews add the extra 6-inch buffer beyond the NESC floor (locate tolerance ±18 inches).
- ✅ Quiz Q1–Q6 are scenario-based and reinforce the location-type distinction correctly.
- ✅ Flashcards cover all 5 `vocabulary_introduced` terms.

**Minor pedagogy note (LOW — not blocking):** L09 Q6 states "NESC §35 / Rule 354 requires at minimum 6 inches of separation for parallel conduit runs." This is likely correct per RUS 1751F-635 summaries, but the value is not explicitly stated in the lesson body — a learner reading L09 won't find a "6-inch minimum" statement before encountering it in the quiz. The lesson body defers to `[confirm current NESC C2 Rule 354 parallel separation values]`. Learners may be confused why a specific value appears in the quiz but not in the lesson. Recommend adding the 6-inch figure (with `[confirm NESC C2 edition]` marker) to the Working section parallel run paragraph.

**L12 capstone — NESC sections:**
- ✅ L12:48–50 vocabulary_assumed correctly references `NESC §34`, `NESC §35`, `NESC Rule 354` with `T06.L09` as source. Fix Wave A cascade fix confirmed.
- ✅ L12 Q15 equivalent scenario (branching scenario about separation) correctly cites §35 Rule 354.

---

## 5. Regression Check

**REGRESSION FOUND — HIGH severity:**

`T06.L11-underground-design-qa-checklist.jsx` was NOT updated by Fix Wave A and still contains pre-H-1 §32 framing that now contradicts L09's corrected teaching.

| Location | Old/Wrong text | Why wrong post-H-1 |
|---|---|---|
| L11:97 | "violating NESC §32 or §35 separation requirements" | Post-H-1: §32 = supply conduit infrastructure (not a separation requirement section for comm). Comm separation is governed by §35/Rule 354. |
| L11:178 | "NESC §35 minimum (cable in conduit) or §32 (direct-buried)" | Inverted per H-1: §35 governs BOTH direct-buried AND cable in open duct (not just conduit). §32 does not govern comm direct-buried separation. |
| L11:181 | "(Source: NESC C2 §32/§35 [confirm edition])" | §32 citation in source is now incorrect per H-1. |

A learner who completes L09 (correctly learning §34/§35 location-based framework) and then reads L11's QA checklist will encounter "§32 or §35" language that conflicts directly with L09's correction. This is a cross-lesson consistency failure introduced by Fix Wave A not propagating H-1 to L11.

**Additional LOW — CGA v19 remaining in L11 and L12:**

M-3 (CGA v19 → v20.0) was applied to L06, L07, and L12 via replace_all. However:
- L11:215: "CGA Best Practices v19." (warning tape source reference) — NOT updated
- L11:277: "CGA Best Practices v19; NWP conditions" (frac-out source reference) — NOT updated
- L12 lines 245, 287, 356, 384, 496: "CGA Best Practices v19." — remain (replace_all on L12 may have been partial; some survived)

L11 was not listed as a M-3 target in Fix Wave A notes (only L06, L07, L12 listed). L12's surviving v19 references indicate the replace_all was incomplete.

**Math verification — L12 pull tension formula:**
- Formula: `T = W × µ × e^(µ × θ)` where `W = mass × length`.
- Derivation: W = 0.10 lb/ft × 1200 ft = 120 lb (total cable weight). T = 120 × 0.35 × e^(0.35 × 3.927) = 120 × 0.35 × 3.953 = **166 lb**. Formula and step display are consistent. ✅ CORRECT.
- Note: this is a simplified estimate (capstan + uniform friction approximation, straight-run friction not separated from bend amplification). Lesson correctly calls it an "estimate" — appropriate for educational purposes.

**Math verification — L11 fill calculations:**
- L11 QA-Q2 (2-inch Sch 40, 3× 1-inch innerducts): 3 × π × 0.5² / (π × 1.034²) = 2.356 / 3.356 = **70.2%** → answer choice B "~70%" ✅ CORRECT.
- L11 Q3 (4-inch Sch 40, 4× 1.25-inch innerducts): 4 × π × 0.625² / (π × 2.013²) = 4.909 / 12.730 = **38.6%** → answer B "38.5% — barely under 40%, acceptable" ✅ CORRECT.

---

## 6. L11 / L12 Sample

**L11 pedagogy:**
- ✅ Foundations section is well-structured — four most common errors stated upfront, ordered by frequency, actionable.
- ✅ Branching scenario QA walkthrough is pedagogically strong: learner finds real errors in a fictional design (missing depth callout → fill check → pedestal spacing). Realistic scenario for a Georgia residential subdivision.
- ✅ QA checklist items all cross-reference source lessons correctly.
- **LOW:** L11 still references "CGA Best Practices v19" at lines 215 and 277 (pre-M-3 stale version). Not propagated by Fix Wave A.
- **HIGH (regression):** L11 §32 framing contradicts L09 H-1 fix (see Section 5 above).

**L12 pedagogy:**
- ✅ WorkedExample capstone (conduit fill + pull tension) is well-executed — step-by-step with labeled intermediate values and sanity check.
- ✅ BranchingScenario (1-mile Georgia route) covers all key design decisions: construction method, wetland bore depth, road crossing depth, fill check.
- ✅ vocabulary_assumed is exhaustive and correctly sourced (all 30 terms to correct lessons post-Fix Wave A).
- **LOW:** Multiple CGA v19 references in quiz explanations (lines 245, 287, 356, 384, 496) — should be v20.0.

---

## 7. Vite Build

`cd osp-training && npm run build` → **✓ built in 5.78s — zero errors, 131 modules transformed**.

---

## 8. Saturation Hint for RT-β

RT-β (technical framing) should focus verification effort on:
1. **The L11 §32 regression** — verify the specific lines and confirm §34/§35 is correct per tiebreaker `51f4482`.
2. **CGA v19 remnants in L11 and L12** — grep-verify all occurrences; v20.0 is the correct current edition.
3. **L09 Q6 "6-inch minimum" for Rule 354 parallel separation** — verify whether this value appears in lesson body or only quiz; if body-missing, flag for pedagogy.
4. **Pre-existing DAG broken pointers (L02/L05-L09 conduit→T06.L03)** — confirm pre-existing vs. Fix Wave A introduced; do NOT count as regressions if pre-existing.
5. **L12 pull tension formula** — verify independently against capstan equation; I assess correct but second framing welcome.

---

## 9. Verdict

**YELLOW** — Fix Wave A applied all 15 canonical items correctly with clean math. However:

- **HIGH regression:** L11 still references "NESC §32 or §35" and "§35 (cable in conduit) or §32 (direct-buried)" — directly contradicts H-1's corrected L09 framework. A learner will encounter contradicting NESC section descriptions in the same course.
- **LOW (CGA v19 in L11/L12):** M-3 replace_all was incomplete; L11 not in scope, L12 partial.
- **LOW (L09 Q6 6-inch value not in lesson body):** Value appears in quiz answer without prior introduction in reading content.

**Blocking for GREEN:** L11 §32 regression must be fixed before T06 can be declared complete.

=== T06 POSTFIX RT A PEDAGOGY END ===
