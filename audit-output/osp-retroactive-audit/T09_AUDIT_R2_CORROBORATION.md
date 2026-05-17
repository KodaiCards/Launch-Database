# T09 AUDIT R2 — CORROBORATION-ADVERSARIAL / HIGH-RECALL
**Framing:** Corroboration-adversarial, high-recall — OSP permitting/environmental compliance specialist 15+ yrs  
**Lessons audited:** L01–L12 (12 lessons total), with full reads on L07, L08, L10, L11 + adversarial sweeps  
**Constraint acknowledgement: READ-ONLY audit. Write-path: this file ONLY. No lesson edits, no canonicals, no CLAUDE.md edits, no follow-up dispatch, no fixes applied.**

---

## 1. Stack Snapshot (≤80 words)

12 lessons audited. Independent primary-source verification of all R-1 HIGH and MED claims. Major discovery: **7 CFR Part 1970 was REMOVED effective April 2026** — L11 teaching it as current regulation is factually stale. R-1's CEQ withdrawal claim independently VERIFIED (FR 2026-00178, effective Jan 8, 2026). NLEB FR citation corrected: rule is 87 FR 73488 (not 88 FR 6358). Flashcard prop mismatch confirmed in L07, L08, L11 (all 3 use non-standard `term`/`definition` props vs component's required `deckId`/`cards` signature). Multiple new findings below.

---

## 2. R-1 Reconciliation

| R-1 ID | Verdict | Independent verification |
|--------|---------|--------------------------|
| F-01 (CEQ 40 CFR 1500-1508 removal) | **AGREE** | CONFIRMED: FR 2026-00178 published January 8, 2026 removing 40 CFR Parts 1500-1508. Interim final rule April 11, 2025; adopted as final Jan 8, 2026. https://www.federalregister.gov/documents/2026/01/08/2026-00178/ |
| F-02 (40 CFR §1501.7 lead agency rule removed) | **AGREE** | CONFIRMED: Same FR 2026-00178 removes all of Parts 1500-1508 including 1501.7. The statute (42 USC §4332) still requires agency coordination; CEQ rule citation is stale. |
| F-03 (87 FR 57298 wrong NWP 2021 FR cite) | **AGREE** | CONFIRMED: 2021 NWP reissuance published 86 FR 2744 (January 13, 2021). Four new NWPs (55-58) including NWP 57 for telecom issued there. Effective March 15, 2021; expired March 14, 2026. 87 FR 57298 is a different document (2022). https://www.govinfo.gov/app/details/FR-2021-01-13/2021-00102 |
| F-04 (NLEB date) | **AGREE WITH CORRECTION** | R-1 says "88 FR 6358, Jan. 30, 2023." Independent verification: the NLEB final rule is **87 FR 73488**, published November 30, 2022 (NOT "88 FR 6358"). The January 26, 2023 delay notice is 88 FR 5528. The effective date moved to March 31, 2023. R-1's FR number is wrong — "88 FR 6358" does not appear to correspond to the NLEB rule. The lesson's citation of "88 FR 6358" is doubly wrong: wrong FR volume/page AND wrong date. Correct citation: "87 FR 73488 (Nov. 30, 2022); effective date delayed to March 31, 2023 per 88 FR 5528 (Jan. 26, 2023)." |
| F-05 (CE C-8 NTIA designation LOW-MED) | **AGREE** | The [confirm] marker already present is appropriate. No new primary source dispute. |
| F-06 (T04.L01 "route survey wetland flags" vocab_assumed) | **AGREE — CONFIRMED GAP** | T04.L01 vocabulary_introduced = ['site walk', 'existing utility', 'hazard identification', 'photo log']. "Route survey wetland flags" is NOT in T04.L01 vocabulary_introduced. T04.L01 does mention wetland markers in its body prose but the exact term is never formally introduced. DAG pointer is broken. |
| F-07 (T04.L06 KMZ/shapefile) | **AGREE — UNCERTAIN** | T04.L06 is titled "KMZ, shapefile, PDF deliverables" — the pointer is directionally plausible. Need Haiku ground-truth to confirm exact term form. |
| F-08 (L11 Flashcard non-standard props) | **AGREE — CONFIRMED WORSE THAN REPORTED** | Flashcard.jsx exports `function Flashcard({ deckId, cards })` — it accepts ONLY `deckId` and `cards` props. L11 uses `<Flashcard key={term} term={term} definition={definition} />`. This renders broken flashcards silently. **Furthermore: L07 and L08 use the SAME broken pattern.** L07 line 139: `<Flashcard key={term} term={term} definition={definition} />`. L08 line 136: `<Flashcard key={term} term={term} definition={definition} />`. R-1 only flagged L11; **L07 and L08 have the same defect.** Severity should be HIGH — all 3 lessons' flashcards are non-functional. |
| F-09 (Railroad crossing coverage gap) | **AGREE** | AAR Broadband Reference Chart confirms railroad crossing permits are a distinct permitting track (each railroad maintains its own crossing permit process; AREMA Manual §1.5 governs utility crossings; longitudinal placements have additional requirements). T09 covers zero railroad permitting. Real gap for rural RUS-program routes where railroad ROW crossings are common. |

---

## 3. New Findings

| ID | Severity | Category | Lesson:Line | Issue | Fix shape | Source | Confidence |
|----|----------|----------|-------------|-------|-----------|--------|------------|
| R2-N01 | **HIGH** | Regulatory staleness / factual accuracy | L11 throughout (lines 81, 106, 108, 127, 132-133, 136) | 7 CFR Part 1970 — the entire basis of L11 — was **removed effective April 2026** per a USDA final rule in response to the CEQ rescission. eCFR now shows Part 1970 as "[Reserved]". L11 teaches 7 CFR 1970 as the current RUS NEPA authority. It is no longer binding regulation. RUS NEPA procedures have migrated to 7 CFR Part 1b (department-level USDA NEPA). The lesson's core regulatory framework is now stale. | Add a prominent staleness notice: "7 CFR Part 1970 was removed effective April 2026 following the CEQ rescission (FR 2026-00178). RUS NEPA procedures now operate under USDA department-level regulations at 7 CFR Part 1b. Verify current RUS environmental procedures with your RUS Area Director before applying the procedures in this lesson." Key_terms definition of '7 CFR 1970' must be updated with [confirm current status] marker. | eCFR Part 1970 [Reserved] as of May 11, 2026; USDA Rural Development news release confirming adoption of modernized NEPA rule | HIGH |
| R2-N02 | **HIGH** | Flashcard component defect | L07:136-140, L08:132-137 | Both L07 and L08 use `<Flashcard key={term} term={term} definition={definition} />` — the same broken pattern as L11 (F-08). Flashcard.jsx requires `deckId` + `cards[]` array. These two lessons' flashcards render as blank/broken UI silently. R-1 missed this. All three lessons (L07, L08, L11) share the defect. | Same fix as F-08: convert to `<Flashcard deckId="T09-L07" cards={[...]} />` format with id/front/back per card. | Flashcard.jsx line 51: `function Flashcard({ deckId, cards })` | HIGH |
| R2-N03 | **MED** | Citation accuracy | L04:54, L04:364-371 | NLEB FR citation "88 FR 6358, Jan. 30, 2023" is doubly wrong. Correct citation: the final rule is **87 FR 73488** (published November 30, 2022). The delay notice is 88 FR 5528 (Jan. 26, 2023). Effective date: March 31, 2023. R-1 flagged date issue but accepted "88 FR 6358" as correct; this R-2 independently verifies the FR number is wrong too. | Correct to: "87 FR 73488 (Nov. 30, 2022); effective date extended to March 31, 2023 per 88 FR 5528." | https://www.federalregister.gov/documents/2022/11/30/2022-25998; https://www.federalregister.gov/documents/2023/01/26/2023-01656 | HIGH |
| R2-N04 | **MED** | Regulatory staleness / coverage gap | L02:288-289; L11 throughout | Both L02 and L11 cite "7 CFR §1970.54" (RUS CE procedures). As of April 2026, Part 1970 is [Reserved]. These specific CFR section citations are now invalid. Furthermore, L11 also references "7 CFR 1970.14" (extraordinary circumstances). All three Section-specific citations (§1970.14, §1970.54) need [confirm current status] markers since the regulation has been removed. | Add [confirm current regulatory status — 7 CFR 1970 removed April 2026; verify replacement procedure with RUS] markers at each cite. | eCFR 7 CFR Part 1970 [Reserved] | HIGH |
| R2-N05 | **MED** | Factual accuracy / NWP 2026 update not noted | L05 throughout | NWP 57 (2021 reissuance) expired March 14, 2026. The 2026 reissuance (FR 2026-00121, effective March 15, 2026) is now the operative permit. L05 correctly has [Verify current NWP...] qualifiers, but the body text and quiz citation still say "2021 reissuance" without noting the expiry and replacement. The 2026 reissuance made minor changes (new Coast Guard coordination note, no threshold changes confirmed). This is a staleness issue that should prompt an update to body text and quiz citation at L05-Q1. | Update L05 body to note: "As of March 15, 2026, the 2026 NWP reissuance (FR 2026-00121) replaced the 2021 permits. PCN threshold of 0.1 acre unchanged. New requirement: early coordination notification to USCG for activities affecting navigation." Update quiz citation at line 458. | https://www.federalregister.gov/documents/2026/01/08/2026-00121 | MED |
| R2-N06 | **MED** | Coverage gap — FCC NEPA path missing | L02 | T09 entirely omits the FCC NEPA process (47 CFR §§1.1306-1.1307). FCC has its own CEs: 47 CFR §1.1306 categorically excludes "installation of aerial wire or cable over existing aerial corridors of prior or permitted use." OSP aerial fiber attachments on existing poles qualify for this FCC categorical exclusion — which is distinct from and complementary to the RUS/NTIA CE C-8 framework. Any project with FCC-licensed facilities (antenna structure registration, licensed point-to-point microwave on a fiber route) may also need FCC NEPA clearance. This creates a real coverage gap for any OSP engineer dealing with mixed licensed/unlicensed deployments. | Add a callout in L02 Advanced section: "FCC maintains its own NEPA CE procedures at 47 CFR §1.1306. Aerial fiber over existing corridors is categorically excluded under FCC rules — relevant for any project with FCC antenna structure registration (Form 854) or licensed equipment." | 47 CFR §1.1306; https://www.law.cornell.edu/cfr/text/47/1.1306 | HIGH |
| R2-N07 | **LOW** | Coverage gap — L08 BDAC applicability caveat | L08:196-202 | L08 teaches the FCC BDAC Model Code 60-day shot clock as applicable to wireline fiber ROW permits. The BDAC Model Code (2018) is advisory only; the actual statutory FCC 60/90-day shot clocks (47 USC §332(c)(7)) apply to wireless siting only. L08 correctly says "This model code has been adopted in some states and jurisdictions; in others, it has no legal force" — but field engineers may not appreciate how narrow the statutory backing is. The lesson should clarify that the 60-day wireline shot clock is NOT a federal statutory entitlement the way wireless shot clocks are; it is an advisory model. | Strengthen the caveat: "Unlike the wireless siting shot clocks (47 USC §332(c)(7)), there is no federal statutory shot clock for wireline fiber ROW permits. The BDAC Model Code is advisory. Wireline permit delays are addressed through state law, informal escalation, or 47 USC §253(a) telecommunications preemption claims — not an FCC clock." | FCC BDAC Model Code 2018; 47 USC §332(c)(7)(B)(ii) (wireless only); FCC Accelerating Wireline Broadband Deployment 83 FR 50280 (2018) | MED |
| R2-N08 | **LOW** | DAG pointer accuracy | L09:19-22 | L09 (Tribal Coordination) vocab_assumed includes reference to T09.L03 (NHPA §106). Internal T09 self-reference. Also, L11 vocab_assumed includes "RUS program context" pointing to T09.L01. The exact term "RUS program context" should be verified against T09.L01 vocabulary_introduced — this compound phrase is unusual and may not appear verbatim. | Haiku ground-truth: verify T09.L01 vocabulary_introduced contains "RUS program context" verbatim. If not, adjust pointer to a lesson where the concept is formally introduced. | T09.L01 vocabulary_introduced list | LOW |

---

## 4. Adversarial Sweep Results

**Area 1 — FCC NEPA process (47 CFR 1.1307-1.1320):** GAP confirmed (R2-N06). FCC aerial CE at 47 CFR §1.1306 is not covered in T09. For antenna structure registration (ASR) and licensed microwave, FCC NEPA clearance is required separately. T09 covers only USDA/NTIA NEPA path.

**Area 2 — USACE §404 + §408:** L05 covers NWP 57 correctly. §408 (alteration of USACE federal projects — levees, flood control) not in T09 but is a distinct pathway beyond typical RUS rural fiber routes. No finding — appropriate scope boundary given ARCH.md lesson limits.

**Area 3 — State permitting variability:** L06 notes state variability explicitly with [confirm with state] markers throughout. Coverage adequate.

**Area 4 — Tribal §106 consultation:** L09 dedicated lesson. Adequately covers formal vs. informal coordination, THPO role, NHO database. No new finding.

**Area 5 — RUS environmental compliance:** L11 has a HIGH staleness issue (R2-N01/N04) — 7 CFR 1970 removed April 2026.

**Area 6 — PRC §10 navigable waters / §408:** Not applicable to standard rural fiber routes. No finding.

**Area 7 — ESA §7 vs §10:** L04 correctly distinguishes informal consultation (concurrence letter) vs. formal consultation (Biological Opinion). Accurate.

**Area 8 — MBTA + BGEPA:** Not covered in T09. Tree-clearing NLEB section in L04 touches the clearing-season window but does not address MBTA incidental take or BGEPA nest disturbance. For fiber construction involving tree clearing (new pole placements in forested areas), MBTA/BGEPA is a real compliance gap. Moderate risk — flagged as LOW for T09 scope (the lesson correctly focuses on the tree-clearing avoidance window; formal MBTA/BGEPA take authorization is covered at the program level by BEAD/RUS through programmatic consultation, not per-project). No finding added; note for curriculum architect.

**Area 9 — Wetlands post-Sackett v. EPA:** L05 explicitly covers Sackett (2023) — dedicated section "WOTUS after Sackett v. EPA (2023)." Good coverage. The lesson correctly notes districts vary in interpretation. No new finding.

**Area 10 — NEPA CatEx for OSP:** CE C-8 in L02 covered. FCC CatEx gap noted (R2-N06).

---

## 5. L07 / L08 / L10 Sweep

**L07 (ROW, Easements, Private Property):**
- Full read completed. Content is accurate and well-structured.
- Quiz Q01 (verbal license revocable): answerIndex 1 — correct.
- Quiz Q02 (dragdrop match): correctMap maps correct instrument to description — verified correct.
- Quiz Q03 (18-year cable, no easement): answerIndex 1 — correct (flag to legal counsel, not assume prescriptive).
- Quiz Q04 (successors and assigns): answerIndex 1 — correct.
- Quiz Q05 (permanent equipment building): answerIndex 2 (fee-simple or long-term recorded easement with exclusive occupancy) — correct.
- Prescriptive easement statutory period: lesson correctly notes "commonly 10 years, varies by state — confirm with legal counsel." Appropriately qualified.
- **NEW FINDING:** Flashcard prop defect (R2-N02 above) — all 8 key_terms flashcards broken.
- Dedication section is accurate and well placed.

**L08 (Municipal ROW — Timelines and Reality):**
- Full read completed. Content is accurate.
- Quiz Q01 (47 USC §253(a)): answerIndex 1 — correct.
- Quiz Q02 (pavement moratorium → bore required): answerIndex 1 — correct.
- Quiz Q03 (complete application starts 60-day clock): answerIndex 1 — correct.
- Quiz Q04 (recurring per-linear-foot fee = municipal fiber fee): answerIndex 1 — correct.
- Quiz Q05 (SHPO letter NOT part of municipal ROW packet): answerIndex 2 — correct.
- BDAC Model Code wireline shot clock caveat could be stronger (R2-N07 above).
- **NEW FINDING:** Flashcard prop defect (R2-N02).
- Branching scenario is realistic and well-structured. Accept-one-challenge-one path correctly identifies moratorium as valid authority + PE-stamp as negotiable condition.

**L10 (Permit Tracking and the PM Problem):**
- Full read completed. Content is accurate.
- Quiz Q01 (critical path calc): answerIndex 1 (State DOT Day 90) — math verified: MRO=45, DOT=90, SHPO=Day15+30=45, PCN=Day10+45=55. DOT is longest. CORRECT.
- Quiz Q02 (DOT submitted Day 30 + 90 day review + 7 lag): answerIndex 1 (Day 127) — math verified: 30+90=120, +7=127. CORRECT.
- Quiz Q03 (notify customer immediately on Day 80): answerIndex 1 — correct.
- Quiz Q04 (concurrent completion ideal): answerIndex 2 — correct.
- FlashCard presence: L10 uses standard `<Flashcard deckId="T09-L10" cards={[...]} />` — CORRECT format, unlike L07/L08/L11.
- No new findings in L10.

---

## 6. Cross-Topic DAG Sample

- L07 → T09.L01 (ROW): vocabulary_assumed correctly points to T09.L01 for ROW, AHJ, encroachment permit. Confirmed.
- L07 → T04.L01 (site walk): vocabulary_assumed `site walk` pointing to T04.L01 — T04.L01 vocabulary_introduced confirms 'site walk' is introduced there. VALID.
- L07 → T04.L03 (landbase, GIS): T04.L03 is titled "GIS, landbase, coordinate systems" — pointer directionally correct.
- L05 → T04.L01 (route survey wetland flags): Confirmed GAP — T04.L01 vocabulary_introduced = ['site walk', 'existing utility', 'hazard identification', 'photo log']. "Route survey wetland flags" is not a formally introduced term in T04.L01. Body prose mentions "wetland markers" but term not in vocabulary_introduced. F-06 is CONFIRMED BROKEN.
- L11 → T09.L02 (NEPA, CE, EA, FONSI, extraordinary circumstances, CE C-8): T09.L02 vocabulary_introduced confirms all terms. VALID.
- L08 → T04.L06 (KMZ deliverable): T04.L06 title is "KMZ, Shapefile, PDF Deliverables" — pointer plausible, needs Haiku ground-truth to confirm exact term.

---

## 7. Vite Build Result

```
✓ built in 5.93s — PASS
```
All modules compiled without error. No T09 import graph failures.

---

## 8. Saturation Hint for R-3

R-2 independently found 2 additional HIGH findings (R2-N01: 7 CFR 1970 removed; R2-N03: NLEB FR number wrong), 1 R-1 escalation (F-08 extends to L07/L08), and 3 NEW MED/LOW findings not in R-1. Saturation not reached — recommend R-3 with framing:

1. **Legal/preemption framing** — 47 USC §253(a) municipal preemption limits; state ROW law variability; tribal government sovereign immunity in T09.L09; inverse condemnation risk on private easements; FCA/RUS contractor compliance. R-1 and R-2 missed legal-exposure-lens findings.
2. **RUS post-2026 environment** — verify what RUS is actually telling borrowers NOW (post-7 CFR 1970 removal) about their environmental compliance process. Is there a RUS notice or interim guidance replacing Part 1970 procedures? L11 may need more than a [confirm] marker — it may need substantive content replacement.

---

=== T09 AUDIT R2 CORROBORATION END ===
