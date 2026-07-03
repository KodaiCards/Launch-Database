# HANDOVER PLAN — how the canon lands (execute only after Carter approves the walkthrough)
> One deliberate cutover at a quiet moment. Until then: nothing commits; current agents undisturbed.

## 1. The commit (single commit to main)
- ADD `law/` (CONSTITUTION · PRODUCT_BAR · PLAN · GATES · DECISIONS · BOOT) + `specs/` (CALLUPS · training-fix · ideas/) + `ops/` (COMMS · INVENTORY moved from planning/ · a lean CHANGELOG).
- MOVE `planning/` → `archive/planning-2026-06/` with a tombstone README → `law/`. PRODUCT_PLAN / ROADMAP / IMPLEMENTATION_PLAN stay in `docs/`, each gaining a one-line header: "Reference. Authoritative sequence = law/PLAN.md; ratified specs supersede." Fix the two known stale lines (auto-migrate claim; migration numbers) in that same touch.
- UPDATE `CLAUDE.md` front door: new chain (Carter > Partner > Registrar > Foremen/VOs), read order = `law/` first.

## 2. Board setup (Registrar's first act post-boot)
Enable/confirm GitHub Issues on the repo → create labels (`open`, `claimed:f1..f3`, `built`, `verifying:vo1..vo2`, `verified`, `fix-needed`, `merged`, `bug`, `urgent`, `deviation`, `blocked`, `shared-infra`) → file the training-fix work packages (WO-1..WO-4 per specs/training-fix.md; WO-1+WO-3 parallel-safe; pin the wave's `shared-infra` issue).

## 3. Session cutover
Old Planning session: Carter tells it to stand down (state already merged; the canon replaces the handoff). Boot from `law/BOOT.md`: 1 Registrar + 2 Foremen (f1, f2) + 1 VO (vo1) — the starting configuration; Carter scales slots later as needed. Old sessions never resumed.

## 3b. Deletion manifest v2 — FULL doc sweep (rides the cutover commit; docs/metadata only, zero runtime impact)
✔ DONE ALREADY (local, gitignored): `.claude/worktrees/` — 28MB removed 2026-07-02.

**ROOT — delete:** `HANDOFF.md` · `DEPLOY_NOTES.md` · `CLEANUP_CANDIDATES.md` · `PROJECT_NORTH_STAR.docx` · `briefs/` (128K) · `research/` (340K — map is external now). Root non-code goes 7 → 3 (CLAUDE, README, ROADMAP-as-reference). The other ~35 root items are runtime code/config — they stay (loose root modules → `lib/` is a cutover-era refactor note, not a deletion).

**docs/ — delete (31 → 7; git history preserves all):**
- Dead regimes/one-times: `archive/` (460K) · `legacy-specs/` · `audit/` (old-regime verification artifacts; new verdicts live on board issues) · `MONDAY_DEMO_SCRIPT.md` · `railway_services_audit.md` · `test_plan.md` (GATES/premerge supersede) · `migration_history.md` (migrations/ + schema.sql are truth) · `training_build_plan.md` · `training_design_spec.md` · `training_launch_design.md` (canon supersedes all three)
- Superseded by canon/ops: `feature_inventory.md` (→ ops/INVENTORY) · `admin_surfaces.md` (legacy-admin survey; cutover_inventory carried its decisions)
- Dying-feature docs: `projects_tab_design.md` (legacy tree; strip the 2 code-comment refs in same commit) · `audit_log_api.md` (with the 2.2 code removal) · `electron_desktop_app.md` (stale plan; desktop/ code untouched)
- Code-is-truth API summaries (rot magnets; route_index.md remains the single API map): `client_portal_api.md` · `client_portal_onboarding.md` · `photos_api.md` · `workspace_api.md` · `folder_workspace_schema.md`

**docs/ — FOLD-then-delete** (each becomes the seed of its spec at that spec's session, then dies): `cutover_inventory.md` → specs/cutover · `billing_keystone_design.md` + `budgets_design.md` → specs/billing · `projections_design.md` → specs/projections.

**docs/ — KEEP (7):** `PRODUCT_PLAN.md` + `IMPLEMENTATION_PLAN.md` (reference headers: specs supersede) · `route_index.md` · `security_model.md` · `design_system.md` · `map_requirements.md` (D016 living hooks doc) · `README.md` (rewritten as a lean index).

⛔ **NOT bulk-deletable (wired into server.js — dies via cutover packages 2.2/2.3, or stays):** `automation.js` · `portal_module.js` · `timeclock_module.js` · `invoice_generator.js` · `invoice_template_engine.js` · `routes/audit_log.js`/`_audit.js` · AI assistant (`routes/ai.js` — KILL stands; removal = a cutover package) · `routes/customer_portal.js` + `customer.html` (LIVE now) · `public/training/` dist (production) · `map/` + `public/map/` (working tool) · `desktop/` (future folder-watch).

## 4. Branch prune (destructive — Carter confirms the list before the axe)
Keep: `main` (+ fresh role branches as created). Delete: ALL legacy branches — `claude/*` boots/experiments, `ceo/*`, `chore/*`, `redesign/*`, `orchestrator-checkpoints/*`, `worktree-*`, `claude-2/*` + `claude-5/*` (quarantine dies with them), and `feature/*` AFTER a `git branch -r --no-merged main` sweep by Partner confirms nothing of value is stranded (anything found: noted or cherry-picked first). Also remove `.claude/worktrees/` leftovers. Executed by Carter or Registrar with Carter's explicit go (hard rule 9).

## 5. Day one
Foremen claim WO-1 (leak strip) + WO-3 (premerge script) immediately → WO-2 readability retrofit per topic (rolling) → WO-4 settings layout → VO verifies each → Registrar merges rolling → Carter green-lights republish per topic. Track 2 opens when Carter says go (usage-conscious): UI pass + cutover spec sessions with Partner.

## 6. Queued Partner tasks (post-handover)
1. **Interactive walkthrough** of the canon + each spec with Carter (mockups; iterate live; covers EVERYTHING, not just `*`).
2. Draft specs 2.1–2.5 just-in-time (ui-pass · cutover incl. events/nudges + county slot · roles-capabilities).
3. First phase review after training-fix ships: did the new gates hold? (Fable audit, like the one that built this canon.)
