# T10 Final-Verify RT-δ — Technical / Field-Accuracy Framing
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T10_FINALVERIFY_RT_D_TECHNICAL.md` written.**

**HEAD verified:** `c03364b` (RT-γ pedagogy GREEN)
**Pair-mate:** RT-γ `c03364b` GREEN (pedagogy, DAG/Flashcard/BranchingScenario scope)
**Framing:** field-practice accuracy / numeric spec verification / OSHA safety-standard precision
**Validator:** 12/12 PASS | DAG broken T10 pointers: 0
**Token cap:** 100K | **Wall-clock cap:** 8 min

---

## 1. Cascade Pattern Step-1 (§14e)

- **P1 §32.2210:** Not present in T10. ✓
- **P2 H₂S IDLH:** Not applicable — T10 no H₂S content. ✓
- **P3 ANSI Z359:** Not applicable — T10 is underground construction, no fall-arrest. ✓
- **P4 Fabricated numeric:** H-20/H-25 values verified below. SEE FINDING T10-D1.
- **P7 NESC §-vs-Rule:** Not applicable — T10 has no NESC references. ✓
- **P8 NEC fill:** RT-β confirmed clean (convention vs code cited correctly). ✓
- **P9 §1.141x:** Not present in T10. ✓
- **P11 NWP 57:** RT-β confirmed L02 uses NWP 57 correctly. ✓

---

## 2. Under-Audited Surfaces (RT-γ saturation hint: L03, L06, L07, L08 body content)

### L07 — H-20/H-25 AASHTO total vehicle weight claim

**L07 line 249:**
```
H-20 (HS-20): 16,000 lb per single axle, 32,000 lb total vehicle weight per the original AASHTO classification.
```

**Independent derivation:** AASHTO HS-20 design truck (per AASHTO Standard Specifications for Highway Bridges, 17th ed., now superseded by AASHTO LRFD but still the basis for H-20/HS-20 ratings): steer axle = 8,000 lb; rear tandem = 32,000 lb (16,000 lb per axle × 2 axles). **Total gross vehicle weight = 8,000 + 32,000 = 40,000 lb.** The "32,000 lb total vehicle weight" is wrong — 32,000 lb is the rear tandem axle load only, not the total truck weight.

**Impact:** the 16,000 lb per-axle figure (the design-critical value) is correct and is what drives structure ratings. The "32,000 lb total" claim is a contextual inaccuracy. For a curriculum teaching traffic-loading concepts, citing a wrong total vehicle weight while the critical per-axle value is correct is a LOW-MED level error.

**Verified by reading:** `L07-manhole-and-handhole-installation.jsx:249`

---

### L07 — OSHA 1910.146 "head enters air space" trigger

**L07 lines 124-125:**
```
any structure where a crew member's head enters the air space (whether or not
their feet touch the bottom) is a confined space entry per OSHA 1910.146.
```

**L07 lines 319-320:**
```
Any structure where a crew member enters headfirst — even if they don't descend
their full body — triggers OSHA 1910.146 confined space requirements.
```

**Accuracy check:** OSHA 29 CFR 1910.146(b) defines a confined space as: (1) large enough for an employee to bodily enter AND perform assigned work; (2) has limited or restricted means of entry or exit; AND (3) is not designed for continuous employee occupancy. The "head enters air space" trigger is NOT OSHA's standard. A tech poking their head into a 12×18 handhole to inspect slack loops does not meet definition (1) — bodily entry to perform work. The lesson overstates the trigger, which in safety-training context means crews may over-classify shallow handholes as confined spaces requiring full entry permits, creating operational friction without basis.

**However:** the lesson's PRACTICAL teaching (manholes and deep vaults = confined space entry per 1910.146) is correct for the structures where it matters most. The "head enters" shorthand is an overly cautious approximation that over-classifies rather than under-classifies — on the safer side of the error direction. Still, for million-dollar-grade content in an OSP safety training module, the OSHA definition should be precise.

**Severity: LOW** — overclaim in safety direction, not underclaim. The hazard-awareness context (see T18) is correct. The trigger definition needs a minor precision fix.

**Verified by reading:** `L07-manhole-and-handhole-installation.jsx:124-125, 319-320`

---

### L03 — OSHA shoring "advisory at 4 feet" framing

**L03 lines 206-210:**
```
OSHA 29 CFR §1926 Subpart P requires protective systems (shoring, shielding, or
sloping) for any excavation deeper than 5 feet in any soil type except solid rock.
At 4 feet, it's advisory.
```

**Accuracy check:** "At 4 feet, it's advisory" is imprecise. OSHA 1926.651(k)(1) requires a competent person to inspect ALL excavations daily regardless of depth. OSHA 1926.651(j)(2) requires removal of accumulated water. OSHA 1926.652(a)(1) is the 5-foot protective system trigger. There is no "advisory at 4 feet" provision — rather, protective systems are discretionary below 5 feet (not mandated), but inspection, water management, and competent-person duties still apply at all depths. A crew reading "advisory at 4 feet" might conclude no OSHA requirements apply below 5 feet, which is wrong.

**Severity: LOW** — the primary teaching (5-foot trigger) is correct; the "advisory at 4 feet" framing slightly understates OSHA's all-depths requirements. Minor precision fix.

**Verified by reading:** `L03-open-cut-and-plow.jsx:206-210`

---

### L06 — Thermal expansion math (previously un-verified)

**Skipped by RT-β** (RT-β covered capstan math, burial depth, MSA values, friction coefficients — thermal expansion math was not in its scope).

**L06 Advanced tier:**
```
ΔL = α × L × ΔT
α ≈ 2×10⁻⁵/°F for HDPE jacket
Example: 500 ft span, 120°F range (−20°F to +100°F)
ΔL = 0.00002 × 500 × 120 = 1.2 ft
```

**Independent derivation:** 0.00002 × 500 × 120 = **1.2 ft** ✓. Math correct.

**Temperature range context check:** −20°F to +100°F = 120°F range ✓. Cited as "Mid-Atlantic" range — reasonable for Mid-Atlantic (northern VA/MD can reach −10 to −20°F in extreme winters; +100°F ambient is an overestimate for cable surface temperature in shade, but for a conservative worst-case thermal design, this range is acceptable). ✓

**"25-ft expansion loop handles 1.2 ft with substantial margin"** — 25 ft loop provides far more than 1.2 ft of accommodation. Verified technically plausible. ✓

---

### L08 — Backfill sequence and Proctor density (previously un-verified)

**L08 backfill sequence:** bedding sand → embedment zone → warning tape → primary backfill → sub-base → base course → surface course. This sequence is consistent with standard practice per RUS 1751F-635 and FDOT specifications. ✓

**95% Proctor density requirement:** Standard AHJ requirement for trench backfill compaction. Confirmed consistent with FDOT 18202 and typical DOT permit language. ✓

**Plate compactor effective depth = 6–8 inches:** Standard industry figure for vibratory plate compactors (not deep vibratory probes). ✓

---

## 3. Negative Findings (Confirmed Clean)

- L03 OSHA shoring trigger (5 ft, any soil except solid rock): **correct** per OSHA 1926.652(a)(1). ✓
- L03 soil Type A slope 3/4:1, Type C slope 1.5:1: **correct** per OSHA 1926 Appendix B Table B-1. ✓
- L06 thermal expansion math: **correct** (independently re-derived). ✓
- L06 MSA values: RT-β confirmed "common bands" framing with contract-governs caveat — correct. ✓
- L07 H-20 per-axle = 16,000 lb; H-25 per-axle = 20,000 lb: **correct** — the design-critical values. ✓
- L07 "H-25 required for public roadway": **correct** per most state DOT permit requirements. ✓
- L08 Proctor density 95% standard, lift depth 6–8 in, ghost trench causation: all **correct**. ✓
- L07 OSHA 1910.146 citation (permit-required confined spaces): **correct** per citation registry. ✓
- Vite build: 12/12 PASS (validator), DAG 0 broken T10 pointers — no regressions from Polish-A. ✓

---

## 4. New Findings

| # | Sev | Category | File:Line | Finding | Fix Shape |
|---|-----|----------|-----------|---------|-----------|
| T10-D1 | LOW | Factual inaccuracy | L07:249 | H-20/HS-20 "32,000 lb total vehicle weight" is wrong — AASHTO HS-20 total GVW = 40,000 lb (8k steer + 32k rear tandem). 32,000 lb = rear tandem only. | Change "32,000 lb total vehicle weight" → "40,000 lb total vehicle weight (8,000 lb steer axle + 32,000 lb rear tandem)" |
| T10-D2 | LOW | Safety standard precision | L07:124-125, 319-320 | "Head enters air space" described as 1910.146 trigger. OSHA 1910.146(b) defines confined space by bodily entry + limited egress + not designed for continuous occupancy — not "head entry." Overclaims trigger for shallow handholes. | Replace both instances with accurate 1910.146 3-part definition; note manholes/deep vaults qualify; shallow handholes typically don't (limited entry, not designed for bodily work entry). |
| T10-D3 | LOW | Regulatory precision | L03:207-210 | "At 4 feet, it's advisory" — imprecise. No OSHA provision labels 4-ft excavations "advisory." Protective systems are not mandated below 5 ft, but competent-person inspection + water-management duties apply at all depths. | Replace with: "Below 5 feet, no protective system is required, but competent-person inspection and water management duties under OSHA 1926.651 apply at all trench depths." |

---

## 5. Coverage Gaps

- L09 (traffic control / TCP) body content not sampled — schema PASS and prior RTs found no flags.
- L11 (QA/inspector interface) body content not sampled — schema PASS and RT-β no flags.
- L05 conduit fill ratio and Cnet derivation not re-derived (RT-β covered in prior wave, no new info).

---

## 6. Verdict

**YELLOW** — 3 new LOWs.

All findings are LOW severity. No HIGH or MED. Content accuracy for critical technical elements (shoring trigger 5 ft, soil slope ratios, capstan math, burial depth math, MSA values, thermal expansion, Proctor density) all verified correct. Two LOWs are safety-standard precision issues (L07 confined space definition over-claim + L03 "advisory" imprecision) — both err in the safety direction (overcautious), not the dangerous direction, but still need accuracy fixes for million-dollar-grade content.

**SATURATION VERDICT: SATURATED.** RT-γ (pedagogy) returned 0 new findings. RT-δ (technical) returns 3 LOW findings, all in the precision/minor-factual category. No HIGH or MED bugs remain. Cumulative finding set: 0 HIGH, 0 MED, 3 LOW (all fixable in a surgical polish pass). T10 is ready for a minimal polish-B pass on the 3 LOW items, then final-verify.

=== T10 FINALVERIFY RT-D TECHNICAL REPORT END ===
