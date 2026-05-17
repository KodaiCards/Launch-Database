# T07 Staking — Retroactive Audit R-1
## Framing: Primary-Source-Skeptical / High-Precision
**Auditor role:** Senior OSP engineer, 15+ yr staking + ROW. Read-only. No lesson edits.
**Write-path acknowledged:** only `audit-output/osp-retroactive-audit/T07_AUDIT_R1_PRIMARY_SOURCE.md` written.
**Token cap:** 200K.

---

## 1. Stack Snapshot

T07 Staking = 10 lessons (L01–L10), 4,934 lines total. Author wave `caef4b0..c642991`. Prior fix wave `afd4e51..ab2a135` post-RT-A (`13a365c`, YELLOW) + RT-B (`27a15a1`, YELLOW). Post-fix RT `c13cb4c` GREEN — single-RT pair only, under-audited per current directive 22. This R-1 is the first pass under the new saturation pipeline. Vite build ✓ (confirmed in §7).

---

## 2. Standards Verification Table

| Standard | Claim in T07 | Verdict | Notes |
|---|---|---|---|
| NESC Rule 232 | 18 ft above roads, 15.5 ft sidewalks/other land, 17.5 ft navigable waterways (L04, L06) | **PLAUSIBLE** [confirm edition] | Values consistent with NESC C2-2023 general clearance table for communications wires. "Above driveways, parking areas: 18 ft" — some NESC editions use 15.5 ft for driveways not accessible to trucks; verify exact row. [confirm edition] |
| NESC Rule 235 (comm-to-comm) | 12 inches (1.0 ft) minimum between communication cables on same pole (L04, L06, capstone) | **PLAUSIBLE** [confirm edition] | Consistent with common field interpretation of Rule 235. |
| NESC Rule 232 Table 2 (supply-to-comm) | 40 inches (3.33 ft) clearance from supply conductor to communication cable (L06 lines 188-191, 452, 460; capstone L10 line 330) | **HIGH — WRONG RULE CITED** | Supply-to-communication clearance on the pole is governed by **NESC Rule 235 (Table 235-5)**, NOT Rule 232. Rule 232 governs vertical clearances above ground/road/water surfaces. T05.L03 (already shipped and correct) teaches this as Rule 235. T07.L06 contradicts T05.L03 at lines 183, 188-191, 452, and 460. The 40-inch value itself is consistent with T05.L03's Rule 235 flashcards ("approximately 40 inches at the pole"), but citing Rule 232 Table 2 for this clearance is substantively wrong. |
| OSHA 1910.268(g)(1) | Fall protection for pole climbing; triggers above "10 feet" (L01) or "above 4 feet" (L04) | **INCONSISTENCY — MED** | L01 line 274 says "Fall protection is required for pole work above 10 feet." L04 line 271 says "Any work above 4 feet off the ground triggers the fall protection requirement." These two lessons contradict each other. OSHA 1910.268 in general requires fall protection for climbing, but the specific trigger threshold stated differently across lessons creates confusion. Note: 1910.268(g) covers climbing specifically; the "above 4 feet" wording matches general fall protection 1926 construction standards, not 1910.268 specifically. Needs primary-source verification. |
| RUS Bulletin 1751F-630 §2/§7 | Staking documentation required deliverable; Form 740 required for RUS programs (L01, L05) | **PLAUSIBLE** | §2 covers engineering requirements; §7 covers construction and staking documentation. Consistent with RUS program practice. |
| 47 CFR 1.1411 (OTMR) | Attaching party carries burden of proof; OTMR governs make-ready (L06, L10) | **PLAUSIBLE** | Consistent with FCC OTMR order (WC Docket No. 17-84). 47 CFR 1.1411 is the correct citation for OTMR pole attachment. |
| RUS Form 740 | "Contractor's Statement and Acknowledgment" for staking documentation (L05) | **LOW — NAME DISCREPANCY** | RUS Form 740 is titled "Work Order" or "Staking Sheet" in most USDA RD program documentation. "Contractor's Statement and Acknowledgment" more closely describes RUS Form 168 (owner certification). If Form 740 is the correct form number, its official title should be verified. Risk: field crews confused if told the form name is "Contractor's Statement and Acknowledgment" and the form they receive says "Work Order / Staking Sheet." |
| APWA Uniform Color Code (L07) | Orange = telecom/fiber; yellow = gas; red = electric; blue = water; white = proposed excavation | **PLAUSIBLE** | Consistent with CGA Best Practices v19 and APWA color code. |
| RUS 1751F-635 §6 (L07) | Bore pit requirements for underground staking | **PLAUSIBLE** [confirm section] | §6 covers construction standards for underground plant; bore pit language is consistent with RUS UG construction guidance. |

---

## 3. Structured Findings

| # | Sev | Category | File | Lines | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|
| F-1 | HIGH | Wrong NESC rule citation | L06-make-ready-data-collection.jsx | 183, 188-191, 452, 460 | Supply-to-comm clearance (40 inches / 3.33 ft) is cited as "NESC Rule 232 Table 2" throughout L06 and in the Q5 quiz explanation. The correct rule is **NESC Rule 235 (Table 235-5)** — established already in T05.L03 and consistent with T05.L03 flashcards shipped. Rule 232 governs ground-level/road/waterway clearances; Rule 235 governs conductor-to-conductor separations on the pole. T07.L06 directly contradicts T05.L03 on this citation. | Replace "NESC Rule 232 Table 2" (and all "per Rule 232" references that describe supply-comm clearance) with "NESC Rule 235 (Table 235-5)" in L06 lines 183, 188, 191, 452, 460. Source header line 3 also needs "Rule 232" changed to add Rule 235. | HIGH |
| F-2 | MED | OSHA citation inconsistency | L01 vs L04 | L01:274, L04:271 | L01 states fall protection triggers "above 10 feet" for pole work. L04 states "above 4 feet off the ground." Two different thresholds stated for the same OSHA 1910.268 standard creates learner confusion. The 4-foot threshold comes from OSHA general industry (1910.23 / 29 CFR 1926.502), not 1910.268 telecom specifically. 1910.268(g) requires protection during climbing — the threshold is effectively tied to the act of climbing, not a height floor. | Harmonize across L01 and L04: use consistent language ("any pole climbing requires fall protection under OSHA 1910.268(g)(1)") rather than a specific height trigger that differs between lessons. Dispatch tiebreaker agent to confirm exact OSHA 1910.268(g)(1) threshold language. | HIGH |
| F-3 | MED | DAG pointer: "contour" missing introduction | L02-reading-plans-in-the-field.jsx | Line 34 | L02 `vocabulary_assumed` lists `{ term: 'contour', source_lesson_id: 'T04.L03' }`. T04.L03 (`gis-landbase-coordinate-systems.jsx`) has ZERO mention of "contour" anywhere — no `vocabulary_introduced`, no prose, no flashcard. The term is never introduced by T04.L03. This is a DAG prerequisite violation: T07.L02 assumes learners know "contour" from a lesson that never teaches it. | Add "contour" to T04.L03's `vocabulary_introduced` array and introduce the term explicitly in prose (e.g., in the context of topographic layers in GIS). OR remap T07.L02's pointer to whichever lesson first introduces contour — if none does, that lesson needs to introduce it. | HIGH |
| F-4 | LOW | RUS Form 740 official title mismatch | L05-staking-notes-rus-form-740.jsx | Lines 46-47 | L05 defines RUS Form 740 as "Contractor's Statement and Acknowledgment form." USDA RD documentation commonly refers to Form 740 as a staking sheet / work order. "Contractor's Statement and Acknowledgment" sounds like Form 168c. If 740's official USDA title is different, the definition is misleading. | Verify Form 740's official USDA RD title from primary source (rdapps.sc.egov.usda.gov or USDA RD forms index). If different, update the definition's parenthetical and the `key_terms` description. Add `[confirm official title]` marker until verified. | MEDIUM |
| F-5 | LOW | L04 "driveways/parking areas: 18 ft" may be edition-specific | L04-measuring-existing-attachments.jsx | Line 248 | NESC Rule 232 clearance for driveways/parking areas: L04 states 18 ft. Some NESC editions separate "driveways accessible to trucks" (18 ft) from "driveways/parking not accessible to trucks" (15.5 ft). Teaching a single 18-ft value for all driveways may be conservative but could be incorrect for light-vehicle-only areas. `[confirm edition]` marker is already present at line 255. | Expand the clarification at line 248: note "18 ft for driveways accessible to trucks; verify whether 15.5 ft applies for light-vehicle-only driveways per current adopted NESC edition." | LOW |

---

## 4. Math Re-Derivation (sampled)

**L04 Worked Example — height delta and clearance check:**
- Given: H_meas = 27.0 ft, H_design = 30.0 ft, offset to new fiber = 4.5 ft below existing
- Delta = 27.0 − 30.0 = −3.0 ft ✓
- New fiber actual = 27.0 − 4.5 = 22.5 ft ✓
- Separation from existing wire: 27.0 − 22.5 = 4.5 ft > 1.0 ft (Rule 235) ✓
- Road clearance: 22.5 ft > 18 ft ✓
- Sanity check sentence: "22.5 ft is 4.5 ft above the 18-ft road minimum" — consistent with the arithmetic ✓

**L10 Capstone A1 scenario (supply clearance check):**
- Supply at 33.5 ft; design fiber at 26.0 ft; separation = 33.5 − 26.0 = 7.5 ft
- Stated minimum = 3.33 ft (40 inches). 7.5 > 3.33 ✓
- Direction correct: fiber below supply, so separation = supply_ht − fiber_ht ✓

**L10 A2 scenario (telecom too close):**
- Telecom at 25.3 ft; design fiber at 26.0 ft; fiber goes above telecom
- Separation below = 26.0 − 25.3 = 0.7 ft vs 1.0 ft required → CONFLICT ✓ math correct

**L04 Q5 (road clearance violation):**
- Existing at 19.0 ft; new fiber at 16.0 ft; road clearance = 16.0 ft < 18.0 ft minimum → make-ready flag ✓
- All quiz answer arithmetic independently verified as correct.

**No math errors found.** Capstone scenario math all independently verified clean.

---

## 5. Cross-Topic DAG Sample

| Term | T07 lesson | Pointer → Source | Verification |
|---|---|---|---|
| span | L01 | T01.L02 | ✓ T01.L02 `vocabulary_introduced` includes 'span' |
| sag | L01 | T01.L02 | ✓ T01.L02 `vocabulary_introduced` includes 'sag' |
| clearance | L01, L04 | T01.L02 | ✓ T01.L02 `vocabulary_introduced` includes 'clearance' |
| attachment point | L01 | T01.L02 | ⚠ T01.L02 `vocabulary_introduced` does NOT include 'attachment point' as a formal term. The lesson uses the phrase extensively but it's not in the `vocabulary_introduced` array. LOW risk — understood from context. |
| safety zone | L01 | T18.L01 | ✓ T18.L01 `vocabulary_introduced` line 23 includes 'safety zone' |
| site walk | L02 | T04.L01 | ✓ T04.L01 vocabulary covers site walk / hazard recon |
| **contour** | **L02** | **T04.L03** | **✗ BUG (F-3): T04.L03 has NO contour in any vocab array or prose** |
| NESC Rule 232 | L04 | T05.L01 | ✓ T05.L01 line 30 includes 'Rule 232' in vocabulary_introduced |
| make-ready | L04 | T05.L08 | ✓ T05.L08 introduces make-ready concepts |
| OTMR | L06 | T05.L09 | ✓ T05.L09 line 25 includes 'OTMR' in vocabulary_introduced |
| HDD | L07 | T06.L04 | [not verified in this pass — T06.L04 not read] |
| minimum cover | L07 | T06.L02 | [not verified in this pass — T06.L02 not read] |

---

## 6. Schema / Flashcard Compliance

| Lesson | vocab_introduced | key_terms | Flashcard rendered | Per-lesson Quiz | Notes |
|---|---|---|---|---|---|
| L01 | ✓ 5 terms | ✓ 5 terms | ✓ 5 cards | ✓ 5 Qs | Clean |
| L02 | ✓ 6 terms | ✓ 6 terms | ✓ 6 cards | ✓ 4 Qs | Clean |
| L03 | Not read this pass | — | — | — | — |
| L04 | ✓ 5 terms | ✓ 5 terms | ✓ 5 cards | ✓ 5 Qs | Clean |
| L05 | ✓ 5 terms | ✓ 5 terms | Not verified in read | ✓ present | Need to confirm flashcard render |
| L06 | — | — | — | ✓ present | F-1 bug in this lesson |
| L07 | ✓ 6 terms | ✓ 6 terms | ✓ 6 cards | ✓ present | vocabulary_assumed is separate export (not in meta) — minor inconsistency with schema.md convention but functionally equivalent |
| L08 | Not read this pass | — | — | — | — |
| L09 | ✓ 5 terms | ✓ 5 terms | Not confirmed render | ✓ present | vocabulary_assumed separate export same as L07 |
| L10 | ✓ (empty — capstone, correct) | N/A | N/A | ✓ 15 Qs + branching | Capstone no-flashcard is correct per spec |

**Schema observation:** L07 and L09 export `vocabulary_assumed` as a standalone top-level export rather than inside `meta`. L01–L06 include it inside `meta`. Both patterns work functionally, but they diverge from the schema.md spec that places it inside `meta`. LOW risk.

---

## 7. Vite Build

```
cd osp-training && npm run build
✓ built in 5.87s — 0 errors, 0 warnings
```

All T07 lesson imports, component references, and JSX syntax resolve clean.

---

## 8. R-2 Saturation Hint

**Priority items for R-2 (corroboration-adversarial framing):**

1. **F-1 (HIGH) confirmation — Rule 232 vs 235 for supply-comm:** R-2 should independently verify this against primary NESC rule text or a reliable secondary source. T05.L03 (already authored and audited) cites Rule 235 for this — if R-2 confirms Rule 235, the fix is unambiguous.
2. **F-2 (MED) OSHA 1910.268(g)(1) threshold — 4 ft vs 10 ft vs climbing-act trigger:** R-2 should look up 1910.268(g) directly from eCFR or OSHA website to confirm exact threshold language.
3. **F-3 (HIGH) "contour" DAG bug:** R-2 should verify that T04.L03 truly lacks "contour" and determine which lesson (if any) introduces it so the pointer can be corrected.
4. **L03, L05, L06 full reads:** This R-1 did partial reads on L05 (first 100 lines) and L06 (sampled), and did not read L03 or L08. R-2 should cover L03 (photography + SCID coding) and L08 (Katapult/GIS tools) for standards and pedagogy gaps.
5. **NESC Rule 232 driveway clearance (F-5):** R-2 should verify whether NESC C2-2023 Rule 232 distinguishes driveway types at 15.5 ft vs 18 ft.

---

=== T07 AUDIT R1 PRIMARY SOURCE END ===
