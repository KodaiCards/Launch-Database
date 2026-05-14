# T3 Trailer-Fix Spec A — Math + Citation Framing
**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Prep agent:** A (math + citation; read-only w.r.t. lesson content)
**Sources:** `09563fa` (BATCH_B_REDTEAM_B), `f9f42e3` (BATCH_B_REDTEAM_A), `f0bc265` (BATCH_A_POST_FIX_VERIFICATION)
**Lesson files:** `content/osp-survey-route/` (05–08, 04)

---

## TF-1 — MOD: L3.8 intro "60–90 days" vs. body "30–60 / 90–180 days"

**File:** `content/osp-survey-route/08-crossings.md`, line 37 (±5: 32–42)

**Current (line 37 fragment):** "…may require 60–90 days of permit processing…"

**Target (line 37 fragment):** "…may require 30–60 days (short-line railroad) to 90–180 days (Class I railroad) of permit processing…"

**Math:** None. Body line 76 ("Short-line railroads may take 30–60 days; Class I railroads frequently require 90–180 days") and permit matrix table line 157 ("90–180 days" for BNSF) are both correct. Fix aligns the intro to the body. L3.1 uses slightly different framing ("90–180 days short-line; 6–12 months Class I") — do not change L3.1; the L3.8 intro fix matches L3.8's own body, not L3.1.

**Citation:** No citation on line 37; no change needed.

**Cross-reference impact:** None. Intro-only fix.

**Risk:** Low. Confirm sentence remains grammatically intact after expansion.

---

## TF-2 — LOW: L3.5 Q3 Option A text "21.6%" vs. rationale "21.7%"

**File:** `content/osp-survey-route/05-underground-route-design.md`, line 218 (option text; ±5: 213–223)

**Current (line 218):** `- A) Yes — fill ratio is 21.6%, which is below the 40% maximum…`

**Target (line 218):** `- A) Yes — fill ratio is 21.7%, which is below the 40% maximum…`

**Math:** π×(0.275)²×3 = 0.71273 in²; π×(1.0235)² = 3.2909 in²; ratio = 0.21657 = **21.657% → 21.7%** (standard rounding at 3 sig figs). "21.6%" is a truncation, not a round. The rationale (line 224) and Option C/D rebuttals (lines 226–227) all correctly state 21.7% — option text is the sole inconsistency.

**Citation:** None needed.

**Cross-reference impact:** None. No other lesson cites this percentage.

**Risk:** Minimal. [CORRECT] tag stays on A; no other lines change.

---

## TF-3 — LOW: L3.5 body worked example "0.237 in²" vs. Q3 rationale "0.2376 in²"

**File:** `content/osp-survey-route/05-underground-route-design.md`, line 114 (±5: 109–119)

**Current (line 114 fragments):** "…cross-section of 0.237 in². Three such cables would require 0.711 in²…"

**Target (line 114 fragments):** "…cross-section of 0.2376 in². Three such cables would require 0.7128 in²…"

**Math:** π×(0.275)² = 0.23758 in² → 4 sig figs: **0.2376 in²**. Three cables: **0.7128 in²**. Q3 rationale (line 224) already uses both 4-sig-fig values. The five-cable value ("1.19 in²") and six-cable value ("1.42 in²") are derived from the same radius; 5×0.2376=1.188≈1.19 ✓; 6×0.2376=1.426≈1.43 (body says 1.42 — minor secondary inconsistency, out of trailer-fix scope, do not change).

**Citation:** None needed.

**Cross-reference impact:** None. Purely internal to line 114.

**Risk:** Minimal. Compliance conclusion unchanged (0.7128 < 1.316 in² at 40% of 3.291 in²).

---

## TF-4 — LOW: L3.5 flashcard "below top of rail" vs. L3.8 body "bottom of ties" reference point

**File primary:** `content/osp-survey-route/05-underground-route-design.md`, line 143 (±5: 138–148)
**File secondary:** `content/osp-survey-route/08-crossings.md`, line 173 (±5: 168–178)

**Current (L3.5 line 143):** "Minimum 48 in. (1,219 mm) below top of rail for OSP conduit crossing railroad ROW…"

**Target (L3.5 line 143):** "Minimum 48 in. (1,219 mm) under the bottom of the railroad ties (or 48 in. below the top of rail as a conservative reference point) for OSP conduit crossing railroad ROW…" Citations unchanged: `[ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-635 §3]`

**Current (L3.8 line 173):** "Minimum 48 in. below the top of rail (ANSI/TIA-758-C §6.3) for OSP conduit crossing railroad ROW…"

**Target (L3.8 line 173):** "Minimum 48 in. under the bottom of the railroad ties (or 48 in. below the top of rail as a conservative reference point), per ANSI/TIA-758-C §6.3, for OSP conduit crossing railroad ROW…" Citations unchanged: `[ANSI/TIA-758-C §6.3; RUS Bulletin 1751F-630 §7]`

**Math:** None. L3.8 body line 84 is the authoritative formulation ("under the bottom of the railroad ties (or 48 inches below the top of rail as a conservative reference point)") — fix text is sourced directly from there.

**Citation:** No citation changes; L3.5 cites 1751F-635 §3, L3.8 cites 1751F-630 §7 — both correct for their respective contexts.

**Cross-reference impact:** Two-file touch. L3.5 body depth table (line 48) says "48 in. (1,219 mm) minimum" with no reference point — leave unchanged. L3.8 scenario line 218 ("60 in. below top of rail" for BNSF spec) is correct BNSF language, not the ANSI standard; leave unchanged.

**Risk:** Low. Verify wording matches L3.8 line 84 verbatim in both targets.

---

## TF-5 — UNCLEAR: L3.7 NESC Rule 235G in sources not cited in body

**File:** `content/osp-survey-route/07-aerial-to-underground-transitions.md`, line 9 (frontmatter sources; ±5: 4–14)

**Current (line 9):** `  - "NESC (National Electrical Safety Code) C2-2023, Rules 235G, 352, 354"`

**Analysis:** Full-body search confirms Rule 235G appears only in the sources header. Rules 352 and 354 are each cited in body text. Rule 235G covers clearances for communication conductors on structures (poles) and is plausibly relevant to the 8-ft riser height or pole-face conduit requirements, but the body does not invoke it.

**Recommended resolution — Option A (remove):**
**Target (line 9):** `  - "NESC (National Electrical Safety Code) C2-2023, Rules 352, 354"`

**Option B (add body citation):** If the fix agent has access to NESC C2-2023 Rule 235G text and confirms it governs the 8-ft riser height, add `[NESC C2-2023, Rules 235G, 354; ANSI/TIA-758-C §6.1]` to the riser height sentence (~line 62). Do not add without confirming the rule text; default to Option A.

**Math:** None.

**Citation:** Option A removes an unverifiable citation. Option B requires primary-source confirmation before adding.

**Cross-reference impact:** None. No quiz answer or body claim depends on Rule 235G.

**Risk:** Low either way. Option A is the safe default.

---

## TF-6 — LOW: L3.4 Q2 Option C rationale derives 9.5 ft, states "≈ 9.2 ft"

**File:** `content/osp-survey-route/04-aerial-route-design.md`
**Lines:** 280 (option value), 286 (rationale) (±5: 275–291)

**Current (line 280):** `- C) 9.2 ft`
**Current (line 286 fragment):** "…S = 0.280 × 122,500 / 3,600 = 9.5 ft ≈ 9.2 ft…"

**Math:** 0.280 × 122,500 / 3,600 = 34,300 / 3,600 = **9.527 ft → rounds to 9.5 ft**, not 9.2 ft. The "≈ 9.2 ft" claim is wrong.

**Target (line 280):** `- C) 9.5 ft`
**Target (line 286 full replacement):**
`- **C — Incorrect.** 9.5 ft results from incorrectly adding a 0.10 lb/ft ice load to the given cable weight: w_ice = 0.180 + 0.100 = 0.280 lb/ft → S = 0.280 × 122,500 / 3,600 = 9.5 ft. The problem specifies no ice load. [IEEE 1222 §5]`

**Citation:** `[IEEE 1222 §5]` — unchanged.

**Cross-reference impact:** The worked example S_max (line 231) is also 9.5 ft — a surface similarity between the distractor and an intermediate worked-example value. This is acceptable; the rationale makes the error clear. Grep confirms "9.2 ft" appears only at lines 280 and 286 — no other locations to update.

**Risk:** Moderate (two-line edit). Verify [CORRECT] tag remains on line 279 (Option B, 6.1 ft) and Option D line 281 (12.3 ft) is unchanged.

---

## TF-7 — LOW: L3.4 Q2 Option D rationale — first derivation path yields 9.94 ft, not 12.3 ft

**File:** `content/osp-survey-route/04-aerial-route-design.md`, line 287 (±5: 282–292)

**Current (line 287):** "12.3 ft results from using the loaded NESC Heavy district cable weight from the worked example (0.292 lb/ft) instead of the 0.180 lb/ft stated in this problem: S = 0.292 × 122,500 / 3,600 = 9.94 ft… or from applying the formula with H = 225 lb (half the stated tension): S = 0.180 × 122,500 / 1,800 = 12.25 ft."

**Math:**
- Path 1: 0.292 × 122,500 / 3,600 = 35,770 / 3,600 = **9.936 ft** — does NOT produce 12.3 ft. Path 1 is a false derivation.
- Path 2: 0.180 × 122,500 / (8 × 225) = 22,050 / 1,800 = **12.25 ft ≈ 12.3 ft** ✓ — valid.

**Target (line 287 full replacement):**
`- **D — Incorrect.** 12.3 ft results from applying the formula with H = 225 lb (half the stated tension of 450 lb): S = 0.180 × 122,500 / (8 × 225) = 22,050 / 1,800 = 12.25 ft ≈ 12.3 ft. Halving the given tension is an arithmetic error with no basis in the problem statement. [IEEE 1222 §5]`

**Citation:** `[IEEE 1222 §5]` — unchanged.

**Cross-reference impact:** None. Sag table line 220 ("400 ft | 12.3 ft") is a manufacturer table entry for a different span — unrelated, leave unchanged.

**Risk:** Low. Single-line replacement. Verify Option D value (line 281: 12.3 ft) and [CORRECT] on Option B (line 279) are untouched.

---

=== T3 TRAILER FIX SPEC A END ===
