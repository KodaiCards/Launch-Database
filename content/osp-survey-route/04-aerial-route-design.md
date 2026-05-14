---
title: "Lesson 3.4: Aerial Route Design — Pole Loading, Span Lengths, and Midspan Height"
duration_min: 30
topic: osp-survey-route
order: 4
bicsi_alignment:
  - "OSP-DRD Ch. 6.3: Aerial construction design"
sources:
  - "NESC (National Electrical Safety Code) C2-2023, Rules 230, 232, 250–251, 261"
  - "IEEE 1222 §5 (ADSS sag-tension and span rating)"
  - "BICSI OSP-DRD Manual, Ch. 6.3"
  - "RUS Bulletin 1715E-110 (electric and telecommunications joint-use pole construction)"
  - "AASHTO utility placement and clearance standards (public)"
---

# Aerial Route Design — Pole Loading, Span Lengths, and Midspan Height

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the three NESC loading districts and the design ice/wind load conditions each imposes on aerial cable
- Explain the catenary sag-tension relationship and how span length, cable weight, and tension interact to determine midspan sag
- Calculate maximum span length given attachment height, required NESC clearance, and a manufacturer sag-tension table value
- Describe the three components of pole transverse load and identify when guy-wire installations are required

---

## Reading Content

### The Engineering Problem: Cable Hanging Between Poles

Every aerial OSP fiber cable must satisfy two competing requirements: it must be strung tight enough to maintain NESC clearance under maximum ice and wind load, and loose enough (low enough tension) to prevent fatigue failure over a 30+ year service life. These requirements pull in opposite directions. Higher tension means less sag — better clearance at the cost of fatigue. Lower tension means more sag — longer service life at the cost of clearance margin. Aerial route design is the discipline of finding span lengths and attachment heights where both requirements are met simultaneously.

This analysis is governed by four NESC sections and the manufacturer's sag-tension tables for the specific cable:

- **NESC Rules 250–251:** Define the ice thickness and wind pressure for each loading district (the load cases the cable must survive)
- **NESC Rule 232:** Defines the clearance the cable must maintain at maximum sag (the clearance target)
- **NESC Rule 261:** Defines the pole loading analysis requirements (the structural target)
- **NESC Rule 230:** Defines the general loading requirements for aerial conductors

### NESC Loading Districts

NESC C2-2023 divides the continental United States into three primary loading districts, each defined by the combination of radial ice thickness and horizontal wind pressure that represent the design extreme for that geography. [NESC C2-2023, Rules 250–251]

| Loading district | Radial ice thickness | Wind pressure | Ambient temperature |
|---|---|---|---|
| **Light** | 0 in. | 9 psf (pounds per square foot) | 60°F |
| **Medium** | 0.25 in. (6.35 mm) | 4 psf | 15°F |
| **Heavy** | 0.50 in. (12.7 mm) | 4 psf | 0°F |

An additional **Extreme Wind** district applies in coastal areas where hurricane-force winds drive the design; the heavy-district ice load is replaced by a higher wind pressure. Check the NESC loading district map (available as a free supplement to NESC) for the specific geographic location of the route.

**Why loading district matters:** The same cable strung on the same poles at the same tension produces different sag in different loading districts. Heavy ice accumulation adds significant weight to the cable per unit length, increasing sag. Cold temperature (0°F) also increases cable tension (cables contract at lower temperatures, which raises tension and decreases sag — a counteracting effect, but ice weight dominates for most cable types). The manufacturer's sag-tension tables provide sag values for each NESC loading district and temperature condition; the design engineer uses the appropriate table column for the route geography.

### The Catenary: Sag, Tension, and Cable Weight

A cable suspended between two attachment points hangs in a shape called a catenary. For engineering purposes, when the sag is less than approximately 10% of the span length (which covers most OSP route spans), the catenary is well-approximated by a parabola. The key sag-tension relationship is:

**S = w × L² / (8 × H)**

Where:
- **S** = sag at midspan (ft or m)
- **w** = cable weight per unit length including ice load (lb/ft or N/m)
- **L** = span length (ft or m)
- **H** = horizontal component of tension at midspan (lb or N)

Rearranging to find maximum span length given a required clearance:

**L_max = √(8 × H × S_max / w)**

Where S_max is the maximum allowable sag before NESC clearance is violated:

**S_max = Attachment height − Required clearance**

This formula reveals the design levers available to the route engineer:
- **Increase attachment height** → increases S_max → longer spans possible
- **Increase tension H** → directly increases maximum span
- **Heavier cable (higher w)** → reduces maximum span for a given tension
- **Shorter required clearance** → only possible over non-vehicle-accessible terrain per Rule 232

In practice, the design engineer does not manually derive sag from first principles — manufacturer sag-tension tables provide sag values for specific cable types, span lengths, and loading conditions. The formula is used to verify that a proposed attachment height and span combination satisfies clearance at the tabulated sag value. [IEEE 1222 §5; BICSI OSP-DRD Manual, Ch. 6.3]

### Every Day Stress and Long-Term Tension Management

As introduced in Topic 1 (Cable Selection), **Every Day Stress (EDS)** is the sustained operating tension at average everyday temperature (typically 15°C / 59°F), expressed as a percentage of the cable's Rated Tensile Strength (RTS). NESC and IEEE 1222 recommend EDS ≤ 20–25% RTS. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

EDS matters for route design because it determines the stringing tension — the tension at which the cable is attached during installation. The installer targets a specific sag at stringing temperature that will produce the correct EDS. If the cable is strung too tight (low sag at stringing temperature), EDS is too high and the cable is at risk of fatigue failure and insufficient clearance margin. If strung too loose (excessive sag at stringing temperature), EDS is too low and ice loading can pull tension above safe limits.

**Creep:** Over years of service, synthetic strength members (aramid yarn) and metallic messengers elongate slightly under sustained tension — a phenomenon called creep. Creep increases sag over time, reducing the clearance margin. Manufacturers' sag-tension tables include a "final sag" value that accounts for the expected creep elongation over the cable's service life; design for NESC clearance must use the final sag value, not the initial installed sag. [IEEE 1222 §5.2]

### Worked Example: Maximum Span Length from Sag-Tension Table

**Given:**
- Route geography: NESC Heavy loading district
- Cable: ADSS, 48-fiber, manufacturer unit weight 0.220 lb/ft (without ice)
- NESC Heavy ice load adds 0.072 lb/ft radial ice weight (0.50 in. radial ice on 0.60 in. cable diameter)
- Loaded cable weight w = 0.220 + 0.072 = **0.292 lb/ft**
- Attachment height at both poles: 28 ft above ground
- Crossing type: county road (NESC Rule 232 minimum = 15.5 ft)
- EDS at 59°F: 18% RTS; cable RTS = 2,800 lb; **H = 18% × 2,800 = 504 lb** *(18% is a conservatively low design choice; IEEE 1222 typical range is 20–25% RTS. Using a below-range EDS increases fatigue margin and reduces the risk of tension exceedance under ice load, but requires a higher attachment point or shorter spans to maintain NESC clearance at the larger resulting sag.)*

**Step 1 — Maximum allowable sag:**

S_max = Attachment height − Required clearance = 28 ft − 15.5 ft = **12.5 ft**

**Step 2 — Maximum span length:**

L_max = √(8 × H × S_max / w)
L_max = √(8 × 504 × 12.5 / 0.292)
L_max = √(50,400 / 0.292)
L_max = √172,603
**L_max ≈ 415 ft**

**Step 3 — Verify with manufacturer table:**

The manufacturer's sag-tension table for this cable at NESC Heavy district, 28-ft attachment, shows final sag of **11.8 ft** at 400-ft span. Since 11.8 ft < 12.5 ft (maximum allowable), a 400-ft span provides **16.2 ft midspan clearance** — above the 15.5 ft NESC minimum with 0.7 ft of margin.

**Decision:** A 400-ft span is acceptable. If poles on the proposed route are spaced at 350 ft on average, clearance margin is even higher. If any span must be extended to 450 ft (around an obstacle), recheck against the sag table for that span length.

*Note: This calculation uses the simplified parabolic approximation. For spans with more than 5% elevation difference between attachment points or spans approaching 10% of the span length in sag, use the full catenary equation or manufacturer's computer-assisted sag-tension tool.* [NESC C2-2023, Rules 230, 232; IEEE 1222 §5; BICSI OSP-DRD Manual, Ch. 6.3]

### Pole Loading Analysis

A utility pole supporting aerial cable must resist the loads the cable imposes on it. NESC Rule 261 requires that pole loading analysis be performed for any pole where the new attachment changes the load pattern. The three load components for a cable attachment on a tangent (straight-line) pole are:

**Transverse load (wind-driven):**
The horizontal force perpendicular to the cable direction caused by wind pressure on the cable. For each span on either side of the pole:
- Wind load = Wind pressure (psf) × Cable OD (ft) × Span length (ft) / 2
- Units: pounds (applied at the attachment height)

For a pole mid-span between two equal-length spans, the transverse loads from each side act in opposite directions and may partially cancel. At a dead-end or corner pole, the transverse load is one-directional and fully accumulated.

**Longitudinal load (tension differential):**
At a dead-end pole, the full cable tension acts longitudinally (along the cable direction). At a corner pole, the vector sum of the tensions from each direction acts on the pole. On a tangent pole with equal spans, the longitudinal forces from each side cancel — no net longitudinal load in normal conditions, but a significant load if one span fails.

**Vertical load (cable weight):**
The weight of cable and ice on each half-span loads the pole vertically at the attachment point. Vertical load per pole = w × (span1/2 + span2/2). This load is additive on any pole regardless of pole position. [NESC C2-2023, Rule 261; RUS Bulletin 1715E-110]

### When Guy Wires Are Required

Guy wires (anchor wires running from the pole to a ground anchor) resist lateral and longitudinal loads that exceed the pole's unguyed capacity. Guy wire requirements arise at:

**Dead-end poles:** The full cable tension acts longitudinally. Guy wires in the back-guy direction (away from the cable run) resist this tension. Back guying is always required at line terminations.

**Corner poles (angle poles):** The vector resultant of tensions from two cable directions creates a net lateral force. Guy wires in the bisector direction of the corner angle resist this force. Corner guying is always required at angles greater than 3–5° from straight.

**Excessive-load poles:** When the cumulative transverse and vertical loads from multiple attachments exceed the pole's class strength (determined by pole class per NESC Table 261-2A), a mid-span down-guy or replacement with a larger pole class is required. This is evaluated by the pole loading analysis.

**Long spans:** Spans significantly longer than the route average impose higher per-span loads. Poles at each end of a long span may require intermediate down-guys if the pole class is insufficient. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1715E-110]

### Joint-Use Poles: Communication Space Geometry

On joint-use poles shared with electric supply conductors, the cable attachment height is constrained by the communication space — the vertical zone on the pole below all supply conductors and above the NESC minimum ground clearance. This constrains the attachment height available for the fiber cable to the communication space height, which may be lower than the attachment height that would produce optimal clearance over road crossings.

If the communication space attachment height does not allow the required clearance over a road in the span, the design options are:

1. **Reduce span length** — shorter span reduces sag, increases clearance at the same attachment height
2. **Add an intermediate pole** — reducing span length to achieve the required clearance from the available attachment height
3. **Request a higher attachment point** — in some joint-use agreements, renegotiating the attachment position is possible but requires pole loading analysis to confirm the pole can carry the revised load

The joint-use attachment height is documented in the joint-use make-ready analysis, which is produced before construction drawings are finalized. [NESC C2-2023, Rule 238; RUS Bulletin 1715E-110; BICSI OSP-DRD Manual, Ch. 6.3]

### NESC Grade of Construction

NESC grades of construction (Grade B, Grade C) specify the safety factors applied to pole and wire hardware. For communication conductors in standard OSP applications, **Grade C construction** is the applicable standard — lower safety factors than Grade B supply lines, reflecting the lower hazard level of communication conductors. Some applications require Grade B: communication lines attached to the same structure as supply conductors in certain configurations, or lines adjacent to railroads. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

Pole selection by NESC class:
- **Class 1–3** poles: most common for rural communication distribution, 40–45 ft, sufficient for standard spans and load conditions
- **Class H1–H6** poles: heavy-duty, required at dead-ends on long spans, large-angle corners, and high-load accumulation points

Pole selection is confirmed by the pole loading analysis; the route design drives the minimum class requirement at each pole position. [NESC C2-2023, Rule 261; RUS Bulletin 1715E-110]

---

## Key Terms (Flashcard Candidates)

**NESC loading district (Light / Medium / Heavy)**
Geographic designation per NESC C2-2023 Rules 250–251 that defines the design radial ice thickness and horizontal wind pressure for aerial line engineering. Light: 0 in. ice, 9 psf wind. Medium: 0.25 in. ice, 4 psf wind at 15°F. Heavy: 0.50 in. ice, 4 psf wind at 0°F. Design sag and tension must satisfy NESC clearances at the maximum load condition for the applicable district. [NESC C2-2023, Rules 250–251]

**Catenary / parabolic sag approximation**
A cable suspended between two points hangs in a catenary shape. For sag less than ~10% of span length (typical OSP spans), the parabolic approximation S = w × L² / (8 × H) is accurate for engineering purposes: S = midspan sag, w = cable weight per unit length (with ice), L = span length, H = horizontal tension component. [IEEE 1222 §5; BICSI OSP-DRD Manual, Ch. 6.3]

**Every Day Stress (EDS)**
The design stringing tension for aerial cable at average everyday temperature (15°C), expressed as a percentage of Rated Tensile Strength (RTS). IEEE 1222 and NESC recommend EDS ≤ 20–25% RTS to limit fatigue from Aeolian vibration and maintain margin for ice load tension increase. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

**Creep**
Permanent elongation of cable strength members (aramid, messenger) under sustained tension over the cable service life. Increases sag over time, reducing clearance margin. Manufacturer sag-tension tables include final (creep-adjusted) sag values; design clearances must use final sag, not initial installed sag. [IEEE 1222 §5.2]

**Transverse load**
The horizontal force on a pole perpendicular to the cable direction, caused by wind pressure on the cable and ice load. Calculated as wind pressure × cable OD × half-span length for each contributing span. Largest at corner and dead-end poles where loads are unbalanced. [NESC C2-2023, Rule 261]

**Dead-end pole**
A pole at the termination point of a cable run or at a pull-off point where the full cable tension acts longitudinally on the pole. Requires back guying to resist the longitudinal tension. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

**Corner pole (angle pole)**
A pole located at a horizontal direction change in the cable route. The vector resultant of cable tensions from two directions creates a net lateral force on the pole. Requires a bisector guy wire when the angle exceeds approximately 3–5° from straight. [NESC C2-2023, Rule 261]

**NESC Grade C construction**
The construction standard applicable to communication conductors in standard OSP applications. Lower safety factors than Grade B (supply conductors), appropriate for the lower hazard level of non-energized communication lines. Some situations require Grade B: communication lines adjacent to railways or attached to structures with supply conductors. [NESC C2-2023, Rule 261]

**Communication space**
The designated vertical zone on a joint-use pole where communication conductors must be attached per NESC Rule 238 — below all supply conductors, above NESC minimum ground clearance. The top of the communication space is governed by horizontal clearance from the lowest supply conductor. [NESC C2-2023, Rule 238; RUS Bulletin 1715E-110]

---

## Interactive: Scenario — Span-Length Decision from Sag-Tension Table

### Scenario

An OSP engineer is designing an aerial ADSS route in a NESC Medium loading district. The route follows a county road ROW for 1.2 miles. The joint-use poles are Class 3, 40-ft height, with a communication space top at **25 ft above grade** (determined by make-ready analysis: the lowest supply conductor attachment is at 27 ft, and Rule 238 requires 24 in. clearance at this supply voltage, placing the maximum communication attachment at 25 ft).

The manufacturer's sag-tension table for the 48-fiber ADSS cable in NESC Medium district provides the following final sag values:

| Span length | Final sag at NESC Medium (0.25 in. ice at 15°F) |
|---|---|
| 250 ft | 4.8 ft |
| 300 ft | 6.9 ft |
| 350 ft | 9.4 ft |
| 400 ft | 12.3 ft |
| 450 ft | 15.5 ft |

The county road requires 15.5 ft minimum clearance per NESC Rule 232.

**Decision required:** What is the maximum standard span length from the table that satisfies NESC clearance, and what is the clearance margin at that span?

---

**Step 1 — Calculate maximum allowable sag:**

S_max = Attachment height − Required clearance = 25 ft − 15.5 ft = **9.5 ft**

**Step 2 — Find the maximum span from the table where final sag ≤ 9.5 ft:**

| Span | Final sag | Satisfies S_max ≤ 9.5 ft? |
|---|---|---|
| 250 ft | 4.8 ft | Yes |
| 300 ft | 6.9 ft | Yes |
| 350 ft | 9.4 ft | Yes |
| 400 ft | 12.3 ft | **No** (12.3 ft > 9.5 ft) |
| 450 ft | 15.5 ft | No |

**Maximum span: 350 ft.** Final sag at 350 ft = 9.4 ft.

**Step 3 — Calculate clearance margin at 350-ft span:**

Midspan clearance = 25 ft − 9.4 ft = **15.6 ft**
NESC minimum = 15.5 ft
Margin = 15.6 − 15.5 = **0.1 ft (1.2 inches)**

**Assessment:** The 350-ft span barely passes — 0.1 ft of margin is insufficient for engineering practice. Good practice requires at least 0.5–1.0 ft of margin to account for pole settlement, installation sag variation, and future span-length adjustments. A more conservative maximum span for this route is **300 ft**, providing a midspan clearance of 25 − 6.9 = 18.1 ft and a margin of 2.6 ft.

**Conclusion:** In this scenario, 300-ft pole spacing achieves adequate clearance margin. 350-ft pole spacing is technically compliant per table values but has insufficient margin for practice. 400-ft and above are non-compliant. The final span recommendation for the construction drawing is **300 ft maximum**, with poles added as needed to keep spans within this limit. [NESC C2-2023, Rules 232, 250; BICSI OSP-DRD Manual, Ch. 6.3; IEEE 1222 §5]

---

## Multiple-Choice Quiz

---

**Q1.** A route is being designed in a NESC Heavy loading district. The manufacturer's sag-tension table for the selected cable shows "final sag" values in one column and "initial sag" values in another. Which column must be used to verify NESC clearance compliance, and why?

- A) Initial sag — this is the sag at installation, and clearance is measured at the time of construction inspection
- B) Final sag — this accounts for creep elongation of the strength members over the service life, which increases sag beyond the initial installed value **[CORRECT]**
- C) Average of initial and final sag — clearance is checked at the midpoint of the cable's design life
- D) Initial sag, but increased by 20% for a standard engineering safety factor

*Rationale:*
- **A — Incorrect.** Initial sag is the sag immediately after installation, before creep occurs. A cable strung to initial-sag specification will have higher final sag after years of service as the strength members elongate under sustained tension. Designing to initial sag without accounting for creep produces a cable that violates NESC clearances later in its service life. [IEEE 1222 §5.2]
- **B — Correct.** Final sag values in manufacturer tables account for the expected creep elongation of the cable's strength members (aramid yarn for ADSS, steel messenger for lashed cable) over the design service life at the specified EDS. NESC clearances must be maintained throughout the cable's service life — including at final sag — not merely at installation. Designing to final sag ensures clearance compliance at the worst condition during the cable's operational life. [IEEE 1222 §5.2; NESC C2-2023, Rules 230, 232]
- **C — Incorrect.** There is no "average sag" design standard in NESC or IEEE 1222. NESC clearances are minimum floors that must be met at all times; the most demanding condition (final sag under maximum ice load) governs. [NESC C2-2023, Rule 232]
- **D — Incorrect.** Applying a 20% factor to initial sag is not a standard method recognized by NESC, IEEE 1222, or BICSI. The correct method is to use the manufacturer's final sag values derived from the cable-specific creep testing protocol. A percentage factor on initial sag does not correctly replicate the material-science behavior of aramid or steel creep. [IEEE 1222 §5.2]

---

**Q2.** Using the parabolic sag approximation, what is the midspan sag for a 350-ft span if the cable weighs 0.180 lb/ft (no ice) and is strung at a horizontal tension of 450 lb?

- A) 3.1 ft
- B) 6.1 ft **[CORRECT]**
- C) 9.2 ft
- D) 12.3 ft

*Rationale:*
- **A — Incorrect.** 3.1 ft results from dividing the correct numerator by 2 instead of by (8 × H): S = 22,050 / (2 × 3,600) = 3.06 ft. This conflates the factor of 8 in the denominator with a factor of 2, a common formula mis-transcription. The correct denominator is always 8 × H. [IEEE 1222 §5; BICSI OSP-DRD Manual, Ch. 6.3]
- **B — Correct.** Applying the parabolic sag formula: S = w × L² / (8 × H). With w = 0.180 lb/ft, L = 350 ft, H = 450 lb: S = 0.180 × (350)² / (8 × 450) = 0.180 × 122,500 / 3,600 = 22,050 / 3,600 = **6.125 ft ≈ 6.1 ft**. [IEEE 1222 §5; NESC C2-2023, Rule 230]
- **C — Incorrect.** 9.2 ft results from incorrectly adding a 0.10 lb/ft ice load to the given cable weight before applying the formula: w_ice = 0.180 + 0.100 = 0.280 lb/ft → S = 0.280 × 122,500 / 3,600 = 9.5 ft ≈ 9.2 ft. The problem specifies no ice load; ice-loading parameters are given explicitly in the problem statement when applicable. [IEEE 1222 §5]
- **D — Incorrect.** 12.3 ft results from using the loaded NESC Heavy district cable weight from the worked example (0.292 lb/ft) instead of the 0.180 lb/ft stated in this problem: S = 0.292 × 122,500 / 3,600 = 9.94 ft... or from applying the formula with H = 225 lb (half the stated tension): S = 0.180 × 122,500 / 1,800 = 12.25 ft. Neither substitution is warranted by the problem as stated. [IEEE 1222 §5]

---

**Q3.** A pole at a 45-degree corner in an aerial cable route carries cable runs leaving at 90 degrees to each other. The cable has a stringing tension of 380 lb in each direction. A back-guy wire is installed in the bisector direction of the corner. What net force must the guy wire resist?

- A) 380 lb — the tension from only the more loaded direction
- B) 760 lb — the sum of both tensions, since they act at 90 degrees
- C) 537 lb — the vector resultant of two 380 lb tensions at 90 degrees **[CORRECT]**
- D) 190 lb — the average of the two tensions

*Rationale:*
- **A — Incorrect.** At a corner pole, both tension vectors act on the pole simultaneously. The net force is not the greater of the two — it is the vector sum of both. [NESC C2-2023, Rule 261]
- **B — Incorrect.** 760 lb (the arithmetic sum) would be correct only if both cable tensions act in the same direction — a dead-end with two cables running parallel. At a 90-degree corner, the two tensions act at right angles; vector addition applies, not scalar addition. [NESC C2-2023, Rule 261]
- **C — Correct.** The net force from two equal tensions at 90 degrees to each other is the vector resultant: F_net = √(T₁² + T₂²) = √(380² + 380²) = √(144,400 + 144,400) = √288,800 = **537 lb**. This is the force the bisector guy wire must resist. For an angle other than 90 degrees, use F_net = 2T × sin(θ/2) where θ is the angle between the two cable directions. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]
- **D — Incorrect.** The average of two tensions (190 lb) has no physical meaning for the net force on a corner pole. The resultant is the vector magnitude, not an average. [NESC C2-2023, Rule 261]

---

**Q4.** A rural OSP route in a NESC Medium loading district uses 350-ft average spans. At one location, a pond forces the span to extend to 500 ft. Attachment height at both poles is 26 ft. The sag-tension table shows a final sag of 13.8 ft for a 500-ft span at NESC Medium loading. The crossing is over an agricultural field with no road access. What is the midspan clearance, and does it satisfy NESC Rule 232?

- A) 12.2 ft — does not satisfy NESC Rule 232 (15.5 ft minimum for all land)
- B) 12.2 ft — satisfies NESC Rule 232, because the 12 ft minimum applies over land not normally accessible to vehicles **[CORRECT]**
- C) 15.5 ft — satisfies NESC Rule 232 for vehicle-accessible roads
- D) 13.8 ft — equal to the sag value; NESC clearance is measured from the sag, not from the ground

*Rationale:*
- **A — Incorrect.** NESC Rule 232, Table 232-1 distinguishes between the clearance required over roads and vehicle-accessible areas (15.5 ft) and over land not normally accessible to vehicles (12.0 ft). Agricultural fields with no road access fall in the latter category. 12.2 ft satisfies the 12.0 ft minimum. [NESC C2-2023, Rule 232]
- **B — Correct.** Midspan clearance = attachment height − sag = 26 ft − 13.8 ft = **12.2 ft**. NESC Rule 232 requires 15.5 ft over roads and vehicle-accessible areas, but only **12.0 ft** over land not normally accessible to vehicles. A pond crossing through an agricultural field with no road access qualifies as non-vehicle-accessible land. 12.2 ft > 12.0 ft → clearance is satisfied. [NESC C2-2023, Rule 232; BICSI OSP-DRD Manual, Ch. 6.3]
- **C — Incorrect.** 15.5 ft is the clearance requirement over roads and vehicle-accessible areas — it does not apply to an agricultural field with no vehicle access. The midspan clearance calculation (26 − 13.8 = 12.2 ft) is the correct value; 15.5 ft is not achieved by this span configuration. [NESC C2-2023, Rule 232]
- **D — Incorrect.** Clearance is measured from the cable at maximum sag to the ground below — it is the difference between attachment height and sag, not the sag value itself. Sag and clearance are different physical quantities measured from different reference points. [NESC C2-2023, Rule 232]

---

**Q5.** What happens to midspan sag when a cable is strung at lower tension (looser installation), and what NESC consequence does this have for road clearances?

- A) Lower tension decreases sag, increasing clearance — looser cables hang closer to the poles
- B) Lower tension increases sag, potentially reducing midspan clearance below NESC Rule 232 minimums if the cable is strung too loosely **[CORRECT]**
- C) Tension has no effect on sag; sag is determined only by cable weight and span length
- D) Lower tension decreases sag at warm temperatures but increases sag at cold temperatures, with no net effect

*Rationale:*
- **A — Incorrect.** Lower tension allows gravity and cable weight to pull the cable downward more, increasing the midspan sag (the cable hangs lower). Higher tension resists this deflection, pulling the cable into a flatter catenary with less sag. The relationship between tension and sag is inverse: sag increases as tension decreases. [IEEE 1222 §5; NESC C2-2023, Rule 230]
- **B — Correct.** The parabolic sag formula S = w × L² / (8 × H) shows that sag S is inversely proportional to tension H: as H decreases, S increases. A cable strung at lower tension hangs lower at midspan. If the installation sag is too large (cable strung too loosely), midspan clearance falls below the NESC Rule 232 minimum over roads. This is why stringing tension is specified by the engineer and verified during installation — not left to the discretion of the installation crew. [IEEE 1222 §5.2; NESC C2-2023, Rules 230, 232]
- **C — Incorrect.** Tension H appears explicitly in the sag formula denominator: S = w × L² / (8 × H). Tension has a direct, quantifiable effect on sag. [IEEE 1222 §5]
- **D — Incorrect.** Temperature affects tension (cables contract in cold, increasing tension and decreasing sag), but the primary effect of stringing tension on clearance is the inverse relationship at the installation condition and at all subsequent temperatures. At warm temperatures, tension decreases further (thermal expansion), increasing sag — making over-loose installation most dangerous in summer, when the cable is longest and has least tension. [IEEE 1222 §5.2; NESC C2-2023, Rule 250]

---

## Final Check

Answer before proceeding to Lesson 3.5.

**Pulse 1.** Describe the three load components that act on a utility pole supporting aerial cable, and identify which pole configuration makes each load most critical.

*Expected answer:*
(1) **Transverse load** (horizontal, perpendicular to cable direction): wind pressure on cable and ice. Most critical at corner poles (loads from two directions, partially non-canceling) and dead-end poles (load is fully one-directional). At tangent poles with equal spans, transverse loads from each side cancel.
(2) **Longitudinal load** (horizontal, along the cable direction): full cable tension at dead-end poles; vector resultant of tensions at corner poles; near-zero at mid-span tangent poles. Most critical at dead-ends and large-angle corners — these poles require guy wires.
(3) **Vertical load** (downward): cable weight and ice load per half-span on each side. Additive at every pole. Most critical per attachment at long spans (higher weight per contributing half-span). [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

**Pulse 2.** Using the parabolic sag formula, determine the maximum span length for a cable with unit weight 0.25 lb/ft (loaded with ice), strung at 500 lb horizontal tension, with attachment height of 30 ft and a required NESC clearance of 15.5 ft over a road.

*Expected answer:*
Step 1: S_max = 30 − 15.5 = 14.5 ft maximum allowable sag.
Step 2: L_max = √(8 × H × S_max / w) = √(8 × 500 × 14.5 / 0.25) = √(58,000 / 0.25) = √232,000 = **481 ft**.
Maximum span: 481 ft. In practice, round down to the nearest standard pole spacing — 450 ft would provide comfortable margin. The designer should verify this against the manufacturer's final sag table for the specific cable at the applicable NESC loading district; the formula result is a design starting point, not a final value. [NESC C2-2023, Rules 230, 232; IEEE 1222 §5; BICSI OSP-DRD Manual, Ch. 6.3]

---

## Glossary Cross-References

- **NESC loading district / sag-tension / EDS** → Topic 1 Lesson 4 (armored/aerial variants — ADSS EDS and sag introduced there); Topic 1 Lesson 10 (environment-driven selection — NESC district drives ADSS span rating)
- **Catenary / parabolic sag formula** → Lesson 3.3 (midspan clearance calculation applies the sag concept); Lesson 3.9 (splice point placement — sag determines the lowest accessible maintenance point on a span)
- **Pole loading / transverse/longitudinal/vertical load** → Lesson 3.7 (aerial-to-underground transitions — dead-end load at the transition pole requires back guying); Lesson 3.10 (construction drawings — pole loading notes appear on detail sheets)
- **Guy wire requirements** → Lesson 3.7 (aerial-to-underground transitions — transition pole is a dead-end requiring back guying); Lesson 3.10 (construction drawings — guy wire details on drawing set)
- **Communication space** → Lesson 3.3 (NESC Rule 238 governs the communication space boundaries)
- **Creep / final sag** → Topic 1 Lesson 4 (ADSS EDS and fatigue introduced); Lesson 3.10 (construction drawings — sag-tension tables referenced in drawing notes)
