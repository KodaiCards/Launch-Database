# T3 Pitch Revision — Worker B Report

**Scope:** Even-numbered shipped lessons in Topic 3 (Survey & Route Design): L3.2, L3.4, L3.6, L3.8
**Repo:** kodaicards/launch-database
**Branch:** claude/debug-previous-issues-MoN9D
**HEAD at completion:** 1ea0847

---

## Lessons Revised

| Lesson | File | Commit | Status |
|---|---|---|---|
| L3.2 | `content/osp-survey-route/02-field-survey-methodology.md` | `c87a95c` | ✓ Complete |
| L3.4 | `content/osp-survey-route/04-aerial-route-design.md` | `d329b0f` | ✓ Complete |
| L3.6 | `content/osp-survey-route/06-direct-bury-route-design.md` | `ceb0f2f` | ✓ Complete |
| L3.8 | `content/osp-survey-route/08-crossings.md` | `d06cde9` | ✓ Complete |

---

## What Was Added Per Lesson

### L3.2 — Field Survey Methodology

- "In Plain English" 5-sentence intro
- Acronym table: OSP, RUS, GIS, GPS, ROW, DOT, FHWA, AASHTO, BICSI, IFC, WAAS, 811, NWI, NRCS, USFWS — each with practical plain-English gloss
- "Scouting trip" analogy for reconnaissance survey; "measuring tape after approval" analogy for design survey
- Stationing explained as "the address system for your route" with station 23+45 decoded explicitly (23 × 100 + 45 = 2,345 feet)
- WAAS explained inline: a satellite correction signal that improves GPS from ~15 ft to ~3 ft accuracy
- 811 explained as the national call-before-you-dig system

### L3.4 — Aerial Route Design

- "In Plain English" 5-sentence intro
- Acronym table: NESC, OSP, RUS, IEEE, ADSS, EDS, RTS, BICSI, AASHTO, psf
- "Garden hose between fence posts" analogy as the lead-in before catenary math
- Full sag formula unpacking: every variable defined with units, 8 = parabola geometry constant (always 8), L² explained as "L × L"
- Behavior sanity checks: why bigger L → more sag, bigger H → less sag, bigger w → more sag
- Rearranged L_max formula fully unpacked with S_max defined
- Worked example stepped through in a table + numbered steps with intermediate calculations and a sanity check ("415 ft is roughly 1.5 football fields")
- EDS explained with concrete arithmetic: 18% × 2,800 lb = 504 lb
- Creep explained with rubber-band analogy
- Three pole loading components explained with flagpole-in-concrete analogy + tug-of-war analogy for longitudinal loads

### L3.6 — Direct-Bury Route Design

- "In Plain English" 5-sentence intro
- Acronym table: OSP, RUS, ANSI/TIA, ROW, DOT, FHWA, NRCS, BICSI, AHJ, 811
- Fish-fin analogy for vibratory plow
- Giant chainsaw analogy for chain trencher
- Giant circular saw analogy for rock saw
- Plowability explained as two concrete checkpoints: minimum bend radius and maximum installation tensile load
- Proctor density explained fully: lab benchmark, why 95% matters, why loose backfill under roads creates potholes
- Agricultural topsoil explained with two-pile system framing (topsoil pile ≠ subsoil pile)
- Settlement follow-up obligation flagged as a callback commitment to build into contracts

### L3.8 — Crossings

- "In Plain English" 5-sentence intro
- Acronym table: NHS, FHWA, AASHTO, HDD, HDPE, USACE, NWP 12, PCN, IP, ESA, FRA, DOT, Section 404, Section 401 WQC, ROW
- "Crossings are coordination problems, not engineering problems" framing established at the top
- Critical path concept explained in plain English before the permit matrix
- Casing pipe explained with protective sleeve analogy
- USACE "navigable" legal meaning vs. common-sense meaning explained explicitly — small creeks can be navigable
- NWP 12 = fast track framing, IP = slow track framing, each with what triggers each
- Section 401 WQC flagged explicitly as "the often-forgotten step"
- Station notation cross-referenced to L3.2 (where it was introduced)

---

## Preservation Verification

For each lesson, confirmed preserved verbatim:
- All [CORRECT] tags on all quiz answer options
- All citation brackets
- All Key Terms flashcard entries
- All Pulse question stems and expected answers
- All Glossary Cross-References
- All scenario tables and step-by-step scenario answers

No math results were changed. No citations were removed or added. No quiz questions were modified.

---

## Batch C Identification

Batch C = L3.9, L3.10, L3.11, L3.12. These lessons do not yet exist in `content/osp-survey-route/` (no files 09-12). Confirmed by reading `audit-output/wave-osp-topic3/BATCH_C_BRIEF.md`. No Batch C files were touched.

---

## Worker B Scope Summary

| Item | Count |
|---|---|
| Lessons revised | 4 (L3.2, L3.4, L3.6, L3.8) |
| "In Plain English" intros added | 4 |
| Acronym tables added | 4 (total ~50 acronym definitions) |
| Formulas fully unpacked | 1 (sag formula in L3.4: S = wL²/8H + rearranged L_max form) |
| Worked examples with intermediate steps | 1 (L3.4 span calculation) |
| Analogies added | ~10 across 4 lessons |
| Commits | 4 (one per lesson) + 1 L3.2 recovery commit |

---

## Open Items / Notes

1. **L3.2 commit sequence:** L3.2 was written to disk before context compaction but not committed until after resume. Committed at SHA `c87a95c` after resuming.
2. **Worker A merge:** Remote HEAD included Worker A's T1+T2 even lesson revisions — merged cleanly at `1ea0847`.
3. **No issues with preserved content:** All [CORRECT] tags, citations, and Pulse answers verified intact before each commit.

=== T3 WORKER B REPORT END ===
