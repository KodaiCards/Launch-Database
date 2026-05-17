# T08 POLISH-A Notes
**Commit:** e8cf7a9
**Date:** 2026-05-17
**Source:** RT-α `fff7b9f` + RT-β `63da79f` convergence on M-G5 (MED) + LOW notation sweep

---

## PRIMARY-SOURCE VERIFICATION LOG

**Question:** What do NESC Sections 24, 25, 26 and Rule 261 actually cover?

**Sources consulted (4 independent cross-corroborating sources):**

1. Search result synthesis from `store.accuristech.com/products/preview/2254672` (2023 NESC C2-2023 product page) + NESC Update presenter slides: *"Sections 24-27 [Overhead Lines - Strength and Loading] define various grades of construction and the corresponding storm loading and strength requirements... For the 2023 Code, Sec. 25 and Sec. 26 were modernized by adding the most up-to-date wind maps from ASCE 7 and ASCE 74..."*

2. Search result synthesis from IEEE NESC Update presentation (Trevor Bowmer, ATIS PEG): *"Section 24, 'Grades of Construction,' defines the required strength of overhead line construction for safety purposes. Section 25, 'Loadings for Grades B and C,' defines the physical loads such as ice, wind, and temperature conditions. Section 26 (Strength Requirements) outlines the necessary mechanical strength of poles, towers, crossarms, and guys to support the calculated loadings."*

3. Rule 261 scope confirmation from multiple sources: *"Rules 261A1c, 261A2e, and 261A3d state the structures 'shall be designed to withstand the loads in Rule 252 multiplied by the appropriate load factors in Table 253-1 without exceeding the permitted load.'"* + crossarms/braces/guys + cascade mitigation (Rule 261A5). Rule 261 = strength-of-line-supports rule within Section 26.

4. T05.L04 in-repo cross-reference (ground truth from authored and verified lesson): 
   - `Rule 261` key_term: *"The NESC rule that defines which grade of construction applies to each crossing and line configuration."*
   - `Section 26` key_term: *"The NESC section that contains the load and strength factor matrices applied to calculated structural loads... translates a grade determination (Grade B or C) into actual numerical multipliers for wind load, ice load, wire tension, and pole strength."*

**VERDICT — confirmed before any edits were applied:**
- NESC Section 24 = Grades of Construction (grade classification: Grade B, C, N)
- NESC Section 25 = Loadings for Grades B and C (ice/wind/temp applied loads)
- NESC Section 26 = Strength Requirements (mechanical strength of poles, towers, crossarms, guys; load/strength factor matrices)
- Rule 261 = Specific strength-of-line-supports rule within Section 26

**L06 mis-attribution confirmed:** 9 occurrences attributed "stress requirements / capacity limits" to §24 (grades of construction, wrong role) instead of Section 26 (strength requirements, correct role).

---

## FIXES APPLIED

### M-G5 (MED) — L06: NESC §24 → Section 26 (9 locations)

All 9 occurrences where §24 was cited in the context of pole stress limits / structural capacity / strength requirements corrected to Section 26 (and Rule 261 where referring to the specific pole-strength rule).

| Location | BEFORE | AFTER |
|---|---|---|
| File header comment (line 4) | `NESC C2-2023 §24` | `NESC C2-2023 Section 26 (strength requirements) / Rule 261` |
| key_terms definition "pole replacement" (line 35) | `§24 loading calculations` | `Section 26 strength requirements` |
| Flashcard back (line 110) | `§24 loading calculations` | `Section 26 strength requirements` |
| Trigger 1 body prose (line 146) | `NESC §24 structural integrity standard` | `NESC Section 26 structural strength standard` |
| Trigger 2 body prose (line 169) | `NESC C2-2023 §24 sets maximum stress requirements for poles` | `NESC C2-2023 Section 26 sets the strength requirements for poles` |
| Trigger 2 body [confirm] marker (line 173) | `NESC §24 capacity formula` | `Section 26 / Rule 261 capacity formula` |
| Book vs Field box (line 208) | `NESC §24 [confirm edition]` | `NESC Section 26 [confirm edition]` |
| WorkedExample Step 2 explanation (line 345) | `NESC §24 allows a higher theoretical limit` | `NESC Section 26 strength factors allow a higher theoretical computed limit` |
| Q1 explanation (line 396) | `NESC §24 integrity standards` | `NESC Section 26 strength standards` |
| Q1 citation (line 397) | `NESC C2-2023 §24 [confirm edition]` | `NESC C2-2023 Section 26 / Rule 261 [confirm edition]` |
| Q3 citation (line 429) | `NESC C2-2023 §24 [confirm edition]` | `NESC C2-2023 Section 26 [confirm edition]` |
| Q4 citation (line 445) | `NESC C2-2023 §24 [confirm edition]` | `NESC C2-2023 Section 26 [confirm edition]` |

**Note — Section 24 references intentionally preserved:**
- L06 line 243 (`NESC §25` loading district) — correct, §25 = loadings. No change.
- L06 Q3 wrong-answer distractor (`NESC §23`) — intentionally incorrect distractor for learning. No change.

### LOW — Notation consistency sweep

| File | Line | BEFORE | AFTER |
|---|---|---|---|
| L03 | 400 | `NESC C2-2023 §232` | `NESC C2-2023 Rule 232` |
| L03 | 416 | `NESC C2-2023 §23, §24` | `NESC C2-2023 Rule 235 (communication-worker safety zone), Section 24 (grades of construction)` |
| L05 | 286 | `NESC C2-2023 §235` | `NESC C2-2023 Rule 235` |
| L10 | 39 | `§24 strength requirements; §25 loading district` | `Section 26 strength requirements; Section 25 loading district` |

**Notation rule applied:** Rules (numbered 2xx) → `Rule XXX`. Sections (broad topic areas, Section 24/25/26) → `Section XX`. Section notation is always correct; Rule is narrower and correct only when referring to the specific rule. Role labels added where ambiguous (e.g., "Rule 235 (communication-worker safety zone)").

---

## NEIGHBORHOOD SCAN FINDINGS (not fixed — out of scope)

**L06 line 163:** `NESC §25 loading district` — this shorthand is in the Trigger 2 description box. The full notation would be `Section 25 loading district`. Low-priority cosmetic notation item; §25 = loadings is unambiguously correct semantically. Flag for future pass if notation sweep extends to §25 shorthands.

**L06 line 254:** `NESC C2-2023 Rule 250/261 [confirm edition]` — This combined citation in the RUS 1724E-150 source note is correctly notated (Rule 250 = loading districts, Rule 261 = strength of line supports). No change needed.

---

## BUILD RESULT

```
✓ built in 5.89s
```
131 modules compiled clean. No import errors, no syntax errors.

---

## GIT LOG

```
e8cf7a9 T08 POLISH-A: correct NESC §24→Section 26 citations + notation sweep
```

Diff: 4 files, 17 insertions, 17 deletions. Only allowlisted T08 lesson files touched. No other files modified.

=== T08 POLISH-A NOTES END ===
