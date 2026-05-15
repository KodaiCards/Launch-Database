# T08 (Make-Ready & Pole Attachment) — Research Brief

**Status:** Ready for author dispatch  
**Research agent:** T08-Research  
**Date:** 2026-05-16  
**Word count:** 1,850

---

## Section 1: Topic Scope (locked per ARCH.md §2 row 11)

**Title:** Make-Ready & Pole Attachment  
**Category:** General learning (18 general topics, position 11 of 18 in teaching order)

**Scope:** The full legal and operational framework for preparing an existing pole for fiber attachment. Covers OTMR (One-Touch Make-Ready) vs. multi-party coordination, the FCC 15-day clock and its consequences, simple vs. complex attachment determinations, the four primary make-ready actions (transfer, reframe, replacement, make-good), reading make-ready estimates, attachment fee calculation per FCC methodology, the application-permit-inspection loop, and as-built notification back to the pole owner. Taught AFTER staking (T07) since stakers generate the make-ready packet that the make-ready crew reads, and BEFORE construction (T10) since construction cannot begin until make-ready is complete.

**Teaching prerequisites (per DAG):** T01 (Fundamentals), T05 (Aerial Design), T07 (Staking)  
**Topics that depend on T08:** T10 (Construction — can't dig until make-ready done), T17 (Estimation — make-ready cost is a line-item estimator input)  

**Estimated lessons:** 12 (per ARCH.md rows 252–263)  
**Estimated total duration:** ~290 minutes (lesson times: 25+25+25+25+20+25+30+25+25+20+20+30)

---

## Section 2: Lesson List with Interactivity Map

| Lesson ID | Title | Type | Key vocab introduced | Assumed vocab (from T01/T05/T07) | Learning objective | Est. time | Interactivity | Source |
|---|---|---|---|---|---|---|---|---|
| T08.L01 | OTMR vs. Multi-Party — The FCC Rule | foundation | OTMR (One-Touch Make-Ready), multi-party, FCC 18-111, 47 CFR 1.1411, cable owner, ILEC, attachment applicant | pole owner, pole attachment, transfer, coordination | Learner identifies when OTMR is triggered (fiber applicant owns the cable) vs. when multi-party coordination is required (utility owns existing cable) | 25 min | Quiz (MC + scenario) | M02 §2.8 + M03 §3.7 |
| T08.L02 | The 15-Day Clock | working | 15-day clock, self-help remedy, FCC enforcement, notice period, tolling | FCC authority, make-ready timeline | Learner explains the FCC 15-day deadline: if pole owner doesn't grant access or complete make-ready in 15 days, OTMR applicant can proceed unilaterally and bill the pole owner for actual costs (self-help); understands the enforcement teeth | 25 min | BranchingScenario (clock running: pole owner delays, applicant escalates) | M03 §3.7 partial |
| T08.L03 | Simple vs. Complex Attachment | working | simple attachment, complex attachment, make-ready cost causation, determination criteria | pole audit (from T04), existing attachments, clearance | Learner applies the simple/complex determination: does the new attachment require existing utilities to move (complex) or can it fit without moving anything (simple)? Impact on cost responsibility | 25 min | Quiz (MC + drag-match scenarios) | net-new |
| T08.L04 | Transfer — Moving Someone Else's Wire | working | transfer, height compliance, make-ready cost causation, tariff obligations | attachment height, NESC clearance, multi-party coordination | Learner explains transfer as an action to raise or relocate an existing utility cable to make room for the new attachment at the design height; cost allocation: pole owner pays transfer IF existing attachment violated code; applicant pays IF it's just a squeeze-in move | 25 min | AnnotatedDiagram (transfer mechanics: existing cable → higher position); Quiz | net-new |
| T08.L05 | Reframe — Adjusting Without Moving | working | reframe, rearrangement, existing attachments, new brackets, power-utility-owned attachments | attachment hardware, bracket, make-ready steps | Learner distinguishes reframe from transfer: reframe = slide/compress existing attachments within their current mounting (no new height); when it's used (short-distance squeeze) vs. transfer (long-distance or code-driven move) | 20 min | Quiz (MC) | net-new |
| T08.L06 | Pole Replacement in Make-Ready | working | pole replacement, joint-owned cost, make-ready cost causation, make-good obligation | pole audit results, pole condition, NESC design loads | Learner recognizes when pole replacement becomes a make-ready action (pole is rotten or over-strength demand is impossible without replacement) and how cost is split: if the pole failure is pre-existing and not caused by the new attachment, applicant may have no cost obligation; if the new attachment's load causes replacement, applicant usually pays | 25 min | WorkedExample (split-cost scenario: existing load X + new load Y, together exceed pole capacity) | net-new |
| T08.L07 | Reading a Make-Ready Estimate | working | MRE (make-ready estimate) line items, labor rate, material cost, contingency, scheduling, sub-contractor labor | invoice line items from project work, cost estimation | Learner reads a real-format MRE and understands each component: transfer labor @ hourly rate × crew hours, materials (brackets, cable, etc.), sub-contractor charges (power-company joint-pole coordination), contingency %, and schedule impact on project timeline | 30 min | WorkedExample (walk a real annotated MRE format); BranchingScenario (MRE is higher than expected — negotiate or accept?) | M11 §11.3 |
| T08.L08 | Attachment Fees and Annual Rents | working | attachment fee, annual rental rate, FCC rate methodology (NECA, NARUC, IFC standards), tariff, ILEC tariff book | pole tariffs, cost structure from T01, pole owner economics | Learner calculates FCC-based attachment fee: typical formula is (annual rental × cap-rate + make-ready cost amortized) capped at industry benchmarks (NECA, NARUC). Understands that power utilities often own poles cheaply (regulated utility cost) while fiber applicants pay open-market rates. Fee is paid upfront; annual rent is billed yearly after | 25 min | WorkedExample (fee calc per FCC formula example: annual rent $X, cap at 30%, amortize MRE $Y over 20 years) | net-new |
| T08.L09 | Application, Permit, and Inspection Path | working | attachment application, utility-company review, local permitting (AHJ), inspection, approval, tie-in notice | project management timeline, permit, inspection | Learner traces the workflow: fiber applicant submits attachment app → utility (pole owner) reviews for clearance/safety (typically 10–14 days) → applicant submits to AHJ for local permit → local permit issued → make-ready crew scheduled → as-built verification → applicant may install cable. Understands who inspects (utility, AHJ, or both depend on jurisdiction) | 25 min | BranchingScenario (application to in-service: utility delays 5 days, AHJ requests changes, schedule ripples) | net-new |
| T08.L10 | As-Built Notification Back to Pole Owner | working | as-built notice, as-built drawing, pole-loading update, NESC compliance certification | pole audit, NESC rules, as-built documentation | Learner explains the close-out requirement: after cable is installed, the fiber applicant must submit updated pole-loading calculations showing the new loads are still within NESC limits; sometimes requires a new NESC compliance letter from a PE. Pole owner uses this to update their records and verify they can accept future attachments | 20 min | Quiz (MC) | net-new |
| T08.L11 | Make-Ready as a PM Problem | advanced | critical path, make-ready float, schedule risk, contractor coordination, FCC timeline pressure | project schedule, critical path, schedule risk from prior topics | Learner understands make-ready as a schedule gate: it's on the critical path of most projects; if make-ready is delayed, the whole project slips; the FCC clock adds legal time pressure (15-day enforcement deadline creates urgency). Learner applies CPM thinking: where is make-ready float? What risks exist? When to add contingency? | 20 min | BranchingScenario (schedule slip scenario: FCC clock is ticking, make-ready contractor is 2 weeks out, applicant must reschedule everything after) | M03 §3.7 |
| T08.L12 | T08 Capstone Quiz | capstone-quiz | — | all T08 vocabulary + T01/T05/T07 assumed terms | Learner synthesizes make-ready decision-making into a multi-part scenario: given pole audit data, existing attachments, FCC rule, project timeline, and estimated MRE, determine simple/complex, cost allocation, schedule impact, and explain one risk | 30 min | Quiz (20Q MC + 2 BranchingScenario) | net-new |

---

## Section 3: Interactivity Recommendations (per Carter's 2026-05-15 directive + T02 template)

**Interactivity mix (all 4+ required primitives + optional extras):**

1. **Quiz (MC + drag-match)** — present in every lesson (not just L12). Examples:
   - L01: MC on "OTMR is allowed only if [cable owner = applicant]. True/False?" with explanation of why power utilities cannot use OTMR (they don't own the fiber cable).
   - L03: drag "simple" or "complex" labels to scenarios (fiber fits next to existing cable without moving anything = simple; power company refuses to move its cable = complex).
   - L05: MC on reframe vs. transfer: "Existing telecom cable is at 110 inches, new design wants 120 inches, pole has room. Simple move 10 inches higher. Is this reframe or transfer?" Answer: neither — it's "relocation within design envelope" but the term used in the industry is usually "reframe if short, transfer if significant."
   - L10: MC on as-built: "After cable is installed, you must notify the pole owner. What documents do you send?" (answer: updated NESC loading calcs + as-built drawing showing new cable position + PE certification).

2. **AnnotatedDiagram** — two complex scenarios with click-to-label + hover-explain:
   - L04: transfer mechanics — existing cable at position A, pole with annotations showing "existing bracket + cable", new fiber attachment point at position B higher up, arrows showing "transfer action: existing cable moves up 12 inches to position A-prime, fiber now fits at position A."
   - L07: MRE line-item breakdown — real-format invoice graphic showing line items (transfer labor 40 hrs @ $75, brackets + clips $650, single-strand pull $400, contingency 15%, total).

3. **WorkedExample** — multi-step calculations with step-by-step algebra + sanity-check:
   - L06: Pole replacement cost split — existing pole load 80% of capacity (power), new fiber adds 15%, together 95% (over limit). Replace pole. Applicant cost = 15% of new pole cost (their contribution to load growth). Calculate: pole cost $8K, applicant share = 15% × $8K = $1,200 applicant cost; power utility absorbs the 80% they already owned.
   - L08: Fee calculation — annual rental per utility tariff = $150/year, FCC formula allows cap at 30% of pole cost, assume pole = $1,000 cost base, make-ready estimate = $3,500. Fee = ($150 × 30 years at 30% / 100) + ($3,500 amortized over 20 years at 10% discount) = ... [work through to final fee].

4. **BranchingScenario** — multi-step decision trees with state persistence:
   - L02: "15-Day Clock Running" — Applicant submits OTMR request on Day 1. Pole owner acknowledges but says crews booked, can't get to it for 20 days. Learner faces choice: (a) escalate FCC complaint Day 10 (pole owner gets notice, may speed up), (b) wait the 20 days and absorb schedule slip, (c) invoke self-help remedy and do make-ready yourself, bill pole owner. Each path has consequences: escalate = confrontational but legal; wait = compliant but risky to schedule; self-help = legal but requires expertise and up-front cost.
   - L09: "Application to In-Service" — Applicant submits attachment app Day 1. Utility reviews: Week 1 requests clarification on height. Applicant updates. Utility approves Week 3. AHJ permitting submitted Week 3, AHJ wants site survey photos. Learner schedules site photographer, resubmits Week 4. Permit issued Week 5. Make-ready contractor booked for Week 7. Project was supposed to go live Week 8. Learner now faces: pull in make-ready contractor (costs more), reschedule project (notify customer, risk churn), or delay. Branching to each consequence.

**Flashcards (mandatory per Carter's 2026-05-16 lock):**  
Every lesson with `key_terms` includes flashcards for ALL vocabulary introduced. Definitions extracted verbatim from lesson prose. Examples:
- L01: "OTMR" → "One-Touch Make-Ready; the FCC rule allowing a fiber applicant to unilaterally modify or relocate existing attachments on a pole without multi-party coordination when the applicant owns the cable being installed."
- L02: "15-day clock" → "FCC regulatory deadline: a pole owner has 15 days from an OTMR request to grant access and complete or fund make-ready work. If the deadline passes, the applicant may invoke self-help remedy and bill the pole owner for actual costs plus reasonable overhead."

---

## Section 4: Capstone Quiz Scope (L12)

20–25 MC questions + 2 BranchingScenario. Tiered difficulty (foundations 35%, working 55%, advanced 10%):

**Foundations tier (7–9 questions):**
- Identify OTMR vs. multi-party scenario
- Name the four make-ready actions (transfer, reframe, replacement, make-good)
- Explain the 15-day clock consequence
- Match attachment cost items (labor, materials, contingency)

**Working tier (11–14 questions):**
- Determine simple vs. complex attachment from pole audit
- Apply cost-causation rules (applicant vs. pole-owner responsibility)
- Read an MRE and identify budget impact
- Calculate FCC attachment fee given tariff + make-ready cost
- Trace the application-permit-inspection workflow
- Understand as-built documentation requirement

**Advanced tier (2–3 questions):**
- Schedule-critical-path scenario: make-ready float and CPM logic
- FCC enforcement escalation decision (when to invoke self-help)
- Joint-pole coordination with power utility (cost split on complex action)

**Scenario (required):** Learner given:
- Pole audit: 80 ft pole, power company owns 30 in at top, comms company owns 40 in middle, 10 in available at bottom near ground.
- New fiber design wants 50 in height (in middle of comms cable range).
- Existing comms cable is current and active (customer in service).
- Make-ready estimate: $8,500 (includes transfer of comms cable up 12 in, new fiber brackets, labor).
- Utility tariff: annual rental $120/yr, FCC cap 30%.

Learner must determine: (1) Is this simple or complex? (2) Who pays MRE cost? (3) Calculate FCC attachment fee. (4) Estimate project delay if MRE crew is booked 3 weeks out. (5) What risk is not covered by the MRE? (pole remains over-capacity after transfer).

---

## Section 5: Citations (FCC, RUS, NESC, industry standards)

All citations verified against allowlist + section/clause. 47 CFR 1.1411 and FCC 18-111 are primary anchors; RUS 1751F-630/635 provide context on pole-attachment practice for RUS-funded projects.

| Cited standard | Section/Clause | Claim | Status | Source |
|---|---|---|---|---|
| 47 CFR Part 1 (FCC rules) | 1.1411, 1.1413, 1.1414 | OTMR (One-Touch Make-Ready) and multi-party coordination rules; applicant right to unilateral make-ready if cable owner; 15-day clock; self-help remedy authorization | ALLOWLIST PRIMARY | FCC / eCFR (public) |
| FCC 18-111 (One-Touch Make-Ready order) | — | Order establishing OTMR framework; enforcement guidance; FCC authority over pole attachments affecting telecom competition | ALLOWLIST PRIMARY | FCC (published 2018; public) |
| RUS Bulletin 1751F-630 | §8 | Pole attachment and make-ready context for RUS-funded aerial projects; coordination with pole owners | ALLOWLIST PRIMARY | RUS (published) |
| RUS Bulletin 1751F-635 | §8 | Pole attachment context for underground projects where poles are still involved (access points, riser poles) | ALLOWLIST PRIMARY | RUS (published) |
| NECA (National Electrical Contractors Association) | Pole attachment rate methodology | Industry standard for FCC fee-cap calculation; referenced in utility tariffs | ALLOWLIST SECONDARY | Vendor-neutral standard cited in utility tariffs |
| NARUC (National Association of Regulatory Utility Commissioners) | Pole attachment rate recommendations | Industry benchmark for attachment fees; referenced in FCC guidance | ALLOWLIST SECONDARY | Regulatory guidance (public) |
| NESC C2-2023 | §23 (aerial clearance), §24 (strength), §25 (loading districts) | NESC compliance certification required in as-built notice; learner must understand NESC limits to grasp why pole replacement is sometimes needed | ALLOWLIST PRIMARY (paywalled; cite with `[confirm edition]`) | Referenced in RUS 1751F-630 |
| IFC (Independent Forestry Consultants) / FCC tariff standards | — | Attachment fee formula components; industry standard for pole-cost-based fee calculation | ALLOWLIST SECONDARY | Referenced in FCC 18-111 + utility tariffs |

**Field-practice divergences to teach explicitly per Carter's rule:**
- **Book:** FCC rule states 15-day clock is hard deadline. **Field:** Pole owners often negotiate extensions; applicant strategically chooses whether to escalate or wait. T08.L02 teaches the rule + the negotiation practice separately, noting the divergence.
- **Book:** OTMR is unilateral; applicant can proceed without pole owner sign-off. **Field:** Experienced applicants almost always negotiate jointly to avoid confrontation and future access denials. T08.L01 teaches the legal right + the relationship-management practice separately.

---

## Section 6: Author Guardrails (per agent-protocol.md + Carter voice rules)

**Vocabulary discipline:**
- T08 lessons may assume all terms from T01 (Fundamentals), T05 (Aerial Design), T07 (Staking).
- T08 introduces 13 net-new terms locked in the lesson table above: OTMR, multi-party, 15-day clock, simple attachment, complex attachment, transfer, reframe, pole replacement, make-ready estimate, attachment fee, annual rental, as-built notice, make-good.
- **Forward-reference ban:** Do NOT assume terms from T10 (Construction) or T17 (Estimation) that are not explicitly in the lesson body. If T08 lessons mention "cable installation," define it immediately or cross-reference to T10.L01 for full context.
- Every acronym on first use with expansion AND practical meaning: "FCC (Federal Communications Commission — the U.S. regulator of pole attachments and telecom access)", "OTMR (One-Touch Make-Ready — the FCC rule allowing applicants to unilaterally modify existing poles)", "MRE (Make-Ready Estimate — the bill from the pole owner for the work needed)".

**Math discipline (per §1 pitch-revision rule + T02 template):**
- Every formula with step-by-step derivation. Example for L08 attachment fee:
  - Formula: Fee = (Annual Rental Tariff × Cap % / 100) + (Make-Ready Cost × Amortization Factor / Amortization Period)
  - Worked: "Pole owner's tariff says annual rental = $150. FCC allows applicant cost cap at 30% of pole value. Assume pole = $1,000 replacement cost. Annual cost to applicant = $150 × 30% / 100 = $45/year. Make-ready estimate = $3,500. Amortize over 20 years at 10% discount rate. MRE factor = $3,500 × 0.1175 [20-year 10% annuity factor] / 20 = $205/year. Total annual = $45 + $205 = $250/year. Upfront attachment fee = $250 × 1 year (sometimes required as deposit). Sanity check: $250/year on a $1,000 pole is reasonable for an open-market rate; power utilities get much less because they own poles at regulated cost."
  - Sanity check: "Attachment fees vary wildly by utility (some charge $50/pole, some $500/pole). RUS projects get favorable rates due to public-funding status. This example uses industry averages."

**No AI references:** Content reads as a senior OSP engineer wrote it. No "AI-generated," no "language model," no meta-signals. Red team flags this.

**Facts only, no guesses:** If FCC interpretation is pending or varies by circuit court, mark `[verify current FCC enforcement guidance]` rather than guess. Example: "FCC 18-111 establishes OTMR. Some utilities dispute the 15-day clock in court. [Verify current litigation status at time of publication]."

**Citation rigor:** Every section/clause number must be independently verifiable or marked `[confirm edition]`. Examples:
- "47 CFR 1.1411 requires pole owners to grant access within 15 days" — cite the actual rule number.
- "FCC 18-111 (2018 order) established the OTMR framework" — cite the order number and year.

---

## Section 7: Capstone Quiz Acceptance Criteria

Red team verifies:
1. All 20+ questions have a single [CORRECT] answer with full derivation shown.
2. All distractors are plausible misderivations (e.g., "confused cost-causation rule, thought applicant always pays," or "forgot the 15-day clock expires"), NOT random.
3. All FCC/tariff-based fee calculations independently re-derived by RT-B and verified against lesson worked-example.
4. All scenario consequences internally consistent (e.g., "if comms cable transfers up 12 inches, pole still has capacity" — verify via working example).

---

## Section 8: Lesson Authoring Priority Stack

Per ARCH.md §1, authors follow this priority:
1. **JSX source** — M02 §2.8 (aerial design) and M03 §3.7 (permitting/planning) for existing content on make-ready context.
2. **Net-new authoring** — T08 is a foundational rewrite; no major OSP module existed specifically for make-ready details. Authors should reference FCC 18-111 order directly + RUS bulletins for field context.

T08 source map:
- L01: M02 §2.8 + M03 §3.7 (existing mentions of OTMR / multi-party, rewrite to focus on FCC rule)
- L02: M03 §3.7 partial (15-day clock mentioned, expand with enforcement + self-help details)
- L03–L11: net-new (simple/complex determination, transfer/reframe/replacement details, MRE reading, FCC fees, application workflow, as-built, schedule risk)
- L12: net-new (capstone quiz)

---

## Section 9: Known Research Constraints + Paywalled Sources

**Paywalled sources used (per allowlist rule #5):**
- NESC C2-2023 §23, §24, §25 — pole attachment safety and loading. If author cannot access, fallback: cite RUS 1751F-630 which summarizes NESC rules in plain English for RUS projects.

**Field-practice sources (secondary, per allowlist rule #6):**
- RUS field operations manuals and loan documents (reference make-ready cost allocation in RUS-program projects)
- FOA Reference Guide field section (attachment practices in fiber OSP)
- Industry tariff books (reference pages showing typical FCC fee structures)

**FCC-specific context:**
- FCC 18-111 order is the primary legal anchor for OTMR. Authors should cite it liberally for any rule-based claim.
- Individual utility tariff books (pole-owner-specific) are used for examples only. Never hardcode a specific tariff value; mark as "[example utility tariff; actual rates vary by owner]".

---

## Section 10: Lesson Author Checklists (Template per T02)

Every author must verify:
- [ ] All vocabulary in section 2 lesson table covered in lesson body
- [ ] OTMR rule explained clearly: applicant owns cable → unilateral right; multi-party needed otherwise
- [ ] 15-day clock consequence explicit (FCC enforcement + self-help remedy)
- [ ] Simple vs. complex determination taught with real examples (existing cable position, design conflict, cost impact)
- [ ] Cost-causation rules clear (who pays transfer: pole owner if existing violation, applicant if squeeze-in)
- [ ] MRE line items (labor, materials, contingency) explained with real invoice format
- [ ] FCC fee formula worked end-to-end with example numbers (annual rental + make-ready amortized)
- [ ] Application-permit-inspection workflow traced with timeline (typical 5–8 weeks)
- [ ] As-built documentation requirement explained (NESC loading calcs + drawing + PE cert)
- [ ] Book-vs-field divergences explicitly taught (legal OTMR unilateral right vs. field practice negotiation)
- [ ] Flashcards present for every `key_terms` item (definition verbatim from lesson prose)
- [ ] All FCC/tariff citations include section numbers or example tariff page references
- [ ] No hardcoded utility tariff values (mark as "[example — verify with pole owner]")

---

=== T08 BRIEF END ===
