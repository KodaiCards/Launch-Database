# T06 (Design — Underground) — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder), author≠RT discipline (C1 authored the pools + `_research/T06.md`).
> Scope: `T06-L01.json` … `T06-L11.json` + `T06-final.json` (110 questions total) + a mechanical
> citation↔log diff + independent verification of C1's systemic RUS 1751F-635→643 prose class-fix,
> now integrated on the CEO branch, per the CEO's specific ask.

## Structural check — PASS

110 questions across 12 files (11 lesson pools @ drawCount 4/passThreshold 70/pool 8, final @
drawCount 15/passThreshold 80/pool 22 kind `topic_final`) — all floors met. No duplicate ids. Only
`mc` and `drag-match` types present. All `mc` `answerIndex` in range. All `drag-match` `correctMap`
key/value sets match `targets`/`items` 1:1.

## Arithmetic re-derivation — PASS

- `T06-L04-Q1` (fill%): conduit ID 1.380" → r=0.690, area=π×0.690²=1.4957 in². Cable OD 0.47" →
  r=0.235, area=π×0.235²=0.17348 in² × 3 = 0.52044 in². Fill% = 0.52044/1.4957 = 34.79% ≈ 34.8% →
  matches `answerIndex: 1`.
- `T06-L04-Q8` (fill%, different inputs): conduit ID 2.047" → r=1.0235, area=π×1.0235²=3.2909 in².
  Cable OD 0.60" → r=0.30, area=π×0.30²=0.28274 in² × 2 = 0.56549 in². Fill% = 0.56549/3.2909 =
  17.18% ≈ 17.2% → matches `answerIndex: 0`.
Both re-derived by hand, zero errors. The capstan-equation and jam-ratio reasoning questions
(`T06-L04-Q2/Q3/Q4/Q5/Q6/Q7`) are conceptually sound and internally consistent with the arithmetic
examples.

## UNVERIFIED-EXACT hedge check — PASS (the CEO's 4 specific citations)

Checked each of the 4 citations the CEO specifically flagged for hedging verification:

1. **NEC 830.47 (18" NPBC minimum)** — `T06-L02-Q4`'s citation reads "NEC text is paywalled; the
   18-inch NPBC figure is corroborated across multiple independent secondary/vendor sources...
   consistent with the T01/T05 precedent for hedging paywalled-standard numeric values." Properly
   hedged, not asserted as independently pinned to primary text.
2. **NESC Rule 354 (~6" separation)** — `T06-L09-Q6`'s citation reads "exact current numeric
   separation figure is in the paywalled primary standard — hedged per the T01/T05 precedent."
   Properly hedged; the 12-inch field-practice figure is presented as a locate-tolerance margin
   recommendation, not a code-minimum assertion.
3. **AASHTO H-20** — asserted as fact (32,000 lb rear axle / 40,000 lb proof load per AASHTO M306),
   correctly so: T06.md documents multi-source corroboration (custommanholecover.com,
   manholecoversdirect.com, precast.org, municipalcastings.org, engineerfix.com) rather than a
   single paywalled-standard lookup — same treatment as NESC Rule 235C4/250C in T05.
4. **RUS 1751F-643 §5/§7/§11 (reused, not primary-verified)** — T06.md is explicit that the
   bulletin's *identity/scope* was independently verified (WebSearch), but the internal section
   numbers were "reused from the lesson JSX's own internal citation pattern... not independently
   re-verified against paywalled primary text." This is correctly caveated in the log rather than
   silently presented as independently confirmed — the hedge holds.

**No R18-pattern violations found** — every specific paywalled/reused-not-verified figure is
hedged; every asserted-as-fact figure has multi-source corroboration documented.

## Answer-key / ambiguity / leading-stem check — PASS

Read all 110 questions, choices, and explanations. No double-correct answers, ambiguous stems, or
leading language. Engineering reasoning (fill%/jam-ratio/capstan tension, burial-depth hierarchy,
manhole/vault sizing, foreign-utility separation, directional boring, riser/pedestal placement,
NESC underground sections, innerduct standards, QA checklist logic) is sound throughout.

## Mechanical citation↔log diff (D027-ref1) — CLEAN

Extracted all 19 distinct `citation` strings across the 12 pool files. **All 19 trace cleanly** to
a `_research/T06.md` row — zero unlogged citations, continuing the D027 improvement trend (T04:
7/23, T09: 1/39, T05: 0/26, T06: 0/19).

## Prose class-fix verification (the CEO's main ask) — VERIFIED, systemic fix landed correctly

The CEO asked me to independently verify C1's systemic RUS Bulletin 1751F-635 → 1751F-643 prose
correction (T06.md documents 1751F-635 is actually "Aerial Plant Construction" — misapplied
pervasively across the pre-existing T06 lesson JSX for underground-plant facts; the correctly-scoped
bulletin is 1751F-643, "Underground Plant Design"). I re-verified against the *integrated* CEO-branch
prose, not C1's raw branch, per the CEO's instruction:

**`grep -c "1751F-635" osp-training/src/lessons/T06/L0[1-9]*.jsx L1[01]*.jsx` → zero matches
across all 11 content lessons.** The fix is complete and correctly applied — every occurrence now
reads `1751F-643` with matching section-number continuity (e.g., L02's burial-depth hierarchy,
L08's pedestal-spacing citation, L10's innerduct-traceability citation all correctly cite 1751F-643
with the same section numbers the pre-fix prose had attached to the wrong bulletin number, which is
the expected/correct fix shape — only the bulletin identity changes, not the section structure).

**Not yet fixed (out of scope for C1's L01–L11 pass, in scope for my capstone-strip task):**
`L12-t06-capstone-quiz.jsx` still has **16 occurrences of the wrong 1751F-635** across its
Flashcard glossary, graded Quiz choices/explanations, and BranchingScenario content. Per the CEO's
dispatch, this is explicitly my responsibility to fix during the D031 capstone-strip pass (the
graded-Quiz occurrences become moot once that block is deleted; the glossary/BranchingScenario
occurrences need the same 635→643 correction applied to the retained content).

## Additional finding (mine, applied during wiring, noted here for the record)

While wiring T06 (separate commit), I found and fixed 2 pre-existing lesson-number mislabels in
"Tying It Together" cross-reference blocks — `L01`'s reference to "T05.L02 Burial Depth Rules"
(should be T06.L02) and `L02`'s self-referential "T05.L02 NESC Rules" bullet (retargeted to
T06.L09, the lesson that actually covers NESC underground rules). These are unrelated to the
1751F-635/643 citation error but found during the same sweep — noted for completeness, not a
pool defect.

## Verdict

**CLEAN PASS on the pools; systemic prose fix VERIFIED complete for L01–L11.** All 110 pool
questions are structurally sound, correctly keyed, arithmetically correct, and properly hedged.
Citation↔log match is clean (0/19 unlogged). The CEO's headline concern — whether C1's 1751F-635→643
systemic correction actually landed cleanly across all 11 lessons — is confirmed: zero remaining
wrong-bulletin references in L01–L11. **T06's pools + L01–L11 prose are AUDIT-READY.** The one
remaining item (L12's 16 occurrences of the same error, plus its graded Quiz) is explicitly staged
as my next task (capstone-strip + prose fix), not a defect in this red-team's scope.
