# T13 (Inspection & Quality Assurance) — Canonical Brief

**Consolidated from:** R-1 (primary-skeptical), R-2 (corroboration-adversarial), R-3 (forensic tiebreaker), R-4 (legal/liability), R-5 (field-crew usability), R-6 (training-effectiveness), R-7 (safety/hazard), R-8 (contractor/PM), R-9 (RUS GFR/federal-audit), R-10 (O&M handoff), R-11 (calibration/metrology)  
**Consolidation date:** 2026-05-18  
**Status:** ALL 11 rounds complete (R-9 landed before consolidation). 24 HIGH findings, 27 MED findings, 9 LOW findings.

---

## Section 1: Topic Scope Locked

**Topic:** T13 — Inspection & Quality Assurance  
**Teaching position:** 16 of 22 (after T12 Testing; before T15 Restoration)  
**Prerequisite topics completed:** T01 Fundamentals, T02 Fiber Physics, T03 Cable Selection, T04 Site Survey, T05 NESC/Pole Loading, T06 UG Design, T07 Staking, T08 Make-Ready, T09 Permitting, T10 OSP Construction, T11 Splicing, T12 Testing, T14 Bonding/Grounding, T18 Safety/OSHA

**R-9 scope expansion:** 3 new HIGH findings require 2 net-new lessons beyond R-1's 10-lesson structure:
- **T13.L11 — Daily Inspection Records: RUS Form 565** (7 CFR §1753.19 obligation, Form 565→Form 7d chain, Davis-Bacon WH-347 collection)
- **T13.L12 — Federal Compliance Monitoring** (Davis-Bacon full treatment, NEPA conditions of approval, environmental site compliance)

**Revised lesson count: 12 lessons** (L01–L10 from R-1, + L11 and L12 added per R-9).

### Lesson Structure (12 lessons)

| Lesson | Title | Primary Standards |
|--------|-------|-------------------|
| L01 | Inspector Role, Authority, and Documentation Framework | 7 CFR §1753.19, §1753.21; RUS Form 219; OSHA 29 CFR 1910.268 |
| L02 | Pre-Construction Acceptance Baseline | RUS Form 515 §3(a); 7 CFR §1753.8; FHWA CPMI; AIA A201-2017 |
| L03 | Aerial Construction Inspection | NESC C2-2023 Rule 232/230/235; 29 CFR 1910.268(b)(20); T18.L04 |
| L04 | Underground Construction Inspection | ASTM D1557; CGA Best Practices §4.4; 29 CFR 1910.268(o); ASCE 38-22 |
| L05 | Slack Storage and Service Loop Inspection | Project MSA schedule (→ T10.L06); T10.L11 vocabulary_assumed |
| L06 | Material and Hardware Acceptance | ANSI/ICEA, TIA-598, manufacturer certs; T12.L01 vocabulary_assumed |
| L07 | Close-Out Documentation: Form 219 and the RUS Form Chain | 7 CFR §1753.21, §1753.22, §1755.404 + Format V (§1755.407); 2 CFR §200.334; False Claims Act 31 USC §3729 |
| L08 | Joint-Use and Clearance Compliance | NESC Rule 232; 47 CFR §32.2411 (Poles); T05.L02 vocabulary_assumed |
| L09 | Contractor Relations and Dispute Resolution | 7 CFR §1753.47(d); AIA A201-2017 §15; retainage; §4.4 re-inspection |
| L10 | Capstone: Full-Inspection Scenario + Assessment | Integrative — all T13 lessons |
| L11 | Daily Inspection Records: RUS Form 565 | 7 CFR §1753.19; RUS Form 565; RUS Form 7d; 7 CFR §1753.22; Form 553a |
| L12 | Federal Compliance Monitoring on RUS-Financed Projects | 40 USC §3142 (Davis-Bacon); 29 CFR Part 5; 7 CFR Part 1b; NEPA conditions of approval; 2 CFR §200.334 |

---

## Section 2: All Findings — Deduped + Severity-Sorted

### HIGH Findings (24 total)

| ID | Source | Lesson | Finding | Resolution |
|----|--------|--------|---------|------------|
| H-01 | R-2 C-1 / R-3 H-2 | L01 | `acceptance walk`, `punch list`, `kick-back authority`, `inspector (OSP)` proposed as vocabulary_introduced in T13.L01 — all already in T10.L11 vocabulary_introduced. Must be vocabulary_assumed. | Move all four to vocabulary_assumed: → T10.L11 |
| H-02 | R-3 H-1 | L01 | `inspector (OSP)` triple-introduction cascade — T01.L06 + T10.L11 + proposed T13.L01. Must be vocabulary_assumed pointing to T01.L06 (first introduction). | vocabulary_assumed: `inspector (OSP) → T01.L06` |
| H-03 | R-2 C-8 | L05 | Slack minimums conflict: T13.L05 proposed "30 ft aerial / 50–100 ft vault" contradicts T10.L06 authored MSA values. T13.L05 cannot introduce independent minimums. | T13.L05 defers to T10.L06 MSA framing: "inspect against project-specific MSA schedule per T10.L06" — no independent numeric minimums. |
| H-04 | R-2 C-14 / R-6 H-1 | L08 | §32.2420 in T13.L08 vocabulary_introduced repeats cascade bug P1 (should be §32.2411 Poles). Also embedded in L08 learning objective LO-3 text. Both must be corrected. | Replace §32.2420 with §32.2411 (Poles) throughout L08 — definition, vocab, LO text. §32.2411 = "Poles"; §32.2420 = parent "Cable and wire facilities" category. |
| H-05 | R-4 H-1 | L07 | FCA implied-certification exposure missing from T13.L07 — T04.L09 introduces False Claims Act; T13.L07 Form 219 certification lesson must cross-reference. | Add vocabulary_assumed: `FCA implied certification → T04.L09`. Add L07 content block: inspector signing Form 219 = federal certification; FCA §3729 exposure for material false statements. |
| H-06 | R-4 H-2 | L01/L09 | "Waiver by course of conduct" / implied acceptance doctrine missing — if inspector approves defective work repeatedly, contractor may argue waiver of strict compliance. | Add to L01 (inspector authority) + L09 (dispute resolution): inspector's written objection preserves owner's rights; silence = implied acceptance under AIA A201-2017 §3.3.1. |
| H-07 | R-5 H-1 | L03 | Visual sag check method described but NOT taught step-by-step — no string-line method, no midspan location technique, no escalation criterion. | L03 must add: step-by-step visual sag inspection procedure (string-line setup, midspan identification, sag measurement, compare to engineered schedule, escalation path when outside tolerance). |
| H-08 | R-5 H-2 | L06 | BranchingScenario L06 punishes correct behavior — wrong-cable-type scenario gives Option A (accept with note) as "green" without teaching verification step. Inspector must know HOW to confirm cable type before deciding. | Restructure BranchingScenario L06: first branch = "How do you verify cable type?" (T12 OTDR trace review, jacket print verification, delivery ticket cross-check). Decision tree only after verification step. |
| H-09 | R-5 H-3 | L04 | Clamp-on ground resistance meter — zero HOW instruction (where clamp goes, connected vs. disconnected measurement, EM interference, loop vs. single-rod). Inspector cannot use tool from prose description alone. | L04 must add: WorkedExample for ground resistance measurement — clamp placement on grounding conductor, connected vs. disconnected procedure (IEEE 81-2012 §7), EM interference check, 25Ω acceptance threshold (NEC §250.56), record format. |
| H-10 | R-6 H-2 | L10 | Capstone L10 does not assess L05 (slack/access) or L09 (contractor rights/dispute) — 2 of 12 lessons unassessed in capstone quiz. | Add capstone quiz questions covering L05 slack inspection scenario and L09 contractor-dispute BranchingScenario. |
| H-11 | R-6 H-3 | L01 or new | Inspector-arrival workflow not taught in any lesson — learners know WHAT to inspect but not HOW to organize a workday (pre-work review, site check-in, crew identification, form setup, end-of-day record). | Add to L01: Inspector's Daily Workflow: (1) review Form 565 from prior day + open punch items, (2) check contractor schedule for the day, (3) site arrival check-in (contractor representative present?), (4) environmental conditions check, (5) record open + active, (6) end-of-day: complete Form 565, outstanding items logged. |
| H-12 | R-7 H-1 | L03 | Pre-climb pole condition assessment / go-no-go decision tree missing — T18.L04 covers aerial-lift fall protection but does NOT cover pre-climb pole structural go/no-go. T13.L03 must teach this. | Add L03 content: pre-climb inspection protocol (pole condition, woodpecker holes, soil condition, lean angle, existing climbing aids), go/no-go criteria, escalation when pole fails (NESC Rule 261 condemnation process). vocabulary_assumed: `fall protection, aerial lift → T18.L04` — but pre-climb structural go/no-go is T13-owned content. |
| H-13 | R-7 H-2 | L04 | T13.L04 underground inspection has no confined-space cross-reference — vault descent requires atmospheric testing per 29 CFR 1910.268(o). Failure is a LIFE SAFETY gap. | Add vocabulary_assumed: `confined space, atmospheric testing, attendant → T18.L03`. L04 body: before vault descent, inspector must confirm atmospheric testing (O₂, CO, H₂S, LEL), attendant present, rescue equipment staged — ALL per T18.L03 protocol. Inspector never overrides this requirement. |
| H-14 | R-8 H-1 | L02 | Pre-construction acceptance criteria communication missing — RUS Form 515 §3(a) + FHWA CPMI require pre-construction conference establishing quantified pass/fail thresholds BEFORE construction starts. T13 has no L02 teaching this. | L02 content: pre-construction conference checklist (RUS Form 515 §3(a) compliance), written acceptance criteria document signed by borrower + contractor + engineer, quantified pass/fail for: burial depth tolerance, lashing pitch range, slack minimums per MSA, ground resistance threshold, OTDR pass/fail per T12 budgets. |
| H-15 | R-8 H-2 | L01/L02 | Concurrent inspection cadence missing — T13 teaches WHAT to inspect but never WHEN (continuous / milestone / sampling). Constructive-acceptance doctrine applies if inspector never shows up. | L02 must add: three FHWA inspection cadence models (continuous/milestone/sampling), how to document which cadence applies, inspector's obligation to be present for HDD pulls, joint-use surveys, OTDR witnessing per 7 CFR §1755.400(b). |
| H-16 | R-9 H-1 | L01 + new L11 | RUS Form 565 (7 CFR §1753.19) never mentioned anywhere in T13 — the DAILY inspection report that backs Form 219. GFR will suspend advances for incomplete Form 565 chain. | Add Form 565 to L01 as the primary daily documentation tool. Create new L11 (Daily Inspection Records) covering Form 565 fields, "competent resident inspection at all times" obligation, Form 565→Form 7d federal advance chain. |
| H-17 | R-9 H-2 | L07 + new L11 | RUS Form 553a (Contractor's Certificate) and Form 7d (advance authorization) never mentioned — inspector's records are the federal loan advance evidentiary basis; inspector must understand the Form 565 → Form 7d → Form 553a → Form 219 chain. | L07 must add: Form 553a parallel close-out requirement (inspector confirms in process before signing Form 219). L11 must teach the full federal advance chain and the inspector's evidentiary role. |
| H-18 | R-9 H-3 | New L12 | Davis-Bacon Act (40 USC §3142) prevailing wage monitoring — WH-347 certified payroll collection (weekly), wage poster verification, worker classification spot-check — zero coverage in any prior round. GFR audit will find missing WH-347s immediately. | Create new L12 (Federal Compliance Monitoring) covering: Davis-Bacon applicability to all RUS projects, WH-347 weekly collection cadence, wage determination verification (SAM.gov), poster check procedure, classification spot-check vs. payroll, escalation path for late WH-347. |
| H-19 | R-10 H-1 | L07 | OTDR baseline archive format/destination verification missing from Form 219 close-out — 7 CFR §1755.404(b) + Format V (§1755.407) requires bidirectional SOR-format traces delivered to OWNER (not contractor), launch cable subtraction confirmed. Inspector must verify this. | L07 content: OTDR archive verification checklist — (1) bidirectional traces present, (2) SOR format (not PDF-only), (3) launch cable verified subtracted, (4) archive delivered to borrower/owner records. citation: 7 CFR §1755.404 + §1755.407. |
| H-20 | R-10 H-2 | L04 | GIS/811 locate baseline GPS accuracy verification absent from underground inspection. ASCE 38-22 Quality Levels apply. Inspector at Form 219 sign-off is the last check before 811 locate record becomes permanent. | L04 content: GPS accuracy verification for as-built records (ASCE 38-22 QL-A through QL-D), inspector confirms GPS equipment accuracy ≤ project specification, locate ticket system cross-check before close-out. vocabulary_assumed: `locate ticket → T10.L01`. |
| H-21 | R-11 H-1 | L07 or L12 | OTDR instrument calibration interval + NIST-traceable reference verification missing — Telcordia GR-196-CORE §5.5 requires annual calibration. Inspector must verify calibration label, log serial number, run reference fiber check before acceptance testing. | L07 (or L12 as calibration section): inspector pre-test checklist: OTDR calibration label current (annual per GR-196-CORE), serial number logged on Form 565, launch fiber reference check run and documented. vocabulary_assumed: `OTDR → T12.L07`. |
| H-22 | R-11 H-2 | L07 or L12 | OLTS power meter + light source independent calibration missing — TIA-526-7 §8 requires calibration. Inspector must witness reference measurement at start of each test session. | L07 (or L12): OLTS calibration check: witness calibration-reference jumper measurement at session start, log meter reading vs. manufacturer calibration record, confirm within TIA-526-7 tolerance before accepting test results. vocabulary_assumed: `OLTS → T12.L06`. |
| H-23 | R-3 M-1 confirmed HIGH by R-4 | L04/L07 | NEC §250.53 cited throughout R-1 brief for 25Ω threshold — WRONG section. Correct = NEC §250.56 (ground resistance threshold). §250.53 covers installation method/depth, not acceptance threshold. | Replace every occurrence of NEC §250.53 with NEC §250.56 in L04 and L07. Verify T14 vocabulary_assumed pointer: `ground resistance threshold → T14.L06` which correctly cites §250.56. |
| H-24 | R-3 M-4 confirmed HIGH cascade | L04 | `proctor density` in BOTH T13.L04 vocabulary_introduced AND vocabulary_assumed → T10.L08 — self-referential DAG loop. Cannot be both. | Remove `proctor density` from T13.L04 vocabulary_introduced. It was introduced in T10.L08. L04 uses vocabulary_assumed: `proctor density → T10.L08`. |

---

### MED Findings (27 total)

| ID | Source | Lesson | Finding |
|----|--------|--------|---------|
| M-01 | R-3 M-3 | L04/L10 | `cover card` dual-definition conflict — T10.L04 = documentation form; T13.L04 proposed = physical probing tool. Author must define T13.L04's "cover card" as the physical depth-verification card (not documentation) and distinguish from T10.L04 usage, or choose a different term. |
| M-02 | R-3 M-2 | L01 | QA/QC: R-3 verified it is NOT in T10.L11 formal vocabulary_introduced — T13.L01 introduction of `QA/QC` is DEFENSIBLE. vocabulary_introduced in T13.L01 confirmed valid. |
| M-03 | R-4 M-1 | L07 | OTDR SOR file retention + chain of custody missing — inspector must document who holds the SOR archive file, where delivered, to whom, on what date. |
| M-04 | R-4 M-2 | L04 | Deviation log at road crossings below permit depth — BranchingScenario Option C "accept with engineer note" is inappropriate for permit-required depths. Below-permit depth = mandatory DSC, not optional note. Creates "known-deficiency acceptance" liability. |
| M-05 | R-4 M-3 | L07 | Inspector personal field notebook is discoverable under FRCP Rule 34. Inspector must be taught: personal notes = litigation evidence; write as if opposing counsel will read them; never personal commentary about contractor personnel. |
| M-06 | R-5 M-1 | L03 | Drip loop — no minimum drip arc inspection criterion taught. Inspector needs an objective measurable standard (e.g., ≥ 6-inch arc below weather head or LBH per manufacturer spec) not just "ensure drip loop present." |
| M-07 | R-5 M-2 | L04 | Pedestal access check is a flat list without order of operations. Learner needs a sequential checklist (exterior visual → door hardware → interior clearance → rodent seal → terminal connections → grounding wire) not a parallel bullet list. |
| M-08 | R-5 M-3 | L05 | Slack verification — tape-measure instruction exists; recording FORMAT not shown. Author must add: what goes in the Form 565 entry for slack verification (coil count × estimated per-wrap length + GPS coordinates of vault or structure). |
| M-09 | R-5 M-4 | L01/L09 | "Segment" undefined in inspection context for punch-list/kick-back rule (≥3 deficiencies in a segment = kick-back). Must define "segment" — is it a span, a route section, a contract phase? vocabulary_introduced: `inspection segment` needed in L01. |
| M-10 | R-5 M-5 | L04 | Bond continuity check — "ohmmeter" ambiguous. Standard DMM is insufficient for resistance checks below 1Ω (lead resistance dominates). Must specify 4-wire Kelvin measurement or low-resistance ohmmeter (DLRO) for bond straps ≤ 0.1Ω requirement. |
| M-11 | R-5 M-6 | L01 or new | No inspector's tool kit established — torque wrench never mentioned in T13 despite L06 hardware inspection requiring torque verification. Add to L01 or L02: standard inspector kit list including torque wrench (with ASME B107.300 after-drop requirement per R-11). |
| M-12 | R-5 M-7 | L06/L09 | BranchingScenarios present decisions in social vacuum — no "contractor disputes the finding on-site" branch. Every field scenario must include the branch where contractor supervisor pushes back and learner must maintain position with documentation vs. escalate. |
| M-13 | R-6 LO-misalign | L02 | L02 LO-3 claims "demonstrate field technique for pre-construction baseline establishment" but the WorkedExample only tests math (sag schedule interpolation). Either add a field-technique interactive (AnnotatedDiagram of baseline survey process) or revise LO-3 to match the actual assessment. |
| M-14 | R-6 LO-misalign | L03 | L03 LO-1 claims "identify 5 aerial deficiency types" but the BranchingScenario only classifies 3 (sag, drip loop, lashing pitch). Either add 2 more deficiency types to the scenario or revise LO to 3 types. |
| M-15 | R-6 scaffold | L01→L02 | Lesson L01 introduces the inspector role but there is no bridge to L02's pre-construction checklist. Add a transition exercise: L01 closes with a "Before you start: what must be in place?" structured question that primes L02's pre-construction conference content. |
| M-16 | R-6 scaffold | L06→L07 | L06 covers material acceptance but L07 opens directly on Form 219 without connecting material acceptance records as a Form 219 component. Add a 2-paragraph bridge in L07 foundations: "The Form 219 summarizes what L06's material inspection records documented." |
| M-17 | R-7 M-1 | L03 | Clearance measurement near joint-use supply conductors — 29 CFR 1910.268(b)(20) requires non-conductive measuring tools. Author must add safety note: metal tape prohibited within MAD of energized conductors; use fiberglass/wood rod or laser distance meter. vocabulary_assumed: `MAD, MAB → T18.L07`. |
| M-18 | R-7 M-2 | L04 | Depth probing at inspection visit without valid 811 locate ticket — inspector must confirm CGA Best Practices §4.4 locate ticket is active before directing any probing. vocabulary_assumed: `Call-811, locate ticket → T10.L01`. |
| M-19 | R-7 M-3 | L03/L04 | Inspector's own HVLV vest + roadside MUTCD stop requirements (23 CFR 634.2, MUTCD Part 6H H-27) — inspector IS a roadside worker when observing aerial or underground work near traffic. Add to L03/L04: inspector PPE obligations on roadside inspection visits. vocabulary_assumed: `MUTCD traffic control → T10.L03`. |
| M-20 | R-8 M-1 | L09 | Field-condition deviation protocol (DSC/change order) missing — 7 CFR §1753.47(d) requires written engineer approval for spec changes; verbal inspector approval is void. Inspector must know: they CANNOT approve spec deviations; they escalate to EOR. |
| M-21 | R-8 M-2 | L09 | Retainage release milestone distinction — substantial completion vs. final completion. Inspector delaying substantial completion sign-off for cosmetic/minor items creates contractor claims for extended general conditions. Inspector must know the AIA A201 §9.8 distinction. |
| M-22 | R-8 M-3 | L09 | Re-inspection cost allocation missing — contractor pays re-inspection cost if deficiency confirmed; owner pays if finding reversed. Inspector's punch-list recommendation is not binding (engineer makes determination). |
| M-23 | R-9 M-1 | L04/L09 | Environmental conditions of approval at construction site — inspector must review NEPA conditions before construction starts and log compliance on each Form 565. Inadvertent ESA/Section 106 discovery protocol (stop-work + 24-hour SHPO notification). vocabulary_assumed: `NEPA → T09`. |
| M-24 | R-9 M-2 | L07 | 2 CFR §200.334 federal grant records retention — 3-year minimum post-final-expenditure-report; inspector's obligation is to TRANSFER complete records package to borrower at close-out, not just retain personally. |
| M-25 | R-10 M-1 | L05/L07 | Slack location register for emergency restoration — inspector records at close-out must include GPS coordinates of slack storage, structure type, lock/access, street address for 24/7 emergency dispatch use. |
| M-26 | R-10 M-2 | L06/L07 | Hardware lot/batch traceability for warranty claims — material certification letters must include batch/lot numbers; inspector must verify lot numbers on certs match delivery tickets, not just that cert exists. |
| M-27 | R-11 M-3/M-4 | L04/L07 | Ground resistance meter calibration (IEEE 81-2012 §12 pre-test resistive reference) + torque wrench calibration (ASME B107.300 after-drop requirement: >18-inch drop requires recalibration before next use). Inspector must verify calibration currency before accepting measurements. |

---

### LOW Findings (9 total)

| ID | Source | Lesson | Finding |
|----|--------|--------|---------|
| L-01 | R-7 L-1 | L03 | Drop-zone positioning when directing a climber — inspector should position themselves outside the drop zone, not directly below. Field-safety habit. |
| L-02 | R-7 L-2 | L04 | Insulated gloves (1910.268(n)(4)) required during any grounding wire connection / disconnection inspection work near energized conductors. vocabulary_assumed: `PPE → T18.L01`. |
| L-03 | R-9 L-1 | L07 | RUS Bulletin 1753F-401 and 7 CFR §1755.404 should be co-cited as test procedure authorities in L07 — use both: §1755.404 as regulatory anchor + 1753F-401 as practical field procedures document. |
| L-04 | R-9 L-2 | L01 | "Why federal documentation matters" sidebar — connect Form 565 records to federal loan advance releases; inspector records = the borrower's evidence for cash flow. Convert bureaucratic obligation into self-interested motivation. |
| L-05 | R-10 M-3 (LOW status) | L07 | Inspector witnessing OTDR tests is MANDATORY per 7 CFR §1755.400(b) — not optional attendance. Author must use "shall witness" language, not "should be present." |
| L-06 | R-11 M-3 | L12 | Measurement uncertainty framework — "too close to call" guidance: within ±0.3 dB of OLTS pass/fail limit → re-measure and document; within ±5% of 25Ω → re-measure with second method. Gives inspectors a principled response to borderline readings. |
| L-07 | R-11 M-4 | L07/L11 | Defensible inspection record standards — timestamps (GPS-synchronized preferred), inspector identity (full name + org + license), corrections (single-line strike-through only, not white-out), significant digits consistent with instrument precision, media durability (weatherproof paper or digital with backup). |
| L-08 | R-6 transfer-gap | L09 | Transfer scenario gap: prior-inspector work acceptance — when inspector joins a project mid-construction and must assess work they did not observe. Add BranchingScenario: what does inspector do if prior Form 565 records are incomplete for work they must now certify on Form 219? |
| L-09 | R-8 M-2 / R-6 LO | L10 | Capstone scenario should include a retainage-release dispute scenario (substantial vs. final completion) — tests L09's AIA A201 §9.8 content and legal consequence framing. |

---

## Section 3: Conflicts Resolved

### C-14 — §32.2420 vs §32.2411 (Poles)

**Conflict:** R-1 brief proposed `47 CFR §32.2420` as the vocabulary_introduced term in T13.L08. R-2, R-3, and R-6 all independently flagged this as the cascade bug P1 from the DAG registry.

**Resolution (LOCKED):** 47 CFR §32.2411 = "Poles" (the correct plant-account for pole inspection records). 47 CFR §32.2420 = parent "Cable and wire facilities" category — does NOT map to poles. This mirrors the T01 polish-3 cascade fix (`d7161ad`). Both the vocabulary_introduced entry AND the L08 LO-3 learning objective text must use §32.2411.

**Primary source:** 47 CFR Part 32 Subpart B plant accounts. Confirmed by dag-registry P1 + R-3 tiebreaker + T04 polish cascade history.

---

### C-8 — Slack Minimums

**Conflict:** R-1 proposed T13.L05 teach "30 ft aerial / 50–100 ft vault" slack storage minimums. R-2 flagged these contradict T10.L06's authored MSA-based framing (50 ft intermediate / 100 ft splice-point per T10.L06).

**Resolution (LOCKED):** T13.L05 DOES NOT introduce independent numeric minimums. It defers entirely to T10.L06 MSA framing: "verify against the project-specific MSA slack schedule (introduced in T10.L06)." The lesson teaches HOW to inspect slack (measure, record, compare) not WHAT the minimums are. vocabulary_assumed: `MSA slack schedule → T10.L06`.

**Rationale:** T10.L06 is an authored lesson — its numbers are the ground truth. T13 cannot teach conflicting values without violating the prerequisite invariant.

---

### C-1 / R3-H1 / R3-H2 — T13.L01 Vocabulary_Introduced

**Conflict:** R-1 proposed 5 terms as vocabulary_introduced in T13.L01: `acceptance walk`, `punch list`, `kick-back authority`, `inspector (OSP)`, `QA/QC`. R-2 and R-3 found all but `QA/QC` were already introduced in T10.L11.

**Resolution (LOCKED):**
- `acceptance walk` → vocabulary_assumed: T10.L11
- `punch list` → vocabulary_assumed: T10.L11
- `kick-back authority` → vocabulary_assumed: T10.L11
- `inspector (OSP)` → vocabulary_assumed: T01.L06 (first introduction — T01 precedes T10)
- `QA/QC` → vocabulary_introduced: T13.L01 ✅ (confirmed by R-3 M-2: not in T10.L11 vocabulary_introduced array)

**Net-new vocabulary T13.L01 may introduce:** `QA/QC` + genuinely new terms: `material deficiency`, `rework`, `retainage` (if not already in T10 lessons — author must verify against dag-registry.json before publishing).

---

### R-3 M-1 / R-4 triangulation — NEC §250.53 vs §250.56

**Conflict:** R-1 brief cited NEC §250.53 for the 25Ω ground resistance acceptance threshold. R-3 M-1 identified this as wrong (§250.53 covers installation method/depth, not the threshold). R-4 confirmed via T14 authored lessons.

**Resolution (LOCKED):** NEC §250.56 = ground resistance threshold (25Ω). NEC §250.53 = installation method. Replace all occurrences of §250.53 with §250.56 in T13.L04 and T13.L07. vocabulary_assumed pointer: `ground resistance threshold → T14.L06` (where §250.56 is taught).

---

### R-10 M-3 — "RUS 1753F-401" vs 7 CFR §1755.404

**Resolution (LOCKED):** Both are valid, not in conflict. Use BOTH as co-citations. 7 CFR §1755.404 = regulatory anchor (codified acceptance test requirement). RUS Bulletin 1753F-401 = practical field procedures. Author cites §1755.404 first (regulatory primacy), then 1753F-401 as supplementary field reference.

---

## Section 4: Vocabulary_Introduced Final (DAG-Clean)

Author MUST verify each term against `audit-output/dag-registry.json` before publishing. Any term already in the registry → vocabulary_assumed, not vocabulary_introduced.

### Confirmed vocabulary_introduced (terms first introduced in T13)

**T13.L01:**
- `QA/QC` (confirmed not in T10.L11 formal vocabulary_introduced — R-3 M-2)
- `material deficiency` (verify against dag-registry)
- `rework` (verify against dag-registry)
- `retainage` (verify against dag-registry — if in T10, move to assumed)
- `inspection segment` (M-09 — needed to define the punch-list kick-back ≥3 rule)
- `inspector-arrival workflow` (H-11 addition)

**T13.L02:**
- `pre-construction acceptance baseline`
- `acceptance criteria document`
- `inspection cadence` (continuous / milestone / sampling)

**T13.L03:**
- `pre-climb structural assessment`
- `go/no-go decision (pole condition)`

**T13.L04:**
- `ASTM D1557 Modified Proctor` (verify — may be in T10.L08)
- `clamp-on ground resistance measurement procedure` (HOW to use the tool — distinct from the threshold)

**T13.L05:**
- *(vocabulary_introduced = none — this lesson is entirely vocabulary_assumed pointing to T10.L06 MSA content)*

**T13.L06:**
- `material lot traceability`
- `lot/batch number verification`

**T13.L07:**
- `FCA implied certification` (vocabulary_assumed: → T04.L09; not introduced here — see H-05)
- `OTDR archive verification checklist`
- `records package handoff`
- `Form 219 certification scope`
- `OTDR witness obligation` (vocabulary_assumed: → T12.L07 where OTDR test procedure is taught)

**T13.L08:**
- `47 CFR §32.2411 (Poles)` (C-14 corrected — was §32.2420)
- `joint-use inspection record`
- `clearance verification log`

**T13.L09:**
- `DSC (differing-site conditions) protocol`
- `retainage release milestone` (substantial vs. final completion)
- `re-inspection cost allocation`

**T13.L11 (new):**
- `RUS Form 565 (Inspector's Daily Report)`
- `7 CFR §1753.19 inspection obligation`
- `loan advance suspension trigger`
- `competent resident inspection`
- `RUS Form 553a (Contractor's Certificate)`
- `RUS Form 7d (advance authorization)`
- `construction advance chain`
- `federal advance certification`

**T13.L12 (new):**
- `Davis-Bacon Act`
- `prevailing wage determination`
- `WH-347 (certified payroll)`
- `wage determination poster`
- `worker classification (Davis-Bacon)`
- `NEPA condition of approval`
- `ESA §7 incidental-take protocol (construction site)` (vocabulary_assumed: `ESA §7 consultation → T09` for the broader process)
- `inadvertent discovery protocol (Section 106)` (vocabulary_assumed: `Section 106 → T09`)
- `environmental compliance monitoring log`
- `2 CFR §200.334 records retention`
- `non-Federal entity obligation`

### Confirmed vocabulary_assumed (terms from prior topics used in T13)

| Term | Source topic → lesson |
|------|----------------------|
| acceptance walk | T10.L11 |
| punch list | T10.L11 |
| kick-back authority | T10.L11 |
| inspector (OSP) | T01.L06 |
| MSA slack schedule | T10.L06 |
| proctor density | T10.L08 |
| as-built drawings | T10.L11 |
| confined space, atmospheric testing, attendant | T18.L03 |
| fall protection, aerial lift | T18.L04 |
| MAD, MAB | T18.L07 |
| PPE (general) | T18.L01 |
| Call-811, locate ticket | T10.L01 |
| MUTCD traffic control | T10.L03 |
| OTDR | T12.L07 |
| OLTS | T12.L06 |
| ground resistance threshold (25Ω, NEC §250.56) | T14.L06 |
| FCA implied certification | T04.L09 |
| NEPA | T09 |
| ESA §7 consultation | T09 |
| Section 106 (NHPA) | T09 |
| RUS Form 219 | *(introduced in T13.L07 — first mention; verify dag-registry)* |

---

## Section 5: Author Instructions

### Critical path — apply ALL HIGH findings before submitting for RT

The 24 HIGH findings above are non-negotiable. Every one must be addressed in the authored lessons. The two most common cascade patterns to watch for:

1. **§32.2411 everywhere §32.2420 appears** — search L08 body, vocabulary, AND learning objectives.
2. **NEC §250.56 everywhere §250.53 appears** — L04 and L07.

### Lesson-by-lesson author checklist

**L01 (Inspector Role)**
- [ ] Introduce `QA/QC` as vocabulary_introduced; move 4 R-1 proposed terms to vocabulary_assumed (H-01, H-02)
- [ ] Add inspector-arrival daily workflow (H-11)
- [ ] Add "waiver by course of conduct" warning (H-06)
- [ ] Add `inspection segment` definition for punch-list kick-back ≥3 rule (M-09)
- [ ] Add "why federal documentation matters" sidebar linking Form 565 to cash flow (L-04)
- [ ] Reference Form 565 as the primary daily record tool (H-16)
- [ ] Concurrent inspection cadence intro (H-15 — pre-construction framing)

**L02 (Pre-Construction Baseline)**
- [ ] Add pre-construction conference checklist per RUS Form 515 §3(a) (H-14)
- [ ] Add three FHWA inspection cadence models (H-15)
- [ ] Revise LO-3 to match actual assessment type (M-13)
- [ ] Add L01→L02 transition bridge exercise (M-15)

**L03 (Aerial Inspection)**
- [ ] Add step-by-step visual sag inspection procedure with escalation (H-07)
- [ ] Add pre-climb structural go/no-go decision tree (H-12)
- [ ] Add drip loop minimum arc inspection criterion (M-06)
- [ ] Add non-conductive tool requirement for clearance measurement near supply conductors (M-17)
- [ ] Add inspector roadside PPE obligations (M-19)
- [ ] Add drop-zone positioning note for inspector observing climber (L-01)
- [ ] Revise LO-1 to match actual 3 deficiency types in BranchingScenario OR add 2 more (M-14)

**L04 (Underground Inspection)**
- [ ] Add confined-space cross-reference (vocabulary_assumed → T18.L03) — mandatory safety cross-reference (H-13)
- [ ] Add clamp-on ground resistance HOW-TO WorkedExample with IEEE 81 procedure (H-09)
- [ ] Fix `proctor density`: remove from vocabulary_introduced; add to vocabulary_assumed → T10.L08 (H-24)
- [ ] Fix NEC §250.53 → §250.56 throughout (H-23)
- [ ] Fix BranchingScenario Option C for below-permit depth (M-04)
- [ ] Add `cover card` term disambiguation vs T10.L04 usage (M-01)
- [ ] Add pedestal access sequential checklist (M-07)
- [ ] Add 4-wire Kelvin/DLRO specification for bond continuity check (M-10)
- [ ] Add 811 locate ticket active requirement before probing (M-18)
- [ ] Add GPS accuracy verification (ASCE 38-22 QL) for as-built records (H-20)
- [ ] Add ground resistance meter calibration pre-test check (M-27)
- [ ] Add insulated gloves for grounding work (L-02)
- [ ] Add inspector MUTCD/HVLV vest for roadside work (M-19)

**L05 (Slack Inspection)**
- [ ] Remove independent numeric minimums; add vocabulary_assumed: `MSA slack schedule → T10.L06` (H-03)
- [ ] Add slack recording format for Form 565 (M-08)
- [ ] Add slack location register for emergency restoration (M-25)

**L06 (Material Acceptance)**
- [ ] Restructure BranchingScenario: add verification step BEFORE decision tree (H-08)
- [ ] Add lot/batch number verification against delivery tickets (M-26)
- [ ] Add "contractor disputes finding on-site" branch to BranchingScenario (M-12)
- [ ] Add L06→L07 bridge connecting material certs as Form 219 component (M-16)

**L07 (Close-Out Documentation)**
- [ ] Add FCA implied-certification cross-reference (vocabulary_assumed → T04.L09) (H-05)
- [ ] Fix NEC §250.53 → §250.56 if cited (H-23)
- [ ] Add OTDR archive verification checklist (H-19)
- [ ] Add OTDR and OLTS calibration witness requirement (H-21, H-22)
- [ ] Add Form 553a parallel close-out requirement (H-17)
- [ ] Add "inspector witnessing is mandatory per 7 CFR §1755.400(b)" — use "shall" language (L-05)
- [ ] Add OTDR SOR chain of custody documentation (M-03)
- [ ] Add inspector's personal notebook = discoverable teaching (M-05)
- [ ] Add 2 CFR §200.334 federal records retention + records package handoff to borrower (M-24)
- [ ] Add co-citation: 7 CFR §1755.404 + RUS Bulletin 1753F-401 (L-03)
- [ ] Add defensible record standards (GPS timestamp, strike-through corrections, significant digits) (L-07)

**L08 (Joint-Use and Clearance)**
- [ ] Fix §32.2420 → §32.2411 in vocabulary_introduced, LO-3, and body text (H-04, C-14)
- [ ] Verify no other §32.2420 occurrences in L08

**L09 (Contractor Relations)**
- [ ] Add "waiver by course of conduct" from contractor perspective (H-06)
- [ ] Add DSC/change-order protocol: inspector CANNOT approve spec deviations verbally (M-20)
- [ ] Add retainage release milestone distinction (M-21)
- [ ] Add re-inspection cost allocation rule (M-22)
- [ ] Add "contractor disputes finding on-site" BranchingScenario branch (M-12)
- [ ] Add prior-inspector work acceptance scenario (L-08)
- [ ] Add `inspection segment` usage in kick-back rule (M-09)

**L10 (Capstone)**
- [ ] Add quiz questions covering L05 slack inspection and L09 contractor dispute (H-10)
- [ ] Add retainage release dispute scenario (L-09)
- [ ] Ensure all 12 lessons (including new L11/L12) are assessed in capstone

**L11 (New — Daily Inspection Records)**
- [ ] vocabulary_introduced: Form 565, §1753.19 obligation, loan advance suspension, competent resident inspection, Form 553a, Form 7d, construction advance chain (H-16, H-17)
- [ ] Content: Form 565 required fields with worked examples (compliant vs. deficient entries)
- [ ] Content: "competent resident inspection at all times" — multi-crew implications
- [ ] Content: Form 565 → Form 7d → Form 553a → Form 219 federal advance chain diagram
- [ ] Content: inspector transition mid-project (vacation/illness gap protocol)
- [ ] Content: GFR audit finds: advance suspension for missing Form 565 weeks
- [ ] Add Quiz + BranchingScenario: "GFR asks for Form 565 — 2 weeks are missing. What do you do?"

**L12 (New — Federal Compliance Monitoring)**
- [ ] vocabulary_introduced: Davis-Bacon Act, prevailing wage determination, WH-347, wage poster, NEPA conditions of approval, environmental compliance log (H-18, R-9-M-1)
- [ ] Content: Davis-Bacon applicability (ALL RUS-financed construction, no dollar threshold exception)
- [ ] Content: WH-347 weekly collection — cadence, who receives, what to do if late (2+ weeks = notify RUS)
- [ ] Content: Wage determination verification (SAM.gov / prevailing-wages.gov, confirm correct location + work type)
- [ ] Content: Worker classification spot-check from field
- [ ] Content: Book vs. field practice — biweekly submissions are non-compliant; inspector must enforce weekly cadence
- [ ] Content: NEPA conditions of approval review before construction starts
- [ ] Content: Environmental compliance monitoring on Form 565 (daily log of conditions)
- [ ] Content: Inadvertent discovery protocol (Section 106): stop-work, no disturbance, notify borrower, 24-hr SHPO
- [ ] Add measurement uncertainty framework for borderline readings (L-06)
- [ ] Add Quiz on Davis-Bacon obligations + NEPA inadvertent-discovery decision tree

### Standing author requirements (all lessons)

- **Flashcards required in every lesson.** Every term in vocabulary_introduced MUST have a `<Flashcard>` component rendered inline. Definition pulled verbatim from lesson prose.
- **No AI references.** No "generated by," no meta-signals. Write as senior OSP engineer.
- **Book vs. field practice.** Where standard diverges from field practice, present both explicitly.
- **Math requires:** (a) plain-English description, (b) variable definitions with units, (c) every step shown, (d) worked numerical example, (e) sanity-check sentence.
- **Primary-source numeric claims:** before committing any numeric value (resistance thresholds, calibration intervals, retention periods, wage thresholds), verify against primary source cited in this canonical. Do NOT trust R-1 brief values for §250.53 (corrected to §250.56) or §32.2420 (corrected to §32.2411).
- **Run `cd osp-training && npm run build` before push.** Vite build must pass clean.
- **vocabulary_assumed DAG pointers:** verify each against dag-registry.json before finalizing lesson meta. Use exact format: `term → T##.L##`.
- **R-9 pending note (superseded):** R-9 landed at `b2e7558a` before this canonical was finalized. All R-9 findings are incorporated above. No pending items.

### Authoring order (teaching-order aware)

L11 and L12 introduce vocabulary that L07 assumes (Form 565, Form 553a, Davis-Bacon). Teaching order should be:
**L01 → L11 → L12 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10**

The `meta.order` values in lesson JSX must reflect this order (L11 = order 2, L12 = order 3, existing L02-L10 shift to order 4-12). Update course-catalog.js lesson_count from 10 to 12.

---

*=== T13 CANONICAL END ===*
