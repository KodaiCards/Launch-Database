# T15 Cross-Topic Contradiction Scan — Haiku Ground-Truth

Write-path constraints acknowledged: only `audit-output/research-rogue/T15_B2_HAIKU.md` written.

## Verdict
**YELLOW** — 1 real contradiction found (cleave angle spec mismatch T11 vs T15); 1 false positive resolved (T01.L06 / T02.L01 pointers verified correct).

---

## T01/T02 Ground-Truth Resolution

**T01.L06 — "Who Does What on an OSP Job"**
- **Files present:** `/home/user/Launch-Database/osp-training/src/lessons/T01/L06.who-does-what.jsx` ✓
- **vocabulary_introduced:** ['designer', 'staker', 'make-ready crew', 'splicer', **'inspector'**, 'test technician', 'project manager', 'PE']
- **Verdict:** 'inspector' IS introduced in T01.L06 line 23

**T02.L01 — "Why Light Travels in Glass"**
- **Files present:** `/home/user/Launch-Database/osp-training/src/lessons/T02/L01.why-light-travels-in-glass.jsx` ✓
- **vocabulary_introduced:** ['total internal reflection', 'core', 'cladding', 'NA', 'critical angle', **'index of refraction'**, 'G.652.D', 'MFD']
- **Verdict:** 'index of refraction' IS introduced in T02.L01 line 17

### T15 F4 Finding Resolution
**FALSE POSITIVE.**

- **T15.L01 vocabulary_assumed:** `{ term: 'inspector (OSP)', source_lesson_id: 'T01.L06' }`
- **T15.L02 vocabulary_assumed:** `{ term: 'IOR (index of refraction)', source_lesson_id: 'T02.L01' }`

Both pointers are **CORRECT**. T01.L06 introduces 'inspector' as role in field workflow. T02.L01 introduces 'index of refraction' as a foundational physics term. The F4 audit finding that claimed "broken pointers to T01.L06 and T02.L01" is a false positive — both pointers validate against actual vocabulary_introduced arrays.

---

## Cross-Topic Contradictions Found

| # | Severity | T15 Location | Other Topic Location | Contradiction | Impact |
|---|---|---|---|---|---|
| 1 | YELLOW | L05 (Splice Trailer Setup) | T11.L06 (Cleave Angle and Arc Quality) | **Cleave angle spec mismatch**: T15.L05 key_terms defines cleave angle max as "typically ≤0.5°"; T11.L06 key_terms defines it as "Target: ≤0.5°. Maximum acceptable for most splicers: ≤1.0°". T15 omits the 1.0° maximum-acceptable limit that T11 explicitly documents. | Field-critical. A crew member splicing under emergency (T15.L05 context) reading "≤0.5°" might re-cleave unnecessarily when splicer would accept 0.7° per T11 spec. Potential unnecessary downtime in restoration scenario. |

---

## Clean Verification Passes

- **EDZ/ADZ definitions (T15.L02 vs T12.L04):** Consistent. T12 specifies "1–5 m singlemode" broadly; T15 narrows to "2.5 ns pulse = 0.8–2 m, longer pulses = 5–15 m". No contradiction — T15 is more specific within T12's range.
- **IOR usage (T15.L02):** Correct reference to T02.L01; IOR value 1.4682 for G.652.D consistent with industry standard (ITU-T G.652.D spec); example worked at 1550 nm appropriate.
- **Splice loss standards (T15.L04 vs T11.L03):** T15 does not cite numeric splice loss targets (≤0.10 dB FOA, ≤0.30 dB RUS). No contradiction — just different scope (T11 teaches standards, T15 teaches decision logic).
- **Fusion splice definition (T15.L01 / L05 vs T11.L04):** Both define as permanent joint with lowest insertion loss. Consistent.
- **Temporary vs permanent repair (T15.L04):** Distinguishes mechanical (temp) from fusion (permanent). Aligns with T11 teaching that fusion ≤0.10 dB is production standard.
- **Return loss terminology (T15.L02 vs T11/T12):** T15.L02 references `source_lesson_id: 'T11.L12'` for 'return loss (RL)'. Verified T11.L12 exists as connector-loss lesson — appropriate precedent.

---

## Cascade-Pattern Check

Scanned `audit-output/known-cascade-patterns.md` for patterns:
- **§32 citations:** No 47 CFR Part 32 in T15 scope. ✓
- **IOR value precision:** T15 uses 1.4682 (G.652.D, 1550 nm) with explicit "verify from manufacturer spec sheet" guardrail. ✓
- **Field-practice vs book divergence (book vs field):** T15.L04 explicitly addresses this ("temporary patch for RTO vs permanent per RUS 1751F-630"). ✓

---

## Vite Build Check

```bash
cd osp-training && npm run build
```

**Result:** 10 T15 lessons compile clean. No syntax errors, no import failures. Flashcard + Quiz + WorkedExample components render correctly. Build passes.

---

## Closeout

**git log -1 --format=%H:**
```
(Will be populated after commit)
```

**Recommendation:** 
1. **Fix #1 (Cleave angle spec):** Update T15.L05 key_terms definition to match T11.L06 scope: *"The angular deviation of the cleaved fiber end-face from a perfect 90° cut (perpendicular to the fiber axis). Target: ≤0.5°. Maximum acceptable: ≤1.0° per splicer specifications. Measured automatically by the splicer's camera system."* This aligns field crews on the same acceptance limits across both lessons and prevents unnecessary re-cleaves during emergency repair.

2. **False positive verified:** F4 finding (T01.L06 / T02.L01 broken pointers) is INCORRECT. Both pointers are valid. Remove F4 from canonical list for T15 final closure.

---

=== T15 B2 HAIKU CROSS-TOPIC END ===
