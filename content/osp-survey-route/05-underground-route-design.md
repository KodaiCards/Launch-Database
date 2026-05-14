---
title: "Lesson 3.5: Underground Route Design — Burial Depth, Separation, Conduit Systems, and Handholes"
duration_min: 25
topic: osp-survey-route
order: 5
bicsi_alignment:
  - "OSP-DRD Ch. 6.1: Underground construction design"
  - "OSP-DRD Ch. 6.2: Conduit systems and duct banks"
sources:
  - "ANSI/TIA-758-C §6.1, §6.3 (underground OSP construction requirements)"
  - "NESC (National Electrical Safety Code) C2-2023, Rule 354"
  - "NEC (National Electrical Code) Chapter 9 (conduit fill tables)"
  - "BICSI OSP-DRD Manual, Ch. 6.1–6.2"
  - "RUS Bulletin 1751F-635 §3 (underground plant construction requirements)"
  - "FHWA Utility Accommodation Policy and Standards (public)"
---

# Underground Route Design — Burial Depth, Separation, Conduit Systems, and Handholes

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the minimum burial depths for OSP conduit in general ground, under roads, and under railroads per ANSI/TIA-758-C §6.3
- Identify the required horizontal separation distances from electrical conduit at different voltage levels per NESC Rule 354 and ANSI/TIA-758-C §6.1
- Select the appropriate conduit material for a given installation context (general burial, road bore, railroad crossing, heavy traffic load)
- Describe the NEC Chapter 9 conduit fill limit and apply it to a multi-cable conduit installation
- Explain the handhole and pull-box spacing rule and the function of marker tape in underground plant protection

---

## Reading Content

### Why Underground Routes Dominate Urban and Suburban OSP

In areas where aerial construction is impractical — dense urban corridors, underground utility districts, downtown business districts, subdivision developments where overhead utilities are prohibited — and in suburban and rural routes crossing paved roads and railroad tracks, underground conduit is the primary OSP infrastructure. Unlike direct-bury cable, a conduit route allows future cable replacement or capacity addition without re-trenching. This future-pull capability justifies the higher initial cost of conduit versus direct-bury for routes where growth is expected.

The engineering discipline of underground route design addresses four interconnected questions: How deep must the conduit be buried? How far must it be separated from other utilities? What material is appropriate for the application? And how is the route made accessible for pulling cable and future maintenance?

### Minimum Burial Depths

Burial depth requirements exist to protect underground conduit from surface loading, surface disturbance, and agricultural operations. ANSI/TIA-758-C §6.3 establishes the baseline depths for OSP telecommunications plant:

| Installation context | Minimum depth (ANSI/TIA-758-C §6.3) |
|---|---|
| General ground (not under road or railroad) | 24 in. (610 mm) |
| Under roads (paved or unpaved, any class) | 36 in. (914 mm) |
| Under railroads | 48 in. (1,219 mm) minimum; railroad permit may require more |
| In rocky ground where full depth is impractical | Reduced depth with reinforced protection (concrete cap, rigid steel casing) — AHJ approval required |

These are minimums. State DOT accommodation standards and railroad company specifications routinely exceed these minimums for bore crossings under their ROW. Always confirm the applicable agency requirement before finalizing drawings. RUS Bulletin 1751F-635 §3 aligns with the ANSI/TIA-758-C minimums for RUS-funded projects and adds a 48-inch minimum under railroads for conduit installations without casing. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-635 §3]

**Why 36 inches under roads?** Roads subject conduit to significantly higher dynamic loading — from vehicle axles, frost heave cycles in cold climates, and pavement maintenance operations (grinding, milling). At 36 inches, the conduit is below the typical pavement base course and frost depth in most NESC Medium and Light loading districts, reducing the load transmitted to the conduit to acceptable levels. At 24 inches, pavement maintenance equipment can transmit damaging point loads directly to the conduit. [ANSI/TIA-758-C §6.3; FHWA utility accommodation policy]

### Separation Requirements from Other Utilities

Underground OSP conduit sharing a right-of-way corridor with electrical utilities requires minimum horizontal separation to prevent electromagnetic interference, reduce the risk of simultaneous damage to both utilities during excavation, and satisfy NESC and ANSI/TIA requirements. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.1]

| Adjacent utility type | Minimum horizontal separation |
|---|---|
| Electrical conduit ≤ 50 V (e.g., signal cable, low-voltage control) | 12 in. (305 mm) |
| Electrical conduit > 50 V, ≤ 600 V (distribution secondary, service) | 12 in. (305 mm) per NESC Rule 354 |
| Electrical distribution primary (> 600 V, ≤ 35 kV) | 18 in. (457 mm) recommended; 12 in. NESC minimum |
| High-voltage transmission (> 35 kV) | Contact the utility — typically 36 in. or more required |
| Water and sewer mains | No NESC separation requirement; 12 in. good practice for maintenance access |
| Gas mains | No NESC requirement; 12 in. minimum per FHWA; local gas utility standards govern |

The horizontal separation is measured edge-to-edge between conduit outer surfaces. In congested urban ROW, achieving the required separation may require the designer to adjust the conduit depth to create vertical separation when horizontal separation cannot be maintained. Vertical separation with OSP conduit below the electrical utility is acceptable where horizontal cannot be maintained, provided the separation distance is preserved vertically. [ANSI/TIA-758-C §6.1; NESC C2-2023, Rule 354]

### Conduit Materials and Selection

The conduit material for an OSP installation is matched to the burial environment, traffic loading, and the installation method. Each material has different strengths and limitations.

**Schedule 40 PVC (polyvinyl chloride)**
The workhorse conduit for general OSP underground routes. Lightweight, low cost, easy to cut and join. Rated for burial use; compatible with standard OSP conduit fittings. Used where burial depths are adequate (24–36 in.) and road crossings are by open trench. Not recommended for direct bore under major roadways or railroads — wall thickness is insufficient for bore installation stress. [ANSI/TIA-758-C §6.1; BICSI OSP-DRD Manual, Ch. 6.1]

**Schedule 80 PVC**
Heavier wall than Schedule 40; required where impact resistance is needed at reduced burial depth (e.g., a rocky segment where full 24-in. depth cannot be achieved). Also required for risers above grade (exposed to UV and impact). Compatible with Schedule 40 fittings of the same trade size. [ANSI/TIA-758-C §6.1; NESC C2-2023, Rule 354]

**HDPE (high-density polyethylene)**
Used for directional bore installations. HDPE is flexible, resists the tensile and bending stresses of horizontal directional drilling (HDD), and has no joints in the bore section (HDPE is fused, not mechanically joined). Where a bore extends 100 feet or more under a road, HDPE is the standard material. Also used for preinstalled duct systems in new subdivision developments (HDPE innerduct bundles). [RUS Bulletin 1751F-635 §3; BICSI OSP-DRD Manual, Ch. 6.1]

**Rigid Galvanized Steel (RGS / RSC)**
Used where maximum mechanical protection is required: above-grade riser sections (first 8 feet above grade), bore segments under Class I railroads where the railroad specification requires rigid casing, and installations in aggressive soil environments where PVC may be subject to solvent attack from contaminated soil. Heavy, expensive, requires threaded joints. [NESC C2-2023, Rule 354; BICSI OSP-DRD Manual, Ch. 6.1]

### Duct Banks: Multiple Conduit in a Common Trench

Where a route carries multiple conduits (for different services, for different service directions, or for spare capacity), a duct bank — multiple conduits installed in a common trench — is more efficient than multiple separate trenches. Duct bank configurations typically arrange conduits in a rectangular grid, often encased in concrete for road crossings. [BICSI OSP-DRD Manual, Ch. 6.2]

Key duct bank design rules:

- **Concrete encasement** is required for road crossings where conduits are installed by open trench (not bore) at depths less than 36 inches, per most DOT accommodation standards. Concrete encasement distributes surface loads across all conduits and protects against pavement maintenance equipment.
- **Conduit separation within the duct bank:** Individual conduits within the bank should be separated by at least 3 inches of concrete to allow heat dissipation (from electrical conduits) and to prevent simultaneous damage from a single excavation strike. For fiber-only duct banks, spacing is less critical thermally but should still maintain clear conduit identity.
- **Spare conduits:** A minimum of one spare conduit (typically 4-inch HDPE or PVC) is included in duct bank designs for future use. RUS Bulletin 1751F-635 §3 recommends spare conduit for all RUS-funded underground routes.

### Handhole and Manhole Spacing

Underground conduit routes require accessible pull points for cable installation, maintenance, and future splicing. BICSI OSP-DRD Manual specifies that accessible pull points (handholes or manholes) must be provided at intervals not exceeding 500 feet along the conduit route, and at every change of direction greater than 45 degrees. [BICSI OSP-DRD Manual, Ch. 6.2]

**Handholes** (precast concrete or polymer-concrete boxes with traffic-rated covers) are used for pull points, low-count splice closures, and route direction changes in routes that do not require maintenance access by personnel entering the structure. Standard single-conduit handholes are 17×30 in. internal or similar; larger configurations for multi-conduit duct banks may be 24×36 in. or 36×48 in.

**Manholes** (personnel-entry structures, 36×48 in. or larger internal dimension) are required where crew members must enter the structure for splicing operations. Manholes require OSHA confined-space entry procedures and are used for high-count splice points on major network routes.

The 500-foot rule is a practical maximum — not a preferred spacing. Pull tension in a conduit increases with length, conduit fill, and number of bends. For routes with multiple conduit bends, handholes should be placed more frequently (every 200–300 feet between major direction changes) to keep cable-pulling tensions within the cable's installation rating. [BICSI OSP-DRD Manual, Ch. 6.2; ANSI/TIA-758-C §6.3]

### Conduit Fill and NEC Chapter 9

When multiple cables are pulled through a single conduit, the conduit fill ratio must be managed to allow cable installation without damage and to allow future cable addition or replacement. The National Electrical Code Chapter 9, Table 1 establishes a 40% maximum fill ratio for conduit containing two or more cables:

**Fill ratio = (Sum of cable cross-sectional areas) / (Conduit internal cross-sectional area)**

For a single cable, NEC Chapter 9 allows 53% fill; for two cables, 31%; for three or more, 40%. In OSP practice, the 40% limit for three-or-more cables applies to fiber optic cable installations where the conduit will receive multiple cable types over time.

**Practical application:** A 2-inch IPS conduit (Schedule 40 PVC, 2.047-inch nominal ID) has an internal cross-section of π × (1.0235)² = 3.29 in². At 40% fill, the usable cable area is 1.32 in². A standard 48-fiber ADSS cable with 0.55-inch OD has a cross-section of 0.237 in². Three such cables would require 0.711 in² — well within the 40% limit. Five cables would require 1.19 in² — still under the 1.32 in² limit. Six would require 1.42 in² — exceeding 40%. This calculation is performed during route design, not during cable installation. [NEC Chapter 9; BICSI OSP-DRD Manual, Ch. 6.2]

### Marker Tape and Warning Systems

All buried OSP conduit must be identified with a detectable marker tape placed 12 inches above the conduit during backfill. NESC Rule 354 requires marking of underground communication conductors; standard practice is a printed polyethylene warning tape reading "CAUTION — BURIED FIBER OPTIC CABLE" in high-visibility color (yellow for telecom/fiber). [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]

For routes in areas with high excavation risk, tracer wire (a 12-AWG copper wire running above the conduit) allows the route to be located with a cable locator instrument. Some jurisdictions require tracer wire for all non-metallic buried conduit. Tracer wire is connected to a test point at each handhole for locator access.

### The Bore vs. Open-Cut Decision for Road Crossings

When the underground route must cross a road, the installation method — bore or open trench — affects both the permit requirements and the design specifications.

**Open-cut** (open trench with pavement saw-cut, conduit installation, and pavement patch) is faster and less expensive, and is permitted by most local and county road agencies when traffic can be controlled and the pavement restoration is performed to agency standards. Most state DOT roads do not allow open-cut on primary or arterial routes — the pavement restoration standard is very high and bore is preferred.

**Bore** (horizontal directional drilling or pneumatic bore) leaves the pavement undisturbed, is required on Interstate and National Highway System routes, and is specified by most railroad permit applications. Bore requires that HDPE conduit be used (Schedule 40 PVC cannot withstand bore installation forces). Bore also requires sufficient soil conditions for the bore path — cohesive soils bore well; unstable sandy or gravelly soils may require HDD with a slurry to maintain the bore path. [ANSI/TIA-758-C §6.3; FHWA utility accommodation policy; BICSI OSP-DRD Manual, Ch. 6.1]

The bore vs. open-cut decision is finalized in consultation with the applicable road authority and documented in the permit application. Lesson 3.8 covers crossing permit requirements in full.

---

## Key Terms (Flashcard Candidates)

**Burial depth — general ground**
Minimum 24 in. (610 mm) below finished grade for OSP telecommunications conduit in general ground (not under paved road or railroad ROW), per ANSI/TIA-758-C §6.3. Depth is measured to the top of the outer conduit surface. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-635 §3]

**Burial depth — under roads**
Minimum 36 in. (914 mm) below the road surface for OSP conduit crossing or paralleling paved or unpaved roads. Required to provide adequate protection from dynamic pavement loading, frost heave, and maintenance equipment. State DOT standards may require greater depth. [ANSI/TIA-758-C §6.3; FHWA utility accommodation policy]

**Burial depth — under railroads**
Minimum 48 in. (1,219 mm) below top of rail for OSP conduit crossing railroad ROW, per ANSI/TIA-758-C §6.3 and RUS Bulletin 1751F-635 §3. Individual railroad company permit specifications frequently require additional depth or rigid casing. [ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-635 §3]

**Horizontal separation (OSP from electrical conduit)**
Minimum horizontal distance maintained between OSP telecommunications conduit and electrical power conduit, measured edge-to-edge. 12 in. for electrical ≤ 600 V (NESC Rule 354); 18 in. recommended for distribution primary (> 600 V). Protects against electromagnetic interference and simultaneous excavation damage. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.1]

**Schedule 40 PVC**
Standard conduit material for general OSP underground routes. Appropriate for burial depths ≥ 24 in. in non-traffic areas and open-trench road crossings ≥ 36 in. Not suitable for bore installations under major roads or railroads. [ANSI/TIA-758-C §6.1; BICSI OSP-DRD Manual, Ch. 6.1]

**HDPE (high-density polyethylene)**
Conduit material required for horizontal directional drilling (bore) installations. Flexible, fused-joint construction resists installation stresses. Also used for innerduct bundles in duct bank designs and preinstalled utility conduit in new construction. [RUS Bulletin 1751F-635 §3; BICSI OSP-DRD Manual, Ch. 6.1]

**Duct bank**
Multiple conduits installed in a common trench, typically arranged in a rectangular grid and concrete-encased for road crossings. Allows multiple services or future capacity in a single trench. Requires a minimum of one spare conduit per RUS Bulletin 1751F-635 §3. [BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-635 §3]

**Handhole**
A below-grade precast concrete or polymer pull box providing access to an underground conduit route without personnel entry. Required at maximum 500-ft intervals and at direction changes greater than 45 degrees. Used for cable pulling, low-count splicing, and route inspection. [BICSI OSP-DRD Manual, Ch. 6.2]

**Conduit fill ratio (40% rule)**
The maximum ratio of occupied cross-sectional area to total conduit internal area for three or more cables, per NEC Chapter 9 Table 1. At 40% fill, cables can be installed and removed without damaging each other or the conduit wall. Calculated at route design time, not during installation. [NEC Chapter 9; BICSI OSP-DRD Manual, Ch. 6.2]

**Marker tape**
Polyethylene warning tape placed 12 in. above buried conduit during backfill, printed with "CAUTION — BURIED FIBER OPTIC CABLE" or equivalent. Required by NESC Rule 354 and standard OSP practice to alert excavators to the presence of underground telecommunications plant. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.3]

---

## Interactive: Drag-and-Drop — Match Conduit Material to Scenario

*(In the course platform, the learner drags each conduit material card to the correct installation scenario. Shown here in text form.)*

| Scenario | Correct conduit material |
|---|---|
| 500-ft open-trench route through a suburban residential easement at 28 in. depth | Schedule 40 PVC |
| 180-ft bore under a state arterial highway | HDPE |
| Above-grade riser from grade to pole attachment, exposed to UV and vehicle impact risk | Schedule 80 PVC or Rigid Galvanized Steel |
| 80-ft bore under a Class I railroad, per railroad permit specification requiring rigid casing | Rigid Galvanized Steel (casing) with HDPE innerduct |
| Preinstalled duct bank in a new subdivision, 24 in. depth, with flexible routing around lot corners | HDPE innerduct bundles in PVC outer conduit |

---

## Interactive: Multiple-Choice Quiz

---

**Q1.** An OSP route includes a segment crossing a county gravel road under active agricultural use. The local county road department allows open-cut crossing with standard pavement restoration. What is the minimum conduit burial depth required under the road surface for this crossing per ANSI/TIA-758-C §6.3?

- A) 24 in. — the general ground minimum applies because the road is unpaved gravel
- B) 36 in. — the under-road minimum applies regardless of pavement type **[CORRECT]**
- C) 48 in. — all road crossings require the railroad-class depth as a conservative minimum
- D) 18 in. — reduced depth is permitted for gravel roads with concrete conduit encasement

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §6.3 specifies the 36-in. minimum for conduit "under roads" without a distinction between paved and unpaved surfaces. A gravel road with active agricultural and vehicle traffic transmits dynamic loads that require the same depth protection as a paved road. Applying the 24-in. general-ground minimum to a road crossing — even a gravel road — creates inadequate protection and likely violates the county road permit requirements as well. [ANSI/TIA-758-C §6.3]
- **B — Correct.** ANSI/TIA-758-C §6.3 requires a minimum of 36 in. (914 mm) burial depth for OSP conduit crossing or paralleling roads, regardless of whether the road is paved or gravel. The purpose of the increased depth is protection from surface vehicle loads, agricultural equipment, and road maintenance operations — all of which apply to a gravel farm road under active use. State DOT and county road standards may require more. [ANSI/TIA-758-C §6.3; FHWA utility accommodation policy]
- **C — Incorrect.** The 48-in. minimum applies specifically to railroad crossings, not to road crossings. Applying the railroad minimum to a road crossing is overly conservative and not required by ANSI/TIA-758-C or standard DOT accommodation policies. [ANSI/TIA-758-C §6.3]
- **D — Incorrect.** There is no reduced-depth provision for gravel roads in ANSI/TIA-758-C §6.3, NEC, or NESC. Concrete encasement addresses surface load distribution but does not substitute for adequate burial depth — it is an additional protection measure, not a depth reduction mechanism. [ANSI/TIA-758-C §6.3; NESC C2-2023, Rule 354]

---

**Q2.** A duct bank design for a suburban route includes three 4-inch HDPE conduits arranged side by side at 36-in. depth under a local road. The road crossing is 120 ft long. Which of the following design details is required by the applicable standards?

- A) Tracer wire only — no concrete encasement is needed for 4-inch HDPE conduits
- B) Concrete encasement of the duct bank for the road crossing, plus marker tape 12 in. above the conduit **[CORRECT]**
- C) Schedule 40 PVC replaces HDPE for concrete-encased duct banks — HDPE is incompatible with concrete encasement
- D) A handhole is required at each end of the 120-ft road crossing as a mandatory OSP access requirement

*Rationale:*
- **A — Incorrect.** Tracer wire is a locating aid, not a structural protection. For an open-cut duct bank road crossing at 36-in. depth, most DOT accommodation standards require concrete encasement to distribute surface loads and protect the conduits from pavement maintenance operations. Marker tape is separately required by NESC Rule 354. [NESC C2-2023, Rule 354; FHWA utility accommodation policy; BICSI OSP-DRD Manual, Ch. 6.2]
- **B — Correct.** For an open-trench road crossing duct bank, concrete encasement is required by most state DOT and county road accommodation standards to protect the conduits from surface loading and provide a tamper-resistant bearing surface for pavement restoration. Marker tape at 12 in. above the conduit is separately required by NESC Rule 354 as a warning to future excavators. Both requirements apply together. [NESC C2-2023, Rule 354; BICSI OSP-DRD Manual, Ch. 6.2; FHWA utility accommodation policy]
- **C — Incorrect.** HDPE is fully compatible with concrete encasement — it is the standard conduit material for bore installations and is used in concrete-encased duct banks where flexibility during installation is needed. PVC is also compatible with concrete encasement. The choice between HDPE and PVC is driven by installation method, not by concrete encasement compatibility. [BICSI OSP-DRD Manual, Ch. 6.1; RUS Bulletin 1751F-635 §3]
- **D — Incorrect.** The 500-ft handhole spacing rule is a maximum pull-section length, not a requirement for each end of every road crossing. A 120-ft crossing does not independently trigger a handhole requirement — handholes are placed at the pull-section intervals and direction changes, which may or may not align with road crossing endpoints. [BICSI OSP-DRD Manual, Ch. 6.2]

---

**Q3.** A conduit route will carry three fiber optic cables. Each cable has an outer diameter of 0.55 in. A 2-inch Schedule 40 PVC conduit has an internal diameter of 2.047 in. Does this installation comply with the NEC Chapter 9 conduit fill limit, and what is the calculated fill ratio?

- A) Yes — fill ratio is 21.6%, which is below the 40% maximum for three or more conductors **[CORRECT]**
- B) No — three cables in a single conduit always exceeds the fill limit regardless of cable size
- C) Yes — fill ratio is 40.5%, which rounds to 40% and is considered compliant
- D) No — fill ratio is 53.0%, which exceeds both the single-cable and multi-cable limits

*Rationale:*
- **A — Correct.** Cable cross-sectional area for each cable: A_cable = π × (0.275)² = π × 0.075625 = 0.2376 in². Three cables: 3 × 0.2376 = 0.7128 in². Conduit internal area: A_conduit = π × (1.0235)² = π × 1.0476 = 3.291 in². Fill ratio = 0.7128 / 3.291 = **0.2166 = 21.7%**. This is well below the NEC Chapter 9 40% maximum for three or more cables. The installation is compliant. [NEC Chapter 9; BICSI OSP-DRD Manual, Ch. 6.2]
- **B — Incorrect.** NEC Chapter 9 does not prohibit three cables per conduit; it limits the fill ratio. Whether three cables exceed the 40% limit depends entirely on the cable and conduit dimensions. Small-diameter cables in large conduit can meet the 40% limit with many more than three cables. [NEC Chapter 9]
- **C — Incorrect.** The calculated fill ratio for three 0.55-in. OD cables in a 2.047-in. ID conduit is 21.7%, not 40.5%. 40.5% would result from using a larger cable OD or a smaller conduit in the calculation — this answer reflects a calculation error. [NEC Chapter 9]
- **D — Incorrect.** 53% is the NEC Chapter 9 fill limit for a single cable in conduit, not the three-cable result for this configuration. The 53% single-cable limit does not apply here because there are three cables; the 40% multi-cable limit applies — and the calculated 21.7% is below it. [NEC Chapter 9]

---

## Final Check

Answer before proceeding to Lesson 3.6.

**Pulse 1.** A new underground route will run parallel to a 12-kV electrical distribution primary for 800 feet, then cross under a state highway. What are the minimum required horizontal separation from the electrical conduit and the minimum burial depth under the state highway?

*Expected answer:* For the 12-kV parallel segment (> 600 V distribution primary): minimum 18 in. horizontal separation, edge-to-edge, from the electrical conduit per ANSI/TIA-758-C §6.1 and good practice under NESC Rule 354. Under the state highway: minimum 36 in. burial depth per ANSI/TIA-758-C §6.3; the state DOT accommodation standard governs and may require more (confirm with the DOT permit office). [ANSI/TIA-758-C §6.1, §6.3; NESC C2-2023, Rule 354; FHWA utility accommodation policy]

**Pulse 2.** Explain the difference between a handhole and a manhole in underground OSP, and identify the maximum spacing rule that applies to both.

*Expected answer:* A **handhole** is a non-entry below-grade pull box used for cable pulling, route direction changes, and low-count splice closures. No personnel entry is required. A **manhole** is a personnel-entry structure (minimum 36×48 in. internal) used where crew must enter to perform splicing on high-count cables. Both types serve as accessible pull points in an underground route. BICSI OSP-DRD Manual specifies a maximum pull-section length of 500 ft between accessible pull points (handholes or manholes); pull points are also required at direction changes greater than 45 degrees. In practice, direction changes and conduit fill tension calculations often require closer spacing than the 500-ft maximum. [BICSI OSP-DRD Manual, Ch. 6.2; ANSI/TIA-758-C §6.3]

---

## Glossary Cross-References

- **Burial depth / separation** → Lesson 3.6 (direct-bury route design — depth requirements for cable without conduit); Lesson 3.8 (crossings — road and railroad crossing depths for bore installations)
- **HDPE / bore conduit** → Lesson 3.8 (crossings — HDPE is the required material for road and railroad bore crossings)
- **Conduit fill ratio** → Lesson 3.9 (splice point placement — conduit fill at splice locations affects future cable add operations)
- **Handhole spacing / pull-section length** → Lesson 3.9 (splice point placement — splice closures locate at handholes along the pull-section plan); Lesson 3.10 (construction drawings — handhole positions are key drawing elements on the plan sheet)
- **Marker tape / tracer wire** → Lesson 3.6 (direct-bury — marker tape also required above direct-bury cable); Lesson 3.12 (as-built documentation — marker tape and tracer wire must be documented in as-built records)
- **Duct bank** → Lesson 3.10 (construction drawings — duct bank cross-section appears on detail sheets); Lesson 3.11 (route permitting — road crossing permits specify duct bank and encasement requirements)
