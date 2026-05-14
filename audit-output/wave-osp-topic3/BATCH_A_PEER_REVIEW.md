# OSP Topic 3 Batch A — Peer Cross-Check Report

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Scope:** Lessons 3.1–3.4 — Auditor A (math/citation) × 4 findings + Auditor B (adversarial RUS PM) × 7 findings
**Role:** Independent peer arbitration before red team

---

## Stack Snapshot

Eleven findings across both auditors — four from Auditor A (L3.4 math/citation focus) and seven from Auditor B (real-world RUS PM practice lens). Zero direct overlaps confirmed. Both audits are internally consistent; their scopes are genuinely complementary. Three findings warranted independent verification of cited line ranges against actual content before tagging. One downgrade applied (B-Finding #2). No findings rejected as false-positive. Combined canonical list carries 2 HIGH, 5 MED, 4 LOW.

---

## Consolidated Findings Table

| # | Source | Severity (final) | Category | Lesson | Location | Issue | Peer Tag | Peer Rationale |
|---|---|---|---|---|---|---|---|---|
| 1 | A1 | HIGH | Math / Answer Tagging | 3.4 | `04-aerial-route-design.md` L279–289 | `[CORRECT]` on 5.1 ft; formula yields 6.125 ft; correct value absent from option set | **AGREE** | Independently verified: L285 B-rationale reads "6.125 ft ≈ 6.1 ft. The closest answer option to 6.1 ft is 5.1 ft" — this is a published error, not a placeholder; 5.1 ft is factually wrong answer tagged correct. Severity HIGH confirmed. |
| 2 | B1 | HIGH | Critical Gotcha / Practice Gap | 3.3 | `03-nesc-clearances-row-requirements.md` L117–119 | Joint-use fee structure (make-ready + annual attachment fees) entirely absent from joint-use section | **AGREE** | Verified L119: joint-use definition ends at "Joint-use attachment positions must comply with NESC Rule 238." No cost, make-ready, or fee structure language present anywhere in the section. RUS-context learner budget impact is real. HIGH confirmed. |
| 3 | A2 | MEDIUM | Rationale Coherence | 3.4 | `04-aerial-route-design.md` L284–285 | Option A rationale inserts unexplained `÷ 2.5` fragment mid-sentence and breaks off | **AGREE** | Verified L284: "S = 0.180 × 350² / (8 × 450) = 22,050 / 3,600 ≈ 6.1 ft ÷ 2.5... Let the correct derivation show the error" — the fragment is live in published source, not a draft artifact. Confusing at best, actively wrong at worst (implies a divide-by-2.5 step). |
| 4 | A3 | MEDIUM | Internal Consistency | 3.4 | `04-aerial-route-design.md` L86, L101 | Body states EDS 20–25% RTS; worked example uses 18% EDS, falling below stated lower bound | **AGREE** | Verified: L86 states "EDS ≤ 20–25% RTS"; L101 states "EDS at 59°F: 18% RTS." No inline note in the worked example explains the 18% as intentionally conservative or as a deliberate exception. Auditor B confirmed this during reading but did not flag it independently — corroborates finding as real. |
| 5 | B3 | MEDIUM | Outdated / Incomplete Practice | 3.3 | `03-nesc-clearances-row-requirements.md` L119 | No mention of NESC Rule 261 make-ready pole loading analysis requirement before joint-use attachment is permitted | **AGREE** | Verified L119: joint-use paragraph ends with NESC Rule 238 citation only. Rule 261 loading analysis and pole-replacement cost exposure are absent. Complementary to B1 (fee structure); both gaps are in the same joint-use paragraph. Red team should evaluate whether one combined fix addresses both B1 and B3. |
| 6 | B4 | MEDIUM | RUS Compliance Gap | 3.3 | `03-nesc-clearances-row-requirements.md` L115–130 | RUS-financed projects require RUS-approved easement form language (Form 770 / 515c); only generic easement types described | **AGREE** | Verified: L115–130 covers fee-simple / utility easement / joint-use distinctions accurately, but no RUS-specific form language requirement appears anywhere in L3.3. 1751F-630 §4 is already cited; RUS form requirement is a natural corollary that is missing. MED severity appropriate — this is a compliance trap for RUS-financed learners. |
| 7 | B2 | MEDIUM | Plausibility Trap / Climate | 3.4 | `04-aerial-route-design.md` L44–52 | Extreme Wind treated as a footnote "check the map" rather than co-equal concern for SE/Gulf Coast geography | **AGREE-WITH-DOWNGRADE** | Verified L52: "An additional Extreme Wind district applies in coastal areas where hurricane-force winds drive the design; the heavy-district ice load is replaced by a higher wind pressure. Check the NESC loading district map." Content is factually accurate and does say to check the map. The geographic framing criticism is valid — a learner in coastal Georgia could under-weight it — but the content does not actively mislead; it omits regional emphasis. Downgraded MED → LOW. The content already correctly describes the district; a one-sentence regional emphasis note is the fix, not a correctness fix. |
| 8 | A4 | LOW | Platform Build Note Exposure | 3.4 | `04-aerial-route-design.md` L289 | Platform build note still present in lesson source ("reconstruct all four answer options…") | **AGREE** | Verified L289: full platform build note present in parenthetical at lesson source level. LOW severity appropriate — not a learner-facing error if the LMS strips markdown parentheticals, but a publishing risk that should be removed before platform delivery. Linked to A1 — both are resolved by the same option-set reconstruction. |
| 9 | B5 | LOW | Survey Methodology Gap | 3.2 | `02-field-survey-methodology.md` L88–105 | WAAS GPS ±3 ft described without flagging compound error budget with 811 mark accuracy (±3–10 ft) — may imply GPS alone can resolve a utility conflict | **AGREE** | Verified L89 (reconnaissance) and L97 (design survey). The design survey level correctly specifies "survey-grade GPS or total station (±0.1 ft)" but the reconnaissance section implies WAAS-grade is sufficient documentation. Auditor B's compound error framing is valid for the reconnaissance context. LOW severity appropriate. |
| 10 | B6 | LOW | Right-Answer / Wrong-Reason Risk | 3.1 | `01-pre-survey-desk-research.md` L156–159 | NWP 12 cited as default permit path without noting conditions, acreage limits, or suspension history | **AGREE** | Verified L157 B-rationale: "Nationwide Permit 12 for most OSP utility crossings, subject to conditions." The "subject to conditions" qualifier is present but insufficient — no acreage limit (≤0.1 ac fill), no suspension risk, no "confirm with USACE district" language. The qualification in source is there but too thin for practical use. LOW confirmed. |
| 11 | B7 | LOW | Outdated Practice Signal | 3.1 | `01-pre-survey-desk-research.md` L97 | Railroad permit lead time listed as "90 days"; Class I railroads routinely run 6–12 months | **AGREE** | Verified L97: fatal-flaw table row reads "Identify railroad owner; initiate permit process 90 days before construction" — flat 90-day lead time with no distinction between short-line and Class I. This will cause schedule misses. LOW confirmed; easy one-line fix. |

---

## Disposition Summary

**Raw input:** Auditor A = 4 findings, Auditor B = 7 findings → **11 total, 11 unique** after overlap check

**Overlap check — confirmed zero direct overlaps:** Auditor B acknowledged this in their report; verified during peer review. A3 (EDS inconsistency) was noted by Auditor B as "independently noticed" but not independently filed — it is Auditor A's finding, not a duplicate. B1 and B3 both point to the joint-use paragraph but flag different missing content (fee structure vs. pole loading analysis) — they are distinct findings targeting different sentences of the same paragraph; both stay.

**Final severity distribution:**
- HIGH: 2 (A1, B1)
- MEDIUM: 4 (A2, A3, B3, B4) — B2 downgraded from MED to LOW
- LOW: 5 (A4, B2-downgraded, B5, B6, B7)

**Disagreements / downgrades:**
- **B2 → AGREE-WITH-DOWNGRADE (MED → LOW):** Extreme Wind "footnote" framing. Content correctly identifies Extreme Wind as an additional district and instructs the learner to check the map. The gap is geographic emphasis, not factual error. A one-sentence regional framing note is the fix; this does not warrant a MED content-correctness rating.

**Upgrades:** None.

**False-positives / DISAGREE:** None.

**DUPLICATE:** None.

---

## Recommended Red-Team Focus Areas

1. **A1 + A2 + A4 (L3.4 Q2 option set, garbled rationale, platform note) — treat as a linked cluster.** All three are resolved together by reconstructing the Q2 option set. Red team should verify that the proposed fix (correct answer = 6.1 ft / 6.125 ft; four new distractors per build note) produces exactly one internally consistent answer AND that the Option A rationale, once corrected, cleanly explains WHY 2.4 ft is wrong without the `÷ 2.5` artifact. The risk is that a fix-agent patches the `[CORRECT]` tag without reconstructing the distractor set, leaving an option set where no answer actually matches the correct value.

2. **B1 + B3 (joint-use paragraph, L3.3 L119) — single paragraph, two missing practice elements.** Both findings point to the same joint-use sentence. Red team should independently re-read the full joint-use section (L117–119) and assess whether a single expanded paragraph can address both fee structure (B1) and make-ready loading analysis (B3) without making the lesson overlong. Verify that any added text does not contradict the NESC Rule 238 citation already present or introduce an inconsistency with the AHJ section.

3. **B4 (RUS easement form requirement, L3.3 L115–130) — RUS compliance gap.** The finding is valid and easy to agree with conceptually, but the fix shape (add RUS Form 770 / 515c reference) should be verified against actual RUS Bulletin 1751F-630 §4 language before the fix-agent adds it. Red team should confirm whether 1751F-630 §4 specifically requires Form 770 by name or whether the requirement flows from the loan agreement terms, so the fix text is accurate rather than plausible.

---

=== TOPIC 3 BATCH A PEER REVIEW END ===
