---
title: "Lesson 2.1: Cleaving Fundamentals — Setup, Angle Requirements, and Failure Modes"
duration_min: 25
topic: splice-termination
order: 1
bicsi_alignment:
  - "OSP-DRD 7.3: Fiber preparation and cleaving for fusion and mechanical splicing"
  - "OSP-DRD 7.1: Splice preparation — stripping, cleaning, and mechanical handling"
sources:
  - "IEC 61300-3-35 (fiber end-face geometry and pass/fail criteria)"
  - "Fujikura CT-30A / CT-45 Cleaver Operation Manual (public training edition)"
  - "Sumitomo FC-6S Field Cleaver Installation and Operation Guide"
  - "BICSI OSP-DRD Manual, Ch. 7.3"
  - "Corning Cable Systems OSP Splicing Procedures Guide, Rev. 3"
---

# Cleaving Fundamentals: Setup, Angle Requirements, and Failure Modes

## In Plain English

Before you can join two fiber strands together, you have to give each one a perfectly flat, square end — like cutting a piece of pipe perfectly perpendicular so the two ends seat flush. That cutting process is called **cleaving**. A precision cleaver scores a tiny nick in the glass, then pulls the fiber apart in a controlled way so the break is flat and square. If the end is rough, chipped, or angled, the splice will bleed light and the connection will be weak. Everything else in this topic — fusion splicing, splice trays, acceptance testing — depends on getting this first step right.

---

## Acronym Glossary

| Acronym | Stands for | What it means in plain English |
|---|---|---|
| **OSP** | Outside Plant | The cables, poles, and hardware that live outdoors, outside any building |
| **SMF** | Single-Mode Fiber | A very thin fiber (only one path for light) used for long runs — the standard for phone-company and internet backbone work |
| **OS2** | Optical Single-mode 2 | The specific flavor of SMF used in most OSP installations; rated for long-haul use |
| **MMF** | Multi-Mode Fiber | A fatter fiber that allows multiple light paths; used for shorter runs inside buildings |
| **OM3/OM4** | Optical Multi-mode 3/4 | Grades of multimode fiber — think "grade 3" and "grade 4 quality" |
| **PAS** | Profile Alignment System | The camera system in a fusion splicer that looks at the fiber core and lines up both sides before welding |
| **IPA** | Isopropyl Alcohol | Rubbing alcohol — used to clean the bare glass before cleaving and splicing |
| **IEC** | International Electrotechnical Commission | The international standards body that publishes fiber testing and hardware specs |
| **BICSI** | Building Industry Consulting Service International | The trade organization that writes the OSP Design Reference Manual (the rulebook for fiber work) |
| **OSP-DRD** | OSP Design Reference and Data | BICSI's main reference manual for outside-plant fiber design and installation |

---

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the functional components of a precision fiber cleaver and the role of each component in producing an acceptable end-face
- State the cleave angle acceptance thresholds for single-fiber fusion splicing, mass-fusion ribbon splicing, and mechanical splicing
- Identify the four primary cleave failure modes — hackle, mist, lip, and angle error — from their visual signatures and explain the root cause of each
- Apply the blade maintenance interval and replacement decision criteria per manufacturer guidance
- Execute the correct field decision loop when a cleave fails with limited fiber length remaining

---

## Reading Content

### Why the Cleave Is the Foundation

Think of a cleave like cutting a wooden dowel with a chop saw. If the blade is sharp and the cut is perfectly square, the two ends seat flat against each other with no gap. If the blade is dull or the dowel shifts during the cut, you get a ragged or angled end that leaves a visible gap when you push the pieces together — and that gap lets light leak out.

Fiber optics works the same way, except the "dowel" is a strand of glass the width of a human hair, and the gaps we're worried about are measured in millionths of a meter.

Every fusion splice and every mechanical splice begins at the same point: a flat, perpendicular, crack-free fiber end-face. The cleave is not a secondary preparation step — it is the gating quality check for the entire splicing process. A poorly cleaved fiber produces elevated splice loss regardless of how precise the splicer's core alignment is or how well-tuned the arc parameters are. Splicer image processors can detect a bad cleave and reject it, but the operator must understand the failure modes to diagnose root cause and correct the process, not simply re-cleave blindly until a pass appears [BICSI OSP-DRD Manual, Ch. 7.3].

The physics of optical cleaving are straightforward: glass fractures predictably when a controlled tensile stress is applied across a surface-initiated crack. The cleaver's blade scores a shallow nick in the fiber's cladding surface; controlled tension then propagates a fracture perpendicular to the fiber axis. The quality of the resulting end-face is determined entirely by three factors: blade sharpness (score depth and consistency), tension setting (matched to fiber type and coating diameter), and fiber holder alignment (fiber axis perpendicular to the blade travel) [Fujikura CT-30A Manual, §2.1; Corning OSP Splicing Guide, §3.2].

### Cleaver Anatomy

A precision fiber cleaver for OSP fusion splicing work consists of the following components:

**Fiber holders (v-grooves).** Think of these as the two clamps that hold a pipe steady while you cut it. They are matched v-groove slots that hold the stripped fiber in a fixed position during the cleave cycle. Most cleavers provide multiple holder sizes: 250 µm (bare fiber after secondary buffer removal), 900 µm tight-buffer, and ribbon holders for 12-fiber or 24-fiber mass-fusion work. The fiber must seat fully in the groove — a fiber that bridges the groove rather than resting in it will move during tension application and produce an angled or irregular cleave.

**Blade and rotation mechanism.** The cleave blade is a precision hardened-carbide or sapphire edge. Think of it like a rotary knife — every cut uses a fresh section of edge, automatically. On high-cycle precision cleavers (Fujikura CT-30A, CT-45; Sumitomo FC-6S), the blade automatically indexes to a fresh edge position with each cleave cycle, rotating the blade incrementally so every cleave uses a previously unused section of edge. The rotation counter tracks the total number of cleaves performed; when the counter reaches the blade's rated cycle count, the blade must be replaced — further use produces increasingly inconsistent scores. Typical blade life: **4,000–16,000 cleaves** depending on blade grade and cleaver model [Fujikura CT-30A Manual, §5.1; Sumitomo FC-6S Guide, §4.3].

**Tension mechanism.** After the nick is scored, this mechanism pulls both ends of the fiber apart in a controlled way — like pulling a scored piece of glass along a straight line to snap it cleanly. A spring or pneumatic tensioning system applies controlled axial tension to the fiber after the score is made. Tension is set by the operator (or factory-set on automatic models) for the specific fiber type: single-mode OS2, multi-mode 50/125, and ribbon multi-fiber require different tension settings. Tension that is too low produces an incomplete fracture; too high produces a secondary fracture plane, lip formation, or hackle.

**Cleave length setting.** A stop determines how far the fiber protrudes from the holder into the blade zone. Cleave length must match the splicer's fiber slot depth — typically 8–16 mm of stripped bare fiber for single-fiber fusion splicers. Incorrect cleave length prevents the fiber from seating in the splicer's v-groove and is a common operator error.

**Fiber collection chamber.** The cleaved stub (the waste end of the fiber) must be captured and discarded safely. Fiber stubs are a sharps hazard — they're invisible to the naked eye and can embed in skin like a splinter. A cleaver without a functional debris trap should not be operated. Stubs discarded on the ground in a splice vault or aerial bucket are a maintenance liability and a safety hazard [BICSI OSP-DRD Manual, Ch. 7.3].

### Cleave Angle Requirements

Imagine two pipe ends you're trying to join with a coupling. If one end is cut perfectly square (90°) and the other is cut slightly angled (say, 89°), the coupling seats flat on one side and has a gap on the other. That gap lets water in. For fiber, that gap lets light out — and the more angled the cut, the more light leaks.

Fusion splice loss increases approximately as the square of the angular misalignment between two fiber end-faces. For typical OS2 SMF, a 1° cleave angle on one fiber face raises estimated splice loss by approximately 0.2–0.5 dB beyond what a perpendicular cleave would produce; two angled faces compounding can push loss over 0.5 dB on a single splice — exceeding BICSI acceptance thresholds [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-35 §4.1].

Standard angle acceptance thresholds are as follows:

| Application | Max cleave angle | Governing reference |
|---|---|---|
| Single-fiber fusion (SMF — OS1/OS2) | ≤ 0.5° | Fujikura FSM-series acceptance criteria; BICSI OSP-DRD Ch. 7.4 |
| Single-fiber fusion (MMF — OM1–OM4) | ≤ 1.0° | Fujikura FSM-series MMF splice program; Sumitomo Type-82C MMF program |
| Mass-fusion ribbon splicing | ≤ 1.0° per fiber | Fujikura FSM-60R/70R/90R manual; Sumitomo Type-71M+ guide |
| Mechanical splicing (field expedient) | ≤ 1.5° | BICSI OSP-DRD Ch. 7.3; Corning OSP Splicing Guide §4.1 |

**Why SMF (single-mode fiber) has a tighter limit than MMF (multi-mode fiber):** Single-mode fiber carries light along a single, extremely narrow path — the core is only about 9 µm wide (about one-tenth the width of a human hair). Any angle error knocks that single beam off-axis faster than it would in multi-mode fiber, which has a wider core (50–62.5 µm) and more tolerance for small angular deviations. That's why OS2 SMF demands ≤ 0.5° while MMF allows ≤ 1.0°.

These thresholds assume measurement at the fiber's cladding end-face using the splicer's image processing or a dedicated cleave analyzer. Most fusion splicers display the cleave angle measurement as part of their pre-splice inspection routine and will reject fibers exceeding their programmed threshold, displaying an error code before the arc fires.

Modern fusion splicers (Fujikura FSM-22S, FSM-80S; Sumitomo Type-82C) automatically inspect the cleave angle using their built-in camera system and will display a cleave error if the measured angle exceeds the threshold. The operator should not override this check and proceed with the splice.

### The Four Cleave Failure Modes

Understanding failure modes allows the operator to diagnose the root cause — not just re-cleave until a good result appears. Think of this like diagnosing why a piece of drywall cut ugly: was the blade dull? Did you not score deep enough? Did the sheet shift? Each bad cleave has a specific cause and a specific fix.

Each failure mode has a distinct visual signature and a specific cause [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6; Corning OSP Splicing Guide, §3.5]:

**1. Hackle (surface roughness)**
*What it looks like:* The end-face surface has a rough, grainy, or striated texture — like a break that tore rather than cut. Visible under the splicer's inspection camera as a textured surface instead of a smooth mirror finish.
*What causes it:* The blade is worn (dull edge failing to produce a consistent score depth), the fiber surface was dirty before cleaving (gel residue, moisture), or the tension was too high — driving a fast fracture that ran crooked through the glass.
*How to fix it:* Index the blade to a fresh position; re-clean the fiber with isopropyl alcohol (IPA) on lint-free wipes; verify tension setting matches fiber type. **Timing discipline:** Re-cleave immediately after cleaning — do not allow more than 30 seconds between cleaning and inserting the fiber in the cleaver. In humid OSP conditions, the cleaned bare glass re-contaminates from ambient moisture and airborne particles within seconds; a long delay between cleaning and cleaving can produce another hackle from freshly contaminated glass.

**2. Mist (sub-surface haze)**
*What it looks like:* The end-face appears hazy or shows a circular cloudy region at the center or near the edge. The surface is geometrically flat but optically foggy — like a clean pane of glass with frost inside it.
*What causes it:* Micro-fractures beneath the cleaved surface — tiny cracks just below what the camera sees — typically caused by an excessively fast fracture (too much tension) or a blade nick that starts multiple sub-surface cracks at once.
*How to fix it:* Reduce tension setting; index blade. If mist persists across multiple cleaves on fresh blade positions, the cleaver's tension spring may be out of calibration — return to the manufacturer's service interval check [Sumitomo FC-6S Guide, §4.2].

**3. Lip (end-face protrusion)**
*What it looks like:* One side of the end-face is higher than the other — the fracture plane is not flat. Think of it like a bread knife cut where one side of the loaf is higher than the other. From the side it looks like the brim of a hat.
*What causes it:* Asymmetric tension application — one side of the fiber releases before the other, causing a step fracture. Common causes: fiber not fully seated in the v-groove (held at an angle), holder worn or dirty, or blade score too deep on one side.
*How to fix it:* Re-seat the fiber fully in the holder; clean the v-groove with a brush or IPA swab; index blade; verify holder is the correct size for the fiber diameter being cleaved.

**4. Angle error (angular deviation)**
*What it looks like:* The end-face is smooth and flat — good surface quality — but the plane is tilted. Imagine cutting a dowel with a miter saw set at 89° instead of 90°: the cut is clean, just not square. The splicer's angle readout shows a number above the acceptance threshold.
*What causes it:* Fiber not perpendicular in the holder (bent fiber, damaged fiber curl, or holder set at a slight angle); blade strike angle slightly off-center; cleaver housing bent or dropped.
*How to fix it:* Straighten the fiber before loading; use a fresh section of fiber with no bend set from being wound tightly; inspect the cleaver for physical damage (dropped cleavers should be returned to service inspection before use).

### Blade Life Management

The cleave blade is a consumable — like a box-cutter blade. Every cleave cycle advances the blade to a fresh edge position by a fixed increment. When all positions on the blade are exhausted, the blade must be replaced — the counter reaches its rated maximum and the cleaver will lock out further cleaves (on auto-counting models) or display a warning.

Do not continue cleaving past the rated blade cycle count. A worn blade produces inconsistent scores — the failure mode distribution shifts from predominantly good cleaves to predominantly hackle and angle errors, and the failure pattern becomes unpredictable. Replacing the blade at the rated interval eliminates this variable [Fujikura CT-30A Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.3].

Blade replacement indicators on manual-count cleavers:
- Increasing frequency of hackle or mist failures despite correct setup
- Visible scoring inconsistency when the blade contact zone is inspected under magnification
- Counter reaches the rated cycle count (note: some blades are dual-side, doubling usable cleave count before disposal)

### Field Decision Loop: Last Workable Fiber Length

In field splicing conditions, particularly inside a tight closure or aerial splice bucket, the available stripping and cleaving room per fiber is finite. Each failed cleave consumes 8–15 mm of fiber length. After multiple failed cleaves, the remaining fiber stub may be too short to reach the splicer's v-groove — like whittling a pencil until there's nothing left to hold.

The correct decision loop when approaching the minimum workable fiber length:

1. **Count remaining length.** Before re-cleaving, estimate remaining stripped length against the splicer's minimum fiber engagement spec (typically ≥10 mm of bare fiber extending beyond the protection sleeve after re-cleave).
2. **Diagnose before re-cleaving.** If two consecutive cleaves fail, identify the failure mode before the third attempt. Random re-cleaving without diagnosis wastes fiber.
3. **Last-resort option.** If fiber length is critically short and the root cause is blade wear, index the blade (if unused positions remain) before the final attempt.
4. **Accept the boundary.** If fiber is too short to reach the splicer after stripping and cleaving, the splice cannot be made at this location — the closure must be repositioned or the fiber pulled back to expose additional slack from the cable's slack coil. Attempting to splice a fiber that is too short to seat in the splicer will damage the splicer's internal components [BICSI OSP-DRD Manual, Ch. 7.3; Corning OSP Splicing Guide, §3.4].

---

## Key Terms (Flashcard Candidates)

**Cleave angle**
The angular deviation of a cleaved fiber end-face from a plane perpendicular to the fiber axis. Measured in degrees. Think of it as "how far off-square is the cut?" Acceptance thresholds: ≤0.5° for single-fiber SMF fusion, ≤1.0° for single-fiber MMF fusion and mass-fusion ribbon, ≤1.5° for mechanical splicing. [IEC 61300-3-35 §4.1; BICSI OSP-DRD Manual, Ch. 7.4]

**Hackle**
A cleave failure mode. The end-face looks rough and grainy instead of smooth — the fracture ran crooked through the glass. Caused by blade wear, fiber contamination, or too much tension. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]

**Mist**
A cleave failure mode. The end-face looks hazy or foggy even though its shape is flat — there are tiny cracks just below the surface. Caused by excessive tension or a compromised blade nick producing multiple crack initiations. [IEC 61300-3-35 §4; Sumitomo FC-6S Guide, §4.2]

**Lip**
A cleave failure mode. One side of the end-face is taller than the other — a stepped break, like a staircase instead of a flat floor. Caused by asymmetric tension, usually because the fiber wasn't fully seated in the holder. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]

**Blade rotation counter**
The cumulative cleave-cycle tracking mechanism on a precision cleaver. Think of it like an odometer — when it hits the rated limit, it's time to replace the blade. [Fujikura CT-30A Manual, §5.1; Sumitomo FC-6S Guide, §4.3]

**Blade life interval**
The manufacturer-rated number of cleave cycles per blade before replacement is required. Typical range: 4,000–16,000 cleaves depending on blade grade and cleaver model. Going past this limit is like driving on a bald tire — it might work for a while but failures become random and unpredictable. [Fujikura CT-30A Manual, §5.1]

**Tensile score-and-break method**
The mechanical principle of precision fiber cleaving: a blade scores a shallow nick in the cladding surface; controlled axial tension then propagates a planar fracture from the nick across the fiber cross-section. Same physics as scribing and snapping a ceramic tile. [Corning OSP Splicing Guide, §3.2]

**Bare fiber (stripped fiber)**
Optical fiber from which all protective coatings have been removed, exposing the 125 µm glass cladding. This is the working surface for cleaving and splicing. It must be cleaned with IPA on a lint-free wipe immediately before use — bare glass is like exposed skin: it picks up contamination within seconds.

**Cleave length**
The length of bare fiber that protrudes from the holder into the cleaver's blade zone. Must match the splicer's fiber slot depth specification (typically 8–16 mm for single-fiber fusion splicers). [Fujikura CT-30A Manual, §3.2]

**IEC 61300-3-35**
The international standard governing fiber end-face geometry and inspection pass/fail criteria — primarily written for connector end-faces, but its cleave angle loss estimates are also applied by convention to fusion splice cleave angle criteria as a supplementary reference. [IEC 61300-3-35]

---

## Interactive: Flashcard Set — Failure Modes and Cleave Parameters

**Card 1**
*Front:* What cleave angle threshold must be met for single-fiber fusion splicing on OS2 SMF?
*Back:* ≤ 0.5° from perpendicular. Exceeding this degrades splice loss by approximately 0.2–0.5 dB per 1° of angular deviation — the equivalent of a good splice going bad because of a cut that's barely off-square. [Fujikura FSM-series; BICSI OSP-DRD Ch. 7.4]

**Card 2**
*Front:* A field technician observes a rough, striated end-face texture on the splicer's inspection screen. Which failure mode is this, and what is the most likely root cause?
*Back:* Hackle. Most likely causes: blade wear (index to a fresh position or replace blade), fiber surface contamination (re-clean with IPA), or excess tension setting. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]

**Card 3**
*Front:* What distinguishes a "lip" failure from an "angle error" failure under inspection?
*Back:* A lip shows a stepped or raised edge on one side of the end-face — the fracture was asymmetric, like a stair step. An angle error shows a smooth, flat end-face that's uniformly tilted — the entire surface is fine, just not square. Both fail the angle check, but lip has a physical step; angle error is planar but tilted. [IEC 61300-3-35 §4]

**Card 4**
*Front:* How does a precision cleaver's blade rotation mechanism prevent premature blade wear failure?
*Back:* The blade indexes to a fresh, unused edge position with each cleave cycle — like a rotary cutter that always presents a new blade section. A rotation counter tracks the cumulative cycle count; the blade is replaced when the counter hits its rated maximum. [Fujikura CT-30A Manual, §5.1; Sumitomo FC-6S Guide, §4.3]

**Card 5**
*Front:* A technician is at the last workable fiber length. The previous cleave failed with hackle. What is the correct next step before re-cleaving?
*Back:* Diagnose before re-cleaving: index the blade to a fresh position (if unused positions remain) and re-clean the fiber with IPA. Don't re-cleave blind — address the root cause of the hackle first. If the failure was blade wear and no fresh positions remain, replace the blade before the next cleave. [BICSI OSP-DRD Manual, Ch. 7.3; Fujikura CT-30A Manual, §6]

---

## Multiple-Choice Quiz

---

**Q1.** A fusion splicer displays a cleave angle of 0.7° for a freshly cleaved OS2 SMF fiber. What is the correct action?

- A) Proceed with the splice — 0.7° is within the ≤1.0° threshold for fusion splicing
- B) Re-cleave the fiber; 0.7° exceeds the ≤0.5° threshold for single-fiber fusion splicing **[CORRECT]**
- C) Accept the splice but flag it as requiring OTDR verification before closure
- D) Re-cleave only if the splicer's estimated splice loss exceeds 0.10 dB

*Rationale:*
- **A — Incorrect.** The ≤1.0° threshold applies to mass-fusion ribbon splicing, not to single-fiber fusion work. Single-fiber fusion acceptance is ≤0.5°. A 0.7° angle will likely produce elevated splice loss on OS2 SMF and should be re-cleaved. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series operation manual]
- **B — Correct.** The ≤0.5° threshold is the acceptance limit for single-fiber OS2 fusion splicing. At 0.7°, the fiber exceeds the specification and must be re-cleaved. The splicer's image processor should flag this as a cleave error before the arc fires. [IEC 61300-3-35 §4.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** There is no "flag and proceed" option for a known out-of-spec cleave. The splice loss from a 0.7° combined angle error is likely to exceed the BICSI 0.10 dB per-splice acceptance threshold. Re-cleave is always the correct action for an out-of-spec cleave angle. [BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** Estimated splice loss is computed after the arc fires, not before. A splicer that allowed a 0.7° cleave to proceed would either auto-abort or produce an unreliable estimate on a known bad end-face. The cleave angle check occurs before the splice, not after. [Fujikura FSM-series; Sumitomo Type-82C operation manual]

---

**Q2.** A field technician observes a hazy, cloudy region across the fiber end-face under the splicer's inspection camera. The end-face is geometrically flat with no visible step or roughness. Which failure mode does this describe?

- A) Hackle
- B) Lip
- C) Mist **[CORRECT]**
- D) Angle error

*Rationale:*
- **A — Incorrect.** Hackle is characterized by visible surface roughness or striations — a textured, grainy end-face. The scenario describes a geometrically flat surface with a hazy optical quality, not surface roughness. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]
- **B — Incorrect.** A lip failure produces a stepped or raised edge on one side of the end-face — a geometrically non-planar surface. The scenario describes a flat surface with haze, not a step formation. [IEC 61300-3-35 §4]
- **C — Correct.** Mist is the cleave failure mode characterized by a hazy or cloudy region on an otherwise geometrically flat end-face, caused by sub-surface micro-fractures beneath the cleaved surface. Think of it as internal frosting. Typical causes: excessive tension or a compromised blade nick producing multiple sub-surface crack initiations. [IEC 61300-3-35 §4; Sumitomo FC-6S Guide, §4.2]
- **D — Incorrect.** Angle error produces a smooth, clear end-face with a measurably tilted fracture plane — the surface quality is good but the geometry is off-axis. It does not produce haze or cloudiness. [IEC 61300-3-35 §4]

---

**Q3.** A cleaver's blade rotation counter reads 15,800 on a model rated for 16,000 cleaves per blade. The technician needs to complete a 24-splice closure. What is the correct action?

- A) Complete all 24 splices — 200 cleave positions remain on the blade
- B) Replace the blade before beginning the closure; 200 positions is insufficient margin for 24 splices plus inevitable re-cleaves **[CORRECT]**
- C) Use the remaining 200 cleave positions, then swap the blade mid-closure when the counter reaches 16,000
- D) Continue using the blade until hackle failures increase; blade life ratings are conservative

*Rationale:*
- **A — Incorrect.** 200 remaining positions accounts for exactly 200 perfect cleaves with zero re-cleaves. A 24-splice closure on OSP cable realistically requires 24–40+ cleave cycles (two fibers per splice plus re-cleaves for failures). Entering a closure with 200 blade positions is high risk of blade exhaustion mid-closure. [Fujikura CT-30A Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.3]
- **B — Correct.** A 24-splice closure requires at minimum 48 cleave cycles (two fiber ends per splice) and typically 60–80 when re-cleaves are included. 200 remaining positions provides inadequate margin. Replacing the blade before a closure is the correct practice — interrupting a closure to swap blades risks fiber contamination, displaced splice sleeves, and timing pressure in adverse field conditions. [Fujikura CT-30A Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.3]
- **C — Incorrect.** Swapping a blade mid-closure is technically possible but operationally risky — the closure is open to the environment, unprotected fibers are exposed, and the blade change takes several minutes. Pre-closure blade replacement is the professional standard. [BICSI OSP-DRD Manual, Ch. 7.3]
- **D — Incorrect.** Blade life ratings are set by the manufacturer based on consistent score quality. A worn blade produces increasingly inconsistent results (not a clean step from "working" to "failed"), and the degradation begins before the rated count. Operating past the rated interval is a quality-process failure. [Fujikura CT-30A Manual, §5.1]

---

**Q4.** Which of the following root causes most commonly produces a "lip" failure mode during fiber cleaving?

- A) Blade contamination with index-matching gel
- B) Excessive tension setting for the fiber diameter in use
- C) Fiber not fully seated in the v-groove holder **[CORRECT]**
- D) Blade rotation counter reaching its rated cycle maximum

*Rationale:*
- **A — Incorrect.** Blade contamination would most likely produce mist or hackle (contamination of the score zone prevents a clean crack initiation) rather than a lip. A lip failure is geometrically caused by asymmetric fracture propagation, not surface contamination. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]
- **B — Incorrect.** Excessive tension most commonly produces mist or hackle. While extreme tension can produce irregular failures including lip-like steps, the primary cause of a lip is asymmetric release, not absolute tension magnitude. [IEC 61300-3-35 §4]
- **C — Correct.** A lip failure is caused by asymmetric tension release during fracture propagation — one side of the fiber releases before the other, creating a step. The most common root cause is the fiber not fully seated in the v-groove, causing one side of the cladding to be held at a slightly different height or angle during the tensile cycle. [IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6]
- **D — Incorrect.** A blade at end-of-life most commonly produces hackle rather than a lip. An exhausted blade produces any failure mode in unpredictable combinations, but the primary signature of blade wear is hackle, not lip formation. [Fujikura CT-30A Manual, §5.1; §6]

---

**Q5.** What is the correct cleave angle acceptance threshold for mass-fusion ribbon splicing?

- A) ≤ 0.5° per fiber
- B) ≤ 1.0° per fiber **[CORRECT]**
- C) ≤ 1.5° per fiber
- D) ≤ 2.0° per fiber

*Rationale:*
- **A — Incorrect.** ≤0.5° is the threshold for single-fiber fusion splicing, not mass-fusion ribbon work. Ribbon cleaving presents a wider end-face (12 or 24 fibers in a flat array) where achieving sub-0.5° across all fibers simultaneously is mechanically more demanding. The standard is accordingly relaxed to ≤1.0° for ribbon applications. [Fujikura FSM-60R/70R/90R operation manual; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Correct.** The acceptance threshold for mass-fusion ribbon splicing is **≤1.0° per fiber** across the ribbon end-face. This is double the single-fiber threshold, reflecting the geometric constraint of maintaining planarity across a multi-fiber array during simultaneous cleaving. [Fujikura FSM-60R/70R/90R operation manual; Sumitomo Type-71M+ guide; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** ≤1.5° is the threshold for mechanical splicing, not fusion splicing of any type. Mechanical splices use index-matching gel to compensate for small angular deviations; fusion splices require a tighter specification because the two glass surfaces are physically bonded. [BICSI OSP-DRD Manual, Ch. 7.3]
- **D — Incorrect.** A 2.0° angle error on a fusion-spliced ribbon would produce unacceptable loss on most or all fibers. No published fusion splicing specification accepts 2.0° end-face angle. [Fujikura FSM-60R/70R/90R operation manual]

---

**Q6.** A field technician has attempted four consecutive cleaves on the same fiber end. The first two produced hackle; the third and fourth produced mist. The cleaver's blade rotation counter shows 7,200 of a 16,000-cleave-rated blade. What is the most likely root cause and the correct corrective action?

- A) Blade is at end of life despite the counter reading; replace the blade
- B) Fiber surface is contaminated; re-clean with IPA on a fresh lint-free wipe before the next cleave **[CORRECT]**
- C) Tension is set too high; reduce by one increment and re-cleave
- D) The fiber diameter is incompatible with this cleaver model; use a different cleaver

*Rationale:*
- **A — Incorrect.** At 7,200 of 16,000 rated cleaves, the blade is at 45% of its life — well within normal service range. A blade failure pattern this early is not a blade wear issue. [Fujikura CT-30A Manual, §5.1]
- **B — Correct.** Changing failure modes across consecutive cleaves (hackle → mist) without changing any setup parameter suggests a single root cause affecting the fiber surface rather than the cleaver's mechanical state. Contamination on the fiber surface (index-matching gel residue, moisture, or skin oils) disrupts the score geometry and changes how the fracture propagates — producing variable failure modes. The correct action is to re-clean the fiber with a fresh IPA-dampened lint-free wipe immediately before the next cleave. [Fujikura CT-30A Manual, §6; Corning OSP Splicing Guide, §3.3]
- **C — Incorrect.** Reducing tension addresses mist but not hackle. If hackle was the primary failure, reducing tension would change the failure mode distribution but not resolve the underlying contamination issue. [IEC 61300-3-35 §4]
- **D — Incorrect.** A diameter mismatch would produce consistent holder-related angle errors or lip failures, not alternating hackle and mist. [Fujikura CT-30A Manual, §3.1]

---

## Final Check

Answer these three questions before advancing to Lesson 2.2 (Fusion Splicing I).

**Pulse 1.** State the cleave angle acceptance threshold for single-fiber fusion splicing on OS2 SMF, and identify the failure mode that would typically result from a dull blade.

*Expected answer:* The acceptance threshold for single-fiber fusion splicing is **≤0.5°** from perpendicular. A dull blade most commonly produces **hackle** — a rough, striated end-face caused by an inconsistent score depth that drives a non-planar fracture. [IEC 61300-3-35 §4.1; Fujikura CT-30A Manual, §5.1, §6; BICSI OSP-DRD Manual, Ch. 7.4]

**Pulse 2.** Name the four primary cleave failure modes and, for each, state the single most common root cause.

*Expected answer:*
1. **Hackle** — blade wear or fiber contamination (non-planar fracture from inconsistent score)
2. **Mist** — excessive tension or compromised blade nick (sub-surface micro-fractures from fast/multi-initiation fracture)
3. **Lip** — fiber not fully seated in the v-groove holder (asymmetric tension release)
4. **Angle error** — fiber not perpendicular in the holder, or mechanical damage to the cleaver body (tilted fracture plane)
[IEC 61300-3-35 §4; Fujikura CT-30A Manual, §6; Corning OSP Splicing Guide, §3.5]

**Pulse 3.** A technician is completing a 36-splice closure and the cleaver blade rotation counter reads 15,850 of 16,000. What should the technician do, and why?

*Expected answer:* Replace the blade **before** beginning the closure. A 36-splice closure requires at minimum 72 cleave cycles (two fiber ends per splice) plus additional cycles for re-cleaves — easily 90–110 total. Only 150 blade positions remain, which is far below the required margin. Beginning the closure with an inadequate blade margin risks exhausting the blade mid-closure, forcing a blade change with unprotected fibers exposed to the environment. Pre-closure blade replacement is the correct professional practice. [Fujikura CT-30A Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Cleave angle** → used in Lesson 2.2 (Fusion Splicing I — arc parameters require acceptable cleave as pre-condition), Lesson 2.3 (QA decision tree — cleave angle is first check), Lesson 2.4 (Mass-Fusion — ribbon cleave angle ≤1.0° threshold)
- **Hackle / mist / lip / angle error** → Lesson 2.3 (Fusion Splicing II — splicer image processor identifies these failure modes pre-arc)
- **Bare fiber** → every subsequent lesson in this topic; cleaving produces the bare end that all splicing and termination processes begin with
- **Blade life interval** → Lesson 2.4 (ribbon cleavers use the same rotation-counter mechanism)
- **IEC 61300-3-35** → Lesson 2.12 (Acceptance Testing — end-face inspection uses IEC 61300-3-35 zones for connector end-face pass/fail); Lesson 2.3 (QA criteria cite this standard for splice acceptance)
