---
title: "Lesson 5.2a: Strand and Messenger Wire — Grade Selection and RBS"
duration_min: 25
topic: osp-hardware-accessories
order: 2
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.3: Aerial construction — messenger wire selection"
sources:
  - "ASTM A475/A475M (Standard Specification for Zinc-Coated Steel Wire Strand)"
  - "ASTM B498 (Zinc-Coated Steel Wire Strand for Aluminum Conductors)"
  - "ASTM B230 (Aluminum 1350-H19 Wire for Electrical Purposes)"
  - "NESC C2-2023, Rules 250–252, 261"
  - "RUS Bulletin 1715E-110 §3"
  - "RUS Bulletin 1751F-630 §3"
  - "BICSI OSP-DRD Manual, Ch. 6.3"
---

# Strand and Messenger Wire — Grade Selection and RBS

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Define the three ASTM A475/A475M steel strand grades (SM, HS, EHS) and their RBS ranges
- Explain the role of Rated Breaking Strength (RBS) in NESC safety-factor compliance
- Identify the galvanic note for aluminum strand in mixed-metal pole hardware environments
- Describe, in two paragraphs, when ADSS preformed grip dead-ends and AGS suspension assemblies replace lashed messenger hardware
- Use span length and loading district as design inputs to set up the grade-selection scenario (full derivation performed in L5.2b)

> **Prerequisite:** Loading district designation for the route is established in T4 L4.2b. This lesson uses loading district as a given input — do not re-derive it here.

---

## Reading Content

### Why Messenger Grade Selection Matters

The messenger wire (strand) is the structural backbone of every lashed aerial fiber cable assembly. The fiber cable itself has essentially zero tensile strength contribution — it hangs from the messenger. Every load that the aerial assembly encounters — cable weight, ice accumulation, wind pressure, thermal tension change — is ultimately carried by the messenger and transferred to pole hardware at each attachment point.

Underspecifying the messenger grade produces a strand whose Rated Breaking Strength (RBS) is insufficient to maintain the NESC-required safety factor under design loads. The consequence is permanent elongation or strand failure under ice or high-wind events. Overspecifying wastes material and increases dead-end hardware costs (heavier strand requires higher-rated clamps). The selection discipline is: derive the required horizontal tension first, then select the minimum grade whose RBS satisfies the NESC 2.0× safety factor. The derivation is performed in L5.2b; this lesson defines the grades you will be choosing from.

### ASTM A475/A475M — The Governing Standard

Steel messenger wire for telecommunications aerial plant is specified under **ASTM A475/A475M** — *Standard Specification for Zinc-Coated Steel Wire Strand*. The `/A475M` suffix designates the metric companion standard; both govern the same product family and the same RBS performance levels. Procurement engineers and RUS-reviewed plan sets reference A475/A475M as the full citation; A475 alone may be rejected in formal submittals where the metric companion is required. [ASTM A475/A475M, §1.1; D-C1 decision, T5 Final Brief §3]

ASTM A475/A475M defines three strand grades:

#### SM — Standard Grade (Siemens-Martin)

Standard Grade strand is the lowest-strength classification under A475/A475M. It is appropriate for short to moderate spans in light loading districts where the calculated horizontal tension is modest. SM strand uses a softer wire drawing spec than HS or EHS, which makes it slightly more flexible and easier to work with, but limits its RBS per unit cross-section.

**Typical RBS values (0.25-in. / 6.35 mm, 6-wire strand):**

| Strand size | Grade | RBS |
|---|---|---|
| 6M (0.25 in.) | SM | ~2,700 lb (12.0 kN) |
| 6M (0.25 in.) | HS | ~3,780 lb (16.8 kN) |
| 6M (0.25 in.) | EHS | ~4,500 lb (20.0 kN) |

*[ASTM A475/A475M, Table 1 — values for 6-wire strand; consult current A475/A475M edition for exact published RBS by size and construction]*

**NESC allowable tension (2.0× SF):**
- SM: RBS / 2.0 = 2,700 / 2.0 = **1,350 lb**
- HS: RBS / 2.0 = 3,780 / 2.0 = **1,890 lb**
- EHS: RBS / 2.0 = 4,500 / 2.0 = **2,250 lb**

#### HS — High Strength

High Strength grade is the standard specification for most telecom aerial plant in the NESC Light and Medium loading districts. It provides a meaningful step up in RBS over SM without the cost premium of EHS, and is appropriate for span lengths up to 300–350 ft in the Macon, GA Light district for typical lashed cable systems. HS strand is the grade selected in the L5.2b worked example for a 250-ft span at 3.5-ft design sag.

#### EHS — Extra High Strength

Extra High Strength grade provides the maximum RBS per cross-section in the A475/A475M family. It is selected for:
- Long spans (350+ ft in Light district; 250+ ft in Medium or Heavy districts)
- Angle structures where the unbalanced horizontal force exceeds HS allowable
- Crossing spans over highways, railroads, or waterways where NESC requires a higher structural safety factor
- RUS-funded routes where 1751F-630 §3 specifies EHS for certain route categories

> **RUS note:** RUS Bulletin 1715E-110 §3 identifies minimum strand grade requirements for joint-use electric-telecommunications distribution lines. Where RUS specifies EHS, that requirement is binding on the project even if the calculated tension would allow HS. More restrictive governs. [RUS 1715E-110 §3]

### Zinc Coating and Corrosion Protection

All ASTM A475/A475M strand is zinc-coated (galvanized) to resist atmospheric corrosion. ASTM A475/A475M specifies three zinc coating weight classes (A, B, C) — higher weight provides longer corrosion life in aggressive environments. For coastal Georgia routes where salt-air transport applies:

- **Class A coating:** minimum zinc weight, acceptable for inland Light-district installations
- **Class B coating:** standard specification for routes within 20–30 miles of tidal saltwater
- **Class C coating:** maximum zinc weight; specified where chronic marine or industrial salt exposure is expected, or where RUS design standards require it

> **Galvanic note:** The zinc coating on ASTM A475/A475M strand is itself galvanically active. When zinc-coated steel strand contacts uncoated aluminum components without isolation hardware, the zinc coating (anodic relative to aluminum in some environments) may corrode preferentially. Galvanic isolation hardware requirements are addressed in L5.1. The ASTM B498/B230 aluminum strand alternative discussed below does not carry this zinc-related note, but introduces different contact pair considerations at guy anchors and pole hardware.

---

### ADSS Sidebar: When Lashed Messenger Is Not the Platform (2 Paragraphs)

**All-Dielectric Self-Supporting (ADSS) cable** does not use a separate messenger wire. ADSS cable integrates aramid yarn or fiberglass strength members into the cable structure itself, making the cable self-supporting over the span. The hardware required to attach ADSS cable to poles is entirely different from the clamp-and-band system used in lashed construction.

For ADSS cable, the attachment hardware consists of: (1) **preformed grip dead-ends** at span ends and angle structures — helically wound metallic or composite rods that grip the cable sheath over a 12–18-in. engagement length, distributing the termination load through friction rather than a single-point clamp; (2) **AGS (All Galvanized Steel) suspension assemblies** or equivalent at intermediate poles — a suspension loop with an elastomeric cushion that cradles the cable without inducing sheath stress concentrations. These assemblies are available from PLP (Preformed Line Products) and equivalent suppliers. The load ratings, grip sizes, and installation torques for ADSS hardware are cable-OD-specific — every ADSS installation requires hardware matched to the manufacturer's cable OD and RTS specification.

> **Office note:** Launch Fiber Services' standard aerial plant is lashed strand-and-cable using ASTM A475/A475M steel messenger. The lashed-strand worked examples in L5.2b are the primary training content. If the office migrates to ADSS on future route segments, the ADSS hardware selection and sag-tension methodology differ from L5.2b's derivation — consult the ADSS manufacturer's sag-tension tables and IEEE Std 1222 §5 for ADSS-specific design. The L5.2b worked example does not transfer to ADSS without modification.

---

### Aluminum Strand Sidebar (1 Paragraph)

Aluminum messenger wire (ASTM B498, *Zinc-Coated Steel Wire Strand for ACSR*; ASTM B230, *Aluminum 1350-H19 Wire*) is used in some joint-use constructions where the electric utility specifies aluminum neutral messenger or where weight reduction is required on marginal poles. Aluminum strand has approximately one-third the weight of equivalent-strength steel strand per foot, which reduces pole transverse moment from dead load. The trade-off is lower tensile modulus — aluminum strand creeps more under sustained tension than steel, and sag increases over time at a higher rate. Aluminum strand also introduces a new galvanic pairing at pole hardware: aluminum messenger contacting galvanized steel pole bands or guy wire hardware requires the same isolation analysis under NACE SP0286 as the steel-messenger-to-aluminum-clamp pairing addressed in L5.1. For PSC RUS routes, confirm whether RUS 1715E-110 §4 or RUS 1751F-630 §3 specifies allowable messenger material for the project type before substituting aluminum for steel.

---

## Key Terms (Flashcard Candidates)

**Rated Breaking Strength (RBS)**
The minimum tensile load at which a strand sample will fail under laboratory test conditions, per ASTM A475/A475M. The NESC 2.0× safety factor requires that the horizontal design tension not exceed RBS / 2.0. Not to be confused with every-day stress (EDS), which is a sustained percentage of RBS at normal operating temperature.

**SM (Standard Grade)**
Lowest-strength ASTM A475/A475M classification. Typical 6-wire 0.25-in. RBS ≈ 2,700 lb. NESC allowable (÷ 2.0) ≈ 1,350 lb. Selected for short spans in light loading districts where calculated tension remains under 1,350 lb.

**HS (High Strength)**
Mid-range ASTM A475/A475M classification. Typical 6-wire 0.25-in. RBS ≈ 3,780 lb. NESC allowable ≈ 1,890 lb. Standard selection for most telecom aerial plant in NESC Light district at spans up to ~300 ft.

**EHS (Extra High Strength)**
Maximum-strength ASTM A475/A475M classification. Typical 6-wire 0.25-in. RBS ≈ 4,500 lb. NESC allowable ≈ 2,250 lb. Required for long spans, crossing spans, angle structures, and where RUS 1715E-110 §3 or 1751F-630 §3 mandate EHS.

**ADSS (All-Dielectric Self-Supporting) cable**
Fiber cable with integrated non-metallic strength members (aramid/fiberglass). Does not use a separate messenger wire. Attached with preformed grip dead-ends and AGS suspension assemblies rather than lashing wire and suspension clamps. Not the current office standard; addressed as a sidebar here only.

**Preformed grip dead-end**
ADSS-specific termination hardware: helically wound rods that grip the cable sheath over 12–18 in., distributing the dead-end tension through friction. Load-rated per cable manufacturer's OD and RTS spec.

**AGS suspension assembly**
ADSS-specific intermediate attachment hardware: a suspension loop with elastomeric cushion that cradles the ADSS cable OD without creating sheath stress concentrations. Cable-OD specific.

**ASTM B230 / B498**
Standards governing aluminum wire and aluminum-conductor steel-reinforced (ACSR) messenger strand, respectively. Aluminum messenger's galvanic compatibility at pole hardware must be assessed per NACE SP0286 — the pairing differs from steel-on-aluminum but is still a dissimilar-metal concern.

---

## Interactive: Scenario Setup — Grade Selection (L5.2b Input Preparation)

This interactive prepares the inputs for the L5.2b full worked derivation. No calculation is performed here; the learner confirms the inputs are correct before advancing.

**Scenario:** A 250-ft span in Macon, GA (NESC Light loading district). Cable OD: 0.63 in. Cable + messenger dead weight: 0.496 lb/ft combined. NESC Light wind load on cable: 0.472 lb/ft.

Confirm the following inputs for L5.2b:

| Input | Value | Source |
|---|---|---|
| Span length | 250 ft | Route design |
| Loading district | Light (Macon, GA) | T4 L4.2b (given) |
| Resultant w (dead + wind) | 0.685 lb/ft | √(0.496² + 0.472²) |
| Grade options | SM / HS / EHS | ASTM A475/A475M |
| NESC safety factor | 2.0× | NESC Rule 261 |

In L5.2b, the learner will: (1) select a design sag → (2) derive H using the parabolic formula → (3) compare H to each grade's NESC-allowable tension → (4) identify the minimum qualifying grade.

---

## Quiz — Strand Grade Selection (5 Questions)

---

**Q1.** A route engineer needs to select an ASTM A475/A475M messenger grade. The calculated horizontal tension in the strand under NESC design loading is 1,600 lb. Which is the minimum strand grade that satisfies the NESC Rule 261 2.0× safety factor?

- A) SM (NESC allowable ≈ 1,350 lb)
- B) HS (NESC allowable ≈ 1,890 lb) **[CORRECT]**
- C) EHS (NESC allowable ≈ 2,250 lb)
- D) Any of the above; the safety factor is the installer's discretion

*Rationale:*
- **A — Incorrect.** SM grade 0.25-in. 6-wire strand has an RBS of approximately 2,700 lb. NESC allowable = 2,700 / 2.0 = 1,350 lb. The design tension of 1,600 lb exceeds 1,350 lb — SM fails the NESC Rule 261 safety factor. [ASTM A475/A475M Table 1; NESC C2-2023, Rule 261]
- **B — Correct.** HS grade 0.25-in. 6-wire strand has an RBS of approximately 3,780 lb. NESC allowable = 3,780 / 2.0 = **1,890 lb**. The design tension of 1,600 lb is less than 1,890 lb — HS satisfies the safety factor. HS is the minimum qualifying grade; EHS would also pass but is unnecessary for this tension level. [ASTM A475/A475M Table 1; NESC C2-2023, Rule 261]
- **C — Incorrect.** EHS satisfies the safety factor (allowable 2,250 lb > required 1,600 lb), but it is not the *minimum* grade that passes. HS is sufficient and is the economical minimum-qualifying selection.
- **D — Incorrect.** The NESC Rule 261 safety factor is a code requirement, not an installer option. The minimum strand grade must provide an allowable tension (RBS / 2.0) that equals or exceeds the calculated design tension. The selection is derivation-driven, not discretionary.

---

**Q2.** Which standard governs the specification of zinc-coated steel messenger wire for telecommunications aerial plant?

- A) ASTM A36 (Structural steel)
- B) ASTM A475/A475M (Zinc-coated steel wire strand) **[CORRECT]**
- C) ASTM B498 (Aluminum conductor steel reinforced)
- D) ANSI O5.1 (Wood poles)

*Rationale:*
- **A — Incorrect.** ASTM A36 governs structural carbon steel plate, shapes, and bars used in building construction. It does not apply to wire strand.
- **B — Correct.** ASTM A475/A475M — *Standard Specification for Zinc-Coated Steel Wire Strand* — is the governing ASTM standard for steel messenger wire used in telecommunications aerial plant. It defines the three grades (SM, HS, EHS), RBS values, zinc coating classes (A, B, C), and dimensional tolerances. The `/A475M` suffix is the metric companion; both standards govern the same product. [ASTM A475/A475M, §1.1]
- **C — Incorrect.** ASTM B498 governs zinc-coated steel wire strand for aluminum conductors (ACSR) — a product used in electric power distribution, not as a standalone telecom messenger. B498 is referenced in the aluminum strand sidebar as a companion to B230, not as the primary telecom messenger standard.
- **D — Incorrect.** ANSI O5.1 governs wood utility pole specifications (class, species, circumference, treatment). It does not govern wire strand.

---

**Q3.** Which of the following describes the principal application of ADSS preformed grip dead-ends?

- A) Terminating the steel ASTM A475/A475M messenger at a dead-end bracket on a lashed-strand assembly
- B) Gripping the ADSS cable sheath over a distributed engagement length to transfer dead-end tension through friction **[CORRECT]**
- C) Connecting the fiber cable jacket to the pole band to prevent sagging between attachment points
- D) Anchoring the lashing wire at the beginning and end of each lashed segment

*Rationale:*
- **A — Incorrect.** ASTM A475/A475M messenger is terminated with a dead-end strand clamp or preformed dead-end wire-wrap designed for steel strand — not the ADSS preformed grip system. The two hardware families are not interchangeable.
- **B — Correct.** ADSS preformed grip dead-ends consist of helically wound rods that grip the ADSS cable sheath over a 12–18-in. engagement length. The helical geometry distributes the termination load through friction along the sheath rather than concentrating it at a single compression point. This method is required because ADSS cable uses non-metallic strength members (aramid/fiberglass) that cannot be clamped like steel strand without risk of sheath damage. Hardware is sized to the cable manufacturer's OD and rated RTS. [BICSI OSP-DRD Ch. 6.3]
- **C — Incorrect.** ADSS cable is self-supporting — the fiber cable spans between poles without a separate messenger. There is no "sagging between attachment points" problem that a grip on the cable jacket would solve; the cable's integral strength members carry the tension load.
- **D — Incorrect.** Lashing wire is used on lashed-strand assemblies (not ADSS). Lashing wire is anchored at dead-end clamps and overlapped 6 in. past the clamp per TIA-758-C §5.3 — a completely separate hardware system addressed in L5.3.

---

**Q4.** A design specifies EHS-grade ASTM A475/A475M strand on a route that includes a railroad crossing span. Which factor most directly justifies the EHS upgrade from HS on a crossing span?

- A) EHS has a smaller diameter, reducing wind load on the messenger
- B) EHS has a higher zinc coating class, improving corrosion resistance at crossings
- C) Crossing spans often require enhanced structural safety factors or longer unsupported lengths that drive tension above HS allowable limits **[CORRECT]**
- D) EHS is required whenever aluminum clamp hardware is used

*Rationale:*
- **A — Incorrect.** EHS, HS, and SM strands of the same wire size (0.25 in.) have essentially the same diameter — they achieve higher RBS through wire drawing to a harder temper, not by changing cross-section. Wind load on the messenger is not meaningfully different between grades at the same wire diameter.
- **B — Incorrect.** Zinc coating class (A, B, C) is a separate specification from strand grade (SM, HS, EHS). Higher zinc coating class may be specified at crossings in corrosive environments, but it is independent of grade — you can specify EHS Class B or EHS Class C. Zinc coating class does not alone justify the grade upgrade.
- **C — Correct.** Railroad and highway crossing spans are typically longer than standard distribution spans (400–800 ft for railroad crossings vs. 150–300 ft standard) and are subject to enhanced NESC safety factor requirements under Rule 261 for crossing spans. Longer spans at higher design tensions drive the required horizontal tension above the HS allowable threshold (1,890 lb for 0.25-in. strand), requiring EHS (2,250 lb allowable) to satisfy the NESC 2.0× factor. [NESC C2-2023, Rules 250–252, 261; RUS 1751F-630 §3]
- **D — Incorrect.** The galvanic compatibility issue (aluminum hardware + steel strand) addressed in L5.1 requires isolation hardware — not a strand grade upgrade. EHS grade does not resolve galvanic contact; it does not change the strand's metal composition or galvanic potential.

---

**Q5.** A joint-use route in coastal Georgia specifies ASTM A475/A475M strand. The route passes within 15 miles of tidal saltwater. Which zinc coating class is the minimum appropriate specification?

- A) Class A (minimum zinc weight — acceptable inland)
- B) Class B (standard for routes within 20–30 miles of tidal saltwater) **[CORRECT]**
- C) Class C (maximum zinc weight — chronic marine exposure)
- D) Zinc coating is not required on galvanized strand; the galvanizing serves the same purpose

*Rationale:*
- **A — Incorrect.** Class A coating provides the minimum zinc weight per ASTM A475/A475M and is appropriate for inland installations where marine salt transport is not a factor. At 15 miles from tidal saltwater in coastal Georgia, salt-air transport is a real corrosion driver; Class A zinc life expectancy is insufficient.
- **B — Correct.** Class B coating is the standard specification for routes where salt-air transport is anticipated — generally within 20–30 miles of tidal saltwater, including coastal Georgia routes north and south of Macon where projects approach the Atlantic coast or tidal rivers. Class B provides a zinc weight that extends the corrosion protection life span to match the aerial plant's design life under moderate marine exposure. [ASTM A475/A475M; NACE SP0286 §2.2]
- **C — Incorrect.** Class C is the maximum zinc weight specification, appropriate for chronic direct marine exposure (e.g., structures on waterfront property, spans over saltwater). At 15 miles from tidal water, Class B is the standard minimum; Class C is not incorrect but is over-specification and adds material cost without a commensurate benefit at that distance.
- **D — Incorrect.** "Zinc coating" and "galvanizing" are the same process — the question is about *how much* zinc (coating weight class), not whether zinc is applied. All ASTM A475/A475M strand is galvanized; the coating class specifies the thickness and mass of that zinc layer.

---

## Final Check: Pulse Questions

**Pulse 1.** State the NESC allowable tension for each of the three ASTM A475/A475M grades (SM, HS, EHS) for 0.25-in. 6-wire strand, and identify which grade a design should select if the calculated horizontal tension is 1,750 lb.

*Expected answer:*
- SM: RBS ≈ 2,700 lb → NESC allowable = 2,700 / 2.0 = **1,350 lb** (fails at 1,750 lb)
- HS: RBS ≈ 3,780 lb → NESC allowable = 3,780 / 2.0 = **1,890 lb** (passes at 1,750 lb ✓)
- EHS: RBS ≈ 4,500 lb → NESC allowable = 4,500 / 2.0 = **2,250 lb** (passes)
- **Select HS** — minimum grade that satisfies NESC Rule 261 at 1,750 lb design tension.

**Pulse 2.** In two sentences, explain why ADSS preformed grip dead-ends cannot be substituted for steel strand dead-end clamps on a lashed-strand assembly.

*Expected answer:* ADSS preformed grip dead-ends are designed to grip a smooth, round ADSS cable sheath over a long distributed engagement length, using friction to transfer the dead-end tension without concentrating stress. A lashed-strand assembly uses a separate steel ASTM A475/A475M messenger wire as the structural element, which must be terminated with a strand-specific dead-end clamp (or preformed dead-end rod matched to the wire diameter) — the hardware geometry, engagement mechanism, and load path are entirely different.

---

## Glossary Cross-References

- **Sag-tension derivation (L5.2b)** → uses SM/HS/EHS RBS values and NESC 2.0× SF defined here; full derivation in next lesson
- **Galvanic isolation (L5.1)** → steel messenger + aluminum hardware isolation; applies to the strand defined in this lesson
- **Loading district (T4 L4.2b)** → established there; used here as a given input without re-derivation
- **Lashing wire and lashing machine (L5.3)** → attaches the fiber cable to the messenger selected in this lesson
- **NESC Rule 261** → same safety factor referenced in L5.1 for pole hardware; applied here for strand grade selection
