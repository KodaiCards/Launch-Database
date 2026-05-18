# T16 Research Brief — R-1 (Primary-Source Skeptical / High-Precision)
**Topic:** T16 — As-Built Documentation & GIS
**Framing:** Primary-source first / High-precision / Skeptical of secondary descriptions
**Date:** 2026-05-18
**Prerequisites confirmed:** T01, T10, T11, T13, T15 all CLOSED
**Teaching position:** 18 of 22 (T15 → T16 → T17 → C04)

---

## Verified Claims (primary-source grounded)

| Claim | Source | Clause / Reference | Confidence |
|---|---|---|---|
| `as-built` term introduced in T01.L05 | Lesson file vocabulary_introduced grep | T01.L05 line ~vocabulary_introduced | VERIFIED |
| `RUS Form 219` term introduced in T01.L05 | Lesson file vocabulary_introduced grep | T01.L05 vocabulary_introduced | VERIFIED |
| `as-built redline` introduced in T10.L10 | Lesson file vocabulary_introduced grep | T10.L10 vocabulary_introduced | VERIFIED |
| `as-designed` introduced in T04.L08 | Lesson file vocabulary_introduced grep | T04.L08 vocabulary_introduced | VERIFIED |
| `GIS` introduced in T04.L03 | T04.L06 vocab_assumed points to T04.L03 | T04.L06 vocabulary_assumed | VERIFIED |
| `shapefile` introduced in T04.L06 | Lesson file vocabulary_introduced grep | T04.L06 vocabulary_introduced | VERIFIED |
| `KMZ` introduced in T04.L06 | T04.L06 key_terms includes KMZ | T04.L06 key_terms | VERIFIED |
| `KML` — NOT in T04.L06 vocabulary_introduced | T04.L06 vocabulary_introduced array confirmed: KMZ, .SHP, geotiff, PDF/A, DWG, deliverable package, versioning — KML absent | T04.L06 | CONFIRMED ABSENT — T16 must introduce KML (or T04.L06 needs retro-patch) |
| `47 CFR 32` introduced in T04.L07 | Lesson file vocabulary_introduced grep | T04.L07 vocabulary_introduced | VERIFIED |
| `Form 219 certification scope` introduced in T13.L07 | T13.L07 vocabulary_introduced | T13.L07 | VERIFIED |
| `post-restoration as-built` introduced in T15.L09 | T15.L09 vocabulary_introduced | T15.L09 | VERIFIED |
| `TIA-606-D` mentioned in T01.L05 prose and T01.L09 table | T01.L05 line 285; T01.L09 table | T01.L05, T01.L09 | IN PROSE ONLY — not in vocabulary_introduced; T16 must formally introduce |
| `splice matrix` mentioned in T01.L05 prose and T19 lessons | T01.L05 line 188; T19.L08, T19.L02 | Multiple lessons | IN PROSE ONLY — not in any vocabulary_introduced; T16 must formally introduce |
| `geodatabase (GDB)` — NOT in any authored lesson vocab_introduced | Grep across all T-series lessons | None found | UNVERIFIED in DAG — T16 must introduce |
| `TIA-606-D Class A/B/C/D` definition | TIA-606-D (2017) §4.1 administration classes | TIA-606-D §4.1 | Claim: A=small single-tenant, B=multi-tenant single building, C=multi-building campus, D=complex campus — standard source. NOTE: TIA-606-D uses Class A/B/C/D NOT Class 1/2/3/4. ARCH.md incorrectly says "class 1–4" at one point — correct term is "class A/B/C/D" |
| RUS borrower GIS requirement — tied to 7 CFR 1755.400 and loan/construction documents | 7 CFR 1755.400 general OSP standards; RUS loan agreements require as-built GIS | 7 CFR §1755.400 | VERIFIED at framework level; specific format requirements in loan agreement, not CFR |
| 47 CFR 32 account codes for cable plant: §32.2410 cable and wire facilities; §32.2411 poles | T04.L07 verified in prior sessions against eCFR | 47 CFR 32 §32.2410, §32.2411 | VERIFIED (T04.L07 quiz confirms §32.2210=CO-switching, §32.2410=cable) |
| Form 219 = Inspector's Certificate of Construction (federal, subject to FCA) | T13.L07 verified against 7 CFR 1755 | T13.L07; 7 CFR §1755 | VERIFIED |

---

## Unverified / Needs Tiebreaker (R-2 or Haiku ground-truth)

| Item | Uncertainty | Tiebreaker type |
|---|---|---|
| `KML` vocabulary status — mentioned in T04.L06 table/prose; unclear if in vocabulary_introduced | Check T04.L06 vocabulary_introduced array | Haiku file read |
| TIA-606-D current edition year — 2012 vs 2017 vs later revision | Multiple sources cite 2012; ARCH.md says "TIA-606-D" without year | Haiku search / R-2 |
| RUS Form 219 field list — exact fields on the form (signatures required, attachments, checkboxes) | T13.L07 describes it conceptually but field-level detail not confirmed | R-2 primary-source |
| Geodatabase (.gdb) acceptance in RUS fiber projects — is GDB actually used or is shapefile the dominant format? | T04.L06 doesn't mention GDB; ARCH.md lists it | R-2 field-practice |
| ASCE 38-22 QL levels already introduced — T13.L04 introduces `clamp-on ground resistance` not QL; check where QL-A/B/C/D is in vocab | T13.L04 text uses QL levels but vocab_introduced only has clamp-on procedure | Haiku file read T13.L04 vocab_introduced |
| GIS record submission timing for RUS borrowers — at close-out with Form 219, or separately? | Not confirmed in 7 CFR 1755 text reviewed | R-2 primary-source |

---

## DAG Vocabulary Check

### T16 MUST INTRODUCE (not in any prior vocabulary_introduced)

| Term | Status | Notes |
|---|---|---|
| `splice matrix` | NOT in any vocabulary_introduced | Appears in T01.L05 prose, T19 prose — but never formally introduced as vocabulary. T16.L02 is the correct introduction point per ARCH.md |
| `TIA-606-D` | NOT in vocabulary_introduced | Mentioned in T01 prose/table but not introduced. T16.L01 introduces the standard. |
| `administration class (A/B/C/D)` | NOT introduced anywhere | T16.L03 or T16.L04 introduces TIA-606-D class system |
| `geodatabase (.gdb)` | NOT in any vocabulary | T16.L05 introduces alongside SHP comparison |
| `fiber record (administration record)` | NOT introduced | Core TIA-606-D concept — introduced in T16 |
| `link record` | NOT introduced | TIA-606-D §4.2 — a record documenting one transmission path |
| `reconciliation (as-built vs. as-designed)` | NOT introduced | T10.L10 introduces redline process; reconciliation is the formal close-out comparison |

### T16 USES (already in DAG from prior topics)

| Term | Introduced in | Notes |
|---|---|---|
| `as-built` | T01.L05 | ✓ General concept |
| `as-built redline` | T10.L10 | ✓ Markup process |
| `as-designed` | T04.L08 | ✓ Design output |
| `GIS` | T04.L03 | ✓ Platform concept |
| `shapefile (.shp/.shx/.dbf/.prj)` | T04.L06 | ✓ Format detail |
| `KMZ` | T04.L06 | ✓ Compressed format |
| `RUS Form 219` | T01.L05 | ✓ Referenced again in T16 context |
| `Form 219 certification scope` | T13.L07 | ✓ Inspector sign-off detail |
| `47 CFR 32` | T04.L07 | ✓ Account code framework |
| `post-restoration as-built` | T15.L09 | ✓ Restoration-specific as-built |
| `deviation log` | T10.L10 | ✓ Source for redline |
| `DFR (Daily Field Report)` | T10.L10 | ✓ Construction documentation |
| `splice case` | T01.L04 | ✓ Physical enclosure |
| `buffer tube` | T02 or T03 | ✓ Fiber container |

---

## Proposed 10-Lesson Structure

| Lesson | Title | Scope | Est. Minutes |
|---|---|---|---|
| L01 | What Is an As-Built and Why It Matters | Definition of as-built vs. as-designed, who owns it, why it's a legal record, RUS requirements, the 811 consequence (811 call centers pull as-built records), formal introduction of TIA-606-D as the administration standard | 25 |
| L02 | The Splice Matrix — Schema and Purpose | What a splice matrix is, why every fiber needs an entry, field layout (tube, fiber, from-closure, to-closure, splice-loss, test-date, technician, notes), CSV vs. Excel vs. CMMS formats, relationship to fiber topology canvas | 30 |
| L03 | TIA-606-D Administration Classes | Classes A/B/C/D — what triggers each, what records are REQUIRED vs. OPTIONAL per class, how a rural telecom borrower (RUS) falls into Class B or C, label convention for cables, spaces, pathways, and terminations | 30 |
| L04 | Administration Records — Links, Pathways, Locations | TIA-606-D record types: link record, pathway record, location record, media record — what each documents, worked example for a 144F feeder run with 3 inline closures | 25 |
| L05 | GIS Formats for As-Built Delivery | SHP vs. GDB vs. KML: when each is appropriate, RUS project GIS requirements, what goes in each layer (cable center-line, splice point, handhole/manhole, pedestal, address point), coordinate system requirements (NAD83 datum, State Plane vs. geographic) | 30 |
| L06 | Reconciling As-Built to As-Designed | Redline-to-final-drawing conversion process, what discrepancies must trigger a revised design drawing vs. field notation only, sign-off chain (field → GIS tech → engineer → borrower file), RUS audit exposure from incomplete reconciliation | 25 |
| L07 | Form 219 Documentation Package — Final Close-Out | Assembling the complete close-out package: Form 219 + Form 565 set + OTDR trace archive (.sor files) + splice matrix + as-built GIS export + material certifications. What the GFR checks. FCA exposure for incomplete package. | 30 |
| L08 | 47 CFR Part 32 — Plant Accounting and As-Built Records | How as-built records tie to plant accounts: §32.2410 cable plant, §32.2411 poles — unit of property, how the as-built feeds the construction cost ledger (Form 1755-A), record-retention obligations (47 CFR Part 42), audit trail from field work to balance sheet | 25 |
| L09 | Fiber Topology Canvas — Reading and Updating | What a fiber topology canvas (schematic splice diagram) shows vs. what the GIS map shows, how to read a cable schedule entry, how to mark a restored section on the topology canvas, notation conventions for in-service vs. dark vs. test fibers | 25 |
| L10 | T16 Capstone Quiz | 15-question integrative quiz covering as-built assembly, splice matrix schema, TIA-606-D classes, GIS format selection, reconciliation process, Form 219 package, and 47 CFR 32 plant accounting. | 30 |

**Total estimated time:** ~275 minutes (~4.6 hours)

---

## Key Standards Anchor

| Standard | Scope in T16 | Edition / Citation |
|---|---|---|
| TIA-606-D | Administration classes A/B/C/D, record types, label conventions | TIA-606-D (confirm edition — 2012 or 2017 revision) |
| RUS Form 219 | Inspector's Certificate of Construction — fields, attachments, FCA exposure | 7 CFR §1755; Form 219 itself |
| RUS Form 565 | Inspector's Daily Report — ties to as-built documentation | RUS/USDA form; 7 CFR §1755.400 |
| RUS Form 1755-A | Construction cost ledger — ties as-built to plant accounting | 7 CFR §1755 |
| 47 CFR Part 32 | Plant account codes (§32.2410, §32.2411, §32.2230); retention obligation (§32.27) | Current eCFR |
| 47 CFR Part 42 | Record-retention schedule for plant records | Current eCFR |
| 7 CFR §1755.400 | RUS OSP construction standards — as-built and record requirements for borrowers | Current CFR |
| ASCE 38-22 | Quality Level definitions for subsurface utility data (QL-A/B/C/D) — applies to as-built GPS accuracy | ASCE 38-22 |
| OGC KML 2.3 | Open Geospatial Consortium KML standard — governs .kml/.kmz format | OGC KML 2.3 |
| ESRI Shapefile Technical Description (1998) | Shapefile format specification (.shp/.shx/.dbf) | ESRI 1998 white paper |
| Telcordia GR-196-CORE | OTDR calibration requirement — ties to .sor archive in Form 219 package | GR-196-CORE §5.5 |

---

## Authoring Guards (common errors to avoid)

1. **TIA-606-D class numbering:** Standards uses "Class A/B/C/D" NOT "Class 1/2/3/4". ARCH.md has one reference to "class 1–4" which is wrong. Author must use A/B/C/D throughout.

2. **RUS Form 219 vs. Form 553a confusion:** Form 219 = Inspector's Certificate (inspector signs). Form 553a = Contractor's certification (contractor signs). Both required before GFR close-out. Do NOT conflate — T13.L07 has the authoritative explanation.

3. **Splice matrix is NOT a TIA standard deliverable.** TIA-606-D covers administration records for cable/pathway/location/termination — it does not define a "splice matrix" format. The splice matrix is an industry/carrier practice format. Author must not claim a TIA standard governs splice matrix schema.

4. **GDB vs. SHP accuracy claim:** File geodatabase (.gdb) does NOT have inherently higher accuracy than shapefile — both store coordinates identically. GDB's advantage is multi-layer storage and support for longer field names (shapefile field name cap is 10 characters). Author must not say GDB is "more accurate."

5. **47 CFR Part 32 account numbers — do not invent:** §32.2410 = Cable and Wire Facilities (confirmed in T04.L07). §32.2411 = Poles (confirmed). §32.2210 = Central office—switching (NOT cable — common mistake). §32.2230 = Plant Under Construction. §32.2420 does NOT exist. Author uses only T04.L07 verified account codes.

6. **KML vs. KMZ:** KML is the uncompressed XML. KMZ is a ZIP archive containing KML + any embedded images. For field crew use, KMZ is preferred (single file, opens in Google Earth Mobile). For GIS import, KML may be more compatible. Author must distinguish — introduced in T04.L06.

7. **As-built GPS accuracy — ASCE 38-22 QL levels:** QL-A (physical verification — potholing) is required for buried plant on road crossings per T13.L04. Standard GPS (QL-B/C) acceptable for open-field non-crossing segments. Do NOT say all as-built GPS must be QL-A — that is impossibly expensive and is not required.

8. **Form 219 FCA exposure (31 USC §3729):** T13.L07 has the authoritative language. T16.L07 cross-references it but does NOT re-derive the FCA exposure analysis — defer to T13.L07 and reference only.

---

## Unresolved Questions for R-2

1. **TIA-606-D edition year** — 2012 is widely cited; 2017 revision may exist. R-2 should verify the current edition number that OSP borrowers would reference. If revision exists, note whether Class A/B/C/D structure changed.

2. **RUS GIS submission format** — Is SHP specifically required in RUS loan/grant agreements, or is it "any GIS-compatible format"? Some RUS fiber grant programs (USDA ReConnect) may have specific GIS data standards. R-2 should check 7 CFR 1755 and USDA ReConnect program instructions.

3. **Splice matrix field requirements in RUS context** — Does any RUS bulletin specify required fields for a splice record? Or is it purely industry practice? R-2 should check RUS 1753F-401 (splicing) and 1751F-630 §9 (testing/records).

4. **`KML` — CONFIRMED ABSENT from T04.L06 vocabulary_introduced** — T04.L06 vocabulary_introduced array contains: KMZ, .SHP, geotiff, PDF/A, DWG, deliverable package, versioning — KML is NOT listed. KML is mentioned in table and prose only. R-2 should recommend: (a) T04.L06 retro-patch adds KML to vocabulary_introduced, OR (b) T16.L05 formally introduces KML. Option (a) is preferred to keep GIS formats consolidated in T04.L06.

5. **ASCE 38-22 QL levels — CONFIRMED NOT in T13.L04 vocabulary_introduced or vocabulary_assumed** — T13.L04 vocabulary_assumed confirmed: inspector, inspection segment, acceptance criteria, Form 565, confined space, proctor density, ASTM D1557, depth probe, cover card, Call-811, ground resistance 25Ω, MUTCD, PPE. No ASCE QL entry anywhere. Used in T13.L04 prose only. R-2 recommends: (a) T13.L04 retro-patch adds ASCE 38-22 QL-A/B/C/D to vocabulary_introduced, OR (b) T16.L05 introduces QL-A/B/C/D as it covers GIS accuracy for as-built records. Option (b) may be correct teaching sequence since as-built GPS precision is T16 topic.

---

## Summary for Author

T16 is an integration topic: it ties together the as-built record created during T10 construction (redlines), the splice data created during T11 splicing, the test data from T12, the inspection records from T13, and the emergency as-built from T15. The author must:
- Formally introduce TIA-606-D (classes A/B/C/D) and splice matrix schema — neither is in any prior vocabulary_introduced
- Introduce geodatabase (.gdb) format alongside shapefile — GDB not previously introduced
- Cross-reference upstream terms with explicit `vocabulary_assumed` entries for all introduced prior terms
- NOT re-derive Form 219 FCA exposure (T13.L07 owns that)
- Ensure L09 (fiber topology canvas) ties to TopologyCanvas component from OSP-RW.1

Anchor standards: TIA-606-D (admin classes), 7 CFR 1755 (RUS records), 47 CFR 32 (plant accounting). All splice matrix schema content is industry practice, not a single published standard.

=== T16 BRIEF R-1 END ===
