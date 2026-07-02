# T05 (Design — Aerial) — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder), author≠RT discipline (C1 authored the pools + `_research/T05.md`).
> Scope: `T05-L01.json` … `T05-L14.json` + `T05-final.json` (134 questions total) + a mechanical
> citation↔log diff + a heavy focus on UNVERIFIED-EXACT hedging for the NESC-rule citations, per
> the CEO's specific ask (T05 is the densest paywalled-standard topic yet).

## Structural check — PASS

134 questions across 15 files (14 lesson pools @ drawCount 4/passThreshold 70/pool 8, final @
drawCount 15/passThreshold 80/pool 22 kind `topic_final`) — all floors met. No duplicate ids. Only
`mc` and `drag-match` types present. All `mc` `answerIndex` in range. All `drag-match` `correctMap`
key/value sets match `targets`/`items` 1:1.

## Arithmetic re-derivation — PASS

- `T05-L06-Q2` (ice load, w_ice = 1.244 × t × (D+t)): 1.244 × 0.50 × (0.50+0.50) = 0.622 lb/ft →
  matches `answerIndex: 1`.
- `T05-L06-Q8` (same formula, different inputs): 1.244 × 0.25 × (0.375+0.25) = 0.1944 ≈ 0.194 lb/ft
  → matches `answerIndex: 0`.
- `T05-L06-Q5` (coefficient derivation): 57 lb/ft³ × π / 144 = 1.2435 ≈ 1.244 → matches
  `answerIndex: 1`'s physically-derived explanation, not an arbitrary constant.
- `T05-L06-Q7` (ice load vs. bare cable weight ratio): 0.622 / 0.088 ≈ 7.07× → "roughly 7 times" in
  `answerIndex: 1` is accurate.
All re-derived by hand, zero errors.

## UNVERIFIED-EXACT hedge check — PASS (this was the focus area)

T05 is the densest paywalled-NESC-standard topic to date (`WebFetch` to the paid IEEE C2-2023 text
remains blocked). Checked every NESC numeric-table citation for proper hedging, both in the pool
and in the live lesson prose:

- **Rule 232 (vertical clearance, ~15.5 ft traffic-lane figure)** — `T05-L02-Q1`'s prompt itself
  says "Per public secondary sources summarizing NESC C2-2023 Table 232-1, approximately..." and
  its citation explicitly reads "UNVERIFIED-EXACT — WebFetch to the primary paywalled IEEE C2-2023
  text is blocked." Checked the live lesson (`L02-vertical-clearance-rule-232.jsx`) — consistently
  uses "≈ 15.5 ft" / "approximately" throughout (lines 52, 57, 161, 185, 190-208), including a
  "Confirm exact value from NESC C2-2023 Table 232-1 for your design" instruction. Pool and prose
  match — no unhedged-vs-hedged contradiction (the pattern that caught T03-L05's HIGH finding).
- **Rule 261 / Section 26 (grades of construction, load/strength factor tables)** — `T05-L04`
  pool questions test the Grade-B-vs-Grade-C *conceptual* relationship (which grade requires higher
  strength/load factors), not a specific unconfirmed number; citations explicitly note "exact table
  values require the paid primary standard."
- **Rule 250 / Table 250-1 (loading districts)** — hedged as "corroborated by... exact current-
  edition table values should be confirmed against the paid primary standard for final design,"
  consistent with the structural pattern (Light/Medium/Heavy district classification) being
  well-corroborated across secondary sources while exact table cell values are not claimed.
- **Rule 235C4/238E (40-inch CWSZ)** and **Rule 250C (Extreme Wind, 60-ft trigger, reused from
  T01)** are asserted as fact — correctly, since these are independently corroborated across
  multiple utility/industry sources (ikeGPS, We-Energies, Chelan County PUD) rather than a single
  paywalled numeric table lookup, and T05.md documents the multi-source corroboration.

**No R18-pattern violations found** — every specific paywalled-standard number is hedged, and
every asserted-as-fact figure has multi-source corroboration documented in the log.

## Answer-key / ambiguity / leading-stem check — PASS

Read all 134 questions, choices, and explanations. No double-correct answers, ambiguous stems, or
leading language. The engineering reasoning (sag/tension, ice/wind loading, joint-use ownership,
OTMR timelines, ADSS/OPGW selection, PON/FTTH topology, make-ready cost allocation, QA checklist
logic) is sound and internally consistent.

## Mechanical citation↔log diff (D027-ref1) — CLEAN

Extracted all 26 distinct `citation` strings across the 15 pool files. **All 26 trace cleanly** to
a `_research/T05.md` row (main citation table, "UNVERIFIED-EXACT / hedged items" section, or
"Additional citations used in L11-L14 / T05-final" table) — zero unlogged citations. This is the
cleanest citation↔log match of any topic red-teamed so far (T04: 7/23 unlogged; T09: 1/39
unlogged; T05: 0/26 unlogged), continuing the D027 improvement trend.

## Prose-consistency sweep — PASS

Spot-checked the two densest hedged citations (Rule 232, Rule 261) against their live lesson JSX
prose (`L02-vertical-clearance-rule-232.jsx`, `L04-grades-of-construction.jsx`) — both consistently
use "approximately/≈" language and explicit confirm-before-design-signoff notes, matching the
pool's hedging. No pool-vs-prose contradiction found (the defect class that produced the T03-L05
HIGH and the T04 §32.2230 HIGH findings in prior topics).

## Note (not a pool defect) — L03's formative quiz has the same legacy-schema bug as T09-L07

`L03-comm-to-supply-separation-rule-235.jsx` has a first, *formative* `<Quiz>` ("Identify the Rule
235 Safety-Zone Violation," 2 questions) that uses a legacy `question/options/correct` schema
instead of `prompt/choices/answerIndex`. `Quiz.jsx`'s normalizer doesn't scan `options[].correct`
(same gap documented in the T09-L07 wiring commit), so this formative quiz silently grades the
FIRST choice as correct regardless of which is actually right. **This is not the graded quiz** (the
graded `T05.L03 Check` — now wired to `GatedAssessment` — uses the correct modern schema and is
unaffected), so it's out of scope for a pool red-team, but flagging it here since it's a live,
still-broken formative-content bug in the same file family as the one I fixed in T09. Recommend a
small standalone fix (same conversion pattern as T09-L07) when convenient.

## Verdict

**CLEAN PASS.** All 134 questions are structurally sound, correctly keyed, and arithmetically
correct. UNVERIFIED-EXACT hedging is applied correctly and consistently across every paywalled-NESC
citation, in both the pool and the live lesson prose — this was the CEO's specific concern for T05
and it holds up cleanly. Citation↔log match is the best of any topic so far (0 gaps). **T05 is
AUDIT-READY as authored.** One out-of-scope note: `L03`'s formative (non-graded) quiz has the same
legacy-schema silent-mis-grading bug fixed in T09-L07 — a small standalone cleanup item, not a
pool defect.
