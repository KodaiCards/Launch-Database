# T04 (Route Survey) — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder), author≠RT discipline (C1 authored the pools + `_research/T04.md`).
> Scope: `T04-L01.json` … `T04-L09.json` + `T04-final.json` (94 questions total) + a mechanical
> citation↔log diff against `_research/T04.md` + a prose-vs-pool contradiction sweep of the live
> `osp-training/src/lessons/T04/*.jsx` lesson files (per the CEO's dispatch, prompted by the T03-L05
> 240mm HIGH the Auditor caught in that pattern).

## Structural check — PASS

94 questions across 10 files (9 lesson pools @ drawCount 4/passThreshold 70/pool 8, final @
drawCount 15/passThreshold 80/pool 22 kind `topic_final`) — all floors met. No duplicate ids. Only
`mc` and `drag-match` types present (no banned types). All `mc` `answerIndex` values are in range.
All `drag-match` questions have `correctMap` keys/values that match their `targets`/`items` id sets
1:1 — no orphaned or missing mappings.

## Arithmetic re-derivation — PASS

- `T04-L02-Q2` (GSD formula): 3.76 × 80 / 24 = 12.53 mm ≈ 1.25 cm → matches `answerIndex: 1` ("12.5
  mm (approximately 1.25 cm)"). Correct.
- `T04-L02-Q6` (GSD ∝ altitude): doubling altitude doubles GSD — correct relationship, matches
  `answerIndex: 1`.
- `T04-L03-Q4` (UTM zone formula): floor((-88.5+180)/6)+1 = floor(15.25)+1 = 16 → matches
  `answerIndex: 2` ("Zone 16"). Correct.

## UNVERIFIED-EXACT hedge check — PASS

Only one class of hedge in the pool: `T04-L07-Q4` / `T04-final-Q21` (records-retention period).
Both correctly avoid asserting a specific FCC Part 42 retention-schedule figure as fact — the
correct answer choice is itself "confirm the applicable retention period," not a hardcoded number,
and the citation field explicitly flags the figure as not independently pinned down. Not an R18
pattern.

## Answer-key / ambiguity / leading-stem check — PASS

Read all 94 questions, choices, and explanations. No double-correct answers, no ambiguous stems,
no leading language. Reasoning (permitting-risk ranking, GIS trust-level ranking, submittal-order
sequencing, hazard-response patterns) is sound and consistent with domain knowledge.

## Mechanical citation↔log diff (D027-ref1) — FINDINGS, several unlogged citations

Extracted all 23 distinct `citation` strings across the 10 pool files and checked each against
`_research/T04.md`. Results:

**Logged and verified in T04.md:** FAA 14 CFR 107.41, GSD/UTM formulas, Esri Shapefile format, NWP
57 Section 10/404 bundling, PDF/A ISO 19005-1, 47 CFR Part 32 (general USOA), the 32.2230→32.2003
correction, RUS Bulletin 1751F-630 (reused from T01), ANSI O5.1 (reused from T01).

**Unlogged (confirmed the CEO's 4 flagged items, plus 3 more):**
1. `29 CFR 1910.146(b)` (confined-space O2 range) — not in T04.md. **However**, this exact
   subsection IS independently verified in `_research/T18.md` (line 29): "confirmed 19.5%-23.5% O2
   acceptable range exactly. PASS." T04.md just doesn't point to it — a paper-trail gap, not a
   sourcing gap.
2. `29 CFR 1910.268(g)(1)` (fall-protection >4ft trigger) — not in T04.md, but independently
   verified in `_research/T18.md` (line 31, OSHA Letter of Interpretation 2012-08-27). Same
   paper-trail gap.
3. `MUTCD 11th Edition (2023) Part 6` (TTC zone structure) — not in T04.md, but independently
   verified in `_research/T18.md` (lines 39-41). Same paper-trail gap.
4. `29 CFR 1910.268(b)` (T04-L01-Q4 fall-protection citation string, and `T04-final-Q1` "approach-
   distance prohibition near energized conductors") — **not verified anywhere in any research log**,
   and I independently WebSearched it: **1910.268(b) is actually titled "General," not an
   approach-distance provision.** The real minimum-approach-distance requirement for energized
   overhead lines/parts sits at **1910.268(b)(7)** ("Approach Distances to Exposed Energized
   Overhead Power Lines and Parts," Table R-2), not bare `(b)`. This is an imprecise subsection
   citation (should be `(b)(7)`) with zero log coverage — a genuine, unverified specific miscite,
   distinct from the other three paper-trail-only gaps above. Recommend either correcting to
   `1910.268(b)(7)` or backfilling a log row citing the correct subsection.
5. `33 CFR Part 320-332` (general USACE 404 framework, used in `T04-L05-Q1`/`T04-final-Q9` and
   again in `T04-L05-Q4`/`T04-L10` capstone) — T04.md only verifies NWP 57's Section 10/404
   *bundling*, not the general Part 320-332 framework citation as its own claim. Not independently
   verified in T01.md either (checked — no mention). **Note: `_research/T09.md` already cites this
   as "Reused from T01/T04 verification" — that chain traces back to a citation that was never
   actually independently verified in either T01.md or T04.md.** Recommend backfilling a log row.
6. `47 CFR 32.27` (records retention) — not logged as its own citation (only the general USOA
   framework and the retention-figure hedge are logged); low severity since the pool answer itself
   doesn't assert a specific unverified fact from it.
7. `7 CFR Part 1755` (RUS pre-engineering/loan-requirements, used standalone in `T04-L07-Q4`,
   `T04-L09-Q2/Q3`, `T04-final-Q15/Q19/Q21`) — not logged as its own line; T03.md/T02.md establish
   `7 CFR 1755.902` (a specific subsection) as reused/verified, but the general `7 CFR Part 1755`
   citation isn't the same claim and isn't separately logged here.

**Recommendation:** items 1-3 and 6-7 are backfill-only (facts are sound, sourced elsewhere or
uncontroversial regulatory-framework references); item 4 needs either a subsection correction
(`(b)` → `(b)(7)`) or a log row citing the correct provision; item 5 needs a log row (and T09's
citation chain should be corrected once T04's is fixed, since it currently cites a non-existent
verification).

## Prose-vs-pool contradiction sweep — ⚠ FINDING, HIGH severity (same pattern as T03-L05)

Per the CEO's specific ask (grep T04 lesson prose for contradictions like the T03-L05 240mm HIGH),
I checked the `32.2230`→`32.2003` correction — which T04.md itself flags as "corrected in the pool
questions... per the flag, don't fix the prose instruction" — against every place it appears in the
live lesson files.

**The correction only reached the pool. The live lesson JSX still asserts the wrong account number
in two places that render as GRADED content to students:**

1. **`osp-training/src/lessons/T04/L07-47-cfr-32-record-keeping.jsx:562-568`** — the lesson's own
   **fallback `<Quiz>`** (rendered whenever `T04-L07`'s pool isn't available via
   `useAvailableAssessments`) asks the identical question to `T04-L07-Q1` ("where do route-survey
   costs accumulate...") and grades `answerIndex: 2` = **"Telecommunications Plant Under
   Construction (§ 32.2230)"** as correct, with `citation: '47 CFR 32 § 32.2230...'` — the account
   number the research log itself found to be wrong (32.2230 = "transmission," not Plant Under
   Construction; the correct account is 32.2003).
2. **`osp-training/src/lessons/T04/L10-t04-capstone-quiz.jsx:372-378`** — the T04 capstone quiz,
   which is **not gated by `GatedAssessment` at all** (plain `<Quiz>`, always live regardless of
   pool availability — capstones are out of scope for the GatedAssessment wiring pass), asks the
   same question and grades **§ 32.2230** as correct with the same wrong citation.

Additionally, the surrounding prose in L07 (lines 213, 239, 260, 271, 399) and its formative
`BranchingScenario` (lines 506-539, 562-568) all consistently teach §32.2230, so this isn't an
isolated typo — the entire lesson's mental model of the account number is wrong, and two of its
graded surfaces (the fallback quiz, always-live if the pool is down; the capstone quiz, always
live regardless) will mark a student correct for citing the wrong FCC account number, directly
contradicting the pool's (correct) `T04-L07-Q1`/`Q5` and `T04-final-Q12` answers.

**This is the same defect class as the Auditor's T03-L05:372 HIGH** (graded pool says one thing,
live lesson prose contradicts it) — except here it also reaches a second graded surface (the L10
capstone) that has no gate at all, so it can't self-heal by pool availability the way L07's Quiz
theoretically could once inline quizzes get stripped.

**Recommendation:** route to the CEO for scoping — either (a) fix as its own increment (all 14
`32.2230` occurrences in `L07-47-cfr-32-record-keeping.jsx` + 2 in `L10-t04-capstone-quiz.jsx` →
`32.2003`, mirroring the T01 inc5 live-prose pattern), or (b) hold T04's live flip until fixed,
consistent with how T01's flip was blocked on its own inc5 prose fix.

## Verdict

**FINDINGS, not a clean PASS, not BLOCKED.** All 94 pool questions themselves are structurally
sound, correctly keyed, properly hedged, and (where checked) arithmetically correct — including
`T04-L07-Q1`/`Q5`/`T04-final-Q12`, which correctly cite the fixed `32.2003`. The defects are: (1) 7
distinct citation strings lacking `_research/T04.md` log rows (4 are paper-trail gaps to
already-verified T18 facts; 1 is an imprecise/unverified subsection cite — `1910.268(b)` should be
`1910.268(b)(7)`; 2 are uncontroversial-framework backfills); (2) a HIGH-severity **pool-vs-prose
contradiction** on the FCC account-number correction — the live L07 fallback quiz and the always-on
L10 capstone quiz both still grade the wrong `§32.2230` as correct, unlike the pool which correctly
uses `§32.2003`. Recommend routing the prose/capstone fix to the CEO before T04's gate/flip
decision, and backfilling the 7 log rows (mechanical, low-effort).
