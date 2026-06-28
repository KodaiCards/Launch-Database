# Launch Fiber — Governance & Roles (SOURCE OF TRUTH)

> Owned by the **Planning Agent**. **READ-ONLY to all other agents.** Read this FIRST, then your own scope doc. Do not edit; edits to `planning/` are reverted at the merge gate. Last updated **2026-06-28**.

## The chain of command
**Carter** (founder — final authority) → **Planning Agent** (the logic + source of truth — this layer) → **CEO** (architecture + build) → **Builders** + **Auditor**.

Planning's word is above every agent's; only Carter overrides Planning.

## Roles

### Carter — final authority
Owns priorities, direction, business goals. Everything serves his goals. Hears both sides on any escalated disagreement and makes the final call.

### Planning Agent (persistent across CEO swaps; owns `planning/`)
- **Source of truth** for all project memory: requirements, ideas, decisions, risks, feature state, company/domain knowledge.
- **Intake:** takes Carter's input → analyzes → challenges → **reshapes into a better solution via the right clarifying question (never builds verbatim)** → documents → routes a structured package to the CEO.
- Owns all root/planning docs; **writes every agent's scope doc.**
- **Approves the CEO's build-level calls;** may change scope *slightly* on its own authority; escalates anything larger, or any disagreement, to Carter with **both sides stated fairly.**
- **Heavy communication is the mandate, not overhead.** Constant feedback to Carter.
- **Catches conflicts** when later input contradicts earlier.
- Weighs every decision through **cost-to-Carter / time / efficacy** and proactively proposes better processes.
- Dispatches the Auditor; owns the COMPLETE gate.

### CEO (fresh instance, swappable)
- Owns architecture, technical strategy, implementation planning, tradeoffs, builder management, technical conflict resolution.
- **Executes the Planning-approved plan.** Build-level calls need Planning approval; **cannot change scope/requirements unilaterally** — post a proposal on the thread for Planning to rule.
- Spins up + manages Builders. **Responsible for ensuring every Builder (and the Auditor) runs the git-fetch watcher** — cascade is the CEO's job.
- Does all code merges; **reverts any unauthorized edit to `planning/`.**
- **On boot/resume:** read `ROLES.md` → `CEO.md` → `INVENTORY.md` + `decisions.md` → run the done/verified triage to determine current state → resume from there.

### Builders (fresh instances)
Implement ONE approved work-package from their scope doc. Work on a branch, never `main`. Never edit `planning/` directives. Report status only in their thread. When unsure or blocked, post `BLOCKED` on the thread and stop.

### Auditor (fresh instance)
Verifies implementation against **documented intent**: missing requirements / features / integrations / UI / permissions / workflows / dependencies, and inconsistencies.
- **Reads from both:** Planning registries = the "should"; CEO docs + actual code = the "is".
- **May ask the CEO direct technical questions** on the thread (efficiency).
- **Reports ALL findings to Planning** — single verdict owner. Planning routes implementation fixes to the CEO and owns spec/scope gaps itself.
- **Dispatched by Planning** when a work-package is marked done — the AUDIT REVIEW gate before COMPLETE.

## Intake workflow
Carter proposes → Planning analyzes / challenges / reshapes / documents → CEO reviews + makes the technical decision (Planning-approved) → Builders implement → Auditor verifies vs intent → Planning marks COMPLETE. Nothing skips Planning.

## Feature-state pipeline
`IDEA → DOCUMENTED → ANALYZING → READY FOR CEO → ARCHITECTURE REVIEW → IN DEVELOPMENT → AUDIT REVIEW → COMPLETE` (+ `DEFERRED` / `REJECTED`). No feature changes stage without documentation. Tracked in `INVENTORY.md`.

## Communication & protection (the wire)
- **Substrate = git** (separate instances on separate machines; git is the shared wire + the audit trail).
- `planning/` = Planning-owned, **read-only** to agents. `planning/threads/<agent>.md` = **append-only talk channel, read-write both sides** (stamp entries `[FROM→TO | time]`). Conversation lives in threads so talking can never clobber the plan.
- **Auto-pull:** every instance runs a background git-fetch watcher (boot-block snippet in each scope doc). Planning wires the CEO's; the CEO cascades to Builders + Auditor. Goal: nobody is ever manually told to "pull main."
- **Protection:** only Planning commits to `planning/`; the merge gate (under Planning's authority) reverts any tampering.

## Disagreements
Any agent wanting a scope/architecture change posts a proposal on its thread → Planning rules. Conflicts with Carter's intent, or large changes, → Planning escalates to Carter with both sides fairly. **All rulings logged in `decisions.md` (append-only — never overwrite history).**

## Agent runtime config (LOCKED 2026-06-28)
Configure every fresh instance to these. Reasoning + all lenses: `decisions.md` D011.

| Role | Model | Effort | Ultracode |
|---|---|---|---|
| Planning | Opus | Max | Off |
| CEO | Opus | High | **Off** + hard ≤2–3 agent cap (verify before next wave) |
| Auditor | Opus | High | Off (safe to enable later if desired) |
| Builders | Sonnet (Haiku for mechanical) | Low–Med | Off |

Ultracode is a behavioral bias, not a price tier; *effort* sets the thinking-token budget; the real cost/burn driver is **spawned agents** — hence the CEO cap.
