# T20 — RUS Forms & ReConnect Regulation Research Log

> **Author:** Claude-5 (c5), training curriculum instance.
> **Date:** 2026-06-27
> **Scope:** T20.L03 (RUS Forms 307/740/219), T20.L04 (USOA plant accounting), T20.L08 (ReConnect / Community Connect programs)
> **Purpose:** Document research performed prior to accuracy fixes; required for merge gate.
> **Priority:** Priority 0 — live accuracy flags confirmed present in main (punch-list source: `osp-training/docs/red-team-reports/T13-T22-SUSPECTED-live-errors-UNVERIFIED.md`, T20-C-01, T20-N-01, T20-N-02).

---

## 1. Research methodology

All claims below were verified in this session against public federal sources (eCFR / Federal Register / USDA RD official document URLs) via WebSearch. eCFR.gov and rd.usda.gov direct fetches returned HTTP 403 (blocked by egress proxy policy); however, all CFR titles and form names were confirmed through:
- Returned search snippet text (which reproduces the authoritative document title and content)
- Multiple independent corroborating results pointing to the same CFR part
- Official document URLs that appear in rd.usda.gov canonical paths

Tags used: **VERIFIED-public-source** (direct search result showing official CFR/USDA content), **UNVERIFIABLE-this-session** (not confirmed against an authoritative source during this session).

---

## 2. ReConnect Program — 7 CFR Part 1740 vs. Part 1744

### Finding: T20.L08 cites "7 CFR Part 1744" for the ReConnect Program. This is WRONG.

**Correct citation:** `7 CFR Part 1740` — "Rural eConnectivity Program" (ReConnect).

**Evidence:**

| Source | Content | Status |
|--------|---------|--------|
| eCFR.gov title for Part 1740 | "eCFR :: 7 CFR Part 1740 -- Rural Econnectivity Program" | **VERIFIED-public-source** |
| Federal Register 2022-08-04 (2022-16694) | "Rural eConnectivity Program" rule update, references "7 CFR part 1740" | **VERIFIED-public-source** |
| BroadbandUSA (NTIA) program page | "Department of Agriculture - ReConnect Program" — links to USDA/reconnect | **VERIFIED-public-source** |
| Federal Register 2024-02-21 (2024-03484) | "Notice of Funding Opportunity for the Rural eConnectivity Program ... subject to 7 CFR part 1740 ... codified in final rule, 7 CFR part 1740, published February 26, 2021 (86 FR 11603)" | **VERIFIED-public-source** |
| ReConnect Program Application Guide (rd.usda.gov) | "the program's regulation, 7 CFR 1740" | **VERIFIED-public-source** |
| CRS Report R47017 (congress.gov) | "USDA's ReConnect Program: Expanding Rural Broadband" — confirms 7 CFR 1740 | **VERIFIED-public-source** |

**What 7 CFR Part 1744 actually covers:**

| Source | Content | Status |
|--------|---------|--------|
| eCFR.gov title for Part 1744 | "eCFR :: 7 CFR Part 1744 -- Post-Loan Policies and Procedures Common to Guaranteed and Insured Telephone Loans" | **VERIFIED-public-source** |
| eCFR Subpart B title | "7 CFR Part 1744 Subpart B -- Lien Accommodations and Subordination Policy" | **VERIFIED-public-source** |
| LII Cornell, 7 CFR § 1744.30 | "Automatic lien accommodations" — RUS approval to share lien with private lender | **VERIFIED-public-source** |

**Conclusion:** 7 CFR Part 1744 governs post-loan lien accommodations and mergers for telephone borrowers — it has no relationship to the ReConnect broadband program. The lesson's citation "7 CFR Part 1744" is unambiguously wrong. **Fix: Replace all occurrences of "7 CFR Part 1744" with "7 CFR Part 1740" in T20.L08.**

---

## 3. Community Connect — 7 CFR Part 1703

The lesson cites Community Connect as "(7 CFR Part 1703)." This citation was **not independently verified this session** — it was not flagged in the red-team punch-list and was not among the checked items. It is left in place with a `[confirm edition]` hedge added. It was present in the prior passing content and is not a confirmed error; verification is deferred to a future session if/when T20 undergoes a full depth pass.

---

## 4. Form 307 — Bid Bond (not construction cost ledger)

### Finding: T20.L03 teaches Form 307 as "RUS construction cost ledger." This is WRONG.

**Correct description:** RUS Form 307 is a **bid bond form** — it is submitted by bidders with their construction bid to guarantee the bidder will enter the contract if selected, in the penal sum of 10% of the bid amount.

**Evidence:**

| Source | Content | Status |
|--------|---------|--------|
| rd.usda.gov (UP_ET_form_307.pdf) | "Form 307 - Bid Bond" — from rd.usda.gov/files/UP_ET_form_307.pdf | **VERIFIED-public-source** |
| Search description of Form 307 | "RUS Form 307 is used to obtain a bid bond... penal sum of ten percent (10%) of the amount of the bid" | **VERIFIED-public-source** |
| RUS Bulletin 1738-2 search context | Form 307 appears in competitive bidding context, not cost-ledger context | **VERIFIED-public-source** |
| RUS Form 307 eForms instructions page (forms.sc.egov.usda.gov/eForms/instruction?FileName=RUS307.HTML) | Form 307 instructions listed among construction contract forms for borrowers | **VERIFIED-public-source** |

---

## 5. Form 481 — Financial Requirement Statement (the actual drawdown / cost tracking form)

### Finding: The RUS loan drawdown / construction cost tracking form is Form 481, not Form 307.

**Correct description:** RUS Form 481 (Financial Requirement Statement, OMB No. 0572-0023) is the form used by RUS awardees to request loan advances. Costs are entered by line item (labor, material, equipment) mapped to plant accounts; RUS reviews, approves, and releases the next advance.

**Evidence:**

| Source | Content | Status |
|--------|---------|--------|
| rd.usda.gov instructions PDF (utp_instructionsform481.pdf) | "Instructions for RUS Form 481 (06-21) Financial Requirement Statement" — USDA RD official instructions | **VERIFIED-public-source** |
| OMB report (omb.report) | "Form RUS 481 RUS 481 Financial Requirement Statement - OMB 0572-0023" | **VERIFIED-public-source** |
| USDA rd.usda.gov announcement (rus_481_announcement) | "Revision of RUS Form 481, the Financial Requirements Statement" — confirms name and USDA RD ownership | **VERIFIED-public-source** |
| forms.sc.egov.usda.gov (RUS481.PDF) | "FINANCIAL REQUIREMENT STATEMENT" — official form title on USDA eForms | **VERIFIED-public-source** |
| Search result description | "RUS Form 481 is used by RUS Awardees to request funds for approved projects... Funds advanced are deposited in the Trustee, RUS Construction Fund account... loan and other funds are disbursed only for purposes and amounts approved in Column (2) 'Total Approved for Advance'" | **VERIFIED-public-source** |

---

## 6. Form 231 — Certificate of Contractor (standard telecom contractor certificate)

### Finding: "Form 231 (Certificate of Contractor)" appears in the official list of RUS telecom standard contract forms per 7 CFR §1755.30.

**Evidence:**

| Source | Content | Status |
|--------|---------|--------|
| 7 CFR §1755.30 search result description | Explicit list includes "RUS Form 231 (Certificate of Contractor)" in the list of standard telecom contract forms | **VERIFIED-public-source** |
| Search result URL (law.cornell.edu/cfr/text/7/1755.30) | "7 CFR § 1755.30 - List of telecommunications standard contract forms" | **VERIFIED-public-source** |

**Note:** The specific content of Form 231 (what exactly is certified) was not retrieved this session — the form is not freely accessible as a PDF via the proxy. The lesson describes contractor certification as covering non-discrimination, bonding/insurance, prevailing wage, and no conflicts of interest. These requirements derive from 7 CFR Part 1788 (Fidelity and Insurance Requirements for Telecommunications Borrowers) and applicable federal contractor law, not Form 231 alone. The lesson now hedges the specific content of Form 231 and cites Part 1788 for the insurance/bonding requirement. **[VERIFY the full content of Form 231 against the current USDA eForms version before using these specifics in formal credentialing programs.]**

---

## 7. Form 740 — Not found in RUS Telecommunications standard forms

### Finding: Form 740 is not listed in the RUS Telecommunications standard contract forms (7 CFR §1755.30).

**Evidence:**

| Source | Content | Status |
|--------|---------|--------|
| 7 CFR §1755.30 search result | Lists standard telecom forms by number (217, 220, 224, 231, 238, 242, 245, 257, 257a, 274, 276, 281) — Form 740 is NOT listed | **VERIFIED-public-source** |
| rd.usda.gov search result | "Form 740c-1" found at `rd.usda.gov/files/UEP_form_740c.pdf` — "UEP" prefix = Utilities Electric Program, not Telecommunications | **VERIFIED-public-source** |

**Conclusion:** Form 740 (as taught in the prior lesson) is either a reference to the Electric Program's Form 740c, or an unverifiable form number not in the telecom standard contract list. It should not be presented as a standard RUS Telecom contractor certification form without a verified citation. **Fix: Lesson now identifies Form 231 (Certificate of Contractor, per §1755.30) as the standard telecom contractor certification form, and flags Form 740 as absent from the telecom standard forms list with a verify-before-use note.**

---

## 8. Form 219 — Ground-rod testing

Form 219 was independently verified as CORRECT in the red-team report (Section 12 — "Items Verified Correct"): "Form 219 for ground-rod resistance testing per IEEE 81 with <5Ω threshold: consistently and correctly described across T14, T16, and T20." No changes to Form 219 content.

---

## 9. Contractor bond forms (for completeness)

**RUS Form 168b** (contractor's bond for contracts exceeding $250,000) and **RUS Form 168c** (for Small Business Administration surety guarantees on contracts ≤ $1,000,000) are the standard RUS contractor bonds for construction contracts. Source: search result description of RUS Part 1788 Subpart C and §1755.30 context.

---

## 10. Summary of fixes applied

| Lesson | Issue | Fix Applied | Confidence |
|--------|-------|-------------|-----------|
| T20.L08 | "7 CFR Part 1744" for ReConnect | Replaced with "7 CFR Part 1740" (all occurrences) | HIGH — multiple VERIFIED-public-source confirmations |
| T20.L03 | Form 307 described as construction cost ledger | Corrected: Form 307 = bid bond; Form 481 = Financial Requirement Statement | HIGH |
| T20.L03 | Form 740 as standard telecom contractor cert | Updated to Form 231 per §1755.30; Form 740 flagged as absent from telecom forms list | MEDIUM — Form 231 confirmed in list; specific content not retrieved |
| T20.L04 | "Submit Form 307" for cost tracking | Corrected to "Form 481 (Financial Requirement Statement)" | HIGH |

---

## 11. Sources (URLs returned by WebSearch this session)

- eCFR Part 1740 title: https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1740
- Federal Register 2022 ReConnect rule: https://www.federalregister.gov/documents/2022/08/04/2022-16694/rural-econnectivity-program
- Federal Register 2024 NOFO: https://www.federalregister.gov/documents/2024/02/21/2024-03484/notice-of-funding-opportunity-for-the-rural-econnectivity-program-for-fiscal-year-2024
- BroadbandUSA ReConnect page: https://broadbandusa.ntia.doc.gov/resources/federal/federal-funding/department-agriculture-reconnect-program
- CRS Report R47017: https://www.congress.gov/crs-product/R47017
- ReConnect FAQ (USDA PDF): https://www.usda.gov/sites/default/files/documents/reconnect-program-faqs-eligibility.pdf
- ReConnect Program Guide 2024: https://www.rd.usda.gov/files/ReConnect_Program_Application_Guide.pdf
- eCFR Part 1744 title: https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1744
- eCFR Part 1744 Subpart B (Lien Accommodations): https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1744/subpart-B
- LII 7 CFR §1744.30 (Automatic lien accommodations): https://www.law.cornell.edu/cfr/text/7/1744.30
- Form 307 Bid Bond (rd.usda.gov): https://www.rd.usda.gov/files/UP_ET_form_307.pdf
- RUS Telecom System Construction Contract Form 515: https://www.rd.usda.gov/sites/default/files/UTP_form_515.pdf
- Form 307 eForms instructions: https://forms.sc.egov.usda.gov/eForms/instruction?FileType=TipInstruction&FileName=RUS307.HTML
- Form 481 instructions (rd.usda.gov): https://www.rd.usda.gov/sites/default/files/utp_instructionsform481.pdf
- Form 481 OMB record: https://omb.report/icr/200908-0572-001/doc/13101901
- Form 481 announcement (rd.usda.gov): https://www.rd.usda.gov/sites/default/files/rus_481_anouncement06_24_2021-kk-amrevised-llsigned.pdf
- Form 481 on USDA eForms: https://forms.sc.egov.usda.gov/efcommon/eFileServices/eForms/RUS481.PDF
- 7 CFR §1755.30 (LII): https://www.law.cornell.edu/cfr/text/7/1755.30
- 7 CFR §1755.26 (RUS standard contract forms): https://www.law.cornell.edu/cfr/text/7/1755.26
- eCFR Part 1753 (Telecom System Construction): https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1753
- eCFR Part 1788 (Fidelity and Insurance for Telecom Borrowers): https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1788
- Form 740c-1 (Electric Program): https://www.rd.usda.gov/files/UEP_form_740c.pdf
