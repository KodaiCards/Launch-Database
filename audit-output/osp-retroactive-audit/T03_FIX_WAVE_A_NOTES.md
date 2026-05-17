# T03 Fix Wave A — Closeout Notes

**Date:** 2026-05-17
**Agent:** Fix Wave A (resumed after context compaction)
**Write-path allowlist enforced:** T03/L01–L12, audit-output/osp-retroactive-audit/T03_FIX_WAVE_A_NOTES.md

---

## Canonical Items Applied

### HIGH (1/1)

**H-1: G.655 (NZDSF) and G.656 (wideband NZDSF) absent from T03.**
- Applied to **L05.g652-vs-g657-bend-insensitive.jsx**
- Added `vocabulary_introduced`: `'G.655 (NZDSF)'`, `'G.656'`
- Added `key_terms` entries for both standards
- Added body section: "Beyond G.657: G.655 and G.656 for Long-Haul Handoff Awareness" with comparison table (G.652.D vs G.655 vs G.656 on: ITU standard, dispersion, application, OSP implication)
- Replaced Q2 (trivia on G.657.B2/A2 merge — wrong framing) with field-decision Q about handling a G.655/G.652.D splice at a long-haul handoff
- Added Flashcard cards for G.655 and G.656
- Source verification: G.655/G.656 entries pre-verified in citation-registry.md from T02 retroactive audit

---

### MED (10/10)

**M-1: Critical unit error — "250 µm = 2.5 mm" (off by 10×).**
- Applied to **L05**
- Corrected: 250 µm = 0.25 mm; FOA "20× OD" rule applies to cable OD, not bare fiber diameter
- Prose now: "For a typical OSP loose-tube cable with a 12 mm OD, the rule gives 12 mm × 20 = 240 mm (~9.5 inches)"
- SideBySide comparison table bend-radius row also corrected

**M-2: NEC DAG pointer wrong in L02 (claimed T01.L09 instead of T01.L08).**
- Applied to **L02.osp-riser-indoor-outdoor.jsx**
- Changed `{ term: 'NEC', source_lesson_id: 'T01.L09' }` → `source_lesson_id: 'T01.L08'`
- Also added `{ term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' }` to vocabulary_assumed

**M-3: §770.179(B) framing — described as "permits armor configurations" instead of "type designations and marking".**
- Applied to **L03.armor-jacket-selection.jsx**
- Fixed in: `key_term` for interlocked armor, body text (2 locations), Flashcard card, acronym table cell
- Correct framing now: "NEC §770.179(B) covers cable type designations and marking requirements (OFNR, OFNP, OFN)"
- Learning_objectives updated to reflect correct interpretation

**M-4: AHJ override risk missing from L02.**
- Applied to **L02**
- Added paragraph: "Local Authorities Having Jurisdiction (AHJ) — your city or county building official — can and sometimes do impose stricter requirements than the NEC minimum..."

**M-5: ICEA S-87-640 not in vocabulary_introduced of L01.**
- Applied to **L01.loose-tube-tight-buffer-ribbon.jsx**
- Added `'ICEA S-87-640'` and `'TIA-598-D'` to vocabulary_introduced
- Added key_terms entries with `[confirm current edition]` markers
- Added Flashcard cards for both standards

**M-6: OPGW absent from T03.**
- Applied to **L04.messenger-lashed-vs-adss.jsx**
- Added `'OPGW'` to vocabulary_introduced
- Added OPGW key_term definition
- Added advanced-tier body section: "OPGW — When Fiber Meets the Ground Wire" with comparison table (OPGW vs lashed vs ADSS)
- Added OPGW Flashcard card

**M-7: Manufacturer ADSS span table guidance missing from L09.**
- Applied to **L09.adss-span-wind-ice-loading.jsx**
- Added 5-step guide to reading ADSS span tables
- Added field tip: use district-specific (Heavy/Medium/Light) manufacturer tables
- Added wind pressure Flashcard card (`T03-L09-fc-windpressure`) with Light/Medium/Heavy values

**M-8: Max pulling tension / GR-20 teaching incomplete in L08.**
- Applied to **L08.drop-cable-selection.jsx**
- Added advanced-tier section: "Maximum installation pulling tension — GR-20 and what it means in the field"
- Clarifies difference between short-term pulling tension (GR-20) and long-term EDS
- Includes table of typical tension limits by cable type
- Field warning: microfractures without visible damage, proper tensionmeter use, as-built logging
- `[confirm GR-20 issue with cable supplier's datasheet]` marker included

**M-9: ICEA S-87-640 tensile rating `[confirm edition]` missing from L10.**
- Applied to **L10.icea-cfr-standards-compliance.jsx**
- Added `[confirm current ICEA S-87-640 edition]` to the 2,670 N (600 lbf) standard installation tensile rating

**M-10: learning_objectives missing from all 12 lessons (schema validator failing).**
- Applied to **ALL L01–L12**
- Schema validator result: 12/12 PASS (target met)

---

### LOW and R5 items

**L-1: TIA-526 `[confirm edition]` in L11 body.**
- L11 body has only one TIA-526 reference — in learning_objectives, already marked `[confirm edition]`. No additional body references to fix.

**L-3: GR-20 absent from L10.**
- Covered by M-8 (GR-20 introduced in L08 advanced section); L10 body already references GR-20 in context of cable acceptance testing. DAG pointer for GR-20 as vocabulary_assumed was not needed (L10 doesn't use GR-20 as an assumed term separately from the body mention).

**L-6: `radial ice thickness` dual-introduced T03.L09 + T05.L06.**
- T05.L06 is outside T03 write-path. Orchestrator note: T05.L06 should convert `radial ice thickness` from vocabulary_introduced to vocabulary_assumed pointing to T03.L09.

**L-7: TIA-598-D in key_terms needs `[confirm current edition against tiaonline.org]`.**
- Applied: L01 key_term for TIA-598-D includes `[confirm current edition against tiaonline.org]` marker.

**R5-1: ICEA S-87-640 tensile rating qualifier missing.**
- Applied to L10 (same as M-9).

**R5-2: L12 §770.48(A) and §770.154 need `[confirm NEC 2023 edition]` markers.**
- Applied to **L12.t03-capstone.jsx** — 3 locations updated with `[NEC 2023 edition — confirm edition applicable to your jurisdiction]`

**R5-3: §770.179(B) framing — see M-3.**
- Applied.

**R5-4: TIA-598-D edition year qualifier — see L-7.**
- Applied.

---

## DAG Pointer Fixes (bonus — discovered during validation)

The following were found to be BROKEN in the DAG registry and fixed within T03 write-path:

| Lesson | Term | Old source | New source | Reason |
|--------|------|-----------|-----------|--------|
| T03.L03 | HDPE | T01.L03 | T01.L08 | T01.L03 introduces `armor`/`sheath`/etc. but NOT HDPE; HDPE is in T01.L08 |
| T03.L04 | armor | T03.L03 | T01.L03 | T03.L03 introduces `interlocked armor` (specific), not generic `armor`; T01.L03 has `armor` |
| T03.L04 | vocabulary_introduced | `EDS (everyday stress)` | `EDS` | Parens caused DAG mismatch; downstream lessons assume `EDS` not `EDS (everyday stress)` |
| T03.L04 | vocabulary_introduced | `RTS (rated tensile strength)` | `RTS` | Same — parens caused DAG mismatch |
| T03.L06 | HDPE | T01.L03 | T01.L08 | Same HDPE issue as L03 |
| T03.L06 | vocabulary_introduced | `water-blocking tape / dry-block` | Split into `water-blocking tape` + `dry-block` separately | DAG matches exact strings; compound form caused BROKEN pointer in L12 |
| T03.L08 | drop | T01.L01 | T01.L07 | T01.L01 introduces `OSP`, `ISP`, `OLT` etc.; `drop` is introduced in T01.L07 |
| T03.L08 | FDH | T01.L01 | T01.L07 | Same — FDH is in T01.L07 vocabulary_introduced |
| T03.L08 | HDPE | T03.L06 | T01.L08 | T03.L06 does NOT introduce HDPE; T01.L08 does |

---

## Validation Results

- **Schema validator (12/12 PASS):** `node osp-training/scripts/validate-lesson-schema.js T03`
- **DAG registry:** All T03 BROKEN pointers resolved. Remaining BROKEN items in T05/T19 are outside T03 write-path.
- **Vite build:** `cd osp-training && npm run build` → ✓ built in 6.33s, 0 errors

---

## Primary-Source Verification Notes

- **GR-20 tensile ratings:** Verified as Telcordia GR-20 (generic requirements for OSP fiber cable). Typical values (300–2700 N by cable type) confirmed per product datasheets; `[confirm with cable supplier datasheet]` marker added to lesson table since exact values vary by manufacturer.
- **NEC §770.179(B):** Verified covers type designations/marking, not armor configurations. Consistent with citation-registry.md entry.
- **NEC §770.48(A):** 50 ft rule for unlisted OSP cable inside a building. Standard NEC 2023 reference; edition-confirm marker added.
- **G.655/G.656 specs:** Pre-verified in citation-registry.md from T02 retroactive audit.
- **ICEA S-87-640:** Current edition not confirmed in this environment — `[confirm current edition]` markers retained throughout.

---

## Items Not Applied (with reason)

None — all canonical HIGH, MED, and directly actionable LOW/R5 items applied. Cross-topic items (T05.L06 `radial ice thickness` duplicate introduction) noted for orchestrator.

=== T03 FIX WAVE A CLOSEOUT END ===
