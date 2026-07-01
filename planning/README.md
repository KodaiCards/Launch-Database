# planning/ — owned by the Planning Agent (source of truth)

**READ-ONLY to every agent except Planning.** Do not edit anything here. Edits to `planning/` are reverted at the merge gate. Talk on your thread (`planning/threads/<you>.md`), not in these docs.

Read order for any agent: **`ROLES.md` first**, then your own scope doc (`CEO.md` / `AUDITOR.md` / your worker doc). **Planning instance:** start at **`PLANNING.md`** — it's the bootstrap that reconstructs the full Planning role + current state on any machine/session.

- `ROLES.md` — the chain of command, every role's mandate, the comms/protection protocol, runtime config (D020), the feature-state pipeline. Self-contained so a fresh instance can boot from it.
- `BOOT_PROMPTS.md` — the exact paste-able first message per role (D019).
- `decisions.md` — append-only decision log (decision · reasoning · alternatives). Never overwritten — the trail must survive.
- `open_items.md` — open questions, risks, parked recs, **trigger-linked commitments** (commitments.md merged in, D019). Closed rows → `archive/`.
- `ideas.md` — the idea registry. `INVENTORY.md` — the software status map (updated AT every merge, D019). `BUSINESS.md` — the company/vision. `TRAINING_PLAN.md` — the active mission spec.
- `codebase/` — Planning's first-hand map of the whole build (`00-SYNTHESIS.md` first; `USER_TEST.md` = the live 23-screen pass).
- `threads/<agent>.md` — append-only talk channels (live tail only; adjudicated history → `threads/archive/`).
- `reviews/` — system reviews (2026-07-01: drift root-cause + the F1–F7 fixes, D019).
- `archive/` — snapshots + retired registries. Reference, not boot reads.

Owner: Planning Agent. Last updated 2026-07-01.
