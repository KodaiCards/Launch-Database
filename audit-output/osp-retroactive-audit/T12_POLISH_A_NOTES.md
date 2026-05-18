# T12 Polish-A Notes

Commit: `5a9e5c8`
Source canonical: RT-γ `64b5af1` + RT-δ `779b42a`

## Items Applied

### MED — NEW-1 — L05 UPC reflectance spec (lines 154, 158-159, Q3 option A + explanation)
**BEFORE:** prose said "−14 to −35 dB for UPC"; contaminated range presented as the spec.
Quiz Q3 option A: `"UPC (Ultra Physical Contact) — flat polish, −14 to −35 dB reflectance"`
**AFTER:** prose corrected to "−45 to −55 dB for a clean UPC"; contaminated degradation range preserved as "down to −14 to −30 dB". Quiz Q3 option A updated to "−45 to −55 dB reflectance (clean)". Quiz explanation updated to distinguish clean vs contaminated ranges.

**Primary-source verification:** Multiple independent web sources (Corning, FOA, EXFO, Fluke Networks application notes) confirm clean UPC return loss = −45 to −55 dB for singlemode. Contaminated UPC can degrade to −14 to −30 dB. Added to citation-registry.

### LOW — G-1 — L10 EIOR double-declaration
**BEFORE:** `EIOR` appeared in both `vocabulary_introduced` AND `vocabulary_assumed` (pointing T12.L03).
**AFTER:** Removed `EIOR` from `vocabulary_introduced`. `T12.L03` retains ownership per DAG. DAG registry regenerated.

### LOW — NEW-2 — L09 1625 nm L-band boundary imprecision (prose line 167, key_term def, quiz explanation)
**BEFORE:** "outside the C-band (1530–1565 nm) and L-band (1565–1625 nm) DWDM windows"
**AFTER:** "at the upper boundary of the L-band (ITU-T G.664 defines L-band as 1565–1625 nm) — above the C-band (1530–1565 nm) and above populated L-band DWDM traffic channels". Same fix applied to key_term definition and quiz explanation. Quiz option text left as "outside...traffic windows" (functionally accurate for in-service use).

### LOW — NEW-3 — L09 G.657 Flashcard short-term radii
**BEFORE:** "G.657.A1 minimum bend radius: 10 mm (1 cm). G.657.A2: 7.5 mm. G.657.B2: 7.5 mm. G.657.B3: 5 mm." — only long-term values shown.
**AFTER:** "Short-term/installation → long-term/permanent: G.657.A1: 15 mm → 10 mm. G.657.A2: 10 mm → 7.5 mm. G.657.B3: 7.5 mm → 5 mm." Body table (already correct) unchanged.

**Verification:** ITU-T G.657 confirms G.657.A1 design minimum = 10 mm (long-term), installation/dynamic = 15 mm. Consistent with body table at line 152.

## Neighborhood scan findings (report only — NOT applied)

- L05 source comment references "EXFO AN194 | VIAVI OTDR Reference Guide | Fluke Networks Application Notes" — no specific section numbers. Low-priority citation precision item.
- L09 body table line 151: G.652.D "40 mm long-term; 30 mm OK for fixed routes" — slightly ambiguous vs IEC 60793-2-50 which specifies 30 mm min bend radius for G.652.D. "40 mm" appears to be a conservative cable spec rather than the fiber spec. Worth flagging for final-verify RT.

## Build/validation results
- Vite build: ✓ clean (7.29s)
- Validator: T12 15/15 PASS
- DAG registry: 179 lessons, 947 terms, 1527 verified pointers

=== T12 POLISH-A NOTES END ===
