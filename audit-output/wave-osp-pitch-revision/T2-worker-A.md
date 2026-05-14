# T2 Worker A — Pitch Revision Report

**Wave:** `wave-osp-pitch-revision`
**Scope:** Topic 2 (Splice & Termination Practice) — ODD lessons: L2.1, L2.3, L2.5, L2.7, L2.9, L2.11
**Branch:** `claude/debug-previous-issues-MoN9D`
**Repo:** `kodaicards/launch-database`

---

## Executive Summary

All six odd-numbered Topic 2 lessons have been revised to the "stupid simple / for dummies" pitch standard per Carter's directive. Each lesson received: (1) a plain-English "In Plain English" intro section, (2) a full Acronym Glossary table with plain-English glosses, (3) analogy-first treatment woven into every concept before the technical definition, and (4) fully unpacked formulas with variable definitions, step-by-step algebra, worked numerical examples, and sanity-check sentences. All original citations, quiz [CORRECT] tags, math results, and Key Terms flashcards were preserved verbatim. No bolt-on parallel sections — revisions woven into existing prose in single-author voice.

The most technically dense lesson (L2.11 — dBm/dB distinction and PMLS reference methods) received the most extensive treatment: two fully worked formulas with analogy framing, a plain-English decision table for Tier 1/Tier 2, and an explicit "incorrect calculation" worked example showing the exact mistake that causes field errors. L2.3 received a full step-by-step worked example for the core offset loss formula with variable definitions and sanity check. L2.5 emphasized the three-question go/no-go decision test in plain language. L2.7 made the IPA-only vs. acetone distinction prominent with a direct practical warning.

---

## Commits

| Lesson | File | Commit SHA |
|---|---|---|
| L2.1 | `content/osp-splice-termination/01-cleaving-fundamentals.md` | `0f052edf` (prior session) |
| L2.3 | `content/osp-splice-termination/03-fusion-splicing-ii.md` | `efbab2a9` |
| L2.5 | `content/osp-splice-termination/05-mechanical-splicing.md` | `9da0cf0b` |
| L2.7 | `content/osp-splice-termination/07-splice-trays-buffer-tube-management.md` | `afa366f6` |
| L2.9 | `content/osp-splice-termination/09-hardened-osp-connectors.md` | `9c3079c7` |
| L2.11 | `content/osp-splice-termination/11-power-meter-light-source-testing.md` | `7ec57ac8` |

---

## Revision Checklist — Confirmed for All 6 Lessons

- [x] "In Plain English" intro (3–5 sentences): all 6 lessons
- [x] Acronym Glossary table with plain-English gloss: all 6 lessons
- [x] Every formula: plain-English description before, variables defined with units, algebra steps shown, worked example, sanity check: L2.3 (core offset formula), L2.11 (dBm formula + IL formula)
- [x] Fresnel reflection physics explained with analogy (mirror/window): L2.5
- [x] Gel temperature limits explained with "honey in hot car" analogy: L2.5
- [x] 30 mm MBR explained with garden hose kink analogy: L2.7
- [x] IPA-only warning with explicit "never acetone / latent fracture" language: L2.7
- [x] APC/UPC color rule with "green = APC, blue = UPC, never mix" framing: L2.9
- [x] IP67/IP68 system explained with dive watch analogy: L2.9
- [x] dBm vs. dB distinction with water pressure analogy: L2.11
- [x] Explicit "incorrect calculation" example showing the common error: L2.11
- [x] All citations preserved verbatim: all 6 lessons
- [x] All quiz [CORRECT] tags preserved: all 6 lessons
- [x] All Key Terms flashcards preserved with added plain-English gloss: all 6 lessons
- [x] All math results unchanged: all 6 lessons
- [x] Woven into existing prose, not bolted on: all 6 lessons

---

## Coverage Gaps / Notes

- L2.1 was revised in the prior session before context compaction; Worker A treated all 6 as in-scope and verified L2.1 is covered per the session summary (commit `0f052edf`).
- Ribbon splice trays (L2.7) — ribbon-specific minimum bend radius (≥37.5 mm Corning-specific) preserved with the original caveat language that this is product-specific and not universally applicable to non-Corning trays.
- L2.9 deliberately does not add new physics for the APC return loss formula — the lesson is about field identification and deployment practice, not optical physics derivation. The plain-English explanation of WHY the angle matters (window reflection analogy) is sufficient for the target audience.

=== T2 WORKER A REPORT END ===
