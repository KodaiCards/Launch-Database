---
title: "Lesson 5.2b: Strand and Messenger Wire — Sag-Tension and NESC Safety-Factor Derivation"
duration_min: 20
topic: osp-hardware-accessories
order: 3
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.3: Aerial construction — sag-tension design"
sources:
  - "IEEE Std 1222-2011 §5 (Parabolic sag-tension method for self-supporting aerial cable)"
  - "NESC C2-2023, Rule 261 (2.0× safety factor)"
  - "ASTM A475/A475M (RBS tables for strand grade selection)"
  - "RUS Bulletin 1715E-110 §3"
  - "BICSI OSP-DRD Manual, Ch. 6.3"
---

# Strand and Messenger Wire — Sag-Tension and NESC Safety-Factor Derivation

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Apply the parabolic sag formula to derive midspan sag from cable weight per foot, span length, and horizontal tension
- Rearrange the parabolic formula to solve for horizontal tension given span, cable weight, and design sag
- Execute the six-step derivation sequence for a Macon, GA Light-district span and identify the minimum ASTM A475/A475M grade that satisfies NESC Rule 261
- Explain why the derivation must precede grade selection (not the reverse) to avoid under- or over-specification

> **Prerequisites:**
> - Loading district (NESC Light, Macon, GA) established in T4 L4.2b — used as a given input here.
> - ASTM A475/A475M grade definitions (SM, HS, EHS) and RBS values from L5.2a — applied here.
> - NESC Rule 261 2.0× safety factor established in L5.1 — applied here.

---

## Reading Content

### The Parabolic Sag Formula

When a cable sag is less than approximately 10% of the span length — which covers virtually all routine OSP aerial spans — the catenary shape is well-approximated by a parabola. The **parabolic sag formula** from IEEE Std 1222 §5 is:

$$S = \frac{w \cdot L^2}{8 \cdot H}$$

Where:
- **S** = sag at midspan (ft)
- **w** = resultant cable weight per unit length under design loading (lb/ft) — the vector sum of dead weight (cable + messenger) and transverse wind load
- **L** = span length (ft)
- **H** = horizontal component of tension at midspan (lb)

**Solving for H** (the engineering design question — what tension is required at a given sag?):

$$H = \frac{w \cdot L^2}{8 \cdot S}$$

This H is the horizontal tension the messenger must sustain. The NESC Rule 261 2.0× safety factor then requires:

$$\text{RBS (selected grade)} \geq H \times 2.0$$

The derivation sequence is always: compute H first → compare to RBS/2.0 for each grade → select minimum qualifying grade. Choosing a grade by rule of thumb and then checking the math is a design error — the math determines the grade, not prior assumptions about what grade is typically used.

[IEEE Std 1222-2011 §5; NESC C2-2023, Rule 261]

### NESC Light Loading: Load Vector Derivation

NESC Light district (Macon, GA) imposes:
- **Radial ice:** 0 in. (no ice load)
- **Wind pressure:** 9 psf (lb/ft²) at 60°F
- **Temperature:** 60°F at maximum wind

The resultant load per unit length (w) is the vector sum of the cable system's dead weight and the transverse wind force per foot:

**Dead weight (w_d):**
- Fiber cable (0.63-in. OD, typical OSP distribution cable): 0.380 lb/ft
- ASTM A475/A475M 0.25-in. 6-wire messenger: 0.116 lb/ft
- **w_d = 0.380 + 0.116 = 0.496 lb/ft**

**Wind load (w_w):**
Wind pressure acts on the projected area of the cable assembly per linear foot. The governing projected diameter is the cable OD (0.63 in. = 0.0525 ft), which is the dominant width of the lashed bundle.

$$w_w = 9 \text{ psf} \times 0.0525 \text{ ft} = 0.472 \text{ lb/ft}$$

**Resultant (vector sum):**
Under NESC Light loading (no ice), the load vector combines vertical dead weight and horizontal wind load:

$$w = \sqrt{w_d^2 + w_w^2} = \sqrt{(0.496)^2 + (0.472)^2} = \sqrt{0.2460 + 0.2228} = \sqrt{0.4688} = 0.685 \text{ lb/ft}$$

---

### The Six-Step Worked Derivation

**Scenario:** 250-ft span, Macon, GA (NESC Light), 0.63-in. OD lashed fiber cable on ASTM A475/A475M 0.25-in. 6-wire messenger. Design sag: 3.5 ft at midspan.

---

**Step 1 — Identify cable + messenger dead weight:**

$$w_d = \text{cable weight} + \text{messenger weight} = 0.380 + 0.116 = \mathbf{0.496 \text{ lb/ft}}$$

*Source: cable manufacturer data sheet for 0.63-in. OD OSP distribution cable; ASTM A475/A475M published weight for 0.25-in. 6-wire SM/HS/EHS strand (~0.116 lb/ft — weight is grade-independent for the same wire diameter).*

---

**Step 2 — Compute transverse wind load per foot:**

$$w_w = 9 \text{ lb/ft}^2 \times \frac{0.63 \text{ in.}}{12 \text{ in./ft}} = 9 \times 0.0525 = \mathbf{0.472 \text{ lb/ft}}$$

*NESC Light: 9 psf horizontal wind, 60°F, no ice. [NESC C2-2023, Rules 250–251]*

---

**Step 3 — Derive resultant load w:**

$$w = \sqrt{(0.496)^2 + (0.472)^2} = \sqrt{0.2460 + 0.2228} = \sqrt{0.4688} = \mathbf{0.685 \text{ lb/ft}}$$

*Vector sum of vertical (dead) and horizontal (wind) load components. No ice term in Light district.*

---

**Step 4 — Solve for horizontal tension H at design sag:**

Design sag S = 3.5 ft. Span L = 250 ft.

$$H = \frac{w \cdot L^2}{8 \cdot S} = \frac{0.685 \times 250^2}{8 \times 3.5} = \frac{0.685 \times 62{,}500}{28.0} = \frac{42{,}813}{28.0} = \mathbf{1{,}529 \text{ lb}}$$

*This is the horizontal component of tension the messenger must sustain to maintain 3.5-ft sag at the Light-district design condition. [IEEE Std 1222-2011 §5]*

---

**Step 5 — Apply NESC 2.0× safety factor and compare to grade options:**

Required RBS ≥ H × 2.0 = 1,529 × 2.0 = **3,058 lb minimum**

| Grade | RBS (0.25-in., 6-wire) | NESC Allowable (RBS ÷ 2.0) | Satisfies H = 1,529 lb? |
|---|---|---|---|
| SM | 2,700 lb | 1,350 lb | **FAIL** (1,350 < 1,529) |
| HS | 3,780 lb | 1,890 lb | **PASS** (1,890 ≥ 1,529 ✓) |
| EHS | 4,500 lb | 2,250 lb | **PASS** (2,250 ≥ 1,529 ✓) |

[ASTM A475/A475M Table 1; NESC C2-2023, Rule 261]

---

**Step 6 — Select minimum qualifying grade:**

SM fails. HS passes with margin (1,890 lb allowable vs. 1,529 lb required). EHS also passes but is excess capacity for this span at this sag.

**Minimum qualifying grade: HS (High Strength), ASTM A475/A475M, 0.25-in. 6-wire strand.**

Selection is the minimum grade — do not specify EHS when HS is sufficient, unless route-specific conditions require it (crossing spans, RUS 1715E-110 §3 mandate, angle pole unbalanced tension).

---

### Verification: Sag Check at H_HS

Confirm: at H = 1,890 lb (HS NESC allowable limit), what is the minimum sag the messenger would achieve?

$$S_{min} = \frac{w \cdot L^2}{8 \cdot H} = \frac{0.685 \times 62{,}500}{8 \times 1{,}890} = \frac{42{,}813}{15{,}120} = 2.83 \text{ ft}$$

At maximum allowable tension (HS at RBS/2.0 limit), sag is 2.83 ft — well above the NESC Light clearance margin for this attachment height. This confirms the 3.5-ft design sag is conservative (less tension than the limit) and NESC clearance is maintained.

---

### What Changes in Different Scenarios

Understanding how each variable shifts the result is as important as executing the derivation:

| Variable increases | Effect on H | Effect on grade selection |
|---|---|---|
| Span L (same sag) | H increases as L² | May require upgrade from HS to EHS |
| Design sag S (same span) | H decreases | May allow downgrade; check NESC clearance |
| Loading district (Light → Medium) | w increases (radial ice) | H increases → may require grade upgrade |
| Cable OD increases | w_w increases → w increases | H increases |
| Crossing span (enhanced SF) | Required RBS higher | Often mandates EHS |

The parabolic formula makes these relationships transparent: **H scales linearly with w and inversely with S. H scales with L squared.** Span length is the strongest lever on required tension.

---

## Key Terms (Flashcard Candidates)

**Parabolic sag formula (IEEE Std 1222 §5)**
S = wL²/(8H), applicable when sag < ~10% of span. Used to relate design sag, cable resultant weight per foot, span length, and horizontal tension at midspan. Rearranged to H = wL²/(8S) for grade-selection derivation.

**Resultant load (w)**
Vector sum of cable dead weight (vertical) and NESC wind load (horizontal) per linear foot. In the Light district (no ice): w = √(w_d² + w_w²). In Medium and Heavy districts, ice weight adds to the vertical component: w_d_iced = w_d + w_ice, then vector-sum with w_w.

**Horizontal tension (H)**
The horizontal component of the tension force in the messenger at midspan. H is the tension value that must be compared to the strand's NESC allowable tension (RBS / 2.0). The parabolic formula solves for H from the design sag.

**Design sag**
The midspan sag chosen by the designer at the NESC design load condition. Constrained above by NESC clearance requirement (cable must not sag below the minimum clearance height), and below by the NESC allowable tension limit (sag cannot be so small that H > RBS/2.0).

**NESC allowable tension**
RBS of the selected strand ÷ 2.0. The horizontal tension H derived from the sag formula must not exceed this value. If it does, the strand grade is insufficient.

**NESC Light loading**
NESC district for Macon, GA: 0 in. radial ice, 9 psf horizontal wind, 60°F. Resultant load is dominated by wind because ice weight is zero.

---

## Interactive: Full Worked Derivation — Step Validation

The learner completes the six-step derivation interactively, entering the result of each calculation step before seeing the next.

**Inputs provided:** Span = 250 ft, loading district = Light (Macon, GA), cable OD = 0.63 in., design sag = 3.5 ft, messenger weight = 0.116 lb/ft, cable weight = 0.380 lb/ft.

**Step 1 prompt:** Calculate dead weight w_d.
*Expected: 0.380 + 0.116 = 0.496 lb/ft.*

**Step 2 prompt:** Calculate wind load w_w using 9 psf × (0.63 / 12).
*Expected: 9 × 0.0525 = 0.472 lb/ft.*

**Step 3 prompt:** Calculate resultant w = √(0.496² + 0.472²).
*Expected: √0.4688 = 0.685 lb/ft.*

**Step 4 prompt:** Solve for H = w × L² / (8 × S).
*Expected: 0.685 × 62,500 / 28.0 = 1,529 lb.*

**Step 5 prompt:** What is the minimum required RBS? (H × 2.0)
*Expected: 1,529 × 2.0 = 3,058 lb.*

**Step 6 prompt:** Which is the minimum qualifying grade?
*Expected: HS (RBS 3,780 lb ≥ 3,058 lb required; SM fails at 2,700 lb).*

*System: validates each step before revealing the next; wrong answer triggers a hint citing the relevant formula term.*

---

## Quiz — Sag-Tension Derivation (5 Questions)

---

**Q1.** In the parabolic sag formula (IEEE Std 1222 §5), if span length doubles while all other variables remain constant, what happens to the required horizontal tension H?

- A) H doubles
- B) H increases by a factor of 1.41 (square root of 2)
- C) H increases by a factor of 4 **[CORRECT]**
- D) H remains unchanged; it depends only on cable weight and sag

*Rationale:*
- **A — Incorrect.** H = wL²/(8S). Doubling L gives H = w(2L)²/(8S) = w·4L²/(8S) = 4 × (wL²/8S). H increases by factor of 4, not 2.
- **B — Incorrect.** √2 scaling would apply if H were proportional to L¹, but H is proportional to L². √2 is the factor for a single-power relationship.
- **C — Correct.** H = wL²/(8S). Span length L appears squared in the formula. Doubling L: H_new = w(2L)²/(8S) = 4wL²/(8S) = 4 × H_original. Tension increases by the **square** of the span ratio. This is why long spans rapidly escalate the required messenger grade — a 300-ft span requires 44% more tension than a 250-ft span at the same sag, all else equal (1.44× = (300/250)² = 1.44). [IEEE Std 1222-2011 §5]
- **D — Incorrect.** H depends on all three variables: w, L, and S. Span length is actually the dominant variable because it enters as L².

---

**Q2.** Using the Macon, GA Light-district scenario from the lesson (250-ft span, w = 0.685 lb/ft, design sag = 3.5 ft), what is the calculated horizontal tension H?

- A) 962 lb
- B) 1,200 lb
- C) 1,529 lb **[CORRECT]**
- D) 1,890 lb

*Rationale:*
- **A — Incorrect.** 962 lb is not derivable from H = wL²/(8S) with the given inputs. A common error is using S in the numerator rather than the denominator.
- **B — Incorrect.** 1,200 lb would result from approximately H = 0.685 × 62,500 / 35.7 — which corresponds to a sag of about 4.4 ft, not 3.5 ft.
- **C — Correct.** H = 0.685 × 250² / (8 × 3.5) = 0.685 × 62,500 / 28.0 = 42,813 / 28.0 = **1,529 lb**. This is the derivation performed step-by-step in the lesson's worked example. [IEEE Std 1222-2011 §5]
- **D — Incorrect.** 1,890 lb is the NESC allowable tension for HS-grade 0.25-in. strand (3,780 / 2.0). It is the threshold the grade must meet, not the calculated design tension.

---

**Q3.** SM-grade ASTM A475/A475M strand fails the NESC Rule 261 safety factor in the Macon, GA worked example. What is the specific reason SM fails?

- A) SM is not rated for the NESC Light loading district
- B) SM strand's zinc coating is insufficient for Georgia's climate
- C) SM's NESC allowable tension (≈1,350 lb) is less than the required horizontal tension (1,529 lb) **[CORRECT]**
- D) SM strand cannot be used with aluminum die-cast clamps

*Rationale:*
- **A — Incorrect.** SM strand is not excluded from any NESC loading district by the standard. Loading district affects the design loads applied, which then determine whether a grade passes or fails — but there is no categorical prohibition on SM in the Light district.
- **B — Incorrect.** Zinc coating class (corrosion protection) is a separate specification from strand grade (structural capacity). Zinc coating does not affect whether SM passes or fails the NESC tension safety factor.
- **C — Correct.** SM-grade 0.25-in. 6-wire strand has an RBS of approximately 2,700 lb. NESC Rule 261 requires the allowable tension = RBS / 2.0 = 2,700 / 2.0 = **1,350 lb**. The derivation produced a required horizontal tension of **1,529 lb**. Since 1,529 lb > 1,350 lb, SM does not satisfy the 2.0× safety factor — it fails. HS (allowable 1,890 lb ≥ 1,529 lb) is the minimum qualifying grade. [ASTM A475/A475M Table 1; NESC C2-2023, Rule 261]
- **D — Incorrect.** Galvanic isolation is required when steel (any grade) contacts aluminum hardware — but this is a hardware installation requirement addressed in L5.1, not a prohibition on SM strand. SM's failure in this scenario is strictly a tension capacity issue.

---

**Q4.** A route engineer changes the design sag from 3.5 ft to 5.0 ft on the same 250-ft Macon, GA span. What effect does this have on the grade selection?

- A) Grade must be upgraded to EHS due to increased cable weight from deeper sag
- B) Required tension decreases, potentially allowing SM grade to qualify **[CORRECT]**
- C) Grade selection is unchanged; sag does not affect horizontal tension
- D) Grade must be upgraded because greater sag reduces NESC clearance margin

*Rationale:*
- **A — Incorrect.** Deeper sag does not change the cable's weight per foot (w is a property of the cable and loading conditions, not the sag). Increasing sag decreases H (less tension needed to maintain a deeper sag), which reduces the required RBS — moving toward lower grades, not higher.
- **B — Correct.** H = wL²/(8S). Increasing S from 3.5 to 5.0 ft: H = 0.685 × 62,500 / (8 × 5.0) = 42,813 / 40.0 = **1,070 lb**. Required RBS = 1,070 × 2.0 = 2,140 lb. SM's RBS of 2,700 lb ≥ 2,140 lb → SM now satisfies the NESC safety factor. *However, the engineer must also verify NESC clearance is maintained at 5.0-ft sag before accepting this design — the sag constraint from below (tension) is relaxed, but the sag constraint from above (clearance) still applies.* [IEEE Std 1222-2011 §5]
- **C — Incorrect.** Sag appears directly in the denominator of H = wL²/(8S). Changing sag directly changes H; grade selection depends on H; therefore sag directly affects grade selection.
- **D — Incorrect.** Greater sag increases clearance risk (cable hangs lower), which is a constraint the engineer must check — but that constraint does not change the strand grade selection logic. The grade selection is driven by whether H satisfies RBS/2.0, not by clearance.

---

**Q5.** The NESC Rule 261 2.0× safety factor requires that the selected strand's RBS divided by 2.0 must be:

- A) Less than the calculated horizontal tension H
- B) Equal to the span length divided by the design sag
- C) Greater than or equal to the calculated horizontal tension H **[CORRECT]**
- D) Greater than the resultant load per foot (w) times the span length

*Rationale:*
- **A — Incorrect.** If RBS/2.0 were less than H, the strand would be operating above its NESC allowable tension — the safety factor would be violated. The requirement is the opposite: RBS/2.0 must be ≥ H.
- **B — Incorrect.** L/S (span divided by sag) is the inverse of the sag-to-span ratio, a dimensionless quantity used to verify the parabolic approximation is valid (sag/span < ~10%). It has no direct role in the safety factor compliance check.
- **C — Correct.** NESC Rule 261 requires a 2.0× safety factor on messenger strand tension. This means: the strand must not be loaded to more than half its RBS under design conditions. Equivalently: RBS / 2.0 ≥ H_design. In the lesson example: HS gives RBS/2.0 = 3,780/2.0 = 1,890 lb ≥ 1,529 lb = H → satisfies the rule. [NESC C2-2023, Rule 261]
- **D — Incorrect.** RBS/2.0 is compared to the horizontal tension H (units: lb), not to w × L (units: lb/ft × ft = lb force, which is actually a total span load — not the tension at midspan). The correct comparison is H (the midspan horizontal tension component), derived from the parabolic formula.

---

## Final Check: Pulse Questions

**Pulse 1.** State the parabolic sag formula (IEEE Std 1222 §5), identify each variable with its unit, and rearrange it to solve for H.

*Expected answer:*
- **S = wL² / (8H)** where: S = midspan sag (ft), w = resultant cable weight per unit length (lb/ft), L = span length (ft), H = horizontal tension at midspan (lb).
- Rearranged: **H = wL² / (8S)**.
- The horizontal tension H is the design tension the messenger must sustain; H must not exceed the strand's NESC allowable tension (RBS / 2.0). [IEEE Std 1222-2011 §5]

**Pulse 2.** Recite the six derivation steps in sequence for the Macon, GA worked example, stating the numerical result for each step.

*Expected answer:*
1. Dead weight: w_d = 0.380 + 0.116 = **0.496 lb/ft**
2. Wind load: w_w = 9 × 0.0525 = **0.472 lb/ft**
3. Resultant: w = √(0.496² + 0.472²) = **0.685 lb/ft**
4. Horizontal tension: H = 0.685 × 62,500 / 28.0 = **1,529 lb**
5. Required RBS: 1,529 × 2.0 = **3,058 lb**
6. Grade: SM (2,700 lb) fails; HS (3,780 lb) passes → **select HS**

---

## Glossary Cross-References

- **ASTM A475/A475M grades (SM/HS/EHS) and RBS values** → defined in L5.2a; applied here
- **NESC Light district parameters** → established in T4 L4.2b; used as given inputs
- **NESC Rule 261 (2.0× SF)** → introduced in L5.1; applied here for strand selection
- **IEEE Std 1222 §5 (parabolic sag-tension method)** → referenced here; T3 L3.4 and T4 L4.2b use same method — consistent cross-topic application
- **Dead-end bracket load rating** → L5.1; the H derived here is the tension the dead-end hardware must be rated to resist
- **ADSS caveat** → L5.2a sidebar: this derivation applies to lashed-strand assemblies only; ADSS sag-tension uses manufacturer tables and IEEE 1222 §5 ADSS-specific parameters
