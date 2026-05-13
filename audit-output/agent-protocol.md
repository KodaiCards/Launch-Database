# Agent Protocol — `kodaicards/launch-database`

> Standing setup + rules for every audit / verification / fix agent.
> Reference this file from agent prompts instead of re-inlining the boilerplate.
> Read it once per agent at start of run.

## Setup

1. GitHub PAT at `~/.git-credentials`. Clone `https://github.com/kodaicards/launch-database.git`.
2. `git checkout claude/debug-previous-issues-MoN9D && git pull origin claude/debug-previous-issues-MoN9D`.
3. Confirm HEAD matches what the dispatching prompt says — if not, ask before proceeding.

## Hard rules (apply to every agent)

- **Push policy.** Repo's signing wrapper returns 400. Unsigned commits are the working norm (explicitly approved). Use `git -c commit.gpgsign=false commit ...` per commit. Never `--no-verify`. Never amend published commits.
- **STOP and surface on safety-net failures** (lint, type-check, test, pre-commit hook other than signing). Do NOT disable, bypass, or work around. The orchestrator decides.
- **No scope creep.** Implement / audit only the items in your prompt. Surface adjacent observations as notes in your final report, never as additional commits or findings.
- **Branch discipline.** Push only to `claude/debug-previous-issues-MoN9D`. Never push to `main` or any other branch.
- **No PR creation** unless the dispatching prompt explicitly says to.

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

## Output sentinel

End your report file with:

```
=== <AGENT NAME> REPORT END ===
```

For log parsing + sentinel-based completion detection.

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

## Fix agent patterns

- Pull the canonical list from `audit-output/<wave>/CANONICAL.md` on the branch (orchestrator writes it after verification).
- **Group commits by severity tier** (CRITICAL / HIGH / MEDIUM / LOW). One push at the end of the wave.
- Each commit message references which canonical-list items it addresses.
- Return ≤200-word summary with per-item status: addressed / deferred / blocked, plus SHA list.
- **No scope creep** — never add items not in the canonical list. Surface adjacent observations in your final report.

## Post-Fix Verification patterns

- For each canonical item in the wave: verify the fix actually addresses the canonical issue (not just "does something") AND introduces no new bugs.
- Open the diff hunk for every fix. Read the surrounding code for regressions.
- Mark each item: ADDRESSED / INCOMPLETE / REGRESSION-INTRODUCED.

=== AGENT PROTOCOL END ===
