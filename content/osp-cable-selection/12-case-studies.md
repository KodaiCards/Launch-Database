---
title: "Lesson 12: Hands-On Case Studies"
duration_min: 30
topic: cable-selection
order: 12
bicsi_alignment:
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
  - "OSP-DRD 5.5: Network architecture and cable hierarchy"
  - "OSP-DRD 5.6: Compliance requirements for outside plant cabling"
  - "OSP-DRD 6.1–6.3: OSP installation methods and documentation"
  - "OSP-DRD 7.1: Documentation and as-built records"
sources:
  - "ANSI/TIA-758-C §4.2, §5.2–5.7, §6.1–6.5, and §7"
  - "ANSI/TIA-472AAAB (outdoor loose-tube cable specification)"
  - "IEEE 1222 (all-dielectric self-supporting aerial fiber optic cable)"
  - "NESC (National Electrical Safety Code) C2-2023, Rules 230, 232, 250–251, 352, 354"
  - "NEC Article 770"
  - "BICSI OSP-DRD Manual, Ch. 4–8"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 5–7"
  - "CommScope Cabling Systems Reference Manual Ch. 3 and Ch. 7"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §2–6"
  - "USDA RUS Bulletin 1753F-601 (fiber optic installations on RUS-financed systems)"
---

# Hands-On Case Studies

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Apply the complete OSP cable selection framework — environment, tier, fiber count, compliance — to a realistic multi-segment network design scenario
- Identify design errors in a proposed cable specification and correct them with citations to applicable standards
- Produce a cable schedule and key compliance deliverables for a completed OSP project
- Recognize the common construction pitfalls specific to each of the three major deployment scenarios: RUS-funded rural FTTH backbone, aerial-to-underground subdivision transition, and storm-hardening aerial retrofit

---

## Reading Content

This lesson presents three worked case studies drawn from scenarios representative of real-world OSP design practice. Each case study follows the same structure: scenario narrative, step-by-step guided decision points with citations, common pitfalls for the scenario type, and a recommended cable specification summary.

---

### Case Study A — RUS-Funded Rural FTTH Backbone

#### Scenario

A rural electric cooperative in eastern Iowa holds a USDA Rural Utilities Service (RUS) loan commitment of $8.4 million to build a fiber-to-the-home network serving 1,240 households across a 690 square-mile service territory. The existing plant consists of copper distribution pairs serving 14 exchange areas. The fiber build is a greenfield deployment.

**Network architecture:**
- One central office hub site (existing co-op switching facility)
- 40 miles (64 km) of OS2 feeder cable from the hub to 6 FDH locations
- 12 miles (19.3 km) of distribution cable from each FDH to FDT pedestals in serving clusters
- 800 service drops from FDT pedestals to customer premises
- PON architecture: 32:1 passive splitters at FDT pedestals
- Route environment: primarily direct-bury through agricultural fields; aerial on rural electric co-op pole lines (7.2 kV and 12.5 kV distribution circuits) for 14 of the 40 feeder miles; 3 county highway crossings on the feeder routes

**RUS compliance note:** RUS Bulletin 1753F-601 requires all fiber cable to meet ANSI/TIA-758-C specifications; OSP-grade OS2 fiber is required for all feeder and distribution cable [USDA RUS Bulletin 1753F-601 §4.2].

---

#### Decision Point 1 — Feeder Cable: Fiber Count

**Given:** 1,240 homes, 32:1 splitters at FDT, 6 FDH locations (approximately 207 homes per FDH service area average).

**Step 1 — Active feeder fiber count per FDH route:**
207 homes ÷ 32 (splitter ratio) = 6.47 → round up to **7 active feeder fibers** per FDH service area.

**Step 2 — BICSI feeder design multiple:**
7 active × 4 (BICSI 4× feeder multiple) = **28 fibers minimum** per feeder route [BICSI OSP-DRD Manual, Ch. 5.5].

**Step 3 — Add SCADA reserve:**
The RUS-funded build includes a 4-fiber SCADA allocation for the co-op's electrical grid management system on each feeder route: 28 + 4 = **32 fibers minimum** per route.

**Step 4 — Standard cable selection:**
The next standard loose-tube cable configuration above 32 fibers is **36 fibers** (3-tube × 12-FPT) or **48 fibers** (4-tube × 12-FPT). Given the long-term capacity growth expected in a RUS-financed network (25+ year service life), engineering practice recommends selecting the **48-fiber** configuration to provide 16 additional dark fibers beyond the design multiple minimum. Corning and CommScope publish standard 48-fiber loose-tube OSP cables as a common stock configuration [BICSI OSP-DRD Manual, Ch. 5.5; Corning OSP Reference, Ch. 6.1].

**Selected feeder specification:** 48-fiber loose-tube OS2, gel-fill, CST armor (direct-bury segments), ADSS span-rated for applicable NESC loading district (aerial segments on co-op lines), PE sheath [ANSI/TIA-758-C §5.3, §5.6, §5.6.3].

---

#### Decision Point 2 — Aerial Feeder Segment

**Given:** 14 aerial miles on 7.2 kV and 12.5 kV rural electric co-op distribution lines; NESC medium loading district (central Iowa; 0.25 in. radial ice + 4 psf wind).

**Cable required:** ADSS, because all co-op pole lines are energized. Metallic messenger is prohibited on energized lines [IEEE 1222; NESC C2-2023, Rule 235G].

**Span engineering:** Co-op pole spacing averages 225 feet (68.6 m). ADSS cable must be rated for a 225-foot span in the NESC medium loading district. The manufacturer's sag-tension tables are consulted for the 48-fiber ADSS cable at 225-foot span, medium district. EDS at 15°C must not exceed 25% RTS per IEEE 1222 §5.2.

**Ground clearance verification:** At maximum ice load (medium district: 0.25 in. radial ice at 0°F), sag at mid-span must leave a minimum **18-foot (5.5 m)** clearance above any public road crossing, per NESC C2-2023 Rule 232. Three county highway crossings require specific sag calculation for the crossing span.

**No bonding required:** ADSS is fully dielectric — no armor grounding at pole attachment points [ANSI/TIA-758-C §5.6.3; NESC C2-2023, Rule 352].

---

#### Decision Point 3 — Direct-Bury Feeder Segment

**Given:** 26 direct-bury miles through central Iowa agricultural land; loam and clay-loam soil; frost line approximately 36 inches; documented pocket gopher activity in the region per Iowa DNR survey data.

**Cable required:** Loose-tube OS2, CST armor (documented gopher activity requires metallic armor deterrent), gel-fill, PE sheath [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2].

**Burial depth:** 30 inches minimum — this exceeds the ANSI/TIA-758-C §6.3 minimum of 24 inches (general soil) and accommodates the 36-inch frost line. At the three county highway crossings: 36-inch minimum burial depth per ANSI/TIA-758-C §6.3, with directional bore installation (no pavement cut) [ANSI/TIA-758-C §6.3].

**Bonding and grounding:** CST armor must be bonded to a ground rod at each splice closure and at each aerial-to-underground transition. Minimum 6 AWG copper bonding conductor; ground rod resistance documented at each point per NESC Rule 352 [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].

**Cable order calculation for feeder routes (sample: Route 1, 7.2 miles direct-bury):**
- Route distance: 7.2 mi × 5,280 ft/mi = 38,016 ft = 11,590 m
- Splice closures (assume one per mile): 7 × 10 m slack = 70 m
- Aerial-to-underground transitions (2 points): 2 × 15 m riser loop = 30 m
- 5% contingency: (11,590 + 70 + 30) × 0.05 = 584 m
- **Total order: ~12,275 m (approximately 12,300 m)**

[ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

---

#### Decision Point 4 — Distribution and Drop

**Distribution cable specification:** 24-fiber loose-tube OS2, no armor (conduit in subdivisions; CST armor for direct-bury segments on rural distribution routes), gel-fill, PE sheath [ANSI/TIA-758-C §5.3].

*Fiber count check for a sample FDT cluster of 32 homes:*
32 homes ÷ 32 (splitter) = 1 active distribution fiber.
BICSI 3× distribution multiple: 1 × 3 = 3 fibers minimum. Standard cable: 12-fiber minimum (1-tube × 12-FPT). [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

**Drop cable specification:**
- Aerial drops (most residential): 2-fiber flat all-dielectric drop cable, UV-stabilized PE sheath [ANSI/TIA-758-C §5.7; AFL OSP Cable Design Guide, §2.2]
- Direct-bury drops (rural premises with no pole near the NID): 4-fiber armored drop cable, CST armor, gel-fill, PE sheath, vibratory plow installation [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

---

#### Common Pitfalls — RUS FTTH Backbone

1. **Undersizing feeder fiber count:** Applying only the active circuit count without the BICSI 4× feeder design multiple produces a feeder that has zero dark fiber reserve within five years of service. RUS-funded builds must document design multiple compliance [BICSI OSP-DRD Manual, Ch. 5.5; USDA RUS Bulletin 1753F-601].
2. **Specifying lashed aerial on energized co-op lines:** A steel messenger on an energized distribution line requires costly bonding hardware at every pole and creates crew safety hazards for the 25-year service life of the cable plant. ADSS is the only compliant option on energized pole lines [IEEE 1222; NESC C2-2023, Rule 235G].
3. **Omitting SCADA fiber allocation:** Rural electric co-ops almost universally deploy fiber-based SCADA on their fiber plants. Failing to reserve SCADA fiber at the design phase requires a separate cable pull and additional splice closures later — a recurring and preventable cost.
4. **Insufficient slack at county highway crossings:** Highway crossing splice closures are difficult to excavate for repair. The 10-meter slack minimum at each closure must be verified and documented [ANSI/TIA-758-C §6.4].

---

#### Cable Specification Summary — Case Study A

| Segment | Cable specification | Key standard |
|---|---|---|
| Feeder, direct-bury | 48-fiber, loose-tube OS2, gel-fill, CST armor, PE sheath | ANSI/TIA-758-C §5.6 |
| Feeder, aerial (co-op lines) | 48-fiber ADSS, span-rated (225 ft, NESC medium), PE sheath | IEEE 1222; ANSI/TIA-758-C §5.6.3 |
| Distribution, direct-bury | 24-fiber, loose-tube OS2, gel-fill, CST armor, PE sheath | ANSI/TIA-758-C §5.6 |
| Distribution, conduit | 24-fiber, loose-tube OS2, gel-fill, no armor, PE sheath | ANSI/TIA-758-C §5.3 |
| Drop, aerial | 2-fiber flat all-dielectric, PE sheath | ANSI/TIA-758-C §5.7 |
| Drop, direct-bury | 4-fiber armored drop, CST armor, gel-fill, PE sheath | ANSI/TIA-758-C §5.6 |

---

### Case Study B — Aerial-to-Underground Transition at a Subdivision Development

#### Scenario

A telecom provider is extending fiber service to a 280-lot residential subdivision at the edge of an existing rural network. The existing network terminates at an aerial FDH mounted on a wooden pole at the subdivision entrance. From the FDH, the distribution network must be built through the subdivision.

**Network architecture:**
- Existing: aerial feeder (ADSS, 144-fiber) terminates at FDH at pole 47 on the rural co-op line (7.2 kV energized)
- New distribution: from FDH, the route runs 2.8 miles through the subdivision to 7 FDT pedestals (40 homes per FDT average)
- All new distribution cable is underground: 1.4 miles in 4-inch Schedule 40 PVC conduit within the subdivision street ROW, then 1.4 miles direct-bury through rear easements between lots
- The entry street crossing under the subdivision's main entrance road requires bore installation at a minimum depth of 36 inches
- The distribution cable exits the subdivision's conduit system and enters the NOC building of the homeowners' association 180 feet from the building penetration to the equipment room

**PSC RUS Domain:** This scenario is representative of engineering services firm work on PSC RUS-funded FTTH builds — aerial-to-underground transitions at the boundary of existing rural aerial plant and new subdivision underground plant.

---

#### Decision Point 1 — Distribution Cable: Environment and Construction

**Conduit segment (1.4 miles in 4-inch Schedule 40 PVC):**
Loose-tube OS2, no armor, gel-fill, PE sheath. The conduit provides mechanical protection; armor is over-specification that increases pulling tension without adding protection. Maximum pulling tension (RTL): 2,700 N; maximum sidewall pressure (RSL): 220 N/m [ANSI/TIA-758-C §5.3, §6.2].

*Conduit fill check:* 4-inch Schedule 40 PVC inner diameter: 4.026 inches (102.3 mm). A 48-fiber loose-tube cable has an approximate outer diameter of 14.5 mm. Single cable fill: π × (14.5/2)² / π × (102.3/2)² = 165.1 mm² / 8,220 mm² = 2.0% fill ratio. Well below the 40% multi-cable limit; suitable for adding additional cables later [NEC Chapter 9, Table 1; ANSI/TIA-758-C §6.1].

**Direct-bury segment (1.4 miles through rear easements):**
Loose-tube OS2, CST armor, gel-fill, PE sheath. Rear easements in residential subdivisions have no documented rodent pressure but are subject to incidental dig-up by homeowners. CST armor provides the mechanical protection required by ANSI/TIA-758-C §5.6 for direct-bury in residential environments.

**Burial depth:** 24 inches minimum for direct-bury segments; 36 inches under the entrance road crossing with directional bore [ANSI/TIA-758-C §6.3].

---

#### Decision Point 2 — Distribution Fiber Count

**Given:** 280 lots, 7 FDTs, 32:1 splitters at FDT (40 homes per FDT). Each FDT serves 40 homes.

*Per FDT:* 40 homes ÷ 32 (splitter) = 1.25 → round up to **2 active distribution fibers** per FDT cluster.

*From FDH to all 7 FDTs (total distribution cable from FDH):*
7 FDTs × 2 active fibers = **14 active distribution fibers** in the main distribution cable segment from FDH.

*BICSI 3× distribution multiple:* 14 × 3 = **42 fibers minimum** in the distribution cable from FDH.

Standard cable selection: **48-fiber** loose-tube OS2 (4-tube × 12-FPT) — the standard configuration above 42 fibers, providing 6 dark fiber pairs in reserve [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4].

---

#### Decision Point 3 — Building Entry at HOA NOC

**Given:** Cable enters HOA NOC building, 180 feet from building entry to equipment room.

NEC Article 770.113 permits OSP cable to extend a maximum of **50 feet** inside the building. The equipment room is 180 feet from building entry — 130 feet beyond the NEC maximum.

**Required solution:**
1. OSP cable (CST-armored direct-bury) enters building at grade. At maximum 50 feet from entry point: **Building Entry Terminal (BET)** installed. CST armor bonded to ground rod at BET location per NESC Rule 352 [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].
2. From BET to equipment room (130 feet remaining): **OFNR-rated indoor optical fiber cable** (same fiber count as the distribution cable — 48 fibers). If any portion of the 130-foot run passes through the building's HVAC plenum space (ceiling return-air plenum), OFNP is required for that segment [NEC Article 770.113].
3. At equipment room: fibers terminate at a patch panel or splice tray within the FDH / distribution frame.

---

#### Common Pitfalls — Subdivision Transition

1. **Installing CST armor in conduit:** Engineers accustomed to specifying armored cable for all OSP work sometimes specify CST-armored cable in the conduit segment. This adds 15–25% to cable weight, increases pulling tension toward RTL limits, and adds unnecessary cost. Conduit provides armor's function [ANSI/TIA-758-C §5.3].
2. **Forgetting the entrance road crossing depth:** The subdivision entrance road is a public road even if not a county highway. ANSI/TIA-758-C §6.3 requires 36-inch minimum depth under all roads. Directional bore is required to avoid cutting and repaving [ANSI/TIA-758-C §6.3].
3. **Omitting the BET:** A common field shortcut is to run OSP cable all the way to the equipment room without a BET, relying on the cable's PE sheath to "protect" the indoor run. This is a NEC 770.113 violation; the building is not compliant for occupancy inspection until the BET and OFNR transition are installed [NEC Article 770.113].
4. **Not verifying FDH location is accessible for future splicing:** The FDH at the pole is an aerial closure on an energized line. Splicing at height on an energized line requires OSHA-compliant fall protection, appropriate working clearances from energized conductors, and utility coordination. The design should specify a ground-level FDH pedestal wherever pole-mount creates future maintenance access problems [BICSI OSP-DRD Manual, Ch. 4.1].

---

#### Cable Specification Summary — Case Study B

| Segment | Cable specification | Key standard |
|---|---|---|
| Distribution, conduit | 48-fiber, loose-tube OS2, gel-fill, no armor, PE sheath | ANSI/TIA-758-C §5.3 |
| Distribution, direct-bury (rear easements) | 48-fiber, loose-tube OS2, gel-fill, CST armor, PE sheath | ANSI/TIA-758-C §5.6 |
| HOA NOC building entry (≤ 50 ft) | OSP cable continues; armor bonded at BET | NEC 770.113; ANSI/TIA-758-C §5.2 |
| HOA NOC BET to equipment room (130 ft) | 48-fiber OFNR indoor cable | NEC 770.113 |
| Residential drops, aerial | 2-fiber flat all-dielectric, UV-stabilized PE | ANSI/TIA-758-C §5.7 |

---

### Case Study C — Storm-Hardening Retrofit of an Aerial Run

#### Scenario

A regional telecom provider's aerial feeder plant in coastal North Carolina suffered repeated outages during Atlantic hurricane seasons. The existing plant consists of 22 miles of lashed aerial cable — a 36-fiber OS2 loose-tube cable lashed to a 3/8-inch galvanized steel messenger — installed in 1994 on a mix of wooden utility poles and concrete poles. The route runs along a coastal highway right-of-way designated as a NESC extreme-wind loading zone (130 mph design wind speed). The messenger strand is undersized for the extreme-wind designation (it was installed before the extreme-wind designation was applied to this zone) and has experienced multiple strand failures.

**Retrofit objective:** Replace the existing lashed aerial cable plant with an all-dielectric, storm-hardened aerial design that meets the current NESC extreme-wind loading zone requirements. New fiber count: 144-fiber (upgrade from 36-fiber to support future network densification).

---

#### Decision Point 1 — New Cable Type

**Existing:** Lashed aerial (galvanized steel messenger + fiber cable lashed to it). Pole line carries no energized electrical circuits — it is a dedicated fiber/telecom pole line.

**Replacement options:**
- Option A: Replace messenger with properly-rated strand; re-lash new 144-fiber cable
- Option B: Replace entire plant with ADSS 144-fiber cable, span-rated for NESC extreme-wind zone

**Recommendation — Option B (ADSS):**
Although the pole line has no energized circuits (eliminating ADSS's primary advantage of dielectric construction on energized lines), ADSS provides the superior storm-hardening design:
1. No messenger strand to fail — the single largest cause of the existing outages was messenger strand failure. ADSS eliminates the messenger entirely.
2. Lower wind profile — ADSS cables have a smaller cross-sectional diameter than a lashed cable assembly (cable + messenger + lashing wire). Lower diameter reduces the wind force on the assembly during hurricane-force winds. In the NESC extreme-wind zone, reducing wind load directly reduces the peak tension on the cable and pole attachment hardware.
3. No bonding/grounding complexity — the existing metallic messenger required bonding at every pole attachment. ADSS eliminates this maintenance requirement for the service life of the cable plant.
4. Single contractor task — installing ADSS removes the messenger stringing step, simplifying the installation and reducing labor cost by approximately 20–30% for aerial-only routes.

**ADSS specification for NESC extreme-wind zone:**
The cable must be rated by the manufacturer for the span length (average 250 feet / 76 m for this pole line) and the NESC extreme-wind design parameters. NESC extreme-wind design is based on a 3-second gust speed map (ASCE 7 wind speed map) rather than the ice-plus-wind formula used for light/medium/heavy districts. The cable engineer must obtain manufacturer sag-tension tables for the 144-fiber ADSS at 250-foot span in the applicable extreme-wind zone [IEEE 1222 §5.2; NESC C2-2023, Rules 250–251].

**EDS verification:** At the applicable stringing temperature for coastal North Carolina (~20°C average everyday temperature), the cable must be strung to achieve EDS ≤ 20–25% RTS. The sag-tension table provides the target sag in inches for each span length at the stringing temperature [IEEE 1222 §5.2].

**NESC clearance verification:** At maximum design wind load (no ice for extreme-wind zone; wind governs rather than combined ice-plus-wind), sag must maintain a minimum 18-foot clearance above the coastal highway at mid-span of the crossing span [NESC C2-2023, Rule 232].

---

#### Decision Point 2 — Fiber Count Upgrade: Splice Compatibility

**Existing:** 36-fiber loose-tube OS2.
**Replacement:** 144-fiber ADSS OS2 (same fiber type: OS2 — fully splice-compatible).

The replacement cable uses the same OS2 fiber type and the same cladding diameter (125 µm). Fusion splices between the existing 36-fiber OS2 and the new 144-fiber OS2 are mechanically and optically compatible. At each end of the replacement route, 36 of the 144 fibers in the new cable are spliced to the existing 36-fiber OS2 cable in a splice closure; the remaining 108 fibers are available as dark fiber for future circuits.

**Splice closure at each end:** The splice closures at the route termination points must be rated for 144 fibers (new cable side) and 36 fibers (existing cable side) in the same closure. A **transition closure** — an in-line closure with two cable entry ports of different diameters — is specified. Each closure requires a 10-meter slack loop on both the new and existing cable per ANSI/TIA-758-C §6.4 [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4].

---

#### Decision Point 3 — Compliance and Documentation for the Retrofit

**Bonding and grounding at existing metallic messenger removal:**
When removing the existing galvanized steel messenger from the pole line, all bonding conductors connecting the messenger to pole ground electrodes must be removed and ground rods left in place (or capped) per the pole owner's specifications. The ADSS replacement cable requires no new bonding at pole attachment points.

**OTDR acceptance testing:**
All 144 fibers in the new ADSS cable must be OTDR tested at 1310 nm and 1550 nm from both ends before the cable is accepted. The 36 splice connections at each end of the route (new cable to existing cable) must each show splice loss ≤ 0.1 dB (maximum per-splice specification for a route of this length) per ANSI/TIA-758-C §7 and BICSI OSP-DRD Manual Ch. 7.

**As-built documentation:**
1. Route drawing updated to show new ADSS cable, span lengths, pole IDs, sag values at each span, and FDH/splice closure locations [ANSI/TIA-758-C §7]
2. Sag measurement records for each span: measured sag at stringing temperature, compared to target sag from manufacturer's table
3. OTDR traces and OLTS insertion loss records for all 144 fibers [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7]
4. Fiber assignment table updated: 36 fibers assigned to existing circuits (spliced to existing cable), 108 fibers listed as dark reserve [BICSI OSP-DRD Manual, Ch. 8]

---

#### Common Pitfalls — Storm-Hardening Retrofit

1. **Retaining the messenger "to save cost":** Some engineers propose keeping the existing undersized messenger and replacing only the fiber cable. This leaves the single-point failure (undersized strand) in place and wastes the storm-hardening investment. ADSS is the correct solution when the messenger is the failure mode.
2. **Specifying ADSS for the wrong span:** ADSS cables are span-specific — a cable rated for 200-foot spans cannot be safely deployed on 300-foot spans without exceeding the manufacturer's EDS specification. Span lengths must be measured and cable selected accordingly. Spans that cannot achieve NESC clearance within the EDS limit require additional poles.
3. **Neglecting sag verification after stringing:** Crews that string cable using a tension gauge without verifying actual sag with a transit or optical sag meter may leave cables over-tensioned (too tight at stringing temperature → insufficient sag → inadequate clearance under ice or wind load) or under-tensioned (too loose → excessive sag → NESC clearance violation). Sag verification at each span is required before final attachment.
4. **Omitting splice loss testing at transition closures:** The 36 fusion splices at each route terminus connecting the new 144-fiber ADSS to the existing 36-fiber cable are the highest-consequence connections in the retrofit — they carry all existing active circuits. Each splice must be OTDR-verified for loss ≤ 0.1 dB before the closure is sealed. A poor splice discovered after closure sealing requires reopening the closure in a bucket truck at height, adding significant cost.

---

#### Cable Specification Summary — Case Study C

| Segment | Cable specification | Key standard |
|---|---|---|
| Replacement aerial, 22 miles | 144-fiber ADSS, span-rated for 250-ft span, NESC extreme-wind zone; UV-stabilized PE sheath | IEEE 1222; ANSI/TIA-758-C §5.6.3 |
| Transition splice closures (2) | Inline transition closure, 144F new cable + 36F existing cable; 10 m slack each side | ANSI/TIA-758-C §6.4 |
| Acceptance testing | OTDR 1310 nm + 1550 nm, both ends, all 144 fibers; OLTS insertion loss for all active circuits | ANSI/TIA-526-7; BICSI OSP-DRD Ch. 7 |

---

## Key Terms (Flashcard Candidates)

**Greenfield deployment**
An OSP fiber build into a territory with no existing fiber infrastructure. All cables, conduit, poles, and passive hardware are new. Contrasted with brownfield deployment (overlay of new fiber on existing infrastructure). RUS FTTH builds are typically greenfield. [USDA RUS Bulletin 1753F-601; BICSI OSP-DRD Manual, Ch. 4.1]

**SCADA fiber allocation**
A reserved fiber count within an OSP cable designated for supervisory control and data acquisition (SCADA) systems — electric grid management, water system control, pipeline monitoring. On rural electric cooperative networks, SCADA fiber is typically 4–8 fibers per feeder route, allocated at the design phase. [BICSI OSP-DRD Manual, Ch. 5.5]

**Transition closure**
A splice closure with two cable entry ports of different diameters or fiber counts, used where a replacement cable (higher fiber count) is connected to an existing cable (lower fiber count). Required at each terminus of a cable plant upgrade. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

**NESC extreme-wind zone**
A coastal geographic designation in NESC C2-2023 where design loading is governed by extreme wind speed (per ASCE 7 wind speed map, 3-second gust) rather than the ice-plus-wind formula used for light/medium/heavy loading districts. Applicable to Gulf Coast, Atlantic Coast, and Pacific Coast areas exposed to hurricane and major storm-force winds. [NESC C2-2023, Rules 250–251]

**EDS (Every Day Stress)**
The stringing tension applied to an aerial cable or messenger at average everyday temperature, expressed as a percentage of rated tensile strength (RTS). IEEE 1222 recommends EDS ≤ 20–25% RTS for ADSS cables to limit fatigue damage from Aeolian vibration and maintain adequate sag margin under design loading. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Directional bore**
A trenchless horizontal drilling technique used to install conduit or cable under roadways, railways, and waterways without cutting the surface. Required at road crossings to avoid pavement cuts; provides installation depth of 36 inches or greater under roads per ANSI/TIA-758-C §6.3. [ANSI/TIA-758-C §6.3; BICSI OSP-DRD Manual, Ch. 6.2]

**Splice loss budget**
The maximum allowable insertion loss per fusion splice in a cable link, established to ensure that cumulative splice losses across all closures on a route do not exceed the total optical power budget. Typical target for OSP fusion splices: ≤ 0.1 dB per splice, with OTDR-verified acceptance at closeout. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2]

**Dark fiber reserve**
Installed fibers within a cable that are not connected to active circuits — available for future network expansion, circuit protection, or resale. BICSI design multiples (4× feeder, 3× distribution, 2× drop) define the target dark-fiber reserve proportion. Dark fiber reserve must be documented in the fiber assignment table. [BICSI OSP-DRD Manual, Ch. 5.5, Ch. 8]

**HOA NOC (homeowners association network operations center)**
A common model in subdivision fiber deployments where the HOA owns the passive fiber infrastructure and houses the active electronics (OLT, router, managed switch) in a shared utility room. Building entry and NEC 770.113 compliance apply identically to HOA NOCs as to any commercial facility. [NEC Article 770.113]

**Sag verification**
Post-stringing measurement of actual cable sag at mid-span using an optical sag meter, transit, or laser range finder, compared to the target sag from the manufacturer's sag-tension table at the measured stringing temperature. Required for acceptance documentation on ADSS aerial installations. [IEEE 1222 §5.2; ANSI/TIA-758-C §7]

---

## Multiple-Choice Quiz

---

**Q1.** In Case Study A (RUS FTTH), the designer specifies a 48-fiber feeder cable when the BICSI 4× design multiple calculation yields a 32-fiber minimum. What justifies selecting the next larger standard configuration (48 fibers)?

- A) USDA RUS regulations require all feeder cable to have a minimum of 48 fibers regardless of active count
- B) A 32-fiber standard cable does not exist — the next available configurations are 24-fiber and 48-fiber; 48 fibers is selected for capacity headroom **[CORRECT]**
- C) The 4× BICSI design multiple already accounts for dark fiber; no additional spare capacity is needed above the 32-fiber minimum
- D) ADSS aerial cable is only manufactured in 48-fiber configurations, requiring the upgrade

*Rationale:*
- **A — Incorrect.** USDA RUS Bulletin 1753F-601 requires ANSI/TIA-758-C compliance and OS2 fiber; it does not impose a categorical 48-fiber minimum on feeder cable. Fiber count is determined by the BICSI design multiple applied to the active count. [USDA RUS Bulletin 1753F-601 §4.2; BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Correct.** The BICSI 4× feeder minimum yields 32 fibers for this route. Standard loose-tube OSP cable is manufactured in configurations of 24, 36, 48, 72, 96, 144, and higher fiber counts. A 32-fiber cable is not a standard stock configuration available from Corning, CommScope, or AFL. The designer must select the **next available standard configuration above 32 fibers**, which is **36 or 48 fibers** depending on manufacturer. Selecting 48 over 36 provides an additional 12 dark fibers of capacity headroom for the 25+ year service life — a recognized engineering practice on RUS-funded builds. [BICSI OSP-DRD Manual, Ch. 5.5; Corning OSP Reference, Ch. 6.1]
- **C — Incorrect.** The BICSI 4× design multiple establishes the minimum fiber count that accounts for a reasonable spare capacity margin. Selecting the 32-fiber minimum (which doesn't exist as a standard cable) and providing zero additional dark fiber beyond the calculated minimum is poor long-term planning for a 25-year network. The design multiple is a minimum, not a maximum. [BICSI OSP-DRD Manual, Ch. 5.5]
- **D — Incorrect.** ADSS cable is manufactured across a wide range of fiber counts including 12, 24, 48, 96, 144, and 288. The 48-fiber selection is not driven by manufacturing constraints on ADSS cable. [Corning OSP Reference, Ch. 6.1; CommScope Reference Manual, Ch. 7]

---

**Q2.** In Case Study B (subdivision transition), the distribution cable is specified without armor for the 1.4-mile conduit segment. A field supervisor objects, arguing that all direct-bury OSP cable must be armored per ANSI/TIA-758-C §5.6. How should the designer respond?

- A) The supervisor is correct — ANSI/TIA-758-C §5.6 requires armor on all OSP cable regardless of installation method
- B) ANSI/TIA-758-C §5.6 specifically addresses direct-bury cable; conduit-installed cable (§5.3) does not require armor because the conduit provides mechanical protection **[CORRECT]**
- C) The supervisor is correct — any cable installed in Schedule 40 PVC conduit requires armor because PVC conduit provides no crush protection
- D) Armor is optional for all OSP cable; the field supervisor may add armor at their discretion

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §5.6 specifies armor requirements for **direct-bury** cable — cable installed in native soil without conduit protection. Section §5.3 governs conduit-installed cable and does not require armor. [ANSI/TIA-758-C §5.3, §5.6]
- **B — Correct.** ANSI/TIA-758-C uses distinct sections for conduit (§5.3) and direct-bury (§5.6) installation environments. §5.3 specifies loose-tube OS2 with water-blocking and PE sheath for conduit installation — no armor required or recommended. Armor in conduit adds weight, increases pulling tension toward the RTL limit, and stiffens the cable without providing additional protection because the conduit handles crush loads and soil forces. The supervisor's objection is based on a misapplication of §5.6 to a conduit installation [ANSI/TIA-758-C §5.3, §5.6].
- **C — Incorrect.** Schedule 40 PVC conduit provides substantial crush protection against soil overburden and vehicle loads. The conduit is specifically designed to protect its contents from soil mechanical threats — that is its structural function. PVC conduit has a published crush load rating that far exceeds the compressive forces typical OSP cables are specified to withstand. [ANSI/TIA-758-C §5.3; BICSI OSP-DRD Manual, Ch. 6.1]
- **D — Incorrect.** Armor specification is governed by ANSI/TIA-758-C, which assigns armor requirements based on the installation environment. Armor is not discretionary in either direction: it is required for direct-bury (§5.6) and not required (and counterproductive) for conduit installation (§5.3). [ANSI/TIA-758-C §5.3, §5.6]

---

**Q3.** In Case Study C (storm-hardening retrofit), the existing 36-fiber plant is being replaced with 144-fiber ADSS. At the termination splices, 36 of the new 144 fibers will be fusion-spliced to the existing 36-fiber OS2 cable. An engineer proposes mechanical splices instead of fusion splices to speed up the installation. What is the key technical objection?

- A) Mechanical splices are not permitted by ANSI/TIA-758-C for OSP applications
- B) Fusion splices achieve ≤ 0.1 dB loss per splice; mechanical splices typically achieve 0.2–0.5 dB per splice, which may consume too much of the available optical power budget on a 22-mile route **[CORRECT]**
- C) Mechanical splices cannot accommodate the diameter difference between the 36-fiber and 144-fiber cables
- D) Mechanical splices are not durable enough for outdoor splice closures

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C does not categorically prohibit mechanical splices in OSP applications. Both fusion and mechanical splices are recognized OSP methods. However, the standard's loss requirements and the link's power budget govern which is appropriate. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2]
- **B — Correct.** The technical objection is optical loss. A 22-mile (35.4 km) route accumulates substantial span attenuation. On a route this long, every fraction of a dB of additional splice loss reduces the optical power budget margin. Fusion splices on OS2 fiber routinely achieve **≤ 0.1 dB** per splice when executed by skilled technicians with a properly calibrated splicer. Mechanical splices (index-matching gel type) typically achieve **0.2–0.5 dB** per splice — two to five times higher. With 36 transition splices at each terminus, the difference between fusion (max 3.6 dB) and mechanical (max 18 dB) splice loss accumulation could be the difference between a link within its power budget and one that fails to operate. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.3]
- **C — Incorrect.** Splice compatibility is determined by fiber cladding diameter (125 µm for all OS2 cable regardless of fiber count in the cable), not by the cable's fiber count. Both the 36-fiber and 144-fiber cables contain the same 125 µm cladding OS2 fiber — mechanical splices (like fusion splices) operate on individual fibers, not on the cable assembly. [ITU-T G.652.D §3.1; BICSI OSP-DRD Manual, Ch. 7.3]
- **D — Incorrect.** Modern outdoor-rated mechanical splices are housed in environmentally sealed bodies designed for OSP splice tray use. Durability in outdoor splice closures is not the primary objection. The optical loss performance is the deciding factor on a 22-mile route. [BICSI OSP-DRD Manual, Ch. 7.3]

---

**Q4.** Which of the following represents the correct OTDR testing protocol for the 22-mile ADSS cable installed in Case Study C?

- A) OTDR at 1310 nm from one end, on all 144 fibers
- B) OTDR at 1310 nm and 1550 nm, from both ends, on a sample of 12 fibers per cable drum
- C) OTDR at 1310 nm and 1550 nm, from both ends, on all 144 fibers **[CORRECT]**
- D) OTDR at 1550 nm only, from one end, on all 144 fibers — 1310 nm is not needed for aerial cable

*Rationale:*
- **A — Incorrect.** Single-wavelength testing at 1310 nm misses macro-bend loss events that are substantially more visible at 1550 nm. On a 22-mile aerial route, stringing errors and hardware attachment issues can produce subtle macro-bends invisible at 1310 nm but measurable at 1550 nm [BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.1].
- **B — Incorrect.** Sampling (12 fibers per drum) does not provide full-plant acceptance documentation. ANSI/TIA-526-7 and BICSI OSP-DRD Manual require testing of all installed fibers for project acceptance. A sampled result does not identify defects in the untested fibers [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2].
- **C — Correct.** The required protocol is **OTDR at both 1310 nm and 1550 nm, from both ends, on all 144 fibers**. Two wavelengths: the 1310 nm trace identifies splice events, connectors, and the overall attenuation profile. The 1550 nm trace identifies macro-bend loss events that are wavelength-dependent. Two-end testing: testing from both ends allows dead-zone events near one end (obscured by the launch-pulse dead zone from that end) to be resolved from the other end. All 144 fibers: full plant acceptance requires testing every fiber. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]
- **D — Incorrect.** 1310 nm testing is required alongside 1550 nm; neither wavelength alone provides sufficient characterization of the installed plant. For aerial cable specifically, 1310 nm is effective at identifying attachment hardware issues that produce reflective events (back-reflections from hardware contact points), while 1550 nm identifies bend events at clamp attachment points where the cable radius is tight. Both are required [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2].

---

**Q5.** In Case Study A, the BICSI design multiple applied to feeder cable is 4×. Which of the following scenarios would most justify reducing the design multiple below 4× on a specific feeder route?

- A) The feeder route is aerial on an energized pole line, which reduces the probability of cable cuts
- B) The network owner plans to upgrade to a 16:1 splitter ratio within 3 years, reducing the required active fiber count
- C) The feeder route is short (0.8 miles) and serves a single FDH where the cable can be easily replaced if capacity is exhausted
- D) No scenario justifies reducing below 4× on a feeder route — the 4× minimum is a BICSI OSP-DRD hard requirement

*Rationale:*
- **A — Incorrect.** Aerial installation reduces the probability of accidental excavation damage but does not reduce the long-term capacity growth need that the 4× multiple addresses. Fiber count sizing is driven by capacity planning, not cable fault probability. [BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Incorrect.** Moving from a 32:1 to a 16:1 splitter ratio increases the required active fiber count (more fibers needed per served customer). This would increase, not decrease, the required feeder fiber count. [BICSI OSP-DRD Manual, Ch. 5.5]
- **C — Correct.** The BICSI 4× feeder multiple is a **design guideline**, not a mandatory minimum with no exceptions. It is intended for long, difficult-to-replace feeder routes where adding future capacity requires excavating the entire route. For a **short feeder route (0.8 miles) to a single FDH** where cable replacement is relatively inexpensive and straightforward, a network owner may reasonably choose a lower design multiple (e.g., 2× or 3×) knowing that future upgrade is feasible. This is an explicit exception recognized in the BICSI OSP-DRD framework where route replaceability is high [BICSI OSP-DRD Manual, Ch. 5.5]. All exceptions must be documented in the design record.
- **D — Incorrect.** BICSI OSP-DRD design multiples are best-practice guidelines with recognized engineering judgment for exceptions — they are not regulatory code requirements with no exceptions. The BICSI framework acknowledges that design multiples are starting points and that specific route characteristics may justify deviation, which must be documented [BICSI OSP-DRD Manual, Ch. 5.5].

---

## Final Check

Answer before proceeding to the Topic Final Exam.

**Pulse 1.** A project engineer on a RUS-funded FTTH build receives a contractor's cable order that specifies 36-fiber loose-tube OS2 for the feeder routes — the minimum based on the BICSI 4× calculation. The engineer knows that 36-fiber is not a standard configuration from the specified manufacturer. What are the two actions the engineer should take?

*Expected answer:* (1) **Verify with the manufacturer** that 36-fiber is available as a stock item. Corning, CommScope, and AFL manufacture loose-tube OSP cable in standard configurations of 24, 48, 72, 96, and higher — not typically 36. If 36-fiber is not a standard stock item, the contractor must specify the next available configuration above the minimum, which is **48-fiber**. (2) **Review the design for capacity headroom.** Moving from the calculated 32-fiber minimum to a 48-fiber standard configuration provides 16 additional dark fibers in reserve for the 25-year service life. The engineer should document this selection decision in the design record as standard cable sizing practice for a RUS-financed build. [BICSI OSP-DRD Manual, Ch. 5.5; USDA RUS Bulletin 1753F-601; Corning OSP Reference, Ch. 6.1]

**Pulse 2.** In Case Study C, the existing 36-fiber lashed aerial cable is being replaced with 144-fiber ADSS. At the two transition splice closures, how many of the 144 new fibers will be spliced to the existing cable, and what happens to the remaining fibers?

*Expected answer:* At each transition closure, **36 fibers** from the 144-fiber ADSS cable are fusion-spliced to the 36 fibers of the existing OS2 cable — maintaining continuity of all existing active circuits. The remaining **108 fibers** (144 − 36 = 108) in the new ADSS cable are coiled and stored in the splice tray as **dark reserve**, documented in the fiber assignment table as "unassigned — available for future circuits." The dark fiber reserve is the capacity headroom provided by the upgrade from 36-fiber to 144-fiber. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 5.5, Ch. 8]

**Pulse 3.** A project manager claims that the as-built documentation package for Case Study B (subdivision transition) is complete with: (a) a route drawing, (b) OTDR traces at 1310 nm for all fibers, and (c) burial depth records every 800 feet. Identify all compliance gaps in this package and cite the applicable standard for each.

*Expected answer:* Three compliance gaps:
1. **Missing 1550 nm OTDR traces.** ANSI/TIA-526-7 and BICSI OSP-DRD Manual Ch. 7.2 require two-wavelength testing (1310 nm and 1550 nm) for OS2 OSP cable acceptance. The 1550 nm trace is required to identify macro-bend events not visible at 1310 nm. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]
2. **Missing OLTS insertion loss test results.** BICSI OSP-DRD Manual Ch. 7 and ANSI/TIA-568.3-D §11 require an OLTS (light source and power meter) insertion loss test for each installed link in addition to OTDR tracing. The OLTS provides the total link insertion loss figure for comparison to the optical power budget. [ANSI/TIA-568.3-D §11; BICSI OSP-DRD Manual, Ch. 7.2]
3. **Burial depth documentation interval too long.** ANSI/TIA-758-C §7 requires burial depth records at intervals not exceeding **500 feet**. Every-800-foot measurements leave 300-foot gaps in the burial depth record and do not satisfy the documentation standard. [ANSI/TIA-758-C §7]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **SCADA fiber allocation** → Lesson 8 (drop/distribution/feeder — dark fiber reserve first discussed there in context of design multiples)
- **Transition closure / dark fiber reserve / fiber assignment table** → Lesson 11 (compliance — BICSI OSP-DRD documentation requirements)
- **NESC extreme-wind zone / EDS / sag verification** → Lesson 4 (armored/aerial variants — ADSS EDS and NESC loading districts introduced), Lesson 11 (compliance — NESC loading district documentation)
- **Directional bore / burial depth 36 in.** → Lesson 10 (environment selection — road crossing burial depth), Lesson 11 (compliance — burial depth documentation)
- **Macro-bend / OTDR 1550 nm** → Lesson 11 (compliance — OTDR testing protocol and macro-bend detection)
- **Splice loss budget / OLTS** → Lesson 11 (compliance — optical power budget and acceptance testing)
- **BICSI design multiple (4×/3×/2×)** → Lesson 8 (drop/distribution/feeder — design multiples first applied in worked examples)
- **RUS / USDA Bulletin 1753F-601** → Lesson 10 (environment selection — RUS loan compliance requirements)
