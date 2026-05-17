# T03 Polish-A Notes

**Wave:** T03 retroactive audit polish stage  
**Date:** 2026-05-17  
**Commit:** f0e39db

## Canonical Fix Applied

**NB-1 LOW — T03.L07 vocabulary_assumed missing NEC**

- BEFORE: vocabulary_assumed had 5 entries (CST, interlocked armor, direct-burial, rodent-proof armor, ADSS). NEC referenced in prose 13× + in learning_objectives + in vocabulary_introduced (as 'NEC §770.179(B)'), but NEC itself not declared as assumed.
- AFTER: added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` as 6th entry.
- DAG registry confirmed: T01.L08 introduces the term 'NEC' exactly.
- Validator: 12/12 PASS. DAG: 0 new BROKEN in T03. Vite build: clean.

## Neighborhood Scan (T03 L01–L12, NEC prose-vs-vocab-assumed audit)

Other lessons that reference NEC in prose but lack NEC in vocabulary_assumed:

| Lesson | NEC prose refs | NEC in vocab_assumed | NEC in vocab_introduced | Notes |
|---|---|---|---|---|
| L01 | 1 | No | No | 1 ref in a parenthetical footnote (NEC Article 770 mention). Low-priority. |
| L02 | 44 | **Yes** ✓ | No | Already correct — NEC in vocab_assumed. |
| L03 | 13 | No | No | L03 uses NEC Article 770 extensively. **Candidate for future polish** — add `{ term: 'NEC', source_lesson_id: 'T01.L08' }`. L03 appears before L07 in teaching order (order:3), so L01.L08 is still the correct source. |
| L08 | 1 | No | No | 1 minor parenthetical ref. Low-priority. |
| L11 | 3 | No | No | 3 refs in cable-spec reading context. Consider future polish. |
| L12 (capstone) | 19 | No | No | Capstone quiz. NEC used in multiple quiz questions. **Candidate for future polish.** |

**Scope note:** L03 and L12 are the strongest candidates — both have substantive NEC prose without the vocabulary_assumed pointer. Not fixed in this polish wave (scope = L07 NB-1 only). Flagging for next T03 touch.

## Verification

- `node osp-training/scripts/validate-lesson-schema.js T03`: 12/12 PASS, 0 FAIL, 0 WARN
- `node osp-training/scripts/build-dag-registry.js`: T03 broken count = 0 (pre-existing BROKEN items are in T05/T19 pointing TO T03 — unchanged)
- `cd osp-training && npm run build`: ✓ built in 5.95s, zero errors
