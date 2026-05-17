# Agent Protocol — `kodaicards/launch-database` (current as of 2026-05-17)

> Reference this file from agent prompts instead of re-inlining boilerplate.
> Every agent reads this once at start of run.
> Working branch is **`main`** (post-2026-05-15-evening lock).

## 1. Setup

1. GitHub access via env. Working branch: **`main`**.
2. `git fetch origin main && git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` before every push (signing-wrapper-safe; do NOT use `git pull --rebase`).
3. Confirm HEAD matches dispatching prompt; if not, ask before proceeding.

## 2. Universal hard rules

- **Push policy.** Signing wrapper returns 400. Unsigned commits are working norm. Use `git -c commit.gpgsign=false commit ...`. Never `--no-verify`. Never amend published commits.
- **STOP and surface** on safety-net failures (lint/type-check/test/pre-commit). Do NOT bypass — orchestrator decides.
- **No scope creep.** Implement only items in prompt. Surface adjacent observations as report notes, never as additional commits or findings.
- **Branch discipline.** Push only to `main`. Never push elsewhere.
- **No PR creation** unless prompt explicitly says to.

## 3. Signing-wrapper workaround

| Operation | Command |
|---|---|
| Regular commit | `git -c commit.gpgsign=false commit -m "..."` |
| Merge commit | `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Pre-push sync | `git fetch origin` then `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit` |
| Recovery | `git reset --hard origin/main`, re-apply edits, commit, push fast-forward |

**NEVER** `git pull --rebase`, `--force`, `--force-with-lease`, `--no-verify`.

## 4. Parallel-push collision handling

Multiple agents may push to `main`. Before every push:
1. `git fetch origin`
2. `git -c commit.gpgsign=false merge FETCH_HEAD --no-edit`
3. `git push origin main`

On collision/rejection, retry fetch → merge → push up to **5×** with **30s gaps**. Network failure → retry up to 4× with exponential backoff (2s/4s/8s/16s).

## 5. Role-write separation (STRICT)

| Role | Write access |
|---|---|
| Research/audit agent | Own report file ONLY (allowlist in prompt). NO lesson files. NO canonicals. NO CLAUDE.md. |
| Red Team verifier | Own report file ONLY. READ-ONLY on code/content. |
| Fix-agent / Polish-agent | Lesson files in scope + notes file. NO CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/. |
| Post-fix RT | Own report file ONLY. READ-ONLY. |

**Write-path allowlist is enforced in every prompt.** If your prompt lists `audit-output/X.md` as allowlist, you may write ONLY that file plus your own commits/notes if explicitly named.

## 6. Anti-patterns — EVERY agent MUST NOT

- Use Edit/Write/NotebookEdit on files outside write-path allowlist
- Create/modify `*_CANONICAL.md` or `*_FIX_*.md` (orchestrator-only artifacts) unless prompt explicitly names them
- Modify CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/ (orchestrator-only)
- Impersonate orchestrator (no "Prepared by Orchestrator", "Next dispatchable", "Ready to dispatch", "I cannot dispatch")
- Dispatch follow-up rounds (R-4, RT-C etc.) — orchestrator-only
- Issue "GREEN closure" claims — orchestrator decides
- Apply fixes when role is audit/RT — REPORT only
- Trust prior agents' "primary-source verified" claims blindly — re-verify

## 7. Closeout requirements (every agent)

Every result message MUST include:

1. **First line:** acknowledge write-path constraints verbatim
2. `git log -3 --oneline` paste showing your commits
3. `git diff --stat origin/main..HEAD` paste — only files in allowlist
4. Vite build result if you touched code: `cd osp-training && npm run build` — must succeed
5. For fix/polish agents: BEFORE → AFTER verbatim snippets per canonical item
6. For agents claiming citation/numeric corrections: PRIMARY-SOURCE VERIFICATION LOG with URLs + verbatim quotes BEFORE listing edits

## 8. Primary-source verification mandate (cascade-defense)

Cascade precedents: T02 OM5 28000 fabricated, T09 Biden PM 86 FR 7491 not 7667, T08 §1.1413→§1.1411(i).

**Before applying ANY numeric / citation / regulation replacement:**
1. Look up the REPLACEMENT value from a primary source (eCFR, NIST, NIOSH, NESC, IEEE Xplore, FCC ECFS — not Wikipedia or secondary blogs)
2. Confirm primary source matches the canonical's claim
3. If primary source disagrees, REPORT and STOP — do not apply
4. Paste verbatim quote + URL in closeout

**RT agents:** when verifying a "replaced X with Y" fix, do NOT trust the prior agent's claim of what Y is — re-verify Y against a DIFFERENT primary source than the fix-agent used.

## 9. Audit prompt patterns (baseline)

- **Traceability:** every finding includes `Verified by reading: <file>:<startLine>-<endLine>` + 3-10 line code snippet
- **Negative findings:** force a section of what you checked AND confirmed clean
- **Coverage gaps:** explicit "what I didn't reach + why"
- **Same scope, distinct framings** across paired RTs (NOT split scopes)
- **Forbid reading other auditor outputs** unless role is "prior-context" framing
- **Word budget:** specified per prompt (usually ≤1200-1500)
- **End sentinel:** `=== <AGENT NAME> REPORT END ===`

## 10. Conflict resolution

Two agents return conflicting findings on same item → orchestrator dispatches tiebreaker BEFORE fix-agent runs:
- Citation/fact conflicts → Haiku ground-truth primary-source lookup (~10-30K tokens)
- Interpretation/judgment conflicts → Sonnet third framing
Conflicts CANNOT be deferred past fix-agent dispatch.

## 11. Token budget caps (per agent class)

| Role | Cap |
|---|---|
| Research/audit | 200K |
| RT (post-fix or final-verify) | 120-150K |
| Fix-agent (scoped canonical) | 250K |
| Polish-agent | 180K |
| Haiku ground-truth | 75K |

**STOP if approaching cap.** Write your report immediately. Do not continue into "let me also fix this" patterns.

## 12. Vite build check (any agent touching osp-training/)

`cd osp-training && npm run build` after changes. Must succeed (zero errors). Flag RED if build fails — topic is not GREEN if it doesn't build.

## 13. Acknowledgment first line

Your first line must paste back the write-path allowlist verbatim. Example:

> "Write-path constraints acknowledged: only `audit-output/<wave>/<agent>.md` written."

Drift-prevention.
