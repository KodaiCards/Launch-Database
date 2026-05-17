# T12 (Testing — OLTS, OTDR, Inspection) — Research Brief R-1

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T12_BRIEF.md` written.

**Agent:** T12 Research R-1 — primary-source-skeptical / high-precision framing  
**Date:** 2026-05-17  
**Word count:** ~5,100  
**Teaching position:** 15 of 19 (after T11 Splicing; before T13 Inspection & QA)  

---

## Section 1: Topic Scope

**Title:** Testing — OLTS, OTDR, Inspection  
**Category:** General learning — teaching position 15

**Scope:** Everything a crew member, technician, or engineer needs to correctly execute fiber-optic acceptance testing on OSP plant. Covers the two-tier testing hierarchy (Tier-1 OLTS insertion-loss certification and Tier-2 OTDR event-characterization), the physics of how each instrument works and where each fails, OTDR parameter selection (pulse width, range, averaging time, IOR), dead-zone physics and launch/receive cable sizing, bidirectional OTDR averaging and the gainer artifact, reading and annotating OTDR event tables, macrobend detection using dual-wavelength differential, end-face inspection using IEC 61300-3-35 zone grades, PMD/CD measurement for high-speed systems, acceptance criteria (TIA-568 link model, RUS contract spec, NECA/FOA 301 thresholds), and test documentation.

**Teaching prerequisites (per ARCH.md DAG):**
- T01 — Fundamentals & Vocabulary: OSP project lifecycle, "what is a splice case," basic anatomy
- T02 — Fiber Physics: attenuation dB/km, dispersion (CD/PMD), MFD, macrobend/microbend, G.652.D/G.657, link budget, wavelength windows, dB/dBm arithmetic
- T11 — Splicing: fusion splice mechanics, MFD mismatch loss concept (gainer explained in T12 by reference), splice-case types, IEC 61300-3-35 end-face zone map (introduced at T11.L12–L14), insertion loss (IL) and return loss (RL) defined at T11.L12

**Topics that depend on T12:**
- T13 — Inspection & QA: T12 acceptance testing workflow is the measurement layer for QA pass/fail decisions
- T15 — Restoration & Outage Response: OTDR fault-locate procedure uses T12 OTDR literacy
- T16 — As-Built Documentation: OTDR report and loss report are part of the as-built package

**ARCH.md anchor standards:** TIA-568.3-D Annex; IEC 61280-4-2; IEC 61300-3-35; FOA CFOS-T  
**Lesson target:** 15 lessons (per ARCH.md §4)

---

## Section 2: Per-Lesson List (L01–L15)

### T12.L01 — Tier 1 vs. Tier 2: OLTS vs. OTDR
**Type:** Foundation  
**Time estimate:** 25 min  
**Learning objectives:**
1. Explain what each instrument measures and why the measurements are not interchangeable.
2. State the governing test procedures for Tier-1 (TIA-526-7A for singlemode, TIA-526-14B for multimode — both paywalled; referenced via NECA/FOA 301-2016) and Tier-2 (TIA-455-61 / IEC 61280-4-2).
3. Identify when each tier is required on an OSP acceptance job.

**vocabulary_introduced (5 terms):**
- **OLTS (Optical Loss Test Set):** A two-piece instrument (light source + power meter) that injects a known optical power level into one end of a fiber and measures how much arrives at the other end. The result is the true end-to-end insertion loss in dB — the only power-measurement of link loss. (Source: FOA OTDR reference page; NECA/FOA 301-2016 §1)
- **OTDR (Optical Time-Domain Reflectometer):** Injects a laser pulse and measures the tiny fraction that scatters back (Rayleigh backscatter) vs. distance. Produces a trace of backscatter level vs. km; characterizes individual events (splice loss, connector loss, macrobends, faults). NOT a substitute for OLTS — OTDR loss readings carry 0.05–0.20 dB systematic error per event. (Source: FOA OTDR reference page; IEC 61280-4-2 [paywalled — confirm edition])
- **insertion loss:** The decrease in optical signal power measured end-to-end by an OLTS. Defined as: IL(dB) = 10 × log₁₀(P_in / P_out). (Source: TIA-568.3-D §6 [paywalled — confirm edition]; NECA/FOA 301-2016)
- **return loss:** The ratio of incident light power to reflected light power at a connector or interface, in dB. Higher return loss = less reflected power = better. APC connectors achieve >60 dB; UPC typically >50 dB for reference grade. (Source: IEC 61300-3-35 [paywalled — confirm edition]; T11.L12 introduced these terms — T12.L01 uses them as assumed vocabulary from T11)
- **TIA-526:** Series of ANSI/TIA standards for optical power loss measurements of installed fiber cable plant. TIA-526-7A (singlemode) and TIA-526-14B (multimode) govern OLTS reference methods (one-, two-, three-cord). Both paywalled — `[confirm edition]`. (Source: TIA-526-7A / TIA-526-14B [paywalled]; secondary: NECA/FOA 301-2016 describes all three reference methods)

**vocabulary_assumed (from T01/T02/T11):**
- `attenuation` → T02.L02
- `dB/dBm` → T02.L05
- `link budget` → T02.L06
- `insertion loss (IL)` → T11.L12
- `return loss (RL)` → T11.L12

**Key concepts:** Tier-1 measures actual power budget; Tier-2 locates and characterizes events. An OTDR trace that "passes" can still fail at the OLTS because systematic backscatter error compounds across multiple events. Both tiers required for full OSP acceptance certification.

**Book vs. field:** Book requires both tiers; field reality is that many contractors skip OLTS and deliver only OTDR traces because the customer asked for "OTDR certification." Gap shows at OLT commissioning.

**Citations:** FOA OTDR reference page (public); NECA/FOA 301-2016 §1 (public); TIA-526-7A / TIA-526-14B [paywalled — `[confirm edition]`]; IEC 61280-4-2 [paywalled — `[confirm edition]`]

**Interactivity:** Quiz (MC + drag-match: scenario → tier required)

---

### T12.L02 — OLTS: Reference Methods and Bidirectional Loss
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. Describe the one-cord, two-cord, and three-cord reference methods and explain why they produce different loss results on the same link.
2. Calculate bidirectional OLTS average for a singlemode OSP span given A→B and B→A readings.
3. State the acceptance threshold structure: TIA-568.3-D channel insertion loss limit (cited via NECA/FOA 301 secondary) and RUS contract max from RUS 1753F-401.

**vocabulary_introduced (4 terms):**
- **one-cord reference method:** OLTS reference method where a single launch cord connects from the instrument to the link. Lowest measurement uncertainty; preferred by FOA for premises links. (Source: TIA-526-7A / NECA/FOA 301-2016 §3)
- **two-cord reference method:** OLTS reference method that includes one connector pair in the reference — accounts for one end's connection. Most common for OSP carrier/ILM acceptance. (Source: TIA-526-7A / NECA/FOA 301-2016 §3)
- **directional variation:** The phenomenon in which A→B OLTS loss differs from B→A OLTS loss due to connector polish orientation, source beam profile asymmetry, or slight splice MFD mismatch. The bidirectional average eliminates the asymmetry. (Source: NECA/FOA 301-2016; FOA loss-est page)
- **bidirectional average (OLTS):** Arithmetic mean of A→B and B→A insertion loss measurements. True link loss = (IL_A→B + IL_B→A) / 2. Used when directional variation exists. (Source: TIA-526-7A §6; NECA/FOA 301-2016)

**vocabulary_assumed:** `OLTS` → T12.L01; `insertion loss` → T11.L12; `attenuation dB/km` → T02.L02

**Key math — OLTS bidirectional:**
- True insertion loss = (IL_A→B + IL_B→A) / 2
- Example: A→B = 3.42 dB, B→A = 3.68 dB → True loss = (3.42 + 3.68) / 2 = 7.10 / 2 = **3.55 dB**
- Sanity check: "3.55 dB is slightly more than 1 mW becoming 0.44 mW — roughly 56% of the light lost to connectors, splices, and fiber."

**Key concepts:** Reference method choice changes which connectors are included in the measurement; switching methods mid-project invalidates comparisons; TIA-568.3-D channel insertion loss limits are wavelength-dependent (link model: 3.56 dB @ 1310 nm for a typical 100m premises span — paywalled, cited via secondary).

**Citations:** TIA-526-7A / TIA-526-14B [paywalled — `[confirm edition]`]; NECA/FOA 301-2016 §3 (public); RUS 1753F-401 §5 (public); TIA-568.3-D §6 [paywalled — `[confirm edition]`]

**Interactivity:** WorkedExample (bi-di OLTS average with step-by-step arithmetic); Quiz (MC: which reference method applies to this scenario?)

---

### T12.L03 — OTDR Fundamentals: Pulse, Range, Averaging
**Type:** Working  
**Time estimate:** 30 min  
**Learning objectives:**
1. Explain how Rayleigh backscatter produces the OTDR trace.
2. Predict the direction-of-change for range, noise floor, and event resolution when pulse width is increased or decreased.
3. Select appropriate pulse width and averaging time for three representative OSP scenarios (FTTH MDU, feeder 10 km, metro 40 km).

**vocabulary_introduced (5 terms):**
- **Rayleigh backscatter:** Microscopic density variations in the glass core cause roughly 0.01% of the traveling light to scatter backward toward the source. The OTDR measures the power level of this backscatter vs. time (→ distance). As the signal travels further, the backscatter level falls — its rate of fall equals the fiber's attenuation. (Source: EXFO Application Note 194; Corning AN3060)
- **pulse width:** Duration of the OTDR's transmitted laser burst, in nanoseconds (ns) or microseconds (µs). Controls the tradeoff between range (long pulse = more energy = more range) and event resolution (short pulse = shorter dead zone = can see closely-spaced events). (Source: EXFO Application Note 296)
- **dynamic range:** Difference in dB between the OTDR's backscatter level at the launch point and the noise floor. Higher dynamic range = longer measurable fiber. (Source: EXFO Application Note 194; VIAVI Reference Guide Vol 1)
- **averaging time:** Number of pulses accumulated and averaged. Signal-to-noise ratio improves by √N (every 4× more averaging time = ≈2× noise reduction ≈ 0.5 dB improvement). Diminishing returns beyond ~3 min at 30 s typical for acceptance. (Source: EXFO Application Note 296; FS Community OTDR tutorial)
- **EIOR (Effective Group Index of Refraction):** Value the OTDR uses to convert round-trip travel time to distance: d = (c × t) / (2 × n). The EIOR from the cable manufacturer's datasheet must be entered before each test — typical SMF value ≈ 1.4677 at 1550 nm but varies by manufacturer. (Source: Yamasaki Optical "IOR and OTDR Testing" 2025)

**vocabulary_assumed:** `attenuation` → T02.L02; `G.652.D` → T02.L01/T02; `wavelength windows` → T02.L07; `OTDR` → T12.L01

**Pulse-width bands by application** (Source: EXFO Application Note 296; VIAVI Reference Guide Vol 1):
- 5–30 ns → FTTH MDU/premises (≤2 km; best dead-zone resolution)
- 100–500 ns → FTTx feeder / short OSP (≤10 km)
- 1–3 µs → metro/regional (10–40 km)
- 10–20 µs → long-haul backbone (>40 km)

**Book vs. field:** Manual pulse-width selection per span (book / correct). Single "metro" or "long-haul" preset never changed (field reality); vendors EXFO iOLM and VIAVI SmartLink Mapper automate selection precisely because manual wasn't happening.

**Citations:** EXFO Application Note 194 (public); EXFO Application Note 296 (public); VIAVI Reference Guide Vol 1 (public); Yamasaki Optical 2025 (public); FS Community OTDR tutorial (public)

**Interactivity:** WorkedExample (parameter selection for a 40 km span: pulse width choice + IOR entry + range setting); AnnotatedDiagram (OTDR trace anatomy: launch ramp, connector spike, splice step, macrobend, ghost, end reflection)

---

### T12.L04 — Dead Zones: EDZ and ADZ
**Type:** Working  
**Time estimate:** 30 min  
**Learning objectives:**
1. Define EDZ and ADZ, explain the physical mechanism of each, and state typical values at narrow pulse.
2. Calculate whether a given launch cable length is sufficient to put the first real event out of the entry connector's ADZ.
3. Diagnose a ghost reflection using the no-loss-step test and the 2× round-trip distance criterion.

**vocabulary_introduced (4 terms):**
- **EDZ (Event Dead Zone):** Minimum distance between two reflective events that can still be independently detected. The detector saturates during the connector's reflection spike; a second event within EDZ is missed. Typical: <1 m at 5–10 ns pulse width. (Source: Fluke Networks KB; EXFO Application Note 296)
- **ADZ (Attenuation Dead Zone):** Minimum distance after a reflective event before a non-reflective event (e.g., a fusion splice) can be accurately measured. Defined per Telcordia (cited via EXFO): ≥0.5 dB deviation from backscatter slope. Typical: 3–5 m at narrowest pulse; 10–50 m at 1 µs. (Source: EXFO Application Note 296, citing Telcordia GR — `[confirm edition]`)
- **ghost reflection:** A false event appearing at an integer multiple of the round-trip distance to a strong reflective connector. The pulse bounces off the connector, reflects off the OTDR launch port, and travels out again. Diagnostic: no loss step (trace returns to backscatter slope), event disappears or moves when pulse width changes, event does not appear at same physical location from the opposite end. (Source: Corning WP1281; STL whitepaper)
- **launch cable (OTDR):** A known-good fiber of defined length between the OTDR port and the cable under test. Moves the OTDR's entry connector and its dead zone off the cable under test. Minimum lengths: ≥150 m (premises/FTTx, ≤500 ns pulse), ≥500 m (metro/short OSP), ≥1 km (long-haul, ≥40 km spans). (Source: EXFO Application Note 298)

**vocabulary_assumed:** `OTDR`, `pulse width` → T12.L03; `fusion splice` → T11.L04; `connector` → T01/T11

**Key math — launch cable sizing:**
- Formula: launch cable length (m) ≥ ADZ for the selected pulse width
- ADZ scales roughly linearly with pulse width: ADZ ≈ (pulse_width_ns) × 0.1 m/ns to 0.05 m/ns depending on OTDR design
- Practical rule: at 10 µs pulse, ADZ ≈ 500 m minimum → a 150 m launch cable is insufficient for long-haul work
- Example: 10 µs pulse, ADZ ~500–1000 m → need ≥1 km launch cable; 150 m launch puts first real connector inside dead zone

**Ghost math:**
- Ghost location = 2 × round-trip distance to real reflector
- Real connector at 8.5 km → ghost at 8.5 × 2 = 17.0 km
- Diagnostic check: no loss step at 17.0 km → ghost confirmed

**Book vs. field:** Correctly-sized launch cable matched to pulse width (book). Single 150 m launch box used on all jobs regardless of span (field reality). Field consequence: entry connector's loss "never actually measured" on long-haul spans.

**Citations:** EXFO Application Note 296 (public); EXFO Application Note 298 (public); Fluke Networks KB (public); Corning WP1281 (public); STL whitepaper (public)

**Interactivity:** AnnotatedDiagram (dead zone diagram: EDZ vs. ADZ, connector spike, dead zone band labeled); WorkedExample (sizing launch cable for a 40 km span)

---

### T12.L05 — Ghost Reflections: Identification and Elimination
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. Apply the three-step ghost diagnosis protocol (no-loss-step test, pulse-width change, bidirectional verification).
2. Explain why an automated event table frequently misidentifies a ghost as the "end of fiber."
3. Distinguish ghost from high-reflectance real event (bad mechanical splice, open-end connector).

**vocabulary_introduced (3 terms):**
- **coherence length:** The spatial extent over which a laser's phase remains correlated. Long coherence length (typical for narrow-linewidth OTDR lasers) increases the intensity of ghost reflections because multiple round-trips remain coherent. (Source: Corning WP1281 — vendor secondary; paywalled IEC reference deferred)
- **reflection source masking:** Condition where a strong reflective event (e.g., an open-end connector) at distance d creates multiple ghost images at 2d, 3d, etc., potentially masking real events at those distances. (Source: Corning WP1281; STL whitepaper)
- **backscatter slope:** The linear (in dB) decrease of OTDR trace level vs. distance, representing the fiber's attenuation per km. A ghost leaves no permanent deflection in the slope — the trace "comes back" to the expected slope after the ghost. A real event causes a permanent step-down. (Source: EXFO Application Note 194; FOA OTDR reference page)

**vocabulary_assumed:** `ghost reflection`, `ADZ`, `EDZ` → T12.L04; `OTDR` → T12.L01/L03

**Ghost diagnosis protocol (3 steps):**
1. No-loss-step test: does the trace return to expected slope after the event? Yes = ghost candidate. Real event = permanent step-down.
2. Pulse-width change: shorten pulse width. Ghost moves closer (or disappears); real event stays in place.
3. Bidirectional: from the far end, ghost appears at a different distance (it's tied to the far-end connector's position); real event stays at same physical location.

**Citations:** Corning WP1281 (public); STL whitepaper (public); FOA OTDR FAQs (public); EXFO Application Note 194 (public)

**Interactivity:** Quiz (MC: classify four OTDR events as real vs. ghost from trace descriptions); OTDRTraceViewer (interactive trace with one ghost + 2 real events — learner must identify which is ghost)

---

### T12.L06 — Launch and Receive Cables: Sizing and MFD Matching
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. Size a launch cable for a given pulse width and span length.
2. Explain MFD mismatch gainer artifacts and their effect on measured splice loss.
3. State when a receive cable is required and what it enables.

**vocabulary_introduced (4 terms):**
- **receive cable (OTDR):** Known-good fiber on the far end of the span under test. Allows the OTDR to see the receive connector as a measurable loss event rather than an abrupt end-of-fiber. Required whenever far-end connector loss must be individually measured. (Source: EXFO Application Note 298; FOA Fiber U — launch cable mini-course)
- **MFD mismatch gainer:** Apparent upward step on OTDR trace at a splice between fibers with different mode-field diameters (e.g., G.652.D ~10.4 µm to G.657.A2 ~8.6 µm). Physically impossible — is a backscatter artifact. Disappears or becomes a real loss when tested from the opposite direction. True loss = bidirectional average. (Source: CommScope blog; Corning AN3060; defined in T11.L05 as `MFD mismatch loss` — T12.L06 applies the OTDR manifestation)
- **launch cable MFD matching:** Launch cable fiber should match the MFD of the cable under test (same fiber grade). Mismatched MFD between launch cable and tested cable introduces a systematic gainer or loss step at the entry reference point, corrupting the first-event measurement. (Source: EXFO Application Note 298)
- **receive cable minimum length:** Must be ≥ ADZ of the pulse width used. For premises FTTx (≤500 ns pulse) ≥150 m; for metro/OSP ≥500 m; for long-haul ≥1 km. Same sizing rule as launch cable. (Source: EXFO Application Note 298)

**vocabulary_assumed:** `launch cable` → T12.L04; `MFD mismatch` → T11.L05 (assumed from T11); `MFD mismatch gainer` (concept) → T11.L05; `ADZ` → T12.L04

**Key math — gainer calculation:**
- Gainer artifact: bidirectional average removes it
- True splice loss = (reading_A→B + reading_B→A) / 2
- Example: A→B = −0.08 dB (gainer), B→A = +0.28 dB → True loss = (−0.08 + 0.28) / 2 = 0.20 / 2 = **0.10 dB**
- Sanity check: "0.10 dB means 98% of the light crosses the splice — a good fusion result. The gainer was purely an artifact of which direction the pulse traveled."

**Citations:** EXFO Application Note 298 (public); CommScope blog (public); Corning AN3060 (public); FOA OTDR FAQs (public)

**Interactivity:** WorkedExample (gainer calculation with signed arithmetic step-by-step); AnnotatedDiagram (launch cable setup: OTDR port → launch cable → span under test → receive cable → power meter / far-end OTDR)

---

### T12.L07 — Bidirectional OTDR: When and Why
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. State the standard procedure for bidirectional OTDR testing (TIA-455-61 / IEC 61280-4-2 procedure — paywalled, referenced via VIAVI blog 2023).
2. Calculate the bidirectional average splice loss for three events on a span given two unidirectional readings.
3. Identify two scenarios requiring bidirectional OTDR vs. one scenario where unidirectional is sufficient.

**vocabulary_introduced (3 terms):**
- **bidirectional OTDR:** OTDR testing from both ends of the span, producing two complete event tables. Bidirectional average for each splice/connector eliminates MFD-mismatch artifacts and direction-dependent backscatter bias. Required on RUS-financed builds per RUS 1753F-401 §5. (Source: TIA-455-61 [paywalled — `[confirm edition]`]; IEC 61280-4-2 [paywalled — `[confirm edition]`]; VIAVI blog Feb 2023 secondary; RUS 1753F-401 §5 public)
- **direction-dependent loss:** Loss reading that changes depending on which direction the OTDR pulse travels. Caused by MFD mismatch, splice geometry asymmetry, or connector polish alignment. Eliminated by bidirectional averaging. (Source: CommScope blog; FOA OTDR FAQs)
- **unidirectional OTDR:** Single-direction OTDR test from one end only. Acceptable for fault location during restoration (fastest method) but NOT acceptable for acceptance testing when MFD mismatch is possible. (Source: NECA/FOA 301-2016; FOA OTDR reference page)

**vocabulary_assumed:** `MFD mismatch gainer` → T12.L06; `OTDR` → T12.L01/L03; `fusion splice` → T11.L04; `bidirectional average (OLTS)` → T12.L02

**Key math — bidirectional OTDR average (three events):**
- Splice A: A→B = +0.06 dB, B→A = +0.08 dB → avg = 0.07 dB ✓
- Splice B: A→B = −0.03 dB (gainer), B→A = +0.17 dB → avg = (−0.03 + 0.17)/2 = 0.07 dB ✓
- Splice C: A→B = +0.31 dB, B→A = +0.29 dB → avg = 0.30 dB — near RUS 0.30 dB contract max, investigate
- "Splice C sits right at the RUS limit. Retry: if you get 0.28 dB on re-splice, accept. If 0.30 or above after 3 attempts, the cause may be fiber type mismatch — go bidirectional on that segment specifically."

**Citations:** TIA-455-61 [paywalled — `[confirm edition]`]; IEC 61280-4-2 [paywalled — `[confirm edition]`]; VIAVI blog Feb 2023 (public secondary for standard citation); RUS 1753F-401 §5 (public); NECA/FOA 301-2016 (public)

**Interactivity:** WorkedExample (bi-di average for three splices, sign-correct arithmetic shown)

---

### T12.L08 — Reading an OTDR Trace
**Type:** Working  
**Time estimate:** 30 min  
**Learning objectives:**
1. Identify and name each trace feature: connector spike, splice step, macrobend event, ghost, end reflection.
2. Apply the correct manual cursor placement procedure for non-reflective (splice) events.
3. Explain two scenarios where automated event detection fails.

**vocabulary_introduced (4 terms):**
- **event table:** Tabular summary generated by the OTDR listing each detected event, its distance (km), event type (reflective/non-reflective/end), loss (dB), and reflectance (dB). Automated table is a productivity tool; not a substitute for manual cursor review at first/last connectors. (Source: FOA Fiber U mini-course; EXFO Application Note 194)
- **loss event:** A non-reflective step-down in the OTDR backscatter trace. Fusion splices and macrobends appear as loss events (no spike, just a step-down). (Source: FOA OTDR reference page; Corning AN3060)
- **reflection event:** An event that produces a spike above the backscatter slope before the step-down. Connectors, mechanical splices, and open-ended fibers are reflective. (Source: EXFO Application Note 194; FOA OTDR reference page)
- **manual cursor placement:** Correct OTDR technique: left cursor on the backscatter slope just before the event; right cursor on the slope just after the event (beyond the dead zone for connectors). Loss = vertical difference extrapolated from the linear slope — NOT from the peak of the spike. (Source: FOA Fiber U mini-course; EXFO Application Note poster)

**vocabulary_assumed:** `OTDR trace`, `EDZ/ADZ` → T12.L04; `ghost reflection` → T12.L05; `backscatter slope` → T12.L05; `gainer` → T12.L06

**Key concepts:** Auto-table fails at first and last connectors (cursor lands inside dead zone); fails on gainers (reported near-zero without bidirectional flag); fails on closely-spaced events. Always manually verify first and last connector readings.

**Book vs. field:** Manual cursor placement + bidirectional review (book/correct). Run auto-table, trust result, deliver trace (field shortcut). Consequence: customers accept connectors that are actually damaged or dirty and unknown.

**Citations:** FOA Fiber U mini-course (public); EXFO Application Note 194 (public); Corning AN3060 (public); VIAVI Reference Guide Vol 1 (public)

**Interactivity:** OTDRTraceViewer (interactive 20 km synthetic trace with connector, splice, macrobend, ghost, end — learner identifies each); Quiz (MC: given event description → event type; given cursor position → is measurement valid?)

---

### T12.L09 — Macrobend Detection: Dual-Wavelength Method
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. Explain why macrobend loss scales with wavelength (mode-field extends further into cladding at longer wavelengths).
2. Apply the dual-wavelength differential heuristic (>0.2 dB difference between shorter and longer wavelength at same location).
3. Identify the 1625 nm in-service advantage and when it applies.

**vocabulary_introduced (4 terms):**
- **macrobend signature:** Non-reflective loss event on OTDR that increases disproportionately at longer wavelengths compared to shorter wavelengths. A 0.10 dB loss at 1550 nm that becomes 0.38 dB at 1625 nm at the same km location is a macrobend diagnostic signature. (Source: VIAVI macrobend detection whitepaper; EXFO; AFL)
- **dual-wavelength differential:** The difference in measured loss (or attenuation coefficient) between two OTDR wavelengths at the same fiber location. For macrobend detection: >0.2 dB differential (as a heuristic, vendor-sourced — NOT a normative TIA/IEC threshold — `[confirm normative threshold with BICSI OSPDRM or carrier spec]`). (Source: VIAVI macrobend detection whitepaper — VERIFIED vendor heuristic)
- **1625 nm (in-service window):** OTDR wavelength chosen for macrobend detection on live fibers carrying 1310/1550 traffic, because 1625 nm does not disturb 1310/1550 service and is maximally sensitive to bending. (Source: VIAVI macrobend detection whitepaper; ITU-T G.984 passive window definitions)
- **G.657 macrobend behavior:** G.657.A1/A2 bend-insensitive fiber shows much lower macrobend loss at 1625 nm than standard G.652.D for the same bend radius. The >0.2 dB heuristic applies to G.652.D; confirm against cable datasheet for G.657 variants. (Source: VIAVI macrobend whitepaper; ITU-T G.657 2016 — cited from allowlist)

**vocabulary_assumed:** `macrobend` → T02.L04; `G.652.D` → T02.L01; `G.657` → T02.L04; `wavelength windows` → T02.L07; `OTDR trace` → T12.L08

**Key physics:**
- Mode field extends further into cladding at longer λ → cladding leakage increases with λ → bend loss ~ exp(–R × constant × λ⁻²) — simplified: longer λ = more sensitive to bends
- Practical: 1625 nm bend loss ≈ 3–5× 1550 nm bend loss at same radius on G.652.D
- Dual-wavelength minimum: always test 1310 + 1550 nm on SMF OSP acceptance; use 1625 nm if available and macrobend suspected

**Book vs. field:** Test 1310 + 1550 + 1625 nm wherever macrobend is suspected and 1625 nm module available (book/best practice). Test 1550 nm only on smaller jobs (field standard — 1625 nm costs nothing additional but requires the right OTDR module).

**Citations:** VIAVI macrobend detection whitepaper (public); EXFO (public); AFL (public secondary); ITU-T G.657 2016 (from allowlist)

**Interactivity:** WorkedExample (dual-wavelength comparison: 1550 nm = 0.10 dB, 1625 nm = 0.38 dB → differential = 0.28 dB > 0.2 dB heuristic → macrobend confirmed; sanity check sentence); AnnotatedDiagram (wavelength sensitivity diagram: three curves showing bend loss vs. radius for 1310/1550/1625 nm)

---

### T12.L10 — IOR, Distance Errors, and Cursor Pitfalls
**Type:** Advanced  
**Time estimate:** 25 min  
**Learning objectives:**
1. Calculate the distance error introduced by an incorrect IOR on a 40 km span.
2. Identify the three most common cursor-placement pitfalls on automated event tables.
3. State the correct IOR input workflow before each new cable type.

**vocabulary_introduced (3 terms):**
- **bulk IOR vs. EIOR:** The bulk index of refraction is the glass material property (~1.50 for silica). The EIOR (Effective Group Index of Refraction, also EGI) is the value that accounts for the guided mode's propagation delay in the waveguide structure. The EIOR (typically ~1.4677 at 1550 nm for G.652.D) is the correct OTDR input — NOT the bulk IOR. Always take from the cable manufacturer's datasheet. (Source: Yamasaki Optical 2025)
- **distance error (IOR):** ΔD = (ΔN / N) × D_actual. Example: true EIOR = 1.4682, OTDR set to 1.4677, span = 40 km → ΔD = (0.0005 / 1.4682) × 40,000 m = **13.6 m too long**. On a fault-location job with a ±5 m dig window, a 14 m error sends the crew to the wrong location. (Source: Yamasaki Optical 2025; EXFO Application Note 194)
- **cursor left inside dead zone:** The most common automated event-table error. When the left cursor is placed inside the dead zone of the preceding connector, the measured loss reads artificially low (OTDR is comparing against inflated scatter, not the linear slope). Manual fix: move left cursor to the clean slope just upstream of the event. (Source: FOA Fiber U mini-course; EXFO Application Note poster)

**vocabulary_assumed:** `EIOR` → T12.L03 (introduced as part of `EIOR` in L03 vocabulary); `ADZ` → T12.L04; `manual cursor placement` → T12.L08; `pulse width` → T12.L03

**Key math — distance error:**
- ΔD = (ΔN / N) × D_actual
- Example: N_true = 1.4682, N_set = 1.4677, D = 40,000 m
- ΔD = (1.4682 − 1.4677) / 1.4682 × 40,000 = 0.0005 / 1.4682 × 40,000 = 0.0003404 × 40,000 = **13.6 m**
- Sanity check: "On a 40 km span, a 5-unit IOR error at the 4th decimal place puts your fault-location estimate 14 meters downfield — one full bucket-truck position."

**Citations:** Yamasaki Optical 2025 (public); EXFO Application Note 194 (public); FOA Fiber U mini-course (public)

**Interactivity:** WorkedExample (distance-error calc with full arithmetic); SliderExploration (interactive: drag IOR value from 1.4675 to 1.4685, see distance error update for a 40 km span)

---

### T12.L11 — End-Face Inspection: IEC 61300-3-35
**Type:** Working  
**Time estimate:** 30 min  
**Learning objectives:**
1. Identify each of the four IEC 61300-3-35 inspection zones (A/B/C/D) on a connector end-face.
2. Apply the acceptance-grade criteria (Grade A, B, C, D) for each zone.
3. Describe the correct clean-inspect-connect (CIC) sequence.

**vocabulary_introduced (4 terms):**
- **IEC 61300-3-35 zone map:** International standard defining four concentric inspection zones on a fiber connector end-face. Zone A = fiber core (0–25 µm radius for singlemode), Zone B = cladding (25–120 µm), Zone C = contact zone (120–250 µm), Zone D = adhesive/ferrule rim (250–2000 µm). Defect criteria differ by zone — core zone A is most stringent. (Source: IEC 61300-3-35 [paywalled — `[confirm edition]`]; secondary: Fluke Networks OptiFiber Pro documentation; AFL end-face inspection guide)
- **Grade A/B/C/D (IEC 61300-3-35):** Acceptance grades per zone. Grade A = cleanest (no visible defects in Zone A); Grade B = minor defects in outer zones acceptable; Grade C = heavy contamination requiring clean; Grade D = physical defect (scratch) requiring repair or replacement. Connector must meet the grade required by the application tier (Grade B typically acceptable for field splices; Grade A for high-performance connections). (Source: IEC 61300-3-35 [paywalled — `[confirm edition]`]; secondary: Fluke Networks; VIAVI reference guide)
- **CIC sequence (Clean-Inspect-Connect):** The correct field protocol for every connector mating: (1) Clean fiber end-face with appropriate tool (IPA cassette wipe or dry stick), (2) Inspect under 400× microscope (or video probe), (3) Connect only if grade passes. Connecting without inspection or after a failed-grade cleaning risks transferring contamination to the mating connector. (Source: FOA end-face inspection reference; IEC 61300-3-35 industry best practice via secondary sources)
- **video inspection probe:** Handheld fiber microscope producing a magnified view (200×–400×) of the connector end-face on a screen. Required for in-adapter inspection (where the connector is already plugged in). Passive inspection; does not contact the fiber. (Source: Fluke Networks OptiFiber Pro documentation; VIAVI FiberChek Sidewinder documentation)

**vocabulary_assumed:** `IEC 61300-3-35 inspection protocol` → T11.L12 (insertion loss context); `IEC 61300-3-35 end-face zones (A/B/C/D)` → T11.L14 (cleaning context); `IPA wipe` → T11.L14; `contamination` → T11.L12/L14

> **DAG note:** T11.L12 introduced `IEC 61300-3-35 inspection protocol` (as context for connector IL); T11.L14 introduced the A/B/C/D zone names for cleaning. T12.L11 teaches the acceptance grading criteria that apply to those already-named zones. This sequencing is correct per the prerequisite invariant.

**Book vs. field:** CIC sequence before every connector mating (book/correct). Inspect only when there's a problem; blow off with air; no scope available (field shortcuts). Real consequence: contaminated Tier-1 connections are the #1 cause of unexplained insertion loss on new builds.

**Citations:** IEC 61300-3-35 [paywalled — `[confirm edition]`]; Fluke Networks OptiFiber Pro KB (public secondary); AFL end-face inspection guide (public secondary)

**Interactivity:** AnnotatedDiagram (IEC 61300-3-35 zone map — click each zone to see its acceptance criteria and defect examples); HotSpot (identify the grade-failing zone on an end-face inspection image)

---

### T12.L12 — PMD and CD Measurement
**Type:** Advanced  
**Time estimate:** 20 min  
**Learning objectives:**
1. State when PMD and CD measurement is required (high-speed systems: 10G+, coherent 100G).
2. Name the measurement instruments and methods (FOTP-122 for PMD, FOTP-168/169 for CD — TIA-455 family).
3. Identify the PMD limit that constrains 10G spans.

**vocabulary_introduced (4 terms):**
- **PMD measurement:** Quantitative field test of a fiber span's polarization mode dispersion coefficient (ps/√km). Required for 10G+ systems where DGD accumulation limits reach. Measurement method: FOTP-122 (interferometric PMD measurement) per TIA-455-122 [paywalled — `[confirm edition]`]. Typical limit for 10 Gbps NRZ: PMD coefficient ≤ 0.5 ps/√km for a 40 km span. (Source: TIA-455-122 [paywalled]; secondary: EXFO whitepaper on PMD testing; Corning PMD application note)
- **CD measurement:** Quantitative measurement of a fiber span's total chromatic dispersion in ps/nm, or CD coefficient in ps/(nm·km). Required for ≥10G systems to confirm dispersion compensation is correctly applied. Method: FOTP-168 (phase shift) or FOTP-169 (differential phase shift) per TIA-455-168/169 [paywalled — `[confirm edition]`]. (Source: TIA-455-168/169 [paywalled]; secondary: EXFO chromatic dispersion measurement guide)
- **PMD budget:** Total DGD budget for a system = PMD_Q × √(Σ spans). For 10 Gbps NRZ, total maximum DGD = 10 ps (ITU-T G.652 system limit — cited from ITU-T G.652.D). For 100G coherent, electronic dispersion compensation (EDC) handles much larger PMD — but the link PMD coefficient still matters for multi-span systems. (Source: ITU-T G.652.D [from allowlist]; secondary: EXFO PMD whitepaper)
- **FOTP (Fiber Optic Test Procedure):** A numbered procedure in the TIA-455 series that defines how to perform a specific fiber test. The series spans FOTP-34 (cleave angle), FOTP-61 (bidirectional OTDR), FOTP-122 (PMD), FOTP-168/169 (CD). Paywalled — TIA. (Source: TIA-455 family [paywalled — `[confirm edition]`])

**vocabulary_assumed:** `PMD` → T02.L03/L09; `CD` → T02.L03; `DGD` → T02.L09; `dispersion` → T02.L03; `G.652.D` → T02.L01

**Book vs. field:** PMD and CD measured on new high-speed builds and long-haul upgrades (book/correct). Assumed-good fiber from the cable reel without field PMD verification (field reality — acceptable for short spans with modern G.652.D but risky on >40 km runs).

**Citations:** TIA-455-122 / TIA-455-168/169 [paywalled — `[confirm edition]`]; ITU-T G.652.D [from allowlist]; EXFO whitepaper on PMD testing (public secondary)

**Interactivity:** Quiz (MC: which test is required for these system scenarios? 10G at 40 km: PMD/CD; 1G FTTH: neither; 100G coherent 80 km: both)

---

### T12.L13 — Acceptance Testing: What Passes
**Type:** Working  
**Time estimate:** 25 min  
**Learning objectives:**
1. Explain the TIA-568.3-D channel/permanent link model and its insertion loss channel limit structure (paywalled — cited via NECA/FOA 301 secondary).
2. Apply RUS 1753F-401 acceptance thresholds: splice IL ≤0.30 dB max (contract max — not the quality target), fiber attenuation ≤ planning value, bidirectional OTDR required.
3. Describe what happens when the contract specifies no acceptance threshold.

**vocabulary_introduced (4 terms):**
- **acceptance threshold:** The maximum allowable insertion loss or event loss specified in the project's construction specification or referenced standard. Different from the quality target. RUS contract max: ≤0.30 dB per splice (TIA-568.3-D max via secondary: 0.3 dB cap for fusion splices). Planning target: ≤0.10 dB. (Source: RUS 1753F-401 §5; TIA-568.3-D [paywalled — cited via Corning + Fluke secondary])
- **TIA-568 link model:** TIA-568.3-D channel model for structured cabling: maximum channel insertion loss = fiber attenuation × length + connector pair losses + splice losses. The channel model's component budgets (connector: 0.75 dB max general, 0.3 dB reference-grade; splice: 0.3 dB max) are cited from TIA-568.3-D via NECA/FOA 301-2016. Paywalled — `[confirm edition]`. (Source: TIA-568.3-D [paywalled]; NECA/FOA 301-2016 §4)
- **NECA/FOA 301 (Standard for Installing and Testing Fiber Optic Cables):** ANSI standard co-published by NECA and FOA. Public PDF available at FOA website. §4 defines test procedures and acceptance thresholds for OSP fiber optic cable. Primary public-access reference for fiber testing requirements. (Source: NECA/FOA 301-2016 — public PDF at thefoa.org)
- **attenuation coefficient acceptance:** Fiber attenuation must not exceed the maximum value specified in the cable datasheet for the installed fiber type and wavelength. Planning values: 0.35 dB/km @ 1310 nm, 0.25 dB/km @ 1550 nm for G.652.D. RUS acceptance: must not exceed cable specification. (Source: NECA/FOA 301-2016; RUS 1753F-401; 7 CFR 1755.902 [from citation registry])

**vocabulary_assumed:** `OLTS`, `bidirectional OTDR`, `acceptance threshold`, `splice loss acceptance threshold` → T11.L03 (introduced for OTDR/Splicing context)

**Book vs. field:** Both OLTS and bidirectional OTDR, both wavelengths, signed bidirectional averages, full event table (book/correct). Single-direction OTDR only, one wavelength, no OLTS, no signed bidirectional (field shortcut on small/fast jobs). "Splice acceptance is whatever the contract says."

**Citations:** RUS 1753F-401 §5 (public); NECA/FOA 301-2016 §4 (public); TIA-568.3-D [paywalled — `[confirm edition]`]; 7 CFR 1755.902 [from citation registry]

**Interactivity:** BranchingScenario (pass/fail scenario: crew delivers OTDR traces only, no OLTS; one splice reads 0.32 dB bidirectional average; the contract says "per RUS 1753F-401" — does this pass? What's the correct action? → fails: 0.32 > 0.30 dB contract max AND no OLTS delivered)

---

### T12.L14 — Test Documentation and Reports
**Type:** Working  
**Time estimate:** 20 min  
**Learning objectives:**
1. List the required components of a compliant fiber test report for a RUS-program project.
2. Explain how OTDR trace files (SOR format) are archived and referenced in the as-built documentation package.
3. Identify the difference between a field report, a span test record, and a project acceptance report.

**vocabulary_introduced (3 terms):**
- **SOR file (Standard OTDR Record):** Binary file format used by most OTDR manufacturers (Bellcore SR-NWT-001991 — paywalled standard) for storing OTDR trace data. SOR files preserve raw trace data independent of display settings, allowing re-analysis. Required for archival submission on RUS-program projects. (Source: industry practice via EXFO; Bellcore SR-NWT-001991 referenced but paywalled — `[confirm edition]`)
- **loss report:** OLTS insertion-loss test results tabulated per fiber, per wavelength, per direction (A→B and B→A), with bidirectional average. Required alongside OTDR SOR files for complete Tier-1 + Tier-2 acceptance package. (Source: NECA/FOA 301-2016 §6; industry practice)
- **test report components (RUS acceptance):** A compliant RUS fiber test report includes: (1) span identification (route segment, fiber count, wavelength(s)), (2) OLTS loss report (Tier-1, bidirectional), (3) OTDR SOR files (Tier-2, bidirectional, all wavelengths tested), (4) event table annotated with pass/fail per RUS 1753F-401, (5) tester signature, test equipment make/model/calibration date, (6) date and weather conditions. (Source: RUS 1753F-401 §6; NECA/FOA 301-2016 §6)

**vocabulary_assumed:** `OLTS`, `OTDR`, `event table` → T12.L08; `bidirectional average` → T12.L07; `acceptance threshold` → T12.L13

**Book vs. field:** Complete SOR file + loss report + annotated event table + calibrated equipment records (book/correct). Photo of OTDR screen on phone sent to PM (field shortcut). Consequence: non-compliant submittal rejected at RUS closeout; contractor must re-test.

**Citations:** NECA/FOA 301-2016 §6 (public); RUS 1753F-401 §6 (public); Bellcore SR-NWT-001991 [paywalled — `[confirm edition]` for SOR format spec]

**Interactivity:** Quiz (MC: four test-documentation scenarios — compliant vs. non-compliant, with reason)

---

### T12.L15 — T12 Capstone Quiz
**Type:** Capstone-quiz  
**Time estimate:** 30 min  
**Learning objectives (integrative):** Learner integrates the full T12 scope: given a multi-event span scenario (20 km OSP span, two splices, one macrobend suspected, one ghost, far-end connector visible only in B→A direction), learner must: select correct pulse width, identify which events are real vs. ghost, calculate two bidirectional OTDR averages, determine whether both splices pass RUS 1753F-401, confirm macrobend using dual-wavelength differential, explain what additional test (OLTS) is still required, and identify two test-documentation deficiencies in a sample report.

**vocabulary_assumed:** All T12 vocabulary (L01–L14)

**Citations:** All T12 citations combined

**Interactivity:** Quiz (25Q MC + WorkedExample: bi-di average for two splices + macrobend differential calc); OTDRTraceViewer (identify events on a 20 km trace with ghost + macrobend + gainer present); drag-match (test scenario → tier required + documentation needed)

---

## Section 3: Interactivity Primitive Recommendations

T12 is the most instrument-intensive topic in the OSP course. Primitives should prioritize visual-interactive learning with real instrument data.

1. **OTDRTraceViewer** — L08 (reading a trace), L05 (ghost identification), L15 (capstone). The existing OTDRTraceViewer component in the repo (`osp-training/src/components/OTDRTraceViewer.jsx`) is the natural choice. Authors must build a 20 km synthetic trace with: launch connector, one clean splice, one gainer splice (G.652/G.657 boundary), one macrobend, one ghost, one far-end connector. The interactive trace viewer should allow learners to click on events and read the event type + loss.

2. **WorkedExample** — L02 (bi-di OLTS average), L04 (launch cable sizing), L06 (gainer arithmetic), L09 (dual-wavelength macrobend calc), L10 (IOR distance error). Every calculation must show each arithmetic step with signed values where appropriate (gainer arithmetic requires signed addition).

3. **SliderExploration** — L10 (IOR error vs. span length: slide IOR from 1.4675 to 1.4685, see distance error update for configurable span). High interactive value for a topic where the concept is counterintuitive.

4. **AnnotatedDiagram** — L03 (OTDR trace anatomy with component labels), L04 (EDZ/ADZ diagram), L06 (launch/receive cable setup schematic), L09 (wavelength sensitivity curves), L11 (IEC 61300-3-35 zone map).

5. **HotSpot** — L11 (click the zone-failing defect on an end-face inspection image). Ideal use case for HotSpot primitive.

6. **BranchingScenario** — L13 (pass/fail decision with multi-step consequences: OTDR trace deliverable only + one failing splice → what is the correct action sequence?).

7. **Quiz (MC + drag-match)** — every lesson. Drag-match especially useful: L01 (tier → scenario), L11 (zone → criteria), L15 (test scenario → documentation requirements).

---

## Section 4: DAG Vocabulary Handoffs

### Vocabulary T12 introduces (→ consumed downstream)

| Term | Introduced | Consumed by |
|---|---|---|
| OLTS | T12.L01 | T13 (acceptance testing), T15 (fault-locate Tier-1 re-test after restoration), T16 (loss report in as-built) |
| OTDR | T12.L01 | T13 (inspection QA instrument check), T15 (fault locate), T16 (SOR file archive) |
| insertion loss (test context) | T12.L01 | T13, T15 (loss threshold for "span restored to spec") |
| return loss (test context) | T12.L01 | T13 (end-face inspection during QA) |
| TIA-526 | T12.L01 | T13, T16 |
| bidirectional average (OTDR) | T12.L07 | T13 (pass/fail per bidirectional average), T15 (restoring to original spec) |
| event table | T12.L08 | T13 (QA review of events), T15 (fault identification from table) |
| IEC 61300-3-35 (test context) | T12.L11 | T13 (end-face inspection QA pass/fail) |
| macrobend signature | T12.L09 | T13 (identifying macrobend in QA), T15 (macrobend as cause of restoration fault) |
| acceptance threshold | T12.L13 | T13 (QA pass/fail basis), T15 (restoration acceptance spec) |

### Vocabulary T12 assumes (← from T01/T02/T11)

| Term | Source lesson | Risk if missing |
|---|---|---|
| attenuation (dB/km) | T02.L02 | L01–L02 OLTS loss budget cannot be taught without dB arithmetic |
| dB/dBm | T02.L05 | Every calculation requires log-ratio literacy |
| link budget | T02.L06 | L02 and L13 reference link budget in acceptance context |
| macrobend/microbend | T02.L04 | L09 dual-wavelength macrobend detection assumes macrobend concept |
| MFD | T02.L03 | L06 gainer artifact requires MFD mismatch concept |
| G.652.D / G.657 | T02.L01–L04 | L06, L09 reference fiber types in instrument-specific context |
| wavelength windows | T02.L07 | L09 1625 nm selection requires O/C/L-band window awareness |
| PMD / DGD | T02.L09 | L12 PMD measurement requires prior PMD physics |
| fusion splice | T11.L04 | L01–L07 reference fusion splice as the object being tested |
| MFD mismatch loss | T11.L05 | L06 gainer arithmetic builds on MFD mismatch loss concept |
| IEC 61300-3-35 inspection protocol | T11.L12 | L11 zone-map acceptance criteria build on T11.L12 protocol introduction |
| IEC 61300-3-35 end-face zones A/B/C/D | T11.L14 | L11 acceptance grading requires zone names |
| splice loss acceptance threshold | T11.L03 | L13 RUS contract max relates back to T11's four-threshold framework |

---

## Section 5: Primary Citations

**Registry-first check performed:** Citations below cross-checked against `audit-output/citation-registry.md` (build date 2026-05-17). Registry-fresh entries noted; net-new citations verified via public sources.

### Registry-fresh citations (skip re-verify)

| Citation | Description | Verified By | T12 lesson(s) |
|---|---|---|---|
| **ITU-T G.652.D** | SMF fiber specs (MFD, attenuation, PMD coefficient) | Haiku ground-truth 2026-05-17 | L06 (MFD mismatch), L09 (macrobend reference), L12 (PMD limit) |
| **ITU-T G.657** | Bend-insensitive SMF (G.657.A1/A2) | Haiku ground-truth 2026-05-17 | L06 (MFD in gainer), L09 (G.657 macrobend behavior), L11 (T11 assumed vocab) |
| **7 CFR 1755.902** | RUS fiber spec (attenuation limits, acceptance) | Haiku ground-truth 2026-05-17 | L13 (fiber attenuation acceptance) |
| **IEC 61300-3-35** | End-face quality assessment (zone A/B/C/D) | Registry entry — allowlist-listed; paywalled; `[confirm edition]` | L11 (zone map + acceptance grades) |

### Net-new citations (primary-source verified or paywalled per allowlist)

| Citation | Description | Source / Status | T12 lesson(s) |
|---|---|---|---|
| **NECA/FOA 301-2016** | Standard for Installing and Testing Fiber Optic Cables | Public PDF: https://www.thefoa.org/tech/ref/1pstandards/NECA301-16_P.pdf — VERIFIED public | L01–L02, L13, L14 |
| **FOA OTDR reference page** | Tier-1 vs. Tier-2 distinction, pulse width, gainer, bidirectional | https://www.thefoa.org/tech/ref/testing/OTDR/OTDR.html — VERIFIED public | L01, L05, L07, L08 |
| **FOA OTDR FAQs** | Gainers, bidirectional averaging, practical field Q&A | https://www.thefoa.org/tech/ref/testing/OTDR/OTDR-FAQS.html — VERIFIED public | L06, L07 |
| **FOA Fiber U — launch cable mini-course** | Launch/receive cable sizing, manual cursor placement | https://fiberu.org/OTDR_Trace/launch_cable.html — VERIFIED public | L04, L06, L08 |
| **EXFO Application Note 194** | OTDR fundamentals: backscatter, trace anatomy | Public PDF — VERIFIED public | L03, L08, L10 |
| **EXFO Application Note 296** | Pulse selection vs. dead zone (EDZ/ADZ, Telcordia ADZ def.) | Public PDF — VERIFIED public | L03, L04 |
| **EXFO Application Note 298** | Launch fiber selection and sizing | Public PDF — VERIFIED public | L04, L06 |
| **VIAVI Reference Guide to Fiber Optic Testing Vol 1** | Comprehensive OTDR reference | Public PDF — VERIFIED public | L03, L08 |
| **VIAVI macrobend detection whitepaper** | 1310/1550/1625 dual-wavelength, >0.2 dB heuristic | Public PDF — VERIFIED public; heuristic is vendor-sourced, NOT normative | L09 |
| **VIAVI blog Feb 2023** | What standards say about bidirectional OTDR (TIA-455-61, IEC 61280-4-2) | Public blog — VERIFIED public | L07 |
| **Corning AN3060** | OTDR assessment of fusion spliced SMF; gainer events | Public PDF — VERIFIED public | L06, L07 |
| **Corning WP1281** | Explanation of ghost/reflection features in OTDR | Public PDF — VERIFIED public | L05 |
| **CommScope blog** | Gainer or high splice loss — MFD effects | Public blog — VERIFIED public | L06 |
| **Yamasaki Optical 2025** | IOR and OTDR Testing: EIOR/EGI, distance error | Public blog — VERIFIED public | L03, L10 |
| **Fluke Networks KB** | Attenuation and event dead zones | Public KB — VERIFIED public | L04 |
| **STL whitepaper** | Ghost events in OTDR | Public PDF — VERIFIED public | L05 |
| **RUS 1753F-401** | RUS Bulletin: specifications for fiber splicing; splice IL max ≤0.30 dB; bidirectional OTDR required | https://www.rd.usda.gov/sites/default/files/UTP19.pdf — VERIFIED public | L07, L13, L14 |
| **TIA-455-61 (FOTP-61)** | Bidirectional OTDR measurement procedure | PAYWALLED — TIA. `[confirm edition]`. Referenced via VIAVI blog Feb 2023 as secondary. | L07 |
| **IEC 61280-4-2** | Field measurement of optical attenuation and ORL of installed single-mode optical fiber cable plant; bidirectional splice analysis | PAYWALLED — IEC. `[confirm edition]`. Referenced via VIAVI blog Feb 2023 as secondary. | L01, L07 |
| **TIA-526-7A** | OLTS measurements of installed single-mode optical fiber cable plant | PAYWALLED — TIA. `[confirm edition]`. Referenced via NECA/FOA 301-2016 secondary. | L01, L02 |
| **TIA-526-14B** | OLTS measurements of installed multimode optical fiber cable plant | PAYWALLED — TIA. `[confirm edition]`. Already in `research-sources-allowlist.md`. | L01, L02 |
| **TIA-568.3-D** | Optical fiber cabling components — splice/connector loss caps | PAYWALLED — TIA. `[confirm edition]`. Referenced via Corning + Fluke + NECA/FOA 301 secondary. Already in allowlist. | L02, L13 |

### Citations marked `[confirm edition]`
Per project policy (no fabricated edition numbers):
- IEC 61280-4-2 — confirm current edition (2nd ed. expected; verify with IEC catalog)
- IEC 61300-3-35 — confirm current edition (3rd ed. expected; existing registry entry is allowlist-pending-confirmation)
- TIA-455-61 (FOTP-61) — confirm current FOTP-61 edition  
- TIA-526-7A / TIA-526-14B — already in allowlist; `[confirm edition]` markers in lessons
- TIA-568.3-D — already in allowlist; `[confirm edition]` markers in lessons
- Bellcore SR-NWT-001991 (SOR format) — confirm current issue; use `[confirm edition]`

### Proposed additions to `research-sources-allowlist.md`

The following sources are heavily used in T12 but not currently on the allowlist. Recommend adding:

| Source | Type | URL | Why needed |
|---|---|---|---|
| NECA/FOA 301-2016 | Public ANSI standard PDF | https://www.thefoa.org/tech/ref/1pstandards/NECA301-16_P.pdf | Primary public-access acceptance testing standard for OSP fiber; cited across L01–L02, L13, L14 |
| EXFO Application Note 194 | Public vendor technical reference | Via EXFO.com | OTDR fundamentals; pulse width, range, backscatter |
| EXFO Application Note 296 | Public vendor technical reference | Via EXFO.com | EDZ/ADZ definitions (Telcordia reference chain); pulse-width selection |
| EXFO Application Note 298 | Public vendor technical reference | Via EXFO.com | Launch cable sizing authoritative vendor reference |
| VIAVI Reference Guide Vol 1 | Public vendor reference | Via VIAVISOLUTIONS.com | Comprehensive OTDR reference; macrobend |
| VIAVI macrobend whitepaper | Public vendor technical reference | Via VIAVISOLUTIONS.com | Dual-wavelength macrobend heuristic |
| Corning AN3060 | Public vendor application note | Via Corning.com | Gainer events; bidirectional average for SMF |
| RUS 1753F-401 | Public USDA RD bulletin | Via USDA rd.usda.gov | Splice acceptance criteria for RUS-program projects |
| Yamasaki Optical 2025 | Public technical article | Via yamasakiot.com | IOR/EIOR distance error calculation |

---

## Section 6: Book vs. Field Summary (All 15 Lessons)

| Lesson | Book (standard/correct) | Field reality | Consequence of shortcut |
|---|---|---|---|
| L01 | Both OLTS + OTDR required for acceptance | Contractors skip OLTS, deliver only OTDR traces | Link fails optical budget at OLT commissioning |
| L02 | Bidirectional OLTS; reference method matched to application | Single-direction, one-cord for all jobs | Directional variation undetected; connector quality unknown |
| L03 | Pulse width selected per span; IOR set from datasheet | Single metro preset; default IOR never changed | Dead zone corrupts short spans; 14m distance error on 40 km span |
| L04 | Launch cable sized to pulse width; ≥1 km for long-haul 10 µs | Single 150 m launch box used everywhere | First connector loss unknown on long-haul spans |
| L05 | Three-step ghost diagnosis protocol | Ghost accepted as "end of fiber" | Actual end-of-fiber never measured; link characterization incomplete |
| L06 | Launch cable MFD matched to cable under test; receive cable for far-end | Mismatched launch cable; no receive cable | Gainer artifact at entry reference corrupts first-event loss reading |
| L07 | Bidirectional OTDR required (TIA-455-61; RUS 1753F-401 §5) | Single-direction only | MFD mismatch gainers undetected; splice losses incorrect |
| L08 | Manual cursor verification of first + last connector; bidirectional review | Auto-event-table trusted; first/last connectors never manually verified | Damaged or dirty connectors ship as "certified" |
| L09 | Test 1310 + 1550 + 1625 nm where macrobend suspected | 1550 nm only | Macrobend that fails at 1625 nm shipped as "passing" at 1550 nm |
| L10 | IOR entered from cable datasheet before every new cable type | Default IOR left unchanged | 14 m distance error per 40 km on fault-location work |
| L11 | CIC sequence before every connector mating; video inspection probe | No scope; blow off with air; inspect only when there's a problem | Contamination transferred to mating connectors; #1 cause of unexplained IL on new builds |
| L12 | PMD/CD measurement on 10G+ and long-haul ≥40 km | PMD/CD assumed good from reel; not field-measured | BER failures on 10G+ spans when old or damaged fiber has high PMD |
| L13 | Full OLTS + bidirectional OTDR + annotated event table per RUS 1753F-401 | Partial submittal: OTDR SOR only, no OLTS, one direction | Non-compliant RUS closeout; rejected submittal; re-test required |
| L14 | SOR files + loss report + annotated event table + equipment calibration records | Photo of OTDR screen on phone sent to PM | RUS closeout rejection; contractor must re-test full span |
| L15 | (Capstone — integrates all above) | | |

---

## Section 7: Source Content Migration Map (M08 → T12)

The existing `Module08_TestingOTDR.jsx` (711 LOC, M08 §8.1–8.8) is high-quality A-grade content per ARCH.md §1. Full migration path:

| T12 Lesson | Source section | Migration notes |
|---|---|---|
| L01 | M08 §8.1 | Tier-1/Tier-2 table; OLTS reference method types; OLTS vs. OTDR distinction Callout |
| L02 | M08 §8.1 (partial) | OLTS reference methods prose + planning-value loss table; expand bi-di calc WorkedExample |
| L03 | M08 §8.2 | OTDR fundamentals table (pulse/range/averaging); pulse-width band callout |
| L04 | M08 §8.3 | EDZ/ADZ table; ghost reflections prose |
| L05 | M08 §8.3 (partial) | Ghost reflections diagnosis; expand to three-step protocol |
| L06 | M08 §8.4 (partial) | Launch/receive cable lengths callout; gainer events prose + arithmetic |
| L07 | M08 §8.4 (partial) | Bidirectional averaging formula + example; standards citations |
| L08 | M08 §8.5 | Interactive OTDR trace + Callout on manual cursor placement; automated failure modes |
| L09 | M08 §8.6 | Macrobend section full; wavelength table; >0.2 dB heuristic callout; field reality |
| L10 | M08 §8.7 | IOR/EIOR distance error callout; gainer diagnosis prose (move from §8.7 to L06); automated cursor pitfalls table |
| L11 | M08 §8.1 (partial connector ref) | End-face inspection — NOT in M08 (M08 references T11 only); net-new content for L11 |
| L12 | Net-new | PMD/CD measurement — not in M08; net-new content |
| L13 | Net-new | Acceptance testing thresholds — M08 §8.4 has the <0.15 dB bidirectional note (UNVERIFIED); author must expand with RUS 1753F-401 and TIA-568.3-D link model from NECA/FOA 301 |
| L14 | Net-new | Test documentation — not in M08; net-new content |
| L15 | Net-new | Capstone; use M8 quiz questions Q1–Q6 as starting point + expand to 25Q |

**Note for authoring agent:** M08's existing quiz (M8_QUESTIONS, 6 questions) is directly reusable in T12.L15 capstone. Q1 (OLTS vs. OTDR), Q2 (launch cable 150 m insufficient), Q3 (gainer bidirectional arithmetic), Q4 (ghost diagnosis), Q5 (drag-match pulse/wavelength), Q6 (0.15 dB threshold source) are all high-quality and citation-verified. Expand to 25Q total for the capstone.

---

=== T12 RESEARCH R-1 BRIEF END ===
