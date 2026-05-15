# T09 (Permitting & Environmental) — Research Brief

**Status:** Ready for author dispatch  
**Research agent:** T09-Research  
**Date:** 2026-05-16  
**Word count:** ~2,400

---

## Section 1: Topic Scope (locked per ARCH.md §2 row 6)

**Title:** Permitting & Environmental  
**T09 title per ARCH.md = "Permitting & Environmental"**  
**Category:** General learning (18 general topics, teaching position 6 of 18)

**Scope:** The full permitting layer cake that every OSP fiber project navigates — from the federal environmental nexus (NEPA categorical exclusion, ESA, Section 106 NHPA) through state and municipal permits (DOT encroachment, ROW ordinances, franchise agreements) to private-property instruments (easements, licenses, fee-simple acquisitions). Teaches the USACE wetlands permit landscape (NWP 57 for telecom, the 2021 replacement for the former NWP 12 telecom coverage), tribal coordination requirements, RUS environmental review for USDA-financed builds, and the permit-tracking discipline that keeps projects off the critical path. Taught AFTER Route Survey (T04) so learners already understand why the route was selected. Taught BEFORE Aerial Design (T05) so permit constraints are baked into design decisions, not bolted on after.

**Teaching prerequisites (per DAG):** T01 (Fundamentals & Vocabulary), T04 (Route Survey & Pre-Engineering)  
**Topics that depend on T09:** T10 (OSP Construction — construction cannot start without permits cleared), T17 (Project Estimation & Revenue — permit costs and timelines feed the project budget)

**Estimated lessons:** 12 (per ARCH.md, matching lesson table rows 216–230)  
**Estimated total duration:** ~295 minutes (25+30+30+25+25+25+25+25+20+20+20+30)

---

## Section 2: Lesson List with Interactivity Map

| Lesson ID | Title | Type | Key vocab introduced | Assumed vocab (from T01/T04) | Learning objective | Est. time | Interactivity | Source |
|---|---|---|---|---|---|---|---|---|
| T09.L01 | The Permitting Layer Cake | foundation | federal nexus, AHJ, jurisdictional trigger, encroachment permit, BEAD | site walk, route alternatives, GIS from T04; OSP, ROW from T01 | Learner maps each permit type to its triggering authority and explains why federal funding (BEAD, RUS) creates the federal nexus that kicks in NEPA and Section 106 | 25 min | AnnotatedDiagram (four-layer diagram: federal → state → county/municipal → private); Quiz (MC) | M03 §3.1 |
| T09.L02 | NEPA — CE, EA, and EIS | working | NEPA, categorical exclusion (CE), EA, FONSI, EIS, extraordinary circumstances, CE C-8, ESAPTT | federal nexus from L01, route footprint from T04 | Learner applies the CE C-8 screening to a BEAD aerial-fiber route and identifies which extraordinary-circumstances triggers would elevate the review from CE to EA | 30 min | Quiz (MC + drag: match NEPA tier to project characteristic); BranchingScenario (CE screening decision tree — does your route qualify?) | M03 §3.2 |
| T09.L03 | Section 106 — Historic Properties | working | NHPA §106, SHPO, APE (Area of Potential Effect), finding of effect, 30-day clock, consulting party, program comment | AHJ from L01, route corridor from T04 | Learner sequences the Section 106 consultation steps, explains when the 30-day clock starts (complete initiation package only), and identifies what triggers an adverse-effect finding | 30 min | BranchingScenario (§106 adverse-effect path: route deviates from existing ROW → hits APE → SHPO response); Quiz (MC) | M03 §3.3 |
| T09.L04 | ESA, Bats, and IPaC | working | ESA, T&E species, threatened, endangered, IPaC DKey, Section 7 consultation, biological assessment, tree-clearing window | site walk, vegetation observation from T04; federal nexus from L01 | Learner uses IPaC outputs to determine whether a project footprint triggers a bat species consultation and identifies the standard tree-clearing avoidance window mitigation | 25 min | Quiz (MC: go/no-go scenario on bat trigger by project element); AnnotatedDiagram (IPaC output screenshot annotated — what each result means) | M03 §3.4 |
| T09.L05 | USACE Wetlands Permits — NWP 57 and the Section 404 Framework | working | Section 404 (CWA), Section 10 (RHA), waters of the US (WOTUS), NWP 57, PCN (pre-construction notification), individual permit, 33 CFR Part 330, jurisdictional determination | route survey wetland flags from T04; HDD from T06 intro | Learner identifies when a fiber bore or trench crossing triggers NWP 57, when a PCN is required, and when individual permit processing (6–12 months) must be budgeted | 25 min | Quiz (MC); BranchingScenario (three-crossing decision: is this a PCN, NWP with no PCN, or individual permit?) | net-new (per ARCH.md; note: ARCH.md listed NWP 12 but allowlist confirms NWP 57 is the current telecom permit — see Section 9) |
| T09.L06 | State DOT Encroachment Permits | working | encroachment permit, PE stamp, traffic control plan (TCP), surety bond, right-of-entry, plan-and-profile, as-built submittal | route alternatives (T04); KMZ/shapefile deliverables (T04.L06) | Learner assembles a state DOT encroachment permit packet and explains the PE-stamp requirement, typical review timeline (60–180 days), and the as-built closeout obligation | 25 min | BranchingScenario (permit path by state class: DOT mainline vs. secondary road vs. interchange); Quiz (MC) | M03 §3.5 |
| T09.L07 | ROW, Easements, and Private Property | working | prescriptive easement, express easement, license, fee-simple acquisition, dedication, grantor, grantee, recording | site walk (T04.L01); landbase/GIS (T04.L03) | Learner distinguishes the four private-property access instruments by enforceability and recordability, and explains why prescriptive easements are a risk on legacy routes | 25 min | Quiz (MC + drag-match: instrument → description + enforceability); AnnotatedDiagram (recorded easement document annotated — grantor, grantee, legal description, purpose clause) | M02 §2.7 |
| T09.L08 | Municipal ROW — Timelines and Reality | working | franchise agreement, municipal fiber fee, ROW restoration bond, ROW ordinance, pavement cut moratorium, noise ordinance, work-zone permit | AHJ from L01; KMZ deliverable from T04.L06 | Learner maps the municipal ROW packet components, calculates a realistic permit timeline (30 days–12+ months depending on municipality), and explains the franchise-agreement vs. permit-only distinction for carriers vs. ISPs | 25 min | BranchingScenario (delay scenario: municipality misses 30-day review → what are the project's options?); Quiz (MC) | M03 §3.5; FCC BDAC Model Code (2018) |
| T09.L09 | Tribal Coordination — THPO and NHO | working | THPO, NHO (Native Hawaiian Organization), government-to-government consultation, sacred sites, government-to-government protocol, ACHP Tribal Handbook | Section 106 from L03 | Learner explains when THPO replaces SHPO, when NHO consultation applies (projects in Hawaii or affecting Hawaiian interests), and why government-to-government consultation timelines can extend a Section 106 process beyond the standard 30 days | 20 min | Quiz (MC: four scenario-triggers, which requires THPO vs. SHPO?) | M03 §3.3 callout; ACHP Tribal Handbook (public) |
| T09.L10 | Permit Tracking and the PM Problem | working | permit log, shot clock (FCC sense), permit critical path, OTMR interface, permit-to-construction date lag, permit matrix | OTMR shot clocks from T08 intro concepts (forward-reference OK as preview); make-ready as PM problem from M03 §3.7 | Learner builds a permit matrix for a sample project (four permit types in parallel), identifies the critical-path permit, and explains how permit slippage propagates to the construction start date | 20 min | Quiz (MC); WorkedExample (calculate earliest construction start date given permit timeline inputs for four concurrent permit types) | M03 §3.7 partial |
| T09.L11 | RUS Environmental Review | advanced | RUS environmental report, RUS CE checklist, BEAD environmental compliance milestone, 7 CFR 1970, Environmental Impact Memorandum (EIM) | NEPA from L02; RUS program context from T01 | Learner completes a RUS CE determination checklist for a sample project, identifies the difference between NTIA/BEAD NEPA procedures and RUS/USDA 7 CFR 1970 NEPA procedures, and explains what triggers an EIM vs. a full environmental report | 20 min | Quiz (MC) | net-new; anchor: 7 CFR 1970 (RUS NEPA rule); RUS Form 307 |
| T09.L12 | T09 Capstone Quiz | capstone-quiz | — | all T09 vocabulary | Learner applies T09 concepts in a multi-permit scenario: given a BEAD aerial-fiber route crossing a wetland, a state DOT road, a historic district, and private farmland — identify every permit type, sequence them, and flag the critical-path risk | 30 min | Quiz (20Q MC + 1 BranchingScenario multi-permit decision) | net-new |

---

## Section 3: Interactivity Recommendations (per Carter's 2026-05-15 directive + T02 template)

**All 9 primitives available; T09 leans on Quiz, BranchingScenario, and AnnotatedDiagram because permitting is primarily procedural + decision-based, not calculation-based.**

1. **Quiz (MC + drag-match)** — present in every lesson. Emphasis on application, not recall:
   - L01: drag permit types to their issuing authority (federal NEPA → NTIA/lead agency; Section 106 → SHPO; state DOT → district office; municipal ROW → public works)
   - L04: MC go/no-go — "Project scope includes tree-clearing in NLEB bat range. Avoidance window is April–October. Project starts October 15. Is tree-clearing permitted?" (field nuance: run IPaC, don't rely on generic dates)
   - L07: drag-match four instruments (prescriptive easement / express easement / license / fee-simple) to their properties (recordable yes/no, revocable yes/no, term length)

2. **BranchingScenario** — primary interactivity for procedural flows:
   - L02: NEPA CE screening. "BEAD aerial fiber in existing highway ROW. Check extraordinary circumstances one by one: T&E species? Historic corridor? Wetland crossing? Floodplain? Proceed or elevate to EA?" Learner makes each checkpoint decision with consequences shown.
   - L03: Section 106 adverse-effect path. "Route deviates 20 ft from existing utility corridor into a cornfield behind a 1920s farmhouse. Is the farmhouse in your APE? SHPO says adverse effect. What happens next — mitigation agreement, or stop work?" Multi-step, state-persisted.
   - L05: NWP 57 PCN decision. "Bore under a seasonal drainage ditch (WOTUS? call it 50/50). Cross a mapped wetland, 80 ft bore. No individual-permit triggers visible. Do you file PCN, proceed under NWP 57 no-PCN, or call USACE for JD first?" Branch to consequences.
   - L08: municipal delay scenario. "Municipality has had your ROW application for 38 days — no response. Shot clock? FCC model code says 60 days. Do you: wait, escalate to state broadband office, or apply for a declaratory judgment?" Each choice → consequence + timeline impact shown.

3. **AnnotatedDiagram** — three diagrams with click-to-label + hover-explain:
   - L01: four-layer permitting stack. Click each layer to see: who issues, triggering conditions, typical timeline, what happens if skipped.
   - L04: annotated IPaC DKey output. Each result field labeled: "Species found" → "Section 7 consultation may be required"; "No critical habitat" → "Still check for suitable habitat in project area."
   - L07: recorded express easement document annotated. Grantor block, grantee block, legal description (metes and bounds), purpose clause ("for communication cable installation and maintenance"), term (perpetual vs. term), recording reference.

4. **WorkedExample** — one calc-heavy lesson (L10 permit matrix):
   - Inputs: Municipal ROW permit (45-day review, submitted Day 0), State DOT encroachment (90-day review, can submit Day 0), Section 106 (30-day clock starts Day 15 after adequate package, SHPO response by Day 45), USACE NWP 57 PCN (45-day review, submitted Day 10).
   - Step-by-step: draw timeline, mark earliest start date for each, identify which finishes last.
   - Sanity check: "The DOT permit is your critical path at Day 90. Every other permit clears by Day 55. If DOT review starts late (submitted Day 30 because the PE stamp wasn't ready), your construction start date slides to Day 120 — 30 days behind schedule before a shovel hits the ground."

**Flashcards (mandatory per Carter's 2026-05-16 lock):** Every lesson exports `key_terms` with flashcards for all vocabulary introduced. Definitions pulled verbatim from lesson prose. Examples:
- L02: "CE C-8" → "A categorical exclusion under NTIA's published NEPA procedures covering aerial or buried utility/communications construction within or adjacent to existing rights-of-way. Eliminates the need for an EA or EIS, provided no extraordinary circumstances apply."
- L05: "PCN" → "Pre-construction notification required under USACE Nationwide Permit conditions when a project has impacts above certain acreage or linear-foot thresholds, or when listed conditions (wetland proximity, species habitat) are present. Filed before construction; USACE has 45 days to respond."
- L07: "Prescriptive easement" → "A property right arising from continuous, open, and hostile use of someone else's land over a statutory period (commonly 10 years, varies by state). Not recorded at time of creation — emerges over time and is recorded after the fact or confirmed by court order."

---

## Section 4: Capstone Quiz Scope (L12)

20 MC questions + 1 BranchingScenario. Tiered difficulty (foundations 35%, working 50%, advanced 15%):

**Foundations tier (7 questions):**
- Match permit type to issuing authority for four permit types
- Identify the federal nexus trigger (federal funding = NEPA + §106 applicability)
- Name the three NEPA tiers (CE, EA, EIS) in ascending order of review intensity
- Identify whether NWP 57 or an individual permit applies given a simple crossing scenario
- ROW vs. easement distinction (which is recorded in public ROW, which is a private land instrument)

**Working tier (10 questions):**
- Apply CE C-8: given project description, does CE apply? Which extraordinary circumstance would disqualify?
- Section 106: incomplete initiation package → when does the 30-day clock start?
- ESA bat trigger: tree-clearing scope in NLEB range in October — go/no-go?
- THPO vs. SHPO: route crosses tribal land — which is the consulting party?
- DOT encroachment: what must the permit packet include (PE stamp, TCP, surety bond — all three)?
- Municipal ROW: franchise agreement vs. encroachment permit — which applies to a new ISP with no franchise?
- Permit matrix: identify critical-path permit in a four-permit scenario with given review timelines
- NWP 57 PCN threshold: acreage or linear-foot trigger question
- Fee-simple vs. easement: which conveys full ownership, which conveys use rights only?
- RUS 7 CFR 1970 vs. NTIA BEAD NEPA — same CE C-8 applies? (Yes — both USDA programs use same CE language, but distinct procedures)

**Advanced tier (3 questions):**
- Full multi-permit scenario: BEAD aerial route → which of five permits apply, which is critical path?
- Section 106 adverse-effect mitigation: what are the three available outcomes (MOA, PA, project modification)?
- RUS Environmental Impact Memorandum: when is an EIM required vs. a CE checklist?

**Scenario (required):** "You're permitting a 12-mile BEAD aerial-fiber route. Segment A (8 miles) is along existing highway ROW. Segment B (4 miles) deviates into a rural corridor with a 1920s farmhouse (in the APE), a seasonal stream crossing, and a quarter-mile of tree clearing in documented NLEB range. List every permit required for each segment, sequence them in parallel, and identify the critical-path permit. What single action would most shorten the overall permit timeline?"

---

## Section 5: Citations (RUS, NESC, industry standards)

All citations verified against `audit-output/research-sources-allowlist.md`.

| Cited standard | Section/Clause | Claim | Status | Source |
|---|---|---|---|---|
| 40 CFR Part 1500–1508 | Full subpart | NEPA implementing regulations (CEQ rules) | ALLOWLIST PRIMARY | Public eCFR; public domain |
| 54 USC § 306108 | Section 106 | Historic preservation review mandate | ALLOWLIST PRIMARY | Public law (Cornell LII / law.cornell.edu) |
| 16 USC § 1531–1544 | ESA §7 | Endangered Species Act — Section 7 consultation | ALLOWLIST PRIMARY | Public law |
| 33 CFR Part 320–332 | NWP framework | USACE nationwide permit framework (Section 404 / Section 10) | ALLOWLIST PRIMARY | Public eCFR |
| USACE NWP 57 | Full permit | Telecom/electric utility line activities (replaces NWP 12 for telecom post-2021) | ALLOWLIST PRIMARY | Public — USACE Nationwide Permit 57 (2021 reissuance) |
| 47 CFR Part 32 | §§ 32.2210, 32.2220, 32.27 | Plant accounting + record retention for RUS borrowers (T09 permitting cost allocation) | ALLOWLIST PRIMARY | Public eCFR |
| RUS Form 307 | Full form | Construction and Operation Report — RUS program construction reporting | ALLOWLIST PRIMARY | Public (USDA RD forms repository) |
| 7 CFR Part 1970 | Full subpart | RUS NEPA implementing regulations (Environmental Policies and Procedures) | ALLOWLIST (federal regulation) | Public eCFR; public domain |
| FCC 18-111 | OTMR Order | One-Touch Make-Ready permit shot clocks (referenced in L10 permit matrix) | ALLOWLIST PRIMARY | Public FCC order |
| ACHP — Section 106 Tribal Handbook | Full document | THPO/NHO government-to-government consultation procedures | ALLOWLIST SECONDARY | Public (ACHP.gov) |
| FCC BDAC Model Code | 2018 edition | Municipal ROW shot clocks (60-day review model) | ALLOWLIST SECONDARY | Public FCC broadband deployment advisory committee report |
| USFWS IPaC | DKey tool | Species-specific tree-clearing guidance for ESA screening | ALLOWLIST (federal agency tool) | Public (ipac.ecosphere.fws.gov) |

**Field-practice divergences to teach explicitly per Carter's rule:**

- **Book:** NEPA CE C-8 applies to all aerial or buried utility construction within existing ROW. **Field:** Many BEAD subgrantees skip the extraordinary-circumstances checklist assuming CE is automatic. In practice, encountering even one listed bat species in the route corridor triggers an IPaC run that can flip CE to informal Section 7 consultation — adding 2–4 months. Teach both: CE is the starting point, extraordinary circumstances is the work.
- **Book:** Section 106 consultation clock is 30 days after submission of the initiation letter. **Field:** SHPO offices routinely return packages as incomplete (missing APE map, missing photo log, missing prior-records search). Each return-and-resubmit resets the clock. Real-world timeline is 60–120 days on first-time submittals. Plan for the real timeline.
- **Book:** NWP 57 permits telecom wetland crossings with no PCN for crossings under acreage/linear thresholds. **Field:** USACE districts vary significantly in how they interpret "waters of the US" after the 2023 Sackett v. EPA Supreme Court decision. What a district accepted as non-jurisdictional in 2020 may now require a formal jurisdictional determination. Always call the district office before assuming NWP with no PCN.
- **Book:** Municipal ROW permits are issued by the city under its ROW ordinance; a franchise agreement is a separate commercial agreement. **Field:** Many municipalities tell new ISPs "you don't need a franchise, just a ROW permit" — and then add franchise-like conditions (pole attachment fee, excess capacity, open-access) to the permit by ordinance. The distinction matters legally; the operating reality is murkier. Teach the theory and the field gray zone.

---

## Section 6: Author Guardrails (per agent-protocol.md + Carter voice rules in CLAUDE.md §2)

**Vocabulary discipline:**
- T09 lessons may freely use all terms introduced in T01 (OSP, ISP, span, attachment, sag, headend, OLT, ONT, FDH, drop, sheath, buffer tube) and T04 (landbase, LiDAR, RTK GNSS, KMZ, pole audit, attachment height, route alternatives, planimetric, deliverable package).
- T09 introduces 11 net-new terms: NEPA, CE C-8, NHPA §106, SHPO, THPO, ESA, IPaC, NWP 57, ROW, easement, AHJ, encroachment permit. All locked per ARCH.md vocabulary table for T09.
- **Forward-reference ban:** T09 may forward-reference T10 (Construction) in the sense of "you can't break ground until these permits clear" as a motivating frame — but do NOT assume terms from T05 (NESC, Rule 232, loading districts), T06 (HDD, conduit fill, manhole), T08 (OTMR), or T14 (bonding/grounding). If OTMR is mentioned (L10 permit matrix), define it inline: "OTMR (One-Touch Make-Ready) — the FCC framework governing how fast a pole owner must process a make-ready request."
- Every acronym on first use: "NEPA (National Environmental Policy Act)", "CE (categorical exclusion)", "SHPO (State Historic Preservation Officer)", "ESA (Endangered Species Act)", etc.

**NWP 12 / NWP 57 author instruction (ARCH.md vs. allowlist discrepancy):**
- ARCH.md lesson T09.L05 title says "USACE NWP 12 — The 2026 Reissue." The allowlist clarifies that NWP 12 (post-2021) covers oil/gas pipelines ONLY; telecom and electric utility activities moved to **NWP 57** in the 2021 reissuance.
- **Author must:** title the lesson as "USACE Wetlands Permits — NWP 57 and the Section 404 Framework." Teach the history: NWP 12 formerly covered telecom until 2021; the 2021 reissuance created NWP 57 for that activity. Any student who searches for "fiber NWP 12" will find older materials — explaining the transition is genuinely useful field knowledge.
- Do NOT hardcode a "2026 reissue" claim without a `[confirm edition]` marker; USACE nationwide permits are reissued on 5-year cycles and the current status should be verified at lesson-publish time.

**Math discipline (per §1 pitch-revision rule + T02 template):**
- T09 has one calculation-heavy lesson (L10 permit matrix). All date-arithmetic worked examples must show every step: "DOT permit submitted Day 0, 90-day review → earliest approval = Day 90. Section 106 initiation submitted Day 15, 30-day clock → earliest SHPO response = Day 45. Critical path = DOT at Day 90." Add sanity check: "Day 90 is three calendar months. If you submit the DOT permit the same day you sign the contract, you're looking at Q2 construction for a Q1 start — budget accordingly."
- No formula derivations required beyond the date arithmetic; this is a procedural topic.

**No AI references:** Content reads as a senior OSP permitting specialist wrote it. No AI meta-signals.

**Facts only, no guesses:** Where permit timelines vary by jurisdiction, say so: "State DOT review typically runs 60–180 days; confirm with the relevant district office for your state." Where WOTUS determination is uncertain post-Sackett: "Call the relevant USACE district office before assuming non-jurisdictional status. The 2023 Sackett v. EPA decision narrowed WOTUS, but districts continue to vary in interpretation — verbal confirmation from the district officer before construction is the safe standard."

**Citation rigor:** Every section/clause cited must be verifiable or marked `[confirm edition]`. For NWP 57, cite "USACE NWP 57 (2021 reissuance — verify current reissuance status at lesson publication)."

---

## Section 7: Capstone Quiz Acceptance Criteria

Red team verifies:
1. All 20+ MC questions have a single [CORRECT] answer derivable from lesson content (no questions requiring knowledge not taught in T01, T04, or T09).
2. NWP numbering is correct (NWP 57 for telecom, NOT NWP 12 — author guardrails above address this).
3. Section 106 clock logic is accurate: 30-day clock starts on receipt of an ADEQUATE package only.
4. ESA bat species listing status verified against current USFWS program pages (species status is dynamic; author marks `[confirm current listing status at time of publication]`).
5. All permit timeline examples are internally consistent across lessons (if L06 says DOT review is 60–180 days, L10's worked example must fall within that range).
6. BranchingScenario consequences are realistic: delay estimates and cost impacts cited from industry practice (M03 §3.5 and §3.7 source material, or marked as representative field estimates).
7. No AHJ-specific decisions presented as universal (e.g., "every state requires a PE stamp" — incorrect; some states have thresholds; phrase as "many states require... confirm with AHJ").

---

## Section 8: Lesson Authoring Priority Stack

Per ARCH.md §1, authors follow this priority:
1. **JSX source** — M03 (Permitting & Planning, sections 3.1–3.8) for pitch register + content framework
2. **M02 §2.7** for ROW/easement content (L07)
3. **SHA-verified pitch revisions** — any prior T09 rewrite commits (cross-check via git before trust; note: the wave-osp-topic9/DISCOVERY.md predates ARCH.md and covers the OLD T09 scope — Safety/OSHA — DO NOT use it as a content source for the new T09)
4. **Net-new authoring** — L05 (NWP 57 detail), L09 (Tribal/THPO detail), L11 (RUS 7 CFR 1970 NEPA), L12 (capstone)

T09 source map:
- L01: M03 §3.1 (layer cake framing)
- L02: M03 §3.2 (NEPA, CE C-8, extraordinary circumstances)
- L03: M03 §3.3 (Section 106, SHPO, 30-day clock)
- L04: M03 §3.4 (ESA, bats, IPaC)
- L05: net-new (NWP 57 — the DISCOVERY.md topic9 file is pre-ARCH.md and covers a different T09 scope; do not use)
- L06: M03 §3.5 (DOT encroachment) + net-new (PE stamp state variation detail)
- L07: M02 §2.7 (ROW, easements, prescriptive easement) + net-new (express easement, fee-simple, dedication detail)
- L08: M03 §3.5 (municipal ROW timelines) + FCC BDAC Model Code
- L09: M03 §3.3 callout (THPO mention) + ACHP Tribal Handbook (net-new depth)
- L10: M03 §3.7 partial (permit critical path, shot clocks) + net-new (permit matrix worked example)
- L11: net-new (7 CFR 1970 RUS NEPA, EIM vs. CE checklist, BEAD vs. RUS procedure distinction)
- L12: net-new (capstone quiz)

**CRITICAL AUTHOR WARNING:** The file `audit-output/wave-osp-topic9/DISCOVERY.md` describes a 9-lesson Safety/OSHA scope (manholes, LOTO, atmospheric testing, PPE) that was written under the OLD curriculum structure before ARCH.md locked the topic numbering. That content is now T18 (Safety & OSHA), which is already authored. T09 in the new ARCH.md structure is Permitting & Environmental. Authors who read the DISCOVERY.md file will be misled — read ARCH.md rows 216–230 as the authoritative scope.

---

## Section 9: Known Research Constraints + Paywalled Sources

**NWP 57 / NWP 12 status:**
- USACE nationwide permits are reissued every 5 years; the 2021 reissuance moved telecom from NWP 12 to NWP 57. The 2026 reissuance cycle may alter numbering, conditions, or thresholds again.
- Lesson L05 author must verify current NWP status at time of authoring: visit `https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/Nationwide-Permits/` (public).
- Mark lesson with `[verify NWP number and PCN thresholds against current USACE reissuance at publication time]`.

**7 CFR 1970 (RUS NEPA):**
- The full RUS NEPA implementing regulation (7 CFR Part 1970) is public via eCFR. L11 author must cite specific sections for CE checklist requirements. The regulation was substantially revised in 2016 (replacing the prior 7 CFR 1794 environmental policies).
- USDA Rural Development's "Environmental Policies and Procedures" final rule (March 2, 2016, 81 FR 11024) is the anchor document. Public.

**ESA species listing status:**
- NLEB (Northern Long-Eared Bat) was reclassified from Threatened to Endangered effective February 2023 (88 FR 6358). Tricolored Bat proposed Endangered as of October 2022. These listings are dynamic.
- L04 author marks `[confirm current listing status at time of publication — verify at fws.gov/species]`.

**State-specific content (not researchable to specifics without jurisdiction):**
- PE-stamp requirements for DOT submittals vary by state. Do not cite a specific state's threshold as universal. Use representative examples (TxDOT ROW Manual §4 — public document) and direct learners to confirm with AHJ.
- Municipal ROW ordinance terms (franchise fee, pavement cut moratorium) vary by city. M03 §3.5 provides representative examples; authors should not invent specific city rules.

**ACHP Section 106 Tribal Handbook:**
- Public document available at achp.gov. Full title: "Consultation with Indian Tribes in the Section 106 Review Process: A Handbook." Cite as "ACHP Section 106 Tribal Handbook (most recent edition — verify at achp.gov)."

**Paywalled source mitigation:**
- No primary T09 sources are paywalled. NEPA (40 CFR), ESA (16 USC), Section 106 (54 USC), 33 CFR, 7 CFR 1970, NWP 57 permit text, and ACHP handbook are all public. FCC 18-111 (OTMR order) is public. M03 §3.1–3.8 (source material) is in-tree. This topic is research-accessible without paywalled source workarounds.

---

## Section 10: Lesson Author Checklists (Template per T02)

Every author must verify before marking a lesson complete:
- [ ] All vocabulary in Section 2 lesson table covered in lesson body with definitions on first use
- [ ] Every acronym spelled out on first use in the lesson (even if defined in a prior lesson — learners may read non-sequentially)
- [ ] T09.L05 titled "USACE Wetlands Permits — NWP 57 and the Section 404 Framework" (NOT "NWP 12 — The 2026 Reissue" per ARCH.md — author guardrail above)
- [ ] NWP 57 PCN thresholds marked `[verify current thresholds against USACE reissuance at publication time]`
- [ ] ESA bat species listing status marked `[confirm current listing status at fws.gov/species at publication time]`
- [ ] Section 106 clock explanation: "clock starts on receipt of ADEQUATE package, not submission date" — explicitly taught in L03
- [ ] Book-vs-field divergences for all four flagged items (CE checklist reality; §106 clock reset; WOTUS post-Sackett; municipal ROW franchise gray zone) explicitly taught, not glossed
- [ ] Flashcards present for every `key_terms` item; definitions verbatim from lesson prose (not paraphrased)
- [ ] L10 permit matrix WorkedExample shows every date-arithmetic step; sanity-check sentence in plain English after final answer
- [ ] No AHJ-specific rules stated as universal without `[confirm with AHJ]` qualifier
- [ ] No AI-meta language, no hardcoded standard editions without `[confirm edition]` or `[verify at publication time]`
- [ ] All quiz [CORRECT] answers derivable from lesson content only (no outside knowledge required)
- [ ] DISCOVERY.md in wave-osp-topic9/ NOT used as source material (it covers old T09 Safety/OSHA scope — now T18)
- [ ] Forward-references to T10/T05/T06/T08 vocabulary defined inline if used

---

=== T09 BRIEF END ===
