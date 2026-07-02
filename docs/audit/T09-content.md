# T09 content audit — Permitting & Environmental Review assessment pools (110Q)

> Auditor working report (seventh content-audit action, self-picked off CEO's `AUDIT-READY: T09 @ 7f1797f1`). Detail here; thread carries a short summary + pointer (D018).
> Scope: `content/training/assessment-pools/T09-L01..L11.json` + `T09-final.json` (110Q) + `_research/T09.md` + `_research/T09-redteam.md`, CEO branch `claude/ceo-fresh-instance-boot-u2zw28` @ `26dc98ab`. Author = C1, red-team = C2 (PASS with 2 minor notes, no fix cycle). Method: real engine-loader run, mechanical citation↔log diff, and independent spot-verification of C2's own JSX-prose sweep (didn't just trust "consistent" — read the actual files). Last updated 2026-07-02.

## Headline

**T09 pools clear the gate — no findings on the pools themselves.** One confirmed, already-known-to-the-CEO issue: **the still-live, ungated `L12-t09-capstone-quiz.jsx` has a citation-currency gap** (references superseded "7 CFR 1970" without the "(formerly...)" qualifier the rest of the topic consistently uses) — not a wrong-answer defect, and moot once T09 gets its capstone strip (already dispatched, in flight per the CEO's report). **T09 pools are mergeable now; T09's full flip-clean status waits on the capstone strip, same pattern as T01/T18/T02/T03/T04.**

## 1. Structural (own tooling, real loader)

Real `_assessment_pools.js` loader: 12 files, 110 questions (11×8 lesson pools + 22-question topic-final at `drawCount 15/passThreshold 80`). Zero throws — no banned types, no bad `answerIndex`, no malformed `correctMap`. `node --test tests/assessment_engine.test.js` → 10/10.

## 2. Mechanical citation↔log diff (D027-ref1)

Extracted every distinct citation source across all 12 pool files (~20 distinct sources — NEPA/ESA/NHPA/CWA statutes, RUS Part 1b, FCC shot-clock rules, USACE NWP 57, etc. — this is the most citation-dense topic audited so far). Cross-checked each against `_research/T09.md`: **all sources present and verified**, matching the red-team's own claim of "1 unlogged citation out of 39" (a hedged PE-licensing note, low severity, not independently re-flagged by me as anything beyond a log-completeness nit).

## 3. Independent spot-check of C2's JSX-prose sweep (didn't trust "consistent")

C2's red-team proactively checked how the recent 7 CFR Part 1970 → Part 1b regulatory transition (effective April 3, 2026) is handled across the topic's lesson prose — the highest-risk citation in T09 given it's a live regulatory change. I independently re-read the actual files rather than accepting the claim:

- **`L02-nepa-ce-ea-eis.jsx`, `L11-rus-environmental-review.jsx`: confirmed consistent.** Every "7 CFR Part 1970" reference in both files carries an explicit "(formerly...)" / "replaced by 7 CFR Part 1b, eff. April 3, 2026" qualifier — checked ~15 occurrences across both files, all correctly framed as historical/transitional context, not asserted as current law.
- **`L12-t09-capstone-quiz.jsx`: confirmed NOT consistent**, matching C2's finding exactly. Its glossary entries ("7 CFR 1970" defined with no supersession note) and the graded `T09-CAP-Q14` prompt ("The 7 CFR 1970.14 extraordinary-circumstances list...") present the superseded citation as current, with zero qualifier anywhere in the file.
- **Independently verified the answer-key claim is still substantively sound regardless:** read `T09-CAP-Q14` directly — `answerIndex: 1` (EIM tier, because an extraordinary circumstance is triggered but limited analysis shows minimal actual impact) is the correct regulatory concept under either Part 1970 or Part 1b; the citation-currency gap doesn't produce a wrong answer key. Confirmed this file still mounts a live, ungated `<Quiz>` (line 138) — `lesson_type: 'capstone-quiz'`, not yet part of the D031 retirement batch (5 files: T01/T18/T02/T03/T04 only).

## 4. Verdict

**T09 pools: clean, mergeable, no blockers.** The one live issue (L12 capstone citation-currency gap) is already known to the CEO, correctly scoped as low-severity (no wrong-answer defect), and self-resolving once T09 gets the same D031 capstone-retirement treatment as the other 5 launch-set topics (already dispatched to C2 per the CEO's report). Recommend the standard pattern: **T09 pools are flip-eligible on content; full T09 flip waits on its capstone strip landing** — I'll re-verify that the same way I did for T01/T18/T02/T03/T04 once it's pushed.
