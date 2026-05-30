# Monday Demo Script

Practical run-through for the Monday demo across 4 flows: admin projects, design→permitting pipeline, timeclock+hours, client portal. Follow top-to-bottom. Recovery steps inline.

---

## Pre-demo checklist (5 min before)

- [ ] Railway deploy is at `main` HEAD. Verify SHA in Railway dashboard matches latest `git log -1 --format=%H` on `main`.
- [ ] Migrations 0046-0061 ran on Railway: `npm run migrate` (idempotent — safe to re-run).
- [ ] `public/photos/vendor/opencv.min.js` + `public/photos/vendor/jscanify.min.js` are deployed (CDN proxy was sandbox-blocked; Carter dropped these in manually).
- [ ] At least 1 client org + 1 EC + 1 project exist in the demo DB. If empty, create one in admin first.
- [ ] Admin login works. Open dev console — no `ReferenceError: <middleware> is not defined` on page load (W188 regression class).
- [ ] Client portal token exists. If not, dispatch a test token: `node scripts/onboard_client.js --name PSC` (or whichever client you're impersonating).
- [ ] Browser: Chrome 120+. Toggle dark mode ready (top-right of app-shell).

---

## Flow 1: Admin Projects + Create Modal (~5 min)

**URL:** `/admin` (after login; lands on Projects tab by default).

**What to show:**

1. Projects tab loads — skeleton placeholders flash, then real data renders (W213). Visual cohesion via app-shell: topbar + sidebar consistent with every other portal.
2. Empty state (if no projects yet): shows "No projects yet" with a clear "+ New Project" CTA. Error state has a Retry button.
3. Click **"+ New Project"** → modal opens with the cascade picker.
4. Walk the cascade: **Client → Program → EC/SA → Job**.
   - Pick client → program dropdown loads.
   - Pick program → if EC exists, SA dropdown loads; if no EC, free-text SA input appears (no-EC mode, W4 fallback).
   - Pick SA → job typeahead lights up.
5. Auto-name fires: `#proj-name` fills with `{SA} — {Job}` unless you type a custom name.
6. Save → entry lands in projects list under the correct Client / Program / SA breadcrumb (Wave 1B).

**Talking points:**
- "Every action audits — `audit_log` retention is 3 years (W210, RUS compliance).”
- "Cascade picker is one shared module (`public/js/project_cascade.js`, W212). Ports to design/permitting/timeclock queued post-demo."
- "EC vs no-EC mode handles both PSC-style engineering contracts and one-off jobs."

**Recovery:**
- Empty list → click "+ New Project" to create one live. Demo proceeds.
- Modal fails to open → hard refresh (Cmd+Shift+R). If still broken, check console for missing destructure.
- Save returns 500 → audit Railway logs; usually a migration ordering issue. Skip to Flow 2.

---

## Flow 2: Design → Permitting Pipeline (~5 min)

**URL:** `/design` for submission, then `/permitting` for the inbox-side.

**What to show:**

1. **Design portal** (`/design`): project list with full skeleton + empty + error state polish (W214). App-shell wraps the whole surface.
2. Open a project → submit a **potential permit** (designer→permitter handoff).
3. Switch to `/permitting` in a second tab. The submission appears in the permitter inbox within ~2 seconds (SSE live updates, no refresh needed).
4. Permitter advances state (e.g., `submitted` → `under_review` → `approved`).
5. State change reflects back in the design portal SSE feed.

**Talking points:**
- "Pipeline is a state machine — every transition validated server-side (W199 canonicalized `accepted` → `approved`, W202B backfilled prod data, W197 added CHECK constraint)."
- "SSE channels are auth-pinned per user — no cross-tenant leaks (Wave 1 HIGH from May)."
- "Every state transition writes to `audit_log` — searchable by actor, project, time range."

**Recovery:**
- SSE doesn't fire → refresh permitting tab; live updates degrade gracefully to poll.
- Submit returns 400 → likely a missing required field. Console will show which.

---

## Flow 3: Timeclock + Hours Rollup (~5 min)

**URL:** `/timeclock`.

**What to show:**

1. **Clock-in cascade**: 3 instances — entry-edit modal, clock-in form, switch-project modal — all use the same Client → Program → SA → Job cascade. Leaves-only filter applied so no rollup folders leak (W7 + leaves_only fix).
2. **Entries list** with empty / skeleton / error states (W215). Refresh button visible.
3. Open the **edit-entry modal** — completed projects ARE visible here (so back-fill works), unlike clock-in where completed projects are hidden.
4. Navigate to **monthly hours rollup view** for an ongoing project. Show the per-staff breakdown.
5. From admin, trigger **"Generate Monthly Invoice"** — one click, idempotent (W205: duplicate clicks return the same invoice, not a duplicate).

**Talking points:**
- "Monthly billing idempotency — partial unique index + 23505 handler means a frazzled admin clicking twice gets the same invoice, not two."
- "Audit log captures every entry, every edit, every monthly bill generation. 3-year retention."
- "Hours roll into invoices through the EC linkage (migration 0023 from earlier)."

**Recovery:**
- Clock-in dropdown shows "Inspection 12x" or other duplicates → that's the rollup leak symptom from May, should be fixed; if it appears, the `leaves_only=true` query param dropped. Check network tab.
- Invoice generation 500s → likely no hours logged that month. Try a different project.

---

## Flow 4: Client Portal (Read-Only, Admin-Impersonation) (~5 min)

**URL:** From admin, click "View as Client" — lands at `/admin/client-impersonation?client_id=<id>`. (Direct client login at `/client` works with a token but impersonation is the demo path.)

**What to show:**

1. **Admin impersonation banner** (W216): warning-tinted strip at the top of the portal with `fa-user-shield` icon — unmissable signal that this is staff-side viewing, not a real client session.
2. **3-column layout**: Design / Permitting / Construction. Each column has a **count badge** (W216) showing the number of items. Skeleton + empty + error states polished.
3. Click **Refresh** button — spinner fires, columns re-fetch. Re-connect toast appears if SSE drops (W73).
4. Click a project tile → detail modal opens, showing status/documents in read-only view.
5. Confirm read-only: no edit buttons, no delete, no upload UI. v1 is view-only.

**Talking points:**
- "Every client API call IDOR-scoped to the client's org (W218 audit GREEN — no cross-org leaks)."
- "v1 is read-only by design — approve/sign/upload land in E3-E5 post-demo."
- "Logo deferred per spec — Carter's call. PSC logo lands when ready."
- "Foundation already on main: tables, middleware, `routes/_client_auth.js`, mig 0047/0049 + 0061 consolidation (W211)."

**Recovery:**
- 401 on portal load → token expired. Re-mint: `node scripts/onboard_client.js --name PSC` (replace name).
- Empty columns → that's the empty state working correctly; create a project in admin to populate.
- Impersonation banner missing → check `/admin/client-impersonation` query param parsed correctly.

---

## Post-demo Q&A bank

**Q: Can clients delete or edit things?**
A: No — v1 is strictly read-only. Approve/sign/upload UI lands in E3-E5 post-demo.

**Q: What does "audit retention" mean? Can I still delete projects?**
A: Yes, projects/invoices/time-entries can be created/edited/deleted normally. Retention is separate — it controls how long `audit_log` *history rows* are kept before archival (NEVER deleted; a DELETE trigger blocks it). Bumped to 3 years (1100 days, W210) for RUS compliance.

**Q: How does the cascade picker work?**
A: Client → Program → EC/SA → Job. When the client has an EC for the selected program, the SA is picked from `ec_service_areas`. When no EC exists, SA is free-text. Module shipped (`public/js/project_cascade.js`, W212); admin/design/permitting/timeclock ports queued for post-demo (W212B/C/D).

**Q: What's next post-demo?**
A: Cascade module ports across remaining portals (W212B-D), Client Portal v1 E3 UI build (approve/sign/upload), splice matrix incremental refactor (lowest priority), ISP course (last priority).

**Q: What about security?**
A: 190+ findings closed across 40+ route files. IDOR scoped, audit-log INSERT wired on previously-untracked routes (W207), monthly billing race-safe (W205), Puppeteer SSRF closed, cookie-only auth, 3-year audit history.

---

## Known limitations to disclose

- **Splice matrix unchanged** — lowest priority per Carter; refactor will be incremental, not pre-demo.
- **ISP course not started** — last priority; sits behind splice.
- **Client portal upload/approve/sign UI deferred** — E3-E5 work post-demo. v1 surface is read-only view.
- **PSC logo not in client portal** — deferred per Carter spec.

---

## If something breaks during the demo

- **Empty state showing** → that's the new UX (skeleton + empty + error states from W213-W216), not a bug. Show the Retry button if there's a real error.
- **401 unauthorized** → token/session expired. For client portal: re-mint with `node scripts/onboard_client.js --name <client>`. For admin: re-login.
- **Boot crash on Railway** → check logs for `ReferenceError: <middleware> is not defined`. That's a destructure miss in `server.js` (W188 lesson, 3-hour outage class). Hotfix path: add the missing name to the destructure list.
- **SSE not firing** → degrades to poll. Refresh the tab; data still loads, just slower.
- **Dark mode looks broken** → all 6 dark-mode tokens shipped (W202A). If a surface looks off, it's a missed sweep — note and continue, fix post-demo.
- **Toast not appearing** → 139 alert() calls were swapped for `AppShell.toast` (W201). Existence-guard fallback to `alert()` is in place; should never silently fail.

---

## Deploy-side reminders (Carter's manual steps)

These are NOT done by me — Carter runs them out-of-band:

1. `npm run migrate` on Railway (0046-0061 sequential, all idempotent).
2. Drop `opencv.min.js` + `jscanify.min.js` into `public/photos/vendor/` (CDN proxy blocked sandbox download).
3. `cd desktop && npm run dist` for the Electron installer (if desktop demo planned).
4. `node scripts/onboard_client.js --name PSC ...` when ready to flip the portal live for a real client.
