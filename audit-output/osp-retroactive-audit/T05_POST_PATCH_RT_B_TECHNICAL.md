# T05 Post-Surgical-Patch RT-B — Technical Accuracy + Math Re-Derivation + Independent Gap Research
**Framing:** Technical accuracy / math re-derivation / cross-standard consistency / independent gap research
**Scope:** T05 L01–L15; cross-touched T07/T08 where math claims referenced
**Date:** 2026-05-16
**Model:** Sonnet (RT-B independent of RT-A until reconciliation section)

---

## 1. Math Re-Derivation Log

All numeric claims independently re-derived before reading RT-A report.

| # | Location | Lesson Claim | My Derivation | Verdict |
|---|----------|-------------|---------------|---------|
| M01 | L02 Step 1 | s = (0.145 × 150²)/(8 × 600) = 0.680 ft | (0.145 × 22,500)/4,800 = 3,262.5/4,800 = **0.6797 ft** | VERIFIED (rounds to 0.680) |
| M02 | L02 Step 2 | midspan = 22.0 − 0.680 = 21.32 ft | 22.0 − 0.6797 = **21.32 ft** | VERIFIED |
| M03 | L02 Step 3 | margin = 21.32 − 15.5 = +5.82 ft | **+5.82 ft** | VERIFIED |
| M04 | L02 Step 4 | w_wind = 9 × (0.5/12) = 0.375 lb/ft | 9 × 0.04167 = **0.375 lb/ft** | VERIFIED |
| M05 | L02 Step 4 | w_combined = √(0.145² + 0.375²) = 0.402 lb/ft | √(0.02102 + 0.14063) = √0.16165 = **0.4021** | VERIFIED |
| M06 | L02 Step 4 | s_wind = 1.885 ft, margin wind = +4.62 ft | s_wind = 9046.3/4800 = **1.8846**, margin = **+4.615** | VERIFIED |
| M07 | L06 ice coeff | 57×π/144 = 1.2435 ≈ 1.244 | 57 × 3.14159/144 = 179.071/144 = **1.2435** | VERIFIED |
| M08 | L06 heavy case | w_ice = 1.244×0.50×(0.82+0.50) = 0.821 lb/ft | 1.244 × 0.50 × 1.32 = **0.8211** | VERIFIED |
| M09 | L06 heavy case | w_wind_iced = 4×(1.82/12) = 0.606 lb/ft | 4 × 0.15167 = **0.6067** | VERIFIED |
| M10 | L06 heavy case | w_combined = 1.240 lb/ft | √(1.081² + 0.606²) = √(1.1686+0.3680) = √1.5367 = **1.2396** | VERIFIED (rounds to 1.240) |
| M11 | L07 heavy case | w_ice = 0.622 lb/ft (t=0.50, D=0.50) | 1.244×0.50×1.00 = **0.622** | VERIFIED |
| M12 | L07 heavy case | w_wind = 4×(1.50/12) = 0.500 lb/ft | **0.5000** | VERIFIED |
| M13 | L07 heavy case | w_combined = 0.916 lb/ft | √(0.767² + 0.500²) = √(0.5883+0.2500) = **0.9156** | VERIFIED (rounds to 0.916) |
| M14 | L07 heavy case | s_heavy = 4.294 ft, margin = +2.21 ft | s = 20,601/4,800 = **4.2918 ft**, margin = **+2.208** | VERIFIED |
| M15 | L15 sanityCheck | H=640 lb, s_nowind≈2.19, w_wind≈0.510, w_comb≈0.582, s_wind≈4.55, margin≈+3.95 | H=640, s_nowind=**2.188**, w_wind=**0.510**, w_comb=**0.5818**, s_wind=**4.545**, margin=**+3.955** | VERIFIED |
| M16 | L15 Q09 | s = (0.145×22,500)/4,800 = 0.680 ft | **0.680 ft** | VERIFIED |
| M17 | L15 Q12 | s = (0.200×120²)/(8×800) = 0.450 ft → margin = +5.05 ft; choice A labels "+4.57 ft" | s = 2880/6400 = **0.450 ft**, margin = **+5.05 ft** | DISCREPANCY — choice A label "+4.57 ft" vs actual +5.05 ft (exact math confirmed, 9.9% label error — RT-A flagged as Q12-LABEL, carried forward) |
| M18 | L15 Q13 | w_ice = 1.244×0.50×(0.82+0.50) = 0.821 lb/ft | **0.821 lb/ft** | VERIFIED |
| M19 | L15 Q15 | Corner 90°, T=500 lb → √2×500 = 707 lb | √2 × 500 = **707.1 lb** | VERIFIED |
| M20 | L15 Q18 | √((0.145+0.821)² + 0.607²) = √1.3016 = 1.141 | √(0.966²+0.607²) = √(0.9332+0.3684) = **1.1409** | VERIFIED (post-patch) |
| M21 | L12 link budget | Total loss = 20.41 dB, margin = 7.59 dB | 0.966+1.50+17.0+0.193+0.75 = **20.409 dB**, margin = **7.591 dB** | VERIFIED |
| M22 | L05 wind span | 200 ft + 100 ft run → wind span = 150 ft | (200/2)+(100/2) = **150 ft** | VERIFIED |
| M23 | L06 Q2 | w_ice = 1.244×0.50×(0.50+0.50) = 0.622 lb/ft | **0.622 lb/ft** | VERIFIED |
| M24 | L07 thermal | ΔL = 6.5×10⁻⁶ × 500 × 100 = 0.325 ft | **0.325 ft** | VERIFIED |
| M25 | L05 90° corner | √2 × 600 = 848.5 lb ≈ 849 lb | **848.5 lb** | VERIFIED |
| M26 | L12 splitter theory | 1:32 theoretical = 10×log₁₀(32) = 15.05 dB | **15.051 dB** | VERIFIED |
| M27 | L06 light case | w_wind = 9×(0.82/12) = 0.615, w_comb = 0.668 | w_wind = **0.615**, w_comb = **0.6677** | VERIFIED |

**Math re-derivation summary: 26 VERIFIED / 1 DISCREPANCY (Q12 label — pre-existing, not new)**

---

## 2. Cross-Standard Consistency Findings

| Check | NESC | TIA-758 | RUS 1751F-630 | Verdict |
|-------|------|---------|---------------|---------|
| Road clearance ~15.5 ft | Rule 232 (governing) | Defers to NESC | References NESC | CONSISTENT — no conflict |
| Comm-to-supply separation ~40 in | Rule 235C4/Table 235-5 | Requires NESC compliance | §7 requires NESC | CONSISTENT |
| GPON Class B+ 28 dB budget | N/A | N/A | N/A | VERIFIED vs ITU-T G.984.2 |
| OTMR simple vs complex make-ready | N/A | N/A | N/A | VERIFIED vs 47 CFR 1.1411 / FCC 18-111 |
| Ice density 57 lb/ft³ | NESC (correct) | N/A | N/A | ASCE 7-22 uses 56.2 lb/ft³ — NESC-specific value is correct for NESC calcs |

**No cross-standard conflicts found.**

---

## 3. Independent Gap Research — Items RT-A's Pedagogy Framing Would Not Surface

### GAP-1 (LOW): L02 FHWA 14 ft description is imprecise
**Location:** L02 "Book vs. Field — FHWA 14 ft vs NESC 15.5 ft" callout box.
**Claim:** "The FHWA standard truck clearance for overhead signs, bridges, and structures is typically 14 ft."
**Technical finding:** FHWA/AASHTO GDHS specifies **16 ft** for new construction on National Highway System routes (23 CFR 625.2). The 14 ft figure is the FHWA **minimum maintained clearance** for existing structures — applicable when reviewing permits over existing roadways. For OSP cable attachment over an existing road, the 14 ft figure is the operationally correct comparison point (permits over existing roads use the maintained threshold), but the lesson presents it as the universal "FHWA standard" without the new-construction/existing distinction.
**Practical impact:** The core lesson (NESC 15.5 ft > FHWA 14 ft maintained clearance → don't assume DOT permit = NESC compliance) is **correct and actionable**. The absence of the 16 ft new-construction figure won't cause a safety error. A student might, however, use 14 ft when citing FHWA specs in design documentation, which could be inaccurate in a new-construction context.
**Severity:** LOW — overstated framing in one sentence; core engineering lesson correct.

### GAP-2 (LOW): Combined-load sag methodology — conservative approximation not labeled as such
**Location:** L02 Step 4, L07 Step 4 (wind-loaded sag using w_combined in sag formula).
**Technical finding:** The lessons use w_combined = √(w² + w_wind²) as the input to s = wL²/(8H), yielding a "wind-loaded sag." This is a commonly-taught conservative approximation. The rigorous NESC methodology (per IEEE Std 524 / Alcoa conductors book / Southwire Engineering) is: wind load increases cable tension, tension changes H, which changes the sag. The actual vertical sag under a pure wind load (no ice) in the Light district is governed by w_bare (gravity only), while the lateral swing is governed by w_wind. The resultant "blow-out" sag is the vector of both, which is what the approximation computes. The lesson presents this as "sag" without stating it is the resultant (tilted) sag vector rather than purely vertical sag. The approximation errs conservative (overstates vertical sag slightly), which is safe.
**Practical impact:** For an OSP design course, the approximation is standard field practice and produces a conservative, safe result. It's how most sag-tension software also simplifies the wind case for display. This is acceptable at this training level.
**Severity:** LOW — standard simplified treatment; conservative and safe.

### GAP-3 (INFORMATIONAL): GPON 10 km physical differential claim in L12
**Location:** L12 GPON key_term definition — "Maximum reach per G.984: 20 km logical (10 km physical differential between closest and farthest ONT)."
**Technical finding:** ITU-T G.984.1 §8.2 specifies the maximum differential fiber distance between closest and farthest ONT as 20 km (same as the max reach). The "10 km physical differential" appears in some vendor documentation and field-practice guidelines as a practical deployment target, but the standard does not impose a 10 km differential limit. The T05_FIX_CANONICAL.md notes this was flagged R-2/R-3 as "suspicious-but-uncertain" and deferred. Confirmed: deferred status appropriate; it's a plausible field heuristic, not a standard error.
**Severity:** INFORMATIONAL only — already deferred in canonical; no action needed.

---

## 4. RT-A Bug Reconciliation

*(RT-A report read after independent audit completed.)*

| RT-A Bug | Severity | Claim | My Assessment | Verdict |
|----------|----------|-------|---------------|---------|
| BUG-A: T05.L05 `sag → T05.L02` wrong; should be `T01.L02` | MED | T05.L02 introduces `sag formula` not `sag`; T01.L02 introduces `sag` | Confirmed: L02 `vocabulary_introduced` has `sag formula` (line 32), not `sag`. T01.L02 introduces `sag`. The pointer is wrong. | **CONCUR** |
| BUG-B: T05.L07 `EDS → T03.L09` and `RTS → T03.L09` wrong; should be `T03.L04` | MED | T03.L09 doesn't introduce EDS/RTS; T03.L04 does | Confirmed: L07 lines ~48-49 point EDS/RTS to T03.L09. T03.L09 vocabulary_assumed shows these come from T03.L04. | **CONCUR** |
| BUG-C: T07.L01 `span`, `attachment point`, `clearance` → T05.L02 wrong; should be T01.L02 | MED | T05.L02 doesn't introduce these; T01.L02 does | RT-A's analysis of F7 in canonical confirms: F-RT-1 only fixed the `sag` pointer, leaving adjacent bad pointers. These three would all be introduced in T01.L02. | **CONCUR** |
| BUG-D: T05.L07 Flashcard covers 5 of 10 vocabulary_introduced terms | LOW | Missing: parabolic approximation, initial sag, creep, sag-to-span ratio, ruling span | Confirmed: L07 Flashcard deck has 5 cards (catenary, sag, H, final-sag, thermal). The 5 missing terms all have key_terms entries but no Flashcard component renders them. | **CONCUR** |
| Q12-LABEL: Choice A "+4.57 ft" vs exact answer +5.05 ft | LOW (prior RT) | Math: s=0.450 ft, margin=+5.05 ft; label says +4.57 | My M17 derivation confirms: margin = exactly +5.05 ft. Choice A labeled "+4.57 ft" is wrong by 10%. The explanation correctly says "Exact: 5.05 ft" but marks +4.57 as "Closest answer." | **CONCUR** — this is a new-bugs candidate, not just a label inconsistency. The correct answer is not among the choices. A student computing 5.05 ft correctly has no matching option. This is a MED finding, not LOW. |

---

## 5. New Findings Table

| # | Sev | Lesson:element | Claim | Verdict |
|---|-----|----------------|-------|---------|
| NB-1 | LOW | L02: FHWA 14 ft description | "FHWA standard truck clearance is typically 14 ft" — technically the maintained minimum; new construction standard is 16 ft. Core lesson correct but framing imprecise. | OVERSTATED (minor) |
| NB-2 | LOW | L02/L07: wind-loaded sag methodology | Using w_combined in sag formula gives conservative resultant sag, not purely vertical sag; not labeled as approximation | OVERSTATED (safe/conservative; standard simplified treatment) |
| Q12-UPGRADE | MED | L15 Q12 | Choice A labeled "+4.57 ft"; exact math = +5.05 ft; no answer choice matches the correct derivation. Student who computes correctly finds no matching option. RT-A classified LOW; upgrading to MED per technical framing (student penalized for correct answer). | NEW-BUG (severity upgrade from RT-A's LOW) |

**New bugs from RT-B framing not present in RT-A report:** 1 severity upgrade (Q12 LOW→MED) + 2 LOW overstated items (FHWA framing, combined-load labeling).

---

## 6. Final Verdict: YELLOW

**Math accuracy: STRONG.** 26 of 27 numeric claims independently re-derived and verified. The one discrepancy (Q12 label "+4.57 ft" vs correct +5.05 ft) is the dominant technical issue.

**Cross-standard consistency: CLEAN.** No conflicts between NESC, TIA-758, RUS 1751F-630, ITU-T G.984, or FCC OTMR rules.

**Surgical patches (F-RT-1/2/3):** All verified correct per independent math (M15, M20 derivations).

**Remaining issues preventing GREEN:**
1. **BUG-A/B/C (MED):** DAG pointer errors — RT-A findings CONCURRED (3 findings, 5 wrong pointers). Blocks prerequisite invariant integrity.
2. **BUG-D (LOW):** L07 Flashcard 5 of 10 terms rendered — RT-A finding CONCURRED. Directive 18z violation.
3. **Q12-LABEL (MED — upgraded from RT-A's LOW):** Correct math (5.05 ft) not present among answer choices; student cannot select the right answer. Requires a new choice or revised label.
4. **NB-1 (LOW):** FHWA 14 ft imprecision. Minor. Fix by adding "existing structure maintained clearance" qualifier.

**Content is factually sound, math is correct, citations are technically accurate, cross-standard consistency confirmed. Four issues remain, all fixable without content rewrite.**

=== T05 POST-PATCH RT B TECHNICAL END ===
