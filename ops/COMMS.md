# COMMS — the board + wake mechanics. ⛔ FROZEN (changes need Carter, per CONSTITUTION §hard-rule-6)
> One page. This replaced branch-thread files, watcher cascades, and echo-wake debugging. Do not refine it.

## The board = GitHub Issues (via `gh`)
- **One issue per work package.** Registrar creates them from RATIFIED specs (~≤1 foreman-day each; body: spec pointer + done-when + constraints). Bugs, deviations, and urgent items are issues too (`bug` / `deviation` / `urgent` labels).
- **Claiming (all agents share one GitHub identity → labels + comments, never assignee):**
  claim = add `claimed:fN` + comment `CLAIMED fN · branch fN/issue-<num>-<slug>`.
  **Race rule:** re-read after claiming; two claims → earliest comment timestamp wins, loser un-claims. Branch names embed the issue number.
- **Lifecycle:** `open` → `claimed:fN` → `built` (Tier-1 done; comment the commit SHA) → `verifying:voN` → `verified` (verdict artifact linked) | `fix-needed` (findings; back to the claiming foreman) → Registrar merges → close + `merged`.
- **Queue-jumpers:** `urgent` + `bug`(live-facing) = drop-everything lane. `blocked` = waiting on an answer; say on whom.
- **`shared-infra`:** one pinned issue per wave; its claimant is the ONLY foreman who may touch shared components, `course-catalog.js`, or app-shell that wave.
- **Build outputs are never committed per-package** — the Registrar rebuilds at merge (kills asset-churn conflicts).

## Discovery (how you know what's ready — guaranteed baseline)
**Poll the board at the start of EVERY turn and work boundary** — one call:
- Foremen: `gh issue list --label urgent,bug,open` (urgent first), plus your own `fix-needed`.
- VO: `gh issue list --label built`.
- Registrar: `gh issue list --label verified` (+ triage `bug`/`deviation`).
Persistent monitors on top are optional best-effort; correctness NEVER depends on them. (History: exit-watchers died on cloud harnesses; boundary-polling is the pattern that never failed.)

## Git rules
- Foremen/VOs: branch-scoped; `git pull origin main` at boot + before/after every increment + before reporting. Never push `main`.
- Registrar: sole `main` merger; `git remote prune origin` before fetch sweeps (stale refs silently blind you — learned the hard way).
- Off-limits paths for foremen (Registrar wires at merge): `server.js`, `auth.js`, `migrations/`, `schema.sql`, `law/`, `specs/`, `ops/`.

## Escalation ladder
Question a spec answers → read the spec. Law answers → Registrar cites it. Judgment/scope/schema → `deviation` or `blocked` issue → Registrar escalates to Partner/Carter. NEVER decide unilaterally, never improvise policy.
