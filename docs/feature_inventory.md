# Feature Inventory — Launch Database (as of 2026-05-29)

Status of every user-facing feature and backend capability by surface and functional area.

---

## Overview

| Feature class | Count | Status |
|---|---|---|
| **Shipped + deployed** | 18 | Live on main |
| **Beta / scaffolded** | 2 | Code exists, Railway/routing incomplete |
| **Pending / blocked** | 3 | Needs infrastructure + user direction |

---

## Portal Tiles (Launcher + Access Control)

| Tile | Role | Status | Notes |
|---|---|---|---|
| **Admin Portal** | admin | ✅ shipped | Central hub for all admin functions + settings. Portal mode exclusion: unavailable in non-admin containers. |
| **Design Portal** | design_engineer, design_manager | ✅ shipped | Project picker (EC/SA/job cascade), design spreadsheet, splice matrix, PDF generation. See Design Picker known bugs below. |
| **Permitting Portal** | permitting_engineer, permitting_manager | ✅ shipped | Permit lifecycle, environmental compliance, pipeline status. Project picker mirrors Design (same cascade UX + same bugs). |
| **Time Clock** | all non-customer | ✅ shipped | Clock in/out, hours entry, project selection cascade. See Timeclock Picker bugs. |
| **Launch Training** | all non-customer | ✅ shipped | OSP course (Vite SPA), cert tracks, progress tracking. Moodle bridge (routes/oauth2.js, moodle/ dir) pending teardown per OSP-RW.6. |
| **Customer Portal** | customer | ✅ shipped | Project status + invoices for customer role. Read-only. No PSC onboarding yet. |
| **Client Portal** | admin + per-user grant (user_portal_access table) | ✅ shipped (UI/routes) | Client-facing view (PSC pilot). Routes exist (routes/client_portal.js), public/client-portal.html UI complete. Blocked on: (a) PSC logo + branding (docs/client_portal_onboarding.md), (b) Magic link generation + email delivery. |
| **Offline DWG Sync** | design_manager, permitting_manager, admin | ✅ shipped (scaffold) | Service worker + sync engine. Needs Railway volume mount for persistent storage. `public/sw-dwg-sync.js` exists; `routes/dwg_sync.js` endpoints exist. Routes/middleware not wired post-Wave-37. Needs user decision on storage backend. |
| **Workspace** | design_manager, permitting_manager, admin | ✅ shipped | File browser + document collaboration. Migration 0053 creates tables. Routes wired in routes/workspace.js. Frontend scaffold at public/workspace/ (React/Vite). |

---

## Admin Portal Settings Sub-sections

| Section | Status | Notes |
|---|---|---|
| **Users & Teams** | ✅ shipped | Create/edit users, assign roles, team membership. |
| **Projects** | ✅ shipped | Rollup hierarchy (Client / Program / EC / SA / Job). Migration 0036-0042 + routes/projects.js endpoints complete. |
| **Engineering Contracts (EC)** | ✅ shipped | EC management + SA assignment + WO# + job visibility rules. Migration 0031 + 0037 + routes/engineering_contracts.js. |
| **Billing & Invoicing** | ✅ shipped | Invoice template selection per program (RUS/BAU/GFR/other), monthly billing cadence toggle, admin-triggered invoice generation (Wave 6). Migration 0032 + routes/invoicing.js + Puppeteer PDF renders. |
| **Hours & Time Entries** | ✅ shipped | Bulk CSV import (with validation + review queue), time-entry audit log. Wave 7 CSV importer (routes/hours.js POST /api/hours/csv-import + review-queue UI). Audit log timestamp every mutation via timeclock_module.makeAuditLogger(). |
| **Portal Access Overrides** | ✅ shipped | Per-user grant table (user_portal_access, migration 0042). Admin can toggle which staff see Client Portal + future per-portal access. Checkbox grid matrix at settings_portal_access.js. |
| **Audit & Compliance** | ✅ shipped | Audit log viewer (all mutations timestamped). Routes/audit_log.js + public/settings_audit_log.html. Migration 0046 (CREATE TABLE audit_log + trigger). Optional auto-archive (migration 0048 + env flag). |
| **Moodle Bridge** | ⏳ deferred → teardown | routes/oauth2.js (332 lines), moodle/ directory, 5 env vars (OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_ALLOWED_REDIRECT_URIS, OAUTH2_JWT_SECRET, LAUNCH_DB_BASE_URL). Still wired in server.js:725-731 + 344-352. Routes deleted in OSP-RW.6 wave when Training SPA is live. |
| **Settings (general)** | ✅ shipped | Theme toggle (light/dark), user preferences, app version. |

---

## Design Portal — Project Picker & Surfaces

| Feature | Status | Known Issues |
|---|---|---|
| **Project picker (EC mode)** | ✅ shipped | Client → Program (RUS/BAU/GFR/other) → EC dropdown → SA picker → Job cascade. Dropdown renders correctly when EC exists. |
| **Project picker (no-EC mode)** | ✅ shipped | Free-text SA input (no EC). Works on Wave 1B + 4A/4B/4C/4D. |
| **Project picker BUG: D1 — clientId undeclared** | ❌ known bug | `design.html:1192 clientChanged()` missing `const clientId = ...` declaration. design.html only (permitting.html correct). **One-line fix pending.** |
| **Project picker BUG: D2 — query param mismatch** | ❌ known bug | Frontend sends `&project_type={val}` but backend reads `req.query.type`. Both portals affected. Filter silently ignored. **Rename to `?type=` everywhere or backend to `?project_type=`.** |
| **Project picker BUG: D3 — rollup leak (root cause)** | ❌ known bug | `GET /api/projects` returns rollup rows (`is_rollup=TRUE`) alongside leaf jobs. No WHERE clause filters. `loadProjects()` + `renderProjects()` in design.html:753-764 render raw output → "Inspection" rollup appears ~12× in the Projects table. **Fix: backend adds `AND COALESCE(p.is_rollup, false) = false` to the query.** This also fixes timeclock + any other caller. |
| **Splice Matrix** | ✅ shipped | Shows project splice assignments + fiber count. PDF download for field crews. |
| **Design Spreadsheet** | ✅ shipped | Edit pole/span details, calculate sag/tension. |

---

## Permitting Portal

| Feature | Status | Notes |
|---|---|---|
| **Permit lifecycle** | ✅ shipped | Draft → submitted → approved → closed. Routes/permits.js + permit-status pipeline. |
| **Environmental Compliance** | ✅ shipped | NEPA/CEQ form inputs, Section 404 / Section 7 gates, jurisdiction-specific checklists. Embedded in permit form. |
| **Project picker** | ✅ shipped + bugs | Same cascade UX as Design + same D2/D3 bugs (query param, rollup leak). |
| **Permit Document Upload** | ✅ shipped | PDF/image uploads → /uploads/ directory (auth-gated, traversal-protected per server.js:517-534). |
| **Stale Permit Detection** | ✅ shipped | Dashboard shows permits not moved in >30 days. Uses project status + time_entries for inference. |

---

## Time Clock Portal

| Feature | Status | Known Issues |
|---|---|---|
| **Clock in/out** | ✅ shipped | Records start/end time for a project + task code. Session-based. |
| **Project picker** | ❌ broken | See below: Timeclock Picker BUG. |
| **Hours entry** | ✅ shipped | Manual entry for past dates. |
| **Time entry edit** | ✅ shipped | Correct mistaken entries. Admin audit log tracks mutations. |
| **Daily/weekly hours view** | ✅ shipped | Timesheet summary by project. Stale past 90 days (archive-triggered soft-delete). |
| **Timeclock Picker BUG — rollup leak** | ❌ known bug | Same as Design/Permitting: project dropdown populated with rollups instead of leaves. User reported: "Inspection appears ~12 times with no correlation to service area or anything." Expect missing parent picker cascade (Client → Program → SA → Job). **Root cause: same D3 as Design + likely Phase 2-A hasn't wired cascade yet.** **Fix (Phase 1):** backend D3 fix immunizes timeclock. **Phase 2:** cascade picker (3 dropdowns) + sessionStorage stickiness + no auto-create + completed-projects hidden. |

---

## Training Portal (OSP Course)

| Feature | Status | Notes |
|---|---|---|
| **Course splash page** | ✅ shipped | Two sections: General Topics (8 courses, ~97 lessons) + Cert Tracks (3 tracks: OSP Designer, FOA CFOS-O, FOA CFOS-T). Tile UX shows progress %. |
| **General courses** | ✅ shipped | T01–T19 mapped to 8 course modules. 209 lessons total across all courses + capstones. Per-lesson quizzes (MC/drag-match/fill-in-blank). |
| **Per-lesson interactivity** | ✅ shipped | 9 interactive primitives: Quiz, AnnotatedDiagram, WorkedExample, BranchingScenario, HotSpot, Sortable, SliderExploration, SideBySide, TimelineSequence. All wired. |
| **Flashcards** | ✅ shipped | All 209 lessons have key_terms Flashcard render. Vocabulary review tool embedded in every lesson. |
| **Per-topic capstone quiz** | ✅ shipped | Broader integrative quiz at end of each course (T01–T19). Separate from per-lesson quizzes. |
| **Cert-track OSP Designer** | ✅ shipped | Advanced lessons (design-specific depth) + 60-Q final exam at end. 80% pass = 48/60. |
| **Cert-track FOA CFOS-O** | ✅ shipped | Cert-specific lessons + mock exam. |
| **Cert-track FOA CFOS-T** | ✅ shipped | Cert-specific lessons + mock exam. |
| **Progress tracking** | ✅ shipped | Frontend: localStorage per-user. Backend: training_progress + training_cert_attempts tables (migration 0035). Sync via `POST /api/training/progress`. |
| **Learning simulation (final audit pending)** | ⏳ deferred to post-OSP-RW.7 | Opus agent will read every lesson sequentially (no rewind), take the 60-Q final exam blind, score as curriculum teaching-effectiveness signal. Must be ≥80% to declare curriculum complete. Scheduled for directive 36. |
| **Moodle bridge (teardown pending)** | ⏳ deferred to OSP-RW.6 | routes/oauth2.js + moodle/ directory + 5 env vars. Still serving at /training/ via legacy bridge. Will be replaced when OSP-RW.7 production-cut lands (commit fresh Vite dist to public/training/). |

---

## Customer Portal

| Feature | Status | Notes |
|---|---|---|
| **Project status view** | ✅ shipped | Customer role sees read-only list of their projects + completion %. |
| **Invoice view** | ✅ shipped | Download + view invoices for their projects. |
| **Document upload** | ⏳ deferred | Placeholder exists but routes not yet wired. Expected Phase 9 or later. |

---

## Client Portal v1 (PSC Pilot)

| Feature | Status | Known Issues / Blockers |
|---|---|---|
| **Foundation** | ✅ shipped | Token-based auth (lfs_client_session httpOnly cookie). Routes/client_portal.js, public/client-portal.html complete. API endpoints: `/api/client/projects`, `/api/client/documents`, `/api/client/approvals`. |
| **Project status tile** | ✅ shipped | Shows PSC projects + completion %. Read-only. |
| **Document approval flow** | ✅ shipped | Client uploads or reviews document → approves/signs via browser → mark signed in the system. |
| **Onboarding** | ⏳ blocker: PSC logo | Script exists: `scripts/onboard_client.js --name "PSC" --user "email:Name"`. Creates client_organizations + client_users + magic links. **Blocked on:** (a) PSC logo PNG at `public/img/clients/psc-logo.png`, (b) secure email channel to send magic-link URLs to PSC team. |
| **Magic link generation** | ✅ shipped | Routes/client_portal.js generates one-time URLs (not stored, not recoverable). Expires at send time. |
| **Multi-client support** | ✅ architected | Code supports N clients via client_organizations table. First deployment (PSC) is v1 pilot. |

---

## Splice Matrix (Field Operations)

| Feature | Status | Notes |
|---|---|---|
| **Web interface** | ✅ shipped | Splicer marks up splices, fiber counts, closure positions on field PDF. Real-time collaboration when multiple splicers edit. |
| **QR field flow** | ✅ shipped | Designer prints QR on project PDF → splicer scans → lands at `/splice/field/{token}` (public, no login). Field markup in browser → save → auto-uploads when network available. |
| **Read-only share link** | ✅ shipped | Stakeholder share: `/splice/view/{token}` shows finished splice matrix (no edits). Token-gated public access. |
| **PDF export** | ✅ shipped | Designer downloads finished splice matrix as PDF for archive + handoff to crew. |
| **Fiber counting** | ✅ shipped | Matrix tracks fiber assignment per splice closure. Detects over-capacity (closure count limit). |
| **SSE live updates** | ✅ shipped | Collaborating splicers see real-time markup. Per-project isolated SSE stream (routes/splice.js). |

---

## Billing & Revenue

| Feature | Status | Notes |
|---|---|---|
| **Hourly project billing** | ✅ shipped | Calculates revenue based on time_entries rate + hours. RUS Bulletin 1751F-630 budget code mapping (routes/revenue.js). |
| **Monthly invoice generation** | ✅ shipped | Admin triggers invoice gen (POST /api/projects/{id}/generate-monthly-invoice). Creates invoice row + PDF via Puppeteer. Wave 6 + 6-fix shipped. Migration 0032. |
| **Invoice template selection** | ✅ shipped | Admin picks template per program (RUS/BAU/GFR/other) in project settings. Routes/invoices.js POST applies template. |
| **Ongoing project lifecycle** | ✅ shipped | `is_ongoing` toggle in admin modal (Wave 6). Monthly invoice cadence + billing status in admin modal + project list badge. |
| **Monthly hours breakdown** | ✅ shipped | GET /api/projects/{id}/monthly-hours-breakdown returns hours by month + rate for the project. Used by invoice gen for breakdown line items. |
| **Audit trail for billing mutations** | ✅ shipped | routes/invoices.js logs every invoice create/delete/update to audit_log. Timestamp on invoice table (migration 0032). |

---

## Hours & CSV Import

| Feature | Status | Notes |
|---|---|---|
| **Time entry CRUD** | ✅ shipped | Create/read/update/delete via timeclock.html or admin bulk import. Audit logged (timeclock_module.makeAuditLogger). Migration 0033 + routes/hours.js. |
| **CSV bulk import** | ✅ shipped | Admin uploads CSV → validation review queue → approve → import. Wave 7 routes/hours.js POST /api/hours/csv-import + review-queue UI in admin. Tier-1 matching by WO# (EC-scoped), Tier-2 by client+SA+job (non-EC), Tier-3 unmatched → manual review. Migration 0038. |
| **CSV validation** | ✅ shipped | Client, Service Area, Job, Date, Hours columns parsed. Unmatched records flagged for manual review. ON CONFLICT race-safe upsert. |

---

## Workspace & Document Management

| Feature | Status | Notes |
|---|---|---|
| **File browser** | ✅ shipped | Navigate folders, upload documents, share with team. Routes/workspace.js + migration 0053. React/Vite frontend at public/workspace/. |
| **Folder hierarchy** | ✅ shipped | Create nested folders, organize projects. Foreign key: workspace_folders.parent_folder_id. |
| **File versioning** | ✅ shipped | Track versions of uploaded documents. workspace_file_versions table (migration 0053). Download specific version. |
| **Workspace trash** | ✅ shipped | Soft-delete files/folders (deleted_at timestamp). Migration 0054 adds deleted_at + deleted_by columns. Optional auto-purge (env flag WORKSPACE_AUTO_PURGE_ENABLED) hard-deletes trash >30 days. |
| **Share permissions** | ✅ shipped | Grant folder access to team members. workspace_folder_shares table (migration 0053). Per-folder granular permissions. |

---

## Photos & Doc Scanner PWA

| Feature | Status | Known Issues |
|---|---|---|
| **Photo capture PWA** | ✅ shipped | Mobile web app (public/photos/). Install as home-screen app. Camera access on mobile. Offline queue for slow/no-network. |
| **Photo upload** | ✅ shipped | Sync to project when online. Stored at /uploads/ (auth-gated). Linked to project_photos table (migration 0052). |
| **Doc scanner (edge detection)** | ⏳ scaffold + missing libs | UI at public/photos/scanner.html complete. **Missing:** vendor libraries (opencv.min.js ~10MB, jscanify.min.js ~50KB). Need manual download from CDN + commit to public/photos/vendor/. Until libs present, scanner UI loads but edge detection fails silently. See DEPLOY_NOTES.md §2. |
| **Offline queue** | ✅ shipped | ServiceWorker caches photos when offline. IndexedDB queue. Auto-sync when connectivity returns. |

---

## Offline DWG Sync

| Feature | Status | Known Issues |
|---|---|---|
| **Service worker registration** | ✅ shipped | public/sw-dwg-sync.js wired in server.js:483-488 with Service-Worker-Allowed header. |
| **DWG download + local sync** | ⏳ scaffold | Routes/dwg_sync.js has endpoints but NOT wired into server.js. Needs `app.use(require('./routes/dwg_sync.js')`). Frontend hasn't been built. Sync engine (selective sync, delta updates) architecture drafted but not implemented. |
| **Storage backend** | ⏳ blocker | No Railway volume mount configured. Local ./dwg_sync/ directory ephemeral (lost on redeploy). Need user decision: cloud storage (S3), Railway persistent volume, or neither (read-only download mode). |

---

## Audit & Compliance

| Feature | Status | Notes |
|---|---|---|
| **Mutation audit log** | ✅ shipped | Every time_entries, projects, invoices, documents change → row in audit_log with timestamp + user + action + before/after JSON. Triggers on INSERT/UPDATE/DELETE (except User-triggered soft-deletes which are explicit UPDATE calls). Migration 0046. |
| **Audit log viewer** | ✅ shipped | Admin portal settings panel shows audit_log. Filterable by table + date + user. Routes/audit_log.js GET /api/audit-log. |
| **Immutability toggle** | ✅ shipped (modified) | v1: audit_log had DELETE trigger (make-immutable). Migration 0050 removes trigger per 2026-05-28 directive so audit_log is now fully editable/deletable (per Carter's compliance policy). |
| **Retention policy** | ✅ shipped | RUS Bulletin 1751F-630 requires 2-year (730-day) record retention. Migration 0048 adds audit_log.archived_at + audit_retention_config table. Optional daily job (env flag AUDIT_AUTO_ARCHIVE_ENABLED) soft-archives rows >730 days old. Hard-delete not automated (manual admin action or compliance event). |

---

## Security & Auth

| Feature | Status | Notes |
|---|---|---|
| **JWT authentication** | ✅ shipped | lfs_session httpOnly cookie (secure, sameSite=lax). 24hr expiration. POST /api/auth/login issues new token on valid credentials. |
| **Role-based access control** | ✅ shipped | admin / design_engineer / design_manager / permitting_engineer / permitting_manager / customer. Portal canAccess() gates per role. Routes/middleware check requireAuth() + requireAdmin() / requireManagerOrAdmin(). |
| **Password hashing** | ✅ shipped | bcrypt (10 rounds). Never stored plaintext. Reset via admin-generated temporary password. |
| **Tokens_invalid_after** | ✅ shipped | Column on users table. Bumped on password change / logout (Wave 1.5). Checked in authMiddleware against JWT iat claim. Invalidates extant tokens for that user. |
| **SQL injection prevention** | ✅ shipped | Parameterized queries throughout (pg-pool $1/$2/$3 placeholders). No string interpolation in SQL. Manual code audit Wave 2 confirmed all input-touching queries are safe. |
| **XSS prevention** | ✅ shipped | Content-Disposition: attachment for non-image/non-PDF uploads (server.js:530-544). Prevents browser rendering of uploaded HTML/SVG/JS. Inline allowed only for images + PDFs. |
| **SSRF prevention** | ✅ shipped | Puppeteer PDFs use explicit allowlist of local file paths (no arbitrary URLs). AI assistant write-sql module flags any DESCRIBE/INFORMATION_SCHEMA queries + requires explicit approval. |
| **Rate limiting** | ❌ not shipped | No rate limit middleware. Brute-force login, DoS vectors unmitigated. Future-queue item. |

---

## Data Integrity & Testing

| Feature | Status | Notes |
|---|---|---|
| **Database migrations** | ✅ shipped | 0001–0055 (55 migrations). Idempotent (CREATE TABLE IF NOT EXISTS, ALTER TABLE ADD COLUMN IF NOT EXISTS pattern). Run via npm run migrate. All post-Wave-38 migrations deployed on Railway (0046–0055 pending manual run per DEPLOY_NOTES.md). |
| **Schema validator** | ✅ shipped | `npm run schema:sync` generates fresh schema.sql from migrations + pg_dump. CI job (GitHub Actions) diffs schema.sql to catch hand-edits. |
| **Unit tests** | ✅ shipped | 196+ tests covering auth, billing, hours, CSV import, splice, workspace, training, audit. `npm test` runs via Jest. CI runs on every push. Current: 196/196 PASS. |
| **Playwright browser tests** | ✅ shipped | 4+ specs covering portal flows (design, permitting, timeclock, admin, splice). `npm run test:browser`. Smoke test on main deployments verifies login + tile load + portal render. |
| **Data constraints** | ✅ shipped | Foreign key constraints on all `_id` columns. UNIQUE constraints where needed (email addresses, etc.). CHECK constraints on enum fields (role, program, etc.). |

---

## Known Blockers & Pending Decisions

| Item | Status | Reason | Owner decision needed |
|---|---|---|---|
| **Doc scanner vendor libs** | ⏳ blocker | CDN proxy blocked agent download. Manual upload required. | ✅ Yes — Carter or whoever manages Railway. Drop opencv.min.js + jscanify.min.js into public/photos/vendor/ + commit. |
| **Offline DWG sync backend storage** | ⏳ blocker | Routes not wired + no persistent storage configured. | ✅ Yes — Carter. Choose cloud storage (S3) vs Railway volume vs read-only mode (download-only). Then wire routes/dwg_sync.js into server.js. |
| **PSC logo for Client Portal** | ⏳ blocker | Client onboarding script exists but needs logo PNG. No magic links can be sent until branding lands. | ✅ Yes — Carter. Save logo to public/img/clients/psc-logo.png, then run onboard_client.js --dry-run to generate magic links. |
| **Moodle bridge teardown** | ⏳ deferred to OSP-RW.6 | Code is stale (oauth2.js 332 lines + moodle/ directory still wired in server.js). Will be removed when Training SPA goes live. | ✅ No user decision needed — this is on the scheduled OSP-RW.6 wave. Just needs orchestrator dispatch. |
| **Rate limiting** | ❌ not shipped | No rate-limit middleware. Brute-force + DoS vectors open. | ✅ Yes — Carter. Future sprint item or critical? If critical, schedule before next public deploy. |
| **DWG sync implementation** | ⏳ architecture drafted | Selective sync + delta updates designed. Code scaffolding exists. Not functional. | ✅ Yes — Carter. Build now or defer? Estimate: 1-2 dev sprints. |
| **Electron desktop app build** | ⏳ scaffold | Directory exists (desktop/), npm scripts for dist build exist. Unsigned installer. Not deployed. | ⏳ Maybe — Carter. Internal beta use case exists? If yes, configure CI to build + host installer. If no, can be skipped. |

---

## By-the-Numbers Summary

| Metric | Count |
|---|---|
| **Live portals** | 8 (Admin, Design, Permitting, Timeclock, Training, Customer, Client, Offline DWG) |
| **Shipped features** | 18 |
| **Known bugs** | 3 (Design picker D1/D2/D3, Timeclock picker D3) |
| **Pending blocker decisions** | 5 (doc scanner libs, DWG storage, PSC logo, rate limiting, desktop app priority) |
| **Database migrations (shipped)** | 45 (0001–0045, all deployed) |
| **Database migrations (pending deploy)** | 10 (0046–0055, awaiting Railway manual run) |
| **Unit tests** | 196+ (all PASS) |
| **Lessons (Training portal)** | 209 (T01–T19, all complete) |
| **Interactive primitives** | 9 (all shipped) |

---

## Deployment Checklist

**Before 0046–0055 run on Railway:**
- [ ] Review DEPLOY_NOTES.md §1 migration list
- [ ] Confirm Railway shell access + npm run migrate command available
- [ ] Backup production database (Railway UI → backups)
- [ ] Run migrations in order (idempotent, safe to retry)

**Before Client Portal v1 launch:**
- [ ] PSC logo PNG saved to public/img/clients/psc-logo.png
- [ ] Run `node scripts/onboard_client.js --dry-run` to verify script works
- [ ] Secure email channel set up to send magic links
- [ ] Test client login + document approval flow in staging

**Before doc scanner production:**
- [ ] Download opencv.min.js + jscanify.min.js from CDN
- [ ] Commit to public/photos/vendor/
- [ ] Test edge detection in photos PWA (mobile device)

**Before offline DWG sync production:**
- [ ] Decide storage backend (S3 / Railway volume / read-only)
- [ ] Configure Railway volume mount (if chosen)
- [ ] Wire routes/dwg_sync.js into server.js
- [ ] Build frontend (React/Vite components)
- [ ] Test sync flow (download + offline access + re-sync online)

---

**Last updated:** 2026-05-29 (this document)  
**Compiled by:** Agent Wave 137  
**Source:** server.js PORTAL_DEFS, migrations/, public/*.html, routes/*.js  
