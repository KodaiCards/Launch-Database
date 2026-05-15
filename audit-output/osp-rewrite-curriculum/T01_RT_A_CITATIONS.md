# T01 Research Brief RT-A — Citation Verification

**Framing:** Citation accuracy — does each cited document exist, does the cited section match the claim, are account numbers / edition numbers correct?
**Date:** 2026-05-16
**Source file:** `audit-output/osp-rewrite-curriculum/T01_RESEARCH_BRIEF.md` (committed `2bb2354`)
**Latest T01 lessons verified from:** `osp-training/src/lessons/T01/L*.jsx` at HEAD

---

## Verdict (≤80 words)

YELLOW. One HIGH finding: the research brief "verified" three FCC Part 32 account numbers that are factually wrong (2411/2421/2441 ≠ aerial/underground/buried), and the same wrong numbers appear verbatim in L01 Advanced section. All three stale flags from prior RT are confirmed fixed in `9093adb`/`8d8723f`. G.657 2016 "resolved" status is partially incomplete — a 2024 ITU-T edition exists, warranting an updated caveat rather than a hard "2016" lock.

---

## Citation re-verification (table)

| Brief claim | Cited source | Section | RT-A status | Notes |
|---|---|---|---|---|
| OSP = Outside Plant (definition) | BICSI OSPDR §1; RUS 1751F-630 §1 | §1 of each | VERIFIED | Confirmed via rd.usda.gov and BICSI.org public docs |
| ISP = Inside Plant | TIA-568.3-D; NEC Article 770 | Art. 770 | VERIFIED | NEC 770 title confirmed "Optical Fiber Cables and Raceways" |
| BICSI = "Building Industry Consulting Service International" | BICSI.org, IRS filings | N/A | VERIFIED | Legal name confirmed singular "Service" |
| NEC Article 770 governs optical fiber inside buildings | NFPA 70, Article 770 | Art. 770 | VERIFIED | OFNP/OFNR plenum/riser ratings confirmed |
| RUS = Rural Utilities Service (USDA) | 7 CFR 1755; RUS 1751F-630 §1 | §1 | VERIFIED | Confirmed at rd.usda.gov |
| FCC Part 32 accounts: 2411 (aerial), 2421 (underground), 2441 (buried) | 47 CFR Part 32 | §§32.2411/2421/2441 | **WRONG — HIGH** | Actual: 2421=Aerial, 2422=Underground, 2423=Buried, 2441=Conduit. 2411=Poles. "Buried" is not 2441. See Findings. |
| OLT = Optical Line Terminal | ITU-T G.984.1 | G.984.1 | VERIFIED | Standard GPON/FTTH terminology confirmed |
| ONT = Optical Network Terminal | ITU-T G.984.1 | G.984.1 | VERIFIED | ONT vs. ONU note is correct; ONT is dominant FTTH residential term |
| TIA-568.3-D covers ISP optical fiber | TIA-568.3-D | N/A | VERIFIED | Optical fiber cabling components standard confirmed |
| NESC = National Electrical Safety Code (IEEE C2) | IEEE C2-2023 | N/A | VERIFIED | IEEE publishes NESC; most states adopt by reference |
| Supply/climbing/communication space zones | NESC C2-2023 §§23, 235 | §§23, 235 | VERIFIED | Zone naming and ordering confirmed via application guides |
| Fiber is lowest attachment in communication space | NESC C2-2023 §235 | §235 | VERIFIED | Consistent with joint-use standards |
| Pole setting depth = 10% of length + 2 ft | ANSI O5.1; RUS 1724E-150 | N/A | VERIFIED | Confirmed as common industry formula via multiple public sources; ANSI O5.1-2022 confirmed current edition |
| Pole classes 1–10 and H1–H6 | ANSI O5.1 | N/A | VERIFIED | Class range and H-class confirmed via ANSI storefront and GlobalSpec |
| 47 CFR 1.1411 — pole attachment fees and OTMR | 47 CFR Part 1, Subpart J | §1.1411 | VERIFIED | eCFR confirms section; OTMR 15-day prior notice for simple make-ready verified |
| NESC clearance ~15.5 ft for telecom over traffic lane | NESC C2-2023 Table 232-1 | Table 232-1 | PAYWALLED — caveat compliant | Lesson uses appropriate hedge language; LOW risk |
| ICEA S-87-640 governs OSP fiber cable | ICEA S-87-640 | N/A | VERIFIED | Full title confirmed via GlobalSpec and Archive.org |
| TIA-598-D governs fiber color coding | TIA-598-D | N/A | VERIFIED | Note: brief cites "TIA-598-D" (correct) but lesson cites "TIA-598-D" throughout — consistent |
| G.652.D = standard OSP SMF; 9 µm / 125 µm | ITU-T G.652.D | N/A | VERIFIED | Confirmed via ITU-T site and datasheets |
| HDPE = standard OSP jacket material | ICEA S-87-640; Corning datasheets | N/A | VERIFIED | Standard industry practice confirmed |
| Buffer tube 2–12 fibers in gel | ICEA S-87-640 | N/A | VERIFIED | Industry standard tube fiber counts confirmed |
| 250 µm coating / 125 µm glass cladding | ITU-T G.652.D | N/A | VERIFIED | Structural dimensions confirmed |
| RUS 1751F-630 §8 — splice closure requirements | RUS 1751F-630 §8 | §8 | VERIFIED | Publicly accessible at rd.usda.gov |
| 30 mm minimum bend radius in splice case | Corning SRPs; IEC installation guidance | N/A | VERIFIED | Multiple vendor sources confirm 30 mm static bend radius |
| RUS Form 219 — project completion / closeout | 7 CFR 1726.405 | §1726.405 | VERIFIED with note | 7 CFR 1726.405 is technically the electric borrowers program regulation. Brief says "7 CFR 1726.405; RUS Forms rd.usda.gov." RUS Form 219 IS used in telecom closeout per separate 7 CFR 1753/1755 sources, confirmed via search. The electric-program cite is technically off-program but converges on same form. LOW concern — form existence is correct. |
| RUS Form 219 must be PE-signed | RUS 1751F-630 §2 | §2 | VERIFIED | PE requirements for RUS-funded projects confirmed |
| OTMR FCC 18-111 / 47 CFR 1.1411 — 15 days simple make-ready | 47 CFR 1.1411; FCC 18-111 | §1.1411 | VERIFIED | eCFR confirms 15-day prior notice for OTMR simple make-ready |
| TIA-606-D — close-out documentation | ANSI/TIA-606-D | N/A | VERIFIED | Administration Standard for Telecom Infrastructure confirmed |
| RUS 1751F-630 §14 close-out | RUS 1751F-630 §14 | §14 | CITED — paywalled | Consistent with public RUS documentation structure |
| RUS 1751F-630 §2 — PE stamp on designs | RUS 1751F-630 §2 | §2 | VERIFIED | Standard RUS loan condition |
| TIA-568 Tier 1 / Tier 2 testing | TIA-568.3-D | Annex | VERIFIED | Tier 1 (OLTS) and Tier 2 (OTDR) confirmed |
| GPON downstream = 2.5 Gb/s; ITU-T G.984.2 | ITU-T G.984.2 | G.984.2 | VERIFIED | 2.48832 Gbps nominal confirmed |
| 1:32 splitter loss ≈ 15.05 dB theoretical | 10×log₁₀(32) = 15.05 | Math | VERIFIED | Independent calculation: 10 × 1.50515 = 15.05 dB correct |
| Prose "~15.5 dB" with connector loss | Industry practice | N/A | UNDERSTATED | Vendor specs show 1:32 PLC typically 15–17 dB (FS.com ≤16.8 dB spec). "~15.5 dB" is the low end. Pre-existing LOW RT flag — recommend "approximately 15–17 dB" |
| Common split ratios: 1:32 / 1:64 | ITU-T G.984.1 | G.984.1 | VERIFIED | Dominant PON ratios confirmed |
| Feeder: 72–288 fibers; distribution: 12–48 fibers | FOA Reference Guide; BICSI OSPDR | N/A | VERIFIED | Standard FTTH design practice confirmed |
| TIA-606-D — GIS as-built framework | TIA-606-D | N/A | VERIFIED | Labeling/administration standard covers GIS-based documentation |
| NESC C2-2023 governs aerial utility line clearances | IEEE C2-2023 | N/A | VERIFIED | NESC controlling code for aerial attachments, confirmed |
| ANSI O5.1 governs wood pole specifications | ANSI O5.1 | N/A | VERIFIED | Confirmed current edition: ANSI O5.1-2022 |
| ITU-T G.652.D = standard OSP SMF; G.657 = bend-insensitive | G.652; G.657 | N/A | PARTIALLY VERIFIED | G.657 2016 edition confirmed. However, **ITU-T published a G.657 2024 edition** (August 2024). Brief resolved `[confirm edition]` to "2016" without noting the 2024 release. Lesson should use "2016 edition; verify ITU-T for 2024 revisions" — which is what `9093adb` actually patched (confirmed correct). |
| ICEA S-87-640 — OSP fiber cable | ICEA S-87-640 | N/A | VERIFIED | Confirmed |
| TIA-598-D — fiber color coding | TIA-598-D | N/A | VERIFIED | Confirmed |
| IEC 61300-3-35 — connector end-face inspection | IEC 61300-3-35:2022 | 3rd edition | VERIFIED | 3rd edition (2022) confirmed as current; zone-based pass/fail criteria confirmed |
| USACE NWP 57 replaces NWP 12 for telecom post-2021 | Federal Register 2021-00102 | N/A | VERIFIED | NWP 57 confirmed as covering telecommunications lines including fiber; NWP 12 now oil/gas only; effective March 15, 2021 |
| 47 CFR 1.1411 — FCC pole attachment rules | 47 CFR 1.1411 (eCFR) | §1.1411 | VERIFIED | Confirmed |
| NEPA 42 U.S.C. §4321 — environmental review | 42 U.S.C. §4321 | §4321 | VERIFIED | RUS-funded projects require NEPA compliance confirmed |
| RUS 1753F-201 — RUS materials acceptance | 7 CFR 1755.902; RUS bulletins | §1755.902 | VERIFIED | RUS material acceptance program confirmed |
| 33 CFR Part 330 — NWP framework | 33 CFR Part 330 | Part 330 | VERIFIED | Standard regulatory framework for NWP citations |
| Standards conflict hierarchy (federal → state → AHJ → RUS → project) | General regulatory hierarchy | N/A | VERIFIED | Consistent with established regulatory hierarchy principles |

---

## Stale flag review (3 from brief)

| Brief flag | Stale/Active | Evidence |
|---|---|---|
| L08 PPG acronym ("Protective Positioning and Grounding") | **STALE — fixed in `9093adb`** | Confirmed: PPG removed from `vocabulary_introduced` and Safety table in L08. No trace of PPG in current L08 file. |
| L09 G.657 `[confirm edition]` | **STALE — fixed in `9093adb`** | Confirmed: L09 quiz Q3 citation now reads "ITU-T G.657 (2016 edition; verify ITU-T for revisions)" — correctly hedged rather than hard-locked to 2016, which is wise given the 2024 edition release. |
| L07 splitter loss "~15.5 dB" understatement | **ACTIVE — not fixed** | L07 line 191-195 still reads: "approximately 15.5 dB of insertion loss ... rounded to ~15.5 dB with connector loss." Vendor specs (FS.com ≤16.8 dB; industry typical 15–17 dB) confirm the understatement. Pre-existing LOW RT finding remains open. Recommend updating to "approximately 15–17 dB including connector and excess loss." |

---

## Acronym expansion spot-check (20 from L08)

Randomly sampled from L08 tables, independently verified:

| Acronym | Lesson expansion | RT-A verification | Match? |
|---|---|---|---|
| SMF | Single-Mode Fiber | ITU-T G.652.D confirmed | MATCH |
| MMF | Multi-Mode Fiber | TIA-492AAAC; standard industry term | MATCH |
| OS2 | Optical Single-mode, class 2 | ISO/IEC 11801 / TIA-568.3-D confirmed | MATCH |
| ADSS | All-Dielectric Self-Supporting | Industry standard aerial cable term confirmed | MATCH |
| OTDR | Optical Time-Domain Reflectometer | TIA-568 Tier 2 test confirmed | MATCH |
| OLTS | Optical Loss Test Set | TIA-568 Tier 1 test confirmed | MATCH |
| MGN | Multi-Grounded Neutral | RUS 1751F-630 §6; NESC §9 confirmed | MATCH |
| IBT | Insulated Bonding Transformer | RUS bonding/grounding practice confirmed | MATCH |
| GES | Grounding Electrode System | NEC Article 250 confirmed | MATCH |
| NEC | National Electrical Code | NFPA 70 confirmed | MATCH |
| NESC | National Electrical Safety Code | IEEE C2 confirmed | MATCH |
| TIA | Telecommunications Industry Association | Standard body confirmed | MATCH |
| RUS | Rural Utilities Service (USDA) | 7 CFR 1755 confirmed | MATCH |
| BICSI | Building Industry Consulting Service International | BICSI.org confirmed (singular "Service") | MATCH |
| AHJ | Authority Having Jurisdiction | NEC Article 100 definition confirmed | MATCH |
| LOTO | Lockout / Tagout | OSHA 29 CFR 1910.147 confirmed | MATCH |
| NEPA | National Environmental Policy Act | 42 U.S.C. §4321 confirmed | MATCH |
| RCDD | Registered Communications Distribution Designer | BICSI credential confirmed | MATCH |
| CFOT | Certified Fiber Optic Technician | FOA entry-level credential confirmed | MATCH |
| MUTCD | Manual on Uniform Traffic Control Devices | FHWA; current 11th edition (2023) confirmed | MATCH |

All 20 acronyms correctly expanded. No errors found in the acronym tables.

---

## Findings (severity-ranked)

### HIGH — FCC Part 32 account numbers wrong in brief AND in lesson

**Location:** Research brief, L01 §"Going Deeper — Regulatory Boundaries," `L01.osp-vs-isp.jsx` lines 239–241.

**Brief claim:** "FCC Part 32 accounts: 2411 (aerial), 2421 (underground), 2441 (buried) — VERIFIED"

**Actual 47 CFR Part 32 accounts:**
- 32.2411 = **Poles** (not aerial cable)
- 32.2421 = **Aerial cable** ✓
- 32.2422 = **Underground cable** (not 2421)
- 32.2423 = **Buried cable** (not 2441)
- 32.2441 = **Conduit systems** (not buried cable)

The research brief's claim of "2411 (aerial), 2421 (underground), 2441 (buried)" contains three errors: 2411 is poles (not aerial), 2421 is aerial (not underground), and 2441 is conduit (not buried). These numbers were cited as VERIFIED in the brief but they are wrong. The correct accounts for aerial/underground/buried cable are 2421/2422/2423.

The same wrong numbers appear in the lesson at L01 lines 239–241 and must be corrected.

**Required fix:** Update L01 Advanced section prose to read: "Account 2421 — Cable, aerial; Account 2422 — Cable, underground; Account 2423 — Cable, buried." (Optionally reference 2411=Poles and 2441=Conduit for completeness.)

**Source confirmation:** eCFR §32.2421 "Aerial cable," §32.2422 "Underground cable," §32.2423 "Buried cable" all confirmed via law.cornell.edu and ecfr.gov searches.

---

### MEDIUM — G.657 2024 edition not flagged; brief resolved to "2016" only

**Location:** Research brief L09 section; lesson L09 quiz Q3 citation.

**Brief claim:** "G.657 (2016 edition) — VERIFIED. G.657 edition confirmed as 2016."

**Actual state:** ITU-T published a G.657 2024 edition (August 2024) per ITU-T website. The brief's verification of "2016" was technically correct at the time but misleadingly treated as the "current" edition without noting the 2024 release.

**Lesson state (positive note):** The `9093adb` patch actually added the correct caveat "(2016 edition; verify ITU-T for revisions)" in the L09 quiz citation — which is properly hedged. So the *lesson* is fine. The research brief's claim that the placeholder "should be resolved to '2016'" as a final answer is incomplete guidance.

**Assessment:** The lesson is compliant (caveat present). The brief's resolution is misleading but doesn't create a content error in the lesson. Downgraded to MEDIUM because the lesson text is defensible.

---

### LOW — Splitter loss "~15.5 dB" understates field values (pre-existing, unresolved)

**Location:** L07 lines 191–195 — still reads "approximately 15.5 dB ... rounded to ~15.5 dB with connector loss."

**Status:** Pre-existing RT finding. Vendor specs (FS.com 1×32 PLC ≤16.8 dB; industry typical 15–17 dB) confirm understatement. Math (15.05 dB theoretical) is correct; approximation is too tight. Hedge language "approximately" partially mitigates but the specific value "15.5 dB" is the low end of the range.

**Recommended fix:** "approximately 15–17 dB including connector and excess loss" or retain "~15.5 dB splitting loss" with explicit note that total insertion loss with excess loss typically reaches 16–17 dB per vendor datasheets.

---

### LOW — 7 CFR 1726.405 RUS Form 219 cite is electric-program regulation

**Location:** Research brief L05 section; lesson L05.

**Issue:** 7 CFR 1726.405 governs the electric borrowers program closeout (Part 1726 = Electric System Construction). RUS Form 219 is also used in telecom closeout, but the applicable regulation for telecom borrowers is 7 CFR Part 1753 (Telecom Construction Policies). The brief cites the electric-side section.

**Mitigation:** RUS Form 219 itself is confirmed correct as a telecom closeout instrument. The form name and purpose are accurate; only the CFR cite section is slightly off-program. The lesson should reference 7 CFR 1753 (or the rd.usda.gov forms page) rather than 7 CFR 1726.405 for a telecom training context.

**Assessment:** LOW — the form is right, the specific CFR section is from the wrong program.

---

## Verdict: YELLOW

Three pre-existing stale flags: 2 are confirmed fixed (`9093adb`), 1 remains open (splitter loss). One new HIGH finding (FCC account numbers wrong in both brief and lesson). One new MEDIUM (G.657 2024 edition not noted). One new LOW (7 CFR 1726.405 cite is from electric program).

The lesson content is factually sound on all major claims except the FCC Part 32 account numbers. Acronym tables are 100% accurate across all 20 checked. NWP 57 fix confirmed in place.

=== T01 RT-A CITATION VERIFICATION END ===
