# OSP Topic 7 — Installation Techniques: Discovery

> Scope: read-only content scoping for Topic 7 of the OSP training curriculum.
> Aligned to BICSI OSP-DRD Domain 9 — Installation Techniques.
> Template follows Topics 1–3 and 5 structure. Estimated 6–8 hrs (~14–16 lessons).

---

## 15-Lesson Outline

| # | Lesson Title | Est. Duration | Best Interactive Types |
|---|---|---|---|
| 7.1 | Aerial Installation Overview: Sequence, Crew Roles, and Safety Zones | 20 min | Flashcards (sequence terms, crew roles), multiple-choice |
| 7.2 | Messenger and Lashing Machine Operation: Stringing, Tensioning, and Dead-End Wraps | 30 min | Drag-drop (stringing sequence), flashcards, multiple-choice |
| 7.3 | ADSS Self-Supporting Installation: Sag-Tension Execution, Sagging Equipment, and Span Checks | 30 min | Scenario (verify sag against design table for given span/temp), flashcards, multiple-choice |
| 7.4 | Make-Ready Execution: Pole Replacement, Transfer Sequences, and Loading Calculations | 25 min | Scenario (determine make-ready scope from pole loading calc), drag-drop (transfer sequence steps), multiple-choice |
| 7.5 | Stringing Equipment: Reel Stands, Tensioners, Pulling Lines, and Roller Systems | 25 min | Drag-drop (label stringing equipment setup), flashcards, multiple-choice |
| 7.6 | Trenching and Open-Cut Underground Installation | 25 min | Flashcards (trench requirements, backfill specs), scenario (select method for mixed-material route segment), multiple-choice |
| 7.7 | Vibratory Plow and Static Plow: Direct-Bury Execution and Cable Tension Limits | 25 min | Flashcards (plow types, tension limits, depth checks), multiple-choice |
| 7.8 | Horizontal Directional Drilling (HDD): Bore Plan, Pilot Hole, Reaming, and Pull-Back | 30 min | Scenario (size bore profile for conduit OD + soil class), flashcards, multiple-choice |
| 7.9 | Missile Boring and Impact Moling: Soil Requirements and Limitations | 20 min | Flashcards (bore tool types, soil suitability, max run lengths), multiple-choice |
| 7.10 | Conduit Installation: Rigid PVC, HDPE, and Innerduct — Pull Methods and Mandrel Testing | 25 min | Drag-drop (conduit prep and pull sequence), flashcards, multiple-choice |
| 7.11 | Microduct Installation and Air-Blown Cable: Duct Routing, Joint Integrity, and Blowing Parameters | 25 min | Scenario (calculate blow parameters for duct length + cable OD), flashcards, multiple-choice |
| 7.12 | Cable Pulling: Tension Limits, Lubricants, Intermediate Vault Breaks, and Pulling Heads | 25 min | Flashcards (tension formulas, lubricant types), scenario (determine if single pull or vault break required), multiple-choice |
| 7.13 | Road, Rail, and Water Crossings: Construction Execution and Depth Verification | 25 min | Scenario (walk a road bore construction checklist — casing, depth, annular space), flashcards, multiple-choice |
| 7.14 | Drop Installation: Aerial Drops, Buried Drops, and Building Entrance Execution | 20 min | Drag-drop (aerial drop attachment sequence), flashcards, multiple-choice |
| 7.15 | QA During Installation, ROW Restoration, and Common Installation Errors | 25 min | Scenario (evaluate an installation diary for deficiencies before acceptance), flashcards, multiple-choice |

**Total estimated duration: ~6.5 hrs**

---

## Lesson Scope Detail

### Lesson 7.1 — Aerial Installation Overview: Sequence, Crew Roles, and Safety Zones
**Duration:** 20 min

Sets the frame for the entire aerial subtopic. Covers the standard aerial installation sequence — right-of-way clearance, make-ready, messenger erection, cable stringing, lashing — and the crew roles associated with each phase (foreman, groundman, lash operator, aerial bucket operator). Addresses safety zone geometry: the dropped-object zone below aerial work, minimum distances from energized conductors (OSHA 1926.959 and NESC Rule 441), and the flagging/barricading requirements when working over public roadways. Covers the distinction between working in a joint-use (utility pole) environment vs. a communications-only pole environment and how NESC Rule 441 clearance requirements differ.

**Best interactives:** Flashcard set (aerial installation phase vocabulary, crew role definitions, OSHA clearance distances), multiple-choice quiz.

**Sources:** OSHA 29 CFR 1926.959 (electrical clearances for construction near energized lines); NESC C2-2023 Rule 441; BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6 (aerial construction sequence); ANSI/TIA-758-C §5.2.

---

### Lesson 7.2 — Messenger and Lashing Machine Operation: Stringing, Tensioning, and Dead-End Wraps
**Duration:** 30 min

The dominant aerial fiber installation method: strand messenger pre-installed and the fiber cable lashed to it. This lesson covers the full sequence: pulling the strand messenger (using a pulling line on a reel stand), tensioning with a come-along or pulling machine to the design sag for the NESC loading district, dead-end attachment (formed wire grip or bolt-type dead-end clamp), and intermediate suspension at mid-span poles (suspension clamp positioning). Covers lashing machine operation: machine setup on the messenger, cable feeding from a separate reel stand, lashing wire spool threading and tension adjustment, drive speed, dead-end wrap sequence (minimum 6 in. past the last pole clamp). Defines the acceptance criteria: lashing gap ≤ 1.5 in., no kinks, lashing wire not cutting into the cable jacket. Covers how to restart a lash after a mid-span break.

**Best interactives:** Drag-drop (ordered stringing sequence: install pulling line → pull messenger → tension and sag → dead-end → install suspension clamps → position cable reel → lash from dead-end out), flashcard set (lashing tension spec, dead-end wrap length, gap acceptance criteria), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §5.3; RUS Bulletin 1751F-630 §6.3; PLP (Preformed Line Products) lashing guide (public training materials); CommScope/AFL lashing machine operation guides (public); NESC C2-2023 Rules 230–232 (messenger design compliance).

---

### Lesson 7.3 — ADSS Self-Supporting Installation: Sag-Tension Execution, Sagging Equipment, and Span Checks
**Duration:** 30 min

All-Dielectric Self-Supporting (ADSS) cable eliminates the messenger wire: the cable itself carries the mechanical load. This lesson covers the physics difference — ADSS uses an aramid yarn strength member to carry span tension — and why ADSS installation requires more precise tension control than lashed cable. Covers ADSS stringing equipment: heavier-duty tensioners rated for ADSS rated breaking strength, brake-control reel stands, fiber-compatible sheaves with the correct groove radius (no steel sheaves — will damage jacket). Covers sag measurement methods: dynamometer (tension measurement converted to sag via cable geometry), transit sighting against a sag target board, and electronic cable-length-based sag calculators. Defines the sag verification requirement: measured sag at every span must fall within ±5% of design sag at the measured temperature. Covers ADSS dead-end hardware: factory-formed preformed wire grip or bolted dead-end — selection based on rated breaking strength of the ADSS cable.

**Best interactives:** Scenario (given a 200 m span, ADSS rated at 1,500 lbf RBS, design sag at 15°C of 1.2 m — verify measured sag of 1.4 m at 25°C is in spec using the sag-tension table), flashcard set (ADSS hardware types, sheave radius requirement, sag verification tolerance), multiple-choice.

**Sources:** IEEE 1222-2011 §5 (ADSS sag-tension and stringing); BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §5.2; AFL ADSS stringing guide (public vendor training); CommScope ADSS installation manual (public); NESC C2-2023 Rules 250–251 (loading district compliance).

---

### Lesson 7.4 — Make-Ready Execution: Pole Replacement, Transfer Sequences, and Loading Calculations
**Duration:** 25 min

"Make-ready" is the pre-installation engineering and field work required to prepare a joint-use pole line for a new cable attachment. This lesson covers: the field make-ready survey (photographing and recording all existing attachments, measuring attachment heights, identifying overloaded poles, clearance deficiencies, and poles requiring replacement); the make-ready engineering process (applying NESC loading calculations to the as-is and proposed-load condition per Rule 261 to confirm the pole can accept the new attachment or quantifying required upgrades); pole replacement sequence — the critical detail is the order of operations for maintaining service continuity on active circuits while removing and resetting a pole; and attachment transfer procedures — moving existing attachments from the condemned pole to the replacement pole without de-energizing energized conductors. Covers cost responsibility: in a joint-use agreement, the attacher requesting make-ready typically funds the pole replacement per the FCC pole attachment rules (47 CFR §1.1408).

**Best interactives:** Scenario (given a pole loading calc output showing the existing pole at 92% of allowable load, and the new fiber attachment adds 12% additional load — determine whether pole replacement is required and describe the make-ready scope), drag-drop (ordered transfer sequence: install new pole → transfer communication attachments → transfer power neutral → transfer power phase conductors → remove old pole), multiple-choice.

**Sources:** NESC C2-2023 Rules 261, 230, 232; BICSI OSP-DRD Manual, Ch. 6.3; FCC 47 CFR §1.1408 (pole attachment make-ready rules — public regulation); RUS Bulletin 1715E-110 §4 (joint-use construction); IEEE 1222 §6 (pole loading for ADSS attachment).

---

### Lesson 7.5 — Stringing Equipment: Reel Stands, Tensioners, Pulling Lines, and Roller Systems
**Duration:** 25 min

Installation equipment is the physical toolkit that converts design intent into in-place plant. This lesson covers the full stringing equipment set used for both aerial and underground cable installation:

- **Reel stands and payoff systems:** A-frame stands vs. cradle stands, brake controls (hydraulic vs. friction), reel arbor sizing. The reel brake must maintain back-tension on the cable without exceeding the cable's minimum bend radius (never let cable pile-drive through a guide block).
- **Tensioners and pullers:** hydraulic tensioner for ADSS (constant tension control), bull wheel puller for messenger stringing, capstan puller for underground pulls. Key spec: puller pull force must be monitored and not exceed the cable's maximum pulling tension (MPT) per ANSI/TIA-758-C.
- **Pulling lines:** fiber-reinforced polypropylene or Dyneema rope rated above the MPT of the cable being pulled; rope/cable connection via pulling swivel (prevents torque transmission); mesh grip vs. pulling eye end termination.
- **Sheaves and rollers:** fiber-compatible sheaves with groove radius ≥ cable minimum bend radius for aerial work; underground conduit entry rollers and intermediate conduit rollers to prevent jacket damage at conduit entry bends.

**Best interactives:** Drag-drop (label a stringing equipment diagram: reel stand, brake control, pulling line, swivel, tensioner, sheave, bull wheel, puller), flashcard set (equipment names and specs), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §5.2–5.3; RUS Bulletin 1751F-630 §6; Ditch Witch / Vermeer public cable installation guides; AFL and Corning pulling guide (public application notes).

---

### Lesson 7.6 — Trenching and Open-Cut Underground Installation
**Duration:** 25 min

Open-cut trenching is the baseline underground installation method where surface disruption is permitted. This lesson covers: chain trencher vs. rock saw vs. vacuum excavation — selection by soil class, depth requirement, and utility density (vacuum excavation is mandatory in congested utility corridors per CGA Best Practices); trench dimensions — minimum width for conduit diameter and bedding clearance, minimum depth by context (24 in. general, 36 in. under roads per ANSI/TIA-758-C §6.3); bedding and backfill sequence — sand bedding in rocky terrain, compacted native backfill in native soil, flowable fill for under-road cuts; conduit placement — mandrel-pulled before backfill, warning tape at 12 in. above conduit; surface restoration — compaction requirements, asphalt saw-cut and patch specifications, topsoil restoration in agricultural ROW; open-cut permitting requirements — most highway and rail ROW prohibit open-cut, requiring bore or HDD (covered in Lesson 7.8). Addresses the open-cut / bore decision framework.

**Best interactives:** Flashcard set (trench depth minimums by context, backfill terms, compaction requirements), scenario (for a 400 ft underground run crossing a county road followed by a private agricultural field — identify where open-cut is permissible and where bore is required, and specify the restoration requirement for each segment), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.3, §6.4; NESC C2-2023 Rule 354; BICSI OSP-DRD Manual, Ch. 6.1–6.2; RUS Bulletin 1751F-635 §3; CGA Best Practices v18 (public); FHWA utility accommodation policy (public).

---

### Lesson 7.7 — Vibratory Plow and Static Plow: Direct-Bury Execution and Cable Tension Limits
**Duration:** 25 min

Vibratory plowing is the fastest direct-bury installation method for rural routes in soil without rock. This lesson covers: vibratory plow vs. static (chain-pull) plow — vibratory plow uses an oscillating blade to fracture and displace soil with less spoil and better penetration in clay; static plow uses blade geometry alone and is limited to softer soils. Covers plow blade geometry and the chute that routes the cable or conduit behind the blade as it advances. Critical: the cable must never wrap around the blade — cable exit angle from the chute must maintain minimum bend radius at the blade tip. Covers cable tensile load during installation: TIA-758-C §6.4 requires cable to be rated for plowing tension; the plow operator must monitor blade pull-force instrumentation and stop if tension exceeds the cable's installation tension limit. Covers depth stakes and depth wheels for depth verification during the pull. Addresses in-line reel splices in the field — best practice is to avoid mid-run field splices; if required, the splice must be placed in a handhole, not buried inline. Covers post-plow ROW restoration: re-seeding, agricultural land topsoil replacement compaction limits, and the "settlement check" inspection at 30 and 90 days on agricultural routes.

**Best interactives:** Flashcard set (plow types, cable exit angle requirement, depth verification methods, settlement check timeline), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.3, §6.4; BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §5; Ditch Witch RT115 and RT125 plow operation guides (public); Vermeer VP6550 vibratory plow guide (public).

---

### Lesson 7.8 — Horizontal Directional Drilling (HDD): Bore Plan, Pilot Hole, Reaming, and Pull-Back
**Duration:** 30 min

HDD is the dominant method for crossings where the surface cannot be disrupted. This lesson covers the full HDD process in four phases:

1. **Bore plan:** entry/exit angle design (typical 8–12° entry angle), bore profile geometry (arc depth and radius driven by minimum conduit bend radius and required depth at crossing centerline), soil investigation (geotechnical boring or test pits to identify rock, existing utilities, and groundwater), and bore path survey using a surface walkover locating system.
2. **Pilot hole:** drill bit selection for soil class (open-faced bit in soft soil, PDC bit in rock), steering head with sonde transmitter (locator tracks sonde depth and azimuth from surface), drilling fluid (bentonite slurry — maintains bore hole, carries cuttings, prevents collapse), drill string assembly and joint makeup.
3. **Reaming:** back-reamer selected at 1.5× the conduit OD (NULCA best practice); multiple ream passes to reach final diameter; drilling fluid return monitoring to detect fluid loss into voids or soil fracture.
4. **Pull-back:** conduit strung along bore exit path, swivel attached to back-reamer at front, pull-back through completed bore while maintaining conduit pulling tension below MPT; conduit end plugged immediately on exit to prevent soil ingress.

Covers minimum bore depths: 36 in. under roads (ANSI/TIA-758-C §6.3), 48 in. under railroad tracks (AREMA standard), variable under water crossings per USACE NWP 12 conditions.

**Best interactives:** Scenario (given a 180 ft bore crossing a US highway — size the bore entry/exit geometry, select reamer OD for a 2 in. HDPE conduit, and identify the minimum bore depth), flashcard set (HDD process phases, bore plan terms, drilling fluid purpose, NULCA reamer sizing rule), multiple-choice.

**Sources:** NULCA (National Utility Locating Contractors Association) Best Practices for HDD (public); North American Society for Trenchless Technology (NASTT) HDD Good Practices Guidelines (public); ANSI/TIA-758-C §6.3; BICSI OSP-DRD Manual, Ch. 6.1; RUS Bulletin 1751F-635 §3; Ditch Witch JT20 / JT30 HDD operator training (public); Vermeer D23x30 HDD guides (public).

---

### Lesson 7.9 — Missile Boring and Impact Moling: Soil Requirements and Limitations
**Duration:** 20 min

For short crossings where HDD is over-engineered, pneumatic boring tools offer a simpler (and riskier) alternative. This lesson covers two tools: (1) **missile bore** (pneumatic pipe rammer) — a pneumatically driven steel missile advanced through the soil by compressed-air impulse; used for steel casing installation up to 6 in. OD in distances up to ~100 ft in suitable soil; (2) **impact mole** (piercing tool) — a self-propelled torpedo-shaped tool driven by internal hammer mechanism; used for conduit or direct placement of small-diameter pipe up to ~4 in. OD in distances up to ~75 ft. Both tools share a critical limitation: they are displacement methods, not excavation methods — they push soil aside, which can deflect around buried utilities without detection. Covers soil suitability (cohesive soils required — no gravel, cobble, or utilities in the bore path); pre-bore utility clearance requirements (Potholing every 25 ft per CGA Best Practices); deviation risk (neither tool is steerable — deviation rate of 1–3 in./10 ft is normal); and typical application scenarios (under a sidewalk, short driveway crossing, shallow railroad crossing under a farm road).

**Best interactives:** Flashcard set (missile bore vs. mole distinctions, max run lengths, soil suitability, deviation risk), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 6.1; NULCA HDD Best Practices (public — includes pneumatic bore guidance); CGA Best Practices v18 (excavation and boring safety); Ditch Witch / Vermeer pneumatic boring tool operation guides (public vendor materials).

---

### Lesson 7.10 — Conduit Installation: Rigid PVC, HDPE, and Innerduct — Pull Methods and Mandrel Testing
**Duration:** 25 min

Conduit installation is the foundation of the underground conduit system: all subsequent cable pulls depend on conduit quality. This lesson covers: conduit material selection — Schedule 40/80 PVC (rigid, glued joints, good crush resistance, temperature-limited for heat-bending), HDPE (flexible, heat-fused joints, good for bore-back installation, higher temperature range); innerduct installation inside larger conduit — maximizes duct occupancy, divides conduit for separate cables; conduit jointing — PVC solvent-weld procedure (cure time, temperature effects, joint alignment), HDPE thermal butt fusion (equipment, temperature, fusion time, bead inspection); bending — LB conduit bodies for 90° changes vs. sweeping bends (never exceed conduit minimum bend radius during installation); expansion loops at thermal boundary crossings; conduit mandrel testing — pulling a mandrel (typically a cylinder at 70–75% of conduit ID, or a 4-ball mandrel) through the completed conduit run before any cable pull, to confirm bore integrity, joint quality, and absence of blockages; conduit sealing — conduit ends must be plugged immediately after installation to prevent debris, water, and rodent ingress.

**Best interactives:** Drag-drop (ordered conduit prep and pull sequence: survey bore → pull conduit back → fuse/glue joints → install innerduct → install pull tape → mandrel test → plug ends), flashcard set (mandrel OD rule, PVC cure time, joint types, innerduct sizing), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 6.1; ANSI/TIA-758-C §6.1, §6.3; RUS Bulletin 1751F-635 §3; NULCA HDD Best Practices; Carlon/Thomas & Betts PVC conduit installation guide (public); Dura-Line HDPE conduit installation guide (public).

---

### Lesson 7.11 — Microduct Installation and Air-Blown Cable: Duct Routing, Joint Integrity, and Blowing Parameters
**Duration:** 25 min

Microduct systems differ from standard conduit in that cable is installed by compressed-air propulsion rather than pulling. This lesson covers the execution side (not cable selection — that was Topic 1 Lesson 1.5). Topics: microduct placement — in a spine conduit or direct-buried as a bundle, maintaining minimum bend radius (typically 15× OD for microduct bundles); joint assembly — push-fit fittings require full-insertion confirmation, fitting locking ring verification, leak test before blowing; route inspection — every joint and every stub port sealed before blowing; blowing machine operation — setting entry pressure (typically 8–12 bar for standard OSP distances), flow rate, and cable speed limiter; monitoring cable speed during blow (typical 30–100 m/min; speed drop indicates a restriction); end detection — cable arrival confirmed by sensor or a helper at the far end; calculating maximum blow distance for a given cable OD / duct ID / duct length / pressure available (Dura-Line / Plumettaz calculation charts are the public-domain reference). Covers re-blowing procedures for partial installs where the cable stops short.

**Best interactives:** Scenario (given a 400 m microduct run, 5/3.5 mm microduct ID/OD, 1.5 mm cable OD, entry pressure available 10 bar — confirm the run is within single-blow capability using a duct calculation chart or rule of thumb), flashcard set (joint integrity checks, blow pressure range, speed monitoring, re-blow triggers), multiple-choice.

**Sources:** BICSI OSP-DRD Manual, Ch. 6.1; ETSI EN 187100 (microduct installation — public standard); Dura-Line microduct installation guide (public); Plumettaz air-blowing equipment application notes (public); AFL microduct guide (public); ANSI/TIA-758-C §6.1.

---

### Lesson 7.12 — Cable Pulling: Tension Limits, Lubricants, Intermediate Vault Breaks, and Pulling Heads
**Duration:** 25 min

Cable pulling into conduit is where installation errors most commonly destroy an otherwise intact cable — exceed the maximum pulling tension for 10 seconds, and the fiber count is permanently damaged. This lesson covers: maximum pulling tension (MPT) for OSP fiber cable — the ANSI/TIA-758-C §5.3 formula: MPT = tensile strength of the strength member (aramid or fiberglass rod), which must not be exceeded during any pull segment; conduit friction calculation — the horizontal pulling tension formula (T = w × µ × L; w = cable weight per unit length, µ = coefficient of friction, L = pull length) and the modified formula for bends (tension multiplication at each bend using e^µθ); selecting lubricants — water-based cable lubricants for PVC and HDPE conduit (petroleum-based lubricants degrade PVC jackets — never use); intermediate vault breaks — when a single pull segment exceeds the MPT (typically beyond 300–500 ft depending on cable weight and duct configuration), the pull must be staged through a handhole or manhole (figure-8 coil in the vault, then re-pull the next segment); pulling head types — mesh pulling grip (short cable, up to ~200 ft), swivel eye crimped to strength member (longer pulls), pulling nose assembly for armored cables. Covers real-time tension monitoring: a line pull dynamometer or a tension-display capstan puller is required on pulls approaching MPT.

**Best interactives:** Flashcard set (MPT formula, friction coefficient for lubricated PVC ~0.15, vault break trigger rule, lubricant type prohibition), scenario (given a 400 ft pull through 1.25 in. PVC conduit with two 90° bends, cable weight 0.05 lbs/ft, µ = 0.15, MPT = 300 lbf — calculate tension at each segment end and determine whether a vault break is required), multiple-choice.

**Sources:** ANSI/TIA-758-C §5.3; BICSI OSP-DRD Manual, Ch. 6.1; RUS Bulletin 1751F-635 §3; Corning cable pulling guide (public application note); CommScope / AFL pulling guide (public); Greenlee capstan puller operation (public).

---

### Lesson 7.13 — Road, Rail, and Water Crossings: Construction Execution and Depth Verification
**Duration:** 25 min

The physical execution of crossings — distinguished from the design and permit phase covered in Topic 3 Lesson 3.8. This lesson covers what actually happens on the ground when permits are in hand:

**Road crossings:** bore machine setup (HDD per Lesson 7.8, or pneumatic bore per Lesson 7.9), traffic control plan execution (MUTCD compliant — flaggers, signs, shadow vehicle), casing installation if required by DOT permit, depth verification method (downhole camera or sonde depth check at centerline), restoration requirements — asphalt saw-cut and patch, compaction testing, and surface restoration inspection by AHJ.

**Rail crossings:** railroad flagger requirement (railroad-supplied on active rail lines — contractor cannot proceed without railroad flagman present), casing pipe installation (Class A bore: contractor-funded, 48 in. minimum depth, casing extends 5 ft minimum beyond rail on each side), casing end seal and vent pipe, depth verification using a locate receiver at centerline.

**Water crossings (directional bore):** bore depth below the ordinary high water mark per USACE NWP 12 conditions (typically 6 ft minimum below streambed), return circulation monitoring (drilling fluid loss to water surface signals a frac-out condition — requires bore suspension and remediation plan per NWP 12 terms).

**Best interactives:** Scenario (walk a road bore construction checklist — bore machine setup, traffic control verification, casing installation, depth check at centerline, restoration sign-off), flashcard set (railroad flagger requirement, NWP 12 frac-out definition, casing extension rule), multiple-choice.

**Sources:** USACE NWP 12 (publicly available permit text); MUTCD (Manual on Uniform Traffic Control Devices — federal highway, public); BICSI OSP-DRD Manual, Ch. 6.2; RUS Bulletin 1751F-630 §7; AREMA Manual for Railway Engineering, Chapter 33 (publicly available summary); ANSI/TIA-758-C §6.3.

---

### Lesson 7.14 — Drop Installation: Aerial Drops, Buried Drops, and Building Entrance Execution
**Duration:** 20 min

The last mile of an OSP network: the drop from distribution plant to the customer premises. This lesson covers three drop types: (1) **Aerial drop** — span from MST or drop terminal on a utility pole to the building fascia; hardware sequence: dead-end at the pole (preformed wire grip on lashed drop, or factory-equipped hardened connector on pre-connectorized drop), drip loop (12 in. minimum per NEC Art. 800), building attachment (fascia hook or wall anchor with through-bolt), service loop at building entry (2 ft minimum per ANSI/TIA-758-C §5.4); (2) **Buried drop** — direct-bury from pedestal or buried terminal to building; minimum 12 in. depth for residential FTTH drops per NEC Art. 830 (broadband network services — note this is different from TIA-758-C's 24 in. general requirement; AHJ governs which applies); (3) **Building entrance** — cable enters via a conduit stub or wall penetration; NEC Art. 770.110 requires listed building entrance cable for any conduit entry; the indoor-to-outdoor transition must use OSP-rated cable if outdoor segments exceed 50 ft, or transition to listed indoor cable within 50 ft of the building entry per NEC Art. 770.113.

**Best interactives:** Drag-drop (aerial drop attachment sequence: dead-end at pole → drip loop → span → building fascia attachment → service loop → building entry seal), flashcard set (NEC Art. 770.113 transition rule, drip loop requirement, buried drop depth), multiple-choice.

**Sources:** NEC 2023 Art. 770.110, 770.113, 800, 830; ANSI/TIA-758-C §5.4; NESC C2-2023 Rule 238; BICSI OSP-DRD Manual, Ch. 6.3–6.4; Corning OptiTap drop installation guide (public); CommScope drop cable installation guide (public).

---

### Lesson 7.15 — QA During Installation, ROW Restoration, and Common Installation Errors
**Duration:** 25 min

Installation QA is not a post-installation checklist — it runs concurrently with every operation. This lesson covers: depth verification during underground installation (depth probe or locate verification at every 100 ft during plow/trench operations, at every crossing centerline, and before backfill); cable-pull tension logging (log max tension per pull segment, per ANSI/TIA-758-C §9 — required for acceptance documentation); visual jacket inspection (no kinks, flat spots, or scuffs — reject any cable segment showing jacket damage before burying); burial marker tape placement verification (12 in. above the conduit or cable after backfill, confirmed by uncovering a sample every 500 ft); aerial sag verification (measured at each span vs. design sag); as-built photo log (GPS-tagged photos at every splice point, crossing, transition, and splice closure position). Covers ROW restoration requirements: agricultural re-seeding to original species within 30 days, topsoil restoration sequence, drainage restoration (no crown blocking), and the 30-day/90-day settlement inspection timeline. Closes with a catalog of the most common installation errors on OSP projects and how each is detected and remediated: bent cable from reel-brake failure, buried cable above minimum depth, lashing wire kinks from incorrect machine tension, conduit joints not fully seated, mandrel testing skipped.

**Best interactives:** Scenario (evaluate an installation diary entry that includes a tension log showing one pull segment at 95% of MPT, a missing depth probe entry at a crossing, and no marker tape record for 800 ft — identify each deficiency and describe the remediation), flashcard set (QA checkpoint intervals, ROW restoration timeline, common error catalog), multiple-choice.

**Sources:** ANSI/TIA-758-C §6.4, §9; BICSI OSP-DRD Manual, Ch. 9.1; RUS Bulletin 1751F-635 §3–4; RUS Bulletin 1751F-630 §11; NULCA HDD Best Practices; CGA Best Practices v18.

---

## Interactive Type Distribution

| Interactive Type | Lesson(s) | Count |
|---|---|---|
| Flashcard set (mandatory every lesson) | 7.1–7.15 | 15 |
| Multiple-choice quiz (mandatory every lesson) | 7.1–7.15 | 15 |
| Scenario (branching / worked problem) | 7.3, 7.4, 7.6, 7.8, 7.11, 7.12, 7.13, 7.15 | 8 |
| Drag-and-drop | 7.2, 7.4, 7.5, 7.10, 7.14 | 5 |

Scenarios cluster on the lessons with field-decision math or multi-step procedures (sag verification, HDD bore sizing, pulling tension calc, vault break determination, QA diary evaluation). Drag-drop is used for physical sequences (stringing, transfer sequence, conduit prep, aerial drop attachment). Every lesson ships with the mandatory flashcard + multiple-choice pair consistent with Topics 1–3 and 5.

---

## Final Exam Structure (~30 questions)

Larger topic (15 lessons vs. 12 in prior topics) justifies a 30-question exam per the user's prompt guidance. Cumulative across all 15 lessons. 70% pass threshold. Questions randomized from question bank. Each question cites source standard(s). Mix: majority multiple-choice, 6–7 scenario-type questions requiring application of a rule or calculation to a field condition.

| Lesson coverage | Approximate question count |
|---|---|
| 7.1 Aerial Overview | 1 |
| 7.2 Messenger + Lashing | 2 |
| 7.3 ADSS Installation | 2 |
| 7.4 Make-Ready | 2 |
| 7.5 Stringing Equipment | 1 |
| 7.6 Trenching | 2 |
| 7.7 Vibratory Plow | 2 |
| 7.8 HDD | 3 |
| 7.9 Missile Bore + Mole | 1 |
| 7.10 Conduit Installation | 2 |
| 7.11 Microduct + Air-Blow | 2 |
| 7.12 Cable Pulling | 3 |
| 7.13 Crossings Execution | 2 |
| 7.14 Drop Installation | 2 |
| 7.15 QA + Restoration | 3 |
| **Total** | **30** |

---

## Citation Source Matrix

| Lesson | NESC C2-2023 | ANSI/TIA-758-C | BICSI OSP-DRD | RUS Bulletins | Other |
|---|---|---|---|---|---|
| 7.1 | Rule 441 | §5.2 | Ch. 6.3 | 1751F-630 §6 | OSHA 1926.959 |
| 7.2 | Rules 230–232 | §5.3 | Ch. 6.3 | 1751F-630 §6.3 | PLP lashing guide; CommScope/AFL lashing guide |
| 7.3 | Rules 250–251 | §5.2 | Ch. 6.3 | — | IEEE 1222-2011 §5; AFL/CommScope ADSS guides |
| 7.4 | Rules 261, 230, 232 | — | Ch. 6.3 | 1715E-110 §4 | FCC 47 CFR §1.1408; IEEE 1222 §6 |
| 7.5 | — | §5.2–5.3 | Ch. 6.3 | 1751F-630 §6 | Ditch Witch/Vermeer guides; AFL/Corning pulling guides |
| 7.6 | Rule 354 | §6.3, §6.4 | Ch. 6.1–6.2 | 1751F-635 §3 | CGA Best Practices v18; FHWA utility accommodation |
| 7.7 | — | §6.3, §6.4 | Ch. 6.2 | 1751F-630 §5 | Ditch Witch RT/Vermeer VP plow guides |
| 7.8 | — | §6.3 | Ch. 6.1 | 1751F-635 §3 | NULCA HDD Best Practices; NASTT HDD Good Practices; Ditch Witch/Vermeer HDD guides |
| 7.9 | — | — | Ch. 6.1 | — | NULCA; CGA v18; Ditch Witch/Vermeer pneumatic bore guides |
| 7.10 | — | §6.1, §6.3 | Ch. 6.1 | 1751F-635 §3 | NULCA; Carlon PVC guide; Dura-Line HDPE guide |
| 7.11 | — | §6.1 | Ch. 6.1 | — | ETSI EN 187100; Dura-Line microduct guide; Plumettaz app notes; AFL microduct guide |
| 7.12 | — | §5.3 | Ch. 6.1 | 1751F-635 §3 | Corning/CommScope/AFL pulling guides; Greenlee capstan guide |
| 7.13 | — | §6.3 | Ch. 6.2 | 1751F-630 §7 | USACE NWP 12; MUTCD; AREMA Ch. 33 |
| 7.14 | Rule 238 | §5.4 | Ch. 6.3–6.4 | — | NEC 2023 Art. 770.110, 770.113, 800, 830; Corning/CommScope drop guides |
| 7.15 | — | §6.4, §9 | Ch. 9.1 | 1751F-635 §3–4; 1751F-630 §11 | NULCA; CGA v18 |

---

## Overlap Notes with Prior Topics

**Topic 1 (Cable Selection) — Lesson 1.5 (Microduct + Air-Blown Fiber):** Topic 1 covered microduct cable selection criteria — OD, fill ratio, IEC 61754 specs. Lesson 7.11 explicitly focuses on installation execution: joint integrity, blowing parameters, and fault recovery. No duplication — cross-reference recommended in Lesson 7.11 intro: "For microduct cable selection criteria, see Topic 1 Lesson 1.5."

**Topic 3 (Survey & Route Design) — Lessons 3.6 (Direct-Bury), 3.5 (Underground), 3.8 (Crossings):** Topic 3 addressed these as design-phase decisions (depth standards, method selection, permit requirements). Topic 7 addresses the physical execution in the field (equipment operation, QA, tension limits). The design lesson and the execution lesson are complementary and should cross-reference each other.

**Topic 5 (Hardware & Accessories) — Lessons 5.1–5.3 (Pole Hardware, Strand, Lashing):** Topic 5 covered what the hardware is and how to select it. Topic 7 Lessons 7.2–7.4 cover how to install it in the field. Again, complementary — Topic 5 is the equipment/hardware reference; Topic 7 is the installation procedure.

**Topic 5 — Lesson 5.11 (Storage Hardware):** Slack storage methods are introduced in Topic 5. Topic 7 Lesson 7.12 touches slack coiling at vault breaks. No duplication — different context (selection/ID vs. installation execution).

**Topic 2 (Splice & Termination):** Topic 2 covers what happens inside the splice closure after the cable is in place. Topic 7 covers getting the cable to that point. These are distinct phases of the same project and should be taught sequentially (Topic 7 before Topic 2 in a cert-prep curriculum order).

---

## Open Questions

1. **Aerial vs. underground emphasis:** The lessons are balanced 50/50 aerial and underground (7 aerial-primary lessons, 8 underground-primary). If the office's work is predominantly one type, the weighting of scenarios and exam questions can shift toward the dominant method. Which is the higher-volume work type?

2. **HDD depth for Lesson 7.8:** The worked scenario uses a US highway crossing. If the office routinely drills under specific features (e.g., county roads, state highways, creek crossings) with known depth/permit requirements, the scenario can be built around those specific conditions — making it directly reusable on job sites.

3. **Equipment brands in active use:** Several lessons reference Ditch Witch and Vermeer as primary HDD/plow vendors. If the office fleet is different (e.g., Toro/Astec, DeWind), the equipment-specific interactives can reference the actual gear on the lot.

=== OSP TOPIC 7 DISCOVERY END ===
