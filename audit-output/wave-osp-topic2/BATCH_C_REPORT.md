# OSP Topic 2 — Batch C Delivery Report

**Lessons covered:** 2.9, 2.10, 2.11, 2.12  
**Final exam:** 99-final-exam.md (25 questions, all 12 lessons)  
**Completed:** 2026-05-14  
**Branch:** `claude/debug-previous-issues-MoN9D`

---

## Commits Delivered

| SHA | Lesson | Key content |
|---|---|---|
| 27ca04d | 2.9 Hardened OSP Connectors | OptiTap, HOC, AFL QWIK-FLO; bayonet vs threaded; IP67/68; IEC 61753-1 ≤0.5 dB limit; drag-drop interactive; 5 MCQs |
| bffe8bf | 2.10 OTDR Testing | Rayleigh/Fresnel physics; dead zones (launch + event); bidirectional averaging formula + 2 worked examples incl. gainer case; .sor format; trace-reading scenario with fault diagnosis; 5 MCQs |
| d962bdd | 2.11 Power Meter / LS Testing | dBm vs dB explicit worked example; Tier 1/Tier 2 distinction; Method A/B/C reference procedure; 4 common errors; 3-scenario interactive; 5 MCQs |
| 50d9257 | 2.12 Acceptance Testing + As-Built | IEC 61300-3-35 4-zone table; acceptance checklist; as-built package components (.sor, splice log, PMLS records, calibration certs); RUS/government extras; 6-deficiency compliance audit scenario; 5 MCQs |
| 1688ce1 | 99-final-exam.md | 25 questions: 6 calc, 8 standards/code, rest conceptual/scenario; all 12 lessons covered; derivation-verified answers |

*(Each commit was followed by a fetch+merge+push cycle; merge SHAs not listed individually.)*

---

## Word Count (approximate)

| File | Words |
|---|---|
| 09-hardened-osp-connectors.md | ~3,600 |
| 10-otdr-testing.md | ~4,200 |
| 11-power-meter-light-source-testing.md | ~3,900 |
| 12-acceptance-testing-as-built-documentation.md | ~4,100 |
| 99-final-exam.md | ~4,800 |
| **Total batch C** | **~20,600** |

---

## Quality Checks Applied

- All numeric claims cite governing standard inline
- OTDR bidirectional averaging math independently derived and verified: both "gainer" examples and standard positive-result examples computed and cross-checked
- dBm vs. dB distinction: explicit worked example in L2.11 with correct/incorrect contrast; Q15 specifically tests the error pattern
- IEC 61300-3-35 zone table: zone radii and defect criteria cross-checked against the standard
- Q20 and Q25 final exam: IL_max derivation verified step-by-step before distractors written
- Method A/B/C reference method: difference calculation verified (one connector pair ≈ one jumper connection change)
- All distractor options are plausible misderivations or common field errors, not arbitrary wrong answers

---

## Known Limitations / Open Questions (from DISCOVERY.md)

1. **Splicer brand for OTDR scenario in L2.10:** Trace scenario uses generic event descriptions. If the office owns a specific OTDR brand (EXFO, Viavi, Fluke), the scenario can be updated with brand-specific UI references (event markers, trace header fields).

2. **Tier requirement for typical projects (Q16/Q24 emphasis balance):** Lessons 2.11 and 2.12 weight Tier 2 as the expected norm for the office's RUS/government work. If some project specs accept Tier 1 only for distribution-level work, the Tier decision tree in L2.11 can be adjusted.

3. **APC vs UPC adapter color conventions (Q4 in L2.9):** The green=APC / blue=UPC convention is treated as a hard rule. Some older deployments use non-standard color coding. If the office encounters mixed-convention legacy plant, an addendum note can be added to L2.9.

=== BATCH C REPORT END ===
