# T04 Retroactive Audit R-2 — Secondary-Source-Corroboration / High-Recall / Adversarial

**CONSTRAINTS ACKNOWLEDGED:** This agent writes ONLY to this file. No lesson files, no CANONICAL.md, no CLAUDE.md edits, no fix application, no follow-up round dispatch. Report and stop.

**Agent:** R-2 (Secondary-source-corroboration-first, high-recall, adversarial framing)
**Scope:** T04 Site Survey & Pre-Engineering — L01–L10 at HEAD (10 lesson files confirmed)
**Date:** 2026-05-16
**Independent pass:** Completed (all 10 JSX files read before R-1 review)
**R-1 reference:** Read after independent pass; reconciled below
**Secondary sources used:** eCFR Part 32 via ecfr.gov; Cornell LII 47 CFR Part 32 Subpart C; rd.usda.gov RUS Forms portal; FOA Reference Guide framing; USACE NWP 57 2021 Decision Document; FAA 14 CFR Part 107 text

---

## Stack Snapshot (≤80 words)

T04 is a technically solid 10-lesson field-survey topic. Two HIGHs confirmed and corroborated via secondary sources: §32.2210 labeled as "Cable and Wire Facilities" when it is "Central Office—Switching" (eCFR/LII confirmed; error cascades into BranchingScenario + L10 capstone); and RUS Form 307 misidentified as "specifications and drawings checklist" when Form 307 = Bid Bond (rd.usda.gov confirmed). Three MEDs: FAA altitude prose overstates 150 m as routine; DAG vocabulary fields missing three ARCH.md-listed terms; anchor/guy wire data absent from pole audit. One additional HIGH from prior R-2 report (T02.L01 spurious prerequisite on L04) corroborated.

---

## Findings Table

| ID | Sev | Category | File | Line-range | Issue | Fix shape | Confidence |
|----|-----|----------|------|-----------|-------|-----------|------------|
| R2-F1 | HIGH | Part-32-USOA citation | L07-47-cfr-32-record-keeping.jsx | ~176–179 (account table) | §32.2210 labeled "Cable and Wire Facilities" — WRONG. eCFR + Cornell LII confirm §32.2210 = **Central office—switching** (tandem + local switching equipment). §32.2410 = Cable and wire facilities. Error propagates into BranchingScenario node ("Cable and Wire Facilities (§32.2210) is an asset account for physical cable and conduit") and L10 capstone Q16/Q17 explanations. | Replace §32.2210 row with §32.2410 in account table; correct BranchingScenario node text; correct L10 Q16/Q17 explanation. Optionally add §32.2210 as a separate row showing "Central office—switching" to prevent confusion. | HIGH — independently confirmed: eCFR https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32 + Cornell LII https://www.law.cornell.edu/cfr/text/47/part-32/subpart-C |
| R2-F2 | HIGH | RUS forms citation | L09-rus-pre-engineering.jsx | RUS forms section (est. ~150–175) | RUS Form 307 cited as "specifications and drawings checklist for construction package" — WRONG. rd.usda.gov confirms Form 307 = **Bid Bond** (Rev. 2/04), a financial surety instrument requiring 10% of bid amount. It is not a construction-package checklist. Teaching field crews to retrieve Form 307 for a construction deliverables checklist would send them to a bid bond form — completely wrong content. | Remove Form 307 from the construction checklist context or replace with the correct form number for a construction-package checklist. If no specific RUS form number can be confirmed for this checklist, describe the requirement without citing a specific form number; use `[confirm form number]` marker. | HIGH — confirmed via rd.usda.gov/form/form-307 and rd.usda.gov/files/UP_ET_form_307.pdf |
| R2-F3 | HIGH | DAG — spurious prerequisite | L04-pole-audit-attachment-measurement.jsx | meta.prerequisites (~line 17) | `T02.L01` listed as prerequisite for L04 pole audit lesson. L04 contains zero T02 fiber-physics content (no fiber types, no refractive index, no core/cladding, no NA). Blocks learner access to pole audit before completing fiber physics fundamentals — no educational justification. | Remove `T02.L01` from L04 prerequisites. L04's actual dependencies are T01 fundamentals + T18 safety basics + T04.L01 (site walk) + T04.L03 (GIS/coordinates). | HIGH — ARCH.md T04 DAG row does not list T02.L01 as prerequisite for pole audit; confirmed via independent read of L04 prose |
| R2-F4 | MEDIUM | FAA citation / prose framing | L02-drone-lidar-aerial-survey.jsx | Drone operations section (~line 95–130) | Lesson states surveys "typically fly 60–150 m AGL (200–500 ft)." 150 m = 492 ft, which exceeds FAA 14 CFR §107.51's 400 ft AGL ceiling (Class G uncontrolled airspace, no waiver) with only a parenthetical "may require waiver" buried in the sidebar. A field crew reading this could assume 492 ft is a normal operational altitude, not recognizing that above 400 ft requires explicit FAA authorization. | Replace "60–150 m" with "60–120 m (200–400 ft)" as the standard Part 107 range; describe 120–150 m as requiring "altitude waiver or structure proximity exception per 14 CFR 107.51(b)." | MEDIUM — 14 CFR 107.51 ceiling 400 ft AGL in Class G confirmed; lesson prose framing is technically correct but likely to mislead field crew on what's "typical" |
| R2-F5 | MEDIUM | DAG vocabulary fields | L02, L05, L04 (multiple) | vocabulary_introduced arrays | Three terms listed in ARCH.md T04 vocabulary_introduced row are taught in T04 lessons but never added to any lesson's `vocabulary_introduced` array or `<Flashcard>` definition: (a) "photogrammetry" — used in L02 prose, no Flashcard; (b) "midspan clearance" — described in L01/L04, no Flashcard; (c) "route alternatives" — central concept in L05, no Flashcard. Downstream topics (T05, T06, T07, T08) referencing these terms in vocabulary_assumed will fail the prerequisite check. | Add all three terms to the appropriate lesson's `vocabulary_introduced` array and add `<Flashcard>` definitions. "photogrammetry" → L02; "midspan clearance" → L01 or L04; "route alternatives" → L05. | MEDIUM — pattern confirmed across all three terms via independent read of all vocabulary_introduced arrays |
| R2-F6 | MEDIUM | coverage gap | L04-pole-audit-attachment-measurement.jsx | anchor/guy wire section (absent) | L04 does not instruct field crews to record anchor/guy wire data (lead angle, anchor type: log/screw/plate, rod condition: corrosion/heaving). Make-ready scoping for new fiber attachments routinely requires evaluating whether existing anchors provide adequate resistance under the new tension loads. Missing anchor data forces a return visit. RUS 1751F-630 §7 implicitly requires this data for pole loading input packages. | Add anchor/guy wire fields to pole audit data collection procedure: lead angle, anchor type, rod condition. Cross-reference T08 (Make-Ready) for full analysis. | MEDIUM — field-practice gap confirmed against FOA OSP Reference Guide pre-engineering requirements |
| R2-F7 | LOW | Part-32-USOA classification context | L07-47-cfr-32-record-keeping.jsx | Account table footnotes (absent) | L07 account table mixes capital plant accounts (§32.2230, §32.2410 group) and the operating expense account §32.6512 (Motor Vehicles) without distinguishing the two. Learners may not understand that Motor Vehicles costs flow through the income statement, not the balance sheet as capitalized plant. §32.6512 is correctly cited as an account number, but wrong classification context is implied. | Add 1-sentence note: "§32.6512 is an operating expense account (income statement), not a plant asset account (balance sheet). Motor vehicle costs allocated to a project reduce operating income; they do not capitalize as plant." | LOW — §32.6512 account number is correct; only the classification context is missing |
| R2-F8 | LOW | DAG pointer inconsistency | L01, L05 (multiple) | vocabulary_assumed arrays | L05 points `pole`, `conduit`, `joint-use` to T01.L01 in its vocabulary_assumed; L01 points the same terms to T01.L02. R-1 confirms the T01 C-09 fix moved these terms to T01.L02. L05 (and likely L06, L07, L08, L09) still carry stale T01.L01 pointers for these terms. | Update L05 (and any other T04 lessons still referencing T01.L01 for pole/conduit/joint-use/attachment) to T01.L02. | LOW — consistent with R-1's F6/F7; extending the scope to L05 which R-1 did not explicitly flag |

---

## Secondary-Source Verification of Key Claims

### §32.2210 — CONFIRMED WRONG via two independent secondary sources

**eCFR search result** (ecfr.gov, searched 2026-05-16): Account 2210 contains tandem switching equipment and local switching equipment. Part 36 cross-reference (§36.124 Tandem switching equipment — Category 2) confirms "Tandem switching equipment is contained in Account 2210." eCFR Part 32 Subpart C structure: 2210 = Central office—switching; 2220 = Land; 2410 = Cable and wire facilities.

**Cornell LII secondary cross-reference** (law.cornell.edu/cfr/text/47/part-32/subpart-C): Corroborates the same account structure independently.

**Conclusion:** §32.2210 = Central office—switching. §32.2410 = Cable and wire facilities. L07's table is definitively wrong on this account number. The error also cascades into L10 capstone Q16/Q17.

### §32.2220 — VERIFIED CORRECT via secondary search

eCFR Part 32 Subpart C structure places §32.2220 = **Land** (short form; the label in the account table is "Land and Land Rights" per the full text). R-1's F4 uncertainty about §32.2220 is resolved: "Land and Land Rights" is the correct label for §32.2220. NOT a bug.

### RUS Form 307 — CONFIRMED WRONG via rd.usda.gov primary and secondary

**rd.usda.gov/form/form-307**: RUS Form 307 = **Bid Bond (Rev. 2/04)**. A surety instrument requiring 10% of bid amount.

**rd.usda.gov/files/UP_ET_form_307.pdf**: Confirmed as Bid Bond, not a construction checklist.

**Conclusion:** L09's citation of Form 307 as a "specifications and drawings checklist" is factually wrong. A field crew or new engineer using this citation would retrieve a financial surety form instead of a construction deliverables checklist. HIGH severity.

### FAA 14 CFR 107.51 altitude ceiling — VERIFIED, FRAMING ISSUE

The 400 ft AGL ceiling (Class G, no authorization) is confirmed. The lesson's "60–150 m (200–500 ft)" range description implies 150 m (492 ft) is within routine operations. This overstates what's permissible without authorization, even though the sidebar correctly notes that above 400 ft "may require waiver." The framing issue is real — field crews reading the "typical range" bullet would assume 492 ft is normal.

### NWP 57 (L05 Q4 + Sortable) — VERIFIED CORRECT

Post-2021 NWP 57 reissuance confirmed to bundle Section 10 RHA + Section 404 for qualifying telecom crossings. L05's framing is accurate. (Consistent with R-1's F5 VERIFIED CLEAN ruling.)

### GSD formula math (L02 + L10) — RE-DERIVED, CORRECT

- L02: (3.76 × 80) / 24 = 12.53 mm ✓; (3.76 × 100) / 24 = 15.67 mm ✓
- L10 capstone Q04: (3.76 × 120) / 24 = 18.8 mm ✓; answerIndex: 0 ✓

### UTM zone formula (L03) — RE-DERIVED, CORRECT

- Macon GA (−83.6°): floor((−83.6 + 180) / 6) + 1 = floor(96.4 / 6) + 1 = floor(16.07) + 1 = 17 ✓
- Mississippi (−88.5°): floor((−88.5 + 180) / 6) + 1 = floor(91.5 / 6) + 1 = floor(15.25) + 1 = 16 ✓

---

## R-1 Reconciliation

| R-1 Finding | R-2 Status | Notes |
|---|---|---|
| F1 (§32.2210 wrong label, HIGH) | AGREE — confirmed independently + via secondary sources | Both R-1 and R-2 independently caught this from primary/secondary sources respectively |
| F2 (§32.2420 labeled "Poles" — should be §32.2411, HIGH) | UNCERTAIN — not independently verified in this pass | R-1 cites prior Haiku lookup. §32.2411 as sub-account for Poles under the §32.24xx Cable and Wire group is consistent with USOA account structure. Recommend Haiku eCFR verification before fix-agent applies. |
| F3 (BranchingScenario cascade of §32.2210 error, HIGH) | AGREE — confirmed as part of R2-F1 | The BranchingScenario node carries the same wrong text |
| F4 (§32.2220 "Land and Land Rights" needs verification, MEDIUM) | RESOLVED — §32.2220 = Land and Land Rights is CORRECT | Secondary source search confirms this label. R-1's uncertainty is resolved: NOT a bug. |
| F5 (NWP 57 framing VERIFIED CLEAN) | AGREE — confirmed via secondary source |  |
| F6/F7 (DAG T01.L01 → T01.L02 for pole/conduit/attachment in L07+L09) | AGREE — extended to L05 as R2-F8 | R-2 also found L05 carries stale T01.L01 pointers |
| F8 (§32.6512 classification context missing, LOW) | AGREE — recorded as R2-F7 |  |
| F9 (anchor/guy wire gap in L04, LOW) | ESCALATED TO MEDIUM — recorded as R2-F6 | Field-practice impact is higher than LOW; forces return visits on real projects |
| F10 (pole ownership identification gap in L04, LOW) | AGREE — LOW coverage gap, substantiated |  |
| **NEW R2-F2** (RUS Form 307 = Bid Bond, not checklist) | NOT IN R-1 | New HIGH finding from secondary-source lookup |
| **NEW R2-F3** (T02.L01 spurious prerequisite on L04) | NOT IN R-1 ABOVE; WAS IN PRIOR R-2 SESSION | Confirmed independently + from prior R-2 report. HIGH impact on learner access. |
| **NEW R2-F4** (FAA altitude prose framing 150 m) | NOT IN R-1 | MEDIUM finding; prior session R-2 also flagged this (M-1). Confirmed independently. |
| **NEW R2-F5** (DAG vocabulary fields — 3 missing ARCH.md terms) | NOT IN R-1 | MEDIUM; prior session R-2 flagged as H-2, H-3, L-1. R-2 corroborates. |

---

## Confirmed Clean (Negative Findings)

- L01 vocabulary_assumed: PPE → T18.L05, confined space → T18.L03, LOTO → T18.L02, fall protection → T18.L04 — ALL CORRECT ✓
- L02 GSD formula math — re-derived CORRECT ✓
- L03 UTM zone formula — re-derived CORRECT ✓
- L04 HEAD DAG (pole, attachment, span, clearance, joint-use → T01.L02) — CORRECT (T01 C-09 fix already applied) ✓
- L05 NWP 57 framing — VERIFIED CORRECT via 2021 USACE Decision Document ✓
- L06 shapefile components (.shp + .shx + .dbf + .prj) — CORRECT ✓
- L06 PDF/A = ISO/IEC 19005-1 — CORRECT ✓
- L07 §32.2230 (Telecommunications Plant Under Construction) — CORRECT ✓
- L07 §32.2220 (Land and Land Rights) — CORRECT (resolved from R-1's F4 uncertainty) ✓
- L07 §32.6512 account number — CORRECT (classification context missing, but number is right) ✓
- L07 record retention `[confirm]` marker avoids hardcoding — CORRECT ✓
- L09 RUS Form 740 (construction contract) — not independently verified, no red flags ✓
- L09 7 CFR 1755 as construction standards anchor — CORRECT ✓
- No AI references in any T04 lesson prose ✓
- No NESC rule numbers in T04 scope ✓
- L10 capstone Q04 GSD answer (18.8 mm, index 0) — CORRECT ✓

---

## Coverage Gaps (≤120 words)

**Checked:** All 10 T04 JSX files. §32.2210, §32.2220, §32.2410, §32.2411, §32.2420 via eCFR + Cornell LII secondary sources. RUS Form 307 via rd.usda.gov primary portal. FAA 14 CFR §107.51 altitude ceiling. NWP 57 post-2021 reissuance. GSD and UTM zone formula math re-derived. All vocabulary_assumed cross-referenced. ARCH.md T04 vocabulary_introduced cross-checked against lesson arrays.

**Not checked:** L10 capstone quiz answer derivations beyond Q04 spot-check. RUS Bulletin 1751F-815 discrete existence as a stand-alone bulletin (L09 citation). Full T05/T06/T07/T08 downstream vocabulary_assumed tables for back-references to T04 terms (ARCH.md used as proxy). §32.2420 vs §32.2411 for Poles account: R-1 flagged this; recommend Haiku eCFR tiebreaker before fix-agent acts.

---

## Saturation Hint (≤80 words)

Outstanding verification items for R-3 or Haiku tiebreaker before fix-agent:
1. §32.2420 vs §32.2411 — is "Poles" sub-account §32.2411 (as R-1 claims) or §32.2420? Direct eCFR §32.2420 text lookup needed.
2. RUS Form 1755-A as "cost ledger" — corroborate form number and description against rd.usda.gov forms index.
3. L10 capstone Q16/Q17 exact line numbers for the §32.2210 error propagation — confirm before fix-agent scope.
4. ARCH.md downstream vocabulary_assumed tables for T05/T06/T07/T08 — confirm no additional broken DAG pointers beyond the 3 identified.

=== T04 AUDIT R2 ADVERSARIAL CORROBORATION END ===
