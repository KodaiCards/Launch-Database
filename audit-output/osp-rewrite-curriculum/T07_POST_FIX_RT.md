# T07 Lessons Post-Fix RT
Date: 2026-05-16
Verdict: GREEN

## Summary (≤80 words)

All 7 canonical findings verified correctly applied across the 7 fix commits. No regressions detected. F1 (L10 branching redesign) is structurally sound: `a1_clear` asserts no-conflict from the start, math confirms 1.2 ft > 1.0 ft margin, no dangling `a1_correct` reference. F2 L04 Book-vs-Field div is inside the working-tier section. F3 harmonizes to 1.0 ft. F4/F6/F7 clean single-line fixes. F5 array format consistent L06-L09. Vite build clean (131+ modules, 4.29 s).

## Per-finding verification table

| # | Finding | Fix SHA(s) | Files | Verdict | Notes |
|---|---|---|---|---|---|
| F1 | L10 capstone A1 branching redesign + dangling ref | `afd4e51` + `f190839` | L10 | APPLIED-CORRECT | `a1_clear` state confirmed: text asserts "no conflict" from start (1.2 ft > 1.0 ft required, 0.2 ft margin). Correct-path choice routes to `a1_clear`. No `a1_correct` string found anywhere in L10. `a1_replacement_wrong` correctly routes back to `a1_clear`. Math verified: 27.2 − 26.0 = 1.2 ft; required 1.0 ft (Rule 235); 1.2 > 1.0 → clearance PASSES. |
| F2 | L04 Book-vs-Field OSHA callout in working tier | `a0615ae` + `cc1eb5c` | L04 | APPLIED-CORRECT | Div at line 268-299, labeled "Book vs. Field — OSHA 1910.268 and Climbing Safety." OSHA 1910.268(g)(1) explicitly cited in both Book section and contextual references. Structurally confirmed inside `<section data-tier="working">` (opens L192, closes L300; div at L268). Not orphaned. |
| F3 | L04 NESC Rule 235 comm-to-comm 0.5 → 1.0 ft | `61f4631` | L04 | APPLIED-CORRECT | WorkedExample Sep_min = 1.0 ft with description "NESC Rule 235 requires at least 12 inches (1.0 ft)". Explanation: "4.5 ft >> 1.0 ft. Separation is NOT a problem." All ±0.5 ft refs in L04 are laser measurement accuracy (unrelated). No residual 0.5 ft comm-to-comm reference. |
| F4 | L07 "centerline stake" synonym in vocabulary | `d90ddf6` | L07 | APPLIED-CORRECT | Line 39: "survey stake" defined as "(also called a centerline stake when marking an underground route centerline)". Flashcard (line 148) front: "What is a survey stake (also called a centerline stake)". Synonym present in both definition and flashcard. |
| F5 | L06-L09 vocabulary_introduced array format | `ab2a135` | L06, L07, L08, L09 | APPLIED-CORRECT | All 4 files use `vocabulary_introduced: [` array-bracket format. All 4 export `export const vocabulary_introduced = meta.vocabulary_introduced;`. Format matches L02-L05 pattern. |
| F6 | L07 RUS 1751F-635 §6 bore depth [confirm edition] | `d90ddf6` | L07 | APPLIED-CORRECT | Line 316 AnnotatedDiagram description: "36 in. min. below pavement surface per RUS 1751F-635 §6 [confirm edition]". Marker added. Header comment line 3 also adds `[confirm edition]` on NESC reference. |
| F7 | L06 "determines" → "evidences" | `ab2a135` | L06 | APPLIED-CORRECT | Line 300: "staker's documentation evidences the determination of whether make-ready is required." No remaining "determines" in OTMR/burden-of-proof context. |

## Regression check

- All 10 T07 lessons parse + import cleanly: **yes** (all have valid default exports; Vite consumed all without error)
- Vite build clean: **yes** (`✓ built in 4.29s`, no errors, only expected chunk-size warning unrelated to T07)
- vocabulary_introduced format consistent across L01-L09: **yes** (L01 uses simple string array; L02-L09 use array-of-strings format; all export via `meta.vocabulary_introduced`; no object/non-array format)
- L10 BranchingScenario state routing valid (no dangling refs): **yes** (states: `a1_clear`, `a1_wrong`, `a1_replacement_wrong` all present; no `a1_correct`; `a1_replacement_wrong` correctly routes to `a1_clear`)
- L04 Book-vs-Field callout in correct DOM location: **yes** (line 268-299 inside working section lines 192-300)
- Quiz field-name normalization preserved (grep returns 0 violations): **yes** (no `correctAnswer`/`correct_answer`/`isCorrect`/`is_correct` raw strings found across T07)

## Coverage gaps

- **Vite bundle size warning** (pre-existing, unrelated to T07): `index-xZCfSRs4.js` is 756 KB minified. Not a T07 issue; tracked in project backlog.
- **L10 capstone A1 math cross-check note**: The A2 scenario (telecom at 25.3 ft, design at 26.0 ft → 0.7 ft clearance < 1.0 ft required) was not a fix target but independently verified correct: 26.0 − 25.3 = 0.7 ft < 1.0 ft → conflict flagged correctly. No regression introduced by A1 redesign on A2.
- **L07 line 3 NESC `[confirm edition]` bonus fix**: Not in canonical F6 scope but is correct and conservative. No collateral concern.

## Overall verdict

**GREEN** — All 7 canonical findings applied correctly. No regressions. Vite build clean. T07 topic is complete and ready for production cut.

=== T07 POST-FIX RT REPORT END ===
