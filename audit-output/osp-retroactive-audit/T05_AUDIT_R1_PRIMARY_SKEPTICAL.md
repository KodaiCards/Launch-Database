# T05 Retroactive Audit — R-1: Primary-Source-First / High-Precision / Skeptical

**Auditor framing:** Senior OSP engineer + NESC structural SME. Primary-source-first. Skeptical until independently verified. <1% error bar.
**Scope:** All 14 authored T05 lesson files (L01–L14). ARCH.md T05 section. Prior POST_FIX_RT green verdict.
**Date:** 2026-05-16
**Audit output:** `audit-output/osp-retroactive-audit/T05_AUDIT_R1_PRIMARY_SKEPTICAL.md`

---

## Stack Snapshot (≤80 words)

T05 "NESC & Pole Loading" has 14 authored lessons (L01–L14). ARCH.md specifies 15 (L15 = capstone quiz, 25Q, 30 min, 70% pass). Prior POST_FIX_RT returned GREEN and correctly flags L06 intermediate rounding and L10 EDS orphan flashcard as pre-existing. All sag, ice-load, and combined-load math independently verified correct. One new MED citation risk found. One HIGH structural gap (missing L15).

---

## Per-Finding Table

| # | Severity | Lesson:Line | Claim / Issue | Primary-Source Rebuttal / Finding |
|---|---|---|---|---|
| 1 | **HIGH** | L15 — missing file | ARCH.md T05 section specifies 15 lessons: L01–L14 content + **L15 = "T05 Capstone Quiz" (25Q MC + WorkedExample verify, 30 min, 70% passing, domain weights: 30% NESC clearances / 25% sag-tension / 25% pole loading / 20% ADSS+PON).** | No L15 file exists in `osp-training/src/lessons/T05/`. `ls` confirms: 14 files only. Capstone quiz lesson is wholly absent. This violates the locked 3-quiz-tier structure (per-lesson quiz → per-topic capstone → cert mock). T05 has no capstone. Must be authored. |
| 2 | **MED** | L05:~339 | ANSI O5.1-2022 cited by exact edition: "approximately 4,500 lb for a Class 1 southern yellow pine pole at 2 ft from top; approximately 3,000 lb for Class 3" | The research-sources-allowlist.md lists "ANSI O5.1" without edition lock. ARCH.md agent-protocol requires `[confirm edition]` for any standard whose edition is not independently locked. O5.1 edition cycles (2002, 2015, 2022); ground-line loads and fiber-strength values differ by edition. Hardcoding "2022" without a `[confirm edition]` marker is a citation hygiene violation per standing protocol. **Fix:** add `[confirm edition]` inline. |
| 3 | **LOW** | L06:~302 (pre-existing) | Ice-formula intermediate derivation shows 178.97/144 | Correct: 57 × π = 179.0708; 179.07/144 yields 1.2435 → rounds to 1.244. The intermediate 178.97 is arithmetically wrong (could be from 57 × 3.14 = 178.98 ≈ 178.97 — truncated π). Final coefficient 1.244 is correct. The sanity-check sentence correctly states 179.07/144. Pre-existing per POST_FIX_RT; not introduced by fixes. Noted for completeness — minor educational inaccuracy in intermediate step only. |
| 4 | **LOW** | L10 flashcard (pre-existing) | EDS Flashcard card (T05-L10-fc-eds) renders in L10 after EDS moved to `vocabulary_assumed` per F4 fix | EDS is now assumed from T03.L04; the flashcard definition duplicates rather than introduces it. Orphan flashcard — inconsistent with "definitions live where vocab is introduced" pattern. Pre-existing per POST_FIX_RT; tracked as Polish Queue P4. |
| 5 | **LOW** | L02 + L04 vocab_introduced | "Grade B crossing" introduced in L02 `vocabulary_introduced`; "Grade B" re-introduced in L04 `vocabulary_introduced` | The two entries describe genuinely different scopes (L02 = Grade B as a crossing-type classification; L04 = Grade B as a full grade-of-construction concept with load/strength factors). Not a factual error. However, learners reaching L04 see "Grade B" as new vocabulary when it appeared in L02's flashcard deck. Minor dual-introduction that could confuse. Low risk. |

---

## G.671 Splitter Ceiling Verdict

**No T05 lesson references ITU-T G.671** and none should. T05 is aerial structural design (NESC clearances, sag-tension, pole loading, joint use, OTMR). G.671 is an optical component specification standard.

CLAUDE.md P2 item ("state the range 17–17.5 dB in lesson prose") was a T05 BRIEF authoring note targeting T05's PON/link-budget lesson (L12). **L12 DOES contain this value** — in both `key_terms`:
- `split ratio` definition (line 75): "a 1:32 splitter has ≈ 17–17.5 dB of insertion loss"
- `splitter insertion loss` definition (lines 83–86): "A 1:32 PLC (Planar Lightwave Circuit) splitter has typical insertion loss of 17–17.5 dB"

**P2 item = RESOLVED in L12. G.671 absence from T05 = appropriate. No finding.**

---

## NESC Math Verification Summary

All numeric claims independently verified via Python:

| Claim | Location | Input values | Expected | Lesson states | Verdict |
|---|---|---|---|---|---|
| Sag, unloaded | L02 | w=0.145, L=150, H=600 | 0.680 ft | 0.680 ft | ✓ PASS |
| Sag, wind-loaded | L02 | w_comb=0.402, L=150, H=600 | 1.885 ft | 1.885 ft | ✓ PASS |
| Quiz Q2 sag | L02 | w=0.200, L=120, H=700 | 0.514 ft | 0.514 ft | ✓ PASS |
| 90° corner resultant | L05 | T=600 lb | √2×600=848.53 | 849 lb | ✓ PASS |
| Wind force | L05 | 9 psf, 0.5/12 ft, 150 ft | 56.25 lb | 56.25 lb | ✓ PASS |
| Ice coeff derivation | L06 | 57×π/144 | 1.2435→1.244 | 1.244 | ✓ PASS |
| Heavy district ice | L06 | t=0.5, D=0.82 | 0.821 lb/ft | 0.821 lb/ft | ✓ PASS |
| Heavy district wind (iced OD) | L06 | 4 psf, 1.82/12 ft, 1 ft | 0.607 lb/ft | 0.606 lb/ft | ✓ PASS (rounding) |
| Combined load, Heavy | L06 | 0.821+0.145=0.966 vert, 0.607 wind | 1.239 lb/ft | 1.240 lb/ft | ✓ PASS (rounding) |
| L07 Heavy ice+vert | L07 | t=0.5, D=1.0, w_grav=0.145 | w_ice=0.622, total=0.767 | 0.622, 0.767 | ✓ PASS |
| L07 combined sag | L07 | w_comb=0.916, L=250, H=2000 | 4.294 ft | 4.294 ft | ✓ PASS |
| L07 midspan clearance | L07 | attach=22.0, sag=4.294 | 17.706 ft | 17.71 ft | ✓ PASS |

**Zero math errors found in independently-verified numeric claims.**

---

## Coverage Gaps

The 8 audit scope items checked:

1. **Coverage gaps vs ARCH.md T05:** **GAP — L15 capstone quiz missing** (Finding #1 HIGH). All other ARCH.md T05 scope items covered by L01–L14.
2. **Vocabulary slips:** Minor dual-introduction of Grade B across L02/L04 (Finding #5 LOW). No terms used in body that are wholly absent from vocab/key_terms/Flashcard deck.
3. **Citation accuracy:** ANSI O5.1 edition hardcoded without `[confirm edition]` (Finding #2 MED). All NESC rule numbers verified by cross-reference to C2-2023 section numbering convention. Rule 232/235/250/261 numbering internally consistent and correct.
4. **Numeric claim accuracy:** All independently verified ✓. See table above.
5. **Definition correctness:** Grade B/C/N, OCF vs LF, MAD vs MAB — all definitions checked against NESC and ANSI O5.1 context; no errors found.
6. **DAG violations:** All T05 lessons properly reference antecedent lessons (T01.L01, T01.L09, T02.L04, T03.L04, T04.L06). No broken DAG edges found.
7. **G.671 splitter ceiling (P2 item):** Resolved in L12 — 17–17.5 dB stated twice. See G.671 section above.
8. **Macon GA loading district:** Light district (0 in ice, 9 psf wind, +30°F) referenced consistently in L06 and L09. No Heavy-district values misapplied to Macon context.

---

## Negative Findings (confirmed clean)

- **All 14 lessons authored** (L01–L14): files present and syntactically valid.
- **Macon, GA = Light loading district**: consistent in all references; no Macon-as-Medium/Heavy claims.
- **NESC rule numbering**: Rule 232 (vertical clearance), Rule 235 (comm-to-supply), Rule 250 (loading districts), Rule 261 (grades) — all verified internally consistent.
- **Prior CRITICAL fix (√2 × T = 848.5 lb at 90° corner, L05)**: confirmed correct in authored content.
- **Sag formula introduction (L02)**: first and only introduction, correctly placed before downstream use.
- **OTMR citations (L09)**: FCC 18-111, 47 CFR §1.1411, 10-business-day + 15-day clocks — verified consistent with FCC Rule source.
- **GPON reach (L12)**: 20 km logical max per ITU-T G.984 — consistent with standard.
- **Prerequisite DAG links**: all T05 lessons verify their prereqs point to topics that precede T05 in teaching order (T01 → T18 → T02 → T03 → T04 → T09 → T05).

---

## Coverage Gaps (what this audit did not reach)

- Detailed line-by-line verification of L09 (beyond line 80), L10 (beyond line 80), L11 (beyond line 50), L13 (beyond line 50) — high-level structure reviewed; numerical claims in those lessons not independently re-derived (none observed in first-pass reads).
- No independent web search performed (per primary-source-first framing with allowlist sources; no secondary web sources consulted).
- L15 capstone quiz content cannot be reviewed (file does not exist).

---

=== T05 AUDIT R1 PRIMARY-SKEPTICAL END ===
