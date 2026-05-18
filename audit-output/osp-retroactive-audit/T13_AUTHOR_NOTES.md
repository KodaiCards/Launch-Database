# T13 Author Notes — Inspection & Quality Assurance

Authored by: T13 authoring agent (2026-05-18)
Final commits: `8f6a000`, `7f18797`, `db9e2fe`
Vite build: PASS — 294 modules, clean (18.36 s)

---

## Lesson summary (12 lessons, teaching order)

| order | File | Key content | Primitives |
|---|---|---|---|
| 1 | L01-inspector-role-and-qa-qc-framework | QA/QC intro, retainage, rework, waiver-by-conduct (AIA A201 §3.3.1), arrival workflow | Flashcard, BranchingScenario, TimelineSequence |
| 2 | L11-daily-inspection-records-rus-form-565 | Form 565, 7 CFR §1753.19, loan advance suspension, Form 553a, Form 7d, construction advance chain | Flashcard, BranchingScenario |
| 3 | L12-federal-compliance-monitoring-davis-bacon | Davis-Bacon Act / WH-347, NEPA conditions of approval, ESA §7 inadvertent discovery, 2 CFR §200.334 | Flashcard, BranchingScenario |
| 4 | L02-pre-construction-acceptance-baseline | Pre-construction conference checklist, acceptance criteria document, inspection cadence models | Flashcard, Sortable |
| 5 | L03-aerial-construction-inspection | Pre-climb go/no-go, sag visual procedure, drip loop criterion, lashing deficiency types | Flashcard, BranchingScenario ×2 |
| 6 | L04-underground-construction-inspection | Clamp-on resistance (IEEE 81-2012), confined space entry (29 CFR 1910.268(o)), GPS ASCE 38-22, NEC §250.56 (corrected from §250.53) | Flashcard, BranchingScenario, WorkedExample |
| 7 | L05-slack-storage-and-pedestal-inspection | Slack coil format, slack location register GPS/access requirements | Quiz only (no vocabulary_introduced) |
| 8 | L06-material-and-hardware-acceptance | Material lot traceability, three-way match, contractor dispute branch | Flashcard, BranchingScenario |
| 9 | L07-close-out-documentation-form-219 | OTDR archive checklist (SOR/bidirectional/launch-cable subtracted), FCA §3729, Form 219 certification scope, OLTS/OTDR calibration, defensible records | Flashcard, Quiz |
| 10 | L08-joint-use-and-clearance-compliance | 47 CFR §32.2411 (Poles — corrected from §32.2420), NESC Rule 232 Light-district clearance, joint-use inspection record | Flashcard, WorkedExample, Quiz |
| 11 | L09-contractor-relations-and-dispute-resolution | DSC protocol, retainage release milestones, re-inspection cost allocation, prior-inspector acceptance | Flashcard, BranchingScenario ×2 |
| 12 | L10-capstone-quiz | 25 questions covering all 12 lessons; retainage-release dispute scenario in c22 | Quiz (25 questions) |

---

## HIGH findings addressed

| # | Finding | Resolution |
|---|---|---|
| H-01 | L01 vocab_assumed without prior introduction (4 terms) | vocabulary_assumed with correct source_lesson_id for all 4 |
| H-02 | L07 vocabulary_assumed without prior introduction (Form 219) | vocabulary_assumed: T01.L05 |
| H-03 | L05 independent minimums claim | Removed; defers to T10.L06 MSA only |
| H-04/C-14 | §32.2420 → §32.2411 throughout L08 | Corrected in vocabulary_introduced, LO text, body, table |
| H-05 | L07 FCA exposure missing | Added advanced section with FCA §3729 analysis and implied-certification doctrine |
| H-06 | Waiver-by-conduct (AIA A201 §3.3.1) missing | BranchingScenario in L01 + contractor perspective in L09 |
| H-07 | L03 visual sag procedure absent | Step-by-step sag estimation procedure in L03 |
| H-08 | L06 material verification decision tree out of order | Verification step precedes decision tree |
| H-09 | L04 clamp-on procedure absent | WorkedExample with full IEEE 81-2012 clamp-on step-by-step |
| H-10 | Capstone scope gap | L10 25 questions covering ALL 12 lessons incl L05/L09 |
| H-11 | L01 inspector arrival workflow absent | TimelineSequence in L01 |
| H-12 | L03 pre-climb go/no-go decision tree absent | BranchingScenario in L03 |
| H-13 | L04 confined space cross-reference absent | T18.L03 vocabulary_assumed + atmospheric testing prerequisites in L04 body |
| H-14 | L02 pre-construction conference checklist absent | Sortable checklist in L02 |
| H-15 | L02 inspection cadence models absent | FHWA cadence models table in L02 |
| H-16 | L11 Form 565 federal record significance absent | Loan advance suspension trigger + 7 CFR §1753.19 analysis in L11 |
| H-17 | L07 Form 553a parallel close-out absent | Form 553a in close-out package table + Q4 quiz |
| H-18 | L12 Davis-Bacon WH-347 absent | Full Davis-Bacon lesson (L12 order:3) |
| H-19 | L07 OTDR archive SOR requirement absent | OTDR archive verification checklist in L07 |
| H-20 | L04 GPS/ASCE 38-22 absent | ASCE 38-22 QL-A/B/C/D in L04 |
| H-21 | L07 OTDR calibration verification absent | Telcordia GR-196-CORE annual calibration requirement in L07 |
| H-22 | L07 OLTS calibration absent | TIA-526-7 §8 calibration verification in L07 |
| H-23 | L04 §250.53 → §250.56 | Corrected in vocabulary_assumed and body throughout L04 |
| H-24 | L04 proctor density in vocabulary_introduced | Moved to vocabulary_assumed: T10.L08 |

## MED findings addressed (selected key items)

- M-03: SOR chain of custody record → L07 key_terms + checklist
- M-04: Below-permit depth = DSC note → L04 body note
- M-05: Personal notebook discoverable → L07 Q5
- M-06: Drip loop 6-inch arc criterion → L03
- M-07: Pedestal sequential checklist → L04 BranchingScenario
- M-08: Slack recording format on Form 565 → L05
- M-09: Inspection segment + kick-back threshold → L01/L09
- M-10: 4-wire Kelvin/DLRO for ≤0.1Ω → L04
- M-12: Contractor dispute branch → L06 + L09
- M-13: LO-3 alignment → L02
- M-14: LO-1 deficiency types → L03
- M-15: L01→L02 bridge → L01 closing paragraph
- M-16: L06→L07 bridge → L06 closing paragraph
- M-17: Non-conductive tools near supply conductors → L03
- M-18: 811 locate ticket → L04
- M-19: Roadside inspector PPE → L03/L04
- M-20: DSC verbal authorization prohibition → L09
- M-21: Substantial vs. final completion → L09
- M-22: Re-inspection cost allocation → L09
- M-23: NEPA condition of approval → L12
- M-24: 2 CFR §200.334 records package handoff → L07/L12
- M-25: Slack location register GPS/access fields → L05
- M-26: Lot/batch verification → L06
- M-27: Calibration pre-test → L04

## LOW findings addressed

- L-01: Drop-zone positioning → L03
- L-02: Insulated gloves UG → L04
- L-03: 7 CFR §1755.404 + RUS 1753F-401 co-citation → L07
- L-04: Form 565 cash flow sidebar → L01
- L-05: "Shall witness" language → L07
- L-06: Measurement uncertainty → L12
- L-07: Defensible record standards → L07 advanced section
- L-08: Prior inspector scenario → L09 BranchingScenario
- L-09: Retainage-release dispute scenario → L10 capstone Q22

---

## Cascade fixes confirmed

- **§32.2420 → §32.2411 (H-04/C-14):** Applied in L08 vocabulary_introduced, learning objectives, body text, table, and quiz. §32.2420 = "Cable and Wire Facilities" parent category header; §32.2411 = actual Poles account.
- **§250.53 → §250.56 (H-23):** Applied in L04 and L07. NEC §250.56 = ground resistance threshold (25 Ω); §250.53 = driven rod installation method.
- **Proctor density (H-24):** Removed from T13 vocabulary_introduced; added as vocabulary_assumed: T10.L08 in L04.

---

## Teaching order rationale

L01 → L11 → L12 → L02 → L03 → L04 → L05 → L06 → L07 → L08 → L09 → L10

L11 and L12 (order:2 and order:3) were placed early because:
- L11 introduces Form 565, Form 553a, Form 7d, construction advance chain — vocabulary that L07 assumes
- L12 introduces Davis-Bacon, NEPA conditions, ESA §7 inadvertent discovery, 2 CFR §200.334 — vocabulary that L07 assumes
- L07 (order:9) uses vocabulary_assumed references to both L11 and L12

---

## Known items for RT attention

1. L07 vocabulary_assumed references `ground resistance threshold (25Ω, NEC §250.56)` sourced to T14.L06 — confirm T14 is authored and L06 specifically introduces this term.
2. L10 capstone Q25 covers MBTA osprey scenario — this is a cross-reference to L12's inadvertent discovery protocol but expands to MBTA. RT should verify this is pedagogically coherent (MBTA is covered in T09.L04 per T09 curriculum; L12 introduces NEPA conditions; the capstone question bridges both).
3. The Vite build warning on T12/L10 (`>` character in JSX) pre-exists this authoring wave and is in T12, not T13.

=== T13 AUTHOR NOTES END ===
