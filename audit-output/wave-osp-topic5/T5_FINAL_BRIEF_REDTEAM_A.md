# T5 FINAL BRIEF — Red-Team Verification A (Math + 7-Decision)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Red-Team Verifier A — math + arithmetic + 7-decision verification (read-only)
**Input:** T5_FINAL_BRIEF.md (SHA `6348a8db`) + T4_FINAL_BRIEF.md (cross-topic reference)

---

## §1 Final-State Arithmetic Table

| Metric | Brief Claims | Independently Verified | Status |
|---|---|---|---|
| Lesson count | 13 | 13 (L5.1, L5.2a, L5.2b, L5.3–L5.12) | VERIFIED |
| Quiz questions | 26 (2 per lesson × 13) | 26 ✓ | VERIFIED |
| Pass threshold | 19/26 (73%) | 19/26 = 73.08% ✓ | VERIFIED |
| Total duration | ~5.75 hrs / 345 min | **305 min** (5.08 hrs) — see §2 | **ARITHMETIC ERROR** |
| HIGH-INTENSITY count | Brief says "5 HIGH-INTENSITY" but lists 6 in parenthetical | 6 HIGH (L5.1, L5.2a, L5.2b, L5.6, L5.7, L5.9) | **INTERNAL INCONSISTENCY** |
| STANDARD intensity count | 8 (implied by 13 − 5) | 7 STANDARD (L5.3, L5.4, L5.5, L5.8, L5.10, L5.11, L5.12) | **INTERNAL INCONSISTENCY** |

---

## §2 Per-Lesson Duration Sum — Independent Derivation

| Lesson | Claimed Duration |
|---|---|
| L5.1 | 30 |
| L5.2a | 25 |
| L5.2b | 20 |
| L5.3 | 20 |
| L5.4 | 20 |
| L5.5 | 20 |
| L5.6 | 30 |
| L5.7 | 20 |
| L5.8 | 25 |
| L5.9 | 30 |
| L5.10 | 25 |
| L5.11 | 20 |
| L5.12 | 20 |
| **Independent sum** | **305 min** |

**Brief states: "Total duration: ~5.75 hrs (345 min)"**

**MISMATCH — CRITICAL:** My independent sum is **305 min (5.08 hrs)**. The brief is over by **40 minutes**. There are no duration values in the §1 table that sum to 345. Worker A's stated sum of 345 min is arithmetically impossible from the per-lesson durations listed. The "~5.75 hrs" / "345 min" figure is **OVERSTATED** and cannot be reproduced from the source data.

Note: The prompt states "Worker A reported 345 min via: L5.1 30 + L5.2a 25 + L5.2b 20 + L5.3 20 + L5.4 20 + L5.5 20 + L5.6 30 + L5.7 20 + L5.8 25 + L5.9 30 + L5.10 25 + L5.11 20 + L5.12 20 = 305." The prompt itself catches this — the chain addition equals 305, not 345. The brief's stated total of 345/5.75 hrs does not match.

---

## §3 Pass Threshold Math Verification

- **26 × 0.70 = 18.2** → cannot have fractional questions → round up to **19** ✓
- **19 ÷ 26 = 0.7308 = 73.08%** ✓
- Brief states: "19/26 (73%) — math: 26 × 0.70 = 18.2 → round up to 19 (cannot have fractional questions); 19/26 = 73.08%"
- **VERIFIED.** Math is correct and methodology (round up) matches Topics 1–4 convention.

---

## §4 Seven Pre-Resolved Decisions Verification

| # | Decision | Brief Location | Finding |
|---|---|---|---|
| G1 | Galvanic compatibility → L5.1 NACE SP0286 callout | §1 L5.1 scope: "Galvanic compatibility callout box: steel ASTM A475 strand + aluminum die-cast hardware → galvanic isolation required (zinc-coated steel washers or stainless interface hardware); cite NACE SP0286." §3 D-G1: "RESOLVED" | VERIFIED |
| G2 | ADSS → lashed primary + 2-paragraph sidebar in L5.2a | §1 L5.2a scope: "ADSS sidebar (2 paragraphs): preformed grip dead-ends, AGS suspension assemblies — lashed primary, ADSS not re-taught here." §3 D-G2: "KEEP lashed as primary + ADSS as 2-paragraph sidebar in L5.2a." | VERIFIED |
| G3 | ANSI O5.1 → 5–7 min section in L5.1 (elevates to 30 min) | §1 L5.1 scope: "ANSI O5.1 pole grading/class selection (5–7 min section)"; duration = 30 min; intensity = HIGH-INTENSITY. §3 D-G3: "ADD 5–7 min section to L5.1…L5.1 is elevated to HIGH-INTENSITY and 30 min accordingly." | VERIFIED |
| L5.6 | ANSI/SCTE 77 primary + AASHTO H20/H25 cross-ref; "Tier 22" prohibited from quiz [CORRECT] | §1 L5.6 scope: "Primary citation: ANSI/SCTE 77…AASHTO H20/H25 as cross-reference…use 'ANSI/SCTE 77 Class X' — do NOT write quiz [CORRECT] answers with 'Tier 22'." §3 D-L56: "RESOLVED." | VERIFIED |
| L5.9a | FDH growth factor locked at 1.20 | §1 L5.9 scope: "growth factor locked at 1.20 (20% over-provisioning — standard FTTH design practice; 1.15 alternative stripped)." §3 D-L59a: "Locked at 1.20. 1.15 alternative stripped from brief." | VERIFIED |
| L5.9b | 7 CFR Part 1755 + PE-60 (NOT RUS Bulletin 1738) for L5.9 + L5.10 | §1 L5.9 scope: "RUS citation: 7 CFR Part 1755 + RUS PE-60 (NOT RUS Bulletin 1738 — Bulletin 1738 governs Distance Learning/Telemedicine loan program)." §1 L5.10 scope: "RUS citation: 7 CFR Part 1755 + RUS PE-60." §3 D-L59b: "RESOLVED." | VERIFIED |
| Moodle slug | `osp-hardware-accessories` in YAML frontmatter spec | §3 D-Moodle: "`osp-hardware-accessories`". §4 Authoring Conventions: "YAML `topic` slug: `osp-hardware-accessories`". §6 Author split: "YAML `topic` slug: `osp-hardware-accessories`". §7 Office Context table: "Moodle topic slug: `osp-hardware-accessories`". | VERIFIED |

**7/7 pre-resolved decisions verified as applied in the brief.**

---

## §5 Cross-Topic Numerical References Verification

**L5.1 loading district from T4 L4.2b:**
- T4 L4.2b (§1): "Primary district = Light (RESOLVED — §3 #2): Macon, GA inland — NESC C2-2023 Rules 250–252, Figure 250-1 designates Light loading."
- T5 L5.2b uses "Macon GA (NESC Light district)" as the sag-tension worked example input.
- VERIFIED — district is consistent (Light) and L5.2b correctly uses it as a given input, not re-derived.

**L5.8 NEMA 250 ↔ IEC 60529 mapping from T4 L4.12:**
- T4 L4.12 (§1): "NEMA 250 ↔ IEC 60529 mapping (NEMA 3R ≠ IP68)" and "Drag-drop (IP rating to environment) + flashcards + quiz."
- T5 L5.8: "Cross-reference T4 L4.12 as authoritative NEMA 250 ↔ IEC 60529 mapping table — do NOT re-derive or reproduce the table." Operational values NEMA 1 (IP10) / 3R (IP14) / 4 (IP65) / 4X (IP66) listed.
- VERIFIED — T5 L5.8 correctly defers to T4 L4.12 as authoritative and does not re-derive.
- **One note:** T5 lists IP14 for NEMA 3R; T4 L4.12's worked example shows "NEMA 3R + IP54" as a scenario element. The IP14 vs. IP54 distinction is not directly contradictory (they measure different things — 3R is roughly IP14 for ingress, but the worked example in T4 concerns a closure datasheet showing IP54). Not a conflict; authoring note: ensure L5.8 explains what "IP14" means for NEMA 3R specifically.

**L5.6 burial depth / pull-box sizing from T3 L3.5:**
- T5 L5.6 scope: "NEC Ch. 9 pull-box sizing: cross-reference T3 L3.5 — do NOT re-derive the 8× / 6× formulas."
- T4 L4.3 (for cross-check): "TIA-758-C §6.3 as stricter controlling requirement; HDD/direct-bury/conduit cover-depth matrix. Code structure only — defer depth derivation to T3 L3.5 cross-ref."
- VERIFIED — T5 L5.6 correctly defers the 8×/6× pull-box math to T3 L3.5, consistent with T4's treatment.

---

## §6 Negative Findings — Confirmed Clean

The following were checked and confirmed free of errors:

1. **Quiz count arithmetic (26 = 2 × 13):** Verified per-lesson Q count in §2 table — every lesson carries exactly 2 Qs; total is correct.
2. **Pass threshold rounding methodology:** Consistent with Topics 1–4. T4 used same rounding (22.4 → 23; 19/26 = 73.08% here, 23/32 = 71.875% in T4). Methodology is internally consistent across topics.
3. **7 CFR Part 1755 / PE-60 vs. RUS 1738 distinction:** Brief correctly explains why 1738 is wrong (Distance Learning/Telemedicine program vs. Telecom Program). Both L5.9 and L5.10 cite 7 CFR 1755 + PE-60.
4. **L5.2 split pattern matching T4:** T4 L4.2 was split into L4.2a + L4.2b. T5 L5.2 is split into L5.2a + L5.2b. Pattern is consistent.
5. **Moodle slug applied in 4 distinct locations** (§3 D-Moodle, §4, §6, §7): No discrepancy found.
6. **"Tier 22" prohibition:** The L5.6 scope, §2 citation distribution note, and §3 D-L56 all consistently prohibit "Tier 22" as a quiz [CORRECT] designation. Clean.
7. **T6 grounding deferrals:** L5.9 explicitly defers FDH housing grounding to T6 L6.7. L5.1 explicitly defers strand bonding/grounding to T6 L6.3. No T6-scope content leaked into T5.
8. **ASTM A475/A475M citation format (Decision D-C1):** Applied consistently in L5.2a, L5.2b scope descriptions and §2 citation distribution note.

---

## §7 FDH Port-Sizing Worked Example (L5.9) — Numerical Check

The brief specifies: "192 homes, 1:32 split, growth factor 1.20 → derive port count → select FDH tier."

Independent derivation:
- Homes: 192
- Split ratio 1:32 → each port serves 32 homes
- Raw ports needed: 192 ÷ 32 = **6 ports** (feeder / distribution ports)
- Growth factor: 6 × 1.20 = **7.2 → ceiling to 8** (next standard increment)

Note: The brief uses "port count" in context of a 288-port FDH with SC-APC cassette architecture. In the FTTH FDH context, the worked example scenario is likely calculating feeder or distribution ports per FDH (subscriber density → FDH size). The exact port-tier scenario result depends on what "port count increment" means for the office standard product family (16/32/48/64 cassette increments on a hardened FDH). With a 288-port placeholder, the scenario likely resolves to: 192 × 1.20 = 230.4 → ceiling to 288 ports (next standard count above 230.4 for a hardened FDH). Either interpretation produces a deterministic answer the author must derive. **The brief does not state the worked answer** — it correctly defers the answer derivation to authoring, which is appropriate since the FDH product family is PENDING-USER (D-E1). No false answer is embedded. Clean.

---

## §8 Intensity Count Discrepancy — Detail

**Brief §1 summary line:** "Intensity: 5 HIGH-INTENSITY (5.1, 5.2a, 5.2b, 5.6, 5.7, 5.9) / 8 STANDARD"

The parenthetical lists **6** lessons: 5.1, 5.2a, 5.2b, 5.6, 5.7, 5.9. But the summary says **5**. Since 13 − 6 = 7 STANDARD (not 8), both the HIGH count and the STANDARD count are wrong. The individual lesson intensity designations in the table are correct (all 6 listed lessons ARE marked HIGH-INTENSITY). The error is in the summary arithmetic only.

Correct summary: **6 HIGH-INTENSITY / 7 STANDARD = 13 total** ✓

---

## Net Verdict

**Two arithmetic errors found in §1 summary line:**

1. **CRITICAL — Duration total:** Brief states 345 min / 5.75 hrs. Independent sum of per-lesson durations = **305 min / 5.08 hrs**. Overstated by 40 minutes. Worker A3 correction required: update the summary line to "~305 min (~5.08 hrs)" or add 40 min of content across lessons (with rationale).

2. **MINOR — Intensity count text:** Brief says "5 HIGH-INTENSITY / 8 STANDARD" but the table shows 6 HIGH-INTENSITY and 7 STANDARD. Parenthetical already lists 6 lessons correctly; the leading numeral is wrong. Worker A3 correction: change "5 HIGH-INTENSITY" → "6 HIGH-INTENSITY" and "8 STANDARD" → "7 STANDARD".

All 7 pre-resolved decisions are correctly applied. Pass threshold math is correct. Cross-topic references are consistent.

**VERDICT: NEEDS-WORKER-A3-ON-DURATION-SUM AND INTENSITY-COUNT-TEXT.**

The substantive content, decisions, citations, cross-topic threading, and authoring conventions are authoring-ready. Only the §1 summary stats line requires correction.

=== T5 BRIEF REDTEAM A END ===
