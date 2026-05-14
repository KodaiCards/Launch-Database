# OSP Cable Selection — Batch C Author Report

> Batch C: Lessons 10–12 + Topic Final Exam (99-final-exam.md)
> Authored: 2026-05-14
> Branch: claude/debug-previous-issues-MoN9D

---

## Commits

| Commit SHA | File | Description |
|---|---|---|
| `833fbc8` | `10-cable-selection-by-environment.md` | Lesson 10: Environment-Driven Cable Selection |
| `fcb744d` | `11-compliance-nesc-nec-tia-bicsi.md` | Lesson 11: Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI |
| `b47fa03` | `12-case-studies.md` | Lesson 12: Hands-On Case Studies |
| `732b314` | `99-final-exam.md` | Topic Final Exam — 25 questions, 70% pass threshold |

All commits pushed to `claude/debug-previous-issues-MoN9D`. Pull-rebase before each push — no push conflicts.

---

## Word Counts

| File | Words |
|---|---|
| `10-cable-selection-by-environment.md` | 6,131 |
| `11-compliance-nesc-nec-tia-bicsi.md` | 6,377 |
| `12-case-studies.md` | 6,891 |
| `99-final-exam.md` | 6,403 |
| **Batch C total** | **25,802** |

---

## Content Coverage

### Lesson 10 — Environment-Driven Cable Selection (~30 min)

Covers five primary OSP deployment environments: aerial (ADSS vs. lashed, sheath compounds, clearance requirements), underground conduit (no armor, fill ratio, bend limits), direct-bury (CST vs. dielectric armor, water-blocking, rodent environments, burial depth table), microduct (ABFU sizing, 85% OD guideline), and OSP-to-inside transition (NEC 770 fire rating hierarchy, BET, 50-ft interior limit). Integrated tier×environment selection matrix. Two interactives: drag-and-drop (6 cable types × 6 environments), scenario (aerial-to-underground subdivision transition with 3 multi-part options). 6-question quiz. 3 pulse checks. 10 flashcard terms.

Primary standards cited: ANSI/TIA-758-C §5.2–5.7, §6.1–6.3; IEEE 1222 §4.3; NESC Rules 232, 250, 352; NEC Article 770.113; IEC 60794-3; BICSI OSP-DRD Ch. 5–6.

### Lesson 11 — Compliance: NESC, NEC, ANSI/TIA-758-C, BICSI (~25 min)

Four-body compliance landscape table (NESC / NEC / TIA / BICSI — scope, enforceability, AHJ distinction). NESC Rules 230/232/250–251/352/354 coverage with bonding/grounding details (6 AWG, ground rod, grounding intervals). NEC 770.113 fire-rating hierarchy (OSP/OFN/OFNR/OFNP — substitution matrix, 50-ft limit, conduit exception). ANSI/TIA-758-C §7 documentation requirements (route drawings, burial depth, splice records, cable reels, bonding records, labeling). BICSI pre-construction deliverable set. Nine-item compliance checklist. Interactive compliance audit walkthrough (5 findings with correct dispositions). 5-question quiz. 3 pulse checks. 10 flashcard terms.

Primary standards cited: NESC C2-2023 Rules 230/232/250–251/352/354; NEC Article 770.113; ANSI/TIA-758-C §6.4, §7; ANSI/TIA-526-7; ANSI/TIA-568.3-D §11; BICSI OSP-DRD Ch. 7–8.

### Lesson 12 — Hands-On Case Studies (~30 min)

Three worked scenarios, each with guided decision points, common pitfalls, and cable spec summary table:

**Case Study A — RUS-Funded Rural FTTH Backbone:**
1,240 homes / 6 FDHs / 40 mi feeder / 12 mi distribution / 800 drops. Decision points: feeder fiber count (BICSI 4× + SCADA reserve → 48F), aerial feeder (ADSS on 7.2 kV/12.5 kV co-op lines, NESC medium district, span engineering), direct-bury feeder (CST armor, gopher deterrence, frost line depth, cable order calculation). Distribution and drop specifications. 4 common pitfalls.

**Case Study B — Aerial-to-Underground Subdivision Transition:**
280-lot subdivision, FDH at pole on 7.2 kV line, 2.8 mi distribution via conduit + direct-bury. Decision points: conduit vs. direct-bury construction, fiber count (2 active × 7 FDTs × 3× multiple → 48F), HOA NOC building entry compliance (BET + OFNR, 130 ft interior run beyond 50-ft limit). 4 common pitfalls.

**Case Study C — Storm-Hardening ADSS Retrofit:**
22 mi lashed aerial on coastal NC highway ROW, NESC extreme-wind zone, replacing undersized messenger. Decision points: ADSS vs. re-messenger (ADSS selected for elimination of failure mode), 144F upgrade with transition splices (36 active + 108 dark), EDS verification, NESC clearance at highway crossings. Compliance documentation deliverables. 4 common pitfalls.

5-question quiz (cross-case integration). 3 pulse checks.

### Topic Final Exam (99-final-exam.md)

25 questions, 70% pass threshold (18/25). Coverage distribution:

| Lesson(s) | Questions |
|---|---|
| L1 (SMF vs MMF) | Q1, Q2 |
| L2 (OS1/OS2) | Q3 |
| L3 (OM grades) | Q4 |
| L4 (loose-tube construction) | Q5 |
| L5 (tight-buffer) | Q6 |
| L6 (ribbon/mass-fusion) | Q7 |
| L7 (sheath options) | Q8 |
| L8 (hierarchy) | Q9, Q10 |
| L9 (connectors) | Q11 |
| L10 (environment selection) | Q12, Q13 |
| L11 (compliance) | Q14, Q15, Q16 |
| L12 (case studies) | Q17, Q18, Q19, Q20 |
| Cross-topic integration | Q21, Q22, Q23, Q24, Q25 |

Each question includes: four answer options, correct answer marked [CORRECT], per-option rationale, source citation.

---

## Known Issues for Moodle Import Review

- **L6 Q6 math issue** (carried forward from Batch B report): verify drag-drop image labels render correctly at import.
- **L3 Q3 drag-drop labels** (carried forward from Batch B): verify at import.
- **Q6 in this exam (L5 scenario):** tight-buffer in OSP — verify that the correct answer logic survives Moodle's answer randomization (correct answer is B; ensure rationale is tied to the marker, not the letter).
- **L10 Q6 cable length calculation:** the ≤ answer option note acknowledges a rounding ambiguity; the explanation in the rationale covers it. If Moodle import produces a correct-answer dispute, the explanation text is the authoritative tie-breaker.

---

## Sourcing

All citations are inline per the lesson format. Primary sources drawn from:
- ANSI/TIA-758-C (OSP infrastructure standard — primary throughout)
- IEEE 1222 (ADSS cable standard — L10, L11, L12, final exam)
- NESC C2-2023 (Rules 230, 232, 250–251, 352, 354 — L10, L11, L12)
- NEC Article 770 (indoor fiber ratings — L10, L11, L12)
- BICSI OSP-DRD Manual (design guidelines — all lessons)
- ANSI/TIA-526-7 (OTDR testing — L11, L12)
- USDA RUS Bulletin 1753F-601 (RUS loan compliance — L12, final exam)
- Corning / CommScope / AFL vendor reference guides (construction details throughout)

=== BATCH C REPORT END ===
