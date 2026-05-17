# T02 Audit R-4 — Forensic / Field-Incident-Investigation Framing

**Constraints acknowledged (FIRST LINE):** READ-ONLY contract enforced. No lesson files modified. No CANONICAL.md created. No orchestrator roleplay. No follow-up rounds dispatched. No fixes applied. Write-path: this file ONLY.

**Framing:** Senior OSP engineer / post-incident investigator. 15+ yrs design + failure analysis. Evaluating T02 against real field-incident scenarios: does T02 give learners what they need to prevent each failure mode?

---

## FINDINGS TABLE — NEW from R-4 Forensic Framing

| ID | Severity | Category | File | Line Range | Issue | Fix Shape | Confidence |
|----|----------|----------|------|------------|-------|-----------|------------|
| R4-F01 | HIGH | forensic-scenario | L01 | 191 | Critical angle described as "<85° from the boundary" — inverts the TIR condition. sin(θ_c)=0.9966 → θ_c≈85° FROM THE NORMAL (≡ ~5° grazing angle from boundary). L01 says TIR for "less than 85° from the boundary" which means almost any angle — the opposite of reality. Learner applying this will misunderstand when TIR fails (macrobend), causing incorrect field diagnosis. | Replace "less than 85° from the boundary (i.e., within about 5° of grazing)" with "greater than 85° from the surface normal (i.e., within about 5° of grazing along the boundary). Any ray steeper than 85° from the normal — more than 5° off the boundary — escapes." | HIGH |
| R4-F02 | MED | forensic-scenario | L08 | 23, 124, 187 | OM5 EMB stated as "28000 MHz·km @ 953 nm" — but TIA-492AAAE also mandates minimum EMB at 850 nm (≥2000 MHz·km) and OM5's SWDM4 advantage is the 953 nm spec. The "laser-optimized MMF" flashcard (line 125) says OM3/4/5 are "optimized for 850 nm VCSEL" — incomplete for OM5, which adds 953 nm VCSEL support. Learner may specify OM3 thinking it's equivalent to OM5 at 850 nm for SWDM4 applications. | Add sentence: "OM5 also meets the OM3/OM4 requirement at 850 nm (≥2000 MHz·km EMB); its distinguishing spec is the additional 28000 MHz·km at 953 nm enabling SWDM4." Update laser-optimized flashcard to note OM5 also supports 953 nm VCSELs. | HIGH |
| R4-F03 | MED | forensic-scenario | L02 | 182-183 | G.652.B water-peak hazard for CWDM mentioned but incompletely. L02 says "older G.652.B fibers have a much larger water peak" — no quantification, no CWDM channel implication. Real incident: specifying CWDM on legacy G.652.B plant causes 5-10 dB excess loss on the 1370/1390 nm CWDM channels due to the E-band water peak. Field engineer selecting G.652.B fiber for a CWDM overlay upgrade gets a failed link with no warning from T02. | Add CWDM-specific callout: "G.652.B/C fibers cannot support CWDM channels near 1383 nm (E-band) — the water peak causes 5+ dB/km excess loss. G.652.D (low-water-peak) is required for CWDM deployments. Check fiber documentation before designing any CWDM overlay on existing plant." | HIGH |
| R4-F04 | MED | coverage-gap | L06, L07 | L06:advanced, L07:advanced | EDFA cascading noise (ASE accumulation, gain ripple) not covered. L07 mentions EDFA is "native to C-band" and "boosts all channels simultaneously" — no mention of cascading limits, ASE noise figure buildup across multiple amplifiers, or OSNR degradation. Learner designing a long-haul DWDM route with 8+ EDFAs gets no warning that cascade noise is the dominant link-budget constraint at those spans. | Add to L07 advanced section: "Each EDFA adds amplified spontaneous emission (ASE) noise. Across 8+ cascaded EDFAs, ASE accumulation degrades OSNR (Optical Signal-to-Noise Ratio) and becomes the primary link-budget constraint — not fiber attenuation alone. Long-haul DWDM design requires OSNR budget in addition to power budget." | MED |
| R4-F05 | MED | cross-curriculum | T05/L12 | line 309 | T05.L12 states G.652.D typical attenuation at 1310 nm = "0.34–0.36 dB/km" while T02.L02 states the typical datasheet value = "0.32–0.35 dB/km" (and designer planning value = 0.35 dB/km). The ranges don't overlap cleanly — T05 starts at 0.34 where T02 ends. Learner doing a link budget using T02 planning values will get a different number than a colleague reading T05.L12. | Align T05.L12 to use "0.32–0.35 dB/km typical" per T02.L02, or add a cross-reference: "See T02.L02 for the three-numbers framework (spec max / typical / designer planning value)." | MED |
| R4-F06 | LOW | coverage-gap | L07, L10 | L07:advanced | Stimulated Brillouin Scattering (SBS) and Fiber Fuse threshold not mentioned anywhere in T02. SBS limits CW launch power to ~+8 dBm on standard G.652.D at 1550 nm (1 GHz linewidth DFB). Field incident: crew launches +13 dBm CATV signal on single fiber, triggers SBS, signal degrades unpredictably. Fiber Fuse can occur above ~250 mW (~+24 dBm) and destroys fiber. Both are within OSP scope (CATV overlay, EDFA-amplified long-haul). | Add to L07 advanced or L10 a brief paragraph: "At high launch powers (≥+10 dBm), nonlinear effects can cause problems. SBS scatters light backward above ~+8 dBm for narrow-linewidth lasers. Fiber Fuse — destructive damage propagating toward the source — can occur above ~+24 dBm. Both are relevant for CATV overlay and EDFA-amplified long-haul OSP designs." | LOW |
| R4-F07 | LOW | coverage-gap | L10 | — | OTDR dead zones (event dead zone ~1.5 m; attenuation dead zone ~5-10 m for typical pulse width) not addressed in T02 or referenced as forward content. Scenario: crew interprets a splice within the dead zone as "not present" and mislocates a fault. T10 notes OTDR is covered in "T12" but T12 doesn't exist yet — no interim note about dead zones in T02 characterization lesson. | Add a cross-reference note in L10: "OTDR dead zones (event dead zone: ~1.5–3 m; attenuation dead zone: ~5–15 m depending on pulse width) are covered in T12. Be aware that events within 1.5 m of a connector or launch end may not be individually resolvable." | LOW |
| R4-F08 | LOW | forensic-scenario | L08 | 204-215 | OS1 fiber outdoor hazard (scenario 15) not addressed. L08 identifies OS1 as "primarily for indoor/tight-buffer cable" but doesn't warn that OS1 installed outdoors risks moisture ingress, microbend from freeze-thaw, and accelerated aging vs. OS2. A crew finding a reel of OS1 on a mixed pallet and using it on an outdoor OSP run needs this warning. | Add to L08 Book vs. Field callout: "Never install OS1 on outdoor OSP runs — it lacks the water-peak reduction and weathering specs of OS2/G.652.D. If OS1 accidentally enters an outdoor run, expect higher loss within 1-2 years from moisture-induced OH absorption." | LOW |

---

## Forensic Scenario Coverage Map

| Scenario | T02 Coverage Status |
|----------|-------------------|
| 1. Pigtail mismatch (SMF into MMF) | **Present + Adequate** — L08 field callout with 20 dB loss explanation, color-coding guidance (lines 252-268) |
| 2. Wrong wavelength (1310 on dispersion-shifted span) | **Present + Adequate** — L07 covers 1310 vs 1550 dispersion tradeoff; L03 covers ZDW |
| 3. G.652.D vs G.657.A2 tight-bend (macrobend aging) | **Present + Adequate** — L04 covers macrobend + G.657 selection; L11 notes G.657.B3 splice loss |
| 4. OTDR dispersion-pulse misread | **Present + Adequate** — L03 covers pulse broadening; L10 covers gainer artifacts; OTDR dead zones absent (R4-F07) |
| 5. OM3 vs OM4 at 350 m (EMB distance) | **Present + Adequate** — L08 table shows OM3=300 m, OM4=400 m at 10GbE |
| 6. CWDM/DWDM thermal drift | **Present + Adequate** — L07 advanced notes DFB precision + APC connectors for DWDM |
| 7. EDFA cascading ASE noise | **Absent** — R4-F04 |
| 8. PMD legacy fiber upgrade | **Present + Adequate** — L09 covers PMD formula + legacy fiber upgrade warnings explicitly |
| 9. Connector endface contamination / fiber fuse | **Partial** — contamination covered well in L11; fiber fuse/SBS at high power absent (R4-F06) |
| 10. Splice loss budget on 60-splice span | **Present + Adequate** — L06 SliderExploration shows splice count + dB/splice contribution |
| 11. G.657.A1 exceeding 10mm bend in closure | **Present + Adequate** — L04 mandrel test table + field rule explicitly stated |
| 12. ORL at 100G coherent | **Present + Adequate** — L06 advanced section covers ORL formula + APC specs |
| 13. G.652.B CWDM Y-band / 1383nm hazard | **Present + Inadequate** — mentioned but not quantified or CWDM-specific (R4-F03) |
| 14. Microbend from tight-buffer installation | **Present + Adequate** — L04 + L09 cover installation stress → microbend + PMD |
| 15. OS2 vs OS1 outdoor selection | **Present + Inadequate** — OS1 identified as indoor-only but outdoor hazard not warned (R4-F08) |

---

## R-1 + R-2 + R-3 Reconciliation

R-1 (skeptical) caught the critical angle convention error (HIGH) and three MED citation issues. R-2 (adversarial) confirmed the R-1 HIGH and added OM5 EMB wavelength as a distinct HIGH plus splice-loss budget MED. R-3 (learner) found four learner-HIGH jargon-before-definition gaps and flashcard render issues. R-4 (forensic) re-confirms R4-F01 (critical angle) as the highest priority — it is a physics inversion that will persist in flashcard cards if not fixed. R4-F03 (G.652.B CWDM water peak) is genuinely new from this framing — no prior round caught it. R4-F05 (T05.L12 vs T02.L02 attenuation cross-inconsistency) is also new cross-curriculum finding. R4-F04 (EDFA cascading) is new. Most forensic scenarios are adequately covered — T02 is substantively strong for the OSP audience.

## Stack Snapshot

T02 has 12 lessons, 390+ taught concepts, 4 interactivity types across all lessons. High-stakes forensic scenarios (PMD legacy upgrade, SMF/MMF mismatch, macrobend diagnosis, ORL) are well-addressed. The critical angle convention inversion (R4-F01) is the only confirmed correctness error that affects field diagnosis. Four minor gaps (EDFA cascading, SBS/fiber fuse threshold, OTDR dead zone, OS1 outdoor) are LOW/MED and OSP-adjacent rather than OSP-core.

## Coverage Gaps Still Unexamined After R-1..R-4

- **Receiver sensitivity vs OSNR budget** (coherent systems) — L06 covers power budget only; OSNR budget framework absent
- **FEC coding gain** (modern coherent systems add 6-9 dB effective margin via FEC) — not mentioned; affects link budget interpretation for 100G+ systems
- **Polarization Dependent Loss (PDL)** — briefly intersects PMD measurement but not independently covered
- **Full CWDM channel map** — L07 describes CWDM but doesn't show the 18-channel grid with which channels are usable on G.652.D vs G.652.B

## SATURATION VERDICT

R-1: 2 HIGH (critical angle, citations). R-2: 1 HIGH (OM5 EMB). R-3: 4 HIGH (all learner-pedagogy class). R-4: 1 HIGH (critical angle re-confirmation — same as R-1), 0 net-new HIGH technical.

**HIGH technical curve: R-1=2, R-2=1, R-3=0 technical, R-4=0 new HIGH.** The HIGH technical pool appears saturated at 2-3 distinct findings (critical angle convention + OM5 EMB wavelength). R-3 and R-4 found no additional HIGH technical errors.

**Assessment vs T04 pattern:** T04 continued finding new HIGHs through R-5/R-6/R-7 because it had systematic factual errors across multiple lessons. T02 has isolated correctness errors (critical angle in L01, OM5 EMB in L08) in otherwise well-researched content. The HIGH curve flattening after R-2 is genuine saturation, not a framing gap.

**Recommendation:** T02 has approached HIGH-technical saturation. Dispatch one fix-agent targeting the confirmed HIGH findings from R-1 + R-2 + R-4 (critical angle convention + OM5 EMB + G.652.B CWDM warning). Follow with 2-RT post-fix verification. MED/LOW items fold into T02 polish stage.

**Saturation hint for R-5 (if needed):** Frame as **legal / standards-compliance** — focus on whether [confirm edition] markers actually need confirmation before the topic is deployed, and whether any cited standards have been superseded since authoring. This is the framing least covered by R-1..R-4 and most likely to surface citation-expiry issues.

=== T02 AUDIT R4 FORENSIC END ===
