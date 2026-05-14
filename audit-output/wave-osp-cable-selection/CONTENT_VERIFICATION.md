# OSP Cable Selection — Content Verification Red-Team Report

**Date:** 2026-05-14
**Scope:** 12 lessons + 99-final-exam.md (13 files total)
**Branch:** claude/debug-previous-issues-MoN9D
**Verifier role:** Content verification — math consistency, internal consistency, cross-lesson contradictions

---

## Stack Snapshot (≤80 words)

All 13 content files read and verified. Math re-derived independently for every numeric question. Cross-lesson citation checks performed for transceiver standards (IEEE 802.3ae), tracking-resistance thresholds (IEEE 1222), return-loss specs (ANSI/TIA-568.3-D), and connector standards. Six findings total: 1 CRITICAL, 2 HIGH, 2 MEDIUM, 1 LOW. Two findings were pre-noted in the topic-complete file as "known issues" — one confirmed real (L10 Q6), one confirmed NOT a bug (L6 Q6 = 279, math is correct).

---

## Findings Table

| # | Lesson | Item | Severity | Category | Issue | Fix Shape |
|---|---|---|---|---|---|---|
| 1 | L1 (`01-smf-vs-mmf.md`) | Q1 rationale | CRITICAL | math | Rationale states "~8 dB span loss at 0.4 dB/km × 40 km" — actual product is 16 dB, not 8 dB; 16 dB exceeds the 12.6 dB 10GBASE-LR budget cited in the same rationale, making the question's own scenario self-contradictory | Fix: correct to 16 dB and update rationale to note this span exceeds LR budget, requiring ER (40 km, per IEEE 802.3ae clause 50) |
| 2 | L10 (`10-cable-selection-by-environment.md`) | Q6 answer C | HIGH | math | Answer C labeled 4,015 m [CORRECT] but 3,865 m × 1.05 = 4,058 m; the "designer note" claims 4,015 m is the result "without rounding the contingency upward" — no mathematical path from these inputs produces 4,015 | Fix: change Answer C label to 4,058 m (or 4,060 m rounded); update [CORRECT] marker; remove misleading designer note |
| 3 | Final Exam (`99-final-exam.md`) | Q11 | HIGH | consistency | Exam Q11 states "APC connectors have ~60 dB return loss vs. **~35 dB** for UPC" — contradicts every lesson (L9, L7, L11) which correctly state UPC RL ≥ 50 dB per ANSI/TIA-568.3-D; "~35 dB" would describe a physical-contact connector in poor condition, not a properly installed UPC | Fix: change "~35 dB" to "≥50 dB" in Q11 rationale; update answer stem if it references the 35 dB figure |
| 4 | L9 (`09-connector-termination.md`) | Q3 | HIGH | consistency | [CORRECT] marker placed on answer "MPO-12 — 8 active fibers plus 4 dark positions" but rationale immediately states "QSFP-DD 400G SR8 uses 8 active fibers + 8 active fibers = 16 fibers total in an MPO-16" — [CORRECT] marker and rationale identify different answers; IEEE 802.3cm 400GBASE-SR8 uses MPO-16, not MPO-12 | Fix: move [CORRECT] marker to MPO-16 option; update question stem or answer list to make MPO-16 the clearly correct answer; remove MPO-12 option or re-label it as a distractor |
| 5 | L7 (`07-sheath-fire-ratings.md`) vs L10 (`10-cable-selection-by-environment.md`) | Q2 vs body text | MEDIUM | consistency | L7 Q2 presents tracking-resistant sheath as the correct answer for a 7.2 kV distribution line; L10 body text explicitly states "Track-resistant compounds are specified in IEEE 1222 for installations on transmission lines **above 69 kV**" — the two lessons give contradictory thresholds (7.2 kV vs > 69 kV) | Fix: Reconcile by adding a note in L7 that tracking-resistant sheathing is a conservative/prudent choice below 69 kV but is mandated by IEEE 1222 only above 69 kV; or explicitly change L7 Q2 to use a ≥ 69 kV scenario |
| 6 | L1 (`01-smf-vs-mmf.md`) | Scenario Path A | MEDIUM | citation | Path A recommends "10GBASE-LR transceivers" for a 48 km campus link; 10GBASE-LR is IEEE 802.3ae rated to 10 km max; 10GBASE-ER covers 40 km (12.6 dB budget) — 48 km exceeds even ER, requiring amplification or 100GBASE-based optics; the scenario as written would not work in practice | Fix: Replace "10GBASE-LR" with "10GBASE-ER" and note that 48 km may require optical amplification; alternatively reduce span distance to ≤40 km in the scenario |
| 7 | Final Exam (`99-final-exam.md`) | Q7 | LOW | pedagogy | [CORRECT] answer B is marked for "faster connectorization" as the reason to prefer pre-connectorized drop cables; primary rationale given in L8 and L3 is labor efficiency and reduced skill requirement at pedestal, not connectorization speed per se; the answer is defensible but the distractor D ("eliminates need for fusion splicing in the field") is arguably a more precise and higher-fidelity answer | Fix: Consider swapping [CORRECT] to D, or strengthen the Q7 rationale to more precisely distinguish B from D |

---

## Negative Findings (Confirmed Clean)

The following lessons were checked and no issues found:

- **L2 (`02-cable-construction-basics.md`)** — Color coding Q6 (tube 7 = Red, fiber 3 = Green) verified correct per TIA-598-D 12-color sequence. All loose-tube vs tight-buffer content internally consistent.
- **L3 (`03-ribbon-cable-mass-fusion.md`)** — Mass-fusion math fully verified: 864F × 0.75 min/fiber × 1 ribbon-splice/12 fibers = 54 min/12-fiber ribbon; 14-closure scenario totals 151h (mass-fusion) vs 235h (single-fiber) = 4.3× improvement. Consistent with L8 references.
- **L4 (`04-armored-aerial-direct-bury.md`)** — Burial depths (24 in. general, 36 in. under roads) consistent with TIA-758-C §6.3 citations. NESC Rules 230/232 references internally consistent. No math items in this lesson.
- **L5 (`05-microduct-air-blown-fiber.md`)** — Fill ratio formula and all calculations verified: Q2 fill ratio 9.0/14 = 0.643 > 0.60 correctly flagged as failing. Flashcard 2: 10 mm × 0.55 = 5.5 mm maximum cable OD correct. ABFU 85% bore rule consistent with Q2 scenario.
- **L6 (`06-strand-counts-buffer-tube.md`)** — L6 Q6 "known issue" from topic-complete file re-verified: 144 + 132 + 3 = 279 absolute fibers. Math is CORRECT. No issue here. BICSI 4×/3×/2× design multiples internally consistent throughout.
- **L8 (`08-drop-distribution-feeder.md`)** — Q2 (48÷16=3, ×3 distribution multiple=9, round to next standard 12-fiber cable) ✓. Q5 (3,500 m + 70 m slack = 3,570 m) ✓. All PON splitter ratios (32:1, 16:1) consistent with L1 and L11 references.
- **L11 (`11-compliance-nesc-nec-tia-bicsi.md`)** — Nine-item compliance checklist consistent. NEC Art. 770 50-foot (15 m) interior limit, OFNR/OFNP fire ratings, NESC C2-2023 Rules 250-251 references all internally consistent. No math items.
- **L12 (`12-case-studies.md`)** — Case A cable order math: stated ~12,275 m, independently derived ~12,272 m — acceptable rounding. Q17 exam bridge math verified correct (126 min, 144-fiber standard splice interval). Cross-references to L8 feeder/distribution hierarchy consistent.
- **Final Exam Q13** — ABFU answer self-corrects with a parenthetical but the [CORRECT] answer is unambiguously the right one. No error.
- **Final Exam Q17** — Full math independently verified correct.
- **Final Exam Q25 (pass threshold)** — 18/25 = 72% ≥ 70% pass threshold stated in topic-complete file. Consistent.

---

## Coverage Gaps

- **Standard text not validated:** Per task instructions, actual ANSI/TIA-568.3-D, ANSI/TIA-758-C, NESC C2-2023, IEEE 802.3ae, and BICSI OSP-DRD PDFs were not available. All citation-based findings are flagged based on internal contradictions or against well-established published values (e.g., 10GBASE-LR = 10 km max is IEEE 802.3ae clause 50, not an interpretation).
- **Questions 1-10 and 14-16, 18-24 of final exam:** These were verified for internal consistency with lesson content and math but not cross-checked against external standard PDFs.
- **L6 Q6 "known issue":** The topic-complete file flagged this as a known math issue. Re-verification confirms it is NOT a bug — the math is correct at 279 fibers. No fix needed.
- **L10 Q6 "known issue":** Topic-complete also flagged this. Confirmed as a real error — Answer C (4,015 m) does not match the stated calculation (4,058 m).

---

=== CABLE SELECTION CONTENT VERIFICATION END ===
