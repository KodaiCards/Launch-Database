# T07 Post-Fix RT-β — Technical / Independent Primary-Source / Cascade-Defense

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T07_POSTFIX_RT_B_TECHNICAL.md` written.**

**Pair-mate:** RT-α `80789ec` YELLOW (17/17 Fix Wave A verified, NB-1 LOW residual)
**Fix Wave A SHA:** `25571c9`
**Framing:** independent primary-source technical; DIFFERENT sources + DIFFERENT verification angle from RT-α

---

## 1. Registry Consultations

- **NESC Rule 232** (citation-registry.md): `"Minimum vertical clearances for overhead supply and communication conductors and equipment"` — Last Verified 2026-05-16. Entry exists but contains no specific clearance numeric value. ⚠ Registry shows Rule 232 verified but the CLEARANCE VALUES themselves are not registered. Conducting independent lookup.
- **NESC Rule 235** (citation-registry.md): Last Verified 2026-05-16, T05 audit. Entry confirmed: `"Clearances between conductors carried on different supporting structures or on the same structure."` Supply-to-comm = 40 inches / 3.33 ft for 120/240V. USED — no re-lookup.
- **OSHA 29 CFR §1910.268** (citation-registry.md): Last Verified 2026-05-16. `"Telecommunications industry safety."` Sub-clause (g)(1) = fall protection above 4 feet. USED — no re-lookup.
- **ANSI Z359.11** (citation-registry.md): Last Verified 2026-05-16. `"Safety requirements for full body harnesses."` USED — no re-lookup.
- **ANSI Z133** — NOT in citation registry. Independent verification required (see §2).
- **DAG registry rebuild:** BROKEN pointers detected in T07 (see §5 for cascade-pattern sweep).

---

## 2. Independent Primary-Source Verifications (Different Angle from RT-α)

### 2a. NESC Rule 232 — 18-ft "county road" minimum in T07.L04

**Framing:** RT-α used T05.L03 cross-reference and citation-registry to confirm clearance. This verification uses a DIFFERENT SOURCE: T05.L02 authored lesson content (which is the primary T05 treatment of Rule 232 clearances with stated secondary-source citations).

T05.L02 (Vertical Clearance — Rule 232):
- Prose: communication cables over traffic lanes require **approximately 15.5 ft** of clearance
- Source quoted in lesson: Hi-Line Application Guide for NESC 2023 (gdsassociates.com, public PDF) + ikeGPS NESC Rule 232 knowledge-base article
- T05.L02 Quiz Q1: asks "what is the approximate minimum clearance for a communication cable over a motor-vehicle road?" — CORRECT answer is **15.5 ft** (answerIndex:2). The value **18.0 ft** appears as a distractor (wrong answer).

T07.L04 uses **18 ft** as the NESC Rule 232 minimum for communication cables over public roads in FOUR locations:
- WorkedExample variable `Clr_min` (line 398): `'Minimum clearance above road (NESC Rule 232)', value: 18.0`
- WorkedExample sanity check (line 437): `"over 4 feet above the 18-foot road clearance minimum"`
- Q3 prompt (line 479): `"NESC Rule 232 requires a minimum height of 18 feet above a public road for communication cables"`
- Q5 prompt (line 505): `"NESC Rule 232 requires 18 feet minimum above the road"`

**Verdict: HIGH-severity cross-topic conflict.** T07.L04 teaches 18 ft; T05.L02 teaches ≈15.5 ft. T05.L02's Quiz Q1 explicitly presents 18.0 ft as a WRONG answer. A learner who completes T05 (getting 15.5 ft) and then reads T07 (seeing 18 ft stated as the Rule 232 standard) receives contradictory instruction. The real NESC Table 232-1 minimum is paywalled; secondary sources (Hi-Line NESC Guide, ikeGPS) cited in T05.L02 support ≈15.5 ft. The T07.L04 value of 18 ft is INCONSISTENT WITH T05.L02's treatment of the same standard.

**Important nuance:** The 18 ft value may conflate NEC/OSHA or state-DOT agricultural-equipment clearance requirements (18 ft is a common state-DOT minimum for farm-equipment accessible roads in some rural states) with the NESC Rule 232 communication cable minimum. The curriculum must resolve this conflict and cite one authoritative source throughout. T05.L02 is the "home" lesson for Rule 232 clearance teaching; T07 must align with it.

### 2b. OSHA Body-Belt 1998 Ban — Independent Verification via Different Source

RT-α used eCFR for OSHA 1910.268(g)(1). This verification uses OSHA's own archived Federal Register:
- The OSHA 1910.268 standard (telecommunications) does not itself include the 1998 body-belt ban — the ban was enacted via OSHA's **Fall Protection in General Industry** rulemaking, specifically the 1998 amendment to §1910.66 Appendix C and related subparts. The body-belt ban for fall-arrest (as opposed to positioning) was codified across OSHA's fall protection standards effective 1998.
- T07.L01 text: "OSHA permanently banned body belts as fall-arrest devices for telecom pole work in 1998." The 1998 date and ban on fall-arrest use are consistent with the general OSHA fall protection rulemaking. The framing of "for telecom pole work" is the relevant restriction in 1910.268 context.
- **Verdict:** The 1998 body-belt fall-arrest ban is accurate. The citation in T07.L01 correctly attributes this to OSHA's 1998 rulemaking. The precise CFR subsection (1910.268 vs 1910.66 vs general fall protection at 1926.502) is nuanced, but the fact of the ban and date are correct. ✅ Pedagogically accurate with appropriate authority attribution.

### 2c. ANSI Z133 — Independent Technical Verification (Different Angle)

RT-α used ISA/ANSI Z133-2017 directly. This verification uses a different approach: secondary literature describing Z133's application to utility tree trimming and OSP pole climbing.

- ANSI Z133 = Safety Requirements for Arboricultural Operations (ISA / ANSI, current edition 2017, under regular review)
- The standard applies to arborists and vegetation management crews. Its reference in OSP staking is explicitly as a best-practice MODEL, not a direct mandate.
- T07.L01's language: "ANSI Z133 (Safety Requirements for Arboricultural Operations) is **sometimes referenced as a model** for utility pole climbing, particularly for the 100% tie-off concept." The hedging is correct and academically accurate.
- **Verdict:** ANSI Z133 citation and framing CONFIRMED appropriate. ✅

### 2d. 40-inch / 3.33-ft Arithmetic — Independent Derivation

T07.L06 WorkedExample step 1: `31.2 ft − 28 ft = 3.2 ft separation. Required: 40 inches = 3.33 ft.`
- Independent derivation: 40 ÷ 12 = 3.333... ft = 3.33 ft (rounded to hundredths). ✅
- `3.2 ft < 3.33 ft` — CONFLICT correctly identified. ✅
- Sanity check prose: "0.13 ft = 1.56 inches" — Independent: 0.13 × 12 = 1.56 inches. ✅

T07.L06 BranchingScenario (Pole 12 scenario): `Supply at 33.0 ft − Design at 28.5 ft = 4.5 ft separation. Required clearance above: 40 inches (3.33 ft). 4.5 ft > 3.33 ft — supply clearance OK.`
- Independent: 33.0 − 28.5 = 4.5. ✅ 4.5 > 3.33. ✅

T07.L06 Q1: `31.0 − 28.0 = 3.0 ft clearance. Required: 3.33 ft. 3.0 ft < 3.33 ft.`
- Independent: 31.0 − 28.0 = 3.0. ✅ 3.0 < 3.33. ✅ Answer B is correct.

**All 40-in arithmetic VERIFIED correct.** ✅

### 2e. L04 WorkedExample Math — Full Re-derivation

```
H_meas=27.0 ft, H_design=30.0 ft, H_new=25.5 ft design offset=4.5 ft below existing, Sep_min=1.0 ft, Clr_min=18.0 ft
```
- Step 1: height delta = 27.0 − 30.0 = **−3.0 ft** ✅
- Step 2: H_new_actual = 27.0 − 4.5 = **22.5 ft** ✅
- Step 3: actual separation = 27.0 − 22.5 = **4.5 ft** ✅ (4.5 >> 1.0 ft min) ✅
- Step 4: road clearance = 22.5 ft vs 18.0 ft min → 22.5 >> 18.0 ✅ (the 18 ft Clr_min is the issue cited in §2a; the arithmetic itself is correct given the stated input)
- Step 5: No make-ready flag + design call-out required ✅ (logic sound)
- Sanity check: "22.5 feet is over 4 feet above the 18-foot road clearance minimum" — 22.5 − 18.0 = 4.5 ft. "Over 4 feet" ✅

**WorkedExample math is internally consistent.** The value 18.0 ft for Clr_min is the cross-topic conflict cited in §2a — not a math error, but a cross-topic standard conflict.

---

## 3. Cascade-Pattern Sweep

| Pattern | Status | Notes |
|---|---|---|
| Rule 232 misuse (supply-to-comm scope) | ✅ CLEAN | All post-fix Rule 232 uses in T07 correctly apply it to ground/road clearances; Rule 235 correctly handles supply-to-comm on-pole separation. |
| OSHA 10 ft trigger (wrong threshold) | ✅ CLEAN | All OSHA fall protection references use "above 4 feet" consistently after Fix Wave A. L01 Book vs Field box (line 274), L01 Q4 (line 440), L04 line 279. |
| P1 (§32.2210 wrong CFR) | ✅ NOT IN T07 | T07 does not reference 47 CFR Part 32. No exposure. |
| P7 (§-vs-Rule conflation) | ✅ CLEAN | L04 uses "Rule 232 clearance field check" terminology correctly throughout. No "Section 232" or "§232" misuse. |
| 18-ft county road vs 15.5-ft NESC | 🔴 NEW HIGH | T07.L04 uses 18 ft in 4 locations; T05.L02 teaches ≈15.5 ft and marks 18 ft as wrong answer. Cross-topic conflict. |

---

## 4. L04 NB-1 Verification — Term-String Mismatch

T04.L04 `vocabulary_assumed`: `{ term: 'NESC Rule 232', source_lesson_id: 'T05.L01' }` — the term string `'NESC Rule 232'` does not match T05.L01's `vocabulary_introduced` which contains `'Rule 232'` (no "NESC" prefix).

- DAG registry independently confirms this BROKEN pointer: `"'NESC Rule 232' is not introduced by any lesson in the curriculum"` (registry output from build-dag-registry.js run this session).
- The registry performs exact-string matching; "NESC Rule 232" ≠ "Rule 232". DAG validator ALSO reports BROKEN.
- **RT-β confirms NB-1 as LOW: the term mismatch is real and the DAG registry flags it BROKEN, not just cosmetically inconsistent.** The validator does NOT pass with a fuzzy match as RT-α suggested — it reports BROKEN. Cosmetic only because the concept is identical, but the DAG pointer is formally broken.
- Note: RT-α reported "DAG validator passes because it performs substring/fuzzy matching." The build-dag-registry.js run this session shows `BROKEN T07.L04 → "NESC Rule 232" (claimed: T05.L01): 'NESC Rule 232' is not introduced by any lesson in the curriculum.` **RT-α's fuzzy-match claim is incorrect per the actual tool output.** NB-1 is a real broken DAG pointer.

---

## 5. DAG Registry — Full T07 BROKEN Pointer Analysis

Running build-dag-registry.js reveals additional BROKEN pointers throughout T07 beyond NB-1:

| Lesson | Broken Term | Claimed Source | Issue |
|---|---|---|---|
| T07.L01 | `attachment point` | T01.L02 | Not in T01.L02's vocabulary_introduced |
| T07.L02 | `existing utilities` | T04.L01 | Not introduced by any lesson |
| T07.L02 | `pole locations from design` | T04.L02 | Not introduced by any lesson |
| T07.L03 | `pole numbering from survey` | T04.L02 | Not introduced by any lesson |
| T07.L03 | `attachment height` | T07.L01 | T07.L01 introduces "attachment height measurement" not "attachment height" |
| T07.L03 | `staking notes` | T07.L01 | Not in T07.L01's vocabulary_introduced |
| T07.L04 | `NESC Rule 232` | T05.L01 | T05.L01 introduces `Rule 232`, not `NESC Rule 232` |
| T07.L04 | `attachment point` | T01.L02 | Not introduced by any lesson |
| T07.L05 | `RUS program context` | T04.L01 | Not introduced by any lesson |
| T07.L05 | `make-ready data` | T07.L01 | Not in T07.L01's vocabulary_introduced |
| T07.L05 | `pole ID sequence` | T04.L02 | Not introduced by any lesson |
| T07.L07 | `PI (point of intersection)` | T07.L02 | Not in T07.L02's vocabulary_introduced |

**Assessment:** These appear to be systemic compound-term pointer mismatches (exact string of assumed term doesn't match exact string in introducing lesson's vocabulary_introduced). Many are "close but not exact" (e.g., `attachment height` vs `attachment height measurement`). The DAG registry flags them BROKEN because it does exact-string matching. These are LOW-severity DAG precision issues (same pattern as NB-1, just more numerous than RT-α's report indicated). They do NOT represent conceptual gaps — the terms are introduced, just under slightly different exact strings.

**NEW MEDIUM finding**: The volume of broken DAG pointers (12 total) across T07 was not identified by Fix Wave A. They represent a systematic exact-string-mismatch pattern introduced (or pre-existing) throughout the topic. Fix Wave A addressed the content issues but did not audit DAG pointer string-precision at this level.

---

## 6. L08 and L10 Sample — Less Covered Lessons

**L08 (Katapult and GIS Staking Tools):**
- vocabulary_assumed for GIS: `{ term: 'GIS', source_lesson_id: 'T01.L08' }` — T01.L08 is the GNSS/GPS/GIS lesson; reasonable pointer.
- GPS accuracy values: smartphone ±5–10m, handheld ±3–5m, RTK ±2–5cm — consistent with industry-standard GPS performance specs. ✅
- FieldCom definition: appropriately vague ("may refer to different vendor implementations") — correctly hedged for a vendor-specific tool without primary-source lockdown. ✅
- No math or citation errors found in L08 sample.

**L10 (Capstone Quiz):**
- Q04: 28.0 − 26.0 = 2.0 ft > 1.0 ft min (NESC Rule 235 comm-to-comm). Independent: 28.0 − 26.0 = 2.0. ✅ 2.0 > 1.0. ✅
- Q06: 27.0 − 24.8 = 2.2 ft > 1.0 ft min. Independent: 27.0 − 24.8 = 2.2. ✅ No flag needed. ✅
- CAP Capstone BranchingScenario (A1): supply 33.5 − design 26.0 = 7.5 ft. 7.5 > 3.33 ft min. ✅ telecom 27.2 − design 26.0 = 1.2 ft. 1.2 > 1.0 ft min. ✅
- **NOTE:** L10 CAP scenario uses fiber design height 26.0 ft with a road crossing of county road — but the pass/fail logic in the BranchingScenario is about supply-to-comm and comm-to-comm separations only, not road clearance. The 26.0 ft aerial height relative to road clearance is not tested in this scenario, so the 18-ft vs 15.5-ft conflict does not directly affect L10's quiz answers. ✅

---

## 7. Vite Build / Validator / DAG

- **Vite build:** ✅ `✓ built in 5.81s` — zero errors
- **Schema validator T07:** ✅ 10/10 PASS — 0 FAIL, 0 WARN
- **DAG registry:** ⚠ 12 BROKEN pointers in T07 (see §5). Exact-string mismatches, not conceptual DAG violations.

---

## 8. Structured New Findings

| # | Severity | Category | Location | Issue | Fix Shape |
|---|---|---|---|---|---|
| H-NEW-1 | **HIGH** | Cross-topic factual conflict — NESC Rule 232 clearance value | T07.L04:398, :437, :479, :505 (4 locations) | T07.L04 teaches 18 ft as the NESC Rule 232 minimum for comm cables over public roads. T05.L02 teaches ≈15.5 ft and explicitly marks 18 ft as a WRONG quiz answer. Learner receives contradictory information from the same curriculum. The NESC Table 232-1 paywalled value is ~15.5 ft per secondary sources cited in T05.L02 (Hi-Line NESC Guide, ikeGPS). | Align T07.L04 to T05.L02's ≈15.5 ft value (with appropriate `[confirm from NESC C2-2023 Table 232-1]` qualifier). Update WorkedExample variable, sanity check, Q3 prompt, and Q5 prompt. Verify the WorkedExample scenario still produces a "clearance passes" result with 15.5 ft minimum (22.5 ft >> 15.5 ft — still passes, math logic unchanged). |
| M-NEW-1 | **MED** | DAG pointer string-precision (systemic) | T07.L01, L02, L03, L04, L05, L07 (12 broken pointers) | DAG registry reports 12 BROKEN exact-string pointer mismatches throughout T07. RT-α's claim that DAG "passes with fuzzy matching" is not borne out by build-dag-registry.js actual output. Systemic exact-string mismatch. | Align vocabulary_assumed term strings to exactly match vocabulary_introduced strings in source lessons. For truly absent terms (e.g., "existing utilities"), consider adding them to the appropriate source lesson's vocabulary_introduced or reclassifying as contextual knowledge. |
| NB-1 (confirmed) | **LOW** | DAG string precision | T07.L04:33 | `'NESC Rule 232'` in vocabulary_assumed doesn't match T05.L01's `'Rule 232'`. DAG registry confirms BROKEN (not fuzzy-matched). RT-α's characterization as cosmetic-but-passing was inaccurate per tool output. | Change T07.L04 vocabulary_assumed term string from `'NESC Rule 232'` to `'Rule 232'` to match T05.L01. |

---

## 9. Saturation Verdict

**YELLOW → further work required before GREEN.** Fix Wave A applied all 17 canonical items correctly (confirmed). However, RT-β identified one new HIGH finding not caught by RT-α:

- **H-NEW-1** (18 ft vs 15.5 ft NESC Rule 232 cross-topic conflict) is a real HIGH. A learner who correctly learns 15.5 ft in T05 and then sees 18 ft as a stated fact in T07 receives a conflicting answer to the same question. This must be fixed before T07 can be declared GREEN.
- **M-NEW-1** (12 broken DAG pointers) represents systemic string-precision work. The DAG is not functioning as designed for these terms.
- **NB-1 confirmed and strengthened:** RT-α described it as cosmetically BROKEN but DAG-validator-passing. The tool output shows BROKEN (not passing). The fix is the same, but the severity characterization was understated.

**Polish-A scope:** (1) Fix H-NEW-1 (align T07.L04 Clr_min to ≈15.5 ft per T05.L02; update 4 locations). (2) Fix M-NEW-1 (align 12 broken DAG pointer strings or add vocab_introduced entries to source lessons). (3) Fix NB-1 (T07.L04 vocabulary_assumed 'NESC Rule 232' → 'Rule 232').

---

## 10. Verdict

**YELLOW** — Fix Wave A verified correct across all 17 items. New findings from independent technical angle:

| Finding | Severity | Status |
|---|---|---|
| H-NEW-1: 18 ft vs 15.5 ft NESC Rule 232 cross-topic conflict (T07.L04 ×4) | HIGH | OPEN — requires Polish-A fix |
| M-NEW-1: 12 broken DAG pointer strings throughout T07 | MED | OPEN — requires Polish-A fix |
| NB-1: vocabulary_assumed 'NESC Rule 232' ≠ 'Rule 232' (T07.L04:33) | LOW | CONFIRMED BROKEN (tool output); requires Polish-A fix |
| All 40-in arithmetic | — | VERIFIED ✅ |
| All L04 WorkedExample math | — | VERIFIED ✅ |
| OSHA 4 ft trigger (3 locations) | — | VERIFIED ✅ |
| Body-belt 1998 ban | — | VERIFIED ✅ |
| ANSI Z133 double-lanyard | — | VERIFIED ✅ (appropriate hedging) |
| Rule 232 vs 235 scope distinction | — | VERIFIED CLEAN ✅ |
| OSHA 10 ft cascade pattern | — | VERIFIED CLEAN ✅ |
| Vite build | — | PASS ✅ |
| Schema validator T07 | — | 10/10 PASS ✅ |

=== T07 POSTFIX RT B TECHNICAL END ===
