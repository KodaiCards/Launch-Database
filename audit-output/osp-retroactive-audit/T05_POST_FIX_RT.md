# T05 Post-Fix RT — NESC & Pole Loading
**Framing:** Combined pedagogy + technical (single-RT per dispatch throttle)
**Scope:** All 13 canonical findings + regression scan + math re-derivation
**Files reviewed:** T05/L01–L15, T07/L01/L04/L06, T08/L10, fix commits b854725 / a290c9e / 8a38d7a / ac99fef / 7370629
**Date:** 2026-05-16

---

## Per-Finding Verdict Table

| ID | Severity | Verdict | Notes |
|----|----------|---------|-------|
| F1 | HIGH | VERIFIED | L15 present. 25Q MC, Quiz + WorkedExample present. 4 domains: 30/25/25/20%. Pass threshold 70%. All `prompt`/`choices`/`answerIndex` fields correct (NOT `question`/`options`/`correctIndex`). All 25 answerIndex values match rationale. See regressions for sanity-check error. |
| F2 | MED | VERIFIED | `ANSI O5.1 [confirm edition]` at L05 flashcard (line 222) and WorkedExample paragraph (line 338). |
| F3 | MED | VERIFIED | L02 has explicit red callout box "FHWA 14 ft vs. NESC 15.5 ft: A Critical Distinction" with both values, the distinction, and the risk. |
| F4 | MED | VERIFIED | L01 has `GA PSC Rule 515-2-9-.05` callout with psc.ga.gov reference and RUS layering explanation. |
| F5 | MED | VERIFIED | L07/L08/L10/L12/L13/L14: `span` + `attachment` → `T01.L02` confirmed. L12 also has FDH/NAP/OLT/ONT → `T01.L01` (correct, T01.L01 introduces those terms). |
| F6 | MED | VERIFIED | T07.L06: `make-ready → T05.L08` ✓, `OTMR → T05.L09` ✓. |
| F7 | MED | OVERSTATED (partial fix only) | T07.L01: `clearance → T05.L02` ✓ (was T05.L04, now correct). BUT `sag → T05.L05` still present — fix only changed `clearance`. T05.L05 does NOT introduce `sag`; T01.L02 introduces it (confirmed: `vocabulary_introduced` in T01/L02.parts-of-a-pole.jsx line 22). The canonical said fix to `T05.L02` but T05.L02 introduces `sag formula`, not `sag`. Residual broken pointer: `sag → T05.L05` should be `sag → T01.L02`. |
| F8 | MED | VERIFIED | T07.L04: `clearance → T05.L02` ✓, `NESC Rule 232 → T05.L01` ✓, `make-ready → T05.L08` ✓. |
| F9 | MED | VERIFIED | T08.L10: `pole-loading → T05.L05` ✓, `loading district → T05.L06` ✓. |
| F10 | LOW | VERIFIED | L06 line 334: intermediate now reads `179.07 / 144`. Sanity sentence below confirms `57 × 3.14159 / 144 = 179.07 / 144 = 1.2435 ≈ 1.244`. |
| F11 | LOW | VERIFIED | L10 Flashcard deck has 3 cards: adss, aeolian, span-rating. No EDS flashcard. EDS in vocabulary_assumed → T03.L04 (correct). |
| F12 | LOW | VERIFIED | L04 `vocabulary_assumed` now has `{ term: 'Grade B crossing', source_lesson_id: 'T05.L02' }` (line 41). L02 introduces it; L04 expands it. Dual-introduction resolved. |
| F13 | LOW | VERIFIED | L06 has new orange callout box naming Glynn, Camden, Brantley, Charlton counties + 60-ft Rule 250C threshold + map-verification guidance. L15 Q08 also covers Glynn County 65-ft scenario correctly (answerIndex 2, explanation correct). |

---

## Math Re-Derivation Log

### L15 WorkedExample sanity-check string — WRONG reference numbers

The `sanityCheck` prop at L15 lines 111 states:
> `"H = 640 lb; no-wind sag ≈ 1.75 ft; wind-loaded sag ≈ 2.36 ft; clearance margin ≈ +6.14 ft under wind"`

Independent derivation with the scenario inputs (RTS=3200, EDS=0.20, w=0.280 lb/ft, OD=0.68 in, wind=9 psf, L=200 ft, attach=24 ft, reqd=15.5 ft):

| Value | sanityCheck string | Derived | Match? |
|-------|-------------------|---------|--------|
| H (lb) | 640 | 640 | ✓ |
| No-wind sag (ft) | ≈1.75 | 2.19 | ✗ |
| Wind-loaded sag (ft) | ≈2.36 | 4.55 | ✗ |
| Clearance margin (ft) | ≈+6.14 | 3.95 | ✗ |

The widget computes correctly at runtime (expressions verified). The static `sanityCheck` string was not updated when the scenario was authored. **Learners who read the sanity check as a reference answer will get wrong values.** This is a LOW–MEDIUM content error in the capstone.

Fix-agent should: correct sanityCheck to `"H = 640 lb; no-wind sag ≈ 2.19 ft; wind-loaded sag ≈ 4.55 ft; midspan under wind ≈ 19.45 ft; clearance margin ≈ +3.95 ft — design passes comfortably for a 24 ft attachment in the Light district."`.

### L15 Q09 — VERIFIED

s = (0.145 × 22,500) / (8 × 600) = 3,262.5 / 4,800 = 0.680 ft. answerIndex 1 (choice B) ✓.

### L15 Q12 — LABELED INCONSISTENCY (low impact)

s = (0.200 × 120²) / (8 × 800) = 2,880 / 6,400 = 0.450 ft. Midspan = 21 − 0.450 = 20.55 ft. Margin = 5.05 ft. Choice A is labeled "+4.57 ft" but explanation says "Closest answer: +4.57 ft. (Exact: 5.05 ft.)". The exact answer (5.05 ft) is closest to choice A (4.57 ft, difference 0.48 ft) vs choice D (+6.00 ft, difference 0.95 ft), so answerIndex 0 is defensible as "closest." However, a better label for choice A would be "+5.05 ft". Not a blocking error — the explanation flags the discrepancy.

### L15 Q13 (ice load) — VERIFIED

w_ice = 1.244 × 0.50 × (0.82 + 0.50) = 1.244 × 0.660 = 0.821 lb/ft. answerIndex 2 (choice C) ✓.

### L15 Q15 (90° corner tension) — VERIFIED

√(500² + 500²) = √500,000 = 707.1 lb. answerIndex 1 (choice B = 707 lb) ✓.

### L15 Q18 (combined load) — INCONSISTENCY

Problem states: w=0.145, w_ice=0.821, w_wind=0.607. Independent derivation:
w_combined = √((0.145 + 0.821)² + 0.607²) = √(0.966² + 0.607²) = √(0.9332 + 0.3684) = √1.3016 = **1.141 lb/ft**.
Marked answer C = "≈1.240 lb/ft". Explanation acknowledges: "the exact value is ≈1.140 lb/ft; the lesson worked example uses slightly different inputs producing 1.240 lb/ft." The question's own stated inputs produce 1.141 lb/ft, not 1.240 lb/ft. An MC question where the marked-correct answer (C) does not match the derivation from the question's own numbers is a content error. Students who work it correctly (1.141 lb/ft) find none of the choices match cleanly — the closest unmarked choice is either A (1.573) or C (1.240). Fix-agent should: either update the inputs to produce ≈1.240 lb/ft, or update choice C to ≈1.141 lb/ft with matching explanation.

### L15 Q20 (1.244 derivation) — VERIFIED

57 × π / 144 = 57 × 3.14159 / 144 = 179.07 / 144 = 1.2435 ≈ 1.244. answerIndex 0 ✓.

---

## Regression Scan

- **F5-F9 mass-edit:** All source_lesson_id changes verified against the introducing lesson's vocabulary_introduced. No unrelated correct pointers broken.
- **F1 capstone vocab_assumed reachability:** All 25 Q explanations reference lessons within T05.L01–L14 or T03.L04. No term references a lesson not reachable through the T05 DAG.
- **F12 L04 vocab_assumed addition:** Adding `Grade B crossing → T05.L02` to L04 is additive. No existing pointer was changed. No regression.
- **JSX syntax:** All five fix commits reviewed. No unclosed template literals, stray quotes, or bracket mismatches detected in the touched files.
- **Build integrity:** `7370629` (status-update commit) touches only `T05_FIX_CANONICAL.md`. No lesson files changed in that commit.

---

## Summary

| Category | Count |
|----------|-------|
| VERIFIED | 11 |
| OVERSTATED (partial fix) | 1 (F7 — sag pointer in T07.L01) |
| FALSE-POSITIVE | 0 |
| UNCLEAR | 0 |
| New regressions | 2 (WorkedExample sanity numbers wrong; Q18 answer-label mismatch) |

---

## Verdict: YELLOW

**11 of 13 findings fully VERIFIED.** Two issues prevent GREEN:

1. **F7 incomplete (OVERSTATED):** T07.L01 still has `sag → T05.L05`. Fix agent should: change to `{ term: 'sag', source_lesson_id: 'T01.L02' }` (T01.L02 introduces sag per confirmed vocabulary_introduced).

2. **L15 WorkedExample sanityCheck wrong values (new regression):** Static sanity string gives 1.75 ft / 2.36 ft / +6.14 ft but correct math gives 2.19 ft / 4.55 ft / +3.95 ft. Fix-agent should update the sanityCheck string.

3. **L15 Q18 answer-label inconsistency (new regression):** Given inputs yield 1.141 lb/ft, but correct answer labeled 1.240 lb/ft with acknowledgment the numbers don't match. Fix-agent should harmonize inputs and answer.

Items 2 and 3 are in the new L15 capstone (F1 fix), not in the original 12 findings. T05's pre-existing material (L01–L14) is CLEAN on all verified findings.

=== T05 POST-FIX RT END ===
