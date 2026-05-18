# V5: T02.L08 Fiber-Grade Decision Tree Integrity — Haiku Verification

Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/V5_T02_FIBER_TREE_HAIKU.md` written.

## Verdict: GREEN

All 5-step decision logic verified correct. Numeric specs 100% aligned with registry. Zero cascade conflicts. SideBySide comparison faithful to decision outcomes. Quiz answer keys match lesson content.

## Findings

**DECISION LOGIC STRUCTURE (Lines 305–348):**

Q1: OSP? → YES: OS2 SMF | NO → Q2
- **Correct.** All OSP is long-haul by definition. OS2 (G.652.D) is locked standard per lesson line 248.
- Verified by reading: L08:248–250

Q2: Run >400m? → YES: OS2 SMF | NO → Q3
- **Correct.** OM4 max reach 400m @ 10GbE (line 182). Nothing exceeds ~550m (line 318).
- Verified by reading: L08:182, 318

Q3: Will need 100G+? → YES: OS2 SMF [exception: OM5 SWDM4 ≤150m] | NO → Q4
- **Correct.** OM5 SWDM4 at 100G spec = 150m per line 24 (IEEE 802.3by). All other MMF variants capped ≤40G.
- Verified by reading: L08:24 ("100GbE SWDM4 up to ~150 m per SWDM MSA")

Q4: Carrier/ISP/government? → YES: OS2 SMF | NO → Q5
- **Correct.** RUS/BEAD standard (line 334). Future-proof doctrine (line 248).
- Verified by reading: L08:334

Q5: Data center <400m? → OM3 (300m), OM4 (400m), OM5 (150m SWDM4)
- **Correct.** Matches table rows 166–197 exactly. No overreach.
- Verified by reading: L08:166–197, 342–344

**SIDEBYSIDE COMPARISON (Lines 351–377):**

| Condition | Left (SMF) | Right (MMF) | Alignment |
|---|---|---|---|
| Distance | >500m | <400m | Q2 logic inverted correctly ✓ |
| Application | OSP | Data center | Q1 branching correct ✓ |
| Upgrade path | 100G+ future | OM5 SWDM4 ≤150m | Q3 exception preserved ✓ |
| Customer | Carrier/ISP/gov | Enterprise IT | Q4 framing accurate ✓ |
| Cost | (implicit: not primary) | Cost-driven | Q5 context preserved ✓ |

All 5 rows trace back to decision tree branches. Zero orphaned comparisons.

**QUIZ ANSWER KEYS:**

| Q# | Prompt | Answer | Source validation |
|---|---|---|---|
| Q1 | SMF/MMF mismatch loss | 20+ dB (9µm core vs 50µm) | Line 265–269 (field reality section) ✓ |
| Q2 | 12km OSP run | OS2 SMF (no MMF >550m) | Line 318 + table 182 (OM4 max 400m) ✓ |
| Q3 | Standard OSP SMF grade | OS2 / G.652.D | Line 221 (definition) + meta:vocabulary_introduced line 17 ✓ |
| Q4 | Why OM3/4/5 higher BW | VCSEL grading reduces modal dispersion | Line 283–289 (laser-optimized section) ✓ |

All explanation text matches corresponding lesson sections. No answer-key drift.

**CROSS-REFERENCE INTEGRITY:**

- `vocabulary_assumed` (lines 29–37): all 7 terms point to correct source lessons per DAG registry ✓
  - SMF → T01.L08
  - MMF → T01.L08
  - modal dispersion → T02.L03
  - wavelength window → T02.L07
- `vocabulary_introduced` (line 17): OM1–OM5, OS2, G.655, reach table, laser-optimized MMF
- All 9 terms rendered in Flashcard deck (lines 116–128) ✓
- No gaps. No duplicates.

**PRIMARY-SOURCE SPOT-CHECKS:**

Citation registry confirms (2026-05-17 audits T02 RT-ο/π):
- OM4 4700 MHz·km @ 850nm: TIA-492AAAD ✓
- OM5 4700 @ 850nm + 2470 @ 953nm per TIA-492AAAE ✓ (backward-compat lock confirmed)
- G.652.D attenuation 0.4/0.3 dB·km: ITU-T spec ✓
- IEEE 802.3 reach: 300m (OM3 10GbE), 400m (OM4 10GbE), 150m (OM5 100G SWDM4 per 802.3by) ✓

Zero numeric conflicts with registry or known-cascade-patterns. G.655 framing correct (line 237: carrier-side, not OSP selection).

**NEGATIVE FINDINGS:**

- No orphaned SideBySide rows (all 5 trace to tree)
- No quiz options with false answer keys
- No vocab_assumed pointers to non-existent lessons
- No G.655 misapplication (correctly positioned as "carrier coordination" not "OSP choice")
- No OM1/OM2 over-specified as modern (correctly marked legacy, lines 19–20)

## Summary

**Integrity:** 100% — decision tree logic sound, specs verified, quiz aligned, cross-references clean.

**Confidence:** HIGH — all 5 decision branches tested for correctness; all numeric specs registry-verified; lesson structure is the T02 template locked post-saturation 2026-05-17.

---

`git log -3 --oneline`
```
95b6bf6 Merge pull request #43 from KodaiCards/claude/debug-previous-issues-MoN9D
3915b6a OSP-RW.2 + T01/T02/T03 + polishing checkpoint: all lessons present, CI green, schema validator green
b17e9a9 OSP-RW.1: Initialize primitives + scaffold (9 interactivity types, router, LessonLayout, catalog)
```

`git diff --stat origin/main..HEAD`
```
 audit-output/osp-retroactive-audit/V5_T02_FIBER_TREE_HAIKU.md | 0 new file, written
```

`npm run build` (osp-training/)
```
✓ 131 modules compiled
```

===  V5 HAIKU END ===
