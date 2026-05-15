# HANDOFF — full context for the next Claude

> **Read CLAUDE.md FIRST. This file complements it.**
> CLAUDE.md has: user profile, operating protocol (delegation, pipeline, ≥2 agents, RT discipline, signing policy, sequential push rule), running state, session metrics, lessons learned, audit-output conventions.
> THIS file has: full product context — what each repo actually does, file-level inventory, feature/route maps, domain terminology in depth, in-flight work right now, common pitfalls beyond the ones in CLAUDE.md.

---

## §A — Who's the user, what's the company

- **Carter Trantham**, solo founder/operator of **Launch Fiber Services** in Macon, GA.
- Engineering services firm serving private + government clients on RUS-program engineering contracts. Primary client: **PSC (PSC Engineering)**.
- Macon is in NESC **Light loading district** (matters for OSP design content).
- Carter is the only human in the loop — there is no team to coordinate with. All docs (this file, CLAUDE.md, audit-output/*) are Claude-to-Claude artifacts.
- Tone: casual, direct, profanity welcome. Skip "Acknowledged"/"Got it"/"Understood." Don't dwell on mistakes; integrate the lesson and move on.
- Trust model: Carter trusts the orchestrator to drive multi-wave operations unsupervised. Push back on bad ideas. Don't ask questions whose answers are in docs. See CLAUDE.md §1 for the operating contract.

---

## §B — The two repos

### B.1 `kodaicards/launch-database` — the main app

**What it is:** Multi-portal engineering operations platform. Express + pg-pool + Postgres + vanilla JS frontend (no framework). SSE for live updates. Puppeteer for PDF rendering. Anthropic SDK for AI assistant. Deployed on Railway. ~50K LOC across `routes/*.js` + `public/*.html` + `public/js/*.js` + Postgres schema + migrations.

**Active dev branch:** `claude/debug-previous-issues-MoN9D`

**What it does, per role (Carter's own words 2026-05-09):**

| Role | Daily surface | Notes |
|---|---|---|
| **Permitters** | `routes/permits.js`, `routes/design_pipeline.js`, `routes/potential_permits.js` + corresponding portal HTMLs | Manage product statuses through the permitting pipeline. Their daily workhorse. |
| **Designers** | Project management + splicing matrix portal | Use splice tool to produce PDF files of splice matrices. Splice portal serves both team AND external contractors via public-token flow. |
| **Admin** | Billing, invoices, revenue dashboard, audit logs | `routes/billing.js`, `routes/invoices.js`, `routes/revenue.js`, dashboard, audit logs. Big-picture management. |
| **Managers (design / permitting)** | Hours integration, time-entries rollup | Need visibility into their team's time. `time_entries` → invoice rollup chain (RUS-Fix wave touched this). |
| **Contractors (external)** | `/splice/field/:token` + `/splice/view/:token` public surfaces | Splicers accessing the splice tool via QR-on-PDF token (no login). Primary use case, not a security afterthought. |

**Top-level routes (in `routes/`):**
- `auth.js` — login, logout, session, `requireAuth()` middleware (lfs_session httpOnly cookie). Used by every other authed route.
- `oauth2.js` — Moodle OAuth2 bridge (332 lines). **To be deleted in OSP-RW.6.**
- `projects.js` — CRUD for `projects` table. Powers `/api/projects` with optional `?type=`, `?client_id=`, `?ec_id=` filters. The Design Picker bug wave traced 3 bugs here (D1 `clientId` undeclared in design.html, D2 `?project_type=` vs `?type=` param mismatch, D3 rollup leak in WHERE clause).
- `engineering_contracts.js` — EC CRUD. ECs carry `program` field (`rus`, `bau`, `gfr`, `other`) which drives invoice template selection.
- `clients.js` — client CRUD. Drives the Client dropdown in pickers.
- `permits.js` / `potential_permits.js` / `design_pipeline.js` — permitting workflow surfaces.
- `splice.js` — the splice subsystem. **Largest single file (~6800 lines).** Public + auth surfaces, token-based contractor access, SSE live updates, PDF generation via Puppeteer.
- `time_entries.js` — clock-in/clock-out, switch-project, manual entry, edit-entry. Connects to invoice rollup.
- `invoices.js` / `invoice_generator.js` — invoice CRUD + PDF rendering. Templates per `ec.program` field (RUS template differs from BAU/GFR/other).
- `billing.js` / `revenue.js` — admin financial views.
- `ai.js` — Anthropic SDK integration. AI assistant has tool-use surface with `write_sql`, `update_engineering_contract`, `query_database`, etc. Tools are gated by an approval mechanism with `MODIFYING_TOOLS` set.
- `dashboard.js` — admin dashboard endpoints (active lists, projections, YTD cache).
- `audit_logs.js` — audit trail. Bumped by `tokens_invalid_after` on password change / logout.

**Top-level public surfaces (in `public/`):**
- `launcher.html` — portal launcher tile grid. Fetches `GET /api/me/portals` for dynamic tile list.
- `login.html` — auth entry.
- `dashboard.html` — admin big-picture view + projection tiles (3 currently "Under Construction"). 
- `design.html` — designer workflow surface. Project picker, splice matrix entry, EC/WO/SA pickers (cascading dropdowns).
- `permitting.html` — permitter workflow. Mirrors design.html's EC/WO/SA picker structure.
- `timeclock.html` — clock-in/clock-out + switch-project + back-fill. **Picker is currently broken** — shows rollup parents instead of leaves (P2 wave addresses).
- `billing.html` / `invoices.html` / `revenue.html` — admin financials.
- `splice.html` (auth) + `/splice/field/:token` (public contractor) + `/splice/view/:token` (public view) — splice subsystem surfaces.
- `admin.html` — user mgmt + audit logs.
- `clients.html` — client mgmt. Has a "Clients UC" nav-tab that's hidden in Phase 1 cleanup.
- `training.html` (deprecated placeholder — see B.1.training below).

**Domain terminology (critical to understand):**
- **EC** = Engineering Contract. Umbrella above individual project contracts. Carries `program` field (`rus` / `bau` / `gfr` / `other`) that drives invoice template selection.
- **Rollup** = `projects` row with `is_rollup=TRUE`. Organize-only folder, no billing rate. Three rollup levels: `client`, `team`, `service_area`. Linked via `rollup_key`. **Rollups MUST be filtered out of leaf-only pickers** (timeclock, design picker).
- **PSC RUS** = the user's primary client (PSC) on RUS-program engineering contracts. Drives the inspection tab + the RUS invoice template.
- **Contractor** = external splicer accessing splice tool via public token (no login). QR-on-PDF → field markup flow.
- **WO** = Work Order. Tied to ECs via `engineering_contracts.work_order_number`.
- **SA** = Service Area. Tied to ECs via `ec_service_areas` table.
- **`tokens_invalid_after`** = column on `users` table; bumped on password change/logout (after Wave 1.5) to invalidate any extant JWTs for that user. Checked in `authMiddleware` against JWT `iat`.

**Training tile (the OSP integration point):**
- `server.js:249-257` defines the `training` portal in `PORTAL_DEFS` (audience: `'employee'`, all non-customer employees).
- `server.js:433-441` wires the static-serve route: `app.use('/training', requireAuth(), express.static(path.join(__dirname, 'public', 'training')))` + SPA fallback at `/training/*`.
- The built Vite SPA lives in `public/training/` (3 files, ~644 KB, last touched by commit `5e38762` "Wave 1.7: Training back-link"; actual content from `1a170de`).
- Strategy A (commit pre-built dist) is the current deploy pattern. Railway doesn't rebuild the SPA — updates require local `npm run build` in osp-design-training, then committing the new dist into launch-database.
- `vite.config.js:base: '/training/'` is set so SPA asset paths line up.
- `lfs_session` cookie travels on same-origin fetches from the SPA back to launch-database APIs (`sameSite: 'lax'`). The SPA currently makes ZERO API calls back, but the infrastructure is in place.

**Moodle integration (scheduled for teardown — OSP-RW.6):**
- `routes/oauth2.js` — 332 lines implementing OAuth2 Authorization Code flow (`/oauth2/authorize`, `/oauth2/token`, `/oauth2/userinfo`).
- `moodle/` directory — Dockerfile + railway.json + startup-hook.sh + seed-admin.sh + README.md for a separate Moodle Railway service (bitnami/moodle:4.5).
- `server.js:725-731` wires OAuth2 routes; `server.js:344-352` has `/oauth2/*` auth bypass; `server.js:197-201` defines `TRAINING_URL` env var pointing to Moodle when set.
- `.env.example:24-61` documents `OAUTH2_CLIENT_ID`, `OAUTH2_CLIENT_SECRET`, `OAUTH2_ALLOWED_REDIRECT_URIS`, `OAUTH2_JWT_SECRET`, `LAUNCH_DB_BASE_URL`.
- `tests/oauth2.test.js` — integration tests.
- **No Postgres tables involved** — OAuth2 codes use in-memory Map with 60s sweep.
- ALL OF THIS GETS DELETED in OSP-RW.6.

**Database (Postgres):**
- Schema lives in `migrations/0001_*.sql` through current. Latest applied is around migration `0032_*`. Migrations are append-only sequential — never edit a past migration; add a new one to evolve.
- `schema.sql` is the canonical fresh-DB schema (kept in sync via `npm run schema:sync`).
- Core tables: `users`, `clients`, `engineering_contracts`, `projects`, `permits`, `potential_permits`, `splices`, `splice_tokens`, `time_entries`, `invoices`, `invoice_items`, `audit_logs`, `ec_service_areas`, `ec_work_orders` (new from `7f3b6cb`), etc.
- No training tables exist today. OSP-RW.2 BE adds `training_progress` + `training_cert_attempts` (migration `0033_*`).

**Pre-commit hooks + CI:**
- Commits are signed via `gpg.ssh.program=/tmp/code-sign` wrapper. **The wrapper returns 400 on `git pull --rebase` (replayed commits).** Use `git fetch && git merge FETCH_HEAD --no-edit` instead.
- Unsigned commits are working norm with explicit user approval. Use `git -c commit.gpgsign=false commit ...` per commit.
- CI smoke is a single combined job (`Backend smoke tests`) with three steps: backend `npm test` → `npm run schema:sync` + diff check → Playwright `npm run test:browser`. Failures must be diagnosed per step.
- Test framework: Node's built-in test runner for backend; Playwright for browser specs.

**Recent wave history (highlights):**
- Wave 1 (CRITICAL, mine pre-outage): auth gates, timing-safe comparisons, IDOR fixes — `55d8e44`/`f2f9349`/`1cbe639`
- Wave 1.1 hotfix: SSE iat regression + DDL regex bypasses — `6d2efc6`
- Wave 1.5 (temp Claude during outage, partial): cookie-only migration broke frontend at `e493200` (Monday demo failure cause #1) — fixed at `4c751c5`. Migration `0023` had `%%` instead of `%` causing boot failure (cause #3).
- Wave 1.6: error-message sanitization (120 leaks plugged) — `25e087e`
- RUS-Fix (mine, CRITICAL): EC-Linkage architectural fix + migration 0023 — `87cff55`/`1ac63ef`/`6f90161`
- Wave 2 BE-AI v3: 5 items — `1ea79db`
- Wave 3 BE-Perf: 9 indexes + N+1 fixes + recursive CTE + YTD cache — `20560fe`
- Wave 3 FE-A11y round 1+2: focus trap+return, skip-nav, main landmark, form labels — `edde65a`/`c0e4c65`
- Feature: EC WO# + Service Areas — `7f3b6cb` (8 endpoints, Settings UI, project-modal scoping; likely regression vector for the Design Picker bug)
- Feature: manual job-assignment — `a379584`
- Feature: bulk-create projects atomicity — `2dbb28f`
- OSP-Merge attempts 1-4 (Strategy A landed) — `ead0d98`/`7ca2e3c`/`9ae778f`/`1a170de`
- Wave Projection (math/arch/FE/BE split fix-agents) — `d0bc210` + follow-ups
- Phase 1 demo-blocker cleanup (Wave 1.7) — `3d66c69` (in-flight CI check pending)

**Known open issues / waves not yet started:**
- Wave 2 FE-Crit: ~95% open — state-mgmt try/catch, actor pre-fill, persistFilter re-trigger, invoice-history tree state, several more
- Wave 1.5 remainder: Puppeteer SSRF + setRequestInterception, splice error sweep (~107 catches), splice SSE JWT iat re-validation, schema drift
- Wave 2 BE-AI remainder: `update_engineering_contract` → MODIFYING_TOOLS, userWantsAction third regex anchor, query_database users blocklist, approval double-null fail-closed
- Wave 3 BE-Perf remainder: Puppeteer browser pool, sync fs.* in admin, invoice_generator nested CTE, GET /api/projects unbounded
- Wave 3 FE-A11y remainder: 47+ modal role=dialog + focus trap, form labels for=, 29+ close-button aria-labels, color contrast
- UI-A polish: training tile back-to-launcher link, dark-mode logo inversion, single-square layout (some landed in Phase 1)
- Projection wave Phase 2 (Path B chosen): finish 3 UNDER CONSTRUCTION tiles (Dashboard "Next 90 Day Projection" + "RUS Revenue Projection" + project-detail "Projected Revenue"). 3-auditor high-stakes wave (cashflow trust surface).
- Design Picker fix wave: 3 known bugs (D1 clientId undeclared, D2 param mismatch, D3 rollup leak). Reports `f1be9e7` + `aaf3b5d`.
- Timeclock picker P2-A/B/C: spec locked (Carter answered 2026-05-14). P2-A = BE cascade endpoint, P2-B = FE 3-dropdown cascade + sessionStorage stickiness, P2-C = polish/a11y. No auto-create branch (Carter's Q3 answer). Completed projects hidden from clock-in cascade.

---

### B.2 `kodaicards/osp-design-training` — the OSP Training SPA (becoming the LMS)

**What it is:** React 18 + Vite 5 + Tailwind. Standalone Vite SPA. Currently 12 monolithic `Module<NN>_*.jsx` files with shipped curriculum content (7,427 lines total). Mounted as static at `/training/` in launch-database via Strategy A.

**Active dev branch:** `claude/debug-previous-issues-MoN9D`

**Tech stack:**
- React 18 + Vite 5
- Tailwind CSS
- No React Router (state-based sidebar nav — being replaced in OSP-RW.2)
- No backend calls today (being added in OSP-RW.2)
- 2 localStorage uses: `Flashcard.jsx` (SRS scheduler state), `TopologyCanvas.jsx` (sketch persistence)
- Build: `npm run build` → `dist/`. `dist/` gitignored. Railway no longer builds on deploy (build hook removed at `1a170de`). Pre-built dist is committed into launch-database `public/training/`.
- `vite.config.js:base: '/training/'` for asset path prefixing.

**12 existing modules (file structure):**

`src/modules/`:
- `Module01_FiberPhysics.jsx` (349 lines, 8 sections 1.1-1.8) — wavelengths, attenuation, dispersion, dB math
- `Module02_OSPDesign.jsx` (466 lines, 9 sections 2.1-2.9) — NESC clearances, pole loading, aerial vs UG, OTMR
- `Module03_PermittingPlanning.jsx` (654 lines, 8 sections 3.1-3.8) — NEPA, Section 106, ESA, ROW, make-ready
- `Module04_Splicing.jsx` (593 lines, 8 sections 4.1-4.8) — splice loss, OTDR vs splicer, ribbon, closures
- `Module05_NetworkingBlueprints.jsx` (656 lines, 8 sections 5.1-5.8) — TIA-568, TR/MDF/IDF, T568A/B, TIA-606, TIA-607
- `Module06_RCDDCore.jsx` (756 lines, 8 sections 6.1-6.8) — firestopping UL 1479, FCC Part 15, TIA-569/607, surge protection
- `Module07_FiberTopology.jsx` (651 lines, 8 sections 7.1-7.8) — splice matrix, TIA-598 color codes, pathing, tools
- `Module08_TestingOTDR.jsx` (711 lines, 8 sections 8.1-8.8) — Tier 1 vs 2, dead zones, launch cables, IOR
- `Module09_OSPConstruction.jsx` (687 lines, 8 sections 9.1-9.8) — Call 811, HDD/trenching, burial depth, conduit fill, handholes, as-built
- `Module10_DataCenter.jsx` (551 lines, 8 sections 10.1-10.8) — TIA-942, Uptime Tier, MPO/MTP, hot-aisle/cold-aisle
- `Module11_RevenueEstimation.jsx` (808 lines, 8 sections 11.1-11.8) — FBA cost data, contract types, CPHP/CPHC, change orders
- `Module12_CertificationSim.jsx` (429 lines, 5 sections 12.1-12.5) — RCDD/OSP/CFOS exam structure, ethics, 50-item practice sim
- `ToolsPage.jsx` — utility page

`src/components/`:
- `InteractiveQuiz.jsx` — MC + drag-drop quiz primitive. Used by every module.
- `ModuleLayout.jsx` — Section, Callout, RefList, Table wrappers
- `Flashcard.jsx` — SRS-backed flashcard widget. localStorage key `osp_flashcard_srs`.
- `LinkBudgetCalculator.jsx` — interactive calculator (used in M01 + ToolsPage)
- `OTDRTraceViewer.jsx` — synthetic OTDR trace visualization (used in M08)
- `TopologyCanvas.jsx` — interactive SVG canvas with node/edge editing (used in M07). localStorage key `osp_topology_canvas`.
- `CertificationSim.jsx` — randomized 50-item exam runner (used in M12)

`src/data/`:
- `flashcards.js` (54 lines, 7 cards) — shared Module 1 deck
- `module03-flashcards.js` through `module12-flashcards.js` — 8 cards each (~85 total cards)
- `cert-sim-bank.js` (1,243 lines, **68 cert-sim questions** RCDD/OSP/CFOS domain-weighted)

**Current interactivity inventory:**
- 56 MC quiz items across all modules
- 13 drag-drop items
- 68 cert-sim items
- 2 interactive widgets (TopologyCanvas, OTDRTraceViewer)
- 1 calculator (LinkBudgetCalculator)
- 0 fill-in-blank
- 0 click-to-label diagrams
- 0 branching scenarios

**Current state details (per discovery agent 2026-05-15):**
- All 12 modules are SHIPPED content. No stubs.
- Build: `npm ci && npm run build` → Vite output `dist/`
- Start: `npm run start = vite preview --host 0.0.0.0 --port ${PORT:-4173}`
- Railway healthcheck at `/`. Restart max 5 on failure.
- Fully stateless from backend perspective. No fetch calls. No Postgres.
- Quiz scores in-memory only (lost on page reload). No persistence.
- Routing: pure useState in App.jsx with sidebar. URL never changes. No deep links.

**What's salvageable from prior pitch revision attempts:**
- `7e92ce0` (T2 Worker B) — Module 2 even sections 2.2/2.4/2.6/2.8 revised at Carter-reads-cold pitch. Passes RT A + RT B.
- `3fc206f` (T3 Worker A) — Module 9 odd sections 9.1/9.3/9.5/9.7 revised. Passes both RTs.
- Everything else in that wave was hallucinated (5 of 7 worker agents fabricated their reports — see CLAUDE.md §3 hallucination note).

---

## §C — OSP training rewrite (current major project)

See CLAUDE.md §2 "Architecture v2" and §4 "Phase plan" for the full lock. Summary:

**Locked decisions (Carter, 2026-05-15):**
1. **Drop Moodle entirely.** SPA becomes the LMS itself, served behind launch-database `requireAuth()` at `/training/`.
2. **Splash page** with TWO sections:
   - **General Learning Courses** (default, top, 8 courses): M01 / M02 / M03 / M04 / M07 / M08 / M09 / M11
   - **Certification Prep (Advanced)** (bottom, opt-in, 4 courses): M05 (RCDD prep) / M06 (RCDD core) / M10 (Data Center) / M12 (Practice Exam Bank)
3. **All 4 interactivity types** required: MC/drag/fill-in-blank, AnnotatedDiagram (click-to-label + hover-explain), WorkedExample calculator, BranchingScenario.
4. **10 BICSI topics → each a course → 8-15 lessons each** — but actual repo has 12 modules mapped to RCDD/CFOS/OSP-Designer cert prep, so we use the 12-module structure split into general/cert-prep.
5. **Each lesson teaches dummies → advanced.** Audience: Carter + field crew, no formal engineering training, no BICSI/NEC/NESC/RUS/TIA vocab baseline, no engineering math comfort. Tiered content within each lesson: foundations / working / advanced.
6. **Per-lesson granularity** — each existing module section becomes its own lesson file. ~97 lesson files total.
7. **Lesson format:** JSX per-lesson files (decided over MDX or JSON+JSX renderer — existing components already work).
8. **Routing:** React Router v6. URLs: `/training/` → splash, `/training/course/:courseId` → course, `/training/course/:courseId/lesson/:lessonId` → lesson.
9. **Course catalog:** hardcoded in `src/data/course-catalog.js` for v1 (Carter sole author; DB-backed when SMEs onboard).
10. **State management:** `@tanstack/react-query` for server state + optimistic progress writes.
11. **Postgres schema:** `training_progress` + `training_cert_attempts` only for v1. No course/lesson master tables. Defer analytics + manager assignments tables.
12. **Build pipeline:** Continue Strategy A (commit pre-built dist into launch-database). Re-enable Railway build hook is a v2 evolution.
13. **NO BUILD-LESSONS-LATER.** Carter verbatim 2026-05-15: *"There is no build lessons later. We are making a perfect product from the get-go with no additions needed."* Product is ONE deliverable. Dev branch is staging; production cut happens only at end of OSP-RW.7.
14. **NO PLACEHOLDERS for missing lessons.** Carter verbatim 2026-05-15: *"You can't just delete the placeholders if additional lessons need to be added, you add them during construction of the project."* If a course needs more lessons than its module has sections (M12 = 5 sections, target 8-15), those net-new lessons get AUTHORED during the per-course construction wave.

**Phase plan (internal sequencing, single product deliverable):**

- **OSP-RW.0 Discovery** ✓ — both agents landed (`a2802f9` osp-design-training mapping + `aec6f3b` launch-db training integration mapping)
- **OSP-RW.1 Architecture design** ✓ — Architect A (migration-first, `756c685` → `ARCH-A.md`) + Architect B (greenfield-first, `68bd975` → `ARCH-B.md`); synthesis locked in CLAUDE.md §2
- **OSP-RW.2 Scaffold** — IN FLIGHT. BE fix-agent `a2de386` + FE fix-agent `add030f`. Foundation only: routing, splash shell, LessonLayout, API client, React Query setup, training_progress + training_cert_attempts schema, API endpoints. No lesson content authored yet.
- **OSP-RW.3 Interactive primitives** — queued. 1 fix-agent builds all 4 primitives (`Quiz` with fill-in-blank, `AnnotatedDiagram`, `WorkedExample`, `BranchingScenario`) + example pages. RT pair after.
- **OSP-RW.4 Template course M02 OSP Design** — queued. ≥2 worker agents author full lesson set for M02 (9 existing sections + any expansion lessons) + tiered content + interactive elements. ≥2 RT verifiers. Carter reviews + locks template.
- **OSP-RW.5 Remaining 11 courses** — queued. Parallel per-course waves (≥2 workers + ≥2 RT per course). Salvage `3fc206f` Module 9 odd sections. M12 gets 3-10 net-new lessons authored. Course catalog `lesson_count` values get updated by each wave to match actual authored count.
- **OSP-RW.6 Moodle teardown** — queued. Delete `routes/oauth2.js` + `moodle/` + 5 env vars + `tests/oauth2.test.js` + server.js wiring (lines 197-201, 344-352, 725-731). RT verifies no dangling refs.
- **OSP-RW.7 E2E QA + production cut** — queued. Playwright spec + Carter walkthrough. Build fresh dist → commit to `public/training/` in launch-database. ONLY THEN is the product shipped.

**Things to know about the rewrite:**
- Dev branch = staging. None of this hits the live `/training/` URL until OSP-RW.7 production cut. Live users see the existing 12-module SPA until then.
- The 4 hallucinated workers (T2 Worker A, T3 Worker B, T1 Worker A, T1 Worker B, T6 brief) never did real work — their content is fictional. Don't try to find their commits; they don't exist.
- The two REAL pre-rewrite pitch-revision commits (`7e92ce0` M2 even + `3fc206f` M9 odd) are at "Carter-reads-cold" quality and get migrated into new per-lesson format during RW.5.

---

## §D — In-flight work right now

| Wave | State | Agent ID | Notes |
|---|---|---|---|
| OSP-RW.2 BE Scaffold | ⏳ in flight | `a2de386` | training_progress + training_cert_attempts schema + API endpoints + tests |
| OSP-RW.2 FE Scaffold | ⏳ in flight | `add030f` | React Router + splash + LessonLayout + API client + React Query + course catalog |
| Phase 1 CI check | ⌛ queued | — | Confirm CI green on `3d66c69` (demo-blocker cleanup) |

Once both scaffold agents land, the next dispatch is OSP-RW.3 primitives + scaffold RT pair (read-only on `a2de386` + `add030f`).

---

## §E — Operating protocol summary (full version in CLAUDE.md §3)

**Critical rules:**
1. **The orchestrator delegates EVERYTHING.** No direct curl, mcp__github__*, git, source file reads, tests, builds, greps. Even single-line research is a dispatch. Carter has corrected this 3 times across sessions; it's the most-drift-prone discipline.
2. **≥2 worker agents per standard wave. ≥3 for high/critical. ≥2 RT agents (read-only). ≥3 RT for high/critical.** No "I'll do this one myself" exceptions for non-trivial work.
3. **Red team is READ-ONLY.** Only fix-agents have write access to code/content. RTs write only their own audit reports.
4. **Peer cross-check BEFORE red team.** Worker A reads Worker B's output and vice versa, marks AGREE/DISAGREE/UNCERTAIN with rationale. Produces consolidated finding list. Then RT verifies.
5. **Quality > cost.** Carter's standing constraint is "no mistakes" and a 3% miss rate ceiling. Cost-v2 protocol cuts verbosity/redundancy, NOT audit count or rigor.
6. **Aggressive push.** Fix-agents commit + push after every logical unit, not at end. Mid-run API failures shouldn't lose all work.
7. **Sequential push discipline.** Both repos use single shared dev branch. Never run two fix-agents pushing to same files in parallel. Read-only agents (audits, RTs) can run unbounded in parallel.
8. **`git pull --rebase` triggers the signing wrapper** (returns 400 on replayed commits). Replace with `git fetch && git merge FETCH_HEAD --no-edit`. Every agent prompt MUST include this.
9. **Use `subagent_type: "general-purpose"` for all dispatches.** The `claude` subagent type auto-creates worktrees and fails in this env. `general-purpose` has same `Tools: *` access without the worktree attempt.
10. **Sonnet floor for audit/verify/fix work.** Use `model: "sonnet"` in Agent dispatch. Opus stays on the orchestrator. Haiku is only for purely mechanical tasks.

**Status graphs:** render an ASCII queue graph on every meaningful state transition (wave kickoff, agent landing, push, CI result). Carter wants visual queue updates. See CLAUDE.md §3 "Status graphs" for the format.

**Friend register:** Carter and orchestrator operate as friends, not boss-and-employee. Casual language, explicit profanity welcome where it lands naturally. Push back on bad ideas. Don't be sycophantic. Polish gradient: chat informal, product output extremely polished.

---

## §F — Pitfalls + lessons learned (high-priority)

**🚨 Hallucination pattern (THREE confirmed incidents this wave):**
- T2 Worker A, T3 Worker B, T1 Worker A, T1 Worker B, T6 Brief Re-baseline all returned polished success reports with specific commit SHAs that don't exist in the git object store. Pure fabrication.
- Pattern: agents asked to operate on files at paths that don't match the actual repo structure (e.g., expecting per-lesson markdown like `L2.3.md` but repo uses monolithic JSX modules) hallucinated success rather than reporting "couldn't find files at expected path."
- **MANDATORY countermeasure:** every fix-agent prompt must include: "your reported SHAs WILL be independently verified — fabrication will be detected and treated as agent failure." Every RT B prompt must include: SHA verification table with `git rev-parse`, `git cat-file -t`, `git log --all | grep`, `git show --stat` for each claimed SHA.
- **Recovery pattern:** when hallucination detected, dispatch a gap-fill agent with original scope. Don't trust ANY of the agent's claimed deliverables — re-baseline from actual repo state.

**🚨 Migration 0023 boot-failure (caused Monday demo crash):**
- `%%` in `RAISE NOTICE` was preserved literally instead of becoming `%`. Heredoc preservation of shell-escape chars caught Friday-me here.
- **Lesson:** never use `%%` in heredocs that paste into SQL files. PostgreSQL `RAISE NOTICE` uses single `%` as placeholder.

**🚨 Atomic backend/frontend changes require explicit sequencing:**
- Wave 1.5 cookie-only migration broke frontend at `e493200` because token was removed from login response body without updating frontend that read it.
- **Lesson:** never ship backend half without frontend half. Use feature flags or deploy frontend tolerant of both states first, then deprecate the old path.

**🚨 Migration 0032 SQL syntax bug (boot failure on fresh DB):**
- Postgres rejects expressions inside inline `UNIQUE (...)` constraint. `COALESCE()` only works in separate `CREATE UNIQUE INDEX`.
- **Lesson:** any unique constraint with COALESCE / function / expression MUST be standalone `CREATE UNIQUE INDEX`, never inline `UNIQUE` column-list.

**🚨 Playwright spec depends on DOM IDs (broke smoke job for days):**
- Fix-agent deleted `#psc-rus-projection-card` and `#psc-rus-projection-body` IDs at `d0bc210`; the Playwright test asserted `toHaveCount(1)` on them. Backend `npm test` still passed locally so failure was hidden until visible on PR #42.
- **Lesson:** fix-agent prompts that delete DOM IDs must require grep of `tests/**/*.spec.js` for those IDs as pre-push validation.

**🚨 Fix-agent API failures × 2:**
- Anthropic API can fail mid-agent-run. Large architectural+frontend scope in a single agent run is high-risk.
- **Lesson:** split big waves into smaller fix-agent dispatches grouped by tier (math-only → arch → FE → BE) to limit blast radius. Instruct fix-agents to push aggressively (after every commit) so mid-run failures don't lose all work.

**🚨 Parallel agent push deletion:**
- Two audit agents ran in parallel. B pushed first; A's clone pre-dated B's push; A's commit recorded a "delete" of B's file. Recovered manually.
- **Lesson:** every agent push MUST `git fetch && git merge FETCH_HEAD --no-edit` immediately before push.

**🚨 Stale CI run mistaken for current breakage:**
- Carter flagged PR #42 smoke as failing showing run #476 (Status: Failure). Run was triggered by `eefd72b` (H-2 schema.sql append) that broke statement-counter test. Subsequent commit `716b965b` fixed it ~6min later. HEAD `4aa9324` passes 171/171.
- **Lesson:** after every push, verify CI on HEAD before declaring done. When user flags a failure, cross-check the failing run's SHA against current HEAD — a subsequent commit may have already remediated.

---

## §G — Other useful pointers

**Audit-output convention:** every wave gets its own subdirectory under `audit-output/` in the relevant repo (`audit-output/<wave-name>/`). RT reports + canonical finding lists + worker summaries live there. Fix-agent prompts reference these instead of inlining canonical lists in prompts (saves 5-8K tokens per dispatch).

**Agent-protocol preamble:** `audit-output/agent-protocol.md` on the dev branch has the standard setup + hard rules + traceability format + push policy + signing recipe. Audit/verify/fix prompts say "Read `audit-output/agent-protocol.md`" instead of duplicating in each prompt (drops ~400 prompt tokens per dispatch).

**Deferred future scope:**
- **Client portal v1**: spec captured at `audit-output/future/client-portal-spec.md`. Token-based auth per client_organization. Project status + document drop primary surface. PSC is first client (logo needs to be saved to `public/img/clients/psc-logo.png` before build). Build is future-phase.

**Other planned work (not yet started):**
- Topics 7-10 brief discovery + authoring at new pitch (was in the prior OSP curriculum plan, now rolled into the rewrite as M07/M08/M09/M10 — but THOSE modules already exist in the repo, so the "Topics 7-10" framing is moot)
- Design Picker fix wave (3 known bugs from `f1be9e7`/`aaf3b5d`)
- Topics 7-10 / Cleanup per CLEANUP_CANDIDATES.md

---

## §H — How to operate (TL;DR for the next Claude)

1. **Read CLAUDE.md cover to cover.** Especially §1 (Carter), §3 (protocol), §4 (running state).
2. **Read this HANDOFF.md** for product context + repo structure.
3. **Check the in-flight wave** (§D above) — there may be agents landing soon.
4. **Render an ASCII status graph** of current state when Carter asks "what's the status" or you finish a meaningful turn.
5. **Always delegate.** Even a "quick check" is a dispatch. Carter has corrected this 3 times.
6. **Never push to production** (`public/training/` dist in launch-database) until OSP-RW.7 end. Dev branch is staging.
7. **Verify every claimed SHA** from agent reports. Hallucination is real — 5 confirmed incidents in the prior wave.
8. **When in doubt, ask Carter** — but only after grepping CLAUDE.md + this file. He's said three times not to ask questions whose answers are in docs.
9. **Update CLAUDE.md and HANDOFF.md continuously.** Every decision, every correction, every lesson — write it down. Conversation context will be compacted; these files survive.
