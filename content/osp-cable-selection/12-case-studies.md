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

## In Plain English

Everything you've learned in this topic — how cables are built, what armor does, how fiber counts are sized, what the five OSP environments demand — gets brought together in real projects. This lesson walks you through three of the most common scenarios you'll encounter in the field: (1) building a brand-new rural fiber network from scratch funded by a USDA government loan, (2) running cable from an existing rural network into a new housing subdivision where the route starts on a utility pole and ends inside a building, and (3) replacing failing aerial cable in a hurricane zone with storm-hardened cable. For each case, every decision is explained step by step. If you've ever wondered "how does someone actually figure out what cable to buy?", this is the lesson that shows you.

---

## Quick Acronym Reference

| Acronym | Full name | What it means in plain English |
|---|---|---|
| **RUS** | Rural Utilities Service | USDA agency that provides low-interest loans to build rural broadband, electric, and water infrastructure |
| **USDA** | U.S. Department of Agriculture | Federal agency that runs the RUS loan program (among many others) |
| **FTTH** | Fiber to the Home | A network architecture where a dedicated fiber strand runs all the way from the provider's hub to your house |
| **PON** | Passive Optical Network | An FTTH architecture that uses passive glass splitters (no electronics) to split one fiber signal to many homes |
| **FDH** | Fiber Distribution Hub | The central junction point where the feeder cable ends and multiple distribution cables begin |
| **FDT** | Fiber Distribution Terminal | A pedestal or closure where the distribution cable ends and individual drop cables branch off to homes |
| **ADSS** | All-Dielectric Self-Supporting | An aerial cable with no metal — holds itself up using internal fiber or aramid strength members |
| **SCADA** | Supervisory Control and Data Acquisition | A computer system used by electric co-ops to remotely monitor and control their electrical grid |
| **CST** | Corrugated Steel Tape | Corrugated metal armor layer that wraps around the cable core to protect against crushing and rodents |
| **EDS** | Every Day Stress | The normal everyday tension on a hanging cable; must stay below 20–25% of the cable's rated breaking strength |
| **RTS** | Rated Tensile Strength | The maximum pull force the cable can withstand before failing |
| **NESC** | National Electrical Safety Code | National standard governing construction on utility poles including clearances and bonding |
| **NEC** | National Electrical Code | National standard governing electrical wiring inside buildings — including fiber cable fire ratings |
| **BET** | Building Entry Terminal | A sealed junction box at the building wall where outdoor cable hands off to indoor-rated cable |
| **OFNR** | Optical Fiber Non-conductive Riser | Indoor fiber cable rated for vertical runs between floors; passes riser flame test |
| **OFNP** | Optical Fiber Non-conductive Plenum | Strictest indoor fiber cable rating; required in ceiling air-return spaces; passes plenum flame/smoke test |
| **HOA NOC** | Homeowners Association Network Operations Center | A utility room owned by an HOA that houses the active electronics for a subdivision fiber network |
| **OTDR** | Optical Time-Domain Reflectometer | A test instrument that shoots a laser pulse down a fiber and reads reflections to find faults and measure loss |
| **OLTS** | Optical Loss Test Set | A two-piece instrument (light source + power meter) that measures total insertion loss through a fiber link |
| **OS2** | Single-mode fiber type per IEC 61793-2 | The standard single-mode fiber used in all OSP applications; carries signals over long distances |
| **OS2 cladding diameter** | 125 µm (micrometers) | All OS2 fiber has the same 125-millionth-of-a-meter outer diameter — this is why any OS2 fiber can be fusion-spliced to any other OS2 fiber |
| **AWG** | American Wire Gauge | Wire sizing standard; lower AWG = thicker wire (6 AWG is a thick bonding conductor) |

---

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

#### What This Is

A rural electric cooperative (think: a member-owned electric utility serving farms and small towns) won a USDA RUS loan to build fiber internet to 1,240 households spread across a large rural territory. The cooperative had copper phone lines serving these customers before — this is a complete rebuild in fiber. The challenge: the territory is huge, the pole lines carry live electricity, and the route crosses agricultural fields with documented rodent pressure. Every cable decision has to work for 25+ years and comply with federal RUS loan requirements.

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

**The question:** How many fibers do you need in the feeder cable running from the hub to each FDH?

There are 1,240 homes total divided across 6 FDH locations — about 207 homes per FDH on average. Each FDT pedestal has a 32:1 passive splitter, meaning one fiber in the feeder serves 32 homes through the splitter chain.

**Step 1 — Figure out how many active fibers you actually need:**

207 homes ÷ 32 (splitter ratio) = 6.47

Round up: you need **7 active feeder fibers** per FDH route to serve all the homes.

(Rounding up is mandatory — you can't have 6.47 fibers, and you can't leave homes unserved.)

**Step 2 — Apply the BICSI design multiple:**

BICSI OSP-DRD says feeder cable should have 4× the active fiber count. Why? Because a feeder cable buried 40 miles under agricultural fields cannot be easily dug up and replaced as demand grows. You need spare capacity baked in from day one.

7 active fibers × 4 = **28 fibers minimum** per feeder route [BICSI OSP-DRD Manual, Ch. 5.5].

**Step 3 — Add SCADA reserve:**

The electric cooperative uses 4 fibers on each feeder route for SCADA — the remote monitoring and control system for their electrical grid. If you don't plan for this now, you'll pay for a second cable pull later.

28 + 4 SCADA = **32 fibers minimum** per route.

**Step 4 — Pick the closest standard cable size:**

Loose-tube OSP cable comes in standard configurations: 12, 24, 36, 48, 72, 96, 144, and higher fiber counts. A 32-fiber cable is not a standard stock item. The next standard size up is **48 fibers** (4-tube × 12 fibers per tube). Choosing 48 instead of the theoretical 32-fiber minimum gives you 16 extra dark fibers in reserve for the 25+ year service life of the network. On a government-funded build with a 25-year depreciation schedule, that headroom is worth having [BICSI OSP-DRD Manual, Ch. 5.5; Corning OSP Reference, Ch. 6.1].

**Selected feeder specification:** 48-fiber loose-tube OS2, gel-fill, CST armor (direct-bury segments), ADSS span-rated for applicable NESC loading district (aerial segments on co-op lines), PE sheath [ANSI/TIA-758-C §5.3, §5.6, §5.6.3].

---

#### Decision Point 2 — Aerial Feeder Segment

**The question:** What kind of cable goes on the 14 miles of aerial route along energized electric co-op pole lines?

The pole lines carry 7.2 kV and 12.5 kV distribution voltage. Any metallic element in the cable — a steel messenger, CST armor — would run as a parallel conductor alongside live electricity for 14 miles. That requires bonding hardware at every single pole attachment point and creates shock hazards for splice crews over the cable's entire service life.

**Answer: ADSS.** All-Dielectric Self-Supporting cable has zero metal. Its strength members are aramid fiber or fiberglass. It hangs between poles by its own internal strength without needing a separate steel messenger wire. No metal means no bonding requirements and no shock hazard [IEEE 1222; NESC C2-2023, Rule 235G].

**Span engineering:** The co-op's pole spacing averages 225 feet (68.6 m). The 48-fiber ADSS cable must be rated by the manufacturer for 225-foot spans in the NESC medium loading district — central Iowa gets 0.25 inches of radial ice and 4 pounds per square foot of wind in the design loading scenario. The manufacturer's sag-tension tables provide the target sag at the stringing temperature and confirm that EDS at 15°C stays at or below 25% of RTS [IEEE 1222 §5.2].

**Ground clearance check:** At maximum ice load, the cable will sag more than at stringing temperature. The saggy cable at the middle of each span must still clear 18 feet (5.5 m) above any public road crossing. Three county highway crossings need individual sag calculations to verify this clearance [NESC C2-2023, Rule 232].

**No bonding required:** ADSS is fully dielectric — no armor grounding at pole attachment points [ANSI/TIA-758-C §5.6.3; NESC C2-2023, Rule 352].

---

#### Decision Point 3 — Direct-Bury Feeder Segment

**The question:** What kind of cable gets buried in central Iowa agricultural fields?

The threats: clay soil, frost line at 36 inches, documented pocket gopher activity (Iowa DNR survey data). Gophers can chew through cable jacket. Frost heave will push and pull the cable cyclically. CST armor is the answer — the corrugated steel wrap deters rodents and provides crush resistance against soil loads.

**Cable required:** Loose-tube OS2, CST armor (documented gopher activity requires metallic armor deterrent), gel-fill, PE sheath [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2].

**Burial depth:** 42 inches minimum. Here's the logic:
- ANSI/TIA-758-C §6.3 requires 24 inches minimum for general soil burial
- The frost line is 36 inches deep in central Iowa
- 36 inches + 6 inches safety margin = **42 inches** — this clears the frost line so frost heave doesn't cyclically stress the cable

At the three county highway crossings: 36-inch minimum depth per ANSI/TIA-758-C §6.3, with directional bore installation (drill under the road without cutting pavement) [ANSI/TIA-758-C §6.3].

**Bonding and grounding:** The CST armor is metal. At each splice closure and at every aerial-to-underground transition point, the armor must be bonded (connected with a wire) to a ground rod. Minimum bonding conductor: 6 AWG copper. The ground resistance at each rod must be measured and documented. This keeps the armor at ground potential so it can't accumulate charge and shock a splice crew [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].

**Cable order calculation for feeder routes — worked example (Route 1, 7.2 miles direct-bury):**

Here is every step:

- **Step 1 — Convert route miles to meters:** 7.2 miles × 5,280 feet per mile = 38,016 feet ÷ 3.281 feet per meter = **11,586 m** (call it 11,590 m)
- **Step 2 — Splice closure slack:** Assume one splice closure per mile = 7 closures. Each needs 10 m of slack. 7 × 10 m = **70 m**
- **Step 3 — Aerial-to-underground transition loops:** 2 transition points × 15 m riser loop each = **30 m**
- **Step 4 — Subtotal:** 11,590 + 70 + 30 = **11,690 m**
- **Step 5 — Apply 5% contingency:** 11,690 × 0.05 = 584.5 m
- **Step 6 — Total order:** 11,690 + 585 = **12,275 m**
- *Sanity check: 12,275 m is about 40 meters per mile over the route length — a 3% cushion above the bare route, which is reasonable for a rural field route with measurement uncertainty.*

Round up to **12,300 m** for a clean order. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

---

#### Decision Point 4 — Distribution and Drop

**Distribution cable specification:** 24-fiber loose-tube OS2, no armor (conduit in subdivisions; CST armor for direct-bury segments on rural distribution routes), gel-fill, PE sheath [ANSI/TIA-758-C §5.3].

*Fiber count check for a sample FDT cluster of 32 homes:*

32 homes ÷ 32 (splitter) = **1 active distribution fiber**.

BICSI 3× distribution multiple: 1 × 3 = **3 fibers minimum**.

The next standard cable size above 3 fibers is a **12-fiber** cable (1-tube × 12 fibers per tube). Twelve fibers for a 32-home cluster sounds like a lot of spare capacity — and it is, by design. Distribution cable is harder to replace than drop cable. Over-sizing now avoids costly rebuild later [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4].

**Drop cable specification:**
- Aerial drops (most residential): 2-fiber flat all-dielectric drop cable, UV-stabilized PE sheath. These hang from the FDT pole to the customer's house — no metal, no burial, just a lightweight span [ANSI/TIA-758-C §5.7; AFL OSP Cable Design Guide, §2.2]
- Direct-bury drops (rural premises with no pole near the NID): 4-fiber armored drop cable, CST armor, gel-fill, PE sheath, installed by vibratory plow. The vibratory plow slices into the ground and lays the cable without open trenching [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §2.2]

---

#### Common Pitfalls — RUS FTTH Backbone

1. **Undersizing feeder fiber count:** Using only the raw active fiber count without the BICSI 4× multiple produces a feeder that runs out of capacity within 5 years. RUS-funded builds must document that design multiples were applied [BICSI OSP-DRD Manual, Ch. 5.5; USDA RUS Bulletin 1753F-601].
2. **Specifying lashed aerial on energized co-op lines:** A steel messenger on an energized distribution line requires bonding hardware at every pole and creates shock hazard for every crew that works on the plant over its 25-year life. ADSS is the only compliant option [IEEE 1222; NESC C2-2023, Rule 235G].
3. **Omitting SCADA fiber allocation:** Rural electric co-ops almost universally deploy SCADA on their fiber. Failing to reserve SCADA fiber at design time means a separate cable pull and extra splice closures later — a recurring and preventable cost.
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

#### What This Is

A telecom provider already has fiber running on overhead poles in the country. A new housing subdivision was built nearby, and now service needs to be extended into it. The challenge: the existing fiber is up in the air on a live electric utility pole line, but the subdivision's roads were built with conduit already in the ground. The cable has to come off the pole, go underground, and eventually enter a building. Three different environments, three different cable types, and a critical NEC compliance decision at the building entry.

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

The cable lives inside a 4-inch plastic pipe. The pipe handles all mechanical threats — soil load, vehicle load above, any digging. The cable doesn't need to defend itself. Specify: loose-tube OS2, **no armor**, gel-fill, PE sheath. Maximum pulling tension (RTL): 2,700 N; maximum sidewall pressure (RSL): 220 N/m [ANSI/TIA-758-C §5.3, §6.2].

*Conduit fill check — let's do the math:*

- 4-inch Schedule 40 PVC has an inner diameter of 4.026 inches = 102.3 mm
- A 48-fiber loose-tube cable has an approximate outer diameter of 14.5 mm
- Cable cross-section area: π × (14.5 ÷ 2)² = π × 7.25² = π × 52.56 = **165.1 mm²**
- Conduit bore area: π × (102.3 ÷ 2)² = π × 51.15² = π × 2616.3 = **8,221 mm²**
- Fill ratio: 165.1 ÷ 8,221 = **2.0%** — far below the 40% maximum

The conduit has plenty of room for additional cables to be added later. [NEC Chapter 9, Table 1; ANSI/TIA-758-C §6.1]

**Direct-bury segment (1.4 miles through rear easements):**

Now the cable is in native soil — residential backyard easements. No documented gopher pressure, but homeowners dig in their yards. CST armor provides mechanical protection against casual digging. Specify: loose-tube OS2, **CST armor**, gel-fill, PE sheath.

**Burial depth:** 24 inches minimum for the rear easement direct-bury segments. 36 inches with directional bore under the subdivision entrance road (road crossings always get deeper burial) [ANSI/TIA-758-C §6.3].

---

#### Decision Point 2 — Distribution Fiber Count

**The question:** How many fibers go in the distribution cable running from the FDH to 7 FDTs?

There are 280 lots total across 7 FDTs — 40 homes per FDT. Each FDT has a 32:1 splitter.

*Per FDT:*
40 homes ÷ 32 (splitter) = 1.25 → round up to **2 active distribution fibers** per FDT cluster.

*Total fibers needed in the main cable from FDH (serving all 7 FDTs):*
7 FDTs × 2 active fibers = **14 active distribution fibers** in the trunk cable.

*Apply BICSI 3× distribution multiple:*
14 × 3 = **42 fibers minimum** in the main distribution cable.

*Standard cable selection:* The closest standard configuration above 42 fibers is **48 fibers** (4-tube × 12 FPT). Choosing 48 gives 6 dark fiber pairs in reserve [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4].

---

#### Decision Point 3 — Building Entry at HOA NOC

**The question:** The distribution cable needs to run 180 feet inside the HOA NOC building to reach the equipment room. Is that legal?

Short answer: no — not with the outdoor cable.

**NEC Article 770.113 limit:** Outdoor PE-jacketed cable can enter a building and run a maximum of **50 feet** from the point of entry. Beyond 50 feet, the outdoor cable must stop and transition to listed indoor cable. The outdoor cable's PE jacket is not fire-rated; if it burns, it acts like a fuse carrying flames through the building. 180 feet is 130 feet beyond the legal limit.

**Required solution (step by step):**

1. The outdoor 48-fiber CST-armored cable enters the HOA building at grade.
2. At the 50-foot mark from the entry point: install a **Building Entry Terminal (BET)**. This is a sealed weatherproof splice box. The CST armor gets bonded to a ground rod here [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].
3. Inside the BET: fusion-splice the 48 outdoor fibers to 48 fibers of **OFNR-rated indoor optical fiber cable**.
4. The OFNR cable continues from the BET for the remaining 130 feet to the equipment room. If any part of that 130-foot run passes through a ceiling HVAC return-air plenum, the plenum section requires **OFNP** cable instead [NEC Article 770.113].
5. At the equipment room: fibers terminate at a patch panel or splice tray in the distribution frame.

---

#### Common Pitfalls — Subdivision Transition

1. **Installing CST armor in conduit:** Engineers who always spec armored cable for "all OSP work" end up over-specifying in conduit runs. Armor adds 15–25% to cable weight, pushes pulling tension toward the RTL limit, and adds cost for zero benefit. The conduit does armor's job [ANSI/TIA-758-C §5.3].
2. **Forgetting the entrance road crossing depth:** Even a subdivision entrance road is still a road. ANSI/TIA-758-C §6.3 requires 36-inch minimum depth under all roads. Directional bore avoids cutting and repaving [ANSI/TIA-758-C §6.3].
3. **Omitting the BET:** A common field shortcut is running outdoor cable all the way to the equipment room. This is a NEC 770.113 violation. The building won't pass occupancy inspection until the BET and OFNR transition are in place [NEC Article 770.113].
4. **Not verifying FDH location is accessible for future splicing:** The FDH at the pole is an aerial closure on an energized line. Splicing at height near energized conductors requires OSHA-compliant fall protection, appropriate clearances, and utility coordination. Where possible, specify a ground-level FDH pedestal [BICSI OSP-DRD Manual, Ch. 4.1].

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

#### What This Is

A telecom provider has 22 miles of aerial fiber cable running along a coastal North Carolina highway. The existing cable was hung in 1994 on a steel messenger wire. Problem: this stretch of coast is in a NESC extreme-wind zone — hurricane country — and the steel messenger wasn't sized for the current extreme-wind requirements. The messenger has failed multiple times during hurricane seasons, causing outages. The solution: rip out the old cable and steel messenger entirely, and replace it with a newer, stronger, metal-free ADSS cable that can handle hurricane-force winds without a messenger at all. While they're at it, they're also upgrading from 36 fibers to 144 fibers for future network capacity.

#### Scenario

A regional telecom provider's aerial feeder plant in coastal North Carolina suffered repeated outages during Atlantic hurricane seasons. The existing plant consists of 22 miles of lashed aerial cable — a 36-fiber OS2 loose-tube cable lashed to a 3/8-inch galvanized steel messenger — installed in 1994 on a mix of wooden utility poles and concrete poles. The route runs along a coastal highway right-of-way designated as a NESC extreme-wind loading zone (130 mph design wind speed). The messenger strand is undersized for the extreme-wind designation (it was installed before the extreme-wind designation was applied to this zone) and has experienced multiple strand failures.

**Retrofit objective:** Replace the existing lashed aerial cable plant with an all-dielectric, storm-hardened aerial design that meets the current NESC extreme-wind loading zone requirements. New fiber count: 144-fiber (upgrade from 36-fiber to support future network densification).

---

#### Decision Point 1 — New Cable Type

**What do you replace it with?**

The pole line carries no energized electrical circuits — it's a dedicated fiber/telecom pole line. So ADSS isn't required for electrical safety reasons. But it's still the right choice for a completely different reason: **eliminating the messenger is the whole point**. The messenger is what failed in the hurricanes. ADSS has no messenger.

**Two options:**

- Option A: Keep the poles, replace the undersized messenger with a properly rated one, and re-lash new 144-fiber cable. Lower upfront cost.
- Option B: Remove the messenger entirely, install 144-fiber ADSS cable. Higher upfront cost, better long-term result.

**Why Option B (ADSS) wins:**

1. **No messenger = no single point of failure.** The messenger failing is what caused every outage. ADSS eliminates it entirely.
2. **Smaller wind profile.** A lashed cable assembly (cable + messenger + lashing wire) has more surface area facing the wind than a single ADSS cable. Less wind surface = less force during a hurricane = less tension on the pole attachment hardware.
3. **No bonding at every pole.** The existing steel messenger required a bonding conductor at every single pole attachment. ADSS is all-dielectric — zero bonding hardware for the entire 22-mile route.
4. **Simpler installation.** Stringing ADSS is one task. Stringing messenger + lashing cable is two separate tasks. Roughly 20–30% labor savings on aerial-only routes.

**ADSS specification for NESC extreme-wind zone:**

The NESC extreme-wind zone doesn't use the same ice+wind formula as light/medium/heavy loading districts. Instead, it uses a wind speed from the ASCE 7 wind map (a 3-second peak gust speed — for this zone, 130 mph). The ADSS cable must be rated by the manufacturer for:
- 250-foot average span length (measured from pole survey)
- NESC extreme-wind zone loading parameters
- EDS ≤ 20–25% RTS at the everyday stringing temperature for coastal North Carolina (~20°C) [IEEE 1222 §5.2; NESC C2-2023, Rules 250–251]

**Clearance check:** At maximum hurricane wind load (extreme-wind zone uses wind alone, not ice), the cable sag at mid-span must still leave 18 feet of clearance above the coastal highway. The manufacturer's sag-tension table at the design wind load provides the sag value to check against [NESC C2-2023, Rule 232].

---

#### Decision Point 2 — Fiber Count Upgrade: Splice Compatibility

**The question:** Can you splice the new 144-fiber ADSS into the existing 36-fiber OS2 cable at the ends of the 22-mile replacement segment?

Yes — and here's why.

All OS2 fiber has the same cladding diameter: **125 µm** (125 millionths of a meter). That's the standardized outer dimension of every OS2 fiber regardless of how many fibers are in the cable bundle. A fusion splicer doesn't care whether the cable it came from had 36 fibers or 144 fibers; it only cares about the 125 µm cladding. The splice is optically compatible.

**At each end of the replacement route:**
- 36 of the 144 new fibers are fusion-spliced to the 36 fibers of the existing OS2 cable (maintaining all existing active circuits)
- The remaining 108 fibers (144 − 36 = 108) are coiled and stored in the splice tray as **dark reserve** — available for future circuits without any new cable installation

**Transition closure at each end:** A standard splice closure won't work because it has only one cable entry port diameter. A **transition closure** — a splice enclosure with two different-diameter entry ports — is needed. Both the new cable and the existing cable enter the same closure. Each cable needs a 10-meter slack loop inside for future re-splicing [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4].

---

#### Decision Point 3 — Compliance and Documentation for the Retrofit

**Removing the old metallic messenger:**

When the old galvanized steel messenger comes down, the bonding conductors connecting it to the pole ground electrodes must also be removed. The ADSS replacement cable requires no new bonding conductors — it has nothing to bond.

**OTDR acceptance testing — the most important closeout step:**

Once the ADSS cable is strung and the 36 splice connections at each end are made, every single one of the 144 fibers must be tested with an OTDR before the splice closures are sealed. The acceptance standard:
- Wavelengths: **1310 nm AND 1550 nm** (both required — see Q4 rationale)
- Directions: **from both ends** (required — one-end testing leaves dead zones)
- Coverage: **all 144 fibers** (not a sample — every fiber)
- Splice loss standard: each of the 36 transition splices must show ≤ 0.1 dB [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7]

The 36 splices at each transition closure are the highest-consequence connections on the entire retrofit — they carry all the existing active customer circuits. A splice that tests at 0.3 dB loss instead of 0.1 dB might work today but will erode the power budget margin over time. Find and fix bad splices before sealing the closure.

**As-built documentation package — four required items:**

1. **Route drawing** — updated to show new ADSS cable, span lengths, pole IDs, sag values at each span, and FDH/splice closure locations [ANSI/TIA-758-C §7]
2. **Sag measurement records** — for each span: the measured actual sag at the stringing temperature compared to the manufacturer's target sag. Crews that use only a tension gauge without measuring sag can end up with cables too tight (not enough sag → clearance violation under load) or too loose (too much sag → violation of minimum clearance from ground). Verify each span with a transit or optical sag meter before final attachment.
3. **OTDR traces and OLTS insertion loss records** — for all 144 fibers [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7]
4. **Fiber assignment table** — 36 fibers listed as "existing circuit assignments" with circuit IDs; 108 fibers listed as "dark reserve — available" [BICSI OSP-DRD Manual, Ch. 8]

---

#### Common Pitfalls — Storm-Hardening Retrofit

1. **Retaining the messenger "to save cost":** Some engineers propose keeping the existing undersized messenger and replacing only the fiber cable. This leaves the failure mode in place and wastes the storm-hardening investment. ADSS is the correct solution when the messenger is the failure mode.
2. **Specifying ADSS for the wrong span:** ADSS cables are span-specific. A cable rated for 200-foot spans cannot be safely deployed on 300-foot spans — it would exceed EDS. Measure every span before ordering cable. Spans that won't achieve NESC clearance within the EDS limit require an additional pole.
3. **Neglecting sag verification after stringing:** Pulling cable with only a tension gauge and no sag measurement is a common shortcut. Over-tensioned cable (too tight) doesn't have enough sag to maintain clearance under ice or wind load. Under-tensioned cable (too loose) sags too close to the ground. Both are NESC violations. Measure sag at each span before making final attachments.
4. **Omitting splice loss testing at transition closures:** The 36 fusion splices at each route terminus carry all existing active circuits. A bad splice discovered after the closure is sealed requires opening it again at height in a bucket truck — significantly more expensive than catching it before sealing. Test every splice before closing.

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
An OSP fiber build into a territory with no existing fiber infrastructure — everything is new. Think of it like building a house on an empty lot versus renovating an existing one. All cables, conduit, poles, and passive hardware are brand new. RUS FTTH builds are typically greenfield because they serve rural areas that never had fiber before. Contrasted with brownfield deployment (overlay of new fiber on existing infrastructure). [USDA RUS Bulletin 1753F-601; BICSI OSP-DRD Manual, Ch. 4.1]

**SCADA fiber allocation**
A reserved fiber count within an OSP cable designated for supervisory control and data acquisition (SCADA) systems — the remote monitoring and control network for electric grids, water systems, or pipeline monitoring. On rural electric cooperative networks, SCADA fiber is typically 4–8 fibers per feeder route, allocated at design time so you don't have to add a separate cable pull later. [BICSI OSP-DRD Manual, Ch. 5.5]

**Transition closure**
A splice closure with two cable entry ports of different sizes, used where a replacement cable (larger fiber count, larger diameter) connects to an existing cable (smaller fiber count, smaller diameter). Without a transition closure, neither a standard single-size closure nor an in-line straight splice fits both cables. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

**NESC extreme-wind zone**
A coastal geographic designation in NESC C2-2023 where the design loading is governed by extreme wind speed (from the ASCE 7 wind speed map — a 3-second peak gust) rather than the ice-plus-wind formula used for light/medium/heavy loading districts. Applies to Gulf Coast, Atlantic Coast, and Pacific Coast areas exposed to hurricane and major storm-force winds. [NESC C2-2023, Rules 250–251]

**EDS (Every Day Stress)**
The stringing tension applied to an aerial cable at average everyday temperature, expressed as a percentage of rated tensile strength (RTS). Think of it like the tension on a rubber band you keep stretched every day — keep it at 20–25%, and it lasts for decades; keep it at 80%, and it fatigues and breaks. IEEE 1222 recommends EDS ≤ 20–25% RTS for ADSS cables to limit fatigue damage and maintain adequate sag margin under design loading. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Directional bore**
A trenchless horizontal drilling technique used to install conduit or cable under roadways, railways, and waterways without cutting the surface. A drill bit is steered underground along a curved path, then pulled back through with the conduit attached. Required at road crossings to avoid pavement cuts; provides depth of 36 inches or greater under roads per ANSI/TIA-758-C §6.3. [ANSI/TIA-758-C §6.3; BICSI OSP-DRD Manual, Ch. 6.2]

**Splice loss budget**
The maximum allowable insertion loss per fusion splice, set to ensure that adding up all the splice losses across a route doesn't eat through the total optical power budget. Think of it like a budget: the laser's power is your income, and every splice spends a little of it. Keep each splice under 0.1 dB and you won't run out of power budget. Typical target for OSP fusion splices: ≤ 0.1 dB per splice, OTDR-verified at project closeout. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2]

**Dark fiber reserve**
Installed fibers within a cable that aren't connected to any active circuits yet — available for future expansion, circuit protection, or future resale. BICSI design multiples (4× feeder, 3× distribution, 2× drop) define how much dark fiber reserve to build in. Dark fiber reserve must be documented in the fiber assignment table. Think of it like parking extra capacity in the ground today so you don't have to trench the same street again in 10 years. [BICSI OSP-DRD Manual, Ch. 5.5, Ch. 8]

**HOA NOC (homeowners association network operations center)**
A common model in subdivision fiber deployments where the HOA owns the passive fiber infrastructure and houses the active electronics (OLT, router, managed switch) in a shared utility room. Building entry and NEC 770.113 compliance apply identically to HOA NOCs as to any commercial facility. [NEC Article 770.113]

**Sag verification**
Post-stringing measurement of actual cable sag at mid-span using an optical sag meter, transit, or laser range finder, compared to the manufacturer's target sag at the measured stringing temperature. Required for acceptance documentation on ADSS aerial installations. You measure sag — not just tension — because the same tension can produce different sag values at different temperatures. [IEEE 1222 §5.2; ANSI/TIA-758-C §7]

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
- **B — Correct.** The technical objection is optical loss. A 22-mile (35.4 km) route accumulates substantial span attenuation. Every fraction of a dB of additional splice loss reduces the optical power budget margin. Fusion splices on OS2 fiber routinely achieve **≤ 0.1 dB** per splice when executed by skilled technicians with a properly calibrated splicer. Mechanical splices (index-matching gel type) typically achieve **0.2–0.5 dB** per splice — two to five times higher. With 36 transition splices at each terminus, the difference between fusion (max 3.6 dB total) and mechanical (max 18 dB total) splice loss accumulation could be the difference between a link within its power budget and one that fails to operate. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.3]
- **C — Incorrect.** Splice compatibility is determined by fiber cladding diameter (125 µm for all OS2 fiber regardless of fiber count in the cable), not by the cable's fiber count. Both the 36-fiber and 144-fiber cables contain identical 125 µm cladding OS2 fiber — mechanical splices (like fusion splices) operate on individual fibers, not on the cable assembly. [ITU-T G.652.D §3.1; BICSI OSP-DRD Manual, Ch. 7.3]
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
- **C — Correct.** The required protocol is **OTDR at both 1310 nm and 1550 nm, from both ends, on all 144 fibers**. Two wavelengths: 1310 nm identifies splice events, connectors, and overall attenuation profile; 1550 nm identifies macro-bend loss events that are wavelength-dependent. Two-end testing: testing from both ends resolves events near one end that are hidden in the launch-pulse dead zone when testing from that same end. All 144 fibers: full plant acceptance requires testing every fiber — you can't certify fibers you haven't tested. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]
- **D — Incorrect.** 1310 nm testing is required alongside 1550 nm; neither wavelength alone provides sufficient characterization. For aerial cable specifically, 1310 nm is effective at identifying attachment hardware issues that produce reflective events, while 1550 nm identifies bend events at clamp attachment points where the cable radius is tight. Both are required. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]

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

2. **Missing OLTS insertion loss test results.** BICSI OSP-DRD Manual Ch. 7 and ANSI/TIA-568.3-D §11 require an OLTS (light source and power meter) insertion loss test for each installed link in addition to OTDR tracing. The OLTS provides the total link insertion loss figure for comparison to the optical power budget. An OTDR trace shows the shape of the loss profile; an OLTS gives you the total number. You need both. [ANSI/TIA-568.3-D §11; BICSI OSP-DRD Manual, Ch. 7.2]

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
