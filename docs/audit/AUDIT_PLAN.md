# Training Content Audit — plan, protocol, and CONTINUATION (read if picking this up)

> **Status: IN PROGRESS (launched 2026-06-27 by the CEO).** This is a CEO-led, evidence-based audit of the LIVE training curriculum (`osp-training/src/lessons/T*/L*.jsx`) to produce the **exact** C6 build plan. Reporter agents read the lessons and write durable report files; **the CEO synthesizes + judges** (agents do not decide anything). If the launching CEO ran out of usage, **you (next CEO) continue from the raw reports — see "Continuation" at the bottom.**
>
> Why this exists: the `training_build_plan.md` was written *blind* (from the catalog + OSP domain knowledge, not the actual lesson contents). For Carter's bar — 100% accurate, complete OSP coverage, nothing important missed, broken tools fixed — the plan must be grounded in what the lessons ACTUALLY contain. This audit closes that gap.

## Scope
All live topics, in teaching order: T01, T18, T02, T03, T04, T09, T05, T06, T19, T14, T07, T08, T10, T11, T12, T13, T15, T16, T17, T20, T21, T22, C04, C05. Plus a **component health check** (Carter: "some interactive tools are broken").

## Agent assignment (6 reporter agents → durable files in `docs/audit/raw/`)
- **A** → T01, T18, T02, T03 → `docs/audit/raw/audit-A.md`
- **B** → T04, T09, T05, T06 → `docs/audit/raw/audit-B.md`
- **C** → T19, T14, T07, T08 → `docs/audit/raw/audit-C.md`
- **D** → T10, T11, T12 → `docs/audit/raw/audit-D.md`
- **E** → T13, T15, T16, T17 → `docs/audit/raw/audit-E.md`
- **F** → T20, T21, T22, C04, C05 → `docs/audit/raw/audit-F.md`
- **Component health** → CEO does this directly via the preview (load lessons using each component, watch the console) + a usage scan. Findings → `docs/audit/raw/tool-health.md`.

## ⛔ Anti-hallucination protocol (agents are NOT as smart as the CEO — constrain them)
Every reporter agent is told, verbatim:
1. **You are a READER/REPORTER, not a verifier or author.** Report ONLY what the lesson file literally contains. **Do NOT judge whether a fact is true** (you will be wrong — real fact-checking happens later via sourced red-team). **Do NOT add knowledge from yourself.**
2. **Quote, don't paraphrase, for every flag.** Any accuracy red-flag, citation, or claim you report MUST include the **exact quoted snippet + file path**. If you cannot quote it from the file, do not report it. No quote = it doesn't exist.
3. **Separate OBSERVATION from JUDGMENT.** Observations = literal contents (subtopics present, components used, # quiz questions, citations text). Judgments (completeness/clarity) = clearly labeled `JUDGMENT (low-confidence)`.
4. **Flag, don't fix, don't verify.** Mark specific/checkable claims (standard citations, numeric specs, regulatory refs) as `VERIFY:` items *with the quote* — for the CEO/RT to check against real sources. You never decide correctness.
5. **Read-only.** Do not modify any lesson. Only Write your one assigned report file.
6. **If a file is missing/unparseable, say so** — never invent contents.
7. Output the strict template below; return to the CEO only a **3-line summary** (file written · N lessons · counts of VERIFY/gaps/components). Keep big content OUT of the return.

## CEO safeguards (how the CEO defends against agent hallucination)
- **Spot-check:** for each report, grep 2–3 of its quoted snippets against the actual files to confirm they exist verbatim. A fabricated quote → discard + re-run that agent.
- The "quote + file path" requirement makes fabrication **detectable** (quotes are greppable).
- **The audit asserts NO facts as true** — it's a terrain map. Truth is established later via the gate (independent, sourced red-team). So an agent mis-judgment cannot inject a false fact into the product; it only flags things for the CEO to verify.

## Strict per-lesson report template (agents fill this for every lesson)
```
### <TID>.L<NN> — <title from file>
- Subtopics covered (OBSERVED): - …
- Components/interactions used (OBSERVED): Quiz(<#Q>), Flashcard, … 
- Citations present (OBSERVED, quoted): "<exact quote>" — <file>
- VERIFY (quoted claims needing source-check): "<exact quote>" — <file>
- Gaps vs topic scope (JUDGMENT, low-confidence): …
- Verbiage (JUDGMENT): plain | jargon-dense | mixed — 1 line
- Assessment (OBSERVED): <#> questions, types: …; competency interaction? yes/no
```
Plus a per-topic rollup: lesson count, # with assessment, # with VERIFY flags, biggest gaps.

## CEO synthesis (after reports land)
1. Spot-check each report (quotes are real).
2. Build the **real coverage matrix** → `osp-training/docs/coverage-matrix.md`.
3. Write the **exact C6 work plan** (per topic/lesson: fix / add / rebuild, in teaching order, gated) → revise `docs/training_build_plan.md` from blind→grounded.
4. Compile the **VERIFY punch-list** (all flagged claims) → these become gated RT targets.
5. Compile the **broken-tool repair list** → CEO fixes components.
6. Then C6 executes crisp pieces, one at a time, gated, with pauses.

## ▶️ CONTINUATION — if you are a new CEO picking this up
1. Read `HANDOFF.md` (CURRENT STATE) + `docs/PRODUCT_PLAN.md` + this file.
2. Check `docs/audit/raw/` for which agent reports exist. For any missing (A–F), re-launch that agent with the protocol + template above (assignment list is above).
3. **Spot-check** existing reports before trusting them (grep quotes).
4. Then do CEO synthesis (steps 1–6 above). Do **not** let C6 author content until the grounded plan exists and the gate is in place.
5. C6 is on a hard leash (`briefs/claude-6.md`) — one small confirmed piece at a time. Hold it until the plan is ready.
