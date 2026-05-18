# T12 Final-Verify-2 RT-η — Pedagogy Framing
**Wave:** post-Polish-B `fb92e9b`
**Scope:** verify 3 Polish-B fixes + cumulative regression sample
**Framing:** pedagogy / learner clarity / formula consistency
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T12_FINALVERIFY_2_RT_H_PEDAGOGY.md` written.**

---

## Polish-B Fix Verification

### Fix 1 — L04 ghost formula `(n+1)×D` (MED Z-1)

**Verified reading:** `L04-dead-zones-edz-and-adz.jsx:255–266`

```jsx
Ghost distance = (n + 1) × D, where D = distance from OTDR port to the primary reflector,
and n = 1, 2, 3... (the ghost number).
  1st ghost (n = 1): (1 + 1) × D = 2 × D
  2nd ghost (n = 2): (2 + 1) × D = 3 × D
  3rd ghost (n = 3): (3 + 1) × D = 4 × D
Example: Connector A at 120 m.
Ghost 1 = 2 × 120 m = 240 m. Ghost 2 = 3 × 120 m = 360 m.
```

**VERIFIED.** Formula is internally consistent: n=1→2D (240 m), n=2→3D (360 m), n=3→4D (480 m). The prior `2×D×N` would have yielded: n=1→2D (correct), n=2→4D (wrong — skips 360 m, jumps to 480 m), n=3→6D. Fixed formula is pedagogically unambiguous and matches the L05 reference at line 75: *"Those ghosts follow a predictable distance rule (2×, 3×, etc.)"* — consistent.

Quiz Q3 at line 308 and explanation at line 312 also reference `2 × 250 m = 500 m` (n=1 case) — consistent with corrected formula.

### Fix 2 — L09 G.652.D cable vs bare-fiber distinction (LOW E-1)

**Verified reading:** `L09-macrobend-detection-dual-wavelength.jsx:150–181`

```jsx
<td>G.652.D (standard singlemode)</td>
<td>30 mm bare fiber (IEC 60793-2-50); OSP cable: typically 240–320 mm (20× OD for 12–16 mm cable) ²</td>
<td>40 mm bare fiber; OSP cable: per cable spec sheet ²</td>
...
² G.652.D cable vs. bare-fiber distinction: The 30 mm / 40 mm values are IEC 60793-2-50
bare-fiber mandrel test specs... An OSP cable assembly (loose-tube, 12–18 mm OD) has a
much larger minimum bend radius: typically 20× OD during installation...
Field note: A G.652.D fiber inside a 2.0 mm drop cable has a different effective minimum
bend radius than in a 0.9 mm tight-buffer.
```

**VERIFIED.** Distinction is clear and well-woven. The footnote ² correctly explains bare-fiber vs cable-assembly distinction. The field note adds practical application. Pedagogically the two-tier table is exactly what a field crew needs — the IEC spec for the glass strand, and the real-world cable spec for routing decisions. The G.657 rows retain plain bare-fiber specs (appropriate — FTTx drop cables are close to bare-fiber specs by design, per footnote ¹ at line 166).

### Fix 3 — GR-196-CORE citation registry addition (LOW E-2)

**Verified reading:** `citation-registry.md` line 107.

```
| GR-196-CORE | Generic Requirements for OTDR Type Equipment | https://telecom-info.telcordia.com/ | 2026-05-18 | T12 Polish-B | PAYWALLED. EDZ spec: distance from start of reflection to point where trace recovers within 0.5 dB of backscatter baseline. Cross-confirmed by EXFO AN194, VIAVI, FOA. |
```

**VERIFIED.** Entry correctly marks it PAYWALLED, notes the cross-verification sources, and accurately characterizes the EDZ definition. EDZ definition in L04 key_terms (`line 43`) matches the registry entry verbatim — internally consistent.

---

## Cumulative Regression Sample

**L11 UPC/APC spec (Polish-A fix):** Checked for reflectance spec regression. L11 discusses IEC 61300-3-35 zone-based pass/fail and contamination effects — no UPC clean reflectance value found hardcoded in the lesson (value was removed from inline prose during Polish-A, leaving the pass/fail criteria in zone grades). No regression detected.

**L13 acceptance criteria (earlier-wave item):** TIA-568.3-D channel loss formula at lines 99–100 (`0.75 dB/connector + 0.4 dB/km`) intact. Worked example at lines 123–128 computes 7.80 dB correctly. No regression.

**Schema validator:** 15/15 PASS, 0 WARN. All lessons retain key_terms, Quiz, Flashcard.

**Vite build:** clean (`✓ built in 6.95s`), zero errors.

---

## New Findings

| # | Sev | Item | Location | Notes |
|---|---|---|---|---|
| — | — | None found | — | No new pedagogy defects identified |

---

## Verdict: **GREEN**

All 3 Polish-B fixes verified correct and pedagogically clear. Formula is internally consistent across L04 and L05. Cable/fiber distinction in L09 is field-practical and well-explained. Registry entry accurate. Build clean, schema 15/15. No regressions in sampled earlier-wave items.

**Saturation verdict:** RT-ζ (technical) found 1 MED (ghost formula) which Polish-B fixed. This RT-η (pedagogy) finds zero new items. Two consecutive RT pair finding zero new items across different framings = **SATURATION REACHED**. T12 may be closed.

=== T12 FINAL-VERIFY-2 RT-H PEDAGOGY REPORT END ===
