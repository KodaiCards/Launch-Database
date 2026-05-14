---
title: "Lesson 3.2: Field Survey Methodology — Route Walking, Photo Documentation, and Station Offsets"
duration_min: 25
topic: osp-survey-route
order: 2
bicsi_alignment:
  - "OSP-DRD Ch. 3: Outside Plant Survey and Route Planning"
sources:
  - "BICSI OSP-DRD Manual, Ch. 3 (survey and route planning)"
  - "RUS Bulletin 1751F-630 §3 (field survey requirements)"
  - "AASHTO Utility Accommodation Policy Manual (public)"
  - "FHWA Utility Accommodation Policy and Standards (public)"
---

# Field Survey Methodology — Route Walking, Photo Documentation, and Station Offsets

## In Plain English

Before any cable goes in the ground, somebody has to walk the route and write down what's actually out there. Maps and satellite images are close — but they're never exactly right. A ditch the map doesn't show, a gas line the atlas missed, a fence that's not where the property record says it is — these things can blow up a job if you don't find them first. This lesson is about how to do that walk-down right: how to number every point along the route so everyone can find the same spot later, how to photograph what you see so the office has a real record, and how to decide whether you're doing a quick look-see or a full precision survey.

## Key Acronyms — Defined Here, Used Throughout

| Acronym | Stands for | What it means in plain English |
|---|---|---|
| **OSP** | Outside Plant | Fiber cable and equipment installed outside buildings — buried, aerial, or in conduit |
| **RUS** | Rural Utilities Service | The USDA program that funds rural fiber builds; sets documentation requirements your crew must follow on RUS jobs (see Lesson 3.1) |
| **GIS** | Geographic Information System | Digital map software that overlays roads, parcels, utilities, and terrain onto a satellite image |
| **GPS** | Global Positioning System | The satellite network your phone and survey equipment use to pinpoint location |
| **ROW** | Right-of-Way | The strip of land the road agency, railroad, or utility company has the legal right to use — your cable may need to run through it |
| **DOT** | Department of Transportation | The state or county agency that owns and maintains the road — they issue permits for work in their ROW |
| **FHWA** | Federal Highway Administration | The federal agency that sets standards for work on federally funded roads |
| **AASHTO** | American Association of State Highway and Transportation Officials | The organization that publishes the standard guide for how utilities work within road ROW |
| **BICSI** | Building Industry Consulting Service International | The professional organization that publishes the OSP Design Reference (OSP-DRD), the authoritative guide for fiber cable planning and construction |
| **IFC** | Issued for Construction | The version of the design drawings that the construction crew actually builds from — after all approvals are signed off |
| **WAAS** | Wide Area Augmentation System | A correction signal broadcast by satellites that improves GPS accuracy from ~15 ft down to ~3 ft — good enough for route scouting but not for final construction measurements |
| **811** | One-Call notification center | The national phone/online system you contact before digging; utilities then send crews to paint their underground lines on the ground surface so you don't cut through them |
| **NWI** | National Wetlands Inventory | A federal map database showing the location of wetlands — relevant because crossing a wetland may require a federal permit |
| **NRCS** | Natural Resources Conservation Service | The USDA agency that publishes the Web Soil Survey, a free online tool showing soil types along your route |
| **USFWS** | US Fish and Wildlife Service | The federal agency that maintains the NWI wetland maps and the Critical Habitat database |

---

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Establish a stationing baseline from a fixed reference point and record field observations using standard station offset notation
- Describe the required components of a GPS-tagged photo documentation set for an OSP field survey
- Distinguish between a reconnaissance survey and a design survey, and identify when each is appropriate
- Identify field conditions that commonly diverge from desk-research data and explain how each is handled in the field record

---

## Reading Content

### Two Types of Survey: Reconnaissance and Design

Think of it like this: a reconnaissance survey is the scouting trip — you drive or walk the route to make sure it's actually buildable before you spend real money. A design survey is the measuring tape — you come back with precision instruments after everything is approved and measure every foot of the route so the draftsman can draw it.

They serve completely different purposes, and sending the wrong crew at the wrong time costs money.

**Reconnaissance survey:** An initial walkthrough of a candidate alignment to assess feasibility and confirm or refute what the desk research found on a map. Think of it as a reality check — you're answering the question "is this actually buildable, and if not, where does the route need to change?" Crew size is one to two people. Equipment is basic: a GPS-capable smartphone or handheld GPS receiver, a measuring wheel, and a camera with GPS tagging turned on. The output is a field notes document and a GPS track log with observations at each notable point. A reconnaissance survey takes hours to a day per mile of route. You do this *before* you ask any landowners to sign easements or before you file any permit applications — because if you find a showstopper (a wetland that will require a federal permit, a utility that runs right under your planned cable centerline, a property boundary in the wrong place), you need to fix the alignment before you've committed to anything legally. [BICSI OSP-DRD Manual, Ch. 3]

**Design survey:** A precision measurement campaign that produces the exact numbers the engineer needs to draw construction-quality plans. Think of it like a contractor coming in with a laser level and a tape measure before building a deck — the rough feasibility check already happened, now you're getting the real numbers. Crew size is two to four people. Equipment includes a survey-grade GPS receiver (accurate to ±0.1 ft, much more precise than a phone) or a total station (a surveying instrument that measures angles and distances electronically), a measuring wheel, survey stakes and paint, and a camera. The output is precise station offsets to every pole location, handhole position, road crossing, and property boundary along the route — all accurate enough to appear on a construction drawing. A design survey happens *after* the route is approved and landowner agreements are signed, and *before* the construction drawings are finalized. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

The practical sequence for most rural OSP projects on RUS-funded work:
1. Reconnaissance survey (pre-easement, pre-permit) — confirm the route is real
2. Route approval — get the alignment accepted
3. Design survey — measure everything precisely
4. Construction drawings → IFC issue
5. Construction

Skipping the reconnaissance step and sending a design survey crew to an unvalidated alignment is a common and expensive mistake. If the route must be changed after the design survey, you've paid for survey work that gets thrown away.

### Stationing: The Address System for Your Route

Here's the analogy: imagine the route is a street, and you need to give every utility, property corner, and obstacle its own "address" so anyone — the draftsman in the office, the inspector on site, the ROW permit reviewer — can find the exact same spot. That's what stationing does.

Stationing is the linear measurement system used to identify every point along an OSP route from a fixed starting reference. It works like a milepost system, except in feet instead of miles. The standard format is:

**X+XX** — where X is the number of hundreds of feet, and XX is the remaining feet.

Here's how to read it:
- **Station 0+00** — the survey starting point. You pick something permanent and identifiable: an existing utility pole, a section corner monument, a building corner. This is your anchor point; every other measurement goes forward from here.
- **Station 1+00** — exactly 100 feet from the starting point
- **Station 12+75** — 1,275 feet from the starting point (12 × 100 = 1,200, plus 75 more = 1,275)
- **Station 26+40.5** — 2,640.5 feet from the starting point

The **survey baseline** is the imaginary line you're measuring along — usually the proposed cable centerline or the ROW edge. Everything that isn't on that baseline gets described with an **offset**: how far left or right it sits, measured perpendicular to the baseline, when you're standing on it and facing forward (facing toward increasing station numbers).

**Example:** `17+35, 8 ft RT` means: a utility marker located 1,735 feet from the survey starting point, 8 feet to the right of the baseline when you're facing forward.

Why does this matter? Because RUS documentation, state DOT utility permit applications, and OSP construction drawings all use this notation. When the inspector asks "where's that gas line crossing?" and you can say "station 17+35, 8 feet right," everyone can find it instantly — on the drawing and on the ground. Every pole position, handhole, road crossing, splice point, and property boundary gets its station and offset recorded before the field crew leaves the route. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]

### Photo Documentation Standards

Photos are your field-verification record. A good photo log is what proves, six months later during a design review or permit dispute, that the conditions you designed for actually existed on the ground. A bad photo log — or no photo log — leaves you dependent on memory and handwritten notes that might be illegible.

The key discipline is to take photos systematically, not just when something looks interesting. A complete photo log for an OSP field survey includes:

**Systematic station photos (the backbone of the log):**
- At each station point — every 100 ft on a design survey; every 500 ft or at notable features on a reconnaissance survey
- **Forward shot:** stand at the station, face forward (toward increasing station numbers), and photograph the next 100–300 feet of route in front of you
- **Backward shot:** turn around and photograph the route behind you — showing the segment you just covered
- Both shots must be GPS-tagged (latitude, longitude, elevation) and time-stamped by your camera or GPS receiver

A photo without GPS tagging is less than half as useful. With GPS metadata, every photo can be imported into GIS software and pinned to its exact ground location — creating a permanent, auditable map of what the route looked like at every point. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Feature-specific photos (the problem-catchers):**
- **Perpendicular shots at obstacles:** when you encounter a utility crossing, fence line, property boundary marker, stream bank, road crossing, or slope change, take at least one photo from perpendicular to your baseline — showing the obstacle in its full spatial context, not just a head-on view
- **811-marking photos:** when field-marking paint has been applied by utilities (this is what happens after you call 811 — the utility sends a crew to paint where their underground line is), photograph every marking from above and from the side, with a scale reference — a measuring tape or survey rod — visible in the frame so the dimensions are clear
- **Deviation shots:** any location where what you see in the field differs from what the maps showed — a ditch the GIS map doesn't show, a fence line that's 30 feet from where the parcel map puts it, a utility marker that doesn't appear in the 811 atlas

### Field Sketching Conventions

The field sketch is your paper (or tablet) record of spatial relationships the photo log can't fully capture. A photo shows you what something looks like; a sketch shows you where multiple things are *relative to each other*.

Standard conventions for OSP field sketches:
- **Scale:** reconnaissance surveys use approximate scale — "1 inch = 100 ft" is typical; design surveys use measured scale tied directly to station offsets
- **North arrow:** mandatory on every sketch sheet — without it, nobody can orient the sketch to a map or aerial photo
- **Property and ROW boundary callouts:** drawn as dashed lines with the owner name or parcel number noted — so the easement attorney and the designer know whose land the cable crosses
- **Utility crossing callouts:** show the crossing utility's type (gas, electric, water, existing fiber), its approximate depth if you can read it from the atlas or utility markings, and its station and offset position
- **Baseline direction arrows:** show which direction your stationing is increasing — so anyone reading the sketch can tell which way is "forward"

Field sketches don't need to be art. They need to be legible enough that a designer in the office — who wasn't there — can produce a construction drawing from the data without having to guess or interpret. Illegibility in a sketch introduces errors into the final drawing. [BICSI OSP-DRD Manual, Ch. 3]

### Crew Composition and Equipment

**Reconnaissance survey (1–2 persons):**
- GPS-capable smartphone or handheld GPS receiver (WAAS-enabled — WAAS stands for Wide Area Augmentation System, a satellite-based correction signal that improves GPS accuracy from about 15 ft down to about 3 ft, which is good enough for route scouting) *(WAAS-grade GPS is appropriate for route tracking and station referencing; resolving utility conflicts within ±2 ft requires survey-grade GPS or vacuum excavation — not WAAS alone. Combined with 811 atlas marking accuracy of ±3–10 ft, the compound error budget for WAAS reconnaissance is ±6–13 ft — insufficient for final utility separation design.)*
- Measuring wheel (a rolling device that counts feet as you walk)
- Survey spray paint (multiple colors — yellow for your proposed cable, red for electric utilities, blue for water, orange for communications)
- Photo log (phone camera with GPS tagging enabled)
- Field notebook or tablet with sketch pages
- Reflective vest, hard hat (required at all road crossings)

**Design survey (2–4 persons):**
- Survey-grade GPS receiver or total station (a total station is an electronic instrument that measures both angles and distances, accurate to ±0.1 ft — much more precise than a phone GPS)
- Measuring wheel
- Survey stakes and hub pins
- Survey spray paint
- Level rod and range pole (a tall rod the second person holds at the target point while the instrument operator reads the distance — it's the "flag" you measure to)
- 100-ft fiberglass or steel tape
- Camera or tablet with GPS tagging
- Field notebook

The two-person minimum for a design survey is both a safety and accuracy requirement. One person operates the instrument and records data; the other holds the range pole and identifies features in the field. Solo design surveying produces systematic errors — the kind you can't catch because you're doing two jobs at once — and those errors are expensive to fix after the fact. [RUS Bulletin 1751F-630 §3]

### When Field Conditions Diverge from Desk Research

Here's the most important mindset for field survey work: **the map was right when it was made. The ground is right now.** GIS data has positional errors of 5–50 feet for property boundaries, 3–10 feet for utility atlas records, and may be years out of date for surface features. Every field surveyor's primary job is to notice where what they see doesn't match what the desk research predicted — and to write it down.

Common divergences and the correct field action:

| What the desk research showed | What the field shows | What to do |
|---|---|---|
| GIS shows open field | Drainage ditch not on any map layer | Record station and offset, estimate depth and width, photograph forward/backward/perpendicular, flag in field notes for bore or crossing design |
| Parcel boundary at ROW edge per GIS | Fence line 30 ft inside the parcel from the GIS boundary | Record actual fence position at its station and offset; note the gap — it must be resolved in the easement documents |
| 811 atlas shows no utilities | 811 marking paint on the ground | Photograph all markings with a scale reference; record station and offset of each marking |
| Aerial imagery shows a row of trees | Trees have been removed; open field now | Update sketch and photo log; note the change from the imagery date — the design can now run through that area |
| DOT layer shows 50-ft ROW | ROW marker sign on ground shows 66-ft ROW | Record actual ROW marker position; the design drawings need the accurate width |

Each divergence gets recorded in the field notes at the station where it occurs, and flagged for design resolution back in the office. A divergence that isn't documented in the field becomes a construction problem — the cable installation crew doesn't have the office's GIS data when they hit the unmarked ditch at station 38+70. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

### Locating and Marking Existing Utilities in the Field

When you call 811 (the One-Call notification system), each registered utility sends a crew to mark the approximate horizontal position of their underground lines on the ground surface — paint or stakes, color-coded by utility type. The surveyor's job is to document every marking precisely.

For each 811 marking you encounter:
1. Record its position at station and offset
2. Photograph it with a scale reference (measuring tape or survey rod) visible
3. Note the color — this tells you the utility type:
   - **Red** = electric power
   - **Yellow** = gas, oil, or steam
   - **Blue** = water (potable or irrigation)
   - **Green** = sewer or drainage
   - **Orange** = communications or cable TV
   - **White** = proposed excavation area
4. Note the depth if visible from atlas records or any marking the utility crew placed
5. Flag any mark that appears to be at or near the proposed cable burial depth and within 2 feet horizontal of the proposed cable centerline — that's a direct conflict requiring a design change (deeper burial, horizontal offset, or bore through that section)

This determination — conflict or no conflict — cannot be made without the station offset data. Without knowing exactly where both the utility and the proposed cable centerline are, you're guessing. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]

---

## Key Terms (Flashcard Candidates)

**Stationing (station offset notation)**
A linear measurement system along a survey baseline. Format: X+XX where X is hundreds of feet, XX is additional feet. Think of it like addresses on a street: station 0+00 is the start, station 12+75 is 1,275 feet from the start. Offsets from the baseline are recorded as left (LT) or right (RT) in feet when facing forward (facing toward increasing station numbers). Used in RUS documentation, DOT utility permits, and OSP construction drawings. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]

**Reconnaissance survey**
A feasibility-level field walkthrough of a candidate alignment — the "scouting trip" before money is committed. Confirms desk-research findings and identifies field conditions that require route modification. Typically one to two persons; phone-grade GPS acceptable; output is field notes and GPS track log. Performed before easement negotiations or permit applications. [BICSI OSP-DRD Manual, Ch. 3]

**Design survey**
A precision measurement campaign producing station offsets, elevations, and feature positions at construction-drawing accuracy (typically ±1 ft horizontal). Requires survey-grade GPS or a total station. Think of it as the full measuring tape that comes after the route is approved and before the drawings are drafted. Performed on an approved alignment before construction drawings are issued. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Survey baseline**
The imaginary line you measure along — typically the proposed cable centerline or the ROW edge. Every feature along the route is described as a perpendicular offset (left or right, distance in feet) from the baseline at its station position. [BICSI OSP-DRD Manual, Ch. 3]

**GPS-tagged photo**
A field survey photograph with embedded GPS coordinates, elevation, and timestamp metadata. The GPS tag lets the photo be pinned to its exact ground location in GIS software, creating a permanent auditable map of field conditions at every station. Standard requirement for OSP field survey documentation. [RUS Bulletin 1751F-630 §3]

**811 utility field marking**
Paint or stakes applied to the ground surface by utilities in response to 811 One-Call notification, indicating the approximate horizontal position of their underground facilities. Color-coded by utility type (red = electric, yellow = gas, blue = water, orange = communications, green = sewer). Must be photographed with a scale reference and recorded at station and offset during the field survey. [FHWA Utility Accommodation Policy and Standards]

**Perpendicular shot**
A field survey photograph taken from a direction perpendicular (at a right angle) to the survey baseline, used to document obstacles, crossings, and boundary features so their spatial context is clear. Required at every obstacle — utility crossing, property boundary, road crossing, drainage feature — in addition to the forward and backward systematic station shots. [BICSI OSP-DRD Manual, Ch. 3]

---

## Interactive: Scenario — Reconnaissance vs. Design Survey

### Scenario

A telecom engineer has received a signed contract to design a 4.8-mile rural fiber route serving five farmstead locations and a grain elevator. The desk research phase has identified:

- The proposed alignment crosses one section-line township road (gravel, county-maintained)
- An NRCS Web Soil Survey shows 0.6 miles of the route cross heavy clay soils rated "highly corrosive to steel" — meaning any steel armor on the cable could rust out early if buried here
- The USFWS NWI layer shows a small wetland polygon (about 150 ft wide) at approximately 3.1 miles from the start — possibly a jurisdictional wetland that would require a federal Army Corps permit to cross
- 811 notification has been submitted and all three registered utilities along the route have indicated markings will be placed before the field date

The project is currently at the pre-easement stage — no landowner agreements have been signed yet. The engineer has a crew of two available for one day next week.

**Decision required:** Which type of survey should the crew perform, and what are the three highest-priority field observations to capture?

---

**Option A: Dispatch the full design survey crew with total station. Priority observations: (1) pole positions, (2) splice point locations, (3) construction drawings.**

*Assessment:*

This option deploys the wrong survey type at the wrong project stage. A design survey requires an approved alignment and signed easements to be efficient — performing it before easements are signed means the survey data may need to be completely redone if any landowner refuses access and the alignment must shift. Construction drawings cannot be produced from a pre-easement field day; they require a completed design survey on a finalized, approved alignment. [BICSI OSP-DRD Manual, Ch. 3]

**Feedback: Incorrect.** Design survey is premature before easements are signed.

---

**Option B: Dispatch a two-person reconnaissance survey. Priority observations: (1) the wetland polygon boundaries and surrounding access conditions at station ~3.1 miles, (2) the 811 utility markings along the full route — position, depth markings, potential conflicts with the proposed cable depth, (3) ground-truth the corrosive-soil segment for drainage, standing water, and any evidence that the soil is different from what the NRCS map shows.**

*Assessment:*

This is the correct decision and the correct priority set.

**(1) The wetland at station ~3.1 miles is the most likely project-stopper:** if the NWI polygon represents actual jurisdictional wetland (standing water, saturated soil, plants that grow in wet ground), crossing it adds a federal Army Corps of Engineers Section 404 permit to the schedule — which can add months and thousands of dollars. A reconnaissance visit answers: Does this area actually look like a wetland? Is there a way to route around the polygon? Can the cable bore under it without disturbing the surface in a way that triggers the permit? None of those questions can be answered from a map.

**(2) The 811 markings tell you where the real utilities are** — and whether any of them run directly under the proposed cable centerline. At the reconnaissance stage, finding that a gas line runs along the proposed cable alignment for 200 feet is actionable immediately: the alignment must shift before any easement documents are drafted. Finding it after the easements are signed and the drawings are done means redrawing and re-negotiating.

**(3) The corrosive-soil flag may change the cable specification.** The NRCS says it's "highly corrosive to steel" — but the NRCS map is accurate to only about ±100 feet in position. Confirming in the field whether the soil actually looks like the heavy clay the NRCS describes — versus a different native soil type — validates or refines that finding before the engineer specifies a cable with more expensive non-metallic construction. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Feedback: Correct.** Reconnaissance survey is appropriate pre-easement. The three highest-risk field conditions are the wetland (permit risk), the utility markings (direct conflict risk), and the corrosive-soil segment (cable specification risk).

---

**Option C: Skip the field survey entirely and proceed directly to construction drawings from desk research. Priority: produce drawings quickly for the easement agreement exhibits.**

*Assessment:*

Construction drawings produced from desk research alone carry all the accuracy limitations of GIS data — property boundaries accurate only to ±5–50 ft, utility atlas records accurate to ±3–10 ft, wetland polygon boundaries approximate, and no data whatsoever on drainage features that don't appear in any database. Using GIS-only drawings as easement exhibits risks signing legal agreements for a cable strip that doesn't align with where the cable will actually go — and creates construction conflicts that surface only when the installation crew is in the field. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Feedback: Incorrect.** Field survey is required before construction drawings. Desk research alone does not produce drawing-quality data.

---

## Multiple-Choice Quiz

---

**Q1.** A surveyor records a feature at station 23+45, 12 feet left of the survey baseline. What does this notation mean?

- A) The feature is 23.45 meters from the start, 12 feet above grade
- B) The feature is 2,345 feet from the survey starting point, 12 feet to the left when facing forward along the direction of increasing stations **[CORRECT]**
- C) The feature is 23 feet from the baseline and 45 feet above the starting elevation
- D) The feature is 12 miles and 45 feet from the nearest section corner

*Rationale:*
- **A — Incorrect.** Station notation in U.S. practice uses feet, not meters. The notation X+XX means X hundreds of feet plus XX additional feet. The vertical reference in field survey is elevation above datum, not a station-offset component. [RUS Bulletin 1751F-630 §3]
- **B — Correct.** Station 23+45 = 23 × 100 + 45 = 2,345 feet from the survey starting point (station 0+00). The offset "12 feet left" means 12 feet to the left of the survey baseline when facing forward in the direction of increasing station numbers. This is standard station offset notation used in RUS documentation and DOT utility permits. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]
- **C — Incorrect.** In station offset notation, the first number (before the +) is hundreds of feet from the start, not feet from the baseline. The vertical component (above or below baseline grade) is not encoded in a station offset notation — it is recorded separately as elevation. [RUS Bulletin 1751F-630 §3]
- **D — Incorrect.** Station notation has no relationship to township section corners or mileage units. It is a project-relative linear measurement from the survey starting point. [RUS Bulletin 1751F-630 §3]

---

**Q2.** During a reconnaissance survey, the field crew reaches a location where an 811 marking indicates a gas pipeline crosses the proposed cable alignment. The marking has no depth indicated. What is the correct field action?

- A) Skip the marking — gas pipeline crossings are handled by the gas utility during construction, not the survey
- B) Record the marking's station and offset, photograph it with a scale reference, and flag the crossing as a utility conflict requiring depth investigation and possible bore design **[CORRECT]**
- C) Remove the marking to avoid confusion with future survey markings
- D) Estimate the depth at 24 inches — gas pipelines are always installed at 24-inch minimum depth per ANSI/TIA-758-C

*Rationale:*
- **A — Incorrect.** Utility crossings are a design issue, not solely a construction issue. A gas pipeline crossing at the proposed cable centerline and burial depth may require a design change — deeper burial, horizontal offset, or bore — that must be reflected in construction drawings before field crews mobilize. The survey phase is the correct time to document the crossing for design resolution. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]
- **B — Correct.** The 811 marking indicates the approximate horizontal position of a gas pipeline. Without a depth indication, the exact depth is unknown and must be investigated — either through a utility pot-hole (hand-digging to expose the utility), contact with the gas utility for their record drawings, or a vacuum excavation. The reconnaissance record must capture the crossing at its station and offset, and the missing depth information must be flagged so it gets resolved before the final design is locked. Photographic documentation with a scale reference creates the auditable record. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]
- **C — Incorrect.** Survey markings are the legal property of the utility that placed them. Removing them is illegal and endangers excavation crews who depend on them to avoid striking the utility. [FHWA Utility Accommodation Policy and Standards]
- **D — Incorrect.** ANSI/TIA-758-C §6.3 establishes burial depth minimums for OSP fiber cable, not for gas pipelines. Gas pipeline burial depths are regulated by 49 CFR Part 192 (U.S. DOT) and vary by operating pressure, area classification, and installation year. A 24-inch assumption is not valid for gas pipeline depth estimation. [FHWA Utility Accommodation Policy and Standards]

---

**Q3.** A field crew is conducting a design survey and encounters a drainage ditch at station 18+60 that does not appear on any GIS layer used in desk research. The ditch is approximately 4 feet deep and 6 feet wide. What is the correct action?

- A) Ignore it — if it is not on a GIS layer, it is not a regulated feature
- B) Record the ditch at station 18+60 with depth, width, and offset measurements; photograph from forward, backward, and perpendicular; and flag it in the field notes for drainage crossing design **[CORRECT]**
- C) Fill the ditch before continuing the survey
- D) Reroute the entire survey baseline to avoid the ditch

*Rationale:*
- **A — Incorrect.** A feature's absence from a GIS layer does not determine whether it exists, whether it's regulated, or whether it affects the design. A 4-foot drainage ditch may require a bore or crossing design regardless of whether any map shows it. Ignoring it produces a construction drawing that omits a real obstacle the installation crew will encounter. [BICSI OSP-DRD Manual, Ch. 3]
- **B — Correct.** Any field feature that affects where or how the cable goes — drainage ditch, depression, unmarked utility, fence line — must be recorded in the field notes at its station and offset, photographed with standard documentation (forward, backward, perpendicular shots), and flagged for design resolution. The designer uses the field notes to determine whether the ditch requires a bore, a cable crossing at extra depth, or only a minor reroute. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]
- **C — Incorrect.** Filling a drainage ditch during a survey is unauthorized land disturbance on property the design team does not own and has no construction permit for. It may also violate local or state drainage ordinances. [BICSI OSP-DRD Manual, Ch. 3]
- **D — Incorrect.** A 4-foot ditch does not automatically require rerouting the entire baseline — it is a common field feature that may be crossable with a bore or a depressed cable segment. The baseline is rerouted only if the field observation reveals a genuine showstopper (for example, the ditch turns out to be a jurisdictional waterway requiring a federal permit that the budget can't support). That determination is made thoughtfully during field review, not reflexively on the ground. [BICSI OSP-DRD Manual, Ch. 3]

---

## Final Check

Answer before proceeding to Lesson 3.3.

**Pulse 1.** Explain the difference between a reconnaissance survey and a design survey, and state the project condition that determines which type is appropriate.

*Expected answer:* A reconnaissance survey is the scouting trip — one to two persons, phone-grade GPS, output is field notes and GPS track — performed before easement negotiations or permits are filed, to confirm desk-research findings and identify showstoppers early. A design survey is the precision measurement campaign — two to four persons, survey-grade GPS or total station, output is construction-quality station offsets — performed after the route is approved and easements are signed, before construction drawings are produced. The determining condition is project stage: reconnaissance is pre-approval/pre-easement; design survey is post-approval/post-easement. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Pulse 2.** A surveyor records a utility marking at station 31+20, 5 feet right of the survey baseline. The proposed cable centerline is at the survey baseline, and the proposed burial depth is 36 inches. The atlas record for this utility shows a depth of 30 inches. Does this represent a conflict, and what must be done?

*Expected answer:* Yes, this is a potential conflict. The utility is 5 feet to the right of the cable centerline — horizontal separation is 5 feet, which is adequate. However, the proposed burial depth (36 inches) is deeper than the utility's atlas depth (30 inches). That means the cable trench will be dug 6 inches below the utility. Digging that close below an existing utility risks undermining it or disturbing the soil it's resting on. The correct action: flag the location for a depth investigation — vacuum excavation or a utility pot-hole to confirm the actual utility depth — before finalizing the cable depth specification for that segment. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]

---

## Glossary Cross-References

- **Stationing / station offset notation** → Lesson 3.10 (construction drawings — station offsets appear on route plan sheets for every feature)
- **Reconnaissance vs. design survey** → Lesson 3.10 (construction drawings — design survey data feeds directly into drawing production)
- **811 utility field marking** → Lesson 3.5 (underground route design — utility separation requirements); Lesson 3.8 (crossings — utility crossings require station-offset documentation for bore design)
- **GPS-tagged photo log** → Lesson 3.12 (as-built documentation — installation photos are the photo log counterpart to survey photos in the final record)
- **Field deviation documentation** → Lesson 3.12 (as-built documentation — field deviations from the IFC drawing set must be recorded in the installation diary)
