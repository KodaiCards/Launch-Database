# T02 Research Brief RT-A — Citation Verification

**Verifier:** RT-A (Citation Verification framing)
**Date:** 2026-05-16
**Scope:** All citations in `audit-output/osp-rewrite-curriculum/T02_RESEARCH_BRIEF.md` (committed at `4ac2508`)
**Method:** WebSearch re-verification + cross-check against actual T02 lesson JSX files

---

## Verdict (≤80 words)

YELLOW. The brief's citation backbone is solid — ITU-T G.652D attenuation/dispersion values, IEEE 802.3 MMF reach limits, GPON wavelengths, dB math, FOA planning values all independently re-confirmed. Three issues found: (1) MFD range in lesson is narrower than G.652D spec confirms (8.6–9.2 µm vs. actual 8.8–9.6 µm from 9.2 ± 0.4 µm spec — brief flagged this LOW, RT-A agrees); (2) G.657.A1 mandrel test in lesson specifies "10 turns @ 10 mm" but independent search shows G.657.A1 standard uses **1 turn @ 10 mm** (not 10 turns); (3) The "17 ± 4 ps/(nm·km)" framing in L10 is confirmed as an engineering approximation, not a direct G.652D clause — brief flagged this, RT-A upgrades to MEDIUM.

---

## Citation re-verification (table)

| Brief claim | Cited source | Section | RT-A status | Notes |
|---|---|---|---|---|
| SMF core ~9 µm diameter | ITU-T G.652D §5 | Core 8–10 µm range | VERIFIED | Lesson says "about 9 µm / nominal 9 µm" — accurate |
| Cladding 125 µm all standard fibers | ITU-T G.652D nominal cladding | 125 µm | VERIFIED | Multiple datasheets confirm |
| 50 µm or 62.5 µm MMF core | TIA-492AAAC; TIA-568.3 | OM3 / OM1-OM2 specs | VERIFIED | Industry-standard values |
| n₁ ≈ 1.468, n₂ ≈ 1.463, Δn ≈ 0.003–0.005 | ITU-T G.652D (paywalled) | Mfr-specific | VERIFIED (secondary) | Lesson correctly qualifies "typical values varies by manufacturer" |
| sin(θ_c) = n₂/n₁ ≈ 0.9966, θ_c ≈ 85° | Snell's Law derivation | Math | VERIFIED | arcsin(0.9966) = 85.3° — correct |
| NA ≈ 0.12–0.14 for G.652 SMF | FOA public reference | Standard SMF NA | VERIFIED | FOA.org confirms |
| NA ≈ 0.20 for 50 µm OM3/OM4/OM5 | TIA-492AAAC; IEEE 802.3 | Typical NA | VERIFIED | |
| NA ≈ 0.275 for 62.5 µm OM1/OM2 | TIA-492AAAA; FOA | Typical NA | VERIFIED | |
| **MFD @ 1310 nm = 8.6–9.2 µm for G.652.D** | ITU-T G.652D | Spec table | **WRONG-RANGE** | WebSearch confirms G.652D spec is **9.2 ± 0.4 µm = range 8.8–9.6 µm** (Fiberdyne, Prysmian, unicorsa.com.ar G.652D table). Lesson range 8.6–9.2 µm is too narrow on the high end and too wide on the low end. Brief flagged LOW — RT-A agrees LOW. |
| Buffer coating 250 µm OD | IEC 60793-1 / Corning SMF-28 datasheet | 250 µm | VERIFIED | Corning datasheet confirms |
| 1310 nm: G.652.D max ≤ 0.40 dB/km | ITU-T G.652D Table 4 | Attenuation | VERIFIED | Multiple sources confirm |
| 1550 nm: G.652.D max ≤ 0.30 dB/km | ITU-T G.652D Table 4 | Attenuation | VERIFIED | |
| 1625 nm: G.652.D max ≤ 0.40 dB/km | ITU-T G.652D | Attenuation | VERIFIED | Multiple sources |
| Typical 1310 nm: 0.32–0.35 dB/km | Corning SMF-28 Ultra; Prysmian G.652.D | Typical attenuation | VERIFIED | |
| Typical 1550 nm: 0.18–0.22 dB/km | Corning SMF-28 Ultra; Prysmian; OFS | Typical attenuation | VERIFIED | |
| Rayleigh scattering ∝ 1/λ⁴ | FOA Reference Guide; Saleh & Teich | Physics | VERIFIED | Fundamental physics |
| OH⁻ water peak ~1383 nm | ITU-T G.652D (B vs D) | Water peak spec | VERIFIED | G.652D reduced water peak confirmed |
| Connector max 0.75 dB (TIA-568 legacy) | TIA-568.3-D | Legacy max | VERIFIED | Fluke Networks article confirms |
| Fusion splice planning value 0.15 dB; field target ≤ 0.05 dB | FOA Reference Guide | Planning/field values | VERIFIED | FOA.org Guidelines on Loss |
| Acceptance ≤ 0.10 dB bidirectional average | IEC 61280-4-2; FOA | Acceptance criteria | VERIFIED | |
| D ≈ 17 ps/(nm·km) @ 1550 nm for G.652 SMF | ITU-T G.652D; FOA | Dispersion coeff | VERIFIED | WebSearch confirms "typical chromatic dispersion at 1550 nm is 17 ps/nm·km" from multiple sources |
| Zero-dispersion wavelength 1300–1324 nm G.652.D | ITU-T G.652D Table 4 | λ₀ range | VERIFIED | unicorsa G.652D table confirms λ₀min=1300, λ₀max=1324 |
| ΔT = D × Δλ × L | Standard formula | Physics | VERIFIED | Fundamental |
| 100 km, D=17, Δλ=0.1 nm → ΔT = 170 ps | Math | Calculation | VERIFIED | 17 × 0.1 × 100 = 170 ps correct |
| 10 Gb/s bit period = 100 ps | Math | 1/(10 GHz) | VERIFIED | |
| PMD max 0.2 ps/√km for G.652.D | ITU-T G.652D | PMD coeff | VERIFIED | WebSearch confirms G.652D PMD max 0.2 ps/√km |
| G.652.D mandrel test: 100 turns, 30 mm radius, ≤ 0.5 dB @ 1625 nm | ITU-T G.652D (paywalled) | Mandrel test | VERIFIED (secondary) | FOA and lesson itself mark `[confirm edition]`; widely cited |
| **G.657.A1: 10 turns, 10 mm radius, ≤ 0.75 dB @ 1625 nm** | ITU-T G.657 (paywalled) | Mandrel test | **WRONG-CONDITION** | WebSearch: G.657.A1 at 10 mm radius standard condition is **1 turn** (not 10 turns) — 0.75 dB @ 1550 nm for 1 turn @ 10 mm. "10 turns" appears in 15 mm radius condition (0.25 dB @ 1550 nm / 1.0 dB @ 1625 nm). The lesson table shows "10 turns, 10 mm radius" which does not match public G.657.A1 specification data. Lesson has `[confirm edition]` marker but the turn-count is likely wrong, not just the wavelength. **MEDIUM finding.** |
| G.657.A2: 1 turn, 7.5 mm radius, ≤ 0.5 dB | ITU-T G.657 (paywalled) | Mandrel test | VERIFIED (secondary) | 7.5 mm radius for A2 confirmed by multiple sources |
| 20× OD dynamic, 10× OD static bend radius rules | FOA Reference Guide | Rules of thumb | VERIFIED | FOA standard guidance |
| G.657.A1 compatible with G.652.D for splicing | ITU-T G.657 | Backward compat | VERIFIED | Multiple sources confirm A1 backward-compatible |
| G.657.B2/B3 MFD mismatch issues | ITU-T G.657 | B class compat | VERIFIED | ycict.com, weunionfiber.com confirm |
| 3 dB = half power; 10 dB = one-tenth | Math | Logarithm | VERIFIED | 10^(-0.3)=0.501; 10^(-1.0)=0.1 |
| 0 dBm = 1 mW exactly | Definition | dBm scale | VERIFIED | |
| APC ≥ 60 dB ORL; UPC ≥ 50 dB ORL | TIA-568.3-D; WebSearch | ORL specs | VERIFIED | WebSearch confirms APC -60 dB, UPC -50 dB |
| GPON: upstream 1310 nm, downstream 1490 nm | ITU-T G.984 | GPON wavelengths | VERIFIED | WebSearch confirmed |
| O-band 1260–1360 nm; C-band 1530–1565 nm; L-band 1565–1625 nm | ITU-T band definitions | Band definitions | VERIFIED | Standard ITU-T band assignments |
| CWDM: 18 channels, 20 nm spacing, 1270–1610 nm | ITU-T G.694.2 | CWDM channel plan | VERIFIED | Not on allowlist — brief correctly proposed adding G.694.2 |
| DWDM: 0.8 nm (100 GHz), 0.4 nm (50 GHz), 80–96 channels C-band | ITU-T G.694.1 | DWDM grid | VERIFIED | Not on allowlist — brief correctly proposed adding G.694.1 |
| OM1: 62.5 µm, 200 MHz·km, max 33 m @ 10GbE | TIA-492AAAA; IEEE 802.3aq | OM1 specs | VERIFIED | Wikipedia multimode fiber confirms |
| OM2: 50 µm, 500 MHz·km, max 82 m @ 10GbE | TIA-492AAAB; IEEE 802.3aq | OM2 specs | VERIFIED | |
| OM3: 50 µm, EMB 2000 MHz·km, max 300 m @ 10GbE | TIA-492AAAC; IEEE 802.3aq | OM3 specs | VERIFIED | WebSearch confirms |
| OM4: 50 µm, 4700 MHz·km, max 400 m @ 10GbE | TIA-492AAAD; IEEE 802.3aq | OM4 specs | VERIFIED | |
| OM5: 28000 MHz·km @ 953 nm, max 400 m | TIA-492AAAE; Cisco | OM5 specs | VERIFIED | |
| PMD max 0.2 ps/√km G.652.D; DGD_rms = PMD × √L | ITU-T G.652D; FOA | PMD formula | VERIFIED | Math confirmed: 0.1 × √200 = 1.41 ps |
| 10G bit period 100 ps; 10% tolerance = 10 ps DGD limit | ITU-T G.Sup39 (paywalled) | PMD tolerance | VERIFIED (secondary) | 10% of bit period is widely cited rule of thumb |
| 40G bit period 25 ps; PMD limit 2.5 ps | Same source + math | Calculation | VERIFIED | Math: 1/(40G) × 10¹² = 25 ps; 10% = 2.5 ps |
| PMD-limited dist @ 0.2 ps/√km for 40G: ~156 km | Math | Derived | VERIFIED | (2.5/0.2)² = 156.25 km correct |
| Cut-back method: destructive, gold standard, lab only | IEC 60793-1-40 | Lab method | VERIFIED | |
| IEC 61280-4-2: field attenuation measurement SMF | IEC standard | Field measurement | VERIFIED (secondary) | Existence confirmed, paywalled |
| **"17 ± 4 ps/(nm·km)" as G.652.D clause** | G.652.D (paywalled) | CD at 1550 nm | **WRONG-ATTRIBUTION** | G.652.D specifies dispersion via λ₀ range + slope, NOT a direct D-at-1550 clause. "17 ± 4" is an engineering approximation of what those parameters imply. Lesson text says "Per ITU-T G.652.D, the dispersion coefficient at 1550 nm should be in the range 17 ± 4 ps/(nm·km)" — this attribution is imprecise. Brief flagged LOW; RT-A upgrades to MEDIUM because the lesson text states it as a direct G.652.D specification range, which it is not. |
| 10G NRZ CD tolerance ±800 ps/nm | ITU-T G.957 (paywalled) | CD tolerance | VERIFIED (secondary) | Lesson slider code comment + consistent with engineering guidance |
| 40G CD tolerance ±40 ps/nm | ITU-T G.693 (paywalled) | CD tolerance | VERIFIED (secondary) | Consistent with secondary sources |
| 70%+ fiber problems are contaminated connectors | FOA Reference Guide; Fluke Networks | Field practice | VERIFIED | FOA and Fluke articles confirm |
| IEC 61300-3-35 for end-face inspection | IEC standard (on allowlist) | End-face quality | VERIFIED | On allowlist; existence confirmed |
| Messenger wire creep → sag increase; check at NESC intervals | NESC C2-2023 §24; ANSI O5.1 | Sag/tension | VERIFIED | NESC on allowlist |
| ΔT = 17 × 0.1 × 50 = 85 ps (L12 Q04) | Math | Calculation | VERIFIED | 17 × 0.1 × 50 = 85 ps correct |
| Budget = +4 − (−26) = 30 dB (L12 Q10) | Math | Calculation | VERIFIED | 4 + 26 = 30 dB correct |
| Loss = 22×0.25 + 7×0.15 + 6×0.30 + 3.00 = 11.35 dB; headroom 18.65 dB (L12 Q11) | Math | Calculation | VERIFIED | All arithmetic independently checked correct |
| PMD_rms = 0.15 × √250 = 2.37 ps (L12 Q16) | Math | Calculation | VERIFIED | 0.15 × 15.811 = 2.371 ps correct |
| GPON downstream = 1490 nm (L12 Q13) | ITU-T G.984 | GPON | VERIFIED | |
| OM4 required for 350 m @ 10GbE (L12 Q15) | IEEE 802.3 | OM4 reach | VERIFIED | OM3=300m, OM4=400m confirmed |

---

## Independent re-research on flagged items

### L01 MFD spec: 8.6–9.2 µm

WebSearch query: "ITU-T G.652D MFD mode field diameter 1310nm specification range tolerance"

Results: Fiberdyne datasheet, Prysmian G.652.D datasheet, unicorsa.com.ar G.652D table all confirm **MFD at 1310 nm = 9.2 ± 0.4 µm**, giving a spec range of **8.8–9.6 µm**.

RT-A finding: **AGREE with brief's LOW flag.** The lesson's stated range of 8.6–9.2 µm is off on both ends — the actual spec lower bound is 8.8 µm (not 8.6) and the upper bound is 9.6 µm (not 9.2). This is a minor precision issue, not a fabrication. The lesson should state "approximately 9.2 µm; G.652.D spec tolerance is ±0.4 µm (8.8–9.6 µm)." Low severity — does not mislead a learner on the core concept.

Sources: [Fiberdyne G.652.D Specifications](https://www.fiberdyne.com/products/pdf/Fiberdyne-G.652.D-Single-mode-Fiber-Specifications.pdf), [unicorsa G.652D table](https://www.unicorsa.com.ar/archivos/datasheet/ITU-T-G652D.pdf), [Prysmian G.652.D datasheet](https://www.prysmian.com/sites/www.prysmian.com/files/media/products/Prysmian-Enhanced-Single-Mode-G-652-D-Datasheet.pdf)

---

### L04 G.657.A1 mandrel test condition: "10 turns, 10 mm radius, ≤ 0.75 dB @ 1625 nm"

WebSearch queries run on: G.657.A1 mandrel test, G.657 A1 "10 turns" specifications.

Results from multiple sources (hengtongglobal.com, ofs G.657 technical paper, hfcl.com macrobending article):
- G.657.A1 standard condition at **10 mm radius = 1 turn** with 0.75 dB limit at 1550 nm and 1.5 dB at 1625 nm.
- G.657.A1 at **15 mm radius = 10 turns** with 0.25 dB @ 1550 nm, 1.0 dB @ 1625 nm.

The lesson table (verified in L04 JSX file, lines 137–153) states: "G.657.A1 — 10 turns, 10 mm radius — ≤ 0.75 dB @ 1625 nm". This mixes the turn count from the 15 mm condition with the radius from the 10 mm condition. The `[confirm edition]` marker is present, but the combination as stated does not appear to match the actual G.657.A1 specification.

RT-A finding: **MEDIUM.** The brief correctly flagged this as a wavelength-ambiguity risk (1550 vs 1625 nm), but the bigger issue is the turn-count appears wrong. A learner reading the table would see "10 turns at 10 mm = G.657.A1 spec" — which overstates what that fiber can do at a tighter radius. Recommend: correct lesson table to "1 turn, 10 mm radius, ≤ 0.75 dB @ 1550 nm / ≤ 1.5 dB @ 1625 nm" with `[confirm edition]` retained.

Brief's flag severity: LOW (wavelength only). RT-A actual severity: **MEDIUM** (turn-count appears mismatched from spec).

Sources: [G.657.A1 Fiber Specs — hengtongglobal](https://www.hengtongglobal.com/info/g657a1-fiber-specs-bend-radius-selection-guide-103445378.html), [OFS G.657 Technical Paper](https://fiber-optic-catalog.ofsoptics.com/documents/pdf/5-Things-AW-FLEX-ITU-G.657.pdf), [HFCL Macrobending article](https://www.hfcl.com/blog/macrobending)

---

### L10 "17 ± 4 ps/(nm·km)" as a G.652.D specification range

WebSearch query: "ITU-T G.652D chromatic dispersion 1550nm specification 17 ps zero dispersion wavelength slope"

Results: Multiple sources confirm G.652D specifies dispersion via λ₀ range (1300–1324 nm) and slope S₀max (0.092 ps/nm²·km). The 17 ps/(nm·km) typical value at 1550 nm is derived from these parameters — **it is not a direct clause in G.652D specifying a D range at 1550 nm**.

Lesson text (L10 line ~151): "Per ITU-T G.652.D, the dispersion coefficient at 1550 nm should be in the range 17 ± 4 ps/(nm·km) for standard SMF." This presents an engineering approximation as if it were a direct G.652D specification.

RT-A finding: **MEDIUM** (upgrade from brief's LOW). The value 17 ps/(nm·km) is correct and well-established. But "17 ± 4" framed as a G.652.D clause could cause a learner to look for that clause in the actual standard and not find it, leading to confusion or incorrect citation on a real project. Fix: reframe as "typically approximately 17 ps/(nm·km) at 1550 nm for G.652.D fiber — the standard specifies this indirectly via the zero-dispersion wavelength range (1300–1324 nm) and slope parameters, not as a direct D value at 1550 nm."

Sources: [fiberoptics4sale.com ITU Standards](https://www.fiberoptics4sale.com/blogs/optical-fibers-and-cables/100267590-itu-standard-fiber-categories), [fs.com G.652 article](https://www.fs.com/blog/is-g652-single-mode-fiber-your-right-choice-1356.html)

---

## Process check

**Paywalled items:** The brief followed the paywalled-source protocol correctly. For ITU-T G.652D attenuation/PMD values, convergence was demonstrated across Prysmian, Corning, OFS, and FOA secondary sources. For G.657 mandrel test values, the brief flagged uncertainty and applied `[confirm edition]` markers — consistent with the protocol.

**Plausible-sounding-but-wrong section numbers:** No fabricated section numbers detected. The brief cited G.652D "Table 4" for attenuation values — this is consistent with the unicorsa.com.ar public G.652D table document structure.

**One gap in the paywalled protocol:** The G.657.A1 mandrel condition (10 turns @ 10 mm) was noted as paywalled but the concern raised was only about test wavelength (1550 vs 1625 nm). The turn-count discrepancy was not flagged. Given that public sources (manufacturer datasheets and technical papers) consistently show the 10 mm radius condition as 1 turn — not 10 turns — this should have been caught by the research brief.

---

## Findings (severity-ranked)

**MEDIUM — G.657.A1 mandrel test turn-count likely wrong (L04)**
- Brief claim: "10 turns, 10 mm radius, ≤ 0.75 dB @ 1625 nm"
- Public spec data: G.657.A1 at 10 mm radius = **1 turn** (not 10 turns); 0.75 dB limit @ 1550 nm (not 1625 nm)
- Impact: a learner sees an overstated performance claim and might misapply G.657.A1 in the field at 10 mm radius expecting ≤ 0.75 dB over 10 turns
- Fix: correct to "1 turn, 10 mm radius, ≤ 0.75 dB @ 1550 nm / ≤ 1.5 dB @ 1625 nm" — retain `[confirm edition]`

**MEDIUM — "17 ± 4 ps/(nm·km)" incorrectly attributed as a direct G.652.D clause (L10)**
- Brief claim: presented as "Per ITU-T G.652.D, the dispersion coefficient at 1550 nm should be in the range 17 ± 4 ps/(nm·km)"
- Reality: G.652.D specifies via λ₀ range + slope; 17 ps/(nm·km) is the correct typical derived value but "17 ± 4" is an engineering approximation, not a quoted standard range
- Brief flagged LOW; RT-A upgrades to MEDIUM because lesson text states it as a direct standard range
- Fix: reframe attribution as described above

**LOW — MFD range 8.6–9.2 µm in L01 is slightly narrow vs. actual G.652D spec (8.8–9.6 µm)**
- Same flag as brief; independently confirmed. Low pedagogic impact — doesn't mislead on the concept
- Fix: update to "approximately 9.2 µm; spec tolerance is ±0.4 µm (8.8–9.6 µm per G.652.D)"

---

## Verdict: YELLOW (brief accurate on ~55 of 58 citations; 2 MEDIUM findings require lesson patches before T02 can be declared template-complete)

The two MEDIUM findings (G.657.A1 turn-count, D-range attribution) require patches to the lesson JSX files before T02 is released as the locked template for OSP-RW.4 author waves. The LOW MFD finding is non-blocking but should be batched into the same fix wave. All paywalled claims are appropriately hedged. No fabricated section numbers or hallucinated standards detected.

=== T02 RT-A CITATION VERIFICATION END ===
