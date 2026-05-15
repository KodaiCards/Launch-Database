# T08 Lessons Post-Fix RT
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

7 of 8 fixes applied correctly. F1 (L07 Q1 arithmetic → $5,094.50), F2 (L01 DAG corrections), F3 (L03 clearance source_lesson_id), F4 (NECA expansion), F5 (L03 drag-match), F6 (L09+L11 Book-vs-Field), F8 (§1.1413 [confirm section] markers) all verified clean. F7 is partially applied: the key_terms definition, flashcard back, and "High contingency" bullet were harmonized to 10–20%, but L07 line 178 still reads "Industry norm: 10–15% for straightforward MRE; up to 20% if…" — the specific prose the RT-A canonical finding flagged. Vite build passes clean.

## Per-finding verification table

| # | ID | Expected fix | Commit | Verified | Notes |
|---|---|---|---|---|---|
| 1 | F1 | L07 Q1 → $5,094.50 | `dd4fdb2` | ✓ CORRECT | choices[2]='$5,094.50', answerIndex:2, explanation shows $4,430+$664.50=$5,094.50. Math re-derived independently: $1,200+$2,340+$890=$4,430; ×0.15=$664.50; total=$5,094.50. |
| 2 | F2 | L01 vocabulary_assumed DAG | `19036c4` | ✓ CORRECT | `pole attachment→T05.L08`, `make-ready→T07.L06`, `pole owner→T05.L08`, `transfer→T07.L06`. T05.L08 introduces pole owner + pole attachment; T07.L06 introduces make-ready flag, transfer — confirmed via vocabulary_introduced inspection. |
| 3 | F3 | L03 clearance → T05.L02 | `19036c4` | ✓ CORRECT | L03 vocabulary_assumed has `clearance→T05.L02`. T05.L02 is "Vertical Clearance Rule 232" — correct first-introduction lesson. |
| 4 | F4 | NECA → National Exchange Carrier Association | `5168096` | ✓ CORRECT | Zero "National Electrical Contractors" hits in all T08 files. "National Exchange Carrier Association" confirmed in L08 key_terms, L08 prose, L08 Q, L08 quiz explanation, L12 Q answer, L12 explanation. |
| 5 | F5 | L03 drag-match Quiz block | `5542b13` | ✓ CORRECT | `type:'drag-match'`, `prompt`, 3 `items`, 3 `targets`, `correctMap` present. Question count ≤6. Quiz primitive normalizes `type:'drag-match'` at line 52 of Quiz.jsx — field name valid. |
| 6 | F6 | L09+L11 Book-vs-Field callouts | `464b00f` | ✓ CORRECT | L09: labeled "Book vs. Field: Application Review Timelines" inside `data-tier="working"` — covers FCC 15-day clock vs. field 25–45 days. L11: labeled "Book vs. Field: CPM Float in Practice" inside `data-tier="working"` — covers CPM theory vs. utility schedule dominance. |
| 7 | F7 | L07 contingency range harmonized | `0e9257d` | ⚠ PARTIAL | key_terms definition, flashcard back, and "High contingency" bullet all updated to 10–20%. However L07 line 178 (WorkedExample component list item) still reads: "Industry norm: 10–15% for straightforward MRE; up to 20% if…" — the specific inconsistency the canonical finding cited. L12 Q08 explanation correctly says "(10–20%)". |
| 8 | F8 | §1.1413 [confirm section] markers | `0e9257d` | ✓ CORRECT | L02: 4 instances of `47 CFR §1.1413 [confirm section]` (lines 255, 402, 533, 549). L06: 2 instances (lines 354, 396). L03: 1 instance (line 427 via `5542b13` commit). All §1.1413 references carry marker. |

## Regression check

- All 12 T08 lessons parse + import cleanly: **yes** (Vite build processed all 12 files)
- Vite build clean: **yes** (✓ built in 4.45s, 0 errors; 1 pre-existing chunk-size warning unrelated to T08)
- L07 Q1 answer choices + answerIndex + explanation all internally consistent: **yes** (choices[2]='$5,094.50', answerIndex:2, explanation arithmetic correct)
- NECA expansion correct everywhere in T08: **yes** (zero "National Electrical Contractors" hits; "National Exchange Carrier Association" confirmed in all L08+L12 occurrences)
- Quiz field-name normalization preserved (prompt/choices/answerIndex/explanation): **yes** (0 violations; 3 grep hits were prose HTML text)
- New drag-match question structurally valid per Quiz schema: **yes** (type:'drag-match' normalized correctly by Quiz.jsx line 52)

## Coverage gaps

- L03 `pole owner→T05.L03` in vocabulary_assumed was not corrected (not in canonical F1 scope — F1 listed 4 L01 entries + 1 L03 clearance entry). Noted as pre-existing, out-of-scope for this fix wave.
- L07 WorkedExample prose line 178 is the only remaining canonical-finding gap (F7 partial). Fix is a single-line prose update.
- Did not exhaustively verify all 50+ flashcard backs across L04–L11 for verbatim definition matches (spot-check clean).
- Did not grep T08 for forward-references to terms from T10/T17 introduced later (out of scope for this fix wave; was not in the canonical 8).

## Overall verdict

YELLOW — 7 of 8 applied correctly. F7 is partially applied: the most visible prose instance of the "10–15%" wording (L07 line 178 WorkedExample component) was not updated. The key_terms and flashcard and "High contingency" bullet are now internally consistent at 10–20%, but the WorkedExample list item remains discrepant. This is a LOW-severity follow-up item requiring a single prose line change:

```
Line 178, current:
"Percentage applied to the labor-plus-materials subtotal. Industry norm: 10–15% for straightforward MRE; up to 20% if…"

Required fix:
"Percentage applied to the labor-plus-materials subtotal. Standard range: 10–20% of the labor-plus-materials subtotal. Contingency toward the low end (10–15%) on a fresh, detailed pole audit; contingency toward the high end (15–20%) if the audit is older than 12 months or the design area has known pole condition issues. Example: subtotal $2,840, contingency 15% = $426, total = $3,266."
```

=== T08 POST-FIX RT REPORT END ===
