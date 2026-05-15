# T08 Lessons RT-A — Pedagogy + DAG + Template Compliance
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

T08 (12 lessons) is structurally strong: all 11 regular lessons have all 3 tiers, flashcards matching vocabulary_introduced count verbatim, per-lesson quizzes with correct field names (prompt/choices/answerIndex/explanation), Book vs. Field in 9/11 lessons, zero AI-signal phrases. Three issues: (1) MEDIUM — 5 vocabulary_assumed entries in L01/L03 cite wrong source_lesson_id in the DAG; (2) LOW — L03 brief specified drag-match mode but all quizzes use multiple-choice only; (3) LOW — L09 and L11 missing explicit Book vs. Field labeled boxes; (4) LOW — contingency range inconsistency between L07 prose (10–15%) and L07 key_terms definition (10–20%).

---

## Findings table

| # | Sev | Category | File | Line range | Issue | Fix shape |
|---|---|---|---|---|---|---|
| F1 | MEDIUM | DAG cross-ref | L01 | vocabulary_assumed | `pole attachment` → `T07.L01`; `make-ready` → `T07.L02`; `transfer` → `T07.L02`; `pole owner` → `T05.L03` — all wrong source IDs (see detail below) | Correct source_lesson_id values to match actual introducing lesson |
| F2 | MEDIUM | DAG cross-ref | L03 | vocabulary_assumed | `clearance` → `T05.L04` (Grades of Construction); actual clearance lesson is T05.L02 (Rule 232 Vertical Clearance) | Change `source_lesson_id: 'T05.L04'` to `'T05.L02'` for term `clearance` |
| F3 | LOW | Brief interactivity gap | L03 | Quiz `mode=` | Brief specifies "Quiz (MC + drag-match scenarios)"; L03 uses `mode="multiple-choice"` only. All 11 regular lessons use `mode="multiple-choice"` — no lesson uses drag-match despite brief requirement in L03 and L12 capstone description. | Add `mode="drag-match"` alternate Quiz block to L03, or document the deviation as a deliberate scope reduction |
| F4 | LOW | Book vs. Field | L09, L11 | Working section | L09 has no labeled Book vs. Field box (field practice is woven into key_terms definitions and BranchingScenario but not explicitly boxed). L11 has zero field practice content — no mention of real-world CPM vs. textbook CPM divergence (e.g., experienced PMs don't re-derive float daily; they use PM software + rule-of-thumb buffers; power company schedules often dominate over analytical float calculation). | Add a labeled Book vs. Field box to L09 and L11 |
| F5 | LOW | Internal inconsistency | L07, L12 | Contingency range | L07 WorkedExample prose (inline text) says "Industry norm: 10–15% for contingency." L07 key_terms definition says "Standard range: 10–20%." L12 Q08 answer choice says "industry norm is 10–15%" but the explanation says "(10–20%)." The range is internally inconsistent across the same topic. | Harmonize to one range. L07 key_terms and CLAUDE.md field practice guidance align with 10–20% being the full industry range; the WorkedExample prose should match. |

---

## What I checked + confirmed clean

- **Quiz field-name grep returns 0 violations:** YES. `grep -n "question:\|options:\|correct:\|rationale:" osp-training/src/lessons/T08/*.jsx | wc -l` returned 3. All 3 matches are prose text (L02:324 is a narrative list heading "options:", L05:141/144 are paragraph prose). Zero actual Quiz component field-name violations. Correct fields `prompt`, `choices`, `answerIndex`, `explanation` confirmed in all lessons.

- **Tier markers in L01–L11:** YES. Every regular lesson has exactly 3 `data-tier=` sections: `foundations`, `working`, `advanced`. L12 capstone correctly uses `data-tier="foundations"` only (capstone-quiz type, exempt from 3-tier requirement per T02 template).

- **vocabulary_introduced flashcards — per-lesson list:**
  - L01: 7 terms introduced → 7 flashcard cards (T08-L01-fc-otmr through fc-applicant). MATCH.
  - L02: 5 terms → 5 cards (15-day clock, self-help remedy, FCC enforcement, notice period, tolling). MATCH.
  - L03: verified match. MATCH.
  - L04–L11: spot-check confirmed counts match vocabulary_introduced arrays. All MATCH.
  - Flashcard back-text verified verbatim against key_terms definitions for L01 (all 7), L02 (all 5), L03 (sample 2). All verbatim. No invented definitions.

- **vocabulary_assumed cross-refs valid:** PARTIAL — see F1 and F2 findings. The terms EXIST in the curriculum (the concepts are taught), but 5 `source_lesson_id` values point to the wrong lesson. The prerequisite coverage is intact; only the citation accuracy is off. Specifically:
  - `pole attachment` → T07.L01: T07.L01 introduces `staker`, `stake`, `call-out`, `field verification`, `measurement tolerance` — NOT `pole attachment`. The formal introduction of `pole attachment` as a concept occurs in T05.L08 (joint use lesson).
  - `make-ready` → T07.L02: T07.L02 introduces `plan-and-profile`, `stationing`, `offset`, `PI`, `cross-section`, `design intent mark` — NOT `make-ready`. The first lesson to formally introduce `make-ready` (as a defined term) in the current curriculum is T07.L06 (`make-ready flag`, `transfer`, `replacement`).
  - `transfer` → T07.L02: Actually introduced in T07.L06 vocabulary_introduced.
  - `pole owner` → T05.L03: T05.L03 introduces `Rule 235`, `Table 235-5`, `communication worker safety zone`, `neutral conductor`, `supply space` — NOT `pole owner`. T05.L08 introduces `pole owner` in vocabulary_introduced.
  - `clearance` → T05.L04 (L03): T05.L04 is "Grades of Construction"; vertical clearance is primarily taught in T05.L02 (Rule 232 Vertical Clearance). T05.L04 mentions clearance in passing but does not formally introduce the term.

- **L12 capstone structure mirrors T02 L12:** YES. Parallel structure confirmed:
  - Same meta fields (lesson_type: 'capstone-quiz', vocabulary_introduced: [], full prereqs list)
  - Opens with `data-tier="foundations"` overview paragraph with score threshold (≥80%)
  - Uses WorkedExample capstone scenario first (provides numbers for subsequent questions)
  - 20-question Quiz with `mode="multiple-choice"` + tiered difficulty comments (foundations/working/advanced)
  - 2 BranchingScenario simulations at end (brief-required; present)
  - No Flashcard (correct — capstone-quiz type is exempt)
  - Question count: confirmed 20 `prompt:` entries. MATCH to brief spec.

- **No AI-signal phrases:** YES. `grep -rn "\bAI\b\|language model\|Claude\|auto-generated\|AI-generated" osp-training/src/lessons/T08/` returned zero results.

- **Book vs. Field present — per-lesson list:**
  - L01: YES (labeled "Book vs. Field" box — legal right vs. relationship management)
  - L02: YES (labeled "Book vs. Field" box — hard clock vs. Day 10 proactive call field practice)
  - L03: YES (labeled "Book vs. Field" box)
  - L04: YES (labeled "Book vs. Field" box)
  - L05: YES (labeled "Book vs. Field" box)
  - L06: YES (labeled "Book vs. Field" box)
  - L07: YES (labeled "Book vs. Field" box)
  - L08: YES (labeled "Book vs. Field" box)
  - L09: NO explicit box — field practice embedded in key_terms definitions and BranchingScenario text but not labeled
  - L10: YES (labeled "Book vs. Field: When As-Built Packages Are Actually Submitted")
  - L11: NO explicit box AND no field practice content at all

- **Pitch appropriateness (stupid-simple test):** All lessons open with "In Plain English" foundation section. Acronym glossary tables present in L01 and L02. L11 lacks acronym table but uses minimal acronyms (CPM explained inline). WorkedExample in L06 (pole replacement cost split) and L08 (attachment fees) include step-by-step algebra with sanity checks. L12 capstone scenario provides numbers up front before quiz questions reference them — pedagogically sound.

- **Interactivity brief compliance (excluding drag-match gap):**
  - L01: BranchingScenario + Quiz ✓
  - L02: BranchingScenario + Quiz ✓
  - L03: Quiz only (drag-match gap — F3)
  - L04: AnnotatedDiagram + Quiz ✓ (brief-specified AnnotatedDiagram present)
  - L05: Quiz only (brief says MC only for L05 — OK)
  - L06: WorkedExample + Quiz ✓ (brief-specified WorkedExample present)
  - L07: WorkedExample + BranchingScenario + Quiz ✓
  - L08: WorkedExample + Quiz ✓
  - L09: BranchingScenario + Quiz ✓
  - L10: Quiz only (brief says Quiz (MC) — OK)
  - L11: BranchingScenario + Quiz ✓
  - L12: WorkedExample + Quiz (20Q) + 2 BranchingScenarios ✓

- **Math spot-checks:**
  - L12 Q07: $1,200 + $4,200 + $2,000 = $7,400; 15% × $7,400 = $1,110; total $8,510 (scenario says $8,500 — rounding noted in question itself). ACCEPTABLE.
  - L12 Q09: $120/yr × 1 pole × 20 years = $2,400. answerIndex 2 = choice "$2,400". CORRECT.
  - L12 Q15: Back-end = 2+1+1 = 4 wk; latest MR finish = Week 10; expected = Week 9; float = 1 wk. answerIndex 1 = "1 week". CORRECT.
  - L12 Q16: Float 2 wk − AHJ overrun 2 wk = 0. answerIndex 2 = "0 weeks — critical path". CORRECT.
  - L06 WorkedExample: load share math confirmed (L_exist 80%, L_fiber 12%, L_total 92%). Share_fiber = 12/92 = 13.04%. Cost_fiber = $9,000 × 13.04% = $1,173.60. CORRECT per sanity check.

---

## Coverage gaps

- **T07.L06 not opened:** I verified T07.L06's vocabulary_introduced list (`make-ready flag`, `transfer`, `replacement`) via Read. I did not read T07.L04, T07.L05 for completeness — if those lessons introduce `make-ready` or `pole attachment` formally, the F1 DAG findings would need to be downgraded. Low probability given the teaching sequence.
- **L04–L11 flashcard verbatim match:** Spot-checked L01 (7/7), L02 (5/5), L03 (2 terms). Did not exhaustively verify all 50+ flashcard backs across remaining lessons. RT-B (technical) should spot-check 3–5 additional lesson flashcard backs.
- **L12 Q08 math:** The contingency range inconsistency (F5) makes Q08 ambiguous. If the answer calls 20% "at the high end of 10–20%" but the choice text says "industry norm is 10–15%," a learner reading L07's WorkedExample prose (which says 10–15%) would consider the choice correct on different grounds than the explanation. The answer is still defensible but the inconsistency should be resolved.
- **Forward-reference ban compliance (brief §6):** Did not exhaustively grep for terms from T10 (Construction) or T17 (Estimation) appearing undefined in T08 lessons. Spot-check found no obvious violations in L01, L02, L07 — but this should be verified by RT-B.

=== T08 RT-A REPORT END ===
