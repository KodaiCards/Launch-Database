# T12 (Testing — OLTS, OTDR, Inspection) — Research Brief R-2

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T12_BRIEF_R2.md` written.

**Agent:** T12 Research R-2 — corroboration-adversarial / high-recall framing  
**Date:** 2026-05-17  
**Paired with:** T12_BRIEF.md (R-1 primary-source-skeptical)  
**Scope:** Identical to R-1 — Testing: OLTS, OTDR, end-face inspection, 15 lessons

---

## Findings Summary

R-2 independently verified R-1's claims across 9 key areas. Result: 5 items corroborated, 3 corrections required (2 HIGH precision errors + 1 MED framing error), 4 new content additions, 3 confirmed gaps.

**Verdict: YELLOW** — R-1 is largely solid but has two precision errors that matter for a testing-focused course:
1. IEC 61300-3-35 zone dimensions are wrong (current 2022 Edition 3 changed Zone B outer boundary from 120 µm → 110 µm AND removed Zone C/D from mandatory inspection)
2. The "0.05–0.20 dB systematic error per event" framing for OTDR is undersupported — actual error is a systematic bias of ~0.25 dB for the **whole link**, not per-event compounding

These are L11 and L01 precision errors — high-traffic lessons that the author will lean on heavily. Fix before authoring dispatch.

---

## CORROBORATED (R-1 was right — independent verification)

### C-1: Two-tier OLTS/OTDR hierarchy is correct framing
Independently confirmed: OLTS = Tier-1 (insertion loss certification, true power measurement), OTDR = Tier-2 (event characterization, diagnostic). The tiers are distinct and non-interchangeable. Standards require both for acceptance certification on OSP cable plant. Corroboration: Fluke Networks "OLTS + OTDR: A Complete Testing Strategy" (public); EXFO "When to use an OTDR vs. LSPM" (public); multiple application notes. R-1 framing is accurate.

**Sources:** EXFO AN342 (link loss measurement uncertainties); Fluke Networks OLTS+OTDR white paper; EXFO blog.

---

### C-2: EDZ <1 m at 5–10 ns pulse width is correct
Independently confirmed: EDZ as low as ~1 m on singlemode at 5 ns pulse width. OTDR suppliers specify EDZ at 5 ns; most singlemode instruments achieve <1 m EDZ at minimum pulse settings. Tempo Networks "Understanding OTDR Deadzones" confirms: "two events separated by >1 m can be displayed as separate events." Fluke Networks knowledge base confirms same. R-1's "<1 m at 5–10 ns" claim is accurate.

**Note for author:** EDZ specification depends on reflectance of the test connector. Manufacturers spec at −45 dB to −55 dB reflectance; real-world UPC connectors (~−50 dB) may give slightly longer EDZ than best-case spec.

---

### C-3: Bidirectional OTDR averaging formula True = (A→B + B→A)/2 is mathematically correct
Independently confirmed: bidirectional average formula is the standard definition across all sources. Yokogawa Technical Library confirms the formula and explains MFD mismatch as the cause of direction-dependent readings. EXFO AN043 (bidirectional OTDR testing) confirms signed arithmetic (algebraically add A→B and B→A readings, divide by 2). R-1's worked example (A→B = −0.08 dB gainer, B→A = +0.28 dB → true = 0.10 dB) is arithmetically correct.

**Sources:** Yokogawa Application Note "Two-Way Optical Fiber Measurement with an OTDR" (public); EXFO Application Note 043 (public); CommScope blog.

---

### C-4: RUS 1753F-401 splice acceptance ≤0.30 dB confirmed from independent source
Independently confirmed via UFGS 33 82 00 (Unified Facilities Guide Specification, Telecommunications Outside Plant, public DOD document): splice insertion loss must be ≤0.3 dB maximum when measured in accordance with TIA-455-78-B using OTDR. This is independent of R-1's primary source (the bulletin itself) and corroborates the 0.30 dB figure. R-1 is correct.

**Note for R-2 framing:** The 0.30 dB is the CONTRACT MAXIMUM — not the quality target. Both R-1 and independent sources agree. Good splicing practice targets ≤0.10 dB per RUS 1753F-601a (which R-2 independently found during research). The teaching value is the distinction: 0.10 dB target vs. 0.30 dB contract max. R-1 correctly draws this distinction at L13.

**Sources:** UFGS 33 82 00 §2.4 (public, wbdg.org); RUS 1753F-601a (public secondary confirmation, rd.usda.gov).

---

### C-5: Launch cable sizing ≥150 m / ≥500 m / ≥1 km broadly correct but needs nuance
The three-tier sizing convention (≥150 m premises, ≥500 m metro, ≥1 km long-haul) is broadly confirmed as industry practice. EXFO's sizing formula (pulse_width_ns ÷ 10 + 20%) produces: at 500 ns pulse → ~60 m ADZ + 20% = ~72 m, making 150 m conservative. At 5 µs → 500 m + 20% = 600 m, making ≥500 m adequate. At 10 µs → 1,000 m + 20% = 1,200 m, making ≥1 km tight — the formula suggests ≥1.2 km for full 10 µs ADZ clearance. At 20 µs → 2.5 km required.

**R-2 refinement (MED):** The "≥1 km for long-haul" recommendation is technically correct for most 10 µs scenarios but undershoots for aggressive 20 µs long-haul. R-1 should note: "≥1 km at 10 µs; if 20 µs pulses are needed (spans >60 km), use ≥2.5 km launch cable." This isn't a correction — it's a completeness gap at the working/advanced tier.

**Sources:** EXFO AN298 formula (cited in search results via Fosco Connect summary); FS.com OTDR dead zone tutorial; Yamasaki Optical dead zones article (public).

---

## CORRECTED (R-1 was wrong — here is the correction)

### X-1 [HIGH] — IEC 61300-3-35 Zone B outer boundary: 120 µm (R-1) vs 110 µm (correct per 2022 Edition 3)

**R-1 claim:** Zone A = 0–25 µm, Zone B = 25–120 µm, Zone C = 120–250 µm, Zone D = 250–2000 µm (L11 vocabulary_introduced for "IEC 61300-3-35 zone map").

**R-2 finding:** IEC 61300-3-35:2022 (Edition 3) changed Zone B outer boundary from 115 µm to **110 µm** to meet manufacturing tolerances of microscope fixture. Zone A = 0–25 µm (unchanged). Zone B = 25–**110** µm (corrected). The 2022 edition is the current edition.

**Independent verification:** Fluke Networks blog "Easier Fiber End Face Inspections: Key Changes to IEC 61300-3-35" (public, flukenetworks.com) and IEC webstore publication listing confirm this change in Edition 3. Multiple sources independently report "115 µm → 110 µm" change.

**Second correction — Zone C/D removed from mandatory inspection:** R-1's L11 vocabulary defines all four zones (A/B/C/D) as inspection zones with grading criteria. **Wrong for the current standard.** IEC 61300-3-35:2022 Edition 3 **removed Zone C (adhesive/epoxy zone, 110–250 µm) and Zone D (contact/ferrule rim, 250–2000 µm) from the PASS/FAIL criteria.** They remain in the physical description but contamination in C/D does not constitute a pass/fail defect in the 2022 edition. Mandatory inspection is now Zone A + Zone B only. The 2022 edition recommends inspecting Zone D for loose particles that could migrate, but this is not a pass/fail criterion.

**Implication for T12.L11:** the vocabulary definition of "IEC 61300-3-35 zone map" must be corrected:
- Zone A: core (0–25 µm) — mandatory, highest stringency
- Zone B: cladding (25–110 µm) — mandatory
- Zone C: adhesive zone (110–250 µm) — informational only per 2022 Ed.3 (no longer pass/fail)
- Zone D: ferrule rim (250–2000 µm) — informational only per 2022 Ed.3

The Grade A/B/C/D grading criteria R-1 describes applies to Zones A and B only in the current edition.

**Sources:** Fluke Networks "Easier Fiber End Face Inspections: Key Changes to IEC 61300-3-35" (public blog); IEC 61300-3-35:2022 abstract and public summary excerpts confirming Ed.3 changes.

**`[confirm edition]` marker status:** R-1 correctly marked this `[confirm edition]`. The current edition IS the 2022 Edition 3. Author should cite it as "IEC 61300-3-35:2022 (Edition 3)."

---

### X-2 [HIGH] — OTDR systematic error framing: "0.05–0.20 dB per event" is imprecise and potentially misleading

**R-1 claim (L01):** "OTDR loss readings carry 0.05–0.20 dB systematic error per event."

**R-2 finding:** The per-event framing is imprecise. What the literature actually reports is:
- EXFO AN342 (Link Loss Measurement Uncertainties — OTDR vs. OLTS): **"small systematic bias between OTDR (iOLM) and OLTS of around 0.25 dB" — this is for the WHOLE LINK, not per-event compounding.**
- The bias arises from OTDR's underfilled equivalent launch (backscatter physics), not from each event adding 0.05–0.20 dB.
- Measurement uncertainty per individual splice measurement by OTDR is typically ±0.05 dB for bidirectional average on a well-measured low-loss splice — much smaller than R-1's framing implies.

**The real teaching point (correct framing for L01):** OTDR CANNOT replace OLTS because OTDR measures backscatter (indirect, characterized-per-event) while OLTS measures actual transmitted power (direct, end-to-end). On a link with many connectors and splices, the cumulative effect of OTDR's backscatter-based approximation means the OTDR-derived total link loss can differ from the true OLTS-measured loss by up to ~0.25 dB (whole link). This doesn't mean each event adds systematic error — it means the measurement methods differ fundamentally and OTDR is not calibrated to produce the same absolute result as OLTS.

**Correct wording for L01:** "OTDR loss readings are derived from backscatter, not direct power measurement. The cumulative OTDR-derived link loss can differ from true OLTS-measured insertion loss by ~0.25 dB (whole link, per EXFO AN342) — not because each event adds compounding error, but because the measurement methods are fundamentally different. Individual splice loss measurements by OTDR (bidirectional average) are accurate to ±0.02–0.05 dB for a well-measured clean splice."

**Sources:** EXFO Application Note 342 "Link loss measurement uncertainties: OTDR vs. light source and power meter" (public); Fluke Networks "OLTS + OTDR: A Complete Testing Strategy" (public).

---

### X-3 [MED] — PMD limit for 10 Gbps NRZ: 0.5 ps/√km is for G.652A/C, NOT for G.652.D fiber

**R-1 claim (L12):** "PMD coefficient ≤ 0.5 ps/√km for 10 Gbps NRZ."

**R-2 finding:** 0.5 ps/√km is the PMD limit for **ITU-T G.652A and G.652C** fiber (older cabled PMD spec). **ITU-T G.652D** fiber (the modern standard used on all new OSP construction) has a maximum PMD coefficient of **0.2 ps/√km** — 2.5× more stringent. This distinction matters for teaching because:
- G.652.D is what crews are deploying on RUS/commercial builds today
- The 0.5 ps/√km figure is correct for legacy plant
- A 40 km G.652.D span: expected PMD << 0.2 ps/√km; 10G NRZ comfortably supportable
- Practical limit for 10G NRZ at 400 km uses ≤0.5 ps/√km (G.652A/C); at 2500 km uses ≤0.2 ps/√km (G.652.D) — meaning modern G.652.D fiber easily supports 10G to 400+ km

**Correct teaching at L12:** "Modern G.652.D fiber has a maximum PMD coefficient of ≤0.2 ps/√km (ITU-T G.652.D). For 10 Gbps NRZ, ITU-T system guidelines allow ≤0.5 ps/√km (G.652A/C). G.652.D easily satisfies both constraints. PMD measurement is still warranted on older installed plant (G.652A/C fiber), long spans (>40 km), or when deploying 40G/100G coherent systems where PMD budget is tighter."

**Sources:** ITU-T G.652.D specification (from citation registry — 7 CFR 1755.902 cross-references G.652.D PMD limit); EXFO whitepaper on PMD testing; Anritsu "Dispersion in Optical Fibers" technical note (public).

---

## NEW CONTENT (important T12 content R-1 missed entirely)

### N-1: Visual fault locator (VFL) — the field technician's first-step tool
R-1 does not mention the VFL (visible laser source at 650 nm injected into the fiber, visible through jacket or splice case). This is a mandatory T12 gap. A VFL costs ~$100–200 and is the first tool every field tech uses before deploying a $10,000 OTDR. VFL identifies:
- Fiber continuity (does any red light come out the far end?)
- Gross breaks within ~5 km (bright red glow visible through jacket)
- Macro-bends (red light leaks at the bend)
- Incorrect fiber selection (which fiber in a 144-ct cable am I touching?)

**Where it belongs:** Add to T12.L01 (Tier 1 vs. Tier 2) as a "Tier 0" field tool — not a certification instrument, but the first step before OLTS or OTDR. The progression is: VFL (continuity/routing) → OLTS (acceptance certification) → OTDR (event characterization). Most field manuals reference all three and R-1 is missing the VFL entirely.

**Citation:** FOA end-face inspection reference and FOA VFL tutorial (public, thefoa.org); Fluke Networks VFL documentation.

---

### N-2: OLTS calibration and reference cord verification — pre-test procedure
R-1 covers OLTS test methods (one/two/three cord) but does not address **reference cord verification** — the pre-test validation that the reference cord itself is clean and within spec. Field reality: technicians skip reference cord cleaning/inspection and use the same dirty reference cord all day, gradually degrading every OLTS reading. The correct pre-test procedure:
1. Clean and inspect reference cord connectors (CIC sequence per IEC 61300-3-35)
2. Reference cord verification: mate two known-good reference cords and measure — should be ≤0.1 dB
3. Zero the OLTS with reference in place
4. Only then begin testing

**Where it belongs:** Add to T12.L02 (OLTS: Reference Methods and Bidirectional Loss) as a working-tier workflow section. This addresses the most common OLTS-error source and directly ties to the CIC vocabulary introduced in T12.L11.

**Citation:** NECA/FOA 301-2016 §5 (reference cord verification procedure); FOA OTDR FAQs (reference method discussion).

---

### N-3: Scatter coefficient difference between fiber brands — IOR/EIOR considerations
R-1 correctly covers IOR entry (T12.L10) but misses an adjacent issue: **different fiber manufacturers and even different production lots of the same fiber type can have slightly different IOR/EIOR values**. The OTDR's default "G.652 singlemode" IOR is not a safe assumption — it must come from the specific cable reel's datasheet. R-1 mentions this in L10 but doesn't make explicit the consequence: in a 40-km run spliced from two different manufacturer reels (common on RUS builds with multiple contractors), entering one manufacturer's IOR produces distance errors on the second reel's portion of the span.

**Where it belongs:** Expand T12.L10 vocabulary to include "per-reel IOR verification" and add a field-practice note: "On multi-reel spliced runs, record the IOR from each cable reel's datasheet before testing; if reels differ, run separate OTDR tests per reel segment or accept the hybrid IOR will introduce cumulative position error."

**Citation:** Yamasaki Optical "IOR and OTDR Testing" 2025 (public — already on allowlist); Corning AN3060 (IOR/EIOR table for different G.652 variants).

---

### N-4: OTDR wavelength selection for acceptance vs. macrobend — industry standard practice
R-1 mentions 1625 nm in L09 (macrobend) but L01–L02 (acceptance testing) do not specify which wavelengths must be tested for full OSP acceptance. CFOS-T candidates need this explicitly. The industry-standard OSP acceptance wavelengths are:
- **All SM OSP acceptance:** 1310 nm + 1550 nm (both required, different attenuation profiles, catches wavelength-selective losses)
- **When macrobend suspected OR on G.652.D cable ≥ 1 km:** add 1625 nm
- **Long-haul DWDM:** also test 1383 nm (water peak) and optionally 1490 nm (PON downstream window)
- **Multimode acceptance (OM3/OM4):** 850 nm + 1300 nm per TIA-526-14B

R-1 never states the two-wavelength minimum (1310 + 1550 nm) as the baseline OSP acceptance requirement. This is a gap that affects L01 scope and L13 acceptance criteria.

**Where it belongs:** Add to T12.L01 as a vocabulary_introduced item "dual-wavelength acceptance testing (1310 + 1550 nm singlemode)" and reinforce in L13 acceptance thresholds.

**Citation:** NECA/FOA 301-2016 §7 (wavelength requirements for acceptance testing); TIA-526-7A (referenced via NECA/FOA 301-2016).

---

## CONFIRMED GAPS (R-1 flagged as uncertain — R-2 also cannot confirm from public sources)

### G-1: >0.2 dB macrobend heuristic — no normative TIA/IEC source found
R-1 correctly flags the >0.2 dB dual-wavelength differential as a "vendor heuristic (VIAVI), NOT normative." R-2 conducted independent searches for a normative TIA or IEC threshold for macrobend detection via OTDR — no standard with a specific dB threshold was found from public sources. The 0.2 dB figure appears in multiple vendor documents (VIAVI, EXFO, AFL) but is characterized as a practical threshold, not a regulatory limit. The `[confirm normative threshold with BICSI OSPDRM or carrier spec]` marker R-1 applied is appropriate and should remain.

**R-2 addition:** For G.652.D fiber, ITU-T G.652 specifies maximum macrobending loss: ≤0.1 dB at 1625 nm for 100 turns at 30 mm radius (ITU-T G.652.D §6). This is a cable qualification test (factory-spec), not a field acceptance threshold. The field-test threshold is genuinely vendor-practice. The marker should read: `[confirm normative field-test threshold; factory spec is ITU-T G.652.D ≤0.1 dB/100 turns at 30 mm — not applicable to in-situ OTDR readings]`.

---

### G-2: Bellcore SOR file format specification
R-1 cites "Bellcore SR-NWT-001991" for SOR format, marked `[confirm edition]`. R-2 could not find a public primary source confirming this document number or its current status. The SOR format is industry-universal (every major OTDR manufacturer writes SOR files), which means the Bellcore spec is almost certainly correct — but the current status (withdrawn? superseded? still maintained by Telcordia?) requires verification against a primary source. The `[confirm edition]` marker is appropriate.

---

### G-3: 0.15 dB bidirectional acceptance threshold — R-2 corroborates uncertainty
R-1 flags the "0.15 dB bidirectional" value (from M08 §8.4) as "unverified — common planning value but authoritative source is paywalled (BICSI OSPDRM or Telcordia GR-326)." R-2 independently searched for a normative source for 0.15 dB bidirectional splice acceptance — not found in public sources. FOA loss estimate page references ≤0.3 dB as acceptable maximum; individual application notes use 0.10 dB as a planning target. The 0.15 dB figure may be a BICSI OSPDRM or carrier-spec figure. R-1's handling (honest "common planning value, unverified normative source") is correct. Do not cite 0.15 dB as normative in T12.L13.

---

## VOCABULARY_ASSUMED POINTER VERIFICATION (DAG check of R-1's pointers)

Spot-checking R-1's vocabulary_assumed entries against T11 and T02 actual lesson content:

| R-1 claimed pointer | DAG verification result |
|---|---|
| `insertion loss (IL)` → T11.L12 | ✓ T11_BRIEF.md confirms L12 "Termination Quality & Loss Testing" introduces IL |
| `return loss (RL)` → T11.L12 | ✓ Same lesson, confirmed |
| `IEC 61300-3-35 end-face zones (A/B/C/D)` → T11.L14 | ✓ T11_BRIEF.md confirms L14 "Fiber Cleaning" introduces zone names |
| `IEC 61300-3-35 inspection protocol` → T11.L12 | ✓ T11_BRIEF.md confirms L12 introduces the protocol name |
| `fusion splice` → T11.L04 | ✓ T11_BRIEF.md confirms L04 "Fusion Splicing Theory & Mechanics" introduces the term |
| `MFD mismatch loss` → T11.L05 | ✓ T11_BRIEF.md confirms L05 "Splice Loss Mechanisms & MFD" |
| `attenuation (dB/km)` → T02.L02 | ✓ T02 teaches fiber attenuation in L02 (Fiber Attenuation & Loss Mechanisms) |
| `dB/dBm` → T02.L05 | R-2 note: T02.L05 may be "Link Budget" per ARCH.md — verify exact lesson that introduces dB/dBm math. If T02.L05 is Link Budget rather than dB basics, the pointer should be T02.L04 or earlier. Check against dag-registry.json for the precise lesson_id. |
| `PMD / DGD` → T02.L09 | Need confirmation that T02 actually has a L09 (15-lesson target for T02 — R-2 cannot confirm L09 independently without DAG query). |
| `splice loss acceptance threshold` → T11.L03 | ✓ T11_BRIEF.md confirms L03 "OTDR Testing for Splicing" introduces acceptance thresholds |

**One pointer flag for author to check:** `dB/dBm` → T02.L05 — verify this is the dB basics lesson and not a Link Budget lesson before using this pointer.

---

## BOOK VS. FIELD GAPS (items R-1 missed)

### BF-1: OTDR mode on multimode fiber — mandatory interleave protocol
R-1 focuses entirely on singlemode OTDR testing. For multimode fiber (OM3/OM4 in FTTx drop or MDU contexts): OTDR launch must use an encircled flux (EF) compliant source or a mandatory scrambling launch cable (mode conditioner). Testing MM without mode conditioning gives a misleading attenuation profile because high-order modes excited at the OTDR launch attenuate faster than steady-state. 

**Book:** mandated by TIA-526-14B for multimode OTDR measurements (encircled flux launch).  
**Field:** technicians use singlemode OTDR on multimode plant "because it works" — actually causes underestimated attenuation readings.

R-1 is singlemode-focused throughout, which is correct for OSP backbone. But T12.L01 should note the multimode exception so CFOS-T candidates know the distinction.

---

### BF-2: OTDR auto-event algorithms mask real events near fiber discontinuities
R-1 covers this partially at L08 (automated table fails at first/last connectors). Not covered: automated event detection also fails at **water ingress events** where high backscatter from a wet section masks the end-of-fiber reflection. In the field, a flooding handhole can produce a trace that auto-reports a "fiber break" 2 km before the actual break because the backscatter spike from the wet section saturates the algorithm. The three-step manual review (visual inspection of trace shape, bidirectional confirmation, field routing correlation) is the only reliable response.

**Where it belongs:** Add as Advanced content to T12.L08 "Reading an OTDR Trace."

---

## INTERACTIVITY GAP

R-1's T12.L02 only includes a WorkedExample for OLTS bidirectional and an MC quiz. Missing: a **three-cord reference method interactive diagram** showing physically which connectors are included in each reference method. This is a highly visual concept and an AnnotatedDiagram with the three-cord wiring permutations would serve the CFOS-T learner much better than prose. Add to L02 recommendations.

---

## ADDITIONAL PROPOSED ALLOWLIST ENTRY

R-2 found the following source not in R-1's list and not currently on the research-sources-allowlist:

| Source | Type | Public? | Why needed |
|---|---|---|---|
| EXFO Application Note 342 "Link loss measurement uncertainties: OTDR vs. LSPM" | Vendor technical report | Public (exfo.com) | Primary source for OTDR vs. OLTS measurement bias — corrects R-1's per-event error framing (X-2 above) |
| EXFO Application Note 043 "Bidirectional OTDR Testing" | Vendor application note | Public (exfo.com) | Confirms bidirectional averaging procedure; MM vs. SM treatment |
| Yokogawa "Two-Way Optical Fiber Measurement with OTDR" | Vendor application note | Public (tmi.yokogawa.com) | Independent source for bidirectional averaging requirement and MFD mismatch gainer explanation |

---

## CONVERGENCE SUMMARY (for authoring dispatch)

| Item | R-1 | R-2 | Action for author |
|---|---|---|---|
| Tier-1/Tier-2 hierarchy | ✓ | CORROBORATED | Use R-1 content |
| EDZ <1 m at 5–10 ns | ✓ | CORROBORATED | Use R-1 content; add reflectance caveat |
| Bidirectional average formula | ✓ | CORROBORATED | Use R-1 content |
| RUS 1753F-401 ≤0.30 dB splice max | ✓ | CORROBORATED | Use R-1 content |
| Launch cable sizing tiers | ✓ | CORROBORATED + refinement | Add ≥2.5 km note for 20 µs |
| IEC 61300-3-35 Zone B outer = 120 µm | ✗ WRONG | **CORRECTED to 110 µm (2022 Ed.3)** | Fix L11 definition |
| IEC 61300-3-35 Zones C/D mandatory | ✗ WRONG | **REMOVED from mandatory in 2022 Ed.3** | Fix L11 scope |
| OTDR error "0.05–0.20 dB per event" | ✗ IMPRECISE | **CORRECTED: ~0.25 dB whole-link bias** | Fix L01 definition |
| PMD limit ≤0.5 ps/√km for 10G NRZ | ⚠ PARTIAL | **CORRECTED: G.652.D ≤0.2 ps/√km; 0.5 = G.652A/C** | Fix L12 vocabulary |
| >0.2 dB macrobend heuristic (vendor) | `[confirm]` | CONFIRMED GAP | Keep marker; add ITU-T G.652.D factory spec context |
| SOR file Bellcore reference | `[confirm]` | CONFIRMED GAP | Keep marker |
| 0.15 dB bidirectional acceptance | `[confirm]` | CONFIRMED GAP | Do not use in L13 as normative |
| VFL (visual fault locator) | MISSING | **NEW CONTENT N-1** | Add to L01 as "Tier 0" tool |
| OLTS reference cord verification | MISSING | **NEW CONTENT N-2** | Add to L02 workflow |
| Multi-reel IOR variation | PARTIAL | **NEW CONTENT N-3** | Expand L10 |
| Dual-wavelength acceptance (1310+1550) | MISSING | **NEW CONTENT N-4** | Add to L01 + L13 |

---

=== T12 RESEARCH R-2 BRIEF END ===
