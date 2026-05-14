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

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the three primary OSP installation environments and the cable variants designed for each
- Describe the mechanical function of armor in direct-bury and rodent-resistant designs
- Distinguish between lashed aerial and ADSS (all-dielectric self-supporting) cable and identify the NESC loading conditions each must satisfy
- Select the correct cable variant for a given combination of installation environment, burial depth, rodent pressure, and span geometry

---

## Reading Content

### Three Environments, Three Design Families

OSP fiber cable must survive wherever the network runs — buried under soil, suspended between poles across wind and ice loads, or pulled through conduit systems shared with other utilities. No single cable design is optimized for all three environments. Instead, three distinct variant families have evolved, each engineered to the mechanical demands of its deployment:

1. **Direct-bury cable** — designed to withstand compressive burial forces, frost heave, soil chemistry, groundwater, and rodent attack without the protection of conduit
2. **Aerial cable** — designed to support its own weight (and ice/wind loads) across spans between poles, either self-supporting or lashed to a steel messenger wire
3. **Conduit cable** — the "baseline" loose-tube design from Lesson 2; no armor needed because the conduit provides mechanical protection

Understanding the mechanical threat profile of each environment drives every variant selection decision.

### Direct-Bury Cable: Mechanical Threats and Armor Options

A cable buried directly in native soil without conduit faces forces that a conduit-protected cable never encounters:

- **Compressive load from soil overburden:** A trench backfilled with compacted native soil exerts lateral and vertical pressure on the cable. Rocky or clay-heavy soils increase compressive stress significantly. Without protection, the sheath and buffer tubes deform under sustained load, inducing microbend losses. [IEC 60794-3, §5.1]
- **Frost heave:** In freeze-thaw climates, soil water expands 9% on freezing. Cables buried above the frost line undergo cyclic lateral and tensile stress as surrounding soil moves. Burial depth at or below the local frost line (typically 18–36 inches in USDA climate zones 4–6) mitigates this, but cable construction still must tolerate the forces encountered before depth requirements are met in all soil types. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.2]
- **Rodent attack:** Burrowing rodents — gophers, moles, squirrels, and in some regions termites — attack cable sheaths for nesting material or simply as an obstacle. A standard PE sheath provides no meaningful resistance to sustained gnawing. Rodent damage is one of the leading causes of OSP cable plant failure in rural environments with high burrowing-rodent pressure. [AFL OSP Cable Design Guide, §5.2; Corning OSP Reference, §5.1]

**Armor types for direct-bury:**

**Corrugated steel tape (CST) armor:** A steel tape formed into a corrugated shape and applied longitudinally around the cable core under the outer PE sheath. Corrugation allows the tape to flex around bends without kinking while providing continuous hoop strength. CST armor is the standard direct-bury protection method. It resists compressive soil loads, rodent gnawing (steel is an effective deterrent), and provides secondary cable containment in the event of sheath damage [IEC 60794-3, §5.3; ANSI/TIA-758-C §5.6]. The steel layer is grounded at each splice closure and cable end through the bonding and grounding system (Lesson 10 covers this in detail under NESC bonding requirements).

**Interlocked armor (wire armor):** Individual round steel wires wound helically around the cable core, providing higher crush resistance than corrugated tape. Heavier and more expensive; specified for installations with extreme compressive loads (rock-dominated trenches, road crossing bore pits, heavy equipment traffic overhead). Less common than corrugated tape for standard agricultural or residential direct-bury. [IEC 60794-3, §5.4]

**Dielectric armor (non-metallic armor):** Fiberglass tape or woven fiberglass wrap applied under the outer sheath. Provides compressive load resistance and limited rodent deterrence without the conductivity of steel armor. Specified for routes near electrical infrastructure where metallic armor would create a ground-fault hazard, or for ultra-rural areas where lightning-induced step-potential on a grounded steel armor is a concern. [ANSI/TIA-758-C §5.6.2; IEEE 1222 §4.2]

**Dual-sheath direct-bury (MDPE over corrugated steel over flooding compound):** The full direct-bury protection stack:
1. Inner flooding compound fill around buffer tubes (water block at tube level)
2. Water-swellable tape wrap around the tube bundle (secondary water block at cable core level)
3. Corrugated steel tape armor
4. Outer PE sheath (UV and soil-chemistry barrier)

This four-layer system — core gel, core water-block tape, steel armor, PE sheath — is the standard for high-priority direct-bury routes in agricultural and suburban environments [ANSI/TIA-758-C §5.3; Corning OSP Reference, §5.2].

**Minimum burial depth (ANSI/TIA-758-C §6.3):**

| Installation context | Minimum burial depth |
|---|---|
| Normal soil (no road crossing) | 24 inches (610 mm) |
| Under roads, streets, highways | 36 inches (914 mm) |
| Under railroads | Contact railroad owner for specification (typically 48+ inches) |
| Rocky or ledge terrain | 12 inches (305 mm) minimum + 3 inches of sand bedding |

Note: these are ANSI/TIA-758-C minimums. NESC Rule 354 and local authority having jurisdiction (AHJ) may require greater depth. Always check local requirements before trenching. [ANSI/TIA-758-C §6.3; NESC C2-2023, Rule 354]

### Aerial Cable: Lashed vs. Self-Supporting

Aerial installation — running cable between poles or strand towers without underground burial — is the fastest and least excavation-intensive OSP installation method. It is also mechanically the most demanding on the cable, which must sustain its own weight plus environmental loads across spans that can reach 200–350 feet (60–107 m) between poles [NESC C2-2023, Rule 230].

Two aerial cable families serve OSP fiber:

**Figure-8 / Lashed Aerial Cable:**

The traditional approach uses a separate **messenger wire** — a pre-installed galvanized steel or aluminum alloy strand that runs along the pole line — and lashes the fiber cable to it using a stainless steel lashing wire wound helically around both the messenger and the fiber cable. The fiber cable carries no longitudinal tension; the messenger handles all catenary load. This separation of structure (messenger) from signal (fiber cable) allows the fiber cable itself to be a standard loose-tube OSP design — typically gel-filled with PE sheath and dielectric central strength member [BICSI OSP-DRD Manual, Ch. 6.3].

Some figure-8 cable designs integrate the messenger into the cable jacket: the cable cross-section has a figure-8 shape, with one lobe being the fiber core and the other being the integral steel messenger. This eliminates the separate lashing step but makes the cable heavier per unit length than a lashed system.

Messenger wire selection is governed by **NESC Table 235-5** for required breaking strength by span length and NESC loading district (light, medium, heavy, or extreme). At minimum, the messenger must support twice the cable's weighted-span load under heavy ice loading conditions [NESC C2-2023, Rule 235G].

**ADSS — All-Dielectric Self-Supporting:**

ADSS cable eliminates the messenger wire entirely. The cable is self-supporting through **aramid yarn (Kevlar) or fiberglass rod strength members** integrated into the cable design. These strength members run parallel to the fiber core under the sheath and carry the catenary tension directly. The cable is entirely non-metallic — no steel messenger, no armor — making it suitable for installation on energized electrical transmission lines where a metallic messenger would introduce safety hazards and require bonding/grounding at every attachment point [IEEE 1222; ANSI/TIA-758-C §5.6.3].

ADSS design parameters are span-dependent. A cable designed for a 100-foot (30 m) span has different aramid loading than one designed for a 600-foot (183 m) span. Key specifications:
- **Maximum allowable tension (MAT):** The tension the cable can sustain continuously without exceeding safe fiber bend radius. Specified by the manufacturer per span length and loading district.
- **Every Day Stress (EDS):** The design stringing tension at average everyday temperature (typically 15°C), expressed as a percentage of rated tensile strength (RTS). NESC and IEEE 1222 recommend EDS ≤ 20–25% RTS to limit fatigue. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]
- **Span sag:** The vertical drop at mid-span under EDS conditions. Minimum ground clearance must comply with NESC Rule 232 for the crossing type (roadway, railway, water, etc.).

ADSS is specified on routes where:
- The pole line already carries electrical distribution (0–69 kV range); a metallic messenger would require expensive bonding hardware at every pole
- Long spans between poles make messenger stringing impractical or costly
- The network owner prefers a fully dielectric (lightning-tolerant) plant

Lashed aerial is specified where:
- Messenger strand is already in place from a prior installation
- Span lengths are short to medium and the pole line is free of electrical conductors
- Budget favors a lighter fiber cable attached to existing infrastructure

**Ice and wind loading by NESC district:**

NESC C2-2023 divides the United States into three loading districts (light, medium, heavy) plus an "extreme wind" zone for coastal areas. Each district specifies the design radial ice thickness and wind pressure that aerial cable and messenger must survive without exceeding sag-to-clearance limits [NESC C2-2023, Rules 250 and 251]. Cable and messenger/ADSS sag tables are provided by manufacturers for each NESC district — design engineers select cable and clamp hardware from these tables for the specific span and district.

### Conduit Cable: The Baseline

Conduit-installed cable operates in a protected mechanical environment: the conduit handles crush loads, frost heave forces, and rodent attack, leaving the cable itself free of those burdens. The standard OSP loose-tube cable from Lesson 2 (gel-filled, PE sheath, GRP central strength member) is fully appropriate for conduit installation without armor [ANSI/TIA-758-C §5.3].

The primary mechanical concern for conduit-installed cable is **installation pulling tension and sidewall pressure.** Excessive pulling tension during installation elongates the cable, potentially placing the fiber in tension (fiber is fragile in tension). Excessive sidewall pressure on bends (where the cable presses against the conduit wall) induces microbend stress at the contact point.

Maximum pulling tension is limited by the cable's rated tensile load (RTL), typically **2,700 N (600 lbf)** for standard OSP cable. Sidewall pressure is limited by the cable's rated sidewall load (RSL), typically **220 N/m (15 lbf/ft)** [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]. These limits govern the use of pulling lubricant, the number of bends per pull, and whether intermediate pull points are required.

### Selecting the Variant: Decision Summary

| Environment | Recommended variant | Key standard |
|---|---|---|
| Direct-bury, normal soil | Loose-tube, CST armor, gel-fill, PE sheath | ANSI/TIA-758-C §5.6 |
| Direct-bury, high rodent pressure | Loose-tube, CST or wire armor + inner duct | ANSI/TIA-758-C §5.6; AFL §5.2 |
| Direct-bury, near electrical infra | Dielectric armor, PE sheath, no steel | ANSI/TIA-758-C §5.6.2 |
| Conduit (general) | Loose-tube, no armor, PE sheath | ANSI/TIA-758-C §5.3 |
| Aerial, no electrical crossings | Lashed (loose-tube + messenger) | NESC C2-2023, Rule 235 |
| Aerial, on electrical pole line | ADSS, span-rated, fully dielectric | IEEE 1222; NESC C2-2023 |
| Aerial, long span (300+ ft) | ADSS, heavy-duty aramid loading | IEEE 1222 §5.2 |

---

## Key Terms (Flashcard Candidates)

**Corrugated steel tape (CST) armor**
A longitudinally applied, corrugated steel tape under the outer sheath that provides crush resistance and rodent deterrence in direct-bury OSP cable. Electrically conductive; must be bonded and grounded at splice closures and cable ends per NESC requirements. [IEC 60794-3, §5.3; ANSI/TIA-758-C §5.6]

**Dielectric armor**
Non-metallic armor (fiberglass tape or woven wrap) used in direct-bury cable where steel armor would create electrical hazards. Provides mechanical protection without conductivity; no bonding/grounding required. [ANSI/TIA-758-C §5.6.2]

**Messenger wire**
A pre-installed galvanized steel or aluminum alloy strand on an aerial pole line that carries the catenary load of lashed optical cable. The fiber cable attaches to the messenger with a stainless steel lashing wire. [NESC C2-2023, Rule 235G]

**ADSS (All-Dielectric Self-Supporting)**
Aerial cable that supports its own catenary load via integrated aramid or fiberglass strength members, without a separate messenger wire. Fully non-metallic; appropriate for installation on energized electrical pole lines. [IEEE 1222; ANSI/TIA-758-C §5.6.3]

**Every Day Stress (EDS)**
The aerial cable or messenger design stringing tension at average everyday temperature, expressed as a percentage of rated tensile strength (RTS). NESC and IEEE 1222 recommend ≤20–25% RTS to limit fatigue damage over the service life. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Rated tensile load (RTL)**
The maximum pulling tension applicable during cable installation, set by the manufacturer to protect fiber from tensile strain. Standard OSP loose-tube cable: ~2,700 N (600 lbf). Exceeding RTL risks fiber damage even if sheath appears intact. [ANSI/TIA-758-C §6.2]

**Sidewall pressure / rated sidewall load (RSL)**
The radial force a cable exerts on the inner wall of a conduit at a bend. Expressed as tension × (1/bend radius). Limit: ~220 N/m (15 lbf/ft) for standard OSP cable. Exceeding RSL induces microbend loss at the contact point. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]

**Frost heave**
Cyclic vertical and lateral soil movement caused by water freezing in the soil column. Cables above the frost line experience cyclic tensile and compressive stress as the surrounding soil expands (freezing) and contracts (thawing). Burial at or below the local frost line mitigates but does not fully eliminate exposure. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.2]

**Lashing wire**
Stainless steel wire wound helically around both the messenger strand and the aerial fiber cable, binding the cable to the messenger. Lashing provides the mechanical attachment that transfers catenary load from the cable weight to the messenger. [BICSI OSP-DRD Manual, Ch. 6.3]

**NESC loading district**
Geographic classification used in NESC C2-2023 to define the design radial ice thickness and wind pressure for aerial line engineering. Three primary districts: light, medium, heavy. Coastal areas may have additional extreme-wind designations. [NESC C2-2023, Rules 250–251]

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
2. 3-mile direct-bury through agricultural land with documented gopher activity
3. 1.2-mile lashed aerial run on a municipal electric utility pole line (7.2 kV energized)
4. 500-foot aerial crossing on a dedicated fiber pole line, messenger already installed
5. 400-foot direct-bury under a state highway with heavy truck traffic and compacted subgrade
6. 2-mile direct-bury through a rural field with sandy loam soil, no documented rodent pressure

**Correct matches:** A→1, B→6, C→3, D→4, E→3 (dielectric armor as alternative), F→5

**Drag-and-drop mechanic:** Learner drags each cable icon to its deployment environment box. Multiple correct pairings are possible for some environments (designer note: accept C or E for environment 3). Correct placement highlights green; incorrect highlights red with one-sentence rationale.

---

## Multiple-Choice Quiz

---

**Q1.** A direct-bury fiber cable in an agricultural area has experienced three sheath failures attributed to gopher gnawing over five years. What cable upgrade is most appropriate for the replacement installation?

- A) Replace with a tight-buffer cable — tight-buffer construction resists gnawing better than loose-tube
- B) Install the same cable in Schedule 40 PVC conduit
- C) Replace with a loose-tube cable with corrugated steel tape armor and heavy-duty PE outer sheath **[CORRECT]**
- D) Increase the burial depth to 48 inches — rodents do not burrow below 36 inches

*Rationale:*
- **A — Incorrect.** Tight-buffer cable is not appropriate for direct burial regardless of gnawing pressure. Its construction lacks tube-level water blocking and mechanical burial protection; it fails for installation-environment reasons before rodent resistance becomes relevant. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]
- **B — Acceptable but not the optimal answer.** Conduit enclosure does protect against gnawing, but Schedule 40 PVC is itself gnawable by gophers in a sustained attack. More importantly, retrofitting conduit to an existing direct-bury route requires excavating the entire alignment — high cost. The cable upgrade is the more targeted and cost-effective solution where the route is otherwise serviceable. [AFL OSP Cable Design Guide, §5.2]
- **C — Correct.** Corrugated steel tape (CST) armor provides an effective mechanical barrier against rodent gnawing. Steel is not digestible and discourages sustained gnawing; most burrowing rodents will abandon the cable as an obstacle rather than penetrate the steel layer. The heavy-duty PE outer sheath provides UV and soil-chemistry protection. CST armor is the standard industry solution for documented rodent-pressure environments per ANSI/TIA-758-C §5.6 and AFL OSP Cable Design Guide §5.2. [ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]
- **D — Incorrect.** Pocket gophers (Geomys and Thomomys spp.) routinely burrow to 24–36 inches, and in some soil types to 60 inches. There is no universally safe burial depth below which rodent activity cannot reach cable. Depth alone is not a reliable rodent mitigation strategy. [AFL OSP Cable Design Guide, §5.2; Corning OSP Reference, §5.1]

---

**Q2.** An OSP engineer is designing a 750-foot aerial fiber span on a rural electric cooperative distribution line carrying 13.2 kV. Which cable type is required?

- A) Lashed aerial, with galvanized steel messenger and standard loose-tube fiber cable
- B) Figure-8 cable with integral steel messenger
- C) ADSS cable, span-rated for 750 feet in the applicable NESC loading district **[CORRECT]**
- D) Direct-bury armored cable run along the pole line on a cable hook attachment

*Rationale:*
- **A — Incorrect.** A galvanized steel messenger on an energized 13.2 kV line creates a continuous metallic conductor running parallel to and in proximity to the energized conductors. It must be bonded to ground at every attachment point and creates a hazard for installation and maintenance crews. On energized distribution pole lines, an all-dielectric solution is required. [NESC C2-2023, Rule 235G; IEEE 1222]
- **B — Incorrect.** Figure-8 cable with an integral steel messenger has the same hazard as Option A — the steel messenger is a metallic element on an energized line. [NESC C2-2023, Rule 235G]
- **C — Correct.** ADSS is the required cable type for aerial installation on energized electrical distribution lines. The fully dielectric construction (aramid or fiberglass strength members, no metallic elements) eliminates the grounding and bonding requirements and crew safety hazards associated with metallic messengers. The cable must be rated for the span length (750 feet) and the NESC loading district applicable to the geography. [IEEE 1222; ANSI/TIA-758-C §5.6.3; NESC C2-2023, Rule 230]
- **D — Incorrect.** Running a cable along a pole line on cable hooks is not an aerial installation method — it creates a cable laying on pole hardware that is neither supported in catenary nor protected from wind-induced movement, UV exposure, and vandalism. This is not an accepted OSP installation practice. [BICSI OSP-DRD Manual, Ch. 6.3]

---

**Q3.** A cable is being pulled through a 4-inch conduit with three 90-degree bends over a 1,200-foot route. The cable has a rated tensile load (RTL) of 2,700 N and a rated sidewall load (RSL) of 220 N/m. During the pull, the tension gauge at the pulling end reads 2,100 N and the calculated sidewall pressure at the tightest bend (radius: 10 feet) is 190 N/m. Should the pull proceed?

- A) No — the pulling tension exceeds the cable's RTL
- B) Yes — both tension and sidewall pressure are within the cable's rated limits **[CORRECT]**
- C) No — the sidewall pressure exceeds the RSL
- D) Yes — but only if additional lubricant is applied at each bend to bring tension below 1,500 N

*Rationale:*
- **A — Incorrect.** The pulling tension of 2,100 N is below the RTL of 2,700 N. RTL has not been exceeded. The cable is within specification on the tension parameter. [ANSI/TIA-758-C §6.2]
- **B — Correct.** Pulling tension (2,100 N) is below the RTL (2,700 N), and sidewall pressure (190 N/m) is below the RSL (220 N/m). Both critical parameters are within the cable manufacturer's rated limits. The pull may proceed. Good practice would still be to monitor tension continuously during the pull and stop if tension rises toward RTL, and to use conduit lubricant to reduce friction on long pulls with multiple bends. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]
- **C — Incorrect.** The sidewall pressure of 190 N/m is below the RSL of 220 N/m. The RSL has not been exceeded. [ANSI/TIA-758-C §6.2]
- **D — Incorrect.** There is no standard requirement to reduce tension below 1,500 N — this figure does not appear in ANSI/TIA-758-C or any standard cited in this lesson. The RTL is the limiting specification, and the pull is within it. Adding lubricant is good practice for long runs to reduce friction-driven tension increases, but it is not required at the measured 2,100 N tension. [ANSI/TIA-758-C §6.2]

---

**Q4.** What does "Every Day Stress (EDS)" describe for an ADSS cable installation, and why is it limited to 20–25% of Rated Tensile Strength?

- A) The maximum tensile load the cable can sustain during severe ice storm conditions, limited to prevent fiber breakage
- B) The design stringing tension at average everyday temperature, limited to prevent fatigue damage and ensure adequate sag margins over the cable service life **[CORRECT]**
- C) The tension applied during cable installation, limited to protect the installer from overloading the pulling equipment
- D) The rated sidewall pressure, limited to prevent microbend losses where the cable contacts attachment hardware at each pole

*Rationale:*
- **A — Incorrect.** Ice storm loading produces tensions above EDS — that is the purpose of the safety factor built into the EDS limit. The cable must survive ice loading above EDS; EDS is the everyday operating condition, not the extreme condition. [IEEE 1222 §5.2; NESC C2-2023, Rule 250]
- **B — Correct.** EDS is the stringing tension applied to the cable at the average everyday temperature (typically 15°C), which becomes the sustained operating tension across most of the cable's service life. Limiting EDS to 20–25% of Rated Tensile Strength (RTS) provides two benefits: (1) sufficient margin to absorb additional tension from ice loading and wind without exceeding the cable's structural limits; and (2) prevention of aeolian vibration fatigue — at high sustained tensions, wind-induced vibrations (Aeolian resonance) cause fatigue damage in the aramid strength members over years of service. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]
- **C — Incorrect.** EDS is not an installation tension limit — it is the design stringing tension based on weather loading calculations for the installation geography. The installer sets sag to achieve the calculated EDS target at the stringing temperature, using sag-tension tables specific to the cable and span. [IEEE 1222 §5.2]
- **D — Incorrect.** Sidewall pressure and RSL are conduit-installation concepts (Lesson 2 and §6.2 of this lesson). They do not apply to aerial cable; aerial cable contacts pole attachment hardware at discrete points (clamps), not along a continuous conduit bore. [ANSI/TIA-758-C §6.2]

---

**Q5.** A 36-fiber OSP cable was direct-buried along a rural road in 1988 with no armor. The route is now being upgraded to 288 fibers. The trench will be reopened. Which product specification should the replacement cable meet, and why?

- A) Same unarmored PE-sheath design as the original — the 1988 cable survived, proving the soil environment is benign
- B) ANSI/TIA-758-C §5.6 armored direct-bury cable with corrugated steel tape — upgrade depth and protection to current standards **[CORRECT]**
- C) Tight-buffer indoor cable — the new fiber count reduces the need for OSP-grade construction
- D) ADSS cable — the aerial variant is easier to service than a buried plant

*Rationale:*
- **A — Incorrect.** Cable survival over 36 years proves the sheath has not catastrophically failed — it does not prove the environment is benign or that the original specification was adequate. 1988 cable technology predates current ANSI/TIA-758-C direct-bury requirements. The new cable should be specified to current standards. Additionally, with a 36-year-old trench open, the burial depth may not meet current ANSI/TIA-758-C §6.3 minimums; depth should be verified and corrected during the upgrade. [ANSI/TIA-758-C §5.6, §6.3]
- **B — Correct.** Any new direct-bury OSP cable installation — including replacement plant — should meet ANSI/TIA-758-C §5.6. For a rural road route (vehicle traffic overhead, unknown soil-chemistry from road salt application, potential rodent activity), CST armor provides appropriate protection. The 288-fiber count justifies the more robust design: the investment in the new fiber plant is larger, and the consequence of a future cable failure more severe. [ANSI/TIA-758-C §5.6; BICSI OSP-DRD Manual, Ch. 6.2]
- **C — Incorrect.** Fiber count has no bearing on construction type suitability for the environment. Tight-buffer cable is never appropriate for direct burial regardless of fiber count. [ANSI/TIA-758-C §5.2; BICSI OSP-DRD Manual, Ch. 5.3.3]
- **D — Incorrect.** Aerial cable cannot substitute for direct-bury cable without a completely different infrastructure (poles, attachments, right-of-way). The trench is already open; the economical choice is to install a properly specified buried cable. Aerial installation of a replacement network alongside an existing buried route is an unusual and expensive design choice with no standard justification. [BICSI OSP-DRD Manual, Ch. 6.1]

---

**Q6.** Which NESC rule establishes the minimum burial depth for OSP fiber optic cable under a public roadway?

- A) NESC Rule 235 (aerial line clearances)
- B) NESC Rule 354, with ANSI/TIA-758-C §6.3 establishing the TIA minimum of 36 inches **[CORRECT]**
- C) NEC Article 770 (indoor optical fiber cable)
- D) NESC Rule 230 (loading of aerial conductors)

*Rationale:*
- **A — Incorrect.** NESC Rule 235 governs the mechanical design of aerial lines — conductor clearance, sag limits, attachment hardware. It does not address burial depths for underground cable. [NESC C2-2023, Rule 235]
- **B — Correct.** NESC Rule 354 addresses the installation of underground optical fiber cable and its protection requirements, including burial depth. ANSI/TIA-758-C §6.3 establishes the TIA minimum burial depth for OSP fiber under roadways at **36 inches (914 mm)**. The more stringent of the applicable standard and local AHJ requirement governs. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]
- **C — Incorrect.** NEC Article 770 governs indoor (premises) optical fiber cable installation — flame ratings, separation from other systems, conduit requirements inside buildings. It does not address OSP burial depths. [NEC Article 770]
- **D — Incorrect.** NESC Rule 230 governs loading requirements for aerial conductors and cables — ice, wind, and their combined effects on overhead line design. It does not address burial depths. [NESC C2-2023, Rule 230]

---

## Final Check

Answer before proceeding to Lesson 5 (Microduct & Air-Blown Fiber).

**Pulse 1.** Explain why corrugated steel tape (CST) armor requires bonding and grounding at each splice closure, and what happens if the bonding is omitted.

*Expected answer:* CST armor is a continuous metallic conductor running the length of the cable. It can accumulate charge from induced currents (from nearby power lines), lightning strikes, or static buildup in dry soil. If the armor is not bonded and grounded at splice closures and cable ends, it floats at an unpredictable potential. A technician opening a splice closure who contacts the ungrounded armor can receive an electric shock. A lightning strike to the cable route can cause the armor to discharge through the splice closure hardware, damaging the fiber in the closure and potentially injuring the crew. NESC bonding requirements mandate that metallic armor be continuously bonded to a ground electrode system at each accessible point. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]

**Pulse 2.** A telecom engineer specifies ADSS cable for a 200-foot span in a NESC "heavy" loading district. The cable manufacturer's sag-tension table shows an EDS of 18% RTS at 15°C. Is this within the IEEE 1222 recommendation, and what is the significance of EDS for long-term cable reliability?

*Expected answer:* Yes — 18% RTS is within the IEEE 1222 recommended limit of ≤20–25% RTS for EDS. The significance for long-term reliability is twofold: (1) **structural margin** — at 18% RTS under everyday conditions, the cable has substantial remaining capacity to absorb additional tension from ice (NESC heavy district: 0.5-inch radial ice at 0°F) and wind without approaching the breaking load; (2) **fatigue resistance** — Aeolian vibration (wind-induced resonance) is driven by the cable's sustained tension. At 18% RTS, the cable is strung with enough sag that vibration amplitude is limited; at higher EDS values, the cable is tighter, vibration amplitude increases, and repeated flex fatigue in the aramid strength members accumulates more rapidly. Both considerations make EDS management critical for a 20+ year service life. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Pulse 3.** An OSP crew is pulling a 144-fiber cable through a conduit and the tension gauge reaches 3,100 N. The cable's RTL is 2,700 N. What should the crew do, and what is the likely consequence if pulling continues?

*Expected answer:* **Stop the pull immediately.** Tension exceeding the RTL (2,700 N) places the fiber in tension beyond its design specification. Optical fiber is mechanically strong in compression and laterally, but weak in tension — tensile strain causes microcracks to propagate at the fiber surface, reducing long-term fatigue life and potentially causing fiber fracture during or after the pull. If pulling continues: (1) some fibers may fracture during the pull (detected as a complete break on OTDR); (2) fibers that survive the pull may have reduced mechanical margin and fail prematurely years later under thermal cycling or soil movement forces. The correct remediation: assess the conduit for obstructions (debris, collapsed sections, tight bend radius), add a pull-assist point at a mid-route hand-hole, re-lubricate the conduit, and attempt the pull again at controlled tension. [ANSI/TIA-758-C §6.2; AFL OSP Cable Design Guide, §5.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **CST armor / bonding and grounding** → Lesson 10 (compliance checklist — NESC bonding requirements at splice closures; CST armor bonding is an explicit checklist item in ANSI/TIA-758-C §6.4)
- **ADSS / EDS / messenger** → forward reference to Lesson 8 (feeder vs. distribution hierarchy — feeder cable on aerial routes is almost always ADSS on energized utility pole lines in rural cooperative territory)
- **NESC loading district** → Lesson 10 (compliance checklist — installation records must document the applicable NESC loading district and confirm cable and hardware rating compliance)
- **Rated tensile load (RTL) / sidewall pressure (RSL)** → Lesson 6 (sheath options — sheath material choice affects RTL and RSL; MDPE vs. HDPE sheath compounds)
- **Burial depth minimums** → Lesson 10 (compliance checklist — as-built burial depth must be documented and filed)
- **Dielectric armor** → forward reference to Lesson 10 (compliance checklist — dielectric cable near electrical infrastructure affects NESC bonding requirements; no ground electrode required for fully dielectric cable)
