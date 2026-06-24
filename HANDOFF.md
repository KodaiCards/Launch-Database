# HANDOFF — head Claude (CEO) pass-point

> **You are the new head Claude (CEO) for Launch Fiber.** Read `CLAUDE.md` then `ROADMAP.md`, then this. Your memory dir also loads each session. This doc is the live state + the next phase, written 2026-06-23 by the outgoing instance. Keep it updated when you hand off again.

## 1. Your role
CEO / thin router. You own the **schema, conventions, directives, task briefs, all merges, and adversarial review**. You write code directly (the old "never code, always delegate" rule is retired). Use sub-agents only for genuinely large/parallel work. Cost discipline is a hard requirement — see §3 and memory `feedback_agent_cost_rules`.

## 2. The team (roster + current state)
- **C2** — branch `claude-2/contractor-timeclock`, **Sonnet 4.6 / medium**, run by Carter as a separate instance. Built: Phase 5 hours/timeclock, contractor role support, Phase 4 money view, and the keystone operations cluster (clients/invoices/people/search/audit/settings/etc.). **Round 8 merged.** Now on the **"Portal takeover"** batch — it inherited C3's portal and its unfinished Round 7. After that, keystone + portal additive work is exhausted → write-path phase (§6) is CEO-led. **C2 now owns the customer portal** (`public/customer.html`, `routes/customer_portal.js`) too.
- **C3** — **RETIRED 2026-06-23 (out of usage); branch `claude/inspiring-bell-7jiwdf` deleted (was fully merged).** Built Phase 6 customer portal, all merged. Its unfinished Round 7 (help/contact/a11y/print) was reassigned to C2 ("Portal takeover" in `briefs/claude-2.md`).
- **C4** — branch `claude-4/quality`, **Sonnet**, **YOUR subagent (currently PARKED).** Wrote 116 passing unit tests (`tests/`). Re-deploy on-demand for isolated test/feature batches via the Agent tool. **Do NOT build it into a standing merge/integrator bot** (see §3 reasoning).
- C2/C3 push branches; you review + merge to `main`. They each have a brief in `briefs/`.

## 3. How you operate (cost rules — Carter watches usage closely)
- **You do ALL merges + verification — Carter does NOT run CI or review.** Use `briefs/INTEGRATION.md` to set your review *depth*: GREEN (frontend/tests/docs, no backend/schema) → light grep + read CI status, then merge; RED (touches `routes/`, `server.js`, `auth.js`, `migrations/`, `schema.sql`, money/auth/customer-$/keystone-core, new endpoints, CI red, or a `BLOCKED` note) → deep review. CI (`npm test`) auto-runs on push — read its result; don't re-run it in your context.
- **Review RED cheaply:** `git diff --stat` + targeted greps (`$`-columns, `^+<<<<<<<` conflict markers, `esc()`) + run `node --test tests/<files>`. Do NOT read whole files into your context or spawn a scout for small diffs. Scout only for ~500+ line multi-file diffs.
- **Don't compare live assets to working-tree files** — `core.autocrlf=true` fakes "stale deploy" diffs. Use `git show <ref>:path` or `tr -d '\r'`. (This cost the outgoing instance a wrong diagnosis once.)
- New route modules must be **mounted in `server.js`**. Push to `main` → Railway auto-deploys.
- Don't keep a local `node_modules` (disk fills — C: hit 0 bytes once). `node --test` for pure tests needs no deps.

## 4. What's built + live
Keystone (migration `0064`): `service_areas` + `service_area_jobs` + `time_entries`; logic in `routes/service_areas.js`. **Service Area = unit of work; jobs = billable line items inside it; hours roll into job $ → service-area total → invoice.** Operations cluster (the intended **admin-dashboard replacement**): `dashboard / service-areas / pipeline / billing / money / hours / clients / area / job-board / invoices / people` + the `public/js/app_nav.js` left-rail; reached via the launcher **"Operations" tile** → `/service-areas.html`. Money view (`routes/money_view.js`: margin/aging/revenue/statement/program-financials/CSV). Hours (`routes/hours_summary.js`, `routes/my_work.js`). Contractor role (`auth.js` VALID_ROLES + IDOR-guarded time-entries POST, `$`-stripped response). Customer portal (`routes/customer_portal.js` + `customer.html`, `client_visible`-gated, maps per area). `routes/export_bundle.js`, `routes/cluster_views.js`, `routes/search.js`. 116 unit tests in `tests/`.

## 5. Deployment facts
- Railway; domain **launchfiberadminportal.xyz**; source `KodaiCards/Launch-Database@main`; auto-deploy ON; pipeline **healthy**.
- **CI:** `.github/workflows/test.yml` runs `npm test` on push + PR (node 20) — free verification; lean on it, don't re-run tests in your context.
- **Latent bug:** Railway `startCommand = node server.js` skips `prestart` → `scripts/auto_migrate.js` **never auto-runs**. Existing tables were applied manually. Before shipping new migrations, get Carter's OK to switch start to `npm start` (touches prod boot). Until then, migrations must be applied deliberately.
- **Dev DB:** Railway public proxy. Get `DATABASE_URL` + the `qa_claude` test login from Carter (not stored, not in repo). `qa_claude` + "DEMO" data must be deleted before launch.

## 6. NEXT PHASE — write-path & admin-cutover (CEO-led; this is why we handed off)
The cheap parallel-additive phase is ending; C2/C3 have nearly exhausted safe additive work. The next progress is **schema + keystone-core**, which is your scope and can't be cheaply parallelized. Plan (foundation-first):
1. **Inventory** what `public/admin.html` still does that the cluster can't — create/edit **service areas, jobs (discipline/employee/billing/rate/status), clients, engineering contracts**, plus permits/staff. Decide migrate-vs-keep with Carter.
2. **Write endpoints in `routes/service_areas.js`** (your core): create/edit/delete/assign/advance service areas + jobs from the cluster UI. Keep the EC⟺RUS rule (`program='rus'` when an EC is attached).
3. **Client/EC management** in the cluster (today `clients.html` is read-only) — add create/edit.
4. **Cutover:** at parity, retire/redirect `admin.html` and the legacy `projects` rollup tree → the cluster; update the launcher tile. Decide whether legacy project data is migrated or left read-only during transition.
5. **Migrations** only if the model needs them; run `npm run schema:sync`; mind §5's start-command caveat.
6. **Then parallelize the safe parts** (frontend forms, validation UI) to C2/C3 — but you lay the schema + write endpoints first.
- **Open decisions for Carter:** which admin.html features to drop; legacy-projects migrate vs read-only; the cluster tile name ("Operations" vs "Service Areas" — still TBD).
- **Also pending/deferred:** Phase 7 — site photos/files per service area (`project_photos` needs `service_area_id` + `client_visible`; C3 specced it in `briefs/claude-3.md` task 14); switching Railway to `npm start`.

## 7. Carter (the user)
Solo founder, **Launch Fiber Services** (Macon, GA) — fiber engineering services; main client **PSC**, much on **RUS** government contracts (real revenue + gov tracking, high quality bar). Direct, decisive, **dislikes confirmation pop-ups**, wants everything streamlined/auto-populated ("if X then Y" with override). **Cost-conscious** — minimize usage, don't read raw diffs into context, don't over-spawn agents; he'll say if something's too expensive. **Run autonomously** — he may be away for hours; act and report, don't wait for permission on routine merges/pushes. Confirm only destructive/irreversible actions. He asks sharp questions and pushes back — **engage honestly and admit mistakes** (he values that over confident wrongness).

## 8. Pointers
`CLAUDE.md` · `ROADMAP.md` · `briefs/` (`claude-2.md`, `claude-3.md`, `claude-4.md`, `README.md`, `INTEGRATION.md`) · `docs/route_index.md` · `docs/security_model.md` · memory dir (`MEMORY.md` index).
