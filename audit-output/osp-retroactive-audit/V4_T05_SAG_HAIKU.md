# V4 T05.L07 SAG FORMULA INTEGRITY — HAIKU VERIFICATION

**Agent:** Haiku ground-truth verifier  
**Timestamp:** 2026-05-18  
**Scope:** T05.L07 line-by-line structural & mathematical verification  

## Directive

Verify parabolic sag formula (s = wL²/(8H)) presence, every variable defined with units, all worked examples complete with verified arithmetic, sanity checks present, interactive primitives functional. Direct-push artifact to main via orchestrator.

## Verification Results

### Formula & Definition Integrity

**Line 176:** Parabolic sag formula present and clearly isolated:
```
s = wL² / (8H)
```

**Lines 136–172:** Complete acronym/notation table with all five variables:
| Symbol | Meaning | Units |
|--------|---------|-------|
| s | Sag — vertical drop from chord line to midspan | feet (ft) |
| w | Cable weight per unit length | lb/ft |
| L | Span length — horizontal pole-to-pole distance | feet (ft) |
| H | Horizontal tension — constant horizontal component | pounds (lb) |
| s/L | Sag-to-span ratio (validity threshold) | dimensionless (%) |

**Every variable defined with units BEFORE formula applied.** ✓

### Worked Examples — Arithmetic Verification

**Example 1, Step 2 (No-Wind Sag, Lines 260–266):**
```
Given: w = 0.145 lb/ft, L = 150 ft, H = 600 lb
s = (0.145 × 150²) / (8 × 600)
s = (0.145 × 22,500) / 4,800
s = 3,262.5 / 4,800

Verification:
  0.145 × 22,500 = 3,262.5 ✓
  8 × 600 = 4,800 ✓
  3,262.5 ÷ 4,800 = 0.679166... ≈ 0.680 ft ✓
```
**Result: 0.680 ft (8.2 inches). VERIFIED CORRECT.**

**Example 1, Step 4 (Wind-Loaded Combined Weight, Lines 289–302):**
```
w_combined = √(0.145² + 0.375²)
           = √(0.02103 + 0.14063)
           = √0.16166 = 0.402 lb/ft

Verification:
  0.145² = 0.021025 ✓
  0.375² = 0.140625 ✓
  Sum = 0.16165 (rounds to 0.16166) ✓
  √0.16166 = 0.4020... ✓
```
**Wind-loaded sag at line 301–302:**
```
s_wind = (0.402 × 22,500) / 4,800
       = 9,045 / 4,800

Verification:
  0.402 × 22,500 = 9,045 ✓
  9,045 ÷ 4,800 = 1.88437... ≈ 1.885 ft ✓
```
**Result: 1.885 ft (22.6 inches). VERIFIED CORRECT.**

**Example 2, Step 3 (Heavy District Combined Load, Lines 355–363):**
```
w_ice = 1.244 × 0.50 × (0.50 + 0.50) = 0.622 lb/ft (verified at lines 331–335)
w_wind = 4 psf × 0.125 ft²/ft = 0.500 lb/ft (verified at lines 343–347)

w_combined = √((0.767)² + (0.500)²)
           = √(0.5883 + 0.2500)
           = √0.8383 = 0.916 lb/ft

Verification:
  0.767² = 0.588289 ✓
  0.500² = 0.25 ✓
  Sum = 0.838289 (rounds to 0.8383) ✓
  √0.8383 = 0.9156... ≈ 0.916 lb/ft ✓

Sag application:
  s_heavy = (0.916 × 22,500) / 4,800
          = 20,610 / 4,800
          = 4.2937... ≈ 4.294 ft ✓
```
**Result: 4.294 ft (51.5 inches). VERIFIED CORRECT.**

### Sanity Checks

**Line 269–271:** No-wind sanity check  
> "Sanity check: 0.680 ft ≈ 8 inches. For a 150-ft span with a light cable at 600 lb tension, 8 inches of sag is reasonable — imagine a taut rope between two fence posts about 50 yards apart drooping only 8 inches."

**Validation:** 150 ft / 3 ft/yard = 50 yards ✓. Sag-to-span ratio = 0.68/150 = 0.45% (< 10% threshold) ✓. Physical intuition correct. ✓

**Line 282–286:** Wind-loaded clearance sanity check  
> "Sanity check: Even in a 9-psf (≈ 60 mph) wind, the cable clears the road by more than 4 feet."

**Validation:** 9 psf wind pressure corresponds to ~60 mph using the dynamic pressure formula P = 0.00256 × v². Solving: v = √(9/0.00256) ≈ 59 mph ✓. Clearance margin = 4.62 ft (from line 313) > 4 ft ✓. ✓

**Line 305–307:** Wind vs. load relationship sanity check  
> "Under a 9-psf windstorm, sag grows from 8 inches to 23 inches — almost 3× more. The combined load (0.402 lb/ft) is 2.8× the bare cable weight (0.145 lb/ft), so the sag grows by the same factor."

**Validation:**  
- Sag ratio = 1.885 / 0.680 = 2.772 ≈ 2.8× ✓
- Load ratio = 0.402 / 0.145 = 2.772 ≈ 2.8× ✓
- Proportionality holds: s ∝ w (when L and H constant) ✓

**All three sanity checks are mathematically sound and pedagogically coherent.** ✓

### Flashcard Coverage

10 flashcard definitions present (lines 214–228):

1. **catenary:** "The exact mathematical curve formed by a perfectly flexible cable under uniform self-weight. Described by y = a × cosh(x/a)." ✓
2. **parabolic approximation:** "Simplified version... valid when sag is less than 10% of span length." ✓
3. **sag (s):** "Vertical distance from chord line to cable's lowest point at midspan. s = wL² / (8H)." ✓
4. **horizontal tension (H):** "The constant horizontal component of cable tension. s ∝ 1/H." ✓
5. **initial sag:** "The sag immediately after stringing, before thermal or creep effects." ✓
6. **final sag:** "Sag after thermal cycling and creep. Always ≥ initial sag. Clearance checks use final sag." ✓
7. **thermal elongation:** "Increase in strand length at high temperature (6.5 × 10⁻⁶ per °F for steel)." ✓
8. **creep:** "Slow permanent elongation under sustained tension over months/years." ✓
9. **sag-to-span ratio:** "Ratio of s/L. When < 10%, parabola accurate within 1% of catenary." ✓
10. **ruling span:** "Equivalent span for multi-span sections. Ruling span = √(ΣL³ / ΣL)." ✓

**All vocabulary_introduced items (lines 25–36) have corresponding flashcard definitions.** ✓

### Interactive Primitives

**WorkedExample component (lines 386–404):**
- Title: "Sag and Clearance Calculator"
- 6 input variables: w_bare, L_span, H_tension, h_attach, w_comb, clearance_req
- 3 formula steps with correct algebraic expressions:
  - `(w_bare * L_span * L_span) / (8 * H_tension)` ✓
  - `(w_comb * L_span * L_span) / (8 * H_tension)` ✓
  - `h_attach - (w_comb * L_span * L_span) / (8 * H_tension) - clearance_req` ✓
- Sanity check (line 403): Correctly explains s ∝ L², s ∝ 1/H relationships ✓

**SliderExploration component (lines 407–428):**
- Title: "How Tension Controls Sag"
- 1 slider: H_slide (200–1200 lb range, default 600)
- 2 derived values:
  - `(0.145 * 150 * 150) / (8 * H_slide)` for sag_slide ✓
  - `22 - (0.145 * 150 * 150) / (8 * H_slide) - 15.5` for margin_slide ✓
- Insight (line 427) shows concrete numeric behavior: "At H=200 lb: sag = 2.04 ft, margin = 4.46 ft. At H=1200 lb: sag = 0.34 ft, margin = 6.16 ft."

**Verification of insight values:**
- At H=200: s = (0.145 × 22,500) / (8 × 200) = 3262.5 / 1600 = 2.039 ft ✓
- At H=1200: s = 3262.5 / 9600 = 0.340 ft ✓
- Margin at 200: 22 - 2.039 - 15.5 = 4.461 ft ✓
- Margin at 1200: 22 - 0.340 - 15.5 = 6.160 ft ✓

**Both primitives are correctly instantiated with verified algebraic expressions.** ✓

### Quiz Integrity

5 questions, all answers independently verified:

**Q1:** Calculate sag: w=0.200, L=120, H=700  
- s = (0.200 × 14,400) / 5,600 = 2,880 / 5,600 = 0.514 ft ✓
- Answer index: 1 (correct)

**Q2:** L² relationship (span doubles, sag = ?)  
- s ∝ L² → (300/150)² = 4 → sag quadruples ✓
- Answer index: 1 (correct)

**Q3:** Final vs initial sag (why required for clearance?)  
- Thermal elongation + creep increase sag over time ✓
- Clearance check must use final sag to avoid future violations ✓
- Answer index: 1 (correct)

**Q4:** Order of operations (Heavy district loaded sag)  
- Must calculate w_ice and w_wind BEFORE applying sag formula ✓
- Answer index: 1 (correct)

**Q5 (Fill-in):** Sag-to-span ratio threshold for parabolic approximation  
- s/L < 10% → answer "10" ✓

**All quiz answers verified correct. Explanations cite correct arithmetic or physics principles.** ✓

### Vite Build Validation

```
$ cd osp-training && npm run build
...
✓ built in 11.51s
```

**Zero build errors. T05.L07 imports and exports clean.** ✓

---

## Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Parabolic sag formula (s = wL²/8H) | ✅ PRESENT | Line 176, properly isolated |
| Variable definitions with units | ✅ COMPLETE | 5/5 variables + acronym table |
| Worked examples (no-wind, wind, heavy) | ✅ 3/3 COMPLETE | All steps shown, arithmetic verified |
| Sanity checks (plain English) | ✅ 3/3 PRESENT | All coherent & physically accurate |
| Flashcard coverage | ✅ 10/10 | All vocabulary_introduced have cards |
| Interactive primitives | ✅ 2/2 | WorkedExample + SliderExploration correct |
| Quiz questions | ✅ 5/5 | All answers verified, explanations valid |
| Vite build | ✅ GREEN | Zero errors, 11.51s |

**OVERALL VERDICT: GREEN**

T05.L07 SAG FORMULA INTEGRITY passes comprehensive line-by-line verification. All mathematical claims verified independently. Formula is correctly stated, all worked examples have complete step-by-step arithmetic, interactive primitives are properly configured, flashcard coverage is complete. Lesson is ready for production.

---

=== V4 HAIKU END ===
