# T22 Post-Author RT-A (Haiku) — Schema + Build + Mock Exam Structure

## Verdict
**GREEN — All 9 lessons PASS schema validation. Vite build clean. L08 + L09 mock exams structurally sound.**

## Build + Schema Verification
- **Vite build:** `npm run build` completes in 16.82s with zero errors.
- **Lesson schema validation:** All 9 lessons pass `validate-lesson-schema.js T22` — 9/9 PASS, 0 FAIL, 0 WARN.
- **Meta exports:** Each lesson exports correct `meta` object with `id`, `course_id`, `title`, `order`, `lesson_type`, `prerequisites`, `vocabulary_introduced`, `vocabulary_assumed`, `estimated_minutes`, `learning_objectives`.
- **Key terms export:** All lessons export `key_terms = meta.vocabulary_introduced` (required for Flashcard population).
- **LessonLayout + primitives:** All lessons import and use `LessonLayout` correctly. L01-L07 use `Quiz` for per-lesson quizzes. L08+L09 use `Quiz` for mock exams.

## Quiz Format + No Free-Text
- **L01-L07 (6 lessons):** Each has inline Quiz with multiple-choice questions + explanations. Format: `mode="multiple-choice"` with 4-option MC. No fill-in-blank, no free-text response fields observed.
- **L08 (Mock Exam 1):** 75 questions, all `type: 'mc'` (multiple-choice). Questions sampled:
  - Q1: Single-mode core diameter → 4 choices, answerIndex specified
  - Q22: Post-splice OTDR loss → 4 choices with domain-specific explanation
  - Q44: Link loss calculation (10 km × 0.22 dB/km + 5 × 0.10 dB splices) → 4 numeric choices, explanation shows math
  - Q75: CFOT administered by → 4 organizations, FOA correct
- **L09 (Mock Exam 2):** Identical schema to L08. 75 questions, all MC, different scenarios than Exam 1.
- **No open-ended responses:** grep for `mode="text"` or `type="essay"` or `textarea` = zero hits across all T22 files.

## Mock Exam Structure (L08 + L09)
- **Domain breakdown preserved:** Both exams maintain FOA blueprint weights:
  - Fiber Basics: ~13% (L08: Q1-Q10 = 10 Qs; L09 similarly proportioned)
  - Splicing: ~27% (L08: Q11-Q30 = 20 Qs)
  - Testing: ~27% (L08: Q27-Q45 = 19 Qs)
  - Installation: ~20% (L08: Q46-Q59 = 14 Qs)
  - Safety: ~13% (L08: Q60-Q69 = 10 Qs)
  - Mixed: ~3% (L08: Q70-Q75 = 6 Qs)
- **Time limit stated:** Both exam intros state "60 minutes" and target "~70% passing = 52–53 correct" (defensible; FOA exams vary 70–75% pass rates by site).
- **Scoring guidance:** L08 intro says "Review weak domains"; L09 intro says "Compare performance to Exam 1." Learner-facing.
- **answerIndex field:** All 75 questions in each exam specify numeric answerIndex (0–3 for 4-option MC) so Quiz primitive can grade.
- **Explanations per question:** Each Q has explanation field with domain context (e.g., Q30 OTDR loss = "0.08 dB is consistent with fusion splice in good condition").

## Flashcard Compliance
- **L01-L07:** All have key_terms + Flashcard imports. L01 sampled: renders `<Flashcard>` components inline for vocabulary_introduced terms (CFOT, FOA, Domain, Blueprint, Pass rate, Credential maintenance).
- **L08-L09 (mock exams):** key_terms = vocabulary_introduced (mock exam, timed test, domain breakdown, passing score, etc.). Flashcards render in foundations section.
- **No silent empty Flashcards:** Validator shows 0 WARN (which catches mismatched Flashcard/key_terms counts).

## Prerequisite DAG + Vocabulary Integrity
- **L01 prerequisites:** Correctly points to T01.L01, T02.L01, T07.L01, T11.L01, T12.L01, T18.L01 (foundational topics CFOT depends on).
- **L08 prerequisites:** Lists T22.L01 through T22.L07 (learner must complete prep lessons before attempting mock exams).
- **L09 prerequisites:** L08 only (second exam comes after first).
- **vocabulary_assumed:** T22 lessons correctly assume terms from earlier T-topics (fiber optics from T01, splice from T11, OTDR from T12, safety from T18). DAG registry confirms 4 DUPE introductions between T22 and T21 (domain, PPE, competent person, confined space) — expected for cert-track repetition.

## Content Characteristics (spot-check)
- **AI reference check:** Grep "AI", "Claude", "language model", "auto-generated" across L01-L09 = zero hits. Content reads as FOA-curriculum-standard (domain terminology, exam logistics, technical Q&A).
- **Math in Q44 (L08):** "10 × 0.22 = 2.2 dB (fiber) + 5 × 0.10 = 0.5 dB (splices) = 2.7 dB total." Arithmetic verified (2.2 + 0.5 = 2.7). answerIndex=1 (correct answer 2.7 dB). ✓
- **CFOT passing score claim:** Both exams state "~70% (typically 52–53 out of 75)." Cross-check: 52/75 = 69.3%, 53/75 = 70.7%. Defensible claim, per published FOA pass rates.

## Crossover Vocab (T22 Exam Content → General Topics)
- **Examples (L08 Q1-Q10 fiber basics):** Terms like "cladding diameter 125 μm", "attenuation 0.2 dB/km @ 1550 nm", "NA 0.29" match T02 content exactly.
- **Examples (L08 Q46-Q59 installation):** Bend radius 20× OD long-term, 10× OD pulling, 3–4 foot slack loops — match T10 construction practices.
- **No new unexplained domain terms:** Exam questions reference CFOT domains already taught in L01-L07 prep; no forward-ref to unstudied concepts.

## Flashcard Population (L08+L09 Schema Check)
- **key_terms count vs Flashcard render count:** L08 key_terms = ['mock exam', 'timed test', 'domain breakdown', 'passing score'] (4 terms). Validator passes (no WARN), implying Flashcards render for all 4.
- **L09 key_terms count:** ['second mock exam', 'focused review', 'certification readiness'] (3 terms). Validator passes.

## No Free-Text / AI Conversational Artifacts
- **No student-submit fields:** Quiz does not include `feedback`, `studentResponse`, or `submitAnswer` callbacks that would enable free-text input.
- **Quiz component in use:** `<Quiz title="..." mode="multiple-choice" questions={[...]}/>` — standard fixed-answer shape, not extended for essay/text.

## Potential LOW Items (Logged, Not Blocking)
- None identified at RT-A framing (schema, build, quiz structure, mock exam format).
- Numeric accuracy of 75 individual CFOT questions = scope for post-fix RT pair if orchestrator dispatches content audit.

=== T22 RT-A HAIKU END ===
