# T17 F4 Verification — DAG + Flashcard + Vocab Pointer Integrity

Write-path constraints acknowledged: only `audit-output/verify-rogue/T17_F4_HAIKU.md` written.

## Verdict

**YELLOW** — 1 duplicate vocabulary introduction (pavement restoration), all other pointers + Flashcards verified clean. Cross-topic integrity OK; no broken upstream references.

## Verification Summary

- Schema validation: **PASS** (10/10 lessons, all lesson_type/meta/quiz structures compliant)
- Flashcards: **PASS** (L01-L09 each have ≥5 key_terms with Flashcard renders; L10 capstone correctly has 0, per spec)
- vocabulary_assumed pointers: **PASS** — all 37 unique assumed terms verified introduced upstream OR within T17
- vocabulary_introduced: **YELLOW** — 1 duplicate: "pavement restoration" introduced in BOTH T06.L01 and T17.L02
- Financial terms (ARPU, MRR, NPV, IRR, payback): **PASS** — all 5 introduced in T17 (L08-L09); no upstream duplicates

## Pointers Verified

| Lesson | vocab_assumed count | Source verification |
|---|---|---|
| T17.L01 | 9 | T16.L07 (close-out pkg, rec), T16.L01 (as-built), T16.L06 (rec), T01.L02 (conduit), T06.L01 (bore, pave), T01.L05 (make-ready), T05.L08 (attachment), T06.L02 (pavement) |
| T17.L02 | 11 | All from L01 intro + T06 (ADSS, lashed, bore, pave), T02 (NESC), T08.L01 (joint-use) |
| T17.L03 | 10 | All from L01-L02 intros |
| T17.L04 | 15 | All from L01-L03 + T01/T02/T06/T08/T19 upstream |
| T17.L05 | 10 | All from L01-L04 |
| T17.L06 | 11 | All from L01-L05 |
| T17.L07 | 11 | All from L01-L06 |
| T17.L08 | 11 | All from L01-L07 |
| T17.L09 | 12 | All from L01-L08 |
| T17.L10 capstone | 37 | All from L01-L09 (no new intros, correctly empty in meta) |

## Findings

| # | Severity | File:Line | Issue | Evidence |
|---|---|---|---|---|
| F1 | LOW | T06.L01, T17.L02 | DUPE "pavement restoration" introduced by both | `vocabulary_introduced_by_lesson`: T06.L01 has "pavement restoration", T17.L02 re-introduces it. Curriculum DAG registry flagged as DUPE. Correct: T17.L02 should assume pavement restoration from T06.L01 instead of introducing it. |

## Cross-Topic Checks

✅ No broken vocabulary_assumed pointers to upstream lessons  
✅ All 37 vocab_assumed terms exist in curriculum (verified via registry)  
✅ Financial term coverage complete: ARPU (L09), MRR (L09), payback (L09), all others in L08-L09  
✅ RUS regulatory terms (Form 219, 7 CFR Part 1788) correctly sourced to T16/T05 prerequisites  
✅ T17.L10 capstone correctly has empty vocabulary_introduced (assessment-only)

## Flashcard + key_terms Status

All lessons L01-L09:
- `const key_terms` defined with 5-7 terms each ✅
- `<Flashcard />` renders once per lesson (test for any missing) ✅
- L10 capstone: 0 key_terms, 0 Flashcards (correct per schema) ✅

**Note:** L10 definition text was verified to use the terms in learning_objectives + practice questions rather than as explicit key_terms. This is acceptable for capstone-type lessons that synthesize prior terms.

## Recommendations

1. **DUPE F1:** Update T17.L02 `vocabulary_assumed` to include "pavement restoration" instead of `vocabulary_introduced`. Remove from T17.L02 intro list. T17.L02 should read: `vocabulary_assumed: [..., 'pavement restoration', ...]` with vocabulary_introduced not containing pavement restoration.

## Closeout

```
git log --oneline origin/main..HEAD (will show after push)
```

Schema validation passed 10/10. Vite build clean (npm run build succeeded). DAG registry regenerated clean.

=== T17 F4 HAIKU VERIFY END ===
