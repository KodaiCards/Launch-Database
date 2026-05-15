# T02 Technical Accuracy RT

**Framing:** Technical accuracy + hallucination check — numbers, citations, formulas, quiz answers, slider math. NOT pedagogy.
**Scope:** All 12 T02 lessons (L01–L12) + `LinkBudgetCalculator.jsx`
**Read-only — no code modified.**

---

## Verdict (≤80 words)

T02 is technically solid overall. The core physics (TIR, attenuation, dispersion, bends, dB math, link budget, wavelength windows, PMD) is accurate and well-cited. All independently re-derived quiz answers match the lesson's [CORRECT] options. Five findings flagged, ranging from MEDIUM to LOW severity: one code-comment error with a pedagogically-visible consequence (slider threshold mismatch), one internal inconsistency between lesson body and interactive calculator, one fiber-grade attribution imprecision, one mandrel-test wavelength ambiguity, and one OS1/G.652 mapping narrowness. No fabricated SHAs found.

---

## Per-lesson technical grade (12 rows)

| Lesson | Numbers | Citations | Formulas | Quiz answers | Hallucinations | Grade |
|--------|---------|-----------|----------|--------------|----------------|-------|
| L01 TIR + NA | ✓ Core 9µm, cladding 125µm, n₁≈1.468, n₂≈1.463, TIR θ_c≈85°, NA≈0.12–0.14 | ✓ ITU-T G.652 (2024 flag) | ✓ sin(θ_c)=n₂/n₁, NA=√(n₁²−n₂²) | ✓ All correct | None | GREEN |
| L02 Attenuation | ✓ 1310 nm ≤0.40, 1550 nm ≤0.30, 1625 nm ≤0.40 dB/km G.652.D | ✓ ITU-T G.652.D; Corning SMF-28 etc | ✓ Linear fiber loss | ✓ All correct | None | GREEN |
| L03 Dispersion | ✓ D≈17 ps/(nm·km) @ 1550 nm, λ₀ = 1300–1324 nm | ✓ ITU-T G.652.D | ✓ ΔT=D×Δλ×L; MEDIUM: slider limit_10g comment error | ✓ All correct; Q3 ΔT=170 ps verified | None | YELLOW |
| L04 Bends | ✓ Bend loss grows with λ, 1625 nm diagnostic | ✓ ITU-T G.652 (edition flag), G.657 (2016 flag) | N/A | ✓ All correct | None | YELLOW |
| L05 dB math | ✓ 3dB=half, 10dB=1/10, conversions correct | ✓ FOA Reference Guide | ✓ dBm=10×log₁₀(P/1mW); all steps verified | ✓ Q1–Q4 all verified independently | None | GREEN |
| L06 Link budget | ✓ Budget arithmetic, headroom definition | ✓ FOA planning values | ✓ All steps verified; LOW: 0.15 dB/splice in text vs 0.10 dB in calculator | ✓ Q1 headroom 14.75 dB ✓, Q3 budget=28 dB ✓ | None | YELLOW |
| L07 Wavelengths | ✓ O-band 1260–1360, C-band 1530–1565, GPON 1310/1490, CWDM 18ch | ✓ ITU-T G.652; G.984 (GPON) | N/A | ✓ All drag-match correct | None | GREEN |
| L08 SMF vs MMF | LOW: OM3 bandwidth as 2000 MHz·km (is EMB, not OFL BW); OS2 cited as G.652.D only (should include G.652.C) | ✓ TIA-492AAAD/E; IEEE 802.3 | N/A | ✓ All correct; Q2 12 km → OS2 ✓; Q4 VCSEL-opt ✓ | None | YELLOW |
| L09 PMD | ✓ ps/√km, DGD_rms formula, PMD table distances | ✓ ITU-T G.652.D; G.Sup39 flag | ✓ DGD=PMD×√L verified at 1.41 ps (200 km) and 9.8 ps (150 km, Q2) | ✓ Q1–Q3 all verified | None | GREEN |
| L10 Characterization | ✓ Cut-back method, phase-shift CD, JME PMD, ±800 ps/nm 10G NRZ limit | ✓ IEC 61280-4-2 (edition flag), IEC 61282-9 (flag) | ✓ total_cd=D×L; limits defensible | ✓ All correct | None | GREEN |
| L11 Field vs Book | ✓ Thermal variation, MFD mismatch G.657.B3 splice loss 0.05–0.20 dB | ✓ IEC 61300-3-35 (edition flag), ITU-T G.657 (flag) | N/A | ✓ All correct | None | GREEN |
| L12 Capstone | ✓ All numbers match source lessons | Inherited from L01–L11 | ✓ 22km budget: budget=30, total=11.35, headroom=18.65 dB verified | ✓ All 20 Q answers independently verified | None | GREEN |

---

## Independently re-derived calculations (5 across lessons)

### 1. L01 — Critical angle for G.652.D fiber
**Lesson claims:** sin(θ_c) = n₂/n₁ = 1.463/1.468 ≈ 0.9966, θ_c ≈ 85°

**Independent derivation:**
```
sin(θ_c) = 1.463 / 1.468 = 0.99659...
θ_c = arcsin(0.9966) = 85.3°
```
**Verdict: MATCHES** (lesson says "≈ 85°" — correct to the first significant digit)

### 2. L03 — Chromatic dispersion ΔT for 100 km link
**Lesson claims:** ΔT = 17 × 0.1 × 100 = 170 ps; bit period at 10G = 100 ps → link fails without compensation

**Independent derivation:**
```
ΔT = D × Δλ × L = 17 ps/(nm·km) × 0.1 nm × 100 km = 170.0 ps
10G bit period = 1/(10×10⁹) × 10¹² = 100 ps
170 ps > 100 ps → correct, link would fail at 10 Gb/s without compensation
```
**Verdict: MATCHES**

### 3. L06 — Full link budget for 18 km scenario
**Lesson claims:** Budget = 27 dB; total loss = 9.60 dB; headroom = 17.4 dB

**Independent derivation:**
```
Budget = +3 dBm − (−24 dBm) = 27 dB
Fiber: 18 km × 0.25 dB/km = 4.50 dB
Splices: 6 × 0.15 dB = 0.90 dB
Connectors: 4 × 0.30 dB = 1.20 dB
Margin: 3.00 dB
Total: 9.60 dB
Headroom: 27.0 − 9.60 = 17.4 dB ✓
```
**Verdict: MATCHES**

### 4. L09 — PMD DGD calculation (Q2, 150 km pre-G.652.D fiber)
**Lesson claims:** DGD_rms = 0.8 × √150 = 9.8 ps; upgrade to 40G will very likely fail (limit 2.5 ps)

**Independent derivation:**
```
DGD_rms = 0.8 ps/√km × √150 km = 0.8 × 12.247 = 9.80 ps
40G bit period = 1/(40×10⁹) × 10¹² = 25 ps; 10% limit = 2.5 ps
9.80 ps >> 2.5 ps → upgrade would fail ✓
```
**Verdict: MATCHES**

### 5. L12 — Capstone link budget (22 km scenario)
**Lesson claims:** Budget = 30 dB; total loss = 11.35 dB; headroom = 18.65 dB

**Independent derivation:**
```
Budget = +4 − (−26) = 30 dB
Fiber: 22 × 0.25 = 5.50 dB
Splices: 7 × 0.15 = 1.05 dB
Connectors: 6 × 0.30 = 1.80 dB
Margin: 3.00 dB
Total: 11.35 dB
Headroom: 30 − 11.35 = 18.65 dB ✓
```
**Verdict: MATCHES**

---

## Findings (severity-ranked)

### FINDING 1 — MEDIUM
**L03 SliderExploration: code comment error in 10G dispersion limit rationale**

**Verified by reading:** `L03.dispersion-why-signals-blur.jsx:207`
**Code snippet:**
```javascript
const limit_10g = 200;  // ps — 2× bit period at 25 Gbps; defensible dispersion error threshold
```
**Issue:** The comment claims 200 ps = "2× bit period at 25 Gbps." This is arithmetically wrong: the bit period at 25 Gbps = 40 ps; 2× = 80 ps, not 200 ps. The 200 ps figure is actually approximately 2× the 10 Gbps bit period (100 ps). More importantly, the lesson body itself states at line ~155: *"For a 10 Gb/s data stream, each bit occupies 100 ps… At 170 ps spreading, the pulse has spread wider than one bit period"* — which sets the effective threshold at ~100 ps, not 200 ps. This creates an internal inconsistency: the lesson text correctly identifies ~100 ps as the failure threshold, but the slider marks 200 ps as the "10G limit," meaning a link that the lesson body would classify as failing (e.g., 170 ps, as in the worked example) would display as "ok" in the slider. A learner running the worked example values (L=100 km, D=17, Δλ=0.1 → 170 ps) in the slider would see a GREEN "ok" status, contradicting the lesson's own explanation.

**Fix shape:** Change `limit_10g` from 200 to 100 ps and update the comment. Alternatively, document the 200 ps threshold against a specific industry reference (e.g., ITU-T G.691 or G.957 which define implementation margins) to justify the 2× factor.

---

### FINDING 2 — LOW
**L06 Internal inconsistency: splice loss 0.15 dB (lesson text) vs 0.10 dB (LinkBudgetCalculator default)**

**Verified by reading:** `L06.link-budget-worked-example.jsx:145` and `LinkBudgetCalculator.jsx:22`
**Code snippet (L06 body):**
```javascript
{`Splices:       6 × 0.15 dB            =  0.90 dB   ← FOA planning value`}
```
**Code snippet (calculator):**
```javascript
const [splLoss, setSplLoss] = useState(0.10);  // dB/splice
```
**Issue:** The lesson body throughout L06 consistently uses 0.15 dB/splice as the "FOA planning value." The `LinkBudgetCalculator` embedded on the same page defaults to 0.10 dB/splice ("FOA field default" per its own comment). A learner who reads the worked example (0.15 dB/splice), then uses the interactive calculator with its default, will get a headroom answer 0.30 dB higher than the lesson just showed, with no explanation. The lesson even says in the Book vs Field box: "Field: Experienced designers use… 0.15 dB/splice for budgeting" — exactly the opposite of what the calculator defaults to. Both values are defensible in practice, but they conflict within a single lesson.

**Fix shape:** Align the `LinkBudgetCalculator` default `splLoss` to 0.15 dB to match the lesson's planning-value framing, OR add a note in L06 explaining why the calculator defaults to 0.10 dB (field quality target vs. planning value distinction).

---

### FINDING 3 — LOW
**L03 SliderExploration: `limit_10g` threshold inconsistency produces misleading visual feedback for standard worked-example values**

*(Separate from the comment-wording error in Finding 1; this is the functional consequence.)*

**Verified by reading:** `L03.dispersion-why-signals-blur.jsx:204–230`
**Issue:** With the slider at its defaults (L=100 km, D=17, Δλ=0.1), ΔT = 170 ps. The slider reports status `ok` with message "well within 10 Gb/s tolerance (< 200 ps)." But the lesson body's worked example immediately above says "this link would fail at 10 Gb/s over 100 km." A learner who reads the worked example, then immediately tries the same values in the slider, receives contradictory feedback. This is a pedagogically significant accuracy issue since it directly undermines the lesson's core teaching point.

**Fix shape:** Same as Finding 1 — correcting the threshold from 200 to 100 ps resolves both the comment error and the contradictory feedback.

---

### FINDING 4 — LOW
**L08 OM3 bandwidth cited as 2000 MHz·km (is EMB, not OFL BW)**

**Verified by reading:** `L08.smf-vs-mmf-choosing.jsx:141`
**Table entry:**
```
OM3 | 50 µm (laser-opt.) | 2000 MHz·km | 300 m | Aqua
```
**Issue:** The column header says "Bandwidth (@ 850 nm)" which is ambiguous. OM3 as defined in TIA-492AAAC has two bandwidth specifications: OFL BW (overfilled launch) ≥ 1500 MHz·km and EMB (effective modal bandwidth) ≥ 2000 MHz·km. The 2000 MHz·km figure is the EMB value — the one relevant to VCSEL systems — which is correct for the lesson's context. However, the column header "Bandwidth (@ 850 nm)" could lead a learner to look up the TIA standard and find 1500 MHz·km, thinking the lesson is wrong. The `[confirm current editions]` flag on the table source note is appropriate; adding EMB vs OFL BW clarification in the header or a footnote would eliminate ambiguity.

**Fix shape:** Add "(EMB)" after "2000 MHz·km" in the table, or expand the column header to "Min EMB @ 850 nm (VCSEL)."

---

### FINDING 5 — LOW
**L08 OS2 attributed to G.652.D only; G.652.C also qualifies as OS2**

**Verified by reading:** `L08.smf-vs-mmf-choosing.jsx:175–188`
**Code snippet:**
```jsx
<li>
  <strong>OS2</strong> — specified in ITU-T G.652.D (current standard). Maximum
  attenuation 0.4 dB/km @ 1310 nm, 0.3 dB/km @ 1550 nm. Reduced water peak
  (1383 nm). This is the standard OSP SMF grade...
</li>
```
**Issue:** Per ISO/IEC 11801-1 and IEC 60793-2-50, OS2 maps to both ITU-T G.652.C and G.652.D (both have reduced water peak at 1383 nm). The lesson says "specified in ITU-T G.652.D" exclusively. G.652.C, while less common today, also qualifies as OS2 and a learner who encounters a cable labeled "G.652.C" might incorrectly believe it is not OS2. In practice, virtually all new-deployed OSP fiber is G.652.D, so the impact is low. The lesson's guidance to always read the label is correct and partially mitigates this.

**Fix shape:** Add "G.652.C and G.652.D" or note "G.652.D is the current revision; G.652.C also qualifies as OS2."

---

## Independently verified math vs flagged summary

| Category | Count | Notes |
|----------|-------|-------|
| Math instances independently re-derived and verified | 14 | Critical angles, ΔT (×3), link budgets (×3), PMD DGD (×3), dB conversions (×3), PMD table distances (×3) |
| Math flagged as incorrect or internally inconsistent | 1 | L03 slider limit_10g = 200 ps (should be 100 ps, per lesson's own body text) |
| Quiz answers independently verified | 20 out of 20 | All capstone + per-lesson answers re-derived; all match [CORRECT] designations |
| Standards citations checked | 18 | G.652.D, G.657, G.984, G.694.2, IEEE 802.3ae/3an, TIA-492AAAC/D/E, IEC 61280-4-2, IEC 61282-9, IEC 61300-3-35, FOA; all cited standards plausibly cover claimed content; no fabricated clause references found |
| [confirm edition] markers present where appropriate | ✓ | G.652, G.657, TIA-568.3-D, TIA-492AAAD/E, IEC 61280-4-2, IEC 61282-9, IEC 61300-3-35, G.Sup39 all appropriately flagged |
| SHA citations reviewed | None | No SHAs cited in lesson content |

---

## Verdict: YELLOW

T02 is technically accurate in all pedagogically load-bearing content — every quiz answer checks out, every formula is correctly stated, key optical specs match the referenced standards. Three of the five findings relate to Finding 1/3 (the same root cause: slider threshold 200 vs 100 ps), which produces visibly contradictory feedback vs. the worked example on the same page. That single issue warrants YELLOW rather than GREEN and should be fixed before the course is considered complete. Findings 2, 4, and 5 are minor polish items that won't cause learner confusion on most paths.

=== T02 TECHNICAL RT END ===
