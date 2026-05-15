# OSP-RW Discovery — Agent A — Doc→Repo Verification

## Stack snapshot (≤80 words)

Verified CLAUDE.md §4 / §2 claims against actual repo state on launch-database `main` (HEAD `95b6bf6`). Used `git cat-file`, `git log --all`, file inspection, and grep across `routes/`, `server.js`, `migrations/`, `public/training/`, `moodle/`, `audit-output/`. osp-design-training repo is UNREACHABLE from this environment (both local git proxy returns 502 and MCP is access-denied) — those claims marked UNVERIFIABLE with notes for the next pass.

## Verification table

| # | Claim | Checked | Tag | Note |
|---|---|---|---|---|
| 1 | HEAD on `claude/debug-previous-issues-MoN9D` = `ca92036` | `git log -1 origin/claude/debug-previous-issues-MoN9D` | **FALSE** | Actual HEAD = `ac7ac5e` ("T1 Worker A report: odd-lesson pitch revisions complete"). `ca92036` does not exist anywhere. |
| 2 | Current HEAD on `main` | `git log -1 origin/main` | INFO | `95b6bf6c790bca314e20d90ddc82b109944d3652` "Merge pull request #43 from KodaiCards/claude/debug-previous-issues-MoN9D" |
| 3 | Commit `ca92036` (merge of main into dev) exists | `git cat-file -t ca92036` | **FALSE** | `fatal: Not a valid object name`. No such SHA in any branch. The actual merge happened via PR #43 → `95b6bf6`. |
| 4 | `3d66c69` Phase 1 fix-agent exists | `git cat-file -t 3d66c69` | VERIFIED | Real commit: "Phase 1: timeclock projects-picker surgical fix" (`3d66c699d81b9890862a0eb18889a81b617033d4`). |
| 5 | `a2de386` OSP-RW.2 Scaffold BE exists | `git cat-file -t a2de386` | **FALSE** | Does not exist. OSP-RW.2 scaffold has NOT been done. |
| 6 | `add030f` OSP-RW.2 Scaffold FE exists | `git cat-file -t add030f` | **FALSE** | Does not exist. |
| 7 | `1a170de` source of public/training/ dist | `git log -1 1a170de --stat` | VERIFIED | Real commit, May 11 2026, "OSP-Merge Option 3: commit pre-built dist". Touched the 3 files in `public/training/`. |
| 8 | `5e38762` "Wave 1.7: Training back-link" exists | `git cat-file -t 5e38762` | **FALSE** | Does not exist. Last commit touching `public/training/index.html` was `a9df597` ("Add L3.7: Aerial-to-Underground Transitions"). The Wave 1.7 back-link claim is fabricated. |
| 9 | `public/training/` is populated | `ls -la public/training` | VERIFIED | 3 files: `index.html` (1824 B), `assets/index-C1d2X0zu.js`, `assets/index-CxqtYakO.css`. Originally from `1a170de`; `index.html` later overwritten by `a9df597`. |
| 10 | `server.js:433-441` wires `/training` behind `requireAuth()` | Read server.js | PARTIAL | Wiring exists but at lines **438-442**, not 433-441. Lines 433-441 are the surrounding comment block + login route. The `app.use('/training', requireAuth(), ...)` line is 438; SPA fallback at 440-442. |
| 11 | `server.js:249-257` defines Training tile in PORTAL_DEFS audience `'employee'` | Read server.js | VERIFIED | Lines 249-257 exactly match: `id: 'training'`, `audience: 'employee'`, `url: TRAINING_URL`, `name: 'OSP Training'`. |
| 12 | `routes/oauth2.js` exists, 332 lines | `wc -l routes/oauth2.js` | VERIFIED | Exists, **exactly 332 lines**. |
| 13 | `moodle/` directory exists | `ls moodle/` | VERIFIED | Contains `Dockerfile` (2046 B), `README.md` (7724 B), `railway.json` (313 B), `scripts/` (with `seed-admin.sh` 4047 B + `startup-hook.sh` 5284 B). Doc said `railway.json` + `startup-hook.sh` + `seed-admin.sh` + `README.md` — all present, plus `Dockerfile`. |
| 14 | `tests/oauth2.test.js` exists | `ls tests/oauth2.test.js` | VERIFIED | Exists. |
| 15 | `.env.example` lines 24-61 carry OAUTH2_*/Moodle env doc | Read .env.example | PARTIAL | OAuth2/Moodle block actually spans **lines 24-63** (file total = 63 lines). Doc undercounts by 2 lines. Content (OAUTH2_CLIENT_ID/SECRET/ALLOWED_REDIRECT_URIS/JWT_SECRET, TRAINING_URL doc, LAUNCH_DB_BASE_URL) all present. |
| 16 | Training-related migrations exist (`training_progress`, `training_cert_attempts`) | `ls migrations/` | **FALSE** | NO training migrations exist. Latest migration is `0034_fix_parent_id_cascade_to_restrict.sql`. None of 0026-0034 touch training tables. Confirms OSP-RW.2 has not landed. |
| 17 | `/api/training/*` routes exist | `grep -rn "api/training" routes/ server.js` | **FALSE** | Zero hits. No `/api/training/progress`, no `/api/training/cert-attempt`. Confirms OSP-RW.2 not started. |
| 18 | osp-design-training branches (`main`, `claude/debug-previous-issues-MoN9D`, `osp-merge-prep`) | git clone + MCP list_branches | UNVERIFIABLE | Local git proxy returns 502 ("repository not authorized"); MCP returns access-denied ("only kodaicards/launch-database configured"). Cannot verify any osp-design-training claim from this environment. |
| 19 | osp-design-training SHAs `7e92ce0`, `1d6577b`, `3fc206f`, `756c685`, `68bd975` | git cat-file | UNVERIFIABLE | Same access constraint. None exist locally (would be wrong repo regardless). Cannot remotely confirm. |
| 20 | osp-design-training has 12 Module*.jsx files, 7,427 lines total | filesystem inspection | UNVERIFIABLE | Same access constraint. |
| 21 | Any per-lesson JSX/MDX file exists in osp-design-training | filesystem inspection | UNVERIFIABLE | Same access constraint. |
| 22 | `vite.config.js` has `base: '/training/'` | filesystem inspection | UNVERIFIABLE | Same. The published dist's `index.html` at `public/training/index.html` does reference `/training/assets/...` paths, which is consistent with the `base` setting having been used at build time — circumstantial confirmation only. |
| 23 | 4 interactive primitives present (Quiz, AnnotatedDiagram, WorkedExample, BranchingScenario) | grep components | UNVERIFIABLE | Same. |
| 24 | `audit-output/osp-rewrite/` dir with ARCH.md/scaffold reports | `ls audit-output/osp-rewrite/` | **FALSE** | Directory does not exist. Confirms OSP-RW.1 architecture phase never produced an artifact in launch-database. |
| 25 | `audit-output/agent-protocol.md` exists | `ls audit-output/agent-protocol.md` | VERIFIED | Exists, 9959 bytes. |
| 26 | Inventory `audit-output/` | `ls audit-output/` | INFO | 28 subdirs incl. `wave-osp-cable-selection`, `wave-osp-pitch-revision`, `wave-osp-topic2..topic10`, `wave-osp-moodle`, `wave-design-projects-picker`, `wave-timeclock-projects-picker`, `wave-projection`, `wave-1.5`, `wave-2be-ai`, `wave-2fe-crit`, `wave-3be-perf`, `wave-3fe-a11y`, `wave-ci-fix`, `wave-cleanup`, `wave-ui-a-polish`, `wave-misc`, `walkthrough`, `future`. NO `osp-rewrite` dir. |

### Bonus / derived findings

- The "Phase OSP-RW" wave queue in §4 implies OSP-RW.0 Discovery is "IN FLIGHT" with two agents. There are zero artifacts in the repo from prior discovery work. I'm Agent A of what is in fact the FIRST discovery pass.
- `audit-output/wave-osp-pitch-revision/` has 5 worker reports (T1-A, T1-B, T2-A, T3-B, T6-brief-rebaseline) — these belong to the now-RETIRED bolt-on pitch revision wave, not the OSP-RW rewrite.
- PR #43 was merged into main on the most recent push (HEAD `95b6bf6`), folding the entire `claude/debug-previous-issues-MoN9D` history into main. The user's "switch to main as working branch" directive aligns with this state.

## Critical findings (fabrications + show-stoppers, max 5)

1. **SHA `ca92036` (claimed "merge of main into dev" + current HEAD) is fabricated.** It does not exist in any branch. Actual dev-branch HEAD is `ac7ac5e`; the actual merge into main is PR #43 → `95b6bf6`. Anything else CLAUDE.md says about the post-`ca92036` state must be re-baselined.
2. **SHA `a2de386` ("OSP-RW.2 Scaffold BE") and `add030f` ("OSP-RW.2 Scaffold FE") are fabricated.** CLAUDE.md says OSP-RW.2 is "IN FLIGHT" with these commits. Neither exists. **No training scaffold has been built.** This is the next Claude's actual starting point, not a "verify the scaffold" task.
3. **SHA `5e38762` ("Wave 1.7: Training back-link") is fabricated.** No such commit; `public/training/index.html` was last touched by `a9df597` (an L3.7 OSP content commit), not a back-link wave.
4. **No `migrations/` entry for `training_progress` or `training_cert_attempts`. No `/api/training/*` routes exist.** OSP-RW.2 has not started. The whole training Postgres + API surface required by the rewrite is greenfield.
5. **osp-design-training is unreachable from this environment.** Local git proxy returns 502, MCP is access-denied. Every osp-design-training claim (12 modules, 7427 lines, branches, scaffold SHAs `756c685`/`68bd975`, worker SHAs `7e92ce0`/`1d6577b`/`3fc206f`) is UNVERIFIABLE here. Resolving requires either (a) MCP allowlist expansion to `kodaicards/osp-design-training`, or (b) a dispatch with credentials that reach the osp repo, or (c) inspection on a host that has the clone.

## Coverage gaps (≤120 words)

- Could not verify ANY osp-design-training claim (access blocked, see CF #5). Roughly half of §2's locked decisions and §4's OSP-RW worker commit list depend on that repo.
- Did not check `vite.config.js` line content for `base: '/training/'` because the source repo is unreachable. Circumstantial confirmation via dist asset paths only.
- Did not deeply review every line of `routes/oauth2.js` to confirm it still functions — only confirmed file existence + line count. Behavior verification (does OAuth2 endpoint actually do what doc says) was out of scope.
- Did not validate that PORTAL_DEFS' Training tile actually renders for `audience: 'employee'` end-to-end — that would require launching the app or reading the dispatcher logic in `server.js` further down.

=== AGENT A REPORT END ===
