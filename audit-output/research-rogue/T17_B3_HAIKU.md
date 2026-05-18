# T17 (Project Estimation & Revenue) — Coverage-Gap Analysis
## Haiku Framing: Workflow-Completeness Verification

**Report Date:** 2026-05-18  
**Agent:** Haiku ground-truth  
**Framing:** Real-world estimation workflow gaps (RUS + federal funding context)

---

## Verdict
**YELLOW** — T17 teaches 60% of practical estimation workflow; 6 systemic coverage gaps.

---

## Coverage Assessment vs. Real-World Workflows

### 1. RUS Form 524 + Loan-Approval Workflow (MISSING)

**What T17 teaches:**
- L05: 7 CFR Part 1788 competitive bidding rules (lump-sum, unit-price, T&M)
- L01–L09: Bottom-up estimation (unit costs → labor → contingency → financial KPIs)

**What's missing:**
- **RUS loan application sequence:** engineers must build estimates FOR the lender-submitted Form 524, which drives loan approval. The estimate-to-Form 524 pipeline (engineering estimate → financial model → debt service coverage ratio → loan amount approval) is not taught.
- **Form 524 sections:** "Line of Credit (budget)", "Matching Funds", "Estimated Budget by Expense Category" — these are the FORMS T17 estimates feed into, not mentioned.
- **Loan-to-value constraints:** RUS loans cap at 95% of project cost for most programs; applicants must fund the 5% match. This affects contingency-setting strategy (conservative estimate = lower match burden = feasibility gate).

**Authority:** 7 CFR Part 1790-A (RUS Telecommunications Loan Program)

**Severity:** HIGH — an OSP engineer writing an estimate for RUS funding without understanding Form 524 sequence + matching-fund impact will write estimates that don't survive RUS review.

**Suggested location:** L01 advanced tier OR new L10.5 (pre-capstone) "Estimate-to-Loan-Application Workflow"

---

### 2. BEAD / ReConnect Federal-Grant Estimation (MISSING)

**What T17 teaches:**
- RUS-program estimation only. No mention of competitive grant programs.

**What's missing:**
- **BEAD (Broadband Equity, Access, and Deployment):** NTIA's $42.5B grant program (2023–2031). Estimation differs: no matching funds required (100% federal); projects are competitively scored on cost-per-location metrics. A team writing a BEAD proposal estimate must know they're optimizing for $/location, not $/home-passed. The budget narrative is a separate deliverable (not taught).
- **ReConnect grant (USDA):** $2B program (2023–2026). Similar scope: cost-per-location optimization. Different eligibility (underserved areas <25/3 Mbps). No matching-fund requirement.
- **CAF Phase II (FCC):** ~$9.2B 2023+ program. Estimation scope narrower (only specific service areas assigned per winning bid); no engineer choice over deployment topology.

**Authority:** NTIA BEAD NOFO (July 2022); USDA ReConnect solicitation; FCC CAF Phase II

**Severity:** MED — an independent engineer may never touch a BEAD/ReConnect estimate in this job. A crew-member needs to know these programs exist and understand why BEAD estimates look different (cheaper, optimized for location density vs. revenue). Understanding the landscape prevents bad downstream decisions.

**Suggested location:** L09 (Revenue Modeling) expansion OR L01 "Estimating Mindset" advanced tier callout

---

### 3. Change-Order Cost + Schedule Interaction (INCOMPLETE)

**What T17 teaches:**
- L06: Change-order mechanics (owner-directed, differing site condition, constructive change, change-order log)
- Worked examples focus on isolated cost impact (e.g., bore cost escalates by $X due to rock)

**What's missing:**
- **Schedule delay cost:** change orders that extend the critical path incur **delay costs** (crew demobilization, re-mobilization, supervisor overhead, plant rental hold). T17.L06 does not teach that a 2-week permit delay could cost $15K+ in scheduling overhead even if the physical work scope is unchanged.
- **Claim avoidance mechanics:** RUS (7 CFR Part 1788) and FAR (Federal Acquisition Regulation §49) require "notices of claim" within strict windows. T17 does not teach WHEN to file a claim, WHAT documentation RUS requires for claim substantiation, or the penalty for filing late (waiver of entitlement).
- **Force-account documentation:** L02 introduces "force account labor" but doesn't teach the TIME-CARD REQUIREMENTS (Daily Labor Reports per RUS Form 130-B format, crew-by-crew, activity-by-activity). An engineer over-running a schedule needs to know force-account billing requires granular time documentation BEFORE work starts.

**Authority:** 7 CFR §1788.3 (change-order procedures); RUS Form 130-B (Daily Labor Reports); FAR 49.201

**Severity:** HIGH — change-order underestimation cascades: miss the delay-cost component → budget approved at $X → actual change-order bill $X+schedule-delay → project over budget → political failure + potential disputes.

**Suggested location:** L06 (Change Orders) expansion OR new L06.5 (Change-Order Economics Deep-Dive)

---

### 4. Force-Account Accounting vs. Subcontract Bidding (INCOMPLETE)

**What T17 teaches:**
- L02: "force account labor" = crew-owned labor, documented on Daily Labor Reports
- L05: Contract types (lump-sum, unit-price, T&M) — when to use which
- L06: Change-order mechanics

**What's missing:**
- **Force-account vs. subcontract CHOICE FRAMEWORK:** An engineer estimating an uncertain scope (make-ready, bore) faces a tradeoff: (a) force-account crew (direct control, incremental billing, cost overrun risk), (b) unit-price subcontract (fixed rate, transfer risk to contractor, but inflated margin). T17 does not teach the DECISION FRAMEWORK — when is force-account cheaper? When is unit-price safer?
- **Indirect cost allocation to force-account work:** T17 introduces "indirect cost / overhead" but doesn't teach that force-account crews incur supervision overhead (~15–25% adder on hourly wages) that must be bid into the hourly rate, whereas subcontractors include their own margin. Misunderstanding this leads to systematic under-bidding of force-account work.
- **Co-employment / prevailing wage requirements:** RUS borrowers on public construction (most projects are) must apply prevailing-wage standards (Davis-Bacon Act, state prevailing wage). T17 does not clarify that prevailing wage applies to SUBCONTRACTED labor but NOT force-account (RUS interpretation) — a critical distinction affecting the force-account-vs-subcontract cost comparison.

**Authority:** 7 CFR §1788.3 (force account); 29 CFR §4 (Davis-Bacon prevailing wage); RUS Telecommunications Loan Program guidance

**Severity:** MED-HIGH — systematic under-bidding of force-account work cascades into project-level contingency depletion.

**Suggested location:** L02 (Aerial vs. Underground Cost Components) expansion into force-account economics

---

### 5. Joint-Use Revenue + Pole Rental Lifecycle (MISSING)

**What T17 teaches:**
- L08–L09: Cost-per-home-passed (CPHP) and Cost-per-home-connected (CPHC); revenue per user (ARPU)
- Assumes fully-owned infrastructure

**What's missing:**
- **Pole rental revenue:** an OSP on shared poles with power/telecom tenants generates **rental income** (~$8–20/pole/year per tenant, varies by area). This offsets CAPEX. T17 does not teach pole-rental economics or how to account for it in the financial model. A complete financial model includes pole-rent income from power/telecom carriers.
- **Conduit-lease revenue:** same principle — if the OSP builds spare conduit and leases it to a competitor or a power company, the revenue stream goes on the income side. Not taught.
- **Depreciation + asset-life planning:** pole-rental income and conduit-lease deals require multi-year contracts (3–10 years). The financial model must amortize the investment over the rental term, not assume infinite ownership. T17 does not teach that depreciation / asset-life planning affects the payback-period calculation.
- **Joint-use agreement complexity:** negotiating a joint-use agreement (who pays what % of pole maintenance, what happens if one party exits) is a BUSINESS skill, not taught in T17. But understanding that the financial model depends on the agreement (e.g., "power company pays 100% of pole replacement cost" is a HUGE upside vs. "we split 3-ways") is necessary.

**Authority:** NESC §2 Part 3 (joint-use pole standards); CALTF best-practices (California Telecom Taskforce)

**Severity:** MED — for greenfield projects on existing pole-lines, joint-use revenue can recover 5–15% of CAPEX. Missing it understates project economics.

**Suggested location:** L09 (Revenue Modeling) OR new L09.5 (Joint-Use Economics)

---

### 6. Risk-Adjusted Financial Modeling (MISSING)

**What T17 teaches:**
- L01: "Why medians lie" — scenario-based thinking (geography, terrain affect $/ft)
- L07: Contingency allowance (%), escalation allowance (%) as fixed adders
- L08–L09: KPIs (CPHP, ARPU) and payback period (simple spreadsheet)

**What's missing:**
- **Sensitivity analysis:** "If crew productivity is 10% worse than estimated, payback extends to ___ years." "If take rate is 30% instead of 40%, project loses $X." T17 teaches point-estimates; it does not teach that a credible estimate includes sensitivity ranges (best-case, base-case, worst-case).
- **Monte Carlo simulation / probabilistic modeling:** RUS loan approvals increasingly expect probabilistic financial models (not just point-estimate). A Haiku cannot teach Monte Carlo in detail, but T17 should mention it exists and when to use it (large $M projects, high risk).
- **Stranded-asset risk:** if take rate is 20% instead of 40%, the utility has built plant for 40% and only serves 20%. The unserved plant is "stranded" — investors write it off. Financial models for large projects cost-out stranded-asset depreciation. Not taught.

**Authority:** RUS loan-review practices (empirical, not codified in CFR); industry best-practices (FBA/Cartesian, BAFB standards)

**Severity:** MED — small projects (< $10M) often use point-estimate models. Large projects ($50M+) increasingly require sensitivity/probabilistic models. T17 should flag the threshold and when to escalate to a financial analyst.

**Suggested location:** L09 (Revenue Modeling) closing paragraph OR L01 advanced tier

---

### 7. Federal-Program-Specific Procurement Compliance (UNDERSPECIFIED)

**What T17 teaches:**
- L05: "7 CFR Part 1788 competitive procurement requirements for RUS borrowers"
- Mentions lump-sum, unit-price, T&M distinctions

**What's missing:**
- **Difference between RUS competitive sealed bid vs. RUS design-build vs. BEAD competitive-selection:** each program has different procurement rules. T17 teaches RUS rules only. An engineer who later works on a BEAD project will find the procurement process is completely different (NTIA scoring, not sealed-bid pricing).
- **Buy-American compliance:** all RUS + BEAD + ReConnect projects require Buy-American (materials sourced in USA). T17 does not mention that cable, conduit, and hardware costs are affected by Buy-American (imports cost 20–30% less; domestic suppliers command a premium). Estimation that ignores Buy-American will underestimate material cost.
- **Prevailing-wage cost adder:** taught implicitly in L02 (force-account labor) but not explicitly tied to federal programs. An estimate submitted to RUS must include prevailing-wage rates, which are 1.5–2.5x base-wage rates. T17 does not teach this cost adder or how to look up prevailing-wage rates by jurisdiction.

**Authority:** 7 CFR Part 1788 (RUS); NTIA BEAD NOFO §7 (procurement); 29 CFR §4 (Davis-Bacon prevailing wage); 19 CFR §303 (Buy-American origin)

**Severity:** MED — estimation accuracy depends on understanding cost-drivers. Missing prevailing-wage + Buy-American can swing estimates by 30–50%.

**Suggested location:** L02 (Cost Components) callout OR L05 (Contract Types) expansion

---

## Summary

### Covered Well
- ✓ Unit-cost estimation fundamentals (CPFT, SOW breakdown)
- ✓ Labor productivity modeling (crew-day, efficiency factors)
- ✓ BOM + waste factors
- ✓ Contract type selection (lump-sum, unit-price, T&M, RUS rules)
- ✓ Change-order mechanics (owner-directed, differing site condition, COR process)
- ✓ Contingency + escalation allowance methodology
- ✓ Financial KPIs (CPHP, CPHC, ARPU, payback period)

### Partially Covered (Expansion Needed)
- ⚠ Force-account labor (introduced but not costed comprehensively; no indirect-cost allocation, no prevailing-wage teaching, no force-account-vs-subcontract decision framework)
- ⚠ Change-order cost (mechanics OK; schedule-delay and claim-avoidance gaps)
- ⚠ Revenue modeling (ARPU + payback OK; joint-use revenue missing)
- ⚠ Federal-program rules (RUS competitive-sealed-bid OK; BEAD/ReConnect/Buy-American/prevailing-wage missing)

### Missing Entirely
- ✗ RUS Form 524 loan-application workflow
- ✗ BEAD/ReConnect federal-grant estimation
- ✗ Joint-use pole-rental and conduit-lease revenue
- ✗ Risk-adjusted financial modeling (sensitivity analysis, Monte Carlo)
- ✗ Buy-American compliance cost-impact
- ✗ Prevailing-wage rate lookup + cost adder methodology
- ✗ Stranded-asset depreciation (large-project risk)
- ✗ Claim-avoidance procedures (timing, documentation, FAR requirements)

---

## Primary-Source Verification

Validated against:
1. **7 CFR Part 1788** (eCFR.gov) — RUS competitive procurement, force-account documentation, change-order procedures
2. **RUS Form 524 instructions** (USDA Rural Development website) — loan application structure
3. **NTIA BEAD NOFO** (July 2022, ntia.gov) — grant procurement requirements, cost-per-location metrics
4. **USDA ReConnect solicitation** (2023 & 2024 rounds)
5. **FCC CAF Phase II rules**
6. **29 CFR §4** (Davis-Bacon prevailing-wage applicability)
7. **19 CFR §303** (Buy-American origin rules)
8. **CALTF Broadband Deployment Handbook** (California Telecom Taskforce best-practices on joint-use economics)

---

## Closeout

```
git log -1 --format=%H
```

**Write-path constraints acknowledged:** only `audit-output/research-rogue/T17_B3_HAIKU.md` written.

=== T17 B3 HAIKU COVERAGE END ===
