---
name: board
description: Exact gh commands + protocol for the work board — claiming an issue, flipping status labels, polling for ready work, filing bugs/deviations. Use whenever interacting with GitHub Issues in this repo.
---

# Board mechanics (procedure for ops/COMMS.md — the law; this is the crib sheet)

## Poll (start of EVERY turn and work boundary)
- Foreman: `gh issue list --label urgent --label bug --state open` first, then `gh issue list --label open --state open`, then your own `fix-needed`: `gh issue list --label fix-needed --label "claimed:f1" --state open`
- VO: `gh issue list --label built --state open`
- Registrar: `gh issue list --label verified --state open` + triage `bug`/`deviation`

## Claim (foreman)
1. `gh issue view <N>` — read spec pointer + done-when.
2. `gh issue edit <N> --add-label "claimed:f1" --remove-label open`
3. `gh issue comment <N> --body "CLAIMED f1 · branch f1/issue-<N>-<slug>"`
4. **Race rule:** `gh issue view <N> --comments` — re-read. Two claims? Earliest comment timestamp wins; loser removes its label + comment and moves on. If your harness forces its own branch name, state the real branch in the claim comment — the comment is the traceability record.
5. Branch: `git checkout -b f1/issue-<N>-<slug>` (or harness branch, per #4).

## Flip built (foreman, only after Tier-1 passes: author≠RT + your own user-playthrough)
`gh issue edit <N> --add-label built --remove-label "claimed:f1"` + comment the commit SHA + one-line what/how-verified.

## Verify (VO)
Claim: `--add-label "verifying:vo1" --remove-label built`. Verdict comment = durable artifact (see vo-verify skill). Pass: `--add-label verified --remove-label "verifying:vo1"`. Fail: `--add-label fix-needed --remove-label "verifying:vo1"` + findings list; the claiming foreman re-claims.

## File a finding (any agent — law: no agent mints its own scope)
- Broken existing behavior → `gh issue create --label bug --title "bug: <symptom>" --body "<repro + expected-vs-actual + where>"`. Live-facing? add `--label urgent`.
- Someone built off-spec/off-order → same with `--label deviation`.
- "Should also X" → NOT an issue. Append to `specs/ideas/` (own file, verbatim context) — Partner + Carter decide.

## Never
Claim two packages at once · touch a `shared-infra`-guarded file unless you claimed the pinned shared-infra issue · flip your own package past `built` · edit law/, specs/, ops/ · push main (Registrar only).

## Resume a stale claim (successor session, same slot)
1. `gh issue list --label "claimed:f1" --state open` → your inherited claims.
2. Per issue: read the comment TAIL, not the whole thread — `gh issue view <N> --comments` and use the last ~5 comments + `git fetch origin && git log origin/<branch> --oneline -15` — WIP commit messages carry the dead session's state. Older comments are history, not state.
3. **Verify, don't trust:** diff the branch; a step claimed done with no artifact (no RT report, no commit) gets REDONE.
4. `gh issue comment <N> --body "RESUMED f1 @ <sha> · state: <what exists> · next: <step>"` → continue.
5. Blocked mid-work yourself? Push `WIP:` commit with a state-bearing message FIRST, then comment/HANDOFF. Never stall silently.

## Decompose a ratified spec into issues (Registrar)
- One issue ≈ ≤1 foreman-day; body = spec file+section pointer, done-when, constraints. Never paraphrase the spec into the issue — point at it.
- Order by dependency: shared components FIRST as a pinned `shared-infra` issue (its claimant = sole toucher of shared files that wave); independent packages marked parallel-safe; per-unit work (per topic/page) = one issue each, rolling.
- A decomposition judgment call that shades the spec (bundling, splitting, sequencing not in the spec) → state it on the issue and flag Partner — proceed unless overruled, don't wait.

## Scoping rule (from the #65 collision)
Packages that edit the SAME FILES are never independent — even when their concerns differ (a class-sweep + a per-topic retrofit touching the same lessons WILL collide at merge). Sequence them (sweep first, topics after) or merge scopes. Class-sweep grep patterns go into the premerge lint immediately regardless — the lint never collides.
