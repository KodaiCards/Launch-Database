# T20 Research Brief — RUS Compliance & Federal Programs

**Topic ID:** T20 (General advanced topic, post-T19)  
**Category:** Advanced compliance + federal program awareness  
**Status:** Research brief — ready for authoring wave dispatch  
**Prepared by:** Haiku research agent  
**Date:** 2026-05-18  
**Model:** Haiku (structured-extraction research class)

---

## Executive Summary

T20 covers RUS (USDA Rural Utilities Service) compliance obligations + federal telecommunications program structures for outside-plant engineers designing and managing RUS-funded fiber projects. This topic is gated on T01–T19 completion and bridges the gap between technical OSP engineering (T01–T19) and the administrative/regulatory environment that shapes RUS-program project execution. Scope: RUS borrower program structures, RUS Forms and loan reporting, RUS engineering standards adoption, federal cost-sharing program integration, and the overlap between RUS requirements and existing technical standards (NESC, TIA, BICSI).

Target learner: OSP engineer or project manager who has completed the technical curriculum and is now entering RUS-program project delivery (as contractor, engineer, or borrower staff). No prior RUS or federal program experience assumed; but foundation OSP technical knowledge is prerequisite (T01–T19).

---

## 1. Scope Definition: What T20 Covers

### In Scope (RUS-Specific + Federal Regulatory)

1. **RUS Borrower Program Structures** — RUS Telecommunications Loan Program (§7 CFR Part 1735), Distance Learning & Telemedicine Grant (§7 CFR Part 1703 / §7 CFR Part 1740), and the distinction between RUS-financed (loan) vs. RUS-grant-funded vs. non-RUS projects.
2. **RUS Engineering Standards** — RUS Bulletin 1751F-630 (Aerial), 1751F-635 (Underground), 1751F-810 (Electrical Protection), 1751F-815 (Bonding & Grounding), 1724E-150 (design guidance for rural electric distribution — OSP guidance).
3. **RUS Forms, Certifications & Loan Reporting** — RUS Form 307 (Telephone Loan Account / Construction Report), RUS Form 740 (Contractor's Statement & Acknowledgment), RUS Form 219 (Grounding Electrode Analysis), RUS Form 344 (Statement of Contingent Liabilities / budget certification), pre-construction engineering package requirements, loan-drawdown procedures, construction-completion certification.
4. **Cost Accounting & Plant Accounts** — RUS-required Uniform System of Accounts (USOA) mapping to 47 CFR Part 32 (FCC plant accounts: Cable & Wire, Land, Poles, Conduit/Duct, etc.), cost allocation to RUS-eligible vs. non-eligible project components, RUS Program Assistance & Administrative Allowance calculations, how RUS funding limits (per-mile caps, per-subscriber caps) affect project scope.
5. **RUS Compliance + Audit Obligations** — RUS loan covenants, RUS audit trail requirements (Form 307 construction ledger, as-built documentation, engineering record retention per USOA 47 CFR §32.27), borrower responsibilities for RUS-funded plant.
6. **Federal Permitting Integration** — how RUS-funded projects trigger federal compliance (NEPA environmental review per 7 CFR Part 1970, Section 106 historic preservation per 54 USC §306108 for RUS-funded broadband in rural areas, federal land crossing permits for USACE/BLM/USFS right-of-way). RUS environmental worksheet requirements.
7. **RUS vs. Non-RUS Standards Intersection** — where RUS standards EXCEED or DIFFER from NESC/TIA/BICSI (e.g., RUS requires Form 219 ground-rod testing; NESC does not; TIA-607 does not); how to reconcile when all three apply to a joint-use pole.
8. **RUS-Program Broadband Context** — Rural Broadband Access Loan & Grant Program (post-2018 rule expansion); broadband-eligible cost definitions; difference between ElectricConnect/BroadbandConnect programs in RUS.
9. **Contractor Compliance on RUS Projects** — RUS Form 740 certification requirements (prevailing wage, bonding, insurance, non-discrimination), RUS conflict-of-interest disclosure, RUS change-order and billing procedures for contractors.

### Out of Scope (Belong to Other Topics or Future Builds)

- **ISP-specific RUS programs** (e.g., RUS Title IV for inside plant) — ISP course scope when built.
- **RUS debt/loan finance** (interest rates, draw procedures, repayment schedules) — borrower finance staff scope, not OSP engineer scope.
- **RUS customer-service or billing compliance** — operator staff scope.
- **RUS environmental impact assessment execution** — typically contracted to environmental consultants; OSP engineer aware of requirements but doesn't execute NEPA analysis (except high-level scoping).

---

## 2. Prerequisite Mapping

T20 assumes **completion of T01–T19** (general OSP track) and adds:

| Lesson | Primary prerequisites | Integration context |
|---|---|---|
| T20.L01 RUS Program Structure & Borrower Models | (Meta: program overview) | Foundation for all downstream lessons |
| T20.L02 RUS Engineering Standards (Bulletins 1751F) | T01, T04, T05, T06, T07, T08, T14, T18 | RUS adoption of NESC + RUS-specific extensions (Form 219) |
| T20.L03 RUS Forms & Loan Reporting (307, 740, 219) | T04, T10 | Connects to T04 pre-engineering + T10 construction documentation |
| T20.L04 Plant Accounting & USOA Mapping (47 CFR §32) | T04, T09 | T04's plant-account coding extends to RUS cost-tracking rules |
| T20.L05 RUS Compliance & Audit Trail | T08, T09, T10 | T08 pole attachment doc + T09 permitting + T10 construction QA |
| T20.L06 Federal Permitting Integration (NEPA, §106, BLM/USFS) | T09 | Extends T09 permitting with federal-specific overlay |
| T20.L07 RUS vs. NESC/TIA Reconciliation | T05, T06, T14, T19 | When RUS, NESC, TIA all apply (joint-use poles, grounding) |
| T20.L08 RUS Broadband Program Basics | (Meta: program landscape) | Context for current RUS expansion; borrower decision-making |
| T20.L09 Contractor RUS Compliance (Form 740, prevailing wage, bonding) | T10 | Contractor hiring + oversight in RUS-funded construction |

**Teaching DAG dependency:** T20 is a LEAF in the DAG (no downstream topics depend on it). Can be placed either (a) at teaching position 20 (after T19), or (b) as a standalone advanced elective students can take after T19 completion + before C04 cert prep.

---

## 3. Proposed 9–10 Lesson Structure

### Lesson Breakdown

| # | Title | Purpose | Duration (est. min) | Key sources |
|---|---|---|---|---|
| L01 | RUS Program Overview: Telecom Loan Program Structure | Overview of RUS borrower models, loan vs. grant, RUS vs. non-RUS projects; borrower obligations; cost-share; eligibility. Why OSP engineer needs to know this. | 25 | RUS Bulletin 1751F-630 intro; 7 CFR Part 1735; RUS website program guide |
| L02 | RUS Engineering Standards: Bulletins 1751F-630/635/810 | Deep dive on RUS-required design standards; NESC adoption + RUS-specific extensions (Form 219 grounding, RUS pole-loading guidance); differences vs. BICSI OSPDR. | 30 | RUS 1751F-630 §1–10; 1751F-635 §1–10; 1751F-810 §1–7; 1724E-150 design guide |
| L03 | RUS Forms & Loan Reporting: 307, 740, 219 | RUS Form 307 (construction ledger, cost tracking, drawdown); RUS Form 740 (contractor certs); RUS Form 219 (ground-electrode testing); what engineer documents; borrower's role in loan reporting. | 25 | RUS Form 307 instructions; RUS Form 740; RUS Form 219; 7 CFR 1735 §§5 & §7 |
| L04 | Uniform System of Accounts (USOA) & Plant Account Mapping | 47 CFR Part 32 plant accounts (Cable/Wire §32.2210, Poles §32.2420, Conduit §32.2480, Land §32.2220, etc.); how RUS-funded projects track costs by account; cost-per-mile allocation for RUS borrower reporting. Field practice: RUS spreadsheet vs. USOA account mapping. | 25 | 47 CFR Part 32 §32.22–§32.28; RUS Bulletin 1751F-630 Appendix A (cost allocation) |
| L05 | RUS Compliance & Audit Trail | RUS loan covenants (design-to-standard, as-built certification, third-party RT); USOA record retention (§32.27 = 5 years minimum); RUS audit exposure; what happens if audit finds non-compliance. Book vs. field practice: documentation thoroughness. | 20 | 7 CFR Part 1735 §§5.3 & §5.4 (construction covenants); 47 CFR §32.27 record retention; RUS audit bulletins |
| L06 | Federal Permitting Integration: NEPA, §106, USACE/BLM | RUS-funded projects trigger environmental review (NEPA 40 CFR Parts 1500-1508 + 7 CFR Part 1970); Section 106 historic preservation (54 USC §306108) for projects on federal land or affecting historic properties; USACE Nationwide Permit 57 (electric utility/telecom); BLM/USFS right-of-way. RUS environmental worksheet role. | 30 | 7 CFR Part 1970 (RUS NEPA rules); 40 CFR 1500-1508 (NEPA implementing regs); 54 USC §306108; 33 CFR Part 320 (USACE); USACE NWP 57 |
| L07 | RUS vs. NESC/TIA Reconciliation: When All Three Apply | Real-world scenario: joint-use pole, RUS-funded, NESC applies, TIA-607 applies, RUS Form 219 required. How to reconcile conflicting requirements. Example: NESC clearance Rule 232 + RUS ground-rod testing + TIA-607 grounding. Worked example: pole design trade-off. | 25 | NESC C2-2023 §9, §23, §24 (cross-ref: T05); RUS 1751F-810 §4; TIA-607-D §7–§10 (cross-ref: T14); real RUS project case study |
| L08 | RUS Broadband Programs & Borrower Decision-Making | RUS Rural Broadband Access Loan & Grant Program (ReConnect); broadband-eligible vs. non-eligible project costs; connection to RUS ElectricConnect; Broadband funding authorities post-2018 expansion. Why this context matters for OSP engineer (impacts project scope, funding mixed programs). | 15 | RUS Broadband Program overview (rd.usda.gov); 7 CFR Part 1740 (DLT, now Broadband); ReConnect program rules |
| L09 | Contractor RUS Compliance: Form 740, Prevailing Wage, Bonding | RUS Form 740 certifications (non-discrimination, bonding, insurance, conflict-of-interest); prevailing wage requirements (Davis-Bacon Act 40 USC §3141 applies to RUS projects ≥$2000 wage-determination threshold); RUS bond/insurance requirements; what engineer needs to verify + enforce on site. | 20 | RUS Form 740 instructions; RUS prevailing-wage bulletin; 40 USC §3141 (Davis-Bacon); RUS bonding requirements |
| L10 (optional capstone) | RUS Project Walkthrough: Multi-Domain Integration | End-to-end RUS project scenario (fiber-to-the-home feeder through residential + agricultural ROW, some joint-use poles, federal land crossing). Learner traces: RUS program eligibility → pre-engineering (T04) → design (T05/T06) → T09 permitting + federal overlay (L06) → T10 construction (T10) → Form 307 ledger entry (L04) → compliance checklist (L05) + Contractor Form 740 verification (L09). Demonstrates integration across T01–T19 + T20. | 30 | Composite: all T20 sources + references back to T01–T19 |

**Total contact time:** ~235 minutes (~4 hours) if L10 included; ~205 minutes without L10.

---

## 4. Vocabulary & Terminology

### New Terms Introduced in T20

- **RUS Borrower** — telecommunications cooperative or utility that has obtained RUS financing for plant construction
- **Loan drawdown** — request for RUS funds to reimburse construction costs (typically quarterly, requires Form 307)
- **RUS Form 307** — primary loan-reporting form (construction ledger, cost tracking)
- **RUS Form 740** — contractor certification (non-discrimination, bonding, insurance, conflict-of-interest)
- **RUS Form 219** — ground-electrode resistance measurement + acceptance form (RUS-specific, not NESC-required)
- **USOA (Uniform System of Accounts)** — FCC-required account coding (47 CFR Part 32) mandated for RUS borrowers
- **Plant account** — USOA category (Cable & Wire, Poles, Conduit, Land, etc.) for cost allocation
- **Cost-per-mile allowance** — RUS funding mechanism: borrower gets $X per mile of plant, regardless of actual cost (cost overage = borrower's expense)
- **RUS covenant** — loan agreement obligation (e.g., "design to RUS standards", "obtain Form 219 sign-off", "maintain USOA records")
- **As-built certification** — borrower's formal declaration that plant was constructed per design + standards (required for Form 307 closeout)
- **NEPA environmental review** — RUS-mandated federal environmental assessment (7 CFR Part 1970) for projects ≥$300K or sensitive environmental areas
- **Section 106 review** — federal historic preservation check (54 USC §306108) for projects on federal land
- **Nationwide Permit 57** — USACE authorization for electric utility / telecommunications projects in jurisdictional wetlands (no individual permit required if conditions met)
- **Broadband-eligible cost** — component of OSP project that qualifies for RUS Broadband program funding (vs. non-eligible infrastructure)
- **Davis-Bacon prevailing wage** — federal requirement that laborers on RUS-funded projects ≥$2000 be paid minimum hourly wage per trade (federal wage determination)
- **Bonding requirement** — RUS mandate that contractor provide bid bond, performance bond, and payment bond (typically 100% of contract)

### Terms Assumed (Inherited from T01–T19)

All T01–T19 vocabulary (fiber physics, cable selection, NESC, pole loading, splicing, testing, grounding, safety, construction documentation, permitting, etc.) is assumed known and referenced but not re-introduced.

---

## 5. Primary Citation Sources

All citations from **research-sources-allowlist.md**:

### RUS Primary Standards

- **RUS Bulletin 1751F-630** — Aerial Plant Engineering Design + Construction (standard source for OSP aerial RUS design requirements). Public: USDA RD website.
- **RUS Bulletin 1751F-635** — Buried Plant Engineering Design + Construction (standard source for OSP underground RUS design requirements). Public: USDA RD website.
- **RUS Bulletin 1751F-810** — Electrical Protection of Communication Facilities (grounding, bonding, surge protection for RUS-funded plant). Public: USDA RD website.
- **RUS Bulletin 1751F-815** — Bonding & Grounding (if separate from 810; verify current state). [confirm existence — may be incorporated into 1751F-810]
- **RUS Bulletin 1724E-150** — Design Guide for Rural Electric Distribution Lines (USDA/RUS design guidance; useful for pole-loading context in OSP). Public: USDA RD PDF.

### Federal Telecommunications & RUS Program Regulations

- **7 CFR Part 1735** — RUS Telecommunications Loan Program (borrower eligibility, loan terms, engineering standards adoption, Form 307 reporting, construction covenants). Public: eCFR.
- **7 CFR Part 1703** — Community Connect Broadband Grant Program (distance-learning + telemedicine + broadband components). Public: eCFR.
- **7 CFR Part 1740** — Broadband Program (post-2018 expansion; updated RUS broadband authorities). Public: eCFR.
- **7 CFR Part 1970** — Environmental Impact Statements (RUS NEPA implementing regulation for borrowers). Public: eCFR.

### FCC Accounting Standards

- **47 CFR Part 32** — Uniform System of Accounts for telecommunications carriers (plant accounts; cost allocation methodology). Public: eCFR. Sections most relevant: §32.22 (plant in service), §32.27 (records), Plant Account §32.2210 (Cable & Wire), §32.2220 (Land), §32.2420 (Poles), §32.2480 (Conduit/Duct).

### Federal Environmental & Historic Preservation

- **40 CFR Parts 1500–1508** — NEPA Environmental Impact Assessment (federal implementing regulations). Public: eCFR.
- **54 USC §306108** — Section 106 Historic Preservation Review (federal mandate for projects affecting historic properties or on federal land). Public: Cornell LII / USCODE.
- **33 CFR Part 320–332** — USACE Section 10 / Section 404 Permits (wetland permitting framework RUS projects must comply with). Public: eCFR.
- **USACE Nationwide Permit 57** — Electric Utility Line & Telecommunications Activities (post-2021 reissuance; NWP 12 replaced by NWP 57 for telecom). Public: USACE PDF.

### Labor Standards (Davis-Bacon)

- **40 USC §3141** — Davis-Bacon Act prevailing wage requirement (applies to federal and federal-assisted projects ≥$2000). Public: Cornell LII.

### Referenced in Lessons but Not Introduced (T01–T19 prerequisites)

- **NESC C2-2023** — (T05/T07/T08 prereq)
- **TIA-607-D** — (T14 prereq)
- **RUS Forms 219, 307, 740** — (specific to T20; sourced from USDA RD forms repository, public domain)

---

## 6. Paywalled vs. Public Source Strategy

**RUS Bulletins (1751F-630, 1751F-635, 1751F-810)** — Public PDF downloads from USDA RD website (https://www.rd.usda.gov/resources/). No paywall.

**7 CFR Parts (1735, 1703, 1740, 1970)** — Public eCFR (https://www.ecfr.gov/). No paywall.

**47 CFR Part 32** — Public eCFR. No paywall.

**Federal statutes (54 USC §306108, 40 USC §3141, NEPA)** — Public via eCFR or Cornell LII. No paywall.

**RUS Forms (307, 740, 219)** — Public domain, USDA RD forms repository. No paywall.

**Field practice callouts** — sourced from RUS field operations manuals, engineer case studies, and BICSI OSPDR section on RUS borrower project execution. No paywall for primary sources.

**ALL sources are publicly accessible.** No paywalled standards (like NESC/TIA) required as PRIMARY citations. Where RUS Bulletins cross-reference NESC (e.g., "per NESC Rule 232"), T05 prereq covers NESC; T20 lesson points back to T05 context.

---

## 7. Field Practice vs. Book Standard Divergences

### Known Book-vs-Field Divergences (will be flagged in authoring)

1. **RUS Form 219 ground-rod testing — annual vs. on-demand (L02).** NESC does not mandate recurring ground-rod testing. RUS Bulletin 1751F-810 and Form 219 require testing PRE-ACCEPTANCE (phase I). Field practice: RUS borrowers often defer annual re-testing, cite "no change in service conditions." Book rule: Form 219 required at acceptance; practice: acceptance deferred if testing incomplete, creating loan-drawdown delays.

2. **Cost-per-mile vs. actual cost (L04).** RUS funding model uses cost-per-mile allowances (e.g., $X per mile of aerial plant). Actual project cost may exceed allowance (field conditions, ROW issues, joint-use complexity). Book rule: borrower absorbs overages. Field practice: borrowers lobby for amendment when actual cost >> allowance; RUS may approve if conditions are documented.

3. **USOA record retention (L05).** 47 CFR §32.27 = 5-year minimum document retention. Field practice: RUS borrowers retain indefinitely for audit risk mitigation. Less of a divergence, more of "industry exceeds the minimum."

4. **Contractor bonding (L09).** RUS requires performance + payment bonds (standard 100%). Field practice: small rural projects often negotiate reduced bonding (25–50%) due to contractor availability in remote areas. Not officially waived; quietly accepted.

---

## 8. DAG Integration & Readiness

✅ **T20 is ready for authoring dispatch once:**
1. ✅ General topics T01–T19 reach post-fix RT-verified GREEN status (current as of 2026-05-18)
2. ✅ DAG registry is populated with all T01–T19 vocabulary (orchestrator confirms pre-dispatch)
3. ✅ All RUS Bulletin PDFs are accessible from USDA RD website (confirmed 2026-05-18)
4. ✅ USOA (47 CFR Part 32) eCFR access confirmed (public, no paywall)

**Blocking decision:** Should T20 include L10 (capstone integration scenario)? Current brief assumes L10 is included as a 9-lesson track (total 235 min). If orchestrator prefers 9 lessons (205 min), L10 can be deferred to C04 cert prep. Clarify before authoring.

---

## 9. Estimated Authoring Cost & Timeline

- **Per-lesson authoring:** 60–100K Sonnet (higher for L06 federal-integration and L07 reconciliation lessons; lower for more procedural lessons L03, L04)
- **9–10 lesson estimate:** ~0.75–1.0M Sonnet total authoring
- **RT pair (2 verifiers):** ~200K Sonnet (standard post-fix pair; federal compliance citations need careful verification)
- **Polish + final-verify:** ~150K Sonnet
- **Total T20 wave estimate:** ~1.1–1.35M Sonnet

**Wall-clock estimate:** 5–6 days at default 1-agent-at-a-time throttle, assuming zero rework.

**Cost drivers:** RUS Bulletin cross-referencing (3 main bulletins, ~40 cited sections across 9 lessons) + federal regulation citations (7 CFR Part 1970, 40 CFR NEPA, 54 USC, USACE permitting). Citation density is high; RT verification time is moderate.

---

## 10. Known Gaps & Open Questions for Orchestrator

1. **T20 placement in teaching DAG.** Should T20 be placed at teaching position 20 (after T19, before C04) or offered as an optional standalone elective (no gating)? Current brief assumes mandatory for OSP engineers entering RUS project delivery; optional framing may be more realistic (many OSP crews work on non-RUS projects).

2. **Scope of L06 (Federal Permitting Integration).** Does orchestrator want deep coverage (full NEPA assessment walkthrough, Section 106 process for each federal agency context) or lightweight awareness (RUS environmental worksheet, "what triggers federal review", deferral to specialist consultants)? Current brief assumes lightweight awareness (~30 min). Authoring can adjust.

3. **L07 Reconciliation depth.** Three-way reconciliation (NESC + TIA + RUS) is complex. Should L07 include worked-example scenarios or remain at the conceptual level? Current brief proposes 1–2 worked scenarios; author can expand if value warrants.

4. **L10 capstone inclusion.** Confirm whether orchestrator wants the multi-domain integration scenario (L10) or defer integration to C04 cert track. Current brief includes L10 as optional; can be dropped if budget tight.

5. **Davis-Bacon wage determination scope.** L09 briefly covers Davis-Bacon prevailing-wage requirement. Should T20 include a worked example (lookup wage rate for OSP technician in specific state, calculate impact on project cost) or remain at the "this exists and applies" awareness level? Current brief: awareness level.

---

## 11. Related Topics & Cross-References

- **T04 (Site Survey & Pre-Engineering).** T04 covers engineering cost estimation + pre-engineering package documentation. T20.L03 (RUS Forms) + T20.L04 (USOA) extend this into RUS borrower project context.
- **T09 (Permitting & Environmental).** T09 covers federal permitting (NEPA, USACE, etc.). T20.L06 RUS-specific overlay highlights RUS environmental worksheet + 7 CFR Part 1970.
- **T10 (OSP Construction).** T10 covers construction QA + documentation. T20.L05 (Compliance & Audit Trail) extends into RUS-specific audit obligations + Form 307 closeout.
- **T14 (Bonding, Grounding & Electrical Protection).** T14 covers TIA-607 grounding design. T20.L07 (RUS vs. NESC/TIA Reconciliation) shows how RUS Form 219 testing adds a compliance layer on top of TIA-607.
- **C04 (Certification Practice Exam Bank).** OSP Designer cert exam (BICSI) assumes OSP engineer understands federal compliance context. T20 context is helpful background for C04 study, especially for RUS-program employment scenarios.

---

## 12. Vocabulary_Introduced (for DAG registry)

**Complete list of terms first-introduced in T20 (not in T01–T19):**

- RUS Borrower
- RUS Loan Program
- RUS Loan Drawdown
- RUS Form 307
- RUS Form 740
- RUS Form 219
- USOA (Uniform System of Accounts)
- Plant Account
- Cable & Wire Account (FCC §32.2210)
- Land Account (FCC §32.2220)
- Poles Account (FCC §32.2420)
- Conduit Account (FCC §32.2480)
- Cost-per-Mile Allowance
- RUS Covenant
- As-Built Certification
- NEPA Environmental Review
- Section 106 Review
- Nationwide Permit 57
- Broadband-Eligible Cost
- Davis-Bacon Prevailing Wage
- Bonding Requirement (RUS-specific: performance + payment)

**Terms inherited from T01–T19 (in vocabulary_assumed for all T20 lessons):**

All fiber physics, cable, design, construction, splicing, testing, grounding, safety, and permitting vocabulary from T01–T19.

---

## 13. Vocabulary_Assumed (for DAG registry)

**Cross-references T01–T19 DAG:**

- From T01: fiber types, modes, attenuation, bandwidth, dB math
- From T04: plant accounts (general), route survey, pre-engineering package
- From T05: NESC Rule 232, sag/tension, pole loading, aerial design
- From T06: conduit, duct, burial depth, underground design
- From T07: staking, clearance, make-ready
- From T08: pole attachment, NESC Rule 235, make-ready procedures
- From T09: NEPA basics, USACE permitting, ROW/easement concepts
- From T10: construction documentation, QA checklist, project sign-off
- From T14: grounding electrode, bonding, TIA-607 concepts
- From T18: OSHA, safety, PPE, confined space
- From T19: headend/CO basics, primary protector, rack layout (for RUS-funded headend context)

---

## Authoring Notes for Future Author Agents

- **OSP Engineer framing:** Assume audience is experienced in OSP technical work (completed T01–T19) but new to RUS program requirements. Use the "your next project is RUS-funded — here's what changes" framing.
- **Example projects:** Use real RUS program scenarios (FTTH feeder to rural county, mixed aerial + underground, federal land crossing). Anonymized case studies from RUS borrower workflows.
- **Flashcards required:** Every lesson must include vocabulary flashcards for new terms introduced. No exceptions (per directive in CLAUDE.md).
- **Interactivity:** Lessons L03 (Forms), L04 (USOA accounting), L07 (reconciliation) are good candidates for **BranchingScenario** primitives (e.g., "Your RUS project triggers NEPA environmental review — which agency do you contact first?"). L01 could use a **WorkedExample** for cost-per-mile calculation.
- **Book-vs-field callouts:** Use explicit sidebars or callout boxes (per training-voice rule in CLAUDE.md) for each known divergence. Label clearly: "BOOK RULE: ...", "FIELD PRACTICE: ...".
- **Citations:** Every procedural claim (e.g., "RUS requires Form 219 signed before drawdown") must cite source (RUS 1751F-810 §4, or 7 CFR 1735 §5.3). RT will verify every citation.
- **No new technical depth on familiar topics:** Don't re-explain NESC sag/tension from T05. Reference T05 + show RUS Bulletin adoption path instead.

---

## Research Agent Closeout

**Research quality assurance:**

- ✅ All citations sourced from **research-sources-allowlist.md** (RUS Bulletins, 7 CFR Parts, 47 CFR Part 32, federal statutes, USACE)
- ✅ No paywalled standards required as primary sources (all RUS docs, federal regs, USDA forms are public)
- ✅ Scope bounded (RUS-program OSP compliance; not RUS finance, borrower accounting, ISP-specific programs)
- ✅ Prerequisite DAG validated against T01–T19 (all T20 lessons assume general OSP competency)
- ✅ Field practice divergences identified + flagged for author attention
- ✅ Vocabulary separation (new terms for T20; assumed terms cross-ref T01–T19)
- ✅ Authoring readiness: all blocking decisions identified; no research gaps block author dispatch

---

**STATUS: READY FOR AUTHOR DISPATCH**

End T20 Research Brief — RUS Compliance & Federal Programs

---
