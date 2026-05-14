# OSP Topic 2 Batch A — Lessons 2.1–2.4 Completion Report

**Date:** 2026-05-14
**Branch:** claude/debug-previous-issues-MoN9D
**Commits:** 79c15d9, cae6dfa, 8a34fa0, 6e65fe4

---

## Lessons Delivered

| Lesson | File | Word Count | Duration | Commits |
|---|---|---|---|---|
| 2.1 Cleaving Fundamentals | `content/osp-splice-termination/01-cleaving-fundamentals.md` | ~4,922 | 25 min | 79c15d9 |
| 2.2 Fusion Splicing I | `content/osp-splice-termination/02-fusion-splicing-i.md` | ~5,133 | 30 min | cae6dfa |
| 2.3 Fusion Splicing II | `content/osp-splice-termination/03-fusion-splicing-ii.md` | ~5,202 | 25 min | 8a34fa0 |
| 2.4 Mass-Fusion Splicing | `content/osp-splice-termination/04-mass-fusion-splicing.md` | ~5,475 | 25 min | 6e65fe4 |
| **Total** | — | **~20,732** | **~105 min** | — |

---

## Template Compliance

Each lesson includes:
- YAML front-matter (title, duration_min, topic, order, bicsi_alignment, sources)
- Learning objectives (3–5 per lesson, action-verb framing)
- Reading content (~900–1,200 words substantive body text with section headers)
- Key terms (8–10 flashcard candidates each)
- Interactive (drag-drop for 2.4; scenario for 2.2 and 2.3; flashcard set for 2.1)
- Multiple-choice quiz (5–6 questions, per-option rationale + citation)
- Final check (3 pulse questions with expected answers)
- Glossary cross-references

---

## Sourcing Coverage

| Standard / Source | Lessons Cited |
|---|---|
| IEC 61300-3-35 (end-face geometry) | 2.1 |
| IEC 61300-3-4 (splice loss / backscatter method) | 2.2, 2.3 |
| Fujikura CT-30A / CT-45 cleaver manuals | 2.1 |
| Sumitomo FC-6S cleaver guide | 2.1 |
| Fujikura FSM-series splicer manuals | 2.2, 2.3 |
| Sumitomo Type-82C splicer guide | 2.2, 2.3 |
| AFL Fitel S179A training materials | 2.2 |
| Fujikura FSM-60R/70R/90R ribbon splicer manuals | 2.4 |
| Sumitomo Type-71M+ ribbon splicer guide | 2.4 |
| BICSI OSP-DRD Manual, Ch. 7.3–7.4 | 2.1, 2.2, 2.3, 2.4 |
| AT&T OSP Construction Practices | 2.3 |
| Corning OSP Splicing Procedures Guide | 2.1, 2.2, 2.3, 2.4 |
| CommScope OSP Splicing Reference | 2.4 |

All numeric claims cite the governing standard or vendor document per quality bar.

---

## Sample Quiz Questions (one per lesson)

**2.1 (Q4):** "Which of the following root causes most commonly produces a 'lip' failure mode during fiber cleaving?" — Correct answer: fiber not fully seated in the v-groove holder (asymmetric tension release). [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]

**2.2 (Q2):** "An OSP route has 18 splice closures over 30 km OS2 SMF at BICSI default ≤0.10 dB/splice. Cable attenuation is ≤0.4 dB/km. Transceiver budget 12.6 dB (10GBASE-LR). Does the link close?" — Correct answer: 13.8 dB total; link does not close — exceeds 12.6 dB budget by 1.2 dB. [BICSI OSP-DRD Manual, Ch. 7.4]

**2.3 (Q4):** "A PAS splicer consistently shows 0.03–0.06 dB estimated; OTDR reports 0.05–0.09 dB on the same splices. What is the correct interpretation?" — Correct answer: Expected relationship — estimated underestimates optical loss due to dopant diffusion; all splices pass ≤0.10 dB. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.1]

**2.4 (Q4):** "A 432-fiber ribbon cable closure uses 12-fiber mass-fusion at 10 min/ribbon. How many ribbon cycles and approximate total time?" — Correct answer: 36 ribbon cycles; 360 minutes (6 hours). [Fujikura FSM-60R Manual, §4.3]

---

## Math Consistency Self-Check

| Lesson | Computation | Verified |
|---|---|---|
| 2.2 Loss Budget Scenario | 38 km × 0.4 dB/km = 15.2 dB; 8 × 0.10 = 0.8 dB; total 16.0 dB vs. 14.4 dB budget | Confirmed — link fails at spec max, passes at typical (0.35 dB/km: 13.3 + 0.8 = 14.1 dB) |
| 2.2 Q2 | 30 km × 0.4 = 12.0; 18 × 0.10 = 1.8; total 13.8 dB vs. 12.6 dB | Confirmed — exceeds budget by 1.2 dB |
| 2.4 Q4 | 432 ÷ 12 = 36 ribbons; 36 × 10 = 360 min | Confirmed |
| 2.4 Pulse 3 | 576 ÷ 12 = 48 ribbons; 48 × 9 = 432 min | Confirmed |
| 2.4 Table | 288F mass-fusion: 24 × 10 = 240 min; single-fiber: 288 × 4.5 = 1,296 min | Confirmed |

No internal math inconsistencies found.

---

## Open Questions (resolved per brief)

- **Splicer brand:** Vendor-agnostic; Fujikura + Sumitomo both cited per-lesson. No brand picked as canonical.
- **OTDR brand:** Vendor-agnostic; Lessons 2.10–2.12 (Batch B) will reference EXFO/Viavi/Fluke as instructed.
- **Tier 1 vs Tier 2:** Both tiers noted; Lesson 2.11 (Batch B) will cover emphasis based on BICSI + RUS default of Tier 2.

---

## Scope Compliance

SCOPE STRICT: Only Lessons 2.1–2.4 drafted. Lessons 2.5–2.12 not touched.
No code, schema, .github/workflows/, or files outside `content/osp-splice-termination/` and `audit-output/wave-osp-topic2/` modified.

=== BATCH A REPORT END ===
