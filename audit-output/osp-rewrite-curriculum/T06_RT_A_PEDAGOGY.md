# T06 Lessons RT-A — Pedagogy + DAG + Template Compliance
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

T06 (12 lessons) is structurally sound with three-tier markers, flashcards, interactivity primitives, and a well-structured capstone. Two HIGH findings require fixes before sign-off: (1) L01–L06 regular quiz questions use incompatible field names (`question`/`options`/`correct`) that the Quiz component does not read — quizzes will silently fail to render in those lessons; (2) L12 capstone scenario claims 24-inch minimum cover per RUS 1751F-635 for residential, directly contradicting L02's teaching that the RUS floor is 36 inches. Additional LOW findings documented below.

---

## Findings table

| # | Severity | Framing-axis | Lesson | Line range | Issue (1 line) | Fix shape (1 line) |
|---|---|---|---|---|---|---|
| 1 | HIGH | Template-compliance / rendering | L01, L02, L03, L04, L05, L06 | L01:142–212, L02:135–211, L03:148–210, L04:265–332, L05:172–254, L06:172–239 | Quiz questions use `question:` / `options:` / `correct:` fields; Quiz component only reads `prompt:` / `choices:` / `answerIndex:` — quizzes silently fail to render question text and answer options in all six lessons | Rename `question` → `prompt`, `options` → `choices`, `correct` → `answerIndex` in all quiz question objects in L01–L06; confirm via `grep -n "q\.prompt\|q\.choices\|q\.answerIndex" Quiz.jsx` which shows these are the only fields used |
| 2 | HIGH | DAG consistency / content accuracy | L12 | L12:162 | Capstone branching scenario text states "Open-cut trench at 24-inch minimum cover (RUS 1751F-635 §6 for residential) is appropriate" — L02 explicitly teaches RUS 1751F-635 floor as 36 inches for all RUS-funded projects in general soil; 24-inch is not the RUS residential floor | Fix scenario outcome text to state 36-inch RUS floor; note AHJ may require more |
| 3 | LOW | Schema consistency | L07, L08, L09, L10, L11 | L07:36–57, L08:36–57, L09:37–55, L10:35–52, L11:39–57 | `vocabulary_introduced` exported as an object `{term: definition}` map instead of the array format used by L01–L06 and required by the lesson schema; `key_terms` is derived from `Object.entries(vocabulary_introduced)` which works but diverges from the schema template | Align L07–L11 to use the array + `key_terms` pattern established in L01–L06 and the lesson schema: add explicit `key_terms` array to `meta` and export `vocabulary_introduced = meta.vocabulary_introduced` |
| 4 | LOW | Template compliance | L12 | L12:64 | Capstone (L12) has one `data-tier="foundations"` section; T02 L12 template also uses one section — this is acceptable. However L12 `vocabulary_introduced: []` is correct. Confirm: L12 does not export flashcards — no Flashcard component. This is correct per capstone format (T02 L12 also has no flashcards). No action needed — documented as clean. | No fix needed |
| 5 | LOW | Math accuracy | L12 | L12:300 | Q06 rationale states conduit area = 3.3605 in² and fill = 36.5%; correct values are 3.3556 in² and 36.6% (rounding discrepancy in stated intermediate); final answer A is still correct but rationale arithmetic is slightly off | Fix rationale to show: (π × 1.0335²) = 3.3556 in², fill = 36.6% |
| 6 | LOW | Pitch compliance / terminology | L05 | L05:444 | Lesson prose states "T18 (Safety and OSHA) is a prerequisite to T06 in the teaching order" — this is partially misleading; T18 is topologically before T06 but is not a formal DAG prerequisite per ARCH.md (T06 prereqs: T01, T03, T04); learner may be confused about why T18 is referenced if they haven't reached a lesson that explains the teaching order | Rephrase to "You should have completed T18 (Safety and OSHA) before working with confined spaces — it covers confined space entry permits, gas monitoring, and PPE requirements in detail." |

---

## What I checked + confirmed clean

- **Tier markers present in all 11 regular lessons (L12 capstone exempt):** YES — all L01–L11 contain `data-tier="foundations"`, `data-tier="working"`, `data-tier="advanced"` sections. L04 confirmed at lines 359/420/511. L07 at 64/153/315. L09 at 62/155/303. L10 at 60/150/278. L11 at 66/120/243.
- **vocabulary_introduced flashcards present for all terms:**
  - L01: 7 terms in `key_terms`, all rendered via `Flashcard` at lines 279–286. ✓
  - L02: 7 terms in `key_terms`, flashcards rendered. ✓
  - L03: 7 terms in `key_terms`, AnnotatedDiagram + flashcards rendered. ✓
  - L04: 7 terms in `key_terms`, flashcards rendered at lines 408–416. ✓
  - L05: 8 terms in `key_terms`, flashcards rendered. ✓
  - L06: 7 terms in `key_terms`, flashcards rendered. ✓
  - L07: `key_terms` derived from `vocabulary_introduced` object (6 terms), Flashcard imported + rendered at line 115. ✓
  - L08: `key_terms` derived from `vocabulary_introduced` object (6 terms), Flashcard rendered at line 123. ✓
  - L09: `key_terms` derived from `vocabulary_introduced` object (4 terms), Flashcard rendered at line 127. ✓
  - L10: `key_terms` derived from `vocabulary_introduced` object (3 terms), Flashcard imported + rendered at line 127. ✓
  - L11: `key_terms` derived from `vocabulary_introduced` object (4 terms), Flashcard imported + rendered at line 92. ✓
- **vocabulary_assumed cross-refs all point to prior-taught lessons:**
  - L01 assumes: `conduit` (T04.L01) ✓, `soil type` (T04.L03) ✓, `route alignment` (T04.L02) ✓
  - L02 assumes: HDD/open-cut/plowing/AHJ/ROW (T06.L01) ✓, conduit (T04.L01) ✓
  - L05 assumes: conduit/innerduct (T06.L03) ✓, pull tension/mid-assist (T06.L04) ✓
  - L07 assumes: HDD (T06.L01) ✓, conduit/HDPE (T06.L03) ✓, pull tension (T06.L04) ✓
  - L08 assumes: ONT (T01.L01) ✓ — T01 authored and available
  - L09 assumes: NESC (T05.L01) ✓ — T05.L01 exists at correct path
  - All other cross-refs verified as pointing to earlier T06 lessons. ✓
- **L04 quiz fix correct (final state options/answer/rationale all consistent):** YES — `fixedQuizQuestions[0]` has `correct: 1` (option B, ~34%). Independent verification: 3 × 0.47-inch cables in 1.380-inch ID conduit: fill = (3 × π×0.235²) / (π×0.690²) × 100 = 0.5205/1.4957 × 100 = **34.8%** → closest answer B (~34%) is correct. Rationale math matches. ✓
- **No AI-signal phrases detected:** Grepped all 12 lessons for "AI", "Claude", "language model", "generated", "ChatGPT". Zero hits. ✓
- **Book-vs-field distinction present where applicable:**
  - L01: book matrix vs field method-selection pressure at lines 448–467 ✓
  - L02: book RUS/NEC hierarchy vs field foreman practice at lines 383–403 ✓
  - L04: NEC Chapter 9 book vs field 40%+ overload consequences at lines 441–462 ✓
  - L05: book OSHA permit-required confined space vs field "new install, no gas" violation at lines 435–445 ✓
  - L07: book swabbing procedure vs field problem scenarios ✓
  - L09: NESC §35 book minimum vs field 12-inch separation practice ✓
- **L12 capstone structure mirrors T02 L12:** YES — `lesson_type: 'capstone-quiz'`, `vocabulary_introduced: []`, one `data-tier="foundations"` section, WorkedExample + BranchingScenario + 20-question Quiz. Matches T02 L12 capstone structure. ✓
- **Interactivity primitives per brief spec:**
  - L01: BranchingScenario ✓, Quiz ✓
  - L02: WorkedExample ✓, Quiz ✓
  - L03: AnnotatedDiagram ✓, Quiz ✓
  - L04: WorkedExample ✓, AnnotatedDiagram ✓, Quiz ✓
  - L05: AnnotatedDiagram ✓, Quiz ✓
  - L06: AnnotatedDiagram ✓, Quiz ✓
  - L07: BranchingScenario ✓, Quiz ✓
  - L08: AnnotatedDiagram ✓, Quiz ✓
  - L09: Quiz ✓
  - L10: Quiz ✓
  - L11: BranchingScenario ✓, AnnotatedDiagram ✓, Quiz ✓
  - L12: WorkedExample ✓, BranchingScenario ✓, Quiz (20Q) ✓
- **L04 pull tension math independently verified:** T_straight = 0.5 × 0.18 × 450 = 40.5 lbf; multiplier = e^(0.5×3.927) = 7.12 (lesson shows 7.13 — negligible rounding); T_total = 288.5 lbf (lesson shows 288.8 — negligible). ✓
- **L12 capstone fill formula verified:** 3 × 1.25-inch OD innerducts in 4.026-inch ID conduit → fill = 28.9% (PASS); pull tension formula T = W×µ×e^(µθ) where W=total cable weight — algebraically equivalent to standard formula. ✓

---

## Coverage gaps

- **L03, L05, L06 quiz data not fully verified line-by-line** — confirmed the quiz field name bug exists (using `options:` not `choices:`); did not verify every individual answer rationale for those lessons, as fixing Finding #1 (field names) is prerequisite to any rationale check.
- **L10 and L11 quiz answers not independently re-derived** — L10 covers RUS AML traceability (no math); L11 covers QA checklist (conceptual). No arithmetic to independently re-derive; RT-B (technical accuracy framing) should verify citation claims.
- **L09 NESC §32/§35 exact separation distances not independently confirmed** — paywalled standard; RT-B should verify citations via RUS 1751F-635 secondary reference.

=== T06 RT-A REPORT END ===
