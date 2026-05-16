# T04 Polish-A Notes
Commit: 5fcccd7

## Fixes Applied

### G-1 MED-HIGH — L10 Part 32 account corrections
- Q16 choice B: `§ 32.2210 (Cable and Wire)` → `§ 32.2410 (Cable and Wire Facilities)`, `§ 32.2420 (Poles)` → `§ 32.2411 (Poles)`
- Q17 choices: `§ 32.2210` → `§ 32.2410`, `§ 32.2420` → `§ 32.2411`, `§ 32.6512 Motor Vehicles` → `§ 32.6112 Motor Vehicle Expense`
- Q17 explanation: references updated to `§ 32.2410 (cable and wire facilities)`, `§ 32.2411 (poles)`, `§ 32.2111 (land)` per Haiku ground-truth

### G-2 LOW — L08 make-ready DAG pointer
- BEFORE: `{ term: 'make-ready', source_lesson_id: 'T01.L01' }`
- AFTER: `{ term: 'make-ready', source_lesson_id: 'T01.L05' }`

### G-3 LOW — L08 ROW DAG pointer
- BEFORE: `{ term: 'ROW', source_lesson_id: 'T01.L01' }`
- AFTER: `{ term: 'ROW', source_lesson_id: 'T01.L08' }`

### NEW-LOW — L05 ROW DAG pointer
- BEFORE: `{ term: 'ROW', source_lesson_id: 'T01.L01' }` (L05 line 54)
- AFTER: `{ term: 'ROW', source_lesson_id: 'T01.L08' }`

### G-4 LOW — L09 Sortable Form 307 ordering
- Removed `form-307` from both `items` array and `correctOrder`
- Updated `feedbackCorrect` and `feedbackIncorrect` to note Form 307 is a contractor bid-solicitation surety document, not part of the RUS pre-engineering submission
- Sortable now has 6 items (was 7); correctOrder has 6 IDs

### G-5 LOW — L09 FCC §224 citation precision
- BEFORE: `FCC §224 pole attachment rate formula`
- AFTER: `47 U.S.C. §224 / 47 CFR Part 1, Subpart J §§1.1401–1.1416 (pole attachment rate formula)`

## Neighborhood Scan Findings (NOT fixed — surface only)

**L10 capstone neighborhood scan (other Part 32 references):**
- Q17 is the only standalone Part 32 accounting question in the capstone; Q16 (now corrected) was the second. No other capstone questions reference specific Part 32 account numbers. Clean.
- L07 (the source lesson for Part 32 content) was not in scope — but per earlier Fix Wave A (`0e1bc29`), L07's plant accounts table was already corrected to §32.2410 / §32.2411 / §32.2111. The capstone now matches L07.

**L05 + L08 vocabulary_assumed scan (other T01.L01 pointers):**
- L08 has `OSP → T01.L01` — correct, OSP is introduced in T01.L01
- L05 has `OSP → T01.L01` — correct
- L08 `make-ready` fixed (L01→L05); L08 `ROW` fixed (L01→L08)
- L05 `pole → T01.L02`, `conduit → T01.L02`, `joint-use → T01.L02` — these appear introduced in T01.L02; no change needed
- L10 capstone `vocabulary_assumed` — `make-ready flag` points to `T04.L04` (correct; make-ready flag as T04 concept); term `make-ready` itself is in L08's assumed list corrected above; capstone does not separately list `make-ready` raw term

**L09 Sortable neighborhood scan (±20 lines of correctOrder):**
- No other Sortable in L09 has ordering contradictions
- The AnnotatedDiagram hotpoints correctly describe the RUS cover sheet elements with no Form 307 reference
- The Advanced section prose correctly describes Form 307 as a contractor bid document — no contradiction with the fixed Sortable

## Vite Build
✓ built in 5.98s — clean, 0 errors
