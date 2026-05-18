# T12 Post-Fix RT-γ — Pedagogy Framing
**Wave:** T12 retroactive audit post-fix verification  
**SHA verified:** `c0d6bd2`  
**Framing:** Pedagogy / learner-progression / vocabulary-coherence  
**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/T12_POSTFIX_RT_G_PEDAGOGY.md` written.

---

## Per-Finding Verification

### MED-1: G.652.D spec max 0.40/0.30 dB/km — VERIFIED ✓

**L13 Foundations (~line 107):** "spec max of 0.40 dB/km @ 1310 nm and 0.30 dB/km @ 1550 nm" — correct.  
**L13 Advanced (~line 212):** "≤ 0.40 dB/km at 1310 nm, ≤ 0.30 dB/km at 1550 nm" for conservative budget bound — correct.  
**Typical datasheet range 0.32–0.36 / 0.18–0.22 dB/km preserved separately** — distinction maintained cleanly.  
**Registry check:** ITU-T G.652.D entry in citation-registry.md verified fresh (2026-05-17). No re-lookup needed.  
**Verdict: VERIFIED — no regression, pedagogically clear.**

---

### MED-2: EXFO AN342 systematic-bias claim reframed for singlemode — VERIFIED ✓

**L01 Standards section (~line 296):** AN342 citation now includes explicit caveat: "systematic bias effects documented in AN342 are predominantly a multimode concern; singlemode plant with bidirectional OTDR averaging shows much closer agreement with OLTS." — correct.  
**L01 key_terms / Flashcard / Working prose:** Searched for "0.25 dB systematic", "whole-link bias" — none found. Reframed correctly.  
**L07 Advanced (~lines 205–218):** Residual difference attributed to "IOR group index uncertainty, connector reflections at the launch point, or slight differences in measurement reference conditions rather than a predictable systematic offset." — correct.  
**Cascade sweep:** Grep for "AN342", "0.25 dB", "systematic bias" across all T12 L01–L15: only L01 (source citation, correctly caveated) and L07 comment line (source citation reference). Zero substantive "0.25 dB whole-link" claims remain.  
**Registry check:** EXFO AN342 entry in citation-registry.md present (2026-05-18, Fix Wave A), multimode-only caveat captured.  
**Verdict: VERIFIED — 7 locations correctly reframed, no regression.**

---

### LOW-1: L03 dynamic range Flashcard added — VERIFIED ✓

**L03 lines ~121–123:** Flashcard `T12-L03-fc-dynamicrange` present with front "What is OTDR dynamic range and how do you increase it?" and back describing dB difference from backscatter to noise floor, with √N averaging improvement.  
**Schema validator:** `T12/L03` = PASS.  
**Verdict: VERIFIED.**

---

### LOW-2: 47 DAG pointers normalized — VERIFIED (with 1 residual LOW)

**Schema validator T12:** 15/15 PASS, 0 warnings.  
**DAG registry rebuild:** OTDR/OLTS vocabulary_assumed pointers now correctly point to T01.L08 (confirmed by fresh registry build). G.652.D → T02.L01, MFD → T02.L01, macrobend → T02.L04, etc. all per fix notes.  

**RESIDUAL LOW — L10 EIOR double-declaration:**  
`T12.L10` declares `'EIOR'` in both `vocabulary_introduced` AND `vocabulary_assumed` (with `source_lesson_id: 'T12.L03'`). DAG registry shows `DUPE: "eior" introduced by: T12.L03, T12.L10`. A term cannot be simultaneously first-introduced in L10 AND assumed from L03 — these are mutually exclusive. Fix: remove `'EIOR'` from L10's `vocabulary_introduced` array (L03 owns the first-introduction; L10 EXPANDS the concept of bulk vs. EIOR, but the base term was already introduced).  
This is a NEW LOW not caught by Fix Wave A (the normalization to short-form 'EIOR' exposed the pre-existing double-declaration when DAG rebuild ran).

**Verdict: LARGELY VERIFIED — residual LOW (L10 EIOR double-declaration).**

---

### LOW-3: L11 IEC 61300-3-35 Zone B 120µm → 115µm in 3 locations — VERIFIED ✓

**L11 line 4 comment:** "Zone B = 110 µm (NOT 120 µm)" — documents the fix.  
**L11 prose (~line 108):** "115 µm (per IEC 61300-3-35 prior editions)" — correct.  
**L11 Zone B outer boundary:** current edition correctly stated as "25–110 µm" for 2022 Ed.3.  
**Grep for "120.*µm":** zero occurrences in L11 prose (only in comment line 4 as "NOT 120 µm" negative reference).  
**Registry check:** IEC 61300-3-35:2022 Ed.3 entry present (2026-05-18), 115µm prior-ed / 110µm current-ed distinction captured.  
**Verdict: VERIFIED — 3 locations corrected.**

---

## Cascade-Pattern Scan (§14e step-1)

Checked all known patterns from `known-cascade-patterns.md` against Fix Wave A's changes:

| Pattern | Status |
|---|---|
| P1 — 47 CFR §32.2210 mis-citation | Not applicable to T12 |
| P2 — H₂S IDLH cascade (safety value replacement) | Not applicable to T12 (no confined-space content) |
| P3 — ANSI Z359 sub-number swap | Not applicable to T12 |
| P4 — Fabricated numeric cascade (OM5 28000) | Not applicable — T12 numeric replacements are G.652.D attenuation + IEC 61300-3-35 boundaries; both primary-source verified in registry |
| P5 (if catalogued) — citation correction introducing wrong value | Fix Wave A replaced 120µm → 115µm for prior edition; registry entry confirms 115µm correct. No cascade risk. |

No cascade-pattern regressions detected from Fix Wave A.

---

## Independent Gap Research — Under-audited Lessons

Sampled L10 (IOR) and L12 (PMD/CD) which had minimal coverage in prior RT framings:

**L10 bulk IOR value:** "1.4677 at 1310 nm" for G.652.D. Plausible (typical fiber datasheets quote 1.466–1.470 for G.652 at 1310 nm; 1.4677 is within range). Registry has no entry for this specific value — informational, not a standards-normative claim.

**L12 G.652.D PMD coefficient:** "0.2 ps/√km" for G.652.D vs "0.5 ps/√km" for G.652A/C. Correct per ITU-T G.652 subpart D. Comment line 3 notes "R-2 correction X-3 applied" confirming prior fix. Registry ITU-T G.652.D entry is fresh.

**L12 CD value at 1550 nm:** "CD ≈ 17 ps/(nm·km)" for G.652.D at 1550 nm — correct per ITU-T G.652.D (nominal 17 ps/(nm·km) at 1550 nm, range 15–20 depending on wavelength).

**L12 PMD/CD vocabulary introduced in both T02.L03 and T12.L12:** DAG DUPE warning for CD, PMD, DGD. Same architecture decision as OTDR/OLTS — T12 expands the measurement context beyond T02's introduction. Acceptable re-introduction pattern; no new DAG pointer bugs.

No material independent gaps found in under-audited L10/L12.

---

## Negative Findings (confirmed clean)

- **MED-1 regression check:** No instances of 0.35/0.20 or 0.32/0.18 values labeled as "spec max" in L13.
- **MED-2 regression:** No "0.25 dB whole-link" or "systematic offset" claims remain in any T12 lesson.
- **Vite build:** `✓ built in 7.20s` — zero errors, zero warnings.
- **Schema validator:** 15/15 PASS, 0 warnings.
- **L01 OTDR/OLTS vocabulary_assumed:** correctly points to T01.L08 post-fix.

---

## Findings Summary

| # | Severity | Finding |
|---|---|---|
| G-1 | LOW | L10 EIOR double-declaration: `vocabulary_introduced` contains `'EIOR'` AND `vocabulary_assumed` has `{ term: 'EIOR', source_lesson_id: 'T12.L03' }` — mutually exclusive. Remove EIOR from L10 vocabulary_introduced. |

---

## Verdict: **YELLOW**

5 of 5 canonical items from Fix Wave A verified GREEN. One residual LOW surfaced (L10 EIOR double-declaration) that survived normalization. No cascade-pattern regressions. Vite build clean. Schema validator 15/15 PASS.

**Saturation hint for RT-δ:** single LOW remaining (L10 EIOR). Under-audited lessons L05 (ghost reflections), L08 (reading OTDR trace), L09 (macrobend dual-wavelength) have had minimal framing coverage. Suggest technical-accuracy framing for RT-δ with explicit rotation to those three lessons. Saturation likely after RT-δ clears L05/L08/L09 + resolves G-1.

=== T12 POSTFIX RT-γ PEDAGOGY REPORT END ===
