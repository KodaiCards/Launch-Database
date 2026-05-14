# OSP Training — Setup Walkthrough

**Audience:** You, at your computer, doing this once. Follow in order.
**Time to complete:** ~45 min hands-on + 10–20 min waiting on DNS and first boot.
**Cost when live:** ~$13–20/month on Railway.

Everything the code needs is already in the repo on branch
`claude/debug-previous-issues-MoN9D`. No further code changes are required
before deploying. The steps below are entirely in the Railway dashboard,
your DNS provider, and a browser.

---

## Before you start — three things to decide NOW

These can't be changed after first deploy without using the Moodle CLI inside
the container. Pick them now and write them down somewhere safe:

1. **Moodle admin username** — e.g., `moodleadmin`. This becomes your permanent
   Moodle admin account. Not the bitnami default (`user`) — you'll suspend that
   after deploy.
2. **Moodle admin password** — strong, unique. This is the master key to the
   LMS. Treat it like a root password.
3. **Moodle admin email** — your work email or an internal alias.

---

## Part 1 — Railway Moodle Service Provisioning

### Step 1 — Open your Railway project

**PURPOSE:** The Moodle service lives in the same Railway project as
launch-database, sharing the same network and project context.

**ACTION:**

1. Go to [railway.app](https://railway.app) and open the **launch-database**
   project.
2. You should see your existing `launch-database` service (and its Postgres
   add-on) in the canvas.

**VERIFICATION:** You are looking at the correct Railway project — the
same one where your launch-database service is deployed and running.

---

### Step 2 — Create the Moodle service

**PURPOSE:** Deploy a new service in Railway that builds from the `moodle/Dockerfile`
in this repo. The Dockerfile uses `bitnami/moodle:4.5`, which bundles
Apache + PHP + Moodle in a single container. Railway handles the build.

**ACTION:**

1. In the Railway project canvas, click **+ New Service → GitHub Repo**.
2. Select `kodaicards/launch-database`.
3. Select branch: `claude/debug-previous-issues-MoN9D`.
4. In the service settings, open the **Build** tab:
   - Builder: `Dockerfile`
   - Dockerfile path: `moodle/Dockerfile`
5. Name the service **"Moodle"** (or "osp-training").
6. Do NOT deploy yet — set env vars and the volume first (Steps 3 and 4).

**VERIFICATION:** The service appears in the Railway canvas with a
Dockerfile builder badge. Build has not started yet.

---

### Step 3 — Add a dedicated Postgres database for Moodle

**PURPOSE:** Moodle creates ~400 tables. It needs its own Postgres instance —
do NOT point it at the launch-database Postgres. Shared schema would be an
unmaintainable mess.

**ACTION:**

1. In the same Railway project, click **+ New → Database → PostgreSQL**.
2. Name it **"Moodle DB"**.
3. In the **Moodle** service → **Variables** tab, add Railway reference
   variables (click **+ Add Reference Variable** in the UI for each):

   ```
   MOODLE_DATABASE_HOST         = ${{Moodle DB.PGHOST}}
   MOODLE_DATABASE_PORT_NUMBER  = ${{Moodle DB.PGPORT}}
   MOODLE_DATABASE_NAME         = ${{Moodle DB.PGDATABASE}}
   MOODLE_DATABASE_USER         = ${{Moodle DB.PGUSER}}
   MOODLE_DATABASE_PASSWORD     = ${{Moodle DB.PGPASSWORD}}
   ```

   Railway resolves these at runtime — you never need to copy the raw
   Postgres credentials manually.

**VERIFICATION:** Five reference variables appear in the Moodle service
Variables tab, each resolving to a value from the "Moodle DB" add-on.

---

### Step 4 — Add the persistent volume

**PURPOSE:** Moodle stores all uploaded course files, H5P packages, and user
uploads on disk at `/bitnami/moodledata`. Without a persistent volume, every
Railway redeploy wipes this directory. Ten gigabytes is the right starting
size for an office-scale LMS.

**ACTION:**

1. In the Moodle service → **Volumes** tab, click **+ New Volume**.
2. Mount path: `/bitnami/moodledata`
3. Size: **10 GB**

**VERIFICATION:** The volume appears in the Volumes tab with mount path
`/bitnami/moodledata` and size 10 GB.

---

### Step 5 — Set all required environment variables

**PURPOSE:** The bitnami Moodle image reads these env vars during first boot to
configure itself. Items marked **YOU PROVIDE** require your specific values.
Items marked **GENERATE** require running a command to produce a secret.

In the Moodle service → **Variables** tab, set all of the following:

| Variable | Example / Value | Who provides | Why |
|---|---|---|---|
| `MOODLE_DATABASE_TYPE` | `pgsql` | Paste as-is | Tells Moodle to use Postgres |
| `MOODLE_SITE_URL` | `https://training.launchfiber.com` | **YOU PROVIDE** | Must match your domain exactly — set this to the custom domain you'll add in Step 5 |
| `MOODLE_USERNAME` | `moodleadmin` | **YOU PROVIDE** | The admin username you chose above |
| `MOODLE_PASSWORD` | _(strong password)_ | **YOU PROVIDE** | The admin password you chose above — add as a Railway secret |
| `MOODLE_EMAIL` | `admin@launchfiber.com` | **YOU PROVIDE** | Admin contact email |
| `MOODLE_DATA_PATH` | `/bitnami/moodledata` | Paste as-is | Must match the volume mount path |
| `APACHE_HTTP_PORT_NUMBER` | `8080` | Paste as-is | Railway's default $PORT; Dockerfile wires this |
| `LAUNCH_DB_BASE_URL` | `https://launch.launchfiber.com` | **YOU PROVIDE** | Your live launch-database public URL — the startup hook uses this to configure OAuth2 endpoints in Moodle automatically |
| `OAUTH2_CLIENT_ID` | `launch-fiber-moodle` | Paste as-is | Stable identifier shared between both services |
| `OAUTH2_CLIENT_SECRET` | _(generated)_ | **GENERATE + SET ON BOTH SERVICES** | Shared secret — see below |

**Generating `OAUTH2_CLIENT_SECRET`:**

Run this locally in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (a 64-character hex string). Set it as `OAUTH2_CLIENT_SECRET`
in the **Moodle** service variables. Then also set the **same value** as
`OAUTH2_CLIENT_SECRET` in the **launch-database** service variables.

Also set on the **launch-database** service (if not already set):

```
OAUTH2_CLIENT_ID              = launch-fiber-moodle
OAUTH2_ALLOWED_REDIRECT_URIS  = https://training.launchfiber.com/admin/oauth2callback.php
```

**VERIFICATION:** Variables tab on the Moodle service shows all 10 vars
populated. `OAUTH2_CLIENT_SECRET` is set on both Moodle and launch-database
with identical values.

---

### Step 6 — Deploy the Moodle service

**PURPOSE:** Trigger the first build and install. First boot runs the
bitnami Moodle installer (~3–5 min), then the startup hook that
auto-configures OAuth2 (~1 additional min). Do not do this until the
volume and all env vars are set.

**ACTION:**

1. In the Moodle service settings, click **Deploy** (or it may start automatically
   when you finish adding the Dockerfile path).
2. Watch the **Logs** tab.

**VERIFICATION (this step takes 3–8 minutes):**

Watch for these two log lines in order:

```
Moodle installation finished
```
```
[startup-hook] Done. OAuth2 issuer configured
```

The service is healthy when Railway shows a green checkmark in the Domains tab
and the health check at `/login/index.php` returns 200.

> If the startup hook log line says `[startup-hook] LAUNCH_DB_BASE_URL not set — skipping OAuth2 auto-config`,
> it means the env var was missing. Set it and redeploy — the hook is
> idempotent and won't double-configure.

---

## Part 2 — DNS

### Step 7 — Add the custom domain in Railway and get the CNAME target

**PURPOSE:** Railway auto-provisions a TLS certificate once a custom domain is
added and the CNAME resolves. You need the Railway-generated CNAME target
before you can set DNS.

**ACTION:**

1. In the Moodle service → **Settings** tab → **Domains**, click **+ Custom Domain**.
2. Enter `training.launchfiber.com`.
3. Railway shows a CNAME target like:
   `moodle-production-xxxx.up.railway.app`
4. Copy that CNAME target to your clipboard.

**VERIFICATION:** The custom domain appears in the Domains section with a
"Pending DNS" status. You have the Railway CNAME target copied.

---

### Step 8 — Add the CNAME record at your DNS provider

**PURPOSE:** Point `training.launchfiber.com` at the Railway-managed service.
Railway handles TLS automatically once this resolves.

**Cloudflare** (most common for this type of setup):

1. Log in → select your domain (`launchfiber.com`) → **DNS** tab.
2. Click **Add record**.
3. Type: `CNAME`
4. Name: `training`
5. Target: _(paste the Railway CNAME target from Step 7)_
6. Proxy status: **DNS only** (grey cloud, NOT orange). Railway needs the
   real origin IP visible to issue its TLS cert. Turn proxy on later if you want
   Cloudflare CDN, but start DNS-only.
7. TTL: Auto (or 300 seconds). Click **Save**.

**AWS Route 53:**

1. Open the hosted zone for `launchfiber.com`.
2. Click **Create record**.
3. Record name: `training`
4. Record type: `CNAME`
5. Value: _(paste the Railway CNAME target)_
6. TTL: 300. Click **Create records**.

**Namecheap:**

1. Log in → **Domain List** → **Manage** next to `launchfiber.com`.
2. **Advanced DNS** tab → **Add New Record**.
3. Type: `CNAME Record`
4. Host: `training`
5. Value: _(paste the Railway CNAME target)_
6. TTL: Automatic. Click the green checkmark to save.

**VERIFICATION (allow 1–15 minutes for propagation):**

```bash
dig training.launchfiber.com CNAME
```

You should see the Railway domain in the `ANSWER SECTION`. Once it resolves,
Railway's Domains tab will switch from "Pending DNS" to showing a green lock.

---

### Step 9 — Confirm TLS certificate

**PURPOSE:** Railway provisions a Let's Encrypt certificate automatically once
DNS resolves. No action required — just confirm it worked.

**ACTION:** Wait for the green lock icon in Railway's Domains tab for
`training.launchfiber.com`. This typically takes under 5 minutes after DNS
propagates.

**VERIFICATION:**

Navigate to `https://training.launchfiber.com` in a browser. You should see
the Moodle login page with a valid TLS cert (no browser warning). If you see
a cert error, wait another 2 minutes and hard-refresh.

---

## Part 3 — Moodle First-Boot and Admin Setup

### Step 10 — Log in as Moodle admin

**PURPOSE:** Confirm the installer ran successfully and you can reach the admin
account you configured.

**ACTION:**

1. Navigate to `https://training.launchfiber.com`.
2. Click **Log in**.
3. Username: the `MOODLE_USERNAME` value you set in Step 5.
4. Password: the `MOODLE_PASSWORD` value you set in Step 5.

**VERIFICATION:** You land on the Moodle dashboard (Site home) logged in as
a site administrator. The admin panel is accessible at
`https://training.launchfiber.com/admin`.

---

### Step 11 — Verify OAuth2 auto-configuration

**PURPOSE:** The startup hook should have run automatically and created the
"Launch Fiber SSO" OAuth2 issuer. Confirm it's there with the right endpoints.

**ACTION:**

1. Site administration → Plugins → Authentication → **Manage authentication**.
2. Confirm **OAuth 2** is enabled (eye icon, not crossed out).
3. Site administration → Server → **OAuth 2 services**.
4. Confirm a "Launch Fiber" issuer exists with these endpoints:

| Field | Expected value |
|---|---|
| Authorization endpoint | `https://launch.launchfiber.com/oauth2/authorize` |
| Token endpoint | `https://launch.launchfiber.com/oauth2/token` |
| Userinfo endpoint | `https://launch.launchfiber.com/oauth2/userinfo` |

**If the issuer is missing** (startup hook didn't run), configure it manually:

1. Site administration → Plugins → Authentication → **OAuth 2 → Add new issuer** → **Custom**.
2. Fill in:
   - **Name:** `Launch Fiber SSO`
   - **Client ID:** _(your `OAUTH2_CLIENT_ID` value)_
   - **Client secret:** _(your `OAUTH2_CLIENT_SECRET` value)_
   - **Authorization endpoint:** `https://launch.launchfiber.com/oauth2/authorize`
   - **Token endpoint:** `https://launch.launchfiber.com/oauth2/token`
   - **User info endpoint:** `https://launch.launchfiber.com/oauth2/userinfo`
3. Field mappings:
   - Username ← `preferred_username`
   - Email ← `email`
   - Full name ← `name`
   - ID number ← `sub`
4. Save.

**VERIFICATION:** "Launch Fiber" issuer appears in the OAuth2 services list
with all three endpoints pointing at your launch-database domain.

---

### Step 12 — Secure the admin account

**PURPOSE:** The bitnami image ships with a default `user`/`bitnami` account.
Suspend it. Your admin account from Step 5 is already your real admin; this
step just locks out the well-known bitnami default.

**Option A — via Moodle web UI (simplest):**

1. Site administration → Users → Accounts → **Browse users**.
2. Find the user named `user` (the bitnami default).
3. Click **Edit** → check **Suspended account** → Save.

**Option B — via Railway shell + Moodle CLI (if you want a second admin account first):**

```bash
# In Railway: open a shell on the Moodle service, then:
/opt/bitnami/php/bin/php /opt/bitnami/moodle/admin/cli/reset_password.php
# Follow the prompts to reset any account password.
```

**VERIFICATION:** Attempting to log in as `user` / `bitnami` returns
"Invalid login, please try again." Your named admin account still works.

---

## Part 4 — OAuth2 Secret Confirmation

### Step 13 — Confirm both services share the same secret

**PURPOSE:** The SSO bridge requires `OAUTH2_CLIENT_ID` and `OAUTH2_CLIENT_SECRET`
to be identical on both the **Moodle** service and the **launch-database** service.
A mismatch will cause the token exchange to fail silently.

**ACTION:**

1. In Railway → **launch-database** service → Variables.
2. Confirm `OAUTH2_CLIENT_ID`, `OAUTH2_CLIENT_SECRET`, and
   `OAUTH2_ALLOWED_REDIRECT_URIS` are all set.
   - `OAUTH2_CLIENT_ID` = `launch-fiber-moodle`
   - `OAUTH2_CLIENT_SECRET` = _(the same 64-char hex you set on Moodle)_
   - `OAUTH2_ALLOWED_REDIRECT_URIS` = `https://training.launchfiber.com/admin/oauth2callback.php`

Optionally, set a separate `OAUTH2_JWT_SECRET` on launch-database for added
isolation (isolates Moodle SSO tokens from regular session tokens):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**VERIFICATION:** Both Railway services show `OAUTH2_CLIENT_ID` and
`OAUTH2_CLIENT_SECRET` with matching values.

---

## Part 5 — Training Tile Flip

### Step 14 — Rewire the launcher tile to Moodle

**PURPOSE:** Right now the "OSP Training" tile in the launcher points at
`/training/` (the bundled Vite SPA). Setting the env var `TRAINING_URL`
rewires it to the live Moodle instance without any code deploy.

**ACTION:**

1. In Railway → **launch-database** service → Variables.
2. Add (or update):
   ```
   TRAINING_URL = https://training.launchfiber.com
   ```
3. Railway auto-restarts the launch-database service on env-var change.
   Wait ~30 seconds for the restart.

**VERIFICATION:**

1. Open the launcher (`https://launch.launchfiber.com` or your launch-database URL).
2. You should see the "OSP Training" tile.
3. Click it. It should navigate to `https://training.launchfiber.com`.

---

### Step 15 — End-to-end SSO smoke test

**PURPOSE:** Verify the full OAuth2 round-trip works — from clicking the tile as
a logged-in user through to landing on the Moodle dashboard.

**ACTION (logged-in user path):**

1. Log in to launch-database as a normal user (not admin).
2. Click the **OSP Training** tile.
3. Expected flow:
   - Browser navigates to `https://training.launchfiber.com`.
   - Moodle's `auth_oauth2` detects no Moodle session → redirects to
     `https://launch.launchfiber.com/oauth2/authorize?...`
   - Since you're already logged in to launch-database, the authorize endpoint
     generates a code and immediately redirects back to Moodle.
   - Moodle exchanges the code for a token, fetches your profile, creates a
     Moodle account for you (on first visit), and logs you in.
   - You land on the Moodle dashboard.

**ACTION (logged-out path):**

1. Log out of launch-database entirely.
2. Click the OSP Training tile URL directly (or navigate to
   `https://training.launchfiber.com`).
3. Expected flow:
   - Moodle → redirects to `/oauth2/authorize` → redirects to `/login?next=...`
   - You see the launch-database login page.
   - Log in. You are redirected back through OAuth2 and land on Moodle
     automatically.

**VERIFICATION:** Both paths complete without a second password prompt on
Moodle. The Moodle account created for the user has the correct email and
full name from their launch-database profile. Check Moodle:
Site administration → Users → Accounts → Browse users — new user is there.

---

## Part 6 — Content Import (Phase 2 — Manual for Now)

### Step 16 — What content exists and where it lives

**PURPOSE:** Understand what's ready to import versus what's deferred.

Twelve Markdown lesson files for the **Cable Selection** topic (OSP-DRD domain 5)
exist at `content/osp-cable-selection/` in this repo. A 25-question final exam
is also authored. Four-plus lessons of **Topic 2 (Splice and Termination)**
are in progress in `audit-output/wave-osp-topic2/`.

A scripted import pipeline (Markdown → Moodle REST API + H5P packages) is on
the roadmap but not yet built. That's Phase 2.

**For now (v0 manual import):**

1. In Moodle: create a new course (Site administration → Courses →
   **Add a new course**). Name: "Cable Selection — OSP Field Training".
2. Add sections for each of the 12 lesson groups.
3. For each lesson `.md` file: copy the Markdown content, paste as HTML
   into Moodle's text editor (it accepts cleaned HTML — use a Markdown-to-HTML
   converter like [markdowntohtml.com](https://markdowntohtml.com) for each file).
4. For interactive elements (flashcards, drag-drops): install H5P
   (Site administration → H5P → Install recommended content types), then
   author each activity through the H5P editor in Moodle.

**VERIFICATION:** At least one lesson is visible to a non-admin test user
in the course. The lesson content renders correctly.

> Scripted bulk-import will be built in Phase 2. It will eliminate all
> the manual clicking above. For now, start with one or two lessons to
> confirm the setup is solid.

---

## Part 7 — Open Product Decisions

The following questions need your call before the associated work can proceed.
Each is a decision, not a bug — there's no wrong answer, just a preference
to capture.

---

**Q2 — Timeclock auto-create: who can auto-create projects?**

Context: The new cascading timeclock picker (Client → Job → WO#) will
auto-create a new leaf project when the combination doesn't already exist.
Today, engineers can only *request* a new project (admin approval required).
The auto-create path bypasses that queue.

Options:
- **A (recommended):** Any logged-in user can auto-create via the timeclock
  picker, no approval. Rationale: the timeclock is a daily friction point;
  requiring approval defeats the purpose of the quick picker.
- **B:** Auto-create goes through the existing approval queue. User sees
  "pending" status and can't clock in until admin approves.
- **C:** Auto-create is allowed only for `manager` and `admin` roles.

Confirm or override. The build proceeds with Option A unless you say otherwise.

---

**Q3 — Timeclock auto-create on completed-project match**

Context: If the only matching project for `(client, job, WO#)` is already
`status='completed'`, the system will auto-create a new project rather than
clock into the completed one.

Decision made autonomously: **auto-create new**. If that's wrong for your
workflow (e.g., you sometimes reopen completed projects) — say so and the
logic can be changed to reopen or error instead.

---

**Q5 — Timeclock picker sticky dropdown**

Context: Should the Client / Job / WO# dropdowns remember the last-used
combination across sessions via localStorage?

Decision made autonomously: **sticky last-used** via localStorage.
Quick-clock buttons already handle "resume yesterday's project" — so sticky
dropdowns add a small convenience for day-two+ use without friction.

Override if you'd prefer the picker always start blank.

---

**OSP Topic 2 vendor specifics**

Context: Splice and Termination content (Topic 2) is being authored with
references to field equipment. The current draft is vendor-agnostic (generic
OTDR, generic fusion splicer).

Does your office standardize on specific equipment brands?
(e.g., Fujikura / Sumitomo splicers, EXFO / Viavi / Fluke OTDRs)

If yes, the lesson examples and verification steps can reference the specific
model menus your team actually uses — more practical, less abstract.
If vendor-agnostic is fine, the content ships as-is.

---

## Part 8 — Status Summary

| Area | Status | Notes |
|---|---|---|
| **Moodle service** | READY — deploy via Steps 1–6 | Dockerfile + railway.json + startup hook all in repo |
| **SSO bridge (OAuth2)** | READY — code is live in launch-database | `routes/oauth2.js` — 3 endpoints + 16 tests |
| **Training tile rewire** | READY — one env var (Step 14) | `TRAINING_URL` on launch-database service |
| **Cable Selection content (Topic 1)** | READY TO IMPORT — Markdown in repo | 12 lessons + final exam at `content/osp-cable-selection/` |
| **Topic 2 — Splice & Termination** | IN PROGRESS | 4+ lessons being authored; vendor specifics decision pending |
| **Scripted content import** | FUTURE WAVE | Phase 2; eliminates manual Moodle UI clicking |
| **Timeclock picker rebuild** | FUTURE WAVE | Spec complete at `audit-output/future/timeclock-picker-spec.md`; Q2/Q3/Q5 decisions needed |
| **Client Portal v1** | DEFERRED | Spec at `audit-output/future/client-portal-spec.md`; PSC is first client; logo needed before build |

---

## Troubleshooting quick-reference

| Symptom | Likely cause | Fix |
|---|---|---|
| Moodle service stays in "deploying" for >10 min | Installer hung | Check logs for PHP error; redeploy |
| `https://training.launchfiber.com` returns Railway 404 | DNS not yet propagated | `dig training.launchfiber.com` — wait for CNAME to resolve |
| TLS cert warning in browser | Railway cert not yet issued | Wait 5 min after DNS resolves; Railway auto-provisions |
| Training tile goes to Moodle but prompts for password | `auth_oauth2` not enabled or issuer misconfigured | Step 11 — verify OAuth2 issuer endpoints |
| Moodle login works but shows wrong user name | Field mapping wrong | Site admin → OAuth2 → check `preferred_username → username` mapping |
| `OAUTH2_CLIENT_SECRET` mismatch | Secrets set to different values | Copy from one service, paste into the other |
| Startup hook skipped OAuth2 config | `LAUNCH_DB_BASE_URL` missing | Set it and redeploy (hook is idempotent) |
| After login to launch-database, tile redirects to `/login` again | `OAUTH2_ALLOWED_REDIRECT_URIS` missing or wrong | Set on launch-database: `https://training.launchfiber.com/admin/oauth2callback.php` |

---

=== OSP TRAINING SETUP WALKTHROUGH END ===
