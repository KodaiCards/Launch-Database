=== T04 LESSONS RT-A (PEDAGOGY + DAG + TEMPLATE) ===

Scope: L01–L10, HEAD 7602966
Framing: Template conformance + DAG/prerequisite discipline + Pitch/book-vs-field
Auditor: Read-only RT-A. No code modifications.

VERDICT: YELLOW
Reason: 2 MED findings (RTK GNSS DAG gap; key_terms placement inconsistency L06-L09), 2 LOW findings. All fixable in a single patch pass. No RED blockers. Content quality and pitch calibration are strong throughout.

---

## Framing 1 — Template Conformance (T02 locked shape)

T02 template requirements:
- meta export with `id`, `course_id`, `title`, `order`, `prerequisites`, `learning_objectives`, `estimated_minutes`, `vocabulary_introduced`, `vocabulary_assumed`, `key_terms` (inside meta)
- Foundation / Working / Advanced tiers
- ≥2 distinct primitives + Quiz inline
- Flashcard rendered inline in lesson body from `key_terms`
- lesson_type: 'standard' (or 'capstone-quiz' for L10)

| Lesson | key_terms in meta? | ≥2 primitives + Quiz | F/W/A tiers | Flashcard inline | lesson_type | PASS/FAIL |
|--------|-------------------|----------------------|-------------|------------------|-------------|-----------|
| L01    | ✓ YES             | BranchingScenario + HotSpot + Quiz ✓ | ✓ | ✓ | standard | PASS |
| L02    | ✓ YES             | AnnotatedDiagram + WorkedExample + Quiz ✓ | ✓ | ✓ | standard | PASS* |
| L03    | ✓ YES             | AnnotatedDiagram + Sortable + Quiz ✓ | ✓ | ✓ | standard | PASS |
| L04    | ✓ YES             | WorkedExample + AnnotatedDiagram + Quiz ✓ | ✓ | ✓ | standard | PASS |
| L05    | ✓ YES             | BranchingScenario + Sortable + Quiz ✓ | ✓ | ✓ | standard | PASS |
| L06    | ✗ SEPARATE EXPORT | AnnotatedDiagram + SideBySide + Quiz ✓ | ✓ | ✓ (via key_terms.map) | standard | MED |
| L07    | ✗ SEPARATE EXPORT | BranchingScenario + Quiz ✓ (2 total — minimum) | ✓ | ✓ (via key_terms.map) | standard | MED |
| L08    | ✗ SEPARATE EXPORT | BranchingScenario + Sortable + Quiz ✓ | ✓ | ✓ (via key_terms.map) | standard | MED |
| L09    | ✗ SEPARATE EXPORT | AnnotatedDiagram + Sortable + Quiz ✓ | ✓ | ✓ (via key_terms.map) | standard | MED |
| L10    | key_terms omitted (correct for capstone) | 22 MC + 2 BranchingScenarios ✓ | foundations-only ✓ | None ✓ (correct for capstone) | capstone-quiz | PASS |

*L02: see MED Finding #1 (RTK GNSS absent from vocabulary_introduced)

### MED-1: key_terms placement inconsistency in L06–L09

T02 locked template embeds `key_terms` inside the `meta` object (L01–L05 follow this). L06–L09 export `key_terms` as a separate top-level named export: `export const key_terms = [...]`. Functionally equivalent — Flashcard renders correctly in both cases — but violates template conformance. Authors for L06-L09 diverged from the established pattern without documented justification.

Fix: move key_terms array inside the meta export for L06, L07, L08, L09. One-line restructure per file. Default export (the React component) unchanged.

Verified by reading:
- L06: `osp-training/src/lessons/T04/L06-kmz-shapefile-pdf-deliverables.jsx` — `export const key_terms = [...]` at top-level, separate from `export const meta = {...}`
- L07: `osp-training/src/lessons/T04/L07-47-cfr-32-record-keeping.jsx` — same pattern
- L08: `osp-training/src/lessons/T04/L08-handoff-to-design.jsx` — same pattern
- L09: `osp-training/src/lessons/T04/L09-rus-pre-engineering.jsx` — same pattern

---

## Framing 2 — DAG / Vocabulary / Forward-References

### MED-2: RTK GNSS absent from L02 vocabulary_introduced — DAG gap

L02 (`L02-drone-lidar-aerial-survey.jsx`) teaches RTK GNSS extensively:
- Dedicated "RTK GNSS" subsection in the Working tier
- Full acronym expansion (Real-Time Kinematic Global Navigation Satellite System)
- RTK correction pipeline explained (base station → rover → centimeter-level accuracy)
- RTK listed in the lesson's acronym glossary table

L03 (`L03-gis-landbase-coordinate-systems.jsx`) lists `{ term: 'RTK GNSS', source_lesson_id: 'T04.L02' }` in its `vocabulary_assumed` array — correctly treating L02 as the introducing lesson.

L02's `vocabulary_introduced` array: `['drone', 'LiDAR', 'point cloud', 'planimetric', 'GSD']`

**RTK GNSS is absent from L02's vocabulary_introduced despite being taught there.** The DAG metadata is broken: L03 assumes the term from L02, but L02 doesn't formally register it. If the curriculum engine gates lessons based on vocabulary_introduced, RTK GNSS would appear ungated.

Fix: add `'RTK GNSS'` to L02's `vocabulary_introduced` array.

Verified by reading:
- `osp-training/src/lessons/T04/L02-drone-lidar-aerial-survey.jsx` — vocabulary_introduced array confirmed, RTK GNSS confirmed taught in body
- `osp-training/src/lessons/T04/L03-gis-landbase-coordinate-systems.jsx` — vocabulary_assumed entry confirmed

### Forward-reference check (L01 signposts to T09/T10)

L01 contains two forward-references:
1. "Environmental permitting (T09) goes deeper on these permits"
2. "(T10.L01 covers Call 811 in detail)"

These are signpost phrases only — they do not teach T09/T10 content or use T09/T10 terms. No vocabulary from T09/T10 is introduced or assumed. Borderline permissible; signposts help learners build mental maps of the curriculum. However, the DAG prerequisite invariant could be read strictly as "nothing taught before its introduction lesson" — if T09/T10 aren't accessible yet, naming them may create confusion.

LOW-3 finding: recommend standardizing signpost language to avoid lesson-ID references (e.g., "covered in the Environmental Permitting topic" rather than "(T09)") until the splash page makes topic adjacency visible to the learner.

### All other vocabulary_assumed terms verified

Checked all vocabulary_assumed entries across L02–L09. Every term traces to a prior lesson or an earlier T04 lesson. No orphaned assumptions found beyond the RTK GNSS gap above.

Checked all vocabulary_introduced entries for internal consistency — every term introduced is taught in that lesson's prose. No term listed without body coverage.

---

## Framing 3 — Pitch + Book-vs-Field + AI References

### Pitch calibration (dummies-first → advanced)

All 9 standard lessons open with plain-English framing before technical depth. Checked L01, L04, L07, L09 in detail:
- L01: "Before a single piece of cable goes in the ground, someone has to walk the route" — strong field-crew framing
- L04: "You are the person gathering facts. The engineer is the person applying the rules" — excellent role clarity
- L07: "The government doesn't forget" — memorable hook, immediately concrete
- L09: "RUS won't fund a project if the paperwork package is incomplete" — stakes-first framing

Field-experienced-but-no-engineering-training audience well-served. Math steps shown in full where present (GSD formula in L02, pole calculation in L04). Analogies present (L03 datum mismatch = "speaking slightly different dialects").

### Book-vs-field compliance (Brief Guardrail #5)

Brief requires explicit book-vs-field treatment in L02, L03, L04, L05, L06, L07, L08. Checked each:
- L02 ✓: FAA Part 107 book rule vs. LAANC auto-approval field reality
- L03 ✓: NAD83 (book/GIS standard) vs. NAD27 (legacy field instruments)
- L04 ✓: NESC loads applied by design engineer vs. field crew measures-and-flags only
- L05 ✓: Weighted scoring matrix (book) vs. PM intuition (field)
- L06 ✓: PDF/A archival standard (book) vs. standard PDF emailed (field)
- L07 ✓: USOA plant account coding (book) vs. lumping costs (field)
- L08 ✓: Formal transmittal checklist (book) vs. informal email handoff (field)

All 7 required lessons contain explicit book-vs-field treatment. PASS.

### NESC rule number check (Brief Guardrail #1)

Checked all 10 lessons for NESC Rule 232, Rule 235, Rule 250, or any "NESC Rule [number]" pattern.

LOW-4: L04 mentions "NESC loading district" and "sag/tension tables" in the book-vs-field box — in the context of what the *design engineer* applies, not the field crew. No rule numbers cited. This is a conceptual reference to NESC as a body of standards, not a rule-specific citation. Per Guardrail #1 ("T04 teaches measure-and-flag; T05 teaches rule application"), rule-number citations are prohibited but conceptual references are borderline. Technically compliant; worth noting for author awareness.

All lessons: zero NESC Rule [number] citations found. PASS.

### AI / Claude / generated references

Checked all 10 lessons for any mention of "AI", "Claude", "language model", "generated", "auto-generated". None found. PASS.

### Record retention language (L07)

L07 uses `[confirm — FCC 47 CFR Part 42 retention schedule; RUS loan-life may extend]` per the brief's guardrail. Correct use of the `[confirm edition]` / `[confirm X]` pattern from agent-protocol.md. PASS.

---

## Negative Findings (checked + confirmed clean)

- NESC Rule numbers in lesson content: NONE found across all 10 lessons ✓
- AI/Claude/generated self-references: NONE found ✓
- Flashcard missing from standard lessons: NONE — all 9 standard lessons render Flashcard inline ✓
- L10 capstone Flashcard absent: CORRECT — capstone is quiz-only, no Flashcard ✓
- Foundation/Working/Advanced tiers in standard lessons: ALL present ✓
- Capstone (L10) foundations-only: CORRECT ✓
- Math correctness (GSD formula): 3.76 µm × 100 m / 24 mm = 15.67 mm ✓; 3.76 × 80 / 24 = 12.53 mm ✓; L10 Q GSD 3.76 × 120 / 24 = 18.8 mm ✓
- UTM Zone 17 for Georgia (longitude −83° → floor((−83+180)/6)+1 = floor(16.17)+1 = 17) ✓
- Vocabulary_assumed terms orphaned (no prior introduction): NONE beyond MED-2 ✓
- lesson_type = 'capstone-quiz' on L10: ✓
- vocabulary_introduced: [] on L10: ✓
- vocabulary_assumed on L10 lists all 41 T04 terms from L01–L09: ✓ (verified count)
- L07 primitive count (2 total — BranchingScenario + Quiz): meets minimum ✓

---

## Coverage Gaps

- Did not verify: cross-topic DAG (whether any T04 vocabulary_assumed term lacks introduction in T01–T03 lessons). T04 Brief lists assumed terms from T01, T02, T03 — assuming those topics' vocabulary_introduced arrays are correct (verified in their own RT passes).
- Did not verify: actual runtime rendering (Flashcard component, Quiz component, BranchingScenario state machine) — this is a structural/content audit, not a runtime test.
- Did not verify: L09 RUS construction unit codes against actual RUS Cost Estimation Tool values — math/citation accuracy is RT-B scope.
- Did not verify: 47 CFR Part 32 USOA account codes against actual FCC rules — RT-B scope.

---

## Findings Summary

| # | Severity | Finding | Affected Lessons | Fix |
|---|----------|---------|-----------------|-----|
| MED-1 | MED | `key_terms` in separate export, not inside meta (T02 template deviation) | L06, L07, L08, L09 | Move key_terms array inside meta export in each file |
| MED-2 | MED | RTK GNSS taught in L02 body but absent from L02 vocabulary_introduced — DAG gap | L02 | Add 'RTK GNSS' to vocabulary_introduced |
| LOW-3 | LOW | L01 forward-pointer uses lesson IDs (T09, T10) — may confuse learners before those topics accessible | L01 | Change to topic-name signposts without IDs |
| LOW-4 | LOW | L04 mentions "NESC loading district" in design-engineer context — conceptual ref, no rule numbers | L04 | Borderline compliant; author awareness note only |

Patch recommendation: single fix-agent, 4 files (L02 vocabulary_introduced + L06/L07/L08/L09 key_terms relocation + L01 signpost wording). ~15 min. Post-patch RT-A re-verify on the 5 changed files only.

---

git status:
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

git diff --stat:
(empty — no changes; this is a read-only audit)

=== T04 LESSONS RT-A END ===
