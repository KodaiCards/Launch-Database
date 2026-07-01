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

## D011 — Ultracode / effort / model per agent (LIVING — exemplar decision record) (2026-06-28)
*All lenses banked here so new input updates the synthesis instead of replacing it.*
**Considerations (lenses):**
- **Cost:** Carter watches to the dollar; cost drivers = tokens + spawned agents; *effort* sets the thinking-token budget; **Ultracode is NOT a price multiplier** — with no agents it ≈ Max cost, adding only a slight overspend bias.
- **Burn risk:** a past CEO spawned dozens of agents and burned all usage — the cardinal incident ([[feedback_no_mass_agent_spawn]]).
- **Accuracy:** government training content cannot be wrong → needs rigorous, often multi-agent verification (the gate: author ≠ independent RT).
- **Role-fit:** Planning/Audit = analysis/verify → Ultracode's orchestrate-bias rarely/safely fires (proven: Planning ran Ultracode all session, zero fleets). CEO/builders = build/verify → the bias fires constantly and becomes real fleets.
- **Ultracode mechanics:** a behavioral bias, not a billing tier; "solo on conversational turns" is sanctioned; safe where the work isn't build work.

**Current call:**
- **Planning:** Opus / **Max** / Ultracode **OFF** (Max gives the depth; Ultracode adds ~no benefit solo + slight overspend bias).
- **CEO:** Opus / **high** / Ultracode **OFF** + explicit **bounded-orchestration mandate** (≤2–3 agents, scoped, verify-before-next-wave, gate enforced). Gets orchestration *capability* without the unbounded "cost-is-no-object" attitude.
- **Audit:** Opus / **high** / Ultracode **OFF** (default; the one safe place to enable later if desired — periodic, completeness-focused, spawns no builders).
- **Builders:** Sonnet/Haiku / **low–med** / off.

**Why CEO is Ultracode-off even though its work is multi-agent (Carter's "why not CEO?"):** his instinct is right that the CEO is the role that *needs* to orchestrate (the content gate is inherently multi-agent). But it needs **bounded** orchestration — which it gets from the capped mandate + high effort. Ultracode's standing "fan out by default, cost no object" posture directly **fights that cap on the exact role where over-spawning already burned Carter**, and the flag has *teeth* on the CEO (build tasks trigger it constantly) unlike on Planning (analysis tasks rarely trigger it). So: **capability via protocol, not via the flag.** Condition under which "Ultracode ON for CEO" becomes acceptable: only if the ≤2–3 cap is enforced as an *inviolable ceiling that overrides the flag*, stated explicitly in the CEO charter.
**Status: LOCKED 2026-06-28** — Carter: "CEO with no ultracode, High. Lock everything in." Final: Planning Opus/Max/off · CEO Opus/High/off + capped orchestration · Audit Opus/High/off (safe to enable later) · Builders cheap/low–med/off.

## D012 — Comms: threads live on `main`; fetch-on-demand while single-instance (2026-06-28)
**Decision:** The Planning↔agent thread channel lives on **`main`**, not on agent working-branches. The CEO (which has merge rights) commits its thread entries to main; Planning too; both pull main on activity. Builders post threads on their branches; the CEO surfaces/merges them. While only one other instance is active, **fetch-on-demand** replaces the perpetual git-fetch watcher (cost); wire the watcher + cascade when real parallel instances exist.
**Reasoning:** The CEO correctly posted its first triage to its own branch's thread (never pushed code to main, per the worker rule), so it didn't auto-reach Planning. Threads-on-main fixes auto-receipt without agents touching code on main. Also recorded via the CEO's grounded triage (2026-06-28): the 6-agent coverage audit never produced output and ~0 live topics are gated → approved going lean (P1), unified Staff layer (P2), and Track-A-early sequencing with the urgent visibility reset (P3).

## D013 — Configurability / versatility is a first-class, cross-cutting design principle (2026-06-28)
**Decision:** Build **configurable / data-driven, not hard-coded — across the WHOLE platform**, not just RUS. Domain specifics — job types, billing codes, rates, form/daily-card templates, statuses/pipelines, unit catalogs, client/program profiles — are **data (admin/engineer-editable rows), not code.** **RUS is the first configured *profile*, not the foundation.** New client/program/permit/discipline = configuration, not a developer.
**Reasoning:** Carter, emphasized as his intent "from the get go": *"versatility is important for everything"* — everything always changes. Gives **both** things he wants: handle RUS's complexity now AND adapt to constant change; scales with the company; keeps the (far-future) sellable door open — **at no extra cost if designed in from the start** (retrofitting configurability later is the expensive path). Universalizes existing leanings (map "units = data not code"; per-job billing codes as a reporting overlay; catalog-driven jobs).
**Application:** a **standing review lens** alongside cost-discipline, dead-simple/never-a-time-waster, money-server-side, no client-$-leak. Every spec/build is checked: *"is this domain-specific thing data or hard-code? make it data."* Applies to all systems A–G, future work, and the training visibility/perms.

## D014 — COUNTY is the organizing unit; Service Areas nest within it; SAs are NOT RUS-exclusive (2026-07-01)
**Decision:** The **County** is the top organizing unit for work (esp. non-RUS scattered permits). A **Service Area is a finer boundary that nests WITHIN a county** (its own tab/boundary when one exists — e.g. a RUS concentrator). **Service Areas can be non-RUS** (corrects the earlier implicit "SA sits under an EC = RUS" framing). A permit always shows under its **County**, and additionally under its **Service Area** if it has one. Example (Carter): *a RUS permit shows in Jones County AND in its Service Area within it; a non-service-area (non-RUS) permit shows just in Jones County.* Target UX: **county boundaries auto-populate on the map + the county field autofills** from location (find a county-lines/geo tool).
**Reasoning:** Carter (2026-07-01), answering O3 ("does 'Service Area' fit small non-RUS permits?"). County is the natural unit for many small permits across GA/FL; SA is the finer nesting for bounded/RUS work. **Alternatives:** force everything into "Service Area" (rejected — awkward for loose permits); a separate generic "Project/Permit" unit (rejected — county is the real-world organizer).
**Implication:** the keystone model gains **County** as a first-class level around/above Service Area; the map integrates county boundaries + autofill (**deferred to map delivery** — see D016); the job board groups permits by county (+ SA when present). Needs a `PRODUCT_PLAN`/keystone-model update + likely schema (county on the work unit). NOT yet built.

## D015 — Invoice format is CONFIGURABLE per client, never hard-coded (2026-07-01)
**Decision:** Invoices vary by client, so **do not hard-code per-client templates.** Solution = flexible/data-driven: **per-invoice custom text field(s)** + **export to PDF and Excel.** **Leverage the EXISTING configurable invoice-template engine (idea I5** — sample PDF → generated template → puppeteer render) rather than build new; extend it with per-invoice custom fields + an Excel export path.
**Reasoning:** Carter (2026-07-01): *"invoices vary by client and I'd rather not hard code it… maybe a custom text field or something per invoice that allows me to export to PDF or excel."* Pure D013 (configurability). **Reframes O4** — the "send me one submission sample per client to hard-code from" ask becomes "samples are reference input for the flexible engine," not templates to bake in.
**Implication:** connect to I5 (surface/verify it's reachable); add per-invoice custom fields + Excel export; this is the billing-submission format layer of System A.

## D016 — The MAP is delivered from an EXTERNAL/collab source; integrate-as-delivered, don't over-design it now (2026-07-01)
**Decision:** The map is **NOT final and is a collaborative effort coming from a different source**; it will be put in and changed as needed when it arrives. Planning/CEO **do not deep-design map internals now** — capture the map *requirements/hooks* (county autofill D014, materials-sync, production tracker, splice-as-layer) so we're ready, but the map build itself is "integrate + adapt the delivered artifact."
**Reasoning:** Carter (2026-07-01). Avoids wasted design on a moving, externally-owned target. **Supersedes** the earlier "final map version pending Carter's boss" note with the clearer "external collab source, integrate-as-delivered." The map/projection ENGINE (I6) already exists to receive it.
**Implication:** keep `docs/map_requirements.md` as the living hooks/capability spec (memory `project_map_requirements_spec`); do NOT queue a big map-internals build — queue the *integration* for when the artifact lands.

## D017 — Wake-watcher cascade ACTIVE (3 live instances); Auditor reports directly to Planning (2026-07-01)
**Decision:** With Planning + CEO + Auditor all live, **activate the git wake-watcher cascade** (the D004 trigger "wire when real parallel instances exist" has fired). Each instance runs a background `git fetch origin main` loop that alerts on `planning/` changes → pull + re-read its thread. **Planning runs the mirror watcher** (wakes on CEO/Auditor thread pushes). **Comms model confirmed (Carter asked to verify exactly):** the **Auditor reports findings DIRECTLY to Planning** — NOT routed through the CEO (D006: a verifier can't report through the party it verifies, or findings get dismissed). The Auditor **may ask the CEO direct *technical* questions** for efficiency (on `threads/ceo.md`); **Planning adjudicates every finding + routes fixes to the CEO.** Threads live on `main` (D012); thread-file-only commits, `pull --rebase` before push to avoid clobbering.
**Reasoning:** Carter (2026-07-01) — the instances are live, so the cascade must be wired (I was late to do it — it's in D004 and I should have on instance-go-live). Direct Auditor→Planning preserves the single-verdict-owner integrity (D006).
**The Auditor's VALUE (Carter asked to articulate):** independent verification that (1) **takes verification off Planning's plate** so Planning doesn't burn its compounding/expensive context re-checking every push; (2) **catches what Planning/CEO are "too close to see"** — a fresh party that didn't build or verify the thing finds the blind spots the builder/verifier miss; (3) **frees Planning to stay at planning altitude** — confirm pushes match the plan + develop new plans, rather than doing QA. Most valuable precisely when Planning did NOT build/verify the artifact itself (separation: CEO builds → Auditor verifies independently → Planning adjudicates + plans).

**ADDENDUM (2026-07-01, confirmed by the live CEO + Auditor) — CORRECTS D012's "threads on main":** the CEO + Auditor instances are **harness-scoped to their own branch and CANNOT push to `main`.** So the working comms model is: **instances post thread entries + work to THEIR branch; Planning's branch-aware watcher catches the push; Planning PULLS + adjudicates + CURATES their thread entries into `main`** (the durable record). **Planning posts directives/rulings to `main`** (`threads/*.md`), which the instances' `origin/main:planning` watchers see. Loop closed both ways without instances needing main-push rights. (This is why the CEO's first proposal + the Auditor's chunk-1 landed on their branches, not main — expected, not a deviation.) Planning's watcher must be **branch-name-agnostic** (fire on ANY non-main branch change) since instance branches are auto-named (`claude/<...>`).

## D018 — Chat/thread responses stay SHORT; depth lives in the docs (2026-07-01)
**Decision:** Every instance keeps **chat + thread responses SHORT**; the DETAIL goes to the **durable docs** (planning/ registries, branch commits, report files) — not verbose chat. CEO/Auditor: commit detailed work + a short thread summary that points to it. Planning↔Carter: concise replies; the full reasoning/records live in planning/. **The DEPTH of work + documentation does NOT change — only the chat layer is trimmed.**
**Reasoning:** Carter (2026-07-01): *"keep responses in their chats short. Most details go to you in the docs, short responses in chat lower cost and I don't need them… Nothing should change with the level of info you get."* Cost + he doesn't read verbose chat. **Refines D007** — "heavy communication" = thorough documentation + conflict-catching (in the docs), NOT verbose chat.
