# Red Team Report — Modules 05–08
**Reviewer:** Agent C (Red Team / QA, Sonnet)
**Date:** 2026-05-08
**Scope:** Module 05 (Networking Blueprints), Module 06 (RCDD Core), Module 07 (Fiber Topology & Matrix), Module 08 (Testing: OLTS & OTDR)
**Files reviewed:** `src/modules/Module0{5,6,7,8}_*.jsx`, `src/data/module0{5,6,7,8}-flashcards.js`, `docs/research-logs/module0{5,6,7,8}-*.md`, `docs/field-vs-textbook-research.md`

---

## Section 1 — Verified (correct, sourced, no action needed)

### Module 05

- **PBB/SBB rename direction is correct.** TIA-607-D (July 2019) renamed TMGB → PBB and TGB → SBB. Module presents this correctly: old names in ER/TR contexts, new names as the current standard and exam expectation. Cross-confirmed via web search against PDU Cables Ken's Korner, ITSWired, and product vendor pages (Chatsworth, Nassau National Cable all sell "PBB" and "SBB" labeled hardware). Rename direction is accurate — TMGB becomes PBB (Primary Bonding Busbar), TGB becomes SBB (Secondary Bonding Busbar).
- **Dual-vocabulary editorial principle followed throughout.** Every TIA term is paired with its field synonym on first use. Section 5.1 explicitly contextualizes the module rename. Callout tags (field / book) used consistently.
- **90 m / 100 m horizontal rule.** Correctly stated as 90 m permanent link + 5 m work-area cord + 5 m ER cord = 100 m total channel. Tagged VERIFIED-via-secondary-source. Quiz question m5-q2 correctly identifies that a 95 m permanent link is non-conformant (exceeds 90 m limit) regardless of total channel length.
- **Busbar dimensions.** PBB: ≥6.3 mm × 100 mm; SBB: ≥6.3 mm × 50 mm; copper, non-anodized, predrilled. Consistently stated in module text, quiz, and flashcards. <300 mV electrochemical potential limit correctly flagged as an exam favorite.
- **TIA-606-D four-class model.** Class 1/2/3/4 scope correctly defined and consistent across module text, quiz, and flashcard m5-606-classes.
- **TR physical requirements.** Door 910 mm × 2,000 mm, no sill; 2,440 mm ceiling; stacking guidance. Marked VERIFIED-via-secondary-source consistently.
- **TBB 6 AWG minimum.** Correctly marked UNVERIFIED-needs-paid-doc for the length-vs-AWG table, with 6 AWG minimum sourced to NECA/BICSI 607-2011 (free PDF).
- **T568A / T568B pin table.** Colors and pair assignments are correctly reproduced. Crossover-cable warning in the field callout is accurate.

### Module 06

- **FCC Part 15 Class A / Class B distinction.** Class A = commercial, 10 m test; Class B = residential, 3 m test. Web search against 47 CFR §15.109 (eCFR) and secondary sources confirms: 10 m for Class A, 3 m for Class B. Module states "~6–10 dB more stringent" for Class B; web search confirms approximately 10 dB difference when normalized for distance, so the "6–10 dB" range in the module is slightly conservative but defensible as a range. Both the table and the Callout use this consistently.
- **UL 1479 F/T/L/W rating definitions.** F (flame passage, hours), T (unexposed-side temperature rise ≤325 °F / 181 °C above ambient), L (air/smoke leakage in cfm), W (3-ft water column for 72 hrs + fire/hose test, introduced 2004). All four correctly defined and consistent with research log §1.1 and IFC PEN2 primer / Unique Fire Stop Products sources cited.
- **UL system number first-letter codes.** W = wall, F = floor, C = floor or wall. Correct per research log. Second/third-letter mapping correctly flagged UNVERIFIED-needs-paid-doc.
- **TIA-569 power/telecom separation table.** <2 kVA → 5 in.; 2–5 kVA → 12 in.; >5 kVA → 24 in. (open, unshielded pathway). Halve when telecom in grounded metallic conduit; zero when both in separate grounded conduits. Values consistent with four independent secondary sources cited in research log (Winnie, Border States, Elliott Electric, CommScope TP-106296). Marked UNVERIFIED-needs-paid-doc for exact TIA-569-E wording. Quiz question m6-q3 (3.8 kVA → 12 in.) is arithmetically correct.
- **TBB sizing rule: 2 kcmil/ft, max 750 kcmil.** Sourced to NECA/BICSI 607-2011 and EC&M secondary source. Math example (100 ft → 200 kcmil ≈ 4/0 AWG) is correct.
- **IEEE 1100 single bonded grounding principle.** Correctly described; isolated grounds correctly flagged as prohibited. Sourced to IEEE SA abstract (free) and EC&M overview. The "isolated ground myth" Callout is pedagogically sound.
- **NEC Article 800 / 805 reorganization.** Module correctly notes 2023 NEC renamed Article 800 → 805; tells students to know both.
- **Fiber primary protection caveat.** Optical fiber strands = no primary protector required. Metallic strength members must be bonded to GES. Correctly stated in module section, quiz m6-q5, and flashcard m6-ul497-fiber.
- **Engineering Judgment (EJ) process.** Correctly described: EJ is not a UL listing; AHJ acceptance varies; call manufacturer before sealing.

### Module 07

- **TIA-598 12-color sequence.** Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua. Web search cross-confirmed against Wikipedia TIA-598-C, FOA ColCodes page, Brady, and Broadband Library — all four show the identical sequence. The sequence in `TIA598_COLORS` array (lines 508–521 of the JSX) is **correct**. Matches the sequence specified in the task brief.
- **Fiber 73 math.** 73 ÷ 12 = 6 full tubes (72 fibers), remainder 1 → Tube 7 (Red), Fiber 1 (Blue). Arithmetic is correct. Consistent in module text (Section 7.3), quiz m7-q1, and flashcard m7-fiber73.
- **Jacket colors.** Yellow = OS1/OS2; Orange = OM1/OM2; Aqua = OM3/OM4; Lime green = OM5. Correct per research log and vendor catalog confirmations.
- **Connector boot colors.** Beige = OM1, Black = OM2, Aqua = OM3/OM4, Lime green = OM5, Blue = UPC, Green = APC. Correct; APC-UPC mating warning is accurate and important.
- **Tracer stripe convention.** Module correctly notes that the tracer color is NOT standardized with the same authority as the base sequence — Corning uses black; other vendors vary. This is more cautious than many training materials.
- **No-standard-governs-splice-matrix-layout.** Correctly stated.
- **Tool verification flags.** Synchronoss Spatial Suite and ARAMIS correctly flagged ⚠ UNVERIFIED for current ownership.
- **Editorial posture.** "16 north / 6 south" anecdote correctly labeled as illustrative, sourced to Splice.me blog, not presented as a statistic.

### Module 08

- **OTDR ≠ OLTS distinction.** Correctly and repeatedly emphasized. OTDR introduces 0.05–0.20 dB systematic error per event; is not a substitute for OLTS insertion-loss measurement. Sourced to FOA and Fluke Networks.
- **<0.15 dB bidirectional splice claim is correctly flagged UNVERIFIED.** Section 8.4 Callout ("The '<0.15 dB bidirectional acceptance' threshold — source needed") is properly marked UNVERIFIED-needs-paid-doc. The claim is NOT presented as authoritative. The flashcard m8-bidi-threshold and quiz question m8-q6 both correctly present it as a common planning value that must be confirmed from the project's construction specification. This satisfies the specific requirement in the task brief.
- **Pulse width bands.** 5–30 ns (FTTH/MDU), 100–500 ns (FTTx ≤10 km), 1–3 µs (metro), 10–20 µs (long-haul). Sourced to EXFO anotes 296/298 and EXFO reference poster. Consistent across module, flashcard, and quiz.
- **Launch cable minimums.** ≥150 m (premises/FTTx), ≥500 m (metro), ≥1 km (long-haul). Sourced to EXFO anote 298 and VIAVI FAQ.
- **Ghost reflection identification.** Correct: appears at multiples of round-trip distance, no loss step, shifts with pulse width, absent from the other direction. Synthetic trace at 17.0 km (= 2 × 8.5 km connector) is a textbook-accurate example.
- **IOR / distance error.** Default n=1.4677; if true EIOR=1.4682, 40 km span reads ~14 m too long. Arithmetic confirmed (ΔN/N × distance = 0.00034 × 40,000 m ≈ 13.6 m). Sourced to Yamasaki Optical 2025.
- **Macrobend detection.** >0.2 dB differential between wavelengths = suspect macrobend. Correctly labeled as a vendor heuristic, NOT a normative TIA/IEC threshold. 1625 nm correctly described as in-service macrobend-hunting wavelength.
- **Bidirectional averaging formula.** True loss = (A→B + B→A) / 2. Correct.
- **Flashcard completeness.** Seven cards cover all key topics; all UNVERIFIED items are tagged.

---

## Section 2 — Issues Found

### BLOCKERS (ship-stopping errors or false factual claims)

**None identified.** No content makes an unverified claim without disclosure, and no factually incorrect content was found in verified claims.

---

### FIX (incorrect, misleading, or internally inconsistent — must correct before shipping)

#### FIX-M08-01 — Quiz question m8-q3: arithmetic inconsistency in explanation text

**File:** `/home/user/OSP-Design-Training/src/modules/Module08_TestingOTDR.jsx`, line 648

**Issue:** The explanation for quiz question m8-q3 contains a visible arithmetic self-correction that was left in the shipped explanation text:

> `'Bidirectional average: (0.08 + 0.28) / 2 = 0.18 dB — wait, let\'s use the example values: (−0.08 as absolute value 0.08 + 0.28) / 2 = 0.10 dB.'`

The phrase `"— wait, let's use the example values:"` reads as a draft note never cleaned up. The answer index (2) is correct — the answer "True loss = 0.10 dB; caused by MFD mismatch" is correct. The math is also correct once the absolute value of the gainer reading is used: |−0.08| + 0.28 = 0.36 / 2 = 0.18 dB — **wait**, but the answer choice says 0.10 dB, not 0.18 dB. This requires closer examination.

Actually, working through the math: if A→B = −0.08 dB (a gainer, meaning the backscatter *increases*, i.e., the reading is negative loss), the convention for bidirectional averaging uses the *absolute magnitude* of the A→B reading as 0.08 dB, giving (0.08 + 0.28) / 2 = 0.18 dB. This does NOT equal 0.10 dB.

**However**, the quiz answer choice states "True loss = 0.10 dB" and the answerIndex points to that choice. The answer "0.10 dB" would only be correct if the gainer reading were |−0.08| when interpreted differently, e.g., if the A→B loss is actually 0.08 (negative reading taken as absolute value) but the bidirectional averaging of 0.08 and 0.28 gives 0.18, not 0.10. The only way to get 0.10 dB is if A→B = −0.08 is interpreted as the *actual measured value* used in the sum: (−0.08 + 0.28) / 2 = 0.20 / 2 = 0.10 dB.

The true formula for bidirectional averaging with a gainer is: include the algebraic value (so a gainer contributes negatively): (−0.08 + 0.28) / 2 = 0.10 dB. This is consistent with the FOA and Corning guidance: you do use the signed values, not absolute values — that is the point of bidirectional averaging, because the negative "gain" and the positive "loss" cancel to give the true splice loss. **The 0.10 dB result is actually mathematically correct when using signed values.**

The explanation text first says `(0.08 + 0.28) / 2 = 0.18 dB` (using absolute values, which is wrong) and then corrects itself mid-explanation to arrive at 0.10 dB, but with confusing wording. This draft language must be cleaned up. The explanation should clearly state: True loss = (A→B + B→A) / 2 = (−0.08 + 0.28) / 2 = 0.10 dB, where the signed gainer value is included algebraically.

**Severity:** FIX — The correct answer (0.10 dB, answerIndex 2) is correct and the math is ultimately right, but the explanation text contains a visible draft correction that undermines student trust and is confusing.

**Suggested fix:** Replace the explanation text with:
> "Bidirectional average uses the signed values: (−0.08 + 0.28) / 2 = 0.20 / 2 = 0.10 dB. The negative sign in the A→B reading is the algebraic signature of the gainer; including it rather than taking the absolute value is the correct procedure and is how the bidirectional average eliminates the MFD-mismatch artifact."

---

#### FIX-M06-01 — Module 6 grounding hierarchy uses old TIA-607 names (TMGB/TGB) as primary terms without pairing to PBB/SBB

**File:** `/home/user/OSP-Design-Training/src/modules/Module06_RCDDCore.jsx`, lines 391–398, 466–467, 577–578, 591, 700, 717

**Issue:** Module 6 Section 6.5 introduces the grounding hierarchy table titled "TIA-607 hierarchy: TMGB → TBB → TGB" and uses TMGB and TGB as the primary identifiers throughout, without mentioning PBB/SBB at all in Section 6.5. This is inconsistent with:
1. Module 5's explicit treatment of the rename (PBB/SBB as the *current* TIA names).
2. The research log (module06-rcdd-core.md §1.2) which documents both TIA-607-D (using PBB/SBB as current names) and acknowledges the rename.
3. The editorial rulebook: both names should be presented, with the current standard name taught as the exam answer.

In Module 6, the Design Checklist (Section 6.7) also uses only "TMGB" and "TGB" without the PBB/SBB pairing. The quiz explanation for m6-q4 (line 700) likewise uses only TMGB/TBB/TGB. The field Callout in Section 6.5 (lines 466–467) begins "TIA-607-D specifies that the TMGB must be bonded..." — but TIA-607-D is the revision that *renamed* TMGB to PBB; this is internally contradictory.

The flashcard m6-tia607-hierarchy correctly uses only TMGB/TGB in its answer, but does not cross-reference PBB/SBB.

**Severity:** FIX — Module 6 teaches an exam cohort expecting PBB/SBB per TIA-607-D/-E, but the grounding-hierarchy section never introduces those names. A student who learned Module 5 (which correctly covers the rename) will notice the inconsistency.

**Suggested fix:** In Section 6.5, rename the table header to "TIA-607 hierarchy: PBB (TMGB) → TBB → SBB (TGB)" and add a brief note that TIA-607-D (2019) renamed TMGB → PBB and TGB → SBB, consistent with Module 5. Update the Design Checklist and quiz explanation accordingly. The field Callout on line 466 should say "PBB (formerly TMGB)" to be internally consistent.

---

### NITS (minor quality issues — fix before shipping if practical)

#### NIT-M05-01 — OM4 backbone note uses "IEEE 802.3by" — confirm standard designation

**File:** `/home/user/OSP-Design-Training/src/modules/Module05_NetworkingBlueprints.jsx`, line 212

The note says "Per IEEE 802.3by; OM4 longer than OM3 for SR" for the OM4 550 m backbone figure. IEEE 802.3by defines 25GBASE-T; the standard that defined 10GBASE-SR over OM4 at 400 m is IEEE 802.3ae (for the protocol) with TIA-568 specifying the 550 m cabling backbone. The research log says 550 m as TIA-568.1 informative guidance. The "10GBASE-SR 400 m" in the Common Application Limit column is correct per IEEE 802.3ba (not 802.3by). The standard citation in the Notes column should be reviewed; "IEEE 802.3by" is likely incorrect for this row.

**Severity:** NIT — The 550 m figure and the 400 m application limit are correct; only the standard citation in the "Notes" column needs correction.

---

#### NIT-M05-02 — Reddit deep-links still UNVERIFIED-deep-link-pending in RefList

**File:** `/home/user/OSP-Design-Training/src/modules/Module05_NetworkingBlueprints.jsx`, lines 538–540

Three forum citations remain as "UNVERIFIED-deep-link-pending" with no URL. This was a known open item in the research log (§4 item 7). Not a factual error, but the items should either be resolved with actual URLs or removed from the RefList before shipping. Having items in the reference list with no URL looks incomplete to students.

---

#### NIT-M06-02 — Module 6 FCC Part 15 "6–10 dB more stringent" — the web sources support ~10 dB

**File:** `/home/user/OSP-Design-Training/src/modules/Module06_RCDDCore.jsx`, line 262 (Table) and line 267 (Callout)

The module and flashcard state Class B is "≈ 6–10 dB more stringent than Class A." Web verification against 47 CFR §15.109 and Compliance Testing Inc. confirms the difference is approximately 10 dB when normalized for distance. The lower bound of 6 dB in the range is defensible at lower frequencies but slightly conservative. The range "6–10 dB" is not wrong, but the exam expectation (per the research log) is that students remember the key distinction; the module could be clearer that the typical answer expected on the RCDD exam is "approximately 10 dB tighter" rather than offering a range that introduces unnecessary ambiguity.

---

#### NIT-M07-01 — TDMM edition note uses vague "UNVERIFIED" — suggest stronger language

**File:** `/home/user/OSP-Design-Training/src/modules/Module07_FiberTopology.jsx`, lines 73–78

The Callout reads "whether the active cert cohort is being examined against TDMM 14th or 15th is UNVERIFIED at time of writing." This is an honest disclosure, but because it is in a student-facing Callout rather than an internal note, it may confuse students who assume the platform knows which edition is current. Consider moving this caveat to instructor notes or changing the wording to "Confirm the active exam blueprint edition with BICSI before your exam date — platform is written against OSPDRM 6th; verify TDMM edition in effect for your exam window."

---

#### NIT-M08-01 — Interactive trace viewer uses 0.22 dB/km — attenuation rate note should clarify

**File:** `/home/user/OSP-Design-Training/src/modules/Module08_TestingOTDR.jsx`, line 365

The interactive OTDR trace viewer uses `dbPerKm={0.22}` (0.22 dB/km at 1550 nm). The module planning values state 0.25 dB/km for 1550 nm design. 0.22 dB/km is a vendor-typical figure (Corning SMF-28e+ typical is ~0.18–0.20 dB/km) and lower than the planning-value teaching default. The viewer comment says it is "a teaching tool, not a calibrated instrument," which is good, but the Section 8.5 introductory text could mention that the synthetic trace uses a lower-than-planning-value attenuation rate to make events more visible, so students are not confused when they compare the trace to the 0.25 dB/km planning value taught in Section 8.1.

---

## Section 3 — Open Verification Items (paywalled or not yet confirmed)

### Module 05

| Item | Status | Source needed |
|------|--------|---------------|
| TR sizing table (10×8 / 10×9 / 10×11 ft by floor area) | UNVERIFIED-needs-paid-doc | BICSI TDMM 15th Ed. (paid) |
| TBB AWG-by-length table values | UNVERIFIED-needs-paid-doc | TIA-607-D (paid); NECA/BICSI 607-2011 is a partial proxy |
| TIA-569-E — whether 50 m / 165 ft TR placement figure persists in -E revision vs. -D | UNVERIFIED-needs-paid-doc | TIA-569-E (paid) |
| TIA-606-D mandatory identifier fields per class | UNVERIFIED-needs-paid-doc | TIA-606-D (paid) |
| TIA-568.0-E normative vs. informative scope when TIA-568.1-E also applies | UNVERIFIED-needs-paid-doc | TIA-568.0-E (paid) |
| Reddit deep-link citations (r/cabling, r/networking, r/RCDD) | UNVERIFIED-deep-link-pending | Require actual post URLs + dates |

### Module 06

| Item | Status | Source needed |
|------|--------|---------------|
| TIA-569-E exact separation table wording | UNVERIFIED-needs-paid-doc | TIA-569-E (paid) — values confirmed across 4 public secondaries |
| TIA-607-E (2022) exact clause text for 2 kcmil/ft rule | UNVERIFIED-needs-paid-doc | TIA-607-E (paid) — sizing rule confirmed via NECA/BICSI 607-2011 |
| UL 497 / 497A / 497B exact requirements | UNVERIFIED-needs-paid-doc | UL CSDS (paywalled) |
| IEEE 1100-2005 full text | UNVERIFIED-needs-paid-doc | IEEE SA (paywalled) — principle confirmed via free abstract |
| UL Fire Resistance Directory second/third-letter mapping table | UNVERIFIED-needs-paid-doc | UL Fire Resistance Directory Vol. 2A/2B (paywalled) |
| Whether NEC 2023 is the current adopted edition for the exam cohort | UNVERIFIED — jurisdiction-dependent | Confirm with BICSI exam blueprint and AHJ |

### Module 07

| Item | Status | Source needed |
|------|--------|---------------|
| ANSI/TIA-598-D full text | UNVERIFIED-needs-paid-doc | TIA store (paywalled) — 12-color sequence confirmed via 4 public secondaries |
| Synchronoss Spatial Suite current product name/ownership | UNVERIFIED — flagged ⚠ in module | Vendor confirmation needed before citing in any procurement document |
| ARAMIS current ownership (possibly Render Networks) | UNVERIFIED — flagged ⚠ in module | Vendor confirmation needed |
| BICSI TDMM edition (14th vs. 15th) vs. OSPDRM 6th for active cert cohort | UNVERIFIED | Confirm with BICSI exam blueprint at ship time |

### Module 08

| Item | Status | Source needed |
|------|--------|---------------|
| "<0.15 dB bidirectional" acceptance threshold — authoritative source | UNVERIFIED-needs-paid-doc — correctly disclosed in module | BICSI OSPDRM 6th, Telcordia GR-326, or carrier OSP construction spec |
| TIA-455-61 (FOTP-61) bidirectional OTDR procedure full text | UNVERIFIED-needs-paid-doc | TIA store (paywalled) — referenced via VIAVI 2023 secondary |
| IEC 61280-4-2 bidirectional splice analysis full text | UNVERIFIED-needs-paid-doc | IEC (paywalled) — referenced via VIAVI 2023 secondary |
| TIA-568.3-D splice/connector loss cap exact clause | UNVERIFIED-needs-paid-doc | TIA store (paywalled) — 0.3 dB cited via Corning and Fluke secondaries |

---

## Section 4 — Callout Tagging Audit

All four modules use the `<Callout kind="...">` system. Observed kinds: `book`, `field`, `verify`, `warn`. Review of tagging compliance:

| Module | Book callouts | Field callouts | Verify callouts | Warn callouts | Tagging issues |
|--------|-------------|--------------|----------------|--------------|----------------|
| 05 | 7 | 5 | 5 | 0 | None found — all verify callouts correctly flag paywalled material |
| 06 | 4 | 6 | 2 | 1 | See FIX-M06-01: the grounding-hierarchy field callout (line 466) misattributes a renamed entity |
| 07 | 3 | 5 | 1 | 0 | NIT-M07-01: TDMM edition verify callout is student-facing and slightly confusing |
| 08 | 4 | 3 | 5 | 0 | Module 8 uses verify callouts generously and correctly, including for the <0.15 dB claim |

The `warn` callout in Module 06 (isolated-ground myth, line 441) is appropriate and the only warn-kind in the set.

---

## Section 5 — Quiz Correctness Audit

### Module 05 (6 questions)

| Q | Type | Answer correctness | Issues |
|---|------|-------------------|--------|
| m5-q1 | MC | Correct — B (ER/TR) | None |
| m5-q2 | MC | Correct — B (95 m > 90 m limit, non-conformant) | None |
| m5-q3 | MC | Correct — B (PBB; TMGB was prior name) | None |
| m5-q4 | MC | Correct — C (6.3 mm × 50 mm, SBB) | None |
| m5-q5 | MC | Correct — B (Class 2 = one building, multiple TRs) | None |
| m5-q6 | Drag-drop | Correct mapping: EF=demarc, ER=MC/MDF, TR=IDF, TE=zone | None |

### Module 06 (6 questions)

| Q | Type | Answer correctness | Issues |
|---|------|-------------------|--------|
| m6-q1 | MC | Correct — B (L-rating for smoke-resistive assembly) | None |
| m6-q2 | MC | Correct — B (voids UL listing; need EJ) | None |
| m6-q3 | MC | Correct — B (3.8 kVA falls in 2–5 kVA band → 12 in.) | None |
| m6-q4 | MC | Correct — C (isolated ground is prohibited per IEEE 1100 / TIA-607) | None |
| m6-q5 | MC | Correct — D (metallic strength member bonded; fiber strands no protector) | None |
| m6-q6 | Drag-drop | Correct mapping: TIA-569=separation, UL 1479=firestop, IEEE 1100=isolated ground, FCC Pt 15=switch interference, UL 497=aerial telco entry | None |

### Module 07 (6 questions)

| Q | Type | Answer correctness | Issues |
|---|------|-------------------|--------|
| m7-q1 | MC | Correct — B (Tube 7 Red / Fiber 1 Blue) | None |
| m7-q2 | MC | Correct — C ("slate" = exam; "gray" = field; same fiber) | None |
| m7-q3 | MC | Correct — C (aqua = OM3/OM4) | None |
| m7-q4 | MC | Correct — B (splice-sheet hop-by-hop with OTDR distance sanity check) | None |
| m7-q5 | Drag-drop | Correct color/fiber-type mapping | None |
| m7-q6 | Drag-drop | Correct tool/use-case mapping | None |

### Module 08 (6 questions)

| Q | Type | Answer correctness | Issues |
|---|------|-------------------|--------|
| m8-q1 | MC | Correct — B (OLTS tier 1 was never run) | None |
| m8-q2 | MC | Correct — C (150 m insufficient for 10 µs pulse dead zone) | None |
| m8-q3 | MC | Answer index 2 is correct (0.10 dB; MFD mismatch) but **explanation has draft text** — see FIX-M08-01 | **FIX required** |
| m8-q4 | MC | Correct — B (ghost at 2× 8.5 km = 17 km) | None |
| m8-q5 | Drag-drop | Correct tool/scenario mapping | None |
| m8-q6 | MC | Correct — B (0.15 dB is a planning value; authoritative source paywalled; confirm from project spec) | None |

---

## Section 6 — Flashcard Audit

| Module | Card count | UNVERIFIED items tagged | Content correctness |
|--------|-----------|------------------------|---------------------|
| 05 | 8 | m5-tr-sizing, m5-tbb-sizing marked ⚠ UNVERIFIED-needs-paid-doc | All correct; PBB/SBB rename presented correctly |
| 06 | 8 | m6-tia569-sep, m6-ul497-fiber tagged correctly | m6-tia607-hierarchy uses TMGB/TGB names only — consistent with FIX-M06-01 |
| 07 | 8 | m7-vendor-tools-tiers flags Synchronoss and ARAMIS ⚠ UNVERIFIED | All correct; TIA-598 sequence cross-verified |
| 08 | 7 | m8-bidi-threshold correctly marked UNVERIFIED | All correct |

---

## Summary Table

| Module | BLOCKERS | FIX | NITs | Notable open verifications |
|--------|----------|-----|------|---------------------------|
| 05 | 0 | 0 | 2 | TR sizing, TBB AWG table, TIA-569-E 50 m figure (all paywalled, all tagged) |
| 06 | 0 | 1 | 1 | Grounding hierarchy needs PBB/SBB pairing (FIX-M06-01) |
| 07 | 0 | 0 | 1 | Synchronoss/ARAMIS ownership unverified (already flagged ⚠) |
| 08 | 0 | 1 | 1 | <0.15 dB bidirectional threshold confirmed UNVERIFIED and correctly disclosed |

**Total: 0 BLOCKERs, 2 FIXes, 5 NITs across modules 05–08.**
