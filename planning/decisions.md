# Decision Log (append-only)

> Owned by Planning. Never overwrite an entry — supersede it with a new one that references the old. Each: decision · reasoning · alternatives. Last updated 2026-06-28.

## D001 — Establish a Planning Agent layer above the CEO (2026-06-28)
**Decision:** New governance layer. Chain = Carter → Planning → CEO → Builders/Auditor. Planning is the logic + project memory; CEO is architecture + build.
**Reasoning:** Missed ideas/features + communication errors during the time-sensitive training pivot (e.g. a completion-tracking system shipped with no way to add staff). A dedicated analysis/memory layer prevents loss and reshapes requests before they're built.
**Alternatives:** Keep the CEO as top router (rejected — that's the structure that produced the misses).

## D002 — Planning is the absolute source of truth; owns all root/planning docs (2026-06-28)
**Decision:** Planning owns `planning/` + all root docs and writes every agent's scope doc. Agents treat them read-only.
**Reasoning:** Single source of truth; survives CEO swaps; prevents drift.

## D003 — All agents are fresh instances; "fresh" = new sessions, not a code wipe (2026-06-28)
**Decision:** Restart with fresh CEO + Builders + Auditor that boot from Planning's docs. Keep the existing codebase + verified work. Fresh CEO's first job within the plan = triage what's actually done + verified, then continue.
**Reasoning:** Reset the people/context, not the work. Carter confirmed.

## D004 — Comms over git; read-only plan vs writable threads; auto-pull watchers (2026-06-28)
**Decision:** `planning/` read-only to agents; `planning/threads/<agent>.md` append-only writable. Every instance runs a background git-fetch watcher (boot-block). Planning wires the CEO's watcher; the **CEO cascades watchers to all Builders + the Auditor.**
**Reasoning:** Git is the only reliable cross-machine substrate + gives an audit trail. Goal: no manual "pull main." Carter delegated the mechanism to Planning.
**Alternatives:** Cross-session message tools (rejected — unreliable across machines/accounts).

## D005 — Read-only protection = sole-Planning-commits + merge-gate revert (2026-06-28)
**Decision:** Only Planning commits to `planning/`; loud read-only headers; one agent-writable status section per scope doc; CEO merge-gate reverts unauthorized edits to `planning/`.
**Reasoning:** Git can't OS-lock files across clones; this is the strongest practical guard short of a separate locked repo (offered to Carter if he wants it harder).

## D006 — Auditor: dual access, single reporting line to Planning (2026-06-28)
**Decision:** Auditor reads from + may clarify with both Planning and CEO, but **reports all findings to Planning** (single verdict owner). Planning routes implementation fixes to the CEO and owns spec gaps. Planning dispatches the Auditor as the AUDIT REVIEW gate when a package is marked done.
**Reasoning:** It audits implementation-vs-intent, which spans both worlds — but a verifier shouldn't decide/split its own findings (it's a reader, not a decider); dual reporting lets findings fall through cracks or be dismissed as out-of-scope, the exact failure Planning exists to kill.
**Alternatives:** Equal dual-report (rejected — divided accountability); report to CEO who escalates (rejected — puts CEO between Auditor and Planning on completeness, Planning's own domain).

## D007 — Heavy communication required of Planning; decisions weigh all lenses (2026-06-28)
**Decision:** Planning↔Carter is intentionally high-communication (overrides the general brevity norm for this channel). Every decision weighed through cost-to-Carter / time / efficacy; Planning proactively proposes better processes and pushes back.
**Reasoning:** Carter wants a real second brain that catches conflicts and improves ideas, not an order-taker. (Compute-cost discipline — agent fan-out — still holds; the override is dialogue depth, not burning compute.)

## D008 — Authority + disagreement protocol (2026-06-28)
**Decision:** Planning may change scope *slightly* on its own; CEO build-level calls need Planning approval; disagreements → Carter notified, both sides fairly; rulings logged here.

## D009 — Planning runs the whole launch software (2026-06-28)
**Decision:** The entire launch platform is under Planning. Training is the trigger that brought the layer on now, not the scope. Planning must continuously deepen its knowledge of the business/domain.

## D010 — First task = full software plan, in normal mode (2026-06-28)
**Decision:** First task is a full in-depth plan for the ENTIRE software, meshed with current verified state, collaborative with Carter. Held in normal mode, not plan mode.
**Reasoning:** Plan mode blocks the doc/memory writes that are Planning's core function; the plan is a living doc, not a one-shot approval artifact.
