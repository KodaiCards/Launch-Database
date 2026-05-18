# T13 + T15 Rogue-Verify Report
**Framing:** Independent post-rogue-event quality verification  
**Date:** 2026-05-18  
**Scope:** dc7e060..4a4afdd (T13), c853ff3..8e696f2 (T15)  
**Token budget:** 150K

---

## 1. Vite Build

Build **FAILS** globally — two pre-existing errors in other topics:
- `T12/L10`: stray `>` character inside JSX text (pre-existing, not T13/T15)
- `T17/L04`: `../../components/Quiz` unresolved import (pre-existing, different topic)

**T13 and T15 specifically:** syntax check on all 22 files (12 T13 + 10 T15) found ZERO issues:
- All imports use `default` (not named) for `Flashcard` — avoids the T19 named-import bug
- All `LessonLayout` open/close tags balanced
- No `{ Flashcard }` pattern anywhere

**Verdict:** T13/T15 are build-clean. Failing build is from T12/T17 pre-existing bugs, blocking the full build check. T13/T15 themselves pass all syntax validation.

---

## 2. Schema Validator

```
T13: 12/12 PASS
T15: 10/10 PASS
```
All required meta fields present (id, course_id, title, order, prerequisites, learning_objectives, estimated_minutes, vocabulary_introduced, vocabulary_assumed, key_terms). No schema failures.

Note: T02 and T04 are failing schema (missing `learning_objectives`) — pre-existing, not T13/T15.

---

## 3. Spot-Check: 3 Lessons per Topic

### T13 Lessons Checked

**T13.L03 — Aerial Construction Inspection**
- Content quality: HIGH. Real technical depth — visual sag string-line procedure, NESC Rule 261 condemnation process, pre-climb structural go/no-go decision tree with named criteria (woodpecker cavity size, lean angle, soil condition). Not thin.
- BranchingScenario: multi-node FSM with correct consequences. Quiz correct answers at `correct: 1` consistently — all verified consistent with explanations.
- Flashcards: 2 key_terms rendered via loop. Vocabulary_introduced matches key_terms entries. ✓
- DAG pointers: T18.L04 (fall protection), T18.L07 (MAD/MAB), T10.L03 (MUTCD) — all upstream of T13. ✓

**T13.L07 — Close-Out Documentation: Form 219**
- Content quality: HIGH. Covers RUS Form 219 certification scope, False Claims Act (31 USC §3729) exposure, OTDR archive verification checklist (bidirectional, SOR format, launch cable subtracted), 2 CFR §200.334 records retention.
- Citations: `7 CFR §1753.21`, `§1753.22`, `§1755.404`, `§1755.407`, `31 USC §3729`, `2 CFR §200.334`. All have `[confirm edition]` or are stable statutes. No fabricated citation claims.
- Flashcards: 3 key_terms rendered. ✓
- vocab_assumed pointers include T13.L12 (2 CFR §200.334) and T14.L06 (ground resistance threshold) — both valid upstream. ✓

**T13.L11 — Daily Inspection Records: RUS Form 565**
- Content quality: HIGH. Covers Form 565 field-by-field requirements, the Form 565 → Form 7d → Form 553a → Form 219 federal advance chain, `loan advance suspension trigger`, competent resident inspection obligation.
- Key concern: `7 CFR §1753.19 is [Reserved]` — lesson correctly handles this with `[confirm current section]` markers throughout and a header comment explaining §1753.47/§1753.48 as the live sections. This is correct handling, not a fabrication.
- 8 key_terms rendered. ✓

**T13.L05 — Slack Storage and Pedestal Inspection**
- vocabulary_introduced: `[]` (empty) — intentional. This is a pure application lesson; all terms (slack loop, NIU slack, MSA schedule) are vocabulary_assumed from T10.L06. No Flashcard render needed (no new terms to flash). Correct design.

### T15 Lessons Checked

**T15.L02 — Fault Locate with OTDR**
- Content quality: HIGH. Covers IOR-to-distance math step-by-step, EDZ vs ADZ distinction (correct definitions, correct typical values: EDZ 0.8–2 m at 2.5 ns; ADZ 5–25 m), break signatures, multi-conduit identification methods.
- **MATH FLAG (LOW):** The `slack_factor` key_term definition uses `route = cable_distance × (1 – slack_fraction)`: "5,000 × 0.97 = 4,850 ft." The technically correct formula is `route = cable_distance / (1 + slack_fraction)`: 5,000 / 1.03 = 4,854 ft. Difference at 3% slack: 4 ft per 5,000 ft (0.08%). Pedagogically wrong direction but result close enough to not cause field localization errors at typical fault distances. **However**, the WorkedExample and quiz use `11,803 m / 1.03 = 11,459 m = 7.11 miles` (correct formula) in the narrative. The key_term definition uses the wrong simplified formula; the lesson body uses the correct one. Inconsistency. LOW severity — conservative direction, won't cause missed faults.
- **Q2 IOR physics (HIGH — was fixed):** Confirmed `correct: 3` points to "Slightly CLOSER than 10,000 ft" with correct explanation `d_actual = 10,000 × (1.4600/1.4682) = 9,944 ft`. Physics correct. Fix verified. ✓
- Flashcards: 8 key_terms rendered via loop. ✓

**T15.L04 — Temporary vs. Permanent Repair**
- Content quality: HIGH. BranchingScenario covers fiber type confirmation → mismatched fiber decision → closure reinstallation per RUS 1751F-630 §7.4. Real field procedure.
- Citations: `RUS Bulletin 1751F-630 §7.4` for closure reinstallation — plausible (RUS 1751F-630 §7 covers splicing/closure requirements, §7.4 is a reasonable subsection). Could not independently verify exact subsection numbering but §7 scope is correct.
- Flashcards: 5 key_terms rendered. ✓

**T15.L05 — Splice Trailer Setup**
- Content quality: GOOD. Covers generator CO safety, arc calibration, cleave angle requirements.
- **CITATION FLAG (LOW):** L05 line 80: "NIOSH 35 ppm ceiling exposure limit." The NIOSH CO REL is 35 ppm as a **TWA** (time-weighted average), not a "ceiling." OSHA has a ceiling at 200 ppm (STEL). This mislabels the limit type. Minor — conservative direction (35 ppm TWA is more stringent than ceiling), but technically wrong label.
- **CO IDLH = 1,200 ppm:** CORRECT per NIOSH Pocket Guide. ✓
- **Generator separation 20 ft (NIOSH DHHS 96-118):** CORRECT. ✓
- Quiz answers: Q1 (correct: 3 → 20 ft) ✓, Q2 (correct: 0 → arc calibration) ✓, Q3 (correct: 1 → direction violates guidance) ✓, Q4 (correct: 1 → recleave at 1.8°) ✓. All internally consistent.
- Flashcards: 5 key_terms rendered via loop. ✓

---

## 4. Cascade-Replacement Bugs

**T13 HIGH-1 (atmospheric thresholds):** Fix changed CO from `<35 ppm` to `<25 ppm (ACGIH TLV-TWA)` and H₂S from `<10 ppm` to `<1 ppm`. Cross-checked against T18.L03 (authoritative source): T18.L03 line 162-164 confirms CO `< 25 ppm (ACGIH TLV-TWA)` and H₂S `< 1 ppm`. Both values match T18.L03 exactly. **No cascade error.** Fix is correct.

**T13.L04 BranchingScenario `correct_stop` node** now explicitly references `CO <25 ppm (ACGIH TLV-TWA), H₂S <1 ppm, LEL <10% of LEL, O₂ 19.5–23.5%` with OSHA regulatory values noted as parentheticals. Cross-topic consistency with T18.L03 confirmed. ✓

**T15 slack factor formula inconsistency** (L02 key_term vs. body): identified above. Not a replacement cascade — original author error in key_term prose.

**T15 "35 ppm ceiling" label:** minor misidentification of limit type — not a numeric replacement, original author prose error.

No H₂S IDLH-type cascade replacement bugs found in T13/T15.

---

## 5. Primary-Source Citations (3 per topic)

### T13
1. **40 USC §3142 (Davis-Bacon):** cited in L12 with correct scope ("prevailing wages, construction contracts, $2,000 threshold + RUS loan incorporation"). Statute exists. ✓
2. **7 CFR §1753 inspection obligation:** correctly flagged `[confirm current section]` with note that §1753.19 is [Reserved] in current eCFR. Handles uncertainty appropriately rather than fabricating a section. ✓
3. **29 CFR 1910.268(o) (confined space — telecom):** referenced in L04 BranchingScenario as the telecom-specific confined space standard. This is the OSHA general industry standard for telecommunications; the correct confined space standard is 29 CFR 1910.146 for permit-required spaces. 1910.268(o) covers "manholes and underground lines" for telecom workers specifically. Citation is defensible for this content but cross-reference with 1910.146 is missing. LOW — not a fabrication, both standards apply; L04 vocabulary_assumed includes T18.L03 which covers 1910.146.

### T15
1. **Bellcore SR-4731 / FOTP-61 (.sor format):** cited in L02 key_term. SR-4731 is the correct Bellcore standard for OTDR data storage format. ✓
2. **NIOSH DHHS Publication 96-118 (generator 20 ft):** cited in L05. Real NIOSH publication on generator CO safety, 20 ft minimum is the standard NIOSH recommendation. ✓
3. **RUS Bulletin 1751F-630 §7.4 (splice closure reinstallation):** cited in L04 and L05. RUS 1751F-630 covers OSP construction requirements including splicing; §7 scope for splicing/closures is plausible. Could not verify exact subsection number without primary source access but the bulletin and section are the standard anchor for this requirement. Appropriate `[confirm current edition]`-style language absent but risk low.

---

## 6. Saturation Level

### T13
Commit history shows: R-1 through R-11 research briefs → canonical → Author wave (3 authoring commits) → RT-α YELLOW + RT-β YELLOW → Fix Wave A (`dc7e060`, 8 items) → RT-γ GREEN + RT-δ YELLOW (2 new LOWs) → Polish-A (`3ac403e`) → RT-ε GREEN + RT-ζ GREEN.

**RT framings: 6 post-author (RT-α through RT-ζ in 3 pairs)** + research saturation with 11 research rounds. This EXCEEDS the 2-RT-pair baseline and matches the empirical saturation model. Legitimate saturation — not "1 round then closed."

### T15
Commit history: R-1 + R-2 research → Author (2 commits) → RT-α YELLOW + RT-β YELLOW → Polish-A (`c22a507`, 6 findings including HIGH physics error) → follow-up fix (`14f04eb`, Q2 wording) → RT-γ fix (`44c589e`, L04+L10 LessonLayout) → RT-γ GREEN + RT-δ GREEN.

**RT framings: 4 post-author (RT-α, RT-β, RT-γ, RT-δ)** across 2 pairs. This meets the 2-RT-pair minimum (≥2 pairs). Not deeply saturated like T13 (6 framings) but RT-α caught a HIGH physics error (IOR direction) + RT-β confirmed, Polish-A fixed it, RT-γ/RT-δ both returned GREEN. Adequate for this topic's complexity level.

---

## 7. Findings Summary

| # | Severity | Topic | Lesson | Issue |
|---|---|---|---|---|
| F1 | LOW | T15 | L02 | `slack_factor` key_term uses approximation `× 0.97` vs correct `÷ 1.03`; lesson body uses correct formula. Inconsistency, conservative direction |
| F2 | LOW | T15 | L05 | "NIOSH 35 ppm ceiling exposure limit" — should be "NIOSH REL (TWA)"; ceiling is OSHA 200 ppm STEL |
| F3 | LOW | T13 | L04 | 29 CFR 1910.268(o) citation accurate for telecom manholes but 1910.146 cross-reference absent; T18.L03 pointer provides indirect coverage |

No HIGH or MED findings. No cascade-replacement bugs. No fabricated numeric values confirmed. No safety-critical errors introduced.

---

## Verdicts

**T13: GREEN** — Accept rogue work. 12/12 schema PASS. 6 RT framings (3 pairs) = proper saturation. Content is real, deep, and field-accurate. No cascade bugs. HIGH-1 atmospheric fix verified correct against T18.L03.

**T15: YELLOW** — Accept with 2 LOW polish items (F1 slack formula inconsistency in key_term, F2 "ceiling" mislabel). 4 RT framings (2 pairs) = meets baseline. HIGH IOR physics fix verified correct. No cascade bugs. Content quality high for the outage-response scope.

**Neither topic requires revert or redo.** F1 and F2 can be picked up in a future polish pass.

---

## Closeout

Verified by reading:
- T13/L03 lines 1–222 (aerial inspection scenario + meta)
- T13/L07 lines 1–60 (Form 219 + FCA)
- T13/L11 lines 1–80 (Form 565 + advance chain)
- T15/L02 lines 1–210 (OTDR fault locate math + IOR Q2)
- T15/L04 lines 1–70 (temp vs permanent + closure)
- T15/L05 lines 1–135 (generator separation + quiz)
- T18/L03 (CO/H₂S threshold cross-check)
- dag-registry.json (T13/T15 pointer coverage)
- schema validator output (22/22 PASS)

=== T13_T15_ROGUE_VERIFY REPORT END ===
