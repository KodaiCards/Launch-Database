# T03 Polish-B Notes

Write-path constraints acknowledged: only T03 L01/L03/L08/L11/L12 JSX files and this notes file written.

## NEC vocabulary_assumed additions

| Lesson | Before | After |
|---|---|---|
| L01 | no NEC entry | added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` |
| L03 | no NEC entry | added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` |
| L08 | no NEC entry | added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` |
| L11 | no NEC entry | added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` |
| L12 | no NEC entry | added `{ term: 'NEC', source_lesson_id: 'T01.L08' }` |
| L02 | already correct | skipped — already present |
| L07 | already correct | skipped — already present |

Basis: T01.L08 (`key-acronyms-field-reference.jsx` line 25) confirms `'NEC'` in vocabulary_introduced, and line 371 introduces it as "National Electrical Code (NFPA 70)." All 5 lessons reference bare "NEC" in prose.

## Verification results

- Schema validator: 12/12 PASS, 0 FAIL, 0 WARN
- DAG broken pointer count for T03: 0 (104 total broken pointers are T05/T19 pointing TO T03 — pre-existing, not caused by these edits)
- Vite build: ✓ built in 6.21s (zero errors)

## Neighborhood scan — other vocab terms used but not in vocabulary_assumed

### ITU-T
- Introduced: T01.L09 (`vocabulary_introduced`)
- Affected lessons: L12 (4 refs in quiz questions — ITU-T G.652/G.657 citations)
- Current state: neither `'ITU-T'` nor `'ICEA'` appear in any L12 vocabulary_assumed entry
- **Gap confirmed:** L12 uses bare ITU-T and likely should assume it from T01.L09

### ICEA
- Introduced: T01.L09 (`vocabulary_introduced`) — bare 'ICEA'
- T03.L01 introduces `'ICEA S-87-640'` (the specific standard)
- Affected lessons: L01 (14 refs), L03 (14 refs), L08 (1 ref), L11 (12 refs), L12 (7 refs)
- Current state: L01, L03, L08 all lack `{ term: 'ICEA', source_lesson_id: 'T01.L09' }` — only specific `'ICEA S-87-640'` pointer is in some lessons
- L11 has `{ term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' }` but not bare `'ICEA'`
- **Gap confirmed across all 5 lessons:** bare ICEA used but parent term not in vocabulary_assumed

### TIA
- Introduced: T01.L08 (`vocabulary_introduced` line 26)
- Affected lessons: L01 (11 refs), L11 (1 ref), L12 (indirect via L02/L03 content)
- Current state: none of the 5 lessons have `{ term: 'TIA', source_lesson_id: 'T01.L08' }`
- **Gap confirmed for L01 and L11** (substantive use)

### RUS
- Introduced: T01.L01 (via T01.L08 vocabulary_assumed: `{ term: 'RUS', source_lesson_id: 'T01.L01' }`)
- Affected lessons: L01 (4 refs), L03 (2 refs), L08 (3 refs), L11 (13 refs), L12 (20 refs)
- Current state: none of the 5 lessons have `{ term: 'RUS', ... }` in vocabulary_assumed
- **Gap confirmed, especially strong in L11 (13 refs) and L12 (20 refs)**

### FOA
- Introduced: T01.L08 (`vocabulary_introduced` line 27)
- Affected lessons: L01 (5 refs), L03 (4 refs), L08 (8 refs), L11 (4 refs), L12 (1 ref)
- Current state: none of the 5 lessons have `{ term: 'FOA', source_lesson_id: 'T01.L08' }`
- **Gap confirmed across all 5 lessons**

### NESC
- Introduced: T01.L02
- Affected lessons: L12 (7 refs in capstone quiz)
- Current state: L12 vocabulary_assumed lacks `{ term: 'NESC', source_lesson_id: 'T01.L02' }`
- **Gap confirmed for L12**

## Summary

Polish-B canonical scope (NEC) fully applied — 5 lessons corrected, 2 already clean.

Neighborhood scan found a SYSTEMIC pattern: T03 lessons assume TIA, FOA, RUS, ICEA, NESC, ITU-T in prose without declaring them in vocabulary_assumed. These are lower-priority than the NEC gap (NEC had the strongest direct-prose references to Article 770 rules), but represent real DAG incompleteness.

Recommended Polish-C scope: add TIA + FOA + RUS + ICEA + ITU-T + NESC vocabulary_assumed entries to the T03 lessons that use them bare, in the same surgical pattern as Polish-B.

=== T03_POLISH_B NOTES END ===
