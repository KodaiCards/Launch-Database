---
name: craft
description: The working discipline for every role in this repo — verify before acting, bank state to files, sweep before destructive actions, read economically, report faithfully. Use at the start of any work package and whenever deciding how to proceed.
---

# Craft — how work is done here (method, not persona; your role's charter still bounds WHAT you may do)

## 1. Ground truth beats claims — including your own
Docs go stale, reports overstate, memory lies. Before acting on any statement about the code ("X is wired", "Y was fixed", "the column exists"), verify it directly: grep it, read it, run it, query it. When a doc and the code disagree, the code is true — say "doc says X, code shows Y" out loud and act on the code. The biggest saves in this repo's history were one cheap grep somebody bothered to run.

## 2. Bank state the moment it settles
Anything durable — a decision, a finding, a completed step — goes into its file (issue comment, spec, commit) the moment it exists, not at the end. Your session can die at any moment; the org's memory is files, never context. If it's only in your head or chat, it doesn't exist.

## 3. Sweep before the axe
Before anything destructive or hard to reverse (delete, overwrite, force-push, mass-edit), inventory what you're about to hit and look for value that would be lost — a `--no-merged` check, a grep for references, a read of the file. Ten minutes of sweep has repeatedly rescued days of work here. If the sweep contradicts the plan, stop and say so.

## 4. Fix the class, not the instance
Any bug you touch is a class until proven otherwise. Fresh-grep the whole pattern across the codebase and fix every hit; never fix only the items on a list someone gave you, and never verify by re-checking that same list (law/GATES.md).

## 5. Read economically, act decisively
Read only what the task needs — targeted greps and section reads, never wholesale files "for context." When you have enough to act, act; don't re-derive what's established. But cheap ≠ shallow: on anything you're about to assert or ship, do the verification (see 1).

## 6. Report faithfully, lead with the answer
First sentence = the outcome. Tests failed? Say so, with the output. Skipped something? Say so. Uncertain? Say so — "I verified A and B; I could not check C" beats a confident summary that's 90% true. Never claim "done" for anything you didn't see work with your own eyes (a build passing is not the feature working).

## 7. Escalate over improvise — fast
Hitting ambiguity, a spec gap, or evidence that the plan is wrong is a NORMAL work product, not a failure. File it (`blocked`/`deviation`/ideas per the board skill) within minutes and move to other work. The expensive failure is hours spent guessing — or silently narrowing the task to what you can do.

## 8. The cheapest tool that proves it
Prefer the script over the agent, the grep over the read, the one-file read over the survey, one careful pass over three sloppy ones. Spend tokens where being wrong is expensive (verification, money paths, gov content); economize everywhere else.
