---
title: "Lesson 5.9: Fiber Distribution Hubs — Construction-Grade vs. Rack-Mount, Port Configuration"
duration_min: 30
topic: osp-hardware-accessories
order: 10
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.4: FDH enclosures and port configuration"
  - "BICSI OSP-DRD Ch. 8: Terminal hardware and distribution architecture"
sources:
  - "TIA-758-C §8 (outside plant terminal hardware — FDH types and port configuration)"
  - "BICSI OSP-DRD Manual, Ch. 6.4, Ch. 8"
  - "7 CFR Part 1755 (RUS Telecom Program — materials and construction standards for RUS-funded facilities)"
  - "RUS PE-60 (Specifications and Drawings for 7 CFR Part 1755 telecommunications facilities)"
---

# Fiber Distribution Hubs: Construction-Grade vs. Rack-Mount, Port Configuration

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Distinguish construction-grade hardened FDH from rack-mount hub-site FDH by enclosure type, IP rating, and deployment context
- Apply the FTTH growth-factor formula (subscriber count × 1.20 → round up to next standard port-count increment) to size an FDH correctly
- Derive the minimum port count for a given subscriber scenario, identify the correct standard FDH size, and construct a port-budget table
- Describe SC-APC vs. LC-APC cassette architecture and state when each applies
- Cite the correct RUS program references (7 CFR Part 1755 and RUS PE-60) for FDH procurement on PSC-funded routes

---

## Reading Content

### Two Classes of FDH

An FDH (Fiber Distribution Hub) is the primary aggregation point in an FTTH network where feeder fiber from the central office splits to distribution fibers serving individual subscribers. The hardware form depends on where the FDH sits in the network and the environment it occupies [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4].

#### Construction-Grade Hardened FDH (Pad-Mount)

The construction-grade or hardened FDH is a self-contained weatherproof enclosure designed for outdoor deployment in a pedestal or pad-mount configuration. Key characteristics [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]:

- **Enclosure rating:** IP65 minimum for pad-mount outdoor deployment (NEMA 4 equivalent). Some hardened FDH units are rated IP67 for shallow flood-prone pads.
- **Construction:** UV-stabilized HDPE or powder-coated steel body; full-perimeter gasketed door; sealed cable entry ports.
- **Internal architecture:** Pre-populated with one or more optical splitter cassettes (1:32 GPON typical for residential FTTH); feeder port on one side; distribution ports on the other. Cassettes are field-replaceable.
- **Connector type:** SC-APC (SC/APC — angle-polished contact) on both feeder and distribution ports for residential FTTH. Some hardened FDH units use LC-APC for compact high-density configurations.
- **Deployment context:** Neighborhood pad-mount locations — typically serving 1–4 distribution areas radiating from a single pad. Population served: 32–576 subscribers depending on FDH size and splitter configuration.
- **Installation method:** Poured concrete pad with anchor bolts; conduit entry from below through sealed conduit entry knockouts.

**FDH grounding:** FDH housing grounding and bonding are covered in T6 L6.7. A hardened FDH enclosure that is not properly grounded is a personnel safety issue and an RUS compliance deficiency. Do not close a newly installed hardened FDH without completing the grounding per T6 L6.7.

#### Rack-Mount Hub-Site FDH

The rack-mount FDH is designed for installation inside a temperature-controlled building or equipment room (CO, fiber hub site, remote terminal building). Key characteristics [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]:

- **Enclosure rating:** No outdoor IP rating required; deployed inside a building. Standard 19-in. or 23-in. rack-mountable chassis.
- **Construction:** Steel rack chassis with front and rear cable management panels.
- **Internal architecture:** Modular cassette design; splitter cassettes and pigtail trays installed in field. Higher density per U of rack space than hardened FDH.
- **Connector type:** SC-APC or LC-APC depending on rack design. LC-APC enables higher port density per rack unit but requires smaller-radius fiber management.
- **Deployment context:** Hub sites, remote terminals, and central offices where environmental protection is provided by the building rather than the enclosure.

### SC-APC vs. LC-APC Cassette Architecture

**SC-APC (Standard Contact / Angle Physical Contact):**
- 2.5-mm ferrule; larger physical connector
- Standard for residential FTTH GPON distribution in RUS-funded and commercial FTTH
- Field-installable with widely available tooling; easy visual inspection of connector face angle
- Standard port density: 24–48 SC-APC ports per cassette panel

**LC-APC (Lucent Connector / Angle Physical Contact):**
- 1.25-mm ferrule; smaller physical connector — approximately 40% smaller footprint than SC
- Higher port density per rack unit; preferred for hub-site rack applications where space is constrained
- Requires SC-to-LC adapter panels or pigtails when connecting to SC-APC distribution equipment
- Less common in hardened outdoor FDH (field crews handling LC connectors in adverse weather is operationally more difficult)

For PSC program routes at Launch Fiber Services: hardened pad-mount FDH → **SC-APC** as the standard unless the project specification requires LC-APC. Rack-mount hub-site → LC-APC or SC-APC per the hub-site design.

### FDH Sizing — Growth Factor 1.20 (LOCKED)

The FTTH industry standard for FDH port sizing applies a **growth factor of 1.20** (20% over-provisioning) to the current subscriber count. This factor accounts for subscriber additions, service upgrades, and spare ports needed for re-splicing or failed-port retirement [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4].

**CORRECT FORMULA:**

> **Minimum required port count = subscriber count × 1.20**
> Round the result UP to the next standard FDH port-count increment.

The growth factor is applied directly to the subscriber count. The GPON split ratio (typically 1:32) is an architectural parameter of the splitter cassettes inside the FDH — it is NOT multiplied into the port-count formula. The split ratio determines how many cassettes populate the FDH, not the total FDH port count.

**Standard FDH port-count increments (hardened SC-APC):**

| Standard FDH size | Cassette count (at 1:32 GPON) | Subscribers at 1:32 |
|---|---|---|
| 72-port | 2 × 1:32 cassettes + spare | Up to ~60 served |
| 144-port | 4 × 1:32 cassettes + spare | Up to ~130 served |
| 288-port | 9 × 1:32 cassettes | Up to ~230 served |
| 432-port | 13–14 × 1:32 cassettes | Up to ~360 served |
| 576-port | 18 × 1:32 cassettes | Up to ~480 served |

*Note: FDH product family for Launch Fiber Services — PENDING USER CONFIRMATION: Corning Pretium / CommScope FIST / Clearfield FieldSmart. The worked math is product-agnostic; the port-count increments above are standard across all three product families.*

### Worked Example: 192-Subscriber Scenario

**Given:** A service area contains 192 homes passed. Design the FDH port count for this area.

**Step 1: Apply the growth factor.**

Minimum required ports = subscriber count × 1.20

192 × 1.20 = **230.4 ports**

**Step 2: Round up to next standard FDH port-count increment.**

230.4 rounds up to the next standard size above 230 ports. From the standard increment table: **288-port FDH** is the next standard size above 230.4.

**Result: Specify a 288-port hardened SC-APC FDH.**

**Step 3: Port budget table.**

| Port budget category | Count |
|---|---|
| Current subscribers served | 192 |
| Growth factor ports (20% over current) | 38.4 → 39 |
| Minimum provisioned ports (current + growth) | 231 |
| FDH standard size selected | 288 ports |
| Spare ports available (above minimum) | 288 − 231 = 57 |
| Splitter cassettes required (1:32 GPON, 32 ports/cassette): ⌈192/32⌉ | 6 cassettes (192 subscribers) |
| Splitter cassettes capacity of 288-port FDH | 9 cassettes |
| Cassettes held in reserve (future growth) | 3 cassettes |

**Interpretation:** The 288-port FDH supports all 192 current subscribers with 57 spare ports for subscriber additions before an FDH upgrade or overlay is needed. The three reserve cassette slots can be populated as the service area grows toward the 288-port limit.

**Step 4: RUS procurement pathway.**

For PSC program routes, FDH procurement and installation must comply with:
- **7 CFR Part 1755 Subpart D** — Materials and construction standards for RUS-funded telecommunications facilities. Hardened FDH units must meet 7 CFR Part 1755 material specifications for enclosures used in RUS-funded outside plant.
- **RUS PE-60** — Specifications and Drawings for 7 CFR Part 1755 facilities. PE-60 is the operational standard governing how FDH units are specified, installed, and accepted on PSC program routes.

**Citation note — NOT RUS 1738.** RUS Bulletin 1738 governs the Electric Borrowers Program — a separate USDA program with different applicability. PSC program work is funded under the standard RUS Telecom Program, governed by 7 CFR Part 1755 and PE-60. Do not cite RUS 1738 on PSC program submittals; it will trigger a review comment from the RUS area engineer. [7 CFR Part 1755; RUS PE-60]

---

## Key Terms (Flashcard Candidates)

**Construction-grade (hardened) FDH**
A self-contained weatherproof FDH enclosure rated IP65 or higher, designed for outdoor pad-mount deployment. UV-stabilized HDPE or powder-coated steel body; gasketed door; sealed conduit entries. SC-APC ports standard for residential GPON. Sizing per growth-factor formula; grounding per T6 L6.7. [TIA-758-C §8; 7 CFR Part 1755; RUS PE-60]

**Rack-mount FDH**
An FDH chassis designed for 19-in. or 23-in. rack installation inside a climate-controlled building. No outdoor IP rating required. Higher port density per rack unit than hardened FDH. SC-APC or LC-APC depending on design. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]

**Growth factor (FDH sizing)**
A multiplier applied to the subscriber count to account for future additions and spare ports. Locked at **1.20** (20%) for PSC program routes at Launch Fiber Services. Formula: subscriber count × 1.20 → round up to next standard port-count increment. The split ratio is NOT multiplied into the formula. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]

**288-port FDH**
The standard hardened FDH size selected for service areas of 192–240 subscribers (after applying 1.20 growth factor). Accommodates 9 × 1:32 GPON cassettes at full population; serves up to ~230 subscribers with growth margin. Product family: PENDING USER CONFIRMATION (Corning Pretium / CommScope FIST / Clearfield FieldSmart). [TIA-758-C §8]

**SC-APC**
Straight-tip 2.5-mm ferrule connector with angle-polished contact face. Standard for residential FTTH GPON distribution in hardened FDH applications. Widely field-serviceable; 24–48 ports per cassette panel. Distinguished from LC-APC (1.25-mm ferrule, higher density, hub-site preferred). [TIA-758-C §8]

**7 CFR Part 1755 + RUS PE-60**
The RUS Telecom Program regulatory and operational framework governing materials and construction for PSC-funded OSP facilities, including hardened FDH units. 7 CFR Part 1755 Subpart D governs material approval; PE-60 governs specifications and drawings. NOT to be confused with RUS Bulletin 1738, which governs the Electric Borrowers Program. [7 CFR Part 1755; RUS PE-60]

---

## Interactive: Scenario — FDH Sizing for 192-Home Service Area

**Learner prompt:** A 192-home service area requires a hardened pad-mount FDH. The growth factor is 1.20. GPON split ratio is 1:32. Walk through the sizing derivation step by step.

**Step 1 — Minimum ports:** 192 × 1.20 = 230.4 (learner inputs result)

**Step 2 — Standard FDH size:** Round 230.4 up to next standard increment → 288-port FDH (learner selects from option list: 144 / 288 / 432 / 576)

**Step 3 — Splitter cassettes for current load:** ⌈192/32⌉ = 6 cassettes. How many are held in reserve? 9 − 6 = 3 cassettes. (learner inputs)

**Step 4 — Spare ports:** 288 − 231 (minimum) = 57 spare ports. (learner inputs)

**System validates each intermediate result before advancing.**

---

## Multiple-Choice Quiz

---

**Q1.** A hardened pad-mount FDH is rated IP65. What does this rating mean in the context of outdoor OSP deployment?

- A) The FDH is rated for direct burial — it can be installed below grade without a conduit
- B) The FDH is dust-tight and protected against low-pressure water jets from any direction, suitable for outdoor pad-mount deployment **[CORRECT]**
- C) The FDH can be continuously immersed in water at 1 m depth — equivalent to a buried splice closure
- D) The FDH is rated for indoor rack-mount use only — IP65 is an indoor standard

*Rationale:*
- **A — Incorrect.** IP65 does not include an immersion rating. FDH units are pad-mount equipment installed above grade, not buried in conduit or direct-buried. A buried application requires IP67 or IP68. [IEC 60529; TIA-758-C §8]
- **B — Correct.** IP65 = first digit 6 (dust-tight, no ingress of dust) + second digit 5 (protected against low-pressure water jets from any direction). This rating is appropriate for outdoor pad-mount FDH enclosures that are exposed to rain, hose-down, and road splash but are not immersed. NEMA 4 is the approximate NEMA equivalent. [IEC 60529; TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **C — Incorrect.** Continuous immersion is IP67 (30 min at 1 m) or IP68 (extended immersion at manufacturer-specified depth). IP65 addresses water jets, not immersion. Buried splice closures require IP67 or IP68; pad-mount FDH units require IP65 minimum. [IEC 60529; T2 L2.6]
- **D — Incorrect.** IP65 is an outdoor-rated protection level. Indoor rack-mount FDH units do not require an IP rating because they are deployed inside climate-controlled buildings. An IP65-rated FDH is specifically the construction-grade outdoor variant. [IEC 60529; TIA-758-C §8]

---

**Q2.** Using the locked growth factor of 1.20, what is the minimum required FDH port count for a service area with 192 subscribers, and which standard FDH size is selected?

- A) 192 ports; select a 288-port FDH (next increment above 192)
- B) 230.4 minimum; select a 288-port FDH **[CORRECT]**
- C) 230.4 minimum; select a 432-port FDH (next increment above 288)
- D) 192 × 32 × 1.20 = 7,373 ports; select multiple FDH units to cover this count

*Rationale:*
- **A — Incorrect.** The growth factor must be applied: 192 × 1.20 = 230.4 ports minimum. A 192-port FDH (even if it existed as a standard size) would not provide the 20% growth margin. The 288-port selection is correct but the minimum port derivation is wrong in this option. [TIA-758-C §8; Brief §L5.9 corrected formula]
- **B — Correct.** Applying the correct formula: **subscriber count × 1.20 = minimum required port count**. 192 × 1.20 = 230.4. Rounding up to the next standard FDH port-count increment: **288 ports**. The 288-port FDH is the correct selection. This formula does NOT include the split ratio — the 1:32 GPON split ratio determines the splitter cassette population inside the FDH, not the total port count. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **C — Incorrect.** The minimum calculation (230.4) is correct, but 432 is not the next standard increment above 230.4. The standard increments are 72 → 144 → 288 → 432. The next size above 230.4 is 288, not 432. Selecting 432 would over-provision significantly and increase material cost. [TIA-758-C §8]
- **D — Incorrect.** This result (7,373 ports) comes from multiplying subscriber count × split ratio × 1.20 — the formula described in the brief as INCORRECT. The split ratio (1:32) is the cassette architecture, not a multiplier for the port-count formula. The correct formula is subscriber count × 1.20 only. 192 × 1.20 = 230.4, not 7,373. [TIA-758-C §8; Brief §L5.9 corrected formula]

---

**Q3.** For PSC program work at Launch Fiber Services, which regulatory references govern hardened FDH procurement and installation on RUS-funded routes?

- A) RUS Bulletin 1738 and NEMA 250
- B) 7 CFR Part 1755 and RUS PE-60 **[CORRECT]**
- C) RUS Bulletin 1738 and TIA-758-C §8
- D) NEMA 250 and IEC 60529 only

*Rationale:*
- **A — Incorrect.** RUS Bulletin 1738 governs the Electric Borrowers Program — a separate USDA program with different eligibility, purposes, and construction standards from the RUS Telecom Program. PSC program work is funded under the RUS Telecom Program. Citing 1738 on a PSC program submittal will trigger a review comment. [7 CFR Part 1755; RUS PE-60]
- **B — Correct.** PSC program routes are funded under the RUS Telecom Program, which is governed by **7 CFR Part 1755** (materials and construction standards for RUS-funded telecommunications facilities) and **RUS PE-60** (specifications and drawings for those facilities). These are the correct citations for FDH procurement and installation submittals. [7 CFR Part 1755; RUS PE-60]
- **C — Incorrect.** RUS Bulletin 1738 is the wrong RUS reference for PSC program work (it governs the Electric Borrowers Program, not the RUS Telecom Program). While TIA-758-C §8 is a valid technical reference for FDH hardware, the RUS regulatory citation must be 7 CFR Part 1755 + PE-60 on PSC-funded submittals. [7 CFR Part 1755; RUS PE-60]
- **D — Incorrect.** NEMA 250 and IEC 60529 are enclosure environmental rating standards — they govern the FDH enclosure type selection but do not constitute the RUS program citation framework. The regulatory procurement compliance standard is 7 CFR Part 1755 with PE-60 as the operational specification. [7 CFR Part 1755; RUS PE-60]

---

**Q4.** A 288-port hardened FDH is specified for a 192-subscriber service area (growth factor 1.20). How many 1:32 GPON splitter cassettes are required to serve the 192 current subscribers, and how many cassette slots remain available for future growth?

- A) 4 cassettes installed; 5 in reserve
- B) 6 cassettes installed; 3 in reserve **[CORRECT]**
- C) 9 cassettes installed; 0 in reserve
- D) 3 cassettes installed; 6 in reserve

*Rationale:*
- **A — Incorrect.** 4 cassettes × 32 ports/cassette = 128 ports — insufficient for 192 subscribers. Each subscriber requires one port; 4 cassettes cannot serve 192. [BICSI OSP-DRD Ch. 6.4; TIA-758-C §8]
- **B — Correct.** Cassettes for current subscribers: ⌈192 / 32⌉ = ⌈6.0⌉ = **6 cassettes** (192 subscribers ÷ 32 ports/cassette = exactly 6 cassettes). A 288-port FDH holds 9 cassette slots (288 ÷ 32 = 9). Cassettes in reserve for growth: 9 − 6 = **3 cassette slots**. The 3 reserve slots can serve an additional 96 subscribers (3 × 32) when populated, bringing the total to 288 ports — consistent with the growth-factor sizing. [BICSI OSP-DRD Ch. 6.4; TIA-758-C §8]
- **C — Incorrect.** Installing 9 cassettes at initial construction over-populates the FDH for the current 192-subscriber load. Reserve slots should remain open for future growth — installing all 9 upfront increases material cost and leaves no spare slot capacity. [BICSI OSP-DRD Ch. 6.4]
- **D — Incorrect.** 3 cassettes × 32 = 96 ports — far fewer than the 192 subscribers to be served. This configuration would leave 96 subscribers without FDH connectivity. [TIA-758-C §8]

---

**Q5.** SC-APC connectors are the standard for hardened outdoor FDH applications on PSC program routes. Which of the following correctly distinguishes SC-APC from LC-APC?

- A) SC-APC uses a 1.25-mm ferrule; LC-APC uses a 2.5-mm ferrule — LC is preferred for high-density hub sites
- B) SC-APC uses a 2.5-mm ferrule (larger connector) and is standard for residential FTTH GPON; LC-APC uses a 1.25-mm ferrule (smaller connector) and enables higher port density in rack-mount hub-site applications **[CORRECT]**
- C) SC-APC and LC-APC use the same ferrule diameter; the difference is angle polish (APC) vs. flat polish (PC) only
- D) LC-APC is the RUS PE-60 required connector for all hardened outdoor FDH applications

*Rationale:*
- **A — Incorrect.** The ferrule sizes are inverted in this option. SC-APC uses the larger 2.5-mm ferrule; LC-APC uses the smaller 1.25-mm ferrule. The smaller LC ferrule is what enables higher port density in rack-mount applications. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **B — Correct.** SC-APC: 2.5-mm ferrule, larger physical connector, standard for residential FTTH GPON distribution in hardened outdoor FDH, widely field-serviceable, 24–48 SC-APC ports per cassette panel. LC-APC: 1.25-mm ferrule, smaller connector (~40% footprint reduction vs. SC), preferred for hub-site rack applications where port density per rack unit is critical. LC-APC requires more careful fiber management in the field and is less common in outdoor hardened FDH where field crews handle connectors in adverse weather conditions. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]
- **C — Incorrect.** SC and LC connectors differ in both ferrule diameter (2.5 mm vs. 1.25 mm) and physical form factor. The APC suffix on both indicates angle-polish — both have the angle-polished ferrule face. The distinction between SC-APC and LC-APC is the connector size and density capability, not just the polish type. [TIA-758-C §8]
- **D — Incorrect.** RUS PE-60 and 7 CFR Part 1755 do not mandate LC-APC for hardened outdoor FDH. SC-APC is the standard connector for residential GPON hardened FDH on PSC program routes. LC-APC is used in hub-site rack applications. [7 CFR Part 1755; RUS PE-60]

---

## Final Check

**Pulse 1.** State the correct FDH port-sizing formula using the growth factor 1.20. Explain why the GPON split ratio is NOT part of the formula.

*Expected answer:* The correct formula is: **minimum required port count = subscriber count × 1.20**, rounded up to the next standard FDH port-count increment. For 192 subscribers: 192 × 1.20 = 230.4 → round up to 288-port FDH.

The GPON split ratio (1:32) is the internal splitter cassette architecture — it determines how many cassettes are installed inside the FDH and how many subscribers each cassette serves. The FDH port count is the total number of distribution-side fiber ports on the FDH chassis. These ports are populated by splitter cassettes, but the total port count is sized from the subscriber count + growth factor independently of how the split ratio fills those ports. Multiplying subscriber count × split ratio × growth factor would produce a nonsensical result (e.g., 192 × 32 × 1.20 = 7,373) — far exceeding any standard FDH size and representing a fundamental misunderstanding of the architecture. [TIA-758-C §8; BICSI OSP-DRD Ch. 6.4]

**Pulse 2.** Which RUS regulatory references govern hardened FDH procurement on PSC program routes, and what is the key distinction from RUS Bulletin 1738?

*Expected answer:* **7 CFR Part 1755** (materials and construction standards for RUS-funded telecommunications facilities) and **RUS PE-60** (specifications and drawings) govern FDH procurement on PSC program routes. RUS Bulletin 1738 governs the Electric Borrowers Program — a completely separate RUS program with different eligibility and applicability. PSC program work is funded under the RUS Telecom Program (7 CFR Part 1755), not the Electric Borrowers Program. Citing 1738 on a PSC program submittal is a regulatory error that will trigger a review comment from the RUS area engineer. [7 CFR Part 1755; RUS PE-60]

---

## Glossary Cross-References

- **FDH housing grounding and bonding** → T6 L6.7 (required before closing any hardened FDH installation; grounding is T6 scope, not T5 scope)
- **NEMA 4 enclosure selection for pad-mount FDH** → T5 L5.8 (pedestal and cabinet NEMA rating selection; hardened FDH is IP65/NEMA 4 class)
- **Drop terminals, MST, and NID — network layer below FDH** → T5 L5.10 (the distribution side of the FDH connects to MSTs and drop terminals)
- **OptiTap and hardened connector mechanics** → T2 L2.9 (connector mechanics for FDH distribution ports; do not re-teach here)
- **7 CFR Part 1755 and RUS PE-60** → T4 L4.14 (RUS Bulletins overview; 7 CFR Part 1755 applicability established there)
