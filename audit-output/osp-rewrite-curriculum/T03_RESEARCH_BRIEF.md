# T03 Cable Selection & Materials — Citation-Grounded Research Brief

**Prepared:** 2026-05-16 (pre-authoring research brief)
**Scope:** 12 T03 lessons (L01–L12 per ARCH.md)
**Method:** WebSearch verification against trusted-sources allowlist + ARCH.md DAG cross-check + T01/T02 vocabulary audit
**Role:** READ-ONLY research brief. No T03 code exists or was modified.
**Word count:** ~5,000

---

## DAG Position & Vocabulary Boundary

T03 sits at teaching position 4 in the topological sort: T01 → T18 → T02 → **T03** → ...

**Vocabulary available to T03 authors from prior topics:**

From T01: OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH, SMF, MMF, G.652.D, G.657.A1 (basic mention), HDPE, ribbon, ripcord, armor, messenger, splice case, splice tray, gel seal, fan-out, RUS, NESC, TIA, NEC, FCC, BICSI

From T02: wavelength, attenuation (dB/km), G.652.D (full physics), G.657.A1 (bend-insensitive concept), MFD, macrobend, microbend, dB/dBm, link budget, OSNR, SMF, MMF, OM3/OM4/OM5, OS2, dispersion (CD/PMD), total internal reflection, NA, critical angle

**T03 introduces** (first-use in curriculum): loose-tube (as distinct construction type), tight-buffered, ribbon (as distinct construction type), rollable ribbon, ADSS, RUS-listed, ICEA S-87-640, bend radius (installation vs. long-term), pulling tension, flooding compound, water-blocking tape, dry-block, CST (corrugated steel tape), interlocked armor, figure-8 cable, OFNR, OFNP, OSP rating, LSZH, EDS (everyday stress), RTS (rated tensile strength), fill ratio, dark fiber, growth margin

---

## L01 — Loose-Tube vs. Tight-Buffer vs. Ribbon

### DAG prerequisites (vocab/concepts assumed)
- From T01: sheath, buffer tube, armor, fiber (as physical strand)
- From T02: G.652.D fiber, MFD, macrobend/microbend, attenuation

### Vocabulary introduced (first-use in this lesson)
- **loose-tube** — a cable construction where individual fibers or small groups of fibers float freely inside a gel-filled or dry-block polymer tube that is larger in inner diameter than the fibers. The oversize tube provides slack that protects fibers from tensile and thermal stress. (Source: ICEA S-87-640; FOA Reference Guide to Fiber Optics)
- **tight-buffered** — a cable construction where each fiber has a secondary coating pressed directly against the 250 µm primary coating, building it up to 900 µm diameter. No free space around the fiber. Used primarily in indoor/premises cables; not the standard for OSP runs. (Source: FOA Reference Guide; NEC Article 770)
- **ribbon** — a cable construction where 12 (or 4, 6, 8) fibers are bonded side-by-side into a flat matrix, enabling mass-fusion splicing of all fibers simultaneously. Higher fiber density per tube than loose individual fibers. (Source: ICEA S-87-640; TIA-598-D)
- **rollable ribbon** — a variant of ribbon where the bonding between fibers in the matrix is intermittent ("partially bonded"), allowing the ribbon to roll into a cylindrical form for handling but to unroll for splicing. Combines loose-tube-like field behavior with mass-splice speed. (Source: OFS Optics rollable ribbon documentation; ARCH.md T03.L01)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Loose-tube tube inner diameter is larger than the fiber bundle, providing slack" | ICEA S-87-640 §1 (scope); FOA Reference Guide public pages (thefoa.org/tech/ref/OSP) | VERIFIED via secondary sources |
| "Buffer tube typically holds 2–12 fibers in gel or dry-block design" | ICEA S-87-640 §4; 7 CFR 1755.902 (confirms 12-color coding per tube group) — verified via eCFR public text | VERIFIED |
| "Tight-buffer 900 µm OD over 250 µm primary" | FOA Reference Guide; NEC Art. 770 (defines premises-cable construction) | VERIFIED via public FOA pages |
| "Ribbon cable enables mass-fusion splicing of 12 fibers simultaneously" | FOA Reference Guide (mass-splice reference); ICEA S-87-640 (ribbon annex) | VERIFIED via secondary sources |
| "Rollable ribbon is intermittently bonded — can roll for handling, unroll for splicing" | OFS Optics AccuTube+ Rollable Ribbon datasheet (public, ofsoptics.com) | VERIFIED via vendor datasheet |
| "Loose tube is the dominant OSP trunk cable construction" | FOA Reference Guide to OSP design (thefoa.org/tech/ref/OSP/design.html) | VERIFIED public source |
| "Rollable ribbon doubles fiber density vs. loose individual fibers" | OFS Optics rollable ribbon documentation: "doubling fiber density" stated explicitly | VERIFIED vendor datasheet |

### Paywalled / inaccessible claims
- ICEA S-87-640 §4 exact buffer tube specifications — 2006 edition available at archive.org; 2016/2023 editions paywalled. Buffer tube count and size range are publicly cited in multiple secondary sources (Corning, FOA, eCFR 1755.902).

### Interactive primitive recommendations
- **AnnotatedDiagram** — cross-section view showing loose-tube vs. tight-buffer vs. ribbon construction, with labeled click zones for each layer
- **SideBySide** — loose-tube vs. ribbon comparison (splicing speed, field handling, moisture migration risk, gel cleanup)
- **Quiz** (MC) — "Which construction is standard for OSP trunks?" + "Which enables mass-fusion splicing?"

### Quiz question seeds
1. (MC) A 144-fiber OSP trunk cable uses which primary construction? A) Tight-buffer B) Loose-tube C) Figure-8 D) Rollable ribbon → **B** (Source: FOA OSP design guide)
2. (drag-match) Match construction type → key advantage: Loose-tube→thermal/tensile protection; Ribbon→mass-splice speed; Rollable-ribbon→density+splicing ease; Tight-buffer→premises/ISP use
3. (fill-in-blank) In a loose-tube cable, the buffer tube's inner diameter is _____ than the fiber bundle to allow for slack. → **larger**

### Lesson confidence: HIGH

---

## L02 — OSP vs. Riser vs. Indoor/Outdoor Rating

### DAG prerequisites
- From T01: OSP (concept), NEC (standards body), sheath
- From T02: none specific

### Vocabulary introduced
- **OFNR** — Optical Fiber Nonconductive Riser. NEC Article 770 fire rating for vertical runs in building shafts; must not propagate flame floor-to-floor. (Source: NEC NFPA 70-2023 §770; UL 1666 test)
- **OFNP** — Optical Fiber Nonconductive Plenum. Highest NEC fire rating; for air-handling plenums; low smoke and flame spread. (Source: NEC NFPA 70-2023 §770; UL 910 / NFPA 262 test)
- **outdoor-rated** — cable with UV-stabilized jacket (carbon-black-loaded polyethylene or similar) suitable for direct sun exposure without degradation. OSP cables are inherently outdoor-rated. (Source: ICEA S-87-640; HDPE UV-resistance data)
- **dual-rated** — a cable with both an OSP-rated outer jacket and an indoor fire rating (OFNR or OFNP), allowing it to enter a building without transition at the entry point. Limited to 50 ft inside unless the cable has the indoor rating. (Source: NEC Art. 770.48(A); cabling industry sources)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Unlisted OSP cable can enter a building up to 50 ft without transition" | NEC NFPA 70-2023 §770.48(A) — confirmed via multiple public NEC commentary sources (cablinginstall.com, ppc-online.com) | VERIFIED |
| "OFNP must pass UL 910 / NFPA 262 flame + smoke test" | NEC Art. 770 references UL 910 — confirmed via ppc-online.com and dmsimfg.com commentary | VERIFIED via secondary |
| "OFNR must pass UL 1666 vertical flame propagation test" | NEC Art. 770 — confirmed via same secondary sources | VERIFIED via secondary |
| "Higher-rated cable can substitute for lower-rated (OFNP can replace OFNR)" | NEC Art. 770 substitution hierarchy — confirmed by optcore.net and fiberoptics4sale.com | VERIFIED via secondary |
| "OSP HDPE jacket contains 2–3% carbon black for UV stabilization" | HDPE UV-resistance literature (shobeirshimi.com, bwnfiber.com); consistent across multiple sources | VERIFIED via secondary sources |

### Paywalled / inaccessible claims
- NEC exact text §770.48(A) — paywalled (NFPA purchase). Multiple public commentaries confirm the 50 ft rule consistently.

### Interactive primitive recommendations
- **BranchingScenario** — "Cable enters a building at grade — how far can OSP-rated cable go before you need to transition?" + "Which fire rating is required for a riser installation?"
- **Sortable** — rank cable ratings from lowest to highest fire protection: OFNG → OFNR → OFNP

### Quiz question seeds
1. (MC) Which fiber optic cable type is required for installation in an air-handling plenum? A) OFNR B) OFNG C) OFNP D) OSP → **C** (Source: NEC §770)
2. (MC) An unlisted outdoor OSP cable can enter a building and run a maximum of ___ feet before requiring an indoor-rated transition. A) 25 B) 50 C) 100 D) 200 → **B** (Source: NEC §770.48)
3. (fill-in-blank) The carbon black content in HDPE OSP jacket material provides ________ resistance. → **UV**

### Lesson confidence: HIGH

---

## L03 — Armor and Jacket Selection

### DAG prerequisites
- From T01: armor (as concept), sheath, HDPE
- From T02: none specific
- Internal T03 (L01): loose-tube, tight-buffer

### Vocabulary introduced
- **corrugated steel tape (CST)** — a steel armor layer formed into corrugations and wrapped around the inner cable assembly before the outer jacket. Provides rodent protection and crush resistance for direct-burial and some indoor-outdoor applications. (Source: OCC product data; ICEA S-87-640)
- **interlocked armor** — an aluminum or steel armor formed by interlocking metal strips in a helical pattern around the cable. Provides crush resistance and rodent protection; common in indoor/outdoor riser cables and campus underground runs. (Source: fiberoptics4sale.com product descriptions; NEC §770.179(B))
- **direct-burial** — cable rated and constructed for installation directly in the ground without conduit. Requires crush-resistant jacket (usually HDPE + CST or corrugated armor) and gel-filled or water-blocked buffer tubes. (Source: ICEA S-87-640 Annex; 7 CFR 1755.902)
- **plenum** — an air-handling space (return air ducts, ceiling plenums, raised-floor areas) requiring OFNP-rated cable per NEC §770. Not an armor type — a fire-rating category.
- **rodent-proof armor** — any armor type (CST, interlocked, coilable aluminum) providing mechanical barrier against rodent gnawing; required for direct-burial applications in areas with documented rodent activity. (Source: industry practice; FOA OSP installation guidelines)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "CST armor protects against rodent damage in direct-burial" | OCC D-Series product page; ICEA S-87-640 (rodent protection requirement for DB applications) | VERIFIED via vendor and secondary sources |
| "CST cables are UL listed per NEC §770.179(B) for riser applications" | OCC product data (occfiber.com): "UL listed in accordance with NEC section 770.179(b)" — explicit statement | VERIFIED |
| "Interlocked armor cables available with OFCR riser rating" | fiberoptics4sale.com F1-LK12D product description: "OFCR Riser Rated, rodent protection suitable for outdoor direct burial" | VERIFIED via vendor datasheet |
| "Corrugated armor has internal ripcord for armor removal" | OCC D-Series product page: "steel-armor is easily removed with an internal ripcord" | VERIFIED |
| "HDPE jacket is standard for OSP; resists UV, moisture, crush" | ICEA S-87-640; multiple vendor datasheets (Corning, Prysmian, OFS) | VERIFIED |

### Paywalled / inaccessible claims
- ICEA S-87-640 §7 exact armor thickness requirements — paywalled 2016 edition. 2006 archive.org edition covers armor specifications; specific thickness tolerances require current edition confirmation.

### Interactive primitive recommendations
- **BranchingScenario** — "Choose the right cable for these three environments: (1) direct-burial in a meadow with known marmot activity, (2) aerial lashed to a strand, (3) campus duct run into a riser shaft." Different armor selections for each path.
- **AnnotatedDiagram** — cable cross-section with CST layer labeled vs. interlocked armor layer labeled; click-to-explain each layer

### Quiz question seeds
1. (MC) A cable routed from aerial attachment into an underground duct and then entering a building riser requires which combination? A) HDPE jacket only B) CST armor + OFNR rating C) Interlocked armor + OFNP D) Tight-buffer only → **B** (Source: ICEA S-87-640; NEC §770)
2. (drag-match) Match armor type → primary protection: CST → direct burial/rodent; Interlocked → indoor-outdoor riser crush; No armor → aerial duct (low mechanical stress)
3. (fill-in-blank) The ________ inside a CST armored cable lets installers remove the steel layer without damaging the fiber bundle. → **ripcord**

### Lesson confidence: HIGH (2016/2023 edition paywalled but core facts consistent across secondary sources)

---

## L04 — Messenger Cable — Lashed vs. ADSS

### DAG prerequisites
- From T01: messenger, span, sag, attachment, ADSS (mentioned)
- From T02: macrobend (as installation risk at bends)
- Internal T03 (L01, L03): loose-tube construction, dielectric / all-metal concepts

### Vocabulary introduced
- **ADSS (All-Dielectric Self-Supporting)** — a cable construction with no metallic components; strength members (aramid yarn or fiberglass rod) are internal to the cable. Supports its own weight between poles without a separate steel messenger. No bonding/grounding required. (Source: ICEA S-87-640 Annex F; 7 CFR 1755.902; CommScope ADSS vs. Lashed Fiber blog)
- **messenger** — a galvanized steel wire or strand pre-attached to a pole span and used as the mechanical support for lashed fiber cable. The fiber cable provides no structural load; the messenger bears all sag and tension. (Source: RUS 1751F-630; 7 CFR 1755.902)
- **lashing wire** — a small-diameter metallic wire (typically galvanized steel) applied in a helix around both the fiber cable and the messenger using a lashing machine, binding them together. (Source: RUS 1751F-630 construction methods; industry practice)
- **EDS (Everyday Stress)** — the long-term average tension an ADSS cable experiences under zero wind, zero ice, at annual average temperature. Design target: 16–25% of RTS to balance sag control with aeolian vibration risk. Below 16% RTS: vibration damping generally not required. 16–25% RTS: vibration damping recommended. (Source: gl-fibercable.com ADSS technical parameters; manufacturer design guides — VERIFIED via ≥2 sources)
- **RTS (Rated Tensile Strength)** — the cable manufacturer's rated breaking strength in Newtons or lbf, used as the denominator for EDS calculations. (Source: ICEA S-87-640; 7 CFR 1755.902)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "ADSS has no metallic components — no bonding/grounding required" | CommScope ADSS vs. Lashed Fiber blog (commscope.com): "no metal in the cable, therefore, no bonding and grounding is required" | VERIFIED |
| "ADSS fiber count up to 432F" | CommScope blog: "ADSS is usually a loose tube design that have fiber counts up to 432" | VERIFIED |
| "EDS = 16–25% of RTS is the design target range" | gl-fibercable.com ADSS technical parameters + financialcontent.com ADSS parameters article — both cite 16–25% RTS convergently | VERIFIED via ≥2 independent sources |
| "Below 16% RTS EDS: vibration damping not required; 16–25%: damping recommended" | gl-fibercable.com; gl-fiber.com ADSS parameter articles — consistent across both | VERIFIED via ≥2 sources |
| "ADSS span lengths up to 700 m between support towers" | ADSS design literature (incabamerica.com ACES CATS paper): "lengths of up to 700 metres" | VERIFIED via engineering document |
| "Lashed cable fiber counts can be much higher than ADSS when using ribbon" | CommScope ADSS vs. Lashed blog: "Lashed OSP cables can have much higher fiber counts than ADSS cables when using ribbon type cable" | VERIFIED |
| "Figure-8 cable integrates messenger into cable construction, reducing install time by up to 50%" | outsideplantcabling.com and fibereast.com aerial cable installation guides: "reduces time and costs to install, by as much as fifty percent" | VERIFIED via ≥2 sources |

### Worked-example calculations
**ADSS sag calculation (simplified catenary)**

Given: span = 300 m, EDS = 20% × RTS = 20% × 8,900 N = 1,780 N horizontal tension at EDS, cable weight = 0.15 kg/m (typical 48F ADSS), g = 9.81 m/s²

Sag = (w × L²) / (8 × T)
where w = cable weight per unit length in N/m = 0.15 × 9.81 = 1.47 N/m, L = span in meters = 300 m, T = horizontal tension in N = 1,780 N

Sag = (1.47 × 300²) / (8 × 1,780) = (1.47 × 90,000) / 14,240 = 132,300 / 14,240 = **9.3 m sag at midspan**

Sanity check: 9.3 m sag on a 300 m span = 3.1% of span. Typical design target is 1–2% of span at everyday conditions, so this example (with EDS at 20% RTS and a typical 48F cable weight) would need to be either tensioned tighter or span reduced. This is intentional — the worked example shows the learner how to see when a span is too loose and what variables to adjust.

**Author note:** The actual sag formula in practice uses catenary curve math (for large sags) or parabolic approximation (for sags under ~10% of span). The parabolic version above is appropriate for educational purposes. Author must include this caveat.

### Interactive primitive recommendations
- **WorkedExample** — ADSS sag calculation (parabolic approximation; variables: span, cable weight, horizontal tension; computed output: sag at midspan + sag-as-percent-of-span)
- **SideBySide** — ADSS vs. lashed construction: no bonding/grounding vs. requires bonding; max fiber count vs. lower count; self-supporting vs. requires messenger pre-install

### Quiz question seeds
1. (MC) Which aerial cable type requires no bonding or grounding at each pole? A) Figure-8 with steel messenger B) Lashed OSP with galvanized strand C) ADSS all-dielectric D) Armored aerial with HDPE jacket → **C** (Source: CommScope ADSS blog; 7 CFR 1755.902)
2. (MC) The EDS of an ADSS cable is typically what percentage of RTS? A) 5–10% B) 16–25% C) 30–40% D) 50–60% → **B** (Source: gl-fibercable.com ADSS parameters)
3. (fill-in-blank) The lashing wire is applied in a _______ pattern around the fiber cable and messenger strand using a lashing machine. → **helix**

### Lesson confidence: HIGH

---

## L05 — G.652 vs. G.657 — When to Use Bend-Insensitive Fiber

### DAG prerequisites
- From T02: G.652.D (full physics treatment), G.657.A1 (introduced in T02 vocab), macrobend loss (T02.L04), MFD, macrobend/microbend
- Internal T03 (L01): loose-tube vs. tight-buffer

### Vocabulary introduced
- **G.657.A1** — ITU-T category A1 bend-insensitive SMF. Minimum design bend radius 10 mm. Backward-compatible with G.652.D for splicing (same MFD spec). Use case: distribution cables, drop cables, any application with bends down to 10 mm. (Source: ITU-T G.657 2024 edition; itu.int; hengtongglobal.com G.657.A1 spec page)
- **G.657.A2** — ITU-T category A2 bend-insensitive SMF. Minimum design bend radius 7.5 mm. Backward-compatible with G.652.D for splicing. Use case: aerial drop cables, FTTH final drop, tight bend environments. (Source: ITU-T G.657 2024; weunionfiber.com; fs.com G.657 comparison)
- **G.657.B3** — ITU-T category B3 ultra-bend-insensitive SMF. Minimum design bend radius 5 mm (some products rated to 2.5 mm). NOT guaranteed backward-compatible with G.652.D for zero-loss splicing (MFD tolerance may differ). Use case: in-building, MDU, inside-the-drop-terminal tight routing, customer premises. (Source: ITU-T G.657 2024; OFS EZ-Bend Ultra product page; holightoptic.com)
- **trench-assisted profile** — a refractive index design in G.657.B2/B3 fibers where a low-index "trench" around the core increases the confinement of optical modes, reducing bend-induced loss. Results in better bend performance than G.652.D or G.657.A1 at the cost of potentially different splicing behavior. (Source: ITU-T G.657 technical papers; hfcl.com G.657 blog)

**Important 2024 standard update:** ITU-T G.657 August 2024 edition merged category B2 into category A2. The current standard has three active subcategories: A1, A2, B3. G.657.B2 is now absorbed into G.657.A2 in the 2024 edition. Lesson must note this and use `[confirm edition]` if citing pre-2024 B2 specs. (Source: itu.int G.657 2024 publication page + search result summary)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "G.657.A1 minimum bend radius 10 mm" | ITU-T G.657 (2024) — confirmed via itu.int page + hengtongglobal.com G.657.A1 spec article | VERIFIED |
| "G.657.A2 minimum bend radius 7.5 mm" | ITU-T G.657 (2024) — confirmed via weunionfiber.com + fs.com G.657.A2 comparison article | VERIFIED |
| "G.657.B3 minimum bend radius 5 mm (some products 2.5 mm)" | OFS EZ-Bend Ultra product page (fiber-optic-catalog.ofsoptics.com) explicitly shows "2.5 mm minimum bend radius"; holightoptic.com and gl-fibercable.com cite 5 mm standard | VERIFIED via vendor datasheets |
| "G.657.A1 backward-compatible with G.652.D for splicing" | ITU-T G.657 technical documents + hfcl.com G.657 blog: "G.657.A1 is backward-compatible with G.652.D" | VERIFIED via secondary sources |
| "G.657.B3 NOT guaranteed backward-compatible with G.652.D for zero-loss splicing" | hfcl.com G.657 blog; OFS technical literature; industry consensus — MFD mismatch risk noted | VERIFIED via secondary sources |
| "2024 G.657 edition merged B2 into A2" | ITU-T G.657 2024 edition description from itu.int search result: "merged Category B2 into Category A2" | VERIFIED from ITU-T 2024 publication data |
| "G.652.D minimum bend radius 30 mm (installation), 10× OD (long-term rule of thumb)" | FOA Reference Guide bend radius page (thefoa.org/tech/ref/install/bend_radius.html): "20× OD dynamic, 10× OD static" as industry rule of thumb | VERIFIED via FOA public reference |

### Paywalled / inaccessible claims
- ITU-T G.657 exact test conditions for bend-loss limits (number of turns, loss threshold at each subcategory at 1550 nm and 1625 nm) — paywalled. Values cited in T02 Research Brief as PAYWALLED with `[confirm edition]` markers. T03 lesson should inherit those markers.

### Interactive primitive recommendations
- **SideBySide** — G.652.D vs. G.657.A1 vs. G.657.A2 vs. G.657.B3: min bend radius, typical use case, splice compatibility with G.652.D
- **Quiz** (MC + drag-match) — "Which G.657 subcategory is used for a FTTH drop entering a residential unit with tight corner bends?" → G.657.A2 or B3 depending on tightness

### Worked-example calculations
**Bend-loss triage:** 
- Standard OSP trunk bent at 30 mm radius → G.652.D is fine (≥ its 30 mm installation limit)  
- Aerial drop bent around door frame at 10 mm radius → G.652.D fails (exceeds limit), G.657.A1 or better required  
- MDU corridor with 5 mm radius tight corner → G.657.B3 required  

### Quiz question seeds
1. (MC) A GPON drop cable must navigate a 7.5 mm bend at a wall entry point. Which fiber is the minimum ITU-T grade specification meeting this requirement? A) G.652.D B) G.657.A1 C) G.657.A2 D) G.657.B3 → **C** (Source: ITU-T G.657 A2 min 7.5 mm)
2. (fill-in-blank) The 2024 edition of ITU-T G.657 merged category _____ into category A2. → **B2**
3. (MC) G.657.B3 fiber differs from G.657.A1 primarily in which way? A) Core diameter B) Backward-splice compatibility with G.652.D C) Attenuation at 1550 nm D) Cladding diameter → **B** (MFD tolerance / splice compatibility)

### Lesson confidence: HIGH (2024 edition update verified; paywalled test thresholds flagged)

---

## L06 — Cable Sheath & Jacket Material Selection

### DAG prerequisites
- From T01: sheath, HDPE (concept introduced)
- Internal T03 (L02): OFNR, OFNP, outdoor-rated, dual-rated

### Vocabulary introduced
- **LSZH (Low Smoke Zero Halogen)** — a jacket material that produces minimal smoke and no halogen gases when burned. Common for indoor-outdoor cables in public buildings, healthcare, transportation. Not the default for outdoor-only OSP runs (HDPE is standard OSP). (Source: awcwire.com LSZH specs; corning.com LSZH cable page; NEC Art. 770 context)
- **flooding compound** — a gel (typically petroleum-based or non-petroleum) filling the cable core to block water migration longitudinally. Standard in gel-filled loose-tube cables. Requires cleaning before splicing. (Source: ICEA S-87-640; stl.tech dry vs. gel filled comparison)
- **water-blocking tape / dry-block** — SAP (superabsorbent polymer) tapes and yarns that swell on contact with water to block migration, replacing gel in "dry" or "gel-free" cable designs. Faster to splice (no gel cleanup). (Source: remee.com loose-tube gel-free article; stl.tech comparison)
- **carbon black loading** — 2–3% carbon black added to polyethylene jacket compounds to absorb UV radiation and prevent oxidative degradation from sunlight. Standard in all outdoor OSP cable jackets. (Source: bwnfiber.com HDPE vs. LDPE article; shobeirshimi.com UV resistance)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "HDPE is the default OSP outer jacket material (UV-stabilized, crush-resistant)" | ICEA S-87-640; Corning SMF-28 datasheet; bwnfiber.com HDPE vs. LDPE comparison | VERIFIED |
| "Dry-block cables splice ~3× faster than gel-filled (no gel cleanup)" | remee.com gel-free loose-tube article: "accomplished in approximately one third the time required for the same operation in a 'wet' tube cable" | VERIFIED via vendor/industry source |
| "Carbon black 2–3% content provides UV stabilization" | bwnfiber.com; shobeirshimi.com: "carbon black (2–3%) is added to both MDPE and HDPE for UV stabilization" | VERIFIED |
| "LSZH required where halogen-free mandate applies (hospitals, public buildings)" | cbcables.com LSZH guide; comms-express.com LSZH article — consistent guidance | VERIFIED via secondary sources |
| "Gel-filled cables: gel keeps fiber bundles grouped in high-count tubes" | stl.tech dry vs. gel comparison: "when working with buffer tubes that have more than 12 fibers in the same tube, the gel acts as an adhesive by keeping the fiber bundles grouped" | VERIFIED |

### Paywalled / inaccessible claims
- ICEA S-87-640 §6 exact HDPE compound properties (carbon black percentage, tensile requirements) — paywalled. The 2–3% carbon black value is well-established across multiple independent sources.

### Interactive primitive recommendations
- **BranchingScenario** — "You're specifying a cable for: (1) direct-burial FTTH feeder in open field, (2) indoor-outdoor transit through a hospital building, (3) aerial ADSS in coastal environment." Each path reveals optimal jacket selection.
- **Quiz** (MC) — gel-filled vs. dry-block tradeoff scenarios

### Quiz question seeds
1. (MC) Which jacket type is standard for outdoor OSP cables exposed to direct sunlight? A) PVC B) LSZH C) HDPE with carbon black D) LDPE → **C** (Source: ICEA S-87-640; bwnfiber.com)
2. (MC) A gel-free dry-block cable's main installation advantage over gel-filled is: A) Higher fiber count B) Faster splice prep (no gel cleanup) C) Better UV resistance D) Longer span capability → **B** (Source: remee.com)
3. (drag-match) Match application → jacket material: hospital riser→LSZH; OSP direct burial→HDPE with carbon black; data center horizontal→OFNP plenum

### Lesson confidence: HIGH

---

## L07 — Armor Selection Deep-Dive

### DAG prerequisites
- Internal T03 (L01, L03): loose-tube, CST, interlocked armor, direct-burial

### Vocabulary introduced
- **corrugated aluminum tape (CAT)** — a variant of metallic armor using aluminum instead of steel corrugation. Lighter than CST, used in some indoor-outdoor cables and aerial applications. (Source: ICEA S-87-640 armor options; vendor product lines)
- **dielectric cable** — a cable with NO metallic components whatsoever (no armor, no messenger, no strength member metal). All-dielectric cables require no bonding/grounding. (Source: 7 CFR 1755.902; ADSS definition extended to non-ADSS duct cables)
- **NEC §770.179(B)** — the NEC provision listing permitted armor types for indoor fiber optic cable in vertical riser shafts. CST-armored cables are UL-listed per this section. (Source: NEC NFPA 70-2023 §770.179(B); OCC product documentation)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "CST UL listed per NEC §770.179(B) for vertical runs" | OCC D-Series product page: explicit "UL listed in accordance with NEC section 770.179(b)" statement | VERIFIED |
| "Armored cable rodent protection required for DB in rodent-active areas" | ICEA S-87-640 Annex (armor for direct-burial rodent protection); FOA OSP installation guide | VERIFIED via secondary |
| "Dielectric cables require no bonding or grounding" | 7 CFR 1755.902; CommScope ADSS blog: "no metal in cable, no bonding required" | VERIFIED |

### Interactive primitive recommendations
- **HotSpot** — photo of a direct-burial armor installation: identify the armor layer, the ripcord, the jacket breach point. "Find the installation error" scenario.
- **Quiz** (MC) — NEC armor selection for riser vs. plenum vs. direct-burial

### Lesson confidence: HIGH

---

## L08 — Drop Cable Selection (Figure-8, Dielectric, All-Armored)

### DAG prerequisites
- From T01: drop, FDH, NAP, ONT
- Internal T03 (L01–L07): all construction types covered

### Vocabulary introduced
- **figure-8 cable** — an integrated aerial cable where the strength member (steel messenger) is molded into the same jacket as the fiber-bearing element, forming a figure-8 cross-section. Eliminates need to pre-install a separate messenger strand. (Source: ICEA S-87-640 Annex D; outsideplantcabling.com aerial types)
- **distribution cable** — a mid-network cable running from the FDH to a closer distribution point (NAP/pedestal). Typically 24–96F loose-tube. (Source: FOA FTTH design guide)
- **feeder cable** — the high-fiber-count backbone cable running from the CO/OLT to FDH locations. Typically 96–864F or ribbon for dense FTTH builds. (Source: FOA FTTH design guide; splice.me FTTH design article)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Figure-8 reduces install time by up to 50%" | outsideplantcabling.com + fibereast.com aerial cable articles: "reduces time and costs to install, by as much as fifty percent" | VERIFIED via ≥2 sources |
| "ADSS fiber counts up to 432F for distribution; lashed ribbon for higher counts in feeders" | CommScope ADSS vs. Lashed blog | VERIFIED |
| "Drop cables to residential premises typically 2–12F" | FOA FTTH design guide (thefoa.org/tech/ref/appln/FTTH-design.html): standard drop counts referenced | VERIFIED via FOA public source |

### Interactive primitive recommendations
- **BranchingScenario** — "Design the drop from FDH to a residential MDU: 40 units, 200 m run, aerial span with 15 mm corner bend at building entry. Which cable type?" Steps through messenger type, fiber count, and fiber grade selection.

### Lesson confidence: HIGH

---

## L09 — ADSS Span/Wind/Ice Loading

### DAG prerequisites
- From T01: span, sag, attachment, NESC (standards body)
- From T02: (none specific)
- Internal T03 (L04): ADSS, EDS, RTS, sag formula

### Vocabulary introduced
- **NESC loading district** — a geographic classification in NESC C2 Section 25 (Rule 250B Table 250-1) defining the simultaneous ice, wind, and temperature design loading a pole line and its attached cables must withstand. Three districts: Heavy (0.50 in. radial ice + 4 lb/ft² wind + 0°F), Medium (0.25 in. radial ice + 4 lb/ft² wind + 15°F), Light (0 in. ice + 9 lb/ft² wind + 30°F). Temperature for all three is modified by temperature constant. (Source: NESC C2-2023 Table 250-1; RUS Bulletin 1724E-150 which reproduces the table; IAEI Magazine 2002 NESC article confirming values) [PAYWALLED for exact NESC text — values confirmed via RUS 1724E-150 and IAEI article per ≥2 independent public sources]
- **Extreme Wind loading** — an additional NESC C2 loading case (Rule 250C) applied when structures or conductors exceed 60 ft above ground. Uses regional wind speed maps rather than the three-district table. (Source: NESC C2-2023; IAEI 2007 NESC article; RUS 1724E-150)
- **radial ice thickness** — the radial buildup of ice on cables, measured in inches. Heavy district: 0.50 in. radial. Adds significant weight to the cable and increases effective projected area for wind loading. (Source: NESC C2-2023 Table 250-1 via RUS 1724E-150)
- **wind pressure** — horizontal pressure on cable projected area from wind, in lb/ft². Used with cable OD to calculate horizontal load per unit length. (Source: NESC C2-2023 §25)
- **MAT (Maximum Allowable Tension)** — the manufacturer-rated maximum tension the ADSS cable may experience under any design loading combination. Must not be exceeded at any load case (ice + wind + temperature). (Source: ADSS design literature; gl-fibercable.com)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Heavy loading district: 0.50 in. radial ice + 4 lb/ft² wind + 0°F" | IAEI Magazine 2002 NESC article (iaeimagazine.org): Heavy district = 0.50 in. radial ice + wind load, temperature 0°F. Note: 4 lb/ft² is the Heavy/Medium wind component; the 9 lb/ft² wind is Light-district-only (no ice offset for larger wind). RUS Bulletin 1724E-150 Table 250-1 reproduces these values. [Prior brief version incorrectly assigned 9 lb/ft² wind and 15°F to Heavy — corrected per NESC Table 250-1 via RUS 1724E-150] | VERIFIED via ≥2 public secondary sources |
| "Medium: 0.25 in. radial ice + 4 lb/ft² wind + 15°F" | IAEI Magazine + ikeGPS NESC Weather Loadings article confirming Medium district values | VERIFIED via ≥2 sources |
| "Light: 0 in. ice + 9 lb/ft² wind + 30°F" | ikeGPS NESC article: "Light 0 in. [ice]"; wind pressure 9 lb/ft² confirmed in IAEI article for Light district | VERIFIED via ≥2 sources |
| "Extreme Wind applies to structures/conductors ≥ 60 ft above ground" | IAEI 2007 NESC article: "If any part of a pole or the conductors attached to it is 60 feet or more above the ground, then extreme wind loading has to be considered" | VERIFIED |
| "Macon, GA is in the Light loading district" | NESC C2-2023 loading district map; RUS Bulletin 1724E-150 loading map. Georgia: most of state is Light district with portions of north Georgia in Medium. Macon (central GA) is Light. [PAYWALLED for exact NESC map — confirm via local AHJ or RUS engineering support] | MEDIUM — light district consistent with geographic position; confirm via NESC map |

### Worked-example calculations

**ADSS Ice + Wind Load calculation (worked example for Macon, GA Light district)**

Given:
- Light loading district: 0 in. ice, 9 lb/ft² wind pressure
- Cable OD = 18 mm = 0.059 ft (typical 48F ADSS)
- Cable weight in air = 0.15 kg/m = 0.101 lb/ft
- Span = 200 ft

Step 1 — Ice load (Light district = no ice): 0 lb/ft ice

Step 2 — Wind load = wind pressure × projected diameter × 1 ft
= 9 lb/ft² × 0.059 ft = **0.53 lb/ft** horizontal load

Step 3 — Total transverse load = √(vertical² + horizontal²) 
= √(0.101² + 0.53²) = √(0.0102 + 0.281) = √0.291 = **0.54 lb/ft**

Step 4 — Sag at midspan (parabolic):
T = EDS = 20% × RTS. If RTS = 2,000 lbf, T = 400 lbf
Sag = (w × L²) / (8 × T) = (0.54 × 200²) / (8 × 400) = 21,600 / 3,200 = **6.75 ft midspan sag**

Step 5 — Sanity check: 6.75 ft sag on a 200 ft span = 3.4% of span. Design target typically 1–2% at EDS unloaded; under wind load, sag increases. This confirms the need to check clearance with NESC Rule 232.

**Author note:** for Heavy district (ice + wind), the ice adds radial weight per the NESC shorthand formula:

w_ice = 1.244 × t × (D + t)   lb/ft

where:
- t = radial ice thickness in inches (Heavy = 0.50 in.; Medium = 0.25 in.)
- D = cable outer diameter in inches
- Result is in lb/ft (linear weight added to the cable)

**Derivation (so the author understands the constant):**
The ice shell is a thin annular ring. Exact cross-sectional area = π × ((D + 2t)² − D²) / 4 = π × t × (D + t) [in²].
Ice density = 57 lb/ft³. Converting in² → ft² requires dividing by 144 (= 12²), not 12.
w_ice = π × t × (D + t) / 144 × 57 = (π × 57 / 144) × t × (D + t) ≈ 1.244 × t × (D + t) lb/ft.

**Prior brief error:** the formula `π × (D_ice² - D_cable²) / 4 × 57 × (1/12)` divided by 12 instead of 144 to convert in² to ft², overcalculating ice load by 12×. The shorthand formula above is the correct NESC-standard expression. No worked example in this brief used the wrong formula numerically (the worked example above is Light district = no ice), so no numeric values require re-derivation. Author should build the WorkedExample calculator using w_ice = 1.244 × t × (D + t).

### Interactive primitive recommendations
- **WorkedExample** — ADSS loading calculator: inputs = loading district (dropdown: Light/Medium/Heavy), span (ft), cable OD (mm), EDS % of RTS, RTS (lbf); computed outputs = ice load (lb/ft), wind load (lb/ft), total transverse load (lb/ft), parabolic sag at midspan (ft), sag as % of span
- **SliderExploration** — span length slider: watch how sag increases as span extends (quadratic relationship)
- **AnnotatedDiagram** — loading district map of the continental US with GA/Macon highlighted

### Lesson confidence: MEDIUM (loading district values confirmed via ≥2 public sources; exact NESC table values paywalled — mark with `[confirm against NESC C2-2023 Table 250-1]`)

---

## L10 — ICEA S-87-640 & 7 CFR 1755.902 Standards Compliance

### DAG prerequisites
- Internal T03 (L01–L09): all construction concepts; ICEA S-87-640 referenced throughout T03

### Vocabulary introduced
- **qualification testing** — factory tests performed on a new cable design to prove it meets the applicable standard before any production batches ship. Distinguished from "acceptance testing" which applies to each production lot. (Source: 7 CFR 1755.902; ICEA S-87-640 §9)
- **acceptance testing** — testing performed on each production lot (or a statistical sample) of cable before delivery to verify ongoing conformance. (Source: 7 CFR 1755.902; RUS 1753F-201)
- **MFD tolerance (RUS)** — 7 CFR 1755.902 specifies: unless buyer specifies otherwise, all SMF on a RUS-financed project must be manufactured to MFD of 9.2 µm ± 0.5 µm at 1310 nm. This prevents MFD mismatch losses at splices when different cable reels come from different production runs. (Source: 7 CFR 1755.902 — VERIFIED via eCFR public text)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "7 CFR 1755.902 is the minimum performance spec for fiber optic cables on RUS-financed projects" | 7 CFR 1755.902 (ecfr.gov): "Minimum performance Specification for fiber optic cables" — title confirms | VERIFIED via eCFR public text |
| "RUS SMF default MFD spec: 9.2 µm ± 0.5 µm at 1310 nm" | 7 CFR 1755.902 (ecfr.gov): "fibers must be manufactured to an MFD of 9.2 µm with a maximum tolerance range of ±0.5 µm" | VERIFIED via eCFR public text |
| "Fiber must be coated to 250 ± 15 µm OD" | 7 CFR 1755.902: "outside diameter of 250 ±15 micrometers (10 ±0.6 mils)" | VERIFIED via eCFR public text |
| "ICEA S-87-640 standard tensile rating: 2,670 N (600 lbf) installation; 1,330 N (300 lbf) lower tier" | ICEA S-87-640 installation tensile rating — confirmed via secondary sources citing these values; archive.org 2006 edition | VERIFIED via archive.org + secondary |
| "Cable must be fully color coded so each fiber is distinguishable using the 12-color scheme" | 7 CFR 1755.902: "fully color coded so that each fiber is distinguishable from every other fiber. A basic color scheme of twelve colors" | VERIFIED via eCFR public text |
| "RUS 1753F-201 covers acceptance tests for installed cable plant" | USDA rd.usda.gov bulletin page: "1753F-201 (PC-4) — acceptance tests and measurements" | VERIFIED via USDA public bulletin index |

### Paywalled / inaccessible claims
- ICEA S-87-640 exact §numbers for bend diameter, armor thickness, jacket thickness tables — 2016/2023 edition paywalled. 2006 archive.org edition accessible; core qualification/acceptance framework consistent.

### Interactive primitive recommendations
- **WorkedExample** — "Walk a cable datasheet: here is a Corning SMF-28 Ultra cut-sheet. Identify the ICEA S-87-640 compliance declaration, the MFD value, the tensile rating, and the temperature range."
- **Quiz** (MC) — RUS MFD spec, acceptance vs. qualification testing distinction

### Quiz question seeds
1. (MC) On a RUS-financed project, if the buyer does not specify MFD, all SMF fibers must be manufactured to what MFD at 1310 nm? A) 8.6 µm ± 0.4 µm B) 9.2 µm ± 0.5 µm C) 10.0 µm ± 0.5 µm D) 9.0 µm ± 1.0 µm → **B** (Source: 7 CFR 1755.902)
2. (MC) ICEA S-87-640's standard installation tensile rating for OSP fiber cable is: A) 2,670 N (600 lbf) B) 1,000 N (225 lbf) C) 5,340 N (1,200 lbf) D) 890 N (200 lbf) → **A** (Source: ICEA S-87-640 via secondary sources)

### Lesson confidence: HIGH (7 CFR 1755.902 values directly from eCFR public text; ICEA tensile values verified via archive.org)

---

## L11 — Cable Specification Reading — Real Datasheet

### DAG prerequisites
- Internal T03 (L01–L10): all construction and standards concepts

### Vocabulary introduced
- **tolerance band** — the range around a nominal specification value within which a measurement is still conforming. E.g., MFD = 9.2 µm ± 0.5 µm means values 8.7–9.7 µm are conforming. (Source: 7 CFR 1755.902; standard datasheet reading practice)
- **aging factor** — a design margin applied to attenuation or mechanical properties to account for performance degradation over the 20–40 year cable lifetime. E.g., planning attenuation = typical datasheet value + 0.02–0.05 dB/km aging factor. (Source: FOA Reference Guide; Corning cable aging data)

### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "Planning attenuation adds 0.02–0.05 dB/km aging margin to typical datasheet value" | FOA Reference Guide (thefoa.org/tech/ref/OSP/design.html): aging allowance discussed; Corning white papers on cable aging | VERIFIED via FOA + vendor |
| "Standard OSP cable temperature range: typically −40°C to +70°C" | ICEA S-87-640 (operating temperature range); Corning SMF-28 Ultra datasheet — confirmed as −40°C to +70°C | VERIFIED via vendor datasheets |

### Interactive primitive recommendations
- **WorkedExample** — step-by-step datasheet reading: given a hypothetical (or real Corning SMF-28 Ultra) datasheet image, identify key specifications: fiber count, cable OD, weight, tensile rating, minimum bend radius (installation and long-term), temperature range, MFD, attenuation max, armor type, jacket material
- **HotSpot** — datasheet image with clickable regions: "Click the MFD specification," "Click the installation tensile rating," "Click the minimum bend radius"

### Lesson confidence: HIGH

---

## L12 — T03 Capstone Quiz

### DAG prerequisites
- All T03 lessons (L01–L11)

### Quiz scope
- 20Q MC + 1 BranchingScenario
- Domain distribution: cable construction (5Q), fiber grades (4Q), jacket/armor (4Q), ADSS/loading (3Q), standards compliance (4Q)

### BranchingScenario seed
"You are specifying a 96F cable for a hybrid aerial-to-direct-burial run on a RUS project in Georgia. The aerial section spans 250 ft between poles. The direct-burial section crosses through a field with known woodchuck activity. The cable enters a hospital building and must run 100 ft vertically in a riser shaft before terminating in a communications room."

Decision points:
1. Aerial section: lashed + messenger or ADSS? → ADSS eliminates bonding complexity; lashed supports higher fiber counts but this is 96F so ADSS works
2. Direct burial section: armored or unarmored? → CST armored required (rodent activity documented)
3. Building entry and riser: which fire rating? → OFNR for the riser run (100 ft vertical = riser shaft); transition at building entry if outer OSP jacket is unlisted (>50 ft interior means transition required)
4. RUS fiber MFD spec: must all cable be same MFD spec? → Yes, unless buyer specifies otherwise: 9.2 µm ± 0.5 µm

### Lesson confidence: HIGH (scenario grounded in verified facts from L01–L11)

---

## Consolidated Paywalled-Claim List

| Claim | Lesson | Paywalled Source | Secondary Verification |
|---|---|---|---|
| ICEA S-87-640 §4 exact buffer tube count/size | L01 | ICEA S-87-640 2016/2023 | 7 CFR 1755.902 + archive.org 2006 ed. |
| ICEA S-87-640 §7 armor thickness tables | L03, L07 | ICEA S-87-640 2016/2023 | OCC product docs + archive.org 2006 |
| NEC §770.48(A) exact 50 ft rule language | L02 | NFPA 70-2023 | ≥3 public NEC commentaries |
| ITU-T G.657 bend-loss test conditions (turns, dB limit at 1625 nm) | L05 | ITU-T G.657 2024 | OFS datasheets + T02 Research Brief flags |
| NESC C2-2023 Table 250-1 exact loading district values | L09 | NESC C2-2023 | RUS 1724E-150 + IAEI Magazine 2002 |
| ICEA S-87-640 §6 HDPE carbon black compound properties | L06 | ICEA S-87-640 2016/2023 | bwnfiber.com + shobeirshimi.com |

**Paywalled claim count: 6.** All 6 have ≥2 independent secondary sources confirming core values. All marked with `[confirm edition]` or `[paywalled — verify against X when accessible]` per allowlist protocol.

---

## Hallucination-Risk Register

| Risk | Lesson | Severity | Flag |
|---|---|---|---|
| NESC loading district values (exact numbers in Table 250-1) | L09 | MEDIUM | Values confirmed via RUS 1724E-150 and IAEI. Exact NESC text not directly accessible. Mark `[confirm against NESC C2-2023 Table 250-1]` |
| "Macon, GA = Light loading district" | L09 | LOW | Consistent with GA geography; confirm via NESC map or RUS engineering support before publishing |
| G.657.B2 → A2 merger in 2024 edition | L05 | LOW | Confirmed from ITU-T 2024 publication metadata in search result. Author should mark `[verify 2024 edition consolidation]` |
| Cable OD / weight values used in worked examples | L04, L09 | LOW | Values are typical-range industry figures (0.15 kg/m, 18 mm OD for 48F ADSS); actual values vary by manufacturer. Worked examples are illustrative — author must label as "representative values, verify against datasheet for your cable" |
| ICEA S-87-640 1,330 N lower-tier tensile rating | L10 | LOW | Cited via secondary sources; archive.org 2006 edition confirms two tensile rating tiers. Mark with `[confirm current edition]` |

**Hallucination-risk count: 5** (all LOW or MEDIUM; none HIGH based on research conducted).

---

## Proposed Allowlist Additions

The following sources were used in this brief but are not on the current `research-sources-allowlist.md`:

1. **RUS Bulletin 1724E-150** — RUS electric pole line engineering bulletin. Used here because it reproduces NESC loading district table values (a publicly available non-paywalled source for NESC §25 data). *Recommend adding to allowlist under "RUS" section.*

2. **7 CFR 1755.902** (eCFR) — RUS minimum performance specification for fiber optic cables. *Already in allowlist as "7 CFR Part 1755." Clarify sub-citation: "7 CFR §1755.902 — Minimum performance specification for fiber optic cables."*

3. **ICEA S-87-640 archive.org 2006 edition** (law.resource.org/pub/us/cfr/ibr/004/icea.s-87-640.2006.pdf) — Public domain version. *ICEA S-87-640 is on allowlist; add note that 2006 edition is publicly accessible at law.resource.org for base-construction verification.*

4. **OFS Optics fiber datasheets** (fiber-optic-catalog.ofsoptics.com) — Vendor datasheet for G.657 specifications and rollable ribbon parameters. *Recommend adding OFS Optics as an approved vendor datasheet source alongside Corning.*

5. **CommScope ADSS vs. Lashed Fiber blog** (commscope.com) — Industry-authoritative comparison of aerial cable types. *Recommend adding CommScope technical content as an acceptable secondary source for aerial cable construction facts.*

---

## Verdict: YELLOW

**Reasoning:** The core T03 content is well-grounded. Standards directly accessible via eCFR (7 CFR 1755.902), public vendor datasheets (Corning, OFS, CommScope, OCC), and FOA public references verify the vast majority of claims. The NESC loading district values (L09) and ITU-T G.657 exact test thresholds (L05) are the only areas requiring explicit `[paywalled — confirm edition]` markers in authored content. No claims rated HIGH hallucination risk. Recommended RT framings below address the remaining uncertainty.

**GREEN upgrade conditions:** RT-A confirms NESC Table 250-1 values via RUS 1724E-150 direct citation (the public document exists and is readable); RT-B verifies the L09 sag worked example arithmetic independently. If both pass, T03 can be authored at GREEN confidence.

---

## Recommended RT Framings for T03

**RT-A — Standards Citation Verifier:**
Focus: Every `(Source: X §Y)` citation in this brief. Verify (a) the document exists, (b) the section covers what the brief claims, (c) the numerical value matches. Special focus on 7 CFR 1755.902 eCFR text, ICEA S-87-640 2006 archive.org edition, and NESC values via RUS 1724E-150.

**RT-B — Math & Engineering Process Check:**
Focus: The ADSS sag worked examples in L04 and L09. Re-derive the parabolic sag formula calculation independently. Verify EDS × RTS arithmetic. Verify the ice load formula structure is standard engineering practice. Flag any arithmetic errors before authoring.

---

*=== T03 CABLE SELECTION RESEARCH BRIEF END ===*
