# T09 (Permitting & Environmental) — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder), author≠RT discipline (C1 authored the pools + `_research/T09.md`).
> Scope: `T09-L01.json` … `T09-L11.json` + `T09-final.json` (110 questions total) + a mechanical
> citation↔log diff against `_research/T09.md` + a prose-consistency sweep of the live
> `osp-training/src/lessons/T09/*.jsx` lesson files (same method as the T04 red-team).

## Structural check — PASS

110 questions across 12 files (11 lesson pools @ drawCount 4/passThreshold 70/pool 8, final @
drawCount 15/passThreshold 80/pool 22 kind `topic_final`) — all floors met. No duplicate ids. Only
`mc` and `drag-match` types present. All `mc` `answerIndex` values in range. All `drag-match`
`correctMap` keys/values match `targets`/`items` id sets 1:1.

## Arithmetic re-derivation — PASS

`T09-L10-Q1/Q2` (permit-tracking critical-path math): MRO 0+45=45, DOT 0+90=90, SHPO 15+30=45,
PCN 10+45=55 → latest = DOT Day 90, matches `answerIndex: 1`. Q2's resubmission scenario:
DOT resubmitted Day 30, 30+90=120, +7-day mobilization lag = Day 127 → matches `answerIndex: 1`.
Both re-derived by hand, zero errors. Consistent with the capstone's Q13 (also re-derived, correct).

## UNVERIFIED-EXACT hedge check — PASS

One item worth noting: `T09-L06-Q1`'s citation ("State PE licensing requirements vary by
jurisdiction — confirm... before relying on an out-of-state license") is not itemized in
`_research/T09.md` — a genuine unlogged citation (see diff below) — but the claim itself is
properly hedged (it explicitly tells the reader to confirm rather than asserting a specific
state's rule as fact), and the underlying fact (PE licensure is state-specific) is uncontroversial
professional-practice knowledge in the same exempt tier as the "PE-licensing precedent" from prior
topics' logs. Not an R18-pattern violation.

## Answer-key / ambiguity / leading-stem check — PASS

Read all 110 questions, choices, and explanations across all 12 files. No double-correct answers,
no ambiguous stems, no leading language. The regulatory reasoning (NEPA tiering, Section 106
consulting-party rules, ESA/NLEB timing, USACE NWP 57 scope, post-*Sackett* WOTUS narrowing,
municipal shot-clocks) is sound and internally consistent across lessons.

## Mechanical citation↔log diff (D027-ref1) — near-clean, 1 minor gap

Extracted all 39 distinct `citation` strings across the 12 pool files. All but one trace cleanly
to a `_research/T09.md` row (either the main citation table or the "Additional citations used in
L11 / T09-final" table) — this is a marked improvement over T04's 7-of-23 gap rate, consistent
with the CEO's note that D027 (log every citation) is working.

**The one gap:** `T09-L06-Q1`'s "State PE licensing requirements vary by jurisdiction..." citation
(discussed above under UNVERIFIED-EXACT) has no log row. Low severity — properly hedged,
uncontroversial, same exempt tier as prior topics' PE-licensing citations — but a genuine
paper-trail miss. Recommend a one-line backfill in `_research/T09.md`.

## Live-regulatory-change verification — independently spot-checked, PASS

`_research/T09.md` proactively flags and independently verifies (not just carries from the lesson
JSX) that CEQ's NEPA implementing regulations (40 CFR Parts 1500-1508) were removed from the CFR
(interim rule eff. Apr 11 2025, finalized eff. Jan 8 2026) and that 7 CFR Part 1970 (RUS/USDA NEPA
procedures) is now "[Reserved]," consolidated into 7 CFR Part 1b eff. April 3, 2026. I independently
re-verified the pool citations reflect this correctly: `T09-L02.json` and other files cite "7 CFR
Part 1b... replaced the former 7 CFR Part 1970, now reserved" rather than citing the superseded
Part 1970/§1970.54 as current authority. **PASS** — this is exactly the kind of citation-currency
check the log claims to have done, and the pool matches.

## Prose-consistency sweep — ⚠ FINDING, LOW-MEDIUM severity (not a pool defect — capstone-only)

Per the CEO's standing ask (grep lesson prose for contradictions, same method as the T04 red-team),
I checked how consistently the 7 CFR 1970 → 7 CFR Part 1b transition is applied across all T09
lesson files, since it's the trickiest current-events citation in the topic.

**`osp-training/src/lessons/T09/L01`, `L02`, and `L11` are all consistent** — every reference to
"7 CFR Part 1970" in those files is qualified with "(formerly...)" / "(replaced by 7 CFR Part 1b,
eff. April 3, 2026)" or similar, matching the pool.

**`osp-training/src/lessons/T09/L12-t09-capstone-quiz.jsx` is NOT consistent** — its glossary
entries (`{ term: '7 CFR 1970', definition: 'USDA regulation covering environmental and cultural
review procedures for RUS-funded programs...' }`, and the EIM glossary entry) and its capstone
quiz questions (`T09-CAP-Q14`'s prompt: "The 7 CFR 1970.14 extraordinary-circumstances list...")
reference 7 CFR 1970 as current/active with **no superseded-by-1b qualifier anywhere in the file**.

**This is lower severity than the T04 §32.2230 finding** — I checked `T09-CAP-Q14`'s actual
answer key: `answerIndex: 1` (EIM tier is the correct review level given an extraordinary
circumstance with limited actual impact) is **substantively correct regardless of which CFR part
number governs it** — the underlying regulatory concept (extraordinary circumstance → EIM, not
automatic EA) still holds under Part 1b. So this is a citation-currency inconsistency, not a
wrong-answer-key defect like T04's account-number case.

**Also note:** `L12-t09-capstone-quiz.jsx` still has `lesson_type: 'capstone-quiz'` and a live,
ungated graded `<Quiz>` block — it was not included in the 5-file D031 capstone-quiz retirement
list (T18/T02/T03/T01/T04 only). If/when T09's capstone gets the same D031 treatment, this
citation-currency gap becomes moot (the file becomes prose-only); until then it's a minor live
citation-accuracy gap worth a mention to the CEO for routing (backfill the "(formerly 7 CFR
1970)" qualifier in L12, or fold it into T09's eventual D031 pass).

## Verdict

**PASS with 2 minor notes, no BLOCKED-level findings.** All 110 pool questions are structurally
sound, correctly keyed, properly hedged, and arithmetically correct. D027's log-every-citation
discipline shows real improvement over T04 (1 unlogged citation out of 39, vs. 7 of 23) — both
notes are low severity: (1) `T09-L06-Q1`'s PE-licensing citation needs a one-line log backfill
(hedged, uncontroversial — not a correctness issue); (2) `L12-t09-capstone-quiz.jsx`'s glossary
and capstone quiz reference the superseded "7 CFR 1970" without the "(formerly...)" qualifier that
L01/L02/L11 consistently apply — a citation-currency inconsistency in still-live capstone content,
not a wrong-answer defect, and likely moot once T09 gets its own D031 pass. **T09 pools are clean
enough to mark AUDIT-READY as authored;** the two notes are optional cleanup, not blockers.
