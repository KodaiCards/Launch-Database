# Fix Report — Railway Stage (wave-osp-moodle)

> Pre-staging everything the user can't autonomously generate without
> seeing the codebase. Output is a self-contained `moodle/` directory
> the user drops secrets into and `railway up`.

---

## What landed

### `moodle/Dockerfile`

Base: `bitnami/moodle:4.5`. Wires `$PORT` → `APACHE_HTTP_PORT_NUMBER` so
Railway's dynamic port injection works. Copies `startup-hook.sh` into
`/docker-entrypoint-initdb.d/` — bitnami runs scripts in that directory on
first boot after the Moodle installer completes. Sets `EXPOSE 8080`.

No custom PHP or Apache config overrides — bitnami's defaults are correct for
Railway single-container deployment. If the office ever needs a PHP extension
tweak, add a `RUN` layer here.

### `moodle/railway.json`

- `builder: DOCKERFILE` pointing at `moodle/Dockerfile`
- `restartPolicyType: ON_FAILURE`, max 5 retries
- `healthcheckPath: /login/index.php` — returns 200 when Moodle is healthy
- `healthcheckTimeout: 300` — gives the installer enough time on first boot

### `moodle/scripts/startup-hook.sh`

First-boot OAuth2 auto-configuration:

1. Polls for `config.php` (Moodle installer writes it when done, up to 10 min).
2. Runs inline PHP via Moodle's CLI SAPI to call `\core\oauth2\api::create_issuer()`.
3. Creates "Launch Fiber" issuer with authorization/token/userinfo endpoints
   derived from `LAUNCH_DB_BASE_URL`.
4. Writes field mappings: `sub→idnumber`, `email→email`, `name→fullname`,
   `preferred_username→username`.
5. Enables `auth_oauth2` plugin if not already active.
6. Writes sentinel file (`/bitnami/moodledata/.oauth2_configured`) so the
   hook is idempotent across container restarts.

If `LAUNCH_DB_BASE_URL`, `OAUTH2_CLIENT_ID`, or `OAUTH2_CLIENT_SECRET` are
absent the script exits cleanly with a message — Moodle still starts, and the
admin configures OAuth2 via the web UI (Step 9 of the README).

### `moodle/scripts/seed-admin.sh`

Post-deploy script to create a non-default admin account via Moodle REST API
(`core_user_create_users`). Replaces the well-known bitnami default
(`user`/`bitnami`). Requires web services + REST protocol enabled first.
Also documents the alternative in-container path:
`/opt/bitnami/php/bin/php /opt/bitnami/moodle/admin/cli/reset_password.php`.

### `moodle/README.md`

10-step provisioning runbook. Covers: service creation, Postgres add-on,
persistent volume, env vars table (with USER INPUT markers), custom domain +
CNAME, TLS wait, first-boot log checkpoints, OAuth2 verification, seed-admin
invocation, SSO round-trip smoke test. Includes cost estimate (~$13–20/month)
and the 5-item user-action checklist.

### `server.js` (Training tile rewire)

Added `const TRAINING_URL = process.env.TRAINING_URL || '/training/';` before
`PORTAL_DEFS`. Training tile `url` field now uses `TRAINING_URL` instead of
the hardcoded string. Default behavior is unchanged (`/training/` → bundled
Vite SPA). Once Moodle is live: set `TRAINING_URL=https://training.launchfiber.com`
on the launch-database Railway service. No code deploy needed — Railway restarts
the service on env-var change and the tile rewires automatically.

Static `/training/*` routes in server.js were NOT changed — they continue to
serve the Vite SPA when `TRAINING_URL` is unset.

### `.env.example` additions

- `TRAINING_URL` — documented with default and example Moodle value.
- `LAUNCH_DB_BASE_URL` — documented as required by startup-hook for OAuth2
  endpoint auto-config. Pre-existing `OAUTH2_CLIENT_ID`, `OAUTH2_CLIENT_SECRET`,
  `OAUTH2_ALLOWED_REDIRECT_URIS` vars were already present and correct.

---

## What requires user action (5 items)

| # | Action | Where | Notes |
|---|---|---|---|
| 1 | **Railway service creation** | Railway dashboard | New service → Dockerfile builder → `moodle/Dockerfile`. Add Postgres add-on to same project. Add 10 GB volume at `/bitnami/moodledata`. |
| 2 | **DNS CNAME** | Domain registrar | Add CNAME: `training` → Railway-provided domain. TLS auto-provisions once DNS resolves. |
| 3 | **Admin credentials** | Railway Variables (Moodle service) | Set `MOODLE_USERNAME`, `MOODLE_PASSWORD`, `MOODLE_EMAIL` before first deploy. Can't be changed post-install without Moodle CLI. |
| 4 | **OAuth2 secrets** | Railway Variables (both services) | Generate `OAUTH2_CLIENT_SECRET` (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Set identical value on BOTH Moodle service AND launch-database service. Set `OAUTH2_CLIENT_ID=launch-fiber-moodle` on both. |
| 5 | **Env var population** | Railway Variables (Moodle service) | Set `LAUNCH_DB_BASE_URL` to your live launch-database public URL. Set `MOODLE_SITE_URL=https://training.launchfiber.com`. Set `APACHE_HTTP_PORT_NUMBER=8080`. |

---

## How to deploy

### Option A — Railway GUI (recommended for first deploy)

Follow the 10-step runbook in `moodle/README.md`.

### Option B — Railway CLI

```bash
# Install Railway CLI if needed: npm install -g @railway/cli
# From repo root:
railway login
railway link   # link to your existing project

# Deploy the Moodle service from the moodle/ subdir:
cd moodle/
railway up --service Moodle
```

`railway up` builds from the Dockerfile and deploys. Env vars must already be
set via the Railway dashboard or `railway variables set KEY=VALUE`.

---

## Post-deploy checklist

After first boot:

- [ ] Check Railway logs for `Moodle installation finished`
- [ ] Check logs for `[startup-hook] Done. OAuth2 issuer configured`
- [ ] `https://training.launchfiber.com` → Moodle login page loads
- [ ] Log in as admin
- [ ] Site admin → OAuth 2 services → "Launch Fiber" issuer present with correct endpoints
- [ ] Run `moodle/scripts/seed-admin.sh` → new admin account created
- [ ] Suspend bitnami default `user` account
- [ ] Set `TRAINING_URL=https://training.launchfiber.com` on launch-database service
- [ ] Click OSP Training tile in launcher → SSO round-trip completes, lands on Moodle dashboard

=== FIX REPORT RAILWAY STAGE END ===
