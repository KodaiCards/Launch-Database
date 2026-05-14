# OSP Topic 3 Batch A — Red Team Canonical List

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Red Team Verification — READ-ONLY; produces canonical list for fix agent

---

## Stack Snapshot

All 11 peer-reviewed findings independently verified against lesson source lines. Two HIGH confirmed (math error live in published lesson; joint-use fee structure entirely absent). Four MED confirmed. Five LOW confirmed. Zero false-positives; zero rejections. One adjacent observation (fix-agent scope constraint on the A1+A2+A4 cluster). RUS Form 770 citation risk surfaced and resolved. Fix agent may proceed.

---

## Canonical Findings Table

| # | Source | Severity (FINAL) | Category | Lesson | Location | Issue | Red Team Status | Red Team Note |
|---|---|---|---|---|---|---|---|---|
| 1 | A1 | **HIGH** | Math / Answer Tagging | L3.4 | `04-aerial-route-design.md` L279–289 | `[CORRECT]` on B (5.1 ft); formula with given values (w=0.180, L=350, H=450) yields 6.125 ft; correct value absent from option set; Option B rationale says "closest to 6.1 ft is 5.1 ft" — a published wrong answer | **VERIFIED** | Independently confirmed L279 and L285. Option B explicitly tagged `[CORRECT]` and its own rationale calculates 6.125 ft, then rounds to 6.1 ft, then calls 5.1 ft "the closest" — the error is unambiguous and in the rationale, not just the tag. Severity HIGH confirmed. |
| 2 | B1 | **HIGH** | Critical Practice Gap | L3.3 | `03-nesc-clearances-row-requirements.md` L117–119 | Joint-use section silent on make-ready costs and annual attachment fees — no FCC pole-attachment rate context, no make-ready analysis trigger, no cost estimate range | **VERIFIED** | Confirmed L119 full stop at "Joint-use attachment positions must comply with NESC Rule 238." Flashcard at L172–173 also omits cost context. No mention anywhere in L3.3 of fee structure. This is a real-world budget blindspot for a RUS learner. HIGH confirmed. |
| 3 | A2 | **MEDIUM** | Rationale Coherence | L3.4 | `04-aerial-route-design.md` L284 | Option A rationale performs the correct formula, reaches 6.1 ft, appends `÷ 2.5` with ellipsis, then breaks off mid-sentence — nonsensical fragment, not a draft artifact | **VERIFIED** | Confirmed L284 verbatim: "= 22,050 / 3,600 ≈ 6.1 ft ÷ 2.5... Let the correct derivation show the error: see option B rationale for the full calculation." The `÷ 2.5` is not explained anywhere; the sentence is incomplete. This is live in published source. Linked to A1 — same option-set reconstruction resolves both. |
| 4 | A3 | **MEDIUM** | Internal Consistency | L3.4 | `04-aerial-route-design.md` L86, L101 | Body states EDS ≤ 20–25% RTS (L86); worked example uses 18% EDS (L101) — below stated lower bound, no explanatory note | **VERIFIED** | L86: "NESC and IEEE 1222 recommend EDS ≤ 20–25% RTS." L101: "EDS at 59°F: 18% RTS; cable RTS = 2,800 lb; H = 18% × 2,800 = 504 lb." No inline note. Neither "conservative" nor "intentional exception" language present. Inconsistency is real and unexplained. |
| 5 | B3 | **MEDIUM** | Outdated / Incomplete Practice | L3.3 | `03-nesc-clearances-row-requirements.md` L119 | No mention of NESC Rule 261 make-ready pole loading analysis requirement before joint-use attachment permitted | **VERIFIED** | L119 ends with NESC Rule 238 citation only. Rule 261 absent from entire L3.3 joint-use treatment. Note: this and B1 both target the same joint-use paragraph (L117–119). Fix agent should address both in one pass to avoid paragraph churn. |
| 6 | B4 | **MEDIUM** | RUS Compliance Gap | L3.3 | `03-nesc-clearances-row-requirements.md` L115–130 | RUS-financed projects require RUS-approved easement form language (Form 770); lesson describes easement types correctly but omits RUS form requirement | **VERIFIED — WITH SCOPE NOTE** | L115–130 confirmed: legally accurate easement type descriptions, three citations to RUS Bulletin 1751F-630 §4, but zero mention of approved form language or Form 770. **Scope note for fix agent:** 1751F-630 §4 is already cited in the lesson; the section title and its general mandate are there. However, this audit cannot independently confirm that 1751F-630 §4 text uses "Form 770" by that name (the bulletin text is not available in-repo). The fix agent should cite the requirement at the level already established — "RUS-approved easement form language, reference 1751F-630 §4" — without adding "Form 770" as a named artifact unless independently confirmed. Adding an unverified form number is a worse error than omitting it. |
| 7 | B2 | **LOW** | Plausibility Trap / Regional Framing | L3.4 | `04-aerial-route-design.md` L44–52 | Extreme Wind district described as a one-sentence footnote ("check the map") without regional emphasis for SE/Gulf Coast geography | **VERIFIED — SEVERITY DOWN CONFIRMED** | L52 confirmed: "An additional Extreme Wind district applies in coastal areas where hurricane-force winds drive the design; the heavy-district ice load is replaced by a higher wind pressure. Check the NESC loading district map." Content is factually accurate. Peer review's downgrade MED→LOW is correct: this is an emphasis gap, not a factual error. One sentence of regional context is the entire fix. |
| 8 | A4 | **LOW** | Platform Build Note Exposure | L3.4 | `04-aerial-route-design.md` L289 | Platform build note present in published lesson source | **VERIFIED** | Confirmed L289: full parenthetical platform build note present, including explicit reconstruction instructions and distractor values. LOW appropriate — not learner-facing if LMS strips parentheticals, but a publishing risk. Linked to A1 — removal is part of the same option-set reconstruction. |
| 9 | B5 | **LOW** | Survey Methodology Gap | L3.2 | `02-field-survey-methodology.md` L89 | WAAS GPS ±3 ft listed for reconnaissance without noting compound error budget against 811 marking accuracy (±3–10 ft) | **VERIFIED** | L89 confirmed: "WAAS-enabled, ±3 ft accuracy" for reconnaissance crew, no qualification. Design survey at L97 correctly specifies survey-grade GPS (±0.1 ft). The gap is real: a learner may not recognize that ±3 ft GPS + ±3–10 ft atlas marking = ±6–13 ft combined budget, insufficient for ±2 ft separation design work. LOW confirmed. |
| 10 | B6 | **LOW** | Right-Answer / Wrong-Reason Risk | L3.1 | `01-pre-survey-desk-research.md` L157 | NWP 12 cited as default OSP crossing permit with only "subject to conditions" qualifier — no acreage limits, no suspension risk language | **VERIFIED** | L157 confirmed: "Nationwide Permit 12 for most OSP utility crossings, subject to conditions." The qualifier is thin. An additional "confirm availability with USACE district" sentence resolves this without restructuring the rationale. LOW confirmed. |
| 11 | B7 | **LOW** | Outdated Practice Signal | L3.1 | `01-pre-survey-desk-research.md` L97 | Railroad permit lead time listed as flat "90 days" — Class I railroads routinely run 6–12 months | **VERIFIED** | L97 confirmed: fatal-flaw table row reads "Identify railroad owner; initiate permit process 90 days before construction." Flat value, no distinction by railroad class. Schedule risk is real for Class I routes. Straightforward table-cell update. LOW confirmed. |

---

## Rejected Findings

None. All 11 peer-reviewed findings confirmed real. Zero false-positives.

---

## Negative-Finding Spot-Checks

The following items were flagged clean by one or both auditors. Red team independently confirmed:

1. **L3.4 Q3 vector resultant math** — Auditor A and B both confirmed correct. Independently verified: F_net = √(380² + 380²) = √288,800 = 537.2 lb. L297 `[CORRECT]` on option C (537 lb). L303 rationale is complete and accurate. **CONFIRMED CLEAN.**

2. **L3.3 Q1 midspan clearance math** — Confirmed: 30 − 12.8 = 17.2 ft vs. 15.5 ft minimum. L212–217 rationale and tag consistent. **CONFIRMED CLEAN.**

3. **L3.3 drag-and-drop correct matches A→1, D→2, C→3, E→4, B→5** — Checked L202 against rule descriptions L189–194 and scenario descriptions L196–201. All five matches correct per NESC Rule assignments in lesson body. **CONFIRMED CLEAN.**

4. **L3.1 Q1 NWI/Section 404 logic** — L150–157 verified: flagging NWI polygons as fatal-flaw candidates for Section 404 review is the correct answer; proceeding to field survey without flagging is correctly marked wrong. Logic and BICSI/FHWA citations consistent. **CONFIRMED CLEAN.**

5. **L3.4 worked-example L_max arithmetic** — L109 formula: L_max = √(8 × 504 × 12.5 / 0.292) = √(50,400 / 0.292) = √172,603 ≈ 415 ft. Independently verified: 8 × 504 × 12.5 = 50,400; 50,400 / 0.292 = 172,603; √172,603 = 415.5 ft ≈ 415 ft. **CONFIRMED CLEAN.** (This contrasts directly with Q2's error — the worked example math is correct; only the Q2 option set is broken.)

---

## Adjacent Observation (Outside Canonical List — Orchestrator Decides)

**A1+A2+A4 fix-agent scope constraint:** The peer review correctly identifies these as a linked cluster. The Platform Build Note at L289 contains proposed distractor values (3.1 ft, 6.1 ft, 9.2 ft, 12.3 ft) that are internally consistent with the corrected formula. However, the L289 note was explicitly placed there as a build instruction, not a published answer set. The fix agent should reconstruct the option set using those distractor values AND remove the L289 build note afterward. The risk is that a fix agent patches only the `[CORRECT]` tag without touching the Option B "closest to 6.1 ft is 5.1 ft" rationale text — that sentence must also be corrected (it should read "S = 6.125 ft ≈ 6.1 ft" and match the corrected option C or whatever the correct answer option letter becomes). The fix-agent prompt should make this explicit.

---

## Fix-Agent Dispatch Readiness

### HIGH-tier (1 commit: "Fix L3.3–L3.4 HIGH findings")

| # | Item | Action |
|---|---|---|
| 1 (A1) | L3.4 Q2 wrong `[CORRECT]` tag, wrong option set, broken rationale | Reconstruct all four Q2 options using w=0.180, L=350, H=450 → correct = 6.1 ft. Fix `[CORRECT]` tag. Fix Option B rationale to state the correct derivation result and remove "closest to 6.1 ft is 5.1 ft." Fix Option A rationale (remove `÷ 2.5` fragment). Remove L289 platform build note. Single atomic edit — do not patch tag without touching rationale. |
| 2 (B1) | L3.3 L119 joint-use section missing fee structure | Add 2–3 sentences covering make-ready cost (pole owner analysis, typical $500–$2,000/pole range), FCC annual attachment rate formula, and budget planning implication. Position after the Rule 238 sentence. Also update the L172–173 flashcard to add fee/cost context. |

### MED-tier (1 commit: "Fix L3.3–L3.4 MEDIUM findings")

| # | Item | Action |
|---|---|---|
| 3 (A2) | L3.4 L284 garbled `÷ 2.5` rationale | Remove `÷ 2.5...` fragment; complete Option A rationale explaining WHY 2.4 ft is wrong (e.g., "corresponds to using L=350/2 in the formula instead of L=350"). Resolved in same edit pass as A1. |
| 4 (A3) | L3.4 L101 EDS 18% vs. body text 20–25% | Add parenthetical to L101: "(18% is a conservatively low design choice; IEEE 1222 typical range is 20–25% RTS. Using a below-range EDS increases margin against fatigue but requires higher attachment or shorter spans to maintain clearance.)" |
| 5 (B3) | L3.3 L119 joint-use section missing Rule 261 loading analysis | Add sentence after B1 additions: note that new joint-use attachments require a make-ready pole loading analysis per NESC Rule 261; under-loaded poles replaced at attaching party's expense. Combine B1+B3 into one paragraph update. |
| 6 (B4) | L3.3 L115–130 missing RUS easement form requirement | Add callout sentence (not a full block) after the utility easement description: "For RUS-financed projects, easements must use RUS-approved form language per RUS Bulletin 1751F-630 §4; state-law generic forms are insufficient for RUS loan package review." Do NOT add "Form 770" by name — not independently verified in-repo. |

### LOW-tier (1 commit: "Fix L3.1–L3.4 LOW findings")

| # | Item | Action |
|---|---|---|
| 7 (B2) | L3.4 L52 Extreme Wind regional framing | Add one sentence after "Check the NESC loading district map": "For routes in the SE Atlantic or Gulf Coast states, Extreme Wind is the primary governing district — do not assume Heavy district applies without confirming the map." |
| 8 (A4) | L3.4 L289 platform build note | Remove after option set is reconstructed in HIGH commit. Resolved in same edit pass as A1. |
| 9 (B5) | L3.2 L89 WAAS GPS no compound error note | Add a parenthetical: "(WAAS-grade GPS is appropriate for route tracking and station referencing; resolving utility conflicts within ±2 ft requires survey-grade GPS or vacuum excavation — not WAAS alone.)" |
| 10 (B6) | L3.1 L157 NWP 12 thin qualification | Append to rationale B sentence: "NWP 12 has conditions, a 0.1-acre fill limit, and has experienced regional suspension — confirm current availability with the applicable USACE district office before planning around it." |
| 11 (B7) | L3.1 L97 railroad permit 90-day lead time | Replace "90 days" cell with: "90–180 days (short-line railroads); 6–12 months (Class I: BNSF, CSX, NS, UP) — confirm current lead time with the specific carrier before schedule commitment." |

---

=== TOPIC 3 BATCH A CANONICAL END ===
