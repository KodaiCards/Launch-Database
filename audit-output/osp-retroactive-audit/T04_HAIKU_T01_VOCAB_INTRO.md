# T04 Haiku: T01 Vocabulary First-Introduction Ground Truth

## Objective
Resolve T04 retroactive audit DAG pointer conflicts by verifying the EARLIEST lesson in T01 where each term is formally introduced in `vocabulary_introduced` or defined in lesson body.

## Methodology
Read all T01 lesson files (L01–L10). For each target term, identify the earliest lesson where it appears in the `meta.vocabulary_introduced` array OR is first defined in lesson prose.

## Findings

| Term | Introduced in lesson | File | Evidence |
|---|---|---|---|
| **make-ready** | T01.L05 | L05.osp-project-lifecycle.jsx | `meta.vocabulary_introduced` array, line 22. Flashcard 'T01-L05-FC-make-ready' at line 295. |
| **ROW** | T01.L08 | L08.key-acronyms-field-reference.jsx | `meta.vocabulary_introduced` array, line 35. Flashcard 'T01-L08-FC-row' at line 373. |
| **pole** | T01.L02 | L02.parts-of-a-pole.jsx | Lesson title + body used throughout; NOT in `meta.vocabulary_introduced` (implicitly assumed from L01 context). First explicit formal definition in L02 prose at line 223 ("Poles aren't all the same strength"). |
| **conduit** | T01.L02 | L02.parts-of-a-pole.jsx | `meta.vocabulary_introduced` array, line 32. Formal definition in lesson body at lines 186–194. |
| **attachment** | T01.L02 | L02.parts-of-a-pole.jsx | `meta.vocabulary_introduced` array, line 20. Flashcard 'T01-L02-FC-attachment' at line 285. |
| **OTMR** | T01.L05 | L05.osp-project-lifecycle.jsx | `meta.vocabulary_introduced` array, line 18. Listed as "One-Touch Make-Ready" in acronym table at line 67–70. |

## Cross-check: T04 lesson pointers

- **T04 lessons pointing to T01.L02 for "make-ready"** — INCORRECT. Make-ready first introduced in T01.L05 (learning objective + vocabulary).
- **T04 lessons pointing to T01.L05 for "make-ready"** — CORRECT.
- **T04 lessons pointing to T01.L02 for "ROW"** — INCORRECT. ROW first introduced in T01.L08.
- **T04 lessons pointing to T01.L08 for "ROW"** — CORRECT.
- **T04 lessons assuming "pole" from T01.L01** — PARTIALLY CORRECT. L01 references poles (lines 109–113) but doesn't include "pole" in `vocabulary_introduced`. T01.L02 is the formal introduction and should be the canonical source for pole-related pointers.

## Canonical DAG corrections for T04

1. Any T04 cross-reference to "make-ready" → source is **T01.L05**, not L02.
2. Any T04 cross-reference to "ROW" → source is **T01.L08**, not L02.
3. Any T04 cross-reference to "pole" → source is **T01.L02** (formal definition), not L01.
4. "Conduit" and "attachment" confirm T01.L02 as correct source (already in use).

=== T04 HAIKU T01 VOCAB INTRO END ===
