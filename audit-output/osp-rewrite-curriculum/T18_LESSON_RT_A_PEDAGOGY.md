# T18 Lessons RT-A — Pedagogy / UX Framing

**Auditor role:** Read-only Red Team A — Pedagogy / UX framing
**Scope:** T18 Safety & OSHA, lessons L01–L10
**Files audited:** `/osp-training/src/lessons/T18/L01` through `L10`
**Reference:** `audit-output/osp-rewrite-curriculum/T18_RESEARCH_BRIEF.md`, T02 locked template

---

## Stack Snapshot (≤80 words)

T18 is a well-constructed topic. Nine content lessons and one capstone cover the full OSHA / jobsite safety domain at the right depth. Schema conformance is strong across all 10 files. Flashcard coverage, tiered content, and book-vs-field gaps are consistently present. Two medium findings and one low finding prevent a GREEN verdict. One lesson is missing a second named interactive primitive; one lesson contains an internal meta-reference that could leak into rendered UI.

---

## Findings

| # | Sev | Lesson | Category | Issue (1 line) | Fix Shape | Confidence |
|---|---|---|---|---|---|---|
| F1 | MED | L09 | Primitive count | Only 1 named primitive (Quiz); requirement is ≥2 per lesson | Add Sortable (classify event: recordable / not-recordable / severe-reportable) or BranchingScenario | HIGH |
| F2 | MED | L06 | Voice / no-meta | `key_terms.flagger_certification.definition` contains `"Georgia DOT (Carter's AHJ)"` — internal meta-reference that breaks professional voice | Replace `"Carter's AHJ"` with `"Georgia DOT, for example,"` | HIGH |
| F3 | LOW | L07 | Pedagogical transparency | WorkedExample approximation formula `MAD = 1.9 + 0.022 × kV` labeled "approximate, for teaching purposes" only in a JSX comment — disclaimer not surfaced in rendered UI | Add a visible disclaimer line inside the WorkedExample rendered output, e.g., "Note: this is a simplified approximation. Always use the OSHA MAD Calculator for real work." | MEDIUM |

---

## Per-Finding Detail

### F1 — L09 Primitive Count (MED)

**Verified by reading:** `osp-training/src/lessons/T18/L09-incident-reporting-osha-300.jsx`, full file

The lesson imports `Quiz` and `Flashcard`. No other component from the 9 named primitives (Quiz, AnnotatedDiagram, WorkedExample, BranchingScenario, HotSpot, Sortable, SliderExploration, SideBySide, TimelineSequence) appears. The Flashcard is a required fixture — not counted as one of the ≥2 named primitives per the locked template.

The research brief (`T18_RESEARCH_BRIEF.md`) for L09 specifies only "Quiz (MC)" as the interactive primitive. However, the curriculum standard (locked in CLAUDE.md) requires ≥2 named primitives per content lesson. The brief's "Quiz only" spec was under-specified.

The incident-classification activity is a natural fit for a Sortable: drag events into three buckets (recordable / not-recordable / severe-reportable within 8/24 hours). Alternatively, a BranchingScenario ("You find a crew member with a laceration — does this go on the 300 log?") would meet the requirement and align with the lesson's decision-making focus.

This is a real gap by the locked template. The fix is additive (one new primitive block).

---

### F2 — L06 `key_terms` Meta-Reference (MED)

**Verified by reading:** `osp-training/src/lessons/T18/L06-traffic-control-flagging.jsx`, `meta.key_terms.flagger_certification.definition`

The `key_terms` object definition for `flagger_certification` reads:

> "Certification demonstrating a worker has passed a recognized flagger training course. Required in many states — Georgia DOT (Carter's AHJ) references ATSSA or ACCES certification."

"Carter's AHJ" is an internal meta-reference. If `key_terms.definition` renders to learners (e.g., via Flashcard card backs or a glossary component), "Carter's AHJ" would be visible to learners. The Flashcard card backs for `flagger_certification` in the lesson body correctly use "including Georgia" without the meta-reference. The problem is isolated to the `key_terms` named export definition field.

The no-AI-signals and professional-voice rules (CLAUDE.md §2, training voice rules 1 and 2) apply to all rendered content. The `key_terms` object is exported and potentially consumed by components beyond this lesson's JSX body.

**Fix:** In `key_terms.flagger_certification.definition`, replace `"Georgia DOT (Carter's AHJ)"` with `"Georgia DOT, for example,"` or simply `"Georgia DOT"`. Remove "Carter's AHJ" entirely.

---

### F3 — L07 WorkedExample Disclaimer Not Rendered (LOW)

**Verified by reading:** `osp-training/src/lessons/T18/L07-working-near-energized-conductors.jsx`, WorkedExample block

The WorkedExample component uses the approximate formula `MAD ≈ 1.9 + 0.022 × kV` with a JSX comment `// approximate, for teaching purposes`. The lesson body prose correctly tells learners: "Use the OSHA MAD Calculator — the formula above is a teaching approximation only."

The disclaimer exists in prose — this is not a content-accuracy failure. The risk is that a learner who reads the WorkedExample widget in isolation (e.g., from a linked reference, or if the component is later embedded in a field-tools page) sees the formula without the prose disclaimer. Making the approximation note part of the WorkedExample component's rendered output (a brief italicized note) removes that risk.

This is low priority because the lesson body currently carries the disclaimer correctly. The fix is a two-line addition to the WorkedExample `notes` field or `sanity_check` sentence.

---

## Per-Lesson Grade Matrix

| Lesson | Grade | Notes |
|---|---|---|
| L01 Hazard Awareness / Hierarchy of Controls | GREEN | Schema ✓, 2 primitives (Sortable + Quiz) ✓, 5 flashcards ✓, book-vs-field ✓, tiers ✓, In Plain English ✓ |
| L02 LOTO | GREEN | Schema ✓, 2 primitives (BranchingScenario + Quiz) ✓, 4 flashcards ✓, book-vs-field ✓ |
| L03 Confined Space Entry | GREEN | Schema ✓, 3 primitives (AnnotatedDiagram + BranchingScenario + Quiz) ✓, 5 flashcards ✓, book-vs-field (1910.268(o) vs 1910.146) ✓ |
| L04 Fall Protection | GREEN | Schema ✓, 3 primitives (AnnotatedDiagram + SideBySide + Quiz) ✓, 5 flashcards ✓, book-vs-field ✓ |
| L05 PPE | GREEN | Schema ✓, 3 primitives (AnnotatedDiagram + Sortable + Quiz) ✓, 5 flashcards ✓, book-vs-field ✓ |
| L06 Traffic Control / Flagging | YELLOW | F2 — meta-reference in key_terms definition. All other checks pass. |
| L07 Working Near Energized Conductors | GREEN | Schema ✓, 2 primitives (WorkedExample + Quiz) ✓, 3 flashcards ✓, book-vs-field ✓. F3 LOW — approximation disclaimer not in rendered UI. |
| L08 Hazardous Materials | GREEN | Schema ✓, 2 primitives (HotSpot + Quiz) ✓, 4 flashcards (3 vocab + 1 bonus SDS-Section-8) ✓, book-vs-field ✓ |
| L09 Incident Reporting / OSHA 300 | YELLOW | F1 — only 1 named primitive. All other checks pass. |
| L10 Capstone Quiz | GREEN | 22 MC + 2 BranchingScenarios covering all 9 lessons ✓, `vocabulary_introduced: []` ✓, no key_terms ✓, no Flashcard ✓ |

---

## Negative Findings (Confirmed Clean)

The following categories were checked and confirmed free of issues across all 10 lessons:

- **Schema conformance:** All 10 files export `meta` (named) and a React component (default). All required `meta` fields present: `id`, `course_id`, `title`, `order`, `lesson_type`, `prerequisites`, `vocabulary_introduced`, `key_terms` (where applicable), `vocabulary_assumed`, `estimated_minutes`.
- **Flashcard-per-vocab_introduced:** L01–L09 each render a `<Flashcard>` component whose cards match every term in `vocabulary_introduced`. No term is missing a card. No card references a term not in `vocabulary_introduced` (bonus cards L08 and L09 are additive, not contradictory).
- **Foundations / working / advanced tiers:** All 9 content lessons contain `data-tier="foundations"`, `data-tier="working"`, and `data-tier="advanced"` sections. Capstone (L10) uses `foundations` only — appropriate for quiz content.
- **"In Plain English" openers:** All 9 content lessons open with a plain-English paragraph before any technical content. Field-crew audience targeting appropriate throughout.
- **Book-vs-field gaps:** All 9 content lessons contain at least one explicitly marked book-vs-field comparison. Quality ranges from excellent (L03 — 1910.268(o) vs 1910.146 telecom exception) to adequate (L07 — "comm space" informal clearance rule vs actual MAD requirements).
- **Voice / no AI signals / no first-person "I":** No "AI", "Claude", "generated", "I think", or equivalent appears in any lesson body outside character dialogue in BranchingScenario prompts (where first-person is appropriate for the scenario character).
- **Prerequisite DAG compliance:** T18 lessons use only T01 vocabulary without re-introduction. All new safety terms first introduced in T18. No downstream lesson introduces a term used earlier without prior context.
- **Capstone coverage:** L10 covers every content lesson (L01–L09) with ≥2 questions each. 22 MC questions verified: L01=3, L02=3, L03=3, L04=2, L05=3, L06=2, L07=2, L08=2, L09=2 = 22 total.
- **Capstone correctness (L10):** `vocabulary_introduced: []` correct. No `key_terms` field — correct for capstone. No Flashcard rendered — correct for capstone.
- **Import hygiene:** All imported components used in JSX render. No dead imports found.
- **No cross-lesson vocabulary re-introduction:** No term defined in L01 is re-defined in L02–L09 (terms appear in `vocabulary_assumed` correctly when carried forward).

---

## Coverage Gaps

- **Quiz answer correctness** not verified (pedagogy/UX framing; technical accuracy RT-B should cover this).
- **OSHA citation accuracy** (specific 29 CFR section numbers) not cross-checked against primary sources — left for technical accuracy framing.
- **Rendered UI visual fidelity** not verified (no browser run performed — read-only static analysis only).
- **BranchingScenario FSM logic completeness** (all branches lead to terminal states) not exhaustively traced — spot-checked in L02 and L03, appeared correct.

---

## Verdict: **YELLOW**

2 MED findings, 1 LOW finding. Core structure is solid. Fixes are targeted and additive — no lesson requires a structural rebuild. Recommend fix-agent addresses F1 and F2 before topic is declared complete. F3 is advisory.

=== T18 RT-A END ===
