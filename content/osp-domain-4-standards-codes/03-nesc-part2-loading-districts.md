---
title: "Lesson 4.2b: NESC Part 2 — Loading Districts and Sag-Tension"
duration_min: 20
topic: osp-domain-4-standards-codes
order: 3
bicsi_alignment:
  - "OSP-DRD Ch. 2.2: NESC Part 2 loading requirements"
  - "OSP-DRD Ch. 6.3: Aerial construction design — sag-tension"
sources:
  - "NESC C2-2023, Rules 250–252, Figure 250-1"
  - "IEEE Std 1222 §5 (ADSS sag-tension method)"
  - "BICSI OSP-DRD Manual, Ch. 2.2"
  - "RUS Bulletin 1751F-630, §4"
---

# NESC Part 2 — Loading Districts and Sag-Tension

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the ice thickness, wind pressure, and temperature parameters for each NESC loading district (Light, Medium, Heavy) and for the Extreme Wind overlay
- Determine the applicable loading district for a project location using NESC Rules 250–252 and the NESC loading district map (Figure 250-1)
- State the primary loading district for Macon, GA and the condition under which the Extreme Wind overlay applies for Georgia coastal-area projects
- Execute a 6-step sag-tension derivation using the IEEE Std 1222 §5 parabolic method for a Light-district span
- Explain how loading district choice shifts the sag outcome and therefore the NESC clearance margin for the same physical span

> **Cross-Reference:** The sag-tension formula S = w × L² / (8 × H) is introduced in T3 L3.4. This lesson applies that same method (IEEE Std 1222 §5) to the code-standard loading conditions defined in NESC Rules 250–252. Do not re-derive the catenary math — cite T3 L3.4 for the derivation authority.

---

## Reading Content

### Rules 250–252: Loading Districts Defined

NESC C2-2023 Rules 250 through 252 define the **design loading conditions** that aerial lines must be engineered to survive. These conditions represent the statistical extreme load that the line will experience during its service life in a given geographic zone. [NESC C2-2023, Rules 250–252]

**Rule 250** establishes the three primary loading districts and their design parameters:

| Loading district | Radial ice thickness | Horizontal wind pressure | Ambient temperature |
|---|---|---|---|
| **Light** | 0 in. (no ice) | 9 psf | 60°F |
| **Medium** | 0.25 in. (6.35 mm) | 4 psf | 15°F |
| **Heavy** | 0.50 in. (12.70 mm) | 4 psf | 0°F |

**Rule 251** establishes the **Extreme Wind** loading condition: a single-parameter wind event (no simultaneous ice) using a design wind speed derived from ASCE 7-16 extreme-wind maps, which represents hurricane-force or significant coastal storm wind. Extreme Wind replaces the combined ice-and-wind loading of the standard districts for geographic areas where wind — not ice — is the governing meteorological hazard.

**Rule 252** establishes that the geographic assignment of loading districts is per **NESC Figure 250-1** — the NESC loading district map published as a companion to the code. The map divides the continental United States into loading district zones by county-level geography.

> **Authoring note — Figure 250-1 availability:** NESC Figure 250-1 is published by IEEE and is available to NESC subscribers. The loading district for any specific project location must be confirmed against the current-edition map; this lesson's geographic assignments reflect NESC C2-2023 Figure 250-1 as of publication date. The AHJ may have independent interpretations for specific jurisdictions.

---

### Macon, GA: Primary District and Extreme Wind Overlay

**Primary loading district for Launch Fiber Services projects (Macon, GA inland):**

Macon, GA is located at approximately 32.84°N latitude, well inland from the Atlantic and Gulf coasts. Per NESC C2-2023 Figure 250-1, Macon and the surrounding middle Georgia inland region fall in the **Light loading district**: no radial ice, 9 psf design wind, 60°F design temperature. The Light district reflects the climate reality of inland Georgia — freezing rain events are rare and short-duration, and sustained ice accumulation meeting NESC Medium (0.25 in. radial) is a statistically extreme event, not a design expectation. [NESC C2-2023, Rules 250–252, Figure 250-1]

**Extreme Wind overlay — coastal-zone projects:**

The Extreme Wind loading condition applies to projects located within approximately 60 miles of the Atlantic or Gulf coastline (coastal Georgia, Florida panhandle, coastal South Carolina). For these routes, the hurricane-force design wind replaces the Light district wind pressure. Extreme Wind design pressures range from approximately 26–30 psf depending on the specific coastal location and exposure category per ASCE 7-16.

**Design implication:** The same cable on the same poles produces dramatically different sag under Extreme Wind than under Light district loading. The worked examples in this lesson quantify this difference. For any PSC project route that extends into the coastal zone, the engineer must confirm whether the route falls in an Extreme Wind zone and apply the appropriate loading condition. [NESC C2-2023, Rule 251; ASCE 7-16 extreme wind maps]

> **Medium and Heavy districts — cross-territory awareness:**
> Medium (0.25 in. ice) applies to roughly the middle-latitude band of the continental US (northern Georgia border and above, depending on location). Heavy (0.50 in. ice) applies to the northern US, New England, and mountain regions. Launch Fiber Services routes outside middle Georgia — projects in northern Georgia mountain counties or multi-state routes — may require Medium or Heavy district analysis. Always confirm district per Figure 250-1 for the specific route geography.

---

### IEEE Std 1222 §5: Sag-Tension Method for ADSS Cable

IEEE Std 1222 is the standard for the design and testing of All-Dielectric Self-Supporting (ADSS) cable for use on utility lines. Section 5 defines the sag-tension calculation methodology: the parabolic approximation for spans where sag does not exceed approximately 10% of span length (which covers the vast majority of OSP route spans). [IEEE Std 1222 §5]

The parabolic sag formula:

**S = (w × L²) / (8 × H)**

Where:
- **S** = midspan sag (ft)
- **w** = resultant cable unit load under design conditions (lb/ft); includes cable dead weight and any ice and wind loads combined vectorially
- **L** = span length (ft)
- **H** = horizontal component of tension at midspan (lb); for design, H = EDS × RTS

**Resultant unit load composition:**

For Light district (no ice, wind only):
- Vertical component: cable dead weight, w_v (lb/ft)
- Horizontal component: wind load per unit length, w_h = wind pressure (psf) × cable OD (ft)
- Resultant: w = √(w_v² + w_h²)

For Medium/Heavy districts (ice + wind):
- Vertical component: cable dead weight + radial ice weight per unit length
- Horizontal component: wind pressure × (cable OD + 2 × ice thickness in ft)
- Resultant: w = √(v_component² + h_component²)

**Every Day Stress (EDS) and RTS:**
- EDS is the design stringing tension at average everyday temperature (60°F for Light district), expressed as a percentage of Rated Tensile Strength (RTS)
- NESC and IEEE 1222 recommend EDS in the range of 20–25% RTS for ADSS cable
- Design tension: H = EDS% × RTS (lb)

[IEEE Std 1222 §5; NESC C2-2023, Rule 230H]

---

### Worked Example — Primary: Light District (Macon, GA Inland)

**Span parameters:**
- Route: Macon, GA inland — NESC Light loading district
- Cable: 48-fiber ADSS; OD = 0.60 in. (0.050 ft); unit dead weight w_v = 0.155 lb/ft; RTS = 2,800 lb
- Span length: L = 250 ft
- Attachment height: 28 ft above grade (both poles)
- Crossing: road open to commercial traffic (NESC Table 232-1 minimum: 15.5 ft)
- EDS = 22% RTS

**Step 1 — Identify loading district and extract design parameters.**
Loading district: **Light** (Macon, GA inland per NESC C2-2023 Figure 250-1). Design parameters: 0 in. radial ice, 9 psf horizontal wind, 60°F. [NESC C2-2023, Rule 250]

**Step 2 — Calculate vertical unit load (cable dead weight only; no ice in Light district).**
w_v = 0.155 lb/ft (cable dead weight; no ice term because Light district = 0 in. radial ice)

**Step 3 — Calculate horizontal unit load (wind).**
w_h = wind pressure × cable OD = 9 psf × 0.050 ft = **0.450 lb/ft**

**Step 4 — Calculate resultant unit load.**
w = √(w_v² + w_h²) = √(0.155² + 0.450²) = √(0.024025 + 0.202500) = √0.226525 = **0.476 lb/ft**

**Step 5 — Determine design tension.**
H = EDS × RTS = 22% × 2,800 lb = **616 lb**

**Step 6 — Apply parabolic sag formula.**
S = (w × L²) / (8 × H) = (0.476 × 250²) / (8 × 616) = (0.476 × 62,500) / 4,928 = 29,750 / 4,928 = **6.04 ft**

**Clearance check:**
- Midspan cable height = Attachment height − Sag = 28.0 − 6.04 = **21.96 ft**
- NESC minimum clearance (Table 232-1, road open to commercial traffic): 15.5 ft
- Margin = 21.96 − 15.5 = **6.46 ft**
- **Determination: COMPLIANT.** 250-ft span in Light district at 28-ft attachment height satisfies NESC Rule 232 with 6.46 ft of margin.

*Design note: 6.46 ft margin indicates the span can be extended or attachment height can be reduced. In practice, the engineer confirms against the manufacturer's final sag-tension table (which accounts for creep elongation) before finalizing the span length.*

[IEEE Std 1222 §5; NESC C2-2023, Rules 250, 232; BICSI OSP-DRD Manual, Ch. 6.3]

---

### Worked Example — Sidebar: Extreme Wind Overlay (Coastal Georgia Project)

**Same cable and span; same attachment height; Extreme Wind district.**

Design wind pressure for coastal Georgia Extreme Wind zone: **28.2 psf** (NESC C2-2023 Rule 251; representative value — confirm with ASCE 7-16 for specific site). No radial ice.

**Recalculate steps 3–6 only (Steps 1–2 unchanged except district):**

Step 3 (Extreme Wind): w_h = 28.2 psf × 0.050 ft = **1.410 lb/ft**

Step 4 (Extreme Wind): w = √(0.155² + 1.410²) = √(0.024025 + 1.988100) = √2.012125 = **1.418 lb/ft**

Step 5 (unchanged): H = 616 lb

Step 6 (Extreme Wind sag): S = (1.418 × 62,500) / 4,928 = 88,625 / 4,928 = **17.99 ft ≈ 18.0 ft**

**Clearance check — Extreme Wind:**
- Midspan cable height = 28.0 − 18.0 = **10.0 ft**
- NESC minimum clearance (road): 15.5 ft
- Deficit: 10.0 − 15.5 = **−5.5 ft** → **NON-COMPLIANT**

**Design conclusion:** The same 250-ft span, same cable, same attachment height that passes easily in Light district **fails by 5.5 ft** in the Extreme Wind loading zone. The engineer must either shorten the span (more poles, higher cost) or increase attachment height to restore clearance compliance. This quantitative comparison is why loading district confirmation is the first step in aerial route design — not an afterthought.

To achieve 15.5 ft clearance under Extreme Wind with a 250-ft span:
- Required attachment height = clearance minimum + sag = 15.5 + 18.0 = **33.5 ft** (versus 28 ft in Light district)
- Or: reduce span until sag at 28-ft attachment allows 15.5-ft clearance

*Practical note: at 28-ft attachment height, maximum allowable sag under Extreme Wind for road clearance = 28 − 15.5 = 12.5 ft. Required span: L = √(8 × H × S_max / w) = √(8 × 616 × 12.5 / 1.418) = √(61,600 / 1.418) = √43,441 = 208 ft. So in the Extreme Wind zone, the maximum compliant span at 28-ft attachment is approximately 208 ft versus 250+ ft in Light district.*

[NESC C2-2023, Rule 251; IEEE Std 1222 §5; NESC C2-2023, Rule 232]

---

## Key Terms (Flashcard Candidates)

**NESC Light loading district**
Design conditions per NESC C2-2023 Rule 250: 0 in. radial ice, 9 psf horizontal wind, 60°F. Applicable to inland southern United States including middle Georgia. The primary design district for Launch Fiber Services projects in Macon, GA. [NESC C2-2023, Rule 250, Figure 250-1]

**NESC Medium loading district**
Design conditions per NESC C2-2023 Rule 250: 0.25 in. (6.35 mm) radial ice, 4 psf wind, 15°F. Applicable to mid-latitude US regions. Not typically applicable to middle Georgia inland projects; relevant for routes extending into the Georgia mountain counties or northward.

**NESC Heavy loading district**
Design conditions per NESC C2-2023 Rule 250: 0.50 in. (12.70 mm) radial ice, 4 psf wind, 0°F. Applicable to northern US, New England, mountain regions. Governs the most severe ice-and-wind combination.

**Extreme Wind loading (NESC Rule 251)**
A single-parameter wind loading condition (no simultaneous ice) for coastal areas where hurricane-force or significant coastal storm wind governs design. Replaces the standard district loading for the Extreme Wind geographic zone. Design wind pressure derived from ASCE 7-16. Applicable to projects within approximately 60 miles of the Atlantic/Gulf coast in Georgia and adjacent states.

**Resultant unit load (w)**
The total cable unit load under design conditions, combining vertical (dead weight + ice) and horizontal (wind) components vectorially: w = √(vertical² + horizontal²). Input to the parabolic sag formula. Units: lb/ft.

**Parabolic sag formula (IEEE Std 1222 §5)**
S = (w × L²) / (8 × H), where S = midspan sag (ft), w = resultant unit load (lb/ft), L = span length (ft), H = horizontal tension component at EDS (lb). Valid when sag < ~10% of span length. The authoritative method per IEEE Std 1222 §5 for ADSS sag-tension design.

**Every Day Stress (EDS)**
The design stringing tension for ADSS at average everyday temperature, expressed as a percentage of Rated Tensile Strength (RTS). IEEE 1222 and NESC recommend 20–25% RTS. H = EDS% × RTS. Low EDS → high sag → potential clearance violation. High EDS → low sag → potential fatigue failure. [IEEE Std 1222 §5.2; NESC C2-2023, Rule 230H]

**Rated Tensile Strength (RTS)**
The manufacturer-specified breaking strength of the cable under standardized test conditions. RTS for a typical 48-fiber ADSS: approximately 2,800–3,200 lb depending on construction. EDS is expressed as a percentage of RTS. [IEEE Std 1222 §5]

**NESC Figure 250-1**
The loading district map published as a companion to NESC C2-2023. Assigns loading districts to geographic areas by county-level resolution. Must be confirmed for specific project locations; AHJ may have independent interpretations.

---

## Interactive: Flashcards — Loading District to Parameters

**Flashcard set (one card per district):**

**Card 1 — Light district:**
Front: What are the design ice thickness, wind pressure, and temperature for the NESC Light loading district?
Back: Ice = 0 in. (none); Wind = 9 psf; Temperature = 60°F. Primary district for Macon, GA inland projects. [NESC C2-2023, Rule 250]

**Card 2 — Medium district:**
Front: What are the design ice thickness, wind pressure, and temperature for the NESC Medium loading district?
Back: Ice = 0.25 in. (6.35 mm) radial; Wind = 4 psf; Temperature = 15°F. [NESC C2-2023, Rule 250]

**Card 3 — Heavy district:**
Front: What are the design ice thickness, wind pressure, and temperature for the NESC Heavy loading district?
Back: Ice = 0.50 in. (12.70 mm) radial; Wind = 4 psf; Temperature = 0°F. [NESC C2-2023, Rule 250]

**Card 4 — Extreme Wind:**
Front: When does the Extreme Wind loading condition replace the standard district loading, and what is its defining characteristic?
Back: Extreme Wind applies in coastal areas where hurricane-force wind governs design. It replaces ice+wind loading with a higher single wind pressure (derived from ASCE 7-16 extreme wind maps, typically 26–30 psf for coastal Georgia). No simultaneous ice load. [NESC C2-2023, Rule 251]

**Card 5 — District choice → sag outcome:**
Front: A 250-ft span produces 6.04 ft sag in Light district and 18.0 ft sag under Extreme Wind loading (same cable, same tension). Why is the difference so large?
Back: The resultant unit load w under Extreme Wind (28.2 psf wind) is 1.418 lb/ft versus 0.476 lb/ft in Light district — nearly 3× higher. Since sag = (w × L²) / (8 × H), sag scales linearly with w. A 3× increase in w produces approximately 3× the sag. [IEEE Std 1222 §5; NESC C2-2023, Rules 250, 251]

---

## Scenario: Loading District Choice Shifts Sag Outcome

**Scenario premise:** An engineer receives a new project scope: design a fiber route that starts in Macon, GA, runs south through Tifton, GA, and terminates at a coastal equipment hub near Brunswick, GA. The route is approximately 200 miles long.

The route has three geographic segments:

| Segment | Location | Loading district |
|---|---|---|
| A | Macon to Tifton (inland) | **Light** |
| B | Tifton to Waycross (transitional) | **Light** (confirm Figure 250-1) |
| C | Waycross to Brunswick (coastal approach, ~50 miles from Atlantic) | **Extreme Wind overlay** |

For a 250-ft span at 28-ft attachment height over a road, the engineer calculates:

| Segment | District | Design sag | Midspan clearance | NESC 232 minimum | Compliant? |
|---|---|---|---|---|---|
| A (Macon area) | Light | 6.04 ft | 21.96 ft | 15.5 ft | Yes — 6.46 ft margin |
| C (Brunswick approach) | Extreme Wind | 18.0 ft | 10.0 ft | 15.5 ft | **No** — 5.5 ft deficit |

**Decision:** Segment C cannot use 250-ft spans at 28-ft attachment height. Options: (1) increase pole height to 33.5 ft attachment height (adds cost per pole), (2) reduce span to ~208 ft (adds poles along 50-mile route), or (3) use a cable with higher RTS at the same EDS% to increase H and reduce sag.

This scenario demonstrates that a route engineer cannot apply a single span standard across a multi-district route without re-running the sag-tension analysis per district.

---

## Multiple-Choice Quiz

---

**Q1.** A project route runs through Macon, GA (inland). Per NESC C2-2023 Rules 250–252 and Figure 250-1, which loading district applies, and what are the design ice thickness and wind pressure?

A) Heavy district: 0.50 in. radial ice, 4 psf wind, 0°F

B) Medium district: 0.25 in. radial ice, 4 psf wind, 15°F

C) Light district: 0 in. radial ice, 9 psf wind, 60°F **[CORRECT]**

D) Extreme Wind district: no ice, design wind per ASCE 7-16 (approximately 28 psf for coastal Georgia)

*Rationale:*
- **A — Incorrect.** Heavy district (0.50 in. ice, 4 psf, 0°F) applies to northern US regions where sustained ice accumulation is a design expectation. Middle Georgia's climate produces rare, short-duration ice events that do not meet the Heavy design loading. [NESC C2-2023, Rule 250, Figure 250-1]
- **B — Incorrect.** Medium district (0.25 in. ice, 4 psf, 15°F) applies roughly to mid-latitude US. The Georgia inland region south of the fall line (which includes Macon) is a Light district area under Figure 250-1. [NESC C2-2023, Rule 250, Figure 250-1]
- **C — Correct.** Macon, GA at ~32.84°N in the inland coastal plain is designated **Light loading district** per NESC C2-2023 Figure 250-1: 0 in. radial ice, **9 psf** horizontal wind, **60°F** design temperature. This is the primary loading district for Launch Fiber Services projects in the Macon area. [NESC C2-2023, Rules 250, 252, Figure 250-1]
- **D — Incorrect.** Extreme Wind applies to projects within approximately 60 miles of the Atlantic or Gulf coastline. Macon is approximately 180 miles from the Atlantic coast — well outside the Extreme Wind zone under standard NESC interpretation. [NESC C2-2023, Rule 251]

---

**Q2.** For the Light-district worked example in this lesson (250-ft span, 28-ft attachment, 0.476 lb/ft resultant load, H = 616 lb), what would happen to the midspan sag if the span were extended to 300 ft while keeping all other parameters the same, and would the clearance over a road remain compliant?

A) Sag would increase to approximately 7.25 ft; midspan clearance would be 20.75 ft — still compliant with 5.25 ft margin

B) Sag would increase to approximately 8.69 ft; midspan clearance would be 19.31 ft — still compliant with 3.81 ft margin **[CORRECT]**

C) Sag would increase to approximately 12.5 ft; midspan clearance would be 15.5 ft — exactly at the NESC minimum with zero margin

D) Sag would decrease because longer spans pull the cable into a flatter catenary at higher natural tension

*Rationale:*
- **A — Incorrect.** 7.25 ft sag for a 300-ft span would require sag to scale linearly with span — but the sag formula scales with L² (span squared), not L. Linear scaling would give 6.04 × (300/250) = 7.25 ft, which underestimates the true sag. [IEEE Std 1222 §5]
- **B — Correct.** Sag scales with L²: S_300 = S_250 × (300/250)² = 6.04 × (1.20)² = 6.04 × 1.44 = **8.6976 ft ≈ 8.69 ft**. Equivalently, direct calculation: S = (0.476 × 300²) / (8 × 616) = (0.476 × 90,000) / 4,928 = 42,840 / 4,928 = 8.693 ft ≈ 8.69 ft. Midspan clearance = 28.0 − 8.69 = **19.31 ft**. Margin = 19.31 − 15.5 = **3.81 ft** — still compliant. [IEEE Std 1222 §5; NESC C2-2023, Rule 232]
- **C — Incorrect.** 12.5 ft sag at 300 ft would represent sag scaling as L^2.67 — no such relationship exists. This answer conflates the maximum allowable sag (12.5 ft) with the calculated sag at a different span. [IEEE Std 1222 §5]
- **D — Incorrect.** Span length L appears in the sag formula numerator (L²), not the denominator. Longer spans always produce more sag, not less, at the same tension and cable weight. Tension at EDS (H) is fixed by the design; it does not increase because the span is longer. [IEEE Std 1222 §5]

---

## Final Check: Pulse Questions

**Pulse 1.** State the 4 loading district / condition options in NESC C2-2023 Part 2 and name the primary one applicable to Macon, GA.

*Expected answer:* NESC C2-2023 Part 2 defines three primary loading districts per Rule 250: (1) **Light** — 0 in. ice, 9 psf wind, 60°F; (2) **Medium** — 0.25 in. ice, 4 psf wind, 15°F; (3) **Heavy** — 0.50 in. ice, 4 psf wind, 0°F. Rule 251 adds (4) **Extreme Wind** — no ice, high single wind event per ASCE 7-16, for coastal zones. Primary district for Macon, GA inland: **Light**. Extreme Wind applies to Georgia coastal projects within ~60 miles of the Atlantic/Gulf coast. [NESC C2-2023, Rules 250–252, Figure 250-1]

**Pulse 2.** Using the parabolic sag formula: cable w_v = 0.155 lb/ft, wind 9 psf, OD 0.050 ft (Light district), H = 616 lb. What is the resultant unit load and the midspan sag for a 200-ft span? Show each step.

*Expected answer:*
1. Horizontal wind load: w_h = 9 × 0.050 = 0.450 lb/ft
2. Resultant: w = √(0.155² + 0.450²) = √(0.024025 + 0.202500) = √0.226525 = **0.476 lb/ft**
3. Sag: S = (0.476 × 200²) / (8 × 616) = (0.476 × 40,000) / 4,928 = 19,040 / 4,928 = **3.86 ft**

[IEEE Std 1222 §5; NESC C2-2023, Rule 250]

---

## Glossary Cross-References

- **NESC loading districts** → T3 L3.4 (sag-tension uses these loading conditions as inputs); L4.2a (loading district determines the sag used in clearance check)
- **Parabolic sag formula (IEEE Std 1222 §5)** → T3 L3.4 (introduced and derived); L4.2a (clearance check applies resulting sag)
- **EDS / RTS** → T3 L3.4 (EDS introduced as design constraint); L4.2a (determines H in tension-to-clearance chain)
- **Extreme Wind overlay** → L4.2a (clearance check must be repeated for Extreme Wind zone routes); T3 L3.4 (sag-tension re-run for Extreme Wind conditions)
- **More-restrictive-governs** → L4.1 (framework); applied here if coastal project permit conditions impose more stringent loading than NESC Extreme Wind
- **Figure 250-1** → district map reference; AHJ confirmation required before final design
