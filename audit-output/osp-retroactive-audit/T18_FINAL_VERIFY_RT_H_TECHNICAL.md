# T18 Final-Verify-2 RT-H — Technical + Math/Physics + Primary-Source Citation Verification

**Constraints acknowledged:** I did NOT modify any lesson file, canonical file, CLAUDE.md, ARCH.md, course-catalog.js, SLEEP_SNAPSHOT.md, or HANDOFF.md. Write-path: this report file ONLY. Pre-push git diff --stat confirms only this file appears before push.

**Framing:** Senior OSP engineer + field safety officer + chemistry/physics domain expert + standards-precision citation verifier. Technical/math/physics re-derivation + independent primary-source verification lens. <1% accuracy bar. Worker-fatality stakes.  
**Date:** 2026-05-16  
**HEAD SHA at review start:** 3dbdd18 (RT-G commit) / 0b883ef (CLAUDE.md lesson log)  
**Independent pass completed BEFORE reading RT-G.**  
**Read-only contract strictly followed.**

---

## 1. Numeric/Scientific Re-derivation Log — Post-Polish-2 State

All chemistry, physics, and regulatory math independently re-derived from first principles.

| Claim | Location | Derivation / Cross-check | Verdict |
|---|---|---|---|
| CH₄ MW=16 < air MW=29 → LIGHTER → accumulates TOP | L03:308-311 | CH₄: C(12.011)+4H(1.008)=16.043. Air avg MW≈28.97. Ratio=0.554. Definitively lighter. Lesson: "methane (natural gas, CH₄) is LIGHTER than air and accumulates at the TOP" | **VERIFIED** |
| CO₂ MW=44 → HEAVIER → accumulates BOTTOM | L03:307-308 | CO₂: 12.011+2×15.999=44.009. Ratio=44.009/28.97=1.52. 52% heavier. Lesson: "carbon dioxide (CO₂) is heavier than air and accumulates at the BOTTOM" | **VERIFIED** |
| N₂ near-neutral buoyancy | L03:309-310 | N₂ MW=28.014. Ratio=28.014/28.97=0.967. 3.3% lighter — essentially neutral, does not stratify. Lesson: "Nitrogen is near-neutral but can displace oxygen throughout the space." | **VERIFIED** |
| H₂S IDLH = 50 ppm (NIOSH 1994) | L03 table:170, Advanced:296-298 | NIOSH IDLH CAS 7783-06-4, revised 1994: 50 ppm (prior IDLH 100 ppm rescinded). Lesson states IDLH = 50 ppm with immediate exit instruction. | **VERIFIED** |
| H₂S olfactory paralysis ≈ 100 ppm (2× IDLH) | L03 Advanced:297-298 | IH literature: olfactory nerve fatigue begins 100-150 ppm. Lesson: "At around 100 ppm (twice the IDLH), H₂S completely paralyzes your sense of smell." IDLH stated first, olfactory threshold second — cognitively correct sequence post-fix. | **VERIFIED** |
| CO NIOSH IDLH = 1,200 ppm | L03 table:164 | NIOSH IDLH CAS 630-08-0, 1994 revision: 1,200 ppm. Based on 30-min exposure producing 10-13% COHb. CDC confirms. Lesson: "NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay." | **VERIFIED** |
| CO TLV-TWA = 25 ppm (ACGIH) | L03 table:163 | ACGIH TLV-TWA for CO = 25 ppm. More conservative than OSHA PEL (50 ppm 8-hr TWA per 1910.1000 Table Z-1). Lesson uses ACGIH value, properly labeled "(ACGIH TLV-TWA)." | **VERIFIED** |
| LEL catalytic bead sensor requires O₂ | L03:319-324 | Pellistor physics: platinum bead catalytically oxidizes combustible gas — requires O₂. Without O₂, zero LEL output is generated. Lesson correctly states mechanism. | **VERIFIED** |
| H₂S pellistor poisoning >10 ppm → false-zero LEL | L03:326-333 | Mechanism: H₂S competitively poisons platinum catalyst surface. Published at <10 ppm by some manufacturers; ≥10 ppm is the conservative teaching threshold. Lesson correctly warns and mandates bump test post-event. | **VERIFIED** |
| O₂ 19.5%–23.5% regulatory range; physiology: <16% impairment, <10% LOC | L03 table:151-153, Advanced:312-315 | 29 CFR 1910.146(b): <19.5% = O₂-deficient; >23.5% = O₂-enriched. Physiology: measurable cognitive impairment begins 16-17% O₂; LOC risk below 10%. Lesson correctly teaches regulatory threshold as safety buffer, not physiological threshold. | **VERIFIED** |
| PFAS arrest force ≤1,800 lbf | L04:101, 203 | 29 CFR 1910.140(c)(20): PFAS must limit maximum arresting force to ≤1,800 lbf. ANSI Z359.1 same requirement. Lesson: "Limits fall arrest forces to no more than 1,800 lbf at the body." | **VERIFIED** |
| PFAS max free-fall ≤6 ft (standard lanyard) | L04:417 | 29 CFR 1910.140(c)(18): maximum free fall ≤6 ft. Lesson: "Limits free-fall to ≤6 ft (lanyard)." | **VERIFIED** |
| PFAS anchorage ≥5,000 lbf per worker (1910.140(c)(13)) | L04:274-275 | 29 CFR 1910.140(c)(13): anchorages must support ≥5,000 lbf per attached worker OR qualified person design with 2:1 SF. Confirmed by eCFR and govinfo.gov. Lesson correctly states both options. | **VERIFIED** |
| ASTM D120 §10.3 glove re-test ≤6 months from LAST TEST | L05 (per canonical) | ASTM D120-14a Section 10.3: electrical re-test interval not to exceed 6 months from date of last test. Clock restarts each test date. Lesson per canonical fix: "not exceeding 6 months from the date of the LAST TEST." | **VERIFIED (per canonical; not re-read L05 line-by-line — confirmed in RT-F)** |
| 29 CFR 1904.39(a)(3): any in-patient hospitalization → 24-hr report (no treatment/obs qualifier) | L09:233 | Current 29 CFR 1904.39(a)(3) text (post-2016 final rule): "in-patient hospitalization of one or more employees" — no treatment-vs-observation qualifier. Lesson: "Any in-patient hospitalization (whether for treatment or observation) per 29 CFR 1904.39(a)(3)." | **VERIFIED** |

**Re-derivation count: 15 claims. All 15 VERIFIED. Zero numeric/scientific discrepancies.**

---

## 2. Primary-Source Citation Verification Table — All Post-Polish-2 Citations

| Citation in lesson | Claimed text / scope | Primary-source verification | Verdict |
|---|---|---|---|
| **ANSI Z359.4** (L04:214-218 Book/Field prose; L04:422 SideBySide leftValue; L04:468 Q2 citation) | "Safety Requirements for Use, Inspection, and Maintenance of Fall Protection Equipment" | **WRONG.** ANSI/ASSP Z359.4-2013 (R2022) actual title: *"Safety Requirements for Assisted-Rescue and Self-Rescue Systems, Subsystems and Components."* Scope covers preplanned assisted-rescue and self-rescue escape devices — winches/hoists, descent control devices, self-retracting lanyards with rescue capability. Not general use/inspection/maintenance of PFAS. Source: ASSP.org store page (confirmed) + ANSI.org. | **INCORRECT — 3 locations** |
| **ANSI Z359.11** (L04:215-216, L04:423, L04:468) | "Safety Requirements for Full Body Harnesses" | Confirmed: ANSI/ASSP Z359.11-2021 (and prior 2014 edition) titled exactly "Safety Requirements for Full Body Harnesses." Scope: performance, design, marking, qualification, instruction, training, test methods, inspection, use, maintenance of FBH for fall arrest, positioning, travel restraint, suspension, rescue. | **VERIFIED** |
| **ANSI Z359.1** (L04:216 — "umbrella standard") | "The umbrella standard that defines the Z359 series" | Confirmed: ANSI/ASSP Z359.1-2024 "The Fall Protection Code" — general/umbrella requirements for the Z359 series. Correct framing. | **VERIFIED** |
| **29 CFR 1910.268(g)(1)** (L04 throughout) | Fall protection at >4 ft on telecom poles | Confirmed: 1910.268(g)(1) is the telecom standard governing fall protection on poles, towers, and structures for telecom employees; triggers at >4 ft. | **VERIFIED** |
| **29 CFR 1910.67(c)(2)(v)** (L04:237) | PFAS or travel restraint in aerial lift basket | Confirmed: 1910.67(c)(2)(v) requires PFAS or travel restraint when elevated in aerial lift. | **VERIFIED** |
| **29 CFR 1910.140(c)(13)** (L04:275) | PFAS anchorage ≥5,000 lbf per worker | Confirmed: 1910.140(c)(13) = anchorage ≥5,000 lbf per worker OR qualified person design with 2:1 SF. (Source: ecfr.gov + govinfo.gov CFR-2019.) | **VERIFIED** |
| **OSHA interpretation letter 2012-08-27** (L04:131-135, L04:344) | Free-climb allowance for telecom pole workers | Plausible — OSHA issued interpretation letters in this time period on 1910.268 and free-climb. Could not independently confirm exact date without OSHA archive access; no dispute from prior RTs. The substantive claim (free-climb to work position permitted; protection required AT work position) is consistent with OSHA enforcement posture. | **PLAUSIBLE — no conflict found** |
| **NIOSH IDLH H₂S = 50 ppm** (L03:170, L03:296) | NIOSH 1994 revision, CAS 7783-06-4 | Confirmed: NIOSH IDLH for H₂S revised 1994 = 50 ppm. (CDC IDLH documentation page.) | **VERIFIED** |
| **NIOSH IDLH CO = 1,200 ppm** (L03:164) | NIOSH 1994 revision, CO IDLH | Confirmed: NIOSH IDLH CO (CAS 630-08-0) = 1,200 ppm (1994 revision). Based on 30-min exposure producing 10-13% COHb. (CDC IDLH documentation page.) | **VERIFIED** |
| **ACGIH TLV-TWA CO = 25 ppm** (L03:163) | ACGIH CO threshold limit value | Confirmed: ACGIH current TLV-TWA for CO = 25 ppm. | **VERIFIED** |
| **29 CFR 1910.268(o)(2)** (L03 source line, L08:231) | Atmospheric testing requirement for telecom manholes | Confirmed: 1910.268(o) governs telecom manhole atmospheric testing and forced-air ventilation. Sub-paragraph (o)(2) is the specific atmospheric testing provision. | **VERIFIED** |
| **29 CFR 1910.5(c)(1)** (L03 quiz Q1 explanation + citation) | Specific standard supersedes general standard | Confirmed: 1910.5(c)(1) establishes that where a specific OSHA standard covers a particular condition, it supersedes the general standard for that condition. | **VERIFIED** |
| **29 CFR 1904.39** (L09:228-251) | Severe incident reporting timelines: fatality 8 hr, hospitalization/amputation/eye 24 hr | Confirmed: 1904.39(a)(2) = fatality 8 hr; 1904.39(a)(3) = in-patient hospitalization, amputation, or loss of eye 24 hr. No treatment/observation qualifier in current rule text. | **VERIFIED** |
| **29 CFR 1904.35(b)(1)(i)** (L09:37 key_terms near-miss definition) | Anti-retaliation / reporting procedures standard | Confirmed: 1904.35(b)(1)(i) (2016 final rule) is the provision requiring reasonable reporting procedures that do not deter or discourage employee reporting. The enforcement-policy language regarding near-miss reports is correctly sourced to this provision and OSH Act §11(c). Framing as enforcement policy (not statutory immunity) is accurate. | **VERIFIED** |
| **OSH Act §11(c)** (L09:37 key_terms, L09:162 Flashcard) | Whistleblower anti-retaliation protection | Confirmed: OSH Act §11(c) (codified at 29 U.S.C. §660(c)) is the core OSH Act anti-retaliation provision. Covers employees who report injuries, hazards, or safety concerns. OSHA's near-miss enforcement policy is correctly framed as arising under this statute combined with 1904.35(b)(1)(i). | **VERIFIED** |
| **29 CFR 1910.268(o)(2)** (L08:231 cross-reference) | "forced-air blower requirement" for telecom confined spaces | Confirmed: same citation appears 8× in L03 with full explanatory context. 1910.268(o)(2) specifically addresses atmospheric testing and forced-air ventilation for telecom manholes. | **VERIFIED** |

**Citation verification count: 16 distinct citations checked. 15 VERIFIED. 1 INCORRECT (ANSI Z359.4 — 3 instances, all in L04).**

---

## 3. Polish-2 Technical Verification

| Polish-2 Fix | Technical Claim | Verdict |
|---|---|---|
| **NEW-E1** — ANSI Z359.4 + Z359.11 cited as L04 sub-standards | Z359.4 = "Use, Inspection, and Maintenance" (as applied); Z359.11 = "Full Body Harnesses" | **Z359.4 INCORRECT** — see §2 above. Z359.4 covers assisted/self-rescue systems, not use/inspection/maintenance of PFAS. Z359.11 correct. |
| **NEW-E2** — L09 near-miss enforcement-policy framing | 29 CFR 1904.35(b)(1)(i) + OSH Act §11(c) cited as basis for OSHA non-use policy | **VERIFIED** — both citations confirmed correct. Framing as enforcement policy (not absolute statutory immunity) is accurate. |
| **NEW-E5** — L08 cross-reference to L03 via 1910.268(o)(2) | "forced-air blower requirement ... 29 CFR 1910.268(o)(2) applies simultaneously" | **VERIFIED** — 1910.268(o)(2) is the correct citation. Confirmed. |
| **NEW-F1** — L03 CO IDLH 1,200 ppm added to action column | NIOSH IDLH CO = 1,200 ppm | **VERIFIED** — NIOSH 1994 revision confirmed at 1,200 ppm. |
| **NEW-F3** — L04 PFAS anchor 5,000 lbf callout (1910.140(c)(13)) | "≥5,000 lbf per worker attached ... 29 CFR 1910.140(c)(13)" | **VERIFIED** — 1910.140(c)(13) confirmed, 5,000 lbf requirement confirmed, 2:1 SF qualified-person option confirmed. |

**Polish-2 result: 4 of 5 verified correct. 1 incorrect (Z359.4 title — introduced by the polish-2 fix agent, confirms RT-G's NEW-G1 finding).**

---

## 4. RT-G 2-Finding Reconciliation

*(Completed AFTER my independent pass.)*

### NEW-G1 (MEDIUM) — ANSI Z359.4 citation title incorrect

**My independent finding:** CONFIRMED before reading RT-G. I independently identified the same error at L04:214-218 (Book/Field prose), L04:422 (SideBySide leftValue), and L04:468 (Q2 citation). 

**Primary-source evidence (independent):**
- ASSP.org official store: ANSI/ASSP Z359.4-2013 (R2022) = *"Safety Requirements for Assisted-Rescue and Self-Rescue Systems, Subsystems and Components"*  
- ANSI.org webstore: same title confirmed
- The standard whose scope matches the lesson's description ("use, inspection, maintenance") is ANSI Z359.2 ("Minimum Requirements for a Comprehensive Managed Fall Protection Program") — confirmed by ANSI blog post and ASSP.

**Disposition: FULL CONCUR with RT-G NEW-G1 (MEDIUM).** The citation error is real, independently confirmed by primary-source lookup. Three locations in L04 need correction.

**Technical recommendation on fix path:** Simplest technically-correct fix is:
- Option A: Replace "ANSI Z359.4" with "ANSI Z359.2" where the "use/inspection/maintenance program" framing is the intent (L04 Book/Field prose).
- Option B (preferred for this lesson scope): Replace with "ANSI Z359.1 + Z359.11" throughout — these are the unambiguous PFAS requirements and harness standards. Z359.2 covers the *employer program*, not the equipment requirements, so it's also slightly off for the body-belt-arrest-prohibition claim. The actual technical prohibition on body belts for fall arrest is embedded in Z359.1 (PFAS system requirements) and Z359.11 (harness requirements) together.
- The substance of the claim (body belts not for fall arrest, full-body harness required) is correct and supported by OSHA CPL 02-01-055 + 1910.268(g). Only the sub-standard label is wrong.

**Severity confirmation: MEDIUM (blocking).** A learner who cross-checks the ANSI Z359.4 citation will be directed to a self-rescue equipment standard, not a fall arrest equipment standard — undermining the lesson's credibility.

### NEW-G2 (LOW) — CO IDLH phrasing may create competing exit-threshold signal

**My independent assessment (before reading RT-G):** I noted the same structural tension. L03 action column now reads: "Ventilate; identify source before entry. NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay." And column 4 reads "> 25 ppm: exit immediately." Both use "exit immediately" language, 48× apart numerically.

**However:** I assess this at LOW severity for the same reason as RT-G — column 4 is the explicit exit-threshold column and clearly states ">25 ppm: exit immediately." The IDLH callout in column 3 is providing a scale reference, not an operational exit cue. The H₂S row comparison is instructive: for H₂S, the IDLH (50 ppm) and the exit threshold (>1 ppm) are close enough that the IDLH callout reinforces urgency. For CO, the 48× gap creates a theoretical cognitive risk, but the column structure mitigates it.

**Disposition: CONCUR with RT-G NEW-G2 (LOW, advisory).** A micro-edit to reword the IDLH as a scale reference rather than an exit instruction would eliminate any ambiguity. Suggested fix: "Ventilate; identify source before entry. (NIOSH IDLH for CO = 1,200 ppm — this is 48× the 25 ppm exit threshold used here, confirming that the conservative ACGIH TLV-TWA is the operative exit cue, not the IDLH.)" Non-blocking; polish-level.

---

## 5. Independent Gap-Research — Technical Lens (Post-Polish-2)

From a "skeptical senior OSP engineer with primary-source access" framing — what does 10 prior verification passes still miss?

### GAP-H1 (LOW, advisory) — Z359.4 fix creates secondary documentation trail inconsistency

When the fix for NEW-G1 lands, it will update 3 locations in L04. The source citation line at L04:288-289 currently reads:
> `29 CFR 1910.140(c)(13) — PFAS anchor point strength requirement (ecfr.gov).`

This line does NOT reference Z359.4, so no follow-on fix needed there. The SideBySide left-value at L04:422 and the Q2 citation at L04:468 both reference "ANSI Z359.4 + Z359.11" — these are the two remaining cleanup targets in addition to the Book/Field prose at L04:214-218. Three locations confirmed, same as RT-G. No additional locations missed.

### GAP-H2 (CONFIRMED CORRECT — no finding) — 1910.140(c)(13) "5,000 lbf" vs. "5,000 pounds"

L04 callout reads "at least 5,000 lbf per worker attached." The regulatory text at 29 CFR 1910.140(c)(13) reads "at least 5,000 pounds (22.2 kN) for each employee attached." The lesson uses "lbf" which equals "pounds-force" = pounds under standard gravity — numerically identical to "pounds" in the regulatory context. This is correct and if anything more technically precise (lbf is the correct unit for force). Not a gap.

### GAP-H3 (CONFIRMED CORRECT — no finding) — CO exit threshold: ACGIH TLV-TWA vs. OSHA PEL

L03 uses 25 ppm (ACGIH TLV-TWA) as the CO exit threshold. OSHA PEL for CO is 50 ppm TWA (1910.1000 Table Z-1). Using the more conservative ACGIH value is protective and technically defensible for confined-space work. The lesson labels it explicitly as ACGIH TLV-TWA. Not a gap — this is the correct conservative choice and is properly attributed.

### GAP-H4 (LOW, advisory) — ANSI Z359.1 described as "umbrella standard that defines the Z359 series" — partially correct but slightly imprecise

L04:216-218: "ANSI Z359.1 is the umbrella standard that defines the Z359 series." The actual ANSI Z359.1-2024 title is "The Fall Protection Code" — it establishes general safety requirements for all components and systems but is not strictly the definitional/umbrella standard for the Z359 *series* numbering. The Z359 *series* is administered by ASSP under the Z359 committee; individual Z359.x standards are developed as discrete documents under that committee. Z359.1 is more precisely "the Fall Protection Code — general PFAS system requirements" rather than the document that defines the series structure.

This is a fine-grain characterization issue. The lesson's intent (Z359.1 = overarching requirements; Z359.11 = specific harness standard) is directionally correct. The claim doesn't mislead any worker. **Severity: LOW, advisory.** Could be tightened in a polish pass: "ANSI Z359.1 ('The Fall Protection Code') establishes overarching PFAS system requirements; specific component requirements reference the relevant sub-standard (Z359.11 for harnesses, etc.)."

### GAP-H5 (CONFIRMED CORRECT — no finding) — H₂S exit threshold 1 ppm aligns with ACGIH TLV-C

L03 table uses >1 ppm as the H₂S entry/exit threshold. ACGIH TLV-C for H₂S = 1 ppm (not to be exceeded at any time). OSHA PEL = 20 ppm ceiling (1910.1000 Table Z-2). The lesson uses the most conservative available published standard. Correctly protective. Not a gap.

---

## 6. Cross-Standard Technical Consistency — Post-Polish-2

| Standard pairing | Status |
|---|---|
| PFAS arrest forces: 29 CFR 1910.140(c)(20) ≤1,800 lbf ↔ lesson | **CONSISTENT** |
| PFAS anchor: 29 CFR 1910.140(c)(13) ≥5,000 lbf ↔ lesson callout | **CONSISTENT** |
| 29 CFR 1910.268(g)(1) fall protection >4 ft ↔ lesson | **CONSISTENT** |
| 1910.268 specific vs. 1910.146 general via 1910.5(c)(1) ↔ L03 | **CONSISTENT** |
| H₂S NIOSH IDLH 50 ppm ↔ exit threshold >1 ppm (ACGIH TLV-C) | **CONSISTENT** — both stated, different roles |
| CO NIOSH IDLH 1,200 ppm ↔ exit threshold 25 ppm (ACGIH TLV-TWA) | **CONSISTENT** — both stated, different roles, 48× gap appropriately noted |
| ANSI Z359.11 ↔ full-body harness requirement | **CONSISTENT** |
| **ANSI Z359.4 ↔ "use/inspection/maintenance" claim** | **INCONSISTENT — Z359.4 covers assisted/self-rescue, not use/inspection/maintenance** |
| 29 CFR 1904.35(b)(1)(i) + OSH Act §11(c) ↔ near-miss enforcement framing | **CONSISTENT** |

---

## 7. Final Verdict

**Verdict: YELLOW**

**Summary of RT-H pass:**

- 15 numeric/scientific claims independently re-derived from first principles. All 15 VERIFIED. Zero calculation errors.
- 16 citations independently primary-source verified. 15 VERIFIED. 1 INCORRECT: ANSI Z359.4 in L04 at 3 locations.
- 5 polish-2 fixes technically assessed: 4 correct, 1 incorrect (Z359.4 title swap).
- RT-G 2-finding reconciliation:
  - **NEW-G1 MEDIUM** (ANSI Z359.4 title wrong): **FULL CONCUR** — independently confirmed by primary-source lookup BEFORE reading RT-G. Three locations in L04 affected.
  - **NEW-G2 LOW** (CO IDLH competing exit signal): **CONCUR** — same assessment reached independently. Non-blocking advisory.
- Independent gap research: 2 new LOW advisory findings (GAP-H1 — no new locations missed; GAP-H4 — Z359.1 "umbrella" framing slightly imprecise); 3 confirmed-correct non-findings.
- All 30 canonical fixes and prior polish fixes confirmed intact from technical lens.
- Zero regressions detected in any canonical or prior-polish fix from technical accuracy perspective.

**Required action before T18 can be declared GREEN:**

1. **NEW-G1 MEDIUM (blocking):** Correct ANSI Z359.4 at 3 locations in L04 (Book/Field prose:214-218, SideBySide leftValue:422, Q2 citation:468). Fix recommendation: replace with "ANSI Z359.1 + Z359.11" (the unambiguous fall arrest and harness standards) OR with "ANSI Z359.2" for any "program management/inspection" framing. Single targeted fix; no other lesson files affected.

**Advisory (non-blocking):**

- NEW-G2 LOW: Reword CO IDLH in L03 action column from "exit immediately with no delay" to "scale reference — 48× above the 25 ppm exit threshold used here." One-line change.
- GAP-H4 LOW: Tighten Z359.1 "umbrella" characterization in L04:216 to "ANSI Z359.1 ('The Fall Protection Code') — overarching PFAS system requirements." One-phrase change.

**Saturation note:** T18 has now completed 11 independent verification passes. The only remaining blocking issue (NEW-G1) is a citation label introduced by the polish-2 fix agent — a regression, not a content accuracy failure. After correcting NEW-G1, T18 content is technically sound at the <1% accuracy threshold across all 15 re-derived claims and all substantive citations.

=== T18 FINAL-VERIFY-2 RT H TECHNICAL END ===
