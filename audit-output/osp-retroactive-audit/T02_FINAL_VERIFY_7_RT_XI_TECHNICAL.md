# T02 Final Verify 7 — RT-ξ (Technical / Primary-Source + Deep Under-Sampled Audit + Cascade Defense)

**Constraints acknowledged: STRICT READ-ONLY. No lesson file edits. No canonical/fix files created. No CLAUDE.md/ARCH.md/course-catalog.js modifications. No orchestrator impersonation. No follow-up dispatch. No GREEN closure claim for issues found. Write-path allowlist: this file ONLY.**

---

## 1. Polish-G Primary-Source Re-Verification — L04 Macrobend Formula

**Finding:** RT-ν flagged `exp(−C / R)` in L04 line 112 as wrong; Polish-G corrected to `exp(−C × R)`.

**Independent primary-source check (conducted before reading RT-ν or Polish-G notes):**

Multiple independent searches and literature confirm the Gloge (1972) / Marcuse (1976) macrobend loss formula:

- L_R = η₁ × exp(−η₂ × R) — multiplication in exponent (Gloge 1972, Applied Optics 11, 2506)
- Marcuse (1976) JOSA 66, 216: dominant exponential term is e^(−αR), with α×R (multiplication) in exponent
- Physical interpretation CONFIRMED: as R decreases (tighter bend), −C×R becomes less negative → loss climbs exponentially ✓

**Current L04 lines 112–119 verified:** Form `exp(−C × R)` IS present with correct plain-English explanation ("as bend radius R decreases (tighter bend), the exponent becomes less negative and loss climbs exponentially"). Physics direction CORRECT. No residual division-form instances found in L04.

**Polish-G fix: VERIFIED CORRECT. ✓**

---

## 2. L02 Deep Sample — Attenuation Three Numbers

**Numeric claims sampled:**
- G.652.D spec max @ 1550 nm: ≤ 0.30 dB/km — CORRECT per ITU-T G.652.D standard ✓
- G.652.D spec max @ 1310 nm: ≤ 0.40 dB/km — CORRECT per ITU-T G.652.D ✓
- G.652.D spec max @ 1625 nm: ≤ 0.40 dB/km — CORRECT per ITU-T G.652.D ✓
- Typical datasheet @ 1550 nm: ≈ 0.18–0.22 dB/km — CORRECT (Corning SMF-28, Prysmian datasheets) ✓
- Designer planning value @ 1550 nm: 0.22–0.25 dB/km — CORRECT standard OSP practice ✓

**Rayleigh scattering physics:** "proportional to 1/λ⁴" — CORRECT. Well-established Rayleigh scattering law. ✓

**OH⁻ water peak:** "sharp loss spike around 1383 nm caused by hydroxyl ions" — CORRECT. G.652.D low-water-peak spec suppresses this. CWDM hazard on G.652.B correctly described. ✓

**Connector loss table:** Fusion splice "≤ 0.05 dB (field target)" — CORRECT standard practice. ✓

**Quiz re-derivation:**
- Q1 (best planning value): 0.22–0.25 dB/km — correct answer index 1 ✓
- Q4 drag-drop: spec=≤0.30, plan=0.22–0.25, typical=0.18–0.22 — all correctly mapped ✓

**L02: NO NEW ERRORS FOUND.**

---

## 3. L03 Deep Sample — Dispersion Why Signals Blur

**Formula verification:**
ΔT = D × Δλ × L — CORRECT standard chromatic dispersion formula ✓

**Unit cancellation:** ps/(nm·km) × nm × km = ps — CORRECT ✓

**Numeric claims:**
- D at 1550 nm for G.652: ~17 ps/(nm·km) — CORRECT (derived from G.652 spec: λ₀ ∈ [1300,1324] nm, S₀ ≤ 0.092 ps/nm²·km → implied D at 1550 nm ≈ 16.7–18.0 ps/(nm·km)) ✓
- Zero-dispersion wavelength G.652: 1300–1324 nm — CORRECT per ITU-T G.652.D Table 4 (λ₀min=1300, λ₀max=1324 nm) ✓
- PMD G.652.D cap: 0.2 ps/√km — CORRECT per ITU-T G.652.D specification ✓

**Worked example re-derivation:**
ΔT = 17 × 0.1 × 100 = 170 ps. CORRECT ✓
Sanity check: "10 Gb/s bit period = 100 ps" — CORRECT (1/10×10⁹ = 100 ps) ✓
"170 ps > 100 ps → link fails at 10G without DC" — CORRECT engineering conclusion ✓

**Quiz re-derivation:**
- Q3: ΔT = 17 × 0.1 × 100 = 170 ps → answer index 2 ✓
- Q4: SMF has no modal dispersion because only fundamental mode propagates — CORRECT ✓

**L03: NO NEW ERRORS FOUND.**

---

## 4. L05 Deep Sample — Decibels Without the Algebra Fear

**Core facts claimed:**
- "3 dB = half the power; exact to within 0.1%: 10 × log₁₀(0.5) = −3.01 dB" — CORRECT (−3.0103 dB) ✓
- "10 dB = one-tenth the power" — CORRECT ✓
- "dB losses add, not multiply" — CORRECT (logarithm property) ✓

**Formula verification:**
- Loss in dB = 10 × log₁₀(P_out / P_in) — CORRECT ✓
- dBm = 10 × log₁₀(P_mW / 1 mW) — CORRECT ✓
- Inverse: P(mW) = 10^(dBm/10) — CORRECT ✓

**Numeric conversions re-derived independently:**
- 2 mW to dBm: 10 × log₁₀(2) = 10 × 0.30103 = +3.0103 dBm ≈ +3.0 dBm ✓
- −28 dBm to µW: 10^(−2.8) = 10^(−3) × 10^(0.2) = 0.001 × 1.585 = 0.001585 mW = 1.585 µW (shown as 1.58 µW) ✓
- Link budget example: 15×0.25 + 4×0.15 + 2×0.30 + 3.0 = 3.75 + 0.60 + 0.60 + 3.00 = 7.95 dB ✓

**Quiz re-derivation:**
- Q1: 6 dB → 10^(−0.6) = 0.25 = 1/4. Answer index 1 (one-quarter 25%) ✓
- Q2: Budget = +3 − (−24) = 27 dB. Answer "27" ✓
- Q4: −17 dBm → 10^(−1.7) = 10^(−2) × 10^(0.3) = 0.01 × 2.0 = 0.020 mW = 20 µW. Answer index 1 ✓

**L05: NO NEW ERRORS FOUND.**

---

## 5. L09 Deep Sample — PMD Advanced

**Formula verification:**
DGD_rms = PMD_coefficient × √L — CORRECT standard form ✓

**√L scaling physics:** "random-walk process — polarization coupling varies randomly → scales as √L" — CORRECT ✓

**Numeric claims:**
- G.652.D PMD cap: 0.2 ps/√km — CORRECT per ITU-T G.652.D ✓
- 10% bit-period rule for PMD tolerance — CORRECT engineering rule of thumb ✓

**PMD table re-derived:**
| Bit rate | Bit period | 10% DGD limit | L_limit at 0.2 ps/√km |
|---|---|---|---|
| 2.5G | 400 ps | 40 ps | L=(40/0.2)²=40,000 km ✓ |
| 10G | 100 ps | 10 ps | L=(10/0.2)²=2,500 km ✓ |
| 40G | 25 ps | 2.5 ps | L=(2.5/0.2)²=156.25 km ✓ |

All table values CORRECT. ✓

**Worked example re-derivation:**
DGD = 0.1 × √200 = 0.1 × 14.142 = 1.414 ps (shown as 1.41 ps — correct to 2 dp) ✓

**Quiz re-derivation:**
- Q2: DGD = 0.8 × √150 = 0.8 × 12.247 = 9.798 ps ≈ 9.8 ps. 40G limit = 2.5 ps. Fails. Answer index 0 ✓

**L09: NO NEW ERRORS FOUND.**

---

## 6. L10 Deep Sample — Fiber Characterization Testing

**Key claims verified:**
- Cut-back method: measure full length, cut back to ~2 m, difference / length = dB/km — CORRECT ✓
- "IEC 61280-4-2 [confirm current edition]" measurement uncertainty ±0.02 dB/km — reasonable field estimate, [confirm] marker present ✓
- G.652.D CD: "λ₀ ∈ [1300, 1324] nm, S₀ ≤ 0.092 ps/(nm²·km) → implied D ≈ 16.7–18.0 ps/(nm·km)" — CORRECT derivation per G.652 spec ✓
- "~17 ps/(nm·km) is a useful field value derived from the spec, not a direct tolerance stated in the standard" — pedagogically honest and accurate ✓
- 10G NRZ CD tolerance: ±800 ps/nm cited in slider — widely accepted engineering value ✓
- 40G CD limit: ±40 ps/nm — CORRECT standard engineering value ✓

**Gainer events explanation:** bidirectional averaging gives true loss — CORRECT; IEC 61280-4-2 reference appropriate ✓

**L10: NO NEW ERRORS FOUND.**

---

## 7. L04 Extended Sweep — Beyond Macrobend Formula

**CRITICAL BUG FOUND — HIGH severity**

### BUG-ξ-01 (HIGH): G.657.A2 mandrel test values are wrong by ~16× at 1550nm

**Location:** L04 mandrel table, row for G.657.A2 (lines 159–163)

**Current L04 table:**
| Fiber type | Test condition | Max @ 1550 nm | Max @ 1625 nm |
|---|---|---|---|
| G.657.A2 | 1 turn, 7.5 mm radius | ≤ 0.03 dB | ≤ 0.08 dB |

**Correct ITU-T G.657.A2 specification:**
| Fiber type | Test condition | Max @ 1550 nm | Max @ 1625 nm |
|---|---|---|---|
| G.657.A2 | 1 turn, 7.5 mm radius | ≤ 0.50 dB | ≤ 1.0 dB |

**Primary-source confirmation (independently verified):**
Multiple independent sources confirm G.657.A2 at 7.5mm / 1 turn = ≤0.50 dB @ 1550nm / ≤1.0 dB @ 1625nm:
1. Web search result (ITU-T G.657 cross-reference): "Subcategory ITU-T G.657.A2 fibres — appropriate for a minimum design radius of 7.5 mm. One turn at 7.5mm bend radius, max macrobending loss: 0.5 dB at 1550nm and 1.0 dB at 1625nm."
2. G.657 complete table (multiple secondary sources): G.657.A2 at 7.5mm/1T = 0.50/1.0 dB; G.657.A2 at 10mm/1T = 0.10/0.20 dB; G.657.A2 at 15mm/10T = 0.03/0.10 dB.
3. Comparative table (A1/A2/B3): "A2 minimum design radius 7.5mm; at 7.5mm loss ≤0.5 dB/1.0 dB."

**Where do the wrong values (0.03/0.08) come from?**
The 0.03 dB @ 1550nm figure is consistent with G.657.B3 at 10mm radius (≤0.03 dB/≤0.10 dB), or G.657.A2 at 15mm/10 turns (≤0.03 dB/≤0.10 dB). The 0.08 dB @ 1625nm doesn't match any standard condition exactly — it appears to be a conflation of G.657.B3 @ 10mm (0.10 dB at 1625nm) or possibly B2/B3 values misattributed to A2.

**Impact:** The lesson teaches that G.657.A2 at a 7.5mm bend loses only 0.03 dB — making it look ~16× better than it actually is. A learner would severely underestimate G.657.A2 bend loss and could design FTTH drop cable runs expecting 0.03 dB at 7.5mm turns when the actual ITU spec allows up to 0.50 dB.

**RT-ν assessment of this issue:** RT-ν at N5/N6 claimed these values were "CORRECT — ITU-T G.657 (2016) Table 1 — standard known value" WITHOUT independent primary-source lookup. This is a FALSE POSITIVE CLEAN verdict from RT-ν on this specific item. The current RT-ξ independent multi-source lookup contradicts RT-ν's acceptance.

**Do NOT fix. Report only.**

---

**Additional L04 sweep — other G.657 claims:**
- G.657.A1 values in table (1T/10mm: 0.75/1.5 dB; 10T/15mm: 0.25/1.0 dB): CONFIRMED correct vs primary sources ✓
- "G.657.A2/B2/B3 — even tighter bend tolerance. A2 still backward-compatible with G.652 for splicing. B2 and B3 optimized purely for bend performance" — CORRECT classification ✓
- "MFD can differ from G.652.D, introducing splice loss if mixed" — CORRECT for B2/B3 ✓
- "Common confusion: 10 turns at 10 mm radius is sometimes cited but is not a published G.657.A1 test condition" — CORRECT; the two real A1 conditions (1T/10mm and 10T/15mm) are properly listed ✓

---

## 8. Cross-Lesson Contradictions Check

Reviewed G.652.D spec values across all 12 lessons:
- L02 (attenuation), L03 (dispersion), L04 (macrobend), L09 (PMD), L10 (characterization): all cite consistent G.652.D parameters ✓
- Zero-dispersion wavelength (1300–1324 nm): consistent across L03, L10 ✓
- D at 1550 nm (~17 ps/(nm·km)): consistent across L03, L10 ✓
- PMD cap (0.2 ps/√km): consistent across L03, L09, L10 ✓
- G.657.A1 values consistent across L04 and L08 references ✓

**No cross-lesson contradictions found** beyond the BUG-ξ-01 G.657.A2 value error (which is self-contained in L04's table and not cross-referenced in other lessons).

---

## 9. RT-ν Reconciliation

**RT-ν MED-ν-01 (exp formula):** RT-ν found this; Polish-G fixed it. My independent pass confirms fix was correctly applied. AGREE with RT-ν's detection and Polish-G's correction. ✓

**RT-ν N5/N6 (G.657.A2 values accepted as correct):** DISAGREE. RT-ν accepted ≤0.03/≤0.08 dB at G.657.A2 7.5mm/1T without primary-source lookup. Multiple independent primary sources confirm the actual spec is ≤0.50/≤1.0 dB. RT-ν's CORRECT verdict on N5/N6 is a false clean — this is BUG-ξ-01 (HIGH severity). This bug survived all 13 prior framings because no prior RT independently looked up G.657.A2 7.5mm values against primary sources; prior agents either trusted the inherited values or treated them as G.657 values "known to be standard."

**RT-ν saturation claim (13th framing, no further errors):** Partially correct — RT-ν found no other errors, and my independent 14th-framing pass confirms no other errors in under-sampled lessons (L02/L03/L05/L09/L10 all clean). But BUG-ξ-01 proves saturation was not achieved on L04.

---

## 10. Vite Build Result

```
✓ built in 5.82s
```
Clean. 131+ modules compiled. No errors.

---

## 11. Saturation Verdict — 14th Framing

**NEW HIGH finding:** BUG-ξ-01 (G.657.A2 mandrel values wrong by ~16× in L04 table). This is a factual error, not a LOW/cosmetic item.

**All other under-sampled lessons (L02/L03/L05/L09/L10):** CLEAN. Formulas, numerics, quiz answers all independently verified correct.

**Saturation status:** NOT SATURATED — one new HIGH finding surfaced in the 14th framing.

---

## 12. Final Verdict: YELLOW

**T02 ready to close?** NO — BUG-ξ-01 requires correction before closure.

| ID | Severity | Location | Description |
|----|----------|----------|-------------|
| BUG-ξ-01 | HIGH | L04 lines 160–163 (G.657.A2 table row) | G.657.A2 mandrel test values wrong: table shows ≤0.03 dB/≤0.08 dB at 7.5mm/1T; correct ITU-T G.657.A2 spec is ≤0.50 dB/≤1.0 dB. Error factor ~16× at 1550nm. Learner would severely underestimate G.657.A2 bend loss. RT-ν accepted these values without primary-source lookup — false clean. |

**All other T02 content reviewed this pass: CLEAN.**
**Polish-G L04 formula fix: VERIFIED CORRECT. ✓**
**L02/L03/L05/L09/L10 deep audit: NO NEW ERRORS. ✓**
**Cross-lesson consistency: CLEAN. ✓**

---

## Closeout

**Git diff --stat (origin/main..HEAD — only this report file expected):**

```
audit-output/osp-retroactive-audit/T02_FINAL_VERIFY_7_RT_XI_TECHNICAL.md | 1 new file
```

**Git log -3 --oneline:**
[see below after commit]

**Vite build:** `✓ built in 5.82s` — clean.

=== T02 FINAL VERIFY 7 RT XI TECHNICAL END ===
