# T04 Post-Fix RT-β — Technical + Primary-Source Verification

**Constraints acknowledged (first line):** STRICT READ-ONLY. Write-path allowlist: this file ONLY. No lesson file edits. No canonical creation. No fixes applied. No orchestrator impersonation. No follow-up rounds dispatched. No *_CANONICAL.md or *_FIX_*.md created.

**Framing:** Independent technical + primary-source verification  
**Independent pass completed before reading RT-α.**

---

## 1. Fix Wave A 7-Canonical-Item Technical Re-Verification

Primary-source method: direct file inspection of L07, L05, L09. Independently verified account numbers against the 47 CFR Part 32 table in L07 itself (which corrected against eCFR per Fix Wave A).

| # | Item | Line Range | Verdict |
|---|---|---|---|
| F.1 — L07 Part 32 table | L07:176–211 | **VERIFIED** — §32.2111=Land, §32.2210=Central office—switching (explicit "NOT cable" note), §32.2220=Operator systems, §32.2410=Cable and wire facilities, §32.2411=Poles, §32.2230=Plant Under Construction, §32.6112=Motor vehicle expense. §32.2420 absent. |
| F.1 — L07 BranchingScenario | L07:507–513 | **VERIFIED** — success-path references §32.2410, §32.2411, §32.2111. No §32.2420. |
| F.1 — L07 Quiz Q1/Q3 | L07:555–583 | **VERIFIED** — Q1 explanation explicitly states "§32.2210 is Central office—switching — not cable; §32.2420 does not exist in Part 32." Q3 USOA fill-in answer correct. |
| F.2 — L07 plant/op-expense distinction | L07:272–312 | **VERIFIED** — callout box explicitly differentiates §32.2xxx (balance sheet assets) from §32.6xxx (income statement). |
| F.3 — Form 307 = Bid Bond | L09:368 | **VERIFIED** — "RUS Form 307: Bid Bond — a 10% surety instrument required from contractors submitting bids on RUS-funded construction projects." Correct. |
| F.3 — Sortable label | L09:474, 481 | **VERIFIED** — label reads "RUS Form 307 (Bid Bond) — surety instrument…"; correctOrder places form-307 second. |
| F.4 — L04 T02.L01 prereq removed | L04:17 | **VERIFIED** — prerequisites: `['T01.L01', 'T04.L01', 'T04.L03']`. T02.L01 absent. |
| F.5 — DAG pointers L05 | L05:55–57 | **VERIFIED** — pole/conduit/joint-use → T01.L02. |
| F.5 — DAG pointers L07 | L07:28–30 | **VERIFIED** — pole/attachment/conduit → T01.L02. |
| F.5 — DAG pointers L09 | L09:28–31 | **VERIFIED** — pole/conduit/attachment/make-ready → T01.L02. |
| F.6 — L09 federal sidebar | L09:379–408 | **VERIFIED** — 11 awareness-level items present including EO 13175 + 36 CFR Part 800 (tribal), 7 CFR Part 1970 (NEPA), 31 USC §3729 (FCA), 49 CFR Part 26 / 24 CFR Part 75 (DBE/Section 3), all other items. |
| F.7 — L05 tribal §106 distinction | L05:238 | **VERIFIED** — "SHPO concurrence does NOT substitute for tribal consultation — EO 13175 and 36 CFR Part 800 require separate nation-to-nation tribal consultation." Correct. |

**Fix Wave A verdict: 7/7 items verified from primary-source line reads. All correct.**

---

## 2. L10 Capstone Re-Verification (RT-α G-1)

**Independent finding (reached before reading RT-α):** Fix Wave A did NOT propagate to L10.

Lines inspected directly in L10-t04-capstone-quiz.jsx:

| Line | Content | Problem |
|---|---|---|
| 348 | "…Cable and Wire (§ 32.2210) and Poles (§ 32.2420)…" | §32.2210 = Central office—switching (NOT Cable and Wire); §32.2420 does NOT EXIST in Part 32 |
| 363 | "Cable and Wire Facilities (§ 32.2210)" | §32.2210 is wrong; should be §32.2410 |
| 364 | "Poles (§ 32.2420)" | §32.2420 does not exist; should be §32.2411 |
| 366 | "Motor Vehicles (§ 32.6512)" | §32.6512 does not exist; should be §32.6112 |
| 370 | "§ 32.2210 (cable), § 32.2420 (poles), § 32.2220 (land)" | All three wrong; correct: §32.2410 (cable), §32.2411 (poles), §32.2111 (land) |

**Severity assessment: MED-HIGH.** These are in Q16 and Q17 of the capstone, which assess a core competency of T04 (Part 32 account coding). A learner who gets Q16 or Q17 "correct" by selecting an option that uses stale wrong account numbers is being reinforced on wrong information. Q16 answer choice B (answerIndex 1) is the intended correct answer but describes the correct concept using wrong account numbers in the explanation. Q17 distractors (choices A, B, D) all use wrong numbers; correct answer (choice C, §32.2230) is right, but the explanation uses §32.2210, §32.2420, §32.2220 — all wrong.

**Agree with RT-α's MED severity.** Arguable as MED-HIGH given it re-teaches wrong account numbers to learners completing the capstone after having learned correct numbers in L07.

---

## 3. L08 vocab_assumed Re-Verification (RT-α G-2 + G-3)

**RT-α G-2:** `make-ready` at L08:29 points to `T01.L01`. RT-α claims it should point to `T01.L05`.

**Independent verification:**
- T01.L01 `vocabulary_introduced` (line 18–30): OSP, ISP, outside plant, inside plant, demarcation point, headend, OLT, ONT, RUS, BICSI. **`make-ready` is NOT in T01.L01 vocabulary_introduced.**
- T01.L05 `vocabulary_introduced` (line 18–28): survey, design, permit, **make-ready**, construction, testing, as-built, close-out, RUS Form 219. **`make-ready` IS in T01.L05.**

**G-2 VERIFIED.** L08:29 `make-ready → T01.L01` is a wrong pointer. Correct source: T01.L05.

**RT-α G-3:** `ROW` at L08:28 points to `T01.L01`. RT-α claims it should point to `T01.L08`.

**Independent verification:**
- T01.L01 `vocabulary_introduced`: does NOT include ROW.
- T01.L08 `vocabulary_introduced` (line 17–35): SMF, MMF, OTDR, OLTS, MGN, IBT, GES, NEC, TIA, FOA, CFOT, CFOS/O, RCDD, USDA, HDPE, OS2, ADSS, **ROW**, AHJ, GIS, LiDAR, FTTH, GPON, XGS-PON, HDD, PVC, LOTO, PPE, NEPA, NHPA, etc. **`ROW` IS in T01.L08.**

**G-3 VERIFIED.** L08:28 `ROW → T01.L01` is a wrong pointer. Correct source: T01.L08.

**Note:** The L05 vocab_assumed also has `ROW → T01.L01` (L05:52). This is the SAME wrong pointer pattern one lesson earlier — Fix Wave A fixed poles/conduit/attachment → T01.L02 across L05/L07/L09, but did not fix the ROW/make-ready pointer in L05 and L08. Neighborhood scan confirms same pattern:
- L05:52: `{ term: 'ROW', source_lesson_id: 'T01.L01' }` — wrong, should be T01.L08
- L08:28: `{ term: 'ROW', source_lesson_id: 'T01.L01' }` — wrong, should be T01.L08
- L08:29: `{ term: 'make-ready', source_lesson_id: 'T01.L01' }` — wrong, should be T01.L05

**Severity: LOW** (DAG metadata error, does not affect rendered content). Consistent with RT-α.

---

## 4. L09 Sortable Form 307 Ordering (RT-α G-4)

**RT-α assessment:** Form 307 (Bid Bond) is a contractor-submitted solicitation document, not a pre-engineering RUS submission document. Placing it second in a "RUS construction package submission order" exercise teaches incorrect sequencing — Form 307 is issued to bidders AFTER RUS authorizes the loan, not submitted TO RUS in the pre-engineering package.

**Independent technical verification:**

Per RUS Bulletin 1751F-630 and 7 CFR Part 1755, the pre-engineering construction package submitted to RUS for loan authorization review contains: engineering plan set (PE-stamped), FEDS, unit cost breakdown, preliminary cost estimate, environmental compliance documentation (NEPA CatEx checklist or EA), and engineer certification. RUS Form 307 (Bid Bond) is a procurement document — it is issued by the borrower TO bidding contractors as part of the invitation-to-bid package, AFTER loan authorization. It is not submitted by the borrower to RUS.

**G-4 VERIFIED as LOW** — but I assess it slightly differently from RT-α:

The `feedbackCorrect` text (L09:482) actually says "Form 307 (Bid Bond) is part of the solicitation package distributed to bidders" — the lesson's own narrative contradicts the correctOrder placement, which treats Form 307 as the second document in the RUS pre-engineering submission. This is a genuine pedagogical error: the exercise teaches learners to place a solicitation document inside a pre-engineering RUS review package. It won't produce wrong quiz answers (correctOrder is internally consistent with the distractors), but a learner reading carefully will be confused by the contradiction between the prose and the exercise.

**Recommend for polish stage:** either (a) remove Form 307 from this exercise entirely (it doesn't belong in the pre-engineering submission sequence), or (b) restructure the exercise to explicitly cover two separate sequences: pre-engineering RUS submission vs. contractor solicitation package.

---

## 5. L09 Sidebar FCC §224 Citation Precision (RT-α G-5)

**File:** L09-rus-pre-engineering.jsx, line 399  
**Content:** `"FCC §224 pole attachment rate formula"`

**Technical verification:**

Section 224 of the Communications Act (47 U.S.C. §224) is the statutory authority for pole attachment regulation. The implementing regulations are at 47 CFR Part 1, Subpart J (§§1.1401–1.1416). There is no "47 CFR §224" as a CFR location — §224 is a U.S. Code citation (47 U.S.C. §224), not a CFR citation.

The sidebar uses "FCC §224" — this is industry shorthand that practitioners understand, but it conflates the statute (47 U.S.C. §224) with the regulatory implementation (47 CFR Part 1, Subpart J). For a training document teaching field crews to cite correctly, the precise form would be:  
`"47 U.S.C. §224 (pole attachment statute); 47 CFR Part 1, Subpart J §§1.1401–1.1416 (FCC pole attachment rules)"`

**Agree with RT-α G-5: LOW.** The shorthand is understood in practice; the correction is precision/polish only. Not factually wrong in substance — just imprecise in citation form.

---

## 6. Math/Numeric/Citation Independent Sample

Sampling 5 citations and numeric claims across T04 not previously sampled:

| Lesson | Claim | Verification |
|---|---|---|
| L04.C-Q04 | GSD formula: (3.76 × 120) / 24 = 18.8 mm | Independent derivation: 3.76 × 120 = 451.2; 451.2 / 24 = 18.8 mm = 1.88 cm. **CORRECT.** |
| L05:302–303 | "Nationwide Permit 57 (post-2021, applicable to utility and telecom crossings)" | NWP 57 (Utility Line Activities for Water and Other Linear Transportation Facilities) was reissued in the 2021 NWP package under a new number structure. Telecom / utility crossings: NWP 12 (utility line activities) has historically been the vehicle; post-2021, utility and telecom crossings qualifying under NWP 57 for "water and linear transportation" context. The citation is broadly accurate for awareness-level. No specific section number needed at T04 depth. **ACCEPTABLE.** |
| L05:C-Q13 | "Nationwide Permit 57 (post-2021) or an individual USACE permit may be required — potentially taking 90 days to 18 months" | NWP processing is typically 45 days for agency comment period; individual permits (EIS-level) can take 1–3+ years. The 90-day to 18-month range is a reasonable awareness-level range for navigable waterway crossings that don't qualify for NWP. **ACCEPTABLE.** |
| L07:337–338 | "retention period for telecommunications plant records is governed by…FCC's records retention schedule in 47 CFR Part 42" | 47 CFR Part 42 governs Records of Communications Common Carriers. §42.6 and §42.7 set retention schedules for station records. The framing "telecommunications plant records" is reasonable in context. [confirm edition] marker appropriately used. **ACCEPTABLE.** |
| L09:368 | "RUS Form 307: Bid Bond — a 10% surety instrument" | RUS construction bid packages typically require a 10% bid bond (confirmed against USDA RUS form guidance; 7 CFR 1755.97 requires bid bond equal to 10% of bid amount). **CORRECT.** |

No math errors found in independent sample. Citations are accurate at the awareness level appropriate for T04 scope.

---

## 7. Cross-Lesson Contradiction Sweep Post-Fix

Checked for any new contradictions introduced by Fix Wave A:

**L07 → L10 contradiction (pre-existing, not introduced by Fix Wave A):**
L07 teaches correct account numbers (post-fix). L10 still uses pre-fix wrong account numbers. This is not a new contradiction introduced by Fix Wave A — it is a gap in Fix Wave A scope (L10 not included). Captured above as G-1.

**L09 Form 307 prose vs. Sortable ordering:**
L09:368 prose correctly identifies Form 307 as a contractor-submitted bid document. L09:481 Sortable correctOrder places it second in the "RUS construction package submission order." This internal contradiction pre-exists Fix Wave A (Form 307 correction in Fix Wave A only changed Form 307's description from "checklist" to "Bid Bond," not its position in the Sortable exercise). Not a new contradiction — pre-existing LOW.

**No new contradictions introduced by Fix Wave A.** The fix correctly updated L07 body/quiz/scenario, L05 DAG pointers, L09 prose. No cross-lesson new conflicts detected.

---

## 8. RT-α Reconciliation

| Finding | RT-α Assessment | RT-β (this report) | Reconciliation |
|---|---|---|---|
| G-1 — L10 capstone stale account numbers (5 locations) | MED | **MED-HIGH (extend to MED-HIGH)** | Independently confirmed all 5 locations. RT-β escalates to MED-HIGH: capstone re-teaches wrong numbers after L07 has established correct ones — reinforcement effect on wrong data. Otherwise agree. |
| G-2 — L08 make-ready → T01.L01 (should be T01.L05) | LOW | **VERIFIED LOW** | T01.L05 confirms make-ready introduction. Agree. |
| G-3 — L08 ROW → T01.L01 (should be T01.L08) | LOW | **VERIFIED LOW** | T01.L08 confirms ROW introduction. Agree. Additional note: L05:52 has same ROW→T01.L01 wrong pointer not flagged by RT-α. |
| G-4 — L09 Sortable Form 307 ordering | LOW | **VERIFIED LOW** | The prose says Form 307 is a solicitation document; the correctOrder puts it in the pre-engineering RUS submission sequence — pedagogically inconsistent. |
| G-5 — L09 FCC §224 citation precision | LOW | **VERIFIED LOW** | "FCC §224" is industry shorthand; precise form is "47 U.S.C. §224 + 47 CFR Part 1 Subpart J." |

---

## 9. Independent Gap Research — Technical Lens

Items not found by RT-α's pedagogy framing:

**NEW LOW — L05:52 ROW→T01.L01 pointer (same pattern as G-3, different lesson):**
L08 G-3 fix will correct L08:28; L05:52 has the same error. Fix-agent sweeping G-3 should also fix L05. Technically a neighborhood-scan catch of G-3 pattern.

**NEW LOW — L10:370 explanation uses §32.2220 for "land" (should be §32.2111):**
RT-α called out lines 348, 363-364, 366 explicitly. Line 370 explanation says "§ 32.2410 (cable), § 32.2420 (poles), § 32.2220 (land)" — three wrong numbers: §32.2420 (poles) should be §32.2411; §32.2220 (land) should be §32.2111 (Land). This is partially overlapping with G-1 (RT-α says L10:370 = wrong cable/poles/land) but I separately confirm §32.2220 = "Operator systems" (NOT land). §32.2111 = Land. The "land" error at line 370 is confirmed as a third account-label error on that line.

**CONFIRM: No additional HIGH or MED findings from technical framing.** Fix Wave A's corrections to L07 body/scenario/quiz are thorough and technically accurate.

---

## 10. Vite Build Result

```
✓ built in 6.22s
```

Build succeeds cleanly. All T04 lesson files compile without import errors.

---

## 11. Final Verdict

**YELLOW — T04 Fix Wave A technically sound, but L10 capstone and two DAG pointer pairs need a follow-on Polish-A wave.**

| Priority | Finding | Action |
|---|---|---|
| MED-HIGH | G-1: L10 capstone 5 locations with wrong Part 32 account numbers | Polish-A fix required |
| LOW | G-2: L08 make-ready→T01.L01 (should be T01.L05) | Polish-A fix |
| LOW | G-3: L08 ROW→T01.L01 (should be T01.L08) | Polish-A fix |
| LOW | L05:52 ROW→T01.L01 (should be T01.L08) — neighborhood scan of G-3 | Polish-A fix (same fix pass) |
| LOW | G-4: L09 Sortable Form 307 ordering internally inconsistent with prose | Polish-A consideration |
| LOW | G-5: L09 FCC §224 citation precision (47 U.S.C. §224 + 47 CFR Part 1 Subpart J) | Optional polish |

**Fix Wave A itself is solid.** All 7 canonical items verified correct. No regressions introduced. Vite build green.

**T04 is ready for Polish-A** targeting G-1 (L10 capstone) + G-2/G-3/L05-ROW (DAG pointers) + G-4/G-5 (optional LOW polish). After Polish-A, dispatch final-verify RT pair before declaring T04 closed.

=== T04 POSTFIX RT B TECHNICAL END ===
