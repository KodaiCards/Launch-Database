# 19 — Desktop (Electron) — ✅ COMPLETE

> Mapped 2026-06-29. `desktop/` = a Windows-first Electron app, **v0.1.0 internal beta** (early). **Resolves O21: the RUS daily field paperwork is NOT here — the desktop is a web-app shell + file-sync client, no forms.**

## What it is
- **Shell, not a separate app:** `main.js` does `mainWindow.loadURL(serverUrl)` (default `https://launchdb-production.up.railway.app`, overridable via login form / `BACKEND_URL`). So the desktop **renders the live web app** in a BrowserWindow — it is NOT a separate UI. Plus a first-launch login (email/pass + server URL), session via `electron-store` + cookie reads.
- **Sync engine** (`sync/engine.js` + `sync/manifest.js` + `sync/tray.js`): local folder ↔ server file sync (push/pull) with a system-tray status + interval (`syncIntervalMinutes`). Reads the session cookie to auth its API calls. Ties to the server DWG-sync backend (chunk 13 `dwg_sync.js` manifest/ETag/cursors). **Folder sync is still "follow-on / v0.2+"** (README: the engine scaffold exists; full push/pull + conflict-resolution + file-watching are ⏳).
- **Security (good for beta):** context isolation ON, node integration OFF, preload IPC bridge. **Unsigned** (SmartScreen warning; code-signing deferred to v1). Installer via electron-builder (`Launch Fiber Desktop Setup 0.1.0.exe`), served by `routes/downloads.js` (chunk 13).

## ⭐ O21 RESOLVED — RUS daily field paperwork is a CONFIRMED GAP (not built anywhere)
Searched desktop + routes + public for daily-report/inspection-report/field-form/RUS-form: the ONLY hits are **training lesson CONTENT** in `public/training/assets/` (e.g. `L05-staking-notes-rus-form-740`, `L01-inspector-role-and-qa-qc-framework` — lessons *about* RUS forms, not a tool). So:
- The desktop is a webview+sync shell (no forms); inspection.js (chunk 08) is a read rollup (no form generation); nothing else generates daily paperwork.
- **The RUS daily field paperwork — which `project_business_reality` calls THE RUS-exclusive deliverable + a core pain — is genuinely NOT built.** Inspectors do it off-platform today.
- **This is a high-value RUS feature opening.** It's field-facing → ties `feature_mobile_app` (mobile/PWA for field employees) more than the Windows desktop. → keep O21 OPEN as a confirmed gap; promote to a feature idea (I9) when Carter prioritizes RUS field tooling.

## Findings
- **Desktop = shell + sync client, v0.1.0**, mostly a wrapper of the web app + a (still-scaffolding) folder-sync engine. Not where features live; it inherits the web app. Low risk, early.
- **O21 = confirmed gap** (RUS daily paperwork unbuilt) — the clearest greenfield RUS feature. Field-facing → mobile/PWA (feature_mobile_app) is the natural home, not this Windows desktop.
- Unsigned installer (SmartScreen) — fine for internal beta; sign for v1 (noted in README).
- Sync engine reuses the server dwg_sync backend (chunk 13) — the offline-DWG story is: server manifest/ETag/cursors (chunk 13) + this tray client. Coherent but immature.

## Reapproach-if
- If Carter prioritizes the RUS daily-paperwork gap (O21): design it field-first (mobile/PWA per feature_mobile_app), feeding the keystone (service_area_jobs / a new daily_reports table) — NOT the legacy desktop.
- Desktop v0.2 (folder sync) would lean on dwg_sync (chunk 13) + folder_workspace (chunk 13) — cross-check when that wave starts.
- The desktop loads the LIVE web app → it inherits every web finding (cutover, hours, billing). It's not a separate surface to audit.