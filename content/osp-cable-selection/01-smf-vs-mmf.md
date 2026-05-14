---
title: "Lesson 1: Single-Mode vs Multi-Mode Fiber"
duration_min: 25
topic: cable-selection
order: 1
bicsi_alignment:
  - "OSP-DRD 5.1: Optical fiber characteristics"
  - "OSP-DRD 5.3: Fiber type selection criteria"
sources:
  - "ANSI/TIA-568.3-D §6.3"
  - "ANSI/TIA-492AAAD (OM4 specification)"
  - "ANSI/TIA-492AAAE (OM5 specification)"
  - "ITU-T G.652 (SMF characteristics)"
  - "ITU-T G.657 (bend-insensitive SMF)"
  - "IEC 60793-2-10 (multimode fiber categories)"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed."
  - "CommScope Cabling Systems Reference Manual Ch. 4"
  - "BICSI OSP-DRD Manual, Ch. 5"
---

# Single-Mode vs Multi-Mode Fiber

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the structural differences between single-mode and multi-mode fiber at the core/cladding level
- Identify the core/cladding dimensions of OS2, OM3, OM4, and OM5 fiber and their governing standards
- Select the appropriate fiber type for a given distance, bandwidth, and cost budget
- Explain the modal dispersion phenomenon and articulate its impact on data-center versus OSP backbone routing decisions

---

## Reading Content

### Physical Structure of an Optical Fiber

Every optical fiber — regardless of type — shares the same three-layer construction. The **core** is the central glass strand through which light propagates. Surrounding it is the **cladding**, a glass layer with a slightly lower refractive index that creates the waveguide effect through total internal reflection. A **primary buffer coating** (typically acrylate, 250 µm outer diameter) protects the glass from mechanical stress and moisture [Corning OSP Reference, §2.1].

The fundamental difference between single-mode and multi-mode fiber is the diameter of the core. That single dimensional choice determines virtually everything else: the number of light paths the fiber supports, the maximum transmission distance, bandwidth capacity, and cost.

### Multi-Mode Fiber: Large Core, Multiple Light Paths

Multi-mode fiber (MMF) has a core diameter of **50 µm** (laser-optimized grades) or **62.5 µm** (legacy OM1 grade), clad to a standard **125 µm** outer diameter [ANSI/TIA-568.3-D §6.3.1]. The large core accepts light from inexpensive LED and VCSEL sources, which is why MMF dominated short-reach enterprise cabling from the 1980s through the 2000s.

The trade-off is **modal dispersion**. In a large-core fiber, light injected at the source travels multiple paths — called modes — simultaneously. Each mode reflects at a slightly different angle and therefore travels a slightly different path length. Modes launched at a steeper angle take longer to traverse the same physical distance than modes traveling nearly straight down the axis. At the receiver, these modes arrive at different times, smearing a single transmitted pulse into a longer, overlapping signal. Beyond a critical distance, adjacent pulses merge and the receiver can no longer distinguish individual bits [BICSI OSP-DRD Manual, Ch. 5.2].

This phenomenon — **modal dispersion** — is the bandwidth-limiting mechanism for multi-mode fiber and the primary reason it is unsuitable for OSP backbone distances.

The refractive index profile of MMF is **graded-index**: the core glass is engineered so that the refractive index decreases gradually from the optical center outward. This slows higher-order modes (which travel a shorter path near center) and speeds lower-order modes (which travel farther out), partially compensating for modal dispersion and extending reach. Laser-optimized grades OM3 through OM5 are specifically engineered for the differential mode delay (DMD) profile required by 850 nm VCSEL sources [ANSI/TIA-492AAAD §6].

### Single-Mode Fiber: Narrow Core, One Light Path

Single-mode fiber (SMF) reduces the core diameter to **9 µm** — small enough that, at the 1310 nm and 1550 nm wavelengths used for SMF transmission, only a single propagation mode exists [ITU-T G.652, §3.1]. With one mode, there is no inter-modal path-length difference and therefore no modal dispersion. The bandwidth-limiting mechanism for SMF is instead **chromatic dispersion**: the slight variation in propagation speed across the range of wavelengths emitted by the laser source. Chromatic dispersion is several orders of magnitude more manageable than modal dispersion at backbone distances, and can be compensated with dispersion-shifted fiber or dispersion-compensating modules on ultra-long hauls.

SMF cladding is the same standard **125 µm** outer diameter as MMF, making the two physically interchangeable in connectors, splice holders, and conduit fill calculations — a common source of field confusion. The cable jacket and fiber count are irrelevant to determining single-mode vs. multi-mode; only the core diameter (and the color-coded buffer, per TIA-598-D: yellow for SMF, aqua/orange for MMF) reliably identifies the type [ANSI/TIA-598-D, Table 1].

### OS1 and OS2: Single-Mode Grades

The ANSI/TIA-568.3-D standard defines two SMF grades:

- **OS1** is general-purpose indoor/tight-buffer single-mode fiber. Attenuation specification: ≤1.0 dB/km at 1310 nm, ≤1.0 dB/km at 1550 nm [ANSI/TIA-568.3-D Table 4]. Its attenuation ceiling is intentionally relaxed to accommodate the variety of indoor cabling environments.
- **OS2** is the outdoor, low-water-peak SMF grade (sometimes called ZWPF — Zero Water Peak Fiber), specified at ≤0.4 dB/km at 1310 nm and ≤0.4 dB/km at 1550 nm [ANSI/TIA-568.3-D §6.3.2.2]. The lower attenuation rating permits multi-kilometer hauls without amplification. OS2 is the standard choice for OSP backbone, feeder, and long-haul applications.

OS2 fiber conforms to ITU-T G.652.D (standard SMF) and/or G.657.A1 (macro-bend insensitive), the latter relevant for aerial routes with wind-induced bending stress [ITU-T G.657, §5.2].

**Practical rule:** any new OSP fiber installation should specify OS2. OS1 is encountered in legacy indoor installations; specifying OS1 for outdoor work is a design error.

### OM3, OM4, and OM5: Laser-Optimized Multi-Mode Grades

The OM (Optical Multi-mode) grading system was introduced to classify MMF by bandwidth-distance product at 850 nm, measured using the Encircled Flux launch condition. All laser-optimized grades use 50 µm core / 125 µm cladding.

| Grade | Standard | Min. OFL BW (850 nm) | 10 Gbps reach | 40 Gbps reach | 100 Gbps reach |
|---|---|---|---|---|---|
| OM1 | ANSI/TIA-492AAAA | 200 MHz·km | 33 m | N/A | N/A |
| OM2 | ANSI/TIA-492AAAB | 500 MHz·km | 82 m | N/A | N/A |
| OM3 | ANSI/TIA-492AAAC | 2000 MHz·km | 300 m | 100 m | 70 m |
| OM4 | ANSI/TIA-492AAAD | 4700 MHz·km | 550 m | 150 m | 100 m |
| OM5 | ANSI/TIA-492AAAE | 4700 MHz·km (850 nm) + SWDM | 550 m | 150 m | 150 m (SWDM4) |

*Sources: [ANSI/TIA-568.3-D Table 5]; [ANSI/TIA-492AAAD §8]; [ANSI/TIA-492AAAE §8]*

OM5, standardized in 2017, is the wideband multi-mode grade. It meets all OM4 performance specifications and adds a minimum bandwidth specification at **953 nm**, enabling **Shortwave Wavelength Division Multiplexing (SWDM)** — transmitting four wavelengths (850, 880, 910, 940 nm) simultaneously to quadruple capacity within a single fiber. OM5's advantage is exclusively in short-reach SWDM applications; at OSP distances it fails identically to OM4 due to modal dispersion.

### Attenuation and Wavelength Windows

SMF is specified and operated at **1310 nm** (zero-dispersion wavelength for G.652 fiber) and **1550 nm** (minimum attenuation window, ~0.18–0.20 dB/km for OS2) [ITU-T G.652.D §4]. DWDM and amplified systems operate at 1550 nm almost exclusively.

MMF is operated primarily at **850 nm** (VCSEL sources, low transceiver cost) and **1300 nm** (LED sources, legacy systems). The 850 nm window yields higher attenuation (~3.0 dB/km for OM4 vs. ~0.4 dB/km for OS2 at 1550 nm) but lower transceiver cost, which makes economic sense at distances under 500 m [Corning OSP Reference, §3.4].

### Cost Considerations

The conventional assumption that "MMF is cheaper than SMF" is no longer straightforwardly true and requires qualification:

- **Fiber cost:** OS2 SMF cable is now priced comparably to OM4 per foot for typical strand counts. OM5 commands a modest premium (~10–15%) over OM4 for the wideband specification.
- **Transceiver cost:** This is where MMF's cost advantage historically lived. 850 nm VCSEL transceivers for OM3/OM4 are significantly cheaper than 1310 nm or 1550 nm transceivers for SMF at the same data rate. At 10 Gbps, an SFP+ SR (OM4) transceiver pair costs roughly $30–60; an SFP+ LR (SMF) pair costs $80–200 [CommScope Reference Manual, Ch. 4.3].
- **For OSP work:** SMF is always the correct specification. The transceiver cost difference disappears over multi-kilometer distances where MMF simply cannot operate; there is no meaningful choice to make. The cost differential is relevant only for data-center and campus horizontal runs under 500 m.

### Why SMF for OSP Routing

The BICSI OSP-DRD Manual is unambiguous on this point: **multi-mode fiber is not appropriate for outside plant backbone infrastructure** [BICSI OSP-DRD Manual, Ch. 5.3.1]. The reasons are cumulative:

1. **Distance.** Even OM4 at 10 Gbps tops out at 550 m. OSP routes between buildings, central offices, and remote nodes are measured in hundreds of meters to tens of kilometers.
2. **Upgrade path.** SMF supports 100G, 400G, and emerging 800G transmission with transceiver upgrades and no fiber replacement. MMF requires fiber replacement to increase speed beyond its grade ceiling.
3. **Attenuation.** OS2 at 1550 nm achieves 0.18–0.20 dB/km, enabling 40+ km spans without amplification [ITU-T G.652.D §4]. MMF at 850 nm averages 2.5–3.5 dB/km, making it unsuitable for any span beyond a few hundred meters.
4. **Standards compliance.** ANSI/TIA-758-C (Outside Plant Telecommunications Infrastructure Standard) specifies OS2 SMF for feeder and distribution cable in OSP applications [ANSI/TIA-758-C §5.2].

The practical implication for the exam: any question presenting an OSP backbone, feeder, or long-haul scenario with a distance greater than 500 m has SMF as the correct answer. The only valid counter-example is a short intra-building or campus horizontal run where MMF's lower transceiver cost is the deciding factor and the distance is well within grade specification.

---

## Key Terms (Flashcard Candidates)

**Single-mode fiber (SMF)**
Optical fiber with a 9 µm core that supports only one propagation mode at operating wavelengths (1310/1550 nm). Eliminates modal dispersion; suitable for OSP distances from hundreds of meters to 40+ km. [ITU-T G.652]

**Multi-mode fiber (MMF)**
Optical fiber with a 50 µm (laser-optimized) or 62.5 µm (legacy) core that supports multiple simultaneous propagation modes. Modal dispersion limits reach to <600 m at 10 Gbps, regardless of grade. Used in data-center and campus horizontal cabling.

**OS1**
Indoor-grade SMF with relaxed attenuation specification (≤1.0 dB/km at 1310/1550 nm). Not intended for OSP use. [ANSI/TIA-568.3-D Table 4]

**OS2**
Outdoor-grade, low-water-peak SMF (≤0.4 dB/km at 1310/1550 nm). Conforms to ITU-T G.652.D. The standard OSP backbone fiber. [ANSI/TIA-568.3-D §6.3.2.2]

**OM3**
Laser-optimized 50/125 µm MMF with 2000 MHz·km minimum OFL bandwidth at 850 nm. Supports 10G to 300 m, 40G to 100 m. [ANSI/TIA-492AAAC]

**OM4**
Laser-optimized 50/125 µm MMF with 4700 MHz·km minimum OFL bandwidth at 850 nm. Supports 10G to 550 m, 40G to 150 m, 100G to 100 m. [ANSI/TIA-492AAAD]

**OM5**
Wideband laser-optimized 50/125 µm MMF. Meets all OM4 specs plus minimum bandwidth at 953 nm for SWDM4 (shortwave WDM, four wavelengths: 850–940 nm). Supports 100G to 150 m via SWDM. Distance-limited identically to OM4 outside of SWDM applications. [ANSI/TIA-492AAAE]

**Modal dispersion**
Signal degradation caused by multiple propagation modes traveling different path lengths through an optical fiber, arriving at the receiver at different times. Exclusive to multi-mode fiber; the primary bandwidth-limiting mechanism at OSP distances. Mitigated in laser-optimized MMF by graded-index core profiling; eliminated in SMF by single-mode operation.

**Numerical aperture (NA)**
A dimensionless measure of a fiber's light-gathering ability, derived from the refractive index difference between core and cladding. Typical SMF NA: 0.12–0.14. Typical OM4 MMF NA: 0.20. Higher NA means a wider acceptance cone and more modes — reinforcing why MMF accepts more light but suffers from modal dispersion. [Corning OSP Reference, §2.3]

**Wavelength windows**
Operating wavelength bands for fiber transmission. Key values: 850 nm (MMF/VCSEL, low-cost, high attenuation); 1300 nm (MMF LED, legacy); 1310 nm (SMF, zero-dispersion wavelength for G.652); 1550 nm (SMF, minimum-attenuation window, ~0.18 dB/km, preferred for long-haul and DWDM).

**Chromatic dispersion**
Pulse broadening caused by the variation in propagation speed across the range of wavelengths emitted by a source laser. The bandwidth-limiting mechanism for SMF (modal dispersion is absent). Manageable over OSP distances with standard G.652 fiber; can be compensated with dispersion-compensating modules on very long hauls.

**Graded-index profile**
Core refractive index design used in laser-optimized MMF where the index decreases parabolically from optical center to cladding boundary. Partially compensates for modal dispersion by slowing high-order modes and speeding low-order modes.

---

## Interactive: Drag-and-Drop — Label the Cross-Section

**[image:smf-vs-mmf-cross-section.svg]**

*Image description for SVG illustrator:*

The image presents two side-by-side circular cross-section diagrams of optical fiber, drawn to consistent scale.

**Left diagram — Single-Mode Fiber (OS2):**
- Outermost ring (grey/tan): secondary jacket / cable sheath layer — label: **Secondary jacket**
- Next ring inward (yellow): primary buffer coating (250 µm total OD) — label: **Primary buffer (250 µm)**
- Next ring (light blue): cladding, 125 µm outer diameter — label: **Cladding (125 µm)**
- Central circle (white/very light blue): core, 9 µm diameter — label: **Core (9 µm)**
- Small dot at center: **Optical center**
- Alongside the core, show a stepped refractive index profile inset (step-index shape: flat high in center, sharp drop at core/cladding boundary) — label: **Step-index profile**

**Right diagram — Multi-Mode Fiber (OM4):**
- Same outer rings as SMF: secondary jacket → primary buffer (250 µm) → cladding (125 µm) — same labels
- Central circle (orange/amber): core, 50 µm diameter — label: **Core (50 µm)** — this circle should be visibly much larger than the SMF core circle in the left diagram
- Small dot at center: **Optical center**
- Alongside the core, show a graded refractive index profile inset (parabolic curve: high at center, smooth decline to cladding boundary) — label: **Graded-index profile**

**Label terms and target positions:**
1. Core (9 µm) — center of left diagram
2. Core (50 µm) — center of right diagram
3. Cladding (125 µm) — middle ring, both diagrams
4. Primary buffer (250 µm) — outer glass boundary, both diagrams
5. Secondary jacket — outermost ring, both diagrams
6. Optical center — central point, both diagrams
7. Step-index profile — refractive index inset, left diagram
8. Graded-index profile — refractive index inset, right diagram

**Drag-and-drop mechanic:** Learner drags label cards from a sidebar and drops them onto the correct region of each fiber diagram. Eight label positions, eight label cards. Correct placement triggers a green highlight; incorrect placement triggers a red highlight with a hint.

---

## Interactive: Scenario — RUS Backbone Selection

### Scenario

A rural electric cooperative in central Nebraska has contracted for a 30-mile (48 km) fiber-to-the-home backbone connecting two community service areas. The route is direct-bury with three splice points at road crossings. The cooperative's current internet provider delivers backbone bandwidth at the aggregation node via 10 Gbps uplinks; the design must support 10 Gbps today and carry capacity headroom for 40 Gbps within five years without fiber replacement. The cooperative's capital budget is fixed: the fiber plant must be built within cost now, with transceiver and active equipment upgrades funded separately in future budget cycles. RUS (USDA Rural Utilities Service) loan conditions require compliance with ANSI/TIA-758-C for all outside plant infrastructure.

Choose the fiber type for the backbone run:

---

**Path A: OS2 single-mode fiber, 1550 nm transceivers**

*Assessment:*

OS2 is the correct selection for this application. At 1550 nm, OS2 achieves typical attenuation of 0.18–0.20 dB/km [ITU-T G.652.D §4]. Over a 48 km span with three splice points (budget ~0.1 dB/splice for fusion splices [BICSI OSP-DRD Manual, Ch. 7.4]), total optical loss is approximately 9.6–9.8 dB — well within the power budget of standard 10G LR transceivers (loss budget: 12.6 dB per IEEE 802.3ae). The fiber plant supports future transceiver upgrades to 40G LR4 or 100G LR4 without fiber replacement. ANSI/TIA-758-C §5.2 specifies OS2 for OSP feeder cable, satisfying the RUS compliance requirement. Capital cost for the fiber plant is optimized: OS2 is comparable in per-foot price to OM4 for typical strand counts, and the long-term upgrade path eliminates future fiber costs.

**Feedback: Correct.** This is the only selection that satisfies distance, compliance, and upgrade-path requirements simultaneously.

---

**Path B: OM4 multi-mode fiber, 1300 nm LED transceivers**

*Assessment:*

OM4 fails at this distance regardless of transceiver selection. At 10 Gbps, OM4's maximum supported reach is **550 m** using 850 nm VCSEL transceivers (10GBASE-SR) [ANSI/TIA-492AAAD §8]. Operating OM4 at 1300 nm with LED sources produces a longer reach than VCSEL — approximately 2 km — but this is still two orders of magnitude short of the 48 km requirement. Modal dispersion imposes a physical distance ceiling on multi-mode fiber that no transceiver, launch condition, or wavelength selection can overcome at backbone distances. Selecting OM4 for a 30-mile OSP backbone is a fundamental design error.

**Feedback: Incorrect.** OM4 is a data-center and campus horizontal fiber. Its 550 m ceiling at 10G (VCSEL) and approximately 2 km at 1G (LED) make it unsuitable for any OSP backbone span measured in miles. The cooperative would need to install amplifiers every 0.3–2 km, which is economically absurd.

---

**Path C: OS2 SMF with mode-conditioning patch cords at each splice point**

*Assessment:*

Mode-conditioning patch cords (MCP) are a legacy solution for a specific, narrow problem: launching 1000BASE-LX light (which uses a single-mode laser) into a multi-mode fiber link that has a minimum length requirement. They were commonly used circa 2000–2005 to adapt Gigabit Ethernet LX optics to legacy OM1/OM2 MMF horizontal cabling [IEEE 802.3z §38A.2]. They are not relevant to OS2 fiber, which is already single-mode. Inserting MCPs into an OS2 link at splice points serves no technical purpose — it introduces additional insertion loss (~0.5–1.0 dB per MCP) and unnecessary complexity without improving any performance parameter. At three splice locations, MCPs would reduce the available optical loss budget by 1.5–3.0 dB, shortening effective reach and potentially violating the transceiver power budget.

**Feedback: Incorrect.** MCPs are a compatibility adapter for launching SMF-laser light into legacy MMF; they have no application in a purpose-built OS2 backbone. This path adds cost and loss with no benefit, and reflects a misapplication of a legacy solution to a new installation.

---

## Multiple-Choice Quiz

---

**Q1.** A design engineer is specifying fiber for a 25-mile OSP feeder run between a central office and a remote aggregation node. The link must support 10 Gbps today. Which fiber type is the correct specification?

- A) OM3 multi-mode fiber
- B) OS2 single-mode fiber **[CORRECT]**
- C) OM5 wideband multi-mode fiber
- D) OS1 single-mode fiber

*Rationale:*
- **A — Incorrect.** OM3 supports 10G to a maximum of 300 m (10GBASE-SR, 850 nm VCSEL). A 25-mile (40 km) feeder run exceeds this by over 130×. [ANSI/TIA-568.3-D Table 5]
- **B — Correct.** OS2 supports 10G to 40+ km at 1310/1550 nm with standard SFP+ LR transceivers (loss budget: 12.6 dB, covering the ~8 dB span loss at 0.4 dB/km × 40 km including splice losses). ANSI/TIA-758-C §5.2 requires OS2 for OSP feeder infrastructure. [ANSI/TIA-568.3-D §6.3.2.2; ANSI/TIA-758-C §5.2]
- **C — Incorrect.** OM5 is a wideband multi-mode fiber. Its SWDM advantage is exclusively at short distances (100G to 150 m). It fails at 25 miles for the same reason as OM3 and OM4: modal dispersion imposes a hard distance ceiling well under 1 km at any speed. [ANSI/TIA-492AAAE §8]
- **D — Incorrect.** OS1 is indoor-grade single-mode fiber with a relaxed attenuation specification (≤1.0 dB/km vs. ≤0.4 dB/km for OS2). At 40 km, the OS1 loss budget would reach 40 dB — well beyond any standard transceiver specification. OS1 is not specified for OSP feeder applications. [ANSI/TIA-568.3-D Table 4]

---

**Q2.** What is the core diameter of a standard OS2 single-mode fiber?

- A) 50 µm
- B) 62.5 µm
- C) 9 µm **[CORRECT]**
- D) 125 µm

*Rationale:*
- **A — Incorrect.** 50 µm is the core diameter of laser-optimized multi-mode fiber (OM3, OM4, OM5). [ANSI/TIA-492AAAD §5.1]
- **B — Incorrect.** 62.5 µm is the core diameter of legacy OM1 multi-mode fiber. [ANSI/TIA-492AAAA §5.1]
- **C — Correct.** OS2 (and all SMF conforming to ITU-T G.652) has a nominal core diameter of 9 µm. This small core supports only a single propagation mode at 1310 nm and 1550 nm operating wavelengths, eliminating modal dispersion. [ITU-T G.652.D §3.1; ANSI/TIA-568.3-D §6.3.2]
- **D — Incorrect.** 125 µm is the cladding outer diameter — common to both SMF and MMF. It is not the core diameter. A common confusion point in field identification: both fiber types look identical from the outside; color-coded buffer (yellow = SMF, aqua = OM3/OM4) and labeling are the reliable identifiers. [ANSI/TIA-598-D Table 1]

---

**Q3.** A project engineer proposes using OM4 fiber for a 400-meter intra-campus link between two buildings at 40 Gbps. Which statement most accurately evaluates this proposal?

- A) The proposal is invalid; OS2 is required for all campus cabling under ANSI/TIA-758-C.
- B) The proposal is invalid; OM4 supports 40G only to 150 m — OS2 is required for this 400 m span. **[CORRECT]**
- C) The proposal is valid; OM4 supports 40G to at least 400 m.
- D) The proposal is invalid; OM5 is the minimum grade for any 40G application.

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C governs outside plant (OSP) infrastructure — conduit, direct-bury, aerial runs. Intra-campus building-to-building horizontal cabling falls under ANSI/TIA-568.3-D. OM4 can be a valid specification under TIA-568.3-D for campus horizontal runs within its distance ceiling; the standard does not categorically prohibit OM4 from campus cabling. [ANSI/TIA-758-C Scope §1; ANSI/TIA-568.3-D §6.3]
- **B — Correct.** OM4 supports 40GBASE-SR4 (using 4×10G parallel optics over MPO connectors) to a maximum channel length of **150 m** [ANSI/TIA-492AAAD §8]. A 400-meter run at 40 Gbps exceeds this specification by 2.7×. The engineer's proposal is invalid because OM4 will not sustain 40G over that distance due to modal dispersion. OS2 SMF with 40GBASE-LR4 transceivers is the correct specification for this span. [ANSI/TIA-492AAAD Table 8; ANSI/TIA-568.3-D §6.3.2.2]
- **C — Incorrect.** OM4's 40G ceiling is **150 m** (40GBASE-SR4, 850 nm VCSEL, MPO parallel optics). At 400 m, modal dispersion accumulates beyond the receiver's tolerance regardless of transceiver selection; no 40G transceiver standard supports OM4 at 400 m. This claim is false. [ANSI/TIA-492AAAD §8]
- **D — Incorrect.** OM5 offers no distance advantage over OM4 for standard 40GBASE-SR4 transmission. Both grades support 40G to the same 150 m ceiling under that standard. OM5's additional specification covers the 953 nm window for SWDM applications only. Requiring OM5 for all 40G applications would be over-specification with no technical benefit at standard distances and is not supported by any TIA or IEEE standard. [ANSI/TIA-492AAAE §8]

---

**Q4.** Which phenomenon is the primary bandwidth-limiting mechanism in multi-mode fiber?

- A) Chromatic dispersion
- B) Polarization mode dispersion
- C) Modal dispersion **[CORRECT]**
- D) Stimulated Brillouin scattering

*Rationale:*
- **A — Incorrect.** Chromatic dispersion is the bandwidth-limiting mechanism in single-mode fiber, caused by variation in propagation speed across the source's wavelength spectrum. It is present in MMF but is secondary to modal dispersion at the distances and speeds where MMF is used. [Corning OSP Reference, §3.2]
- **B — Incorrect.** Polarization mode dispersion (PMD) is a mechanism affecting long-haul SMF transmission, where slight asymmetry in the fiber core causes two polarization states of the same mode to travel at slightly different velocities. It is not the primary bandwidth limiter for MMF in the distance ranges where MMF is used. [ITU-T G.652.D §4.3]
- **C — Correct.** Modal dispersion results from the simultaneous propagation of multiple modes through the fiber core, each traveling a different path length and therefore arriving at the receiver at different times. This pulse-smearing effect imposes the hard distance ceiling characteristic of MMF. The graded-index profile in laser-optimized grades mitigates but does not eliminate modal dispersion. [BICSI OSP-DRD Manual, Ch. 5.2]
- **D — Incorrect.** Stimulated Brillouin scattering (SBS) is a nonlinear optical effect in SMF that can limit transmitted power on high-power DWDM systems — not a bandwidth-limiting mechanism relevant to MMF or to the distances covered by this lesson. [Corning OSP Reference, §5.1]

---

**Q5.** An OSP technician opens a cable vault and finds a fiber labeled with an aqua-colored buffer tube. Which fiber type does this indicate, and what is the implication for splicing equipment setup?

- A) Single-mode OS2; set the fusion splicer to SMF mode (9 µm alignment)
- B) Multi-mode OM3 or OM4; set the fusion splicer to MMF mode (50 µm alignment) **[CORRECT]**
- C) Single-mode OS1; set the fusion splicer to SMF mode (9 µm alignment)
- D) Multi-mode OM1; set the fusion splicer to MMF mode (62.5 µm alignment)

*Rationale:*
- **A — Incorrect.** Aqua buffer color is assigned to OM3 and OM4 laser-optimized multi-mode fiber, not to single-mode fiber. SMF is identified by a **yellow** buffer. Treating an OM3/OM4 fiber as SMF in the splicer's alignment mode would produce suboptimal core alignment and elevated splice loss (the splicer's image-based alignment targets 50 µm vs. 9 µm cores differently). [ANSI/TIA-598-D Table 1]
- **B — Correct.** Aqua buffer designates OM3 or OM4 laser-optimized 50/125 µm multi-mode fiber per ANSI/TIA-598-D. The fusion splicer should be set to MMF (multi-mode) alignment mode, which optimizes for 50 µm core-to-core alignment. Confirming with an OTDR trace at 850 nm before closing the closure is good practice. [ANSI/TIA-598-D Table 1; BICSI OSP-DRD Manual, Ch. 7.3]
- **C — Incorrect.** OS1 is single-mode fiber and is identified by a **yellow** buffer, not aqua. Additionally, OS1 is an indoor-grade fiber unlikely to be found in an OSP cable vault. [ANSI/TIA-598-D Table 1]
- **D — Incorrect.** OM1 (62.5 µm core) uses an **orange** buffer color, not aqua. A 62.5 µm MMF would be OM1 — a legacy grade rarely installed in new OSP work. [ANSI/TIA-598-D Table 1]

---

**Q6.** Which wavelength window offers the lowest attenuation for OS2 single-mode fiber, and at what approximate value?

- A) 850 nm; approximately 3.0 dB/km
- B) 1310 nm; approximately 0.4 dB/km
- C) 1550 nm; approximately 0.18–0.20 dB/km **[CORRECT]**
- D) 1625 nm; approximately 0.15 dB/km

*Rationale:*
- **A — Incorrect.** 850 nm is the operating window for VCSEL-driven multi-mode fiber (OM3/OM4). SMF is not typically operated at 850 nm; its cutoff wavelength for single-mode operation is approximately 1260 nm for G.652 fiber. Attenuation at 850 nm in SMF is much higher than at telecom wavelengths and this window is not used for SMF transmission. [ITU-T G.652.D §4.1]
- **B — Incorrect.** 1310 nm is OS2's zero-dispersion wavelength — preferred for short-to-medium haul SMF links where dispersion management is a priority. Attenuation at 1310 nm for OS2 is ≤0.4 dB/km per ANSI/TIA-568.3-D, which is the maximum specification, not the minimum-attenuation window. [ANSI/TIA-568.3-D §6.3.2.2]
- **C — Correct.** The 1550 nm window is the minimum-attenuation region for G.652 OS2 fiber, achieving typical values of **0.18–0.20 dB/km**. This window is used for long-haul transmission, DWDM systems, and any span where maximizing reach per amplifier span is the design goal. [ITU-T G.652.D §4.1]
- **D — Incorrect.** While 1625 nm (the L-band) does offer slightly lower attenuation than 1310 nm in G.652 fiber, it does not achieve 0.15 dB/km under normal conditions — typical attenuation at 1625 nm for G.652 is similar to 1550 nm (~0.19–0.22 dB/km). More importantly, 1625 nm is a specialized window used for OTDR testing and L-band DWDM; it is not routinely specified as a primary transmission window in standard OSP design. The minimum-attenuation window for standard specification purposes is 1550 nm. [ITU-T G.652.D §4.1]

---

## Final Check: Pulse Questions Before Lesson 2

Answer these three questions before advancing. If any answer is uncertain, review the relevant section above before proceeding to Lesson 2 (SMF Grades: OS1 vs. OS2).

**Pulse 1.** State the maximum supported reach of OS2 fiber at 10 Gbps using standard SFP+ LR transceivers, and the wavelength used.

*Expected answer:* OS2 supports 10 Gbps to a maximum of **10 km** with standard 10GBASE-LR transceivers at **1310 nm**, or up to **40 km** with 10GBASE-ER transceivers at **1550 nm**. The 10 km figure is the IEEE 802.3ae baseline; extended reach (40 km) uses 1550 nm and is covered by 10GBASE-ER or vendor-specified long-reach optics. [IEEE 802.3ae; ANSI/TIA-568.3-D §6.3.2.2]

**Pulse 2.** Name two reasons single-mode fiber is preferred over multi-mode fiber for OSP routing at distances greater than 2 km.

*Expected answer (any two of the following):*
1. SMF eliminates modal dispersion, removing the bandwidth-distance ceiling that constrains MMF to <600 m at 10G.
2. OS2 attenuation at 1550 nm (~0.18–0.20 dB/km) is 15–20× lower than OM4 attenuation at 850 nm (~3.0 dB/km), enabling multi-kilometer spans without amplification.
3. SMF supports future transceiver upgrades to 40G, 100G, 400G without fiber replacement; MMF requires fiber replacement when grade ceiling is reached.
4. ANSI/TIA-758-C requires OS2 for OSP feeder infrastructure; MMF does not meet the standard for outside plant use.

**Pulse 3.** Describe one situation where OM4 would be selected over OS2 in a professional cabling design.

*Expected answer:* OM4 would be selected for a **short-reach data-center or intra-building horizontal link** (under 150 m at 40G, or under 550 m at 10G) where the lower cost of 850 nm VCSEL transceivers (SFP+ SR, approximately $30–60/pair vs. $80–200/pair for SMF LR) provides a meaningful capital cost advantage and the distance is well within OM4's specification. OM4 remains appropriate for data-center structured cabling, top-of-rack to aggregation switch runs, and campus horizontal cabling within its bandwidth-distance limits.

---

## Glossary Cross-References

Terms introduced in this lesson that are used across the Cable Selection topic:

- **Single-mode fiber (SMF)** → used in Lesson 1.2 (OS1 vs. OS2 grades), Lesson 2.1 (loose-tube construction), Lesson 4.1 (environment selection), Lesson 5.1 (ANSI/TIA-758-C compliance)
- **Multi-mode fiber (MMF)** → used in Lesson 1.3 (OM1–OM5 application matrix)
- **OS2** → foundational term, referenced in every subsequent lesson
- **OM4 / OM5** → Lesson 1.3 (application matrix), Lesson 4.2 (connector selection for MPO/MTP)
- **Modal dispersion** → Lesson 2.3 (ribbon fiber and mass-fusion splicing — dispersion in high-fiber-count runs)
- **Wavelength windows (850/1310/1550 nm)** → Lesson 4.1 (transceiver selection by environment)
- **Chromatic dispersion** → forward reference to Lesson 1.2 (OS1/OS2 dispersion specs in G.652)
- **Numerical aperture (NA)** → forward reference to Lesson 4.2 (connector coupling loss and NA mismatch)
