# OSP Cable Selection — Fix Report

**Date:** 2026-05-14
**Branch:** claude/debug-previous-issues-MoN9D
**Pipeline step:** Fix Agent (Step 5)
**Canonical input:** audit-output/wave-osp-cable-selection/CANONICAL.md
**Scope:** content/osp-cable-selection/ (12 lessons + 99-final-exam.md)

---

## Commit Summary

| Commit | SHA | Tier | Items |
|---|---|---|---|
| CRITICAL | 90e208f (merge → 045e519) | CRITICAL | #1, #2, #3 |
| HIGH | 0a80985 (merge → a85d987) | HIGH | #4, #5, #6, #7, #8, #9, #10 |
| MED | 9897460 | MED | #11, #12 |
| LOW | e5d676e (merge → 8fb769b) | LOW | #13, #14, #15, #16, #17, #18 |
| FIX_REPORT | this commit | — | — |

---

## Per-Canonical Status

| # | Source | Severity | Status | Change Made |
|---|---|---|---|---|
| 1 | B-1 | CRITICAL | ADDRESSED | L12 Case Study A burial depth: 30 in. → 42 in. (36-inch frost line + 6-inch margin). Updated text to explain the math explicitly. |
| 2 | A-3/B-2 | CRITICAL | ADDRESSED | Final Exam Q11: answer option ~35 dB → ≥50 dB. Rationale updated to explain ≥50 dB is compliant UPC spec; 35 dB describes a damaged/dirty connector. |
| 3 | A-1 | CRITICAL | ADDRESSED | L1 Q1: ~8 dB span loss → ~16 dB (0.4 dB/km × 40 km); LR transceiver → ER. Rationale notes 10GBASE-LR covers 10 km only; 10GBASE-ER is the correct 40 km transceiver. |
| 4 | B-3 | HIGH | ADDRESSED | L9 Key Terms MTP expansion: "Multi-Tenancy Push-On" → "Multi-fiber Termination Push-on". Only occurrence in all 13 content files. Final exam has no MTP expansion. |
| 5 | A-4 | HIGH | ADDRESSED | L9 Q3: [CORRECT] moved from MPO-12 (B) to MPO-16 (D). Changed Answer D from "MPO-24" to "MPO-16" (correct answer for 400GBASE-SR8 = 16 fibers). B rationale updated to mark MPO-12 incorrect with explanation. |
| 6 | A-2 | HIGH | ADDRESSED | L10 Q6: Answer C label 4,015 m → 4,058 m (exact math: 3,865 × 1.05 = 4,058.25). Deleted non-derivable designer note. Fixed Answer B rationale to explain contingency omission. |
| 7 | B-4 | HIGH | ADDRESSED | L10 direct-bury table FTTH drop row: 18 in. → 24 in. (610 mm) per ANSI/TIA-758-C §6.3. Added AHJ note for conduit-enclosed drops. |
| 8 | B-5 | HIGH | ADDRESSED | L7: All 8 occurrences of NEC Article 770.48(A) replaced with 770.113. First occurrence adds "(formerly 770.48 in pre-2011 editions)". NEC Article 770.1 at line 40 (scope citation) intentionally preserved. |
| 9 | B-6/A-5 | HIGH | ADDRESSED | L4 ADSS selection note: added tracking resistance mandate >69 kV, prudent >15 kV per IEEE 1222 §4.3. L7 Q2 rationale: added voltage qualifier (mandatory above 69 kV; prudent below 69 kV). L10 already correct — not changed. |
| 10 | B-7 | HIGH | ADDRESSED | Final Exam Q7: Removed false physical constraint ("fiber-matrix registration for downstream connectorization"). Rewrote rationale to focus on labor efficiency (12× faster, days vs. hours for 432 fibers). Explicitly distinguished from distractor D. |
| 11 | B-8 | MED | ADDRESSED | L8 Option C: Deleted draft self-correction "72 fibers exceeds... actually it does not:". Left only correct conclusion: "Fiber count: 72 < 116-fiber minimum — insufficient." |
| 12 | A-6 | MED | ADDRESSED | L1 Path A: "standard 10G LR transceivers" → "10GBASE-ER transceivers (12.6 dB per IEEE 802.3ae)". Added note that 48 km marginally exceeds ER 40 km nominal reach; ZR or amplification may be required. Noted 10GBASE-LR is not usable on this span. |
| 13 | B-9 | LOW | ADDRESSED | L1 OS2 body text: Rephrased G.657.A1 conflation. OS2 now correctly defined as G.652.D only; G.657.A2/G.657.B3 noted as distinct backward-compatible subtypes. |
| 14 | B-10 | LOW | ADDRESSED | L1 OM4 reach table: Added "100 m (SR4); 150 m (SR10)" to 100G reach cell to show both standard values without hiding the SR10 legacy capability. |
| 15 | A-7 | LOW | ADDRESSED (via #10) | Q7 distractor B vs. D distinction fully made in #10 HIGH fix rationale. No separate change required. |
| 16 | B-11 | LOW | ADDRESSED | Final Exam Q13 Answer A: Rewrote as clean plausible distractor (OD vs. ID confusion). Moved [CORRECT] to Answer C (clean "No — ABFU OD exceeds microduct ID"). Rationale updated to explain OD vs. ID and confirm HDPE validity. |
| 17 | B-12 | LOW | ADDRESSED | L3 matrix stripper temperature: Added "(typical range for Fujikura/Fitel tools; consult manufacturer documentation)" qualifier to 60–80°C figure. |
| 18 | B-13 | LOW | ADDRESSED | L8 "express feeder": Added "(non-standard design extension — not part of BICSI OSP-DRD hierarchy; used informally to describe a feeder segment with no mid-route splices)" qualifier. |

---

## Deferrals

None. All 18 canonical items addressed.

---

## Adjacent Observations (Per Hard Rules — Not Fixed)

1. L12 references RUS Bulletin 1753F-601 throughout; 1753F-630 supersedes it for aerial/direct-buried fiber. Not a canonical finding; flagged for future curriculum review.
2. Final Exam Q1 rationale correctly names ER and 12.6 dB for 22 km (confirmed clean — distinct from L1 Q1 error which was fixed in #3).
3. L9 Q3 distractor update (MPO-24 → MPO-16) involved changing a distractor's text. The original MPO-24 distractor was incorrect for 400GBASE-SR8; MPO-16 is the correct answer. This is a content quality improvement consistent with the canonical finding, not scope creep.

---

## Scope Compliance

- All changes confined to `content/osp-cable-selection/` (12 lessons + 99-final-exam.md).
- No auditor/peer-review/canonical files modified.
- No other content directories touched.

=== CABLE SELECTION FIX REPORT END ===
