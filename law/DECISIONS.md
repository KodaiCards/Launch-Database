# DECISIONS — law-level only, append-only
> ✔ **RATIFIED** — Carter, 2026-07-02 (canon walkthrough sign-off).
> A decision lands here only if it changes scope, standards, sequence, or governance. Operational trivia never does. Each entry: decision · why · date. Superseding = new entry referencing the old. (Pre-canon history: `archive/planning-2026-06/decisions.md` — reference, not law.)

**L-001 (2026-07-02) — Governance reset.** Carter > Partner (law) > Registrar (enforcement/merge) > Foreman (throughput) > B1/B2 > Auditor. Law in `law/`, specs in `specs/`, ops in `ops/`. Sessions disposable; files are the memory; Carter signs files. *Why:* the prior single-planner model lost banked requirements to context churn and bottlenecked on one agent.

**L-002 (2026-07-02) — User Readability is a gate dimension.** PRODUCT_BAR §1 (plain language building on foundations; teach-then-apply; codes as references not curriculum; natural names). *Why:* launch batch shipped citation-dense, internally-noted content; the requirement had never been durably banked.

**L-003 (2026-07-02) — Per-person cost rate.** Per-employee overhead/loaded cost, manually inputtable, universal average preset, per-person override, director-only. Supersedes the global $45/hr constant. *Why:* Carter — $45 was a rough average, not a constant.

**L-004 (2026-07-02) — Hours attribute to job OR area/WO OR overhead.** Work billed to the area/WO without a specific job is first-class (how Workforce treats it), not forced into job-or-overhead. *Why:* Carter — proper assignment is the biggest hours pain.

**L-005 (2026-07-02) — RUS is a program profile, never a client assumption.** A future RUS project may bring a different client, rates, codes, SAs, WO#s. No PSC-hardcoding anywhere. *Why:* Carter, extending D013.

**L-006 (2026-07-02) — County is the universal first grouping level.** Everything groups by county first, everywhere — not parked for map delivery. Design session `*`. *Why:* Carter: "everything DOES group by county first, everything, everywhere."

**L-007 (2026-07-02) — Training: rolling release; live-5 first; certs deferred.** 5 topics fully operational ASAP is the immediate bar; remaining topics Basics→Advanced; T20 pulled RUS-aware; certs after the whole main project rollout.

**L-008 (2026-07-02) — Events + nudges.** Manual events with a custom field and per-event "remind in X days"; stale-job nudge default 14 days (not 30).

**L-009 (2026-07-02) — One mobile flow for inspectors.** 1099/inspector clock-in and daily-production card are a single phone flow, one submission moment.

**L-010 (2026-07-02) — Map is placeholder until delivered.** Integrate-as-delivered; internals planned at delivery. PM + billing proceed map-independent. Interim: a full-screen easy map preview linked to ops data (scoped small, `*`).

**L-011 (2026-07-02) — RUS-sunset review.** At every phase boundary each RUS-specific backlog item justifies itself against remaining RUS runway or is cut.

**L-012 (2026-07-02) — Workforce v2: role slots + self-claiming foremen + Verification Owner.** Fixed builders replaced by ≤3 self-claiming Foremen spawning ephemeral subagents (≤2 each, cost-effective models); Auditor renamed **Verification Owner** (≤2) and elevated to independent Tier-2 verification of EVERY package; Registrar thinned to fast gatekeeper (stamp-check, merge, live smoke, docs, triage). Caps absolute; total workers ≤4; ≥1 VO whenever merging. *Why:* Carter — throughput without named-instance plumbing; abundance of verification without a merge bottleneck. Verification is never self-certified (the independent-eyes principle that caught what builders + their manager all missed).

**L-013 (2026-07-02) — Coordination = GitHub Issues board.** One issue per package; label lifecycle open→claimed:fN→built→verifying:voN→verified/fix-needed→merged; claims by label+comment with an earliest-timestamp race rule; boundary-polling is the guaranteed discovery mechanism; `bug`/`urgent` jump the queue; one pinned `shared-infra` claimant per wave; build outputs rebuilt at merge, never committed per-package. Mechanics frozen in `ops/COMMS.md`. *Why:* atomic claiming kills double work; the board doubles as Carter's live dashboard; replaces the thread-file/watcher plumbing that consumed ~10 decisions in 2 days.

**L-014 (2026-07-03) — Hours snap to 0.25 platform-wide, no exceptions.** Carter ruled: the quarter-hour snap is the policy everywhere hours enter or change — manual entry, CSV import, AND the timeclock (which today stores raw 2-decimal; timeclock_module.js:550,643). Snap at write time; storage and display consistent; hours_quarter_snap.test.js extends to the timeclock source. *Why:* silent inconsistency in the linchpin system (rescued O22); Carter closed call-up *15 same day it was raised.
