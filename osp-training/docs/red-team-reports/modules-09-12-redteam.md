# Red-Team QA Report — Modules 09–12
**Reviewer:** Agent C (Red Team / QA, Sonnet)
**Date:** 2026-05-08
**Scope:** Module 9 (OSP Construction), Module 10 (Data Center Standards), Module 11 (Revenue Estimation), Module 12 (Certification Simulator)
**Files reviewed:** Module JSX source, flashcard decks, cert-sim-bank.js, research logs, field-vs-textbook-research.md

---

## Section 1 — Module-by-Module Summary

| Module | BLOCKERs | FIXes | NITs |
|--------|----------|-------|------|
| 09 — OSP Construction | 0 | 1 | 2 |
| 10 — Data Center Standards | 0 | 0 | 2 |
| 11 — Revenue Estimation | 0 | 1 | 2 |
| 12 — Certification Simulator | 0 | 2 | 3 |
| **Totals** | **0** | **4** | **9** |

---

## Section 2 — Verified Items (passing)

### Module 09 — OSP Construction

- **Burial depth values correctly sourced and tagged.** 36 in from RUS 1751F-630/-635 and OCC 206-4 tagged `[VERIFIED-public-source]`. NEC 830.47 18-in floor tagged `[VERIFIED-via-secondary-source]` with paywall acknowledgement. CalTrans ~42 in and VDOT per IIM-LD-230 both properly distinguished as secondary-source or public-source. AHJ-overrides-everything principle present throughout.
- **NESC IEEE C2 not quoted authoritatively.** No NESC underground depth tables reproduced verbatim. Depth guidance is correctly routed through state DOT manuals and RUS bulletins with explicit `[UNVERIFIED-needs-paid-doc for NESC underground sections]` disclaimer in the source note block.
- **TIA-758-C not quoted authoritatively.** Referenced only as paywalled, via secondary sources; flagged `[UNVERIFIED-needs-paid-doc]`.
- **Pull tension 600 lbf.** Corroborated: Corning SRP-005-011, OCC 206-2, and ICC all cited as public sources. Caveat "always verify against the cable datasheet" is present in both the module text and the flashcard. VERIFIED correct.
- **Conduit fill numbers tagged correctly.** 40% NEC Chapter 9 (secondary source), 25%/40% BICSI/TIA (secondary source), and 50–70%+ microduct jetting reality (Mike Holt forum + vendor) — all three clearly distinguished.
- **APWA color codes verified.** Orange = telecom confirmed against CGA Marking Standards Manual v10. Table in module is complete and accurate.
- **2024 DIRT Report statistics.** 196,977 unique damages and 24.5% failure-to-notify-811 confirmed via independent web search against CGA press releases and secondary reporting. Telecom 49% of damaged utilities confirmed. Numbers are correct.
- **2025 FBA/Cartesian plowing/trenching figures.** Rural plowing ~$11.88/ft and rural trenching ~$19.00/ft from the 2025 FBA report confirmed via web search against Cartesian/FBA published data. VERIFIED correct.
- **RUS 1751F-643 innerduct color sequence.** Correctly left as `[UNVERIFIED-needs-paid-doc]`. No normative sequence asserted.
- **Scenario questions M9-Q1 through M9-Q6.** All five concept-testing scenarios are appropriately framed. No paywalled-standard table values reproduced as authoritative exam answers. The drag-and-drop question (M9-Q6) tests recall of guidance values, which are individually cited with their sources and caveats. Correct answers for all questions verified against module text and research log.
- **Slack-loop contract bands.** 50/100/150 ft bands appropriately labeled `[UNVERIFIED-needs-contract-sample]` because no single normative standard specifies these lengths. OFS IP-009 and Cabling Installation & Maintenance cited for the band ranges. Correct editorial posture.

### Module 10 — Data Center Standards

- **Uptime Tier vs. TIA-942 Rated distinction.** Unambiguous throughout: Roman numerals (I–IV) for Uptime Tier, Arabic numerals (1–4) for TIA-942 Rated, different certification bodies explicitly named in the first table. "TIA-942 Tier III" correctly labeled as malformed. The disambiguation is present in the module text, flashcards, and in every relevant cert-sim question.
- **Availability percentages 99.671/99.741/99.982/99.995%.** Correctly labeled "historical Uptime white-paper figures, not part of the current Tier Standard or TIA-942-C" with cite to Uptime Journal "Myths and Misconceptions" article.
- **TIA-942-C May 2024 cabinet width 800 mm.** VERIFIED via web search: Belden, Data Center Frontier, and Cabling Installation & Maintenance all corroborate 800 mm minimum for MDA/IDA/HDA. Tagged as `[VERIFIED-via-secondary-source]` with paywall caveat for clause-level text. Correct.
- **DCE 9000 and AI Addendum.** Both correctly labeled "forthcoming, not yet binding." DCE 9000 draft target Sept 2026, full publication 2027 confirmed via Data Centre Magazine and PRNewswire. AI Addendum target mid-2027 confirmed via TelecomReseller March 2026. The module's replacement of the brief's vague "2026 TIA Quality Standards" with precise document names is editorially correct.
- **Base-8 vs Base-12 MPO utilization arithmetic.** 100GBASE-SR4 (4+4=8), 400GBASE-DR4 (4+4=8), 800GBASE-DR8 (8+8=16) — lane counts corroborated against IEEE 802.3 (public source). Utilization math (Base-12 with 8-fiber transceiver = 67% utilization, 4 dark fibers) verified. Correct.
- **ANSI/BICSI 002-2024 scope comparison.** ~575 pages, 17 chapters, 12 appendices — cited from Cabling Installation & Maintenance press release. Complementary scope framing (BICSI 002 = breadth, TIA-942 = conformance criteria) corroborated by practitioners. Correct.
- **Scenario questions M10-Q1 through M10-Q6.** All six questions are concept-testing, not table-value reproduction. The drag-drop (M10-Q6) maps transceiver types to base correctly. No paywalled content reproduced authoritatively.

### Module 11 — Revenue Estimation

- **CPHP vs CPHC distinction.** Clearly and correctly defined. CPHC = CPHP ÷ Take Rate formula is present and correct. The numerical example ($1,200 CPHP at 40% take rate → $3,000 CPHC) is arithmetically correct. The distinction is carried consistently through the module text, flashcards, and scenario questions.
- **CPHC always > CPHP.** Stated correctly and without exception throughout.
- **Homes Passed / HP+ / Homes Connected trilogy.** Three metrics defined side-by-side, consistent with FBA, Huber+Suhner, iQGEO, and FTI Consulting sources.
- **Union/non-union differential.** Correctly flagged `[UNVERIFIED]` with explicit statement: "not pinned to a single public primary table." BLS OEWS 49-9052 cited as the available public source for wage data. No numerical differential is stated as a verified fact in the module text.
- **Contingency tiers.** 10%/15%/20% bands from Let's Talk Cabling practitioner consensus — appropriately labeled as practitioner floor, not normative standard. Separate materials-escalation clause taught as a distinct line item. Correct.
- **Contract type definitions.** RFP vs. lump-sum distinction correct. T&M, T&M-NTE, GMP correctly described. AIA contract templates appropriately flagged as paywalled for clause text; Procore plain-language explainers used as secondary sources.
- **Make-ready cost ranges.** $40–120 simple, $200–800 reinforcement, $1,500–5,000+ replacement per pole — labeled `[VERIFIED-via-secondary-source]`. Per-pole range is consistent across multiple sources. Field example ($42,000 / 7 poles ≈ $6,000/pole) plausible within the replacement band.
- **Scenario questions M11-Q1 through M11-Q6.** All six questions frame concepts or computations, not paywalled table values. CPHP/CPHC question (M11-Q2) arithmetic is correct: $6.5M ÷ 5,000 HP = $1,300 CPHP; 1,750 ÷ 5,000 = 35% take rate; $1,300 ÷ 0.35 = $3,714 CPHC.

### Module 12 — Certification Simulator

- **Exam structure facts (BICSI RCDD).** 100 scored items, 2.5 hours, 70% passing score, TDMM 15th edition — all `[VERIFIED-public-source]`. The module correctly distinguishes this from the practice simulator (50 items / 75 minutes) and explicitly labels it a half-length session.
- **FOA CFOS/S written-only caveat.** Correctly stated: "written score is necessary but not sufficient." Practical requirement explicitly flagged. Correct.
- **Ethics disclaimer.** Dump site names listed; BICSI/FOA code-of-conduct violation language present. Section 12.3 is complete and appropriately prominent.
- **No leaked exam content identified.** All 68 questions reviewed. No question appears to be a paraphrase or lifting of any published dump-site content pattern. Every question is concept- or scenario-based, derived from public standards documents (IEEE 802.3, ITU-T G.652, CGA DIRT, FCC 18-111, NESC Table 235-5 via secondary sources, etc.).
- **No paywalled-standard values reproduced as authoritative exam answers.** NESC table values in cs-011, cs-012, cs-013, cs-014 are tagged `[VERIFIED-via-secondary-source]` and the explanations explicitly note the paywalled source. Correctly handled.
- **Domain distribution of 68 questions:** Define Scope (7), Design ICT Solutions (43), Bid/Tender (7), Installation (11). Proportions: 10.3% / 63.2% / 10.3% / 16.2%. This matches the v14/v15 blueprint weights (10/63/11/16) within rounding tolerance for a 68-question bank.
- **DOMAIN_WEIGHTS object (10/63/11/16) confirmed correct** against v15 blueprint percentages identified via web search (see Issues section for the flag-update recommendation).

---

## Section 3 — Issues Found

### Module 09 — OSP Construction

**FIX-09-01: FBA/Cartesian 2025 report URL is anachronistic**
`Severity: FIX`

The module's header comment (line 25) cites "FBA + Cartesian 2025 cost report: VERIFIED-public-source." The module text correctly references the FBA/Cartesian 2025 report for the plowing/trenching figures ($11.88/ft and $19.00/ft). The RefList URL points to:
```
https://fiberbroadband.org/wp-content/uploads/2026/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report_2025.pdf
```
This URL was independently confirmed to serve the correct document. However, the module uses the 2025 figures for Method cost decision matrix (Section 9.2), not for the general aerial/underground medians. The 2025 figures have been verified as $11.88/ft plowing and $19.00/ft trenching. **No correction needed to the numbers themselves.** However, Module 9's scenario question M9-Q2 cites the FBA 2025 figures in the explanation (`$11.88/ft plowing, $19.00/ft trenching`), consistent with the module.

The cross-reference risk is that Module 11 independently cites FBA 2024 figures ($6.49/ft aerial, $16.25/ft underground) which turn out to be the **2023 dataset figures** (see FIX-11-01). Module 9 does not reproduce those numbers so this is contained.

**NIT-09-01: Research log open question 1 (NESC IEEE C2 via secondary source) needs a disposition note**
`Severity: NIT`

Research log §4 Open Question 1: "Should we teach NESC IEEE C2 burial-depth tables verbatim, or is teaching via secondary source acceptable?" This was documented but not formally closed. The module correctly chose the secondary-source approach, but the open question in the research log has never received a disposition note. Add a closing comment in the research log noting: "Resolved — platform uses state DOT manuals and RUS bulletins as NESC proxies per editorial posture. Verbatim NESC tables not used." No change needed to the module itself.

**NIT-09-02: Research log open question 3 (microduct scope) unanswered**
`Severity: NIT`

Research log §4 Open Question 3: "Microduct / air-blown fiber — is this in scope for Module 9, or its own module?" The module does include microduct jetting content in Section 9.4 (conduit fill) but only in passing. The research log open question should be closed with a decision note. No content change required in the module.

---

### Module 10 — Data Center Standards

**NIT-10-01: ASHRAE A1 inlet temperature range — citation precision**
`Severity: NIT`

Module 10 Section 10.5 and cert-sim question cs-044 state the ASHRAE TC 9.9 A1 class recommended inlet temperature range as 15–32°C (59–90°F), citing the CKY Engineering summary. The source is tagged `[VERIFIED-via-secondary-source]`. The CKY Engineering source is consistent with widely reproduced ASHRAE summaries. However, the exact ASHRAE TC 9.9 document is not public and the precise boundary (some sources cite 15°C, others 18°C as the lower bound) has minor inter-source variance. The module correctly flags this as secondary-source and does not reproduce it as a verbatim ASHRAE clause value. No correction required, but an instructor note would improve accuracy. Consider adding: "Confirm against ASHRAE TC 9.9 2021 Thermal Guidelines before quoting in a design specification."

**NIT-10-02: Module 10 header comment references "2026-05-08" research date for AI Addendum — confirm currency**
`Severity: NIT`

The header comment and Section 10.7 cite TelecomReseller, March 2026 for the AI Addendum target publication date of mid-2027. This source is `[VERIFIED-public-source]`. As of the review date (2026-05-08), the AI Addendum remains unpublished and target date has not changed publicly. No update required, but Red Team should add a recurring check: "Review AI Addendum publication status before each major curriculum release."

---

### Module 11 — Revenue Estimation

**FIX-11-01 (NOTABLE): FBA 2024 cost figures are mislabeled — they are the 2023 dataset**
`Severity: FIX`

**This is the most significant factual error found across all four modules.**

The module (Sections 11.1 and 11.2), Module 11 flashcards (m11-cost-medians), and cert-sim questions cs-004 and cs-055 all cite "FBA/Cartesian Fiber Deployment Cost Annual Report 2024" as the source for:
- Aerial median: **~$6.49/ft**
- Underground median: **~$16.25/ft**

However, an independent web search confirmed that these figures are from the **2023 dataset** (the FBA/Cartesian report published January 2024, covering 2023 data). The **FBA/Cartesian 2024 dataset report** (published February 2025, covering 2024 data) shows:
- Aerial median: **~$6.55/ft** (+1%)
- Underground median: **~$18.25/ft** (+12%)

The module's research log cites the Fierce Network article at `https://www.fierce-network.com/broadband/underground-fiber-drives-deployment-costs` which confirms these 2024-data figures but the module incorrectly calls the 2023-data figures "2024 medians."

The report naming convention is confusing (the "2024 Report" refers to 2023 data, the "2025 Report" refers to 2024 data, etc.), but the editorial standard requires accurate attribution.

**Required corrections:**
1. Module 11 Section 11.1: Change "FBA/Cartesian Fiber Deployment Cost Annual Report 2024" attribution to "FBA/Cartesian Fiber Deployment Cost Annual Report 2023 (published January 2024)" and update the figures to note the 2024 dataset values ($6.55/ft aerial, $18.25/ft underground) from the "FBA/Cartesian Fiber Deployment Cost Annual Report 2024 (published February 2025)."
2. Alternatively — since the module explicitly teaches that these numbers change year to year — present both report editions' figures side by side as an illustration of that variance, which is consistent with the module's existing "teach the inputs, not the output" posture.
3. Same correction required in: flashcard m11-cost-medians, and cert-sim explanations for cs-004 and cs-055 where the "$6.49/ft aerial" figure is cited with a "2024 report" attribution.
4. Update the RefList URL for the "2024" report to the correct document path.

Note: The module's existing "2025 trade-press update: ≈$8/ft aerial, ≈$18/ft" represents a reasonable approximation but that too should be re-sourced against the verified 2024-data report numbers ($6.55/ft aerial, $18.25/ft underground).

**NIT-11-01: Union/non-union differential — UNVERIFIED flag is correct but the range source is unclear**
`Severity: NIT`

The module and flashcard correctly flag the 30–50% union/non-union differential as `[UNVERIFIED]`. The research log notes this appears in "regional FBA breakouts and contractor commentary." The specific FBA regional breakout issue or year is not cited anywhere in the module materials. Since it is already correctly flagged as unverified, no content change is required. However, the research log should include a specific "last searched: [date], result: no public primary source found" note to demonstrate due diligence.

**NIT-11-02: 2025 FBA/Cartesian plowing/trenching figures used in Module 9 but "2024" used in Module 11 — cross-module consistency**
`Severity: NIT`

Module 9 correctly uses the 2025 FBA report for plowing/trenching costs. Module 11 uses the (mislabeled) 2024 report for aerial/underground medians. Once FIX-11-01 is applied, the cross-module sourcing will be consistent. This NIT is resolved by FIX-11-01 and is noted here only to flag the dependency.

---

### Module 12 — Certification Simulator

**FIX-12-01: v15 domain weights confirmed matching v14; update the flag callout to remove uncertainty**
`Severity: FIX`

Module 12, Section 12.1 Callout "v15 domain weights — flagged for Red Team confirmation" states the v15 PDF was 403-blocked during research and flags the weights as unconfirmed. The research log also flags this as an open question.

Red Team independently confirmed via web search and source triangulation that the RCDD v15 domain weights are:
- Define Scope of ICT Design: **10%**
- Design ICT Solutions: **63%**
- Support ICT Bid/Tender Process: **11%**
- Support ICT Installation Process: **16%**

These are **identical to the v14 weights** used as the platform baseline and stored in `DOMAIN_WEIGHTS` in `src/data/cert-sim-bank.js`. No weight changes are required.

**Required corrections:**
1. In Module 12 Section 12.1, update the Callout to: "v15 domain weights CONFIRMED — Red Team verified 2026-05-08. Weights are identical to v14 baseline (10/63/11/16). No update to DOMAIN_WEIGHTS required."
2. In `src/data/cert-sim-bank.js`, update the flag comment at the top: "FLAG (VERIFIED-via-secondary-source as of 2026-05-08): The v15 blueprint percentages match the v14 baseline (10/63/11/16) confirmed via web search triangulation. No weight change required."
3. In the flashcard `m12-rcdd-domain-weights`, remove "confirm v15 against the BICSI blueprint PDF" uncertainty language and add "CONFIRMED v15 matches v14 as of Red Team review 2026-05-08."

**FIX-12-02: cert-sim-bank.js question count (68) is below the research log's recommended minimum (600 per track)**
`Severity: FIX`

The research log §5 recommended "minimum 600 vetted items per track to support randomised 100-item delivery without repetition for the most active candidate." The bank currently contains **68 questions** across all domains. The platform sim runs 50-item sessions. A 68-question bank can support one non-repeating 50-item session and barely covers a second pass without heavy repetition. For the platform to deliver the intended study experience, the bank must be substantially expanded.

**Required action:** This is a scope/capacity gap requiring authoring work, not a factual correction. Recommend:
- Raise the minimum bank size to at least 200 questions (4× the sim session size) as an interim target before the curriculum launches to students.
- The research log's 600-question target remains the long-term goal.
- This is labeled FIX (not BLOCKER) because the 68-question bank correctly covers all four domains and is factually accurate; the constraint is functional (repetition after a few sessions) rather than editorial (wrong content).

**NIT-12-01: Module 12 header comment references a "half-length sim" but also recommends running count=100 for full session — verify UI capability**
`Severity: NIT`

Section 12.4 and Section 12.5 both suggest running `count=100` in the CertificationSim component for a full-length session. If the component's `count` prop is hardcoded at 50 in the JSX (line 283: `count={50}`) and the platform does not expose a user-configurable count control in the UI, the instruction to "use count=100" may be misleading to students who have no way to invoke that prop. The JSX does not show a UI control for count override. This should either be removed from the student-facing text or the component should be updated to expose a session-length selector.

**NIT-12-02: BICSI OSP Designer passing score tagged [VERIFIED-via-secondary-source] — recommend flag for handbook re-fetch**
`Severity: NIT`

The OSP Designer passing score (70%) is tagged `[VERIFIED-via-secondary-source]` rather than `[VERIFIED-public-source]`. The OSP Certification Handbook PDF URL is cited (and was 403-blocked during original research). Red Team should perform a fresh fetch of the BICSI OSP Certification Handbook to confirm this figure and upgrade the tag to `[VERIFIED-public-source]` if confirmed.

**NIT-12-03: CFOS/S practical splice-loss threshold (0.15 dB vs 0.10 dB) flagged in RefList but not resolved**
`Severity: NIT`

The RefList verify entry states: "FOA CFOS/S practical acceptance threshold (0.15 dB or 0.10 dB per splice): FOA curriculum is member-only; the platform teaches 0.15 dB as the planning value pending FOA member confirmation." The module platform uses 0.15 dB throughout as the planning value (consistent with FOA loss-est.htm public reference), and the cert-sim questions on splicing use ≤0.05 dB (splicer target) and 0.30 dB (TIA-568.3-D max), not the CFOS/S practical threshold. The unresolved 0.15 vs 0.10 dB question does not affect any current question content. If the CFOS/S track is expanded in a future bank growth phase, this must be resolved first.

---

## Section 4 — Open Verification Items

### Module 09

| Item | Status | Action required |
|------|--------|-----------------|
| NESC IEEE C2 underground depth tables | `UNVERIFIED-needs-paid-doc` | Platform has accepted secondary-source approach. Close open question 1 in research log with disposition note. |
| RUS 1751F-643 innerduct color sequence | `UNVERIFIED-needs-paid-doc` | Module correctly teaches APWA surface marking only. Close open question 2 with disposition note once bulletin is confirmed as not prescribing a color sequence (or update content if it does). |
| Slack-loop contract bands (50/100/150 ft) | `UNVERIFIED-needs-contract-sample` | No single normative source. Module correctly teaches these as common bands, not a standard. No action required unless a specific carrier MSA or DOT contract is available to anchor a verified number. |
| r/HDD, r/lineman Reddit permalinks for as-built gap | Research gap noted in log | Nice-to-have for future enrichment. Not required for current release. |

### Module 10

| Item | Status | Action required |
|------|--------|-----------------|
| TIA-942-C Rated-4 fuel storage (96 hours) | `UNVERIFIED-needs-paid-doc` | Correctly flagged in module. Do not cite as a testable fact until confirmed from paid TIA-942-C Annex F. |
| ANSI/BICSI 002-2024 clause-level values | `UNVERIFIED-needs-paid-doc` | Correctly flagged throughout. Do not use for exam questions without the paid document. |
| TIA-942-C AI Addendum publication date | Forthcoming, target mid-2027 | Monitor TIA announcements quarterly. Update when addendum publishes. |
| DCE 9000 draft publication | Forthcoming, draft Sept 2026 | Monitor TIA QuEST Forum. Update when draft is released for public comment. |

### Module 11

| Item | Status | Action required |
|------|--------|-----------------|
| FBA 2024 dataset aerial/underground medians ($6.55/$18.25) | FIX-11-01 filed | Update module, flashcard, and cert-sim attributions per FIX-11-01. |
| Union/non-union 30–50% differential | `UNVERIFIED` | Flagged correctly. No primary source identified. Add "last searched: 2026-05-08, no public primary source found" note to research log. |
| AIA A101/A102/A103 clause text | `UNVERIFIED-needs-paid-doc` | Procore plain-English definitions used as proxy. Acceptable for concept-level training. |

### Module 12

| Item | Status | Action required |
|------|--------|-----------------|
| RCDD v15 domain weights | **RESOLVED** by Red Team 2026-05-08 | Update flag per FIX-12-01. Weights confirmed as 10/63/11/16 (identical to v14 baseline). |
| BICSI OSP Designer passing score | `VERIFIED-via-secondary-source` | Re-fetch OSP Certification Handbook when 403 block clears to upgrade to `VERIFIED-public-source`. |
| FOA CFOS/S practical splice-loss threshold | `UNVERIFIED-needs-paid-doc` | Resolve before expanding CFOS/S question track. Does not affect current content. |
| Question bank size (68 questions) | FIX-12-02 filed | Expand to ≥200 questions before student launch; 600 is the long-term target per research log. |
| TDMM 16th edition risk | Monitor | Research log instructs to verify which TDMM edition the v15 exam is keyed to at time of student's exam registration. Correct mitigation in place. |

---

## Section 5 — Cross-Module and Bank-Level Observations

### cert-sim-bank.js structural review

**Question count:** 68 questions (cs-001 through cs-068). Domain breakdown: 7 / 43 / 7 / 11. The 10.3% / 63.2% / 10.3% / 16.2% split matches the 10/63/11/16 blueprint within rounding tolerance for a 68-question bank.

**Paywalled-standard values as authoritative answers:** None found. All NESC table-value citations (cs-011 Rule 235 40 in, cs-012 Rule 250 Heavy district, cs-013 Rule 261 Grade B, cs-014 Rule 232 15.5 ft) are tagged `[VERIFIED-via-secondary-source]` and explanations explicitly state the paywalled source. This is editorially correct per the platform's three-tier tagging system.

**Leaked exam content:** None detected. Question framing is scenario- and concept-based throughout. No question closely tracks the format patterns typical of the identified dump sites (ITExams, ExamTopics, SPOTO, Lead2Pass). No question appears to be a paraphrase of a real BICSI or FOA question.

**Rule-number testing (NESC):** cs-011 tests Rule 235 (supply/comm separation), cs-012 tests Rule 250 (loading districts), cs-013 tests Rule 261 (grades of construction), cs-014 tests Rule 232 (clearances) — all testing the CONCEPT or RULE NUMBER through a scenario, not a memorized table value, which is the correct approach per editorial mandate.

**Notable accuracy check — cs-031 link loss calculation:** 18 km × 0.22 dB/km = 3.96 dB; 3 × 0.08 dB = 0.24 dB; total = 4.20 dB. Arithmetic verified correct. Answer choices are slightly confusingly structured (choices B and C are both "4.20 dB" with different explanations; answerIndex=2 points to choice C which shows the full breakdown). This is technically correct but the distractor design could confuse students since choices B and C share the same numerical answer. Consider revising choice B to a different value.

**Notable accuracy check — cs-033 IOR error:** (0.0005 / 1.4677) × 40,000 m ≈ 13.6 m, stated in explanation as "approximately 14–30 m." The lower bound of 13.6 m rounds to 14 m, which is correct. The range is slightly wider than the arithmetic strictly produces but is defensible as a planning range that accounts for directional ambiguity. Acceptable.

### Editorial posture consistency

All four modules consistently apply the platform's three-tier source tagging system. Field-vs-book callouts are present throughout. The editorial posture of "teach both the exam answer and the field reality, clearly labeled" is maintained. No module asserts a paywalled-standard table value without either a verified public source or an explicit `[UNVERIFIED-needs-paid-doc]` flag.

### Most significant issue

**FIX-11-01** is the most significant finding: the FBA 2024 report citation ($6.49/ft aerial, $16.25/ft underground) is demonstrably mislabeled — these are the 2023-data figures. The 2024-data figures are $6.55/ft aerial and $18.25/ft underground. While the magnitude of the error is small for aerial (1 cent/ft) and moderate for underground (+$2/ft, +12%), the attribution error affects the module's credibility as a cost-data reference. The fix is straightforward and the module's existing pedagogical posture ("these numbers change year to year — teach the inputs, not the output") makes this an easy correction to frame accurately.

---

*End of report.*
*Reviewer: Agent C (Red Team / QA, Sonnet) — 2026-05-08*
