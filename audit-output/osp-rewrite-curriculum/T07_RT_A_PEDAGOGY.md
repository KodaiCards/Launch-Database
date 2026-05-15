# T07 Lessons RT-A — Pedagogy + DAG + Template Compliance
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

Nine regular lessons (L01–L09) + capstone (L10) reviewed against T02 locked template, T07 brief, and CLAUDE.md §2. Tier markers, flashcards, and prerequisite DAG are structurally clean across all 10 files. Two findings require fixes: (1) L10 capstone's branching scenario routes the learner down a path labeled "correct" that opens with a wrong assertion before self-correcting — pedagogically confusing and rewards bad reasoning; (2) L04 lacks an explicit Book-vs-Field section for the OSHA climbing/fall-protection divergence the brief explicitly mandates.

---

## Findings table

| # | Severity | Framing-axis | Lesson | Line range | Issue | Fix shape |
|---|---|---|---|---|---|---|
| F1 | HIGH | Pedagogy / scenario logic | L10 capstone | L329–L354 | A1 BranchingScenario `a1` state routes learner selecting "Flag: transfer required" (the `a1_correct` branch) into a state that opens with "Correct" but then mid-paragraph declares "Actually — re-check… this is actually OK. No conflict at A1." The choice labeled as correct asserts the wrong conclusion. The `a1_wrong` branch (choice 2: "No conflict — telecom is above the fiber, so clearance is fine") and the `a1_correct` branch both arrive at "no conflict," but only via choice 2 does the learner assert the right conclusion upfront. A learner who reasons correctly ("telecom is above, so clearance check = 27.2 − 26.0 = 1.2 ft > 1.0 ft, therefore no conflict") is led to the `a1_wrong` state, which gently tells them they're right. The learner who asserts "transfer required" without doing the math is routed to `a1_correct`. This inverts the incentive structure and will confuse learners who reason through the math correctly. | Redesign `a1` state: remove the "transfer required" false start from choice 1. Correct choice 1 should assert "1.2 ft clearance above design fiber; minimum 1.0 ft required; clearance checks PASS — no conflict at A1." Route that to a clean `a1_clear` state. The existing `a1_wrong` state text is mostly accurate — repurpose it as the feedback for a learner who says "conflict!" without calculating. The mid-paragraph self-correction in `a1_correct` reads as an authoring error; eliminate it by getting the scenario right first. |
| F2 | MEDIUM | Pedagogy / book-vs-field | L04 | Full lesson body | T07 brief Section 5 field-practice divergences explicitly states: "T07.L04 teaches the OSHA requirement [1910.268(g)(1) fall protection above 10 ft] and the field-practice mitigation (ground-level measurement methods preferred; tie-off always if climbing)." L04 cites OSHA 1910.268(g)(1) only in a quiz answer explanation (line 454) — buried in an answer rationale, not taught as lesson content. There is no labeled "Book vs. Field" block in L04 (every other lesson in the set has at least one). The other seven lessons all have visible `Book vs. Field` callout blocks; L04 is the outlier. | Add a `Book vs. Field — OSHA 1910.268 and Climbing Safety` callout block in the L04 working or advanced section: Book: OSHA 1910.268(g)(1) requires 100% fall protection above 10 feet on poles. Field: experienced RUS stakers default to ground-level laser measurement for all routine measurements, eliminating climbing entirely. When climbing is unavoidable (blocked laser line-of-sight, physical measurement needed), full tie-off is universal practice — it is not the exception. The risk of confusing the two: treating ground-level laser as "optional" and assuming you can climb briefly without tie-off exposes the crew to OSHA citation and fall risk. |
| F3 | LOW | Template / terminology | L07 | L28–L44 | T07 brief Section 6 locks 7 net-new T07 terms including **"centerline stake"** (brief's exact wording). L07 introduces **"survey stake"** for the identical concept. Both `vocabulary_introduced` and `key_terms` in L07 use "survey stake"; "centerline stake" appears in L07 body prose only as a cross-reference to an already-placed survey stake. The L10 capstone `vocabulary_assumed` correctly references `survey stake` from `T07.L07`, so internal DAG is consistent — the mismatch is only between the brief's locked term and the author's chosen term. No downstream DAG violation, but the brief's locked vocabulary is not honored. | Either (a) rename `survey stake` → `centerline stake` in L07 `vocabulary_introduced`, `key_terms`, and `vocabulary_assumed` cross-refs in L08–L10, or (b) add `centerline stake` as a synonym in the `survey stake` definition: "also called a centerline stake when marking an underground route centerline." Option (b) is lower-effort and preserves the author's more field-accurate term while satisfying the brief. |

---

## What I checked + confirmed clean

- **Quiz field-name grep returns 0 violations:** YES. `grep -n "question:\|options:\|correct:\|rationale:" *.jsx` returned 10 matches — all are BranchingScenario state-key names ending in `_correct` (e.g., `replacement_correct:`, `lean_correct:`, `a1_correct:`, `bore_correct:`, `pull_pit_correct:`). None are Quiz primitive field-name violations. All Quiz components use correct field names: `prompt:`, `choices:`, `answerIndex:`, `explanation:`.

- **Tier markers in L01–L09 (L10 capstone exempt):** YES. Every regular lesson has exactly 3 `data-tier` attributes (`foundations`, `working`, `advanced`). Confirmed by grep: 3 per file across all 9 regular lessons.

- **vocabulary_introduced flashcards present:** YES for all 9 regular lessons. Each lesson has a `<Flashcard>` block with one card per `vocabulary_introduced` term, definitions verbatim from lesson prose.
  - L01: 5 terms, 5 flashcards ✓
  - L02: 6 terms, 6 flashcards ✓
  - L03: 5 terms, 5 flashcards ✓
  - L04: 5 terms, 5 flashcards ✓
  - L05: 5 terms, 5 flashcards ✓
  - L06: 5 terms, 5 flashcards ✓ (uses `Object.entries(vocabulary_introduced)` map pattern — structurally equivalent)
  - L07: 6 terms, 6 flashcards ✓ (same map pattern)
  - L08: 5 terms, 5 flashcards ✓ (same map pattern)
  - L09: 5 terms, 5 flashcards ✓ (same map pattern)

- **vocabulary_assumed cross-refs all valid:** YES. Every `vocabulary_assumed` entry points to a prior-taught lesson (T01, T04, T05, T06, T18, or earlier T07 lesson). No forward references to T08+, T09+, T10+, T13+ in `vocabulary_assumed` across any lesson — confirmed by grep returning 0 results for `source_lesson_id: 'T08|T09|T10|T11|T12|T13'`.

- **L10 capstone structure mirrors T02 L12:** PARTIAL. L10 has 15 MC questions + 1 BranchingScenario, no flashcards (vocabulary_introduced: [] per spec), and a tier sections introduction. This matches the brief's capstone scope. However, F1 above identifies a logic error in the BranchingScenario at A1 that needs fixing before the capstone is sound.

- **No AI-signal phrases:** YES. Zero hits for "AI", "Claude", "language model", "generated", "ChatGPT" across all 10 lesson files.

- **Book vs. Field present where applicable:**
  - L01: YES — `Book vs. Field` block at line 273
  - L02: YES — `Book vs. Field` block at line 284
  - L03: YES — `Book vs. Field — GPS Accuracy` block at line 296
  - L04: **NO** — OSHA/climbing divergence is brief-required but missing as lesson content (F2 above)
  - L05: YES — `Book vs. Field — Form 740 vs. Digital Tools` at line 329
  - L06: YES — `Book vs. Field — Who Pays for Make-Ready` at line 280
  - L07: YES — `Book vs. Field — Bore Pit Location Accuracy` at line 362
  - L08: YES — `Book vs. Field — GPS Accuracy for Staking` at line 335
  - L09: YES — `Book vs. Field — Catch Rate Reality` at line 266

- **Cross-author scope check (Author A: L01–L05; Author B: L06–L10):**
  - Author B consistently references Author A's terms via `vocabulary_assumed`. L06 references `staking sheet` (T07.L05), `RUS Form 740` (T07.L05), `attachment height measurement` (T07.L04). L07 references `staker` (T07.L01), `stationing` (T07.L02), `PI` (T07.L02). L08 references `RUS Form 740` (T07.L05), `SCID` (T07.L03), `make-ready flag` (T07.L06). L09 references `staking sheet` (T07.L05), `make-ready flag` (T07.L06), `photo-attach` (T07.L08). All cross-refs valid.

- **Brief-required interactivity primitives per lesson:** CLEAN.
  - L01: Quiz + AnnotatedDiagram ✓
  - L02: AnnotatedDiagram + BranchingScenario ✓
  - L03: AnnotatedDiagram + BranchingScenario ✓
  - L04: WorkedExample + AnnotatedDiagram ✓
  - L05: Quiz + WorkedExample ✓
  - L06: BranchingScenario ✓
  - L07: AnnotatedDiagram + BranchingScenario ✓
  - L08: AnnotatedDiagram + Quiz ✓ (brief does not require BranchingScenario for L08)
  - L09: BranchingScenario ✓

- **Stupid-simple pitch — formula exposition:** WorkedExample in L04 has all 5 steps with formulas, substitutions, results, and a sanity-check sentence. L05 WorkedExample shows step-by-step Form 740 completion. Math discipline is solid where formulas appear.

---

## Coverage gaps

- Did not independently verify every `[confirm edition]` NESC citation by accessing paywalled NESC C2-2023 — that is RT-B (technical accuracy framing)'s domain.
- Did not verify RUS Form 740 field layout matches actual USDA form structure — TR-B's domain.
- Did not check `47 CFR 1.1411` OTMR content accuracy in L06 — RT-B's domain.
- L10 capstone questions beyond A1 (A2, bore pit, pull pit sections) reviewed for logic but not independently re-derived from NESC Rule 235 math — flagged for RT-B to verify the 0.7 ft vs. 1.0 ft clearance calculation in A2.

=== T07 RT-A REPORT END ===
