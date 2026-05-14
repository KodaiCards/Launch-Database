# Topic 2 Batch A Content Verification — Lessons 2.1–2.4

**Date:** 2026-05-14
**Verifier:** Content Red-Team Agent
**Branch:** claude/debug-previous-issues-MoN9D
**Scope:** content/osp-splice-termination/01–04-*.md + BATCH_A_REPORT.md

---

## Stack Snapshot

Four lessons (2.1–2.4) covering cleaving, single-fiber fusion splicing (×2), and mass-fusion ribbon splicing. ~20,700 words total. Every lesson includes quiz, interactive, final check, and key terms. Primary risks: loss-budget math, margin framing, citation scope, cross-lesson arc parameter consistency, vendor parity.

---

## Findings Table

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| F1 | MEDIUM | Math / Framing | `02-fusion-splicing-i.md` | ~115–116 | "splice loss contribution at BICSI default (1.2 dB) consumes **67% of the available margin** (1.8 dB)" | Margin percentage is logically inverted. The 1.8 dB is the post-splice remaining margin, not the baseline against which splice loss should be measured. Correct denominator is headroom above cable loss (12.6 − 9.6 = 3.0 dB); splice loss = 1.2 / 3.0 = **40%**, not 67%. 1.2 / 1.8 = 67% is mathematically derived but directionally wrong — it implies splice loss is larger than the surviving margin, creating a distorted risk picture for learners. | Replace with: "The splice loss contribution (1.2 dB) consumes **40% of the headroom above cable loss** (3.0 dB available above cable-only loss of 9.6 dB), leaving 1.8 dB margin." | HIGH |
| F2 | LOW | Citation Scope | `01-cleaving-fundamentals.md` | ~55–63, 120–121, 147–148 | "IEC 61300-3-35 §4.1" (cleave angle acceptance thresholds) | IEC 61300-3-35 governs **connector** end-face geometry (scratches, chips, pits, protrusion). Applying it as the governing reference for fusion splice **cleave angle thresholds** is a scope stretch. Manufacturer specs (Fujikura FSM-series, Sumitomo Type-82C) and BICSI OSP-DRD Ch. 7.4 are the appropriate primary citations for cleave angle pass/fail in fusion splicing. The L2.1 glossary entry for IEC 61300-3-35 acknowledges it also covers fusion splice acceptance, but that conflation may confuse learners who later encounter the standard and find it focused on connectors. | Retain the standard as a supplementary reference but demote it from primary; add a parenthetical "(end-face geometry; also applied to cleave angle criteria by industry convention)" or replace as primary with "Fujikura FSM-series acceptance criteria; BICSI OSP-DRD Ch. 7.4." | MEDIUM |
| F3 | LOW | Cross-Lesson Consistency | `02-fusion-splicing-i.md` + `03-fusion-splicing-ii.md` | L2.2 ~49; L2.3 ~105 | L2.2: "Most single-fiber SMF programs specify a gap in the range of 10–18 µm" / L2.3 re-arc: "marginally elevated (typically 0.10–0.20 dB)" | No direct contradiction, but L2.3 lists re-arc eligibility range as "0.10–0.20 dB" while the decision tree diagram in L2.3 labels the branch simply "Loss > threshold." The range 0.10–0.20 dB appears in the rationale for Q1 as "typical working guidance," but the body text at the Accept/Re-arc/Re-splice section does not state the upper bound explicitly. A learner following the body text alone would not know re-arc is not appropriate at, say, 0.35 dB estimated. The Pulse 1 answer in L2.3 uses "marginally elevated (e.g., 0.10–0.20 dB)" which does imply the range. Minor internal ambiguity, not a factual error. | Add "re-arc is most effective for marginally elevated loss in the 0.10–0.20 dB range; for losses above ~0.20 dB, re-arc is unlikely to resolve the deficit and re-splice should be considered directly" to the re-arc body paragraph in L2.3. | MEDIUM |
| F4 | LOW | Vendor Neutrality | `01-cleaving-fundamentals.md` | ~165–168 (Card 4 of flashcard set) | "[Fujikura CT-30A Manual, §5.1]" (only citation on blade rotation mechanism card) | Flashcard Card 4 on blade rotation mechanism cites only Fujikura CT-30A Manual. The reading content and other questions correctly cite Sumitomo FC-6S Guide §4.3 alongside Fujikura for the same topic. Inconsistency in citation parity on this one card. Not a factual error; Sumitomo FC-6S uses the same rotation-counter mechanism. | Add "Sumitomo FC-6S Guide, §4.3" to the citation on Card 4's back. | LOW |

---

## Verified Clean

**Lesson 2.1 — Cleaving Fundamentals**
- All four failure mode definitions (hackle, mist, lip, angle error) and root causes: internally consistent, aligned with cited Fujikura CT-30A §6 and IEC 61300-3-35 §4 descriptions.
- Cleave angle thresholds table (0.5° / 1.0° / 1.5° for single-fiber fusion / ribbon / mechanical): consistent across reading content, key terms, quiz, flashcards, and pulse questions. No discrepancy across any instance.
- Blade life range (4,000–16,000 cleaves): consistent across reading and key terms.
- Q1 [CORRECT] answer (B: re-cleave at 0.7° for single-fiber fusion): correct per 0.5° threshold. Distractors correctly mapped to mass-fusion (1.0°) and mechanical (1.5°) thresholds.
- Q3 blade life scenario (15,800 / 16,000, 24-splice closure needing 60–80 cleave cycles): logic sound; 200 remaining is genuinely insufficient. Rationale for option A correctly calls out minimum 48 cycles plus re-cleaves.
- Q6 alternating hackle/mist root cause (contamination diagnosis): technically correct — changing failure mode across consecutive cleaves without parameter change points to a surface-state variable (contamination), not a mechanical variable. Rationale for why reducing tension (C) doesn't resolve contamination-caused hackle is accurate.

**Lesson 2.2 — Fusion Splicing I**
- Worked loss budget (24 km / 12 splices / 10GBASE-LR): cable 9.6 dB + splices 1.2 dB = 10.8 dB; margin 1.8 dB. Arithmetic correct.
- Interactive scenario (38 km / 8 splices / 40GBASE-LR4): cable 15.2 dB + splices 0.8 dB = 16.0 dB; fails 14.4 dB budget. Typical recalculation (0.35 dB/km): 13.3 + 0.8 = 14.1 dB; margin 0.3 dB. At 0.05 dB/splice: 13.3 + 0.4 = 13.7 dB; margin 0.7 dB. All arithmetic confirmed correct.
- Q2 (30 km / 18 splices / 10GBASE-LR): cable 12.0 + splices 1.8 = 13.8 dB; fails 12.6 dB by 1.2 dB. Confirmed correct.
- Pulse 3 (20 km / 10 splices / 10GBASE-LR): 8.0 + 1.0 = 9.0 dB; margin 3.6 dB. Confirmed correct.
- Q2 distractor D correctly identifies 14.4 dB as the 40GBASE-LR4 budget, not 10GBASE-LR. Technically accurate catch.
- Altitude arc parameter direction (reduce current at altitude): correct — lower pressure → higher ionization efficiency → more heat per unit current → must reduce.
- PAS vs. LID vs. cladding alignment descriptions: internally consistent and differentiated correctly. LID use case (specialty fibers, non-concentric cores) is accurate.
- Estimated loss systematically underestimates OTDR-measured loss: factually correct and consistently stated.

**Lesson 2.3 — Fusion Splicing II**
- QA decision tree logic: consistent with reading content, quiz, and pulse questions. Accept/re-arc/re-splice branches are logically sound.
- Re-arc contraindications (bubble, core offset, deformation, repeat re-arc): correctly and consistently stated across body, key terms, quiz, and pulse.
- Bubble behavior (cannot be annealed out in service at −40°C to +70°C vs. 1900°C softening point): factually correct.
- Splice protection sleeve cooling step (30–60 seconds): consistent across reading, Q2, Q5, and Pulse 3.
- Dopant diffusion explanation (invisible to camera, explains estimated vs. OTDR gap): consistent across L2.2 and L2.3 — no cross-lesson contradiction.
- Electrode wear compensation: Fujikura automatic loop vs. Sumitomo ARC CHECK manual cycle described at parity in both L2.2 and L2.3.
- Q4 scenario (PAS estimated 0.03–0.06 dB → OTDR 0.05–0.09 dB): correct interpretation stated (expected relationship, all pass ≤0.10 dB).

**Lesson 2.4 — Mass-Fusion Splicing**
- Q4 math (432 ÷ 12 = 36 cycles × 10 min = 360 min): confirmed correct.
- Pulse 3 math (576 ÷ 12 = 48 cycles × 9 min = 432 min): confirmed correct.
- Comparison table (288F: 24 ribbons × 10 min = 240 min; 288 fibers × 4.5 min = 1,296 min): confirmed correct.
- Q4 option A rationale: correctly notes that 18 cycles could apply to 24-fiber ribbon (432 ÷ 24 = 18) — internally consistent, helpful disambiguation.
- Ribbon preparation sequence (6 steps): correct and logically ordered; Pulse 1 answer on consequence of reversing steps 2/3 is accurate.
- Mass-fusion loss range (0.05–0.15 dB) vs. single-fiber PAS (0.02–0.05 dB): consistent across reading, key terms, quiz Q5, and L2.2 cross-reference.
- Temperature gradient effect (edge fibers higher loss than center): correct, consistently stated.
- Vendor parity: Fujikura FSM-60R/70R/90R and Sumitomo Type-71M+ cited at parity throughout reading, key terms, and quiz.
- ANSI/TIA-598-D 12-color fiber sequence: correct (Blue through Aqua, positions 1–12).
- UV-cure vs. thermal-cure matrix removal methods: correct differential (mechanical vs. chemical solvent).

---

## Coverage Gaps

1. **Actual standard text not verified** — per task scope, did not validate IEC 61300-3-35, IEC 61300-3-4, BICSI OSP-DRD chapter text, or IEEE 802.3ae/ba loss budgets against original documents. Citation plausibility assessed by scope match only.
2. **Interactive drag-and-drop UI mechanics** — verified the correct sequence and feedback text; did not assess the learning management system rendering or interaction behavior (out of scope for content verification).
3. **Lesson 2.3 QA decision tree diagram rendering** — verified the ASCII-art decision tree logic is correct; rendering fidelity in the target LMS platform not checked.

---

=== TOPIC 2 BATCH A CONTENT VERIFICATION END ===
