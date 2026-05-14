# Batch C Canonical — Topic 2 Lessons 2.9–2.12 + Final Exam
**Pipeline step:** Step 4 (Red Team Verification) — READ-ONLY pass
**Source reports:** BATCH_C_CONTENT_VERIFICATION.md (A, 6 findings) + BATCH_C_AUDITOR_B_REPORT.md (B, 14 findings) + BATCH_C_PEER_REVIEW.md (16 unique post-dedup)

---

## Stack Snapshot (≤80 words)

All 16 peer-reviewed findings independently verified against content. Twelve confirmed as stated. Two severity adjustments confirmed (B#6 → LOW, B#2 → MEDIUM). One finding severity upgraded (C-04 to CRITICAL after red-team arbitration: Q17 [CORRECT] answer is wrong in the direction that causes technicians to misuse Method A on real jobs). C-12 upgraded from UNCERTAIN to MEDIUM. Final canonical: 1 CRITICAL, 4 HIGH, 7 MEDIUM, 4 LOW, 0 FALSE-POSITIVE.

---

## Canonical Findings Table

| # | Source | Severity (FINAL) | Category | Lesson | Location | Issue | Red Team Status | Red Team Note |
|---|---|---|---|---|---|---|---|---|
| C-04 | B#3 / A#4 | **CRITICAL** | Internal Contradiction / Wrong Answer | L2.11 / Final Exam | 11-power-meter-light-source-testing.md:113–141; 99-final-exam.md:321–334 | Q17 [CORRECT]=C says Method A measures ~0.35 dB **less** than Method B; lesson body lines 113–117 explicitly states Method A **overstates** loss vs standard (i.e., measures MORE than Method B); Q17 answer is factually inverted | VERIFIED — SEVERITY-UP to CRITICAL | Red team arbitration: lesson body lines 113–117 are correct per TIA-526-7 §5 logic. In Method A, the reference zeroes only the source-side coupling; the far-end adapter connection is NOT zeroed, so Method A includes an extra connector penalty Method B does not. Method A measures MORE, not less. Q17 [CORRECT] must flip to A ("Method A measures approximately 0.35 dB more than Method B"). Any technician accepting this course answer will mistakenly apply Method A when they want a conservative (high-side) measurement — real-world acceptance risk. Severity CRITICAL. |
| C-01 | A#2 / B#4 | HIGH | Quiz Answer-Key | L2.12 | 12-acceptance-testing-as-built-documentation.md:285–301 | Q2 [CORRECT] option B label says 9.8 dB; rationale derives 10.2 dB (8.8+0.4+1.0=10.2); no option label equals 10.2; Moodle learner cannot select correct answer | VERIFIED — dual-convergence confirmed | Label fix only: change option B from 9.8 → 10.2 dB. Derivation in rationale is correct. No rewrite required. Remove the instructor note at line 301 before Moodle import. |
| C-02 | A#1 | HIGH | Quiz Answer-Key | Final Exam | 99-final-exam.md:371–386 | Q20 Option A label says 11.0 dB but rationale correctly derives 11.5 dB; [CORRECT]=A; since 11.5 = budget the link passes (≤ rule), so [CORRECT] should be B ("passes at limit"), not A | VERIFIED | Rationale at line 381 correctly computes 11.5 dB and states "FAILS" — then the option text says 11.0 dB FAILS; both the label and the verdict in A are wrong. Fix: change Option A label to 11.5 dB; flip [CORRECT] to B (pass at exactly 11.5 = limit). |
| C-03 | B#1 | HIGH | Technical Accuracy | L2.10 | 10-otdr-testing.md:93 | Macrobend diagnostic signature described as "high bending loss at 1625 nm relative to 1310 nm"; acceptance testing uses 1550 nm per ANSI/TIA-526-7, not 1625 nm | VERIFIED | Line 93 confirmed. 1625 nm is a live-fiber OTDR monitoring wavelength, not the acceptance test wavelength. Fix: change "1625 nm" → "1550 nm" at line 93. |
| C-05 | A#3 | HIGH | Internal Inconsistency | L2.11 | 11-power-meter-light-source-testing.md:133–141 (table) vs 274–285 (Q1) | Table: Method B=1.8 dB, Method C=1.2 dB → delta 0.6 dB; Q1 [CORRECT]=B says understatement is ~0.3 dB (one connector pair); these contradict | VERIFIED — SEVERITY-UP to HIGH (linked to C-04) | Method C excludes both FUT end connectors per lesson body lines 125–129 ("Measured insertion loss excludes both end connectors of the fiber under test"). Method B includes both. Delta = two connector pairs ≈ 0.6 dB, matching the table. Q1 [CORRECT] should be C (0.6 dB), not B (0.3 dB). This is a cascade of the same Method A/B/C definitional confusion as C-04. Peer set this MEDIUM; red team upgrades to HIGH because it is the same root error as CRITICAL C-04, teaching the wrong delta to every learner who takes Q1. |
| C-06 | B#9 | MEDIUM | Technical Accuracy | L2.9 | 09-hardened-osp-connectors.md:105 | Step 3 says "Inspect the ferrule end-face with a scope or visual fault locator as applicable" — VFL cannot inspect end-face; "as applicable" implies VFL is sometimes correct for this step, which it is not | VERIFIED | Line 105 confirmed. Fix: remove "or visual fault locator" from step 3; VFL belongs in step 5 (continuity check) only. |
| C-07 | B#8 | MEDIUM | Internal Contradiction | L2.11 | 11-power-meter-light-source-testing.md:159 vs 203 | Step 3 says stabilize "typically 30–60 seconds from power-on"; Error 4 says drift continues for "first 10–15 minutes after power-on" — directly contradictory in same document | VERIFIED | Both lines confirmed. Error 4 description is operationally correct for laser sources. Step 3 is dangerously short. Fix: update step 3 to "Allow source to warm up (5–15 minutes for laser sources, or until stabilization LED indicates stable output)." |
| C-08 | B#7 | MEDIUM | Internal Inconsistency | L2.9 / L2.10 | 09-hardened-osp-connectors.md:61 vs 10-otdr-testing.md:45 | APC return loss: L09 says "≥ 65 dB typical"; L10 says "≥ 55 dB" — inconsistent within same content set | VERIFIED | L09 line 61: "return loss ≥ 65 dB typical"; L10 line 45: "return loss ≥ 55 dB". Both appear in Key Terms / body text. Fix: standardize both to "≥ 55 dB (IEC 61300-3-6 minimum); ≥ 65 dB typical" with explicit min/typical split. |
| C-09 | B#10 | MEDIUM | Gotcha Missed | L2.12 | 12-acceptance-testing-as-built-documentation.md:285–301 | RUS Form 219 (USDA OTDR test report) never mentioned in RUS-specific content; RUS-funded project could be rejected for omitting it | VERIFIED | RUS section confirmed to cover NIST calibration, chain-of-custody, digital delivery, ROW records — no Form 219 mention. Fix: add one sentence in the RUS section noting Form 219 may be required; verify with area engineer. |
| C-11 | B#11 | MEDIUM | Internal Inconsistency | L2.10 | 10-otdr-testing.md:56; 99-final-exam.md:262–273 | Q2 uses 15 m dead zone example; body text states "Typical range: 0 to 10 m" — inconsistent | VERIFIED — as MEDIUM (not LOW as peer proposed) | Body text line 56 says "0 to 10 m"; Q2 scenario at line 262 uses 15 m dead zone at 100 ns pulse width. The lesson itself (line 81) says 100 ns is "common for intra-splice-closure resolution" — so the "0-10 m" prose directly contradicts the lesson's own worked scenario at the lesson's own recommended pulse width. This is not just a downstream of C-12; the Q2 scenario is internally inconsistent with line 56 right now. Both C-11 and C-12 must be fixed together. Severity remains MEDIUM (peer downgraded to LOW; red team keeps at MEDIUM given internal scenario contradiction). |
| C-12 | B#5 | MEDIUM | Technical Accuracy | L2.10 | 10-otdr-testing.md:53–57 | Launch dead zone "Typical range: 0 to 10 m" understates real OSP range; table shows event DZ at 300 ns is ~30 m; at 100 ns (common) would be ~10–15 m, and Q2 scenario uses 15 m | VERIFIED — UNCERTAIN resolved to MEDIUM | Body text table at lines 72–79 shows 30 ns → ~3 m event DZ, 300 ns → ~30 m. At 100 ns (interpolated, and confirmed by Q2 scenario using 15 m), the launch DZ exceeds "0–10 m". The adjacent table partially mitigates but the prose "Typical range: 0 to 10 m" standing alone is misleading for OSP 100 ns context. Fix: replace "0 to 10 m" with "1–30 m, strongly dependent on pulse width; see pulse-width table" and add a reference pointing to the table. |
| C-13 | B#2 | MEDIUM | Gotcha Missed | L2.10 | 10-otdr-testing.md:31, 85–146 | L10 covers OTDR testing with no mention that acceptance requires testing at both 1310 nm and 1550 nm; learner reading only L10 could produce a 1310-nm-only package | VERIFIED — peer downgrade to MEDIUM confirmed | OTDR thresholds table at lines 133–142 confirmed to omit dual-wavelength requirement. L11 Q5 and L12 Q3 do address it (confirmed). L10 is the OTDR-specific lesson; it should state the requirement. Fix: add one sentence in acceptance thresholds section: "Per ANSI/TIA-526-7, OTDR testing must be conducted at both 1310 nm and 1550 nm for OS2 SMF acceptance." |
| C-14 | A#5 | LOW | Presentation/Clarity | L2.10 | 10-otdr-testing.md:277–297 | Q3 contains original erroneous option set + inline [Note] correction + restated option set; both sets present; Moodle import risk | VERIFIED — peer severity LOW confirmed | Lines 277–297 confirmed. The [Note] block at line 284 explicitly flags the error; the corrected option set follows. Fix: delete lines 277–284 (broken option set + note); retain restated options at 286–291 as the sole option set. |
| C-15 | A#6 / B#12 | LOW | Bad Distractor | Final Exam | 99-final-exam.md:453–466 | Q25 distractor A states "9.1 dB is within the budget of 8.6 dB" — 9.1 > 8.6, arithmetically false; distractor is factually wrong rather than a plausible misconception | VERIFIED — dual-convergence confirmed | Line 455 confirmed: "PMLS at 1310 nm (9.1 dB) is within the budget." Budget = 8.6 dB. 9.1 > 8.6. Fix: rewrite distractor A to a plausible misconception (e.g., "Pass — all individual splice events pass ≤ 0.08 dB; per-event pass means end-to-end passes"). |
| C-16 | B#13 | LOW | Gotcha Missed | Final Exam | 99-final-exam.md:67–82 | Q3 link budget silently omits connectors; real 30 km feeder would have connector pairs; learner may internalize connector loss is omitted from feeder budgets | VERIFIED — LOW confirmed | Line 68–82 confirmed: cable + splices only, no connectors in scenario. Fix: add "assume no connectors" clarification to the question text, or add two connector pairs to the scenario. |
| C-17 | B#14 | LOW | Technical Accuracy | L2.10 | 10-otdr-testing.md:72–79 | Pulse width table column header "Range (dynamic range)" conflates OTDR range (distance) with dynamic range (dB) | VERIFIED — LOW confirmed | Line 72 confirmed: header "Range (dynamic range)" with dB values in body. Fix: rename column header to "Dynamic Range (dB)". |

---

## Rejected Findings

None from the 16 peer-reviewed canonical items. All verified.

**Previously-dropped item:** C-10 (peer correctly identified as duplicate of C-04; A#4 and B#3 are the same issue from opposite quiz angles). Red team confirms: C-10 is fully subsumed by C-04.

---

## Negative-Finding Spot-Checks

1. **L10 bidirectional arithmetic (lines 111–127):** Forward+reverse worked examples all verified correct: (0.08+0.12)/2=0.10 ✓; (−0.02+0.09)/2=0.035 ✓. Formula correctly handles gainers.

2. **L12 Q1 (lines 270–281) Zone A zero-tolerance:** Zone A = no visible scratches regardless of size. [CORRECT]=B clean and re-inspect. Confirmed correct; confounding distractor A correctly identified as applying Zone B criteria to Zone A.

3. **Q20 IL_max derivation (lines 380–384):** 25×0.4=10.0 + 5×0.10=0.5 + 2×0.50=1.0 = 11.0 dB IL_max. Option A label says 11.0 dB — the label itself is correct (derivation matches); the problem is the label says 11.0 dB FAILS, but measured 11.5 > 11.0, so the conclusion "FAILS" in Option A is correct but the 11.0 label being [CORRECT] conflicts with Option B saying 11.5 = limit passes. C-02 finding confirmed.

4. **L09 Q2 IL threshold (lines 193–204):** ≤ 0.5 dB per IEC 61753-1 performance standard B. [CORRECT]=C confirmed. Distractor B (0.3 dB typical vs limit) correctly identified as wrong. Clean.

5. **Final Exam Q21 (lines 390–403):** (0.06+0.14)/2=0.10; ≤ rule means 0.10 passes; 5.8<6.2 passes. [CORRECT]=B confirmed. Math and logic verified clean.

6. **L11 Q2 (lines 289–299):** IL = −6.0 − (−15.3) = 9.3 dB. [CORRECT]=C confirmed correct. Clean.

7. **L09 line 105 workflow step 5 (continuity check):** Step 5 says "verify signal presence (optical power or ONT link LED)" — appropriately describes a continuity check, not a VFL. The VFL error in step 3 (C-06) is isolated; step 5 is clean.

---

## Fix-Agent Dispatch Readiness

### CRITICAL-tier (1 commit — ship first)

**C-04:** L11 Method A description vs Q17 [CORRECT] contradiction.
- Fix path: Q17 [CORRECT] must change from C to A. Option A text should read "Method A measures approximately 0.35 dB more than Method B." Option C text should become the wrong answer. Update Q17 rationale to reflect that Method A overstates (calibrates out less in reference step). Also review Q17 option D (0.70 dB) — this would only be right if two pairs were excluded; it stays as a wrong distractor.
- TIA-526-7 arbitration: lesson body lines 113–117 (Method A overstates) is correct. Q17 [CORRECT]=C is wrong. Fix Q17 to match the lesson body.

**C-05 (CRITICAL cascade):** Q1 [CORRECT]=B (0.3 dB) should be [CORRECT]=C (0.6 dB).
- Lesson body lines 125–129 says Method C excludes both FUT end connectors. Method B includes both. Delta = one connector pair per end × 2 ends = two pairs ≈ 0.6 dB. Table (1.8–1.2=0.6) confirms this.
- Fix: flip Q1 [CORRECT] from B to C; update rationale to explain two connector pairs (not one) are excluded by Method C.
- Include in same commit as C-04 since same root cause.

### HIGH-tier (1 commit)

- **C-01 (L12 Q2):** Change option B label from 9.8 → 10.2 dB. Remove instructor note at line 301.
- **C-02 (Q20):** Change Option A label from 11.0 → 11.5 dB; flip [CORRECT] from A to B. Fix Option A rationale conclusion from "FAILS" to "FAILS (11.5 > 11.0)". Note: measured=11.5=budget boundary; ≤ rule means it exactly passes, so [CORRECT]=B is right.
- **C-03 (L10 macrobend wavelength):** Change "1625 nm" → "1550 nm" at line 93.

### MED-tier (1 commit)

- **C-06:** Remove "or visual fault locator" from L09 step 3 (line 105).
- **C-07:** Update L11 procedure step 3 (line 159) warm-up time from "30–60 seconds" to "5–15 minutes for laser sources; use stabilization LED if available."
- **C-08:** Standardize APC return loss in both L09 line 61 and L10 line 45 to "≥ 55 dB (IEC 61300-3-6 minimum); ≥ 65 dB typical."
- **C-09:** Add RUS Form 219 sentence in L12 RUS section.
- **C-11:** Q2 scenario (line 262) dead zone = 15 m; body text (line 56) says "0 to 10 m" — fix body text to match; or leave as resolved by C-12 fix (see below). These two items should be fixed together.
- **C-12:** Replace "Typical range: 0 to 10 m" (line 56) with "Typical range: 1–30 m, strongly dependent on pulse width (see table below)." This also resolves C-11's inconsistency.
- **C-13:** Add one sentence in L10 acceptance thresholds section noting dual-wavelength OTDR requirement per ANSI/TIA-526-7.

### LOW-tier (1 commit or combine with MED)

- **C-14:** Delete broken option set + note at L10 Q3 lines 277–284; retain restated options.
- **C-15:** Rewrite Q25 distractor A to a plausible misconception.
- **C-16:** Add "assume no connectors at each end" to Q3 question text.
- **C-17:** Rename pulse width table column "Range (dynamic range)" → "Dynamic Range (dB)" (line 72).

---

## Adjacent Observations (not canonical — do not add to fix agent scope)

1. **Q17 option text cleanup:** After fixing [CORRECT] direction, confirm all four option texts are mutually consistent and that the distractor for "0.70 dB less" (option D) is still a useful plausible-but-wrong choice.
2. **L11 table note (line 141):** The note says "Methods A and B produce similar results in this example." After fixing C-04/C-05, this note should ideally be updated to say "Methods A and B produce similar results in this example because both include the far-end connection (see Method A description above)." Minor prose clarity improvement — not a correctness issue.
3. **Q2 (L12) instructor note wording (line 301):** After label fix (C-01), the note "Confirm numeric options before use in Moodle" should be deleted entirely — it's an authoring artifact not a learner-facing note.

---

=== TOPIC 2 BATCH C CANONICAL END ===
