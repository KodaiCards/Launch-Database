---
title: "Lesson 5.10: Terminal Hardware — Drop Terminals, MSTs, and NIDs"
duration_min: 25
topic: osp-hardware-accessories
order: 10
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.4: Terminal hardware in the OSP distribution layer"
  - "BICSI OSP-DRD Ch. 8: Drop terminal, MST, and NID specification and placement"
sources:
  - "TIA-758-C §8 (outside plant terminal hardware — MST, drop terminal, and NID requirements)"
  - "BICSI OSP-DRD Manual, Ch. 6.4, Ch. 8"
  - "7 CFR Part 1755 (RUS Telecom Program — materials and construction standards)"
  - "RUS PE-60 (Specifications and Drawings for 7 CFR Part 1755 telecommunications facilities)"
---

# Terminal Hardware: Drop Terminals, MSTs, and NIDs

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Place the correct hardware — FDH, MST, drop terminal, and NID/ONT — on the correct node of a CO-to-subscriber OSP layer diagram
- Specify MST port count and connector type for a given cluster of subscriber drops
- State the tool-free access mechanism for MST field service and explain why it is field-critical
- Identify the NID's function at the subscriber demarcation point and distinguish it from the ONT
- Cite 7 CFR Part 1755 and RUS PE-60 as the correct regulatory references for terminal hardware on PSC-funded routes

---

## Reading Content

### The OSP Layer Diagram

To specify terminal hardware correctly, you must first map the network layer at which each hardware type operates. The FTTH GPON distribution network flows from the central office (CO) through the outside plant to the subscriber's premises in a fixed hierarchy [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4, Ch. 8]:

```
CO / OLT chassis
       |
  Feeder cable (single-mode OSP, 288F typical)
       |
  FDH — Fiber Distribution Hub
  (pad-mount or hub-site; 1:32 GPON splitters)
       |
  Distribution cable (12F–48F OSP)
       |
  MST — Multi-Service Terminal / Aerial Terminal
  (buried pedestal or aerial lashed; 2–8 subscriber ports)
       |
  Drop cable (2F or 4F, lashed aerial or direct-buried)
       |
  NID — Network Interface Device / ONT
  (at subscriber premises; OSP/ISP demarcation)
       |
  Subscriber premises equipment
```

Each layer in this diagram has defined hardware types, connector standards, and cable sizes. This lesson covers MST, drop terminal, and NID. FDH is covered in L5.9; hardened connector mechanics (OptiTap, HOC connectors) are covered in T2 L2.9 — not re-taught here.

### Multi-Service Terminal (MST) / Aerial Terminal

The MST is the aggregation point between the distribution cable and individual subscriber drops. It is the hardware that converts one or more distribution fibers into multiple pre-connectorized subscriber drop ports [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4].

**Physical forms:**

- **Aerial (lashed) MST:** The most common form in FTTH aerial plant. A weatherproof enclosure — typically UV-stabilized HDPE or powder-coated die-cast aluminum — lashed directly to the messenger strand at mid-span or at a pole. No pedestal or pad required. The distribution cable enters from one side; subscriber drop cables exit from the other.
- **Buried pedestal MST:** A small pedestal-mounted MST used in underground distribution areas. Housing is NEMA 4 equivalent (IP65). Conduit entry from below.

**Port count and sizing:**

MSTs are available in standard port counts: 2, 4, 6, 8, and 12 subscriber ports. Select the port count based on the number of subscriber drops to be served from the MST location plus at least one spare port. A 4-port MST serving 3 active subscribers provides one spare port for a future drop or re-connection. Specifying exactly the active port count with no spare is poor practice — a single port failure leaves no recovery option without replacing the MST [TIA-758-C §8; BICSI OSP-DRD Ch. 8].

**Connector types on MST subscriber ports:**

- **OptiTap (SC-APC compatible):** Proprietary hardened connector used in aerial FTTH. A weatherproof push-to-latch mechanism with an IP67 mated rating. Subscriber drop cables terminate in pre-installed OptiTap receptacles. See T2 L2.9 for connector mechanics — not re-taught here. OptiTap is standard for aerial lashed FTTH on PSC program routes.
- **Hardened SC-APC (HOC):** An alternative hardened SC-APC connector system used in some buried pedestal MST configurations. Slightly different latch mechanism than OptiTap; same IP67 mated performance objective.

**Tool-free pull-to-lock access:**

The defining field-critical feature of all FTTH aerial and pedestal MSTs is **tool-free pull-to-lock access**. The subscriber port cap (the weatherproof dust cap on an unused drop port) is removed by hand — no hex key, screwdriver, or socket wrench. The drop cable connector is inserted and pulled to lock by hand, audibly clicking into the latched position. This is not a convenience feature; it is a field-critical design requirement:

- Aerial lashed MST work is performed by a technician at height (bucket truck or climbing gear). Adding a tool requirement at the drop connection point introduces a dropped-tool hazard and slows productivity significantly.
- Drop installation and service calls may be the highest-frequency service event on the network. Across thousands of drops per year, tool-free access is a cumulative operational cost savings.

Verify pull-to-lock engagement by a firm reverse pull on the connector body — the connector should not release without the tab-press sequence. A loose connector is not an engaged connector [TIA-758-C §8; BICSI OSP-DRD Ch. 8].

### Drop Terminals

A **drop terminal** is a smaller, simpler variant of the MST — typically 1–2 subscriber ports — used at the end of a distribution span where a single subscriber or pair of subscribers connects. Drop terminals are less common than MSTs in large FTTH deployments because MSTs cover the same function with more ports. Drop terminals appear in:

- Rural routes with long inter-subscriber spacing, where a single-subscriber drop connection point is more cost-effective than a multi-port MST
- Legacy mixed aerial/underground transitions where a drop terminal provides a weatherproof connection to the subscriber premises entrance cable

Drop terminals use the same OptiTap or hardened SC-APC connector standard as MSTs. Tool-free access applies equally. The housing is the same weatherproof construction (UV-stabilized HDPE, IP65 minimum for aerial applications) [TIA-758-C §8; BICSI OSP-DRD Ch. 8].

### Network Interface Device (NID) and ONT

The **NID** is the physical demarcation point at the subscriber premises. It is the line between the OSP (owned by the service provider) and the subscriber's in-premises wiring. The NID is mounted on the outside of the subscriber's building — typically at the service entrance — and is weatherproof for outdoor mounting. It provides:

- A weatherproof connection point for the subscriber drop cable
- A test access point for the service provider to perform outside plant testing without entering the premises
- Physical demarcation of ownership and maintenance responsibility

**NID vs. ONT:**

The **ONT** (Optical Network Terminal) is the active GPON electronics device at the subscriber premises. The ONT converts the optical GPON signal to the subscriber's service interfaces (Ethernet, phone, CATV coaxial). On many residential FTTH deployments, the NID and ONT functions are combined in a single unit mounted at the building entry. On enterprise or business-class installations, the NID may be a separate passive connection box, with the ONT mounted inside the building in an equipment room [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4].

For PSC program installations at Launch Fiber Services, the NID/ONT is the customer's provided equipment (CPE). The service provider's OSP responsibility terminates at the NID input port. Anything ISP-side (inside the building) is out of OSP scope.

### RUS Citation for Terminal Hardware

Terminal hardware (MST, drop terminal, NID) on PSC-funded routes must comply with:
- **7 CFR Part 1755** — Materials and construction standards for RUS-funded telecommunications facilities
- **RUS PE-60** — Specifications and Drawings for 7 CFR Part 1755 facilities

**Not RUS Bulletin 1738** — see L5.9 for the program distinction. [7 CFR Part 1755; RUS PE-60]

---

## Key Terms (Flashcard Candidates)

**MST (Multi-Service Terminal)**
An aerial or pedestal-mounted aggregation terminal converting distribution cable fibers to pre-connectorized subscriber drop ports. Available in 2, 4, 6, 8, and 12-port configurations. Connector type: OptiTap (aerial) or hardened SC-APC (HOC). Tool-free pull-to-lock access is the field-critical design requirement. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]

**Drop terminal**
A single- or double-port weatherproof terminal for individual subscriber connections in rural or widely-spaced subscriber scenarios. Same connector standard and tool-free access as MST. Smaller housing; simpler function. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]

**NID (Network Interface Device)**
The physical demarcation point at the subscriber premises. Weatherproof, mounted on building exterior. Defines the OSP/ISP boundary — service provider responsibility ends at the NID input port. May be combined with ONT in a single unit on residential GPON installations. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]

**ONT (Optical Network Terminal)**
The active GPON electronics device at the subscriber premises. Converts optical GPON signal to subscriber service interfaces (Ethernet, phone, CATV coaxial). On residential FTTH, often integrated with the NID in a single building-entry unit. Not OSP scope — CPE provided by or for the subscriber. [TIA-758-C §8]

**Tool-free pull-to-lock access**
The defining field-critical feature of FTTH aerial MSTs and drop terminals. Subscriber port caps are removed by hand; drop connectors are inserted and locked by hand pull. Eliminates tool requirements at aerial elevation and high-frequency service-call events. Engagement verified by a firm reverse pull on the connector body. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]

**OptiTap**
A proprietary hardened SC-APC-compatible push-to-latch connector used in FTTH aerial MST and drop terminal applications. IP67 mated rating. Standard for aerial lashed FTTH on PSC program routes. Connector mechanics covered in T2 L2.9. [T2 L2.9; TIA-758-C §8]

---

## Interactive: Drag-and-Drop — OSP Layer Diagram

**Mechanic:** A blank six-node network diagram is presented. Learner drags hardware labels to the correct nodes.

**Hardware labels:** CO / OLT Chassis — Feeder Cable — FDH — Distribution Cable — MST / Drop Terminal — Drop Cable — NID / ONT

**Correct placement:**
1. Node A (headend): CO / OLT Chassis
2. Link A-B: Feeder Cable (288F single-mode OSP)
3. Node B (neighborhood pad): FDH (with 1:32 GPON splitters)
4. Link B-C: Distribution Cable (12F–48F OSP)
5. Node C (mid-span aerial or pedestal): MST / Drop Terminal
6. Link C-D: Drop Cable (2F or 4F)
7. Node D (building entry): NID / ONT

**Feedback on each placement:** Correct labels show citation. Incorrect placements trigger "try again" with a hint citing the node function.

---

## Multiple-Choice Quiz

---

**Q1.** In the FTTH GPON OSP layer hierarchy, which hardware node connects the distribution cable to individual subscriber drop cables?

- A) FDH
- B) NID
- C) MST (Multi-Service Terminal) **[CORRECT]**
- D) OLT

*Rationale:*
- **A — Incorrect.** The FDH connects the feeder cable to the distribution cables — it is the split point between the CO and the distribution network, not the distribution-to-drop connection. An FDH with 1:32 GPON splitters serves the distribution layer, not the individual subscriber drops directly. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **B — Incorrect.** The NID is at the subscriber premises — it is the termination point of the subscriber drop cable at the building entry. The NID does not aggregate or split distribution cables. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **C — Correct.** The MST (Multi-Service Terminal) is the hardware that aggregates one or more distribution cable fibers and terminates them in pre-connectorized subscriber drop ports. It is deployed at the mid-span aerial or pedestal location where distribution cable meets subscriber drop cables. Each MST port connects one subscriber drop. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]
- **D — Incorrect.** The OLT (Optical Line Terminal) is the headend active electronics device in the CO. It is the optical head of the GPON system — it does not appear in the OSP field at the drop connection point. [TIA-758-C §8]

---

**Q2.** A field technician is adding a subscriber drop at an aerial lashed MST at height from a bucket truck. Which access feature of the MST connector port is field-critical in this scenario, and why?

- A) Key-cylinder lock — ensures that unauthorized parties cannot access unused MST ports at aerial locations
- B) Hex-head bolt cap — provides weather protection while allowing field removal with standard tools
- C) Tool-free pull-to-lock access — eliminates tool handling at aerial elevation, reducing dropped-tool risk and connection time **[CORRECT]**
- D) Heat-shrink port seal — provides IP67 connector engagement that survives repeated drop connect/disconnect events

*Rationale:*
- **A — Incorrect.** Key-cylinder locks are not used on MST subscriber ports. MST ports use tool-free push-to-latch caps that are removed by hand. Adding a key-cylinder to a high-frequency service access point would reduce productivity dramatically and introduce key management complexity. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]
- **B — Incorrect.** Hex-head bolt caps on MST subscriber ports would create a tool-handling requirement at aerial elevation — exactly the problem that tool-free design avoids. Hex-head bolts are used on pedestal lids (L5.8), not on MST subscriber connector ports. [TIA-758-C §8]
- **C — Correct.** Tool-free pull-to-lock access is the defining field-critical feature of aerial MST subscriber ports. A technician at height on a bucket truck cannot safely manage a hex socket, screwdriver, or other tool while connecting a subscriber drop — dropped tools are a safety hazard, and the fumbling time adds up across thousands of service calls per year. The pull-to-lock mechanism is designed specifically to enable one-hand connection at aerial elevation. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]
- **D — Incorrect.** Heat-shrink seals are cable port sealing methods for splice closures (T2 L2.6) — not the connector engagement mechanism for MST subscriber ports. MST subscriber ports use OptiTap or hardened SC-APC connectors with a pull-to-latch mechanism, not heat-shrink seals. [TIA-758-C §8; T2 L2.6]

---

**Q3.** A cluster of 5 subscribers will be served from a single aerial MST location. Which MST port count should be specified, and why?

- A) 4-port MST — use the port count closest to but not exceeding the subscriber count
- B) 5-port MST — size the MST to exactly match the number of active subscribers
- C) 6-port MST — select the next standard port count above the active subscriber count, providing at least one spare port **[CORRECT]**
- D) 12-port MST — always specify the largest available MST to avoid future replacement

*Rationale:*
- **A — Incorrect.** A 4-port MST cannot serve 5 subscribers — one subscriber would have no connection point. Sizing below the active subscriber count is an error. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]
- **B — Incorrect.** A 5-port MST serving exactly 5 active subscribers leaves zero spare ports. A single port failure — physical damage, connector contamination, or weather ingress on an unused port left uncapped — leaves that subscriber without a service port. A minimum one-spare-port practice is BICSI OSP-DRD standard. [BICSI OSP-DRD Ch. 8; TIA-758-C §8]
- **C — Correct.** The correct practice is to select the next standard port count above the active subscriber count, providing at least one spare port. 5 active subscribers → next standard size above 5 is a **6-port MST**. The spare port provides: (a) a recovery port if an active port is damaged, (b) the ability to add one subscriber in the future without replacing the MST, and (c) a test port for service verification. [BICSI OSP-DRD Ch. 8; TIA-758-C §8]
- **D — Incorrect.** A 12-port MST for 5 subscribers over-provisions by 7 ports. While not catastrophically wrong, it increases material cost, adds unnecessary weight on the aerial strand, and uses distribution cable fibers for ports that will not be populated for years. Specify the next-size-up, not the largest available. [TIA-758-C §8]

---

**Q4.** What is the functional distinction between a NID (Network Interface Device) and an ONT (Optical Network Terminal) at a residential FTTH installation?

- A) The NID is the active GPON electronics device; the ONT is the passive weatherproof demarcation box
- B) The NID is the physical OSP/ISP demarcation point at the building entry; the ONT is the active device that converts optical GPON signal to subscriber service interfaces **[CORRECT]**
- C) NID and ONT are synonymous terms for the same device; the distinction is vendor-specific nomenclature only
- D) The ONT is mounted at the FDH as the active headend; the NID is mounted at the MST as the drop demarcation

*Rationale:*
- **A — Incorrect.** This reverses the definitions. The NID is the passive physical demarcation point; the ONT is the active electronics device. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **B — Correct.** The **NID** (Network Interface Device) is the physical demarcation point — typically a weatherproof box mounted on the building exterior at the service entrance. It defines the service provider's OSP responsibility boundary. Everything ISP-side of the NID is the subscriber's equipment. The **ONT** (Optical Network Terminal) is the active GPON electronics device that converts the optical signal to Ethernet, telephone, and other subscriber interfaces. On residential FTTH, the NID and ONT may be physically combined in a single building-entry unit, but their functional roles are distinct. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **C — Incorrect.** NID and ONT have distinct functional definitions. While some vendors may use "NID/ONT" as a combined term for an integrated unit, the two components have separate roles: demarcation (NID) vs. optoelectronic conversion (ONT). They are not interchangeable synonyms. [TIA-758-C §8]
- **D — Incorrect.** The ONT is at the subscriber premises, not at the FDH. The FDH contains passive optical splitters. The ONT is customer premises equipment (CPE) at the building entry. The MST is the mid-span distribution-to-drop aggregation terminal — it is not called a NID. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]

---

**Q5.** For PSC program terminal hardware procurement (MST, drop terminals, NIDs), which regulatory citations are required on RUS submittals?

- A) NEMA 250 and IEC 60529 — enclosure ratings govern all terminal hardware specifications
- B) TIA-758-C §8 alone — the TIA standard is sufficient without RUS program citation
- C) 7 CFR Part 1755 and RUS PE-60 **[CORRECT]**
- D) RUS Bulletin 1738 and TIA-758-C §8

*Rationale:*
- **A — Incorrect.** NEMA 250 and IEC 60529 are enclosure environmental rating standards — relevant for housing selection but not the regulatory compliance framework for RUS-funded procurement. The regulatory citation must be the RUS program authority. [7 CFR Part 1755; RUS PE-60]
- **B — Incorrect.** TIA-758-C §8 is the technical standard for terminal hardware specifications, but it is not the RUS program regulatory authority. PSC-funded submittals require the RUS program citation (7 CFR Part 1755 + PE-60) in addition to the technical standard reference. [7 CFR Part 1755; RUS PE-60]
- **C — Correct.** PSC program routes are funded under the RUS Telecom Program, governed by **7 CFR Part 1755** (materials and construction standards) and **RUS PE-60** (specifications and drawings). These are the correct citations on PSC-funded terminal hardware submittals. TIA-758-C §8 is the supporting technical standard but does not substitute for the RUS program citation. [7 CFR Part 1755; RUS PE-60]
- **D — Incorrect.** RUS Bulletin 1738 governs the Distance Learning and Telemedicine grant program — not the standard RUS Telecom Program under which PSC routes are funded. Citing 1738 on a PSC submittal is a regulatory error. [7 CFR Part 1755; RUS PE-60]

---

## Final Check

**Pulse 1.** Draw (or describe) the OSP layer hierarchy from CO to subscriber premises, naming the hardware type at each node and the cable type on each link.

*Expected answer:*
- CO/OLT chassis → Feeder cable (single-mode OSP, 144F–288F typical) → FDH with 1:32 GPON splitters (pad-mount hardened or hub-site rack) → Distribution cable (12F–48F single-mode OSP) → MST / Drop Terminal (aerial lashed or buried pedestal; 2–12 subscriber ports; OptiTap or hardened SC-APC) → Drop cable (2F or 4F single-mode OSP, lashed aerial or direct-buried) → NID/ONT (building entry; active optoelectronic CPE; demarcation point)

[TIA-758-C §8; BICSI OSP-DRD Ch. 6.4, Ch. 8]

**Pulse 2.** What is "tool-free pull-to-lock access" on an MST subscriber port, and what are the two operational reasons it is specified as a field-critical feature?

*Expected answer:* Tool-free pull-to-lock access means that MST subscriber port dust caps are removed by hand (no hex key, screwdriver, or socket) and drop cable connectors are inserted and locked by hand pull, audibly clicking into the latched position. Two operational reasons: (1) **Safety at aerial elevation** — aerial MST work is performed from bucket trucks or with climbing gear; tool handling at height creates dropped-tool hazards and is unsafe; (2) **Cumulative operational efficiency** — drop installation and service calls are the highest-frequency service events on the network; across thousands of drops per year, eliminating a tool requirement reduces connection time significantly and lowers operational cost. [TIA-758-C §8; BICSI OSP-DRD Ch. 8]

---

## Glossary Cross-References

- **FDH port configuration and splitter cassettes** → T5 L5.9 (FDH is the node above MST in the hierarchy; sizing and port configuration are that lesson's scope)
- **OptiTap and hardened SC-APC connector mechanics** → T2 L2.9 (connector mechanical specifications, IP rating in mated condition; do not re-teach here)
- **Slack storage at MST and aerial closure locations** → T5 L5.11 (storage hardware for fiber slack adjacent to MST and drop terminal locations)
- **7 CFR Part 1755 and RUS PE-60** → T4 L4.14 (RUS program framework overview)
- **NID as-built documentation** → T3 L3.12 (NID location and drop routing appear in as-built records per RUS Forms 515c + 219)
