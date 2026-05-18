# T17 Research Brief R-1 — Project Estimation & Revenue
**Framing:** Primary-source skeptical — every cost data point must cite a real source; reject unsourced medians.
**Date:** 2026-05-18
**Status:** COMPLETE

---

## Topic Scope

T17 covers the full project estimation and revenue cycle for OSP fiber:
- How to build a construction cost estimate from first principles (not from national medians)
- Aerial vs. underground cost components and productivity modeling
- Contract types (lump-sum, T&M, T&M-NTE, GMP, unit-price)
- Change orders — what triggers them, how to price them, how to avoid surprises
- Contingency and escalation — how much, why, and which is which
- RFP / RFQ / BOM — procurement documents and what they contain
- CPHP vs. CPHC vs. CPHFS — the FTTH KPIs that matter and how they are computed
- Revenue modeling basics (take rate, ARPU, IRR concepts at a lay level)
- RUS program budgeting constraints and form requirements
- Bill of Materials discipline

**Prerequisites (per course-catalog.js):** T01, T05, T06, T08, T10, T16
**Teaching position:** 17 of 22
**Target lesson count:** 10

---

## DAG Vocabulary Check — What Is Already Introduced

The following terms are in the DAG from prerequisite topics and can be assumed (vocabulary_assumed) in T17:

**From T01 (Fundamentals):** splice matrix, route, span, fiber count, GPON, OLT, CMTS, FDH, passthrough, as-built, topology
**From T05 (NESC & Pole Loading):** make-ready, pole loading, NESC clearance, down-guy, sag, tension, span length, wire attachment fee, joint-use pole
**From T06 (OSP Design UG):** bore, directional drill, conduit, innerduct, handhole, vault, manholes, direct-bury, open-cut, pavement restoration, restoration bond, trench
**From T08 (Make-Ready):** transfer cost, replacement cost, pole contact process, attachment application, OTMR, attachment fee, joint-use agreement, overlashing
**From T10 (OSP Construction):** crew-day, production rate, crew mobilization, utility locate, 811 ticket, subcontractor, pre-construction meeting
**From T16 (As-Built):** Form 219, Form 1755-A, unit of property, 47 CFR Part 32 plant account, capitalized plant cost, close-out package, reconciliation

**Key terms T17 MUST introduce** (not in DAG yet):
- unit cost (construction)
- labor burden rate
- material cost (installed)
- aerial cost per foot (CPFT aerial)
- underground cost per foot (CPFT UG)
- productivity (crew-day output)
- lump-sum contract
- T&M contract (Time and Materials)
- T&M-NTE contract (not-to-exceed)
- GMP contract (Guaranteed Maximum Price)
- unit-price contract
- RFP (Request for Proposals)
- RFQ (Request for Quotations)
- BOM (Bill of Materials)
- change order
- construction contingency
- cost escalation
- CPHP (Cost per Home Passed)
- CPHC (Cost per Home Connected)
- take rate
- ARPU (Average Revenue per User)
- direct cost
- indirect cost / overhead
- mobilization cost
- scope of work (SOW)

---

## Proposed 10-Lesson Structure

### L01 — The Estimating Mindset: Why National Medians Lie
- What an estimate is (and is not): an educated prediction, not a price
- Why cost data ranges 3–15× for the same line item depending on geography, terrain, density
- The FBA/Cartesian annual FTTH report: useful ceiling, not a bid input
- First principle: always start from your last 3 comparable jobs in the same geography
- vocabulary_introduced: `unit cost (construction)`, `cost per foot (CPFT)`, `scope of work (SOW)`, `direct cost`, `indirect cost`

### L02 — Aerial vs. Underground Cost Components
- Breaking down an aerial estimate: strand + fiber + lashing + hardware + pole attachment fees + make-ready allocations + labor
- Breaking down an underground estimate: conduit + bore cost + pull + handholes + restoration + labor
- Rule of thumb: underground typically 3–5× aerial in comparable terrain (field consensus)
- When aerial becomes expensive: heavy make-ready, pole replacement, pole owner delay
- vocabulary_introduced: `aerial cost per foot (CPFT aerial)`, `underground cost per foot (CPFT UG)`, `labor burden rate`, `material cost (installed)`, `mobilization cost`

### L03 — Productivity Modeling: The Real Driver
- Why productivity (crew-day output) matters more than unit cost for schedule and budget
- Aerial productivity benchmarks: feet/crew-day for strand + lash, aerial splicing, ADSS
- Underground productivity benchmarks: bore ft/day (consolidated vs. fractured rock), directional drill setup + pull
- Productivity modifiers: terrain, traffic control, utility density, equipment condition
- vocabulary_introduced: `productivity (crew-day output)`, `crew-day`, `bore production rate`, `aerial lashing rate`

### L04 — Bill of Materials: What Goes in a BOM
- Structure of a BOM: item description, quantity, unit, unit cost, total cost, account code
- Tier 1 material items for aerial OSP: cable footage, strand footage, closures, hardware, lashing wire, connectors
- Tier 1 material items for UG OSP: cable footage, conduit footage, innerduct, handholes, boring pipe, tracer wire, restoration materials
- Common BOM errors: forgetting slack (8–12% cable overage), forgetting test-fiber footage, under-estimating bore pipe count
- vocabulary_introduced: `BOM (Bill of Materials)`, `material quantity take-off`, `slack allowance (BOM)`

### L05 — Contract Types: Matching Contract to Scope Certainty
- Lump-sum: fixed price, contractor assumes scope risk — best when route is fully staked and located
- T&M: hourly + material markup — best for exploratory or hard-to-define scope
- T&M-NTE: T&M with a not-to-exceed ceiling — most common compromise for OSP projects
- GMP: Guaranteed Maximum Price — contractor shares upside/downside within an agreed range
- Unit-price: price per foot / per splice / per handhole — flexible and transparent; common in RUS competitive bid
- RFP vs. RFQ: RFP = open-ended proposals; RFQ = defined scope, compare prices
- vocabulary_introduced: `lump-sum contract`, `T&M contract (Time and Materials)`, `T&M-NTE contract`, `GMP contract (Guaranteed Maximum Price)`, `unit-price contract`, `RFP (Request for Proposals)`, `RFQ (Request for Quotations)`

### L06 — Change Orders: Anatomy and Prevention
- What triggers a change order: scope change, unforeseen conditions (rock, conflicting utility), owner-directed change, error/omission in design
- How change orders work on each contract type (lump-sum vs. T&M)
- Change order markup structure: direct cost + overhead (typically 10–15%) + profit (typically 5–10%)
- Prevention: thorough staking, pre-construction utility locate quality, clear scope in the SOW
- vocabulary_introduced: `change order`, `changed condition clause`, `directive letter`, `change order markup`

### L07 — Contingency and Escalation: Two Different Risks
- Construction contingency: covers scope uncertainty and unforeseen conditions — set at project award, consumed by change orders
- Cost escalation: covers future price increases in labor and materials — separate from contingency
- Book standard: 5% contingency (low-risk, well-defined scope). Field reality for OSP: 10–15% is the floor; rocky terrain or urban cut-and-cover can justify 20%+
- Escalation clauses in multi-year contracts: what they are and why they matter post-2021
- vocabulary_introduced: `construction contingency`, `cost escalation`, `escalation clause`, `contingency draw-down`

### L08 — CPHP, CPHC, and FTTH KPIs
- CPHP: what it is, how it is calculated, why it is the standard build-phase metric
- CPHC: derived from CPHP and take rate — the metric that determines financial viability
- CPHP vs. CPHC confusion: they are NOT the same metric and must NEVER be conflated
- Take rate: what it is, how it is estimated (service area penetration assumptions), how it affects CPHC
- Key FTTH operational KPIs: homes passed per crew-day, drops per crew-day, splices per crew-day, splice loss average
- vocabulary_introduced: `CPHP (Cost per Home Passed)`, `CPHC (Cost per Home Connected)`, `take rate`, `homes passed`, `homes connected`

### L09 — Revenue Modeling and ARPU Basics
- ARPU: what it is, what "average" masks (tier mix), why it matters for ROI modeling
- Simple IRR concept for a lay audience: what does the project need to earn back to justify the build cost?
- Payback period vs. IRR: the two questions a borrower asks
- RUS program revenue projections: what RUS requires in the loan/grant application vs. what the field team actually monitors
- vocabulary_introduced: `ARPU (Average Revenue per User)`, `payback period`, `subscriber tier mix`, `IRR (Internal Rate of Return) — lay concept`

### L10 — T17 Capstone Quiz
- 15 questions integrating all L01-L09 material
- Emphasis on applied scenarios: classify a contract type, calculate CPHP from given data, identify a change order trigger, build a BOM line item

---

## Key Factual Anchors (Primary Sources)

| Claim | Source | Caveat |
|---|---|---|
| Aerial cost range $4–9/ft clean poles | FBA/Cartesian 2023 FTTH Deployment Survey | Planning reference only; regional variance ±50% |
| Aerial make-ready cost $12–25+/ft | FBA/Cartesian 2023 + NC Broadband Matters 2021 | Varies widely by jurisdiction |
| Underground bore $8–40+/ft | FBA 2023/2024 reports + field community | Rock/urban = top range; rural open-cut = lower |
| Labor = 60–80% of deployed cost | FBA 2023 | Varies by region/union presence |
| 10–15% contingency floor | Chuck Bowser (Let's Talk Cabling, RCDD) + Procore OSP estimating library | Up to 20% justified in rocky terrain |
| T&M-NTE most common OSP compromise | Procore library + AIA A102 cost-plus contract form | Not a regulatory standard — field practice |
| CPHP formula: total build cost ÷ homes passed | FTTH Council standards; standard industry definition | Denominator must be HOMES PASSED not HOMES CONNECTED |
| CPHC formula: CPHP ÷ take rate | Derived from CPHP definition | Take rate must be expressed as a decimal (0.40 = 40%) |

---

## Authoring Guards

1. **No specific dollar figures as "the" number.** Every cost range must be cited and framed as a planning reference with documented variance drivers. Never present "$6.49/ft aerial" as a target price.

2. **CPHP ≠ CPHC** — reinforce this distinction in L08 every way possible. It is the most common metric confusion in OSP financial modeling.

3. **RFP is not a contract type.** Module11's existing callout on this is correct and must survive migration. RFP is a procurement vehicle; the resulting contract is lump-sum, T&M, or another type.

4. **Contingency vs. escalation.** Book standard says 5%; OSP field reality is 10–15% minimum for any project with bore or make-ready uncertainty. Present both and explain when each applies.

5. **IRR at lay level only.** Carter's audience is field-experienced, not financial analysts. Explain IRR conceptually (what return does this project need to justify the investment?) without formulas or spreadsheet walkthroughs. Keep it qualitative and practical.

6. **DAG prerequisite invariant.** Verify all vocabulary_assumed terms are confirmed in prerequisite lesson files before authoring starts. Known safe terms: unit cost is introduced in T17.L01 (not yet in DAG); CPHP in T17.L08; take rate in T17.L08; BOM in T17.L04.

---

## Module11 Source Content Migration Map

Module11_RevenueEstimation.jsx has 8 sections worth migrating:
- §11.1 Why medians lie → L01 (FOUNDATIONS section)
- §11.2 Cost data by scenario table → L01/L02 (aerial vs. UG table)
- §11.3 Aerial breakdown → L02
- §11.4 Splice costs + productivity → L03
- §11.5 Contract types → L05 (including the RFP≠contract callout — KEEP verbatim logic)
- §11.6 Contingency and change orders → L06 + L07
- §11.7 CPHP vs CPHC → L08 (including the CPHP≠CPHC editorial mandate)
- §11.8 Revenue KPIs → L08/L09

Module11 is high-quality source material. Migrate the structure and factual anchors; expand with worked examples, quiz questions, and per-lesson Flashcards per the standard T17 lesson schema.

---

## Unresolved Questions for R-2

1. **L09 IRR depth:** Should L09 include a simple IRR worked example (e.g., $5M build, 500 homes × $60 ARPU, payback = X years) or stay entirely qualitative? R-2: evaluate whether a simple numeric example aids understanding without implying financial advice.

2. **RUS form requirements for budget submission:** What forms does RUS require for a project budget in a telecommunications loan application? Verify whether this is covered in Module11 or needs research.

3. **Unit-price contract prevalence in RUS competitive bid:** Is unit-price the dominant contract type for RUS-funded telecom construction? R-2: check 7 CFR Part 1788 procurement requirements for RUS borrowers.

=== T17 RESEARCH BRIEF R-1 END ===
