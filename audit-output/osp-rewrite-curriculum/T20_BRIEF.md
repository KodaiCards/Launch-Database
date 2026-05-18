# T20 Brief — BICSI OSP Designer Certification Prep Track

**Topic ID:** T20 (numbered from C04 per ARCH.md §2)  
**Category:** Certification prep (OSP Designer + CFOS/CFOT)  
**Status:** Research brief — ready for authoring wave dispatch  
**Prepared by:** Haiku research agent  
**Date:** 2026-05-18

---

## Executive Summary

T20 is the OSP Designer certification-prep track for learners pursuing BICSI's OSP Designer credential (primary cert) and optionally FOA CFOS/CFOT credentials (secondary certs). The track assumes completion of all general topics T01–T19 and synthesizes them into exam-focused review + timed practice + full mock exams. The 12-lesson structure balances logistical primer + domain-by-domain advanced review + high-fidelity practice.

---

## 1. Exam Blueprint Summary

### BICSI OSP Designer (C01 credential)
**Public exam outline:** BICSI publishes the OSP Designer Candidate Handbook (paywalled, updated annually). Public data points:
- **Exam length:** 100 items (multiple-choice, single-answer)
- **Time limit:** 120 minutes (1.2 min/item, typical for BICSI cert exams)
- **Passing score:** ~70% (175/250 points typical BICSI scaling; final target TBD from handbook)
- **Content domains** (per BICSI OSPDR as primary reference):
  1. **Fiber Physics & Technology** — ~15% (wavelengths, modes, attenuation, dispersion, PON/FTTH)
  2. **Cable Selection & Components** — ~12% (loose-tube, ribbon, armor, connector types, performance specs)
  3. **Aerial Plant Design** — ~25% (NESC clearance, pole loading, sag-tension, grades of construction, joint-use)
  4. **Underground Plant Design** — ~20% (conduit, duct, burial depth, HDD, manhole sizing, separation rules)
  5. **Permitting & Right-of-Way** — ~8% (NEPA, environmental approvals, ROW/easement concepts)
  6. **Splicing & Termination** — ~8% (fusion vs. mechanical, end-face quality, cable preparation)
  7. **Testing & Acceptance** — ~7% (OLTS/OTDR, insertion-loss acceptance, inspection checklists)
  8. **Bonding, Grounding & Protection** — ~5% (basic MGN/ground-rod concepts; electrical awareness)

### FOA CFOS-O (Certified Fiber Optics Specialist — Outside Plant, optional secondary)
**Exam structure:** 50 items, 75 minutes. Domains align heavily with aerial + underground plant + testing. No separate mock exam; CFOS-O candidates use OSP Designer practice materials as study references.

### FOA CFOS-T (Technician level, optional secondary)
**Exam structure:** 50 items, 60 minutes. Focuses on splicing + testing. Can use OSP Designer splice/testing lessons as advanced reference; lighter conceptual depth than CFOS-O.

---

## 2. Prerequisite Mapping to T01–T19

T20 is gated on **completion of T01–T19 general topics** (per ARCH.md §3 DAG). The prerequisite structure:

| Cert-prep lesson | Primary T01–T19 sources | Secondary sources |
|---|---|---|
| T20.L01 Exam logistics + study strategy | (meta — no prerequisite) | Candidate handbook |
| T20.L02 Fiber Physics domain review | T02 (Fiber Physics, 12 lessons) | T03.L01–L05 fiber types |
| T20.L03 Cable Selection domain review | T03 (Cable Selection, 12 lessons) | T05/T06 cable application context |
| T20.L04 Aerial Design domain review | T05 (Aerial Design, 15 lessons) | T04, T07, T08 (route survey, staking, make-ready) |
| T20.L05 Underground Design domain review | T06 (Underground Design, 12 lessons) | T04, T10 (route survey, construction) |
| T20.L06 Permitting domain review | T09 (Permitting & Environmental, 12 lessons) | T04 context |
| T20.L07 Splicing & Termination domain review | T11 (Splicing, 15 lessons) | T12 (end-face inspection from testing) |
| T20.L08 Testing & Acceptance domain review | T12 (Testing, 15 lessons) | T13 (Inspection QA criteria) |
| T20.L09 Bonding & Grounding primer | T14 (Bonding/Grounding, 12 lessons) + T19 intro terms | T18 (safety context) |
| T20.L10 Scenario-based prep (complex multi-domain problems) | All T01–T19 | — |
| T20.L11 Timed practice rounds (50-item + 100-item subsets) | — | Candidate handbook samples |
| T20.L12 Full 100-item mock exam (timed, scored, analyzed) | — | BICSI OSP Designer blueprint |

---

## 3. Proposed 12-Lesson Structure

### Lesson breakdown

| # | Title | Purpose | Duration (min) | Prerequisites |
|---|---|---|---|---|
| L01 | Exam Logistics & Study Strategies | Candidate handbook primer; time management; per-domain question patterns; weak-area identification | 20 | none (meta) |
| L02 | Fiber Physics Domain Review | Targeted review of T02 content: wavelengths, attenuation, dispersion, bandwidth, link-budget context in exam questions | 25 | T02 |
| L03 | Cable Selection Domain Review | Targeted review of T03 + cable-product specs in RUS/ICEA context; performance-vs-application decision trees | 20 | T02, T03 |
| L04 | Aerial Design Domain Review | Synthesize T05 (NESC, sag-tension, loading) + T04 context (survey) + T07 (staking marks); exam emphasis on Rule 232 clearance calculations | 30 | T04, T05, T07 |
| L05 | Underground Design Domain Review | Synthesize T06 conduit/duct + T10 construction reality; exam emphasis on fill-rule decision-making + manhole sizing ratios | 25 | T03, T06, T10 |
| L06 | Permitting & Environmental Domain Review | Concentrated T09 review; exam focus on NEPA Category Exclusions + permit-timeline awareness | 15 | T09 |
| L07 | Splicing & Termination Domain Review | T11 focus on exam-weighted items: core-alignment vs. cladding-alignment, MFD mismatch (T02 refresh), TIA-598 color sequence + blind-crew pattern (T11 advanced) | 20 | T02, T11 |
| L08 | Testing & Acceptance Domain Review | T12 + T13 intersection: OTDR dead-zone interpretation, insertion-loss acceptance criteria, RUS Form 219 inspection checklist correlation | 20 | T12, T13 |
| L09 | Bonding, Grounding & Protection Primer | Light treatment of T14 + T19 (primary protector awareness); exam is shallow on electrical depth (focus: why we ground, basic measurement) | 15 | T14, T19 |
| L10 | Scenario-Based Exam Practice | 5–6 multi-domain vignettes: "You're designing a PON feeder through a residential ROW with poor pole availability. Rule 232 clearance is tight. What's the design trade-off?" Designed to expose integration gaps across topics. | 30 | T01–T09 (general track prereqs) |
| L11 | Timed Practice Rounds (Part A: 50-item subset; Part B: 100-item full) | Interactive quiz engine: 50-item subset (75 min) → review → 100-item full mock (120 min) with domain-score breakdown + confidence heatmap | 180 | all L01–L10 |
| L12 | Mock Exam + Score Analysis | Full 100-item timed exam (proctored feel); scored against BICSI passing threshold; domain-by-domain performance analysis; flagged weak areas link back to T01–T19 lessons for remediation | 140 | all L01–L11 |

**Total contact time:** ~540 minutes (9 hours) including practice + exam time.

---

## 4. Vocabulary & New Terms

**Minimal new vocabulary.** T20 assumes all T01–T19 vocab is already known. Cert-specific terms reintroduced (but not new to the curriculum):
- **Candidate handbook** — the BICSI-published study guide (paywalled; referenced by title)
- **Passing score / scaled score** — BICSI's reported result format (e.g., "175/250")
- **Domain-weighted blueprint** — BICSI's allocation percentages across the 8 content domains
- **Weak-area remediation** — practice-result terminology (pointing back to T01–T19 source lessons)
- **Timed mock exam** — the full-length, full-duration practice exam (120 min, 100 items)

No new technical terms. All foundational OSP vocabulary comes from T01–T19.

---

## 5. Key Citation Sources

- **BICSI OSP Designer Candidate Handbook** — primary exam blueprint (paywalled; public data via BICSI website summary)
- **BICSI Outside Plant Design Reference Manual (OSPDR)** — the exam's primary technical reference
- **RUS Bulletin 1751F-630 (Aerial) + 1751F-635 (Underground)** — standards cited in exam questions
- **NESC C2-2023** — Rule 232, Rule 250, loading districts (exam-heavy topics)
- **TIA-598-D** — color-code sequence (splicing domain, exam-weight ~3 items)
- **FOA Reference Guide** — fiber-physics concepts verified across FOA CFOS-O/T exams
- **ASTM F2412/F2413** — end-face cleanliness standards (IEC 61300-3-35, exam reference)

---

## 6. DAG Lock & Readiness

✅ **T20 is ready for authoring dispatch** once:
1. ✅ General topics T01–T19 reach post-fix RT-verified GREEN status
2. ✅ DAG registry is populated with all T01–T19 vocabulary (orchestrator confirms pre-dispatch)
3. ⏳ BICSI OSP Designer Candidate Handbook is obtained (paywalled; confirm edition with Carter before author dispatch)

**Blocking decision:** Does Carter want CFOS-O/CFOT explicitly separated within T20 (as T20a/T20b tracks) or blended into a single OSP Designer stream with optional CFOS callouts? Current brief assumes blended (single 12-lesson stream, CFOS practice materials optional reference). Clarify before authoring.

---

## 7. Estimated Authoring Cost & Timeline

- **Per-lesson authoring:** 60–100K Sonnet (higher end for scenario-based + mock exam infrastructure)
- **12-lesson estimate:** ~1.0–1.2M Sonnet total authoring
- **RT pair (2 verifiers):** ~250K Sonnet (standard post-fix pair)
- **Polish + final-verify:** ~150–200K Sonnet
- **Total T20 wave estimate:** ~1.5–1.6M Sonnet

**Wall-clock estimate:** 7–8 days at default 1-agent-at-a-time throttle, assuming zero rework.

---

## 8. Open Questions for Orchestrator/Carter

1. **CFOS-O/CFOS-T blending:** Single 12-lesson track (current brief) or separate T20a (Designer) / T20b (CFOS-focused)?
2. **Mock exam item count:** Propose 100 items matching BICSI Designer exam. Confirm scope.
3. **Handbook edition lock:** Carter must confirm BICSI OSP Designer Candidate Handbook edition before authoring to ensure citation accuracy.

---

**END T20 BRIEF**
