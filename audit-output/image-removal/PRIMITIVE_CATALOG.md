# Image-Dependent Primitive Catalog
## OSP Training — Pre-Removal Discovery Wave

**Date:** 2026-05-16
**Scope:** All authored lesson files under `osp-training/src/lessons/T<NN>/`
**Purpose:** Catalog every AnnotatedDiagram, HotSpot, and SideBySide instance that requires an
external image asset, with pedagogical intent and disposition recommendation for image-free replacement.

---

## Section 1: Summary

### Counts by primitive type

| Primitive | Total instances with external image | Notes |
|---|---|---|
| **AnnotatedDiagram** (`src=`) | 41 | All reference nonexistent `.svg` files under `/training/diagrams/` or `/img/diagrams/` |
| **HotSpot** (`src=` or `imageUrl=`) | 6 | All reference nonexistent `.svg` files |
| **SideBySide** | 12 | **NO external image dependency** — pure text comparison table. NOT in scope for removal. |

**IMPORTANT FINDING:** `SideBySide` is a pure text/table component with zero image props. It renders correctly without any assets. All 12 SideBySide instances across the curriculum are **already functional** and should NOT be touched.

**Self-contained AnnotatedDiagram variants (NOT in scope):**
- 9 instances use `regions=` / `textFallback=` pattern (data-driven, no image) — T06.L03, T06.L04, T06.L05, T06.L06, T04.L01 — render reasonably in text-fallback mode
- 3 instances use `svgContent=` or `diagramContent=` (inline SVG) — T09.L07, T19.L09, T19.L10 — fully self-contained

**Scope of this catalog: 41 AnnotatedDiagram + 6 HotSpot = 47 image-dependent instances.**

### Per-topic instance count (image-dependent only)

| Topic | AnnotatedDiagram | HotSpot | Total |
|---|---|---|---|
| T01 | 4 | 0 | 4 |
| T02 | 3 | 0 | 3 |
| T03 | 3 | 3 | 6 |
| T04 | 6 | 1 | 7 |
| T05 | 6 | 1 | 7 |
| T06 | 2 | 0 | 2 |
| T07 | 6 | 0 | 6 |
| T08 | 1 | 0 | 1 |
| T09 | 2 | 0 | 2 |
| T18 | 4 | 1 | 5 |
| T19 | 4 | 0 | 4 |
| **TOTAL** | **41** | **6** | **47** |

### Disposition totals

| Disposition | Count | Description |
|---|---|---|
| `REPLACE-WITH-LABELED-LIST` | 29 | Labels + explanations convert directly to numbered/bulleted definitions list with callout boxes |
| `REPLACE-WITH-TABLE` | 7 | Data is row/column structured; converts to a clean comparison or lookup table |
| `REPLACE-WITH-MCQ` | 7 | Violation-spotting / hazard-identification games convert to multiple-choice with explanation |
| `DELETE-ENTIRELY` | 4 | Pure navigational/workflow diagrams that are fully covered by surrounding prose |

---

## Section 2: Per-Instance Table

### T01 — Fundamentals & Vocabulary

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T01 | L02 | `T01/L02.parts-of-a-pole.jsx` | 302–355 | AnnotatedDiagram | Teach the anatomy of a shared utility pole: supply space, climbing space, neutral, comm space, ground line | `REPLACE-WITH-LABELED-LIST` | 6 hotPoints (supply, climbing, neutral, comm space, ground line, crossarm) each have standalone explanations; numbered zone list with callout boxes preserves all teaching value |
| T01 | L03 | `T01/L03.parts-of-a-cable.jsx` | 286–345 | AnnotatedDiagram | Teach layers of an OSP loose-tube armored cable cross-section: jacket, armor, ripcord, buffer tubes, central member, fibers | `REPLACE-WITH-LABELED-LIST` | 6 hotPoints of discrete cable layers; an ordered list with a "Cable Layer Breakdown" heading covers every layer definition |
| T01 | L04 | `T01/L04.inside-a-splice-case.jsx` | 287–345 | AnnotatedDiagram | Teach components inside a dome splice closure: entry port, central member anchor, fan-out, splice trays, gel sealing | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 labeled component definitions; each is already a self-contained paragraph |
| T01 | L07 | `T01/L07.reading-a-strand-map.jsx` | 247–320 | AnnotatedDiagram | Teach FTTH network hierarchy: headend/OLT → feeder → FDH → distribution → NAP → customer drop | `REPLACE-WITH-TABLE` | 5 hierarchical levels with fixed attributes (name, fiber count, purpose, distance); a 5-row topology table (Level / Description / Fiber Count / Role) carries the same teaching content |

### T02 — Fiber Physics

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T02 | L01 | `T02/L01.why-light-travels-in-glass.jsx` | 271–320 | AnnotatedDiagram | Teach the anatomy of a fiber strand: core, cladding, buffer, and the light ray path | `REPLACE-WITH-LABELED-LIST` | 4 hotPoints (core, cladding, buffer, ray) are pure component definitions with dimensions; a labeled diagram description + bulleted list handles all 4 |
| T02 | L04 | `T02/L04.macrobend-and-microbend.jsx` | 260–300 | AnnotatedDiagram | Teach the difference between macrobend and microbend loss — where each occurs and what causes it | `REPLACE-WITH-LABELED-LIST` | 3 hotPoints (macrobend, microbend, normal) each map to a definition + cause + OTDR signature; a 3-item callout list replaces the visual |
| T02 | L07 | `T02/L07.wavelength-windows.jsx` | 257–320 | AnnotatedDiagram | Teach fiber wavelength windows (850/1310/1490/1550/1625 nm) — loss levels, applications, which bands OSP uses | `REPLACE-WITH-TABLE` | 5 discrete wavelengths with fixed attributes (nm, band name, loss, application, OSP relevance); a 5-column table is more scannable than click-and-reveal |

### T03 — Cable Selection

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T03 | L01 | `T03/L01.loose-tube-tight-buffer-ribbon.jsx` | 143–200 | AnnotatedDiagram | Teach loose-tube vs tight-buffer vs ribbon cross-section construction differences | `REPLACE-WITH-LABELED-LIST` | 6 hotPoints across 3 cable types; a 3-section "Construction Types" breakdown with "What it is / Why it matters" per section preserves all content |
| T03 | L03 | `T03/L03.armor-jacket-selection.jsx` | 118–175 | AnnotatedDiagram | Teach layers of a CST-armored direct-burial cable: inner assembly, CST armor, ripcord, outer jacket | `REPLACE-WITH-LABELED-LIST` | 4 hotPoints = 4 component definitions; matches T01.L03 pattern exactly |
| T03 | L07 | `T03/L07.armor-deep-dive.jsx` | 214–260 | HotSpot | Identify installation errors: jacket nick, sharp bend at armor transition, vs correct bonding clamp | `REPLACE-WITH-MCQ` | 3-region challenge with 2 errors + 1 correct practice; converts to a 3-question MCQ set with "Is this an error?" framing and explanation per answer |
| T03 | L09 | `T03/L09.adss-span-wind-ice-loading.jsx` | 125–180 | AnnotatedDiagram | Teach NESC loading districts (Heavy/Medium/Light/Extreme Wind) with regional boundaries and design loads | `REPLACE-WITH-TABLE` | 4 districts with fixed numeric attributes (ice in., wind psf, temp °F, region); a 4-row district table + a prose description of major state assignments replaces the map |
| T03 | L11 | `T03/L11.cable-spec-reading-datasheet.jsx` | 265–310 | HotSpot | Navigate cable datasheet sections: optical specs, mechanical specs, environmental specs, compliance declarations | `REPLACE-WITH-LABELED-LIST` | 4 regions each correspond to a datasheet section; a 4-item "Datasheet Navigation Guide" with callout boxes per section (what to find, what matters, red flags) covers all content |

### T04 — Site Survey & Pre-Engineering

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T04 | L01 | `T04/L01-site-walk-hazard-recon.jsx` | 386–440 | HotSpot | Identify 4 route-walk hazards: low-clearance power conductor, unmarked manhole in traffic, leaning pole, shoulder erosion | `REPLACE-WITH-MCQ` | 4-region challenge with 4 distinct hazards; converts to a "Which of these requires immediate flagging?" MCQ or a scenario-based checklist quiz |
| T04 | L02 | `T04/L02-drone-lidar-aerial-survey.jsx` | 420–480 | AnnotatedDiagram | Teach LiDAR point cloud classification layers: bare earth, low veg, mid canopy, structures, utilities | `REPLACE-WITH-LABELED-LIST` | 5 stacked layers with fixed definitions; a 5-item ordered list from bottom (bare earth) to top (structures) preserves the layering concept without requiring an image |
| T04 | L03 | `T04/L03-gis-landbase-coordinate-systems.jsx` | 367–430 | AnnotatedDiagram | Teach GIS layer trust hierarchy from least to most accurate: aerial imagery → parcels → utility locate → LiDAR → RTK | `REPLACE-WITH-LABELED-LIST` | 5 layers in accuracy order with definitions; an ordered "accuracy ladder" list (1 = least to 5 = most) is clearer than a spatial stack diagram |
| T04 | L04 | `T04/L04-pole-audit-attachment-measurement.jsx` | 406–470 | AnnotatedDiagram | Teach pole attachment zones and what a field auditor records at each zone: power phase, neutral, comm space attachments | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 zones with measurement instructions; a "What to record at each zone" checklist per zone (supply / neutral / climbing / existing comms / proposed location) |
| T04 | L06 | `T04/L06-kmz-shapefile-pdf-deliverables.jsx` | 385–425 | AnnotatedDiagram | Teach OSP survey file format capabilities comparison (KMZ / Shapefile / GeoTIFF / PDF-A / DWG) | `DELETE-ENTIRELY` | The SideBySide at line 428 (already functional) covers the same format-vs-stakeholder mapping; the AnnotatedDiagram adds no content not already in the adjacent table |
| T04 | L09 | `T04/L09-rus-pre-engineering.jsx` | 412–465 | AnnotatedDiagram | Navigate a RUS construction package cover sheet: borrower ID, case number, submittal date, project description, PE stamp | `REPLACE-WITH-LABELED-LIST` | 5 cover-sheet sections with explanations; a "Cover Sheet Navigation Guide" with 5 numbered callouts covers all the same information |

### T05 — NESC & Pole Loading

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T05 | L03 | `T05/L03-comm-to-supply-separation-rule-235.jsx` | 265–340 | AnnotatedDiagram | Teach NESC Rule 235 pole zones: phase conductors, neutral, 40-inch safety zone, comm space | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 vertical zones; a "Pole Zone Breakdown" with 5 labeled zones (top to bottom) and measurements preserves the spatial teaching |
| T05 | L03 | `T05/L03-comm-to-supply-separation-rule-235.jsx` | 394–445 | HotSpot | Find the Rule 235 violation: one attachment too close to neutral vs correct attachments | `REPLACE-WITH-MCQ` | 3-region challenge (1 violation + 2 distractors); converts to "Which attachment violates Rule 235?" MCQ with diagram description + height measurements provided in prose |
| T05 | L05 | `T05/L05-pole-loading-forces-on-a-pole.jsx` | 243–310 | AnnotatedDiagram | Teach forces on a running pole: horizontal wind force, vertical gravity force, resultant direction | `REPLACE-WITH-LABELED-LIST` | 3 hotPoints = 3 force vectors already defined with formulas in adjacent prose; a "Three Forces at a Glance" callout box (name / direction / formula) reinforces without requiring visualization |
| T05 | L06 | `T05/L06-loading-districts-rule-250.jsx` | 401–460 | AnnotatedDiagram | Teach NESC loading district boundaries: Light (SE), Medium (mid-belt), Heavy (north), Extreme Wind | `REPLACE-WITH-TABLE` | 4 districts with numeric loads and regional description; same table pattern as T03.L09 district table; geography prose note covers the regional callouts |
| T05 | L08 | `T05/L08-joint-use-who-owns-what-on-the-pole.jsx` | 217–270 | AnnotatedDiagram | Teach joint-use pole zones and ownership: supply space, neutral, 40-inch safety zone, comm space, ground line | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 zones with ownership and regulatory references; near-identical to T05.L03 AnnotatedDiagram — consolidate into a shared "Pole Zones" callout referenced from both lessons |
| T05 | L12 | `T05/L12-pon-ftth-aerial-topology.jsx` | 233–290 | AnnotatedDiagram | Teach PON FTTH topology: OLT → feeder → FDH/splitter → distribution → NAP → drop → ONT | `REPLACE-WITH-TABLE` | 6 topology nodes with defined attributes (device, location, fiber count, function); a 6-row topology table (Node / Location / Count / Role) covers all 6 hotPoint explanations |

### T06 — OSP Design: Underground

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T06 | L08 | `T06/L08-riser-pedestal-and-niu-placement.jsx` | 370–430 | AnnotatedDiagram | Teach components inside a fiber terminal pedestal: locking cover, splice enclosure, slack coil, riser, bottom cable entry | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 pedestal components with function descriptions; "Pedestal Interior Components" numbered list with callout boxes preserves all content |
| T06 | L11 | `T06/L11-underground-design-qa-checklist.jsx` | 290–355 | AnnotatedDiagram | Walk through a design QA plan view with 4 flagged errors: missing depth callout, fill overrun, pedestal spacing, separation deficiency | `REPLACE-WITH-MCQ` | 4 errors already fully described with QA checklist text in surrounding prose; a 4-question scenario MCQ ("Which specification is violated here?") with prose setup replaces the visual |

### T07 — Staking

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T07 | L01 | `T07/L01-what-a-staker-does.jsx` | 329–390 | AnnotatedDiagram | Show what the staker records at each pole: ground stake, attachment heights, GPS tag, photo angle | `REPLACE-WITH-LABELED-LIST` | 4 hotPoints = 4 field recording tasks; a "Staker Field Checklist per Pole" with 4 items and measurement notes covers all content |
| T07 | L02 | `T07/L02-reading-plans-in-the-field.jsx` | 355–415 | AnnotatedDiagram | Teach plan-and-profile drawing elements: stationing ruler, pole symbol, PI point, profile grade line | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 drawing elements; a "Plan Sheet Elements Guide" with definitions and "how to find it in the field" notes per element |
| T07 | L03 | `T07/L03-photographing-and-coding-pole-tags.jsx` | 355–415 | AnnotatedDiagram | Teach pole tag anatomy: QR code, manual pole number, GPS display, owner code, photo angle | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 tag elements; a "What's on a Pole Tag" list with "what to record" note per element |
| T07 | L04 | `T07/L04-measuring-existing-attachments.jsx` | 348–410 | AnnotatedDiagram | Teach laser vs tape measurement technique: laser aim point, laser position, tape use case | `REPLACE-WITH-LABELED-LIST` | 3 hotPoints = 3 technique notes; a "Measurement Method Comparison" callout with Step-by-step laser procedure + tape backup scenario |
| T07 | L07 | `T07/L07-underground-staking-marking-the-route.jsx` | 295–360 | AnnotatedDiagram | Show underground staking pattern: centerline stakes, offset stakes, bore pit, road crossing, pull pit | `DELETE-ENTIRELY` | The `fallbackDescription` prop already contains a 400-word prose description of the exact same diagram that is currently rendered as the content. Removing the `src=` and keeping the fallback text is the fix; no new replacement content needed |
| T07 | L08 | `T07/L08-katapult-and-gis-staking-tools.jsx` | 218–280 | AnnotatedDiagram | Teach Katapult digital staking workflow: 5-stage office-to-field-to-sync process | `DELETE-ENTIRELY` | The `fallbackDescription` prop already contains a detailed 500-word prose description of all 5 workflow stages. Same fix as T07.L07 — remove `src=`, keep fallback text. |

### T08 — Make-Ready & Pole Attachment

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T08 | L04 | `T08/L04-transfer-moving-someone-elses-wire.jsx` | 274–335 | AnnotatedDiagram | Teach a pole transfer: before/after bracket positions, old cable position, new bracket height, new fiber attachment | `REPLACE-WITH-LABELED-LIST` | 4 hotPoints capture the before/after change story; a "Transfer Step-by-Step: Before → After" callout box with 4 labeled changes and measurements covers all content |

### T09 — Permitting & Environmental

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T09 | L01 | `T09/L01-the-permitting-layer-cake.jsx` | 378–440 | AnnotatedDiagram | Teach 4-layer permitting stack: Federal, State, County/Municipal, Private Property — who issues each, timeline, consequence of skipping | `REPLACE-WITH-TABLE` | 4 layers with fixed attributes (issuer, trigger, timeline, skip consequence); a 4-row "Permitting Layer" table is the canonical format for this type of hierarchy |
| T09 | L04 | `T09/L04-esa-bats-ipac.jsx` | 376–435 | AnnotatedDiagram | Teach IPaC output navigation: species list, critical habitat, activity-specific guidance fields | `REPLACE-WITH-LABELED-LIST` | 3 hotPoints = 3 IPaC output sections; a "Reading an IPaC Output" 3-item guide with "what the field means" and "what action it requires" per section |

### T18 — Safety & OSHA

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T18 | L03 | `T18/L03-confined-space-entry.jsx` | 375–435 | AnnotatedDiagram | Teach correct manhole entry setup: attendant position, gas monitor, blower, cone barrier, ladder | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 required setup components per 29 CFR 1910.268(o); a "Manhole Entry Setup Checklist" with 5 items + regulatory citation per item preserves the safety-critical content |
| T18 | L04 | `T18/L04-fall-protection-poles-aerial-lifts.jsx` | 351–395 | AnnotatedDiagram | Teach pole worker fall protection components: full-body harness, positioning strap, PFAS lanyard, gaff spurs, anchor points | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 component definitions; a "Fall Protection Equipment List" with component / function / regulatory basis per item |
| T18 | L05 | `T18/L05-ppe-hands-head-eyes-feet.jsx` | 364–430 | AnnotatedDiagram | Teach standard OSP worker PPE by body zone: Class E hard hat, Z87.1 glasses, Class 3 hi-vis, gloves, EH-rated boots | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 PPE items with ANSI standard and when-required; a "PPE Zone-by-Zone Guide" with standard reference per item |
| T18 | L06 | `T18/L06-traffic-control-flagging.jsx` | 323–390 | AnnotatedDiagram | Teach MUTCD work zone layout: advance warning sign, taper, longitudinal buffer, activity area, termination area | `REPLACE-WITH-LABELED-LIST` | 5 hotPoints = 5 work zone elements with MUTCD Table 6C-1 spacing requirements; a "Work Zone Element Guide" with element / MUTCD requirement / consequence per item |
| T18 | L08 | `T18/L08-hazardous-materials-osp.jsx` | 344–410 | HotSpot | Identify which job-site items require an SDS on file: gel cleaning solvent, conduit cement, battery backup, concrete saw, hardware bag, fiber reel | `REPLACE-WITH-MCQ` | 6-region explore-mode challenge; converts to a "Does this require an SDS?" 6-question MCQ set with yes/no + reason per item |

### T19 — Headend / CO + Rack-Side Hardware

| Topic | Lesson | File | Lines | Primitive | Pedagogical intent | Disposition | Rationale |
|---|---|---|---|---|---|---|---|
| T19 | L01 | `T19/L01.co-hut-headend-layout.jsx` | 397–455 | AnnotatedDiagram | Teach CO/headend floor plan zones: MEF, MDF/ODF, equipment room, battery room, HVAC, generator pad | `REPLACE-WITH-LABELED-LIST` | 6 hotPoints = 6 building zones with "OSP vs ISP territory" framing; a "CO Building Zone Guide" with zone / description / who owns it columns |
| T19 | L06 | `T19/L06.headend-grounding-osp-mgn-terminates.jsx` | 334–395 | AnnotatedDiagram | Teach OSP-to-CO grounding chain: messenger (MGN-bonded) → primary protector → IBT-entry → GES tie-in → TMGB | `REPLACE-WITH-LABELED-LIST` | 6 hotPoints = 6 grounding path elements in sequence; a "Grounding Chain: Pole to Building" numbered list (1→6 in the signal path direction) |
| T19 | L07 | `T19/L07.rack-side-hardware-patch-panels-liu.jsx` | 293–350 | AnnotatedDiagram | Teach ODF rack layout: splice organizer, patch panel, fiber management, and connection path to OLT rack | `REPLACE-WITH-LABELED-LIST` | 4 hotPoints = 4 ODF rack sections with OSP/ISP ownership distinction; a "ODF Rack Section Guide" with section / function / owner columns |
| T19 | L08 | `T19/L08.fosc-and-splice-enclosures-in-headend.jsx` | 276–330 | AnnotatedDiagram | Teach visual difference between OSP dome FOSC and headend rack-mount FOSC | `DELETE-ENTIRELY` | The SideBySide at line 165 (already functional) provides a complete 5-row comparison of OSP FOSC vs headend FOSC. The AnnotatedDiagram adds no information not already in the table. |

---

## Section 3: Open Questions for Orchestrator

### 3.1 Two lessons with rich fallbackDescription already authored (T07.L07 and T07.L08)

Both `T07/L07-underground-staking-marking-the-route.jsx` and `T07/L08-katapult-and-gis-staking-tools.jsx` already have a `fallbackDescription` prop with 400–500 word prose descriptions of the exact diagram content. These two lessons need only a `src=` removal — the replacement text is already written. The fix-agent should check whether `AnnotatedDiagram` renders `fallbackDescription` when `src` is absent, or whether the prop needs to be converted to a text block in the lesson body.

### 3.2 T05.L03 and T05.L08 share the same source SVG (`joint-use-pole-zones.svg`)

Both lessons describe identical pole zones (supply, neutral, 40-inch safety zone, comm space). If replacing with labeled lists, the two lessons should use identical "Pole Zone Breakdown" content (possibly a shared component). Flagging to avoid authoring two slightly-different versions of the same content.

### 3.3 T04.L06 AnnotatedDiagram marked DELETE-ENTIRELY

The format-comparison AnnotatedDiagram at T04.L06 line 385 covers exactly the same content as the SideBySide at line 428 in the same lesson. Confirm the SideBySide is in fact rendering (it uses `leftLabel`/`rightLabel` props while the `SideBySide` component signature uses `leftTitle`/`rightTitle` — verify the component accepts both or flag as a separate prop-mismatch bug).

### 3.4 T19.L08 AnnotatedDiagram marked DELETE-ENTIRELY — verify SideBySide renders

The AnnotatedDiagram at T19.L08 line 276 is marked DELETE because the SideBySide at line 165 already covers the same comparison. Same prop-mismatch caveat as above — confirm the SideBySide is rendering correctly before deleting the AnnotatedDiagram.

### 3.5 T03.L09 vs T05.L06 — two NESC district tables with different content

Both T03.L09 and T05.L06 have AnnotatedDiagrams showing NESC loading districts, but from different angles (T03 focuses on ADSS span design per-district; T05 focuses on Rule 250 pole loading per-district). When replacing with tables, the two tables need different column sets and should cross-reference each other rather than duplicate.

### 3.6 HotSpot `imageUrl` vs `src` prop inconsistency

The `HotSpot` component definition uses `src` (line 16 of HotSpot.jsx), but three lesson files pass `imageUrl=` instead (`T03.L07`, `T03.L11`, `T04.L01`). Two pass `src=` correctly (`T05.L03`, `T18.L08`). This is a bug: the `imageUrl` lessons already have a broken HotSpot render regardless of whether the image file exists. Fix-agent should use the `src` prop consistently.

---

`=== PRIMITIVE CATALOG END ===`
