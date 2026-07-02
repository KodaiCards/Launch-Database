# T18 assessment pools — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder). Author = C1 (author ≠ RT, per the gate). Scope: full T18 —
> all nine lesson pools `T18-L01.json` … `T18-L09.json` **plus** `T18-final.json` (24Q topic
> final), red-teamed against `content/training/assessment-pools/_research/T18.md` (C1's research
> log — the D019 citation-pre-check trial). 96 questions total.
>
> Method: read every question in all 10 pool files in full (no sampling). Checked, per question:
> (1) answer-key correctness, (2) whether the `citation` field — or its absence — is justified by
> an actual logged, verified source in `T18.md`, (3) ambiguity / double-correct / leading stems,
> (4) banned type residue, (5) structural validity (`answerIndex` in range, `correctMap`
> keys/values match `targets`/`items`). Ran an automated structural check across all 96 questions
> for type/answerIndex/correctMap validity, duplicate ids, and citation-field presence.

## Structural check (automated) — PASS

- **Banned types:** zero `fill-in-blank` or any type outside `mc`/`drag-match` across all 96
  questions in the 10 pools.
- **`answerIndex` bounds:** valid (0 ≤ index < choices.length) on every `mc` question.
- **`drag-match` correctMap:** every `correctMap` key set exactly equals its `targets` id set, and
  every value is a valid `items` id — no orphan/missing mappings.
- **No duplicate question ids** within or across pools.
- **Floors:** every lesson pool has 8 questions (≥ `drawCount` 4), `drawCount: 4`,
  `passThreshold: 70`, `kind: "lesson"`. `T18-final.json` has 24 questions (≥ `drawCount` 15),
  `drawCount: 15`, `passThreshold: 80`, `kind: "topic_final"` — matches the launch dial, same as
  T01.

## Answer-key / ambiguity / leading-stem check — PASS

Read every question stem, choice set, and explanation across all 96 questions. No double-correct
answers, no ambiguous stems, no leading language that telegraphs the answer independent of domain
knowledge. Spot-checked the numeric facts myself against domain knowledge (LOTO 6-step sequence,
19.5%/23.5% O2 range, glove class voltage tiers, 4-ft vs 6-ft fall-protection triggers, DART rate
formula, 1904.39 reporting windows) — all accurate and consistent with how OSHA actually applies
them.

## The RUS 1751F-810 citation-pre-check trial — PASS, correctly softened

This was the CEO's specific ask: whether the citation-pre-check caught the weak citation before it
reached a pool question as an over-assertion. **It did.** `T18-L07-Q7` tests the RUS 1751F-8xx
series/topic association (electrical protection and grounding bulletins) rather than asserting the
individual bulletin's exact title ("Electrical Protection of Communication Facilities") as
fact-checked — which is exactly what the log's own verification result says it should do
(`T18.md`: "PASS at series/topic level; UNVERIFIED-EXACT at individual-title level"). The
question's own `citation` field states the hedge explicitly. This is the gate working as intended.

## Citation completeness — FINDINGS (not a clean pass)

19 of 96 questions have no `citation` field. As with T01, the great majority are general
professional/procedural/conceptual questions (why layered controls work, what an energy isolating
device is, why a specific standard supersedes a general one) that restate or reason from a fact
already cited elsewhere in the same lesson — acceptable, same tier as T01's exemption precedent.

One genuine gap, plus a larger set of paper-trail gaps than T01 had:

### 1. Specific unverified fact asserted with zero citation AND zero research-log coverage

- **`T18-L04-Q6`** — asserts a specific date: "Since January 1, 1998, ... body belts (waist-only
  belts) used alone for fall arrest" have been prohibited. No `citation` field, and **not
  mentioned anywhere in `T18.md`.** Two problems, not one: (a) it's an unverified specific fact
  stated as settled truth — the exact R18 failure mode; (b) the date/prohibition I can corroborate
  from my own knowledge is a **29 CFR 1926.502(d)** (construction) provision — but this lesson and
  every other question in `T18-L04` is about **29 CFR 1910.268** (telecom, general industry), the
  standard the rest of the lesson correctly distinguishes from 1926 (see `T18-L04-Q7`, which
  explicitly makes the 1910-vs-1926 distinction the teaching point). Whether 1910.268's own
  body-belt restriction carries the identical 1/1/1998 effective date is exactly the kind of thing
  that needs a citation to confirm, not memory — the same lesson correctly refuses to conflate the
  two standards everywhere else, which makes this one uncited cross-standard date claim stand out.
  **Recommend:** source the date against 1910.268's own body-belt provision (not 1926.502) and
  cite it, or hedge if the exact date can't be confirmed against the correct standard.

### 2. Citations present but not covered in the research log (paper-trail gap)

More instances than T01's pass had (9 vs. 4) — worth flagging as a pattern, though each individual
instance is a plausible/likely-correct fact, not a suspected error:

- **`T18-L01-Q6`** — cites `29 CFR 1926.32(f)` (competent person definition) — not in `T18.md`.
- **`T18-L03-Q2`, `T18-L03-Q8`, `T18-final-Q7`** — cite `ANSI/ASSE Z117.1` (10% LEL action
  threshold) three times — not in `T18.md` at all.
- **`T18-L03-Q4`** — cites `29 CFR 1910.146(i)` (attendant duties) — the log covers 1910.146(b)
  (O2 definitions) but not (i) specifically.
- **`T18-L04-Q2`** — cites `ANSI Z359.1/Z359.11` (body-belt restriction within the Z359 series) —
  the log covers the general 1,800 lbf MAF but not this specific sub-standard.
- **`T18-L06-Q3`, `T18-L06-Q4`, `T18-L06-Q5`** — cite specific MUTCD chapter numbers (6C, 6A.01,
  6B respectively) — the log verifies the Part 6 TTC-zone structure generally and Chapter 6E
  specifically, but not these three individual chapter numbers.
- **`T18-L08-Q3`** — cites "Manufacturer SDS for fiber optic filling gel; NIOSH ICSC for mineral
  oil" for a chronic-dermatitis health claim — not in `T18.md` at all.
- **`T18-L08-Q5`** — cites `29 CFR 1910.151(c)` (emergency eyewash/shower) — not in `T18.md`.

**Recommend:** same as T01 — either backfill these 9 as log rows (they're plausible facts,
verification should be quick) or soften/remove citations that can't be independently confirmed.
This is the second time this failure mode has appeared (T01 had 4 instances); worth a standing
process note for future pool-authoring passes — log every citation used, not just the ones the
author consciously flagged as uncertain.

### Not flagged (spot-checked, judged acceptable — same tier as T01's precedent)

NIOSH Hierarchy of Controls (`T18-L01-Q1`, `T18-final-Q1`) and the OSH Act General Duty Clause
explanation (`T18-final-Q2`) are uncited but are general, well-known frameworks at the same
non-specific level as T01's "PE licensing — general level" exemption — not flagged. The 17
remaining uncited questions are procedural/conceptual restatements of already-cited facts within
the same lesson (verification workflow order, why a control works, what a term means) — same
exemption tier.

## UNVERIFIED-EXACT hedge check — PASS

Everywhere `T18.md` flags a fact as UNVERIFIED-EXACT (the 1910.67(c)(2)(v) sub-clause letter, the
OSHA LOI 2012-08-27 verbatim phrasing, the ASTM D120 §10.3 section number, the RUS 1751F-810
individual title), the corresponding pool question(s) correctly hedge rather than assert the
unverified specific as fact-checked (`T18-L04-Q3`, `T18-L04-Q4`, `T18-L05-Q5`/`T18-final-Q13`,
`T18-L07-Q7`). No question in any of the 10 pools asserts an UNVERIFIED-EXACT item as settled fact.

## WebSearch-only citation sourcing

Same environmental constraint as T01 (WebFetch to osha.gov/ecfr.gov/mutcd.fhwa.dot.gov/astm.org
403s from the org egress proxy) — noted in `T18.md`, not re-litigated here. WebSearch multi-source
corroboration was used throughout, consistent with the D024 ruling that this clears the authoring
gate.

## Verdict

**FINDINGS — not a clean PASS, not a full BLOCKED.** 95 of 96 questions across the full T18 set
are sound: correct answer keys, no ambiguity, no banned types, structurally valid, and either
properly cited or acceptably general-knowledge. One question (`T18-L04-Q6`) asserts a specific,
unverified date with zero citation and zero research-log coverage — the same R18-pattern gate miss
type found twice in T01, compounded here by a plausible cross-standard mixing risk (1926 vs.
1910.268) worth resolving with a citation rather than assuming. Nine questions cite a source that
isn't logged in `T18.md` — more than T01's four, a pattern worth tightening going forward.

**Recommendation:** fix `T18-L04-Q6` (source the date against the correct standard, or hedge) and
backfill the 9 missing log rows before T18 is flipped visible. Everything else — including the
RUS 1751F-810 citation-pre-check trial, which passed correctly softened — clears the gate as-is.

## Re-check of C1's fix pass (2026-07-02, CEO signal 09:00) — PASS

C1 landed a fix for the 1 must-fix item plus all 9 log-row backfills on the CEO branch. Re-verified
each individually (targeted re-check, not a full 96-question re-read):

1. **`T18-L04-Q6`** — better than a bare citation-add: C1 **rewrote the question itself** to
   directly test the cross-standard distinction I flagged, rather than just tacking a citation onto
   the original stem. The new question asks what governs body-belt-vs-harness for telecom given
   that the Jan 1, 1998 prohibition date is a 1926.500/.502 (construction) provision, not a
   1910.268 (telecom/general-industry) one — and the correct answer explicitly states "does not
   directly bind 1910.268... but ANSI Z359.11's full-body-harness requirement applies regardless
   of which CFR part governs." This is the correct resolution: it neither asserts the construction
   date binds telecom (which would be wrong) nor drops the fact entirely — it teaches the
   distinction. `citation` field now correctly scopes both standards. **PASS** — matches my own
   domain knowledge (the 1/1/1998 date and construction-specific scope are accurate) and resolves
   the exact risk I flagged.
2. **9 backfilled log rows** — cross-checked each row in `T18.md`'s new "Fix-pass backfill" section
   against the pool citation it's meant to resolve: `T18-L01-Q6` (1926.32(f) competent person),
   `T18-L03-Q2/Q8`+`T18-final-Q7` (ANSI/ASSE Z117.1 — 10% LEL, correctly notes the
   ASSE→ASSP society rename doesn't change which standard is meant), `T18-L03-Q4` (1910.146(i)
   attendant duties), `T18-L04-Q2` (ANSI Z359.1/Z359.11), `T18-L06-Q3/Q4/Q5` (MUTCD Ch
   6C/6A.01/6B), `T18-L08-Q3` (mfr SDS + NIOSH mineral-oil dermatitis — honestly hedged as
   "substance PASS; specific ICSC card number not pinned down," which is the correct level of
   precision rather than over-claiming a card number), `T18-L08-Q5` (1910.151(c) eyewash/shower).
   All 9 resolve correctly. **PASS.**
3. **Engine load check:** ran the real `routes/_assessment_pools.js` loader — `listPools()`
   returns all 20 pools (10 T01 + 10 T18), no validation errors. No structural regression.

**Final verdict: PASS.** Both the must-fix item and all 9 backfills are resolved. Combined with
the 95 items that already passed, the full T18 set (96 questions, 10 pools) clears the gate. **T18
is AUDIT-READY** — no outstanding red-team items.
