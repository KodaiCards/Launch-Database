# T18 content audit — Safety & OSHA assessment pools (96Q)

> Auditor working report (second CONTENT audit, first picked up via D026 self-pick from the CEO branch's ▶ AUDIT-READY marker, not a Planning per-package dispatch). Graded vs Opus baseline `docs/audit/assignment-1.md` + my own `docs/audit/T01-content.md`, same rigor. Detail here; thread carries a short summary + pointer (D018).
> Scope: `content/training/assessment-pools/T18-L01..L09.json` + `T18-final.json` (96Q) + `_research/T18.md` + `_research/T18-redteam.md`, CEO branch `claude/ceo-fresh-instance-boot-u2zw28` @ AUDIT-READY commit `80be0a3`. Author = C1, red-team = C2. Method: same as T01 — independent structural re-check (own script, own engine-loader run), independent WebSearch re-derivation of the highest-stakes safety citations (not trusting C1/C2's tables), and — learning from the O48 miss in T01, where I initially trusted "the JSX prose is fine" without checking — an independent grep + spot-verify of the T18 lesson JSX prose this time, not just the pools. Last updated 2026-07-02.

## Headline

**T18 clears the gate — clean, no O48-equivalent found.** This is a genuinely stronger authoring pass than T01: the source lesson JSX was already well-cited going in (0 accuracy errors found in prose, vs. T01's 5), and the citation-pre-check trial (softening the weak RUS 1751F-810 citation *before* it reached a pool question) worked exactly as designed. One real gap survives from the fix-pass re-check — smaller and lower-stakes than T01's — logged below. Safety-critical numbers (fall-protection height, LOTO sequence, O2 range, glove voltage classes, MAD methodology, OSHA reporting windows, silica PEL, body-belt prohibition date) were independently re-verified via WebSearch and are all correct.

---

## 1. Pool set — independent structural re-check (own tooling)

Same script as T01, run fresh against the T18 files:
- **96 questions**, 9×8 lesson pools + 24 topic-final, matching the readme dial exactly (draw-4/pool-8/pass-70 lessons; draw-15/pool-24/pass-80 final) — identical shape to T01.
- **Zero banned types, zero bad `answerIndex`, zero malformed `correctMap`.**
- **Real engine loader** (`routes/_assessment_pools.js` `listPools()`) loads all 20 pools now present (10 T01 + 10 T18) with no errors — confirms T18 doesn't collide with or break the merged T01 set.
- **Engine test suite** (`tests/assessment_engine.test.js`) still 10/10 — no regression from adding a second topic's pools.

## 2. Independent citation spot-checks (safety-critical facts, WebSearch-verified)

Given this is OSHA/life-safety content (unlike T01's mostly-procedural facts), I verified the highest-consequence numbers myself rather than sampling lightly:

| Fact | My independent WebSearch result | Verdict |
|---|---|---|
| 29 CFR 1910.268(g): fall protection required >4 ft on poles (telecom/general-industry) | Confirmed verbatim via osha.gov standard text: "positions more than 4 feet (1.2 m) above the ground, on poles." | ✅ Correct |
| 29 CFR 1904.39: fatality = 8-hr report, hospitalization/amputation/eye-loss = 24-hr | Confirmed verbatim via osha.gov + eCFR. | ✅ Correct |
| 29 CFR 1926.502(d): body belts prohibited for fall arrest since January 1, 1998 (construction-specific) | Confirmed verbatim via osha.gov: "Effective January 1, 1998, body belts are not acceptable as part of a personal fall arrest system," codified at 1926.502(d). | ✅ Correct — and confirms the fix-pass rewrite of `T18-L04-Q6` correctly scoped this to construction, not 1910.268 |
| ASTM D120 / 1910.137 glove classes: 00≤500V, 0≤1000V, 1≤7500V, 2≤17000V AC | Confirmed exactly via osha.gov + industry glove-class references. | ✅ Correct |
| 29 CFR 1910.140(c)(13): anchorage 5,000 lbf OR engineered 2:1 safety factor (consistent with the 1,800 lbf MAF logged for PFAS) | Confirmed via osha.gov: 5,000 lbf per employee, or qualified-person-engineered 2:1 safety factor — and independently the math checks out (1,800 lbf MAF × 2 = 3,600 lbf minimum engineered anchorage, under the 5,000 lbf default). **Note: this citation appears in the L04 JSX prose but has no row in `T18.md`'s citation table** — it wasn't run through the citation-log gate, unlike everything else in that lesson. It happens to be correct (verified above), so not a defect, but it's a real citation-log gap the same shape as the JSX-prose gaps T01 had, just in this case landing on an accurate fact. Worth a process note. |

**No divergence found** between my independent verification and C1's `T18.md` table on any of the above.

## 3. T18 lesson JSX prose — independently checked (learning from the T01 miss)

In T01 I initially accepted "the JSX prose is fine" at face value in my first pass and only caught the pool-level echo of the citation gap after the CEO flagged it. This time I grepped the T18 lesson JSX directly rather than trusting the research log's "no content-accuracy issues... in the underlying T18 lesson JSX" claim:

- Read every CFR/ANSI/OSHA/MUTCD citation in `L04-fall-protection-poles-aerial-lifts.jsx` (the highest citation-density T18 lesson) — all consistent with the verified log, plus the one 1910.140(c)(13) instance noted above.
- Spot-checked citations in `L02` (LOTO), `L07` (energized conductors), `L09` (incident reporting) JSX prose against the same verified facts — no mismatches found.
- **Result: no O48-equivalent in T18.** The CEO's own claim that T18's source prose was unusually well-cited holds up under independent re-check.

## 4. Re-check of the fix-pass items

- **`T18-L04-Q6`** — re-read the actual question JSON (not the redteam report's description). C1's fix is a genuine rewrite, not a citation bolt-on: the question now directly teaches the cross-standard distinction (1926.502's 1/1/1998 date doesn't bind 1910.268, but ANSI Z359.11's full-body-harness requirement applies regardless) rather than either wrongly asserting the construction date binds telecom or silently dropping the fact. Verified the underlying date/scope claim independently via WebSearch (§2 above) — accurate. **Real fix.**
- **9 backfilled log rows** — spot-checked 4 of the 9 directly against their pool citations (`T18-L01-Q6`↔1926.32(f) competent-person, `T18-L03-Q4`↔1910.146(i) attendant duties, `T18-L04-Q2`↔ANSI Z359.1/.11, `T18-L08-Q5`↔1910.151(c) eyewash) — all resolve to real, accurate rows. **Real backfills, not just added-and-unlinked.**

## 5. Citation-pre-check trial (D019) — verified working

The RUS 1751F-810 citation was flagged during authoring (not after red-team) as unable to be confirmed at the individual-bulletin-title level, and `T18-L07-Q7` was written to test only the series/topic association rather than assert the unconfirmed exact title as fact. I independently re-read the question text — it does correctly hedge ("part of the 1751F-8xx electrical-protection/grounding series," not "titled X exactly"). **This is the trial working as intended** — the same failure mode that produced 2 uncited zero-log-row misses in T01 was caught and prevented before it reached a pool question here.

## 6. Remaining paper-trail gap (lower stakes than T01's)

C2's red-team already flagged 9 questions citing sources with no `T18.md` row before the fix pass, and all 9 were backfilled (§4). Adding my own finding from §2: **`1910.140(c)(13)` in the L04 JSX prose is a 10th instance of this same pattern** — accurate, but never logged. Not a merge-blocker (verified correct), but consistent with the CEO's own standing observation that "log every citation, not just the ones flagged as uncertain" deserves to become a firm authoring convention rather than a recurring post-hoc catch (T01 had 4 such gaps, T18 had 9 + this one from prose = 10).

## Gate integrity + pedagogy

- **Author ≠ RT:** confirmed via commit provenance — `84f2742` (C1 author) → `b8870e8` (C2 red-team, FINDINGS) → `7a9da2a` (C1 fix) → `80be0a3` (C2 re-check, PASS). Same shape as T01.
- **Pedagogy spot-check:** read samples from L02 (LOTO), L07 (energized conductors), T18-final directly — unambiguous single correct answer, plausible distractors, no leading stems. Matches C2's claim.
- **SPA wiring:** confirmed all 9 lesson JSX files pass matching `assessmentId="T18-L0N"` — reachable from live lesson pages.

## Verdict

**T18 (96Q) CLEARS THE GATE — clean pass, no merge-blocking findings.** Stronger authoring pass than T01 (0 JSX-prose accuracy errors vs. T01's 5; citation-pre-check trial demonstrably worked). One informational note (not a defect, not a blocker): a 10th uncited-but-accurate citation instance (`1910.140(c)(13)`) found in JSX prose, reinforcing the CEO's "log every citation" process proposal. Recommend Planning close that proposal loop — it's now evidenced twice (T01: 4 gaps, T18: 9+1 gaps) as a recurring authoring-discipline gap worth fixing at the process level rather than catching per-topic at red-team/audit time.
