# T06 Polish-A Notes

**Write-path constraints acknowledged: only `osp-training/src/lessons/T06/L11.*.jsx`, `osp-training/src/lessons/T06/L12.*.jsx`, and `audit-output/osp-retroactive-audit/T06_POLISH_A_NOTES.md` written.**

**Date:** 2026-05-17  
**Source:** Convergent canonical from RT-α `7a5d154` + RT-β `ee0d4c2`

---

## Fixes Applied

### P1 HIGH — L11 §32 stale references (3 locations)

**Before → After:**

L11 line 97 (Foundations "Separation deficiency" list item):
- BEFORE: `violating NESC §32 or §35 separation requirements`
- AFTER: `violating NESC §35 Rule 354 separation requirements`

L11 lines 178-181 (Working, QA checklist Item 4 body):
- BEFORE: `NESC §35 minimum (cable in conduit) or §32 (direct-buried) ... (Source: NESC C2 §32/§35 [confirm edition]; T06.L09.)`
- AFTER: `NESC §35 Rule 354 minimum (governs both direct-buried cable and cable in duct not part of a conduit system) ... (Source: NESC C2 §35 Rule 354 [confirm edition]; T06.L09.)`

Alignment: These now match the H-1 correction applied to L09 in Fix Wave A. §35 governs both direct-buried and open-duct installations; §32 governs underground conduit system infrastructure (supply focus). §32 was never the correct governing section for comm/supply separation.

### P2 LOW — CGA v19 → v20.0 (2024)

**L11 occurrences fixed (2):**
- Line 215: `CGA Best Practices v19` → `CGA Best Practices v20.0 (2024)` (warning tape source reference)
- Line 277: `CGA Best Practices v19` → `CGA Best Practices v20.0 (2024)` (frac-out source reference)

**L12 occurrences fixed (5):**
- Line 245: plowing explanation
- Line 287: HDPE vs PVC explanation  
- Line 356: red locate paint explanation
- Line 370: pilot bore reaming explanation
- Line 384: bentonite slurry explanation
- Line 496: yellow gas locate explanation

Note: L12 line 440 already had v20.0 from Fix Wave A; not touched.

Total: 7 occurrences updated across L11 + L12. All CGA references in both files now consistent at v20.0 (2024).

### P3 LOW — L12:333 H-20 axle description

**Before:** `H-20 covers the 10-ton axle load rating for commercial vehicles.`  
**After:** `H-20 corresponds to AASHTO HS-20, a 20-ton GVW two-axle truck with a 32,000 lb rear axle (16 tons rear), the standard live-load rating for traffic-rated enclosures.`

Cross-lesson consistency: now matches L05:61 which correctly defines H-20 as "20-ton GVW / 32,000 lb rear axle."

---

## Validator + Build Results

- `validate-lesson-schema.js T06` → **12/12 PASS, 0 FAIL, 0 WARN**
- `npm run build` → **✓ built in 5.91s — zero errors**
- `build-dag-registry.js` → 152 broken pointers total; all pre-existing from authoring wave. Zero new T06 pointer breaks introduced.

---

## Neighborhood Scan (±20 lines from each fix)

Scanned ±20 lines around each fix location for same-pattern stragglers:

- **§32 reference in L11:** Only the 3 fixed lines contained the stale `§32` separation framing. No additional stale §32 references within ±20 lines.
- **CGA v19 in L11/L12:** After replace_all, zero remaining `CGA Best Practices v19` in either file. Confirmed via grep.
- **H-20 "axle" references in L12:** L12:333 was the only `10-ton axle` occurrence. L05 and L08 correctly state `20-ton GVW / 32,000 lb rear axle` — no additional stale H-20 axle descriptions found in L11 or L12.
- **"§32/§35" combined source citation pattern:** Scanned L12 branching scenario (lines 195-210) — these correctly cite `NESC §35 Rule 354` (already fixed by H-1 in Fix Wave A). No additional stale `§32/§35` combined patterns found.

No unreported stragglers found in neighborhood scan.

---

## Pre-existing items NOT fixed (per scope constraint)

- DAG pointer breaks: `conduit → T06.L03` (should be T01.L02) in L02/L03/L05-L10 — pre-existing from authoring wave; flagged for future DAG sweep wave.
- L09 Q6: "6-inch minimum" for Rule 354 parallel separation appears only in quiz answer, not lesson body — pre-existing LOW; optional future enhancement.

=== T06 POLISH A NOTES END ===
