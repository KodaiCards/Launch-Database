# Batch C Content Verification — Auditor A (Math/Citation/Consistency)
## Lessons 2.9–2.12 + Final Exam (99-final-exam.md)

---

## Stack Snapshot

Five files reviewed: hardened connectors (L2.9), OTDR testing (L2.10), power meter / light source (L2.11), acceptance testing as-built documentation (L2.12), and the 25-question Topic 2 final exam. The content body is technically sound and pedagogically well-structured. All major citation anchors are plausible (IEC 61300-3-4, IEC 61753-1, ANSI/TIA-526-7, IEC 61300-3-35, BICSI OSP-DRD Ch. 9–10). Findings are concentrated in numeric option-label errors and one internal cross-question inconsistency on reference method delta.

---

## Findings Table

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | HIGH | Math/Option-Set | 99-final-exam.md | 371–386 | `Option A: IL_max = 11.0 dB` / `Option B: IL_max = 11.5 dB` | Exam Q20: Correct derivation is 25×0.4+5×0.10+2×0.50 = **11.5 dB**. Option A label states 11.0 dB (wrong). Option A rationale internally computes 11.5 and then contradicts itself. Since IL_max=11.5 and measured=11.5, the link **passes** (≤ rule). The [CORRECT] tag belongs on Option B, not A. | Fix Option A label to 11.0→11.5 and flip [CORRECT] to B, OR rewrite the question with new parameters that produce 11.0 dB (e.g., 24km instead of 25km) so the FAIL conclusion in A is correct. | HIGH |
| 2 | HIGH | Math/Option-Set | 12-acceptance-testing-as-built-documentation.md | 285–301 | `Option B — Correct: 9.8 dB` / rationale text `= **10.2 dB**` | L2.12 Q2: 22km×0.4+4×0.10+2×0.50 = **10.2 dB**. Option B label shows **9.8 dB** (a typo—off by 0.4 dB). No option label in the set matches the correct derived value of 10.2 dB. Option A=10.8, B=9.8, C=11.4, D=8.8—10.2 appears nowhere. A student deriving the answer correctly would find no matching option. | Fix Option B label from 9.8 → 10.2 dB. | HIGH |
| 3 | MEDIUM | Internal Inconsistency | 11-power-meter-light-source-testing.md | 133–141 (table) vs 274–285 (Q1) | Table row: `Method B ~1.8 dB / Method C ~1.2 dB` vs `Option B [CORRECT]: ~0.3 dB understated` | L2.11 Q1: Lesson body table shows Method B = 1.8 dB, Method C = 1.2 dB → difference = **0.6 dB** (both FUT end-connectors excluded by C). Q1 option B [CORRECT] says the understatement is ~0.3 dB (one connector pair). The table and the [CORRECT] option are internally inconsistent. Option C (0.6 dB) matches the table. | Verify against ANSI/TIA-526-7 §5 whether Method C excludes one or both FUT end-connectors. If two connectors excluded: fix [CORRECT] to C (0.6 dB). If one connector: fix the body table note to reflect 0.3 dB delta. | MEDIUM |
| 4 | MEDIUM | Internal Inconsistency | 99-final-exam.md | 321–334 | `Option C [CORRECT]: Method A measures ~0.35 dB less than Method B` | Exam Q17: L2.11 body table shows Methods A and B produce **similar results** (both ≈1.8 dB in the worked example). Q17 [CORRECT]=C claims A measures 0.35 dB **less** than B, which directly contradicts the lesson body. Q17 option A ("Method A measures more than B") is consistent with L2.11 body text that says "Method A overstates vs actual fiber loss." | Cross-check ANSI/TIA-526-7 §5 procedure steps. Reconcile Q17 with the lesson body table. If A and B truly produce similar results, fix [CORRECT] to B ("identical results") or revise the option set and rationale to align with lesson. | MEDIUM |
| 5 | LOW | Presentation/Clarity | 10-otdr-testing.md | 281–297 | `[Note: The correct bidirectional average is (0.02 + 0.08) / 2 = 0.05 dB — see rationale. Answer C is correct but the stated value (0.03 dB) contains an arithmetic error…]` | L2.10 Q3: The question internally detects its own error in a [Note] block and then re-presents the corrected option set. This two-pass structure (broken then fixed options within the same question) is confusing for Moodle import—the broken option set will be visible in the raw source and may import erroneously. | Remove the first (erroneous) option set entirely; retain only the corrected option set that starts with A/B/C/D. | LOW |
| 6 | LOW | Completeness | 99-final-exam.md | 453–466 | `Option A: Pass — all individual splice events pass; PMLS at 1310 nm (9.1 dB) is within the budget` | Exam Q25 Option A: States 9.1 dB "is within the budget" of 8.6 dB. 9.1 > 8.6 → the 1310 nm result also **fails**, making Option A doubly wrong. The [CORRECT]=C label is correct, but Option A's distractor text contains an arithmetic error that a student might not spot. The Q25 rationale correctly calls this out. | Fix Option A distractor text to accurately state 9.1 > 8.6 so it doesn't mislead; or replace with a different distractor. | LOW |

---

## Negative Findings (Confirmed Clean)

**Verified by reading each cited file and line range; all below confirmed correct:**

- L2.9 Q1–Q5: OptiTap bayonet mechanism, IEC 61753-1 ≤0.5 dB limit, HOC port density doubling, APC/UPC mismatch consequence (1–3 dB loss), end-face inspection pre-mating requirement. All correct.
  - Verified by reading: 09-hardened-osp-connectors.md:178–250
- L2.10 Q1, Q2, Q4, Q5: Rayleigh backscatter slope, launch cable dead zone (20 m cable vs 15 m dead zone), spike-with-no-step event interpretation, bidirectional average (0.06+0.15)/2=0.105 dB fails ≤0.10. All correct.
  - Verified by reading: 10-otdr-testing.md:247–328
- L2.10 bidirectional averaging examples in lesson body: (0.08+0.12)/2=0.10 ✓; (−0.02+0.09)/2=0.035 ✓; (0.07+0.09)/2=0.08 ✓; (0.04+0.05)/2=0.045 ✓; Pulse 2 (−0.03+0.11)/2=0.04 ✓.
  - Verified by reading: 10-otdr-testing.md:111–341
- L2.11 Q2: IL = −6.0 − (−15.3) = 9.3 dB [CORRECT]. Verified. L2.11 Q3, Q4, Q5: per-event vs end-to-end independence, reference re-setting after cable move, dual-wavelength macrobend detection. All correct.
  - Verified by reading: 11-power-meter-light-source-testing.md:289–345
- L2.11 Pulse 2: −5 − (−17.8) = 12.8 dB. Correct.
  - Verified by reading: 11-power-meter-light-source-testing.md:357–359
- L2.12 Q1: Zone A zero-tolerance; clean → [CORRECT]=B. Zone B ≤5 scratches ≤5 µm. Correct.
  - Verified by reading: 12-acceptance-testing-as-built-documentation.md:270–282
- L2.12 Q3, Q4, Q5: 1550 nm required per ANSI/TIA-526-7, out-of-calibration OTDR requires full retest, fiber color record operational criticality. All correct.
  - Verified by reading: 12-acceptance-testing-as-built-documentation.md:305–347
- L2.12 Pulse 2: 15×0.4+3×0.10+1×0.50 = 6.0+0.3+0.5 = 6.8 dB, measured 7.8 → FAIL. Correct.
  - Verified by reading: 12-acceptance-testing-as-built-documentation.md:358–360
- Exam Q3: 30×0.4+6×0.10 = 12.0+0.6 = 12.6 dB < 14.4 dB budget, margin 1.8 dB → [A] correct.
  - Verified by reading: 99-final-exam.md:68–82
- Exam Q13: (−0.04+0.16)/2 = 0.12/2 = 0.06 dB, passes ≤0.10 → [A] correct.
  - Verified by reading: 99-final-exam.md:245–264
- Exam Q15: −8.0−(−19.4) = 11.4 dB → [C] correct.
  - Verified by reading: 99-final-exam.md:287–300
- Exam Q18: Zone A clean, Zone B three scratches ≤5 µm (passes), Zone D chip informational → [B] correct.
  - Verified by reading: 99-final-exam.md:341–354
- Exam Q20 rationale math (independent of label error): 25×0.4=10.0, 5×0.10=0.5, 2×0.50=1.0 → total 11.5. Confirmed.
- Exam Q21: (0.06+0.14)/2=0.10 dB passes ≤0.10 (≤ rule); 5.8 < 6.2 passes → [B] correct.
  - Verified by reading: 99-final-exam.md:393–403
- Exam Q25: IL_max=7.2+0.4+1.0=8.6; 1310nm 9.1>8.6 fails; 1550nm 10.3>8.6 fails → [C] correct (rationale complete; label note above is low severity).
  - Verified by reading: 99-final-exam.md:453–466
- Citation plausibility: IEC 61300-3-4 §5 (OTDR bidir avg), ANSI/TIA-526-7 §5 (Method B), IEC 61753-1 (≤0.5 dB outdoor connector), IEC 61300-3-35 §5 (end-face zones), GR-196 (.sor format), BICSI OSP-DRD Ch.9–10. All plausible and internally consistent with lesson text.
- Vendor neutrality: Fujikura/Sumitomo splicers; EXFO/Viavi/Fluke OTDRs and meters; Corning/CommScope/AFL connectors and tools — coverage balanced across three vendors in each category.
- Final exam coverage: All 25 questions confirmed to map to lessons 2.1–2.12 per the distribution table at the end of the file. No question pulls on content from outside the topic scope.
- Q20 authoring-agent flag verified: Confirmed discrepancy exists. Root cause is label error in Option A (11.0 vs derived 11.5), not a methodology error. The flagged "10.2 dB" figure is from L2.12 lesson Q2 (22 km route), not from Exam Q20 (25 km route). Both issues are separate findings documented above (#1 and #2).

---

## Coverage Gaps

The five in-scope files were read in full. The following were not re-audited because they are out of scope for Batch C:
- Lessons 2.1–2.8 (covered in Batches A and B; referenced here only for cross-lesson consistency checks, which were spot-verified at the glossary cross-reference sections)
- Moodle XML import rendering — content is reviewed at the markdown source level only; platform-rendering artifacts (question randomization, drag-and-drop interactivity) are outside this audit's scope.
- IEC/TIA source documents were not independently consulted — citation plausibility is assessed against internal lesson consistency, not against the primary standards text.

---

=== TOPIC 2 BATCH C CONTENT VERIFICATION END ===
