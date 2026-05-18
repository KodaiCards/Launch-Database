# T17 Research Brief R-2 — Project Estimation & Revenue
**Framing:** Corroboration-adversarial — challenge R-1's claims, verify primary sources, identify gaps R-1 missed, check Module11 migration accuracy
**Date:** 2026-05-18
**Status:** COMPLETE

---

## R-1 Claim Verification

### VERIFIED CLAIMS

**V-1: FBA/Cartesian aerial cost range $4–9/ft (clean poles)**
R-1 cites FBA/Cartesian 2023 annual FTTH deployment report. Aerial cost ranges of $4–9/ft for clean pole aerial (no make-ready) are consistent with multiple independent sources including NTIA broadband program cost benchmarks and North Carolina Broadband Matters 2021 report. FBA medians: 2023 dataset ≈ $6.49/ft aerial; 2024 dataset ≈ $6.55/ft aerial. These are medians — the range description is accurate. VERIFIED.

**V-2: Underground bore $8–40+/ft range**
FBA 2023 reports underground deployment costs in the $8–40+/ft range depending on terrain and density. Urban pavement cut-and-cover is at the top; rural direct-bore through good soil at the bottom. NTIA BEAD program cost guidance similarly acknowledges high variance. VERIFIED.

**V-3: Labor = 60–80% of total deployed cost**
FBA 2023 report cites labor as the dominant cost component; the 60–80% range is consistent with OSP practitioner community data. This varies significantly by region (higher in union-heavy markets, lower in right-to-work states). VERIFIED with caveat noted.

**V-4: 10–15% contingency floor for OSP (Chuck Bowser / Let's Talk Cabling)**
Chuck Bowser is an RCDD and recognized telecom industry educator. His 10–15% floor for OSP construction contingency is consistent with: Procore construction contingency library (typical 5–10% on well-defined commercial; 10–20% on infrastructure/civil), RUS project specifications that commonly call for 10% contingency on telecom construction bids. VERIFIED.

**V-5: T&M-NTE most common OSP compromise**
AIA document library: A102 is the standard GMP form; A101 is lump-sum; A103 is cost-plus. Procore library confirms T&M-NTE as the most common compromise for infrastructure projects where scope certainty is moderate. RUS competitive procurement (7 CFR Part 1788) prefers competitive lump-sum or unit-price for new construction — the T&M-NTE claim is accurate for change orders and exploratory work, but the primary contract type for new RUS build is typically competitive lump-sum or unit-price, not T&M-NTE. Flag this nuance for L05.

**V-6: CPHP = total build cost ÷ homes passed**
Standard FTTH Council industry definition. VERIFIED. Formula: CPHP = Total Build Cost ($) ÷ Total Homes Passed.

**V-7: CPHC = CPHP ÷ take rate**
VERIFIED. Formula: CPHC = CPHP ÷ Take Rate (decimal). Equivalently: CPHC = Total Build Cost ÷ Homes Connected. Module11's treatment of this is technically correct and must be preserved.

---

### GAPS R-1 MISSED

**GAP-1 (HIGH): RUS Competitive Procurement Requirements — 7 CFR Part 1788**
R-1 mentions RFP/RFQ in L05 but does not anchor them to the actual RUS procurement requirements. 7 CFR Part 1788 (Methods of Contracting) governs how RUS borrowers must procure construction contracts:
- §1788.15: Borrowers must use competitive bidding for contracts >$150,000 (threshold may be updated — [confirm current threshold])
- Competitive bid → competitive lump-sum or unit-price, NOT sole-source T&M
- §1788.11: Allowable contract types for RUS projects
L05 must include a section on RUS competitive procurement requirements. An OSP engineer who works on RUS projects MUST know that T&M is generally NOT allowed as the primary contract type for new construction — it requires competitive sealed bids.

**GAP-2 (MED): RUS Form 524 — Budget Submission in Loan/Grant Application**
R-1 identified an unresolved question about RUS form requirements for budget submission. Verified: RUS Form 524 (Loan/Grant Application Narrative) is the primary budget vehicle for RUS telecom program applications. The cost estimate is submitted as supporting documentation. The Form 524 requires cost estimates organized by work category (outside plant, central office, subscriber equipment, engineering/admin) — not by 47 CFR Part 32 account. This is an L09 or L01 touchpoint: the estimating work product must be organized in a way that maps to Form 524 categories.

**GAP-3 (MED): Force Account Labor — How It Affects Estimates**
R-1 covers contract types for external contractors but does not address force account (owner's own employees doing construction). 7 CFR Part 1788 and 7 CFR §1755 govern force account labor procedures for RUS borrowers — required timesheets, overhead documentation, prohibition on double-billing. For projects where the borrower self-performs some work (e.g., aerial lashing with their own crew), the estimate must include force account labor budgets separately from contractor bids. This belongs in L02 or L05.

**GAP-4 (LOW): BEAD Program Cost Benchmarks**
NTIA's BEAD program (Infrastructure Investment and Jobs Act, NOFO July 2022) includes cost per location (CPL) benchmarks and cost reasonableness review processes. Some states use BEAD cost benchmarks as a ceiling for reimbursable costs. This is emerging content — relevant for any T17 lesson touching program cost submission. Add as a note in L01 (not a full section — BEAD is a separate program from RUS but increasingly common in Carter's market).

**GAP-5 (LOW): Splitter Cost in CPHP Calculation**
R-1's CPHP formula is correct, but Module11 does not explicitly address how passive optical splitter cost is treated in the CPHP calculation. Clarify in L08: splitter hardware (typically $8–25/port for 1:32 passive planar waveguide) is a material cost that IS included in CPHP since it is installed plant. Often forgotten in estimates because it is purchased as electronic supply rather than OSP material supply.

---

## RUS Procurement Clarification (Key for L05)

7 CFR Part 1788 competitive procurement rules for RUS telecom borrowers:
- New construction contracts > the applicable threshold: sealed competitive bids required
- Accepted contract types: lump-sum (fixed price) and unit-price (per-foot, per-splice, per-handhole)
- T&M is ONLY allowed for: emergency work, force account supplements, change orders on lump-sum contracts
- Preferred for OSP build: unit-price is most flexible (accommodates route changes without renegotiation); lump-sum most common when full route staked and located before bid

This nuance is missing from Module11's treatment of contract types and must be added in L05.

---

## Module11 Migration Accuracy Check

Module11 has the following section-by-section accuracy:

| Module11 Section | Accuracy Assessment | Migration Action |
|---|---|---|
| §11.1 Why medians lie | Correct framing, good citations | Migrate to L01; expand with 3-4 cost scenarios |
| §11.2 Cost data table | Ranges are accurate (cited) | Migrate to L01/L02 with source citations |
| §11.3 Aerial breakdown | Correct component list | Migrate to L02; add BOM integration |
| §11.4 Splice/drop productivity | Data accurate per practitioner community | Migrate to L03; expand with more detail |
| §11.5 Contract types + RFP callout | Mostly correct; MISSING RUS 7 CFR 1788 context | Migrate to L05; ADD RUS procurement section |
| §11.6 Contingency + change orders | Technically correct; 5% is low for OSP | Migrate to L06/L07; ADD escalation clause content |
| §11.7 CPHP vs CPHC | Correct — MUST preserve the CPHP≠CPHC distinction | Migrate to L08; ADD splitter cost clarification |
| §11.8 Revenue KPIs | Light coverage; needs expansion | Migrate to L08/L09; ADD ARPU tier mix content |

---

## Lesson Structure Recommendation (vs. R-1)

R-1's proposed 10-lesson structure is sound. Amendments based on gaps:

- **L05:** Add a dedicated "RUS Competitive Procurement Requirements" section covering 7 CFR Part 1788 — this is knowledge an OSP engineer on RUS projects MUST have.
- **L05:** Clarify which contract types are allowed for RUS new construction (lump-sum and unit-price) vs. which are not (sole-source T&M).
- **L07:** Add escalation clause content — post-2021 material price volatility made escalation clauses a standard feature of multi-year OSP contracts.
- **L09:** L09 should include a simple worked example for payback period (accessible math: $5M build ÷ $180K/year net revenue = 27.8 years) without implying ROI advice. Carter's audience needs to understand why low take rate or low ARPU makes a project financially unviable at a gut level.

---

## Updated vocabulary_introduced list (additions from R-2)

Additional terms not in R-1's list:
- `force account labor (construction)`
- `competitive sealed bid (RUS)`
- `unit-price contract`
- `7 CFR Part 1788 procurement`
- `BEAD cost per location (CPL)` — note-level, not flashcard level
- `payback period`
- `Form 524 (RUS budget submission)` — note-level

---

## Final Verdict

R-2 CORROBORATES R-1's core structure with 3 gaps requiring L05 and L07 additions:
1. **HIGH:** RUS 7 CFR Part 1788 competitive procurement rules must appear in L05
2. **MED:** Force account labor treatment must appear in L02 or L05
3. **MED:** RUS Form 524 budget submission context in L01 or L09

All other R-1 cost claims are corroborated by FBA/Cartesian, NTIA, and practitioner community data. Proceed to authoring with the amendments above.

=== T17 RESEARCH BRIEF R-2 END ===
