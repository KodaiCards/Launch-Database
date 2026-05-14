---
title: "Lesson 4: Armored, Aerial & Direct-Bury Variants"
duration_min: 25
topic: cable-selection
order: 4
bicsi_alignment:
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
  - "OSP-DRD 5.6: Armored and self-supporting cable designs"
  - "OSP-DRD 6.1: OSP installation methods — aerial, direct-bury, conduit"
sources:
  - "ANSI/TIA-758-C §5.3, §5.6, and §6.3"
  - "ANSI/TIA-472AAAB (outdoor loose-tube cable specification)"
  - "IEEE 1222 (all-dielectric self-supporting aerial fiber optic cable)"
  - "NESC (National Electrical Safety Code) C2-2023, Rules 230 and 235"
  - "IEC 60794-1-2 (optical fiber cable — detail specification tests)"
  - "IEC 60794-3 §5 (armored cable design requirements)"
  - "BICSI OSP-DRD Manual, Ch. 6 §6.1–6.4"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 5"
  - "CommScope Cabling Systems Reference Manual Ch. 7"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §5"
---

# Armored, Aerial & Direct-Bury Variants

## In Plain English

Fiber cables go three places outdoors: underground in conduit (plastic pipes you pull cable through), buried directly in the dirt with no pipe, or strung on poles up in the air. Each situation throws completely different hazards at the cable. A cable sitting in a pipe has it easy — the pipe handles all the abuse. A cable buried bare in the ground deals with soil pressure, freezing ground, and rodents chewing on it. A cable hanging between poles deals with its own weight, ice storms, and wind. This lesson covers how cable designers modify the basic loose-tube construction (from Lesson 2) to handle each of those environments.

---

## Quick Acronym Reference

| Acronym / Term | What it stands for | Plain-English gloss |
|---|---|---|
| **OSP** | Outside Plant | All outdoor cable infrastructure |
| **CST** | Corrugated Steel Tape | A crinkled steel sheet wrapped around a cable for crush protection |
| **GRP** | Glass-Reinforced Plastic | A fiberglass rod; non-conductive, used as the cable backbone |
| **ADSS** | All-Dielectric Self-Supporting | Aerial cable that holds itself up between poles using built-in strength members, with no metal anywhere |
| **ANSI/TIA-758-C** | TIA standard 758 revision C | The outdoor fiber cable rulebook |
| **IEEE 1222** | Institute of Electrical and Electronics Engineers standard 1222 | The rulebook for ADSS aerial cable |
| **NESC** | National Electrical Safety Code | The U.S. code that governs power lines, telephone lines, and anything attached to utility poles |
| **EDS** | Every Day Stress | The normal everyday tension in an aerial cable at typical outdoor temperature |
| **RTS** | Rated Tensile Strength | The maximum tension a cable can handle before it starts to permanently deform |
| **RTL** | Rated Tensile Load | The maximum tension allowed during installation (cable pulling) |
| **RSL** | Rated Sidewall Load | The maximum sidewall force a cable can handle where it presses against the inside wall of a conduit on a bend |
| **PE** | Polyethylene | The tough plastic material used for outdoor cable jackets |
| **AHJ** | Authority Having Jurisdiction | The local inspector or official who enforces codes |
| **USDA** | United States Department of Agriculture | The federal agency that administers RUS (Rural Utilities Service) loans for rural broadband |

---

## Reading Content

### Three Environments, Three Design Families

Think of OSP fiber cable the way you'd think about boots: you wear different boots for hiking, rain, and work, even though they all protect your feet. You pick the boot based on what the ground is doing. Same logic applies to cable.

Three distinct threat profiles drive three distinct cable designs:

1. **Direct-burial cable** — withstands soil pressure, freezing/thawing ground, and animals chewing on it, with no pipe protecting it
2. **Aerial cable** — holds its own weight (plus ice and wind) hanging between poles
3. **Conduit cable** — the standard loose-tube design from Lesson 2; no extra armor needed because the pipe handles all the mechanical abuse

---

### Direct-Burial Cable: What Threatens It and How Armor Protects It

A cable buried directly in native soil without a pipe faces hazards a conduit-protected cable never sees:

**Compressive soil load:** Picture 24 inches of dirt and rock piled on top of a garden hose. Backfilled soil — especially clay or rocky soil — squeezes the cable from all sides. Without protection, the pressure slowly deforms the buffer tubes and presses on the fibers, creating microbend loss (light-scattering kinks that increase signal attenuation over time). [IEC 60794-3, §5.1]

**Frost heave:** Water expands about 9% when it freezes. In cold climates, soil water freezes every winter and thaws every spring. That cycle pushes and pulls the cable — up and sideways — repeatedly over decades. Even cables buried below the frost line experience some frost forces in transition soil zones. In most of the northern U.S., the frost line is 18–36 inches deep. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.2]

**Rodent attack:** Pocket gophers, moles, tree squirrels, and in some regions termites will chew right through a standard cable jacket. They either want the material for nesting or are just clearing an obstacle. A plain PE jacket offers essentially zero resistance to sustained gnawing. Rodent damage is one of the top causes of buried fiber failures in rural areas. [AFL OSP Cable Design Guide, §5.2; Corning OSP Reference, §5.1]

---

**Armor types — what they are and when to use each:**

**Corrugated Steel Tape (CST) armor**

Imagine wrapping a cable in a crinkled sheet of steel before putting the outer jacket on it. That's CST armor. The corrugated (wavy) shape lets the steel flex around bends without cracking, while the steel hoop strength resists crushing from soil load and rodent gnawing. This is the standard protection for most direct-burial routes. [IEC 60794-3, §5.3; ANSI/TIA-758-C §5.6]

One important note: steel conducts electricity. CST armor must be **bonded and grounded** at every splice closure and cable end — connected to a ground rod driven into the earth — so that any stray electrical charge (from nearby power lines or lightning) has a safe path to earth instead of building up on the armor. Lesson 10 covers bonding and grounding requirements in detail.

**Interlocked armor (wire armor)**

Instead of a steel tape, this uses individual round steel wires wound in a spiral around the cable. Think of old-fashioned armored electrical cable (BX cable). Wire armor provides higher crush resistance than corrugated tape — it's heavier and more expensive, and you'd specify it for routes through solid rock, under heavy vehicle traffic overhead, or in bore pits at road crossings with extreme soil pressure. [IEC 60794-3, §5.4]

**Dielectric armor (non-metallic armor)**

"Dielectric" means non-conductive — no electricity passes through it. Instead of steel, this uses fiberglass tape or woven fiberglass wrapping under the outer jacket. Fiberglass provides reasonable crush resistance and some rodent deterrence without creating any conductivity. You'd specify dielectric armor near electrical infrastructure where a steel armor would be a safety concern, or in areas where lightning-induced ground currents on a steel armor are a risk. Because there's no metal, no bonding or grounding is required. [ANSI/TIA-758-C §5.6.2; IEEE 1222 §4.2]

---

**The full direct-burial protection stack:**

A properly specified direct-burial cable for a high-priority route has four layers of protection (inside out):

1. **Tube-level water block** — gel or water-swellable material inside each buffer tube
2. **Core-level water block** — water-swellable tape wrapped around the bundle of buffer tubes
3. **CST armor** — steel layer for crush resistance and rodent deterrence
4. **PE outer jacket** — UV resistance and soil chemistry barrier

This four-layer system is the standard for agricultural and suburban direct-burial routes. [ANSI/TIA-758-C §5.3; Corning OSP Reference, §5.2]

---

**Minimum burial depth (ANSI/TIA-758-C §6.3):**

| Installation location | Minimum burial depth |
|---|---|
| Normal soil, not under a road | 24 inches (610 mm) |
| Under roads, streets, highways | 36 inches (914 mm) |
| Under railroads | Contact railroad owner (typically 48+ inches) |
| Rocky or ledge terrain | 12 inches (305 mm) + 3 inches of sand bedding |

These are ANSI/TIA-758-C minimums. Your local AHJ (the inspector) and NESC Rule 354 may require deeper. Always check local requirements before any trenching work. [ANSI/TIA-758-C §6.3; NESC C2-2023, Rule 354]

---

### Aerial Cable: How It Hangs

Aerial installation — running cable between poles without burying anything — is the fastest installation method and requires no excavation. It's also mechanically the most demanding: the cable has to support its own weight plus ice and wind loads across spans that can run 200 to 350 feet between poles. [NESC C2-2023, Rule 230]

Two aerial cable families serve OSP fiber:

---

**Lashed Aerial Cable**

The traditional approach: a separate **messenger wire** — a pre-installed steel or aluminum strand running along the pole line — carries all the weight. The fiber cable is attached to the messenger using a thin stainless steel **lashing wire** wound in a tight spiral around both cables, binding them together. The fiber cable itself carries none of the tension; the messenger handles all of it.

Think of the messenger like a clothesline and the fiber cable like a garden hose hanging from it. The clothesline holds the weight; the hose just hangs along for the ride.

Because the fiber cable carries no tension, it can be a standard loose-tube OSP design — gel-filled, PE jacket, dielectric backbone. The messenger wire is a separate engineered element sized per NESC Table 235-5 for the span length and geographic ice/wind loading zone. [BICSI OSP-DRD Manual, Ch. 6.3]

Some cables integrate the messenger into the jacket in a figure-8 cross-section — one lobe is the fiber core, the other lobe is the built-in steel messenger. This saves the separate lashing step but makes the cable heavier.

---

**ADSS — All-Dielectric Self-Supporting**

ADSS eliminates the messenger wire entirely. Instead, **aramid yarn (Kevlar — the bulletproof-vest material) or fiberglass rod strength members** are built into the cable itself, running alongside the fiber core under the outer jacket. These strength members carry all the catenary tension (the sag-weight load) directly. The whole cable — fiber, strength members, jacket — is completely non-metallic. No steel, no aluminum, nothing that conducts electricity.

**Why this matters:** On a pole line that already carries energized electrical conductors (power lines), a steel messenger creates a continuous metallic conductor running alongside the power lines. It needs to be bonded and grounded at every single pole — expensive, time-consuming, and a safety hazard for maintenance crews for the next 30 years. ADSS eliminates all of that. [IEEE 1222; ANSI/TIA-758-C §5.6.3]

**Key ADSS specifications to know:**

- **EDS (Every Day Stress):** The tension in the cable under normal everyday temperature conditions, expressed as a percentage of its RTS (Rated Tensile Strength — the breaking point). Think of EDS like how tight you pull a rope: pull it too tight and it's always under high stress; every vibration adds fatigue. The standard recommendation is EDS ≤ 20–25% of RTS. At everyday temperatures that's loose enough to absorb ice loading without approaching the breaking point, and relaxed enough that wind vibration doesn't gradually fatigue the strength members. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]
- **Span sag:** The amount the cable droops at the middle of each span under everyday tension. Too much sag = clearance problem below the cable. Too little sag = too much tension = fatigue and ice-storm failures. Minimum ground clearance under ice load must comply with NESC Rule 232 for the crossing type (road, railroad, water, etc.).

**NESC loading districts:** NESC divides the country into loading districts — light, medium, heavy, and extreme wind (coastal). Each district defines the design ice thickness (how much ice builds up on cables in a bad ice storm) and wind pressure the cable must survive. Cable manufacturers provide sag-tension tables for each district and each span length — engineers pull the right table for their geography and span. [NESC C2-2023, Rules 250–251]

---

**When to use each aerial type:**

- **ADSS:** Any span on an energized electrical pole line. Also preferred for new builds on dedicated fiber poles where long-term maintenance simplicity is valued.
- **Lashed aerial:** When an existing messenger strand is already on the pole line (saves the ADSS premium), or when span lengths are short and the line carries no electrical conductors.

---

### Conduit Cable: The Baseline

Conduit-installed cable lives in a protected world. The conduit — a plastic or metal pipe — handles crush loads, frost heave, and rodent attacks. The cable inside just has to survive the installation pull and then sit there carrying light for decades. The standard gel-filled loose-tube cable from Lesson 2 works perfectly for conduit with no armor needed. [ANSI/TIA-758-C §5.3]

The main mechanical concern during conduit installation is **pulling tension and sidewall pressure:**

- **RTL (Rated Tensile Load):** The maximum tension your pulling equipment can apply to the cable during installation. Standard OSP cable: **2,700 N (about 600 pounds-force)**. Exceeding this risks fiber damage even if the jacket looks fine.
- **RSL (Rated Sidewall Load):** At every bend in the conduit, the cable presses against the inside wall of the pipe. That sidewall force is calculated as: tension (in N) divided by the bend radius (in meters). Standard limit: **220 N/m (about 15 pounds per foot)**. Exceeding this presses the cable against the pipe wall hard enough to cause microbend loss at the contact point. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]

For long conduit runs with multiple bends: use conduit pulling lubricant, add intermediate pull points (access boxes mid-route where you can rig a second pulling setup), and monitor tension with a gauge on the pulling equipment.

---

### Selecting the Variant: Decision Summary

| Environment | Recommended variant | Key standard |
|---|---|---|
| Direct-burial, normal soil | Loose-tube, CST armor, gel-fill, PE sheath | ANSI/TIA-758-C §5.6 |
| Direct-burial, high rodent pressure | Loose-tube, CST or wire armor + inner duct | ANSI/TIA-758-C §5.6; AFL §5.2 |
| Direct-burial, near electrical infrastructure | Dielectric armor, PE sheath, no steel | ANSI/TIA-758-C §5.6.2 |
| Conduit (general) | Loose-tube, no armor, PE sheath | ANSI/TIA-758-C §5.3 |
| Aerial, no electrical conductors on line | Lashed (loose-tube + messenger) | NESC C2-2023, Rule 235 |
| Aerial, on energized electrical pole line | ADSS, span-rated, fully dielectric | IEEE 1222; NESC C2-2023 |
| Aerial, long span (300+ ft) | ADSS, heavy-duty aramid loading | IEEE 1222 §5.2 |

---

## Key Terms (Flashcard Candidates)

**Corrugated steel tape (CST) armor**
A crinkled steel sheet applied lengthwise around a cable core under the outer jacket. Provides crush resistance against soil load and a tough barrier against rodent gnawing. Electrically conductive — must be bonded and grounded at splice closures and cable ends. [IEC 60794-3, §5.3; ANSI/TIA-758-C §5.6]

**Dielectric armor**
Non-metallic armor (fiberglass tape or woven wrap) used where steel armor would create electrical hazards near energized infrastructure. Provides mechanical protection without conductivity — no bonding or grounding required. [ANSI/TIA-758-C §5.6.2]

**Messenger wire**
A pre-installed steel or aluminum strand on an aerial pole line that carries the weight of any cable lashed to it. The fiber cable attaches via a lashing wire wound around both the messenger and the fiber cable. [NESC C2-2023, Rule 235G]

**ADSS (All-Dielectric Self-Supporting)**
An aerial cable that carries its own weight between poles using built-in aramid or fiberglass strength members — no separate messenger wire. Completely non-metallic. Required on energized electrical pole lines where a metallic messenger would be unsafe. [IEEE 1222; ANSI/TIA-758-C §5.6.3]

**EDS (Every Day Stress)**
The normal everyday tension in an aerial cable at average outdoor temperature, expressed as a percentage of the cable's Rated Tensile Strength (RTS). Recommended limit: ≤ 20–25% RTS. Low enough to absorb ice loading without breaking; low enough to limit wind-vibration fatigue over the service life. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**RTL (Rated Tensile Load)**
The maximum pulling tension that can be applied to a cable during installation. Standard OSP loose-tube cable: approximately 2,700 N (600 lbf). Exceeding RTL risks fiber damage even if the cable jacket looks intact. [ANSI/TIA-758-C §6.2]

**RSL (Rated Sidewall Load)**
The maximum radial force a cable can exert against the inside of a conduit wall on a bend, without causing microbend loss. Calculated as tension ÷ bend radius. Standard limit: approximately 220 N/m (15 lbf/ft). [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]

**Frost heave**
Cyclic vertical and lateral movement of soil caused by water freezing (expanding ~9%) and thawing repeatedly through winter/spring cycles. Cables buried above the frost line experience this repeated push-pull stress, which can work loose splice closures and stress cable sheath. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.2]

**Lashing wire**
A thin stainless steel wire wound tightly in a spiral around both the messenger strand and the fiber cable, binding them together on an aerial pole line. The messenger carries the weight; the lashing wire is just the mechanical attachment. [BICSI OSP-DRD Manual, Ch. 6.3]

**NESC loading district**
A geographic zone defined in the NESC (National Electrical Safety Code) that specifies design ice thickness and wind pressure for aerial line engineering. Three primary zones: light, medium, heavy. Coastal areas may have additional extreme-wind designations. [NESC C2-2023, Rules 250–251]

---

## Interactive: Drag-and-Drop — Match Sheath/Armor to Deployment Environment

**[image:osp-variant-matching-diagram.svg]**

*Image description for SVG illustrator:*

A two-column layout. Left column: six cable cross-section icons labeled A through F, each showing a different armor/sheath configuration. Right column: six deployment environment descriptions labeled 1 through 6.

Cable icons:
- A: Loose-tube, no armor, PE sheath (basic conduit cable)
- B: Loose-tube, CST armor (corrugated steel), PE outer sheath
- C: ADSS cable cross-section: fiber core + aramid yarn strength members + dual-layer PE sheath, no metallic element
- D: Figure-8 cable cross-section: fiber lobe + integral steel messenger lobe, PE sheath
- E: Loose-tube, dielectric (fiberglass) armor, PE sheath
- F: Loose-tube, wire (round wire) armor, heavy-duty PE sheath

Deployment environments:
1. 0.75-mile conduit run in a telecom conduit system shared with other utilities, no soil exposure
2. 3-mile direct-burial through agricultural land with documented gopher activity
3. 1.2-mile aerial run on a municipal electric utility pole line (7.2 kV energized)
4. 500-foot aerial crossing on a dedicated fiber pole line, messenger already installed
5. 400-foot direct-burial under a state highway with heavy truck traffic and compacted subgrade
6. 2-mile direct-burial through a rural field with sandy loam soil, no documented rodent pressure

**Correct matches:** A→1, B→6, C→3, D→4, E→3 (dielectric armor as alternative), F→5

**Drag-and-drop mechanic:** Learner drags each cable icon to its deployment environment box. Multiple correct pairings are possible for some environments (designer note: accept C or E for environment 3). Correct placement highlights green; incorrect highlights red with one-sentence rationale.

---

## Multiple-Choice Quiz

---

**Q1.** A direct-burial fiber cable in an agricultural area has experienced three sheath failures from gopher gnawing over five years. What cable upgrade is most appropriate for the replacement installation?

- A) Replace with a tight-buffer cable — tight-buffer construction resists gnawing better than loose-tube
- B) Install the same cable in Schedule 40 PVC conduit
- C) Replace with a loose-tube cable with corrugated steel tape armor and heavy-duty PE outer sheath **[CORRECT]**
- D) Increase the burial depth to 48 inches — rodents do not burrow below 36 inches

*Rationale:*
- **A — Incorrect.** Tight-buffer cable cannot be direct-buried under any conditions — it lacks tube-level water blocking and mechanical burial protection. Rodent resistance is irrelevant once you've disqualified the cable for burial altogether. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]
- **B — Partially acceptable but not optimal.** Conduit does protect against gnawing, but Schedule 40 PVC is itself gnawable by determined pocket gophers in sustained attacks. More importantly, excavating the full existing route to install conduit is extremely expensive. Upgrading to armored cable is the more targeted and cost-effective fix. [AFL OSP Cable Design Guide, §5.2]
- **C — Correct.** CST (corrugated steel tape) armor creates a steel barrier that gophers will not chew through. Steel is not a material they can digest or work around easily — most burrowing rodents abandon cable as an obstacle once they hit steel. The heavy-duty PE outer jacket provides UV and soil-chemistry protection on top of the steel. This is the industry-standard fix for documented rodent-pressure routes. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]
- **D — Incorrect.** Pocket gophers routinely burrow to 24–36 inches, and in some soil conditions reach 60 inches. There is no universally safe burial depth that keeps cable out of rodent reach. Depth alone is not a reliable rodent mitigation strategy. [AFL OSP Cable Design Guide, §5.2; Corning OSP Reference, §5.1]

---

**Q2.** An OSP engineer is designing a 750-foot aerial fiber span on a rural electric cooperative distribution line carrying 13.2 kV. Which cable type is required?

- A) Lashed aerial, with galvanized steel messenger and standard loose-tube fiber cable
- B) Figure-8 cable with integral steel messenger
- C) ADSS cable, span-rated for 750 feet in the applicable NESC loading district **[CORRECT]**
- D) Direct-burial armored cable run along the pole line on cable hook attachments

*Rationale:*
- **A — Incorrect.** A galvanized steel messenger on a 13.2 kV distribution line is a continuous metallic conductor running alongside energized wires. It must be bonded to ground at every single pole attachment — expensive, hazardous, and a maintenance burden for decades. NESC and utility safety standards require a fully dielectric solution on energized lines. [NESC C2-2023, Rule 235G; IEEE 1222]
- **B — Incorrect.** A figure-8 cable with an integral steel messenger has the same problem — the integral messenger is still a metallic element on an energized line. [NESC C2-2023, Rule 235G]
- **C — Correct.** ADSS is the required cable type for any aerial span on an energized electrical distribution line. The completely non-metallic design (aramid or fiberglass strength members, no steel anywhere) eliminates bonding/grounding at every pole and eliminates the safety hazards for installation and maintenance crews over the cable's service life. The cable must be rated for the specific span (750 feet) and the applicable NESC loading district. [IEEE 1222; ANSI/TIA-758-C §5.6.3; NESC C2-2023, Rule 230]
- **D — Incorrect.** Running cable along poles on hooks is not an aerial installation method — it's a cable resting on hardware, unsupported in catenary, exposed to wind-induced movement, UV, and vandalism. Not an accepted OSP practice. [BICSI OSP-DRD Manual, Ch. 6.3]

---

**Q3.** A cable is being pulled through a 4-inch conduit with three 90-degree bends over a 1,200-foot route. The cable has an RTL of 2,700 N and an RSL of 220 N/m. During the pull, the tension gauge reads 2,100 N and the calculated sidewall pressure at the tightest bend (10-foot radius) is 190 N/m. Should the pull proceed?

- A) No — the pulling tension exceeds the cable's RTL
- B) Yes — both tension and sidewall pressure are within the cable's rated limits **[CORRECT]**
- C) No — the sidewall pressure exceeds the RSL
- D) Yes — but only if additional lubricant is applied at each bend to bring tension below 1,500 N

*Rationale:*
- **A — Incorrect.** 2,100 N is below the RTL of 2,700 N. RTL has not been exceeded. [ANSI/TIA-758-C §6.2]
- **B — Correct.** Both numbers are within limits. Pulling tension (2,100 N) is below RTL (2,700 N). Sidewall pressure (190 N/m) is below RSL (220 N/m). The pull can safely proceed. Good practice: keep monitoring tension throughout the pull and stop immediately if it climbs toward RTL, and use conduit lubricant on long runs to reduce friction-driven tension increases. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]
- **C — Incorrect.** 190 N/m is below the RSL limit of 220 N/m. RSL has not been exceeded. [ANSI/TIA-758-C §6.2]
- **D — Incorrect.** There is no standard that requires reducing tension below 1,500 N. The RTL is the governing limit, and 2,100 N is within it. Adding lubricant is smart practice for long pulls to keep tension from climbing, but it is not required at the measured tension. [ANSI/TIA-758-C §6.2]

---

**Q4.** What does "Every Day Stress (EDS)" describe for an ADSS cable installation, and why is it limited to 20–25% of Rated Tensile Strength?

- A) The maximum tension the cable can sustain during a severe ice storm, limited to prevent fiber breakage
- B) The design stringing tension at average everyday temperature, limited to prevent fatigue damage and ensure adequate sag margin over the cable's service life **[CORRECT]**
- C) The tension applied during cable installation, limited to protect the installer from overloading the pulling equipment
- D) The rated sidewall pressure, limited to prevent microbend losses where the cable contacts attachment hardware at each pole

*Rationale:*
- **A — Incorrect.** Ice storm loading produces tensions above EDS — that's the point of the safety factor. The cable must survive ice loading above EDS. EDS is the normal everyday condition, not the storm condition. [IEEE 1222 §5.2; NESC C2-2023, Rule 250]
- **B — Correct.** EDS is the tension in the cable at average everyday temperature (typically 15°C / 59°F) — which is also the tension the cable lives with for most of its service life. Limiting EDS to 20–25% of RTS does two things: (1) leaves enough slack in the budget to absorb additional tension from ice weight and wind load without breaking; (2) keeps the cable relaxed enough that wind-induced vibrations (called Aeolian resonance — like a guitar string in the wind) don't fatigue the aramid strength members over decades. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]
- **C — Incorrect.** EDS is not an installation tension limit — it's the long-term design stringing tension based on weather loading calculations. You set the cable's sag during installation to achieve the target EDS at the actual stringing temperature, using tables the manufacturer provides. [IEEE 1222 §5.2]
- **D — Incorrect.** RSL (Rated Sidewall Load) is a conduit-installation concept — it describes force where cable presses on a pipe wall at a bend. RSL has no application to aerial cable, which doesn't run through conduit. [ANSI/TIA-758-C §6.2]

---

**Q5.** A 36-fiber OSP cable was direct-buried along a rural road in 1988 with no armor. The route is being upgraded to 288 fibers. The trench will be reopened. Which product specification should the replacement cable meet, and why?

- A) Same unarmored PE-sheath design as the original — the 1988 cable survived, proving the soil environment is benign
- B) ANSI/TIA-758-C §5.6 armored direct-burial cable with corrugated steel tape — upgrade depth and protection to current standards **[CORRECT]**
- C) Tight-buffer indoor cable — the new fiber count reduces the need for OSP-grade construction
- D) ADSS cable — the aerial variant is easier to service than buried plant

*Rationale:*
- **A — Incorrect.** The original cable surviving 36 years proves it hasn't completely failed — not that the environment is benign or that the original spec was adequate. 1988 cable predates current ANSI/TIA-758-C direct-burial requirements. The trench is already open for the upgrade — this is the opportunity to bring the installation to current standards. [ANSI/TIA-758-C §5.6, §6.3]
- **B — Correct.** Any new direct-burial OSP cable installation — including replacement plant — should meet ANSI/TIA-758-C §5.6. Along a rural road (vehicle traffic overhead, road salt in the soil, potential rodent activity), CST armor is the appropriate protection. The 288-fiber investment justifies the more robust spec: if this cable fails in 10 years for lack of armor, re-excavating the route is extremely expensive. [ANSI/TIA-758-C §5.6; BICSI OSP-DRD Manual, Ch. 6.2]
- **C — Incorrect.** Fiber count has zero bearing on construction suitability for the environment. Tight-buffer cable is never appropriate for direct burial — 288 fibers or 2 fibers, same answer. [ANSI/TIA-758-C §5.2; BICSI OSP-DRD Manual, Ch. 5.3.3]
- **D — Incorrect.** Converting a buried route to aerial requires completely new infrastructure — poles, rights-of-way, attachments. The trench is already open. The cost-effective choice is a properly specified buried cable. [BICSI OSP-DRD Manual, Ch. 6.1]

---

**Q6.** Which NESC rule establishes minimum burial depth for OSP fiber optic cable under a public roadway?

- A) NESC Rule 235 (aerial line clearances)
- B) NESC Rule 354, with ANSI/TIA-758-C §6.3 establishing the TIA minimum of 36 inches **[CORRECT]**
- C) NEC Article 770 (indoor optical fiber cable)
- D) NESC Rule 230 (loading of aerial conductors)

*Rationale:*
- **A — Incorrect.** NESC Rule 235 governs aerial lines — conductor clearances, sag limits, attachment hardware. It says nothing about burial depth. [NESC C2-2023, Rule 235]
- **B — Correct.** NESC Rule 354 addresses underground optical fiber cable installation and protection, including burial depth. ANSI/TIA-758-C §6.3 sets the TIA minimum for fiber under roadways at **36 inches (914 mm)**. Whichever is more stringent — the standard or the local AHJ requirement — governs. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]
- **C — Incorrect.** NEC Article 770 governs indoor fiber installations — flame ratings, separation from other systems, conduit requirements inside buildings. No burial depths. [NEC Article 770]
- **D — Incorrect.** NESC Rule 230 governs aerial line loading (ice, wind, combined effects on overhead lines). Nothing about burial depth. [NESC C2-2023, Rule 230]

---

## Final Check

Answer these before moving on to Lesson 5 (Microduct & Air-Blown Fiber).

**Pulse 1.** Explain why CST armor requires bonding and grounding at each splice closure, and what happens if you skip it.

*Expected answer:* CST armor is a continuous steel conductor running the length of the cable. It can accumulate electrical charge from nearby power lines, lightning strikes on the route, or static buildup in dry soil. If the armor is not bonded (connected via copper conductor) and grounded (connected to a ground rod driven into the earth) at each splice closure and cable end, it floats at an unpredictable voltage. A technician who opens the splice closure and touches the ungrounded armor can receive a serious electric shock. If lightning hits the cable route and the armor is ungrounded, the discharge can arc through the splice closure hardware, destroying the fiber splices inside and injuring the crew. NESC bonding rules require metallic armor to be continuously bonded to a ground electrode at every accessible point. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

**Pulse 2.** A telecom engineer specifies ADSS cable for a 200-foot span in a NESC "heavy" loading district. The manufacturer's sag-tension table shows EDS = 18% RTS at 15°C. Is this within the IEEE 1222 recommendation, and what does EDS mean for long-term cable reliability?

*Expected answer:* Yes — 18% RTS is within the IEEE 1222 recommended limit of ≤ 20–25% RTS for EDS. For long-term reliability, EDS matters in two ways: (1) **structural margin** — at 18% RTS under everyday conditions, the cable has plenty of remaining capacity to absorb additional tension from ice (heavy district: 0.5-inch radial ice at 0°F) and wind without approaching the breaking load; (2) **fatigue resistance** — Aeolian vibration (wind-induced resonance, like a guitar string humming) is worse when the cable is tensioned tighter. At 18% RTS the cable has enough sag that vibration amplitude stays limited; at higher EDS values the cable is tighter and vibrations accumulate fatigue in the aramid strength members more rapidly. Both matter for a 20+ year service life. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Pulse 3.** An OSP crew is pulling a 144-fiber cable through conduit and the tension gauge reaches 3,100 N. The cable's RTL is 2,700 N. What should the crew do, and what is the likely consequence if they keep pulling?

*Expected answer:* **Stop the pull immediately.** Tension above RTL (2,700 N) puts the fiber in tension beyond its design limit. Glass fiber is surprisingly strong in compression but fragile in tension — tensile strain causes microscopic cracks at the fiber surface to propagate, reducing long-term fatigue life and potentially causing fiber fracture during or shortly after the pull. If the crew keeps pulling: some fibers may break during the pull (shows up as a complete break on OTDR testing); fibers that survive may fail prematurely years later under normal thermal cycling or soil movement. Next steps: check the conduit for obstructions (debris, collapsed section, a bend radius that's too tight), add an intermediate pull-assist point at a mid-route handhole, re-lubricate the conduit, and re-attempt at controlled tension. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **CST armor / bonding and grounding** → Lesson 10 (compliance checklist — NESC bonding requirements at splice closures; CST armor bonding is an explicit checklist item per ANSI/TIA-758-C §6.4)
- **ADSS / EDS / messenger** → Lesson 8 (feeder vs. distribution hierarchy — feeder cable on aerial rural co-op pole lines is almost always ADSS)
- **NESC loading district** → Lesson 10 (compliance checklist — installation records must document the applicable NESC loading district and confirm cable and hardware rating compliance)
- **RTL / RSL** → Lesson 6 (sheath options — sheath material affects RTL and RSL; MDPE vs. HDPE sheath compounds)
- **Burial depth minimums** → Lesson 10 (compliance checklist — as-built burial depth must be documented and filed)
- **Dielectric armor** → Lesson 10 (compliance checklist — dielectric cable near electrical infrastructure; no ground electrode required for fully dielectric cable)
