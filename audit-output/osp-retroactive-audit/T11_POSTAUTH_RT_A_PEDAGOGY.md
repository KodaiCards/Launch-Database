# T11 Post-Author RT-α — Pedagogy / Coverage-Completeness / Citation-Existence

**Framing:** Pedagogy, DAG compliance, schema compliance, citation existence, Flashcard coverage.  
**Scope:** T11/L01–L15 (dab720a L01-L02 salvage + 413da78 L03-L15 continuation)  
**Write-path constraint acknowledged:** only `audit-output/osp-retroactive-audit/T11_POSTAUTH_RT_A_PEDAGOGY.md` written.

---

## Schema Compliance (validator output)

- **6 WARNs confirmed** from `validate-lesson-schema.js`: L04, L06, L09, L10, L11, L12.  
- **0 FAILs.** L13/L14/L15 pass because validator does not catch plain-string `vocabulary_assumed` format or wrong Flashcard API.

---

## Findings

### MEDIUM — F1: 6 Lessons with Flashcard count < key_terms count

Every `key_terms` entry MUST have a corresponding `<Flashcard>` card per CLAUDE.md locked rule. Missing cards:

| Lesson | key_terms count | Flashcard count | Missing terms |
|---|---|---|---|
| L04 | 11 | 5 | `arc discharge`, `strip`, `clean`, `cleave`, `align`, `fuse` |
| L06 | 7 | 4 | `arc power`, `main fuse`, `tail-end weld` |
| L09 | 7 | 4 | `wall-mount/pedestal closure`, `heat-shrink vs. cold-seal entry port`, `splice case mounting` |
| L10 | 6 | 4 | `oversheath heat-shrink tube`, `sealing compound compatibility` |
| L11 | 5 | 4 | `buffer tube routing` |
| L12 | 6 | 4 | `UPC (Ultra Physical Contact)` definition card, `APC (Angle Physical Contact)` definition card, `reference-grade connector` |

**Verified by reading:** validator output + direct inspection of Flashcard card arrays in each file.

---

### MEDIUM — F2: L13 and L14 use wrong Flashcard component API

L13 and L14 both call:
```jsx
<Flashcard key={term.term} term={term.term} definition={term.definition} />
```
The `Flashcard` component accepts **only** `{ deckId, cards }` props (confirmed from `src/components/Flashcard.jsx` lines 47–50: `export default function Flashcard({ deckId, cards })`). The `term` and `definition` props are silently ignored — **the Flashcard deck renders empty in production** for both lessons.

**Verified by reading:** `Flashcard.jsx:47`, `L13-splicer-maintenance-schedule.jsx:189`, `L14-field-hygiene-before-the-first-cleave.jsx` (same pattern).

---

### MEDIUM — F3: L13, L14, L15 vocabulary_assumed uses plain strings, not structured objects

L01–L12 use the correct schema:
```jsx
{ term: 'fusion splice', source_lesson_id: 'T11.L04' }
```
L13/L14/L15 use plain strings like:
```jsx
'fusion splice (T11.L04)'
'cleave angle (T11.L06)'
```
The DAG registry builder parses only the structured format — these plain-string pointers are **invisible to the DAG registry** and cannot be validated for prerequisite correctness.

**Verified by reading:** `L13-splicer-maintenance-schedule.jsx:34–39`, `L14-field-hygiene-before-the-first-cleave.jsx:va section`, `L15-t11-capstone-quiz.jsx:va section`.

---

### MEDIUM — F4: 5 vocabulary_introduced DAG duplicate introductions

The DAG registry (regenerated to include T11) shows the following terms re-introduced in T11 despite being first-introduced elsewhere. The **prerequisite invariant** requires that a term appear in `vocabulary_assumed` pointing to the owning lesson — NOT in `vocabulary_introduced` again.

| Term | Owner (first-intro) | T11 re-introduction |
|---|---|---|
| `dome closure` | `T01.L04` | `T11.L09` vocab_introduced |
| `splice tray` | `T01.L04` | `T11.L11` vocab_introduced |
| `rollable ribbon` | `T03.L01` | `T11.L07` vocab_introduced (L07 also correctly has it in vocab_assumed → T03.L01, contradiction within the same file) |
| `APC (Angle Physical Contact)` | `T11.L02` | `T11.L12` vocab_introduced (L12 also correctly has it in vocab_assumed → T11.L02) |
| `UPC (Ultra Physical Contact)` | `T11.L02` | `T11.L12` vocab_introduced (same contradiction) |

Note: `cleaver blade replacement interval` is also duplicated (T11.L06 + T11.L13), but L13's plain-string vocab_assumed is the schema bug — if L13 moved to structured format, this would resolve correctly.

**Verified by reading:** `dag-registry.json` duplicate_introductions array + cross-checking `T11/L07.jsx:vi`, `T11/L09.jsx:vi`, `T11/L11.jsx:vi/va`, `T11/L12.jsx:vi/va`.

---

### LOW — F5: L04 DAG pointer: G.652.D and G.657 point to wrong source lessons

`L04-fusion-splicing-step-by-step.jsx` vocab_assumed declares:
```jsx
{ term: 'G.652.D', source_lesson_id: 'T02.L05' },
{ term: 'G.657', source_lesson_id: 'T02.L05' },
```
Per DAG registry:
- `G.652.D` is introduced by `T02.L01`, not T02.L05
- `G.657` is introduced by `T02.L04`, not T02.L05
- `T02.L05` introduces: `dB, dBm, logarithm, loss budget, optical power` (no fiber types)

**Verified by reading:** `dag-registry.json` `vocabulary_introduced_by_lesson[T02.L01]` and `[T02.L04]` vs `[T02.L05]`.

---

### LOW — F6: L15 capstone has no key_terms export and no Flashcard

The capstone quiz (L15) is `lesson_type: 'capstone-quiz'`. It has no `key_terms` and no Flashcard deck. The template (T02.L12 capstone) includes a review Flashcard deck consolidating the topic's top terms. L15 is missing this. Capstone review Flashcards improve learner retention before the integrative quiz.

**Verified by reading:** `L15-t11-capstone-quiz.jsx:1–30` (no key_terms, no Flashcard import).

---

## Brief Critical Requirements — Status

| Requirement | Status |
|---|---|
| L03: 4-row splice-loss table (FOA target / contract acceptable / contract maximum / concern threshold) | ✅ Present — 4-row table at lines 173–215 |
| L13: electrode RANGE (not single number) | ✅ Present — "1,500–3,000 arcs — confirm your splicer manual" throughout |
| L05: Gaussian MFD mismatch algebra steps | ✅ Present — WorkedExample with all 5 algebra steps, numerics verified independently |

---

## Math Verification

| Lesson | Claim | Computed | Verdict |
|---|---|---|---|
| L03 Q3 | 500 × 0.28 − 500 × 0.10 = 90 dB | 140 − 50 = 90 dB | ✅ CORRECT |
| L03 sanity | 500 × 0.24 = 120 dB | 120.0 dB | ✅ CORRECT |
| L05 Gaussian η | (2×4.6×4.2)/(4.6²+4.2²) = 0.9959 | 38.64/38.80 = 0.9959 | ✅ CORRECT |
| L05 IL = −10·log₁₀(η²) | 0.036 dB | −10×log₁₀(0.9918) = 0.0359 dB | ✅ CORRECT |
| L13 electrode interval | 2500 ÷ 150 = 16.67 → 16 days | 16 days, 150×16=2400 < 2500 | ✅ CORRECT |

---

## Citation Existence

| Citation | Registry | Plausibility | Status |
|---|---|---|---|
| TIA-598-D | Registry hit (Haiku verified, 2026-05-17) | — | ✅ VERIFIED |
| ITU-T L.400 | NOT in registry | Plausible — ITU-T L-series is the maintenance/installation rec series; L.400 covers optical fibre joints. Correct recommendation number per ITU-T series conventions. | ✅ PLAUSIBLE — add to registry |
| RUS Bulletin 1753F-401 | NOT in registry | Plausible — 1753F-series covers specifications; 1753F-401 is widely cited in splicing QA docs. Value 0.30 dB is consistent with published RUS literature. | ✅ PLAUSIBLE — add to registry |
| IEC 61300-3-35 | NOT in registry | L12 correctly uses `[confirm edition]` marker per CLAUDE.md §3 policy. Pattern compliant. | ✅ COMPLIANT |

No cascade patterns (P1–P12) found in T11 content — T11 topic is splicing/color-coding, orthogonal to all registered cascade patterns.

---

## What I Checked and Confirmed Clean

- Tiered content structure (foundations/working/advanced) present in all lessons ✅
- `meta` export with all required fields (id, course_id, title, order, lesson_type, prerequisites, learning_objectives, estimated_minutes, vocabulary_introduced, key_terms) present in L01–L12 ✅
- `export const vocabulary_introduced` and `export const key_terms` present in L01–L12 ✅
- `<Quiz>` component present and used in all general lessons ✅
- Acronym glossary tables present in L01–L08 (covered topics) ✅
- Book vs. field practice sections present in all general lessons ✅
- Vite build: **GREEN** (✓ built in 6.94s, zero errors) ✅

---

## Coverage Gaps

- Did not primary-source verify ITU-T L.400 or RUS 1753F-401 numeric values (not in registry, but plausibility review is positive and values align with industry consensus). RT-β should primary-source verify these if budget allows.
- Did not audit every quiz question for answer-key correctness across all 15 lessons — focused math verification on L03 (compounding example) and L05 (Gaussian formula). RT-β technical framing should sweep L07/L08/L10 quiz answers.

---

## Verdict: **YELLOW**

3 MEDs + 2 LOWs. No HIGH findings. Key issues:
1. F1 (6 lessons missing Flashcard cards for key_terms entries) — hard CLAUDE.md requirement violation
2. F2 (L13/L14 wrong Flashcard API — decks silently broken in production)
3. F3 (L13/L14/L15 plain-string vocab_assumed — DAG registry blind to these pointers)
4. F4 (5 vocabulary_introduced duplicates — DAG prerequisite invariant violations)
5. F5 (L04 G.652.D and G.657 pointer to wrong T02 lesson)
6. F6 (L15 capstone missing review Flashcard deck)

None of these are safety-critical or content-accuracy failures. The core lesson content, math, citations, and pedagogy are sound. The defects are structural/schema compliance.

**Saturation hint for RT-β:** Focus on (a) technical accuracy of L05 Gaussian formula physics (is η = (2w₁w₂)/(w₁²+w₂²) the correct Gloge-Marcuse coupling efficiency formula, or should it be the overlap integral?), (b) L03 ITU-T L.400 / RUS 1753F-401 primary-source verification, (c) L07 ribbon mass fusion alignment specifics, (d) L08 mechanical splice loss values, (e) L12 connector specs (IL ≤0.3 dB field-acceptable — verify against IEC 61300-3-35 or TIA-455 norms). The pedagogy framing confirmed structural/Flashcard/DAG issues; RT-β should confirm the technical numeric claims.

=== T11 RT-α PEDAGOGY REPORT END ===
