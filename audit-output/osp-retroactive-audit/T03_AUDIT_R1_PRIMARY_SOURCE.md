# T03 RETROACTIVE AUDIT R-1 — Primary-Source-Skeptical / High-Precision
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T03_AUDIT_R1_PRIMARY_SOURCE.md` written.**

Date: 2026-05-17
Framing: Primary-source-skeptical / high-precision. Flag only confirmed or high-confidence issues.
Files read: L01–L12 (all T03 lessons)

---

## 1. Stack Snapshot

T03 Cable Selection is 12 lessons (L01–L12) including a capstone quiz. Author `642ef0c`; 5-patch batch `492b8b9..9c57439`; prior post-patch RT returned GREEN (single-RT-pair pattern — this retroactive audit applies the new multi-framing pipeline). Vite build: **PASSES CLEAN** (confirmed via `npm run build` — `✓ built in 5.72s`, 131 modules). All 12 lessons import and export correctly.

---

## 2. Standards Verification Table

| Standard | Claimed | Verified | Verdict |
|---|---|---|---|
| ITU-T G.652.D | MFD 9.2±0.4µm at 1310nm | T03 cites G.652.D throughout — values consistent with G.652.D 2016 Table 5 | PASS |
| ITU-T G.657.A1 | 10 mm min bend radius | Per ITU-T G.657 (2024) — confirmed via multiple secondary sources | PASS |
| ITU-T G.657.A2 | 7.5 mm min bend radius; B2 merged into A2 in 2024 edition | Consistent; [verify 2024 edition consolidation] tag correctly applied | PASS w/ hedge |
| ITU-T G.657.B3 | 5 mm min; NOT backward-compat with G.652.D | Consistent with ITU-T G.657 and industry sources | PASS |
| ITU-T G.655 | — | ABSENT from T03 entirely | GAP |
| ITU-T G.656 | — | ABSENT from T03 entirely | GAP |
| NEC §770.48(A) | 50 ft unlisted cable inside building | Standard industry citation; consistent with NEC 2023 Art. 770 | PASS |
| UL 1666 | OFNR riser test (4.6 m flame propagation limit) | Consistent with published UL 1666 test method | PASS |
| UL 910 / NFPA 262 | OFNP plenum test | Consistent | PASS |
| ICEA S-87-640 | Construction standard for OSP fiber cable | Correctly cited as primary spec throughout | PASS |
| 7 CFR 1755.902 | MFD: 9.2µm ± 0.5µm at 1310nm | Cites eCFR — ±0.5µm is WIDER than ITU-T G.652.D ±0.4µm. RUS regulation may legitimately specify wider tolerance. Needs primary-source eCFR verification. | FLAG |
| NESC C2-2023 Table 250-1 | Heavy: 0.50in/4lb/ft²/0°F; Medium: 0.25in/4lb/ft²/15°F; Light: 0in/9lb/ft²/30°F | Confirmed via RUS Bulletin 1724E-150 (public) + IAEI Magazine. [Confirm against NESC C2-2023] tag correctly applied | PASS w/ hedge |
| TIA-598-D | 12-color fiber identification scheme | Consistent with TIA-598-D; 7 CFR 1755.902 eCFR also cited | PASS |
| GR-20-CORE (Telcordia) | — | NOT CITED in T03 | GAP |

---

## 3. STRUCTURED FINDINGS

### FINDING 1 — HIGH: G.655 and G.656 fiber types entirely absent from T03
**Category:** Coverage gap (P7 polish item confirmed)
**Verified by reading:** All 12 T03 lesson files — zero hits for "G.655", "G.656", "nonzero dispersion", "NZDSF", "dispersion-shifted"
**Issue:** T03 Cable Selection teaches G.652.D (standard SMF), G.657 (bend-insensitive), and omits G.655 (Non-Zero Dispersion-Shifted Fiber / NZDSF) and G.656 (Multiband NZDSF) entirely. An OSP cable selection course should at minimum explain that NZDSF exists, why it was deployed on long-haul routes, when an engineer might encounter legacy G.655 plant, and why G.652.D displaced it for most new OSP builds. This is a systematic curriculum gap.
**Fix shape:** Add G.655 and G.656 context to L05 (G.652 vs G.657 lesson) or create a brief supplement (≤10 lines per type) in L05 Advanced section. Topics: G.655 = NZDSF, 8–11 µm effective area, used where chromatic dispersion management matters (long-haul WDM); G.656 = wider nonzero dispersion band; both largely replaced by G.652.D + coherent DSP on new builds; legacy plant still in service. Course prerequisite: already teaches chromatic dispersion in T02.L03.

---

### FINDING 2 — MED: L05 bend radius derivation has a unit error (250 µm ≠ 2.5 mm)
**Category:** Math/unit error
**Verified by reading:** `L05.g652-vs-g657-bend-insensitive.jsx:128-131`
```jsx
          for G.652.D: "20× OD dynamic, 10× OD static" as the industry rule of thumb.
          For a standard 250 µm coated fiber, that means approximately 2.5 mm × 20 = 50 mm
          (2 inches) for installation pulls (dynamic) and 2.5 mm × 10 = 25 mm for long-term
```
**Issue:** 250 µm = 0.250 mm (diameter). The lesson uses "2.5 mm" as the OD — that is 10× too large (2.5 mm would be 2500 µm). The math `2.5 mm × 20 = 50 mm` and `2.5 mm × 10 = 25 mm` produce plausible-looking results because the FOA rule applied to the fiber's 250µm diameter (0.250mm) would give 5mm and 2.5mm — which happen to be 10× smaller than shown. The final values (50mm installation, 25mm static) are in the ballpark for G.652.D cable bend radius, but the derivation is dimensionally wrong and will confuse any learner who checks the arithmetic.
**Math re-derivation:**
- 250 µm = 0.250 mm (diameter of primary-coated fiber)
- FOA 20× rule: 0.250mm × 20 = **5.0 mm** — not 50 mm
- The correct way to cite G.652.D bend radius: ITU-T G.652.D Table 5 specifies macrobend loss test at 30mm radius (1 turn, 1550nm, ≤0.5dB). The practical OSP cable bend radius rule (not bare fiber rule) is stated per cable OD (typically 10–15× cable OD for long-term).
**Fix shape:** Remove the `2.5 mm × 20 = 50 mm` arithmetic. Replace with: "The ITU-T G.652.D standard specifies a macrobend test at 30 mm radius (1 turn). For OSP cables, the practical minimum bend radius is 10–20× the cable's outer diameter — for a cable with a 12 mm OD, that means 120–240 mm." The Side-by-Side table at line 258 (`~30 mm installation; ~25 mm long-term`) shows reasonable values but should cite ITU-T G.652.D Table 5 for the 30mm rather than deriving from a wrong unit conversion.

---

### FINDING 3 — MED: T03.L02 NEC DAG pointer targets wrong lesson
**Category:** Cross-topic DAG pointer error
**Verified by reading:** `L02.osp-riser-indoor-outdoor.jsx:26-28`
```jsx
    { term: 'NEC',      source_lesson_id: 'T01.L09' },
```
**Issue:** NEC is listed as assumed from T01.L09. But T01.L09 (`osp-standards-landscape.jsx:33`) itself declares `{ term: 'NEC', source_lesson_id: 'T01.L08' }` — meaning T01.L09 also assumes NEC from T01.L08. The correct first-introduction lesson for NEC is **T01.L08** (`key-acronyms-field-reference.jsx:25` — confirmed: `vocabulary_introduced: ['SMF', ..., 'NEC', ..., 'ADSS', ...]`). T03.L02's pointer should be `T01.L08`, not `T01.L09`. The DAG prerequisite invariant is violated: the pointer chain goes L02 → L09 → L08 (two hops), and L09 doesn't introduce NEC, it assumes it.
**Fix shape:** `L02.osp-riser-indoor-outdoor.jsx` line 26: change `source_lesson_id: 'T01.L09'` to `source_lesson_id: 'T01.L08'`.

---

### FINDING 4 — LOW: 7 CFR 1755.902 MFD tolerance (±0.5µm) vs ITU-T G.652.D (±0.4µm) — flag for primary source check
**Category:** Citation precision / potential discrepancy
**Verified by reading:** `L10.icea-cfr-standards-compliance.jsx:39,135`
**Issue:** L10 consistently cites "9.2 µm ± 0.5 µm at 1310 nm" as the 7 CFR 1755.902 RUS requirement, citing eCFR. ITU-T G.652.D 2016 Table 5 specifies MFD at 1310nm as 9.2 ± 0.4 µm. The ±0.5µm is wider than the ITU-T spec. If 7 CFR 1755.902 genuinely specifies ±0.5µm, the lesson is correct and the difference is intentional (RUS allowing slightly wider production tolerance). However, this needs a Haiku primary-source eCFR lookup to confirm the ±0.5µm is verbatim from 7 CFR 1755.902 and wasn't introduced by the research/author agent rounding from the G.652.D ±0.4µm.
**Confidence:** MEDIUM (may be correct; may be a transcription error)
**Fix shape:** Haiku ground-truth lookup: `eCFR.gov 7 CFR § 1755.902 mode field diameter`. Confirm the exact tolerance. If ±0.4µm, update lesson. If ±0.5µm, add explanatory note: "RUS specifies ±0.5µm, which is slightly wider than ITU-T G.652.D's ±0.4µm tolerance, intentionally accommodating broader production variation across RUS-approved suppliers."

---

### FINDING 5 — LOW: GR-20-CORE (Telcordia) not cited — coverage gap for cable construction standard
**Category:** Missing citation / supplemental standard
**Verified by reading:** All T03 lessons — zero mentions of GR-20, Telcordia, or Bellcore
**Issue:** ICEA S-87-640 is correctly cited as the primary construction standard. However, Telcordia GR-20-CORE ("Generic Requirements for Optical Fiber and Optical Fiber Cable") is a parallel standard used by many carriers and specified in RFQs. The OSP cable specifier should know GR-20 exists, what it covers (generic requirements for fiber + cable), and that some customers may specify GR-20 compliance in addition to ICEA S-87-640. Not citing it creates a gap for learners who encounter GR-20 in real project specs.
**Fix shape:** Brief mention in L10 (Standards Compliance) Advanced section: "Telcordia GR-20-CORE covers generic requirements for optical fiber and cable — some carriers and project owners specify GR-20 in addition to ICEA S-87-640. The standards largely overlap; key differences involve qualification test protocols and aging/reliability requirements."

---

## 4. Cable Type Coverage Audit

| Type | Covered | Notes |
|---|---|---|
| G.652.D (OS2, standard SMF) | YES — thorough across L01, L05, L10, L11 | Correct |
| G.657.A1, A2, B3 | YES — L05 dedicated lesson + L08, L12 | Correct |
| G.651.1 (multimode G.65x) | NO | Expected gap — OSP focus is SMF |
| OM1/OM2/OM3/OM4/OM5 | NO — zero coverage | Acceptable for OSP-focused course; T02.L08 covers these |
| G.655 (NZDSF) | NO — ABSENT | FINDING 1 — HIGH |
| G.656 (multiband NZDSF) | NO — ABSENT | FINDING 1 — HIGH |
| G.657.B2 (now absorbed into A2) | Acknowledged — 2024 consolidation noted with [verify] tag | Correct with hedge |

---

## 5. Math Re-Derivation

### Ice load constant: 1.244 (L09)
- Claim: `π × 57 / 144 ≈ 1.244`
- Verification: `π × 57 / 144 = 3.14159 × 57 / 144 = 178.97 / 144 = 1.2435`
- Lesson rounds to 1.244 — **CORRECT** (≤0.01% rounding)

### L09 Q2: w_ice = 1.244 × 0.50 × (0.71 + 0.50)
- Claim: answer ≈ 0.752 lb/ft
- Verification: `1.2435 × 0.50 × 1.21 = 0.7523 lb/ft`
- **CORRECT** — choice C matches

### Sag quadruples when span doubles (L09 Q4)
- Sag formula: `Sag = (w × L²) / (8T)`. Doubling L: Sag_new = w × (2L)² / (8T) = 4 × (wL²/8T)
- **CORRECT** — quadratic confirmed

### L05 bend radius: 2.5 mm × 20 = 50 mm (FINDING 2 above)
- `250 µm = 0.250 mm`, not 2.5 mm. The multiplication is dimensionally wrong.
- **ERROR** — MED severity

---

## 6. DAG Sample (8 pointers checked)

| Lesson | Term assumed | Pointer | Verified? |
|---|---|---|---|
| T03.L01 | 'G.652.D' | T02.L01 | PASS — T02.L01 vocabulary_introduced includes G.652.D |
| T03.L01 | 'SMF' | T01.L08 | PASS — T01.L08 introduces SMF |
| T03.L01 | 'sheath', 'buffer tube', 'armor' | T01.L03 | PASS — T01.L03 introduces all three |
| T03.L02 | 'NEC' | T01.L09 | FAIL — NEC introduced at T01.L08, not T01.L09 (FINDING 3) |
| T03.L04 | 'ADSS' | T01.L08 | PASS — T01.L08 introduces ADSS |
| T03.L05 | 'macrobend' | T02.L04 | PASS — T02.L04 introduces macrobend |
| T03.L09 | 'NESC' | T01.L02 | PASS — T01.L02 introduces NESC |
| T03.L09 | 'sag' | T01.L02 | PASS — T01.L02 introduces sag |

---

## 7. Schema / Flashcard

- **vocabulary_introduced / assumed** present in all 12 lessons: PASS
- **key_terms** with definition present in L01–L11 (L12 capstone has no vocabulary_introduced per spec): PASS
- **Flashcard components rendered** for all key_terms in each lesson: PASS (spot-checked L01, L02, L05, L09, L10)
- **Per-lesson Quiz** present in all 12 lessons: PASS
- **L12 Capstone** present with lesson_type: 'capstone-quiz': PASS
- **prerequisites chain** appears complete and non-circular (spot-checked)

---

## 8. Vite Build

`cd osp-training && npm run build` — **CLEAN PASS**: `✓ built in 5.72s`, 131 modules, zero errors, zero warnings flagged.

---

## 9. Confirmed Clean (Negative Findings)

- NESC loading district values (Heavy/Medium/Light ice+wind+temp) — confirmed via ≥2 public sources; correctly [verify] tagged
- NEC §770.48(A) 50 ft rule — consistent with NEC 2023 Art. 770
- G.657.A1/A2/B3 bend radii and splice compatibility claims — consistent with ITU-T G.657 and industry sources
- NEC fire rating hierarchy (OFNP > OFNR > OFNG) and substitution rule — correct
- UL 1666 test criteria (4.6 m flame propagation) — correct per published test method
- UL 910 / NFPA 262 flame + smoke test for OFNP — correctly cited
- TIA-598-D 12-color scheme — correct; eCFR 7 CFR 1755.902 cross-reference consistent
- Sag formula `w × L² / (8T)` — correct parabolic approximation
- Ice density 57 lb/ft³ — standard NESC value, correctly used
- L03/L07 armor descriptions (CST, interlocked, CAT) — technically consistent with ICEA S-87-640 and field practice
- L06 HDPE carbon black 2–3% UV protection — confirmed; standard OSP cable spec

---

## 10. R-2 Saturation Hint

R-2 (corroboration-adversarial framing) should independently investigate:
1. **G.655 / G.656 gap** — verify no mention anywhere in T03, confirm scope of coverage needed
2. **L05 bend radius derivation** — independently derive from FOA Reference Guide and ITU-T G.652.D Table 5 to confirm the 2.5mm error
3. **7 CFR 1755.902 MFD ±0.5µm** — attempt eCFR primary source lookup to confirm
4. **ICEA S-87-640 vs GR-20-CORE** — confirm GR-20 absence and assess scope of gap for target audience
5. **L11 tensile 2,670 N vs 2,700 N** — minor; verify ICEA S-87-640 standard-tier minimum

=== T03 AUDIT R1 PRIMARY SOURCE END ===
