# Claude 6 — Training Curriculum (gated, tight-leash)

> Fresh instance. The two prior attempts were stopped: **C2 (`claude-2/training-curriculum`) authored from memory — QUARANTINED**; **C5 burned out**. You start clean. Read this fully, then the "Read first" docs. Push only to your branch; never `main`.

**Branch:** `claude-6/training-curriculum`, cut from the **latest `main`**.
**⛔ Do NOT pull from, branch off, or trust `claude-2/training-curriculum` or `claude-5/training-curriculum`.** Start clean from `main`.

## ⛔⛔ THE LEASH — read this twice (most important rule)
**Do exactly ONE assigned piece at a time, then STOP and WAIT for Carter's explicit confirmation before doing anything else.**
- When you finish a piece: post a short summary of what you did + the artifacts, set status `DONE — awaiting confirmation: <piece>`, and **STOP. Do not start the next piece.** Do not "keep going while you wait."
- **Never** expand scope, refactor, or "improve" things not in the current assigned piece.
- If you think something else needs doing, **write it as a note and STOP** — do not act on it.
- The CEO (Opus) assigns each piece. Carter confirms each one. No confirmation = no work.

This leash exists because the last two instances went off-track. Staying inside one small, confirmed piece is the single thing that matters most here.

## ⛔ The accuracy gate (non-negotiable)
This is government/team training — **facts CANNOT be wrong.**
- **Every non-obvious claim MUST cite an authoritative source** (BICSI, FOA, NESC/NEC, IEEE, TIA, IEC, RUS / 7 CFR, manufacturer spec). No verifiable citation → don't write it.
- **NEVER author from memory.** If you didn't verify it against a real source this session, it doesn't go in. Quiz questions and "expanded detail" are content too.
- **Independent red-team:** a *different* sub-agent than the author re-checks every claim against its cited source. Self-RT is not acceptable.
- **When unsure of any fact, STOP** with a `BLOCKED — needs CEO` note. Guessing got the last attempt thrown out.
- **Deliverable per content piece:** the lessons + a **research-log** (`osp-training/docs/research-logs/`) + an **independent red-team report** (`osp-training/docs/red-team-reports/`). No artifacts = not merged.

## Your scope = `osp-training/` CONTENT ONLY (design is CEO-owned)
You execute **verified content** into the CEO's component library + lesson template. You do **NOT** design components, invent UX, or make visual-design calls.
- The **vision is already planned for you** — don't reinvent it:
  - `docs/training_design_spec.md` — components, when to use each, assessment model, visual standards, per-lesson Definition of Done.
  - `docs/training_build_plan.md` — **exactly which SVGs each topic needs, which interactions, what to test, and how topics interleave.** Build to this.
- You MAY author **static SVG diagrams** (they're content — RT them, follow the visual standards). You may NOT build new **interactive components** — the CEO builds those (MatchPairs, LabelDiagram, FillBlank, calculators). Need one that doesn't exist? `BLOCKED — needs CEO`.

## Off-limits (CEO owns — do not touch)
`routes/training.js`, `public/training-admin.html`, `server.js`, `auth.js`, `public/js/app_nav.js`, `migrations/`, `schema.sql`, other `routes/*`. `osp-training/src/components/**` is CEO-owned (use components; don't add/redesign them). You may edit `course-catalog.js` `lesson_count`/`available`/titles but not restructure it (the CEO's content-visibility system parses it).

## Read first
0. `docs/training_build_plan.md` — the per-topic build design (what to build).
1. `docs/training_design_spec.md` — components + standards + Definition of Done.
2. `osp-training/docs/field-vs-textbook-research.md` — editorial rulebook (voice + accuracy).
3. `osp-training/src/lessons/schema.md` — lesson format; `osp-training/src/lessons/T01/*` template.
4. `osp-training/docs/red-team-reports/T13-T22-SUSPECTED-live-errors-UNVERIFIED.md` — the live-error punch-list (UNVERIFIED; verify before fixing).
5. `docs/training_launch_design.md` → "R18 content incident" — why the gate + leash exist.

## The work breakdown (the CEO will hand you these ONE at a time — do not run ahead)
1. **Coverage matrix** (analysis only — no content changes). Per T-topic: research-log? independent topic RT? known live errors? assessment (≥4/mixed/cumulative/interleaved)? interactivity present? SVGs present? verbiage? flashcards/vocabulary? DAG prereqs valid? Commit it to `osp-training/docs/coverage-matrix.md`. → **STOP, await confirmation.**
2. **T13 live-citation fixes** (Priority-0), one finding at a time, each verified against the real source through the gate. → STOP between findings.
3. Then teaching-order topics, **one small unit at a time** (accuracy RT → content/verbiage → assessment → author the topic's SVGs → wire existing interactions per the build plan), each gated. → STOP between units.

---
## ▶️ YOUR FIRST AND ONLY CURRENT TASK
**Build the coverage matrix (work-breakdown item 1).** Survey the existing live `osp-training/src/lessons/**` against the dimensions above; write `osp-training/docs/coverage-matrix.md`. **Do NOT change any lesson content. Do NOT start item 2.** When done, commit to your branch, post the summary, and **STOP — wait for Carter's confirmation.**

**Status:** NEW — assigned: coverage matrix only. Awaiting C6 to start.
