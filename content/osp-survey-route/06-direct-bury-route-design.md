---
title: "Lesson 3.6: Direct-Bury Route Design — Plowing, Trenching, and Site Restoration"
duration_min: 20
topic: osp-survey-route
order: 6
bicsi_alignment:
  - "OSP-DRD Ch. 6.2: Direct-bury and plow-in construction"
sources:
  - "ANSI/TIA-758-C §6.3, §6.4 (direct-bury construction requirements)"
  - "BICSI OSP-DRD Manual, Ch. 6.2"
  - "RUS Bulletin 1751F-630 §5 (construction methods for rural fiber)"
  - "State DOT utility accommodation standards (varies by state — publicly available)"
---

# Direct-Bury Route Design — Plowing, Trenching, and Site Restoration

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the minimum burial depths for direct-bury cable in general rural ground and under improved roads per ANSI/TIA-758-C §6.3
- Compare vibratory plow, chain trencher, and rock saw installation methods and identify the soil and terrain conditions that determine which method is appropriate
- Describe the bedding and backfill requirements for direct-bury cable in rocky terrain and under road crossings
- Explain the site restoration requirements for agricultural land, pavement cuts, and revegetation, including the driver for each requirement
- Identify the plowability constraint on cable selection for plow-installed routes

---

## Reading Content

### Direct-Bury vs. Conduit: When Each is Right

Direct-bury — installing cable in the ground without a conduit — is the dominant installation method for rural OSP routes where future capacity growth is limited and where the cost of conduit exceeds its benefit. A direct-bury route costs less per foot to build than a conduit route, installs faster with less crew, and is fully adequate where the cable will not need to be replaced or supplemented within its service life.

The tradeoff is inflexibility. A direct-bury cable cannot be replaced without re-trenching. Future capacity additions require a new parallel trench or a new bore. For rural distribution plant that serves a fixed number of customer premises without anticipated growth, this tradeoff is economically favorable. For backbone routes expected to carry increasing traffic, conduit is the better long-term investment even at higher initial cost.

RUS Bulletin 1751F-630 §5 treats direct-bury installation as the standard method for rural OSP plant on RUS-funded projects, with conduit specified only where future access or capacity requirements justify the premium. [RUS Bulletin 1751F-630 §5; BICSI OSP-DRD Manual, Ch. 6.2]

### Minimum Burial Depths for Direct-Bury

ANSI/TIA-758-C §6.3 establishes the same baseline depth requirements for direct-bury cable as for conduit, because the protection function — shielding the cable from surface loads, frost, and agricultural operations — is the same regardless of whether a conduit is present:

| Installation context | Minimum depth (ANSI/TIA-758-C §6.3) |
|---|---|
| General rural ground (not under road) | 24 in. (610 mm) |
| Under improved roads (paved or gravel, active vehicle use) | 36 in. (914 mm) |
| Under railroads | Direct-bury without conduit is not standard practice under railroad ROW — use conduit with bore |
| Agricultural land with deep tillage operations | 36 in. minimum; confirm tillage depth and add 6–12 in. of margin where deep-till or subsoil equipment is used |

**Agricultural tillage caveat:** Standard tillage equipment operates at 8–14 in. depth, which is well above the 24-in. minimum. However, deep tillage (subsoiling, drainage tile installation, ripping) routinely reaches 18–30 in. On agricultural parcels with active drainage tile systems or planned subsoiling, the 24-in. minimum is insufficient. Confirm current and planned tillage practices with the landowner during easement negotiation and document the agreed minimum burial depth in the easement agreement. RUS Bulletin 1751F-630 §5 recommends 36 in. in active cropland for this reason. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §5]

### Installation Methods: Plow, Trencher, and Rock Saw

Three primary installation machines are used for direct-bury OSP cable. The selection among them is made by the route designer based on soil conditions, depth requirements, proximity to existing utilities, and the equipment available to the installing contractor.

**Vibratory Plow**

A vibratory plow cuts a narrow slot in the soil using a vibrating blade, draws the cable through the slot via a cable chute behind the blade, and closes the slot as the machine passes — leaving minimal surface disruption. The plow deposits cable at a controlled depth (24–36 in. typical range) and operates at 2–5 mph in suitable soil, making it the fastest and least expensive installation method on a per-foot basis.

Vibratory plow is appropriate where:
- Soil is cohesive and free of rocks (clay, loam, sandy loam without rock content)
- No existing utilities are within 18 in. of the proposed cable alignment (the blade cannot stop and restart precisely in a confined space)
- Terrain is relatively flat — grades greater than 15–20% can cause the plow blade to drift from the intended depth
- Installation depth is 24–36 in. (deeper installations may require a larger machine or reduce plow speed to maintain depth control)

Vibratory plow is not appropriate where:
- Rock is encountered at or above the burial depth — the blade stalls on rock and cannot achieve the required depth
- Existing utilities are present within the plow path — open excavation is required for clearance verification near known utility conflicts

**Cable plowability constraint:** OSP cable installed by vibratory plow experiences tensile stress (the plow machine's pulling force on the cable as it is drawn through the soil) and bending stress (the cable bends around the plow blade's radius). The cable must be rated for plow installation — its minimum bend radius during installation must be satisfied by the plow blade geometry, and its maximum tensile load during installation must not exceed the cable's tensile rating. Not all direct-bury cables are plow-rated; confirm with the cable manufacturer. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

**Chain Trencher**

A chain trencher cuts a trench of controlled width (4–6 in. typical) and depth using a rotating chain with cutting teeth, depositing the spoil in a windrow beside the trench. The cable is then placed in the trench and backfilled. Chain trenching creates more surface disturbance than plowing and is slower, but it offers advantages in conditions where the plow cannot operate:

- **Moderate rock content:** Chain trenchers can cut soft rock and fractured ledge that stops a vibratory plow, depending on tooth hardness and drive power.
- **Proximity to existing utilities:** Because the trench is open, the existing utility can be field-located and the cable placed with a known separation distance. Vibratory plow in proximity to other utilities requires potholing (hand-digging to expose the utility) before plowing, which eliminates the speed advantage.
- **Controlled cable placement:** In terrain where cable slack management is critical (near splice points, direction changes), the open trench allows the cable to be coiled at the bottom of the trench with precise slack control.

Chain trenching is the standard method for suburban and urban direct-bury routes where plow conditions cannot be guaranteed. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5]

**Rock Saw**

A rock saw (or rock wheel) cuts a narrow slot in consolidated rock using a circular cutting wheel with carbide or diamond teeth. Used where the route must pass through outcropping rock or consolidated ledge that a chain trencher cannot penetrate. Rock saw cutting is slow (2–20 ft per hour depending on rock hardness), expensive, and produces rock dust that requires containment under air quality permits in some jurisdictions.

Rock saw is used only where:
- Bedrock or consolidated rock is at or above the required burial depth
- Rerouting to avoid the rock formation is more expensive than cutting through it
- The applicable permit or ROW agreement allows rock cutting (some conservation easements and agricultural land ROW agreements prohibit rock saw due to soil disruption and drainage impacts)

Rock saw routes typically bury cable at reduced depth (12–18 in. in hard rock) with a concrete cap or RGS conduit cover providing the surface load protection that depth would otherwise provide. AHJ approval is required for reduced-depth installations. [BICSI OSP-DRD Manual, Ch. 6.2]

### Bedding and Backfill Requirements

For direct-bury cable in all installation methods, the material immediately surrounding the cable affects long-term cable protection and drainage.

**Sand bedding in rocky terrain:** Where the native soil contains sharp rock particles (fractured rock, gravel, shale chips), a 3-inch layer of clean sand or fine-crushed-stone bedding is placed below and beside the cable before backfill. Sharp particles can cut through the cable sheath under load cycling from frost and ground movement. Sand bedding creates a particle-free immediate environment. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

**Backfill:** Native spoil is used for backfill in most direct-bury routes. Large rock fragments (greater than 4-inch longest dimension) must be removed from the backfill material to prevent sheath damage during compaction. Where the native spoil is entirely rock, imported select fill or crushed stone is used.

**Under-road crossing backfill compaction:** For direct-bury crossings under gravel or paved roads (where permitted), backfill must be mechanically compacted in lifts to prevent road surface settlement over the trench. Most road agencies specify compaction to 95% or 100% of maximum Proctor density. Failure to meet compaction requirements creates a road surface depression that triggers the road agency to require repair at the contractor's expense. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

### Marker Tape

As with conduit installations, direct-bury cable must be marked with detectable warning tape placed 12 inches above the cable during backfill. The tape must be printed with a warning ("CAUTION — BURIED FIBER OPTIC CABLE" or equivalent) in high-visibility yellow. This is required by NESC Rule 354 (which covers communication conductors generally) and ANSI/TIA-758-C §6.3, and is a condition of most ROW and easement agreements. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]

### Site Restoration Requirements

Site restoration after direct-bury installation is a condition of virtually every ROW agreement and permit. Restoration requirements differ by surface type.

**Agricultural land:** Agricultural land restoration requirements are among the most demanding and most legally consequential for rural fiber contractors. Standard requirements:

- **Topsoil restoration:** The topsoil layer (typically 8–12 in.) must be stripped ahead of the machine, stockpiled separately from subsoil, and replaced on top of the compacted backfill. If subsoil is mixed with topsoil during installation, soil productivity is degraded and the landowner may seek damages.
- **Compaction limits:** Agricultural soils must be returned to a compaction state that allows crop root penetration. Most easement agreements specify a maximum post-construction compaction (typically ≤ 200 psi cone penetrometer resistance in the root zone, or equivalent). The contractor may be required to perform subsoil ripping on the disturbed strip after backfill to relieve compaction.
- **Seedbed preparation:** Final topsoil is disked, harrowed, and prepared for the landowner's seed or crop. In some easements, the contractor seeds the disturbed strip with a landowner-approved cover crop.
- **Settlement monitoring:** Plow installation in clay soils may produce a frost-settlement trench in the first winter. Most easement agreements require the contractor to return and backfill settlement depressions. [RUS Bulletin 1751F-630 §5]

**Pavement cuts (open-trench road crossings):**
- Saw-cut the pavement edge at a straight line; do not allow ragged pavement edges at the trench boundary.
- Install conduit (not bare cable) for the road crossing segment, with required burial depth and concrete encasement per the road agency's permit conditions.
- Backfill and compact to 95–100% Proctor density in lifts.
- Restore pavement to a condition equal to or better than the pre-existing pavement condition — the road agency inspector determines compliance.
- Most state DOTs require a pavement overlay of the entire lane width over the trench for primary road crossings to ensure surface continuity. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

**Revegetation of disturbed areas:**
For routes on non-agricultural land (roadsides, drainage ditches, utility corridors), the disturbed ground surface must be revegetated to prevent erosion. Requirements depend on the landowner and jurisdiction:
- Grass seed at a specified seeding rate (permanent or temporary cover, depending on season)
- Erosion control blanket on slopes steeper than 3:1 (horizontal:vertical)
- Temporary silt fence at the downslope edge of the trench during construction to prevent sediment runoff
- Permanent seeding and establishment verification before the contractor's restoration bond is released [State DOT utility accommodation standards]

---

## Key Terms (Flashcard Candidates)

**Vibratory plow**
A machine that cuts a narrow soil slot using a vibrating blade, draws cable through the slot via a chute, and closes the slot as it passes — leaving minimal surface disruption. Fastest and lowest-cost direct-bury method in cohesive, rock-free soil. Not suitable in rocky ground or proximity to existing utilities. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5]

**Cable plowability**
The requirement that cable installed by vibratory plow must withstand the tensile and bending loads of plow installation without damage. The plow blade radius must satisfy the cable's minimum bend radius during installation; the plow pulling force must not exceed the cable's rated installation tensile load. Not all direct-bury cables are plow-rated — verify with the manufacturer. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

**Chain trencher**
An excavation machine using a rotating cutting chain to dig a narrow trench (4–6 in. wide) at controlled depth. More disruptive than vibratory plow but allows cable placement with visual separation confirmation from existing utilities and works in moderate rock content. Standard method for suburban direct-bury routes. [BICSI OSP-DRD Manual, Ch. 6.2]

**Rock saw**
A narrow-slot cutting machine using a rotating carbide or diamond-toothed wheel for direct-bury installation through consolidated rock or ledge. Used only where rerouting is more expensive than cutting; slow, expensive, and often requires a concrete cap at reduced burial depth. [BICSI OSP-DRD Manual, Ch. 6.2]

**Sand bedding**
A 3-inch layer of clean sand or fine crushed stone placed below and beside direct-bury cable in rocky native soil to protect the cable sheath from sharp particle contact during ground movement and frost cycling. Required by ANSI/TIA-758-C §6.4 where native soil contains sharp rock fragments. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

**Topsoil restoration (agricultural land)**
The requirement to strip the topsoil layer (8–12 in.) ahead of the installation machine, stockpile it separately from subsoil, and replace it on the backfilled trench after installation. Mixing subsoil with topsoil degrades soil productivity and creates landowner liability. A standard condition of agricultural land ROW easement agreements. [RUS Bulletin 1751F-630 §5]

**Pavement restoration standard**
The requirement that pavement disturbed by an open-cut road crossing must be restored to equal or better condition than its pre-construction state, as determined by the road agency inspector. Typically requires: saw-cut edges, compaction to 95–100% Proctor density, and a full-lane pavement overlay on primary road crossings. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

---

## Interactive: Scenario — Installation Method Selection for a Mixed-Terrain Route

### Scenario

A 3-mile rural OSP route includes the following terrain segments (identified from field survey notes and NRCS Web Soil Survey data):

| Segment | Length | Terrain description |
|---|---|---|
| A | 1.4 mi | Flat cropland — loam/clay mix soil, no rock, active row-crop agriculture |
| B | 0.3 mi | Fence row with buried drain tile at 22 in. depth (811-confirmed) |
| C | 0.2 mi | County gravel road crossing |
| D | 0.6 mi | Pasture with 8–14 in. depth to fractured shale (NRCS confirms) |
| E | 0.5 mi | Grassy roadside ditch alongside state highway ROW |

For each segment, select: (1) installation method, (2) minimum burial depth, and (3) primary restoration requirement.

---

**Segment A — Flat cropland, loam/clay, active agriculture:**
- **Method:** Vibratory plow — ideal conditions (cohesive rock-free soil, open terrain, no nearby utilities at plow path)
- **Depth:** 36 in. minimum per RUS Bulletin 1751F-630 §5 recommendation for active cropland (24 in. ANSI/TIA minimum; agricultural practice warrants 36 in. due to deep-till risk)
- **Restoration:** Topsoil strip-and-replace; compaction relief ripping; seedbed preparation per easement agreement

**Segment B — Fence row with drain tile at 22 in.:**
- **Method:** Chain trencher — vibratory plow cannot operate safely within 18 in. of the buried drain tile. Trench allows visual location of the tile and controlled 12-in. separation placement.
- **Depth:** 24 in. minimum (general ground); 12-in. horizontal separation from the drain tile maintained by open-trench placement
- **Restoration:** Backfill with selected material; re-seed fence-row vegetation per landowner requirements

**Segment C — County gravel road crossing:**
- **Method:** Open-cut trench (county permits open-cut with pavement restoration) OR bore (if county requires bore — confirm with road authority). For this scenario, assume open-cut is permitted.
- **Depth:** 36 in. minimum under road surface; conduit (not bare cable) required under road crossing; concrete encasement per county permit
- **Restoration:** Compact backfill to 95% Proctor; restore gravel surface to pre-construction condition; county inspector sign-off

**Segment D — Pasture, 8–14 in. to fractured shale:**
- **Method:** Rock saw — vibratory plow and chain trencher both insufficient for fractured shale at 8–14 in. depth. Rock saw cuts narrow slot to 24-in. depth through the shale.
- **Depth:** 24 in. to rock; concrete cap over cable where full 24-in. depth in soil cannot be maintained above the shale; AHJ coordination for reduced-depth installation
- **Restoration:** Backfill rock-saw slot with crushed stone; revegetate disturbed surface with grass seed; landowner review of rock disposal if spoil volume is significant

**Segment E — State highway ROW roadside ditch:**
- **Method:** Chain trencher (state DOT typically requires open-trench in ditch area with erosion control; vibratory plow in ditch may destabilize drainage slope)
- **Depth:** 24 in. below ditch bottom surface (not road surface — cable is in the ditch, not under the road)
- **Restoration:** Seed disturbed ditch side-slopes with DOT-specified erosion-resistant grass mix; install temporary silt fence during construction; DOT inspector sign-off

[ANSI/TIA-758-C §6.3, §6.4; RUS Bulletin 1751F-630 §5; BICSI OSP-DRD Manual, Ch. 6.2]

---

## Multiple-Choice Quiz

---

**Q1.** A vibratory plow crew is installing direct-bury OSP cable in flat cropland. The NRCS Web Soil Survey for this parcel shows the soil as a silty clay loam, drainage class "somewhat poorly drained," depth to any restrictive layer > 72 in. An 811 pre-notification was completed and utilities in the adjacent fence row were field-marked. Is vibratory plow the appropriate installation method for this segment?

- A) No — silty clay loam is too soft for vibratory plow and requires a chain trencher
- B) Yes — silty clay loam with no shallow rock or nearby utilities is ideal vibratory plow territory **[CORRECT]**
- C) No — "somewhat poorly drained" soils indicate high water table that prevents vibratory plow operation
- D) Yes — but only if the plow installs at 48 in. depth due to the poor drainage rating

*Rationale:*
- **A — Incorrect.** Silty clay loam is a cohesive soil that is highly compatible with vibratory plow installation. The plow blade cuts and closes the clay-rich slot well, and cohesive soil holds its form around the cable after the blade passes. Sandy or gravelly non-cohesive soils are more problematic for plow installation because the slot may not hold. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5]
- **B — Correct.** The conditions described are ideal for vibratory plow: cohesive silty clay loam soil with no shallow rock, depth to restrictive layer > 72 in. (well below the plow operating range), and no utilities in the plow path (fence-row utilities have been field-marked and are at offset, not in the cropland plow path). Vibratory plow is the fastest and least expensive method for this segment. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5]
- **C — Incorrect.** "Somewhat poorly drained" describes surface drainage class (tendency toward wet surface conditions seasonally) but does not indicate that the soil is perpetually saturated at plow depth or that plow operation is infeasible. Vibratory plow is used routinely in poorly and somewhat poorly drained soils; the concern would be operating a heavy machine during wet periods when the soil is saturated and the machine may rut the field. That is a construction scheduling decision, not a method selection issue. [NRCS Web Soil Survey; BICSI OSP-DRD Manual, Ch. 6.2]
- **D — Incorrect.** The drainage class does not increase the minimum burial depth requirement. The depth is driven by frost depth, tillage practice, and ANSI/TIA-758-C §6.3 minimums — not by drainage class. The recommended depth in active cropland is 36 in. (not 48 in.) per RUS Bulletin 1751F-630 §5. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §5]

---

**Q2.** An OSP direct-bury route crosses a paved county road by open-cut trench. The county permit conditions state: "Backfill shall be placed in 6-inch lifts and compacted to 95% of maximum dry density per ASTM D698 (standard Proctor) at each lift. Surface restoration shall restore the road to its pre-construction condition or better, as determined by the County Road Superintendent." Three months after construction, a 2-inch surface depression has appeared over the trench. Who is responsible, and what is the remedy?

- A) The county road department — road settlement is a normal maintenance issue unrelated to construction
- B) The OSP contractor — inadequate backfill compaction is the most likely cause; the contractor must return to restore the surface to the permit condition **[CORRECT]**
- C) The cable manufacturer — settlement is caused by cable shrinkage under ground temperature change
- D) The property owner — the road crosses their parcel, and road maintenance is an owner responsibility

*Rationale:*
- **A — Incorrect.** A surface depression appearing specifically over a construction trench within months of construction is not a routine road maintenance issue — it is a trench settlement event attributable to the construction. Road maintenance responsibility does not include trenches opened by permitted utility work; the contractor's restoration bond covers post-construction settlement for a specified period (typically 1–2 years after construction). [FHWA utility accommodation policy; RUS Bulletin 1751F-630 §5]
- **B — Correct.** A trench settlement depression is the direct consequence of inadequate backfill compaction — the most common post-construction defect for road crossings. If the backfill was not compacted to 95% Proctor in lifts, the loose material consolidates under traffic load, creating a surface depression. The county permit condition requires 95% Proctor; the surface depression is prima facie evidence of non-compliance. The contractor is responsible for returning to restore the surface to the permit-specified condition. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]
- **C — Incorrect.** OSP fiber optic cable has negligible dimensional change with temperature — fiber and cable sheath thermal expansion is a fraction of a millimeter per degree over typical temperature ranges. Cable behavior cannot cause 2 inches of road surface depression. [ANSI/TIA-758-C §6.4]
- **D — Incorrect.** The road is a public county road; the property owner has no maintenance obligation for the road surface. The contractor who performed the open-cut crossing under permit is responsible for the road restoration per the permit conditions. [FHWA utility accommodation policy]

---

## Final Check

Answer before proceeding to Lesson 3.7.

**Pulse 1.** For a 1.6-mile direct-bury route through active farmland (corn/soybean rotation), identify: (a) the recommended burial depth, (b) the installation method, (c) the two most critical restoration requirements that must be addressed in the easement agreement before construction begins.

*Expected answer:* (a) 36 in. minimum — RUS Bulletin 1751F-630 §5 recommends 36 in. in active cropland to account for subsoil equipment and deep-till operations, even though the ANSI/TIA-758-C §6.3 minimum is 24 in. (b) Vibratory plow — flat cropland with cohesive soil and no subsurface utilities in the plow path is ideal plow territory; fastest and lowest cost. (c) Topsoil strip-and-replace (maintaining topsoil separately from subsoil to preserve soil productivity) and compaction relief (subsoil ripping after backfill to return root-zone compaction to acceptable levels). Both must be negotiated and documented in the easement agreement before construction; discovering the requirement after installation creates contractor liability. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §5]

**Pulse 2.** Explain the cable plowability constraint and identify two properties that must be verified for a cable specification before it can be installed by vibratory plow.

*Expected answer:* Cable plowability is the requirement that a direct-bury cable withstand the mechanical stresses of plow installation without damage. Two properties to verify: (1) **Minimum bend radius during installation** — the cable must not be bent tighter than its installation bend radius as it passes around the plow blade; the plow manufacturer specifies the blade radius, and the cable manufacturer specifies the minimum installation bend radius. If the cable's installation bend radius exceeds the plow blade radius, the cable cannot be plow-installed. (2) **Maximum installation tensile load** — the plow machine exerts a pulling force on the cable as it draws it through the soil; this force must not exceed the cable's rated installation tensile strength. Not all direct-bury cables are rated for plow installation; verify the manufacturer's installation data sheet. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

---

## Glossary Cross-References

- **Vibratory plow / chain trencher / rock saw** → Lesson 3.5 (underground route design — these methods also apply to conduit installation in non-bore segments); Lesson 3.8 (crossings — road and railroad crossings use bore rather than these open-ground methods)
- **Burial depth (direct-bury)** → Lesson 3.5 (underground route design — same depth rules apply to conduit); Lesson 3.8 (crossings — crossing burial depths exceed general-ground minimums)
- **Agricultural land restoration** → Lesson 3.11 (route permitting — ROW easement terms must match restoration requirements agreed with landowner); Lesson 3.12 (as-built documentation — restoration completion is part of the close-out record)
- **Pavement restoration** → Lesson 3.8 (crossings — road crossing restoration is a permit condition); Lesson 3.11 (route permitting — road agency permits specify restoration standards)
- **Marker tape** → Lesson 3.5 (underground route design — same requirement for conduit); Lesson 3.12 (as-built documentation — marker tape placement documented in as-built records)
