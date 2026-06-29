# planning/ — owned by the Planning Agent (source of truth)

**READ-ONLY to every agent except Planning.** Do not edit anything here. Edits to `planning/` are reverted at the merge gate. Talk on your thread (`planning/threads/<you>.md`), not in these docs.

Read order for any agent: **`ROLES.md` first**, then your own scope doc (`CEO.md` / `AUDITOR.md` / your worker doc). **Planning instance:** start at **`PLANNING.md`** — it's the bootstrap that reconstructs the full Planning role + current state on any machine/session.

- `ROLES.md` — the chain of command, every role's mandate, the intake workflow, the comms/protection protocol, the feature-state pipeline. Self-contained so a fresh CEO can boot from it.
- `INVENTORY.md` — the live map of the entire software: what exists, what's planned, status tags, dependencies, open questions. Doubles as the current-state tracker.
- `decisions.md` — append-only decision log (decision · reasoning · alternatives). Never overwritten — the trail must survive.
- `threads/<agent>.md` — append-only talk channels (created when an agent boots).

Owner: Planning Agent. Last updated 2026-06-28.
