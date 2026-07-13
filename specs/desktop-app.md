# SPEC — Desktop app v1: the sync agent (PLAN 2.13)

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, *20). Scope decisions Carter made in-session: **v1 ingests FILES ONLY** (no parsing) · **object storage** (S3-compatible) · **mini-jobs is NOT in v1** (own spec next, *22) · **unsigned installer**.
> Raw material + sync-model rulings: `specs/ideas/desktop-offline-mobile.md`. Resurrects the `desktop/` Electron scaffold (login flow + sync skeleton exist).

## What v1 is
Every employee installs the Launch Fiber Desktop agent. They sign in once (existing login flow, user JWT). **The main window IS the full web app** (Carter 2026-07-13: "has all the features" — the window loads launchfiber.app, so every portal and feature is present and always current; no duplicated UI, one shared sign-in). Around it, the agent creates/watches a **Launch workspace folder** and continuously syncs its contents UP to the server with version history. Admin can browse and pull any employee's synced work anytime from a web view.

**Offline expectation (set explicitly):** disconnected, the wrapped web app behaves like a browser tab — v1's offline power is the FILE queue (workspace changes sync when signal returns) plus a friendly offline panel showing queue status. Read-only app cache and offline capture flows arrive in later phases (2.6, map packs); money edits online-only always.

**The pitch to the crew (frame matters, Carter's invasiveness rule):** "your work folder backs up automatically — you'll never lose a file or email one again." It syncs the Launch workspace ONLY; never the rest of the machine, no process/app surveillance, no screenshots.

## Scope fence
- **IN:** main window = wrapped live web app (offline panel when disconnected) · tray agent (Windows-first) · workspace watcher · upload queue (offline-tolerant: queue while disconnected, sync on reconnect) · file version history (server keeps every version, immutable — file conflicts are impossible by design, no merge logic) · **folder→entity linking**: in the agent UI the user links a folder to a client/SA/WO/project (explicit link, data not code — law §7; no magic naming convention) · admin web browse: per-employee + per-entity file listing, download, version list · unsigned NSIS installer built locally (`cd desktop && npm run dist` — CI is dead; Registrar builds at release).
- **OUT (v1):** any file PARSING (Workforce CSV rides 2.6; KMZ rides map delivery) · mini-jobs/workload list/CAD prompt (*22, next spec) · tray timeclock punches (rides 2.6) · offline county map packs (map delivery) · production-signal suggestions (*22 follow-on) · downstream sync (server→agent file distribution) · Mac/Linux.

## Storage (Carter: object storage)
- S3-compatible bucket (Cloudflare R2 class, ~$5–15/mo at 12-person scale), **server-mediated**: agent → authenticated API → bucket. Bucket credentials live ONLY in server env — never in the agent.
- Content-addressed object keys (hash) + a `synced_files` table (id, user_id, entity link nullable, relative_path, version_no, hash, size, mtime, uploaded_at). Re-upload of identical content = row, not new object.
- v1 retention: keep everything (it's the bus-factor backup). Size caps: per-file cap (default 500 MB) + per-user soft quota with admin alert — config values, not code.

## Security invariants (VO lenses)
- Agent authenticates as its USER; can write only its own workspace tree; can never read another user's files through the API.
- Admin read-all is role/capability-gated server-side.
- No bucket creds, no service tokens in the agent binary or its config — user JWT only.
- Version history is append-only via the API (no delete/overwrite endpoint in v1; admin hide-flag at most).
- Money surfaces untouched — this package contains zero money math (hard rule 8 n/a but VO confirms no $ leaks into file metadata views).
- Upload path validates size caps + rejects traversal (`..`) in relative paths.

## Decomposition guidance (Registrar)
Two packages, D1 before D2; both behind #67 (urgent) and alongside wave-2 in the queue — priority order stays Carter's:
- **D1 (server):** migration (`synced_files` + entity-link columns) · storage adapter (S3-compatible, env-configured) · upload/version/list/download APIs with the invariants above · admin browse view (cluster page, app-shell design system, both themes §2.7).
- **D2 (agent):** resurrect `desktop/` — watcher + queue + retry/offline · sign-in reuse · folder→entity link UI · tray status (synced / queued / offline) · installer build doc. D2's user playthrough = install on a real Windows machine, kill the network mid-sync, watch the queue drain on reconnect.
- Env: `STORAGE_*` vars documented in D1; Carter provisions the bucket at D1 merge (Registrar asks — never creates external accounts itself).

## v2 pointers (each its own spec/session when called)
Mini-jobs + workload list + CAD-close prompt (*22) → tray timeclock + draft-day-split (2.6) → Workforce CSV parse-on-drop (2.6) → KMZ intake + county offline packs (map delivery) → production signals/leaderboard feed (2.9) → server→agent distribution.
