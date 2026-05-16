# T04 POLISH-C Notes
Applied: 2026-05-16

## Fixes applied

### Fix 1 — T01.L05 vocabulary_introduced + Flashcard
- BEFORE: vocabulary_introduced = ['survey','design','permit','make-ready','construction','testing','as-built','close-out','RUS Form 219']
- AFTER: 'OTMR' added after 'make-ready'
- Flashcard added to Flashcard deck: { id: 'T01-L05-FC-otmr', front: 'OTMR (One-Touch Make-Ready)', back: (verbatim from acronym table at line 69) }
- Definition pulled verbatim from existing L05 acronym table (line 69): "FCC-mandated process (47 CFR 1.1411) that allows a qualified contractor hired by the new attacher to perform make-ready work in a single visit rather than waiting for each existing attachment owner to schedule separate work. Reduces make-ready timelines significantly."

### Fix 2 — T04.L04 vocabulary_assumed
- BEFORE: no OTMR entry in vocabulary_assumed
- AFTER: { term: 'OTMR', source_lesson_id: 'T01.L05' } added after make-ready entry

### Fix 3 — T04.L04 line ~487 FCC Order 18-111 citation
- BEFORE: "Under the FCC's One-Touch Make-Ready (OTMR) process (FCC Order 18-111), a new"
- AFTER: "Under the FCC's One-Touch Make-Ready (OTMR) process (FCC Order 18-111, now codified at 47 CFR 1.1411), a new"

## Vite build
✓ Built in 5.65s — 131 modules

## Neighborhood scan findings (not fixed — do not touch)
- T04.L04 acronym table (line ~123) references "FCC 18-111" without the 47 CFR 1.1411 codification note (same pattern as the fix above, but in the acronym table, not prose body). Low-severity — could be aligned in future polish pass.
- T01.L05 learning_objectives line 39 references the 15-business-day deadline for "simple make-ready under 47 CFR 1.1411(h)(2)(ii)" — subsection-level precision. Not a bug; no change needed.
