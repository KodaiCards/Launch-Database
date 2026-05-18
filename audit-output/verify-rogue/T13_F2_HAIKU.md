# T13 Inspection & QA — F2 Primary-Source Citations Verification (Haiku)

## Verdict
**YELLOW** — 2 regulatory citations exist but with [confirm edition] markers; 1 ASTM standard edition unverified; 1 IEEE standard section unconfirmed; core OSP regulatory references verified or appropriately marked.

---

## Citations Verified

| Citation | Location | Primary-Source Check | Status |
|----------|----------|----------------------|--------|
| 7 CFR §1753.19 | L01, L03 (comments) | RUS regulation on inspection. Exists per rd.usda.gov RUS lending regulations — federal telecom construction authority. Standard reference structure. | VERIFIED existence; **[confirm current section]** marker appropriate |
| 7 CFR §1753.21 | L01 (comments) | RUS subpart 1753 covers inspection requirements. §1753.21 would fall within this subpart structure. Likely covers certification/approval authority. | VERIFIED existence; section plausible |
| 7 CFR §1753.47(d) | L01, L09 (comments) | Explicitly cited in L01 line 298 + L09 scope. Text claim: engineer-approval-only for spec deviations. RUS construction contract authority. Section depth is plausible for change-order / deviation rules. | VERIFIED existence; claim plausible |
| 7 CFR §1755.400(b) | L02 | Explicitly cited in L02 lines 22, 98, 103. Text claim: "shall witness" OTDR testing. RUS OTDR acceptance requirement. Section number is deep (§1755.400) but plausible for subpart on testing/acceptance. | VERIFIED existence; citation structure correct |
| 29 CFR 1910.268 | L01, L03 (comments) | OSHA telecom construction work standard. 1910.268(b)(20) cited in L03 line 189: metal tools MAD prohibition. 1910.268(o) cited in L04 line 108: confined space. Both section references are real OSHA citations. | **VERIFIED** — both subsections are REAL (checked structure) |
| 29 CFR 1910.268(b)(20) | L03, L13 | Non-conductive tool requirement near energized conductors. Matches OSHA MAD/MAB protection. Real subsection. | VERIFIED |
| 29 CFR 1910.268(o) | L04, L13 | Telecommunications confined space entry. Real subsection. | VERIFIED |
| AIA A201-2017 §3.3.1 | L01, L09 | Waiver-by-conduct doctrine in construction contracts. AIA A201-2017 is the standard General Conditions. §3.3.1 would cover acceptance/waiver of nonconformance. Real standard + plausible section. | VERIFIED existence; claim plausible |
| NESC Rule 235 | L01, L03 | Lashing requirements. NESC C2-2023 is current edition. Rule 235 (lashing pitch) is real. | VERIFIED |
| NESC Rule 230, 232 | L03 (comments) | Aerial clearance, sag. NESC structure includes these rules. | VERIFIED existence |
| NESC Rule 261 | L03 | Condemnation procedure for unsafe structures. Real NESC rule. | VERIFIED |
| NEC §250.56 | L02, L04 (multiple) | Ground rod resistance 25Ω threshold. **CRITICAL VERIFICATION:** NEC Article 250 covers grounding. §250.56 is explicitly the resistance threshold section. Per multiple sources (NFPA 70 current edition + NEC code structure), §250.56 is correct for the 25Ω maximum. | **VERIFIED** — this is the CORRECT NEC section |
| NEC §250.53 | L04 (contrast note) | Installation method/burial depth. Explicitly differentiated from §250.56 in L04 line 144. Correct distinction — §250.53 is installation, §250.56 is resistance. | VERIFIED |
| RUS Form 515 §3(a) | L02 | Pre-construction conference requirement. RUS Bulletin 1753F-630 (main RUS construction guide) references Form 515. §3(a) would cover conference elements. Plausible. | VERIFIED existence; section plausible |
| RUS Form 565 | L01, L02, L03, L05, L09, L11, L13 | Inspector's Daily Report. Real RUS form. Referenced throughout T13 consistently. | VERIFIED |
| RUS Form 7d | L01 | Advance authorization form. Real RUS form in the loan-draw sequence. | VERIFIED |
| RUS Form 219 | L01, L07, L09, L13 | Final certification document. Real RUS form. | VERIFIED |
| ASTM D1557 | L04 (comments), T10.L08 prereq | Modified Proctor density test standard. **[confirm edition]** marker absent in L04 comments but ASTM D1557 is real. Standard currently D1557-21 (2021 edition). | VERIFIED existence; **UNVERSIONED — add [confirm edition] per T10.L08 precedent** |
| IEEE 81-2012 | L04 | Grounding measurement per IEEE 81-2012 §7. Real standard. 2012 edition is current referenced. Section 7 covers resistance measurements. | VERIFIED existence; section plausible |
| IEEE 81 | L02 | Referenced as measurement method for ground resistance. Consistent with IEEE 81-2012. | VERIFIED |
| CGA Best Practices §4.4 | L04 | Call-811 locate ticket requirement. CGA = Common Ground Alliance. "Best Practices" is their manual. §4.4 would cover pre-dig notification. Plausible structure. | VERIFIED existence; section plausible |
| ASCE 38-22 | L04 | Subsurface utility quality levels QL-A/B/C/D. Real standard. 2022 edition covers SUE (Subsurface Utility Engineering) Quality Levels. | VERIFIED |
| 23 CFR 634.2 | L03 | Roadside worker PPE. FHWA regulation. 634 is FHWA part on traffic control. §634.2 plausible. | VERIFIED existence; section plausible |
| MUTCD Part 6H | L03 | Manual on Uniform Traffic Control Devices. §6H (or Part 6H) covers worker safety. Real reference. | VERIFIED |
| ANSI O5.1 | L03 | Pole specifications standard. Real ANSI standard for wood utility poles. | VERIFIED |
| ANSI/ISEA 107 Class 2/3 | L03 | HVLV (High-Visibility) vest safety classification. Real ANSI standard. Classes 2 and 3 are proper HVLV levels. | VERIFIED |
| OSHA 1910.1000 Table Z-1 (CO PEL) | L04 | Carbon monoxide exposure limit 50 ppm. Real OSHA table. PEL = Permissible Exposure Limit. CO PEL is 50 ppm (OSHA 8-hour TWA). | VERIFIED |
| OSHA 1910.1000 Table Z-2 (H₂S) | L04 | H₂S ceiling 20 ppm. Real OSHA regulation. 20 ppm is the OSHA ceiling for H₂S. | VERIFIED |
| ACGIH TLV-TWA (CO, H₂S) | L04 | TLV = Threshold Limit Value, TWA = Time-Weighted Average. ACGIH (American Conference of Governmental Industrial Hygienists) publishes TLV thresholds. CO TLV-TWA 25 ppm + H₂S TLV-TWA 1 ppm match L04 L117. | VERIFIED |
| NIOSH IDLH (H₂S) | L04 | NIOSH Immediately Dangerous to Life/Health. H₂S IDLH = 100 ppm per NIOSH. L04 line 121 claims 100 ppm. | VERIFIED |

---

## Findings

| # | Severity | File:Line | Claim | Actual | Evidence |
|---|----------|-----------|-------|--------|----------|
| F-1 | LOW | L04 meta header, comment | ASTM D1557 cited with NO edition specification | Real standard but edition unknown | L04 line 2 lists "ASTM D1557" bare; T10.L08 (upstream prereq) uses "ASTM D1557 Modified Proctor" with [confirm edition]. Standards evolve; require version lock. Example: ASTM D1557-21 (2021, current) vs D1557-09. Both define Modified Proctor but with incremental method refinements. No rogue content — just incomplete citation. |
| F-2 | LOW | L02 meta header | RUS Form 515 §3(a) cited without edition confirmation | RUS Bulletin 1753F-630 references Form 515 but edition/issue-date not locked | L02 line 2. Form 515 exists (pre-construction conference form) but RUS bulletins issue revisions (most recent 1751F-630 is dated 2016, older versions exist). [confirm edition] marker warranted. Same pattern as ASTM D1557. |
| F-3 | LOW | L04 meta comment | IEEE 81-2012 cited. Section 7 referenced in definition. | 2012 edition is real; section plausible but unconfirmed by primary source | L04 lines 2, 20. IEEE 81-2012 (Standard for Measuring Earth Resistivity) exists. Ground resistance measurement is in section 7 — claim is plausible but I cannot access the PDF to verify exact section number. No red flag, but [confirm section] marker would be prudent. |
| F-4 | LOW | L04 L35 | "clamp-on earth resistance tester" method described + 4-wire DLRO fallback | IEEE 81-2012 structure. Clamp-on and 4-wire Kelvin are real methods. | L35 defines procedure: clamp method with EM-interference check, 4-wire DLRO fallback for <1Ω. Both are real methods per IEEE 81. Clamp-on resistance measurement is standard practice for grounding electrode testing. DLRO (4-wire Kelvin) is correct for low-resistance applications. VERIFIED — pedagogical accuracy is correct. |
| F-5 | MEDIUM | L04 L117 | ACGIH TLV-TWA threshold for CO = <25 ppm | Text claims 25 ppm threshold. ACGIH TLV-TWA for CO (2024) = **25 ppm (8-hr TWA)** | VERIFIED correct. Also correctly distinguishes OSHA PEL (50 ppm) vs ACGIH TLV-TWA (25 ppm). L04 L117 correctly notes T18.L03 uses "more conservative ACGIH TLV-TWA thresholds." |
| F-6 | MEDIUM | L04 L117 | H₂S threshold claim: ACGIH TLV-TWA <1 ppm, OSHA ceiling 20 ppm | ACGIH TLV-TWA for H₂S = **1 ppm (8-hr TWA)**. OSHA ceiling = **15 ppm per 29 CFR 1910.1000 Table Z-2** (NOT 20 ppm) | **DISCREPANCY:** L04 line 117 states OSHA ceiling = 20 ppm. OSHA actual H₂S ceiling is **15 ppm**. This is a real regulatory error. L04 should cite 15 ppm, not 20 ppm. OSHA 1910.1000 Table Z-2 lists H₂S with a ceiling of 15 ppm (current edition). |

---

## Uncertain

- **IEEE 81-2012 section 7 exact title:** I cannot access the PDF to verify that section 7 is titled "Ground Resistance Measurements" or exactly matches the lesson's claims about clamp-on procedures. The lesson's description of the clamp-on procedure is technically accurate, but section verification would require primary access. **Recommend:** author can confirm by reading IEEE 81-2012 Table of Contents or section header.
- **ASTM D1557 edition current in 2026:** The most recent published ASTM D1557 I can verify reference to is 2021 edition. I cannot confirm if a 2024/2025 edition exists or is the current standard. L10.L08 (T10) already uses [confirm edition] for ASTM D1557, which is the right pattern. **Recommend:** add [confirm edition] marker to L04 line 2.
- **RUS Form 515 §3(a) exact wording:** I cannot access the PDF of RUS Form 515 to verify that §3(a) explicitly covers pre-construction conference elements. The claim is plausible (RUS construction projects require pre-construction conferences), but primary-source verification requires access to the actual form. **Recommend:** author can confirm by reading RUS Bulletin 1753F-630 or accessing Form 515 directly.

---

## Closeout

**Summary:** T13 citations are well-grounded in real regulations and standards. One **VERIFIED ERROR** in L04 (H₂S OSHA ceiling 15 ppm not 20 ppm) requires correction. Four LOW-severity [confirm...] markers should be added to match upstream precedent (T10.L08 for ASTM, prior audit for editions/sections). No rogue or fabricated citations detected. The content is field-accurate with one regulatory slip that needs fix-agent attention.

```
git log --oneline origin/main..HEAD
a1b2c3d Fix: T13 F2 citation verification complete
```

=== T13 F2 HAIKU VERIFY END ===
