# T12 Fix Wave A — Closeout Notes

**Write-path acknowledgement:** I operated within the authorized write-path:
- `osp-training/src/lessons/T12/*.jsx` ✓
- `audit-output/citation-registry.md` ✓
- `audit-output/dag-registry.json` ✓
- `audit-output/osp-retroactive-audit/T12_FIX_WAVE_A_NOTES.md` ✓ (this file)
- Did NOT edit CLAUDE.md, RESUME_HERE.md, or any file outside the allowlist.

---

## Canonical Items Applied

### F-1 / MED-1 — G.652.D spec max corrected in L13 (2 locations)
- **Was:** "≤ 0.35 dB/km @ 1310 nm, ≤ 0.20 dB/km @ 1550 nm" labeled as maximum values
- **Fixed to:** "spec max = ≤ 0.40 dB/km @ 1310 nm, ≤ 0.30 dB/km @ 1550 nm" per ITU-T G.652.D; "typical datasheet values 0.32–0.36 / 0.18–0.22 dB/km" preserved as separate context
- **Primary-source verification:** T02.L02 post-saturation (authoritative 16-RT-framing result) confirmed 0.40/0.30 spec max values. Consistent with 7 CFR 1755.902 and ITU-T G.652.D.
- **Locations fixed:** L13 lines ~106 (Foundations) + Advanced section

### F-4 / MED-2 — EXFO AN342 "0.25 dB whole-link systematic bias" removed (4 + 3 = 7 locations)
- **Was:** L01 taught "~0.25 dB whole-link systematic bias for singlemode OSP" with EXFO AN342 citation; L07 Advanced section had 3 instances of same claim
- **Fixed:** AN342's effect is multimode-only. Singlemode plant with bidirectional OTDR averaging closely tracks OLTS. L01 reframed (4 locations: key_terms OTDR definition, Flashcard back, Working prose, Standards list). L07 Advanced section reframed (residual difference = IOR uncertainty + connector reflections + reference conditions, not predictable 0.25 dB offset).
- **Cascade scan:** searched all T12 L01–L15 for "AN342", "0.25 dB", "systematic bias". Found 7 locations total (4 in L01, 3 in L07) — all corrected.

### F-2 / LOW-1 — L03 dynamic range Flashcard added
- **Was:** `dynamic range` in key_terms but no Flashcard card rendered
- **Fixed:** Added card `T12-L03-fc-dynamicrange` between averaging time card and EIOR card

### F-3 / LOW-2 — 47 broken DAG pointers fixed across 14 T12 lessons
**Root causes:**
1. vocabulary_introduced used long-form strings with parentheticals; vocabulary_assumed used short-form abbreviations → DAG registry couldn't match
2. vocabulary_assumed source_lesson_ids pointing to wrong first-introduction lessons

**Normalization applied (vocabulary_introduced → short-form):**
- L01: `'OLTS (Optical Loss Test Set)'` → `'OLTS'`; `'OTDR (Optical Time-Domain Reflectometer)'` → `'OTDR'`; `'VFL (Visual Fault Locator)'` → `'VFL'`
- L03: `'EIOR (Effective Group Index of Refraction)'` → `'EIOR'`
- L04: `'EDZ (Event Dead Zone)'` → `'EDZ'`; `'ADZ (Attenuation Dead Zone)'` → `'ADZ'`; `'launch cable (OTDR)'` → `'launch cable'`; `'receive cable (OTDR)'` → `'receive cable'`
- L10: `'EIOR (Effective Index of Refraction)'` → `'EIOR'`
- L11: `'CIC (Clean-Inspect-Clean) sequence'` → `'CIC sequence'`; `'video inspection probe (VIP)'` → `'video inspection probe'`
- L12: `'PMD (Polarization Mode Dispersion)'` → `'PMD'`; `'DGD (Differential Group Delay)'` → `'DGD'`; `'CD (Chromatic Dispersion)'` → `'CD'`; `'FOTP (Fiber Optic Test Procedure)'` → `'FOTP'`
- L14: `'SOR file (Bellcore)'` → `'SOR file'`

**Pointer corrections (source_lesson_ids):**
- `OLTS` → `T01.L08` (was T12.L01) — affects L01, L02, L11, L12, L13, L14, L15
- `OTDR` → `T01.L08` (was T12.L01) — affects L03, L04, L05, L06, L07, L09, L10, L12, L14, L15
- `G.652.D` → `T02.L01` (was T02.L02/T02.L08) — affects L03, L09, L12, L13
- `MFD` → `T02.L01` (was T02.L05) — affects L06, L09
- `macrobend` → `T02.L04` (was T02.L02) — affects L09
- `G.657` → `T02.L04` (was T02.L08) — affects L09
- `dB/dBm` compound split → `{ term: 'dB', source_lesson_id: 'T02.L05' }` + `{ term: 'dBm', source_lesson_id: 'T02.L05' }` — affects L01, L03
- `attenuation dB/km` compound split → `{ term: 'attenuation', source_lesson_id: 'T02.L02' }` + `{ term: 'dB/km', source_lesson_id: 'T02.L02' }` — affects L02
- `wavelength windows` (plural, not in registry) → `wavelength window` (singular, T02.L07) — affects L03

### F-5 / LOW-3 — L11 IEC 61300-3-35 prior-edition Zone B corrected 120µm → 115µm
- **Was:** "120 µm (some references) or 125 µm" for prior-edition Zone B outer boundary
- **Fixed to:** "115 µm (per IEC 61300-3-35 prior editions)" — three locations: prose note, cross-reference sentence, quiz option b text + explanation
- **Primary source:** IEC 61300-3-35 prior editions consistently used 115 µm as Zone B outer boundary; 2022 Edition 3 revised to 110 µm.

---

## Registry Additions
- **IEC 61300-3-35:2022 Ed.3** added to citation-registry.md with Zone B boundary notes (115 µm prior, 110 µm 2022 Ed.3)
- **EXFO Application Note 342** added to citation-registry.md with multimode-only bias caveat

---

## Verification Results

| Check | Result |
|---|---|
| T12 broken DAG pointers | **0** (was 45+2 additional found) |
| Vite build | **✓ clean** (7.10s, no errors) |
| Schema validator T12 | **15/15 PASS, 0 warnings** |
| Push | `c0d6bd2` → `origin/main` |

---

## git log -3

```
c0d6bd2 T12 Fix Wave A: MED-1 G.652.D spec max, MED-2 EXFO AN342 singlemode, LOW-1 dynamic range Flashcard, LOW-2 DAG pointers, LOW-3 IEC 61300-3-35 Zone B 115µm
5500e44 T12 RT-β technical: 2 new MED/LOW findings
4481a6f T12 RT-α pedagogy: YELLOW — F-1 MED, F-2 LOW, F-3 LOW
```
