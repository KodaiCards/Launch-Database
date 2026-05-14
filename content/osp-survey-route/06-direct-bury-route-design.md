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

## In Plain English

Direct-bury means burying a fiber cable straight into the ground without a protective pipe. It's cheaper and faster than putting conduit in first, which makes it the standard method for rural fiber routes where you don't expect to dig the ground up again for decades. This lesson explains the three main digging machines — a vibratory plow (fastest, needs soft soil), a chain trencher (slower but handles harder ground), and a rock saw (slow and expensive, for solid rock) — and how to choose the right one for each segment of a route. You'll also learn how deep the cable must be buried to survive farm equipment, truck traffic, and frost, and what restoration work is required after installation to leave farmland, roads, and roadsides in the condition you found them.

---

## Acronym Quick-Reference

| Acronym | Stands For | What It Means in Plain English |
|---|---|---|
| **OSP** | Outside Plant | Fiber infrastructure that lives outdoors — poles, buried cables, vaults |
| **RUS** | Rural Utilities Service | USDA program funding rural telecom; 1751F-630 is the construction standards bulletin |
| **ANSI/TIA** | American National Standards Institute / Telecommunications Industry Association | Standards organization; TIA-758-C covers outside plant fiber construction |
| **ROW** | Right of Way | The strip of land you have legal permission to install on — road shoulders, utility corridors, landowner easements |
| **DOT** | Department of Transportation | State or county road authority that issues permits for road crossings |
| **FHWA** | Federal Highway Administration | Federal agency whose utility accommodation policy governs crossings on federal-aid highways |
| **NRCS** | Natural Resources Conservation Service | USDA agency; runs the Web Soil Survey tool showing soil types, depth to bedrock, and drainage class for any parcel |
| **BICSI** | Building Industry Consulting Service International | Professional organization for telecom design; publishes the OSP-DRD design reference manual |
| **AHJ** | Authority Having Jurisdiction | Whoever has legal sign-off power on a specific installation — could be the county engineer, state DOT, or a railroad company |
| **811** | Call Before You Dig | The national utility-locate service — call or visit 811.com before any digging to get existing buried utilities marked |

---

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

**Conduit is a pipe you bury first, then pull cable through later. Direct-bury skips the pipe and buries the cable itself.**

Direct-bury costs less per foot and installs faster — you're only digging once for one thing instead of once for conduit and then again to pull cable. The catch is that if the cable ever fails or you need to add capacity, you have to dig up the ground all over again.

For rural distribution routes serving a fixed number of homes or businesses with no expected growth, that tradeoff is fine — the cable should last 30+ years, so you're unlikely to need to replace it. For backbone routes expected to carry more and more traffic over time, conduit is the smarter long-term investment even at higher initial cost.

RUS Bulletin 1751F-630 §5 treats direct-bury as the standard method for rural OSP plant on RUS-funded projects, with conduit specified only where future access or capacity requirements justify the higher cost. [RUS Bulletin 1751F-630 §5; BICSI OSP-DRD Manual, Ch. 6.2]

---

### Minimum Burial Depths: How Deep Must the Cable Go?

**The cable must be deep enough that normal activity above it — plowing, traffic, frost — can't damage it.**

ANSI/TIA-758-C §6.3 establishes these minimums for direct-bury cable (same depths as conduit, because the protection goal is the same regardless of whether a pipe is present):

| Installation context | Minimum depth |
|---|---|
| General rural ground (not under road) | 24 in. (610 mm) — that's 2 feet |
| Under improved roads (paved or gravel, active vehicle use) | 36 in. (914 mm) — that's 3 feet |
| Under railroads | Don't direct-bury under railroad ROW — bore with conduit |
| Agricultural land with deep tillage operations | 36 in. minimum; confirm with landowner |

**Why the agricultural land caveat matters:**

Standard farm equipment — the tractor pulling a moldboard plow — works at 8–14 inches deep. That's well above the 24-inch minimum, so you're safe. But deep tillage equipment — subsoilers, drainage tile plows, ripping shanks — routinely reach 18–30 inches deep. If a farmer plans to run a drainage tile plow at 26 inches and your cable is at 24 inches, you have a problem.

Always ask the landowner during easement negotiation: "Do you ever use subsoiling or drainage tile equipment on this parcel, and if so, how deep does it go?" Document the answer and the agreed minimum burial depth in the easement agreement itself. RUS Bulletin 1751F-630 §5 recommends 36 inches in active cropland for exactly this reason. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §5]

---

### The Three Installation Machines: Plow, Trencher, and Rock Saw

The right machine depends on what's in the ground. Here's how to think about each one:

---

**Machine 1 — Vibratory Plow: The Fast Lane**

**Think of a vibratory plow like a fish fin moving through water.** The blade vibrates rapidly as it moves forward, cutting a narrow slot in the soil, feeding the cable through a chute right behind the blade. As the machine passes, the slot closes itself around the cable. The surface barely looks disturbed afterward — you might not even be able to see the line after a day or two.

This is the fastest and cheapest method on a per-foot basis. A plow moves at 2–5 mph in good conditions, and a crew can install several miles of cable in a single day.

**Works well when:**
- Soil is cohesive and rock-free (clay, loam, sandy loam without rock)
- No existing utilities are within 18 inches of the cable line (the blade can't stop and restart precisely in tight spaces)
- Terrain is relatively flat — steep grades above 15–20% make the blade drift from the target depth
- Burial depth is 24–36 inches

**Does NOT work when:**
- Rock is at or above the burial depth — the blade hits rock and stalls
- Existing utilities are in the path — you need to see what you're doing, which requires an open trench

**The plowability rule — this is cable selection, not just machine selection:**

When a cable is pulled through the soil behind a plow blade, two things happen to it: (1) the plow machine pulls it forward, putting tension on it, and (2) it bends around the curved blade as it enters the slot. Both of these can damage a cable if the cable isn't designed for it.

Before specifying a cable for a plow-installed route, confirm two things with the cable manufacturer:
- **Minimum installation bend radius:** the cable must be able to bend around the plow blade's curve without damage. The blade has a specific radius; the cable spec sheet lists a maximum bend allowed during installation. They must be compatible.
- **Maximum installation tensile load:** the plow machine exerts a pulling force on the cable that increases with soil friction. The cable's spec sheet lists the maximum pull force it can handle. If the soil is very sticky or the run is very long, that force limit can be exceeded.

Not all direct-bury cables are plow-rated. Verify the cable's installation data sheet before designing for plow. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

---

**Machine 2 — Chain Trencher: The Workhorse**

**A chain trencher works like a giant chainsaw held sideways, digging downward.** A rotating chain with cutting teeth continuously excavates soil (and some types of soft rock) to a controlled depth, depositing the spoil — called a windrow — in a pile beside the trench. The cable is placed in the open trench and the soil is shoveled back in.

The trench is open while you're working, which means you can see what's around the cable. That's the key advantage over a vibratory plow: you can confirm how close existing utilities are, and place your cable at a specific measured separation from them.

**Works well when:**
- Soil has moderate rock content (soft rock, fractured ledge) that would stop a plow
- Existing utilities are nearby and you need to verify separation visually
- You need precise slack control at splice locations (you can coil cable in the bottom of the trench at exact lengths)

Chain trenching is the standard method for suburban and urban direct-bury routes where soil conditions can't be guaranteed to be plow-friendly. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5]

---

**Machine 3 — Rock Saw: The Last Resort**

**A rock saw is essentially a giant circular saw blade with carbide or diamond teeth.** It cuts a narrow slot through consolidated bedrock — the kind of rock a chain trencher's teeth can't touch. Rock saws are slow (as little as 2 feet per hour in hard granite), expensive, noisy, and produce rock dust that may require air quality permits.

**Use a rock saw only when:**
- Bedrock is at or above the required burial depth
- Rerouting around the rock is more expensive than sawing through it
- The permit or ROW agreement allows rock cutting (some conservation easements and agricultural land agreements prohibit rock saw because of soil disruption and drainage impacts)

Rock saw routes typically bury cable at reduced depth (12–18 inches in hard rock) with a concrete cap or conduit providing surface load protection that depth would otherwise provide. Any reduced-depth installation requires AHJ approval. [BICSI OSP-DRD Manual, Ch. 6.2]

---

### Bedding and Backfill: Protecting the Cable After It's In the Ground

**Bedding is padding for your cable.** If the soil around the cable contains sharp rocks — fractured shale chips, gravel points, angular debris — those sharp edges can slowly cut through the cable's outer jacket over time as the ground moves with frost cycles and moisture changes. Bedding eliminates that risk.

**Sand bedding in rocky terrain:** Where native soil contains sharp rock particles, place a 3-inch layer of clean sand or fine crushed stone below the cable and around its sides before backfilling. Think of it as a soft nest the cable rests in. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.2]

**Backfill — what goes back in the trench:**

- In most routes, the native spoil (the dirt you dug out) goes back in. It's free, it's already there, and it matches the surrounding soil.
- Remove large rock fragments (anything bigger than 4 inches longest dimension) from the backfill before you compact it — a rock that size landing on the cable sheath during compaction can crack it.
- If the native soil is entirely rock, import clean crushed stone or select fill.

**Compaction under roads — this one really matters:**

When you cut across a road, the road agency's permit will specify a compaction requirement for the backfill — almost always 95% or 100% of maximum Proctor density. Here's what that means in plain English:

**Proctor density** is a lab test result. You take a sample of the same soil, compact it as hard as you possibly can in the lab with a standard hammer, and measure the density you achieve. That's the "maximum" (100%). The permit requires you to achieve 95% of that maximum in the field, which means your backfill has to be nearly as dense as physically possible.

Why does this matter? Loose backfill settles under traffic loads. If you fill the trench but don't compact it properly, the road surface sinks into a pothole above the trench — usually within a few months. When that happens, the road agency comes back to you (by name, because you signed the permit) and tells you to fix it at your expense. Compact in lifts (6-inch layers, compacted one at a time) and test each layer if the road agency requires it. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

---

### Marker Tape: Helping Future Diggers Find Your Cable

Any time you bury cable, you must place detectable warning tape 12 inches above the cable as you backfill. The tape must be high-visibility yellow, printed with a warning like "CAUTION — BURIED FIBER OPTIC CABLE."

**Why it matters:** Years from now, another contractor or a farmer will be digging near this route for something else. They'll call 811 and get a locate mark, but locating equipment isn't perfect — especially for non-metallic cable. The bright yellow tape is a physical backup: even if the locate is off by a few inches, the tape gives the digger a "stop and look" signal before the shovel hits the cable. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]

---

### Site Restoration: Leaving It How You Found It

**After any buried construction, you're contractually obligated to restore the surface to its pre-construction condition — or better.** The specifics depend on what kind of land you're on.

---

**Agricultural Land: The Most Demanding Restoration**

Farmers take soil productivity seriously. If you mix the topsoil with the subsoil during installation — even accidentally — you've potentially reduced the farm's crop yield on that strip for years. Easement agreements for agricultural land typically require:

**Topsoil strip-and-replace:** Before the machine starts, strip the topsoil layer (typically 8–12 inches thick — the dark, organic-rich material at the surface) and stockpile it separately from the deeper subsoil. After backfilling, replace the topsoil on top. This is a two-pile system: topsoil pile and subsoil pile, never mixed.

**Compaction relief:** Heavy machinery compacts the soil, which resists crop root penetration. After backfilling, the contractor may be required to run a subsoiler (a deep-ripping implement) along the disturbed strip to break up that compaction. Some easements specify a maximum compaction level tested by a cone penetrometer — a probe that measures how hard the soil is.

**Seedbed preparation and revegetation:** The final topsoil is disked and harrowed (tilled lightly) to prepare a seedbed. The contractor may be required to seed the disturbed strip with a cover crop approved by the landowner.

**Settlement follow-up:** Plow installation in clay soils can produce a frost-heave trench in the first winter — a depression that appears as the ground freezes and thaws. Most easements require the contractor to return in spring to backfill any settlement depressions that appeared. This is a callback obligation; build it into the contract. [RUS Bulletin 1751F-630 §5]

---

**Pavement Cuts (Open-Trench Road Crossings):**

When you cut across a paved or gravel road, you're cutting into public infrastructure that vehicles depend on. Road agencies take restoration very seriously, and their permit conditions are legally binding.

Standard requirements:
- **Saw-cut the edges:** Don't use an excavator to break the pavement — that leaves ragged edges that crack further. Use a concrete saw to cut straight, vertical edges.
- **Install conduit under the road:** Don't direct-bury bare cable under a road crossing. Use conduit (with required depth and concrete encasement per the permit). The conduit protects the cable from the higher stress under road loading, and allows future cable replacement without re-cutting the road.
- **Compact in lifts to 95–100% Proctor:** See the compaction discussion above. This is where it matters most.
- **Restore pavement to pre-construction condition or better:** The road agency inspector makes this determination. Most state DOTs require a pavement overlay of the entire lane width across the cut on primary roads. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

---

**Revegetation of Disturbed Areas:**

For routes along roadsides, drainage ditches, and utility corridors, the disturbed ground surface must be seeded and stabilized to prevent erosion — especially on slopes. Loose bare soil on a trench line after a rain event can wash sediment into drainage ditches and waterways, triggering permit violations.

Standard requirements:
- **Grass seed:** Applied at a specified seeding rate per the DOT or landowner spec. Temporary cover crops (fast-germinating species) may be used out of season; permanent grass mix established the following spring.
- **Erosion control blanket:** On slopes steeper than 3:1 (three feet horizontal for every foot of rise), a biodegradable mesh blanket is stapled over the seeded area to hold soil and seed in place until germination.
- **Temporary silt fence:** A fabric barrier installed at the downslope edge of the trench during construction to capture sediment before it reaches drainage channels. Removed after vegetation is established.
- **Bond release:** Most road and landowner agreements tie the contractor's restoration bond release to verified vegetation establishment — meaning you don't get the final payment holdback until the inspector confirms the grass is growing. [State DOT utility accommodation standards]

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

**Proctor density**
A lab-measured compaction benchmark: the maximum dry density achievable for a specific soil sample using a standardized compaction test (ASTM D698). Road crossing permit conditions typically require backfill compacted to 95% of maximum Proctor density to prevent trench settlement under traffic. [RUS Bulletin 1751F-630 §5; FHWA utility accommodation policy]

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
