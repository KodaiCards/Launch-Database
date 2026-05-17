# T14 Post-Author RT-β — Real Technical Verification
**Framing:** technical / cascade-defense / primary-source-first  
**Wave state:** Post-Polish-B `134bd9a`  
**Date:** 2026-05-17  
**Write-path constraint acknowledged:** only `audit-output/osp-retroactive-audit/T14_POSTAUTH_RT_B_REAL_TECHNICAL.md` written.

I am doing T14 RT-β technical verification — not authoring, not Polish, not other topics.

---

## 1. NEC §250.52(A)(4) Ring Electrode — burial depth + conductor size

**Claimed in L04:** 30 inches (2.5 ft), 2 AWG bare copper, 20 ft total length, per NEC §250.52(A)(4).

**Primary-source verification (UpCodes / NFPA 70 2023):**
- NEC §250.52(A)(4) = Ground Ring. Specs: "depth of at least 30 inches (762 mm), at least 20 feet of bare copper conductor not smaller than 2 AWG." ✓
- NOT §250.52(A)(3) — that is the concrete-encased electrode (Ufer).
- The lesson's citation of §250.52(A)(4) for the ring electrode is **correct**.
- 30 in / 2 AWG / 20 ft are all **correct**.

**VERIFIED — no finding.**

---

## 2. DAG pointer audit: MGN / IBT / GES → claimed source lessons

**DAG registry output (after `build-dag-registry.js`):**

| Lesson | Term | Claimed source | Actual introducer | Status |
|--------|------|----------------|-------------------|--------|
| L04 | GES | T14.L01 | T01.L08, T19.L06 | **BROKEN** |
| L06 | GES | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L06 | IBT | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L07 | GES | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L07 | IBT | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L09 | GES | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L10 | GES | T14.L05 | T01.L08, T19.L06 | **BROKEN** |
| L03 | MGN | T14.L02 | T01.L08, T19.L06 | **BROKEN** |
| L11 | MGN | T14.L02 | T01.L08, T19.L06 | **BROKEN** |

**Root cause:**
- T14.L01 `vocabulary_introduced` = `['grounding', 'bonding', 'fault current', 'equipotential', 'ground potential rise']` — does NOT include GES.  
- T14.L05 `vocabulary_introduced` = `['PBB', 'SBB', 'bonding conductor']` — does NOT include GES or IBT.  
- T14.L02 `vocabulary_introduced` not checked but DAG registry confirms MGN is formally introduced in T01.L08, not T14.L02.

**Correct pointer for GES, IBT, MGN:** `T01.L08` (confirmed: T01.L08 `vocabulary_introduced` = `['MGN', 'IBT', 'GES', ...]`).

**FINDING DAG-1 — MED — 9 broken DAG pointers across L03/L04/L06/L07/L09/L10/L11**

---

## 3. NEC pointer claim: `source_lesson_id: 'T01.L01'`

Multiple T14 lessons claim NEC as introduced in T01.L01. But T01.L01 `vocabulary_introduced` = `['OSP', 'ISP', 'outside plant', 'inside plant', 'demarcation point', 'headend', 'OLT', 'ONT', 'RUS', 'BICSI']` — does NOT include NEC. NEC is introduced in T01.L08 (`vocabulary_introduced` line 25 confirmed).

Affected lessons: L01, L04, L05, L06, L07, L08, L10.

**FINDING DAG-2 — MED — 7 lessons point NEC to T01.L01; correct source is T01.L08**

---

## 4. IEEE 81 edition currency

**Claimed:** IEEE 81-2012 §9.3 and §9.4 throughout L06.  
**Verification:** IEEE Standards SA confirms IEEE 81-2012 is the current active edition (no 2022 or later revision found on standards.ieee.org / ieeexplore.ieee.org).  

**VERIFIED — no finding. IEEE 81-2012 is current.**

---

## 5. IEEE Std 1100 edition

**Claimed:** IEEE Std 1100-2005 `[confirm edition]` in L01 and L04.  
**Verification:** IEEE SA shows IEEE 1100-2005 was ANSI withdrawn 2016-08-19 and inactivated 2021-03-25. No successor edition found. The `[confirm edition]` marker is present in both citations, which is the correct defensive stance.

**Status:** The `[confirm edition]` marker handles this correctly for a withdrawn standard. No new finding beyond the existing marker.

**VERIFIED with note — no new finding. `[confirm edition]` marker is correct.**

---

## 6. Math / numerics in L06 (62% rule, fall-of-potential)

Independent re-derivation:

- **Current probe distance:** 5 × rod length = 5 × 8 ft = **40 ft**. Lesson states 40 ft. ✓  
- **62% rule at C2 = 40 ft:** 0.62 × 40 = **24.8 ft**. Lesson states 24.8 ft. ✓  
- **±10% validation check (L06 quiz Q3):** Reading 18 Ω; ±4 ft probe movement gives 17.8–18.2 Ω. Variation = (18.2 − 17.8) / 18 × 100 = 2.2%. The lesson says "well within the ±2% threshold." Actually 2.2% > 2%. This is a borderline discrepancy — the accepted field practice for the ±10% probe-movement test is that readings should vary less than ±2% of the measured value, not absolute 2%. The computed range (17.8–18.2) represents ±1.1% variation from 18 Ω (not 2.2%). The quiz answer is mathematically correct: (18.2 − 18)/18 = 1.1%, not 2.2%. Lesson is correct.
- **WorkedExample JS formula:** `p2Distance = (c2Distance * 0.62).toFixed(1)` — correct.

**VERIFIED — all math correct.**

---

## 7. NESC Section 09 / 1320 ft ground interval

**Claimed in L11:** NESC C2-2023 Section 09 [confirm from NESC §9 / RUS 1751F-630 §7]; WorkedExample default = 1320 ft.  

**Status:** NESC C2 is paywalled. The lesson correctly marks the interval as `[confirm NESC C2-2023 Section 09 interval — paywalled; verify via RUS 1751F-630 §7]`. The 1320 ft value (= 0.25 mile, one electrode per quarter-mile) is a commonly cited RUS practice default and is used only as the WorkedExample slider default — not stated as a hard fact. The defensive `[confirm]` marker is correctly placed.

**LOW NOTE:** The 1320 ft default in the WorkedExample would benefit from a parenthetical like "(1320 ft = 0.25 mile; a common RUS default — confirm your specific project's bulletin)" to make clear it is an example value, not the verified NESC minimum. Current language could be misread as a stated code requirement.

**LOW-1 — LOWseverity — L11 WorkedExample default 1320 ft lacks explicit "example value, confirm" parenthetical in the slider label.**

---

## 8. Cascade-pattern sweep (known-cascade-patterns.md)

Checked all patterns in known-cascade-patterns.md against T14:

| Pattern | T14 check | Result |
|---------|-----------|--------|
| P1: §32.2210/§32.2410 FCC Part 32 | No 47 CFR citations in T14 | CLEAN |
| P2: H₂S IDLH value | T14 is bonding/grounding, no atmospheric values | CLEAN |
| P3: Z359.4 citation substitution | T14 has no Z359 citations | CLEAN |
| P4: Fabricated OM5 EMB numeric | No fiber-physics numerics in T14 | CLEAN |
| P5: Biden PM FR page number | No FR citations in T14 | CLEAN |
| P6: OM1/OM2 Flashcard render | Not T02 content | CLEAN |
| P7: G.655/G.656 missing | Not fiber-physics content | CLEAN |
| P8: DAG pointer cross-topic (T05 L07) | Checked — BROKEN pointers found above (DAG-1/DAG-2) | FLAGGED |
| P9: §32.2410/§32.2411 | No 47 CFR citations in T14 | CLEAN |
| P10: FCC §1.141x | No FCC §1.141x citations in T14 | CLEAN |
| P11: FCC order currency (18-111) | No FCC order citations in T14 | CLEAN |

---

## 9. Vite build + validator + DAG

- **Vite build:** ✓ 131 modules compiled, 0 errors, 6.11s
- **Schema validator T14:** 12/12 PASS, 0 FAIL, 0 WARN
- **DAG registry:** 9 BROKEN T14 pointers (GES×5, IBT×2, MGN×2, NEC×7 — total 16 broken source_lesson_id claims)

---

## Findings summary

| ID | Severity | Lesson(s) | Issue | Fix shape |
|----|----------|-----------|-------|-----------|
| DAG-1 | MED | L04, L06, L07, L09, L10 | GES/IBT pointer → T14.L01 or T14.L05; should be T01.L08 | Change `source_lesson_id` for GES (L04/L06/L07/L09/L10) and IBT (L06/L07) from T14.L01/T14.L05 → T01.L08 |
| DAG-2 | MED | L03, L11 | MGN pointer → T14.L02; should be T01.L08 | Change `source_lesson_id` for MGN in L03 and L11 from T14.L02 → T01.L08 |
| DAG-3 | MED | L01, L04, L05, L06, L07, L08, L10 | NEC pointer → T01.L01; should be T01.L08 | Change `source_lesson_id` for NEC from T01.L01 → T01.L08 in all 7 affected lessons |
| LOW-1 | LOW | L11 | 1320 ft WorkedExample default lacks "example value, confirm" parenthetical | Add "(1320 ft = 0.25 mile; example only — confirm from NESC C2-2023 §9 or RUS 1751F-630 §7)" to slider label |

---

## Confirmed clean (no findings)

- NEC §250.52(A)(4) ring electrode specs: 30 in / 2 AWG / 20 ft — **correct**
- IEEE 81-2012 edition — **current and correct**
- IEEE Std 1100-2005 `[confirm edition]` marker — **correctly defensive**
- L06 fall-of-potential math: 5× current probe, 62% potential probe, ±1.1% validation — **all correct**
- Schema compliance: 12/12 PASS
- Vite build: clean
- FCC cascade patterns: none applicable
- Content cascade patterns: none applicable

---

## Verdict

**YELLOW**

Three MED DAG-pointer issues (DAG-1/DAG-2/DAG-3). No content errors, no math errors, no citation fabrications. The DAG BROKEN pointers are mechanical fixes (change `source_lesson_id` values). One LOW for L11 slider label clarity.

**Saturation assessment:** This RT-β covered different surfaces than RT-α (pedagogy framing). DAG-1/2/3 are infrastructure-class bugs that RT-α (pedagogy framing) would not have looked for. After a polish fixing DAG-1/2/3 + LOW-1, this topic should be GREEN. A final-verify RT-α + RT-β pair after polish is recommended per wave-completion discipline.

=== T14 POSTAUTH RT-B REAL TECHNICAL REPORT END ===
