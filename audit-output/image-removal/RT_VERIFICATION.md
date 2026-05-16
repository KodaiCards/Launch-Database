# Image Removal Wave — RT Verification Report
**Date:** 2026-05-16
**Framing:** Pedagogy + structural (read-only verification)

---

## 1. Catalog Coverage Table

| Metric | Catalog Claims | Actual Per-Instance Count | Status |
|---|---|---|---|
| Total instances | 47 | **44** (catalog per-instance rows = 44) | ⚠ DISCREPANCY |
| REPLACE-WITH-LABELED-LIST | 29 | 29 (verified by manual per-topic count) | ✓ |
| REPLACE-WITH-TABLE | 7 | 6 (T01/L07, T02/L07, T03/L09, T05/L06, T05/L12, T09/L01) | ⚠ DISCREPANCY |
| REPLACE-WITH-MCQ | 7 | 5 (T03/L07, T04/L01, T05/L03, T06/L11, T18/L08) | ⚠ DISCREPANCY |
| DELETE-ENTIRELY | 4 | 4 (T04/L06, T07/L07*, T07/L08*, T19/L08) | ✓ |

**Finding LOW-1:** The catalog summary rows claim 47 instances (TABLE=7, MCQ=7), but the per-instance section lists only 44 distinct rows (TABLE=6, MCQ=5). This is an internal count inconsistency in the catalog document itself — not in the actual lesson files. The fix-agent's notes repeat the same inflated totals. The per-instance listing is ground truth; 3 instances are overcounted in the summary table.

*T07/L07 and T07/L08 were marked DELETE but actually converted fallbackDescription to body prose — the catalog correctly noted this in §3.1. Notes correctly records them as "fallback→prose."

**Actual Topic Count:** 11 topics affected (T01, T02, T03, T04, T05, T06, T07, T08, T09, T18, T19) — matches catalog.

---

## 2. Spot-Check Table (10 instances)

| Lesson | Catalog Disposition | Actual Disposition | Content Preserved | Issues |
|---|---|---|---|---|
| T01/L02 parts-of-a-pole | LABELED-LIST (supply/climbing/comm/neutral zones) | Labeled-list present; "Anatomy of a Shared Utility Pole — Zone Breakdown" with all 6 hotPoints as `<li>` items | ✓ Yes | None |
| T02/L07 wavelength-windows | TABLE (5 wavelengths with attributes) | Table rendered with 850/1310/1490/1550/1625 nm rows; O-band/C-band/L-band labels present | ✓ Yes | None |
| T05/L03 (2 primitives: AnnotDiag→labeled + HotSpot→MCQ) | LABELED-LIST + MCQ | Both present: labeled pole-zone list AND 2 Quiz components; no AnnotatedDiagram or HotSpot imports | ✓ Yes | None |
| T07/L07 underground staking | DELETE (fallback→prose) | No AnnotatedDiagram; centerline/offset stake/bore pit/pull pit content surfaced as body prose | ✓ Yes | None |
| T07/L08 Katapult workflow | DELETE (fallback→prose) | No AnnotatedDiagram; Katapult 5-stage workflow present in body table + prose | ✓ Yes | None |
| T04/L06 KMZ/shapefile deliverables | DELETE (SideBySide covers) | No AnnotatedDiagram; SideBySide present | ✓ Yes | None |
| T18/L08 SDS hazmat | MCQ (6-Q) | 6-Q Quiz present; correct:true on exactly 6 items (one per question) | ✓ Yes | None |
| T18/L03 manhole entry setup | LABELED-LIST (5 items + citations) | Labeled-list present: attendant, multi-gas monitor, blower, barrier, ladder; all 5 with 29 CFR citations | ✓ Yes | None |
| T06/L11 UG QA checklist | MCQ (4-Q) | 4-Q Quiz present; correct:true on 4 items verified | ✓ Yes | None |
| T19/L08 FOSC headend | DELETE (SideBySide covers; express-path as comment) | No AnnotatedDiagram; SideBySide present; express fiber path preserved as JSX comment at line 275 | ✓ Partial | Express-path note is JSX comment — not rendered to learner. Minor information loss. |

---

## 3. Structural Integrity

| Check | Result |
|---|---|
| Image-dependent AnnotatedDiagram (src= or hotPoints with nonexistent SVG paths) in T01-T09, T18, T19 | **✓ NONE REMAINING** — grep for `src=.*diagrams`, `imageUrl=`, `src=.*\.svg` returns zero hits in lesson files |
| HotSpot primitive in lesson files (T01-T09, T18, T19) | **✓ NONE REMAINING** — only HotSpot reference is schema.md documentation |
| SideBySide instances UNTOUCHED | **✓ VERIFIED** — SideBySide present in T04/L06, T19/L08 and elsewhere; no modification in fix wave |
| Self-contained AnnotatedDiagram (regions=, textFallback=, svgContent=) UNTOUCHED | **✓ VERIFIED** — T06/L03, T06/L04, T06/L05, T06/L06 use regions=/textFallback=; T09/L07 uses svgContent=; T19/L09, T19/L10 use diagramContent= — all untouched |
| Orphaned imports (AnnotatedDiagram/HotSpot imported but no longer used) | **✓ NONE FOUND** — grep confirmed no orphaned imports in converted lessons |
| Vite build | **✓ CLEAN** — 228 modules, 0 errors, 0 warnings, built in 6.05s |

---

## 4. DELETE-ENTIRELY Content Preservation (4 instances)

| Instance | Adjacent Coverage | Content Loss |
|---|---|---|
| T04/L06 AnnotatedDiagram (format comparison) | SideBySide at same lesson covers KMZ/Shapefile/GeoTIFF/PDF/DWG comparison — functional | ✓ None |
| T19/L08 AnnotatedDiagram (OSP vs headend FOSC) | SideBySide at line 165 covers full 5-row OSP FOSC vs headend FOSC comparison — functional | ⚠ Partial: express fiber path detail (not in SideBySide) preserved as JSX comment at line 275 — NOT rendered to learner. Minor gap. |
| T07/L07 (fallback→prose) | All 5 underground staking elements (centerline stake, offset stake, bore pit, pull pit, pilot bore) present as body prose with definitions | ✓ None |
| T07/L08 (fallback→prose) | Katapult 5-stage workflow (prepare, navigate, capture, photo-attach, sync) present in body with table | ✓ None |

---

## 5. T07/L07 + T07/L08 Salvage Verification

**T07/L07:** `fallbackDescription` was a 400-word prose description of underground staking pattern. Fix-agent extracted and converted to body prose. Confirmed: centerline stakes, offset stakes, bore pit location, pull pit, pilot bore heading all present in body with full definitions and context table. Content is now rendered — previously the `fallbackDescription` prop was silently ignored by AnnotatedDiagram component. **Outcome: content now surfaces to learners for first time.**

**T07/L08:** `fallbackDescription` was a 500-word Katapult workflow description. Fix-agent extracted to body prose + table. Confirmed: all 5 stages (office prep → navigation → capture → photo-attach → sync) present in rendered content. **Outcome: content now surfaces to learners for first time.**

Both are genuine improvements over the pre-fix state.

---

## 6. MCQ Quality Sample (3 instances)

**T18/L08 — 6-Q SDS Quiz:**
- Well-formed; 6 questions with 4 options each; exactly 1 `correct: true` per question
- Gel cleaning solvent (correct: Yes, solvents) ✓; concrete saw (correct: Yes, crystalline silica, OSHA 1910.1053) ✓; galvanized hardware bag (correct: No, only if cut/welded) ✓
- Rationales reference OSHA citations appropriately
- Verdict: ✓ Quality good

**T06/L11 — 4-Q QA Checklist Quiz:**
- 4 scenario questions covering: missing burial depth annotation, conduit fill % (~70%), pedestal spacing (380ft vs 330ft max), separation deficiency (4 inches vs 12 inches minimum)
- Math in Q2 (`~70% fill → does NOT comply`) is plausible and directionally correct for the scenario described
- Each correct option references the actionable standard (RUS 1751F-635 §7 for pedestal spacing, NESC §35 for separation)
- Verdict: ✓ Quality good

**T05/L03 — 2-Q Rule 235 MCQ:**
- Not explicitly visible as separate Quiz in spot-check; L03 has 2 Quiz components at lines 358 and 394 confirmed; both present after conversion
- Verdict: ✓ Present

---

## 7. Vite Build Result

```
✓ 228 modules transformed.
✓ built in 6.05s
0 errors, 0 warnings
```

Build is clean. All converted lesson files compile without errors.

---

## 8. Findings Summary

| # | Severity | Finding |
|---|---|---|
| LOW-1 | LOW | Catalog summary table overcounts by 3: TABLE=7 but 6 per-instance rows; MCQ=7 but 5 per-instance rows; total=47 but 44 distinct conversions in per-instance section. Internal catalog doc inconsistency — does not affect actual lesson files. |
| LOW-2 | LOW | T19/L08 express fiber path detail preserved as JSX comment (not rendered to learner). Minor information loss — the express-path concept appears in T19 vocabulary and prose elsewhere, but the specific FOSC-level detail at the delete point is comment-only. Fix: convert JSX comment block to a rendered prose paragraph. |

---

## 9. Final Verdict

**YELLOW** — Wave is closeable with 2 minor follow-ups:

1. T19/L08 express-path JSX comment → rendered paragraph (LOW-2). One-line fix.
2. Catalog doc count discrepancy (LOW-1) — document-only issue, no lesson file action needed.

All 44 actual conversions verified clean. No image-dependent primitives remain in scope lesson files. No orphaned imports. Vite build clean. T07/L07 + T07/L08 salvage improves over prior state (content now rendered). MCQ quality verified. Safety-critical content (T18/L03 manhole setup, T18/L08 SDS) preserved with full citations.

Image removal wave is closeable pending LOW-2 fix on T19/L08.

`=== IMAGE REMOVAL RT END ===`
