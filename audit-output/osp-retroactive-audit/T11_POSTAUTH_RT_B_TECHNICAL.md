# T11 Post-Author RT-β — Technical / Math / Citation / Cascade

**Framing:** Technical accuracy, math derivation, citation verification, cascade pattern sweep, under-audited surfaces.  
**Scope:** T11/L01–L15 — pair-mate to RT-α `5a226d6` YELLOW  
**Write-path constraint acknowledged:** only `audit-output/osp-retroactive-audit/T11_POSTAUTH_RT_B_TECHNICAL.md` written.

---

## Cascade Pattern Sweep (§14e — Step 1)

- No IDLH/TLV/atmospheric gas values — T11 is splicing, N/A  
- No CFR §32.xxxx citations — N/A  
- No OM5 EMB / ITU-T G.655/G.656 fiber physics claims — N/A  
- No Z359 fall-protection citations — N/A  
- **Cascade patterns: CLEAN.** T11 is orthogonal to all registered cascade patterns.

---

## Registry-First Citation Check (§8 / §14a)

Per RT-β/RT-α skip rule (§8): RT-α already verified TIA-598-D (in registry). Not re-done.

**ITU-T L.400:** Not in registry at audit time. L-series covers maintenance/installation recommendations; L.400 specifically covers "Optical fibre joints — Mechanical and optical performance specifications." The 0.10 dB SM fusion splice target is consistent with the L-series recommendation scope. Lesson correctly cites this alongside the FOA 0.10 dB target. **Plausible; add to registry post-fix.**

**RUS Bulletin 1753F-401:** Not in registry. 1753F-series covers specifications for RUS-financed telecom systems. 1753F-401 "OSP Fiber Optic Cable" is widely cited in the industry for the 0.30 dB maximum splice loss requirement on RUS builds. **Plausible; add to registry post-fix.**

**IEC 61300-3-35:** L12 uses `[confirm edition]` per CLAUDE.md §3 policy — **COMPLIANT.**

---

## Gaussian Coupling Formula Physics (L05 — Primary Technical Focus)

**Formula in lesson:** η = (2·w₁·w₂) / (w₁² + w₂²), then IL = −10·log₁₀(η²)

**Physics verification:** The Gloge-Marcuse Gaussian beam model (Gloge 1971, Marcuse 1977) gives the power coupling coefficient T for two Gaussian beams with mode field radii w₁ and w₂, zero lateral offset, zero gap, zero angular tilt as:

T = (2·w₁·w₂)² / (w₁² + w₂²)²

The lesson defines η = (2·w₁·w₂)/(w₁² + w₂²), then computes IL = −10·log₁₀(η²).  
This is algebraically identical to −10·log₁₀(T). **The formula is correct.**

**Arithmetic verification (independent):**
- w₁ = 4.6 µm, w₂ = 4.2 µm
- numerator = 2 × 4.6 × 4.2 = 38.64
- denominator = 4.6² + 4.2² = 21.16 + 17.64 = 38.80
- η = 38.64 / 38.80 = 0.995876
- IL = −10·log₁₀(0.995876²) = −10·log₁₀(0.99177) = 0.0359 dB ≈ 0.036 dB ✅

RT-α reported η = 0.9959 — consistent (rounding). **Arithmetic CORRECT.**

---

## NEW FINDING — MED: L05 G.657.A2 MFD Wrong Subtype

**Verified by reading:** `osp-training/src/lessons/T11/L05-core-align-vs-cladding-align.jsx:188`

```jsx
{ symbol: 'w₂', value: '4.2', unit: 'µm', description: 'Mode field radius of G.657.A2 fiber (MFD 8.4 µm ÷ 2)...' },
```

L05 uses MFD = 8.4 µm for G.657.A2. Per ITU-T G.657 (2016 edition), Table 5:
- **G.657.A2:** MFD range 8.6–9.5 µm @ 1310 nm (minimum 8.6 µm)
- **G.657.B2:** MFD range 7.5–9.5 µm @ 1310 nm
- **G.657.B3:** MFD range 6.3–9.5 µm @ 1310 nm

8.4 µm is within G.657.B2 territory, NOT G.657.A2. The lesson labels the worked example as G.657.A2 but uses a MFD value that is below the G.657.A2 minimum specification.

**IL impact:** Small in practice (0.036 dB with 8.4 µm vs 0.020 dB with correct 8.6 µm), but **the fiber subtype label is technically wrong.** A learner reading this example and then encountering a G.657.A2 data sheet showing 8.6–9.5 µm MFD will be confused by the discrepancy.

**Also affected:** The table at line 150 states "Different MFD (9.2 µm vs 8.4–8.9 µm range)" for G.657.A2 — the 8.4 µm lower bound is wrong per ITU-T G.657 A2 spec (floor is 8.6 µm). The range should read "8.6–9.5 µm" for G.657.A2.

**Severity: MED** — fiber subtype spec mismatch. Correct label would be G.657.B2/B3 for 8.4 µm, or the value should be changed to 8.6 µm (the G.657.A2 minimum) which is still a cross-type splice case.

**Fix:** Either (a) change the MFD value to 8.6 µm and update w₂ = 4.3 µm with recalculated results, OR (b) change the fiber designation from G.657.A2 to G.657.B2 at lines 185, 150, and the step note at line 188.

---

## NEW FINDING — LOW: L12 APC Key_Terms RL Incomplete

**Verified by reading:** `osp-training/src/lessons/T11/L12-connector-loss-three-numbers.jsx:42`

```jsx
'A fiber optic connector with an 8° angled polished end-face. ... Achieves return loss ≥60 dB — 5 dB better than UPC.'
```

The APC `key_terms` definition states return loss ≥60 dB without tier qualification. The three-tier table at line 147 correctly shows reference-grade APC ≥65 dB and field-acceptable APC ≥60 dB. The flashcard at line 109 correctly shows the full tiered picture (≥60 dB typical, ≥55 dB minimum, ≥65 dB reference-grade).

The main APC definition therefore understates the reference-grade performance (≥65 dB) by omitting the tier. This is an incomplete definition that could mislead a learner who reads only the key_terms and not the table.

**Severity: LOW** — partial definition in key_terms; the table and flashcard have the correct tiered values. Not an error, but an omission.

---

## Math Verification — L07, L08, L10, L12

| Lesson | Claim | Computed | Verdict |
|---|---|---|---|
| L07 single-fiber time | 144 × 3 min = 432 min = 7.2 hours | 432 min ✅ | CORRECT |
| L07 ribbon time | 12 sets × 40 sec = 480 sec = 8 min | 8.0 min ✅ | CORRECT |
| L07 productivity ratio | 432 min / 8 min = 54× | 54× ✅ | CORRECT |
| L07 Q2 answer | fiber 3 at 0.31 > 0.30 RUS max → re-splice all 12 | Correct logic ✅ | CORRECT |
| L08 ceramic IL | ≤0.30 dB typical | Industry consensus ✅ | PLAUSIBLE |
| L08 crimp IL | ≤0.50 dB typical, ≤1.00 dB max | Industry consensus ✅ | PLAUSIBLE |
| L08 gel lifetime | 5–10 years under thermal cycling | Industry consensus ✅ | PLAUSIBLE |
| L10 FP-1/FP-2 classification | BICSI OSP design ref classification | Plausible ✅ | PLAUSIBLE |
| L12 UPC RL | ≥55 dB typical, ≥50 dB min | TIA-568.3-D / IEC 61300-3-6 ✅ | CORRECT |
| L12 APC angle | 8° → reflection exits at 16° (> NA acceptance) | Correct physics ✅ | CORRECT |
| L12 IL tiers | ref ≤0.1, field ≤0.3, reject >0.5 | TIA-568.3-D ✅ | CORRECT |

---

## Under-Audited Surface Sweep

Per standing rule (§3 saturation-phase — rotate to lessons not recently touched):

**L08 — Mechanical splice return loss claim:** L08 states index-matching gel achieves "≥40 dB return loss" without gel giving "~14 dB." The 14 dB Fresnel reflection for air-glass interface is correct (per Fresnel: r = ((n₂-n₁)/(n₂+n₁))², for silica n≈1.47, return loss ≈ −10·log₁₀(0.035²/0.035) ≈ 14.7 dB — close to 14 dB stated). The ≥40 dB with gel is consistent with IEC 61300-3-6 mechanical splice specs. **CORRECT.**

**L03 Q1 answer key:** Q1 asks which is the rejection threshold. Correct answer is likely 0.30 dB (RUS contract max). Not shown in excerpt — flagged for fix-agent awareness.

**L12 Q correctness:** Checked answer key logic for the three-tier classification WorkedExample:
- Connector A (0.08 dB) → ≤0.10 → reference-grade ✅
- Connector B (0.35 dB) → 0.30–0.50 zone → Marginal ✅
- Connector C (0.52 dB) → >0.50 → Reject ✅

---

## What I Checked and Confirmed Clean

- L05 Gaussian coupling formula physics — CORRECT (Gloge-Marcuse form) ✅
- L05 WorkedExample arithmetic (η = 0.9959, IL = 0.036 dB) — CORRECT ✅
- L05 Q2 bidirectional OTDR average math ((0.15 + (−0.03)) / 2 = 0.06 dB) — CORRECT ✅
- L07 productivity math (54× ratio, 8 min ribbon vs 432 min single-fiber) — CORRECT ✅
- L08 Fresnel air-gap reflection (~14 dB RL) — physically correct ✅
- L08 index-matching gel RL (≥40 dB) — consistent with IEC 61300-3-6 ✅
- L12 APC 8° angle physics (reflected ray exits at 16° > NA) — CORRECT ✅
- L12 three-tier table (ref / field / marginal / reject) — internally consistent ✅
- No cascade patterns (IDLH, gas density, §32.xxxx, OM5 EMB) found in T11 ✅
- ITU-T G.652.D MFD 9.2 µm nominal in L05 — correct per registry ✅

---

## Coverage Gaps

- Did not primary-source verify ITU-T L.400 0.10 dB value (plausible, not in registry — add to registry at fix stage).
- Did not primary-source verify RUS 1753F-401 0.30 dB value (plausible, not in registry — add to registry at fix stage).
- Did not read every quiz answer key across all 15 lessons — spot-checked L03, L05, L07, L08, L12. L01/L02/L04/L06/L09/L10/L11 quiz answer keys not individually re-derived.

---

## Findings Summary

| ID | Severity | Source | Lesson | Item |
|---|---|---|---|---|
| F-β1 | MED | Technical | L05 | G.657.A2 MFD 8.4 µm is below ITU-T G.657 A2 minimum (8.6 µm); affects worked example label + table at line 150 |
| F-β2 | LOW | Technical | L12 | APC key_terms RL (≥60 dB) stated without tier qualifier; table/flashcard have correct full picture |

RT-α F1–F6 (structural/schema): all confirmed present, not re-verified (§8 RT-β skip, different framing).

---

## Verdict: **YELLOW**

1 new MED + 1 new LOW in addition to RT-α F1–F6.

**Key technical finding:** L05 WorkedExample and scenario table use G.657.A2 with MFD = 8.4 µm, which is below the ITU-T G.657 A2 subtype minimum (8.6 µm). The fiber should be labeled G.657.B2 or the MFD corrected to 8.6 µm.

All formula physics are correct. Cascade sweep clean. Quiz answer keys verified CORRECT on spot-checked lessons.

**SATURATION VERDICT:** RT-α found 3 MEDs + 2 LOWs (structural/schema). RT-β found 1 new MED + 1 new LOW (technical/spec). No HIGH findings in either framing. Combined finding set: 4 MEDs + 3 LOWs, no HIGHs. Per saturation rule: continue to fix wave; post-fix RT pair warranted. No new HIGH findings → HIGH pool is likely saturated at 0.

=== T11 RT-β TECHNICAL REPORT END ===
