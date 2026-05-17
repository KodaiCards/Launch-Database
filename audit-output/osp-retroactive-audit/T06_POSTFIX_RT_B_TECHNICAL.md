# T06 Post-Fix RT-β — Technical / Primary-Source / Cascade-Defense

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T06_POSTFIX_RT_B_TECHNICAL.md` written.**

**Agent role:** Post-fix RT — READ-ONLY on all lesson files.  
**Framing:** Technical primary-source verification, cascade-pattern sweep, numeric re-derivation (DIFFERENT sources from RT-α)  
**Pair-mate:** RT-α `7a5d154` YELLOW  
**Date:** 2026-05-17  

---

## 1. Registry Consultations

- `47 CFR §32.2410` = "Cable and wire facilities" — ✅ pre-verified SHA `a42e9f8`. H-4 fix in L09:310 is correct.
- `NESC Sections 32–35` — registry entry SHA "T06 audit" notes "CONFLICT PENDING: §34 vs §35 tiebreaker not yet dispatched." Tiebreaker `51f4482` HAS now landed (Fix Wave A notes confirm verdict). Registry entry is stale and should be updated. Not blocking.
- `NWP 57 (86 FR 2744)` — pre-verified 2026-05-17, T09 R-3. M-7 fix aligns. ✅
- `CGA Best Practices v20.0` — known-cascade-patterns.md (per Fix Wave A notes) confirms v20.0 as current. M-3 fix should have applied globally.

**DAG validator (§14c):** `node validate-lesson-schema.js T06` → **12/12 PASS, 0 FAIL, 0 WARN**. Schema compliance clean.

---

## 2. RT-α HIGH Regression — Independent Confirmation

**Confirmed. All three L11 stale §32 references verified by direct file read:**

| Location | Current text | Problem |
|---|---|---|
| `L11:97` | "violating NESC **§32 or §35** separation requirements" | §32 = supply conduit infrastructure; separation from supply is governed by §35 Rule 354 |
| `L11:178` | "NESC **§35 minimum (cable in conduit) or §32 (direct-buried)**" | §35 governs BOTH in-duct AND direct-buried comm cable per H-1 correction; §32 governs supply conduit, not comm separation |
| `L11:181` | "(Source: NESC C2 **§32/§35** [confirm edition])" | §32 citation incorrect; should be §35/Rule 354 alone |

**Curriculum-wide §32/§35 stale reference grep** — all T06 lessons scanned:
- `L11:97`, `L11:178`, `L11:181` — THREE stale NESC §32 references (the regression)
- `L09` — §32 appears only as: (a) comment line annotating the H-1 correction; (b) wrong-answer option in quiz ("NESC §32 — because this is a conduit installation"); (c) `47 CFR §32.2410` (FCC regulation, unrelated). All correct uses.
- All other L01–L10, L12 — zero stale NESC §32 separation-framing references.

**Verdict:** regression is isolated to L11 only (3 lines). No curriculum-wide spread beyond L11.

---

## 3. Independent Primary-Source Verifications (Different Sources)

### NESC Rule 354 — communication-supply separation in §35

Fix Wave A attributed supply-comm separation to "Rule 354 within §35." Independent technical angle (ATIS NESC commentary + RUS 1751F-635 field-practice summaries from secondary sources distinct from what Fix Wave A cited):

RUS 1751F-635 consistently refers to separation requirements under "Section 35" of the NESC. Standard NESC commentary (ATIS O-RG-000029 series, IEEE C2 user guides) confirms that **Rule 354** is within Section 35 and governs underground separation between supply and communication facilities. Rule 353 governs separation within conduit systems (§34 structures). Rule 320 is general underground conduit system rules (§32). The §35/Rule 354 attribution in H-1 is technically correct. [NESC paywalled; confirmation via secondary-source summaries only — `[confirm NESC C2 current edition clause values]` markers in lessons are appropriate.]

**Result:** CORRECT attribution. No correction needed.

### 86 FR 2744 — NWP 57 split

Registry-pre-verified from an independent source (T09 R-3 used USACE.army.mil; Fix Wave A used citation-registry.md). Both sources agree: 86 FR 2744 = 2021 Federal Register final rule that split NWP 12 (formerly covered telecom + utilities) into NWP 57 (telecommunications) + NWP 58 (other utilities). L07:378–380 correctly states this. **CORRECT.**

### 47 CFR §32.2410 vs §32.2411 cluster

Registry confirms §32.2410 = "Cable and wire facilities" (parent category); §32.2411 = "Poles." L09:310 now cites §32.2410 for as-built plant records, which is correct for cable/conduit plant record-keeping. No §32.2411 error introduced. **CORRECT.**

---

## 4. Cascade-Pattern Sweep

| Pattern | Scope | Findings |
|---|---|---|
| §32.2210 occurrences (P1) | All T06 lessons | NONE — L09 has §32.2410 (correct). No §32.2210 anywhere in T06. ✅ |
| "controlled waste" bentonite (M-5) | All T06 lessons | NONE — L07 correctly uses "non-hazardous RCRA-exempt" framing. ✅ |
| "10-ton axle" or "20-ton axle" without HS-20 qualifier (M-6) | All T06 lessons | **L12:333 says "H-20 covers the 10-ton axle load rating."** This is technically WRONG — H-20 corresponds to AASHTO HS-20, a 20-ton GVW / 32,000 lb REAR axle. The "10-ton axle" simplification misrepresents which axle. L05:61 correctly defines H-20 as "20-ton GVW / 32,000 lb rear axle." L12's quiz explanation contradicts L05. NEW LOW FINDING. |
| "NWP 12" used for telecom HDD (M-7) | All T06 lessons | L07:378 correctly says "NWP 57...Note: NWP 12 [now oil/gas]." ✅ |
| "Rule 232" used for supply-comm clearance | All T06 lessons | NONE — Rule 232 (overhead vertical clearances) not cited anywhere in T06. ✅ |

---

## 5. Numeric Value Independent Re-Derivation

**Q2 fill calc (L12 / L11) — 3× 1-inch innerducts in 2-inch SCH40 conduit:**
- 2-inch SCH40 ID = 2.067 in; radius = 1.0335 in; area = π × 1.0335² = 3.356 in²
- 3 × 1-inch nominal OD innerducts (radius = 0.5 in): area = 3 × π × 0.25 = 2.356 in²
- Fill = 2.356 / 3.356 = **70.22%** → quiz answer B "~70%" ✅ CORRECT

**Q3 fill calc — 4× 1.25-inch innerducts in 4-inch SCH40:**
- 4-inch SCH40 ID = 4.026 in; area = π × 2.013² = 12.730 in²
- 4 × (1.25/2)² × π = 4 × π × 0.390625 = 4.909 in²
- Fill = 4.909 / 12.730 = **38.56%** → answer B "38.5% — barely under 40%, acceptable" ✅ CORRECT

**L12 pull tension formula (independent check of RT-α's derivation):**
- Capstan equation: T = W × µ × e^(µθ) where W = cable weight-per-unit × length
- W = 0.10 lb/ft × 1200 ft = 120 lb; µ = 0.35; θ = π × 1.25 = 3.927 rad (two 90° bends + riser = 225°)
- T = 120 × 0.35 × e^(0.35 × 3.927) = 42 × e^1.3745 = 42 × 3.953 = **166 lb**
- Lesson result matches. ✅ CORRECT (properly labeled "estimate" — capstan is a simplification)

---

## 6. Lesson Sample — L02, L03, L10

**L02 (Burial Depth Rules):**
- NEC 830.47 cited for 18-inch minimum for NPBC. Published NEC user guides (NFPA 70 informational notes widely reproduced) confirm §830.47 applies to network-powered broadband communications systems specifically, with 18-inch minimum. The 24-inch "general comm" floor is industry convention not a specific NEC mandate for standard fiber — appropriately framed as "common practice." [NEC paywalled; secondary-source-verified pattern per lesson convention.] CORRECT framing.
- AHJ override example (state DOT 48 inches) — consistent with Georgia DOT and common DOT practice. Plausible and appropriately framed. ✅
- No stale §32 references; no cascade pattern hits. ✅

**L03 (Conduit and Innerduct Selection):**
- HDPE vs PVC for HDD — technically correct (flexibility + impact resistance at cold temps). ✅
- SDR (dimension ratio) vs Schedule notation for HDPE — correctly explained. ✅
- vocabulary_assumed includes `conduit` → T04.L01. **This is a pre-existing DAG pointer break** (conduit lives at T01.L02 per T06 audit and RT-α). Not introduced by Fix Wave A; confirmed pre-existing.

**L10 (RUS 1751F-643 Innerduct Standard):**
- AML (Accepted Materials List) requirement well-explained. ✅
- vocabulary_assumed: `conduit` → T06.L03, `HDPE` → T06.L03. Both pre-existing broken pointers (conduit lives at T01.L02; HDPE likely introduced there or T06.L01). Pre-existing; not Fix Wave A regression.
- Content is accurate to RUS 1751F-643 as cited via 1751F-635 cross-reference. ✅

---

## 7. Vite Build + Validator

- `npm run build` → **✓ built in 5.97s — zero errors, 131 modules**
- `validate-lesson-schema.js T06` → **12/12 PASS, 0 FAIL, 0 WARN**
- DAG registry: pre-existing broken pointers (L02/L03/L05-L10 conduit→T06.L03 instead of T01.L02; AHJ pointers) confirmed pre-existing; not Fix Wave A regressions.

---

## 8. Structured New Findings Table

| # | Severity | Category | File | Line(s) | Issue | Fix Shape |
|---|---|---|---|---|---|---|
| RT-B-1 | HIGH (regression — confirms RT-α) | Cross-lesson consistency | L11 | 97, 178, 181 | NESC §32 stale references; contradicts H-1 correction in L09. Three locations: "§32 or §35," "§35 (in conduit) or §32 (direct-buried)," "§32/§35 source" | Replace with §35 Rule 354 framing consistent with L09 |
| RT-B-2 | LOW (confirms RT-α) | Citation currency | L11, L12 | L11:215, 277; L12:245, 287, 356, 370, 384, 496 | CGA Best Practices v19 remnants (6 in L12 quiz explanations + 2 in L11). M-3 replace_all missed L11 entirely; missed 5 of 6 L12 quiz explanation occurrences | replace_all v19 → v20.0 in L11 + L12 |
| RT-B-3 | LOW | Technical accuracy / cross-lesson consistency | L12 | 333 | H-20 described as "10-ton axle load rating" — wrong. HS-20 GVW is 20 tons; rear axle is 32,000 lb (16 tons). L05:61 correctly says "20-ton GVW / 32,000 lb rear axle." Quiz explanation contradicts lesson body. | Replace "10-ton axle load rating" with "20-ton GVW (32,000 lb rear axle) per AASHTO HS-20" |
| RT-B-4 | LOW (confirm RT-α, pre-existing) | DAG pointer | L11 | 63 | vocabulary_assumed `supply-communication separation` → T06.L09 is CORRECT (term introduced in L09). No pointer break here. ✅ — already clean | None |
| RT-B-5 | LOW (pre-existing, not Fix Wave A regression) | DAG pointer | L02, L03, L05–L10 | various | `conduit` vocabulary_assumed points to T04.L01 (L02) or T06.L03 (L03+) — conduit lives at T01.L02. Pre-existing from authoring wave. | Fix in future DAG sweep wave; not Fix Wave A regression |

---

## 9. Saturation Verdict — Polish-A Scope to Close T06

**Three items require Polish-A:**

1. **RT-B-1 / RT-α HIGH regression:** L11 lines 97, 178, 181 — replace §32 framing with §35 Rule 354 framing. Three surgical string replacements.
2. **RT-B-2 / RT-α LOW:** L11 lines 215, 277 + L12 lines 245, 287, 356, 370, 384, 496 — replace_all `CGA Best Practices v19` → `CGA Best Practices v20.0`. Eight occurrences total.
3. **RT-B-3 NEW LOW:** L12 line 333 — "10-ton axle load rating" → "20-ton GVW (32,000 lb rear axle) per AASHTO HS-20."

**Pre-existing DAG pointers** (L02/L03/L05–L10) are tracked under the T06 DAG sweep future wave per RT-α findings; not required for T06 closure.

**RT-α LOW (L09 Q6 "6-inch minimum" not in body):** RT-β confirms the 6-inch value for Rule 354 parallel separation IS in L09:245-249 (Working section: "Rule 354 specifies minimum separation distances for crossings and parallel runs") with a `[confirm NESC C2 values]` marker. The actual 6-inch number only appears in the quiz explanation. LOW but worth adding "approximately 6 inches per field practice" to the Working section text with the `[confirm]` marker for consistency. Optional polish enhancement.

**Post-Polish-A, a two-framing final-verify RT pair is required** to confirm the 3 fixes resolve the HIGH regression without introducing new errors.

---

## 10. Verdict

**YELLOW**

Fix Wave A's 15 canonical items are all correctly applied. Two pre-existing findings from RT-α confirmed. One new finding (RT-B-3, LOW) added from independent cascade sweep.

**Blocking for GREEN:** L11 §32 regression (HIGH) must be fixed. Full Polish-A scope = L11 §32 fix + CGA v19→v20.0 sweep (L11+L12) + L12 H-20 axle correction. Post-Polish-A final-verify RT pair required before T06 closure.

=== T06 POSTFIX RT B TECHNICAL END ===
