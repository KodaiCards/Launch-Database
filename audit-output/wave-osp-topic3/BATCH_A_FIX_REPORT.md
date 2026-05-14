# OSP Topic 3 Batch A — Fix Agent Report

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Fix agent scope:** All 11 canonical findings across L3.1–L3.4

---

## Commit Summary

| Commit | SHA | Contents |
|---|---|---|
| 1 — HIGH | `5fc91cd` | A1 (Q2 option-set reconstruction + [CORRECT] move + all 4 rationale rewrites); B1+B3 (joint-use fee structure + Rule 261 make-ready paragraph + flashcard update) |
| 1 merge | `5ccf44d` | Remote divergence resolved (no-edit merge; new file from remote) |
| 2 — MED | `0abcefc` | A3 (EDS 18% parenthetical); B4 (RUS easement form language sentence); B5 (WAAS compound-error parenthetical); B6 (NWP 12 fill-limit + suspension risk + district confirmation) |
| 2 merge | `5ccf44d` | Merge of remote divergence (wave-osp-topic10 DISCOVERY.md added by concurrent agent) |
| 3 — LOW | `f682217` | B2 (Extreme Wind SE/Gulf regional framing sentence); B7 (railroad permit lead-time split short-line/Class I) |
| 3 merge | `27dcbf7` | Remote divergence resolved (no-edit merge) |

---

## Per-Canonical Status

| # | ID | Severity | Status | Notes |
|---|---|---|---|---|
| 1 | A1 | HIGH | **ADDRESSED** | Q2 completely reconstructed: options now 3.1/6.1/9.2/12.3 ft; [CORRECT] moved to B (6.1 ft); all four rationale bodies rewritten with specific misderivation explanations; Option B no longer contains "closest to 6.1 ft is 5.1 ft" error |
| 2 | B1 | HIGH | **ADDRESSED** | Joint-use paragraph (L3.3) expanded with make-ready cost range ($500–$2,000/pole), FCC attachment fee (~$10–$20/pole/yr), and Rule 261 loading analysis requirement; flashcard updated to match |
| 3 | A2 | MED | **ADDRESSED** | Resolved atomically in Commit 1 (A1 edit pass). The `÷ 2.5` fragment is fully excised; Option A rationale now explains the specific /2 misderivation yielding 3.06 ft ≈ 3.1 ft |
| 4 | A3 | MED | **ADDRESSED** | Parenthetical added to worked-example EDS line: explains 18% is conservatively below the 20–25% IEEE 1222 range, notes tradeoff (more fatigue margin, more sag) |
| 5 | B3 | MED | **ADDRESSED** | Addressed in Commit 1 with B1 (one paragraph update per canonical dispatch note). NESC Rule 261 loading analysis, pole-replacement-at-attaching-party's-expense language included |
| 6 | B4 | MED | **ADDRESSED** | Added "RUS-approved easement form language per RUS Bulletin 1751F-630 §4" sentence to utility easement paragraph. "Form 770" not named by number per red-team scope note |
| 7 | B2 | LOW | **ADDRESSED** | One sentence added after NESC map reference: SE Atlantic/Gulf Coast Extreme Wind primary governing district; do not assume Heavy without map confirmation |
| 8 | A4 | LOW | **ADDRESSED** | Platform build note removed atomically in Commit 1 when Q2 block was reconstructed. The parenthetical at former L289 no longer exists in the file |
| 9 | B5 | LOW | **ADDRESSED** | WAAS parenthetical added to reconnaissance crew equipment line: ±6–13 ft compound error budget; survey-grade or vacuum excavation required for ±2 ft utility conflict resolution |
| 10 | B6 | LOW | **ADDRESSED** | NWP 12 sentence in L3.1 Q1 Option B rationale expanded with 0.1-acre fill limit, regional suspension risk, and USACE district confirmation guidance |
| 11 | B7 | LOW | **ADDRESSED** | Railroad permit lead-time table cell updated from flat "90 days" to "90–180 days (short-line); 6–12 months (Class I: BNSF, CSX, NS, UP)" with carrier-confirmation note |

---

## Deferrals

None. All 11 canonical items addressed.

---

## Adjacent Observations (outside scope — orchestrator decides)

1. **Q2 Option D rationale arithmetic note:** The rationale currently offers two possible misderivation paths for 12.3 ft (wrong w from worked example, or H halved). Either is plausible. If the LMS requires a single canonical misderivation per distractor, the H = 225 lb path (halving tension) may be cleaner pedagogically. Low priority — both paths are internally valid.

2. **L3.4 Extreme Wind flashcard (Key Terms section):** The loading-district flashcard body describes only Light/Medium/Heavy district values. Now that the body text adds Extreme Wind regional context, the flashcard could be expanded to note that Extreme Wind replaces ice with elevated wind pressure in SE/Gulf Coast geography. Currently the flashcard is accurate but silent on the regional framing. Low priority — body text carries the context.

---

=== BATCH A FIX AGENT REPORT END ===
