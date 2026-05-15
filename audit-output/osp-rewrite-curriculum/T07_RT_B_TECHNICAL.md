# T07 Staking — Red-Team B: Technical Accuracy + Math + Citations

**Framing:** Technical accuracy, independent math re-derivation, citation verification
**Verdict: YELLOW — 1 MEDIUM + 3 LOW findings**
**Date:** 2026-05-16

---

## Summary (≤80 words)

All 15 capstone MC answers and all per-lesson quiz answers independently re-derived and verified correct. All WorkedExample math verified via Python computation. Citations trace to allowlist sources. One MEDIUM internal inconsistency: NESC Rule 235 comm-to-comm minimum stated as 0.5 ft (6 in) in L04 WorkedExample vs. 1.0 ft (12 in) in L06 working tier and L09 scenario — contradictory for learners reading both, though no wrong scenario outcome results. Three LOW findings: vocabulary_introduced schema divergence (L06–L09), missing `[confirm edition]` on L07 bore depth claim, and L06 OTMR classification characterization slightly imprecise.

---

## Numerical-Claim Verification Table

| Location | Claim | Re-derived Result | Status |
|---|---|---|---|
| L04 WE | delta = measured − assumed = 25.5 − 28.5 = −3.0 ft | −3.0 ft ✓ | CLEAN |
| L04 WE | H_new_actual = 25.5 ft − 3.0 ft = 22.5 ft | 22.5 ft ✓ | CLEAN |
| L04 WE | Sep_actual = 25.5 − 21.0 = 4.5 ft | 4.5 ft ✓ | CLEAN |
| L04 WE | Road clearance: 22.5 ft > 18.0 ft → no MR | 22.5 > 18.0 ✓ | CLEAN |
| L04 WE | Sep_min labeled "NESC Rule 235, comm-to-comm" = 0.5 ft | — | **MEDIUM-1** (contradicts L06/L09) |
| L06 inline | 31.2 − 28.0 = 3.2 ft; threshold 3.33 ft → CONFLICT | 3.2 < 3.33 ✓ | CLEAN |
| L06 inline | comm-to-comm 1.5 ft > 1.0 ft → OK | 1.5 > 1.0 ✓ | CLEAN |
| L06 Pole 12 | supply-to-comm 4.5 ft > 3.33 ft → OK | 4.5 > 3.33 ✓ | CLEAN |
| L06 Pole 12 | telecom-to-telecom 1.3 ft > 1.0 ft → OK | 1.3 > 1.0 ✓ | CLEAN |
| L06 Pole 12 | CATV-to-telecom 2.7 ft > 1.0 ft → OK | 2.7 > 1.0 ✓ | CLEAN |
| L02 Q1 | STA 5+50 − STA 4+00 = 150 ft | 150 ft ✓ | CLEAN |
| L04 Q1 | measured 24.5, assumed 27.0 → delta −2.5 ft | −2.5 ft ✓ | CLEAN |
| L04 Q5 | 16.0 ft < 18.0 ft road clearance → MR required | 16 < 18 ✓ | CLEAN |
| L06 Q1 | 3.0 ft < 3.33 ft → conflict | 3.0 < 3.33 ✓ | CLEAN |
| CAP Q04 | 28.0 − 26.0 = 2.0 ft = 24 in > 12 in → no conflict | 24 > 12 ✓ | CLEAN |
| CAP Q06 | 27.0 − 24.8 = 2.2 ft > 1.0 ft → no conflict | 2.2 > 1.0 ✓ | CLEAN |
| CAP Scenario A1 | 27.2 − 26.0 = 1.2 ft > 1.0 ft → OK | 1.2 > 1.0 ✓ | CLEAN |
| CAP Scenario A2 | 27.2 − 26.5 = 0.7 ft < 1.0 ft → CONFLICT → transfer | 0.7 < 1.0 ✓ | CLEAN |
| L07 diagram | 36 in. min. below pavement per RUS 1751F-635 §6 | plausible; no `[confirm edition]` | **LOW-2** |

---

## Citation Verification Table

| Lesson | Citation | Allowlist Match | Status |
|---|---|---|---|
| L01 | OSHA 1910.268(g)(1) fall protection above 10 ft | OSHA 1910.268 ✓ | CLEAN |
| L01/L04/L05 | RUS Bulletin 1751F-630 §2/§7 aerial documentation | RUS 1751F-630 ✓ | CLEAN |
| L05 | RUS Form 740 "Contractor's Statement and Acknowledgment" | RUS Form 740 ✓ | CLEAN |
| L06 | 47 CFR 1.1411 OTMR rule | 47 CFR Part 1.1401–1.1424 ✓ | CLEAN |
| L06/L09 | NESC Rule 232 (clearances) + Rule 235 (separation) | NESC C2-2023 Rule 232/235 ✓ | CLEAN |
| L07 | APWA Uniform Color Code (orange, red, yellow, blue, white) | APWA ✓ | CLEAN |
| L07 | OSHA 1926.651 excavation | OSHA 1926.651 ✓ | CLEAN |
| L07 | RUS 1751F-635 §6 bore depth 36 in. pavement | RUS 1751F-635 ✓ (section TBD) | LOW-2 |

---

## Quiz Answer Re-Derivation

All per-lesson quiz answer indices (L01–L09) independently re-derived. All capstone Q01–Q15 re-derived. Summary of selected checks:

| Quiz item | Expected answerIndex | Independent derivation | Match |
|---|---|---|---|
| L01 Q: staker primary deliverable | staking sheets + field notes | field-data-to-engineer definition ✓ | ✓ |
| L02 Q1 distance STA 4+00 to 5+50 | 150 ft | 550 − 400 = 150 ft ✓ | ✓ |
| L04 Q1 delta (24.5 − 27.0) | −2.5 ft | arithmetic ✓ | ✓ |
| L04 Q5 clearance 16.0 ft road | MR required | 16 < 18 ✓ | ✓ |
| L06 Q1 3.0 ft gap | conflict | 3.0 < 3.33 ✓ | ✓ |
| CAP Q04 28.0 − 26.0 = 2.0 ft | no conflict | 24 in > 12 in ✓ | ✓ |
| CAP Q06 27.0 − 24.8 = 2.2 ft | no conflict | 2.2 > 1.0 ✓ | ✓ |
| CAP Q08 12° lean + hollow rot | force pole | consistent with L06 classification ✓ | ✓ |
| CAP Scenario A1 1.2 ft gap | OK, continue | 1.2 > 1.0 ✓ | ✓ |
| CAP Scenario A2 0.7 ft gap | CONFLICT → transfer | 0.7 < 1.0 ✓ | ✓ |

All 15 capstone MC answers verified correct. All per-lesson quiz answers verified correct.

---

## Cross-Lesson Conflicts

### MEDIUM-1 — NESC Rule 235 comm-to-comm minimum (L04 vs. L06 and L09)

**L04 WorkedExample** (foundations tier, structural verification section):
> `Sep_min = 0.5 ft (6 inches) — NESC Rule 235, comm-to-comm`

**L06 working tier** (make-ready classification section):
> comm-to-telecom minimum 12 inches (1.0 ft), per NESC Rule 235

**L09 BranchingScenario** (QA step):
> Pole 18 telecom at 28.5 ft, fiber at 29.0 ft → separation 0.5 ft = 6 in < 12 in required → CONFLICT

**Analysis:** L04 uses 0.5 ft (6 in) as the pass threshold; L06 and L09 use 1.0 ft (12 in) for the same requirement. In L04 the actual computed separation is 4.5 ft — satisfying both values — so no incorrect scenario outcome or wrong quiz answer results. But a learner reading L04 then L06 encounters two different minimums for the same NESC rule without explanation. The L10 capstone consistently uses 1.0 ft (12 in), aligned with L06/L09. Both L04 and L06 correctly carry `[confirm edition]` on NESC in other places; this specific comparison lacks the marker on L04's threshold statement.

**Recommended fix:** Harmonize to one value (likely 12 in / 1.0 ft, consistent with L06/L09/L10 majority) or explicitly note in L04 that the minimum varies by NESC edition and flag both with `[confirm edition]`.

---

## LOW Findings

### LOW-1 — vocabulary_introduced export schema diverges L06–L09 vs. L01–L05

L01–L05 export `vocabulary_introduced` as an array of string term names, consistent with `lesson-schema.md`. L06–L09 export `vocabulary_introduced` as a dict `{term: definition}` at module level, then compute `key_terms` via `Object.entries()`. The `meta.vocabulary_introduced` field in these lessons correctly lists string keys (matching the schema), but the module-level named export shape differs. Any downstream consumer that imports `vocabulary_introduced` directly expects the L01–L05 array shape and will receive a dict from L06–L09.

**Affected files:** L06, L07, L08, L09.

### LOW-2 — Missing `[confirm edition]` on L07 bore depth claim

L07 diagram fallbackDescription: "36 in. min. below pavement surface per RUS 1751F-635 §6"

RUS 1751F-635 is the correct source per the allowlist. The §6 reference and 36-inch value are plausible but are not independently verifiable from available secondary sources. The standard editorial practice established in T04/T05 and in the research allowlist is to mark unverified section-level citations with `[confirm edition]`. This marker is absent here.

### LOW-3 — L06 OTMR simple/complex characterization slightly imprecise

L06 states that staker documentation "determines" whether make-ready work is simple or complex under 47 CFR 1.1411. More precisely: the nature of the work itself (whether it involves communications-only transfers vs. work touching supply conductors) determines simple vs. complex classification; staker documentation supports and evidences that determination. The current phrasing could lead learners to think the staker has discretion to classify — when in fact the classification follows from what the work physically is. Not factually wrong but potentially misleading on the staker's role.

---

## What Was Checked and Confirmed Clean

- All per-lesson quiz answers across L01–L09: independently re-derived, all correct
- All 15 capstone MC questions: independently re-derived, all correct
- All BranchingScenario branch outcomes: path logic verified against stated thresholds
- Height delta formula consistency: H_new_actual = measured − (assumed − measured) pattern consistent across L04, L05, L09, L10
- Make-ready flag categories (transfer / replacement / force pole): consistent across L06, L09, L10
- Force pole classification threshold (structural condition + lean): consistent L06 and CAP Q08
- GPS accuracy tiers: L03 (smartphone ±5–10 m, Garmin ±3 m, RTK ±2 cm) consistent with L08 (smartphone ±5–15 m, handheld ±3–5 m, RTK ±2–5 cm) — overlapping ranges, not contradictory
- Stationing arithmetic: verified correct in L02, L04, L10
- RUS Form 740 name and description: exact match to allowlist
- 47 CFR 1.1411 OTMR citation: correct
- APWA color codes: all five verified correct (orange/red/yellow/blue/white)
- NESC Rule 232 clearance values (18 ft roads, 15.5 ft pedestrian, 17.5 ft waterways): consistent across lessons and internally consistent
- OSHA 1910.268(g)(1) fall protection above 10 ft: correctly cited
- Prerequisite metadata: T07 declares T01, T04, T05, T06, T18 prerequisites — consistent with DAG requirements for a field measurement + make-ready topic
- Flashcards: present in all 10 lessons (L01–L10)

---

## Coverage Gaps

- NESC Rule 235 exact numerical values not independently verifiable from open secondary sources (NESC C2-2023 is paywalled); the 12-in value in L06/L09 is the more commonly cited secondary-source figure, but the 6-in value in L04 cannot be ruled out as valid for a specific edition or sub-category. A subject matter expert with NESC C2-2023 access should confirm before harmonizing.
- RUS 1751F-635 §6 bore depth (36 in pavement) not independently verifiable from open sources; flagged as LOW-2 above.
- BranchingScenario `initialState` vs `initialNode` prop name difference (L06 vs L02) was observed but not resolved — this is a component API question, not a content accuracy question; out of scope for technical RT framing.

---

`=== T07 RT-B REPORT END ===`
