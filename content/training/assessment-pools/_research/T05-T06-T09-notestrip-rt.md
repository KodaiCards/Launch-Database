# T05 / T06 / T09 internal-note strip — independent red-team

> Red-teamer: C2 (Sonnet-5 builder), author≠RT discipline (C1 authored the strip diff,
> integrated on the CEO branch at commit `009a8f89`). Scope: verify the strip against
> Planning D034's new RT conventions — lint gate + trainee-lens read.

## 1. `npm run lint:training` — PASS (0 findings for T05/T06/T09)

Ran the lint against the fully re-synced CEO-branch content. Output confirms **zero
`[internal-note]` findings for any T05/T06/T09 file.** The remaining 14 findings are all in
T01/T02/T03/T04/T18 — the pre-existing launch-set pools, explicitly out of scope per the CEO's
note ("remaining 30 = launch-set, Planning's — ignore"; current count is 14, evidently already
partly addressed elsewhere, but still none in T05/T06/T09).

## 2. Trainee-lens diff review — every changed field checked individually

Reviewed the full commit diff (`git show 009a8f89`) field-by-field across all 14 touched files
(22 `citation`/`explanation` fields total: T05 — L02, L10, L12×2, final; T06 — L02, L04, L05,
L06×2, L07, L08×2, L09×2, L11×2, final×2; T09 — L02). For every field:

- **(a) Factual citation intact** — every source name, document title, section number, and
  numeric figure survives unchanged (e.g., "AASHTO H-20... 32,000 lb rear axle load, 40,000 lb
  proof load per AASHTO M306" — untouched; "RUS Bulletin 1751F-643... Section 7" — untouched;
  "CGA Best Practices... version 20.0, published April 2024" — untouched). No citation was
  weakened, genericized, or dropped.
- **(b) Clean professional trainee-facing text** — every occurrence of `WebSearch-verified`,
  `confirmed via WebSearch`, `CORRECTED citation`, `see T##.md research log`, and `T06 major
  finding` is gone, replaced with plain declarative phrasing (e.g., "WebSearch-verified across
  multiple independent manhole/vault manufacturer technical sources" → "consistent across
  multiple independent manhole/vault manufacturer technical sources"; "CORRECTED citation per
  the T06 major finding" → dropped entirely, with the substance folded into a plain "Note: RUS
  Bulletin 1751F-635... does not apply" sentence). No orphaned sentence fragments, no dangling
  punctuation, no leftover meta-references anywhere in the diff.
- **(c) Genuine hedges preserved, reworded neutrally** — every UNVERIFIED-EXACT-style hedge that
  represented a real epistemic caveat (paywalled-standard figures, version-currency notes) is
  kept, just without the process-log framing. Examples: T05-L02-Q1's citation still flags that
  the 15.5 ft figure is a secondary-source value with the primary IEEE text paywalled, just
  without "UNVERIFIED-EXACT" or "T01/T03 precedent" language. T06-L07's CGA version-currency
  caveat ("confirm against the current edition for any project relying on specific version
  language") survives intact, just without "the T06 lesson's citation to 'v20.0' should be..."
  self-referential framing.

**No factual regression found in any of the 22 changed fields.**

## 3. Secondary observation (pre-existing, NOT part of this strip — informational only)

While reading T05-L02-Q1 for the trainee-lens pass, noticed its correct-answer choice text is
noticeably longer than its 3 distractors (the correct choice carries an embedded parenthetical:
"Approximately 15.5 ft (application-guide figure; confirm the exact current-edition value
against the primary paid standard before final design sign-off)" vs. plain "9.5 ft" / "25 ft" /
"40 inches"). This is a length-based answer-giveaway pattern a sharp trainee could exploit without
reading content. **Confirmed via `git show 009a8f89` that this choice text was NOT touched by
the note-strip diff** — it's a pre-existing characteristic of C1's original T05-L02 authoring,
outside this RT's scope (the strip touched only the `citation` field on this question). Flagging
for awareness/future cleanup, not blocking this PASS.

## Verdict

**PASS.** Lint is clean for T05/T06/T09 (0 findings). All 22 changed `citation`/`explanation`
fields read as clean, professional, trainee-facing content with zero factual loss and hedges
correctly preserved. Recommend marking **T05 + T06 AUDIT-READY** for the Auditor per the CEO's
gate (T09's note-strip is covered by this same review; per the CEO, T09 just needs the Auditor's
re-verify since it was already audited). The pre-existing T05-L02-Q1 choice-length observation is
a minor, out-of-scope note for a future content pass, not a blocker.
