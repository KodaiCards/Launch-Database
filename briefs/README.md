# briefs/ — per-instance task assignments

You are one of several Claude instances working this repo in parallel. **Read `CLAUDE.md` then `ROADMAP.md` first** (product + how we work + the keystone model), then read your own brief (`claude-2.md`, `claude-3.md`, …).

## Workflow (every instance)
1. `git pull` main, `git checkout -b <your-branch>` (your brief names it). **Never commit to `main`.**
2. Work **only inside your brief's scope**.
3. Commit to your branch, push it, then set the **Status** line at the top of your brief to `DONE — ready for review` and tell Carter. Head Claude (CEO) reviews the diff and merges.

## Hard rules
- **CEO owns schema, conventions, the keystone model (`service_areas` / `service_area_jobs` / `time_entries`), and all merges.** Do NOT change migrations, the core model, conventions, or your scope on your own.
- Need such a change? **Stop**, set your Status to `BLOCKED — needs CEO` with a one-line ask, tell Carter. Don't decide unilaterally.
- Don't touch other instances' files. Don't merge your own branch. Don't edit `main`.

## Conventions (match existing code)
- Routes: `module.exports = function(app, pool, mw){ ... }`; gate with `mw.requireAuth([...])` / `requireManagerOrAdmin` / `requireAdmin`; parameterized SQL; `logAudit(pool,{...})` on mutations (see `routes/service_areas.js`, `routes/jobs.js`).
- Frontend: use the global `api(path, method, body)` client; pages use the app-shell token CSS (copy the `:root` block from `public/service-areas.html`) + `<script src="/js/app_nav.js" data-active="...">` for the shared nav.
- Keystone model lives in `migrations/0064_service_area_model.sql` + `routes/service_areas.js`.

## Testing (no fast local boot)
- Get the dev `DATABASE_URL` + a test login from Carter — **never commit secrets**.
- The full app boots slowly locally (legacy bootstrap over the remote DB). **Verify your route in-process**: a tiny express app that mounts only your module against the dev DB and exercises the endpoints (see how `routes/service_areas.js` was tested). Then CEO deploys to verify live.
- **CEO wires your `server.js` route-mount at merge** — you don't need to edit `server.js`; just test your module in-process.
