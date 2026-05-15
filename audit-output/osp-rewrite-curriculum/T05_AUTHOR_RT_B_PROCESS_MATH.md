# T05 Research Brief RT-B — Process + Math Framing

**Date:** 2026-05-16
**Scope:** T05_RESEARCH_BRIEF.md — 15 lessons, Aerial OSP Design / NESC & Pole Loading
**Method:** Independent algebraic re-derivation of all formulas + worked examples; dimensional analysis; NESC value cross-check; allowlist compliance audit; internal consistency check across all lessons
**Role:** STRICT READ-ONLY. No code, lesson, or source files modified.
**Complements:** T05_RT_A_CITATIONS.md (citation framing). This report does NOT duplicate RT-A's citation verification work.

---

## Verdict (≤80 words)

**YELLOW.** 11 of 12 math claims independently re-derived and confirmed correct, all within rounding tolerance. One confirmed math error: the L12 "3-mile feeder extension" sanity check states margin "shrinks to about 4.5 dB" — RT-B derivation yields **6.62 dB** using the same parameters stated in the brief (2.12 dB discrepancy, no additional losses assumed). All formulas dimensionally correct. All NESC district values match locked T03 chain. Process protocol substantially compliant.

---

## Math Re-Derivation Table

All derivations performed independently using Python with 6-decimal precision. "Match" = within rounding artifact (≤ 0.003 ft / ≤ 0.005 dB).

| # | Claim | Lesson | Brief value | RT-B derivation | Match? |
|---|---|---|---|---|---|
| M1 | Ice formula coefficient (57π/144) | L06 | 1.244 (≈ 1.2435) | 1.2435 | YES — rounding correct |
| M2 | Ice load: ADSS 0.82 in OD, Heavy (t=0.50 in) | L06 | 0.821 lb/ft | 1.244 × 0.50 × 1.32 = 0.821 lb/ft | YES |
| M3 | Ice load: strand 0.5 in OD, Heavy (t=0.50 in) | L07 | 0.622 lb/ft | 1.244 × 0.50 × 1.00 = 0.622 lb/ft | YES |
| M4 | Sag: w=0.145, L=150, H=600 (no wind) | L02/L07 | 0.680 ft | 0.6797 ft | YES |
| M5 | Wind load: 9 psf, 0.5-in strand | L07 | 0.375 lb/ft | 9 × (0.5/12) = 0.3750 lb/ft | YES |
| M6 | Combined w: √(0.145² + 0.375²) | L07 | 0.402 lb/ft | 0.4021 lb/ft | YES |
| M7 | Wind-loaded sag: w_comb=0.402, L=150, H=600 | L07 | 1.885 ft | 1.8846 ft | YES |
| M8 | Heavy district sag: w_comb=0.836, L=150, H=600 | L07 | 3.922 ft | 3.920 ft | YES (0.002 ft delta) |
| M9 | Quiz Q1: w=0.200, L=120, H=700 | L07 | 0.514 ft | 2880/5600 = 0.5143 ft | YES |
| M10 | ADSS sag: w=0.260, L=200, H=560 (EDS=20%×2800) | L10 | 2.32 ft | 10400/4480 = 2.3214 ft | YES |
| M11 | ADSS wind-loaded: w_comb=0.668, L=200, H=560 | L10 | 5.96 ft | 5.9616 ft | YES; margin 0.54 ft ✓ |
| M12 | FTTH link budget base (1.5-mi feeder) | L12 | 20.41 dB / 7.59 dB margin | 20.409 dB / 7.591 dB | YES |
| **M13** | **3-mi feeder extension sanity check** | **L12** | **≈ 4.5 dB margin** | **6.62 dB margin** | **NO — see Finding #1** |
| M14 | L05 pole wind force: 0.375 lb/ft × 150 ft = 56 lb | L05 | 56 lb | 56.25 lb | YES (rounded down) |
| M15 | L05 pole vertical load: 0.145 × 150 = 21.75 lb | L05 | 21.75 lb | 21.75 lb | YES |

---

## NESC Values Table

| Rule | Brief value | RT-B independent verification | Match? |
|---|---|---|---|
| Rule 250 Heavy: radial ice | 0.50 in | 0.50 in (IAEI + ikeGPS + RUS 1724E-150; confirmed by T03 brief chain `148e1e7`) | YES |
| Rule 250 Heavy: wind pressure | 4 psf (≈ 40 mph) | 4 psf | YES |
| Rule 250 Heavy: temperature | 0°F | 0°F | YES |
| Rule 250 Medium: radial ice | 0.25 in | 0.25 in | YES |
| Rule 250 Medium: wind pressure | 4 psf | 4 psf | YES |
| Rule 250 Medium: temperature | 15°F | 15°F | YES |
| Rule 250 Light: radial ice | 0 in | 0 in | YES |
| Rule 250 Light: wind pressure | 9 psf (≈ 60 mph) | 9 psf | YES |
| Rule 250 Light: temperature | 30°F | 30°F | YES |
| Rule 250C Extreme Wind threshold | "structures taller than 60 ft" | "≥ 60 ft" (60 ft OR MORE) — RT-A Finding #1 already flagged | MINOR (RT-A flagged) |
| Ice formula coefficient | 1.244 | 57π/144 = 1.2435 → 1.244 | YES (rounding) |
| Ice density (NESC) | 57 lb/ft³ | 57 lb/ft³ (NESC/ASCE 7) | YES |

---

## Dimensional Analysis

All three core formulas confirmed dimensionally correct:

- **Sag:** s [ft] = w [lb/ft] × L² [ft²] / (8 × H [lb]) → [lb·ft / lb] = [ft] ✓
- **Wind load:** w_wind [lb/ft] = P [lb/ft²] × (D/12) [ft] → [lb/ft] ✓
- **Ice load:** w_ice [lb/ft] = ρ [lb/ft³] × π × t [in] × (D+t) [in] / 144 [in²/ft²] → [lb/ft³ × ft²] = [lb/ft] ✓

Parabolic approximation validity: max sag-to-span ratio in brief = 5.96/200 = 2.98% (ADSS wind-loaded). Well under 10% threshold for < 1% catenary error. ✓

EDS/RTS chain: EDS = 20% × RTS 2800 lb = 560 lb. Used correctly as stringing tension H in L10 sag formula. ✓

---

## Process Findings

### Allowlist Compliance

| Source type | Status |
|---|---|
| NESC C2-2023 (Rules 232/235/250/261/Section 26) | ✓ Allowlist primary |
| RUS Bulletin 1751F-630 | ✓ Allowlist primary anchor |
| 47 CFR Part 1.1401-1.1424 / FCC 18-111 | ✓ Allowlist primary |
| ITU-T G.984.x (GPON) | ✓ Allowlist primary |
| ANSI O5.1-2022 | ✓ Allowlist primary |
| FOA Reference Guide | ✓ Allowlist primary |
| RUS 1724E-150 (used as secondary for loading districts) | ⚠ NOT in allowlist — cited as secondary NESC verification source. Public USDA document. Factually correct usage; minor process gap. |
| ikeGPS, Hi-Line, IAEI, NAWPC, Incabamerica, O-Calc Pro, Focabex | ⚠ NOT individually listed in allowlist — used only as secondaries for paywalled NESC convergence. Brief recommends adding ikeGPS and Incabamerica. |

**Paywalled-source convergence protocol:** Correctly applied. All three high-risk NESC paywalled claims use ≥ 2 independent secondaries with hedge language: Rule 250 (3 sources), Rule 235 40-inch (2 sources), Rule 232 clearances (2 sources). ✓

**Section/clause citation depth:** Brief cites rule numbers (232, 235, 250, 261) and allowlist section numbers (Section 25, Section 24) correctly. Non-paywalled RUS bulletins (1751F-630, 1724E-150) cited at document level without section numbers — minor gap per directive #22, but RUS bulletin PDFs are public and the cited claims are broadly attributed. LOW severity.

---

## Findings List

| # | Severity | Category | Claim | Brief location | RT-B verification | Fix shape |
|---|---|---|---|---|---|---|
| 1 | **MED** | Math error / pedagogy | "If we extended the feeder to 3 miles, the margin would shrink to about 4.5 dB" | L12 worked example, final sanity-check paragraph | RT-B: same 0.40 dB/km, same connector/splitter/drop losses → margin = **6.62 dB**, not 4.5 dB. 2.12 dB discrepancy. No hidden losses stated. Learners who re-derive get 6.62 dB and lose trust in the lesson. | Fix: change "about 4.5 dB" to "about 6.6 dB" OR explicitly add "assuming 2–3 additional patch panels / splices for a 3-mile route" with the added losses itemized |
| 2 | LOW | Process — unlisted source | RUS 1724E-150 cited without being on the allowlist | L05, L06 citation tables | 1724E-150 is a legitimate public USDA document; its values corroborate the IAEI and ikeGPS convergence chain. Not a false claim, but the allowlist protocol (directive #22) requires sources to be on the list. | Add RUS 1724E-150 to allowlist as "RUS Bulletin 1724E-150 — Electric Power for Rural Utilities (pole loading design commentary)" OR replace with a listed source (RUS 1751F-630 §3 covers aerial pole loading). |
| 3 | LOW | Precision / pedagogy | GPON 1:32 splitter stated as 17.0 dB (single point) | L12 citation table + worked example | Real PLC splitters: 17–17.5 dB per independent datasheets (already flagged by RT-A Finding #2). Brief's 17.0 dB is at the optimistic end. Margin calculation is still conservative (7.59 dB vs design min 3 dB). | Author should use "17–17.5 dB" range in lesson prose; keep 17.0 dB for worked example with note. (Consistent with RT-A Finding #2 — do not double-fix.) |

---

## Negative Findings (Confirmed Clean)

The following were checked and confirmed clean — no errors found:

- **Ice load formula coefficient** (57π/144 = 1.2435 → 1.244): independently re-derived, correct ✓
- **All 5 sag worked examples** (L02, L07 no-wind, L07 wind-loaded, L07 Heavy district, L10 ADSS no-wind, L10 ADSS wind-loaded): all within rounding tolerance ✓
- **Quiz Q1** (w=0.200, L=120, H=700 → 0.514 ft): confirmed ✓
- **FTTH link budget base scenario** (20.41 dB total, 7.59 dB margin): exact match ✓
- **L05 pole loading illustrative example** (56 lb horizontal, 21.75 lb vertical): confirmed ✓
- **EDS/RTS chain** (20% × 2800 = 560 lb used as H in L10 sag): correct ✓
- **NESC loading district values** (Heavy/Medium/Light): all confirmed against 3-source chain, consistent with locked T03 brief `148e1e7` ✓
- **GPON specs** (G.984 downstream 2.488 Gbps / upstream 1.244 Gbps, Class B+ 28 dB): confirmed ✓
- **OTMR timelines** (10 BD completeness / 15 CD approval / 3 BD survey notice): brief correctly distinguishes all three clocks; confirmed from eCFR — no math in these values but sequence/unit logic is correct ✓
- **Parabolic approximation validity**: max s/L ratio in brief = 2.98% << 10% threshold ✓
- **Dimensional analysis** for all three core formulas: correct ✓
- **Internal consistency**: loading district values, cable parameters, clearance values, Macon=Light district, sag formula sign convention — all consistent across L02, L06, L07, L10, L12 ✓
- **No AI references** in any lesson prose reviewed ✓
- **No guesses presented as facts**: paywalled claims correctly hedged or verified via ≥ 2 secondaries ✓

---

## Coverage Gaps

1. **Section 26 load/strength factor matrix** — brief intentionally omits exact multipliers as paywalled. RT-B accepts this; did not attempt to verify specific factors from memory (would itself be a guess). The pedagogical framing ("Grade B has higher factors than Grade C; exact values from C2-2023") is correct.
2. **ANSI O5.1 species-specific fiber stress derivation path** (8000 psi × SF=4 = 2000 psi working stress) — referenced in the dispatching prompt but NOT stated in the brief. Brief correctly hedges to tip-load approximations. This path was not independently verified against O5.1-2022 (paywalled).
3. **3-mile feeder scenario: what losses produce 4.5 dB?** — RT-B traced this to approximately 2.8 additional connectors at 0.75 dB each (~2.1 dB unlisted), which is plausible for a 3-mile aerial route with intermediate splice points. However, since those losses are not stated in the brief, the sanity-check sentence cannot be reconciled without added assumptions. Flagged as Finding #1; the root cause (likely extra splices/connectors assumed) is not confirmed.
4. **ADSS manufacturer span ratings** (Corning, Focabex): cited as "catalog values varying by manufacturer." RT-B did not independently pull live datasheets to verify the 200-m span example is within a real manufacturer's catalog. The worked example uses physical inputs only (w, L, H) and does not assert a catalog-specific span rating.

---

## Summary

**Verdict: YELLOW**

- 14 of 15 math claims confirmed correct (all within rounding)
- 1 confirmed error: L12 3-mile feeder sanity check (4.5 dB claimed, 6.62 dB derived — MED severity, must fix before authoring)
- RT-A's two LOW findings (#1 Rule 250C "taller than" threshold, #2 splitter 17.0 vs 17–17.5 dB range) are not duplicated here — they stand as documented
- Process: allowlist protocol substantially compliant; two unlisted secondary sources (RUS 1724E-150, ikeGPS) should be added to allowlist for future research agents
- All three core formulas (sag, ice load, wind load) dimensionally correct
- Internal consistency: strong — same cable parameters, district values, and clearance standards used coherently across all 15 lesson briefs
- Authors can proceed after patching Finding #1 (L12 3-mile sanity check) and noting RT-A Findings #1 and #2 as authoring-time fixes

=== T05 AUTHOR RT-B PROCESS-MATH END ===
