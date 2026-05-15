# Agent Protocol — `kodaicards/launch-database`

> Standing setup + rules for every audit / verification / fix agent.
> Reference this file from agent prompts instead of re-inlining the boilerplate.
> Read it once per agent at start of run.

## Setup

1. GitHub PAT at `~/.git-credentials`. Clone `https://github.com/kodaicards/launch-database.git`.
2. `git checkout claude/debug-previous-issues-MoN9D && git fetch origin && git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` (see Signing-wrapper section — do NOT use `git pull --rebase`).
3. Confirm HEAD matches what the dispatching prompt says — if not, ask before proceeding.

## Hard rules (apply to every agent)

- **Push policy.** Repo's signing wrapper returns 400. Unsigned commits are the working norm (explicitly approved). Use `git -c commit.gpgsign=false commit ...` per commit. Never `--no-verify`. Never amend published commits.
- **STOP and surface on safety-net failures** (lint, type-check, test, pre-commit hook other than signing). Do NOT disable, bypass, or work around. The orchestrator decides.
- **No scope creep.** Implement / audit only the items in your prompt. Surface adjacent observations as notes in your final report, never as additional commits or findings.
- **Branch discipline.** Push only to `claude/debug-previous-issues-MoN9D`. Never push to `main` or any other branch.
- **No PR creation** unless the dispatching prompt explicitly says to.

## Signing-wrapper workaround (updated 2026-05-14)

The signing wrapper at `/tmp/code-sign` returns 400 on ALL commit types that replay or sign. Use the following patterns:

| Operation | Command |
|---|---|
| Regular commit | `git -c commit.gpgsign=false commit -m "..."` |
| Merge commit | `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Pre-push sync | `git fetch origin` then `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Recovery fallback | `git reset --hard origin/claude/debug-previous-issues-MoN9D`, re-apply edits, commit as fast-forward, push |

- **NEVER use `git pull --rebase`** — rebase replays commits through the signing wrapper and triggers 400 errors (discovered 2026-05-14, replaces the prior pull-rebase guidance).
- **NEVER `--no-verify`.**

## Parallel-push collision handling (updated 2026-05-14)

Multiple agents may push to the same branch. Before every push:

1. `git fetch origin`
2. `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` (fast-forward or merge commit — both unsigned-clean)
3. `git push -u origin claude/debug-previous-issues-MoN9D`

On collision/rejection, retry the fetch → merge → push loop up to **5×** with **30s gaps**. If still failing after 5 attempts, surface to orchestrator. Do **NOT** use `--force`, `--force-with-lease`, or `--no-verify` to escape a push failure.

Network failure on push → retry up to 4× with exponential backoff (2s, 4s, 8s, 16s).

## Team composition (locked 2026-05-14)

| Wave intensity | Worker team | Red team |
|---|---|---|
| **High / Critical** — security, auth, payments, schema migrations, AI tool surface, cashflow-affecting, demo-blocker | ≥3 agents splitting + cross-verifying | ≥3 read-only verifiers, different framings |
| **Standard** — content batches, routine audits, routine fixes, brief discovery, CI-green checks | ≥2 agents splitting + cross-verifying | ≥2 read-only verifiers, different framings |
| **Trivial** — single-line typo, README touch | 1 agent | none — orchestrator spot-checks |

**Red-team return-trip rule:** If any red-team verifier flags an issue, the fix-agent is re-dispatched to address it. A **fresh** red team (new agents, same ≥2/≥3 count as the wave's intensity class) then verifies. Loop until the red team is clean. Do not reuse the same verifiers on the return trip.

## Traceability format (mandatory for audits + verifications)

Every finding includes:

```
Verified by reading: <file>:<startLine>-<endLine>
Code snippet: <3-10 lines of actual code, verbatim>
```

Findings without traceability are rejected.

## Negative findings + coverage gaps (mandatory for audits)

- **Negative findings** — explicit list of what you checked AND confirmed clean. Proves you read the code.
- **Coverage gaps** — explicit list of what you didn't reach and why.

## Cost-v2 patterns (mandatory)

- **Structured-field reports.** Findings as a table: `#, severity, category, file, line_range, snippet, issue (1 line), fix_shape (1 line), confidence`. Prose only in "Stack snapshot" intro (≤80 words) + "Coverage gaps" (≤120 words).
- **Cap reports at 1200 words** unless prompt explicitly raises it (verification can go to 2000).
- **Full report to `audit-output/<wave>/<auditor>.md`** in the repo, pushed as a separate commit.
- **≤200-word executive summary** in the tool result. Orchestrator works from summaries; verification reads the full files.

## Reporting + sentinel discipline

- Every agent report file ends with `=== <AGENT NAME> REPORT END ===` sentinel (mandatory — used for log parsing and completion detection).
- Full reports go to `audit-output/<wave>/<agent>.md` and are pushed by the agent as its own commit.
- Orchestrator reads ≤300-word executive summaries only; full report is for verification red-team.
- Traceability format (see above) is mandatory for every finding.

## Audit framings (use exactly what the dispatching prompt specifies)

- **Standard fresh-eyes** — code only, no priming.
- **Prior-context** — code + planning docs / prior wave audit notes.
- **Adversarial / subtle** — race conditions, multi-step gaps, edge cases, channel-pinning bugs. Prime with hunting heuristics.
- **High-recall skeptical** — assume vulnerable until reviewed; flag uncertain.
- **High-precision conservative** — only flag confirmed exploitable. Add "Pre-submit reject check" field per finding + "False-positive register" section.
- **UX-flow / daily-workflow** — walk an actual user's daily job.

**Different framings, same scope.** Don't audit different files; audit the same files with different lenses. Cross-verification depends on overlap.

**Forbid reading other auditors' outputs** unless your framing is explicitly "prior-context."

## Verification Red-Team patterns

- Receive the **deduplicated canonical list inline** from the orchestrator.
- **Tier by overlap count.** 3+ auditor convergence on same line = quick spot-check. 1-2 auditors = full end-to-end verification.
- For every item: open the cited file:line range, read the snippet, mark **VERIFIED / OVERSTATED / FALSE-POSITIVE / UNCLEAR** with a 1-line rationale + diff hunk.
- Include **rejected items as a meta-verification tier.** If an auditor said "X is safe," confirm or reject.
- Red-team is **READ-ONLY.** It writes only its own verification report. It cannot modify code, content, or any other file. This independence is the audit's whole value.

## Fix agent patterns

- Pull the canonical list from `audit-output/<wave>/CANONICAL.md` on the branch (orchestrator writes it after verification).
- **Push aggressively — after every commit,** not only at the end of the wave. A mid-run API failure loses zero work if each commit is already pushed.
- **Group commits by severity tier** (CRITICAL / HIGH / MEDIUM / LOW). Each commit message references which canonical-list items it addresses.
- Before each push: `git fetch origin && git -c commit.gpgsign=false merge FETCH_HEAD --no-edit && git push` (see Parallel-push section).
- **Before pushing any FE-touching commit:** `grep -r "<deleted-DOM-id>" tests/**/*.spec.js` — verify no Playwright tests assert on IDs or elements you deleted. If hits found, update the test in the same commit.
- Return ≤200-word summary with per-item status: addressed / deferred / blocked, plus SHA list.
- **No scope creep** — never add items not in the canonical list. Surface adjacent observations in your final report.

## Post-Fix Verification patterns

- For each canonical item in the wave: verify the fix actually addresses the canonical issue (not just "does something") AND introduces no new bugs.
- Open the diff hunk for every fix. Read the surrounding code for regressions.
- Mark each item: ADDRESSED / INCOMPLETE / REGRESSION-INTRODUCED.

## Content-authoring conventions (inherited from Topics 1-3, locked)

These apply to any agent writing OSP lesson content, quiz questions, or curriculum material.

- **RUS Bulletin 1751F-630 = primary anchor.** NESC / TIA / FCC / USACE / state DOT are complementary references.
- **Vendor-agnostic.** Only spec-level equivalents (e.g., "Sch 40 PVC" — a spec, not a brand). No product names.
- **Per-lesson structure:** frontmatter (title, duration, citation sources, learner outcome) + body content + Key Terms flashcards + ≥1 quiz with [CORRECT] tag + worked-example scenarios where applicable.
- **Math discipline:** every quiz answer must be independently derivable; every [CORRECT] option's rationale must match the worked derivation; distractors must be plausible misderivations, not arithmetically broken.
- **Citation discipline:** cited standard section must plausibly cover the claimed topic; do not hardcode edition suffixes for cite-and-superseded standards — reference as `[confirm edition]` until the user resolves.
- **Content red-team is non-optional before a content wave is closed.** Run math consistency, citation plausibility, internal consistency, cross-lesson consistency, and brief-framing fidelity checks. A content wave without a red-team is not done.
- **No AI references in training content (locked 2026-05-15).** Lessons NEVER mention "AI", "Claude", "language model", "generated", or any AI-meta signal. Content reads as a senior OSP engineer wrote it. Red teams flag any AI-signal as a blocker.
- **Facts only, no guesses (locked 2026-05-15).** If a standard's edition is in flux, mark `[confirm edition]`. If a number is not independently verifiable, omit it or mark "varies by jurisdiction." Plausible-sounding-but-fabricated numbers, percentages, or section refs are treated as hallucinations — RT flags them.
- **Book vs field practice — both required (locked 2026-05-15).** Where the textbook standard diverges from common field execution, lessons present BOTH: the codified standard with citation, the common field interpretation (with crew-level context for why), the clear distinction between them, and the risk of confusing them. This is teaching the gap — not an opinion or a guess.

## Red Team contract — STRICT READ-ONLY (re-locked 2026-05-16 after violation)

A Red Team agent verifies code; it does NOT modify code. This is the bedrock of independent verification. **An RT that patches its own findings is no longer independent.** Carter's verbatim 2026-05-16: "that mistake is unacceptable."

**Hard rules every RT agent prompt MUST inherit:**

1. **The RT writes ONE FILE: its verification report.** Path: `audit-output/<wave>/<wave>_RT.md` (or `<wave>_POSTFIX_RT.md` for follow-ups).
2. **The RT does NOT modify any other file under any circumstance.** Not source code, not tests, not docs, not the schema, not the migration, not the lesson, not the example. Even if a fix looks "trivial" — the RT does not fix it. The RT REPORTS it.
3. **Pre-push self-check:** before `git push`, RT runs `git diff --stat HEAD~1 HEAD` and confirms ONLY its own report file appears. If anything else appears, the RT aborts the push, reverts the unintended modifications, and re-pushes only its report.
4. **The RT can run `npm run build` / `npm test`** — running tests is not modifying code.
5. **The RT can read every file in the repo** — no restriction on Read.
6. **Tools the RT must NOT use on code/content files:** Edit, Write, NotebookEdit, any Bash command that writes to source paths (sed, awk, redirect to file). Bash for git operations + npm build/test is fine.
7. **If the RT spots a finding it considers "trivial 1-line fix":** STILL REPORT IT. The orchestrator decides whether to dispatch a fix-agent or accept the issue.
8. **Reported violation = agent failure.** A future post-fix RT will detect any unauthorized modifications by comparing the RT's commit to the report-only expected diff. Violations get the RT's commit reverted (where possible) and re-dispatched as proper read-only.

**Past violation case study (2026-05-16):** RT agent for OSP-RW.3 T02 template (commit `492aa85`) was prompted "READ-ONLY on code; you write only the verification report" and "DO NOT modify any code." Agent ignored both, patched 4 findings inline (lessonFileIndex, SliderExploration on 3 lessons, schema.md prop name, L07 vocab), then pushed all 5 file changes + RT report as one commit. Patches were correct but contract violated. Required post-fix RT (proper read-only) at additional cost. Lesson: every future RT prompt must include the explicit Tool restrictions + pre-push self-check above.

## Office context (locked)

| Field | Value |
|---|---|
| Office | Launch Fiber Services |
| Owner | Carter Trantham |
| Location | Macon, GA |
| NESC loading district | Light (inland Macon). Extreme Wind overlay for projects within ~60 mi of Atlantic/Gulf coast. |
| Primary client | PSC (RUS-program engineering contracts) |
| OSP training delivery | Vite SPA served as static behind `requireAuth()` at `/training/` in launch-database. **Moodle dropped 2026-05-15** (OSP-RW.6 teardown still pending — `routes/oauth2.js` + `moodle/` dir still on disk until that wave lands). Active rewrite in progress (OSP-RW phases). |
| Working branch | `main` (per Carter's 2026-05-15 lock; PR #43 merged the prior dev branch). HEAD: `95b6bf6`+. |
| Model defaults for agents | `model: "sonnet"` for code/audit/verify/fix; `model: "haiku"` for enumerative research; orchestrator's discretion to upgrade research to Sonnet when domain judgement is required. |

=== AGENT PROTOCOL END ===
