# T04 Fix Canonical — Route Survey & Pre-Engineering

**Date:** 2026-05-16
**Sources:** R-1 (Primary-Skeptical `2990c72`) + R-2 (Corrob-Adversarial `eacbaf9`)
**Fix agent:** Applies confirmed items; flags conflicts for orchestrator.

---

## Unified Canonical Fix List

| # | Severity | Both audits? | Lesson | Issue | Fix action | Status |
|---|---|---|---|---|---|---|
| C-1 | HIGH | R-1 only (F1) | L05 Q4 explanation + Sortable feedbackCorrect | NWP 57 framed as independent Section 10 trigger. NWP 57 covers BOTH Section 10 + Section 404 jointly; Section 10 is NOT a separate hurdle when NWP 57 is granted. | Rewrite Q4 explanation and Sortable feedbackCorrect to accurately state NWP 57 joint authorization. | APPLIED |
| C-2 | HIGH | R-2 only (H-1) | L04 `meta.prerequisites` | Spurious `T02.L01` prerequisite — L04 (pole audit field measurements) uses zero fiber-physics content from T02.L01. Blocks learner access without educational justification. | Remove `T02.L01` from L04 `meta.prerequisites` array. | APPLIED |
| C-3 | HIGH | R-2 only (H-2) | L02 `vocabulary_introduced` + body | "photogrammetry" used in L02 prose but never in `vocabulary_introduced`, `key_terms`, or a Flashcard definition. ARCH.md lists it as T04-introduced. | Add "photogrammetry" to L02 `vocabulary_introduced` + `key_terms` + Flashcard. | APPLIED |
| C-4 | HIGH | R-2 only (H-3) | L01 or L04 `vocabulary_introduced` | "midspan clearance" listed in ARCH.md T04 `vocabulary_introduced` but absent from all T04 lesson files. Downstream T05/T08 reference this term. | Add "midspan clearance" to L04 `vocabulary_introduced` + `key_terms` + Flashcard (best fit: pole audit where clearance measurement is measured). | APPLIED |
| C-5 | MEDIUM | R-1 F2 + R-2 M-1 (BOTH) | L02 lines 330–331 | FAA 14 CFR 107.51(b) structure exception misstated. Lesson implies it is a blanket route-level permission; it only applies within 400 ft RADIUS of each structure. Also 150 m AGL = 492 ft which exceeds 400 ft AGL without a waiver. | Replace "60–150 m AGL (200–500 ft)" with "60–120 m (200–400 ft)" as standard Part 107 range; note 120–150 m requires altitude waiver. Correct structure-exception language to specify 400 ft radius limit per pole. | APPLIED |
| C-6 | MEDIUM | R-1 only (F6) | L04 `vocabulary_assumed` | `span`, `pole`, `attachment`, `clearance`, `joint-use` all attribute `source_lesson_id: 'T01.L01'` but these were added to T01.L02 via fix C-09 (`cdf1ada`). | Update all five terms in L04 `vocabulary_assumed` to `source_lesson_id: 'T01.L02'`. | APPLIED |
| C-7 | LOW | R-2 only (L-1) | L05 `vocabulary_introduced` | "route alternatives" used as central concept in L05 but never formally added to `vocabulary_introduced` + Flashcard. | Add "route alternatives" to L05 `vocabulary_introduced` + `key_terms` + Flashcard. | APPLIED |
| C-8 | LOW | R-2 only (L-3) | L05 cost range text | Aerial $2,000–$6,000/mile and underground $6,000–$18,000/mile may be below current post-2024 costs. Lesson already has a "highly variable" caveat. | Add a temporal caveat sentence pointing to RUS Form 395 for current estimates. | APPLIED |
| C-9 | MEDIUM | R-2 only (M-2) | L04 pole class section | Lesson records pole class without explaining ANSI O5.1 load-capacity classification. Class numbers are meaningless to learners without context. | Add 2–3 sentence explanation of ANSI O5.1 load classes (Class 1 = highest rated, Class 6 = lowest, H-classes for extra-heavy) to L04 foundations or working section. | APPLIED |
| C-10 | MEDIUM | R-2 only (M-3) | L04 measurement checklist | No instruction to record anchor/guy wire positions, size, lead angle, or condition during pole audit. Critical for make-ready scoping. | Add anchor/guy wire fields to the pole audit step-by-step list. | APPLIED |
| C-11 | MEDIUM | R-2 only (M-4) | L04 pole audit section | No instruction on identifying pole ownership. OTMR requires correct owner identification before submitting the 14/30/14 day application. | Add 3–4 sentence ownership-identification procedure to L04 with cross-reference to T08. | APPLIED |

---

## Conflicts / Orchestrator Review Required

| # | Issue | R-1 finding | R-2 finding | Recommendation |
|---|---|---|---|---|
| X-1 | L07 § 32.2210 account mapping | R-1 F3 says § 32.2210 = Land (not Cable+Wire); Cable+Wire = § 32.2410. Flags as MEDIUM needing eCFR verification. | R-2 negative findings explicitly mark "47 CFR 32 plant accounts (L07): §32.2210... consistent with eCFR structure ✓" — corroborating the lesson as-is. | CONFLICTING — R-1 and R-2 directly contradict each other on this account mapping. Neither could access live eCFR with certainty. **DO NOT fix without orchestrator directing an authoritative eCFR check.** Lesson already carries a "verify against current published CFR" caveat which partially mitigates. |

---

## No-Action Items (confirmed correct)

| # | R-1 finding | Disposition |
|---|---|---|
| F4 | L01 ANSI Class 3 hi-vis near high-speed traffic (LOW) | Directionally correct, errs conservative (safer), not an error. No fix. |
| F5 | L04 12-inch make-ready flag threshold (LOW observation) | Correctly presented as field heuristic, not code-minimum. No fix. |
| R-2 L-2 | L09 RUS Form 307 — SME confirm needed | Author-time [confirm] marker to be added in T04.L09 on next pass; not a lesson-body error. No structural fix in this wave. |
| R-2 L-4 | L02 "multiple returns almost always indicate vegetation" imprecision | Thin wire geometry can also produce multiple returns. Technical footnote imprecision only — lesson is directionally correct and safe. Low-priority polish, not a fix. |

---

=== T04 FIX CANONICAL END ===
