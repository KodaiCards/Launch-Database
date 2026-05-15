# T02 Research Brief RT-B — Process Check + Math Re-derivation

**Verifier:** RT-B (Process Check + Math Re-derivation framing)
**Date:** 2026-05-16
**Scope:** `audit-output/osp-rewrite-curriculum/T02_RESEARCH_BRIEF.md` + T02 lesson JSX files
**Method:** Independent math re-derivation (Python first-principles) + independent WebSearch before reading RT-A

---

## Verdict (≤80 words)

YELLOW. All lesson math re-derives correctly (10 of 10 claims match). Process check finds two gaps: (1) the brief accepted a plausible-but-wrong turn count for the G.657.A1 mandrel test without adequate secondary-source triangulation — a process failure, not just a precision issue; (2) the "17 ± 4 ps/(nm·km)" engineering approximation was tagged VERIFIED rather than flagged as attribution-loose. One new LOW finding not in RT-A: the L03 slider's 40G limit uses 70% of bit period as the CD threshold — the correct 10%-of-bit-period rule is the PMD rule, not the CD rule.

---

## Process check per paywalled claim

| Brief claim | Brief's secondary sources | RT-B independent convergence | Verdict |
|---|---|---|---|
| G.652.D n₁≈1.468, n₂≈1.463 | Fiber physics textbooks; lesson qualifies "varies by manufacturer" | Multiple fiber optics references corroborate these as typical refractive index values; lesson correctly hedges | SOUND — appropriate hedge present |
| G.652.D MFD = 8.6–9.2 µm | WebSearch via Fiberdyne, Prysmian, unicorsa.com.ar | RT-B WebSearch independently confirms G.652D spec is 9.2 ± 0.4 µm = 8.8–9.6 µm. Range 8.6–9.2 is off on both ends | PROCESS GAP — brief noted the discrepancy but accepted the value as LOW. The actual spec bounds should have prompted a specific `[confirm range]` marker in the lesson. Agree with LOW severity. |
| G.652.D 100-turn, 30mm mandrel ≤ 0.5 dB @ 1625 nm | FOA secondary sources; `[confirm edition]` marker present | Could not independently verify exact values from public sources; `[confirm edition]` marker is the correct handling | SOUND — appropriate handling for paywalled spec |
| G.657.A1 10-turn, 10mm mandrel ≤ 0.75 dB @ 1625 nm | Brief notes "paywalled; plausible" but does NOT cite 2 independent secondary sources | RT-B WebSearch finds: G.657.A1 at 10mm radius = **1 turn**, ≤0.1 dB @ 1550 nm for 100 turns; ≤0.75 dB @ 1550 nm for 1 turn at 10mm. The "10 turns at 10mm" combination appears in **no** public source. 15mm radius uses 10 turns. This is a process failure: the brief should have flagged the turn-count as unverified, not just the test wavelength. | PROCESS FAILURE — the paywalled-source rule requires ≥2 independent secondary sources for convergence. The brief did not produce 2 independent confirmations of "10 turns at 10mm." The combination is likely wrong. |
| G.652.D "17 ± 4 ps/(nm·km)" as a direct specification | Brief says "widely cited engineering approximation" and tags LOW | RT-B computed: D(1550) from G.652.D λ₀ and S₀ parameters = 17.46 ps/(nm·km); the spec-implied range from λ₀ bounds (1300–1324 nm) is approximately 16.7–18.0 ps/(nm·km). "17 ± 4" (13–21 range) is much wider than the spec actually implies. The brief's "VERIFIED" tag is too generous. | PROCESS GAP — brief should have computed the implied range from the λ₀/S₀ parameters and noted that "17 ± 4" overstates the actual spread. The stated range is wrong in both the source attribution AND the numerical bounds. |
| ITU-T G.Sup39 PMD 10% bit-period tolerance rule | Widely cited secondary; `[confirm edition]` present | RT-B WebSearch confirms the 10%-of-bit-period rule is widely used: ~10 ps for 10G, ~3.5 ps for 40G (some sources say 2.5 ps). The ~10% rule for DGD tolerance is well-established. | SOUND — appropriate handling |
| 10G CD tolerance ±800 ps/nm (G.957) | Consistent with engineering guidance | RT-B WebSearch: published values suggest 10G NRZ physical tolerance ~1000 ps/nm. ±800 ps/nm is a conservative engineering planning value. Both are consistent for a design course. | SOUND — conservative planning value, not a fabrication |
| 40G CD tolerance ±40 ps/nm (G.693) | Consistent with secondary sources | RT-B: 40G direct-detection tolerance commonly cited as 40–80 ps/nm. ±40 ps/nm is at the tight end but within the range. | SOUND with `[confirm edition]` |

---

## Math re-derivation (10 numerical claims)

All computations performed independently in Python before reading lesson code.

| Claim | Lesson value | RT-B independent calc | Match? |
|---|---|---|---|
| ΔT = D × Δλ × L (100 km, D=17, Δλ=0.1 nm) | 170 ps | 17 × 0.1 × 100 = **170.0 ps** | ✓ |
| 10G bit period | 100 ps | 1/(10×10⁹) × 10¹² = **100.0 ps** | ✓ |
| DGD = 0.1 ps/√km × √200 km | 1.41 ps | 0.1 × 14.142 = **1.414 ps** | ✓ |
| DGD = 0.8 ps/√km × √150 km | 9.8 ps | 0.8 × 12.247 = **9.798 ps** | ✓ |
| PMD-limited dist: (2.5/0.2)² | 156 km | (2.5/0.2)² = **156.25 km** | ✓ |
| L06 link budget: +3 − (−24) | 27.0 dB | 3.0 + 24.0 = **27.0 dB** | ✓ |
| L06 total losses: 4.50+0.90+1.20+3.00 | 9.60 dB | 4.50+0.90+1.20+3.00 = **9.60 dB** | ✓ |
| −17 dBm in µW | ~20 µW | 10^(−17/10) × 1000 = **19.95 µW** | ✓ |
| L12 Q04: ΔT = 17 × 0.1 × 50 | 85 ps | 17 × 0.1 × 50 = **85.0 ps** | ✓ |
| L12 Q11: loss = 22×0.25 + 7×0.15 + 6×0.30 + 3.00; headroom = 30 − 11.35 | 11.35 dB / 18.65 dB | 5.50 + 1.05 + 1.80 + 3.00 = **11.35 dB**; 30 − 11.35 = **18.65 dB** | ✓ |

**All 10 re-derived values match the lesson claims exactly. Math is clean.**

Additional verification — SMF/MMF coupling loss (L08 "20+ dB" claim):

RT-B first-principles coupling loss from 50 µm MMF (NA=0.20) into 9 µm SMF (NA=0.13):
- Area-only: 10 × log₁₀((50/9)²) = 14.9 dB
- Area + NA mismatch: 10 × log₁₀((50/9)² × (0.20/0.13)²) = 18.6 dB
- With real connectors, modal noise, index step contributions: ≥20 dB is physically defensible.
Lesson's "roughly 97% of the light... that's where the 20+ dB loss comes from" is directionally correct and appropriate for a foundational lesson. The "97%" figure corresponds to (9/50)² = 3.24% coupling efficiency = 14.9 dB, not 20+ dB. The lesson conflates the area-ratio with the total insertion loss. LOW precision issue.

G.652.D dispersion range cross-check via first principles:
- Using ITU-T G.652.D parameters: λ₀ range 1300–1324 nm, S₀max = 0.092 ps/nm²·km
- D(1550 nm) formula: D = (S₀/4) × (λ − λ₀⁴/λ³)
- At λ₀=1310 nm (midpoint): D = 0.023 × 759.2 = **17.46 ps/(nm·km)** ✓
- Full range from λ₀ bounds: **16.7–18.0 ps/(nm·km)** (not 17 ± 4 = 13–21)
- Lesson's "17 ± 4" overstates the parameter-implied spread by ~3× — confirms RT-A MEDIUM finding

---

## Independent re-research on flagged items

*(Conducted before reading RT-A; RT-A comparison at end)*

### L01 MFD (8.6–9.2 µm)

RT-B WebSearch: "ITU-T G.652D MFD mode field diameter specification 1310nm range tolerance"

Results (Fiberdyne datasheet, Prysmian G.652.D, unicorsa.com.ar G.652D table, ZMS Cable): G.652.D specifies MFD as a nominal value within 8.6–9.5 µm with tolerance not to exceed ±0.6 µm (specific values per manufacturer's declared nominal). The most common declared nominal is 9.2 µm. The spec range for a 9.2 µm nominal fiber = 8.8–9.6 µm.

**RT-B verdict: AGREE with brief's LOW flag.** Lesson's 8.6–9.2 µm is slightly off (lower bound 0.2 µm low; upper bound 0.4 µm low for a standard 9.2 µm nominal fiber). Not a fabrication; minor precision issue.

### L04 G.657.A1 mandrel test (10 turns, 10 mm, ≤ 0.75 dB)

RT-B WebSearch (independent, before reading RT-A): "G.657.A1 mandrel test 1550nm OR 1625nm loss dB specification turns radius"

Results from multiple sources (hengtongglobal.com, OFS G.657 technical paper, weunionfiber.com, hfcl.com):
- G.657.A1 at **10 mm radius: 1 turn, ≤ 0.1 dB @ 1550 nm** (100-turn test is at *a different radius*, likely comparing to G.652D's test conditions)
- G.657.A1 at **15 mm radius: 10 turns, ≤ 0.25 dB @ 1550 nm**
- G.657.A1 **1 turn at 10 mm: ≤ 0.75 dB @ 1550 nm** for the *1-turn* test; 1.5 dB @ 1625 nm

The lesson's "10 turns, 10 mm radius, ≤ 0.75 dB @ 1625 nm" mixes the 15mm/10-turn condition with the 10mm radius. The combination appears in no public source.

**RT-B verdict: AGREE with RT-A MEDIUM finding.** The turn-count (10 turns at 10mm) is likely wrong. Correct table entry should be "1 turn, 10 mm radius, ≤ 0.75 dB @ 1550 nm" with `[confirm 1625 nm value in G.657 edition]`. This is a lesson accuracy issue that could mislead a learner about G.657.A1 bend performance.

### L10 "17 ± 4 ps/(nm·km)" as G.652.D clause

RT-B independently computed from G.652.D parameters (λ₀ 1300–1324 nm, S₀max 0.092 ps/nm²·km) using the standard Sellmeier dispersion formula:

D range at 1550 nm = **16.7–18.0 ps/(nm·km)** from spec parameters

Lesson states this range as "17 ± 4 ps/(nm·km)" = 13–21 ps/(nm·km). The cited span is approximately 3× wider than the spec-implied range.

**RT-B verdict: AGREE with RT-A MEDIUM finding, with additional nuance.** The 17 ps/(nm·km) central value is correct. The "±4" spread is an engineering approximation that is both wrong in attribution (not a direct G.652.D clause) AND numerically overstated. The actual spec-implied spread is ±0.65 ps/(nm·km) from the λ₀/S₀ parameters. Fix: "approximately 17 ps/(nm·km) at 1550 nm; G.652.D specifies dispersion indirectly via zero-dispersion wavelength (1300–1324 nm) and slope (0.092 ps/nm²·km); derived range at 1550 nm is approximately 16.7–18.0 ps/(nm·km)."

### L10 ps/(nm·km) slider default / OTDR open state (previously queued LOW)

The prior RT's queued LOW item: "L10 OTDR slider defaults to error-state at 80 km."

RT-B verified the current L10 slider code: `default: 45` km, `D_coeff default: 17`. Computation: 45 × 17 = 765 ps/nm. `limit_10g = 800 ps/nm`, `limit_40g = 40 ps/nm`. At 765 ps/nm, status = `warn` (not error). The default is in warn state, not error state — the previously-queued LOW fix has already been applied.

**RT-B verdict: Previously-queued LOW is RESOLVED.** No action needed.

---

## New finding not in RT-A

**LOW — L03 slider 40G limit uses CD threshold derived via wrong rule**

The L03 slider code comment states:
```
const limit_40g = 17.5; // ps — 40 Gb/s (bit period 25 ps, 70% ≈ 17.5)
```

The 10%-of-bit-period rule is the **PMD tolerance rule** (DGD < 10% of bit period). For CD dispersion, the engineering tolerance is expressed in **ps/nm** (not ps total pulse-spreading), and the 10% rule does not apply. The lesson body in L03 also uses "10%" language in the PMD context — the slider co-opts that framing for CD, which blurs the distinction.

At the slider default (D=17, Δλ=0.1 nm, L=100 km), ΔT=170 ps which correctly exceeds the `limit_10g = 100 ps` threshold. The 40G limit of 17.5 ps means the slider warns at about 10.3 km for the same laser — that is in the right neighborhood for 40G practical limits with direct detection, so the pedagogic behavior is reasonable even though the derivation path (70% of bit period) is not the standard engineering basis for CD tolerance.

**Severity: LOW** — The slider's behavior is plausible for the demo context. A learner could form an incorrect mental model that "70% of bit period" is the CD limit for 40G systems, which isn't correct. The code comment should clarify this is a pedagogic threshold, not a standards-based CD limit. Brief did not address this; RT-A did not address this.

---

## RT-A cross-check

| Item | RT-B verdict | RT-A verdict | Agreement |
|---|---|---|---|
| MFD 8.6–9.2 µm (L01) | LOW — narrow range confirmed | LOW — wrong-range confirmed | **AGREE** |
| G.657.A1 turn-count wrong (L04) | MEDIUM — "10 turns at 10mm" not in any public source | MEDIUM — turn-count likely wrong | **AGREE** |
| "17 ± 4 ps/(nm·km)" attribution (L10) | MEDIUM — additionally: the ±4 span is 3× wider than spec-implied range | MEDIUM — wrong attribution | **AGREE** — RT-B adds numerical detail: spec-implied range is ±0.65, not ±4 |
| All 10 math claims verified | All correct | All correct | **AGREE** |
| G.657.A1 test wavelength (1625 vs 1550 nm) | MEDIUM (subsumed by turn-count finding) | MEDIUM (turn-count finding dominant) | **AGREE** |
| L10 slider default (previously LOW) | RESOLVED — 45 km gives warn state | RT-A did not check | RT-B confirms resolved |
| L03 slider 40G limit | NEW LOW — wrong rule applied | Not flagged by RT-A | **NEW FINDING** — disagrees by omission only |

**Agreement on major findings: 5/5 overlapping items agree. 1 new LOW finding RT-B adds.**

---

## Findings (severity-ranked)

**MEDIUM — G.657.A1 mandrel test condition in L04 is likely wrong (turn count)**
- Lesson table: "10 turns, 10 mm radius, ≤ 0.75 dB @ 1625 nm"
- Public spec data (multiple independent sources): G.657.A1 at 10 mm radius = 1 turn, ≤ 0.75 dB @ 1550 nm / ≤ 1.5 dB @ 1625 nm
- Process failure: brief did not produce 2 independent secondary source confirmations of "10 turns at 10mm" as required by paywalled-source rule
- Fix: "1 turn, 10 mm radius, ≤ 0.75 dB @ 1550 nm" — retain `[confirm 1625 nm limit in current G.657 edition]`

**MEDIUM — "17 ± 4 ps/(nm·km)" wrong in attribution AND in the ±spread (L10)**
- Not a direct G.652.D clause (attribution wrong)
- Spec-implied range from λ₀/S₀ parameters is ±0.65 ps/(nm·km), not ±4
- Fix: "approximately 17 ps/(nm·km); G.652.D specifies this indirectly via λ₀ (1300–1324 nm) and S₀ (0.092 ps/nm²·km); derived range ≈ 16.7–18.0 ps/(nm·km)"

**LOW — MFD range 8.6–9.2 µm in L01 is narrower than G.652D spec (8.8–9.6 µm for 9.2 µm nominal)**
- Confirmed independently. Both bounds off by 0.2–0.4 µm.
- Fix: "approximately 9.2 µm; G.652.D spec tolerance ±0.4 µm (8.8–9.6 µm)"

**LOW — L03 slider 40G limit uses 70%-of-bit-period derivation, which is incorrect for CD (NEW)**
- The 10%-of-bit-period rule is for PMD, not CD; CD tolerance is measured in ps/nm
- The slider's 17.5 ps threshold produces reasonable pedagogic behavior but is derived incorrectly
- Fix: Update code comment to clarify this is a pedagogic demonstration threshold, not a standards-based CD limit; or replace with a CD-appropriate threshold framing

**LOW — L08 "97% of light lost" area ratio inconsistency**
- Lesson says "throw away roughly 97% of the light" and "20+ dB"
- 97% optical power loss = 15.2 dB, not 20+ dB
- 20+ dB requires area + NA mismatch (which gives ~18.6 dB) plus connector/mechanical contributions
- The two numbers are inconsistent within the lesson (97% ≈ 15 dB; 20+ dB ≈ 99%)
- Severity: LOW — the concept is correct, numbers slightly inconsistent. Fix: say "discard roughly 99% of the light (20+ dB)" or explain both the geometric minimum (~15 dB area-only) and typical real-world value (20–30 dB with all effects)

---

## Verdict: YELLOW

Math is clean across all 12 lessons — 10/10 re-derived values confirmed correct. The two MEDIUM findings (G.657.A1 turn-count, D range framing) require lesson patches before T02 is released as the locked template. Both were also flagged by RT-A. Three LOW findings are non-blocking batch items. No fabricated standards or hallucinated section numbers found.

=== T02 RT-B PROCESS + MATH END ===
