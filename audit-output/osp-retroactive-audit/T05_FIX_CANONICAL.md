# T05 Fix Canonical — NESC & Pole Loading

**Source audits:** R-1 (`3e1eb71`), R-2 (`a6e922c`), R-3 (`c55bf46`)
**Fix agent:** T05 Fix Agent
**Date:** 2026-05-16

---

## Consolidated Findings

| ID | Severity | Tag | Lesson(s) | Finding | Status | Commit SHA |
|----|----------|-----|-----------|---------|--------|-----------|
| F1 | HIGH | VERIFIED (R-1 + R-2 + R-3 convergent) | L15 (missing) | L15 capstone quiz absent; ARCH.md specifies 25Q MC + WorkedExample verify, 30 min, 70% pass, 4-domain weights (30% NESC clearances / 25% sag-tension / 25% pole loading / 20% ADSS+PON) | FIXED | `ac99fef` |
| F2 | MED | VERIFIED (R-1 standalone; R-3 corroborated) | L05:~339 | ANSI O5.1 cited with hardcoded "-2022" edition without `[confirm edition]` marker — violates standing citation protocol | FIXED | `a290c9e` |
| F3 | MED | VERIFIED (R-2 + R-3 convergent) | L02 | Missing FHWA 14 ft vs NESC 15.5 ft distinction: designers who see "DOT permit OK" may not realize NESC requires more. Field-practice trap. | FIXED | `a290c9e` |
| F4 | MED | R-1-ONLY (new finding not in R-2/R-3) | L01 | GA PSC Rule 515-2-9-.05 not named; lesson says "check state PUC website" but lacks the GA-specific anchor citation for Macon-based learners | FIXED | `a290c9e` |
| F5 | MED | R-3 (T05-internal, new finding) | L07, L08, L10, L12, L13, L14 | `span` and/or `attachment` → `source_lesson_id: 'T01.L01'` — wrong; correct is `T01.L02` (verified: T01.L01 introduces OSP/ISP/demarcation/headend/OLT/ONT; T01.L02 introduces pole/span/attachment/supply space/communication space) | FIXED | `b854725` |
| F6 | MED | R-2-ONLY (T07/T08 cross-topic DAG) | T07.L06:65-66 | `make-ready` → T05.L01 (wrong; T05.L08 introduces make-ready cost estimate); `OTMR` → T05.L01 (wrong; T05.L09 introduces OTMR) | FIXED | `b854725` |
| F7 | MED | R-2-ONLY (T07/T08 cross-topic DAG) | T07.L01:28-30 | `clearance` → T05.L04 (wrong; T05.L02 introduces vertical clearance/Rule 232); `sag` → T05.L05 (wrong; T05.L02 introduces sag formula) | FIXED | `b854725` |
| F8 | MED | R-2-ONLY (T07/T08 cross-topic DAG) | T07.L04:33-35 | `clearance` → T05.L04 (wrong → T05.L02); `NESC Rule 232` → T05.L04 (wrong → T05.L01); `make-ready` → T05.L03 (wrong → T05.L08) | FIXED | `b854725` |
| F9 | MED | R-2-ONLY (T07/T08 cross-topic DAG) | T08.L10:46-47 | `pole-loading` → T05.L02 (wrong → T05.L05); `loading district` → T05.L03 (wrong → T05.L06) | FIXED | `b854725` |
| F10 | LOW | VERIFIED (R-1 pre-existing, R-3 confirmed) | L06:~302 | Ice formula intermediate shows 178.97 (should be 179.07 = 57×π); final answer 1.244 correct | FIXED | `8a38d7a` |
| F11 | LOW | R-1 pre-existing (Polish Queue P4) | L10 | EDS orphan Flashcard lingers after EDS moved to vocab_assumed in prior fix | FIXED | `8a38d7a` |
| F12 | LOW | R-1-ONLY | L02, L04 | Grade B introduced in both L02 and L04 vocabulary_introduced — pick one introducing lesson; other marks assumed | FIXED | `8a38d7a` |
| F13 | LOW | R-2 + R-3 convergent | L06 / L13 | Extreme Wind Gulf-coastal note incomplete for Macon-adjacent coastal GA projects: counties Glynn, Camden, Brantley within NESC 250C mapped wind zone even though inland-light-district | FIXED | `8a38d7a` |

---

## Not Applied (Deferred or Out of Scope)

| ID | Reason |
|----|--------|
| R-2 F4 / SBU-R3-1: GPON "10 km physical differential" | Functionally correct field-practice heuristic; R-2 R-3 both flag as "suspicious-but-uncertain" not error; no NESC violation; deferred per quality bar (not a factual error) |
| R-2 Finding 14 (RUS 1724E-150 unusual citation) | On allowlist, no error, cosmetic only — no fix needed |

---

## Post-Fix RT Findings (from `2eb2961`)

| ID | Severity | Finding | Status | Commit SHA |
|----|----------|---------|--------|-----------|
| F-RT-1 | MED | T07.L01 `vocabulary_assumed` entry for `sag` has `source_lesson_id: 'T05.L05'` — wrong; sag is introduced at T01.L02 (poles-and-spans), not T05.L05 | FIXED | `140cec8` |
| F-RT-2 | HIGH | T05.L15 WorkedExample `sanityCheck` string values incorrect for configured inputs (RTS=3200, EDS=20%, w=0.280, OD=0.68, wind=9psf, L=200, attach=24): prior claimed 1.75ft/2.36ft/+6.14ft; correct is 2.19ft/4.55ft/+3.95ft | FIXED | `140cec8` |
| F-RT-3 | HIGH | T05.L15 Q18 choice C answer mismatch: marked correct at ≈1.240 lb/ft but given inputs w=0.145, w_ice=0.821, w_wind=0.607 yield √(0.966²+0.607²)=√1.3016≈1.141 lb/ft (~8.7% error) | FIXED | `140cec8` |

## Verification Note

Post-fix RT commit: `140cec8`
Tree clean after push. All three F-RT findings resolved in single commit.

---

## Patch Wave 2 Findings (from RT-A `fd7375b` + RT-B `4fb8db8`)

| ID | Severity | Tag | Lesson(s) | Finding | Status | Commit SHA |
|----|----------|-----|-----------|---------|--------|-----------|
| PW2-A | MED | RT-A + RT-B CONCUR | T05/L05:46 | `vocabulary_assumed` entry for `sag` → `source_lesson_id: 'T05.L02'` wrong; sag introduced at T01.L02 (poles-and-spans), not T05.L02 (sag formula lesson) | FIXED | `922582f` |
| PW2-B | MED | RT-A + RT-B CONCUR | T05/L07:48-49 | `vocabulary_assumed` entries for `EDS` and `RTS` → `source_lesson_id: 'T03.L09'` wrong; correct is `T03.L04` (L10+L15 already use T03.L04 correctly; L07 was the outlier) | FIXED | `922582f` |
| PW2-C | MED | RT-A + RT-B CONCUR | T07/L01:26-28 | `vocabulary_assumed` entries for `span`, `attachment point`, `clearance` all → `source_lesson_id: 'T05.L02'` wrong; correct is `T01.L02` (F-RT-1 fix corrected `sag` in same file but left these 3 adjacent wrong pointers) | FIXED | `922582f` |
| PW2-D | LOW | RT-A + RT-B CONCUR | T05/L07 Flashcard block | `vocabulary_introduced` has 10 terms; Flashcard block only rendered 5; missing: `parabolic approximation`, `initial sag`, `creep`, `sag-to-span ratio`, `ruling span` — all have key_terms entries, just no card renders | FIXED | `24db4c5` |
| PW2-Q12 | MED (escalated from LOW) | RT-B severity upgrade | T05/L15 Q12 | Choice A labeled "+4.57 ft" — 9.9% error vs correct +5.05 ft; student who correctly computes +5.05 ft finds no matching option. Question design error. | FIXED | `01bba5b` |

## Polish Stage (from `bef7e8c`)

| ID | Severity | Finding | Status | Commit SHA |
|----|----------|---------|--------|-----------|
| PW2-NB1 (P8) | LOW | T05.L02 FHWA 14ft clearance: distinguish maintained-clearance (14ft, 23 CFR 625.2) vs new-construction (16ft, AASHTO Green Book). Added paragraph in Book-vs-Field callout clarifying both are separate from NESC ≈15.5ft. | FIXED | `bef7e8c` |
| PW2-NB2 (NB-2) | LOW | T05 combined-load w_combined in parabolic sag formula: yields resultant tilted-sag, not purely vertical. Added conservative-approximation label in L02 step-4 prose and L15 capstone WorkedExample sanityCheck. | FIXED | `bef7e8c` |
| P4 / F11 residual | LOW | T05.L10 ADSS Flashcard rendered despite ADSS being vocabulary_assumed (T03.L04). F11 fixed EDS card at 8a38d7a but left ADSS card. Removed ADSS card; added self-damping + deadend-clamp cards (both vocabulary_introduced in L10). | FIXED | `bef7e8c` |
| P2 | LOW | T05.L12 GPON splitter 17–17.5 dB: verified present in body prose (key_terms definition, AnnotatedDiagram explanation, worked-example step 4). No change needed. | VERIFIED-NO-CHANGE | `bef7e8c` |

## T05 Wave Status: COMPLETE — all findings resolved through polish stage.

---

## POLISH-2 Stage (RT-A `634e6f8` + RT-B `3722497` final-verify pair)

| ID | Severity | Tag | Lesson(s) | Finding | Status | Commit SHA |
|----|----------|-----|-----------|---------|--------|-----------|
| NEW-A | LOW | RT-A | T05/L10 | `suspension clamp` in `vocabulary_introduced` + `key_terms` but missing rendered `<Flashcard>` card — directive 18z violation | FIXED | `ffb9631` |
| NEW-B-1 | LOW | RT-A | T07/L04:33 | `clearance` → `source_lesson_id: 'T05.L02'` wrong; T05.L02 doesn't introduce bare `clearance`; corrected to `T01.L02` | FIXED | `ffb9631` |
| NEW-B-2 | LOW | RT-A | T07/L04:36 | `attachment point` → `source_lesson_id: 'T05.L02'` wrong; corrected to `T01.L02` | FIXED | `ffb9631` |
| NEW-B-3 | LOW | RT-A | T07/L02:37 | `pole locations from design` → `source_lesson_id: 'T05.L02'` wrong; term used in L02 body; corrected to `T04.L02` (planimetric/aerial survey context, closest introducing lesson) | FIXED | `ffb9631` |
| GAP-A | LOW | RT-B | T05/L02:368, T05/L15:111 | Conservative-approximation label: "slightly larger" / "marginally less" understates the ratio (2.77× in Light district wind-only scenario); changed to "conservatively larger" / "conservatively smaller" with explanatory note in L15 | FIXED | `ffb9631` |

**Neighborhood scan findings (NOT fixed — report only):**
- T07/L02: `existing utilities` → `T04.L02` (line 33) — T04.L02 (Drone/LiDAR) does not introduce "existing utilities" as a formal term; T04.L01 or T01 more likely. Out of scope for this wave.
- T07/L04: `NESC Rule 232` → `T05.L01` (line 34) — correct (T05.L01 introduces NESC and Rule 232 at top level). No change needed.
- T07/L04: `make-ready` → `T05.L08` (line 35) — correct per F6 fix. No change.
- T05/L15: no other "slightly" or "marginally" language found in the sanityCheck strings beyond GAP-A scope.

## T05 Wave Status: COMPLETE through POLISH-2 stage. All RT findings resolved.
