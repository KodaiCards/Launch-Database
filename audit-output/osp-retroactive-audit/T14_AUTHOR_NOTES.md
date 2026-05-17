# T14 Author Notes — Bonding, Grounding & Electrical Protection

**Wave:** T14 Author Wave  
**Date:** 2026-05-17  
**Agent:** T14 Author (general-purpose, Sonnet)  
**Write-path allowlist:** `osp-training/src/lessons/T14/*.jsx` + this file  

---

## Lessons Authored

| ID | Title | Tier | Interactivity | Status |
|----|-------|------|---------------|--------|
| L01 | Why We Ground | foundations | Quiz (4Q) | ✓ |
| L02 | MGN Multi-Grounded Neutral | working | AnnotatedDiagram + Quiz | ✓ |
| L03 | Messenger Bonding Rules | working | WorkedExample + Quiz | ✓ |
| L04 | NEC 250.52 Electrodes | working | Quiz | ✓ |
| L05 | IBT and GES | working | AnnotatedDiagram + Quiz | ✓ |
| L06 | Ground Resistance Testing (IEEE 81) | working | AnnotatedDiagram + WorkedExample + Quiz | ✓ |
| L07 | Surge Arresters & Lightning Protection | working | AnnotatedDiagram + Quiz | ✓ |
| L08 | Stray Voltage Detection | working | BranchingScenario + Quiz | ✓ |
| L09 | Cathodic Protection Basics | working | Quiz | ✓ |
| L10 | RUS Bonding Schedule + Ground Test Log | advanced | WorkedExample + Quiz | ✓ |
| L11 | NESC Grounds Per Mile | advanced | WorkedExample + Quiz | ✓ |
| L12 | Capstone Quiz | capstone-quiz | Quiz (20Q) + WorkedExample + BranchingScenario | ✓ |

---

## Citation Registry Usage

### Used from registry (skip re-verify):
- NEC §250.52(A)(1)(3)(4)(5) — verified by registry
- NEC §250.56 — verified by registry  
- NEC §250.94 — verified by registry
- NEC §770.93, §770.100 — verified by registry
- NESC C2-2023 Rule 92, 96, 96C, 96F, 97 — verified by registry
- OSHA 29 CFR §1910.147, §1910.268, §1910.333 — verified by registry
- RUS 1751F-630 §7 — verified by registry
- RUS 1751F-635 §5 — verified by registry

### Net-new citations (not in registry at time of authoring):
- IEEE 81 §9.3, §9.4 — fall-of-potential test procedure; PAYWALLED standard; cited with section references per NFPA/ANSI availability
- IEEE Std 1100 §1.2–1.3, §8.3, §8.5, §8.6 — Emerald Book; recommend registry addition
- Telcordia GR-1275 §5 — 5 Ω threshold; cited as [confirm edition] per brief guard
- NACE SP0169 (now AMPP SP0169) — cathodic protection; cited with [confirm current edition] guard
- TIA-607-D §4 — IBT/GES bonding requirements; PAYWALLED; cited with [confirm edition] guard
- RUS 1751F-815 — discrete bulletin existence unconfirmed; all refs marked [Confirm 1751F-815 or fallback to 1751F-630 §7] per brief authoring guard

---

## Author Guards Applied

1. **RUS 1751F-815:** Not confirmed as discrete bulletin. All L10 references use fallback chain (1751F-630 §7 + 1751F-635 §5 + 1751F-810) with `[Confirm 1751F-815 section numbers from current USDA RUS bulletin index]` markers. RT must verify.

2. **NECE Section 09 interval (NESC C2-2023):** Standard is paywalled. L11 WorkedExample uses 1320 ft (¼ mile) default per RUS 1751F-630 §7 cross-ref; marked `[confirm NESC C2-2023 Section 09 interval — paywalled; verify via RUS 1751F-630 §7]`.

3. **NACE SP0169 → AMPP SP0169:** Cited consistently as `NACE SP0169 (now AMPP SP0169 [confirm current edition])` throughout L09. RT should verify edition year.

4. **Carter L6.9 reframe:** Applied to L08 — no MAD tables, no PPG glove-class math. LOTO-first primary mitigation; PPG as supplement. BranchingScenario has "apply PPG without LOTO" as danger path, correct LOTO sequence as success path.

5. **AnnotatedDiagram src paths:** Used `/training/assets/diagrams/t14-*.svg` placeholder paths. Actual SVG assets do not exist yet (documented limitation in CLAUDE.md self-improvement log). RT should flag these as known-incomplete-UX.

---

## DAG Prerequisites Verified

- L01: assumes OSP (T01.L01), fiber/sheath/messenger/armor (T01.L03), pole/NESC/joint-use (T01.L02), safety (T18.L01)
- L08: assumes LOTO (T18.L02) — correctly points to T18 LOTO lesson
- L09: assumes pedestal (T06.L05), burial-depth/duct (T06.L02) — checked dag-registry.json
- L12 capstone: vocabulary_assumed covers all 38 T14-introduced terms with correct source lesson pointers

---

## Known Issues for RT

1. **Paywalled standards (NESC Section 09, IEEE 81, TIA-607-D):** Cannot primary-source verify section numbers. All cited with [confirm] guards. RT must verify against available sources.
2. **AnnotatedDiagram placeholders:** SVG assets needed for T14 diagrams (L02 pole cross-section, L05 building entry, L06 fall-of-potential, L07 protection chain). Production-grade visuals need image pipeline.
3. **L11 NESC interval figure:** Used ¼ mile (1320 ft) as default. If NESC C2-2023 Section 09 specifies a different interval, L11 WorkedExample defaults and explanatory prose need update.
4. **Form 219 grounding section:** Referenced in L10 but section number not cited (RUS form numbering requires confirmation). RT should verify.

=== T14 AUTHOR NOTES END ===
