# Railway Services — Audit & Cleanup Guide

> Code-derived map of what services this app *expects*, so you can decide what's safe to delete on Railway. **Deletions are irreversible and your call** — cross-check this against your actual Railway service list before removing anything.

## How the deployment works

This is **one repo** that can run as **several Railway services**, each the same code with a different `PORTAL_MODE` env var (`server.js:157`, `portal_module.js`):

| `PORTAL_MODE` value | Serves |
|---|---|
| *(empty / unset)* | **Admin** — and, in launcher mode, every portal by path |
| `design` | Design portal SPA only |
| `permitting` | Permitting portal SPA only |
| `timeclock` | Timeclock SPA only |
| `splice` | Splice matrix tool only |
| `customer` | Customer portal only |

Portal-mode services also route file uploads/PDFs cross-origin to the admin service via `ADMIN_API_BASE` (`server.js:1083`).

## The key finding

The README and `server.js` support **launcher mode**: if you **leave `PORTAL_MODE` unset**, a single service serves *every* portal by path (`/admin.html`, `/design.html`, `/timeclock.html`, etc.). The per-`PORTAL_MODE` services are a backward-compat holdover (`server.js:1071` "PORTAL_MODE BACKWARD-COMPAT").

**So the per-portal services are very likely redundant.** You can almost certainly collapse to:

- **1 app service** (no `PORTAL_MODE` set) — serves all portals
- **1 Postgres** database service

…and delete the separate `design` / `permitting` / `timeclock` / `splice` / `customer` services. With one service, `ADMIN_API_BASE` cross-routing also becomes unnecessary (everything is same-origin).

## Likely-dead service

Training used to run on **Moodle** (separate service + `oauth2` bridge). That's been replaced by the in-repo SPA at `/training/`. If a **Moodle** (and/or `oauth2`) service still exists on Railway, it's almost certainly dead weight — confirm nothing points at it, then delete.

## Before deleting — two cautions

1. **URLs change.** If anyone (a coworker, a customer) has bookmarked a *per-portal* service URL, collapsing to one service changes which domain serves them. The launcher serves all portals on the one domain by path, so links just need updating to the main domain.
2. **Keep the DB.** Never delete the Postgres service. (Phase 0 includes setting up automated backups before any data work.)

## Confirmed inventory (from Railway dashboard, 2026-06-22)

| Service | What it is | Verdict |
|---|---|---|
| **Launch-Database** — `launchfiberadminportal.xyz` (+ `launch-database-volume`) | Main/admin app + uploads volume | **KEEP** → becomes the single all-portals service (launcher mode) |
| **Postgres** — `postgres-volume-yb3N` | Database | **KEEP** — never delete |
| **Design Portal** — `launchfiberdesignportal.xyz` | Same app, `PORTAL_MODE=design` | **DELETE** (redundant) |
| **Permitting Portal** — `launchfiberpermittingportal.xyz` | Same app, `PORTAL_MODE=permitting` | **DELETE** (redundant) |
| **Timeclock** — `launchfibertimeclock.xyz` | Same app, `PORTAL_MODE=timeclock` | **DELETE** (redundant) |
| **Splice Matrix** — `launchfiber-splicematrix.xyz` | Same app, `PORTAL_MODE=splice` | **DELETE** (redundant) |
| **Client Portal** — (no custom domain) | Same app, `PORTAL_MODE=customer` | **DELETE** (redundant) |

No Moodle/oauth2 service exists (already gone). Only Launch-Database + Postgres have volumes, so deleting the 5 portal services loses **zero data**.

## Safe deletion sequence (Carter executes — Railway has no API access here)

1. **Launch-Database → Variables:** confirm `PORTAL_MODE` is unset/empty (launcher mode).
2. **Verify** each portal loads by path on the main domain (login required): `launchfiberadminportal.xyz/design.html`, `/permitting.html`, `/timeclock.html`, `/splice.html`, `/customer.html`.
3. **Decide domains:** simplest is to drop the per-portal domains and use path-based URLs on the main domain. (Optional later: add Host-based routing so the dedicated domains can point at the one service — small code change.)
4. **Delete** the 5 redundant services: Design Portal, Permitting Portal, Timeclock, Splice Matrix, Client Portal. **Keep** Launch-Database + Postgres.
5. **Notify** any users of the new path-based URLs.

Result: 7 services → 2 (one app + one DB). Fewer rebuilds per push, lower bill, same-origin uploads (no `ADMIN_API_BASE` needed).

**Status (2026-06-22):** Done — the 5 portal services were deleted, app verified working on the single `Launch-Database` service.

## When the main URL changes (planned, later)

The main domain (`launchfiberadminportal.xyz`) will change. When it does, update:
- **`ALLOWED_ORIGINS`** env var on the app service (CORS allowlist).
- The **custom domain** binding on the Railway service.
- Grep the repo for the old domain in case anything is hardcoded (should be env-driven — verify, don't assume).

No code change expected if everything stays env-driven.
