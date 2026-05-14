# OSP Moodle MVP — Discovery

> Scope: read-only scoping for Moodle 4.x on Railway + SSO bridge from launch-database + Cable Selection topic outline + content authoring tooling.
> Locked-in decisions from 2026-05-14: Platform = Moodle 4.x, Hosting = Railway, Integration = OAuth2 SSO, MVP topic = Cable Selection (BICSI OSP-DRD).

---

## Area A — Moodle on Railway

### Docker image

Use **bitnami/moodle** (Docker Hub: `bitnami/moodle:4`). It is the only production-grade Moodle image with active maintenance on Docker Hub, bundles Apache + PHP + Moodle in one container, and exposes straightforward env-var configuration. The official Moodle project does not publish its own Docker image; bitnami is the de-facto standard.

Railway-compatibility notes:
- Railway supports any Docker image via the "Deploy from Docker Image" service type. No Dockerfile or nixpacks needed.
- `bitnami/moodle` binds to port 8080 by default (non-root). Set Railway `PORT` to 8080 or override with `APACHE_HTTP_PORT_NUMBER=8080`.
- **Persistent volume required:** Moodle writes user uploads, H5P packages, and course files to `MOODLE_DATA_PATH` (default `/bitnami/moodledata`). Mount a Railway persistent volume at that path. Without it, all uploaded content is lost on redeploy.
- Railway persistent volumes are available on all paid plans. Recommended initial size: 10 GB.

### Database

- **Separate Postgres service** on Railway (do not share with launch-database). Moodle's installer creates ~400 tables under its own schema; mixing them with launch-database's schema would be an unmaintainable mess.
- bitnami/moodle supports Postgres via `MOODLE_DATABASE_TYPE=pgsql`.
- Railway Postgres add-on is straightforward; use the internal Railway network hostname (not the public URL) for `MOODLE_DATABASE_HOST`.
- Alternatively: MySQL (`MOODLE_DATABASE_TYPE=mysqli`). Either works; Postgres matches the rest of the stack.

### DNS

Recommendation: **`training.launchfiber.com`** — matches the spec, descriptive, not ambiguous if more subdomains are added later. `learn.` is an acceptable alternative but `training.` is more literal and easier to type in office context.

- Set a CNAME from `training.launchfiber.com` to the Railway-provided domain for the Moodle service.
- Railway auto-provisions TLS via Let's Encrypt for custom domains. Set `MOODLE_SITE_URL=https://training.launchfiber.com`.

### Railway cost estimate (monthly)

| Resource | Est. cost |
|---|---|
| Moodle service (Hobby plan, ~0.5 vCPU / 512 MB RAM baseline) | ~$5–10 |
| Moodle Postgres (Railway add-on) | ~$5–7 |
| Persistent volume (10 GB) | ~$2.50 |
| Bandwidth (office-scale internal tool, low traffic) | minimal |
| **Total** | **~$13–20/month** |

All costs are approximate; Railway pricing is usage-based. Office-scale internal tool will stay near the low end.

### Required env vars

| Env var | Value |
|---|---|
| `MOODLE_DATABASE_TYPE` | `pgsql` |
| `MOODLE_DATABASE_HOST` | Railway internal Postgres hostname |
| `MOODLE_DATABASE_PORT_NUMBER` | `5432` |
| `MOODLE_DATABASE_NAME` | `moodle` |
| `MOODLE_DATABASE_USER` | Postgres user |
| `MOODLE_DATABASE_PASSWORD` | Postgres password (secret) |
| `MOODLE_SITE_URL` | `https://training.launchfiber.com` |
| `MOODLE_USERNAME` | Initial Moodle admin username |
| `MOODLE_PASSWORD` | Initial Moodle admin password (secret) |
| `MOODLE_EMAIL` | Admin email |
| `MOODLE_DATA_PATH` | `/bitnami/moodledata` |
| `APACHE_HTTP_PORT_NUMBER` | `8080` |
| `OAUTH2_CLIENT_ID` | (set after SSO bridge is built — see Area B) |
| `OAUTH2_CLIENT_SECRET` | (secret — set after SSO bridge is built) |

### Railway provisioning checklist

1. In the Railway project, create a new service: "Deploy from Docker Image" → `bitnami/moodle:4`.
2. Add a Railway Postgres add-on to the same project. Copy the internal connection string.
3. Set all env vars from the table above in the Moodle service's Variables tab.
4. Add a persistent volume at `/bitnami/moodledata` (10 GB).
5. Set the Railway service port to 8080.
6. Add a custom domain: `training.launchfiber.com`. Point the DNS CNAME at Railway's generated domain. Wait for TLS provisioning.
7. On first boot, bitnami runs the Moodle installer automatically. Check logs for "Moodle installation finished." (~3–5 min).
8. Log in at `https://training.launchfiber.com` as the admin user.
9. Enable the `auth_oauth2` plugin: Site administration → Plugins → Authentication → Manage authentication → OAuth 2 → Enable.
10. Configure the OAuth2 issuer (see Area B for endpoint details).
11. Install H5P content type library: Site administration → H5P → Install recommended content types.
12. Test with one H5P drag-drop activity before authoring content.

---

## Area B — SSO Bridge in launch-database

### Auth model recap

`auth.js` issues JWT cookies (`lfs_session`, httpOnly, sameSite=lax). `authMiddleware()` reads the cookie (falling back to Bearer header), validates JWT signature + audience (`JWT_AUDIENCE`/`JWT_ISSUER` env vars), then cross-checks `tokens_invalid_after` against `payload.iat`. All sessions are anchored to the existing `users` table.

### What Moodle's auth_oauth2 needs

Moodle's built-in `auth_oauth2` plugin implements the **Authorization Code flow** (RFC 6749). It needs three endpoints on the identity provider:

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /oauth2/authorize` | GET | Start flow — redirect unauthenticated users to login, issue authorization code to authenticated users |
| `POST /oauth2/token` | POST | Exchange authorization code for access token |
| `GET /oauth2/userinfo` | GET | Return user profile from access token |

### Sketch of each endpoint

**GET /oauth2/authorize**
- If user has no valid `lfs_session` cookie: redirect to `/login?next=<return_url>` (same pattern as existing portals).
- If user is authenticated: generate a short-lived (~2 min), one-time authorization code tied to `user.id`. Store in an in-memory map or a `oauth2_codes` table (`code`, `user_id`, `expires_at`, `redirect_uri`, `client_id`). Redirect to `redirect_uri?code=<code>&state=<passthrough_state>`.
- Validate `client_id` matches `OAUTH2_CLIENT_ID` env var. Reject unknown clients.

**POST /oauth2/token**
- Accepts `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `client_secret`.
- Look up code in store. Validate: not expired, `redirect_uri` matches, `client_secret` matches `OAUTH2_CLIENT_SECRET` env var.
- Consume code (delete from store — single use).
- Issue an access token (can reuse `signToken(user)` or a dedicated short-lived JWT with `audience: 'moodle-sso'`).
- Return `{ access_token, token_type: "Bearer", expires_in: 3600 }`.

**GET /oauth2/userinfo**
- Read Bearer token from Authorization header.
- Verify with `verifyToken()`. Cross-check `tokens_invalid_after` same as `authMiddleware`.
- Return OpenID Connect-compatible profile: `{ sub: user.id, email: user.email, name: user.full_name, preferred_username: user.username, lfs_role: user.role }`.
- Moodle maps `sub` → external user id, `email` → account lookup/creation.

### Reuse existing auth

- `verifyToken()` and `signToken()` can be imported from `auth.js` directly — no new JWT library needed.
- `authMiddleware` already runs on all routes; the `/oauth2/authorize` endpoint just reads `req.user` if set.
- Rate-limiting: the existing `rateLimitOk()` helper in `auth.js` can be applied to `/oauth2/token` (prevent code-enumeration).

### Secrets storage

Store `OAUTH2_CLIENT_ID` and `OAUTH2_CLIENT_SECRET` as Railway env vars on the launch-database service — same pattern as `JWT_SECRET`. Never hard-code. Moodle's `auth_oauth2` issuer config screen is where you paste these values.

### SSO sequence diagram

```
User clicks Training tile in launcher
  │
  ▼
launcher.html → window.location.href = '/training/'   [tile URL]
  │
  ▼ (server.js serves /training redirect)
server.js rewires tile URL to: https://training.launchfiber.com
  │
  ▼
Moodle → auth_oauth2 redirect → GET /oauth2/authorize?client_id=...&redirect_uri=...&state=...
  │
  ├─ [not authed] → 302 /login?next=/oauth2/authorize?...
  │       └→ user logs in → 302 back to /oauth2/authorize?...
  │
  └─ [authed] → generate code, 302 to moodle/redirect_uri?code=...&state=...
        │
        ▼
Moodle → POST /oauth2/token { code, client_id, client_secret }
        │
        ▼
launch-database returns { access_token }
        │
        ▼
Moodle → GET /oauth2/userinfo (Bearer access_token)
        │
        ▼
launch-database returns { sub, email, name, preferred_username }
        │
        ▼
Moodle creates/matches local user account, logs user in
        │
        ▼
User lands on Moodle dashboard at training.launchfiber.com
```

### Training tile rewire (launcher side)

When the Moodle instance is live, change the `training` portal definition in `server.js` from:
```js
url: '/training/',
```
to:
```js
url: 'https://training.launchfiber.com',
```
The launcher's `renderTile()` already supports external URLs — `window.location.href = p.url` handles cross-origin navigation. No other launcher changes needed.

---

## Area C — Cable Selection Topic Outline

Aligned to BICSI OSP-DRD domain 5 (Optical & Copper Cable Selection). Sources: ANSI/TIA-758-C, BICSI OSP-DRD Manual Ch. 5, Corning/CommScope/AFL publicly available training materials. Estimated 5 hrs total (~12 lessons × 25 min avg).

| # | Lesson Title | Est. Duration | Best Interactive Types |
|---|---|---|---|
| 1.1 | Single-Mode vs. Multi-Mode Fiber: Fundamentals | 20 min | Flashcards (fiber modes), multiple-choice quiz |
| 1.2 | SMF Grades: OS1 vs. OS2 and ITU-T G.652/G.657 Classifications | 20 min | Flashcards, multiple-choice |
| 1.3 | MMF Grades: OM1 through OM5 and Application Matrix | 20 min | Drag-drop (match grade → application), flashcards |
| 2.1 | Loose-Tube Cable Construction and Buffer Tube Allocation | 25 min | Drag-drop (label cross-section diagram), flashcards |
| 2.2 | Tight-Buffer and Breakout Cable Construction | 20 min | Flashcards, multiple-choice |
| 2.3 | Ribbon Cable and Mass-Fusion Splicing Compatibility | 20 min | Multiple-choice, scenario |
| 2.4 | Armored, Aerial, and Rodent-Resistant Variants | 20 min | Drag-drop (match sheath type → deployment), flashcards |
| 3.1 | Sheath Options: PE, OSP-rated, FR/OFNR/OFNP, and Armored | 25 min | Drag-drop (environment → sheath code), flashcards |
| 3.2 | Drop vs. Distribution vs. Feeder Hierarchy | 20 min | Scenario (size a feeder run), drag-drop (assign cable tier) |
| 4.1 | Cable Selection by Environment: Aerial, Direct-Bury, Conduit, Microduct | 30 min | Scenario (field case study — select cable for site conditions), multiple-choice |
| 4.2 | Connector and Field-Termination Options (SC, LC, MPO) | 20 min | Flashcards, drag-drop (match connector → use case) |
| 5.1 | Compliance Checklist: NESC Bonding, NEC Fire Ratings, and ANSI/TIA-758-C Labeling | 25 min | Scenario (compliance audit walkthrough), multiple-choice |

**Topic Final Exam:** 25 questions, cumulative across all 12 lessons, randomized from question bank, 70% pass threshold. Questions cite source standards.

Note on interactives per lesson: every lesson should include at minimum one flashcard set and one multiple-choice quiz. Drag-drop and scenario interactives are mapped where they provide the highest learning value (not forced into every lesson).

---

## Area D — Content Authoring Tooling

### Recommendation: Markdown-first in repo → Moodle import

**Author content as Markdown files in a `/content/` directory in this repo (or the osp-design-training repo), then import to Moodle via H5P packages or Moodle's backup/restore format.**

Rationale:

1. **Version control.** Markdown in git gives diff history, PR-based review (user / SME can review content as a PR), and rollback on errors. Moodle's built-in editor has no version history.
2. **AI-assisted drafting.** It is far easier to AI-draft and iterate on Markdown than to work inside Moodle's WYSIWYG editor. The user said content will be AI-drafted from public standards — that pipeline works cleanly in Markdown.
3. **Provenance tracking.** Source citations (`> ANSI/TIA-758-C §6.2.4`) are easy to maintain in Markdown and survive the import.
4. **H5P package authoring.** H5P interactives (flashcards, drag-drops, multiple-choice) can be authored as JSON inside `.h5p` zip packages and imported into Moodle. H5P's own CLI (`h5p`) supports programmatic content creation — better than hand-clicking in the Moodle web UI for 80 lessons worth of content.
5. **Moodle lesson/page content** can be created via Moodle's REST API (`core_course_*` web services) by POSTing the Markdown-converted HTML. Avoids clicking through the UI for every lesson.

**What to NOT do:** author directly in Moodle's web editor. It produces non-portable HTML blobs with no source control, no citation tracking, and no diff history. Editing 80 lessons of content in a browser editor would be painful and error-prone.

**Authoring pipeline (recommended):**

```
Markdown in repo (content/cable-selection/lesson-1.1.md)
  │
  ├─ Lesson text → convert to HTML → POST to Moodle via REST API
  ├─ Quiz questions → JSON → H5P Question Set package → import to Moodle
  ├─ Flashcards → JSON → H5P Dialog Cards package → import to Moodle
  └─ Drag-drops → H5P Drag the Words / Image Sequencing → import to Moodle
```

This pipeline can be scripted (a small Node.js or Python toolchain) so new lessons go from Markdown → Moodle in one command rather than manual clicks per lesson.

---

## Open items to resolve before infra wave

1. Does the user's domain registrar support CNAME for `training.launchfiber.com`? (Needed for Railway custom domain.)
2. Confirm Railway plan level — persistent volumes require a paid plan.
3. Source material access: does the office have digital copies of ANSI/TIA-758-C and BICSI OSP-DRD manual that can be fed into content drafting?
4. Moodle admin credentials: pick `MOODLE_USERNAME` / `MOODLE_PASSWORD` before Railway deploy (can't easily change post-install).
5. Confirm `OAUTH2_CLIENT_ID` and `OAUTH2_CLIENT_SECRET` values to use — any strong random strings work, just need to be set consistently on both Railway services.

=== OSP MOODLE DISCOVERY END ===
