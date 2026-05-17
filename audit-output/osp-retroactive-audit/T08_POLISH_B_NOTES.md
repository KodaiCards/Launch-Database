# T08 Polish-B Notes
**Polish agent:** narrow-scope fix of 4 LOWs from RT-γ `7c20ec1` + RT-δ `3e6b1be`.
**Write-path allowlist:** L06, L10, this notes file.
**Date:** 2026-05-17

---

## Fixes applied

### L1 — L06 line 163: `NESC §25` → `NESC Section 25`
**BEFORE:** `wind load (per NESC §25 loading district)`
**AFTER:** `wind load (per NESC Section 25 loading district)`
Citation-registry confirmed: NESC Section 25 = "Loadings for grades of construction" (IEEE C2-2023 §25x, verified 2026-05-16).

### L2 — L06 line 243: `NESC §25` → `NESC Section 25`
**BEFORE:** `Macon, GA is in a Light loading district (NESC §25).`
**AFTER:** `Macon, GA is in a Light loading district (NESC Section 25).`

### L3 — L06 first Section 26 mention: added definition anchor
**Location:** Trigger 1 block (foundations-tier Trigger 1 paragraph).
**BEFORE:** `the NESC Section 26 structural strength standard. A pole inspector assesses…`
**AFTER:** Added two anchor sentences immediately after first mention:
> "NESC Section 26 sets the strength requirements — the load and strength factor matrices — for line supports such as poles, crossarms, and guys; these tables define how much force the structure must withstand to qualify for Grade B, C, or N construction under Section 24."

Covers RT-γ-1 finding: "Section 26 used 9× without a one-sentence definition anchor for T08-only readers."

### L4 — L10 Rule 250/261 conflation fixed in three locations

**Location A: `vocabulary_introduced` — `NESC compliance certification` definition (line 40)**
**BEFORE:** `mechanical strength of pole and attachments (Rule 250/261), and loading district design loads (Rule 250 loading criteria)`
Rule 250 appeared under BOTH mechanical strength AND loading — creating learner confusion that the entire topic was designed to prevent.
**AFTER:** `mechanical strength of pole and attachments (Rule 261 — strength of line supports), and loading district design loads (Rule 250 — loading criteria for ice, wind, and temperature by district). Note: Rule 250 governs loading district selection…; Rule 261 governs the structural strength requirements…`

**Location B: Flashcard back text (T08-L10-fc-pe-cert)**
**BEFORE:** `mechanical strength (Rule 250/261), and loading district design loads (Rule 250 criteria)`
**AFTER:** `mechanical strength of pole and attachments (Rule 261 — strength of line supports), and loading district design loads (Rule 250 — ice/wind/temperature criteria by district). Rule 250 = loading district selection; Rule 261 = structural strength requirements — related but distinct.`

**Location C: Component 3 prose body (working section)**
**BEFORE:** `Rule 250/261 (mechanical strength), and Rule 250 loading district requirements`
**AFTER:** `Rule 261 (mechanical strength of line supports), and Rule 250 (loading district design loads — ice, wind, and temperature by district). Rule 250 governs which weather loads the structure must be designed for; Rule 261 governs the structural strength factors the pole must meet. Both appear in a full PE compliance certification.`

---

## Validator output
12/12 PASS — no failures, no warnings.

## Vite build
✓ built in 5.64s — zero errors.

---

## Neighborhood scan (±20 lines, no fixes applied)

**L06 — scan around both §25 fix locations and the Section 26 anchor:**
- Line 254: `NESC C2-2023 Rule 250/261 [confirm edition]` — this is a source citation in the Advanced tier footnote (end of paragraph about RUS 1724E-150). This is a CITATION bundling Rule 250 and Rule 261 as a compound reference for "loading district + strength" in the Advanced tier footnote. Different usage from the vocab/definition conflation — this is shorthand in a "[confirm edition]" note, acceptable as a placeholder until the edition is locked. No fix needed, but flag as a potential future polish item if the overall Rule 250 vs 261 precision effort extends to all citation footnotes.
- Line 397: `NESC C2-2023 Section 26 / Rule 261 [confirm edition]` in quiz citation — uses slash compound which is fine (mentions both correctly in citation context). Not a conflation.

**L10 — scan around fixed vocab_introduced and Component 3:**
- Line 39 (`pole-loading update` definition): references "Section 26 strength requirements; Section 25 loading district criteria" — correctly separated, Section 26 = strength, Section 25 = loading. No issue.
- No other Rule 250/261 bundling found in L10 outside the three fixed locations.

**No additional same-pattern bugs found requiring orchestrator attention.**

---
=== T08 POLISH-B NOTES END ===
