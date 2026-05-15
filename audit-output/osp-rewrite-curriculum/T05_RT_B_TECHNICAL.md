# T05 Lessons RT-B — Technical Accuracy + Math + Citations
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

Two findings require correction. CRITICAL: L05 advanced section states "resultant = √2 × T" for a 90-degree corner, then computes 0.707 × 600 = 424 lb — this is wrong by a factor of 2 (correct: √2 × 600 = 849 lb). HIGH: L06 ice-load derivation creates a false algebraic equivalence between π×t×(D/2+t) and π×t×(D+t) in prose, though the final formula w_ice = 1.244×t×(D+t) is correct. All other formulas and quiz answers verified correct. All sag, wind, clearance, PON, and NESC citations check out.

---

## Numerical-claim table (every formula/computed value)

| # | Lesson | Claim (stated value) | Independent re-derivation | Verdict |
|---|---|---|---|---|
| N1 | L02 line ~282 | No-wind sag: s = (0.145×150²)/(8×600) = 0.680 ft | (0.145×22500)/4800 = 3262.5/4800 = 0.680 ft | VERIFIED |
| N2 | L02 line ~325 | w_wind = 9×(0.5/12) = 0.375 lb/ft | 9×0.04167 = 0.375 lb/ft | VERIFIED |
| N3 | L02 line ~328 | w_combined = √(0.145²+0.375²) = 0.402 lb/ft | √(0.02103+0.14063) = √0.16165 = 0.402 lb/ft | VERIFIED |
| N4 | L02 line ~329 | s_wind = 1.885 ft | (0.402×22500)/4800 = 9045/4800 = 1.884 ft | VERIFIED (rounding) |
| N5 | L02 line ~330 | Wind margin = +4.62 ft | 22.0−1.884−15.5 = 4.616 ft | VERIFIED |
| N6 | L02 quiz Q2 | s = (0.200×120²)/(8×700) = 0.514 ft | (0.200×14400)/5600 = 2880/5600 = 0.514 ft | VERIFIED |
| N7 | L05 line ~299 | w_wind = 9×(0.5/12) = 0.375 lb/ft; F_wind = 0.375×150 = 56.25 lb | 9×0.04167 = 0.375 lb/ft; 0.375×150 = 56.25 lb | VERIFIED |
| N8 | L05 line ~324 | F_grav = 0.145×150 = 21.75 lb | 0.145×150 = 21.75 lb | VERIFIED |
| N9 | **L05 advanced** | **"resultant = √2 × T; for T=600: 0.707 × 600 = 424 lb"** | **√2 × 600 = 848.5 lb. 0.707 = 1/√2, not √2. Error: 2× magnitude wrong** | **WRONG** |
| N10 | L05 quiz Q4 | Wind span = (200/2)+(100/2) = 150 ft | 100+50 = 150 ft | VERIFIED |
| N11 | L06 ice coeff | 57×π/144 = 1.2435 ≈ 1.244 | 57×3.14159/144 = 178.97/144 = 1.2435 | VERIFIED |
| N12 | L06 Case 2 | w_ice = 1.244×0.50×(0.82+0.50) = 0.821 lb/ft | 1.244×0.50×1.32 = 0.821 lb/ft | VERIFIED |
| N13 | L06 Case 2 | w_wind (iced) = 4×(1.82/12) = 0.606 lb/ft | 4×0.1517 = 0.607 lb/ft | VERIFIED (rounding) |
| N14 | L06 Case 2 | w_combined = √((0.260+0.821)²+0.606²) = 1.240 lb/ft | √(1.169+0.367) = √1.536 = 1.239 lb/ft | VERIFIED (rounding) |
| N15 | L06 quiz Q2 | w_ice = 1.244×0.50×(0.50+0.50) = 0.622 lb/ft | 1.244×0.50×1.00 = 0.622 lb/ft | VERIFIED |
| N16 | L07 Example 1 | No-wind sag = 0.680 ft, wind sag = 1.885 ft (same as L02) | Duplicate of N1/N4 — same inputs | VERIFIED |
| N17 | L07 Example 2 | w_ice = 1.244×0.50×(0.50+0.50) = 0.622 lb/ft | 0.622 lb/ft | VERIFIED |
| N17b | L07 Example 2 | w_wind (iced, OD=1.50 in) = 4×(1.50/12) = 0.500 lb/ft | 4×0.125 = 0.500 lb/ft | VERIFIED |
| N17c | L07 Example 2 | w_combined = √(0.767²+0.500²) = 0.916 lb/ft | √(0.5883+0.2500) = √0.8383 = 0.916 lb/ft | VERIFIED |
| N17d | L07 Example 2 | s_heavy = (0.916×22500)/4800 = 4.294 ft | (0.916×22500)/4800 = 20610/4800 = 4.294 ft | VERIFIED |
| N17e | L07 Example 2 | clearance margin = 22.0−4.294−15.5 = +2.21 ft | 22.0−4.294−15.5 = 2.206 ft | VERIFIED |
| N18 | L07 quiz Q1 | s = (0.200×120²)/(8×700) = 0.514 ft | Same as N6 | VERIFIED |
| N19 | L07 SliderExploration | H=200: sag=2.04 ft, margin=4.46 ft; H=1200: sag=0.34 ft, margin=6.16 ft | H=200: (0.145×22500)/1600=2.039 ft; margin=4.461 ft. H=1200: 0.340 ft; margin=6.160 ft | VERIFIED |
| N20 | L10 ADSS | H = 0.20×2800 = 560 lb; s = (0.260×200²)/(8×560) = 2.321 ft | 10400/4480 = 2.321 ft | VERIFIED |
| N21 | L10 ADSS | w_wind = 9×(0.82/12) = 0.615 lb/ft; w_combined = 0.668 lb/ft | 9×0.06833=0.615; √(0.0676+0.3782)=0.668 | VERIFIED |
| N22 | L10 ADSS | s_wind = (0.668×40000)/4480 = 5.964 ft | 26720/4480 = 5.964 ft | VERIFIED |
| N23 | L10 ADSS | wind-loaded clearance margin = +0.54 ft | 22.0−5.964−15.5 = 0.536 ft | VERIFIED |
| N24 | L12 PON | Feeder: 1.5mi×1.61=2.415 km×0.40=0.966 dB | 2.415×0.40=0.966 dB | VERIFIED |
| N25 | L12 PON | Drop: 0.3mi×1.61=0.483 km×0.40=0.193 dB | 0.483×0.40=0.193 dB | VERIFIED |
| N26 | L12 PON | Total loss = 20.41 dB; margin = 7.59 dB | 0.966+1.50+17.0+0.193+0.75=20.409; 28−20.409=7.591 dB | VERIFIED |
| N27 | L12 PON | 1:32 theoretical: 10×log₁₀(32)=15.05 dB | 10×log₁₀(32)=10×1.505=15.05 dB | VERIFIED |
| N28 | L12 PON | 3-mile feeder note: margin ≈ 6.63 dB | 4.83×0.40=1.932; 28−(1.932+1.50+17.0+0.193+0.75)=6.625 dB ≈ 6.63 | VERIFIED |

---

## Derivation-prose finding (HIGH severity)

| # | Lesson | Location | Issue | Verdict |
|---|---|---|---|---|
| D1 | **L06** | Lines ~281–294 (ice ring derivation) | **Derivation creates false equivalence**: The step correctly expands the annular area to π×t×(D/2+t). It then states this equals π×t×(D+t)/144 after dividing by 144 — but π×t×(D/2+t)/144 ≠ π×t×(D+t)/144. These differ by a factor of ~1.45. The correct derivation should use the difference-of-squares factoring: (D/2+t)²−(D/2)² = (D/2+t+D/2)×(t) = t×(D+t), giving A_ice = π×t×(D+t) directly in in². The final formula w_ice = 1.244×t×(D+t) is CORRECT; the prose path to get there is internally contradictory and will confuse a careful reader. | **HIGH — prose error in derivation, final formula correct** |

---

## Citation-claim table (every standards reference)

| # | Lesson | Citation | Topic claimed | Verdict |
|---|---|---|---|---|
| C1 | L01 | IEEE C2-2023 (NESC) | Current NESC edition; published by IEEE | VERIFIED — IEEE C2-2023 is the current NESC edition per public IEEE standards page |
| C2 | L01 | Rule 232 = vertical clearance | Clearance of conductors above ground/roads | VERIFIED — per allowlist: Section 23, Rule 232 |
| C3 | L01 | Rule 235 = comm-to-supply separation | Safety zone between comm and supply | VERIFIED — per allowlist: Rule 235 |
| C4 | L01 | Rule 250 = loading districts | Ice/wind/temp design loads by district | VERIFIED — per allowlist: Section 25 |
| C5 | L01 | Rule 261 = grades of construction | Grade B/C/N safety factor requirements | VERIFIED — Rule 261 in Section 26 area; consistent with secondary sources |
| C6 | L02 | "≈ 15.5 ft" road clearance from Hi-Line Application Guide + ikeGPS | NESC Table 232-1 traffic lane minimum | VERIFIED as appropriately hedged — both named sources are legitimate secondary sources; lesson correctly marks as "approximately" and instructs to confirm from paid NESC |
| C7 | L02 | "≈ 9.5 ft" pedestrian clearance | NESC Table 232-1 pedestrian-only areas | VERIFIED as appropriately hedged — consistent with secondary sources |
| C8 | L03 | "≈ 40 inches" at-pole, "≈ 30 inches" midspan (under 8.7 kV); ikeGPS + We-Energies citing Rule 235 Table 235-5 | NESC comm-to-supply separation | VERIFIED as appropriately hedged — named sources are legitimate; lesson correctly notes to confirm from paid NESC |
| C9 | L06 | NESC Light: 0 in ice, 9 psf wind, +30°F; Medium: 0.25 in, 4 psf, +15°F; Heavy: 0.50 in, 4 psf, 0°F | NESC Table 250-1 district values | VERIFIED — cross-confirmed against IAEI Magazine 2002, ikeGPS NESC loadings, and RUS 1724E-150; allowlist supports these sources |
| C10 | L06 | Rule 250C = Extreme Wind overlay, ≥60 ft above ground, coastal zones | NESC Rule 250C trigger condition | VERIFIED — consistent with multiple secondary sources; appropriately noted as "verify with current standard" |
| C11 | L06 | Ice density = 57 lb/ft³ per NESC/ASCE 7 | Design value for glazed ice | VERIFIED — 57 lb/ft³ (or 56 lb/ft³ in some sources) is the standard design value; range is 50–57 lb/ft³ depending on source; lesson choice of 57 is conservative and consistent with NESC practice |
| C12 | L09 | FCC 18-111 (August 2018); 47 CFR § 1.1411 | OTMR; timeline clocks; simple/complex make-ready | VERIFIED — FCC 18-111 is the Third Report and Order, August 2018; 47 CFR § 1.1411 is the codified rule; 10-day completeness, 15-day approval clocks correctly stated |
| C13 | L12 | ITU-T G.984 (GPON); 2.488 Gbps DS / 1.244 Gbps US; 20 km logical reach | GPON standard specs | VERIFIED — G.984 speeds and logical reach are correctly stated per ITU-T G.984 specifications |
| C14 | L12 | ITU-T G.9807.1 = XGS-PON; symmetric 10 Gbps | XGS-PON definition | VERIFIED — G.9807.1 is correct standard number for XGS-PON |
| C15 | L12 | IEEE 802.3ah = EPON; 1 Gbps symmetric | EPON standard | VERIFIED — 802.3ah is the correct EPON standard reference |
| C16 | L12 | G.652.D attenuation ≤ 0.40 dB/km at 1310 nm | ITU-T G.652.D spec | VERIFIED — ITU-T G.652.D specifies ≤ 0.40 dB/km maximum at 1310 nm; allowlist includes G.652D |
| C17 | L12 | GPON Class B+ budget = 28 dB | Power budget for GPON Class B+ | VERIFIED — 28 dB is the standard Class B+ budget per ITU-T G.984.2 |
| C18 | L05 | ANSI O5.1-2022 for pole fiber strength | Pole class rated strength | VERIFIED as hedged — appropriately cited "confirm from ANSI O5.1-2022" for the specific values, numbers given are approximate illustrative values |

---

## Quiz-answer re-derivation table

| # | Lesson | Quiz Q | Stated [CORRECT] | Independent answer | Verdict |
|---|---|---|---|---|---|
| Q1 | L02 Q2 | w=0.200, L=120, H=700 — sag? | 0.514 ft (6.2 in) | (0.200×14400)/5600 = 0.514 ft | VERIFIED |
| Q2 | L02 Q5 | Doubling span → sag grows × how much? | 4× (L² relationship) | (300/150)² = 4 | VERIFIED |
| Q3 | L05 Q1 | w=0.145, L=150, 9 psf wind — F_wind? | 56.25 lb | 9×(0.5/12)×150 = 56.25 lb | VERIFIED |
| Q4 | L05 Q4 | Wind span for 200 ft + 100 ft spans? | 150 ft | (200/2)+(100/2)=150 ft | VERIFIED |
| Q5 | L06 Q1 | Heavy district design loads? | 0.50 in ice, 4 psf, 0°F | Confirmed | VERIFIED |
| Q6 | L06 Q2 | w_ice for 0.50-in OD at Heavy (0.50 in ice)? | 0.622 lb/ft | 1.244×0.50×1.00=0.622 | VERIFIED |
| Q7 | L06 Q3 | Macon GA district? | Light | Confirmed from allowlist and CLAUDE.md | VERIFIED |
| Q8 | L06 Q5 | Ice formula coefficient from 57×?/144 | π (pi) | 57×π/144=1.2435 | VERIFIED |
| Q9 | L07 Q1 | s for w=0.200, L=120, H=700? | 0.514 ft | Same as Q1 | VERIFIED |
| Q10 | L07 Q2 | Doubling span → sag multiplier? | 4× | (L₂/L₁)²=(2)²=4 | VERIFIED |
| Q11 | L07 Q4 | Heavy district: what step MUST precede sag formula? | Calculate w_ice, w_wind, then w_combined | Correct procedural answer | VERIFIED |
| Q12 | L12 Q_check | 1:32 splitter theoretical loss? | 15.05 dB | 10×log₁₀(32)=15.05 dB | VERIFIED |

---

## Cross-lesson + cross-topic conflicts

**None found.** The following were checked and are consistent:

- L02 and L07 use identical sag formula examples (same inputs, same results) — consistent by design.
- L06 Case 2 (ADSS OD=0.82 in, Heavy district) and L07 Example 1 (lashed plant OD=0.50 in, Heavy district) use different cables — no conflict.
- L10 ADSS examples use same cable data (OD=0.82 in, w=0.260 lb/ft) as L06 Case 1 Light district — consistent.
- Macon GA = Light district stated consistently in L02, L05, L06, L07, L10 — no conflict.
- GPON Class B+ = 28 dB stated once in L12; no conflicting values elsewhere in T05.
- Rule 232 clearance ≈ 15.5 ft traffic lane used in L02, L07, L10 — consistent across all lessons.
- NESC Rule 235 at-pole ≈ 40 in, midspan ≈ 30 in stated in L03 — no restatement elsewhere.

---

## What I checked + confirmed clean

- All sag-tension intermediates within 0.5% rounding tolerance: **YES** (all verified to 3–4 decimal places above)
- All NESC rule numbers exist + cover claimed topic: **YES** (Rules 232, 235, 250, 261 all confirmed per allowlist and secondary sources)
- Macon GA = Light district referenced correctly: **YES** (confirmed consistently across L02, L05, L06, L07, L10)
- RUS 1738 NOT cited for telecom: **YES** (T05 does not reference RUS 1738 at all)
- L06 ice coefficient 1.244 = 57π/144: **YES** (independently verified to 1.2435)
- L09 OTMR timeline clocks: **YES** (10-day completeness, 15-day approval per 47 CFR § 1.1411)
- L12 GPON specs (G.984, 28 dB budget, 15.05 dB theoretical 1:32 loss): **YES** (all independently verified)
- Quiz [CORRECT] answers independently re-derived: **YES** (all 12 quiz answers verified above)
- No AI references in any of the 14 lessons: **YES** — none found
- No fabricated standards citations: **YES** — all citations hedged appropriately or verified

---

## Coverage gaps

- L04 (Grades of Construction), L08 (Joint Use), L13 (Make-Ready), L14 (QA Checklist): No explicit numerical formulas — reviewed for citation accuracy and internal consistency only; no math table entries needed. No citation issues found in these lessons.
- L11 (OPGW): Qualitative/conceptual lesson; no formulas. OPGW fault current handling is described qualitatively, not derived — no math verification needed.
- ANSI O5.1-2022 pole fiber strength values (mentioned in L05): Given as approximate illustrative values with explicit "confirm from ANSI O5.1-2022" instruction. Paywalled standard — cannot independently verify without purchase. Lesson appropriately flags this.
- NESC C2-2023 exact table values for Rules 232, 235, 250: Paywalled. Lesson correctly uses "approximately" hedging with named secondary sources for all values. This is the appropriate approach.

---

## Findings summary

| ID | Lesson | Severity | Description |
|---|---|---|---|
| F1 | L05 advanced | **CRITICAL** | Math error: "√2 × T" computed as 0.707×T = 424 lb. Correct: √2 × 600 = 849 lb. Factor-of-2 error in the stated resultant for a 90-degree corner pole. Fix: replace "0.707 × 600 = 424 lb" with "1.414 × 600 = 849 lb". |
| F2 | L06 derivation | **HIGH** | Prose derivation claims π×t×(D/2+t)/144 is equivalent to π×t×(D+t)/144. These are not equal (differ by ~1.45× for typical values). The final formula w_ice = 1.244×t×(D+t) is correct. Fix: revise derivation prose to use difference-of-squares step: (D/2+t)²−(D/2)² = (D+t)×t, giving A_ice = π×t×(D+t) directly. |

=== T05 RT-B REPORT END ===
