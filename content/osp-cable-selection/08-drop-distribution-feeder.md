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

## In Plain English

A fiber network connects a small number of powerful hub sites to thousands of individual homes and businesses. You can't run a separate cable from the hub directly to every single house — that would be like running a dedicated water main from the treatment plant to every faucet in the city. Instead, engineers use a tiered system: big cables carry lots of capacity from the hub to a central distribution point, medium cables branch out from there to smaller clusters of customers, and short thin cables run the final leg to each individual building. This lesson explains how that three-tier system works, where each tier starts and stops, and how to size each tier correctly.

---

## Quick Acronym Reference

| Acronym / Term | What it stands for | Plain-English gloss |
|---|---|---|
| **OSP** | Outside Plant | All outdoor cable infrastructure |
| **FDH** | Fiber Distribution Hub | A large splice/connector cabinet where feeder cable ends and distribution cable begins |
| **FDT** | Fiber Distribution Terminal | A smaller splice/connector box where distribution cable ends and individual drop cables begin. Often an outdoor pedestal or pole-mounted closure |
| **SAI** | Serving Area Interface | An alternative name for the first major branching point on a network; similar function to FDH |
| **NID** | Network Interface Device | The termination box at the customer's building — where the outside plant ends and the customer's inside wiring begins |
| **PON** | Passive Optical Network | A fiber network architecture that uses passive (unpowered) splitters to divide one fiber signal into many customer signals |
| **FTTH** | Fiber to the Home | A network design where fiber runs all the way to the individual residential building |
| **FTTC** | Fiber to the Curb | A network design where fiber runs to a node near the customer; the last short segment uses copper or another medium |
| **ADSS** | All-Dielectric Self-Supporting | Aerial cable with no metal, holds itself up between poles |
| **ANSI/TIA-758-C** | TIA standard 758 revision C | The outdoor fiber cable rulebook |
| **BICSI OSP-DRD** | BICSI Outside Plant Design Reference | The main OSP design guidelines manual |
| **MDU** | Multi-Dwelling Unit | An apartment building or condo complex |
| **SCADA** | Supervisory Control and Data Acquisition | A computer control system for managing equipment like power grid switches, water pumps, etc. Needs dedicated fiber on utility networks |

---

## Reading Content

### The Hierarchy Problem — Why We Need Tiers

Imagine you're the engineer for a rural electric cooperative that just decided to run fiber to every home in a 500-home service territory. The hub site (where your electronics live) is at one central location. You cannot run 500 individual cables from that building to 500 homes — the cost, the conduit space, and the cable management would be impossible.

The industry solution is a **tiered hierarchical architecture**: big cables carry aggregated capacity from the source, then progressively split into smaller cables as they get closer to individual customers. Every OSP network — whether it's serving 50 homes or 50,000 — uses some version of this three-tier model: **feeder, distribution, and drop**. [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2]

---

### Tier 1 — Feeder Cable

**The analogy:** Feeder cable is like the main water line leaving a treatment plant. It's the biggest pipe, carries the most capacity, and serves the entire downstream area.

Feeder cable runs from the hub site or central office to the first major branching point — typically an **FDH (Fiber Distribution Hub)**. Think of the FDH as a big splice panel in a cabinet: feeder cable comes in on one side, distribution cables leave on the other side. Everything downstream of the FDH depends on the feeder cable upstream of it. If the feeder is cut, every customer in the serving area loses service. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.1]

**Feeder characteristics:**
- **Highest fiber count** in the network — it aggregates capacity for everyone downstream
- **Longest route** — often 1–10+ km from the hub to the first branching point
- **Highest consequence if it fails** — one cut takes down all downstream customers simultaneously. This is why feeder routes on critical facilities get engineered with two physically separate paths (route diversity), so a backhoe hit on one path doesn't take everyone down
- **Design multiple: 4× the active fiber count** — because replacing a feeder route is enormously expensive [BICSI OSP-DRD Manual, Ch. 5.5]

**Typical feeder cable spec:** 72–432 fiber, loose-tube OS2, gel-fill or dry water-blocking, CST armor if direct-burial, ADSS if aerial on an energized utility pole line, PE sheath. [ANSI/TIA-758-C §5.3; BICSI OSP-DRD Manual, Ch. 5.5]

---

### Tier 2 — Distribution Cable

**The analogy:** Distribution cable is like the neighborhood water mains branching off the main line. Medium-sized pipes serving clusters of buildings, not the whole city.

Distribution cable runs from the FDH to secondary branching points — **FDT (Fiber Distribution Terminals)**, which are smaller splice/connector boxes in the field, often mounted on poles or in underground pedestals. Each FDT serves a cluster of 8–64 customers. [BICSI OSP-DRD Manual, Ch. 4.2; ANSI/TIA-758-C §4.2]

**In a PON (Passive Optical Network) architecture**, distribution cables often run to FDT locations where **passive splitters** — small glass components that divide one light signal into many without using electricity — divide each feeder fiber into 8, 16, or 32 customer-facing signals. The ratio is called the **splitter ratio** (e.g., 32:1 means one feeder fiber feeds 32 customers). This is how fiber-to-the-home (FTTH) networks achieve such high customer density per feeder fiber.

**Distribution characteristics:**
- **Intermediate fiber count** — smaller than feeder, larger than drop; typically 12–144 fibers per run
- **Branching is the main job** — the FDT is where one distribution run splits into many customer drops
- **Medium route length** — typically 500 m to 3 km from FDH to FDT
- **Design multiple: 3× the active fiber count** [BICSI OSP-DRD Manual, Ch. 5.5]

**Typical distribution cable spec:** 24–144 fiber, loose-tube OS2, gel-fill or dry water-blocking, no armor for conduit runs / CST armor for direct-burial, PE sheath. [ANSI/TIA-758-C §5.3]

---

### Tier 3 — Drop Cable

**The analogy:** Drop cable is like the individual service line running from the neighborhood water main to your house. Short, small, serving one customer.

Drop cable runs from the FDT to the individual customer's building, terminating at the **NID (Network Interface Device)** — the wall box where outside plant ends and inside wiring begins. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.3]

**Drop characteristics:**
- **Lowest fiber count** — typically 2–4 fibers for a single-family home; 12+ for a business or MDU (apartment building)
- **Shortest route** — typically 30–300 meters from FDT to customer building
- **Easiest to replace** — because it's short and serves only one customer, replacement is far less expensive than feeder or distribution work
- **Design multiple: 2× the active fiber count**
- **High deployment density** — many drops come off a single FDT; the cable type needs to be easy to handle and install in volume

**Two drop cable variants:**

**All-dielectric flat drop cable** — For aerial service. Picture a thin flat ribbon with two or four fiber strands and plastic strength members, UV-resistant outdoor jacket. Designed for quick installation by a technician attaching it from an FDT pole to a customer's house — lightweight, easy to handle, easy to terminate. [Corning OSP Reference, Ch. 6.3; AFL OSP Cable Design Guide, §2.2]

**Armored drop cable** — For direct-burial service (when there's no pole near the customer's house). A small-diameter (6–12 fiber) cable with CST armor and gel fill, PE outer jacket — designed to be plowed directly into the ground with a vibratory plow (a machine that slices the soil, lays cable, and closes the slot without a full trench). [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

---

### Tier Boundaries: The Passive Hardware That Marks Each Handoff

Fiber count changes (by splicing or connectorizing) only at these boundary points — never mid-span. [BICSI OSP-DRD Manual, Ch. 4.1]

| Element | Tier boundary | Function |
|---|---|---|
| **FDH (Fiber Distribution Hub)** | Feeder → Distribution | High-capacity splice/connector panel; feeder terminates here, distribution cable begins |
| **FDT (Fiber Distribution Terminal)** | Distribution → Drop | Smaller splice/connector closure; distribution cable terminates, drop cables begin. Passive splitters often live here in PON networks |
| **Splice closure** | Any tier | Waterproof enclosure protecting fusion splices. Does NOT change fiber count — used purely for cable-to-cable joining and repairs |
| **Handhole / vault** | Any tier | Underground access box for pulling and managing cable; not a splicing point by itself |

*Source: [BICSI OSP-DRD Manual, Ch. 4.1–4.3; ANSI/TIA-758-C §4.2]*

---

### Sizing a Feeder Run: Worked Example

Here's how to actually calculate what a feeder cable needs to carry. Work through each step — the math is arithmetic, not calculus.

**Scenario:** A suburban FTTH project serves 480 homes from one hub site. The PON architecture uses 32:1 passive splitters at FDT locations in the distribution tier. The feeder route is direct-burial from the hub to the FDH, 2.2 km.

**Step 1 — Figure out how many feeder fibers the active circuits need:**

Each splitter takes 1 feeder fiber and divides it into 32 customer signals. So:

480 homes ÷ 32 (splitter ratio) = **15 feeder fibers** needed for active circuits

Sanity check: 15 fibers × 32 customers per fiber = 480 customers. That's right.

**Step 2 — Apply the BICSI feeder design multiple:**

15 active fibers × 4 (BICSI 4× feeder multiple) = **60 fibers minimum**

This gives you 45 dark fiber pairs in reserve for growth and repairs.

**Step 3 — Select a standard cable configuration:**

60 fibers isn't a standard catalog size. The next standard loose-tube cable above 60 fibers at 12 fibers per tube is **72 fibers** (6 tubes × 12 fibers). This provides the 60-fiber minimum plus 12 more dark fibers.

**Step 4 — Write the construction spec:**

Direct-burial 2.2 km route: loose-tube OS2, gel-fill, CST armor, PE sheath per ANSI/TIA-758-C §5.6. Minimum burial depth: 24 inches per ANSI/TIA-758-C §6.3.

**Step 5 — Add repair loop allowance to the cable order length:**

Assume 3 splice closures on the route × 10 m slack each (ANSI/TIA-758-C §6.4 minimum) = 30 m extra.
Add a 30 m pulling reserve for the pull-in end and pull-out end.
Total cable order: 2,200 m (route) + 30 m (slack) + 30 m (reserve) = **2,260 m minimum.**

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5, §6.3, §6.4]*

---

## Key Terms (Flashcard Candidates)

**Feeder cable**
The highest-fiber-count tier in the OSP hierarchy. Runs from a hub or central office to the first major branching point (FDH). Carries all traffic for the entire downstream serving area. One cable failure takes down all customers below it. Design multiple: 4× active count. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.1]

**Distribution cable**
The middle tier. Runs from the FDH to smaller branching points (FDT). Serves clusters of 8–64 customers. Design multiple: 3× active count. Route length: typically 500 m–3 km. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.2]

**Drop cable**
The customer-facing tier. Runs from the FDT to the individual building NID. Lowest fiber count (2–12 fibers typical); design multiple: 2× active count. Route length: 30–300 m typical. Available in flat aerial (all-dielectric) or armored direct-burial variants. [ANSI/TIA-758-C §4.2; BICSI OSP-DRD Manual, Ch. 4.3]

**FDH (Fiber Distribution Hub)**
The cabinet or enclosure marking the feeder-to-distribution boundary. Feeder cables terminate here; distribution cables originate here. May house passive splitters in PON architectures. Think of it as the main distribution panel for the neighborhood. [BICSI OSP-DRD Manual, Ch. 4.1]

**FDT (Fiber Distribution Terminal)**
A smaller enclosure or pedestal marking the distribution-to-drop boundary. Distribution cables terminate here; drop cables originate. Often houses passive splitters in fiber-deep architectures. Found in outdoor pedestals or on poles in the serving area. [BICSI OSP-DRD Manual, Ch. 4.2]

**Passive optical network (PON)**
A FTTH architecture where passive (unpowered) glass splitters divide one feeder fiber signal into many customer-facing signals. No electronics in the field between the hub and the customer. Common splitter ratios: 16:1 or 32:1. [Corning OSP Reference, Ch. 6.2; CommScope Reference Manual, Ch. 3.2]

**Splice closure**
A waterproof enclosure housing fiber splice trays. Used to join two cable runs or repair a break. Does not change fiber count — it is a jointing point, not a branching point. [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2]

**Flat all-dielectric drop cable**
A thin, flat aerial service drop cable (2–4 fibers, figure-8 or rectangular cross-section, dielectric strength members, UV-resistant PE jacket). Lightweight, designed for fast high-volume installation of many individual service drops from one FDT pole to nearby homes. [Corning OSP Reference, Ch. 6.3; AFL OSP Cable Design Guide, §2.2]

**Armored drop cable**
A small-diameter (6–12 fiber) cable with CST armor, gel fill, and PE sheath for direct-burial residential service drops. Small enough for vibratory plow installation directly into the soil without a trench. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

**Splitter ratio**
The passive division factor at an optical splitter — how many customer output signals come from one input signal. Common ratios: 1:8, 1:16, 1:32. Determines how many feeder fibers are required: total customers ÷ splitter ratio = active feeder fibers needed. [Corning OSP Reference, Ch. 6.2]

---

## Interactive: Scenario — Size a Feeder Run

### Scenario

A rural electric cooperative is deploying a fiber-to-the-home network in a 650-customer service territory. The hub site is 4.8 km from the FDH at the center of the serving area. The planned PON architecture uses 32:1 passive splitters at FDT pedestals in the distribution tier. A second SCADA utility network is planned to share the feeder with 8 dedicated OS2 fibers (for the co-op's electrical grid control system).

The route is direct-burial through agricultural land with no significant rodent pressure documented. One road crossing under a county highway is included in the route.

**Task:** Specify the feeder cable fiber count and construction.

---

**Option A: 24-fiber cable, loose-tube OS2, no armor, PE sheath**

*Assessment:*

This specification fails on both fiber count and construction.

Fiber count: 650 homes ÷ 32 (splitter) = 21 active feeder fibers. Plus 8 SCADA fibers = 29 active. Applying the BICSI 4× feeder multiple: 29 × 4 = 116 fibers minimum. A 24-fiber cable provides essentially zero headroom above the 29 active circuits — completely wrong. [BICSI OSP-DRD Manual, Ch. 5.5]

Construction: A 4.8 km direct-burial route through agricultural land requires CST armor for compressive soil forces and whatever incidental rodent pressure may exist. An unarmored cable is fine in conduit — it fails the specification for native-soil burial. [ANSI/TIA-758-C §5.6]

**Feedback: Incorrect.** Both fiber count and construction are undersized.

---

**Option B: 144-fiber cable, loose-tube OS2, gel-fill, CST armor, PE sheath — with deeper burial at the road crossing**

*Assessment:*

This specification is correct on all points.

Fiber count: 29 active fibers × 4 (BICSI feeder multiple) = 116 fibers minimum. A 144-fiber cable (12-tube × 12-FPT) is the standard configuration above 116 — providing 28 dark fibers beyond the calculated minimum. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5]

Construction: Direct-burial 4.8 km agricultural route — loose-tube OS2, gel-fill, CST armor, PE sheath per ANSI/TIA-758-C §5.6. At the county highway crossing: minimum burial depth 36 inches (914 mm) per ANSI/TIA-758-C §6.3; bore under the road rather than cutting the pavement surface. [ANSI/TIA-758-C §5.6, §6.3]

**Feedback: Correct.** Fiber count meets the BICSI 4× minimum; construction matches the direct-burial environment; road crossing depth complies with ANSI/TIA-758-C §6.3.

---

**Option C: 72-fiber cable, loose-tube OS2, gel-fill, no armor, PE sheath**

*Assessment:*

Fiber count: 72 is below the 116-fiber minimum — wrong. Construction: no armor is inappropriate for direct-burial in agricultural soil — also wrong. A 72-fiber unarmored cable might be right for a shorter distribution run in conduit, but it fails both requirements for this feeder route.

**Feedback: Incorrect.** 72 fibers doesn't meet the 116-fiber minimum, and no armor is wrong for direct-burial.

---

## Multiple-Choice Quiz

---

**Q1.** In a fiber-to-the-home PON architecture, at which tier boundary is the passive splitter most commonly located in a "fiber-deep" deployment?

- A) Feeder-to-FDH boundary (between feeder and distribution)
- B) Mid-distribution run
- C) Distribution-to-FDT boundary, within the FDT pedestal **[CORRECT]**
- D) At the customer premises NID

*Rationale:*
- **A — Incorrect.** Placing the splitter at the FDH means the distribution tier carries already-split (lower-power) signals — that pushes optical budget challenges out into the distribution runs and increases the number of distribution fibers needed. Fiber-deep architectures place the splitter closer to the customer. [Corning OSP Reference, Ch. 6.2]
- **B — Incorrect.** Splitters are installed at passive hardware locations (closures, pedestals, FDTs) — not in the middle of a cable span. Mid-span placement would require an extra enclosure and splice point. [BICSI OSP-DRD Manual, Ch. 4.2]
- **C — Correct.** In fiber-deep PON deployments, passive splitters live inside the **FDT** — the distribution-to-drop boundary. One feeder fiber feeds the FDT splitter; 32 drop cables leave the other side to 32 separate homes. This maximizes the efficiency of feeder fiber (one fiber serves 32 customers) while pushing the splitting point close to the customer to minimize drop cable length. [BICSI OSP-DRD Manual, Ch. 4.2; Corning OSP Reference, Ch. 6.2]
- **D — Incorrect.** Placing the splitter at the customer's NID would require one dedicated fiber per customer all the way back to the hub — completely defeating the purpose of passive splitting. PON splitters are network-side elements, not customer-premises equipment. [Corning OSP Reference, Ch. 6.2]

---

**Q2.** A designer is sizing a distribution cable for a residential cluster of 48 homes. The architecture uses 16:1 splitters at the FDT, and the distribution cable runs from the FDH to the FDT serving this cluster. What is the minimum fiber count for this cable using the BICSI design multiple?

- A) 3 fibers — one feeder fiber split 16:1 covers 16 homes; 3 feeder fibers × 16 = 48 homes
- B) 9 fibers — 3 active fibers × 3× BICSI distribution multiple
- C) 48 fibers — one fiber per home
- D) 3 active fibers × 3 = 9 fibers — rounded up to a standard 12-fiber cable **[CORRECT]**

*Rationale:*
- **A — Incorrect.** 3 fibers is the active-circuit count only. Without applying the BICSI design multiple, you're leaving zero dark fiber reserve. The BICSI 3× distribution multiple is not optional. [BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Incorrect.** The math is right (9 fibers), but 9 fibers is not a standard cable size. Cables come in 6, 12, 24, 48, etc. You can't order a "9-fiber cable." The answer needs the rounding step to be actionable. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]
- **C — Incorrect.** One fiber per home would be correct if every customer had a dedicated, unsplit fiber all the way to the hub. In a 16:1 PON architecture, one feeder fiber serves 16 customers — the distribution cable carries feeder-side fiber, not one-per-customer fiber. [Corning OSP Reference, Ch. 6.2]
- **D — Correct.** Step 1: 48 homes ÷ 16 (splitter ratio) = **3 active feeder fibers** serving this cluster. Step 2: BICSI 3× distribution multiple: 3 × 3 = **9 fibers minimum**. Step 3: Standard cable above 9 fibers = **12-fiber** (1-tube × 12-FPT). A 12-fiber cable provides the minimum with 3 dark fibers in reserve. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

---

**Q3.** A feeder cable failure takes down service to 640 customers simultaneously. What network engineering practice most directly mitigates the risk of a single feeder cut causing a total service outage?

- A) Installing a higher-fiber-count cable on the feeder route to allow fiber reassignment after a cut
- B) Specifying CST-armored cable on the feeder route to prevent cable cuts
- C) Engineering physically diverse dual-feeder paths from the hub to the FDH **[CORRECT]**
- D) Installing additional splice closures on the feeder to create repair access points

*Rationale:*
- **A — Incorrect.** When a cable is physically cut, ALL fibers are cut simultaneously — higher fiber count offers zero protection against the cut event itself. [BICSI OSP-DRD Manual, Ch. 4.2]
- **B — Incorrect.** CST armor protects against soil forces and rodent gnawing in undisturbed soil. It does not stop a backhoe, a directional drill mistake, or a road crew cutting through the cable. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]
- **C — Correct.** **Physically diverse dual feeder paths** means two separate cables routed on completely different physical paths between the hub and the FDH. A cut on one path leaves the other path intact — traffic reroutes automatically or manually, customers stay on. The cut path gets repaired without a service outage. This is the standard high-availability engineering practice for feeder routes serving large customer counts. [BICSI OSP-DRD Manual, Ch. 4.2; ANSI/TIA-758-C §5.5]
- **D — Incorrect.** Splice closures create repair access after a cut, but they don't prevent customers from losing service during the repair. Access helps you fix it faster — it doesn't prevent the outage. Redundancy (diverse paths) is the only way to prevent the outage. [BICSI OSP-DRD Manual, Ch. 4.2]

---

**Q4.** Which cable construction is most appropriate for a 150-foot aerial service drop from an FTTH FDT pole to a single-family residence in a suburban neighborhood?

- A) 144-fiber armored direct-burial cable — maximum strand count ensures future capacity
- B) 2-fiber flat all-dielectric drop cable with UV-stabilized PE sheath **[CORRECT]**
- C) 12-fiber indoor tight-buffer breakout cable — easy to terminate at the customer NID
- D) 24-fiber loose-tube conduit cable — standard OSP construction applies to drops

*Rationale:*
- **A — Incorrect.** A 144-fiber armored cable is massive over-specification for one house. The armored construction is designed for direct-burial, not aerial attachment. A 150-foot single-home drop needs 2–4 fibers at most. [AFL OSP Cable Design Guide, §2.2; BICSI OSP-DRD Manual, Ch. 4.3]
- **B — Correct.** The flat all-dielectric drop cable (2 or 4 fibers, UV-stabilized PE jacket, dielectric strength members) is exactly designed for this scenario: aerial service drops from a distribution pole to a single-family home. Lightweight enough for one technician to install, UV-resistant for decades outdoors, correctly sized for one residential customer, and available in continuous rolls for volume FTTH deployment. [AFL OSP Cable Design Guide, §2.2; Corning OSP Reference, Ch. 6.3; BICSI OSP-DRD Manual, Ch. 4.3]
- **C — Incorrect.** Indoor tight-buffer breakout cable is not rated for outdoor aerial use. It has no UV stabilization, no outdoor water-blocking, and no mechanical protection for aerial installation. NEC Article 770 also prohibits outdoor use of cable not listed for that environment. [ANSI/TIA-568.3-D §6.4; BICSI OSP-DRD Manual, Ch. 5.3.3]
- **D — Incorrect.** A 24-fiber round conduit cable is over-built in both fiber count and physical size for a single aerial residential drop. Standard round OSP cable is also not designed for direct aerial attachment at 150-foot spans — aerial drop cable is engineered specifically for the sag, UV, and hardware attachment requirements of the service-drop application. [AFL OSP Cable Design Guide, §2.2]

---

**Q5.** A project engineer is reviewing a feeder design that has 7 splice closures. ANSI/TIA-758-C requires 10 meters of slack at each. The route distance is 3.5 km. What minimum cable length should the engineer order?

- A) 3,500 meters
- B) 3,570 meters **[CORRECT]**
- C) 3,650 meters
- D) 4,200 meters

*Rationale:*

Let's work the math step by step:

- Route distance: **3,500 m**
- Repair loop slack: 7 splice closures × 10 m each = **70 m**
- Minimum total: 3,500 + 70 = **3,570 m**

In practice, engineers also add a pulling contingency (5–10%) for route measurement error and unexpected obstacles, but the minimum per ANSI/TIA-758-C §6.4 is **3,570 m**. [ANSI/TIA-758-C §6.4]

- **A — Incorrect.** 3,500 m covers only the route distance. There's no provision for the 70 m of mandatory repair loop slack. Running this close on cable order length means you'll be short at multiple splice closures during installation. [ANSI/TIA-758-C §6.4]
- **B — Correct.** 3,500 + (7 × 10) = 3,500 + 70 = **3,570 m**. [ANSI/TIA-758-C §6.4]
- **C — Incorrect.** 3,650 m implies 150 m of slack — that's 7 × ~21.4 m per splice, which overstates the 10 m per splice minimum. More slack is not a violation, but it's not what the standard minimum calculation yields. [ANSI/TIA-758-C §6.4]
- **D — Incorrect.** 4,200 m implies a 20% addition over the base route distance — far beyond the calculated minimum. Reasonable as a contingency on a complex bore, but not what the standard minimum says. [ANSI/TIA-758-C §6.4]

---

## Final Check

Answer these before moving on to Lesson 9 (Connector & Termination Options).

**Pulse 1.** Name the three tiers of the OSP cable hierarchy and the passive network element that marks the boundary between each pair of adjacent tiers.

*Expected answer:*
1. **Feeder** — from hub/central office to the **FDH (Fiber Distribution Hub)** (feeder → distribution boundary)
2. **Distribution** — from FDH to the **FDT (Fiber Distribution Terminal)** (distribution → drop boundary)
3. **Drop** — from FDT to the customer premises NID
[BICSI OSP-DRD Manual, Ch. 4.1–4.3; ANSI/TIA-758-C §4.2]

**Pulse 2.** A distribution route serves 96 homes through 32:1 splitters. Using the BICSI design multiple for distribution cable, what is the minimum fiber count, and what standard cable configuration covers it?

*Expected answer:*
- Step 1: 96 homes ÷ 32 (splitter ratio) = **3 active feeder fibers**
- Step 2: BICSI 3× distribution multiple: 3 × 3 = **9 fibers minimum**
- Step 3: Round up to standard cable: **12-fiber** (1-tube × 12-FPT) — the smallest standard configuration above 9 fibers
[BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

**Pulse 3.** What distinguishes a flat all-dielectric drop cable from a standard round loose-tube distribution cable, and why is the flat drop cable preferred for high-volume FTTH aerial service deployment?

*Expected answer:* A flat all-dielectric drop cable is thin and flat (rectangular or figure-8 cross-section), holds 2–4 fibers, uses dielectric (non-metal) strength members, and has a UV-stabilized PE jacket. Compared to a round loose-tube distribution cable: it is lighter (critical when you're attaching 20+ individual drops to the same FDT pole — less cumulative pole loading), easier for a single technician to handle and mount to a building entry, available in 2- or 4-fiber counts matched to one residential customer, and designed for roll-and-install deployment where the tech unreels cable directly from the truck. Standard round loose-tube cable is engineered for conduit pulling, direct-burial, and long aerial spans — more robust construction than a service drop needs, and heavier than is practical for volume residential deployment. [AFL OSP Cable Design Guide, §2.2; Corning OSP Reference, Ch. 6.3; BICSI OSP-DRD Manual, Ch. 4.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Feeder / distribution / drop** → foundational terms used in Lessons 10–12
- **FDH / FDT** → Lesson 10 (environment selection — cable type choices at FDH and FDT boundaries), Lesson 12 (compliance — splice closure and building entry documentation)
- **PON / splitter ratio** → Lesson 10 (cable selection by environment — fiber count calculations for FTTH vs. enterprise campus vs. utility SCADA)
- **Flat all-dielectric drop cable / armored drop cable** → Lesson 7 (sheath options), Lesson 10 (environment selection — drop cable variant choice by installation method)
- **Splice closure** → Lesson 12 (compliance — splice closure bonding and grounding, slack coil documentation), Lesson 7 (sheath)
- **Design multiple (4× feeder, 3× distribution, 2× drop)** → Lesson 6 (strand counts — design multiples introduced there in tabular form; this lesson applies them in worked examples), Lesson 12 (compliance — as-built dark-fiber documentation)
