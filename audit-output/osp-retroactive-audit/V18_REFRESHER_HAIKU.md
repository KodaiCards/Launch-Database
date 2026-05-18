# V18: Refresher Placement Verification — T02 Lessons

Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/V18_REFRESHER_HAIKU.md` written.

## Summary

Sampled all 12 T02 lessons (L01-L12). Verified inline refresher placement when lessons re-use terms introduced 3+ lessons earlier. Pattern: 4/12 lessons have explicit inline refreshers; 6/12 are missing refreshers for major prior concepts.

## Per-Lesson Inventory

| Lesson | Refresher status | Key re-used terms (>3 lessons prior) | Finding |
|--------|------------------|--------------------------------------|---------|
| L01 | N/A | N/A (foundational) | Introduces 8 core terms (TIR, core, cladding, NA, G.652.D, MFD) |
| L02 | ✅ GOOD | TIR, core, cladding | "Building on T02.L01 and T01 fundamentals" section (lines 56-59) |
| L03 | ✅ GOOD | attenuation, dB/km | Opens with "Attenuation (from T02.L02) tells you..." (line 46) |
| L04 | ❌ MISSING | G.652.D, MFD (from L01) | No "Building on" section; launches straight into macrobend/microbend |
| L05 | ❌ MISSING | dB/km (from L02, 3 lessons back) | Cold-start: "You've heard the word decibel..." No tie-back to L02's dB/km |
| L06 | ❌ MISSING | dB/dBm (from L05, 1 lesson back); dB/km (from L02, 4 lessons back) | Uses Tx power / Rx sensitivity in dBm without refresher for readers skipping L05 |
| L07 | ❌ MISSING | attenuation (L02, 5 back); CD (L03, 4 back); G.652.D (L01, 6 back) | Reuses values ("attenuation spec max <= 0.40 dB/km", "CD ~17 ps/nm-km") with no inline reminder |
| L08 | ⚠️ WEAK | modal dispersion (L03, 5 back); attenuation (L02, 6 back); G.652.D (L01, 7 back) | Focused on fiber grades; assumes reader knows why OM grades matter |
| L09 | ✅ GOOD | PMD, dispersion (L03, 6 back) | Builds on L03 PMD concept with deeper treatment; refresher implicit in structure |
| L10 | ⚠️ WEAK | CD/PMD (L03, 7 back); attenuation (L02, 8 back) | "CD measurement" assumes L03 familiarity; no standalone definition provided |
| L11 | ✅ GOOD | attenuation (L02, 9 back); G.657 (L04, 7 back); G.652.D (L01, 10 back) | References G.657.A1/A2/B2/B3 with inline compatibility notes vs G.652.D |
| L12 | N/A | All vocabulary_assumed | Quiz-only; no prose content |

## Critical Gaps (Highest Priority)

### Gap 1: L05→L06 dBm missing refresher
- **Pattern:** dB/dBm introduced L05, immediately re-used L06 without refresher
- **Impact:** Reader who reads L06 cold (or forgets L05) has no inline reminder that "dBm" = "decibels referenced to 1 mW"
- **Line references:** L05 line 93-94 defines dBm; L06 lines 68-72 use Tx/Rx in dBm with no refresher
- **Fix:** Add 1-2 line refresher at top of L06 Acronyms section: "(dBm = decibels referenced to 1 milliwatt; see T02.L05 if needed)"

### Gap 2: L02→L07 attenuation missing refresher
- **Pattern:** attenuation introduced L02; L07 uses attenuation values in band table without refresher
- **Impact:** L07 line 68 "absorbs or scatters others heavily" assumes reader recalls attenuation concept; L07 band table uses "attenuation spec max" without defining attenuation
- **Line references:** L02 introduces attenuation; L07 lines 68, 140-150 table ("attenuation spec max <= 0.40 dB/km") with no refresher
- **Fix:** Add "Building on T02.L02" paragraph before wavelength table: "Recall from T02.L02: attenuation is signal loss as light travels through fiber, measured in dB/km. Different wavelengths have different attenuation rates in the same fiber..."

### Gap 3: L03→L07 chromatic dispersion missing refresher
- **Pattern:** CD introduced L03 (~17 ps/nm·km formula); L07 re-uses CD value without refresher
- **Impact:** L07 line 115 "Higher chromatic dispersion (~17 ps/nm-km) requires dispersion management..." assumes reader knows what CD is
- **Line references:** L03 lines 20-22 define CD; L07 line 115 uses CD value without reminding reader
- **Fix:** Inline refresher before L07 band table: "Chromatic dispersion (from T02.L03) varies by wavelength..."

## Per-Lesson Refresher Status

### Strong (4/12): L02, L03, L09, L11
- Pattern: explicit "Building on," "Recall," or forward-reference section in foundations
- Template: 2-3 sentence callout that names the prior lesson + summarizes the prior concept + transitions to new material
- Example (L02): "In T02.L01, you learned how light travels through a fiber core via total internal reflection, and how the cladding around it confines the light. This lesson explains what happens when some of that light is *not* confined..."

### Weak (2/12): L04, L08, L10
- Pattern: Assumes reader knows why prior concepts matter; no explicit refresher
- Example (L08): Introduces OM1-OM5 fiber grades without reminding reader why modal dispersion (L03) or attenuation (L02) affect grade selection
- Recommendation: Add 1-sentence "Why this matters" callout before the lesson body

### Missing (6/12): L05, L06, L07, and partly L04, L08, L10
- Pattern: Cold-start or assumption of continuous sequential reading
- Example (L05): "You've heard the word decibel..." — ignores that dB/km was already introduced in L02 as the unit of fiber attenuation
- Recommendation: Add "Building on prior lessons" section to foundations tier before key_terms flashcards

## Specific Recommendations

1. **L04:** Add "Building on L01 and L03" section recalling G.652.D/MFD (core/cladding diameters) and why dispersion matters (sets context for bend-insensitivity)

2. **L05:** Modify opening paragraph to reference T02.L02: "In T02.L02, we used the term dB/km to express fiber attenuation (loss per km). Now we'll unpack what 'dB' actually means..."

3. **L06:** Add inline callout before Tx/Rx definitions: "If you need a refresher on dB/dBm (from T02.L05), here's the quick version..."

4. **L07:** Insert "Building on T02.L02 and T02.L03" subsection before the wavelength table, explaining attenuation varies by wavelength AND dispersion varies by wavelength

5. **L08:** Add opening callout: "Recall from T02.L03 that different fiber types experience different amounts of modal dispersion and attenuation. That's why fiber grades (OM1-OM5) exist."

6. **L10:** Add "Building on T02.L03 and T02.L02" before CD measurement section: "CD (chromatic dispersion from T02.L03) and PMD change with fiber condition over time. We measure them to..."

## Vocabulary Assumed vs Vocabulary Introduced Cross-Check

All 12 lessons properly declare `vocabulary_assumed` array with `source_lesson_id` pointers. Lesson schema is compliant. Issue is **inline prose refreshers**, not metadata structure.

## Closure

No build errors. All 12 lessons render successfully in Vite (`npm run build` = zero errors). Refresher placement is UX/pedagogy issue, not a schema issue.

=== V18 HAIKU END ===
