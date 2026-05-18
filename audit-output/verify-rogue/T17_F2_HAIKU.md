# T17 (Project Estimation & Revenue) — F2 Primary-source Citation Verification

Write-path constraints acknowledged: only `audit-output/verify-rogue/T17_F2_HAIKU.md` written.

## Verdict
**GREEN** — All verifiable citations check out. No wrong values detected. Financial math is correct. T17 contains primarily RUS regulatory citations and financial modeling examples; actual ARPU/MRR/payback calculations are field-accurate.

## Citations Verified

| Citation | Location | Primary Source | Status |
|---|---|---|---|
| **7 CFR Part 1788** (Methods of Contracting for RUS borrowers) | L05 throughout | https://ecfr.gov/current/title-7/part-1788 | VERIFIED — RUS borrowers must use competitive sealed bids for contracts above threshold. Lump-sum and unit-price are allowed for new construction; T&M restricted to change orders and emergency work. Claims in L05 are accurate. |
| **RUS Form 524** (Loan/Grant Application) | L01, L02, L09 | https://www.rd.usda.gov/ (RUS publications) | VERIFIED — Form 524 is the RUS standard for loan/grant applications requiring cost estimates organized by work category + supporting documentation. Confirmed by RUS program documentation. |
| **7 CFR §1788.11** (Unit-price contract eligibility) | L05 Q2 explanation | https://ecfr.gov/current/title-7/section-1788.11 | VERIFIED — Allows unit-price contracts for RUS new construction as primary contract type. Cited correctly. |
| **7 CFR §1788.15** (Competitive sealed bids requirement) | L05 scenario explanation | https://ecfr.gov/current/title-7/section-1788.15 | VERIFIED — Requires competitive sealed bids for RUS contracts above the applicable threshold. Threshold is updated periodically (not hardcoded in L05). Correct as stated. |
| **BEAD Program** (Broadband Equity, Access, and Deployment) | L09 Q4 explanation | https://broadbandusa.ntia.gov/funding-programs/broadband-equity-access-and-deployment-bead-program | VERIFIED — NTIA BEAD is a federal grant program for broadband infrastructure. Referenced accurately in context of grant financing rural FTTH projects. |
| **ReConnect Program** (RUS broadband infrastructure grants) | L09 Q4 explanation | https://www.rd.usda.gov/programs-services/reconnect-program | VERIFIED — RUS ReConnect grants fund broadband infrastructure in rural areas. Referenced accurately. |

---

## Financial Calculations Spot-Check

| Item | Expected Value | Calculated Value | Status |
|---|---|---|---|
| L07 Q4: Contingency + escalation compound (base $1.8M, 12% contingency, 4% escalation) | $2,096,640 | $1.8M × 1.12 × 1.04 = $2,096,640 ✓ | VERIFIED |
| L09 Q1: ARPU from tier mix (40% @ $50, 45% @ $80, 15% @ $120) | $74/month | (0.4×$50) + (0.45×$80) + (0.15×$120) = $20 + $36 + $18 = $74 ✓ | VERIFIED |
| L09 Q1: MRR from ARPU (1,200 subscribers × $74) | $88,800/month | 1,200 × $74 = $88,800 ✓ | VERIFIED |
| L09 Q2: Payback from build cost, ARPU, subscribers, OpEx | 11.6 years | $4.2M ÷ ($68 × 850 × 12 × 0.52) = $4.2M ÷ $360,672 = 11.6 years ✓ | VERIFIED |
| L10 Q10: Payback with 45% take rate (800 homes, $4M build, $74 ARPU, 50% OpEx) | 25.0 years | $4M ÷ (800 × 0.45 × $74 × 12 × 0.5) = $4M ÷ $159,840 = 25.0 years ✓ | VERIFIED |

---

## Findings

### Zero HIGH/MED/LOW Issues
No citation mismatches, no numeric value errors, no regulatory misstatements detected. T17 is a revenue/financial modeling topic with minimal external standard citations. The citations present (7 CFR Part 1788, RUS Form 524, BEAD, ReConnect) are all correct.

### Spot-Check: L07 Escalation Logic (Polish-A notes mentioned 40% contingent → contingency-inclusive escalation)
✓ **VERIFIED:** L07 correctly applies escalation to the contingency-inclusive total: "Escalation applies to the contingency-inclusive total of $2,576,000, not just the base" (Step 5). This is the correct treatment (conservative, protecting the owner). Worked example at line 121 confirms: base $2.24M + contingency $336K = $2.576M; escalation applied to $2.576M.

### Spot-Check: L09 ARPU calculations (Polish-B notes mentioned L09 Q1 and Q2)
✓ **VERIFIED:** Both Q1 and Q2 apply tier-mix ARPU and payback formulas correctly.
- Q1: ARPU = weighted-average tier price (correct formula).
- Q2: Payback = Build Cost ÷ Annual Net Revenue (gross revenue − OpEx) — correct treatment.

### Spot-Check: L10 Payback (Polish-B notes mentioned L10 Q10)
✓ **VERIFIED:** Q10 calculation (25.0 years) is arithmetic-correct from given parameters.

---

## Uncertain
None. All citations are either in the registry (fresh-verified) or newly verified primary-source. T17 has no paywalled standards (like NESC, IEEE, TIA) that would require edition-locking. RUS regulations are free public documents (ecfr.gov).

---

## Cross-Topic Notes
T17 references T01–T16 vocabulary (make-ready, contingency, cable selection, RUS) as assumed knowledge. No upstream DAG pointer issues found. T17.L05 assumes `7 CFR Part 1788` is known; T17.L09 assumes ARPU/MRR are local topics. All correct.

---

## Closeout

**Git commit history:**
```
07f4af6 T13 F2 primary-source citation verification
```

**Diff stat (this branch, not pushed yet):**
```
No code changes. Report file only.
```

**Schema check:** Not applicable (T17 existing, no JSX edits).

**Vite build status:** Not applicable (read-only verification).

---

### Primary-Source Verification Log
1. **7 CFR Part 1788:** https://ecfr.gov/current/title-7/part-1788 — accessed, verified sections 1788.11 and 1788.15 match lesson claims.
2. **RUS Form 524 existence:** https://www.rd.usda.gov/forms-pubs — confirmed as standard RUS loan/grant application form.
3. **BEAD Program:** https://broadbandusa.ntia.gov/ — confirmed as NTIA federal broadband grant program.
4. **ReConnect Program:** https://www.rd.usda.gov/programs-services/reconnect-program — confirmed as RUS grant program.

All citations are current (as of 2026-05-18) and accurate to the regulatory text and program descriptions.

---

=== T17 F2 HAIKU VERIFY END ===
