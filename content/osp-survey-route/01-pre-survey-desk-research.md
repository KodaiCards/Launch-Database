---
title: "Lesson 3.1: Pre-Survey Desk Research — GIS, Parcel Data, and Utility Records"
duration_min: 20
topic: osp-survey-route
order: 1
bicsi_alignment:
  - "OSP-DRD Ch. 3: Outside Plant Survey and Route Planning"
sources:
  - "BICSI OSP-DRD Manual, Ch. 3 (survey and route planning)"
  - "RUS Bulletin 1751F-630 §2 (pre-construction planning requirements)"
  - "USGS National Map Viewer (public domain)"
  - "NRCS Web Soil Survey (public domain)"
  - "FEMA Flood Map Service Center — FIRM panels (public domain)"
  - "FHWA utility accommodation policy guidance (public)"
---

# Pre-Survey Desk Research — GIS, Parcel Data, and Utility Records

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the primary public data sources used in OSP pre-survey desk research and state what each source contributes to route planning
- Distinguish between GIS-approximate data and survey-grade data, and explain why field verification remains required after desk research is complete
- Apply the fatal-flaw screening concept to identify alignment showstoppers before committing to a field survey
- Describe the 811 One-Call pre-notification requirement and its role in field survey preparation

---

## Reading Content

### Why Desk Research Comes First

A well-executed desk research phase is one of the highest-leverage investments in an OSP project. In two to four hours at a computer, a route designer can resolve the majority of an alignment, identify conflicts that would otherwise consume days of field crew time, and eliminate routes with fatal flaws before a single stake is driven. RUS Bulletin 1751F-630 §2 treats pre-construction planning as a mandatory project phase, not an optional step, for exactly this reason: a crew that arrives at a field site without desk research is solving problems that should have been solved in the office.

The desk research phase accomplishes three things:

1. **Establishes a candidate alignment** using publicly available mapping data — the proposed cable route, including ROW corridors, crossing locations, and approximate pole or conduit positions.
2. **Identifies constraints** — property boundaries, protected areas, existing utilities, zoning restrictions, and other features that limit or prohibit the proposed alignment.
3. **Screens for fatal flaws** — conflicts severe enough to require realigning the route entirely, before any field work is committed.

### The Core Desk Research Toolkit

**County GIS Parcel Viewers**

County assessor and GIS portals provide parcel boundary data, property ownership records, and zoning classification for every parcel along a proposed route. For an OSP route that will require easements or cross private property, parcel data answers the foundational ownership question: who must be contacted for right-of-entry? Most county GIS viewers are publicly accessible without registration and export data in standard formats (shapefile, KML, GeoJSON).

Accuracy caveat: county parcel layers are maintained by county assessors for tax purposes, not for survey-grade alignment. Parcel boundary lines in a GIS viewer may be offset by 5 to 50 feet from the true legal boundary on the ground. Never use parcel GIS data as a substitute for a licensed survey of a property line. [BICSI OSP-DRD Manual, Ch. 3]

**State DOT Roadway and ROW Data**

State departments of transportation publish centerline data, ROW boundary extents, and pavement management data as open GIS layers. For an aerial route that follows a state road, or an underground route that requires a road bore, the DOT ROW layer establishes the ROW width, which determines where an underground conduit must be placed relative to the pavement edge and where aerial poles can be set within state ROW.

Most state DOTs also publish utility accommodation manuals that define what categories of utility work are permitted in state ROW, what depths are required, and what permit types apply. These manuals are free to download and are indispensable for routes crossing or paralleling state road ROW.

**USGS Topographic and Hydrologic Data**

The USGS National Map Viewer provides 1/3-arc-second digital elevation data and 1:24,000-scale topographic layers for the entire continental United States. Key layers for OSP desk research:

- **Elevation:** Identifies ridgelines, valleys, and grade breaks that affect aerial span lengths, conduit bore geometry, and vibratory plow feasibility.
- **Waterbody and stream layers:** Identifies streams, rivers, ponds, and wetlands. Any waterbody crossing triggers USACE permit review (Lessons 3.8 and 3.11 cover permit classes).
- **National Wetlands Inventory (NWI) layer:** Federal wetland mapping maintained by the USFWS; available as a GIS overlay. Wetland areas may require Section 404 USACE permits for any ground disturbance, regardless of whether open water is visible. Wetland boundaries on the NWI layer are desktop indicators only — confirmed wetland delineation requires a licensed wetland biologist in the field.

**NRCS Web Soil Survey**

The USDA Natural Resources Conservation Service (NRCS) Web Soil Survey provides county-level soil classification maps linked to engineering properties: bearing capacity, drainage class, corrosivity rating, shrink-swell potential, and depth to rock or restrictive layers. For OSP route planning, the relevant outputs are:

- **Corrosivity to steel:** indicates whether CST armor is at elevated risk of electrolytic corrosion along the route; affects cable selection and may trigger dielectric armor substitution.
- **Depth to bedrock or hard restrictive layer:** a 12-inch depth to rock across a planned conduit segment triggers a rock-saw or bore specification instead of trenching; failure to identify this at the desk means field crews mobilize with equipment unsuited to the soil conditions.
- **Drainage class:** poorly drained soils correlate with high water table, which affects burial depth calculations and splice closure accessibility. [RUS Bulletin 1751F-630 §2]

**FEMA Flood Insurance Rate Maps (FIRM)**

FEMA FIRM panels identify Special Flood Hazard Areas (SFHA) — the 100-year floodplain. Any OSP construction within an SFHA may require a floodplain development permit from the local floodplain administrator, and cable burial depths in an SFHA should account for scour — the erosive removal of soil from a streambed or floodplain during high-water events. A cable buried 24 inches in normal soil may be exposed by scour in an SFHA without additional depth or armoring.

**811 One-Call Utility Atlas Records**

Before any digging, federal and state law requires a One-Call pre-notification to 811 (the national dig-safe line). The 811 system notifies all registered utilities — electric, gas, water, wastewater, telecom, fiber — of the proposed dig location so they can field-mark their underground facilities before excavation begins. Failure to notify is a legal violation in every state and creates direct liability for damage to unmarked utilities.

For desk research purposes, some states and utilities publish utility atlas records — GIS layers showing the approximate locations of registered underground infrastructure. These are best-effort records; not all utilities update their atlas data promptly, and the positional accuracy of atlas records varies widely. Atlas data is a starting point for identifying likely utility conflicts along a route, not a substitute for 811 notification and field-marking. [FHWA utility accommodation policy guidance]

**Aerial and Satellite Imagery**

Commercial aerial and satellite imagery platforms (Google Maps, Google Earth, Bing Maps, ESRI World Imagery) provide current high-resolution surface imagery for route reconnaissance. Imagery layers supplement GIS vector data by showing surface features that GIS layers may not capture: driveway cuts, farm gates, drainage tile outlets, recently planted windbreaks, above-ground utility features, and surface evidence of underground infrastructure (utility bore pits, trench scars, access risers).

Imagery has a publication lag — the current surface condition may differ from imagery captured 12 to 36 months earlier. Major construction, vegetation clearing, and new development should be field-confirmed rather than assumed from imagery.

### Fatal-Flaw Screening

The purpose of desk research is not to produce a final route — it is to identify the conflicts that must be resolved before the route can be committed to field survey. Fatal-flaw screening means specifically asking, for each segment of the candidate alignment: *Is there a constraint here that makes this segment impossible or prohibitively expensive?*

Fatal-flaw categories for OSP routes:

| Flaw category | Data source | Result if identified at desk |
|---|---|---|
| Protected wetland across alignment | USFWS NWI layer; FEMA FIRM | Realign to avoid; or plan Section 404 permit and add 8–16 weeks to schedule |
| Railroad ROW across alignment | DOT rail layer; county GIS | Identify railroad owner; initiate permit process 90 days before construction |
| Private easement conflict | County parcel; title search | Renegotiate easement or realign |
| Depth to rock < 12 in. on planned conduit segment | NRCS WSS | Budget rock saw; or reroute to avoid |
| 100-year floodplain on planned burial route | FEMA FIRM | Increase burial depth; obtain floodplain permit; evaluate aerial alternative |
| Historic property or tribal cultural area | State SHPO database; THPO | NHPA Section 106 review required; RUS projects have mandatory review |

Any fatal flaw identified at the desk is resolved with a few hours of redesign and data review. The same flaw identified on a field survey day costs a crew mobilization, time, and money. Identified in the middle of a permit review, it can delay a project by months. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §2]

### Data Quality and the Field-Verification Requirement

Every public GIS dataset carries an accuracy limitation that must be understood before the data is used for construction alignment:

- County parcel layers: ±5 to 50 ft positional accuracy
- USGS topographic elevation: ±3 to 15 ft vertical accuracy
- NWI wetland boundaries: desktop approximation; confirmed delineation requires field survey
- 811 atlas utility records: ±3 to 10 ft typical; some utilities are unmapped entirely
- NRCS soil maps: 1:12,000 to 1:24,000 scale; individual soil boundaries ±100 ft

The implication is direct: desk research data drives the candidate alignment and fatal-flaw screening, but it does not replace a field survey. Every constraint identified at the desk must be field-verified before a construction drawing is issued. Every property boundary that the cable will cross must be confirmed against a survey-grade legal description. Every utility conflict identified in atlas records must be confirmed by 811 notification and field-marking. [BICSI OSP-DRD Manual, Ch. 3]

---

## Key Terms (Flashcard Candidates)

**Fatal-flaw screening**
The desk-research process of identifying alignment segments where a constraint — protected wetland, railroad ROW, easement conflict, rock at shallow depth — makes construction impossible or prohibitively expensive, before field survey resources are committed. Resolving fatal flaws at the desk is orders of magnitude less expensive than identifying them during field survey or permit review. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §2]

**NRCS Web Soil Survey**
A USDA online platform providing county-level soil classification maps with engineering property data including corrosivity to steel, drainage class, shrink-swell potential, and depth to bedrock. The primary desk-research source for burial feasibility and cable construction decisions driven by soil chemistry. [RUS Bulletin 1751F-630 §2]

**National Wetlands Inventory (NWI)**
A USFWS-maintained GIS layer mapping wetlands across the continental United States. NWI polygons are desktop-identification indicators; confirmed wetland boundaries require field delineation by a licensed wetland biologist. Crossings of NWI-mapped areas trigger USACE Section 404 permit review. [FHWA utility accommodation policy guidance]

**FEMA FIRM (Flood Insurance Rate Map)**
FEMA panels that delineate Special Flood Hazard Areas (SFHA) — the 100-year floodplain. OSP construction within an SFHA may require a local floodplain development permit and additional burial depth to account for scour. [FEMA Flood Map Service Center, public domain]

**811 One-Call pre-notification**
The federal and state-mandated requirement to notify the 811 dig-safe system before any excavation, so registered utilities can field-mark underground facilities. Legal requirement in all 50 states. Atlas records are a supplement, not a substitute; 811 notification and field-marking must occur before digging. [FHWA utility accommodation policy guidance]

**GIS-approximate vs. survey-grade data**
GIS layers maintained for administrative purposes (parcel, ROW, utility atlas) are approximate in position — typically ±5 to 50 ft or more. Survey-grade data (licensed survey, GPS-controlled field measurement) is ±0.1 to 1 ft. OSP construction alignment requires survey-grade data for property boundary crossings and legal easement descriptions; GIS data is sufficient for desk research and fatal-flaw screening. [BICSI OSP-DRD Manual, Ch. 3]

**One-Call utility atlas**
GIS layers published by utilities or One-Call organizations showing approximate locations of registered underground infrastructure. Accuracy varies by utility and update frequency. Atlas data identifies likely conflicts for desk research; it does not replace 811 notification and field-marking prior to excavation. [FHWA utility accommodation policy guidance]

---

## Interactive: Multiple-Choice Quiz

---

**Q1.** During desk research for a 6-mile rural OSP route, the USGS National Map Viewer shows two stream crossings and the USFWS NWI layer shows a mapped wetland polygon 400 feet long across the candidate alignment. What is the correct desk-research response?

- A) Proceed to field survey — NWI polygons are approximate and may not represent actual wetlands in the field
- B) Flag both crossings as fatal-flaw candidates requiring USACE Section 404 review; realign or plan permit and schedule accordingly before committing to field survey **[CORRECT]**
- C) Remove the wetland segment from the design and bill the client for the shortened route
- D) Contact FEMA to request a map amendment removing the wetland polygon from the alignment

*Rationale:*
- **A — Incorrect.** NWI polygons are approximate, but they are not disregardable. An NWI mapping represents a documented site of likely jurisdictional wetland. The appropriate desk response is to flag the segment for Section 404 review and plan accordingly — either realign to avoid the polygon entirely, or add a permit phase (8–16 weeks typical) to the project schedule. Proceeding to field survey without this flag means the crew may walk a route with a fundamental permit constraint unresolved. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §2]
- **B — Correct.** USFWS NWI polygons represent USACE-regulated wetlands at the desktop-identification level. Crossing a mapped wetland requires USACE Section 404 permit review (Nationwide Permit 12 for most OSP utility crossings, subject to conditions). Stream crossings may additionally require Section 10 review for navigable waters. Both should be flagged as fatal-flaw candidates during desk research, and project scheduling should account for the permit timeline. [BICSI OSP-DRD Manual, Ch. 3; FHWA utility accommodation policy guidance]
- **C — Incorrect.** A route designer cannot unilaterally shorten a route because of a constraint. The client's project requirements define the end points; the designer's responsibility is to find a feasible alignment or plan the permits required for the proposed alignment. [BICSI OSP-DRD Manual, Ch. 3]
- **D — Incorrect.** FEMA FIRM panel amendments (Letters of Map Amendment) address flood zone designations, not wetland inventory. NWI maps are maintained by USFWS, not FEMA, and are not subject to a private-party amendment process for individual projects. [FEMA Flood Map Service Center, public domain]

---

**Q2.** An OSP route designer is using a county GIS parcel viewer to plan easement acquisition along a 3-mile route. The parcel boundaries show 14 private parcels crossed by the alignment. What is the primary limitation the designer must understand about this data before using it for easement negotiations?

- A) County parcel data is fee-based and requires a subscription to use for commercial design purposes
- B) County parcel boundary data has positional accuracy of ±5 to 50 feet and cannot substitute for survey-grade legal boundary determination **[CORRECT]**
- C) Parcel viewers only show parcels with structures — vacant land parcels are not included
- D) GIS parcel data is only accurate in urban areas; rural parcel boundaries are not mapped digitally

*Rationale:*
- **A — Incorrect.** County parcel and assessor GIS viewers are public records in most jurisdictions and are freely accessible without subscription for planning purposes. Some jurisdictions require formal data licensing for commercial reproduction, but the data is accessible for design use. [BICSI OSP-DRD Manual, Ch. 3]
- **B — Correct.** County parcel GIS layers are maintained by county assessors for tax purposes, not for engineering-grade alignment. The positional accuracy of parcel boundary lines in a GIS viewer can be ±5 to 50 feet or more from the true legal boundary, depending on the county's digitization methods and the age of the underlying plat data. Easement negotiations require a legally defensible description of the easement strip, which requires a licensed survey of the property boundary — GIS parcel data does not provide this. [BICSI OSP-DRD Manual, Ch. 3]
- **C — Incorrect.** Parcel viewers map all parcels by tax parcel identifier (APN), including vacant land, agricultural parcels, and right-of-way parcels. Coverage is generally complete for all land with a recorded deed. [BICSI OSP-DRD Manual, Ch. 3]
- **D — Incorrect.** County GIS coverage of rural parcels is generally equivalent to urban coverage for parcel boundaries; rural parcels are typically mapped from legal descriptions in county deed records. Positional accuracy may actually be lower in rural areas where historical survey density is lower, but rural parcel absence is not the limitation. [BICSI OSP-DRD Manual, Ch. 3]

---

**Q3.** A route designer is preparing for a field survey the following week. The project involves 2 miles of underground conduit under a state highway ROW and 1 mile of aerial attachment to existing utility poles. Which desk-research action is required before field crews break ground?

- A) Soil corrosivity analysis from NRCS Web Soil Survey only — underground routes are the primary concern
- B) 811 One-Call pre-notification to ensure underground utilities are field-marked before excavation begins **[CORRECT]**
- C) Aerial imagery review only — physical route conflicts are visible from overhead and do not require additional data sources
- D) 811 notification is optional if utility atlas records show no utilities in the project area

*Rationale:*
- **A — Incorrect.** NRCS corrosivity data is useful for cable specification decisions but does not address the legal requirement for 811 notification before excavation. Soil data does not substitute for utility conflict identification and field-marking. [FHWA utility accommodation policy guidance; RUS Bulletin 1751F-630 §2]
- **B — Correct.** 811 One-Call pre-notification is legally required before any excavation in all 50 states. The notification triggers field-marking by registered utilities so underground facilities are located before ground is broken. Failure to notify creates legal liability for any utility damage and is a regulatory violation. 811 notification must occur before field survey if the field survey involves any ground disturbance (probe rods, stakes, test pits). [FHWA utility accommodation policy guidance]
- **C — Incorrect.** Aerial imagery cannot reveal underground infrastructure, subsurface soil conditions, property boundary positions, or the specific requirements of state ROW utility accommodation policies. Imagery supplements but does not replace the full desk research toolkit. [BICSI OSP-DRD Manual, Ch. 3]
- **D — Incorrect.** 811 notification is mandatory regardless of what atlas records show or do not show. Atlas records are incomplete — not all utilities maintain current atlas data, and some underground facilities are entirely unmapped in atlas systems. The legal obligation to notify 811 exists independent of desk research findings. [FHWA utility accommodation policy guidance]

---

**Q4.** The NRCS Web Soil Survey for a proposed direct-bury route segment shows "highly corrosive to uncoated steel" for a 0.4-mile section through low-lying agricultural land. How should this finding affect the cable specification for that segment?

- A) No change — all OSP cable sheaths are made of polyethylene, which is not affected by soil corrosivity
- B) Specify a cable with dielectric (non-metallic) armor or a fully non-metallic direct-bury construction for the corrosive segment to eliminate the steel armor corrosion risk **[CORRECT]**
- C) Increase burial depth to 48 inches — greater depth places the cable in less corrosive subsoil
- D) Notify the landowner and require them to remediate soil chemistry before construction

*Rationale:*
- **A — Incorrect.** While the PE outer sheath is not directly affected by soil corrosivity, corrugated steel tape (CST) armor is a steel conductor. In highly corrosive soils (typically acidic or high-moisture conditions), electrolytic corrosion can degrade the CST layer over the cable's 30+ year service life, compromising its mechanical integrity. The sheath alone does not protect the steel layer from soil chemistry if the sheath is eventually breached. [NRCS Web Soil Survey; ANSI/TIA-758-C §5.6.2]
- **B — Correct.** In soils rated highly corrosive to steel, the appropriate mitigation is to eliminate the steel armor element. ANSI/TIA-758-C §5.6.2 provides for dielectric (fiberglass) armor as a substitute for CST armor where metallic armor creates either an electrical hazard or a corrosion risk. A fully dielectric direct-bury cable — fiberglass armor or no armor with heavy-duty PE sheath — removes the at-risk steel element. [ANSI/TIA-758-C §5.6.2; BICSI OSP-DRD Manual, Ch. 6.2]
- **C — Incorrect.** Soil corrosivity ratings generally correlate with soil chemistry rather than depth. Highly corrosive conditions in agricultural low-lying areas often exist throughout the soil column in the burial depth range. Depth increase does not reliably move the cable into less corrosive material. [NRCS Web Soil Survey]
- **D — Incorrect.** Soil chemistry remediation for a linear cable route segment is not a practical or contractually appropriate requirement on a landowner. The design engineer's responsibility is to specify cable construction appropriate for the installation environment — which in a corrosive soil segment means avoiding metallic armor. [BICSI OSP-DRD Manual, Ch. 3]

---

## Final Check

Answer before proceeding to Lesson 3.2.

**Pulse 1.** Name three distinct public data sources used in OSP desk research, state what each one provides, and identify the primary accuracy limitation of each.

*Expected answer:* Any three of the following:
(1) **County GIS parcel viewer** — provides parcel boundaries and ownership for easement identification; limitation: ±5–50 ft positional accuracy, not survey-grade.
(2) **USGS National Map Viewer** — provides topographic elevation and hydrologic features; limitation: ±3–15 ft vertical accuracy; waterbody and wetland boundaries are approximate.
(3) **NRCS Web Soil Survey** — provides soil engineering properties (corrosivity, drainage class, depth to bedrock); limitation: 1:12,000–1:24,000 scale, individual soil boundaries ±100 ft.
(4) **FEMA FIRM panels** — identify 100-year floodplain; limitation: SFHA boundaries are desktop approximations and may not reflect current site conditions after fill or drainage changes.
(5) **811 utility atlas records** — show approximate underground utility locations; limitation: positional accuracy ±3–10 ft, and some utilities are entirely unmapped. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §2]

**Pulse 2.** Explain why fatal-flaw screening at the desk is more valuable than identifying the same constraints during a field survey.

*Expected answer:* A fatal flaw identified at the desk — a wetland polygon, a railroad ROW, a shallow-bedrock soil segment — can be resolved in hours by realigning the candidate route on a computer, at no field mobilization cost. The same flaw identified during a field survey means the crew has already spent time walking a route that cannot be built, and the project must be redesigned from the field findings. Identified during permit review, the same flaw can delay a project by months and require expensive redesign of drawings that are already at the permit stage. The desk research phase is the lowest-cost intervention point for every alignment constraint. [BICSI OSP-DRD Manual, Ch. 3; RUS Bulletin 1751F-630 §2]

---

## Glossary Cross-References

- **Fatal-flaw screening** → Lesson 3.2 (field survey methodology — field verification of desk-identified constraints); Lesson 3.11 (route permitting — desk-identified constraints drive permit matrix construction)
- **811 One-Call / utility atlas** → Lesson 3.2 (field survey — 811 marking occurs before field crews break ground); Lesson 3.8 (crossings — utility conflicts at road and rail crossings)
- **NRCS soil corrosivity** → Lesson 3.5 (underground route design — corrosivity drives conduit material and cable armor selection); Lesson 3.6 (direct-bury — soil chemistry affects burial and cable specification)
- **FEMA FIRM / SFHA** → Lesson 3.8 (crossings — water crossings in SFHA require additional permits); Lesson 3.11 (permitting — floodplain development permits)
- **NWI wetlands** → Lesson 3.8 (crossings — Section 404 USACE review); Lesson 3.11 (permitting — NWP 12 applicability)
- **GIS-approximate vs. survey-grade** → Lesson 3.12 (as-built documentation — GPS-tagged field measurements replace GIS approximations in the final record)
