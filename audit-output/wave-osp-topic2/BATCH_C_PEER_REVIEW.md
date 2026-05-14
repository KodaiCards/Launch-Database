# Batch C Peer Review — Topic 2 Lessons 2.9–2.12 + Final Exam
**Pipeline step:** Step 3 — Consolidation before Red Team
**Source reports:** BATCH_C_CONTENT_VERIFICATION.md (Auditor A, 6 findings) + BATCH_C_AUDITOR_B_REPORT.md (Auditor B, 14 findings)

---

## Stack Snapshot (≤80 words)

Both auditors found real errors. Auditor A caught clean math/label bugs in quiz answer keys. Auditor B's adversarial framing surfaced six additional issues a technician would hit on a real job site. Four of B's findings are DISAGREE/UNCERTAIN — one on math semantics (B5), one over-elevated severity (B6 demoted to LOW), two genuine new HIGH/MEDIUM findings that survive. Net unique confirmed findings: 16, with 2 DISAGREED, 1 UNCERTAIN, and 2 DUPLICATE merges.

---

## Consolidated Findings Table

| # | Source | Severity (final) | Category | Lesson | Location | Issue | Peer Tag | Peer Rationale |
|---|---|---|---|---|---|---|---|---|
| C-01 | A#2 / B#4 | HIGH | Quiz Answer-Key | L2.12 | 12-acceptance-testing-as-built-documentation.md:285–301 | Q2 [CORRECT] label reads 9.8 dB; derivation in rationale is 10.2 dB; no option matches 10.2 dB | **AGREE — DUAL CONVERGENCE** | Independently confirmed: rationale states 8.8+0.4+1.0=10.2, label says 9.8. Moodle learner cannot select correct answer. Strong fix priority. |
| C-02 | A#1 | HIGH | Quiz Answer-Key | Final Exam | 99-final-exam.md:371–386 | Q20 Option A label states 11.0 dB and is tagged [CORRECT] but derivation 25×0.4+5×0.10+2×0.50=11.5 dB → actual IL_max is 11.5; Option A contradicts itself; [CORRECT] should be on B (pass at limit) or question re-parameterized to produce 11.0 dB | **AGREE** | Verified: rationale at line 381 correctly computes 11.5 and calls it FAIL, but text of rationale at line 373 says "11.0 dB … FAILS." The rationale is itself contradictory. The question body and answer key need a clean rewrite. |
| C-03 | B#1 | HIGH | Technical Accuracy | L2.10 | 10-otdr-testing.md:93 | Macrobend described as "high bending loss at 1625 nm relative to 1310 nm" but acceptance testing per ANSI/TIA-526-7 uses 1550 nm, not 1625 nm | **AGREE** | Verified at line 93. L11 Q5, L12 Q3, and final exam Q24/Q25 all correctly cite 1550 nm as the operative wavelength. 1625 nm is an OTDR monitoring wavelength, not the acceptance test wavelength. Wrong wavelength in the diagnostic signature description. |
| C-04 | B#3 | HIGH | Internal Contradiction | L2.11 / Final Exam | 11-power-meter-light-source-testing.md:131–141; 99-final-exam.md:321–334 | Method A/B table shows both ~1.8 dB; Q17 [CORRECT]=C says Method A measures ~0.35 dB LESS than Method B. These are irreconcilable. | **AGREE** | Verified: table note at line 141 says "Methods A and B produce similar results in this example." Q17 says Method A measures 0.35 dB less than Method B. One of these is wrong. Table note is correct per TIA-526-7 semantics (both A and B include far-end connector; see note): actually the Q17 answer and its rationale claim A understates vs B by ~1 connector pair. This contradicts the table note. Red team should arbitrate which is correct per TIA-526-7 §5. |
| C-05 | A#3 | MEDIUM | Internal Inconsistency | L2.11 | 11-power-meter-light-source-testing.md:133–141 vs 274–285 | Table shows Method B ~1.8 dB, Method C ~1.2 dB → delta 0.6 dB. Q1 [CORRECT]=B says understatement is ~0.3 dB (one connector pair). Inconsistent. | **AGREE** | Verified: table at line 133–141 shows Method C at 1.2 dB vs Method B at 1.8 dB (0.6 dB delta). Q1 correct answer B cites ~0.3 dB. The difference is one connector pair (B) vs two connector pairs (C). This is the same root as C-04: Method A/B/C semantics in the table note need reconciliation. **OVERLAP-DIFFERENT-ANGLE** from C-04; both survive as they expose the same table inconsistency from two quiz directions. |
| C-06 | B#9 | MEDIUM | Technical Accuracy | L2.9 | 09-hardened-osp-connectors.md:105 | Workflow step 3: "Inspect end-face with a scope or visual fault locator as applicable" — VFL is a continuity/macrobend tool, not an end-face inspection instrument | **AGREE** | Verified at line 105. VFL cannot inspect ferrule end-face; this is a field safety issue — a technician following this instruction could skip the scope. Fix: remove "or visual fault locator" from step 3. |
| C-07 | B#8 | MEDIUM | Internal Contradiction | L2.11 | 11-power-meter-light-source-testing.md:159 vs 203 | Step 3 says "Allow source to stabilize (typically 30–60 seconds)"; Error 4 says drift continues for "first 10–15 minutes after power-on." These are contradictory. | **AGREE** | Verified: line 159 says "typically 30–60 seconds from power-on" and line 203 says "especially in the first 10–15 minutes after power-on (warm-up drift)." Same document, directly contradictory. The Error 4 description is more conservative and aligns with field practice for laser sources. Fix step 3 to recommend full warm-up or wait for stabilization indicator. |
| C-08 | B#7 | MEDIUM | Internal Inconsistency | L2.9 / L2.10 | 09-hardened-osp-connectors.md:61 vs 10-otdr-testing.md:45 | APC return loss: L09 cites "≥ 65 dB typical"; L10 cites "≥ 55 dB" | **AGREE** | Verified: L09 line 61 says "return loss ≥ 65 dB typical"; L10 line 45 says "return loss ≥ 55 dB." Both values exist in the field (55 dB = IEC 61300-3-6 minimum; 65 dB = manufacturer typical). Standardize with explicit min/typical split as B recommends. |
| C-09 | B#10 | MEDIUM | Gotcha Missed | L2.12 | 12-acceptance-testing-as-built-documentation.md:285–301 | RUS Form 219 (USDA OTDR test report form) never mentioned in RUS-specific content | **AGREE** | Verified: the L12 RUS section covers NIST-calibration, chain-of-custody, digital delivery, ROW records — but no mention of Form 219. On many RUS loan/grant projects this is required. A learner could deliver a compliant package that is still rejected. Worthwhile addition. |
| C-10 | A#4 | MEDIUM | Internal Inconsistency | Final Exam | 99-final-exam.md:321–334 | Q17 [CORRECT]=C says Method A measures ~0.35 dB less than Method B; L11 body table says they produce similar results | **DUPLICATE of C-04** | Same root finding as C-04 (A#4 and B#3 are the same inconsistency seen from opposite ends). Merge into C-04. |
| C-11 | B#11 | MEDIUM | Internal Inconsistency | L2.10 | 10-otdr-testing.md:56 + 99-final-exam.md:262–273 | Q2 uses a 15 m dead zone example; body text states "Typical range: 0 to 10 m" — inconsistent | **AGREE-WITH-DOWNGRADE to LOW** | Verified: body text line 56 says "0 to 10 m"; Q2 scenario uses 15 m launch dead zone. Q2's rationale at line 270 says "20 m launch cable is insufficient for most field OTDR setups" — 15 m dead zone is plausible at wider pulse widths and is within the range B#5 proposes for the correction. This is a downstream inconsistency that will be resolved when C-12 (the dead zone range fix) is applied. Low severity on its own; resolves with C-12. |
| C-12 | B#5 | MEDIUM | Technical Accuracy | L2.10 | 10-otdr-testing.md:53–57 | Launch dead zone stated as "Typical range: 0 to 10 m" — understates real OSP range; at 100 ns pulse width dead zone is 30–100 m, which is why 50–500 m cables are required | **UNCERTAIN** | The body text table at lines 72–79 lists pulse-width-vs-dead-zone data showing 30 ns → ~3 m and 300 ns → ~30 m. The "0 to 10 m" statement in the dead zone section may be anchored to the shortest pulse widths and is qualified by the table. However the "typical range" language is misleading for OSP acceptance contexts where 100 ns is common. Red team should determine whether the "0–10 m" prose should be replaced with a pulse-width-referenced range. |
| C-13 | B#2 | HIGH | Gotcha Missed | L2.10 | 10-otdr-testing.md:31,85–146 | Entire L10 lesson covers OTDR testing with zero mention that OTDR must be run at both 1310 nm AND 1550 nm for OSP acceptance | **AGREE-WITH-DOWNGRADE to MEDIUM** | Verified: the OTDR acceptance thresholds table at lines 133–142 makes no mention of dual-wavelength requirement. The lesson's learning objectives and threshold table both omit this. However, L11 Q5 and L12 Q3 do cover the dual-wavelength requirement. The gap is real but is partially addressed in adjacent lessons; severity is MEDIUM rather than HIGH because learners who complete L11 and L12 will encounter the requirement. Still: L10 should state it since it is the OTDR-specific lesson. |
| C-14 | A#5 | LOW | Presentation/Clarity | L2.10 | 10-otdr-testing.md:277–297 | Q3 contains an inline restatement leaving two conflicting option sets in the same question source; broken original options with arithmetic error (0.03 dB stated) visible above corrected set | **AGREE** | Verified at lines 277–298. The [Note] block at line 284 explicitly calls out the arithmetic error in the first option set, then the question re-presents. Both sets are in the file. Moodle import risk is real — the raw source contains the broken set. Fix: delete lines 277–283 (broken option set and note), retain only the restated options. |
| C-15 | B#12 | LOW | Bad Distractor | Final Exam | 99-final-exam.md:453–466 | Q25 distractor A states "9.1 dB is within the budget of 8.6 dB" — arithmetically false; 9.1 > 8.6; distractor should be a plausible misconception, not a factual error | **AGREE** | Verified: line 455 says "PMLS at 1310 nm (9.1 dB) is within the budget." Budget is 8.6 dB. 9.1 > 8.6. Auditor A (finding #6) also flagged this but scored it LOW as "the rationale correctly calls it out." Both auditors agree; severity LOW is correct. Rewrite distractor to a plausible misconception. Note: **DUPLICATE with A#6** — merge. |
| C-16 | B#13 | LOW | Gotcha Missed | Final Exam | 99-final-exam.md:67–82 | Q3 link budget silently omits connectors — a real 30 km feeder would have connector pairs; learner may internalize that connector loss is omitted from feeder link budgets | **AGREE-WITH-DOWNGRADE to LOW** | Verified: Q3 at line 68–82 asks about a 30 km route with 6 splices, no connectors mentioned. The rationale says "cable+splices only." This is a scope choice (no connectors specified in question), not an error. However it could reinforce an omission habit. Severity LOW is appropriate; adding an explicit "assume no connectors" clarification is a clean fix. |
| C-17 | B#14 | LOW | Technical Accuracy | L2.10 | 10-otdr-testing.md:72–79 | Pulse width table column "Range (dynamic range)" conflates OTDR range (distance) with dynamic range (dB) | **AGREE** | Verified: the table header at line 72 reads "Range (dynamic range)" and the body entries list dB values (~20 dB, ~30 dB, ~40 dB, ~50 dB). "Range" in the header implies distance; the values are actually dynamic range in dB. Column header should be "Dynamic Range" to avoid confusion. |

---

## Disposition Summary

**Raw input:** A = 6 findings, B = 14 findings → 20 raw
**After deduplication:**
- C-10 = DUPLICATE of C-04 (A#4 merged into C-04)
- C-15 subsumes A#6 (both flag Q25 distractor A; merged into C-15)

**Net unique findings: 16**

### Severity breakdown (final)

| Severity | Count | Items |
|---|---|---|
| HIGH | 4 | C-01, C-02, C-03, C-04 |
| MEDIUM | 7 | C-05, C-06, C-07, C-08, C-09, C-11 (downgraded), C-13 (downgraded) |
| LOW | 5 | C-12 (UNCERTAIN pending red team), C-14, C-15, C-16, C-17 |

### DISAGREE list

None outright rejected — every finding verified against content. Two items modified:

- **B#5 (C-12)** — Marked UNCERTAIN, not DISAGREE. The "0–10 m" prose is misleading in OSP context but is partially qualified by the adjacent table. Red team to arbitrate.
- **B#6 (C-14 in this table)** — Severity downgraded from B's HIGH to LOW. The Q3 messy presentation is a real issue but not a HIGH — the [CORRECT] answer is clear; the risk is Moodle-import, not learner confusion.

### Convergence

- **C-01 (L12 Q2):** Both auditors converge independently → highest fix confidence, strong dual-confirmation.
- **C-15 (Q25 distractor A):** Both auditors converge independently → strong dual-confirmation.
- **C-04/C-10 (Method A/B table vs Q17):** Both auditors flagged the same inconsistency from different angles (A from exam Q4 direction, B from lesson table direction). Merged into C-04.

---

## Recommended Red-Team Focus Areas

1. **C-04 / C-05 (Method A/B/C table + Q1 + Q17 coherence):** The most technically complex finding. The table note says "A and B produce similar results" yet Q17 [CORRECT] claims A measures 0.35 dB less than B. One of these is wrong per TIA-526-7 §5. Red team should read TIA-526-7 §5 method descriptions and verify which statement is correct, then determine the cascade of fixes to the table, Q1, and Q17 rationale. High-impact: incorrect Method A/B semantics will propagate to every technician who takes this course.

2. **C-12 (Launch dead zone "0–10 m typical"):** The prose is not technically wrong for the shortest pulse widths but is misleading in the OSP acceptance context where 100 ns pulse width (→ ~10–30 m dead zone per EXFO tables) is typical. Red team should verify whether "0–10 m" is accurate for the pulse widths typically used in OSP acceptance work and whether the adjacent table is sufficient to clarify, or whether the prose needs a pulse-width qualifier.

3. **C-01 (L12 Q2 correct-answer existence):** Already has strong dual-convergence confirmation, but the fix has two valid shapes (fix the option label vs. rewrite the question). Red team should confirm which option maps to 10.2 dB (currently none do) and recommend the minimal change: fix option B label from 9.8 → 10.2 dB and remove the inline instructor note before Moodle import.

---

=== TOPIC 2 BATCH C PEER REVIEW END ===
