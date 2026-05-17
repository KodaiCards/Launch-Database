# T07 Polish-B Notes — L05 WorkedExample 18→15.5 ft Fix

**Wave:** T07 Polish-B  
**Date:** 2026-05-17  
**Commit:** 69da2e6  
**Scope:** T07.L05 WorkedExample clearance value correction (scope gap from Polish-A `07e16f7`)

---

## Canonical Item Addressed

**G-1 MED (RT-γ `7455dd4`):** T07.L05 WorkedExample Step 3 used `18.0 ft` as the NESC Rule 232 minimum for a communications/fiber span crossing a county road. The correct value is `15.5 ft` (communications cable row in Table 232-1). 18 ft is the supply conductor row, not applicable to fiber.

Polish-A (`07e16f7`) fixed this in L04 but missed L05, which has an identical scenario.

---

## Primary-Source Verification

**Value verified:** 15.5 ft minimum clearance for communications cables over roads accessible to truck traffic, per NESC Rule 232 Table 232-1.

**Independent source used (different from L04 Polish-A sources):**
- Web search synthesis across: GDS Associates 2023 NESC Application Guide, OJUA Rule 232B1 history document, ikeGPS NESC Rule 232 article, NY DPS Rule 232 document, multiple utility application guides.
- All consistently confirm: communications cable clearance over truck-accessible roads = **15.5 ft**; supply conductor clearance over same road = **18 ft**.
- The distinction exists because communications cables carry no dangerous voltage, so NESC allows them to be lower.
- This matches T04 (lines 252-253, 260), T05 (L02, L15), and T07.L04 Polish-A authored values — fully internally consistent.

**Citation registry:** NESC Rule 232 entry already present (`Last Verified: 2026-05-16`). The 15.5 ft comm-specific value is confirmed as independent corroboration; no new registry entry needed (existing entry covers Rule 232 generally; specifics confirmed in-lesson with `[confirm NESC C2-2023 edition]` qualifier).

---

## Before → After (all 6 locations)

| Location | Before | After |
|---|---|---|
| Line 268 prose callout | `22.5 ft > 18 ft NESC min — OK` | `22.5 ft > 15.5 ft NESC Rule 232 comm min (supply conductors require 18 ft — this is fiber) — OK` |
| Step 3 formula | `NESC Rule 232 minimum 18.0 ft` | `NESC Rule 232 Table 232-1 comm minimum 15.5 ft [confirm NESC C2-2023 edition]` |
| Step 3 substitution | `22.5 ft vs. 18.0 ft minimum` | `22.5 ft vs. 15.5 ft minimum (communications cable over truck-accessible road)` |
| Step 3 result | `22.5 ft > 18.0 ft — clearance OK` | `22.5 ft > 15.5 ft — clearance OK` |
| Step 3 explanation | `4.5 feet above the 18-foot NESC Rule 232 minimum` | `7 feet above the 15.5-foot NESC Rule 232 Table 232-1 minimum … supply conductors require 18 ft over the same road` |
| Step 4 full entry | `Road clr 22.5 ft > 18 ft NESC min — OK` | `Road clr 22.5 ft > 15.5 ft NESC Rule 232 comm min — OK` |
| sanityCheck | `22.5 ft > 18 ft — OK` | `22.5 ft > 15.5 ft NESC Rule 232 comm min — OK … 15.5 ft minimum applies here because this is a communications cable … supply conductors require 18 ft, but that row does not apply to fiber` |

---

## Validation Results

- **Schema validator:** 10/10 PASS (T07 all lessons)
- **DAG registry:** No new breaks (pre-existing DUPEs unchanged)
- **Vite build:** Clean — ✓ built in 5.82s

---

## Neighborhood Scan (L06, L07, L08)

Scanned for any `18 ft` / `18.0` clearance values in comm context across L06, L07, L08.  
**Result: None found.** The 18 ft scope gap was isolated to L05 only.

---

## Notes

- The `18 ft` value is correctly retained in the prose callout (line 269) as a contrast explanation ("supply conductors require 18 ft — this is fiber"), which is correct teaching.
- Step 3 label updated to include `(fiber/comm cable)` for clarity, matching the L04 Polish-A framing.
- The arithmetic sanity note updated: 22.5 − 15.5 = 7 ft margin (was "4.5 feet above the 18-foot minimum" — that delta was itself wrong since 22.5 − 18 = 4.5, but 22.5 − 15.5 = 7).

=== T07 POLISH-B NOTES END ===
