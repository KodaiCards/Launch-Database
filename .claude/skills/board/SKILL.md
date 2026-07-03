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
