# GATES — definitions of done + the verification stack
> ✔ **RATIFIED** — Carter, 2026-07-02 (canon walkthrough sign-off).
> Law. A thing is DONE only when its gate passes. Distilled from the rules that caught real errors; nothing here is ceremony.

## The verification stack (every package, both gates)
1. **Tier 1 — inside the package (foreman-owned):** author ≠ red-teamer among the foreman's spawns; foreman plays the result through as a real user.
2. **Cross-foreman playthrough — MANDATORY whenever ≥2 foremen are active (Carter, 2026-07-15, from the #79 "if you'd like fresh eyes" incident):** a peer foreman (≠ the builder) drives the surface as a user (human-attitude lens), ~15 min. **Mechanics:** the builder adds the **`needs-xfm`** label at `built`-flip; the peer claims it promptly (it outranks new `open` work; runs in parallel with the VO), comments `XFM PASS|FAIL — f<N>: <what you drove, 2 lines>`, and removes the label. FAIL findings go back to the builder like VO findings. The Registrar refuses the merge stamp while `needs-xfm` stands or the comment is absent — this IS stack item 5's "2–4 present". Skippable ONLY when no second foreman is active (no label then; the VO's playthrough covers it). **Gates run by law, never by invitation — asking Carter whether a gate should run is itself a protocol error.**
3. **Tier 2 — Verification Owner, from outside the foreman's context:** spec-match vs the RATIFIED spec · PRODUCT_BAR playthrough in preview · primary-source citation verify (gov content) · money/auth/schema review (when touched). Verdict = a durable artifact on the issue: `verified` or `fix-needed` with findings. The VO re-verifies its own flagged items after fixes. The audited party never certifies its own remediation.
4. **`premerge` green** (script below).
5. **Registrar at merge:** stamp-check (2–4 present) → mechanical conflicts → rebuild assets → merge → docs rows → **post-deploy live smoke**.
6. **Carter green-lights** anything trainee/client-visible.

## Gate T — training content (adds to the stack)
- **Never author from memory.** Research log per topic; **every citation used gets a log row**; completeness = **mechanical diff** (every distinct citation ↔ a log row), never read-through.
- Authoring citation check: WebSearch cross-verify; unconfirmable exact = flagged; no question asserts an unverified specific.
- **Class-wide fixes are FRESH GREPS:** fixing any error class = grep the whole class fresh, fix every hit; never fix-from-inventory or sign off by matching a prior list.
- **PRODUCT_BAR §1** is a scored authoring dimension (plain language on foundations, teach-then-apply, references-not-curriculum, natural names), checked by the package red-teamer AND the VO playthrough.
- The VO playthrough TAKES the assessments as a trainee: draw randomness, no positional gameability, explanations read clean.

## Gate P — platform code (adds to the stack)
- Built from a RATIFIED spec; deviations → `deviation` issue, not improvisation.
- `npm test` green locally; money/hours calcs get a unit test on the pure function.
- UI surfaces judged against PRODUCT_BAR §2 (layout uses the space, visible organization, no pop-ups, auto-populate).
- Schema changes: migration idempotent, verified against live schema (never trust doc column lists), VO schema review.

## `premerge` (script, not an agent — `npm run premerge`)
Build SPA → **lint:** internal-note patterns in pools/lessons/UI · positional-answer gameability · pool draw-count sanity · user-visible internal IDs (T0x/L0x) → **Playwright walk:** every PUBLISHED lesson renders, 0 console errors, assessment loads → `npm test`. Red = no merge, no exceptions.

## The anti-ratchet rule
A gate may only evaluate its own dimension. The citation gate may not add hedges/citations to prose; the readability pass may not alter factual claims; prose-only edits that change no claim do NOT reopen citation review. Cross-dimension concerns are flagged to the owning gate, never self-fixed. (This is why the last "make it more readable" pass came back MORE citation-dense — structurally impossible now.)
