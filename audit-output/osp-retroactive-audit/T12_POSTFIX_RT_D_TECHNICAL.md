# T12 Post-Fix RT-δ — Technical / Math / Citation / Cascade Framing
**Wave:** T12 retroactive audit post-fix verification (pair-mate to RT-γ `64b5af1`)
**SHA verified:** `c0d6bd2`
**Framing:** Technical accuracy / numeric derivation / citation precision / cascade-defense
**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/T12_POSTFIX_RT_D_TECHNICAL.md` written.

---

## Scope

RT-γ covered Fix Wave A canonical items. This framing focuses on:
- Under-audited L05 (ghost reflections / source masking)
- Under-audited L08 (reading traces)
- Under-audited L09 (macrobend dual-wavelength)
- L10 math derivation independent re-check
- Cascade-pattern step-1 per §14e
- Novel technical findings RT-γ did not cover

---

## §14e Cascade-Pattern Step-1 — Registry Check

| Known pattern | T12 relevance | Status |
|---|---|---|
| P1 — §32.2210 mis-citation | None (no CFR Part 32 in T12) | N/A |
| P2 — H₂S IDLH cascade | None (no confined-space content in T12) | N/A |
| P3 — ANSI Z359 sub-number swap | None (no fall-arrest in T12) | N/A |
| P4 — Fabricated numeric (OM5 28000) | T12 numeric replacements (G.652.D atten, IEC 61300-3-35) both registry-fresh per RT-γ | CLEAN |
| P6 — OM1/OM2 Flashcard render missing | Not applicable to T12 | N/A |
| P7 — G.655/G.656 missing | T12 does not cover fiber types (T02 scope) | N/A |

No cascade-pattern regressions from Fix Wave A detected.

---

## G-1 (Carried from RT-γ): L10 EIOR Double-Declaration — CONFIRMED

`Verified by reading: L10-ior-distance-errors-and-cursor-pitfalls.jsx:25-35`

```
vocabulary_introduced: [
  'bulk IOR',
  'EIOR',           ← L10 claims to INTRODUCE this term
  ...
],
vocabulary_assumed: [
  { term: 'EIOR', source_lesson_id: 'T12.L03' },   ← also ASSUMES from L03
  ...
],
```

L03 introduces EIOR first (T12.L03 is a prerequisite to T12.L10 per `prerequisites: ['T12.L03', 'T12.L08']`). L10 substantially EXPANDS on EIOR (bulk IOR vs EIOR distinction, group index nuance) but the base term is already in scope from L03. Term cannot simultaneously be introduced and assumed. Fix: remove `'EIOR'` from `vocabulary_introduced` in L10. The lesson body introducing bulk IOR vs EIOR distinction is correct pedagogically — only the meta.vocabulary_introduced array needs the duplicate entry removed.

**Severity: LOW (schema mechanical fix)**

---

## NEW-1: L05 UPC Reflectance Range Misrepresents Clean-Connector Spec — MED

`Verified by reading: L05-ghost-reflections-coherence-and-masking.jsx:154, 267-268`

Prose (line 154): `"reflect only −60 to −65 dB, compared to −14 to −35 dB for UPC"`
Quiz Q3 option A (line 267): `"UPC (Ultra Physical Contact) — flat polish, −14 to −35 dB reflectance"`

**Issue:** −14 to −35 dB is not the spec range for a clean UPC connector. Industry-standard values:
- Clean UPC: −45 to −55 dB return loss (TIA-568.3-D / IEC 61755-3-31 SM grade, ≥50 dB typical)
- Air gap (Fresnel at glass-air interface): ≈ −14.5 dB — this is where −14 dB comes from
- Contaminated UPC: degrades to −30 to −14 dB range (which L05 prose correctly states at line 158-159: "A contaminated UPC connector can go from −30 dB to −14 dB")

The lesson correctly describes contaminated-UPC degradation range in the "Clean the offending connector" bullet (line 158-159). But line 154 and Quiz Q3 option A then present the same −14 to −35 dB range as if it's the general UPC specification, not the contaminated/degraded range.

**Why it matters for a field learner:** A technician reading this lesson may expect that any UPC connector on the launch port naturally reflects "−14 to −35 dB" and be confused when a clean UPC measures −50 dB. The -14 dB range is specifically the degraded / contaminated / dirty state — the precise condition causing source masking. Conflating dirty-UPC-range with UPC-spec misrepresents both.

**Fix shape:** Line 154 — change `"−14 to −35 dB for UPC"` to `"−35 to −50 dB for clean UPC (degrading to −14 dB when contaminated)"`. Quiz Q3 option A — change to reflect clean-UPC typical range, or add "contaminated/dirty" qualifier to the −14 to −35 dB description. The correct answer (c = APC) and its explanation remain valid.

**Severity: MED** — creates inaccurate spec expectations about clean UPC connectors; conflates degraded-state range with the connector type's specification.

---

## NEW-2: L09 L-Band Boundary Precision Error — LOW

`Verified by reading: L09-macrobend-detection-dual-wavelength.jsx:53, 168, 251`

Key_terms definition (line 53): `"Since 1625 nm is outside the primary DWDM C-band and L-band traffic windows"`
Prose (line 168): `"C-band (1530–1565 nm) and L-band (1565–1625 nm) DWDM windows"`
Quiz Q3 explanation (line 251): `"1625 nm is outside the C-band (1530–1565 nm) and L-band (1565–1625 nm) windows"`

**Issue:** Per ITU-T G.664 Table 1 and ITU-T G.697, the L-band is formally defined as 1565–1625 nm. The 1625 nm monitoring window (per IEC 62429 / ITU-T G.697) uses 1625 nm precisely because it sits at/above the upper boundary of the L-band, where DWDM channels are not deployed in practice — but saying 1625 nm is "outside the L-band" is technically inaccurate since 1625 nm IS the upper boundary of L-band per ITU-T definition.

**Correct framing:** "1625 nm sits at the upper edge of the L-band (1565–1625 nm) and is designated as the OSP monitoring/test window per IEC 62429 because practical DWDM channel deployments do not extend to 1625 nm, leaving it free for test injection." The core instructional point (1625 nm doesn't disrupt traffic) is correct; only the "outside L-band" claim is imprecise.

**Fix shape (key_terms + prose + quiz explanation):** Replace "outside the… L-band" with "at the upper boundary of the L-band (per IEC 62429 / ITU-T G.697 monitoring window designation), where DWDM channels are not deployed in practice" — or simplify to "designated as the OSP test window because practical DWDM channels stop well below 1625 nm."

**Severity: LOW** — the practical instructional point is correct; precision matters for learners preparing for BICSI OSP Designer exam where band-boundary questions can appear.

---

## NEW-3: L09 G.657 Key_Terms Flashcard Omits Short-Term Install Radius — LOW

`Verified by reading: L09-macrobend-detection-dual-wavelength.jsx:56-59, 152-153`

Key_terms / Flashcard definition for `G.657 macrobend-insensitive fiber`:
> "G.657.A1 minimum bend radius: 10 mm (1 cm). G.657.A2: 7.5 mm. G.657.B2: 7.5 mm. G.657.B3: 5 mm."

Table in lesson body (lines 152-153) correctly distinguishes:
- G.657.A1: 15 mm short-term / 10 mm long-term
- G.657.A2: 10 mm short-term / 7.5 mm long-term
- G.657.B3: 7.5 mm short-term / 5 mm long-term

The Flashcard only quotes long-term values with no qualifier. A learner reviewing the Flashcard without re-reading the table will not know that G.657.A1 requires **15 mm** during installation (only 10 mm for permanent installation). Over-tightening during pull = damage even on "bend-insensitive" fiber.

**Fix shape:** Add "long-term installed" qualifier to all values in the Flashcard definition and add the short-term installation values, e.g., "G.657.A1: 10 mm long-term (15 mm during installation)."

**Severity: LOW** — table in lesson body is correct; gap is only in the Flashcard definition.

---

## Math Derivation — Independent Re-Checks

### L10 WorkedExample: ΔD = (0.0005 / 1.4677) × 40,000 m
Independent derivation:
- ΔD = (0.0005 / 1.4677) × 40,000 = 0.0003406 × 40,000 = **13.63 m** ✓ (lesson says "13.6 m" — rounds correctly)

### L10 SanityCheck: 100 km same error
- ΔD = (0.0005 / 1.4677) × 100,000 = **34.07 m** ✓ (lesson says "34 m")

### L10 Quiz Q1: ΔN=0.0005, N_true=1.4675, D=25 km
- ΔD = (0.0005 / 1.4675) × 25,000 = 0.0003407 × 25,000 = **8.52 m** ✓ (answer c = "8.5 m")

### L09 WorkedExample: dual-wavelength differential
- Splice 1 differential: 0.09 − 0.08 = **0.01 dB** ✓ (lesson says "within measurement noise")
- Event 2 differential: 0.48 − 0.06 = **0.42 dB** ✓
- Event 2 ratio: 0.48 / 0.06 = **8×** ✓ (lesson says "8× more loss at 1550 nm vs 1310 nm")

All math verified independently — CLEAN.

---

## Macrobend Formula Consistency: L09 vs T02.L04

L09 Advanced (line 187): `"α_bend ≈ A × exp(−C × R)"`  
T02.L04 (confirmed post-Polish-G): `exp(−C × R)`

Forms are **consistent** ✓. Both use `exp(-C×R)` (loss decreases as R increases = physically correct). The Polish-G fix to T02.L04 (correcting the inverted `exp(-C/R)`) is not a regression in T12.

---

## Negative Findings (confirmed clean)

- **L05 ghost identification 3-test table:** distance rule, loss step, temperature sensitivity — all technically correct. The distinction between multiple-reflection ghosts and coherence peaks is pedagogically sound.
- **L05 APC reflectance −60 to −65 dB:** conservative/correct for field-grade APC. Clean APC typically achieves −60 dB or better per IEC 61300-3-6 Grade B.
- **L08 event table sample data:** cumulative loss values are plausible for a 12 km span (3.22 dB total from fiber atten ~0.20 dB/km × 12 km = 2.40 dB + 2 splices + 1 connector ≈ 3.2 dB). Consistent.
- **L08 fusion splice reflectance flag at −28 dB:** correct — this is a serious anomaly (Fresnel), not normal fusion. Answer (b) and explanation are accurate.
- **L08 LSA/ADZ cursor logic:** cursor-inside-ADZ producing incorrect loss reading is technically correct.
- **L09 MFD values:** 9.2 µm at 1310 nm, 10.5 µm at 1550 nm for G.652.D — consistent with ITU-T G.652.D (MFD 8.6–9.5 µm nominal at 1310 nm, 10.1–10.7 µm at 1550 nm). Values plausible.
- **L09 Q3 answer (b) = "outside C-band and L-band":** the CORRECT ANSWER selected in the quiz is technically what matters for the mark; the NEW-2 precision issue is in the explanation framing, not in which option is correct.
- **Vite build:** `✓ built in 7.26s` — zero errors.
- **Schema validator:** 15/15 PASS, 0 warnings.

---

## Findings Summary

| # | Severity | Lesson | Finding | New? |
|---|---|---|---|---|
| G-1 | LOW | L10 | EIOR double-declaration in vocabulary_introduced + vocabulary_assumed | Carried from RT-γ |
| NEW-1 | MED | L05 | UPC reflectance range (−14 to −35 dB) misrepresents clean-connector spec; conflates contaminated-UPC range with UPC specification in prose (line 154) and Quiz Q3 option A text | NEW |
| NEW-2 | LOW | L09 | L-band upper boundary: "1625 nm outside L-band" is technically inaccurate — 1625 nm is the upper boundary of L-band per ITU-T G.664; correct framing is "at upper edge / per IEC 62429 monitoring window" | NEW |
| NEW-3 | LOW | L09 | G.657 key_terms Flashcard omits short-term installation bend radii (only quotes long-term); table in lesson body is correct | NEW |

---

## Verdict: **YELLOW**

Fix Wave A items verified CLEAN (consistent with RT-γ GREEN on all 5 canonicals). Three new findings surface under technical framing that RT-γ's pedagogy lens did not catch:
- NEW-1 (MED): UPC spec misrepresentation in L05 — worth fixing before close
- NEW-2 (LOW): L-band boundary precision in L09
- NEW-3 (LOW): G.657 Flashcard missing install-phase radius

All math independently re-derived: CLEAN. Build: CLEAN. Schema: 15/15.

**Saturation verdict:** NEW-1 (MED) indicates saturation is NOT yet reached — a MED finding surfaced under the technical framing that RT-γ missed. One additional framing (field-practice / learner-reads-specs) could verify whether NEW-1 is the last MED or if additional spec-value issues exist in L05/L08/L11. If the next framing returns only LOWs, true saturation is near.

=== T12 POSTFIX RT-D TECHNICAL REPORT END ===
