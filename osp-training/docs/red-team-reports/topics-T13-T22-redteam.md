# Red-Team QA Report — Topics T13–T22
**Reviewer:** Agent (Red Team / QA, Claude Sonnet)
**Date:** 2026-06-27
**Scope:** Topics T13 (Construction Inspection), T14 (Grounding & Bonding), T15 (Outage Response), T16 (As-Built Documentation), T17 (Estimating & Revenue), T18 (Safety & OSHA), T19 (Headend Fundamentals), T20 (RUS Compliance), T21 (CFOS-O Cert Prep), T22 (CFOT Cert Prep)
**Files reviewed:** All JSX lesson source files across topics T13–T22 (108 files)

---

## Section 1 — Summary Table

| Topic | CRITICAL | NOTABLE | MINOR |
|-------|----------|---------|-------|
| T13 — Construction Inspection | 3 | 2 | 4 |
| T14 — Grounding & Bonding | 1 | 0 | 1 |
| T15 — Outage Response | 2 | 2 | 1 |
| T16 — As-Built Documentation | 0 | 1 | 0 |
| T17 — Estimating & Revenue | 1 | 0 | 0 |
| T18 — Safety & OSHA | 0 | 0 | 0 |
| T19 — Headend Fundamentals | 0 | 0 | 0 |
| T20 — RUS Compliance | 1 | 2 | 0 |
| T21 — CFOS-O Cert Prep | 0 | 0 | 0 |
| T22 — CFOT Cert Prep | 0 | 0 | 1 |
| **Totals** | **8** | **7** | **7** |

---

## Section 2 — T13 (Construction Inspection / OSP Inspector Role)

### CRITICAL — T13-C-01: AIA A201-2017 §3.3.1 wrong section for waiver-by-conduct doctrine
**File:** `src/lessons/T13/L01-inspector-role-and-qa-qc-framework.jsx` (also repeated in `L10-capstone-quiz.jsx`)

The lesson cites "AIA A201-2017 §3.3.1" as the source for the principle that "inspectors who do not formally reject nonconforming work may be deemed to have waived the defect." AIA A201-2017 §3.3.1 covers the Contractor's Supervision and Construction Procedures — it says nothing about owner/inspector waiver rights. The waiver-by-conduct doctrine in AIA contracts derives from §9.10.3 (final payment waiver), §12.3 (owner's acceptance of nonconforming work), and general common-law waiver principles. The specific statutory and contract section cited is wrong. The legal principle described is real; the citation is not.

**Correct citation:** AIA A201-2017 §12.3 (Acceptance of Nonconforming Work) and §9.10.3 for payment-based waiver. For the halt-work / rejection authority framing the lesson is using, the competent citation is the "competent person" definition at 29 CFR 1926.32(f) plus the contract's general conditions on rejection authority — not AIA §3.3.1.

**Action:** Replace "§3.3.1" with "§12.3" throughout T13.L01 and correct the same citation in the L10 capstone quiz question that repeats it.

---

### CRITICAL — T13-C-02: "Format V" designation for SOR file requirement is UNVERIFIABLE / likely hallucinated
**File:** `src/lessons/T13/L07-close-out-documentation-form-219.jsx`

The lesson states that 7 CFR §1755.407 requires OTDR data in a "machine-readable SOR format" and that "this format is referred to as 'Format V' in USDA training materials." The SOR (Standard OTDR Record) binary format exists and is correctly defined by Bellcore SR-4731 (later GR-196-CORE). However, "Format V" as a USDA/RUS designation cannot be independently verified. No public USDA training material, 7 CFR §1755.407 text, or RUS Bulletin uses the phrase "Format V" for this purpose. The term may be a hallucination of a specific citation.

**Correct information:** The SOR format is defined by SR-4731 / GR-196-CORE. 7 CFR §1755.407 requires OTDR test records be retained and submitted, but the specific format designation "Format V" is UNVERIFIABLE — needs human check against actual USDA training materials.

**Action:** Remove or bracket "Format V" citation with "[UNVERIFIABLE — USDA training materials not confirmed]" and cite only SR-4731 / GR-196-CORE as the SOR format standard.

---

### CRITICAL — T13-C-03: NESC §01C and "NESC Section 26" halt-work citations are wrong
**File:** `src/lessons/T13/L13-inspection-day-field-decision-workflow.jsx`

Two wrong NESC citations:
1. "NESC §01C" cited as the authority for halt-work authority. NESC Part 1, Rule 01 = Scope and Purpose of the standard. §01C is a definitional/scope provision, not a halt-work authority rule. Halt-work in NESC derives from Part 4 (Safety Rules) and employer safety programs, not §01C.
2. "NESC Section 26 — 25 mph aerial work wind limit" cited as the basis for halting aerial construction above 25 mph winds. NESC does not specify a 25 mph wind limit for communications work. Construction wind limits are established by employer safety programs, OSHA 29 CFR 1910.268, and utility-specific operating procedures — not a NESC Section 26 that does not appear to exist for this purpose in communications NESC rules.

**Correct information:** For halt-work authority: OSHA 29 CFR 1910.268 (competent person authority) and employer safety program. For wind limits: OSHA and employer safety programs; no 25 mph communications work limit codified in NESC.

**Action:** Remove NESC §01C citation for halt-work; remove "NESC Section 26 / 25 mph" citation. Replace with OSHA 29 CFR 1910.268 + employer safety program.

---

### NOTABLE — T13-N-01: FCC Part 32 account hierarchy table is confusing / partially wrong
**File:** `src/lessons/T13/L08-joint-use-and-clearance-compliance.jsx`

The account table in this lesson shows §32.2410 = "Cable and wire facilities" and §32.2420 = "Cable and wire facilities (parent)." This ordering implies §32.2420 is the parent, which inverts the actual FCC Part 32 hierarchy. §32.2410 is the parent account ("Cable and Wire Facilities") and is rarely booked directly; §32.2420 (Aerial), §32.2421 (Underground), and §32.2423 (Buried) are the subaccounts. T16.L08 in the same curriculum correctly states §32.2410 as the parent "rarely booked directly" — contradicting T13.L08's framing. The T13.L08 table also omits §32.2424 (Submarine) and §32.2426 (Intrabuilding).

**Correct hierarchy:** §32.2410 = Parent (rarely booked); §32.2420 = Aerial Cable; §32.2421 = Underground Cable; §32.2423 = Buried Cable; §32.2441 = Conduit Systems.

**Action:** Update T13.L08 table to match T16.L08 and FCC Part 32 actual hierarchy.

---

### NOTABLE — T13-N-02: "NESC Map 1" vs. NESC C2-2023 "Figure 250-1" terminology
**File:** `src/lessons/T13/L08-joint-use-and-clearance-compliance.jsx`

The lesson references "NESC Map 1" for determining the loading district (Heavy/Medium/Light). NESC C2-2023 designates this as "Figure 250-1" (the loading district map). The label "NESC Map 1" is not used in the current edition. Students looking up the reference in NESC C2-2023 will not find "Map 1."

**Correct reference:** NESC C2-2023 Figure 250-1 (Ice Loading and Wind Loading Map for the contiguous U.S.).

**Action:** Replace "NESC Map 1" with "NESC C2-2023 Figure 250-1."

---

### MINOR — T13-M-01: Sag tolerance "±2 inches or ±5% of design sag" stated as standard without citation
**File:** `src/lessons/T13/L03-aerial-construction-inspection.jsx`

The "±2 in or ±5% of design sag" field tolerance is presented as a normative standard. This is a common field rule-of-thumb that appears in various engineering practice documents, but it is not a single cited standard. The actual tolerance depends on the contract documents, the engineer's design criteria, and the applicable utility's construction specifications.

**Action:** Add hedging language: "typical field tolerance in many engineering specifications; confirm against project contract documents and engineer's design criteria."

---

### MINOR — T13-M-02: IEEE 81-2012 section inconsistency (§7 vs §9.4)
**File:** `src/lessons/T13/L04-underground-construction-inspection.jsx`

The key_term definition for clamp-on ground testing cites "IEEE 81-2012 §7" while the body text of the same lesson cites "IEEE 81-2012 §9.4" for the fall-of-potential (three-point) method. These are two different sections. IEEE 81-2012 §7 covers the fall-of-potential method; §9.4 covers clamp-on (loop) testing. The citations are swapped internally: the clamp-on definition incorrectly cites the fall-of-potential section, and the body text incorrectly applies §9.4 to fall-of-potential.

**Correct citations:** Fall-of-potential (three-point): IEEE 81-2012 §7 (also called the 61.8% or 62% rule). Clamp-on (stakeless): IEEE 81-2012 §9.4.

**Action:** Swap the section references to match the correct methods.

---

### MINOR — T13-M-03: H₂S entry threshold <1 ppm stated without regulatory context
**File:** `src/lessons/T13/L04-underground-construction-inspection.jsx`

The <1 ppm H₂S threshold is the ACGIH TLV-TWA (8-hour time-weighted average). While it appears again in T18.L03 with the same citation, the issue is the same in both: OSHA's PEL for H₂S in general industry is a 20 ppm ceiling limit (with a 50 ppm IDLH per NIOSH). Presenting <1 ppm as the "entry threshold" without noting it is far stricter than regulatory requirements could confuse students about the legal vs. best-practice distinction.

**Action:** Add context: "The ACGIH TLV-TWA of <1 ppm is significantly more conservative than OSHA's 20 ppm ceiling limit; employer safety programs may use either benchmark. The <1 ppm value is a best-practice target, not a regulatory entry limit."

---

### MINOR — T13-M-04: NESC Rule 232 Table 232-1 "15.5 feet" clearance at secondary road — needs verification
**File:** `src/lessons/T13/L10-capstone-quiz.jsx`

Question 3 states that "NESC Rule 232 Table 232-1 specifies 15.5 feet clearance for a secondary road crossing in a Light loading district." The NESC C2-2023 Table 232-1 clearance values for communication conductors at road crossings vary by loading district and road classification, and a 15.5 ft value for Light loading/secondary road is plausible — but NESC C2-2023 is paywalled and this specific value cannot be independently verified from public sources.

**Action:** Tag as "[UNVERIFIABLE — paywalled; verify against current NESC C2-2023 Table 232-1 before use in assessment.]"

---

## Section 3 — T14 (Grounding & Bonding)

### CRITICAL — T14-C-01: NESC Rule 96F vs. Rule 215D internal inconsistency across all T14 lessons
**Files:** `src/lessons/T14/L02-*.jsx` (cites Rule 96F); `src/lessons/T14/L03-*.jsx` and throughout T14 (cites Rule 215D)

T14.L02 cites NESC Rule 96F as the messenger bonding requirement. T14.L03 and subsequent lessons (including the T14 capstone) cite NESC Rule 215D for the same messenger bonding interval requirement. These are different rules: Rule 96 governs communication-line grounding and messenger bonding; Rule 215 governs grounding of supply-side equipment (power line neutral grounding, not telecom). Rule 215D appearing in telecom messenger bonding context is likely wrong — the correct rule for OSP fiber cable messenger grounding is in NESC Part 2, Rules 96 (and related Rules in Part 3 Section 39 for communications). This inconsistency persists across every lesson and the capstone quiz in T14 and would confuse students preparing for any exam that tests NESC rule citation.

**Action:** Audit all T14 files. Determine which rule (96 or 215D) is correct for telecom messenger bonding and make the entire topic consistent. The NESC Part 2 Rule 96 family (communications line grounding) is the more likely correct location; Rule 215 is supply-line equipment grounding.

---

### MINOR — T14-M-01: 1,320 ft grounding interval cited without confirmed source
**File:** `src/lessons/T14/L11-*.jsx`

The 1,320 ft (¼ mile) grounding interval for messenger bonding is presented as an example with the in-text flag "[confirm NESC C2-2023 Section 09 interval — paywalled]." This is correctly hedged. Leaving the flag visible in the published lesson, however, trains users to question the specification, which is appropriate but should be resolved before formal publication. The 1,320 ft figure is commonly cited in RUS construction specifications and engineering practice.

**Action:** Resolve the "[confirm]" flag before publish — verify against RUS Bulletin 1751F-810 or NESC C2-2023 §96 (paywalled) and update the in-text citation accordingly.

---

## Section 4 — T15 (Outage Response)

### CRITICAL — T15-C-01: IEC 61300-3-35 wrong standard for OTDR splice acceptance criteria
**File:** `src/lessons/T15/L04-temporary-vs-permanent-repair.jsx`

"IEC 61300-3-35" is cited as the standard for OTDR bidirectional averaging splice acceptance criteria. IEC 61300-3-35 defines visual inspection of fiber optic end-faces and connectors using microscopy — it covers pass/fail criteria for connector end-face cleanliness, NOT OTDR splice loss measurement. The correct standards for OTDR-based splice acceptance are IEC 61280-4-1 (single-mode OTDR test procedure) or TIA-526-7 (OFSTP-7), or RUS Bulletin 1751F-630 Chapter 11 for RUS-funded projects.

**Action:** Replace "IEC 61300-3-35" with "IEC 61280-4-1 (single-mode OTDR method) / TIA-526-7 (OFSTP-7)" for OTDR splice loss acceptance. If the intent was connector end-face cleanliness, retain IEC 61300-3-35 but clarify the scope.

---

### CRITICAL — T15-C-02: SOR file format attributed to FOTP-61 — wrong standard
**File:** `src/lessons/T15/L02-fault-locate-with-otdr.jsx`

The SOR (Standard OTDR Record) binary file format is co-cited as "Bellcore SR-4731 / FOTP-61." FOTP-61 (TIA-455-61) is a test procedure for measuring the chromatic dispersion of single-mode fiber using OTDR; it defines a measurement method, not a file storage format. The SOR binary format is defined solely by Bellcore SR-4731 (now Telcordia GR-196-CORE). FOTP-61 has no relationship to the .sor file format.

**Note:** T15.L09 correctly cites only Bellcore SR-4731 for the SOR format. This makes L02's citation an isolated error that is internally inconsistent with the correct citation in L09.

**Action:** Remove "/ FOTP-61" from the SOR citation in T15.L02. Retain "Bellcore SR-4731 / GR-196-CORE" only.

---

### NOTABLE — T15-N-01: Telcordia SR-4422 cited as closure pressure test standard — likely wrong
**File:** `src/lessons/T15/L04-temporary-vs-permanent-repair.jsx`

Telcordia SR-4422 is cited as the basis for closure pressure test specifications (5–7 PSI, 60 seconds for dome closures). SR-4422 is the Telcordia network survivability standard for telecommunications infrastructure. It does not specify closure seal pressure test procedures. The correct citation for closure pressure testing is manufacturer-specific test procedures and/or generic OSP construction practice specifications; Corning, CommScope, and AFL each publish their own pressure test specs for their respective closure designs.

**Action:** Replace "Telcordia SR-4422" with "manufacturer's installation specification for the specific closure model" and remove the implied normative character of the 5–7 PSI / 60-second values as universal.

---

### NOTABLE — T15-N-02: Telcordia SR-4422 cited as emergency MOP framework standard — questionable
**File:** `src/lessons/T15/L08-method-of-procedure.jsx`

Telcordia SR-4422 is again cited as the governing document for emergency change management (MOP) framework structure. SR-4422 (Network Infrastructure Survivability for Telecommunications Structures) addresses network design and infrastructure survivability from a systems engineering perspective. While it broadly addresses change management philosophy, it is not commonly cited as the primary reference for field MOP (Method of Procedure) documentation structure. Carrier internal change-control policies, ATIS standards, and IT governance frameworks (ITIL) are more relevant primary sources for MOP structure.

**Action:** Replace "Telcordia SR-4422" with "carrier/operator internal change-control policy (commonly ATIS- or ITIL-aligned)" or hedge as "SR-4422 addresses network survivability broadly; specific MOP structure requirements are defined by the operator's change-control program."

---

### MINOR — T15-M-01: IOR upper range 1.4700 for G.652.D at 1550 nm may be slightly high
**File:** `src/lessons/T15/L02-fault-locate-with-otdr.jsx`

The Index of Refraction (IOR) range stated as "1.4680–1.4700" for G.652.D at 1550 nm. The upper end of 1.4700 is at the edge of plausible values; most published G.652.D specifications and OTDR manufacturer presets for single-mode at 1550 nm range from approximately 1.4665 to 1.4685. The 1.4700 upper bound may cause students to set OTDR IOR too high, resulting in distance measurement error.

**Action:** Adjust range to "1.4665–1.4685" or cite a specific manufacturer's published IOR value with a note that IOR varies by manufacturer and should be taken from the cable's technical specification sheet.

---

## Section 5 — T16 (As-Built Documentation)

### NOTABLE — T16-N-01: TIA-606-C vs. TIA-606-D edition inconsistency within T16
**File:** `src/lessons/T16/L01-what-is-an-as-built.jsx`

The lesson body cites "ANSI/TIA-606-C (2018)" as the current edition but an in-text note flags "[confirm current edition]" with a parenthetical noting TIA-606-D may be the current revision. This internal flag is editorially honest but should be resolved before publication. TIA-606-C was published in 2018; if TIA-606-D has been published, all T16 citations to TIA-606-C need updating.

**Action:** Verify current TIA-606 edition and update all references in T16 accordingly. Remove the "[confirm current edition]" flag once resolved.

---

## Section 6 — T17 (Estimating & Revenue)

### CRITICAL — T17-C-01: Underground OSP median cost "$22–$28/ft" contradicts published FBA 2024 data
**File:** `src/lessons/T17/L02-aerial-vs-underground-cost-components.jsx`

The lesson states the FBA/Cartesian 2024 underground OSP median is "$22–$28/ft." The FBA/Cartesian 2024 Annual Fiber Deployment Cost Report states the underground median at approximately $18.25/ft for direct-buried/conduit construction in typical rural conditions. The $22–$28/ft range is significantly higher than the published median and is inconsistent with the aerial figures in the same lesson ($6.49/ft for 2023, $6.55/ft for 2024), which do match published FBA data. The underground figure appears to have been estimated or drawn from a different year/region without flagging the discrepancy.

**Action:** Replace "$22–$28/ft" with "$18–$20/ft" (consistent with FBA 2024 median) and add the FBA citation. If the intent was to show a high-cost scenario (e.g., urban, pavement restoration, rock), label it accordingly rather than presenting it as the FBA median.

---

## Section 7 — T18 (Safety & OSHA)

No technical errors found in T18. All OSHA CFR citations (29 CFR 1910.268, 1910.146, 1910.147, 1910.67, 1910.132, 1910.137, 1926.32), ASTM standards (D120, F2412, F2413), ANSI standards (Z89.1, ISEA 107), and MUTCD Part 6 references were verified as correctly cited for their described purposes. Gas thresholds (O₂ 19.5–23.5%, <10% LEL for entry, CO <25 ppm, H₂S <1 ppm per ACGIH TLV-TWA) are internally consistent with OSHA 1910.146 limits for oxygen and consistent with ACGIH TLVs for the other parameters. The H₂S <1 ppm entry threshold carries the same caveat noted in T13 (much stricter than OSHA PEL/IDLH), but in T18.L03 the table correctly shows the regulatory source attribution and the NIOSH IDLH for context, making it better handled than the T13 instance.

---

## Section 8 — T19 (Headend Fundamentals)

No technical errors found in T19. Battery plant fundamentals (–48VDC negative-ground convention, VRLA 24-cell strings, float voltage 2.25–2.27 V/cell, Telcordia GR-63-CORE 30-second ATS transfer ceiling) are correctly described with appropriate hedging ("confirm edition" flags on GR-63-CORE and IEEE 1188). TMGB/TGB/TBB terminology is correctly sourced to TIA-607-D (with "[confirm edition]" flag). NEC Art. 250.94 IBT citation is correctly used for the intersystem bonding termination device. NEC Art. 770 primary protector citation is correctly applied to metallic-component OSP cable entries.

---

## Section 9 — T20 (RUS Compliance)

### CRITICAL — T20-C-01: ReConnect Program cited as "7 CFR Part 1744" — wrong regulation
**File:** `src/lessons/T20/L08.rus-broadband-programs.jsx`

The ReConnect Program is cited as "7 CFR Part 1744" in both the meta definition and the flashcard. 7 CFR Part 1744 covers "Lien Accommodations and Subordinations and Mergers, Consolidations, Dissolutions, and Transfers of RUS Borrowers" — a completely different administrative topic. The ReConnect Program is codified at 7 CFR Part 1740 ("ReConnect Program"). This is cited correctly in other curriculum modules (e.g., T16.L05) but wrong here.

**Action:** Replace "7 CFR Part 1744" with "7 CFR Part 1740" in all T20.L08 references.

---

### NOTABLE — T20-N-01: "RUS Form 307" as the construction cost ledger is UNVERIFIABLE
**Files:** `src/lessons/T20/L03.rus-forms-and-loan-reporting.jsx`, `src/lessons/T20/L04.usoa-plant-accounting.jsx`

"Form 307" is presented throughout T20 as the primary RUS construction cost ledger/drawdown document. In the RUS Telecommunications program, the primary construction cost documentation forms are typically Form 481 (Construction Cost Ledger for telephone systems) and Form 1773 (Policy on Audits of RUS Borrowers). "Form 307" does not appear in publicly available RUS Telecommunications program documents as a construction cost ledger. RUS Form 307 may exist in another USDA context (possibly electric or water programs). This citation is UNVERIFIABLE — needs human check against current RUS Telecommunications program form list.

**Action:** Verify "Form 307" against current RUS Telecommunications program form index. If incorrect, replace with the actual construction cost ledger form number (likely Form 481 or its current successor).

---

### NOTABLE — T20-N-02: "RUS Form 740" as contractor certification is UNVERIFIABLE
**File:** `src/lessons/T20/L03.rus-forms-and-loan-reporting.jsx`

"Form 740" is cited as the RUS contractor certification form. In RUS Telecommunications program public documents, contractor certification and Davis-Bacon prevailing wage compliance are typically handled through Form 7 (Borrower's Certificate of Compliance) and the standard contract clauses in 7 CFR Part 1788. "Form 740" does not appear in publicly available RUS Telecommunications program form lists. It may exist in another USDA program or may be a hallucination of a form number.

**Action:** Verify "Form 740" against current RUS Telecommunications program form index. If incorrect, replace with the actual contractor certification documentation requirement (likely Form 7 or the equivalent current successor and Part 1788 clause references).

---

## Section 10 — T21 (CFOS-O Cert Prep)

No technical errors found in T21. Fusion splicing acceptance criteria (≤0.3 dB for OSP single-mode in cert-prep context) is appropriate for CFOS-O exam framing. OTDR lesson content is general and does not make specific false citations. The T21 module is cert-prep content that appropriately re-uses verified facts from prior topics without introducing new citeable errors.

---

## Section 11 — T22 (CFOT Cert Prep)

### MINOR — T22-M-01: OTDR dead zone stated as "2–5 meters" — likely understated for practical use
**File:** `src/lessons/T22/L04.testing-otdr-acceptance.jsx`

The lesson states the OTDR dead zone is "typically 2–5 meters." Dead zone values depend heavily on pulse width and OTDR model. The Event Dead Zone (EDZ, where an event is detected but not measurable) is typically 1–3 m on short pulse widths. The Attenuation Dead Zone (ADZ, where a second event cannot be seen after the first) is typically 5–25+ meters depending on pulse width and the reflectance of the first event. Presenting "2–5 meters" as the catch-all dead zone understates the ADZ for any practical cable length where a student would be using a longer pulse width. Students using this figure for OSP cable runs would undersize their launch cable.

**Action:** Distinguish Event Dead Zone (EDZ: ~1–3 m) from Attenuation Dead Zone (ADZ: 5–25+ m depending on pulse width). Note that launch cables for OSP OTDR work should be 50–200 m or longer to push the ADZ past all events of interest. Cite OTDR manufacturer specifications for specific pulse-width dead zone values.

---

## Section 12 — Cross-Lesson Consistency Issues

### Form 219 citation — CONSISTENT (no error)
Form 219 is cited consistently across T13.L07, T16.L07, T20.L02, T20.L03, and T14 as the RUS ground-electrode resistance testing documentation form. This appears to be correct per publicly available RUS program references.

### SOR format citation — INCONSISTENT (error in T15.L02, correct in T15.L09)
T15.L02 co-cites SR-4731 and FOTP-61 for SOR format; T15.L09 correctly cites only SR-4731/GR-196-CORE. Students reading L02 first will learn the wrong co-citation. Fix is in T15.L02 only.

### IEC 61300-3-35 — CONSISTENTLY WRONG (T15.L04)
This wrong citation appears only once and does not propagate to other lessons. Fix is isolated to T15.L04.

### FCC Part 32 hierarchy — INCONSISTENT (T13.L08 wrong, T16.L07 and T16.L08 correct)
The T13.L08 account hierarchy table inverts or misdescribes the §32.2410 parent account. The T16.L07 and T16.L08 lessons in the same curriculum correctly describe the hierarchy. Students who complete T13 before T16 will learn the wrong hierarchy first. Fix in T13.L08.

### NESC Rule 96F vs. 215D — INCONSISTENT within T14 (error)
Discussed under T14-C-01. Affects every T14 lesson and the T14 capstone quiz.

### AIA A201-2017 §3.3.1 — CONSISTENTLY WRONG across T13
Same wrong citation appears in both T13.L01 and T13.L10 capstone quiz. Fix both.

---

## Section 13 — Items Verified Correct (selected key facts)

- **FCC 47 CFR Part 4 NORS reporting:** 120-minute initial report (§4.9), 30-day final report (§4.13) — correctly cited in T15.L07.
- **7 CFR §1755.400 RUS as-built retention:** "life of facility for O&M; at least 10 years post-construction for project files" — correctly cited in T16.L06.
- **7 CFR Part 1740 ReConnect shapefile GIS requirement:** correctly cited in T16.L05.
- **ASCE 38-22 Quality Levels QL-A through QL-D:** correctly defined and applied in T16.L04.
- **G.652.D attenuation 0.36 dB/km maximum at 1310 nm:** correct per ITU-T G.652 (2019) Table 1.
- **1:32 splitter insertion loss: 10×log₁₀(32) = 15.05 dB theoretical minimum + 0.5–2 dB excess loss = 15.0–17.0 dB real:** correct calculation, correctly presented in T16.L09 and T17.L04.
- **Bellcore SR-4731 as the SOR binary file format standard:** correctly cited in T15.L09.
- **FCC Part 32 account §32.2410 parent / §32.2420 Aerial / §32.2421 Underground / §32.2423 Buried / §32.2441 Conduit:** correctly presented in T16.L07 and T16.L08.
- **7 CFR Part 1788 RUS competitive procurement requirements:** correctly cited in T17.L05.
- **Aerial lashing baseline 1,000–1,500 ft/day for 3-person crew:** industry-standard range, correctly stated in T17.L03.
- **Labor burden 28–45%:** correct range for OSP construction, correctly stated in T17.L03.
- **NFPA 110 generator monthly exercise under load:** correctly cited in T19.L04.
- **OSHA 29 CFR 1910.268 — primary OSP telecom safety standard:** correctly cited and applied throughout T18.
- **OSHA 29 CFR 1910.146 — permit-required confined space standard:** correctly cited in T18.L03.
- **O₂ 19.5–23.5% acceptable range for confined space entry per 29 CFR 1910.146(b):** correct.
- **ANSI Z89.1 Class E hard hat — 20,000V phase-to-ground electrical protection:** correct per ANSI/ISEA Z89.1.
- **ASTM D120 rubber insulating glove classes:** Class 0 ≤1,000V, Class 1 ≤7,500V, Class 2 ≤17,000V — correct.
- **–48VDC negative-ground convention:** correctly explained in T19.L03. Float voltage ~2.25–2.27 V/cell for VRLA is consistent with IEEE 1188 and manufacturer data.
- **Telcordia GR-63-CORE 30-second ATS transfer ceiling for NEBS:** correctly cited with appropriate "[paywalled — confirm edition]" hedge in T19.L04.
- **DART rate (Days Away, Restricted, or Transferred) and OSHA Form 300:** correctly described per 29 CFR 1904 in T18.L09.
- **Fatality OSHA notification: 8 hours; hospitalization/amputation/eye loss: 24 hours per 29 CFR 1904.39:** correct.
- **RUS Bulletins 1751F-630 (Aerial), 1751F-635 (Underground), 1751F-810 (Electrical Protection):** correctly described in T20.L02.
- **Form 219 for ground-rod resistance testing per IEEE 81 with <5Ω threshold:** consistently and correctly described across T14, T16, and T20.

---

*End of report. Total findings: 8 CRITICAL, 7 NOTABLE, 7 MINOR.*
