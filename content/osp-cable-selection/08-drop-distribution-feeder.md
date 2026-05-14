---
title: "Lesson 8: Drop / Distribution / Feeder Hierarchy"
duration_min: 25
topic: cable-selection
order: 8
bicsi_alignment:
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
  - "OSP-DRD 5.5: Network architecture and cable hierarchy"
  - "OSP-DRD 6.1: OSP installation methods — aerial, direct-bury, conduit"
sources:
  - "ANSI/TIA-758-C §4.2, §5.3, §5.4, and §5.5"
  - "ANSI/TIA-568.3-D §6.3"
  - "IEC 60794-3 (optical fiber cables for duct, conduit, and direct-buried installation)"
  - "IEEE 1222 (all-dielectric self-supporting aerial fiber optic cable)"
  - "BICSI OSP-DRD Manual, Ch. 4 §4.1–4.3 and Ch. 5 §5.5"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 2 and Ch. 6"
  - "CommScope Cabling Systems Reference Manual Ch. 3"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §2"
---

# Drop / Distribution / Feeder Hierarchy

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Define the three tiers of the OSP cable hierarchy (feeder, distribution, drop) and state the function of each tier
- Identify the passive network elements (FDH, FDT, splice closure, handhole) that mark tier boundaries
- Apply fiber count sizing rules at each tier, accounting for passive splitter ratios and dark-fiber reserves
- Select appropriate cable construction for each tier based on route type, fiber count, and installation environment

---

## Reading Content

### The Hierarchy Problem

A fiber optic outside plant network must connect a small number of high-capacity sources — central offices, hub sites, aggregation nodes — to a large number of end points: buildings, service drops, cellular nodes, distribution closures. The ratio of sources to endpoints can be 1:100, 1:500, or 1:2000 depending on the network type. A flat architecture where every endpoint connects directly to the source with its own dedicated cable is physically and economically impossible at those ratios.

The industry solution is a **tiered hierarchical architecture** that concentrates capacity at the source end, branches progressively, and deploys smaller cables at increasing density approaching the endpoint. Every OSP network — fiber-to-the-home (FTTH), fiber-to-the-curb (FTTC), enterprise campus, utility SCADA, rural telecommunications — uses some variant of this three-tier model: **feeder, distribution, and drop** [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2].

### Tier 1 — Feeder Cable

**Feeder cable** (also called backbone or trunk cable in some contexts) runs from the central office or hub site to the first major branching point — typically a fiber distribution hub (FDH), a terminal node, or a serving area interface (SAI). It carries the total aggregated traffic for all downstream customers and routes it at high fiber count over the longest distances in the network [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.1].

**Feeder characteristics:**
- **Highest fiber count** in the network hierarchy. A feeder serving 500 homes with 32:1 passive splitters requires a minimum of 500 ÷ 32 = 16 feeder fibers for the active circuits alone — but BICSI OSP-DRD design guidelines recommend 4× the active count on feeder routes [BICSI OSP-DRD Manual, Ch. 5.5], so a properly specified feeder for this application would carry 64 or more fibers (typically 72- or 144-fiber standard cable)
- **Longest route.** Feeder runs often span 1–10+ km from hub to first branching point. This drives the cable specification toward high-fiber-count loose-tube OS2 with conduit or direct-bury installation
- **Minimum splicing.** Feeder routes should be engineered to minimize mid-route splice closures. Splices increase loss budget, add maintenance risk, and create arc flash hazards in underground environments. Express feeder routes ideally run cable-length to cable-length without mid-span splices
- **Repair consequence.** A feeder failure takes down all downstream customers simultaneously. Cable robustness (gel-fill, CST armor on direct-bury segments, ADSS on aerial segments through agricultural territory) and route diversity (two physically diverse feeder paths for critical facilities) are standard engineering practices [ANSI/TIA-758-C §5.5; BICSI OSP-DRD Manual, Ch. 4.2]

**Typical feeder cable spec:** 72–432 fiber, loose-tube OS2, gel-fill or dry water-blocking, CST armor if direct-bury, ADSS if aerial on energized utility line, PE sheath [ANSI/TIA-758-C §5.3; BICSI OSP-DRD Manual, Ch. 5.5].

### Tier 2 — Distribution Cable

**Distribution cable** runs from the feeder branching point (FDH or SAI) to secondary branching points — **fiber distribution terminals (FDTs)**, splice closures, or pedestal terminals in the serving area. Distribution cables serve clusters of customers — typically 8–64 homes or businesses — rather than the full serving area [BICSI OSP-DRD Manual, Ch. 4.2; ANSI/TIA-758-C §4.2].

**Distribution characteristics:**
- **Intermediate fiber count.** Smaller than feeder but larger than drop. Typical range: 12–144 fibers per run, depending on cluster size and network architecture. In FTTH passive optical network (PON) architectures, distribution cables often run to remote FDT locations where passive splitters divide each feeder fiber into 8–32 customer-facing drop fibers [Corning OSP Reference, Ch. 6.2; CommScope Reference Manual, Ch. 3.2]
- **Branching is the function.** The FDT is where feeder fibers split into multiple distribution fibers. In a fiber-deep architecture, passive splitters in the FDT divide one feeder fiber into 16 or 32 distribution strands, each of which becomes an individual customer drop. The FDT may be an underground pedestal, a pole-mounted closure, or an aerial splice terminal
- **Medium route length.** Distribution runs typically span 500 m–3 km from FDH to FDT. Route environment varies — conduit in suburban areas, direct-bury in residential streets, aerial lashed on secondary pole lines
- **Design multiple.** BICSI recommends 3× the active fiber count on distribution routes [BICSI OSP-DRD Manual, Ch. 5.5]. A distribution cable serving 32 customers (32 active fibers minimum) should carry 96 fibers; a 96-fiber cable (8-tube / 12-FPT) is a standard configuration

**Typical distribution cable spec:** 24–144 fiber, loose-tube OS2, gel-fill or dry water-blocking, no armor (conduit) or CST armor (direct-bury), PE sheath [ANSI/TIA-758-C §5.3].

### Tier 3 — Drop Cable

**Drop cable** (also called service cable or premises drop) runs from the distribution FDT or splice closure to the individual customer premises — a single building, MDU unit entry, or cellular node. It carries the minimum fiber count needed for one customer's circuits plus spare capacity [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.3].

**Drop characteristics:**
- **Lowest fiber count.** Single-family residential: typically 2-fiber or 4-fiber drop; MDU or business: 12-fiber or higher. The fiber count must provide the customer's active circuits plus at least one dark spare (2× minimum recommended)
- **Shortest route.** Drop distances typically range from 30 m to 300 m from the FDT to the customer premises. This short length makes replacement much more feasible than a feeder route — drives the lower design multiple
- **Highest density.** Many drops originate from a single FDT location, so the cable type must be installation-friendly in dense deployment. **All-dielectric flat drop** cables (2-fiber or 4-fiber, figure-8 or figure-9 cross-section with dielectric strength member, PE or UV-stabilized sheath) are widely used for aerial drop in FTTH deployments where the number of individual customer attachments is high and the installation method is semi-skilled labor [Corning OSP Reference, Ch. 6.3; AFL OSP Cable Design Guide, §2.2]
- **Ruggedized construction for direct-bury.** **Armored drop cables** — small-diameter (6–12 fiber), CST-armored with PE sheath — are specified for direct-bury service drops where the cable must survive from the FDT pedestal to the premises NID without conduit protection. The small diameter and flexible construction allow direct-bury in soft soil with a vibratory plow rather than a trencher [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

**Typical drop cable spec:** 2–12 fiber, flat or round loose-tube (or tight-buffer in short indoor/outdoor hybrid drops), all-dielectric PE sheath for aerial, CST-armored PE sheath for direct-bury [ANSI/TIA-758-C §5.3; BICSI OSP-DRD Manual, Ch. 4.3].

### Tier Boundaries: Passive Network Elements

The hierarchy tiers are delineated by specific passive network hardware. Fiber count changes (by splicing or connectorizing) only at these boundary points — never mid-span [BICSI OSP-DRD Manual, Ch. 4.1]:

| Element | Tier boundary | Function |
|---|---|---|
| **FDH (Fiber Distribution Hub)** | Feeder → Distribution | High-capacity splice/connector panel; feeder cables terminate here, distribution cables originate. May house passive splitters in PON networks |
| **FDT (Fiber Distribution Terminal)** | Distribution → Drop | Smaller splice/connector closure; distribution cable terminates, drop cables originate. Splitters often located here in fiber-deep architectures |
| **Splice closure** | Any tier | Waterproof mechanical enclosure protecting splice trays. Does not change fiber count — used for cable-to-cable jointing and repair |
| **Handhole / innerduct vault** | Any tier | Underground access point for cable management; not a splicing point in itself, but provides pull-in/pull-out access |

*Source: [BICSI OSP-DRD Manual, Ch. 4.1–4.3; ANSI/TIA-758-C §4.2]*

### Sizing a Feeder Run: Worked Example

A suburban FTTH project serves 480 homes via a hub site. The passive optical network architecture uses 32:1 splitters at FDT locations in the distribution tier. The feeder route is direct-bury from the hub to the FDH, 2.2 km.

**Step 1 — Active fiber count:**
480 homes ÷ 32 (splitter ratio) = 15 feeder fibers required for active circuits.

**Step 2 — Apply design multiple:**
BICSI 4× feeder multiplier: 15 × 4 = 60 fibers minimum.

**Step 3 — Select standard cable:**
The next standard cable size above 60 fibers in a 12-FPT tube design is **72 fibers** (6 tubes × 12 fibers). This provides the 60-fiber minimum with 12 dark fibers in reserve.

**Step 4 — Construction spec:**
Direct-bury 2.2 km route: loose-tube OS2, gel-fill, CST armor, PE sheath per ANSI/TIA-758-C §5.6. Minimum burial depth: 24 inches per ANSI/TIA-758-C §6.3.

**Step 5 — Repair loop allowance:**
Assume 3 splice closures on the route × 10 m slack each (per ANSI/TIA-758-C §6.4) = 30 m additional cable. Order 2.26 km of cable minimum (2,200 m route + 30 m slack + 30 m pulling pull-through reserve).

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5, §6.3, §6.4]*

---

## Key Terms (Flashcard Candidates)

**Feeder cable**
The highest-fiber-count tier in the OSP hierarchy. Runs from a central office or hub site to the first major branching point (FDH or SAI). Carries aggregated traffic for all downstream customers; failure takes down the entire serving area. Specified at 4× active count minimum per BICSI OSP-DRD guidelines. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.1]

**Distribution cable**
The intermediate tier. Runs from the FDH to secondary branching points (FDT or splice closure) serving customer clusters of 8–64 units. Intermediate fiber count; specified at 3× active count. Route length: 500 m–3 km typical. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.2]

**Drop cable**
The customer-facing tier. Runs from the FDT or splice closure to the individual premises. Lowest fiber count (2–12 fibers typical); specified at 2× active count. Route length: 30–300 m typical. Available in flat all-dielectric (aerial) or armored (direct-bury) variants. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.3]

**FDH (Fiber Distribution Hub)**
The passive network element marking the feeder-to-distribution boundary. A high-capacity splice and/or connector housing where feeder cables terminate and distribution cables originate. May house passive splitters in PON architectures. [BICSI OSP-DRD Manual, Ch. 4.1]

**FDT (Fiber Distribution Terminal)**
The passive network element marking the distribution-to-drop boundary. A smaller splice or connector closure where distribution cables terminate and drop cables originate. Frequently houses passive splitters in fiber-deep PON architectures. Often pedestal-mounted or pole-mounted. [BICSI OSP-DRD Manual, Ch. 4.2]

**Passive optical network (PON)**
A point-to-multipoint fiber architecture using passive splitters — no powered electronics in the distribution tier. One feeder fiber is divided by a splitter (typically 16:1 or 32:1) into multiple drop-level signals. PON architectures are the dominant FTTH technology. Splitter location (at FDH vs. FDT) determines whether the architecture is "fiber-deep" or "fiber-to-the-node." [Corning OSP Reference, Ch. 6.2; CommScope Reference Manual, Ch. 3.2]

**Splice closure**
A waterproof mechanical enclosure that houses fiber splice trays and protects fusion splices from moisture and mechanical stress. Located at cable-to-cable joints within or between tiers. Does not change fiber count; used for cable jointing and repairs. [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2]

**Flat all-dielectric drop cable**
A 2- or 4-fiber drop cable designed for aerial service, typically in a figure-8 or flat profile cross-section with dielectric strength members and PE or UV-stabilized sheath. Designed for high-density FTTH aerial drop deployment where semi-skilled labor installs many drops from a single FDT location. [Corning OSP Reference, Ch. 6.3; AFL OSP Cable Design Guide, §2.2]

**Armored drop cable**
A small-diameter (6–12 fiber) loose-tube cable with CST armor and PE sheath, designed for direct-bury service drops from FDT pedestal to premises NID without conduit protection. Small enough for vibratory plow installation. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

**Splitter ratio**
The passive division factor at an optical splitter — the ratio of input fibers to output fibers. Common ratios: 1:8, 1:16, 1:32. Determines how many feeder fibers are required to serve a given number of customers in a PON architecture. Example: 480 customers ÷ 32:1 splitter = 15 feeder fibers minimum. [Corning OSP Reference, Ch. 6.2]

---

## Interactive: Scenario — Size a Feeder Run

### Scenario

A rural electric cooperative is deploying a fiber-to-the-home network in a 650-customer service territory. The hub site is 4.8 km from the FDH at the center of the serving area. The planned PON architecture uses 32:1 passive splitters at FDT pedestals in the distribution tier. A second SCADA utility network is planned to share the feeder with 8 dedicated OS2 fibers.

The route is direct-bury through agricultural land with no significant rodent pressure documented. One road crossing under a county highway is included in the route.

**Task:** Specify the feeder cable fiber count and construction.

---

**Option A: 24-fiber cable, loose-tube OS2, no armor, PE sheath**

*Assessment:*

This specification fails on both fiber count and construction.

Fiber count: 650 homes ÷ 32 (splitter) = 21 active feeder fibers. Plus 8 SCADA fibers = 29 active. Applying BICSI 4× feeder design multiple: 29 × 4 = 116 fibers minimum. A 24-fiber cable provides zero headroom above the 29 active circuits and is dramatically under-specified. [BICSI OSP-DRD Manual, Ch. 5.5]

Construction: A 4.8 km direct-bury route through agricultural land requires CST armor for mechanical protection against burial forces and incidental rodent activity. No-armor PE sheath cable is appropriate for conduit installation, not direct-bury in native soil. [ANSI/TIA-758-C §5.6]

**Feedback: Incorrect.** Both fiber count and construction are undersized for this route.

---

**Option B: 144-fiber cable, loose-tube OS2, gel-fill, CST armor, PE sheath — with deeper burial at road crossing**

*Assessment:*

This specification is correct on all parameters.

Fiber count: 29 active fibers × 4 (BICSI feeder multiple) = 116 fibers minimum. A 144-fiber cable (12-tube × 12-FPT) is the standard configuration above 116 — providing 28 dark fibers in reserve beyond the active count. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5]

Construction: Direct-bury 4.8 km agricultural route — loose-tube OS2, gel-fill, CST armor, PE sheath per ANSI/TIA-758-C §5.6. At the county highway crossing: burial depth minimum 36 inches (914 mm) per ANSI/TIA-758-C §6.3; bore under the road to avoid cutting the highway surface (standard practice for rural road crossings). [ANSI/TIA-758-C §5.6, §6.3]

**Feedback: Correct.** Fiber count meets the BICSI 4× feeder design multiple; construction matches the direct-bury route requirements; road crossing depth complies with ANSI/TIA-758-C §6.3.

---

**Option C: 72-fiber cable, loose-tube OS2, gel-fill, no armor, PE sheath**

*Assessment:*

Fiber count is borderline — 72 fibers exceeds the 116-fiber minimum calculated above... actually it does not: 72 < 116. This specification is also undersized on fiber count. Additionally, the no-armor construction is inappropriate for direct-bury in agricultural soil. A 72-fiber cable is appropriate for a distribution route (where 3× design multiple is used and serving area is smaller), not a feeder route of this scale. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.6]

**Feedback: Incorrect.** 72 fibers does not meet the 116-fiber minimum for this feeder, and no-armor construction is inappropriate for direct-bury.

---

## Multiple-Choice Quiz

---

**Q1.** In a fiber-to-the-home PON architecture, at which tier boundary is the passive splitter most commonly located in a "fiber-deep" deployment?

- A) Feeder-to-FDH boundary (between feeder and distribution)
- B) FDH to distribution run (mid-distribution)
- C) Distribution-to-FDT boundary, within the FDT pedestal **[CORRECT]**
- D) At the customer premises NID (network interface device)

*Rationale:*
- **A — Incorrect.** Placing the splitter at the FDH means the feeder cable carries only "split" (low-power) signals to the distribution tier — which increases the number of fibers in the distribution tier and pushes optical power budget challenges onto the distribution runs. In "fiber-deep" architectures, the splitter is placed closer to the customer to preserve optical budget for the distribution runs and reduce feeder fiber count. [Corning OSP Reference, Ch. 6.2]
- **B — Incorrect.** Splitters are installed at passive network element locations — closures, pedestals, FDTs — not in the middle of a cable span. Mid-distribution placement would require an additional enclosure and splice point. [BICSI OSP-DRD Manual, Ch. 4.2]
- **C — Correct.** In fiber-deep PON deployments, passive splitters are located within the **FDT (Fiber Distribution Terminal)** — the distribution-to-drop boundary. This minimizes feeder fiber count (one feeder fiber serves up to 32 customers through the 32:1 splitter at the FDT), places the splitting as close as practical to the end customer, and concentrates splitter inventory at a manageable number of FDT locations. [BICSI OSP-DRD Manual, Ch. 4.2; Corning OSP Reference, Ch. 6.2]
- **D — Incorrect.** Placing the passive splitter at the customer premises would require a dedicated feeder or distribution fiber per customer for the full route length — negating the entire purpose of passive splitting. PON splitters are network-side (pre-customer) elements, not premises equipment. [Corning OSP Reference, Ch. 6.2]

---

**Q2.** A designer is sizing a distribution cable for a residential cluster of 48 homes. The architecture uses 16:1 splitters at the FDT, and the distribution cable runs from the FDH to the FDT serving this cluster. What is the minimum fiber count for this distribution cable using the BICSI design multiple?

- A) 3 fibers — one feeder fiber split 16:1 covers 16 homes, and 3 feeder fibers × 16 = 48 homes
- B) 9 fibers — 3 active fibers × 3× BICSI distribution multiple
- C) 48 fibers — one fiber per home
- D) 3 active fibers × 3 = 9 fibers — but rounded up to a standard 12-fiber cable **[CORRECT]**

*Rationale:*
- **A — Incorrect.** 3 fibers (one fiber per 16 customers) is the active-circuit count, not the design count. The BICSI 3× distribution design multiple requires multiplying the active count by 3 before comparing to standard cable sizes. [BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Incorrect.** The answer reaches the correct product (9 fibers) but does not account for the next step: selecting the standard cable configuration. 9 fibers is not a standard loose-tube cable size (standard is 6, 12, 24, etc.). The 9-fiber minimum rounds up to a 12-fiber cable in a standard 1-tube / 12-FPT or 2-tube / 6-FPT configuration. Without the rounding step, the specification is not actionable. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]
- **C — Incorrect.** One fiber per home would be the correct count if each customer had a dedicated, unsplit fiber all the way back to the hub. In a PON architecture with 16:1 splitters, each feeder fiber serves 16 customers — the distribution cable does not carry one fiber per customer. [Corning OSP Reference, Ch. 6.2]
- **D — Correct.** 48 homes ÷ 16 (splitter ratio) = **3 active feeder fibers** serving this cluster. BICSI 3× distribution multiple: 3 × 3 = **9 fibers minimum**. The smallest standard cable configuration above 9 fibers is **12 fibers** (1-tube × 12-FPT, or 2-tube × 6-FPT). Specifying a 12-fiber cable provides the 9-fiber minimum with 3 dark fibers in reserve. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

---

**Q3.** A feeder cable failure takes down service to 640 customers simultaneously. What network engineering practice most directly mitigates the risk of a feeder cut causing a total service outage?

- A) Installing a higher-fiber-count cable on the feeder route to allow fiber reassignment after a cut
- B) Specifying CST-armored cable on the feeder route to prevent cable cuts
- C) Engineering physically diverse dual-feeder paths from the hub to the FDH **[CORRECT]**
- D) Installing additional splice closures on the feeder to create repair access points

*Rationale:*
- **A — Incorrect.** A higher fiber count does not help if the physical cable is severed — all fibers are cut simultaneously when a cable is damaged. Fiber count redundancy within a single cable route has no value against a physical cut event. [BICSI OSP-DRD Manual, Ch. 4.2]
- **B — Incorrect.** CST armor provides rodent deterrence and burial-force protection, but it does not prevent a cable cut from a backhoe, directional drill strike, or road-widening excavation. Armor is not a protection against excavation damage — it is a protection against environmental and mechanical stresses in undisturbed soil. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]
- **C — Correct.** **Physically diverse dual feeder paths** — two feeder cables routed on separate physical paths between the hub and the FDH — ensure that a single cut event on one path does not take down the entire serving area. With path diversity, traffic can be rerouted from the cut feeder to the surviving feeder while the cut is repaired. This is the standard high-availability engineering practice for feeder routes serving large customer populations. [BICSI OSP-DRD Manual, Ch. 4.2; ANSI/TIA-758-C §5.5]
- **D — Incorrect.** Additional splice closures on the feeder route create additional maintenance points and potential failure locations without providing redundancy. A splice closure provides access for repair after a cut, but it does not prevent a cut from taking down all customers during the repair period. Repair access is not the same as redundancy. [BICSI OSP-DRD Manual, Ch. 4.2]

---

**Q4.** Which cable construction is most appropriate for a 150-foot aerial service drop from an FTTH FDT pedestal on a pole to a single-family residence in a suburban neighborhood?

- A) 144-fiber armored direct-bury cable — maximum strand count ensures future capacity
- B) 2-fiber flat all-dielectric drop cable with UV-stabilized PE sheath **[CORRECT]**
- C) 12-fiber indoor tight-buffer breakout cable — easy to terminate at the customer NID
- D) 24-fiber loose-tube conduit cable — standard OSP construction applies to drops

*Rationale:*
- **A — Incorrect.** A 144-fiber armored cable for a single-family residential drop is massive over-specification. The armored direct-bury construction is not appropriate for aerial service; ADSS or flat aerial drop cable is designed for aerial deployment. A 150-foot aerial drop to one residence requires 2–4 active fibers at most. [AFL OSP Cable Design Guide, §2.2; BICSI OSP-DRD Manual, Ch. 4.3]
- **B — Correct.** The **flat all-dielectric drop cable** (2-fiber or 4-fiber, figure-8 or flat cross-section, dielectric strength member, UV-stabilized PE sheath) is the industry-standard cable for aerial FTTH service drops from FDT to residential premises. It is light enough for a single technician to install, rated for aerial UV exposure, provides the 2 active fibers needed for one residential customer with one dark spare, and is designed for the high-deployment-volume, semi-skilled installation labor model used in FTTH rollouts. [AFL OSP Cable Design Guide, §2.2; Corning OSP Reference, Ch. 6.3; BICSI OSP-DRD Manual, Ch. 4.3]
- **C — Incorrect.** Indoor tight-buffer breakout cable is not appropriate for aerial outdoor service drops. It lacks UV stabilization, water-blocking appropriate for outdoor exposure, and the mechanical protection required for aerial installation. NEC Article 770 would also prohibit outdoor use of unlisted indoor cable. [ANSI/TIA-568.3-D §6.4; BICSI OSP-DRD Manual, Ch. 5.3.3]
- **D — Incorrect.** Standard 24-fiber conduit cable is mechanically over-built and over-specced in fiber count for a single-family aerial service drop. More importantly, standard round loose-tube OSP cable is not designed for aerial attachment to pole hardware at 150-foot span lengths — aerial drop cable is engineered with the specific sag, UV, and attachment hardware requirements of the drop application. [AFL OSP Cable Design Guide, §2.2]

---

**Q5.** A project engineer is reviewing a feeder design and notes the feeder route has 7 splice closures. ANSI/TIA-758-C requires 10 meters of slack at each. The route distance is 3.5 km. What minimum cable length should the engineer order to cover the route distance plus all repair loop requirements?

- A) 3,500 meters
- B) 3,570 meters **[CORRECT]**
- C) 3,650 meters
- D) 4,200 meters

*Rationale:*
- **A — Incorrect.** 3,500 meters covers only the route distance. No provision is made for the mandatory ANSI/TIA-758-C §6.4 repair loop slack at each splice closure. Ordering the cable without slack allowance would result in insufficient cable to achieve the required 10 meters of slack coil at each splice location. [ANSI/TIA-758-C §6.4]
- **B — Correct.** Route distance: 3,500 m. Repair loop slack: 7 splice closures × 10 m = **70 m**. Total minimum order: **3,500 + 70 = 3,570 m**. In practice, engineers typically add a 5–10% contingency for unexpected obstacles, route-length measurement error, and pulling reserve at the start and end of the route — but the minimum per ANSI/TIA-758-C §6.4 calculation is 3,570 m. [ANSI/TIA-758-C §6.4]
- **C — Incorrect.** 3,650 m implies 150 m of slack (7 × ~21.4 m per splice), which overstates the ANSI/TIA-758-C §6.4 requirement of 10 m per splice (70 m total). Adding a contingency beyond 3,570 m is reasonable but 150 m exceeds the specific calculation requested. [ANSI/TIA-758-C §6.4]
- **D — Incorrect.** 4,200 m would imply a 20% slack addition — well beyond the ANSI/TIA-758-C §6.4 minimum calculation. This might be ordered as a contingency buffer on a complex route, but it is not the minimum required by the standard calculation. [ANSI/TIA-758-C §6.4]

---

## Final Check

Answer before proceeding to Lesson 9 (Connector & Termination Options).

**Pulse 1.** Name the three tiers of the OSP cable hierarchy and the passive network element that marks the boundary between each pair of adjacent tiers.

*Expected answer:*
1. **Feeder** — from hub/central office to the **FDH (Fiber Distribution Hub)** (feeder→distribution boundary)
2. **Distribution** — from FDH to the **FDT (Fiber Distribution Terminal)** (distribution→drop boundary)
3. **Drop** — from FDT to the customer premises NID
[BICSI OSP-DRD Manual, Ch. 4.1–4.3; ANSI/TIA-758-C §4.2]

**Pulse 2.** A distribution route serves 96 homes through 32:1 splitters. Using the BICSI design multiple for distribution cable, what is the minimum fiber count, and what standard cable configuration covers it?

*Expected answer:* 96 homes ÷ 32 (splitter) = **3 active fibers**. BICSI 3× distribution multiple: 3 × 3 = **9 fibers minimum**. Standard cable: **12-fiber** (1-tube × 12-FPT) — the smallest standard configuration above 9 fibers. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

**Pulse 3.** What distinguishes a flat all-dielectric drop cable from a standard round loose-tube distribution cable, and why is the flat drop cable preferred for high-volume FTTH aerial service deployment?

*Expected answer:* A **flat all-dielectric drop cable** has a flattened (figure-8 or rectangular) cross-section, 2–4 fibers, dielectric strength members, and UV-stabilized PE sheath. Compared to a round loose-tube distribution cable, it is: lighter (reducing pole loading on multiple drops from one attachment point), easier for technicians to handle and attach to customer premise hardware, available in 2- or 4-fiber counts matched to single-customer circuits, and manufactured in continuous lengths suitable for reel-and-roll direct-from-the-vehicle deployment. The flat profile also lends itself to building entry hardware designed for single-fiber-count drops at the customer NID. Standard round loose-tube cable is designed for the higher-stress environments (conduit pulling, direct-bury, long spans) of feeder and distribution tiers where bulk handling and armor matter more than ease of individual deployment. [AFL OSP Cable Design Guide, §2.2; Corning OSP Reference, Ch. 6.3; BICSI OSP-DRD Manual, Ch. 4.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Feeder / distribution / drop** → foundational terms used in Lessons 10–12; Lesson 10 addresses environment-specific cable selection within each tier; Lesson 12 compliance checklist includes tier documentation requirements
- **FDH / FDT** → Lesson 10 (environment selection — cable type choices at FDH and FDT boundaries), Lesson 12 (compliance — splice closure and BET documentation)
- **PON / splitter ratio** → Lesson 10 (cable selection by environment — fiber count calculations for FTTH vs. enterprise campus vs. utility SCADA architectures are driven by splitter ratios)
- **Flat all-dielectric drop cable / armored drop cable** → Lesson 7 (sheath options — drop cable sheath is PE or UV-stabilized PE; armored drop uses CST armor), Lesson 10 (environment selection — drop cable variant choice by installation method)
- **Splice closure** → Lesson 12 (compliance checklist — splice closure bonding and grounding, slack coil documentation), Lesson 7 (sheath — splice closures use BET-equivalent sealing at cable ends)
- **Design multiple (4× feeder, 3× distribution, 2× drop)** → Lesson 6 (strand counts — design multiples first introduced there in tabular form; this lesson applies them in worked examples), Lesson 12 (compliance — as-built dark-fiber documentation)
