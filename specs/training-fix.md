# SPEC: training-fix — make the live 5 topics fully operational
> Status: **RATIFIED** (Carter, 2026-07-02, canon walkthrough sign-off). The new org's FIRST MISSION. Scope: T01 Fundamentals · T18 Safety/OSHA · T02 Fiber Physics · T03 Cable Selection · T04 Route Survey — live on launchfiber.app right now with known defects. Done = a trainee experiences a clean, readable, honest course. Rolling: ship fixes as they clear, don't hold the batch.

## WO-1 — Strip internal-note leakage (mechanical, first)
~95 occurrences in `content/training/assessment-pools/*.json` answer explanations + lesson prose (worst known: `osp-training/src/lessons/T03/L05...jsx:371`): "see TXX research log", "UNVERIFIED-EXACT", bracketed audit hedges, "not a graded quiz"-class process notes.
- **Fresh-grep the class** (GATES §T5): patterns incl. `research log`, `UNVERIFIED`, `see T\d\d`, bracketed hedge blocks; sweep ALL trainee-visible strings (pools, lessons, UI components), not a curated list.
- Rewrite each explanation to stand alone plainly; where a citation matters, keep the plain reference ("per NESC Rule 232"), drop the pipeline vocabulary.
- Red-team confirms class-clean by its own fresh grep. No factual claims change → citation gate does NOT reopen (GATES anti-ratchet).

## WO-2 — Readability retrofit to PRODUCT_BAR §1
Authoring pass (author ≠ reviewer), per topic, prose + question text:
- Apply teach-then-apply everywhere a code/standard appears: what it is → what it says → where we use it → why it helps. Body prose in plain language building on prior lessons.
- Move exact code/form/CFR strings into a per-lesson **References** block (one shared component; collapsible).
- Rename all trainee-visible T0x/L0x artifacts to natural names (catalog titles, headers, cross-references "see T06.L02" → "see the Underground Conduit lesson"). ⚠ `course-catalog.js` is parsed by the server `curriculumTree` — keep parseable.
- Replace/remove questions requiring code-number recall (swap for practical-use questions from the same pool's research base; pool sizes must stay ≥ draw counts).
- **Explicit dispatch note to builders:** this is a READABILITY pass. The citation gate has passed; do not add citations, hedges, or qualifiers. Changed factual claims (only) go back through citation check.

## WO-3 — `premerge` script (parallel with WO-1/2)
`npm run premerge` per GATES: build → lint (internal-note patterns, positional gameability, draw-count sanity, user-visible internal IDs) → Playwright walk of every PUBLISHED lesson (renders, 0 console errors, assessment loads) → `npm test`. Wire into the repo; document in ops.

## WO-4 — UI quick pass (rides along)
- Settings page: use horizontal space — grouped multi-column layout, no thin vertical line. (PRODUCT_BAR §2.1)
- Unused-tab removal: HOLD for the *1 kill list — do not guess.
- "Retry"-class internal wording sweep in training UI components (partially done; fresh-grep).

## Done-when
A trainee can take all 5 topics: natural lesson names, plain teach-then-apply prose, references tucked in a block, no internal vocabulary anywhere, assessments un-gameable, all lessons render clean, `premerge` green, the full verification stack passes (foreman playthrough → cross-foreman playthrough → VO Tier-2 verdict → Registrar stamp-check + live smoke), Carter green-lights the republish.

## Board decomposition (Registrar files these as issues at cutover)
WO-1 (leak strip) and WO-3 (premerge script) — parallel-safe, claim immediately. WO-2 — one issue per topic (5), rolling; T0x/L0x rename touches `course-catalog.js` → belongs to the wave's `shared-infra` claimant. WO-4 (settings layout) — independent. Pin the `shared-infra` issue first.

## Then (same crew, no pause): wave 2 = T09 → T05 → T06 authored under PRODUCT_BAR §1 from the start.

**⚠ Wave-2 stranded value (found at branch prune, 2026-07-02):** the pre-canon org left UNMERGED work at tag `archive/2026-07-02/claude-ceo-fresh-instance-boot-u2zw28` — T05/T06 wiring + red-team, T19 pools, a T05-L03 formative-quiz grading fix, T09 material. First wave-2 package = **evaluate integrating that work through the NEW gate** (VO verifies vs PRODUCT_BAR + citations) rather than re-authoring — it passed the old accuracy gate but predates the readability bar. Salvage what verifies; re-author what doesn't.
