---
title: "Lesson 2.2: Fusion Splicing I — Core Alignment, Arc Parameters, and Splice Loss Budgets"
duration_min: 30
topic: splice-termination
order: 2
bicsi_alignment:
  - "OSP-DRD 7.4: Fusion splicing — equipment operation, arc parameters, and loss verification"
  - "OSP-DRD 7.1: Splice preparation and quality requirements"
sources:
  - "IEC 61300-3-4 (attenuation measurement by backscatter — OTDR method, splice loss verification)"
  - "Fujikura FSM-series Fusion Splicer Operation Manual (public training edition)"
  - "Sumitomo Type-82C Field Fusion Splicer Operation Guide"
  - "AFL Fitel S179A Fusion Splicer Training Materials"
  - "BICSI OSP-DRD Manual, Ch. 7.4"
  - "Corning Cable Systems OSP Splicing Procedures Guide, Rev. 3"
---

# Fusion Splicing I: Core Alignment, Arc Parameters, and Splice Loss Budgets

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the physics of arc-fusion splicing and explain the role of each arc parameter in the splice formation process
- Compare the three primary core alignment modes — PAS, LID, and cladding alignment — and identify when each is used
- Define estimated splice loss and measured splice loss and explain why the two values differ
- Calculate total splice loss contribution for a multi-splice route using a per-splice loss budget
- Identify the principal causes of elevated splice loss and the corresponding corrective actions

---

## Reading Content

### The Physics of Fusion Splicing

Fusion splicing permanently joins two optical fibers by heating their glass end-faces to the softening point (~1900°C for silica glass) and allowing surface tension to draw the molten glass faces together into a continuous glass structure. When properly executed, the splice becomes a region of continuous glass with no physical interface — optical signals pass through it with loss approaching the theoretical minimum for that fiber type [Fujikura FSM-series Manual, §1.2; BICSI OSP-DRD Manual, Ch. 7.4].

The heat source in an OSP fusion splicer is an **electric arc** between two tungsten electrodes positioned on either side of the fiber. The arc ionizes the surrounding air, generating temperatures sufficient to soften silica glass within a controlled zone. This contrasts with the laser-fusion method used in some factory-splice equipment; field fusion splicers universally use electric arc.

The splice cycle has three phases:
1. **Pre-fusion (prefuse arc).** A brief, lower-energy arc that cleans contamination from the fiber end-faces and initiates surface softening. This step eliminates residual surface particles that would otherwise become inclusions in the splice zone.
2. **Main fusion arc.** The primary arc fires at higher energy and longer duration, softening both end-faces simultaneously. The splicer's motorized stages drive the fibers toward each other by a controlled overlap distance (the "gap" setting) as the glass softens; surface tension completes the pull-in and draws the two molten faces into contact.
3. **Cool-down.** After the main arc, the splicer holds the fibers clamped while the glass solidifies. Releasing the fibers before solidification risks a tension-induced fracture of the still-plastic splice zone.

### Arc Parameters: Three Variables That Define Every Splice

Every fusion splicer stores arc parameter sets — sometimes called splice programs or splice modes — for different fiber types, environmental conditions, and splice applications. Three parameters are foundational to all splice programs [Fujikura FSM-series Manual, §4.2; Sumitomo Type-82C Guide, §3.3; AFL Fitel S179A Manual, §5.1]:

**Gap (overlap distance).** The distance the motorized stages drive the two fiber ends toward each other after the main arc fires. The splicer begins with the cleaved fiber ends set at a specified initial separation; the gap parameter controls how much of that separation is closed by stage movement during the arc. Insufficient gap produces a stretched splice (the arc softened the glass but the faces didn't fully contact — leaving a void or neck in the splice zone); excessive gap produces an overcorrected splice with a bulge at the splice point. Most single-fiber SMF programs specify a gap in the range of 10–18 µm for the final stage drive [Fujikura FSM-series Manual, §4.2; Sumitomo Type-82C Guide, §3.3].

**Prefuse arc duration.** The time in milliseconds that the cleaning/pre-softening arc fires before the main arc begins. Longer prefuse duration removes more surface contamination but can over-round the end-face before main fusion, reducing the accuracy of the final face contact. Altitude affects prefuse requirements — at high elevation, lower atmospheric pressure reduces arc efficiency, and some splicers include altitude compensation modes that adjust prefuse and main arc parameters for operation above 2000 m [Fujikura FSM-series Manual, §4.3].

**Main arc duration (and arc current).** The energy parameter of the main fusion arc — how long the arc fires and at what current level. More energy softens more glass, enabling deeper diffusion of the two fiber faces; insufficient energy leaves a partial bond with residual stress at the interface. At high elevation, reduced air pressure increases arc ionization efficiency, which means the same current produces more heat than at sea level — requiring reduced arc current or duration in altitude-compensated programs [Fujikura FSM-series Manual, §4.3; Sumitomo Type-82C Guide, §3.4].

**Manufacturer approach comparison.** Fujikura's automated splice estimation uses a profile alignment system combined with a proprietary arc-power correction loop: the splicer measures electrode gap wear and adjusts arc current automatically to compensate for electrode degradation across thousands of splices. Sumitomo's equivalent system uses an arc power calibration cycle (the "ARC CHECK" function on the Type-82C) that the operator runs periodically — typically at the start of each work day and whenever arc quality changes are detected — to recalibrate the arc current to electrode condition [Fujikura FSM-series Manual, §4.4; Sumitomo Type-82C Guide, §3.5].

### Core Alignment Modes

Positioning the two fiber cores in axial alignment before and during the arc is the most important determinant of splice loss. Three primary alignment technologies are used in OSP field fusion splicers [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.2]:

**PAS — Profile Alignment System.** The dominant technology in modern OSP field splicers (Fujikura FSM-22S, FSM-80S, FSM-90F; Sumitomo Type-82C; AFL S179A). PAS uses a CCD camera and image processing to observe the fiber from two axes (X and Y) through the arc zone. The splicer analyzes the refracted light pattern through the fiber cross-section to locate the core position in both axes simultaneously. Motorized v-groove stages then move each fiber independently to minimize core offset before the arc fires. PAS works on all fiber types — SMF, MMF, and ribbon — without modification to the alignment principle. Loss performance for SMF OS2: typically 0.02–0.05 dB estimated splice loss in normal operating conditions [Fujikura FSM-series Manual, §4.1; Sumitomo Type-82C Guide, §3.1].

**LID — Light Injection and Detection.** An active alignment technique: light is injected into one fiber and measured at the other fiber end while the splicer stages scan for maximum power coupling. LID directly optimizes for optical coupling rather than geometric core position — it finds the actual maximum-transmission alignment, not the geometrically ideal position. LID is especially useful for specialty fibers with non-circular or non-concentric cores (DSF, NZDSF, large-mode-area fibers) where PAS geometry inference is less reliable. LID is rarely required for standard OS2 OSP work and is more common in metro/DWDM plant environments [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.2].

**Cladding alignment (fixed v-groove).** The simplest and least precise method: both fibers are placed in fixed v-grooves and held in contact by the groove geometry without active core positioning. The v-groove centers the fiber by the cladding OD (125 µm), not the core. If the core is not perfectly concentric within the cladding — which it is not, even in high-quality OS2 SMF (core eccentricity specification: ≤0.6 µm per TIA-492 fiber standards) — cladding alignment produces residual core offset. Cladding-aligned splicers are low-cost field tools used for MMF work and for construction-grade SMF work where ≤0.10 dB per-splice loss budget can be achieved with the lower alignment precision. Not appropriate for high-density DWDM or metro networks where per-splice loss must be minimized [BICSI OSP-DRD Manual, Ch. 7.4].

### Estimated vs. Measured Splice Loss

After the arc fires and the splice forms, every fusion splicer computes an **estimated splice loss** and displays it on screen. This estimate is produced by the splicer's image processor, which measures the geometric parameters of the completed splice — core offset, fiber deformation, bubble presence, and end-face angle — and converts these to an estimated optical loss using the splicer manufacturer's calibration model [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1].

The estimated loss is **not** the same as the optically measured splice loss (measured by OTDR or power meter). Key differences:

- The image processor measures **geometric** parameters; optical loss depends on the actual waveguide transmission, which is affected by refractive index profile changes in the heated splice zone that the camera cannot see.
- The estimation model is calibrated for standard fiber types; splice loss estimates are less reliable for specialty fibers or for splices between non-identical fiber types.
- **Estimated loss typically underestimates true optical loss** — a splice showing 0.03 dB estimated loss may measure 0.05–0.08 dB on an OTDR in practice. The estimate is best used as a relative quality indicator (good/re-splice decision), not as a precise predictor of measured link loss.
- Conversely, a splice showing 0.15 dB estimated loss almost certainly has optical loss at or above that level — the estimate is more reliable for identifying bad splices than for quantifying the loss of good ones.

**Project acceptance criteria** specify which loss value — estimated or OTDR-measured — governs acceptance. Most construction specifications use OTDR-measured bidirectional average per IEC 61300-3-4; some allow estimated loss as a field-acceptance proxy when OTDR testing follows later [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5].

### Splice Loss Budget: Concepts

A **splice loss budget** accounts for the cumulative attenuation contribution of all fusion splices on a route — separate from the cable's per-kilometer attenuation loss. The two components (cable loss and splice loss) are additive; a route's total optical loss equals the sum of both.

Key splice loss budget parameters:

| Parameter | Typical value | Source |
|---|---|---|
| BICSI default per-splice acceptance (OS2 SMF, fusion) | ≤ 0.10 dB/splice | BICSI OSP-DRD Manual, Ch. 7.4 |
| Industry best-practice (PAS splicer, good conditions) | 0.02–0.05 dB/splice estimated | Fujikura FSM-series; Sumitomo Type-82C |
| Project-spec tight tolerance (metro / DWDM) | ≤ 0.05 dB/splice OTDR-measured | Project specification (varies) |
| Mass-fusion ribbon typical (per fiber) | 0.05–0.15 dB/splice | Fujikura FSM-60R/70R manual |

*Sources: [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual; Sumitomo Type-82C Guide]*

### Worked Loss Budget: 12-Splice Route

**Scenario:** A 48-fiber OSP route has 12 splice closures between the hub and the FDH. The cable is OS2 SMF, 24 km total length, attenuation ≤0.4 dB/km at 1310 nm per ANSI/TIA-568.3-D specification. The project specifies ≤0.10 dB/splice acceptance (BICSI default). The route uses 10GBASE-LR transceivers (loss budget: 12.6 dB per IEEE 802.3ae).

**Step 1 — Cable attenuation:**
24 km × 0.4 dB/km (specification maximum) = **9.6 dB** cable loss (worst case)

**Step 2 — Splice loss at BICSI default (0.10 dB/splice):**
12 splices × 0.10 dB/splice = **1.2 dB** splice loss

**Step 3 — Total link loss:**
9.6 dB + 1.2 dB = **10.8 dB**

**Step 4 — Transceiver budget check:**
10.8 dB total loss < 12.6 dB transceiver budget → **link passes** with 1.8 dB margin.

**Impact of splice quality improvement:**
If actual splices average 0.05 dB/splice (achievable with PAS splicer, good conditions):
12 splices × 0.05 dB = **0.6 dB** splice loss
Total: 9.6 + 0.6 = **10.2 dB** → margin improves to 2.4 dB.

The splice loss contribution at BICSI default (1.2 dB) consumes **67% of the available margin** (1.8 dB) for this route. On longer routes or with higher cable attenuation, splice quality becomes the deciding factor in whether the link closes. This is why BICSI recommends minimizing unnecessary splice closures on feeder routes and using PAS splicers rather than cladding-aligned splicers for backbone work [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.3].

### Causes of Elevated Splice Loss

Understanding what drives high splice loss allows the technician to intervene at the right point in the process [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.2; Corning OSP Splicing Guide, §4.4]:

| Root cause | Effect on splice loss | Corrective action |
|---|---|---|
| Poor cleave angle (>0.5°) | Geometric core misalignment at contact | Re-cleave before splicing |
| Dirty fiber end-faces | Inclusion or void at splice zone | Re-clean with IPA; re-cleave |
| Core offset (misalignment) | Major cause of loss in cladding-aligned splicers | Use PAS splicer; check fiber seating |
| Arc contamination (dust on electrodes) | Asymmetric arc heating → deformed splice zone | Clean electrodes per splicer manual |
| Fiber type mismatch (SMF spliced to MMF) | Mode field diameter (MFD) mismatch → high loss | Verify fiber type before splicing |
| Wrong splice program (MMF program on SMF) | Incorrect gap and arc settings for MFD | Verify splice program before use |
| Insufficient arc energy (altitude) | Partial fusion — residual interface | Use altitude-compensated splice program |

*Sources: [Fujikura FSM-series Manual, §5.2; Sumitomo Type-82C Guide, §4.2; BICSI OSP-DRD Manual, Ch. 7.4]*

---

## Key Terms (Flashcard Candidates)

**Arc fusion splicing**
A permanent fiber joining method in which an electric arc heats both fiber end-faces to the glass softening point; surface tension draws the molten faces into a continuous glass structure. No physical interface remains in the splice zone when properly executed. [Fujikura FSM-series Manual, §1.2; BICSI OSP-DRD Manual, Ch. 7.4]

**Prefuse arc**
The first phase of the fusion splice cycle — a brief, lower-energy arc that cleans the fiber end-faces and initiates surface softening before the main fusion arc fires. Critical for removing surface contamination that would otherwise form inclusions in the splice zone. [Fujikura FSM-series Manual, §4.2]

**Main arc duration**
The time duration and current level of the primary fusion arc that softens both fiber end-faces and drives the splice stage overlap. More energy → deeper diffusion; insufficient energy → incomplete bond with residual stress. Altitude-compensated programs reduce current at high elevation due to increased arc ionization efficiency in reduced atmospheric pressure. [Fujikura FSM-series Manual, §4.2–4.3; Sumitomo Type-82C Guide, §3.4]

**Gap (overlap distance)**
The splicer-controlled stage drive distance that closes the initial fiber separation during the main arc. Correct gap produces full face contact; insufficient gap leaves a void or necked splice zone; excessive gap produces a bulge. [Fujikura FSM-series Manual, §4.2]

**PAS (Profile Alignment System)**
The dominant active core-alignment technology in modern field fusion splicers. Uses CCD cameras and image processing to locate the core in both X and Y axes from refracted light patterns; motorized stages minimize core offset before arc firing. Achieves 0.02–0.05 dB estimated splice loss on OS2 SMF under normal conditions. [Fujikura FSM-series Manual, §4.1; BICSI OSP-DRD Manual, Ch. 7.4]

**LID (Light Injection and Detection)**
An active alignment technique that injects light at one fiber end and scans for maximum optical coupling at the other, finding the alignment that maximizes actual transmission rather than geometric position. Used for specialty fibers with non-concentric or non-circular cores; not required for standard OS2 OSP work. [BICSI OSP-DRD Manual, Ch. 7.4]

**Cladding alignment**
The simplest alignment method: fibers seated in fixed v-grooves aligned by cladding OD (125 µm). Core position is inferred from the cladding center, not directly measured. Produces higher residual core offset than PAS; suitable for construction-grade SMF work and MMF. [BICSI OSP-DRD Manual, Ch. 7.4]

**Estimated splice loss**
The optical loss value computed by the splicer's image processor from geometric measurements (core offset, deformation, bubble presence) of the completed splice. A relative quality indicator; typically underestimates true OTDR-measured optical loss for good splices. [Fujikura FSM-series Manual, §5.1]

**Splice loss budget**
The total optical loss attributed to all fusion splices on a route, separate from cable attenuation. Calculated as: number of splices × per-splice loss (dB/splice). Added to cable attenuation loss to determine total link loss for transceiver budget verification. [BICSI OSP-DRD Manual, Ch. 7.4]

**Mode field diameter (MFD)**
The effective diameter of the light-carrying mode in a single-mode fiber, determined by the refractive index profile rather than the physical core boundary. Typical OS2 MFD: 9.2 µm at 1310 nm per ITU-T G.652.D. MFD mismatch between two fiber types is a primary source of splice loss when non-identical fibers are joined. [ITU-T G.652.D §3.2]

---

## Interactive: Scenario — Work the Loss Budget

### Scenario

A new 96-fiber OSP feeder route for a rural electric cooperative is 38 km long, direct-bury OS2 SMF. The cable attenuation specification is ≤0.4 dB/km at 1310 nm. There are 8 splice closures on the route; each closure is a full mid-span splice with all fibers spliced. The design calls for 40GBASE-LR4 transceivers (loss budget: 14.4 dB per IEEE 802.3ba).

The project specification requires:
- Per-splice loss ≤ 0.10 dB (BICSI default)
- Total link loss ≤ transceiver budget

**Task:** Calculate total link loss at the BICSI default splice quality threshold and determine whether the link closes. Then calculate the additional margin available if the field crew achieves 0.05 dB/splice average.

---

**Step 1 — Cable attenuation at specification maximum:**
38 km × 0.4 dB/km = **15.2 dB**

**Step 2 — Splice loss at BICSI default (0.10 dB/splice):**
8 splices × 0.10 dB/splice = **0.8 dB**

**Step 3 — Total link loss:**
15.2 dB + 0.8 dB = **16.0 dB**

*Evaluation:* 16.0 dB total loss **exceeds** the 14.4 dB transceiver budget by 1.6 dB. The link **does not close** at the specification-maximum cable attenuation with BICSI default splice quality.

**Step 4 — Diagnosing the shortfall:**
The cable attenuation at specification maximum (15.2 dB) alone exceeds the transceiver budget before splices are added. This reveals that the design is constrained by cable attenuation — not splice quality — and requires either: (a) verifying that actual cable attenuation will be below the specification maximum (typical OS2 at 1310 nm measures 0.33–0.36 dB/km, not 0.40 dB/km), or (b) selecting transceivers with a higher loss budget.

**Step 5 — Recalculate using typical OS2 attenuation (0.35 dB/km):**
38 km × 0.35 dB/km = **13.3 dB** (typical cable loss)
13.3 dB + 0.8 dB (splices at default) = **14.1 dB** → **0.3 dB margin** — the link closes.

**Step 6 — Additional margin from improved splice quality (0.05 dB/splice):**
8 splices × 0.05 dB/splice = **0.4 dB**
13.3 dB + 0.4 dB = **13.7 dB** → **0.7 dB margin** — additional 0.4 dB margin from splice quality improvement.

*Lesson:* The difference between BICSI-default and best-practice splice quality (0.10 vs. 0.05 dB/splice × 8 splices = 0.4 dB) can be the margin between a passing and failing link at or near a transceiver budget boundary. On long routes with many splices, field crew proficiency directly determines whether the link passes acceptance testing. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.3]

---

## Multiple-Choice Quiz

---

**Q1.** Which fusion splicer core alignment mode locates core position by analyzing the refracted light pattern through the fiber cross-section using a CCD camera?

- A) LID (Light Injection and Detection)
- B) Cladding alignment (fixed v-groove)
- C) PAS (Profile Alignment System) **[CORRECT]**
- D) MFD matching (mode field alignment)

*Rationale:*
- **A — Incorrect.** LID (Light Injection and Detection) aligns by injecting light at one fiber end and scanning for maximum optical power coupling at the other — it does not use camera-based refracted light pattern analysis. LID optimizes for actual optical coupling rather than geometric core position. [BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** Cladding alignment uses fixed v-grooves to center the fiber by cladding OD without any active core position measurement — it uses no camera-based refracted light analysis and performs no motorized stage correction. [BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Correct.** PAS (Profile Alignment System) uses CCD cameras and image processing to analyze the refracted light pattern through the fiber cross-section in two axes, locating the core position. Motorized stages then drive the fibers to minimize core offset before the arc fires. PAS is the dominant alignment technology in modern OSP field splicers (Fujikura FSM-series; Sumitomo Type-82C). [Fujikura FSM-series Manual, §4.1; Sumitomo Type-82C Guide, §3.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** "MFD matching" is not a field splicer alignment mode — it describes the condition of two fibers having matched mode field diameters, which reduces splice loss. MFD matching is a fiber selection consideration, not an alignment technology in the splicer. [ITU-T G.652.D §3.2]

---

**Q2.** An OSP route has 18 splice closures over a 30 km OS2 SMF feeder at the BICSI default ≤0.10 dB/splice acceptance. Cable attenuation is ≤0.4 dB/km. The transceiver loss budget is 12.6 dB (10GBASE-LR). What is the total calculated link loss, and does the link close?

- A) 12.0 dB total; the link closes with 0.6 dB margin
- B) 13.8 dB total; the link does not close — exceeds the 12.6 dB budget by 1.2 dB **[CORRECT]**
- C) 11.8 dB total; the link closes with 0.8 dB margin
- D) 13.8 dB total; the link closes — 13.8 dB is within the 14.4 dB budget for 10GBASE-LR

*Rationale:*
- **A — Incorrect.** 12.0 dB does not account for the full cable loss or splice loss. Cable loss: 30 km × 0.4 dB/km = 12.0 dB. Splice loss: 18 × 0.10 dB = 1.8 dB. Total = 13.8 dB — not 12.0 dB. The calculation in option A omits the splice contribution entirely. [BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Correct.** Cable loss: 30 × 0.4 = **12.0 dB**. Splice loss: 18 × 0.10 = **1.8 dB**. Total: **13.8 dB**. Transceiver budget: 12.6 dB. 13.8 > 12.6 → the link **does not close** — exceeds the budget by 1.2 dB. This scenario illustrates why splice count must be considered when designing long routes near transceiver budget limits. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.3]
- **C — Incorrect.** 11.8 dB omits either cable loss or splice loss — no combination of the given parameters produces 11.8 dB. The minimum total with correct calculation is 13.8 dB. [BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** 13.8 dB is the correct total, but the transceiver specified is 10GBASE-LR with a **12.6 dB** budget — not 14.4 dB. A 14.4 dB budget corresponds to 40GBASE-LR4 (IEEE 802.3ba). Applying the wrong transceiver budget to the calculation produces a false pass. Always confirm the loss budget for the specific transceiver standard. [IEEE 802.3ae; IEEE 802.3ba]

---

**Q3.** A fusion splicer displays an estimated splice loss of 0.04 dB after completing a splice on OS2 SMF. The field crew records this as the measured splice loss for the closure documentation. What is the problem with this approach?

- A) There is no problem — estimated loss from a PAS splicer is equivalent to OTDR-measured loss for documentation purposes
- B) Estimated splice loss is computed from geometric image measurements and typically underestimates true optical loss; OTDR-measured bidirectional average is required for acceptance documentation **[CORRECT]**
- C) The 0.04 dB estimate indicates a failed splice; BICSI acceptance is ≤0.10 dB so this splice should be rejected
- D) Estimated loss can only be recorded for SMF splices; MMF splices require OTDR measurement

*Rationale:*
- **A — Incorrect.** Estimated splice loss is a geometric proxy computed from camera images of core offset, deformation, and bubble presence — it does not directly measure optical transmission. Most acceptance specifications require OTDR-measured bidirectional average loss for formal documentation. Estimated loss is a field QA screening tool, not an equivalent substitute for measured optical loss. [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5; Fujikura FSM-series Manual, §5.1]
- **B — Correct.** Splicer-estimated loss is derived from image processing of geometric parameters. Because it does not account for refractive index profile changes in the heated splice zone (invisible to the camera), estimated loss typically **underestimates** true measured optical loss for good splices. Formal closure documentation requires OTDR-measured bidirectional average splice loss per project specification and BICSI protocol. [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5; Fujikura FSM-series Manual, §5.1]
- **C — Incorrect.** 0.04 dB is well within the BICSI ≤0.10 dB acceptance threshold — this is a high-quality splice estimate, not a failure indication. The issue is with documentation protocol, not splice quality. [BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** There is no fiber-type distinction in the requirement to use OTDR-measured loss for documentation. Both SMF and MMF splice documentation practices require actual optical loss measurements when the project specification mandates OTDR acceptance testing. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q4.** A field technician splices two fibers and observes a high estimated splice loss of 0.28 dB. Upon inspection, the splicer image shows the two fiber cores are laterally offset by approximately 3 µm at the splice zone. Which root cause best explains this core offset?

- A) Incorrect prefuse arc duration (too long, causing end-face over-softening before main arc)
- B) The splicer is operating in cladding alignment mode, which aligns by cladding OD rather than core position **[CORRECT]**
- C) Arc contamination on the tungsten electrodes causing asymmetric heating
- D) Insufficient gap setting causing incomplete fiber contact during main arc

*Rationale:*
- **A — Incorrect.** Excessive prefuse duration causes over-rounding of the end-face and can slightly increase loss, but does not produce a 3 µm lateral core offset. Prefuse arc affects end-face geometry, not core positioning — the core offset is a pre-arc alignment failure, not an arc parameter problem. [Fujikura FSM-series Manual, §5.2]
- **B — Correct.** A 3 µm lateral core offset after a PAS-aligned splicer would be unexpected; in a cladding-aligned splicer, however, a 3 µm offset is consistent with the core eccentricity specification for OS2 SMF (≤0.6 µm) plus the mechanical tolerance of the v-groove system. Cladding alignment centers the 125 µm OD, not the 9 µm core — if the core is eccentric within the cladding, the cladding-aligned splice will have residual core offset. This is the primary performance limitation of cladding-aligned splicers vs. PAS splicers for SMF work. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §4.1]
- **C — Incorrect.** Electrode contamination causes asymmetric arc heating, which can deform the splice zone or produce a bubble inclusion — but it does not cause a 3 µm lateral displacement of one core relative to the other before the arc fires. Core offset is a pre-arc positioning issue. [Fujikura FSM-series Manual, §5.2]
- **D — Incorrect.** Insufficient gap produces incomplete contact between the fiber faces (a void or neck at the splice zone), not lateral core offset. A gap setting error affects the axial (Z-axis) contact quality, not the lateral (X/Y-axis) core position. [Fujikura FSM-series Manual, §4.2]

---

**Q5.** A field crew is splicing OS2 SMF at an elevation of 3,500 meters (approximately 11,500 feet). Without altitude compensation, what arc parameter change is most likely required, and why?

- A) Increase arc current — reduced atmospheric pressure requires more energy to reach glass softening temperature
- B) Decrease arc current — reduced atmospheric pressure increases arc ionization efficiency, producing more heat at the same current setting **[CORRECT]**
- C) Increase prefuse duration — the thinner air at altitude increases contamination accumulation on fiber surfaces
- D) Decrease gap distance — glass softens at a lower temperature at altitude due to reduced air pressure

*Rationale:*
- **A — Incorrect.** Increasing arc current at altitude would over-heat the glass, producing a deformed or over-fused splice zone. The intuitive assumption that "less air means less arc energy" is incorrect — the effect is the opposite. [Fujikura FSM-series Manual, §4.3]
- **B — Correct.** At high altitude, reduced atmospheric pressure **decreases** the energy required to ionize the arc gap, meaning the same electrode current produces a higher-temperature, more efficient arc than at sea level. Without altitude compensation, the standard arc program produces excessive heat — over-fusing the glass and deforming the splice zone. Altitude-compensated programs reduce arc current (and/or duration) to correct for this effect. Both Fujikura and Sumitomo splicers include altitude input fields or auto-compensation modes for this reason. [Fujikura FSM-series Manual, §4.3; Sumitomo Type-82C Guide, §3.4]
- **C — Incorrect.** Prefuse duration is set for end-face cleaning, not contamination accumulation from ambient air. Altitude does not increase contamination accumulation on fibers — this is a controlled process with freshly cleaned, freshly cleaved fibers. [Fujikura FSM-series Manual, §4.2]
- **D — Incorrect.** The glass softening temperature is a material property (approximately 1900°C for fused silica) and does not change with altitude. Gap distance is set to optimize stage drive during the main arc, not as a function of ambient air pressure. [Fujikura FSM-series Manual, §4.2]

---

## Final Check

Answer these three questions before advancing to Lesson 2.3 (Fusion Splicing II).

**Pulse 1.** Name the three primary arc parameters in a fusion splice program and describe the effect of setting each one too high.

*Expected answer:*
1. **Gap (overlap distance)** — too high (stages drive fibers too far together): produces a bulge at the splice zone, elevated splice loss from geometric distortion. [Fujikura FSM-series Manual, §4.2]
2. **Prefuse arc duration** — too long: over-rounds the fiber end-faces before main arc, reducing the planarity of face contact and potentially increasing loss. [Fujikura FSM-series Manual, §4.2]
3. **Main arc duration/current** — too high (or not altitude-compensated at elevation): over-fuses the glass, producing a deformed splice zone with elevated loss or a locally weakened splice region. [Fujikura FSM-series Manual, §4.2–4.3; Sumitomo Type-82C Guide, §3.4]

**Pulse 2.** Explain why estimated splice loss from the splicer display and OTDR-measured splice loss are not the same value, and state which one governs formal acceptance documentation.

*Expected answer:* Estimated splice loss is computed from geometric image measurements (core offset, deformation, bubble presence) and does not capture refractive index profile changes in the heated splice zone. It is a relative quality indicator that typically underestimates true optical loss for good splices. **OTDR-measured bidirectional average splice loss** governs formal acceptance documentation per BICSI OSP-DRD and project specification requirements. [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5; Fujikura FSM-series Manual, §5.1]

**Pulse 3.** A 20 km OS2 route has 10 splices. Cable attenuation spec is ≤0.4 dB/km. Splices are all ≤0.10 dB. Transceiver loss budget is 12.6 dB (10GBASE-LR). Does the link close?

*Expected answer:* Cable loss: 20 × 0.4 = 8.0 dB. Splice loss: 10 × 0.10 = 1.0 dB. Total: **9.0 dB**. Transceiver budget: 12.6 dB. 9.0 < 12.6 → **yes, the link closes**, with 3.6 dB margin. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Arc parameters (gap, prefuse, main arc)** → Lesson 2.3 (Fusion Splicing II — automated estimation uses these parameters in loss model; re-arc capability modifies main arc parameters); Lesson 2.4 (Mass-Fusion — different arc parameter sets for ribbon work)
- **PAS / LID / cladding alignment** → Lesson 2.3 (QA criteria — PAS-aligned splicers set tighter estimated-loss thresholds than cladding-aligned)
- **Estimated splice loss** → Lesson 2.3 (central concept: when to accept, re-arc, or re-splice based on estimated loss display)
- **Splice loss budget** → Lesson 2.10 (OTDR Testing — OTDR measures actual per-splice loss used in final budget reconciliation); Lesson 2.12 (Acceptance Testing — splice loss log is a required as-built document)
- **Mode field diameter (MFD)** → forward reference: Lesson 2.3 (MFD mismatch as a loss driver when splicing non-identical fiber types)
- **IEC 61300-3-4** → Lesson 2.10 (OTDR Testing references this standard for backscatter-method splice loss measurement); Lesson 2.12 (Acceptance — test data cited under this standard)
