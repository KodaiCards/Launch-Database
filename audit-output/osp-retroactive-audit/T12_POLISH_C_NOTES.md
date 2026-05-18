# T12 Polish-C Notes
Commit: f244932

## Canonical items applied

**LOW T-1 — L12 ZDW range harmonized**
- BEFORE: key_terms + body both said "1302–1322 nm"
- AFTER: "1300–1324 nm (per ITU-T G.652.D Table 1)" — matches T02.L03, T02.L07, T02.L10, T02.L12 consistently
- T02 registry evidence: T02/L03 line 22, L07 line 19, L10 line 153, L12 line 174 — all use 1300–1324 nm

**LOW T-2 — L13 splice term added to blockquote and WorkedExample**
- BEFORE: `Max loss = (n_connectors × 0.75 dB) + (L_km × 0.4 dB/km)` — splice term missing from formula display
- AFTER: `Max loss = (n_connectors × 0.75 dB) + (L_km × 0.4 dB/km) + (n_splices × 0.3 dB)` in blockquote
- WorkedExample updated: added n_splices=8 variable, splice_budget=0.3 variable; steps now show splice calculation (8 × 0.3 = 2.40 dB); answer updated to 10.20 dB; sanityCheck updated to explain splice budget contribution
- key_terms definition for 'TIA-568 channel loss model' already correctly included splice term — no change needed there

**LOW T-3 — L04 EDZ/ADZ body qualifier added**
- BEFORE: body prose listed "EDZ: ≈ 0.5–2 m" and "ADZ: ≈ 3–8 m" with only "(5–30 ns)" pulse qualifier in header
- AFTER: explicit sub-range qualifier "(narrow-pulse sub-range; full EDZ range across all pulse widths: 1–5 m)" and "(narrow-pulse sub-range; full ADZ range across all pulse widths: 3–10 m)"
- key_terms already had full ranges (1–5 m / 3–10 m) — body now consistent with key_terms
- AnnotatedDiagram annotations updated to match (were showing "narrow pulse widths" without the full range)

## Neighborhood scan findings
- No other cross-topic numeric inconsistencies found between T12 and T02
- L12 quiz questions verified: PMD 0.2 ps/√km, PMD calculation 0.18×√120=1.97 ps both correct
- L13 quiz q1 formula result (6×0.75 + 20×0.4 = 4.50+8.00 = 12.50 dB) correct; no splice term in that quiz question since it uses the simpler TIA-568 premises model (n_splices not given) — acceptable, the WorkedExample covers splice term
- L04 key_terms still use 1–5 m and 3–10 m as the full range — consistent with fix applied

## Vite build: ✓ built in 6.95s
## Validator: 15/15 PASS
