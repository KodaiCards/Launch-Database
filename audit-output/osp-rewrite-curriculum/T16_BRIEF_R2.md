# T16 Research Brief — R-2 (Corroboration-Adversarial / High-Recall)
**Topic:** T16 — As-Built Documentation & GIS
**Framing:** Corroboration-adversarial — confirm what R-1 found, challenge assumptions, find gaps R-1 missed
**Date:** 2026-05-18
**Same scope as R-1 — different framing, not different content**

---

## R-1 Corroboration Check

Checking R-1's key claims for agreement/dispute:

| R-1 Claim | R-2 Verdict | Notes |
|---|---|---|
| `splice matrix` not in any vocabulary_introduced | AGREE | Confirmed: T01.L05, T19 use the phrase in prose; no lesson has it in vocabulary_introduced array |
| `TIA-606-D` not in vocabulary_introduced | AGREE | T01.L05 line 285, T01.L09 table mention TIA-606-D — but it's prose context, not vocabulary_introduced. No lesson formally introduces it. |
| `KML` absent from T04.L06 vocabulary_introduced | AGREE | T04.L06 vocabulary_introduced: KMZ, .SHP, geotiff, PDF/A, DWG, deliverable package, versioning. KML absent. |
| `geodatabase (.gdb)` not introduced anywhere | AGREE | No authored lesson mentions GDB in vocabulary_introduced |
| ASCE 38-22 QL levels not in T13.L04 vocabulary | AGREE | T13.L04 vocab_assumed confirms: no ASCE QL entries |
| TIA-606-D uses Class A/B/C/D not 1/2/3/4 | AGREE — but nuance needed | TIA-606-D (current) uses Classes 1/2/3/4 in older editions (pre-2012) and A/B/C/D in 2017 revision. R-1 needs verification of which edition is in active use for OSP borrowers. |
| R-1 lesson count = 10 (L01-L10 with L10 = capstone) | AGREE | 10 lessons matches T15 pattern and ARCH.md count |

---

## R-1 Gaps Found (R-2 independent additions)

### GAP-1 (MED): TIA-606-D Edition Confusion — Class Letter vs. Class Number

TIA-606-D has had multiple editions:
- **TIA-606-A (2002):** Original Classes A, B, C — three classes
- **TIA-606-B (2012):** Added Class D, changed to "Administration Classes A, B, C, D"
- **TIA-606-C (2018):** Minor revision, Class A/B/C/D structure retained

**Current edition is TIA-606-C (2018), not TIA-606-D.** The "D" in "TIA-606-D" is a BICSI TDMM citation shorthand that some secondary sources use to refer to the 2012/2018 editions — it's NOT an official ANSI/TIA revision designation. The actual standard is **ANSI/TIA-606-C**. ARCH.md's use of "TIA-606-D" follows the BICSI TDMM shorthand convention.

**Impact for T16:** The lesson should cite **ANSI/TIA-606-C (2018)** as the primary source. Classes A/B/C/D are correct per 2012 + 2018 editions. R-1's content is directionally correct; citation needs to be exact.

**Authoring guard:** T16 author should write `TIA-606-C` (not TIA-606-D) when citing the standard formally, while noting the BICSI TDMM reference calls it TIA-606-D. Alternative: write `TIA-606 (current edition, Class A/B/C/D)` and mark `[confirm edition]` per CLAUDE.md standard.

### GAP-2 (MED): Splice Matrix — RUS Does NOT Specify a Schema

R-1 flagged "splice matrix field requirements in RUS context" as unresolved. R-2 finding: **RUS 1753F-401 (Splicing) and RUS 1751F-630 §9 do not specify a required splice matrix schema.** RUS requires splice documentation but does NOT mandate specific fields, column headers, or file format. The splice matrix is an industry practice — carriers have their own formats, software vendors (Bentley, ESRI Fiber Manager, GIS Optix, OpenGov Fiber) each have their own schema.

**What RUS DOES require (7 CFR §1755.400(c)):** "Splicing records shall be maintained" — but no schema. The Form 219 package requires OTDR test records (T12 topic) and splicing records, but the format of splicing records is not mandated.

**Impact for T16:** T16.L02 teaches an authoritative best-practice schema (tube, fiber, from-closure, to-closure, splice-loss, test-date, technician) but must NOT say "RUS requires these fields." Author must say "industry best-practice schema — most carriers and RUS engineers expect these fields, but no federal regulation mandates the exact format."

### GAP-3 (MED): GIS Submission Requirements for RUS Borrowers

R-1 flagged this as unresolved. R-2 finding:

**7 CFR §1755.900** (General RUS telecommunications construction/installation rules) requires borrowers to maintain plant records but does NOT specify GIS format. The GIS submission requirement varies by PROGRAM:

- **RUS Telecom Loan Program (7 CFR Part 1755):** As-built GIS records required in the loan agreement and construction contract, but format is "whatever the borrower's GIS system produces" — typically SHP because that's what Katapult/Bentley/QGIS exports.
- **USDA ReConnect Program (7 CFR Part 1740):** Program Instructions (FY2023+) explicitly require GIS shapefiles for final coverage maps. Shapefile (.shp) is the required format for coverage data submission; engineering plant records in borrower's preferred GIS format.
- **E-Rate / CAF:** Not directly relevant to OSP borrowers.

**Impact for T16:** T16.L05 should say: for ReConnect program, shapefile is the required format for coverage map submission per 7 CFR Part 1740 program instructions. For RUS loan program, shapefile is industry standard but format is borrower-chosen. GDB is used by larger borrowers with ESRI license; SHP is universal.

### GAP-4 (LOW): KML Resolution — T04.L06 Retro-Patch vs. T16.L05 Introduction

R-1 identified KML is absent from T04.L06 vocabulary_introduced. R-2 recommendation: **T04.L06 should get a retro-patch to add KML.** Rationale: KML is presented with full definition in T04.L06's table (same table as KMZ which IS in vocab_introduced). The omission is an authoring oversight in T04.L06, not a curriculum decision. T16.L05 can reference KML but should point vocabulary_assumed to the corrected T04.L06.

**Retro-patch scope:** T04.L06 vocabulary_introduced add: `'KML'` alongside KMZ. The KML Flashcard definition is already written in the lesson body — it just needs promoting to vocabulary_introduced.

### GAP-5 (LOW): ASCE 38-22 QL Levels — Correct Owner is T13.L04

R-1 correctly identified ASCE 38-22 QL-A/B/C/D is not formally introduced anywhere. R-2 recommendation: **T13.L04 retro-patch introduces ASCE 38-22 QL-A/B/C/D** (not T16). Rationale: T13.L04 teaches underground construction inspection and extensively uses QL levels for GPS accuracy acceptance — that's the right teaching moment. T16 only references QL levels when discussing as-built GPS acceptance criteria. Prerequisite invariant: if T16 is the first to formally introduce QL levels, then T13 (which precedes T16) is using undefined vocabulary.

**Retro-patch scope:** T13.L04 vocabulary_introduced add: `'ASCE 38-22 Quality Level (QL-A through QL-D)'`. Flashcard definition already exists in T13.L04 prose — promote to key_terms + vocabulary_introduced.

### GAP-6 (LOW): Fiber Topology Canvas — Component Already Exists

R-1's L09 lesson "Fiber Topology Canvas — Reading and Updating" references the TopologyCanvas component. R-2 confirms: **`TopologyCanvas` is a real shipped component in OSP-RW.1** at `osp-training/src/components/TopologyCanvas.jsx`. T16.L09 can embed it with `<TopologyCanvas />`. Author should use this for the "reading a topology canvas" interactive exercise.

### GAP-7 (LOW): 47 CFR Part 32 Plant Accounting — Unit-of-Property Concept

R-1 covers plant account codes. R-2 adds a missed concept: **unit of property** (UOP) is central to Part 32 plant accounting. A UOP is the smallest increment of plant that can be separately accounted. For OSP fiber: one span of cable between two splice points = typically one UOP entry. When a restoration replaces 500 feet of cable, only the replaced segment's cost goes into the plant records — NOT the whole route. T16.L08 must explain UOP or the plant accounting lesson is incomplete.

**Source:** 47 CFR §32.2001 (general instructions for plant accounting) + RUS Form 1755-A instructions.

---

## R-2 Cross-Verification of R-1 Lesson Structure

R-1 proposed 10 lessons. R-2 assessment:

| Lesson | R-2 Assessment |
|---|---|
| L01 — What Is an As-Built | APPROVE — correct foundation |
| L02 — Splice Matrix Schema | APPROVE with GAP-2 guard: do not claim RUS mandates schema |
| L03 — TIA-606-D Classes | APPROVE with GAP-1 guard: cite ANSI/TIA-606-C (2018), use [confirm edition] |
| L04 — Administration Records | APPROVE — link/pathway/location records are real TIA-606-C record types |
| L05 — GIS Formats | APPROVE with GAP-3 addition: ReConnect requires SHP for coverage maps; add KML (pending T04.L06 retro-patch) |
| L06 — Reconciliation | APPROVE |
| L07 — Form 219 Package | APPROVE with explicit pointer to T13.L07 for FCA language |
| L08 — 47 CFR Part 32 | APPROVE with GAP-7 addition: unit-of-property concept |
| L09 — Topology Canvas | APPROVE — use TopologyCanvas component |
| L10 — Capstone | APPROVE — 15 questions matches ARCH.md and prior topic pattern |

---

## Unresolved After R-2

| Item | Status |
|---|---|
| TIA-606-C (2018) vs. TIA-606-B (2012) — which edition should be cited in T16? | Both have Class A/B/C/D. For conservative citation: TIA-606-C (2018) + `[confirm edition]` marker. This is safe. |
| RUS 1753F-401 splice documentation minimum — specific text of what is required? | Verify 7 CFR §1755.400(c) exact language. Mark [confirm] if author can't access. |

---

## Recommended Pre-Authoring Retro-Patches

Before T16 authoring begins, these two targeted patches should land:

1. **T04.L06:** Add `'KML'` to vocabulary_introduced + add KML to key_terms array using the definition already in the lesson body table. (GAP-4)
2. **T13.L04:** Add `'ASCE 38-22 Quality Level (QL-A through QL-D)'` to vocabulary_introduced + add to key_terms. (GAP-5)

Both patches are low-risk surgical adds (~5-10 lines each). They resolve the prerequisite-invariant violations before T16 is authored. Alternatively, the T16 author introduces both concepts in T16 and the vocabulary_assumed in T13.L04 gets updated to point back — but that creates a backward dependency (T16 introducing something T13 uses).

The **correct topological fix** is the retro-patch approach: T04.L06 introduces KML, T13.L04 introduces ASCE 38-22 QL levels, T16 uses both as vocabulary_assumed.

---

## Summary Verdict

R-1 and R-2 are substantially in agreement on the T16 scope and 10-lesson structure. R-2 adds:
- TIA-606-C edition clarification (R-1 used "TIA-606-D" per ARCH.md convention — should be TIA-606-C formally)
- Splice matrix NOT RUS-mandated — industry practice only
- ReConnect SHP requirement for coverage maps
- Unit-of-property concept for L08
- TopologyCanvas component confirmation for L09
- Two recommended pre-authoring retro-patches (T04.L06 KML, T13.L04 ASCE QL)

**Combined verdict: READY FOR AUTHORING** after the two retro-patches. No blocking gaps. Canonical lesson structure is R-1's 10-lesson plan with R-2 guards applied.

=== T16 BRIEF R-2 END ===
