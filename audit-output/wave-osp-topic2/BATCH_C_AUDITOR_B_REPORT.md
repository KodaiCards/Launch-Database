# OSP Topic 2 Batch C — Auditor B Report
**Framing:** Adversarial field test technician + RUS acceptance experience
**Lessons audited:** 09, 10, 11, 12, 99-final-exam

---

## Stack Snapshot (≤80 words)

Content is technically dense and mostly accurate. The physics and bidirectional averaging math are solid. The core RUS-acceptance failure modes: (1) L10 never tells learners to run OTDR at 1310 AND 1550 nm — a gap that would produce an incomplete acceptance package; (2) the Method A/B table in L11 contradicts the final-exam Q17 answer; (3) the L12 Q2 answer label is wrong with no correction — unresolvable for a Moodle learner.

---

## Findings Table

| # | Lesson | File:Lines | Severity | Category | Issue (1 line) | Fix Shape (1 line) | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | L10 | 10-otdr-testing.md:93 | HIGH | Critical Gotcha Missed | Macrobend described as "high bending loss at 1625 nm vs 1310 nm" but acceptance testing uses 1550 nm, not 1625 nm — inconsistent with L12 and TIA-526-7 | Change L10 to "1550 nm relative to 1310 nm" matching L11/L12/TIA-526-7 acceptance standard | HIGH |
| 2 | L10 | 10-otdr-testing.md:31,85-146 | HIGH | Critical Gotcha Missed | Entire L10 lesson covers OTDR testing with zero mention that OTDR must be run at 1310 AND 1550 nm for OSP acceptance — learner who reads only L10 produces a 1310nm-only OTDR package | Add a sentence in acceptance thresholds section: "OTDR for acceptance must be run at both 1310 nm and 1550 nm per BICSI OSP-DRD Ch. 9" | HIGH |
| 3 | L11 | 11-power-meter-light-source-testing.md:131-141 | HIGH | Plausibility Trap / Internal Contradiction | Method A/B/C comparison table shows Method A ≈ Method B (~1.8 dB both) — directly contradicts Final Exam Q17 which states Method A measures ~0.35 dB LESS than Method B | Fix table: Method A row should show "All internal + both end connectors – 1 connection" ≈ 1.5 dB; add note that A and B differ by ~1 connector pair | HIGH |
| 4 | L12 | 12-acceptance-testing-as-built-documentation.md:285-301 | HIGH | Quiz Correctness | Q2 labels answer "B = 9.8 dB [CORRECT]" but the derivation in the rationale yields 10.2 dB — none of the four answer options contains 10.2 dB; the correct answer doesn't exist as a choice | Replace answer options so one option is exactly 10.2 dB and is labeled [CORRECT]; remove instructor note from published content | HIGH |
| 5 | L10 | 10-otdr-testing.md:53-57 | MEDIUM | Plausibility Trap | Launch dead zone stated as "Typical range: 0 to 10 m" — this is only true at ≤10 ns pulse widths; at 100 ns (recommended for OSP splice testing) launch DZ is 30-100 m, which explains why 50-500 m launch cables are required but the stated 0-10 m range does not | Correct to: "Typical range: 1–100 m, strongly dependent on pulse width; 50–500 m launch cables account for worst-case pulse widths used in OSP" | HIGH |
| 6 | L10 | 10-otdr-testing.md:277-298 | MEDIUM | Quiz Messy Presentation | Q3 contains a mid-question restatement ("Let me restate the options precisely:") leaving two conflicting answer sets in the same question; the original options have arithmetic errors (0.03 dB stated as "arithmetic mean of +0.02 and 0.08"); Moodle import would fail or confuse learner | Delete the original option block; keep only the restated options starting with "Revised correct option"; verify 0.05 dB is labeled [CORRECT] | HIGH |
| 7 | L09 | 09-hardened-osp-connectors.md:61 vs 10-otdr-testing.md:45 | MEDIUM | Plausibility Trap / Inconsistency | APC return loss stated as "≥ 65 dB typical" in L09 but "≥ 55 dB" in L10; both are defensible (55 dB is the IEC 61300-3-6 minimum; 65 dB is a typical measured value) but inconsistency within the same content set confuses learners | Standardize to "≥ 60 dB typical, ≥ 55 dB per IEC 61300-3-6 minimum" in both files | MEDIUM |
| 8 | L11 | 11-power-meter-light-source-testing.md:159 vs 203 | MEDIUM | Plausibility Trap | Source stabilization time stated as "30–60 seconds from power-on" in the procedure steps but "10–15 minutes" of warm-up drift described in Error 4; these directly contradict — if drift lasts 10-15 min, 60 seconds is insufficient; a learner following the procedure will reference too early | Change step 3 to "Allow source to warm up (typically 5–15 minutes for laser sources; use stabilization LED if available). Do not set reference until output is stable." | MEDIUM |
| 9 | L09 | 09-hardened-osp-connectors.md:105 | MEDIUM | Plausibility Trap | Field workflow step 3 says "Inspect the ferrule end-face with a scope or visual fault locator as applicable" — VFLs cannot inspect end-faces; a VFL is a continuity/macrobend tool, not an end-face inspection instrument; "as applicable" implies VFL is sometimes appropriate for end-face inspection, which it is not | Remove "or visual fault locator" from this step; VFL is for continuity only, not end-face inspection | MEDIUM |
| 10 | L12 | 12-acceptance-testing-as-built-documentation.md:285-301 | MEDIUM | Acceptance Package Gotcha Missed | RUS Form 219 (the USDA RUS OTDR test report form required on many RUS loan/grant projects) is never mentioned; a learner could deliver a BICSI-compliant package but still have it rejected by a RUS inspector for missing the Form 219 | Add a sentence in the RUS section: "Some RUS loan agreements require submission on USDA RUS Form 219 (OTDR Test Report); verify with the area engineer whether Form 219 is required for the specific project" | MEDIUM |
| 11 | L10/Final Exam | 10-otdr-testing.md:56; 99-final-exam.md:262-273 | MEDIUM | Internal Inconsistency | Q2 in L10 uses a 15 m launch dead zone example — outside the "0 to 10 m typical" range stated in the same lesson body; this creates an inconsistency that learners will notice | Either update the typical range in the body text (fix #5 above) or change Q2's dead zone value to ≤10 m to match the stated typical range | MEDIUM |
| 12 | Final Exam | 99-final-exam.md:453-466 | LOW | Bad Distractor | Q25 distractor A says "PMLS at 1310 nm (9.1 dB) is within the budget" — the budget is 8.6 dB, so 9.1 dB is arithmetically NOT within budget; the distractor is factually wrong rather than a plausible misconception, undermining exam validity | Rewrite distractor A to a plausible misconception, e.g., "Pass — 1310 nm PMLS is the primary test wavelength; if it passes, 1550 nm is informational" (which is actually the misconception Q25 is testing) | MEDIUM |
| 13 | Final Exam | 99-final-exam.md:67-82 | LOW | Gotcha Missed | Q3 final exam: 30 km link budget includes 6 splices but silently omits connectors — a real 30 km feeder would have at least 2 connector pairs (OLT + FDH); learner might internalize that connector loss is not part of a feeder link budget | Add note or adjust question to either state "assume no connectors" explicitly, or include 2 connector pairs in the budget | LOW |
| 14 | L10 | 10-otdr-testing.md:72-79 | LOW | Technical Accuracy | Pulse width table column header "Range (dynamic range)" conflates OTDR range (max measurement distance) with dynamic range (dB capability); these are related but not the same; 300 ns row says "~40 dB" which is the dynamic range, not the testable distance in km | Rename column to "Dynamic Range" and add a separate "Typical max test distance" column for clarity | LOW |

---

## Negative Findings (confirmed clean)

- **Bidirectional averaging formula and worked examples:** Forward/gainer examples in L10 are arithmetically correct; bidirectional average formula stated accurately.
- **IEC 61300-3-35 zone table in L12:** Zone A/B/C/D radii and defect criteria are accurate against the standard; the zero-tolerance Zone A rule is correctly stated.
- **PMLS dBm/dB distinction in L11:** The dBm vs. dB worked example is correct; Q2, Q15 calculations in L11 and final exam are arithmetically verified.
- **Connector insertion loss thresholds:** ≤0.5 dB per IEC 61753-1 / ANSI/TIA-758-C §6.5 for hardened OSP connectors is cited consistently across L09, L10, L11, L12, and the final exam.
- **Mating mechanism accuracy:** OptiTap = bayonet pull-to-lock; HOC = threaded hex nut; AFL QWIK-FLO = auto dust-cap carrier — all correctly stated throughout.
- **RUS-specific requirements in L12:** NIST-traceable calibration, chain-of-custody, digital delivery to owner, ROW compliance records — all present and accurate.
- **OTDR .SOR format:** Telcordia GR-196 reference, per-fiber/per-direction/per-wavelength naming, 96-file count for 24-fiber bidirectional dual-wavelength — correct.
- **IEC 61753-1 performance standard B:** ≤0.5 dB limit correctly attributed and consistently applied.
- **APC/UPC color convention:** Green = APC, blue = UPC, non-interchangeable — stated correctly in L09; 1-3 dB IL penalty for mismatch is within measured range.
- **Gainer interpretation in L10:** Correctly explained as backscatter artifact; correct that negative value is used as-is in bidirectional average formula.
- **Vendor parity:** EXFO, Viavi, and Fluke mentioned as coequal alternatives in L10, L11, L12; no single vendor presented as the canonical standard.
- **Tier 1/Tier 2 definitions and when-required table in L11:** Accurate against BICSI OSP-DRD / ANSI/TIA-568.3-D.
- **PMLS Method B two-jumper procedure steps in L11:** Procedure steps are correct.
- **Final exam question distribution:** 25 questions, 6 calculation, coverage of all 12 lessons confirmed in the distribution table.

---

## Coverage Gaps

Could not verify:
- **ANSI/TIA-455-61 exact section citations** against the actual standard (standard not available in this environment); cited as §5.4 and §5 throughout — assumed correct based on content accuracy.
- **IEC 61300-3-4 §5 bidirectional requirement wording** — content aligns with industry practice; exact text not verified.
- **Corning OptiTap Training Guide §2.1 details** — 2–4 lbf pull-to-lock force and exact 90° rotation cited; plausible but not independently verified against manufacturer documentation.
- **L09 QWIK-FLO auto-cap carrier** — described accurately based on known AFL product line but AFL installation guide §2.3 not independently verified.
- **ANSI/TIA-526-7 Method A/B/C exact reference procedure language** — the Method A vs Method B difference (the highest-confidence finding in this audit) is based on industry practice knowledge, not line-by-line standard verification.

---

=== TOPIC 2 BATCH C AUDITOR B END ===

---

## Comparison with Auditor A (BATCH_C_REPORT.md)

Auditor A (the content creator) self-reported the following in BATCH_C_REPORT.md:
- Acknowledged L12/Q2 answer label issue with instructor note "Confirm numeric options before use in Moodle"
- Acknowledged L10/Q3 arithmetic error and included an in-line restatement
- Did NOT flag: L11 Method A/B table contradiction vs Q17, launch dead zone "0-10m" vs actual field range, macrobend wavelength 1625nm vs 1550nm inconsistency, VFL mis-cited as end-face inspection tool, source stabilization time contradiction, missing OTDR dual-wavelength requirement in L10 body, Q25 factually wrong distractor A, RUS Form 219 gap

**New findings by Auditor B not in Auditor A's self-report:**
- Finding #1: 1625 nm macrobend wavelength vs 1550 nm acceptance standard (HIGH)
- Finding #2: L10 no dual-wavelength OTDR testing requirement stated (HIGH)
- Finding #3: Method A/B table contradicts Final Exam Q17 (HIGH)
- Finding #5: Launch dead zone "0–10 m typical" understates real field range (MEDIUM)
- Finding #7: APC return loss ≥65 dB (L09) vs ≥55 dB (L10) inconsistency (MEDIUM)
- Finding #8: Source stabilization 30–60 sec vs 10–15 min contradiction (MEDIUM)
- Finding #9: VFL incorrectly suggested as end-face inspection tool (MEDIUM)
- Finding #10: RUS Form 219 not mentioned (MEDIUM)
- Finding #12: Q25 distractor A factually wrong (LOW)
- Finding #13: Q3 final exam silently omits connector loss from link budget (LOW)
- Finding #14: Pulse width table "Range (dynamic range)" column conflation (LOW)

**Overlap with Auditor A self-acknowledgments:**
- L12 Q2 answer label wrong (Finding #4 above — Auditor A knew; left an instructor note; not fixed in content)
- L10 Q3 arithmetic error and restatement messiness (Finding #6 above — Auditor A attempted to fix inline but left the broken original options)

**Assessment:** Auditor A flagged implementation-level issues they noticed during authoring (arithmetic mistakes, mismatched answer labels) but did not audit for field-testing plausibility traps, cross-lesson technical inconsistencies, or RUS acceptance package gotchas. The adversarial framing surfaced a different failure class: issues that would cause a trained learner to arrive on a real job site with subtly wrong mental models (wrong wavelength for macrobend detection, inadequate source warmup, VFL as inspection tool, incomplete OTDR test protocol).
