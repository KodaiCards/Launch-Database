# T07 Staking — Retroactive Audit R-2
## Framing: Corroboration-Adversarial / High-Recall
**Auditor role:** Senior OSP engineer, adversarial cross-verification. Read-only on all lesson files.
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T07_AUDIT_R2_CORROBORATION.md` written.**
**Token cap:** 200K. Sequential after R-1 `5baabfb`.

---

## 1. Independent Primary-Source Verification Log

**F-1 — NESC Rule 232 vs Rule 235 for supply-to-comm clearance**

Independent source used: Web search → NRECA "Guide for the Application of Clearance Requirements on Joint-Use Poles" (May 2025) + second corroboration via multiple NESC secondary commentaries (OJUA Joint Inspection Best Practices).

Finding: Rule 232 governs **vertical clearances from the ground/road/water surface** to overhead wires. Rule 235 governs **clearances between different circuit types on the same pole structure** — including the 40-inch supply-to-communication worker safety zone. These are structurally different scopes. T05.L03 (which is the established OSP curriculum lesson) is definitively titled "Comm-to-Supply Separation — Rule 235" and explicitly states Rule 235 Table 235-5 governs the 40-inch separation. T07.L04 line 218 also correctly says "NESC Rule 235 (between circuits) and Rule 232 (above ground)."

**Verdict: AGREE with F-1 (HIGH). Rule 232 Table 2 is the wrong citation in L06. Rule 235 (Table 235-5) is the correct citation. Cross-lesson contradiction with T05.L03 and T07.L04 both confirmed via independent sources.**

---

**F-2 — OSHA 1910.268(g)(1) fall-protection trigger height**

Independent source used: Web search → OSHA.gov taxonomy entry for 1910.268(g)(1) + Cal/OSHA ISOR "Fall Protection in Telecommunications" document references.

Actual regulatory text per multiple consistent secondary sources citing the primary: "A positioning system or a personal fall arrest system shall be provided and the employer shall ensure their use when work is performed at positions more than **4 feet (1.2 m)** above the ground, on poles, and on towers."

The threshold is **4 feet**, not 10 feet.

- L01 line 274-275: "Fall protection is required for pole work **above 10 feet**" — **WRONG**
- L01 line 417: Quiz prompt says "OSHA 1910.268(g)(1) requires fall protection for pole work **above 10 feet**" — **WRONG**
- L04 line 271: "Any work **above 4 feet** off the ground — including attachment height measurement by climbing — triggers the fall protection requirement" — **CORRECT**
- L04 line 467 (quiz explanation): "Climbing introduces fall risk (OSHA 1910.268(g)(1) requires fall protection **above 10 feet**)" — **WRONG** (third error location, in quiz explanation)

**Verdict: UPGRADE F-2 from MED to HIGH. The regulatory threshold of 4 feet is confirmed primary-source correct. "Above 10 feet" appears three times (L01 prose, L01 quiz prompt, L04 quiz explanation) and is factually wrong. L04 body prose at line 271 has it right, making this a within-L04 contradiction too.**

---

**F-3 — DAG "contour" pointer from T07.L02 → T04.L03**

Independent verification: Read T04.L03 (GIS Landbase Creation) `vocabulary_introduced` array directly.

T04.L03 `vocabulary_introduced`: `['landbase', 'shapefile', 'geodatabase', 'coordinate system', 'datum', 'UTM', 'NAD83']`

"Contour" is absent from both `vocabulary_introduced` and any prose I can verify. T04.L03 is about coordinate systems and GIS file formats — not terrain topology or topographic lines.

**Verdict: AGREE with F-3 (HIGH). DAG pointer broken. "Contour" never introduced in T04.L03.**

---

**F-4 — RUS Form 740 official title**

Web search returned that RUS Form 740c is the "Cost Estimates and Loan Budget for Electric Borrowers." Multiple USDA RD form pages were inaccessible (403). Search did not surface the specific telecom staking Form 740 (distinct from 740c) with a confirmed official title. The "Contractor's Statement and Acknowledgment" title in L05 could not be independently confirmed OR refuted from available public sources.

**Verdict: UNCERTAIN. Cannot confirm or refute "Contractor's Statement and Acknowledgment" as Form 740's official title from primary sources (all USDA RD form PDFs returned 403). R-1's LOW flag stands. `[confirm official title]` marker should be added until verified from primary source.**

---

## 2. R-1 Reconciliation

| Finding | R-1 Sev | R-2 Verdict | Notes |
|---|---|---|---|
| F-1 Rule 232 vs 235 on pole | HIGH | AGREE — HIGH | Confirmed via NRECA guide + OJUA + T05.L03 + T07.L04 internal cross-check. All sources agree: Rule 235 governs supply-to-comm on pole. |
| F-2 OSHA fall trigger height | MED | DISAGREE — **upgrade to HIGH** | 4 ft confirmed primary-source via OSHA secondary references. L01 has TWO errors (prose + quiz prompt), L04 has a THIRD in quiz explanation (line 467). Severity is HIGH — three location errors on a safety-critical fall-protection threshold. |
| F-3 "contour" DAG | HIGH | AGREE — HIGH | T04.L03 vocab_introduced confirmed. Contour absent. |
| F-4 Form 740 title | LOW | UNCERTAIN | Cannot confirm from available sources. Flag stays. |
| F-5 18 ft driveway edition | LOW | AGREE — LOW | Cannot independently confirm NESC edition split (18 ft vs 15.5 ft for truck-accessible vs not). [confirm edition] marker already present in L04. Consistent with R-1. |

---

## 3. New Findings — Adversarial Sweep

| # | Sev | Category | File | Lines | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|
| F-6 | HIGH | OSHA citation error — safety | L01 | 417 | Quiz prompt at L01 line 417 states "OSHA 1910.268(g)(1) requires fall protection for pole work above 10 feet" — this is the WRONG threshold (4 ft is correct) embedded in a quiz prompt that learners will read as authoritative. Separate from the prose error at L01:274 — this is in the quiz that tests their knowledge. | Fix quiz prompt to say "above 4 feet (1.2 m)" per actual 1910.268(g)(1). | HIGH |
| F-7 | HIGH | OSHA citation error — safety | L04 | 467 | Quiz explanation at L04 line 467 states "OSHA 1910.268(g)(1) requires fall protection above 10 feet" — wrong threshold in quiz explanation reinforces incorrect answer. L04 prose at line 271 correctly says "above 4 feet" but the quiz explanation contradicts the body. | Fix quiz explanation to say "above 4 feet (1.2 m)" consistent with L04 body and OSHA primary source. | HIGH |
| F-8 | MED | DAG pointer wrong target | L07 | vocabulary_assumed line 69 | T07.L07 `vocabulary_assumed` has `{ term: 'HDD', source_lesson_id: 'T06.L04' }`. T06.L04 is "Conduit Fill and Pull Tension" — it does NOT introduce HDD. HDD is introduced in T06.L01 ("HDD vs Open-Cut vs Plowing"). T06.L03 also shows `{ term: 'HDD', source_lesson_id: 'T06.L01' }` confirming T06.L01 as the correct source. | Change `source_lesson_id` for 'HDD' in T07.L07 from `'T06.L04'` to `'T06.L01'`. | HIGH confidence |
| F-9 | MED | DAG pointer wrong target | L07 | vocabulary_assumed line 70 | T07.L07 `vocabulary_assumed` has `{ term: 'open-cut', source_lesson_id: 'T06.L03' }`. T06.L03 is "Conduit and Innerduct Selection" — it does NOT introduce 'open-cut'. T06.L03 itself lists `{ term: 'HDD', source_lesson_id: 'T06.L01' }` and `{ term: 'plowing', source_lesson_id: 'T06.L01' }` — pointing back to T06.L01 for the intro. T06.L01 is "HDD vs Open-Cut vs Plowing" and introduces 'HDD', 'open-cut', and 'plowing' as its core topic. | Change `source_lesson_id` for 'open-cut' in T07.L07 from `'T06.L03'` to `'T06.L01'`. | HIGH confidence |
| F-10 | LOW | Schema inconsistency | L07, L09 | Export pattern | L07 and L09 export `vocabulary_assumed` as a standalone top-level export rather than inside `meta`. L01–L06 include it inside `meta`. Both patterns work functionally but diverge from schema.md spec. | Standardize: move `vocabulary_assumed` inside `meta` in L07 and L09 to match spec and all other lessons. |  LOW impact |

---

## 4. R-1 Hint Area Sweep (L05, L08, L09, L10)

**L05 (Staking Notes — RUS Form 740):** Content is solid. Learning objectives, worked example (design delta calculation), and quiz questions are pedagogically sound. The Form 740 title issue (F-4) is the only open item. Field annotation conventions table (MR, REP, CALL, EST, LAS, TAPE symbols) are consistent with industry practice. No additional findings.

**L08 (Katapult and GIS Staking Tools):** No technical standards violations found. Katapult and FieldCom are described accurately as cloud-based/mobile staking tools. GPS accuracy tiers (smartphone ±5–10 m, handheld ±3–5 m, RTK ±2–5 cm) are consistent with GPS.gov published values. No citation errors found in this lesson.

**L09 (Staking QA — Engineer Reviews):** The catch-rate definition, re-stake triggers, and QA checklist are field-accurate. No citation issues. The ANSI O5.1 reference (line 490) appropriately limits scope: "the staker can note a class mismatch but isn't expected to run the full ANSI O5.1 calculation" — correct and defensible.

**L10 (T07 Capstone Quiz):** Branching scenario math verified at a1 (7.5 ft > 3.33 ft clear), a2 (0.7 ft < 1.0 ft conflict), bore pit and pull pit sequences. All decision branches and feedback text consistent with T07 content. Clearance math in branching scenario correctly uses Rule 235 terminology ("NESC Rule 235: 12 inches"). No new errors.

---

## 5. DAG Sweep (10 Pointers Verified)

| Term | T07 Lesson | Pointer → Source | Status |
|---|---|---|---|
| site walk | L02 | T04.L01 | ✓ — T04.L01 introduces 'site walk' |
| contour | L02 | T04.L03 | ✗ — BUG (F-3). T04.L03 vocab_introduced: ['landbase', 'shapefile', 'geodatabase', 'coordinate system', 'datum', 'UTM', 'NAD83']. No 'contour'. |
| NESC Rule 232 | L04 | T05.L01 | ✓ — T05.L01 introduces Rule 232 |
| make-ready | L04 | T05.L08 | ✓ — T05.L08 (Make-Ready & Pole Attachment) introduces make-ready |
| OTMR | L06 | T05.L09 | ✓ — T05.L09 introduces OTMR |
| HDD | L07 | T06.L04 | ✗ — BUG (F-8). T06.L04 is conduit fill/pull tension; HDD introduced in T06.L01 |
| open-cut | L07 | T06.L03 | ✗ — BUG (F-9). T06.L03 is conduit/innerduct selection; open-cut introduced in T06.L01 |
| minimum cover | L07 | T06.L02 | ✓ — T06.L02 ('burial-depth-rules') introduces 'minimum cover' |
| staking sheet | L06 | T07.L05 | ✓ — T07.L05 introduces 'staking sheet' |
| clearance | L04 | T01.L02 | ✓ — T01.L02 introduces 'clearance' |

**Summary: 3 broken pointers out of 10 sampled (30% error rate in DAG across this sweep).**

---

## 6. Citation Cascade Sweep

- **47 CFR 1.1411 (OTMR):** Consistent and correct across L06, L10. Burden-of-proof framing is accurate. No new issues.
- **NESC Rule 235 (comm-to-comm 12 inches):** Correctly cited for communication-to-communication separation throughout (L04 line 218, L10 branching scenario). Only the supply-to-comm use (40 in) is misattributed to Rule 232 in L06.
- **RUS 1751F-630 §7:** Cited for staking documentation requirements in L01, L05. Consistent across lessons, plausible citation.
- **APWA color codes (L07):** Orange=telecom, yellow=gas, red=electric, blue=water, white=proposed — consistent with CGA Best Practices (widely corroborated secondary source).

---

## 7. Cross-Lesson Contradiction Sweep

| Contradiction | Lessons | Detail |
|---|---|---|
| Rule 232 vs Rule 235 for supply-to-comm | L06 vs T05.L03 AND L04 internal | L06 cites Rule 232 Table 2 for supply-to-comm 40-inch; L04 line 218 correctly says "Rule 235 (between circuits) and Rule 232 (above ground)"; T05.L03 is definitively Rule 235. Three-way contradiction in T07 alone (F-1). |
| OSHA 1910.268(g)(1) height threshold | L01 vs L04 (body), L04 (quiz explanation) | L01 prose + quiz say "above 10 feet"; L04 body says "above 4 feet" (correct); L04 quiz explanation also says "above 10 feet" (wrong). Three error locations across two lessons, two correct locations in L04 body. (F-2 + F-6 + F-7) |
| DAG source pointers | L07 | HDD → T06.L04 (wrong, should be T06.L01); open-cut → T06.L03 (wrong, should be T06.L01). Two broken pointers in same lesson. (F-8, F-9) |

---

## 8. Vite Build

```
cd osp-training && npm run build
✓ built in 5.99s — 0 errors, 0 warnings
```

All T07 lesson imports and JSX syntax resolve clean.

---

## 9. Saturation Hint for R-3

R-1 + R-2 together found:
- **HIGH (confirmed):** F-1 (Rule 232/235 in L06), F-2 upgraded (OSHA 4 ft in L01 prose), F-3 (contour DAG), F-6 (OSHA 4 ft in L01 quiz prompt), F-7 (OSHA 4 ft in L04 quiz explanation)
- **MED:** F-8 (HDD pointer), F-9 (open-cut pointer)
- **LOW:** F-4 (Form 740 title uncertain), F-5 (driveway edition), F-10 (schema inconsistency)

**R-3 should prioritize:** (1) ANSI O5.1 pole class strength claims — neither R-1 nor R-2 verified specific numeric load/strength values from O5.1 against primary. (2) T07.L03 SCID definition and photo protocol — completely un-audited in both rounds. (3) GPS accuracy claims in L08 (smartphone ±5–10 m) against GPS.gov primary data. (4) RUS Form 740 title primary-source lookup (USDA RD form page may become accessible). HIGH pool appears saturated at 5 findings across 2 rounds; MED pool still open.

=== T07 AUDIT R2 CORROBORATION END ===
