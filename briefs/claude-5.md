# Claude 5 — Training Curriculum (R18 rebuild, GATED)

> **You are a fresh instance taking over the training-curriculum work after the previous attempt was halted.** Read this fully, then `CLAUDE.md`, then the rulebook files in "Read first" below. Work only in your scope; push only to your branch; never to `main`.

**Branch:** `claude-5/training-curriculum`, cut from the **latest `main`**.
**⛔ Do NOT pull from, branch off, or trust `claude-2/training-curriculum` — it is QUARANTINED** (the prior attempt authored OSP/fiber facts *from memory* with no research or red-team; it was rejected). Start clean from `main`.

## ⛔ Why you exist — the non-negotiable gate
This is government/team training. **The facts CANNOT be wrong.** The last attempt was thrown out for writing from memory. So:
- **Every non-obvious factual claim MUST cite an authoritative source** (BICSI, FOA, NESC/NEC, IEEE, TIA, IEC, RUS / 7 CFR, manufacturer spec). No verifiable citation → do not write the claim.
- **NEVER author from memory.** If you didn't verify it against a real source *this session*, it does not go in. This includes quiz questions and "expanded detail" — those are content too.
- **When unsure of any fact, STOP** and leave a `BLOCKED — needs CEO` note in this brief. Guessing is exactly what got the last attempt rejected.
- **Independent red-team:** the agent that red-teams a topic MUST be a *different* sub-agent than the one that authored it. Self-RT is not acceptable — that independence is the control that was missing.

## ⛔ The merge gate (CEO-enforced — content without this is rejected unread)
**Per-topic delivery, small batches.** Each delivery MUST include all three:
1. **Lessons** (authored/edited in the standard format).
2. **Research-log with citations** for every non-obvious claim → `osp-training/docs/research-logs/moduleNN-*.md`.
3. **Independent red-team report** → `osp-training/docs/red-team-reports/*.md` — a different sub-agent re-checked EVERY claim against its cited source; no open accuracy flags.

**No research-log + RT report = not merged.** Keep batches to ONE topic at a time so nothing can ever bury unverified bulk again.

## Scope = `osp-training/` content + interactivity components
All catalog topics already have **baseline, previously-audited content on `main`** (there are no "coming soon" gaps except the intentionally-deferred ISP C01–C03). So your job is a **gated quality/accuracy/pedagogy overhaul of existing topics**, not authoring missing ones.

### Already DONE on `main` — do NOT redo or rewrite
- **Completion-gating wiring:** `LessonLayout.jsx` (`LessonProgressContext.reportScore`) + `primitives/Quiz.jsx` (reports the score to the gate; normalizes the `{id,text}`+`correctId` option format). The server credits completion only at **≥70%** or `competency:true`; the SPA already sends scores; there is **no manual "Mark complete" button** (don't re-add one). Build on this.

### ⚠️ PRIORITY 0 — verify-and-fix LIVE accuracy flags (do this first)
The quarantined R18 attempt's one red-team pass found **real, suspect citations in the CURRENTLY-LIVE content** (confirmed present on main): e.g. an unverifiable **"Format V"** SOR designation (T13.L07), **AIA A201 §3.3.1** mis-cite (T13.L01 + capstone), **NESC §01C / "Section 26" / "NESC Map 1"** (T13.L08/L13), inverted **FCC Part 32** account hierarchy (T13.L08 vs T16.L08), swapped **IEEE 81-2012** sections (T13.L04), and several "[UNVERIFIABLE — paywalled]" quiz values. Full list: **`osp-training/docs/red-team-reports/T13-T22-SUSPECTED-live-errors-UNVERIFIED.md`**.
- These flags are a **punch-list, NOT trusted answers** — the proposed corrections came from the deviating instance. **Independently verify each against the actual authoritative source**, then fix the live lesson **through the gate** (research-log citation + independent RT). 
- Bias to the safe direction: if a specific citation can't be verified, **remove/hedge the over-claim** rather than invent a replacement — an honest "confirm against project/standard" beats a confident wrong citation.
- This is the highest-urgency work because it's already live to the team.

### ⚠️ ARTIFACT-COVERAGE REALITY — don't assume any T-topic is "verified"
The existing trusted red-team reports (`modules-01-04`, `05-08`, `09-12`) and research-logs (`module02…module12`) are for the **LEGACY `src/modules/ModuleNN_*.jsx` architecture**, which is **superseded and NOT what the live app serves** (the SPA serves `src/lessons/T*/L*.jsx` via `LessonRouter`). So:
- **The live T01–T22 lesson curriculum largely has NO per-topic research-log and NO independent topic-level red-team report.** It was authored in the rewrite and got informal "final-audit" passes — which is exactly why residual errors slipped in (the T13–T22 punch-list proves it).
- **Treat the module-era artifacts as REFERENCE INPUTS (reusable facts/citations), never as topic sign-off.** A module RT passing does NOT mean the corresponding T-lesson is verified.
- **~13 T-topics appear to have no dedicated research foundation at all** (roughly T01, T03, T04, T07, T08, T13, T14, T15, T18, T19, T20, T21, T22) — these are the highest hallucination risk and must be researched from authoritative sources, not reused.

### STEP 0 — build a coverage matrix (do before scaling)
One table, per T-topic: has a research-log? has an independent topic-level RT? known live errors (from the punch-list)? Work **biggest-gap / highest-risk first**: (1) the live-error punch-list (Priority 0), (2) topics with no research foundation, (3) the rest. This guarantees nothing is missed and makes the whole-curriculum scope legible. Commit the matrix so the CEO can track coverage.

### The R18 mandate (work-streams — it's "many things," not just authoring)
1. **Accuracy pass** — verify existing content against sources; fix errors (with citation + RT). Resolve any open items in existing red-team-reports.
2. **Depth** — make thin topics extensive + complete (cited).
3. **Easier verbiage** — plain language; define every acronym on first use; short sentences; scannable layout. Teach like a smart friend. (Rulebook governs voice.)
4. **Varied interactivity (NET-NEW — the prior attempt built none):** beyond multiple-choice — drag-drop, label-the-diagram/hotspot, matching, ordering, fill-in, branching scenarios, and **calculators/simulators** (link budget, pole loading, OTDR trace reader, splice matrix). Build reusable components in `osp-training/src/components/`.
5. **Assessment depth + integration** — ≥4 Q/lesson floor, mixed types; **cumulative within a subject and interleaving prior subjects** (spaced retrieval); subject capstones; periodic cross-subject reviews. Every lesson carries a graded assessment or a competency interaction (the gate requires it).
6. **Authored SVG diagrams** for technical visuals (red-team-verifiable). **No AI-generated raster images for technical facts** (hallucination risk).
7. **Polished, consistent look** — typography/spacing, clear progress feedback, encouraging tone.
8. **Wire** `course-catalog.js` (`available` / `lesson_count` / prereqs) and run `npm run build:osp` so `public/training/` updates.

### Off-limits (CEO owns these — do not touch)
`routes/training.js`, `public/training-admin.html`, `server.js`, `auth.js`, `public/js/app_nav.js`, `migrations/`, `schema.sql`, all other `routes/*`.
NOTE: `osp-training/src/data/course-catalog.js` is **also read by the CEO's content-visibility system** (it parses ids/titles/section/available/lesson_count, and the track grouping is `section: general→OSP, isp→ISP, cert→Cert`). You may edit `lesson_count`/`available`/titles, but **do not restructure** the file's shape or rename sections without a `BLOCKED — needs CEO` note.

### Read first (the established process — do not reinvent it)
1. `osp-training/docs/field-vs-textbook-research.md` — editorial rulebook (accuracy + voice). Obey it.
2. `osp-training/src/lessons/schema.md` — lesson file format.
3. `osp-training/src/lessons/T01/*.jsx` — template; T02–T09 for range.
4. `osp-training/src/data/course-catalog.js` — source of truth for ids/titles/available/lesson_count/prereqs.
5. existing `osp-training/docs/research-logs/` + `red-team-reports/` — match their format.
6. `docs/training_launch_design.md` → "R18 content incident — QUARANTINED" — why this gate exists.

### Cadence
Pull `main` → branch `claude-5/training-curriculum`. Pick **ONE** topic. Research (cite every claim, parallel sub-agents OK) → author → **independent** RT sub-agent verifies → deliver the topic with all three artifacts → set status `DONE — ready for review: <topic>` and note the citations passed clean. CEO verifies the artifacts + spot-checks citations, then merges. Repeat one topic at a time.

**Suggested first delivery:** pick a single OSP topic and run the *full* gated cycle on it (research-log + improved lessons + independent RT report) to prove the pipeline end-to-end before scaling. Quality + provenance over volume — always.

---
**Status:** NEW — awaiting first topic. Branch not yet created. (CEO set this up 2026-06-27 after the R18 quarantine.)
