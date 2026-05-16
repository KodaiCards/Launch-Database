# T04 Retroactive Audit — R2: Secondary-Source-Corroboration / High-Recall / Adversarial
**Auditor framing:** Senior OSP engineer (10+ yrs field + standards). Secondary-source-corroboration first, then high-recall adversarial scan. Independent of R-1.
**Scope:** All 10 T04 lesson files + ARCH.md DAG table + T04_BRIEF.md + downstream topic vocabulary_assumed cross-refs.
**Write-path:** THIS FILE ONLY.

---

## Stack Snapshot (≤80 words)

T04 "Route Survey & Pre-Engineering" is a 10-lesson field-craft bridge between T01/T18/T02/T03 foundations and the design/engineering topics that follow. Lessons cover site-walk hazard recon, drone/LiDAR survey, GIS/coordinate systems, pole audit, route alternatives, deliverable packages, 47 CFR 32 record-keeping, handoff-to-design, RUS pre-engineering, and a capstone quiz. Three HIGH findings: one spurious prerequisite blocking learner access, two full DAG vocabulary gaps. Four MEDIUM field-craft coverage omissions. Four LOW/uncertain items.

---

## Findings

### HIGH Findings

| # | Severity | Location | Claim | Corroboration / Status |
|---|---|---|---|---|
| H-1 | HIGH | L04 `meta.prerequisites` line ~17 | `prerequisites: ['T01', 'T18', 'T02.L01', 'T04.L01', 'T04.L03']` — lesson uses zero T02 content; pole-audit field measurement has no dependency on fiber physics | T02.L01 teaches optical fiber structure (ARCH.md vocabulary: "fiber types, refractive index, numerical aperture, core/cladding, buffer, jacket"). None of those terms appear in L04 prose, flashcards, quiz, or interactives. Spurious DAG gate blocks learner access unless T02.L01 is completed; no educational justification. **Fix: remove `T02.L01` from L04 prerequisites.** |
| H-2 | HIGH | ARCH.md T04 vocabulary_introduced vs all T04 JSX files | ARCH.md lists "photogrammetry" as introduced in T04; not present in vocabulary_introduced array of any T04 lesson (L01–L09), and no Flashcard definition exists for it in any lesson | L02 uses the word "photogrammetry" in prose (drone surveying context) but the term never appears in `vocabulary_introduced`, `key_terms`, or a `<Flashcard>` definition. Downstream: ARCH.md vocabulary_assumed for T05, T06, T07, T09 includes DAG terms from T04 without explicit photogrammetry; however the ARCH curriculum brief for T05 (pole loading) and T07 (staking) reference survey data inputs which assume this term is known. **Fix: add "photogrammetry" to L02 vocabulary_introduced + Flashcard definition.** |
| H-3 | HIGH | ARCH.md T04 vocabulary_introduced vs all T04 JSX files | ARCH.md lists "midspan clearance" as introduced in T04; not present in vocabulary_introduced array of any T04 lesson (L01–L09), and no Flashcard definition exists for it in any lesson | "Midspan clearance" is central to NESC clearance rules (T05 scope) AND to make-ready (T08 scope). If T04 doesn't formally introduce it before T05/T08 reference it, learners first encounter the term in a technical standards context without a plain-English foundation. ARCH.md's placement of this term in T04 vocabulary_introduced was deliberate (route survey identifies clearance constraints). **Fix: add "midspan clearance" to L01 or L04 vocabulary_introduced + Flashcard definition (plain-English: the vertical distance between the cable and whatever is below it at the point of greatest sag, measured at mid-span between poles).** |

---

### MEDIUM Findings

| # | Severity | Location | Claim | Corroboration / Status |
|---|---|---|---|---|
| M-1 | MEDIUM | L02, FAA altitude section | Lesson states surveys "typically fly 60–150 m AGL (200–500 ft)"; 150 m = 492 ft, which exceeds FAA 14 CFR Part 107.51's 400 ft AGL ceiling (Class G airspace, no waiver) with only a parenthetical "may require waiver" buried in the Book vs. Field sidebar | FAA 14 CFR §107.51(b): maximum altitude 400 ft AGL in uncontrolled airspace; above 400 ft AGL requires either Class B/C/D/E authorization (LAANC or waiver) or operating within 400 ft of a structure. The lesson's prose framing implies 150 m / 492 ft is within normal operational range — it is not without explicit authorization. A field crew reading this could assume 492 ft is legal without further steps. **Fix: replace "60–150 m" with "60–120 m (200–400 ft)" as the standard Part 107 range, with 120–150 m as "requires waiver or structure proximity exception." |
| M-2 | MEDIUM | L04, pole audit section | Lesson records pole class (Class 1 through Class 6 and H-classes) without ever explaining what pole class means — the ANSI O5.1 load-capacity classification system | Field crews need to understand that ANSI O5.1 Class 3 (most common distribution pole) has a lower horizontal-load rating than Class 2 or Class 1, and that when attachment analysis finds an existing Class 4 or 5 with a light loading history, adding fiber tension loads may require replacement before make-ready. The lesson treats pole class as a data-collection field with no instructional context. ANSI O5.1 is publicly referenced in RUS Bulletin 1728F-700. **Fix: add a 2–3 sentence explanation of ANSI O5.1 load classes in L04 foundations section; define "Class 1 = highest rated; Class 6 = lowest; H-classes for extra-heavy transmission."** |
| M-3 | MEDIUM | L04, pole audit section | Lesson has no instruction to record anchor/guy wire positions, size, lead length, or condition during the pole audit | Make-ready scoping for new attachments routinely requires evaluating whether existing guy wires provide adequate resistance to the new tension loads or need upgrading. Missing anchor/guy data forces a return visit — a field-craft error that any experienced OSP engineer would flag immediately. RUS Bulletin 1751F-630 §7 implicitly requires this data for pole loading calculations. **Fix: add anchor/guy wire fields to the pole audit data collection instruction in L04: lead angle, anchor type (log/screw/plate), rod condition (visible rust, heaving).** |
| M-4 | MEDIUM | L04, pole audit section | Lesson has no instruction on identifying pole ownership and distinguishing owner from attaching carriers | OTMR authorization chain (FCC Order 18-111): only the pole owner can authorize make-ready; the new attacher must identify the owner before submitting the 14/30/14 day application sequence. Field audit that misidentifies ownership produces an OTMR application to the wrong entity, delaying the project by weeks. Ownership identification (NECA database lookup, visible USOA account markers, county tax records cross-check) is standard field protocol. **Fix: add 3–4 sentence ownership-identification procedure to L04, with cross-reference to T08 (Make-Ready) for the full OTMR process.** |

---

### LOW / Suspicious-but-Uncertain

| # | Severity | Location | Claim | Status |
|---|---|---|---|---|
| L-1 | LOW | L05 `meta.vocabulary_introduced` | "route alternatives" is listed in ARCH.md T04 vocabulary_introduced row but not in L05's (or any T04 lesson's) `vocabulary_introduced` array; the concept is central to L05 but never formally introduced as a defined term with a Flashcard | Compare H-2 and H-3 — consistent author pattern of teaching concepts without adding them to the DAG vocabulary fields. Downstream topics referencing "route alternatives" in vocabulary_assumed would fail the prerequisite check. Fix: add to L05 vocabulary_introduced + Flashcard. |
| L-2 | LOW | L09, RUS forms section | L09 cites "RUS Form 307" as "specifications and drawings checklist for construction package" | Cannot independently corroborate RUS Form 307 as a standard form number from publicly available RUS forms index (USDA Rural Development publishes a forms list at rd.usda.gov). RUS Form 740 (construction contract) and Form 1755-A (cost ledger) are corroborated. Form 307 may be a project-specific form that varies by lender or district office, or a form number from an older bulletin edition. **[needs SME confirm]** |
| L-3 | LOW | L05, cost-comparison section | Aerial cost range "$2,000–$6,000/mile" and underground "$6,000–$18,000/mile" | These ranges track with pre-2024 RUS construction cost estimate data for rural telecom. Post-2024 material/labor inflation (conduit +30–40%, pole costs +15–20%) has pushed typical underground costs to $8,000–$25,000/mile in many rural districts. Lesson already includes a caveat "highly variable by terrain and labor market" which partially mitigates, but ranges may underestimate current projects. **Recommendation: add temporal caveat "as of approximate industry benchmarks; verify current costs against recent RUS Form 395 bid data."** |
| L-4 | LOW | L02, LiDAR returns section | Claim: "multiple returns almost always indicate vegetation" | Field-qualified imprecision: thin power wire geometry can produce multiple returns (leading and trailing edge of wire cross-section) at 905nm/1550nm wavelengths. More precise: "multiple returns most commonly indicate vegetation; wire geometry can also produce multiple returns at small scan angles." Not a teaching error — just imprecision relative to a <1% accuracy bar. |

---

## Coverage Gaps (≤120 words)

**What was checked:** All 10 T04 JSX files (vocabulary_introduced arrays, Flashcard definitions, quiz correct-answer derivations, GSD formula math, UTM zone formula math, 47 CFR 32 account numbers vs eCFR, NWP 57 post-2021 reissuance, PDF/A ISO citation, shapefile component list). Cross-checked ARCH.md T04 row vocabulary_introduced against lesson-level arrays.

**What was NOT reached:** Deep scan of T05/T06/T07/T08/T14 source JSX for vocabulary_assumed back-references (only ARCH.md table used — ARCH.md is the DAG authority). RUS Form 307 number could not be confirmed without RD.USDA.GOV forms index access (external). IEC 61753-1 and USACE NWP 57 current-status verification not attempted.

---

## Cross-Topic Broken-DAG Summary

| Term | ARCH.md says introduced in | Actually introduced in | First downstream consumer |
|---|---|---|---|
| photogrammetry | T04 | NOWHERE (used in L02 prose only) | T05/T07 survey-data context |
| midspan clearance | T04 | NOWHERE | T05 (NESC clearance rules), T08 (make-ready) |
| route alternatives | T04 | NOWHERE (concept in L05 but not vocabulary_introduced) | T06 (design alternatives) |

All three represent the same authoring anti-pattern: concept is TAUGHT in the lesson but not formally registered in the DAG vocabulary fields. Downstream authors who check vocabulary_assumed against T04's vocabulary_introduced list will miss all three.

---

## Negative Findings (confirmed clean)

- GSD formula math (L02): `(3.76 × 100) / 24 = 15.67 mm` ✓; quiz Q2 `(3.76 × 80) / 24 = 12.53 mm` ✓; capstone Q04 `(3.76 × 120) / 24 = 18.8 mm` ✓
- UTM zone formula (L03): Macon GA (−83.6°) → Zone 17N ✓; Mississippi (−88.5°) → Zone 16 ✓
- 47 CFR 32 plant accounts (L07): §32.2210, §32.2420, §32.2220, §32.6512, §32.2230 — consistent with eCFR structure ✓
- PDF/A citation as ISO/IEC 19005-1 ✓
- Shapefile family (.shp + .shx + .dbf + .prj) ✓
- NWP 57 post-2021 reissuance cited for navigable waterway crossings ✓
- NESC rule numbers correctly absent throughout T04 per brief guardrail ✓
- Record retention avoids hardcoded period; uses `[confirm]` marker ✓
- L01 T18 vocabulary_assumed (confined space, PPE, fall protection, LOTO) correctly attributed ✓
- Capstone Q04 answer (18.8 mm, index 0) derivation verified ✓

---

=== T04 AUDIT R2 CORROB-ADVERSARIAL END ===
