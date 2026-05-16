# T18 Retroactive Audit — R-1: Primary-Source-First / High-Precision / Skeptical

**Topic:** T18 Safety & OSHA  
**Framing:** Primary-source-first · High-precision · Skeptical  
**Auditor:** R-1 (sequential; R-2 corroboration-adversarial follows)  
**Lessons audited:** L01–L10 (`osp-training/src/lessons/T18/*.jsx`)  
**Date:** 2026-05-16  
**Verdict:** YELLOW — 1 HIGH, 4 MED, 2 LOW. One safety-critical factual error. Four broken DAG edges.

---

## Stack snapshot

Ten T18 lessons landed across commits `b51644f..e642a55`; fix `96bfd9f` applied prior RT-A/RT-B findings. Prior RT-A (pedagogy framing) + RT-B (technical) ran after the original author wave. Both were YELLOW; three fixes applied (L09 Sortable added, L06 meta-reference removed, L07 disclaimer moved to description field). All three prior fixes verified applied and correct. This audit targets what prior RTs missed.

Primary sources used for independent verification: 29 CFR 1910.146(b), 1910.147, 1910.268, 1910.269(l)(2), 1910.137, 1910.1053, 1910.1200, 29 CFR 1926 Subpart M (1926.502), ANSI Z359 series, ASTM D120, ASTM F2412/F2413, ANSI/ISEA 107, MUTCD 11th Edition (2023) Part 6.

---

## Findings

| # | Severity | Lesson:Line | Claim | Primary-Source Verdict |
|---|----------|-------------|-------|------------------------|
| F1 | **HIGH** | L03:297–299 | "methane, carbon dioxide, and nitrogen are all heavier-than-air gases that can accumulate at the bottom of a manhole" | **FACTUAL ERROR.** Methane (CH₄, molecular weight ≈ 16 g/mol) is LIGHTER than air (molecular weight ≈ 29 g/mol). CO₂ (MW≈44) and N₂ (MW≈28) are heavier or near-neutral; methane is not. In a manhole methane accumulates at the TOP, not the bottom. Teaching "methane sinks to the bottom" will cause field workers to test only at floor level and miss an ignitable methane layer above their heads. Fix: replace "methane" with CO₂ + N₂ as the bottom-accumulating examples; state methane explicitly as top-accumulating. |
| F2 | **MED** | T07.L01 meta | `vocabulary_assumed: [{ term: 'safety zone', source_lesson_id: 'T18.L01' }]` | **BROKEN DAG EDGE.** T18.L01 `vocabulary_introduced`: `['general duty clause', '1910.268', 'hazard recognition', 'hierarchy of controls', 'SDS']`. Term 'safety zone' is NOT in this list, NOT in `key_terms`, and NOT in the L01 lesson body Flashcard set. T07.L01 assumes a term T18 never formally introduces. The prerequisite invariant is violated. |
| F3 | **MED** | T04.L01 meta | `vocabulary_assumed: [{ term: 'fall protection', source_lesson_id: 'T18.L04' }]` | **BROKEN DAG EDGE.** T18.L04 `vocabulary_introduced`: `['lanyard', 'self-retracting lifeline (SRL)', '100% tie-off', 'positioning system', 'aerial lift']`. Term 'fall protection' (as a standalone term) is NOT in this list. The concept is taught throughout L04 body prose, but was never formally registered. DAG edge is broken — T04 cannot safely assume a term T18.L04 never introduced. |
| F4 | **MED** | T04.L01 meta | `vocabulary_assumed: [{ term: 'PPE', source_lesson_id: 'T18.L05' }]` | **BROKEN DAG EDGE.** T18.L05 `vocabulary_introduced`: `['PPG glove class', 'ANSI Z89.1 Class E', 'ANSI Z89.1 Class G', 'dielectric boots', 'hi-vis vest']`. 'PPE' as a standalone term is NOT in this list. L05 body text uses 'PPE' extensively but does not formally introduce it (T18.L01 hierarchy-of-controls Flashcard references PPE parenthetically but doesn't register it). Term 'PPE' is assumed by T04 without a clean introduction lesson. |
| F5 | **MED** | T04.L01 meta | `vocabulary_assumed: [{ term: 'lockout-tagout', source_lesson_id: 'T18.L02' }]` | **BROKEN DAG EDGE / TERM NAME MISMATCH.** T18.L02 `vocabulary_introduced`: `['LOTO', 'energy isolating device', 'authorized employee (LOTO)', 'affected employee (LOTO)']`. The term 'LOTO' is registered, but 'lockout-tagout' (hyphenated, spelled out) is NOT registered as a separate entry. The T18.L02 lesson title is "Lockout/Tagout (LOTO)" and the Flashcard definition for 'LOTO' defines it as "Lockout/Tagout," so the substance is present — but the assumed term name differs from the introduced term name in a DAG-strict sense. Downstream lessons may assume 'lockout-tagout' and fail a vocabulary lookup against vocabulary_introduced. |
| F6 | **LOW** | L03:306 | "OSHA interpretation letter 1993-05-19 (osha.gov)" — invoked to assert that 1910.268(o) supersedes 1910.146 for routine telecom manhole work | **[NEEDS VERIFICATION].** The legal conclusion (1910.268 as specific standard supersedes 1910.146 per 1910.5(c)(1)) is correct in principle and well-established. The specific OSHA interpretation letter dated 1993-05-19 could not be independently verified from primary source. OSHA maintains a searchable interpretation letters database at osha.gov/laws-regs/standardinterpretations. The letter may exist but was not confirmed. Mark the citation `[needs verification]` or replace with the actual 1910.5(c)(1) regulatory text which is self-supporting. |
| F7 | **LOW** | L03:299 | "At 19.5% O₂ the brain starts working less well" | **IMPRECISE physiology.** 19.5% O₂ is the OSHA regulatory threshold for "oxygen-deficient atmosphere" (29 CFR 1910.146(b)). It is NOT the physiological cognitive impairment threshold. At 19.5% most healthy adults have no measurable cognitive impairment — physiological effects typically begin below 16–17% O₂. The 19.5% threshold is a regulatory buffer with safety margin. Stating "brain starts working less well at 19.5%" conflates the regulatory boundary with a physiological claim that is not accurate. Recommend: change to "19.5% O₂ is OSHA's regulatory threshold — a safety margin below normal atmosphere (20.9%). Effects on cognition begin below 16%; below 10% can cause loss of consciousness within minutes." The practical lesson (test before entry, don't trust senses) remains unchanged. |

---

## Verified clean (no finding)

| Item | Check | Verdict |
|------|-------|---------|
| L02 LOTO 6-step sequence | Matches 1910.147(d)(1)–(d)(6) | CLEAN |
| L03 O₂ thresholds (19.5% deficient / 23.5% enriched) | 1910.146(b) "acceptable entry conditions" | CLEAN |
| L03 CO limit `< 25 ppm` safe-level | Matches OSHA 1910.146 PEL context | CLEAN |
| L03 H₂S IDLH 100 ppm / safe < 1 ppm | NIOSH IDLH confirmed; 1 ppm consistent with OSHA exposure guidance | CLEAN |
| L04 4-foot fall trigger | 29 CFR 1910.268(g)(1) — poles, ladders in telecom | CLEAN |
| L04 6-foot trigger (1926 Subpart M) — correctly distinguished | 1926.502 — construction industry | CLEAN |
| L04 PFAS required in boom/basket | 1910.67(c)(2)(v) aerial lift PFAS requirement | CLEAN |
| L04 1,800 lbf max arrest force | 29 CFR 1926.502(d)(16) + 1910.268 PFAS provisions | CLEAN |
| L04 5,000 lbf anchor strength | 29 CFR 1926.502(d)(15) — static load; 2× max arrest force alternative | CLEAN |
| L05 PPG glove class voltage table (00 through 4) | ASTM D120 / 29 CFR 1910.137(a)(1) Table I-5 | CLEAN |
| L05 ANSI Z89.1 Class E = 20 kV | ANSI/ISEA Z89.1 Type I/II, Class E rating | CLEAN |
| L05 ANSI Z89.1 Class G = 2,200 V | ANSI/ISEA Z89.1 Type I/II, Class G rating | CLEAN |
| L05 EH boots per ASTM F2412/F2413 | Correct standard references | CLEAN |
| L05 Hi-vis: Class 2 daytime / Class 3 nighttime + high-speed | ANSI/ISEA 107 per MUTCD Part 6 requirements | CLEAN |
| L06 MUTCD 11th Edition (2023) cited | Correct current edition | CLEAN |
| L07 MAD WorkedExample disclaimer (⚠ IMPORTANT teaching approximation) | Prior RT-B fix verified applied | CLEAN |
| L07 Directs to OSHA MAD Calculator for field work | Correct protocol per 1910.269(l)(2) Appendix B | CLEAN |
| L08 Silica PEL 50 µg/m³ TWA | 29 CFR 1910.1053 (2016 rule, effective 2017) | CLEAN |
| L08 Old silica PEL 100 µg/m³ correctly labeled as superseded | Correct historical context | CLEAN |
| L09 8-hr fatality / 24-hr hospitalization+amputation+eye-loss timelines | 29 CFR 1904.39(a)(1)–(2) | CLEAN |
| L09 ≤10 employee recordkeeping exemption + 1904.39 still applies | 29 CFR 1904.1(a)(1) + 1904.39(b)(1) | CLEAN |
| L10 capstone: vocabulary_introduced [] + no Flashcard | Correct for capstone format | CLEAN |
| L01 prior RT-A fixes (L09 Sortable, L06 meta-ref, L07 disclaimer) | All three verified applied | CLEAN |
| Qualified vs competent vs authorized — distinct terms taught in L01 | Body distinctions present | CLEAN |
| 1910.268 as specific standard over 1910.146 principle | 1910.5(c)(1) correctly invoked | CLEAN |

---

## Coverage gaps vs ARCH.md T18 scope

| ARCH.md required element | Status |
|--------------------------|--------|
| PPE — gloves, hard hat, eye pro, EH boots, hi-vis | ✓ L05 |
| LOTO sequence + energy control | ✓ L02 |
| Confined space — 1910.268(o) / 1910.146 telecom exception | ✓ L03 |
| Fall protection — poles + aerial lifts | ✓ L04 |
| Traffic control — MUTCD flagging | ✓ L06 |
| MAD/MAB — energized conductors | ✓ L07 |
| Hazardous materials / SDS / GHS | ✓ L01 + L08 |
| Incident reporting + OSHA 300 | ✓ L09 |
| Hazard hierarchy + general duty clause | ✓ L01 |
| Book vs field — 1910.268 vs 1910.146 manhole exception | ✓ L03 |
| Capstone quiz | ✓ L10 |

No systematic coverage gaps. All ARCH.md gated elements are present. The methane error (F1) is a precision failure within present content, not a missing-topic gap.

---

## DAG broken-edge summary (F2–F5)

Four downstream vocabulary_assumed entries reference T18 with term names that don't match T18's vocabulary_introduced list:

| Assumed term | Assumed from | T18 vocab_introduced | Status |
|---|---|---|---|
| `safety zone` | T07.L01 → T18.L01 | not present | BROKEN |
| `fall protection` | T04.L01 → T18.L04 | not present (introduced as concept, not term) | BROKEN |
| `PPE` | T04.L01 → T18.L05 | not present | BROKEN |
| `lockout-tagout` | T04.L01 → T18.L02 | 'LOTO' present; 'lockout-tagout' not | NAME MISMATCH |

Recommended fix: add 'fall protection', 'PPE', and 'lockout-tagout' to their respective T18 lesson vocabulary_introduced arrays + add corresponding key_terms Flashcard cards (directive 18z). For 'safety zone' — either introduce it in T18.L01 or remove the assumption from T07.L01.

---

## Coverage gaps (what R-1 did not reach)

- T10 / T13 / T14 downstream vocabulary_assumed arrays not scanned (outside R-1 scope per dispatch; T08 not yet authored at time of this audit)
- ANSI Z359.0-2023 (definitions) vs Z359.11-2021 (PFAS design) edition differentiation not audited at sub-clause level — both referenced by citation only in L04
- MUTCD Table 6C-1 taper spacing arithmetic not independently re-derived (RT-B from prior wave verified directional correctness; arithmetic re-derive deferred to R-2)

=== T18 AUDIT R1 PRIMARY-SKEPTICAL END ===
