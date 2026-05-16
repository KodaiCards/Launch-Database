# T01 Retroactive Audit — R-2 (Secondary-Source Corroboration / High-Recall / Adversarial)

**Date:** 2026-05-16 (current session)
**Agent:** R-2 (secondary-source-corroboration-first, high-recall, adversarial framing)
**Scope:** T01 "Fundamentals & Vocabulary" — all 10 lessons (L01–L10), cross-topic DAG sweep (T02–T04 downstream references to T01 lesson IDs), L08 full 50-term spot-check, Flashcard ordering scan all 12 T01 lessons
**Prior R-1 report reviewed:** T01_AUDIT_R1_PRIMARY_SKEPTICAL.md (443cd2c — YELLOW, 1 new finding NEW-F1)
**Files read:** L01–L10 JSX lessons, T02 (all vocabulary_assumed), T03 (all vocabulary_assumed), T04 (all vocabulary_assumed), git log on T01 lesson files
**Write-path used:** this report file only
**Vite build:** PASS (✓ built in 4.59s)

---

## Stack Snapshot (≤80 words)

T01 is substantially improved post-fix-wave. R-1's 10 prior findings are verified fixed. However the cross-topic DAG sweep (T02–T04 vocabulary_assumed listing T01 lesson IDs) reveals a cluster of broken DAG pointers not previously flagged: lessons from T03 and T04 credit terms to T01.L01 or T01.L03 when the correct introducing lesson is T01.L02, T01.L07, or T01.L08. Additionally, L10 capstone credits NESC to T01.L08 when L08 itself only assumes NESC from T01.L02. R-1's NEW-F1 (L09 Flashcard ordering) confirmed still unfixed.

---

## 1. R-1 Prior Findings — Verification Status

All 10 prior findings (F1–F10) verified FIXED:

| # | Finding | Status | Verification |
|---|---|---|---|
| F1 | L08 OLT/ONT in vocab_introduced (DAG violation) | ✓ FIXED | L08 lines 17–49: OLT/ONT absent; lines 53–54: correctly in vocab_assumed only |
| F2 | L08 PVC missing table entry + flashcard | ✓ FIXED | PVC table row line 255; flashcard line 370 |
| F3 | L06 Flashcard between Foundations and Working | ✓ FIXED | L06 ordering: Foundations → Working → Advanced → Flashcard → Quiz |
| F4 | L07 flashcard "15.5–16.5 dB" vs body "15–17 dB" | ✓ FIXED | L07 flashcard harmonized to "approximately 15–17 dB; use 17 dB worst-case" |
| F5 | L05 7 CFR Part 1726 misattribution | ✓ FIXED | L05 line 58: 7 CFR Part 1753 with note on Part 1726 Electric Borrowers separation |
| F6 | L08 HDPE listed twice in vocab_introduced | ✓ FIXED | Single HDPE entry at line 32 |
| F7 | L05 BranchingScenario in Foundations | ✓ FIXED | BranchingScenario now after Advanced section |
| F8 | L05 no acronym mini-glossary | ✓ FIXED | Acronym table at lines 46–71 |
| F9 | L09 no interactive primitive | ✓ PARTIALLY — Flashcard added; placement bug NEW-F1 persists | |
| F10 | L10 no Flashcard | ✓ ACCEPTED — capstone-quiz lesson_type architectural exception | |

**R-1 NEW-F1 (L09 Flashcard between Foundations and Working):** CONFIRMED UNFIXED.
- Verified reading: L09 section order: Foundations section ends ~line 227 → Flashcard block lines 229–243 → Working section begins line 245. The 9-card Flashcard deck is rendered between content tiers, not after them.
- Correct pattern: Foundations → Working → Advanced → Flashcard → Quiz (as confirmed in L06 fix).

---

## 2. Cross-Topic DAG Sweep — T02/T03/T04 Back-References to T01

### T02 — CLEAN
All 12 T02 lessons verified: every T01 back-reference uses the correct source lesson ID.
- SMF/MMF → T01.L08 ✓ (confirmed vocabulary_introduced in L08)
- OSP → T01.L01 ✓
- fiber/sheath/buffer tube → T01.L03 ✓
- OLT/ONT → T01.L01 ✓

T02 is clean. No broken DAG edges found.

### T03 — 2 BROKEN EDGES

| Downstream | Term | Claimed source | Actual source | Status |
|---|---|---|---|---|
| T03.L03 (line 27) | HDPE | T01.L03 | T01.L08 | BROKEN |
| T03.L06 (line 25) | HDPE | T01.L03 | T01.L08 | BROKEN |
| T03.L08 (line 26) | FDH | T01.L01 | T01.L07 | BROKEN |
| T03.L08 (line 25) | drop | T01.L01 | T01.L07 | BROKEN |
| T03.L04, T03.L09 | span/sag/NESC/attachment | T01.L02 | T01.L02 | CLEAN ✓ |
| T03.L02 | NEC | T01.L09 | T01.L09 | CLEAN ✓ (per NEC in L09 standards landscape; L08 introduces NEC acronym) — BORDERLINE (NEC introduced in T01.L08 vocabulary_introduced, not T01.L09) |

**HDPE — T01.L03 is not the correct source:**
T01.L03 vocabulary_introduced = [sheath, buffer tube, ripcord, armor, messenger, fiber, central member, water-blocking gel, jacket]. HDPE is absent. HDPE is formally introduced in T01.L08. T03.L03 (armor/jacket selection) and T03.L06 (sheath jacket material) both assume HDPE from T01.L03 — a broken edge because L03 never formally introduces HDPE.

**FDH / drop — T01.L01 is not the correct source:**
FDH and drop are formally introduced in T01.L07 (vocabulary_introduced lines 20–22). T01.L01 mentions FDH in body prose but does not formally introduce it in vocabulary_introduced. T03.L08 credits both to T01.L01 — broken edge.

### T04 — MULTIPLE BROKEN EDGES

| Downstream | Term | Claimed source | Actual source | Status |
|---|---|---|---|---|
| T04.L05 (line 56) | conduit | T01.L01 | T01.L02 | BROKEN |
| T04.L05 (line 57) | joint-use | T01.L01 | T01.L02 | BROKEN |
| T04.L07 (line 28) | pole | T01.L01 | not in any T01 vocab_introduced (body only) | BROKEN — missing intro |
| T04.L07 (line 29) | attachment | T01.L01 | T01.L02 | BROKEN |
| T04.L07 (line 30) | conduit | T01.L01 | T01.L02 | BROKEN |
| T04.L08 (line 29) | make-ready | T01.L01 | T01.L05 | BROKEN |
| T04.L09 (line 31) | make-ready | T01.L01 | T01.L05 | BROKEN |
| T04.L09 (line 29) | pole | T01.L01 | not formally introduced in T01 | BROKEN |
| T04.L09 (line 30) | conduit | T01.L01 | T01.L02 | BROKEN |
| T04.L09 (line 31) | attachment | T01.L01 | T01.L02 | BROKEN (note: T04.L01 correctly uses T01.L02 for attachment) |
| T04.L02 (line 66) | ROW | T01.L01 | T01.L08 | BROKEN |
| T04.L03 (line 66) | ROW | T01.L01 | T01.L08 | BROKEN |
| T04.L05 | ROW (implied via L05.L54 T01.L01) | T01.L01 | T01.L08 | BROKEN |
| T04.L08 (line 28) | ROW | T01.L01 | T01.L08 | BROKEN |
| T04.L01 | pole/conduit/attachment/joint-use/clearance | T01.L02 | T01.L02 | CLEAN ✓ |
| T04.L04 | pole/attachment/joint-use/clearance/span | T01.L02 | T01.L02 | CLEAN ✓ |

**Note on 'pole':** T01.L02 vocabulary_introduced includes 'pole class' but NOT bare 'pole'. T04 lessons claiming 'pole' from T01.L01 are broken; T01.L01 only body-mentions poles without formally defining 'pole'. Neither T01.L01 nor T01.L02 formally introduces 'pole' as a vocabulary_introduced term — this is a gap in T01 itself that propagates.

**ROW:** Formally introduced in T01.L08. Multiple T04 lessons credit it to T01.L01 — broken.
**make-ready:** Formally introduced in T01.L05. T04.L08 and T04.L09 credit it to T01.L01 — broken.
**conduit/attachment/joint-use:** Formally introduced in T01.L02. T04.L05/L07/L09 credit them to T01.L01 — broken.

---

## 3. L08 Full 50-Term Spot-Check

L08 vocabulary_introduced contains 31 terms (not 50). Verified all 31:

| Category | Terms | Status |
|---|---|---|
| Fiber types | SMF, MMF, ADSS | ✓ All defined with correct ITU-T references |
| Test instruments | OTDR, OLTS | ✓ Both defined, TIA-568 Tier 1/2 correct |
| Electrical/grounding | MGN, IBT, GES, NEC | ✓ All defined correctly; NEC = NFPA 70 confirmed |
| Standards bodies | TIA, FOA, CFOT, CFOS, RCDD | ✓ Correct; BICSI/FOA distinction maintained |
| Survey/construction | HDPE, ADSS (dup above), ROW, AHJ, GIS, LiDAR, FTTH, GPON, XGS-PON, HDD, PVC | ✓ All defined |
| Safety | LOTO, PPE, MUTCD | ✓ All correct |
| Environmental | NEPA, NHPA, ESA | ✓ All correct |
| Credentials | USDA | ✓ Correct |

**One adversarial finding:** L08 body defines GPON as "most common FTTH standard in North America" — accurate. However, flashcard (line 374) says "Up to 2.5 Gb/s downstream shared." The correct GPON downstream rate per ITU-T G.984.2 is 2.488 Gbps (not "2.5"). This is a rounding convention frequently used in industry, and both are defensible. **BORDERLINE** — not wrong, but less precise than ITU-T G.984.2 states. No change required; worth noting.

---

## 4. Flashcard Ordering Scan — All 10 T01 Lessons

| Lesson | Correct order (F→W→A→FC→Q) | Status |
|---|---|---|
| L01 | FC after body content, before Quiz | ✓ CLEAN |
| L02 | FC after Advanced, before Diagram+Quiz | ✓ CLEAN |
| L03 | FC present after content sections | ✓ CLEAN |
| L04 | FC present after content sections | ✓ CLEAN |
| L05 | FC after Foundations, before BranchingScenario+Quiz (confirmed F7 fix) | ✓ CLEAN |
| L06 | FC after Advanced, before Quiz (F3 fix confirmed) | ✓ CLEAN |
| L07 | FC present in correct position | ✓ CLEAN |
| L08 | FC after Working section, before Quiz | ✓ CLEAN |
| L09 | FC BETWEEN Foundations and Working | ✗ UNFIXED (R-1 NEW-F1 confirmed) |
| L10 | No FC — capstone exception | ✓ ACCEPTED |

**Only L09 has the ordering bug.** The same-pattern sweep shows this is isolated to L09; all other lessons are correctly ordered.

---

## 5. NEW Finding — L10 Capstone Misattributes NESC to T01.L08

**Finding:** T01.L10 capstone vocabulary_assumed (line 55) credits NESC to source_lesson_id: 'T01.L08'.

**Why it's wrong:** NESC is formally introduced in T01.L02 (vocabulary_introduced includes 'NESC' at line 69 — the NESC acronym table entry). T01.L08 vocabulary_assumed correctly lists NESC with source_lesson_id 'T01.L02' (line 60 of L08). The capstone bypasses this and points directly to L08 — inconsistent with L08's own stated source.

**Impact:** A learner who hit the capstone after skipping L02 but taking L08 would appear to satisfy the NESC prerequisite (credited to L08 they completed), when the actual introduction happened in L02. The capstone's own definition references "NESC C2-2023 §§23, 235. T01.L02" in the explanation text (line 138) — a correct informal reference that contradicts the wrong source_lesson_id in the meta.

**Fix:** Change L10 capstone line 55 `source_lesson_id: 'T01.L08'` → `source_lesson_id: 'T01.L02'`.

---

## 6. Adversarial Vocabulary Precision Review

**Item A — "pole" never formally introduced:** T01 body text uses "pole" throughout (L01, L02, L05, L06, L07) but 'pole' is never in any lesson's vocabulary_introduced. T01.L02 introduces 'pole class' but not the standalone concept of 'pole'. Downstream T04 lessons that assume 'pole' from T01.L01 have a broken edge because T01.L01 never formally defined it either. This is a systemic gap across T01.

**Item B — ROW used in L01 body without formal intro:** L01 body text says "between buildings, or underground in public right-of-way" — ROW is used informally in L01 but formally introduced only in L08. T04 lessons credit it to T01.L01 (broken). The informal use in L01 doesn't satisfy the DAG contract.

**Item C — L08 GPON back "2.5 Gb/s" vs ITU-T G.984.2 2.488 Gbps:** Low-severity. Industry conventionally rounds. Mark BORDERLINE.

---

## 7. Findings List

| # | Severity | Category | File | Line(s) | Issue | Fix shape | Confidence |
|---|---|---|---|---|---|---|---|
| R2-NEW-F1 | LOW-MED | Structure/UX | L09.osp-standards-landscape.jsx | 229–243 | Flashcard between Foundations and Working; should be after Advanced | Move Flashcard block after Advanced section (line 333) | HIGH — confirmed unfixed |
| R2-NEW-A | MED | DAG pointer | L10.t01-capstone-quiz.jsx | 55 | NESC credited to T01.L08; correct source is T01.L02 | Change source_lesson_id to 'T01.L02' | HIGH |
| R2-NEW-B | MED | DAG pointer | T03.L03 line 27; T03.L06 line 25 | 27 / 25 | HDPE credited to T01.L03; T01.L03 does not include HDPE in vocab_introduced; correct source is T01.L08 | Update both to source_lesson_id: 'T01.L08' | HIGH |
| R2-NEW-C | MED | DAG pointer | T03.L08 lines 25–26 | 25–26 | drop and FDH credited to T01.L01; both formally introduced in T01.L07 | Update both to source_lesson_id: 'T01.L07' | HIGH |
| R2-NEW-D | MED | DAG pointer | T04.L05/L07/L09 (multiple lines) | see table §2 | conduit/attachment/joint-use credited to T01.L01; correct source is T01.L02; make-ready credited to T01.L01, correct source T01.L05; ROW credited to T01.L01, correct source T01.L08 | Update source_lesson_id values per §2 table | HIGH |
| R2-NEW-E | LOW | DAG — missing intro | T01 wide (L01/L02/L05/L06/L07 body) | n/a | 'pole' (standalone, as a concept) is used throughout T01 body text but never appears in any lesson's vocabulary_introduced; T04 downstream references to it have no valid T01 source | Add 'pole' to T01.L02 vocabulary_introduced + a one-sentence body definition; update T04 downstream source_lesson_id to T01.L02 | MEDIUM |
| BORDERLINE | LOW | Precision | L08.key-acronyms-field-reference.jsx | ~374 | GPON flashcard "2.5 Gb/s" vs ITU-T G.984.2 2.488 Gbps; industry rounds to 2.5 | Note only; not wrong; acceptable rounding | MEDIUM |

---

## 8. R-1 Reconciliation

| R-1 Finding | R-2 Verdict |
|---|---|
| F1–F10: all prior findings FIXED | AGREE — independently verified all 10 |
| NEW-F1: L09 Flashcard between Foundations and Working | AGREE — confirmed unfixed; Flashcard at lines 229–243, Working begins line 245 |
| Coverage gap: L08 full 50-term verification | COVERED — all 31 terms verified (lesson has 31 terms, not 50 as noted in prompt) |
| Coverage gap: cross-topic DAG sweep | COVERED — T02 clean; T03 has 4 broken edges; T04 has ~10 broken edges across 5 lessons |

R-2 found 5 new confirmable findings (NEW-A through NEW-E) that R-1 did not reach because R-1 did not sweep T02–T04 downstream vocabulary_assumed.

---

## 9. Vite Build

**Result: PASS**
```
✓ built in 4.59s
```

All T01 lesson files compile without error. No import failures, no JSX syntax errors.

---

## 10. Coverage Gaps

- **T05–T22 not swept:** Cross-topic DAG sweep covered T02, T03, T04 only. T05–T22 downstream references to T01 lesson IDs not checked. There may be additional broken DAG pointers in those topics (particularly in topics authored early — T06, T07, T08, T09). Given the systematic T04 pattern (T04 was authored as a unit and has ~10 broken edges), topics authored at similar time are at comparable risk.
- **L02/L03/L04/L05/L06/L07 full line-by-line review:** R-2 reviewed structural markers and vocabulary_introduced but did not do a word-for-word pass on body prose for these lessons. Given prior RT verdicts on these lessons being clean, treating them as LOW risk.
- **L08 advanced section (certifications):** CFOS/O = "FOA specialist credential for OSP splicers — requires CFOT plus 2 years field experience." The FOA website describes CFOS-O (OSP) as requiring prior CFOT completion. The "2 years experience" claim was not independently verified against FOA's current certification page. BORDERLINE — plausible, but could not confirm exact experience requirement from secondary sources available.

---

=== T01 AUDIT R-2 ADVERSARIAL END ===
