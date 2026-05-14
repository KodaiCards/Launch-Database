---
title: "Lesson 5: Microduct & Air-Blown Fiber"
duration_min: 20
topic: cable-selection
order: 5
bicsi_alignment:
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
  - "OSP-DRD 5.7: Microduct and blown-fiber installation systems"
  - "OSP-DRD 6.5: Trenchless installation and microduct systems"
sources:
  - "ANSI/TIA-758-C §5.7 and §6.5"
  - "IEC 60794-5 (optical fiber cable — microduct cable specification)"
  - "IEC 61282-13 (fiber optic communication system design guides — microduct)"
  - "ETSI EN 187003 (microduct systems for optical fiber installation)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.7 and Ch. 6 §6.5"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 6"
  - "CommScope Cabling Systems Reference Manual Ch. 8"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §6"
  - "Plumettaz SA Blown Fiber Technology Application Guide, 3rd ed."
---

# Microduct & Air-Blown Fiber

## In Plain English — What This Lesson Is About and Why It Matters

Most fiber cables are installed once and stay put. If the route needs more fiber years later, you're digging a new trench. Microduct flips that model: instead of burying the cable itself, you bury a small smooth plastic tube first — the microduct — and then blow the fiber cable in later using compressed air. When capacity grows, you blow in more cable through another duct in the same bundle. No new trench. This lesson explains how microduct works, when it makes sense financially, and the specs a designer needs to get the cable-to-duct sizing right.

## Acronym Glossary

**OSP** — Outside Plant. The fiber infrastructure that lives outdoors between buildings and between hubs.

**FTTH** — Fiber To The Home. Running a fiber all the way from a distribution point to an individual residence.

**ABF** — Air-Blown Fiber. The installation method where compressed air pushes a fiber cable through a microduct.

**HDPE** — High-Density Polyethylene. A tough, slightly flexible plastic used to make conduit, microducts, and cable sheaths. Think of it like heavy-duty PVC pipe.

**SIL** — Silicone Inner Lining. A slippery silicone coating bonded to the inside of a microduct that drastically reduces friction between the cable jacket and the duct wall. Without it, the cable wouldn't slide easily enough for air-blowing to work.

**COF** — Coefficient of Friction. A number (no units) that measures how "grippy" two surfaces are against each other. Lower COF = slicker surface = cable slides easier. SIL-lined duct has COF around 0.1–0.2 vs. 0.3–0.5 for unlubricated pipe.

**ID** — Inner Diameter. The measurement of the inside opening of the duct or tube — the space the cable has to fit through.

**OD** — Outer Diameter. The measurement of the outside surface of the cable (or duct).

**HDD** — Horizontal Directional Drilling. A trenchless boring method that steers a drill bit underground in a controlled curve to pass under roads, rivers, and utilities, then pulls a duct or cable back through the bore. Like drilling under a road without tearing up the pavement.

**ANSI/TIA** — American National Standards Institute / Telecommunications Industry Association. The U.S. standards body that publishes the engineering rules (like TIA-758-C) that govern OSP installations.

**IEC / ETSI** — International Electrotechnical Commission / European Telecommunications Standards Institute. The international equivalent standards bodies whose microduct specs (IEC 60794-5, ETSI EN 187003) are widely adopted.

**BICSI** — Building Industry Consulting Service International. Publishes the OSP-DRD (Outside Plant Design Reference/Delivery) Manual — the field handbook for OSP design.

**ROW** — Right-of-Way. The legal corridor — typically alongside roads, under streets, or between properties — where utilities are permitted to install cables, conduit, and poles.

---

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the physical characteristics of a microduct and the range of available inner diameter sizes
- Explain the air-blown fiber (ABF) installation method and articulate its operational advantages over conventional pull-in cable installation
- Identify the cable types designed for microduct systems and explain how their construction differs from conventional OSP loose-tube cable
- Evaluate a scenario involving duct fill, future capacity, and installation cost to determine whether microduct is the appropriate infrastructure choice

---

## Reading Content

### Why Microduct?

Picture the traditional way of installing fiber like burying a garden hose: you dig the trench, lay the hose, fill it in. The garden hose is permanent — it has exactly as many fibers as you planned when you dug the trench. If you need more capacity next year, you're digging again.

Microduct works like burying empty conduit instead of the hose. You bury the tube first. Later, whenever you need to run cable (fiber), you push it through using compressed air. When you need more, you push more through another tube in the bundle — no new trench.

Traditional OSP infrastructure installs cable once and leaves it in place. The cable's fiber count is chosen at design time, with a capacity estimate for 10–20 years of growth. If growth exceeds the estimate, a new trench must be opened, a new cable pulled, and new splice closures added — a major capital expenditure for each network expansion cycle.

Microduct systems invert this model. Instead of installing the final fiber cable in the trench, the installer places a **microduct** — a small-diameter, smooth-bore, semi-rigid tube — in the trench. The microduct is permanently installed; it is the infrastructure. The fiber cable is blown in later, at installation time or any time in the future, using compressed air and a cable-blowing machine. When network demand grows, additional cables can be blown through additional microducts, or the original cable can be retrieved and replaced with a higher-fiber-count version, without reopening the trench [BICSI OSP-DRD Manual, Ch. 5.7].

The operational philosophy is **conduit infrastructure first, cable when needed.** It trades a higher per-foot infrastructure cost (microduct is more expensive per foot than a basic conduit) for a dramatically reduced future cable-addition cost (blowing through existing microduct is faster and less expensive than opening a new trench).

### Microduct Physical Characteristics

Microducts are small-bore, semi-rigid tubes manufactured from HDPE or similar polymer. Key dimensional characteristics:

| Inner diameter (ID) | Outer diameter (OD) | Typical cable OD range | Application |
|---|---|---|---|
| 7 mm | 10 mm | Up to 5.5 mm | Low-fiber-count drop cables, 24–96 fiber |
| 10 mm | 12 mm | Up to 7.5 mm | Standard distribution cable, 24–216 fiber |
| 14 mm | 16 mm | Up to 11 mm | High-density or rollable-ribbon, up to 432 fiber |
| 20 mm | 24 mm | Up to 16 mm | Very high-count or multi-tube bundle, 576–1728 fiber |

*Sources: [IEC 60794-5, §4.1; ETSI EN 187003, Table 1; Corning OSP Reference, §6.1]*

The critical feature that makes air-blown installation work is the **SIL — silicone inner lining** on the inside of the microduct. This co-extruded silicone layer is extremely slippery — imagine the inside of a Teflon pan versus a cast-iron pan. It's the reason a cable can be pushed through a long, winding duct by compressed air instead of requiring a mechanical pull with a winch. Without that slick inner surface, friction would stall the cable within a few hundred feet [IEC 60794-5, §4.2; AFL OSP Cable Design Guide, §6.1].

**Multi-microduct bundles:** Individual microducts are commonly assembled into multi-duct bundles at the factory. A typical bundle contains 2, 4, 7, or 12 individual microducts packaged together in a common outer sheath — think of it like a bundle of capillary tubes inside a larger pipe. A 12-microduct bundle installs 12 independent fiber pathways in a single trench in one pull — the same excavation footprint as a single conduit, but with 12 separable capacity slots for future cable [Corning OSP Reference, §6.2; CommScope Reference Manual, Ch. 8.1].

**Microduct vs. conventional HDPE conduit:**

| Property | Microduct | Conventional conduit (1–4 inch) |
|---|---|---|
| Inner surface | Smooth, SIL-lubricated | Standard HDPE bore |
| Cable installation method | Air-blown | Pull-in (fish tape, Kellems grip) |
| Minimum bend radius | Tighter (more flexible) | Stiffer per unit area |
| Conduit fill ratio | Designed for 50–60% max | Designed for 50% NEC/TIA max |
| Deployment method | Trench with bundle, or microtrench | Standard conduit trench or bore |
| Future cable addition | Blow into unused duct; no trench | Open new trench |

The key operational distinction is that microducts are designed for air-blown installation throughout their service life — every microduct in the bundle is a future cable pathway. [ANSI/TIA-758-C §5.7; BICSI OSP-DRD Manual, Ch. 5.7]

### Air-Blown Fiber: The Installation Method

Think of air-blown cable installation like blowing a straw wrapper off a restaurant straw. You put the straw to your lips, the wrapper sits on the end, and a puff of air sends it flying down the table. Now scale that up: a compressed-air machine pushes the cable through hundreds or thousands of feet of duct.

More precisely, **air-blown fiber (ABF)** installation uses a **cable-blowing machine** that simultaneously does two things:
1. **Grips and pushes the cable** with driven roller wheels at the duct entry — like powered guide rollers pushing the cable forward into the duct
2. **Injects compressed air** at the duct entry, flowing toward the far end of the duct

The compressed air doesn't just push from behind like a piston. It creates an aerodynamic drag force *along the entire length* of the cable surface as it flows past — the moving air grabs the cable all the way down its length and carries it forward simultaneously. Combined with the roller-driven push at the entry point, this gets cable through long duct runs that a mechanical pull alone could never manage without overloading the cable.

This combination can install cable over distances of **1,000–4,000 meters in a single blow** depending on duct size, cable size and weight, and how many bends are in the route [AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §2.1].

**Air-blown operating parameters:**

| Parameter | Typical range | Governing limit |
|---|---|---|
| Air pressure | 8–15 bar (116–218 psi) | IEC 60794-5 duct pressure rating |
| Air flow rate | 0.5–2.0 m³/min at operating pressure | Blowing machine capacity |
| Cable installation speed | 20–80 m/min | Duct geometry and machine settings |
| Maximum single-blow distance | 1,000–4,000 m | Duct ID, cable OD, friction, bend count |

*Sources: [IEC 60794-5, §6.1; AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §2.2]*

For routes longer than a single blow can reach, **intermediate access points** (manholes or above-grade blow-in boxes) are placed along the route at 2,000–4,000 m intervals. A crew sets up at each access point and blows the next segment [BICSI OSP-DRD Manual, Ch. 6.5].

**Advantages of air-blown installation over pull-in:**

1. **Lower tensile stress on cable.** In a conventional pull-in installation, a Kellems grip (a mesh sleeve) grabs the front of the cable and a winch pulls from that point. All the tension accumulates at the cable's leading end — on a long run with many bends, that tension can approach or exceed the cable's rated limit. Air-blown installation distributes force along the cable length aerodynamically. The peak tension on any part of the cable is dramatically lower, reducing the risk of stretching or cracking fibers [Corning OSP Reference, §6.3].

2. **Retrieval and replacement.** A cable blown into a microduct can be **pulled back out** — either by reversing the airflow or pulling from the far end. This makes future upgrades practical: pull out the 96-fiber cable that's now too small, blow in a 432-fiber replacement. Conventional pull-in cable in a conduit, once in and surrounded by backfill, typically gets cut and abandoned rather than retrieved when replacement is needed. [AFL OSP Cable Design Guide, §6.4]

3. **Speed.** Air-blown cable installation at 40–80 m/min is much faster than pull-in rates of 3–10 m/min for long conduit runs. Less time on the route = lower crew cost [Plumettaz Blown Fiber Guide, §2.1].

4. **Future capacity without excavation.** Unused microducts in a bundle sit sealed with a pressurized end plug. When capacity is needed, pop the plug, set up the blowing machine, and the cable is in within hours. No permit applications for new trenching. No pavement restoration. [BICSI OSP-DRD Manual, Ch. 6.5]

### Microduct-Compatible Cable Construction

Standard loose-tube OSP cable (as described in Lesson 2) is not built for air-blown installation. Air-blown cable needs specific physical properties:

**Low coefficient of friction (COF).** Air-blown cable jackets are formulated with low-friction HDPE — often with embedded lubricant or a textured surface finish that slides along the duct bore with minimal resistance at bends. Standard PE sheath compounds on conventional OSP cable have higher friction. [IEC 60794-5, §5.3; AFL OSP Cable Design Guide, §6.2]

**Low mass per unit length.** Heavier cable requires more air force to push. Microduct cable designs trim weight by:
- Smaller or fewer strength members (the duct itself provides crush protection — the job that armor does on a direct-bury cable)
- Dry water-blocking instead of gel fill (gel is heavy per meter)
- Thinner sheath walls
[IEC 60794-5, §5.2; Corning OSP Reference, §6.4]

**Tight OD tolerance.** Air-blown installation is sensitive to cable OD variation. If the cable gets wider and narrower along its length, the gap between cable and duct wall changes, which changes the aerodynamic drag force — and a stiff, grippy section can stall the blow. Microduct cable OD is controlled to ±0.1 mm. [IEC 60794-5, §5.1]

**Rollable ribbon core.** As described in Lesson 3, rollable ribbon (intermittent-bond ribbon fiber) achieves the highest fiber density in a small-OD cable. A 288-fiber rollable ribbon cable may have an OD of 8–9 mm, fitting comfortably in a 14 mm ID microduct. A conventional 288-fiber round-tube loose-tube cable would be 12–14 mm OD, requiring a much larger duct. Rollable ribbon in microduct is the dominant approach for new high-count metropolitan FTTH deployments [AFL OSP Cable Design Guide, §6.2; Corning OSP Reference, §6.4].

### Duct Fill Ratio and Capacity Planning

The **fill ratio** tells you how much of the duct's inside opening is occupied by the cable. Picture looking down the open end of a duct: the cable is a circle sitting inside a larger circle. The fill ratio is how big that inner circle is relative to the outer one.

The formula is simple:

**Fill ratio = Cable OD ÷ Duct ID**

Where:
- **Cable OD** = the outer diameter of the cable you're planning to blow, in millimeters
- **Duct ID** = the inner diameter of the microduct, in millimeters
- **Fill ratio** = a decimal number between 0 and 1 (you can convert to a percentage by multiplying by 100)

IEC 60794-5 and ETSI EN 187003 recommend a maximum fill ratio of **0.50–0.60** (50–60%) for reliable air-blown installation.

**Why 50–60%?** If the cable fills too much of the duct, the thin ring of air around the cable is too narrow to generate the aerodynamic drag force that moves the cable forward. Think of it like blowing air through a straw with a marshmallow stuck in it — if the marshmallow fills the whole straw, no air gets past it. If it fills only half the straw, air flows freely around it and pushes it along. The cable needs enough clearance for air to flow and create lift. [IEC 60794-5, §6.2; ETSI EN 187003, §5.2]

**Worked example — checking a cable/duct combination:**

Given:
- Duct inner diameter (ID): 14 mm
- Cable outer diameter (OD): 9.0 mm

Step 1: Calculate fill ratio.
Fill ratio = Cable OD ÷ Duct ID = 9.0 mm ÷ 14 mm = **0.643**

Step 2: Compare to the 0.60 maximum.
0.643 > 0.60 — **this combination fails the fill ratio check.**

Step 3: Select a larger duct.
Try the 20 mm ID duct:
Fill ratio = 9.0 ÷ 20.0 = **0.45** — within spec. Use the 20 mm duct.

Sanity check: 0.45 means the cable occupies 45% of the duct opening, leaving 55% of the cross-sectional area for airflow. Plenty of room for the aerodynamic drag to work. [IEC 60794-5, §6.2]

**Planning for the future.** Microduct systems should be sized for the *ultimate design capacity*, not just the immediate need. If the route will eventually need 576 fibers, install the microduct bundle capable of accommodating a 576-fiber cable — even if only a 48-fiber cable gets blown in on day one. The cost difference between a 10 mm ID and a 14 mm ID duct at time-of-installation is a fraction of the cost of reopening a trench to swap out undersized duct years later [BICSI OSP-DRD Manual, Ch. 6.5; ANSI/TIA-758-C §5.7].

### When Microduct is the Right Choice

Specify microduct when one or more of the following apply:

- **Future capacity growth is expected but unpredictable.** Build the infrastructure once, blow in cable as demand materializes. The canonical FTTH greenfield build scenario.
- **Trench excavation is expensive or permits are hard to get.** Urban areas, paved ROWs (rights-of-way — the legal corridor where utilities are allowed to install infrastructure), and existing utility corridors make reopening a trench prohibitively expensive. A microduct bundle on day one is insurance against future trench costs.
- **Cable retrieval and replacement are part of the network lifecycle plan.** Microduct makes upgrading fiber counts a practical field operation without excavation.
- **Microtrench construction methods are used.** A microtrench is a narrow-slot cut (15–50 mm wide, 200–400 mm deep) in pavement for microduct installation — much faster and cheaper than a full utility trench. Conventional conduit is too large for microtrench; microducts (10–16 mm OD) are sized for it. Same for HDD (horizontal directional drilling) under roads — microducts fit through bore diameters that would exclude conventional conduit. [BICSI OSP-DRD Manual, Ch. 6.5; ANSI/TIA-758-C §6.5]

Microduct is **not appropriate** when:
- The route is a one-time, fixed-capacity installation with no foreseeable growth (e.g., a 12-fiber dedicated point-to-point link between two fixed structures)
- The crew lacks air-blowing equipment and training
- Very short routes (under 100 m) where the setup overhead of microduct blowing equipment exceeds the benefit

---

## Key Terms (Flashcard Candidates)

**Microduct**
A small-bore (7–20 mm ID), smooth, SIL-lubricated HDPE tube designed as a permanent cable pathway infrastructure. Cable is blown in using compressed air and a cable-blowing machine, and can be retrieved and replaced without trenching. [IEC 60794-5; ANSI/TIA-758-C §5.7]

**Air-blown fiber (ABF)**
Cable installation method in which compressed air flowing through a microduct creates aerodynamic drag along the cable length, propelling the cable forward simultaneously with a roller-drive assist at the entry point. Achieves 1,000–4,000 m per single blow at 20–80 m/min. [AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §2.1]

**Fill ratio (microduct)**
Cable OD divided by duct ID. Recommended maximum: 0.50–0.60. Above this ratio, the annular air space around the cable is insufficient to generate reliable aerodynamic lift for air-blown installation. [IEC 60794-5, §6.2; ETSI EN 187003, §5.2]

**Rollable ribbon (in microduct context)**
Intermittent-bond ribbon fiber that rolls into a circular cross-section for storage in a standard small-OD microduct-compatible cable, while unrolling flat for mass-fusion splicing. Enables the highest fiber-per-duct capacity in microduct systems. [AFL OSP Cable Design Guide, §6.2]

**Multi-microduct bundle**
Factory-assembled package of 2, 4, 7, or 12 individual microducts in a common outer sheath. Installs multiple independent fiber pathways in one trench operation. [Corning OSP Reference, §6.2]

**Cable-blowing machine**
Equipment that simultaneously drives cable into a microduct via roller assist and injects compressed air at the duct entry. Operating pressure: 8–15 bar. Cable speed: 20–80 m/min. [Plumettaz Blown Fiber Guide, §2.1; AFL OSP Cable Design Guide, §6.3]

**SIL (silicone inner lining)**
Co-extruded silicone compound lining the inner bore of a microduct, reducing the coefficient of friction between cable and duct to enable air-blown installation. Typical COF with SIL: 0.1–0.2 vs. 0.3–0.5 for unlubricated HDPE. [IEC 60794-5, §4.2; AFL OSP Cable Design Guide, §6.1]

**Microtrench**
A narrow-slot trench (typically 15–50 mm wide, 200–400 mm deep) cut into pavement or soil for microduct installation. Smaller than a conventional utility trench, enabling higher-speed installation and reduced excavation cost per linear foot in urban areas. Compatible only with microduct or small-diameter conduit. [ANSI/TIA-758-C §6.5; BICSI OSP-DRD Manual, Ch. 6.5]

---

## Interactive: Flashcards — Microduct Sizing Parameters

*H5P Dialog Cards set — 8 cards*

**Card 1**
Front: What is the maximum recommended fill ratio for air-blown cable in a microduct?
Back: **0.50–0.60 (50–60%).** Above this ratio, the annular air space is insufficient for reliable aerodynamic lift. [IEC 60794-5, §6.2; ETSI EN 187003, §5.2]

**Card 2**
Front: A 10 mm ID microduct (0.55 max fill ratio) — what is the maximum cable OD?
Back: **5.5 mm.** Formula: max cable OD = fill ratio × duct ID = 0.55 × 10 mm = 5.5 mm. [IEC 60794-5, §6.2]

**Card 3**
Front: What physical cable property allows retrieval from a microduct?
Back: Air-blown installation is **reversible** — the cable can be blown back out by reversing airflow or pulled from the far end, because no adhesive, grouting, or consolidating fill is used. [AFL OSP Cable Design Guide, §6.4]

**Card 4**
Front: Why does microduct cable have a lower mass per unit length than conventional OSP cable of the same fiber count?
Back: Microduct cable omits armor (the duct provides crush protection), uses rollable ribbon or dry water-blocking (gel adds mass), and minimizes sheath thickness — all of which reduce mass to lower the air force needed to blow the cable. [IEC 60794-5, §5.2]

**Card 5**
Front: What advantage does a multi-microduct bundle provide at installation time?
Back: **Multiple independent future cable pathways in a single trench.** A 7-duct or 12-duct bundle installs one future capacity slot per microduct in the same excavation footprint as a single conduit — without requiring the same fiber count on day one. [Corning OSP Reference, §6.2]

**Card 6**
Front: What is the typical single-blow installation distance range for air-blown cable?
Back: **1,000–4,000 meters**, depending on duct ID, cable OD, cable mass, air pressure (8–15 bar), and route bend count. Longer routes use intermediate access points at 2,000–4,000 m intervals. [AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §2.2]

**Card 7**
Front: Why is rollable ribbon preferred over conventional loose-tube fiber core in microduct cables?
Back: Rollable ribbon achieves a higher fiber-per-mm² packing density in a small cable OD. A 288-fiber rollable ribbon cable may have an 8–9 mm OD, fitting a 14 mm ID microduct, whereas a 288-fiber round-tube loose-tube cable at 12–14 mm OD would require a 20 mm ID microduct for the same fill ratio. [AFL OSP Cable Design Guide, §6.2]

**Card 8**
Front: Name two installation environments where microtrench enables microduct deployment where conventional conduit would be impractical.
Back: (1) **Urban pavement** — microtrench cuts a 15–50 mm wide slot in asphalt or concrete, minimizing disruption and road surface repair cost compared to a 300–600 mm wide conventional utility trench. (2) **Horizontal directional drilling (HDD) bores** — 10–16 mm OD microducts thread through HDD bore diameters too small for conventional conduit, enabling duct installation under roads, rivers, and utilities without open excavation. [ANSI/TIA-758-C §6.5; BICSI OSP-DRD Manual, Ch. 6.5]

---

## Multiple-Choice Quiz

---

**Q1.** What is the primary operational advantage of microduct infrastructure over conventional conduit for OSP fiber plant?

- A) Microduct provides lower optical attenuation per fiber than conduit-installed cable
- B) Microduct eliminates the need for water-blocking in OSP environments
- C) Future cable can be added or replaced without opening the trench **[CORRECT]**
- D) Microduct cable uses standard pull-in installation, which is faster than air-blown methods

*Rationale:*
- **A — Incorrect.** Microduct is an infrastructure technology — it has no direct effect on optical attenuation, which is a property of the fiber and cable construction. A cable blown through a microduct has the same per-fiber attenuation as the same cable pulled through a conventional conduit. [IEC 60794-5; Corning OSP Reference, §6.4]
- **B — Incorrect.** Microduct does not eliminate water-blocking requirements. Microduct cables still require water-blocking at the tube or cable level (typically dry water-blocking, since gel adds mass undesirable in air-blown designs). End seals on microducts prevent moisture entry into unused ducts. [IEC 60794-5, §5.2]
- **C — Correct.** The defining operational advantage of microduct is infrastructure permanence with cable flexibility. The duct is installed once; cables can be blown in, retrieved, and replaced at any future time without excavation. This makes microduct the enabling technology for incremental FTTH capacity expansion, network upgrade cycles, and lifecycle cable management. [BICSI OSP-DRD Manual, Ch. 5.7; ANSI/TIA-758-C §5.7]
- **D — Incorrect.** Microduct is specifically designed for air-blown installation, not pull-in. Air-blown cable installation averages 20–80 m/min, which is faster than pull-in installation for long microduct runs. Pull-in cable into small-diameter microducts is not a standard method and would generate excessive tensile forces. [AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §2.1]

---

**Q2.** A 14 mm ID microduct is available. A 288-fiber rollable ribbon cable has an OD of 9.0 mm. What is the fill ratio, and is it within the recommended maximum?

- A) Fill ratio = 0.64; exceeds the recommended 0.50–0.60 maximum — a larger duct is required
- B) Fill ratio = 0.64; within the recommended maximum for rollable ribbon designs
- C) Fill ratio = 0.64; exceeds the recommended maximum — the cable OD must be reduced before blowing **[CORRECT]**
- D) Fill ratio = 0.55; within the recommended maximum — the blow can proceed

*Rationale:*
- **A — Correct calculation, correct assessment.** 9.0 mm ÷ 14 mm = **0.643** — this exceeds the IEC 60794-5 recommended maximum fill ratio of 0.60. A larger duct (20 mm ID: fill ratio = 9.0/20.0 = 0.45) is required. **This response is equivalent to option C** — either A or C is acceptable. The key is that 0.64 exceeds the 0.60 limit. [IEC 60794-5, §6.2]
- **B — Incorrect.** The fill ratio is correctly calculated as 0.64, but the assessment is wrong. There is no exception to the fill ratio limit for rollable ribbon designs — rollable ribbon reduces cable OD to minimize fill ratio, but it does not change the maximum fill ratio specification. A fill ratio of 0.64 exceeds the recommended maximum and would risk a stalled blow. [IEC 60794-5, §6.2]
- **C — Correct.** 9.0 ÷ 14 = 0.643. This exceeds the 0.60 recommended maximum. The blow should not proceed with this duct/cable combination. The correct remediation is to use a **20 mm ID microduct** (fill ratio 9.0/20.0 = 0.45, within spec), or a smaller-OD cable variant if a 288-fiber count can be achieved in a smaller package. [IEC 60794-5, §6.2; ETSI EN 187003, §5.2]
- **D — Incorrect.** 9.0 mm ÷ 14 mm = 0.643, not 0.55. The calculation error in option D produces an incorrect fill ratio. The actual fill ratio exceeds the recommended maximum. [IEC 60794-5, §6.2]

---

**Q3.** A telecom engineer is planning a new FTTH feeder route in a dense urban neighborhood. The route is 2,800 m long, passes under two major roads, and the city's permitting process limits road cuts to one construction event per five-year period. What infrastructure approach is most appropriate?

- A) Direct-bury OSP cable at the maximum fiber count anticipated for the next 20 years
- B) Multi-microduct bundle installed via microtrench and directional boring under road crossings, fiber blown in on initial segments as needed **[CORRECT]**
- C) Conventional 4-inch HDPE conduit, single pull, maximum cable fill
- D) ADSS aerial cable on city utility poles to avoid underground permitting entirely

*Rationale:*
- **A — Incorrect.** Direct-buried cable without a conduit or microduct leaves no path for future capacity addition without re-excavating the route. The 5-year permit constraint means any future capacity upgrade would be locked out for years after day-one installation. Additionally, direct-bury cable cannot be retrieved or replaced without excavation. [BICSI OSP-DRD Manual, Ch. 5.7]
- **B — Correct.** Multi-microduct bundle via microtrench (for standard street segments) and horizontal directional drilling (for under-road crossings) addresses all constraints: (1) single construction event installs the duct infrastructure permanently; (2) future capacity is added by blowing cable into unused ducts — no additional permits or road cuts required; (3) HDD eliminates the need for a road-cut permit at the two major road crossings; (4) microtrench minimizes pavement restoration cost on street segments. [ANSI/TIA-758-C §5.7, §6.5; BICSI OSP-DRD Manual, Ch. 6.5]
- **C — Incorrect.** Conventional 4-inch conduit is a valid conduit approach but does not offer the future cable-addition flexibility of microduct. Adding cable to a full conventional conduit requires either a second conduit (new permit/excavation) or replacement of the existing cable (expensive, disruptive). The single-permit constraint makes conventional conduit a higher-risk choice than microduct for this scenario. [BICSI OSP-DRD Manual, Ch. 5.7]
- **D — Incorrect.** Aerial installation in a dense urban neighborhood requires pole licensing agreements with the utility, clearance compliance from buildings and other utilities, and is generally less aesthetic and more vandalism-prone than underground plant. More importantly, the scenario specifies permitting is limited for underground work — aerial construction typically requires separate permits for each pole attachment that may be equally or more restricted. [NESC C2-2023, Rule 235; BICSI OSP-DRD Manual, Ch. 6.3]

---

**Q4.** During an air-blown cable installation, the blow stalls at approximately 600 m of a 1,200 m duct run. Air pressure reads normal at the blowing machine. What is the most likely cause?

- A) The cable has exceeded its RTL — the roller drive must be reduced
- B) An obstruction or tight bend radius in the duct at approximately 600 m is creating a high-friction zone that the air drag force cannot overcome **[CORRECT]**
- C) The cable has blown out the far end and the blowing machine is pushing against a sealed terminus
- D) The compressor cannot maintain sufficient air volume for a 1,200 m run — a higher-flow blowing machine is needed

*Rationale:*
- **A — Incorrect.** RTL (rated tensile load) applies to pull-in cable installation, where a pulling head bears the accumulated tensile load of the entire cable behind it. In air-blown installation, the cable is not under sustained tensile load at the entry point — the force is distributed along the cable length aerodynamically. The roller drive at the entry contributes a small push force; it does not accumulate as tension. RTL is not the limiting constraint in a mid-blow stall. [AFL OSP Cable Design Guide, §6.3; Corning OSP Reference, §6.3]
- **B — Correct.** A mid-run stall at a specific distance with normal air pressure indicates a localized high-friction zone at approximately that point in the duct. Common causes: a tight bend that reduces cable-to-duct clearance (increasing friction disproportionately at the contact arc), a deformation or collapse of the duct at a joint or trench damage point, or accumulated debris at a low-point sump in the duct. Remediation involves locating the duct obstruction (CCTV camera or duct-probe tools), clearing the obstruction, and retrying the blow. [AFL OSP Cable Design Guide, §6.3; Plumettaz Blown Fiber Guide, §3.2]
- **C — Incorrect.** If the cable had blown through the far-end terminus, the cable would be visible at the far end (or have activated the end-detect sensor if present), and the blowing machine's cable-metering counter would show an installation distance approaching 1,200 m — not 600 m. A stall at 600 m on a 1,200 m duct is a mid-route problem, not an endpoint condition. [Plumettaz Blown Fiber Guide, §3.2]
- **D — Incorrect.** Air volume requirements are determined by duct ID, cable OD, and duct length. For a 14 mm ID × 1,200 m duct with a standard microduct cable, a mid-size blowing machine (0.5–2.0 m³/min at 10 bar) is typically adequate. More importantly, if the compressor capacity were the limiting factor, the blow would stall on every run of this length with this duct/cable combination — not just once at 600 m. An isolated stall at a specific distance points to a route-specific obstruction. [AFL OSP Cable Design Guide, §6.3]

---

**Q5.** An engineer is designing a 3.5 km FTTH distribution route. Today's demand is 96 fibers; the design team projects 384 fibers will be needed within 10 years. What microduct bundle specification most efficiently supports this growth?

- A) One 10 mm ID microduct with a 96-fiber cable blown in now; plan to install a new duct when 384 fibers are needed
- B) Four 10 mm ID microducts in a bundle: blow 96-fiber cable into one duct now; blow additional cables into the other three ducts as demand grows **[CORRECT]**
- C) One 20 mm ID microduct with a 96-fiber cable blown in now; replace with a 384-fiber cable in the same duct when demand reaches 384 fibers
- D) Conventional 4-inch HDPE conduit with four 96-fiber cables installed now at full capacity

*Rationale:*
- **A — Incorrect.** A single-duct installation with no provision for future capacity requires a new trench and duct installation when 384 fibers are needed — at the same excavation cost as the original installation, with additional permitting and disruption. This defeats the operational advantage of microduct infrastructure. [BICSI OSP-DRD Manual, Ch. 5.7]
- **B — Correct.** A four-duct bundle installs four independent capacity slots in one trench. Day-one demand (96 fibers) occupies one duct; the remaining three are sealed and available for future cable. As demand grows, additional 96-fiber (or higher-count) cables are blown into the remaining ducts without excavation. At 384 fibers, four ducts × 96 fibers = total capacity met. The incremental cost of the three extra 10 mm microducts in the bundle on day one is small relative to the avoided future excavation cost. [ANSI/TIA-758-C §5.7; BICSI OSP-DRD Manual, Ch. 6.5]
- **C — Incorrect.** A single 20 mm ID microduct with a 96-fiber cable (fill ratio ≈ 0.35) works for day-one, but the upgrade path of retrieving the 96-fiber cable and replacing with a 384-fiber cable requires knowing that a 384-fiber rollable ribbon cable fits within 0.60 × 20 mm = 12 mm OD — which is technically feasible but requires careful cable selection. More importantly, the single-duct approach provides only one capacity slot; if the 384-fiber cable is installed and demand grows beyond that, there is no further capacity without a new trench. The four-duct bundle is more flexible. [IEC 60794-5, §6.2; BICSI OSP-DRD Manual, Ch. 6.5]
- **D — Incorrect.** Installing 384 fibers of capacity on day one when demand is 96 fibers ties up capital in over-provisioned infrastructure. Additionally, conventional 4-inch conduit does not offer the future cable retrieval and replacement flexibility of microduct. The answer does not match the operational philosophy that makes microduct valuable. [BICSI OSP-DRD Manual, Ch. 5.7]

---

## Final Check

Answer before proceeding to Lesson 6 (Sheath Options: PE, OSP-rated, FR/OFNR/OFNP, and Armored).

**Pulse 1.** Explain why air-blown cable installation subjects fiber to less mechanical risk than conventional pull-in installation.

*Expected answer:* In pull-in installation, a Kellems grip or pulling eye attached to the cable front end bears the accumulated tensile load of the entire cable behind it in the conduit. On a long run with multiple bends, tension at the pulling head can approach the cable's RTL. All of that tension is concentrated at the cable's leading end. In contrast, air-blown installation distributes force aerodynamically along the cable's entire length — the compressed air exerts a drag force per unit area of cable surface, moving the cable forward without concentrating tension at any single point. Peak cable tension in air-blown installation is a fraction of that in pull-in installation for equivalent run lengths and configurations. This lower peak tension reduces the risk of tensile strain damage to fibers and makes air-blown installation suitable for lighter-weight, lower-RTL cables like microduct designs. [Corning OSP Reference, §6.3; AFL OSP Cable Design Guide, §6.3]

**Pulse 2.** A 12-microduct bundle is installed in a trench on day one. Only two of the 12 microducts are blown with cable initially. What should be done to the unused 10 microducts?

*Expected answer:* Unused microducts must be **sealed with pressurized end plugs** at every accessible end (manholes, hand-holes, building entry points). Sealing serves two purposes: (1) prevents moisture, insects, and debris from entering and accumulating in the duct bore, which could obstruct a future cable blow or damage cable during installation; and (2) maintains a slight positive air pressure in the duct (or allows easy pressure-testing before a future blow) to confirm the duct is unobstructed and intact. End plugs are removed when the duct is needed for cable installation. [BICSI OSP-DRD Manual, Ch. 6.5; AFL OSP Cable Design Guide, §6.4]

**Pulse 3.** State the fill ratio formula and explain what happens to a cable-blowing attempt if the fill ratio is too high.

*Expected answer:* Fill ratio = **Cable OD ÷ Duct ID**. Recommended maximum: 0.50–0.60. If the fill ratio is too high (cable OD too close to duct ID), the annular gap between the cable surface and the duct bore is too narrow for the compressed air to generate sufficient aerodynamic drag along the cable length. The cable stalls — typically within the first few hundred meters where entry friction is highest — because the air flowing through the narrow gap cannot produce enough lift force to sustain forward momentum. The blowing machine's roller drive alone cannot sustain a long blow against the accumulated cable weight in the duct. The outcome is a failed installation requiring either a smaller-OD cable or a larger-ID duct. [IEC 60794-5, §6.2; ETSI EN 187003, §5.2; AFL OSP Cable Design Guide, §6.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Microduct / air-blown fiber** → forward reference to Lesson 8 (drop vs. distribution vs. feeder — microduct is increasingly specified for last-mile FTTH distribution and drop infrastructure in greenfield builds)
- **Fill ratio** → Lesson 10 (compliance checklist — duct fill documentation is required as part of as-built records per ANSI/TIA-758-C §6.5)
- **Rollable ribbon (microduct context)** → previously introduced in Lesson 3; here it surfaces as the dominant high-density microduct fiber type — the two lessons are conceptually linked
- **Horizontal directional drilling (HDD)** → Lesson 10 (compliance checklist — HDD crossings require as-built depth documentation and may require bore log records per local AHJ)
- **Microtrench** → Lesson 10 (compliance checklist — microtrench depth and pavement restoration requirements are increasingly regulated by municipal right-of-way ordinances)
- **Multi-microduct bundle** → capacity planning concepts established here apply in Lesson 8 (distribution hierarchy — bundle sizing is a distribution-network design decision)
