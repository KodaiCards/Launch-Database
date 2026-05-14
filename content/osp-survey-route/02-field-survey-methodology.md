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

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Establish a stationing baseline from a fixed reference point and record field observations using standard station offset notation
- Describe the required components of a GPS-tagged photo documentation set for an OSP field survey
- Distinguish between a reconnaissance survey and a design survey, and identify when each is appropriate
- Identify field conditions that commonly diverge from desk-research data and explain how each is handled in the field record

---

## Reading Content

### Two Types of Survey: Reconnaissance and Design

A field survey is not a single thing — it is a spectrum from rough feasibility assessment to precise construction input, and deploying the right survey type at the right project stage avoids both under-investment (building on incomplete data) and over-investment (paying for survey-grade precision before the route is approved).

**Reconnaissance survey:** An initial walkthrough of a candidate alignment to assess feasibility and confirm or refute desk-research findings. Crew size: one to two people. Equipment: GPS receiver (phone-grade is acceptable), measuring wheel, photo log. Output: a field notes document and GPS track log with observations at each notable point. Decision output: is this alignment buildable? If not, where must it be modified? A reconnaissance survey takes hours to a day per mile of route and is the appropriate tool before easement negotiations or permit applications are filed. [BICSI OSP-DRD Manual, Ch. 3]

**Design survey:** A precise measurement campaign that produces the data required for construction drawings. Crew size: two to four people. Equipment: GPS receiver (survey-grade, ±0.1 ft), total station or laser distance measurer, measuring wheel, survey stakes and paint, photo log. Output: station offsets to every pole, handhole, crossing, and boundary feature along the route at precision sufficient for drawing production — typically ±1 ft horizontal for OSP construction drawings. A design survey follows route approval and is performed on the approved alignment before construction drawings are issued. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

The practical sequence for most rural OSP projects: reconnaissance survey (pre-easement, pre-permit) → route approval → design survey → construction drawings → IFC issue. Skipping reconnaissance and sending a design survey crew to an unvalidated alignment is a common cost mistake: if the alignment must be changed after design survey, the survey investment is partially lost.

### Stationing: The Baseline of Every Survey

Stationing is the linear measurement system used to identify every point along an OSP route from a fixed starting reference. The standard format is:

**X+XX** — where X is hundreds of feet and XX is additional feet.

- Station 0+00: the survey starting point (a fixed, permanent feature: an existing utility structure, a monument, a building corner)
- Station 1+00: 100 feet from the start
- Station 12+75: 1,275 feet from the start
- Station 26+40.5: 2,640.5 feet from the start

The survey baseline is the line of measurement — typically the proposed cable centerline or the ROW boundary. All features are recorded as offsets from the baseline: *left* or *right* (when facing forward along the baseline in the direction of increasing stations) and *distance in feet*.

**Example station offset notation:** `17+35, 8 ft RT` — a utility marker located 1,735 feet from the start, 8 feet to the right of the survey baseline.

Station offset notation is used in RUS documentation, state DOT utility permit applications, and OSP construction drawings. Every pole position, handhole, crossing, splice point, and boundary feature should be recorded with its station and offset before the field crew leaves the route. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]

### Photo Documentation Standards

Photo documentation is the field-verification record that supports every station observation. A complete photo log for an OSP route field survey includes:

**Systematic station photos:**
- At each survey station (every 100 ft on a design survey; every 500 ft or at notable features on a reconnaissance survey)
- **Forward shot:** facing forward along the baseline in the direction of increasing stations, showing the next 100–300 feet of route
- **Backward shot:** facing back toward the previous station, showing the route section just surveyed
- Both shots GPS-tagged with latitude, longitude, elevation, and timestamp from the camera or GPS receiver

**Feature-specific photos:**
- **Perpendicular shots at obstacles:** utility crossings, fence lines, property boundary markers, stream banks, road crossings, existing pole positions, slope changes — one or more photos from perpendicular to the baseline, showing the obstacle in its full context
- **811-marking photos:** when field-marking paint has been applied by utilities in response to 811 notification, photograph every marking from above and perpendicular, with a scale reference (measuring tape or survey rod) visible in the frame
- **Deviation shots:** any location where field conditions differ materially from desk-research data — a ditch that does not appear on any GIS layer, a property fence not at the parcel boundary position, a buried utility marker not in the 811 atlas

A photo without GPS tagging and timestamp is less than half as useful as a tagged photo. A field survey photo log with GPS metadata produces a permanent, auditable record that can be imported into GIS and mapped against the design centerline, confirming field conditions at every station. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

### Field Sketching Conventions

The field sketch is the paper (or digital tablet) record that captures spatial relationships the photo log cannot: relative positions of multiple features at the same station, ROW boundary positions, landowner structures, approach angles of crossing utilities. Standard conventions:

- **Scale:** reconnaissance surveys use approximate scale (1 inch = 100 ft typical); design surveys use measured scale tied to station offsets
- **North arrow:** mandatory on every sketch sheet
- **Property and ROW boundary callouts:** drawn as dashed lines with the owner name or parcel number noted
- **Utility crossing callouts:** show the crossing utility's type (gas, electric, water, existing fiber), approximate depth if visible from grade markings or atlas data, and station offset position
- **Baseline direction arrows:** show survey direction of increasing stations to orient the sketch against the photo log

Field sketches do not need to be architectural-quality drawings — they need to be legible enough for the designer to produce a construction drawing from the data. Illegibility in a field sketch is an accuracy problem: a sketch that must be interpreted or guessed during drawing production introduces errors. [BICSI OSP-DRD Manual, Ch. 3]

### Crew Composition and Equipment

**Reconnaissance survey (1–2 persons):**
- GPS-capable smartphone or handheld GPS receiver (WAAS-enabled, ±3 ft accuracy) *(WAAS-grade GPS is appropriate for route tracking and station referencing; resolving utility conflicts within ±2 ft requires survey-grade GPS or vacuum excavation — not WAAS alone. Combined with 811 atlas marking accuracy of ±3–10 ft, the compound error budget for WAAS reconnaissance is ±6–13 ft — insufficient for final utility separation design.)*
- Measuring wheel
- Survey spray paint (multiple colors — yellow for proposed cable, red for utilities, blue for water, orange for comm)
- Photo log (phone camera with GPS tagging enabled)
- Field notebook or tablet with sketch pages
- Reflective vest, hard hat (required at all road crossings)

**Design survey (2–4 persons):**
- Survey-grade GPS receiver or total station (±0.1 ft accuracy)
- Measuring wheel
- Survey stakes and hub pins
- Survey spray paint
- Level rod and range pole
- 100-ft fiberglass or steel tape
- Camera or tablet with GPS tagging
- Field notebook

The two-person minimum for a design survey is a safety and accuracy requirement: one person observes and records, one person holds the range pole and identifies features. Solo design surveying produces systematic errors that are expensive to correct after the fact. [RUS Bulletin 1751F-630 §3]

### When Field Conditions Diverge from Desk Research

The most important discipline of a field surveyor is active comparison of field conditions against desk-research predictions. GIS data is historical; the ground is current. Common divergences:

| Desk-research data | Field condition | Field action required |
|---|---|---|
| GIS shows open field | Drainage ditch not on any layer | Record station and offset; note depth estimate; flag for bore or crossing decision |
| Parcel boundary at ROW edge per GIS | Fence line 30 ft inside parcel from GIS boundary | Record actual fence position; note gap to be resolved in easement documents |
| Atlas shows no utilities | 811 marking paint on ground | Photograph all markings with scale reference; record station and offset of each |
| Aerial imagery shows row of trees | Trees removed; open field now | Update sketch and photo log; note change from imagery date |
| DOT layer shows 50-ft ROW | Sign at ROW marker shows 66-ft ROW | Record actual ROW marker position; update design drawings |

Each divergence is recorded in the field notes at the station where it occurs and flagged for resolution during drawing production. A divergence that is not documented in the field becomes a construction problem — the crew installing cable does not have the office data available when they encounter the unmarked ditch at station 38+70. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

### Locating and Marking Existing Utilities in the Field

811 notifications trigger utility field-marking — utilities paint or stake their underground lines at the ground surface. The surveyor's responsibility during the field survey is to:

1. Record the position of each mark at station and offset
2. Photograph each mark with a scale reference
3. Note the color (color code: red = electric, yellow = gas/oil/steam, blue = water, green = sewer/drainage, orange = communications/cable TV, white = proposed excavation)
4. Estimate the depth if visible from atlas records or utility personnel markings
5. Flag any marks that appear to represent a depth or position that conflicts with the proposed cable route

A utility marking at the proposed cable burial depth and within 2 feet horizontal of the proposed cable centerline is a direct conflict requiring redesign — deeper burial, offset installation, or bore. This determination cannot be made without the field survey station offset data. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]

---

## Key Terms (Flashcard Candidates)

**Stationing (station offset notation)**
A linear measurement system along a survey baseline. Format: X+XX where X is hundreds of feet, XX is additional feet. Offsets from the baseline recorded as left (LT) or right (RT) in feet when facing forward along the direction of increasing stations. Used in RUS documentation, DOT utility permits, and OSP construction drawings. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]

**Reconnaissance survey**
A feasibility-level field walkthrough of a candidate alignment to confirm desk-research findings and identify field conditions that require route modification. Typically one to two persons; phone-grade GPS acceptable; output is field notes and GPS track log. Performed before easement negotiations or permit applications. [BICSI OSP-DRD Manual, Ch. 3]

**Design survey**
A precision measurement campaign producing station offsets, elevations, and feature positions at construction-drawing accuracy (typically ±1 ft horizontal). Requires survey-grade GPS or total station. Performed on an approved alignment before construction drawings are issued. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Survey baseline**
The line of measurement along which stations are counted. Typically the proposed cable centerline or the ROW edge. All features are recorded as perpendicular offsets from the baseline at their station position. [BICSI OSP-DRD Manual, Ch. 3]

**GPS-tagged photo**
A field survey photograph with embedded GPS coordinates, elevation, and timestamp metadata. Enables post-survey import into GIS for spatial correlation against design data. Standard requirement for OSP field survey documentation. [RUS Bulletin 1751F-630 §3]

**811 utility field marking**
Paint or stakes applied to the ground surface by utilities in response to 811 One-Call notification, indicating the approximate horizontal position of their underground facilities. Color-coded by utility type (red = electric, yellow = gas, blue = water, orange = communications, green = sewer). Must be photographed and station-offset-recorded during field survey. [FHWA Utility Accommodation Policy and Standards]

**Perpendicular shot**
A field survey photograph taken from a direction perpendicular to the survey baseline, used to document obstacles, crossings, and boundary features in their spatial context. Required at every obstacle (utility crossing, property boundary, road crossing, drainage feature) in addition to the forward and backward systematic station shots. [BICSI OSP-DRD Manual, Ch. 3]

---

## Interactive: Scenario — Reconnaissance vs. Design Survey

### Scenario

A telecom engineer has received a signed contract to design a 4.8-mile rural fiber route serving five farmstead locations and a grain elevator. The desk research phase has identified:

- The proposed alignment crosses one section-line township road (gravel, county-maintained)
- An NRCS Web Soil Survey shows 0.6 miles of the route cross heavy clay soils rated "highly corrosive to steel"
- The USFWS NWI layer shows a small wetland polygon (~150 ft wide) at approximately 3.1 miles from the start
- 811 notification has been submitted and all three registered utilities along the route have indicated markings will be placed before the field date

The project is currently at the pre-easement stage — no landowner agreements have been signed. The engineer has a crew of two available for one day next week.

**Decision required:** Which type of survey should the crew perform, and what are the three highest-priority field observations to capture?

---

**Option A: Dispatch the full design survey crew with total station. Priority observations: (1) pole positions, (2) splice point locations, (3) construction drawings.**

*Assessment:*

This option deploys the wrong survey type at the wrong project stage. A design survey requires an approved alignment and signed easements to be efficient — performing it before easements are signed means the survey data may need to be redone if any landowner refuses access and the alignment must be shifted. Construction drawings cannot be produced from a pre-easement field day; they require a complete design survey on a finalized alignment. [BICSI OSP-DRD Manual, Ch. 3]

**Feedback: Incorrect.** Design survey is premature before easements are signed.

---

**Option B: Dispatch a two-person reconnaissance survey. Priority observations: (1) the wetland polygon boundaries and surrounding access conditions at station ~3.1 miles, (2) the 811 utility markings along the full route (position, depth markings, potential conflicts with proposed cable depth), (3) ground-truth the corrosive-soil segment for drainage, standing water, and any evidence of a different soil type than the NRCS layer shows.**

*Assessment:*

This is the correct decision and the correct priority set.

(1) The wetland at station ~3.1 miles is the most likely fatal flaw: if the NWI polygon represents actual jurisdictional wetland, a Section 404 permit adds time and cost. Reconnaissance at that station identifies: does the area look like a wetland (standing water, hydrophytic vegetation, saturated soils)? Is there a viable route around the polygon? Can the cable bore under it without surface disturbance that triggers Section 404? These questions can only be answered from the field.

(2) The 811 markings represent three utilities whose position relative to the proposed cable route cannot be resolved from atlas data. At the reconnaissance stage, finding a utility that runs directly beneath the proposed cable centerline for 200 feet is actionable immediately — the alignment must shift before easement documents are drawn.

(3) The corrosive-soil segment may affect cable specification (dielectric armor instead of CST). Confirming the soil characteristics in the field — drainage, surface texture, standing water — validates or refines the NRCS finding, which is at ±100 ft positional accuracy. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Feedback: Correct.** Reconnaissance survey is appropriate pre-easement; the three highest-risk field conditions are the wetland (permit risk), the utility markings (direct conflict risk), and the corrosive-soil segment (cable specification impact).

---

**Option C: Skip the field survey entirely and proceed directly to construction drawings from desk research. Priority: produce drawings quickly for the easement agreement exhibits.**

*Assessment:*

Construction drawings produced from desk research data alone carry all the accuracy limitations of GIS-approximate data: parcel boundaries ±5–50 ft, utility atlas records ±3–10 ft, NWI wetland boundaries approximate, potential unmapped drainage features. Using GIS-only drawings as easement agreement exhibits risks easement strips that do not align with actual property boundaries and construction conflicts that emerge during installation. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

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
- **B — Correct.** Station 23+45 = 2,345 feet from the survey starting point (station 0+00). The offset "12 feet left" means 12 feet to the left of the survey baseline when facing forward in the direction of increasing station numbers. This is standard station offset notation used in RUS documentation and DOT utility permits. [RUS Bulletin 1751F-630 §3; AASHTO Utility Accommodation Policy Manual]
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
- **B — Correct.** The 811 marking indicates the approximate horizontal position of a gas pipeline. Without a depth indication, the exact depth is unknown and must be investigated — either through a utility pot-hole, contact with the gas utility for record drawings, or a vacuum excavation. The reconnaissance record must capture the crossing at its station and offset, and the absence of depth information must be flagged so it is resolved before final design. Photographic documentation with a scale reference creates the auditable record. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]
- **C — Incorrect.** Survey markings are the property of the utility that placed them. Removing them is illegal and endangers excavation crews who rely on them to avoid striking the utility. [FHWA Utility Accommodation Policy and Standards]
- **D — Incorrect.** ANSI/TIA-758-C §6.3 establishes burial depth minimums for OSP fiber cable, not gas pipelines. Gas pipeline burial depths are regulated by 49 CFR Part 192 (DOT) and vary by operating pressure, class location, and installation year. A 24-inch assumption is not valid for gas pipeline depth estimation. [FHWA Utility Accommodation Policy and Standards]

---

**Q3.** A field crew is conducting a design survey and encounters a drainage ditch at station 18+60 that does not appear on any GIS layer used in desk research. The ditch is approximately 4 feet deep and 6 feet wide. What is the correct action?

- A) Ignore it — if it is not on a GIS layer, it is not a regulated feature
- B) Record the ditch at station 18+60 with depth, width, and offset measurements; photograph from forward, backward, and perpendicular; and flag it in the field notes for drainage crossing design **[CORRECT]**
- C) Fill the ditch before continuing the survey
- D) Reroute the entire survey baseline to avoid the ditch

*Rationale:*
- **A — Incorrect.** GIS data absence does not determine whether a feature exists, is regulated, or affects the design. A 4-foot drainage ditch may require a bore or crossing design regardless of its GIS presence. Ignoring it produces a construction drawing that omits a real field obstacle, which the installation crew will encounter. [BICSI OSP-DRD Manual, Ch. 3]
- **B — Correct.** Any field feature that affects the cable installation — drainage ditch, depression, unmarked utility, fence line — must be recorded in the field notes at its station offset, photographed with standard documentation (forward, backward, perpendicular), and flagged for design resolution. The designer uses the field notes to determine whether the ditch requires a bore, a cable crossing at depth, or a reroute of the final few feet of the conduit run. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]
- **C — Incorrect.** Filling a drainage ditch during a survey is unauthorized land disturbance on a property the design team does not own or have a construction permit for. It may also violate local or state drainage ordinances. [BICSI OSP-DRD Manual, Ch. 3]
- **D — Incorrect.** A 4-foot ditch does not inherently require baseline rerouting — it is a common field feature that may be crossable with a bore or depressed cable segment. The baseline should only be rerouted if the field observation reveals a fatal flaw (e.g., the ditch is actually a jurisdictional waterway requiring an unacceptable permit). That determination is made during field review, not reflexively on the ground. [BICSI OSP-DRD Manual, Ch. 3]

---

## Final Check

Answer before proceeding to Lesson 3.3.

**Pulse 1.** Explain the difference between a reconnaissance survey and a design survey, and state the project condition that determines which type is appropriate.

*Expected answer:* A reconnaissance survey is a feasibility-level walkthrough — one to two persons, phone-grade GPS, output is field notes and GPS track — performed to confirm desk-research findings and identify fatal flaws before easement negotiations or permits are filed. A design survey is a precision measurement campaign — two to four persons, survey-grade GPS or total station, output is construction-quality station offsets — performed on an approved alignment after easements are signed and before construction drawings are produced. The determining condition is project stage: reconnaissance is pre-approval/pre-easement; design survey is post-approval/post-easement. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §3]

**Pulse 2.** A surveyor records a utility marking at station 31+20, 5 feet right of the survey baseline. The proposed cable centerline is at the survey baseline, and the proposed burial depth is 36 inches. The atlas record for this utility shows a depth of 30 inches. Does this represent a conflict, and what must be done?

*Expected answer:* Yes, this is a potential conflict. The proposed cable centerline is at the survey baseline; the utility is 5 feet to the right of the baseline, so horizontal separation is 5 feet — adequate. However, the proposed burial depth (36 inches) exceeds the utility's atlas depth (30 inches), meaning the cable trench will be dug deeper than the utility. A trench at 36 inches near a utility at 30 inches is not a direct crossing conflict, but the depth differential creates a zone where the installation crew could undermine or disturb the utility during excavation. The correct action: flag for depth investigation (vacuum excavation or pot-hole to confirm actual utility depth) before finalizing the cable depth specification for that segment. [FHWA Utility Accommodation Policy and Standards; RUS Bulletin 1751F-630 §3]

---

## Glossary Cross-References

- **Stationing / station offset notation** → Lesson 3.10 (construction drawings — station offsets appear on route plan sheets for every feature)
- **Reconnaissance vs. design survey** → Lesson 3.10 (construction drawings — design survey data feeds directly into drawing production)
- **811 utility field marking** → Lesson 3.5 (underground route design — utility separation requirements); Lesson 3.8 (crossings — utility crossings require station-offset documentation for bore design)
- **GPS-tagged photo log** → Lesson 3.12 (as-built documentation — installation photos are the photo log counterpart to survey photos in the final record)
- **Field deviation documentation** → Lesson 3.12 (as-built documentation — field deviations from the IFC drawing set must be recorded in the installation diary)
