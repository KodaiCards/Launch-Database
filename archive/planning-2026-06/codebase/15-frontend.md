# 15 — Frontend shared (design system · API client · nav · undo) — ✅ COMPLETE

> Mapped 2026-06-29. The shared client-side foundation every portal/page builds on. **Healthy + modular** — the old monolithic inline scripts were split into per-feature modules (CLEANUP_PLAN Track 1.2). The design system is accessible + theme-aware; the undo infra is wired end-to-end (which makes O14 a small fix).

## `app-shell.js` (664) — `window.AppShell`, the design system
Idempotent global. `AppShell.init({title, portalId, sidebar})` mounts the whole shell. Pieces:
- **Theme** (light/dark): `data-theme` on `<html>` drives CSS vars; source order = `localStorage('lfs-theme')` → `prefers-color-scheme` → light. `toggleTheme` persists to localStorage AND server (`PUT /api/auth/me/theme`); topbar syncs from the user's server preference on load.
- **Topbar** (`mountTopbar`): logo (text fallback on error), title, theme toggle, user chip (from `/api/auth/me` — initials/name/role, dropdown, sign-out → `/api/auth/logout`). `← Launcher` back link (auto-shown off the launcher).
- **Sidebar** (`mountSidebar`): collapsible (localStorage `lfs-sidebar-collapsed`), items with sections/badges/active state, sets `.app-with-sidebar` on the content wrap.
- **Toast**: delegates to `LFS.toast` (toast.js) if present, else built-in; success/error/warning/info, `aria-live` (assertive for errors), auto-dismiss (7s errors / 4s else), optional action button.
- **Modal** (`openModal`/`closeModal`): backdrop, modal STACK, esc-to-close, backdrop-click-close, **focus management** (focuses first focusable), sizes sm/lg/xl/full.
- **Skeleton** (`showSkeleton`/`hideSkeleton`): animated loading placeholders, stashes `_originalHTML`.
- **XSS**: every interpolation runs through `_esc()` (escapes &<>"'). Good hygiene.

## `app-shell.css` (1633) — the token + component layer (mechanics-level)
CSS-variable-driven theming: `:root` light tokens, `[data-theme="dark"]` overrides. Styles topbar/sidebar/toast/modal/skeleton/tables/forms. The single shared stylesheet for the whole app-shell design system. (Not read rule-by-rule — variable-driven, theme via attribute.)

## `api.js` (92) — the shared API client
- `api(path, method, body)` — `fetch` wrapper, `credentials:'include'` (cookie JWT) + **Bearer fallback** from `sessionStorage('lfs_token')` (resilient when cookies are blocked by Cloudflare/browser). **401 → clear token + bounce `/login?next=<path>`.** Non-OK → throw response text.
- `apiUpload(url, formData, {onProgress})` — XHR (not fetch — fetch can't surface upload progress) with the SAME auth; handles 401 + 413 (the "uploading 42/50 MB" UX for big DWG/template uploads, chunk 13).
- `deleteProjectDoc(docId, reload)` — shared confirm+delete+reload for project docs (keeps the design-doc + permit-doc modals from drifting).
- **⚠ CSRF posture (O29, low): no CSRF token.** Auth = cookie + Bearer; protection relies on the `lfs_session` cookie's **SameSite** attribute + the CORS `ALLOWED_ORIGINS` allowlist (chunk 01). If SameSite is Lax/Strict (modern default), cross-site state-changing requests are blocked → acceptable. **Verify SameSite on `lfs_session` (chunk 02 auth)**; if it's `None`, CSRF is a real gap. → open_items O29 (low).

## `undo_bar.js` (78) — the undo UI (end-to-end wired)
Consumes server-issued `undo_token`s. `showUndoBar(message, token, durationSeconds=15)` → bottom bar + live countdown → click posts `/api/undo/:token` → restore + toast + best-effort reload (`loadHours`/`loadProjects`/`loadDashboard`/`loadContractList` if defined). Single bar at a time; force-hidden on load. **The full undo loop works:** backend `saveUndoBucket` → `undo_buckets` (TTL) → `/api/undo/:token` replay → this bar. Used by bulk hours delete, project-tree delete, contract cascade (chunks 06/09).

## `app_nav.js` (168, recap from chunk 05)
The operations-cluster left rail. Role-gated client-side (`data-admin-only` hidden until `/api/auth/me` confirms admin — cosmetic; real gating is server-side). Hosts global search (`/api/search`, 250ms debounce). Links: Dashboard/Projects/Pipelines/Billing/Billing(KS)/Job board/Hours/Import hours/Money/Clients/Invoices/People/Training/Audit/Settings/Admin.

## The per-feature module fleet (pattern note)
`public/js/` has ~40 modules: `*_tab`/`*_view` (hours_tab, money_view, billing_view, inspection_tab, permits_tab, job_board, dashboard_*), `admin_*` (admin_users, admin_project_files/photos, admin_recent_activity), modal/util (dialog, overlay_modal, focus_trap, audit_drawer, change_password_modal, bulk_bill_modal, impersonation_banner), feature settings (jobs_settings, clients_settings, engineering_contracts, construction_contracts, invoice_templates), offline_sync, held_timecards, migration_tools. These are the extracted per-feature scripts (Track 1.2 frontend split: monolithic inline → modules) backing the operations cluster (chunk 05) + admin.html (chunk 16). Deep UI logic deferred (HTML-at-wiring-level strategy); flag specific ones for deep-read on demand.

## Findings
- **Design system is solid + accessible** (AppShell: theme/topbar/sidebar/toast/modal/skeleton, ARIA, focus trap, XSS-escaped). New pages can `AppShell.init()` — good reuse foundation; no rebuild needed.
- **⭐ O14 is a SMALL fix (reinforced):** the undo UI (`undo_bar.js`) + infra (`saveUndoBucket`/`undo_buckets`/`/api/undo/:token`) both exist and work for hours/projects/contracts. Wiring the keystone SA-delete (chunk 03, currently unguarded) to `saveUndoBucket` + `showUndoBar` is a small, pattern-matching change — the safety net is already built.
- **O29 (low): CSRF posture** = no token; relies on SameSite cookie + CORS allowlist. Verify `lfs_session` SameSite (chunk 02). Likely fine (Lax default).
- **Healthy modularization** — frontend split from monolithic inline into per-feature modules + a shared shell/client/undo. The frontend debt is the legacy admin.html (chunk 16), not the shared layer.
- Auth resilience: Bearer fallback for cookie-blocked clients (Cloudflare) is a nice touch; 401-bounce is consistent across api()/apiUpload/SPA hooks (chunk 11).

## Reapproach-if
- Chunk 16 (admin.html): which of these per-feature modules are loaded by admin.html (legacy) vs the operations cluster (chunk 05) — that split = the cutover surface.
- Chunk 02 reapproach: confirm `lfs_session` SameSite (resolves O29).
- O14: when fixing the SA-delete, reuse `saveUndoBucket` + `showUndoBar` (this chunk confirms both exist).
- Deep UI pass (deferred): specific *_tab/*_view modules for the operations-cluster pages (chunk 05 wiring-level → full logic) when Carter wants a UI deep-dive.