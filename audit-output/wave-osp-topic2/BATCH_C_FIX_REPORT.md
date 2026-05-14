# Batch C Fix Report — Topic 2 Lessons 2.9–2.12 + Final Exam
**Fix agent run:** 2026-05-14
**Branch:** claude/debug-previous-issues-MoN9D
**Canonical source:** audit-output/wave-osp-topic2/BATCH_C_CANONICAL.md

---

## Commit Summary

| Commit | SHA | Tier | Items |
|---|---|---|---|
| 1 — CRITICAL | `4b858b7` | CRITICAL | C-04, C-05 |
| 2 — HIGH | `6a1d734` | HIGH | C-01, C-02, C-03 |
| 3 — MED | `bf9d743` | MED | C-06, C-07, C-08, C-09, C-11, C-12, C-13 |
| 4 — LOW | `0b0afe6` | LOW | C-14, C-15, C-16, C-17 |

---

## Per-Canonical Status

| # | Status | Notes |
|---|---|---|
| C-04 CRITICAL | ADDRESSED | Final Exam Q17 [CORRECT] flipped C→A. Rationale rewritten: Method A includes far-end connector pair that Method B zeroed in reference step → Method A measures MORE (+0.35 dB). Previous [CORRECT]=C rationale was factually inverted per ANSI/TIA-526-7 §5 and lesson body lines 113-117. |
| C-05 HIGH | ADDRESSED | L11 Q1 [CORRECT] flipped B→C. Rationale rewritten: Method C excludes BOTH FUT end connectors (not one), so delta = two connector pairs = 0.6 dB. Confirmed by lesson table (1.8-1.2=0.6 dB). Distractor B rationale corrected. |
| C-01 HIGH | ADDRESSED | L12 Q2 option B label changed 9.8→10.2 dB. Instructor note at line 301 removed. Rationale updated to cite the correct value throughout. |
| C-02 HIGH | ADDRESSED | Final Exam Q20 option A label changed 11.0→11.5 dB. [CORRECT] flipped A→B. Rationale: 25×0.4+5×0.10+2×0.50 = 11.5 dB = measured 11.5 → passes at limit (≤ rule). Incorrect "FAILS" conclusion removed. |
| C-03 HIGH | ADDRESSED | L10 macrobend diagnostic wavelength changed "1625 nm" → "1550 nm" at line 93. 1625 nm is live-fiber monitoring only; 1550 nm is the acceptance test wavelength per ANSI/TIA-526-7. |
| C-06 MED | ADDRESSED | L09 step 3 drop connection workflow: removed "or visual fault locator as applicable"; now specifies fiber inspection scope (≥200× magnification) per IEC 61300-3-35. VFL cannot inspect end-face. |
| C-07 MED | ADDRESSED | L11 reference procedure step 3 warm-up updated from "typically 30-60 seconds" to "5-15 minutes for laser sources; use stabilization LED if available." Consistent with Error 4 which correctly states 10-15 min drift window. |
| C-08 MED | ADDRESSED | APC return loss standardized in both L09 (line 61) and L10 (line 45) to "≥55 dB minimum per IEC 61300-3-6; ≥65 dB typical" with explicit min/typical split and IEC 61300-3-6 citation added to both. |
| C-09 MED | ADDRESSED | L12 RUS section: added RUS Form 219 paragraph noting it may be required on some RUS-funded projects; advises verifying with area engineer before submission. |
| C-11 MED | ADDRESSED | Resolved jointly with C-12. L10 "0 to 10 m" prose replaced with pulse-width-dependent range — no longer contradicts the Q2 scenario (15 m) or the lesson's own recommended 100 ns pulse width context. |
| C-12 MED | ADDRESSED | L10 launch dead zone "Typical range: 0 to 10 m" replaced with "1–30 m, strongly dependent on pulse width (see pulse-width table below)." Cross-reference to the table added for completeness. |
| C-13 MED | ADDRESSED | L10 acceptance thresholds section: added one paragraph stating OTDR testing must be conducted at both 1310 nm and 1550 nm per ANSI/TIA-526-7 for OS2 SMF acceptance; cross-references macrobend visibility rationale. |
| C-14 LOW | ADDRESSED | L10 Q3: deleted erroneous first option set (A/B/C/D with wrong values) and the inline [Note] correction and "Let me restate" preamble. Retained only the corrected option set as the sole option block. |
| C-15 LOW | ADDRESSED | Final Exam Q25 distractor A rewritten from arithmetically false "9.1 dB within 8.6 dB budget" to plausible misconception: "per-event splice pass means end-to-end passes." Rationale updated to address the new distractor directly. |
| C-16 LOW | ADDRESSED | Final Exam Q3 question text updated to include "Assume no connectors at each end (feeder-to-feeder fusion spliced directly at OLT and FDH)" so learners are not left to infer connector omission. |
| C-17 LOW | ADDRESSED | L10 pulse-width table column header renamed "Range (dynamic range)" → "Dynamic Range (dB)" to eliminate conflation of OTDR measurement range (distance) with dynamic range (dB). |

---

## Deferrals

None. All 16 canonical items addressed.

---

## Adjacent Observations (not canonical — not committed)

1. L11 table note (line 141) says "Methods A and B produce similar results in this example." After C-04 fix, this is slightly misleading — Methods A and B produce the same measured IL in this specific worked example because both include the far-end connector. The note is not incorrect but could be clarified further. Surfaced here per scope-strict protocol.

2. Final Exam Q17 distractor D ("0.70 dB less") was retained as-is. After the C-04 fix, it is still a useful plausible-but-wrong distractor (two connector pairs instead of one). No change required.

---

=== BATCH C FIX REPORT END ===
