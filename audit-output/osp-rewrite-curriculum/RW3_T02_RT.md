# OSP-RW.3 T02 Fiber Physics Template — Red Team Verification

**Verifier:** OSP-RW.3 RT (read-only)
**Date:** 2026-05-15
**Branch:** `main`
**Scope:** 12 lesson files at `osp-training/src/lessons/T02/`

---

## Stack snapshot (≤80 words)

**YELLOW** — T02 content is excellent (technically rigorous, voice is right, math is clean, all SHAs verified real) but two issues block final lock: (1) `lessonFileIndex` in `course-catalog.js` has all T02 entries commented out — lessons are unreachable via SPA routing at runtime; (2) `schema.md` documents `imageUrl` for AnnotatedDiagram but the component and all lessons correctly use `src` — schema doc is wrong. Patch both before declaring T02 locked.

**Template suitability:** CONDITIONAL — content is excellent and the structural patterns are replicable, but the routing wire-up omission must not carry forward to OSP-RW.4/5.

---

## Axis 1: Schema compliance (12 lessons)

| Lesson | Default export | `meta` present | All required fields | `LessonLayout` | Tier sections | Per-lesson Quiz | Correct import paths |
|---|---|---|---|---|---|---|---|
| L01 why-light | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (4Q) | ✓ |
| L02 attenuation | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (4Q) | ✓ |
| L03 dispersion | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (4Q) | ✓ |
| L04 macrobend | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L05 decibels | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (4Q) | ✓ |
| L06 link-budget | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L07 wavelengths | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L08 smf-vs-mmf | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (4Q) | ✓ |
| L09 PMD | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L10 characterization | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L11 field-vs-book | ✓ | ✓ | ✓ | ✓ | F+W+A | ✓ (3Q) | ✓ |
| L12 capstone-quiz | ✓ | ✓ | ✓ | ✓ | F only | IS a Quiz (20Q) | ✓ |

**Notes:**
- All `meta` objects contain: `id`, `course_id`, `title`, `order`, `lesson_type`, `prerequisites`, `vocabulary_introduced`, `vocabulary_assumed`, `estimated_minutes`. All required fields present.
- `lesson_type` values are correct: L01=`foundation`, L02-L08=`working`, L09=`advanced`, L10-L11=`working`, L12=`capstone-quiz`. Matches ARCH.md Section 4.
- Primitive imports all use the `../../components/primitives/` path as required.
- **One doc/code discrepancy (not a lesson error):** `schema.md` table (line 194) documents `AnnotatedDiagram` required prop as `imageUrl`. The actual component (`AnnotatedDiagram.jsx`) uses `src`. All T02 lessons correctly pass `src=` — they match the component, not the doc. The schema.md is wrong. This is a LOW doc-only finding.

---

## Axis 2: Prereq invariant (CRITICAL)

Sampled: L02, L05, L07, L08, L09, L11

**L02 (Attenuation):**
Terms used: `attenuation`, `dB/km`, `total internal reflection`, `core`, `cladding`, `SMF`, `fiber`.
- `attenuation`, `dB/km` → `vocabulary_introduced` ✓
- `total internal reflection`, `core`, `cladding` → `vocabulary_assumed` from T02.L01 ✓
- `SMF` → `vocabulary_assumed` from T01.L08 ✓
- `fiber` → `vocabulary_assumed` from T01.L03 ✓
**Result: PASS**

**L05 (Decibels):**
Terms used: `dB`, `dBm`, `logarithm`, `attenuation`, `dB/km`, `SMF`, `loss budget`, `optical power`.
- `dB`, `dBm`, `logarithm`, `optical power`, `loss budget` → `vocabulary_introduced` ✓
- `attenuation`, `dB/km` → assumed from T02.L02 ✓
- `SMF` → assumed from T01.L08 ✓
- Also uses the terms `fiber`, `connector` and `splice` without assumed listing — but these are pre-OSP-Fundamentals terms appropriate for T01.L03 origin, and `fiber`/`connector` appear in vocabulary assumed under other lessons. Minor loose end, not a rule violation.
**Result: PASS (minor observation)**

**L07 (Wavelength Windows):**
Terms used: `wavelength`, `attenuation`, `dispersion`, `chromatic dispersion`, `zero-dispersion wavelength`, `macrobend`, `dB`, `SMF`, `MMF`, `OLT`, `ONT`, `WDM`, `CWDM`, `DWDM`, `PON`, `OTDR`.
- `wavelength window`, `O-band`, `C-band`, `L-band`, `CWDM`, `DWDM`, `WDM`, `PON` → `vocabulary_introduced` ✓
- `attenuation` → assumed from T02.L02 ✓
- `dispersion`, `chromatic dispersion`, `zero-dispersion wavelength` → assumed from T02.L03 ✓
- `macrobend` → assumed from T02.L04 ✓
- `dB` → assumed from T02.L05 ✓
- `SMF`, `MMF` → assumed from T01.L08 ✓
- `OLT`, `ONT` → assumed from T01.L01 ✓
- `OTDR` → **used in lesson body and acronym table without being in `vocabulary_introduced` or `vocabulary_assumed`**. OTDR is introduced as a forward reference ("covered in T12") which is appropriate content-wise, but technically violates the prereq invariant since it appears in the lesson body.
**Finding:** FINDING #3 (LOW) — `OTDR` used in L07 without prereq listing; acceptable as a forward reference but should be in `vocabulary_assumed` with `source_lesson_id: null` or a forward-reference marker.

**L08 (SMF vs MMF):**
Terms used: `SMF`, `MMF`, `total internal reflection`, `NA`, `modal dispersion`, `attenuation`, `wavelength window`, `OM1-5`, `OS2`, `reach table`, `laser-optimized MMF`, `core diameter`, `cladding diameter`.
- `OM1-5`, `OS2`, `reach table`, `laser-optimized MMF` → `vocabulary_introduced` ✓
- `SMF`, `MMF` → assumed from T01.L08 ✓
- `total internal reflection`, `NA` → assumed from T02.L01 ✓
- `modal dispersion` → assumed from T02.L03 ✓
- `attenuation` → assumed from T02.L02 ✓
- `wavelength window` → assumed from T02.L07 ✓
**Result: PASS**

**L09 (PMD):**
Terms used: `PMD`, `DGD`, `SOPMD`, `birefringence`, `polarization`, `ps/√km`, `PMD-limited span`, `chromatic dispersion`, `dispersion`, `SMF`, `dB`.
- `DGD`, `SOPMD`, `PMD-limited span`, `ps/√km`, `birefringence`, `polarization` → `vocabulary_introduced` ✓
- `dispersion`, `chromatic dispersion`, `PMD`, `ps/(nm·km)` → assumed from T02.L03 ✓
- `SMF` → assumed from T01.L08 ✓
- `dB` → assumed from T02.L05 ✓
**Result: PASS**

**L11 (Field vs Book):**
Terms used: `temperature coefficient`, `aging loss`, `bend-insensitive SMF`, `field gotcha`, `attenuation`, `dB/km`, `macrobend`, `microbend`, `link budget`, `optical headroom`, `safety margin`, `G.657`, `SMF`.
- `temperature coefficient`, `aging loss`, `bend-insensitive SMF`, `field gotcha` → `vocabulary_introduced` ✓
- `attenuation`, `dB/km` → assumed from T02.L02 ✓
- `macrobend`, `microbend` → assumed from T02.L04 ✓
- `link budget`, `optical headroom`, `safety margin` → assumed from T02.L06 ✓
- `G.657` → assumed from T02.L04 ✓
- `SMF` → assumed from T01.L08 ✓
**Result: PASS**

**T01.L08 placeholder discipline:**
T01 does not yet exist. L02, L03, L05, L07, L08, L09 all reference `SMF`/`MMF`/`fiber` as assumed from `T01.L08` and `T01.L03`. These are genuinely pre-OSP-Fundamentals concepts (SMF, MMF, basic cable anatomy) — the T01 pointers are appropriate. Authors did NOT lean on T01 for things that should have been introduced in T02.
**Result: T01 placeholder discipline PASS**

---

## Axis 3: Training-voice rules

**AI reference scan:** Zero hits across all 12 files. No "AI", "Claude", "LLM", "language model", "generated by", or "assistant" references found in lesson content.

**L05 (dB math):**
- Plain-English intro in Foundations: ✓ ("You've heard the word 'decibel'...")
- Acronyms defined on first use: ✓ (explicit acronym table)
- Formula plain-English description: ✓ ("Loss in dB = 10 × log₁₀(P_out / P_in)" preceded by "here's the good news: you don't need to understand logarithms from scratch...")
- Every variable defined with units: ✓ (P_out, P_in, log₁₀ all defined)
- Every algebra step shown: ✓ (Examples 1 and 2 show every substitution step)
- Worked numerical example: ✓ (2 mW → dBm, −28 dBm → µW, and link budget table)
- Sanity-check sentence: ✓ ("2 mW ≈ +3.0 dBm ✓ (matches our '3 dB = double' rule)")
- Real-world analogies: ✓ (speaker loudness, cell signal bars referenced)
**Result: PASS**

**L06 (Link Budget):**
- Plain-English intro: ✓ ("A link budget is the central calculation that answers the question: 'Will this fiber connection actually work?'")
- Road-trip budget analogy: ✓ and effective
- Step-by-step worked example: ✓ (3 numbered steps with arithmetic shown)
- Sanity check: ✓ ("17.4 dB of headroom is excellent")
- Book vs Field callout: ✓ with concrete distinction
**Result: PASS**

**L11 (Field vs Book):**
- Both textbook standard AND field practice presented: ✓ — the lesson's structure IS the comparison (6-item ordered troubleshooting checklist vs book "test everything first")
- Clear distinction between book and field: ✓ (dedicated Book vs. Field amber callout box)
- Risk-of-confusion identified: ✓ (each checklist item explains why crews default to cheaper-to-check items first)
**Result: PASS (canonical Book vs Field lesson works)**

---

## Axis 4: Interactivity

| Lesson | Primitives used | Woven into content (not all-at-end)? | Per-lesson Quiz? | Items in Quiz |
|---|---|---|---|---|
| L01 | AnnotatedDiagram, Quiz | AnnotatedDiagram after Advanced; Quiz at end | ✓ | 4 |
| L02 | WorkedExample, Quiz | WorkedExample after Advanced; Quiz at end | ✓ | 4 |
| L03 | Quiz | Quiz at end | ✓ | 4 |
| L04 | AnnotatedDiagram, BranchingScenario, Quiz | All after Advanced tier | ✓ | 3 |
| L05 | WorkedExample, Quiz | WorkedExample before Quiz | ✓ | 4 |
| L06 | LinkBudgetCalculator, WorkedExample, Quiz | Both calculators before Quiz | ✓ | 3 |
| L07 | AnnotatedDiagram, Quiz | AnnotatedDiagram before Quiz | ✓ | 3 |
| L08 | SideBySide, Quiz | SideBySide before Quiz | ✓ | 4 |
| L09 | Quiz | Quiz at end | ✓ | 3 |
| L10 | Quiz | Quiz at end | ✓ | 3 |
| L11 | BranchingScenario, Quiz | BranchingScenario before Quiz | ✓ | 3 |
| L12 | WorkedExample, Quiz | WorkedExample before Quiz | ✓ (IS the quiz) | 20 |

**Observations:**
- L03 and L09 and L10 use only Quiz (no diagrams/calculators/scenarios). The spec says "2-3 primitives WOVEN INTO content." L03, L09, and L10 each have only one interactive primitive (the Quiz). This is a MEDIUM finding.
- All primitives are imported via correct default-import paths. `SideBySide` and `BranchingScenario` correctly identified and imported.
- Capstone L12: 20 questions (spec says 15-25) ✓. Pre-capstone WorkedExample is excellent — integrates the whole budget methodology before the quiz.
- `BranchingScenario` `scenarioId` values are unique per the convention: `T02-L04-scenario-1` and `T02-L11-scenario-1` — correctly namespaced, no state bleed risk.
- Quiz `mode="multiple-choice"` is used universally even when questions contain `dragdrop` type items. Quiz.jsx line 52 normalizes `'dragdrop'` → `'drag-match'` internally, so this is safe, but the lesson author could also pass `mode="drag-match"` as the primary mode. Not a bug, but a style inconsistency.

---

## Axis 5: Source content fidelity

**Migration comments present:** All 12 files open with a `// Migrated from...` or `// Net-new` comment. Examples:
- L01: `// Migrated from M01 §1.1 (wavelength intro rewritten; TIR and core/cladding content is net-new)`
- L02: `// Migrated from M01 §1.2 (attenuation table + book/field callouts preserved; expanded with WorkedExample)`
- L09, L10, L11: `// Net-new content`

**Migration discipline:** Consistent with ARCH.md Section 5 migration manifest. All claimed source sections match ARCH.md (M01 §1.1-§1.7, with §1.5 flagged as B-grade → full rewrite in L05, and §1.6+§1.7 merged into L06).

**LinkBudgetCalculator in L06:** ✓ — existing `LinkBudgetCalculator` component correctly embedded. Import is from `../../components/LinkBudgetCalculator.jsx` (not from primitives — correct, this is the legacy calculator component). Both the legacy calculator AND the new `WorkedExample` headroom calculator are present in L06, giving learners two interactive experiences.

---

## Axis 6: Anti-hallucination

**SHA verification:**
All 13 SHAs verified with `git cat-file -t`:
- `ff7291d` (L01), `d0f86f8` (L02), `4026ff1` (L03), `680b9e0` (L04), `9d7031d` (L04 fix), `a9eccb5` (L05), `923ee21` (L06), `e784c81` (L07), `d77e1ea` (L08), `5e48933` (L09), `c5eb50d` (L10), `a289b98` (L11), `6da409c` (L12)
All return `commit`. All verified to modify the correct T02 lesson files via `git show --stat`. **Zero hallucinated SHAs.**

**Standards citations spot-check (5):**
1. **ITU-T G.652.D** — Used extensively across L01, L02, L04, L07, L08, L09. Real standard. Attenuation values (≤ 0.40 dB/km @ 1310, ≤ 0.30 dB/km @ 1550), zero-dispersion wavelength range (1300–1324 nm), PMD spec (0.2 ps/√km), MFD spec (8.6–9.2 µm @ 1310 nm) — all consistent with published G.652.D values. ✓
2. **ITU-T G.657** — Used in L04 and L11. G.657.A1, A2, B2, B3 subcategory descriptions correct. Mandrel test conditions in L04 table (100 turns/30 mm for G.652.D; 10 turns/10 mm for G.657.A1; 1 turn/7.5 mm for G.657.A2) are plausible spec-typical values. `[confirm edition]` used appropriately (2016 edition noted). ✓
3. **IEC 61280-4-2** — Cited in L10 as the standard for SMF field attenuation measurement. Real standard (field measurement of single-mode fiber). Used appropriately with `[confirm current edition]`. ✓
4. **TIA-492AAAD (OM4) and TIA-492AAAE (OM5)** — Cited in L08. Real standards for OM4 and OM5 fiber. `[confirm current editions]` used. ✓
5. **IEEE 802.3** — Cited in L08 for reach values. Real standard. Values in OM table (OM3: 300 m at 10GbE, OM4: 400 m) are consistent with IEEE 802.3 10GBASE-SR specifications. ✓

**Specific numbers spot-check (5):**
1. G.652.D attenuation @ 1310 nm: spec ≤ 0.40 dB/km, typical 0.32–0.35, planning 0.35 dB/km — **consistent with published spec** ✓
2. G.652.D attenuation @ 1550 nm: spec ≤ 0.30 dB/km, typical 0.18–0.22, planning 0.22–0.25 — **consistent with Corning SMF-28 and similar published datasheets** ✓
3. 850 nm attenuation for OM3/OM4 MMF: ~3.5 dB/km — **plausible; OM3 spec max is 3.5 dB/km @ 850 nm per TIA-492AAAC** ✓
4. Chromatic dispersion at 1550 nm: ~17 ps/(nm·km) — **correct for G.652 standard SMF (ITU-T G.652 specifies nominal D of 17 ps/(nm·km) at 1550 nm)** ✓
5. G.652.D PMD: ≤ 0.2 ps/√km — **correct per ITU-T G.652.D** ✓

**Math verification (all key calculations independently verified):**
- L03/L12 CD calc: ΔT = 17 × 0.1 × 50 = 85 ps ✓
- L03/L12 CD calc: ΔT = 17 × 0.1 × 100 = 170 ps ✓
- L05 Q1: 6 dB → 10^(−0.6) ≈ 0.25 = one-quarter ✓
- L05 Q2: Budget = +3 − (−24) = 27 dB ✓
- L05 Q4: −17 dBm → 10^(−1.7) mW ≈ 19.95 µW ≈ 20 µW ✓
- L06 Q1: Budget = 27 dB; total loss = 12.25 dB; headroom = 14.75 dB (passes) ✓
- L06 Q3: Budget = +3 − (−25) = 28 dB ✓
- L09 worked example: DGD = 0.1 × √200 = 1.41 ps ✓
- L09 Q2: DGD = 0.8 × √150 = 9.8 ps; 40G limit ~2.5 ps → link will fail ✓
- L12 CAP-Q04: ΔT = 17 × 0.1 × 50 = 85 ps ✓
- L12 CAP-Q08: 9 dB → ≈ 1/8 → 10^(−0.9) ≈ 0.126 ≈ 12.5% ✓
- L12 CAP-Q10: Budget = +4 − (−26) = 30 dB ✓
- L12 CAP-Q11: Total loss = 5.5+1.05+1.80+3 = 11.35 dB; headroom = 18.65 dB ✓
- L12 CAP-Q16: DGD = 0.15 × √250 = 2.37 ps ✓
- L01 critical angle: sin(θ_c) = 1.463/1.468 → θ_c ≈ 85.3° (text says ~85°) ✓
- L01 NA: √(1.468² − 1.463²) = 0.121 (text says 0.12–0.14) ✓

**Zero math errors detected.**

---

## Axis 7: Build integrity

```
npm run build  →  ✓ built in 2.52s
```

- 130 modules transformed. All 12 T02 lesson files appear as separate chunks in the dist output (code-splitting working correctly).
- One pre-existing chunk-size warning: `index.js` at 736 KB (pre-existing per prompt, not introduced by T02 lessons).
- Zero new chunk-size warnings beyond the pre-existing one.
- Zero build errors or TypeScript/JSX parsing failures.

---

## Axis 8: Template suitability for OSP-RW.4 replication

**CONDITIONAL PASS.** The following patterns are consistent and replicable:

**Strengths (lock these patterns for OSP-RW.4):**
1. **Meta object structure** is consistent across all 12 lessons and correct. The `vocabulary_assumed` pattern (term + `source_lesson_id`) is well-executed and makes the prereq invariant auditable.
2. **"In Plain English" opening** in every Foundations section is the right pattern — field-crew accessible, analogy-first, acronym table immediately following.
3. **"Book vs. Field" amber callout box** is executed consistently and is exactly the kind of content differentiation the curriculum calls for. Lock this as mandatory for every lesson that has a field/book gap (most of them will).
4. **Migration comment discipline** (one-line source citation at file top) is clean and auditable.
5. **BranchingScenario `scenarioId` naming** is correctly namespaced (`T02-LXX-scenario-N`). OSP-RW.4 agents must follow this convention explicitly to avoid localStorage bleed.
6. **Capstone quiz structure** (20Q, integrated WorkedExample before the quiz, lesson citations in every explanation) is the right model.
7. **`[confirm edition]` discipline** — correctly applied wherever a standard's edition might be in flux. Zero hardcoded edition suffixes on in-flux standards.

**Gaps that must be addressed in OSP-RW.4 briefs:**

1. **`lessonFileIndex` wiring is REQUIRED** — T02 authored all files but left the index commented out. OSP-RW.4 agents MUST uncomment/add their lesson file entries to `lessonFileIndex` in `course-catalog.js` as part of each lesson commit. This is not optional — without it, lessons are unreachable. Add to OSP-RW.4 agent-protocol addendum.

2. **Minimum 2 non-Quiz primitives per lesson** — L03, L09, and L10 each use only the per-lesson Quiz. The spec says "2-3 primitives woven into content." These lessons would benefit from a `SliderExploration` (e.g., CD slider showing pulse spreading vs. distance) or `AnnotatedDiagram` (e.g., OTDR event diagram). OSP-RW.4 agents should treat "at least one non-Quiz primitive per lesson" as a hard rule.

3. **`AnnotatedDiagram` prop is `src`, not `imageUrl`** — Schema.md says `imageUrl` but the component and all T02 lessons correctly use `src`. Fix `schema.md` before OSP-RW.4 so authors don't copy the wrong prop from the doc. One-line fix.

4. **OTDR forward-reference handling** — Several lessons reference OTDR before T12 where it's formally introduced. The pattern used (calling it out as "covered in T12") is acceptable, but vocabulary_assumed should include `{ term: 'OTDR', source_lesson_id: null }` or a forward-reference marker. Standardize this pattern in OSP-RW.4 for any forward-referenced term.

5. **Diagram SVG paths reference `/training/diagrams/*.svg`** — These images don't exist yet in the repo. This is fine for the template phase but OSP-RW.4 agents must be told that SVG assets at those paths are required for `AnnotatedDiagram` to render correctly. Either provide placeholder SVGs or ensure authoring agents know to ship diagrams.

---

## Findings (severity-ranked)

| # | Severity | Description | File:line | Remediation |
|---|---|---|---|---|
| 1 | **HIGH** | `lessonFileIndex` entries for all 12 T02 lessons are commented out — lessons are unreachable via SPA router (LessonRouter falls through to LessonPlaceholder for any T02 lesson URL) | `src/data/course-catalog.js:337-340` | Uncomment / add all 12 T02 entries matching the `"T02.L01": "../lessons/T02/L01.why-light-travels-in-glass.jsx"` format. Fix agent should add all 12. |
| 2 | **MEDIUM** | L03, L09, L10 each use only one interactive primitive (Quiz). Spec requires 2-3 primitives per lesson. | `L03.dispersion-why-signals-blur.jsx`, `L09.polarization-mode-dispersion.jsx`, `L10.fiber-characterization-testing.jsx` | Add a `SliderExploration` (e.g., CD accumulation vs. distance/wavelength for L03; DGD vs. PMD coeff and length for L09; characterization method comparison for L10) or `AnnotatedDiagram`. |
| 3 | **LOW** | `schema.md` documents `imageUrl` as the required prop for `<AnnotatedDiagram>` but the component uses `src`. All T02 lessons correctly use `src`. | `src/lessons/schema.md:194` | Update schema.md table to show `src` not `imageUrl` for AnnotatedDiagram. |
| 4 | **LOW** | `OTDR` appears in L07 body content and acronym table without being listed in `vocabulary_introduced` or `vocabulary_assumed`. Lesson handles it correctly by calling it a forward reference ("covered in T12") but the meta doesn't reflect this. | `L07.wavelength-windows.jsx:86-92` | Add `{ term: 'OTDR', source_lesson_id: null }` to `vocabulary_assumed` with a `// forward ref: introduced in T12` comment. Standardize this pattern for OSP-RW.4. |
| 5 | **LOW** | Diagram SVG files (`/training/diagrams/fiber-cross-section.svg`, `/training/diagrams/wavelength-windows.svg`, `/training/diagrams/fiber-bend-types.svg`) referenced in L01, L07, L04 do not exist in the repo. `AnnotatedDiagram` will render broken image areas. | L01:250, L07:234, L04:227 | Create placeholder SVGs at the referenced paths, or update the component to handle missing `src` gracefully. |

---

## Verdict

**YELLOW — ≤5 patches before T02 locks.**

The content quality is excellent. Math is verified clean. Training voice is consistent. Book vs. Field callouts are present and well-executed. Citations follow `[confirm edition]` discipline. Zero AI references. All SHAs real. Build passes.

The two blocking items are:
1. **Finding #1 (HIGH)** — `lessonFileIndex` must be wired up. Lessons that can't be loaded can't be verified end-to-end and can't serve as a template.
2. **Finding #2 (MEDIUM)** — L03, L09, L10 should each get one additional non-Quiz primitive before the template is locked.

Fix these two, and the other three LOW findings can be addressed as part of OSP-RW.4 authoring. T02 is structurally sound as a template — the patterns are clear and replicable.

---

## Coverage gaps (≤120 words)

- Did not verify SPA routing end-to-end in a browser (read-only constraint). The `lessonFileIndex` gap was identified via source inspection.
- Did not verify `LessonLayout.jsx` renders the `advanced` tier correctly as collapsed-by-default — read the component name but didn't exercise the UI.
- Did not audit `course-catalog.js` beyond the `lessonFileIndex` and T02 course record. Other topic registrations not checked.
- Did not verify the `useProgress` hook in LessonLayout against the API — that's an OSP-RW.2 concern.
- L09's advanced SOPMD content was not cross-referenced against published ITU-T specs (highly specialized; no external verification tool available read-only).

=== RW3 T02 RT REPORT END ===
