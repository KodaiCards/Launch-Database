# Moodle — Railway Provisioning Runbook

OSP Training LMS for Launch Fiber. Hosted on Railway alongside launch-database.
Custom domain: **training.launchfiber.com**

---

## What's in this directory

| File | Purpose |
|---|---|
| `Dockerfile` | bitnami/moodle:4.5, wires `$PORT`, copies startup hook |
| `railway.json` | Service build + deploy config for Railway |
| `scripts/startup-hook.sh` | First-boot OAuth2 auto-config (runs once after Moodle installer) |
| `scripts/seed-admin.sh` | Post-deploy script to create a secure admin account |

---

## Provisioning steps

### Step 1 — Create the Moodle service on Railway

1. Open your Railway project (same project as launch-database).
2. Click **+ New Service → GitHub Repo**.
3. Select `kodaicards/Launch-Database`, branch `claude/debug-previous-issues-MoN9D`.
4. In the service settings → **Build** tab:
   - Builder: `Dockerfile`
   - Dockerfile path: `moodle/Dockerfile`
5. Name the service **"Moodle"** (or "osp-training").

### Step 2 — Add a dedicated Postgres database

1. In the same Railway project, click **+ New → Database → PostgreSQL**.
2. Name it **"Moodle DB"** — keep it separate from the launch-database Postgres.
3. In the Moodle service → **Variables** tab, add reference variables that pull from the Moodle DB:
   ```
   MOODLE_DATABASE_HOST    = ${{Moodle DB.PGHOST}}
   MOODLE_DATABASE_PORT_NUMBER = ${{Moodle DB.PGPORT}}
   MOODLE_DATABASE_NAME    = ${{Moodle DB.PGDATABASE}}
   MOODLE_DATABASE_USER    = ${{Moodle DB.PGUSER}}
   MOODLE_DATABASE_PASSWORD = ${{Moodle DB.PGPASSWORD}}
   ```
   (Railway reference variable syntax — click **+ Add Reference Variable** in the UI.)

### Step 3 — Add a persistent volume

1. In the Moodle service → **Volumes** tab, click **+ New Volume**.
2. Mount path: `/bitnami/moodledata`
3. Size: **10 GB** minimum (stores course files, H5P packages, user uploads).

> Without this volume, every redeploy wipes all uploaded course content.

### Step 4 — Set required environment variables

In the Moodle service → **Variables** tab, set all of the following.
Items marked **SECRET** should be added as Railway secrets (not plain text):

| Variable | Example value | Notes |
|---|---|---|
| `MOODLE_DATABASE_TYPE` | `pgsql` | |
| `MOODLE_SITE_URL` | `https://training.launchfiber.com` | Must match your domain exactly |
| `MOODLE_USERNAME` | `moodleadmin` | **USER INPUT** — choose your admin username |
| `MOODLE_PASSWORD` | _(strong password)_ | **SECRET — USER INPUT** |
| `MOODLE_EMAIL` | `admin@launchfiber.com` | **USER INPUT** |
| `MOODLE_DATA_PATH` | `/bitnami/moodledata` | Must match the volume mount path |
| `APACHE_HTTP_PORT_NUMBER` | `8080` | Matches Railway's default $PORT |
| `LAUNCH_DB_BASE_URL` | `https://launch.launchfiber.com` | **USER INPUT** — your launch-database public URL |
| `OAUTH2_CLIENT_ID` | `launch-fiber-moodle` | Must match `OAUTH2_CLIENT_ID` in launch-database |
| `OAUTH2_CLIENT_SECRET` | _(strong random string)_ | **SECRET — USER INPUT** — must match `OAUTH2_CLIENT_SECRET` in launch-database |

Generate `OAUTH2_CLIENT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Set the **same value** as `OAUTH2_CLIENT_SECRET` in the launch-database service variables.

### Step 5 — Add the custom domain

1. In the Moodle service → **Settings** tab → **Domains**, click **+ Custom Domain**.
2. Enter `training.launchfiber.com`.
3. Railway shows a CNAME target (e.g. `moodle-production-xxxx.up.railway.app`).

### Step 6 — Add the CNAME at your DNS provider

At your domain registrar (wherever `launchfiber.com` DNS is managed):

1. Create a CNAME record:
   - **Name/Host:** `training`
   - **Value/Target:** the Railway-provided CNAME target from Step 5
   - **TTL:** 300 (5 min) or lowest available
2. Save. Propagation typically takes 1–15 minutes.

### Step 7 — Wait for Railway TLS

Railway provisions a Let's Encrypt certificate automatically once the CNAME resolves.
The Moodle service's **Domains** tab shows a green lock when TLS is ready (usually <5 min after DNS propagates).

### Step 8 — First boot and installer

1. Deploy the Moodle service (or it auto-deploys on push).
2. Watch **Logs** — the bitnami installer runs automatically (~3–5 minutes).
3. Look for `Moodle installation finished` in the logs.
4. Once the startup hook fires, look for `[startup-hook] Done. OAuth2 issuer configured`.
5. Open `https://training.launchfiber.com` — you should see the Moodle login page.
6. Log in with `MOODLE_USERNAME` / `MOODLE_PASSWORD` from Step 4.

### Step 9 — Verify OAuth2 configuration

The startup hook auto-configures the OAuth2 issuer. Verify it landed:

1. Site administration → Plugins → Authentication → Manage authentication.
2. Confirm **OAuth 2** is enabled (eye icon, not crossed out).
3. Site administration → Server → OAuth 2 services → confirm "Launch Fiber" issuer exists.
4. Check endpoints match:
   - Authorization: `https://launch.launchfiber.com/oauth2/authorize`
   - Token: `https://launch.launchfiber.com/oauth2/token`
   - User info: `https://launch.launchfiber.com/oauth2/userinfo`

If the hook did not run (check logs), configure manually:
- Site admin → Plugins → Authentication → OAuth 2 → Add "Custom" issuer
- Fill in Client ID, Client secret, and the three endpoints above.
- Field mappings: `sub→idnumber`, `email→email`, `name→fullname`, `preferred_username→username`.

### Step 10 — Create a secure admin account

Run the seed script to replace the bitnami default (`user`/`bitnami`) with a real admin:

```bash
# From your local machine (requires curl + python3):
MOODLE_BASE_URL=https://training.launchfiber.com \
MOODLE_SERVICE_TOKEN=<your-webservice-token> \
NEW_ADMIN_USERNAME=<your-username> \
NEW_ADMIN_PASSWORD=<strong-password> \
NEW_ADMIN_EMAIL=<your-email> \
bash moodle/scripts/seed-admin.sh
```

After the new user is created:
- Site admin → Users → Site administrators → Add the new username.
- Site admin → Users → Accounts → Browse users → locate `user` → Suspend.

> Alternatively, run directly inside the container via Railway shell:
> `/opt/bitnami/php/bin/php /opt/bitnami/moodle/admin/cli/reset_password.php`

---

## Testing SSO round-trip

1. In launch-database, set `TRAINING_URL=https://training.launchfiber.com` in Railway Variables.
2. Log in to the launcher at your launch-database URL.
3. Click the **OSP Training** tile — should redirect to `training.launchfiber.com`.
4. Moodle should complete the OAuth2 flow and log you in automatically without a second password prompt.
5. If prompted to log in to Moodle separately: check that `auth_oauth2` is the active method and that the `launch-fiber` issuer is configured correctly (Step 9).

---

## Cost estimate (monthly)

| Resource | Est. cost |
|---|---|
| Moodle service (Hobby, ~0.5 vCPU / 512 MB) | ~$5–10 |
| Moodle Postgres (Railway add-on) | ~$5–7 |
| Persistent volume (10 GB) | ~$2.50 |
| **Total** | **~$13–20/month** |

Office-scale internal tool will stay near the low end.

---

## User-action checklist (5 items)

1. **Railway service creation** — create service, point at this Dockerfile, add Moodle DB add-on.
2. **DNS CNAME** — add `training` CNAME at your registrar pointing at the Railway domain.
3. **Admin credentials** — choose `MOODLE_USERNAME` + `MOODLE_PASSWORD` before first deploy.
4. **OAuth2 secrets** — generate `OAUTH2_CLIENT_SECRET`, set it on BOTH the Moodle service AND launch-database service with matching values.
5. **Env var population** — set `LAUNCH_DB_BASE_URL` to your live launch-database URL (needed by startup-hook for endpoint config).
